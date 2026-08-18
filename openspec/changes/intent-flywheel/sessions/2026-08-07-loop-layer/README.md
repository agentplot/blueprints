# Session: the loop layer, fully laid out

- **Change:** `flywheel` · **Type:** interactive design (`flywheel-interactive`)
- **Worktree / branch:** `.bare.sess-loop-layer` on `sess/loop-layer`
- **Charge:** `CHARGE.md` beside this file

## What this session produced

| file | what it is |
|---|---|
| `loop-layer.html` | the page — Part 1 conceptual, Part 2 logical, decisions stored at the back |
| `measurements.md` | every command run and what it returned, **including the one I got wrong** |

The page went through four rounds of annotation. It ends as a design center
rather than a decision queue: one layered diagram of the whole loop, then the
schemas, actors, thirteen session types, envelopes and one slice end to end;
then the same objects as real config, commands and payloads.

## The three corrections the operator made

Each one overturned something this session had asserted. They are recorded
here because the correction matters more than the conclusion.

1. **The fan-out is not a dependency query.** The session read "which items
   are workable now with no unmet dependency" as needing declared edges and
   built a solver over `needs:` frontmatter. There are no edges: the loop
   queries the items in play and **an agent analyses them and returns what
   can be started**. The specimen was deleted.

2. **`openspec instructions apply --change <id> --json` returns the tasks.**
   The session claimed OpenSpec exposed only a checkbox count, having read
   the head of that payload and stopped. It carries `tasks[]` as
   `{id, description, done}` — 67 for this change, 30 pending. Tasks are the
   only thing the loop parses out of OpenSpec.

3. **A dynamic workflow is a Claude Code feature, and nothing is written
   ahead of time.** `apply.instruction` holds a **prompt**; Claude Code
   authors the workflow from it on demand each run. Two schema members differ
   because their prompts describe different phases.

Also corrected: work **batches** onto a session — several task lines per
session, never one session per task — which was already recorded in
`decisions/session-types-are-the-task-taxonomy.md` before this session drew it
wrongly. And the stop is the **andon cord** (jidoka), not a rip cord.

## Sixteen decisions closed

Listed with their target records in the page's ledger. The ones that move an
existing record: `dynamic-workflows-drive-the-loop`, `the-bolt-schema-family`,
`session-types-are-the-task-taxonomy`, `the-persona-loop`, `agent-profiles`,
`message-envelopes`, `sole-writer-conductors`. Two need new records: the
four-home test, and the herdr-reference/`conduct`/register package.

## What stands ahead of construction

**A prototype, not a decision.** A workflow's `agent()` spawns subagents, and
the flywheel's first rule forbids the Agent tool because a subagent is
invisible to the operator. Whether `/workflows` visibility and
`isolation: 'worktree'` answer that objection is a fact a throwaway settles.
Its finding decides whether rule 1 is amended or the workflow's phases launch
herdr agents instead.

## Delivered

The page, annotated across four rounds and folded. This session wrote no
canonical artifact — no `tasks.md`, no `decisions/`, no `questions/`, no
`assertions/`. The conductor promotes.
