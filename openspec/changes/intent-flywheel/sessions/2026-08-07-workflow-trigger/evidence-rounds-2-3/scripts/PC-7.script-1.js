export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive bolt-abc: re-query tasks each pass, infer dependencies, build what is startable, loop until nothing unblocks',
  phases: [
    { title: 'Analyse', detail: 're-run openspec instructions apply, infer which tasks are startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<task-id>.txt' },
    { title: 'Record', detail: 'single writer marks the round\'s tasks [x] in tasks.md' },
  ],
}

const ROOT = '/private/tmp/wfprobe/runs/PC-7'

const ANALYSIS = {
  type: 'object',
  properties: {
    startable: {
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'string' }, reason: { type: 'string' } },
        required: ['id', 'reason'],
        additionalProperties: false,
      },
    },
    waiting: {
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'string' }, waitsOn: { type: 'string' } },
        required: ['id', 'waitsOn'],
        additionalProperties: false,
      },
    },
  },
  required: ['startable', 'waiting'],
  additionalProperties: false,
}

const BUILT = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    path: { type: 'string' },
    contents: { type: 'string' },
  },
  required: ['id', 'path', 'contents'],
  additionalProperties: false,
}

const RECORDED = {
  type: 'object',
  properties: {
    marked: { type: 'array', items: { type: 'string' } },
    tasksFileAfter: { type: 'string' },
  },
  required: ['marked'],
  additionalProperties: false,
}

const builtIds = []
const rounds = []
let lastWaiting = []
const MAX_ROUNDS = 6

for (let round = 1; round <= MAX_ROUNDS; round++) {
  phase('Analyse')

  const alreadyBuilt = builtIds.length ? builtIds.join(', ') : '(none yet)'

  const analysis = await agent(
    `You are analysing one pass of the construction loop for the OpenSpec change \`bolt-abc\` in ${ROOT}.

STEP 1 — re-run the query. Do NOT reuse any earlier answer; run it fresh now:

    cd ${ROOT} && openspec instructions apply --change bolt-abc --json

Its \`tasks\` array holds one entry per task as {id, description, done}.

STEP 2 — decide, by READING THE DESCRIPTIONS, which not-done tasks can be
STARTED NOW and which must wait on another task in that same list. Nothing in
the data declares those relationships — working them out from the prose is the
job. A task waits only if its description makes it depend on another task in
this list (e.g. it consumes something another task produces, or says it cannot
start until another is built). Tasks in different components with no stated
relationship are independent and start now.

Already built earlier in this run: ${alreadyBuilt}
Never return an already-built id as startable, and never return a task whose
\`done\` is already true.

Return startable ids each with a one-line reason, and waiting ids each with
what they wait on. Return empty arrays if nothing qualifies.`,
    { label: `analyse:round-${round}`, phase: 'Analyse', schema: ANALYSIS }
  )

  if (!analysis) {
    log(`round ${round}: analysis failed — stopping`)
    break
  }

  const fresh = (analysis.startable || []).filter(t => t && t.id && !builtIds.includes(t.id))
  lastWaiting = analysis.waiting || []

  if (!fresh.length) {
    log(`round ${round}: nothing startable — loop is dry (${lastWaiting.length} still waiting)`)
    rounds.push({ round, started: [], waiting: lastWaiting })
    break
  }

  log(`round ${round}: startable ${fresh.map(t => t.id).join(', ')} | waiting ${lastWaiting.map(w => w.id).join(', ') || 'none'}`)

  // Barrier is deliberate: Record is a single writer to tasks.md and needs the
  // whole round's ids at once, and the next Analyse must re-read the state
  // Record wrote. Build agents write disjoint files, so they run concurrently.
  phase('Build')
  const results = await parallel(
    fresh.map(t => () =>
      agent(
        `Build task ${t.id} of the OpenSpec change \`bolt-abc\`.

The schema defines "build" for this change as exactly one action:

    write ${ROOT}/out/${t.id}.txt containing the single line: built ${t.id}

Create the ${ROOT}/out/ directory if it does not exist. Write ONLY that one
file — do not touch tasks.md, any sibling out/*.txt, or anything else.
Then read the file back and report its id, absolute path, and exact contents.`,
        { label: `build:${t.id}`, phase: 'Build', schema: BUILT }
      )
    )
  )

  const ok = results.filter(Boolean)
  const okIds = ok.map(r => r.id)
  const failedIds = fresh.map(t => t.id).filter(id => !okIds.includes(id))
  if (failedIds.length) log(`round ${round}: build FAILED for ${failedIds.join(', ')} — not recorded`)

  if (!okIds.length) {
    rounds.push({ round, started: [], failed: failedIds, waiting: lastWaiting })
    break
  }

  phase('Record')
  const recorded = await agent(
    `Single-writer step for the OpenSpec change \`bolt-abc\` in ${ROOT}.

These task ids were built successfully this round: ${okIds.join(', ')}

In ${ROOT}/openspec/changes/bolt-abc/tasks.md, mark exactly those tasks
complete by changing their leading \`- [ ]\` to \`- [x]\`. Task ids are the
1-based order of the checkbox lines under the headings. Change nothing else —
not the task text, not any other line, not any other file.

Report the ids you marked and the full contents of tasks.md afterwards.`,
    { label: `record:round-${round}`, phase: 'Record', schema: RECORDED }
  )

  builtIds.push(...okIds)
  rounds.push({
    round,
    started: fresh,
    built: okIds,
    failed: failedIds,
    marked: recorded ? recorded.marked : null,
    waiting: lastWaiting,
  })

  if (recorded === null) {
    log(`round ${round}: record step failed — tasks.md may not reflect ${okIds.join(', ')}; stopping`)
    break
  }
}

if (builtIds.length && rounds.length === MAX_ROUNDS) {
  log(`hit the ${MAX_ROUNDS}-round guard — loop may not be dry; check remaining tasks`)
}

return { builtIds, stillWaiting: lastWaiting, rounds }
