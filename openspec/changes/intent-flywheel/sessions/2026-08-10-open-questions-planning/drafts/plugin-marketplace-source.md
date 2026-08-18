# Draft decision: the directory source is the declared source; github is gated on a cache the setup itself produces and verifies

Closes `questions/plugin-marketplace-source.md`.

## Decision (proposed)

A machine declares the **directory source**, pointing at the live
flywheel checkout, in its `devenv.nix` — as the declared destination for
machines that carry the checkout, not as a stopgap. The **github
marketplace source becomes declarable only when the declarative setup
itself populates the plugin cache and verifies profile resolution in the
same activation that flips the source** — populate, verify, then flip,
atomically from the machine's point of view. Until that mechanism exists
in `agentplot/flywheel`, no machine declares the github source.

Version pinning follows the source. Under the directory source the
checkout's own git state is the version — machines track the plugin's
main branch live, and that is accepted, not tolerated: the fleet and the
plugin are developed together today, and a stale pin on a machine that
hosts the plugin's own development would be the drift. A pinned release
is a property of the marketplace path and arrives with it.

## Why

- **The measured break can only recur by configuration, so configuration
  is where it is closed.** A source flip to github without a populated
  cache silently unresolved every profile; two fleet launches timed out
  with the cause invisible (`assertions/fleet-launch-plugin-resolution.md`).
  Making "github source" and "populated, verified cache" one declarative
  act removes the window in which the two can disagree.
- **The operator's mechanism direction is already settled** and this
  decision stays inside it: enables are declared in `devenv.nix`
  (atlas-kit's is the reference example), never by imperative
  `claude plugin install` — whose side-written state is what broke the
  machine. `installed_plugins.json` proves nothing; the marketplace
  SOURCE field is the invariant.
- **The directory source is self-verifying.** It resolves against a real
  working tree; there is no cache to be absent. The github path's whole
  risk is the cache, so the cache's production belongs to the same
  mechanism that declares the source.

## The alternative, and why not

Declare the github marketplace now, with a manual populate step
documented beside it. Rejected: a documented step is exactly the
imperative act the devenv direction exists to remove, and a machine
where the step was skipped reproduces the measured break with nothing to
catch it before an actor times out.

## Consequences

- Today every fleet machine carries the checkout and declares the
  directory source; a machine without the checkout cannot run the fleet
  until the marketplace mechanism exists.
- The gating mechanism — devenv activation populates the cache, verifies
  a profile resolves, then flips the source — is **construction in
  `agentplot/flywheel`**, a handoff task when a checkout-less machine is
  actually wanted, not before.
- `assertions/fleet-launch-plugin-resolution.md` stays open and
  unchanged: the launch-time resolution check guards the actor start
  whichever source a machine declares, and is the second line of defence
  behind this decision, not its substitute.
- `questions/plugin-marketplace-source.md` flips to closed.
