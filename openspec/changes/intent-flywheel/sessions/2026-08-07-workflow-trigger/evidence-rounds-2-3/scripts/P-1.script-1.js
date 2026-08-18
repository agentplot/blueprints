export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive the bolt-abc loopdemo construction loop: analyse task readiness, build startable tasks, repeat',
  phases: [
    { title: 'Analyse', detail: 'Re-query openspec instructions and classify tasks as startable or waiting' },
    { title: 'Build', detail: 'One agent per startable task: write out/<id>.txt' },
    { title: 'Commit', detail: 'Serialized: tick completed task checkboxes in tasks.md' },
  ],
}

const CHANGE = 'bolt-abc'
const ROOT = '/private/tmp/wfprobe/runs/P-1'

const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['startable', 'waiting', 'remainingCount'],
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
          reason: { type: 'string', description: 'One line: why this can start now' },
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
          waitsOn: { type: 'string', description: 'Which task id(s) it waits on and why' },
        },
      },
    },
    remainingCount: { type: 'number', description: 'Total not-done tasks in this query' },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'ok'],
  properties: {
    id: { type: 'string' },
    ok: { type: 'boolean' },
    note: { type: 'string' },
  },
}

const built = []
const passLog = []
let pass = 0

while (pass < 6) {
  pass++
  phase('Analyse')

  const analysis = await agent(
    `You are driving the construction loop for OpenSpec change \`${CHANGE}\`, pass ${pass}.

Run this command from ${ROOT}:

    openspec instructions apply --change ${CHANGE} --json

Its \`tasks\` array holds one entry per task as {id, description, done}. Do NOT rely on any
earlier pass's answer — this fresh query is the source of truth.

Consider ONLY tasks with done === false. By reading the descriptions, decide which of those
can be STARTED NOW and which must wait on another task in the list. Nothing in the data
declares those relationships; inferring them from the wording is the job. A task waits only
if it depends on another task that is still not done — if its blocker already shows
done === true in this query, it is startable now.

Return the startable tasks with a one-line reason each, and the waiting tasks with what
they wait on. remainingCount is the number of not-done tasks you saw.
Do not build anything and do not edit any files.`,
    { label: `analyse:pass-${pass}`, phase: 'Analyse', schema: ANALYSIS_SCHEMA },
  )

  if (!analysis) {
    log(`Pass ${pass}: analysis agent failed — stopping loop.`)
    break
  }

  if (analysis.remainingCount === 0) {
    log(`Pass ${pass}: no tasks remain. Loop complete.`)
    passLog.push({ pass, startable: [], waiting: [], note: 'all tasks done' })
    break
  }

  log(
    `Pass ${pass}: ${analysis.startable.length} startable [${analysis.startable.map(t => t.id).join(', ')}], ` +
    `${analysis.waiting.length} waiting [${analysis.waiting.map(t => t.id).join(', ')}]`,
  )

  if (analysis.startable.length === 0) {
    log(`Pass ${pass}: nothing startable but ${analysis.remainingCount} task(s) still open — deadlock, stopping.`)
    passLog.push({ pass, startable: [], waiting: analysis.waiting, note: 'deadlock: no startable tasks' })
    break
  }

  phase('Build')

  const results = await parallel(
    analysis.startable.map(task => () =>
      agent(
        `Build task ${task.id} of OpenSpec change \`${CHANGE}\`.

Task: ${task.description}

The loopdemo schema defines "build" as exactly this: from ${ROOT}, create the directory
\`out\` if it does not exist, then write the file \`out/${task.id}.txt\` whose entire
contents are the single line:

built ${task.id}

Write nothing else. Do NOT edit tasks.md, openspec/, or any other file — a separate step
records completion. Confirm the file exists with the expected content before returning.`,
        { label: `build:${task.id}`, phase: 'Build', schema: BUILD_SCHEMA },
      ),
    ),
  )

  const succeeded = results.filter(Boolean).filter(r => r.ok)
  const failed = results.filter(Boolean).filter(r => !r.ok)
  if (results.some(r => !r)) log(`Pass ${pass}: ${results.filter(r => !r).length} build agent(s) died.`)
  if (failed.length) log(`Pass ${pass}: build failed for [${failed.map(r => r.id).join(', ')}]`)

  if (succeeded.length === 0) {
    log(`Pass ${pass}: no task built successfully — stopping to avoid a spin.`)
    passLog.push({ pass, startable: analysis.startable, waiting: analysis.waiting, note: 'all builds failed' })
    break
  }

  // Serialized so parallel builders never race on the same file.
  phase('Commit')
  const ids = succeeded.map(r => r.id)
  await agent(
    `In ${ROOT}/openspec/changes/${CHANGE}/tasks.md, mark these tasks complete by changing
their checkbox from \`- [ ]\` to \`- [x]\`: task ids ${ids.join(', ')}.

Task ids are 1-based positions in the checkbox list in file order (task "1" is the first
\`- [\` line, task "2" the second, and so on). Change only the checkbox characters — leave
every task's wording, ordering, and the rest of the file byte-identical. Do not tick any
task not listed above.

Then re-run \`openspec instructions apply --change ${CHANGE} --json\` and confirm those ids
now report done === true. Return a one-line confirmation.`,
    { label: `commit:pass-${pass}`, phase: 'Commit' },
  )

  built.push(...succeeded.map(r => r.id))
  passLog.push({
    pass,
    builtIds: ids,
    startable: analysis.startable,
    waiting: analysis.waiting,
    failed: failed.map(r => r.id),
  })
}

return { change: CHANGE, passes: passLog, builtIds: built }
