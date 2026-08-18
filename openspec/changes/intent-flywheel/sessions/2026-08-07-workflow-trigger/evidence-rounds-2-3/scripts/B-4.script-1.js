export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One bolt-abc construction pass: analyse task readiness from the openspec query, then build every startable task',
  phases: [
    { title: 'Analyse', detail: 'run openspec instructions apply and infer startable vs waiting tasks' },
    { title: 'Build', detail: 'one agent per startable task writes out/<task-id>.txt' },
  ],
}

const ROOT = '/private/tmp/wfprobe/runs/B-4'

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
  `Run this command with ${ROOT} as the working directory:

    openspec instructions apply --change bolt-abc --json

Read the \`tasks\` array in the JSON it returns. Each entry is {id, description, done}.

Ignore every task where done is true - that work is already finished.

For every task where done is false, decide FROM THE DESCRIPTIONS ALONE which
tasks can be STARTED NOW and which must WAIT on another task in the same list.
Nothing in the data declares these relationships. Working them out by reading
what each description actually says is your job. A task waits only if its own
description implies it depends on work that another not-done task in this list
performs; otherwise it is startable.

Return:
- startable: every not-done task that can begin now, each with its id, its
  description verbatim, and a one-line reason it is unblocked.
- waiting: every not-done task that must wait, each with its id, its description
  verbatim, and what it waits on (the blocking task's id and short name).

Every not-done task must appear in exactly one of the two lists. Do not modify
any file.`,
  { label: 'analyse:readiness', phase: 'Analyse', schema: READINESS }
)

if (!readiness) {
  return { error: 'analyse agent returned nothing', built: [], waiting: [] }
}

log(`startable: ${readiness.startable.map(t => t.id).join(', ') || 'none'} | waiting: ${readiness.waiting.map(t => t.id).join(', ') || 'none'}`)

phase('Build')
const built = await parallel(readiness.startable.map(t => () =>
  agent(
    `You are the build agent for task ${t.id} of change bolt-abc: "${t.description}".

Do exactly this and nothing else:

  1. mkdir -p ${ROOT}/out
  2. Write the file ${ROOT}/out/${t.id}.txt so that its entire contents are the
     single line:  built ${t.id}

Do not touch any other file. Do not edit tasks.md. Do not create or modify the
output file for any other task. Do not run the openspec CLI.

Return only the task id you handled: ${t.id}`,
    { label: `build:${t.id}`, phase: 'Build' }
  ).then(() => t.id)
))

return {
  built: built.filter(Boolean),
  startable: readiness.startable,
  waiting: readiness.waiting,
}
