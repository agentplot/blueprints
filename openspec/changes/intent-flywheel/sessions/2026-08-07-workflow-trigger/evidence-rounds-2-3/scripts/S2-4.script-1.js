export const meta = {
  name: 'bolt-abc-construction-pass',
  description: 'One construction pass for openspec change bolt-abc: analyse task readiness, then build startable tasks',
  phases: [
    { title: 'Analyse', detail: 'query openspec tasks and decide which are startable vs waiting' },
    { title: 'Build', detail: 'one agent per startable task writes out/<task-id>.txt' },
  ],
}

const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['startable', 'waiting'],
  properties: {
    startable: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'reason'],
        properties: {
          id: { type: 'string', description: 'task id' },
          reason: { type: 'string', description: 'one line: why this can be started now' },
        },
      },
    },
    waiting: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'waitsOn'],
        properties: {
          id: { type: 'string', description: 'task id' },
          waitsOn: { type: 'string', description: 'one line: which task(s) it waits on and why' },
        },
      },
    },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'wrote'],
  properties: {
    id: { type: 'string', description: 'the task id handled' },
    wrote: { type: 'string', description: 'path of the file written' },
  },
}

phase('Analyse')

const analysis = await agent(
  `You are the analysis agent for one construction pass of the OpenSpec change \`bolt-abc\`.

Working directory: /private/tmp/wfprobe/runs/S2-4

1. Run exactly this command with Bash:
   openspec instructions apply --change bolt-abc --json
2. Parse its JSON output and read the \`tasks\` array. Each entry is {id, description, done}.
3. Ignore any task where done is true.
4. For the remaining (not-done) tasks, READ THE DESCRIPTIONS and work out the dependency
   relationships yourself. Nothing in the data declares them - you must infer from the wording
   which tasks depend on the output/completion of another task in the list (e.g. a description
   that references, consumes, extends, validates, or builds on top of what another task
   produces).

Classify every not-done task into exactly one bucket:
- startable: nothing it needs is still outstanding among the not-done tasks -> it can be STARTED NOW.
- waiting: it depends on at least one other not-done task in the list.

Return the startable ids each with a one-line reason, and the waiting ids each with a one-line
statement of what they wait on. Use the exact task id strings from the JSON. Do not modify any
files.`,
  { label: 'analyse:bolt-abc', phase: 'Analyse', schema: ANALYSIS_SCHEMA }
)

if (!analysis) {
  return { error: 'analysis agent failed', startable: [], waiting: [], built: [] }
}

log(`analysis: ${analysis.startable.length} startable, ${analysis.waiting.length} waiting`)

if (analysis.startable.length === 0) {
  return { startable: [], waiting: analysis.waiting, built: [], note: 'nothing startable this pass' }
}

phase('Build')

const built = await parallel(
  analysis.startable.map((t) => () =>
    agent(
      `You are the build agent for task \`${t.id}\` of the OpenSpec change \`bolt-abc\`.

Working directory: /private/tmp/wfprobe/runs/S2-4
Why this task is startable: ${t.reason}

Do exactly this and nothing more:
1. Ensure the directory /private/tmp/wfprobe/runs/S2-4/out exists (create it if needed).
2. Write the file /private/tmp/wfprobe/runs/S2-4/out/${t.id}.txt whose entire contents is the
   single line:
built ${t.id}
3. Return the task id you handled and the path you wrote.

Do not touch any other file. Do not run openspec commands.`,
      { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  )
)

const ok = built.filter(Boolean)

return {
  startable: analysis.startable,
  waiting: analysis.waiting,
  built: ok,
  failed: analysis.startable.filter((t) => !ok.some((b) => b.id === t.id)).map((t) => t.id),
}
