export const meta = {
  name: 'bolt-abc-construction',
  description: 'Drive the bolt-abc construction loop: analyse task readiness, then fan out one builder per startable task',
  phases: [
    { title: 'Analyse', detail: 'query openspec apply instructions and work out which tasks are startable' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<task-id>.txt' },
  ],
}

const ROOT = '/private/tmp/wfprobe/runs/C-4'

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
          reason: { type: 'string' },
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
          waitsOn: { type: 'string' },
        },
        required: ['id', 'description', 'waitsOn'],
      },
    },
  },
  required: ['startable', 'waiting'],
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    file: { type: 'string' },
  },
  required: ['id', 'file'],
}

const passes = []
const builtSoFar = []

for (let pass = 1; pass <= 3; pass++) {
  phase('Analyse')

  const alreadyBuilt = builtSoFar.length
    ? `\n\nIMPORTANT: earlier passes of this same loop have ALREADY BUILT these task ids: ${builtSoFar.join(', ')}. The tasks.md checklist has not been updated, so the JSON will still report them as done:false — treat them as COMPLETE anyway. Do not list them as startable and do not list them as waiting; anything that was waiting only on them is now startable.`
    : ''

  const analysis = await agent(
    `You are the analyse phase of the bolt-abc construction loop (pass ${pass}).

Run this command from ${ROOT}:

    openspec instructions apply --change bolt-abc --json

Read the \`tasks\` array it returns. Each entry is {id, description, done}.

Ignore any task with done:true — it is already finished.

For the remaining tasks, decide PURELY BY READING THE DESCRIPTIONS which ones can be STARTED NOW and which must WAIT on another task in the list. Nothing in the data declares these relationships; inferring them from the prose is your job. A task waits only if its description implies it depends on another task in this same list actually being built first.${alreadyBuilt}

Return:
- startable: each id, its description, and a one-line reason it can start now
- waiting: each id, its description, and which task id (and why) it waits on

Return only the structured object.`,
    { label: `analyse:pass-${pass}`, phase: 'Analyse', schema: ANALYSIS_SCHEMA },
  )

  if (!analysis) {
    log(`pass ${pass}: analyse agent failed, stopping loop`)
    break
  }

  log(
    `pass ${pass}: startable = [${analysis.startable.map(t => t.id).join(', ') || 'none'}], ` +
    `waiting = [${analysis.waiting.map(t => `${t.id}←${t.waitsOn}`).join('; ') || 'none'}]`,
  )

  if (analysis.startable.length === 0) {
    passes.push({ pass, analysis, built: [] })
    log(`pass ${pass}: nothing startable — loop is done`)
    break
  }

  phase('Build')

  const results = await parallel(
    analysis.startable.map(task => () =>
      agent(
        `You are a builder agent in the bolt-abc construction loop.

Your assigned task is id "${task.id}": ${task.description}

Do exactly this and nothing else:

1. Write the file ${ROOT}/out/${task.id}.txt with exactly this single line of content:

built ${task.id}

2. Return the structured object with id="${task.id}" and file set to the absolute path you wrote.

Do not modify tasks.md, do not touch any other file, and do not write anything else into out/.`,
        { label: `build:${task.id}`, phase: 'Build', schema: BUILD_SCHEMA },
      ),
    ),
  )

  const built = results.filter(Boolean)
  const failed = analysis.startable
    .map(t => t.id)
    .filter(id => !built.some(b => b.id === id))

  if (failed.length) log(`pass ${pass}: builders FAILED for [${failed.join(', ')}]`)

  built.forEach(b => builtSoFar.push(b.id))
  passes.push({
    pass,
    startable: analysis.startable,
    waiting: analysis.waiting,
    built: built.map(b => b.id),
    failed,
  })

  if (analysis.waiting.length === 0) {
    log(`pass ${pass}: nothing left waiting — loop is done`)
    break
  }
}

return {
  builtThisRun: builtSoFar,
  passes,
}
