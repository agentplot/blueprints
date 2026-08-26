# Disposition: `design/loop-programs.md` is not a writeback target

**Item:** #374 · writeback · intent/loop-granularity
**Session:** 2026-08-26-loop-programs-record-disposition
**Read at:** flywheel@`af07701b` (working tree) · blueprints@`d8cd100`

#374 asked for a chapter rewrite that has no chapter. The record it
names lives in the built repo, the book already states the destination
for every drift it lists, and the corpus rule forbids the edit the
title describes. What is left is construction, and it is carded.

---

## 1. The target

`design/loop-programs.md` is a decision draft in `agentplot/flywheel`,
header `Status: RELEASED to construction by the operator, 2026-08-13,
as bolt/loop-server`. It is not a book chapter and not a context-map
node. The writeback type's targets are chapters and the map; an item
whose target is neither is construction.

It is also not in this session's worktree. The blueprints repo holds
`books/flywheel/` and the change records; `design/` is the flywheel
repo's.

## 2. The corpus rule that decides it

`books/flywheel/CLAUDE.md`, "Sources":

> The machinery's implementation is the flywheel repo: `bin/` for the
> loop programs and server, `agents/` for session profiles, `tests/`
> for the verification stages, **`design/` for decision drafts not yet
> synthesized here**. When this book and the repo disagree, the book
> states the destination and the gap is the backlog — **do not
> "correct" the book to match the code.**

Two consequences, and they point the same way.

**A record's fate is synthesis, not maintenance.** `design/` holds
drafts *not yet* synthesized. `loop-programs.md` has been synthesized —
§3 shows which chapter carries which part. A record that has reached
the book has done its job; the book is the reference from then on
(`books/flywheel/src/design-loop.md`, "The objects": "Once a chapter
states the destination, the chapter is the reference").

**Rewriting it to today's code would produce a third artifact.** It
would no longer be the decision the operator released on 2026-08-13
(that is history, and git is not enough — the header states the release
as a fact about the file), and it would not be the destination either,
because the destination is the book. It would be a code summary with a
decision record's header, competing with both. The same instinct
applied one level up is the thing `CLAUDE.md` names and forbids.

## 3. Where each of #374's drifts already lives, correctly

Every drift the item lists is a **record-versus-code** gap, and for
every one of them the book already carries the destination. Verified
chapter by chapter at blueprints@`d8cd100`.

| #374 | the record's claim | the book | verdict |
|---|---|---|---|
| 1 — no "unit" | record never names the unit | `construction-loop.md` "Stages" (expansion: "the card becomes the unit, and one work item per task is filed beside it") and "Unit types" ("The type is a unit's choice… One bolt carries units of different types") | book states it; record is silent |
| 2 — guard list | `:144-145` lists scaffold-if-missing, flip-consume, handoff birth, compose | the book names **no** guard list — `design-loop.md` describes the cycle in behaviour. `grep -rni` over `src/` returns no `flip-consume`, no `ready-consume`, no `handoff`; `scaffold` appears only as the plain verb for a change directory's birth (`lifecycles.md:99,110`, `bolt-planning.md:114`, `schemas.md:43`, `sessions.md:53`), never as a guard name | nothing in the book to correct |
| 3 — four types | `:106-129` names four; plan mode is bolt-quick's alone | `construction-loop.md` "Unit types" table names **five**, `bolt-plan` among them, and "The construction path is part of the type — a type is a named loop configuration, and there is no mode beside it" | book already moved |
| 4 — merge serialization | `:88-89` "serialized per target branch" | `construction-loop.md`: "the merge gate serializes only their integration, one merge-back at a time" | book states it at the right level |
| 5 — review a stage | `:80-84` REVIEW between verify and merge | `construction-loop.md` has **Review** as a first-class stage, in the diagram and in prose, charged only when verify found something | book agrees with the record; the *code* is the one that differs, and that gap is the backlog |
| adj. — `flywheel approve` | absent from `bin/flywheel`'s verb set | `server-and-fleet.md` "The CLI" lists it | destination the code lacks — the planner's gap, **not** a book error |
| adj. — `compose_unit` | dead function, no caller | not in the book at all | pure code hygiene |

Retired vocabulary is a further check that the book is not lagging:
`books/flywheel/CLAUDE.md` retires "assertion", "handoff", "conductor",
"andon", and `grep -rni` over `src/` finds no design use of any of them.
The record still runs on "handoff birth".

**So: no chapter is stale and no map node moves.** This batch had no
writeback to do — not because it was blocked, but because the writing
was already done.

## 4. What is actually broken, verified at `af07701b`

Three things, all in `agentplot/flywheel`, none of them a chapter.

**4.1 Three guard lists, no two the same.** The record `:144-145`:

> query+guards (scaffold-if-missing, flip-consume, handoff birth,
> compose)

`bin/_flywheel_intent.py:3-7`, presenting itself as a quotation of that
passage — `design/loop-programs.md`, "The intent loop":

>     query+guards (flip-consume, ready-consume, compose) ->

`bin/flywheel-intent-loop:8-9`, a third list:

> query and guards (flip-consume, handoff birth, compose)

Only the module's is the live set. `run_guards`
(`_flywheel_intent.py:427-433`) calls `apply_flip_consume`,
`apply_ready_consume`, `apply_compose` — "All three, every cycle". And
`grep -c scaffold bin/_flywheel_intent.py` returns **0**: there is no
scaffold-if-missing guard, though `:148-153` of the record says there
is and calls it Guard 0.

The defect is not which list is right. It is that the module quotes a
record it does not follow, so a reader who trusts the quotation is
misled twice — about the record and about the code.

**4.2 `compose_unit` has no caller.** `_flywheel_intent.py:362`
defines it; `grep -rn compose_unit bin/ tests/` returns that line and
nothing else. It is the unit-flavoured sibling of `apply_compose`, and
it is exactly what a granularity rewrite would reach for first.

**4.3 The record has no supersession header.** Nothing on the file
says the book now carries it, so every reader — including the two
above — treats a 2026-08-13 draft as current.

## 5. What this session proposes

One unit on a new bolt, `the-loop-describes-itself` — successor in
name and in kind to `bolt/the-loop-obeys-itself` (#42, closed: every
item merged, the landing released). The other two open bolt milestones
hold no open item: `bolt/loop-channels` (#33) 4 closed / 0 open,
`bolt/types-rounds-and-destinations` (#37) 3 closed / 0 open. There is
no live bolt whose deliverable these serve, so the plan proposes a new
one. The card is `close/units/loop-programs-retired.md`.

The unit is **ruling-independent**, which is why it does not wait on
the granularity question the item's own body says to wait for. Retiring
a record is the same act whichever way granularity is ruled; correcting
a comment to the code's live behaviour is the same act; deleting a
function with no caller is the same act. The one thing that *would*
have needed the ruling — restating the loop's shape — is the thing this
session found there is no artifact to restate it in.

The tension worth stating on the row: the granularity ruling is still
open (#369, the Design Center report, is `state:ready` and unrun), and
it may touch `bin/_flywheel_intent.py`. Retiring the record now removes
the false premise the ruling would otherwise reason against; deferring
it costs only the wait. Approve, backlog, or drop is the operator's.

## 6. What this session did not do

It rewrote no chapter and moved no map node, because §3 found none to
move. It ran no round. It did not edit `design/loop-programs.md`: that
file is in the built repo, and the edit is construction the operator
approves.

The book gates the writeback skill names do not exist in this repo —
there is no `books/CLAUDE.md`, no `books/preview.py`, no
`books/check-mermaid.mjs`, and no `context-map/`. Nothing this session
wrote touches `books/`, so nothing needed them; it is reported as an
observation, not a finding.
