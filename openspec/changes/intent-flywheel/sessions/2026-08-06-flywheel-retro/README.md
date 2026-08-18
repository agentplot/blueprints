# Session: flywheel retrospective

**Change:** `flywheel` · **Type:** research · **Date:** 2026-08-06

## Charge

Read the intent-flywheel conductor and the bolt conductors it managed —
session transcripts, the change's own artifacts, and git history — and
produce findings that improve the design loop itself. Four axes: operator
feedback, token waste, skill inefficiency, jargon. Read-only investigation;
one written deliverable; no edits to any change.

## What it read

62 session transcripts (28,972 lines) across ten project directories, 138
subagent transcripts, the `flywheel` change in full, four bolt changes, both
schemas, the skills and the five agent profiles, and 305 commits. Token
figures come from the transcripts' own `usage` fields.

## What it produced

`findings.md` — the report, in the state the operator's review left it.

## The review round

The findings went to the operator through `plannotator annotate` and came
back with 28 annotations. What they changed:

- **Framing.** The loop was built while it ran, and it fixed several of
  these defects itself before the read began. The report says so, and
  separates what the loop could not see from what it simply had not got to.
- **`conduct` is absorbed, not referenced.** The remedy is no longer "load
  the skill" but taking its content into the flywheel skills, with a
  bundled herdr reference carrying explicit invocations. This replaces four
  separate recommendations.
- **Tasks are orchestration steps.** A bolt's `tasks.md` holds subagent
  orchestration and nothing else; no scratchpad, and `notes.md` is not the
  answer.
- **Approvals, not gates.** "Phase gate" leaves the vocabulary. A conductor
  that needs approval asks for it with `AskUserQuestion`.
- **Review is a judgement.** The landed one-round bound is prescriptive in
  the wrong direction; a conductor may add a review task and need not for
  small text edits.
- **ADRs need a home.** Retiring the type left no construction-side route,
  and a bolt conductor should be able to write one.
- **Bolt conductors get a cheap self-improvement path** — named direct
  edits, `wt step rebase` to catch up — and conductors working on main
  should hold their own cheap worktrees.
- **Jargon may be partly upstream of the repo.** The report now separates
  the four coinages traced to repo artifacts, which are ours to fix, from
  the baseline tendency, which is unmeasured and turns on whether a skill
  can pin an output style.

Two recommendations the operator found unclear are rewritten plainly (the
reporting rule and the builder read-through); the read-through is carried as
an open question rather than a recommendation, since its value is his call.

## Delivered to the conductor

- This session directory, for a row in `design.md`.
- One Handoff task: generate a proposal in willdan-blueprints carrying the
  accepted findings into the skills, the schemas, `openspec/config.yaml`,
  `books/CLAUDE.md` and root `CLAUDE.md`.

Six of the report's items are decisions rather than construction — the
vocabulary set, where ADRs live, the review criterion, the direct-edit
whitelist, the conductor-worktree rule, and whether a skill can pin an
output style. Those are the conductor's to close or to put to the operator
before the handoff is released.
