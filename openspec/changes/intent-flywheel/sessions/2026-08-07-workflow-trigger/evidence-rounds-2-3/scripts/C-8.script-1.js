export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass over bolt-abc: analyse task readiness, then build every startable task',
  phases: [
    { title: 'Analyse', detail: 'query openspec for bolt-abc tasks and work out which are startable' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<task-id>.txt' },
  ],
}

const ROOT = '/private/tmp/wfprobe/runs/C-8'

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
        required: ['id', 'description', 'reason'],
        properties: {
          id: { type: 'string', description: 'task id from the openspec tasks array' },
          description: { type: 'string' },
          reason: { type: 'string', description: 'one line on why it can start now' },
        },
      },
    },
    waiting: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'description', 'waitsOn'],
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'string', description: 'which task id(s) it waits on, and why' },
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
    id: { type: 'string', description: 'the task id this agent handled' },
    file: { type: 'string', description: 'absolute path of the file written' },
  },
}

phase('Analyse')

const analysis = await agent(
  `You are the analysis step of the bolt-abc construction loop.

Working directory: ${ROOT}

1. Run exactly this command and read its JSON output:
   cd ${ROOT} && openspec instructions apply --change bolt-abc --json

2. Read the \`tasks\` array. Each entry is {id, description, done}.

3. Ignore tasks where done is true — they are already built.

4. For the not-done tasks, decide from the DESCRIPTIONS ALONE which can be
   STARTED NOW and which must wait on another task in that same list.
   Nothing in the data declares these relationships — inferring them from
   what the descriptions say is your job. A task waits only if its own
   description makes it depend on another not-done task in the list; if the
   thing it depends on is already done, it is startable.

Return the startable task ids with a one-line reason each, and the waiting
ones naming what they wait on.`,
  { label: 'analyse:bolt-abc', phase: 'Analyse', schema: ANALYSIS_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent returned nothing', startable: [], waiting: [], built: [] }
}

log(`startable: ${analysis.startable.map(t => t.id).join(', ') || 'none'} | waiting: ${analysis.waiting.map(t => t.id).join(', ') || 'none'}`)

phase('Build')

const built = await parallel(
  analysis.startable.map(task => () =>
    agent(
      `You are the build agent for bolt-abc task ${task.id}: "${task.description}".

Write the file ${ROOT}/out/${task.id}.txt containing exactly the single line:

built ${task.id}

Create the out/ directory if it does not exist. Do nothing else — no other
files, no edits to tasks.md, no git commands.

Return the task id you handled and the absolute path of the file you wrote.`,
      { label: `build:${task.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  )
)

const ok = built.filter(Boolean)

return {
  startable: analysis.startable,
  waiting: analysis.waiting,
  built: ok,
  buildFailures: analysis.startable.length - ok.length,
}
