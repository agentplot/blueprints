export const meta = {
  name: 'bolt-abc-pass',
  description: 'One construction pass for bolt-abc: analyse task readiness, then build every startable task',
  phases: [
    { title: 'Analyse', detail: 'query openspec apply instructions and infer which tasks are startable' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
  ],
}

const REPO = '/private/tmp/wfprobe/runs/B-3'

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
          waitsOn: { type: 'string', description: 'what it waits on (task ids and/or the condition)' },
        },
        required: ['id', 'description', 'waitsOn'],
        additionalProperties: false,
      },
    },
  },
  required: ['startable', 'waiting'],
  additionalProperties: false,
}

phase('Analyse')

const analysis = await agent(
  `You are the analysis agent for one construction pass of the OpenSpec change \`bolt-abc\`.

Run this command from \`${REPO}\`:

    openspec instructions apply --change bolt-abc --json

Read the \`tasks\` array in the JSON it returns. Each entry is \`{id, description, done}\`.

Your job: decide, by READING THE DESCRIPTIONS, which not-done tasks can be STARTED NOW
and which must wait on another task in the same list. Nothing in the data declares these
relationships — no dependency field, no ordering guarantee. Working them out from the
prose of the descriptions is your job. A task's description may name an artifact that
another task produces, or state outright that it cannot start until something exists.

Rules:
- Consider ONLY tasks with \`done: false\`. Tasks already done are neither startable nor waiting.
- A not-done task is startable unless something in ANOTHER not-done task's scope must exist first.
- Tasks in different repos/kits are independent unless a description says otherwise.
- Do not build anything. Do not write any files. Do not edit tasks.md. Analysis only.

Return the startable tasks with a one-line reason each, and the waiting tasks with what
each waits on.`,
  { label: 'analyse:bolt-abc', phase: 'Analyse', schema: ANALYSIS_SCHEMA },
)

if (!analysis) {
  return { error: 'analysis agent returned nothing; no build agents dispatched' }
}

log(`analysis: ${analysis.startable.length} startable, ${analysis.waiting.length} waiting`)
for (const w of analysis.waiting) log(`  waiting: task ${w.id} — waits on ${w.waitsOn}`)

if (analysis.startable.length === 0) {
  return { built: [], startable: [], waiting: analysis.waiting, note: 'nothing startable this pass' }
}

phase('Build')

const built = await parallel(
  analysis.startable.map((t) => () =>
    agent(
      `You are the build agent for task ${t.id} of the OpenSpec change \`bolt-abc\`.

Task ${t.id}: ${t.description}

Do exactly this and nothing else:
1. Ensure the directory \`${REPO}/out/\` exists (\`mkdir -p ${REPO}/out\`).
2. Write the file \`${REPO}/out/${t.id}.txt\` containing exactly the single line:

built ${t.id}

3. Return the string \`${t.id}\` and nothing else.

Do NOT touch any other file. Do NOT edit tasks.md. Do NOT touch any other task's output file.`,
      { label: `build:task-${t.id}`, phase: 'Build' },
    ).then(() => t.id),
  ),
)

const builtIds = built.filter(Boolean)

return {
  built: builtIds,
  startable: analysis.startable,
  waiting: analysis.waiting,
  failed: analysis.startable.map((t) => t.id).filter((id) => !builtIds.includes(id)),
}
