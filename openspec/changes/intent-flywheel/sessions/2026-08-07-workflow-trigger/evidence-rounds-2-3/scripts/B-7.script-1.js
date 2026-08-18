export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive bolt-abc: re-query tasks each pass, decide what is startable, fan out one builder per startable task',
  phases: [
    { title: 'Analyse', detail: 'agent re-runs the openspec query and works out startable vs waiting from the descriptions' },
    { title: 'Build', detail: 'one agent per startable task writes out/<id>.txt' },
  ],
}

const ANALYSE_SCHEMA = {
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
          reason: { type: 'string', description: 'one line: why this can be started now' },
        },
      },
    },
    waiting: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'waitsOn', 'reason'],
        properties: {
          id: { type: 'string' },
          waitsOn: { type: 'array', items: { type: 'string' }, description: 'task ids this one waits on' },
          reason: { type: 'string', description: 'one line: what in the description implies the wait' },
        },
      },
    },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'wrotePath'],
  properties: {
    id: { type: 'string' },
    wrotePath: { type: 'string' },
  },
}

const builtThisRun = []
const passes = []
const MAX_PASSES = 6

for (let pass = 1; pass <= MAX_PASSES; pass++) {
  phase('Analyse')

  const alreadyBuilt = builtThisRun.length
    ? `Earlier passes of THIS run already built these task ids: ${builtThisRun.join(', ')}. `
      + `The checklist file has not been updated yet, so the query will still show them as not-done — `
      + `treat them as finished when you reason about what is now unblocked, and do not list them as startable or waiting.`
    : `No tasks have been built yet in this run.`

  const analysis = await agent(
    [
      `You are the analyse step of a construction loop for the OpenSpec change \`bolt-abc\`.`,
      ``,
      `Run this command from the repo root and read its output:`,
      ``,
      `    openspec instructions apply --change bolt-abc --json`,
      ``,
      `The JSON contains a \`tasks\` array of \`{id, description, done}\` entries. Run the command`,
      `yourself this pass — do not rely on any earlier pass's answer.`,
      ``,
      `Your job: for the tasks with \`done: false\`, decide which can be STARTED NOW and which must`,
      `wait on another task in the same list. NOTHING in the data declares these relationships.`,
      `You work them out by reading the task descriptions — a description may say outright that it`,
      `depends on another piece of work, or may imply it by naming something another task produces.`,
      `Two tasks touching the same component are not automatically ordered; only a real dependency`,
      `on another task's output makes one wait.`,
      ``,
      alreadyBuilt,
      ``,
      `Return: \`startable\` — the ids that can start now, each with its description and a one-line`,
      `reason; and \`waiting\` — the ids that cannot, each with the task ids it waits on and a`,
      `one-line reason drawn from the description. Every not-done, not-already-built task must`,
      `appear in exactly one of the two lists. Do not build anything.`,
    ].join('\n'),
    { label: `analyse:pass-${pass}`, phase: 'Analyse', schema: ANALYSE_SCHEMA }
  )

  if (!analysis) {
    log(`pass ${pass}: analyse agent returned nothing — stopping`)
    break
  }

  const startable = analysis.startable || []
  const waiting = analysis.waiting || []

  log(`pass ${pass}: ${startable.length} startable [${startable.map(t => t.id).join(', ') || '-'}], ${waiting.length} waiting [${waiting.map(t => t.id).join(', ') || '-'}]`)

  if (!startable.length) {
    passes.push({ pass, built: [], startable: [], waiting })
    if (waiting.length) {
      log(`pass ${pass}: nothing startable but ${waiting.length} still waiting — loop cannot progress further, stopping`)
    } else {
      log(`pass ${pass}: nothing startable and nothing waiting — all work done, stopping`)
    }
    break
  }

  phase('Build')

  const results = await parallel(startable.map(task => () =>
    agent(
      [
        `You are the build step for one task of the OpenSpec change \`bolt-abc\`.`,
        ``,
        `Task id: ${task.id}`,
        `Task description: ${task.description}`,
        ``,
        `From the repo root, create the \`out/\` directory if it does not exist, then write the file`,
        `\`out/${task.id}.txt\` containing exactly the single line:`,
        ``,
        `    built ${task.id}`,
        ``,
        `Do nothing else — do not edit tasks.md, the change artifacts, or any other file.`,
        `Return the task id you handled and the path you wrote.`,
      ].join('\n'),
      { label: `build:task-${task.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  ))

  const built = results.filter(Boolean).map(r => r.id)
  const failed = startable.filter(t => !built.includes(t.id)).map(t => t.id)

  if (failed.length) log(`pass ${pass}: builders did not report for [${failed.join(', ')}]`)

  built.forEach(id => { if (!builtThisRun.includes(id)) builtThisRun.push(id) })
  passes.push({ pass, built, startable: startable.map(t => ({ id: t.id, reason: t.reason })), waiting, failed })

  log(`pass ${pass}: built [${built.join(', ') || '-'}]`)

  if (!waiting.length) {
    log(`pass ${pass}: nothing left waiting — stopping`)
    break
  }
}

const lastPass = passes[passes.length - 1] || { waiting: [] }

return {
  builtThisRun,
  stillWaiting: (lastPass.waiting || []).map(w => ({ id: w.id, waitsOn: w.waitsOn, reason: w.reason })),
  passes,
}
