# Verification

This chapter owns the factory-floor QA for the flywheel: the shared
backend stages, fixture library, and harnesses every proposal docks
onto. It is not the place for per-proposal unit tests — a change ships
those inside its OpenSpec directory. The job of this page is to make
every change reuse one fixture library and one harness set instead of
inventing its own scaffolding.

The factory metaphor: a proposal is a blueprint for one piece of the
factory; this frame is the QA stations on the floor — fake materials,
jigs, end-of-line acceptance tests — that every blueprint passes
through before its piece is bolted in.

The frame rests on one fact: loop programs are ordinary Python, so a
full cycle — guards, stages, merges, pauses — runs as a unit test with
no herdr, no `claude`, no token, no network, and no sleeping. The
loops' determinism is proven here, at build time; the operator's
[run reports](observation.md) exist for what tests cannot pin —
session judgment and the tracker's history.

## Backend stages

**Stage 1 — fake.** The loop under test runs in-process against a
fixture tracker (a fake of the GitHub tracker's read and write
surface, seeded from a scenario), a scripted runner (session outcomes
played back on cue — settle states, findings files, and review rulings
written to a temporary git tree), a fake shell answering `git` /
`openspec` / `wt` from a table, and a fake clock. Hermetic; runs on
every merge. This is where the loop's two properties live — the dry
cycle (a second pass against an unchanged tracker writes nothing) and
outcomes read from the world (a stage is done because git and openspec
say so, never because a session said so).

**Stage 2 — golden record.** A full loop run against a fixture-tracker
scenario, asserted by comparing the [run record](observation.md)
against a golden record checked in beside the scenario. The record
lists every tracker write with its reason and every session outcome
expected versus actual, so two runs are machine-comparable line by
line; a regression is a diff, read the same way the operator reads a
run report. Runs on every merge that touches a loop program.

**Stage 3 — live fire.** A real tracker, real sessions, real repos,
with the loop [held](observation.md): each pass waits for the
operator's approval, the run executes, and the operator evaluates the
run report. This stage exercises what no fake
carries — GitHub's actual API, herdr's actual panes, real model
judgment inside sessions. Per-release, never per-merge; its evidence
is the report, not an assertion.

A test declares which stage it requires. Stage 1 is the default.

## Fixture library

The library lives in the flywheel repo's `tests/` tree, beside the
harnesses that read it. Three flavors:

- **Fixture-tracker scenarios** — issues, labels, milestones, and
  comments in a starting position: a unit with ready items, a bolt
  mid-build, a torn close, an empty queue. A scenario name resolves to
  the same starting state in every stage.
- **Scripted session outcomes** — the file-channel artifacts sessions
  produce: verify findings files (or the `NONE` sentinel), review
  ruling JSON (`proceed` / `refix` / `escalate`), settle-state
  sequences for the runner to play back.
- **Golden run records** — the expected run record for a scenario,
  one per stage-2 case.

Fixtures are versioned with the schema they conform to; the shapes are
the [contracts](contracts.md) this book extracts.

## Harnesses

- **Unit suite** — the per-merge suite over the loop programs'
  substrate: inbox filters as pure functions over a snapshot, stage
  guards, session lifecycle, the server's reconcile pass. Runs first
  in CI and bails the rest early on failure.
- **Full-cycle loop tests** — a whole bolt or intent cycle driven
  in-process from a scenario to its terminal tracker state, asserting
  every write the loop performed and the order it performed them in.
- **Restart / recovery** — kill a loop mid-run, start a fresh process
  against the same scenario, assert it re-reads the tracker and the
  tree and converges without repeating a completed stage or stranding
  an item.
- **Golden-record comparison** — run a scenario end to end, diff the
  run record against its golden; any divergence fails with the diff as
  the message.
- **Contract tests at the boundaries** — one per extracted contract:
  every run-record entry validates against the record schema, every
  ruling fixture against the ruling schema, every label the loops read
  or write against the label taxonomy.

## Proposal docking

A change on the flywheel lands inside this frame rather than building
beside it. Its OpenSpec change declares: which scenarios it reuses, by
name; which scenarios and golden records it adds, shipped in the same
change; which harnesses it extends — new assertions inside existing
harnesses, not parallel programs; and where its own unit tests live —
inside the change. This chapter is rewritten when the boundaries shift
enough to need a new harness or fixture flavor, not each time a change
lands.

## What this frame does not cover

- GitHub's API behavior — the fixture tracker implements the contract
  the loops see; stage 3 is where GitHub answers for itself.
- herdr's pane and session-hosting semantics — named in
  [Sessions](sessions.md), designed elsewhere.
- Model behavior inside sessions — judged by the operator through
  [run reports](observation.md), never asserted by a harness.
- Built-repo internals — a built repo's own gates and suites verify
  what the flywheel drives into it; this frame verifies the driving.
