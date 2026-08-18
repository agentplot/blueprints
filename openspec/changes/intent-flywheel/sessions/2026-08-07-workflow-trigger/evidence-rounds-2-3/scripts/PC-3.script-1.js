export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive bolt-abc construction: each pass re-queries openspec, classifies startable vs waiting tasks, builds the startable ones',
  phases: [
    { title: 'Analyse', detail: 're-run the apply query and classify not-done tasks as startable or waiting' },
    { title: 'Build', detail: 'one agent per startable task: write out/<id>.txt' },
    { title: 'Record', detail: 'single writer marks this pass\'s built tasks complete in tasks.md' },
  ],
}

const ROOT = '/private/tmp/wfprobe/runs/PC-3'
const TASKS_MD = ROOT + '/openspec/changes/bolt-abc/tasks.md'

const ANALYSIS_SCHEMA = {
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
      },
    },
    waiting: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'array', items: { type: 'string' } },
          reason: { type: 'string' },
        },
        required: ['id', 'description', 'waitsOn', 'reason'],
      },
    },
    notDoneIds: { type: 'array', items: { type: 'string' } },
  },
  required: ['startable', 'waiting', 'notDoneIds'],
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    path: { type: 'string' },
    ok: { type: 'boolean' },
    note: { type: 'string' },
  },
  required: ['id', 'ok'],
}

const RECORD_SCHEMA = {
  type: 'object',
  properties: {
    markedIds: { type: 'array', items: { type: 'string' } },
    ok: { type: 'boolean' },
    note: { type: 'string' },
  },
  required: ['markedIds', 'ok'],
}

const MAX_PASSES = 6
const builtIds = []
const passLog = []
let stalled = null

for (let pass = 1; pass <= MAX_PASSES; pass++) {
  phase('Analyse')

  const alreadyBuilt = builtIds.length
    ? `Tasks already built earlier in THIS run (treat as done even if the query still shows done:false, and do NOT list them as startable): ${builtIds.join(', ')}.`
    : 'No tasks have been built yet in this run.'

  const analysis = await agent(
    `You are the analyse phase of the bolt-abc construction loop. Working directory: ${ROOT}

Run exactly this and read the JSON it prints:

    openspec instructions apply --change bolt-abc --json

Its \`tasks\` array holds one entry per task as {id, description, done}.

Your job is dependency analysis from the PROSE ALONE. Nothing in the data declares which task depends on which — you must infer it by reading the descriptions and noticing when one task names an artifact, endpoint, or component that another task is responsible for producing. A task is STARTABLE if every input it needs already exists (either its producer task is done, or it needs nothing from another task in this list). A task is WAITING if it needs something a not-yet-done task in this list must produce first.

${alreadyBuilt}

Rules:
- Consider ONLY tasks with done:false that are not in the already-built list.
- Every such task must appear in exactly one of \`startable\` or \`waiting\`.
- \`reason\` must be one line, and must cite the wording that drove the call.
- For \`waiting\`, \`waitsOn\` lists the task ids it blocks on.
- Do not create, edit, or delete any file in this phase. Analysis only.
- Put every not-done, not-yet-built task id in \`notDoneIds\`.`,
    { label: `analyse:pass-${pass}`, phase: 'Analyse', schema: ANALYSIS_SCHEMA }
  )

  if (!analysis) {
    stalled = { pass, why: 'analyse agent returned no result' }
    break
  }

  log(`pass ${pass}: ${analysis.startable.length} startable, ${analysis.waiting.length} waiting, ${analysis.notDoneIds.length} not done`)

  if (analysis.notDoneIds.length === 0) {
    passLog.push({ pass, startable: [], waiting: [], built: [], note: 'nothing left to do' })
    break
  }

  if (analysis.startable.length === 0) {
    // Nothing unblocked but work remains -> a real stall. Report, do not spin.
    stalled = {
      pass,
      why: 'no startable tasks but work remains',
      waiting: analysis.waiting,
    }
    passLog.push({ pass, startable: [], waiting: analysis.waiting, built: [] })
    break
  }

  phase('Build')

  // Barrier is deliberate: the NEXT pass's analysis depends on every build in
  // THIS pass having landed and been recorded, so a pipeline would be wrong here.
  const builds = (await parallel(
    analysis.startable.map((t) => () =>
      agent(
        `You are a build agent in the bolt-abc construction loop.

Task id: ${t.id}
Task: ${t.description}

Do exactly this and nothing more:
1. Ensure the directory ${ROOT}/out exists (mkdir -p).
2. Write the file ${ROOT}/out/${t.id}.txt so that its entire contents are the single line:
built ${t.id}

Constraints:
- Do NOT modify tasks.md or any other file. A separate step records completion.
- Do NOT implement anything beyond writing that one file. This is the schema's definition of "build".
- Report ok:true only if the file exists with exactly that line.`,
        { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
      )
    )
  )).filter(Boolean)

  const okIds = builds.filter((b) => b.ok).map((b) => b.id)
  const failed = builds.filter((b) => !b.ok)

  if (okIds.length === 0) {
    stalled = { pass, why: 'every build in this pass failed', failed }
    passLog.push({ pass, startable: analysis.startable, waiting: analysis.waiting, built: [], failed })
    break
  }

  phase('Record')

  // Single writer on tasks.md: parallel build agents must never both edit it.
  const record = await agent(
    `You are the record step of the bolt-abc construction loop. Single writer — no other agent is touching this file right now.

File: ${TASKS_MD}

These tasks were just built successfully and must be marked complete:
${okIds.map((id) => {
  const t = analysis.startable.find((s) => s.id === id)
  return `- id ${id}: ${t ? t.description : '(description unavailable)'}`
}).join('\n')}

Do exactly this:
1. Read the file.
2. For each task above, find its checklist line by matching the description text and change its leading \`- [ ]\` to \`- [x]\`.
3. Change NOTHING else: no rewording, no reordering, no reformatting, no new lines, no touching already-checked lines.

Report the ids you actually marked. If a description does not match exactly one line, do not guess — leave it, set ok:false, and say which.`,
    { label: `record:pass-${pass}`, phase: 'Record', schema: RECORD_SCHEMA }
  )

  builtIds.push(...okIds)
  passLog.push({
    pass,
    startable: analysis.startable,
    waiting: analysis.waiting,
    built: okIds,
    failed: failed.length ? failed : undefined,
    recorded: record ? record.markedIds : [],
    recordOk: record ? record.ok : false,
    recordNote: record && record.note ? record.note : undefined,
  })

  if (record && !record.ok) {
    log(`pass ${pass}: record step reported a problem — ${record.note || 'see result'}`)
  }
}

if (passLog.length >= MAX_PASSES) {
  log(`hit the ${MAX_PASSES}-pass cap; some work may remain unbuilt`)
}

return {
  builtIds,
  passes: passLog,
  stalled,
  hitPassCap: passLog.length >= MAX_PASSES,
}
