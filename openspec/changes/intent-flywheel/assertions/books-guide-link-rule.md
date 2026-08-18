# Assertion: books/CLAUDE.md's link rule becomes depth-aware

- **Repo:** willdan-blueprints
- **State:** closed — landed on local main in `ac3d289` (2026-08-06),
  verified 2026-08-07 at `books/CLAUDE.md` lines 310–347, with the old
  prohibitions returning no grep hits. Every prior absence report,
  including this file's own, was measured against `origin/main` — 235
  commits stale — without naming which tree it read. The three slipped
  boundaries were real when reported; the fourth report was the false one
- **Raised by:** sessions/2026-08-06-kit-books-proposals-retire/report.md finding 3

## The claim
`books/CLAUDE.md` states a cross-book link rule that follows the depth of
the page doing the linking: `../` from `src/` root, `../../` one directory
below. The prohibitions it carries today — never include `src/` in a
cross-book target, never use `../../` — are replaced, not merely relaxed.

## Why
mdBook renders `src/<dir>/<page>.md` to `<book>/<dir>/<page>.html`, so 109
chapters a directory below `src/` require the form the guide forbids. The
guide generates exactly the dead links the books gate reports.

This row landed half built and was reported complete twice. The
proposals-mandate half is on main; the link-rule half was never built. It
survived because the bolt reported the correction in, the conductor verified
the *per-book guides*, found them clean, and repeated the claim — each of us
checking the adjacent thing. A confirmation is not evidence when the
confirmer verified a neighbour.

## Boundaries
Placed with `bolt-blueprints-tooling`, which specced this section and whose
`books-gate-truth` requirement the absence blocks. Repairing links is
separate book work; the gate itself resolves paths against the deployed
layout and never reads the guide, so nothing is blocked on this but the
requirement.
