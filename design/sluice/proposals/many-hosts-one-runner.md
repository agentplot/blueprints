# Many hosts, one runner

Two things the statement left open have been answered by the operator
(2026-10-09): several hosts run agents that submit to the same line,
and the forge's CI is acceptable as the confined executor the shared
line requires. Some gating checks need services. A coordinator that
stalls a line while it is stopped is acceptable for now.

## Confined means isolated from every session

### The problem

The glossary calls an executor confined "when it could not read beyond
its declared inputs". Read literally that is a sandbox per check, which
sees an exact input set and nothing else. A check that needs a service
cannot run in one: what it needs is brought up in its place (31, 39),
and a per-check sandbox has no place for a service to live in. The
operator has said some gating checks need services, so the literal
reading leaves those checks with no executor a confined-only gate (29)
can trust.

What a confined gate is protecting against is a session: an agent's
shell that reads what it should not, or writes a result it did not
observe (38). The boundary that matters is between the executor and
every session, and between the executor's records and anything else
that could write them.

### The ruling

The glossary entry **executor** becomes:

> - **executor**: what ran a check, with its identity; **confined** when
>   it ran in a place holding exactly the candidate and what the
>   repository declares, which nothing of any session could reach, and
>   when nothing but it could have written its records; **open**
>   otherwise.

No clause changes. 28 and 29 read the same words with the new meaning.

## One line, several hosts

### The problem

Section 10 asks where entries live when several hosts submit to one
line, and who leases a chain. Landing stays safe with no coordination
at all: a move from an expected revision either succeeds or is refused
(45, 46). What breaks is everything else. A host that does not see
another's entries orders its own alone (6), cannot honour an after
naming the other's entry (7), and two hosts stepping one chain can each
name a culprit for one failure (17, 20).

### The rulings

> 57. Every entry of one line is ordered with every other entry of that
>     line, whichever host submitted it.

> 58. At most one stepper advances a line at any moment, whichever host
>     it runs on, and a stepper that has stopped advancing a line writes
>     nothing more for it.

> 59. A line whose stepper is stopped makes no progress and loses
>     nothing: every entry submitted meanwhile is held, and progress
>     resumes from the records as last written.

26 is amended in place:

> 26. Every state an entry is in, and every verdict read for it, is
>     readable by its session, its planner and the operator, from every
>     host that submits to its line, whether or not sluice is running.

The question in section 10 is replaced by: "When a stalled line is no
longer acceptable, how does advancing a line move from one host to
another, and what stops the old stepper writing after it has moved?"

## Part C

### C.1, a new place profile

| profile | materialize | release |
|---|---|---|
| **pushed candidate**: the candidate on a branch the forge's CI checks out | the candidate commit pushed to `sluice/cand/<line>/<entry>` on the forge | the branch deleted; the CI job that held it has ended |

### C.2, a new check profile

| profile | affected | run |
|---|---|---|
| **moon on the forge's CI**: a GitHub Actions workflow on the candidate branch | as the moon profile, on the stepper's host | the workflow brings up the declared services, runs moon on the affected checks, and uploads moon's run report and run records as the run's artifact; each outcome is read from the artifact, the executor is the workflow's identity, and only the workflow holds the remote cache's write credential |

### C.4, the pushed refs profile rewritten

| profile | read / form / commit / move |
|---|---|
| **pushed refs**: one coordinator host per line, several submitting hosts | `git fetch` then `git rev-parse` of the forge's line; forming and committing as local refs, on the coordinator; the landing a push with `--force-with-lease=<line>:<expected>` |

### C.5, a new driver profile

| profile | submit / withdraw / state / notify |
|---|---|
| **remote submit**: a host that is not the line's coordinator | the head pushed to `refs/sluice/<line>/submit/<id>` with the submission, taken in at the coordinator's next step; withdrawal the same with a withdrawal; state read from `refs/sluice/<line>/state/<entry>`, which the coordinator rewrites at every step; a waiting `wt submit` fetches it until the outcome |

### C.6, records

A sentence is added: on a line with several submitting hosts the records
live on the line's coordinator host, and the state refs are written from
them and never read back as truth.

### Givens

Added under the rest of the stack: "The shared line's confined executor
is the forge's CI, holding the remote cache's only write credential;
agent hosts read that cache and never write it."

## What it changes elsewhere

- S13. Two hosts submit to the shared line. Their entries are tested in
  one order, and the session on the host that is not the coordinator
  reads its entry's state and is told its outcome.
- S14. The coordinator is stopped while the other host submits. Nothing
  lands; the submission is held. Started again, the coordinator takes it
  in and continues without rerunning any check that already has a
  verdict.
- sluice needs an ADR on the handle the place and check profiles share,
  so a remote check can run in a remote place without either profile
  calling the other (core.2).
- moon archives only passes, so a failed run on the forge's CI leaves
  nothing in the cache; the run's artifact is how its record reaches the
  stepper before the verdict (16, core.7).
- If the line is protected on GitHub, the coordinator's push identity
  needs a bypass of the ruleset, and GitHub's own merge queue is off for
  that branch.
