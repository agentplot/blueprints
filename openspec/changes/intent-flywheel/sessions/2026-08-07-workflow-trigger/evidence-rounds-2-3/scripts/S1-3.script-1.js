export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass for openspec change bolt-abc: analyse task readiness, then build each startable task',
  phases: [
    { title: 'Analyse', detail: 'query openspec tasks and classify startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
  ],
}

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
          waitsOn: { type: 'string', description: 'what it waits on' },
        },
      },
    },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'file'],
  properties: {
    id: { type: 'string' },
    file: { type: 'string', description: 'path of the file written' },
  },
}

phase('Analyse')

const analysis = await agent(
  `Run this exact command in the working directory and read its JSON output:

    openspec instructions apply --change bolt-abc --json

The output has a \`tasks\` array; each entry is {id, description, done}.

Your job: consider ONLY the tasks where done is false. By reading the
descriptions, decide which of those can be STARTED NOW and which must wait on
another task in the list. Nothing in the data declares these relationships —
infer them from the wording of the descriptions (e.g. a task that consumes or
depends on something another task produces cannot start until that task is
built).

Ignore tasks where done is true — they are neither startable nor waiting.

Return the startable task ids with a one-line reason each, and the waiting ones
with what they wait on. Do not build anything, do not write any files.`,
  { label: 'analyse:bolt-abc', schema: ANALYSIS_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent returned no result', built: [], waiting: [] }
}

log(`startable: ${analysis.startable.map(t => t.id).join(', ') || 'none'} | waiting: ${analysis.waiting.map(t => t.id).join(', ') || 'none'}`)

phase('Build')

const built = await parallel(
  analysis.startable.map(task => () =>
    agent(
      `You are building task ${task.id} of openspec change bolt-abc.

Task description: ${task.description}

Do exactly this and nothing more:
1. Ensure the directory \`out\` exists in the working directory (create it if needed).
2. Write the file \`out/${task.id}.txt\` containing exactly the single line:
built ${task.id}
3. Verify the file exists with that content.

Return the task id you handled and the path of the file you wrote.`,
      { label: `build:${task.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  )
)

return {
  built: built.filter(Boolean),
  startable: analysis.startable,
  waiting: analysis.waiting,
}
