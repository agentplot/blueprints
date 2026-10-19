# Many hosts

sluice on many hosts is in the statement, as 72 to 82, 85 to 88, 107
to 113 and Part C, and is not yet built in sluice.

A deployment is one machine or many peers, with no central server
(C.8). On one machine the records are the host's own files, a waiting
submit runs the rounds itself, and the runs that host's sluice starts
count unsigned, as that host's (78). On many hosts every host runs the
same sluice: the records live on the shared remote, and any instance
with room advances a branch or takes a run. What follows says which
instance advances a branch, which executor runs a candidate's checks,
and how a result proves who made it.

## What every deployment shares

Entries of one branch are ordered with each other whichever host
submitted them (57). At most one instance advances a branch at any
moment, and one that has stopped writes nothing more for it (58). An
instance that stops loses nothing: entries submitted meanwhile are held,
and whatever next advances the branch resumes from the records (59). A
candidate's checks may run on any host, and a run whose executor
stopped before reporting has no outcome and is run again (60).

## The lead

An instance keeps a branch only by writing its records. Once the
deployment's lease has passed with no write of that instance, any
instance may take the branch. Taking it is a write, after which the
former lead writes nothing more for the branch (72). The former lead's
next write is refused because the version moved under it (62), and a
landing is itself a move from an expected revision (46), so two leads
never both land.

Taking a branch needs no knowledge of the former lead. One that stopped
and one that was quiet for a lease are treated alike, and the lease is
measured by the taker's own observation of the records, never by the
hosts' clocks agreeing (73). A lead that is alive and makes no progress
is taken over, which is the behaviour wanted.

The lease on a branch and the bound on an executor's sign of life are
the deployment's settings, one value each for every branch it serves,
never a branch's policy's. A branch's policy bounds only how long a
candidate's checks may run, and a claim never lapses for the length of
its run alone (74).

## Claims

A run is taken only by a claim written to the branch's records, by an
instance with room under its own bound (71), or by a pool's job whose
start is its claim (75). The lead opens candidates within the window
and assigns them to no one. An instance claims the earliest open run
first. It never claims a later open candidate of a chain while an
earlier open candidate of that chain is unclaimed (76), since the front
of the chain is what blocks landing (22).

A claim lapses when its holder has shown no sign of life for the
deployment's bound. A lapsed claim's run has no outcome, and a report
under a claim its reporter no longer holds is never written (77). An
instance takes no claim while a place it made on its host belongs to a
candidate that has a verdict, is obsolete, or is under a claim it no
longer holds (81). A place on a host that never returns is the
operator's to remove, and no verdict is ever read from it.

From the moment an entry is written until it leaves sluice, its head is
fetchable by every host that may run its checks or advance its branch.
A candidate is open to claims only while its revision is fetchable by
every host that may claim it (82). When more than one host submits to a
branch, every state an entry has been in and every verdict read for it
is readable from each of those hosts while any other is unreachable
(80).

## Standing executors first, then a pool

An executor is standing or launched (88). A standing executor is one of
the operator's own warm hosts running `sluice run`, taking runs by its
own claims. A launched executor is a job on a pool, a forge's runners
or a self-hosted job runner, started by the instance that opened the
run. The job's start is its claim and its end its report, and a job the
pool loses is a lapsed claim. Which machine a launched run goes to is
the pool's.

Standing executors go first. The lead starts a run on a pool only when
no live instance able to take it has room by its last sign of life
(107). An instance is able to take a run when it is the run's system
and a signer the gate trusts signs its runs. A free
warm host takes the run, and a pool is started only for what the hosts
cannot take, a system they lack or a burst beyond their room. Among
pools, the policy's order decides. Each host rewrites its sign of life
and its free room on its own ref, which is what the lead reads to make
that choice (C.6).

## Signers

When every host can write the records, a record's executor field proves
nothing. A run counts for a gate only when a signer the branch's policy
names has signed its record, in a way every host verifies from the
records alone (78). A run no signer the gate trusts has signed never
satisfies it, whatever its outcome (28). On a branch whose records are
one host's own files there is one writer and nothing to sign, so the
runs that host's sluice starts count unsigned (78).

What a record says about its executor is a claim the signer makes: the
executor's kind, whether the run was confined, and its system (79). A
claim counts only when the policy allows that signer to make it. A run
is read as confined only when its record claims it and its signer may.
No run whose signer may not claim confinement satisfies a gate that
trusts only confined runs (29). Confinement is never inferred:
that a signer's runs are reachable by no session is the policy author's
to assert.

A run record is an in-toto statement in a DSSE envelope. Its subject is
the check's key and system, and its predicate the outcome, the claims,
the candidate, the claim and the time. A job on a forge signs keylessly
with the job's workload identity; any other signer signs with an SSH
key whose public half the policy lists (C.6). Each signer computes the
keys it signs from the candidate itself, so a signature never covers a
key another host computed (C.6).

Say a host writes a record claiming a confined executor, signed by a
key the shared branch does not name. The shared branch reads the key as
missing until a run its signers signed settles it. A bolt's branch that
trusts the sessions' signer reads the same run as it says, unconfined
(S18). By default a branch with no `remote` trusts its own host's
unsigned runs and nothing else, and a branch with a `remote` and no
`trust` trusts no signer, so its policy's author names them (C.7).

## Replays

A result the task runner answered from its cache counts for a gate only
when a signer the gate trusts has signed a pass for the same key on the
same system (108). The cache supplies outputs and makes runs cheaper; it
decides nothing (C.8). A replay with no such signed pass counts for
nothing, and the check runs (S42).

## The system a run needs

A run record names the system its run executed on, so one check on two
systems is two results (85). A branch's gate names, for each check it
requires, the systems a pass must come from. A candidate's verdict is
read over every required check on every system named, and a pass on one
system never stands for another. A check for which the gate names no
system takes a pass from any one system (86). A run is taken only by an
executor that is the system the run requires. A run whose system no
live executor or pool is stays open until the candidate's time limit
reads the candidate as not passed (87, 66).

The lead expands the gate into runs, one per required check per
required system per candidate. That expansion is the matrix, and it is
sluice's on one host and on many.

```
policy (in the repository)          lead (one per branch)
  main requires                       forms candidate 7, then opens
    #check-fast   on linux-x64        its runs:
    #integration  on linux-x64          7 · check-fast  · linux-x64
    cli:build     on linux-x64,         7 · integration · linux-x64
                     linux-arm64,       7 · cli:build   · linux-x64
                     macos-arm64        7 · cli:build   · linux-arm64
                                        7 · cli:build   · macos-arm64
                                      and waits for every one

STANDING FIRST: runs are pulled       THEN A POOL: runs are pushed

 lead writes "7 · check-fast ·        for each run no standing
 linux-x64 is open" to the records    executor of its system has
          │                           room for, the lead starts
          ▼                           one job (107)
 ┌──────────────────────┐                      │
 │ host box             │           ┌──────────┴───────────┐
 │ linux-x64            │           │ pool: forge          │
 │ sluice run           │           │ job: 7·cli:build·arm │
 │ claims the open      │           │ job: 7·cli:build·mac │
 │ linux-x64 runs it    │           │ each: fetch, run,    │
 │ has room for         │           │ sign, add records,   │
 │ signs as "box"       │           │ exit                 │
 └──────────┬───────────┘           └──────────┬───────────┘
            ▼                                  ▼
  refs/sluice/runs/box              refs/sluice/runs/forge
            └────────────────┬─────────────────┘
                             ▼
       the lead reads the runs signed by a signer main trusts
                             │
         candidate 7 has every run's outcome → verdict → land
```

A waiting submit returns when its candidate has a verdict, which needs
every run on every system named. A standing executor costs an idle
host; a pool costs a job's start. Containers do not change the CPU: a
Linux container on a Mac is `linux-arm64`.

## Runs on a pull request's head

A run on a pull request's head, by an executor the branch's gate
trusts, is recorded under its keys and systems as any run is. A
candidate whose key it shares reads it without running it again (113).
A request whose head passed `cli:build` on three systems before it was
ready, submitted behind one entry that changes no input of `cli:build`,
reads those three passes and runs only the checks the entry ahead
changes (S40).

## Closing the laptop

A session does its work on its own host. Once its submission is written
to the branch's records, it reaches its outcome with no host of its
submitter running (111). That holds whenever the deployment has an
instance able to advance the branch and an executor or pool for every
run its gate requires. An instance that writes work no live instance will
take wakes a pool or a peer; a wake that is lost delays the work and
loses nothing.

Where a submission's checks run is the gate's, never the submission's
(112). A submission chooses no executor. A session's own runs count
only on a branch whose gate trusts the signer of the session's host, so
a bolt's branch may land on them while the shared branch, trusting only
confined signers, needs a standing executor or a pool. Say a session
submits to the shared branch and its host then stops. A standing
executor's instance takes the branch, and the pool runs the check on
the one system no standing executor is. The submission lands, and the
session learns the outcome when its host returns (S19).

## The records on the remote

A branch with a `remote` whose policy names signers keeps its records
as refs on the shared remote (C.6). Its decisions are one ref,
`refs/sluice/state/<branch>`, which any instance that submits to or
advances the branch writes conditionally on the commit it read (62).
Each signer's run records are their own ref, `refs/sluice/runs/<signer>`,
written only by that signer and only added to. One signer's write never
refuses another's and never waits on the branch's records (109), so many
executors never contend on one ref. Since any instance may write the
state ref, a landing reads its verdict again from the signed run
records before it moves the branch (C.6). The layout is in
[the records](records.md).

## The deployment

sluice runs on many hosts only as peers, a choice of profiles and no
change to Parts A and B (C.8).

| | peers |
|---|---|
| profiles | container places on any host; pushed refs; remote submit; remote refs records; launched executors on any pool the policy lists |
| who advances a branch | whichever instance holds it (72); another takes it after a lease (73); a pool's job may run a round, started by a wake, a finished run or a schedule, one per branch at a time |
| where runs go | a standing executor with room, by a claim (75, 76); a pool only for the runs no standing executor can take (107) |
| a host stops | its lead and claims pass to others (72, 77); a lost job is a lapsed claim |
| confinement | by signers (78, 79): one the policy lets claim it, on hosts that run no sessions or a pool's fresh machines |
| who holds the branch's credential | an identity no session can use: an app installed on the repository, held by the standing executors' `sluice` user and by the pool's jobs |
| what is new to run | `sluice run` on each standing executor's host; for a forge, one workflow the repository carries, written by `sluice init` |

A submit from any host pushes the head to `refs/sluice/heads/<oid>`.
It adds the entry to the state ref with a conditional push, retrying
from the new state when refused, and wakes a peer or a pool (C.5). On a
hosted forge a branch sustains about 45 submissions an hour before
retries hurt, and several hundred on a local git server. The remote
unreachable stalls everything, submission included.

**A forge as the pool.** A forge's job service, GitHub Actions for one,
is a pool like any other. It runs the runs no standing executor can
take, one job per run on a machine of the run's system, and its jobs
sign as the signer the pool names (C.7). A job may also run a round,
started by a wake, a finished run or a schedule, one per branch at a
time (C.8). The app installed on the repository holds the branch's
bypass, and the queue's whole state lives under `refs/sluice/` in the
repository. A round on a pool costs a job's start, so a branch led by
the pool alone moves in half-minute steps. A standing executor that is
up moves the queue at the speed of its own rounds.
