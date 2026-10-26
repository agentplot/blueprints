# snix and casita: the research report

The report a research agent wrote for madswan-design on 2026-10-27, as written, with its sources; the design reading is in `snix-and-casita.md` beside it. Facts here are the report's, checked against primary sources by the agent, not restated by the design.


Facts gathered 2026-10-26 from project sites, repositories, rustdoc and
Discourse. Bracketed numbers cite the sources list. Where a fact could not
be verified it is marked as such.

## 1. snix

### Identity, origin, status

- "A modern Rust re-implementation of the components of the Nix package
  manager." Forked from Tvix; announced 2025-03-16 by flokli. The
  announcement gives the reasons: a "tug-of-war" between TVL's monorepo
  priorities and Tvix's, onboarding friction, CI conflicts with TVL's
  Nix 2.3 fork, and deadlocked architecture decisions [1][2][3].
- Crates are GPL-3.0; the protobuf definitions are MIT [4]. Funded by NLnet
  NGI Zero Core (project "Snix-Store/Builder", operator FLOKLI OÜ, start
  2023-10) for "upgrading the store protocol, improving the Builder API as
  well as providing more interop with Nix" [5].
- Hosted on its own Forgejo (git.snix.dev, default branch `canon`) with
  Gerrit review (cl.snix.dev). GitHub `cachix/snix` describes itself as "Our
  development fork", last pushed 2025-12-02 [6]. Forgejo API on 2026-10-26:
  created 2025-01-06, updated 2026-10-25, 24 stars, 123 open issues, 0
  releases; latest commits 2026-10-25 (nix-language-test-suite migration,
  castore fuse-backend-rs bump, cli TCP_NODELAY fix) [7].
- About page: "None of our current APIs should be considered stable in any
  way"; not yet a drop-in replacement for Nix [8]. No FOSDEM 2026 Nix
  devroom talk or NixCon 2026 talk mentions snix (schedule search) [9][10].
  The blog has two posts, both March 2025 [11].

### Components [12][8]

| crate | role |
|---|---|
| snix-castore | content-addressed storage/sync engine: Merkle tree of directories, chunked blobs; "not Nix-specific" |
| snix-store | Nix store on castore: keeps only metadata (store path, NAR hash, references, signatures); gRPC daemon; FUSE/virtiofs mount |
| nix-compat | Nix formats and protocols (store paths, NAR, narinfo + ed25519 signatures, nixbase32, derivations/ATerm, daemon wire protocol); no dependency on other snix crates |
| snix-build | build protocol; OCI (runc) and Bubblewrap builders, gRPC client/server adapters |
| snix-eval, snix-glue, snix-cli | bytecode evaluator; store/builder builtins; REPL that evaluates nixpkgs, "not a replacement for nix-build" |
| nar-bridge | read-write Nix HTTP binary cache server over snix-[ca]store |
| snix-boot | boots cloud-hypervisor VMs with /nix/store served by `snix-store virtiofs` [13] |
| nix-daemon | implements the subset of the Nix daemon protocol that Nix's local-overlay store needs [14][15] |
| castore-http (mirror, Dec 2025) | axum server that serves a castore root node's files over HTTP with Range support, redirects for symlinks and directory listings [16] |
| snix-serde, snix-tracing, snixbolt, Go clients (castore-go, store-go, build-go) | support crates [12][16] |

### castore model

- Three node kinds, unnamed; names live in the parent Directory: File
  (BLAKE3 digest of raw contents, size, executable bit), Symlink (target),
  Directory (digest of child Directory, `size` = total child count, used for
  inodes). Directory proto has `directories`, `files`, `symlinks` lists, each
  "MUST be sorted by that name", names unique across lists; PathComponent
  rejects `/`, NUL, `.`, `..`, empty, >255 bytes. Directory digest = BLAKE3
  over the canonical protobuf, "fairly stable ... but not guaranteed" (issue
  #111) [17].
- Blob digest = BLAKE3 of the raw bytes; "chunking is treated as a transport
  and storage concern". Verified streaming uses BLAKE3's tree (bao-tree,
  `bao_shift`), so chunks are checked against the known digest and can be
  cached [18]. gRPC BlobService: `Stat` (chunk list), `Read`, `Put`; no
  seek/range in the protocol, chunks instead; chunk size "TBD" 512K–4M [19].
- Why not git: SHA-1, "error-prone" binary tree format, git-specific blob
  prefix; castore hashes literal contents so "other data sources" can serve
  the same bytes [20].
- Store-path mapping: `PathInfo` maps a store path's output hash to a root
  node and carries references, NAR hash/size, signatures, deriver, CA. "Only
  PathInfo is non-content-addressed, so it is the trust anchor." Nix's
  NAR-based signatures are "carried along ... no new signature mechanism is
  specified yet" [21].

### Backends [22][23][24][25][26][27]

- BlobService: `memory:`, `objectstore+<url>` (any `object_store` crate
  backend; layout `blobs/b3/<hex>` index + `chunks/b3/<hex>` zstd FastCDC
  chunks, avg size configurable, min = half, max = double; "format isn't
  final"), `grpc+unix|http|https`, `cache` (near/far).
- DirectoryService: `redb+memory:`, `redb:/path` (single process),
  `grpc+*`, objectstore (closure as one length-delimited object, 1 MiB
  limit), Bigtable (`cloud` feature), cache.
- PathInfoService: redb, grpc, `nix+https://cache.nixos.org?trusted_public_keys[0]=...`
  (ingests NARs into blob/directory services; verifies narinfo signatures
  only when keys are given; `put` unsupported), Bigtable, lru, cache,
  `keyfile-signing` wrapper, `fs` feature.
- Composition: TOML with `blobservices`/`directoryservices`/`pathinfoservices`
  namespaces, each needing a `root`, behind the experimental
  `xp-composition-cli` feature [22].
- sled: in the Dec 2025 mirror it appears only under `contrib/crunch-v2`
  [28]; the Tvix history notes the move from sled to a local object_store
  "which does do CDC" [29].

### Binary-cache interface and trust

- nar-bridge routes: `GET /nix-cache-info` (StoreDir, WantMassQuery 1,
  Priority), `GET/HEAD/PUT /{outhash}.narinfo`, `.ls` listings, `HEAD/PUT
  /nar/{nar}`, `GET/HEAD /nar/snix-castore/{root_node}`; zstd via
  Content-Encoding [30][31].
- "Snix-flavoured" protocol: narinfo has `Compression: none`, no FileHash/
  FileSize, URL `nar/snix-castore/$root-node?narsize=`; after verifying
  signatures a snix-aware client MAY fetch missing castore nodes and MUST
  recompute NAR hash/size, falling back to the plain NAR on failure. "does
  not (yet) allow partial/lazy substitution" because no signature covers the
  castore root [32].
- PUT narinfo: parses the narinfo, finds the root node by NAR hash from a
  recent-upload table, copies signatures over; "Signatures are carried over
  unchanged. This file doesn't verify them" [33].
- Signing: `SigningPathInfoService` (ed25519 via nix-compat
  `narinfo::signing_keys`, keyfile config) or `nix copy --to
  http://...?secret-key=` [34][31]. nix-compat `VerifyingKey` follows Nix's
  `trusted-public-keys` format; `fingerprint()` is what is signed [35].
- Deployment guide: `snix-store daemon` (blobs on S3 objectstore, redb for
  directories/pathinfo), nar-bridge over `grpc+unix`, nginx with client
  certificates for gRPC writes; uploads via `nix copy` or `snix-store upload
  reference-graph`. Caveats: slow NAR rendering of large blobs (issue #93),
  "No garbage collection ... planned but not implemented" [31].
- Public instance: `https://nixos.snix.store`, a NumTide-hosted fetch-through
  mirror of cache.nixos.org on a Hetzner SX65, preserving upstream
  signatures; goals include exercising snix-store/nar-bridge and "Possibly
  replace cache.nixos.org"; "No availability guarantees" [36].
- Other surfaces: FUSE mount; virtiofs; `snix nix-daemon` as read-only lower
  layer of Nix's local-overlay store, "all the operations required" as of
  2025-03-21, with known castore performance issues [14][15].

### Build component

- BuildRequest: castore input nodes under `inputs_dir`, `command_args`,
  env, writable scratch paths, expected outputs; derivations are translated
  into it and the builder "doesn't know what Nix store paths ... are".
  Author is "somewhat confident" about BuildRequest; the RPC "will change to
  a stream of events" [37]. Reference scanning (`refscan_needles`) is a
  proposal [38]. OCI builder builds an OCI runtime spec/bundle and invokes
  runc, Linux only [39][40]; rustdoc also lists `bwrap` (Bubblewrap), `dummy`
  and `grpc` [41]. Overview says the builder "currently has only an OCI
  implementation" [12].

### Production-ready vs experimental (late 2026)

Running in public: snix-store + nar-bridge behind nixos.snix.store, with
no guarantees [36]. Documented limits: no GC, slow large-blob NAR rendering,
composition behind an experimental flag, directory digest encoding may
change, build RPC will change, evaluator "not yet feature-complete" [31][17]
[37][42]. No releases tagged [7].

### OCI registries / object stores

No snix documentation, rustdoc or search result describes serving a Nix
store over an OCI registry or using one as a backend; "OCI" in snix means
OCI runtime bundles for the builder [39]. The object_store backend targets
S3-style object stores and local files, not OCI distribution [23][31].

## 2. casita

### What it is

- "Casita stores source code and build artifacts in a verified,
  content-addressed object repository written in Rust." Pre-release;
  Apache-2.0; Linux/macOS/Windows; Rust 1.94.1+ [43]. Cargo description:
  "Generic verified object repository with content-addressed payload
  deduplication", version 0.1.0 [44].
- GitHub `cachix/casita`: created 2026-09-27, pushed 2026-10-24, 100 stars,
  27 open issues, one tag (`fskit-native-v0.1.0`, 2026-09-28); contributors
  domenkozar 65, pveierland 14, burke 8, jratliff79 6, fzakaria 2 [45].
  Changelog has only `[Unreleased]` [46]. Docs at casita.rs [47].
- Announced on Discourse 2026-09-27 by Domen Kožar; the blog post's draft
  date was Aug 25 [48]. Blog: "We're rewriting Nix in Rust, and it needs to
  be split into layers and modernized. Its storage, build machinery, and
  higher-level tools can each be useful on their own"; Casita is "our first
  standalone layer" [49]. The thread discloses LLM use ("rewriting Nix using
  LLMs"); a commenter notes "Claude is contributor #3" [48]. A primary source
  for the Aug 2026 "rewrite of Nix" statement reported by an aggregator was
  not found [50].

### Problem it solves

Source and artifacts "pile up quickly"; agents produce more versions and
outputs; Cargo/uv caches do not manage versions across projects. Casita
offers deduplicated verified storage, named roots, GC (auto at 80% disk,
release evictable roots to 75%), sync [49].

### Architecture

- Object model: `ObjectKey` = format namespace + native id; `ObjectRecord`
  binds it to a `BlobId` (BLAKE3 of the complete plaintext), length and
  ordered links. Built-in namespaces: `casita.blob.v1`, `casita.directory.v1`
  (BLAKE3 of canonical directory payload; preserves names, sizes, exec bits,
  recursive counts, symlink targets; omits timestamps, ownership, xattrs),
  `casita.linked.v1`, `ipld.raw.v1`, `ipld.linked.v1`, `git.{sha1,sha256}.
  {blob,tree,commit,tag}.v1`, `git.view.v1`. Custom formats via the
  experimental API [51][52].
- Storage: chunking/compression "never changes an object's identity".
  Local profile: `casita.sqlite` (SQLite-format; README: a pinned
  pre-release Turso build with "experimental multi-process WAL"),
  `blobs/chunks/b3/` zstd FastCDC chunks (target 256 KiB, min 128, max 512),
  `blobs/blobs/b3/` manifests, `blobs/bao/b3/` outboards for verified range
  reads; lock files for multi-process; `synchronous = FULL` [43][53][54][55].
- S3 profile (experimental, `s3` feature): object-store-authoritative state
  through Chroma's wal3 WAL and an admission protocol; multiple owners share
  one bucket/prefix with opaque roots, conditional root updates and one
  collector at a time; AWS credential chain [44][56][57]. "Shared payload
  services" split logical GC per repository from physical deletion by a
  service that tracks ownership [58].
- Protocols: no gRPC ("pure Rust", per Domen) [48]. CLI; Rust library; local
  IPC (JSON-RPC 2.0, NDJSON over a per-user Unix socket or named pipe;
  `artifact.import/restore/checkout` with importers filesystem, blob, copy,
  nar, filesystem_nar, tar, casitar, git) [59]; `casita sync` between local
  repos, from `ssh://` (system OpenSSH running remote casita; source only),
  to/from `s3://` [60][61]; Casitar deterministic offline archive [62];
  experimental read-only Git smart-HTTP serving [44]; OCI image import from
  a registry (no push/export) [63]; `casita-fs` read-only FUSE/FSKit mounts
  [64]; Cargo fork backend (`-Zcasita-storage`), experimental [65].
- Casita vs snix-castore (Domen's reply): Apache-2 vs GPL-3; generic object
  graph via traits vs services; GC and S3 WAL "which snix lacks"; a
  CasitaFS kernel-filesystem branch; rsync-style sync; no gRPC [48].

### Relation to Nix and its tooling

- Not a binary cache, build coordinator or deploy tool; Domen calls it "a
  storage backend" [48]. Docs decide nothing about trust, naming or access:
  the application does [66].
- Nix touchpoints: a NAR importer (via Cachix's `nix-archive` crate [67])
  measures the canonical NAR SHA-256 (also flat/text/Git hashes, MD5/SHA-1/
  SHA-512) and scans reference needles, "32-byte Nix base32 store-path hash
  parts ... exactly as Nix does" [46]. `nar.rs`: "Reports retain content but
  do not register Nix paths or authenticate peer metadata" [68].
- No narinfo, signatures, daemon protocol, CA/FOD handling, or mention of
  Attic, Harmonia, nix-serve or the Cachix service in README or docs
  (grep of the full docs bundle) [43][69]. Security reports go to
  security@cachix.org under the Cachix policy [70].

## 3. Comparison

(a) Content addressing and store paths. Both identify a blob by BLAKE3 of
its plaintext, chunk with FastCDC + zstd as a storage detail, and verify
ranges via BLAKE3/Bao [18][23][53][54]. snix directories are BLAKE3 of
canonical protobuf; casita directories are BLAKE3 of its own canonical
payload and it also keeps native Git/IPLD ids [17][52]. snix maps a Nix
store path to a castore root through `PathInfo`, its sole non-content-
addressed object [21]; casita measures a NAR hash but does not register Nix
store paths [68].

(b) Trust model. snix carries Nix's ed25519 narinfo signatures over the
fingerprint; nar-bridge serves them unchanged and stores uploaded ones
without verifying; Nix clients verify under `trusted-public-keys`; snix's own
HTTP substituter verifies only when keys are configured; the castore root
pointer is unsigned so clients recompute the NAR hash and cannot substitute
lazily [32][33][24][35]. casita has no signing: hash verification of
identity, links and closure completeness before publication and on sync;
"Applications must supply a trusted source for expected root IDs" [71].

(c) HTTP vs other protocols. snix: gRPC (`snix.castore.v1`, `snix.store.v1`)
is primary; HTTP via nar-bridge (binary cache) and castore-http (files);
FUSE/virtiofs; a Nix daemon-protocol subset [72][30][16][14]. casita: no
HTTP binary cache; SSH (OpenSSH), S3 and local paths for sync; local JSON-RPC
IPC; experimental Git smart-HTTP; FUSE/FSKit [60][59][44].

(d) Multi-machine distribution. snix: composable stores (near/far caches,
remote gRPC optionally over SSH tunnels), shared S3 blobs with per-host
redb metadata, a public fetch-through mirror; no GC [22][31][36][73].
casita: multi-owner S3 repositories with WAL-based coordination, shared
payload services without shared deletion authority, SSH sync with sliced
payloads, offline Casitar; GC built in [56][58][46][62].

## Sources

1. https://snix.dev
2. https://snix.dev/blog/announcing-snix/
3. https://discourse.nixos.org/t/announcing-snix/61799
4. https://raw.githubusercontent.com/cachix/snix/canon/README.md
5. https://nlnet.nl/project/Snix-Store_Builder/
6. GitHub API `repos/cachix/snix` (description "Our development fork for https://git.snix.dev/snix/snix")
7. https://git.snix.dev/api/v1/repos/snix/snix and `/commits`
8. https://snix.dev/about/
9. https://archive.fosdem.org/2026/schedule/track/nix-and-nixos/
10. https://talks.nixcon.org/nixcon-2026/schedule/export/schedule.json
11. https://snix.dev/blog/
12. https://snix.dev/docs/components/overview/
13. cachix/snix mirror, `snix/boot/README.md`
14. https://snix.dev/docs/guides/local-overlay/
15. https://snix.dev/blog/snix-as-lower-nix-overlay-store/
16. cachix/snix mirror, `snix/castore-http/src/lib.rs`
17. https://snix.dev/docs/components/castore/data-model/
18. https://snix.dev/docs/components/castore/blobstore-chunking-verified-streaming/
19. https://snix.dev/docs/components/castore/blobstore-protocol-/-composition/
20. https://snix.dev/docs/components/castore/why-not-git/
21. https://snix.dev/docs/reference/snix-castore-api/
22. https://snix.dev/docs/guides/store-configuration-composition
23. https://snix.dev/rustdoc/snix_castore/blobservice/struct.ObjectStoreBlobService.html
24. https://snix.dev/rustdoc/snix_store/pathinfoservice/struct.NixHTTPPathInfoService.html
25. https://snix.dev/rustdoc/snix_castore/directoryservice/index.html
26. https://snix.dev/rustdoc/snix_store/pathinfoservice/fn.from_addr.html
27. https://snix.dev/rustdoc/snix_castore/directoryservice/struct.ObjectStoreDirectoryService.html
28. GitHub code search `repo:cachix/snix sled`
29. https://git.snix.dev/snix/snix/src/commit/c5b318700235113fc687dcf9b201d64e775fc9d6/tvix/store
30. https://snix.dev/rustdoc/src/nar_bridge/lib.rs.html
31. https://snix.dev/docs/guides/binary-cache/
32. https://snix.dev/docs/components/store/snix-flavoured-nix-binary-cache-protocol/
33. https://snix.dev/rustdoc/src/nar_bridge/outhash.rs.html
34. https://snix.dev/rustdoc/snix_store/pathinfoservice/struct.SigningPathInfoService.html
35. https://snix.dev/rustdoc/nix_compat/narinfo/index.html
36. cachix/snix mirror, `ops/machines/snix-cache/README.md`
37. https://snix.dev/docs/components/build/protocol/
38. https://snix.dev/docs/components/build/reference-scanning/
39. https://snix.dev/docs/components/build/oci/
40. https://snix.dev/rustdoc/snix_build/oci/index.html
41. https://snix.dev/rustdoc/snix_build/buildservice/index.html
42. cachix/snix mirror, `snix/eval/README.md`
43. https://github.com/cachix/casita (README)
44. https://raw.githubusercontent.com/cachix/casita/main/crates/casita/Cargo.toml
45. GitHub API `repos/cachix/casita`, `/tags`, `/contributors`
46. https://github.com/cachix/casita/blob/main/CHANGELOG.md
47. https://raw.githubusercontent.com/cachix/casita/main/docs/README.md
48. https://discourse.nixos.org/t/introducing-casita-a-content-addressed-store-for-source-code-and-build-artifacts/80315
49. https://casita.rs/blog/introducing-casita-a-content-addressed-store-for-source-code-and-build-artifacts/
50. https://hamster.news/article/10266308 (aggregator; returned 404 on fetch; primary not found)
51. https://casita.rs/concepts/repository/
52. https://casita.rs/reference/object-formats/
53. https://casita.rs/concepts/deduplication/
54. https://casita.rs/concepts/blob-storage/
55. https://casita.rs/reference/local-repository/
56. https://casita.rs/guides/s3-multi-owner/
57. https://casita.rs/guides/s3-maintenance/
58. https://casita.rs/concepts/shared-payload-services/
59. https://casita.rs/integrations/ipc/
60. https://casita.rs/guides/sync/
61. https://casita.rs/concepts/sync/
62. https://casita.rs/design/casitar/
63. https://casita.rs/guides/oci/
64. https://raw.githubusercontent.com/cachix/casita/main/crates/casita-fs/README.md
65. https://casita.rs/integrations/cargo/
66. https://casita.rs/concepts/responsibilities/
67. https://discourse.nixos.org/t/nix-archive-0-1/79481
68. https://github.com/cachix/casita/blob/main/crates/casita/src/nar.rs
69. https://casita.rs/llms-full.txt
70. https://raw.githubusercontent.com/cachix/casita/main/SECURITY.md
71. https://casita.rs/concepts/verification/
72. cachix/snix mirror, `snix/store/README.md`
73. https://snix.dev/docs/components/store/responsibilities/
