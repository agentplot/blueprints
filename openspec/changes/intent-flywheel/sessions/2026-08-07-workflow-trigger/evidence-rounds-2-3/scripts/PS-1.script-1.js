export const meta = {
  name: 'bolt-abc-construction-loop',
  description: 'Drive the bolt-abc construction loop: analyse startable tasks, build them, repeat until done or deadlocked',
  phases: [
    { title: 'Analyse', detail: 're-query openspec, classify tasks startable vs waiting' },
    { title: 'Build', detail: 'write out/<task-id>.txt for each startable task' },
    { title: 'Record', detail: 'mark built tasks complete in tasks.md' },
  ],
}

const ROOT = '/private/tmp/wfprobe/runs/PS-1'
const QUERY = `cd ${ROOT} && openspec instructions apply --change bolt-abc --json`

const ANALYSIS_SCHEMA = {
  type: 'object',
  required: ['total', 'remaining', 'startable', 'waiting'],
  properties: {
    total: { type: 'number' },
    remaining: { type: 'number', description: 'count of not-done tasks' },
    startable: {
      type: 'array',
      items: {
        type: 'object',
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
        required: ['id', 'description', 'waitsOn'],
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'string', description: 'task id(s) it must wait on, and why' },
        },
      },
    },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  required: ['id', 'path', 'ok'],
  properties: {
    id: { type: 'string' },
    path: { type: 'string' },
    ok: { type: 'boolean' },
    note: { type: 'string' },
  },
}

const RECORD_SCHEMA = {
  type: 'object',
  required: ['marked'],
  properties: {
    marked: { type: 'array', items: { type: 'string' } },
    note: { type: 'string' },
  },
}

const passes = []
let deadlock = null

for (let pass = 1; pass <= 6; pass++) {
  phase('Analyse')
  const analysis = await agent(
    `You are running the ANALYSE phase of pass ${pass} of the bolt-abc construction loop.

Run this command and parse its JSON output:

    ${QUERY}

The \`tasks\` array holds one entry per task as {id, description, done}. Re-run the
query now rather than trusting any earlier answer — earlier passes may have completed tasks.

Consider ONLY tasks where done === false. Nothing in the data declares dependencies
between tasks; you must work them out by READING THE DESCRIPTIONS. A task is STARTABLE
if nothing in its description makes it depend on another not-done task in the list. A
task is WAITING if its description says or implies it needs another task in the list
that is not yet done.

Return:
- total: the total task count
- remaining: how many tasks have done === false
- startable: every not-done task that can be started right now, each with a one-line reason
- waiting: every not-done task that must wait, each naming what it waits on

Do not write any files. Analysis only.`,
    { label: `analyse:pass-${pass}`, phase: 'Analyse', schema: ANALYSIS_SCHEMA }
  )

  if (!analysis) {
    deadlock = `Analyse agent failed on pass ${pass}`
    break
  }

  log(`Pass ${pass}: ${analysis.remaining} remaining — ${analysis.startable.length} startable, ${analysis.waiting.length} waiting`)

  if (analysis.remaining === 0) {
    passes.push({ pass, analysis, built: [], note: 'nothing left to do' })
    break
  }

  if (analysis.startable.length === 0) {
    deadlock = `Pass ${pass}: ${analysis.remaining} task(s) remain but none are startable — ${analysis.waiting.map(w => `${w.id} waits on ${w.waitsOn}`).join('; ')}`
    passes.push({ pass, analysis, built: [], note: 'deadlock' })
    break
  }

  phase('Build')
  const built = (await parallel(
    analysis.startable.map(t => () =>
      agent(
        `You are running the BUILD phase of the bolt-abc construction loop for task ${t.id}: "${t.description}".

Write the file ${ROOT}/out/${t.id}.txt containing exactly one line:

    built ${t.id}

That single line is the whole file. Do not create any other files, do not edit
tasks.md, and do not touch any other task's output file. Report the id, the absolute
path you wrote, and whether it succeeded.`,
        { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
      )
    )
  )).filter(Boolean)

  const succeeded = built.filter(b => b.ok).map(b => b.id)

  if (succeeded.length > 0) {
    phase('Record')
    await agent(
      `Record completion for the bolt-abc construction loop. These task ids were just built
successfully: ${succeeded.join(', ')}.

Edit ${ROOT}/openspec/changes/bolt-abc/tasks.md and change the checkbox from \`- [ ]\` to
\`- [x]\` for exactly those tasks — match them by their description text, which is:
${analysis.startable.filter(t => succeeded.includes(t.id)).map(t => `  - ${t.id}: ${t.description}`).join('\n')}

Change nothing else in the file: no rewording, no reordering, no other checkboxes.
Before editing, verify ${ROOT}/out/<id>.txt exists and contains \`built <id>\` for each
id; if one does not, leave that checkbox alone and say so in the note.
Return the list of ids you actually marked.`,
      { label: `record:pass-${pass}`, phase: 'Record', schema: RECORD_SCHEMA }
    )
  }

  passes.push({
    pass,
    remainingAtStart: analysis.remaining,
    startable: analysis.startable,
    waiting: analysis.waiting,
    built,
  })
}

return { passes, deadlock }
