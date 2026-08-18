# Assertion: thirteen session types ship under three profiles

- **Repo:** willdan-blueprints
- **State:** built — bolt-loop-layer, landed on main at ecfb85bc, 2026-08-10
- **Raised by:** the operator, 2026-08-07

## The claim
Thirteen session types have skills, hosted by three profiles. Six design
types — `design`, `planning`, `research`, `prototype`, `writeback`,
`handoff` — and seven construction types: `proposal-writing`,
`proposal-review`, `spec-writing`, `build`, `test`, `code-review`,
`human-code-review`. Each carries the same mechanic: a worktree, a batch of
task lines it completes inside that worktree, and a branch that merges when
the session finishes. `flywheel-intent`'s task sections are the design six,
plus `verify`.

The profiles: `flywheel-interactive-session` hosts `design`;
`flywheel-design-session` hosts the other five design types;
`flywheel-construction-session` hosts all seven construction types.

Each type names its default model where the type is defined — Fable for
design and spec sessions, `opus[1m]` for construction sessions — and every
launch path accepts a runtime override via args
(→ decisions/session-model-defaults.md).

## Why
The construction loop's workers were never given the design loop's
structure — a design session has a profile, a skill, a directory and a
worktree; a spec agent had a prompt. Most construction-side defects this
intent recorded come out of that asymmetry.
→ decisions/session-types-are-the-task-taxonomy.md · decisions/agent-profiles.md

## Boundaries
Two renames ride this and neither is cosmetic. `flywheel-review` becomes
**`flywheel-planning`** — it means plannotator on written drafts, and
`review` was the least specific word on one of four things that are all
reviews. `flywheel-review-session` becomes **`flywheel-design-session`**,
because once the skill is renamed none of the five types that profile hosts
is a review.

Seven construction skills are new work, 80–97 lines each on the existing
five as models. `handoff`, `build` and `test` are types no skill covers
today.
