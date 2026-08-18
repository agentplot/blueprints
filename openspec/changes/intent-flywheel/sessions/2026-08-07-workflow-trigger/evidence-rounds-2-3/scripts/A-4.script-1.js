export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive the bolt-abc construction loop: analyse startable tasks, build them in parallel, repeat until nothing is startable',
  phases: [
    { title: 'Analyse', detail: 'query openspec, infer which not-done tasks are startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
    { title: 'Record', detail: 'check off built tasks in tasks.md so the next pass sees fresh state' },
  ],
}

const REPO = '/private/tmp/wfprobe/runs/A-4'

const ANALYSIS_SCHEMA = {
  type: 'object',
  required: ['startable', 'waiting', 'remainingCount'],
  properties: {
    startable: {
      type: 'array',
      items: {
        type: 'object',
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
        required: ['id', 'description', 'waitsOn'],
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'string', description: 'which task id(s) it waits on and why' },
        },
      },
    },
    remainingCount: { type: 'number', description: 'how many tasks are still not done' },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  required: ['id', 'ok'],
  properties: {
    id: { type: 'string' },
    ok: { type: 'boolean' },
    note: { type: 'string' },
  },
}

const analysePrompt = (pass) => `You are the analyse step of pass ${pass} of the bolt-abc construction loop.

Run this command from ${REPO}:

  openspec instructions apply --change bolt-abc --json

Read the \`tasks\` array in the JSON it returns. Each entry is {id, description, done}.

Your job: for the tasks where done is false, decide from the DESCRIPTIONS ALONE which
can be STARTED NOW and which must WAIT on another task in that same list. Nothing in
the data declares these relationships - you must infer them by reading what each task
says it builds and what it says it needs. A task waits only if it depends on another
NOT-DONE task; if its dependency is already done, it is startable.

Do NOT build anything. Do NOT edit any files. Only report.

Return:
- startable: each with id, description, and a one-line reason it can start now
- waiting: each with id, description, and what it waits on
- remainingCount: total number of not-done tasks

Re-run the command yourself; do not rely on any earlier pass's answer.`

const buildPrompt = (t) => `You are a build agent in the bolt-abc construction loop.

Your task is id "${t.id}": ${t.description}

Do exactly this, from ${REPO}:
1. mkdir -p out
2. Write the file out/${t.id}.txt containing exactly the single line:
built ${t.id}

Do not touch tasks.md, do not touch any other task's output file, and do not do any
other work. Return {id: "${t.id}", ok: true} once the file exists with that content.`

const recordPrompt = (ids) => `You are the record step of the bolt-abc construction loop.

These task ids were just built successfully: ${ids.join(', ')}

In ${REPO}/openspec/changes/bolt-abc/tasks.md, the tasks appear as markdown checkboxes
under "## Build", in id order starting at 1 (the first "- [ ]" or "- [x]" line is task 1,
the second is task 2, and so on).

For EACH id listed above, change that task's checkbox from "- [ ]" to "- [x]".
Change nothing else in the file - not the wording, not the ordering, not other tasks.

Then run \`openspec instructions apply --change bolt-abc --json\` from ${REPO} and confirm
those ids now report done:true. Return a one-line confirmation of which ids you checked off.`

const passes = []
let pass = 0

while (pass < 6) {
  pass++
  phase('Analyse')
  log(`Pass ${pass}: querying openspec for current task state`)
  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass${pass}`,
    phase: 'Analyse',
    schema: ANALYSIS_SCHEMA,
  })

  if (!analysis) {
    log(`Pass ${pass}: analyse agent returned nothing - stopping`)
    break
  }

  const startable = analysis.startable || []
  const waiting = analysis.waiting || []
  log(`Pass ${pass}: ${startable.length} startable, ${waiting.length} waiting, ${analysis.remainingCount} not done`)

  if (startable.length === 0) {
    passes.push({ pass, startable: [], waiting, built: [], remainingCount: analysis.remainingCount })
    if (waiting.length > 0) {
      log(`Pass ${pass}: nothing startable but ${waiting.length} still waiting - loop cannot progress, stopping`)
    } else {
      log(`Pass ${pass}: nothing left to build - loop complete`)
    }
    break
  }

  phase('Build')
  const results = (await parallel(startable.map((t) => () =>
    agent(buildPrompt(t), { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA })
  ))).filter(Boolean)

  const builtIds = results.filter((r) => r.ok).map((r) => r.id)
  const failedIds = startable.map((t) => t.id).filter((id) => !builtIds.includes(id))
  if (failedIds.length) log(`Pass ${pass}: build FAILED for ${failedIds.join(', ')}`)

  passes.push({
    pass,
    startable: startable.map((t) => ({ id: t.id, description: t.description, reason: t.reason })),
    waiting: waiting.map((t) => ({ id: t.id, description: t.description, waitsOn: t.waitsOn })),
    built: builtIds,
    failed: failedIds,
    remainingCount: analysis.remainingCount,
  })

  if (builtIds.length === 0) {
    log(`Pass ${pass}: no task built - stopping to avoid a spin`)
    break
  }

  phase('Record')
  await agent(recordPrompt(builtIds), { label: `record:pass${pass}`, phase: 'Record' })
}

const allBuilt = passes.flatMap((p) => p.built)
const last = passes[passes.length - 1]

return {
  passes,
  builtInOrder: allBuilt,
  stillWaiting: last ? last.waiting : [],
  finalRemainingCount: last ? last.remainingCount : null,
}
