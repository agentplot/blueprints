# Timber + Headwater: the update ladder and "pocket CD"

## Problem
A spectrum of upstream-change handling:
- Dependabot-style: bump, run tests, done.
- Agent-assisted: read release notes, make compensating code changes.
- Human-decided: summarize upstream changes and their impact; human chooses now / later / skip.

Real use case is Nix + clan (nix-darwin, NixOS) with many custom flakes across Macs and Linux servers. Example chain: update Flume → bump Boom Drive flake input → build → deploy via clan to machines. Today this goes through agents for every step and can take **hours**. The naive bump needs no agent.

## Three separate jobs
1. **Noticing** — a new version exists.
   - External upstreams (npm, nixpkgs, GitHub releases): **Headwater**.
   - Own artifacts: **Timber** already knows because it published them. Its publish event is the signal. Headwater stays out of internal flake-to-flake edges.
2. **Deciding who acts** — **Millpond** with a per-edge policy ladder:
   - mechanical first (e.g. `nix flake update flume`, build, test),
   - agent only when mechanical fails or notes flag a breaking change,
   - human card for major/breaking or policy-gated edges.
   Escalate only on failure or policy → agents drop out of the happy path.
   Headwater's distinct value is release-notes reading and impact summaries for things you don't control — a cheap model call, not a coding agent.
3. **Propagating** — **Timber**: artifacts → channels → environments with auto/manual gates.

## Two kinds of gates (keep separate)
- **Update policy** (Millpond): do we take this new version into source?
- **Promotion policy** (Timber): may this built artifact go to this environment yet?
The "deploy new Boom Drive flake to this machine?" prompt is a **Timber** gate, not a Millpond decision.

## End-to-end example
1. Flume merged → Timber publishes Flume artifact.
2. Timber emits "Flume 0.4 published" → Millpond.
3. Millpond rule "Boom Drive depends on Flume: mechanical" → job.
4. Job bumps Boom Drive flake input, builds (closure to Attic), tests → success produces a new Boom Drive artifact in Timber.
5. Timber promotes through environments = clan machines. Mac Studio: auto → deploys. SwanCloud: manual → prompt.

## Pocket CD
A menu bar app or small local web app over Timber (+ Millpond's human lane) showing:
- the chain of changes in flight and which gates are automatic,
- what's currently building/deploying,
- pending manual gates with a one-click "deploy now via clan".
Fully local/self-hosted; Boom Drive Cloud can mirror the same cards via the runner.

## Timber recap
Artifacts, channels (beta/stable pointers with promotion), environments (targets with auto/manual policy). Also a candidate remote cache for moonrepo; relationship to the existing Attic cache still open (connect vs replace).
