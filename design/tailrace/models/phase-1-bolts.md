# tailrace — phase 1, the bolts

A draft for the madswan planner, 2026-10-23. Five bolts. The first is
the core, built by one agent in sequence, because a bolt's units are
built side by side and the traits and types every later unit codes
against have to exist before two agents can work apart. Every bolt
after it ends in a binary installed the way sluice is and used the same
day on the family's own repositories. Each unit names what it owns, the
clauses it builds and what proves it. The planner turns these into
proposals; nothing here is the plan.

The scaffold landed by hand on 2026-10-23 as agentplot/tailrace 3da8131
(ADR 0011): the five crates, the gate on `main` and `bolt/*` with the
GitHub rulesets, the flake and the release workflow, which released
v0.1.0, a binary that names its revision and nothing else. `crew bolt
give` can give the repository a bolt from there.

## How the units stay apart

- **The core bolt goes first and is one unit.** It lands every seam
  trait of Part B, the types they pass, the fakes, the conformance
  suite and the core's own modules. No profile unit starts before it
  lands.
- **A unit owns directories.** A profile unit owns one directory under
  `crates/tailrace/src/profiles/<seam>/` and its tests; a core unit
  owns one module under `crates/tailrace-core/src/`. A unit touches
  nothing outside what it owns, except the two shared files below.
- **Two shared files, append-only.** `crates/tailrace-conformance/src/`
  gains scenarios below a marker per seam and never changes a scenario
  above it; `Cargo.toml` gains a dependency line and never changes one.
  Every dependency a bolt's units need is declared by the core bolt or
  the bolt's first unit, so most units add none.
- **A trait never changes inside a profile unit.** A unit that needs a
  trait or a shared type changed says so with `crew needs`; the change
  is a unit of its own, landed before the units that need it.
- **Done means the suite.** A profile unit is done when its seam's
  conformance scenarios pass against the real thing, in that profile's
  own tests, tagged by the layer that can run them.

## Bolt 1 · the core

One unit, in sequence. Done when the conformance suite passes over the
fakes, `tailrace publish` runs end to end against an in-memory store in
the tests, and `tailrace status` and `tailrace verify` read it back.
Nothing a person uses yet.

| unit | owns | builds | proves it |
|---|---|---|---|
| the core | `crates/tailrace-seams/`, `crates/tailrace-core/`, `crates/tailrace-fakes/`, `crates/tailrace-conformance/`, `crates/tailrace/src/` but `profiles/`, `Cargo.toml` | the eight traits of Part B (66 to 91, 120 to 122) and the types they pass: digest, revision, component, version, artifact and index metadata (4, 6), claim and envelope (7, 8), refusal, absence and unreadable kept apart (58, 59); the fakes, one per trait, scriptable per test; the conformance suite, every scenario citing clauses (93, core.33), S1 to S14 over the fakes; the policy file read at a landed revision through the landing seam, never a checkout (65, C.10); components with outputs, paths and tag prefix, one by default (123 to 125); the version rule through `git-cliff-core` per component, release or prerelease (21), the name claimed as a tag before anything is packed (22, 110); provenance naming revision and build identity (13, core.9); verify against the signers a policy names, an expired signer reported as such (80, 81, 116, 117); publish as ensure, pack, put, attach, the index last, with the machine-readable answer (14 to 20, 74, 111); a repeat publish ending at the same index or refused naming the artifact (18); `tailrace status` reaching no store (60, 61) and `tailrace verify`; the command line as the first surface of one core (56, core.31) | the suite over the fakes; S1, S2, S5, S13 in the conformance crate; a two-component fixture where a commit under one path versions one component (S15) |

## Bolt 2 · publish, on one laptop

Four units side by side. Usable when `tailrace publish` on a laptop,
after a sluice landing on a family repository, writes a version into an
OCI layout on disk, and `tailrace verify` on a second machine reads a
copy of that layout and says every claim holds.

| unit | owns | builds | proves it |
|---|---|---|---|
| the layout store | `profiles/store/layout/` | the OCI image layout on disk (C.2): every operation a file write under the digest's path, attestations as index entries with a subject annotation; the same bytes put twice held once (66, 73) | the store scenarios pass against a layout in a temporary directory |
| moon and the landings | `profiles/build/moon/`, `profiles/landing/sluice/`, `profiles/landing/branch/` | B.2 through moon: `ensure` as one run of the declared tasks, `report` from moon's state, the task hash as identity (74 to 76, C.3); B.3 through sluice's refs under `refs/sluice/runs/<signer>` and through a plain branch (77, 78, C.5, C.6); an output whose identity no verdict names refused naming both (15) | the build and landing scenarios pass against a scratch repository with moon and sluice, in the tools layer; S13 against a branch sluice does not run |
| the host-key signer | `profiles/signer/host_key/` | B.4 with a key file on the host as sluice's signers hold theirs (C.8); a claim from a signer the policy does not name refused naming the signer (S5); no credential kept (64, core.21) | the signer scenarios pass against a key in a temporary directory |
| the laptop | `crates/tailrace/src/bindings/`, `crates/tailrace/src/commands/` | the host's bindings file beside the landing's own (92, 118) naming the layout, moon, sluice or a branch, and a host key; `tailrace publish`, `status` and `verify` bound to them; the file and image projections' pack (84, 87, C.11) | S1 and S2 against a family repository from the installed binary; a second machine verifies a copied layout |

## Bolt 3 · the cache, on a registry

Three units side by side. Usable when a task that passed on one host
replays from ECR on another, and a fresh checkout's first build of a
landed revision runs nothing the landing already ran. The cache needs
the store, the build's hashes and the landing's verdicts, and nothing
of the gate, so it comes before it.

| unit | owns | builds | proves it |
|---|---|---|---|
| the registry store | `profiles/store/registry/` | the OCI registry profile (C.1): blobs, manifests, referrers with the tag-schema fallback, tag put by expected digest and read back where absent (109); a layout synced to a registry; ECR's open issues answered by a push against a real repository | the store scenarios pass against ECR and zot, in the tools layer; the lost race reported and repaired from the ledger (S7) |
| moon's cache | `profiles/projection/moon_cache/`, `crates/tailrace-core/src/cache.rs` | the cache namespace: a cache entry is never an artifact (52 to 55, 100, core.30); `sync` filling moon's outputs directory with the archives the landing's verdicts name, shared by every checkout on the host (C.3, C.11) | S14; a task that passed on one host replays from the store on another |
| the push after a landing | `crates/tailrace/src/commands/` for the one command, `crates/tailrace-core/src/record.rs` | the step after a landing that pushes the archives the landing's build left, run on the landing host as its next step after sluice's push, or by hand; what tailrace keeps of it, the host's (61, 62); the record rebuilt from the store and git (63) | a landing on one host followed by `tailrace sync` on another replays every task the landing ran |

## Bolt 4 · the gate and the channels

Four units side by side. Usable when a family repository's `beta`
moves on every landing and `stable` moves when a person promotes, the
chain is in `refs/tailrace/ledger/<channel>` and in ECR, and `tailrace
status` on any machine shows both channels and why each is where it is.

| unit | owns | builds | proves it |
|---|---|---|---|
| the key service signer | `profiles/signer/kms/` | B.4 with a key in AWS KMS through the host's role (C.7) | the signer scenarios pass against a key in a test account, in the tools layer |
| the gate | `crates/tailrace-core/src/gate.rs` | acceptance under the policy, the first claim found wanting named (26, 28, 58); the acceptance claim attached; `beta` following each publish as the gate's act, never the publisher's (95, core.10); the solo host under a policy naming it, its claim saying so (108) | S3, S5; a publish from a host with no accepting credential cannot move a channel (S9) |
| the ledger and promotion | `profiles/ledger/git_ref/`, `profiles/ledger/store/`, `crates/tailrace-core/src/ledger.rs` | B.8 with the git ref profile (C.13) and the store profile (C.14); the chain of gate-signed promotion claims naming predecessors (105); append refused naming the head, a fork reported (120 to 122, core.34); the store rewritten from the ledger on disagreement (106); `tailrace promote`, a rollback a promotion back (34); a bound channel taking any version the bound channel held (37) | S6, S7, S8; a promotion on one machine read on another from the ledger alone |
| status across machines, served | `crates/tailrace/src/commands/` for `status` and `serve` | channels and the chain read on a machine that never published; refusal, absence and unreadable kept apart, the source's words carried verbatim (58, 59); `tailrace serve`, the host's one process at a fixed name and port with the repository in the path (114), answering `/status` as a page rendered on each request and `/status.json` as the same answer (132, 57), started by the first asker on the host that finds none and held by the host's one lock, as sluice's one reader per host is (sluice 129), never a second | S10, S11, S12; the page and the JSON answer the same on a machine that never published; two askers on one host find one process |

## Bolt 5 · sync and serve

Five units side by side. Usable when a family repository's `npm
install` and `cargo build` resolve the family's own packages from a
layout tailrace rendered under the policy, and Claude Code refuses `npm
publish` in a tailrace repository naming `tailrace publish`.

| unit | owns | builds | proves it |
|---|---|---|---|
| render under a policy | `crates/tailrace-core/src/render.rs` | B.6 render and the layout policy at the consuming repository's landed revision (85, 113); only satisfied versions held, a refusal answered to whoever rendered (47, 51, 99); the record of rendered layouts, the host's (61, 62); `tailrace sync` | S4; a version that fails the policy is refused with the reason |
| npm, rendered and served | `profiles/projection/npm/` | the npm projection's pack, render and serve (C.11); one serving process per host at a fixed name and port with the repository in the path (114, 115, core.36); the address a lockfile records naming no host (49, core.18) | `npm install` resolves only from the layout; two checkouts on one host share one server |
| Cargo's registry | `profiles/projection/cargo/` | the Cargo projection: pack through a manifest edit and `cargo package --no-verify`, render as a local registry per lockfile (C.11) | `cargo build` resolves a family crate from the layout |
| the Claude Code plugin | `plugins/claude-code/` | the plugin as sluice keeps its plugins, outside the core (section 9); the hook refusing an ecosystem's own publish command and naming tailrace's; every answer from the one core (56, core.31) | the hook refuses `npm publish` and `cargo publish` in a tailrace repository |
| the herdr plugin | `plugins/herdr/` | the pane of channels and environments the statement names (section 9): every environment, what it should run, what it runs and since when or why that cannot be read, who it waits on, whether the two differ, read from `/status.json` on the host's one process (132, 114), which the pane starts when it finds none as any asker does; kept outside the core as sluice keeps its herdr plugin; the user's word on 2026-10-26: the status page is for this pane | the pane shows the same answer `tailrace status --json` prints on a machine that never published; two panes on one host find one process |

## Bolt 6 · the Nix fleet, pushed

Two units. Usable when swancloud's machines are deployed by `tailrace
apply` from the deployer's host, each on a channel moved by the gate or
by the user's yes, the Macs' channel bound to srv's, and swancloud's
deployer retires. The user chose this order on 2026-10-26: clan pushed
first, the machines pulling later.

| unit | owns | builds | proves it |
|---|---|---|---|
| the Nix cache target | `profiles/target/nix_cache/` | the version's store paths pushed to the fleet's cache (C.12), the closure named as the version's artifact for its machine | a closure built on one host is realised on another from the cache alone |
| the clan push profile | `profiles/target/nix_fleet/push/` | B.7 for one machine through the fleet's own deploy tool, run on a host that holds the machine's key: desired from the channel, current from the closure the machine runs, apply as one `clan machines update`, report what the machine answers (88 to 91, 45, C.12); a bound channel moving by the rule its policy names (37, 83) | the target scenarios against one machine in the tools layer; S16: srv's channel moves on a yes and the Macs' channel never ahead of it |

## Left for phase 2 on purpose

The remaining projections and every other target; the Nix fleet's pull
profile, the binary on a timer on each machine reading its channel's
tag in the store, with the NixOS and nix-darwin module that installs
it (C.12); keyless signing and the verifier's rebuild; the Flywheel
plugin; the table ledger (C.15), the roster (126), the pool
target and the template set projection a control plane would bind, as
generic profiles with their conformance scenarios.
