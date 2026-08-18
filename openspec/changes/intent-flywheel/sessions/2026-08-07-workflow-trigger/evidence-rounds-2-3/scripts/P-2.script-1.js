export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive the bolt-abc construction loop: analyse task readiness, build startable tasks, repeat until dry',
  phases: [
    { title: 'Analyse', detail: 'query openspec, classify not-done tasks as startable or waiting' },
    { title: 'Build', detail: 'write out/<task-id>.txt for each startable task' },
    { title: 'Record', detail: 'check off built tasks in tasks.md so the next pass sees new state' },
  ],
}

const CHANGE = 'bolt-abc'
const ROOT = '/private/tmp/wfprobe/runs/P-2'
const MAX_PASSES = 6

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
          waitsOn: { type: 'string', description: 'which task id(s) it waits on, and why' },
        },
        required: ['id', 'description', 'waitsOn'],
      },
    },
    notDoneCount: { type: 'number', description: 'total number of tasks with done=false in this query' },
  },
  required: ['startable', 'waiting', 'notDoneCount'],
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    path: { type: 'string' },
    ok: { type: 'boolean' },
  },
  required: ['id', 'path', 'ok'],
}

const passes = []
let dryReason = 'hit max passes'

for (let pass = 1; pass <= MAX_PASSES; pass++) {
  phase('Analyse')
  const analysis = await agent(
    `You are driving the construction loop for OpenSpec change \`${CHANGE}\` in ${ROOT}. This is pass ${pass}.

STEP 1 — re-run the query fresh (do NOT assume any earlier pass's answer still holds):
  cd ${ROOT} && openspec instructions apply --change ${CHANGE} --json

The \`tasks\` array holds one entry per task as {id, description, done}.

STEP 2 — for every task with done=false, decide from its DESCRIPTION ALONE whether it can be
STARTED NOW or must wait on another task in the list. Nothing in the data declares those
relationships — inferring them from the prose is the job. A task waits only if its description
implies it depends on another not-done task in this same list; a dependency on an already-done
task is satisfied, so that task is startable.

Return every not-done task in exactly one of \`startable\` or \`waiting\`, with a one-line reason
or the id(s) it waits on. \`notDoneCount\` must equal startable.length + waiting.length.
Do not write any files in this step.`,
    { label: `analyse:pass-${pass}`, phase: 'Analyse', schema: ANALYSIS_SCHEMA },
  )

  if (!analysis) { dryReason = `analysis agent failed on pass ${pass}`; break }

  log(`pass ${pass}: ${analysis.notDoneCount} not done → ${analysis.startable.length} startable, ${analysis.waiting.length} waiting`)

  if (analysis.notDoneCount === 0) { dryReason = 'all tasks done'; break }
  if (analysis.startable.length === 0) {
    dryReason = `pass ${pass} found ${analysis.waiting.length} waiting task(s) but nothing startable — dependency deadlock`
    passes.push({ pass, startable: [], waiting: analysis.waiting, builtIds: [] })
    break
  }

  const builds = await parallel(analysis.startable.map(t => () =>
    agent(
      `Build task ${t.id} of OpenSpec change \`${CHANGE}\`.

Task: ${t.description}

The build step for this schema is defined exactly as: write \`out/<task-id>.txt\` containing the
single line \`built <task-id>\`.

So write the file ${ROOT}/out/${t.id}.txt with exactly this content (one line, trailing newline):
built ${t.id}

Do nothing else — do not edit tasks.md, do not touch any other task's output file.
Return {id, path, ok} where path is the absolute file path you wrote and ok is whether it succeeded.`,
      { label: `build:task-${t.id}`, phase: 'Build', schema: BUILD_SCHEMA },
    ),
  ))

  const builtIds = builds.filter(Boolean).filter(b => b.ok).map(b => b.id)
  log(`pass ${pass}: built ${builtIds.length ? builtIds.join(', ') : '(none)'}`)

  if (builtIds.length) {
    // Serial, single-writer: parallel builders must not race on tasks.md.
    // Without this the next pass re-queries identical state and the loop never advances.
    await agent(
      `In ${ROOT}/openspec/changes/${CHANGE}/tasks.md, mark these now-built tasks complete by
changing their checkbox from \`- [ ]\` to \`- [x]\`. Match each by its description text:

${analysis.startable.filter(t => builtIds.includes(t.id)).map(t => `  - ${t.description}`).join('\n')}

Change nothing else in the file — not the wording, not the ordering, not any other checkbox.
Then re-read the file and report the resulting checkbox state of every line.`,
      { label: `record:pass-${pass}`, phase: 'Record' },
    )
  }

  passes.push({ pass, startable: analysis.startable, waiting: analysis.waiting, builtIds })

  if (!builtIds.length) { dryReason = `pass ${pass} built nothing despite startable work — stopping`; break }
}

return {
  change: CHANGE,
  passes,
  builtIds: passes.flatMap(p => p.builtIds),
  stillWaiting: passes.length ? passes[passes.length - 1].waiting.filter(w => !passes.flatMap(p => p.builtIds).includes(w.id)) : [],
  stoppedBecause: dryReason,
}
