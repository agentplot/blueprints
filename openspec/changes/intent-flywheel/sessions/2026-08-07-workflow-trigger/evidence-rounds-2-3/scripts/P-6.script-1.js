export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive the bolt-abc loopdemo construction loop: re-query tasks each pass, analyse dependencies, build startable tasks',
  phases: [
    { title: 'Pass 1', detail: 'query + analyse, build startable, mark done' },
    { title: 'Pass 2', detail: 'requery, build newly-unblocked tasks' },
    { title: 'Pass 3', detail: 'requery, confirm drained' },
  ],
}

const REPO = '/private/tmp/wfprobe/runs/P-6'
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
          waitsOn: { type: 'string', description: 'which task id(s) it waits on and why' },
        },
        required: ['id', 'description', 'waitsOn'],
      },
    },
    remainingNotDone: { type: 'number', description: 'count of tasks with done=false in this query' },
  },
  required: ['startable', 'waiting', 'remainingNotDone'],
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    filePath: { type: 'string' },
    contents: { type: 'string' },
    ok: { type: 'boolean' },
  },
  required: ['id', 'filePath', 'contents', 'ok'],
}

const MARK_SCHEMA = {
  type: 'object',
  properties: {
    markedIds: { type: 'array', items: { type: 'string' } },
    tasksFileAfter: { type: 'string', description: 'full contents of tasks.md after the edit' },
    ok: { type: 'boolean' },
  },
  required: ['markedIds', 'tasksFileAfter', 'ok'],
}

const analysePrompt = (pass) => `You are running pass ${pass} of the construction loop for OpenSpec change \`${CHANGE}\` (schema: loopdemo), repo root ${REPO}.

STEP 1 — re-run the query FRESH. Do not rely on any prior knowledge of the task list:

  cd ${REPO} && openspec instructions apply --change ${CHANGE} --json

Its \`tasks\` array holds one entry per task as {id, description, done}.

STEP 2 — analyse. Considering ONLY tasks with done=false, decide from the DESCRIPTIONS which can be STARTED NOW and which must WAIT on another task in the list. Nothing declares those relationships — inferring them from the description text is the job. A task waits only if its description implies it depends on another not-done task in this list; a dependency on a task that is already done=true is satisfied, so that task is startable.

Return the startable ids each with a one-line reason, the waiting ids each with what they wait on, and remainingNotDone = the count of done=false tasks you saw in this query.

Do NOT write any files. Analysis only.`

const buildPrompt = (t) => `Build task ${t.id} of OpenSpec change ${CHANGE}: "${t.description}".

In this loopdemo schema, "building" a task means exactly one filesystem action: write the file
  ${REPO}/out/${t.id}.txt
containing the single line:
  built ${t.id}

Use the Write tool. Write nothing else, create no other files, and do not touch tasks.md or any other task's output file. Then read the file back to confirm and report its path and contents.`

const markPrompt = (ids) => `In ${REPO}/openspec/changes/${CHANGE}/tasks.md, mark these just-built tasks complete by flipping their checkbox from \`- [ ]\` to \`- [x]\`: task ids ${ids.join(', ')}.

Task ids are 1-based positions over the task checkboxes in the file, in order (task 1 = first checkbox line, task 2 = second, ...). Verify by running \`cd ${REPO} && openspec instructions apply --change ${CHANGE} --json\` first and matching each id to its description, then edit only those lines. Change nothing else in the file — not the wording, not other checkboxes.

Afterwards, return the ids you marked and the full contents of tasks.md.`

const passesLog = []
const builtAll = []
const MAX_PASSES = 5

for (let pass = 1; pass <= MAX_PASSES; pass++) {
  const title = `Pass ${pass}`
  phase(title)
  log(`Pass ${pass}: re-querying task list and analysing dependencies`)

  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: title,
    schema: ANALYSIS_SCHEMA,
  })

  if (!analysis) {
    log(`Pass ${pass}: analysis agent failed — stopping loop`)
    passesLog.push({ pass, error: 'analysis agent returned null' })
    break
  }

  const startable = analysis.startable || []
  const waiting = analysis.waiting || []

  if (startable.length === 0) {
    log(`Pass ${pass}: nothing startable (${analysis.remainingNotDone} not-done, ${waiting.length} waiting) — loop drained`)
    passesLog.push({ pass, startable: [], waiting, remainingNotDone: analysis.remainingNotDone, built: [] })
    break
  }

  log(`Pass ${pass}: startable = [${startable.map(t => t.id).join(', ')}]; waiting = [${waiting.map(t => `${t.id} on ${t.waitsOn}`).join('; ') || 'none'}]`)

  // Build every startable task concurrently — they are independent by construction.
  const builds = (await parallel(startable.map(t => () =>
    agent(buildPrompt(t), { label: `build:task-${t.id}`, phase: title, schema: BUILD_SCHEMA })
  ))).filter(Boolean)

  const builtIds = builds.filter(b => b.ok).map(b => b.id)

  if (builtIds.length === 0) {
    log(`Pass ${pass}: no task built successfully — stopping to avoid spinning`)
    passesLog.push({ pass, startable, waiting, remainingNotDone: analysis.remainingNotDone, built: [], builds })
    break
  }

  // Single writer for tasks.md so concurrent builders never collide on the same file.
  // This is also what makes the next pass's query return different data.
  const marked = await agent(markPrompt(builtIds), {
    label: `mark-done:${builtIds.join(',')}`,
    phase: title,
    schema: MARK_SCHEMA,
  })

  builtAll.push(...builtIds)
  passesLog.push({
    pass,
    startable,
    waiting,
    remainingNotDone: analysis.remainingNotDone,
    built: builtIds,
    buildOutputs: builds.map(b => ({ id: b.id, filePath: b.filePath, contents: b.contents })),
    marked: marked ? marked.markedIds : null,
    tasksFileAfter: marked ? marked.tasksFileAfter : null,
  })

  if (waiting.length === 0) {
    log(`Pass ${pass}: built [${builtIds.join(', ')}] and nothing is waiting — one more pass to confirm`)
  } else {
    log(`Pass ${pass}: built [${builtIds.join(', ')}]; ${waiting.length} still waiting — looping`)
  }
}

return {
  change: CHANGE,
  builtAcrossAllPasses: builtAll,
  passes: passesLog,
}
