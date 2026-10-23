# tailrace — phase 1, a first cut at the bolts

A draft for the madswan planner, written 2026-10-23 before the team
exists. Four bolts, each ending in a binary installed the way sluice
is and used the same day on the family's own repositories. Each unit
names the clauses it builds and what proves it, as sluice's changes do.
The planner turns these into proposals; nothing here is the plan.

The scaffold unit of bolt 1 landed by hand on 2026-10-23 as
agentplot/tailrace 3da8131 (ADR 0011): the crates, the gate on `main`
and `bolt/*` with the GitHub rulesets, the flake and the release
workflow. `crew bolt give` can give the repository a bolt from there.

## Bolt 1 · publish, on one laptop

Usable when: `tailrace publish` on a laptop, after a sluice landing on
a family repository, writes a version into an OCI layout on disk, and
`tailrace verify` on a second machine reads a copy of that layout and
says every claim holds.

| unit | builds | proves it |
|---|---|---|
| scaffold | the Cargo workspace as sluice's: `tailrace-core`, `tailrace-seams`, `tailrace-fakes`, `tailrace-conformance`, the `tailrace` binary; moon projects with one task per check; `.config/sluice.toml` gating `main` and `bolt/*`; the flake, release binaries and `ci.yml` as sluice's; `tailrace --version` printing the revision and the build identity, never a version (24, C.11); core.25, core.26 | `nix profile install` and the release tarball install a binary that prints the revision; sluice lands the first change through the gate |
| the policy and the version | `.config/tailrace.toml` read at the landed revision through git, never a checkout (65, C.10); components with outputs, paths and tag prefix, one component by default (123, 124); the version rule through `git-cliff-core` per component, release or prerelease (21); the name claimed as a tag pushed before anything is packed, refused naming both revisions when taken (22, 110) | unit tests per refusal; a two-component fixture where a commit under one path versions one component (S15) |
| the store seam and the layout | B.1's seven operations; the OCI image layout on disk profile (C.2) with attestations as index entries; the conformance suite's store scenarios, run against the fake and the layout (93) | the suite passes on both; the same bytes put twice are held once (66) |
| the build and the landing | B.2 through moon: `ensure` as one run of the declared tasks, `report` from moon's state, the task hash as identity (74 to 76, C.3); B.3 through sluice's refs and through a plain branch (77, 78, C.5, C.6); the pass that needs both (111) | an output whose identity no verdict names is refused naming both (15); a branch sluice does not run lands by history with no verdicts (S13) |
| the signer and the claims | B.4 with a host key (C.8); claims as in-toto statements in DSSE envelopes (7); provenance naming revision and build identity (13, core.9); verify against the signers a policy names, an expired signer reported as such (80, 81) | a claim from a signer the policy does not name is refused naming the signer (S5) |
| publish and read back | ensure, pack through the file and image projections (84, 87, C.11), put, attach, the index last (16, 17), the machine-readable answer (19); a repeat publish ending at the same index or refused naming the artifact (18); `tailrace status` reading what the layout holds and what the host kept, reaching no store (60, 61); `tailrace verify` on a layout | S1, S2 against a family repository; a second machine verifies a copied layout |

## Bolt 2 · the cache, on a registry

Usable when: a task that passed on one host replays from ECR on another,
and a fresh checkout's first build of a landed revision runs nothing the
landing already ran. The cache needs the store, the build's hashes and
the landing's verdicts, and nothing of the gate, so it comes before it.

| unit | builds | proves it |
|---|---|---|
| the registry store | the OCI registry profile (C.1): blobs, manifests, referrers with the tag-schema fallback, tag put by expected digest and read back where absent (109); a layout synced to a registry; ECR's open issues answered by a push against a real repository | the conformance suite passes against ECR and zot; the lost race is reported and repaired from the ledger (S7) |
| moon's cache | the cache namespace: a cache entry is never an artifact (53, 100, core.30); `sync` filling moon's outputs directory with the archives the landing's verdicts name, shared by every checkout on the host (C.3); a step after a landing pushing the archives it left | S14; a task that passed on one host replays from the store on another |
| the push after a landing | the step after a landing that pushes the archives the landing's build left, run by the landing host as a sluice hook or by hand; what tailrace keeps of it, the host's (61, 62) | a landing on one host followed by `tailrace sync` on another replays every task the landing ran |

## Bolt 3 · the gate and the channels

Usable when: a family repository's `beta` moves on every landing and
`stable` moves when a person promotes, the chain is in
`refs/tailrace/ledger/<channel>` and in ECR, and `tailrace status` on
any machine shows both channels and why each is where it is.

| unit | builds | proves it |
|---|---|---|
| the key service signer | B.4 with a key in AWS KMS through the host's role (C.7); no credential kept (64, core.21) | the suite's signer scenarios pass; the binary holds no secret |
| the gate | acceptance under the policy, the first claim found wanting named (26, 28, 58); the acceptance claim attached; `beta` following each publish as the gate's act, never the publisher's (95, core.10); the solo host under a policy naming it, its claim saying so (108) | S3, S5; a publish from a host with no accepting credential cannot move a channel (S9) |
| the keeper and promotion | B.8 with the git ref profile (C.13) and the store profile (C.14); the chain of gate-signed promotion claims naming predecessors (105); append refused naming the head, a fork reported (120 to 122, core.34); the store rewritten from the keeper on disagreement (106); `tailrace promote`, a rollback a promotion back (34); a bound channel taking any version the bound channel held (37) | S6, S7, S8; a promotion on one machine read on another from the ledger alone |
| status across machines | channels and the chain read on a machine that never published; refusal, absence and unreadable kept apart, the source's words carried verbatim (58, 59); the host's record rebuilt from the store and git (63) | S10, S11, S12 |

## Bolt 4 · sync and serve

Usable when: a family repository's `npm install` and `cargo build`
resolve the family's own packages from a layout tailrace rendered under
the policy, and Claude Code refuses `npm publish` in a tailrace
repository naming `tailrace publish`.

| unit | builds | proves it |
|---|---|---|
| render under a policy | B.6 render and the layout policy at the consuming repository's landed revision (85, 113); only satisfied versions held, a refusal answered to whoever rendered (47, 51, 99); the record of rendered layouts, the host's (61, 62); `tailrace sync` | S4; a version that fails the policy is refused with the reason |
| npm, rendered and served | the npm projection's pack, render and serve (C.11); one serving process per host at a fixed name and port with the repository in the path (114, 115, core.36); the address a lockfile records naming no host (49, core.18) | `npm install` resolves only from the layout; two checkouts on one host share one server |
| Cargo's registry | the Cargo projection: pack through a manifest edit and `cargo package --no-verify`, render as a local registry per lockfile (C.11) | `cargo build` resolves a family crate from the layout |
| the Claude Code plugin | the plugin as sluice keeps its plugins, outside the core (section 9); the hook refusing an ecosystem's own publish command and naming tailrace's; every answer from the one core (56, core.31) | the hook refuses `npm publish` and `cargo publish` in a tailrace repository |

## Left for phase 2 on purpose

The remaining projections and every target; keyless signing and the
verifier's rebuild; the Nix spike; the herdr and Flywheel plugins; the
hosted keeper and pool target a control plane would bind.
