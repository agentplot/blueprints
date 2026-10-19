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

This design covers every tool that does this:

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
- **The family's shared crates** define and implement, once, the
  capture contract, the record formats, the shared-branch write
  protocol and the kind format, in a public repository of the family's
  own. The open tools build on them.
- **Flywheel** is built later on the same shared crates and reads the
  same inboxes. crew becomes it (crew ADR 0026: "crew becomes
  flywheel").
- **swancloud** is the first fleet that runs all of it.

`plan.md` beside this file orders the work.

A number prefixed `headwater` cites headwater's statement. A rule id
such as `signals.6` cites crew's `docs/architecture/`. `inputs.6` is
swancloud's. Each tool's statement is written from this design, as
`design/<tool>/requirements.md`, and the shared crates' statement is
plan step F1.

## What each one owns

| Who | Owns | Never |
|---|---|---|
| An adapter | One source. It lists the source's events, keys each one, fetches the raw material, and marks a capture that is its own excerpt. | Writes records, keeps a list of what it reported, cuts an excerpt, or reads a capture into signals. |
| The family's shared crates | The capture contract, the record formats, the shared-branch write protocol, the kind format, cadence, the built-in adapters and the conformance pack, each defined once in their statement and implemented once. | Know which tool or host uses them. |
| headwater | Releases and advisories for what a repository declares. It stands alone with its Claude Code and herdr plugins, and its Flywheel plugin holds an adapter millpond runs. | Knows which inbox records its releases. |
| eddy | Recorded meetings across meeting services, with an adapter per service. It stands alone as headwater does. | Reads a meeting into signals. |
| millpond | Runs adapters and takes the capture contract. Dedupes by key, banks raw material, and writes each capture, plus the one signal of a capture that is its own excerpt. Keeps the inbox, checks a reader's excerpts, writes moves and items, records each send and its outcome, and records each run. | Judges what a capture says, starts an agent, or plans across items. |
| flume | Places on the host it runs on: makes a worktree ready, starts each stage's agent in it with its prompt confirmed, and moves on when the stage's deliverable exists. Submits the work of a kind that lands, and tidies the place. Reports each place's state. | Decides what to launch, plans across items, or lets a session submit. |
| A reader, a session | Reads a capture that is not its own excerpt into signals, through millpond. | Lists a source. |
| Curation, a session | Proposes one move per signal, in batches, through millpond's tools. | Writes captures or signals. |
| sounding | Elaborations: the inputs each was opened with, the earlier soundings it is based on, its rounds and the operator's decisions, kept after its places are gone. flume runs its places and submits what its kind lands. It offers each finding beyond its inputs to millpond as a capture. | Submits, drives a pane or an agent, writes the inbox except through millpond, or plans across items. |
| The operator | Accepts or changes each batch of moves, sends an item, and decides each conclusion. | Picks through signals one at a time. |
| crew | Teams, plans and bolts. Its planner turns items into chores and units across teams. | Writes an inbox's records except through millpond. |
| sluice | Tests a change as merged and lands it. | Knows where the change came from. |
| The fleet (swancloud) | Says which adapter runs for which inbox, on which host, and when. Hands headwater the pins that only Nix can read. Watches every run from the doctor. | Runs an adapter's logic itself. |

An adapter is small because millpond does everything sources have in
common. swancloud's release adapter carries all of it alone today: its
own `landed` list, its `work/` and `raw/` folders, its 8 KiB cut, its
`status.json` and its landing loop. Under this design that plumbing
exists once, in millpond, and an adapter is only the code that knows
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

The contract is the one way captures reach an inbox. The family's
shared crates define it in their own statement and implement it once,
in a public repository of the family's own. millpond and the other open
tools build on those crates, and Flywheel builds on the same crates
later. One conformance pack proves every host and every adapter.

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
| `key` | yes | The source event's identity. The same event gets the same key from every host and every run. A `/` separates its segments. A key never starts with `/`, never has a `..` segment, and never starts with `captures` or `moves`. |
| `source` | yes | The source's name: `release`, `meeting`, `folder`, `deploy`. |
| `event_at` | yes | When the event happened, in RFC 3339. Never when it was captured, since weight counts by event date. |
| `title` | no | One line a person reads in a list. |
| `url` | no | Where the event lives upstream. |
| `raw` | no | The files the adapter wrote under the raw directory, as relative paths. |
| `excerpt` | no | Present only when the capture is its own excerpt. It holds the signal's fields: `text` (verbatim and whole), `kind`, `asserted_by`, `assertion`, `subjects`, `argues_with` and `position`. |

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

An adapter's plugin declares its command, the shape of its
configuration and the secrets it needs, in the declaration the shared
crates define. millpond reads that declaration, and Flywheel later
reads the same one. millpond runs the command as
`<command> --raw-dir <dir> [--cursor <c>]`, with the adapter's
configuration in the file the `CAPTURE_CONFIG` environment variable
names and each declared secret in the environment under its declared
name. On a host, millpond reads each secret at run time from a
directory the host's binding names, one file per secret, and never
writes it to state or status.

An adapter that signs in to its source keeps that sign-in itself. On
millpond the user signs in once per host. On Flywheel the host places
the secrets the plugin declares.

### Handing captures in

Two commands take the same lines:

- **`millpond land`** is the intake. It takes lines on standard input
  from whoever pipes them, such as a deployer, a script or a person,
  and knows nothing of who made them. Its `--raw-dir` names where the
  raw files are. Given none, it refuses any line that names raw files.
- **`millpond run <adapter>`** is the scheduled form. It makes a fresh
  raw directory, starts the adapter's command with that directory and
  its last cursor, and lands what the command prints. It then keeps the
  new cursor and the run's status: its exit, its failures and the tail
  of its standard error. Only a run knows which adapter ran, so only a
  run keeps a cursor or a status per adapter.

`millpond tick` runs every adapter of an inbox whose schedule is due,
so one timer on a host serves every adapter there. A schedule is
five-field cron, and a run missed while the host slept is caught up
once. Flywheel's host later takes the same schedules and the same
lines. An adapter never knows which host ran it.

### What millpond does with each capture

1. **Check it.** A line with a bad key, a missing field or an excerpt
   with no text is refused and named in the run. The rest are taken.
2. **Look up the key** in every capture the inbox holds. A key already
   held is passed over and counted.
3. **Bank the raw files** in the host's raw bank, under the capture's
   name. Raw material never enters git.
4. **Write the capture** with a pointer of the form `<host>:<path>`.
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

An inbox is the `inbox/` tree on a branch of a git repository. It holds
captures, signals, moves and items in the record formats of the
family's shared crates: recutils at rest, each record naming its format
and major version, and JSON only in flight. Each capture exists once at
rest, in the layout the shared crates' signals crate fixes (plan step
F2).

- **millpond names an inbox** by its repository and branch, and writes
  it by the shared-branch protocol ("Where state lives") through a bare
  cache of its own, with no checkout. A lock keeps one host's writers
  in turn: a tick, a reader, a curation session and crew's agents. A
  write that another host's push got ahead of is applied again to the
  new tip.
- **The settings** are one file, `.config/millpond.toml`, at the root
  of the branch that holds `inbox/`. It holds the adapters, each with its schedule, its configuration and
  the host whose tick runs it; the cut; the command that starts a
  reader; and whether items go to worktrees or to crew. An adapter
  names one host, so an inbox written from two hosts runs each adapter
  once.
- **The raw bank** is per host, in millpond's data directory,
  `$XDG_DATA_HOME/millpond/<inbox>/<capture>/`. Each capture points
  into it.
- **Cursors and run status** are per host, in millpond's state
  directory, `$XDG_STATE_HOME/millpond/<inbox>/<adapter>`.

Three setups use the same inbox files:

| Setup | The inbox | Who curates |
|---|---|---|
| On its own | `inbox/` on a branch of the user's own repository | a Claude session through millpond's tools; the user accepts |
| With crew | `inbox/` on the partition's branch in crew's state repository | crew's curator through the same tools; the operator decides per item on crew's rail |
| With Flywheel | `inbox/` on the branch Flywheel reads, the same files | Flywheel's curation session |

Going from one setup to the next pushes the inbox's history to the next
setup's branch, rewriting no record. It changes the curator and, in the
settings, the adapters' hosts. Nothing is captured twice, and Flywheel
imports nothing when it takes over.

### What comes in once

Two bodies of work predate their inbox, and millpond's signals-folder
import carries each in once, keeping each capture's source, event date,
signals and moves as they were read:

- **crew's folders** on each partition's flywheel branch, a
  `capture.md` and one `NN-<slug>.md` per signal, with `moves.rec`. A
  release capture keeps the key it landed under,
  `release/<name>/<version>`. The import keys every other capture by
  its folder's name.
- **The meeting corpus** already read in the partition's blueprints
  repository.

After the import every capture has one home, so the dedupe looks in one
place. An import keeps each capture's pointer and copies no raw
material.

## Reading and curation

A model runs in two places only: a reader and a curation session. Each
is a Claude session working through millpond's tools, which millpond
serves over MCP as `millpond mcp`:

| Tool | Does |
|---|---|
| `signals` | Lists signals by state, source, age, capture or subject. |
| `capture` | Reads a capture and its raw material. |
| `read` | Writes a capture's signals. millpond refuses one whose excerpt does not appear verbatim in the capture's raw material. |
| `moves` | Writes a proposed batch of moves, and once the operator accepts it, writes its moves in one commit. |
| `items` | Lists items with their signals, briefs and sends. |
| `brief` | Writes an item's brief. |
| `send` | Sends an item to flume as a fix or a change, or items that ask a question to a sounding. |

### A reader

A reader takes unread captures oldest first and writes their signals
with `read`. Three things start one: the user, with the read skill in a
session; the inbox's tick, with the command its settings name; or
crew's reader. The reader's instructions are the inbox's data: what
makes a signal, how to name a speaker a transcript leaves unnamed, and
the extraction rules the existing meeting pipeline wrote down. A
meeting recorded twice gives two captures, and its reader reads them
together and writes the second's signals once. A reader runs on the
host that banked the raw material it reads.

### Moves

Curation gives each signal one of six moves:

| Move | Consequence |
|---|---|
| `drop` | Records the reason. |
| `answered` | Names the claim or record that settled it. |
| `challenge` | Weighs against a claim. Only an inbox beside Flywheel's claims has one. |
| `join` | Makes an item, or grows a proposed one, from any number of signals. |
| `attach` | Puts the signal on an item already sent. |
| `route` | Offers a chore, which millpond makes an item of one, or an ask, which it records. |

An unmoved signal is never discarded, and weight counts by event date.

### Working through a backlog

Nobody picks through hundreds of signals by hand. The curate skill
starts a session that asks `signals` for the oldest fifty unmoved,
reads the raw material of the unclear ones, and proposes a move for
each. A batch might drop eighteen, answer six, and join twenty-six into
five items. The session writes the batch as proposed, and its moves
stand once the operator accepts it, as proposed or with rows changed.
The next batch starts where that one ended.

### Items

An item is the unit of work: the signals curation joined, one or many,
as five of a meeting's ten, or two bumps that move together. It is
Flywheel's proposed intent. millpond keeps its brief, which the session
writes with `brief`, and every place it was sent.

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
  and curation answers a later signal on the same subject by naming it.
- **An item owns no branch.** Each send is one place on a new branch
  cut from main, and its work lands back on main by itself. A sounding
  whose kind writes back lands the same way.
- **An inbox crew keeps sends no item to flume itself.** Its settings
  hand items to crew's planner, which takes each with `millpond hand`,
  recorded as the item's send, and orders them across teams, turning
  each into a chore or a unit. Planning across items is crew's today
  and Flywheel's later, never millpond's.

### The operator's surfaces

- **The Claude Code plugin** holds the curate and read skills and
  starts `millpond mcp`. Claude does the curating.
- **The herdr plugin** shows the inbox: the count and age of unmoved
  signals by source, a proposed batch, and items with their sends. Its
  keys are shortcuts for actions, such as sending an item.
- **crew's rail** shows an inbox crew keeps, one decision per item.

## Launching: flume

flume starts the work an item becomes, follows it through its stages,
submits it, and tidies its place. A launch names a repository, a kind,
a brief and a name. flume runs on one host and launches there.

### A place

- **flume makes the place:** a worktree of the repository at
  `<repository>/places/<kind>--<name>`, on the branch its kind names,
  `<kind>/<name>` by default, made ready by the repository's own
  declaration of what a worktree needs.
- **A kind is a list of stages.** Each stage names its prompt and its
  deliverable, and a kind that lands ends with flume's submission:

  | Kind | Stages |
  |---|---|
  | fix | code, then flume submits to sluice |
  | change | construct, which writes the OpenSpec change; code, which ticks its tasks; verify, which checks the work, commits its report in the change's directory and archives the change; then flume submits to sluice |

  A repository declares kinds of its own in `.config/flume.toml`, and
  sounding hands flume each elaboration kind with the launch. A
  deliverable counts only once made since its stage started.
- **A stage's report** is a file the agent committed, which the branch
  keeps after the place is gone. A report in the place's flume state
  folder, `{{state}}`, is allowed only where the caller keeps it
  lasting, as sounding copies a round's conclusion into its record.
- **Every kind is written in the family's one kind format,** which the
  shared crates define: stages in order, with the field names `agents`,
  `on_fail`, `max_send_backs` and `deliverables`, and a version per
  kind (`name@n`). flume runs a subset of it, stages in order with one
  agent each and send-backs. Flywheel reads the same declarations
  later, so a repository's kinds move from flume to Flywheel as they
  stand. An elaboration kind is a kind in the same format with an
  elaboration section, which sounding reads. flume reads its place and
  its stages.
- **Each stage starts a fresh agent** through flume's multiplexer seam:
  in a herdr pane, or as a command flume prints for the operator to
  run. A launch may say where the pane goes, such as beside the
  operator's own for a conversation. flume sends the stage's prompt
  only once the agent accepts input, and sends it again when the
  agent's transcript lacks it. Only flume drives herdr.
- **A stage ends when its deliverable exists**, or when its agent stops
  short and says what it needs, never when the pane goes quiet. Then
  flume starts the next stage. A stop check sends back an agent that
  tries to stop with neither. A conversation stage, an agent working
  with the operator, has no stop check and ends when the operator or
  the caller ends it.
- **A session commits and never submits.** After a kind's last stage,
  flume submits the place's branch through its merge-queue seam, of
  which sluice is one profile. A failed submission sends the place back
  to the stage the kind names, with the failure as that stage's words.
  A kind that never lands never reaches the merge queue.
- **flume tidies a place** once its work lands, is dropped, or its
  caller says it is done. On a landing through worktrunk, sluice's
  driver removes the worktree and its branch, and flume records the
  place gone. Otherwise flume removes only places it made, and keeps a
  branch that holds commits its target lacks.

### What moves a stage on

flume has no daemon of its own. Two plugins and its own commands settle
each place:

- **flume's Claude Code plugin** is loaded into every agent flume
  starts. Its stop hook settles the place the moment its agent goes
  quiet. The command that submits waits for sluice's verdict itself.
- **flume's herdr plugin**, on herdr's always-running server, catches
  what a hook cannot: a crashed, hung or killed agent, a prompt never
  received, an agent stuck working.

herdr with flume's plugin is required for unattended use, and only
there does flume move a place on whether or not a caller asks. Without
herdr, under the printed-command profile, flume runs attended and
settles places whenever a flume command runs.

### Profiles

Each seam of flume has profiles, the ways it is satisfied. A
repository binds them in the `[profiles]` table of `.config/flume.toml`,
beside its kinds:

| Seam | Profiles |
|---|---|
| `place` | worktrunk, or plain git worktrees |
| `merge_queue` | sluice, which reads sluice's own configuration for where the base lives |
| `change` | OpenSpec |

flume reads the table at the base revision, takes its own defaults
where the table is absent, and guesses nothing from other tools' files.
Each outside tool's commands and fields are checked against the real
tool and written into Part C of flume's statement as its profile is
built.

### What flume reports

`flume status --json` gives each place's kind, its stage, whether its
agent is working, waiting or stopped, whether the stage's deliverable
exists, and its submission. For a change, flume reads the OpenSpec
change's own files, so the status shows its tasks ticked. millpond
keeps an item's record, and sounding an elaboration's. flume keeps only
the live state of the places it runs, in `$XDG_STATE_HOME/flume/`.

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
  `retry`, `finish`, `done` and `tidy`.
- **The Claude Code plugin** gives every session `/launch` and serves
  `status` over MCP. In a place, it holds the stop hook and refuses an
  agent's own submission or push.
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
- **Its name** says its question in words. It is unique in its
  repository and never changes.
- **A sounding can be based on earlier ones,** as a Claude Code session
  is forked. It carries each one's record whole, its inputs, rounds,
  the operator's notes and decisions, and its conclusion, and each
  one's branch, which the session can read. A kind may hand over their
  sessions' transcripts too. An earlier sounding may have been dropped
  or still be open, and nothing in it changes.
- **Its kind** is an elaboration kind, in the shared kind format. Its
  elaboration section says what a round is handed, what its conclusion
  holds, how a round ends, and what lands. sounding ships kinds of its own, a
  repository declares its own, and a launch may carry one. A round ends
  in one of three ways:

  | A round | Ends |
  |---|---|
  | ends itself | on a conclusion, or a note saying where the next round would start; a stop check sends the session back otherwise |
  | stands | when the operator says finish; it stays open when idle |
  | works with the operator | when the operator ends it, as a conversation in a pane beside theirs, with no stop check |

  The default kind, a question, ends itself and lands nothing.
- **The place** is a worktree of the repository the sounding is about,
  on the branch `sounding/<name>`. Every elaboration kind names its
  places' branches so and hands flume that naming with the kind. flume
  makes the place and runs it with the kind's
  stages. The session commits its work there, and may write prototype
  code to test an answer. Only what the kind names lands, such as a
  design-book chapter, claims or a context map, and flume submits it
  straight onto the target, main by default. A prototype never lands.
  The work it points to reaches main through an item's worktree or
  crew's plan.
- **Its record** holds its inputs, the soundings it is based on, its
  rounds, the operator's notes and decisions, its offers and asks, and
  its conclusion. sounding keeps it off the branch that lands: in the
  repository's clone on the host, `<common>/sounding/<name>/`, and as
  the same tree under `refs/sounding/<name>` on the repository's own
  remote when hosts share it. The branch that lands carries only what
  the kind says lands.
- **flume runs and settles each round** and reports whether its session
  is alive. sounding has no clock of its own: it hands an offer again,
  tells an item's keeper again and reads its cards whenever a sounding
  command runs and whenever its herdr plugin refreshes.
- **A parked sounding**, with no round running and nothing waiting on
  the operator, resumes only on the operator's word.
- **The session** ends a round with `sounding conclude` or `sounding
  note`, and may offer and ask along the way:

  | Exit | What follows |
  |---|---|
  | `sounding conclude` | Writes the conclusion: the answer, its evidence, what it would change, the work it proposes, and what stays open. It is the round's report, `{{state}}/conclusion.md` in the place's flume state folder. flume ends the stage on it, sounding copies it into the record when it settles the round, and the operator decides it. |
  | `sounding note` | Keeps a note of what the round did and where the next round would start, and stops the round short. |
  | `sounding offer` | Hands a finding beyond the sounding's inputs to `millpond land` as a capture of its own, and the session goes on. The finding is its own excerpt, of kind `ask`, asserted by `sounding/<repository>/<name>`, under the key `sounding/<repository>/<name>/<n>`, one key per offer. |
  | `sounding ask` | Puts a question only the operator can answer on a card. The session waits for the answer, then goes on. |

  A conclusion or a note closes the round's open asks as unanswered
  and withdraws their cards. A round whose session is gone leaves them
  open.

### Deciding a conclusion

The operator decides each conclusion on a card, in sounding's herdr
plugin, or on crew's rail. A round's own session is refused accept, go
on and drop, for every sounding.

- **Accept** settles each item the sounding took, and flume submits
  what the kind lands. millpond keeps the conclusion as each item's
  record, and each piece of work the conclusion proposes becomes an
  item of its own, or an entry in crew's plan.
- **Go on** starts the next round in the same worktree. The conclusion
  joins the record as an ended round, and the operator's notes join the
  next session's inputs.
- **Drop** records the reason. flume removes the worktree and keeps its
  branch, and the record stays.

A conclusion never becomes a signal. Curation never judges a moved
signal again, and an approval is never asked twice. An accepted
conclusion enters the inbox as the record that settles signals, and
only offers come back as signals.

### Where soundings come from

| Setup | Inputs from | Conclusions decided on |
|---|---|---|
| On its own | the operator's `/sound`, naming its inputs and any earlier soundings | a card, or sounding's herdr plugin |
| With millpond | items millpond sends; a key on a headwater release that needs judgment; `/sound` on a decision a meeting left open, its transcript an input | the same, recorded against each item |
| With crew | crew's planner and design agent, calling `sounding open` as crew calls millpond | crew's rail |
| With Flywheel | an intent's elaborations, each one a sounding cut from the intent's line | Flywheel's elaboration types, which write the conclusion into the design book and claims on the intent's line, which lands when the intent is archived |

### The operator's surfaces

- **The command line:** `sounding open`, `list`, `conclude`, `offer`,
  `note`, `ask`, `accept`, `go-on`, `finish`, `drop` and `resume`.
- **The Claude Code plugin** gives every session `/sound`, which opens a
  sounding on the inputs it names while the session goes on with its
  own work. A sounding's session gets its inputs, the records it is
  based on and its earlier rounds from a hook at its start. The plugin
  serves `soundings`, `conclusion`, `accept`, `go_on` and `drop` over
  MCP.
- **The herdr plugin** only displays. It lists open soundings in
  flume's sidebar, each with its round and its state: working, waiting
  on the operator, or parked. Its keys pass only the operator's
  responses, accept, go on, finish, drop and resume, to sounding's
  core. It opens no pane, starts no agent and sends nothing to a
  session.
- **Where a round's pane goes** is a launch setting sounding hands
  flume. A round with the operator opens beside their pane
  (`--with-me`). flume alone drives herdr.
- **Where requests go**, the cards, sounding's rows or crew's rail, is
  bound in a `[bindings]` table of the operator's configuration, which
  a repository may override.

## Sources

### Releases: headwater

headwater is a tool for dependencies, never a capture framework. It
reads what a repository declares and reports every release newer than
each pin, with its notes and advisories. Each service it asks is a
lookup.

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
- **A repository is one clone.** headwater's held state, its
  acknowledgements among it, stays in the clone's common git directory.
  A recorder never acknowledges, so a curation drop of a release signal
  never writes headwater's state. A shared profile for acknowledgements
  waits until two hosts need one.
- **Alone**, headwater runs with its Claude Code and herdr plugins:
  - a sidebar of unread releases;
  - a brief a fixer reads;
  - a key that hands the release's brief to flume, which starts an
    agent in a worktree to make the bump and submits it to sluice.
- **The Flywheel plugin's adapter**, `headwater capture`, prints a
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
program lists them and a session reads them.

eddy stands alone as headwater does. It lists and fetches meetings
across services, with a Claude Code plugin that pulls a transcript into
a session and a herdr plugin that shows the day's meetings. Its
Flywheel plugin holds one adapter per meeting service. Each adapter
lists recorded meetings since its cursor, keys a meeting by its service
and the meeting's own id, writes the transcript as raw, and carries no
excerpt.

The adapters share everything but the service:

- the key's shape;
- the meeting's title, start, length and attendees;
- the raw layout: the transcript as served, plus a plain copy with one
  line per turn;
- skipping a meeting too short to hold anything.

An adapter's own code is listing and fetching from its service.

| Adapter | Source | Key | When |
|---|---|---|---|
| `wispr` | Wispr Flow's MCP endpoint over HTTP. The adapter is an MCP client with its own sign-in, and no Claude session runs to list meetings. | `meeting/wispr/<id>` | first |
| `webex` | Webex's transcripts API | `meeting/webex/<id>` | when a partition records on Webex |
| `teams` | Microsoft Graph's meeting transcripts | `meeting/teams/<id>` | when a tenant's administrator consents |

- **The id** names one transcript of one meeting. It folds in the
  transcript's own id for Teams and Webex, and the tenant or account
  wherever a service's ids are not unique across them, as each
  service's profile says.
- **The cursor** is the service's own change mark where it has one,
  and otherwise each run looks back over a window the adapter's
  settings give. Each service's profile says which.
- **A meeting that never becomes ready** is named failed on each run
  until the adapter's `give_up_after` passes, then named failed once
  more, and the cursor moves past it.
- **A sign-in** that its service renews and voids on use lives in
  eddy's own sign-in store on the host that runs the adapter. That
  store is authoritative, and the environment only seeds it.

`event_at` is when the meeting started, never when it was captured.

An adapter counts as a meeting adapter when it passes the meeting
checks in the conformance pack. The services most partitions record on
live in eddy, each tested by replaying recorded responses. Anyone can
publish a meeting plugin of their own, listed in the plugin index
beside eddy's. For the long tail, a generic adapter, shipped in eddy
under a name the operator gives it, lists meetings from any MCP
endpoint that serves transcripts, and the folder drop takes the rest.

### Any other file: the folder drop

A file dropped in a watched folder is one capture. That covers a Teams
transcript downloaded by hand, an email saved as `.eml`, or a PDF.

- **The folder adapter** is built into millpond from the shared crates'
  adapters crate: `millpond capture folder <dir>` prints contract
  lines.
- **The key** is `folder/<folder name>/<sha256 of the file>`, so a file
  dropped twice, or under another name, is one capture.
- **`event_at`** is the date the file's name begins with, or else its
  last write.
- **`source`** is `folder`. No capture carries an excerpt, so a reader
  reads each one and tells a transcript from an email by what it holds.

A service that sends many files of one kind earns an adapter of its
own. Until then the folder takes them.

### Built in or shipped with its tool

An adapter whose source needs no other tool ships inside millpond: the
folder drop, a meeting file and the signals-folder import, all from the
shared crates' adapters crate. An adapter that wraps another tool's
domain ships with that tool, so headwater's and eddy's adapters stay
theirs and millpond runs them like anyone else's.

### Sources already built

- **crew's own signals**, agents' and the operator's findings, go
  through `crew signal`, which writes through millpond.
- **swancloud's deployer** pipes a failed step's capture to
  `millpond land`, the step's last lines its excerpt.
- **Flywheel's** page capture box and chat forwards arrive when
  Flywheel hosts.

## Plugins

A plugin is the installable unit in every host, and each host knows its
own kinds of content:

| Host | A plugin holds |
|---|---|
| Claude Code | skills, hooks, commands, MCP servers |
| herdr | actions, panes, events |
| Flywheel | adapter, chat sink, runner, router, sign-in, unit type, elaboration type, deliverable producer, map vocabulary, template, scenario pack |

Flywheel's "package" and "bundle" become "plugin". millpond runs a
Flywheel plugin's adapters and nothing else of it.

- **headwater** keeps one plugin per host under `plugins/` beside its
  core (sluice ADR 0023): `plugins/claude`, `plugins/herdr` and
  `plugins/flywheel`.
- **eddy** keeps the same layout. Its Flywheel plugin holds an adapter
  per meeting service.
- **millpond** keeps `plugins/claude` and `plugins/herdr`. Its built-in
  adapters are commands of its own.
- **sounding** keeps `plugins/claude` and `plugins/herdr`.
- **flume** keeps `plugins/claude` and `plugins/herdr`.

## On a fleet

swancloud runs every adapter on the host its list names:

- **One list** in `lib/` says which adapter runs for which partition's
  inbox, on which host, and when. It grows out of
  `lib/release-sources.nix`, and each inbox's `.config/millpond.toml` is
  generated from it. A launchd agent per inbox on its host runs
  `millpond tick`, and the doctor shows a row per adapter from
  `millpond status --json` (`lists.1`, `doctor.1`).
- **The watch list** gives headwater the pins that only Nix evaluates.
  It is generated from the tools list and committed, and a flake check
  refuses it when it drifts from the evaluation, as `moon-tasks` does
  for `checks/moon.yml`. Each entry has a name, an upstream, a tag
  pattern, a pin, and its claims, the files a bump moves.
- **A sign-in** an adapter needs (Wispr's) is made once per host by the
  user, as Pending You's is.
- **Every adapter is a single-host role** (`fleet.6`), and the adapters
  move together when a host hands over. Their cursors stay on the host
  they ran on, so the new host's first run lists without one, and
  millpond's dedupe absorbs the overlap.

## Where state lives

One convention places every piece of state the open tools and crew
keep, so a repository goes from one tool alone to crew, and then to
Flywheel, without its state being copied. Each piece lives in one of
five layers:

| Layer | Where | Read by | Shared across hosts |
|---|---|---|---|
| 1. host | the host's directories by kind, each under `<tool>/`: `$XDG_CONFIG_HOME`, `$XDG_STATE_HOME`, `$XDG_DATA_HOME`, `$XDG_CACHE_HOME` | the tool on that host | never |
| 2. worktree | the worktree's own git directory, `<wtgit>/<tool>/`, or an untracked `.<tool>/` that git excludes | the tool and the session in that place | never |
| 3. clone | the clone's common git directory, `<common>/<tool>/`, which every worktree of the clone shares | every worktree of one clone | only as `refs/<tool>/` on the repository's own remote |
| 4. shared branch | a branch on a remote, kept in a bare cache on each host that reads it, each tool under a prefix of its own | every host and tool that fetches it | yes |
| 5. content | files tracked on a repository's branches, and its commits | everyone with the repository | as the repository is |

The rules:

- **A piece of state lives in the lowest layer that holds every reader
  it has.** One host's readers: the host. One place's: the worktree.
  Every worktree of one clone: the clone. Several hosts or several
  tools: a shared branch. A repository's owners: content.
- **Host state goes by kind.** Config is what the operator or the fleet
  writes. State is what a tool can lose at the cost of a restart or a
  wider listing: cursors, run status, host bounds, a place's live state.
  Data is what cannot be fetched again, such as raw material. Cache is
  what can be built again, such as bare clones. Only data is backed up.
  A cache that serves one clone stays in `<common>/<tool>/caches/`, and
  every backup leaves it out.
- **A tool's records about one repository stay with that repository**,
  in `<common>/<tool>/`, and under `refs/<tool>/` on its own remote when
  hosts share them, written by a push with lease. They never go into a
  state repository. crew and Flywheel read them as evidence.
- **No layer holds a secret in the clear.** A sign-in is the tool's on
  its host.
- **Every record names its format and its major version,** and a reader
  reads every earlier version as it stands. On a shared branch a record
  is recutils, with `format: <tool>-<record>/<n>`, and JSON exists only
  in flight. A clone's records keep the tool's own format, so sluice's
  JSON stays.
- **A repository declares itself to a tool** in `.config/<tool>.toml`,
  read from the branch's revision.
- **Every deliverable a later reader needs is committed** with the
  work. A stage's report in the place's flume state folder is allowed
  only where the caller keeps it lasting.
- **Cursors stay on the host and never move.** Raw material stays on
  the host that banked it, in its data directory and under its backup.

### Writing a shared branch

One protocol writes every shared branch. The shared crates implement
it, and crew keeps a Python twin of it (`code.1`):

1. Fetch the branch's tip into the tool's bare cache,
   `$XDG_CACHE_HOME/<tool>/git/`.
2. Apply the write to that tip, and check every file it changed with
   `recfix` and the tool's own rules.
3. Commit the write as one commit through a temporary index, touching
   no working tree, with a message that names the write.
4. Push without force, with the tip that was read as the expected old
   value.
5. When the push is refused, apply the write again to the new tip and
   push again, a bounded number of times, then report.

A lock in `<common>` keeps one host's writers in turn and saves a
refused push. It never stands in for step 4. A branch with no remote
takes the same steps, with step 4 an `update-ref` from the expected old
value. Two writers of one record, such as two moves for one signal,
meet at step 2's check on the new tip, which refuses the second.

Under crew, the run record is `runs/<host>/<day>.rec` on the
partition's branch. Each host appends only to its own files, so what
the hosts carry never conflicts. A tool on its own keeps no run record
and logs on its host.

### Each tool's state

| Tool | Host | Worktree | Clone | Shared branch | Content |
|---|---|---|---|---|---|
| sluice | run count and ports in state; its forge identity in config | none | records, results log, runs, logs and caches in `<common>/sluice/`; `refs/sluice/state/<branch>` when hosts share them | none | `.config/sluice.toml`; each landing's trailers |
| headwater | none | none | held state and notes in `<common>/headwater/`, acknowledgements among them | none | `.config/headwater.toml`; a watch list |
| eddy | sign-ins in state | none | none | none | none |
| millpond | the raw bank in data; cursors and run status in state; its bare cache in cache | none | a lock for one host's writers | the inbox under `inbox/`, with `.config/millpond.toml` | none |
| sounding | none | the place flume makes | its record in `<common>/sounding/<name>/`; `refs/sounding/<name>` when hosts share it | offers, through millpond | what its kind lands |
| flume | each place's live state in state | the place; the readied toolchain in `<wtgit>/flume/` | none | none | deliverables as commits, a verify report in its change's directory |
| crew | team state in state; bare caches in cache | places, through flume | none | the plan, proposals and run record on `<label>/main`, and the inbox under `inbox/` on the same branch | none |

From a tool alone to crew nothing moves: records stay with their
repositories, cursors and raw material stay on their hosts, and the
inbox keeps its files. From crew to Flywheel, crew's plan and proposals
are imported once, keeping every id. That import is the one copy on the
whole path.

## Built once, used everywhere

| What | Built in | Used by |
|---|---|---|
| The contract's types and key rules, JSON in flight and recutils at rest, a sha256 content hash, and the excerpt cut | the shared crates' capture crate | millpond, headwater's and eddy's adapters, sounding's offers, and Flywheel later |
| The signal, move and item records and the inbox's layout | the shared crates' signals crate | millpond, and Flywheel later |
| The shared-branch write protocol | the shared crates | millpond, and Flywheel later; crew keeps a Python twin |
| The kind format, an elaboration kind's section among it | the shared crates | flume, sounding, and Flywheel later |
| The folder drop, the meeting file and the signals-folder import | the shared crates' adapters crate | millpond, and Flywheel later |
| Cadence: five-field cron, caught up once | the shared crates | `millpond tick`, and Flywheel's tick later |
| The conformance pack: lines in, records expected | the shared crates | millpond and Flywheel as hosts, every adapter |
| Raw banking with a host-qualified pointer, the checks on a capture, and the verbatim check on a reader's excerpt | millpond, from crew's checks | Flywheel later |
| Finding releases and reading their notes | swancloud's release adapter | headwater's lookups and its Flywheel plugin |
| Elaborations: the inputs, the soundings one is based on, the kinds, the rounds and the conclusion's shape | sounding, from crew ADR 0019 | crew, Flywheel's elaborations |
| Places, a fresh agent per stage, prompt delivery, stages that end on their deliverable, submission, and tidying | flume, from crew's `teams.2`–`4`, `teams.11`, `teams.15` and `plan.9`, `10`, `12`, `17` | millpond, headwater, sounding, crew |

crew's Python uses only the standard library (`code.1`). crew reaches
signals only through millpond's command line, as it reaches landings
only through sluice's, and links no crate.

## What each record gains

- **The shared crates' statement**, new:
  - the capture contract and its lines, and how an adapter is declared
    and run;
  - a capture that is its own excerpt, and raw banking behind a pointer
    of the form `<host>:<path>`;
  - an import that keeps each capture's key;
  - the records of captures, signals, moves and items, the item holding
    a proposed intent's brief and sends, and the inbox's layout;
  - the shared-branch write protocol, the kind format with an
    elaboration kind's section, cadence and the conformance pack.
- **millpond's statement**, new: the inbox, the contract's intake, the
  tools, sends, the three setups, and its storage profile in Part C.
- **eddy's statement**, new: listing and fetching meetings across
  services, keys, raw transcripts, cursors and sign-ins, and its
  storage profile in Part C.
- **sounding's statement**, new: the inputs, the soundings one is based
  on, elaboration kinds, the place through flume, the three exits,
  rounds, the operator's decision, and its record kept off the branch
  that lands.
- **flume's statement**, new: a launch, places, kinds and stages,
  prompt delivery, stage ends, submission, what moves a stage on, its
  profiles, status and tidying.
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
    `teams` and `plan` rules flume takes over amended to name it;
  - the family's storage convention binds crew: `state.1` is the
    shared-branch protocol, new captures bank their raw material in
    millpond's bank, and a team's place and stage state becomes
    flume's.
- **headwater's statement:**
  - its 33 rulings, among them "lookup" for each service headwater
    asks;
  - each release marked inside or outside the declared range;
  - each ecosystem's package manager as a lookup, with deps.dev where
    none runs;
  - a brief naming the ecosystem's command for the move, amending
    headwater 27, and carrying the published package's diff;
  - claims on a watch-list entry;
  - the key a watch-list entry gets;
  - its Flywheel plugin prints the contract;
  - a repository is one clone, whose held state a curation drop never
    writes.
- **sluice's statement:** its shared records are spelled
  `refs/sluice/state/<branch>`, and `caches/` and `.tmp/` are cache,
  which every backup leaves out.
- **swancloud's record:**
  - `inputs.6` and ADR 0020 name headwater and millpond;
  - the release adapter retires;
  - the list of adapters grows out of `lib/release-sources.nix`.

## Open

- **The shared crates' name,** and with it the name of their
  repository and the prefix of the inbox records' format names. The
  operator chooses it when the repository is made (plan step F0).
- **A package manager in the repository's shell** and headwater 5,
  which says reading a repository changes nothing in it. The commands
  headwater runs only read, but entering a repository's shell can
  write, as devenv writes its lock.
- **Attestation in sluice:** sluice signing the verdict it lands, with
  an executor vouched for from outside the team that ran it.
- **How crew's stage prompts move into the kind format,** in each kit's
  `.config/flume.toml` (C7).
- **Keeping a prototype off the branch that lands.** The branch that
  lands carries only what an elaboration's kind names, and the record
  is kept off it. Where a round's prototype code is kept apart from
  that branch is for sounding's and flume's statements to rule.
- **A standing sounding that wakes on a signal**, starting a round when
  a signal on its subject lands, as Flywheel's standing elaborations
  do.
- **How long raw material is kept:** for good, or until every signal of
  its capture has a move and the inbox's retention has passed, with the
  capture saying its raw material is gone.
- **Who fetches `refs/<tool>/`.** A forge's clones skip refs outside
  `refs/heads/` and `refs/tags/` unless asked, so each reader needs a
  refspec of its own.
- **crew's two open records disagree.** ADR 0019 rests an elaboration
  on an intent and the `new-territory` move, and `curation-and-agenda`
  leaves intents out and replaces that move with `join`. A sounding
  sent from an item settles both, once crew's record says so (C6).
