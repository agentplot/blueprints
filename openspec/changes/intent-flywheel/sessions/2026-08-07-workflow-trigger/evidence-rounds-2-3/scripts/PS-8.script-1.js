export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive the bolt-abc construction loop: analyse task dependencies, build startable tasks, repeat until none remain',
  phases: [
    { title: 'Pass 1', detail: 'analyse task list, build startable tasks, mark them done' },
    { title: 'Pass 2', detail: 'analyse again, build newly-unblocked tasks' },
    { title: 'Pass 3', detail: 'analyse again, build any remaining unblocked tasks' },
    { title: 'Pass 4', detail: 'analyse again, build any remaining unblocked tasks' },
    { title: 'Pass 5', detail: 'analyse again, build any remaining unblocked tasks' },
  ],
}

const REPO = '/private/tmp/wfprobe/runs/PS-8'
const CHANGE = 'bolt-abc'

const ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    notDone: {
      type: 'array',
      description: 'Every task from the tasks array whose done is false',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['id', 'description'],
      },
    },
    startable: {
      type: 'array',
      description: 'Not-done tasks that can be STARTED NOW (nothing they depend on is still outstanding)',
      items: {
        type: 'object',
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
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'string', description: 'Which task id(s) it waits on, and why' },
        },
        required: ['id', 'description', 'waitsOn'],
      },
    },
  },
  required: ['notDone', 'startable', 'waiting'],
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    path: { type: 'string', description: 'Absolute path of the file written' },
    contents: { type: 'string', description: 'Exact contents written' },
  },
  required: ['id', 'path', 'contents'],
}

function analysePrompt(passNum) {
  return `You are the ANALYSE phase of pass ${passNum} of the construction loop for OpenSpec change \`${CHANGE}\`.

Run this command fresh (do NOT rely on any earlier pass's output):

    cd ${REPO} && openspec instructions apply --change ${CHANGE} --json

Its \`tasks\` array holds one entry per task as {id, description, done}.

Your job: from the task DESCRIPTIONS alone, work out the dependency relationships. Nothing in the data declares them — inferring them from the prose is the point of this phase.

For every task with done=false, classify it as either:
- startable: nothing it depends on is still outstanding, so work can begin NOW. Give a one-line reason.
- waiting: its description says (or clearly implies) it depends on another task in the list that is not yet done. Say which task id it waits on and why.

A task that depends on a task which is already done=true is STARTABLE, not waiting.

Return every not-done task in \`notDone\`, and partition those same tasks across \`startable\` and \`waiting\` (each not-done task appears in exactly one of the two).`
}

function buildPrompt(task, passNum) {
  return `You are the BUILD phase of pass ${passNum} of the construction loop for OpenSpec change \`${CHANGE}\`.

Build task ${task.id}: "${task.description}"

Do exactly this and nothing more:
1. Ensure the directory ${REPO}/out exists (mkdir -p it if needed).
2. Write the file ${REPO}/out/${task.id}.txt containing the single line:

built ${task.id}

That single line is the entire file contents (one trailing newline is fine). Do not add commentary, headers, or any other text. Do not touch any other file — in particular, do NOT edit tasks.md; a later step handles that.

Return the id, the absolute path you wrote, and the exact contents.`
}

function markPrompt(tasks, passNum) {
  const list = tasks.map(t => `  - id ${t.id}: "${t.description}"`).join('\n')
  return `Pass ${passNum} of the construction loop for OpenSpec change \`${CHANGE}\` just finished building these tasks:

${list}

Mark each of them complete in ${REPO}/openspec/changes/${CHANGE}/tasks.md by changing its checkbox from \`- [ ]\` to \`- [x]\`. Match each task by its description text (task ids correspond to the order the checkbox lines appear under the headings).

Change nothing else in the file — no reordering, no rewording, no added notes. Then re-run \`cd ${REPO} && openspec instructions apply --change ${CHANGE} --json\` and report the resulting progress line (complete/total) as your final answer.`
}

const built = []
const passLog = []
let lastWaiting = []
let passNum = 0

while (passNum < 5) {
  passNum++
  const phaseName = `Pass ${passNum}`
  phase(phaseName)

  const analysis = await agent(analysePrompt(passNum), {
    label: `analyse:pass-${passNum}`,
    phase: phaseName,
    schema: ANALYSIS_SCHEMA,
  })

  if (!analysis) {
    log(`Pass ${passNum}: analyse agent returned nothing — stopping.`)
    break
  }

  const notDone = analysis.notDone || []
  const startable = analysis.startable || []
  const waiting = analysis.waiting || []
  lastWaiting = waiting

  log(`Pass ${passNum}: ${notDone.length} not done — ${startable.length} startable, ${waiting.length} waiting`)

  if (notDone.length === 0) {
    passLog.push({ pass: passNum, startable: [], waiting: [], note: 'no tasks remaining' })
    log(`Pass ${passNum}: nothing left to build — loop complete.`)
    break
  }

  if (startable.length === 0) {
    passLog.push({ pass: passNum, startable: [], waiting, note: 'deadlock — tasks remain but none startable' })
    log(`Pass ${passNum}: ${waiting.length} task(s) remain but none are startable — stopping to avoid spinning.`)
    break
  }

  const results = (await parallel(
    startable.map(t => () =>
      agent(buildPrompt(t, passNum), {
        label: `build:${t.id}`,
        phase: phaseName,
        schema: BUILD_SCHEMA,
      })
    )
  )).filter(Boolean)

  built.push(...startable.map(t => ({ id: t.id, description: t.description, reason: t.reason, pass: passNum })))
  passLog.push({
    pass: passNum,
    startable: startable.map(t => ({ id: t.id, reason: t.reason })),
    waiting: waiting.map(t => ({ id: t.id, waitsOn: t.waitsOn })),
    wrote: results.map(r => r.path),
  })

  await agent(markPrompt(startable, passNum), {
    label: `mark-done:pass-${passNum}`,
    phase: phaseName,
  })
}

return { built, passLog, stillWaiting: lastWaiting, passes: passNum }
