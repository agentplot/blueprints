export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive the bolt-abc construction loop: re-query tasks each pass, analyse dependencies, build startable tasks',
  phases: [
    { title: 'Analyse', detail: 'run openspec instructions apply and classify tasks startable vs waiting' },
    { title: 'Build', detail: 'write out/<task-id>.txt for each startable task' },
    { title: 'Record', detail: 'tick the built tasks in tasks.md' },
  ],
}

const ROOT = '/private/tmp/wfprobe/runs/PS-3'
const TASKS_MD = `${ROOT}/openspec/changes/bolt-abc/tasks.md`

const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['allDone', 'startable', 'waiting'],
  properties: {
    allDone: { type: 'boolean', description: 'true when every task in the list has done=true' },
    startable: {
      type: 'array',
      description: 'not-done tasks that can be STARTED NOW (no unmet dependency on another not-done task)',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'description', 'reason'],
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          reason: { type: 'string', description: 'one line: why it can start now' },
        },
      },
    },
    waiting: {
      type: 'array',
      description: 'not-done tasks blocked by another not-done task',
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
  required: ['id', 'path', 'ok'],
  properties: {
    id: { type: 'string' },
    path: { type: 'string' },
    ok: { type: 'boolean' },
  },
}

const analysePrompt = (pass) => `You are analysing pass ${pass} of the construction loop for the OpenSpec change \`bolt-abc\`.

Run exactly this command from ${ROOT}:

    openspec instructions apply --change bolt-abc --json

Its \`tasks\` array holds one entry per task as {id, description, done}. Work ONLY from the output of this run — do not assume any earlier pass's answer still holds.

Classify every task with done=false:
- STARTABLE: nothing in the list that is still not-done blocks it. Give a one-line reason.
- WAITING: its description implies it depends on another task that is still not-done. Say which task id it waits on and why.

Nothing declares these relationships — infer them by reading the descriptions (e.g. a task that "calls the X endpoint and cannot start until X is built" waits on the task that builds X). A dependency on a task that is ALREADY done does not block anything.

Tasks with done=true are neither startable nor waiting. Set allDone=true only if there are zero not-done tasks.`

const buildPrompt = (t) => `Build task ${t.id} of OpenSpec change bolt-abc: "${t.description}".

The build step for this change is defined as: write the file ${ROOT}/out/${t.id}.txt containing the single line:

    built ${t.id}

Write exactly that one line and nothing else. Do not modify any other file. Return {id: "${t.id}", path: "${ROOT}/out/${t.id}.txt", ok: true} once the file exists with the correct content (verify by reading it back).`

const recordPrompt = (ids) => `In ${TASKS_MD}, mark these task ids as complete by flipping their checkbox from \`- [ ]\` to \`- [x]\`: ${ids.join(', ')}.

Task ids are 1-based positions in the checklist order as it appears in the file (id "1" is the first \`- [\` line, id "2" the second, and so on). Change ONLY the checkbox characters on those lines — leave the task text and every other line byte-identical. Do not touch any other file.

Return a one-line confirmation naming the lines you flipped.`

const MAX_PASSES = 5
const built = []
const passLog = []

for (let pass = 1; pass <= MAX_PASSES; pass++) {
  phase('Analyse')
  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSIS_SCHEMA,
  })

  if (!analysis) {
    log(`Pass ${pass}: analysis agent returned nothing — stopping loop`)
    passLog.push({ pass, error: 'analysis failed' })
    break
  }

  if (analysis.allDone) {
    log(`Pass ${pass}: all tasks done — loop complete`)
    passLog.push({ pass, allDone: true, startable: [], waiting: [] })
    break
  }

  if (!analysis.startable.length) {
    log(`Pass ${pass}: ${analysis.waiting.length} task(s) still waiting but none startable — deadlock, stopping`)
    passLog.push({ pass, deadlock: true, startable: [], waiting: analysis.waiting })
    break
  }

  log(`Pass ${pass}: startable [${analysis.startable.map(t => t.id).join(', ')}], waiting [${analysis.waiting.map(t => t.id).join(', ') || 'none'}]`)

  phase('Build')
  const results = (await parallel(
    analysis.startable.map(t => () =>
      agent(buildPrompt(t), { label: `build:task-${t.id}`, phase: 'Build', schema: BUILD_SCHEMA })
    )
  )).filter(Boolean).filter(r => r.ok)

  const builtIds = results.map(r => r.id)
  if (!builtIds.length) {
    log(`Pass ${pass}: no task built successfully — stopping to avoid spinning`)
    passLog.push({ pass, startable: analysis.startable, waiting: analysis.waiting, built: [], error: 'all builds failed' })
    break
  }

  phase('Record')
  await agent(recordPrompt(builtIds), { label: `record:pass-${pass}`, phase: 'Record' })

  built.push(...analysis.startable.filter(t => builtIds.includes(t.id)))
  passLog.push({ pass, startable: analysis.startable, waiting: analysis.waiting, built: builtIds })
}

return { built, passes: passLog }
