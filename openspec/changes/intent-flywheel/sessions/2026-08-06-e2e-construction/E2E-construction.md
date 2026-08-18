# Flywheel end to end, part two — a released slice becomes landed code

Construction walked step by step: every command, file, session, skill, and
repo from the operator's release to merged branches, archived changes, and
findings routed back. It picks up exactly where
`sessions/2026-08-06-e2e-design-loop/E2E-design-loop.md` leaves off — the
rocs record split, with its writebacks landed and its Handoff tasks staged.

Paths: blueprints main is `willdan-blueprints/main`; the built repo is
`rocs-kit`. The sample bolt is `openspec/changes/bolt-rocs-records/`.

Actors on stage here: **operator** (Chuck), the **intent conductor**
(`intent-rocs-record-split`, still running), the **bolt conductor**
(`bolt-rocs-records`, blueprints main, long-lived), the **spec / apply /
testing agents** it dispatches, and **dispatch** — the standing singleton
that relays inner-loop escalations to the operator and design-level
findings back to the intent.

---

## §4 — The phase gate: the operator releases; the bolt is requested

Releasing is the operator's word, given directly to the intent conductor:

> "release registration records — and run records when it unblocks."

The intent conductor never writes a bolt change. It checks for a bolt in
scope, finds none, and requests one into existence:

```bash
herdr agent list | grep bolt-rocs-records   # no conductor running
# create the bolt change (flywheel-bolt schema) with bolt.md naming the
# source handoff tasks, rocs-kit + branch bolt/rocs-records, merge criteria;
# proposals.md rows: registration records (review: human), run records (agent)
herdr agent start bolt-rocs-records --kind claude --pane <pane> -- --agent flywheel-bolt-conductor
herdr agent prompt bolt-rocs-records "/rename bolt-rocs-records"
# first prompt names the bolt: /opsx:continue bolt-rocs-records
```

(Had the bolt already been running, this would have been one
`herdr agent prompt` — or, with the conductor parked, a file in
`openspec/changes/bolt-rocs-records/inbox/`.)

## §5 — The bolt loop: spec, review, build

The bolt conductor (skill: `flywheel-construction`) cuts the bolt branch
for the bolt's lifetime and drives the registry:

```bash
# one bolt branch + worktree per involved repo
herdr worktree create --cwd ../../rocs-kit \
  --path ~/.herdr/worktrees/rocs-kit/bolt-rocs-records \
  --base main --branch bolt/rocs-records --no-focus --json

# SPEC: a spec agent per proposal, opsx ff citing the design sources
herdr agent start spec-registration --kind claude --pane <pane> -- --model fable
#   → rocs-kit openspec/changes/add-registration-records, validated
#   registry: to-spec → specced

# REVIEW: this row declares human review
plannotator annotate <rocs-kit>/openspec/changes/add-registration-records/proposal.md
#   operator approves with one note → folded into tasks; registry → approved

# BUILD: an apply agent on a nested construction worktree off the bolt branch
herdr worktree create --cwd ../../rocs-kit --base bolt/rocs-records \
  --branch constr/registration-records \
  --path ~/.herdr/worktrees/rocs-kit/constr-registration-records --no-focus --json
herdr agent start sub-reg-impl --kind claude --pane <pane> -- --model fable
#   working arrangement recorded on the Build task: reviewed — admission contract
#   commit stage on every push (repo's wt pre-commit hook)
wt merge bolt/rocs-records --no-remove -C ~/.herdr/worktrees/rocs-kit/constr-registration-records
#   merge gate on the rebased tree; registry → built
```

## §6 — Test, and the two kinds of finding

A one-shot testing agent runs acceptance batch 1 on the bolt branch (full
reset, scenarios reseeded — never inside a construction worktree). It
reports two findings:

- **Construction-level** ("registration reads fall back to DynamoDB on an
  empty release") — the agent drops it in the bolt's `inbox/`; the
  conductor drains it into a new Test task next turn, same commit, file
  deleted.
- **Design-level** ("reads assume a status column — the parked
  state-machine question now blocks") — routed through **dispatch**, which
  requests the intent conductor; the intent's design task for
  `q-parked-state` is now urgent, and the run-records handoff stays
  blocked behind the decision.

The operator grabs the intent again → a design session closes the
state-machine decision → writebacks land → the intent conductor releases
run records into the *running* bolt with one prompt; its registry row moves
`to-spec` and the loop §5 repeats for it.

## §7 — Merge, land, archive

Batch 2 comes back green and the bolt's merge criteria hold (its own
bolt.md is the authority). The conductor lands:

```bash
wt merge --no-remove -C ~/.herdr/worktrees/rocs-kit/bolt-rocs-records
#   the full release gate, full hooks, on the exact rebased tree
```

Registry rows → `merged` with SHAs on the Merge tasks; the built repo's
spec-driven changes are archived (`openspec archive add-registration-records`
in rocs-kit); construction worktrees, the bolt branch, and resources are
torn down per conduct. The bolt conductor reports each landed handoff to
the intent conductor (prompt), which checks the intent's Handoff tasks.
When the bolt's registry is fully merged:

```bash
openspec archive bolt-rocs-records     # the construction record, one unit
```

And when the intent's tasks are all checked with writebacks green:

```bash
openspec archive rocs-record-split     # decisions, reports, prototypes — one unit
```

The books describe the destination, the map cites the chapters, the
archives hold the journey — and the next intent starts warmer than this
one did.
