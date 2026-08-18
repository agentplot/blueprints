# Decision: six terms, in `openspec/config.yaml`, and the list is closed

## Decision
The flywheel's private vocabulary is **six terms — intent, bolt, decision,
handoff, proposal, writeback** — each naming a thing with a schema, a
directory and a lifecycle.

Three coinages leave:

- **fog** — 25 uses, every one substitutable by *open questions*. The
  schema installs it and refutes it in the same line: `intent.md` section 4
  is "Fog — what is not yet decided, as questions", putting the plain
  phrase beside the coinage that replaces it.
- **frontier** — 14 uses, all meaning "the open items in `tasks.md`".
- **phase gate** — what it names is an **approval**, and the mechanism is a
  conductor asking for one with `AskUserQuestion`. Calling it a phase gate
  is what turned an approval into ceremony.

The list lives in `openspec/config.yaml`'s `context:` block, not in the
skills, so every `openspec instructions` call carries it and **no bolt can
rewrite it out of a skill**. Both divergent lists come out of the skills.

The set is closed, and says so: *a term outside this list that is not an
ordinary technical word is a defect; use the plain word or add the term to
this list in the same commit.*

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md`
- Produced by: the operator's annotations on
  `sessions/2026-08-06-flywheel-retro/findings.md`

## Why the config and not the skills
`bolt-flywheel-machinery` raised "surface" in the skills and profiles from
10 uses to 52, making it the most-used banned word in the very skills that
ban it; installed "state claim" as a section heading in
`flywheel-inception` six hours after a spec agent coined it; and put "seam"
into the skills for the first time. No merge criterion read the prose.

A skill cannot govern the bolt that rewrites it. The config block is
carried into every instruction call and is not a skill any bolt is
rewriting.

## Why "closed" needs saying
The old wording — "are the whole private vocabulary" — describes a set
without forbidding additions. Fourteen terms arrived in one day without
anyone breaking a rule.

## Consequences
- `openspec/config.yaml` carries the six and the closure sentence.
- Both skills lose their vocabulary lists rather than having them corrected.
- Approvals are called approvals; a conductor needing one asks with
  `AskUserQuestion`.
- This intent's own artifacts use *open questions* and *the open items in
  tasks.md*. The three retired terms are not find-and-replaced through
  settled records — a record is rewritten when it is next edited for
  another reason.
