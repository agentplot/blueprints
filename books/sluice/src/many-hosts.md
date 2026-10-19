# Many hosts

The design below is under review in `design/sluice/proposals/
many-hosts-3.md` as proposed 72 to 88 and 107 to 113, and is not yet built.

A deployment is one machine or a fleet, with no hybrid. On one machine
a waiting submit runs the rounds itself. On a fleet every round is run
by a `sluice run` and a waiting submit only waits. What follows says
which instance advances a branch, which runs a candidate's checks, and
how a result proves who made it.

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

A candidate's checks are taken only by a claim written to the branch's
records, by any instance with room under its own bound (71). The lead
opens candidates within the window and assigns them to no one (75). An
instance claims the earliest open run first. It never claims a later
open candidate of a chain while an earlier open candidate of that chain
is unclaimed (76), since the front of the chain is what blocks landing
(22).

A claim lapses when its holder has shown no sign of life for the
deployment's bound. A lapsed claim's run has no outcome, and a report
under a claim its reporter no longer holds is never written (77). An
instance takes no claim while a place it made on its host belongs to a
candidate that has a verdict, is obsolete, or is under a claim it no
longer holds (81). A place on a host that never returns is the
operator's to remove, and no verdict is ever read from it.

From the moment an entry is written until it leaves sluice, its head is
fetchable by every host that may run its checks or advance its branch
(82). A candidate is open to claims only while its revision is fetchable
by every host that may claim it. When more than one host submits
to a branch, every state an entry has been in is readable from each of
those hosts while the host that last wrote the records is unreachable
(80).

## Vouching

When every host can write the records, a record's executor field proves
nothing. A run counts as an executor's only when an identity the
branch's policy names vouches for it, in a way every host verifies from
the records alone (78). A run vouched for by nobody the policy names is
from an executor the gate does not trust (28). A policy that counts runs
nobody vouches for says so for that branch, by name. Confinement is
never inferred: a run is read as confined only when the identity
vouching for it is one the policy names as confined (79). That the
identity is reachable by no session is the policy author's to assert. The shared branch's default names only executors on hosts that
run no sessions; a bolt's branch by default counts runs nobody vouches
for (C.7).

Under the remote refs profile, each host's `sluice` user holds an SSH
signing key, a run's report is signed with it, and the policy names the
key beside the executor it trusts.

## The system a run needs

A check's key names the system its run executes on, so one check on two
systems is two keys (85). A branch's gate names, for each check it
requires, the systems a pass must come from (86). A candidate's verdict
is read over every required check on every system named, and a pass on
one system never stands for another. A gate that names no system names
the system of the instance advancing the branch. A run is taken only by
an executor that is the system the run requires (87). A run whose system
no live executor is stays open until the candidate's time limit reads
the candidate as not passed (66).

The lead expands the gate into runs, one per required check per
required system per candidate. That expansion is the matrix, and it is
sluice's under every deployment. An executor is standing, taking runs
by its own claims, or launched by the instance that opened the run (88).
A launched executor's start is its claim and its end its report, and an
executor its pool loses is a lapsed claim. Which machine in a pool takes a
launched run is the pool's.

```
policy (in the repository)      lead (one per branch)
  main requires                   forms candidate 7, then opens
    #check-fast on                its runs:
      aarch64-darwin                7 · fast · aarch64-darwin
      x86_64-linux                  7 · fast · x86_64-linux
      aarch64-linux                 7 · fast · aarch64-linux
    #check-e2e on                   7 · e2e  · aarch64-darwin
      aarch64-darwin              and waits for every one

STANDING: runs are pulled                 LAUNCHED: runs are pushed

 lead writes "7·fast·x86_64-linux          lead starts one job per run
 is open" to the records                   on a pool, with the system
          │                                as the job's label
          ▼                                        │
 ┌───────────────┐ ┌───────────────┐       ┌───────┴───────────────┐
 │ host mac-1    │ │ host build-7  │       │ pool                  │
 │ aarch64-darwin│ │ x86_64-linux  │       │ job: 7·fast·x86_64…   │
 │ sluice run    │ │ sluice run    │       │ job: 7·fast·aarch64…  │
 │ claims only   │ │ claims only   │       │ job: 7·e2e·aarch64-d… │
 │ darwin runs   │ │ linux runs    │       │ each: checkout, run,  │
 └───────┬───────┘ └───────┬───────┘       │ write result, exit    │
         │                 │               └───────────┬───────────┘
         └── result written to the records ◄───────────┘
                              │
            candidate 7 has every run's outcome → verdict → land
```

A waiting submit returns when its candidate has a verdict, which needs
every run on every system. Standing costs idle hosts; launched costs a
job's start and a pool to drive. A fleet may mix them, with the Darwin
runs claimed by a standing Mac and the Linux runs launched on a pool.
Containers do not change the CPU: a Linux container on a Mac is
`aarch64-linux`.

## The deployments

Each deployment is a choice of profiles and no change to Parts A and B
(C.8).

| | peers | a server with executor hosts | a central server | a forge as the pool |
|---|---|---|---|---|
| who advances a branch | whichever instance holds it (72); another takes it after a lease (73) | the server, always | the server, always | a launched stepper, one round per job, one at a time |
| where candidates run | any instance with room, by a claim (75, 76) | the server and the executor hosts, by a claim through the projection | the server's executors | the forge's runners, one job per run, labelled by system (87, 88) |
| a host stops | its lead and claims pass to others (72, 77) | an executor host: its claims pass; the server: every branch stalls and loses nothing (59) | a session's host: nothing changes; the server: every branch stalls and loses nothing (59) | a lost job is a lapsed claim (77) |
| confinement | by vouching (78, 79) | by vouching; the executor hosts run no sessions | by construction: one writer, no sessions | a fresh machine per job, vouched for by the forge's record of it |
| who holds the branch's credential | every host's `sluice` user | the server | the server | an app installed on the repository, holding no state |
| what is new to run | `sluice run` on each host | `sluice run` on the server and each executor host | `sluice run` on the server; nothing elsewhere | nothing: two workflows the repository carries |

**Peers.** The records are refs on the shared remote, and every host
runs `sluice run` as a `sluice` user holding a deploy key that bypasses
branch protection and a signing key that vouches for its runs. A submit
from any host pushes the head and adds the entry to the state ref with a
conditional push, retrying from the new state when refused. On a hosted
forge a branch sustains about 45 submissions an hour before retries
hurt, and several hundred on a local git server. The remote unreachable
stalls everything, submission included.

**The central server.** One host runs `sluice run` and leads every
branch. A session's host runs nothing of sluice but `wt submit
--remote`. It pushes the head to the server's repository over SSH, runs
the submission there over SSH, and reads the entry's state the same way
until the outcome. The records are the server's files, projected to
the remote after every write, so state stays readable with the server
down and a lost server is rebuilt from the remote. Executor hosts that
run no sessions stand behind the server and claim through the
projection; the server's own runs need no signature, since it is the
only writer.

**A forge as the pool.** The launched shape, with a forge's job service
as the pool. The stepper is a launched job too: one `sluice step` per
job, started by a submit, by a check's completion and by a schedule,
under a concurrency group so one round runs at a time. The pull request
is the driver. An app installed on the repository holds the bypass and
posts the status on each head. The queue's whole state lives under
`refs/sluice/` in the repository, with nothing behind a vendor's server.
A round costs a job's start, so the queue moves in half-minute steps.
That suits a shared branch on a large project and not a bolt's branch,
which stays on the agents' machines.

## The order of building

The server comes first, in the peers' form: its records projected in the
peers' layout, so a lost server is rebuilt from the remote and the
server is already a peer. Executor hosts come next, claiming through
the projection behind the lead. A lead anywhere, which is peers in full,
comes only if a stalled server hurts more than the second credential on
every host costs.
