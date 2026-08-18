export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Run the bolt-abc loopdemo construction loop: analyse startable tasks, build them, repeat until done',
  phases: [
    { title: 'Analyse', detail: 'query openspec instructions apply and infer task dependencies' },
    { title: 'Build', detail: 'one agent per startable task writes out/<id>.txt' },
    { title: 'Checkoff', detail: 'serialized update of tasks.md checkboxes' },
  ],
}

const CHANGE = 'bolt-abc'
const ROOT = '/private/tmp/wfprobe/runs/PS-4'

const ANALYSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['total', 'remaining', 'startable', 'waiting'],
  properties: {
    total: { type: 'number' },
    remaining: { type: 'number', description: 'count of not-done tasks' },
    startable: {
      type: 'array',
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
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'description', 'waitsOn', 'reason'],
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'array', items: { type: 'string' } },
          reason: { type: 'string' },
        },
      },
    },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'built', 'path'],
  properties: {
    id: { type: 'string' },
    built: { type: 'boolean' },
    path: { type: 'string' },
  },
}

const CHECKOFF_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['checked', 'note'],
  properties: {
    checked: { type: 'array', items: { type: 'string' } },
    note: { type: 'string' },
  },
}

const passLog = []

for (let pass = 1; pass <= 6; pass++) {
  phase('Analyse')

  const analysis = await agent(
    `You are running phase 1 (Analyse) of pass ${pass} of the construction loop for OpenSpec change \`${CHANGE}\`.

Run exactly this command from ${ROOT}:

    openspec instructions apply --change ${CHANGE} --json

Its \`tasks\` array holds one entry per task as {id, description, done}. Re-run the query now — do NOT rely on any prior pass's answer.

Then decide, by READING THE DESCRIPTIONS ONLY, which not-done tasks can be STARTED NOW and which must wait on another task in the list. Nothing in the data declares those relationships; inferring them from the prose is the job. A task waits only if its description states or clearly implies a dependency on another task in the list. A task whose blocker is already \`done: true\` is startable.

Ignore tasks already marked done — they belong in neither list.

Return the structured result: total task count, remaining (not-done) count, the startable ids each with a one-line reason, and the waiting ids each with what they wait on.`,
    { label: `analyse:pass-${pass}`, phase: 'Analyse', schema: ANALYSE_SCHEMA },
  )

  if (!analysis) {
    log(`pass ${pass}: analyse failed, aborting loop`)
    break
  }

  if (analysis.remaining === 0) {
    log(`pass ${pass}: nothing remaining — loop complete`)
    passLog.push({ pass, startable: [], waiting: [], built: [], note: 'no remaining tasks' })
    break
  }

  log(
    `pass ${pass}: ${analysis.remaining} remaining — startable [${analysis.startable.map(t => t.id).join(', ') || 'none'}], waiting [${analysis.waiting.map(t => t.id).join(', ') || 'none'}]`,
  )

  if (analysis.startable.length === 0) {
    log(`pass ${pass}: no startable tasks but ${analysis.remaining} remaining — deadlock, stopping`)
    passLog.push({
      pass,
      startable: [],
      waiting: analysis.waiting,
      built: [],
      note: 'deadlock: remaining tasks all blocked',
    })
    break
  }

  phase('Build')

  // Builders run concurrently and each writes its OWN file, so there is no
  // contention. tasks.md is a shared file — it is updated once, serially, below.
  const builds = (await parallel(
    analysis.startable.map(t => () =>
      agent(
        `You are running phase 2 (Build) of the construction loop for OpenSpec change \`${CHANGE}\`.

Build task ${t.id}: "${t.description}"

"Building" in this loop means exactly one thing: write the file ${ROOT}/out/${t.id}.txt containing the single line:

built ${t.id}

Nothing else. Do not touch tasks.md, do not create other files, do not run openspec commands. Write that one file and return {id, built, path}.`,
        { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA },
      ),
    ),
  )).filter(Boolean)

  const builtIds = builds.filter(b => b.built).map(b => b.id)

  if (builtIds.length > 0) {
    phase('Checkoff')
    await agent(
      `Mark tasks as complete in ${ROOT}/openspec/changes/${CHANGE}/tasks.md.

These task ids were just built successfully: ${builtIds.join(', ')}.

The tasks file is a markdown checklist under a "## Build" heading; task ids are 1-based positions in that list, in file order. For each built id, flip its line from "- [ ]" to "- [x]". Leave the description text and every other line byte-identical. Do not reorder, add, or remove lines.

Verify each corresponding out/<id>.txt exists before flipping that id's box; if one is missing, leave that box unchecked and say so.

Return the ids you actually checked off and a one-line note.`,
      { label: `checkoff:pass-${pass}`, phase: 'Checkoff', schema: CHECKOFF_SCHEMA },
    )
  }

  passLog.push({
    pass,
    startable: analysis.startable.map(t => ({ id: t.id, reason: t.reason })),
    waiting: analysis.waiting.map(t => ({ id: t.id, waitsOn: t.waitsOn, reason: t.reason })),
    built: builtIds,
    note: `built ${builtIds.length}/${analysis.startable.length} startable`,
  })

  if (builtIds.length === 0) {
    log(`pass ${pass}: no task built despite startable work — stopping to avoid a spin`)
    break
  }
}

return { change: CHANGE, passes: passLog }
