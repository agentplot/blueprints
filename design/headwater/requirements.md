# headwater — requirements
<!-- ANCHOR: preamble -->

A statement of what headwater must always do and never do, written to
admit any model that satisfies it.

The statement is in three parts. Part A is what must hold of headwater
on its own: what a repository depends on, which releases of those
dependencies are new to it, when each is looked for, what headwater
keeps, and what it gives the people and programs that ask. Part B is its
contracts: the operations it needs across its six seams, and the
guarantee each must give. The seams are a dependency description, a
tiers declaration, a release lookup, a notes lookup, an advisory lookup
and a store. Part C is the profiles: the ways each contract is
satisfied.

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
| **the repository's authors** | what the repository depends on, which dependencies belong to which tier, each tier's cadence, which lookups to ask, and how a dependency's tags spell its versions | they never decide what upstream publishes, which of two versions is newer, or that a release is older than it is |
| **an asker** (a person, a coding agent, a surface, a recorder, a scheduler) | which repository and which tiers to ask about, and when | it never changes an answer by who it is, and never supplies a release or a version order |
| **upstream** (whoever publishes a dependency) | what is released, when, under which version, and what its notes say | it never learns anything of the repository beyond the identities and versions headwater asks about |
| **headwater** | which releases are newer than each pin, as this statement fixes them, and what it keeps to answer again | it never changes a repository, never rewords or judges what upstream wrote, never acts on a release, and never keeps a credential |
| **a fixer** (a coding agent or a person who makes changes) | whether and how to move a pin, given a brief | it never changes what headwater reports about upstream |
| **a recorder** (a program that keeps what it hears as its own records) | how it records each release, and what its own judgment of one is | it never writes headwater's state, and never acknowledges a release |
| **the operator** | which releases are dismissed or skipped, in their own word or through a person or session they let act for them; everything the repository's authors and an asker do not settle | |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **repository**: the checkouts that share one held state.
- **repository state**: the content of one checkout as it stands,
  committed or not.
- **dependency**: something published apart from the repository that
  the repository's authors chose to use: a package, a tool, an image, or
  another repository's releases.
- **declaration**: one place in a repository state that names a
  dependency, and what it says of the version.
- **range**: of a declaration, the versions it accepts as it stands,
  where it accepts more than one.
- **claims**: of a declaration, the other places in the repository
  state that a move of its dependency changes, where the declaration
  names them.
- **label**: a name a declaration gives its dependency for people and
  recorders, apart from its identity.
- **identity**: the name a dependency has where it is published, which
  every declaration, lookup and asker uses for it.
- **pin**: of a declaration, the version it makes the repository run,
  or **unknown** when it names no single version. A dependency's pin is
  the oldest of its declarations' pins, and unknown when any of them is
  unknown or two of them cannot be ordered.
- **lookup**: anything headwater asks for an identity's releases, notes
  or advisories: where upstream publishes them, an index of those
  places, or a program on the asker's host that asks them. A **release
  lookup**, a **notes lookup** and an **advisory lookup** each answer
  for one of the three. To a recorder, headwater as a whole is one
  source among many, and a lookup is never called a source.
- **tag scheme**: of a dependency, how its tags spell its versions, as a
  declaration states it.
- **release**: one version of a dependency that a lookup lists, with its
  date and a link to it.
- **prerelease**: a release its lookup marks as one or, where the lookup
  gives no mark, one whose version's own rules mark it.
- **version order**: the order of a dependency's versions under the
  rules of where upstream publishes it.
- **newer**: of a release against a pin, later in the dependency's
  version order.
- **notes**: what upstream wrote of a release, as upstream wrote it.
- **advisory**: a published warning that names versions of a dependency
  as unsafe.
- **tier**: a named set of a repository's dependencies, with a cadence.
  The **default tier** holds every dependency no other tier names.
- **tiers declaration**: the one place in a repository state that names
  its tiers and their cadences, and binds its profiles.
- **cadence**: the longest time a tier may go without a complete scan
  while scans are asked for.
- **due**: of a tier, that it was never scanned, that its newest scan
  was incomplete, or that its cadence has passed since the start of its
  last complete scan.
- **scan**: one reading of a repository state's dependencies, and of
  what the lookups answer for those in the tiers it covers.
- **complete**: of a tier's scan, that every dependency of the tier
  that a bound release lookup knows was read, and that every release
  lookup and advisory lookup asked answered.
- **unread**: of a dependency in a scan, that headwater could not read
  its declarations, or that a release lookup or advisory lookup that
  knows it did not answer, with the reason.
- **report**: what headwater answers of a repository state from what the
  lookups last answered. For each dependency of the tiers it covers: the
  pin, the newer releases and the advisories naming its pins, or that it
  is unread, known to no lookup, or not yet looked for.
- **acknowledgement**: a word given on one release of one dependency, by
  whoever the request names: **dismissed**, or **skipped** until a newer
  release.
- **brief**: everything a fixer needs to move one dependency to one
  release. It holds the release, its notes and those of every release
  between the pin and it, the advisories that name it, and every
  declaration of the dependency. Where they can be given, a brief also
  holds the move as the dependency's own ecosystem spells it, and what
  the published dependency changed between the pin and the release.
- **held state**: everything headwater keeps of its own for one
  repository.
- **binding**: the profiles that answer for each seam (51).
- **surface**: one way an asker reaches headwater.
- **profile**: one way a contract of Part B is satisfied, as Part C
  describes.

<!-- ANCHOR_END: glossary -->
<!-- ANCHOR: part-a -->
## Part A. What headwater decides

### A.1 What a repository depends on

1. headwater reads only the dependencies a repository state declares,
   and invents none. A declaration it cannot read is reported unread,
   naming the declaration and the reason, and is never dropped from a
   report. One whose identity cannot be read belongs to no tier: every
   answer gives it, whatever tiers the answer covers, and it makes no
   tier due.
2. A dependency's identity is the name it has where its declaration says
   it is published, whichever lookup answers for it. Two declarations of
   one identity are one dependency, wherever in the repository state
   they sit. The same software published in two places is two
   dependencies, each with its own versions, and a lookup that calls one
   by another name still answers for its identity.
3. A pin is exactly one version or unknown. A dependency whose pin is
   unknown is reported as unknown and never as having nothing newer.
4. A dependency declared at more than one pin in one repository state
   is reported with every declaration and its pin. A release is newer
   for that dependency when it is newer than the dependency's pin, the
   oldest of its declarations' pins.
5. Reading a repository state changes nothing in it. headwater never
   writes a repository's content, its history or its configuration.
53. A declaration may give its dependency a label. Every answer gives
    each label beside the identity, and a label never replaces the
    identity (2, 10).

### A.2 Releases and what is new

6. A release is newer than a pin only by the dependency's own version
   order. headwater never orders two versions by their dates, by their
   names' spelling, or by the order a lookup lists them.
7. A release whose order against the pin cannot be decided is reported
   as undecided, beside the newer ones, never as newer and never left
   out.
8. A report holds every release newer than the pin that a lookup lists,
   and none that is not newer. The one exception is a newer prerelease,
   held only where the pin is a prerelease or the dependency's tier asks
   for prereleases. A withdrawn release counts as listed and carries its
   lookup's withdrawn mark, on a newer release and on the pin's own
   release alike.
9. The pin alone decides what is new. headwater reads no record of
   what it reported before to decide it, so every scan reports a release
   until the pin reaches or passes it, or an acknowledgement leaves it
   out (21).
10. A release has one identity for ever: its dependency's identity and
    its version, in the normal spelling of the dependency's own version
    rules. Every scan, surface and host names the same release the same
    way, so an asker can key on it. A tag that spells the version
    otherwise stays the release's link.
11. A release is reported with what its lookups gave of it: its
    version, its date, its link and its notes, as upstream wrote them.
    headwater never summarises, rewords, translates, ranks or judges a
    release, and no model reads notes inside headwater.
12. Every report and every brief gives each release's notes whole, or
    the leading portion an asker asked for, cut at the end of a line.
    A portion comes with the notes' full size and a brief as the way to
    read them whole (25). headwater keeps no notes it cannot give
    whole.
54. Every scan of a tier reads again the notes of each release it
    reports, so a change upstream makes to its notes reaches the next
    report.
55. A release whose notes could not be read is reported all the same,
    its notes marked unread with the reason. Its notes are read again at
    its tier's next scan or by a brief (25).
56. Every release a report holds is marked, for each declaration of its
    dependency that gives a range, inside or outside that range. A
    release inside one declaration's range and outside another's
    carries both marks. The marks never leave a release out (8).

### A.3 Tiers and cadence

13. Every dependency of a repository state belongs to exactly one tier,
    unless two tiers name it alike (57).
57. A tier that names an identity outright places it ahead of one that
    names it by a prefix. A dependency two tiers name alike, both
    outright or both by a prefix, is reported unread, naming both tiers,
    and both tiers stay due. headwater never chooses a tier for it, and
    reports every other dependency as usual.
14. The tiers and their cadences are read from the repository state.
    headwater never moves a dependency between tiers, and never changes
    a cadence.
15. A scan of what is due reaches the release lookups of the due tiers'
    dependencies and of no others. A scan of a named tier reaches its
    release lookups whether or not it is due.
16. A scan that leaves a tier incomplete reports every dependency it
    could read, reports the rest as unread with the reason, and leaves
    the tier due.
58. A dependency no bound release lookup knows is reported as known to
    no lookup, never as having nothing newer, and never makes its tier's
    scan incomplete.
17. Asking what headwater holds reaches no lookup and writes nothing.
    The answer is for the asker's own repository state, from what each
    lookup last answered, and says of each tier when its newest scan was
    made and whether it is due. A dependency no scan has looked for yet
    is reported as not yet looked for.

### A.4 Advisories

18. A dependency is reported as affected when an advisory names any of
    its declarations' pins, naming the advisory and the pins it names,
    in every report that holds the dependency. Where an advisory lookup
    could not be reached, the dependency's advisories are reported
    unread, never as not affected.
19. An advisory is reported apart from notes. headwater never folds an
    advisory into a release's notes, and never infers one from them.
59. Every scan reads the advisories of every known pin of every
    dependency the repository state declares, whichever tiers it covers.

### A.5 Acknowledgements

20. An acknowledgement is given only by an explicit request, for one
    release of one dependency, that names who gives it, the asker's git
    identity where the request names no one. headwater records that name
    and never authenticates it. It never infers an acknowledgement, and
    never gives one when a pin moves.
21. A dismissed release is left out of reports. A skipped release is
    left out until a newer release that is not withdrawn is listed,
    which is then reported with the skipped one beside it.
60. A later acknowledgement of a release may withdraw an earlier one.
    The latest for each release decides, and every one stays readable
    (24).
22. An acknowledgement never changes a pin, a version order or an
    advisory. A dependency with an advisory naming one of its pins is
    reported as affected whatever its acknowledgements say (18).
23. An asker may always ask for a report that disregards every
    acknowledgement, and gets the report the pins alone decide (9).
24. Every acknowledgement names who gave it and when, and stays readable
    after the release it acknowledges leaves every report.
61. An acknowledgement belongs to the repository. It holds for every
    asker, whoever gave it, and reaches every checkout the store
    reaches (50).

### A.6 Briefs

25. headwater gives a brief for any release a report holds when
    acknowledgements are disregarded (23), and for no other release.
    Asking for one reaches no lookup but the notes and advisory lookups,
    and writes nothing but notes it keeps whole (12).
26. A brief names every declaration of the dependency in the repository
    state, so a fixer can move every one. Each comes with the pin it
    gives, the claims it names and the release's mark against its range
    (56). A brief gives every advisory that names the release it moves
    to.
27. A brief prescribes nothing. It may name the move as the dependency's
    own ecosystem spells it (66), for the fixer to make, and names no
    other tool and no step a fixer must take. headwater never makes the
    move (36).
62. A brief gives what the published dependency changed between the pin
    and the release only whole and as upstream published it (11), and
    gives none of it where no notes lookup can say.

### A.7 Held state

28. headwater keeps its held state outside the repository's content.
    Every checkout of one repository shares one held state.
29. Everything in the held state but acknowledgements can be discarded.
    While every lookup answers as it did, the next scan of each tier
    rebuilds it with no report changed but the times it gives.
30. Two scans of one repository at once leave the held state as if one
    had run after the other. Each lookup's answer is kept for what it
    answers for, the later answer winning, and every acknowledgement
    stands untouched. Neither leaves the held state half written.
31. Every report is made from one reading of the repository state, and
    names its commit and whether it holds uncommitted changes. A report
    never mixes the declarations of two repository states.
63. headwater keeps what it holds by identity, release and lookup, never
    by repository state. A scan of any checkout, with uncommitted
    changes or without, writes the held state as any other scan does.

### A.8 Askers and surfaces

32. An answer depends on the repository state, the held state, the
    binding, the time it is asked and headwater's version, and on
    nothing else. The same question with all five the same gets the
    same answer, whoever asks and through whichever surface.
33. Every surface answers from one core. No surface computes a report,
    a brief, a due tier or an acknowledgement of its own.
34. Nothing headwater reports depends on which surface asked, which
    recorder will keep it, or which fixer will act on it, and headwater
    needs none of them to answer.
35. Every answer has one form a program reads, the same through every
    surface, and that form only ever gains fields.
36. headwater never acts on a release. A surface may hand a brief to a
    fixer, and the change the fixer makes is the fixer's.

### A.9 Lookups and what they learn

37. Nothing headwater or a lookup it asks sends beyond the asker's host
    carries anything of the repository but the identities and versions
    asked about. A lookup may be asked about many at once. The asker's
    own credentials identify the asker, by the asker's choice, and are
    nothing of the repository. The conformance suite checks this on
    recorded requests (52).
38. headwater reaches a lookup with the asker's own credentials or with
    none, and never keeps a credential in its held state.
39. A lookup's answer is reported as that lookup gave it, and headwater
    never chooses between answers it received. Releases that several
    lookups list are one release where their identities are one, and
    carry each lookup's account of it. A release one lookup lists and
    another does not list yet is no disagreement. Where two lookups'
    accounts of one release differ, the report names both, and a release
    two lookups' orders place differently is undecided (7).
64. A lookup that fails never erases what it answered before. The held
    state keeps the last answer and its time beside the failure, and
    every report gives both.
65. A lookup may run on the asker's host and read the repository state,
    to learn where and how its dependencies are published. It changes
    nothing in the repository state (5), and what it sends beyond the
    host is held to 37.

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The dependency description

40. **read-dependencies**: given a repository state, every dependency it
    declares, each with its identity and every declaration of it; and
    every declaration that could not be read, with the reason. Each
    declaration comes with the pin it gives. Wherever it states them, it
    also comes with its range, its label, its tag scheme, its claims,
    and where upstream keeps the dependency's releases and notes.
66. **describe-move**: given a declaration and a version, how the
    declaration's own ecosystem moves it to that version, as that
    ecosystem spells it, or that it spells none.

### B.2 The tiers declaration

41. **read-tiers**: given a repository state, its tiers, each with its
    cadence, the identities it names outright or by a prefix, and
    whether it asks for prereleases; and the default tier's cadence.
67. **read-binding**: given a repository state, the profiles it binds
    for each seam it names, or that it names none.
42. Every answer of a dependency description and of the tiers
    declaration is the same for the same repository state, and reading
    one changes nothing (5).

### B.3 The release lookup

43. **list-releases**: given an identity, and its tag scheme where a
    declaration states one, every release the lookup lists for it. Each
    comes with its version, date and link, whether the lookup marks it a
    prerelease, and whether it has been withdrawn. Or the answer is that
    the lookup could not be reached.
44. **order**: given an identity, its tag scheme where a declaration
    states one, and two versions, which is newer, that they are the
    same, or that their order cannot be decided.
68. **locate**: given an identity, where upstream keeps its releases and
    notes, or that this is unknown. A declaration may state it too
    (40).
45. The order is the version order (6). The same two versions of one
    identity under one tag scheme always order the same way.

### B.4 The notes lookup

46. **read-notes**: given an identity, a version and where upstream
    keeps its notes (68), what upstream wrote of that release, whole and
    unchanged; that it wrote nothing; or that the lookup could not be
    reached.
69. **read-changes**: given an identity and two versions, what the
    published dependency changed between them, whole and unchanged; that
    the lookup cannot say; or that it could not be reached.

### B.5 The advisory lookup

47. **read-advisories**: given an identity and a version, every advisory
    that names that version, each with its identity, its severity as the
    advisory gives it, and a link. Or the answer is that the lookup could
    not be reached.

### B.6 The store

48. **read**: given a repository, its held state and the version it was
    read at.
49. **write**: given a repository, the version read and the next held
    state. The write is all or nothing, and succeeds only if the held
    state is still at the version read (30).
50. The store holds nothing in the repository's content (28), and every
    checkout of one repository reaches the same store.

### B.7 Binding the contracts

51. Each seam is bound by naming one or more profiles of Part C. The
    repository's authors bind the dependency descriptions and the
    lookups in the repository state (67). For a seam the repository
    state binds nothing, every profile that recognises one of its
    declarations is bound. Any number of dependency descriptions,
    release lookups, notes lookups and advisory lookups are bound at
    once, each answering for the identities it knows. Exactly one tiers
    declaration is read, and exactly one store is written.
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

The version is in its ecosystem's normal form: PEP 440 normalised for
PyPI, and Semantic Versioning without a leading `v`. A tag's prefix
comes off by the tag scheme its declaration states, and the tag stays
the release's link: under a tag scheme whose prefix is `cli-v`, the tag
`cli-v1.2.3` is the version `1.2.3`.

### C.2 Dependency descriptions

| profile | declarations read | the pin | the range |
|---|---|---|---|
| **npm** | `package.json`'s `dependencies`, `devDependencies` and `optionalDependencies`, never `peerDependencies` | the version the lockfile resolves; unknown without a lockfile | the declaration's version range |
| **Python** | `pyproject.toml`'s project dependencies and dependency groups, and `requirements*.txt` | the version `uv.lock` or `poetry.lock` resolves, or a `==` requirement; unknown otherwise | the requirement's specifiers |
| **Cargo** | `Cargo.toml`'s normal, dev and build dependencies, in every workspace member | the version `Cargo.lock` resolves | the requirement, read as Cargo reads it |
| **Go** | `go.mod` requirements not marked `// indirect` | the version `go.mod` names | none |
| **mise** | `mise.toml` and `.tool-versions` tools | the version each names; unknown for `latest` or a prefix | the prefix it names |
| **GitHub Actions** | `uses:` in `.github/workflows` | the tag or version named; unknown for a branch | none |
| **container images** | `FROM` in a `Dockerfile` | the tag named; unknown for `latest` | none |
| **watch list** | a file of entries, each naming a dependency's Package URL, its label (the entry's name), its upstream repository, its tag scheme, its pin and its claims | as the entry gives it; swancloud's is generated from `lib/release-sources.nix` | none |

A lockfile that does not parse makes every dependency it would pin
unread (1), never of unknown pin.

Each declaration's identity:

| declaration | identity |
|---|---|
| an npm, Python, Cargo or Go dependency | the Package URL of its registry: `pkg:npm/<name>`, `pkg:pypi/<name>`, `pkg:cargo/<name>`, `pkg:golang/<module>` |
| a mise tool on a GitHub backend, and every GitHub Action | `pkg:github/<owner>/<repo>` |
| a mise core tool | `pkg:github/<owner>/<repo>` of its upstream's repository |
| a watch-list entry | the Package URL the entry names outright |

The move a brief names (66):

| profile | the move |
|---|---|
| **npm** | `npm update <name>` for a release inside the range, `npm install <name>@<version>` outside it |
| **Python** | `uv lock --upgrade-package <name>` |
| **Cargo** | `cargo update -p <name>` |
| **Go** | `go get <module>@<version>` |
| **mise** | `mise use <tool>@<version>` |
| **GitHub Actions**, **container images**, **watch list** | none; the brief names the declarations and their claims (26) |

### C.3 Release lookups

| profile | identities | list-releases / order |
|---|---|---|
| **each ecosystem's package manager** | npm, Go and mise, and Python and Cargo through their configured registry's index | `npm view` and `npm outdated`, `go list -m -versions`, `mise ls-remote`, and the configured index for Python and Cargo, run in the repository's own shell; order by the ecosystem's own rules |
| **deps.dev** | npm, PyPI, Cargo, Go, Maven, NuGet and RubyGems, where no package manager runs for the identity | the versions and dates of a batched Package URL lookup, with no key; order by the ecosystem's own rules |
| **a registry's own API** | the registry's packages | the registry's version list, for a release deps.dev has not seen yet; order as above |
| **GitHub releases** | `pkg:github/*`, and any dependency whose upstream repository is on GitHub | the repository's releases through GraphQL, fifty repositories a query, with the asker's own `gh` sign-in (38); order by Semantic Versioning where the tags parse, by the declaration's tag scheme otherwise |
| **ecosyste.ms** | GitHub Actions, container images, Homebrew, nixpkgs and the other registries it indexes | its packages API by Package URL |

The package manager runs in the repository's own shell, so it sees the
registries the repository is configured for, private ones among them.
It runs only commands that read, and only where entering the shell and
running them write nothing in the repository's content, history or
configuration (5, 65). Where they would, no package manager runs, and
deps.dev, GitHub and ecosyste.ms answer. deps.dev declines an identity a
package manager answers for, so the two never give answers to choose
between (39).

Order by ecosystem: Semantic Versioning 2.0.0 for npm, Cargo and
GitHub tags that parse; PEP 440 for PyPI; Go's module rules; and a
calendar version compared field by field where the declaration's tag
scheme says so. GitHub releases mark a prerelease with GitHub's own
flag. Where a lookup gives no prerelease mark, the version's grammar
gives it: Semantic Versioning's pre-release identifiers, and PEP 440's
`a`, `b`, `rc` and `dev`.

**locate** (68) answers with the upstream repository a declaration
states, as a watch-list entry does, or else with the repository the
package's registry entry links, read through deps.dev or the package
manager.

### C.4 Notes lookups

| profile | operation | how |
|---|---|---|
| **GitHub release** | read-notes | the body of the GitHub release at the version's tag in the repository locate gives (68) |
| **changelog** | read-notes | the section for the version in that repository's `CHANGELOG.md` at that tag, where no release body exists; a repository that binds it to answer always gets both, each named (39) |
| **npm** | read-changes | `npm diff` between the published packages of the two versions, so a README or CHANGELOG change shows as upstream shipped it |

Every other notes lookup answers read-changes with "cannot say".

### C.5 Advisory lookup: OSV

| operation | how OSV satisfies it |
|---|---|
| read-advisories | OSV's batched query by Package URL and version; severity as the advisory gives it |

### C.6 Store: the git directory

| operation | how the git directory satisfies it |
|---|---|
| read | the files under `<git common dir>/headwater/`, which every worktree of the clone shares (28) |
| write | a new file written beside the old and renamed over it, under a lock held for the write (30, 49) |

A repository is one clone: its worktrees share one held state, and a
clone on another host keeps its own. Acknowledgements stay in the clone
(61). A fleet whose recorder keeps releases, as millpond keeps them in
an inbox, dismisses a release with a curation drop there, which never
writes headwater's held state. Notes are kept whole under the same
directory, never in the repository's content.

### C.7 Tiers declaration: `.config/headwater.toml`

A repository declares itself to headwater in `.config/headwater.toml`,
read from the repository state.

| operation | how the file satisfies it |
|---|---|
| read-tiers | each tier's name, its cadence, the Package URLs it names outright or by a prefix, and whether it asks for prereleases; and the default tier's cadence, seven days where the file sets none |
| read-binding | the profiles named for each seam, and whether the changelog profile answers always |

A repository with no such file has the default tier alone, with a
cadence of seven days, and binds every profile that recognises one of
its declarations (51).

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** headwater never changes a repository, and never acts on a
  release (5, 36).
- **I2.** The pin alone decides what is new (9).
- **I3.** Upstream's words reach the asker as upstream wrote them, with
  no model between (11, 19, 62).
- **I4.** A release has one identity for ever, everywhere (10).
- **I5.** Asking what headwater holds reaches no lookup and writes
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
- Recording releases as anyone's own records. A recorder does that,
  from what a surface hands it.
- Telling anyone by itself. A surface tells, when its asker asks.
- Hiding the asker from a lookup. A lookup reached with the asker's
  credentials knows who asked.
- Licences and software bills of materials.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- Repositories are git repositories.
- An identity is a Package URL (ECMA-427).
- The askers include coding agents working in many checkouts of one
  repository at once.
- Lookups are reached over the network or run on the asker's host, with
  the asker's own credentials where a lookup needs any.
- headwater is free and open source.

The rest of the stack, which a model builds on unless it says why not:

- One static binary, written in Rust, as sluice is.
- Every answer as JSON on request, the form of (35).
- Four surfaces answer from one core, each a plugin kept outside the
  core as sluice keeps its plugins:
  - A command line.
  - A Claude Code plugin, which notes new releases at a session's start
    and hands a release's brief to flume.
  - A herdr plugin with a sidebar row, a popup and a key that hands a
    release's brief to flume. flume starts an agent in a worktree of its
    own to make the change, and submits it.
  - A Flywheel plugin holding the adapter millpond runs, built with the
    family's shared crates. On each run the adapter prints, in the
    capture contract, one capture for each release newer than its pin,
    and millpond lands each one once.
- The capture the adapter prints for a release:
  - its key is `release/<label>/<version>` for a dependency a watch list
    labels, the key swancloud's release records use, and
    `release/<type>/<namespace>/<name>/<version>` from its Package URL
    for every other;
  - its source is `release`, and its event time the release's date;
  - its raw material holds the notes whole, and what the lookups
    answered;
  - it is its own excerpt: the notes, asserted by the upstream, of kind
    `ask`, saying that the release is out and what the repository pins,
    and arguing with the declarations a move changes.
- The profiles of Part C: the watch list, npm, Python, each ecosystem's
  package manager, GitHub releases, deps.dev, OSV,
  `.config/headwater.toml` and the git directory first.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- What store profile shares one held state, its acknowledgements among
  it, between clones of one repository on several hosts (28, 50, 61)?

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** A colleague opens a session in a repository that declares its
  packages and its Python requirements. Two dependencies of the
  favorites tier have newer releases, and the session is told of both
  with their notes. Nothing in the repository changes.
- **S2.** The same session starts again an hour later. No tier is due,
  no lookup is reached, and the session is told the same two releases
  and when they were found.
- **S3.** One favorite's release lookup cannot be reached. The report
  names it unread with the reason, reports the other favorites, and the
  tier is still due at the next start.
- **S4.** A fixer moves one favorite to its newest release, and the
  change lands. The next scan no longer reports that release, and no
  acknowledgement was given.
- **S5.** A person dismisses a release. No later report holds it. When
  a newer release is published, that one is reported.
- **S6.** A recorder asks for the favorites' releases every day. A
  release is reported every day, under the same identity, until its pin
  moves, and the recorder keeps it once.
- **S7.** A release's notes run to forty kibibytes. A report that holds
  it and a brief for it give the notes whole, or the portion asked for
  and a way to read the rest, and not one word is changed.
- **S8.** Two checkouts of one repository scan at once. The held state
  afterwards is as if one had scanned after the other, whole, and every
  acknowledgement stands.
- **S9.** The held state is deleted, apart from its acknowledgements,
  and every lookup answers as it did. The next scan of each tier
  reports exactly what the last one did, at a new time.
- **S10.** An advisory names a pin. Every report that holds the
  dependency names the advisory, though a person dismissed the release
  that would fix it.
- **S11.** A watch list names fourteen tools by their Package URLs,
  upstream repositories and tag schemes. Each release is reported under
  the same identity a declaration of that tool would give it.
- **S12.** A person asks through the command line, an agent through its
  session and a pane through its sidebar, about one repository state.
  All three get the same report.
- **S13.** A favorite is declared with a range that admits its minor
  releases, and two releases are newer than its pin, one a minor and
  one a major. The report holds both, the minor marked inside the range
  and the major outside it. The major's brief names the move as the
  ecosystem spells it, and nothing in the repository changes.
- **S14.** Two tiers name one identity outright. That dependency is
  reported unread, naming both tiers, both tiers stay due, and every
  other dependency is reported as usual.
- **S15.** A favorite's release lookup answered yesterday and fails
  today. The report gives yesterday's answer and its time beside the
  failure, and the tier stays due.

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of headwater that satisfies Parts A and B: its components, the
answers each surface gives, how a scan is made and a report derived,
with fixed examples, and how a dependency description, a lookup and a
store are added. A conformance suite whose scenarios each cite the
clauses they exercise, failing when a clause is cited by nothing. The
profiles of Part C, each passing the suite.

<!-- ANCHOR_END: deliver -->
