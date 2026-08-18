export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive the bolt-abc construction loop: analyse startable tasks, build them in parallel, repeat until dry',
  phases: [
    { title: 'Analyse', detail: 'query openspec apply instructions and classify not-done tasks as startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task; writes out/<id>.txt' },
    { title: 'Record', detail: 'mark built tasks complete in tasks.md so the next pass sees fresh state' },
  ],
}

const CHANGE = 'bolt-abc'
const ROOT = '/private/tmp/wfprobe/runs/A-7'

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
          waitsOn: { type: 'array', items: { type: 'string' }, description: 'task ids it waits on' },
          reason: { type: 'string' },
        },
        required: ['id', 'description', 'waitsOn', 'reason'],
      },
    },
  },
  required: ['startable', 'waiting'],
}

const BUILT_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    file: { type: 'string' },
  },
  required: ['id', 'file'],
}

const analysePrompt = (pass) => `You are the analyse step of pass ${pass} of the ${CHANGE} construction loop.

Run this command from ${ROOT}:

  openspec instructions apply --change ${CHANGE} --json

Read the \`tasks\` array in the JSON it returns. Each entry is {id, description, done}.

Consider ONLY the entries where done is false. Nothing in the data declares
dependencies between tasks - work them out yourself by reading the descriptions
and noticing when one task's description refers to the artifact another task
produces.

Classify every not-done task into exactly one of:
  - startable: nothing it needs is still outstanding, so work can begin now
  - waiting: it depends on another task in the list that is not done yet
    (record that task's id in waitsOn)

If a task waits on something that is ALREADY done, it is startable.

Return the classification. One line of reasoning per task. Do not build anything.`

const buildPrompt = (task, pass) => `You are the build step of pass ${pass} of the ${CHANGE} construction loop.

Your task is id "${task.id}": ${task.description}

Do exactly this, nothing more:
  1. Ensure the directory ${ROOT}/out exists.
  2. Write the file ${ROOT}/out/${task.id}.txt containing the single line:
     built ${task.id}
  3. Return {"id": "${task.id}", "file": "${ROOT}/out/${task.id}.txt"}.

Do not touch tasks.md. Do not create any other files.`

const recordPrompt = (ids, descs) => `Mark completed tasks in ${ROOT}/openspec/changes/${CHANGE}/tasks.md.

These tasks were just built and must be flipped from "- [ ]" to "- [x]":
${descs.map((d, i) => `  - id ${ids[i]}: ${d}`).join('\n')}

Match each by its description text on the checkbox line. Change ONLY the
checkbox character on those lines - leave the description text, ordering, and
every other line in the file byte-for-byte identical. Do not add or remove lines.

Return the number of checkboxes you flipped.`

const passes = []
let pass = 0

while (pass < 6) {
  pass++
  phase('Analyse')
  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSIS_SCHEMA,
  })

  if (!analysis) {
    log(`pass ${pass}: analyse step returned nothing - stopping`)
    break
  }

  const startable = analysis.startable || []
  const waiting = analysis.waiting || []

  if (startable.length === 0) {
    log(`pass ${pass}: nothing startable (${waiting.length} still waiting) - loop is dry`)
    passes.push({ pass, built: [], startable: [], waiting })
    break
  }

  log(`pass ${pass}: ${startable.length} startable [${startable.map(t => t.id).join(', ')}], ${waiting.length} waiting`)

  phase('Build')
  const built = (await parallel(startable.map(t => () =>
    agent(buildPrompt(t, pass), {
      label: `build:task-${t.id}`,
      phase: 'Build',
      schema: BUILT_SCHEMA,
    })
  ))).filter(Boolean)

  const builtIds = built.map(b => b.id)
  const builtDescs = builtIds.map(id => (startable.find(t => t.id === id) || {}).description || id)

  phase('Record')
  await agent(recordPrompt(builtIds, builtDescs), { label: `record:pass-${pass}`, phase: 'Record' })

  passes.push({
    pass,
    built: builtIds,
    startable: startable.map(t => ({ id: t.id, reason: t.reason })),
    waiting: waiting.map(t => ({ id: t.id, waitsOn: t.waitsOn, reason: t.reason })),
  })

  if (builtIds.length === 0) {
    log(`pass ${pass}: startable tasks produced no builds - stopping to avoid a spin`)
    break
  }
}

const last = passes[passes.length - 1] || { waiting: [] }
return {
  change: CHANGE,
  passes,
  allBuilt: passes.flatMap(p => p.built),
  stillWaiting: last.waiting || [],
}
