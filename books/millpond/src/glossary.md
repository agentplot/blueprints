# Glossary

The words of the design, each defined once, as the capture design
(`design/capture/design.md`) uses them. headwater's and eddy's books
use the same words for the same things. A number in parentheses cites
Flywheel's statement, whose record formats and moves millpond keeps.

| word | meaning |
|---|---|
| **adapter** | a program that knows one source: it lists the source's events, keys each one, fetches the raw material, marks a capture that is its own excerpt, and prints contract lines (115) |
| **adapter part** | a plugin's part of the adapter kind: a command, the shape of its configuration, and the secrets it needs (228) |
| **answered** | the move that names the claim or record that settled a signal |
| **attach** | the move that puts a signal on an item already sent |
| **batch** | the moves a curation session proposes together, which the operator accepts or changes and one `moves` call writes in one commit |
| **brief** | the text an item's work starts from, written by the curation session and kept on the item |
| **capture** | the record of one source event: its key, its source, its event date and a pointer to its raw material; the same event captured twice is one capture (111) |
| **capture contract** | the JSON Lines an adapter prints and every host takes, each line holding exactly one of `capture`, `cursor` or `done` |
| **challenge** | the move that weighs a signal against a claim, in an inbox beside Flywheel's claims |
| **bolt** | in crew, a team's branch of work: its units and chores land on it, and it lands on the shared branch |
| **chore** | in crew, a piece of work that needs no design of its own, such as a tool's bump; a `route` move offers one |
| **claim** | in Flywheel, a standing statement of what a repository must satisfy; `answered` and `challenge` name one |
| **conformance pack** | contract lines and the records a host must write from them, with the meeting checks; every host and every adapter part passes it |
| **cursor** | a value only its adapter understands, kept from the part's last run that ended in `done` and handed back on the next |
| **cut** | where millpond ends an own-excerpt signal's text: at a line under the inbox's limit, 8 KiB unless its settings say otherwise. A closing line says how much the raw record holds beyond it |
| **dedupe** | millpond's lookup of each capture's key in every capture the inbox holds, so a key lands once |
| **drop** | the move that records why a signal leads nowhere |
| **event date** | `event_at`: when the event happened, never when it was captured (118) |
| **excerpt** | the verbatim text a signal quotes from its source, with its position (113) |
| **flywheel branch** | the branch of crew's state repository that holds a partition's signals; it becomes the partition's inbox |
| **folder drop** | the built-in adapter that makes one capture of each file dropped in a watched folder |
| **inbox** | a git repository, or a branch in one, holding captures, signals, moves and items in Flywheel's record formats |
| **item** | the unit of work: the signals curation joined, one or many, with its brief and its sends; Flywheel's proposed intent (109) |
| **join** | the move that makes an item from signals, or grows one still proposed |
| **key** | a source event's identity, the same from every host and every run (111) |
| **kind** | a signal's type, one of constraint, ask, question, commitment and reaction (113) |
| **meeting file** | the built-in adapter for a meeting's transcript file |
| **move** | the one standing decision on a signal: drop, answered, challenge, join, attach or route, each with a stated consequence (107, 116) |
| **operator** | the person who accepts or changes each batch of moves and sends items; on its own, the user |
| **own excerpt** | a capture is its own excerpt when its line carries the signal's fields, so millpond writes its one signal as it lands; a release is one |
| **part** | one thing of one kind in a plugin; an inbox's settings name the adapter parts it runs |
| **partition** | in crew, one domain of work with its own teams and its own flywheel branch |
| **planner** | crew's agent that orders items across teams and turns each into a chore or a unit |
| **plugin** | the installable unit in every host, holding parts; Flywheel's statement calls it a package, and a named set of parts a bundle (228, 284) |
| **pointer** | `<host>:<path>`, where a capture's raw material is banked (217h) |
| **raw bank** | a host's store of raw material, under millpond's data directory, keyed by inbox and capture; never in git |
| **raw material** | the event as its source served it, whole: notes, a transcript, a log; the adapter writes it as raw files |
| **reader** | a Claude session that turns an unread capture into signals with millpond's `read` tool |
| **rec** | the plain-text record format of GNU recutils, in which records rest |
| **route** | the move that offers a chore, which becomes an item of one, or an ask, which millpond records |
| **run** | one start of an adapter part by `millpond run`, complete when it ends in `done` |
| **schedule** | when a part runs: five-field cron, a missed run caught up once |
| **send** | millpond giving one item to one worktree, with its brief and an agent |
| **settings** | `millpond.toml` at the inbox's root: its parts, its cut, its reader command, and where items go |
| **setup** | one of the three ways millpond runs: on its own, with crew, or with Flywheel |
| **signal** | one assertion from a capture: its kind, who asserted it, its subjects, the assertion in a sentence, the verbatim excerpt with its position, and the claims it argues with; never changed once written (113) |
| **source** | where events come from, named in each capture: `release`, `meeting`, `folder`, `deploy` |
| **tick** | `millpond tick`, which runs every part of an inbox whose schedule is due |
| **unit** | in crew, one designed piece of a team's work, landed on its bolt |
| **unmoved** | a signal with no move yet |
| **unread** | a capture with no excerpt, waiting for a reader |
| **watch list** | the list of tools a repository pins, from which headwater reads each pin; headwater's book defines it |
| **weight** | how much a proposed item's signals count: how many, from which sources, over what span, by event date (109, 118) |
