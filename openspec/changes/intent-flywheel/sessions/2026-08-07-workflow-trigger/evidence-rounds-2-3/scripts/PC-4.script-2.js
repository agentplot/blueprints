export const meta = {
  name: 'bolt-abc-construction',
  description: 'Drive the bolt-abc construction loop: re-query tasks each pass, analyse readiness, build startable tasks, repeat until none remain',
  phases: [
    { title: 'Analyse', detail: 're-query openspec and classify not-done tasks as startable or waiting' },
    { title: 'Build', detail: 'one agent per startable task writes out/<task-id>.txt' },
    { title: 'Record', detail: 'mark the tasks built this pass as done in tasks.md' },
  ],
}

const ROOT = '/private/tmp/wfprobe/runs/PC-4'
const CHANGE = 'bolt-abc'
const MAX_PASSES = 6

const ANALYSE_SCHEMA = {
  type: 'object',
  properties: {
    remaining: { type: 'number', description: 'count of tasks with done=false' },
    startable: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          reason: { type: 'string', description: 'one line: why it can start now' },
        },
        required: ['id', 'description', 'reason'],
      },
    },
    waiting: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'string', description: 'task id(s) it waits on' },
          reason: { type: 'string' },
        },
        required: ['id', 'waitsOn', 'reason'],
      },
    },
  },
  required: ['remaining', 'startable', 'waiting'],
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    path: { type: 'string' },
    wrote: { type: 'boolean' },
  },
  required: ['id', 'path', 'wrote'],
}

const RECORD_SCHEMA = {
  type: 'object',
  properties: {
    marked: { type: 'array', items: { type: 'string' } },
    checkboxLines: { type: 'array', items: { type: 'string' } },
    problem: { type: 'string', description: 'empty string if none' },
  },
  required: ['marked', 'checkboxLines'],
}

const analysePrompt = (pass) => `You are the ANALYSE phase of pass ${pass} of the construction loop for OpenSpec change "${CHANGE}".

Run exactly this command from ${ROOT} and read its JSON output:

  openspec instructions apply --change ${CHANGE} --json

Its \`tasks\` array holds one entry per task as {id, description, done}. Re-run the query now — do NOT assume any earlier pass's answer still holds.

Consider only tasks with done=false. NOTHING in the data declares dependencies between tasks. Working them out is the job: read each description and decide whether it can be STARTED NOW, or whether it must WAIT on another task in the list (a description may say so outright, or imply it by naming an artifact another task produces).

Also run \`ls -1 ${ROOT}/out\`. A file out/<task-id>.txt means that task has already been built; treat that as satisfying anything waiting on it.

Return:
- remaining: how many tasks have done=false
- startable: each id, its description, and a ONE-LINE reason it can start now
- waiting: each id, its description, what it waits on, and a ONE-LINE reason

Do not build anything. Do not write or edit any file. Analysis only.`

const buildPrompt = (t) => `You are the BUILD phase for task ${t.id} of OpenSpec change "${CHANGE}".

Task ${t.id}: "${t.description}"

Write the file ${ROOT}/out/${t.id}.txt containing exactly this single line:

built ${t.id}

Create nothing else, edit nothing else, run no other commands. Return the id, the absolute path you wrote, and wrote=true.`

const recordPrompt = (pass, built) => `You are the RECORD step of pass ${pass} for OpenSpec change "${CHANGE}".

These tasks just finished building:
${built.map((b) => `- id ${b.id}: ${b.description}`).join('\n')}

Edit ${ROOT}/openspec/changes/${CHANGE}/tasks.md and mark exactly those tasks done: change their \`- [ ]\` to \`- [x]\`.

Locate each line by matching its description text. A task's id is also its 1-based position among the checkbox lines in the file — verify both agree. If they disagree for any task, change NOTHING, and report the mismatch in \`problem\`.

Leave every other line byte-identical: do not reflow, reorder, retitle, or touch any other checkbox. Return the ids you marked and the full set of checkbox lines as they now read.`

const summary = []

for (let pass = 1; pass <= MAX_PASSES; pass++) {
  phase('Analyse')
  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass${pass}`,
    phase: 'Analyse',
    schema: ANALYSE_SCHEMA,
  })

  if (!analysis) {
    log(`pass ${pass}: analysis agent returned nothing — stopping.`)
    summary.push({ pass, error: 'analysis failed' })
    break
  }

  log(`pass ${pass}: ${analysis.remaining} not done | startable: [${analysis.startable.map((t) => t.id).join(', ') || 'none'}] | waiting: [${analysis.waiting.map((t) => `${t.id}<-${t.waitsOn}`).join(', ') || 'none'}]`)

  if (analysis.remaining === 0) {
    log(`pass ${pass}: nothing left to build — loop converged.`)
    summary.push({ pass, remaining: 0, built: [], waiting: [], converged: true })
    break
  }

  if (analysis.startable.length === 0) {
    log(`pass ${pass}: ${analysis.remaining} task(s) remain but NONE are startable — deadlock. Stopping.`)
    summary.push({ pass, remaining: analysis.remaining, built: [], waiting: analysis.waiting, deadlock: true })
    break
  }

  phase('Build')
  const builds = await parallel(
    analysis.startable.map((t) => () =>
      agent(buildPrompt(t), { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA })
    )
  )

  const built = builds
    .map((b, i) => (b && b.wrote ? Object.assign({}, analysis.startable[i], { path: b.path }) : null))
    .filter(Boolean)
  const failed = analysis.startable.filter((t) => !built.some((b) => b.id === t.id))

  if (failed.length) log(`pass ${pass}: build FAILED for [${failed.map((t) => t.id).join(', ')}]`)

  let record = null
  if (built.length) {
    phase('Record')
    record = await agent(recordPrompt(pass, built), {
      label: `record:pass${pass}`,
      phase: 'Record',
      schema: RECORD_SCHEMA,
    })
    if (!record || record.problem) {
      log(`pass ${pass}: could not mark tasks done (${record ? record.problem : 'record agent returned nothing'}) — stopping so the loop cannot spin.`)
      summary.push({ pass, built: built.map((b) => b.id), recordProblem: record ? record.problem : 'record agent returned nothing' })
      break
    }
    log(`pass ${pass}: marked done [${record.marked.join(', ')}]`)
  }

  summary.push({
    pass,
    remainingAtStart: analysis.remaining,
    built: built.map((b) => ({ id: b.id, reason: b.reason })),
    buildFailed: failed.map((t) => t.id),
    waiting: analysis.waiting.map((t) => ({ id: t.id, waitsOn: t.waitsOn, reason: t.reason })),
  })

  if (!built.length) {
    log(`pass ${pass}: no task built — stopping rather than re-querying unchanged state.`)
    break
  }

  if (pass === MAX_PASSES) log(`hit the ${MAX_PASSES}-pass cap with work possibly still outstanding — re-run to continue.`)
}

return { change: CHANGE, schema: 'loopdemo', passes: summary }
