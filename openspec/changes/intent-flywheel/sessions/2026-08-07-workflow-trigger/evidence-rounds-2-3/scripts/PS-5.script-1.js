export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive the bolt-abc construction loop: analyse startable tasks, build them, repeat until dry',
  phases: [
    { title: 'Analyse', detail: 're-query openspec apply instructions, derive startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
    { title: 'Record', detail: 'mark built tasks complete in tasks.md' },
  ],
}

const ROOT = '/private/tmp/wfprobe/runs/PS-5'
const CHANGE = 'bolt-abc'

const ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    startable: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          reason: { type: 'string', description: 'one line: why it can start now' },
        },
        required: ['id', 'description', 'reason'],
      },
    },
    waiting: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'string', description: 'which task id(s) it waits on, and why' },
        },
        required: ['id', 'description', 'waitsOn'],
      },
    },
    remaining: { type: 'number', description: 'progress.remaining from the CLI output' },
  },
  required: ['startable', 'waiting', 'remaining'],
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    path: { type: 'string' },
    built: { type: 'boolean' },
  },
  required: ['id', 'built'],
}

const analysePrompt = (pass) => `You are phase 1 (Analyse) of pass ${pass} of the construction loop for OpenSpec change \`${CHANGE}\`.

Run exactly this command from ${ROOT}:

    openspec instructions apply --change ${CHANGE} --json

Parse its \`tasks\` array (entries of {id, description, done}) and \`progress.remaining\`.

Consider ONLY tasks with done=false. Nothing in the data declares dependencies between
tasks — you must infer them by reading the descriptions. A task is STARTABLE if nothing
in its description makes it depend on another not-done task in the list. A task is WAITING
if its description says or implies it needs another task in the list that is not yet done.
If the task it depends on is already done=true, it is startable.

Do not write any files. Report the startable ids with a one-line reason each, and the
waiting ids with what each waits on. Set \`remaining\` to progress.remaining.`

const buildPrompt = (t, pass) => `You are phase 2 (Build) of pass ${pass} of the construction loop for OpenSpec change \`${CHANGE}\`.

Build exactly one task:
  id: ${t.id}
  description: ${t.description}

The schema defines "build" as: write the file ${ROOT}/out/${t.id}.txt containing the
single line:

built ${t.id}

Write that file and nothing else. Do NOT edit tasks.md — a later step records completion.
Return the id, the absolute path you wrote, and built=true.`

const recordPrompt = (ids, pass) => `You are phase 3 (Record) of pass ${pass} of the construction loop for OpenSpec change \`${CHANGE}\`.

These task ids were just built: ${ids.join(', ')}.

Open ${ROOT}/openspec/changes/${CHANGE}/tasks.md. The tasks are checkbox list items under
"## Build", in order — task id N is the Nth list item. For each built id above, flip that
item's checkbox from \`- [ ]\` to \`- [x]\`. Change nothing else: no reordering, no rewording,
no other lines touched. Then re-run \`openspec instructions apply --change ${CHANGE} --json\`
from ${ROOT} and return the new progress line as "complete/total".`

const MAX_PASSES = 6
const builtAll = []
const passLog = []
let pass = 0
let lastWaiting = []

while (pass < MAX_PASSES) {
  pass++
  phase('Analyse')
  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSIS_SCHEMA,
  })

  if (!analysis) {
    log(`pass ${pass}: analyse failed, stopping`)
    break
  }

  lastWaiting = analysis.waiting || []
  const startable = analysis.startable || []
  log(`pass ${pass}: ${analysis.remaining} remaining — ${startable.length} startable, ${lastWaiting.length} waiting`)

  if (analysis.remaining === 0 || (startable.length === 0 && lastWaiting.length === 0)) {
    passLog.push({ pass, startable: [], waiting: [], built: [], note: 'nothing remaining — loop done' })
    break
  }

  if (startable.length === 0) {
    passLog.push({
      pass,
      startable: [],
      waiting: lastWaiting,
      built: [],
      note: 'DEADLOCK: tasks remain but none are startable',
    })
    log(`pass ${pass}: deadlock — ${lastWaiting.length} waiting, none startable`)
    break
  }

  // Barrier is deliberate: the next pass re-queries task state, so every build of this
  // pass must land (and be recorded) before that query runs.
  phase('Build')
  const results = (await parallel(
    startable.map((t) => () =>
      agent(buildPrompt(t, pass), { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA })
    )
  )).filter(Boolean)

  const ok = results.filter((r) => r.built).map((r) => r.id)
  const failed = startable.map((t) => t.id).filter((id) => !ok.includes(id))
  if (failed.length) log(`pass ${pass}: build did not confirm for ${failed.join(', ')}`)

  if (ok.length === 0) {
    passLog.push({ pass, startable, waiting: lastWaiting, built: [], note: 'no builds confirmed — stopping' })
    break
  }

  // Single writer for tasks.md — concurrent builders editing the same file would race.
  phase('Record')
  const progress = await agent(recordPrompt(ok, pass), { label: `record:pass-${pass}`, phase: 'Record' })

  builtAll.push(...ok)
  passLog.push({
    pass,
    startable: startable.map((t) => ({ id: t.id, reason: t.reason })),
    waiting: lastWaiting.map((w) => ({ id: w.id, waitsOn: w.waitsOn })),
    built: ok,
    progressAfter: progress,
  })
}

return {
  change: CHANGE,
  passes: pass,
  builtThisRun: builtAll,
  stillWaiting: lastWaiting,
  passLog,
}
