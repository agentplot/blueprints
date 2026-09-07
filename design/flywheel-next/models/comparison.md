# Three framings, side by side

Three fresh agents modeled `requirements.md` (154 requirements, S1–S34)
on 2026-09-04, each from one framing and nothing else: statechart-first
(`statechart/`), actor-model-first (`actor-model/`), agent-graph-first
(`agent-graph/`). Each delivered a model, machine definitions as data,
a conformance suite, house-style diagrams and a gaps file. This page
puts their answers next to each other; it does not pick one.

## Where all three agree

- **Git-only profile first.** Its compare-and-swap is the git host's
  own; the tracker profile is a second implementation of the same
  control-plane trait, reusing the record layout.
- **Claims are fenced `claim` blocks with a hash lock** inside the
  chapter that explains them, not OpenSpec blocks by anchor. Two name
  the mechanism: an mdBook preprocessor plus a pre-commit hook; a
  `claims.rec` index with the lock as a sha of the normalized block.
- **Planning is one machine per built repository**, woken by a
  fingerprint or digest over standing claims, ledger cells, open bolts
  and asks; it sees open bolts through its work order.
- **The cadence rule** is the same in all three: a line takes its
  parent before the first place off it, before landing, and on a
  per-repository cadence from the manifest; a place is current when
  the line's head is an ancestor of the place's head, checked before
  any session starts.
- **Signals, moves, claims and the ledger live as files in the blueprints
  repository in both profiles**, never as tracker items. Each reads
  C.1's "an item per object" as objects with a plan-facing lifecycle.
- **Tracker single-writer needs an added mechanism**: a lease as an
  ordered comment append (lowest comment id after the last release
  wins). All three flag it as untested against GitHub.
- **"Diagram cannot drift from runtime" is not met by hand-drawn SVG.**
  Two substitute a checker that ties every id on the canvas to a
  definition and fails when a row kind is on no diagram.
- **herdr assumptions are unverified**: that `start --name` refuses or
  finds a duplicate pane (S6 rests on it), and that status reports
  last-activity and last-keystroke times (with-operator presence rests
  on it).

## Where they differ — rulings for the operator

| question | statechart | actor-model | agent-graph |
|---|---|---|---|
| takeover after a host dies (S13) | lease expiry by rule | lease expiry; supervision restarts from the place's last published exit | effect-only work retaken by rule; session-backed work only on the word `takeover` |
| a line take that conflicts (45 vs I1) | a `fast` conflict unit, approved by the bolt-close word or the cadence rule | a chore offer row on the bolt; the line stays behind until the yes | a conflict artifact on the line's newest idle place fires a resolve step there |
| what a lease covers | per object | per root (org, intent, bolt, planning, curation): one bolt's items build on one host | per activation (node, key, generation) |
| unfiled sightings (I14) | place's `.flywheel/` on disk is "about to be committed" | records only; commits in a place published to a ref on every exit | observations commit only when they change a derived state; the rest stays in host memory |
| with-operator presence | keystroke within 30 min via herdr status | not evidenced; ends only by a dictated `finish` | herdr input age, else the words `in` and `out` |
| a forwarded chat message (S21 vs signals 102) | not raised | not raised | the forward adapter writes one signal on the operator's one word |
| git-only status page with no host | `status.html` committed on main, read through the file view | same, through the raw file URL with a token on the phone | same |
| `yes all` | expanded at the bot into one word per row, bound to the rendering id | one Word record per row | bound to the rendering it answers |
| findings about another thread | signal | signal | signal, which routes them through curation and not straight to the plan |

The first two rows are the ones that change behavior an operator will
feel. The third is a throughput cost the actor model names itself: one
large bolt cannot spill onto a second host with free slots.

## What each framing made easy and hard

**Statechart.** Rows as states make A.2's row rules and I3/I7 nearly
free: created on entering, retracted on leaving, re-derived on
restart, and the checker lists one creating state per row kind.
Operator-added types are template files. The engine/domain line is
mechanical: the schema is the engine, the atoms file is the domain, a
profile binds every atom or is rejected. Hard: coordination that is
not parent and child (a moved claim reaching an open bolt, a finding on
another thread) had to go through evidence atoms and the planning
fingerprint rather than transitions; effects with proofs get awkward
where the world and the record disagree.

**Actor model.** Exactly-once words fall out of a Word record keyed by
message id, consumed and answered in one write. The plan is
`list(decision, open)`. An actor is only its records, so restart and
host loss cost nothing. Hard: root leases pin a bolt to a host; world
effects need an outbox performed after the write with the world read
back before any repeat; a conflicting line take has no session to hand
the job to.

**Agent graph.** A row is an unanswered in-edge of the operator node,
so "impossible to miss a row" and "same plan after restart" come from
the shape; the five session exits are five out-edges; a unit type is a
subgraph template committed as data. Hard: anything that is not an
artifact. Session liveness, place heads and gate results are world
facts, so the reconciler became a special node that writes
observations.

## What each is least sure of

- **Statechart**: tracker leases by ordered comment append; blueprints-held
  objects not being tracker items in the tracker profile; the git-only
  status page as a committed file.
- **Actor model**: publishing places to `refs/places/<place>` on every
  exit; tracker leases by ordered comment append; with-operator
  elaborations ending only by dictation.
- **Agent graph**: session-backed takeover only on the word; sightings
  in host memory against I14; the forward adapter writing a signal
  directly.

## Requirement text the models found soft

Two or more models stopped on the same wording; each is a candidate
edit to `requirements.md`:

- **45** names a session for a conflicting take, but a line take has
  no session. Say what works a line conflict.
- **I14** as written forbids what every model does with sightings.
  Say whether evidence about the world (pane state, heads) is state.
- **22 with-operator** needs presence as evidence; none exists in the
  givens. Either name the evidence or make the type end by dictation.
- **C.1 "an item per object"** against the file-format requirements of
  A.15. Say which objects are tracker items.
- **S13 "the stated rule"** is read three ways. Say whether the rule
  may include the operator's word.
- **A.10 "cannot drift"** against section 12's house-style diagrams.
  Say whether a checker over ids satisfies it.
- **A.2.13 "the last rendering the operator received"** is read as
  delivered, not seen. Say which.

## Files

| | statechart | actor-model | agent-graph |
|---|---|---|---|
| model | `statechart/model.md` (1,450 lines, 16 sections) | `actor-model/model.md` (1,426 lines, 13 sections) | `agent-graph/model.md` (1,566 lines) |
| definitions | `machines/` 26 machines, `profiles/` tracker + git-only, `check.py` green | `machines/actors/`, `types/`, `bindings/` tracker + git-only + stand-in | `machines/` graph, nodes, objects, types, bindings |
| conformance | 12 contract scenarios on a toy machine + S01–S34 as data | `suite.yaml` + 18 scenarios | 12 contract + 6 section-11 scenarios, schema, README |
| diagrams | 5 | 4 | 4 + `check.py` |
| gaps | `statechart/gaps.md` | `actor-model/gaps.md` | `agent-graph/gaps.md` |
