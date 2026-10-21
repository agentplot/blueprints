# Landing hold: entries that pass close together land in one move

Drafted clauses that let a branch's policy hold a candidate that passed
while a deeper candidate holding it is under test, for at most a time
the policy states. Entries submitted seconds apart then land in one
move of the branch. A
branch whose pushes start a deployment then starts one deployment for
them, not one per entry. Part A gains one clause, 117; 27 gains the
hold among what a gate states; Part C gains a key in C.7. The operator
ratified it on 2026-10-20: its clauses, key and scenarios are in
`../requirements.md`, which wins where they differ.

## What it answers

| question | answered by |
|---|---|
| how three entries submitted seconds apart reach the branch in one move | 117: the first to pass waits for the deeper candidate holding it |
| how long a passed candidate waits | 117, C.7: at most the policy's `hold`, counted from its verdict |
| what ends the wait early | 117: the deeper candidate's verdict, pass or fail |
| what a branch with no hold does | lands each passed candidate at once, as today |
| under deepest first, what is tested while a shallower candidate runs | 117: the deepest candidate, when the window has room |
| what each landed entry names | 23, unchanged: one commit per entry, each naming the verdict it landed on |

## The shape

```
 t=0      A submitted; candidate A starts (20 min of checks)
 t=10s    B, C submitted; A+B+C starts beside A        (117, 13)
 t=20m    A passes; A+B+C under test and holds A
          -> A held, at most `hold` from its verdict   (117)
 t=20m10s A+B+C passes
          -> one move: A, B, C land, three commits    (22, 23, 24)
```

Without a hold, A lands at 20m and B and C land in a second move.

## The problem

A branch moves once per landing (24), and a landing takes every
candidate at the front of its chain that has passed (22). Entries
submitted together land together. Entries submitted seconds apart do
not: the first one's checks start before the others arrive, it passes
first, and it lands alone. Each move of a shared branch that a forge
deploys from starts a deployment, so three bolts submitted ten seconds
apart start two or three deployments where one would do.

An operator works around it today by submitting every entry before the
first round runs. A planner landing bolts as each finishes cannot.

## What the statement already settles

A branch moves only to a candidate whose verdict is satisfied, in chain
order, never past an entry without a verdict (22). Nothing in 22 says a
passed candidate lands at once, so a round that leaves one waiting
breaks no clause. Entries landed together write one commit each, in
one move (23, 24). A candidate whose entries ahead land as tested keeps
its tree and verdict on the revision they land as (10), so holding A
changes no verdict behind it. The window bounds how many candidates of
a chain are tested at once (13), and the host's bound caps the checks
sluice starts (71).

## The ruling

> 117. A branch's policy may state a hold: how long a candidate that
>      passed may wait to land while a deeper candidate of its chain,
>      holding it, is under test. sluice lands a held candidate on the
>      first round after the deeper candidate's verdict, or after the
>      hold has run from the held candidate's own verdict, whichever is
>      first; it lands with the deeper candidate when that one passed,
>      and otherwise with the passed candidates ahead of the failure
>      (22). Under deepest first, a branch with a hold tests the deepest
>      candidate of its chain beside one already under test when the
>      window has room. A branch with no hold lands every passed
>      candidate at once.

117 bounds the wait from the held candidate's own verdict, so a stream
of submissions never keeps a passed entry off the branch longer than
the hold. The time the wait started is the verdict's, which the records
hold, so a round run by any process, after any stop, decides the same
(S10). A deeper candidate's failure ends the wait at once: the held
entry lands as it would have without the hold, and attribution goes on
as 17 and 18 say. The hold buys nothing when the window is one, since
no deeper candidate is under test beside the first; a window that a
failure has shrunk (13) holds nothing until it grows again.

Under deepest first, a branch with no hold starts no candidate while
one is under test. 117 lets a branch with a hold start the deepest
candidate beside a shallower one, because otherwise B and C wait
twenty minutes behind A and the hold has nothing to wait for. The
skipped candidates are still tested before a failure is attributed
(14).

27 gains the hold:

> 27. A branch's gate is its policy's: the checks it requires, the
>     signers it trusts and the claims each may make, the systems each
>     check must pass on, how a flaky key reads, whether every candidate
>     or the deepest first is tested, the window's bounds, how long a
>     passed candidate may wait for a deeper one (117), and how long a
>     candidate's checks may run. sluice gives no gate a meaning of its
>     own, and admits every submission a driver makes: whether work may
>     be submitted at all is decided before it reaches sluice.

## Part C, C.7

`[branches."<pattern>"]` gains `hold`, a duration, read from the
branch's current revision as every key of the gate is (56). Absent or
`"0s"`, no candidate is held.

```toml
[branches.main]
required = ["#check-fast", "#integration", "cli:build"]
batch = true
hold = "5m"
timeout = "45m"
```

A hold reads as how far apart entries may arrive and still land in one
move: with checks of twenty minutes, a five-minute hold lands together
every entry whose candidate started within five minutes of the first's.

## For the caller

A session waiting on its submission sees it passed and held, not
landed, until the hold ends; `sluice status` names the deeper candidate
it waits for and the time the hold runs out. The landing card a session
is sent (50) is sent when the entry lands, as today.

The caller who wants one deployment per batch sets `hold` on the branch
the forge deploys from and leaves it unset on bolt branches, whose
landings deploy nothing.

## Scenarios

- **S45.** `main` holds for five minutes and tests every candidate. A
  is submitted; ten seconds later B and C are. A passes at 20m while
  A+B+C is under test, and waits. A+B+C passes at 20m10s, and `main`
  moves once, writing three landing commits, A's naming its own
  verdict and B's and C's naming theirs.
- **S46.** As S45, but A+B+C fails at 20m10s and A+B passed. A and B
  land in one move on the next round; C is the culprit (17).
- **S47.** As S45, but A+B+C is still under test at 25m. A lands alone
  on the first round after 25m; B and C land when A+B+C passes.
- **S48.** `main` holds for five minutes and tests deepest first, with a
  window of three. A is under test when B and C are submitted. sluice
  starts A+B+C beside A. Both pass, and A, B and C land in one move.
- **S49.** sluice stops at 21m with A held and A+B+C under test, and
  starts again at 30m. The first round finds the hold run out and lands
  A alone, without running a check again (S10).

## What it changes elsewhere

- 27 as above.
- C.7: `hold` in `[branches."<pattern>"]`.
- The site: `hold` in the policy reference, and the GitHub guide's page
  on landing `main` naming it for a branch a forge deploys from.
- sluice: the round's landing decision reads the hold and the deeper
  candidate's state from the records; deepest first starts the deepest
  candidate beside a shallower one when the branch has a hold.
