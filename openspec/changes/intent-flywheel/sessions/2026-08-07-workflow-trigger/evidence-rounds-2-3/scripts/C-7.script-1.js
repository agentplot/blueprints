export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass over bolt-abc: analyse task readiness, then build every startable task',
  phases: [
    { title: 'Analyse', detail: 'read the tasks array and infer which tasks are startable now' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
  ],
}

const REPO = '/private/tmp/wfprobe/runs/C-7'

const READINESS_SCHEMA = {
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
          id: { type: 'string', description: 'task id from the tasks array' },
          description: { type: 'string' },
          reason: { type: 'string', description: 'one line: why this can start now' },
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

phase('Analyse')

const readiness = await agent(
  `You are the analysis step of the bolt-abc construction loop.

Working directory: ${REPO}

1. Run exactly this command from ${REPO}:
     openspec instructions apply --change bolt-abc --json

2. Read the \`tasks\` array in the JSON it prints. Each entry is {id, description, done}.

3. Consider ONLY the tasks where done === false. For each one, decide from the
   DESCRIPTION TEXT ALONE whether it can be STARTED NOW or must WAIT on another
   task in the list. Nothing in the data declares these relationships - inferring
   them from the prose is your job. A task waits only if its description implies a
   dependency on work that another not-done task in this list would produce. Tasks
   that merely touch the same repo/kit are NOT dependent on each other and can run
   concurrently. A task whose dependency is already done === true is startable.

4. Return the startable tasks (with a one-line reason each) and the waiting tasks
   (with what each waits on). Do not include tasks that are already done.

Do not write any files. Do not build anything. Analysis only.`,
  { label: 'analyse:readiness', phase: 'Analyse', schema: READINESS_SCHEMA }
)

if (!readiness) {
  return { error: 'analysis agent returned no result', built: [], waiting: [] }
}

log(`startable: ${readiness.startable.map(t => t.id).join(', ') || 'none'} | waiting: ${readiness.waiting.map(t => t.id).join(', ') || 'none'}`)

if (readiness.startable.length === 0) {
  return { built: [], startable: [], waiting: readiness.waiting, note: 'nothing startable this pass' }
}

phase('Build')

const built = await parallel(
  readiness.startable.map(task => () =>
    agent(
      `You are a build agent in the bolt-abc construction loop.

Your task is id "${task.id}": ${task.description}

Do exactly this and nothing else:
  Write the file ${REPO}/out/${task.id}.txt so that its entire contents are the
  single line:

built ${task.id}

(The ${REPO}/out directory already exists. Overwrite the file if it exists.)

Do not modify tasks.md, do not touch any other file, and do not run openspec.

Return ONLY the task id you handled, as a bare string: ${task.id}`,
      { label: `build:${task.id}`, phase: 'Build' }
    ).then(res => ({ id: task.id, description: task.description, returned: res }))
  )
)

const ok = built.filter(Boolean)

return {
  built: ok,
  startable: readiness.startable,
  waiting: readiness.waiting,
  failed: readiness.startable.filter(t => !ok.some(b => b.id === t.id)).map(t => t.id),
}
