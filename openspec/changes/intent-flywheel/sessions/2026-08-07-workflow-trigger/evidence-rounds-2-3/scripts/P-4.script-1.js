export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive the bolt-abc loopdemo construction loop: analyse task readiness, build startable tasks, repeat until dry',
  phases: [
    { title: 'Analyse', detail: 'Re-query openspec apply instructions and classify not-done tasks as startable vs waiting' },
    { title: 'Build', detail: 'Write out/<task-id>.txt for each startable task' },
  ],
}

const CHANGE = 'bolt-abc'
const ROOT = '/private/tmp/wfprobe/runs/P-4'

const ANALYSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['startable', 'waiting', 'remaining'],
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
          waitsOn: { type: 'string', description: 'which task id(s) it waits on and why' },
        },
      },
    },
    remaining: { type: 'integer', description: 'count of not-done tasks reported by the CLI this pass' },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'path', 'built'],
  properties: {
    id: { type: 'string' },
    path: { type: 'string' },
    built: { type: 'boolean' },
  },
}

const analysePrompt = (pass) => `You are in the ANALYSE phase, pass ${pass}, of the construction loop for OpenSpec change \`${CHANGE}\`.

Run exactly this command from ${ROOT}:

    openspec instructions apply --change ${CHANGE} --json

Its \`tasks\` array holds one entry per task as {id, description, done}. Do NOT rely on any earlier pass's answer or on the file contents alone — this fresh query is the source of truth.

Then, considering ONLY the tasks where done === false:

- Decide which can be STARTED NOW and which must WAIT on another task in the list.
- Nothing in the data declares those relationships. Working them out by reading the descriptions is the job. A task waits only if its own description implies it depends on another not-done task in this list; a dependency on a task that is already done is NOT a blocker.
- Give one line of reasoning per startable task, and for each waiting task name the task id it waits on.

Also check ${ROOT}/out/ — a task whose output file already exists this pass has already been built; still report it under startable only if it is still not-done AND unblocked, and note in the reason that the artifact already exists.

Return the classification via the structured output tool. \`remaining\` is the number of not-done tasks the CLI reported.`

const buildPrompt = (t, pass) => `You are in the BUILD phase, pass ${pass}, of the construction loop for OpenSpec change \`${CHANGE}\`.

Build task ${t.id}: ${t.description}

Per the change's apply instruction, "building" a task means exactly this: write the file

    ${ROOT}/out/${t.id}.txt

containing the single line:

    built ${t.id}

Create the ${ROOT}/out directory if it does not exist. Write nothing else, and change no other file — do NOT edit tasks.md or any other repo file. Then confirm the file exists with the expected contents and return the result via the structured output tool.`

const built = []
const log_ = []
let pass = 0
let dry = 0

while (dry < 1 && pass < 5) {
  pass++

  phase('Analyse')
  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSE_SCHEMA,
  })

  if (!analysis) {
    log(`pass ${pass}: analyse agent returned nothing — stopping`)
    break
  }

  log(`pass ${pass}: ${analysis.remaining} not-done — ${analysis.startable.length} startable, ${analysis.waiting.length} waiting`)
  log_.push({ pass, analysis })

  if (analysis.remaining === 0) {
    log(`pass ${pass}: no not-done tasks left — loop complete`)
    break
  }

  const fresh = analysis.startable.filter(t => !built.some(b => b.id === t.id))

  if (fresh.length === 0) {
    // Nothing new became startable this pass: either everything left is
    // genuinely blocked, or the loop has converged. Stop rather than spin.
    dry++
    log(`pass ${pass}: nothing new startable — ${analysis.waiting.length} task(s) still waiting`)
    continue
  }

  phase('Build')
  const results = await parallel(fresh.map(t => () =>
    agent(buildPrompt(t, pass), {
      label: `build:${t.id}`,
      phase: 'Build',
      schema: BUILD_SCHEMA,
    }).then(r => ({ ...t, result: r }))
  ))

  for (const r of results.filter(Boolean)) {
    if (r.result?.built) built.push({ id: r.id, description: r.description, path: r.result.path })
    else log(`pass ${pass}: task ${r.id} did not report a successful build`)
  }
}

const last = log_[log_.length - 1]?.analysis

return {
  passes: pass,
  built: built.map(b => ({ id: b.id, description: b.description, path: b.path })),
  stillWaiting: (last?.waiting ?? []).map(w => ({ id: w.id, description: w.description, waitsOn: w.waitsOn })),
  perPass: log_.map(p => ({
    pass: p.pass,
    startable: p.analysis.startable.map(t => ({ id: t.id, reason: t.reason })),
    waiting: p.analysis.waiting.map(t => ({ id: t.id, waitsOn: t.waitsOn })),
  })),
}
