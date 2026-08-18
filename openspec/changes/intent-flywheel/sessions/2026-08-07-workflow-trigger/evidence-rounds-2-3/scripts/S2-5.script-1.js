export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass for change bolt-abc: analyse task readiness, then build startable tasks',
  phases: [
    { title: 'Analyse', detail: 'query openspec tasks and classify startable vs waiting' },
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
          reason: { type: 'string', description: 'one line: why it can start now' },
        },
        required: ['id', 'reason'],
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
          waitsOn: { type: 'array', items: { type: 'string' }, description: 'task ids it depends on' },
          reason: { type: 'string', description: 'one line: why it must wait' },
        },
        required: ['id', 'waitsOn', 'reason'],
        additionalProperties: false,
      },
    },
    alreadyDone: { type: 'array', items: { type: 'string' } },
  },
  required: ['startable', 'waiting', 'alreadyDone'],
  additionalProperties: false,
}

phase('Analyse')

const analysis = await agent(
  `You are the analysis agent for the construction loop of OpenSpec change \`bolt-abc\`.

Run exactly this command in the working directory:

    openspec instructions apply --change bolt-abc --json

Parse its JSON output and read the \`tasks\` array. Each entry is \`{id, description, done}\`.

Your job: decide, PURELY by reading the task descriptions, which not-done tasks
can be STARTED NOW and which must WAIT on another task in that same list.
Nothing in the data declares dependencies - you must infer them from the wording
of the descriptions (e.g. a task that consumes, extends, wires up, tests, or
documents the output of another task must wait for it; a task that creates
something from nothing can start now).

Rules:
- Only consider tasks with done == false.
- A task waits ONLY if it depends on another NOT-DONE task. If everything it
  depends on is already done, it is startable.
- waitsOn must contain task ids from the same list.
- Give a single short line of reasoning for each classification.

Return the structured result. Do not write any files.`,
  { label: 'analyse:bolt-abc', phase: 'Analyse', schema: ANALYSIS_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent failed', built: [], waiting: [] }
}

log(`analysis: ${analysis.startable.length} startable, ${analysis.waiting.length} waiting, ${analysis.alreadyDone.length} already done`)

if (analysis.startable.length === 0) {
  log('nothing startable this pass')
  return {
    built: [],
    startable: [],
    waiting: analysis.waiting,
    alreadyDone: analysis.alreadyDone,
  }
}

phase('Build')

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'the task id handled' },
    wrote: { type: 'string', description: 'path of the file written' },
  },
  required: ['id', 'wrote'],
  additionalProperties: false,
}

const built = await parallel(
  analysis.startable.map((t) => () =>
    agent(
      `You are a build agent for OpenSpec change \`bolt-abc\`, handling exactly one task.

Task id: ${t.id}
Task description: ${t.description || '(see change tasks)'}

Do exactly this:
1. Ensure the directory \`out/\` exists in the working directory (create it if missing).
2. Write the file \`out/${t.id}.txt\` containing exactly this single line:

built ${t.id}

3. Nothing else. Do not modify any other file, do not run openspec commands.

Return the task id you handled and the path you wrote.`,
      { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  )
)

const ok = built.filter(Boolean)
const failed = analysis.startable
  .filter((t) => !ok.some((b) => b.id === t.id))
  .map((t) => t.id)

if (failed.length) log(`build agents did not confirm: ${failed.join(', ')}`)

return {
  built: ok.map((b) => b.id),
  buildFailed: failed,
  startable: analysis.startable,
  waiting: analysis.waiting,
  alreadyDone: analysis.alreadyDone,
}
