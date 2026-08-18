export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass for change bolt-abc: analyse task readiness, then build each startable task',
  phases: [
    { title: 'Analyse', detail: 'query openspec tasks and decide what can start now' },
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
          reason: { type: 'string', description: 'one line: why this can be started now' },
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
          waitsOn: { type: 'string', description: 'which task id(s) it waits on and why' },
        },
        required: ['id', 'waitsOn'],
        additionalProperties: false,
      },
    },
    alreadyDone: { type: 'array', items: { type: 'string' } },
  },
  required: ['startable', 'waiting'],
  additionalProperties: false,
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    wrote: { type: 'string', description: 'path of the file written' },
  },
  required: ['id'],
  additionalProperties: false,
}

phase('Analyse')

const analysis = await agent(
  `Run this exact command in the working directory:

  openspec instructions apply --change bolt-abc --json

Parse its JSON output and read the \`tasks\` array. Each entry is {id, description, done}.

Your job: decide, purely by reading the task descriptions, which not-done tasks can be
STARTED NOW and which must WAIT on another task in the list. Nothing in the data declares
these relationships - infer them from the descriptions (e.g. a task that consumes, extends,
tests, documents, or migrates the output of another task must wait on that task; a task that
stands alone or only depends on already-done tasks is startable).

Rules:
- Ignore tasks whose done is true, except list their ids under alreadyDone.
- Every not-done task must appear in exactly one of \`startable\` or \`waiting\`.
- A task waiting only on tasks that are already done is STARTABLE, not waiting.
- Give a one-line reason for each startable task, and for each waiting task name the specific
  task id(s) it waits on and why.
- Do not modify any files. Analysis only.`,
  { label: 'analyse:bolt-abc', phase: 'Analyse', schema: ANALYSIS_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent failed', startable: [], waiting: [], built: [] }
}

log(`analysis: ${analysis.startable.length} startable, ${analysis.waiting.length} waiting`)

if (analysis.startable.length === 0) {
  return { built: [], startable: [], waiting: analysis.waiting, alreadyDone: analysis.alreadyDone || [] }
}

phase('Build')

const built = await parallel(
  analysis.startable.map((t) => () =>
    agent(
      `You are building task \`${t.id}\` of change bolt-abc.
${t.description ? `Task description: ${t.description}\n` : ''}
Do exactly this and nothing more:
1. Ensure the directory \`out\` exists in the working directory (create it if needed).
2. Write the file \`out/${t.id}.txt\` whose entire contents are the single line:
built ${t.id}
3. Return the task id you handled.

Do not touch any other file. Do not run openspec commands.`,
      { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  )
)

const builtIds = built.filter(Boolean).map((b) => b.id)
const failed = analysis.startable.map((t) => t.id).filter((id) => !builtIds.includes(id))

log(`built ${builtIds.length}/${analysis.startable.length} startable tasks`)

return {
  built: builtIds,
  failed,
  startable: analysis.startable,
  waiting: analysis.waiting,
  alreadyDone: analysis.alreadyDone || [],
}
