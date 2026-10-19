# The core and its seams

sluice is a small core that knows git and reaches everything else
through seams. Each seam is a contract of Part B, and each is bound by
naming one profile of Part C; Parts A and B never change to admit a
profile (52). A team with worktrees, a task runner that declares its
inputs and a convention for naming branches has a whole queue, and binds
its own tools where they differ.

## The seams

**The place** (B.1) materializes a revision into a working copy holding
exactly that revision and the environment the repository declares, and
releases it with everything started in it ended (33, 34). Its one
profile is a detached git worktree with nothing run in it (C.1); a
container is the executor's, not a second checkout.

**The check** (B.2) answers which checks a candidate affects (36). It
runs them and reports each check's key, outcome, executor and whether
the outcome was observed or replayed (37, 38). It executes a command
within the limits a run is held to and reports what it enforced (83,
84). The profiles are moon and a script (C.2). moon runs only the tasks a
change affects and reads each task's hash as its key; a script is one
command with an exit code, and never a replay. The executor profiles
are open, sandbox, container and launched, the last a job on a pool
that signs its own run records.

**The branch** (B.4) reads a branch's current revision, forms a
candidate from a revision and a head or reports the conflict, commits a
landing, and moves the branch (42 to 45). A move names the revision the
branch is expected at; it is all or nothing, and two moves of one branch
from one expected revision never both succeed (46). The profiles are
local refs, one host's repository, and pushed refs, a branch on a
remote every host reaches (C.4).

**The driver** (B.5) is the front door. It submits a head, forecasts
the conflicts a head would meet, amends or withdraws an entry, reads an
entry's state, and delivers an outcome to its session (47 to 50). A
notification reaches the submitter at least once and names its entry
and outcome (51).

**The records** (B.7) read a branch's records with their version and
write them conditionally on it (61 to 63). The profiles are local files,
one host's, and remote refs, the peers' records on the shared remote
(C.6).

Policy is not a seam. It is a TOML file checked into the repository,
one table per pattern of branch names, read from the branch's current
revision (56) (C.7). The core reads the gate from it and binds nothing
to it.

## Branch protection

A session submits and does nothing more: it never merges and never
moves a branch, and an attempt to is refused and reported (1). Under
local refs, a `reference-transaction` hook refuses any update to a
branch the policy names that sluice did not make, and logs the attempt.
Under pushed refs, the forge's rule protects the branch and only
sluice's identity bypasses it, an identity no session on any host can
use (C.4). The hook calls the installed sluice, never one built from a
submission, so no submission changes the guard that judges it.

## Drivers

Whatever submits work and carries the outcome back is a driver, and a
driver decides nothing about the queue (C.5).

- **worktrunk**: `wt submit`, the executable `wt-submit` on the path,
  waits for the entry's outcome and reports it as its exit; `--no-wait`
  returns the entry at once; `--check` forecasts; on landing, worktrunk
  removes the session's place.
- **crew**: the unit's merge stage submits, a bolt is submitted from its
  own place by its conductor, and the conductor reads the entry's state
  as the stage.
- **flywheel**: a session's approved done exit is the submission, and
  the entry's state is evidence on the item.
- **remote submit**: a session on any host pushes its head to the
  remote, writes the entry to the branch's records there and wakes a
  peer or a pool. A waiting submit reads its entry's state until the
  outcome and runs no rounds, since its host holds no credential for
  the branch; its host stopping loses nothing (111).
- **pull request**, proposed: a forge's request to merge a head is the
  submission, and closing it withdraws. Its checks panel shows the
  entry's state. The landing is sluice's push of the branch, after which
  the forge marks the request merged. The forge's own merge button, merge
  queue and squash or rebase merges are not used on a branch sluice
  leads.

## Rounds

A round is one pass of sluice's work for one branch: read the queue,
start runs where there is room, read finished runs, blame a failure,
land what passed, write the records, exit. Nothing is held between
rounds outside the records, and no two rounds act on one branch at once
(58). `sluice step <branch>` runs one round and exits, for a tool with
a loop of its own; `sluice run` runs rounds for every branch with a
queue until stopped. Both do the same work.

sluice starts no service, binds no port and starts no daemon (31). On
one machine a waiting `wt submit` runs the rounds itself while it waits,
under the branch's lock, checking each round whether its own entry is
decided. Any number of waiting sessions do this at once, and the lock
lets one round run at a time. A round is sluice's code whichever
process runs it: the queue, the runs and the gate decide what it lands,
never who called it.

On many hosts, sluice runs as peers (C.8). A branch whose policy names
a `remote` lives on the shared remote, and when the policy names
signers its records do too (C.6, C.7). A `sluice run` the operator
starts on each standing executor's host runs rounds and takes runs, and
a pool's job may run a round when woken. A waiting submit on a
session's host only reads its entry's state: once written, a submission
reaches its outcome with no host of its submitter running (111). Only an identity no session can use holds the branch's
credential: the standing executors' `sluice` user and the pool's jobs.
A deployment with no instance able to advance the branch accepts
submissions, holds them, and lands nothing until one starts (59).
