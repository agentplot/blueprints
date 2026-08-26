# Session: 2026-08-26 — the loop-programs record's disposition

**Type:** writeback · **Item:** #374 · **Milestone:** intent/loop-granularity

Charged to write `design/loop-programs.md` back to what the loops
actually are, after the research on #368 found five places it disagrees
with the code.

## What is here

- `disposition.md` — why the batch moved no chapter, with the drift
  table checked against the book chapter by chapter. §1 the target ·
  §2 the corpus rule that decides it · §3 where each drift already
  lives · §4 what is actually broken, verified at `af07701b` · §5 what
  is proposed · §6 what was not done.
- `close/` — the dispatch-plan payload: one bolt container, one unit.

## The outcome, short

**No chapter is stale and no map node moves.** `design/loop-programs.md`
is a decision draft in the built repo, not a chapter and not the map —
and the book already states the destination for all five drifts plus
both adjacent ones. `construction-loop.md` names five unit types, makes
the type a unit's choice, has Review as a first-class stage, and puts
the serialization at the merge gate. The one book/code gap the item
lists — `flywheel approve` in `server-and-fleet.md` and not in
`bin/flywheel` — is the planner's backlog by construction, not a book
error: `books/flywheel/CLAUDE.md` says in as many words *do not
"correct" the book to match the code*.

Rewriting the record would produce a third artifact — no longer the
decision the operator released on 2026-08-13, and not the destination
either, since the destination is the book. What the record needs is
retirement, and that edit is in the flywheel repo: construction.

## What this session proposes

One unit, `loop-programs-retired`, on a proposed new bolt
`the-loop-describes-itself` — successor to `bolt/the-loop-obeys-itself`
(#42, closed). Three changes: a supersession header on the record
pointing at the chapters that carry it; the intent loop's two stale
self-quotes (`_flywheel_intent.py:3-7`, `bin/flywheel-intent-loop:8-9`)
rewritten to the live guard set in the code's own voice; the uncalled
`compose_unit` removed.

All three are ruling-independent, which is why the unit does not wait
on the granularity question #374's body says to sequence after — the
one part that *would* have needed the ruling is the part §3 found has
no artifact to land in.

## What this session did not do

It edited no chapter, no map node, and no file in the flywheel repo. It
ran no round. The granularity ruling remains the operator's, and #369 —
the Design Center report — is still their next surface on this intent.
