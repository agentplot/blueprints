export const meta = {
  name: 'bolt-abc-pass',
  description: 'One construction pass for bolt-abc: analyse which tasks are startable, then fan out one builder per startable task',
  phases: [
    { title: 'Analyse', detail: 'query openspec apply instructions, classify not-done tasks as startable or waiting' },
    { title: 'Build', detail: 'one agent per startable task writes out/<task-id>.txt' },
  ],
}

const REPO = '/private/tmp/wfprobe/runs/B-1'
const CHANGE = 'bolt-abc'

const ANALYSE_SCHEMA = {
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
          id: { type: 'string' },
          description: { type: 'string' },
          reason: { type: 'string', description: 'one line: why this can be started now' },
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
  required: ['id', 'path', 'line'],
  properties: {
    id: { type: 'string' },
    path: { type: 'string' },
    line: { type: 'string' },
  },
}

phase('Analyse')

const analysis = await agent(
  `You are the analyse phase of a construction pass for OpenSpec change \`${CHANGE}\`.

Working directory / repo root: ${REPO}

1. Run this exact command with Bash:
   \`cd ${REPO} && openspec instructions apply --change ${CHANGE} --json\`
2. Read the \`tasks\` array it returns. Each entry is \`{id, description, done}\`.
3. Consider ONLY the entries where \`done\` is false.
4. Decide, by reading the task DESCRIPTIONS, which of those can be STARTED NOW
   and which must wait on another task in the same list.

Nothing in the data declares these relationships. Working them out from the
prose of the descriptions is your job: a description may state outright that it
depends on another piece of work, or may imply it by consuming something another
task produces. A task that depends on nothing not-done is startable. A task that
depends on a task which is already \`done: true\` is ALSO startable — its
dependency is already satisfied.

Do not look at any \`out/\` directory or prior run state; classify from the query
result alone.

Return the startable tasks with a one-line reason each, and the waiting tasks
with what each one waits on. Your final output is the structured data, not a
message to a human.`,
  { label: 'analyse', phase: 'Analyse', schema: ANALYSE_SCHEMA }
)

if (!analysis) {
  return { error: 'analyse phase returned nothing', built: [], waiting: [] }
}

log(`analyse: ${analysis.startable.length} startable, ${analysis.waiting.length} waiting`)

if (analysis.startable.length === 0) {
  return { built: [], startable: [], waiting: analysis.waiting, note: 'no task was startable this pass' }
}

phase('Build')

const results = (await parallel(
  analysis.startable.map((t) => () =>
    agent(
      `You are a build agent for one task of OpenSpec change \`${CHANGE}\`.

Repo root: ${REPO}

Your task is id \`${t.id}\`: ${t.description}

Do exactly this and nothing more:
1. Ensure the directory \`${REPO}/out\` exists (create it if missing).
2. Write the file \`${REPO}/out/${t.id}.txt\` with the Write tool. Its entire
   contents must be the single line:
   built ${t.id}
3. Do not touch tasks.md, any other task's output file, or anything else in the repo.

Return the id you handled, the absolute path you wrote, and the exact line you
wrote into it. Your final output is the structured data, not a message to a human.`,
      { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  )
)).filter(Boolean)

return {
  built: results,
  startable: analysis.startable,
  waiting: analysis.waiting,
}
