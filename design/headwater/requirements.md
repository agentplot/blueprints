# headwater — requirements
<!-- ANCHOR: preamble -->

A statement of what headwater must always do and never do, written to
admit any model that satisfies it.

The statement is in three parts. Part A is what must hold of headwater
on its own: what a repository depends on, which releases of those
dependencies are new to it, when each is looked for, what headwater
keeps, and what it gives the people and programs that ask. Part B is its
contracts: the operations it needs across its five seams, a dependency
description, a release source, a notes source, an advisory source and a
store, and the guarantee each must give. Part C is the profiles: the
ways each contract is satisfied.

Parts A and B name no mechanism: no command, file, format, field,
registry, service or tool. One thing of the world they do name freely,
because section 9 fixes it: git. Every other real tool is named only in
section 9 and in Part C. A reader who has never seen a dependency
updater should be able to design from Parts A and B and git alone.

## 1. Purpose

headwater tells a repository which releases of what it depends on are
newer than what it runs. It reads what the repository declares, asks
where each dependency is published, and reports every newer release with
the words upstream wrote for it. It looks often for the dependencies a
repository's authors care most about, and less often for the rest. It answers the
same way to a person, a coding agent, a pane beside the agents, and a
program that records what it hears, and none of them needs another to
use it. headwater never changes a repository, never judges what a
release means, and never acts on one: a person or an agent decides, and
the change is theirs.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **the repository's authors** | what the repository depends on, which dependencies belong to which tier, and each tier's cadence | they never decide what a source publishes, or that a release is older than it is |
| **an asker** (a person, a coding agent, a surface, a recorder, a scheduler) | which repository and which tiers to ask about, and when | it never changes an answer by who it is, and never supplies a release or a version order |
| **upstream** (whoever publishes a dependency) | what is released, when, under which version, and what its notes say | it never learns anything of the repository beyond the identities and versions headwater asks about |
| **headwater** | which releases are newer than each pin, as this statement fixes them, and what it keeps to answer again | it never changes a repository, never rewords or judges what upstream wrote, never acts on a release, and never keeps a credential |
| **a fixer** (a coding agent or a person who makes changes) | whether and how to move a pin, given a brief | it never changes what headwater reports about upstream |
| **a recorder** (a program that keeps what it hears as its own records) | how it records each release, and what its own judgment of one is | it never writes headwater's state |
| **the operator** | everything the repository's authors and an asker do not settle | |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **repository state**: the content of a repository at one commit,
  together with any uncommitted change the asker names as part of it.
- **dependency**: something published apart from the repository that
  the repository's authors chose to use: a package, a tool, an image, or
  another repository's releases.
- **declaration**: one place in a repository state that names a
  dependency, and what it says of the version.
- **identity**: the one name of a dependency that every declaration,
  source and asker uses for it.
- **pin**: of a dependency at a repository state, the version the
  repository runs, or **unknown** when the repository state names no
  single version.
- **source**: where upstream publishes a dependency's releases, or an
  index of those places.
- **release**: one version of a dependency that its source publishes,
  with its date and a link to it.
- **version order**: how a dependency's source orders its versions.
- **newer**: of a release against a pin, later in the dependency's
  version order.
- **notes**: what upstream wrote of a release, as upstream wrote it.
- **advisory**: a published warning that names versions of a dependency
  as unsafe.
- **tier**: a named set of a repository's dependencies, with a cadence.
  The **default tier** holds every dependency no other tier names.
- **cadence**: the longest time a tier may go without a complete scan
  while scans are asked for.
- **due**: of a tier, that its cadence has passed since its last
  complete scan, or that it has never had one.
- **scan**: one reading of a repository state's dependencies and of the
  sources of those in the tiers it covers.
- **complete**: of a tier's scan, that every dependency of the tier was
  read and every source reached.
- **unread**: of a dependency in a scan, that headwater could not read
  its declarations or reach its source, with the reason.
- **report**: what a scan found: for each dependency of the tiers it
  covers, its pin, the releases newer than it, the advisories that name
  it, or that it is unread.
- **acknowledgement**: a person's word, or an acting session's, on one
  release of one dependency: **dismissed**, or **skipped** until a newer
  release.
- **brief**: everything a fixer needs to move one dependency to one
  release: the release, its notes, its advisories, and every declaration
  of the dependency.
- **held state**: everything headwater keeps of its own for one
  repository.
- **surface**: one way an asker reaches headwater.
- **profile**: one way a contract of Part B is satisfied, as Part C
  describes.

<!-- ANCHOR_END: glossary -->
<!-- ANCHOR: part-a -->
## Part A. What headwater decides

### A.1 What a repository depends on

1. headwater reads only the dependencies a repository state declares,
   and invents none. A declaration it cannot read is reported unread,
   naming the declaration, and is never dropped from a report.
2. Every dependency has exactly one identity, whichever declaration
   names it and whichever source publishes it. Two declarations of one
   identity are one dependency.
3. A pin is exactly one version or unknown. A dependency whose pin is
   unknown is reported as unknown and never as having nothing newer.
4. A dependency declared at more than one pin in one repository state
   is reported with every declaration and its pin. A release is newer
   for that dependency when it is newer than the oldest of them.
5. Reading a repository state changes nothing in it. headwater never
   writes a repository's content, its history or its configuration.

### A.2 Releases and what is new

6. A release is newer than a pin only by the dependency's own version
   order. headwater never orders two versions by their dates, by their
   names' spelling, or by the order a source lists them.
7. A release whose order against the pin cannot be decided is reported
   as undecided, beside the newer ones, never as newer and never left
   out.
8. A report holds every release newer than the pin that the source
   publishes, and none that is not newer.
9. The pin alone decides what is new. headwater reads no record of
   what it reported before to decide it, so every scan reports a release
   until the pin reaches or passes it, or an acknowledgement leaves it
   out (21).
10. A release has one identity for ever: its dependency's identity and
    its version. Every scan, surface and host names the same release
    the same way, so an asker can key on it.
11. A release is reported with what its source published of it: its
    version, its date, its link and its notes, as upstream wrote them.
    headwater never summarises, rewords, translates, ranks or judges a
    release, and no model reads notes inside headwater.
12. Every report and every brief gives each release's notes whole, or
    gives the part an asker asked for together with a way to read the
    whole again. headwater keeps no part of notes it cannot give whole.

### A.3 Tiers and cadence

13. Every dependency of a repository state belongs to exactly one tier.
14. The tiers and their cadences are read from the repository state.
    headwater never moves a dependency between tiers, and never changes
    a cadence.
15. A scan of what is due reaches the sources of the due tiers'
    dependencies and of no others. A scan of a named tier reaches its
    sources whether or not it is due.
16. A scan that leaves a tier incomplete reports every dependency it
    could read, reports the rest as unread with the reason, and leaves
    the tier due.
17. Asking what headwater holds reaches no source and writes nothing.
    The answer is the newest report for each tier, and says when each
    was made and whether its tier is due.

### A.4 Advisories

18. A dependency whose pin an advisory names is reported as affected,
    naming the advisory, in every report that holds the dependency.
19. An advisory is reported apart from notes. headwater never folds an
    advisory into a release's notes, and never infers one from them.

### A.5 Acknowledgements

20. An acknowledgement is only ever given by a person or an acting
    session, for one release of one dependency. headwater never infers
    one, and never gives one when a pin moves.
21. A dismissed release is left out of reports. A skipped release is
    left out until a release newer than it is published, which is then
    reported with the skipped one beside it.
22. An acknowledgement never changes a pin, a version order or an
    advisory. A dependency with an advisory naming its pin is reported
    as affected whatever its acknowledgements say (18).
23. An asker may always ask for a report that disregards every
    acknowledgement, and gets the report the pins alone decide (9).
24. Every acknowledgement names who gave it and when, and stays readable
    after the release it acknowledges leaves every report.

### A.6 Briefs

25. For any release a report holds, headwater gives a brief. Asking for
    one reaches no source but the notes and advisory sources, and writes
    nothing but notes it keeps whole (12).
26. A brief names every declaration of the dependency in the repository
    state and the pin each gives, so a fixer can move every one.
27. A brief prescribes nothing. It names no tool that acts on it, and no
    step a fixer must take.

### A.7 Held state

28. headwater keeps its held state outside the repository's content.
    Every checkout of one repository shares one held state.
29. Everything in the held state but acknowledgements can be discarded,
    and the next scan rebuilds it with no report changed but the times
    it gives.
30. Two scans of one repository at once leave the held state as one or
    the other would have left it. Neither leaves it half written, and no
    acknowledgement is lost.
31. Every report is made from one reading of the repository state. A
    report never mixes the declarations of two repository states.

### A.8 Askers and surfaces

32. The same question about the same repository state and the same held
    state gets the same answer, whoever asks and through whichever
    surface.
33. Every surface answers from one core. No surface computes a report,
    a brief, a due tier or an acknowledgement of its own.
34. Nothing headwater reports depends on which surface asked, which
    recorder will keep it, or which fixer will act on it, and headwater
    needs none of them to answer.
35. Every answer has one form a program reads, the same through every
    surface, and that form only ever gains fields.
36. headwater never acts on a release. A surface may hand a brief to a
    fixer, and the change the fixer makes is the fixer's.

### A.9 Sources and what they learn

37. headwater sends a source nothing of the repository but the
    identities and versions it asks about.
38. headwater reaches a source with the asker's own credentials or with
    none, and never keeps a credential in its held state.
39. A source's answer is reported as that source gave it. Where two
    sources disagree about one release, the report names both and
    chooses neither.

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The dependency description

40. **read-dependencies**: given a repository state, every dependency it
    declares, each with its identity, every declaration of it and the
    pin each gives; and every declaration that could not be read, with
    the reason.
41. **read-tiers**: given a repository state, its tiers, the cadence of
    each, and which identities each names.
42. Both answers are the same for the same repository state, and reading
    either changes nothing (5).

### B.2 The release source

43. **list-releases**: given an identity, every release its source
    publishes, each with its version, date and link, and whether the
    source has withdrawn it; or that the source could not be reached.
44. **order**: given an identity and two versions, which is newer, that
    they are the same, or that their order cannot be decided.
45. The order is the source's own (6), and the same two versions always
    order the same way.

### B.3 The notes source

46. **read-notes**: given an identity and a version, what upstream wrote
    of that release, whole and unchanged, or that it wrote nothing.

### B.4 The advisory source

47. **read-advisories**: given an identity and a version, every advisory
    that names that version, each with its identity, its severity as the
    advisory gives it, and a link.

### B.5 The store

48. **read**: given a repository, its held state and the version it was
    read at.
49. **write**: given a repository, the version read and the next held
    state. The write is all or nothing, and succeeds only if the held
    state is still at the version read (30).
50. The store holds nothing in the repository's content (28), and every
    checkout of one repository reaches the same store.

### B.6 Binding the contracts

51. Each seam is bound by naming one or more profiles of Part C. Any
    number of dependency descriptions, release sources, notes sources
    and advisory sources are bound at once, each answering for the
    identities it knows, and exactly one store is written.
52. One conformance suite holds every profile to Parts A and B; a
    profile that fails it is not one.

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile.

### C.1 Identity: Package URL

An identity is a Package URL (ECMA-427) without its version:
`pkg:npm/react`, `pkg:pypi/fastapi`, `pkg:github/jdx/mise`. A release's
identity is the same Package URL with its version (10):
`pkg:github/jdx/mise@2026.10.10`.

### C.2 Dependency descriptions

| profile | declarations read | the pin |
|---|---|---|
| **npm** | `package.json` dependencies | the version the lockfile resolves; unknown without a lockfile |
| **Python** | `pyproject.toml` and `requirements*.txt` | the version `uv.lock` or `poetry.lock` resolves, or a `==` requirement; unknown otherwise |
| **Cargo** | `Cargo.toml` dependencies | the version `Cargo.lock` resolves |
| **Go** | `go.mod` requirements | the version `go.mod` names |
| **mise** | `mise.toml` and `.tool-versions` tools | the version each names; unknown for `latest` or a prefix |
| **GitHub Actions** | `uses:` in `.github/workflows` | the tag or version named; unknown for a branch |
| **container images** | `FROM` in a `Dockerfile` | the tag named; unknown for `latest` |
| **watch list** | a file naming each dependency's upstream repository, its tag pattern, its pin and its tier | as the file gives it; swancloud's, generated from `lib/release-sources.nix` |

Tiers are read from `.config/headwater.toml`: each tier's name, its
cadence, and the identities it names. A repository with no such file has
the default tier alone, with a cadence of seven days.

### C.3 Release sources

| profile | identities | list-releases / order |
|---|---|---|
| **deps.dev** | npm, PyPI, Cargo, Go, Maven, NuGet, RubyGems | the versions and dates of a batched Package URL lookup, with no key; order by the ecosystem's own rules |
| **a registry's own API** | the registry's packages | the registry's version list, for a release deps.dev has not seen yet; order as above |
| **GitHub releases** | `pkg:github/*`, and any dependency whose source repository is on GitHub | the repository's releases through GraphQL, fifty repositories a query, with the asker's own `gh` sign-in (38); order by Semantic Versioning where the tags parse, by the watch list's tag pattern otherwise |
| **ecosyste.ms** | GitHub Actions, container images, Homebrew, nixpkgs and the other registries it indexes | its packages API by Package URL |

Order by ecosystem: Semantic Versioning 2.0.0 for npm, Cargo and
GitHub tags that parse; PEP 440 for PyPI; Go's module rules; and a
calendar version compared field by field where a watch list says so.

### C.4 Notes sources

| profile | read-notes |
|---|---|
| **GitHub release** | the body of the GitHub release at the version's tag in the dependency's source repository, which deps.dev links or the watch list names |
| **changelog** | the section for the version in the source repository's `CHANGELOG.md` at that tag, where no release body exists |

### C.5 Advisory source: OSV

| operation | how OSV satisfies it |
|---|---|
| read-advisories | OSV's batched query by Package URL and version; severity as the advisory gives it |

### C.6 Store: the git directory

| operation | how the git directory satisfies it |
|---|---|
| read | the files under `<git common dir>/headwater/`, which every worktree of the repository shares (28) |
| write | a new file written beside the old and renamed over it, under a lock held for the write (30, 49) |

Notes are kept whole under the same directory, never in the repository's
content.

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** headwater never changes a repository, and never acts on a
  release (5, 36).
- **I2.** The pin alone decides what is new (9).
- **I3.** Upstream's words reach the asker as upstream wrote them, with
  no model between (11, 19).
- **I4.** A release has one identity for ever, everywhere (10).
- **I5.** Asking what headwater holds reaches no source and writes
  nothing (17).
- **I6.** Nothing headwater keeps but acknowledgements is needed to
  answer again (29).

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Moving a pin, building, testing or landing a change. A fixer does
  that, and the repository's own gate decides whether it lands.
- What a dependency depends on in turn. headwater reports what the
  repository's authors chose; scanning the whole graph for advisories
  belongs to a vulnerability scanner.
- Judging what a release means for the repository, or summarising its
  notes.
- Recording releases as anyone's own records. A recorder does that
  through its own plugin, from what headwater reports.
- Telling anyone by itself. A surface tells, when its asker asks.
- Licences and software bills of materials.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- Repositories are git repositories.
- An identity is a Package URL (ECMA-427).
- The askers include coding agents working in many checkouts of one
  repository at once.
- Sources are reached over the network, with the asker's own
  credentials where a source needs any.
- headwater is free and open source.

The rest of the stack, which a model builds on unless it says why not:

- One static binary, written in Rust, as sluice is.
- Every answer as JSON on request, the form of (35).
- Four surfaces answering from one core, each a plugin kept outside the
  core as sluice keeps its plugins: a command line; a Claude Code plugin
  that notes new releases at a session's start and hands a release to a
  background agent in a worktree of its own; a herdr plugin with a
  sidebar row, a popup and a key that hands a release to a new agent in
  a worktree; and a Flywheel plugin whose one part is an adapter that
  turns each release into a capture.
- The profiles of Part C: the watch list, npm, Python, GitHub releases,
  deps.dev, OSV and the git directory first.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- Are prereleases reported, and when: only where the pin is a
  prerelease, or where a tier asks for them (8)?
- What does a report say of a release its source has withdrawn, and of
  a pin whose own release has been withdrawn (43)?
- Do advisories wait on a tier's cadence, or is every pin's advisory
  looked for at every scan (15, 18)?
- Is an acknowledgement each person's, or the repository's, and does it
  travel to another host that shares the repository (20, 28)?
- Where does the held state live when several hosts share one
  repository (28, 50)?
- How does a repository holding several projects declare one tier
  across all of them, and is one dependency in two projects one
  dependency or two (2, 13)?
- Is a cadence measured from a complete scan's start or its end (15)?

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** A colleague opens a session in a repository that declares its
  packages and its Python requirements. Two dependencies of the
  favorites tier have newer releases, and the session is told of both
  with their notes. Nothing in the repository changes.
- **S2.** The same session starts again an hour later. No tier is due,
  no source is reached, and the session is told the same two releases
  and when they were found.
- **S3.** One favorite's source cannot be reached. The report names it
  unread with the reason, reports the other favorites, and the tier is
  still due at the next start.
- **S4.** A fixer moves one favorite to its newest release, and the
  change lands. The next scan no longer reports that release, and no
  acknowledgement was given.
- **S5.** A person dismisses a release. No later report holds it. When
  a newer release is published, that one is reported.
- **S6.** A recorder asks for the favorites' releases every day. A
  release is reported every day, under the same identity, until its pin
  moves, and the recorder keeps it once.
- **S7.** A release's notes run to forty kibibytes. A report that holds
  it and a brief for it give the notes whole, or the part asked for and
  a way to read the rest, and not one word is changed.
- **S8.** Two checkouts of one repository scan at once. The held state
  afterwards is one of theirs, whole, and every acknowledgement stands.
- **S9.** The held state is deleted, apart from its acknowledgements.
  The next scan reports exactly what the last one did, at a new time.
- **S10.** An advisory names a pin. Every report that holds the
  dependency names the advisory, though a person dismissed the release
  that would fix it.
- **S11.** A watch list names fourteen tools by their upstream
  repositories and tag patterns. Each release is reported under the
  same identity a declaration of that tool would give it.
- **S12.** A person asks through the command line, an agent through its
  session and a pane through its sidebar, about one repository state.
  All three get the same report.

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of headwater that satisfies Parts A and B: its components, the
answers each surface gives, how a scan is made and a report derived,
with fixed examples, and how a dependency description, a release source
and a store are added. A conformance suite whose scenarios each cite the
clauses they exercise, failing when a clause is cited by nothing. The
profiles of Part C, each passing the suite.

<!-- ANCHOR_END: deliver -->
