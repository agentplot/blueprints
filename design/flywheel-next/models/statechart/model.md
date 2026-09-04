# Flywheel next — the statechart model

Every object with a lifecycle is a hierarchical state machine defined as
data. The engine is a reconciler: on every tick it lists objects, reads
evidence, evaluates guards, and performs effects whose proof is absent.
Plan rows are states. Unit types and elaboration types are machine
definitions the operator adds. This document is the written model; the
machines themselves are in `machines/`, the two profile bindings in
`profiles/`, the conformance suite in `conformance/`, the diagrams in
`diagrams/`, and what the model could not satisfy in `gaps.md`.

Reading order: section 1 says what is a machine and what is not; 2 says
how the engine runs them; 3 names every store; 4 binds each profile; 5
derives the plan; 6 to 11 cover planning, lines, the ledger, signals,
sessions and hosts; 12 answers section 10 of the requirements one
heading at a time; 13 gives the crate boundary; 14 walks S1 to S34; 15
checks the invariants.

`machines/check.py` validates every machine against `machines/schema.json`,
every guard and effect name against `machines/atoms.yaml`, every profile
for completeness, and every diagram's `data-state`, `data-row` and
`data-effect` attributes against the machines, so the pictures cannot
drift from the runtime (A.10.71):

```bash
uv run --with pyyaml --with jsonschema python3 machines/check.py
```

## 1. Objects and their machines

### 1.1 What carries a machine

An object carries a machine when it has a lifecycle the machinery must
remember between runs and share between hosts (A.8.64), or when it is a
place a plan row can stand. Everything else is a record attribute of
some object, or a file the machinery reads as evidence.

| machine | kind | governs | parent · owns | file |
|---|---|---|---|---|
| `intent` | object | one thread of design work | — · elaboration | `machines/intent.yaml` |
| `elaboration` | object | one unit of design work; its type machine runs inside `working` | intent · — | `machines/elaboration.yaml` |
| `bolt` | object | one delivery to a built repository; holds a `line` and the operator's `place` | — · unit | `machines/bolt.yaml` |
| `unit` | object | one approved piece of construction; chores are units of the chore type | bolt · work-item | `machines/unit.yaml` |
| `work-item` | object | one task of a unit; the unit type's machine runs inside `in-type` | unit · — | `machines/work-item.yaml` |
| `claim` | object | one statement in the book; proposed or standing by where its text is | — | `machines/claim.yaml` |
| `ledger-cell` | object | one standing claim × one repository in scope; fresh or stale | — | `machines/ledger-cell.yaml` |
| `capture` | object | one source event; read into signals once | — · signal | `machines/capture.yaml` |
| `signal` | object | one raw input; exactly one standing move | capture · — | `machines/signal.yaml` |
| `curation` | object, singleton per organization | the curation run | — | `machines/curation.yaml` |
| `planning` | object, singleton per built repository | the planning run | — | `machines/planning.yaml` |
| `session` | template | one agent process in one place | instantiated by a type, a stage, curation, planning, capture | `machines/session.yaml` |
| `stage` | template | one stage of a unit type: its session set and join rule | instantiated by a unit type | `machines/stage.yaml` |
| `line` | template | a branch the machinery owns | instantiated by bolt and intent | `machines/line.yaml` |
| `place` | template | a worktree off a line | instantiated by work-item, elaboration, bolt, curation, planning, capture | `machines/place.yaml` |
| `self-closing`, `standing`, `with-operator` | template | elaboration types | instantiated by `elaboration.working` | `machines/elaboration-types/` |
| `chore`, `fast`, `default`, `persona-test` | template | unit types; their states are the stages | instantiated by `work-item.in-type` | `machines/unit-types/` |
| `host`, `lease`, `word`, `plan` | engine | a host, an object's ownership, one operator word, the plan's renderings | — | `machines/engine/` |

### 1.2 What is an attribute, not a machine

- **verdict** — the record of a `ledger-cell` (`verdict`, `claim_version`,
  `revision`, `evidence`, `judged_at`). It has no life of its own; the
  cell's `freshness` region says whether it is reused or stale.
- **move** — the record of a `signal` (`target`, `reason`, `at`). The
  signal's `move` region is the move's state.
- **finding, chore offer** — records a session appends while working
  (`.flywheel/offers/*.rec` in its place). `record_offers` turns a
  finding about the session's own thread into an `elaboration` in
  `proposed` on that intent, a finding about anything else into a
  `signal`, and a chore into a `unit` of the chore type in `proposed`
  whose `batch` is the bolt id. The offer itself is archived with the
  change (A.6.54); the proposal is the object.
- **as-built statement** — a file in the built repository naming
  `claim@version`; evidence for `cell.evidence_present`, never state.
- **scope, name, dependencies, type version, retry counts, blocks** —
  record fields of the object they belong to; counters bump on
  transitions and never define a state.
- **ask** — the operator's dictation naming a repository ("do this in
  atlas"). A record in the state store (`asks/<id>`) with `repository`,
  `text`, `by`, `at`, `consumed_by`. It has no machine: planning's
  fingerprint includes every unconsumed ask, so it is planning's input,
  and `propose_units` sets `consumed_by`.
- **rendering** — the record of the `plan` object: numbered rows and
  the time. What the operator received; the tail is derived from it.
- **work order, instruction, skill, schema** — versioned files in the
  books repository (section 10), rendered into a place by
  `prepare_place`. Never state.

### 1.3 How the machines relate

Three relations, and only three:

1. **Nesting** — a state runs a submachine: `elaboration.working`
   runs the type named by the record (`machine: $type`),
   `work-item.in-type` runs `$unit.type@$unit.type_version`, a stage
   runs one `session` per agent, `bolt.open` and `intent.open` run a
   `line`, and every worker state runs a `place`. The parent sees a
   submachine only through `{final: <name>}` guards and commands it
   only through `enter: {child: state}` (the one way an owner moves a
   child: `place: merging`, `line: landing`, `session: ended`).
2. **Orthogonal regions** — independent concerns of one object run side
   by side inside a state: `intent.open` has `line`, `material` and
   `close`; `bolt.open` has `line`, `place`, `citations` and `close`;
   `session.alive` has `activity` and `presence`. One transition per
   region per tick.
3. **Ownership** — `parent`/`owns`. Owned objects are listed through
   their parent; a parent's guard may read its children's states
   (`children: {kind: unit, none: [proposed, ...]}`) and a child may
   read its parent's (`parent: {in: [open]}`). Nothing else crosses
   objects. A finding on another thread crosses as a signal, through
   curation, never as a guard.

Types are templates with parameters, so an operator-added type is a
file that names existing atoms and existing templates (`stage`,
`session`). `persona-test.yaml` is the S26 type: it changes no code.

## 2. The engine

### 2.1 The tick

A tick is one pass over one scope of objects. It is the only thing the
engine does, and it is the same for every object kind and every profile.

```
tick(scope):
  for each object in list(scope), in creation order:
    if no transition of its active configuration could fire on any
       evidence, skip                          # cheap: static analysis of the machine
    take or renew the lease; on losing it, skip
    ev  = read(object)                          # as of one named point
    cfg = ev.state                              # the active configuration
    for each active region, innermost first:
      t = first transition of the region's active state whose guard holds
      if t: fire(t)                             # at most one per region
    release the lease if the object is quiescent on this host
```

`fire(t)`: run the source state's `exit` effects, the transition's
`effects`, then the target's `entry` effects, each **only when its
proof evidence is absent**; then write one atomic record: new state,
`entered_at`, bumped counters, any `enter:` commands to child regions,
and the id of the word the guard consumed appended to `applied_words`.
The write carries the effect ids, the transition's `note`, and the
evidence values the guard read (A.9.68). A guard that holds but whose
target equals the source and whose effects are all proven is not
written: reading twice with nothing changed writes nothing (A.8.67).

Ticks are caused by: a **notify** for one object (a webhook, a
multiplexer event, a chat message), which ticks that object and its
parent chain; and a **sweep** every 60 seconds over every scope the
host has a lease or a candidate on, which is what makes every `older:`
guard fire and what makes a never-notified host converge (B.1.117).

### 2.2 Guards

The guard algebra is the whole of the engine's vocabulary
(`schema.json`, `$defs/guard`): `all`, `any`, `not`; `ev` with `is`,
`in`, `exists`, `gt/gte/lt/lte`, `older`, and `eq_ev/ne_ev/...` against
another evidence value; `word`; `final`; `children`; `parent`; `region`;
`always`. Every `ev` name is an atom the profile binds. The engine
never interprets a value; it compares.

`{word: X}` holds when a word record exists whose `row` is this
object's active row state, whose answer matches `X` (a bare word, or
`word <arg>` / `word: <text>` binding `$word`), and whose id is not in
the object's `applied_words`. Firing appends the id in the same write
as the state change, so the word is applied exactly once whatever is
delivered twice or restarted in between (B.2.124).

`{final: X}` holds when the state's submachine has a region in a
`final: true` state named `X`. `{children: {kind, all|any|none|count_gte}}`
reads the listed children's `state`. `{region: {name, in}}` reads a
sibling region of the same object.

### 2.3 Effects and proofs

Every effect in `atoms.yaml` names its **proof**: the evidence that
shows it was done (`start_session` is proven by `session.pane`;
`merge_place` by `place.merged`; `create_items` by `unit.items_exist`).
The engine performs an effect only when its proof is absent, and the
control plane's `write_effect` carries an effect id
(`<object>/<transition>/<proof evidence>/<evidence hash>`), so a repeat
is recognised and not counted (B.1.114). This is what makes every
action safe to repeat (A.7.62) and what makes S6 hold: a slow
`start_session` leaves `starting` until the pane is present, the retry
is by the same deterministic session name, and the multiplexer refuses
a second pane by that name.

### 2.4 Rows and the tail

A state with a `row:` is a plan row while it is active, and nothing
else is. A state with a `tail:` is reported once in the tail when
entered after the last delivered rendering. Section 5 derives the plan
from this.

### 2.5 The engine/domain line

The engine knows: machine files, the guard algebra, `$param`
substitution, submachine instantiation, region semantics, proofs and
effect ids, leases, the tick, row derivation, rendering and numbering,
the scenario runner. It contains no string from `atoms.yaml` and no
name from section 3 of the requirements; `machines/check.py` will
grep the engine crate for both once it exists, and the crate's tests
run the engine over a toy machine (`lamp: off → on`) that shares no
atom with the flywheel.

The domain is `atoms.yaml` plus every file under `machines/` except
`engine/`. The four engine machines (`host`, `lease`, `word`, `plan`)
are shipped with the engine because they name no domain object; they
are still data, so their windows (5m stale, 30m gone, 24h expiry) are
the operator's to change.

A new need goes to the domain side when it names something in the
world: a file, a pane, a branch, a claim, a verdict, a type of session.
It goes to the engine, as a change to `schema.json` and to this
document, only when it is a new way of **combining** evidence (a new
comparison, a new quantifier over children). No such change has been
needed to walk S1 to S34.

## 3. Stores

### 3.1 The minimal set

| store | holds | real system | profile |
|---|---|---|---|
| **state store** | every object's record: state per region, `entered_at`, `seq`, record fields, `applied_words`; the thread on the object; words; leases; host heartbeats; renderings; asks | tracker profile: GitHub issues, milestones and a Projects v2 board in the organization's `flywheel-state` repository. git-only profile: the `flywheel-state` git repository, branch `main` | differs |
| **books repository** | chapters with fenced claim blocks; the system context map; OpenSpec change directories (one per intent) and their archive; the manifest `flywheel.yaml`; instructions, schemas and skills; captures, signals and moves; the ledger; unit and elaboration type definitions | git repository, mdBook, OpenSpec, recutils files | same in every profile |
| **built repositories** | the shared line, bolt lines, places; as-built statements; OpenSpec change directories for units; persona definitions | git repositories with their own merge gates | same |
| **the multiplexer** | pane existence and activity per session | herdr, read through `herdr agent status` | same; evidence only, never durable state |
| **the place** | the session's exit record, offers, refusals, notes, inbox, work order | `.flywheel/` in the worktree, excluded from git; copied into the state store by `record_exit`, `record_offers`, `record_refusals` | same; transient until copied |

Nothing else. A host's memory holds only what it read this tick.

### 3.2 One source of truth per state

| state of | proven by | projections (never read as truth) |
|---|---|---|
| intent, elaboration, bolt, unit, work-item, curation, planning | the object's record in the state store | board column, labels, milestone open/closed, the status page, the chat rendering |
| session `requested/starting/alive/exited/lost/ended` | the record in the state store for the durable part; `session.pane` and `session.activity` from the multiplexer for `alive`'s regions | the status page's "running" column |
| session exit, offers, refusals | the state store after `record_*`; the place's `.flywheel/*.rec` before | — |
| line `absent/current/taking/conflict/landing/landed/removed` | git: the ref and `merge-base --is-ancestor` between heads; `landing` by the pull request's checks | the record's `head` field |
| place `absent/preparing/ready/behind/conflict/merging/merged/removed` | git and `wt worktree list` in the host that owns it, plus the record for the retry counters | the record's `head` |
| claim `proposed/standing` | which line of the books repository holds the fenced block | the ledger's `claim_version` copy |
| ledger-cell | the ledger record in the books repository | the backlog (derived, never stored) |
| capture, signal, move | the recutils files in the books repository | the status view's unmoved counts |
| host, lease | the heartbeat and lease records in the state store | the status view's "alive/stale" |
| word | the word record in the state store | the ✅ reaction on the chat message |
| plan rows | derived every tick from every object's active states | the rendering, the chat message, the page |

### 3.3 Drift

A projection that disagrees with its source is rewritten from the
source on the next tick of the object, and the rewrite is reported to
the run record with both values (A.8.66). The engine never reads a
projection; the profile binding lists what it reads, and every entry
is a source. The one deliberate two-store state is a line or a place,
where git is the truth and the record holds counters; if the record
says `merging` and git says the place head is already contained by the
line, git wins: the guard `place.merged` fires and the record follows.

### 3.4 What one record looks like

Every object record has the same envelope; the profile decides where
it lives (section 4). Shown in recutils, the git-only form; the tracker
form is the same block in the issue body.

```
%rec: object
id: unit/atlas/status-writer
kind: unit
parent: bolt/atlas/plan-rows
state: life=proposed
entered_at: 2026-09-04T07:12:04Z
seq: 3
applied_words:
type: default
type_version: 3
document: openspec/changes/status-writer/proposal.md
target: bolt/atlas/plan-rows
depends_on:
claims: providers/one-writer@3
batch:
```

A lease and a heartbeat:

```
%rec: lease
object: work-item/atlas/status-writer/2
holder: mac-mini
taken_at: 2026-09-04T09:01:10Z
renewed_at: 2026-09-04T09:14:10Z

%rec: host
id: mac-mini
bound: 3
last_seen: 2026-09-04T09:14:10Z
```

A word and a rendering:

```
%rec: word
id: discord/1421330001234
row: unit/atlas/status-writer/unit-proposed
rendering: r-2026-09-04T07:40:00Z
answer: yes
args:
given_by: chuck
given_at: 2026-09-04T07:41:12Z
delivery: discord message 1421330001234 in #flywheel

%rec: rendering
id: r-2026-09-04T07:40:00Z
at: 2026-09-04T07:40:00Z
delivered: discord=1421329990000 page=true
row: 1 intent/atlas-provider-limits/intent-proposed
row: 2 unit/atlas/status-writer/unit-proposed
row: 3 unit/atlas/retry-jitter/unit-proposed
row: 4 unit/atlas/chores-plan-rows/unit-proposed
row: 5 bolt/switchboard/plan-rows/bolt-close
row: 6 unit/new-repo/baseline-1/unit-proposed
row: 7 intent/loop-granularity/intent-close
row: 8 elaboration/atlas-provider-limits/prototype/idle
row: 9 bolt/atlas/plan-rows/claim-moved
row: 10 session/wi-418/build/1/question
```

The thread on an object (the tracker's comment thread, or
`thread.rec` beside the record in git):

```
%rec: thread
object: work-item/atlas/wi-418
at: 2026-09-04T10:02:00Z
kind: question
by: session wi-418/build/1
text: should Ready imply Backlog cleared?

%rec: thread
object: work-item/atlas/wi-418
at: 2026-09-04T11:40:00Z
kind: answer
by: chuck
word: page/8f1c
text: yes; Ready is a superset
```

A ledger cell (`ledger/<repository>.rec` in the books repository):

```
%rec: cell
claim: providers/one-writer
repository: atlas
verdict: satisfied
claim_version: 3
revision: 9c1e4f2
evidence: src/providers/writer.rs#L12-L80
evidence: openspec/specs/providers/spec.md#one-writer
judged_at: 2026-09-01T16:20:00Z
judged_by: work-item/atlas/wi-402/review/1
```

A capture, a signal and its move (`signals/captures/<key>.rec`,
`signals/<capture key>/<n>.rec`, `signals/moves/<signal id>.rec`):

```
%rec: capture
key: meeting/2026-09-02/willdan-weekly
source: meeting
event_at: 2026-09-02T15:00:00Z
captured_by: chuck
raw: file:///Volumes/captures/2026-09-02-willdan-weekly.vtt

%rec: signal
id: meeting/2026-09-02/willdan-weekly/7
kind: ask
asserted_by: Dana
subject: providers, retries
assertion: retries hammer the provider when it is already degraded
excerpt: "...every retry goes straight back, no jitter, and the provider rate-limits us harder..."
position: 00:41:12
argues_with: providers/one-writer

%rec: move
signal: meeting/2026-09-02/willdan-weekly/7
target: challenge providers/one-writer@3
reason: the claim assumes one writer never retries; this says it does
at: 2026-09-03T06:10:00Z
by: curation/2026-09-03T06:00
```

A fenced claim block, in the chapter that explains it
(`src/providers/one-writer.md` of the books):

````
```claim
name: providers/one-writer
version: 3
scope: capability:provider-client
lock: sha256:4b2d…e1
scenario: two hosts each hold a client; only the lease holder writes; the other reads its refusal
scenario: a write from a host whose lease expired is rejected by the provider adapter
```
One process writes to a provider at a time. The lease is …
````

The manifest (`flywheel.yaml` at the root of the books repository):

```yaml
format: flywheel-manifest/1
organization: willdan
profile: tracker             # or git-only
books: willdan/blueprints
state: willdan/flywheel-state
chat: {discord: {guild: 118..., channel: flywheel}}
page: https://flywheel.tail1234.ts.net
repositories:
  - name: atlas
    repo: willdan/atlas
    kind: service
    capabilities: [provider-client]
    landing: pull-request
    take_cadence: "0 6 * * *"
    personas: "personas/*.md"
  - name: switchboard
    repo: willdan/switchboard
    kind: service
    landing: direct
    take_cadence: "0 6 * * *"
hosts:
  - {name: mac-mini, bound: 3}
  - {name: studio, bound: 2}
```

## 4. The control plane binding

The binding is data in `profiles/`. Four files: two are partial and
shared by every profile, two are the profiles.

| file | binds | same in every profile? |
|---|---|---|
| `profiles/host.yaml` | the world the machinery acts on: git, worktrunk `wt`, herdr, Claude Code, OpenSpec, claim blocks | yes |
| `profiles/books.yaml` | the books repository as a store: ledger, captures, signals, moves, curation and planning inputs | yes |
| `profiles/record-derived.yaml` | every evidence and effect that is a function of the object record and its thread, stated over seven record operations (`get`, `put`, `append`, `list`, `words`, `leases`, `renderings`) | yes |
| `profiles/tracker.yaml` | the seven operations, the seven contract operations of B.1, the five guarantees of B.2, and the two names that differ (`deliver_rendering`, `plan.rendering_delivered`) on GitHub issues, milestones and a Projects board | tracker |
| `profiles/git-only.yaml` | the same on the `flywheel-state` git repository, with the layout of section 3.4 | git-only |

`check.py` refuses a profile marked `complete: true` that leaves any
atom unbound (B.3.127). The machines do not change between the two
(B.3.126); the diff between `tracker.yaml` and `git-only.yaml` is the
whole difference between running on a tracker and running on git.

### 4.1 The tracker profile, in short

- **Object** = an issue in `<org>/flywheel-state`, body = one fenced
  record block. Milestone per bolt and per intent. Board columns are
  projections.
- **Lease** = lease by ordered append: a `lease:` comment; the lowest
  comment id after the last `release:` holds; renewal edits the
  comment; a loser deletes its own and reads again. Expiry 24h, or the
  host row answered `takeover`.
- **Word** = a `word:` comment on the object's issue, id = the Discord
  message id, page submission id, or the timeline event id of a direct
  action (close, move on the board). Written before anything follows;
  the bot reacts ✅ when the comment exists.
- **Notify** = GitHub App webhooks over a Tailscale Funnel, else a
  30-second `since=` poll. Bound 30s.
- **Status** = the Projects board, written from the bodies; plus
  `status.html` committed and served.
- **Real tools**: `octocrab` (GitHub App token per organization),
  `serenity` (Discord), `axum` (pages), Tailscale.

### 4.2 The git-only profile, in short

- **Layout**: one repository `<org>/flywheel-state`, branch `main` the
  shared line; `objects/<kind>/<id>/object.rec` and `thread.rec`;
  `words/`, `asks/`, `plan/renderings/`, `runs/`, `status.html`.
  Leases and heartbeats are single-commit branches `lease/<id>` and
  `host/<id>`, replaced with `--force-with-lease`, so months of renewals
  add nothing to `main`'s history.
- **Write** = one commit per effect, message = effect id, reason,
  evidence; push with expected-old; rejection → fetch, rebase, retry
  (no content conflict while the lease holds), three rejections →
  report and re-read.
- **Lease** = the push is the compare-and-swap on the lease branch.
  Loser fetches and reads again (I15).
- **Word** = the scribe (the host holding the plan lease, running the
  Discord bot and the page) commits `words/<delivery id>.rec`; ✅ when
  the push lands. The operator's own commit to an object file is the
  word `commit/<sha>` (S19).
- **Notify** = push webhook over a Funnel, else `git ls-remote` every
  30s; a fetch names the changed object files, so a host re-reads only
  those.
- **Status** = `status.html` committed on `main`, served by any host,
  readable as a file of the branch when none runs, stating its as-of
  commit (S20).
- **Disconnected**: keep ticking owned objects (up to the 24h expiry),
  commit locally, take no lease, start nothing new, deliver nothing;
  on reconnect push renewals first (a rejection = lost, end own panes,
  discard), then rebase and push.

### 4.3 The status view

Served by the plan lease holder at `/status` (axum, Tailscale) and
written as `status.html` by `render_status`. Derived from `list` and
`get` alone: every intent, elaboration, bolt, unit, work-item and
session grouped by the row-free leaf of its state (queued: `waiting`,
`ready`, `approved`; in progress: `in-flight`, `working`, `alive`;
waiting on the operator: any state with a `row:`; done: any `tail:`
state), with the lease holder, the host running the session, and that
host's `alive/stale/gone`. Per object, its thread in order and its
state history (each `put` is a commit or a body edit with a date). Per
repository, what landed in a period (`bolt.landed` entries). Per bolt,
its units by state and what waits. Per host, its running sessions and
its bound. Unmoved signals by source with age. The page says the
as-of point of the read it was built from (B.4.132). It is never
written by hand.

## 5. The plan

### 5.1 Derivation

The plan is a pure function of the active states of every listed
object:

```
rows(objects) =
  for each object, for each active state with a `row:`:
    one row { kind, group, object, answers, shows }
  fold rows whose `batch` field is equal into one row (chores of a
    bolt; a baseline)
  drop rows whose fold guard says they are shown with their parent
    (an elaboration proposed under a proposed intent)
  order: group (approve, decide, answer, attention), then the object's
    creation time
  number the counted groups 1..n; attention and since are outside
```

A row cannot be missed because it is not a record anyone writes: if
the state is active the row exists, on every host, on every tick,
after every restart (A.2.6, I7). A row cannot linger because leaving
the state retracts it (I3). Every row kind has exactly one creating
state; the table below is generated by `check.py` from the machines.

### 5.2 Row catalogue

| kind | group | created by entering | retracted by leaving on | answers |
|---|---|---|---|---|
| `intent-proposed` | approve | `intent.proposed` (curation's join, or a session's finding that fits no intent) | yes → open; drop; split | yes · drop · split |
| `elaboration-proposed` | approve | `elaboration.proposed` (a finding on the thread; new material on an open intent; dictation never) — folded into the intent's row while the intent is proposed | yes → approved; drop; `type <name>` keeps it | yes · drop · type |
| `unit-proposed` | approve | `unit.proposed` (planning, a finding routed to a bolt, a chore offer); chores fold by bolt, a baseline folds by batch | yes → approved (creates the bolt if new, then the items); drop; redo → withdrawn; later → deferred; bolt/new bolt/rename/type/pick keep it | yes · drop · redo: · bolt · new bolt · rename · type · pick · later |
| `bolt-close` | approve | `bolt.open[close].offered` when every unit is merged, no chore outstanding, no hold since the last merge | yes → landing; hold → held; new work → not-offered | yes · hold |
| `intent-close` | decide | `intent.open[close].offered` when every elaboration is done | close → archiving; keep open → declined; new work → not-offered | close · keep open |
| `idle` | decide | `standing.idle-offered` (idle 30m, or kept 7d ago); `with-operator.idle-offered` (idle 12h with no operator) | finish → ended; keep → session; activity → session | finish · keep |
| `claim-moved` | decide | `bolt.open[citations].moved` when a cited claim's version moved | amend bolt / land and follow → current | amend bolt · land and follow |
| `land-failed` | decide | `bolt.land-failed`, `intent.archive-failed` | retry → landing; hold → open | retry · hold |
| `stalled` | decide | `work-item.stopped` (retry bound), `self-closing.stalled`, `line.conflict-stalled`, `place.conflict-stalled` | retry; drop / hold | retry · drop / hold |
| `question` | answer | `session.alive[activity].blocked` | the text → working, delivered to the same or a fresh session | `<text>` on the page |
| `host-gone` | attention | `host.gone` (no heartbeat 30m) | takeover → released; the host returns → alive | takeover · wait |
| `word-unapplicable` | attention | `word.unapplicable` (the row was gone) | reported once → reported | ok |

The mockup's ten rows are, in order: `intent-proposed`, `unit-proposed`
×3 (the third folded chores), `bolt-close`, `unit-proposed` (baseline
batch), `intent-close`, `idle`, `claim-moved`, `question`; its
attention lines are `host-gone` and `word-unapplicable`.

### 5.3 What a row shows

`shows:` names the evidence rendered as the row's tail: signal weight
(count, sources, span by event date) on an intent; type, target bolt,
dependencies and cited claims on a unit; idle time on a session. "What
a yes starts" on a unit row is derived from the type file at its
version: the stage names in order, times the item count (`spec →
build ×2 → review → merge`).

### 5.4 Renderings, numbering and words

`plan.rows_changed` moves the `plan` machine to `rendering`, which
records the numbered rows and the time (the rendering id) and rewrites
the status page. `plan.delivery_due` (the chat cadence, an answer-group
row, or the operator typing `plan`) delivers it to Discord with a link
to the page. A word carries the rendering id and the row number, which
the rendering resolves to a row id (`<object>/<kind>`); a page choice
carries the row id directly. The word is stored before anything
follows (B.6.138); the ✅ reaction is the operator's proof (B.6.139).

The reply grammar of the mockup is the union of the `answers` lists.
`yes all` is expanded by the bot into one word per approve row of the
rendering; each word has its own id (`<message id>/<row>`).

### 5.5 The tail

`tail:` states report once: the rendering holds `since: <previous
delivered rendering time>`, and the tail lists every object that
entered a `tail:` state after that time, from the objects' own
`entered_at` (S31). Which rendering the operator received is the
`delivered` field of the rendering record, so a restart derives the
same tail (A.2.13).

### 5.6 Dictation

Dictation skips the plan (A.2.11): "add this idea" writes an intent
in `open` (with its first elaboration in `approved`) and the dictation
message id as the approval that can be pointed to (I1); "do this in
bolt X" writes a unit in `approved` on that bolt; "do this chore"
writes a chore unit in `approved`; "revive signal N" clears the move;
an ask that names a repository without a bolt is an `asks/` record for
planning. The bot's dictation grammar is `idea: <text>`, `unit <bolt>:
<text>`, `chore: <text>`, `ask <repo>: <text>`, `revive <signal>`.

## 6. Planning

Planning is one machine per built repository (`machines/planning.yaml`,
`singleton: repository`). It is due when the repository's backlog
fingerprint differs from the one last planned against, or a unit came
back with notes. The fingerprint is a hash over: every standing claim
in scope with its version; every ledger cell of the repository; every
open bolt of the repository with its units' cited claim versions and
citation choices; every unconsumed ask naming the repository; pending
redo notes. So a claim becoming standing, a verdict recorded or fallen
stale, an ask, a redo, or a claim-moved choice each move the
fingerprint and make planning due, and nothing else does (S11: forty
commits with no claim change move nothing).

The run: a place off the repository's shared line, one `planner`
session with a work order that lists the backlog (derived from the
ledger: every cell in scope not `satisfied` or `not-applicable`), the
as-built statements, and **every open bolt of the repository with its
units and their states**. The session delivers, in its exit record:
verdicts (including `not-applicable`, each with the evidence it was
judged from), and units, each with a type, a document, dependencies,
cited claims, and a target: an open bolt id when the work belongs with
what that bolt holds, otherwise `new: <proposed name>`. `applying`
writes the verdicts to the ledger, the units to the plan, and the
fingerprint, then returns to `current`.

On a repository's first planning (`planning.ledger_empty`) every cell
in scope is judged once and the units carry one `batch` id, so they
fold into a single baseline row (S10). Chores may be among them
(A.6.56). A stale cell is planned against once per fingerprint: a
proposal already standing for the same cell is cited by the session
(the work order lists open units) and not proposed again.

The operator's word on a unit row can rename the proposed bolt, route
the unit to another open bolt, or give it a new bolt; `create_bolt`
runs only on yes, and only when the target is still `new` (A.5.26,
S27). No order among bolts is stored: a bolt record has no
predecessor field and no guard reads another bolt (A.5.27).

## 7. Lines and places

### 7.1 Shape

`line` and `place` are templates run inside the objects that own them,
so both sides have the same shape (A.5.42):

| owner | line off | places off the line |
|---|---|---|
| bolt | the built repository's shared line | one per work item; the operator's own place, kept |
| intent | the books' shared line | one per elaboration; the place of the intent's own change directory |

Curation, planning and capture reading run a place directly off the
shared line, with no line of their own: they commit nothing to a line.
Their deliverables are records written by the machinery.

### 7.2 Keeping a line current

`line.take_due` holds: before the first place is made off the line
(the line's `current` state is entered by `create_line`, and `place`
guards on `line.contains_parent`); when the line is `landing`; and
when the manifest's `take_cadence` cron for the repository has fired
since `last_take` (default `0 6 * * *`, S33). The take is `git merge
--no-ff <parent>` in the owner's own place, pushed with expected-old.
A take that conflicts is aborted whole; `seed_take_conflict` prepares
a place off the line with the conflicted merge applied and a job
record, and a session of the owner's type works it (a bolt: a `fast`
unit's build session; an intent: a self-closing elaboration session);
`line.conflict_job_done` retries the take, three times, then
`conflict-stalled` is a row (A.5.45).

### 7.3 Keeping a place current

A place is proven current before its session starts: `place.ready`
requires `place.contains_line` (`git merge-base --is-ancestor <line
head> <place head>`), and `session.requested` is entered only from
`place.ready` (I16). After any sibling merges into the line the place
is `behind`; it is rebased only when `session.activity` is not
`working` (the guard's first transition holds `behind` while working);
`tell_moved` writes the moved commits into the place's inbox and sends
one message before the session continues (S32). A rebase that
conflicts is aborted whole, seeded as a job in the place, and the
place's own session resolves it; the rebase retries on its `done`
exit; three retries then a row.

### 7.4 Merging and landing

`merge_place` runs one place at a time in the fixed order (unit
approval time, then item ordinal), via `place.merge_slot`. A place
whose line moved under it while it waited goes back to `behind` first.
After the merge the bolt's operator place is reset to the new head
(A.5.40). Landing: `bolt.open → landing` on the operator's yes enters
the line's `landing`, which takes the parent once more and then
`land_line` by the manifest's policy: a pull request with auto-merge
through the repository's gates, or a direct push with expected-old. A
failed gate is `land-failed`, a row, and nothing is asked of any
session until the word (A.5.36, S33). A landed line is removed, and
so is the operator's place.

### 7.5 What a session may not do

`prepare_place` installs `pre-push`, `reference-transaction` and
`pre-merge-commit` hooks that refuse and log, and Claude Code
settings that deny `git branch|merge|push|worktree` and `wt`. A
refusal is read as `session.refusals_pending`, recorded on the
session's thread and reported to attention (S15). The session commits
in its place; the machinery does everything else (I12).

## 8. Claims, the ledger and as-built

### 8.1 Claims are fenced blocks with a hash lock

A claim is a fenced ```` ```claim ```` block inside the chapter that
explains it (`src/**/*.md` of the books), carrying `name`, `version`,
`scope`, `scenario` lines and `lock: sha256:<hash of the block text
without the lock line>`. The books' pre-commit hook `flywheel claims
check` refuses a commit where a block's text changed and its version
did not, or where the lock does not match, so "version moves only when
its text moves" is enforced where the text lives (A.3 claim,
A.14.84). The mdBook preprocessor `mdbook-flywheel-claims` renders the
block as a callout with its name, version and scope, and writes
`claims.json` beside the book: the index curation clusters against
(A.15.95) and planning reads.

The claim's state is where its block is: on an intent's line only,
`proposed`; on the books' shared line, `standing`; gone from the
shared line, `retired`. The `claim` machine writes nothing.

OpenSpec keeps the intent's change directory (`openspec/changes/<intent
id>/`: proposal, design, tasks) and its archive; the archive of the
change is the commit before the intent's line lands, and the landing
is what makes the claims standing (A.5.42, S34). OpenSpec requirement
blocks are not the claims: they would put the claim in a spec file and
its explanation in a chapter, two sources.

### 8.2 The ledger

The ledger is `ledger/<repository>.rec` in the books repository, one
record per cell, in every profile (section 3.4). It lives with the
claims because a verdict names a claim version, which is the books'
history, and because a claim in scope for two repositories has one
cell per repository side by side (A.14.92). A `ledger-cell` object
exists for every (standing claim, repository in scope) pair; `list`
derives the pairs from `claims.json` and the manifest, so a cell needs
no record until it is judged (a joining repository has every cell
`unjudged` with no file, A.14.91).

A verdict is written only by `record_verdict`, from a session's exit:
the planning session (every cell in scope on a first planning, stale
cells afterwards), a review or test stage whose deliverables include
`verdicts-for-named-claims` (the default type's review, the chore
type's fix), never by the machinery's own judgment (A.14.87). The
record holds the claim version, the repository revision, the evidence
paths, the date and the session (`judged_by`).

### 8.3 Stale, and the row that cannot be missed

`judged → stale` when `cell.verdict_claim_version ≠ cell.claim_version`
or the cited evidence is gone from the repository's shared head
(A.14.88). Forty commits that leave the evidence in place change
nothing (S11, I10). A stale cell is in the backlog, the backlog is in
planning's fingerprint, planning becomes due, its session proposes,
and `unit.proposed` is a row. Three transitions, each a state read on
every tick, none a message that can be lost.

A bolt whose unit cites `claim@v` while the shared line holds `v+1`
enters `bolt.open[citations].moved`: the `claim-moved` row (S9). The
answer is recorded as a citation choice; `amend` marks the citing
units `needs_amend`, which is in the fingerprint, so planning proposes
the amendment on the same bolt; `land and follow` leaves the bolt on
its version and the cell stale, so planning follows after the landing.
The machinery never rewrites construction (A.14.90).

### 8.4 As-built

As-built statements are files in the built repository
(`openspec/specs/**/spec.md` blocks carrying `serves: <claim>@<v>`),
written by build sessions under the default instruction (A.16.107).
`cell.evidence_present` reads them. A statement naming no standing
claim fails the repository's own `flywheel asbuilt check` gate (I9).

## 9. Signals and curation

Adapters write captures and signals as recutils files in the books
repository under `signals/` (section 3.4): `flywheel capture meeting
<file>`, `flywheel capture discord <channel> <day>`, a folder watcher
on `~/captures`, and the Discord bot's `capture:` command for a
forwarded message. The capture key is the source event's identity
(`meeting/<date>/<name>`, `discord/<channel>/<day>`, `message/<id>`),
so a second import of the same transcript is the same file and writes
nothing (S22). The raw material stays outside git; the capture cites
it (A.15.98). Enumerating and writing captures is arithmetic and runs
unattended; reading a capture into signals is a `capture-reader`
session's judgment (`capture.reading`), except a forwarded single
message, whose one signal `ensure_signal` writes with no judgment
(S21, A.15.102).

Curation is one machine per organization. It runs a `curator` session
when the unmoved count crosses the manifest's threshold or the cadence
fires; the work order lists the unmoved signals, `claims.json`, and
the open intents. The session delivers one move per signal (attach,
challenge, join, answered, drop, each with a reason) and one proposed
intent per join cluster, with its proposed elaborations and typed by
the material. `applying` writes the moves and the intents; the intents
are rows. A signal with a move is never re-judged; only the operator's
`revive <signal>` clears it (S24). Dropping a proposed intent gives
each cited signal a `drop <intent>` move (S23). A person writing the
same files by hand is curation too: the machine then finds nothing
unmoved. Weight is by event date from the signal records; the status
view counts unmoved signals by source and age (A.15.105).

The flywheel never batches signals: the threshold and cadence are the
manifest's, the batching is the session's job, and the machinery's
only reads of a signal are the count and the move.

## 10. Sessions, instructions and the work order

### 10.1 The session machine

`session` is a template run by every type, stage, curation, planning
and capture reading. Its life is `requested → starting → alive →
exited | lost | ended`. `starting` retries `start_session` by the same
deterministic name (`<owner id>/<stage or type>/<attempt>`) until the
pane is present; herdr refuses a second pane by that name, so a slow
start is slow and never doubled (S6). `alive` has two regions: `activity`
(`working`, `idle`, `blocked`, `exited`) read from `herdr agent status`
and the exit record; `presence` (`unknown`, `gone`) read from the pane.
The machinery never sends anything to a session in `working` (I5): the
only writes toward a session are `deliver_answer` from `blocked`,
`tell_moved` from a place in `behind` whose session is idle, and
`end_session` from `ended`, which only the operator's word or a type's
rule reaches (I6).

### 10.2 Free reasoning and the fixed exits

Inside `alive.working` the agent is free. What reaches the machinery
is read from the place: `.flywheel/exit.rec` (kind `done | blocked |
stalled`, deliverables, question, notes), `.flywheel/offers/*.rec`
(kind `finding | chore | signal`, text, about), `.flywheel/notes.rec`,
and the hooks' `refusals.log`. The exit record is validated against
the schema in force; an exit that fails it is `invalid` and read as
`stalled` with the raw text recorded, so the set of exits the
machinery can see is closed by construction (A.7.57). A session is
told, in its work order, that its deliverables are files and its exit
is this record; it is given no tool that moves state. Offers are
recorded the moment they appear and never interrupt the session
(A.6.50).

### 10.3 Blocked

`blocked` is a `question` row on the item. Only that session stops;
the item's siblings, the unit, the bolt and every other object continue
(S30). The answer is written to the item's thread, then delivered to
the same session if its pane is present, else a fresh attempt starts
with the answer at the top of its work order. `blocks` bumps on the
session record; the status view sums it by type and stage (A.7.59).

### 10.4 Instructions as data

Everything a session is given lives in the books repository and is
versioned by it: `flywheel/schemas/<artifact>.md`,
`flywheel/instructions/<artifact>.md`, `flywheel/skills/<session
type>/SKILL.md`, `flywheel/types/units/<type>.yaml` and
`flywheel/types/elaborations/<type>.yaml` (the machine files of
`machines/unit-types/` and `machines/elaboration-types/` are what the
operator's files look like; the engine loads them from the books at
the version the object recorded), and the manifest. `prepare_place`
renders `.flywheel/work-order.md` from the closed inputs: the schema
instruction, the type skill, the work order proper (job, deliverables,
exit contract), and the artifacts of the change (the unit document or
the intent's change directory, the cited chapters, the open bolts for
planning). Nothing else is written into the place, and the place's
Claude Code settings deny reads outside it (A.11.77). Every input is
named with its version (the books commit) in the work order's header.
`flywheel render-order <scenario>` renders the exact prompt with no
session (A.11.78, A.16.111). Changing any of these is a chore on the
books repository; hosts read the books' shared line, so a change
reaches every host at its next fetch, and a session started before it
carries the older commit in its header (A.11.79, A.16.110).

The default instructions ship in the books repository template:
`instructions/design-conclusion.md` (write the chapter and the claim in
one commit; update the context map), `instructions/construction.md`
(name the claim the work serves in every as-built statement). The
context map is `src/context-map.md` plus `context-map.json`, versioned
with the book; the review view is `flywheel review` served at
`/review`: the chapters and map nodes changed since the operator's
last `reviewed` mark (a word), with the previous version beside each
(S25, A.16.109).

## 11. Hosts and leases

A host is one static binary (`flywheel host`) with a name and a bound
from the manifest. It heartbeats every minute. The `host` machine reads
the heartbeat: `alive`, `stale` at 5 minutes, `gone` at 30 minutes
(the `host-gone` attention row), `released` when the operator answers
`takeover` or 24 hours pass. The `lease` machine on each object reads
the holder and renewal: `held`, `stale` at 5 minutes (shown on the
status view; the holder may still renew and continue, S13), `expired`
at 24 hours or on the host's release, `free` when released.

Which host acts on an object: the one holding its lease. A host takes
a lease only on an object with a transition that could fire and no
holder, or an expired holder, by the profile's compare-and-swap. It
renews on every tick it acts and releases when the object is quiescent
(no transition could fire on any evidence and no session of it runs
here). Sessions run on the host holding their owner's lease, within
that host's bound; `item.slot_free` orders ready items by ordinal
across the host (S29). Nothing runs twice: the session name is
deterministic and the multiplexer refuses a duplicate; a takeover
starts attempt `n+1`, and the old host, on return, reads that its
lease was replaced, ends its own pane for that object, and reports
(S13).

A restart of the machinery reads everything again and reaches the same
configuration; a running session is evidence (`session.pane` present),
not memory, so it is still `alive` after the restart (S5, I7).

## 12. Answers to section 10

### 12.1 Which objects carry a machine, and how do the machines relate?

Eleven object kinds carry a machine (section 1.1): intent, elaboration,
bolt, unit, work-item, claim, ledger-cell, capture, signal, curation and
planning; four engine objects (host, lease, word, plan); and seven
templates (session, stage, line, place, and the type families). Verdicts,
moves, offers, as-built statements, asks, renderings and instructions
are attributes or files (1.2). The machines relate by nesting (a state
runs a submachine and sees only its finals), orthogonal regions inside a
state, and ownership (`parent`/`owns`, with `children` and `parent`
guards). Nothing else crosses objects (1.3).

### 12.2 Where does event-driven behavior meet reconciliation?

Nowhere inside the engine: the engine only reconciles. A session's life
is event-driven in the world (herdr starts, idles, exits), and the
`session` machine reads that life as evidence on every tick
(`session.pane`, `session.activity`, `session.exit`). Events drive
reconciliation only by causing ticks sooner: a herdr pane hook, a
webhook, a Discord message each notify one object. A host that never
receives an event converges by the 60-second sweep (B.1.117). So the
answer to "how does one drive the other" is: events shorten the wait;
evidence decides.

### 12.3 Where does an agent's free reasoning sit?

Inside `session.alive[activity].working`, in a place with a closed set
of inputs and no tool that moves state. Its exits are kept to the fixed
set by reading only a schema-validated exit record and offer records
from the place; an invalid record is `stalled` with the raw text; a
refused git operation is a logged refusal; anything else the agent does
is invisible to the machinery (10.2). The owner decides what an exit
means (`self-closing` finishes on done; `standing` ignores done; a
stage judges by its join rule).

### 12.4 How is the plan derived, and what makes a row impossible to miss?

Rows are states with a `row:` attribute; the plan is the fold of every
listed object's active row states, numbered by group and creation time
(5.1). A row exists on every host on every tick while the state is
active and vanishes when it is left, so there is no row record to
forget, duplicate or lose; a restart re-derives the same rows (I7). The
rendering is recorded only so a numbered reply can be attributed and the
tail can be derived.

### 12.5 What is the minimal set of stores?

Five (3.1): the state store (tracker or state repository), the books
repository, the built repositories, the multiplexer (evidence only), and
the place's `.flywheel/` (transient until copied). Section 3.2 names one
source of truth per state and lists the projections.

### 12.6 How does curation connect without the flywheel batching signals?

Adapters write signal files at any rate; the `curation` machine reads
two numbers (unmoved count, cadence) and runs one session whose job is
the batching; the session's exit delivers moves and proposed intents;
the machinery writes them (section 9). The flywheel never reads a
signal's content; a person writing the same files is curation too.

### 12.7 Where does the ledger live, who writes a verdict, and how does a stale verdict become a row?

`ledger/<repository>.rec` in the books repository in every profile
(8.2). A verdict is written by `record_verdict` from a planning, review
or test session's exit, never computed. Stale is a state of the cell
read every tick from the claim's version and the evidence's presence;
it moves planning's fingerprint; planning proposes; `unit.proposed` is a
row (8.3). A moved citation on an open bolt is the `claim-moved` row on
the bolt itself.

### 12.8 Which profile is built first, and what test proves a second conforms?

The git-only profile first: its control plane is `gix` plus the `git`
binary, which the host binding already needs for lines and places, so
the first build has one external service (the git host) and the
conformance suite runs against a local bare repository with no network.
The tracker profile follows as a second implementation of the same
`ControlPlane` trait. The proof of conformance is `conformance/`: one
set of scenario files run by `flywheel scenario run --profile <name>`
against the stand-in, then against each real profile in a sandbox
(a temporary bare repository; a throwaway GitHub repository), with the
machine files byte-identical (`check.py` hashes them into the run
record). A profile is admitted when every scenario passes and
`check.py` finds its binding complete.

### 12.9 Where is the line between an engine primitive and a domain atom?

Section 2.5. Engine: the guard algebra, region and submachine semantics,
proofs and effect ids, leases, ticks, row derivation, rendering, the
scenario runner. Domain: every `ev` and `do` name. A need that names
anything in the world is an atom; a need for a new way of combining
evidence is an engine change to `schema.json`. The engine crate has no
string from `atoms.yaml`, checked by grep.

### 12.10 Where does planning sit?

A machine per built repository, singleton (section 6). It is told the
backlog changed by its fingerprint over standing claims, ledger cells,
open bolts and their citations, asks and redo notes; it sees the open
bolts because the fingerprint and the work order both list them.

### 12.11 What is the cadence rule for a take, and what proves a place is current?

`line.take_due` = before the first place off the line, before landing,
and the manifest's `take_cadence` cron per repository (7.2). A place is
current when `git merge-base --is-ancestor <line head> <place head>`
holds; `place.ready` requires it, and a session is requested only from
`place.ready` (7.3, I16).

### 12.12 Are claims OpenSpec requirement blocks or fenced claim blocks?

Fenced claim blocks with a hash lock, in the chapter that explains them,
checked by the books' pre-commit hook and rendered by an mdBook
preprocessor (8.1). OpenSpec keeps the intent's change directory and
its archive.

### 12.13 What is the layout of state in git, and what does a race look like?

One state repository per organization, one shared branch `main`, one
directory per object with `object.rec` and `thread.rec`, one commit per
state change; leases and heartbeats as single-commit branches replaced
with `--force-with-lease` (4.2). A race: two hosts commit on `main` from
the same base and push; the git host rejects the second as stale; the
loser fetches, rebases its one-file commit, and pushes again. Content
never conflicts while leases hold; a lease race is two pushes to
`lease/<id>` with expected-old zero, of which one is rejected, and the
loser reads the winner (S17, I15).

### 12.14 How does the phone reply become a commit, and how is the status page served without a central process?

The scribe: the host holding the plan lease runs the Discord bot and
the page; it writes `words/<message id>.rec` and pushes; the ✅ reaction
follows the push (4.2). The status page is `status.html`, rebuilt by
`render_status` on every rendering and committed; any host serves it
and, with none running, it is read as a file of the branch and says its
as-of commit (S20).

### 12.15 How is history kept from growing without bound?

Leases and heartbeats never touch `main` (single-commit branches,
unreachable old commits collected by the git host). Renderings are
pruned to the last fifty on `main`. Verdicts are rewritten only when a
claim's version moves. `main` grows by one small commit per state
change, on the order of a few hundred a day, which git carries for
years; history is the audit record and is never rewritten (C.2.151).
In the tracker profile the lease comment is edited, not re-posted.

### 12.16 What replaces the tracker's comment thread in git-only?

`objects/<kind>/<id>/thread.rec`, append-only, holding questions,
answers, notes, exits, offers, refusals and words. A session leaves a
note by writing `.flywheel/notes.rec` in its place; `record_exit`
copies it into the thread; the status view shows the thread under the
object (B.4.131).

## 13. The Rust crate boundary

The boundary falls out of the model's three kinds of thing: the engine
(schema and tick), the atoms (names a profile binds), and the profiles
(bindings to real systems).

| crate | holds | depends on |
|---|---|---|
| `flywheel-engine` | the machine loader (`schema.json` as `serde` types), the guard evaluator, regions and submachines, the tick planner (`plan_tick(defs, snapshot) -> Vec<Transition>` — pure, no IO), row derivation, rendering and numbering, proofs and effect ids, the four engine machines | `serde`, `serde_yaml`, nothing else; no string from `atoms.yaml` |
| `flywheel-atoms` | the `Evidence` and `Effect` name registries generated from `atoms.yaml` at build time; the `ControlPlane` trait (`list`, `read`, `write_effect`, `lease`, `present`, `receive`, `notify`); the `World` trait (one method per host effect); the scenario file types | `flywheel-engine` |
| `flywheel-domain` | the machine files embedded with `include_dir`, the type catalogue loader (from the books), the work order renderer, the claim block parser and lock, the recutils reader and writer, the fingerprint | `flywheel-atoms` |
| `flywheel-world-host` | `World` over herdr (`herdr agent`), worktrunk (`wt`), `git` and `gix`, Claude Code, OpenSpec; `profiles/host.yaml` is its specification | `flywheel-atoms` |
| `flywheel-cp-git` | `ControlPlane` over the state repository (`gix`, `git push --force-with-lease`); `profiles/git-only.yaml` | `flywheel-atoms` |
| `flywheel-cp-tracker` | `ControlPlane` over GitHub (`octocrab`); `profiles/tracker.yaml` | `flywheel-atoms` |
| `flywheel-surface` | the Discord bot (`serenity`), the pages (`axum`), the reply grammar, the scribe; profile-neutral because it writes words through `ControlPlane::receive` | `flywheel-atoms` |
| `flywheel-scenario` | the stand-in control plane (in-memory `ControlPlane` and `World`), the conformance runner, the trace renderer | `flywheel-engine`, `flywheel-atoms`, `flywheel-domain` |
| `flywheel` | the binary: `host`, `scenario`, `capture`, `claims check`, `render-order`, `review` | all |

Nothing in a machine file, a scenario or a profile binding names Rust:
the same files would drive any engine that implements `schema.json`.
The one static binary per host is `flywheel` with both control planes
compiled in and chosen by the manifest's `profile`.

## 14. The scenarios, walked

Each walk names the states entered, the effects performed (by atom
name) and the rows created (+) and retracted (−). Every walk is also a
scenario file in `conformance/scenarios/`.

**S1 — approve an elaboration from the phone.** `elaboration.proposed`
(+`elaboration-proposed`, row 1). Discord reply `yes 1` → word
`discord/<id>` with row `elaboration/<id>/elaboration-proposed`;
`{word: yes}` fires `proposed → approved`, `applied_words += id`
(−row). Next tick `approved → placing` (`parent in open`), `place:
absent → preparing` (`prepare_place`) `→ ready`; `placing → working`;
`self-closing.session: requested → starting` (`start_session`) `→
alive`. A second delivery of the same reply has the same id and is in
`applied_words`; no guard matches; nothing re-asks (I2). A restart
re-derives `working` from the record and the pane.

**S2 — a standing prototype goes idle.** `elaboration.working` runs
`standing`; `session.alive[activity]: working → idle`; after 30m
`standing.session → idle-offered` (+`idle`). No effect touched the pane:
the prototype keeps running under `wt tether`. Next morning the row
stands; the operator opens the place and the process is there (I6).
`keep` → `session` with `kept_at`; `finish` → `finished` (`enter:
session: ended`, `end_session`) → `done` → `elaboration.finishing`
(`merge_place`, `remove_place`) → `done` (tail).

**S3 — a chore.** A build session writes `.flywheel/offers/1.rec` (kind
chore, about `AGENTS.md`); `session.working` self-transition
`record_offers` → `unit` of type `chore` in `proposed`, `batch` = the
bolt id, `scope` bolt-line (+`unit-proposed`, folded with the bolt's
other chores). The session finishes its own job. `yes 4` → `approved`;
`create_bolt` is proven absent by the type (I8); `create_items` makes
one item; `work-item: waiting → ready → placing` (place off the bolt's
line) `→ in-type` (`chore.fix` stage, one `chore-fixer` session) `→
merging` (`merge_place`) `→ merged` (tail). No change directory: the
type records `needs_change_directory: false`, and the work order says
so.

**S4 — a finding dropped.** `record_offers` with kind finding about the
session's own intent → `elaboration.proposed` on that intent
(+`elaboration-proposed`, "finding from wi-418"). `drop` → `dropped`
(−row, tail). No place, no session, no line was created: no effect ran
before `approved`.

**S5 — restart mid-day.** The engine holds nothing. On start it lists,
reads and derives: every session in `alive` is proven by
`session.pane`; every place by git; every row by the states. The
rendering it derives equals the last recorded one, so
`plan.rows_changed` is false and nothing is written (A.8.67, I7).

**S6 — a slow host.** `session.requested → starting` runs
`start_session` (`herdr agent start --name <id>`); each tick in
`starting` finds `session.pane` absent and repeats the effect by the
same name; herdr refuses a duplicate name, which is not an error. At
two minutes the pane is present → `alive`. One session; no report.

**S7 — close an intent.** Last elaboration `done` → `intent.open[close]:
not-offered → offered` (+`intent-close`). `close` → `open → archiving`
(`enter: line: landing`): `archive_intent` (`openspec archive`),
`line.landing`: `take_parent`, `land_line` (direct) → `landed`
(`remove_line`) → `removed`; `archiving → closed` (tail). Nothing else
moved: no other object has a guard on the intent's close except its
claims, which read the shared line and become `standing`.

**S8 — twenty signals.** `flywheel capture meeting` writes one capture;
`capture.captured → reading` (place, `capture-reader` session) `→ read`
(`record_offers` writes 20 signal files). `curation.idle → running`
(count ≥ threshold) `→ applying`: `record_moves` (6 attach, 9 drop, 5
join), `propose_intents` (2 intents in `proposed`, one with
`challenges: [providers/one-writer@3]`). +2 `intent-proposed` rows
showing weight; 0 rows per signal. Every signal has a move file.

**S9 — a claim's boundary is wrong.** Build session offers a finding on
its intent → `elaboration.proposed` → yes → a self-closing session
amends the chapter and the claim block (version 3 → 4) → intent close →
archive lands, claim `standing` at 4. The bolt's unit cites `@3`:
`bolt.open[citations]: current → moved` (+`claim-moved`). `amend bolt` →
`record_citation_choice(amend)` sets `needs_amend`; planning's
fingerprint moves → `planning.due → running → applying` proposes the
amendment unit on the same bolt (+`unit-proposed`). `land and follow` →
the bolt lands on `@3`; the cell is `stale`; planning proposes the
follow-up. Nothing was rebuilt without the word.

**S10 — a repository joins.** The manifest gains the repository; `list`
derives a `ledger-cell` per standing claim in scope, all `unjudged`;
`planning.fingerprint` differs from `none` → `running`; the session
judges every cell (`record_verdict` for each, including
`not-applicable`) and delivers the unsatisfied set as units with one
`batch` → one folded `unit-proposed` row (mockup row 6). Cells in
`judged.not-applicable` are never in the backlog again (I10).

**S11 — forty commits, no claim changed.** `cell.evidence_present` still
true, `cell.claim_version` unchanged → every cell stays `judged`; the
fingerprint is unchanged → planning stays `current`; no row moved.

**S12 — the status view from the phone.** Tracker: the Projects board
and `status.html`; git-only: `status.html` on `main`. Both list every
bolt, unit, session by state group with the lease holder and its
`alive/stale/gone`, as of the last write.

**S13 — two hosts, one loses power.** Host A holds the lease on
`work-item/x` and runs its session. Its heartbeat stops: `host: alive →
stale` (5m) `→ gone` (30m, +`host-gone` attention); `lease: held →
stale`. Host B's tick skips the object (lease not free). The status
view shows the build and A as stale. A returns within 24h: heartbeat →
`alive`, its lease renews → `held`, the session is still `alive` by the
pane; the build resumes on A. Or the operator answers `takeover` →
`expire_leases` → `lease.expired` → B takes it by compare-and-swap and
starts attempt 2; A on return reads it lost, `end_session` on its own
pane, reports. Never twice: B's attempt 2 is a different session name,
and A's attempt 1 is ended before A acts again.

**S14 — two send-backs then pass.** `work-item.in-type` runs `default`:
`review` stage `sessions → sent-back` (verdict not-done, `send_backs`
0 < 3) → `build` (bump 1) → `review → sent-back` (1 < 3) → `build`
(bump 2) → `review → passed` → `default.passed` → `work-item.merging`
(`merge_place`) → `merged`; `bolt.close: not-offered → offered` → yes →
`landing → landed`. The item's record has `send_backs: 2`, the thread
has both exits, and `item.retry_max` was 3.

**S15 — a session tries to create a line.** The `pre-push` and
`reference-transaction` hooks in the place refuse and log;
`session.refusals_pending` → `record_refusals` + `report` (attention
line). The place was prepared by `prepare_place`, the session committed
in it, `merge_place` moved its commits to the line. No ref of the
repository was changed by the session.

**S16 — a dictated scenario.** `flywheel scenario dictate "<sentence>"`
starts a self-closing session with the scenario schema that writes
`conformance/scenarios/<name>.yaml`; `flywheel scenario run` executes
it against the stand-in and writes `<name>.trace.md`: the ticks, the
guards read, the transitions, the effects with ids, the rows after each
tick.

**S17 — two hosts take one unit.** Both push `lease/unit-x` with
expected-old zero; the git host accepts one. The loser's push is
rejected; it fetches, reads the holder, skips the object. One
`create_items`, one session.

**S18 — an hour offline.** The host's ticks continue on the objects it
holds; effects on the multiplexer and the place proceed; state writes
are local commits. It takes no lease, starts nothing new, delivers
nothing. On reconnect: lease renewals pushed (accepted: still under
24h), then `main` commits rebased onto the fetched head (other hosts'
commits touched other objects) and pushed; the status page rebuilt.

**S19 — the operator edits a file by hand.** A commit on `main`
changes `objects/intent/x/object.rec` state to `closed`. Every host's
next fetch lists that file as changed and derives the word
`commit/<sha>` for the object. When the intent's active row was
`intent-close`, the word is `close` and the machine runs its own path
(`archiving`, then `closed`). When no row stood, the written state is
honoured as given: the engine reconciles the rest from it (an intent
written `closed` with a live line has its line's `landing` run to
completion) and reports the direct write once under attention. No
process had to be told: the fetch is the notify.

**S20 — the page six hours after the last host stopped.** `status.html`
on `main` at the git host, headed "as of <commit> at <time>".

**S21 — a forwarded message.** Discord `capture: <forward>` → the bot
writes `signals/captures/message-<id>.rec` with `raw` = the message
link; `capture.captured` self-transition `ensure_signal` writes one
signal; the capture stays `captured` until `signals_present` → `read`.
Nothing else: curation runs only on count or cadence.

**S22 — the same transcript twice.** Same capture key → same file →
the second import writes nothing; the capture is already `read`.

**S23 — drop a proposed intent.** `intent.proposed` → `drop` →
`drop_signals` writes `drop <intent>` moves for its five signals →
`dropped`. Next curation lists unmoved signals: none of the five.

**S24 — revive a signal.** Dictation `revive <signal>` removes the move
file; `signal: dropped → unmoved`; the count moves; the next run
clusters it.

**S25 — a claim amended in one commit.** The default instruction makes
the session change the chapter, the claim block and the context map in
one commit; the pre-commit hook checks the lock and the version bump.
`flywheel review` diffs `src/` and `context-map.json` from the last
`reviewed` word to the intent's landing and serves the changed chapter
and node with the previous version beside it.

**S26 — an operator-added type.** The operator commits
`flywheel/types/units/persona-test.yaml` (the file in
`machines/unit-types/persona-test.yaml`). A new unit of that type
records `type_version: 1`; its item's `test` stage `resolving` reads
`stage.agents` by globbing `personas/*.md` in the place: three matches,
three `session` submachines by name `<item>/test/1/<persona>`; join
`all`; each exit's offers recorded; the set recorded on the item. In a
five-persona repository, five. A unit in flight under `default@3` reads
its own `type_version` and is untouched (A.5.49).

**S27 — one intent, two repositories.** The archive makes two claims
`standing`, in scope for `atlas` and `switchboard`; both planning
fingerprints move; two runs. `atlas`: two units, target `new:
atlas-retry-behaviour`; `switchboard`: one unit, target the open bolt
`plan-rows`. Words: `3 rename retry` → `rename_bolt` on the proposal;
`5 new bolt other` → `route_unit`. `yes` on each → `create_bolt` where
the target is new. No bolt record names another.

**S28 — a three-week bolt.** The operator runs the system in the bolt's
place (`bolt.open[place]`, reset after each merge). Dictation `unit
plan-rows: <bug>` → a unit in `approved` with the dictation as its
approval → items → sessions. Next day a finding from a session on
another bolt is recorded as a signal (another thread), curation moves
it `answered`/`attach`, or planning routes it: an ask naming the
repository → planning proposes a unit targeting `plan-rows`
(+`unit-proposed`) → yes. Both units carry `depends_on`. The bolt's
close is offered when both are merged; the operator closes it.

**S29 — three items, bound two.** Items 1 and 2 `waiting → ready →
placing` (slots free); item 3 `waiting` (`item.deps_merged` false).
Items 1 and 2 merge in ordinal order; item 3 `ready`; `item.slot_free`
(running 0 < 2) → `placing`. A restart in between finds items 1 and 2
`alive` by their panes and item 3 by its record; the deterministic
session name refuses a duplicate.

**S30 — blocked.** Build session writes `exit.rec` kind blocked with the
question → `session.working → blocked` (bump `blocks`, `record_exit`,
+`question` row on the item). The item's `stage` stays in `sessions`;
its siblings merge. The page answer → word → `blocked → working`,
`deliver_answer` (`herdr agent send`, the pane is present). The
thread holds the question and the answer; `blocks` on the session
record is summed by the status view.

**S31 — yes at 07:40, look at 16:00.** The word applies; items run
through `default`'s stages; merges land; `bolt.close` is offered. The
16:00 rendering has `since: 07:40`; its tail lists the items' `merged`
entries and the unit's `merged`; the only new counted row is
`bolt-close`.

**S32 — side by side, then a rebase.** Units A and B in flight. A's
item merges (`merge_place`); B's place is `behind`; B's session is
`working`, so the guard holds `behind`. B goes idle → `rebase_place`;
conflict → `seed_conflict_job` (`.flywheel/conflict.rec`, `herdr agent
send`); B's session resolves it, exits done → `conflict → behind`
(retry 1) → `rebase_place` succeeds → `ready` (`tell_moved`). B's stage
continues; on pass, `merging` → `merge_place` lands.

**S33 — cadence and a failed gate.** Every morning `line.take_due` by
the cron → `taking` (`take_parent`) → `current`. Close → `landing`:
`take_parent` once more, `land_line` opens the pull request; the gates
fail → `line.landing: failed` → `bolt.land-failed` (+`land-failed` row,
`landing_failure` on the record). No session is requested. `retry` →
`landing` again; `hold` → `open`.

**S34 — two elaborations, one archive.** Research (self-closing) exits
done → `elaboration.finishing` (`enter: place: merging`) → `merge_place`
into the intent's line → `remove_place` → `done`. The prototype's place
is `behind` → rebased while idle → `ready`, kept (`keep: by-type`). The
intent's close offered; `close` → `archiving`: `archive_intent`, the
line takes the books' shared line, lands directly, is removed. The two
claim blocks are on the shared line: `claim.proposed → standing`.

## 15. Invariants

| invariant | held by |
|---|---|
| I1 | no effect before `approved`; `approved` is entered only by a word or a dictation record, both stored with the object |
| I2 | `applied_words` written in the same atomic write as the state change; word id = delivery id |
| I3 | a row is a state; `check.py` lists one creating state per kind; leaving it retracts |
| I4 | section 3.2, one source per state; projections rewritten from the source |
| I5 | no effect targets a session in `working`; `rebase_place` and `tell_moved` guard on idle |
| I6 | `session.ended` is entered only by `enter: session: ended` from `standing.finished` and `with-operator.finished`, reached only by `word: finish` |
| I7 | the engine holds nothing between ticks; S5 |
| I8 | `create_bolt`'s proof is read false for a chore by the type; the chore type has no bolt target |
| I9 | `flywheel asbuilt check` gate in the built repository |
| I10 | `ledger-cell.judged` leaves only on version move or evidence gone |
| I11 | one lease per object by compare-and-swap; the status view shows the holder |
| I12 | hooks and settings in the place; every line effect is a machinery atom |
| I13 | `check.py`: atoms are abstract; only `profiles/` name a tool |
| I14 | git-only: the host's disk holds fetched state and local commits about to be pushed |
| I15 | git-only: `--force-with-lease` on lease branches; expected-old on `main` |
| I16 | `place.ready` requires `contains_line`; `session.requested` only from `ready`; `behind` holds while `working` |

## 16. The diagrams

One per machine family, in the house style, each validated by
`check.py` against the machines through its `data-state`, `data-row`
and `data-effect` attributes. Amber pills are plan rows; a row is
created on entering the state under the pill and retracted by the word
that leaves it. Red solid edges write the ledger; red dotted edges
read it.

![Design side](diagrams/flywheel-design-side.svg)

Intent, elaboration, the three elaboration types, the session, and the
intent's line and places. The archive diamond is where the intent's
line lands on the books' shared line and its claim blocks become
standing; the ledger reads that version and a cell falls stale. Four
rows are on this picture: `intent-proposed`, `intent-close`,
`elaboration-proposed`, `idle`, plus `question` on the session. The
picture does not show the `material` region of an open intent, which
joins new signals and findings to the one proposed elaboration, nor
the `with-operator` type's twelve-hour window; both are in
`machines/intent.yaml` and `machines/elaboration-types/`.

![Construction side](diagrams/flywheel-construction-side.svg)

Bolt, unit, work item, the type and stage templates, and the session
as construction sees it. The review stage writes the ledger from its
verdict deliverable; the bolt's citation region reads the ledger and
the claim version and raises `claim-moved`. Six rows are here:
`claim-moved`, `bolt-close`, `land-failed`, `unit-proposed`, `stalled`,
`question`. Not shown: the `deferred` state a unit enters on `later`,
the operator's place machine inside the bolt, and the merge order rule
(unit approval time, then item ordinal), which section 7.4 states.

![Lines and places](diagrams/flywheel-lines-and-places.svg)

The two repositories with their shared line, a line each and places
off it, and the two templates beneath. The ledger is neither read nor
written by a line or a place; the shared line's head is where a
verdict's evidence is checked. Two `stalled` rows are here, one per
template, after three conflict retries. The cadence rule and the
"first place, before landing" takes are stated in the band; the
`landing` state's pull request versus direct policy is the manifest's
per repository.

![Backlog](diagrams/flywheel-backlog.svg)

Capture, signal, curation, claim, ledger cell and planning. The
fingerprint diamond is the one point where "the backlog changed" is
decided; every cell of the repository is in it, so a stale cell cannot
avoid a planning run and a `unit-proposed` row. The ledger is written
only by `record_verdict` from a planning, review or test session's
exit. Two rows: `intent-proposed` and `unit-proposed`. Not shown: the
`split` answer on an intent, the baseline fold, and the `redo` path
back to planning.

![Engine](diagrams/flywheel-engine.svg)

The tick as a numbered walk, the two profile bindings as cards, the
stores every profile shares, and the four engine machines. The ledger
is one of the stores read at step 3 and is written only through an
effect at step 5 whose proof is a verdict record. Two rows:
`word-unapplicable` and `host-gone`. Not shown: the 60-second sweep's
interaction with leases (a host renews only the leases of objects it
ticked), and the scribe (the plan lease holder runs the bot and the
page), both in section 4.
