export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass for openspec change bolt-abc: analyse task readiness, then build startable tasks',
  phases: [
    { title: 'Analyse', detail: 'query openspec tasks and decide what can start now' },
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
        required: ['id', 'reason'],
        properties: {
          id: { type: 'string', description: 'task id' },
          reason: { type: 'string', description: 'one line: why it can start now' },
        },
      },
    },
    waiting: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'waitsOn'],
        properties: {
          id: { type: 'string', description: 'task id' },
          waitsOn: { type: 'string', description: 'which task id(s) it waits on and why' },
        },
      },
    },
  },
}

phase('Analyse')

const analysis = await agent(
  `You are the analysis step of a construction pass for the OpenSpec change \`bolt-abc\`.

Steps:
1. Run exactly this command in the working directory:
   openspec instructions apply --change bolt-abc --json
2. Parse the JSON. It contains a \`tasks\` array whose entries are objects of the form {id, description, done}.
3. Consider ONLY the tasks where done is false (or falsy). Ignore tasks already done.
4. Read the natural-language \`description\` of each not-done task and work out the dependency
   relationships between them. NOTHING in the data declares these relationships - you must infer
   them from what the descriptions say. A task must WAIT if its description implies it consumes,
   extends, verifies, integrates, documents, or otherwise builds on the output of another
   not-done task in the list. A task is STARTABLE NOW if everything it needs is either already
   done or does not come from another not-done task.
5. Treat a task as startable if its prerequisites are all in the DONE set - being listed after
   another task is not itself a dependency.

Return:
- startable: every not-done task that can be started right now, each with a one-line reason.
- waiting: every other not-done task, each with which task id(s) it waits on and why.

Every not-done task id must appear in exactly one of the two lists. Do not modify any files.`,
  { label: 'analyse:bolt-abc', phase: 'Analyse', schema: ANALYSIS_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent failed', startable: [], waiting: [], built: [] }
}

const startable = (analysis.startable || []).filter(t => t && t.id)
const waiting = analysis.waiting || []

log(`Analyse: ${startable.length} startable, ${waiting.length} waiting`)

if (startable.length === 0) {
  log('Nothing startable this pass - skipping build phase')
  return { startable: [], waiting, built: [], failed: [] }
}

phase('Build')

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'wrotePath'],
  properties: {
    id: { type: 'string', description: 'the task id this agent handled' },
    wrotePath: { type: 'string', description: 'path of the file written' },
  },
}

const built = await parallel(
  startable.map(t => () =>
    agent(
      `You are building task \`${t.id}\` of the OpenSpec change \`bolt-abc\`.

Why it is startable: ${t.reason}

Do exactly this and nothing more:
1. Ensure the directory \`out\` exists in the working directory (create it if missing).
2. Write the file \`out/${t.id}.txt\` whose entire contents is the single line:
built ${t.id}
3. Return the id you handled ("${t.id}") and the path you wrote.

Do not touch any other file. Do not modify the openspec change files.`,
      { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  )
)

const ok = built.filter(Boolean)
const okIds = new Set(ok.map(b => b.id))
const failed = startable.filter(t => !okIds.has(t.id)).map(t => t.id)

if (failed.length) log(`Build failures: ${failed.join(', ')}`)

return {
  startable: startable.map(t => ({ id: t.id, reason: t.reason })),
  waiting,
  built: ok.map(b => ({ id: b.id, path: b.wrotePath })),
  failed,
}
