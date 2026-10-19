# Capture: the plan

The order of work for `design.md`. Each phase ends with something
running on real work before the next phase depends on it. Steps that
share no dependency run side by side: once millpond's core exists,
headwater, eddy, millpond's plugins and crew's move onto millpond all
proceed at once. sounding needs nothing of millpond's until millpond
sends it questions (Q5), and flume needs only crew's rules to extract
from.

Each step is done in its repository's own process:

- a statement or amendment in this repository;
- an OpenSpec change in crew, flywheel-next or swancloud;
- millpond's, headwater's, eddy's, sounding's and flume's
  repositories, scaffolded from kit-standard.

A step's change name is suggested where one helps. **Done when** names
a check or an observation, never a list to tick by hand.

## Where it stands

| Step | What | Needs | Status |
|---|---|---|---|
| D1 | Rule headwater's 33 questions | none | waiting on the operator |
| D2 | Rule this design's decisions | none | waiting on the operator |
| D3 | Decide the old meeting sweep's fate | none | waiting on the operator |
| D4 | Rule the family's storage | none | analysis under way |
| P1 | Write millpond's statement | none | under way |
| E0 | Write eddy's statement | none | under way |
| Q1 | Write sounding's statement | none | under way |
| L1 | Write flume's statement | none | to do |
| H1 | Amend headwater's statement | D1, D2 | to do |
| F1 | Write the contract and the inbox into Flywheel's statement | D2 | to do |
| C1 | Amend crew's record | D2 | to do |
| F2 | The capture and signals crates, and the conformance pack | F1 | to do |
| F3 | The adapters crate | F2 | to do |
| P2 | Scaffold millpond's repository | P1 | to do |
| P3 | millpond's core | P2, F2, F3 | to do |
| S1 | The release adapter lands through millpond on trial | P3 | to do |
| H2 | Scaffold headwater's repository | H1 | to do |
| H3 | headwater's walkthrough and phase-1 brief | H2 | to do |
| H4 | headwater's core | H3 | to do |
| H5 | headwater's lookups | H4 | to do |
| H6 | headwater's Flywheel plugin | H4, F2 | to do |
| H7 | headwater's Claude Code and herdr plugins | H4, L3 | to do |
| E1 | eddy | E0, F2 | to do |
| P4 | millpond's tools and Claude Code plugin | P3 | to do |
| P5 | millpond's herdr plugin | P3 | to do |
| L2 | Scaffold flume's repository | L1 | to do |
| L3 | flume's core and Claude Code plugin | L2 | to do |
| L4 | flume's herdr plugin | L3 | to do |
| P6 | Send an item through flume | P4, L3 | to do |
| Q2 | Scaffold sounding's repository | Q1 | to do |
| Q3 | sounding's core and Claude Code plugin | Q2, L3 | to do |
| Q4 | sounding's herdr plugin | Q3, L4 | to do |
| C2 | crew calls millpond | C1, P3 | to do |
| S2 | Generate swancloud's watch list | H1 | to do |
| S3 | The list of parts, their ticks and doctor rows | C2 | to do |
| S4 | Cut swancloud's releases over to headwater | S1, S2, S3, H5, H6 | to do |
| C3 | crew's reader | C2, P4 | to do |
| S5 | Run eddy and the folder drop | E1, S3 | to do |
| E2 | Retire the old meeting pipeline | S5, C3 | to do |
| C4 | crew's curator moves through millpond | C2, P4 | to do |
| C5 | A release reaches a landed bump | C4, S4 | to do |
| Q5 | millpond sends a question to a sounding | P6, Q3 | to do |
| C6 | crew calls sounding | C1, C4, Q3 | to do |
| C7 | crew calls flume | C1, L3 | to do |
| F4 | Flywheel's host on the same crates | F2, F3 | to do |
| F5 | crew becomes Flywheel | F4, C2 | crew's roadmap |

## Phase 0: rule and write down

### D1 Rule headwater's 33 questions

- **Where:** this repository, `design/headwater/`.
- **Does:** the operator rules each of the reconstruction's 32
  questions, plus the 33rd, "lookup" for what the statement calls a
  source. The rulings go into `models/reconstruction-1-answers.md`.
- **Done when:** the answers file is committed beside the model.

### D2 Rule this design's decisions

The operator accepts or changes each of these:

1. headwater is for dependencies and eddy for meetings. The work every
   source shares is millpond's, through the contract.
2. millpond is a standalone tool, the inbox. It runs adapters, keeps
   captures and signals, serves the tools curation works through, and
   sends an item to a worktree. crew calls its command line as it calls
   sluice's.
3. Flywheel's statement owns the contract and the record formats.
   flywheel-next's crates implement them once, millpond is built on
   them, and Flywheel's host is later built on the same crates.
4. An inbox is a git repository, or a branch in one, in Flywheel's
   formats. crew's partition branches become inboxes, crew's folders
   and the meeting corpus are imported once, and Flywheel reads the
   same inboxes with no import.
5. The unit of work is an item, the signals curation joined, one or
   many. millpond sends one item to one worktree. Planning across items
   is crew's planner today and Flywheel's later.
6. A Claude session works a backlog through millpond's tools,
   proposing moves in batches the operator accepts or changes. herdr
   shows the counts, reviews a batch and sends an item.
7. A program lists meetings and a session reads them. eddy holds a
   part per meeting service, its Wispr part an MCP client that starts
   no Claude session. Others publish meeting plugins of their own.
8. An adapter whose source needs no other tool ships inside millpond.
   One that wraps another tool's domain ships with that tool, so
   headwater's and eddy's parts stay theirs.
9. "Plugin" replaces Flywheel's "package" and "bundle".
10. The release adapter lands through millpond on trial (S1) before
    headwater exists, so the contract carries live captures first.
11. sounding is a standalone tool that runs elaborations over a closed
    set of inputs its opener names. Each works in rounds, in places
    flume runs, and ends on a conclusion the operator accepts, sends
    back or drops. Its elaboration kinds say how a round ends and what lands,
    and flume submits what lands straight onto the target. millpond
    sends it one or more items, the accepted conclusion is each item's
    record, and only a finding beyond its inputs comes back as a
    capture.
12. flume is a standalone tool that launches and tracks one agent per
    stage in one worktree through a kind's stages on the host it runs
    on, taken from crew's places and stages. It submits the work of a
    kind that lands, and no session submits. millpond's send,
    headwater's fix key, sounding and crew call it; millpond keeps the
    item's record, sounding the elaboration's, and flume the live state
    of each place.

- **Done when:** each decision is accepted or changed, and `design.md`
  and the statements say what was ruled.

### D3 Decide the old meeting sweep's fate

- **Where:** the instance repository that runs it.
- **Does:** the operator stops or repairs the existing daily sweep
  while eddy is built.
- **Done when:** the sweep either runs green or is unloaded.

### D4 Rule the family's storage

- **Where:** this repository, `design/capture/models/storage.md`.
- **Does:** inventories every piece of state each tool keeps (sluice,
  headwater, eddy, millpond, sounding and crew) against Flywheel's
  state repository, and proposes one convention, so that moving from a
  tool on its own to crew and then to Flywheel moves no data. The
  operator rules its numbered decisions.
- **Done when:** the decisions are ruled, and each statement's Part C
  names the storage profile they set.

### P1 Write millpond's statement

- **Where:** this repository, `design/millpond/`.
- **Does:** writes millpond's statement from `design.md`, as
  headwater's was written: the inbox, the contract's intake, the seven
  steps, the reader and curation tools, moves, items and sends, the
  three setups, and what millpond never does. A fresh model then
  reconstructs millpond from the statement alone, and the operator
  rules the questions it asks.
- **Done when:** the reconstruction's questions are ruled and folded
  into the statement, Vale is clean, and the operator agrees to land it
  on `main`.

### E0 Write eddy's statement

- **Where:** this repository, `design/eddy/`.
- **Does:** writes eddy's statement from `design.md` and eddy's book:
  listing and fetching recorded meetings across services, keys, raw
  transcripts, cursors and sign-ins, a part per service, its plugins,
  and what eddy never does. A fresh model reconstructs eddy from the
  statement alone, and the operator rules the questions it asks.
- **Done when:** the reconstruction's questions are ruled and folded
  into the statement, Vale is clean, and the operator agrees to land it
  on `main`.

### Q1 Write sounding's statement

- **Where:** this repository, `design/sounding/`.
- **Does:** writes sounding's statement from `design.md`: the inputs,
  the soundings one is based on, elaboration kinds and what they land,
  and the place through flume. It covers the three exits, the stop
  check, rounds, the operator's decision, and what sounding never does.
  A fresh model reconstructs sounding from the statement alone, and the
  operator rules the questions it asks.
- **Done when:** the reconstruction's questions are ruled and folded
  into the statement, Vale is clean, and the operator agrees to land it
  on `main`.

### L1 Write flume's statement

- **Where:** this repository, `design/flume/`.
- **Does:** writes flume's statement from `design.md` and crew's
  `teams` and `plan` rules it takes over: a launch, places, kinds and
  stages, prompt delivery, stage ends, submission, status, tidying, and
  what flume never does. A fresh model reconstructs flume from the statement
  alone, and the operator rules the questions it asks.
- **Done when:** the reconstruction's questions are ruled and folded
  into the statement, Vale is clean, and the operator agrees to land it
  on `main`.

### H1 Amend headwater's statement

- **Where:** this repository, `design/headwater/requirements.md`.
- **Does:** writes D1's rulings and these into the statement:
  - claims on a watch-list entry;
  - the key a watch-list entry gets;
  - the Flywheel plugin prints the contract;
  - each release is marked inside or outside the range its declaration
    gives, which the dependency description now carries;
  - each ecosystem's package manager, run read-only in the repository's
    shell, is a lookup, with deps.dev where none runs;
  - a brief names the ecosystem's own command for the move, amending
    27, and can carry the published package's diff between the pin and
    the release.

  New clauses take the next free numbers from 53.
- **Done when:** Vale is clean, and the operator agrees to land it on
  `main`.

### F1 Write the contract and the inbox into Flywheel's statement

- **Where:** this repository, `design/flywheel-next/requirements.md`.
- **Does:** adds clauses and scenarios for:
  - running an adapter part;
  - handing captures in;
  - a capture that is its own excerpt;
  - raw banking;
  - a source's configuration and cursor;
  - an import that keeps keys;
  - the item record, a proposed intent's brief and sends;
  - "plugin" in place of "package" and "bundle".

  These amend 109, 112, 114, 215, 217e, 217g, 217h, 228, 231 and 284.
- **Done when:** a fresh model, given the amended clauses alone,
  reconstructs the contract's lines and the seven steps without a
  question this design leaves open.

### C1 Amend crew's record

- **Where:** crew, `docs/architecture/` and `docs/adr/`.
- **Does:**
  - amends `signals.1`: a partition's signals live in its inbox,
    written through millpond;
  - amends `signals.6`: millpond writes and cuts the own-excerpt
    signal;
  - adds an ADR, "crew calls millpond as it calls sluice";
  - rewrites the open change `daily-pass-through-crew` as the reader
    (C3), and `curation-and-agenda` as the curator (C4);
  - turns ADR 0019 into "crew calls sounding as it calls millpond",
    with an item in place of its intent, so it and
    `curation-and-agenda` agree (C6);
  - adds an ADR, "crew calls flume for each place and stage", and
    amends `teams.2`–`4`, `teams.11`, `teams.15` and `plan.9`, `10`,
    `12`, `17` to name flume (C7).
- **Done when:** the record lands through sluice, and `_open.md` no
  longer asks where meeting signals live.

## Phase 1: the contract and millpond's core

### F2 The capture and signals crates, and the conformance pack

- **Where:** flywheel-next. Change: `the-capture-contract`.
- **Does:**
  - splits the contract's types and key rules out of `signals.rs` into
    a capture crate, with JSON in flight, rec at rest, a sha256 content
    hash and the excerpt cut;
  - splits the signal, move and item records and the inbox's layout
    into a signals crate;
  - publishes a conformance pack of contract lines and the records a
    host must write from them, with the meeting checks a meeting part
    passes.
- **Done when:** Flywheel's own tests pass the pack, and millpond,
  headwater and eddy can depend on the crates at a tag.

### F3 The adapters crate

- **Where:** flywheel-next, in F2's change or the next.
- **Does:** moves the folder drop, the meeting file and the
  signals-folder import into a crate whose adapters print contract
  lines. The folder key takes the capture crate's sha256, and the
  import keys each capture by its own key.
- **Done when:** each adapter's output passes the pack, and importing
  one folder twice writes nothing the second time.

### P2 Scaffold millpond's repository

- **Where:** `agentplot/millpond`, new, in Rust on kit-standard's code
  profile. It follows sluice's seed commit.
- **Does:** writes `CLAUDE.md` pointing at the statement, a README, a
  license, `adrs.toml`, the founding ADRs (built on flywheel-next's
  crates, plugins outside the core, the inbox in Flywheel's formats),
  `docs/architecture/core.md` and `_open.md`, and the kit's devenv,
  moon, sluice gate, `cliff.toml` and OpenSpec configuration.
- **Done when:** sluice protects `main`, and the first change lands
  through it.

### P3 millpond's core

- **Where:** millpond.
- **Does:**
  - `millpond land`, `run`, `tick` and `status --json`, with the seven
    steps, the raw bank, cursors and the write lock;
  - `millpond import` and `millpond capture folder|meeting`, from F3;
  - `millpond.toml` and the inbox's layout from the signals crate.
- **Done when:**
  - millpond passes the conformance pack;
  - a capture landed twice writes nothing the second time;
  - a refused line leaves the rest of the run landed;
  - a run that exits without `done` keeps its cursor where it was;
  - the status names each failed item.

### S1 The release adapter lands through millpond on trial

- **Where:** swancloud, `packages/release-signals`. Change:
  `release-signals-speak-the-contract`.
- **Does:** the adapter prints contract lines. Its 04:30 run lands
  them through crew as it does now, and also runs under `millpond run`
  into a trial inbox on mac-studio.
- **Done when:** a week of runs lands in the trial inbox exactly the
  keys crew landed, none twice.

## Phase 2: the tools

### H2 Scaffold headwater's repository

- **Where:** `agentplot/headwater`, new, on kit-standard's code
  profile. It follows sluice's seed commit.
- **Does:** writes:
  - `CLAUDE.md` pointing at the statement, a README, a license and
    `adrs.toml`;
  - the founding ADRs: a Rust binary with seams, plugins outside the
    core, a JSON contract, state in the git directory, and the pin
    decides what is new;
  - `docs/architecture/core.md` and `_open.md`;
  - `.config/kit.toml`, devenv, moon, sluice's gate, `cliff.toml`, and
    the OpenSpec configuration with its design line.
- **Done when:** sluice protects `main`, and the first change lands
  through it.

### H3 headwater's walkthrough and phase-1 brief

- **Where:** headwater.
- **Does:** worked examples of the statement's scenarios against fake
  lookups, and the brief for phase 1.
- **Done when:** every scenario has an example, and the brief names
  the clauses phase 1 proves.

### H4 headwater's core

- **Where:** headwater.
- **Does:**
  - the seams as traits, with fakes;
  - the store in the git directory;
  - `scan`, `notes`, `brief`, `ack` and `overview`, with JSON output;
  - a conformance suite whose cases cite clauses.
- **Done when:** the suite passes against the fakes, and at least one
  case cites every Part A clause.

### H5 headwater's lookups

- **Where:** headwater.
- **Does:**
  - each ecosystem's package manager, read-only in the repository's
    shell: npm, Go and mise by their own commands, and the configured
    registry's index for Python and Cargo;
  - deps.dev by Package URL in batches where no package manager runs;
  - GitHub GraphQL through the user's `gh` sign-in, ecosyste.ms, and
    OSV in batches;
  - the range each declaration gives, and the published package's diff
    for a brief.
- **Done when:**
  - recorded requests and recorded package-manager output replay in the
    suite (headwater 37);
  - a scan of swancloud's watch list matches today's release adapter
    release for release;
  - a package on a private registry is found through its package
    manager, and a release outside its declared range is marked so.

### H6 headwater's Flywheel plugin

- **Where:** headwater, `plugins/flywheel`.
- **Does:** `headwater capture` prints a capture for every release
  newer than its pin, built with the capture crate. The key, raw, excerpt and
  claims are as `design.md` sets them.
- **Done when:** its output passes the conformance pack, and
  `millpond run` lands it.

### H7 headwater's Claude Code and herdr plugins

- **Where:** headwater, `plugins/claude` and `plugins/herdr`.
- **Does:**
  - a skill and a command that read `overview` and `brief`;
  - a herdr sidebar of unread releases;
  - a fix key that hands the release's brief to flume as a fix, or
    hands the release to millpond in a repository crew runs;
  - where sounding is installed, a key that opens a sounding on a
    release that needs judgment, with its brief as an input.
- **Done when:** both plugins install from headwater's tag and show a
  real repository's releases.

### E1 eddy

- **Where:** `agentplot/eddy`, new, in Rust like headwater, on
  kit-standard's code profile.
- **Does:**
  - the code every part shares: the key, the meeting's details, the raw
    layout and skipping short meetings;
  - the `wispr` part: an MCP client with its own sign-in and a cursor,
    tested by replaying recorded responses;
  - `plugins/claude`, which pulls a transcript into a session, and
    `plugins/herdr`, which shows the day's meetings.

  It prints the contract with the capture crate and carries no excerpt.
  `webex` and `teams` parts follow when a partition needs them.
- **Done when:**
  - the conformance pack's meeting checks pass;
  - a listing of last week's meetings matches the service's own list;
  - no model runs during a listing.

### P4 millpond's tools and Claude Code plugin

- **Where:** millpond, `plugins/claude` and `millpond mcp`.
- **Does:** serves `signals`, `capture`, `read`, `moves`, `items` and
  `brief` over MCP, with the verbatim check on `read`, and ships the
  curate and read skills.
- **Done when:** in a session on a trial inbox of real captures, the
  curate skill proposes a batch of fifty, the operator changes a row,
  and one `moves` call writes the batch as changed; and a reader's
  excerpt that is not in the raw material is refused.

### P5 millpond's herdr plugin

- **Where:** millpond, `plugins/herdr`.
- **Does:** shows the count and age of unmoved signals by source, opens
  a proposed batch for review row by row, and sends an item with one
  key once P6 lands.
- **Done when:** the plugin installs from millpond's tag and its counts
  match `millpond status --json` on the trial inbox.

### L2 Scaffold flume's repository

- **Where:** `agentplot/flume`, new, in Rust on kit-standard's code
  profile. It follows sluice's seed commit.
- **Does:** writes:
  - `CLAUDE.md` pointing at the statement, a README, a license and
    `adrs.toml`;
  - the founding ADRs: one place, one agent per stage; a stage ends on
    its deliverable; plugins outside the core;
  - `docs/architecture/core.md` and `_open.md`;
  - the kit's devenv, moon, sluice gate, `cliff.toml` and OpenSpec
    configuration.
- **Done when:** sluice protects `main`, and the first change lands
  through it.

### L3 flume's core and Claude Code plugin

- **Where:** flume, its core and `plugins/claude`.
- **Does:**
  - `flume launch`, `status --json`, `tell`, `stop`, `retry`,
    `finish`, `done` and `tidy`, with places, the fix and change kinds,
    a repository's own and a launch's own;
  - prompt delivery checked against the agent's transcript, and stage
    ends read from deliverables, a change's from its OpenSpec files and
    a committed report from the branch;
  - flume's submission through sluice after a kind's last stage, and a
    failed submission's return to the stage the kind names;
  - the caller's word as a third way for a place's work to end;
  - a conversation stage with no stop check, the stop check for every
    other stage, and the guard that refuses an agent's own submission;
  - `/launch` and `status` over MCP.
- **Done when:**
  - a fix launched from a session lands through flume's own submission,
    with no agent submitting, and its place is tidied;
  - a submission that fails sends its place back to the stage its kind
    names;
  - a change runs construct, code and verify, and its status shows its
    tasks ticked;
  - a stage whose pane goes quiet with no deliverable is not ended;
  - tidying keeps a branch that holds commits its target lacks.

### L4 flume's herdr plugin

- **Where:** flume, `plugins/herdr`.
- **Does:** the sidebar of places in flight, with kind, stage, agent
  state and a change's tasks, and keys to open, tell, stop and retry.
- **Done when:** the plugin installs from flume's tag, and a fix and a
  change launched from herdr show each stage in the sidebar until they
  land.

### P6 Send an item through flume

- **Where:** millpond.
- **Does:** `send` names a repository and a kind, records the send,
  hands flume the brief, and writes the landing against the item from
  sluice's record of flume's submission. An inbox whose settings hand
  items to crew refuses a send.
- **Done when:** an item of two bumps sent from herdr lands through
  sluice, the item shows its landing, and a send from crew's inbox is
  refused.

### Q2 Scaffold sounding's repository

- **Where:** `agentplot/sounding`, new, in Rust on kit-standard's code
  profile. It follows sluice's seed commit.
- **Does:** writes:
  - `CLAUDE.md` pointing at the statement, a README, a license and
    `adrs.toml`;
  - the founding ADRs: an elaboration over a closed set of inputs,
    ended by the operator; places run through flume; plugins outside
    the core; a conclusion is never a signal;
  - `docs/architecture/core.md` and `_open.md`;
  - the kit's devenv, moon, sluice gate, `cliff.toml` and OpenSpec
    configuration.
- **Done when:** sluice protects `main`, and the first change lands
  through it.

### Q3 sounding's core and Claude Code plugin

- **Where:** sounding, its core and `plugins/claude`.
- **Does:**
  - `sounding open`, `list`, `conclude`, `offer`, `ask`, `accept`,
    `go-on`, `finish` and `drop`, over a closed set of inputs, with the record,
    `conclusion.md` and `rounds/`, and each round's place through
    flume;
  - a sounding based on earlier ones, carrying their records and their
    branches;
  - elaboration kinds, sounding's own and a repository's, with their
    three endings and what each lands;
  - `offer` prints contract lines with the capture crate and pipes them
    to `millpond land` where millpond is installed;
  - `/sound`, the start hook and the MCP tools.
- **Done when:**
  - a question opened with `/sound` in one session ends on a conclusion
    in another, and the first session's work goes on undisturbed;
  - a session that tries to stop with no conclusion is sent back;
  - a sounding based on two earlier ones lands a design writeback on
    `main` through flume, and its prototype code stays on its branch;
  - an offer's lines pass the conformance pack.

### Q4 sounding's herdr plugin

- **Where:** sounding, `plugins/herdr`.
- **Does:** the sidebar of open soundings with their rounds and states,
  a workspace per sounding, and keys to start, open, accept, send back
  and drop one and to open its conclusion in plannotator.
- **Done when:** the plugin installs from sounding's tag, and a
  sounding started, sent back once and accepted from herdr shows each
  state in the sidebar.

## Phase 3: crew and swancloud on millpond

### C2 crew calls millpond

- **Where:** crew. Change: `crew-calls-millpond`.
- **Does:**
  - each partition's flywheel branch becomes an inbox, its folders
    imported once with `millpond import`;
  - `crew signal` writes through `millpond land`, and the board, the
    page and the planner read signals through millpond's command line;
  - swancloud's deployer pipes its failures to `millpond land`.
- **Done when:**
  - importing a partition's branch twice writes nothing the second
    time;
  - crew's page shows the same signals before and after the import;
  - no crew code writes a signal file itself.

### S2 Generate swancloud's watch list

- **Where:** swancloud.
- **Does:** generates headwater's watch list from
  `lib/release-sources.nix` (name, upstream, tag pattern, pin, claims)
  and commits it. A flake check refuses it when it drifts from the
  evaluation.
- **Done when:** the check fails on a hand edit and passes after
  regeneration.

### S3 The list of parts, their ticks and doctor rows

- **Where:** swancloud. Change: `parts-run-from-one-list`.
- **Does:** one list in `lib/` names each part, its partition's inbox,
  host and schedule, and generates each inbox's `millpond.toml`. A
  launchd agent per inbox on its host runs `millpond tick`, and the
  doctor shows a row per part from `millpond status --json`. The
  release adapter moves from its trial inbox into the partition's.
- **Done when:**
  - the release adapter runs from the list into the partition's inbox;
  - its row reads ok;
  - a deliberately failed run turns the row red, naming the item.

### S4 Cut swancloud's releases over to headwater

- **Where:** swancloud. Change: `releases-come-from-headwater`.
- **Does:**
  - packages headwater;
  - points the release entry of S3's list at `headwater capture`;
  - amends `inputs.6` and ADR 0020;
  - deletes `packages/release-signals`;
  - carries the handover to the next host in its open change.
- **Done when:**
  - a week of runs lands no key twice;
  - the doctor row stays ok;
  - nothing names the old adapter.

### C3 crew's reader

- **Where:** crew. Change: `daily-pass-through-crew`, rewritten.
- **Does:** crew charges a reader session over a partition's unread
  captures, oldest first, on a cadence and on the operator's word. The
  reader writes signals with millpond's `read` tool. Its instructions
  are the inbox's data.
- **Done when:** a week of meetings becomes signals with a verified
  excerpt each, and no capture is read twice.

### S5 Run eddy and the folder drop

- **Where:** swancloud.
- **Does:** adds the `wispr` part and a folder drop to S3's list for
  the partition that uses them, on its host, plus the user's sign-in
  step.
- **Done when:**
  - a day's meetings land as unread captures;
  - the doctor row reads ok;
  - the row warns when the sign-in nears its end.

### E2 Retire the old meeting pipeline

- **Where:** the instance repository that runs it.
- **Does:** imports the meeting corpus once into the partition's inbox
  with `millpond import`, then removes the old sweep and its scheduled
  job once S5 and C3 have run for a week.
- **Done when:** no scheduled job runs the old sweep, and a capture of
  the old corpus is found in the inbox by its key.

## Phase 4: curation to work

### C4 crew's curator moves through millpond

- **Where:** crew. Change: `curation-and-agenda`, already open.
- **Does:** a curator on a cadence works a partition's inbox through
  millpond's tools, joining signals into items, and the operator
  decides each item on crew's rail. The planner turns an accepted item
  into a chore or a unit.
- **Done when:** a batch of release and meeting signals is curated in
  one delivery, every signal has one move, and each item reaches the
  plan.

### C5 A release reaches a landed bump

- **Where:** crew and swancloud.
- **Does:** proves the whole path on one real release. The capture
  lands, curation routes it into an item, and the planner proposes the
  chore, which the operator accepts. A team bumps the tool with
  `headwater brief` in hand, and sluice lands it.
- **Done when:** the next scan no longer reports that release, because
  the pin moved, with no acknowledgement written.

### Q5 millpond sends a question to a sounding

- **Where:** millpond.
- **Does:** `send` takes a sounding as its target, with one item or
  several. millpond opens the sounding with the items' signals and
  captures as its inputs, keeps the accepted conclusion as each item's
  record, and makes an item of each piece of work the conclusion
  proposes.
- **Done when:**
  - an item asking whether to take a major release goes to a sounding,
    and its accepted conclusion shows on the item;
  - the bump the conclusion proposes arrives as a new item;
  - curation answers the release's next signal by naming the
    conclusion.

### C6 crew calls sounding

- **Where:** crew. Change: `crew-calls-sounding`.
- **Does:** crew's planner and design agent open a sounding for an
  item that asks a question, show each conclusion on crew's rail, and
  turn the work an accepted one proposes into plan entries.
- **Done when:** one real question goes from an item through a
  sounding to accepted plan entries on crew's rail, with no
  `<kit>/elaborations/` worktree made.

### C7 crew calls flume

- **Where:** crew. Change: `crew-calls-flume`.
- **Does:** crew starts each stage's agent in a place through flume and
  reads stage ends from `flume status`, keeping its plans, bolts,
  slots, dispatcher, conductors and approvals.
- **Done when:** a bolt of one unit and one chore lands with every
  place and stage started through flume, and no crew code makes a
  worktree itself.

## Phase 5: Flywheel hosts

### F4 Flywheel's host on the same crates

- **Where:** flywheel-next.
- **Does:**
  - runs plugin adapter parts on the tick;
  - takes `flywheel capture land`;
  - reads and writes an inbox millpond wrote, with no import.
- **Done when:** Flywheel passes the conformance pack, and headwater's
  and eddy's parts run on a Flywheel host unchanged against an inbox
  millpond kept.

### F5 crew becomes Flywheel

- **Where:** crew's and Flywheel's roadmaps.
- **Does:** the host changes and the adapters and inboxes do not.
  Flywheel takes each partition's inbox as it stands.
- **Done when:** both roadmaps say so.
