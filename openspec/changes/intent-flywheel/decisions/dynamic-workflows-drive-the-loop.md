# Decision: `apply.instruction` holds a prompt, and Claude Code authors the workflow from it

## Decision
A conductor's loop is a **Claude Code dynamic workflow**, and **nothing is
written ahead of time**. The schema's `apply.instruction` holds a *prompt*;
Claude Code authors the workflow from that prompt on demand, each run.
There is no script on disk to write or maintain, and two schema members
differ because their prompts describe different phases.

The loop is four steps, the same on both sides:

1. **Query the tasks.** `openspec instructions apply --change <id> --json`
   returns `tasks[]` as `{id, description, done}`. Tasks are the only thing
   the loop parses out of OpenSpec.
2. **An agent analyses them** and returns what can start, grouped into
   batches with a session type each. This is the dynamic step — there is no
   solver and no declared dependency graph.
3. **Batch into sessions.** Several task lines per session, one worktree
   each.
4. **The conductor merges, then re-queries.** Merging is always the
   conductor's, never the working agent's.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/spec-driven-construction.md`
- Produced by: `sessions/2026-08-07-loop-layer/`, four annotation rounds,
  with three of its own measurements corrected by the operator

## What was measured, and what was measured wrong
`sessions/2026-08-07-loop-layer/measurements.md` carries every command and
its output. **One of its entries is itself wrong: M9 describes building and
running `specimens/workable.mjs`, and that file exists on no branch — it was
never committed.** The specimen was struck as the wrong mechanism anyway, so
nothing rests on it, but the measurement record overstates what was run. The
closed session directory is not rewritten (→ `decisions/session-directories.md`);
the correction lives here, where the measurement is used.

Three corrections matter more than the conclusions:

- **The fan-out is not a dependency query.** The session read "which items
  are workable now" as needing declared edges and built a solver over
  `needs:` frontmatter. There are no edges. An agent analyses the items in
  play and returns what can start. The specimen was deleted.
- **OpenSpec does expose the tasks.** The session claimed it exposed only a
  checkbox count, having read the head of the payload and stopped.
  `tasks[]` is there — 67 for this change, 30 pending at the time. One real
  limit: `description` is the checkbox line only, so a wrapped task arrives
  truncated; the same payload carries `tasks.md`'s path under
  `contextFiles`, and the analysing agent reads it when it needs full text.
- **A `workflow:` key in a schema is silently stripped**, and
  `openspec schema validate` still prints ✓. Unknown keys are dropped, not
  rejected. That is why the loop lives in `apply.instruction`, an existing
  field with a real surface, rather than in a key of its own.

An intent's artifact graph is additionally saturated — seven of eight done,
the eighth ready — because artifact completion is file existence against a
glob. It will never say anything about this intent again. The loop reads
tasks precisely because artifacts have stopped being informative.

## Two things the feature gives for free
`agentType` resolves from the same registry as the agent profiles, so a
phase launches a session under `flywheel-construction-session` by name. And
`isolation: 'worktree'` gives each agent its own git worktree — the
session-gets-a-worktree rule, already implemented by the tool.

## Consequences
- Both loops' schemas carry a loop prompt in `apply.instruction`. Five
  prompts: one per bolt member, plus the intent loop.
- The apply agents stop merging; the conductor merges.
- Design sessions are launched by the workflow, batched, not one at a time.
- Where the trigger lives is settled separately
  (→ `decisions/the-trigger-lives-in-the-invocation.md`): the invocation
  carries it, the schema describes only the loop's shape and mentions no
  workflow at all, and the text mandates worktree isolation and requires the
  run ID.
- **Correction to an earlier claim here.** Round 1 reported the opt-in gate
  as settled open on 4/4 runs. Round 2 found two conductors refusing on
  exactly opt-in grounds, unprompted — *"that opt-in has to come from you,
  not from a tool's output."* The gate is **probabilistic, not open**: 4/4
  was a small sample of a behaviour that varies, and the record should not
  read as though a gate were proven absent.
