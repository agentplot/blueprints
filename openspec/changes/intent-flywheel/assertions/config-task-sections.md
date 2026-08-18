# Assertion: openspec/config.yaml states the task sections the schema states

- **Repo:** willdan-blueprints
- **State:** open
- **Raised by:** sessions/2026-08-07-loop-layer, measured on main

## The claim
`openspec/config.yaml`'s `rules.tasks` names the same intent task sections
`flywheel-intent/schema.yaml` names. Today the config says
`Design/Writeback/Handoff` and the schema says `design`, `planning`,
`research`, `prototype`, `writeback`, `handoff` — with `verify` in use
besides.

## Why
Both reach the same agent in the same instruction payload, both in settled
voice, and an enumeration is the thing an agent copies. This is the
one-answer defect with the two answers in different files, which is the
variant no single-file read catches.

It is mine, and it is one morning old: the schema was retyped by session
when `decisions/session-types-are-the-task-taxonomy.md` landed, and the
config was not. Worth recording rather than quietly fixing, because it is
the second instance today of a rule being corrected in the instruction and
left standing in its sibling — the template case was the first.

## Boundaries
The config's bolt line (`Spec/Review/Build/Test/Merge`) is checked in the
same edit but is not assumed wrong; the session's taxonomy work may rename
the `construction` session type to `build`, which would make the two agree
by a different route. Machinery, so it arrives through a bolt like any
other file edit here (→ decisions/blueprints-is-a-built-repo.md).
