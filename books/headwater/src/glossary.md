# Glossary

The words of the design, each defined once. The statement's vocabulary
(section 3) is the binding copy of the words it defines, and its actors
table (section 2) of the actors. The capture words come from
`design/capture/design.md`, and millpond's book defines them in full.

## The statement's words

| word | meaning |
|---|---|
| **repository state** | the content of a repository at one commit, together with any uncommitted change the asker names as part of it |
| **dependency** | something published apart from the repository that its authors chose to use: a package, a tool, an image, or another repository's releases |
| **declaration** | one place in a repository state that names a dependency, and what it says of the version |
| **identity** | the one name of a dependency that every declaration, source and asker uses for it; a Package URL without its version |
| **pin** | the version a repository state runs of a dependency, or **unknown** when the state names no single version |
| **source** | where upstream publishes a dependency's releases, or an index of those places; a **release source**, **notes source** or **advisory source** by what it gives |
| **release** | one version of a dependency that its source publishes, with its date and a link to it |
| **version order** | how a dependency's source orders its versions |
| **newer** | of a release against a pin, later in the dependency's version order |
| **notes** | what upstream wrote of a release, as upstream wrote it |
| **advisory** | a published warning that names versions of a dependency as unsafe |
| **tier** | a named set of a repository's dependencies, with a cadence; the **default tier** holds every dependency no other tier names |
| **cadence** | the longest time a tier may go without a complete scan while scans are asked for |
| **due** | of a tier, that its cadence has passed since its last complete scan, or that it has never had one |
| **scan** | one reading of a repository state's dependencies and of the sources of those in the tiers it covers |
| **complete** | of a tier's scan, that every dependency of the tier was read and every source reached |
| **unread** | of a dependency in a scan, that headwater could not read its declarations or reach its source, with the reason |
| **report** | what a scan found: for each dependency of the tiers it covers, its pin, the releases newer than it, the advisories that name it, or that it is unread |
| **acknowledgement** | a person's word, or an acting session's, on one release of one dependency: **dismissed**, or **skipped** until a newer release |
| **brief** | everything a fixer needs to move one dependency to one release: the release, its notes, its advisories, and every declaration of the dependency |
| **held state** | everything headwater keeps of its own for one repository |
| **surface** | one way an asker reaches headwater |
| **profile** | one way a contract of Part B is satisfied, as Part C describes |

## The actors

| word | meaning |
|---|---|
| **asker** | a person, a coding agent, a surface, a recorder or a scheduler that asks headwater about a repository |
| **fixer** | a coding agent or a person who makes changes, and decides whether and how to move a pin, given a brief |
| **recorder** | a program that keeps what it hears as its own records, and never writes headwater's state |
| **upstream** | whoever publishes a dependency, deciding what is released, when, under which version, and what its notes say |

## Words the design adds

| word | meaning |
|---|---|
| **undecided** | of a release, that its order against the pin cannot be decided; reported beside the newer releases (7) |
| **affected** | of a dependency, that an advisory names its pin (18) |
| **withdrawn** | of a release, that its source has withdrawn it, as the source says (43) |
| **seam** | one of the five contracts of Part B through which the core reaches everything that is not git |
| **binding** | the profiles named for each seam: any number of descriptions and sources, and exactly one store (51) |
| **conformance suite** | the one set of scenarios that holds every profile to Parts A and B, each citing the clauses it exercises (52) |
| **Package URL** | the standard name of a package across ecosystems (ECMA-427), such as `pkg:npm/react`; with a version, a release's identity (C.1) |
| **watch list** | a dependency description that names each dependency's upstream repository, tag pattern, pin, tier, name and claims (C.2) |
| **claims** | the files a bump of a watch-list entry moves |
| **plugin** | the installable unit of a host: Claude Code, herdr or Flywheel; headwater keeps one per host under `plugins/` |

## Capture words

| word | meaning |
|---|---|
| **capture** | the record of one event outside a repository, kept once in an inbox under its key |
| **adapter part** | the part of a Flywheel plugin that lists one source's events and prints each as a capture line; headwater's is `headwater capture` |
| **key** | a capture's identity: the same event gets the same key from every host and every run |
| **excerpt** | the quote a capture carries when it is its own excerpt, as a release's notes are |
| **inbox** | where millpond keeps captures, signals, moves and items: a git repository, or a branch in one |
| **millpond** | the inbox's tool: it runs adapters, keeps captures and signals, and serves curation ([its book](../millpond/)) |
