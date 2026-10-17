# Capture: the plan

The order of work for `design.md`. Each phase ends with something
running on real work before the next phase depends on it. Steps that
share no dependency run side by side: once phase 0 is done, crew's
contract, headwater's core and eddy can all move at once.

Each step is done in its repository's own process:

- a statement amendment in this repository;
- an OpenSpec change in crew, flywheel-next or swancloud;
- headwater's repository, scaffolded from kit-standard.

A step's change name is suggested where one helps. **Done when** names
a check or an observation, never a list to tick by hand.

## Where it stands

| Step | What | Needs | Status |
|---|---|---|---|
| D1 | Rule headwater's 33 questions | none | waiting on the operator |
| D2 | Rule this design's decisions | none | waiting on the operator |
| D3 | Decide the old meeting sweep's fate | none | waiting on the operator |
| H1 | Amend headwater's statement | D1, D2 | to do |
| F1 | Write the contract into Flywheel's statement | D2 | to do |
| C1 | Amend crew's record | D2 | to do |
| F2 | Build the contract crate and its conformance pack | F1 | to do |
| F6 | Flywheel's built-in adapters print the contract | F2 | to do |
| C2 | `crew capture land` | F1, F2's pack | to do |
| C3 | `crew capture run` and run status | C2 | to do |
| S1 | Move the release adapter onto the contract | C2 | to do |
| H2 | Scaffold headwater's repository | H1 | to do |
| H3 | headwater's walkthrough and phase-1 brief | H2 | to do |
| H4 | headwater's core | H3 | to do |
| H5 | headwater's lookups | H4 | to do |
| H6 | headwater's Flywheel plugin | H4, F2 | to do |
| H7 | headwater's Claude Code and herdr plugins | H4 | to do |
| S2 | Generate swancloud's watch list | H1 | to do |
| S3 | The list of adapters, their runs and doctor rows | C3 | to do |
| S4 | Cut swancloud's releases over to headwater | S1, S2, S3, H5, H6 | to do |
| M1 | eddy | F2 | to do |
| C4 | crew's reader | C2 | to do |
| S5 | Run eddy and the folder drop | M1, F6, S3 | to do |
| M2 | Retire the old meeting pipeline | S5, C4 | to do |
| C5 | Curation into plan items | C1 | to do |
| C6 | A release reaches a landed bump | C5, S4 | to do |
| F3 | Flywheel's host side of the contract | F2 | to do |
| F4 | Flywheel's import keeps keys | F1 | to do |
| F5 | crew becomes Flywheel | F3, F4 | crew's roadmap |

## Phase 0: rule and write down

### D1 Rule headwater's 33 questions

- **Where:** this repository, `design/headwater/`.
- **Does:** the operator rules each of the reconstruction's 32
  questions, plus the 33rd, "lookup" for what the statement calls a
  source. The rulings go into `models/reconstruction-1-answers.md`.
- **Done when:** the answers file is committed beside the model.

### D2 Rule this design's decisions

The operator accepts or changes each of these:

1. headwater is a tool for dependencies. The host does the work every
   source shares, through the contract.
2. Flywheel's statement owns the contract, and crew implements it first.
3. crew keeps its folders. JSON exists only in flight, and Flywheel's
   import keys by crew's key.
4. Meeting signals move to the flywheel branch.
5. A program lists meetings and a session reads them. The Wispr part
   is an MCP client and starts no Claude session.
6. "Plugin" replaces Flywheel's "package" and "bundle".
7. The release adapter moves onto the contract (S1) before headwater
   exists, so the contract runs on live work first.
8. eddy, the meetings tool, holds a part per meeting service. Any other
   file goes through the folder drop, Flywheel's own folder adapter
   printing the contract.

- **Done when:** each decision is accepted or changed, and `design.md`
  says what was ruled.

### D3 Decide the old meeting sweep's fate

- **Where:** the instance repository that runs it.
- **Does:** the operator stops or repairs the existing daily sweep
  while eddy is built.
- **Done when:** the sweep either runs green or is unloaded.

### H1 Amend headwater's statement

- **Where:** this repository, `design/headwater/requirements.md`.
- **Does:** writes D1's rulings and these into the statement:
  - claims on a watch-list entry;
  - the key a watch-list entry gets;
  - the Flywheel plugin prints the contract.

  New clauses take the next free numbers from 53.
- **Done when:** Vale is clean, and the operator agrees to land it on
  `main`.

### F1 Write the contract into Flywheel's statement

- **Where:** this repository, `design/flywheel-next/requirements.md`.
- **Does:** adds clauses and scenarios for:
  - running an adapter part;
  - handing captures in;
  - a capture that is its own excerpt;
  - raw banking;
  - a source's configuration and cursor;
  - an import that keeps keys;
  - "plugin" in place of "package" and "bundle".

  These amend 112, 114, 215, 217e, 217g, 217h, 228, 231 and 284.
- **Done when:** a fresh model, given the amended clauses alone,
  reconstructs the contract's lines and the host's seven steps without
  a question this design leaves open.

### C1 Amend crew's record

- **Where:** crew, `docs/architecture/` and `docs/adr/`.
- **Does:**
  - amends `signals.1` (meeting signals on the flywheel branch);
  - amends `signals.6` (the host writes the own-excerpt signal from the
    contract);
  - adds a rule that the host dedupes by key;
  - adds an ADR, "captures arrive by the contract";
  - rewrites the open change `daily-pass-through-crew` as the reader
    (C4).
- **Done when:** the record lands through sluice, and `_open.md` no
  longer asks where meeting signals live.

## Phase 1: the contract, built once

### F2 Build the contract crate and its conformance pack

- **Where:** flywheel-next. Change: `the-capture-contract`.
- **Does:**
  - splits the plain record types and key rules out of `signals.rs`
    into a small crate, with JSON in flight, rec at rest, a sha256
    content hash and the excerpt cut;
  - publishes a conformance pack of contract lines and the records each
    host must write from them.
- **Done when:** Flywheel's own tests pass the pack. headwater and eddy
  can depend on the crate at a tag.

### F6 Flywheel's built-in adapters print the contract

- **Where:** flywheel-next, in F2's change or the next.
- **Does:** gives `flywheel capture folder`, `meeting` and `signals` a
  `--print` that writes contract lines in place of records. The folder
  key takes the crate's sha256.
- **Done when:** `crew capture run -- flywheel capture folder <dir>
  --print` lands a dropped file once, and a second drop of the same
  file lands nothing.

### C2 `crew capture land`

- **Where:** crew. Change: `captures-arrive-by-the-contract`.
- **Does:** takes contract lines on standard input and does the host's
  seven steps:
  - dedupes by key across both homes;
  - banks the raw files;
  - names the folder from the event date and the key (`code.4`);
  - writes the own-excerpt signal, cut at a line;
  - records the run.
- **Done when:**
  - crew's tests pass the conformance pack;
  - a capture landed twice writes nothing the second time;
  - a refused line leaves the rest of the run landed.

### C3 `crew capture run` and run status

- **Where:** crew, in the same change or the next.
- **Does:** `crew capture run <command>` runs an adapter with its raw
  directory and last cursor and lands what it prints. It keeps the
  cursor on the host, and `crew capture status --json` reports each
  adapter's last run.
- **Done when:**
  - a run that exits without `done` keeps its cursor where it was;
  - the status names each failed item.

### S1 Move the release adapter onto the contract

- **Where:** swancloud, `packages/release-signals`. Change:
  `release-signals-speak-the-contract`.
- **Does:** the adapter prints contract lines and runs under
  `crew capture run`. It drops its `landed` list, its `work/` folder,
  its cut and its landing loop.
- **Done when:**
  - a day's 04:30 run lands through crew with its existing keys;
  - nothing lands twice;
  - the doctor's `releases` row reads crew's status.

## Phase 2: headwater

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
- **Done when:** the suite passes against the fakes, and at least one case
  cites every Part A clause.

### H5 headwater's lookups

- **Where:** headwater.
- **Does:** deps.dev by Package URL in batches, GitHub GraphQL through
  the user's `gh` sign-in, ecosyste.ms, each registry's own API where
  those fall short, and OSV in batches.
- **Done when:** recorded requests replay in the suite (headwater 37),
  and a scan of swancloud's watch list matches today's release adapter
  release for release.

### H6 headwater's Flywheel plugin

- **Where:** headwater, `plugins/flywheel`.
- **Does:** `headwater capture` prints a capture per newly reported
  release, built with the contract crate. The key, raw, excerpt and
  claims are as `design.md` sets them.
- **Done when:** its output passes the conformance pack's checks, and
  `crew capture run` lands it.

### H7 headwater's Claude Code and herdr plugins

- **Where:** headwater, `plugins/claude` and `plugins/herdr`.
- **Does:**
  - a skill and a command that read `overview` and `brief`;
  - a herdr sidebar of unread releases;
  - a fix key that starts an agent in a worktree and submits to sluice,
    or hands the release to crew in a repository crew runs.
- **Done when:** both plugins install from headwater's tag and show a
  real repository's releases.

## Phase 3: swancloud on headwater

### S2 Generate swancloud's watch list

- **Where:** swancloud.
- **Does:** generates headwater's watch list from
  `lib/release-sources.nix` (name, upstream, tag pattern, pin, claims)
  and commits it. A flake check refuses it when it drifts from the
  evaluation.
- **Done when:** the check fails on a hand edit and passes after
  regeneration.

### S3 The list of adapters, their runs and doctor rows

- **Where:** swancloud. Change: `adapters-run-from-one-list`.
- **Does:** one list in `lib/` names each adapter part, its partition,
  host and schedule. A launchd agent per entry runs `crew capture run`,
  and the doctor shows a row per entry from crew's status.
- **Done when:**
  - the release adapter runs from the list;
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

## Phase 4: meetings

### M1 eddy

- **Where:** `agentplot/eddy`, new, in Rust like headwater, on
  kit-standard's code profile.
- **Does:**
  - the code every part shares: the key, the meeting's details, the raw
    layout and skipping short meetings;
  - the `wispr` part: an MCP client with its own sign-in and a cursor.

  It prints the contract with the crate and carries no excerpt. `webex`
  and `teams` parts follow when a partition needs them.
- **Done when:**
  - the conformance pack's checks pass;
  - a listing of last week's meetings matches the service's own list;
  - no model runs during a listing.

### C4 crew's reader

- **Where:** crew. Change: `daily-pass-through-crew`, rewritten.
- **Does:** `crew read <label>` charges a reader session over unread
  captures, oldest first, on a cadence and on the user's word. Its
  instructions are the instance's data. Its signals land through crew,
  with an excerpt each.
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

### M2 Retire the old meeting pipeline

- **Where:** the instance repository that runs it.
- **Does:** removes the old sweep and its scheduled job once S5 and C4
  have run for a week. Its corpus stays where it is.
- **Done when:** no scheduled job runs the old sweep, and crew's lookup
  still finds the old corpus.

## Phase 5: curation to work

### C5 Curation into plan items

- **Where:** crew. Change: `curation-and-agenda`, already open.
- **Does:** a curator on a cadence gives signals Flywheel's six moves,
  and `route` makes plan items.
- **Done when:** a batch of release and meeting signals is curated in
  one delivery, and every signal has one move.

### C6 A release reaches a landed bump

- **Where:** crew and swancloud.
- **Does:** proves the whole path on one real release. The capture
  lands, curation routes it, and the planner proposes the chore, which
  the operator accepts row by row. A team bumps the tool with
  `headwater brief` in hand, and sluice lands it.
- **Done when:** the next scan no longer reports that release, because
  the pin moved, with no acknowledgement written.

## Phase 6: Flywheel as host

### F3 Flywheel's host side of the contract

- **Where:** flywheel-next.
- **Does:**
  - runs plugin adapter parts on the tick;
  - takes `flywheel capture land`;
  - writes the own-excerpt signal from each capture's flag;
  - banks raw material behind a host-qualified pointer.
- **Done when:** Flywheel passes the conformance pack, and headwater's
  and eddy's parts run on a Flywheel host unchanged.

### F4 Flywheel's import keeps keys

- **Where:** flywheel-next.
- **Does:** the signals-folder adapter keys each import by the
  capture's own key. The meeting adapter's `event_at` becomes the
  meeting's date.
- **Done when:** importing a crew branch twice writes nothing the
  second time, and a capture already in Flywheel under its key is not
  imported again.

### F5 crew becomes Flywheel

- **Where:** crew's and Flywheel's roadmaps.
- **Does:** the hosts change and the adapters do not. Flywheel imports
  each partition's flywheel branch once, and every adapter part keeps
  running unchanged.
- **Done when:** both roadmaps say so.
