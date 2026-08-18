export const meta = {
  name: 'bolt-abc-construction',
  description: 'Drive bolt-abc construction: analyse task dependencies, then build startable tasks in parallel',
  phases: [
    { title: 'Analyse', detail: 're-query openspec, infer which tasks are startable now' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
  ],
}

const ROOT = '/private/tmp/wfprobe/runs/B-8'

const ANALYSE_SCHEMA = {
  type: 'object',
  properties: {
    startable: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'task id from the tasks array' },
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
          waitsOn: { type: 'string', description: 'which task id(s) it waits on, and why' },
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
    id: { type: 'string', description: 'the task id this agent handled' },
    file: { type: 'string', description: 'path of the file written' },
  },
  required: ['id', 'file'],
}

const built = []
const MAX_PASSES = 5
let lastWaiting = []

for (let pass = 1; pass <= MAX_PASSES; pass++) {
  phase('Analyse')

  const alreadyBuilt = built.length
    ? `\n\nEarlier passes in this same run have ALREADY built these task ids: ${built.join(', ')}. Treat those as complete/satisfied even though tasks.md may still show them unchecked — verify by listing ${ROOT}/out/. Do NOT return them as startable again.`
    : ''

  const analysis = await agent(
    `You are the analyse phase of the bolt-abc construction loop, pass ${pass}.

Run this command fresh (do NOT rely on any cached or remembered answer):

  cd ${ROOT} && openspec instructions apply --change bolt-abc --json

Read the \`tasks\` array it returns. Each entry is {id, description, done}.

Your job: decide, purely by reading the task DESCRIPTIONS, which not-done
tasks can be STARTED NOW, and which must wait on another task in the list.
NOTHING in the data declares these relationships — no depends-on field, no
ordering guarantee. Working them out from the natural-language descriptions
is exactly your job. Read each description carefully for phrases that name
another task's subject or state an ordering constraint.

Also list ${ROOT}/out/ to see which task ids already have output files.
A task whose output file already exists is not startable — it is done.

Tasks already marked done:true are neither startable nor waiting — omit them
entirely.${alreadyBuilt}

Return:
- startable: the not-done task ids that can begin immediately, each with a
  ONE-LINE reason.
- waiting: the not-done task ids that cannot, each naming what it waits on
  and why you concluded that from the description.

Be conservative: if a description names another task's deliverable, treat it
as a dependency.`,
    { label: `analyse:pass-${pass}`, phase: 'Analyse', schema: ANALYSE_SCHEMA }
  )

  if (!analysis) {
    log(`pass ${pass}: analyse agent returned nothing — stopping`)
    break
  }

  lastWaiting = analysis.waiting || []
  const startable = (analysis.startable || []).filter(t => !built.includes(t.id))

  log(`pass ${pass}: ${startable.length} startable (${startable.map(t => t.id).join(', ') || 'none'}), ${lastWaiting.length} waiting (${lastWaiting.map(t => t.id).join(', ') || 'none'})`)

  if (!startable.length) {
    log(`pass ${pass}: nothing startable — loop is dry, stopping`)
    break
  }

  phase('Build')

  const results = await parallel(
    startable.map(t => () =>
      agent(
        `You are a build agent for bolt-abc task ${t.id}: "${t.description}"

Why you were dispatched: ${t.reason}

Do exactly this and nothing more:

  mkdir -p ${ROOT}/out
  printf 'built ${t.id}\\n' > ${ROOT}/out/${t.id}.txt

The file ${ROOT}/out/${t.id}.txt must contain the single line:

  built ${t.id}

Verify it by reading the file back. Do NOT edit tasks.md, do NOT touch any
other task's output file, do NOT create any other files.

Return the task id you handled and the path you wrote.`,
        { label: `build:task-${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
      )
    )
  )

  const ok = results.filter(Boolean)
  const failed = startable.filter(t => !ok.some(r => r.id === t.id))

  ok.forEach(r => { if (!built.includes(r.id)) built.push(r.id) })

  if (failed.length) {
    log(`pass ${pass}: ${failed.length} build agent(s) returned nothing — ids ${failed.map(t => t.id).join(', ')} NOT recorded as built`)
  }
  log(`pass ${pass}: built ${ok.map(r => r.id).join(', ') || 'nothing'} (cumulative: ${built.join(', ')})`)

  if (pass === MAX_PASSES && lastWaiting.length) {
    log(`hit pass cap ${MAX_PASSES} with ${lastWaiting.length} task(s) still waiting — NOT all work was attempted`)
  }
}

return {
  built,
  stillWaiting: lastWaiting,
}
