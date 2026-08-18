export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive bolt-abc construction: analyse startable tasks, build them in parallel, repeat until none remain',
  phases: [
    { title: 'Analyse', detail: 'query openspec apply instructions, infer which tasks can start now' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
    { title: 'Record', detail: 'mark built tasks done in tasks.md so the next pass sees fresh state' },
  ],
}

const CHANGE = 'bolt-abc'
const ROOT = '/private/tmp/wfprobe/runs/A-6'

const ANALYSE_SCHEMA = {
  type: 'object',
  properties: {
    startable: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          reason: { type: 'string', description: 'one line: why this can start now' },
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
          waitsOn: { type: 'string', description: 'which task id(s) it waits on and why' },
        },
        required: ['id', 'description', 'waitsOn'],
        additionalProperties: false,
      },
    },
  },
  required: ['startable', 'waiting'],
  additionalProperties: false,
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    file: { type: 'string' },
  },
  required: ['id', 'file'],
  additionalProperties: false,
}

const RECORD_SCHEMA = {
  type: 'object',
  properties: {
    marked: { type: 'array', items: { type: 'string' } },
  },
  required: ['marked'],
  additionalProperties: false,
}

const passes = []
let built = []
let lastWaiting = []

for (let pass = 1; pass <= 5; pass++) {
  phase('Analyse')
  const analysis = await agent(
    `You are the analyse step of the construction loop for OpenSpec change \`${CHANGE}\`.

Run this command from ${ROOT}:

  openspec instructions apply --change ${CHANGE} --json

Read the \`tasks\` array in the JSON it returns. Each entry is {id, description, done}.

Your job: for the tasks where done is false, decide from the DESCRIPTIONS ALONE which
ones can be STARTED NOW and which must wait on another task in that same list. Nothing
in the data declares these relationships — you infer them by reading what each task says
it does and what it depends on. A task waits only if another not-done task in the list
must finish first; tasks that are already done cannot block anything.

Return:
- startable: the not-done task ids that can begin immediately, each with a one-line reason.
- waiting: the not-done task ids that cannot, each with what it waits on.

Do not build anything. Do not edit any files. Analysis only. This is pass ${pass}; run the
query fresh — do not assume any earlier pass's answer still holds.`,
    { label: `analyse:pass-${pass}`, phase: 'Analyse', schema: ANALYSE_SCHEMA }
  )

  if (!analysis) {
    log(`pass ${pass}: analyse agent returned nothing — stopping`)
    break
  }

  lastWaiting = analysis.waiting || []
  const startable = analysis.startable || []
  log(`pass ${pass}: ${startable.length} startable, ${lastWaiting.length} waiting`)

  if (startable.length === 0) {
    passes.push({ pass, startable: [], builtIds: [], waiting: lastWaiting })
    break
  }

  phase('Build')
  const results = (await parallel(
    startable.map((t) => () =>
      agent(
        `You are a build agent for OpenSpec change \`${CHANGE}\`, task id "${t.id}":
"${t.description}"

Do exactly this and nothing more:
1. Write the file ${ROOT}/out/${t.id}.txt containing the single line:
built ${t.id}
2. Return {"id": "${t.id}", "file": "${ROOT}/out/${t.id}.txt"}.

Do not touch tasks.md, any other task's output file, or anything else in the repo.`,
        { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
      )
    )
  )).filter(Boolean)

  const builtIds = results.map((r) => r.id)
  built.push(...builtIds)
  passes.push({ pass, startable: startable.map((t) => ({ id: t.id, reason: t.reason })), builtIds, waiting: lastWaiting })

  if (builtIds.length === 0) {
    log(`pass ${pass}: no builds succeeded — stopping to avoid a spin`)
    break
  }

  // Serialized on purpose: one agent edits tasks.md so parallel build agents
  // never race on the same file, and the next pass's query sees fresh state.
  phase('Record')
  await agent(
    `Edit ${ROOT}/openspec/changes/${CHANGE}/tasks.md.

These tasks were just built and must be marked complete: ${builtIds.join(', ')}.

The task ids correspond to the checkbox lines in file order under the "## Build" heading:
id "1" is the 1st checkbox line, "2" the 2nd, and so on. For each id listed above, change
that line's \`- [ ]\` to \`- [x]\`. Leave the description text exactly as-is, leave every
other line untouched, and do not reorder anything.

Return {"marked": [<the ids you changed>]}.`,
    { label: `record:pass-${pass}`, phase: 'Record', schema: RECORD_SCHEMA }
  )
}

return { change: CHANGE, builtThisRun: built, stillWaiting: lastWaiting, passes }
