# The statechart-tracker model

A model of the flywheel in which **every durable object carries an
explicit state machine defined as data**, the machines are stored as
TOML files that the machinery executes and the diagrams are checked
against, and everything else — the plan, the status view, the backlog,
the reports — is a pure function of those machines' states read from
durable stores.

The model has one shape and it fits in a paragraph. Thirteen machines are
defined in `machines/*.toml`. Twelve are **reconciled**: their state
lives in a durable store, and a stateless pass recomputes what should
happen and writes it, over and over, safely. One of them — `session` — is
**event-driven**: it advances because something happened on a host. The
two meet at exactly two points. A reconciled machine asks for a session
by writing a work order; a session answers by writing an exit record.
Nothing else crosses. Inside a session's `working` state an agent reasons
freely; that single state is the only unconstrained place in the whole
model, and it can only be left through a fixed alphabet of exits that the
machinery validates rather than trusts.

### What is in this directory

| file | what it is |
|---|---|
| `machines/_schema.toml` | the meta-definition every machine file satisfies, and the checks `fwn check` runs over them |
| `machines/signal.toml` · `curation.toml` | the intake machines: the record an adapter appends, and the run that judges it |
| `machines/intent.toml` · `elaboration.toml` · `finding.toml` · `chore.toml` | the design-side machines |
| `machines/bolt.toml` · `unit.toml` · `work_item.toml` | the construction-side machines |
| `machines/session.toml` | the one event-driven machine, and the exit alphabet |
| `machines/ledger_cell.toml` · `lease.toml` · `word.toml` | the cross-cutting machines |
| `flywheel-next-*.svg` | six diagrams, one per machine family; every state glyph carries a `data-fwn-state`, `data-fwn-row` or `data-fwn-machine` attribute that `fwn check --diagrams` matches against the TOML |

---

## 1. Assumptions

Stated because the requirements do not settle them.

1. **The organization is `agentplot` and the blueprints repository is
   `agentplot/blueprints`** — this repository. The manifest, the design
   book, the machine definitions, the ledger and the host leases all live
   here.
2. **The machinery is a new Python package `flywheel_next`, CLI `fwn`, in
   a new repository `agentplot/flywheel-next`**, installed on each host
   with `uv tool install`. Code lives there; *definitions* live in the
   blueprints repo, so adding an elaboration type or a construction stage
   needs no release of the machinery (requirement 44).
3. **GitHub is reached through the `gh` CLI** (`gh issue`, `gh api`,
   `gh api graphql`), not a Python SDK. It is already installed and
   authenticated on every host, its output is JSON, and it keeps the
   machinery's dependency list at zero for the parts the tests exercise.
4. **The machine files are TOML, read with `tomllib`.** The requirement
   says "YAML or similar"; TOML is in the standard library from Python
   3.11, so the definition parser, the checker and the tests need no
   third-party package (requirement 43, and section 7's "tests use only
   the standard library").
5. **Diagrams stay hand-authored in the house style, and drift is
   prevented by a checker rather than by generation.** Requirement 42
   asks that the picture cannot drift from the runtime. Generated
   box-and-arrow pictures would satisfy the letter and lose the house
   style, which is the form the operator actually reads. Instead every
   state and transition glyph in the SVGs carries a `data-fwn-state` or
   `data-fwn-transition` attribute, and `fwn check --diagrams` asserts a
   **total bijection**: every id in a diagram exists in a machine file,
   and every state and transition in every machine file appears in
   exactly one diagram. Adding a state without drawing it fails CI.
6. **The served page is reachable from the phone over Tailscale**
   (`tailscale serve`), not over the public internet.
7. **Chat is Discord**, one channel `#fwn-plan` for rows and one
   `#fwn-ops` for machinery problems.
8. **"Standing session stays alive" means the herdr pane stays alive.**
   The daemon may restart, the host may not reboot. A host reboot loses
   standing sessions; the model reports that as a stalled standing
   session on the plan rather than pretending otherwise.
9. **One operator, per the non-goals.** Any word from any account other
   than the operator's is ignored and logged.
10. **Signals, moves and clusters live on the `flywheel-state` branch,
    not on `main`.** They are high-churn append-only operational records
    written by many adapters at once, and putting them on `main` would
    bury the design history under them. The branch already exists for
    leases and its push is a compare-and-swap, which is exactly what
    concurrent appenders need. What lands on `main` and on the tracker is
    the *outcome*: the proposed intent, with its citations.
11. **The curation cadence and threshold live in `policy.rec` on `main`
    of the blueprints repo.** Requirement 65 has the machinery charge a
    curation run without a word, which invariant I1 would otherwise
    forbid. That record is the approval I1 asks to be pointed to: the
    operator wrote it, and turning curation off is an edit to it.

---

## 2. Which objects carry a machine

Section 8's first question.

| carries a machine | why |
|---|---|
| `signal` | one record, two states, and exactly one move — the smallest machine in the model |
| `curation` | one run: charged by a policy, worked by a session, settled when its snapshot has moves |
| `intent` | it has an operator-owned close and a lifecycle independent of its children |
| `elaboration` | it has an approval, a session, and a type-dependent end |
| `finding` | it has one operator decision with three outcomes |
| `chore` | it has an approval, a session and a merge, and no stages |
| `bolt` | it opens, accumulates, and lands once, on a word |
| `unit` | it is the thing approval turns into work |
| `work_item` | it walks a stage list and merges in an order |
| `session` | the one event-driven life |
| `ledger_cell` | a (claim, repo) pair with guarded transitions and a plan row |
| `lease` | ownership of an object by a host, with a stated takeover rule |
| `word` | one decision, given once, applied once — the machine that carries I2 |

**Attributes of another object's state, deliberately not machines:**

- A **claim's** proposed/standing status. It is derived: a claim written
  in a chapter that sits under an open OpenSpec change is proposed; when
  the intent closes, the OpenSpec archive step moves the chapter's change
  into the standing set and the claim is standing. Requirement 47 needs
  no machine of its own because it is a projection of `intent`'s state.
- A **claim's scope**. A field of the claim block, corrected by the
  operator's word through a `writeback` elaboration.
- **As-built**. A property of a built repository's archived OpenSpec
  specs, each naming `claim` and `claim_version` in its front-matter.
  Nothing about it has a lifecycle the flywheel drives.
- **The plan**. Explicitly not a machine and not a store. See §6.
- **The status view**. A saved view over the Projects board.
- **A repository's backlog**. A query, never a list (requirement 51).
- **The elaboration type and the bolt's stage list**. Parameters that
  select transitions, not states.
- **A move**. Not a machine: it is the *evidence* for `signal.moved`,
  written once by curation and never revised. `%key: signal` in
  `moves/*.rec` makes a second move for the same signal impossible, and
  that file constraint is the whole of requirement 62.
- **A cluster**. Not a machine either: it is the record
  `intent.i.propose_from_cluster` reads to write one proposed-intent
  issue, carrying the title, the challenged claim and the weight.
- **A finding's subject**. A parameter, checked by the machinery against
  the offering object's own thread, that selects one of two transitions:
  a row on that thread, or a signal (requirement 25).

### How the machines relate

Three relations, and no others:

**Containment.** `intent ⊃ elaboration`, `bolt ⊃ unit ⊃ work_item`. A
parent's transitions *read* children's states (`children_all:unit:finished`)
and never write them. A child never reads its parent's state except
through a guard that names it (`state:intent:open`). There is no UML
nesting, no shared history state, no orthogonal regions: a parent is
simply a machine whose guards are aggregates over its children. That is
what makes the whole system reconcilable — every guard is a query.

**Delegation.** Any reconciled machine may own **at most one** session at
a time. The parent's `request_session` effect writes a work order; the
session machine takes it from there; the parent's next transition is
guarded on `state:session:exited`. The session never writes the parent.

**Cross-cutting attachment.** `lease` attaches to any object; `word`
attaches to any object. Neither is contained by anything. Both are
machines because both have real states and real rows.

---

## 3. Where event-driven meets reconciliation

Section 8's second question, and the spine of the model.

**Reconciliation** is one function:

```python
def decide(snapshot: Snapshot, machines: Machines) -> list[Action]
```

`Snapshot` is a frozen dataclass built by reading the stores once:
issues and their labels, milestones, Projects field values, `*.rec`
files, the claim blocks, and `herdr agent list --json`. `decide` is pure:
no clock, no network, no randomness, no memory of previous passes. For
every object it finds the machine, finds the state, and evaluates every
transition whose `from` matches and whose guard holds. It returns
actions. `apply` performs them. The daemon loop is:

```
while True:
    snap = read_stores()
    for action in decide(snap, machines):
        apply(action)          # every effect is compare-then-write
    sleep(20)
```

Requirement 38 falls out: `decide` on an unchanged snapshot returns the
same actions, and every effect is a compare-then-write, so the second
pass performs no writes at all. Requirement 35 falls out: the loop holds
nothing between iterations. Requirement 6 and invariant I7 fall out:
restarting the daemon just runs `read_stores()` again.

**Event-driven** is the `session` machine alone. Its transitions fire on
observations: a pane appeared in `herdr agent list --json`; the agent
went from `busy` to `idle`; `exit.json` appeared and parsed. Those are
facts about the world, not derivations from the tracker.

**The two meet at exactly two points, and they are files.**

| direction | artifact | written by | read by |
|---|---|---|---|
| reconciled → event | `run/<session_id>/work_order.md` and the `herdr agent start` that follows it | the machinery | the agent, as its whole brief |
| event → reconciled | `run/<session_id>/exit.json` plus the same block posted as an issue comment | the agent | the machinery, on its next pass |

Nothing else crosses. A session cannot move an issue's labels — the
agent definition does not give it that job, and if it did anyway, the
reconciler would read the labels, find them inconsistent with the machine
and repair them, logging a `projection-repair`. A durable machine cannot
reach into a session — the only thing it can do is queue a message that
is delivered when herdr reports the agent idle (requirement 31,
invariant I5).

So the answer to "how does one drive the other" is: **the event machine
drives the reconciled machines by depositing a record, and the reconciled
machines drive the event machine by depositing a work order.** Both
records are durable files, so a restart on either side loses nothing.

---

## 4. Where an agent's free reasoning sits

Section 8's third question.

Free reasoning sits in **one state of one machine**: `session.working`.
Every other state in the model is a state a machine is in *because a
predicate over a store says so*.

The exits are kept to the fixed set by three mechanisms, in order of
strength:

1. **The alphabet is data.** `machines/session.toml` `[exits]` lists
   `done | question | stalled` as terminal and `finding | chore` as
   non-terminal offers. The work order embeds this list verbatim.
2. **The reader validates, it does not trust.** `exit.json` is parsed and
   checked against `[exits.schema]`. An exit verb outside the alphabet,
   a malformed file, or no file at all on an ended pane all read as
   `stalled`. The agent cannot invent a sixth exit because the machinery
   has no branch for one.
3. **The agent definition is fixed.** `.claude/agents/fwn-design-session.md`
   and its siblings, in the blueprints repo, state the protocol and the
   prohibition: report, never act outside the job; never start other
   work; never touch another object's state.

A subtlety requirement 29 and requirement 25 create together:
requirement 29 lists "offering a finding" and "offering a chore" among a
session's exits, while requirement 25 says a finding never interrupts the
session that offered it. The model resolves this by making offers
**non-terminal**: an offer is a self-transition with an output. The agent
appends one JSON line to `run/<session_id>/offers.jsonl` and carries on
working; the reconciler opens the finding or chore issue on its next pass
and the session never learns about it. The terminal exit alphabet is
three verbs.

---

## 5. The operator's word

One decision, one artifact, applied once.

Three input paths, one output. A Discord reply (`y 3`, `finish 7`,
`accept all`), a click on the served page, or the operator moving a card
on the Projects board by hand — all three produce exactly one
`flywheel-word` comment on the target issue. The board move is read from
the issue timeline (`ProjectV2ItemFieldValueChangedEvent`, actor not the
bot) and converted once, keyed by the event id (requirement 3).

````
```flywheel-word
word_id: 9c41e8a2f0b3
row: row.elaboration.keep
target: agentplot/blueprints#418
verb: keep
source: discord/1179...41/msg/1284...09
given_at: 2026-09-04T08:12:07Z
given_by: cswanberg
```
````

`word_id = sha256(issue, row_id, verb, source_event_id)[:12]`, so the
same decision arriving twice — a reply and then a board move — collapses
to one comment.

**Applied-ness is never a flag.** A word is applied iff the target object
is in a state the word's transition leads to. That is why nothing is
applied twice and nothing is lost: applying is a compare-then-write
against the target, and re-reading the word finds the target already
there (`wd.already`, effect list empty). If no transition matches the
verb and the target's current state, the word becomes `unapplicable`, a
reason comment is written and a `row.word.unapplicable` row appears
(requirement 5). Silence is not a possible outcome.

**Dictation skips the plan.** "add this idea about X" in `#fwn-plan`
opens an intent issue directly in `proposed`… and "do this chore: Y in
repo Z" opens a chore issue directly in `accepted`. Both are words
without rows (requirement 11).

---

## 6. How the plan is derived, and why a row cannot be missed

Section 8's fourth question.

**The plan is not stored anywhere.** `fwn plan` is a pure function of the
same `Snapshot` the machines read:

```python
def plan(snap: Snapshot, machines: Machines) -> list[Row]:
    return [Row(spec, obj)
            for spec in machines.rows          # every [[rows]] in every file
            for obj in snap.objects_for(spec.machine)
            if holds(spec.when, obj, snap) and not holds(spec.until, obj, snap)]
```

Requirement 6 and requirement 7 are the same sentence about this
function: the plan is always current because it is never a document, and
it is identical after a restart because it reads only stores.

Requirement 8 and invariant I3 are structural: every `[[rows]]` entry has
exactly one `when` and exactly one `until`, and `fwn check` refuses a
definition where `when ∧ until` is satisfiable.

**What makes a row impossible to miss is a static exhaustiveness check,
not vigilance.** Every state in every machine file declares a `kind`.
`fwn check` asserts:

> for every state with `kind = "waiting_operator"`, some `[[rows]]` entry
> in the same file names that state in its `when`.

A state that waits on the operator and produces no row fails CI. There is
no path by which the machinery can park an object in front of the
operator and forget to say so, because "waits on the operator" and
"produces a row" are the same declaration checked two ways. The converse
check runs too: every row's `when` must be reachable from some state.

The check also settles the opposite question. `signal.toml` declares two
states, neither of them `waiting_operator`, and therefore carries no
`[[rows]]` at all. Requirement 64's "never a row per signal" is not a
rule anyone has to remember; it is what the definition says, and adding a
row for signals would mean first declaring a signal state that waits on
the operator.

**Grouping** (requirement 10). Each row carries a `group` — `intents`,
`bolts`, `offers`, `standing`, `closes`, `questions`, `claims`, `hosts`,
`machinery`. The Discord message posts one block per group, numbered
within the group, and `y all` answers a group; `y 3` answers one row.

**Surface** (requirement 2). A row's `surface` is `chat` when its answers
are short verbs, `page` when the operator needs to read a document (a
unit breakdown, a session's question, a claim-drift choice), and
`chat+page` when both work. The Discord message for a `page` row is a
one-line summary plus the deep link.

---

## 7. The stores

Section 8's fifth question. Six stores, and the source of truth for every
state is named in each machine file's `truth` key.

### 7.1 GitHub — issues, milestones, Projects v2 (org `agentplot`)

Source of truth for: intent, elaboration, finding, chore, unit,
work_item state (labels); bolt state (milestone description
front-matter); the operator's word (comments).

Board **"Flywheel Next"**, fields: `Status` (Proposed · Ready · Running ·
Waiting · Blocked · Done · Dropped), `Kind`, `Type`, `Stage`, `Bolt`,
`Repo`, `Host`, `Host Seen`, `Session`. Every board field is a
**projection**, written from the labels, never read as truth — except the
one operator-move signal described in §5.

One record, as `gh` returns it:

```json
{ "number": 418,
  "title": "prototype: plan derivation on a live snapshot",
  "labels": ["fwn", "fwn:elaboration", "fw:running"],
  "milestone": null,
  "body": "parent: #402\ntype: prototype-live\n…",
  "projectItems": [{ "Status": "Running", "Type": "prototype-live",
                     "Host": "mac-studio", "Session": "fwn-20260904-0731-4c1a" }] }
```

A bolt is a milestone whose description carries front-matter:

```
---
fwn: bolt
repo: agentplot/switchboard
branch: fwn/bolt-plan-rows
state: open
stages: [proposal-review, spec, build, test, code-review]
---
```

### 7.2 The blueprints repository, `main` — `agentplot/blueprints`

Source of truth for: claims, the manifest, the ledger, the machine
definitions, the design book.

- `blueprints/flywheel-next/src/**.md` — the mdBook. A claim is a fenced block
  **inside the chapter that explains it**, so the two cannot drift
  (requirement 46):

  ````
  ```claim
  name: plan-row-single-source
  version: 3
  scope: kind=machinery
  text: >
    Every plan row has exactly one creating condition and one retracting
    condition, both evaluated against the same snapshot.
  scenario: >
    Two consecutive `fwn plan` runs with no store write between them
    return byte-identical output.
  ```
  ````

- `claims.lock` — one line per claim, `sha256` of the block's text.
  `fwn check` fails when a block's hash moved and its `version` did not.
  That is what makes "a version moves only when its text moves" a fact
  rather than a convention.
- `manifest.rec` — the repositories the flywheel tracks:

  ```
  %rec: repo
  %key: name

  name: agentplot/switchboard
  kind: service
  capability: tracker-writer
  capability: page-server
  joined: 2026-09-04
  ```

- `ledger/<owner>-<repo>.rec` — the verdicts. One record:

  ```
  %rec: verdict
  %key: id
  %type: state enum satisfied partial unsatisfied not_applicable

  id: v-0f3a91
  claim: plan-row-single-source
  claim_version: 3
  claim_hash: 9c2b41e8d7a0
  repo: agentplot/switchboard
  repo_rev: 8f21c0d
  state: satisfied
  evidence: openspec/specs/plan/spec.md#derived-rows
  evidence: tests/test_plan_rows.py::test_two_reads_no_writes
  judged_by: fwn-20260901-1142-7b3e
  judged_on: 2026-09-01
  + the derived view is recomputed per call; no cached list exists
  ```

  Queried with `recsel`. The backlog is
  `recsel -e "state = 'satisfied' || state = 'not_applicable'"` subtracted
  from the in-scope claim set — computed at read time, never stored
  (requirement 51).

- `policy.rec` — the standing policy the operator set. One record:

  ```
  %rec: policy
  %key: org

  org: agentplot
  curation_cadence: 24h
  curation_threshold: 25
  stall_window: 45m
  lease_stale_after: 10m
  ```

- `machines/*.toml` — the definitions in this directory, installed at the
  blueprints repo root so a definition change is a blueprints-repo commit.

### 7.3 The blueprints repository, orphan branch `flywheel-state`

Source of truth for: host liveness, object ownership, signals, moves and
clusters.

Five files, and the acquire is a `git push`. A non-fast-forward push is
rejected by GitHub, which makes the push an **atomic compare-and-swap**
against a shared store the model already has. Two hosts pushing at the
same instant give one winner and one rejection; the loser refetches and
sees the owner. That is why the model needs no lock service and why
takeover is never a race.

```
# leases.rec
%rec: lease
%key: object

object: issue/418
host: mac-studio
session: fwn-20260904-0731-4c1a
taken: 2026-09-04T07:31:02Z
seen: 2026-09-04T08:14:02Z

# hosts.rec
%rec: host
%key: name

name: mac-studio
herdr_workspace: fwn-agentplot
seen: 2026-09-04T08:14:02Z
version: fwn 0.4.1
```

The same compare-and-swap is what lets many signal adapters append at
once. An append is keyed on `id`, so a rejected push is refetched and
retried with no risk of a double record.

```
# signals/2026-09.rec
%rec: signal
%key: id

id: sig-2026-09-03-0f31
source: transcript
ref: wisprflow://meeting/8821#t=00:41:12
at: 2026-09-03T16:41:12Z
adapter: fwn-signal-transcript 0.2.0
text: the plan page takes eight seconds to render on the phone over
+ tailscale, and the operator gave up on it twice this week

# moves/2026-09.rec
%rec: move
%key: signal
%type: target enum attach challenge cluster drop

signal: sig-2026-09-03-0f31
target: cluster
cluster: clu-2026-09-03-a7
reason: three reports of plan-page latency; no standing claim covers it
by: fwn-20260903-1800-9d2c
at: 2026-09-03T18:04:51Z

# clusters/2026-09.rec
%rec: cluster
%key: id

id: clu-2026-09-03-a7
title: the plan page must render on a phone in under two seconds
challenges: none
signals: 3
sources: transcript(2), discord(1)
span: 2026-08-28 .. 2026-09-03
signal_id: sig-2026-09-03-0f31
signal_id: sig-2026-09-01-b204
signal_id: sig-2026-08-28-77aa
reason: three independent reports over a week, no standing claim covers page latency
by: fwn-20260903-1800-9d2c
```

`%key: signal` in the moves file is the whole of requirement 62: `recfix`
refuses a second move for a signal, so a signal cannot be re-judged even
by a session that tries. The cluster record carries the weight, so
`intent.i.propose_from_cluster` never has to open the signals file
(requirement 61).

### 7.4 Each built repository

Source of truth for: as-built. Archived OpenSpec specs, each delta's
front-matter naming the claim it serves (requirement 48, invariant I9):

```
---
claim: plan-row-single-source
claim_version: 3
---
```

`fwn check` in each built repo fails an archive whose delta names a claim
that is not standing.

### 7.5 herdr

Source of truth for **session liveness only**. `herdr agent list --json`
gives pane id, title, agent state (`busy` / `idle`), last input time.
Never a source of truth for any object's state.

### 7.6 The host run directory `~/.flywheel-next/agentplot/`

Not a source of truth for anything. It holds the work orders, the exit
records, the offer files and the append-only event log:

```
run/fwn-20260904-0731-4c1a/work_order.md
run/fwn-20260904-0731-4c1a/exit.json
run/fwn-20260904-0731-4c1a/offers.jsonl
events.jsonl
```

```json
{"at":"2026-09-04T08:14:02Z","host":"mac-studio","transition":"el.start",
 "object":"issue/418","reason":"an approved elaboration with no live session gets one",
 "evidence":{"labels":["fw:approved"],"panes_matching":0},
 "writes":["lease_acquire","request_session","set_label:fw:running"]}
```

Every write goes through one function that takes `reason` and `evidence`
and puts both in the event log *and* in the GitHub comment or commit
message the write produces (requirement 39). So the central record
survives even if a host's disk does not.

---

## 8. Signals, moves and curation

Section 8's sixth question. **The flywheel owns the records; it does not
own the batching.** Signals go in a file, moves come out of a session,
and no machine anywhere queues, rate-limits, or decides which raw
material matters.

### 8.1 The three records

An adapter appends a **signal** with `fwn signal add` and pushes. That is
the whole of intake. Four adapters ship: the `#fwn-signals` Discord
channel, a meeting-transcript exporter, a log matcher, and a session's
own offer whose subject is not its thread. Anyone else can write the same
record; the file is the interface.

Curation writes a **move** for each signal it judges: `attach` to an open
intent, `challenge` a standing claim, `cluster` into a proposed new
intent, or `drop` — each with a reason. Requirement 63's three-way test
is literally the target field: fits an open intent, argues with a
standing claim, or fits no claim.

For every proposed intent it wants, curation also writes a **cluster**
carrying the title, the challenged claim if any, the cited signal ids,
and the weight: how many, from which sources, over what span.

### 8.2 The one rule about reading

Requirement 61 says the machinery never reads a signal except through
curation, and the model enforces it rather than observing it. No guard or
effect in any machine file except `curation.toml` may name a predicate on
the `signal_` prefix, and `fwn check` fails a definition that does. The
only thing readable outside a curation session is the *count* of unmoved
records, which carries no content and is what charges the next run.

That is also why the cluster record exists. `intent.i.propose_from_cluster`
needs the weight to render the row, and taking it off the cluster means
that transition opens no signal file.

### 8.3 Why the run is a machine and not an outside step

Requirement 65 makes curation a session with the fixed exits of 4.7,
charged on a cadence or a threshold. So it is a machine here, with four
states — `due`, `running`, `settled`, `stuck` — and one forbidden effect:
it may not open an intent. `fwn check` enforces that the same way it
enforces "a chore never creates a bolt".

The thing that *opens* the proposed intent issue is
`intent.i.propose_from_cluster`, a reconcile transition that transcribes
a cluster into a row. It invents nothing — the title, the reason and the
weight are all curation's — and it creates no work, because a proposed
intent is a proposal and only the operator's word makes it an open
thread.

Invariant I1 asks that every piece of work point at an approval, and a
run starts without a word. The approval it points at is `policy.rec` on
`main` of the blueprints repo, holding `curation_cadence` and
`curation_threshold`. The operator wrote that record, `pause` sets the
cadence to `off`, and the machinery reads it rather than deciding for
itself when to run.

### 8.4 What keeps a signal off the plan

`signal.toml` has two states and neither is `waiting_operator`. The
exhaustiveness check of §6 therefore asks nothing of it, and there is no
row kind anywhere whose `when` names a signal. Requirement 64's "one row
per proposed intent, never a row per signal" is a property of the
definition that a reader can verify by grep, not a discipline anyone has
to keep.

A person doing all of this by hand — `recins` into `moves/` and
`clusters/`, then push — is curation too, and the machinery cannot tell
the difference. That is the point of putting the seam at the records
instead of at the session.

---

## 9. The ledger

Section 8's seventh question.

**Where it lives:** `ledger/<owner>-<repo>.rec` on `main` of the blueprints
repo, one file per tracked repository, in recutils.

**Who writes a verdict:** an agent, in a `fwn-verdict-session`, because
requirement 49 says the judgment is not a computation. The session reads
the claim's chapter, the repository, and its archived specs, then writes
records with `recins` and commits. The machinery's `l.write_verdict`
transition does not decide anything; it records that the commit landed.
The one exception is `b.landed`, which writes `satisfied` verdicts for
the claims the bolt's work items named — and even there the judgment
being stored was made by the bolt's `code-review` stage session, and its
words are quoted in the record's comment field.

**What invalidates a verdict:** only `claim_hash != current hash` or a
cited evidence path that no longer exists. A repository taking forty
commits changes `repo_rev`, which is recorded but never compared
(requirement 50, scenario S11). `not_applicable` is stored like any other
verdict, so a scope judgment is made once.

**How a stale verdict becomes a row that cannot be missed:** it is not
remembered, it is recomputed. `ledger_cell.stale` is derived on every
plan read by hashing the claim block and comparing; the state has
`kind = "waiting_operator"`, so the exhaustiveness check of §6 requires a
row for it, which is `row.ledger.stale`. Missing it would require the
definition to fail CI.

**Reads of the ledger** happen in three places: deriving a repository's
backlog (`u.propose`), deciding whether a first planning is owed
(`row.unit.first_planning`), and rendering the status view. **Writes**
happen in two: a verdict session's commit, and a bolt landing.

---

## 10. Hosts, ownership and the status view

**The status view is the Projects board itself.** One board for the
organization, central by construction, readable in the GitHub mobile app
with no machinery running anywhere (requirements 55, 56, 57). Saved
views: "By state" grouped on `Status`; "By host" grouped on `Host` with
`Host Seen` visible; "Bolts" grouped on `Bolt`. Every field on it is a
projection written from the sources named in §7 and never read back as
truth — except the operator's own board move, which is an input event,
not a state read.

**Drift** (requirement 37): the reconciler compares each projection to
its source on every pass. On disagreement it rewrites the projection from
the source and logs `projection-repair` with both values. It never
resolves the other way. Nothing in `decide` reads a board field for a
state; the guards read labels, milestone front-matter and `.rec` files
only. That is why two disagreeing stores can never prove a state: only
one of them is ever asked.

**Ownership** is the `lease` machine of §7.3. The takeover rule, stated
once:

- A lease is **stale** after 10 minutes without a heartbeat.
- A stale lease is **reclaimable** after 30 minutes *and* only when no
  pane on any host carries the object's session id. Reclaiming is
  automatic then, by CAS push.
- A stale lease on an object that *does* have a session record is never
  taken automatically. It becomes `row.lease.stale_host`, and only the
  operator's `takeover` word moves it. Taking over mints a **new session
  id**; the old host's agent, if it wakes, checks the lease before its
  first write, finds it gone, and self-terminates. So the object never
  runs twice.

---

## 11. The runtime, named

| part | what runs it |
|---|---|
| the daemon | `fwn serve`, Python 3.12, launchd `com.agentplot.fwn`, `KeepAlive`, one per host |
| the loop | `decide` / `apply`, 20 s tick, stateless |
| the tracker | GitHub issues, milestones, Projects v2 board "Flywheel Next", via `gh` |
| the chat | Discord bot `fwn-plan`, channels `#fwn-plan` and `#fwn-ops`, `discord.py` |
| the page | `http.server.ThreadingHTTPServer` on `127.0.0.1:8787`, published by `tailscale serve` |
| agent sessions | `claude --agent fwn-<kind>-session`, one per herdr pane |
| the multiplexer | herdr, workspace `fwn-agentplot`, `herdr agent start / list --json / send / kill` |
| signal intake | `fwn signal add`, plus the four shipped adapters of §8.1 |
| worktrees | `git worktree add ~/Code/fwn/<repo>/<branch>` |
| specs and changes | the `openspec` CLI, custom schemas, the archive step |
| the book | mdBook, `blueprints/flywheel-next/` |
| small tables | recutils — `recsel`, `recins`, `recdel`, `recfix` |
| the definitions | `machines/*.toml`, read with `tomllib` |
| the checker | `fwn check`, `fwn check --diagrams` |
| the simulator | `fwn simulate tests/snapshots/s09.json` |

**Coexistence** (requirement 45). The new flywheel's object scope is
disjoint and explicit: label `fwn` on every issue, milestone titles
prefixed `fwn/`, branches prefixed `fwn/`, Projects board "Flywheel
Next", herdr workspace `fwn-agentplot`, run directory
`~/.flywheel-next/`, launchd label `com.agentplot.fwn`, Discord channels
`#fwn-*`. Every query the machinery issues carries `label:fwn`, and a
guard refuses to act on an object without it. Repositories are shared;
objects are not.

---

## 12. Definition versus code, and how it is tested

**Data — edit a file in `machines/`, ship nothing:** a state, a
transition, a guard *expression* built from existing predicates, an
elaboration type, a construction stage, a plan row kind, a row's surface
or grouping, the exit alphabet, the lease timings, a move target
(requirement 44). The curation cadence and threshold are data too, but
they live in `policy.rec` rather than here, because they are the
operator's standing decision rather than the shape of a machine.

**Code — `flywheel_next/`:** a new *predicate* atom (`guards.py`), a new
*effect* atom (`effects.py`), a new store reader. `fwn check` asserts
every atom named in every machine file resolves in the registry, so the
boundary is enforced rather than remembered.

**Testing without a live service** (requirement 43). `Snapshot` is a
frozen dataclass built from plain dicts, so a test writes the described
state of the stores as JSON and asserts the decisions:

```python
snap = Snapshot.from_json(read("tests/snapshots/s02_standing_idle.json"))
assert [a.transition for a in decide(snap, MACHINES)] == ["el.stand"]
assert [r.id for r in plan(snap, MACHINES)] == ["row.elaboration.keep"]
assert decide(apply_all(snap), MACHINES) == []      # requirement 38
```

There is one snapshot fixture per scenario in section 9, each asserting
the actions, the plan, and that a second pass is empty. No GitHub, no
herdr, no network. `unittest`, standard library only.

---

## 13. Requirement coverage

| # | how the model satisfies it |
|---|---|
| 1 | every path produces one `flywheel-word` comment; `word.toml` `wd.apply` fires once, `wd.already` makes a repeat a no-op |
| 2 | rows carry `surface`; `chat` rows answer with one verb in Discord, `page` rows carry a Tailscale link to `127.0.0.1:8787` |
| 3 | `wd.record_board` reads the issue timeline for an operator field change and converts it to a word, keyed by event id |
| 4 | every "proposed" state is `waiting_operator`; the effects that create work (`i.approve`, `u.explode`, `el.start`, `c.start`) are reachable only through a word |
| 5 | `wd.unapplicable` writes a reason comment and raises `row.word.unapplicable`; applied-ness is read off the target, so nothing is applied twice |
| 6 | `plan()` is a pure function of `Snapshot`; no row is stored anywhere |
| 7 | there is no "next plan"; a new object in a `waiting_operator` state is a row on the next read, which is 20 s later |
| 8 | every `[[rows]]` has one `when` and one `until`; both are listed per row in the machine files and drawn on the diagrams |
| 9 | the seven kinds map to `row.intent.proposed` + `row.elaboration.proposed`, `row.unit.proposed`, `row.intent.close` + `row.bolt.close`, `row.elaboration.keep`, `row.finding.offered`, `row.chore.offered`, `row.*.question` |
| 10 | rows carry `group`; Discord posts one block per group; `y all` answers a group, `y 3` one row |
| 11 | dictation opens an intent in `proposed` or a chore in `accepted` directly, with a word and no row |
| 12 | signals land in a file at any rate; curation, not the elaboration machinery, writes the moves and clusters that become intents; a person doing it by hand is indistinguishable (§8) |
| 13 | `el.approve` is guarded on the intent being open, and the reconciler refuses to open a second elaboration issue while one is `proposed`; new material edits that issue's body |
| 14 | `i.ready` derives `close_ready` from `children_all:elaboration:done`; only `i.close`, an `on = "word"` transition, closes it |
| 15 | every self-closing type's `deliverable` is a path under `blueprints/flywheel-next/src/` or the intent's OpenSpec change; `el.finish_self_closing` is guarded on it being present |
| 16 | one elaboration owns at most one session; there is no transition that splits one |
| 17 | `[[types]]` declare `end`; `el.finish_self_closing`, `el.stand` and `el.hold_with_operator` are the three exits from `session_idle`, selected by `params.end` |
| 18 | no transition out of `keep_or_finish` or `session.kept` has `on` other than `word`; `fwn check` asserts this for every standing type |
| 19 | `Type` is a board field; `el.retype` changes it from any pre-terminal state |
| 20 | `u.explode` is the only producer of work items, and its `from` is `approved` |
| 21 | the stage list is the bolt's milestone front-matter; `work_item.toml` has one stage cycle and `has_next_stage` walks the list |
| 22 | several items may be `stage_running`; `w.merge` is guarded by `merge_slot_free` (a lease on the bolt branch) and `first_in_merge_order` |
| 23 | `b.ready` needs `children_all:unit:finished`; `b.land` is `on = "word"` |
| 24 | `b.land_fail` writes the failure evidence and leaves the milestone open |
| 25 | offers go to `offers.jsonl` and the session is not told; the `subject` param, checked against the offering object's own thread, selects `f.offer` (a row on that thread) or `f.as_signal` (a signal, no row) |
| 26 | the agent definitions say: fix inside your job, offer only across a boundary; the chore template requires a `repo` and `branch` different from the session's own |
| 27 | `c.start` requests one `fwn-chore-session` on a worktree of the named repo; `c.merge` merges to that repo's default branch |
| 28 | instruction files, citations and references are chore templates in the agent definitions; nothing routes them to `unit` |
| 29 | one work order, one place, one goal; `[exits]` is the alphabet |
| 30 | a session's only writes are its own worktree, `exit.json`, `offers.jsonl` and its issue comment |
| 31 | `queue_message` delivers only on `agent_idle`; `herdr agent send` is never called against a busy pane |
| 32 | `s.launch` → `launching` → `s.observed` on `pane_present`; `s.launch_retry` retries every 90 s; the return of `herdr agent start` is never consulted |
| 33 | every transition's effects are compare-then-write and every start is guarded by `pane_absent` / `no_live_session` |
| 34 | `s.reap_retired` kills the pane and releases the worktree and lease, except for standing types |
| 35 | `decide` reads only stores; the daemon holds nothing across ticks |
| 36 | each machine file names one `truth` and lists its `projections` |
| 37 | projections are rewritten from source on disagreement and `projection-repair` is logged; no guard ever reads a projection |
| 38 | `decide` is pure and effects are compare-then-write, so a second pass writes nothing |
| 39 | one `apply` function writes `reason` and `evidence` to `events.jsonl` and into the comment or commit it makes |
| 40 | the work order's `expected` block is copied into `exit.json`; `comment:expected_vs_delivered` leads with the difference |
| 41 | `ops_report:*` goes to `#fwn-ops` and `events.jsonl`; no effect files a machinery problem as an issue |
| 42 | machines are TOML; `fwn check --diagrams` enforces a total bijection between the SVGs' `data-fwn-*` ids and the definitions |
| 43 | `Snapshot.from_json` + `decide` + `plan`, `unittest`, no network |
| 44 | types, stages and row kinds are data; §12 states the boundary and `fwn check` enforces it |
| 45 | label `fwn`, board "Flywheel Next", `fwn/` branches and milestones, `~/.flywheel-next/`, herdr workspace `fwn-agentplot` |
| 46 | a claim is a fenced block inside its own chapter; there is no separate claim file to drift |
| 47 | proposed = the claim's chapter is under an open OpenSpec change; `u.propose` reads standing claims only |
| 48 | archived spec deltas carry `claim` and `claim_version` front-matter; `fwn check` fails an archive without them |
| 49 | `fwn-verdict-session` writes the records; `l.write_verdict` only records that the commit landed |
| 50 | staleness is `claim_hash_moved` or `evidence_missing`; `repo_rev` is recorded, never compared; `not_applicable` is a stored state |
| 51 | backlog = in-scope standing claims minus `recsel` for satisfied/not-applicable, computed per read |
| 52 | `row.bolt.claim_drift` offers `amend-bolt` or `follow-on`; no transition rewrites construction on reconcile |
| 53 | `row.unit.first_planning` fires on `ledger_empty`; `l.judge_all` starts one session that judges every in-scope claim once |
| 54 | `scope` is a field of the claim block; a contract claim naming two repos yields one `ledger_cell` per repo, each with its own record |
| 55 | the Projects board, grouped by `Status`, readable in the GitHub app with no machinery running |
| 56 | every board field is written from the sources of §7 and never read as truth |
| 57 | one board for the organization, however many hosts |
| 58 | every host reads the same `main` of every repository and the same board; `flywheel-state` is the shared coordination branch |
| 59 | `lease.toml`; ownership is one record per object, visible as the `Host` field; takeover is CAS-push under the stated rule |
| 60 | `Host` and `Host Seen` are board fields; `hosts.rec` heartbeats project into them |
| 61 | adapters call `fwn signal add`, which appends one record and pushes; `fwn check` refuses any `signal_` predicate outside `curation.toml`, leaving only the unmoved *count* readable |
| 62 | `%key: signal` in `moves/*.rec` makes a second move impossible; `curation`'s snapshot is the unmoved set, and `signal.sg.moved` is the only way out of `unmoved` |
| 63 | the work order quotes the claim index and the open intents; the move's `target` records which of the three the signal was — `attach`, `challenge`, or `cluster` |
| 64 | the cluster record carries the citations and the weight, `i.propose_from_cluster` renders them into one issue, and `signal.toml` has no `waiting_operator` state so no row can exist per signal |
| 65 | `curation.toml`: `cu.due` fires on `policy.rec`'s cadence or threshold, `cu.start` requests one `fwn-curation-session`, and `forbidden_effects` refuses `open_issue:intent`; a person running `recins` writes the same records |

## 14. Invariants

| inv | how it holds |
|---|---|
| I1 | every effect that creates work sits on a transition with `on = "word"`, or downstream of one (`u.explode` from `approved`, `el.start` from `approved`); `fwn check` walks the graph and fails if a work-creating effect is reachable from an initial state without passing a word transition. A curation run is the one thing the machinery starts unbidden, and the approval it points at is the cadence in `policy.rec` |
| I2 | `word_id` collapses duplicate arrivals; applied-ness is read off the target, so re-application is a no-op and non-application becomes `row.word.unapplicable` |
| I3 | one `when`, one `until` per `[[rows]]`; `fwn check` asserts they are mutually unsatisfiable |
| I4 | each machine file names exactly one `truth`; every other place is listed under `projections` and no guard reads one |
| I5 | the only effect that speaks to a session is `queue_message`, guarded on `agent_idle` |
| I6 | no transition out of `elaboration.keep_or_finish` or `session.kept` has `on` other than `word`; checked statically for every type whose `end` is `standing` |
| I7 | `decide` reads only stores and `apply` is compare-then-write, so a restart performs no writes and `plan()` returns the same rows |
| I8 | `chore.toml` declares `forbidden_effects`; `fwn check` fails if any transition in it names `open_issue:bolt`, `open_issue:unit`, `milestone_set` or `land_milestone` |
| I9 | `fwn check` in each built repo refuses an archive whose delta names a claim that is not standing |
| I10 | `l.no_recompute` has an empty effect list and is the only transition that fires while `claim_hash_matches` and `evidence_present` |
| I11 | one record per object in `leases.rec`, `%key: object`; `recfix` enforces key uniqueness and the CAS push enforces single-writer |

## 15. The scenarios, walked

**S1 — approve from the phone.** `row.elaboration.proposed` is derived
from `elaboration.proposed`. The operator replies `y 2` in `#fwn-plan`.
`wd.record_chat` writes the `flywheel-word` comment. `wd.apply` fires
`el.approve`: label `fw:approved`, board `Ready`. Next pass, `el.start`
takes the lease, writes the work order, calls `herdr agent start`. The
row's `until` now holds (`word:approve`), so it is gone from the plan.
Nothing re-asks, because `proposed` is proven by `fw:proposed`, which is
no longer on the issue; and if the same word arrives again by a board
move, `wd.already` fires with an empty effect list.

**S2 — a standing prototype goes idle.** The elaboration's type is
`prototype-live`, `end = standing`. Its session finishes the build and
goes `idle`; `s.keep` moves the session to `kept` and `el.stand` moves
the elaboration to `keep_or_finish`. No effect touches the pane, so the
prototype keeps running. `row.elaboration.keep` appears: "finish or
keep?". The operator says nothing overnight; the row persists because
nothing retracts it. In the morning the pane is still there, because the
only transitions out of `kept` are `s.finish_kept` (`on = "word"`) and
`s.reap_retired`, which excludes standing types.

**S3 — a stale instruction file.** A construction session at the `build`
stage notices `AGENTS.md` in another repository is stale. It appends one
line to `offers.jsonl` with `kind: chore, repo: agentplot/dispatch` and
keeps working; nothing interrupts it. It exits `done` on its own job.
The reconciler's `c.offer` opens a chore issue in `offered`;
`row.chore.offered` appears. The operator replies `accept 1`. `c.accept`,
then `c.start` adds a worktree of `agentplot/dispatch` at
`fwn/chore-512` and starts one `fwn-chore-session`. `c.merge` merges to
that repo's default branch once its own gates are green. No milestone was
created, no unit issue, no stages — enforced by `forbidden_effects`.

**S4 — a finding, dropped.** A session on intent #402 appends a finding
offer naming #402 as its thread. The machinery checks that name against
the offering object's own intent, finds they match, and the `subject`
param is `own_thread` — so `f.offer` runs, not `f.as_signal`. The issue
opens in `offered` and `row.finding.offered` shows it as a candidate
elaboration on #402. The operator replies `drop 4`. `f.drop` closes the
issue as not planned. No elaboration issue was ever opened, because the
only effect that opens one is `f.as_elaboration`, which is `on = "word"`
with verb `elaborate`.

Had the same session offered a thought about a different intent, or about
no thread at all, the subject would have been `elsewhere`, `f.as_signal`
would have appended a signal instead, and it would have reached the plan
only if a curation run later clustered it (requirement 25).

**S5 — restart mid-day.** `launchd` restarts `fwn serve`. The daemon has
no state to lose. Sessions are herdr panes, not children of the daemon,
so every one is still running. The first pass reads the stores, finds
every object in the state its labels prove, and evaluates guards: every
started session has `pane_present`, so `el.start` and `w.start_stage` do
not fire; every `waiting_operator` state still produces its row. `plan()`
returns the identical list, because it is a function of stores that did
not change.

**S6 — a slow host.** `s.launch` calls `herdr agent start`; the command
times out after 60 s. The machinery records nothing about the return
value. The session sits in `launching`. Ninety seconds later
`s.launch_retry` evaluates `pane_absent` — but the pane has by now
appeared, so the guard is false and no second start is issued. `s.observed`
fires on `pane_present` and the session is `working`. Nothing is reported
as failed, because `launching` is `waiting_machine`, not
`waiting_operator`, and produces no row.

**S7 — closing an intent.** The last elaboration reaches `done`.
`i.ready` fires on `children_all:elaboration:done` and the intent is
`close_ready`; `row.intent.close` appears. The operator replies `close 1`.
`i.close` runs `openspec archive`, refreshes `claims.lock`, closes the
issue. The intent's claims are now standing and become plannable
(requirement 47). Nothing else moved: no bolt, no unit, no session, because
no other machine's guard mentions `intent.closed` except the claim
standing derivation.

**S8 — twenty signals, and a move for every one.** The transcript adapter
appends twenty records to `signals/2026-09.rec` and pushes. Each is a
`signal` in `unmoved`. No row appears, because `signal.toml` has no state
that waits on the operator. The count crosses `curation_threshold: 25`
the following morning — or, sooner, the `24h` cadence elapses — and
`cu.due` opens one curation-run issue whose body records the snapshot of
those twenty ids. `cu.start` takes a lease and requests one
`fwn-curation-session`, whose work order quotes the claim index and the
open intents (requirement 63).

The session writes twenty moves. Six are `attach`, naming the open
intents they join; nine are `drop`, each with its reason; five are
`cluster` or `challenge` across two cluster ids, one of which carries
`challenges: plan-row-single-source@3`. It writes two cluster records
with their titles, citations and weights, commits both files, and exits
`done`.

The next reconcile pass does four things. `sg.moved` takes all twenty
signals to `moved` — no writes, the move records are the state.
`cu.settle` fires because `moves_cover_snapshot` holds, and the run issue
closes. `i.attach_signal` joins the six attached signals to their
intents' one standing proposal each. `i.propose_from_cluster` opens two
intent issues in `proposed`, each rendering its weight line off the
cluster record.

The plan therefore shows **two** rows, each reading like
`intent #511 the plan page must render in under two seconds — 3 signals
from transcript(2), discord(1) over 2026-08-28 .. 2026-09-03`. Not
twenty. And every one of the twenty has a move the operator can read,
whether the answer was attach, challenge, cluster or drop.

**S9 — a claim moves under an open bolt.** A build session learns the
boundary is wrong, finishes its job, offers a finding naming its own
bolt — the claim is the one its work item's spec delta cites, so the
subject test passes and `f.offer` gives it a row rather than a signal.
The operator says `elaborate`; an elaboration on the relevant intent
amends the claim's chapter, its `version` goes 3 → 4, `claims.lock`
records the new hash,
the intent closes and the claim is standing at 4. Now two things derive
at once. First, `ledger_cell` records naming `claim_hash` for version 3
become `stale`, raising `row.ledger.stale` per repo. Second, the open
bolt has work items whose spec deltas name `plan-row-single-source@3`, so
`child_names_stale_claim` holds and `row.bolt.claim_drift` offers exactly
two answers: `amend-bolt` or `follow-on`. Neither is taken automatically —
there is no `on = "reconcile"` transition out of that condition. The
operator picks `follow-on`; the bolt lands as built and a unit is
proposed in a successor bolt. Nothing was rebuilt without them.

**S10 — a repository joins.** `manifest.rec` gains a record. No
`ledger/agentplot-newthing.rec` exists, so every in-scope standing claim
is a `ledger_cell` in `unjudged`, and `row.unit.first_planning` appears —
**one** row, not one per claim, because its `when` is
`ledger_empty:<repo>` on the repository, not on the cell. The operator
approves. `l.judge_all` starts one `fwn-verdict-session`, which judges
every in-scope claim once and commits the whole file, including
`not_applicable` records for the claims that do not concern the repo.
Those cells are terminal; `l.no_recompute` is the only transition that
matches them thereafter and it writes nothing. The unsatisfied set is
then proposed as one unit document.

**S11 — forty commits, no claim change.** Every pass, `l.no_recompute`
evaluates `claim_hash_matches` (true, no chapter moved) and
`evidence_present` (true, the cited paths exist) and returns an empty
effect list. `repo_rev` in the records is stale and nobody compares it.
No verdict is written, no `ledger_cell` leaves a terminal state, and no
row's `when` changes, so `fwn plan` returns the same rows it did on
Monday.

**S12 — the status view with nothing running.** The operator opens the
GitHub mobile app to the "Flywheel Next" board, view "By host". Every
bolt milestone, unit, work item and session-bearing object is there with
its `Status`, `Host` and `Host Seen`. No machinery is running; the board
is GitHub's own storage. The values are as of the last projection write,
and a `Host Seen` that is hours old is exactly the information the
operator wants (requirement 60).

**S13 — a host loses power.** `mac-studio` holds `issue/611` (a work item
at `build`) and stops heartbeating. Ten minutes on, `k.go_stale` fires
from the surviving host: `Host Seen` becomes `stale`. The other host's
every effect on that object is guarded by `lease_mine`, which is false,
so it does nothing at all. The board shows the build and its host as
stale. `row.lease.stale_host` appears in the `hosts` group. Two outcomes:
if `mac-studio` returns, `k.recover` fires on `lease_mine` — the pane is
still there, `w.start_stage`'s `no_live_session` is false, and the build
resumes on the same session. If it does not, the operator answers
`takeover`; `k.steal` mints a new session id by CAS push and
`w.takeover` puts the item back to `queued` on the other host. The old
agent, if it ever wakes, checks the lease before its first write, finds a
different session id, and terminates. The item never runs twice.

---

## 16. The diagrams

Six, one per machine family, in this directory. Each states its claim in
the title, marks where plan rows are created (a red `+row` chip) and
retracted (a grey `−row` chip), and marks where the ledger is read (a
dashed teal edge) and written (a solid teal edge).

| file | family | claim |
|---|---|---|
| `flywheel-next-curation.svg` | flow | twenty signals in, one move each, two rows out |
| `flywheel-next-two-clocks.svg` | structure | one event machine, twelve reconciled ones, meeting only at the work order and the exit record |
| `flywheel-next-session.svg` | flow | the only free state in the model, entered by evidence and left by three verbs |
| `flywheel-next-design.svg` | flow | intent and elaboration; the type's `end` is the only thing that differs |
| `flywheel-next-construction.svg` | flow | approval is the only thing that makes work items; a chore never makes a bolt |
| `flywheel-next-ledger.svg` | flow | a verdict dies only when its claim's text moves |

Palette, held across all six: **purple** design objects — signal,
curation, intent, elaboration, finding, claim · **blue** construction
objects — bolt, unit, work item, chore · **green** sessions and agents ·
**red** the operator's word, plan rows and gates · **amber** the
machinery's own waiting, timing and derivation — a tick, a cadence, a
held state, the status view · **teal** the ledger, verdicts and as-built ·
**grey** hosts, stores, records and places.
