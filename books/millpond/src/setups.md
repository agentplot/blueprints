# Three setups

millpond runs in three setups, and all three use the same inbox files.

| | On its own | With crew | With Flywheel |
|---|---|---|---|
| **Adapters** | headwater, eddy, the folder drop | the same | the same |
| **Host** | `millpond tick` on a timer | millpond, called by crew and the fleet's timers | Flywheel's host, on the same crates |
| **Inbox** | a git repository of the user's own | the partition's flywheel branch in crew's state repository | the instance's state repository, the same files |
| **Curation** | a Claude session through millpond's tools; the user accepts | crew's curator through the same tools; the operator decides per item on crew's rail (109) | Flywheel's curation session |
| **Work** | an item sent through flume to one worktree, landed by sluice | the planner's chores and units, each stage launched through flume, landed by sluice | Flywheel's units and bolts, landed by sluice |

Going from one setup to the next changes the host and the curator. The
adapters and the inbox stay put, so nothing is captured twice and
Flywheel imports nothing when it takes over.

## On its own

The inbox is a git repository of the user's own, and one timer on the
host runs `millpond tick`. The user curates in a Claude Code session
with millpond's plugin, accepts or changes each batch, and sends items
from the session or from herdr. flume starts each send's agent in a
worktree, and the work submits through sluice.

## With crew

The inbox is a partition's flywheel branch in crew's state repository.
crew calls millpond's, flume's and sluice's command lines, and links
no crate: crew's Python uses only the standard library (`code.1`).

- `crew signal` writes the findings of crew's agents and the operator
  through millpond.
- crew's board, its page and its planner read signals through
  millpond's command line.
- crew's reader reads a partition's unread captures, oldest first, and
  writes their signals with millpond's `read` tool.
- crew's curator works the inbox through the same tools a curation
  session uses, joining signals into items, and the operator decides
  each item on crew's rail (109).
- The inbox's settings hand items to crew's planner, which turns each
  into a chore or a unit.

Each partition's signals live in its inbox, written through millpond
(`signals.1`). No crew code writes a signal file itself.

## With Flywheel

The inbox is the instance's state repository, holding the same files.
Flywheel's tick runs the same adapter parts on the same schedules
(231), its capture endpoint takes the same lines (216, 217g), and its
curation session gives the same moves. crew becomes Flywheel (crew ADR
0026), and Flywheel takes each partition's inbox as it stands.

## On a fleet

swancloud is the first fleet to run all of it. The fleet says which
part runs for which partition's inbox, on which host, and when; it
runs no adapter's logic itself.

- **One list** in `lib/` names each part, its partition's inbox, its
  host and its schedule. It grows out of `lib/release-sources.nix`, and
  each inbox's `millpond.toml` is generated from it (`lists.1`).
- **A launchd agent** per inbox on its host runs `millpond tick`, and
  the doctor shows a row per part from `millpond status --json`
  (`doctor.1`).
- **The watch list** gives headwater the pins that only Nix evaluates.
  It is generated from the tools list and committed, and a flake check
  refuses it when it drifts from the evaluation. Each entry has a name,
  an upstream, a tag pattern, a pin, and the files a bump moves.
- **A sign-in** a part needs, such as Wispr's, is made once per host by
  the user.
- **Every part is a single-host role** (`fleet.6`), and the parts move
  together when a host hands over.
