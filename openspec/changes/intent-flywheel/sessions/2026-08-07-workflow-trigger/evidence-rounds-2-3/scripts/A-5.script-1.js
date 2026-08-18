export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'Analyse bolt-abc tasks for readiness, then build every startable task in parallel',
  phases: [
    { title: 'Analyse', detail: 'query openspec and classify not-done tasks as startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
  ],
}

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
          waitsOn: { type: 'string' },
        },
        required: ['id', 'description', 'waitsOn'],
        additionalProperties: false,
      },
    },
  },
  required: ['startable', 'waiting'],
  additionalProperties: false,
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    file: { type: 'string' },
  },
  required: ['id', 'file'],
  additionalProperties: false,
}

phase('Analyse')

const analysis = await agent(
  `You are the analysis step of the bolt-abc construction loop.

Working directory: /private/tmp/wfprobe/runs/A-5

1. Run this command and read its JSON output:
   openspec instructions apply --change bolt-abc --json

2. Look at the \`tasks\` array. Each entry is {id, description, done}.
   Ignore any task whose \`done\` is true.

3. For each NOT-DONE task, decide from the DESCRIPTION TEXT ALONE whether it
   can be STARTED NOW, or whether it must WAIT on another task in that list.
   Nothing in the data declares these relationships - inferring them from the
   prose is your job. A task waits only if it depends on another task that is
   in the list and is still not done. If the thing it depends on is already
   done (or is not a task in this list at all), it is startable.

Return the startable tasks with a one-line reason each, and the waiting tasks
with what each one waits on (name the blocking task id and component).
Do not write any files. Do not build anything.`,
  { label: 'analyse:bolt-abc', phase: 'Analyse', schema: ANALYSIS_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent returned no result' }
}

log(`analysis: ${analysis.startable.length} startable, ${analysis.waiting.length} waiting`)

phase('Build')

const built = await parallel(
  analysis.startable.map((task) => () =>
    agent(
      `You are a build agent in the bolt-abc construction loop.

Working directory: /private/tmp/wfprobe/runs/A-5

Your task is id "${task.id}": ${task.description}

Do exactly this:
1. Ensure the directory /private/tmp/wfprobe/runs/A-5/out exists.
2. Write the file /private/tmp/wfprobe/runs/A-5/out/${task.id}.txt containing
   exactly the single line:
built ${task.id}
3. Return the task id you handled and the absolute path of the file you wrote.

Do not touch any other file. Do not edit tasks.md.`,
      { label: `build:${task.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  )
)

const builtIds = built.filter(Boolean).map((b) => b.id)

log(`built: ${builtIds.join(', ') || '(none)'}`)

return {
  built: built.filter(Boolean),
  startable: analysis.startable,
  waiting: analysis.waiting,
  failed: analysis.startable.filter((t) => !builtIds.includes(t.id)).map((t) => t.id),
}
