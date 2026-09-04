# Flywheel next — the agent-graph model

A model of `design/flywheel-next/requirements.md` in which the flywheel
is one typed graph. Nodes are roles: the agent roles (curation, the
elaboration types, planning, each construction stage, resolve) and the
machinery roles (reconciler, runner, git, instantiate, presenter). The
operator is a node too, the only one whose outputs are words. Edges are
typed artifacts: signal, move, proposal, claim, verdict, unit, work item,
exit, word, row. Durable state is nothing but the artifacts on the
edges, kept in edge stores in the control plane. Execution is a graph
runtime that fires a node when the artifacts on its incoming edges
satisfy its firing rule, and every node firing is one lease.

Three consequences fall out of the shape and are argued in §7: a
session's exits are fixed because a session node has exactly five
out-edges; single-writer leases exist because a firing is itself an
artifact with an identity; the plan is derivable because a row is an
unanswered artifact on an in-edge of the operator node, and nothing
else.

The definitions are data under `machines/` (YAML, one file per node
kind, object, type, and the row catalogue, with `schema.json`); the
pictures under `diagrams/`; the conformance suite under
`conformance/`; what could not be satisfied in `gaps.md`.

---

## 1. The graph in one page

```
signal sources ──capture,signal──▶ [curation] ──move──▶ (moves)
                                      │
                               intent-proposal
                                      ▼
                                 ⟨OPERATOR⟩ ◀── unit-proposal ── [planning] ◀── verdict, claim, ask
                                      │                              ▲
                                    word                           ledger
                                      ▼                              │
                               [instantiate] ──intent,elaboration,bolt,unit,item──▶ edge stores
                                      │
                    ┌─────────────────┴──────────────────┐
             elaboration subgraph                 unit-type subgraph
        [elab/self-closing | standing | with-op]   [stage₁] → [stage₂] → … → merge
                    │                                    │
                  exit ◀──── [reconciler] observes herdr, wt, git host ────▶ observation
                    │
   [git] line.create · place.prepare · line.take · place.rebase · merge · land · archive
                    │
              [presenter] ──rows──▶ ⟨OPERATOR⟩ ──word──▶ (words)
```

| element | what it is | where it lives |
|---|---|---|
| node kind | a role with in-edge types, a firing rule, out-edge types, and either a session recipe or a list of effects | `machines/node-*.yaml` |
| edge kind | an artifact type with a schema, one producing node kind, its consumers, and the store binding name | `machines/graph.yaml` |
| subgraph template | a unit type or elaboration type: nodes and edges instantiated per unit or elaboration | `machines/type-*.yaml` |
| object derivation | a pure function from an object's artifacts to its state name | `machines/object-*.yaml` |
| row kind | an in-edge of the operator node with a creating predicate, a retracting predicate, and a group | `machines/rows.yaml` |
| activation | one firing of one node for one key on one host; the lease and the idempotency key at once | edge store `activations` |
| effect record | one act on the world, written with a deterministic identity before it is judged done | edge store `effects` |
| binding | evidence name and effect name → a real store operation, per profile | `machines/bindings/*.yaml` |

The runtime holds nothing. A tick is: read the edge stores as of a
point, derive every object's state, evaluate every node's firing rule
over every candidate key, take an activation for each that fires, run
its effects in order (each checked against the effect ledger), write
what the node produced, release. The plan is a query run on the same
read. Two ticks over unchanged stores fire nothing and write nothing.

---

## 2. Objects and where their machines went

The question of section 10, "which objects carry a machine", has a
sharp answer in this framing: **no object carries a machine; every
object carries a derivation**. A machine in the statechart sense is a
stored state plus transitions. Here the stored things are artifacts on
edges, and an object's state is the value of a function over the
artifacts that name it. Transitions are node firings. The machines
people see in the diagrams are the object's derivation drawn as states
with the node firings that move between them.

| object | derivation over | states (first match wins) | who fires the moves |
|---|---|---|---|
| **intent** | intent-proposal, word, elaboration states, archive effect | proposed · open · close-offered · closed | curation → operator → instantiate; git.archive |
| **elaboration** | elaboration record, activation, session observation, exit, word, merge effect | proposed · approved · queued · working · idle · blocked · offered · done · dropped | instantiate, runner, reconciler, operator, git.merge |
| **bolt** | bolt record, unit states, chore states, land effect, gate observation | open · close-offered · landing · landed · failed-landing | instantiate, git.land |
| **unit** | unit record, dependency states, item states | proposed · approved · waiting-deps · in-flight · finished · dropped | planning → operator → instantiate |
| **work item** | item record, advances, activations, exits, merge effect | at stage *s* (queued · working · blocked · idle · joined) · ready-to-merge · merged · stopped | stage nodes, join, git.merge |
| **session** | activation, observations, exits | starting · working · idle · blocked · gone | runner, reconciler |
| **signal** | signal, move | unmoved · moved(attach/challenge/join/answered/drop) | curation, operator |
| **host** | host record, heartbeat | alive · stale | reconciler |
| **claim** | the claim block on the books shared line, the intent line | proposed · standing · moved | git.archive (nothing else) |
| **verdict** | the ledger row, the claim's current version, the evidence path | current · stale · gone | planning, a stage with a verdict out-edge |
| **place** | place record, place observation | preparing · current · behind · conflicted · removed | git effects, reconciler |

Attributes, not objects: a capture (provenance on a signal), a move
(the signal's one stored judgment), a chore (a unit of the chore type
once accepted; an offer artifact before), a finding (an exit payload
that becomes a proposal or a signal), a question and its answer (an
exit and a word on the item), a line (a name and a head the git node
reads; never its own state), a type (a template, versioned by the books
repo), a rendering (an artifact of the presenter), an ask (an artifact
of the operator's dictation).

Relation between the machines: **composition by edges, not nesting**.
An intent does not contain its elaborations; the elaboration artifact
names its intent, and the intent derivation reads the states of the
elaborations naming it. A unit type is a subgraph instantiated per unit
whose stage nodes take the item's artifacts as in-edges. Nothing is
nested; every relation is an artifact naming another artifact.

---

## 3. Node catalogue

Two families. **Agent nodes** fire a session through the runner; their
out-edges are exits. **Machinery nodes** fire effects and write
artifacts; they never run a session.

### 3.1 Agent nodes

| node | key | fires when | session in | out-edges |
|---|---|---|---|---|
| `curation` | the id-set of unmoved signals at fire time | unmoved signals ≥ `threshold` ∨ (cadence due ∧ unmoved > 0) | a place off the books shared line | exit(done: moves, intent-proposals, elaboration-proposals) · finding · chore · blocked · stalled |
| `elaboration` (parameterised by elaboration type) | elaboration id | elaboration approved ∧ place current ∧ host has a slot ∧ no live activation | its place off the intent line | the five exits |
| `planning` | (repository, backlog fingerprint) | fingerprint differs from the last completed planning of the repository | a place off the built repository's shared line | exit(done: unit-proposals, verdicts) · finding · chore · blocked · stalled |
| `stage/<name>` (from a unit type) | (item, stage, attempt, member) | item at this stage ∧ queued ∧ place current ∧ dependencies satisfied ∧ slot | the item's place off the bolt line | the five exits, plus verdict when the stage declares it |
| `resolve` | (place, conflict id) | a conflict artifact on the place with no done exit | the same place | the five exits |
| `answer-resume` | (item or elaboration, question id) | an answer word exists ∧ the blocked session is gone | the same place | the five exits |

Every agent node's session is Claude Code, `claude --agent
flywheel-<node>`, one herdr pane, started with `herdr agent`. The work
order it receives is rendered from data (§11).

### 3.2 Machinery nodes

| node | fires when | effects, in order | writes |
|---|---|---|---|
| `instantiate` | a word of kind yes (or a direct act, or a dictation) on a proposal | none on the world | the object artifacts the word makes: intent + elaborations; unit + items (+ bolt when `new`); chore unit; elaboration on an open intent |
| `join` | every member session of a stage attempt has a terminal exit per the type's join rule | none | an `advance` artifact: to the next stage, or back to the return stage with `attempt+1`, or `stopped` when the retry bound is hit |
| `git` | one sub-node per effect atom; see §10 | `line.create`, `place.prepare`, `place.remove`, `line.take`, `place.rebase`, `merge`, `land`, `archive` | an effect record, a place record, a conflict artifact when one arises |
| `runner` | an agent node activation exists with no session observed | `session.start`, `session.tell`, `session.retire` | session record |
| `reconciler` | every tick | reads herdr, wt, git, the git host | observations: session alive/idle/working/gone · place head · gate result · operator presence · host heartbeat · refusal |
| `presenter` | the row-set fingerprint ≠ the last rendering's | `present.page`, `present.chat` | a rendering record |
| `signal-writer` | a finding exit whose subject is not the session's own intent or bolt | none | a capture (one per session) and a signal |
| `retire` | an activation's object reached a terminal state and its session is not standing | `session.retire`, `place.remove` | effect records |

### 3.3 The operator node

In-edges: the row kinds of §8. Out-edge: `word`. The operator node has
no firing rule; it fires whenever the operator speaks, and the presenter
is its adapter in both directions. A dictation (A.2.11) is a word with
no row: it enters the graph on the same edge and `instantiate` consumes
it.

---

## 4. Edge catalogue: the artifacts and one record of each

Every artifact has an `id`, a `kind`, a `wrote` block (the writing node,
the activation, the reason, the evidence as-of point, the time) and its
own fields. Records below are in recutils, the format of every git-held
store in both profiles; in the tracker profile the same fields sit in a
fenced block inside an issue body or comment.

**capture** — provenance for a source event. Producer: an adapter.
Store: `captures` (books repo `signals/captures/`).

```
Id: cp-2026-09-02-standup
Source: meeting
SourceKey: granola:mtg_8f31a2
CapturedBy: chuck
CapturedAt: 2026-09-02T18:05:00Z
Raw: file:///Users/chuck/captures/2026-09-02-standup.md
```

**signal** — one raw input. Producer: an adapter's session, or
`signal-writer`. Immutable. Store: `signals` (books repo `signals/`).

```
Id: sg-cp-2026-09-02-standup-07
Capture: cp-2026-09-02-standup
Kind: constraint
AssertedBy: Ryan
EventDate: 2026-09-02
Tags: providers, retries
Assertion: the provider throttles at 30 calls a minute and retries make it worse
Excerpt: "…every retry storm we've had was the atlas poller…"
Position: 00:41:12
ArguesWith: providers/one-writer@7f3a2c1
```

**move** — one stored judgment per signal. Producer: `curation`, or the
operator's word (revive, split). Store: `moves`.

```
Signal: sg-cp-2026-09-02-standup-07
Move: challenge
Target: providers/one-writer@7f3a2c1
Reason: contradicts scenario 2 of the claim
Date: 2026-09-03
By: ac-curation-4d1e
```

**proposal** — a row's subject: an intent, an elaboration on an open
intent, or a unit. Producer: `curation`, `planning`, `instantiate`
(from a finding). Store: `proposals`. A unit proposal carries its
document.

```
Id: pr-un-atlas-status-writer
Kind: unit
Generation: 2
Repository: atlas
TargetBolt: bo-plan-rows
NewBoltName:
Type: default@a91c0e2
After:
Covers: providers/one-writer@7f3a2c1 sc.1 sc.2
Items: spec · build×2 · review
RoutedFrom: planning
Document: proposals/unit/pr-un-atlas-status-writer.md
```

**word** — the operator's answer. Producer: the operator node via the
presenter, or a direct act read by the reconciler. Store: `words`.

```
Id: wd-rn-0912-2
Row: pr-un-atlas-status-writer@2
Answer: yes
Args: bolt=bo-plan-rows
By: chuck
Via: discord:msg_1178
At: 2026-09-04T07:40:12Z
Applied: 2026-09-04T07:40:40Z
Unapplied:
```

**intent**, **elaboration**, **bolt**, **unit**, **item** — the object
records. Producer: `instantiate`. Store: `objects/<kind>`.

```
Id: wi-418
Unit: un-atlas-status-writer
Bolt: bo-plan-rows
Repository: atlas
Type: default@a91c0e2
Index: 2
Title: status writer · build
After: wi-417
Place: pl-wi-418
Approval: wd-rn-0912-2
```

**activation** — a firing: the lease and the idempotency key. Producer:
the runtime. Store: `activations`.

```
Id: ac-stage-build-wi-418-a1-m1
Node: stage/build
Key: wi-418 · build · attempt 1 · member 1
Host: mac-mini
Generation: 3
TakenAt: 2026-09-04T07:41:02Z
Until: 2026-09-04T07:56:02Z
Inputs: place=pl-wi-418 base=9b1e44c line=bolt/plan-rows@9b1e44c instructions=books@c33d1f0
Released:
```

**session** — what the runner started and the reconciler saw. Store:
`sessions`.

```
Id: se-ac-stage-build-wi-418-a1-m1
Activation: ac-stage-build-wi-418-a1-m1
Host: mac-mini
Pane: herdr:ws-flywheel/wi-418-build
StartedAt: 2026-09-04T07:43:10Z
LastSeen: 2026-09-04T09:02:00Z
Observed: working
Expected: build items 2 of unit un-atlas-status-writer · commit in place · name the claim
```

**exit** — what a session told the machinery. Producer: `reconciler`
(parsing the session's exit block). Store: `exits`.

```
Id: ex-se-ac-stage-build-wi-418-a1-m1-2
Session: se-ac-stage-build-wi-418-a1-m1
Kind: blocked
Question: should Ready imply Backlog cleared?
Refers: providers/one-writer@7f3a2c1 sc.2
At: 2026-09-04T09:02:00Z
Delivered: deliverables=[] commits=[e1f0a2b]
```

Exit kinds are exactly `done`, `blocked`, `finding`, `chore`, `stalled`.
`done` and `stalled` are terminal; `blocked` suspends; `finding` and
`chore` leave the session working.

**advance** — one move of an item between stages. Producer: `join`.
Store: `advances`.

```
Id: ad-wi-418-3
Item: wi-418
From: review
To: build
Reason: not-done
Attempt: 2
Bound: 3
Members: se-…-review-a1-m1
At: 2026-09-04T11:20:00Z
```

**verdict** — one judgment of the ledger. Producer: `planning` or a
stage declaring the verdict edge. Store: `ledger/<repository>` (books
repo, recutils, one file per tracked repository).

```
Repository: atlas
Claim: providers/one-writer
ClaimVersion: 7f3a2c1
Revision: 5c02e9d
Judgment: partial
Evidence: openspec/specs/status-writer/spec.md#serves · tests/one_writer.rs
JudgedBy: ac-planning-atlas-1c9
Date: 2026-09-04
```

**effect** — the record that an act was performed. Producer: any node
with effects. Store: `effects`.

```
Id: fx-merge-wi-418-e1f0a2b-into-9b1e44c
Effect: merge
Activation: ac-git-merge-bo-plan-rows-7
Reason: item wi-418 ready-to-merge · first in order
Evidence: place head e1f0a2b · line head 9b1e44c · as-of 2026-09-04T12:00:03Z
Result: ok line=bolt/plan-rows@f7a9d21
At: 2026-09-04T12:00:11Z
```

**observation** — what the reconciler saw in the world. Store:
`observations` (kept only latest per subject; older ones are history in
the git-only profile and comment edits in the tracker profile).

```
Subject: se-ac-stage-build-wi-418-a1-m1
Saw: idle
Since: 2026-09-04T09:02:00Z
Evidence: herdr agent status · no output 14m
At: 2026-09-04T09:16:00Z
```

**rendering** — one presentation of the plan. Producer: `presenter`.
Store: `renderings`.

```
Id: rn-0912
At: 2026-09-04T07:40:00Z
Rows: pr-in-atlas-provider-limits@1 pr-un-atlas-status-writer@2 …
Tail: since=rn-0911
Delivered: discord:msg_1178 page
```

**host** — a host's record. Store: `hosts`. Heartbeat is a separate
low-cost write (§15).

```
Id: mac-mini
Bound: 2
Profile: git-only
Started: 2026-09-04T06:00:00Z
```

**ask** — a dictation. Producer: the operator node. Store: `asks`.

```
Id: ak-0913
Text: retries hammer the provider; add jitter
Repository: atlas
Bolt:
Type:
By: chuck
At: 2026-09-03T21:12:00Z
```

Read-only evidence, not stores of the flywheel: **claims** (fenced
blocks in mdBook chapters on the books shared line), **as-built**
(OpenSpec `specs/` on a built repository's shared line, each with a
`serves:` line naming `claim@version`), **types, instructions, skills,
manifest, context map** (files in the books repo under `flywheel/`),
**git heads** (the git host), **session liveness** (herdr), **place
heads** (wt and local git).

---

## 5. The stores: the minimal set and the source of truth

Fourteen edge stores hold everything the machinery must remember. Every
state in §2 is proven by exactly one of them (I4).

| store | proves | tracker profile | git-only profile |
|---|---|---|---|
| `captures`, `signals`, `moves` | a signal exists; its one move | books repo, `signals/` (recutils) | same |
| `proposals` | a decision is the operator's | an issue labelled by the binding, body = document | state repo `proposals/<kind>/<id>.rec` + `.md` |
| `objects/<kind>` | an intent, elaboration, bolt, unit, item exists and what approved it | the proposal's issue, relabelled; bolt also owns a milestone | state repo `objects/<kind>/<id>.rec` |
| `activations` | who fired what, and owns it now | a lease comment on the object's issue | a section in the object's file |
| `sessions`, `observations` | what runs and what was last seen | a comment per session, edited | `objects/<kind>/<id>.rec` sections; heartbeat branch for liveness |
| `exits` | what a session said | a comment per exit | a section in the object's file |
| `advances` | which stage an item is at and its history | a comment per advance | a section in the item's file |
| `words` | the operator's word, applied once | a comment per word; a direct act read from the issue itself | `words/<rendering>-<row>.rec`, committed by the word writer |
| `effects` | an act was done | a comment per effect on the object it concerns | a section in the object's file |
| `ledger/<repo>` | a verdict | books repo `ledger/<repo>.rec` | same |
| `renderings` | which plan the operator last received | a comment on the plan issue | `renderings/<id>.rec` |
| `hosts` | a host's bound, and whether it is alive | an issue per host; a heartbeat comment edited | `hosts/<host>.rec`; branch `heartbeat/<host>` |
| `asks` | a dictation | an issue | `asks/<id>.rec` |
| `conflicts` | a take or rebase left work for a session | a comment on the item or elaboration | a section in its file |

Projections, never read as truth: the tracker's board columns, the
status page, the Discord rendering, a place's on-disk worktree (its
*existence* is observed evidence; its *state* is the place record), a
host's memory.

**Drift.** Every tick the presenter rewrites projections from the
source. Where a projection is also a transport for the operator's word
(a board column that means a decision, an issue closed by hand, a
state file edited by hand), the reconciler reads the difference between
source and projection through the binding's `direct-word` table and
writes a word artifact for it; the difference then closes on the next
derivation. A projection that differs in a way no table row explains is
overwritten and the overwrite recorded as an observation with reason
`drift`. Two stores never both prove one state, so there is nothing to
arbitrate: the projection loses.

---

## 6. The runtime: what the engine is and what it is not

### 6.1 A tick

```
tick(host):
  point   ← control.read_point()                   # git: fetch, sha of main; tracker: now
  world   ← reconciler.observe()                   # herdr, wt, local git, git host
  E       ← control.list(scope) ∪ read each        # the edge stores as of point
  S       ← derive(E)                              # every object's state
  R       ← rows(E, S)                             # the plan
  for node in definitions.nodes:
     for key in node.candidates(E, S):             # domain atom: enumerate keys
        if node.when(E, S, key) and not activation_live(E, node, key):
           ac ← control.lease.take(node, key, generation(E,key))
           if ac.lost: continue                    # read again next tick
           for eff in node.effects: control.write_effect(id(eff, ac, inputs), eff)
           control.write(node.produces(E, S, key))
           if node.is_agent: runner.start(ac)      # activation stays live until a terminal exit
           else: control.lease.release(ac)
  presenter.maybe_render(R)
```

`derive`, `rows`, `when`, `candidates`, `produces`, `id` are pure. The
engine evaluates them; the domain supplies their atoms.

### 6.2 What the engine knows

The engine is a graph runtime with these primitives and no others:

- **load**: parse node kinds, edge kinds, templates, derivations, row
  kinds; validate against `schema.json`; refuse a definition that
  names an evidence or effect the binding does not supply (B.3.127).
- **evidence**: `exists`, `all`, `any`, `count`, `latest`, `since`,
  `eq`, `fingerprint` over edge artifacts, evaluated through the
  binding's read.
- **fire**: candidate enumeration, `when`, activation take/renew/
  release/expire, generation.
- **effects**: deterministic effect id, dedupe against the effect
  store, ordered run, result record.
- **process port**: start, observe, tell, retire a process for an agent
  node; the exit grammar (five kinds, parsed from a fenced `exit` block
  in the process's last message).
- **rows**: the row query and grouping; the word's identity
  `(row, generation)`; the rendering fingerprint.
- **scenario**: load a scenario file, run a tick over an in-memory
  control plane, diff transitions, effects, rows.

No word in the engine is `intent`, `elaboration`, `bolt`, `unit`,
`item`, `claim`, `verdict`, `signal`, `chore`, `finding`, `session`
(the port says `process`), `stage`, `place` (the port says `dir`).

### 6.3 What the domain is

`machines/atoms.yaml` lists one predicate atom per question and one
effect atom per act. A predicate atom's signature names flywheel
objects; an effect atom names a repository or session operation. Every
`when`, `candidates`, derivation and row predicate in the definitions is
composed of engine combinators over these atoms. Adding an elaboration
type, a stage, or a row kind is a new template or a new row entry
(A.10.73); adding a question or an act is a new atom (A.10.75).

**The line, stated as a rule.** A need goes into the engine only when it
is a new *operation of the control plane contract* (B.1.112) or a new
*combinator* that is meaningful over any edge store. It goes to the
domain when it can be phrased as "given these artifacts, is this true"
or "perform this on this repository or session". A test enforces the
rule: the engine crate's public surface is grepped for the vocabulary
list above and fails on any hit.

### 6.4 The Rust crate boundary

The language is a given; the crates follow the lines above.

| crate | holds | depends on |
|---|---|---|
| `fw-engine` | the runtime of §6.2; traits `ControlPlane { read, write_effect, lease, present, receive, notify, list, status }`, `Process { start, observe, tell, retire }`, `Repo { head, take, rebase, merge, land, archive, prepare, remove }`; the scenario runner | nothing but serde |
| `fw-domain` | the atoms of `machines/atoms.yaml` as functions over `Evidence`; the definitions embedded at build from `machines/` | `fw-engine` |
| `fw-cp-tracker` | `ControlPlane` for GitHub issues, milestones, a project board; the binding file at `machines/bindings/tracker.yaml` | `fw-engine` |
| `fw-cp-git` | `ControlPlane` for the state repository; the binding at `machines/bindings/git-only.yaml`; the word writer | `fw-engine` |
| `fw-process-herdr` | `Process` over `herdr agent` | `fw-engine` |
| `fw-repo-wt` | `Repo` over `git` and `wt` | `fw-engine` |
| `fw-present` | the page (axum, served on the private network) and the Discord bot; both render rows and turn replies into `receive` | `fw-engine` |
| `fw-host` | the one static binary: loads the manifest, picks the profile, runs the tick loop, serves the page | all of the above |

Definitions, bindings and scenarios are YAML read by `fw-engine`;
nothing in them refers to Rust.

---

## 7. What the graph shape gives for free

### 7.1 The fixed exit set

A session node has five out-edges: `done`, `blocked`, `finding`,
`chore`, `stalled`. An exit is an artifact placed on one of them by the
reconciler, which parses the session's last message for a fenced
`exit` block whose `kind` must be one of the five. There is no sixth
edge, so there is nothing else a session can say to the machinery. A
session that ends without a parseable block is placed on `stalled` by
the reconciler; a session that names a kind not in the grammar is
`stalled` with the text kept as evidence. The agent's free reasoning
lives entirely inside the node; its boundary is the edge types. This
answers the section 10 question about where free reasoning sits: inside
a node whose only outputs are typed edges, with the reconciler as the
parser that keeps them typed.

### 7.2 Single-writer leases

Every edge kind has exactly one producing node kind, and every firing of
a node is an activation artifact with an identity `(node, key,
generation)`. The activation is taken by the control plane's lease
operation, which is compare-and-swap in every profile. So for any
artifact there is at most one writer alive: the holder of the
activation whose out-edge it is. Two hosts that see the same ready key
both try to take the activation; one wins; the loser reads again
(B.2.121). Sessions are owned the same way: a session exists only under
an activation, so a session is owned by exactly one host. The lease is
not a separate mechanism laid over the graph; it is the graph's node
firing made durable.

### 7.3 The derivable plan

The operator is a node whose in-edges are the row kinds. A row exists
exactly when an artifact sits on one of those edges, no word answers it,
and the row's validity predicate holds. The plan is the set of such
artifacts, grouped, numbered by the rendering. It is a query over the
edge stores, so a restart cannot lose a row, a process cannot remember a
row that no longer exists, and two hosts derive the same plan from the
same read (I7). Every row kind lists its creating predicate (the
artifact appears) and its retracting predicate (a word, or the validity
predicate fails) in `machines/rows.yaml` and in §8.

### 7.4 A unit type is a subgraph the operator adds as data

`machines/type-unit-default.yaml` says:

```yaml
kind: unit-type
name: default
change-directory: true
lands-on: bolt-line
stages:
  - name: spec
    agent: flywheel-spec-writing
    members: {fixed: [{persona: default}]}
    join: all
    not-done: {return-to: spec, bound: 2}
    gates: [asbuilt-names-standing-claims]
  - name: build
    agent: flywheel-build
    members: {fixed: [{persona: default}]}
    join: all
    not-done: {return-to: spec, bound: 2}
  - name: review
    agent: flywheel-code-review
    members: {fixed: [{persona: adversarial}]}
    join: all
    not-done: {return-to: build, bound: 3}
  - name: merge
    machinery: git.merge
```

The engine instantiates one `stage/<name>` node per stage per item and
wires `done → next`, `not-done → return-to` with the bound, and
`members` as the fan-out rule. A type with `members: {rule: {files:
"personas/*.md"}}` fans out one session per matching file in the
repository being worked and joins by `all`, `any`, or `count: n` (S26).
The unit records `Type: default@a91c0e2` (name at the books commit that
defined it); a change to the type is a new commit, and a unit in flight
keeps the template it started under because its items' activations
carry the version.

Elaboration types are the same shape with one stage and a different
interpretation of the `done` and idle edges (`machines/type-elab-*.yaml`).

---

## 8. The plan: rows, words, renderings

### 8.1 Row catalogue

Each row is an in-edge of the operator node. "Created" is when the
predicate first holds; "retracted" is when it stops holding. Both are
evaluated on every read; a row can never be missed because it is not an
event, it is a fact about the stores.

| row | group | created when | retracted when | yes starts |
|---|---|---|---|---|
| **intent** | APPROVE | a proposal of kind intent exists with no word on `(id, generation)` | a word (yes · drop · split) is recorded; or every cited signal has been re-moved by a word | `instantiate` writes the intent and its elaborations approved; the git node creates the intent line; elaborations queue |
| **elab** | APPROVE | a proposal of kind elaboration on an open intent with no word; at most one per intent (new material amends it, bumping generation) | a word; or the intent closes | the elaboration is approved and queues |
| **unit** | APPROVE | a proposal of kind unit with no word | a word (yes · drop · redo:notes · bolt · new bolt · rename) | `instantiate` writes the unit and its items; a new bolt and its line and place when `new`; items with no unmet dependency queue at stage 1 |
| **baseline** | APPROVE | a unit proposal set whose `RoutedFrom` is a first planning (ledger empty at fire) | as unit; `pick` answers a subset | as unit, plus chores |
| **chores** | APPROVE | at least one chore offer for one repository or bolt with no word | every offer in the group has a word (yes · no · pick) | one chore unit per accepted offer, on the line the offer names |
| **land** | APPROVE | bolt open ∧ ≥1 unit ∧ every unit finished ∧ no accepted chore unworked ∧ no `hold` word since the bolt's finished-set fingerprint last changed | word yes (→ `git.land`) · hold; or a unit joins the bolt (fingerprint changes and the row re-forms) | `git.land` |
| **close** | DECIDE | intent open ∧ ≥1 elaboration ∧ every elaboration done ∧ no proposal awaiting ∧ no `keep open` since fingerprint | word close (→ `git.archive`) · keep open; or a new elaboration is proposed or approved | `git.archive` |
| **idle** | DECIDE | a standing or with-operator elaboration's session observed idle ≥ `idle-window` ∧ ¬operator-present ∧ no `keep` word since this idle episode began | word finish (→ elaboration done, retire) · keep; or the session becomes working again | retire |
| **moved** | DECIDE | an open bolt holds a unit whose proposal covers `claim@vN` ∧ the standing version is `vM ≠ vN` ∧ no word for `(unit, vN→vM)` | word amend (→ the unit's items return to stage 1 with the new version in their work orders) · follow (→ planning's proposal for vM proceeds); or the bolt lands | as stated |
| **blocked** | ANSWER | an exit of kind blocked on an item or elaboration with no answer word | the answer word; or the item is dropped | `session.tell` if the session lives, else `answer-resume` |
| **host-stale** | ATTENTION | a host's heartbeat older than `lease-ttl` ∧ it holds a session activation | the heartbeat is fresh again; or every such activation has been taken over (word takeover) or released | takeover: the activation's generation moves and a fresh session starts on the taking host |
| **unapplied** | ATTENTION | a word with `Unapplied` set that no rendering has carried | the next rendering carries it | nothing |
| **since** | SINCE | terminal transitions (merged · landed · closed · dropped · finished) with time after the last rendering's `At` | the next rendering | nothing |

The finding row of A.2.9 is realised as **elab** (a finding about the
session's own intent joins that intent's awaiting proposal) or **unit**
(a finding about its own bolt becomes a unit proposal on that bolt with
`RoutedFrom: finding`); a finding about anything else becomes a signal
and reaches the plan only through curation.

### 8.2 The word

A word's identity is `(row id, generation)`. The presenter's `receive`
writes it by compare-and-swap; a second delivery of the same word finds
it written and is acknowledged, not applied (B.2.124). Applying is the
`instantiate` (or `git`, or `retire`) node firing with the word as its
in-edge; the node's activation key includes the word id, so a restart
between recording and applying re-fires once and the effects dedupe.

A word whose row no longer holds when it is read (the unit was dropped
by a direct edit before the reply arrived) is written with `Unapplied:
<reason>` and becomes an ATTENTION row once. The operator can tell the
word was recorded because the bot reacts to the message only after the
write returns, and the page shows the word on the row (A.16.139).

`yes all` is a word on every APPROVE row of one rendering: the reply
names the rendering (the chat message it answers), so "all" is fixed by
the rendering record, not by whatever the plan holds when the reply is
read.

### 8.3 Renderings and the tail

The presenter fires when the row-set fingerprint differs from the last
rendering. It writes the rendering record first, then presents: the page
(served by the host on the private network) and the chat (one Discord
message per rendering, rows one line each, same numbers, link to the
page; the previous message edited to say it is superseded). The SINCE
tail is derived from terminal transitions after the last rendering's
`At`; which rendering that was is the record (A.2.13).

"Received" is taken to mean delivered to the chat channel or loaded on
the page; whether the operator read it is not knowable (gaps.md).

### 8.4 Direct acts as words

A.1.3 and C.1.143: the reconciler compares each object's projection
(the board column, the issue state, the file edited by hand) with the
derived state and looks the difference up in the binding's
`direct-word` table (`closed by hand` → close; `moved to Ready` → yes;
`file says State: dropped` → drop). A match writes a word with `Via:
direct:<event id or commit sha>`, which then applies like any word.

---

## 9. Planning and the ledger

### 9.1 Where planning sits

Planning is an agent node keyed by `(repository, backlog fingerprint)`,
not a stage of a bolt (bolts are independent and planning spans every
open bolt) and not an elaboration type (it works the construction
side). Its firing rule is `backlog-fingerprint(repository) ≠
fingerprint of the last completed planning activation`. The fingerprint
is the hash of:

- every standing claim in scope for the repository, with version, that
  has no verdict of `satisfied` or `not-applicable` at the current
  version with its evidence still present (A.14.89: the backlog is this
  set, never stored);
- every ask naming the repository with no unit yet.

A claim becoming standing (archive moved the shared line), a verdict
written or gone stale, or an ask arriving, each change the fingerprint,
which is what "the backlog changes" means. Forty commits with no claim
change move nothing (S11).

The planning session's work order carries the backlog, the as-built
(`serves:` lines from OpenSpec specs on the shared line), and every open
bolt of the repository with what each holds (A.5.26). Its deliverable
is unit proposals, each naming `TargetBolt` or `NewBoltName`, with
`After` dependencies among units of the same bolt, and verdicts.

### 9.2 The ledger

The ledger is one recutils file per tracked repository in the books
repository, `ledger/<repository>.rec`, committed on the books shared
line by the machinery (direct commit; the books repo's landing policy
for machinery records is `direct`, stated in the manifest). It lives
in git in both profiles because a verdict is a record, not an object
with a lease, and because construction sessions read it beside the
claims they serve.

A verdict is written by the planning session (a first planning judges
every claim in scope once, S10) and by any stage whose type declares a
`verdict` out-edge (a test stage, a chore that satisfies a claim,
A.6.56). The engine writes it from the exit's deliverables with an effect
id of `(repository, claim, claim version, revision)`, so a repeat is a
no-op (I10).

A verdict is **stale** when its `ClaimVersion` differs from the claim's
current standing version, or its `Evidence` paths are absent at the
shared head. Staleness is a derivation, never a write. A stale verdict
changes the backlog fingerprint; planning fires; the proposal it makes
is the row. It cannot be missed because the fingerprint is re-evaluated
on every read and planning fires until a completed activation carries
the current fingerprint.

The **moved** row (A.14.90, S9) is derived directly from the graph, no
session needed: an open bolt whose unit covers `claim@vN` while the
standing version is `vM`. Planning also fires (the fingerprint moved)
and its proposal for `vM` waits behind the moved row's word: `follow`
lets it stand; `amend` returns the bolt's affected items to their first
stage with the new version and drops the follow-on proposal.

---

## 10. Lines and places

Lines are branches the git node owns; places are worktrunk worktrees it
prepares. The shape is the same on both sides (A.5.42).

| line | off | created by | landed by |
|---|---|---|---|
| `main` of a built repository | — | the repository | — |
| `bolt/<id>` | the repository's `main` | `git.line.create` on `instantiate` of a new bolt | `git.land` by the manifest's policy: `pr` (open a pull request with `gh`, wait for the gates, merge) or `direct` (fast-forward push) |
| `intent/<id>` | the books `main` | `git.line.create` on intent yes | `git.archive`: OpenSpec archive of the intent's change, merge to `main` by the books policy, delete the line |
| a place `pl-<object>` | its line | `git.place.prepare` = `wt add`, ports hashed from the worktree, `wt tether` for anything the session starts | `git.merge` into the line, then `git.place.remove` = `wt remove` |
| the bolt's own place | `bolt/<id>` | `git.place.prepare` on bolt creation; refreshed by `git.place.rebase` after every merge | removed on landing |

**Cadence rule for a take.** `git.line.take(line)` merges the parent
into the line. It fires when any of: a place is about to be prepared
off the line and the line is behind its parent; the manifest's cadence
is due (`take: "06:00 daily"` per repository) and the line is behind;
`git.land` or `git.archive` is about to fire. Behind means the parent's
head is not an ancestor of the line's head. A take that conflicts
leaves the line untouched (`git merge --abort`) and writes a conflict
artifact on the line's newest idle place, which fires `resolve` there.

**What proves a place is current.** `session.start` requires the
predicate `place-current(place)`: the place's observed base equals the
line's observed head as of the tick's read point, and both shas are
written into the activation's `Inputs`. A session starts only from an
activation, so I16 holds by construction. After a sibling merges,
`git.place.rebase` fires for every other place off the line whose base
is behind, but only when its session is observed idle (`observed ∈
{idle, blocked, gone}`) — never while working (A.5.44). The rebase is
followed by `session.tell(moved: base→head, files)` when the session
lives. A rebase that conflicts is aborted, the conflict artifact is
written on the place, and `resolve` fires there with the item's or
elaboration's identity in its work order; on its `done` the rebase is
retried. The bound on retries is the type's `not-done.bound` for the
current stage; past it the item is `stopped` and the conflict is a
**blocked** row.

**Merge order.** `git.merge` holds one activation per bolt line at a
time (key = the line). It takes the ready-to-merge items of the line in
order `(unit dependency order, item index)` and merges one per
activation, so merges are serialised and the order is stated (A.5.34).
After each merge the bolt's own place is rebased.

**Refusal.** A place is prepared with `core.hooksPath` pointing at the
machinery's hook directory (`pre-push` refuses; `reference-transaction`
refuses ref creation other than the place's own branch) and the agent's
Claude Code settings deny `git branch|checkout -b|merge|rebase|push|
worktree` and `wt` in a PreToolUse hook. Both are data in the books repo
under `flywheel/hooks/`. A refusal is written to the pane's log; the
reconciler reads it and writes an observation `refusal` on the session,
which the run report shows (S15).

**Processes belong to places.** Anything a session or the operator
starts in a place runs under `wt tether`, ports come from the
worktree's hash through portless, and `wt remove` ends them. The
machinery requires only the rule; how a repository starts its servers is
its own instruction (A.5.41).

---

## 11. Sessions

A session is one herdr pane running `claude --agent flywheel-<node>`
in one place, started by the runner from an activation.

**Inputs are closed** (A.11.77). The runner writes
`<place>/.flywheel/work-order.md` (untracked) and starts the agent with
it. The work order is rendered from: the schema instruction and the
type skill at the books commit recorded in the activation
(`instructions=books@sha`), the object's artifacts (the item or
elaboration record, its unit's document, the answer to a prior
question), and the artifacts of the change it works (its OpenSpec change
directory, findings and chores already there). A test renders the
same file from a scenario without starting anything (A.11.78,
A.16.111).

**Slow start** (A.7.61, S6). The runner's `session.start` effect id is
the activation id. It runs `herdr agent start --name <activation>`;
success is judged by `herdr agent list` showing the name, not by the
command returning. A timeout retries the list, then the start; a second
start with the same name is refused by herdr, so a retry after a restart
finds the pane and writes the session record. The activation existed
before the first attempt, so no other host starts one.

**Observation.** Each tick the reconciler asks herdr for every pane
whose name is an activation id: alive or gone; last output time; the
last message. `working` = output within `idle-window`; `idle` = alive
with no output past it; `gone` = no pane. The last message is scanned
for a fenced `exit` block; a new one becomes an exit artifact.

**Blocked** (A.7.59, S30). `blocked` with a question becomes a row in
ANSWER. Only that item's derivation reads `blocked`; every other item
proceeds. The answer word is written on the item. If the session is
observed alive, `session.tell` (`herdr agent send`) delivers it and the
session continues; if gone, `answer-resume` fires a fresh session whose
work order opens with the question and the answer. The count of blocks
per `(type, stage)` is a derivation over exits, shown on the status
view.

**Idle and standing** (A.4.22–23, S2). For a self-closing elaboration
or a stage, idle past `stall-window` with no terminal exit is `stalled`
(written by the reconciler). For a standing or with-operator
elaboration, idle is never stalled: it is the **idle** row, and only the
word `finish` ends it. A restart changes nothing: the pane is still
there, the activation is still live, the derivation still says idle.

**Operator present.** The evidence `operator-present(session)` is
herdr's report of human keystrokes on the pane within
`presence-window`, or a word `in` on the elaboration (and `out` to
clear). While present, the with-operator type suppresses the idle edge.

**Never interrupted** (A.7.60, I5). `session.tell`, `place.rebase`, and
`session.retire` all require `observed ≠ working`. Retirement of a
session whose work was dropped by a word waits for idle unless the
word says `now`.

**Retire** (A.7.63). When the object an activation serves reaches a
terminal state and the session is not standing, `retire` fires:
`herdr agent stop`, then `place.remove`, both idempotent.

**Expected versus delivered** (A.9.69). The session record's `Expected`
line is rendered from the work order; the `done` exit's `Delivered`
line is the session's own list; the run report's first line for a
session is their difference.

---

## 12. Curation and signals

Curation connects to the flywheel through two stores it does not own:
`signals` and `moves`. Adapters append captures and signals at any rate;
the flywheel reads signals only inside the `curation` node. The
flywheel does no batching: the node's key is the id-set of unmoved
signals at fire time, and its firing rule is a threshold or a cadence.
Nothing accumulates in a process; the queue *is* the set of signals with
no move.

A curation session receives the unmoved signals, the standing claims
(the index it clusters against, A.15.95), and the open intents with
their awaiting proposals. Its `done` deliverables are moves (one per
signal it judged) and proposals (new intents with elaborations and
weight; elaboration proposals joining open intents). The engine writes
them: moves to `signals/moves.rec`, proposals to `proposals`.

A person writing the same records by hand is curation (A.15.97): the
stores are files, and the next tick reads them the same way.

Adapters: `flywheel capture` subcommands of the host binary — `forward`
(a Discord message forwarded to the bot with one word makes a capture
and one signal, S21), `meeting <file>` (a transcript file dropped in
the captures folder; the capture is written unattended; the signals are
read by a `signal-reading` session, A.15.102), `log <run>`. The source
key (`granola:mtg_…`, `discord:<channel>/<day>`, a content hash for a
dropped file) is the capture's identity, so the same event captured
twice is one capture (S22).

Weight on an intent row counts signals by `EventDate` (A.15.105).
Dropping a proposed intent writes a move `drop` naming the proposal on
each cited signal (S23); reviving a signal by dictation replaces its
move with none, and the next curation run keys on it (S24).

---

## 13. Claims, the book, the context map, instructions

**Claims are fenced blocks in the chapter, locked by hash.** A chapter
in the mdBook source holds its claims as

````markdown
```claim
name: providers/one-writer
scope: {capability: status-writer}
version: 7f3a2c1
scenarios:
  - one host holds the status writer lease; a second host's write is refused
  - the lease expires by rule when the heartbeat stops
```
````

where `version` is the hash of the block's text without the version
line; a pre-commit hook in the books repo recomputes it, so the version
moves exactly when the text moves. The prose, diagram and sample around
the block are the chapter; there is nothing to drift (A.14.84). The
choice against OpenSpec requirement blocks by anchor: those live under
`openspec/specs/`, not in the chapter, and "one source" would already be
two files. OpenSpec changes are still how an elaboration proposes a
chapter edit; the archive step lands the chapter, and with it the claim.

A claim is **proposed** while it exists only on `intent/<id>` and
**standing** once `git.archive` lands the intent line on the books
`main` (A.3.42, A.14.85). The set of standing claims is read by parsing
the chapters at the books head; nothing stores it.

**The context map** is `flywheel/context-map.yaml` in the books repo,
versioned with the book (A.16.108). The **review view** is derived: the
operator's `reviewed` word writes a mark (`review-marks/<who>.rec`) with
the books sha; the page diffs chapters and map from the mark to the
head, lists claims whose version moved and map nodes that changed, and
links each with the previous version beside it (S25). Nothing is
written by hand.

**Instructions, skills, types, hooks** live under `flywheel/` in the
books repo. Every host fetches books `main` before every tick; an
activation records the sha it used, so a session started before a
change and one after are told apart (A.16.110). Changing one is a chore
on the books shared line. The defaults of A.16.107 are the files
shipped at `flywheel/instructions/default/`: `design-session.md` (write
the chapter and the claim in one commit; update the context map when a
claim changes), `construction-session.md` (name the claim the work
serves in the spec's `serves:` line).

---

## 14. Control plane binding: the tracker profile

The tracker is GitHub: issues, milestones, one Projects board, their
comments. The binding is `machines/bindings/tracker.yaml`.

| contract operation | binding |
|---|---|
| read | an object = one issue; its evidence = the issue's fields, its labels, its milestone, its board column, and every comment's fenced `flywheel` block; `as-of` = the latest `updated_at` among what was read |
| write an effect | a comment on the object's issue carrying the effect id; before writing, the comments are listed and an existing id is a no-op |
| lease | a comment `activation` with `(node, key, generation, host, until)`; the winner is the lowest comment id among activation comments for the same `(node, key, generation)`; renewal edits the winner's own comment; expiry when the holder's host heartbeat is older than `lease-ttl` |
| present and receive | rows rendered on the plan page and in Discord; a reply becomes a `word` comment on the row's issue; a direct act (issue closed, card moved) is read through the `direct-word` table |
| notify | the GitHub webhook for issues and issue comments, delivered to each host's URL; a 60 s poll besides |
| list | `gh api` search: issues with the scope label, by kind label; milestones for bolts and intents |
| status view | the Projects board (columns written by the presenter from derived state) and the page, both built from the same issues |

Object → tracker: intent, elaboration, bolt, unit, item, chore offer,
proposal, host → an issue each, labelled `fw:<kind>` and the scope
label `fw:next` (A.13.83: the current flywheel's issues carry neither).
A bolt and an intent each also own a milestone that groups their
children. A proposal's issue becomes the object's issue on yes
(relabelled), so the proposal document, its annotations, and the
object's history are one thread; the annotation on the document is a
comment, read as a word.

Signals, moves, the ledger, types and instructions live in the books
repo as in §5; the tracker holds objects.

**What GitHub does not give and what the profile adds** (C.3.153):
compare-and-swap on edits does not exist, so the lease is
append-then-read (lowest comment id), and single writer for artifacts
holds because only an activation holder writes them. Reads across
issues are not one snapshot; every decision is re-derived next tick and
every effect is idempotent, and the two irreversible cross-object
effects (`land`, `archive`) re-read their inputs under the lease
immediately before firing.

---

## 15. Control plane binding: the git-only profile

All state is files in git; the git host is GitHub used only for
repositories, pushes and webhooks. The binding is
`machines/bindings/git-only.yaml`.

**Repositories that hold state.** One state repository per
organization, `<org>-flywheel-state`, separate from the books so that
state churn does not enter the design's history; plus the books repo
for signals, ledger, types, instructions, claims; plus the built
repositories for lines, places, and the as-built.

**Layout** (one file per object, all of its artifacts as records in it):

```
objects/intent/in-…​.rec       object record, then activation, exit, word, effect records
                              the object record's State: line is a projection the
                              presenter rewrites each tick; a hand edit to it is a direct act
objects/elaboration/el-….rec
objects/bolt/bo-….rec
objects/unit/un-….rec
objects/item/wi-….rec         advances live here too
proposals/{intent,elaboration,unit}/pr-….rec  +  .md for a unit document
words/<rendering>-<row>.rec
asks/ak-….rec
hosts/<host>.rec
renderings/rn-….rec
review-marks/<who>.rec
status/                       one static page, on branch `status` (see below)
```

**The shared line** is `main` of the state repository. A commit on
`main` is the fact; a local commit is an intention. A host learns its
commit landed when `git push` returns success; the push is the
compare-and-swap (C.2.146): the git host rejects a push whose base is
stale. **The loser** fetches, rebases its local commits onto the new
`main`, and pushes again if the rebase is clean (its commits touched
other objects' files). If the rebase conflicts, both commits changed the
same object's file: the loser drops its commit, reads again, and decides
afresh (I15). Because every object is one file and every artifact is a
record appended to it, two hosts writing different objects never
conflict, and two hosts writing the same object always do.

**Lease.** An activation record appended to the object's file by a
commit that lands is the lease. Renewal is not a commit: the host's
liveness is its heartbeat branch `heartbeat/<host>`, a single orphan
commit force-pushed every `heartbeat-interval` (2 min) whose message is
the time. A lease has expired when the holder's heartbeat is older than
`lease-ttl` (15 min). Takeover of an effect-only activation is automatic
past the ttl; takeover of a session-backed activation needs the
operator's word `takeover`, because the session may still be running on
a host that only lost its network (S13, S18).

**History bounded.** `main` grows by real state changes only: no
renewals, no heartbeats, no status pages. Heartbeats and the status page
are force-pushed single-commit branches. Verdicts are re-judged only
when a claim version moves (I10). Observations are written to `main`
only when they change an object's derived state (idle → row, gone →
stalled); the reconciler's other sightings stay in host memory, which
is allowed because they decide nothing after a restart (I14: what is
not committed is re-observed).

**The word from a phone.** The word writer is `flywheel word`, one
instance per organization elected by the activation `singleton:word`
(the same lease as any node). It runs the Discord bot and the page's
answer endpoint. A reply `yes 2` becomes `words/rn-0912-2.rec`,
committed and pushed to `main`; the bot reacts ✅ on the message after
the push succeeds, and ❌ with the reason if the row no longer holds.
The page shows the word on the row on its next build. With no host
running, a reply waits in Discord until the writer returns (gaps.md);
the operator can always commit a word file from a laptop instead, which
is the same fact (S19).

**Notify.** A webhook from the git host on every push to the state
repo's `main`, the books `main`, and each built repository's `main`,
to every host's URL; a 60 s poll besides; and before every tick, every
host fetches and integrates `main` (C.2.149). Latency bound: seconds by
webhook, 60 s by poll. A host never decides on a read older than its
last fetch.

**Status view without a process.** After each tick the presenter builds
`status/index.html` from list and read and force-pushes it to the
branch `status`. The operator's own way of serving a page serves that
branch's tree on the private network. The page's first line is `as of
<main sha> · <time of that commit>`; opened six hours after the last
host stopped it shows exactly that (S20).

**Disconnected host** (C.2.149). May: keep the sessions it owns
running; let them commit in their places; run `git.merge` into a bolt
line *locally* (the line is a branch in its clone); keep observing.
May not: take an activation; land; archive; take from a parent; write a
word; present. On reconnect it fetches, rebases its local `main` commits
(only its own objects, so no conflict unless a takeover happened, in
which case its records for that object are dropped, its session
retired, and the fact reported), pushes its bolt-line merges, and
resumes.

**Discussion on an object** (section 10's last question): the object's
file is the thread. A session's note is an `exit` of kind `finding` or a
`note` line in its `done` exit; a question and its answer are an exit
and a word; the status page renders the file's records in order as a
conversation. The operator's reply to a note goes through the word
writer as a word with `Answer: note`.

---

## 16. The questions of section 10

### Which objects carry a machine, and how do the machines relate?

No object carries a stored machine; every object carries a derivation
(§2). Intents, elaborations, bolts, units, items, sessions, signals,
hosts, claims, verdicts and places have derivations; captures, moves,
chores, findings, questions, lines, types, renderings and asks are
artifacts. The relation is composition by reference: an artifact names
another, and a derivation reads the states of the artifacts naming it.
Nothing nests.

### Where does event-driven behavior meet reconciliation?

At the reconciler node. A session's life is events in herdr; the
reconciler turns each into an observation artifact (alive, idle,
working, gone, exit block seen). Every other node reads observations as
evidence like any artifact. So the graph is entirely reconciliation:
the only event-driven part is the observer that writes what it saw, and
a missed event is recovered by the next observation. Notification
shortens the tick; it never carries state.

### Where does an agent's free reasoning sit?

Inside a node whose out-edges are the five exit types (§7.1). The
reconciler parses; anything not in the grammar is `stalled` with the
text as evidence. The session's git operations are refused by hooks in
its place and denied by its agent settings.

### How is the plan derived, and what makes it impossible to miss a row?

A row is an unanswered artifact on an in-edge of the operator node,
found by a query over the stores on every read (§7.3, §8). No process
emits rows, so no process can forget one. A row's number is fixed by the
rendering record so a late reply still names the right row.

### What is the minimal set of stores?

Fourteen edge stores (§5), each the one source of truth for the states it
proves; plus read-only evidence in the books and built repositories and
the world (herdr, wt, git host).

### How does curation connect without the flywheel batching signals?

The queue is the set of signals with no move; the curation node keys on
that set and fires by threshold or cadence (§12). Adapters append;
nothing in the flywheel counts or buffers.

### Where does the ledger live, who writes a verdict, and how does a stale verdict become a row?

`ledger/<repository>.rec` in the books repo; planning and any stage
declaring a verdict edge write it through the engine with a
deterministic effect id; staleness is a derivation that moves the
backlog fingerprint, which fires planning, whose proposal is the row
(§9.2). The moved row is derived directly.

### Which profile is built first, and what proves the second conforms?

Git-only first: its compare-and-swap is the git host's own, its audit is
history, and its status page needs no process, so every guarantee of
B.2 is met by one mechanism. The tracker profile is second. The proof
that a profile conforms is `conformance/` run with the profile's
binding and no change to `machines/`: the suite references only
evidence and effect names, the harness maps them through the binding,
and every scenario of B.1 and B.2 must pass. A binding with an
unsatisfied name fails to load (B.3.127).

### Where is the engine/domain line, and what forces a need to the domain side?

§6.3. The engine has combinators and the contract; the domain has atoms.
A need is domain unless it is a new contract operation or a new
combinator over any edge store; the vocabulary test on the engine
crate makes the other direction fail to build.

### Where does planning sit; what tells it the backlog changed; how does it see open bolts?

An agent node keyed by `(repository, backlog fingerprint)` (§9.1). The
fingerprint changes when a claim stands, a verdict is written or goes
stale, or an ask names the repository. Its work order lists every open
bolt of the repository with the units each holds.

### What is the cadence rule for a take, and what proves a place is current?

§10: before a place is prepared, on the manifest's cadence, and before a
landing, whenever the line is behind its parent. The activation records
the place's base and the line's head as equal at the read point;
`session.start` will not fire otherwise.

### Are claims OpenSpec requirement blocks or fenced blocks with a hash lock?

Fenced `claim` blocks in the chapter, hash-locked by a pre-commit hook
(§13).

### What is the layout of state in git, and what does a race look like?

One state repository, one shared branch `main`, one file per object
holding all of its artifacts as appended records (§15). A race between
two hosts is two pushes; the second is rejected; the loser rebases and,
if the same object was touched, drops its commit and reads again.

### How does a phone reply become a commit, and how is the status page served?

The word writer (§15) commits the reply and reacts after the push; the
status page is a static build force-pushed to branch `status`, served by
the operator's own means.

### How is history kept from growing without bound?

No renewals on `main`; heartbeats and the status page on single-commit
force-pushed branches; observations committed only when they change a
derived state; verdicts re-judged only on a claim version move (§15).

### What replaces a comment thread in the git-only profile?

The object's file, rendered in order by the status page; notes are exits,
answers are words (§15).

---

## 17. Scenario walk

For each: the states that move, the effects, the rows created and
retracted. Ids are the ones of §4 where they fit.

**S1 — approve an elaboration from the phone.** Row `elab` on
`pr-el-…@1` in APPROVE. The reply `yes 1` reaches the presenter; word
`(pr-el-…, 1) = yes` is written by CAS; the bot reacts. Next tick:
`instantiate` fires on the word (key = word id) and writes the
elaboration record `Approval: wd-…`; the row's retracting predicate
holds. The elaboration derives `approved`; `git.place.prepare` fires
(effect id from the place), then the elaboration node's activation is
taken and `session.start` runs. Later ticks find the activation live
and the approval word present; no predicate anywhere asks "is this
approved" except the derivation, which reads the word. A second
delivery of `yes 1` finds the word written and is acknowledged only.

**S2 — a standing prototype goes idle.** The elaboration's type is
`standing`; its session is observed idle past `idle-window`; the
derivation says `idle`; the row `idle` forms in DECIDE ("finish · keep").
No effect fires: the type's subgraph has no stall edge, and `retire`
requires the word. The next morning the pane is still there, the
activation still live, the row still standing.

**S3 — a chore offered and accepted.** The build session's exit block
`chore` (payload: repository, line = the shared line, the file, the
fix) is written by the reconciler as an exit; the session continues to
`done`. Row `chores` groups it under the repository. `yes 4` (or `4 pick
a`) is a word; `instantiate` writes a unit of type `chore` with
`Line: shared`, one item, no change directory; `git.place.prepare` off
the shared line, one stage session, `done`, `git.merge` by the
repository's policy (direct for the books; a PR for a built repository
with gates). No bolt record is written: the chore type's template has
`lands-on: named-line` and `instantiate` creates a bolt only for a
`unit` proposal with `NewBoltName`. I8 holds by the template.

**S4 — a finding dropped.** The exit `finding` names the session's own
intent; `instantiate` writes an elaboration proposal on that intent (or
amends the awaiting one, bumping its generation). Row `elab`. Word
`drop`. The proposal carries `Word: drop`; nothing else was written.

**S5 — restart mid-day.** Every host's memory is empty on start. The
tick reads the same stores as before; every activation is live and its
session is observed alive; derivations return the same states; the row
query returns the same rows with the same rendering (fingerprint
unchanged, so the presenter does not fire). No effect runs: each effect
id already exists in the store. I7.

**S6 — a slow start.** Activation taken; `session.start` runs; herdr's
start times out at 60 s. The runner retries `herdr agent list` every 15
s up to `start-window` (5 min); the pane appears at 2 min; the session
record is written. Nothing is `stalled` (that needs an alive-then-idle
observation past `stall-window`), no second `start` runs (same name,
and the effect id is the activation).

**S7 — close an intent.** All elaborations derive `done`; row `close`
in DECIDE. Word `close`. `git.archive` fires: OpenSpec archive of the
intent's change on `intent/<id>`, the books policy lands it on `main`,
the line is deleted, the intent's records are moved under
`objects/intent/archive/` (git-only) or the milestone closed (tracker).
The intent derives `closed`. Two claims moved from proposed to standing
because they now exist on `main`; the backlog fingerprints of the
repositories in their scope changed; planning will fire next, which is
new work, not "something else moving" on the intent.

**S8 — twenty signals.** The adapter wrote one capture and twenty
signals. `curation` fires (threshold 10) with key = the twenty ids. Its
`done` delivers twenty moves (six attach, nine drop, five join into two
proposals, one proposal's `Challenges: providers/one-writer@7f3a2c1`)
and two intent proposals with weight (5 signals · 2 sources · 12 d).
The engine writes the moves and proposals. Two rows `intent`. Every
signal's move is a record in `signals/moves.rec`.

**S9 — a claim moves under an open bolt.** The build session offers a
finding about the claim (its own bolt's subject is the claim, but the
claim belongs to an intent) → the exit's subject is an intent, not the
session's own → `signal-writer` writes a signal (capture = the session);
curation attaches it to the open intent as an elaboration proposal
(`elab` row); the operator accepts; the elaboration amends the claim;
the intent closes (S7). The standing version is now `vM`. The bolt's
unit covers `vN`: the **moved** row forms in DECIDE. The fingerprint
moved, so planning also fires and proposes a unit for `vM` whose row
waits (validity predicate: no unanswered moved row for its bolt). The
operator picks `amend`: the bolt's affected items get an advance to
stage 1 with `Reason: amend`, the follow-on proposal is retracted
(`Word: superseded`). Or `follow`: the bolt continues, the proposal's
row appears. No item was rebuilt without a word.

**S10 — a repository joins.** The manifest gains the repository; its
ledger file is absent; the backlog fingerprint is every standing claim
in scope with no verdict. Planning fires once; its work order says
`ledger: empty · judge scope of every claim`. Its `done` delivers a
verdict per claim (`not-applicable` for the ones that do not concern the
repository; `not-satisfied` for the rest) and one proposal set with
`RoutedFrom: first-planning` holding units and chores. The verdicts are
written with effect ids `(repo, claim, version, revision)`; the row is
`baseline`. Not-applicable verdicts are `current` until their claim's
version moves, so the fingerprint excludes those claims and they are
never judged again.

**S11 — forty commits, no claim change.** The fingerprint reads claims
(unchanged versions), verdicts (unchanged, evidence paths still present
at the new head), asks (none). It is equal to the last planning's.
Nothing fires; no verdict is written; the row set is unchanged; the
presenter does not fire.

**S12 — status view from the phone with nothing running.** Tracker: the
board and the issues. Git-only: the `status` branch page as of the last
tick's `main` sha. Every bolt, unit and session by derived state, with
`Host` from its activation and the host's heartbeat age.

**S13 — a host loses power mid-build.** `mac-mini` holds
`ac-stage-build-wi-418-…` and its heartbeat stops. After `lease-ttl`
the other host derives `host stale`; the ATTENTION row `host-stale`
forms ("takeover on studio · wait"). The other host's `when` for that
key finds a live activation and does not fire; it never touches the
place. If `mac-mini` returns, its heartbeat is fresh, the session is
re-observed, the row retracts, the build resumes. If the operator says
`takeover`, the activation's generation moves (a new activation record
on `studio`, the old marked `superseded`), `studio` prepares a fresh
place off the line and starts a fresh session whose work order says
what the old one had committed in its place (its pushed branch, if any).
When `mac-mini` reconnects it finds itself superseded, retires its
session, and reports. The build ran on one host at a time.

**S14 — two send-backs, then merge and land.** Review's `done` with
`verdict: not-done` → `join` writes `ad-wi-418-2: review → build,
attempt 2, bound 3`; the build stage's activation key is `(wi-418,
build, attempt 2)` so it fires afresh. Again: `ad-wi-418-3, attempt 3`.
Third review passes: `ad-wi-418-4: review → merge`; the item derives
`ready-to-merge`; `git.merge` takes the bolt line, merges the place,
records `fx-merge-…`; the item derives `merged`; the unit `finished`;
the bolt's row `land` forms; `yes` → `git.land`. The item's file holds
the four advances with `Attempt` and `Bound` (S14's history).

**S15 — a session tries to create a line.** `git checkout -b` in the
place hits the `reference-transaction` hook (refused), or the PreToolUse
deny before that; the refusal is in the pane log; the reconciler writes
observation `refusal` on the session; the run report shows it. The
lines are unchanged because the only writer of refs is the git node.

**S16 — a dictated scenario.** The operator's sentence goes to a
`scenario-writing` session (an elaboration of the self-closing type on
the flywheel's own intent, or a direct `flywheel scenario "…"` command
that runs the same skill) whose deliverable is a file matching
`conformance/scenario.schema.json`. `fw-engine`'s scenario runner loads
it with the in-memory control plane, runs the ticks, and writes the
trace (`given → derived states → fired nodes → effects → rows`) as
markdown beside it.

**S17 — two hosts, one approved unit.** Both derive the unit `approved`
and its first items `queued`; both try `lease.take(stage/spec, wi-…,
gen 1)`. Git-only: both commit an activation record to the item's file
and push; the second push is rejected (stale base); the loser rebases,
hits a conflict in the same file, drops its commit, reads again, sees
the winner's activation, and moves to other keys. Tracker: both post
comments; both read; the lower comment id wins; the loser edits its
comment to `lost` and moves on.

**S18 — an hour offline.** The host keeps its session; the session
exits `done`; the host writes the exit locally. `git.merge` into the
bolt line runs locally only if the host already held that line's merge
activation before the drop; otherwise the merge waits for reconnect. It
cannot push, so nothing lands on `main`. On reconnect: fetch; rebase its local commits
(its own objects' files); push; push the bolt line; the status page
rebuilds on the next tick. The other hosts' commits are in `main`
already and were never rewritten.

**S19 — a state file edited by hand.** The operator sets `State:
closed` in an intent's file and commits to `main`. Every host's next
tick reads the file; the reconciler's `direct-word` table maps that
line to `close`; a word with `Via: direct:<sha>` is written (CAS, so
one host writes it); `git.archive` fires from the word. No process was
told.

**S20 — the status page six hours later.** The `status` branch holds
the last build; its first line says `as of 3fa9c2e · 2026-09-04 16:02`.

**S21 — a forwarded message.** `flywheel capture forward` on the bot:
one capture (`SourceKey: discord:<message id>`), one signal with the
excerpt and a link back. No node fires until curation's threshold or
cadence.

**S22 — the same transcript twice.** The second import computes the
same `SourceKey`; the capture write is a no-op; no signals are written
(the signal-reading session is keyed by the capture id and has a
completed activation).

**S23 — drop a proposed intent.** Word `drop` on the intent row;
`instantiate` writes a move `drop · reason: proposal pr-in-… dropped by
wd-…` for each of the five signals. They are no longer unmoved; the next
curation key excludes them.

**S24 — revive a signal.** Dictation `revive sg-…` is a word with no
row; `instantiate` replaces the signal's move record with none (a
`revived` record follows it in the file; the derivation takes the
latest). The next curation run's key includes it.

**S25 — an elaboration amends a claim.** The session's commit changes
the chapter, the claim block (the hook moves `version`), and the context
map, as the default instruction requires. After the archive lands the
intent line, the review view diffs the books from the operator's mark
to the head and lists the chapter and the map node. The operator's
`reviewed` word moves the mark.

**S26 — a unit type with a persona fan-out.** The operator commits
`flywheel/types/persona-test.yaml` with a stage `members: {rule:
{files: "personas/*.md"}}, join: all`. No code changed; the engine's
loader reads the new template on the next tick. The next unit proposed
with `Type: persona-test@<sha>` instantiates the stage with three member
keys in a three-persona repository and five in a five-persona one; each
member is an activation and a session; `join` waits for all five
terminal exits; every exit, finding, chore and signal is a record on the
item. A unit already in flight under `persona-test@<older sha>` keeps
its template because its activations carry that version.

**S27 — one intent, two repositories.** Archive lands two claims on
`main`. Both repositories' fingerprints move; planning fires once per
repository (two keys). Repository A's proposal: two units,
`NewBoltName: atlas-retry-behaviour`; repository B's: one unit,
`TargetBolt: bo-plan-rows`. Rows `unit` × 3. Words: `1 rename retry`,
`3 new bolt other` — each a word on its row with args; `instantiate`
creates bolt `retry` and bolt `other` and the units. No order between
bolts exists anywhere.

**S28 — a bolt open three weeks.** After each merge `git.place.rebase`
refreshes the bolt's own place; the operator tests there. Dictation
`bolt plan-rows: fix the flicker on rerender` is a word with no row;
`instantiate` writes a unit of type default with `Approval: wd-…` and
its items (I1: the dictation is the approval). Next day a session on
another bolt offers a finding whose subject is `bo-plan-rows`. That is
not the session's own bolt, so `signal-writer` writes a signal with
`Tags: bolt:bo-plan-rows`; the signal names the repository, so the
backlog fingerprint moves; the next planning for the repository sees
the signal in its work order and proposes a unit with `TargetBolt:
bo-plan-rows, RoutedFrom: finding fd-…` (A.5.31); row `unit`; yes.
Both units carry `After`. When every unit is finished the `land` row
forms; `yes` lands it.

**S29 — three items, bound two.** Items 1 and 2 have `After: none`;
item 3 `After: wi-1 wi-2`. Both hosts' bound is two. The scheduler
orders ready keys and takes two activations; item 3's `when` requires
`dependencies-merged`, false. Items 1 and 2 merge (serialised); item 3
derives `queued`; a slot is free; its activation is taken; it starts. A
restart between finds the two activations live and the sessions alive;
it starts nothing.

**S30 — blocked.** Exit `blocked` on `wi-418` with the question; row
`blocked` in ANSWER; the other items of the bolt keep advancing and
merging (their derivations do not read `wi-418`). The operator answers
on the page; word `(ex-…, 1) = <text>`; the session is observed alive;
`session.tell` delivers it; the session continues. The exit and the
word are records in the item's file; the status view's block count for
`(default, build)` is one higher.

**S31 — yes at 07:40, look at 16:00.** Word yes at 07:40; `instantiate`
→ items queued → activations → sessions → exits → advances → merges,
all by predicates over stores, no word asked. At 16:00 the rendering's
tail lists the item transitions after `rn-0912`'s `At` and the only new
row is `land`.

**S32 — side-by-side builds, one rebase, one conflict.** Unit A's item
merges; the bolt line moves. Unit B's place is `behind`; its session is
`working`; `git.place.rebase`'s `when` is false. The session goes idle;
the rebase fires; it conflicts; `git rebase --abort`; a conflict
artifact on the place; `resolve` fires in that place with the item's
work order; the session resolves and exits `done`; the rebase retries
and succeeds; `session.tell(moved)`; B's session continues, later exits
`done`, and `git.merge` lands it.

**S33 — cadence takes and a failed landing.** Each morning the cadence
atom is due and the line is behind: `git.line.take` merges `main` into
`bolt/<id>` and rebases the bolt's place. On `yes` to land: take once
more, then `git.land` with policy `pr`: `gh pr create`, wait for the
checks; the reconciler observes `gate: failed`; the effect record says
`Result: gates-failed <url>`; the bolt derives `failed-landing`; the
`land` row is retracted (the word was applied) and an ATTENTION line
shows the failure; nothing fires toward any session until the operator
dictates a unit or a chore on the bolt.

**S34 — a research elaboration and a standing prototype.** Research
exits `done`: `git.merge` place → `intent/<id>`; `git.place.remove`.
The prototype's place is `behind`; its session idle; `git.place.rebase`
onto the intent line; kept. The operator says `finish` on the idle row;
the prototype derives `done`; `retire`. All elaborations done → `close`
row → `close` → `git.archive` lands `intent/<id>` on the books `main`;
the two claim blocks now exist there, so they derive `standing`.

---

## 18. Invariants, where each is held

| invariant | held by |
|---|---|
| I1 | `instantiate` writes an object only from a word (or dictation, which is a word); the record carries `Approval` |
| I2 | word identity `(row, generation)` with CAS; application keyed by word id; unapplied words become a row |
| I3 | `machines/rows.yaml` has one `create` and one `retract` per row kind; the schema requires both |
| I4 | §5 table; the schema requires each derivation to name one store per predicate |
| I5 | `session.tell`, `place.rebase`, `session.retire` require `observed ≠ working` |
| I6 | the standing and with-operator templates have no stall edge and `retire` requires the word `finish` |
| I7 | the tick holds nothing; every activation and effect is a store record; S5 |
| I8 | the chore template has `lands-on: named-line`; `instantiate` creates a bolt only for `NewBoltName` on a unit proposal |
| I9 | the `asbuilt-names-standing-claims` gate on the spec stage; the default instruction |
| I10 | verdict effect id `(repo, claim, version, revision)` |
| I11 | one activation per `(node, key, generation)`; the status view shows `Host` |
| I12 | the git node is the only producer of line and place artifacts; sessions are refused by hooks |
| I13 | definitions name evidence and effect names only; `schema.json` forbids `path`, `label`, `column`, `field` keys outside `bindings/` |
| I14 | git-only: host memory holds observations that decide nothing after restart and commits about to push |
| I15 | one file per object; a stale push is rejected; a same-file rebase conflicts |
| I16 | `session.start` requires `place-current`; rebase and merge require idle |

---

## 19. Decisions taken without asking

- Signals, moves, the ledger, types, instructions, hooks and the context
  map live in the books repository in both profiles; the tracker holds
  objects only.
- The state repository in the git-only profile is separate from the
  books; one shared branch; one file per object.
- Heartbeats and the status page are force-pushed single-commit
  branches, not history.
- Takeover of a session-backed activation needs the operator's word;
  effect-only activations are taken over automatically after the ttl.
- Claims are fenced blocks in chapters with a hash version.
- Planning writes verdicts; stages write them only when their type
  declares the edge.
- The moved row is machinery-derived; planning's follow-on proposal
  waits behind it.
- A finding about a bolt other than the session's own is a signal that
  planning may route, not a direct proposal.
- `yes all` is bound to the rendering it answers.
- The git-only profile is built first.
- The house-style diagrams are hand-drawn and checked against the
  definitions by a test on element ids (`diagrams/check.py`), not
  generated (gaps.md).
- The `forward` adapter writes one signal directly, the operator's one
  word being the judgment; every other adapter writes only the capture
  and leaves the signals to a session (A.15.102 against S21, gaps.md).
- Every object file's first record carries a `State:` line as a
  projection so that a hand edit to it can be read as the word (S19);
  the derivation never reads it.
- A type corrected after approval is a dictation: an elaboration's type
  changes at its next activation; a unit's type is refused once an item
  has an activation, and the word is reported unapplied (A.5.49).
- A claim's scope corrected by word is a chore on the books shared
  line, because scope lives in the claim block.
- The conformance suite lives under `conformance/`, one file per
  contract operation and guarantee plus the section 11 scenarios that
  hit the control plane; the profile-specific scenarios of section 11
  are walked in §17 and must pass on every profile all the same.
