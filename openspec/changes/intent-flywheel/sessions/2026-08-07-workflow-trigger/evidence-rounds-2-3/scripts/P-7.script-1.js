export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Run the bolt-abc loopdemo construction loop: analyse startable tasks, build them, repeat until none remain',
  phases: [
    { title: 'Analyse', detail: 're-query openspec each pass, classify not-done tasks as startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
    { title: 'Record', detail: 'mark built tasks complete in tasks.md' },
  ],
}

const CHANGE = 'bolt-abc'
const REPO = '/private/tmp/wfprobe/runs/P-7'

const ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    startable: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'task id from the tasks array' },
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
          waitsOn: { type: 'string', description: 'which task id(s) it waits on, and why' },
        },
        required: ['id', 'description', 'waitsOn'],
      },
    },
    notDoneCount: { type: 'integer', description: 'total number of tasks with done=false' },
  },
  required: ['startable', 'waiting', 'notDoneCount'],
}

const analysePrompt = (pass) => `You are running the ANALYSE phase (pass ${pass}) of the construction loop for OpenSpec change \`${CHANGE}\`.

Run this command from ${REPO} and read its \`tasks\` array (entries are {id, description, done}):

  openspec instructions apply --change ${CHANGE} --json

Re-run it now — do NOT rely on any earlier pass's answer.

Consider ONLY tasks with done=false. Nothing in the data declares dependencies between tasks; you must infer them by reading the descriptions. A task is STARTABLE if nothing in its description makes it depend on another not-done task in the list. A task is WAITING if its description says or implies it needs another task in the list that is not yet done.

Note: a dependency is only blocking while the task it depends on is still not-done. If the depended-on task now has done=true, the dependent task is startable.

Return the classification. \`notDoneCount\` is the total count of done=false tasks in the query output. Do not write any files in this phase.`

const buildPrompt = (t) => `You are running the BUILD phase of the construction loop for OpenSpec change \`${CHANGE}\`.

Build task ${t.id}: "${t.description}"

The build action for this schema is exactly: create the file \`${REPO}/out/${t.id}.txt\` containing the single line:

built ${t.id}

Create the \`out\` directory if it does not exist. Write nothing else, touch no other file. Reply with just: built ${t.id}`

const recordPrompt = (ids) => `Mark tasks complete in \`${REPO}/openspec/changes/${CHANGE}/tasks.md\`.

These task ids were built and must flip from \`- [ ]\` to \`- [x]\`: ${ids.join(', ')}

Task ids are 1-based positions in the file's task checklist order (task 1 = first \`- [ ]\`/\`- [x]\` line, and so on). Read the file, edit only the checkbox characters for those task lines, and change nothing else — not the task text, not any other line. Reply with the resulting checklist.`

const built = []
const passLog = []
let pass = 0
let lastWaiting = []

while (pass < 6) {
  pass++
  phase('Analyse')
  log(`Pass ${pass}: re-querying openspec for ${CHANGE}`)

  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSIS_SCHEMA,
  })

  if (!analysis) {
    log(`Pass ${pass}: analysis failed, stopping`)
    break
  }

  lastWaiting = analysis.waiting || []
  const startable = analysis.startable || []

  passLog.push({
    pass,
    notDoneCount: analysis.notDoneCount,
    startable: startable.map((t) => ({ id: t.id, reason: t.reason })),
    waiting: lastWaiting.map((t) => ({ id: t.id, waitsOn: t.waitsOn })),
  })

  if (analysis.notDoneCount === 0) {
    log(`Pass ${pass}: no not-done tasks remain — loop complete`)
    break
  }

  if (startable.length === 0) {
    log(`Pass ${pass}: ${lastWaiting.length} task(s) waiting, none startable — deadlock, stopping`)
    break
  }

  log(`Pass ${pass}: ${startable.length} startable (${startable.map((t) => t.id).join(', ')}), ${lastWaiting.length} waiting`)

  phase('Build')
  const results = await parallel(
    startable.map((t) => () =>
      agent(buildPrompt(t), { label: `build:task-${t.id}`, phase: 'Build' }).then((r) => (r ? t : null))
    )
  )

  const madeThisPass = results.filter(Boolean)
  if (madeThisPass.length === 0) {
    log(`Pass ${pass}: every build failed, stopping`)
    break
  }

  built.push(...madeThisPass.map((t) => ({ pass, id: t.id, description: t.description })))

  phase('Record')
  await agent(recordPrompt(madeThisPass.map((t) => t.id)), {
    label: `record:pass-${pass}`,
    phase: 'Record',
    effort: 'low',
  })
}

return {
  change: CHANGE,
  passes: pass,
  built,
  stillWaiting: lastWaiting,
  passLog,
}
