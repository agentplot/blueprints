export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive bolt-abc: analyse task dependencies, fan out builds, loop until nothing is startable',
  phases: [
    { title: 'Analyse', detail: 'query openspec, infer which tasks are startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
    { title: 'Record', detail: 'mark built tasks complete in tasks.md' },
  ],
}

const CHANGE = 'bolt-abc'
const ROOT = '/private/tmp/wfprobe/runs/A-8'

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
          waitsOn: { type: 'string', description: 'which task id(s)/work it waits on' },
        },
        required: ['id', 'description', 'waitsOn'],
      },
    },
  },
  required: ['startable', 'waiting'],
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    wrote: { type: 'string', description: 'path written' },
  },
  required: ['id'],
}

const analysePrompt = (pass) => `You are the analyse step of pass ${pass} of the construction loop for OpenSpec change \`${CHANGE}\`.

Run exactly this command from ${ROOT}:

    openspec instructions apply --change ${CHANGE} --json

Read the \`tasks\` array in the JSON it returns. Each entry is {id, description, done}.

Consider ONLY tasks where done === false. Nothing in the data declares dependencies between
tasks — you must infer them by reading the descriptions. A task must WAIT if its description
depends on an artifact/endpoint/component produced by another not-done task in the list.
Otherwise it is STARTABLE NOW.

Also check the directory ${ROOT}/out — a file named <id>.txt there means that task's work is
already built, so it no longer blocks anything (and should not be listed as startable again).

Return startable tasks with a one-line reason each, and waiting tasks with what they wait on.
Do not build anything. Do not edit any file.`

const buildPrompt = (t) => `You are a build agent for OpenSpec change \`${CHANGE}\`.

Your task is id "${t.id}": ${t.description}

Do exactly one thing: write the file ${ROOT}/out/${t.id}.txt containing the single line:

built ${t.id}

Create the out/ directory if needed. Do not touch any other file. Return the id you handled.`

const results = []
let pass = 1

while (true) {
  phase('Analyse')
  const analysis = await agent(analysePrompt(pass), {
    label: `analyse:pass-${pass}`,
    phase: 'Analyse',
    schema: ANALYSIS_SCHEMA,
  })

  if (!analysis) {
    log(`pass ${pass}: analyse agent returned nothing — stopping`)
    break
  }

  const startable = analysis.startable || []
  const waiting = analysis.waiting || []
  log(`pass ${pass}: ${startable.length} startable [${startable.map(t => t.id).join(', ')}], ${waiting.length} waiting [${waiting.map(t => t.id).join(', ')}]`)

  if (startable.length === 0) {
    results.push({ pass, built: [], startable, waiting })
    log(`pass ${pass}: nothing startable — loop is done`)
    break
  }

  phase('Build')
  const built = (await parallel(startable.map(t => () =>
    agent(buildPrompt(t), { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA })
  ))).filter(Boolean)

  const builtIds = built.map(b => b.id)
  log(`pass ${pass}: built [${builtIds.join(', ')}]`)

  phase('Record')
  await agent(`Mark completed work in the OpenSpec tasks file for change \`${CHANGE}\`.

File: ${ROOT}/openspec/changes/${CHANGE}/tasks.md

These task ids were just built in this pass: ${builtIds.join(', ')}
Their descriptions (match the checkbox line by description text, the list is in id order 1..N):
${startable.filter(t => builtIds.includes(t.id)).map(t => `  ${t.id}. ${t.description}`).join('\n')}

For each one, flip its checkbox from "- [ ]" to "- [x]". Change nothing else — do not reword,
reorder, or add lines. Verify each edit landed and report the resulting file contents.`, {
    label: `record:pass-${pass}`,
    phase: 'Record',
  })

  results.push({ pass, built: builtIds, startable, waiting })

  if (waiting.length === 0) {
    log(`pass ${pass}: no tasks left waiting — loop is done`)
    break
  }
  pass++
  if (pass > 6) { log('safety stop: 6 passes'); break }
}

return {
  change: CHANGE,
  passes: results,
  allBuilt: results.flatMap(r => r.built),
  stillWaiting: results.length ? results[results.length - 1].waiting : [],
}
