# Assertion: flywheel-bolt splits into five schemas

- **Repo:** willdan-blueprints
- **State:** built — bolt-loop-layer, landed on main at ecfb85bc, 2026-08-10
- **Raised by:** the operator's structured feedback, 2026-08-07

## The claim
`bolt-default`, `bolt-quick`, `bolt-deep` and `bolt-no-spec` exist as
schemas. They share their artifact instructions; only `apply.instruction`
differs, and it holds the loop prompt. A bolt binds the member matching its
work, visibly, in its `.openspec.yaml`.

## Why
Choosing depth by binding a name settles once what a prose rule kept
re-opening.
→ decisions/the-bolt-schema-family.md · decisions/three-schemas.md

## Boundaries
Four, not five: chore and fast differed only in "no" versus "may", which is
latitude every member already has. The `opsx` infix is dropped.
`spec-driven` stays the project default.
