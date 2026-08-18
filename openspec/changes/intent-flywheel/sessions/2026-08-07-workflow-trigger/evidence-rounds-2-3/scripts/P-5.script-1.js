export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive the bolt-abc loopdemo construction loop: re-query tasks each pass, analyse readiness, build startable tasks',
  phases: [
    { title: 'Analyse', detail: 're-run openspec query, classify not-done tasks as startable or waiting' },
    { title: 'Build', detail: 'write out/<task-id>.txt and check off the task, one agent per startable task' },
  ],
}

const REPO = '/private/tmp/wfprobe/runs/P-5'
const CHANGE = 'bolt-abc'

const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['startable', 'waiting', 'notDoneCount'],
  properties: {
    notDoneCount: { type: 'integer', description: 'how many tasks in the query result have done=false' },
    startable: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'description', 'reason'],
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          reason: { type: 'string', description: 'one line: why this can be started now' },
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
          waitsOn: { type: 'string', description: 'which task id(s) it waits on, and why' },
        },
      },
    },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'built', 'note'],
  properties: {
    id: { type: 'string' },
    built: { type: 'boolean' },
    note: { type: 'string' },
  },
}

const analysePrompt = (pass) => `You are the ANALYSE phase of pass ${pass} of the construction loop for OpenSpec change \`${CHANGE}\` (schema: loopdemo).

Run this command from ${REPO}:

    openspec instructions apply --change ${CHANGE} --json

Its \`tasks\` array holds one entry per task as {id, description, done}. Do NOT rely on any prior pass's answer — use only what this fresh query returns.

Decide, by reading the descriptions alone, which not-done tasks can be STARTED NOW and which must WAIT on another task in the list. Nothing in the data declares those relationships; inferring them from the wording is the job. A task waits only if its description implies it depends on another task that is still not done. If the task it depends on is now done=true, it is startable.

Return:
- notDoneCount: number of tasks with done=false
- startable: each with id, description, and a one-line reason
- waiting: each with id, description, and what it waits on

Ignore tasks already done=true.`

const buildPrompt = (task, pass) => `You are the BUILD phase of pass ${pass} for OpenSpec change \`${CHANGE}\`.

Build task ${task.id}: "${task.description}"

Two steps, both required:
1. Write the file ${REPO}/out/${task.id}.txt containing exactly the single line:
built ${task.id}
2. Mark this task complete in ${REPO}/openspec/changes/${CHANGE}/tasks.md by changing that task's line from "- [ ]" to "- [x]". Match the line by its description text; change only that one line and nothing else in the file.

Then verify the file exists with the right content and that tasks.md shows the checkbox ticked. Return {id, built, note}.`

const built = []
const log_ = (m) => log(m)
let pass = 0
let lastReport = null

while (pass < 6) {
  pass++
  phase('Analyse')
  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSIS_SCHEMA,
  })

  if (!analysis) {
    log_(`pass ${pass}: analyse agent failed — stopping loop`)
    break
  }

  lastReport = analysis
  log_(`pass ${pass}: ${analysis.notDoneCount} not done — ${analysis.startable.length} startable, ${analysis.waiting.length} waiting`)

  if (analysis.notDoneCount === 0) {
    log_(`pass ${pass}: all tasks done — loop complete`)
    break
  }

  if (analysis.startable.length === 0) {
    log_(`pass ${pass}: nothing startable but ${analysis.waiting.length} still waiting — deadlock, stopping`)
    break
  }

  phase('Build')
  const results = await parallel(
    analysis.startable.map((t) => () =>
      agent(buildPrompt(t, pass), { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA })
    )
  )

  const okIds = results.filter(Boolean).filter((r) => r.built).map((r) => r.id)
  const failed = results.filter(Boolean).filter((r) => !r.built)

  for (const t of analysis.startable) {
    if (okIds.includes(t.id)) built.push({ pass, id: t.id, description: t.description, reason: t.reason })
  }

  log_(`pass ${pass}: built ${okIds.length ? okIds.join(', ') : 'nothing'}${failed.length ? ` (failed: ${failed.map((f) => f.id).join(', ')})` : ''}`)

  if (okIds.length === 0) {
    log_(`pass ${pass}: no progress made — stopping to avoid an unproductive loop`)
    break
  }
}

return {
  passes: pass,
  built,
  finalAnalysis: lastReport,
}
