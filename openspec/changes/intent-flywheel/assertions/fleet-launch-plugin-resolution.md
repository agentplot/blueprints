# Assertion: a fleet launch verifies plugin resolution before it starts an actor

- **Repo:** agentplot/flywheel
- **State:** open
- **Raised by:** dispatch, 2026-08-10 — measured while starting this
  change's own conductor; evidence in dispatch's transcript, rewritten
  same day after the machine was repaired

## The claim
The launch mechanism (`bin/flywheel` or its successor) verifies the
flywheel plugin actually resolves before starting an actor on a profile,
and declares `--plugin-dir <checkout>` as its fallback when it does not.
A launch that cannot resolve the profile says so and names the fallback,
rather than timing out in a pane.

## Why
A broken plugin source is silent until a profile fails to resolve. A
half-done `claude plugin install` left `installed_plugins.json` pointing
at a cache directory never written, the marketplace flipped to the github
source that needs exactly that cache, and every claude started in that
window loaded no flywheel plugin: `--agent flywheel-intent-conductor`
failed as not-found and two fleet launches timed out with the cause
invisible from the timeout — which is what this assertion is really
about. The machine is repaired (the marketplace back on the directory
source, profiles resolving bare), but the launch path cannot assume any
machine's source is whole; the check is what makes the failure legible.

## Boundaries
The machine-level mechanism is settled by the operator and is not this
assertion's: plugin enables are declared in `devenv.nix`, never by
imperative `claude plugin install`. How a machine pins the marketplace
source is `questions/plugin-marketplace-source.md`.
