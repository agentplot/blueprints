# sluice

sluice admits finished work onto a branch only after the branch, extended by
that work and by everything ahead of it, has passed the branch's gate (22).
A session builds in its place and submits its head; it never merges and
never moves a branch (1). sluice orders what was submitted, forms each
candidate exactly as it would land, and tests candidates ahead of need.
When a candidate fails it names the one submission at fault, and it
moves the branch only to a revision that passed.

![sluice in one loop: agents submit and never merge; each candidate is tested as it would land; a failure names one culprit and tells only its agent; the branch moves only to what passed](images/sluice.svg)

## Why it exists

A merge queue enforces the rule that a repository's branch always passes
its tests, by testing the integration revision rather than the change
in isolation, and advancing the branch only when that revision passes.
Every queue that exists orders pull requests on a forge and waits for a
hosted service to report a status. An agent fleet does not work that
way. A hundred sessions build in a hundred worktrees on a few hosts,
their units merge into a bolt's branch, and bolts land on the shared
branch. The proof of a check lives in a cache keyed by what the check
read.
Today each session merges for itself: it tests its change against the
branch it sees, fast-forwards if nobody moved the branch first, and loses
the race otherwise. What lands is verified afterwards, and a red branch is
fixed forward.

sluice puts the queue where the work is. A session submits (1), the
queue tests the combination that will land (10, 11), and the branch moves
only to what passed (22). Because the cache already holds every pass a
session proved, testing a candidate reruns only what the combination
changed (15).

## What it promises

A candidate is the branch plus every entry ahead of it, in order, and
nothing else (10). A conflict is found when the candidate is formed,
before any check runs (12). Every run is recorded, a fail as faithfully
as a pass (16). A failure has exactly one culprit, the newest entry of
the first failed candidate, named only once everything ahead of it is
known (17, 18), and only that entry's session hears of it (20). A branch
moves only in order, only to what passed, and only from the revision
the candidate was formed on (22, 24). Every entry of a branch is in its one chain, tested with the
entries ahead of it and landed in chain order (8).

Trust is the branch's. A bolt's branch may count a session's own open
run, and the shared branch may require a confined one. On many hosts
the policy names the signers whose runs count and the claims each may
make, and sluice gives no gate a meaning of its own (27, 28, 29, 78).

## Why it is open source

A queue for agents in worktrees is a thing every team running a fleet
against a trunk needs, and none of the queues that exist is shaped for
it. The core knows git and five seams (Part B): a place, a check, a
branch, a driver and the records. Each is bound by a profile
(Part C). A team with worktrees, a task runner that declares inputs,
and a convention for naming branches has a whole queue, and binds its
own tools where ours differ.

## Where it stops

sluice orders, tests, attributes and lands, and stops there. It runs no
check of its own, starts no service and chooses no port (30, 31). It
describes no repository and decides no policy (section 8). A verdict is
evidence for a person or a platform, never an approval.

What is built above it reaches it through the driver seam like any
other (B.5). That includes a planner that supplies what an entry lands
after, an operator's word that admits a submission, and a platform that
holds the confined executor.

## How to read this book

The chapters are the design: the queue, the gate, places and runs, the
records, the core and its seams, and many hosts, with a glossary and
the open questions. The appendix is the statement of invariants,
included from `design/sluice/requirements.md`: Part A is what must
hold of sluice, Part B its contracts, and Part C the profiles that
bind them. A number in parentheses points into it.
