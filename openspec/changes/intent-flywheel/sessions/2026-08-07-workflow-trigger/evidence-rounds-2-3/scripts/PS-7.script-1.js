export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive the bolt-abc loopdemo apply loop: analyse startable tasks each pass, build them, record completion',
  phases: [
    { title: 'Analyse', detail: 're-run openspec instructions apply and derive which tasks are startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
    { title: 'Record', detail: 'tick the built tasks in tasks.md so the next pass sees them done' },
  ],
}

const REPO = '/private/tmp/wfprobe/runs/PS-7'
const CHANGE = 'bolt-abc'

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
          reason: { type: 'string', description: 'one line: why this can start now' },
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
          waitsOn: { type: 'string', description: 'task id(s) this waits on, and why' },
        },
        required: ['id', 'description', 'waitsOn'],
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
    contents: { type: 'string' },
    ok: { type: 'boolean' },
  },
  required: ['id', 'path', 'ok'],
}

const RECORD_SCHEMA = {
  type: 'object',
  properties: {
    markedIds: { type: 'array', items: { type: 'string' } },
    tasksFileAfter: { type: 'string', description: 'the full contents of tasks.md after editing' },
  },
  required: ['markedIds'],
}

const analysePrompt = (pass) => `You are the ANALYSE phase of pass ${pass} of the construction loop for OpenSpec change \`${CHANGE}\` (schema \`loopdemo\`) in ${REPO}.

Do this now, fresh — do NOT assume any earlier pass's answer still holds:

1. Run: \`cd ${REPO} && openspec instructions apply --change ${CHANGE} --json\`
2. Its \`tasks\` array holds one entry per task as {id, description, done}.
3. Consider ONLY the tasks with done=false. Nothing in the data declares dependencies between tasks — you must infer them by reading the descriptions (e.g. a task that consumes an artifact another task produces cannot start until that other task is done).
4. Split the not-done tasks into:
   - startable: can be STARTED NOW, with a one-line reason each.
   - waiting: must wait, naming the task id(s) it waits on and why.

Every not-done task must appear in exactly one of the two lists. Return notDoneIds as the ids of all done=false tasks. Do not build anything and do not edit any file — analysis only.`

const buildPrompt = (t, pass) => `You are the BUILD phase of pass ${pass} for OpenSpec change \`${CHANGE}\` in ${REPO}.

Build exactly one task:
  id: ${t.id}
  description: ${t.description}

The build step for this schema is defined as: write the file \`${REPO}/out/${t.id}.txt\` containing the single line:
built ${t.id}

Write that file (the out/ directory already exists) and nothing else. Do not touch tasks.md, do not touch any other task's output file. Return the id, the absolute path you wrote, its contents, and ok=true only if the write succeeded.`

const recordPrompt = (ids, pass) => `You are the RECORD phase of pass ${pass} for OpenSpec change \`${CHANGE}\`.

These task ids were just built successfully: ${ids.join(', ')}.

Edit \`${REPO}/openspec/changes/${CHANGE}/tasks.md\` and flip the checkbox from \`- [ ]\` to \`- [x]\` for exactly those tasks (match them by their description text — task ids are the 1-based order of the checklist lines under "## Build"). Leave every other line, including already-ticked ones, byte-for-byte unchanged. Before finishing, verify by running \`cd ${REPO} && openspec instructions apply --change ${CHANGE} --json\` that those ids now report done=true.

Return the ids you marked and the full contents of tasks.md afterwards.`

const MAX_PASSES = 6
const passes = []
let pass = 0
let stopReason = 'max passes reached'

while (pass < MAX_PASSES) {
  pass++
  log(`Pass ${pass}: analysing task list`)

  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSIS_SCHEMA,
  })

  if (!analysis) {
    stopReason = `analyse agent failed on pass ${pass}`
    break
  }

  if (analysis.notDoneIds.length === 0) {
    stopReason = `all tasks done as of pass ${pass}`
    passes.push({ pass, startable: [], waiting: [], built: [], note: 'nothing left to do' })
    break
  }

  if (analysis.startable.length === 0) {
    stopReason = `pass ${pass}: no startable tasks — ${analysis.waiting.length} still blocked (deadlock or external dependency)`
    passes.push({ pass, startable: [], waiting: analysis.waiting, built: [] })
    break
  }

  log(`Pass ${pass}: ${analysis.startable.length} startable (${analysis.startable.map(t => t.id).join(', ')}), ${analysis.waiting.length} waiting`)

  // Barrier is intentional: the whole pass's builds must land before tasks.md
  // is edited (single writer) and before the next pass re-queries the CLI.
  const builds = await parallel(analysis.startable.map(t => () =>
    agent(buildPrompt(t, pass), { label: `build:task-${t.id}`, phase: 'Build', schema: BUILD_SCHEMA })
  ))

  const succeeded = builds.filter(Boolean).filter(b => b.ok)
  const failedIds = analysis.startable
    .map(t => t.id)
    .filter(id => !succeeded.some(b => b.id === id))

  if (failedIds.length) log(`Pass ${pass}: build failed for ${failedIds.join(', ')}`)

  let record = null
  if (succeeded.length) {
    record = await agent(recordPrompt(succeeded.map(b => b.id), pass), {
      label: `record:pass-${pass}`,
      phase: 'Record',
      schema: RECORD_SCHEMA,
    })
  }

  passes.push({
    pass,
    startable: analysis.startable,
    waiting: analysis.waiting,
    built: succeeded.map(b => ({ id: b.id, path: b.path })),
    failedIds,
    marked: record ? record.markedIds : [],
  })

  if (!succeeded.length) {
    stopReason = `pass ${pass}: every startable build failed — halting rather than looping`
    break
  }

  if (analysis.waiting.length === 0) {
    stopReason = `pass ${pass}: nothing left waiting`
    break
  }
}

const allBuilt = passes.flatMap(p => p.built.map(b => b.id))
log(`Loop finished after ${pass} pass(es): built ${allBuilt.join(', ') || 'nothing'}`)

return { change: CHANGE, passesRun: pass, stopReason, allBuilt, passes }
