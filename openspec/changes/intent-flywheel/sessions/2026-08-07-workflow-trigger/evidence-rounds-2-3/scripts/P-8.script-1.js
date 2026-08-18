export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive the bolt-abc construction loop: analyse task readiness, build startable tasks, repeat until nothing is startable',
  phases: [
    { title: 'Analyse', detail: 're-query openspec each pass and classify tasks as startable or waiting' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
    { title: 'Record', detail: 'tick built tasks in tasks.md so the next pass re-queries fresh state' },
  ],
}

const CHANGE = 'bolt-abc'
const ROOT = '/private/tmp/wfprobe/runs/P-8'
const MAX_PASSES = 6

const ANALYSE_SCHEMA = {
  type: 'object',
  properties: {
    startable: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          reason: { type: 'string', description: 'one line: why this can be started now' },
        },
        required: ['id', 'description', 'reason'],
        additionalProperties: false,
      },
    },
    waiting: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'string', description: 'which task id(s) it waits on and why' },
        },
        required: ['id', 'description', 'waitsOn'],
        additionalProperties: false,
      },
    },
    remainingNotDone: { type: 'number', description: 'count of tasks with done=false in this pass' },
  },
  required: ['startable', 'waiting', 'remainingNotDone'],
  additionalProperties: false,
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    path: { type: 'string' },
    contents: { type: 'string' },
    ok: { type: 'boolean' },
  },
  required: ['id', 'ok'],
  additionalProperties: false,
}

const analysePrompt = (pass) => `You are in the ANALYSE phase (pass ${pass}) of the construction loop for OpenSpec change \`${CHANGE}\`.

Run this command from ${ROOT}:

    openspec instructions apply --change ${CHANGE} --json

Its \`tasks\` array holds one entry per task as {id, description, done}. Re-run it now — do NOT rely on any earlier snapshot; earlier passes may have completed tasks.

Read the task DESCRIPTIONS and work out the dependency relationships yourself. Nothing in the data declares them; inferring them from the wording is the job. A task is STARTABLE if done=false and everything it depends on is already done=true. A task is WAITING if done=false but it depends on a task that is still done=false.

Tasks already done=true belong in neither list.

Return startable ids (with a one-line reason each) and waiting ids (with what each waits on), plus remainingNotDone = the count of done=false tasks you saw.`

const buildPrompt = (t) => `You are in the BUILD phase of the construction loop for OpenSpec change \`${CHANGE}\`.

Build task ${t.id}: ${t.description}

To build it, write the file ${ROOT}/out/${t.id}.txt containing exactly this single line:

    built ${t.id}

Nothing else — no trailing commentary, no extra lines. Do not touch any other file. Then read the file back to confirm, and return {id, path, contents, ok}.`

const recordPrompt = (ids, pass) => `Pass ${pass} of the \`${CHANGE}\` construction loop just built these task ids: ${ids.join(', ')}.

In ${ROOT}/openspec/changes/${CHANGE}/tasks.md, mark exactly those tasks complete by changing their \`- [ ]\` to \`- [x]\`. Task ids are 1-based positions in the task list order as reported by \`openspec instructions apply --change ${CHANGE} --json\` — run that command to map each id to its description, then match the description to the right line in tasks.md.

Change nothing else: no reordering, no rewording, no other checkboxes. Return a one-line confirmation of which lines you ticked.`

const passes = []
let pass = 0

while (pass < MAX_PASSES) {
  pass++

  phase('Analyse')
  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSE_SCHEMA,
  })

  if (!analysis) {
    log(`pass ${pass}: analyse agent failed — stopping loop`)
    passes.push({ pass, error: 'analyse failed' })
    break
  }

  const startable = analysis.startable || []
  const waiting = analysis.waiting || []

  if (startable.length === 0) {
    if (waiting.length > 0) {
      log(`pass ${pass}: nothing startable but ${waiting.length} still waiting — deadlock, stopping`)
      passes.push({ pass, startable: [], waiting, deadlock: true })
    } else {
      log(`pass ${pass}: nothing left to start — all tasks done`)
      passes.push({ pass, startable: [], waiting: [], allDone: true })
    }
    break
  }

  log(`pass ${pass}: ${startable.length} startable (${startable.map(t => t.id).join(', ')}), ${waiting.length} waiting`)

  phase('Build')
  const built = await parallel(startable.map(t => () =>
    agent(buildPrompt(t), { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA })
  ))

  const okIds = built.filter(Boolean).filter(b => b.ok).map(b => b.id)
  const failedIds = startable.map(t => t.id).filter(id => !okIds.includes(id))
  if (failedIds.length) log(`pass ${pass}: build failed for ${failedIds.join(', ')}`)

  if (okIds.length === 0) {
    log(`pass ${pass}: no task built successfully — stopping to avoid spinning`)
    passes.push({ pass, startable, waiting, builtIds: [], failedIds })
    break
  }

  phase('Record')
  const recorded = await agent(recordPrompt(okIds, pass), {
    label: `record:pass-${pass}`,
    phase: 'Record',
  })

  passes.push({
    pass,
    startable,
    waiting,
    builtIds: okIds,
    failedIds,
    recorded: recorded || null,
  })
}

const allBuilt = passes.flatMap(p => p.builtIds || [])
const last = passes[passes.length - 1] || {}

return {
  change: CHANGE,
  passesRun: passes.length,
  builtThisRun: allBuilt,
  stillWaiting: (last.waiting || []).map(w => ({ id: w.id, waitsOn: w.waitsOn })),
  terminatedBecause: last.allDone
    ? 'nothing left to start'
    : last.deadlock
      ? 'startable set empty while tasks still waiting'
      : last.error
        ? last.error
        : passes.length >= MAX_PASSES
          ? 'hit MAX_PASSES safety cap'
          : 'build failure',
  passes,
}
