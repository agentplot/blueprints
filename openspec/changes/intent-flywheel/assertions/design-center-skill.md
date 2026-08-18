# Assertion: a `design-center` skill carries the two-layer page practice

- **Repo:** agentplot/flywheel
- **State:** open — drafted and committed as a scratch skill in blueprints
  at `.claude/skills/design-center/`, referenced by nothing; the build is the
  move, not the writing
- **Raised by:** the operator, 2026-08-07, on the loop-layer page —
  "that shape was much better than what came before it"

## The claim
A skill exists at `skills/design-center/` in the flywheel repo, carrying the
shape the loop-layer page arrived at: **conceptual first, then logical, the same
objects in both.**

- **Conceptual** — one diagram of the whole system nested, one tight table
  per object family, a journey view of one slice end to end. Brevity is the
  constraint, not a preference.
- **Logical** — the same objects as real YAML, real *measured* command
  output, real payloads. Anything illustrative rather than measured is
  labelled as such on the page.
- **Decisions as a stored ledger.** Only open decisions get a control;
  settled ones are recorded and collapsed. About four controls at once is
  the practical cap.
- **The mechanics that decide whether the page opens at all.** No external
  requests — hand-authored SVG, nothing from a CDN. Match the subject
  project's design tokens. Guard horizontal overflow. One write per round.

It is a **standalone skill**, not folded into `flywheel-interactive`, which
keeps the flywheel session-type practice and points here for how to build
the page.

## Why
The page reached this shape only after **four rounds of correction**, and
each mechanic in the list cost the operator a round:

- a CDN-dependent page that spun rather than rendering,
- a reload storm from many small writes,
- sixteen simultaneous decision forms, which he named as fatigue.

A rule with its incident attached survives a refactor; a rule without one
reads as ceremony and gets removed. The worked example is
`sessions/2026-08-07-loop-layer/loop-layer.html` with `README.md` beside
it, and the draft the session wrote is preserved at
`sessions/2026-08-07-design-center/`.

**Two tests place it, and they answer different questions.** The four-home
test (→ `decisions/the-four-home-test.md`) says it is a *skill* rather than
a schema instruction or a profile: it would read identically under any
schema. The manifest test (→ `decisions/flywheel-repo-manifest.md`) says it
belongs in the *flywheel repo* rather than blueprints: is this the tool's,
or is it Willdan's? Nothing in the practice is Willdan's. It is the same
class as the book skills already travelling — the flywheel builds design
pages, so it carries how one is built.

Building it in blueprints would mean writing it and then migrating it, for
a file that does not exist yet.

## Boundaries
It does **not** cover the flywheel's session-type practice — when a design
session is charged, what it reports, how the conductor promotes it. That
stays in `flywheel-interactive`, which gains a pointer here.

That pointer cannot land yet: `flywheel-interactive` is in blueprints until
the split, and a skill there must not reference a file in another repo. The
skill itself is buildable now and sits unreferenced; the pointer rides the
migration (→ `assertions/flywheel-repo-split.md`). Building it early is
still right — the alternative is writing it twice.

Being standalone and non-flywheel, its name is not governed by the
flywheel's closed vocabulary (→ `decisions/the-closed-vocabulary.md`).
`design-center` is the working name and is the operator's phrase for what
the page became; it is not a flywheel term and does not join that list.
