# Unit: the-implemented-drive-gets-its-specs

System: flywheel

The loop already drives units as written: it reads each card's `Type:`
line at drive time and refuses an unknown type loudly; the verify
session writes `.flywheel/verify.md` and the review session rules in
`.flywheel/review.json`; refix prompts go verbatim to the still-warm
build session inside a two-round budget, and every missing or
unreadable answer pauses the bolt with its reason named; the fleet
binding's book path rides into every work order; and every tracker
write mints the App identity through one seam that fails closed. None
of it is recorded in `openspec/specs/`, which is why a planning run
kept reading the built behavior as a gap. This unit writes the specs
from the code and the book — and any behavior the book promises that
the tree turns out to lack is queued as a finding, never quietly
specced around.

Sequence: 2 of 2 · builds on: none
Type: `bolt-quick` · Price: 2 changes · ~1 day

| # | change | delivers | sources | after | why this bolt |
|---|--------|----------|---------|-------|---------------|
| 1 | `the-drive-behaviors-spec` | openspec specs recording per-unit type reading (loud refusal included), the verify and review file channels, the fix budget, and every pause that replaces a guess | books/flywheel/src/construction-loop.md · books/flywheel/src/schemas.md · bin/_flywheel_bolt_loop.py | — | the record catches up to the drive it governs |
| 2 | `the-context-and-identity-spec` | openspec specs recording the book path in every work order and the one App-identity seam that fails closed; gaps found against the book (a missing retry discipline, if the read confirms it) queued as findings | books/flywheel/src/construction-loop.md · bin/_flywheel_gh.py | — | same alignment, different chapters |

## Left out

- Any new drive behavior. This unit records what exists; anything the
  book promises and the tree lacks becomes a queued finding for the
  next round, not a silent addition here.

Supersedes: #349 (first change), #350, #351, #352 — all four describe
behavior the tree already implements.

Derived from: book e106f26 · specs 483c574 · in flight: add-flywheel-loops, observer, records-and-elaborations, site-five-beats, site-teaches-the-system, operating-docs, messy-repo-onboarding, writeback-in-session
