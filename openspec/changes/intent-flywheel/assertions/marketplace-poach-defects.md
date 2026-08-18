# Assertion: the poached book material is fixed, not copied

- **Repo:** willdan-marketplace
- **State:** open — not this intent's
- **Raised by:** sessions/2026-08-06-flywheel-repo-split/flags.md findings 15, 16

## The claim
`system-design-inception`'s cross-book link rule stops rejecting `../../`,
and `voice-rules.md`'s dangling references are repaired — it cites ban lists
that are not in the file and a step 8 while listing seven steps.

## Why
Its link rule is the flat-book rule blueprints already corrected; poaching it
unfixed would import a rule that rejects valid links. The dangling citations
suggest the bolt that dropped its proposals lints removed the lists.

## Boundaries
That repo has no gate (→ assertions/marketplace-gate.md), so this lands
unverified until one exists.
