# One chain per branch

Drafted changes that remove lanes: every entry of a branch is in one
chain and is tested on top of every entry ahead of it. Clauses 8 and 10
and scenario S6 are rewritten, clause 9 is removed, and 6, 7, 13 and 36
and the glossary's lane, candidate, chain and window entries change to
match. Nothing here edits `../requirements.md`; the operator rules on
it.

## Why

A lane lets an entry be tested apart from entries whose affected parts
it does not overlap, so it never waits for them and is never tested
again because of them (8). Building it showed that buys little and costs
much.

- **It saves less than it seems.** A branch has one revision. When an
  entry of one lane lands, every candidate of every other lane was
  formed on a revision the branch has left, and is formed and tested
  again (10, 24). In one chain, the candidate behind a landed entry
  already held it, and its verdict stands.
- **Unknown parts join everything.** An entry whose parts are unknown is
  in every lane (9), so one such entry fuses the branch's lanes into one
  chain while it is there. Every candidate under test in the fused
  lanes is formed again, and what to do with checks already running in
  them is a question the statement does not answer.
- **Lanes change while candidates are under test.** An entry's affected
  parts are taken against the branch's revision, so they change every
  time the branch moves, and two lanes can merge or divide mid-test for
  reasons no submission made.
- **It is the hardest part of the model to get right.** Lanes need each
  entry's parts from the check seam (36) before any candidate exists,
  a per-entry query repeated on every move of the branch, and an order
  across lanes that 6 and 7 must still hold within each.

With one chain, a candidate is the branch's revision extended by the
entries ahead of it and itself, and nothing else: the order the
walkthrough already shows, `+A`, `+A+B`, `+A+B+C`.

What is given up: an entry behind a slow or failing entry waits for its
verdict even when their work never touches. The window (13) and deepest
first (14) are the answer to a slow queue, as they already are within a
lane.

## The changes

### Vocabulary

**lane** is removed. **affected parts** is removed: nothing else uses
it, and what a candidate affects is defined by 36. The others read:

- **candidate**: a revision equal to the branch's current revision
  extended, in order, by an entry and every entry ahead of it: the
  revision that entry would land as.
- **chain**: the candidates of one branch, each extending the one
  before.
- **window**: how many candidates of a branch's chain are under test at
  once.

### A.2 Order

> 6. Entries of one branch are ordered by priority, then by the order of
>    submission. Priority orders only entries in no candidate under
>    test: an entry under test is never displaced by one submitted after
>    it. An entry never lands before an entry it names as after.
>
> 7. An entry whose after-entries are neither landed nor ahead of it in
>    its branch's chain waits, and its waiting holds no other entry.
>
> 8. Every entry of a branch is in its one chain. No entry is tested
>    apart from the entries ahead of it, and entries land in chain
>    order.

9 is removed.

### A.3 Candidates and chains

> 10. Every candidate equals the branch's current revision extended, in
>     order, by exactly the entries ahead of it and itself. A candidate
>     never contains an entry behind it or an entry removed from the
>     chain.
>
> 13. A branch is tested up to its window. The window never falls below
>     one, grows while candidates pass and shrinks when one fails,
>     within bounds the branch's policy states.

### B.2 The check

> 36. **affected**: given the branch's revision and a candidate, the
>     checks the candidate can change the result of (15, 70).

### Scenarios

> - **S6.** Two bolts whose work touches unrelated parts are submitted
>   to the shared branch. The second is tested on top of the first and
>   lands after it, and is not tested again when the first lands.

## What stands

17, 18, 21 and 22 already speak of "its chain"; with one chain per
branch they read as written. 71 bounds a host across branches and is
untouched.
