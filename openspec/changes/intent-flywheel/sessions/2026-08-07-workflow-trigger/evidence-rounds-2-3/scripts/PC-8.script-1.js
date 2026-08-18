export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive bolt-abc construction passes: re-query tasks, classify startable vs waiting, build startable ones, repeat until nothing is startable',
  phases: [
    { title: 'Analyse', detail: 're-query openspec instructions apply and classify not-done tasks' },
    { title: 'Build', detail: 'write out/<task-id>.txt for each startable task' },
    { title: 'Record', detail: 'mark this pass built tasks complete in tasks.md' },
  ],
}

const REPO = '/private/tmp/wfprobe/runs/PC-8'
const CHANGE = (args && args.change) || 'bolt-abc'
const MAX_PASSES = 6

const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['startable', 'waiting', 'remainingCount'],
  properties: {
    remainingCount: { type: 'number', description: 'count of tasks with done=false' },
    startable: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'description', 'reason'],
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          reason: { type: 'string', description: 'one line: why this can start now' },
        },
      },
    },
    waiting: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'description', 'waitsOn'],
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'array', items: { type: 'string' }, description: 'task ids this waits on' },
        },
      },
    },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'ok', 'note'],
  properties: {
    id: { type: 'string' },
    ok: { type: 'boolean' },
    note: { type: 'string' },
  },
}

const RECORD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['marked', 'ok'],
  properties: {
    ok: { type: 'boolean' },
    marked: { type: 'array', items: { type: 'string' } },
  },
}

const analysePrompt = (pass) => `You are the ANALYSE phase of construction pass ${pass} for OpenSpec change "${CHANGE}".

Working directory: ${REPO}

Run exactly this and parse its JSON:

  cd ${REPO} && openspec instructions apply --change ${CHANGE} --json

The \`tasks\` array holds one entry per task as {id, description, done}.

Your job: consider ONLY tasks where done=false. Decide which of them can be
STARTED NOW and which must WAIT on another task in the list.

Critical: nothing in the data declares these relationships. You must infer them
by reading the task descriptions in prose. A task that names another task's
output, or states it cannot start until something else exists, is waiting on the
task that produces that thing. Map it to that task's id. A task with no such
prose dependency on an unfinished task is startable now.

A task that waits on something that is ALREADY done (done=true) is startable now
— the dependency is satisfied.

Return every not-done task in exactly one of the two lists, never both, never
neither. remainingCount must equal the number of not-done tasks.
Do not write or modify any file.`

const buildPrompt = (t, pass) => `You are the BUILD phase of construction pass ${pass} for OpenSpec change "${CHANGE}".

Build task id "${t.id}": ${t.description}

The build product for this schema is a single marker file. Do exactly this:

  mkdir -p ${REPO}/out
  printf 'built ${t.id}\\n' > ${REPO}/out/${t.id}.txt

The file must contain the single line: built ${t.id}

Then verify with \`cat ${REPO}/out/${t.id}.txt\` and report what you saw.

Strict scope: touch NOTHING else. Do not edit tasks.md, do not edit any other
file in out/, do not create other files. Another agent records completion.
Set ok=true only if the file exists with exactly that content.`

const recordPrompt = (built, pass) => `You are the RECORD step of construction pass ${pass} for OpenSpec change "${CHANGE}".

File: ${REPO}/openspec/changes/${CHANGE}/tasks.md

It contains a markdown checklist. Mark EXACTLY these tasks complete by changing
their leading \`- [ ]\` to \`- [x]\`, matching each by its description text:

${built.map((b) => `  - (id ${b.id}) ${b.description}`).join('\n')}

Rules:
- Change ONLY the checkbox character on those lines. Do not reword any
  description, do not reorder lines, do not add or remove lines.
- Leave every other task's checkbox exactly as it is.
- If a listed task is already \`- [x]\`, leave it and still report it as marked.

Read the file first, then edit. Afterwards re-read it and report the ids you
actually marked. Set ok=true only if every listed task now reads \`- [x]\`.`

// ---- the loop -------------------------------------------------------------
const builtAll = []
const passLog = []
let lastWaiting = []
let dry = 0
let pass = 0
let stopReason = 'max passes reached'

while (pass < MAX_PASSES) {
  pass++

  phase('Analyse')
  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSIS_SCHEMA,
  })

  if (!analysis) {
    stopReason = `analyse agent failed on pass ${pass}`
    break
  }

  lastWaiting = analysis.waiting || []
  const startable = analysis.startable || []
  log(
    `pass ${pass}: ${analysis.remainingCount} not-done | startable [${startable
      .map((t) => t.id)
      .join(', ')}] | waiting [${lastWaiting.map((t) => t.id).join(', ')}]`
  )

  if (startable.length === 0) {
    if (lastWaiting.length === 0) {
      stopReason = 'all tasks complete'
      break
    }
    // Nothing startable but work remains: a re-query cannot change on its own.
    // Allow one confirming retry, then declare the deadlock rather than spin.
    dry++
    passLog.push({ pass, built: [], waiting: lastWaiting.map((t) => t.id), note: 'nothing startable' })
    if (dry >= 2) {
      stopReason = 'deadlock: remaining tasks all wait on something unbuildable'
      break
    }
    continue
  }
  dry = 0

  phase('Build')
  const results = await parallel(
    startable.map((t) => () =>
      agent(buildPrompt(t, pass), {
        label: `build:${t.id}`,
        phase: 'Build',
        schema: BUILD_SCHEMA,
      })
    )
  )

  const okIds = new Set(
    results.filter(Boolean).filter((r) => r.ok).map((r) => r.id)
  )
  const succeeded = startable.filter((t) => okIds.has(t.id))
  const failed = startable.filter((t) => !okIds.has(t.id))
  if (failed.length) log(`pass ${pass}: build FAILED for [${failed.map((t) => t.id).join(', ')}]`)

  if (succeeded.length === 0) {
    stopReason = `pass ${pass}: every build failed`
    break
  }

  // Serialized on purpose: parallel edits to one tasks.md would clobber.
  phase('Record')
  const rec = await agent(recordPrompt(succeeded, pass), {
    label: `record:pass-${pass}`,
    phase: 'Record',
    schema: RECORD_SCHEMA,
  })

  if (!rec || !rec.ok) {
    stopReason = `pass ${pass}: recording completion into tasks.md failed — halting so the next pass cannot rebuild the same tasks`
    passLog.push({ pass, built: succeeded.map((t) => t.id), waiting: lastWaiting.map((t) => t.id), note: 'record failed' })
    break
  }

  builtAll.push(...succeeded.map((t) => ({ id: t.id, description: t.description, pass })))
  passLog.push({
    pass,
    built: succeeded.map((t) => t.id),
    waiting: lastWaiting.map((t) => t.id),
    note: failed.length ? `build failed for ${failed.map((t) => t.id).join(', ')}` : 'ok',
  })
  log(`pass ${pass}: built [${succeeded.map((t) => t.id).join(', ')}] and recorded`)
}

phase('Analyse')
const final = await agent(
  `Final verification for OpenSpec change "${CHANGE}" in ${REPO}.

Run: cd ${REPO} && openspec instructions apply --change ${CHANGE} --json
Also run: ls -la ${REPO}/out/ && cat ${REPO}/out/*.txt

Report the true current state: which task ids are done=false, and which marker
files exist in out/ with what contents. Report only what the commands show.
Do not modify anything.`,
  { label: 'verify:final', phase: 'Analyse', schema: ANALYSIS_SCHEMA }
)

return {
  change: CHANGE,
  passes: pass,
  stopReason,
  built: builtAll,
  stillWaiting: final ? final.waiting : lastWaiting,
  remainingAfter: final ? final.remainingCount : null,
  passLog,
}
