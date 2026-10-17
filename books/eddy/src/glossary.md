# Glossary

The words of the design, each defined once. eddy has no statement yet,
so the capture design (`design/capture/design.md`) is the binding copy.
A number in parentheses cites Flywheel's statement.

## eddy's words

| word | meaning |
|---|---|
| **the core** | eddy's code that lists and fetches meetings for each service it has a part for, with the code every part shares; every plugin calls it |
| **meeting part** | an adapter part that passes the meeting checks, eddy's or anyone's |
| **meeting checks** | the checks in the conformance pack that an adapter part passes to count as a meeting part |
| **generic MCP part** | the adapter part that lists meetings from any MCP endpoint that serves transcripts |
| **plugin index** | the file that lists published plugins, each a git repository at a tag; the shipped set is the default index (228) |
| **capture line** | one `capture` object of the capture contract, describing one event: its key, source, `event_at`, title, `url` and raw files |
| **raw directory** | the fresh directory a host hands an adapter part for one run, where it writes its raw files |
| **a meeting's raw files** | the transcript as served and the plain copy, a meeting part's raw material |
| **plain copy** | a meeting's transcript with one line per turn, the same shape from every part |
| **turn** | what one speaker says in a meeting before the next speaker starts |
| **verbatim check** | millpond's refusal of a signal whose excerpt does not appear verbatim in its capture's raw material |

## millpond's words

millpond's book defines these, and this page gives its definitions
word for word ([millpond's glossary](../millpond/glossary.html)).

| word | meaning |
|---|---|
| **adapter** | a program that knows one source: it lists the source's events, keys each one, fetches the raw material, marks a capture that is its own excerpt, and prints contract lines (115) |
| **adapter part** | a plugin's part of the adapter kind: a command, the shape of its configuration, and the secrets it needs (228) |
| **capture** | the record of one source event: its key, its source, its event date and a pointer to its raw material; the same event captured twice is one capture (111) |
| **capture contract** | the JSON Lines an adapter prints and every host takes, each line holding exactly one of `capture`, `cursor` or `done` |
| **conformance pack** | contract lines and the records a host must write from them, with the meeting checks; every host and every adapter part passes it |
| **curation** | a Claude session that proposes one move per signal, in batches, through millpond's tools; the operator accepts or changes each batch (116) |
| **cursor** | a value only its adapter understands, kept from the part's last run that ended in `done` and handed back on the next |
| **dedupe** | millpond's lookup of each capture's key in every capture the inbox holds, so a key lands once |
| **event date** | `event_at`: when the event happened, never when it was captured (118) |
| **excerpt** | the verbatim text a signal quotes from its source, with its position (113) |
| **flywheel branch** | the branch of crew's state repository that holds a partition's signals; it becomes the partition's inbox |
| **folder drop** | the built-in adapter that makes one capture of each file dropped in a watched folder |
| **inbox** | a git repository, or a branch in one, holding captures, signals, moves and items in Flywheel's record formats |
| **key** | a source event's identity, the same from every host and every run (111) |
| **meeting file** | the built-in adapter for a meeting's transcript file |
| **operator** | the person who accepts or changes each batch of moves and sends items; on its own, the user |
| **part** | one thing of one kind in a plugin; an inbox's settings name the adapter parts it runs |
| **partition** | in crew, one domain of work with its own teams and its own flywheel branch |
| **plugin** | the installable unit in every host, holding parts; Flywheel's statement calls it a package, and a named set of parts a bundle (228, 284) |
| **pointer** | `<host>:<path>`, where a capture's raw material is banked (217h) |
| **raw bank** | a host's store of raw material, under millpond's data directory, keyed by inbox and capture; never in git |
| **raw material** | the event as its source served it, whole: notes, a transcript, a log; the adapter writes it as raw files |
| **reader** | a Claude session that turns an unread capture into signals with millpond's `read` tool |
| **run** | one start of an adapter part by `millpond run`, complete when it ends in `done` |
| **schedule** | when a part runs: five-field cron, a missed run caught up once |
| **settings** | `millpond.toml` at the inbox's root: its parts, its cut, its reader command, and where items go |
| **signal** | one assertion from a capture: its kind, who asserted it, its subjects, the assertion in a sentence, the verbatim excerpt with its position, and the claims it argues with; never changed once written (113) |
| **source** | where events come from, named in each capture: `release`, `meeting`, `folder`, `deploy` |
| **tick** | `millpond tick`, which runs every part of an inbox whose schedule is due |
| **unread** | a capture with no excerpt, waiting for a reader |
