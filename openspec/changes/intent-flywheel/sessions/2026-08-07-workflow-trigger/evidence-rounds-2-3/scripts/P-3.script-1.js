export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive the bolt-abc loopdemo construction loop: analyse startable tasks, build them, repeat until dry',
  phases: [
    { title: 'Analyse', detail: 're-query openspec each pass and classify tasks startable vs waiting' },
    { title: 'Build', detail: 'write out/<task-id>.txt for each startable task, in parallel' },
    { title: 'Record', detail: 'tick the built tasks in tasks.md so the next pass sees them done' },
  ],
}

const REPO = '/private/tmp/wfprobe/runs/P-3'

const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['startable', 'waiting'],
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
          reason: { type: 'string', description: 'one line: why this can start now' },
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
          waitsOn: { type: 'string', description: 'which task id(s) it waits on and why' },
        },
      },
    },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'wrote', 'ok'],
  properties: {
    id: { type: 'string' },
    wrote: { type: 'string', description: 'path written' },
    ok: { type: 'boolean' },
  },
}

const analysePrompt = (pass) => `You are one pass (pass ${pass}) of the construction loop for the OpenSpec change \`bolt-abc\` in ${REPO}.

Run this command yourself now — do NOT rely on any earlier pass's answer:

    cd ${REPO} && openspec instructions apply --change bolt-abc --json

The \`tasks\` array holds one entry per task as {id, description, done}.

Your job is the ANALYSE phase only. Do not write or modify any files.

Consider only tasks where \`done\` is false. Nothing in the data declares dependencies between tasks — you must infer them by reading the descriptions (e.g. a task that consumes something another task produces cannot start until that other task is done). A task whose dependency is already \`done\` is startable.

Return:
- startable: not-done tasks that can be STARTED NOW, each with a one-line reason
- waiting: not-done tasks that must wait, each with what it waits on

If every task is done, return two empty arrays.`

const buildPrompt = (t) => `You are the BUILD phase of the construction loop for OpenSpec change \`bolt-abc\`.

Build task ${t.id}: "${t.description}"

The build action for this schema is exactly one thing: write the file ${REPO}/out/${t.id}.txt containing the single line:

built ${t.id}

Write exactly that line and nothing else. Do not touch any other file (in particular, do not edit tasks.md — a later step handles that). Then report the id, the path you wrote, and whether it succeeded.`

const recordPrompt = (ids) => `Update the task checklist for OpenSpec change \`bolt-abc\`.

File: ${REPO}/openspec/changes/bolt-abc/tasks.md

These task ids have just been built and must be marked complete: ${ids.join(', ')}.
Task ids are 1-based positions in the checklist order (id "1" = first \`- [ ]\` or \`- [x]\` checklist line in the file, id "2" = second, and so on).

For each id, flip that line's checkbox from \`- [ ]\` to \`- [x]\`. Change nothing else — not the wording, not the order, not any other line. Leave lines already \`- [x]\` untouched.

Then verify by running:

    cd ${REPO} && openspec instructions apply --change bolt-abc --json

and report the resulting progress object plus which task ids now show done:true.`

const MAX_PASSES = 6
const builtByPass = []
let waitingAtEnd = []
let passes = 0
let stopReason = 'all tasks done'

for (let pass = 1; pass <= MAX_PASSES; pass++) {
  passes = pass
  phase('Analyse')
  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSIS_SCHEMA,
  })

  if (!analysis) {
    stopReason = `analysis agent failed on pass ${pass}`
    log(`pass ${pass}: analysis failed — stopping`)
    break
  }

  waitingAtEnd = analysis.waiting || []
  const startable = analysis.startable || []

  log(`pass ${pass}: ${startable.length} startable [${startable.map(t => t.id).join(', ') || '-'}], ${waitingAtEnd.length} waiting [${waitingAtEnd.map(t => `${t.id}<-${t.waitsOn}`).join('; ') || '-'}]`)

  if (startable.length === 0) {
    stopReason = waitingAtEnd.length > 0
      ? `no startable tasks remain, but ${waitingAtEnd.length} still waiting (possible unmet dependency)`
      : 'all tasks done'
    break
  }

  phase('Build')
  const builds = (await parallel(startable.map(t => () =>
    agent(buildPrompt(t), { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA })
  ))).filter(Boolean)

  const succeeded = builds.filter(b => b.ok)
  const failed = startable.filter(t => !succeeded.some(b => b.id === t.id))

  builtByPass.push({
    pass,
    built: succeeded.map(b => ({ id: b.id, path: b.wrote, description: (startable.find(t => t.id === b.id) || {}).description })),
    failed: failed.map(t => t.id),
    waiting: waitingAtEnd.map(t => ({ id: t.id, waitsOn: t.waitsOn })),
  })

  if (succeeded.length === 0) {
    stopReason = `pass ${pass} built nothing (all ${startable.length} build agents failed) — stopping to avoid a spin`
    log(stopReason)
    break
  }
  if (failed.length > 0) log(`pass ${pass}: build failed for [${failed.map(t => t.id).join(', ')}]`)

  phase('Record')
  const record = await agent(recordPrompt(succeeded.map(b => b.id)), {
    label: `record:pass-${pass}`,
    phase: 'Record',
  })
  builtByPass[builtByPass.length - 1].recorded = record

  if (pass === MAX_PASSES) stopReason = `hit MAX_PASSES (${MAX_PASSES}) — loop may not have converged`
}

return {
  change: 'bolt-abc',
  passes,
  stopReason,
  builtByPass,
  stillWaiting: waitingAtEnd,
  allBuilt: builtByPass.flatMap(p => p.built.map(b => b.id)),
}
