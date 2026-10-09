# Many hosts

Agents run on many hosts, ten servers or more, and sessions on any of
them submit to the same line: a bolt's line as much as the shared line.
One design has to admit two ways of running sluice across them:

- **peers**: sluice runs on every host, and the hosts coordinate through
  what they share, with no server of sluice's own;
- **a central server**: one host takes the queue and the execution
  off every other; sessions only submit and wait.

A check is a command run in a place set up for the candidate: a clean
checkout, in a container, with what the repository declares. The task
runner's cache makes that cheaper and is left out of this proposal; no
clause here depends on it.

## Confined means isolated from every session

### The problem

The glossary calls an executor confined "when it could not read beyond
its declared inputs". Read literally that is a sandbox per check, which
sees an exact input set and nothing else. A check that needs a service
cannot run in one: what it needs is brought up in its place (31, 39),
and a per-check sandbox has no place for a service to live in. Some
gating checks need services, so the literal reading leaves them with no
executor a confined-only gate (29) can trust.

What a confined gate protects against is a session: a shell that reads
what it should not, or writes a result it did not observe (38). The
boundary is between the executor and every session, and between the
executor's records and anything else that could write them.

### The ruling

The glossary entry **executor** becomes:

> - **executor**: what ran a check, with its identity and its host;
>   **confined** when it ran in a place holding exactly the candidate
>   and what the repository declares, which nothing of any session could
>   reach, and when nothing but it could have written its records;
>   **open** otherwise.

## One line, many hosts

### The problem

Section 10 asks where entries live when several hosts submit to one
line, and who leases a chain. Landing stays safe with no coordination:
a move from an expected revision either succeeds or is refused (45,
46). What breaks is the rest. A host that does not see another's
entries orders its own alone (6) and cannot honour an after naming the
other's entry (7); two hosts advancing one chain can each name a culprit
for one failure (17, 20); and an executor that stops mid-run leaves a
candidate with no verdict and nobody to give it one.

### The rulings

A glossary entry is added:

> - **host**: a machine on which sessions, sluice or executors run.

> 57. Every entry of one line is ordered with every other entry of that
>     line, whichever host submitted it.

> 58. At most one instance of sluice advances a line at any moment,
>     whichever host it runs on, and one that has stopped advancing a
>     line writes nothing more for it.

> 59. An instance that stops advancing a line loses nothing: every entry
>     submitted meanwhile is held, and whatever next advances the line
>     resumes from the records as last written.

> 60. A candidate's checks may run on any host. A run whose executor
>     stopped before reporting has no outcome: it is never read as a
>     pass or a fail, and the check is run again.

26 is amended in place:

> 26. Every state an entry is in, and every verdict read for it, is
>     readable by its session, its planner and the operator, from every
>     host that submits to its line, whether or not sluice is running.

## The records become a seam

### The problem

C.6 puts the records in files under one host's repository. Peers need
them where every host reads and writes them, and a central server needs
them on the server and nowhere else. Where the records live is the one
thing that differs most between the two deployments, and today it is
fixed in Part C with no contract in Part B. Clause 53 already asks that
records have one form whatever wrote them; nothing yet says what a
store of them must guarantee.

### The rulings

A sixth seam, B.7 the records:

> 61. **read**: given a line, its records as last written, and the
>     version they were read at.

> 62. **write**: given a line, the version its records were read at and
>     the records to write, the write, or a refusal because they have
>     been written since.

> 63. The guarantee: a write is all or nothing, two writes from one
>     version never both succeed, and every host reads what the last
>     write left.

58 is then kept by every instance writing a line's records only from
the version it read: an instance that lost the line is refused.

The preamble's five seams become six, and a sixth section of Part C
binds them.

## Part C

### C.1, a new place profile

| profile | materialize | release |
|---|---|---|
| **container**: a clean checkout of the candidate in a container on the executing host | the candidate fetched and checked out into a new container's filesystem, with the environment the repository declares | the container and everything started in it removed |

### C.4, the pushed refs profile rewritten

| profile | read / form / commit / move |
|---|---|
| **pushed refs**: a line on a remote every host reaches | `git fetch` then `git rev-parse` of the remote's line; forming and committing as local refs, on the host advancing the line; the landing a push with `--force-with-lease=<line>:<expected>` |

### C.5, a new driver profile

| profile | submit / withdraw / state / notify |
|---|---|
| **remote submit**: a session on any host | the head pushed to the remote and the submission written through the records seam (peers) or sent to the server (central); withdrawal the same; state read through the records seam or from the server; a waiting `wt submit` polls it until the outcome |

### C.7, the records (replacing C.6)

| profile | read / write |
|---|---|
| **local files**: one host | the JSON documents under the repository's common git directory, a version kept beside them; a write under the line's lock, refused when the version moved |
| **remote refs**: peers | the records as one tree committed under `refs/sluice/<line>/records` on the shared remote; a write is a push with `--force-with-lease` from the commit read |
| **server**: a central server | the server's local files; other hosts read and write only by asking the server |

## The two deployments

| | peers | a central server |
|---|---|---|
| who advances a line | whichever host's sluice wins the write (58, 62); another takes over when it stops | the server, always |
| where candidates run | any host with room, in containers; an executor claims a candidate by a write to the records | the server's executors, in containers |
| where the records live | remote refs on the shared remote | the server |
| a host stops | its claims and its lead pass to others (59, 60) | a session's host: nothing changes; the server: every line stalls and loses nothing (59) |
| confinement | a container on an agent host is confined only if no session on that host can reach it; the shared line may need hosts that run no sessions | the server runs no sessions, so its executors are confined |
| what is new to run | nothing but sluice on each host | a server process, started by the operator, whose listener belongs to its driver profile, not to the core (core.10) |

Both are the same core: one step over a line's records (ADR 0005), bound
to different profiles of the place, line, driver and records seams.
Neither needs the task runner's cache, and either takes it when added.

## Questions this leaves

- How long may a host hold a line's lead before another may take it,
  and what tells a peer the leader has stopped rather than gone quiet?
- How does a peer decide which candidates to take, and how many?
- Does the shared line's gate trust a container on a host that also runs
  sessions, or only hosts that run none?

## What it changes elsewhere

- S13. Sessions on two hosts submit to one bolt's line. Their entries
  are tested in one order, and each session reads its entry's state and
  is told its outcome on its own host.
- S14. The host advancing a line stops mid-chain. Under peers another
  host continues from the records; under a central server nothing lands
  until it is back. In both, no entry is lost and no check that has a
  verdict is run again.
- S15. An executor stops while running a candidate's checks. The run has
  no outcome; the checks run again on another executor, and the
  candidate's verdict is read from that run.
- sluice: ADR 0003's five seams become six, with the records seam and
  its single-host profile first; an ADR on the place handle the place
  and check profiles share (core.2); rule core.11 reads "readable from
  every host that submits to the line".
