# Sources

millpond runs adapters and writes none of their logic into its core.
Where an adapter ships depends on what its source needs.

## Built in or shipped with its tool

An adapter whose source needs no other tool ships inside millpond: the
folder drop, the meeting file and the signals-folder import, all from
flywheel-next's adapters crate. Each is a command of millpond's own
that prints contract lines.

An adapter that wraps another tool's domain ships with that tool, so
headwater's and eddy's parts stay theirs, and millpond runs them like
anyone else's. A tool for dependencies, or for meetings, has a life of
its own beside millpond, with its own plugins, and its adapter part is
one more way in.

## The folder drop

A file dropped in a watched folder is one capture. That covers a
meeting transcript downloaded by hand, an email saved as `.eml`, or a
PDF.

- **The adapter** is Flywheel's folder adapter (215):
  `millpond capture folder <dir>` prints contract lines.
- **The key** is `folder/<folder name>/<sha256 of the file>`, so a file
  dropped twice, or under another name, is one capture (111).
- **`event_at`** is the date the file's name begins with, or else its
  last write.
- **`source`** is `folder`. No capture carries an excerpt, so a reader
  reads each one and tells a transcript from an email by what it holds.

A service that sends many files of one kind earns a part of its own.
Until then the folder takes them.

## The meeting file

`millpond capture meeting` is Flywheel's meeting transcript adapter
(215), built into millpond from the same crate. It carries no excerpt,
so a reader reads what it captures, as for any meeting.

## The signals-folder import

`millpond import` carries work that predates an inbox into it once,
keeping each capture's key, source, event date, signals and moves as
they were read (114). [The inbox](inbox.md#what-comes-in-once) says
what it imports.

## Releases, from headwater

headwater reports every release newer than each pin a repository
declares, with its notes and advisories. Its book,
[../headwater/](../headwater/), holds the design. millpond sees it
through its Flywheel plugin's adapter part, `headwater capture`, which
prints one capture per newly reported release:

- `source` is `release`, and `event_at` is when the release was
  published;
- `raw` holds the notes whole, plus what the lookup answered;
- the excerpt is the notes, asserted by the upstream, of kind `ask`,
  asserting "`<name>` `<version>` is released; the repository pins
  `<pin>`", and arguing with the declarations a bump moves.

The key is `release/<name>/<version>` for an entry of a watch list,
under the name the list gives it. headwater keys every other release
by its Package URL identity,
`release/<type>/<namespace>/<name>/<version>`.

The pin decides what is new, and headwater keeps no list of what it
reported (headwater 9). millpond's dedupe by key lands each release
once. In a repository crew runs, headwater's fix key in herdr hands the
release to millpond as a capture, and no agent starts outside crew's
plan.

## Meetings, from eddy

Listing meetings is arithmetic and reading them is judgment, so a
program lists them and a session reads them (115). eddy lists and
fetches meetings across services. Its book, [../eddy/](../eddy/), holds
the design. Its Flywheel plugin holds one adapter part per meeting
service. Each part lists recorded meetings since its cursor, keys a
meeting by its service and the meeting's own id, writes the transcript
as raw, and carries no excerpt. `event_at` is when the meeting started
(118).

| Part | Source | Key |
|---|---|---|
| `wispr` | Wispr Flow's MCP endpoint, through an MCP client with its own sign-in; no Claude session runs to list meetings | `meeting/wispr/<meeting id>` |
| `webex` | Webex's transcripts API | `meeting/webex/<meeting id>` |
| `teams` | Microsoft Graph's meeting transcripts | `meeting/teams/<meeting id>` |

eddy's [parts](../eddy/parts.html) chapter holds each service's part.
A part counts as a meeting part when it passes the meeting checks in
the conformance pack ([../eddy/contributing.html](../eddy/contributing.html)). Anyone can publish a meeting plugin of their own,
listed in the plugin index beside eddy's (228). A generic part lists
meetings from any MCP endpoint that serves transcripts, and the folder
drop takes the rest.

## Sources already built

- **crew's own signals**, its agents' and the operator's findings, go
  through `crew signal`, which writes through millpond.
- **swancloud's deployer** pipes a failed step's capture to
  `millpond land`, with the step's last lines as its excerpt.
- **Flywheel's** page capture box and chat forwards arrive when
  Flywheel hosts the inbox.
