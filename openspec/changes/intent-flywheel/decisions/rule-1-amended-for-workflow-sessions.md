# Decision: rule 1 is amended narrowly — sessions are the only mutating calls a workflow makes

## Decision
Inside a dynamic workflow, `agent()` is permitted. The amendment is exactly
as wide as the loop needs and no wider:

- **A session launched from a workflow is the only mutating call.** Any
  phase that launches a session runs it `isolation: 'worktree'`, mandatory —
  one worktree, one branch, one session.
- **Every other `agent()` call is read-only and gets no worktree.**
  Querying the tasks, analysing dependencies, judging batches — none of
  these writes, so none of them pays for isolation.
- **The run ID is reported** when the loop ends, and **the conductor merges
  every session branch** — the named cleanup step, so no worktree is
  stranded and none survives the run unmerged and unremoved.

Outside a workflow, rule 1 stands whole: a standing delegated agent is a
herdr agent, visible on the fleet.

## Context
- Raised by: `questions/rule-1-and-workflow-agents.md`, from
  `sessions/2026-08-07-workflow-trigger/` — it blocked the loop-layer
  handoff
- Closed by: the operator, 2026-08-10
- Chapter: `books/aidlc-design/src/spec-driven-construction.md`

## Why
The prototype measured the rule as written being silently overridden:
8/8 workflow fan-outs fired under the conductor profile with the rule in
context, 7 without remarking on the tension. A rule that schema-adjacent
text quietly overrides is not enforced by restating it — it is enforced by
writing the sanctioned path down with its costs named. The costs the
prototype priced are paid for explicitly here: herdr sees no workflow
agents (`/workflows` and the reported run ID are the visibility inside a
run), and isolated work is stranded unless something merges it (the
conductor's merge step is that something).

## Consequences
- The first line of every loop prompt states what a phase may spawn:
  sessions isolated in worktrees, everything else read-only.
- `isolation: 'worktree'` is mandated on session launches only — the
  blanket "any writing phase" phrasing in earlier drafts narrows to this.
- The loop-layer handoff is unblocked.
- The conductor profiles and `flywheel-construction` lose the flat "never
  the Agent tool" line and gain this scoped rule — machinery, so it arrives
  through the bolt.
