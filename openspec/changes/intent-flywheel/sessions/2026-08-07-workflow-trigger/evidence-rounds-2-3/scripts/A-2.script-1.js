export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive bolt-abc construction: analyse startable tasks, build them, repeat until nothing is startable',
  phases: [
    { title: 'Analyse', detail: 'query openspec, work out which not-done tasks can start now' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
  ],
}

const CHANGE = 'bolt-abc'
const ROOT = '/private/tmp/wfprobe/runs/A-2'

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
const passLog = []
let lastWaiting = []

for (let pass = 1; pass <= 5; pass++) {
  const alreadyBuilt = built.length
    ? `Tasks already built in earlier passes of this same run — treat them as DONE even though the JSON still reports done:false, and do NOT return them as startable or waiting: ${built.join(', ')}.`
    : 'No tasks have been built yet in this run.'

  const analysis = await agent(
    `You are the analyse step of the construction loop for OpenSpec change \`${CHANGE}\`.

Run this command from ${ROOT}:

    openspec instructions apply --change ${CHANGE} --json

Read the \`tasks\` array it returns. Each entry is {id, description, done}.

${alreadyBuilt}

Consider only tasks with done:false that are not in the already-built list. Nothing in the
data declares dependencies between tasks — you must work them out yourself by READING THE
DESCRIPTIONS. A task's description may state, in prose, that it depends on the output of
another task in the list; if the thing it depends on has not been built yet, it is waiting,
not startable.

Return:
- startable: tasks that can be STARTED NOW, each with a one-line reason.
- waiting: tasks that must wait, each with what it waits on.

Return the id and description exactly as they appear in the JSON.`,
    { label: `analyse:pass-${pass}`, phase: 'Analyse', schema: ANALYSIS_SCHEMA }
  )

  if (!analysis) {
    log(`pass ${pass}: analyse failed, stopping`)
    break
  }

  lastWaiting = analysis.waiting || []
  const startable = analysis.startable || []

  if (!startable.length) {
    log(`pass ${pass}: nothing startable — loop is done. ${lastWaiting.length} task(s) still waiting.`)
    passLog.push({ pass, startable: [], builtThisPass: [], waiting: lastWaiting })
    break
  }

  log(`pass ${pass}: ${startable.length} startable (${startable.map(t => t.id).join(', ')}), ${lastWaiting.length} waiting`)

  const results = await parallel(
    startable.map(t => () =>
      agent(
        `You are a build agent for OpenSpec change \`${CHANGE}\`, handling task id "${t.id}":

  ${t.description}

Do exactly this and nothing more:
1. Write the file ${ROOT}/out/${t.id}.txt containing the single line:
   built ${t.id}
2. Return {"id": "${t.id}", "file": "${ROOT}/out/${t.id}.txt"}.

Do not modify tasks.md or any other file.`,
        { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
      )
    )
  )

  const builtThisPass = results.filter(Boolean).map(r => r.id)
  built.push(...builtThisPass)
  passLog.push({ pass, startable: startable.map(t => ({ id: t.id, reason: t.reason })), builtThisPass, waiting: lastWaiting })

  if (!builtThisPass.length) {
    log(`pass ${pass}: no builds succeeded, stopping`)
    break
  }
}

return { change: CHANGE, built, stillWaiting: lastWaiting, passes: passLog }
