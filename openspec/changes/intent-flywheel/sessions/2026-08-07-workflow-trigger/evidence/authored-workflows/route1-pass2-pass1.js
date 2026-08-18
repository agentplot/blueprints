export const meta = {
  name: 'loopdemo-pass',
  description: 'One pass of the loopdemo construction loop: query workable proposals, fan out one agent each',
  phases: [
    { title: 'Query', detail: 'run workable.mjs to find proposals whose deps are merged' },
    { title: 'Fan out', detail: 'one agent per workable proposal, writes out/<id>.txt' },
  ],
}

const REPO = '/private/tmp/wfprobe/loopdemo'

const QUERY_SCHEMA = {
  type: 'object',
  properties: {
    workable: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          repo: { type: 'string' },
          state: { type: 'string' },
          review: { type: 'string' },
        },
        required: ['id', 'repo', 'state'],
      },
    },
    blocked: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          waitsOn: { type: 'array', items: { type: 'string' } },
        },
        required: ['id', 'waitsOn'],
      },
    },
    rawOutput: { type: 'string' },
  },
  required: ['workable', 'blocked', 'rawOutput'],
}

phase('Query')
const q = await agent(
  `From the repo root ${REPO}, run exactly this command:

  node workable.mjs --dir openspec/changes/demo/proposals

Parse its stdout and return the structured result. The output has a "workable now (deps at merged):" section and a "blocked:" section. Each workable line looks like "  <state>  <id>  [<repo>]  review:<review>". Each blocked line looks like "  <state>  <id>  [<repo>]  waits on: <ids>". Include the verbatim stdout as rawOutput. Do not modify any files.`,
  { label: 'query:workable', phase: 'Query', schema: QUERY_SCHEMA, effort: 'low' }
)

if (!q || !q.workable) {
  return { error: 'query phase failed', query: q }
}

log(`query: ${q.workable.length} workable, ${q.blocked.length} blocked`)

if (q.workable.length === 0) {
  return { built: [], blocked: q.blocked, rawOutput: q.rawOutput }
}

phase('Fan out')
const built = await parallel(
  q.workable.map(p => () =>
    agent(
      `You are handling proposal "${p.id}" (repo ${p.repo}, state ${p.state}) for the loopdemo change.

Create the file ${REPO}/out/${p.id}.txt containing exactly this single line:

built ${p.id}

Create the out/ directory if it does not exist. Touch no other file. Return only the proposal id: ${p.id}`,
      { label: `build:${p.id}`, phase: 'Fan out', effort: 'low' }
    ).then(() => p.id)
  )
)

return {
  built: built.filter(Boolean),
  blocked: q.blocked,
  rawOutput: q.rawOutput,
}
