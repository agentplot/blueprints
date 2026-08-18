# Assertion: the viewer's dependency on books/ is named and made optional

- **Repo:** willdan-blueprints
- **State:** open
- **Raised by:** sessions/2026-08-06-flywheel-repo-split/flags.md finding 11

## The claim
`context-map/book-grab.js` is a symlink into `books/`. The edge is recorded,
and the extracted viewer works with no books tree present.

## Why
The viewer depends on a tree the manifest keeps in blueprints and no record
names it — the kind of edge found at the worst moment.

## Boundaries
Decides whether the integration is optional, not whether the map moves.
