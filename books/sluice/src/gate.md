# The gate

A gate is what a branch requires of a candidate before the branch moves
to it. Every branch has one, and it is the branch's policy's (27). The policy
names the checks the gate requires, the signers it trusts and the
claims each may make, the systems each check must pass on, and how a
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
remote = "origin"
required = ["#check-fast"]
trust = ["sessions", "box", "forge"]   # no systems named: any one system

[branches.main]
remote = "origin"
required = ["#check-fast", "#integration", "cli:build"]
trust = ["box", "forge"]
confined = true
systems = ["linux-x64"]
batch = true

[branches.main.systems_for]
"cli:build" = ["linux-x64", "linux-arm64", "macos-arm64"]
```

`required` names the checks. `batch` tests the deepest candidate first
(14). `trust` names the signers whose runs count (28), and `confined`
admits only runs whose signer may claim confinement (29). `systems`
names where each required check must pass, and `systems_for` names it
for one check (86). The signers, the systems and the pools are tables of
their own in the same file (C.7).

## Keys

A key is the identity of one check over the inputs it reads. The same
check over different inputs is a different key, and the same inputs
anywhere give the same key. A check's result belongs to its key and
its system, not to a branch: a pass recorded under a key on a system
satisfies every branch whose gate trusts the signer that signed it and
requires that system (69). A pass a session proved on its own branch
serves the shared branch the moment the shared branch's candidate reads
the same inputs, if the shared branch trusts that session's signer.

A run record names the system its run executed on, so one check on two
systems is two results (85). A gate names, for each check it requires,
the systems a pass must come from, and a pass on one system never
stands for another. A check for which the gate names no system takes a
pass from any one system (86).

## Which checks a candidate runs

A candidate's verdict is the gate read over the checks the candidate
affects (15). The check seam answers which checks a candidate can
change the result of, given the branch's revision and the candidate
(36), and only those run. A required check whose key already holds a
pass from a signer the gate trusts is read from that pass and not run
again (15). A run on a pull request's head is such a pass when its
signer is trusted (113). When no verdict covers the branch's revision, the next candidate
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

A run that did not judge its check has no outcome (114). Its program
could not be started, or it exited with a code the policy's `not_run`
names, or the host failed the readiness the repository declares after
the run, for a check that did not pass. sluice names neither what a
repository's checks need nor what their exits mean; the policy's author
does. Such a run is recorded with why but never under its key, blames
no entry, and runs again. A candidate whose checks could not run in as
many runs in a row as the deployment states reads not passed, as a run
its time limit ended does (115).

## Flaky keys

A key holding both a pass and a fail from executors the gate trusts is
flaky. It reads as the branch's policy says, passed or not passed, and
never differently for two candidates of one branch (19). A bolt's
branch reads a flaky key as passed so that work keeps moving; the
shared branch reads it as not passed until a confined run settles it.

A fault nobody declared, such as a launch that stalled on the host,
still records a fail. The operator who finds the cause sets that run
aside, with the reason (116). Its record stays, and from then on no gate
reads it, so the key reads from its other runs. No session sets aside a
run: one that could set aside its own fails could land past any check.

## Signers and trust

An executor is what ran a check, with its identity and its host. It is
confined when two things hold. It ran in a place holding exactly the
candidate and what the repository declares, and nothing of any session
could reach that place. And nothing but the executor could have
written its records. It is open otherwise.

A gate trusts signers, not executors. A run counts for a gate only when
a signer the branch's policy names has signed its record, in a way
every host verifies from the records alone (78), and a run no signer
the gate trusts has signed never satisfies it, whatever its outcome
(28). The executor's kind, whether its run was confined, and its system
are claims in the signed record, and each counts only when the policy
lets that signer make it (79). A gate that trusts only confined runs is
satisfied by no run whose signer may not claim confinement (29). A run
is read as confined, or as held to a limit, only when its executor
enforced it (84) and its signer may claim it (79).

On one host, whose records are its own files, there is nothing to sign:
the runs that host's sluice starts count unsigned, as that host's (78).
A branch with no `remote` trusts those runs and nothing else, and a
branch with a `remote` and no `trust` trusts no signer, so its policy's
author names them (C.7).

A replay from the task runner's cache counts only when a signer the
gate trusts has signed a pass for the same key on the same system. The
cache supplies outputs and decides nothing (108).

sluice never runs a check of its own and never changes what a gate
requires (30). It reads the gate, runs what the gate names, records
what happened, and moves the branch or names the culprit.

## The verdict

A verdict is the gate's reading of a candidate: for each required
check, exactly one of passed, failed, missing or flaky. A verdict is
satisfied when every required check reads as passed on every system the
gate names for it. The landing names the verdict it landed on (23), so
what the branch moved on outlives the records.
