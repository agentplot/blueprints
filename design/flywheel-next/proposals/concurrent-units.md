# Concurrent units

A bolt should build as many of its units at once as it has room for,
with the risk of conflict kept low and a conflict easy to settle when
one comes. Today it builds fewer than it could. A unit waits for every
unit it depends on to merge before it starts (31); merges are only
serialized, each item judged alone against a line others are about to
move (38); and nothing forecasts a conflict before the merge that meets
it. The operator, meanwhile, is either a gate on every unit or reads
nothing after the proposal: nine changes in ten are right as written,
and the tenth is found late.

This proposal moves dependency from starting to merging, gates every
merge on the combination it lands in, forecasts conflicts while they are
small, replaces review gates with review in batches that amend work in
flight, and gives every unit type a contract so a type cannot undo any
of it. sluice (`design/sluice/requirements.md`) is the queue that does
the merging; its ADR 0002 names 31, 38 and 39 for rewrite, and 179
joins them because sluice lands a merge commit. crew carries the same
rulings in its change `concurrent-units`.

## Dependency is on plans, not merges

### The problem

31 starts a unit only when its dependencies are merged. A dependent
needs the contract it builds on, which exists as soon as the
dependency's change is written; it does not need the dependency merged.
Holding it back costs the whole of the dependency's build.

### The rulings

> 31. Within a bolt a unit may depend on other units of the same bolt.
>     A unit's change is written as soon as the unit is approved,
>     whatever it depends on. A unit builds once every unit it depends
>     on has its change written, from their work as it stands, and never
>     merges before any of them. Units build side by side up to the
>     bound of 32 and no other. The proposal states the dependencies and
>     the operator's response may change them.

## A merge is tested in the combination it lands in

> 38. Several work items may be in flight at once. A finished item is
>     offered to its bolt's line and merges only after the line,
>     extended by every item offered ahead of it and by it, passes the
>     line's gate. A failure of that combination is told to the one item
>     at fault and to no other, and the items behind it are judged again
>     without it. Overlap between what items touch orders their merging
>     and never their building.

## Conflicts forecast while small, settled with both intents

### The problem

Two items that touch the same content find out at merging, after both
are built, and the session that settles it sees only its own change.
"Keep both intents" is asked of a session that has read one.

### The rulings

> 330. Before an item merges, its work is formed against its line and
>      against the work of every item ahead of it, as it stands, and a
>      conflict so found is told to the item's session when it is idle
>      (I5), with the content contested and the other item's change. A
>      forecast changes no order and merges nothing.

> 331. A conflict, forecast or met at merging, is settled by the session
>      of the item behind, which is handed the other item's change and
>      the content contested; never by the item ahead.

## Review in batches, amending work in flight

### The problem

Approving a proposal (36) is the operator's one review today, and a
unit's change is never read after it is written (13). A gate on every
change instead would make the operator the bound on concurrency. What is
wanted is to read the changes in batches, summarized, with nothing
waiting on the reading, and to amend what is still in flight when a
change is wrong.

### The rulings

> 332. Nothing waits on the operator between a unit's change being
>      written and its building, except where the unit's type declares a
>      review gate there (335).

> 333. The operator reviews written changes in batches. A batch is
>      offered when a number of changes have been written or amended
>      since the last batch, or a time has passed with at least one,
>      whichever comes first, both set per instance. It is one decision
>      on the rail that summarizes each change, what it does, the choices
>      it made, its risks and what it touches, and is answered per unit,
>      as fine or with notes; each whole change is reachable from it.
>      Nothing waits on the answer.

> 334. Notes on a unit that has not merged amend it in flight: its
>      change is revised with the notes, its work continues from the
>      revision, and no second approval is asked. A merged unit is never
>      amended; notes on it become a fix or a new unit.

## The close is the word; the landing follows on green

> 39. A bolt is offered to the shared line once, when the operator
>     closes it, and only if every unit is finished and every unit's
>     change, as last amended, has been in a batch (333); the close is
>     proposed on the rail when that holds, and names any change not yet
>     in one. The bolt lands when the shared line, extended by it and by
>     everything offered ahead of it, passes the shared line's gate, with
>     no second word, and a fix after a failed landing is offered again
>     with no new word.

## An item's merge keeps its commits

> 179. The history of an open line is never rewritten. Every take is a
>      merge (50), and an item's merge into its bolt line is one commit
>      that names the item and the verdict it merged on and keeps the
>      item's commits. A place is rebased onto its line only while no
>      session is working in it (51, 52). The landing's shape is the
>      repository's: a merge commit when direct, the repository's merge
>      setting when pull-request.

## Every unit type keeps a contract

### The problem

A unit type is data, an extensible machine an instance writes (37, 57,
223). Nothing stops a type from building before its change is written,
from waiting on the operator wherever it likes, or from having no stage
an amendment can re-enter. Every ruling above can be undone by a type.

### The ruling

> 335. Every unit type keeps a contract, and the registry refuses a type
>      that breaks it (224): a stage that writes the unit's change comes
>      before any stage that builds; that stage states what the unit
>      touches, in a form the machinery reads; no stage merges, lands or orders merging (38, 43); the
>      type names the stage an amendment re-enters (334); and a stage
>      that waits on the operator is declared as a review gate (332),
>      never implied by a stage's instruction.

An invariant joins section 7:

> - I17. No unit's building waits on another unit's merging.

## What a unit touches is read, and checked

### The problem

What a unit touches is written today as prose at the end of its change,
for an agent to compare by eye; nothing reads it and nothing checks it
against what the unit then edits. A forecast from the work itself (330)
finds a real collision, but only once both units have written code;
what the change says it will touch is the only warning before then.

### The ruling

> 336. What a unit's change says it touches is read by the machinery
>      before the unit builds, and a unit whose stated touches overlap
>      an item in flight is told of it then (330). At verifying, what
>      the unit's work actually changed is compared with what it said;
>      content changed and not stated is a finding on the unit, and the
>      stated touches are corrected to match.

## Givens

Added under the rest of the stack:

> - Merges into a bolt's line and landings onto the shared line go
>   through sluice: the machinery's merge effect is a submission to it,
>   and the verdicts it reads are evidence on the item or the bolt.
> - A review batch is a Pending You card: one summary per change and
>   each change attached, so the operator drills in and answers there.

## What it changes elsewhere

- 13 stands: one response is enough, and a batch asks for none.
- 36 stands: approving a proposal remains the review before work.
- 317's batch of unclaimed landed units can ride in the same batch.
- 40 stands: a failed landing leaves the bolt open.
- 52's retry bound stays the machinery's; sluice bounds no
  resubmission (sluice 54).
- 175's pull-request policy is untouched; a repository whose landing is
  a pull request lands through its own gates.
- The shipped types (`default`, `fast`, `chore`, `persona-test`) are
  checked against 335. A chore has no change to write (60) and is
  exempt from the first two terms.
- Scenarios: a dependent builds while its dependency builds, finishes
  first and merges after it; two items that touch the same file build
  at once, the forecast tells the later one while it is small, and both
  merge; a batch of five changes is answered with notes on one, which
  is amended in flight without a second approval; a close is proposed
  naming one change not yet in a batch, and the batch follows.
