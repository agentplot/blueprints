export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Run the bolt-abc construction loop: re-query task readiness, build startable tasks, repeat until none remain',
  phases: [
    { title: 'Analyse', detail: 're-run openspec apply query, derive startable vs waiting tasks' },
    { title: 'Build', detail: 'one agent per startable task writes out/<id>.txt' },
    { title: 'Record', detail: 'mark built tasks complete in tasks.md' },
  ],
}

const CHANGE = 'bolt-abc'
const REPO = '/private/tmp/wfprobe/runs/PS-6'

const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    notDone: {
      type: 'array',
      description: 'Every task in the query result whose done flag is false',
      items: { type: 'string' },
    },
    startable: {
      type: 'array',
      description: 'Not-done tasks that can be STARTED NOW (nothing they depend on is still outstanding)',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          reason: { type: 'string', description: 'One line: why it can start now' },
        },
        required: ['id', 'description', 'reason'],
      },
    },
    waiting: {
      type: 'array',
      description: 'Not-done tasks that must wait on another task in the list',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'string', description: 'Which task id(s) it waits on and why' },
        },
        required: ['id', 'description', 'waitsOn'],
      },
    },
  },
  required: ['notDone', 'startable', 'waiting'],
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    path: { type: 'string', description: 'Path of the file written' },
    contents: { type: 'string', description: 'Exact contents written' },
  },
  required: ['id', 'path', 'contents'],
}

const analysePrompt = (pass) => `You are one pass (pass ${pass}) of the construction loop for the OpenSpec change \`${CHANGE}\`.

Run this command from ${REPO} and read its output fresh — do NOT rely on any cached or assumed task state:

    openspec instructions apply --change ${CHANGE} --json

The \`tasks\` array holds one entry per task as {id, description, done}.

Your job is ANALYSIS ONLY. Do not write, create, or edit any file. Do not build anything.

From the task DESCRIPTIONS alone, work out the dependency relationships — nothing in the data declares them. A task is startable now if every task it depends on is already done (done: true). A task is waiting if something it depends on is still not done.

Return:
- notDone: the ids of every task with done: false
- startable: the not-done tasks that can be started now, each with a one-line reason
- waiting: the not-done tasks that must wait, each with what it waits on

If notDone is empty, return empty arrays for startable and waiting.`

const buildPrompt = (t) => `Build task ${t.id} of the OpenSpec change \`${CHANGE}\`: "${t.description}".

In this loop, "building" a task means exactly one thing: write the file ${REPO}/out/${t.id}.txt containing the single line:

built ${t.id}

Write that file and nothing else. Do not modify tasks.md, do not touch any other file, do not run openspec commands. Report the path you wrote and its exact contents.`

const recordPrompt = (tasks) => `Record completed work for the OpenSpec change \`${CHANGE}\`.

These tasks have just been built successfully:
${tasks.map((t) => `- ${t.id}: ${t.description}`).join('\n')}

In ${REPO}/openspec/changes/${CHANGE}/tasks.md, flip the checkbox for exactly those tasks from \`- [ ]\` to \`- [x]\`. Match each task by its description text. Leave every other line — including tasks not in the list above — byte-for-byte unchanged. Do not reorder, reword, or reformat anything.

Then verify by re-reading the file and report which lines you changed.`

const built = []
let finalWaiting = []
let stalled = null
let pass = 0

while (pass < 8) {
  pass++
  log(`Pass ${pass}: re-querying task state`)

  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSIS_SCHEMA,
  })

  if (!analysis) {
    stalled = `Pass ${pass}: analysis agent returned no result; loop halted.`
    break
  }

  if (analysis.notDone.length === 0) {
    log(`Pass ${pass}: no tasks remain — loop complete`)
    finalWaiting = []
    break
  }

  if (analysis.startable.length === 0) {
    finalWaiting = analysis.waiting
    stalled = `Pass ${pass}: ${analysis.notDone.length} task(s) not done but none startable — every remaining task is blocked.`
    log(stalled)
    break
  }

  log(`Pass ${pass}: startable ${analysis.startable.map((t) => t.id).join(', ')} | waiting ${analysis.waiting.map((t) => t.id).join(', ') || 'none'}`)

  const results = await parallel(
    analysis.startable.map((t) => () =>
      agent(buildPrompt(t), {
        label: `build:${t.id}`,
        phase: 'Build',
        schema: BUILD_SCHEMA,
        effort: 'low',
      }).then((r) => (r ? { ...t, wrote: r } : null))
    )
  )

  const ok = results.filter(Boolean)
  const failedIds = analysis.startable
    .filter((t) => !ok.some((o) => o.id === t.id))
    .map((t) => t.id)
  if (failedIds.length) log(`Pass ${pass}: build failed for ${failedIds.join(', ')} — will be retried next pass`)

  if (ok.length === 0) {
    finalWaiting = analysis.waiting
    stalled = `Pass ${pass}: every build attempt failed; loop halted to avoid spinning.`
    break
  }

  built.push(...ok.map((t) => ({ pass, id: t.id, description: t.description, reason: t.reason, path: t.wrote.path })))

  await agent(recordPrompt(ok), { label: `record:pass-${pass}`, phase: 'Record', effort: 'low' })

  finalWaiting = analysis.waiting
}

if (pass >= 8 && !stalled) stalled = 'Loop hit the 8-pass safety cap without converging.'

return {
  passes: pass,
  built,
  stillWaiting: finalWaiting,
  stalled,
}
