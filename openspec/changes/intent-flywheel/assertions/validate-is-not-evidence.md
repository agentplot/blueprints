# Assertion: an artifact is checked against its instructions, not against `validate`

- **Repo:** willdan-blueprints
- **State:** open
- **Raised by:** `bolt-kit-lift`'s six spec agents, batch 0, routed by
  `intent-kit-lift`; source claims re-verified here 2026-08-07

## The claim
`openspec/config.yaml`'s `context:` block states that **`openspec validate
--strict` passing is not evidence an artifact is contract-shaped**, and
names the check that is: diff the artifact against
`openspec instructions <artifact> --change <id>`.

For the silently-dropped-requirement case it names the count, because a
diff by eye will not catch it:

```
openspec show <id> --json --deltas-only   # count requirements, and scenarios
grep -c '^### Requirement:' <spec file>
```

Both counts must agree. `cortex-kit` ran it: 16 against 16, 35 against 35.
Scenarios are counted too — a three-hash slip drops them the same way.

## Why
Strict green measures less than it appears to, and an agent that has run it
reasonably believes it has checked its work. Verified in the tool's own
source, openspec 1.7.0:

- **`core/parsers/change-parser.js` allowlists four section names** —
  `ADDED`, `MODIFIED`, `REMOVED`, `RENAMED` Requirements — each as its own
  `if (section)` with **no else branch**. A requirement under any other
  heading is not rejected; it is never looked at. There is no code path
  that could report it. `spec-rocs-kit` found this by writing under
  `## OPEN Requirements`: validate green, `openspec show` returned the
  requirement absent.
- **`core/specs-apply.js` contains the literal `Update Purpose after
  archive`.** A delta spec missing `## Purpose` passes strict, and
  `openspec archive` then writes that placeholder into the permanent main
  spec it creates — so the defect surfaces long after the change that
  caused it is archived.
- **The Purpose check exists and does not reach the artifact that needs
  it.** `core/validation/validator.js` carries "Spec must have a Purpose
  section" and `constants.js` carries `SPEC_PURPOSE_EMPTY`; neither reaches
  delta specs inside a change. The rule is written, and the artifact class
  it should govern sits outside its reach.

Two spec agents measured this independently in different repos without
knowing the other had.

## Boundaries
The parser allowlist and the unreached Purpose check are **upstream
defects**, not ours to fix — they are reported to OpenSpec separately. This
assertion is only the practice: what an agent runs to know its artifact is
sound.

It is not flywheel-specific. Every `spec-driven` change in every built repo
has the same gap, which is why it lands in the shared context block rather
than in a flywheel skill (→ `decisions/the-four-home-test.md`, test 1: a
bolt rewriting the skills could delete it, and that would be a defect).
