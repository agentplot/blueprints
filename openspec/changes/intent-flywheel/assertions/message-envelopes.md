# Assertion: three message envelopes, in openspec/config.yaml

- **Repo:** willdan-blueprints
- **State:** built — bolt-loop-layer, landed on main at ecfb85bc, 2026-08-10
- **Raised by:** the operator's structured feedback, 2026-08-07

## The claim
`openspec/config.yaml`'s shared context defines one envelope per routing
disposition — answer the sender, extend the bolt, extend the intent — with
named parts. Both skills point at them rather than describing message
content. The report-length rule lands here as shape rather than as advice.

## Why
Transport is stated on every leg and payload on none, so agents invent
terminology per message. The config is the home for the same reason the
vocabulary is: every instruction call carries it and no bolt can rewrite it
out of a skill.
→ decisions/message-envelopes.md · decisions/the-closed-vocabulary.md

## Boundaries
Whether an agent responds against its work item by ID is an open Design
question answered with the envelopes, not before them. The missing
intent-conductor-to-dispatch leg is a separate open question.
