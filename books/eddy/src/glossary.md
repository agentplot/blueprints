# Glossary

The words of the design, each defined once. eddy has no statement yet,
so the capture design (`design/capture/design.md`) is the binding copy.
millpond's book owns the words of the inbox, readers and curation
([millpond's book](../millpond/)); the entries marked *millpond* repeat
its meaning in one line for a reader of this book.

| word | meaning |
|---|---|
| **adapter** | a program that lists one source's events, keys each one, fetches the raw material, and prints capture lines; it writes no record and keeps no list of what it reported |
| **part** | one adapter inside a plugin, run as a command; eddy holds one part per meeting service |
| **meeting part** | a part that passes the meeting checks, eddy's or anyone's |
| **the core** | eddy's code that lists and fetches meetings for each service it has a part for, with the code every part shares; every plugin calls it |
| **plugin** | the installable unit in every host, holding parts of the kinds the host takes; Flywheel's statement calls it a package (228) |
| **plugin index** | the file that lists published plugins, each a git repository at a tag; the shipped set is the default index (228) |
| **capture** | *millpond*: one source event as recorded, once, with its source, its event date and a pointer to its raw material (111) |
| **capture contract** | *millpond*: the one way captures reach an inbox: JSON Lines an adapter prints, each holding one of `capture`, `cursor` or `done` |
| **capture line** | one `capture` object of the contract, describing one event: its key, source, `event_at`, title, `url` and raw files |
| **key** | a source event's identity, the same from every host and every run; a meeting's is `meeting/<service>/<meeting id>` |
| **`event_at`** | when the event happened, in RFC 3339; for a meeting, when it started (118) |
| **cursor** | a part's own mark of where its last complete run reached; millpond keeps it and hands it back, and reads nothing in it |
| **run** | one start of a part by millpond or Flywheel, ending in a `done` line or failing |
| **tick** | the host's scheduler, which runs every part whose schedule is due (231) |
| **raw directory** | the fresh directory a host hands a part for one run, where it writes raw files |
| **raw files** | the material as the source served it, whole; for a meeting, the transcript as served and the plain copy |
| **plain copy** | a meeting's transcript with one line per turn, the same shape from every part |
| **turn** | what one speaker says in a meeting before the next speaker starts |
| **raw bank** | *millpond*: the host's store of raw files, outside git, keyed by inbox and capture; a capture points into it as `<host>:<path>` (217h) |
| **excerpt** | the verbatim quote a signal carries (113); a meeting capture carries none |
| **unread** | a capture with no excerpt, waiting for a reader; every meeting capture lands unread |
| **inbox** | *millpond*: a git repository, or a branch in one, holding captures, signals, moves and items |
| **signal** | *millpond*: one assertion read from a capture, with its kind, who asserted it and its verbatim excerpt (113) |
| **reader** | *millpond*: a session that reads an unread capture into signals through millpond; the one place a model reads a meeting (115) |
| **verbatim check** | *millpond*: its refusal of a signal whose excerpt does not appear verbatim in its capture's raw material |
| **curation** | *millpond*: a session that gives each signal one move, in batches the operator accepts or changes (116) |
| **conformance pack** | flywheel-next's set of contract lines and the records a host must write from them, which proves every host and every adapter part |
| **meeting checks** | the checks in the conformance pack that a part passes to count as a meeting part |
| **generic MCP part** | the part that lists meetings from any MCP endpoint that serves transcripts |
| **folder drop** | millpond's built-in adapter, for which each file dropped in a watched folder is one capture |
| **operator** | the person an inbox serves, who accepts or changes curation's moves, sends items and keeps the reader's instructions |
| **partition** | one domain of a person's work, such as one business or one client, with its own inbox |
