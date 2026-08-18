export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass for openspec change bolt-abc: analyse task readiness, then build each startable task',
  phases: [
    { title: 'Analyse', detail: 'query openspec tasks and split into startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<task-id>.txt' },
  ],
}

const ANALYSE_SCHEMA = {
  type: 'object',
  properties: {
    startable: {
      type: 'array',
      description: 'Not-done tasks that can be STARTED NOW',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          reason: { type: 'string', description: 'one line: why it can start now' },
        },
        required: ['id', 'reason'],
        additionalProperties: false,
      },
    },
    waiting: {
      type: 'array',
      description: 'Not-done tasks that must wait on another task in the list',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          waitsOn: { type: 'string', description: 'which task id(s) it waits on, and why' },
        },
        required: ['id', 'waitsOn'],
        additionalProperties: false,
      },
    },
    alreadyDone: {
      type: 'array',
      description: 'ids of tasks already marked done',
      items: { type: 'string' },
    },
  },
  required: ['startable', 'waiting', 'alreadyDone'],
  additionalProperties: false,
}

phase('Analyse')

const analysis = await agent(
  `Run this command in the working directory and read its output:

    openspec instructions apply --change bolt-abc --json

The JSON it returns has a \`tasks\` array; each entry is {id, description, done}.

Your job: for the tasks where done is false, decide from the DESCRIPTIONS ALONE
which ones can be STARTED NOW and which must WAIT on another task in that same
list. Nothing in the data declares these dependencies - you must infer them by
reading what each description actually says it does and what it presupposes.
A task waits only if it genuinely depends on the output/completion of another
not-done task in the list. If a task's prerequisites are already done (or it has
none), it is startable.

Return:
- startable: each with its id and a ONE-LINE reason it can start now
- waiting: each with its id and what it waits on
- alreadyDone: ids of tasks whose done is already true

Do not modify any files. Analysis only.`,
  { label: 'analyse:bolt-abc', phase: 'Analyse', schema: ANALYSE_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent returned nothing' }
}

log(`startable: ${analysis.startable.length}, waiting: ${analysis.waiting.length}, done: ${analysis.alreadyDone.length}`)

phase('Build')

let built = []
if (analysis.startable.length === 0) {
  log('no startable tasks this pass')
} else {
  const results = await parallel(
    analysis.startable.map((t) => () =>
      agent(
        `You are building task "${t.id}" of openspec change bolt-abc.

Why it is startable: ${t.reason}

Do exactly this:
1. Ensure the directory \`out\` exists in the working directory (create it if needed).
2. Write the file \`out/${t.id}.txt\` containing exactly this single line:

built ${t.id}

Nothing else - no extra files, no other edits.

Return exactly the task id you handled: ${t.id}`,
        { label: `build:${t.id}`, phase: 'Build' }
      ).then((r) => ({ id: t.id, returned: r }))
    )
  )
  built = results.filter(Boolean)
}

return {
  built: built.map((b) => b.id),
  buildFailures: analysis.startable
    .map((t) => t.id)
    .filter((id) => !built.some((b) => b.id === id)),
  waiting: analysis.waiting,
  alreadyDone: analysis.alreadyDone,
  startableReasons: analysis.startable,
}
