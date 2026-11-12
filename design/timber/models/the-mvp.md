# timber — the MVP

A model for agentplot-planner, 2026-11-12, from the user's two roadmap
milestones for timber, given that day in agentplot-design's pane:
"Define what's necessary to use it in Switchboard" and "Get the minimal
end-to-end setup in place for my Boom Drive tools, Flake, and my
swancloud clan setup. I'd like to get that Timber headwater mill run
automation in place as much as possible." On agentplot-design's card of
2026-11-12 (req_17cebacd4dc8446d863d) the user chose "MVP includes the
agent-free bumps". The rest is agentplot-design's. Nothing here is the
plan: the planner turns it into proposals, each unit citing the record
that governs it.

## Where timber stands

Release v0.6.0 builds phase 1 whole, six bolts (`phase-1-bolts.md`):
publish into an OCI layout or registry, signed by a host key or a key in
AWS KMS; `beta` following each accepted publish and `stable` moved by
promotion, on a git ref ledger; moon's cache shared through the store;
npm and Cargo rendered and served; the Nix cache target and the clan
push profile, `timber apply`; status, the served page, the herdr pane
and the Claude Code plugin. No repository declares `.config/timber.toml`,
and no flake installs timber.

## Milestone 1: what Switchboard needs

Switchboard's own record 0090 (agentplot-wldn/switchboard-kit, accepted
by the user on 2026-10-26) draws the join: Switchboard binds timber
in phase 2, through bindings each made by a record of its own.

| Switchboard's part | timber's profile | in v0.6.0 |
|---|---|---|
| the class registry | the OCI registry store (C.1) and the KMS signer (C.7) | built |
| the class's table of channels and promotions | the ledger as a database table with conditional writes (C.15) | not built |
| dispatch to a class's installs | the pool target and the roster it answers (C.12, 126) | not built |
| templates and bundles kept under S3 keys | the CloudFormation template set projection (C.11) | not built |

timber's side is three generic profiles, each with its conformance
scenarios: the table ledger, the pool target with its roster, and the
template set projection. Switchboard's side is the five open questions
of its record 0090, each settled by a record of Switchboard's: the build
of record, a connected repository's build, the store's shape with
CodeArtifact, the ledger's home, and the channels' names. The store's
binding needs nothing new from timber, so it is the first to bind once
Switchboard rules its build of record.

## Milestone 2: a new version reaches every machine

The chain, as the research talk of 2026-11-11 draws it
(`design/research/2026-11-11-a-new-version-reaches-every-machine.md`,
on the branch `research/a-new-version-reaches-every-machine`):

```
flume lands ──> its CI tags vX.Y.Z ──> headwater reports it
   ──> millpond's rule matches ──> flume launches an update place
   ──> the place moves Boomdrive's pin and submits ──> sluice lands
   ──> the same for swancloud's pin ──> swancloud publishes through timber
   ──> timber apply converges each machine, srv on the user's yes
```

The MVP is four steps:

1. **timber comes with Boomdrive's flake.** The set carries timber's CLI
   and its two plugins from one pin of timber's flake, as it carries
   sluice and flume (principle 17; agentplot/boomdrive record 0020).
   Queued as `timber-comes-with-boomdrives-flake`.
2. **swancloud deploys through timber.** swancloud declares
   `.config/timber.toml`: one component, each machine's closure an
   artifact, the Macs following `stable` and srv waiting on the user's
   yes. A timer of deneb's own runs `timber publish` and `timber apply`
   after each landing, as timber's C.16 lets a host name its own step,
   and the deployer and the releaser retire (swancloud `deploy.11`, the
   user's decision of 2026-10-26). It is the madswan drive's to plan.
3. **A new version is noticed and routed with no agent.**
   - headwater reads a `flake.lock` and the GitHub releases of what it
     pins, and reports each release newer than a pin;
   - millpond lands each report and reads the keeper's policy: a rule
     matches a report's facts, names a flume kind and a window, and
     launches one place for what it gathered in the window.
4. **The update runs as a command.** A flume kind declares a stage that
   runs one command, filled from the launch's parameters, and delivers
   its commits; the place submits through sluice, whose gate decides
   whether the move lands. An agent starts only where the command or
   the gate fails.

Steps 1 and 2 build on what exists. Steps 3 and 4 are the first builds
of headwater and millpond and one change to flume, and their records
come from the research talk once the user has given their word on its
calls; until then nothing of 3 and 4 is queued.

## What the MVP leaves for later

timber publishing the family's own tools, with headwater reading
timber's channels instead of GitHub's tags; each machine pulling its own
version on a timer (C.12's pull profile); a drive's publish as an offer
in another drive; and the phase 2 profiles beyond Switchboard's three.
