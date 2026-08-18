# Assertion: the commissioning template stops shipping dead links

- **Repo:** willdan-blueprints
- **State:** open — not this intent's
- **Raised by:** sessions/2026-08-06-dead-link-repair/report.md finding 4

## The claim
`books/commissioning-template` no longer links `hil-gateway` and
`phase-workflows`, two books that have never existed here.

## Why
The template is copied into target repos, so it ships those dead links into
every repo scaffolded from it.

## Boundaries
Decide before the next repo is scaffolded, not after.
