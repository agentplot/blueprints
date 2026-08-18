export const meta = {
  name: 'bolt-abc-construction',
  description: 'Drive the bolt-abc loopdemo construction loop: re-query, analyse startability, build startable tasks, repeat',
  phases: [
    { title: 'Analyse', detail: 'query openspec instructions and derive startable vs waiting tasks' },
    { title: 'Build', detail: 'one agent per startable task writes out/<id>.txt' },
    { title: 'Record', detail: 'single writer marks built tasks done in tasks.md' },
  ],
}

const REPO = '/private/tmp/wfprobe/runs/PC-5'

const ANALYSIS = {
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
          waitsOn: { type: 'string', description: 'which task id(s) it waits on, and why' },
        },
        required: ['id', 'description', 'waitsOn'],
      },
    },
    remainingCount: { type: 'number', description: 'number of not-done tasks in this query' },
  },
  required: ['startable', 'waiting', 'remainingCount'],
}

const analysePrompt = (pass) => `Pass ${pass} of the bolt-abc construction loop. Work in ${REPO}.

Run exactly this command and read its JSON output:

  openspec instructions apply --change bolt-abc --json

The \`tasks\` array holds one entry per task as {id, description, done}. Consider ONLY
the entries where done is false.

Nothing in the data declares dependencies between tasks. Derive them by READING the
descriptions: a description may state that a task cannot start until some other named
piece of work is built, or may name a component another task produces. Treat a task as
startable when nothing it depends on is still not-done. A dependency whose task is
already done (or whose output file already exists under ${REPO}/out/) no longer blocks.

Check ${REPO}/out/ to see which pieces have already been built this run.

Return the startable not-done tasks with a one-line reason each, the waiting not-done
tasks with what each waits on, and remainingCount = the number of not-done tasks.
Do not build anything. Do not edit any file.`

const buildPrompt = (t) => `Build task ${t.id} of change bolt-abc: "${t.description}".

Write the file ${REPO}/out/${t.id}.txt containing exactly the single line:

built ${t.id}

That file is the entire deliverable. Do not edit tasks.md, do not touch any other task's
output file, do not create any other file. Reply with the path you wrote.`

const recordPrompt = (built) => `In ${REPO}/openspec/changes/bolt-abc/tasks.md, mark these
just-built tasks complete by changing their checkbox from "- [ ]" to "- [x]":

${built.map((t) => `  - task ${t.id}: ${t.description}`).join('\n')}

Match each task by its description text on the line. Change ONLY the checkbox characters
on those lines — leave every other line, including already-checked ones, untouched. You
are the only writer of this file in this pass. Reply with the lines you changed.`

const MAX_PASSES = 6
const builtByPass = []
let lastWaiting = []
let stopReason = 'all tasks built'

for (let pass = 1; pass <= MAX_PASSES; pass++) {
  phase('Analyse')
  const plan = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSIS,
  })

  if (!plan) {
    stopReason = `analysis agent failed on pass ${pass}`
    break
  }

  lastWaiting = plan.waiting || []
  const startable = plan.startable || []

  log(`pass ${pass}: ${plan.remainingCount} not-done — ${startable.length} startable, ${lastWaiting.length} waiting`)

  if (plan.remainingCount === 0) {
    stopReason = 'all tasks built'
    break
  }

  if (startable.length === 0) {
    stopReason = `pass ${pass} found ${lastWaiting.length} not-done task(s) and none startable — dependency cycle or unmet external blocker`
    break
  }

  // Barrier is correct here: the next pass re-queries task state, so every build
  // and its checkbox must be recorded before the next analysis runs.
  phase('Build')
  const results = await parallel(
    startable.map((t) => () =>
      agent(buildPrompt(t), { label: `build:${t.id}`, phase: 'Build' }).then((r) => (r ? t : null))
    )
  )

  const built = results.filter(Boolean)
  const failed = startable.filter((t) => !built.some((b) => b.id === t.id))
  if (failed.length) log(`pass ${pass}: build failed for task(s) ${failed.map((t) => t.id).join(', ')}`)

  if (built.length === 0) {
    stopReason = `pass ${pass}: every build agent failed; no progress possible`
    break
  }

  phase('Record')
  const recorded = await agent(recordPrompt(built), { label: `record:pass-${pass}`, phase: 'Record' })
  if (!recorded) {
    stopReason = `pass ${pass}: builds succeeded but the tasks.md record agent failed — next pass would re-derive stale state`
    builtByPass.push({ pass, built: built.map((t) => ({ id: t.id, description: t.description })), recorded: false })
    break
  }

  builtByPass.push({ pass, built: built.map((t) => ({ id: t.id, description: t.description })), recorded: true })

  if (pass === MAX_PASSES) stopReason = `hit the ${MAX_PASSES}-pass cap with work still outstanding`
}

return {
  stopReason,
  passes: builtByPass,
  stillWaiting: lastWaiting,
  totalBuilt: builtByPass.reduce((n, p) => n + p.built.length, 0),
}
