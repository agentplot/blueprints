# Capture

Some events outside a repository should change its work: a release of
something it depends on, a decision in a meeting, a deploy that failed.
Each one reaches the work the same way. A program notices the event and
hands it to a host. The host records it once as a capture. The capture
becomes signals, either mechanically when it is its own excerpt or
through a reader session. Curation gives each signal one move, and work
that comes of a move lands through sluice.

This design covers every part that does this:

- **headwater** reports releases and advisories for what a repository
  declares (`design/headwater/requirements.md`).
- **eddy** lists recorded meetings from each meeting service.
- **crew** is the host today and keeps every partition's signals.
- **Flywheel** is the host crew becomes (crew ADR 0026: "crew becomes
  flywheel").
- **swancloud** is the first fleet that runs all of it.

`plan.md` beside this file orders the work.

A bare clause number cites Flywheel's statement
(`design/flywheel-next/requirements.md`). A number prefixed `headwater`
cites headwater's statement. A rule id such as `signals.6` cites crew's
`docs/architecture/`. `inputs.6` is swancloud's.

## What each part owns

| Part | Owns | Never |
|---|---|---|
| An adapter | One source. It lists the source's events, keys each one, fetches the raw material, and marks a capture that is its own excerpt. | Writes records, keeps a list of what it reported, cuts an excerpt, or reads a capture into signals (115). |
| headwater | Releases and advisories for what a repository declares. It stands alone with its Claude Code and herdr plugins. Its Flywheel plugin holds an adapter part. | Knows which host records its releases. |
| The host: crew now, Flywheel later | Runs adapters and takes the capture contract. Dedupes by key and banks raw material. Writes the capture, plus the one signal of a capture that is its own excerpt, cut to the host's limit. Records each run and charges readers and curation. | Judges what a capture says. |
| A reader, a session | Reads a capture that is not its own excerpt into signals (113, 217e). | Lists a source. |
| Curation, a session | Gives each signal its one move (116). | Writes captures or signals. |
| The planner and a team | Turn a routed item into a chore or unit, build it, and land it through sluice. | Bump a tool with no signal behind it (`inputs.6`). |
| The fleet (swancloud) | Says which adapter runs for which partition, on which host, and when. Hands headwater the pins that only Nix can read. Watches every run from the doctor. | Runs an adapter's logic itself. |

An adapter is small because the host does everything sources have in
common. Today swancloud's release adapter carries all of it alone: its
own `landed` list, its `work/` and `raw/` folders, its 8 KiB cut, its
`status.json` and its landing loop. Under this design that plumbing
exists once, in the host, and an adapter is only the part that knows
its source.

## The flow

```
source ─▶ adapter ──capture lines──▶ host ─▶ capture, raw banked
                                        │
                      its own excerpt? ─┼─ yes ─▶ one signal, cut at a line
                                        └─ no ──▶ reader session ─▶ signals
                                                              │
            curation ─▶ one move per signal ◀─────────────────┘
               │
               └─ route ─▶ plan item ─▶ planner ─▶ chore or unit ─▶ team ─▶ sluice lands
```

A release is its own excerpt. Its notes are the excerpt and its signal
asks for a bump. A meeting is not, so a reader turns its transcript
into signals. Both captures take the same path from then on.

## The capture contract

The contract is the one way captures reach a host. Flywheel's statement
defines it, since crew keeps Flywheel's words and shapes where they fit
(crew ADR 0001). crew implements it first. One conformance pack proves
both hosts.

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
| `source` | yes | The source's name: `release`, `meeting`, `deploy`. |
| `event_at` | yes | When the event happened, in RFC 3339. Never when it was captured, since weight counts by event date (118). |
| `title` | no | One line a person reads in a list. |
| `url` | no | Where the event lives upstream. |
| `raw` | no | The files the adapter wrote under the raw directory, as relative paths. |
| `excerpt` | no | Present only when the capture is its own excerpt. It holds the signal's fields: `text` (verbatim and whole), `kind`, `asserted_by`, `assertion`, `subjects`, `argues_with` and `position` (113). |

The other two lines:

- **`cursor`** is opaque to the host. The host keeps the last cursor
  from a run that ended in `done` and hands it back on the next run. An
  adapter works without one: listing a window again is safe, because
  the host dedupes by key.
- **`done`** ends a complete run with its counts and the items that
  failed. One failed item never stops the others. A run that exits
  without `done`, or with a status other than 0, keeps every capture
  already taken, since captures are idempotent. Its cursor does not
  advance, and the host records the run as failed.

### Lines and raw files

The lines describe each event, and the raw files hold it:

- **A line is small.** It holds what the host checks and what enters
  git as the capture and its signal.
- **A raw file is the material** as the source served it, whole: a
  transcript, the full notes, a log. It can run to megabytes. It stays
  on the host and never enters git, so a meeting's words never reach
  GitHub with the record.

Only the host reads the lines. Once the host banks the raw files,
three readers use them:

- a reader session, for which a meeting's transcript is the whole
  input;
- crew's grading, which checks that a signal's excerpt appears
  verbatim in its source;
- a person following the capture's pointer past the cut.

A release's notes appear in both places: whole in the raw files, and
cut in the excerpt, which is the quote that enters git.

### Running an adapter

A plugin's adapter part names a command. The host runs it on its tick
(231) as `<command> --raw-dir <dir> [--cursor <c>]`. The part's
configuration is in the file the `CAPTURE_CONFIG` environment variable
names. Each secret the plugin declares is in the environment under its
declared name (228).

An adapter that signs in to its source keeps that sign-in itself. On a
crew host the user signs in once per host. On Flywheel the host places
the secrets the plugin declares.

### Handing captures in

A program that runs on its own pipes the same lines to the host:

- `crew capture land --label <label> --raw-dir <dir>` on crew;
- `flywheel capture land` on Flywheel, and later its capture endpoint
  (216, 217g).

The two commands split the work:

- **`crew capture land`** is the host's intake. It takes lines from
  whoever pipes them and knows nothing of who made them.
- **`crew capture run <part>`** is the scheduled form. It makes a fresh
  raw directory, starts the adapter with that directory and its last
  cursor, and lands what the adapter prints. It then keeps the new
  cursor and the adapter's run status: its exit, its failures and the
  tail of its standard error. Only the run knows which adapter ran, so
  only the run keeps a cursor or a status per adapter.

Both commands take the same contract, so an adapter never knows which
one ran it.

### What the host does with each capture

1. **Check it.** A line with a bad key, a missing field or an excerpt
   with no text is refused and named in the run. The rest are taken
   (crew `read.1`).
2. **Look up the key** in every capture the host holds. crew looks in
   both of its homes. A key already held is passed over and counted.
3. **Bank the raw files** in the host's raw store, under the capture's
   name. Raw material never enters git (`signals.3`, 111).
4. **Write the capture** in the host's at-rest form, with a pointer of
   the form `<host>:<path>` (217h).
5. **Write the one signal** of a capture that carries an excerpt. The
   host cuts the text at a line under its limit and closes it with a
   line saying how many lines and bytes the raw record holds beyond the
   cut (`signals.6`, `inputs.6`). crew's limit is 8 KiB.
6. **Mark the capture unread** when it carries no excerpt, which
   charges a reader. crew charges a reader on a cadence and on the
   user's word. Flywheel charges a capture-reader session per capture.
7. **Record the run:** its counts, its failures, its cursor, and the
   status the fleet's doctor reads.

## Records at rest

Each capture exists once at rest. JSON exists only in flight. Adapters
keep no work folders, and the host holds the raw material once.

- **crew** keeps its shape. Each capture is a folder on the partition's
  flywheel branch (`<label>/main` of its state repository): a
  `capture.md` and one `NN-<slug>.md` per signal, each with a
  frontmatter record that recfix checks (`plan.1`). The capture gains a
  `key` field, which crew's dedupe reads. The folder name is the
  host's, made from the event date and the key, and matches `code.4`.
- **Flywheel** keeps its records: `flywheel-capture/1`,
  `flywheel-signal/1` and `flywheel-move/1`.
- **When crew becomes Flywheel**, Flywheel's signals-folder adapter
  imports crew's folders once (114). It keeps each capture's own key,
  so nothing captured in crew is captured again in Flywheel.

Meeting signals live on the flywheel branch with every other signal.
The meeting corpus already read stays in the partition's blueprints
repository, where crew's lookup of both homes finds it, until Flywheel
imports it.

## Sources

### Releases: headwater

headwater is a tool for dependencies, never a capture framework. It
reads what a repository declares and asks its lookups (deps.dev, GitHub,
ecosyste.ms, each registry's own API, OSV). It reports every release
newer than each pin, with its notes and advisories.

- **The pin decides what is new** (headwater 9). headwater keeps no
  list of what it reported. The host's dedupe by key lands each release
  once.
- **Alone**, headwater runs with its Claude Code and herdr plugins:
  - a sidebar of unread releases;
  - a brief a fixer reads;
  - a key that starts an agent in a worktree to make the bump and
    submit it to sluice.
- **The Flywheel plugin's adapter part**, `headwater capture`, prints
  one capture per newly reported release:
  - `source` is `release` and `event_at` is when the release was
    published;
  - `raw` holds the notes whole, plus what the lookup answered;
  - the excerpt is the notes, asserted by the upstream, of kind `ask`,
    asserting "`<name>` `<version>` is released; the repository pins
    `<pin>`", and arguing with the declarations a bump moves.
- **The key** is `release/<name>/<version>` for an entry of a watch
  list, under the name the list gives it, which is the key swancloud's
  release adapter has used since its first landing. headwater keys every other
  release by its identity: `release/<type>/<namespace>/<name>/<version>`
  from its Package URL.
- **In a repository crew runs**, a bump comes only as a chore that
  curation proposes from a signal (`inputs.6`). There the herdr
  plugin's fix key hands the release to crew as a capture, and no agent
  starts outside crew's plan.

### Meetings: eddy

Listing meetings is arithmetic and reading them is judgment, so a
program lists them and a session reads them (115).

eddy stands alone as headwater does. It lists and fetches meetings
across services, with a Claude Code plugin that pulls a transcript into
a session and a herdr plugin that shows the day's meetings. Its Flywheel
plugin holds one adapter part per meeting service. Each part lists recorded meetings since its cursor, keys a meeting by its
service and the meeting's own id, writes the transcript as raw, and
carries no excerpt.

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

- **`event_at`** is when the meeting started, never when it was
  captured (118).
- **A meeting recorded twice** gives two captures. Its reader reads
  them together and writes the second's signals once.
- **The reader's instructions** are the instance's data (119): what
  makes a signal, how to name a speaker a transcript leaves unnamed,
  and the extraction rules the existing meeting pipeline wrote down.
### Any other file: the folder drop

A file dropped in a watched folder is one capture. That covers a Teams
transcript downloaded by hand, an email saved as `.eml`, or a PDF.

- **The adapter is Flywheel's own folder adapter**, run as a program:
  `flywheel capture folder <dir> --print` prints contract lines in
  place of writing records. crew therefore runs Flywheel's code before
  crew becomes Flywheel.
- **The key** is `folder/<folder name>/<sha256 of the file>`, so a file
  dropped twice, or under another name, is one capture (111).
- **`event_at`** is the date the file's name begins with, or else its
  last write.
- **`source`** is `folder`. No capture carries an excerpt, so a reader
  reads each one and tells a transcript from an email by what it holds.

A service that sends many files of one kind earns a part of its own.
Until then the folder takes them.

### Sources already built

These keep working as they are:

- **crew**: agents' and the operator's findings (`crew signal`), and
  the deployer's failures. The deployer moves to `crew capture land`
  when `crew signal land` retires.
- **Flywheel**: the page's capture box, chat forwards, the folder drop
  and the signals folder.

## Plugins

A plugin is the installable unit in all three hosts. It holds parts,
each of one kind:

| Host | Kinds of part |
|---|---|
| Claude Code | skills, hooks, commands |
| herdr | actions, panes, events |
| Flywheel | adapter, chat sink, runner, router, sign-in, unit type, elaboration type, deliverable producer, map vocabulary, template, scenario pack |

Flywheel's "package" and "bundle" become "plugin" (228, 284).

- **headwater** keeps one plugin per host under `plugins/` beside its
  core (sluice ADR 0023): `plugins/claude`, `plugins/herdr` and
  `plugins/flywheel`.
- **eddy** keeps the same layout. Its Flywheel plugin holds a part per
  meeting service.
- **Flywheel's built-in adapters** (folder, meeting file, signals
  folder) print the contract when asked, so any host runs them.

## On a fleet

swancloud runs every adapter on the host its list names:

- **One list** says which adapter part runs for which partition, on
  which host, and when. It grows out of `lib/release-sources.nix`. A
  launchd agent per entry runs `crew capture run`, and the doctor
  shows a row per entry, read from crew's run status (`lists.1`,
  `doctor.1`).
- **The watch list** gives headwater the pins that only Nix evaluates.
  It is generated from the tools list and committed, and a flake check
  refuses it when it drifts from the evaluation, as `moon-tasks` does
  for `checks/moon.yml`. Each entry has a name, an upstream, a tag
  pattern, a pin, and its claims, the files a bump moves.
- **A sign-in** an adapter needs (Wispr's) is made once per host by the
  user, as Pending You's is.
- **These runs are single-host roles** (`fleet.6`), and they move
  together when a host hands over.

## Built once, used everywhere

| Part | Built in | Used by |
|---|---|---|
| The contract's types and key rules, JSON in flight and rec at rest, a sha256 content hash, and the excerpt cut | a small crate in flywheel-next, split from `signals.rs` | Flywheel's host, headwater's Flywheel plugin, eddy's Flywheel plugin |
| The contract's conformance pack: lines in, records expected | flywheel-next | crew and Flywheel, which both pass it |
| Raw banking with a host-qualified pointer, the checks on a program's capture, and grading an excerpt against its transcript | crew today | Flywheel, for 217h and 217e |
| The folder drop and Flywheel's other built-in adapters, printing the contract with `--print` | flywheel-next `adapters.rs` | crew, before it becomes Flywheel |
| Cadence: five-field cron, caught up once | flywheel-next `cadence.rs` | Flywheel's adapter schedules |
| Finding releases and reading their notes | swancloud's release adapter today | headwater's lookups and its Flywheel plugin |

crew's Python uses only the standard library (`code.1`). crew therefore
implements the contract against the conformance pack and does not link
the crate. The pack keeps the two hosts equal.

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
  - **The built-in adapters** print the contract on request, so
    another host runs them (215).
  - **"Plugin"** replaces "package" and "bundle" (228, 284).
- **crew's record:**
  - meeting signals live on the flywheel branch (`signals.1`);
  - the host writes the signal of a capture that is its own excerpt,
    from the contract (`signals.6`);
  - a rule that the host dedupes by key;
  - `daily-pass-through-crew` becomes the reader;
  - `curation-and-agenda` routes releases to plan items.
- **headwater's statement:**
  - its 33 rulings, among them "lookup" for what the statement calls a
    source;
  - claims on a watch-list entry;
  - the key a watch-list entry gets;
  - its Flywheel plugin prints the contract.
- **swancloud's record:**
  - `inputs.6` and ADR 0020 name headwater;
  - the release adapter retires;
  - the list of adapters grows out of `lib/release-sources.nix`.

## Open

- **Acknowledging a dropped release.** A curation drop of a release
  signal could acknowledge the release in headwater, so its plugins
  stop showing it. headwater's ruling 24 says a recorder never
  acknowledges.
- **Where the cursor lives** when a single-host role moves hosts. A
  lost cursor costs one wider listing, which the dedupe absorbs.
- **Attestation**, sluice signing the verdict it lands, is outside this
  design.
