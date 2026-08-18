export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass over bolt-abc: analyse task readiness, then build every startable task',
  phases: [
    { title: 'Analyse', detail: 'query openspec and work out which tasks are startable now' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
  ],
}

const REPO = '/private/tmp/wfprobe/runs/C-6'

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
          waitsOn: { type: 'string', description: 'which task id(s) it waits on and why' },
        },
      },
    },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'wrotePath'],
  properties: {
    id: { type: 'string' },
    wrotePath: { type: 'string' },
  },
}

phase('Analyse')

const analysis = await agent(
  `You are the analyse step of the bolt-abc construction loop.

Run this command from ${REPO}:

    cd ${REPO} && openspec instructions apply --change bolt-abc --json

Read the \`tasks\` array it returns. Each entry is {id, description, done}.

Ignore tasks where done is true. For every not-done task, decide from the
DESCRIPTIONS ALONE which can be STARTED NOW and which must wait on another
task in the list. Nothing in the data declares these relationships - working
them out by reading the descriptions is your job. A task waits only if its
own description makes it depend on another task in this list; two tasks
merely touching the same repo is NOT a dependency.

Return the startable tasks with a one-line reason each, and the waiting ones
with what they wait on. Do not build anything.`,
  { label: 'analyse', phase: 'Analyse', schema: ANALYSE_SCHEMA }
)

if (!analysis) {
  return { error: 'analyse step returned nothing', runComplete: false }
}

log(`analyse: ${analysis.startable.length} startable, ${analysis.waiting.length} waiting`)

if (analysis.startable.length === 0) {
  return { startable: [], waiting: analysis.waiting, built: [], note: 'nothing startable this pass' }
}

phase('Build')

const built = await parallel(
  analysis.startable.map((t) => () =>
    agent(
      `You are a build agent in the bolt-abc construction loop. You handle exactly
one task:

  id: ${t.id}
  description: ${t.description}

Do this and nothing else: write the file ${REPO}/out/${t.id}.txt containing
the single line

built ${t.id}

(one line, trailing newline, nothing else). Use the Write tool. Then return
the task id you handled and the absolute path you wrote.`,
      { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  )
)

const ok = built.filter(Boolean)
const failed = analysis.startable
  .filter((t) => !ok.some((b) => b.id === t.id))
  .map((t) => t.id)

if (failed.length) log(`build agents that did not report: ${failed.join(', ')}`)

return {
  built: ok,
  failedToReport: failed,
  startable: analysis.startable,
  waiting: analysis.waiting,
}
