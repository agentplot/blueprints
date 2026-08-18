export const meta = {
  name: 'bolt-abc-construction',
  description: 'Drive bolt-abc construction: analyse startable tasks, fan out builders, record, repeat',
  phases: [
    { title: 'Analyse', detail: 'query openspec, infer which tasks are startable now' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
    { title: 'Record', detail: 'single writer marks built tasks done in tasks.md' },
  ],
}

const ROOT = '/private/tmp/wfprobe/runs/B-5'
const CHANGE = 'bolt-abc'
const MAX_PASSES = 6

const ANALYSE_SCHEMA = {
  type: 'object',
  properties: {
    startable: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['id', 'description', 'reason'],
        additionalProperties: false,
      },
    },
    waiting: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'string' },
        },
        required: ['id', 'description', 'waitsOn'],
        additionalProperties: false,
      },
    },
  },
  required: ['startable', 'waiting'],
  additionalProperties: false,
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    file: { type: 'string' },
    contents: { type: 'string' },
  },
  required: ['id', 'file', 'contents'],
  additionalProperties: false,
}

const RECORD_SCHEMA = {
  type: 'object',
  properties: {
    marked: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
  required: ['marked'],
  additionalProperties: false,
}

const passes = []

for (let pass = 1; pass <= MAX_PASSES; pass++) {
  phase('Analyse')
  const analysis = await agent(
    [
      `You are the analyse step of pass ${pass} of the construction loop for OpenSpec change \`${CHANGE}\`.`,
      ``,
      `Run exactly this command from ${ROOT}:`,
      ``,
      `    openspec instructions apply --change ${CHANGE} --json`,
      ``,
      `Read the \`tasks\` array in the JSON it returns. Each entry is {id, description, done}.`,
      ``,
      `Your job: decide which NOT-DONE tasks can be STARTED NOW, and which must wait on`,
      `another task in the same list. Nothing in the data declares those relationships —`,
      `you work them out by reading the descriptions. A task waits only if its description`,
      `implies it depends on work another not-done task in this list performs. Tasks that`,
      `merely touch the same repo are NOT dependent on each other; only a real prerequisite`,
      `relationship counts. A task whose prerequisite is already marked done is startable.`,
      ``,
      `Do NOT modify any files. Do NOT build anything. Query and reason only.`,
      ``,
      `Return: every startable not-done task with a one-line reason it is startable, and`,
      `every waiting not-done task with what it waits on. Already-done tasks appear in neither list.`,
    ].join('\n'),
    { label: `analyse:pass-${pass}`, phase: 'Analyse', schema: ANALYSE_SCHEMA },
  )

  if (!analysis) {
    log(`pass ${pass}: analyse agent failed — stopping`)
    break
  }

  const startable = analysis.startable || []
  const waiting = analysis.waiting || []
  log(`pass ${pass}: ${startable.length} startable [${startable.map(t => t.id).join(', ') || '-'}], ${waiting.length} waiting [${waiting.map(t => t.id).join(', ') || '-'}]`)

  if (startable.length === 0) {
    passes.push({ pass, startable: [], built: [], waiting })
    log(waiting.length
      ? `pass ${pass}: nothing startable but ${waiting.length} still waiting — deadlock, stopping`
      : `pass ${pass}: nothing startable and nothing waiting — all tasks done`)
    break
  }

  phase('Build')
  const built = (await parallel(startable.map(task => () =>
    agent(
      [
        `You are the build agent for task ${task.id} of OpenSpec change \`${CHANGE}\`.`,
        ``,
        `Task ${task.id}: ${task.description}`,
        ``,
        `Do exactly this and nothing more:`,
        `1. Ensure the directory ${ROOT}/out/ exists (create it if missing).`,
        `2. Write the file ${ROOT}/out/${task.id}.txt containing the single line:`,
        ``,
        `       built ${task.id}`,
        ``,
        `Touch no other file. Do not edit tasks.md. Do not run openspec.`,
        ``,
        `Return the task id you handled, the absolute path you wrote, and the file's exact contents.`,
      ].join('\n'),
      { label: `build:task-${task.id}`, phase: 'Build', schema: BUILD_SCHEMA },
    )
  ))).filter(Boolean)

  const builtIds = built.map(b => b.id)
  log(`pass ${pass}: built [${builtIds.join(', ') || '-'}]`)

  if (builtIds.length === 0) {
    passes.push({ pass, startable, built: [], waiting })
    log(`pass ${pass}: every build agent failed — stopping`)
    break
  }

  phase('Record')
  const recorded = await agent(
    [
      `You are the single writer recording completed work for OpenSpec change \`${CHANGE}\`.`,
      `No other agent is editing this file right now.`,
      ``,
      `File: ${ROOT}/openspec/changes/${CHANGE}/tasks.md`,
      ``,
      `These tasks were just built this pass:`,
      built.map(b => {
        const t = startable.find(s => s.id === b.id)
        return `  - id ${b.id}: ${t ? t.description : '(description unavailable)'}`
      }).join('\n'),
      ``,
      `For each one, flip its checkbox in tasks.md from "- [ ]" to "- [x]". Match the task`,
      `by its description text — the ids are 1-based positions among the task lines, in`,
      `file order, so verify the line you flip actually matches the description before editing.`,
      ``,
      `Change nothing else: not the wording, not the ordering, not any other line's checkbox.`,
      `Verify by re-reading the file after editing.`,
      ``,
      `Return the list of ids you actually marked done, and a short note if any could not be matched.`,
    ].join('\n'),
    { label: `record:pass-${pass}`, phase: 'Record', schema: RECORD_SCHEMA },
  )

  log(`pass ${pass}: marked done [${(recorded && recorded.marked || []).join(', ') || '-'}]`)
  passes.push({ pass, startable, built: builtIds, waiting, marked: (recorded && recorded.marked) || [] })

  if (waiting.length === 0) {
    log(`pass ${pass}: nothing left waiting — loop complete`)
    break
  }
}

const allBuilt = passes.flatMap(p => p.built)
const lastPass = passes[passes.length - 1] || { waiting: [] }

return {
  change: CHANGE,
  passes: passes.length,
  builtInOrder: allBuilt,
  perPass: passes.map(p => ({ pass: p.pass, built: p.built, waiting: p.waiting.map(w => `${w.id} (waits on: ${w.waitsOn})`) })),
  stillWaiting: (lastPass.waiting || []).map(w => `${w.id}: ${w.description} — waits on ${w.waitsOn}`),
}
