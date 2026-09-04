# Flywheel next — requirement additions not yet written in

Each item becomes requirements text once the operator has shaped it.
The single requirements document is the target; the two variants become
control-plane profiles inside it.

## Structure

- Split the document into a data plane (machines, claims, ledger,
  signals, plan derivation, scenarios) and a control plane contract (the
  few operations the engine needs, with their guarantees), then profiles
  that satisfy the contract: GitHub tracker, git-only, custom.
- Inside the data plane, name the boundary between the generic
  reconciliation engine (load definitions, evaluate guards, choose
  transitions, run effects idempotently, derive rows) and the flywheel's
  domain (its machine definitions and predicate/effect atoms).

## Construction

- Findings and chores are artifacts of the change they arose in
  (`findings/`, `chores/` in the change directory), written during
  build, verify and review, archived with the change.
- Chores collected at the bolt level are done by one session on the
  bolt branch before landing; a construction session fixes only inside
  its own job. No coordinator process.
- A stage may send an item back to an earlier stage; the bolt type
  names each stage's agent and its on-fail target, with a bounded retry.
- A baseline proposal for a new repository may be chores as well as
  units; a chore may satisfy a claim and produce a verdict.
- Every git operation on a repository (branch creation, worktree add and
  remove, merge into the bolt branch, landing) is an effect the engine
  performs deterministically. A session receives a prepared worktree
  and commits inside it; it never creates branches, merges, or lands.

## Instructions and skills

- Schemas, artifact instructions and type skills are versioned data.
  Every session's inputs are enumerable: schema instruction, type
  skill, work order, change directory, and nothing else. A test can
  render the exact prompt a scenario would produce.
- Changing an instruction is a chore, and the model says where the
  instructions live and how a change reaches every host.

## Claims

- Decide: claims as OpenSpec requirement blocks included by anchor, or
  fenced claim blocks with a hash lock.

## Plan

- Mock the plan as a terse tree with one example of every row kind,
  iterate with the operator, then encode what the plan does and does
  not do.

## Testing

- Every machine is unit-testable with a fake control plane (fake herdr,
  fake tracker or git). Scenarios are data: given stores, when ticks or
  events, then transitions, effects and rows. A scenario can be dictated,
  run, and rendered as a trace.

## Language

- The rewrite targets Rust: a pure engine crate plus control-plane
  adapters as trait implementations, one static binary per host.
