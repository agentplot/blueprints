# Question: do the eight deployed capabilities travel with `add-flywheel-loops`?

- **State:** closed — the operator, 2026-08-10: they travel together. The
  eight capabilities and `add-flywheel-loops` are one subject and move as
  one; blueprints sheds the specs describing machinery it no longer has,
  and the flywheel repo starts with a truthful spec tree.
- **Raised by:** sessions/2026-08-06-flywheel-repo-split/flags.md finding 5
- **Blocks:** assertions/flywheel-repo-split.md

## The question
`openspec/specs/` holds eight capabilities that `add-flywheel-loops`
deployed. The manifest moves the change on the operator's annotation and
says nothing about the specs it wrote. Do both travel, or does the change
archive in place and the flywheel repo start with a clean changes tree?

## What turns on it
Moving the change without the specs leaves both halves wrong — its deltas
cite capabilities the new repo does not hold, and blueprints keeps eight
capabilities describing machinery it no longer has.

## What is already known
The change is at 10 tasks checked and 15 unchecked, which is the argument
the operator's annotation rests on: unfinished work belongs with the code
it built. The unfinished work and the deployed specs are the same subject
and should go the same way.
→ decisions/flywheel-repo-manifest.md
