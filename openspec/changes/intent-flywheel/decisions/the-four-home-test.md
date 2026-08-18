# Decision: a rule has four possible homes, and one test picks each

## Decision
Every rule the flywheel states lives in exactly one of four places, chosen
by asking three questions in order. The first `yes` decides it.

**1. Could a bolt rewriting the skills delete it — and would that be a
defect?** → `openspec/config.yaml`, the `context:` block. Carried into every
`openspec instructions` call, so no skill rewrite can remove it. Holds the
six-term vocabulary, the three envelopes, commit-by-pathspec.

**2. Does it change when the schema changes?** → `schema.yaml`, in an
artifact's `instruction` or in `apply.instruction`. Holds the workflow
prompt, what each artifact contains, the proposal state ladder. **This is
what makes two bolt members differ.**

**3. Can the actor reach a wrong conclusion from its profile alone?** →
`.claude/agents/<profile>.md`. Loaded before the first prompt and surviving
compaction. Holds write scope, never-the-Agent-tool, which loop you are in.

**No to all three** → `.claude/skills/<skill>/SKILL.md`. How a way of
working is run — it would read identically under any schema.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/authoring-capabilities.md`
- Produced by: `sessions/2026-08-07-loop-layer/` decision 12, closing
  `questions/skill-register.md`

## What this settles about register
A skill **instructs**, with one clause of warrant; the evidence lives in the
decision record. That resolves the standoff between the review finding that
asked for instruction with the reasoning stripped and the
mechanism-is-not-a-justification rule that requires the fact making a
constraint correct — one clause satisfies both, a paragraph satisfies
neither.

It also explains why the vocabulary moved to the config and why the loop
moved to `apply.instruction`: both were in skills, and both failed test 1
and test 2 respectively. The test is the generalization of two corrections
already made.

## Consequences
- Roughly 190 lines across the two loop skills are in the wrong home — the
  reads-as-instruments section and the state-claim rules are authoring
  guidance for the agents a conductor dispatches, not for the conductor.
- `flywheel-construction` at 366 lines and `flywheel-inception` at 429 are
  the two files this test shrinks; the session-type skills at 80–97 lines
  already pass it.
- Every future rule cites which test put it where it is.
