# Capture

Some events outside a repository should change its work: a release of
something it depends on, a decision in a meeting, a deploy that failed.
Each one reaches the work the same way. A program notices the event and
hands it to millpond, which records it once as a capture in an inbox.
The capture becomes signals, either mechanically when it is its own
excerpt or through a reader session. Curation gives each signal one
move and joins signals into items. flume launches an item's work in
one worktree and submits it to sluice, which lands it, or crew's plan
takes the item. Items that ask a question go to a sounding, which ends
on a conclusion the operator accepts.

This design covers every part that does this:

- **headwater** reports releases and advisories for what a repository
  declares (`design/headwater/requirements.md`).
- **eddy** lists recorded meetings from each meeting service.
- **millpond** is the inbox. It runs adapters, keeps captures and
  signals, serves the tools a curation session works through, and sends
  an item on.
- **flume** launches and tracks one agent per stage in one worktree
  through a kind's stages, and submits the work of a kind that lands. It
  tidies the place when the work lands, is dropped, or its caller ends
  it. millpond, headwater, sounding and crew call it.
- **sounding** runs elaborations. Each works a closed set of inputs its
  opener names, in rounds, in a place flume runs, and ends on a
  conclusion the operator accepts, sends back for another round, or
  drops. Its kind says what of its work lands.
- **sluice** tests a change as merged and lands it.
- **crew** runs teams, plans and bolts. It calls millpond's, flume's
  and sluice's command lines.
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
| millpond | Runs adapters and takes the capture contract. Dedupes by key, banks raw material, and writes each capture, plus the one signal of a capture that is its own excerpt. Keeps the inbox, checks a reader's excerpts, writes moves and items, records each send and its outcome, and records each run. | Judges what a capture says, starts an agent, or plans across items. |
| flume | Places on the host it runs on: makes a worktree ready, starts each stage's agent in it with its prompt confirmed, and moves on when the stage's deliverable exists. Submits the work of a kind that lands, and tidies the place. Reports each place's state. | Decides what to launch, plans across items, or lets a session submit. |
| A reader, a session | Reads a capture that is not its own excerpt into signals, through millpond (113, 217e). | Lists a source. |
| Curation, a session | Proposes one move per signal, in batches, through millpond's tools (116). | Writes captures or signals. |
| sounding | Elaborations: the inputs each was opened with, the earlier soundings it is based on, its rounds and the operator's decisions, kept after its places are gone. flume runs its places and submits what its kind lands. It offers each finding beyond its inputs to millpond as a capture. | Submits, writes the inbox except through millpond, or plans across items. |
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
               └─ join, attach, route ─▶ item ─┬─ send ─▶ flume, a fix or a change ─▶ one worktree ─▶ sluice lands
                                               ├─ send ─▶ a sounding, its places through flume ─▶ conclusion ─▶ new items
                                               └─ crew's plan ─▶ team, its stages through flume ─▶ sluice lands
```

A release is its own excerpt. Its notes are the excerpt and its signal
asks for a bump. A meeting is not, so a reader turns its transcript
into signals. Both captures take the same path from then on. A finding
a sounding makes beyond its inputs comes back to millpond as a capture
of its own and takes the same path.

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
| `send` | Sends an item to flume as a fix or a change, or items that ask a question to a sounding. |

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

- **millpond sends one item to one worktree through flume.** The send
  names the repository and the kind, a fix or an OpenSpec change.
  millpond records the send and hands flume the brief, and flume makes
  the place and starts the agent. flume submits the work to sluice, and
  millpond writes the landing against the item from sluice's record of
  that branch.
- **millpond sends items that ask a question to a sounding,** one item
  or several. The work ends in an answer: whether to take a major
  release, or how to settle what a meeting left open. millpond keeps
  the accepted conclusion as the record of each item the sounding took,
  and curation answers a later signal on the same subject by naming it
  (116).
- **An item owns no branch.** Each send is one place on a new branch
  cut from main, and its work lands back on main by itself. A sounding
  whose kind writes back lands the same way.
- **An inbox crew keeps sends no item to flume itself.** Its settings
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

## Launching: flume

flume starts the work an item becomes, follows it through its stages,
submits it, and tidies its place. A launch names a repository, a kind,
a brief and a name. flume runs on one host and launches there.

### A place

- **flume makes the place:** a worktree of the repository at
  `<repository>/places/<kind>--<name>`, on the branch `<kind>/<name>`,
  made ready by the repository's own declaration of what a worktree
  needs.
- **A kind is a list of stages.** Each stage names its prompt and its
  deliverable, and a kind that lands ends with flume's submission:

  | Kind | Stages |
  |---|---|
  | fix | code, then flume submits to sluice |
  | change | construct, which writes the OpenSpec change; code, which ticks its tasks; verify; then flume submits to sluice |

  A repository may declare kinds of its own in the same form, and
  sounding hands flume the stages of each elaboration's kind with the
  launch. A stage's deliverable can be a report the agent committed,
  which the branch keeps after the place is gone.
- **Each stage starts a fresh agent** in a herdr pane, or as a command
  flume prints. A launch may say where the pane goes, such as beside
  the operator's own for a conversation. flume sends the stage's prompt
  only once the agent accepts input, and sends it again when the
  agent's transcript lacks it.
- **A stage ends when its deliverable exists**, or when its agent stops
  short and says what it needs, never when the pane goes quiet. Then
  flume starts the next stage. A stop check sends back an agent that
  tries to stop with neither. A conversation stage, an agent working
  with the operator, has no stop check and ends when the operator or
  the caller ends it.
- **A session commits and never submits.** After a kind's last stage,
  flume submits the place's branch to its merge queue, sluice by
  default. A failed submission sends the place back to the stage the
  kind names, with the failure as that stage's words. A kind that
  never lands never reaches the merge queue.
- **flume tidies a place** once its work lands, is dropped, or its
  caller says it is done. On a landing through worktrunk, sluice's
  driver removes the worktree and its branch, and flume records the
  place gone. Otherwise flume removes only places it made, and keeps a
  branch that holds commits its target lacks.

### What flume reports

`flume status --json` gives each place's kind, its stage, whether its
agent is working, waiting or stopped, whether the stage's deliverable
exists, and its submission. For a change, flume reads the OpenSpec
change's own files, so the status shows its tasks ticked. millpond
keeps an item's record, and sounding an elaboration's. flume keeps only
the live state of the places it runs.

### Who launches

| Caller | Launches |
|---|---|
| The operator | `/launch <brief>` in any session, or the herdr plugin's key |
| millpond | an item's send, as a fix or a change |
| headwater | the fix key, as a fix with the release's brief |
| sounding | each round of an elaboration, with its kind's stages |
| crew | each stage of a unit, chore or fix, in a slot of its team |

crew keeps what spans many places: plans, bolts, slots, the dispatcher,
conductors, approvals, and conflicts between units. It asks flume for
each place and each stage's agent, as it asks sluice for each landing.

### The operator's surfaces

- **The command line:** `flume launch`, `status`, `tell`, `stop`,
  `retry` and `tidy`.
- **The Claude Code plugin** gives every session `/launch`, serves
  `status` over MCP, and holds the stop check.
- **The herdr plugin** shows every place in flight in the sidebar, with
  its kind, its stage and its agent's state, and a change's tasks
  ticked. Keys open a place's pane, tell its agent, stop it and retry
  its stage. A sounding waiting on the operator shows as a row there.

## Elaborations: sounding

A sounding is an elaboration: a closed set of inputs, worked in rounds
by one session at a time in a place flume runs, ending on a conclusion
the operator decides. sounding is a standalone tool, as millpond is,
and works the same with millpond, with crew or alone. flume runs each
round's place and agent, and sounding keeps everything that outlives
them.

### A sounding

- **The inputs** are what its opener names: one or more items millpond
  sends, with their signals and the captures they came from; a
  transcript; a release's brief; earlier soundings. The opener is
  millpond's send, the operator's `/sound` in any session, or a key in
  another tool's herdr plugin, and each calls `sounding open`. The
  session gets every input in full at its start, and nothing else is
  handed to it. It researches beyond them as it needs: other
  repositories, documentation, the web.
- **A sounding can be based on earlier ones,** as a Claude Code session
  is forked. It carries each one's record whole, its inputs, rounds,
  the operator's notes and decisions, and its conclusion, and each
  one's branch, which the session can read. A kind may hand over their
  sessions' transcripts too. An earlier sounding may have been dropped
  or still be open, and nothing in it changes.
- **Its kind** says what a round is handed, what its conclusion holds,
  how a round ends, and what lands. sounding ships kinds of its own, a
  repository declares its own, and a launch may carry one. A round ends
  in one of three ways (25):

  | A round | Ends |
  |---|---|
  | ends itself | on a conclusion, or a note saying where the next round would start; a stop check sends the session back otherwise |
  | stands | when the operator says finish; it stays open when idle |
  | works with the operator | when the operator ends it, as a conversation in a pane beside theirs, with no stop check |

  The default kind, a question, ends itself and lands nothing.
- **The place** is a worktree of the repository the sounding is about,
  on the branch `sounding/<name>`, which flume makes and runs with the
  kind's stages. The session commits its work there, and may write
  prototype code to test an answer. Only what the kind names lands,
  such as a design-book chapter, claims or a context map, and flume
  submits it straight onto the target, main by default. A prototype
  never lands. The work it points to reaches main through an item's
  worktree or crew's plan.
- **The session** ends a round with `sounding conclude`, and may offer
  and ask along the way:

  | Exit | What follows |
  |---|---|
  | `sounding conclude` | Writes `conclusion.md`: the answer, its evidence, what it would change, the work it proposes, and what stays open. The operator decides it. |
  | `sounding offer` | Hands a finding beyond the sounding's inputs to `millpond land` as a capture of its own (62), and the session goes on (58). The finding is its own excerpt, of kind `ask`, asserted by the sounding, under the key `sounding/<name>/<n>`, one key per offer. |
  | `sounding ask` | Puts a question only the operator can answer on a card. The session waits for the answer, then goes on. |

### Deciding a conclusion

The operator decides each conclusion on a card, in sounding's herdr
plugin, or on crew's rail:

- **Accept** settles each item the sounding took, and flume submits
  what the kind lands. millpond keeps the conclusion as each item's
  record, and each piece of work the conclusion proposes becomes an
  item of its own, or an entry in crew's plan.
- **Go on** starts the next round in the same worktree. The conclusion
  moves to `rounds/<n>.md`, and the operator's notes join the next
  session's inputs.
- **Drop** records the reason. flume removes the worktree and keeps its
  branch.

A conclusion never becomes a signal. Curation never judges a moved
signal again (107), and an approval is never asked twice (6). An
accepted conclusion enters the inbox as the record that settles
signals, and only offers come back as signals.

### Where soundings come from

| Setup | Inputs from | Conclusions decided on |
|---|---|---|
| On its own | the operator's `/sound`, naming its inputs and any earlier soundings | a card, or sounding's herdr plugin |
| With millpond | items millpond sends; a key on a headwater release that needs judgment; `/sound` on a decision a meeting left open, its transcript an input | the same, recorded against each item |
| With crew | crew's planner and design agent, calling `sounding open` as crew calls millpond | crew's rail |
| With Flywheel | an intent's elaborations, each one a sounding cut from the intent's line | Flywheel's elaboration types, which write the conclusion into the design book and claims on the intent's line, which lands when the intent is archived (49) |

### The operator's surfaces

- **The command line:** `sounding open`, `list`, `conclude`, `offer`,
  `ask`, `accept`, `go-on` and `drop`.
- **The Claude Code plugin** gives every session `/sound`, which opens a
  sounding on the inputs it names while the session goes on with its
  own work. A sounding's session gets its inputs, the records it is
  based on and its earlier rounds from a hook at its start. The plugin
  serves `soundings`, `conclusion`, `accept`, `go_on` and `drop` over
  MCP.
- **The herdr plugin** lists open soundings, each with its round and its
  state: working, waiting on the operator, or parked. They share flume's
  sidebar. Each sounding has a workspace, with the session's pane and
  its conclusion beside it. Keys start, open, accept, send back and drop
  a sounding through sounding, which starts each round through flume,
  and open its conclusion in plannotator for notes.
- **Where a round's pane goes** is a launch setting sounding hands
  flume. A round with the operator opens beside their pane
  (`--with-me`). sounding drives no terminal of its own.

## Sources

### Releases: headwater

headwater is a tool for dependencies, never a capture framework. It
reads what a repository declares and reports every release newer than
each pin, with its notes and advisories.

- **Each ecosystem's own package manager is the first lookup.**
  headwater runs it read-only in the repository's own shell, so it sees
  the registries the repository is configured for, private ones among
  them. It asks `npm view` and `npm outdated`, `go list -m -versions`,
  `mise ls-remote`, and the configured registry's index for Python and
  Cargo.
  deps.dev, GitHub and ecosyste.ms answer where no package manager runs
  or none exists, and OSV answers for advisories.
- **Each release is marked inside or outside the range** the repository
  declares (`^1.4`, `>=1.4,<2`). Inside, the package manager takes it by
  changing only the lockfile. Outside, the manifest changes, as a major
  release needs. headwater reports both, so a major release is never
  hidden. Each declaration's range marks the release on its own, so a
  release declared in two places can be inside one range and outside
  the other, and the brief names both (headwater 4, 26).
- **A brief names the ecosystem's own command** for the move: `npm
  update` or `npm install <name>@<version>`, `uv lock --upgrade-package`,
  `cargo update -p`, `go get`, `mise use`. Whoever makes the change runs
  it, and headwater never does. Beside the release's notes, a brief can
  carry the published package's own diff between the pin and the
  release (`npm diff`), so a README or CHANGELOG change shows as
  upstream shipped it.

- **The pin decides what is new** (headwater 9). headwater keeps no
  list of what it reported. millpond's dedupe by key lands each release
  once.
- **Alone**, headwater runs with its Claude Code and herdr plugins:
  - a sidebar of unread releases;
  - a brief a fixer reads;
  - a key that hands the release's brief to flume, which starts an
    agent in a worktree to make the bump and submits it to sluice.
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
- **flume** keeps `plugins/claude` and `plugins/herdr`.

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
| Elaborations: the inputs, the soundings one is based on, the kinds, the rounds and the conclusion's shape | sounding, from crew ADR 0019 | crew, Flywheel's elaborations |
| Places, a fresh agent per stage, prompt delivery, stages that end on their deliverable, submission, and tidying | flume, from crew's `teams.2`–`4`, `teams.11`, `teams.15` and `plan.9`, `10`, `12`, `17` | millpond, headwater, sounding, crew |

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
- **sounding's statement**, new: the inputs, the soundings one is based
  on, elaboration kinds, the place through flume, the three exits,
  rounds, and the operator's decision.
- **flume's statement**, new: a launch, places, kinds and stages,
  prompt delivery, stage ends, submission, status and tidying.
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
    millpond";
  - an ADR, "crew calls flume for each place and stage", with the
    `teams` and `plan` rules flume takes over amended to name it.
- **headwater's statement:**
  - its 33 rulings, among them "lookup" for what the statement calls a
    source;
  - each release marked inside or outside the declared range;
  - each ecosystem's package manager as a lookup, with deps.dev where
    none runs;
  - a brief naming the ecosystem's command for the move, amending
    headwater 27, and carrying the published package's diff;
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
- **A package manager in the repository's shell** and headwater 5,
  which says reading a repository changes nothing in it. The commands
  headwater runs only read, but entering a repository's shell can
  write, as devenv writes its lock.
- **Where a cursor lives** when a single-host role moves hosts. A lost
  cursor costs one wider listing, which the dedupe absorbs.
- **Attestation in sluice:** sluice signing the verdict it lands, with
  an executor vouched for from outside the team that ran it.
- **How a repository declares its kinds** and their prompts, and how
  crew's stage prompts move into that form.
- **sounding's own details:** how a sounding is named, what parks a
  sounding and resumes it, and the fields an offer's capture carries.
  Its statement rules them (Q1). Where its record is kept is ruled with
  the family's storage (D4).
- **Landing part of a branch.** Only what an elaboration's kind names
  lands, and its prototype stays on the branch. How flume submits that
  part alone is for sounding's and flume's statements to rule.
- **A standing sounding that wakes on a signal**, starting a round when
  a signal on its subject lands, as Flywheel's standing elaborations
  do.
- **crew's two open records disagree.** ADR 0019 rests an elaboration
  on an intent and the `new-territory` move, and `curation-and-agenda`
  leaves intents out and replaces that move with `join`. A sounding
  sent from an item settles both, once crew's record says so (C6).
