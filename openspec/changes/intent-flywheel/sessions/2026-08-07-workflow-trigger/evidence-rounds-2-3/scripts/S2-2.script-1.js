export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass for openspec change bolt-abc: analyse task readiness, then build each startable task',
  phases: [
    { title: 'Analyse', detail: 'query openspec tasks and decide what is startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task writes out/<task-id>.txt' },
  ],
}

const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['startable', 'waiting'],
  properties: {
    startable: {
      type: 'array',
      description: 'Not-done tasks that can be started right now',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'description', 'reason'],
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          reason: { type: 'string', description: 'One line: why this can start now' },
        },
      },
    },
    waiting: {
      type: 'array',
      description: 'Not-done tasks that must wait on another task in the list',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'description', 'waitsOn', 'reason'],
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'array', items: { type: 'string' }, description: 'Task ids it depends on' },
          reason: { type: 'string', description: 'One line: why it must wait' },
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
    id: { type: 'string', description: 'The task id handled' },
    wrote: { type: 'string', description: 'Path of the file written' },
  },
}

phase('Analyse')

const analysis = await agent(
  `You are the analysis step of a construction pass for the openspec change \`bolt-abc\`.

Working directory: /private/tmp/wfprobe/runs/S2-2

1. Run exactly this command and read its JSON output:
   openspec instructions apply --change bolt-abc --json
2. Read the \`tasks\` array. Each entry is {id, description, done}.
3. Ignore tasks where done is true.
4. For the remaining not-done tasks, decide PURELY BY READING THE DESCRIPTIONS which
   ones can be STARTED NOW and which must WAIT on another task in that same list.
   Nothing in the data declares these relationships - inferring them from the wording
   of the descriptions is your job. A task waits if its description implies it consumes,
   extends, verifies, wires up, documents, or otherwise builds on the output of another
   not-done task. If a task's prerequisites are all already done (or it has none), it is startable.

Return the startable tasks (id, description, and a ONE-LINE reason each) and the waiting
tasks (id, description, the ids they wait on, and a one-line reason each).
Do not write any files. Do not build anything.`,
  { label: 'analyse:bolt-abc', phase: 'Analyse', schema: ANALYSIS_SCHEMA },
)

if (!analysis) {
  return { error: 'analysis agent failed; no tasks built this pass' }
}

log(`Analyse: ${analysis.startable.length} startable, ${analysis.waiting.length} waiting`)

if (analysis.startable.length === 0) {
  return { startable: [], built: [], waiting: analysis.waiting, note: 'nothing startable this pass' }
}

phase('Build')

const built = await parallel(
  analysis.startable.map((t) => () =>
    agent(
      `You are building one task of the openspec change \`bolt-abc\`.

Working directory: /private/tmp/wfprobe/runs/S2-2

Task id: ${t.id}
Task description: ${t.description}

Do exactly this and nothing more:
1. Ensure the directory /private/tmp/wfprobe/runs/S2-2/out exists (mkdir -p).
2. Write the file /private/tmp/wfprobe/runs/S2-2/out/${t.id}.txt whose entire contents
   are the single line:
built ${t.id}
3. Return the task id you handled and the path you wrote.

Do not touch any other file. Do not modify any other task's output.`,
      { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA },
    ),
  ),
)

const ok = built.filter(Boolean)
const failed = analysis.startable
  .filter((t) => !ok.some((b) => b.id === t.id))
  .map((t) => t.id)

if (failed.length) log(`Build failures: ${failed.join(', ')}`)

return {
  startable: analysis.startable,
  built: ok,
  failed,
  waiting: analysis.waiting,
}
