export const meta = {
  name: 'loopdemo-pass',
  description: 'One pass of the loopdemo construction loop: query workable proposals, then fan out one agent per workable proposal',
  phases: [
    { title: 'Query', detail: 'run workable.mjs to find proposals whose deps are all merged' },
    { title: 'Build', detail: 'one agent per workable proposal writes out/<id>.txt' },
  ],
}

const REPO = '/private/tmp/wfprobe/loopdemo'
const PROPOSAL_DIR = 'openspec/changes/demo/proposals'

const QUERY_SCHEMA = {
  type: 'object',
  properties: {
    workable: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          state: { type: 'string' },
          repo: { type: 'string' },
        },
        required: ['id'],
        additionalProperties: true,
      },
    },
    blocked: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          state: { type: 'string' },
          waitsOn: { type: 'array', items: { type: 'string' } },
        },
        required: ['id'],
        additionalProperties: true,
      },
    },
    rawOutput: { type: 'string' },
  },
  required: ['workable', 'blocked', 'rawOutput'],
  additionalProperties: false,
}

phase('Query')
const query = await agent(
  `From the repo root ${REPO}, run exactly this command with Bash:\n\n` +
  `    node workable.mjs --dir ${PROPOSAL_DIR}\n\n` +
  `It prints two sections: "workable now (deps at merged):" and "blocked:". ` +
  `Each workable line looks like "  <state>  <id>  [<repo>]  review:<reviewer>". ` +
  `Each blocked line looks like "  <state>  <id>  [<repo>]  waits on: <ids>". ` +
  `Parse the output and return it structured. Do not modify any files. ` +
  `Include the command's verbatim stdout as rawOutput.`,
  { label: 'query:workable', phase: 'Query', schema: QUERY_SCHEMA }
)

if (!query) return { error: 'query agent failed', built: [], blocked: [] }

log(`workable: ${query.workable.map(p => p.id).join(', ') || '(none)'} | blocked: ${query.blocked.map(p => p.id).join(', ') || '(none)'}`)

if (query.workable.length === 0) {
  return { built: [], blocked: query.blocked, rawOutput: query.rawOutput, note: 'nothing workable this pass' }
}

phase('Build')
const built = await parallel(query.workable.map(p => () =>
  agent(
    `You are building proposal "${p.id}" for the loopdemo change in ${REPO}.\n\n` +
    `Do exactly this and nothing more:\n` +
    `1. Ensure the directory ${REPO}/out exists (create it if missing).\n` +
    `2. Write the file ${REPO}/out/${p.id}.txt whose entire contents are the single line:\n` +
    `   built ${p.id}\n` +
    `   (one trailing newline, no other text).\n` +
    `3. Do not touch any other file.\n\n` +
    `Your final return value must be exactly the proposal id: ${p.id}`,
    { label: `build:${p.id}`, phase: 'Build' }
  ).then(() => p.id)
))

return {
  built: built.filter(Boolean),
  blocked: query.blocked,
  rawOutput: query.rawOutput,
}
