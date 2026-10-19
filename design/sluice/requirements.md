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
| **a planner** (a plan, or a person) | what a submission lands after, and its priority; to ask sluice to make or remove a branch it lands on (104, 105) | override a gate; move a branch |
| **a policy's author** (a repository's owners, a platform) | which checks gate each branch, which signers each branch trusts and what each may claim, the systems each check must pass on, how a flaky result reads, how deep a chain is tested, how long a candidate's checks may run, what a run may use and reach | make a branch land untested; widen trust a layer above set |
| **the operator** | everything a policy does not settle | make a landing that skipped the gate count as one |
| **sluice** | the order among submissions within what the planner and the policy fixed; which candidates to test and how many at once; when a branch moves | run a check of its own, start a service, choose a port, resolve a conflict, decide trust, release a session's place, move a branch to a revision that has not passed its gate, or remove a branch whose work has not landed into another (105) |
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
- **gate**: for a branch, the checks it requires, the signers it
  trusts, the systems each check needs, and how a flaky key reads.
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
108. A result a tool answered from an earlier run counts for a gate only
     when a signer the gate trusts has signed a pass for the same key on
     the same system (15, 16). What the tool's cache holds supplies
     outputs and decides nothing.
17. A failed candidate is attributed to exactly one entry: the newest
    entry of the first failed candidate in its chain.
18. No entry is attributed or landed before every candidate ahead of it
    in its chain has a verdict. A conflict removes its entry when it is
    found (12).
69. A check's result belongs to its key and its system, not to a branch:
    a pass recorded under a key on a system satisfies every branch whose
    gate trusts the signer that signed it and requires that system.
85. A run record names the system its run executed on: one check on two
    systems is two results (69).
70. When the branch's revision is covered by no verdict, every check its
    gate requires is affected by the next candidate.
19. A key holding both a pass and a fail from executors the gate trusts,
    each held to the same limits, reads as the branch's policy says:
    passed or not passed. It never reads differently for two candidates
    of one branch. A result under other limits says nothing of a run under
    these (83).
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
    signers it trusts and the claims each may make, the systems each
    check must pass on, how a flaky key reads, whether every candidate
    or the deepest first is tested, the window's bounds, and how long a
    candidate's checks may run. sluice gives no gate a meaning of its
    own, and admits every submission a driver makes: whether work may be
    submitted at all is decided before it reaches sluice.
28. A run no signer the branch's gate trusts has signed never satisfies
    that gate, whatever its outcome.
29. A gate that trusts only confined runs is satisfied by no run whose
    signer may not claim confinement.
78. A run counts for a gate only when a signer the branch's policy names
    has signed its record, in a way every host verifies from the records
    alone. A run no signer the policy names has signed is from an
    executor the gate does not trust (28). On a branch whose records are
    one host's own files, the runs that host's sluice starts count
    unsigned, as that host's.
79. An executor's kind, whether its run was confined, and its system are
    claims in the signed record. A claim counts only when the signer is
    one the policy allows to make it; a run is read as confined only
    when its record claims it and its signer may (29). Confinement is
    never inferred: that a signer's runs are reachable by no session is
    the policy author's to assert, never sluice's to decide.
109. A signer's run records are written only by that signer and only
     added to. One signer's write never refuses another's, and never
     waits on the branch's records (62).
86. A branch's gate names, for each check it requires, the systems a
    pass must come from. A candidate's verdict is read over every
    required check on every system named (15), and a pass on one system
    never stands for another. A check for which the gate names no system
    takes a pass from any one system.
112. Which runs count for a submission, and so where its checks run, is
     the branch's gate's (27). A submission never chooses an executor,
     and a session's own runs count only on a branch whose gate trusts
     the signer of the session's host.
113. A run on a pull request's head, by an executor the branch's gate
     trusts, is recorded under its keys and systems as any run is, and a
     candidate whose key it shares reads it (15) without running it
     again.
30. sluice never runs a check of its own and never changes what a gate
    requires.
55. A check's cost never changes how it gates: every check a branch's gate
    requires has a verdict before the branch moves, and none is deferred
    past a landing.
56. A branch's gate is read from the branch's current revision, never from a
    candidate or a place. No submission changes the gate it is judged
    by.

### A.7 Places

31. sluice starts no service. What a candidate's checks need, the
    checks bring up themselves, in the candidate's place. sluice gives
    the place a port for each name its branch's policy lists. Each stays
    the same for the place's whole life, belongs to no other place alive
    on the host, and is free when the checks receive it.
32. A candidate's place belongs to the candidate: nothing started in it
    outlives it, what its checks hand to another process to keep
    included, and two places on one host never collide.
66. A candidate's checks run under the time limit its branch's policy
    states. A run that exceeds it is ended with everything it started,
    recorded as timed out, and read as failed.
81. An instance takes no claim while a place it made on its host
    belongs to a candidate that has a verdict or is obsolete, or to a
    claim it no longer holds (25, 34). A place on a host that never
    returns is the operator's to remove, and no verdict is ever read
    from it (32).

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
72. An instance keeps a branch only by writing its records. Once the
    deployment's lease has passed with no write of that instance, any
    instance may take the branch; taking it is a write (62), after which
    the former lead writes nothing more for the branch (58).
73. Taking a branch needs no knowledge of the former lead: one that
    stopped and one that was quiet for a lease are treated alike, and
    the lease is measured by the taker's own observation of the
    records, never by the hosts' clocks agreeing.
74. The lease on a branch and the bound on an executor's sign of life are
    the deployment's, one value each for every branch it serves, never a
    branch's policy's. A branch's policy bounds only how long a candidate's
    checks may run (66), and a claim never lapses for the length of its
    run alone.
75. A run is taken only by a claim written to the branch's records, by
    any instance with room under its own bound (71), or by a pool's job
    whose start is its claim (88). The lead opens candidates within the
    window (13) and assigns them to no one.
76. An instance never claims a later open candidate of a chain while an
    earlier open candidate of that chain is unclaimed.
77. A claim lapses when its holder has shown no sign of life for the
    deployment's bound (74). A lapsed claim's run has no outcome (60),
    and a report under a claim its reporter no longer holds is never
    written.
107. The lead starts a run on a pool only when no live instance able to
     take it has room by its last sign of life (77): one of the run's
     system (87), signed by a signer the gate trusts (78). Among pools,
     the policy's order decides.
87. A run is taken only by an executor that is the system the run
    requires. A run whose system no live executor or pool is stays open,
    and the candidate's time limit (66) reads the candidate as not
    passed.
88. An executor is standing, taking runs by its own claims (75), or
    launched on a pool by the instance that opened the run, in which
    case its job's start is its claim and its end its report, and a job
    its pool loses is a lapsed claim (77). Which machine a launched run
    goes to is the pool's, never the instance's.
80. When more than one host submits to a branch, every state an entry has
    been in and every verdict read for it is readable from each of those
    hosts while any other of them is unreachable, as the records were
    last written (26).
82. From the moment an entry is written until it leaves sluice, its head
    is fetchable by every host that may run its checks or advance its
    branch; and a candidate is open to claims only while its revision is
    fetchable by every host that may claim it.
111. Once a submission is written to a branch's records, it reaches its
     outcome with no host of its submitter running, whenever the
     deployment has an instance able to advance the branch and an
     executor or pool for every run its gate requires. An instance that
     writes work no live instance will take wakes a pool or a peer by
     the means its deployment names; a wake that is lost delays the work
     and loses nothing (59).

### A.9 Branches

104. The operator or a planner may ask sluice to make a branch it
     will land on, from another branch it lands on. sluice makes it at
     the other branch's current revision, by a move from absent (45),
     when the policy at that revision gives the new branch a gate (56)
     and the new branch's records hold no entry still waiting, under
     test or landing. A branch already present is refused, and so is
     one that policy does not name.
105. The operator or a planner may ask sluice to remove a branch it
     lands on, naming the branch the removed branch's work landed
     into. sluice removes it by a move to absent (45) from the revision
     it read, only when no entry on it is waiting, under test or
     landing, no landing on it is left unrecorded (S9), and that
     revision is contained in the named branch's current revision. Its
     records stay.
106. Making and removing a branch is not landing: neither writes a
     commit, records a verdict or reads a gate's checks, and 22 to 24
     bind neither. A refused one is reported, never retried blind. A
     branch sluice lands on is made and removed only as 104 and 105
     say, and the branch's protection (1) refuses anyone else's.

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The place

33. **materialize**: given a revision, a place holding exactly that
    revision, with the environment the repository declares and the
    ports its policy names (31).
34. **release**: given a place sluice made, its removal, with everything
    started in it ended, what its checks handed to another process to
    keep included (25, 32).
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
    to (the cores its instance gives each run; the memory, the
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
45. **move**: given a branch, the revision it is expected at or that
    it is absent, and the revision to move to or its removal, the move
    or a refusal because the branch was elsewhere (24, 104, 105).
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
| **git worktree**: a detached worktree, nothing run in it | `git worktree add --detach` at the candidate; a block of ports held for the place on the host, each checked free | the checks' process group ended; the policy's release command run in the place under the checks' executor, removing what the checks handed to another process, a container engine's containers above all; `git worktree remove`; the ports let go |
| **container**: a clean checkout of the candidate in a container on the executing host | the candidate fetched into the host's mirror of the repository; a detached worktree of it under the sluice user's scratch; a container from the image the repository's policy names, read from the branch's revision (56), with the worktree as its checkout, the mirror read-only, a scratch directory, `SLUICE_CHECKOUT` and `SLUICE_TMP`, and nothing of any session mounted; the run as the container's one process under the branch's time limit (66) | the run's records and the failing checks' output written first (16), then the container stopped and removed with everything started in it, and the worktree removed |

### C.2 The check

| profile | affected | run |
|---|---|---|
| **moon**: the repository's task runner with declared inputs and a content-keyed cache | moon's affected projects between the branch's revision and the candidate, downstream dependents included | moon's run of the affected check tasks in the place; the run report gives each task's outcome and whether it was replayed, the run record gives its hash as the key and its exit code |
| **script**: one command with an exit code | every check, always | the command's exit code, never a replay |

| executor profile | execute | enforces |
|---|---|---|
| **open**: a process group on the instance's host | the command in the place, as one process group ended with its run | the cores given, by the runner's own threads; nothing else; never confined |
| **sandbox**: the host's kernel sandbox, Seatbelt on macOS, bubblewrap and Landlock on Linux | the command in the place under a profile that allows writes only to the place and its scratch, the network only as the policy says, and a container engine's socket only when the policy allows it | paths and network everywhere; cores and memory only on Linux, by a cgroup the run is started in; confined when no session on the host can write the place and the run cannot reach a container engine, whose containers may mount any path |
| **container**: a container engine on the executing host | the place mounted into a new container from the repository's image | cores, memory, paths and network; confined as C.8 says |
| **launched**: a job on a pool | one job per run, on a machine of the run's system (87), that fetches the candidate's ref (82), runs the checks, signs its run records with the job's identity and adds them to its signer's ref (109); the job's start is the claim and its end the report (88) | what the pool's machines enforce, as the job's signed record claims; confined when the pool gives each job a fresh machine and the policy lets its signer claim it (79) |

### C.4 The branch

| profile | read / form / commit / move |
|---|---|
| **local refs**: one host's repository | `git rev-parse`; `git merge-tree --write-tree`; `git commit-tree` with the branch and the head as parents and the verdict as `Sluice-*` trailers; `git update-ref` with the expected old value; making a branch `git update-ref <branch> <rev> ""`, removing one `git update-ref -d <branch> <expected>` (104, 105); branch protection by a `reference-transaction` hook that refuses any update to a branch in the policy not made by sluice, and logs it (1) |
| **pushed refs**: a branch on a remote every host reaches | `git fetch` then `git rev-parse` of the remote's branch; forming and committing as local refs, on the host advancing the branch; the landing a push with `--force-with-lease=<branch>:<expected>`; making a branch a push leased on its absence, `--force-with-lease=<branch>:`, removing one a `--delete` leased on its revision (104, 105); branch protection by the forge's rules, restricting creating, updating and deleting the branch, which only sluice's identity bypasses, an identity no session on any host can use (1) |

### C.5 The driver

| profile | submit / withdraw / state / notify / forecast |
|---|---|
| **worktrunk**: a custom subcommand on the path | `wt submit`, the executable `wt-submit` on the path, waiting for the entry's outcome, which it reports as its exit, or with `--no-wait` returning the entry at once; `wt submit --withdraw`; `wt submit --status`; the outcome of a waiting submit is its exit, of any other the session's pane prompted through the multiplexer; on landing, worktrunk removes the session's place; `wt submit --check`, the same forming as a submission with no entry written |
| **crew**: a bolt team's stages | the unit's merge stage submits, and a bolt is submitted from its own place by its conductor; `sluice amend` sets an After the conductor adds; the conductor reads the entry's state as the stage; a red or a conflict re-charges the unit's slot; the conductor's wait runs a forecast for each unit in code and tells the unit's agent of a conflict when it is idle |
| **flywheel**: the machinery's effects | a session's done exit, once approved, is the submission; the entry's state is evidence; a forecast is evidence on the item, read each tick |
| **branch**: `sluice branch` | not a session's: `sluice branch create <branch> --from <branch>` makes a branch at the other's current revision and prints it (104); `sluice branch delete <branch> --into <branch>` removes it, `main` when `--into` is omitted (105); each exits 0 when done, 1 when a branch it names does not exist, and 2 on a refusal, naming it |
| **remote submit**: a session on any host | the head pushed to `refs/sluice/heads/<oid>` on the shared remote and the entry written to the branch's records (C.6 remote refs), then a wake (111); withdrawal, amend, state and the forecast the same way; a waiting `wt submit` reads its entry's state, and that read is the delivery (51); it runs rounds only on a host that holds the branch's credential, which no session's host does (C.8); its host stopping loses nothing, and a `--no-wait` submission is prompted by whichever instance on the submitter's host next reads it |

### C.6 The records

Whatever binds them, the records are one JSON document per entry and
one JSON Lines log of check runs and verdicts per branch (53), and what
outlives them is the trailers each landing commit carries (23).

| profile | read / write |
|---|---|
| **local files**: one host | the documents under the repository's common git directory, one directory per branch and one log of check results per repository (69), readable by every place on the host with no process running, never tracked and never pushed, a version kept beside them; a write under the branch's lock, refused when the version moved |
| **remote refs**: peers, for a branch with a `remote` whose policy names signers | one root commit under `refs/sluice/state/<branch>` on the shared remote, its tree the branch's documents (53), its id the version; a write a push with `--force-with-lease` from the commit read, by any instance that submits to or advances the branch; beside it `refs/sluice/runs/<signer>`, each signer's signed run records, added to only by that signer (109); `refs/sluice/heads/<oid>` for every submitted head; `refs/sluice/combinations/<branch>/<id>` for every candidate open to claims; `refs/sluice/logs/<branch>/<run>` for a run's output; and `refs/sluice/hosts/<host>`, rewritten by each host alone on a fixed cadence as its sign of life and its free room (77, 107) |

A run record on a signer's ref is an in-toto statement in a DSSE
envelope: its subject the check's key and system, its predicate the
outcome, the claims of 79, the candidate, the claim and the time. Each
signer computes the keys it signs from the candidate itself. A job on a
forge signs it keylessly with the job's workload identity; any other
signer signs it with an SSH key whose public half the policy lists.
Since any instance may write the branch's state, a landing reads its
verdict again from the signed run records before it moves the branch.

### C.7 Policy

A branch's policy is a TOML file checked into the repository, one table
per pattern of branch names, read from the branch's revision (56). It
names signers, systems and pools beside the branches. The whole of one
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

### C.8 Deployments across hosts

sluice runs on many hosts only as peers: a choice of profiles, never a
change to Parts A and B.

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

These are not requirements. None stands open: every question this
section asked is answered by a clause.

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
- **S14.** The host advancing a branch stops mid-chain. Another
  instance takes the branch after a lease and continues from the
  records; no entry is lost and no check that has a verdict is run
  again.
- **S15.** An executor stops while running a candidate's checks. The
  run has no outcome; the checks run again on another executor, and the
  candidate's verdict is read from that run.
- **S16.** Two sessions build heads that edit one file. The second asks
  for a forecast before it has finished; it is told the file and the
  first entry's work, settles it, and both candidates form without
  conflict.
- **S17.** The lead of a branch goes quiet while alive, with a landing
  intent written. Another instance takes the branch after a lease; the
  former's next write is refused and it advances the branch no more. The
  landing lands exactly once, by whichever instance's move the branch
  accepts, and both read the same result.
- **S18.** A host writes a run record claiming a confined executor,
  signed by a key the shared branch's policy does not name. The shared
  branch reads the key as missing until a run its signers signed settles
  it; a bolt's branch that trusts the sessions' signer reads the run as
  it says, unconfined.
- **S19.** A session submits to the shared branch and its host stops.
  A standing executor's instance takes the branch, the forge's pool runs
  the check on the one system no standing executor is, and the
  submission lands. Its session learns the outcome when its host returns.
- **S20.** A host stops mid-run and returns after its claim lapsed and
  the checks were run elsewhere. It releases the places it left before it
  claims again, and writes no outcome for the lapsed run.
- **S36.** A planner asks for `bolt/x` from `main` at M. sluice makes
  `bolt/x` at M. A second ask is refused because `bolt/x` is present. On
  another host, an ask made at the same time finds the remote's branch present and is
  refused (46).
- **S37.** A planner asks to remove `bolt/x` into `main` while an entry
  is under test on it. The removal is refused, naming the entry. Once the
  bolt's revision is landed on `main`, the removal succeeds and the
  branch's records still read.
- **S38.** A removal reads `bolt/x` at R. Another host lands on `bolt/x`
  before the removal reaches the remote. The removal is refused because
  the branch is elsewhere, and the landing stands.
- **S39.** A planner asks to remove `bolt/x` into `main`, but `bolt/x`'s
  revision was never landed on `main`. The removal is refused, saying so.
- **S40.** A pull request's head passes `cli:build` on three systems on
  the forge's pool before it is ready. It is submitted with one entry
  ahead that changes no input of `cli:build`. The candidate reads the
  three passes by key (113) and runs only the checks the entry ahead
  changes.
- **S41.** A run needs `linux-x64` and the box has room: the box claims
  it and no job starts. The box is full: the lead starts the run on the
  forge's pool (107).
- **S42.** The task runner replays a check from its cache, and no signer
  the gate trusts has signed a pass for that key on that system. The
  replay counts for nothing and the check runs (108).

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of sluice that satisfies Parts A and B: its components, the
record of an entry and of a verdict, the chain and the window, the
attribution rule, and the landing. A conformance suite whose scenarios
cite the clauses they exercise. The profiles of Part C, each passing
the suite.

<!-- ANCHOR_END: deliver -->
