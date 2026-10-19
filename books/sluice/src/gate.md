# The gate

A gate is what a branch requires of a candidate before the branch moves
to it. Every branch has one, and it is the branch's policy's (27). The policy
names the checks the gate requires, the executors it trusts and how a
flaky key reads. It says whether every candidate or the deepest first
is tested, bounds the window, and sets how long a candidate's checks
may run. sluice gives no
gate a meaning of its own and admits every submission a driver makes;
whether work may be submitted at all is decided before it reaches
sluice (27).

## Where the gate is read from

A branch's gate is read from the branch's current revision, never from
a candidate or a place (56). A submission that changes the policy is
judged by the policy it would replace, so no submission loosens the
gate that judges it.

The policy is a TOML file checked into the repository, one table per
pattern of branch names (C.7). A shared branch and a bolt's branch
carry different tables because they land different things. A bolt's
branch lands units many times a day and wants a fast gate. The shared
branch lands whole bolts and demands more.

```toml
[branches."bolt/*"]
required = ["#check-fast"]

[branches.main]
required = ["#check-fast", "#check-tools", "#check-e2e"]
batch = true
trust = ["confined"]
systems = ["aarch64-darwin", "x86_64-linux"]
```

`required` names the checks. `batch` tests the deepest candidate first
(14). `trust` names whose runs count (28). `systems` names where each
required check must pass (86).

## Keys

A key is the identity of one check over the inputs it reads. The same
check over different inputs is a different key, and the same inputs
anywhere give the same key. A check's result belongs to its key, not to
a branch: a pass recorded under a key satisfies every branch whose gate
trusts the executor that recorded it (69). A pass a session proved on
its own branch serves the shared branch the moment the shared branch's
candidate reads the same inputs, if the shared branch trusts that
executor.

The system a run executes on is part of its key, so one check on two
systems is two keys (85). A gate names, for each check it requires, the
systems a pass must come from, and a pass on one system never stands
for another (86). The system dimension is proposed in
`design/sluice/proposals/many-hosts-3.md` and awaits the operator's
ruling; until then a gate names the system of the instance advancing
the branch.

## Which checks a candidate runs

A candidate's verdict is the gate read over the checks the candidate
affects (15). The check seam answers which checks a candidate can
change the result of, given the branch's revision and the candidate
(36), and only those run. A required check whose key already holds a
pass from a trusted executor is read from that pass and not run again
(15). When no verdict covers the branch's revision, the next candidate
affects every check the gate requires (70).

A check's cost never changes how it gates: every check the gate
requires has a verdict before the branch moves, and none is deferred
past a landing (55).

## What is recorded

Every check run on a candidate is recorded with its key, its outcome,
its executor and what the executor enforced, before the verdict is read
(16, 84). A fail is recorded exactly as a pass. A result a tool answered
from an earlier run is a replay, not a run, and is never recorded as one
(16); a replay says it is a replay (38). An outcome is what the executor
observed, never inferred (38).

## Flaky keys

A key holding both a pass and a fail from executors the gate trusts is
flaky. It reads as the branch's policy says, passed or not passed, and
never differently for two candidates of one branch (19). A bolt's
branch reads a flaky key as passed so that work keeps moving; the
shared branch reads it as not passed until a confined run settles it.

## Executors and trust

An executor is what ran a check, with its identity and its host. It is
confined when two things hold. It ran in a place holding exactly the
candidate and what the repository declares, and nothing of any session
could reach that place. And nothing but the executor could have
written its records. It is open otherwise.

A result from an executor the gate does not trust never satisfies that
gate, whatever its outcome (28). No open run satisfies a gate that
trusts only confined executors (29). A run is read as confined,
or as held to a limit, only when its executor enforced it (84).

A branch that names no `trust` accepts every run sluice starts, open,
sandboxed or in a container, and no replay from a cache. A run sluice
starts is in a place sluice made from the candidate, so its result is
the candidate's. A cache's replay may hold whatever any shell ran, so
it stays out until the author lists `cache`.

sluice never runs a check of its own and never changes what a gate
requires (30). It reads the gate, runs what the gate names, records
what happened, and moves the branch or names the culprit.

## The verdict

A verdict is the gate's reading of a candidate: for each required
check, exactly one of passed, failed, missing or flaky. A verdict is
satisfied when every required check reads as passed on every system the
gate names for it. The landing names the verdict it landed on (23), so
what the branch moved on outlives the records.
