# Unit: bolt-plan-speaks-semantics

System: flywheel

A bolt type is a semantic promise to the operator — how much scrutiny
this unit's work gets — and nothing else. Whatever internal
configuration a type maps to (stage sets, spec commands, session modes)
is the plugin's business, kept inside the schema files and never
surfaced on a card, in a plan, or in operator-facing prose. `bolt-plan`
means: the plan approved in the session pane stands as the spec and the
repo's gate is the check — so it declares no spec strategy at all,
because plan mode bypasses the spec artifact entirely. Today its schema
leaks `strategy: ff`, an internal that contradicts the type's own
meaning.

Sequence: 1 of 2 · builds on: none
Type: `bolt-quick` · Price: 1 change · ~0.5 days

| # | change | delivers | sources | after | why this bolt |
|---|--------|----------|---------|-------|---------------|
| 1 | `bolt-plan-sheds-the-leaked-strategy` | the bolt-plan schema declares no spec strategy and the loop treats its absence as "no spec commands to run"; every type description in schemas and skills speaks the operator's semantics, with internal keys explained only in the schema file's own comments | schemas/bolt-plan/schema.yaml · bin/_flywheel_bolt_loop.py (unit_config, the strategy table) · the operator's ruling in this round | — | the type IS the operator's dial on this bolt's deliverable |

## Left out

- Renaming or collapsing the other four types — their semantics are not
  in question, only the leak.

Supersedes: #349 (its second change; its first is already implemented —
see unit 2).

Derived from: book e106f26 · specs 483c574 · in flight: add-flywheel-loops, observer, records-and-elaborations, site-five-beats, site-teaches-the-system, operating-docs, messy-repo-onboarding, writeback-in-session
