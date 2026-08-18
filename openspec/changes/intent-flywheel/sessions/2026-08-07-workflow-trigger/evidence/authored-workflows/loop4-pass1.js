export const meta = {
  name: 'loopdemo-apply-demo',
  description: 'Analyse demo change tasks for readiness, then build each startable task',
  phases: [
    { title: 'Analyse', detail: 'query openspec, infer which tasks can start now' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
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

const analysis = await agent(
  `Working directory: /private/tmp/wfprobe/loop4

Run this command and read its JSON output:

    openspec instructions apply --change demo --json

The output has a \`tasks\` array of {id, description, done} entries.

Consider ONLY the tasks where done is false. For each of those, decide from the
task DESCRIPTIONS alone whether it can be STARTED NOW, or whether it must wait on
another not-done task in the same list. Nothing in the data declares these
relationships — infer them by reading the prose of each description carefully
(e.g. a task that consumes something another task produces cannot start until that
other task is done).

Return the startable tasks with a one-line reason each, and the waiting tasks with
a one-line note on exactly which task id they wait on and why. Do not build or
write anything — this is analysis only.`,
  { label: 'analyse:demo-tasks', phase: 'Analyse', schema: ANALYSIS_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent returned no result' }
}

log(`startable: ${analysis.startable.map(t => t.id).join(', ') || 'none'} | waiting: ${analysis.waiting.map(t => t.id).join(', ') || 'none'}`)

phase('Build')

const built = await parallel(
  analysis.startable.map(task => () =>
    agent(
      `Working directory: /private/tmp/wfprobe/loop4

You are building task ${task.id} of the demo change: "${task.description}"

Do exactly this and nothing more: write the file
  /private/tmp/wfprobe/loop4/out/${task.id}.txt
containing the single line:
  built ${task.id}

Then return just the task id you handled: ${task.id}`,
      { label: `build:${task.id}`, phase: 'Build' }
    ).then(() => task.id)
  )
)

return {
  built: built.filter(Boolean),
  startable: analysis.startable,
  waiting: analysis.waiting,
}
