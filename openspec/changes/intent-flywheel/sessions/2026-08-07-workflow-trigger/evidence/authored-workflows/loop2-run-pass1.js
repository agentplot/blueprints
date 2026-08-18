export const meta = {
  name: 'openspec-demo-loop',
  description: 'One construction pass for openspec change "demo": analyse task readiness, then build startable tasks',
  phases: [
    { title: 'Analyse', detail: 'query openspec tasks and infer which are startable now' },
    { title: 'Build', detail: 'one agent per startable task, writes out/<id>.txt' },
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
        required: ['id', 'description', 'waitsOn'],
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          waitsOn: { type: 'string', description: 'which task id(s) it waits on and why' },
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
    id: { type: 'string' },
    wrote: { type: 'string', description: 'path of the file written' },
  },
}

phase('Analyse')

const analysis = await agent(
  `You are the analyse phase of a construction loop for the openspec change "demo".

Working directory: /private/tmp/wfprobe/loop2

1. Run exactly this command from that directory:
   openspec instructions apply --change demo --json
2. Read the \`tasks\` array in the JSON output. Each entry is {id, description, done}.
3. Ignore tasks where done === true.
4. For each NOT-done task, decide from the DESCRIPTION TEXT ALONE whether it can be
   STARTED NOW, or whether it must wait on another task in the list. Nothing in the data
   declares these relationships - you must infer them by reading what the descriptions say.
   A task waits only if its description indicates it depends on something another
   not-done task in the list produces. Tasks that merely touch the same component/kit are
   NOT dependent on each other.
5. Also check whether the depended-on work already exists on disk (e.g. out/<id>.txt) -
   if a prerequisite task is still not-done in the JSON, treat it as unbuilt.

Return the startable task ids (with description and a one-line reason each) and the
waiting ones (with description and what they wait on).`,
  { label: 'analyse:demo', phase: 'Analyse', schema: ANALYSIS_SCHEMA }
)

log(`Analyse: ${analysis.startable.length} startable, ${analysis.waiting.length} waiting`)
for (const t of analysis.startable) log(`  startable ${t.id}: ${t.reason}`)
for (const t of analysis.waiting) log(`  waiting   ${t.id}: waits on ${t.waitsOn}`)

phase('Build')

const built = (await parallel(
  analysis.startable.map((t) => () =>
    agent(
      `You are a build agent for the openspec change "demo", handling task id "${t.id}":
"${t.description}"

Working directory: /private/tmp/wfprobe/loop2

Do exactly this and nothing more:
1. Ensure the directory /private/tmp/wfprobe/loop2/out exists (create it if needed).
2. Write the file /private/tmp/wfprobe/loop2/out/${t.id}.txt containing exactly the
   single line: built ${t.id}
3. Return the task id you handled and the path you wrote.

Do not modify tasks.md, do not touch any other file, do not commit anything.`,
      { label: `build:${t.id}`, phase: 'Build', schema: BUILD_SCHEMA }
    )
  )
)).filter(Boolean)

return {
  built: built.map((b) => ({ id: b.id, wrote: b.wrote })),
  startable: analysis.startable,
  waiting: analysis.waiting,
}
