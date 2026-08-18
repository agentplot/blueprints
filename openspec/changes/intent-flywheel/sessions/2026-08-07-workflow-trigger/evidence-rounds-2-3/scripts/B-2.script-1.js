export const meta = {
  name: 'bolt-abc-construction',
  description: 'Drive bolt-abc: analyse which tasks are startable, build those, record them, repeat until only blocked tasks remain',
  phases: [
    { title: 'Analyse', detail: 'query openspec apply instructions and infer startable vs waiting from task descriptions' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<task-id>.txt' },
    { title: 'Record', detail: 'mark the built tasks complete in tasks.md so the next pass query is accurate' },
  ],
}

const CHANGE = 'bolt-abc'
const REPO = '/private/tmp/wfprobe/runs/B-2'
const MAX_PASSES = 6

const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['startable', 'waiting'],
  properties: {
    startable: {
      type: 'array',
      description: 'Not-done tasks that can be STARTED NOW',
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
      description: 'Not-done tasks that must wait on another task in the list',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'description', 'waitsOn', 'reason'],
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'array', items: { type: 'string' }, description: 'task ids this waits on' },
          reason: { type: 'string', description: 'one line: what it waits on and why' },
        },
      },
    },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'path', 'contents'],
  properties: {
    id: { type: 'string', description: 'the task id handled' },
    path: { type: 'string', description: 'absolute path of the file written' },
    contents: { type: 'string', description: 'the exact contents written' },
  },
}

const RECORD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['marked', 'tasksFileAfter'],
  properties: {
    marked: { type: 'array', items: { type: 'string' }, description: 'task ids whose checkbox was flipped to [x]' },
    tasksFileAfter: { type: 'string', description: 'the full contents of tasks.md after the edit' },
  },
}

const analysePrompt = `You are the analyse phase of the construction loop for the OpenSpec change \`${CHANGE}\`.

Working directory: ${REPO}

Run exactly this command and read its JSON output:

    openspec instructions apply --change ${CHANGE} --json

The output has a \`tasks\` array whose entries are \`{id, description, done}\`.

Your job: among the tasks where \`done\` is false, decide which can be
STARTED NOW and which must wait on another task in that same list.

Nothing in the data declares those relationships. There is no dependency
field, no ordering guarantee, and the array order means nothing. Working
the relationships out by READING THE DESCRIPTIONS is your entire job — a
description may state a prerequisite in prose, name another task's
subject, or imply that it consumes something another task produces.

A task is startable only if nothing it depends on is still not-done. A
task whose prerequisite is already marked done is startable — a satisfied
prerequisite is not a blocker.

Return every not-done task in exactly one of the two lists, with a
one-line reason each. Do not invent tasks and do not include done tasks.`

const buildPrompt = (t) => `You are a build agent in the construction loop for the OpenSpec change \`${CHANGE}\`.

Working directory: ${REPO}

You have been assigned exactly one task:

    id:          ${t.id}
    description: ${t.description}

Your entire charge is:

1. Ensure the directory ${REPO}/out exists (create it if it does not).
2. Write the file ${REPO}/out/${t.id}.txt whose contents are the single
   line:

       built ${t.id}

   That single line is the whole file. Do not add a heading, a trailing
   commentary line, JSON, or any other content.
3. Return the id you handled, the absolute path you wrote, and the exact
   contents.

Do NOT edit tasks.md. Do NOT touch any other task's output file. Do NOT
attempt to actually implement the software the description names — this
loop's build step is the marker file above and nothing more.`

const recordPrompt = (built) => `You are the record step of the construction loop for the OpenSpec change \`${CHANGE}\`.

Edit exactly this file: ${REPO}/openspec/changes/${CHANGE}/tasks.md

The following tasks were just built and must now be marked complete:

${built.map((b) => `    - id ${b.id}: ${b.description}`).join('\n')}

For each one, find its line in tasks.md — matched by the task text, not
by line number — and change its checkbox from \`- [ ]\` to \`- [x]\`.

Change NOTHING else. Do not reword a task, do not reorder lines, do not
add or remove lines, do not touch any other task's checkbox, and do not
edit any other file. Read the file first, then make each edit as an exact
string replacement.

Return the ids you flipped and the full contents of the file afterwards.`

const passes = []
let lastWaiting = []
let passNo = 0
let stopReason = 'no startable tasks remain'

while (passNo < MAX_PASSES) {
  passNo++
  log(`pass ${passNo}: querying openspec for current task state`)

  const analysis = await agent(analysePrompt, {
    label: `analyse:pass-${passNo}`,
    phase: 'Analyse',
    schema: ANALYSIS_SCHEMA,
  })

  if (!analysis) {
    stopReason = `pass ${passNo}: the analyse agent returned nothing, so the pass could not proceed`
    log(stopReason)
    break
  }

  const startable = analysis.startable || []
  const waiting = analysis.waiting || []
  lastWaiting = waiting

  log(`pass ${passNo}: ${startable.length} startable [${startable.map((t) => t.id).join(', ') || '-'}], ${waiting.length} waiting [${waiting.map((t) => t.id).join(', ') || '-'}]`)

  if (startable.length === 0) {
    if (waiting.length > 0) {
      stopReason = `pass ${passNo}: nothing is startable but ${waiting.length} task(s) still wait — the remaining tasks are blocked on something outside this loop`
    } else {
      stopReason = `pass ${passNo}: every task is done`
    }
    passes.push({ pass: passNo, startable: [], waiting, built: [], marked: [] })
    log(stopReason)
    break
  }

  // Barrier is correct here: the record step and the NEXT pass's query both
  // depend on every build in this pass having landed.
  const builds = (await parallel(
    startable.map((t) => () =>
      agent(buildPrompt(t), { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA })
    )
  )).filter(Boolean)

  const failed = startable.filter((t) => !builds.some((b) => b.id === t.id))
  if (failed.length > 0) {
    log(`pass ${passNo}: ${failed.length} build(s) returned nothing and will NOT be marked complete: ${failed.map((t) => t.id).join(', ')}`)
  }

  const builtTasks = startable.filter((t) => builds.some((b) => b.id === t.id))

  let marked = []
  if (builtTasks.length > 0) {
    const record = await agent(recordPrompt(builtTasks), {
      label: `record:pass-${passNo}`,
      phase: 'Record',
      schema: RECORD_SCHEMA,
    })
    marked = record ? (record.marked || []) : []
    if (!record) {
      stopReason = `pass ${passNo}: the record step returned nothing, so tasks.md was not updated and a further pass would re-read stale state`
      passes.push({ pass: passNo, startable, waiting, built: builds.map((b) => b.id), marked: [] })
      log(stopReason)
      break
    }
    log(`pass ${passNo}: marked complete in tasks.md: ${marked.join(', ') || '-'}`)
  }

  passes.push({
    pass: passNo,
    startable: startable.map((t) => ({ id: t.id, reason: t.reason })),
    waiting: waiting.map((t) => ({ id: t.id, waitsOn: t.waitsOn, reason: t.reason })),
    built: builds.map((b) => b.id),
    marked,
  })

  if (builtTasks.length === 0) {
    stopReason = `pass ${passNo}: no build succeeded, so a further pass would repeat the same work`
    log(stopReason)
    break
  }
}

if (passNo >= MAX_PASSES) {
  stopReason = `stopped at the ${MAX_PASSES}-pass cap — work may remain; this is a cap, not a completion`
  log(stopReason)
}

return {
  change: CHANGE,
  passesRun: passes.length,
  stopReason,
  builtAllPasses: passes.flatMap((p) => p.built),
  stillWaiting: lastWaiting,
  passes,
}
