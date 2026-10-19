# Many hosts: peers, signers, systems and the executors that take runs

Drafted clauses for sluice on many hosts, from the design in
`../models/many-hosts-1.md` and the operator's rulings of 2026-10-19.
sluice runs on many hosts only as peers: every host runs the same
sluice, the records live on the shared remote, and any instance with
room advances a branch or takes a run. A forge's runners are one
executor among others. Parts A and B gain 72 to 82, 85 to 88 and 107 to
113. The proposal amends 27, 28, 29 and 69, adds six glossary entries
and rewrites Part C for peers alone. The operator ratified it on
2026-10-19: its clauses, rows and scenarios are in `../requirements.md`,
which wins where they differ.

## The operator's rulings

| ruling | where it lands |
|---|---|
| sluice has no central server: no server records, no submit to a server, no server deployment | C.5, C.6, C.8; 80 |
| peers only; a forge's runners are one executor among others; executors on the operator's own hosts go first | 88, 107; C.8 |
| a session does its work on its own host; once submitted, a submission reaches its outcome with no host of its submitter running | 111 |
| which runs count, and so where a submission's checks run, is the branch's gate's; a submission never chooses | 112 |
| a gate trusts signers; an executor's kind, its confinement and its system are claims the signer signs | 78, 79; amended 27, 28, 29 |
| a run record is an in-toto statement in a DSSE envelope, signed keylessly by a forge job's workload identity or by an SSH key | C.7 |
| a replay counts when a signer the gate trusts signed a pass for its key; the task runner's cache supplies outputs and decides nothing | 108 |
| one host with local files signs nothing | 78 |
| each signer adds its run records to its own ref; a branch's decisions stay on one ref | 109; C.6 |
| a run on a pull request's head counts toward the candidate that holds it | 113 |
| the guides for executors, systems and the forge path ship with the change, never later | what it changes elsewhere |

## The questions of section 10

| section 10 asks | answered by |
|---|---|
| when a branch's stepper stops, how long before another may advance it, and what tells a peer it stopped rather than went quiet | 72, 73 |
| how a peer decides which candidates to run, and how many | 75, 76, 77, 107 |
| whether the shared branch's gate trusts a container on a host that also runs sessions | 79 and the C.7 default |
| how a policy names the executors it trusts, and how a run proves which executor made it when every host writes the records | 78, 79 |
| under a central server, whether state readable only on the server is readable "whether or not sluice is running" | no central server; 80 |
| who releases the candidate places of a host that has stopped for good | 81 |
| who sets how long a host may hold a branch or a claim | 74 |

## Vocabulary

- **instance**: one running sluice on one host.
- **lease**: how long an instance keeps a branch without writing its
  records.
- **claim**: an instance's recorded hold on a run, from taking it to
  reporting it.
- **system**: the processor architecture and operating system a run
  executes on, named as the toolchain names it.
- **signer**: an identity a branch's policy names, which signs run
  records, with the claims it may make: the executor's kind, whether
  the run was confined, and the systems it runs on.
- **pool**: a job service that starts a machine for each run it is
  given, a forge's runners or a self-hosted job runner.

## The lead: a branch is kept by writing

58 says at most one instance advances a branch and a stopped one writes
nothing more; 59 says whatever next advances it resumes from the records.
Neither says when "next" may be, nor how a peer knows the lead stopped.
Every write is conditional on the version read (62) and two writes from
one version never both succeed (63), so taking a branch is a write and a
former lead's next write fails. The model tests this against each of the
lead's four outside effects (`many-hosts-1.md` 4.1) and it holds.

> 72. An instance keeps a branch only by writing its records. Once the
>     deployment's lease has passed with no write of that instance, any
>     instance may take the branch; taking it is a write (62), after which
>     the former lead writes nothing more for the branch (58).
>
> 73. Taking a branch needs no knowledge of the former lead: one that
>     stopped and one that was quiet for a lease are treated alike, and
>     the lease is measured by the taker's own observation of the
>     records, never by the hosts' clocks agreeing.

A lead that is alive but makes no progress is taken over, which is the
behaviour wanted, and no takeover compares a timestamp one host wrote
with a clock another reads.

## Who sets the lease and the grace

The lease trades takeover delay against needless takeovers. It is a
property of the fleet's network and hosts, the same for every branch,
and nothing a repository's reviewers decide. The time a run may take
(66) is the policy's and stays apart from it: a claim that lapsed
because a run was long would run every long check again.

> 74. The lease on a branch and the bound on an executor's sign of life are
>     the deployment's, one value each for every branch it serves, never a
>     branch's policy's. A branch's policy bounds only how long a candidate's
>     checks may run (66), and a claim never lapses for the length of its
>     run alone.

## Claims: who runs which checks, and how many

> 75. A run is taken only by a claim written to the branch's records, by
>     any instance with room under its own bound (71), or by a pool's job
>     whose start is its claim (88). The lead opens candidates within the
>     window (13) and assigns them to no one.
>
> 76. An instance never claims a later open candidate of a chain while an
>     earlier open candidate of that chain is unclaimed.
>
> 77. A claim lapses when its holder has shown no sign of life for the
>     deployment's bound (74). A lapsed claim's run has no outcome (60),
>     and a report under a claim its reporter no longer holds is never
>     written.
>
> 107. The lead starts a run on a pool only when no live instance able to
>      take it has room by its last sign of life (77): one of the run's
>      system (87), signed by a signer the gate trusts (78). Among pools,
>      the policy's order decides.

75 and 76 answer "which and how many": any instance, earliest first, up
to its own bound. 107 puts the operator's own hosts first: a warm
executor that is free takes the run, and a pool is started only for the
runs no such executor can take, a system the hosts lack or a burst
beyond their room.

## Signers: how a run proves who made it

A gate trusts executors (27, 28), and a gate that trusts only confined
executors is satisfied by no open run (29). Under peers every host
writes the records, so a record's own `executor` field proves nothing:
any host can write any name into it. A run counts only when an identity
the policy names has signed it, and what the record claims about its
executor counts only when that identity may claim it.

> 78. A run counts for a gate only when a signer the branch's policy names
>     has signed its record, in a way every host verifies from the records
>     alone. A run no signer the policy names has signed is from an
>     executor the gate does not trust (28). On a branch whose records are
>     one host's own files, the runs that host's sluice starts count
>     unsigned, as that host's.
>
> 79. An executor's kind, whether its run was confined, and its system are
>     claims in the signed record. A claim counts only when the signer is
>     one the policy allows to make it; a run is read as confined only
>     when its record claims it and its signer may (29). Confinement is
>     never inferred: that a signer's runs are reachable by no session is
>     the policy author's to assert, never sluice's to decide.
>
> 108. A result a tool answered from an earlier run counts for a gate only
>      when a signer the gate trusts has signed a pass for the same key on
>      the same system (15, 16). What the tool's cache holds supplies
>      outputs and decides nothing.
>
> 109. A signer's run records are written only by that signer and only
>      added to. One signer's write never refuses another's, and never
>      waits on the branch's records (62).

78's third sentence keeps one host as it is today: one writer, its own
files, nothing to sign. Signing starts when a second host writes. 108
retires "trust the cache" as a separate setting: a replay counts for
the same reason a run does, because a signer the gate trusts proved
that key. 109 keeps many executors from contending on one ref.

### Amended clauses

> 27. A branch's gate is its policy's: the checks it requires, the
>     signers it trusts and the claims each may make, the systems each
>     check must pass on, how a flaky key reads, whether every candidate
>     or the deepest first is tested, the window's bounds, and how long a
>     candidate's checks may run. sluice gives no gate a meaning of its
>     own, and admits every submission a driver makes: whether work may be
>     submitted at all is decided before it reaches sluice.
>
> 28. A run no signer the branch's gate trusts has signed never satisfies
>     that gate, whatever its outcome.
>
> 29. A gate that trusts only confined runs is satisfied by no run whose
>     signer may not claim confinement.
>
> 69. A check's result belongs to its key and its system, not to a branch:
>     a pass recorded under a key on a system satisfies every branch whose
>     gate trusts the signer that signed it and requires that system.

## State readable from every host

> 80. When more than one host submits to a branch, every state an entry has
>     been in and every verdict read for it is readable from each of those
>     hosts while any other of them is unreachable, as the records were
>     last written (26).

Under local files on one host, 80 is vacuous. Under remote refs it is 63.

## Places of a host that stopped for good

> 81. An instance takes no claim while a place it made on its host
>     belongs to a candidate that has a verdict or is obsolete, or to a
>     claim it no longer holds (25, 34). A place on a host that never
>     returns is the operator's to remove, and no verdict is ever read
>     from it (32).

## What every host must be able to fetch

> 82. From the moment an entry is written until it leaves sluice, its head
>     is fetchable by every host that may run its checks or advance its
>     branch; and a candidate is open to claims only while its revision is
>     fetchable by every host that may claim it.

## Systems: one check on many machines

A repository that ships for several systems tests on several. The gate
names, for each check, the systems a pass must come from; the lead
expands the required checks over their systems and opens one run each.
On a pull request the forge shows the same matrix: one line per check
per system.

> 85. A run record names the system its run executed on: one check on two
>     systems is two results (69).
>
> 86. A branch's gate names, for each check it requires, the systems a
>     pass must come from. A candidate's verdict is read over every
>     required check on every system named (15), and a pass on one system
>     never stands for another. A check for which the gate names no system
>     takes a pass from any one system.
>
> 87. A run is taken only by an executor that is the system the run
>     requires. A run whose system no live executor or pool is stays open,
>     and the candidate's time limit (66) reads the candidate as not
>     passed.
>
> 88. An executor is standing, taking runs by its own claims (75), or
>     launched on a pool by the instance that opened the run, in which
>     case its job's start is its claim and its end its report, and a job
>     its pool loses is a lapsed claim (77). Which machine a launched run
>     goes to is the pool's, never the instance's.

## Where a submission's checks run

A session tests on its own host while it works (89). Once it submits,
the gate decides which runs count, and so who can run them: a bolt's
gate that trusts the sessions' signer lands on the session's own runs;
the shared branch's gate that trusts only confined signers needs an
executor that may claim confinement, a warm executor or a pool. Nothing
in a submission chooses. A host that submitted may stop, and the
submission goes on.

> 111. Once a submission is written to a branch's records, it reaches its
>      outcome with no host of its submitter running, whenever the
>      deployment has an instance able to advance the branch and an
>      executor or pool for every run its gate requires. An instance that
>      writes work no live instance will take wakes a pool or a peer by
>      the means its deployment names; a wake that is lost delays the work
>      and loses nothing (59).
>
> 112. Which runs count for a submission, and so where its checks run, is
>      the branch's gate's (27). A submission never chooses an executor,
>      and a session's own runs (89) count only on a branch whose gate
>      trusts the signer of the session's host.
>
> 113. A run on a pull request's head, by an executor the branch's gate
>      trusts, is recorded under its keys and systems as any run is, and a
>      candidate whose key it shares reads it (15) without running it
>      again.

113 makes the checks a forge runs on a request's head the same runs the
queue reads: a request that sat ready while main did not move lands on
its own head's runs, and one behind another entry runs only the checks
the entries ahead change.

## Part C, rewritten

**C.1 the place**, the container row:

| profile | materialize | release |
|---|---|---|
| **container**: a clean checkout of the candidate in a container on the executing host | the candidate fetched into the host's mirror of the repository; a detached worktree of it under the sluice user's scratch; a container from the image the repository's policy names, read from the branch's revision (56), with the worktree as its checkout, the mirror read-only, a scratch directory, `SLUICE_CHECKOUT` and `SLUICE_TMP`, and nothing of any session mounted; the run as the container's one process under the branch's time limit (66) | the run's records and the failing checks' output written first (16), then the container stopped and removed with everything started in it, and the worktree removed |

**C.2 the check**, the executor table gains a row:

| executor profile | execute | enforces |
|---|---|---|
| **launched**: a job on a pool | one job per run, on a machine of the run's system (87), that fetches the candidate's ref (82), runs the checks, signs its run records with the job's identity and adds them to its signer's ref (109); the job's start is the claim and its end the report (88) | what the pool's machines enforce, as the job's signed record claims; confined when the pool gives each job a fresh machine and the policy lets its signer claim it (79) |

**C.4 the branch**, the pushed refs row, last cell: "branch protection by
the forge's rules, which only sluice's identity bypasses, an identity no
session on any host can use (1)".

**C.5 the driver**, the remote submit row:

| profile | submit / withdraw / state / notify / forecast |
|---|---|
| **remote submit**: a session on any host | the head pushed to `refs/sluice/heads/<oid>` on the shared remote and the entry written to the branch's records (C.6 remote refs), then a wake (111); withdrawal, amend, state and the forecast the same way; a waiting `wt submit` runs rounds while its host is up and reads its entry's state, and that read is the delivery (51); its host stopping loses nothing, and a `--no-wait` submission is prompted by whichever instance on the submitter's host next reads it |

**C.5 the driver**, the pull request row of `pull-requests-1.md` gains:
"the instance that reads the branch's records posts, on the request's
head, one check per required check per system with its outcome and
signer, and one for the entry's state in the queue."

**C.6 the records**:

| profile | read / write |
|---|---|
| **local files**: one host | as now |
| **remote refs**: peers | one root commit under `refs/sluice/state/<branch>` on the shared remote, its tree the branch's documents (53), its id the version; a write a push with `--force-with-lease` from the commit read; beside it `refs/sluice/runs/<signer>`, each signer's signed run records, added to only by that signer (109); `refs/sluice/heads/<oid>` for every submitted head; `refs/sluice/combinations/<branch>/<id>` for every candidate open to claims; `refs/sluice/logs/<branch>/<run>` for a run's output; and `refs/sluice/hosts/<host>`, rewritten by each host alone on a fixed cadence as its sign of life and its free room (77, 107) |

A run record on a signer's ref is an in-toto statement in a DSSE
envelope: its subject the check's key and system, its predicate the
outcome, the claims of 79, the candidate, the claim and the time. A job
on a forge signs it keylessly with the job's workload identity; any
other signer signs it with an SSH key whose public half the policy
lists.

**C.7 policy** gains signers, systems and executors. The whole of one
repository's policy:

```toml
[tests]
runner = "moon"

[checkout]
ports = ["api", "web"]

# Systems a gate can require; a run's system is a claim its signer signs.
[systems]
linux-x64   = { os = "linux", arch = "x86_64" }
linux-arm64 = { os = "linux", arch = "aarch64" }
macos-arm64 = { os = "macos", arch = "aarch64" }

# Who may sign runs, and the most each may claim.
[signers.box]
ssh = "exec@build-1 ssh-ed25519 AAAAC3Nza..."
confined = true            # container places; no session reaches its engine
systems = ["linux-x64"]

[signers.forge]
github = { workflow = ".github/workflows/sluice.yml", ref = "refs/heads/main" }
confined = true            # a fresh machine per job
systems = ["linux-x64", "linux-arm64", "macos-arm64"]

[signers.sessions]
ssh = ".config/sluice.sessions"   # one line per session host's key
confined = false

# Pools the lead may start runs on, in order, after the standing executors (107).
[pools.forge]
github = { workflow = ".github/workflows/sluice.yml" }
signer = "forge"
runners = { linux-x64 = "ubuntu-24.04", linux-arm64 = "ubuntu-24.04-arm", macos-arm64 = "macos-15" }

[branches."bolt/*"]
remote = "origin"
required = ["#check-fast"]
trust = ["sessions", "box", "forge"]   # no systems named: any one system (86)

[branches.main]
remote = "origin"
required = ["#check-fast", "#integration", "cli:build"]
trust = ["box", "forge"]
confined = true
systems = ["linux-x64"]
batch = true
timeout = "45m"

[branches.main.systems_for]
"cli:build" = ["linux-x64", "linux-arm64", "macos-arm64"]

[branches.main.pull_requests]
reviews = 1
checks = ["codeql"]        # other systems' checks; sluice's own are its runs (113)
```

A standing executor names itself in its host's own settings, never in
the repository's: its signing key, its systems, its places and its
bound (71). The defaults: a branch with no `remote` trusts its own
host's unsigned runs (78) and nothing else; a branch with a `remote`
and no `trust` trusts no signer, so its policy's author names them.

**C.8 deployments across hosts**, peers alone:

| | peers |
|---|---|
| profiles | container places on any host; pushed refs; remote submit; remote refs records; launched executors on any pool the policy lists |
| who advances a branch | whichever instance holds the branch (72); another takes it after a lease (73); a pool's job may run a round, started by a wake, a finished run or a schedule, one per branch at a time |
| where runs go | a standing executor with room, by a claim (75, 76); a pool only for the runs no standing executor can take (107) |
| a host stops | its lead and claims pass to others (72, 77); a lost job is a lapsed claim |
| confinement | by signers (78, 79): a signer the policy lets claim it, on hosts that run no sessions or a pool's fresh machines |
| who holds the branch's credential | an identity no session can use: an app installed on the repository, held by the standing executors' sluice user and by the pool's jobs |
| what is new to run | `sluice run` on each standing executor's host; for a forge, one workflow the repository carries, written by `sluice init` |

The task runner's cache makes runs cheaper and decides nothing (108).

## Scenarios

> **S17.** The lead of a branch goes quiet while alive, with a landing
> intent written. Another instance takes the branch after a lease; the
> former's next write is refused and it advances the branch no more. The
> landing lands exactly once, by whichever instance's move the branch
> accepts, and both read the same result.
>
> **S18.** A host writes a run record claiming a confined executor,
> signed by a key the shared branch's policy does not name. The shared
> branch reads the key as missing until a run its signers signed settles
> it; a bolt's branch that trusts the sessions' signer reads the run as
> it says, unconfined.
>
> **S19.** A session submits to the shared branch and its host stops.
> A standing executor's instance takes the branch, the forge's pool runs
> the check on the one system no standing executor is, and the
> submission lands. Its session learns the outcome when its host returns.
>
> **S20.** A host stops mid-run and returns after its claim lapsed and
> the checks were run elsewhere. It releases the places it left before it
> claims again, and writes no outcome for the lapsed run.
>
> **S40.** A pull request's head passes `cli:build` on three systems on
> the forge's pool before it is ready. It is submitted with one entry
> ahead that changes no input of `cli:build`. The candidate reads the
> three passes by key (113) and runs only the checks the entry ahead
> changes.
>
> **S41.** A run needs `linux-x64` and the box has room: the box claims
> it and no job starts. The box is full: the lead starts the run on the
> forge's pool (107).
>
> **S42.** The task runner replays a check from its cache, and no signer
> the gate trusts has signed a pass for that key on that system. The
> replay counts for nothing and the check runs (108).

## What it changes elsewhere

- 58 and 59 stand as written; 72 and 73 say when and how "next" happens.
- 60 stands; 77 says what "stopped" is.
- 26 stands; 80 adds the case of many hosts.
- 27, 28, 29 and 69 read as amended above; 15 and 16 stand, and 108
  says when a replay counts.
- The glossary gains instance, lease, claim, system, signer and pool;
  **gate** reads "the checks it requires, the signers it trusts, the
  systems each check needs, and how a flaky key reads".
- Section 10 loses its seven multi-host questions.
- C.5 and C.6 lose their server rows and C.8 its server column.
- sluice's rules: core.11 drops the server profile; a rule under
  "Verdicts and attribution" says a run counts only through a signer the
  policy names (78) and never through a record's executor field alone;
  a rule under "Places" says an instance claims nothing while it has
  places to release (81).
- sluice's ADRs: 0004's trust by the cache's write credential gives way
  to 108; 0008's two deployments become one; 0015's default trust becomes
  the host's own unsigned runs on a branch with no remote.
- sluice's guides ship with the change: executors and systems (one host,
  a warm executor on a box, a forge's pool, and choosing systems per
  check); the forge path (`sluice init` writing the workflow, the app and
  the signers, then submit and close the laptop); and the parallel and
  batch guide's section on how systems multiply runs.
- `pull-requests-1.md`'s note on a forge as the pool points here.
- The book's many-hosts chapter is rewritten for peers once the operator
  rules.
