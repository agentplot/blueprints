# sluice — requirements
<!-- ANCHOR: preamble -->

A statement of what sluice must always do and never do, written to
admit any model that satisfies it.

The statement is in three parts. Part A is what must hold of sluice on
its own: how work is submitted to a branch, ordered, tested in the
combination it will land in, attributed when it fails, and landed. Part
B is its contracts: the operations it needs across its five seams, a
place, a check, a branch, a driver and the records, and the guarantee
each must give. Part C is the profiles: the ways each contract is satisfied.

Parts A and B name no mechanism: no command, file, format, field,
service or tool. One thing of the world they name freely, because
section 9 fixes it: git. Every other real tool is named only in section
9 and in Part C. A reader who has never seen a merge queue should be
able to design from Parts A and B and git alone.

## 1. Purpose

sluice admits finished work onto a branch only after the branch, extended by
that work and by everything ahead of it, has passed the branch's gate. It
orders what is submitted, forms each candidate revision exactly as it
would land, tests candidates ahead of need, names the one submission at
fault when a candidate fails, and moves the branch only to a revision that
passed. It never runs a check of its own invention, never starts a
service, never chooses a port, and never decides what a gate requires.
A session that built the work submits it and does nothing more.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **a session** (an agent or a person building in a place) | when its work is ready, and to submit it; how to resolve a conflict or a failure in its own place | merge, land, or move a branch; change another submission's order; withdraw another's submission |
| **a planner** (a plan, or a person) | what a submission lands after, and its priority | override a gate; move a branch |
| **a policy's author** (a repository's owners, a platform) | which checks gate each branch, which executors each branch trusts, how a flaky result reads, how deep a chain is tested, how long a candidate's checks may run, what a run may use and reach | make a branch land untested; widen trust a layer above set |
| **the operator** | everything a policy does not settle | make a landing that skipped the gate count as one |
| **sluice** | the order among submissions within what the planner and the policy fixed; which candidates to test and how many at once; when a branch moves | run a check of its own, start a service, choose a port, resolve a conflict, decide trust, release a session's place, or move a branch to a revision that has not passed its gate |
| **an executor** (a session's shell, a confined run) | nothing; it runs checks and reports what it observed | report an outcome it did not observe |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **branch**: a git branch that lands work: a repository's shared branch, or a
  bolt's branch off it.
- **place**: a working copy prepared for one session off one branch.
- **head**: the revision a place holds when its session submits.
- **submission**: one head offered to one branch, with what it must land
  after, its priority and who submitted it.
- **entry**: a submission as sluice holds it, with its state.
- **after**: the entries a submission names as having to land before
  it.
- **work**: an entry's commits, from where its head left the branch to
  the head.
- **candidate**: a revision equal to the branch's current revision
  extended, in order, by an entry and every entry ahead of it: the
  revision that entry would land as.
- **chain**: the candidates of one branch, each extending the one
  before.
- **window**: how many candidates of a branch's chain are under test
  at once.
- **conflict**: a candidate that cannot be formed because its entry and
  the candidate before it change the same content incompatibly.
- **check**: a task run to judge a revision, ending in a pass or a
  fail.
- **gate**: for a branch, the checks it requires, the executors it
  trusts, and how a flaky key reads.
- **key**: the identity of one check over the inputs it reads.
- **verdict**: a gate's reading of a candidate: for each required check
  exactly one of passed, failed, missing or flaky.
- **culprit**: the one entry a failed candidate is attributed to.
- **landing**: the branch moving to a candidate that passed.
- **executor**: what ran a check, with its identity and its host;
  **confined** when it ran in a place holding exactly the candidate and
  what the repository declares, which nothing of any session could
  reach, and when nothing but it could have written its records;
  **open** otherwise.
- **host**: a machine on which sessions, sluice or executors run.
- **profile**: one way a contract of Part B is satisfied, as Part C
  describes.

<!-- ANCHOR_END: glossary -->
<!-- ANCHOR: part-a -->
## Part A. What must hold of sluice

### A.1 Submission

1. A session submits a head to a branch and does nothing more: it never
   merges, never lands and never moves a branch, and an attempt to is
   refused and reported.
2. A head is submitted only from a place whose tree is exactly its
   commits. The driver refuses a place holding anything more, and names
   what it holds; sluice is only ever given a head.
3. A submission names what it lands after, its priority and who
   submitted it. It never names a position.
5. An entry leaves sluice only by landing, by withdrawal by its
   submitter, its planner or the operator, or by a bound the branch's
   policy states in advance. sluice never drops an entry on its own.
67. A submission from a place that has an entry on the same branch
    withdraws that entry, which stays readable as withdrawn.
54. sluice never bounds how often a session submits again after its
    entry was removed as culprit or conflict. An entry's state shows
    how many times its place's work was submitted before it, and acting
    on that count is the driver's or the planner's.

### A.2 Order

6. Entries of one branch are ordered by priority, then by the order of
   submission. Priority orders only entries in no candidate under test:
   an entry under test is never displaced by one submitted after it. An
   entry never lands before an entry it names as after.
7. An entry whose after-entries are neither landed nor ahead of it in
   its branch's chain waits, and its waiting holds no other entry.
8. Every entry of a branch is in its one chain. No entry is tested
   apart from the entries ahead of it, and entries land in chain order.

### A.3 Candidates and chains

10. Every candidate equals the branch's current revision extended, in
    order, by exactly the entries ahead of it and itself. A candidate
    never contains an entry behind it or an entry removed from the
    chain.
11. An entry is judged only as a candidate: never alone against a
    revision the branch has left, and never in a combination it would not
    land in.
12. A conflict is found when the candidate is formed, before any check
    runs. It removes the entry from the chain and nothing else: the
    chain continues without it.
64. sluice forms, for a head not yet submitted, the candidate it would
    form were the head submitted now, against the branch and the entries
    ahead of it, and reports a conflict so found to the head's
    session. A forecast creates no entry, changes no order and moves
    no branch, and its result is never read as a verdict.
65. A conflict reported to a session, forecast or found at forming,
    names the content contested and every entry it is contested with,
    with what each of those entries submitted: each entry ahead the head
    conflicts with alone, or, when none does, every entry ahead up to
    the one at which the conflict appeared.
13. A branch is tested up to its window. The window never falls below
    one, grows while candidates pass and shrinks when one fails, within
    bounds the branch's policy states.
71. An instance of sluice starts no more checks at once than its own
    bound, whatever the windows of the branches it serves. A host whose
    checks are all started by one instance runs no more than that
    instance's bound.
14. A branch's policy says whether every candidate of a chain is tested or
    the deepest first. Under deepest first, a failure is attributed only
    after the candidates that were skipped have verdicts.

### A.4 Verdicts and attribution

15. A candidate's verdict is its branch's gate read over the checks the
    candidate affects. A required check whose key already holds a pass
    from an executor the gate trusts is read from that pass and not run
    again.
16. Every check run on a candidate is recorded with its key, its
    outcome, pass and fail alike, and its executor, before the verdict
    is read. A result a tool answered from an earlier run is not a run
    and is never recorded as one.
17. A failed candidate is attributed to exactly one entry: the newest
    entry of the first failed candidate in its chain.
18. No entry is attributed or landed before every candidate ahead of it
    in its chain has a verdict. A conflict removes its entry when it is
    found (12).
69. A check's result belongs to its key, not to a branch: a pass recorded
    under a key satisfies every branch whose gate trusts the executor
    that recorded it.
70. When the branch's revision is covered by no verdict, every check its
    gate requires is affected by the next candidate.
19. A key holding both a pass and a fail from executors the gate trusts
    reads as the branch's policy says, passed or not passed, and never
    differently for two candidates of one branch.
20. The culprit's session is told the failing checks and the candidate
    they failed on. No other session is told of that failure.
21. An entry removed as culprit or as conflict leaves the chain, and
    every candidate behind it is formed again without it.

### A.5 Landing

22. A branch moves only to a candidate whose verdict is satisfied, only
    in chain order, never past an entry without a verdict, and never to
    a candidate containing a culprit or a conflict.
23. A landing writes one commit per entry, with the revision before it
    as its first parent and the entry's head as its second, naming the
    entry's work and the verdict it landed on; entries landed together
    on the deepest candidate's verdict each name that verdict. The
    history of a branch is
    never rewritten, and a session's commits stay reachable from the
    branch they landed on.
24. A landing moves the branch from exactly the revision its candidate
    was formed on. A landing that finds the branch elsewhere is refused,
    and the chain is formed again on the revision found.
25. sluice releases every place it made for a candidate once that
    candidate's verdict is read, and never releases a session's place.
    A session learns its entry landed (50), and releasing its place is
    its driver's.
26. Every state an entry is in, and every verdict read for it, is
    readable by its session, its planner and the operator, from every
    host that submits to its branch, whether or not sluice is running.

### A.6 Gates and trust

27. A branch's gate is its policy's: the checks it requires, the
    executors it trusts, how a flaky key reads, whether every candidate
    or the deepest first is tested, the window's bounds, and how long a
    candidate's checks may run. sluice gives no gate a meaning of its
    own, and admits every submission a driver makes: whether work may be
    submitted at all is decided before it reaches sluice.
28. A result from an executor the branch's gate does not trust never
    satisfies that gate, whatever its outcome.
29. A gate that trusts only confined executors is satisfied by no open
    run.
30. sluice never runs a check of its own and never changes what a gate
    requires.
55. A check's cost never changes how it gates: every check a branch's gate
    requires has a verdict before the branch moves, and none is deferred
    past a landing.
56. A branch's gate is read from the branch's current revision, never from a
    candidate or a place. No submission changes the gate it is judged
    by.

### A.7 Places

31. sluice starts no service and chooses no port. What a candidate's
    checks need, the checks bring up themselves, in the candidate's
    place.
32. A candidate's place belongs to the candidate: nothing started in it
    outlives it, and two places on one host never collide.
66. A candidate's checks run under the time limit its branch's policy
    states. A run that exceeds it is ended with everything it started,
    recorded as timed out, and read as failed.

### A.8 Hosts

57. Every entry of one branch is ordered with every other entry of that
    branch, whichever host submitted it.
58. At most one instance of sluice advances a branch at any moment,
    whichever host it runs on, and one that has stopped advancing a
    branch writes nothing more for it.
59. An instance that stops advancing a branch loses nothing: every entry
    submitted meanwhile is held, and whatever next advances the branch
    resumes from the records as last written.
60. A candidate's checks may run on any host. A run whose executor
    stopped before reporting has no outcome: it is never read as a pass
    or a fail, and the check is run again.

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The place

33. **materialize**: given a revision, a place holding exactly that
    revision, with the environment the repository declares.
34. **release**: given a place sluice made, its removal, with everything
    started in it ended (25, 32).
35. The guarantee: a place holds what it was given and nothing of any
    other place, except the caches its branch's policy declares, each
    keyed by the content of the files it is built from and saved only
    from a run that passed. A cache changes how fast a check runs, never
    what it reports.

### B.2 The check

36. **affected**: given the branch's revision and a candidate, the checks
    the candidate can change the result of (15, 70).
37. **run**: given a place and checks, for each check its key, its
    outcome, its executor and whether the outcome was observed in this
    run or read from an earlier one (16).
38. The guarantee: an outcome is what the executor observed, never
    inferred; a replay says it is a replay.
83. **execute**: given a place, a command, and the limits a run is held
    to (the processors its instance gives each run; the memory, the
    network and the paths it may write that the branch's policy
    states), the command run within them, and what the executor
    enforced: whether the run was confined, and each limit it held.
84. The guarantee: an executor that cannot enforce a limit the branch's
    policy states refuses the run rather than run it without the limit,
    and every run is recorded with what its executor enforced (16), so
    a run is never read as confined, or as held to a limit, unless its
    executor enforced it (28, 29).

### B.4 The branch

42. **read**: given a branch, its current revision.
43. **form**: given a revision and a head, the candidate revision, or
    the conflict with the content it is on (12).
44. **commit**: given a candidate, its parent, the entry's head, the
    entry's work and the verdict read for it, one commit (23).
45. **move**: given a branch, the revision it is expected at and the
    revision to move to, the move or a refusal because the branch was
    elsewhere (24).
46. The guarantee: a move is all or nothing, and two moves of one branch
    from one expected revision never both succeed.

### B.5 The driver

47. **submit**: given a head, a branch, the after-entries, a priority, a
    submitter, an entry (1, 3).
47a. **forecast**: given a head, a branch and its after-entries, the
     conflicts the head would meet if submitted now, placed after every
     entry already submitted, each with the entries it meets (64, 65).
47b. **amend**: given a queued entry and who asks, its after-entries or
     priority changed (3, 6).
48. **withdraw**: given an entry and who asks, its removal where 5
    allows it.
49. **state**: given an entry, its state and the verdicts read for it
    (26).
50. **notify**: given an entry's session and an outcome, the outcome
    delivered to that session and no other (20).
51. The guarantee: a notification reaches the submitter at least once
    and names its entry and outcome, so a repeat is known as one, and a
    state read with sluice stopped is the state sluice last wrote.

### B.6 Binding the contracts

52. Each seam is bound by naming one profile of Part C, and Parts A and
    B do not change to admit a profile.
53. An entry's records and a candidate's verdicts have one form whatever
    profile wrote them, so a reader of one profile's records reads
    another's.

### B.7 The records

61. **read**: given a branch, its records as last written, and the
    version they were read at.
62. **write**: given a branch, the version its records were read at and
    the records to write, the write, or a refusal because they have
    been written since (58).
63. The guarantee: a write is all or nothing, two writes from one
    version never both succeed, and every host reads what the last
    write left (26, 59).

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile.

### C.1 The place

| profile | materialize | release |
|---|---|---|
| **git worktree**: a detached worktree, nothing run in it | `git worktree add --detach` at the candidate | `git worktree remove`; the checks' process group ended |
| **archive**: the revision exported into a scratch directory, no git metadata | `git archive` of the candidate into a directory under the host's scratch | the directory removed; the checks' process group ended |
| **container**: a clean checkout of the candidate in a container on the executing host | the candidate fetched and checked out into a new container's filesystem, with the environment the repository declares | the container and everything started in it removed |

### C.2 The check

| profile | affected | run |
|---|---|---|
| **moon**: the repository's task runner with declared inputs and a content-keyed cache | moon's affected projects between the branch's revision and the candidate, downstream dependents included | moon's run of the affected check tasks in the place; the run report gives each task's outcome and whether it was replayed, the run record gives its hash as the key and its exit code |
| **script**: one command with an exit code | every check, always | the command's exit code, never a replay |

| executor profile | execute | enforces |
|---|---|---|
| **open**: a process group on the instance's host | the command in the place, as one process group ended with its run | the processors given, by the runner's own threads; nothing else; never confined |
| **sandbox**: the host's kernel sandbox, Seatbelt on macOS, bubblewrap and Landlock on Linux | the command in the place under a profile that allows writes only to the place and its scratch and the network only as the policy says | paths and network everywhere; processors and memory only on Linux, by a cgroup the run is started in; confined when no session on the host can write the place |
| **container**: a container engine on the executing host | the place mounted into a new container from the repository's image | processors, memory, paths and network; confined as C.8 says |

### C.4 The branch

| profile | read / form / commit / move |
|---|---|
| **local refs**: one host's repository | `git rev-parse`; `git merge-tree --write-tree`; `git commit-tree` with the branch and the head as parents and the verdict as `Sluice-*` trailers; `git update-ref` with the expected old value; branch protection by a `reference-transaction` hook that refuses any update to a branch in the policy not made by sluice, and logs it (1) |
| **pushed refs**: a branch on a remote every host reaches | `git fetch` then `git rev-parse` of the remote's branch; forming and committing as local refs, on the host advancing the branch; the landing a push with `--force-with-lease=<branch>:<expected>`; branch protection by the forge's rules, which only sluice's identity bypasses (1) |

### C.5 The driver

| profile | submit / withdraw / state / notify / forecast |
|---|---|
| **worktrunk**: a custom subcommand on the path | `wt submit`, the executable `wt-submit` on the path, waiting for the entry's outcome, which it reports as its exit, or with `--no-wait` returning the entry at once; `wt submit --withdraw`; `wt submit --status`; the outcome of a waiting submit is its exit, of any other the session's pane prompted through the multiplexer; on landing, worktrunk removes the session's place; `wt submit --check`, the same forming as a submission with no entry written |
| **crew**: a bolt team's stages | the unit's merge stage submits, and a bolt is submitted from its own place by its conductor; `sluice amend` sets an After the conductor adds; the conductor reads the entry's state as the stage; a red or a conflict re-charges the unit's slot; the conductor's wait runs a forecast for each unit in code and tells the unit's agent of a conflict when it is idle |
| **flywheel**: the machinery's effects | a session's done exit, once approved, is the submission; the entry's state is evidence; a forecast is evidence on the item, read each tick |
| **remote submit**: a session on any host | the head pushed to the remote and the submission written through the records (peers) or sent to the server (central server); withdrawal the same; state read through the records or from the server; a waiting `wt submit` polls it until the outcome; a forecast through the records or from the server |

### C.6 The records

Whatever binds them, the records are one JSON document per entry and
one JSON Lines log of check runs and verdicts per branch (53), and what
outlives them is the trailers each landing commit carries (23).

| profile | read / write |
|---|---|
| **local files**: one host | the documents under the repository's common git directory, one directory per branch and one log of check results per repository (69), readable by every place on the host with no process running, never tracked and never pushed, a version kept beside them; a write under the branch's lock, refused when the version moved |
| **remote refs**: peers | the records as one tree committed under `refs/sluice/<branch>/records` on the shared remote; a write is a push with `--force-with-lease` from the commit read |
| **server**: a central server | the server's local files; other hosts read and write only by asking the server |

### C.7 Policy

A branch's policy is a TOML file checked into the repository, one table
per pattern of branch names, read from the branch's revision (56).

### C.8 Deployments across hosts

Two ways of running sluice on many hosts, each a choice of profiles
and neither a change to Parts A and B.

| | peers | a central server |
|---|---|---|
| profiles | container places on any host; pushed refs; remote submit; remote refs records | container places on the server; pushed refs; remote submit; server records |
| who advances a branch | whichever host's sluice wins the write (58, 62); another takes over when it stops | the server, always |
| where candidates run | any host with room; an executor claims a candidate by a write to the records | the server's executors |
| a host stops | its claims and its lead pass to others (59, 60) | a session's host: nothing changes; the server: every branch stalls and loses nothing (59) |
| confinement | a container on a host that runs sessions is confined only if no session there can reach it | the server runs no sessions, so its executors are confined |
| what is new to run | nothing but sluice on each host | a server process the operator starts, whose listener belongs to its driver profile, never to the core |

The task runner's cache makes either cheaper and neither depends on it.

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** Nothing lands untested in the combination it lands in (10,
  11, 22).
- **I2.** A session never moves a branch (1).
- **I3.** Every failure has exactly one culprit, named only once
  everything ahead of it is known (17, 18).
- **I4.** A branch never moves past what passed, and never from a revision
  other than the one its candidate was formed on (22, 24).
- **I5.** sluice runs no check, starts no service and chooses no port
  (30, 31).

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Running checks, caching their outputs, or hosting an executor.
- Describing a repository: its parts, what a change affects, what a
  check reads. That is the repository's description, read through
  B.2.
- Deciding policy: which checks gate a branch, whom to trust, how flaky
  reads.
- Approving or reviewing work. A verdict is evidence for a person or a
  platform, never an approval.
- Submissions that span repositories.
- The forge's own pull-request flow for contributors outside the fleet.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- Repositories are git repositories, and places are git worktrees.
- Branches are named by convention, so a target is known from its name:
  the shared branch, a bolt's branch, a unit's branch, a fix's branch.
- sluice is free and open source.
- sluice is written in Rust.

The rest of the stack, which a model builds on unless it says why not:

- The task runner that declares inputs and caches by content is moon,
  with its cache shared by every place on a host.
- Places are managed by worktrunk, which runs a repository's hooks and
  tethers processes to a place.
- The drivers are crew and flywheel; the forge is GitHub.
- Records are plain JSON, kept on one host under the repository's
  common git directory until several hosts submit to one branch.
- A branch's policy is a file checked into the repository.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- When a branch's stepper stops, how long before another may advance it,
  and what tells a peer the stepper has stopped rather than gone quiet?
- How does a peer decide which candidates to run, and how many?
- Does the shared branch's gate trust a container on a host that also
  runs sessions, or only hosts that run none?
- How does a branch's policy name the executors it trusts, and how does
  a run prove which executor made it, when under peers every host
  writes the records?
- Under a central server, is a state readable only on the server
  readable "whether or not sluice is running"?
- Who releases the candidate places of a host that has stopped for
  good?
- Who sets how long a host may hold a branch, or a claim on a
  candidate's checks: the policy, the deployment or the operator?

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** Two sessions submit heads to one bolt branch. Both candidates
  pass. Both land, in order, and neither session ran a merge.
- **S2.** The second head conflicts with the first. Its session is told
  the paths before any check runs; the first lands.
- **S3.** The first candidate passes and the second fails. The second's
  session is told the failing checks; the first has landed; no other
  session hears of it.
- **S4.** The first candidate fails. Its session is told; the second
  head is formed again on the branch without it, passes, and lands
  first.
- **S6.** Two bolts whose work touches unrelated parts are submitted to
  the shared branch. The second is tested on top of the first and lands
  after it, and is not tested again when the first lands.
- **S7.** One key holds a pass and a fail from trusted executors. The
  bolt branch's policy reads it passed; the shared branch's reads it
  missing until a confined run settles it.
- **S8.** The branch is moved by hand between a candidate's verdict and
  its landing. The landing is refused and the chain is formed again on
  the new revision.
- **S9.** The shared branch tests deepest first. Three bolts are tested as
  one candidate, which fails; the two skipped candidates are tested,
  and the culprit is the one entry the rule names.
- **S10.** sluice is stopped. Every entry's state is still readable.
  Started again, it continues without running a check for any candidate
  that already has a verdict.
- **S11.** An entry lands. The branch holds a commit whose second parent
  is the session's head and which names the verdict; sluice leaves the
  session's place alone, and the session's driver releases it.
- **S12.** A submission changes the branch's policy to drop a check its
  candidate fails. The candidate is judged by the policy on the branch,
  fails, and the change to the policy lands only with a candidate that
  passes the gate as it stood.
- **S13.** Sessions on two hosts submit to one bolt's branch. Their
  entries are tested in one order, and each session reads its entry's
  state and is told its outcome on its own host.
- **S14.** The host advancing a branch stops mid-chain. Under peers
  another host continues from the records; under a central server
  nothing lands until it is back. In both, no entry is lost and no
  check that has a verdict is run again.
- **S15.** An executor stops while running a candidate's checks. The
  run has no outcome; the checks run again on another executor, and the
  candidate's verdict is read from that run.
- **S16.** Two sessions build heads that edit one file. The second asks
  for a forecast before it has finished; it is told the file and the
  first entry's work, settles it, and both candidates form without
  conflict.

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of sluice that satisfies Parts A and B: its components, the
record of an entry and of a verdict, the chain and the window, the
attribution rule, and the landing. A conformance suite whose scenarios
cite the clauses they exercise. The profiles of Part C, each passing
the suite.

<!-- ANCHOR_END: deliver -->
