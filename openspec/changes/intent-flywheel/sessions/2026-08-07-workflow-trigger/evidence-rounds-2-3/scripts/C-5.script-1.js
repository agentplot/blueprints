export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One bolt-abc construction pass: analyse which tasks are startable, then build each one',
  phases: [
    { title: 'Analyse', detail: 'query openspec for bolt-abc tasks, work out which are startable' },
    { title: 'Build', detail: 'one agent per startable task, each writes out/<task-id>.txt' },
  ],
}

const READINESS = {
  type: 'object',
  properties: {
    startable: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['id', 'description', 'reason'],
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
          waitsOn: { type: 'string' },
        },
        required: ['id', 'description', 'waitsOn'],
        additionalProperties: false,
      },
    },
  },
  required: ['startable', 'waiting'],
  additionalProperties: false,
}

phase('Analyse')
const readiness = await agent(
  `Run this exact command with /private/tmp/wfprobe/runs/C-5 as the working directory:

    openspec instructions apply --change bolt-abc --json

It returns JSON containing a \`tasks\` array of {id, description, done} entries.

Consider ONLY the tasks where done === false. Nothing in the data declares
dependencies between tasks - you must work them out by READING the descriptions
and noticing where one task's description refers to work that another task in
the list performs.

Split the not-done tasks into exactly two groups:
- startable: can be STARTED NOW because nothing it needs is still outstanding.
  Give a one-line reason for each.
- waiting: must wait on another not-done task. Name which task id it waits on
  and why.

A task that another task depends on is itself startable if nothing blocks it.
Every not-done task must appear in exactly one group. Do not modify any files.`,
  { label: 'analyse:readiness', schema: READINESS }
)

log(`startable: ${readiness.startable.map(t => t.id).join(', ') || 'none'} | waiting: ${readiness.waiting.map(t => t.id).join(', ') || 'none'}`)

phase('Build')
const built = await parallel(readiness.startable.map(t => () =>
  agent(
    `You are the build agent for bolt-abc task ${t.id}: "${t.description}".

Write the file /private/tmp/wfprobe/runs/C-5/out/${t.id}.txt so that it contains
exactly this one line:

built ${t.id}

Touch no other file. Then return the task id "${t.id}" as your entire final
output - nothing else.`,
    { label: `build:${t.id}`, phase: 'Build' }
  ).then(r => (r === null ? null : t.id))
))

return {
  built: built.filter(Boolean),
  startable: readiness.startable,
  waiting: readiness.waiting,
}
