export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive bolt-abc construction: analyse task readiness from openspec, then build startable tasks in parallel',
  phases: [
    { title: 'Analyse', detail: 'query openspec and infer which tasks are startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
  ],
}

const ROOT = '/private/tmp/wfprobe/runs/S1-7'

const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['startable', 'waiting'],
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
          reason: { type: 'string', description: 'one line: why it can start now' },
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
          waitsOn: { type: 'string', description: 'one line: which task id(s) it waits on and why' },
        },
      },
    },
  },
}

const built = []
const passLog = []
let lastWaiting = []

for (let pass = 1; pass <= 4; pass++) {
  phase('Analyse')
  const alreadyBuilt = built.length ? built.join(', ') : '(none yet)'
  const analysis = await agent(
    `You are the analysis step of the bolt-abc construction loop.

Working directory: ${ROOT}

1. Run exactly this command from ${ROOT}:
   openspec instructions apply --change bolt-abc --json
2. Parse its JSON output and read the \`tasks\` array. Each entry is {id, description, done}.
3. Ignore tasks where done is true.
4. For each remaining not-done task, decide from the WORDING OF THE DESCRIPTIONS ALONE
   whether it can be STARTED NOW or must WAIT on another task in that list. Nothing in the
   data declares dependencies - inferring them from the descriptions is your job. A task
   waits only if it genuinely depends on the output of another not-done, not-yet-built task.
   Tasks touching different components are independent even if they share a repo/kit.
5. These task ids have ALREADY BEEN BUILT earlier in this same run: ${alreadyBuilt}.
   Treat any dependency on those ids as SATISFIED. Do NOT list already-built ids in either
   output array - they are finished.

Return startable tasks (id, description, one-line reason) and waiting tasks
(id, description, one-line note on what they wait on). Do not build anything.`,
    { label: `analyse:pass-${pass}`, phase: 'Analyse', schema: ANALYSIS_SCHEMA }
  )

  if (!analysis) {
    log(`pass ${pass}: analysis failed, stopping`)
    break
  }

  const fresh = (analysis.startable || []).filter(t => !built.includes(t.id))
  lastWaiting = analysis.waiting || []

  log(`pass ${pass}: startable=[${fresh.map(t => t.id).join(', ') || 'none'}] waiting=[${lastWaiting.map(t => t.id).join(', ') || 'none'}]`)

  if (!fresh.length) {
    passLog.push({ pass, started: [], waiting: lastWaiting })
    break
  }

  phase('Build')
  const results = await parallel(
    fresh.map(t => () =>
      agent(
        `You are the build step for task ${t.id} of bolt-abc.

Task ${t.id}: ${t.description}

Do exactly this, nothing more:
1. Ensure the directory ${ROOT}/out exists (mkdir -p).
2. Write the file ${ROOT}/out/${t.id}.txt containing the single line:
built ${t.id}
3. Return just the task id you handled: ${t.id}`,
        { label: `build:task-${t.id}`, phase: 'Build' }
      ).then(() => t.id)
    )
  )

  const done = results.filter(Boolean)
  built.push(...done)
  passLog.push({ pass, started: fresh.map(t => ({ id: t.id, reason: t.reason })), waiting: lastWaiting })
}

return { built, stillWaiting: lastWaiting, passes: passLog }
