# Flywheel next — the statechart model

Every object with a lifecycle is a hierarchical state machine defined as
data. The engine is a reconciler: on every tick it lists objects, reads
evidence, evaluates guards, and performs effects whose proof is absent.
Plan decisions are states. Unit types and elaboration types are machine
definitions the operator adds. This document is the written model; the
machines themselves are in `machines/`, the profile bindings in
`profiles/`, the conformance suite in `conformance/`, the diagrams in
`diagrams/`, and what the model could not satisfy in `gaps.md`.

Requirements are cited by their number in `requirements.md` (1–314,
lettered sub-clauses such as 150a, 205a, 217e and 253a among them);
scenarios as S1–S34 and invariants as I1–I16.

Reading order: section 1 says what is a machine and what is not; 2 says
how the engine runs them; 3 names every store; 4 binds each profile; 5
derives the rail; 6 to 11 cover planning, lines, the ledger, signals,
sessions and hosts; 12 answers section 10 of the requirements one
heading at a time; 13 gives the crate boundary; 14 walks S1 to S34; 15
checks the invariants; 16 describes the diagrams; 17 covers the agent
kinds, the pull-request landing, operation, intents as changes with
gathered elaborations, deliverables with their producers, endpoints
and routing, where files live, and bootstrapping (A.17 to A.24).

`machines/check.py` validates every machine against `machines/schema.json`,
every guard and effect name against `machines/atoms.yaml`, every profile
for completeness, every diagram's `data-state`, `data-decision` and
`data-effect` attributes against the machines so the pictures cannot
drift from the runtime (83), and the requirement trace: every machine,
decision kind, effect and conformance scenario carries `satisfies:
[numbers]`, and the check fails when a number names no requirement or a
requirement is cited nowhere (section 12 of the requirements):

```bash
uv run --with pyyaml --with jsonschema python3 machines/check.py
```

`machines/render.py` draws the same files as statecharts — one SVG per
machine under `diagrams/machines/`, listed in `diagrams/machines/index.md`
with each machine's kind, version, object and `satisfies` — regions as
bands, states as boxes with their decision kinds, finals and submachines,
transitions labelled with the guard, the effects and the `enter:`
commands. The pictures are derived, never drawn by hand, so they are the
operator's review of every machine at every change (83; the registry and
the context each session is handed are in `machines-and-context.md`):

```bash
uv run --with pyyaml python3 machines/render.py
```

## 1. Objects and their machines

### 1.1 What carries a machine

An object carries a machine when it has a lifecycle the machinery must
remember between runs and share between hosts (75), or when it is a
place a rail decision can stand. Everything else is a record attribute
of some object, or a file the machinery reads as evidence.

| machine | kind | governs | parent · owns | file |
|---|---|---|---|---|
| `intent` | object | one thread of design work; its line is a region of its own | — · elaboration, unit (take-conflict chores only) | `machines/intent.yaml` |
| `elaboration` | object | one unit of design work; its type machine runs inside `working` | intent · — | `machines/elaboration.yaml` |
| `bolt` | object | one delivery to a built repository; its `line`, the operator's `place` and its `services` are regions of its own | — · unit, service | `machines/bolt.yaml` |
| `service` | object | one declared process in a bolt's place: stopped, starting, running, failed; the operator's `start` and `stop` and a session's command are one record (47, 48) | bolt · — | `machines/service.yaml` |
| `unit` | object | one approved piece of construction; chores are units of the chore type | bolt or intent · work-item | `machines/unit.yaml` |
| `work-item` | object | one task of a unit; the unit type's machine runs inside `in-type` | unit · — | `machines/work-item.yaml` |
| `operator-session` | object | the operator's own session (69): with-operator, no thread, ends by dictation | — | `machines/operator-session.yaml` |
| `claim` | object | one statement in the book; proposed or standing by where its text is | — | `machines/claim.yaml` |
| `ledger-cell` | object | one standing claim × one repository in scope; fresh or stale | — | `machines/ledger-cell.yaml` |
| `capture` | object | one source event; read into signals once | — · signal | `machines/capture.yaml` |
| `signal` | object | one raw input; exactly one standing move | capture · — | `machines/signal.yaml` |
| `curation` | object, singleton per instance | the curation run | — | `machines/curation.yaml` |
| `planning` | object, singleton per built repository | the planning run | — · proposal | `machines/planning.yaml` |
| `proposal` | object | one planning run's document: the bolts it proposes and the units in each; the one decision the run raises (172) | planning · — | `machines/proposal.yaml` |
| `session` | template | one agent process in one place | instantiated by a type, a stage, curation, planning, capture, the operator session | `machines/session.yaml` |
| `stage` | template | one stage of a unit type: its session set and join rule | instantiated by a unit type | `machines/stage.yaml` |
| `line` | template | a branch the machinery owns | instantiated by bolt and intent | `machines/line.yaml` |
| `place` | template | a worktree off a line; removed, held or kept under its owner's command | instantiated by work-item, elaboration, bolt, operator-session, curation, planning, capture | `machines/place.yaml` |
| `self-closing@2`, `standing@2`, `with-operator@3` | template | elaboration types | instantiated by `elaboration.working` and `operator-session.open` | `machines/elaboration-types/<machine>@<version>.yaml` |
| `chore@2`, `fast@3`, `default@5`, `persona-test@3` | template | unit types; their states are the stages — the OpenSpec steps `spec` (ff), `build` (apply) and `verify` for `default`, one `ff-apply` stage for `fast`, the archive being the item's merge-time effect (10.7) | instantiated by `work-item.in-type` | `machines/unit-types/<machine>@<version>.yaml` |
| `flywheel` | object, singleton | the bootstrap: absent, blueprints ready, state ready, awaiting the App, connected, hosted (204) | — · repository | `machines/flywheel.yaml` |
| `repository` | object | a built repository the flywheel tracks: proposed, creating, registering, covering, tracked (206) | instance · — | `machines/repository.yaml` |
| `pool` | object | a platform that provisions hosts on demand from the image, up to a bound, and retires them idle: image current or behind; hosts adding, steady, retiring (240–242) | instance · — | `machines/pool.yaml` |
| `package` | object | one package of one kind — adapter, chat sink, runner, router, sign-in, type, producer, vocabulary, template, scenario pack — added, awaiting install, needing a secret, installing, installed, disabled, removed (228, 229) | instance · — | `machines/package.yaml` |
| `host`, `lease`, `response`, `rail`, `sink` | engine | a host, an object's ownership, one operator response, the rail's decision register, one delivery sink | — | `machines/engine/` |

### 1.2 What is an attribute, not a machine

- **verdict** — the record of a `ledger-cell` (`verdict`, `claim_version`,
  `revision`, `evidence`, `judged_at`). It has no life of its own; the
  cell's `freshness` region says whether it is reused or stale.
- **move** — the record of a `signal` (`target`, `reason`, `at`). The
  signal's `move` region is the move's state.
- **finding, chore offer** — documents a session writes in the change
  directory it works, at the moment it judges them, archived with the
  change (62). The session announces each with `flywheel offer`, which
  appends one entry to the session's thread through the state store;
  `record_offers` turns that entry into one record that points at the
  document: a chore into a `unit` of the chore type in `proposed`, a
  finding on the session's own thread into an `elaboration` (design
  side) or a `fast` unit (construction side) in `proposed`, anything
  else into a `signal`. The record never holds the text.
- **as-built statement** — a file in the built repository naming
  `claim@version`; evidence for `cell.evidence_present`, never state.
- **scope, name, dependencies, type version, retry counts, blocks,
  approval, endpoints, held_at, citation choices** — record fields of the
  object they belong to; counters bump on transitions and never define a
  state.
- **ask** — the operator's dictation naming a repository (the `ask`
  tool, "do this in atlas"). A record in the state store (`asks/<id>`) with `repository`,
  `text`, `by`, `at`, `consumed_by`. It has no machine: planning's
  fingerprint includes every unconsumed ask, so it is planning's input,
  and `propose_units` sets `consumed_by`.
- **decision** — a state of its object (section 5), never a record of
  its own. What is recorded about it is one line in the rail's
  register: its id, its number, and when it was numbered.
- **delivery mark** — the `delivered_at` field of a `sink` record: the
  one recorded piece of state behind the tail (14).
- **work order, instruction, skill, schema** — versioned files in the
  blueprints repository (section 10), rendered into a place by
  `prepare_place`. Handed in, never read back.

### 1.3 How the machines relate

Three relations, and only three:

1. **Nesting** — a state runs a submachine: `elaboration.working`
   runs the type named by the record (`machine: $type`),
   `work-item.in-type` runs `$unit.type@$unit.type_version`, a stage
   runs one `session` per agent, `bolt` and `intent` run a `line` and
   `bolt` the operator's `place` as top-level regions, and every worker
   state runs a `place`. A submachine is instantiated when the state
   that runs it is entered, and entered again by a self-transition or
   a return to that state instantiates it afresh: the prior instance
   is retired into the record under its attempt with its last state
   readable there, and the live slot holds the new one. Leaving the
   state neither ends nor clears the live instance: it lives in the
   object's record for the life of the object, stays readable at its
   dotted path from any later state of the parent, and may still be
   commanded by a later state's `enter:` (so `finished` may command
   `{session: ended}` and a guard may then read `{final: ended}`). The
   parent sees a submachine only
   through `{final: <name>}` guards (`<region>.<name>` when the state
   has more than one submachine, as `bolt.landing` has `line` and
   `place`) and commands it only through `enter: {child: state}` — the
   one way an owner moves a child: `place: merging`, `place: removing`,
   `line: landing`, `line: removing`, `session: ended`. `enter` reaches a
   submachine at any depth (an item's `session: ended` reaches the
   session inside its stage).
2. **Orthogonal regions** — independent concerns of one object run side
   by side: `intent` has `life` and `line`; `bolt` has `life`, `line`,
   `place` and `services`; `work-item` and `elaboration` have `life` and
   `place`; `intent.open` has `material` and `close`; `bolt.open` has
   `citations` and `close`; `session.alive` has `activity` and
   `presence`; `rail` has `register` and `status`. One transition per
   region per tick. A region reads a sibling through `{region: {name,
   in}}`, and the name may be a dotted path into a submachine run beside
   it (`place.place.life`), never a path into another object.
3. **Ownership** — `parent`/`owns`. Owned objects are listed through
   their parent; a parent's guard may read its children's states
   (`children: {kind: unit, none: [proposed, ...]}`) and a child may
   read its parent's (`parent: {in: [open, dropped]}`). Nothing else
   crosses objects. A finding on another thread crosses as a signal,
   through curation, never as a guard.

Types are templates with parameters, so an operator-added type is a
file that names existing atoms and existing templates (`stage`,
`session`). `persona-test@3.yaml` is the S26 type: it changes no code.
A type file is addressed as `name@version` and never edited; section
10.7 states the registry.

## 2. The engine

### 2.1 The tick

A tick is one pass over one scope of objects. It is the only thing the
engine does, and it is the same for every object kind and every profile.

```
tick(scope):
  for each object in list(scope), in creation order:
    if no transition of its active configuration could fire on any
       evidence, skip                          # cheap: static analysis of the machine
    if this host's declaration does not cover the object, skip (149)
    take or renew the lease; on losing it, skip
    ev  = read(object)                          # as of one named point
    cfg = ev.state                              # the active configuration
    for each active region, innermost first:
      t = first transition of the region's active state whose guard holds
      if t: fire(t)                             # at most one per region
    release the lease if the object is quiescent on this host
```

Every guard in one tick of an object reads the one `ev` taken before
the region loop: a region's move this tick is visible to its siblings,
its parent and its children on the object's next tick, never within the
same one. A `final:` guard reads its own submachine's conclusion, not a
sibling, and is not held. A scenario expecting two dependent moves
therefore expects two ticks.

`fire(t)`: run the source state's `exit` effects, the transition's
`effects`, then the target's `entry` effects, each **only when its
proof evidence is absent**; then write one atomic record: new state,
`entered_at`, bumped counters, any `enter:` commands to child regions,
and the id of the response the guard consumed appended to
`applied_responses`. The write carries the effect ids, the transition's
`note`, and the evidence values the guard read (79). A guard that holds
but whose target equals the source and whose effects are all proven is
not written: reading twice with nothing changed writes nothing (78).

Ticks are caused by: a **notify** for one object (a webhook, a
multiplexer event, a chat message, a session's `flywheel exit`), which
ticks that object and its parent chain; and a **sweep** every 60 seconds
over every scope the host has a lease or a candidate on, which is what
makes every `older:` guard fire and what makes a never-notified host
converge (130).

### 2.2 Guards

The guard algebra is the whole of the engine's vocabulary
(`schema.json`, `$defs/guard`): `all`, `any`, `not`; `ev` with `is`,
`in`, `exists`, `gt/gte/lt/lte`, `older`, and `eq_ev/ne_ev/...` against
another evidence value; `response`; `final`; `children`; `parent`;
`region`; `always`. Every `ev` name is an atom the profile binds. The
engine never interprets a value; it compares.

`{response: X}` holds when an op-response record exists that concerns
this object, whose answer matches `X` (a bare word, or `word <arg>` /
`word: <text>` binding `$response`), and whose id is not in the object's
`applied_responses`. A response concerns the object in one of two ways:
as an **answer**, it names a decision number that the rail's register
resolves to this object's active decision state; as a **dictation**, it
names the object outright (12). A dictation may name only a transition
that undoes or defers work — `drop`, `hold`, `release`, `send back`,
`retire`, `takeover`, `finish`, `close`, `end` — never one that asserts
work was done (4); a dictation with any other answer is `unapplicable` and reported. The one pair outside that list is `start`
and `stop` on a service, which 47 gives the operator outright; a
session's `flywheel service start|stop` writes the same op-response
record, so the service machine sees one `{response: start}` whoever
asked (48). Firing appends the id in the same write as the state
change, so the response is applied exactly once whatever is delivered
twice or restarted in between (137).

`{final: X}` holds when the state's submachine has a region in a
`final: true` state named `X`; `{final: line.removed}` names the
`line` region's submachine when a state has more than one.
`{children: {kind, all|any|none|count_gte}}` reads the listed children's
`state`. `{region: {name, in}}` reads a sibling region of the same
object; `name` may be a dotted path `<region>.<state>.<region>` into a
submachine run in a sibling region (`place.place.life` is the `life`
region of the place machine in the `place` region's `place` state), and
never crosses objects.

### 2.3 Effects and proofs

Every effect in `atoms.yaml` names its **proof**: the evidence that
shows it was done (`start_session` is proven by `session.pane`;
`merge_place` by `place.merged`; `create_items` by `unit.items_exist`;
`remove_place` by `place.absent`). The engine performs an effect only
when its proof is absent, and the state store's `write_effect` carries
an effect id (`<object>/<transition>/<proof evidence>/<evidence hash>`),
so a repeat is recognised and not counted (127). This is what makes
every action safe to repeat (73) and what makes S6 hold: a slow
`start_session` leaves `starting` until the pane is present, the retry
is by the same deterministic session name, and the multiplexer refuses
a second pane by that name.

### 2.4 Decisions and the tail

A state with a `decision:` is a rail decision while it is active, and
nothing else is (9). A state with a `tail:` is reported once in a
sink's tail when entered after that sink's delivery mark. Section 5
derives the rail from this.

### 2.5 The engine/domain line

The engine knows: machine files, the guard algebra, `$param`
substitution, submachine instantiation, region semantics, proofs and
effect ids, leases, the tick, decision derivation, the register and
numbering, the scenario runner. It contains no string from `atoms.yaml`
and no name from section 3 of the requirements (86); `machines/check.py`
will grep the engine crate for both once it exists, and the crate's
tests run the engine over a toy machine (`lamp: off → on`) that shares
no atom with the flywheel.

The domain is `atoms.yaml` plus every file under `machines/` except
`engine/` (87). The five engine machines (`host`, `lease`, `response`,
`rail`, `sink`) are shipped with the engine because they name no domain
object; they are still data, so their windows (5m stale, 30m gone, 24h
expiry, 30 days of register retention, 24h enrolment token) are the
operator's to change through `flywheel.yaml` `engine:`, read at load with
the file's literals as the defaults (`profiles/record-derived.yaml`
`engine_windows`).

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
| **state store** | every object's record: state per region, `entered_at`, `seq`, record fields, `applied_responses`; the thread on the object (questions, answers, notes, exits, offers, refusals, moves); op-responses; leases; host heartbeats; the rail's register; the sinks' marks; asks; the run record | tracker profile: GitHub issues, milestones and a Projects v2 board in the instance's `flywheel-state` repository. git-only profile: the `flywheel-state` git repository, branch `main` | differs |
| **blueprints repository** | the instance's (203): chapters that include their claims by anchor, the standing specifications (`openspec/specs/<capability>/spec.md`) that hold the claims themselves, the system context map (`context-map/`, the scope surface), the manifest `flywheel.yaml`, OpenSpec change directories (one per intent) and their archive, the shipped instructions, schemas, skills and type files under `flywheel/`; the machinery's own, under `flywheel/` only: captures, signals and moves, the ledger and the rendered maps | git repository, mdBook, OpenSpec, recutils files parsed by the binary | same in every profile |
| **built repositories** | its owners' (203): the shared line, bolt lines, places; code; as-built statements; persona definitions; the repository's declarations under `flywheel/` — `services.yaml` (47), read at the head of the bolt's place and changed only by a chore (48), `commit-types.yaml` (185); the standing specifications (`openspec/specs/`), which are the as-built: every requirement in them names the claim and version it serves (99); the machinery's own: OpenSpec change directories for units, holding the finding and chore documents, the acceptance file, and under the machinery's prefix the index of that standing set written at landing (192), plus an untracked `.flywheel/` per place | git repositories with their own merge gates | same |
| **the multiplexer** | pane existence, activity and the last keystroke per session | herdr, read through `herdr agent status` | same; evidence only, never durable state |

Nothing else. A host's memory holds only what it read this tick. The
place's disk is not a store (67): what a session leaves there is its
work, and the work order handed into it is an input. A session reports
its exit, its offers and its notes with the `flywheel` command, which
writes an entry on the session's thread through the state store;
nothing on disk is read back as state. Evidence a host observes about
the world each tick — a pane's state, a head, a gate's result, a
worktree's presence — is not state and is re-observed after a restart
(I14).

### 3.2 One source of truth per state

| state of | proven by | projections (never read as truth) |
|---|---|---|
| intent, elaboration, bolt, unit, work-item, operator-session, curation, planning | the object's record in the state store | board column, labels, milestone open/closed, the decision issue (tracker), the status page, the chat delivery |
| session `requested/starting/alive/exited/lost/ended` | the record in the state store for the durable part; `session.pane`, `session.activity` and the last keystroke from the multiplexer for `alive`'s regions | the status page's "running" column |
| session exit, offers, refusals | the entries the session's command wrote on its thread, then the session record after `record_exit`, `record_offers`, `record_refusals` | — |
| line `absent/current/taking/conflict/landing/landed/removing/removed` | git: the ref and `merge-base --is-ancestor` between heads; `landing` by the pull request's checks | the record's `head` field |
| place `absent/preparing/ready/behind/conflict/merging/merged/removing/held/removed` | git and `wt worktree list` on the host that owns it, plus the record for the retry counters, the endpoints and the hold | the record's `head` |
| service `stopped/starting/running/failed/gone` | the service's record for the intended state (moved only by a response); `wt tether status` and the readiness check for whether the process is present and serves | the page's service line beside the bolt, with its endpoint and controls |
| claim `proposed/standing` | which tree holds the requirement block: an intent's delta, or `openspec/specs/` on the blueprints' shared line | the ledger's `claim_version` copy |
| ledger-cell | the ledger record in the blueprints repository | the backlog (derived, never stored) |
| capture, signal, move | the recutils files in the blueprints repository | the status view's unmoved counts |
| host, lease | the heartbeat and lease records in the state store | the status view's "alive/stale" |
| response | the op-response record in the state store | the ✅ reaction on the chat message |
| rail decisions | derived every tick from every object's active states | the chat message, the page, the decision issue |
| decision numbers | the rail's register in the state store | the number shown on every surface |
| the tail | derived from the objects' `entered_at` after a sink's mark | the chat message, the page |

### 3.3 Drift

A projection that disagrees with its source is rewritten from the
source on the next tick of the object, and the rewrite is reported to
the run record with both values (77). The engine never reads a
projection; the profile binding lists what it reads, and every entry
is a source. The one deliberate two-store state is a line or a place,
where git is the truth and the record holds counters, endpoints and the
hold; if the record says `merging` and git says the place head is
already contained by the line, git wins: the guard `place.merged` fires
and the record follows.

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
applied_responses:
type: default
type_version: 5
document: openspec/changes/status-writer/proposal.md
target: bolt/atlas/plan-rows
depends_on:
claims: providers/one-writer@3
batch:
approval:
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
declares: kinds=all repositories=atlas,switchboard unit_types=default,fast,chore presents=page
last_seen: 2026-09-04T09:14:10Z
```

A response, the rail's register, and a sink:

```
%rec: op-response
id: discord/1421330001234
kind: answer
decision: 413
object: unit/atlas/status-writer
answer: yes
args:
given_by: chuck
given_at: 2026-09-04T07:41:12Z
delivery: discord message 1421330001234 in #flywheel

%rec: object
id: rail/willdan
kind: rail
state: register=current status=current
next_number: 422
register: 412 intent/atlas-provider-limits/intent-proposed/2026-09-04T06:10:00Z since=2026-09-04T06:10:04Z
register: 413 unit/atlas/status-writer/unit-proposed/2026-09-04T07:12:04Z since=2026-09-04T07:12:09Z
register: 414 unit/atlas/retry-jitter/unit-proposed/2026-09-04T07:12:04Z since=2026-09-04T07:12:09Z
register: 415 unit/atlas/chores-plan-rows/unit-proposed/2026-09-04T07:12:04Z since=2026-09-04T07:12:09Z
register: 416 bolt/switchboard/plan-rows/bolt-close/2026-09-03T18:40:11Z since=2026-09-03T18:40:15Z
register: 417 unit/new-repo/baseline-1/unit-proposed/2026-09-04T07:30:00Z since=2026-09-04T07:30:02Z
register: 418 intent/loop-granularity/intent-close/2026-09-03T22:01:40Z since=2026-09-03T22:01:44Z
register: 419 elaboration/atlas-provider-limits/prototype/idle/2026-09-04T06:31:00Z since=2026-09-04T06:31:03Z
register: 420 bolt/atlas/plan-rows/claim-moved/2026-09-04T07:33:12Z since=2026-09-04T07:33:15Z
register: 421 session/wi-418/build/1/question/2026-09-04T07:38:50Z since=2026-09-04T07:38:52Z

%rec: object
id: sink/chat
kind: sink
state: delivery=idle
sink_kind: chat
surface: #flywheel
routes: approve decide answer attention
cadence: 0 7,12,17 * * *
pinned_to: dispatcher
delivered_at: 2026-09-04T07:40:00Z
delivery: discord message 1421329990000
```

The thread on an object (the tracker's comment thread, or
`thread.rec` beside the record in git); the first two entries were
written by the session's own command:

```
%rec: thread
object: work-item/atlas/wi-418
at: 2026-09-04T10:02:00Z
kind: exit
by: session wi-418/build/1
exit: blocked
question: should Ready imply Backlog cleared?

%rec: thread
object: work-item/atlas/wi-418
at: 2026-09-04T10:02:00Z
kind: offer
by: session wi-418/build/1
offer: chore
document: openspec/changes/status-writer/chores/agents-md.md
about: AGENTS.md cites a removed section
scope: bolt-line

%rec: thread
object: work-item/atlas/wi-418
at: 2026-09-04T11:40:00Z
kind: answer
by: chuck
response: page/8f1c
text: yes; Ready is a superset
```

A ledger cell (`flywheel/ledger/<repository>.rec` in the blueprints repository, 203):

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

A capture, a signal and its move (`flywheel/signals/captures/<key>.rec`,
`flywheel/signals/<capture key>/<n>.rec`,
`flywheel/signals/moves/<signal id>.rec`, 203):

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

A claim, in the blueprints' standing specifications
(`openspec/specs/providers/spec.md`); its name is `providers/one-writer`
and its version is the hash of this block without the `Attaches:` line:

````
### Requirement: one-writer

One process writes to a provider at a time. The lease is …

Attaches: element:provider-client

#### Scenario: two hosts hold a client
- **WHEN** two hosts each hold a client for one provider
- **THEN** only the lease holder writes, and the other reads its refusal

#### Scenario: an expired lease is refused
- **WHEN** a host whose lease expired writes
- **THEN** the provider adapter rejects the write
````

The chapter that explains it (`src/providers/one-writer.md` of the
blueprints) includes it by anchor, and the preprocessor renders the
requirement in place with its name, version and derived scope:

````
Providers are single-writer for the reason the lease exists …

{{#claim providers/one-writer}}
````

The manifest (`flywheel.yaml` at the root of the blueprints repository):

```yaml
format: flywheel-manifest/1
instance: willdan
profile: tracker             # or git-only
blueprints: willdan/blueprints
state: willdan/flywheel-state
repositories:
  - name: atlas                # kinds and capabilities are derived from the map nodes homed here (199)
    repo: willdan/atlas
    landing: pull-request
    take_cadence: "0 6 * * *"
    personas: "personas/*.md"
  - name: switchboard
    repo: willdan/switchboard
    landing: direct
    take_cadence: "0 6 * * *"
hosts:                       # what each host takes (149); a host takes leases only within this
  # identity is the host's kind (243), tier what exists on the service side (268),
  # intermittent whether the host goes away rather than gone (150a), provider the
  # environment it can satisfy (238), router how a place's services are reached (191)
  - {name: mac-mini, bound: 3, kinds: [all], repositories: [atlas, switchboard], unit_types: [default, fast, chore, persona-test], presents: [page, bell],
     identity: github, tier: 0, intermittent: true, provider: devenv, router: portless}
  - {name: studio, bound: 2, kinds: [all], repositories: [atlas], unit_types: [default, fast, chore], presents: [],
     identity: github, tier: 0, intermittent: true, provider: devenv, router: tailnet}
  - {name: dispatcher, bound: 0, kinds: [], presents: [chat],
     identity: github, tier: 0, intermittent: false, provider: none, router: tailnet}   # takes nothing; presents only
pools: []                    # a pool names its platform, bound, cost ceiling and retire time (240); none at tier 0
operators:                   # membership, authored whole on a self-managed host (234, 247)
  - {github: chuck, discord: "440812…", slack: U04AB…}   # one chat sink per address, keyed by identity (236a)
  - {github: sam}                                        # no chat address: a page sink only
sinks:                       # where decisions and the tail go (82); one presenter each (148)
  chat: {discord: {guild: 118..., channel: instance}, routes: [approve, decide, answer, attention], cadence: "0 7,12,17 * * *", presenter: dispatcher}   # the shared channel: one sink, one mark, no member
  page: {url: https://flywheel.tail1234.ts.net/willdan/rail, routes: [approve, decide, answer, attention]}   # the instance in the path (205a); each member's page sink has its own mark (236)
  bell: {surface: "herdr:operator-desk", routes: [answer, attention, land-failed]}
curation: {threshold: 12, cadence: "0 6 * * 1-5"}
```

## 4. The state store binding

The binding is data in `profiles/`. Nine files: six are partial and
shared, three are the profiles.

| file | binds | same in every profile? |
|---|---|---|
| `profiles/host.yaml` | the world the machinery acts on: git, worktrunk `wt` (worktrees and tethered processes), portless, OpenSpec on both sides, the manifest's declarations, the repositories' service declarations. Its line-and-place half is swappable: a build with no construction may bind those effects to a recorded stand-in that writes each proof's evidence and touches no repository (93a, `workspace: recorded`) | yes |
| `profiles/sessions.yaml` | the session binding: herdr panes, Claude Code, and the `flywheel exit\|offer\|note\|refuse` command sessions report through (67) | yes |
| `profiles/sessions-stand-in.yaml` | the same names bound to a scripted player, swapped in by `flywheel scenario run` (93); never loaded by a host | test only |
| `profiles/sessions.yaml` `runners.operator` | the same names with no agent at all: the machinery prepares the place and records the session, the rail shows it as the operator's to run, and the operator reports through the session command (93b) | yes, host-selected |
| `profiles/blueprints.yaml` | the blueprints repository as a store: ledger, captures, signals, moves, curation and planning inputs | yes |
| `profiles/record-derived.yaml` | every evidence and effect that is a function of the object record and its thread, stated over six record operations (`get`, `put`, `append`, `list`, `responses`, `leases`) | yes |
| `profiles/surfaces.yaml` | the sinks (chat, page, bell) and the review surfaces (plannotator for documents, lavish for rich pages) | yes |
| `profiles/tracker.yaml` | the six record operations, the seven operations of B.1 — eight methods on `StateStore`, because present and receive are two — and the five guarantees of B.2 on GitHub issues, milestones and a Projects board; the decision issues | tracker |
| `profiles/git-only.yaml` | the same on the `flywheel-state` git repository, with the layout of section 3.4 | git-only |
| `profiles/stand-in.yaml` | the same again on the in-memory store: one map per object, the rail's register the `rail` object's own record, leases a map, notify an in-process call. It exists so the admission gate has something to read for the stand-in path, since `contract/binding.yaml` runs on every profile (168–170); no host runs on it, and its durability is for the process's life with the trace as the record (92, 95) | stand-in |

`check.py` refuses a profile marked `complete: true` that leaves any
atom unbound, and a binding that names an atom no machine has (140).
The machines do not change between the three (139); the diff between
`tracker.yaml`, `git-only.yaml` and `stand-in.yaml` is the whole
difference between running on a tracker, on git and on a map in memory,
and it is only the record operations and the contract: everything about
sessions, surfaces and the world is shared. `stand-in.yaml` is not
`sessions-stand-in.yaml`: one replaces the state store, the other the
session binding, and a conformance run with no `--profile` uses both
(92, 93).

### 4.1 The tracker profile, in short

- **Object** = an issue in `<instance>/flywheel-state`, body = one fenced
  record block, for every object with a rail-facing lifecycle (157).
  Milestone per bolt and per intent. Board columns are projections.
- **Decision** = one issue per numbered decision, labelled
  `kind:decision`, titled `#<number> <kind> <object>`, opened by the
  presenter when the register gains the entry and closed when it drops
  it. A projection of the object's state (158); answering on it is the
  response (159).
- **Lease** = lease by ordered append: a `lease:` comment; the lowest
  comment id after the last `release:` holds; renewal edits the
  comment; a loser deletes its own and reads again. A host attempts a
  lease only within its declaration (149). Expiry 24h, or the host
  decision answered `takeover`.
- **Response** = an `op-response:` comment on the object's issue, id =
  the Discord message id, page submission id, plannotator annotation
  id, or the timeline event id of a direct action (close, move on the
  board, tick a checklist item on the decision issue). Written before
  anything follows; the bot reacts ✅ when the comment exists.
- **Notify** = GitHub App webhooks over a Tailscale Funnel, else a
  30-second `since=` poll. Bound 30s.
- **Status** = the Projects board, written from the bodies; plus
  `status.html` committed and served.
- **Real tools**: `octocrab` (GitHub App token per instance),
  `serenity` (Discord), `axum` (pages), Tailscale, plannotator, lavish.

### 4.2 The git-only profile, in short

- **Layout**: one repository `<instance>/flywheel-state`, branch `main` the
  shared line; `objects/<kind>/<id>/object.rec` and `thread.rec`;
  `responses/`, `asks/`, `runs/`, `status.html`. The rail's register
  and the sinks' marks are the `rail` and `sink` objects' records. No
  rendering of the rail is committed (15). Leases and heartbeats are single-commit
  branches `lease/<id>` and `host/<id>`, replaced with
  `--force-with-lease`, so months of renewals add nothing to `main`'s
  history.
- **Write** = one commit per effect, message = effect id, reason,
  evidence; push with expected-old; rejection → fetch, rebase, retry
  (no content conflict while the lease holds), three rejections →
  report and re-read. A session's `flywheel exit|offer|note|refuse`
  appends to its own thread by the same path.
- **Lease** = the push is the compare-and-swap on the lease branch.
  Loser fetches and reads again (I15). A sink's presenter lease is
  `lease/sink/<name>`; a sink the manifest pins is taken only by the
  pinned presenter.
- **Response** = the presenter that received it commits
  `responses/<delivery id>.rec`; ✅ when the push lands. The operator's
  own commit to an object file is the response `commit/<sha>` (S19).
- **Notify** = push webhook over a Funnel, else `git ls-remote` every
  30s; a fetch names the changed object files, so a host re-reads only
  those.
- **Status** = `status.html` committed on `main`, served by any host,
  readable as a file of the branch when none runs, stating its as-of
  commit (S20).
- **Disconnected**: keep ticking owned objects (up to the 24h expiry),
  commit locally, take no lease, start nothing new, deliver to no sink;
  on reconnect push renewals first (a rejection = lost, end own panes,
  discard), then rebase and push.

### 4.3 The status view

Served by the page sink's presenter at `/status` (axum, Tailscale) and
written as `status.html` by `render_status`. It is central: one place
for the whole instance, reachable from the phone, however many
hosts run machinery (143). Derived from `list` and
`get` alone: every intent, elaboration, bolt, unit, work-item,
operator-session and session grouped by the decision-free leaf of its
state (queued: `waiting`, `ready`, `approved`; in progress: `in-flight`,
`working`, `alive`; waiting on the operator: any state with a
`decision:`; done: any `tail:` state), with the lease holder, the host
running the session, and that host's `alive/stale/gone`. Per object,
its thread in order and its state history (each `put` is a commit or a
body edit with a date). Per repository, what landed in a period
(`bolt.landed` entries). Per bolt, its units by state, what waits, and
the endpoints its place serves (46). Per host, its running sessions,
its bound and its declaration. Unmoved signals by source with age. The
map view (201, model.md section 5): the target map at rest — a card
per context (hatched when big ball of mud, dashed when external), one
edge per relationship with its pattern's name and U and D at the ends
of a directional one, OHS and PL badges upstream and ACL downstream, a
shared kernel drawn as a lens, separate ways as a dotted edge with a
bar; on each card a count of elements per kind (names when five or
fewer), a home chip per distinct home with a verdict dot coloured by
the worst verdict among the claims in scope for that repository
through this context, an attachment count chip, decision markers with
their numbers, and status marks (candidate soft-bordered, open with a
question mark). A context opens in place and the rest dims: its
elements by kind with home chip and verdict dot, its links, its
attachments as claim chips, its language, and an open element's
question with the capture gesture beside it (112). Two overlays from
one id-keyed difference: current to target, and target at the
operator's last `reviewed` mark to target now (122), added with a
plus, removed ghosted, changed with a delta and the fields on hover,
moved with the old home struck through. Tags filter, colour and group
as washes and never change structure; repositories are chips, claims
are chips, the current map is an overlay, layout is computed and fit
is the only camera command. The
page says the as-of point of the read it was built from (145). It is
never written by hand.

Every kind of object has one form and no two kinds share one (209): a
decision is the only thing shaped as an answerable card; a proposal is
a document with its unit proposals hanging off it; an intent is a
thread with its elaborations in order; a bolt is a ledger with its
units in order; a landed bolt is a record; a signal is a quote. Where
an object sits — queued, in progress, waiting on the operator, done —
says its phase; its form never does, so a bolt in `landing` and a bolt
in `open` are the same ledger in different columns. The chat rendering
keeps the forms one line each (18): a decision line is answerable and
no other line is. An elaboration is a surface of its own reached from
its intent's thread (210): its type and state, its decision when one
is pending, its document and the records it wrote into the intent's
change directory (187), its session with its last activity (65–68),
and, when a gathering covers it, the gathering it is in (188); the
intent's surface lists its elaborations in order and opens each.

## 5. The rail

### 5.1 Derivation

The rail is a pure function of the active states of every listed
object, plus the register that numbers them:

```
decisions(objects, register) =
  for each object, for each active state with a `decision:`:
    one decision { id = object/kind/entered_at, kind, group, object, answers, shows, document }
  fold decisions whose `batch` field is equal into one (chores of a
    bolt; a baseline)
  drop decisions whose fold guard says they are shown with their parent
    (an elaboration proposed under a proposed intent)
  attach each decision's number from the register; a decision with no
    entry is unnumbered, and the rail machine numbers it this tick
  order: group (approve, decide, answer, attention), then number
```

A decision cannot be missed because it is not a record anyone writes:
if the state is active the decision exists, on every host, on every
tick, after every restart (7, I7). A decision cannot linger because
leaving the state retracts it (I3). Every decision kind has exactly one
creating state; the table below is generated by `check.py` from the
machines.

### 5.2 Numbers

Every decision carries a short number, unique in the instance,
given once and never reused (15). The `rail` machine (one per
instance) holds the register: `next_number`, which only grows, and
one entry per numbered decision (`decision id → number, since`). On a
tick where a standing decision has no entry, `number_decisions` writes
the entries and the bumped counter in one atomic write of the rail
record; the rail's lease makes it single-writer. A decision's id
includes the `entered_at` of its state, so a decision state that is
left and re-entered (a bolt's close offered, withdrawn by new work, and
offered again; a deferred unit re-proposed after a week) is a new
decision with a new number: the operator's earlier reply cannot land on
a question that has changed. Entries are pruned thirty days after
their decision is retracted, so a late reply still resolves and is
reported as unapplicable; the counter never goes back. The page and
the chat both read the register, so they show the same number (18).

### 5.3 Decision catalogue

| kind | group | created by entering | retracted by leaving on | answers |
|---|---|---|---|---|
| `intent-proposed` | approve | `intent.proposed` (curation's join, or a session's finding that fits no intent) | yes → open; drop; split | yes · drop · split |
| `elaboration-proposed` | approve | `elaboration.proposed` (a finding on the thread; new material on an open intent; curation's gathering over several intents; dictation never) — folded into the intent's decision while the intent is proposed; its document is reviewed on the review surface; shows every intent it covers (188) | yes → approved; drop; `type <name>`, `pick <intents>` and `<intent>: drop` keep it | yes · drop · type · pick · `<intent>: drop` |
| `proposal` | approve | `proposal.proposed`: planning's one document per run, the bolts it proposes and the units in each (172); reviewed on the review surface and an annotation there is the response (17) | yes → approved, and every unit in `in-proposal` follows; redo → withdrawn; later → deferred; planning's next run → superseded, silently (35); a per-unit answer (`<unit>: bolt`, `new bolt`, `rename`, `type`, `drop`) is forwarded to the unit and keeps it | yes · redo: · later · `<unit>: bolt` · `<unit>: new bolt` · `<unit>: rename` · `<unit>: type` · `<unit>: drop` |
| `unit-proposed` | approve | `unit.proposed` (a finding routed to a bolt, a chore offer); chores fold by bolt; its document is reviewed on the review surface and an annotation there is the response (17) | yes → approved (creates the bolt if new, then the items); drop; redo → withdrawn; later → deferred; a moved claim → superseded, silently (35); bolt/new bolt/rename/type/pick keep it | yes · drop · redo: · bolt · new bolt · rename · type · pick · later |
| `unit-claim-moved` | decide | `unit.claim-moved`: an approved, unstarted unit whose cited claim moved (35) | redo → withdrawn; keep → approved with the version pinned | redo · keep |
| `bolt-close` | approve | `bolt.open[close].offered` when every unit is merged, no chore outstanding, no hold since the last merge | yes → landing; hold → held; new work → not-offered | yes · hold |
| `intent-close` | decide | `intent.open[close].offered` when every elaboration is done | close → archiving; keep open → declined; new work → not-offered | close · keep open |
| `idle` | decide | `standing.idle-offered` (idle 30m, or kept 7d ago); never for with-operator (25) | finish → ended; keep → session; activity → session | finish · keep |
| `claim-moved` | decide | `bolt.open[citations].moved` when a started unit's cited claim moved (103) | amend bolt / land and follow → current | amend bolt · land and follow |
| `land-failed` | decide | `bolt.land-failed`, `intent.archive-failed` | retry → landing; hold → open | retry · hold |
| `stalled` | decide | `work-item.stopped` (retry bound), `self-closing.stalled`, `line.conflict-stalled`, `place.conflict-stalled` | retry; drop / hold | retry · drop / hold |
| `question` | answer | `session.alive[activity].blocked` | the text → working, delivered to the same or a fresh session | `<text>` on the page or in chat |
| `host-gone` | attention | `host.gone` (no heartbeat 30m) | takeover → released; the host returns → alive | takeover · wait |
| `uncovered` | attention | `lease.uncovered`: no host's declaration covers the object (149) | a declaration covers it → free; ok → acknowledged | ok |
| `response-unapplicable` | attention | `response.unapplicable` (the decision was gone, or a dictation asserted work done) | reported once → reported | ok |
| `repository-proposed` | approve | `repository.proposed`: a create-or-adopt proposal with its map nodes and homes, from an elaboration's offer or a dictation; its document is reviewed on the review surface (206) | yes → created on the git host, or registered when adopted; drop | yes · drop |
| `package-install` | approve | `package.added`: a package chosen on the setup surface, its configuration collected against its schema and its secrets named in the same flow (228, 229) | yes → installing, as effects with proofs; drop | yes · drop |
| `host-enrol` | approve | `host.proposed`: a host added from a host that exists, with its platform and its parts (230) | yes → the parts' secrets are placed and a one-time token issued; drop | yes · drop |
| `app-install` | attention | `flywheel.awaiting-app`: the instance's own GitHub App is not installed yet (204, 207) | installed → the instance proceeds | installed |
| `app-coverage` | attention | `repository.uncovered`: the App does not reach a repository the manifest names (207) | retry; drop | retry · drop |
| `package-secret` | attention | `package.needs-secret`: an install waiting on a secret only the operator can place (207, 229) | placed → installing | placed |
| `host-enrol-lapsed` | attention | `host.lapsed`: the enrolment token expired before the host used it (230) | reissue; drop | reissue · drop |
| `host-environment` | attention | `host.unsatisfied`: the host cannot satisfy a repository's environment declaration (238) | retry | retry |
| `host-refused` | attention | `host.refused`: the layout on disk differs from the profile's, so the host refused to start (205, 222) | repair → the repair the decision showed runs; retry | repair · retry |
| `service-failed` | attention | `service.failed`: a declared service the operator started exited (47) | start; stop | start · stop |

Twenty-five kinds in all, and `check.py` prints them with the states
that raise them, so a kind added to a machine and not to this table is
visible in one run.

The mockup's ten decisions are, in order: `intent-proposed`,
`unit-proposed` ×3 (the third folded chores), `bolt-close`,
`unit-proposed` (baseline batch), `intent-close`, `idle`, `claim-moved`,
`question`; its attention lines are `host-gone`, `uncovered` and
`response-unapplicable`.

### 5.4 What a decision shows

`shows:` names the evidence rendered under the decision: signal weight
(count, sources, span by event date) on an intent; type, target bolt,
dependencies and cited claims on a unit; idle time on a session. "What
a yes starts" on a unit decision is derived from the type file at its
version: the stage names in order, times the item count (`spec →
build ×2 → review → merge`). A decision with a `document:` (a unit or
elaboration proposal) carries a link that opens the document on the
review surface — plannotator for a document, lavish for a rich page —
and the operator's annotations there come back as the response on it
(17, 129).

### 5.5 Sinks, delivery and the tail

A `sink` machine exists per sink, and sinks are per member (236): each
member's page is a sink of their own, and each chat address on their
operators entry is a chat sink of their own, one per member per
address and none without an address (236a). A shared channel the
manifest names is a sink with one mark and no member, and a bell on a
named multiplexer surface is another. Each carries the decision
kinds routed to it (82), a cadence, and its **delivery mark**. It is
`due` when a decision routed to it was numbered after its mark, when
its cadence fired, or when the operator asked (`rail` in chat, a
reload). `deliver_rail` delivers the numbered decisions routed to the
sink and the tail since its mark, then advances the mark in the same
write. The chat carries one line per decision with its number and a
link to the page (18); the page shows the same numbers with the answers
as controls; the bell rings the named surface with the numbers. No
rendering is stored: the mark per sink is the only state (15), and the
tail — every object that entered a `tail:` state after the mark, from
the objects' own `entered_at` — is derived like the decisions (14,
S31). A construction host is silent because it is no sink; nothing the
machinery notices is visible only on the host that noticed it (82).

Exactly one presenter delivers to each sink: the holder of the sink's
lease, or the host the manifest pins (`presenter:`). A dispatcher
running outside every host — a process whose declaration takes no
object kinds and presents the chat — may be that presenter (148).

### 5.6 Responses

A response is an op-response record: an answer names a decision number
(`yes 413`, a button, a page choice, a plannotator annotation) and the
register resolves it to the object and the decision state; a dictation
names an object. The response is stored before anything follows (153);
the ✅ reaction, or the page's acknowledgement, is the operator's proof
(154). The reply grammar of the mockup is the union of the `answers`
lists. `yes all` is expanded by the presenter into one response per
approve decision it delivered, each with its own id (`<message
id>/<number>`). A response that arrives after its decision is gone is
handed back as `unapplicable` and shown once under attention, never
dropped (6, 129).

### 5.7 Dictation, the tool surface and the host's agent

The engine never parses command words out of free text. Every
operation the operator may invoke is a **tool** of the state store
with a schema naming its arguments by object id, and the page's
controls, the chat, the dispatch agent and the machinery's own
commands all call the same tools; no caller has an operation the
others lack (193). The catalogue is in `profiles/surfaces.yaml`:
`answer` (a decision by number), `capture`, `mark-intent`,
`propose-unit`, `propose-chore`, `ask`, `explore`, `open-session`, and
the undo-or-defer verbs of 4 — `drop`, `later`, `hold`, `release`,
`rename`, `finish`, `end`, `close`, `send-back`, `retire`, `takeover`,
`revive`, `take` — plus `start` and `stop` on a service, the pair 47
grants. A **dictation** is a tool the operator invoked outside a
decision (12): `mark-intent` writes an intent in `open` with its first
elaboration in `approved` and the response id as the approval that can
be pointed to (I1); `propose-unit` writes a unit in `approved` on the
bolt with the response as its `approval`; `propose-chore` a chore unit
in `approved`; `revive` clears a signal's move; `ask` is an `asks/`
record for planning; `open-session` the operator's own session (69);
`explore` an elaboration in `approved` covering the selected intents
as a with-operator or standing session (189). An undo-or-defer tool
takes the same transition the decision would have taken, with the same
`enter:` commands to sessions and places, and is recorded like any
response; a tool that would assert work was done does not exist, and a
response that arrives claiming one is `unapplicable` and reported (4).

Free text — typed on the page, sent in chat — goes to the **host's
agent**, never to a parser (194): the dispatch agent for chat, a model
running in the page's browser, or none at all when the operator used a
control. The host's agent reads and answers with the query tools on its
own, and every write it makes is a proposed tool call the operator
confirms: its **interpreter**, the function that turns text into a
proposed call, resolves the names against the live objects and proposes
the call, shown to the operator as what will be sent; the operator's
confirmation is the response, and only the confirmed call is recorded,
once (153). A message that asks for several things yields several
proposed calls, one card each, each confirmed and recorded on its own.
A name that resolves to nothing, or to more than one object, is asked
about, never guessed. The agent is a session of A.7 charged per message
and carrying nothing from one to the next (217a, 217b;
`profiles/surfaces.yaml` `host_agent`).
The numbered reply grammar — `yes 412`, `421: <text>` — stays as the
deterministic path because a decision number is unambiguous, and is
itself the `answer` tool. The page's one typed input is the palette,
in that same grammar: plain text is a capture with one signal of kind
ask, sent unparsed, with the intent mark still the operator's judgment
made with a control; a leading `/` names a command of the catalogue
above, filtered by the caller's permissions and rendered as a list
(193a, 293); a bare number is the reply grammar (19, 194;
`profiles/surfaces.yaml` `palette`). The instance's book is not a
surface of the page at all: it is a standalone read-only viewer served
beside it, built from the blueprints' shared line, which the page links
out to and never embeds (315, 316; `profiles/surfaces.yaml` `viewer`).

## 6. Planning

Planning is one machine per built repository (`machines/planning.yaml`,
`singleton: repository`). It is due when the repository's backlog
fingerprint differs from the one last planned against, or a unit came
back with notes. The fingerprint is a hash over: every standing claim
in scope with its version; every ledger cell of the repository; every
open bolt of the repository with its units' cited claim versions and
citation choices; every unconsumed ask naming the repository; pending
redo notes. So a claim becoming standing, a verdict recorded or fallen
stale, an ask, a redo, a moved claim or a claim-moved choice each move
the fingerprint and make planning due, and nothing else does (S11:
forty commits with no claim change move nothing).

The run: a place off the repository's shared line, one `planner`
session with a work order that lists the backlog (derived from the
ledger: every cell in scope not `satisfied` or `not-applicable`), the
as-built statements, and **every open bolt of the repository with its
units and their states**. The session delivers, through `flywheel exit
done`: verdicts (including `not-applicable`, each with the evidence it
was judged from), and one **proposal**: a document showing the bolts it
proposes, new or open, and the units in each, every unit with a type,
dependencies, cited claims, and its target bolt (172). `applying`
writes the verdicts to the ledger, the units in `in-proposal`, the
proposal in `proposed`, and the fingerprint, then returns to `current`.
The proposal is the one decision the run raises (`machines/proposal.yaml`);
a unit in `in-proposal` raises none and reads the proposal's state
through `unit.proposal`. On the proposal's yes every unit it names goes
to `approved`, creating its bolt when the target is still new — several
units naming the same new bolt make one — and its items. A per-unit
answer on the proposal (`<unit>: bolt <name>`, `new bolt`, `rename`,
`type`, `drop`) is forwarded to the unit as a response of its own
(`forward_answer`), so the unit's guards apply it exactly as they would
a finding's or a chore's, which are still proposed on their own as
`unit-proposed` (58, 60).

On a repository's first planning (`planning.ledger_empty`) every cell
in scope is judged once and the proposal is the baseline: one decision
by construction (S10). Chores may be among its units (64). A stale
cell is planned against once per fingerprint: a proposal already
standing for the same cell is cited by the session (the work order
lists open units) and not proposed again.

Planning's next run supersedes the standing proposal, and the units it
named with it, with no response and no tail entry: a proposal is not
work (35, 172). A unit proposed on its own whose cited claim moved goes
to `superseded` the same way.

The operator's answer on the proposal can rename a proposed bolt, route
a unit to another open bolt, or give it a new bolt; `create_bolt` runs
only on yes, and only when the target is still `new` (29, S27). No
order among bolts is stored: a bolt record has no predecessor field
and no guard reads another bolt (30).

## 7. Lines and places

### 7.1 Shape

`line` and `place` are templates run inside the objects that own them,
so both sides have the same shape (49):

| owner | line off | places off the line |
|---|---|---|
| bolt | the built repository's shared line | one per work item; the operator's own place, kept and refreshed |
| intent | the blueprints' shared line | one per elaboration; the place of the intent's own change directory |

Curation, planning, capture reading and the operator's own session run
a place directly off a shared line, with no line of their own: they
commit nothing to a line. Their deliverables are records written by the
machinery.

### 7.2 Keeping a line current

`line.take_due` holds: before the first place is made off the line
(the line's `current` state is entered by `create_line`, and `place`
guards on `line.contains_parent`); when the line is `landing`; when the
manifest's `take_cadence` cron for the repository has fired since
`last_take` (default `0 6 * * *`, S33); and when a dictation `take
<line>` stands. The take is `git merge --no-ff <parent>` in the owner's
own place, pushed with expected-old. A take that conflicts is aborted
whole; `seed_take_conflict` creates a **chore unit in `approved` on the
line** — parent the bolt or the intent, scope `bolt-line` or
`intent-line`, `approval` the cadence that fired the take or the
response that ordered it (52, I1) — and prepares its item's place off
the line with the conflicted take applied; its `chore-fixer` session
resolves it and the chore merges like any other; `line.conflict_job_done`
retries the take, three times, then `conflict-stalled` is a decision.

### 7.3 Keeping a place current

A place is proven current before its session starts: `place.ready`
requires `place.contains_line` (`git merge-base --is-ancestor <line
head> <place head>`), and `session.requested` is entered only from
`place.ready` (I16). After any sibling merges into the line the place
is `behind`; it is rebased only when `session.activity` is not
`working` and no one has typed in the pane within the presence window
(the guard's first transition holds `behind` otherwise); `tell_moved`
appends a `moved` entry to the session's thread and sends one message
before the session continues (S32). A rebase that conflicts is aborted
whole, seeded as a job on the thread and in the place, and the place's
own session resolves it; the rebase retries on its `done` exit; three
retries then a decision.

A work item's and an elaboration's place is a region beside `life`
(`work-item.place`, `elaboration.place`), entered when `life` reaches
`placing` and read back through `{region: {name: place.place.life, in:
[ready]}}`. It is not nested inside `placing`: a region nested in a
state ends when the state is left, and the owner must command the place
(`place: merging`, `place: removing`) from `merging`, `stopped` and the
dictation transitions long after `placing` is gone. The bolt's operator
place is a region for the same reason.

### 7.4 Merging and landing

An item whose type's last stage passed enters `archiving` first:
`archive_change` runs `openspec archive` in the item's place and
commits it there, so the change's specifications enter the standing set
with the item's merge and land with the bolt (section 9 givens); the
archive is the machinery's merge-time effect on the item, never a stage
of a type, and it is nothing for a type without a change directory
(chore). `merge_place` then runs one place at a time in the fixed order
(unit approval time, then item ordinal), via `place.merge_slot`. A place
whose line moved under it while it waited goes back to `behind` first.
An item's merge is a squash to one commit that names the item, unless
the manifest's `item_merge` for the repository says `merge`; a take is
always a merge commit; nothing on an open line is ever rewritten (179).
After the merge the bolt's operator place is reset to the new head
(44). Landing: `bolt.open → landing` on the operator's yes enters the
line's `landing`, which takes the parent once more and then branches
on `line.policy` (175). Direct: `land_line`, one merge commit into the
shared line pushed with expected-old. Pull-request: `open_request`
opens the request from the line and the line waits in `request-open`,
the bolt staying in `landing`, until `line.request` is `merged` or
`closed`; the repository's own merge setting lands it and the machinery
sets none (179). A failed gate or a closed request is `land-failed`, a
decision, and nothing is asked of any session until the response (40,
S33). A landed line goes to `removing` and is removed; the bolt's
`landed` transition enters the operator's place in `removing` as well.

### 7.5 Endpoints

A process started in a place, by a session or by the operator, belongs
to the place: `wt tether` ends it when the place is removed, and its
ports are hashed from the worktree by portless so two places on one
host never collide (45). How those ports are reached is the host
binding's router, never the machinery's (191): the machinery hands the
process `$PORT` and `$BIND` and asks the router in force for the URL —
`https://<place>.localhost` from portless on the operator's machine,
a tailnet name on a host in the operator's network, or the URL a
managed platform's ingress publishes. The place machine's `ready`
state records the endpoints the router names for the place into the
owner record (`record_endpoints`), and the page shows them beside the
bolt as links (46); publishing beyond the private network is never the
machinery's.

### 7.6 Removal, holds and strays

A place is removed by the machinery when the work it served is merged,
dropped or retired (55): `merged → removing` inside the place machine;
an owner's `enter: {place: removing}` when its work is dropped or
retired, or when the bolt lands or is dropped. `removing` runs
`remove_place` (`wt worktree remove`; tethered processes end with it)
until `place.absent`, and every removal is an effect with its own id,
reason and evidence. The operator may hold a place by dictation (`hold
place <owner>`); `removing` goes to `held` while `place.held` and back
when released. A place on a host that belongs to no live object — a
worktree left by a crash between the state write and the removal — is
found by the host machine's reconciliation (`host.stray_places`, from
`wt worktree list` against the listed objects) and removed by
`remove_stray_places`, one recorded effect per worktree, never while
the owner is held.

### 7.7 Services

A built repository declares its services — a dev server, a worker,
anything that listens — as data in `flywheel/services.yaml`, tracked,
the repository's own declaration (203): a name,
the command that starts it in a place, what it serves, and an optional
readiness command (47; the file is named and shown in
`profiles/host.yaml`). The bolt's `services` region reads the file at
the head of the operator's place the first time that place is `ready`
and runs `declare_services`: one `service` object per record, owned by
the bolt, in `stopped`; the region re-runs the effect whenever the
place's head gains a record, which is how a chore that adds a service
reaches the page (48). A session cannot declare a service: the file
changes only through a chore merged into the bolt's line.

A service's record is its intended state and the tethered process is
evidence. `stopped` means nothing under that name runs in the place: a
process found by the tether name is stopped, never adopted. `start`
enters `starting` and runs `start_service` — `wt tether` in the bolt's
place, bound to the worktree, with the port portless derives from the
place (45) — until the process is present; it is `running` once it
also serves, and `running` records the endpoint portless routes into
the service record so the page shows it beside the bolt as a link, with
its state and its start and stop controls (46). A process that exits,
or one that never serves within five minutes, is `failed`: a decision
under attention whose answers are `start` and `stop`. `stop` from any
live state runs `stop_service` and returns to `stopped`.

`start` and `stop` are the operator's dictations on a service — the one
pair 4's undo-or-defer rule does not cover, granted by 47. A session
starts or stops a service only through `flywheel service start|stop
<name>` in its place; the command resolves the place's line to its bolt
and writes an op-response naming `service/<bolt>/<name>` with the
session as `by`, the very record the dictation produces, so the
machine has one `{response: start}` guard and the record's `moved_by`
says who asked (48). The bolt's services are the bolt's place's: a
session that wants a server in its own place starts one under the
place's rule (45) and it is its own — tethered to that place, never
shown, gone with it. When the bolt's place is removed the tether ends
every service's process with the worktree (55) and each service goes
to `gone` on `service.place_present` false; a held place keeps its
services as they were.

### 7.8 What a session may not do

`prepare_place` installs `pre-push`, `reference-transaction` and
`pre-merge-commit` hooks that refuse and run `flywheel refuse`, and
Claude Code settings that deny `git branch|merge|push|worktree` and
`wt`. A refusal is a thread entry read as `session.refusals_pending`,
copied to the run record and reported to attention (S15). The session
commits in its place; the machinery does everything else (I12).

## 8. Claims, the ledger and as-built

### 8.1 Claims are OpenSpec requirement blocks

A claim is a requirement block in the blueprints' standing
specifications: `### Requirement: <name>` in
`openspec/specs/<capability>/spec.md`, with its `#### Scenario:` blocks
under it and, where it attaches to more than its capability, one
`Attaches:` line. Its name is `<capability>/<name>`. OpenSpec refuses a
requirement with no scenario, so "at least one scenario saying how one
would know it holds" is the format's own rule (97, 112).

The version is the content hash of the requirement block — its heading,
its prose and its scenarios, and not the attachment line. No hook and
no lock enforces "the version moves only when its text moves": it is
true by definition, because the version *is* the text. Nothing has to
be checked at commit time, so the blueprints carry no claims hook.

The chapter that explains a claim includes it by anchor,
`{{#claim providers/one-writer}}`, and the mdBook preprocessor renders
the requirement in place with its name, version and the scope derived
from its map attachments (200). The text lives in one place, the spec,
so the chapter cannot drift from it, which is what 97 asks for. A
construction session reads the chapter to know what the claim means and
the specification to know what it says (89); both are one source. The
standing specifications are what curation clusters against and what
planning reads (108): the tick reads `openspec/specs/` on the
blueprints' shared line directly, and the machinery writes nothing
beside it.

The claim's state is which tree holds the requirement: the intent's
delta only (`openspec/changes/<intent>/specs/<capability>/spec.md`,
under ADDED, MODIFIED or REMOVED), `proposed`; `openspec/specs/` on the
blueprints' shared line, `standing`; REMOVED and archived, `retired`.
The intent's landing archives the delta into the standing
specifications, and that is what makes the claims standing (49, 187,
S34). The `claim` machine writes nothing.

The same shape serves the other half. A unit is a change in its built
repository (37, 187), its delta carries the requirement the unit
builds with one `Claim: <capability>/<name>@<version>` line naming the
standing claim it serves, and the unit's landing archives it into that
repository's `openspec/specs/`. That standing set is the as-built:
every requirement in it names a claim and a version, and construction
never satisfies a claim it does not name (99). It is also what a
delivery system reads from git to generate and run its suite, and the
machinery writes no index beside it (181, 192). A requirement on the
construction side differs from one on the design side by its `Claim:`
line and nothing else.

Five facts of that shape are core (223a), and they are the five above:
a requirement block with a stable name and at least one scenario; a
change directory holding one delta per capability; an archive at
landing that merges the deltas into the standing specifications; the
content hash of the block as its version; and the `Claim:` line naming
the served claim on the built side. Every machine, atom and proof in
this model reads them — the `claim` machine's states are which tree
holds the requirement, `cell.verdict_claim_version` compares a hash to
a hash, `archive_intent` is what makes a claim standing — so an
instance that changed one would be running a different flywheel. The
format that carries the shape is OpenSpec, a given, and the claim
machine takes no format parameter: a second change or specification
format beside it is a non-goal.

What is extensible is what goes into a block: the schemas a deliverable
must satisfy, the instructions that shape what a session writes, and
the skills that produce it (88, 119, 120, 190). Those are files under
the instance's prefix in the blueprints, added or overridden like any
other extensible file (10.6, 10.7), and they are the whole surface an
instance needs over a claim.

### 8.2 The ledger

The ledger is `ledger/<repository>.rec` in the blueprints repository, one
record per cell, in every profile (section 3.4, 157). It lives with the
claims because a verdict names a claim version, which is the blueprints'
history, and because a claim in scope for two repositories has one
cell per repository side by side (105). A `ledger-cell` object
exists for every (standing claim, repository in scope) pair; `list`
derives the pairs from the blueprints' standing specifications and the
manifest, so a cell needs
no record until it is judged (a joining repository has every cell
`unjudged` with no file, 104). Scope resolves through the system
context map, which is the scope surface (198), bound to the model in
`models/context-map/`: the bounded contexts the blueprints describe in
domain-driven design's terms — contexts, the elements they name,
relationships between contexts typed by the fixed DDD patterns with
an upstream and a downstream where the pattern has one, and links
between elements; element kinds, link kinds and facets from a
vocabulary the flywheel ships and the flywheel extends in
`flywheel/map-vocabulary.yaml`; every id with a name as the book
writes it, the chapter that states it, and a status of settled,
candidate or open, an open one paired with a question; lanes, tiers,
runtimes and stores as tags or kinds, never structure. Two complete
YAML maps, `context-map/current.yaml` and `context-map/target.yaml`,
validated against the schema and the vocabulary on every commit and
versioned with the book (121). Every element names its home, the git
repository it is built in, or inherits its context's; an external
context homes nothing (199). A claim attaches to any id — context,
element, relationship or link — and the attachment lives with the
claim: the specification's capability is one attachment and the
requirement's `Attaches:` line holds any more (97, 105). Its scope is
the set of repositories
homing what it attaches to, both ends of a relationship or a link,
computed from the target map and never chosen (105, 200). A
repository's kinds and capabilities are derived from the elements it
homes by the table the schema fixes — kinds from their kinds,
capabilities from the contracts among them — and scope never reads
them, so a change to a tag, a kind, a facet, a derivation row or a
vocabulary moves no verdict; only a home change, a re-attachment or a
claim version does (the ledger invariant of this section). The manifest
entry carries only git details, and `flywheel map check` fails a home
naming no entry or an entry nothing homes. A repository joins the
fleet when the target map first homes something in it; its cells are
the claims attached to what it homes, all `unjudged`, and its first
planning's baseline is that set (104, 202). An element newly homed or
an attachment newly reaching a repository brings claims into its
scope — new cells `unjudged`, the fingerprint (which hashes the homed
elements and the attachments) moves, planning is due and its proposal
carries the newly unmet claims; one removed sends the affected cells
to `out-of-scope`, where the recorded verdict reads as not-applicable
and the cell is out of the backlog, returning to `judged` if scope
returns. A claim attached to nothing has an empty scope and is not
planned against (98). The map moves only through the tools (211):
`attach` and `detach` on a claim (`attach_claim`, `detach_claim`,
writing the requirement's `Attaches:` line, which is outside the hash,
so the version does not move for an attachment, 200), `set-home`,
`map-edit` (refused without a chapter ref), `set-status`, `capture`,
`mark-reviewed` and `add-repository`; a session moves it only in a
writeback that also writes the chapter, and the landing construction
session's writeback moves the current map for what it built. A
construction session's work order names the elements it builds, their
homes and the claims attached there (89, 211).

A verdict is written only by `record_verdict`, from a session's exit:
the planning session (every cell in scope on a first planning, stale
cells afterwards), a verify, review or fix stage whose deliverables
include `verdict` (the default type's verify, the chore type's fix,
when the unit names a claim), never by the machinery's own judgment
(100). The record
holds the claim version, the repository revision, the evidence paths,
the date and the session (`judged_by`).

Two of the inputs the judging session is handed are mechanical, and the
machinery reads them for it: whether the repository's standing
specifications hold a requirement naming this claim, and whether the
version that requirement names equals the claim's current version (99).
A naming requirement whose version matches, with its scenarios passing,
is strong evidence and is not the verdict; a verdict is still a
judgment made by an agent and stored with its inputs (100). The two
facts are read from the built repository's `openspec/specs/` at its
shared head, which is the as-built and needs no index beside it (192),
so they cost no session, and they are what makes a stale cell cheap to
spot: the claim's version moving
is the same comparison (101, 8.3).

### 8.3 Stale, and the decision that cannot be missed

`judged → stale` when `cell.verdict_claim_version ≠ cell.claim_version`,
the cited evidence is gone from the repository's shared head, or a
challenge move stands against the claim since the verdict was judged
(`cell.challenged`; 101, 116) — the one way a signal reaches a
repository's backlog without an intent, and it reaches every
repository holding a verdict of that claim. Forty commits that leave
the evidence in place change nothing (S11, I10). A stale cell is in the
backlog, the backlog is in planning's fingerprint (which also hashes
the standing challenges in scope), planning becomes due, its session
proposes citing the signal, and `unit.proposed` is a decision. Three
transitions, each a state read on every tick, none a message that can
be lost. `stale → judged` needs a verdict judged after the challenge.

A moved claim reaches the operator in three ways, by how far the citing
unit got (35, 103): a proposed unit is `superseded` silently and
planning's next proposal replaces it; an approved unit that has not
started enters `unit.claim-moved`, the `unit-claim-moved` decision
(`redo` withdraws it to planning, `keep` records a citation choice
pinning the version); a started unit is the bolt's affair:
`bolt.open[citations].moved`, the `claim-moved` decision (S9). Its
answer is recorded as a citation choice on the bolt; `amend` marks the
citing units `needs_amend`, which is in the fingerprint, so planning
proposes the amendment on the same bolt; `land and follow` leaves the
bolt on its version and the cell stale, so planning follows after the
landing. The machinery never rewrites construction (103).

### 8.4 As-built

As-built statements are files in the built repository
(`openspec/specs/**/spec.md` blocks carrying `serves: <claim>@<v>`),
written by build sessions under the default instruction (120).
`cell.evidence_present` reads them. A statement naming no standing
claim fails the repository's own `flywheel asbuilt check` gate (I9).

### 8.5 The unit that cites no claim

`unit.claims` may be empty (34a). A unit's proposal cites the standing
claims in scope it serves, which planning already holds in its order,
and cites none when none fits; it never proposes a claim of its own,
because claims are written on the design side (23, 97). Chores are
where this is the common case: instructions, citations, references and
housekeeping are chores by 61 and no claim will ever be written for
them.

Nothing downstream grows a special case for it. The unit's change is
written and landed like any other; it produces no as-built statement,
so `cell.evidence_present` has nothing to read; and no ledger cell
exists for it, because a cell is a (standing claim, repository in
scope) pair derived from the specifications and the map and never from
a unit (8.2). The verdict deliverable is dropped from expected for a
unit whose claims are empty, which is the rule `deliverables.yaml`
already carries. A chore that *does* cite a claim is the other half:
its landing makes that claim's cell due again, which is what 64 grants
and what makes citing worth anything.

The answer that some of that work wanted a claim after all is stored on
the unit, not on the ledger. `unit.claim_answer` is `none`, `captured`
or `declined`, written by `record_claim_answer` and by nothing else,
on the pattern of the not-applicable verdict: asked once, stored once,
never asked again (101, 317). No decision kind exists for it. Raising a
rail decision per landed chore would teach the operator to answer no
without reading, which is exactly how a claim that mattered gets lost.

The review view carries it instead (122, 10.6). `flywheel review`
derives the list the same way it derives everything else: the units
that landed since the operator's `reviewed` mark whose `claims` are
empty and whose `claim_answer` is `none`, under one question, is
anything here worth a claim. `captured` runs `record_claim_answer` with
the intent named, which attaches the unit's change to that intent as
material, where a claim is written by the normal path; `declined`
stores the answer and the unit is never listed again. Every unit in the
list has already landed, so nothing waits on the answer and the mark
moves whether or not any was given.

## 9. Signals and curation

Adapters write captures and signals as recutils files in the blueprints
repository under `flywheel/signals/` (section 3.4, 203): `flywheel capture meeting
<file>`, `flywheel capture discord <channel> <day>`, a folder watcher
on `~/captures`, and the Discord bot's `capture:` command for a
forwarded message. The capture key is the source event's identity
(`meeting/<date>/<name>`, `discord/<channel>/<day>`, `message/<id>`),
so a second import of the same transcript is the same file and writes
nothing (S22). The raw material stays outside git; the capture cites
it (111). Enumerating and writing captures is arithmetic and runs
unattended; reading a capture into signals is a `capture-reader`
session's judgment (`capture.reading`), except a forwarded single
message, whose one signal `ensure_signal` writes with no judgment
(S21, 115).

Curation is one machine per flywheel. It runs a `curator` session
when the unmoved count crosses the manifest's threshold or the cadence
fires; the work order lists the unmoved signals, the standing claims, and
the open intents. The session delivers one move per signal (attach,
challenge, join, answered, route, drop, each with a reason) and one
proposed intent per join cluster, with its proposed elaborations and
typed by the material. The curation session is a session like any
other (58–60): for a signal that argues with no claim it may offer a
chore or an ask through `flywheel offer`, `record_offers` makes the
proposed chore unit on the shared line or the ask record, and the
signal's move is `route`, naming that offer (116). Where one run proposes elaborations of one type on
several intents it may deliver them gathered, and `applying` writes
one proposed elaboration on the first intent named, its `covers`
naming all of them (`gather_elaborations`, 188); the other covered
intents read it through `intent.covered_by`. `applying` writes the
moves and the intents; the intents are decisions. A signal with a move is never re-judged; only the
operator's `revive <signal>` clears it (S24). Dropping a proposed intent
gives each cited signal a `drop <intent>` move (S23). A person writing
the same files by hand is curation too: the machine then finds nothing
unmoved. Weight is by event date from the signal records; the status
view counts unmoved signals by source and age (118).

The instance never batches signals: the threshold and cadence are the
manifest's, the batching is the session's job, and the machinery's
only reads of a signal are the count and the move.

## 10. Sessions, instructions and the work order

### 10.1 The session machine

`session` is a template run by every type, stage, curation, planning,
capture reading and the operator's own session. Its life is `requested
→ starting → alive → exited | lost | ended`. `starting` retries
`start_session` by the same deterministic name (`<owner id>/<stage or
type>/<attempt>`) until the pane is present; herdr refuses a second
pane by that name, so a slow start is slow and never doubled (S6).
`alive` has two regions: `activity` (`working`, `idle`, `blocked`,
`exited`) read from `herdr agent status` and the exit entry the
session's command wrote; `presence` (`unknown`, `gone`) read from the
pane. The machinery never sends anything to a session in `working`
(I5): the only writes toward a session are `deliver_answer` from
`blocked`, `tell_moved` from a place in `behind` whose session is idle,
and `end_session` from `ended`, which only the operator's response, a
type's rule or the retirement of the work reaches (I6, 74). A pane the
operator kills by hand is `lost`, never a response (4).

`lost` is final on the session, so its owner decides what follows: a
standing or with-operator type starts it again in the kept place, and a
stage sends its `sessions` state round again as a fresh attempt over
the item's place, which stands, with the stage's `attempt` counter and
so the session id one higher (`stage`, X8). The item never waits on a
join that can no longer be met. The new name is one the multiplexer
does not hold, so nothing runs twice, and a session of the set whose
pane is still present is not started again, because `start_session` is
proven by the pane. A host that takes over a lease reads the sessions
left behind the same way and starts attempt `n+1` (150, S13).

The pane and the agent are named by the session id, so `herdr agent
list` is a status view of its own; the layout around them is the
session binding's (`profiles/sessions.yaml` `layout:`): one
multiplexer session per role (174), one workspace per bolt and per
intent, one tab per unit and per elaboration, one pane per session, so
a stage's sessions running side by side (56) are split panes of one
tab, and the operator's own session is a workspace of its own.
`start_session` creates the workspace, tab and pane when absent, and
the host's reconciliation closes a tab or workspace whose object has
left every view (`remove_stale_layout`, 186, 196). Sessions never
message each other (197): a session speaks to the machinery only
through the tools, each call carrying the identity token
`start_session` issued and wrote into its work order, and the tool
server refuses a call whose token does not belong to the pane it came
from, so a session acts only in its own job (43, 89); the machinery
speaks to a session only through its thread, delivered by the
multiplexer (`deliver_answer`, `tell_moved`); a session the machinery
charges to plan or curate reads records and calls tools like any other
and addresses no session; the agent program's own messaging and the
multiplexer's are not used by any session (173).

### 10.2 Free reasoning and the fixed exits

Inside `alive.working` the agent is free. What reaches the machinery
is what the session reports through the command the machinery provides
(67): `flywheel exit done|blocked|stalled` with deliverables, a
question or a note; `flywheel offer finding|chore|signal <document>
--about <object>`; `flywheel note <text>`; and `flywheel refuse`, run by
the hooks. Each appends one entry to the session's thread through the
state store and does nothing else; the machinery decides what the
entry means (66). The exit entry is validated against the schema in
force; one that fails it is `invalid` and read as `stalled` with the
raw text recorded, so the set of exits the machinery can see is closed
by construction (65). A session is told, in its work order, that its
deliverables are files in its place, its documents live in the change
directory, and its reports go through the command; it is given no tool
that moves state. Offers are recorded the moment they appear and never
interrupt the session (58, 71).

### 10.3 Blocked

`blocked` is a `question` decision on the item, answerable on the page
or in chat; the operator need never open the pane (68). Only that
session stops; the item's siblings, the unit, the bolt and every other
object continue (S30). The answer is written to the item's thread, then
delivered to the same session if its pane is present, else a fresh
attempt starts with the answer at the top of its work order. `blocks`
bumps on the session record; the status view sums it by type and stage
(70).

### 10.4 Elaboration types and presence

`self-closing` finishes on `done` and stalls after two idle hours.
`standing` ignores `done`, restarts a lost process in the kept place,
and offers `idle` after thirty minutes (or seven days after a `keep`);
only the operator's `finish` ends it (26, S2). `with-operator` raises no
decision at all: the machinery never asks about it, restarts it if
lost, and ends it only on the dictation `end` (25). Present means a
human keystroke in the pane within the window the session binding
states — thirty minutes — and the machinery infers nothing more from
it: presence only holds a rebase off (7.3) and shows on the status
view.

### 10.5 The operator's own session

The `open-session` tool creates an `operator-session`: a place off the
blueprints' (or a named repository's) shared line with the machinery's read
tools and the tool surface in its work order, running the
`with-operator` type with the `operator-console` agent. It has no
intent, no thread and no decision; it ends on the `end` tool, its
place going with it unless held (69).

### 10.6 Instructions as data

Everything a session is given lives in the blueprints repository and is
versioned by it: `flywheel/schemas/<artifact>.md`,
`flywheel/instructions/<artifact>.md`, `flywheel/skills/<session
type>/SKILL.md`, `flywheel/types/units/<type>@<version>.yaml` and
`flywheel/types/elaborations/<type>@<version>.yaml` (the machine files
of `machines/unit-types/` and `machines/elaboration-types/` are what the
operator's files look like; the engine loads them from the blueprints at
the version the object recorded, through the registry of 10.7), and
the manifest. `prepare_place`
renders `.flywheel/work-order.md` from the closed inputs: the schema
instruction, the type skill, the work order proper (job, deliverables,
exit contract), the producer skill, schema and review surface in force
for each deliverable the type names (`profiles/deliverables.yaml`, its
version in the header; 190), and the artifacts of the change (the unit
document or the intent's change directory, the cited chapters, the
open bolts for planning). Nothing else is written into the place, and the place's
Claude Code settings deny reads outside it (89). Every input is named
with its version (the blueprints commit) in the work order's header.
`flywheel render-order <scenario>` renders the exact prompt with no
session (90, 124). Changing any of these is a chore on the blueprints
repository; hosts read the blueprints' shared line, so a change reaches
every host at its next fetch, and a session started before it carries
the older commit in its header (91, 123).

The default instructions ship in the blueprints repository template:
`instructions/design-conclusion.md` (write the chapter and the claim in
one commit; update the context map),
`instructions/claim-granularity.md` (write a claim at the granularity
of the destination — it survives a rewrite of the code, it has an
observer who would want to know if it stopped holding, and it is
judgeable from the repository alone; a statement naming a file, a
colour, a setting, a plugin or a step of a pipeline is not a claim, and
every claim costs a verdict per repository in scope forever),
`instructions/fundamentals.md` (every clause an invariant, numbered in
one sequence, naming no mechanism) and
`instructions/construction.md` (cite the standing claim in scope the
work serves, cite none when none fits, never propose a claim for the
work; name the claim in every as-built statement). The first three
reach every design type, the last every construction session (120).
The
context map is `context-map/current.yaml` and `target.yaml` with the
instance's `flywheel/map-vocabulary.yaml`, the scope surface (198,
section 8.2), rendered by the machinery into `flywheel/map/*.json` and
into the book, all versioned with the book; the review view is
`flywheel review` served at
`/review`: the chapters and map nodes changed since the operator's
last `reviewed` mark (a response on the rail object), with the previous
version beside each (S25, 122), and beneath them the units that landed
since the mark citing no claim, as one list under one question (317,
8.5).

### 10.7 The type registry

A unit type or an elaboration type is addressed as `name@version`, and
a version is a file: `flywheel/types/units/<name>@<version>.yaml` or
`flywheel/types/elaborations/<name>@<version>.yaml` in the blueprints, the
same shape as `machines/unit-types/` and `machines/elaboration-types/`
here. A type file is immutable once registered. The registry records
the content hash of every file at registration (`machines/registry.yaml`
in this model, written by `check.py --register`; `flywheel/registry.json`
under the machinery's prefix at an instance), and the check — `check.py` here, `flywheel types check` in the
blueprints' pre-commit hook and on every host at every fetch — fails a file
whose hash moved and two files declaring the same name and version. A
change to a type is a new file at a new version, never an edit (57,
123).

The registry is the union of two sets, validated as one:

- **the shipped types**, listed by `name@version` in the release set
  (208) and placed by the blueprints template: `chore@2`, `default@5`,
  `fast@3` and `self-closing@2`, `standing@2`, `with-operator@3`,
  `fundamentals@1`. The last writes the fundamentals part of the book
  and is shipped rather than added (224, 318): it is an extensible file
  like every other type, never core, composing only the `session`
  template and atoms the release already ships, so a release adds it
  with no code change and an instance overrides it like any other;
- **the instance's types**, the files under `flywheel/types/` in
  the blueprints the manifest lists; `persona-test@3` is one (S26). The
  manifest names the directories the registry reads and nothing more.

Every file carries `tier: extensible` and `kind: template`; every core
machine — the objects, the engine machines, `line`, `place`, `session`
and `stage` — carries `tier: core` and ships in the binary, and the
check fails a file whose tier does not match its directory. A core
machine names an extensible one only pinned (`name@N`) or as the one
listed exception, `with-operator`, the operator's own session's type
(69).

Resolution: `$unit.type@$unit.type_version` and `$type@$type_version`
read the object's record and load exactly that version; a bare name — a
`type <name>` response, a host's `unit_types` declaration, a manifest
default, the `with-operator` exception — resolves to the highest
registered version that is not retired. Approval records the version
resolved (57), and work in flight keeps it whatever is registered later:
a unit under `default@5` finishes under `default@5` after `default@6`
appears. A version is retired with `retired: true` in its file; no new
object starts under it, and the file is never deleted while any object
cites it — the check fails a registered version whose file is gone, and
a host refuses to load a state whose objects cite a version it cannot
read (79). Testing a new type is a new file at a new version referenced
by a scenario: the scenario's objects record it, the stand-in runs it
(93, 95), and `flywheel render-order` shows what its stages would ask a
session to write (124) — never an edit of the version in force.

## 11. Hosts and leases

A host is the binary with a name, a bound and a **declaration** from
the manifest: the object kinds, repositories and unit types it takes,
and the sinks it presents (149). A standing `flywheel host` process is
one way to run it and not the rule: the tick is invoked, and a clock, a
notification, an arriving capture and a chat event are all invokers of
the same tick (270). A standing host heartbeats once a minute; an
invoked host heartbeats once per tick, and its stale window is the due
time that tick wrote plus the profile's grace rather than a fixed five
minutes (292). The `host` machine reads the heartbeat against whichever
window applies: `alive`, then `stale` past it. What follows `stale` is
the record's `intermittent` — a laptop by default, a cloud or pool host
not. An intermittent host is `away`: shown with since-when, raising no
attention line, its leases standing and its sessions' idle clocks
paused, and it reaches `gone` only when a numbered decision or approved
work waits on it or at the 24h bound (150a). A host that is not
intermittent goes `gone` at 30 minutes, which is the `host-gone`
attention decision either way. `released` follows the operator's
`takeover` or 24 hours. While `alive` it reconciles its own disk: a stray place is
removed and recorded (7.6). The `lease` machine on each object reads
the holder and renewal: `held`, `stale` at 5 minutes (shown on the
status view; the holder may still renew and continue, S13), `expired`
at 24 hours or on the host's release, `free` when released, and
`uncovered` — an attention decision — when no host's declaration covers
the object, so nothing waits silently (149).

**Coexistence (96).** The declaration is also what lets the new
instance run beside the current one against the same flywheel. A
host takes a lease only on an object its declaration covers, so the two
run against disjoint sets of objects and neither can act on the
other's: the new machinery's scope is the kinds, repositories and unit
types its hosts declare, written down in the manifest and readable, and
an object no declaration covers raises the `uncovered` attention
decision rather than being taken by default (149). Nothing is shared
between the two but the git host and the repositories they read.

Which host acts on an object: the one holding its lease. A host takes
a lease only on an object its declaration covers, with a transition
that could fire and no holder, or an expired holder, by the profile's
compare-and-swap. It renews on every tick it acts and releases when the
object is quiescent (no transition could fire on any evidence and no
session of it runs here). Sessions run on the host holding their
owner's lease, within that host's bound; `item.slot_free` orders ready
items by ordinal across the host (S29). Nothing runs twice: the session
name is deterministic and the multiplexer refuses a duplicate; a
takeover starts attempt `n+1`, and the old host, on return, reads that
its lease was replaced, ends its own pane for that object, and reports
(S13). The takeover rule names the operator's response for work that
has a session behind it: a lease behind a live pane expires by the
`takeover` answer or the 24-hour bound, never by racing (150).

Sinks are objects like any other: their lease is the presenter's, and a
manifest pin restricts who may take it. A dispatcher is a host whose
declaration takes no object kind and presents the chat; it runs the
sink ticks and nothing else, outside every construction host (148).

A restart of the machinery reads everything again and reaches the same
configuration; a running session is evidence (`session.pane` present),
not memory, so it is still `alive` after the restart (S5, I7).

A host joins by one command and never by hand (205): `flywheel host
join` writes its record, and the host machine's `disk` region, beside
`life`, runs `unchecked → cloning → ready`: `clone_repositories`
clones the state, the blueprints and every tracked built repository bare
under the root the manifest names and checks out each shared line
once for the machinery's own merges, and `flywheel host doctor`
compares the root against the host binding's layout
(`profiles/host.yaml` `disk:`) — `<root>/<instance>/<repo>.git`,
`<root>/<instance>/<repo>/main`, bolt places under `bolts/`, session
places under `places/`, worktrees for places only. Until the region is
`ready` the host covers nothing (`lease.coverable`), and a root that
differs is `refused`: the host takes nothing, and the `host-refused`
decision under attention says the first path that differs and what
was expected; `retry` after the operator fixes it.

## 12. Answers to section 10

### 12.1 Which objects carry a machine, and how do the machines relate?

Twelve object kinds carry a machine (section 1.1): intent, elaboration,
bolt, unit, work-item, operator-session, claim, ledger-cell, capture,
signal, curation and planning; five engine objects (host, lease,
response, rail, sink); and seven templates (session, stage, line, place,
and the type families). Verdicts, moves, offers, as-built statements,
asks, decision numbers, delivery marks and instructions are attributes
or files (1.2). The machines relate by nesting (a state runs a
submachine, which lives on in the record and is commanded by `enter`),
orthogonal regions, and ownership (`parent`/`owns`, with `children` and
`parent` guards). Nothing else crosses objects (1.3).

### 12.2 Where does event-driven behavior meet reconciliation?

Nowhere inside the engine: the engine only reconciles. A session's life
is event-driven in the world (herdr starts, idles, exits; the session
runs `flywheel exit`), and the `session` machine reads that life as
evidence on every tick (`session.pane`, `session.activity`,
`session.exit`). Events drive reconciliation only by causing ticks
sooner: a herdr pane hook, a webhook, a Discord message, the exit
command each notify one object. A host that never receives an event
converges by the 60-second sweep (130). So the answer to "how does one
drive the other" is: events shorten the wait; evidence decides.

### 12.3 Where does an agent's free reasoning sit?

Inside `session.alive[activity].working`, in a place with a closed set
of inputs and no tool that moves state. Its exits are kept to the fixed
set by reading only the schema-validated entries its command wrote on
its thread; an invalid entry is `stalled` with the raw text; a refused
git operation is a logged refusal; anything else the agent does is
invisible to the machinery (10.2). The owner decides what an exit
means (`self-closing` finishes on done; `standing` and `with-operator`
ignore done; a stage judges by its join rule).

### 12.4 How is the rail derived, and what makes a decision impossible to miss?

Decisions are states with a `decision:` attribute; the rail is the fold
of every listed object's active decision states, numbered from the
register (5.1). A decision exists on every host on every tick while
the state is active and vanishes when it is left, so there is no
decision record to forget, duplicate or lose; a restart re-derives the
same decisions (I7). The register records only numbers, so a reply can
be attributed; the sinks record only marks, so the tail can be derived;
no rendering is stored (15).

### 12.5 What is the minimal set of stores?

Four on a self-managed host (3.1): the state store (tracker or state
repository), the blueprints repository, the built repositories, and the
multiplexer (evidence only). A hosted tier adds three that the control
plane holds between invocations and the binary reads through the
invocation contract, none of them a source of truth: the warm cache
object, one encrypted bundle of two sparse shallow clones downloaded
per tick and uploaded back, whose loss costs a clone (272); the page
projection object, the status view and the rail as data, which one page
request decrypts and returns (291); and the instance's queue, the
caller's retry buffer, which holds what an invoker enqueued and
decrypts nothing (271). The place's disk is not a store: a session
reports through the command. Section 3.2 names one source of truth per state and lists the
projections.

### 12.6 How does curation connect without the instance batching signals?

Adapters write signal files at any rate; the `curation` machine reads
two numbers (unmoved count, cadence) and runs one session whose job is
the batching; the session's exit delivers moves and proposed intents;
the machinery writes them (section 9). The instance never reads a
signal's content; a person writing the same files is curation too.

### 12.7 Where does the ledger live, who writes a verdict, and how does a stale verdict become a decision?

`flywheel/ledger/<repository>.rec` in the blueprints repository in every
profile (8.2, 203). A verdict is written by `record_verdict` from a planning, review
or test session's exit, never computed. Stale is a state of the cell
read every tick from the claim's version and the evidence's presence;
it moves planning's fingerprint; planning proposes; `unit.proposed` is
a decision (8.3). A moved citation is `superseded` on a proposal,
`unit-claim-moved` on an unstarted unit, and `claim-moved` on the bolt
once work started.

### 12.8 Which profile is built first, and what test proves a second conforms?

The git-only profile first: its state store is `gix` plus the `git`
binary, which the host binding already needs for lines and places, so
the first build has one external service (the git host) and the
conformance suite runs against a local bare repository with no network.
The tracker profile follows as a second implementation of the same
`StateStore` trait. The proof of conformance is `conformance/`: one
set of scenario files run by `flywheel scenario run --profile <name>`
with the session binding replaced by `sessions-stand-in.yaml` (93) —
against the stand-in state store, then against each real profile in
a sandbox (a temporary bare repository; a throwaway GitHub repository),
with the machine files byte-identical (`check.py` hashes them into the
run record). A profile is admitted when every scenario passes and
`check.py` finds its binding complete (`contract/binding.yaml`).

Two bindings beside the state store's are the host's to choose, and
neither moves a machine: the line-and-place effects may be recorded
rather than performed while no bolt can land (93a), and a host that
runs no agent may declare the operator as its session binding (93b).
A scenario whose assertion is about a real take, merge, rebase,
conflict or landing is not run against a recorded workspace, so the
suite a host admits under it is a subset the run record names.

### 12.9 Where is the line between an engine primitive and a domain atom?

Section 2.5. Engine: the guard algebra, region and submachine semantics,
proofs and effect ids, leases, ticks, decision derivation, the register,
the scenario runner. Domain: every `ev` and `do` name. A need that names
anything in the world is an atom; a need for a new way of combining
evidence is an engine change to `schema.json`. The engine crate has no
string from `atoms.yaml`, checked by grep.

### 12.10 Where does planning sit?

A machine per built repository, singleton (section 6). It is told the
backlog changed by its fingerprint over standing claims, ledger cells,
open bolts and their citations and choices, asks and redo notes; it sees
the open bolts because the fingerprint and the work order both list
them.

### 12.11 What is the cadence rule for a take, and what proves a place is current?

`line.take_due` = before the first place off the line, before landing,
the manifest's `take_cadence` cron per repository, and a dictated take
(7.2). A place is current when `git merge-base --is-ancestor <line
head> <place head>` holds; `place.ready` requires it, and a session is
requested only from `place.ready` (7.3, I16).

### 12.12 Are claims OpenSpec requirement blocks or fenced claim blocks?

OpenSpec requirement blocks (8.1). A claim is
`### Requirement: <name>` in `openspec/specs/<capability>/spec.md` of
the blueprints, with its scenarios under it; the chapter that explains
it includes it by anchor and the preprocessor renders it in place, so
the text has one home and cannot drift (97). The version is the hash of
the block, which needs no hook and no lock. The design side and the
construction side then speak one language: an intent's delta carries
proposed claims, a unit's delta carries the requirement it builds with
a `Claim:` line naming the standing claim it serves, and each landing
archives its delta into the standing specifications on its own side
(49, 99, 187).

The book carries a third layer above both, the fundamentals part (318).
It is a deliverable of its own — `fundamentals-part` in the binding,
store `book`, fed to the `fundamentals` elaboration type and to no
other — and it is a part of the book rather than a fourth artifact
beside the book, the claims and the map. Its unit is a clause: a
numbered sentence saying what must always hold, in language a person
judges, mechanism-free, written to the style of
`design/requirements-style.md`, which is the schema the type's session
validates itself against before it ends (25).

Clause numbers and claim names are two namespaces that meet by
inclusion and nowhere else. A clause is numbered in one sequence across
the part, and its number is a stable identifier: a new clause takes the
next free number, a clause that must be read beside an existing one
takes a lettered insert, and a clause is rewritten in place rather than
renumbered. A claim keeps its own name, `<capability>/<name>`, and its
own version, the hash of its block (8.1). Where a clause names
something a repository can be judged against, the claim that checks it
is included by anchor immediately after the clause,
`{{#claim state/derivable-after-restart}}`, and the preprocessor
renders it in place from the standing specifications exactly as it does
in any chapter (97, S92). Most clauses carry no claim: they constrain
how a model is built rather than a behaviour a repository could
satisfy, and a verdict against one would be a category error. A claim's
prose may say which clause it serves; nothing in the machinery reads
that sentence, and no field on the claim holds a clause number.

### 12.13 What is the layout of state in git, and what does a race look like?

One state repository per instance, one shared branch `main`, one
directory per object with `object.rec` and `thread.rec`, one commit per
state change; leases and heartbeats as single-commit branches replaced
with `--force-with-lease` (4.2). A race: two hosts commit on `main` from
the same base and push; the git host rejects the second as stale; the
loser fetches, rebases its one-file commit, and pushes again. Content
never conflicts while leases hold; a lease race is two pushes to
`lease/<id>` with expected-old zero, of which one is rejected, and the
loser reads the winner (S17, I15).

Three repositories, three owners (203, A.23): the state repository is
the machinery's alone and laid out as the profile says; the blueprints
repository is the instance's, the machinery writing only under
`flywheel/` and the intent's change directory it creates; a built
repository is its owners', the machinery writing only the units'
OpenSpec changes, the acceptance file and an untracked `.flywheel/`
per place. Anything else the machinery writes in a tracked tree is
the effect of a response.

### 12.14 How does the phone reply become a commit, and how is the status page served without a central process?

On a self-managed host the presenter of the sink the reply came
through — the dispatcher for the chat, the page sink's lease holder for
the page — commits `responses/<delivery id>.rec` and pushes; the ✅
reaction follows the push (4.2). The status page is `status.html`,
rebuilt by `render_status` whenever state moved and committed; any host
serves it and, with none running, it is read as a file of the branch
and says its as-of commit (S20). On a hosted tier the same reply
reaches the same record by another path: a write is a tool call
enqueued on the instance's queue, which decrypts nothing, and a
later tick applies it and records the response like any other (271,
291). The status view there is not a file but the page projection that
tick wrote under the instance's key, which one request decrypts and
returns, so the phone renders it from one request and holds no client
state a reload loses (291, 310). Either way the response is recorded
with the object it concerns, the decision it answers, who gave it and
when, before any work follows from it (153).

### 12.15 How is history kept from growing without bound?

Leases and heartbeats never touch `main` (single-commit branches,
unreachable old commits collected by the git host). The register is
pruned thirty days after a decision is retracted; the counter alone
grows. Verdicts are rewritten only when a claim's version moves. `main`
grows by one small commit per state change, on the order of a few
hundred a day, which git carries for years; history is the audit record
and is never rewritten (167). In the tracker profile the lease comment
is edited, not re-posted, and a decision issue is closed, not deleted.

### 12.16 What replaces the tracker's comment thread in git-only?

`objects/<kind>/<id>/thread.rec`, append-only, holding questions,
answers, notes, exits, offers, refusals, moved entries and responses.
A session leaves a note with `flywheel note`, which appends to its
thread through the same commit path; the status view shows the thread
under the object (144).

## 13. The Rust crate boundary

The boundary falls out of the model's three kinds of thing: the engine
(schema and tick), the atoms (names a profile binds), and the profiles
(bindings to real systems).

| crate | holds | depends on |
|---|---|---|
| `flywheel-engine` | the machine loader (`schema.json` as `serde` types), the guard evaluator, regions and submachines, the tick planner (`plan_tick(defs, snapshot) -> Vec<Transition>` — pure, no IO), decision derivation and the register, proofs and effect ids, the five engine machines | `serde`, `serde_yaml`, nothing else; no string from `atoms.yaml` |
| `flywheel-atoms` | the `Evidence` and `Effect` name registries generated from `atoms.yaml` at build time; the `StateStore` trait (`list`, `read`, `write_effect`, `lease`, `present`, `receive`, `notify`, `status`); the `World` trait (one method per host effect); the `Sessions` trait (one method per session effect, one per session evidence); the scenario file types | `flywheel-engine` |
| `flywheel-domain` | the machine files embedded with `include_dir`, the type catalogue loader (from the blueprints), the work order renderer, the OpenSpec specification parser and the requirement hash, the recutils reader and writer, the fingerprint | `flywheel-atoms` |
| `flywheel-world-host` | `World` over worktrunk (`wt`), portless, `git` and `gix`, OpenSpec; `profiles/host.yaml` is its specification | `flywheel-atoms` |
| `flywheel-sessions` | `Sessions` over herdr (`herdr agent`) and Claude Code, plus the `flywheel exit\|offer\|note\|refuse` subcommands that write through `StateStore::append`; `profiles/sessions.yaml` | `flywheel-atoms` |
| `flywheel-store-git` | `StateStore` over the state repository (`gix`, `git push --force-with-lease`); `profiles/git-only.yaml` | `flywheel-atoms` |
| `flywheel-store-tracker` | `StateStore` over GitHub (`octocrab`); `profiles/tracker.yaml` | `flywheel-atoms` |
| `flywheel-surface` | the sinks: the Discord bot (`serenity`), the pages (`axum`), the bell (`herdr`), the reply grammar, the review-surface launchers (plannotator, lavish); the page bundle and the tool server that answers a **request** under the caller's token — the binary's own catalogue of tools, over HTTP for the page and in the shape of the model context protocol for sessions, the interpreter and a member's own client (193, 291, 293); `profiles/surfaces.yaml`; profile-neutral because it writes responses through `StateStore::receive` | `flywheel-atoms` |
| `flywheel-scenario` | the stand-in state store (in-memory `StateStore` and `World`), the scripted `Sessions` stand-in (`profiles/sessions-stand-in.yaml`), the conformance runner, the trace renderer | `flywheel-engine`, `flywheel-atoms`, `flywheel-domain` |
| `flywheel` | the binary: `host` (the standing loop), `tick` and `request` (the two modes of the invocation contract, one instance per invocation, 297), `dispatch`, `scenario`, `capture`, `render-order`, `review`, `exit`, `offer`, `note`, `refuse` | all |

Nothing in a machine file, a scenario or a profile binding names Rust:
the same files would drive any engine that implements `schema.json`.
The one static binary per host is `flywheel` with both state stores
compiled in and chosen by the manifest's `profile`; `flywheel dispatch`
is the same binary run with a declaration that presents and takes
nothing. `flywheel tick` and `flywheel request` are that same binary
invoked by a control plane through the contract of 297, which provides
the instance, its tier, the tagged role session, the cache and
projection objects, the queue and the scratch budget, and takes back
the cache uploaded, the projection written, the rail delivered and the
run record. Nothing is compiled differently for a hosted host: it runs
the same bytes as a laptop and differs only in what its manifest binds
(299).

## 14. The scenarios, walked

Each walk names the states entered, the effects performed (by atom
name) and the decisions created (+) and retracted (−). Every walk is
also a scenario file in `conformance/scenarios/`; the added scenarios
X1–X8 and T1 there walk the requirements the numbered scenarios do not
reach (the operator's session, the three claim-moved paths, a take
conflict, presenters, uncovered objects, strays and holds, notification
routing, dictated undoing, the tracker's direct action).

**S1 — approve an elaboration from the phone.** `elaboration.proposed`
(+`elaboration-proposed`, numbered #n by the rail). Discord reply `yes
n` → response `discord/<id>` resolved through the register to
`elaboration/<id>/elaboration-proposed`; `{response: yes}` fires
`proposed → approved`, `applied_responses += id` (−decision). Next tick
`approved → placing` (`parent in open`), `place: absent → preparing`
(`prepare_place`) `→ ready`; `placing → working`;
`self-closing.session: requested → starting` (`start_session`) `→
alive`. A second delivery of the same reply has the same id and is in
`applied_responses`; no guard matches; nothing re-asks (I2). A restart
re-derives `working` from the record and the pane.

**S2 — a standing prototype goes idle.** `elaboration.working` runs
`standing`; `session.alive[activity]: working → idle`; after 30m
`standing.session → idle-offered` (+`idle`). No effect touched the pane:
the prototype keeps running under `wt tether`. Next morning the
decision stands with the same number; the operator opens the place and
the process is there (I6). `keep` → `session` with `kept_at`; `finish`
→ `finished` (`enter: session: ended`, `end_session`) → `done` →
`elaboration.writing-back` (`record_per_intent`, nothing to do for one
intent) → `finishing` (`merge_place`, `removing`, `remove_place`) →
`done` (tail).

**S3 — a chore.** A build session writes
`openspec/changes/status-writer/chores/agents-md.md` in its place and
runs `flywheel offer chore <path> --about AGENTS.md --scope bolt-line`,
which appends an offer entry to its thread; `session.working`
self-transition `record_offers` → `unit` of type `chore` in `proposed`
pointing at the document, `batch` = the bolt id (+`unit-proposed`,
folded with the bolt's other chores). The record holds the path, never
the text (62). The session finishes its own job. `yes n` → `approved`
with `approval` = the response id; `create_bolt` is proven absent by
the type (I8); `create_items` makes one item; `work-item: waiting →
ready → placing` (place off the bolt's line) `→ in-type` (`chore.fix`
stage, one `chore-fixer` session) `→ merging` (`merge_place`) `→
merged` (tail). No change directory: the type records
`needs_change_directory: false`, and the work order says so.

**S4 — a finding dropped.** `flywheel offer finding <path> --about
<intent>` → `record_offers` → `elaboration.proposed` on that intent
pointing at the finding document (+`elaboration-proposed`, "finding
from wi-418"). `drop` → `dropped` (−decision, tail). No place, no
session, no line was created: no effect ran before `approved` (5).

**S5 — restart mid-day.** The engine holds nothing. On start it lists,
reads and derives: every session in `alive` is proven by
`session.pane`; every place by git; every decision by the states; every
number by the register. Nothing is unnumbered and no sink is due, so
nothing is written (78, I7).

**S6 — a slow host.** `session.requested → starting` runs
`start_session` (`herdr agent start --name <id>`); each tick in
`starting` finds `session.pane` absent and repeats the effect by the
same name; herdr refuses a duplicate name, which is not an error. At
two minutes the pane is present → `alive`. One session; no report.

**S7 — close an intent.** Last elaboration `done` → `intent.open[close]:
not-offered → offered` (+`intent-close`). `close` → `open → archiving`
(`enter: line: landing`): `archive_intent` (`openspec archive`),
`line.landing`: `take_parent`, `land_line` (direct) → `landed` →
`removing` (`remove_line`) → `removed`; `archiving → closed` (tail).
Nothing else moved: no other object has a guard on the intent's close
except its claims, which read the shared line and become `standing`.

**S8 — twenty signals.** `flywheel capture meeting` writes one capture;
`capture.captured → reading` (place, `capture-reader` session) `→ read`
(`record_offers` writes 20 signal files). `curation.idle → running`
(count ≥ threshold) `→ applying`: `record_moves` (6 attach, 9 drop, 5
join), `propose_intents` (2 intents in `proposed`, one with
`challenges: [providers/one-writer@3]`). +2 `intent-proposed`
decisions showing weight; 0 per signal. Every signal has a move file.

**S9 — a claim's boundary is wrong.** Build session offers a finding on
its intent → `elaboration.proposed` → yes → a self-closing session
amends the chapter and the requirement (version 3 → 4) → intent close →
archive lands, claim `standing` at 4. The bolt's started unit cites
`@3`: `bolt.open[citations]: current → moved` (+`claim-moved`, one
decision with two answers). `amend bolt` → `record_citation_choice
(amend)` sets `needs_amend`; planning's fingerprint moves →
`planning.due → running → applying` proposes the amendment unit on the
same bolt (+`unit-proposed`). `land and follow` → the bolt lands on
`@3`; the cell is `stale`; planning proposes the follow-up. Nothing was
rebuilt without the response.

**S10 — a repository joins.** The manifest gains the repository; `list`
derives a `ledger-cell` per standing claim in scope, all `unjudged`;
`planning.fingerprint` differs from `none` → `running`; the session
judges every cell (`record_verdict` for each, including
`not-applicable`) and delivers the unsatisfied set as units with one
`batch` → one folded `unit-proposed` decision (mockup decision 6).
Cells in `judged.not-applicable` are never in the backlog again (I10).

**S11 — forty commits, no claim changed.** `cell.evidence_present` still
true, `cell.claim_version` unchanged → every cell stays `judged`; the
fingerprint is unchanged → planning stays `current`; no decision moved;
no sink is due.

**S12 — the status view from the phone.** Tracker: the Projects board
and `status.html`; git-only: `status.html` on `main`. Both list every
bolt, unit, session by state group with the lease holder and its
`alive/stale/gone`, as of the last write.

**S13 — two hosts, one loses power.** Host A holds the lease on
`work-item/x` and runs its session. Its heartbeat stops: `host: alive →
stale` (5m) `→ gone` (30m, +`host-gone` attention, routed to the chat
and the page). `lease: held → stale`. Host B's tick skips the object
(lease not free). The status view shows the build and A as stale. A
returns within 24h: heartbeat → `alive`, its lease renews → `held`, the
session is still `alive` by the pane; the build resumes on A. Or the
operator answers `takeover` — the response the takeover rule names for
session-backed work (150) → `expire_leases` → `lease.expired` → B takes
it by compare-and-swap and starts attempt 2; A on return reads it lost,
`end_session` on its own pane, reports. Never twice: B's attempt 2 is a
different session name, and A's attempt 1 is ended before A acts again.

**S14 — two send-backs then pass.** `work-item.in-type` runs
`default@5`: `verify` stage `sessions → sent-back` (verdict not-done,
`send_backs` 0 < 3) → `build` (bump 1) → `verify → sent-back` (1 < 3) →
`build` (bump 2) → `verify → passed` → `default.passed` →
`work-item.archiving` (`archive_change`, `openspec archive` committed
in the place) → `merging` (`merge_place`) → `merged`; `bolt.close: not-offered → offered` → yes →
`landing → landed` (`enter: place: removing`; the operator's place is
removed). The item's record has `send_backs: 2`, the thread has both
exits, and `item.retry_max` was 3.

**S15 — a session tries to create a line.** The `pre-push` and
`reference-transaction` hooks in the place refuse and run `flywheel
refuse`; `session.refusals_pending` → `record_refusals` + `report`
(attention line). The place was prepared by `prepare_place`, the
session committed in it, `merge_place` moved its commits to the line.
No ref of the repository was changed by the session.

**S16 — a dictated scenario.** `flywheel scenario dictate "<sentence>"`
starts a self-closing session with the scenario schema that writes
`conformance/scenarios/<name>.yaml`, including the `script` the
stand-in sessions play; `flywheel scenario run` executes it against
the stand-in state store with `sessions-stand-in.yaml` and writes
`<name>.trace.md`: the ticks, the guards read, the transitions, the
effects with ids, the decisions and numbers after each tick.

**S17 — two hosts take one unit.** Both push `lease/unit-x` with
expected-old zero; the git host accepts one. The loser's push is
rejected; it fetches, reads the holder, skips the object. One
`create_items`, one session.

**S18 — an hour offline.** The host's ticks continue on the objects it
holds; effects on the multiplexer and the place proceed; state writes
are local commits. It takes no lease, starts nothing new, delivers to
no sink. On reconnect: lease renewals pushed (accepted: still under
24h), then `main` commits rebased onto the fetched head (other hosts'
commits touched other objects) and pushed; the status page rebuilt.

**S19 — the operator edits a file by hand.** A commit on `main`
changes `objects/intent/x/object.rec` state to `closed`. Every host's
next fetch lists that file as changed and derives the response
`commit/<sha>` for the object. When the intent's active decision was
`intent-close`, the response is `close` and the machine runs its own
path (`archiving`, then `closed`). When no decision stood, the written
state is honoured as given: the engine reconciles the rest from it (an
intent written `closed` with a live line has its line's `landing` run
to completion) and reports the direct write once under attention. No
process had to be told: the fetch is the notify. A direct write that
asserts work done on an item is refused the same way a dictation is
(4).

**S20 — the page six hours after the last host stopped.** `status.html`
on `main` at the git host, headed "as of <commit> at <time>".

**S21 — a forwarded message.** Discord `capture: <forward>` → the bot
writes `flywheel/signals/captures/message-<id>.rec` with `raw` = the message
link; `capture.captured` self-transition `ensure_signal` writes one
signal; the capture stays `captured` until `signals_present` → `read`.
Nothing else: curation runs only on count or cadence.

**S22 — the same transcript twice.** Same capture key → same file →
the second import writes nothing; the capture is already `read`.

**S23 — drop a proposed intent.** `intent.proposed` → `drop` →
`drop_signals` writes `drop <intent>` moves for its five signals →
`dropped`. Next curation lists unmoved signals: none of the five.

**S24 — revive a signal.** The `revive` tool on the signal removes the
move file; `signal: dropped → unmoved`; the count moves; the next run
clusters it.

**S25 — a claim amended in one commit.** The default instruction makes
the session change the chapter, the requirement in
`openspec/specs/` and the context map — the claim's attachment, so its
scope derives (200) — in one commit. Nothing checks a lock: the version
is the hash of the requirement, so amending the text is the version
move.
`flywheel review` diffs `src/` and `context-map.json` from the last
`reviewed` response to the intent's landing and serves the changed
chapter and node with the previous version beside it.

**S26 — an operator-added type.** The operator commits
`flywheel/types/units/persona-test@3.yaml` (the file in
`machines/unit-types/persona-test@3.yaml`, registered by the pre-commit
check, 10.7); it layers `test` and `review` on `default@5`'s `spec`,
`build` and `verify`. A new unit of that type records `type_version: 3`; its item's `test` stage `resolving` reads
`stage.agents` by globbing `personas/*.md` in the place: three matches,
three `session` submachines by name `<item>/test/1/<persona>`; join
`all`; each exit's offers recorded; the set recorded on the item. In a
five-persona repository, five. A unit in flight under `default@5` reads
its own `type_version` and is untouched (57).

**S27 — one intent, two repositories.** The archive makes two claims
`standing`, in scope for `atlas` and `switchboard`; both planning
fingerprints move; two runs. `atlas`: two units, target `new:
atlas-retry-behaviour`; `switchboard`: one unit, target the open bolt
`plan-rows`. Responses: `rename retry` on #n → `rename_bolt` on the
proposal; `new bolt other` on #m → `route_unit`. `yes` on each — one
from chat, one as a plannotator annotation on the reviewed document
(17) → `create_bolt` where the target is new. No bolt record names
another.

**S28 — a three-week bolt.** The operator runs the system in the bolt's
place (`bolt[place]`, reset after each merge); the place's endpoints
are recorded and shown beside the bolt on the page (46). The
`propose-unit` tool on bolt plan-rows, proposed by the host's agent from
the operator's text and confirmed → a unit in `approved` with the
response as its `approval` → items → sessions. Next day a finding from a session on
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

**S30 — blocked.** Build session runs `flywheel exit blocked
--question "<text>"`, which appends the exit entry to its thread
through the state store → `session.working → blocked` (bump `blocks`,
`record_exit`, +`question` decision on the item, routed to the chat,
the page and the bell). The item's `stage` stays in `sessions`; its
siblings merge. The page answer → response → `blocked → working`,
`deliver_answer` (`herdr agent send`, the pane is present). The thread
holds the question and the answer; `blocks` on the session record is
summed by the status view. The operator never opened the pane (68).

**S31 — yes at 07:40, look at 16:00.** `yes 57` in chat: the response
names #57, the register resolves it, the unit's transition applies it;
the item runs `fast@3`'s one stage, `ff-apply`, archives its change and
merges; `bolt.close` is
offered and numbered afresh. At 16:00 the chat sink is due; its mark
is 07:40; `deliver_rail` lists the items' and the unit's `merged`
entries since then, and the only counted decision is `bolt-close`. #57
is never reused; no rendering was stored.

**S32 — side by side, then a rebase.** Units A and B in flight. A's
item merges (`merge_place`); B's place is `behind`; B's session is
`working`, so the guard holds `behind`. B goes idle → `rebase_place`;
conflict → `seed_conflict_job` (the job on B's thread, `herdr agent
send`); B's session resolves it, exits done → `conflict → behind`
(retry 1) → `rebase_place` succeeds → `ready` (`tell_moved`). B's stage
continues; on pass, `merging` → `merge_place` lands.

**S33 — cadence and a closed request.** Every morning `line.take_due`
by the cron → `taking` (`take_parent`) → `current`. Close → `landing`:
`take_parent` once more, then `line.policy` is pull-request →
`open_request` → `request-open`; the request is closed unmerged →
`line.request: closed` → `line.land-failed` → `bolt.land-failed`
(+`land-failed`, `landing_failure` on the record, delivered to the bell
as well as the chat and page). No session is requested. `retry` →
`landing` again, which reuses or reopens the request; `hold` → `open`.

**S34 — two elaborations, one archive.** Research (self-closing) exits
done → `elaboration.writing-back` → `finishing` (`enter: place:
merging`) → `merge_place` into the intent's line → `removing` →
`remove_place` → `done`. The
prototype's place is `behind` → rebased while idle → `ready`, kept
(`keep: by-type`). The intent's close offered; `close` → `archiving`:
`archive_intent`, the line takes the blueprints' shared line, lands
directly, is removed. The intent's delta is archived into
`openspec/specs/`, so the two requirements are on the shared line:
`claim.proposed → standing`.

## 15. Invariants

| invariant | held by |
|---|---|
| I1 | no effect before `approved`; `approved` is entered only by a response or a dictation, or (a take-conflict chore) by the cadence the operator set, each named in the unit's `approval` field |
| I2 | `applied_responses` written in the same atomic write as the state change; response id = delivery id |
| I3 | a decision is a state; `check.py` lists one creating state per kind; leaving it retracts |
| I4 | section 3.2, one source per state; projections rewritten from the source |
| I5 | no effect targets a session in `working`; `rebase_place` and `tell_moved` guard on idle and on no keystroke |
| I6 | `session.ended` is entered only by `enter: session: ended` from `standing.finished`, `with-operator.finished`, or the retirement of the work by the operator's dictation; a pane killed by hand is `lost`, not a response |
| I7 | the engine holds nothing between ticks; S5 |
| I8 | `create_bolt`'s proof is read false for a chore by the type; the chore type has no bolt target |
| I9 | `flywheel asbuilt check` gate in the built repository |
| I10 | `ledger-cell.judged` leaves only on version move or evidence gone |
| I11 | one lease per object by compare-and-swap, within the host's declaration; the status view shows the holder |
| I12 | hooks and settings in the place; every line and place effect, including removal, is a machinery atom |
| I13 | `check.py`: atoms are abstract; only `profiles/` name a tool |
| I14 | git-only: the host's disk holds fetched state and local commits about to be pushed; panes, heads, gates and worktree listings are re-observed each tick and after a restart; the place's disk is work, not state |
| I15 | git-only: `--force-with-lease` on lease branches; expected-old on `main` |
| I16 | `place.ready` requires `contains_line`; `session.requested` only from `ready`; `behind` holds while `working` or while the operator types |

## 16. The diagrams

One per machine family, in the house style, each validated by
`check.py` against the machines through its `data-state`,
`data-decision` and `data-effect` attributes. Amber pills are rail
decisions; a decision is created on entering the state under the pill
and retracted by the response that leaves it. Red solid edges write
the ledger; red dotted edges read it.

![Design side](diagrams/flywheel-design-side.svg)

Intent, elaboration, the three elaboration types, the session, and the
intent's line and places. The archive diamond is where the intent's
line lands on the blueprints' shared line and the delta it archives
makes its claims standing; the ledger reads that version and a cell falls stale. Four
decisions are on this picture: `intent-proposed`, `intent-close`,
`elaboration-proposed`, `idle`, plus `question` on the session. The
picture does not show the `material` region of an open intent, which
joins new signals and findings to the one proposed elaboration, nor
the operator's own session, which runs the with-operator type with no
thread; both are in `machines/`.

![Construction side](diagrams/flywheel-construction-side.svg)

Bolt, unit, work item, the type and stage templates, and the session
as construction sees it. The verify stage — the review stage, in a type
that adds one — writes the ledger from its verdict deliverable, and the
item archives its change before it merges; the bolt's citation region reads the ledger and
the claim version and raises `claim-moved`. Six decisions are here:
`claim-moved`, `bolt-close`, `land-failed`, `unit-proposed`, `stalled`,
`question`. Not shown: the `deferred`, `superseded` and `claim-moved`
states a proposed or unstarted unit enters, the operator's place
machine inside the bolt, the endpoints it records, and the merge order
rule (unit approval time, then item ordinal), which section 7.4 states.

![Lines and places](diagrams/flywheel-lines-and-places.svg)

The two repositories with their shared line, a line each and places
off it, and the two templates beneath. The ledger is neither read nor
written by a line or a place; the shared line's head is where a
verdict's evidence is checked. Two `stalled` decisions are here, one
per template, after three conflict retries. The cadence rule and the
"first place, before landing" takes are stated in the band; the
`landing` state's pull request versus direct policy is the manifest's
per repository. Not shown: the `removing` and `held` states of a place
and the take-conflict chore, which sections 7.6 and 7.2 state.

![Backlog](diagrams/flywheel-backlog.svg)

Capture, signal, curation, claim, ledger cell and planning. The
fingerprint diamond is the one point where "the backlog changed" is
decided; every cell of the repository is in it, so a stale cell cannot
avoid a planning run and a `unit-proposed` decision. The ledger is
written only by `record_verdict` from a planning, review or test
session's exit. Two decisions: `intent-proposed` and `unit-proposed`.
Not shown: the `split` answer on an intent, the baseline fold, the
`redo` path back to planning, and the silent `superseded` replacement.

![Engine](diagrams/flywheel-engine.svg)

The tick as a numbered walk, the two profile bindings as cards, the
stores every profile shares, and the engine machines. The ledger is
one of the stores read at step 3 and is written only through an
effect at step 5 whose proof is a verdict record. The rail lane shows
the register numbering decisions and a sink delivering them; the
response lane shows a reply resolved by number. Two decisions:
`response-unapplicable` and `host-gone`. Not shown: the `uncovered`
decision of a lease, the 60-second sweep's interaction with leases (a
host renews only the leases of objects it ticked), and the dispatcher
as a presenter outside every host, all in sections 5.5 and 11.

## 17. Agent kinds, the pull-request landing, and operation

**A.17 — sessions charged by the machinery.** Every session is the
same template (`machines/session.yaml`) whoever charged it: a stage of
an approved unit, an elaboration type, curation, planning, capture
reading or the fix of a take conflict. The engine runs no agent; it
runs `start_session` and reads the pane, the exit entry and the place
(171). The template takes a `kind` beside the agent name — `claude`,
`codex` or `opencode`, default `claude` — and a stage's agent entry
may carry one (173); the session binding's `kinds:` map gives each
kind its start command, every kind started through the same `herdr
agent start` in a prepared place with the same rendered work order,
and the git hooks in the place are what refuse a line operation, so
nothing depends on one program's own settings. Which multiplexer
session a pane opens in is the binding's `multiplexer_sessions:`
(174): `flywheel-<instance>-intents` for elaboration sessions and the
operator's own, `flywheel-<instance>-bolts` for the stage sessions of
approved units, `flywheel-<instance>-machinery` for what the machinery
charges, overridable per host by kind or by repository, created when
absent. Planning's run delivers one `proposal` object (section 6),
which is the one decision it raises (172). Every pane and agent is
named by its session id in a layout the session binding ships: a
workspace per bolt and per intent, a tab per unit and per elaboration,
a pane per session, created when absent and closed when the object
leaves every view (196, section 10.1). Sessions never message each
other: tools in, thread out, each call carrying the identity issued
at start (197).

**A.18 — landing, pull requests and merge-back.** The line's `landing`
branches on `line.policy` (7.4): direct is `land_line`, one merge
commit; pull-request is `open_request` and the `request-open` state,
where the line waits while `line.request` is open and the bolt stays
in `landing` (175). While it waits, a review that asks for a change or
a failed check is `line.request_review_pending`, and
`seed_request_finding` records it as a proposed chore unit on the bolt
pointing at the review; accepted, the chore's session works a place
off the bolt line, `merge_place` moves the line, and the request
follows the line (176). The request's links are `line.request_links`,
read by the git host binding and shown under the bolt's decisions;
the machinery creates none of them (177). Conversation on the request
reaches the instance only as captures an adapter writes, and so only
through curation (178). History on an open line is never rewritten:
takes are merge commits, an item's merge is a squash naming the item
unless the manifest says `item_merge: merge`, a place is rebased only
while no session works in it, and the landing's shape is the
repository's own (179). A conflicting take is the chore of 7.2, retried
after each chore merges up to three times and then the `stalled`
decision (retry, hold); merge against rebase is never the operator's
question (180).

**A.19 — operation.** Nothing in `machines/` runs after a bolt lands:
releases, environments and runs are the delivery system's. What comes
back is a signal an adapter captures (106) or a link the git host
binding reads (177); what goes out is the book, the standing
specifications and the ledger, files on the blueprints' shared line any system can read from
git (181). An anomaly, an incident or a review raised in operation is a
signal, curation's move decides whether it joins an intent, and
planning may route it as a unit or a chore on an open bolt, or a chore
on the shared line when no bolt is open, which `propose_units` does for
any ask or signal it consumes (60, 182). A signal that challenges a
standing claim stales that claim's verdict in every repository holding
one, so planning is due there and proposes citing the signal (101,
116). What a landing leaves for operation is one file: the line's
`landing` state, after the final take and before the policy's landing,
runs `write_acceptance` on a bolt's line — `openspec/acceptance.yaml`
beside the as-built, the claims the bolt's units cite at their
versions with each claim's scenarios copied from the book — as one
commit that lands with the work, so any delivery system reads from
the shared line what the bolt claims to satisfy and how one would
know; generating and running a suite from it is the delivery system's,
and the machinery writes the file and nothing more (192). An intent's
line has no such file: `line.acceptance_written` is true there. A data
product is a repository in the manifest like any other. Operation is
therefore a profile binding — the adapters that capture and the
evidence that reads links — and not a machine (`gaps.md`).

**183 — every tool driven by written configuration.** The worktree
tool, the multiplexer and git are driven by explicit arguments and a
configuration the machinery writes from the manifest, never by the
tool's own configuration on the host or in the operator's home:
`profiles/host.yaml` renders each command in full and passes the
written file, so the same manifest on two hosts yields the same
commands and a host with a personal git config or a stray worktrunk
setting behaves like any other. Where a tool generates text — a commit
title, a merge message — it runs under that written configuration and
the result is recorded with the effect, so the run record shows what
was generated and under which configuration (183, 79).

**A.20 — intents as changes; gathered elaborations.** An intent is an
OpenSpec change in the blueprints (`open_intent`, `archive_intent`), and
its change directory is where its elaborations leave their records —
research notes, session records, prototype notes, an interactive page
— while what they conclude goes to the chapters and the requirement
deltas the landing archives (187). A bolt has no change in the blueprints; a unit's change is in its
built repository, written at the unit's first stage; a proposal's
document sits beside the proposal record in the state store, so the
unit record's `document` points there and never into a change
directory. An elaboration record carries `covers`, the intents it is
for, its parent first. Curation may deliver elaborations of one type
proposed in the same run on several intents as one gathering, and
`gather_elaborations` writes one proposed elaboration covering them;
the `elaboration-proposed` decision shows `covers`, and `pick
<intents>` or `<intent>: drop` narrows it (`set_covers`), the intent
left out having its material pending again (188). The other covered
intents see the gathering through `intent.covered_by` (none, proposed,
active, done): while it is proposed or active, `propose_elaboration`
holds on them, so none carries another elaboration awaiting approval
meanwhile (21, 189), and the intent's close is not offered; once it is
done, the close is offered as if a child had finished. The finish is
per covered intent: `working` reaches done → `writing-back`, where
`record_per_intent` commits what the session left under each other
covered intent's change directory onto that intent's line and takes
it out of the place; then `finishing` merges the place, carrying the
parent's records and the book once, into the parent's line (188). The
operator opens one with the `explore` tool, arguments the selected
intents and a type, which writes an elaboration in `approved` covering
them as a with-operator or standing session (189, 193); planning
proposes units, not
elaborations, so in this model gathering is curation's alone
(`gaps.md`).

**A.21 — deliverables and their producers.** A stage's and an
elaboration type's `deliverables` are entries `{name, producer,
schema, surface}`, passed through to the session template, which
records the names as `session.expected`. The shipped set lives in
`profiles/deliverables.yaml`, versioned as one thing: book chapter,
claim, context map, conceptual and logical diagrams in the house style
the schemas fix, proposal document, verdict — each with its producer
skill, its schema (88) and the surface that reviews it (17): the review
view of 122 for the book-side set, plannotator for the proposal
document, the ledger for a verdict. An entry's `default` resolves to
the manifest's `deliverables.<name>` override, else the shipped entry;
`by-type` is the stage's own type skill and schema instruction with no
review surface, which is what a construction stage's commits, spec and
review verdict use. `prepare_place` resolves every entry at the blueprints
commit named in the work order's header and writes the producers in
force into the place, so a session is handed them when it starts (89)
and a test can render them without one (124). A surface specification
is one deliverable of the set (212): the surfaces a design settles,
what each shows and never shows, the flows as numbered steps, the form
of each kind of object, the keys and modes, and the rulings with
reasons, a chapter citing the mockups it was drawn from as records in
the intent's change directory (187); a standing session — an
exploration, an interactive page — lists it among its deliverables,
a claim about a surface cites its statements, and a construction
session whose unit cites such a claim carries the specification in
force in its work order. Changing a producer,
shipped or overridden, is a chore on the blueprints, and the binding's
version in the header tells a session started before it from one
started after (123). The engine reads only names and paths; no
producer's text reaches it (119).

**A.22 — endpoints and routing.** The service machine gives a process
a port derived from its place and an address to bind, and records as
its endpoint whatever URL the host's router names; it knows no router
(191). `profiles/host.yaml` binds three under `router:`, chosen per
host in the manifest. `portless`, the operator's own machine: bind
127.0.0.1, the port from `portless port`, the endpoint
`https://<place>.localhost` as `portless list` names it. `tailnet`, a
host on the operator's private network: bind 127.0.0.1, the same port
derivation, and a name per service on the host — a path under the
host's tailnet hostname through `tailscale serve`, registered on
`start_service` and cleared on `stop_service`, or a hostname per
service through the host's own caddy driven by its admin API, holding
the tailnet certificate. `platform`, a managed host: bind 0.0.0.0 so
the platform's ingress reaches the port on every interface, the
endpoint read from the hostname or URL the platform hands the host.
`$PORT` and `$BIND` are the only things a declaration sees, so one
`flywheel/services.yaml` serves under every router; `service.endpoint`
and `place.endpoints_served` read through the router in force. What
bounds what a host serves depends on the host. On a self-managed host
the operator's private network is that bound, and the machinery
publishes nothing wider under either router there. A hosted host has no
private network: its page and its tool server are served at the tier's
own name, and the identity token is the boundary instead — checked for
membership of the instance named in the path and for the permission
the tool declares before any response exists (46, 191, 249, 291,
217c). Under both, publishing a place's endpoint past that boundary is
the operator's choice and never the machinery's (46). A reverse proxy inside the
flywheel binary would be a fourth router, not a requirement
(`gaps.md`).

**A.23 — where files live.** Three repositories, three owners (203).
The state repository is the machinery's: nothing a person or a session
writes lives there, and its layout is the profile's (4.2, 12.13). The
blueprints repository is the instance's: the book, the standing
specifications, the context map, the manifest, the OpenSpec changes for intents and
the elaboration records inside them are written by people and sessions
under the book's own layout; the machinery writes only under
`flywheel/` — `flywheel/signals/` (captures, signals, moves),
`flywheel/ledger/`, `flywheel/map/` (the rendered maps) — and the
change directory `open_intent`
creates (`profiles/blueprints.yaml` `layout:`). A built repository is its
owners': code, and its declarations to the instance under `flywheel/`
— `services.yaml` (47), `commit-types.yaml` (185) — are theirs; the
machinery writes only the units' OpenSpec changes, the acceptance file
beside the as-built (192), and an untracked `.flywheel/` in each place
for the work order and handoff, excluded through `.git/info/exclude`
by `prepare_place`. Tracked flywheel-facing files sit under
`flywheel/` in any repository; untracked per-place files under
`.flywheel/`. The machinery never writes outside its prefix except as
the effect of a response, and raw material stays outside every
repository (111).

**A.24 — bootstrapping and repositories.** The `flywheel` object
(`machines/flywheel.yaml`) is the bootstrap: `flywheel init`
writes it in `absent` and the reconciler advances it like any object —
`create_blueprints` from the blueprints template (or adopting a blueprints repository
by adding what the template requires), `create_state` with the
profile's layout, `register_app` recording that the App's installation
is required (the secret is the operator's, placed at
`<root>/<instance>/app.pem` and never by an agent; `awaiting-app` is a
decision under attention until the git host shows the installation),
`register_host` for the first host, then `hosted`. Every step has a
proof, so a second init changes nothing and a half-finished bootstrap
finishes on the next tick (204). A `repository` object
(`machines/repository.yaml`) is how a built repository enters: an
elaboration's offer or the `create-repository` tool proposes it with
its map nodes and homes, the yes runs `create_repository` on the git
host from the built-repository template (nothing when adopted through
`adopt-repository`), `register_repository` writes the manifest entry,
the `flywheel/` declarations and the map nodes in one blueprints commit and
puts the repository's planning so the baseline run is due (104, 199,
202, 203, 206), and `covering` waits for the App's installation to list
it — `extend_installation` where the App may, else the `app-coverage`
decision (149, 207). A session in a place gets a short-lived
installation token scoped to its repository, minted by `prepare_place`
into the untracked `.flywheel/token` and written nowhere else; no host
or session uses a personal token (207). The blueprints template, the
built-repository template, the map schema, the derivation table and the
shipped skills and deliverables are one versioned set released with the
binary (`profiles/host.yaml` `templates:`); `create_blueprints` and
`create_repository` stamp the version they used, and upgrading a
repository's template is a chore (123, 208). The derivation table is
shipped data in that set: changing it re-derives kinds and
capabilities only and never moves or stales a verdict, since cells key
on claim version and repository and scope comes from attachments.

## 18. Ratified 213–231: views, the instrument, adapters, dispatch, instances, context, packages and setup

**172 — size estimates.** A unit record carries `estimate`, the
proposal's size in slot-days (one session slot for one day), and
`actual`, the slot-days its sessions occupied, summed from the session
records; the `unit-proposed` decision shows the estimate. At landing
`write_acceptance` writes both per unit into `openspec/acceptance.yaml`
beside the claims, so the actual sits with the as-built (99, 192) and
any system reads it from git. Planning's work order carries the actuals
by unit type from every acceptance file of the repository, and the
planner calibrates from them; no constant stands in (`profiles/context.yaml`
planning, ruling 5). The estimate is not a per-unit answer on the
proposal: the operator corrects one with `redo: <notes>`.

**213 — artifact views.** `render_status` also derives, for every
object, the OpenSpec artifacts behind it in a view fit to the artifact,
read from the repositories at the shared line at the status view's
as-of point and stored nowhere (`profiles/surfaces.yaml`
`artifact_views`): an intent its change directory with proposal,
records, deltas, design and archive state; a unit its change in the
built repository with ff · apply · verify · archive set against its
type's stages, its requirement blocks and its tasks with the item and
commit that did each; a claim its block with versions, attachments and
each verdict's evidence; a bolt its acceptance file; a work item its
commits, deliverables and report. An edit goes through the review
surface (17); the view has no control that writes.

**214 — the instrument.** A projection of the same read
(`profiles/surfaces.yaml` `instrument`): runway = the estimates over
approved, waiting and in-flight units, less slot-days already spent,
over the drain; drain = alive hosts' bounds at the calibrated rate,
the actual-to-estimate ratio from the acceptance files, 1 until
something lands; feed = what waits on the operator and would add
runway; pressure = approved-and-waiting against the bound; the
unattended streak from the newest response's `given_at` while work is
in flight, with what would end it and what ended the last; the reading
sentence in fixed order — drain is the limit, you are the limit, feed
it, primed; velocity from the acceptance files. The two backpressure
stages — inception, the feed; construction, the queue — are two numbers
shown as stages. No target, nothing stored, compact at rest on the
status view.

**215, 231 — adapters and the tick.** There is one kind of adapter, an
enumerator, and seven ship (`profiles/blueprints.yaml` `adapters`): chat
forward, meeting, webhook, pull request, issue tracker, folder, the
page's palette. Each runs by the tick of the host that declares
its source: `host.adapters_due` is a guard on the host machine's
`alive` state and `run_adapters` writes one keyed capture per source
event, twice being once (111), so a run missed while the host was down
is caught up by the next tick. The host is one long-lived process the
platform's launcher starts (`profiles/host.yaml` `launcher`); there is
no cron and no second process — every timed behaviour is a guard.
Triage of a source is charged on the host that declares it (217e); the
capture endpoint is dispatch's, for callers that cannot reach any
host's binary (216). An instance adds an adapter as a package.

**A.25 — dispatch.** The dispatch model (`models/dispatch/model.md`)
is the binding of 216–217k; its host is `{name: dispatcher, bound: 0,
kinds: [], presents: [chat]}` (section 11), a host of the `host`
machine that takes nothing and presents the chat, holding a lease only
on a sink. The rename of 194 runs through it: the host's agent reads
and answers with the query tools and proposes every write as a card;
its interpreter is the function inside it; the runner is `inproc`
everywhere (`profiles/sessions.yaml` `runners`). Nothing in
`machines/` names dispatch (C.1): the sink machine cites 216 and 217
because the presenter is its lease holder, the capture machine because
the endpoint writes its records.
Four properties follow from that and are worth naming, because a
reader looks for them here. Nothing addresses dispatch: no host,
session or loop calls it, it learns of state through the profile's
notify and its bounded fetch and through nothing else, and it reaches
the operator through the sink's own identity — the bot the manifest
names and the token the operator placed — never through a person's
account (217d, 130, 165, 166). Nothing is lost while it is down:
decisions are state and any host serves the page, replies wait in the
chat and are applied once by their delivery id when the presenter
returns, a caller of the endpoint retries under the same idempotent key
and writes nothing twice, a capture waits with its pointer, and the
sink's lease expires by the stated rule and never by racing (217f,
111, 137, 148, 150). Capture is decentralized: any adapter that can
read its source and push to the blueprints repository writes captures
through its own binary from any machine and never through dispatch, the
endpoint being for callers that cannot write git, and triage reads
every capture wherever it was written (217g, 114). And a capture's
pointer is reachable by whichever host reads it: the manifest names a
raw store per source, an adapter puts the raw material there before
writing the capture or the host holding it declares that it triages
that source, and a reader is never charged for a pointer it cannot
reach — the capture becomes an attention decision instead (217h, 149).

**A.26 — flywheels.** The `flywheel` machine is one object per
instance, and a host runs several: each has its own root
(`<root>/<instance>/`), state repository, blueprints, sinks, presenters and
register, and nothing crosses (218). The page shows one at a time and
`switch-flywheel` picks it. The name is the operator's and the
repositories are URLs (219). Init adopts what exists and creates what
does not, for the blueprints, the state and each tracked repository, and an
existing repository without the layout is an upgrade chore (220;
`create_blueprints`, `create_state`, `create_repository`). Removal is the
dictation `remove <instance>`: `hosted → removing → removed`, and
`retire_flywheel` ends every session, removes every place,
archives the state with its decision counter and leaves the git
repositories on disk (221). The host machine's `disk` region
reconciles every tick (222): `differs` is the `host-refused` attention
decision showing `host.layout_difference` and `host.layout_repair`;
`repair` runs `repair_layout` and only that; a place's worktree is the
one thing re-made without asking, by `prepare_place` from its line;
unreadable state is reported and never guessed; `lease.coverable`
reads the region, so the host covers nothing until it is `ready`
again.

**A.27 — machines, types and context.** 223–225 are the registry as
section 10.7 and `check.py` already keep it — tier in every file,
`name@version` files under `registry.yaml`, statecharts rendered by
`render.py` — and are cited on `atoms.yaml`, the one file every
machine depends on. 226 is `profiles/context.yaml`: one row per
session type the machinery may charge — curation, planning, capture
reading, the conflict fix, each elaboration type, the operator's
session, explore or gathered, each stage of each unit type, dispatch's
triage and the host's agent — with the schema instruction, the type
skill, the work order fields, the change's artifacts, the chapters and
claims, the map, the surface specification, the deliverables, the
identity and what it must never receive; `prepare_place` renders the
work order from the row and nothing else, and the session template
cites it. The 24 unstated points of `machines-and-context.md` section
5 are resolved in that file's `rulings:` — among them: chapters and
claims reach a built repository's place by copy under
`.flywheel/blueprints/`; skills are keyed by agent name; planning and
curation name their deliverables (planning@3, curation@4, capture@2
pass them); a session commits and never pushes; the fast type produces
no ledger verdict; a construction session gets no query tools; the
engine windows come from `flywheel.yaml` `engine:`; the verdict
deliverable is named `verdict`. 227 is `profiles/deliverables.yaml`
version 2: every entry names its `store` and the session types it
`feeds`, three entries are added for curation's moves and intent
proposals and the capture reader's signals, and a manifest-added
deliverable without store and feeds is refused at load.

**A.28 — packages and setup.** The `package` machine
(`machines/package.yaml`, owned by the instance): `added` raises
the one `package-install` decision — the only thing on the setup
surface that enters the count — its yes goes through
`checking-secrets`, where a declared secret not yet placed is the
`package-secret` attention decision (207), then `installing`
(`install_package`: fetch at the tag, check the set version, place
under the blueprints' prefix or the host's root, register the hash, start
what it runs), `installed` (configure with one response, disable,
remove), `disabled`, `removing → removed`. The index and the install
steps are in `profiles/host.yaml` `packages`; the surface's tools in
`surfaces.yaml`. Adding a host (230) is the host machine's `enrolment`
region: `add-host` provisions with the operator's own platform
credentials carried in the call and stored nowhere, and writes the
record in `proposed`; the `host-enrol` decision's yes runs
`place_secrets` for the chosen parts only and `issue_enrolment_token`;
`awaiting-join` ends with the host's first heartbeat, or lapses into
the `host-enrol-lapsed` attention decision after 24h; a host already
running the binary is adopted by the token alone. An existing host —
the first, registered by init — starts `enrolled`.

**232 — several hosts on one computer.** A host is `flywheel host
--name <id>`, and two on one computer are two processes with two roots
(`hosts.<host>.root`, default `~/flywheel/<host>`), two multiplexer
sessions (`flywheel-<instance>-<host>-<role>` when the manifest marks the
computer shared), two port ranges folded into the place-path hash, two
heartbeats and two lease holders; they share nothing but the git host
and are told apart by id alone (`profiles/host.yaml`
`several_on_one_computer`, `router.port_range`; `sessions.yaml`
`shared_computer`). The scenario binding's `host:` step starts, stops
(`lose`), disconnects and returns one by name
(`profiles/sessions-stand-in.yaml` `hosts`), so the scenarios walked in
section 14 that need a second host run on one laptop: S13 (a host
lost, takeover by rule), S17 (two hosts race for one unit), S18 (a
disconnected host finishing what it owns and reconciling), S29 (a
bound reached, on one host with a second beside it), and 218's several
instances, each host running its own set.

**233 — the account item.** One item on the page
(`profiles/surfaces.yaml` `account`): who and how signed in, the
instance shown with a switch to any other the host has a root for,
its settings as a form (`configure-flywheel`, one response per
save), its hosts and parts, its package store apart from any host's,
sign-out.
A page served on the operator's own computer signs in like any other,
through the host's identity kind, so the identity is the same there as
anywhere: there is no local-user case and no unauthenticated page (233,
243, 253). The page shows the identity that kind vouched for, and every
op-response it writes carries that identity as `given_by` (153). The
single exception is 253a. Until an instance lists more than one
operator, a self-managed host may serve the page on the operator's
private network with no sign-in: the one entry of the operators list is
the identity every response records as given by, the private network is
the boundary, and the host refuses to serve unsigned-in as soon as a
second operator is listed or the page is reached at any address but
that network's. The exception closes when the account item exists.
Authentication is the host's and authorization the instance's: one
identity kind per host, the same for every instance it serves, so
switching never changes the identity. Membership is the authored
`operators:` list on a self-managed host and the Application's
assignment on the account on a hosted tier (247); the
tool server refuses a call from an identity that is neither, before any
response exists, and records the refusal in the run record
(`surfaces.yaml` `tools.identity`), and the switcher shows such an
instance as not a member.

**234–237 — users and ownership.** An instance's operators are
identities of the host's kind (234, 243, A.32 below). On a self-managed
host the identity is the GitHub username the device flow issued and
membership is the authored operators list in the manifest. On a hosted
host the identity is the Frontegg user and membership is the assignment
of the flywheel Application on the account, the list
derived from the account at every fetch and rendered read-only, with
only the members' chat addresses authored (247). Authorship is the
GitHub username under both kinds — on a hosted host from the GitHub
social connection on the Frontegg user, and a user with no connection
may respond and may not be an author (246). A page served on the
operator's own computer signs in through that same kind, so the
identity is the same there as anywhere (234).
One board: every member reads the one register, so numbers and count
are the same; a retracted entry keeps `answered_by` and `answered_at`
from the response, every member's delivery shows them, and the tool
server refuses a second response to that number before any record
exists (235; `rail.yaml` v3, `surfaces.yaml` `members`). Sinks are per
member: the `sink` record carries `member`, and each member has one page
sink with a delivery mark of its own. Chat sinks are one per member per
chat address on their operators entry — a Discord user id, a Slack
member id, keyed by the member's identity — each presented by whichever
host runs that kind's package and holds the lease; a member with no
address has a page sink only, and adding or removing an address adds or
removes the sink in the same write as the list (236, 236a). A shared
channel is a sink with one mark and no member. On a self-managed host
the list is authored whole; on a hosted tier its identities are derived
and only the addresses are authored, so adding or removing a member is
an act on the account and never a commit (247, 255). A decision's owner is its object's record
`owner`, one member of the instance or nobody — a role authorizes
and never owns — set by planning's proposal,
by a type, or by the `assign <owner>` response the rail machine
applies through `assign_owner`, which refuses an argument that is not
an identity in `operators:` (237); `filter own` on a member's sink
narrows their rail and chat and nothing else.

**238–239 — environments.** A repository declares its environment in
`flywheel/environment.yaml` or by naming its devcontainer or devenv
file; the host binds a provider (`hosts.<host>.provider`: devenv,
devcontainer, nix, image), `prepare_place` activates it in the place
and records the declaration's hash and the provider as
`place.environment`, and every kind of agent is started through the
provider's shell (`sessions.yaml` `environment`). The host machine's
new `environment` region reads `host.environment_satisfied`: false is
the `host-environment` attention decision and `lease.coverable`
excludes that repository's objects on the host (238). A platform host
comes from an image `build_image` renders from the declarations,
tagged by their hash, repeatable; an image behind the declarations
shows on the hosts surface and is rebuilt by a chore (239).

**240–242 — host pools.** The `pool` machine (`machines/pool.yaml`,
owned by the instance, 241): its `image` region builds when
behind; its `hosts` region runs `provision_pool_host` while
`pool.demand` holds — approved work the pool covers waits behind every
covering host's bound and the instrument reads drain is the limit —
within `pool.bound` and `pool.cost_allows`, and `retire_pool_host` for
a host idle past `retire_after` holding nothing (242). A pool host
joins by an enrolment token like any added host (230), carries
`pool` on its record, is ephemeral — its places are re-made from their
lines elsewhere by the owner's place machine — and never needs the
operator's eye; the hosts surface shows the pool, its bound, its live
hosts and its image (240). The instrument's drain sums alive hosts'
bounds, pool hosts included, so a host added or retired shows as drain
changing (242).

**A.32 — identity (243–255).** A host binding with two kinds, bound
in `profiles/identity.yaml` and inherited by both profiles
(`hosts.<host>.identity`). `github`, for self-managed hosts: GitHub's
device flow, the GitHub username the identity, the manifest's authored
`operators:` list with each member's addresses the membership, every
listed operator holding every permission, flags at their defaults, no
environment and no sync, no provider to lose (243, 246–250, 253, 254).
`frontegg`, for the hosted tiers: Frontegg through its SDK with one
Application, hosted login with the served name registered once (244),
membership as the Application's assignment on the instance's
account — a top-level account or a sub-account of the hosted service's
— so `operators:` identities are derived and only addresses authored
(247), roles and permissions from the token checked per tool before
any response exists (248, 249, `identity.yaml` `permissions.by_tool`),
flags per account (250), definitions shipped with the set and synced
by the service's release alone (252), read-only degraded mode past a
token's expiry, unbounded (254), and identity administration as five
tools on the account item (255). The page on the operator's own
computer serves on a localhost port, any port, no proxy and no name
required; portless or a proxy is advice, never a requirement, and the
routers of `host.yaml` serve a place's services only (245). Sessions
act with the machinery's identity token and the App's installation
token, never a user credential (251). 247a: the upgrade to a hosted
tier creates the account, invites the same GitHub usernames and
carries the addresses over. 207a: a self-managed instance's own
App with the operator's key; the hosted service's App whose key never
leaves it, minting installation tokens for pool hosts (`host.yaml`
`app`). 205a: one address per host with the instance in the path,
the settings form editing the instance's keys and showing the
host's read-only (`host.yaml` `identity.address`, `surfaces.yaml`
`account.settings_form`).

**150a — intermittent hosts.** The host record carries `intermittent`
(a laptop by default, a platform or pool host not). Past the stale
window an intermittent host goes `away`, not `gone`: shown with
since-when and no attention line (`surfaces.yaml` `away`), its leases
standing in `stale`, its sessions reading as last reported with their
idle clocks paused (`sessions.yaml` `session.idle_since`), and `gone`
— the takeover decision — reached only when `host.work_waiting` holds
(a numbered decision on an object it holds, or approved work only it
covers) or at the 24h bound; its next heartbeat returns it to `alive`
with nothing to answer.

## 19. Ratified 256–295: tenancy, the hosted tiers, plans, model cost and the add-host offers

**A.33 — tenancy and encryption (256–267).** Everything a shared host
keeps between ticks is sealed under a key naming one instance
(`host.yaml` `tier.cache`, `tier.key`): the warm cache object, the
bodies queued behind the capture endpoint, every store holding the
instance's content. A store keyed per filesystem, volume, queue or
table is not the promise; the promise is one level in, at the object
(256). The key is unwrapped for the length of one tick and by the role
that runs it alone, so the plaintext data key exists in a process
evaluating that instance's rail and nowhere else (257). That role
is scoped to one instance by a session tag matched against the tag
on every key and object it opens, so one compromised credential reaches
one instance and no count of roles bounds the tenancy (259). The
match is written as the role's own policy over every key and object of
the account, the resource's instance tag equal to the session's, so
no key names a role and no role is added for an instance
(`host.yaml` `tier.tagging`). A key
the host cannot reach fails closed: no tick proceeds, one attention
line names the key and since when, running work is untouched, and
nothing is kept unencrypted as a fallback (260). The cache is a
projection whose loss costs a clone, so an instance idle past the
stated time keeps nothing warm (258, `host.yaml` `tier.cache`).

What the service holds and under which key is a stated fact of the tier
on the settings form, down to when the cache was last evicted (261,
`flywheel` machine). The shared host reads the manifest, the
register, the leases, the sink's mark and the machinery's prefix and
nothing else, the clone sparse to exactly that set and a read outside
it a refusal in the run record (262). Raw capture material is never
read on a host serving more than one instance, so triage that must
follow a pointer into the raw store runs on the operator's own machine
or on a pool host, while a capture whose whole content is in hand
carries no pointer and may be triaged in the tick that took it (263,
`capture` machine);
code is never on a shared host at all, cloned only onto a pool host
that serves one instance and dies with it (264, `pool` machine).
An instance may declare its state records written as envelopes
under its key, paths and commit metadata staying plaintext because
`list`, the count and the compare-and-swap read only those, with the
blueprints plaintext outside the machinery's prefix (265, 266). The key
has three homes — the operator's own hosts, a tagged key in the
service's account, a key in the customer's own cloud account behind a
role that trusts the service's issuer — and moving between them
re-wraps data keys and changes no history (267).

**A.34 — the hosted tiers (268–278, 290–293).** A host carries a tier, 0 to 3,
named by what exists on the service side: your computer, the cloud
agent, pools, your account (268, `host.yaml` `tier`). Tier 3 is two
shapes chosen in the management console — stores only, and stores and
compute (276, 276a). A tier is a
binding and never a second machinery. On tiers 1 to 3 the host is one
function per tier and each invocation is one instance's tick: it
assumes the tier's role under the instance's session tag, downloads
the warm cache, fetches, evaluates, pushes by compare-and-swap,
delivers the rail, uploads the cache, wipes its scratch and exits,
retaining nothing between invocations (269). The sandbox is reused
across instances, so retaining nothing is the tick's own act:
scratch wiped and the data key dropped before exit. A tick has a fixed
budget the placement states, fifteen minutes on the function placement,
and a short budget carries triage before it carries a reply. It runs a model: the interpreter,
one bounded call per message on the `inproc` runner, and the triage of
a self-contained capture whose whole content is already in the queue,
both bounded per tick with the remainder carried to the next (216,
217b, 217c, 217e); which of the two a tick runs at all, and at which
model class, is the plan's fact, and a plan that buys neither has its
free text interpreted in the page's browser and its self-contained
captures triaged in one daily batch at the sweep (294, 216a, 273, 281).
Two things never run in it, raw-material triage
(263) and every elaboration and construction session; those go to a
machine of the operator's own or to a pool host. It never holds code,
because its declaration takes no object kind, no repository and no unit
type (217), and a failure in one instance's tick ends that tick and
no other (218). Model access on a hosted tier is the service's, carried
by the tier role and metered into the rail, unless the instance
places a model key of its own, and the tier statement names which model
provider sees rail text and messages (261, 279, `host.yaml`
`tier.model`).

The tick is invoked and not looped (270): a clock, a notification, an
arriving capture and a chat event are all invokers of the same tick,
which is 231 read as *nothing but the tick keeps time* rather than *a
process stands*. Every invoker enqueues on the instance's queue and
the queue admits one tick of an instance at a time, the instance
naming the group it serializes, so the scheduler's target is the queue
and never the function; a request for the page is a read under the
caller's identity and no invoker at all. The capture endpoint on a
hosted tier is a managed queue per instance behind one stateless
receiver of the machinery's, which verifies the caller's signature,
answers the platform's liveness check, acknowledges inside the
platform's deadline and routes by workspace id to the instance's
queue, holding no key that decrypts and reading no queue; its grant on
the key is the encrypting one and the tagged session holds the
decrypting one. The queue behind it is the caller's retry buffer and
not state (271, `host.yaml` `tier.receiver`). The warm cache is one encrypted object per
instance holding a bundle of two sparse shallow clones, the state
repository and the blueprints restricted to the manifest, the claims
and the prefix, downloaded per tick and uploaded back (272).
Scheduling is one named one-shot entry per instance upserted at the
end of every tick with the due time the machines computed: an interim
tick replaces it, at most one exists, an entry that fires with nothing
due is one idempotent tick, and a daily sweep is the backstop; the set
of entries is a projection that ticking rebuilds (273). Notify is
primary and the poll the backstop, bounded per channel (274).

A pool host on a hosted tier is a microVM from the instance's
image with a container runtime inside it, no shared network required,
a stated maximum lifetime and a named fallback placement for longer
sessions; it is terminated at retire and never suspended, so its disk
goes with it (275, `host.yaml` `pool.hosted`). That disk is isolated per
host and destroyed at terminate under the platform's own encryption and
not under the instance's key; an instance whose tier statement
must name its own key on the disk binds its pool to the fallback
placement, a container task with a volume under the key. The image is
built on a pool host or the operator's own machine and never on a shared
host, because building it reads the repositories' environment
declarations, and its artifact is written under the instance's key
(238, 239, 275). Tier 3's first shape, stores only, is federation:
one role in the customer's own cloud account trusting the service's
issuer with the instance as subject, assumed per tick with a minted
token, the key, cache, queue and pool image living there, revocation by
deleting the role and no credential stored (276). The instance
registers the service's issuer as an identity provider in its account
and allows the role's session to be tagged, since a web-identity session
takes its tags only from the token it presents. The only standing grants
in that account are the role's trust and the key's grant to that role:
the wake from the instance's queue carries the instance's name
and nothing else, and the tick reads the queue itself under the assumed
role, so nothing of the service's stands with a decrypting grant
(`host.yaml` `tier.federation`). Tier 3's second shape, stores and
compute, moves the binary itself into that account: the deployer applies
the stack through the same granted role and stamps the binary's version,
and what stays on the service side is the control plane alone — a
registry of instance names, tier, health and counters; the deployer;
and the identity environment holding the redirect entry for the host's
served name (276a, 208, 243, 291, `host.yaml` `tier.dedicated`). The
chat application is still the service's, so rail lines still arrive from
one bot. Under that shape the console offers dedicated compute created
in the customer's own cloud account by the deployer, each option stated with
what it changes: the dispatcher invoked as a function or long-lived as a
container, on a container service or on an instance of the
instance's own, and pools on microVMs, container tasks or such
instances. A long-lived dispatcher holds the chat platform's gateway
socket, so free text in a channel is answered where an invoked function
must take a slash command; a pool host on an instance has no lifetime
ceiling, so 275's fallback placement is not needed. Tier 3 has a third
shape, which the console does not offer and marketing does not show: the
whole control plane installed in the customer's own accounts, which is
§20 (296–305, 304). Chat on the hosted
tiers may be the service's own Slack or Discord application scoped to
the instance's channel, carrying rail text and interactions and
nothing else, the record still naming who responded (277, `sink`
machine). On the invoked placement Discord free text is the string
option of the application's slash command, plain channel replies needing
a gateway socket nobody holds, while Slack free text arrives over the
events subscription and needs none; the receiver answers an interaction
with a deferred acknowledgement inside the platform's deadline and the
tick posts the real reply within the interaction token's window or as an
ordinary message (`host.yaml` `tier.chat`). An intermittent host keeps its place: the laptop is away, its
leases stand and its clocks pause, and the cloud agent keeps ticking
everything else (278, 150a).

**A.34 — the invoked placement's four additions (290–293).** The
receiver and the chat application are the two shared components of the
hosted tiers and the only two: each sees an inbound payload once, in
transit, keeps nothing, and is a stated fact of the tier, and no other
process of the service's is reached by more than one instance's
traffic (290, `host.yaml` `tier.receiver`). The page and the tool server
are served at the tier's name by the same function on request, under the
caller's token: the page a static bundle at that name, the tool server
the binary's own tool catalogue reached over HTTP with the identity
token by the page and over stdio or in-process, in the shape of the
model context protocol, by sessions and by the interpreter, the agent a
client of the tools and never their server. A request is never a tick
and neither downloads nor decrypts the warm cache. The page sink's
delivery is the tick writing one small page projection per instance
— the status view and the rail as data, carrying each member's page sink
and its mark — to an object under the instance's key (14, 148, 236,
256, `host.yaml` `tier.projection`, `sink` machine). A request names the
instance in its path, the server checks the caller's token for
membership of it, assumes the tier role tagged with it, decrypts that
one projection and returns it, so a request costs one small decrypt,
reaches neither the git host nor the bundle, and decrypts nothing of
another instance because the tag is the path's instance (205a,
247, 249, 259, 272). A write is a tool call enqueued on the
instance's queue, which decrypts nothing, and is captured and ticked
like any other (271). The instance switcher lists only the
instances the caller's token is assigned to. On a hosted host that
token is the boundary the private network is on a self-managed one (193,
243, 249, 291, `host.yaml` `tier.served`, 46, 191, 217c). The bundle is
held in an object store behind a content distribution at the served
name, which fronts the store for the bundle and the function for the
tool paths, uploaded at release so its version is the binary's; a
self-managed host embeds the same bundle and serves it itself (208,
291). That tool server is a remote server of the model context protocol
at the host's address, and its clients are the page, the chat
application, the interpreter, the sessions the machinery starts over
stdio or in-process, and a member's own client such as a coding agent on
their machine. Every client is checked by the same two rules, membership
admitting the identity and the tool's declared permission authorizing
the call; the authority a client signs in against is the host's identity
kind, so a member adds a self-managed host at its localhost address as
readily as a hosted one at its served name; the catalogue a client sees
is the tool catalogue filtered by that caller's permissions; and a call
from any client is a response recorded with who gave it and when (153,
243, 245, 248, 249, 293, `surfaces.yaml` `tools.identity`). An invoked
host is alive while its scheduler entry stands or its queue holds items:
it heartbeats once per tick, `host.last_seen` reads the later of that
heartbeat and the standing entry's due time and reads now while an item
is queued, so its stale window is the due time it wrote plus the
engine's grace and 150's takeover is raised for it only past that (292,
`record-derived.yaml` `host.last_seen`, `host.yaml` `tier.liveness`).
The invoked placement is a placement in its own right: the scheduler
gives it the clock, the interactions endpoint gives it the replies a
socket would carry, and the served name with an identity check gives it
the route (217i).

**A.35 — plans, presets, model cost and the add-host offers (279–284, 294, 295).** A plan is a named set of the
`fw.ff.*` entitlement features plus a few stated limits, held by the
identity provider and billed through the payment provider, read only
from the token and the SDK (279, `identity.yaml` `plans`). A
self-managed host has no rail and every flag stands at its definition
default. A plan hides and it meters and it never authorizes:
permissions come from roles and are checked on every tool call, and
exceeding a limit is one attention line and a refused add with the
reason, never a stopped loop (280). The ladder is five rungs over the
four tiers: Free at tier 0; Hobby at tier 1, cheap to run and needing no
model key of the operator's, its chat structured so no model call is
spent on it — answers as buttons, free text a slash command with its
arguments, the rail delivered at no model cost — its free text
interpreted in the page by the browser model instead and its
self-contained captures triaged in one daily batch at the sweep on the
small model class, with immediate triage and free text in chat unlocked
by placing a key of the operator's own, and raw-material triage,
elaboration and construction waiting for a machine of the operator's own
(216a, 217e, 273, 294); Pro adding
pools and the package store, and including the in-tick interpreter and the
immediate triage of self-contained captures; Team adding members, the
console and a job's model class raised above the small one; Enterprise at
tier 3 in both shapes, with enterprise sign-in, a dispatcher of its own
— in the service account under the first shape, in the instance's
own under the second — and audit export. What each unlocks is the requirement while the price is
not (281, `identity.yaml` `plans.ladder`). Limits are plan metadata and
not flags: instances, members, included pool hours, the largest
pool host, the captures the model budget covers and the model class the
in-tick jobs run at (282, 294, `plans.limits`).

Model cost is a plan fact of the same kind (294, `host.yaml`
`tier.model`). The instance's own model key is welcome on every
hosted rail and required on none, and an instance that places one is
metered on none of the service's usage. Each plan includes a budget on
the small model class for the jobs the dispatcher runs inside a tick,
reading a capture and answering a message, stated as a count of captures
and messages a month; usage past it is metered through the payment
provider like any other overage. The model class per job is the rail's
ceiling and the type's choice within it, small on Hobby and Pro and
raisable per unit type, per elaboration type and per stage on Team and
Enterprise (285, `stage.yaml`). A budget spent is one attention line and
a slower cadence and never a stopped loop, because the work still
happens in the page's browser or in the daily batch (280, 216a, 281).
The runners heading on a host's detail shows which model key that host
uses and the month's model spend beside the pool hours, and the tier
statement names which model provider sees rail text and messages (261).

What `+ host` offers at all is the host's identity kind and the rail
together (295, `host.yaml` `tier.add_offers`, `surfaces.yaml`
`hosts_surface.add_offers`). A `github` host offers only hosts the
operator controls — another computer of theirs, a virtual machine on
their own network, a container on a platform of their own with their own
credentials and secret store, and adopt-existing by token — and shows one
line offering to move the instance to the hosted service in place of
the managed options (230, 247a). A `frontegg` host offers those and the
managed ones beside them, each gated by its plan flag: the cloud agent
from Hobby, a pool from Pro, and the dedicated compute of tier 3's second
shape on Enterprise (276a, 279–282). An offer the rail does not unlock is
not shown, and the tool behind it is still guarded by its permission
(250, 280).

Adding a cloud agent asks nothing about routers or runners, because the
tier fixes both; one screen asks the chat platform, the meeting source
and the capture sources, with presets beside the selectors, and a
router or a runner is chosen only for a machine of the operator's own
or an adopted host under the advanced disclosure (283, `host.yaml`
`tier.add_form`). A preset is a package of the **bundle** kind, a named
set of parts with their configuration defaults installed under one
install decision for the set, running nothing itself and removing only
what it installed (284, `host.yaml` `packages.kinds`).

**A.36 — rulings carried over (285–289).** A unit type or an
elaboration type declares the model class each of its stages runs, so a
stage that reviews code may name a different class from the stage that
writes it; the runner's own model is the default where the type names
none, which makes 173's per-role model the fallback rather than the
rule (285, `stage` machine). A scenario pack is a development-time
instance package, hidden behind `fw.ff.scenario-packs` and never in
the production index (286). Packages contribute renderers, adapters,
sinks, runners, routers, types, deliverable producers, map
vocabularies, templates and bundles, and never a core surface: the
rail, the board, the dock and the console ship in the binary (287). The
binary carries its own instrumentation, writing captures about its
operation — stalls, refusals, runway readings — to the agentplot
instance's instance, carrying no instance content, on by
default on the hosted tiers and opt-in on a self-managed host (288,
`capture` machine). Code isolation is the guarantee the settings form's
tier statement names, and it is 264 restated as a promise the operator
can read (289).

## 20. Ratified 296–305: the control plane as a product

**Two products (296).** The **flywheel binary** is open source under a
permissive licence and is everything a self-managed operator runs: the
machines and the profiles, the page bundle with the rail console and the
management console, the tool server and its model context protocol
endpoint, the adapters, runners and routers, the definitions of
permissions, roles, features, flags and plans, and the command line
(191, 193, 215, 252, 291, 293). Nothing is held back from it to make a
hosted tier work, so tier 0 is the whole product with no service side
(268, 281). The **control plane** is commercial, source-available to
enterprise customers for self-hosting, and is everything on the service
side: the receiver, the per-tier dispatcher packaging with its roles and
tags, the queues, the scheduler, the cache and projection stores and
their keys, the page distribution, the registry, the deployer, the
identity environment and its sync, the plan and billing integration, the
pool image build and provisioning, and the shared chat applications
(239, 240, 243, 252, 256, 259, 269–277, 279, 282, 290, 291, 294, 276a).
Neither reimplements the other: the control plane evaluates no guard and
decides nothing. It invokes the binary and holds what the binary cannot
hold between invocations.

**The line is the invocation contract (297, 298), and it is public.** It
is documented in the open-source repository and versioned with the set
(208), and it is bound in `host.yaml` `tier.control_plane`. In **tick**
the control plane provides the instance and its tier, a role session
tagged with that instance, the warm cache and page projection
objects, the instance's queue with the messages on it, the standing
scheduler entry, the identity environment's issuer with the definitions
version it holds, a model credential or none, and a scratch directory
with the budget the placement states; the binary returns the cache
uploaded, the projection written, the rail delivered, the shared lines
pushed by compare-and-swap, each message acknowledged or left under its
idempotent key, one next due time or a deletion, the run record, and an
exit with the scratch wiped and the data key dropped (111, 162, 256,
259, 269, 272, 273, 291, 294). In **request** it provides the caller's
token, the instance named in the path, a role session tagged with
that same instance, the projection object and the definitions
version; the binary returns the bundle or the projection, a tool call
enqueued on the queue for a write, or a refusal with its reason and run
record (205a, 249, 270, 271, 291). Five shapes in that environment are
stated and are what a second control plane must match — the queue
message, the scheduler entry, the cache object, the projection object
and the identity token's claims — and the definitions version is the
sixth, which couples the two products in time (243, 248, 249, 250, 252,
271, 272, 273, 291).

**Anyone may build a control plane to it; ours is the reference (299).**
A self-managed host and a hosted host run the same binary bytes: nothing
is compiled differently and nothing is gated at build time, so a hosted
host differs from a laptop only in what its manifest binds — a tier, an
identity kind and a router (191, 217j, 243, `host.yaml`).

**The control plane is installable and customizable (300).** It ships as
one composition of applications and stacks — receiver, dispatcher,
scheduler, stores and keys, page, registry, deployer, identity sync,
billing, chat and pools — each holding one part of 296's list and taking
the tenancy choices as parameters: the tier roles and the tag key with
the policy that matches a resource's instance tag to the session's
(259), the key homes (267), and whether the queue, the cache, the
projection and the pool image live in the control plane's account or the
instance's (276). Installing it is bringing the composition into an
environment; customizing it is those parameters and never a fork
(`host.yaml` `tier.installed`).

Three things are the installer's own. The **identity environment** is
theirs — their environment with the flywheel Application in it, or any
provider that issues the token claims of 298, the named provider being
the reference implementation. This amends 252, which assumed one
environment and one release: the definitions still ship in the binary
and are still the one place they are defined, and each control plane's
own release syncs them into its own environment, by difference, under
that provider's write ceiling, deleting nothing not named as retired and
writing no hostname; a self-managed host still has no environment and
never syncs (301, `identity.yaml` `provider`, `sync`). **Billing** is
optional: where no payment provider is bound the plans of A.35 are
entitlement targets alone — still a named set of `fw.ff.*` features plus
stated limits, still hiding and metering and never authorizing — and the
billing stack is the one thing omitted (279, 280, 302, `identity.yaml`
`plans`). The **chat applications** are theirs, installed into the
workspaces they serve with their own ids, tokens and signing secrets;
the two shared components are still exactly two, each seeing a payload
once in transit and keeping nothing (277, 290, 303, `sink` machine,
`host.yaml` `tier.chat`).

**A self-hosted control plane is tier 3's third shape and Enterprise's
fourth flavour (304).** It is not shown in marketing and not offered in
the management console; it is sold and installed by us. Under it nothing
of the service's runs at all: no process of ours in the installer's
accounts, no traffic of their instances reaching a machine of ours,
no credential of ours reaching a key of theirs, and none of their
instances in our registry. What stays ours is the releases with
their set (208, 252), the invocation contract as a document, the control
plane's source under the customer's agreement, and the record of who
holds a grant. The first instance is a willdan-owned control plane
deployed in switchboard (`proposals/control-plane.md` §4).

**And the binary cannot tell (305).** A hosted host names an environment
(252) and that environment may be any control plane's; every fact the
binary reads about its service side arrives through 297's contract and
298's shapes and through nothing else. This amends 268 and 276a where
they read "the service side" as ours alone: read it as the control
plane's side, which may be an installer's own, and tier 3's shapes are
three — stores only, stores and compute, and the whole control plane
installed (`host.yaml` `tier`, `tier.dedicated`, `tier.installed`).
## 21. Ratified 306–314: the phone

**Parity is the requirement (306, 307).** Every decision is answerable on
a phone, and every control and every form the page carries is available
there: nothing the page offers is reachable only on a desktop, and
nothing the phone answers is missing on the desktop (2, 155,
`surfaces.md` S39, `surfaces.yaml` `phone`). This is not a ruling of the
surface specification that a later ruling may soften; it is a
requirement of the first build, and a page that answers on the desktop
alone has not met it. The phone is the same served bundle under 760px
and never a second application: two tabs, Decisions and Board, with the
dock full screen and a back control, which is the desktop's metaphor at
a smaller size and not a metaphor of its own (S38, S60). One bundle is
built, one is served, and its version is the binary's (291).

**A link reaches the object (308).** Every chat rendering, every
notification and every rail line carries a link to the object on the
page, at the host's address with the instance in the path (205a,
`sink` machine). The link opens that object in the dock with its answer
controls in reach, and it works whether the page is served on a
localhost port of the operator's own computer, over their private
network, or at a hosted served name (245, 291). A link to a host that is
away says so rather than failing silently (150a, `surfaces.yaml`
`away`).

**The notification is the chat sink's own (309).** A decision raised
reaches the operator's phone through the chat platform's notification,
carrying the answer controls that platform provides and the link of 308
(155, 277). The page pushes nothing of its own, on any tier, so the
machinery holds no device registration and no push credential; the short
reply grammar always works beside the controls (194).

**One request, and no state a reload loses (310).** The status view
renders from one request, which on the hosted tiers is the page
projection and its one decrypt (291, `host.yaml` `tier.projection`). The
page holds no client state a reload loses, so a reload after an answer
shows the answer recorded with who gave it and when (153, 154), and the
bundle carries no dependency the phone must fetch from anywhere else.
This is the same read the desktop makes; the phone is not a second
projection.

**Touch is the input (311).** Every answer is one tap or one short
reply. Nothing is reachable only by hover or by a keyboard, and anything
a hover reveals on the desktop is reachable by tap on a phone (S61). A
long-form answer, a proposal edit for one unit among several for
instance, is given on the phone with the platform's own keyboard, so
"answered on the page" (2) never means "answered at a desk".

**The console too (312).** The management console renders on a phone
with its tables as cards, and the managed add-host journeys complete
there, the cloud agent with its presets among them (283, 295,
`surfaces.yaml` `hosts_surface.add_offers`). That is what Hobby promises
an operator who has no computer of their own to run (281,
`flywheel` machine). A journey that needs a computer of the
operator's says so on its card rather than failing part way through.

**And the phone's other client (313).** The tool server's clients
include the Claude mobile app and voice through it, checked by the same
two rules as every other client: membership admits the identity and the
tool's declared permission authorizes the call (248, 249, 293,
`surfaces.yaml` `tools.identity`).

**Conformance (314).** Every scenario of the requirements' section 11
that carries an operator's response runs at a 390px viewport as well as
at the desktop's, and the mockups render at 390px. S1 is the scenario
that states it (`conformance/scenarios/S01.yaml`).
