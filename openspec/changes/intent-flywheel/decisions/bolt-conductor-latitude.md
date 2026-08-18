# Decision: review is a judgement, ADRs land on the construction side, and a bolt conductor may edit directly

Four of the retro's items are one subject — what a bolt conductor decides
for itself rather than being told.

## Decision

**Review is a judgement, not a rule.** The landed one-round bound is
prescriptive in the wrong direction, so it is replaced by the criterion: a
conductor **may** add a review task where a plausible-but-wrong success
claim would be expensive and no mechanical check would catch it. It **need
not** for small edits to text files, and it **may** run more than one round
where the risk warrants. Reviews may span proposals rather than being one
per row. When re-reviews start bouncing on defects the fixes introduced,
that is the signal to stop reading and build. A declared review that is not
run is recorded as not run.

**An ADR is written by the bolt conductor, on the construction side, and
an intent's Handoff task is what asks for it.** The bolt conductor writes
it directly into the built repo's log4brains layout, with no tracked
proposal — a case of the direct-edit latitude below rather than an
exception to it. What it does not do is notice unprompted: the trigger and
the sources ride the Handoff task line
(`decisions/adr-is-a-handoff.md`). Retiring the ADR task type removed an
intent-side artifact, not the intent's ability to name what it wants.

**Named direct edits, without a nested worktree and without a tracked
proposal:** `CLAUDE.md`, ADRs, and the loop's own machinery where the
change is small and self-evident. Everything else stays inside the tracked
path.

**Conductors on main work in worktrees, and so does every agent they
dispatch.** An intent or bolt conductor editing on blueprints main shares
one index with every sibling. Each cuts its own worktree for its edits and
merges back when it dispatches a session. This has to be cheap: no test
run, no server, no acceptance suite.

**Spec agents get a worktree each, and stop sharing the bolt's.** The
earlier rule — spec agents do not commit, and the conductor lands each
spec by pathspec once that agent is idle — worked around a shared index
instead of removing it, and it made "finished" a property a conductor had
to observe before every commit. A worktree per spec agent removes the
cause: each agent commits its own work, and the conductor merges the
branch back, which is where merge-backs belong anyway
(`decisions/dynamic-workflows-drive-the-loop.md`). Pathspec discipline
survives as a standing rule wherever a tree is genuinely shared.

**Both skills tell agents to catch up on their base branch** rather than
drifting from it. `wt step rebase` is the primitive, and it is what
`wt merge` runs anyway.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/spec-driven-construction.md`
- Produced by: the operator's annotations on
  `sessions/2026-08-06-flywheel-retro/findings.md`

## Why these are one decision
Each is the same correction: the loop told a conductor what to do where it
should have told it what to weigh. The review bound, the missing ADR route,
the requirement that every edit be tracked, and conductors sharing main's
index all cost the same way — a conductor doing ceremony instead of
judging, or blocked from an edit it was best placed to make.

The shared index is not theoretical here. It is the collision this loop hit
repeatedly, most visibly when one session's chapter deletions landed in
another's commit.

## Consequences
- `flywheel-construction` carries the review criterion in place of the
  bound, the ADR route, and the direct-edit list.
- `flywheel-inception` carries the worktree rule and the rebase primitive.
- `flywheel-bolt`'s instructions stop implying a required review type.
- The intent's `tasks.md` no longer routes ADRs anywhere — they are the
  bolt conductor's, written where the material is.
