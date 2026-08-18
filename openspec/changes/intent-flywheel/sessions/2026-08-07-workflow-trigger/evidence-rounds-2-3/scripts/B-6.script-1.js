export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive bolt-abc construction: re-analyse startable tasks each pass, then build them in parallel',
  phases: [
    { title: 'Analyse', detail: 'Re-run the openspec query and work out which tasks are startable now' },
    { title: 'Build', detail: 'One agent per startable task, writes out/<id>.txt' },
  ],
}

const ROOT = '/private/tmp/wfprobe/runs/B-6'
const CHANGE = 'bolt-abc'
const MAX_PASSES = 6

const ANALYSE_SCHEMA = {
  type: 'object',
  properties: {
    startable: {
      type: 'array',
      description: 'Not-done tasks that can be started right now',
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
          waitsOn: { type: 'array', items: { type: 'string' }, description: 'Task ids it waits on' },
          reason: { type: 'string', description: 'One line: what it waits on and why' },
        },
        required: ['id', 'description', 'waitsOn', 'reason'],
      },
    },
  },
  required: ['startable', 'waiting'],
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'The task id this agent handled' },
    path: { type: 'string', description: 'Absolute path of the file written' },
    ok: { type: 'boolean', description: 'True if the file was written and verified' },
  },
  required: ['id', 'ok'],
}

function analysePrompt(builtIds, pass) {
  const builtLine = builtIds.length
    ? `Task ids already BUILT during this run (their out/<id>.txt exists): ${builtIds.join(', ')}. Treat these as complete even though the query still reports them done:false.`
    : `No tasks have been built during this run yet.`
  return [
    `You are the analyse step of construction pass ${pass} for the OpenSpec change "${CHANGE}".`,
    ``,
    `Run exactly this command from ${ROOT}:`,
    `  openspec instructions apply --change ${CHANGE} --json`,
    ``,
    `Read the "tasks" array it returns. Each entry is {id, description, done}.`,
    ``,
    `Decide, BY READING THE DESCRIPTIONS, which not-done tasks can be STARTED NOW`,
    `and which must wait on another task in the same list. Nothing in the data`,
    `declares these relationships - inferring them from the prose is your job.`,
    `A task waits only if its description makes it depend on work another task in`,
    `the list produces. Tasks that merely touch the same component are NOT`,
    `dependent on each other and can run concurrently.`,
    ``,
    builtLine,
    `Also check ${ROOT}/out/ - a file out/<id>.txt means task <id> is built.`,
    `A waiting task becomes startable once everything it waits on is built.`,
    ``,
    `Exclude tasks reported done:true, and exclude anything already built, from`,
    `BOTH lists - they are finished, neither startable nor waiting.`,
    ``,
    `Return the startable task ids with a one-line reason each, and the waiting`,
    `ones with what they wait on. Do not build anything.`,
  ].join('\n')
}

function buildPrompt(task) {
  return [
    `You are the build agent for task ${task.id} of change "${CHANGE}":`,
    `  "${task.description}"`,
    ``,
    `Do exactly this and nothing more:`,
    `  1. Ensure the directory ${ROOT}/out/ exists.`,
    `  2. Write the file ${ROOT}/out/${task.id}.txt containing the single line:`,
    `       built ${task.id}`,
    `     (that exact text, one line, nothing else)`,
    `  3. Read the file back to confirm its contents.`,
    ``,
    `Do not modify tasks.md, any openspec/ file, or any other task's output file.`,
    `Return the task id you handled, the absolute path written, and ok=true if verified.`,
  ].join('\n')
}

const builtIds = []
const waitingByPass = []
let pass = 0
let lastWaiting = []

while (pass < MAX_PASSES) {
  pass += 1
  phase('Analyse')
  log(`Pass ${pass}: re-running the query to see what is startable now`)

  const analysis = await agent(analysePrompt(builtIds, pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSE_SCHEMA,
  })

  if (!analysis) {
    log(`Pass ${pass}: analyse agent returned nothing - stopping the loop`)
    break
  }

  const startable = (analysis.startable || []).filter(t => !builtIds.includes(t.id))
  lastWaiting = analysis.waiting || []
  waitingByPass.push({ pass, waiting: lastWaiting })

  if (startable.length === 0) {
    log(`Pass ${pass}: nothing startable. ${lastWaiting.length} task(s) still waiting. Loop is done.`)
    break
  }

  log(`Pass ${pass}: startable -> ${startable.map(t => t.id).join(', ')}; waiting -> ${lastWaiting.map(t => t.id).join(', ') || 'none'}`)

  phase('Build')
  const results = await parallel(
    startable.map(t => () =>
      agent(buildPrompt(t), {
        label: `build:task-${t.id}`,
        phase: 'Build',
        schema: BUILD_SCHEMA,
      })
    )
  )

  const succeeded = results.filter(Boolean).filter(r => r.ok).map(r => r.id)
  const failed = startable.map(t => t.id).filter(id => !succeeded.includes(id))

  succeeded.forEach(id => { if (!builtIds.includes(id)) builtIds.push(id) })

  log(`Pass ${pass}: built ${succeeded.join(', ') || 'nothing'}${failed.length ? `; FAILED ${failed.join(', ')}` : ''}`)

  if (succeeded.length === 0) {
    log(`Pass ${pass}: no task completed, so the next pass cannot unblock anything. Stopping to avoid a spin.`)
    break
  }
}

if (pass >= MAX_PASSES) {
  log(`Hit the ${MAX_PASSES}-pass guard - stopping. Anything still waiting is reported below.`)
}

return {
  passes: pass,
  built: builtIds,
  stillWaiting: lastWaiting.map(t => ({ id: t.id, description: t.description, waitsOn: t.waitsOn, reason: t.reason })),
  waitingByPass,
  hitPassGuard: pass >= MAX_PASSES,
}
