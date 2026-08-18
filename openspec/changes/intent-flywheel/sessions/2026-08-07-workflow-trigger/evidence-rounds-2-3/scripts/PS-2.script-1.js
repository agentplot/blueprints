export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive the bolt-abc loopdemo construction loop: re-query tasks each pass, analyse readiness, build startable tasks',
  phases: [
    { title: 'Analyse', detail: 'query openspec, classify not-done tasks as startable vs waiting' },
    { title: 'Build', detail: 'write out/<task-id>.txt for each startable task' },
    { title: 'Mark complete', detail: 'flip built tasks to [x] in tasks.md' },
  ],
}

const CHANGE = 'bolt-abc'
const ROOT = '/private/tmp/wfprobe/runs/PS-2'
const TASKS_MD = `${ROOT}/openspec/changes/${CHANGE}/tasks.md`
const MAX_PASSES = 6

const ANALYSE_SCHEMA = {
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
          reason: { type: 'string' },
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
          waitingOn: { type: 'string' },
        },
        required: ['id', 'description', 'waitingOn'],
      },
    },
    notDoneCount: { type: 'number' },
    doneIds: { type: 'array', items: { type: 'string' } },
  },
  required: ['startable', 'waiting', 'notDoneCount', 'doneIds'],
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

const MARK_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    markedIds: { type: 'array', items: { type: 'string' } },
    tasksFileAfter: { type: 'string' },
    ok: { type: 'boolean' },
  },
  required: ['markedIds', 'tasksFileAfter', 'ok'],
}

const analysePrompt = (pass) => `You are the ANALYSE phase of pass ${pass} of the construction loop for OpenSpec change "${CHANGE}".

Run this command fresh right now (do NOT rely on any cached or remembered result from an earlier pass):

  cd ${ROOT} && openspec instructions apply --change ${CHANGE} --json

Its \`tasks\` array holds one entry per task as {id, description, done}.

Your job: among the tasks with done === false, decide which can be STARTED NOW and which must WAIT on another task in the list. Nothing in the data declares these relationships — you must infer them by reading the task descriptions. A task waits only if it depends on another task that is still not done; if its dependency is already done, it is startable.

Return:
- startable: each not-done task that can start now, with its id, its exact description string, and a one-line reason.
- waiting: each not-done task that must wait, with its id, its exact description string, and what it waits on.
- notDoneCount: total number of tasks with done === false.
- doneIds: ids of tasks with done === true.

Do NOT write, create, or edit any files in this phase. Analysis only.`

const buildPrompt = (task, pass) => `You are the BUILD phase of pass ${pass} of the construction loop for OpenSpec change "${CHANGE}".

Build exactly one task:
  id: ${task.id}
  description: ${task.description}

Building a task means: write the file ${ROOT}/out/${task.id}.txt containing the single line:

  built ${task.id}

That is the entire build step for this schema — do not create any other files, do not edit ${TASKS_MD}, and do not touch any other task's output file.

After writing, read the file back and report its id, absolute path, exact contents, and whether it succeeded.`

const markPrompt = (tasks, pass) => `You are the MARK-COMPLETE phase of pass ${pass} of the construction loop for OpenSpec change "${CHANGE}".

These tasks were just built successfully in this pass:
${tasks.map((t) => `  - id ${t.id}: ${t.description}`).join('\n')}

Edit ${TASKS_MD} and flip ONLY those tasks' checkboxes from "- [ ]" to "- [x]". Match each task by its exact description text on the line. Leave every other line — including tasks that are still waiting and tasks already marked [x] — byte-for-byte unchanged. Do not reorder, reword, or reformat anything.

Then verify by running:

  cd ${ROOT} && openspec instructions apply --change ${CHANGE} --json

and confirm each id above now reports done === true.

Report the ids you marked, the full post-edit contents of ${TASKS_MD}, and whether the verification passed.`

const passes = []
let pass = 0
let deadlock = null

while (pass < MAX_PASSES) {
  pass += 1
  log(`Pass ${pass}: re-querying openspec and analysing task readiness`)

  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSE_SCHEMA,
  })

  if (!analysis) {
    deadlock = `Pass ${pass}: analyse agent returned no result; aborting loop.`
    log(deadlock)
    break
  }

  if (analysis.notDoneCount === 0) {
    log(`Pass ${pass}: no not-done tasks remain — loop complete.`)
    passes.push({ pass, startable: [], waiting: [], built: [], marked: [], terminal: true })
    break
  }

  if (analysis.startable.length === 0) {
    deadlock = `Pass ${pass}: ${analysis.notDoneCount} task(s) still not done but none are startable — waiting on: ${analysis.waiting
      .map((w) => `${w.id} (${w.waitingOn})`)
      .join('; ')}. Stopping to avoid an infinite loop.`
    log(deadlock)
    passes.push({ pass, startable: [], waiting: analysis.waiting, built: [], marked: [], terminal: true })
    break
  }

  log(
    `Pass ${pass}: startable = [${analysis.startable.map((t) => t.id).join(', ')}]; ` +
      `waiting = [${analysis.waiting.map((t) => `${t.id}<-${t.waitingOn}`).join(', ') || 'none'}]`
  )

  const builds = (
    await parallel(
      analysis.startable.map((task) => () =>
        agent(buildPrompt(task, pass), {
          label: `build:${task.id}`,
          phase: 'Build',
          schema: BUILD_SCHEMA,
        })
      )
    )
  ).filter(Boolean)

  const built = builds.filter((b) => b.ok)
  const failed = analysis.startable.filter((t) => !built.some((b) => b.id === t.id))

  if (failed.length) {
    log(`Pass ${pass}: build FAILED for task(s) ${failed.map((t) => t.id).join(', ')}`)
  }

  if (built.length === 0) {
    deadlock = `Pass ${pass}: every build attempt failed; stopping.`
    log(deadlock)
    passes.push({ pass, startable: analysis.startable, waiting: analysis.waiting, built: [], marked: [], terminal: true })
    break
  }

  const builtTasks = built.map((b) => analysis.startable.find((t) => t.id === b.id))
  log(`Pass ${pass}: built [${built.map((b) => b.id).join(', ')}] — marking complete in tasks.md`)

  const marked = await agent(markPrompt(builtTasks, pass), {
    label: `mark:pass-${pass}`,
    phase: 'Mark complete',
    schema: MARK_SCHEMA,
  })

  passes.push({
    pass,
    startable: analysis.startable,
    waiting: analysis.waiting,
    built: built.map((b) => ({ id: b.id, path: b.path, contents: b.contents })),
    marked: marked ? marked.markedIds : [],
    markOk: marked ? marked.ok : false,
    tasksFileAfter: marked ? marked.tasksFileAfter : null,
  })

  if (!marked || !marked.ok) {
    deadlock = `Pass ${pass}: could not verify tasks.md checkbox updates; stopping before the next pass to avoid rebuilding the same tasks.`
    log(deadlock)
    break
  }

  if (analysis.waiting.length === 0) {
    log(`Pass ${pass}: nothing left waiting — one confirmation pass next.`)
  }
}

if (pass >= MAX_PASSES && !deadlock) {
  deadlock = `Hit the ${MAX_PASSES}-pass safety cap without draining the task list.`
  log(deadlock)
}

return {
  change: CHANGE,
  passesRun: pass,
  deadlock,
  passes,
  allBuiltIds: passes.flatMap((p) => p.built.map((b) => b.id)),
}
