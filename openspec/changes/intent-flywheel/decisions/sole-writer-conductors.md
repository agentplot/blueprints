# Decision: a session checks its own lines off in its worktree; the conductor is sole writer on main

## Decision
Every flywheel change has exactly one conductor — `intent-<slug>` or
`bolt-<slug>` — and the conductor is **the sole writer on main**. What
changed is where that scope binds: **a session checks off its own task
lines inside its own worktree**, and the conductor's merge is what admits
those changes to main.

The split:

- **The session closes what it was charged with** — its task lines, the
  decision records for questions it closed, the `State:` flips on those
  question records. It knows all of it firsthand.
- **The conductor opens what the session discovered** — new tasks, new
  questions, re-sequencing, anything touching the frontier as a whole. A
  session sees its batch; the frontier is not in its view.
- **The conductor merges.** Always, and it is the one serialization point.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md` (to be rewritten)
- Produced by: `sessions/2026-08-05-loop-pivot/`; amended by the operator in
  `sessions/2026-08-07-loop-layer/` decision 14

## Why the original scope was wider than it needed to be
Sole-writer existed because two sessions sharing a working tree share a git
index, so a pathspec-less commit sweeps whatever a sibling staged — which
happened, in `sessions/2026-08-06-book-writeback/`. A worktree per session
removes that cause entirely (→ `decisions/session-worktrees.md`), and once
it is gone, forbidding a session to check off its own line buys nothing and
costs a round trip through the conductor for information the session
already has.

What survives is the part the worktree does not solve: **main is shared**,
and merges have to be serialized by one actor.

## Consequences
- Session charges say the session checks its own lines off; they no longer
  say it writes no canonical artifact.
- Parallel sessions still cannot conflict — disjoint batches, disjoint
  lines, and git merges non-adjacent lines in `tasks.md`.
- The handoff stays a request, never a write: an intent conductor asks for a
  bolt and never authors the bolt change.
- Landed in `add-flywheel-loops`: the rule mirrored into both schemas'
  artifact instructions and `openspec/config.yaml` — both now state the
  narrower scope.
