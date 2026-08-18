export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive bolt-abc\'s loopdemo construction loop: re-query tasks each pass, build what is startable, repeat until dry',
  phases: [
    { title: 'Analyse', detail: 're-run openspec instructions apply and derive startable vs waiting tasks' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
    { title: 'Record', detail: 'single writer marks built tasks complete in tasks.md' },
  ],
}

const CHANGE = 'bolt-abc'
const ROOT = '/private/tmp/wfprobe/runs/PC-6'
const MAX_PASSES = 8

const ANALYSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['startable', 'waiting', 'remaining', 'allDone'],
  properties: {
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
          waitsOn: { type: 'array', items: { type: 'string' }, description: 'task ids this one must follow' },
        },
      },
    },
    remaining: { type: 'integer', description: 'count of not-done tasks reported by the CLI' },
    allDone: { type: 'boolean' },
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
  required: ['marked', 'note'],
  properties: {
    marked: { type: 'array', items: { type: 'string' } },
    note: { type: 'string' },
  },
}

const analysePrompt = (pass) => `You are the ANALYSE phase of pass ${pass} of the construction loop for OpenSpec change \`${CHANGE}\` (schema: loopdemo), rooted at ${ROOT}.

Run exactly this, from ${ROOT}:

    openspec instructions apply --change ${CHANGE} --json

The \`tasks\` array holds one entry per task as {id, description, done}. Re-run the query now — do NOT rely on any earlier pass's answer, and do not read a cached copy.

From the DESCRIPTIONS alone, work out the dependency relationships. Nothing in the data declares them; deriving them is the job. A task is STARTABLE if it is not done and every task its description implies it depends on is already done. A task is WAITING if its description makes it depend on a not-done task — name the ids it waits on.

Return: startable (with a one-line reason each), waiting (with waitsOn ids), remaining (count of not-done tasks), and allDone (true only if every task is done).

Do not build anything. Do not edit any file. Analysis only.`

const buildPrompt = (t, pass) => `You are the BUILD phase of pass ${pass} for OpenSpec change \`${CHANGE}\` (schema: loopdemo), rooted at ${ROOT}.

Build exactly one task: id \`${t.id}\` — ${t.description}

The loopdemo schema defines "build" as: write the file \`${ROOT}/out/${t.id}.txt\` containing the single line:

    built ${t.id}

Create the \`${ROOT}/out/\` directory if it does not exist. Write ONLY that one file.

Hard constraints:
- Do NOT edit tasks.md. A sibling agent may be building another task concurrently and a separate single-writer stage records completion; editing it here would race.
- Do NOT touch any task other than ${t.id}.
- Do not create any other files.

Return {id, ok, note} where ok is true only if the file exists with exactly that content.`

const recordPrompt = (ids, pass) => `You are the RECORD phase of pass ${pass} for OpenSpec change \`${CHANGE}\`, rooted at ${ROOT}. You are the ONLY writer to tasks.md this pass.

These task ids were built successfully: ${ids.join(', ')}

Open ${ROOT}/openspec/changes/${CHANGE}/tasks.md. Task ids are 1-based positional over the checkbox lines in file order (id "1" is the first \`- [ ]\`/\`- [x]\` line, id "2" the second, and so on) — confirm this against \`openspec instructions apply --change ${CHANGE} --json\`, whose \`tasks\` array is in the same order, before editing.

For each built id, flip that task's checkbox from \`- [ ]\` to \`- [x]\`. Change NOTHING else — not the wording, not the ordering, not other lines' checkboxes.

Then re-run \`openspec instructions apply --change ${CHANGE} --json\` and confirm those ids now report done:true.

Return {marked, note}.`

const built = []
const passLog = []
let lastAnalysis = null
let stopReason = 'pass limit reached'
let pass = 0

while (pass < MAX_PASSES) {
  pass++

  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSE_SCHEMA,
  })

  if (!analysis) {
    stopReason = `analyse agent failed on pass ${pass}`
    log(stopReason)
    break
  }
  lastAnalysis = analysis

  if (analysis.allDone) {
    stopReason = 'all tasks done'
    log(`pass ${pass}: all tasks done — loop is dry`)
    break
  }

  if (!analysis.startable.length) {
    stopReason = `deadlock: ${analysis.remaining} task(s) remain, none startable`
    log(`pass ${pass}: ${stopReason}`)
    break
  }

  log(`pass ${pass}: ${analysis.startable.length} startable (${analysis.startable.map(t => t.id).join(', ')}), ${analysis.waiting.length} waiting`)

  // Barrier is deliberate: tasks.md has exactly one writer per pass, and the
  // next pass's re-query must see every build from this pass recorded.
  const results = (await parallel(
    analysis.startable.map(t => () => agent(buildPrompt(t, pass), {
      label: `build:${t.id}`,
      phase: 'Build',
      schema: BUILD_SCHEMA,
      effort: 'low',
    }))
  )).filter(Boolean)

  const okIds = results.filter(r => r.ok).map(r => r.id)
  const failed = results.filter(r => !r.ok).map(r => r.id)
  const missing = analysis.startable.map(t => t.id).filter(id => !results.some(r => r.id === id))
  if (failed.length || missing.length) {
    log(`pass ${pass}: build failures — failed [${failed.join(', ')}] missing-report [${missing.join(', ')}]`)
  }

  if (!okIds.length) {
    stopReason = `pass ${pass} built nothing; halting rather than spinning`
    log(stopReason)
    break
  }

  const record = await agent(recordPrompt(okIds, pass), {
    label: `record:pass-${pass}`,
    phase: 'Record',
    schema: RECORD_SCHEMA,
    effort: 'low',
  })

  const marked = record ? record.marked : []
  if (!record) log(`pass ${pass}: record agent failed — checkboxes may lag the out/ files`)

  built.push(...okIds)
  passLog.push({ pass, startable: analysis.startable.map(t => t.id), builtThisPass: okIds, failed, marked, waiting: analysis.waiting })

  if (!marked.length) {
    stopReason = `pass ${pass} recorded no completions; next pass would re-derive the same set`
    log(stopReason)
    break
  }
}

return {
  change: CHANGE,
  passes: pass,
  stopReason,
  builtTaskIds: built,
  stillWaiting: lastAnalysis ? lastAnalysis.waiting : [],
  remainingAtStop: lastAnalysis ? lastAnalysis.remaining : null,
  passLog,
}
