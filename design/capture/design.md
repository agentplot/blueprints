# Capture

Some events outside a repository should change its work: a release of
something it depends on, a decision in a meeting, a deploy that failed.
Each one reaches the work the same way. A program notices the event and
hands it to millpond, which records it once as a capture in an inbox.
The capture becomes signals, either mechanically when it is its own
excerpt or through a reader session. Curation gives each signal one
move and joins signals into items. An item goes to one worktree, or
into crew's plan, and the work it becomes lands through sluice. An item
that asks a question goes to a sounding, which ends on a conclusion the
operator accepts.

This design covers every part that does this:

- **headwater** reports releases and advisories for what a repository
  declares (`design/headwater/requirements.md`).
- **eddy** lists recorded meetings from each meeting service.
- **millpond** is the inbox. It runs adapters, keeps captures and
  signals, serves the tools a curation session works through, and sends
  an item to a worktree.
- **sounding** works one question in one session, in a worktree of its
  own, and ends on a conclusion the operator accepts, sends back for
  another round, or drops.
- **sluice** tests a change as merged and lands it.
- **crew** runs teams, plans and bolts. It calls millpond's command
  line as it calls sluice's.
- **Flywheel** is built later on the same crates as millpond and reads
  the same inboxes. crew becomes it (crew ADR 0026: "crew becomes
  flywheel").
- **swancloud** is the first fleet that runs all of it.

`plan.md` beside this file orders the work.

A bare clause number cites Flywheel's statement
(`design/flywheel-next/requirements.md`). A number prefixed `headwater`
cites headwater's statement. A rule id such as `signals.6` cites crew's
`docs/architecture/`. `inputs.6` is swancloud's. millpond's statement,
`design/millpond/requirements.md`, is written from this design first
(plan step P1).

## What each part owns

| Part | Owns | Never |
|---|---|---|
| An adapter | One source. It lists the source's events, keys each one, fetches the raw material, and marks a capture that is its own excerpt. | Writes records, keeps a list of what it reported, cuts an excerpt, or reads a capture into signals (115). |
| headwater | Releases and advisories for what a repository declares. It stands alone with its Claude Code and herdr plugins, and its Flywheel plugin holds an adapter part. | Knows which inbox records its releases. |
| eddy | Recorded meetings across meeting services, with a part per service. It stands alone as headwater does. | Reads a meeting into signals. |
| millpond | Runs adapters and takes the capture contract. Dedupes by key, banks raw material, and writes each capture, plus the one signal of a capture that is its own excerpt. Keeps the inbox, checks a reader's excerpts, writes moves and items, sends an item to a worktree, and records each run. | Judges what a capture says, or plans across items. |
| A reader, a session | Reads a capture that is not its own excerpt into signals, through millpond (113, 217e). | Lists a source. |
| Curation, a session | Proposes one move per signal, in batches, through millpond's tools (116). | Writes captures or signals. |
| sounding | One question in one session, in a worktree of its own, ending on a conclusion. It offers each finding beyond its question to millpond as a capture. | Lands code, writes the inbox except through millpond, or plans across items. |
| The operator | Accepts or changes each batch of moves, sends an item, and decides each conclusion. | Picks through signals one at a time. |
| crew | Teams, plans and bolts. Its planner turns items into chores and units across teams. | Writes an inbox's records except through millpond. |
| sluice | Tests a change as merged and lands it. | Knows where the change came from. |
| The fleet (swancloud) | Says which adapter part runs for which inbox, on which host, and when. Hands headwater the pins that only Nix can read. Watches every run from the doctor. | Runs an adapter's logic itself. |

An adapter is small because millpond does everything sources have in
common. swancloud's release adapter carries all of it alone today: its
own `landed` list, its `work/` and `raw/` folders, its 8 KiB cut, its
`status.json` and its landing loop. Under this design that plumbing
exists once, in millpond, and an adapter is only the part that knows
its source.

## The flow

```
source ─▶ adapter ──capture lines──▶ millpond ─▶ capture, raw banked
                                        │
                      its own excerpt? ─┼─ yes ─▶ one signal, cut at a line
                                        └─ no ──▶ reader session ─▶ signals
                                                              │
            curation ─▶ one move per signal ◀─────────────────┘
               │
               ├─ drop, answered, challenge ─▶ settled
               └─ join, attach, route ─▶ item ─┬─ send ─▶ one worktree ─▶ sluice lands
                                               ├─ send ─▶ a sounding ─▶ conclusion ─▶ new items
                                               └─ crew's plan ─▶ team ──▶ sluice lands
```

A release is its own excerpt. Its notes are the excerpt and its signal
asks for a bump. A meeting is not, so a reader turns its transcript
into signals. Both captures take the same path from then on. A finding
a sounding makes beyond its question comes back to millpond as a
capture of its own and takes the same path.

## The capture contract

The contract is the one way captures reach an inbox. Flywheel's
statement defines it, a crate in flywheel-next implements it, and
millpond and Flywheel both take it. One conformance pack proves every
host and every adapter part.

### The lines

An adapter writes JSON Lines to standard output. Each object has
exactly one of three keys:

```json
{"capture": {"key": "release/mise/2026.10.10", "source": "release", "event_at": "2026-10-10T14:02:11Z", "title": "mise 2026.10.10", "url": "https://github.com/jdx/mise/releases/tag/v2026.10.10", "raw": ["mise-2026.10.10/notes.md", "mise-2026.10.10/release.json"], "excerpt": {"text": "…the notes, whole…", "kind": "ask", "asserted_by": "jdx/mise", "assertion": "mise 2026.10.10 is released; the repository pins 2026.9.18.", "subjects": ["release", "mise"], "argues_with": ["packages/mise/default.nix"], "position": "release notes"}}}
{"cursor": "2026-10-17T04:30:05Z"}
{"done": {"listed": 14, "failed": [{"what": "github:jdx/mise", "why": "HTTP 502"}]}}
```

A capture carries these fields:

| Field | Required | Meaning |
|---|---|---|
| `key` | yes | The source event's identity. The same event gets the same key from every host and every run (111). A `/` separates its segments. A key never starts with `/`, never has a `..` segment, and never starts with `captures` or `moves`. |
| `source` | yes | The source's name: `release`, `meeting`, `folder`, `deploy`. |
| `event_at` | yes | When the event happened, in RFC 3339. Never when it was captured, since weight counts by event date (118). |
| `title` | no | One line a person reads in a list. |
| `url` | no | Where the event lives upstream. |
| `raw` | no | The files the adapter wrote under the raw directory, as relative paths. |
| `excerpt` | no | Present only when the capture is its own excerpt. It holds the signal's fields: `text` (verbatim and whole), `kind`, `asserted_by`, `assertion`, `subjects`, `argues_with` and `position` (113). |

The other two lines:

- **`cursor`** is opaque to millpond. millpond keeps the last cursor
  from a run that ended in `done` and hands it back on the next run. An
  adapter works without one: listing a window again is safe, because
  millpond dedupes by key.
- **`done`** ends a complete run with its counts and the items that
  failed. One failed item never stops the others. A run that exits
  without `done`, or with a status other than 0, keeps every capture
  already taken, since captures are idempotent. Its cursor does not
  advance, and millpond records the run as failed.

### Lines and raw files

The lines describe each event, and the raw files hold it:

- **A line is small.** It holds what millpond checks and what enters
  git as the capture and its signal.
- **A raw file is the material** as the source served it, whole: a
  transcript, the full notes, a log. It can run to megabytes. It stays
  on the host and never enters git, so a meeting's words never reach
  GitHub with the record.

Only millpond reads the lines. Once millpond banks the raw files, three
readers use them:

- a reader session, for which a meeting's transcript is the whole
  input;
- millpond's check that each excerpt a reader writes appears verbatim
  in its capture's raw material;
- a person following the capture's pointer past the cut.

A release's notes appear in both places: whole in the raw files, and
cut in the excerpt, which is the quote that enters git.

### Running an adapter

A plugin's adapter part declares a command, the shape of its
configuration and the secrets it needs (228). millpond reads the same
declaration Flywheel reads. It runs the command as
`<command> --raw-dir <dir> [--cursor <c>]`, with the part's
configuration in the file the `CAPTURE_CONFIG` environment variable
names and each declared secret in the environment under its declared
name.

An adapter that signs in to its source keeps that sign-in itself. On
millpond the user signs in once per host. On Flywheel the host places
the secrets the plugin declares.

### Handing captures in

Two commands take the same lines:

- **`millpond land`** is the intake. It takes lines on standard input
  from whoever pipes them, such as a deployer, a script or a person,
  and knows nothing of who made them.
- **`millpond run <part>`** is the scheduled form. It makes a fresh raw
  directory, starts the part's command with that directory and its
  last cursor, and lands what the command prints. It then keeps the new
  cursor and the run's status: its exit, its failures and the tail of
  its standard error. Only a run knows which adapter ran, so only a run
  keeps a cursor or a status per part.

`millpond tick` runs every part of an inbox whose schedule is due, so
one timer on a host serves every part there. A schedule is five-field
cron, and a run missed while the host slept is caught up once.
Flywheel's tick takes the same schedules (231) and the capture endpoint
takes the same lines (216, 217g). An adapter never knows which one ran
it.

### What millpond does with each capture

1. **Check it.** A line with a bad key, a missing field or an excerpt
   with no text is refused and named in the run. The rest are taken.
2. **Look up the key** in every capture the inbox holds. A key already
   held is passed over and counted.
3. **Bank the raw files** in the host's raw bank, under the capture's
   name. Raw material never enters git (111).
4. **Write the capture** with a pointer of the form `<host>:<path>`
   (217h).
5. **Write the one signal** of a capture that carries an excerpt.
   millpond cuts the text at a line under the inbox's limit and closes
   it with a line saying how many lines and bytes the raw record holds
   beyond the cut (`signals.6`, `inputs.6`). The limit is 8 KiB unless
   the inbox's settings say otherwise.
6. **Mark the capture unread** when it carries no excerpt, which
   charges a reader.
7. **Record the run:** its counts, its failures, its cursor, and the
   status a fleet's doctor reads from `millpond status --json`.

## The inbox

An inbox is a git repository, or a branch in one, holding captures,
signals, moves and items in Flywheel's record formats:
`flywheel-capture/1`, `flywheel-signal/1`, `flywheel-move/1`, and the
item record Flywheel's statement gains (114). Each capture exists once
at rest, as a folder named from its event date and its key. JSON exists
only in flight.

- **millpond names an inbox** by the path of its checkout and commits
  each write there. It holds a lock in the inbox's git directory for
  each write, so a tick, a reader, a curation session and crew's agents
  never write at once.
- **The settings** are one file at the inbox's root, `millpond.toml`:
  its parts, each with its schedule, its configuration and the host
  whose tick runs it; its cut; the command that starts a reader; and
  whether items go to worktrees or to crew. A part names one host, so
  an inbox checked out on two hosts runs each part once.
- **The raw bank** is per host, under millpond's data directory, keyed
  by inbox and capture. Each capture points into it.
- **Cursors and run status** are per host, under millpond's state
  directory, keyed by inbox and part.

Three setups use the same inbox files:

| Setup | The inbox | Who curates |
|---|---|---|
| On its own | a git repository of the user's own | a Claude session through millpond's tools; the user accepts |
| With crew | the partition's flywheel branch in crew's state repository | crew's curator through the same tools; the operator decides per item on crew's rail (109) |
| With Flywheel | the instance's state repository, the same files | Flywheel's curation session |

Going from one setup to the next changes the host and the curator. The
adapters and the inbox stay put, so nothing is captured twice and
Flywheel imports nothing when it takes over.

### What comes in once

Two bodies of work predate their inbox, and millpond's signals-folder
import carries each in once, keeping each capture's source, event date,
signals and moves as they were read (114):

- **crew's folders** on each partition's flywheel branch, a
  `capture.md` and one `NN-<slug>.md` per signal. A release capture
  keeps the key it landed under, `release/<name>/<version>`. The
  import keys every other capture by its folder's name.
- **The meeting corpus** already read in the partition's blueprints
  repository.

After the import every capture has one home, so the dedupe looks in one
place.

## Reading and curation

A model runs in two places only: a reader and a curation session. Each
is a Claude session working through millpond's tools, which millpond
serves over MCP as `millpond mcp`:

| Tool | Does |
|---|---|
| `signals` | Lists signals by state, source, age, capture or subject. |
| `capture` | Reads a capture and its raw material. |
| `read` | Writes a capture's signals. millpond refuses one whose excerpt does not appear verbatim in the capture's raw material. |
| `moves` | Writes a batch of moves in one commit. |
| `items` | Lists items with their signals, briefs and sends. |
| `brief` | Writes an item's brief. |
| `send` | Sends an item to a worktree, or an item that asks a question to a sounding. |

### A reader

A reader takes unread captures oldest first and writes their signals
with `read` (113). Three things start one: the user, with the read
skill in a session; the inbox's tick, with the command its settings
name; or crew's reader. The reader's instructions are the inbox's data
(119): what makes a signal, how to name a speaker a transcript leaves
unnamed, and the extraction rules the existing meeting pipeline wrote
down. A meeting recorded twice gives two captures, and its reader reads
them together and writes the second's signals once.

### Moves

Curation gives each signal one of Flywheel's six moves (116):

| Move | Consequence |
|---|---|
| `drop` | Records the reason. |
| `answered` | Names the claim or record that settled it. |
| `challenge` | Weighs against a claim. Only an inbox beside Flywheel's claims has one. |
| `join` | Makes an item, or grows a proposed one, from any number of signals. |
| `attach` | Puts the signal on an item already sent. |
| `route` | Offers a chore, which millpond makes an item of one, or an ask, which it records. |

An unmoved signal is never discarded, and weight counts by event date
(118).

### Working through a backlog

Nobody picks through hundreds of signals by hand. The curate skill
starts a session that asks `signals` for the oldest fifty unmoved,
reads the raw material of the unclear ones, and proposes a move for
each: for example drop eighteen, answer six, and join twenty-six into
five items. The operator accepts the batch or changes rows, and the
session writes it with one `moves` call. The next batch starts where
that one ended.

### Items

An item is the unit of work: the signals curation joined, one or many,
as five of a meeting's ten, or two bumps that move together. It is
Flywheel's proposed intent (109). millpond keeps its brief, which the
session writes with `brief`, and every place it was sent.

- **millpond sends one item to one worktree.** It makes a worktree of
  the repository the send names, on a branch named for the item,
  writes the brief there, and starts an agent on it: in a herdr pane
  through its herdr plugin, or as a command it prints. The agent
  submits through sluice, and millpond writes the landing against the
  item from sluice's record of that branch.
- **millpond sends an item that asks a question to a sounding.** Its
  work ends in an answer: whether to take a major release, or how to
  settle what a meeting left open. millpond keeps the accepted
  conclusion as the item's record, and curation answers a later signal
  on the same subject by naming it (116).
- **An inbox crew keeps sends no item to a worktree.** Its settings
  hand items to crew's planner, which orders them across teams and
  turns each into a chore or a unit. Planning across items is crew's
  today and Flywheel's later, never millpond's.

### The operator's surfaces

- **The Claude Code plugin** holds the curate and read skills and
  starts `millpond mcp`.
- **The herdr plugin** shows the count and age of unmoved signals by
  source (118), lets the operator review a proposed batch row by row,
  and sends an item with one key.
- **crew's rail** shows an inbox crew keeps, one decision per item.

## Questions: sounding

A sounding is one question, worked by one session in one place, ending
on one conclusion. sounding is a standalone tool, as millpond is, and
works the same with millpond, with crew or alone.

### A sounding

- **The question** comes from an item millpond sends, from the
  operator's `/sound` in any session, or from a key in another tool's
  herdr plugin. `sounding open` writes `question.md` with the question
  and its sources: the item's signals, the captures they came from, and
  any earlier conclusion on the subject.
- **The place** is a worktree of the repository the question is about,
  on the branch `sounding/<name>`. The session may write prototype code
  there to test an answer. That code never lands from the sounding's
  branch: the work the operator accepts reaches main through an item's
  worktree or crew's plan, and through sluice.
- **The session** leaves by one of three commands:

  | Exit | What follows |
  |---|---|
  | `sounding conclude` | Writes `conclusion.md`: the answer, its evidence, what it would change, the work it proposes, and what stays open. The operator decides it. |
  | `sounding offer` | Hands a finding beyond the question to `millpond land` as a capture of its own (62). The finding is its own excerpt, of kind `ask`, asserted by the sounding, under the key `sounding/<name>/<n>`. |
  | `sounding ask` | Puts a question only the operator can answer on a card. The session waits for the answer. |

- **A stop check** keeps the session from ending without a conclusion,
  or a note saying where the next round would start.
- **A timebox** limits each round. When it runs out, the session
  concludes with what it knows.

### Deciding a conclusion

The operator decides each conclusion on a card, in sounding's herdr
plugin, or on crew's rail:

- **Accept** settles the item. millpond keeps the conclusion as the
  item's record, and each piece of work the conclusion proposes becomes
  an item of its own, or an entry in crew's plan.
- **Go on** starts the next round in the same worktree. The conclusion
  moves to `rounds/<n>.md`, and the operator's notes join the next
  session's question.
- **Drop** records the reason and removes the worktree.

A conclusion never becomes a signal. Curation never judges a moved
signal again (107), and an approval is never asked twice (6). An
accepted conclusion enters the inbox as the record that settles
signals, and only offers come back as signals.

### Where questions come from

| Setup | Questions from | Conclusions decided on |
|---|---|---|
| On its own | the operator's `/sound` | a card, or sounding's herdr plugin |
| With millpond | items millpond sends; a key on a headwater release that needs judgment; `/sound` on a decision a meeting left open, its transcript a source | the same, recorded against the item |
| With crew | crew's planner and design agent, calling `sounding open` as crew calls millpond | crew's rail |
| With Flywheel | an intent's elaborations, each one a sounding | Flywheel's elaboration types, which write the conclusion into the design book and claims |

### The operator's surfaces

- **The command line:** `sounding open`, `list`, `conclude`, `offer`,
  `ask`, `accept`, `go-on` and `drop`.
- **The Claude Code plugin** gives every session `/sound <question>`,
  which opens a sounding while the session goes on with its own work. A
  sounding's session gets its question, sources and earlier rounds from
  a hook at its start, and the stop check at its end. The plugin serves
  `soundings`, `conclusion`, `accept`, `go_on` and `drop` over MCP, and
  refuses a sluice submission from a `sounding/*` branch.
- **The herdr plugin** lists open soundings in the sidebar, each with
  its round and its state: working, waiting on the operator, or parked.
  Each sounding has a workspace, with the session's pane and its
  conclusion beside it. Keys start, open, accept, send back and drop a
  sounding, and open its conclusion in plannotator for notes.
- **Two ways to run:** unattended, ending on a card, or with the
  operator, in a pane beside them as a conversation (`--with-me`).

## Sources

### Releases: headwater

headwater is a tool for dependencies, never a capture framework. It
reads what a repository declares and asks its lookups (deps.dev,
GitHub, ecosyste.ms, each registry's own API, OSV). It reports every
release newer than each pin, with its notes and advisories.

- **The pin decides what is new** (headwater 9). headwater keeps no
  list of what it reported. millpond's dedupe by key lands each release
  once.
- **Alone**, headwater runs with its Claude Code and herdr plugins:
  - a sidebar of unread releases;
  - a brief a fixer reads;
  - a key that starts an agent in a worktree to make the bump and
    submit it to sluice.
- **The Flywheel plugin's adapter part**, `headwater capture`, prints a
  capture for every release newer than its pin on each run, and
  millpond's dedupe lands each one once:
  - `source` is `release` and `event_at` is when the release was
    published;
  - `raw` holds the notes whole, plus what the lookup answered;
  - the excerpt is the notes, asserted by the upstream, of kind `ask`,
    asserting "`<name>` `<version>` is released; the repository pins
    `<pin>`", and arguing with the declarations a bump moves.
- **The key** is `release/<name>/<version>` for an entry of a watch
  list, under the name the list gives it, which is the key swancloud's
  release adapter has used since its first landing. headwater keys
  every other release by its identity,
  `release/<type>/<namespace>/<name>/<version>`, from its Package URL.
- **In a repository crew runs**, a bump comes only as a chore crew's
  planner makes from an item (`inputs.6`). There the herdr plugin's fix
  key hands the release to millpond as a capture, and no agent starts
  outside crew's plan.

### Meetings: eddy

Listing meetings is arithmetic and reading them is judgment, so a
program lists them and a session reads them (115).

eddy stands alone as headwater does. It lists and fetches meetings
across services, with a Claude Code plugin that pulls a transcript into
a session and a herdr plugin that shows the day's meetings. Its
Flywheel plugin holds one adapter part per meeting service. Each part
lists recorded meetings since its cursor, keys a meeting by its service
and the meeting's own id, writes the transcript as raw, and carries no
excerpt.

The parts share everything but the service:

- the key's shape;
- the meeting's title, start, length and attendees;
- the raw layout: the transcript as served, plus a plain copy with one
  line per turn;
- skipping a meeting too short to hold anything.

A part's own code is listing and fetching from its service.

| Part | Source | Key | When |
|---|---|---|---|
| `wispr` | Wispr Flow's MCP endpoint over HTTP. The part is an MCP client with its own sign-in, and no Claude session runs to list meetings. | `meeting/wispr/<meeting id>` | first |
| `webex` | Webex's transcripts API | `meeting/webex/<meeting id>` | when a partition records on Webex |
| `teams` | Microsoft Graph's meeting transcripts | `meeting/teams/<meeting id>` | when a tenant's administrator consents |

`event_at` is when the meeting started, never when it was captured
(118).

A part counts as a meeting part when it passes the meeting checks in
the conformance pack. The services most partitions record on live in
eddy, each tested by replaying recorded responses. Anyone can publish a
meeting plugin of their own, listed in the plugin index beside eddy's
(228). For the long tail, a generic part lists meetings from any MCP
endpoint that serves transcripts, and the folder drop takes the rest.

### Any other file: the folder drop

A file dropped in a watched folder is one capture. That covers a Teams
transcript downloaded by hand, an email saved as `.eml`, or a PDF.

- **The adapter is Flywheel's folder adapter**, built into millpond
  from flywheel-next's adapters crate: `millpond capture folder <dir>`
  prints contract lines.
- **The key** is `folder/<folder name>/<sha256 of the file>`, so a file
  dropped twice, or under another name, is one capture (111).
- **`event_at`** is the date the file's name begins with, or else its
  last write.
- **`source`** is `folder`. No capture carries an excerpt, so a reader
  reads each one and tells a transcript from an email by what it holds.

A service that sends many files of one kind earns a part of its own.
Until then the folder takes them.

### Built in or shipped with its tool

An adapter whose source needs no other tool ships inside millpond: the
folder drop, a meeting file and the signals-folder import, all from
flywheel-next's adapters crate. An adapter that wraps another tool's
domain ships with that tool, so headwater's and eddy's parts stay
theirs and millpond runs them like anyone else's.

### Sources already built

- **crew's own signals**, agents' and the operator's findings, go
  through `crew signal`, which writes through millpond.
- **swancloud's deployer** pipes a failed step's capture to
  `millpond land`, the step's last lines its excerpt.
- **Flywheel's** page capture box and chat forwards arrive when
  Flywheel hosts.

## Plugins

A plugin is the installable unit in every host. It holds parts, each of
one kind:

| Host | Kinds of part |
|---|---|
| Claude Code | skills, hooks, commands, MCP servers |
| herdr | actions, panes, events |
| Flywheel | adapter, chat sink, runner, router, sign-in, unit type, elaboration type, deliverable producer, map vocabulary, template, scenario pack |

Flywheel's "package" and "bundle" become "plugin" (228, 284). millpond
runs a Flywheel plugin's adapter parts and nothing else of it.

- **headwater** keeps one plugin per host under `plugins/` beside its
  core (sluice ADR 0023): `plugins/claude`, `plugins/herdr` and
  `plugins/flywheel`.
- **eddy** keeps the same layout. Its Flywheel plugin holds a part per
  meeting service.
- **millpond** keeps `plugins/claude` and `plugins/herdr`. Its built-in
  adapters are commands of its own.
- **sounding** keeps `plugins/claude` and `plugins/herdr`.

## On a fleet

swancloud runs every part on the host its list names:

- **One list** in `lib/` says which part runs for which partition's
  inbox, on which host, and when. It grows out of
  `lib/release-sources.nix`, and each inbox's `millpond.toml` is
  generated from it. A launchd agent per inbox on its host runs
  `millpond tick`, and the doctor shows a row per part from
  `millpond status --json` (`lists.1`, `doctor.1`).
- **The watch list** gives headwater the pins that only Nix evaluates.
  It is generated from the tools list and committed, and a flake check
  refuses it when it drifts from the evaluation, as `moon-tasks` does
  for `checks/moon.yml`. Each entry has a name, an upstream, a tag
  pattern, a pin, and its claims, the files a bump moves.
- **A sign-in** a part needs (Wispr's) is made once per host by the
  user, as Pending You's is.
- **Every part is a single-host role** (`fleet.6`), and the parts move
  together when a host hands over.

## Built once, used everywhere

| Part | Built in | Used by |
|---|---|---|
| The contract's types and key rules, JSON in flight and rec at rest, a sha256 content hash, and the excerpt cut | flywheel-next's capture crate, split from `signals.rs` | millpond, Flywheel, headwater's and eddy's adapter parts |
| The signal, move and item records and the inbox's layout | flywheel-next's signals crate | millpond, Flywheel |
| The folder drop, the meeting file and the signals-folder import | flywheel-next's adapters crate | millpond, Flywheel |
| Cadence: five-field cron, caught up once | flywheel-next's `cadence.rs` | `millpond tick`, Flywheel's tick |
| The conformance pack: lines in, records expected | flywheel-next | millpond and Flywheel as hosts, every adapter part |
| Raw banking with a host-qualified pointer, the checks on a capture, and the verbatim check on a reader's excerpt | millpond, from crew's checks | Flywheel, for 217h and 217e |
| Finding releases and reading their notes | swancloud's release adapter | headwater's lookups and its Flywheel plugin |
| One question, one session, one conclusion: the question, its rounds and the conclusion's shape | sounding, from crew ADR 0019 | crew, Flywheel's elaborations |

crew's Python uses only the standard library (`code.1`). crew reaches
signals only through millpond's command line, as it reaches landings
only through sluice's, and links no crate.

## What each record gains

- **Flywheel's statement:**
  - **Running an adapter:** a plugin's adapter part runs on the tick
    with the arguments, environment, lines and exit status above
    (215, 228, 231).
  - **Handing captures in:** the same lines go in through the binary,
    and later through the endpoint (216, 217g).
  - **Each capture says** whether it is its own excerpt. This replaces
    the fixed list of sources that get `ensure_signal` (112, 217e).
  - **The host banks raw material** behind a pointer of the form
    `<host>:<path>` (217h).
  - **A source** has configuration and a cursor, not a bare command
    string.
  - **An import keeps** each capture's own key (114).
  - **The item record** holds a proposed intent's brief and sends.
  - **The built-in adapters** print the contract (215).
  - **"Plugin"** replaces "package" and "bundle" (228, 284).
  - **An elaboration runs on sounding:** finishing with deliverables is
    `conclude`, blocking on a question is `ask`, and an offer is
    `offer` (58, 62).
- **millpond's statement**, new: the inbox, the contract's intake, the
  tools, sends, and the three setups.
- **sounding's statement**, new: the question, the place, the three
  exits, rounds, and the operator's decision.
- **crew's record:**
  - each partition's signals live in its inbox, written through
    millpond (`signals.1`);
  - millpond writes the signal of a capture that is its own excerpt,
    and cuts it (`signals.6`);
  - an ADR, "crew calls millpond as it calls sluice";
  - `daily-pass-through-crew` becomes the reader;
  - `curation-and-agenda` writes moves through millpond and turns items
    into plan entries;
  - ADR 0019's elaboration becomes "crew calls sounding as it calls
    millpond".
- **headwater's statement:**
  - its 33 rulings, among them "lookup" for what the statement calls a
    source;
  - claims on a watch-list entry;
  - the key a watch-list entry gets;
  - its Flywheel plugin prints the contract.
- **swancloud's record:**
  - `inputs.6` and ADR 0020 name headwater and millpond;
  - the release adapter retires;
  - the list of parts grows out of `lib/release-sources.nix`.

## Open

- **Acknowledging a dropped release.** A curation drop of a release
  signal could acknowledge the release in headwater, so its plugins
  stop showing it. headwater's ruling 24 says a recorder never
  acknowledges.
- **Where a cursor lives** when a single-host role moves hosts. A lost
  cursor costs one wider listing, which the dedupe absorbs.
- **Attestation**, sluice signing the verdict it lands, is outside this
  design.
- **A standing sounding**, which stays open and starts a round when a
  signal on its subject lands, as Flywheel's standing elaborations do.
- **Where else an accepted conclusion lives.** A repository may keep it
  in its own record, as crew's kits keep `openspec/explorations/`.
- **crew's two open records disagree.** ADR 0019 rests an elaboration
  on an intent and the `new-territory` move, and `curation-and-agenda`
  leaves intents out and replaces that move with `join`. A sounding
  sent from an item settles both, once crew's record says so (C6).
