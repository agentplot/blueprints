# Glossary

The words of the design, each defined once. The statement's vocabulary
(section 3) is the binding copy of the words it defines, and its actors
table (section 2) of the actors. The words of the capture design and of
crew are [millpond's book](../millpond/glossary.html)'s, word for word,
and the words for a sounding and for flume are
[sounding's book](../sounding/glossary.html)'s.
A number after "Flywheel's" in them cites Flywheel's statement.

millpond's book uses three of the statement's words for other things.
A capture's **source** names where its event came from, such as
`release`. An item's **brief** is the text its work starts from. An
**unread** capture waits for a reader. In this book each keeps the
statement's meaning.

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
| **range** | what a declaration says of the versions it takes, such as `^1.4` or `>=1.4,<2`; a release inside it needs only the lockfile changed, one outside it a change to the manifest (`design/capture/design.md`) |
| **watch list** | a dependency description that names each dependency's upstream repository, tag pattern, pin, tier, name and the files a bump moves (C.2) |
| **millpond** | the inbox: it runs adapters, keeps captures and signals, serves the tools curation works through, and sends an item on ([its book](../millpond/)) |

## Words from millpond's book

| word | meaning |
|---|---|
| **adapter** | a program that knows one source: it lists the source's events, keys each one, fetches the raw material, marks a capture that is its own excerpt, and prints contract lines (Flywheel's 115) |
| **adapter part** | a plugin's part of the adapter kind: a command, the shape of its configuration, and the secrets it needs (Flywheel's 228) |
| **bolt** | in crew, a team's branch of work: its units and chores land on it, and it lands on the shared branch |
| **capture** | the record of one source event: its key, its source, its event date and a pointer to its raw material; the same event captured twice is one capture (Flywheel's 111) |
| **chore** | in crew, a piece of work that needs no design of its own, such as a tool's bump; a `route` move offers one |
| **curation** | a Claude session that proposes one move per signal, in batches, through millpond's tools; the operator accepts or changes each batch (Flywheel's 116) |
| **dedupe** | millpond's lookup of each capture's key in every capture the inbox holds, so a key lands once |
| **excerpt** | the verbatim text a signal quotes from its source, with its position (Flywheel's 113) |
| **inbox** | a git repository, or a branch in one, holding captures, signals, moves and items in Flywheel's record formats |
| **item** | the unit of work: the signals curation joined, one or many, with its brief and its sends; Flywheel's proposed intent (Flywheel's 109) |
| **key** | a source event's identity, the same from every host and every run (Flywheel's 111) |
| **move** | the one standing decision on a signal: drop, answered, challenge, join, attach or route, each with a stated consequence (Flywheel's 107, 116) |
| **own excerpt** | a capture is its own excerpt when its line carries the signal's fields, so millpond writes its one signal as it lands; a release is one |
| **planner** | crew's agent that orders items across teams and turns each into a chore or a unit |
| **plugin** | the installable unit in every host, holding parts; Flywheel's statement calls it a package, and a named set of parts a bundle (Flywheel's 228, 284) |
| **reader** | a Claude session that turns an unread capture into signals with millpond's `read` tool |
| **route** | the move that offers a chore, which becomes an item of one, or an ask, which millpond records |
| **signal** | one assertion from a capture: its kind, who asserted it, its subjects, the assertion in a sentence, the verbatim excerpt with its position, and the claims it argues with; never changed once written (Flywheel's 113) |
| **unit** | in crew, one designed piece of a team's work, landed on its bolt |

## Words from sounding's book

| word | meaning |
|---|---|
| **conclusion** | `conclusion.md`: the answer, its evidence, what it would change, the work it proposes, and what stays open; the operator decides it |
| **flume** | the tool that launches and tracks one agent in one worktree through a kind's stages, on the host it runs on, and tidies the place when the work lands or is dropped ([its book](../flume/)) |
| **sounding** | one question, worked by one session in one place, ending on one conclusion; also the tool that runs them ([its book](../sounding/)) |
