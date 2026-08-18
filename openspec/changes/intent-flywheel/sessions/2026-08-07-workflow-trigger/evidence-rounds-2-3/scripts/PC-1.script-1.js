export const meta = {
  name: 'loopdemo-construction',
  description: 'Drive the loopdemo construction loop for an OpenSpec change: re-query, analyse readiness, build startable tasks, land checkboxes, repeat',
  whenToUse: 'When driving a loopdemo-schema OpenSpec change whose tasks carry implicit dependencies that must be re-derived each pass',
  phases: [
    { title: 'Analyse', detail: 're-run openspec instructions apply and split not-done tasks into startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task writes out/<id>.txt' },
    { title: 'Land', detail: 'single serialized agent ticks tasks.md checkboxes for the ids built this pass' },
  ],
}

const CHANGE = args?.change ?? 'bolt-abc'
const ROOT = args?.root ?? '/private/tmp/wfprobe/runs/PC-1'
const MAX_PASSES = args?.maxPasses ?? 6

const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    startable: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          reason: { type: 'string', description: 'one line: why this can be STARTED NOW' },
        },
        required: ['id', 'description', 'reason'],
      },
    },
    waiting: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'string', description: 'which task id(s) it waits on, and why' },
        },
        required: ['id', 'description', 'waitsOn'],
      },
    },
    doneIds: { type: 'array', items: { type: 'string' } },
  },
  required: ['startable', 'waiting', 'doneIds'],
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    path: { type: 'string' },
    contents: { type: 'string' },
    ok: { type: 'boolean' },
  },
  required: ['id', 'path', 'contents', 'ok'],
}

const LAND_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    tickedIds: { type: 'array', items: { type: 'string' } },
    notTicked: { type: 'array', items: { type: 'string' } },
    note: { type: 'string' },
  },
  required: ['tickedIds', 'notTicked', 'note'],
}

const analysePrompt = (pass) => `You are the ANALYSE step of pass ${pass} of a construction loop for OpenSpec change "${CHANGE}".

Run exactly this, from ${ROOT}:

  cd ${ROOT} && openspec instructions apply --change "${CHANGE}" --json

Do NOT rely on any prior pass's answer, and do NOT rely on anything stated in this prompt about the task list — re-derive it from that command's output on THIS invocation. The command's \`tasks\` array holds one entry per task as {id, description, done}.

Your job: for the tasks with done=false, decide which can be STARTED NOW and which must WAIT on another task in the list. Nothing in the data declares those relationships — you work them out by reading the descriptions. A task waits only if another NOT-DONE task in the list must complete first; a dependency on an already-done task does not block.

Return:
- startable: each with its id, its description verbatim, and a one-line reason it can start now.
- waiting: each with its id, its description verbatim, and which task id it waits on plus why.
- doneIds: the ids currently reported done=true.

Read files with Read and search with Grep. Return the structured object only.`

const buildPrompt = (t, pass) => `You are a BUILD agent in pass ${pass} of the construction loop for OpenSpec change "${CHANGE}".

Your single task is id "${t.id}": ${t.description}

The loopdemo schema defines "build" for this change as exactly one action:

  write the file ${ROOT}/out/${t.id}.txt containing the single line:
  built ${t.id}

Write exactly that — one line, trailing newline, nothing else. Create ${ROOT}/out/ if it is absent. Touch NO other file: you do not edit tasks.md, you do not edit any other task's out file, and you do not edit anything under ${ROOT}/openspec/. Another actor lands the checkbox for you.

Return {id, path of the file you wrote, its exact contents, ok}.`

const landPrompt = (ids, pass) => `You are the LAND step of pass ${pass} for OpenSpec change "${CHANGE}". You are the ONLY writer to tasks.md this pass — the build agents deliberately did not touch it, because they run concurrently and it is one shared file.

Read ${ROOT}/openspec/changes/${CHANGE}/tasks.md with Read.

For each of these task ids built this pass — ${ids.join(', ')} — confirm that ${ROOT}/out/<id>.txt exists and contains the single line "built <id>". ONLY if it does, flip that task's checkbox in tasks.md from "- [ ]" to "- [x]", leaving the task text byte-identical.

Task ids are 1-based positions in the task list as reported by \`openspec instructions apply --change "${CHANGE}" --json\`; map id to the right line by matching the task DESCRIPTION, not by counting lines. Change no other line. Tick no id outside the list above, whatever else you notice.

Return {tickedIds, notTicked (with any id you refused to tick), note}.`

const built = []
const passLog = []
let stalled = null

for (let pass = 1; pass <= MAX_PASSES; pass++) {
  phase(`Analyse`)
  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSIS_SCHEMA,
  })

  if (!analysis) { stalled = `pass ${pass}: analyse agent returned nothing`; break }

  const startable = analysis.startable ?? []
  const waiting = analysis.waiting ?? []
  log(`pass ${pass}: ${startable.length} startable [${startable.map(t => t.id).join(', ') || '-'}], ${waiting.length} waiting [${waiting.map(t => t.id).join(', ') || '-'}], ${(analysis.doneIds ?? []).length} done`)

  if (startable.length === 0) {
    passLog.push({ pass, startable: [], waiting, tickedIds: [], note: waiting.length ? 'nothing startable but work still waiting' : 'nothing left to start' })
    if (waiting.length > 0) stalled = `pass ${pass}: ${waiting.length} task(s) waiting but none startable — dependency cycle or an unmet external blocker`
    break
  }

  // Barrier is correct here: the Land step is the single serialized writer to
  // tasks.md, so it must hold every build result from this pass at once.
  phase('Build')
  const results = (await parallel(startable.map(t => () =>
    agent(buildPrompt(t, pass), { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA })
  ))).filter(Boolean)

  const okIds = results.filter(r => r.ok).map(r => r.id)
  const failedIds = startable.map(t => t.id).filter(id => !okIds.includes(id))
  if (failedIds.length) log(`pass ${pass}: build did not confirm [${failedIds.join(', ')}]`)

  if (okIds.length === 0) { stalled = `pass ${pass}: no task built successfully`; break }

  phase('Land')
  const landed = await agent(landPrompt(okIds, pass), {
    label: `land:pass-${pass}`,
    phase: 'Land',
    schema: LAND_SCHEMA,
  })

  const tickedIds = landed?.tickedIds ?? []
  built.push(...tickedIds)
  passLog.push({
    pass,
    startable: startable.map(t => ({ id: t.id, reason: t.reason })),
    waiting: waiting.map(t => ({ id: t.id, waitsOn: t.waitsOn })),
    builtIds: okIds,
    tickedIds,
    notTicked: landed?.notTicked ?? [],
    note: landed?.note ?? '',
  })
  log(`pass ${pass}: landed [${tickedIds.join(', ') || '-'}]`)

  if (tickedIds.length === 0) { stalled = `pass ${pass}: built [${okIds.join(', ')}] but nothing was ticked — loop cannot progress`; break }
  if (pass === MAX_PASSES) stalled = `hit maxPasses=${MAX_PASSES} with work possibly remaining`
}

// Final re-query so the report states the tree's actual state, not the loop's memory of it.
phase('Analyse')
const final = await agent(analysePrompt('final'), { label: 'analyse:final', phase: 'Analyse', schema: ANALYSIS_SCHEMA })

return {
  change: CHANGE,
  passes: passLog,
  builtThisRun: built,
  stalled,
  finalState: final,
}