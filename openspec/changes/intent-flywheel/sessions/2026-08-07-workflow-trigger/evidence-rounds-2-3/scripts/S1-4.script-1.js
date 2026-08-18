export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass for change bolt-abc: analyse task readiness, then build startable tasks',
  phases: [
    { title: 'Analyse', detail: 'query openspec tasks and decide which are startable now' },
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
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'reason'],
        properties: {
          id: { type: 'string', description: 'task id that can be started now' },
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
          id: { type: 'string', description: 'task id that must wait' },
          waitsOn: { type: 'string', description: 'one line: which task(s) in the list it waits on and why' },
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
    id: { type: 'string', description: 'the task id handled' },
    wrote: { type: 'string', description: 'path of the file written' },
  },
}

phase('Analyse')

const analysis = await agent(
  `Working directory: /private/tmp/wfprobe/runs/S1-4

Run this command exactly:

    openspec instructions apply --change bolt-abc --json

It returns JSON containing a \`tasks\` array whose entries are {id, description, done}.

Your job: consider ONLY the tasks where done is false. By reading their
\`description\` text, work out which of them can be STARTED NOW and which must
WAIT on another not-done task in that same list. Nothing in the data declares
these relationships - there is no depends_on field, no ordering guarantee.
Infer them from what the descriptions actually say the work is: a task that
consumes, extends, tests, documents, migrates, or wires up the output of
another task must wait for it; a task whose inputs already exist (or that
depends only on already-done tasks) is startable.

Be concrete and conservative:
- A task is startable if nothing it needs is produced by another not-done task.
- A task waits if its description references an artifact, module, schema,
  endpoint, or capability that another not-done task in the list creates.
- Do not invent tasks. Use the exact ids from the JSON.
- Every not-done task must appear in exactly one of the two lists.

Return the startable ids each with a one-line reason, and the waiting ids each
with a one-line statement of what they wait on.`,
  { label: 'analyse:bolt-abc', phase: 'Analyse', schema: ANALYSIS_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent failed', built: [], waiting: [] }
}

log(`startable: ${analysis.startable.length} | waiting: ${analysis.waiting.length}`)

phase('Build')

const built = (await parallel(
  analysis.startable.map((t) => () =>
    agent(
      `Working directory: /private/tmp/wfprobe/runs/S1-4

You are building task \`${t.id}\` of change bolt-abc.
Context: ${t.reason}

Do exactly this, nothing more:
1. Ensure the directory \`out/\` exists under the working directory.
2. Write the file \`out/${t.id}.txt\` containing exactly this single line:

built ${t.id}

Do not modify any other file. Do not run openspec commands.
Return the task id you handled and the path you wrote.`,
      { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  )
)).filter(Boolean)

return {
  built: built.map((b) => b.id),
  builtDetail: built,
  startable: analysis.startable,
  waiting: analysis.waiting,
}
