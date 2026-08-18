export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass for openspec change bolt-abc: analyse task readiness, then build startable tasks',
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
      description: 'Not-done tasks blocked on another task in the list',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'description', 'waitsOn', 'reason'],
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'array', items: { type: 'string' }, description: 'Task ids it waits on' },
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
  `You are the analysis agent for the construction loop of openspec change \`bolt-abc\`.

Working directory: /private/tmp/wfprobe/runs/S2-1

Step 1. Run exactly this command and read its output:

    openspec instructions apply --change bolt-abc --json

Step 2. Parse the \`tasks\` array from that JSON. Each entry is \`{id, description, done}\`.

Step 3. Ignore tasks where \`done\` is true. For every remaining (not-done) task, decide
purely by READING THE DESCRIPTIONS whether it can be STARTED NOW, or whether it must WAIT
on another not-done task in the same list. Nothing in the data declares these dependencies -
inferring them from the wording of the descriptions is your job. Look for descriptions that
consume, extend, wire up, test, document, or otherwise presuppose the output of another
listed task; those wait. Descriptions that stand on their own are startable.

Return every not-done task in exactly one of the two buckets, with a one-line reason each.
For waiting tasks, list the ids they wait on. Do not invent tasks that are not in the output.
Do not modify any files.`,
  { label: 'analyse:bolt-abc', phase: 'Analyse', schema: ANALYSIS_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent failed; no pass performed' }
}

log(`analysis: ${analysis.startable.length} startable, ${analysis.waiting.length} waiting`)

phase('Build')

const built = await parallel(
  analysis.startable.map((t) => () =>
    agent(
      `You are the build agent for task \`${t.id}\` of openspec change \`bolt-abc\`.

Task description: ${t.description}

Working directory: /private/tmp/wfprobe/runs/S2-1

Do exactly this and nothing else:
1. Ensure the directory /private/tmp/wfprobe/runs/S2-1/out exists (create it if missing).
2. Write the file /private/tmp/wfprobe/runs/S2-1/out/${t.id}.txt whose entire contents are
   the single line:

built ${t.id}

3. Return the task id you handled and the path you wrote.

Do not touch any other file. Do not run openspec commands.`,
      { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  )
)

const builtIds = built.filter(Boolean).map((b) => b.id)
const failed = analysis.startable.filter((t) => !builtIds.includes(t.id)).map((t) => t.id)

return {
  built: builtIds,
  failedToBuild: failed,
  startable: analysis.startable,
  waiting: analysis.waiting,
}
