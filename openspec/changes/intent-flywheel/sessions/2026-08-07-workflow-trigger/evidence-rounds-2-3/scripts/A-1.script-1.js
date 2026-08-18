export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Analyse bolt-abc tasks for startability, then build each startable task in parallel',
  phases: [
    { title: 'Analyse', detail: 'query openspec, infer which not-done tasks can start now' },
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
  `You are the analysis step of the bolt-abc construction loop.

Working directory: /private/tmp/wfprobe/runs/A-1

1. Run exactly this command:
   openspec instructions apply --change bolt-abc --json
2. Parse its JSON and read the \`tasks\` array. Each entry is {id, description, done}.
3. Consider ONLY tasks where done === false.
4. Decide, purely by reading the descriptions, which of those not-done tasks
   can be STARTED NOW and which must WAIT on another task in that same list.
   Nothing in the data declares these relationships - you must infer them from
   the wording of the descriptions (e.g. a task that consumes something another
   task produces, or that says it cannot start until something else exists,
   must wait on that task).
   A task waits only if the thing it depends on is itself a not-done task in
   this list. If its dependency is already done, it is startable.

Return startable tasks with a one-line reason each, and waiting tasks with
what they wait on. Do not build anything and do not write any files.`,
  { label: 'analyse:bolt-abc', phase: 'Analyse', schema: ANALYSIS_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent returned nothing' }
}

log(`startable: ${analysis.startable.map(t => t.id).join(', ') || 'none'} | waiting: ${analysis.waiting.map(t => t.id).join(', ') || 'none'}`)

phase('Build')

const built = analysis.startable.length
  ? (await parallel(analysis.startable.map(task => () =>
      agent(
        `You are a build agent in the bolt-abc construction loop.

Working directory: /private/tmp/wfprobe/runs/A-1

Your task is id "${task.id}": ${task.description}

Do exactly this:
1. Ensure the directory /private/tmp/wfprobe/runs/A-1/out exists (mkdir -p).
2. Write the file /private/tmp/wfprobe/runs/A-1/out/${task.id}.txt whose entire
   contents are the single line:
built ${task.id}
3. Do nothing else - do not touch tasks.md, do not build other tasks.

Return only the task id you handled: ${task.id}`,
        { label: `build:${task.id}`, phase: 'Build' }
      ).then(() => task.id)
    ))).filter(Boolean)
  : []

return {
  built,
  startable: analysis.startable,
  waiting: analysis.waiting,
}
