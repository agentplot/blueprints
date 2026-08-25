# Session: 2026-08-25 — how the loop programs are actually built today

**Type:** research · **Item:** #368 · **Milestone:** intent/loop-granularity

Charged to lay out the loop programs against the code rather than the
design, so the granularity question — is the loop's unit of drive the
milestone or the unit? — is ruled on evidence.

## What is here

- `finding.md` — the answer, with file-and-line evidence for every claim.
  §1 where granularity is decided · §2 what the bolt loop does per unit
  today · §3 what a per-unit process would own or share · §4 where
  `design/loop-programs.md` and the code disagree · §5 what the change
  would cost as concrete edits · §7 discoveries queued as items.

## The answer, short

Granularity lives in two tuples — `_flywheel_inbox.server_inbox`'s
`jobs.setdefault((milestone, kind), …)` and `_flywheel_server.plan`'s
`(job.milestone, job.kind)` — and widening them is genuinely small.
**But the serialization the operator wants gone is not there.** The bolt
loop already carves a bolt into per-unit, per-change batches with their
own branches, worktrees, pane names, types and repos, and then drives
them one at a time in `BoltLoop.cycle`'s `for batch, binding in
resolved:` (`_flywheel_bolt_loop.py:3199`). The intent loop, in the same
repo, already launches every batch before waiting on any
(`_flywheel_intent.py:951-962`). Applying that shape to `cycle` buys the
parallelism at one edit and keeps the four things that are provably
bolt-wide — the bolt branch and its single unlocked worktree, the merge
into it, the charter, and the landing — where they belong.

The per-unit instinct is right about one thing a `for`-loop rewrite does
not fix: unit-level host routing (finding §3.8, queued as an item).

## What this session did not do

It answered #368 only. It ran no round, proposed no construction, and
built nothing — the reading needed nothing built. Item #369 (the Design
Center report) reads this and is the operator's next surface.
