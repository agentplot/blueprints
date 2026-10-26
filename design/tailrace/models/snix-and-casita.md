# snix and casita, read against tailrace

A design note for the user, 2026-10-26, on their ask in the operator's
pane: research snix, Nix rewritten in Rust, and cachix's casita, and
see whether anything there influences tailrace's design. The facts are
in `snix-and-casita-research.md` beside this note, with their sources;
this page is the reading.

## What each is, in one line each

**snix** is Tvix continued: a Rust Nix whose store is two layers, a
content-addressed castore of BLAKE3 blobs and Merkle directories with
chunking as a storage concern, and a thin store that maps a Nix store
path to a castore root with its NAR hash, references and Nix's own
ed25519 signatures. Its nar-bridge serves a stock-compatible HTTP binary
cache from that store. It is GPL-3.0, unreleased, with APIs its authors
call unstable, and it neither stores in nor serves from an OCI registry.

**casita** is Cachix's new generic verified object repository, the first
layer of a Rust Nix rewrite: the same BLAKE3 and chunking shape as the
castore, named roots, garbage collection, sync over local, SSH and S3,
offline archives, OCI image import and a Cargo backend. It is
Apache-2.0, pre-release, and not a Nix binary cache: it imports NARs
and measures them but keeps no narinfo, no signatures and no trust
beyond the hash. Its authors contrast it with the castore on licence,
traits against gRPC, and garbage collection.

## What they share with tailrace, and what they do not

All three are content-addressed stores with names pointing at digests,
and all three keep bytes apart from what is said about them. The
differences are where tailrace's design is deliberate:

| | snix castore, casita | tailrace |
|---|---|---|
| the digest | BLAKE3 over chunks, verified streaming | the OCI digest, sha256 over whole blobs (C.1, C.2) |
| the substrate | their own object store, S3, SQLite, gRPC | the owner's existing OCI registry (record 0003) |
| what is said about bytes | Nix's narinfo signature on the store path (snix); nothing (casita) | signed claims attached to the digest as referrers, counted only through a signer the policy names (7 to 13) |
| who signs | the cache's key | the build host, the gate, a reviewer, each for what it observed (11) |
| the unit named | a store path, a root | a version: an index naming every artifact (6) |

Nothing in either moves a channel, judges a claim against a policy,
derives a version from history or converges an environment. They are
stores. Tailrace is the gate and the ledger over a store it does not
own.

## What influences tailrace, and what does not

1. **No change to the statement from either.** Parts A and B name no
   store mechanism; both projects, if they ever bear on tailrace, bear
   on Part C as profiles. Nothing they do contradicts a clause, and
   nothing they do is a clause tailrace lacks.

2. **The Nix binary cache target is where they would bind.** C.12's Nix
   cache row pushes a version's store paths to the fleet's cache; today
   that cache is attic for swancloud, and a castore-backed cache behind
   nar-bridge, or casita once it is a binary cache, would be another
   profile of that row. Tailrace carries the cache's own narinfo
   signatures as claims another party made, as made (12), and the fleet
   agent (C.12, the pull profile) trusts tailrace's promotion claim for
   which version and Nix's own substituter for the bytes. This is what
   the statement already says; the note is that snix's store keeps
   exactly the trust anchor tailrace expects to carry, the NAR-based
   signature, and adds no mechanism of its own.

3. **Not a store profile, yet.** Could casita, or the castore, satisfy
   the store seam (B.1) in place of an OCI registry? Not today: the seam
   needs attestations attached to a digest (8, 73), names moved only
   with the digest expected (109, core.6), and a listing of a name's
   versions (138). The castore has none of these at its layer, casita's
   named roots have no expected-digest move and no referrers, and
   casita's trust is hash-only by its own words. If casita grows signed
   metadata and conditional names, a store profile is a few hundred
   lines against the conformance suite, and the statement does not move.
   Watch it; write nothing.

4. **A licence rule tailrace lacks.** snix's crates are GPL-3.0 and
   nix-compat is exactly the crate a Nix cache or Nix fleet profile
   would reach for: narinfo, NAR, store paths, ed25519 verification. A
   permissively licensed binary (A.37) cannot link it without becoming
   GPL. Recommendation: a core rule for tailrace, that no dependency the
   binary links carries a licence that would bind the binary's own, and
   that a Nix profile reads narinfo and store paths through a permissive
   crate or its own code. casita is Apache-2.0 and clear. This is the
   one concrete thing the research changes, and it is a record for the
   user's card, not a clause.

5. **Chunking is below tailrace.** Both projects dedupe large closures
   by chunking; an OCI registry stores whole blobs. For Nix, that is why
   the cache, not the registry, holds the bytes (133: a compilation's
   cache is below tailrace), and why tailrace's store holds the pointer
   and the claims. The design already sits on that line.

## For swancloud

Attic stays. When swancloud's cache is next looked at, a castore-backed
cache behind nar-bridge is the one that keeps Nix's signatures and
serves stock clients today; casita is the one to watch for its sync and
garbage collection, once it signs. Neither is work now.
