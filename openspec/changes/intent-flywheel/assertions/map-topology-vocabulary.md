# Assertion: the map's topology vocabulary is written once

- **Repo:** willdan-blueprints
- **State:** open
- **Raised by:** sessions/2026-08-06-flywheel-repo-split/flags.md finding 10

## The claim
`SLOTS`, `STORE_SLOTS` and `FAMS` in `map-check.mjs` and `CFG_GEOM` in the
viewer become one definition both read.

## Why
Two copies of one vocabulary drift silently, and `map-check` can already
pass a combination the viewer cannot draw. A defect in the tool as it
stands, worth fixing before extraction rather than carrying into it.

## Boundaries
Independent of the move; it improves the tool either way.
