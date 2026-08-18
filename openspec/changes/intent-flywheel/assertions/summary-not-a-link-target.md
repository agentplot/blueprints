# Assertion: the books gate refuses SUMMARY.md as a link target

- **Repo:** willdan-blueprints
- **State:** open
- **Raised by:** sessions/2026-08-06-dead-link-repair/report.md finding 1

## The claim
`books/preview.py` reports a chapter linking `SUMMARY.md` by name, as its
own class rather than inside the general dead-link population.

## Why
mdBook does not publish the table of contents as a page, so such a link is
dead by construction and the checker should say which failure it is.

## Boundaries
Repairing the existing instances is book work, not this.
