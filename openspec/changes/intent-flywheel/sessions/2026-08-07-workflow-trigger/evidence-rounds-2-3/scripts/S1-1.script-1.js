export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass for OpenSpec change bolt-abc: analyse task readiness, then build every startable task',
  phases: [
    { title: 'Analyse', detail: 'query openspec tasks and infer which are startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<task-id>.txt' },
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
          reason: { type: 'string', description: 'one line: why this can be started now' },
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
          waitsOn: { type: 'string', description: 'which task id(s) it waits on and why' },
        },
      },
    },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'wrote'],
  properties: {
    id: { type: 'string' },
    wrote: { type: 'string', description: 'path of the file written' },
  },
}

phase('Analyse')

const analysis = await agent(
  `You are the analysis step of a construction pass for the OpenSpec change \`bolt-abc\`.

Run exactly this command in the working directory and read its JSON output:

    openspec instructions apply --change bolt-abc --json

The output has a \`tasks\` array; each entry is \`{id, description, done}\`.

Your job:
1. Ignore any task with \`done: true\` — it is already complete.
2. For every NOT-done task, read the \`description\` carefully and decide whether it can be STARTED NOW or must WAIT on another task in the same list. Nothing in the data declares these relationships — you must infer them from the prose of the descriptions (e.g. a description may say a component calls or depends on something another task builds, or state outright that it cannot start until another task is finished). A task waits only if the thing it depends on is itself a not-done task in this list; if the dependency is already done, the task is startable.
3. Return every not-done task in exactly one of the two buckets, with a one-line reason (startable) or a statement of what it waits on (waiting).

Do not build anything, do not create or edit any files. Analysis only.`,
  { label: 'analyse:bolt-abc', schema: ANALYSIS_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent failed', built: [], waiting: [] }
}

log(`startable: ${analysis.startable.map(t => t.id).join(', ') || 'none'} | waiting: ${analysis.waiting.map(t => t.id).join(', ') || 'none'}`)

if (analysis.startable.length === 0) {
  return { analysis, built: [], note: 'no startable tasks this pass' }
}

phase('Build')

const built = await parallel(
  analysis.startable.map(t => () =>
    agent(
      `You are the build agent for task \`${t.id}\` of the OpenSpec change \`bolt-abc\`.

Task description: ${t.description}

Do exactly this and nothing more:
1. Ensure the \`out\` directory exists in the working directory (create it if missing).
2. Write the file \`out/${t.id}.txt\` whose entire contents are the single line:
   built ${t.id}
3. Return the task id you handled and the path you wrote.

Do not touch any other file. Do not modify any other task's output file.`,
      { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  )
)

return {
  built: built.filter(Boolean),
  failed: analysis.startable.filter((t, i) => !built[i]).map(t => t.id),
  waiting: analysis.waiting,
}
