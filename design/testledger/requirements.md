# testledger — requirements
<!-- ANCHOR: preamble -->

A statement of what testledger must always do and never do, written to
admit any model that satisfies it.

The statement is in three parts. Part A is what must hold of testledger
on its own: how a check's result is keyed, recorded, reused, and read
at a gate. Part B is its contracts: the operations it needs across its
four seams, a workspace description, a result store, an executor and a
signer, and the guarantee each must give. Part C is the profiles: the
ways each contract is satisfied.

Parts A and B name no mechanism: no command, file, format, field,
service or tool. One thing of the world they do name freely, because
section 9 fixes it: git. Every other real tool is named only in section
9 and in Part C. A reader who has never seen a CI system should be able
to design from Parts A and B and git alone.

## 1. Purpose

testledger records whether a check passed on exactly the inputs it
read, so that a pass proven once is never proven again for the same
inputs, wherever it was proven: in one of a hundred agent worktrees, on
a developer's machine, or on a build server. A gate, the point at which
work may merge or become a version, asks testledger whether what it
requires has already passed, and runs only what has not. testledger
records verdicts and their evidence. It never builds, never stores what
a check produced, and never decides on its own what may be trusted.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **a policy's author** (a platform, a repository's owners) | which checks each gate requires, and which executors each gate trusts | a later layer of policy may never remove a requirement or widen trust an earlier layer set |
| **an executor** (an agent's shell, a sealed engine, a build server) | nothing; it runs a check and reports what happened | it never reports an outcome it did not observe |
| **a gate** (a merge, a version, a promotion) | whether to proceed, from the verdict | it never treats a missing or untrusted result as a pass |
| **testledger** | what to record and what a key is, as this statement fixes them | it never runs a check of its own accord, never deletes a fail, never decides trust |
| **the operator** | everything a policy does not settle | |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **check**: a task run to judge a repository state, ending in a pass or
  a fail.
- **definition**: everything that says what a check runs, as distinct
  from what it reads.
- **inputs digest**: the fingerprint of everything a check reads in the
  repository, with its assurance, as the workspace description gives
  it.
- **toolchain**: the tools and their versions a check runs with.
- **envelope**: everything outside the repository and the toolchain that
  a check runs against, such as an emulator, a deployed artifact or a
  stand-in for a vendor. A check with none has an empty envelope.
- **key**: the identity of one check over one set of inputs, toolchain
  and envelope.
- **outcome**: pass, fail, or error (the check could not reach a
  verdict).
- **executor**: what ran a check, with its identity.
- **confinement**: whether a run could read only its declared inputs.
  A **confined** run could read nothing else; an **open** run could.
- **evidence**: what a run leaves for a reader to inspect: its log, its
  test report.
- **record**: one run of one check: its key and the parts of it, the
  outcome, the executor and its confinement, the repository state it
  ran on, and its evidence.
- **ledger**: every record a reader can read.
- **gate**: a named point that proceeds only when a policy is satisfied.
- **policy**: for each gate, the checks it requires and the executors it
  trusts.
- **verdict**: a gate's reading of the ledger under its policy.
- **flaky**: a key holding both a pass and a fail from executors the
  reader trusts.
- **profile**: one way a contract of Part B is satisfied, as Part C
  describes.

<!-- ANCHOR_END: glossary -->
<!-- ANCHOR: part-a -->
## Part A. What testledger keeps

### A.1 Keys

1. A key is derived from exactly four parts: the check's definition, its
   inputs digest, its toolchain and its envelope. Nothing else enters
   it: not the executor, the time, the branch, the commit, or who
   asked.
2. Equal parts always give the same key, and any difference in any part
   gives a different key.
3. How a key is derived is published with fixed examples, and any party
   holding the four parts can derive the key without testledger.
4. A check whose inputs digest is unknown has no key. Its result is
   recorded against the repository state alone and is never reused.
5. A check whose envelope cannot be fingerprinted, one that reads a
   world no digest describes, has no key, and its result is never
   reused.

### A.2 Records

6. Every run made through testledger is recorded, a fail and an error
   exactly as a pass.
7. A record never changes once written, and no record is ever removed
   except by a retention rule its store declares in advance, which
   treats a fail and a pass alike.
8. A fail or an error carries the reason the check gave, in its own
   words.
9. A record's outcome is what the executor observed, never inferred
   from elapsed time or from the absence of a report.
10. A record states its executor's confinement, and a run is recorded as
    confined only when its executor established that it could read
    nothing but its inputs.
11. A reader can establish who wrote a record, or that it cannot. A
    record nobody vouches for says so.
12. testledger keeps verdicts and evidence and never the outputs a check
    produced.

### A.3 Reuse

13. A pass is reused only for a key equal in all four parts.
14. Whether a record may be reused is decided by the reader, under its
    policy, at the moment of reading, never when the record is written.
15. Reusing a result writes nothing and changes no record.
16. A key that is flaky for a reader is never read by that reader as a
    pass.

16a. A policy may state, for a gate, that a key flaky only among open
    runs is read by that gate from confined runs alone: passed where a
    confined run passed and none failed, missing where none ran.

16b. A key on which confined runs disagree is read as a pass by no gate
    under any policy, for as long as those records stand.

### A.4 Gates

17. A verdict is a function of the gate's policy and the ledger the gate
    can read, and reading one runs nothing.
18. A verdict states, for every check the policy requires, exactly one
    of passed, failed, missing or flaky, and is satisfied only when
    every required check passed.
19. A record from an executor the gate does not trust never satisfies
    that gate, whatever its outcome.
20. Policies compose in layers. A later layer may add requirements and
    narrow trust; it never removes a requirement or widens trust an
    earlier layer set.
21. Running what a verdict found missing records each run (6), and the
    gate's next verdict reads those records like any other.

### A.5 Explanation

22. For any two keys of one check, testledger can say which of the four
    parts differ, and for the inputs digest, which inputs.

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The workspace description

23. **list-checks**: given a repository state, the checks it offers.
24. **digest-inputs**: given a check, its inputs digest with its
    assurance, or unknown.

24a. **name-inputs**: given a check, the inputs its digest covers, each
    with the fingerprint of its content.

25. **invocation**: given a check, what runs it.
26. Every answer is the same for the same repository state, and
    distinguishes unknown from refused (4).

### B.2 The result store

27. **put**: write a record. Writing the same record twice leaves one.
28. **get**: given a key, every record under it.
29. **find**: given a repository state, every record that ran on it.
30. **put-evidence** and **get-evidence**: evidence, addressed by its
    content.
31. A store never alters or drops a record outside its declared
    retention (7), and concurrent writers never lose one another's
    records.
32. A writer reads back every record it wrote.

### B.3 The executor

33. **run**: given an invocation, its inputs and its envelope, the
    outcome, the evidence, the executor's identity and the run's
    confinement.
34. An executor claims confinement only for a run it confined (10).

### B.4 The signer

35. **sign** and **verify**: a record vouched for by an identity, and a
    reader's check of that.
36. A record whose signature fails to verify is read as vouched for by
    nobody, never as absent.

### B.5 Binding the contracts

37. Each seam is bound by naming one profile of Part C, and any number
    of stores may be read at once while one is written.
38. A record written through one profile reads the same through any
    other profile of the same seam.
39. A record has one format whatever store holds it; stores differ only in
    how they carry it.
40. A result is always kept where its key is kept: a store that holds a
    result holds the key it is filed under.

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile.

### C.1 Workspace description: pinout

| operation | how pinout satisfies it |
|---|---|
| list-checks | pinout's tasks; which tasks are checks is the policy's to say |
| digest-inputs | pinout's digest and assurance, unknown passed through unchanged |
| name-inputs | the inputs pinout names for its digest, with the digest of each |
| invocation | pinout's invocation |

### C.2 Records: OCI artifacts

Every record is made of OCI blobs and manifests, whichever store holds it
(39).

- **The inputs manifest.** One OCI manifest whose layers are group blobs,
  one per part of the key: definition, inputs, toolchain and envelope,
  sorted by group. A group blob holds paths and hashes, never source:
  repository-relative POSIX paths in Unicode NFC with the digest of each.
  The inputs group is the list pinout names for its digest (24a), and
  testledger hashes no file of the repository itself.
  The toolchain group names the environment image's digest. The config
  descriptor is the fixed empty descriptor, and every media type is
  versioned. Nothing about a run is in it: no timestamp, host or worktree
  path. An inputs manifest whose envelope names an artifact the check runs
  against carries that artifact as its own subject, so a reader of the
  artifact's referrers reaches each result through the inputs manifest.
- **The key** is the sha256 of the inputs manifest's canonical bytes, its
  JSON canonicalized by RFC 8785 (JCS) (1, 2, 3).
- **A result** is an OCI manifest whose subject is the inputs manifest. Its
  signed layer is a DSSE envelope holding an in-toto Statement whose
  subject is the key and whose predicate carries the rest of the record
  under a published predicate type. Its annotations (outcome, executor)
  are unsigned and serve only to filter; a gate that must be sure, such as
  a version or a deploy, verifies the DSSE layer (11, 36).
- **A result with no key** (4, 5) has no subject. It is filed by the
  repository state it ran on and under no key.
- **Evidence** (a log, a test report) is a blob of the result, by digest.
- **Signing** is sigstore's keyless signing where the executor has a
  workload identity, and a local key otherwise; an unsigned result is read
  as vouched for by nobody (11).

### C.3 Executors

| executor | confinement |
|---|---|
| **shell**: the check run in the asker's own environment | open |
| **container engine**, such as Dagger: a container given only the inputs pinout names | confined |

### C.4 Result stores

A referrer lives in the same repository as its subject, so a result sits
beside its inputs manifest, and an inputs manifest that names an artifact
as its subject sits, with every result under it, beside that artifact
(40).

| store | layout | put / get / find | retention |
|---|---|---|---|
| **OCI image layout on a filesystem**: the repository's common git directory, read by every checkout on the machine | blobs by digest; each result under `keys/<key>/results/<digest>`, a referrers convention | files; an index by commit | the operator's, by age, a key with its results |
| **git**: the repository's own remote | the filesystem profile's layout as git objects under a ref namespace of its own, one ref per writer, so no writer updates another's ref | put writes the local layout and a push carries it; get and find read the refs a fetch brought | a writer's ref is dropped once a longer-lived store holds its records, or by age |
| **OCI image layout in object storage**: an HTTP or S3-compatible bucket | the same layout under a prefix per repository | objects; an index by commit under the same prefix answers find, and a reader that keeps its own index of the bucket's object events may answer from that instead | stated per prefix; no rule expires an untagged manifest |
| **OCI registry service**: ECR, GHCR, Harbor | a repository per source repository | push and pull; the referrers API, or the specification's fallback `sha256-<hex>` tag per key where a registry lacks it | a rule that expires untagged manifests would orphan keys, so each key carries a tag or the repository is exempt |
| **Archivista** | its attestation store, holding the DSSE envelopes | queried by subject | its own |

The git profile is what carries a checkout's records to a server: they
travel with the push that carries the work. A gate counts them only where
its policy trusts their executors (19), so a gate that trusts confined
executors alone reads none of an open shell's (S4).

The registry-service profile is the general one, for deployers that admit
by OCI referrers. A reader that keeps its own index of a store needs
neither a registry service nor the referrers API.

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** A pass is never read for a key that differs in any part (2,
  13).
- **I2.** Nothing written is altered, and a fail is never lost (7, 31).
- **I3.** Reading a verdict runs nothing and writes nothing (15, 17).
- **I4.** Trust is the reader's, decided at reading, and never widened
  by a later layer (14, 19, 20).
- **I5.** testledger never holds what a check produced (12).

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Caching build outputs, or executing builds.
- Describing a repository's projects and inputs. That is pinout's.
- Scheduling checks, triggering pipelines, or hosting runners.
- Approving or promoting work. A gate's verdict is evidence for a
  person or a platform, never an approval.
- Analysing tests over time beyond flakiness at one key.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- Repositories are git repositories.
- The workspace description is pinout.
- testledger is free and open source.

The rest of the stack, which a model builds on unless it says why not:

- Records as OCI artifacts whose signed layer is an in-toto Statement in
  a DSSE envelope, signed with sigstore.
- SHA-256 for keys and digests.
- Three surfaces answering from one core: a command-line program, a
  Model Context Protocol server through which an agent asks what its gate
  still needs, and an action for GitHub Actions.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- What must vouch for a record a checkout wrote and a push carried,
  before a gate that does not trust every executor counts it?
- How long does each store keep records and evidence by default?
- Is an error (no verdict reached) ever retried by testledger, or only
  by the asker?
- Does a policy name checks by identity, by pattern, or by what pinout
  reports as affected, and which of those may a later layer use?
- What states the toolchain of a run made in no image, an agent's shell
  or a developer's, and who establishes that the run used it (1, 10)?

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** An agent's merge gate finds a pass for every affected check at
  their current keys, written by a trusted executor, and merges without
  running anything.
- **S2.** One required check changed an input. The gate reports it
  missing, runs it, and the next verdict is satisfied.
- **S3.** A check fails in one checkout and passes in another at the
  same key. Every reader trusting both executors sees it flaky, never
  passed.
- **S4.** A version gate trusts only confined executors. A pass from an
  agent's open shell is listed, but the gate reports the check missing
  until a confined run passes.
- **S5.** Forty branches build the same deployable artifact. One
  integration run against it, in one envelope, satisfies all forty.
- **S6.** A check whose inputs pinout cannot state runs on every gate
  and is never reused.
- **S7.** Asked why a check ran again, testledger says the toolchain
  changed and nothing else.
- **S8.** An agent proves its change in a checkout and pushes. The
  server's merge gate reads the records the push carried and runs
  nothing. The version gate lists them and reports each check missing
  until a confined run passes.
- **S9.** A check passes in one agent's shell and fails in another's at
  the same key. A merge gate whose policy sends such a key to confined
  runs reports it missing, a confined run passes, and the gate is
  satisfied. Where two confined runs disagree, no gate is satisfied at
  that key.

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of testledger that satisfies Parts A and B: its components, the
record, the key's derivation with fixed examples, the policy and its
layering, and the verdict. A conformance suite whose scenarios cite the
clauses they exercise. The profiles of Part C, each passing the suite.

<!-- ANCHOR_END: deliver -->
