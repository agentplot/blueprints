export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive bolt-abc construction: re-query tasks each pass, analyse dependencies, build startable tasks',
  phases: [
    { title: 'Analyse', detail: 're-run openspec instructions, classify tasks startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
    { title: 'Record', detail: 'mark built tasks complete in tasks.md so the next pass unblocks dependents' },
  ],
}

const CHANGE = 'bolt-abc'
const ROOT = '/private/tmp/wfprobe/runs/PC-2'
const QUERY = `cd ${ROOT} && openspec instructions apply --change ${CHANGE} --json`

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
          waitsOn: { type: 'array', items: { type: 'string' } },
          reason: { type: 'string' },
        },
        required: ['id', 'description', 'waitsOn', 'reason'],
      },
    },
    remainingCount: { type: 'number', description: 'count of not-done tasks in the freshly queried list' },
  },
  required: ['startable', 'waiting', 'remainingCount'],
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    built: { type: 'boolean' },
    path: { type: 'string' },
    note: { type: 'string' },
  },
  required: ['id', 'built'],
}

const RECORD_SCHEMA = {
  type: 'object',
  properties: {
    marked: { type: 'array', items: { type: 'string' } },
    note: { type: 'string' },
  },
  required: ['marked'],
}

const passes = []
let stalled = false

for (let pass = 1; pass <= 6; pass++) {
  phase('Analyse')
  const analysis = await agent(
    `You are analysing pass ${pass} of the construction loop for OpenSpec change "${CHANGE}".

Run this command fresh — do NOT assume any earlier pass's answer still holds:

    ${QUERY}

Its \`tasks\` array holds one entry per task as {id, description, done}, and its
\`instruction\` field states the loop's contract. Read the instruction.

Consider ONLY the not-done tasks. Nothing in the data declares dependencies between
tasks — you must work them out by reading the descriptions (e.g. a task that calls
another task's endpoint, or that retires something another task replaces, cannot
start until that other task is built and marked done).

Classify every not-done task as either:
  - startable: nothing it depends on is still not-done. Give a one-line reason.
  - waiting: give the ids it waits on and a one-line reason.

Set remainingCount to the number of not-done tasks you saw in THIS query.
Do not write any files. Analysis only.`,
    { label: `analyse:pass-${pass}`, phase: 'Analyse', schema: ANALYSIS_SCHEMA }
  )

  if (!analysis) {
    log(`pass ${pass}: analysis agent returned nothing — stopping`)
    stalled = true
    break
  }

  log(`pass ${pass}: ${analysis.remainingCount} not-done | startable=[${analysis.startable.map(t => t.id).join(', ') || '-'}] waiting=[${analysis.waiting.map(t => t.id).join(', ') || '-'}]`)

  if (analysis.remainingCount === 0) {
    passes.push({ pass, analysis, builds: [], marked: [] })
    log(`pass ${pass}: nothing left to build — loop complete`)
    break
  }

  if (analysis.startable.length === 0) {
    passes.push({ pass, analysis, builds: [], marked: [] })
    log(`pass ${pass}: ${analysis.waiting.length} task(s) remain but none are startable — STALLED`)
    stalled = true
    break
  }

  // Barrier is deliberate: the Record stage needs every built id from this pass at
  // once, because all the checkboxes live in one tasks.md and concurrent writers to
  // one file would clobber each other.
  phase('Build')
  const builds = (await parallel(
    analysis.startable.map(task => () =>
      agent(
        `Build task ${task.id} of OpenSpec change "${CHANGE}".

Task description: ${task.description}
Why it is startable: ${task.reason}

The schema's apply instruction defines "build" for this change precisely and
narrowly: write the file \`${ROOT}/out/${task.id}.txt\` containing the single line

    built ${task.id}

Create the \`${ROOT}/out/\` directory if it does not exist. Write nothing else,
edit no other file, and in particular do NOT edit tasks.md — a later stage marks
completion. Return id, built=true, and the path you wrote.`,
        { label: `build:${task.id}`, phase: 'Build', schema: BUILD_SCHEMA }
      )
    )
  )).filter(Boolean)

  const builtIds = builds.filter(b => b.built).map(b => b.id)
  log(`pass ${pass}: built [${builtIds.join(', ') || '-'}]`)

  if (builtIds.length === 0) {
    passes.push({ pass, analysis, builds, marked: [] })
    log(`pass ${pass}: no task actually built — STALLED`)
    stalled = true
    break
  }

  phase('Record')
  const record = await agent(
    `Record completion for OpenSpec change "${CHANGE}" after pass ${pass}.

These task ids were built this pass: ${builtIds.join(', ')}

In \`${ROOT}/openspec/changes/${CHANGE}/tasks.md\`, flip ONLY those tasks' checkboxes
from \`- [ ]\` to \`- [x]\`. Match each task by its description text, not by line number.
Change nothing else in the file — no reordering, no rewording, no other checkbox.

This step is what lets the next pass's re-query see dependents become startable, so
be exact. Verify each intended id was matched before returning; return the ids you
actually marked.`,
    { label: `record:pass-${pass}`, phase: 'Record', schema: RECORD_SCHEMA }
  )

  passes.push({ pass, analysis, builds, marked: record?.marked ?? [] })

  if (!record) {
    log(`pass ${pass}: record agent failed — stopping to avoid an unterminating loop`)
    stalled = true
    break
  }
}

const allBuilt = passes.flatMap(p => p.builds.filter(b => b.built).map(b => b.id))
const last = passes[passes.length - 1]

return {
  change: CHANGE,
  passes: passes.map(p => ({
    pass: p.pass,
    remainingAtStart: p.analysis.remainingCount,
    startable: p.analysis.startable.map(t => ({ id: t.id, reason: t.reason })),
    waiting: p.analysis.waiting.map(t => ({ id: t.id, waitsOn: t.waitsOn, reason: t.reason })),
    built: p.builds.filter(b => b.built).map(b => b.id),
    marked: p.marked,
  })),
  builtIds: allBuilt,
  stillWaiting: last ? last.analysis.waiting.map(t => ({ id: t.id, waitsOn: t.waitsOn })) : [],
  stalled,
}
