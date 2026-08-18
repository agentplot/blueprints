export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass for openspec change bolt-abc: analyse task readiness, then build each startable task',
  phases: [
    { title: 'Analyse', detail: 'query openspec for tasks, decide startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<task-id>.txt' },
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
  `Run this shell command in the working directory and read its output:

    openspec instructions apply --change bolt-abc --json

The JSON has a \`tasks\` array; each entry is {id, description, done}.

Your job: for every task where done is false, decide whether it can be STARTED NOW or must WAIT on another task in that same list. NOTHING in the data declares these relationships - you must infer them by reading the descriptions in relation to each other. A task waits only if it depends on work produced by another NOT-DONE task in the list; a dependency on something already done, or on something outside the list, does NOT make it wait.

Skip tasks where done is true entirely - they belong in neither bucket.

Return:
- startable: each with its id, description, and a one-line reason it can start now
- waiting: each with its id, description, and what it waits on (name the blocking task id and why)`,
  { label: 'analyse:bolt-abc', schema: ANALYSIS_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent failed; no build performed' }
}

log(`startable: ${analysis.startable.map(t => t.id).join(', ') || 'none'} | waiting: ${analysis.waiting.map(t => t.id).join(', ') || 'none'}`)

phase('Build')

const built = await parallel(
  analysis.startable.map(task => () =>
    agent(
      `You are building task ${task.id} of openspec change bolt-abc: "${task.description}".

Do exactly this and nothing more:
1. Ensure the directory \`out\` exists in the working directory (create it if needed).
2. Write the file \`out/${task.id}.txt\` containing exactly this single line:

built ${task.id}

3. Return the task id you handled ("${task.id}") and the path of the file you wrote.

Do not modify any other file. Do not run openspec.`,
      { label: `build:${task.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  )
)

return {
  built: built.filter(Boolean),
  buildFailures: analysis.startable
    .filter((t, i) => !built[i])
    .map(t => t.id),
  waiting: analysis.waiting,
}
