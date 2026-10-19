# Capture: the plan

The order of work for `design.md`. Each phase ends with something
running on real work before the next phase depends on it. Steps that
share no dependency run side by side: once millpond's core exists,
headwater, eddy, millpond's plugins and crew's move onto millpond all
proceed at once. sounding needs nothing of millpond's until millpond
sends it questions (Q5), and flume needs crew's rules to extract from
and the shared crates' kind format (F4).

Each step is done in its repository's own process:

- a statement or amendment in this repository;
- an OpenSpec change in crew, swancloud or the family's shared crates'
  repository;
- millpond's, headwater's, eddy's, sounding's and flume's
  repositories, each scaffolded from kit-standard with its site;
- Flywheel's own steps in its own repository.

A step's change name is suggested where one helps. **Done when** names
a check or an observation, never a list to tick by hand.

## Where it stands

| Step | What | Needs | Status |
|---|---|---|---|
| D1 | Rule headwater's 33 questions | none | ruled |
| D2 | Rule this design's decisions | none | ruled |
| D3 | Decide the old meeting sweep's fate | none | waiting on the operator |
| D4 | Rule the family's storage | none | ruled |
| P1 | Write millpond's statement | none | written and ruled; rulings to fold in |
| E0 | Write eddy's statement | none | written and ruled; rulings to fold in |
| Q1 | Write sounding's statement | none | written and ruled; rulings to fold in |
| L1 | Write flume's statement | none | written and ruled; rulings to fold in |
| H1 | Amend headwater's statement | D1, D2 | rulings to fold in |
| F0 | Name and create the shared crates' repository | none | waiting on the operator |
| F1 | Write the shared crates' statement | F0, D2, D4 | to do |
| C1 | Amend crew's record | D2, D4 | to do |
| F2 | The capture and signals crates, and the conformance pack | F1 | to do |
| F3 | The adapters crate | F2 | to do |
| F4 | The shared-branch and kinds crates | F1 | to do |
| P2 | millpond's founding ADRs, rules and gate | P1 | scaffolded with its site |
| P3 | millpond's core | P2, F2, F3, F4 | to do |
| S1 | The release adapter lands through millpond on trial | P3 | to do |
| H2 | headwater's founding ADRs, rules and gate | H1 | scaffolded with its site |
| H3 | headwater's walkthrough and phase-1 brief | H2 | to do |
| H4 | headwater's core | H3 | to do |
| H5 | headwater's lookups | H4 | to do |
| H6 | headwater's Flywheel plugin | H4, F2 | to do |
| H7 | headwater's Claude Code and herdr plugins | H4, L3 | to do |
| E1 | eddy | E0, F2 | scaffolded with its site |
| P4 | millpond's tools and Claude Code plugin | P3 | to do |
| P5 | millpond's herdr plugin | P3 | to do |
| L2 | flume's founding ADRs, rules and gate | L1 | scaffolded with its site |
| L3 | flume's core and Claude Code plugin | L2, F4 | to do |
| L4 | flume's herdr plugin | L3 | to do |
| P6 | Send an item through flume | P4, L3 | to do |
| Q2 | sounding's founding ADRs, rules and gate | Q1 | scaffolded with its site |
| Q3 | sounding's core and Claude Code plugin | Q2, L3, F2 | to do |
| Q4 | sounding's herdr plugin | Q3, L4 | to do |
| C2 | crew calls millpond | C1, P3 | to do |
| S2 | Generate swancloud's watch list | H1 | to do |
| S3 | The list of adapters, their ticks and doctor rows | C2 | to do |
| S4 | Cut swancloud's releases over to headwater | S1, S2, S3, H5, H6 | to do |
| C3 | crew's reader | C2, P4 | to do |
| S5 | Run eddy and the folder drop | E1, S3 | to do |
| E2 | Retire the old meeting pipeline | S5, C3 | to do |
| C4 | crew's curator moves through millpond | C2, P4 | to do |
| C5 | A release reaches a landed bump | C4, S4 | to do |
| Q5 | millpond sends a question to a sounding | P6, Q3 | to do |
| C6 | crew calls sounding | C1, C4, Q3 | to do |
| C7 | crew calls flume | C1, L3 | to do |
| F5 | Flywheel's host on the same crates | F2, F3, F4 | to do |
| F6 | crew becomes Flywheel | F5, C2 | crew's roadmap |

## Phase 0: rule and write down

### D1 Rule headwater's 33 questions

- **Where:** this repository, `design/headwater/`.
- **Does:** the operator rules each of the reconstruction's 32
  questions, the 33rd, "lookup" for each service headwater asks, and
  headwater's own seven open points. Each is taken as recommended on
  `models/rulings.html`: groups A to D, questions 1 to 33, and §1 to
  §7.
- **Done when:** the rulings page is committed beside the model.

### D2 Rule this design's decisions

The operator's rulings:

1. headwater is for dependencies and eddy for meetings. The work every
   source shares is millpond's, through the contract.
2. millpond is a standalone tool, the inbox. It runs adapters, keeps
   captures and signals, serves the tools curation works through, and
   sends an item to a worktree. crew calls its command line as it calls
   sluice's.
3. The capture contract, the record formats, the shared-branch write
   protocol and the kind format are defined and implemented once, in
   shared crates in a public repository of the family's own. millpond
   and the other open tools build on them, and Flywheel builds on the
   same crates later.
4. An inbox is an `inbox/` tree on a branch of a git repository, in the
   shared crates' formats. crew's partition branches carry inboxes,
   crew's folders and the meeting corpus are imported once, and
   Flywheel reads the same inboxes with no import.
5. The unit of work is an item, the signals curation joined, one or
   many. millpond sends one item to one worktree. Planning across items
   is crew's planner today and Flywheel's later.
6. A Claude session works a backlog through millpond's tools,
   proposing moves in batches the operator accepts or changes. The
   herdr plugin shows the inbox and gives shortcuts for actions; Claude
   does the curating.
7. A program lists meetings and a session reads them. eddy holds an
   adapter per meeting service, its Wispr adapter an MCP client that
   starts no Claude session. Others publish meeting plugins of their
   own.
8. An adapter whose source needs no other tool ships inside millpond.
   One that wraps another tool's domain ships with that tool, so
   headwater's and eddy's adapters stay theirs.
9. "Plugin" replaces Flywheel's "package" and "bundle".
10. The release adapter lands through millpond on trial (S1) before
    headwater exists, so the contract carries live captures first.
11. sounding is a standalone tool that runs elaborations over a closed
    set of inputs its opener names. Each works in rounds, in places
    flume runs, and ends on a conclusion the operator accepts, sends
    back or drops. Its elaboration kinds say how a round ends and what
    lands, and flume submits what lands straight onto the target.
    millpond sends it one or more items, the accepted conclusion is
    each item's record, and only a finding beyond its inputs comes back
    as a capture.
12. flume is a standalone tool that launches and tracks one agent per
    stage in one worktree through a kind's stages on the host it runs
    on, taken from crew's places and stages. It submits the work of a
    kind that lands through its merge-queue seam, and no session
    submits. millpond's send, headwater's fix key, sounding and crew
    call it; millpond keeps the item's record, sounding the
    elaboration's, and flume the live state of each place.

- **Done when:** `design.md` and the statements say what was ruled.

### D3 Decide the old meeting sweep's fate

- **Where:** the instance repository that runs it.
- **Does:** the operator stops or repairs the existing daily sweep
  while eddy is built.
- **Done when:** the sweep either runs green or is unloaded.

### D4 Rule the family's storage

- **Where:** each statement's Part C profiles, and `design.md`'s
  "Where state lives".
- **Does:** the operator rules one storage convention, which binds the
  open tools and crew:
  - five layers, and each piece of state in the lowest that holds
    every reader it has;
  - host state by kind, with only data backed up;
  - a tool's records about one repository kept with it, under
    `refs/<tool>/` on its own remote when hosts share them;
  - one protocol for every shared branch, and recutils at rest there;
  - declarations in `.config/<tool>.toml`;
  - cursors and raw material kept on their hosts;
  - crew's plan imported once at F6, the one data move on the path.
- **Done when:** each statement's Part C names the profile the
  convention sets:
  - millpond's inbox under `inbox/` on a shared branch;
  - eddy's sign-ins in its host state;
  - sounding's record off the branch that lands;
  - flume's live state in `$XDG_STATE_HOME/flume/`, with every
    deliverable committed;
  - headwater's held state per clone;
  - sluice's shared records spelled `refs/sluice/state/<branch>`.

### P1 Write millpond's statement

- **Where:** this repository, `design/millpond/`.
- **Does:** writes millpond's statement from `design.md`, as
  headwater's was written. It covers the inbox, the contract's intake,
  the seven steps, the reader and curation tools, moves, items and
  sends, the three setups, and what millpond never does. A fresh model
  then
  reconstructs millpond from the statement alone, and the operator
  rules the questions it asks. The fold carries:
  - its 15 decisions;
  - the blocking questions with the model's defaults, question 3 by
    D4's shared-branch protocol, with millpond writing through a bare
    cache and no checkout;
  - the 25 defaultable questions' defaults;
  - the three internal conflicts, fixed as accepting implies;
  - "adapter" throughout, the shared crates as the contract's home, and
    D4's storage profile in Part C.
- **Done when:** the reconstruction's questions are ruled and folded
  into the statement, Vale is clean, and the operator agrees to land it
  on `main`.

### E0 Write eddy's statement

- **Where:** this repository, `design/eddy/`.
- **Does:** writes eddy's statement from `design.md` and eddy's book:
  listing and fetching recorded meetings across services, keys, raw
  transcripts, cursors and sign-ins, an adapter per service, its
  plugins, and what eddy never does. A fresh model reconstructs eddy
  from the statement alone, and the operator rules the questions it
  asks. The fold carries:
  - its 18 decisions;
  - the five blocking questions as ruled:
    - the service's own change mark where it has one, else a look-back
      window per adapter;
    - a `give_up_after` per adapter;
    - eddy's own sign-in store authoritative for a service that renews
      and voids a sign-in on use;
    - the transcript id folded into the key for Teams and Webex;
    - the tenant or account folded into the id, per service;
  - the 25 defaultable questions' defaults;
  - the two internal conflicts, fixed as accepting implies;
  - "adapter" throughout, and D4's storage profile in Part C.
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
  operator rules the questions it asks. The fold carries:
  - no timebox; the kind deciding what lands, through flume; the
    conversation as a round's third ending;
  - its decisions on names, parking and `resume`, offers, notes,
    plannotator's notes, surfaces, work from a conclusion and words;
  - its record off the branch that lands: in
    `<common>/sounding/<name>/`, and under `refs/sounding/<name>` on the
    repository's own remote when hosts share it;
  - a round's report at `{{state}}/conclusion.md` in the place's flume
    state folder, copied into the record when sounding settles the
    round;
  - an elaboration kind as a kind in the shared format with an
    elaboration section;
  - flume running and settling each round and reporting its liveness,
    and no clock of sounding's own;
  - `[bindings]` in the operator's configuration with a per-repository
    override, asks closed at a conclusion or a note, a round's session
    refused accept, go on and drop, and the offer key carrying the
    repository;
  - the defaultable questions' defaults, those about a timebox dropped;
  - only flume driving herdr, and sounding's herdr plugin only
    displaying.
- **Done when:** the reconstruction's questions are ruled and folded
  into the statement, Vale is clean, and the operator agrees to land it
  on `main`.

### L1 Write flume's statement

- **Where:** this repository, `design/flume/`.
- **Does:** writes flume's statement from `design.md` and crew's
  `teams` and `plan` rules it takes over: a launch, places, kinds and
  stages, prompt delivery, stage ends, submission, status, tidying, and
  what flume never does. A fresh model reconstructs flume from the
  statement alone, and the operator rules the questions it asks. The
  fold carries:
  - its decisions:
    - flume submits, and a failed submission returns to the kind's
      named stage;
    - the caller's ending, and a conversation stage;
    - a committed report, and a `{{state}}` report only where the
      caller keeps it lasting;
    - the shared kind format;
  - what moves stages on: flume's Claude Code plugin in every agent it
    starts, its herdr plugin catching what a hook cannot, herdr
    required for unattended use, and no daemon;
  - questions 2 to 4 and the 25 defaultable ones with the model's
    defaults;
  - the `[profiles]` table in `.config/flume.toml`, and each outside
    tool's commands checked and written into Part C as its profile is
    built;
  - "profile" for a seam's implementation, and the verify report
    committed in the change's directory.
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
    gives, which the dependency description carries;
  - each ecosystem's package manager, run read-only in the repository's
    shell, is a lookup, with deps.dev where none runs;
  - a brief names the ecosystem's own command for the move, amending
    27, and can carry the published package's diff between the pin and
    the release;
  - a repository is one clone, its held state per clone, which a
    curation drop never writes.

  New clauses take the next free numbers from 53.
- **Done when:** Vale is clean, and the operator agrees to land it on
  `main`.

### F0 Name and create the shared crates' repository

- **Where:** a new public repository of the family's own,
  `agentplot/<name>`.
- **Does:** the operator chooses the shared crates' name and says yes
  to a new public repository. It is scaffolded in Rust from
  kit-standard's code profile, following sluice's seed commit. Its
  founding ADRs define each format and protocol once, make every crate
  public, and give the crates no state and no host of their own. It
  gains `docs/architecture/core.md` and `_open.md`.
- **Done when:** the repository exists under the chosen name, sluice
  protects `main`, and the first change lands through it.

### F1 Write the shared crates' statement

- **Where:** this repository, `design/<name>/`, as that repository's
  own statement, the way each tool's statement is written here.
- **Does:** writes, as clauses with scenarios:
  - the capture contract: the lines, and how an adapter is declared
    and run;
  - a capture that is its own excerpt, raw banking behind a pointer of
    the form `<host>:<path>`, and an import that keeps each capture's
    key;
  - the record formats of captures, signals, moves and items, the item
    holding a proposed intent's brief and sends, and the inbox's layout
    under `inbox/`;
  - the shared-branch write protocol;
  - the kind format: stages in order, `agents`, `on_fail`,
    `max_send_backs` and `deliverables`, a version per kind, and the
    elaboration section of an elaboration kind;
  - cadence, and the conformance pack.

  A fresh model reconstructs the crates from the statement alone, and
  the operator rules the questions it asks.
- **Done when:** the reconstruction gives the contract's lines, the
  seven steps, the protocol and the kind format with no question this
  design leaves open. Vale is clean, and the operator agrees to land
  the statement on `main`.

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
    `12`, `17` to name flume (C7);
  - adds an ADR, "the family's storage convention binds crew", and
    amends `state.1` to name the shared-branch protocol, of which crew
    keeps a Python twin (`code.1`).
- **Done when:** the record lands through sluice, and `_open.md` no
  longer asks where meeting signals live.

## Phase 1: the shared crates and millpond's core

### F2 The capture and signals crates, and the conformance pack

- **Where:** the shared crates' repository. Change:
  `the-capture-contract`.
- **Does:**
  - the capture crate: the contract's types and key rules, an
    adapter's declaration, JSON in flight, recutils at rest, a sha256
    content hash and the excerpt cut;
  - the signals crate: the signal, move and item records and the
    inbox's layout, which this step fixes;
  - cadence: five-field cron, caught up once;
  - a conformance pack of contract lines and the records a host must
    write from them, with the meeting checks a meeting adapter passes.
- **Done when:** the crates' own tests pass the pack, and millpond,
  headwater, eddy and sounding can depend on the crates at a tag.

### F3 The adapters crate

- **Where:** the shared crates' repository, in F2's change or the next.
- **Does:** the folder drop, the meeting file and the signals-folder
  import, in a crate whose adapters print contract lines. The folder
  key takes the capture crate's sha256, and the import keys each
  capture by its own key and copies no raw material.
- **Done when:** each adapter's output passes the pack, and importing
  one folder twice writes nothing the second time.

### F4 The shared-branch and kinds crates

- **Where:** the shared crates' repository.
- **Does:**
  - the shared-branch write protocol: a bare cache, the write applied
    and checked, one commit through a temporary index, and a push
    without force. A refused push has the write applied again to the
    new tip, a bounded number of times;
  - the kind format, read and checked: stages in order, their fields,
    a version per kind, and an elaboration kind's section.
- **Done when:**
  - two writes pushed to one branch at once both land, the second
    applied again on the first's tip;
  - of two moves for one signal, the second is refused;
  - a branch with no remote takes the same write;
  - flume's fix and change kinds read from their declarations.

### P2 millpond's founding ADRs, rules and gate

- **Where:** `agentplot/millpond`, scaffolded from kit-standard's code
  profile with its site, in Rust.
- **Does:** writes the founding ADRs (built on the family's shared
  crates, plugins outside the core, the inbox in the shared crates'
  formats on a shared branch), `docs/architecture/core.md` and
  `_open.md`, and puts `main` under sluice's gate.
- **Done when:** sluice protects `main`, and the first change lands
  through it.

### P3 millpond's core

- **Where:** millpond.
- **Does:**
  - `millpond land`, `run`, `tick` and `status --json`, with the seven
    steps;
  - the inbox written by the shared-branch protocol through a bare
    cache, with no checkout, and a lock for one host's writers;
  - the raw bank in `$XDG_DATA_HOME/millpond/`, and cursors and run
    status in `$XDG_STATE_HOME/millpond/`;
  - `millpond import` and `millpond capture folder|meeting`, from F3;
  - `.config/millpond.toml` and the inbox's layout from the signals
    crate.
- **Done when:**
  - millpond passes the conformance pack;
  - a capture landed twice writes nothing the second time;
  - a refused line leaves the rest of the run landed;
  - a run that exits without `done` keeps its cursor where it was;
  - two hosts writing one inbox at once both land;
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

### H2 headwater's founding ADRs, rules and gate

- **Where:** `agentplot/headwater`, scaffolded from kit-standard's code
  profile with its site.
- **Does:** writes:
  - `adrs.toml`, and the founding ADRs:
    - a Rust binary with seams;
    - plugins outside the core;
    - a JSON contract;
    - state in the clone's common git directory, a repository being one
      clone;
    - the pin decides what is new;
  - `docs/architecture/core.md` and `_open.md`;
  - sluice's gate on `main`, and the OpenSpec configuration with its
    design line.
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
  - the store in the clone's common git directory;
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
  newer than its pin, built with the shared capture crate. The key,
  raw, excerpt and claims are as `design.md` sets them.
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

- **Where:** `agentplot/eddy`, scaffolded from kit-standard's code
  profile with its site, in Rust like headwater.
- **Does:**
  - the founding ADRs, `docs/architecture/core.md`, `_open.md` and
    sluice's gate on `main`, first;
  - the code every adapter shares: the key, the meeting's details, the
    raw layout and skipping short meetings;
  - the `wispr` adapter: an MCP client with its own sign-in and a
    cursor, its look-back window and `give_up_after`, tested by
    replaying recorded responses;
  - `plugins/claude`, which pulls a transcript into a session, and
    `plugins/herdr`, which shows the day's meetings.

  It prints the contract with the shared capture crate and carries no
  excerpt. `webex` and `teams` adapters follow when a partition needs
  them.
- **Done when:**
  - the conformance pack's meeting checks pass;
  - a listing of last week's meetings matches the service's own list;
  - a meeting that never becomes ready is named failed once more after
    its `give_up_after`, and the cursor moves past it;
  - no model runs during a listing.

### P4 millpond's tools and Claude Code plugin

- **Where:** millpond, `plugins/claude` and `millpond mcp`.
- **Does:** serves `signals`, `capture`, `read`, `moves`, `items` and
  `brief` over MCP, with the verbatim check on `read` and a proposed
  batch kept until the operator accepts it, and ships the curate and
  read skills.
- **Done when:**
  - in a session on a trial inbox of real captures, the curate skill
    proposes a batch of fifty, the operator changes a row, and the
    batch is written as changed in one commit;
  - a reader's excerpt that is not in the raw material is refused.

### P5 millpond's herdr plugin

- **Where:** millpond, `plugins/herdr`.
- **Does:** shows the inbox: the count and age of unmoved signals by
  source, a proposed batch, and items with their sends. Its keys are
  shortcuts for actions, sending an item among them once P6 lands.
  Claude does the curating.
- **Done when:** the plugin installs from millpond's tag and its counts
  match `millpond status --json` on the trial inbox.

### L2 flume's founding ADRs, rules and gate

- **Where:** `agentplot/flume`, scaffolded from kit-standard's code
  profile with its site, in Rust.
- **Does:** writes:
  - the founding ADRs:
    - one place, one agent per stage;
    - a stage ends on its deliverable;
    - flume submits, and no agent does;
    - hooks and herdr's plugin settle places, with no daemon;
    - kinds in the family's kind format;
    - plugins outside the core;
  - `docs/architecture/core.md` and `_open.md`;
  - sluice's gate on `main`.
- **Done when:** sluice protects `main`, and the first change lands
  through it.

### L3 flume's core and Claude Code plugin

- **Where:** flume, its core and `plugins/claude`.
- **Does:**
  - `flume launch`, `status --json`, `tell`, `stop`, `retry`,
    `finish`, `done` and `tidy`, with places, the fix and change kinds,
    a repository's own and a launch's own, all in the kind format;
  - the `[profiles]` table read from `.config/flume.toml` at the base
    revision, with flume's defaults where it is absent;
  - prompt delivery checked against the agent's transcript;
  - stage ends read from deliverables: a change's from its OpenSpec
    files, a committed report from the branch, and a `{{state}}` report
    from the place's flume state folder;
  - flume's Claude Code plugin loaded into every agent it starts, whose
    stop hook settles the place when the agent goes quiet;
  - flume's submission through sluice after a kind's last stage,
    waiting on sluice's verdict, and a failed submission's return to
    the stage the kind names;
  - the caller's word as a third way for a place's work to end;
  - a conversation stage with no stop check, the stop check for every
    other stage, and the guard that refuses an agent's own submission;
  - each outside tool's commands and fields checked against the real
    tool and written into Part C as its profile is built;
  - `/launch` and `status` over MCP.
- **Done when:**
  - a fix launched from a session lands through flume's own submission,
    with no agent running `wt submit`, and its place is tidied;
  - a submission that fails sends its place back to the stage its kind
    names;
  - a change runs construct, code and verify, its verify report
    committed in the change's directory, and its status shows its tasks
    ticked;
  - a stage whose pane goes quiet with no deliverable is not ended;
  - tidying keeps a branch that holds commits its target lacks.

### L4 flume's herdr plugin

- **Where:** flume, `plugins/herdr`.
- **Does:**
  - the sidebar of places in flight, with kind, stage, agent state and
    a change's tasks, and keys to open, tell, stop and retry;
  - on herdr's always-running server, catching what a hook cannot: a
    crashed, hung or killed agent, a prompt never received, an agent
    stuck working.
- **Done when:**
  - the plugin installs from flume's tag, and a fix and a change
    launched from herdr show each stage in the sidebar until they land;
  - a fix runs from its launch to its landing with no flume command run
    after the launch;
  - an agent killed in the middle of a stage is reported.

### P6 Send an item through flume

- **Where:** millpond.
- **Does:** `send` names a repository and a kind, records the send,
  hands flume the brief, and writes the landing against the item from
  sluice's record of flume's submission. An inbox whose settings hand
  items to crew refuses a send, and crew's planner takes an item with
  `millpond hand`, which millpond records as its send.
- **Done when:** an item of two bumps sent from herdr lands through
  sluice, the item shows its landing, a send from crew's inbox is
  refused, and a hand given twice records one send.

### Q2 sounding's founding ADRs, rules and gate

- **Where:** `agentplot/sounding`, scaffolded from kit-standard's code
  profile with its site, in Rust.
- **Does:** writes:
  - the founding ADRs: an elaboration over a closed set of inputs,
    ended by the operator; places run through flume; plugins outside
    the core; a conclusion is never a signal;
  - `docs/architecture/core.md` and `_open.md`;
  - sluice's gate on `main`.
- **Done when:** sluice protects `main`, and the first change lands
  through it.

### Q3 sounding's core and Claude Code plugin

- **Where:** sounding, its core and `plugins/claude`.
- **Does:**
  - `sounding open`, `list`, `conclude`, `note`, `offer`, `ask`,
    `accept`, `go-on`, `finish`, `drop`, `resume` and `review`, over a
    closed set of inputs, with each round's place through flume;
  - `review`, which opens the conclusion in plannotator-tui, its notes
    counting only as part of a go on;
  - the record, kept off the branch that lands: in
    `<common>/sounding/<name>/`, and under `refs/sounding/<name>` on the
    repository's own remote when hosts share it;
  - a sounding based on earlier ones, carrying their records and their
    branches;
  - elaboration kinds, sounding's own and a repository's, read from
    their elaboration section, with their three endings and what each
    lands;
  - each round's conclusion written to `{{state}}/conclusion.md`, and
    copied into the record when sounding settles the round;
  - liveness read from flume's status, and offers handed again and
    cards read whenever a sounding command runs;
  - `offer` prints contract lines with the shared capture crate, under
    the key `sounding/<repository>/<name>/<n>`, and pipes them to
    `millpond land` where millpond is installed;
  - `/sound`, the start hook and the MCP tools, which a round's own
    session cannot use to accept, go on or drop.
- **Done when:**
  - a question opened with `/sound` in one session ends on a conclusion
    in another, and the first session's work goes on undisturbed;
  - a session that tries to stop with no conclusion is sent back;
  - a sounding based on two earlier ones lands a design writeback on
    `main` through flume, its prototype code does not land, and nothing
    of its record is on the branch that landed;
  - an offer's lines pass the conformance pack.

### Q4 sounding's herdr plugin

- **Where:** sounding, `plugins/herdr`.
- **Does:** rows in flume's sidebar for open soundings with their
  rounds and states, refreshed with sounding's offers handed again and
  its cards read. Its keys pass the operator's responses, accept, go
  on, finish, drop and resume, to sounding's core, and one key runs
  `sounding review`. plannotator opens its own pane, and the plugin
  starts no agent and sends nothing to a session.
- **Done when:** the plugin installs from sounding's tag, and a
  sounding started, sent back once and accepted from herdr shows each
  state in the sidebar.

## Phase 3: crew and swancloud on millpond

### C2 crew calls millpond

- **Where:** crew. Change: `crew-calls-millpond`.
- **Does:**
  - each partition's flywheel branch carries an inbox under `inbox/`,
    its folders and `moves.rec` imported once with `millpond import`;
  - `crew signal` writes through `millpond land`, and new captures bank
    their raw material in millpond's bank;
  - the board, the page and the planner read signals through
    millpond's command line;
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

### S3 The list of adapters, their ticks and doctor rows

- **Where:** swancloud. Change: `adapters-run-from-one-list`.
- **Does:** one list in `lib/` names each adapter, its partition's
  inbox, host and schedule, and generates each inbox's
  `.config/millpond.toml`. A launchd agent per inbox on its host runs
  `millpond tick`, and the doctor shows a row per adapter from
  `millpond status --json`. The release adapter moves from its trial
  inbox into the partition's.
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
  captures, oldest first, on a cadence and on the operator's word, on
  the host that banked their raw material. The reader writes signals
  with millpond's `read` tool. Its instructions are the inbox's data.
- **Done when:** a week of meetings becomes signals with a verified
  excerpt each, and no capture is read twice.

### S5 Run eddy and the folder drop

- **Where:** swancloud.
- **Does:** adds the `wispr` adapter and a folder drop to S3's list for
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
  decides each item on crew's rail. The planner takes an accepted item
  with `millpond hand` and turns it into a chore or a unit.
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
  slots, dispatcher, conductors and approvals. A team's place and stage
  state becomes flume's.
- **Done when:** a bolt of one unit and one chore lands with every
  place and stage started through flume, and no crew code makes a
  worktree itself.

## Phase 5: Flywheel hosts

### F5 Flywheel's host on the same crates

- **Where:** Flywheel's own repository.
- **Does:** Flywheel's host builds on the shared crates:
  - runs plugin adapters on the tick;
  - takes `flywheel capture land`;
  - reads and writes an inbox millpond wrote, with no import;
  - reads the kinds a repository declares for flume.
- **Done when:** Flywheel passes the conformance pack, and headwater's
  and eddy's adapters run on a Flywheel host unchanged against an inbox
  millpond kept.

### F6 crew becomes Flywheel

- **Where:** crew's and Flywheel's roadmaps.
- **Does:** the host changes and the adapters and inboxes do not.
  Flywheel takes each partition's inbox as it stands, and imports
  crew's plan and proposals once, keeping every id. That import is the
  one data move on the path.
- **Done when:** both roadmaps say so.
