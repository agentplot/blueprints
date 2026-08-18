# Assertion: construction is reviewed by personas, before and after the build

- **Repo:** willdan-blueprints
- **State:** built — bolt-loop-layer, landed on main at ecfb85bc, 2026-08-10
- **Raised by:** the operator's structured feedback, 2026-08-07

## The claim
A matrix of built repos by personas exists — the data scientist at a CLI,
the library developer integrating an SDK, the DevOps engineer deploying it.
`flywheel-construction`'s sequence becomes: proposal written, persona review
against it with the changes made, fast-forward, construction, then code and
adversarial review. A smell check reads the work against the rest of the
codebase, and a conductor meeting a large enough smell pulls the andon cord
and asks for a human read. After the build, one agent per persona exercises
the application; findings the intent does not cover go back to the intent,
findings that contradict it become new proposals.

## Why
A proposal is cheap to change and built code is not, so the people who will
use the thing read it while it is still text.
→ decisions/the-persona-loop.md

## Boundaries
Whether a persona question the intent never asked is evidence the intent was
incomplete is an open Design question, not settled here.
