# sluice — requirements
<!-- ANCHOR: preamble -->

A statement of what sluice must always do and never do, written to
admit any model that satisfies it.

The statement is in three parts. Part A is what must hold of sluice on
its own: how work is submitted to a line, ordered, tested in the
combination it will land in, attributed when it fails, and landed. Part
B is its contracts: the operations it needs across its five seams, a
place, a check, a service, a line and a driver, and the guarantee each
must give. Part C is the profiles: the ways each contract is satisfied.

Parts A and B name no mechanism: no command, file, format, field,
service or tool. One thing of the world they name freely, because
section 9 fixes it: git. Every other real tool is named only in section
9 and in Part C. A reader who has never seen a merge queue should be
able to design from Parts A and B and git alone.

## 1. Purpose

sluice admits finished work onto a line only after the line, extended by
that work and by everything ahead of it, has passed the line's gate. It
orders what is submitted, forms each candidate revision exactly as it
would land, tests candidates ahead of need, names the one submission at
fault when a candidate fails, and moves the line only to a revision that
passed. It never runs a check of its own invention, never starts a
service, never chooses a port, and never decides what a gate requires.
A session that built the work submits it and does nothing more.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **a session** (an agent or a person building in a place) | when its work is ready, and to submit it; how to resolve a conflict or a failure in its own place | merge, land, or move a line; change another submission's order; withdraw another's submission |
| **a planner** (a plan, or a person) | what a submission lands after, and its priority | override a gate; move a line |
| **a policy's author** (a repository's owners, a platform) | which checks gate each line, which executors each line trusts, how a flaky result reads, how deep a chain is tested, whether a line requires a word | make a line land untested; widen trust a layer above set |
| **the operator** | the word that admits a submission to a line requiring one; everything a policy does not settle | make a landing that skipped the gate count as one |
| **sluice** | the order among submissions within what the planner and the policy fixed; which candidates to test and how many at once; when a line moves | run a check of its own, start a service, choose a port, resolve a conflict, decide trust, or move a line to a revision that has not passed its gate |
| **an executor** (a session's shell, a confined run) | nothing; it runs checks and reports what it observed | report an outcome it did not observe |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **line**: a branch that lands work: a repository's shared line, or a
  bolt's line off it.
- **place**: a working copy prepared for one session off one line.
- **head**: the revision a place holds when its session submits.
- **submission**: one head offered to one line, with what it must land
  after, its priority and who submitted it.
- **entry**: a submission as sluice holds it, with its state.
- **after**: the entries a submission names as having to land before
  it.
- **lane**: the entries of one line whose affected parts overlap,
  transitively; entries in different lanes never share a candidate.
- **affected parts**: the parts of the repository whose checks a head
  can change the result of, as the repository's description gives
  them.
- **candidate**: a revision equal to the line's current revision
  extended, in order, by an entry and every entry ahead of it in its
  lane: the revision that entry would land as.
- **chain**: the candidates of one lane, each extending the one before.
- **window**: how many candidates of one chain are under test at once.
- **conflict**: a candidate that cannot be formed because its entry and
  the candidate before it change the same content incompatibly.
- **check**: a task run to judge a revision, ending in a pass or a
  fail.
- **gate**: for a line, the checks it requires, the executors it
  trusts, and how a flaky key reads.
- **key**: the identity of one check over the inputs it reads.
- **verdict**: a gate's reading of a candidate: for each required check
  exactly one of passed, failed, missing or flaky.
- **culprit**: the one entry a failed candidate is attributed to.
- **landing**: the line moving to a candidate that passed.
- **executor**: what ran a check, with its identity; **open** when it
  could read beyond its declared inputs, **confined** when it could
  not.
- **word**: the operator's approval that admits a submission to a line
  requiring one.
- **profile**: one way a contract of Part B is satisfied, as Part C
  describes.

<!-- ANCHOR_END: glossary -->
<!-- ANCHOR: part-a -->
## Part A. What must hold of sluice

### A.1 Submission

1. A session submits a head to a line and does nothing more: it never
   merges, never lands and never moves a line, and an attempt to is
   refused and reported.
2. A head is submitted only from a place whose tree is exactly its
   commits. A place holding anything more is refused, and what it holds
   is named.
3. A submission names what it lands after, its priority and who
   submitted it. It never names a position.
4. A line that requires a word admits a submission only with the word,
   and the word is given once: a resubmission after a failed landing's
   fix needs no new word.
5. An entry leaves sluice only by landing, by withdrawal by its
   submitter, its planner or the operator, or by a bound the line's
   policy states in advance. sluice never drops an entry on its own.

### A.2 Order

6. Entries of one lane are ordered by priority, then by the time of
   submission. An entry never lands before an entry it names as after.
7. An entry whose after-entries are neither landed nor ahead of it in
   its own chain waits, and its waiting holds no other entry.
8. Entries whose affected parts overlap are in one lane. Entries in
   different lanes never share a candidate and land in any order
   relative to each other.
9. An entry whose affected parts are unknown is in every lane of its
   line.

### A.3 Candidates and chains

10. Every candidate equals the line's current revision extended, in
    order, by exactly the entries ahead of it in its lane and itself.
    A candidate never contains an entry behind it, an entry of another
    lane, or an entry removed from the chain.
11. An entry is judged only as a candidate: never alone against a
    revision the line has left, and never in a combination it would not
    land in.
12. A conflict is found when the candidate is formed, before any check
    runs. It removes the entry from the chain and nothing else: the
    chain continues without it.
13. A chain is tested up to its window. The window never falls below
    one, grows while candidates pass and shrinks when one fails, within
    bounds the line's policy states.
14. A line's policy says whether every candidate of a chain is tested or
    the deepest first. Under deepest first, a failure is attributed only
    after the candidates that were skipped have verdicts.

### A.4 Verdicts and attribution

15. A candidate's verdict is its line's gate read over the checks the
    candidate affects. A required check whose key already holds a pass
    from an executor the gate trusts is read from that pass and not run
    again.
16. Every check run on a candidate is recorded with its key, its
    outcome, pass and fail alike, and its executor, before the verdict
    is read. A result a tool answered from an earlier run is not a run
    and is never recorded as one.
17. A failed candidate is attributed to exactly one entry: the newest
    entry of the first failed candidate in its chain.
18. No entry is attributed, landed or removed before every candidate
    ahead of it in its chain has a verdict.
19. A key holding both a pass and a fail from executors the gate trusts
    reads as the line's policy says, passed or not passed, and never
    differently for two candidates of one line.
20. The culprit's session is told the failing checks and the candidate
    they failed on. No other session is told of that failure.
21. An entry removed as culprit or as conflict leaves the chain, and
    every candidate behind it is formed again without it.

### A.5 Landing

22. A line moves only to a candidate whose verdict is satisfied, only
    in chain order, never past an entry without a verdict, and never to
    a candidate containing a culprit or a conflict.
23. A landing writes one commit per entry, naming the entry's work,
    with the revision before it as its parent. The history of a line is
    never rewritten.
24. A landing moves the line from exactly the revision its candidate
    was formed on. A landing that finds the line elsewhere is refused,
    and the chain is formed again on the revision found.
25. An entry that landed releases its place. A place holding more than
    its commits is kept and named rather than removed.
26. Every state an entry is in, and every verdict read for it, is
    readable by its session, its planner and the operator whether or
    not sluice is running.

### A.6 Gates and trust

27. A line's gate is its policy's: the checks it requires, the
    executors it trusts, how a flaky key reads, whether every candidate
    or the deepest first is tested, the window's bounds, and whether a
    word is required. sluice gives no gate a meaning of its own.
28. A result from an executor the line's gate does not trust never
    satisfies that gate, whatever its outcome.
29. A gate that trusts only confined executors is satisfied by no open
    run.
30. sluice never runs a check of its own and never changes what a gate
    requires.

### A.7 Places and services

31. sluice starts no service and chooses no port. What a candidate's
    checks need is brought up by the repository's own declaration, in
    the candidate's place, with what it serves derived from that place.
32. A candidate's place belongs to the candidate: nothing started in it
    outlives it, and two places on one host never collide.

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The place

33. **materialize**: given a revision, a place holding exactly that
    revision, with the environment the repository declares.
34. **release**: given a place, its removal, with everything started in
    it ended (32).
35. The guarantee: a place holds what it was given and nothing of any
    other place.

### B.2 The check

36. **affected**: given the line's revision and a candidate, the checks
    the candidate can change the result of (8, 15).
37. **run**: given a place and checks, for each check its key, its
    outcome, its executor and whether the outcome was observed in this
    run or read from an earlier one (16).
38. The guarantee: an outcome is what the executor observed, never
    inferred; a replay says it is a replay.

### B.3 The service

39. **up**: given a place, everything its checks need brought up in it,
    reachable at endpoints derived from the place (31).
40. **down**: given a place, everything up started, ended.
41. The guarantee: two places on one host never share an endpoint (32).

### B.4 The line

42. **read**: given a line, its current revision.
43. **form**: given a revision and a head, the candidate revision, or
    the conflict with the content it is on (12).
44. **commit**: given a candidate, its parent and the entry's work, one
    commit (23).
45. **move**: given a line, the revision it is expected at and the
    revision to move to, the move or a refusal because the line was
    elsewhere (24).
46. The guarantee: a move is all or nothing, and two moves of one line
    from one expected revision never both succeed.

### B.5 The driver

47. **submit**: given a head, a line, the after-entries, a priority, a
    submitter and, where required, the word, an entry (1, 3, 4).
48. **withdraw**: given an entry and who asks, its removal where 5
    allows it.
49. **state**: given an entry, its state and the verdicts read for it
    (26).
50. **notify**: given an entry's session and an outcome, the outcome
    delivered to that session and no other (20).
51. The guarantee: a notification reaches the submitter, and a state
    read with sluice stopped is the state sluice last wrote.

### B.6 Binding the contracts

52. Each seam is bound by naming one profile of Part C, and Parts A and
    B do not change to admit a profile.
53. An entry's records and a candidate's verdicts have one form whatever
    profile wrote them, so a reader of one profile's records reads
    another's.

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile.

### C.1 The place

| profile | materialize | release |
|---|---|---|
| **archive**: the revision exported into a scratch directory, the environment from the worktree environment cache | `git archive` of the candidate into a directory under the host's scratch, entered through wtenv | the directory removed; processes tethered to it end |
| **worktree**: a detached worktree of the repository | `git worktree add --detach`, the repository's start hooks run by worktrunk | `git worktree remove`; worktrunk's pre-remove hooks end what the place started |

### C.2 The check

| profile | affected | run |
|---|---|---|
| **moon**: the repository's task runner with declared inputs and a content-keyed cache | moon's affected projects between the line's revision and the candidate, downstream dependents included | moon's run of the affected check tasks in the place; the run report gives each task's outcome and whether it was replayed, the run record gives its hash as the key and its exit code |
| **script**: one command with an exit code | every check, always | the command's exit code, never a replay |

### C.3 The service

| profile | up | down |
|---|---|---|
| **declared services**: the repository's own declaration of what listens, how it starts in a place and what it serves (flywheel-next 47) | the declaration's start command run in the place; the repository derives ports from the place's path | the declaration's stop command; what worktrunk tethers ends with the place |

### C.4 The line

| profile | read / form / commit / move |
|---|---|
| **local refs**: one host's repository | `git rev-parse`; `git merge-tree --write-tree`; `git commit-tree`; `git update-ref` with the expected old value |
| **pushed refs**: several hosts over the repository's remote | entries as refs under a namespace of sluice's own, leased by compare-and-swap on a ref; the landing is a push the remote accepts only from the expected revision |

### C.5 The driver

| profile | submit / withdraw / state / notify |
|---|---|
| **worktrunk**: a custom subcommand on the path | `wt submit`, running the repository's submit gate hooks first; `wt submit --withdraw`; `wt submit --status`; the session's pane prompted through the multiplexer |
| **crew**: a bolt team's stages | the unit's merge stage submits; the conductor reads the entry's state as the stage; a red or a conflict re-charges the unit's slot |
| **flywheel**: the machinery's effects | a session's done exit is the submission; the entry's state is evidence; the word is the rail's response |

### C.6 Records

Entries and verdicts are files under the repository's common git
directory, one directory per line, readable by every place on the host
with no process running (26), in the record form the host's other
verifications already use.

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** Nothing lands untested in the combination it lands in (10,
  11, 22).
- **I2.** A session never moves a line (1).
- **I3.** Every failure has exactly one culprit, named only once
  everything ahead of it is known (17, 18).
- **I4.** A line never moves past what passed, and never from a revision
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
- Deciding policy: which checks gate a line, whom to trust, how flaky
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
- Lines are named by convention, so a target is known from its name:
  the shared line, a bolt's line, a unit's line, a fix's line.
- sluice is free and open source.

The rest of the stack, which a model builds on unless it says why not:

- The task runner that declares inputs and caches by content is moon,
  with its cache shared by every place on a host.
- Places are managed by worktrunk, which runs a repository's hooks and
  tethers processes to a place.
- The drivers are crew and flywheel; the forge is GitHub.
- Records are plain files under the repository's common git directory,
  in the form the host's other verifications already write.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- Within a lane, is order by submission time enough, or should an
  entry's expected pass likelihood move it?
- What bounds the retries of an entry that conflicts again after a
  rebase, and who is told at the bound?
- Does a line's most expensive verification gate the line, or the
  channel promoted from it?
- Does a lane's affected set always include downstream dependents, or
  does the policy say?
- Where do entries live when several hosts submit to one line, and who
  leases a chain?

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** Two sessions submit heads to one bolt line. Both candidates
  pass. Both land, in order, and neither session ran a merge.
- **S2.** The second head conflicts with the first. Its session is told
  the paths before any check runs; the first lands.
- **S3.** The first candidate passes and the second fails. The second's
  session is told the failing checks; the first has landed; no other
  session hears of it.
- **S4.** The first candidate fails. Its session is told; the second
  head is formed again on the line without it, passes, and lands
  first.
- **S5.** A shared line requires a word. A submission waits for it,
  lands on green with no second word, and after a failed landing its
  fix resubmits with no new word.
- **S6.** Two bolts with disjoint affected parts are submitted to the
  shared line. Neither is tested with the other, and they land in
  either order.
- **S7.** One key holds a pass and a fail from trusted executors. The
  bolt line's policy reads it passed; the shared line's reads it
  missing until a confined run settles it.
- **S8.** The line is moved by hand between a candidate's verdict and
  its landing. The landing is refused and the chain is formed again on
  the new revision.
- **S9.** The shared line tests deepest first. Three bolts are tested as
  one candidate, which fails; the two skipped candidates are tested,
  and the culprit is the one entry the rule names.
- **S10.** sluice is stopped. Every entry's state is still readable.
  Started again, it continues without running a check for any candidate
  that already has a verdict.

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of sluice that satisfies Parts A and B: its components, the
record of an entry and of a verdict, the chain and the window, the
attribution rule, and the landing. A conformance suite whose scenarios
cite the clauses they exercise. The profiles of Part C, each passing
the suite.

<!-- ANCHOR_END: deliver -->
