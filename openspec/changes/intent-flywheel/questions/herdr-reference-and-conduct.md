# Question: do the session-type skills each carry the herdr reference, and does `conduct` retire?

- **State:** closed → decisions/the-herdr-reference-package.md · sessions/2026-08-07-loop-layer/
- **Raised by:** operator feedback D1, against what landed
- **Blocks:** nothing

## The question
Two halves. `conduct`'s content was absorbed into both loop skills, each
with a bundled `reference/herdr.md`. The five session-type skills did not
get it. Do they each carry a copy, or does inheriting it from
`flywheel-inception` — which every session profile already loads — cover
them? And separately: does `conduct` retire outright, or survive as the
non-flywheel playbook?

## What turns on it
Whether the reference is duplicated seven times or resolved by inheritance,
which decides how it stays consistent. And whether a skill outside the
flywheel keeps a home.

## What is already known
The absorption was the retro's largest single fix: eight of twelve flywheel
sessions never loaded `conduct`, and `bolt-flywheel-machinery` ran 98
Agent-tool subagents against its rule 1, which forbids exactly that. So
inheritance is the mechanism that already failed once — that is evidence
about the answer, not a decision.
→ sessions/2026-08-06-flywheel-retro/findings.md
