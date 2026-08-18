export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass for OpenSpec change bolt-abc: analyse task readiness, then build startable tasks',
  phases: [
    { title: 'Analyse', detail: 'query openspec tasks and decide which are startable vs waiting' },
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
          waitsOn: { type: 'string', description: 'which task id(s) / what it waits on' },
        },
      },
    },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'wrotePath'],
  properties: {
    id: { type: 'string' },
    wrotePath: { type: 'string' },
  },
}

phase('Analyse')

const analysis = await agent(
  `Run this command from the current working directory and read its JSON output:

    openspec instructions apply --change bolt-abc --json

The output has a \`tasks\` array; each entry is {id, description, done}.

Your job: consider ONLY the tasks where done is false. By reading the plain-English
descriptions, work out which of those can be STARTED NOW and which must WAIT on
another not-done task in the same list. Nothing in the JSON declares these
relationships — you must infer them from the wording of the descriptions (e.g. a
description that says it consumes or depends on the output of another task cannot
start until that other task is built).

Rules:
- A task already marked done is neither startable nor waiting — omit it entirely.
- A task waits ONLY if what it depends on is another not-done task in this list.
  If its dependency is already done, it is startable.
- Give a one-line reason for each startable task, and for each waiting task name
  what it waits on.

Do not build anything. Analysis only.`,
  { label: 'analyse:bolt-abc', phase: 'Analyse', schema: ANALYSIS_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent returned no result' }
}

log(`startable: ${analysis.startable.map(t => t.id).join(', ') || 'none'} | waiting: ${analysis.waiting.map(t => t.id).join(', ') || 'none'}`)

phase('Build')

const built = await parallel(
  analysis.startable.map(task => () =>
    agent(
      `You are building one task of OpenSpec change bolt-abc.

Task id: ${task.id}
Task description: ${task.description}

Do exactly this and nothing more:
1. Ensure the directory \`out\` exists in the current working directory (mkdir -p out).
2. Write the file \`out/${task.id}.txt\` whose entire contents are the single line:
built ${task.id}
3. Return the task id you handled and the path you wrote.

Do not modify any other file. Do not touch tasks other than this one.`,
      { label: `build:${task.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  )
)

const succeeded = built.filter(Boolean)
const failedIds = analysis.startable
  .filter((t, i) => !built[i])
  .map(t => t.id)

if (failedIds.length) log(`build failed for: ${failedIds.join(', ')}`)

return {
  built: succeeded.map(b => ({ id: b.id, path: b.wrotePath })),
  buildFailed: failedIds,
  startable: analysis.startable,
  waiting: analysis.waiting,
}
