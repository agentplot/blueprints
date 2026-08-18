export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass for bolt-abc: analyse task readiness, then build startable tasks in parallel',
  phases: [
    { title: 'Analyse', detail: 'query openspec tasks and infer which are startable now' },
    { title: 'Build', detail: 'one agent per startable task writes out/<id>.txt' },
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
    alreadyDone: { type: 'array', items: { type: 'string' } },
  },
  required: ['startable', 'waiting', 'alreadyDone'],
  additionalProperties: false,
}

phase('Analyse')

const analysis = await agent(
  `Working directory: /private/tmp/wfprobe/runs/S1-8

Run this command and read its JSON output:

    openspec instructions apply --change bolt-abc --json

The \`tasks\` array holds entries shaped {id, description, done}.

Your job: for every task with done === false, decide from the WORDING OF THE
DESCRIPTIONS ALONE whether it can be STARTED NOW, or whether it must wait on
another task in that same list. Nothing in the data declares dependencies —
you must infer them by reading the descriptions and noticing when one task's
description refers to something another task produces.

Rules:
- A task is startable if nothing it needs is produced by another not-done task.
- A task is waiting if its description depends on an artifact/endpoint/component
  that another not-done task in the list is responsible for building.
- Tasks that merely share a repo/kit are NOT dependent on each other — sharing a
  location is not a dependency.
- A dependency on a task that is already done === true does NOT block anything.

Return the startable ids with a one-line reason each, the waiting ids with what
each waits on, and the ids of tasks already done.`,
  { label: 'analyse:bolt-abc', phase: 'Analyse', schema: ANALYSIS_SCHEMA },
)

if (!analysis) {
  return { error: 'analysis agent returned nothing' }
}

log(`startable: ${analysis.startable.map(t => t.id).join(', ') || 'none'} | waiting: ${analysis.waiting.map(t => t.id).join(', ') || 'none'}`)

phase('Build')

const built = await parallel(
  analysis.startable.map(task => () =>
    agent(
      `Working directory: /private/tmp/wfprobe/runs/S1-8

You are building task ${task.id} of change bolt-abc: "${task.description}".

Do exactly this and nothing else:
1. Ensure the directory /private/tmp/wfprobe/runs/S1-8/out exists.
2. Write the file /private/tmp/wfprobe/runs/S1-8/out/${task.id}.txt containing
   exactly this single line:

built ${task.id}

Do not modify any other file. Do not touch out/ files belonging to other task ids.

Return only the task id you handled: ${task.id}`,
      { label: `build:task-${task.id}`, phase: 'Build' },
    ).then(() => task.id),
  ),
)

return {
  built: built.filter(Boolean),
  waiting: analysis.waiting,
  alreadyDone: analysis.alreadyDone,
  startableReasons: analysis.startable,
}
