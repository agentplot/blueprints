export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive bolt-abc: analyse startable tasks from live openspec query, then build them, passing until nothing new unblocks',
  phases: [
    { title: 'Analyse', detail: 'query openspec, infer which not-done tasks are startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
  ],
}

const CHANGE = 'bolt-abc'
const ROOT = '/private/tmp/wfprobe/runs/A-3'

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
          waitsOn: { type: 'string', description: 'what it waits on (task id and/or the thing it needs)' },
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
    id: { type: 'string', description: 'the task id handled' },
    file: { type: 'string', description: 'absolute path of the file written' },
  },
  required: ['id', 'file'],
  additionalProperties: false,
}

const built = []
const passes = []
let pass = 0

while (pass < 6) {
  pass++
  phase('Analyse')

  const alreadyBuilt = built.length
    ? `Already built EARLIER IN THIS RUN (treat these as complete/satisfied even though the tasks file may still show them unchecked): ${built.join(', ')}.`
    : 'Nothing has been built yet in this run.'

  const analysis = await agent(
    `You are the analyse phase of the construction loop for OpenSpec change \`${CHANGE}\`.

Run this command from ${ROOT}:

    openspec instructions apply --change ${CHANGE} --json

Read the \`tasks\` array it returns. Each entry is {id, description, done}.

Your job: decide, PURELY BY READING THE DESCRIPTIONS, which not-done tasks can be
STARTED NOW and which must wait on another task in that same list. Nothing in the
data declares these relationships - no depends-on field, no ordering guarantee.
Infer them from what the descriptions say about each other (e.g. a task that
consumes an endpoint another task produces cannot start until that producer is built).

${alreadyBuilt}

Rules:
- Ignore tasks with done: true. They are finished.
- A not-done task whose blocker appears in the already-built list above is now STARTABLE.
- Do not edit any files. Do not mark anything complete. Analysis only.
- Return every not-done, not-already-built task in exactly one of the two arrays.
- \`reason\` / \`waitsOn\` must each be a single short line.`,
    { label: `analyse:pass-${pass}`, phase: 'Analyse', schema: ANALYSIS_SCHEMA }
  )

  if (!analysis) {
    log(`pass ${pass}: analyse agent returned nothing - stopping`)
    break
  }

  const fresh = analysis.startable.filter(t => !built.includes(t.id))

  log(`pass ${pass}: ${fresh.length} startable (${fresh.map(t => t.id).join(', ') || 'none'}), ${analysis.waiting.length} waiting`)

  if (!fresh.length) {
    passes.push({ pass, startable: [], waiting: analysis.waiting, builtThisPass: [] })
    break
  }

  phase('Build')

  const results = await parallel(
    fresh.map(t => () =>
      agent(
        `You are a build agent for OpenSpec change \`${CHANGE}\`, handling task id \`${t.id}\`:

  "${t.description}"

Do exactly this and nothing more:
1. Ensure the directory ${ROOT}/out exists (create it if not).
2. Write the file ${ROOT}/out/${t.id}.txt containing the single line:

    built ${t.id}

Do not touch any other file. Do not edit tasks.md. Do not run openspec.
Return the task id you handled and the absolute path you wrote.`,
        { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
      )
    )
  )

  const ok = results.filter(Boolean)
  ok.forEach(r => { if (!built.includes(r.id)) built.push(r.id) })

  passes.push({
    pass,
    startable: fresh,
    waiting: analysis.waiting,
    builtThisPass: ok.map(r => r.id),
    failed: fresh.filter(t => !ok.some(r => r.id === t.id)).map(t => t.id),
  })

  log(`pass ${pass}: built ${ok.map(r => r.id).join(', ') || 'none'}`)
}

const lastPass = passes[passes.length - 1]

return {
  change: CHANGE,
  passesRun: passes.length,
  built,
  stillWaiting: lastPass ? lastPass.waiting : [],
  detail: passes,
}
