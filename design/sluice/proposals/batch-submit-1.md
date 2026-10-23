# Batch submit: several heads submitted as one act

Drafted clause letting a submitter hand sluice several heads in one
act, in an order, so that the first round after it forms one candidate
over all of them. Part A gains clause 125 and a scenario, S59; Part C
gains the form the driver takes it in. Nothing here edits
`../requirements.md`; the operator rules on it.

## What it answers

crew's main-level ops lands a kit's approved bolts by one submit per
bolt, each named after the one before (crew `plan.16`). Between two of
those submits a round may fire, and the chain then holds one entry: the
round forms `main + b1`, tests it, and may land it before `b2` and `b3`
are in. The operator's question (2026-10-23, in swancloud's operator's
pane): "Theoretically a test is going to kick off on the first branch
before the next two are added. I'm wondering if the entire batch could
be submitted atomically", and: "it probably makes sense to submit as a
batch but I don't know what the ramifications are".

## What the statement already gives

- Order: an entry never lands before an entry it names as after (6);
  crew's `--after` chain holds whatever the rounds do.
- One candidate for the set: under deepest first (S9) and `batch = true`
  (C.7), a branch tests the longest combination, one run at a time.
- One landing for the set: a `hold` (117) keeps a passed candidate
  waiting for a deeper one, so entries that arrive within the hold land
  in one move.

What none of them gives: a guarantee that no round forms a candidate on
`b1` alone before `b2` and `b3` are queued. The window is the seconds
between crew's submits, but a round, a waiting `sluice wait` or an
intake pass can fall in it. The cost when it does is one run of
`main + b1` that the set did not need, and, on a branch with no hold,
a landing of `b1` alone.

## The alternatives, and what each costs

| alternative | what the operator sees | cost |
|---|---|---|
| **A. Nothing new.** crew keeps one submit per bolt; main's policy sets `batch = true` and a `hold` of a minute or two | the bolts land in one move whenever the set arrives within the hold; now and then one extra run of the first bolt alone | a run the set did not need, a few times a week; no change to sluice |
| **B. A group submit (125).** One act hands sluice several heads in an order; sluice takes all or none, each its own entry after the one before, and forms no candidate on any of them until all are taken | one run over the set under `batch = true`, one landing; a failure still names one bolt and the rest land | a form of `submit` taking several worktrees; the pull-request driver opening the requests in one act and intake taking them in one pass; crew's landing becomes one call |
| **C. An atomic landing.** The set lands whole or not at all | a failing bolt holds the others back | against 17 and 18 (one culprit, the rest land) and 22; and the operator approved each bolt on its own card, not the set |

B is recommended, with A's `hold` kept for stragglers: a bolt approved a
minute after the set still lands with it. C is declined.

## The clause

> 125. Several heads may be submitted as one act, in an order the
>      submitter gives. sluice takes all of them or none, each as its
>      own entry after the one before (6), and forms no candidate on
>      any of them until every one is taken. Each is thereafter its own
>      entry: blamed alone (17, 18), withdrawn alone (5), told its own
>      outcome (50).

## Part C

**C.5 the driver**, the worktrunk and pull request rows gain: `sluice
submit <branch> --worktree <a> --worktree <b> …` submits the worktrees'
heads as one act in that order; under pull requests the driver pushes
each branch and opens or updates each request in one act, and intake
takes them in one pass. The answer names every entry, or every request
with what it waits for.

## Scenario

- **S59.** Ops submits three approved bolts as one act. The next round
  forms one candidate of all three and tests it once; it passes, and the
  three land in one move, in the order given. On another day the middle
  one fails: it alone is blamed, and the other two land.
