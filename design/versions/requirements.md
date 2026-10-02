# versions — requirements
<!-- ANCHOR: preamble -->

A statement of what versions must always do and never do, written to
admit any model that satisfies it.

The statement is in three parts. Part A is what must hold of versions on
its own: which channel a branch has, when an app has a new version,
which version it is, and what must be true before one is written
anywhere. Part B is its contracts: the operations it needs across its
six seams, a workspace description, an app declaration, a commit
convention, a stamper, a channel store and a gate, and the guarantee
each must give. Part C is the profiles: the ways each contract is
satisfied.

Parts A and B name no mechanism: no command, file, format, field,
service or tool. One thing of the world they do name freely, because
section 9 fixes it: git. Every other real tool is named only in section
9 and in Part C. A reader who has never seen a release tool should be
able to design from Parts A and B and git alone.

## 1. Purpose

versions gives every app in a repository its version and its channel,
the same way in every repository. The branch decides the channel. What
the app reads decides whether it has a new version, and what its commits
declare decides which. It answers for any checkout without writing
anything, so a hundred agents on a hundred branches each have versions
of their own and never meet at a shared file or a shared counter. A
version is written only into a copy of what is packaged, and only where
a gate is satisfied. versions never builds, never publishes and never
promotes.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **the repository's authors** | what the apps are, and what each commit declares of its change | they never choose a version, a channel, or the form of either |
| **an asker** (a coding agent, a person, a pipeline, a build platform) | which repository state and branch to ask about, and when to make the version it was given | it never supplies a version or a channel, and never changes an answer by who it is |
| **a policy's author** (a platform, a repository's owners) | which gate guards each channel | it never leaves a channel with no gate |
| **versions** | each app's version and channel, as this statement fixes them | it never changes the repository, never moves a head a build does not move, never runs a check |
| **a control plane** | every move of a head that is not a build's: a promotion, an approval, a hold | it never changes a version that was made, or the state it names |
| **the operator** | everything a policy does not settle | |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **repository state**: the content of a repository at one commit,
  together with any uncommitted change the asker names as part of it.
- **project**: a part of a repository that its authors declare as one
  unit, owning a set of the repository's paths.
- **task**: a named operation a project offers.
- **app**: one or more projects the repository declares to be released
  together under one version.
- **packaged task**: the task of an app whose result is packaged.
- **artifact**: what is packaged from an app at one repository state,
  for a consumer to take.
- **version**: the name of one content of an app, ordered against that
  app's other versions.
- **channel**: a named line of an app's versions that a consumer
  follows.
- **head**: the version a channel is at.
- **trunk channel**: the channel of the repository's default branch. A
  **trunk version** is a version made on it.
- **branch channel**: the channel of any other branch. A **branch
  version** is a version made on one.
- **predecessor**: of an app at a repository state, the newest trunk
  version of it made from a state in that state's history.
- **declared change**: what a commit's author says of its change:
  breaking, a feature, a fix, or nothing.
- **increment**: how far a version is from its predecessor: major,
  minor or patch, patch being the smallest.
- **ecosystem**: a packaging system with its own form for a version and
  its own places to carry one.
- **stamp**: to write a version into a copy of what is packaged, in an
  ecosystem's form.
- **make**: to stamp a version into an artifact or to move a head to
  it. Asking what a version would be makes nothing.
- **gate**: a named point that proceeds only when a policy is
  satisfied.
- **policy**: for each channel, the gate that guards it.
- **verdict**: a gate's reading at one repository state.
- **answer**: what versions returns about one app at one repository
  state. It is exactly one of a **version**, **unchanged** (the app
  still has the version it had) or **refused** (versions cannot say,
  and says why).
- **profile**: one way a contract of Part B is satisfied, as Part C
  describes.
- **surface**: one way an asker reaches versions.

<!-- ANCHOR_END: glossary -->
<!-- ANCHOR: part-a -->
## Part A. What versions decides

### A.1 Answers

1. Asking what version an app has, or would have, at a repository state
   makes nothing, writes nothing and needs no verdict.
2. The same question about the same repository state, the same branch
   and the same heads gets the same answer, whoever asks and through
   whichever surface.
3. Every answer is exactly one of a version, unchanged or refused. An
   unchanged answer names the version the app still has, and a refused
   answer names what was missing.
4. An answer that gives a version names its predecessor, its increment,
   the commits it contains, and which of them set the increment.

### A.2 Channels

5. The branch and the repository's default branch alone decide the
   channel. Nothing the repository holds and nothing an asker supplies
   changes it.
6. The default branch has the trunk channel, and every other branch has
   a branch channel of its own. No two branches share a channel.
7. Every branch has a channel. None is listed, admitted or refused by
   its name.
8. How a channel's name follows from a branch's name is published, and
   any party can derive it without versions.

### A.3 Apps

9. Every app has an identifier unique in the repository, and every
   version is a version of exactly one app.
10. An app's version depends on what that app reads. A change to what
    only another app reads never changes it.
11. versions invents no app: each is one the repository state declares,
    or one inferred under a convention its profile states.

### A.4 Whether an app has a new version

12. An app has a new version at a repository state exactly when what
    its packaged task reads there differs from what it read at its
    predecessor's state. Otherwise the answer is unchanged.
13. What a commit declares never decides whether an app has a new
    version.
14. Where what a packaged task reads cannot be stated complete, the app
    is taken to differ at every state. versions errs toward a new
    version and never toward withholding one.
15. A version is made only from a repository state that is a commit. An
    answer about a state that holds uncommitted changes says so, and
    nothing is made from it.

### A.5 Which version

16. A new version follows its predecessor by exactly one increment: the
    largest change declared by the commits, since the predecessor's
    state, that changed a path the app owns.
17. A commit that declares nothing, or whose declaration cannot be
    read, counts as the smallest increment, and an app whose packaged
    task reads differently only outside the paths it owns takes the
    smallest.
18. One version of an app names one content for ever: no two repository
    states at which its packaged task reads differently carry the same
    version of it.
19. A trunk version is made only at a state whose predecessor is the
    trunk channel's head. A state the head does not precede is refused.

### A.6 Branch versions

20. A branch version is a function of the repository state, its history
    and the trunk versions in that history. No record of an earlier
    branch version is read, and none need be kept.
21. A branch version names its branch's channel and the newest commit
    in the state's history that changed what the app's packaged task
    reads.
22. A branch version precedes the trunk version its predecessor and
    increment would give, in every ecosystem's form, so a consumer that
    asks for trunk versions is never given one.

### A.7 Stamping

23. The repository never holds an app's version. Making one adds no
    commit and changes no file of the repository.
24. A version is written only into a copy of what is packaged. Every
    step before packaging reads the repository state alone and gives
    the same result whatever the version.
25. An app packaged in more than one ecosystem carries one version in
    all of them, each in that ecosystem's form, and each form read back
    gives that version.
26. A version has one form in which it is stored and compared. Every
    other form is a rendering of it and is never compared.

### A.8 Heads

27. versions moves only the head of the channel the branch decides (5),
    and only to a version it made at that state. It never moves the
    head of any other channel.
28. Of two movers of one head at once, exactly one succeeds. The other
    is told, and moves nothing.
29. The last version of an app on a channel has exactly one source, the
    channel store. Nothing else is read to decide it.

### A.9 The gate

30. No version is made at a repository state unless the gate the policy
    names for its channel is satisfied at that state.
31. versions never runs a check and never decides what a gate requires
    or whom it trusts. It reads the verdict.
32. Where the verdict is not satisfied, nothing is stamped and no head
    moves, and the answer carries what the verdict found wanting.
33. Every channel has a gate. A policy that requires nothing of a
    channel says so by naming a gate that requires nothing.

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The workspace description

34. **list-projects**: given a repository state, the projects, the
    paths each owns and the tasks each offers.
35. **digest-inputs**: given a task, a fingerprint of everything it
    reads, or unknown.
36. **name-inputs**: given a task, the inputs its fingerprint covers.
37. Every answer is the same for the same repository state.

### B.2 The app declaration

38. **list-apps**: given a repository state, the apps, and for each its
    identifier, its projects, its packaged task and its ecosystems.
39. Every app listed is one the repository state declares, or one
    inferred under the one convention the profile states (11).

### B.3 The commit convention

40. **read-change**: given a commit, the change it declares, or that it
    cannot be read.
41. The same commit always reads the same.

### B.4 The stamper

42. **render**: given a version, the ecosystem's form of it.
43. **stamp**: given a copy of what is packaged and a version, that
    copy carrying the version in every place the ecosystem keeps one.
44. **read-back**: given a stamped copy, the version it carries.
45. Two versions never render alike, a branch version renders as one
    the ecosystem orders before the trunk version (22), and a stamp
    changes nothing but the copy it was given.

### B.5 The channel store

46. **head**: given an app and a channel, the version the channel is at
    and the repository state it was made from, or none.
47. **advance**: given an app, a channel, the version the mover takes
    the head to be at, and the next version with its state. The head
    moves only if it is at the version named.
48. **find**: given an app and a version, the repository state it was
    made from, or none.
49. A version once recorded is never removed and never names another
    state, and a mover reads back every move it made.

### B.6 The gate

50. **verdict**: given a gate's name and a repository state, satisfied
    or not, and for one not satisfied, what is wanting.
51. Reading a verdict runs nothing.

### B.7 Binding the contracts

52. Each seam is bound by naming one profile of Part C. Any number of
    stampers are bound at once, and exactly one channel store is
    written.
53. One conformance suite holds every profile to Parts A and B; a
    profile that fails it is not one.

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile.

### C.1 Workspace description: pinout

| operation | how pinout satisfies it |
|---|---|
| list-projects | pinout's projects, the paths each owns and its tasks |
| digest-inputs | pinout's digest of the packaged task's inputs, unknown passed through unchanged |
| name-inputs | the inputs pinout names for that digest |

### C.2 App declarations

| profile | how list-apps is satisfied |
|---|---|
| **convention** | every project a bound stamper recognizes, and its ecosystem does not mark private, is one app of that ecosystem; its packaged task is the project's task named `build` |
| **declared** | a file in the repository lists the apps, each with its projects, its packaged task and its ecosystems; projects listed together are one app |
| **a platform's manifests** | a platform that already keeps a manifest for each app answers from those |

### C.3 Commit convention: Conventional Commits 1.0.0

| declared change | how a commit says it | increment |
|---|---|---|
| breaking | a `!` after the type or scope, or a `BREAKING CHANGE` footer | major |
| a feature | the type `feat` | minor |
| a fix | the type `fix` | patch |
| nothing | any other type | patch (17) |
| cannot be read | the message does not parse | patch (17) |

### C.4 The form of a version and of a channel's name

Versions are Semantic Versioning 2.0.0, stored and compared with no
prefix (26).

- **The trunk channel** is named `beta`, and a trunk version is
  `MAJOR.MINOR.PATCH`.
- **A branch channel** is named `alpha/<slug>`.
- **A slug** is the branch's name in lower case, every character
  outside `[a-z0-9-]` replaced by `-`, runs of `-` collapsed and the
  ends trimmed. Where a name is not its own slug, the slug ends in `-`
  and the first seven hexadecimal digits of the SHA-256 of the name, so
  no two branches share one (6).
- **A branch version** is `<trunk version>-<slug>.<count>.g<commit>`:
  the trunk version its predecessor and increment would give, the slug,
  the count of commits since the predecessor's state that changed what
  the app reads, and the abbreviated commit of (21).
- **The commit is a prerelease identifier, never build metadata.**
  Ecosystems drop or ignore what follows a `+` when they tell two
  versions apart, and (18) needs them told apart.
- **No order is promised among one branch's versions.** The count falls
  when the default branch is merged in. A consumer of a branch channel
  takes its head.

### C.5 Stampers

| ecosystem | where the version is written | a branch version's form |
|---|---|---|
| **npm** | `package.json`, and the package's own entry in a lockfile the copy holds | as C.4 gives it |
| **Python** | `pyproject.toml`, and `uv.lock` where the copy holds one | PEP 440: `X.Y.Z.dev<count>+<slug>.g<commit>`, the slug's `-` written `.` |
| **.NET** | the project file's `<Version>` | as C.4 gives it |
| **Maven** | the `pom.xml` version | under the `alpha` qualifier, because Maven orders an unknown qualifier after the release |

npm first.

### C.6 Channel stores

| store | where a version and a head live | head / advance / find |
|---|---|---|
| **git**: the repository's own remote | a trunk version is a tag on the commit it was made from, `<app>@<version>`, or `v<version>` in a repository with one app; nothing is stored for a branch channel | the trunk head is the newest version tag in the default branch's history, and a branch head is computed (20); advance pushes the tag, and the remote refuses a tag that exists (28); find reads the tag |
| **a control plane** | its own records, which may also hold channels versions never moves (27) | its own reads; advance is a write that succeeds only from the version named |

A registry's tags are no channel store: a tag moves without naming the
version it was at (47). A tag for each channel may be written after a
head moves, for a consumer that reads only tags, and is never read to
decide anything (29).

### C.7 Gate: testledger

| operation | how testledger satisfies it |
|---|---|
| verdict | testledger's verdict for the gate at the repository state; the policy names the gate for each channel, and where it names none, the gate named `version` |

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** Asking writes nothing, and the same question gets the same
  answer (1, 2).
- **I2.** One version of an app names one content for ever (18, 49).
- **I3.** The repository never holds its version (23, 24).
- **I4.** Nothing is stamped and no head moves without a satisfied gate
  (30, 32).
- **I5.** The branch alone decides the channel, and versions moves no
  other head (5, 27).

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Writing release notes or a changelog. versions names the commits a
  version contains (4), and anything may write notes from them.
- Building or packaging an app, or publishing an artifact anywhere.
- Promoting a version from one channel to another, or approving one.
- Describing a repository's projects and inputs. That is pinout's.
- Deciding what a gate requires. That is a policy's, read through
  testledger.
- Versions for an older line of an app once the trunk has moved past
  it.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- Repositories are git repositories.
- The workspace description is pinout, and the gate is testledger's.
- The askers include coding agents working in many checkouts of one
  repository at once.
- versions is free and open source.

The rest of the stack, which a model builds on unless it says why not:

- Semantic Versioning 2.0.0 for the form of a version, and Conventional
  Commits 1.0.0 for what a commit declares.
- Three surfaces answering from one core: a command-line program, a
  Model Context Protocol server through which an agent asks what
  version its change would make, and an action for GitHub Actions.
- The profiles of Part C, the git channel store and the npm stamper
  first.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- May a policy name kinds of commit that never give an app a new
  version though they changed what it reads (12, 13)?
- What is an app's first version, and is a breaking change before
  `1.0.0` a major increment?
- Is a commit whose declaration cannot be read counted smallest (17),
  or refused before anything is made?
- What does a stamper do where a public index refuses a branch
  version's form (45)?
- What becomes of a branch channel, and of what a store recorded for
  it, when its branch is gone?
- How does an app keep its identifier and its predecessor when its
  projects move or are renamed (9)?
- Does a channel store record what a packaged task read at each
  version's state, or is that asked again of the workspace description
  (12)?

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** An agent in a checkout on its own branch asks what version
  its change would make of the app it edited. It is given a branch
  version and the commits it contains, and nothing is written anywhere.
- **S2.** A hundred agents on a hundred branches each make versions of
  one app at once. No two versions are alike, no head is contended, and
  no file of the repository changes.
- **S3.** A merge to the default branch changes what one of three apps
  reads. That app has a new trunk version, and the other two are
  answered unchanged.
- **S4.** A commit that declares nothing changes a file all three apps'
  packaged tasks read. Each takes the smallest increment.
- **S5.** A commit declares a fix and changes only a file no packaged
  task reads. No app has a new version.
- **S6.** Two builds of the default branch finish together. One moves
  the head. The other is told it was passed, and no version names two
  contents.
- **S7.** The gate of a channel is not satisfied at a state. Nothing is
  stamped, no head moves, and the answer names the check that is
  wanting. Asking what the version would be is still answered.
- **S8.** One app is packaged for three ecosystems. All three carry one
  version, each in its own form, and each read back gives that version.
- **S9.** A consumer that asks an ecosystem for an app's newest release
  while a hundred branch versions exist is given a trunk version.
- **S10.** A team with no control plane keeps its trunk versions in git
  alone. A team with one keeps them in its records. Nothing in Parts A
  and B differs between them.
- **S11.** Asked why an app's version is a major increment, versions
  names the commit that declared the breaking change.

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of versions that satisfies Parts A and B: its components, the
answers each surface gives, the derivation of a version and of a
channel's name with fixed examples, and how a stamper and a channel
store are added. A conformance suite whose scenarios each cite the
clauses they exercise, failing when a clause is cited by nothing. The
profiles of Part C, each passing the suite.

<!-- ANCHOR_END: deliver -->
