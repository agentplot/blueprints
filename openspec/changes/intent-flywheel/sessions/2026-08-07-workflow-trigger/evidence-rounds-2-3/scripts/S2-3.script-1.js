export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass for bolt-abc: analyse task readiness, then build every startable task',
  phases: [
    { title: 'Analyse', detail: 'query openspec tasks and decide what can start now' },
    { title: 'Build', detail: 'one agent per startable task writes out/<id>.txt' },
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
          reason: { type: 'string', description: 'one line: why it can start now' },
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
          waitsOn: { type: 'array', items: { type: 'string' }, description: 'task ids it waits on' },
          reason: { type: 'string', description: 'one line: what it waits on and why' },
        },
      },
    },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'file'],
  properties: {
    id: { type: 'string', description: 'the task id handled' },
    file: { type: 'string', description: 'path of the file written' },
  },
}

phase('Analyse')

const analysis = await agent(
  `You are the analysis step of a construction loop for the OpenSpec change \`bolt-abc\`.

Working directory: /private/tmp/wfprobe/runs/S2-3

1. Run exactly this command and read its JSON output:
   openspec instructions apply --change bolt-abc --json
2. Read the \`tasks\` array. Each entry is {id, description, done}.
3. Ignore any task whose \`done\` is true - it is already finished.
4. For every remaining (not-done) task, decide from the task DESCRIPTIONS ALONE
   whether it can be STARTED NOW, or whether it must WAIT on another task in
   that same list. Nothing in the data declares these relationships - the
   descriptions are your only evidence. Read them carefully: a description may
   state outright that it depends on something another task produces, or may
   imply it by consuming something another task builds.
5. A task WAITS only if the thing it depends on is another NOT-DONE task in the
   list. If its dependency is already done, it is startable.

Return the startable tasks (id, description, one-line reason each) and the
waiting tasks (id, description, the ids it waits on, one-line reason each).
Do not build anything. Do not write any files.`,
  { label: 'analyse:bolt-abc', phase: 'Analyse', schema: ANALYSIS_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent failed', built: [], waiting: [] }
}

log(`analysis: ${analysis.startable.length} startable, ${analysis.waiting.length} waiting`)

phase('Build')

let built = []
if (analysis.startable.length === 0) {
  log('nothing startable this pass - skipping build phase')
} else {
  const results = await parallel(
    analysis.startable.map((t) => () =>
      agent(
        `You are the build step for task ${t.id} of OpenSpec change \`bolt-abc\`.

Task ${t.id}: ${t.description}

Working directory: /private/tmp/wfprobe/runs/S2-3

Create the directory /private/tmp/wfprobe/runs/S2-3/out if it does not exist,
then write the file /private/tmp/wfprobe/runs/S2-3/out/${t.id}.txt whose entire
contents are the single line:

built ${t.id}

Write nothing else, touch no other file. Return the task id you handled and the
path of the file you wrote.`,
        { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
      )
    )
  )
  built = results.filter(Boolean)
  const failed = analysis.startable.length - built.length
  if (failed > 0) log(`${failed} build agent(s) failed to report a result`)
}

return {
  built,
  startable: analysis.startable,
  waiting: analysis.waiting,
}
