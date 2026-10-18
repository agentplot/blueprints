# headwater: a model from the statement

## The form

I chose a **data model with one pure derivation at its centre**, set inside a **ports-and-adapters component model** with one port per seam, plus a **compare-and-swap write protocol** for the held state and two small **lifecycles** (a tier's due-ness and an acknowledgement). The statement calls for this form. Part A is almost entirely about what an answer holds and what alone decides it (6–12, 18–23). Taken together, 9, 29, 32, I2 and I6 say an answer depends only on one reading of a repository state, what the sources said, the acknowledgements and the asker's options. That is a set of values and one function over them. Part B is already a list of operations for each seam, so each seam becomes a port. Only three things change over time: the held state (30, 49), whether a tier is due (vocabulary: *due*; 16) and the acknowledgements (20–24). I considered and rejected four other forms:

- **A deployment model.** One binary (§9) leaves no layout of processes to decide. The one placement question, where the held state lives, belongs to the store (28, 50).
- **A protocol.** An asker asks and gets an answer, with no back-and-forth to specify.
- **An event-sourced log of scans.** Clause 9 forbids reading what was reported before, and clause 29 lets everything but acknowledgements be thrown away. A log would be state that nothing is allowed to need.
- **A state machine for each release** (new → reported → acknowledged → gone). Clause 9 decides a release's place again from the pin every time, so a release has a status that is worked out each time, never one that is stored.

---

## 1. Shape

```
 askers: person · coding agent · pane · recorder · scheduler
           │
 surfaces (plugins, outside the core; 33)
   CLI │ Claude Code plugin │ herdr plugin │ Flywheel adapter
           │   every surface asks:  headwater <question> --json
           ▼
 ┌──────────────────────────── core (one binary; §9) ────────────────────────────┐
 │  Reader ─► Merger ─► Tierer ─► Planner ─► Fetcher ─► Deriver ─► Encoder (35)   │
 │    │ read-only view                         │          ▲ held state             │
 └────┼─────────────────────────────────────────┼──────────┼─────────────────────────┘
      ▼                                         ▼          ▼
  dependency descriptions        release · notes · advisory sources        store
  (npm, Python, watch list, …)   (deps.dev, GitHub, OSV, …)                (git directory)
```

The core rests on one equation:

```
answer(question) = derive( reading(R), held, options, now )
```

- `reading(R)` is the one reading of the asker's repository state (31), made by the bound dependency descriptions.
- `held` is the store's held state at one revision.
- `options` are the asker's choices: which tiers, whether acknowledgements apply (23), and which part of the notes (12).
- `now` is used only to decide whether a tier is due.

`derive` reaches no source and writes nothing (17, I5). Only two questions reach sources: `scan`, which writes the held state and then answers through `derive`, and `brief` (25).

---

## 2. Values

### 2.1 Repository, repository state, reading

| value | holds | forced by |
|---|---|---|
| **repository** *(added term)* | one git common directory, named by its canonical path. This is the key of the held state, and every worktree of the clone shares it | 28, 48, 50, C.6; vocabulary defines no "repository" (Q1) |
| **repository state** | `commit` (an object id) and `named_changes`: the paths whose working-tree content the asker includes, each with a content digest. Its id is the commit plus a digest over the named changes | vocabulary: *repository state*; 31 (Q29) |
| **reading** | for one repository state: every dependency, every unread declaration and the tiers. It is made once per question, and everything in one answer derives from that one reading | 31, 40, 41 |

The Reader opens the repository state only through git's object reads: tree and blob lookups at the commit, plus plain file reads for named changes. It never runs anything that refreshes the index or takes a git lock. Its view type has no write operation at all, so 5 is enforced by the type system rather than by care (5, 42, I1).

### 2.2 Declarations and dependencies

| value | holds | forced by |
|---|---|---|
| **identity** | a Package URL without its version, normalised by its type's own rules (for example, PyPI names folded so `acme_client` and `Acme-Client` are one name) | 2, C.1 |
| **declaration** | `description` (the profile that read it), `location` (path plus a pointer into the file), `says` (what it says of the version, verbatim, such as `^2.1.0`), `pin` (a version, or `unknown` with why), `pinned_by` (the location of the lock entry that resolved it, if any) | vocabulary: *declaration*; 26, 40 |
| **unread declaration** | `description`, `location`, `reason`. It is reported in every answer at the top level, whatever tiers were asked (Q17) | 1, 40 |
| **dependency** | `identity`; every declaration of it, at least one; its `tier`; its effective pin (D2) | 2, 4, 13, 26 |

A broken lockfile makes the affected dependencies **unread**, not of unknown pin. "Unknown" is a fact about what the repository state says (vocabulary: *pin*). A lockfile that cannot be parsed is a failure to read (1, 3). See Q30.

### 2.3 Tiers

`{ name, cadence, identities }`. The tier named `default` holds every declared identity that no other tier names. Tiers are read only from the reading, and nothing in the core writes or reassigns them (vocabulary: *tier*, *default tier*; 13, 14). An identity a tier names but the repository state does not declare is ignored. An empty tier is never due.

### 2.4 Releases

| value | holds | forced by |
|---|---|---|
| **release id** | `identity@version`, for example `pkg:pypi/acme-client@3.3.1` | 10, C.1 |
| **listing entry** | as one release source listed it: `version`, `date`, `link`, `withdrawn` | 43 |
| **release** *(in an answer)* | `release` id, `version`, `prerelease` mark (D6), `attested` (one entry for each source that listed it: source, date, link, withdrawn), `notes` (one entry for each notes source), `found_at` | 11, 39 |

### 2.5 Held state (one per repository)

```
HeldState {
  revision:   u64                      // the store's "version" (48, 49), renamed so it never
                                       // reads as a release version
  listings:   (identity, release source)            -> Observation
  advisories: (identity, version, advisory source)  -> Observation
  notes:      (release id, notes source)            -> NotesRecord   // text stored whole, apart (12, C.6)
  first_seen: release id -> time                    // display only; never decides anything (9)
  acknowledgements: [Acknowledgement]               // append-only (24)
}
Observation     { at: <the scan's start>, outcome: Listed[entry…] | Named[advisory…] | Unreached{reason} }
NotesRecord     { at, outcome: Text{sha256, bytes} | WroteNothing }
Acknowledgement { release, kind: dismissed | skipped, by, at, via }
```

The held state keeps no reports, no due flags, no credentials (38) and nothing of the repository's content (28). Everything except `acknowledgements` can be dropped, and the next scan rebuilds it (29, I6).

### 2.6 Held observations, not held reports

Two designs satisfy 9, 17, 29 and 32 when one checkout asks.

**A. Keep reports.** The held state keeps the newest report for each tier, and a held read returns it. This is 17 read literally.

**B. Keep observations.** The held state keeps what the sources said for each identity, and every answer is derived from the asker's own reading over those observations.

I recommend **B**. §9 says many checkouts of one repository ask at once, and they sit at different commits with different pins. Under A, a held read in checkout X returns a report made from checkout Y's declarations: right by 17's words, but not about X's repository state, which is what 31 and 32 key an answer on. Under B, a held read in X gives X's pins over the shared observations. When X is the state the last scan read, B's answer is identical to A's, because derivation is deterministic (D12). B makes 29 and S9 hold by construction, since observations are a cache.

B costs one added status. A dependency X declares but no scan has looked for is **unobserved**: neither read nor unread, because a held read reaches nothing (17). See Q2.

---

## 3. The derivation

`derive(reading, held, options, now) → answer` is pure. These are its rules.

**D1. Reading and merging.** Every bound dependency description reads the repository state (40). Declarations that give one identity are one dependency, wherever they sit and whichever description read them (2). Each description's `read-tiers` answer is merged as Q14 recommends. An identity that two tiers name makes the tiers unreadable. Every dependency is then reported unread with reason `tiers unreadable: <identity> named by <a> and <b>`, and every tier is due (13, 14, 1, 16). Q15 covers this.

**D2. Effective pin.**
- If every declaration's pin is known and all are equal by the order, the pin is that version.
- If they are known and differ, the pin is the oldest by the order (4). The answer lists every declaration with its own pin (4, 26).
- If the order between two declared pins is undecided, the pin is `unknown` with reason `declared pins of undecided order` (3, 7).
- If any declaration's pin is unknown, the dependency's pin is unknown (vocabulary: *pin*; 3). The known pins still appear on their declarations.

With an unknown pin, `newer` is `null`, never `[]`, so the answer never says "nothing newer" (3). `newest` gives the newest listed release by the order, for information only. The second rule (oldest of several) contradicts the vocabulary's *pin*: see Q5.

**D3. Tier.** Each dependency's tier is the one tier naming its identity, or `default` (13).

**D4. Status of a dependency.** Its status is one of three.
- **read**: every bound release source that knows the identity has a latest observation, and every one of them is `Listed`.
- **unread** `{reason, at}`, in any of these cases (1, 16, vocabulary: *unread*):
  - a declaration of it could not be read;
  - no bound release source knows its identity (Q19);
  - some source's latest observation is `Unreached`. In that case the releases from the sources that were reached are still given.
- **unobserved** *(added term)*: no observation at all. This never happens in a scanned tier after its scan (§5).

**D5. Classifying a release against the pin.** For each listed version `v` of the identity, the order (44) compares `v` against the effective pin `p`:

| `order(identity, v, p)` | result | forced by |
|---|---|---|
| `v` newer | in `newer` | 8 |
| same | it is the pin's own release, and gives `pin.attested` (including withdrawn) | 8, 43 |
| `p` newer | left out | 8 |
| undecided | in `undecided`, beside `newer` | 7 |

No date, spelling or listing order is consulted (6). The order is implemented once for each Package URL type and computed locally, so no pin leaves the host just to be ordered (37, 45).

**D6. Marks.**
- *Withdrawn* is copied from each attestation as the source gave it, on newer releases and on the pin alike. It is never turned into an advisory (19, 39, 43).
- *Prerelease* is set where the ecosystem's version grammar marks one (SemVer pre-release identifiers, PEP 440 `a`/`b`/`rc`/`dev`) and absent where the grammar cannot tell. Prereleases are always in the answer, because 8 lets no newer release be left out (§11; Q22).

**D7. Several sources for one identity** (39, 51). Releases are merged across sources by release id. Each release carries one attestation for each source that listed it, so different dates or withdrawn flags show side by side and none is chosen. If two sources' orders classify one version differently, it goes to `undecided` with each source's verdict (7, 39). Q12 covers what counts as disagreeing.

**D8. Advisories** (18, 19, 22). For each distinct known pin among the declarations, the answer shows the advisory observations at `(identity, pin)`. The dependency is **affected** if any advisory names any declared pin. Each advisory is given with the pins and declarations it names, its severity as given, and its link (47).
- If the pin is unknown, the advisory status is `not_checked: pin unknown`.
- If the source was unreached, the status is `unread` and the dependency's tier is incomplete (Q20, Q21).
- If no observation exists, the status is `unobserved`.

Advisories sit in their own field, never inside notes, and nothing is inferred from notes (19). Acknowledgements never touch this field (22).

**D9. Acknowledgements** (20–23). This rule applies unless the asker asked to disregard acknowledgements (23):
- A release with a **dismissed** acknowledgement is removed from `newer` and `undecided` (21).
- A release with a **skipped** acknowledgement is removed unless some currently listed release is newer than it by the order. Then it stays, marked `skipped: {by, at}`, beside the newer one (21). Skip is decided from the current listings alone, never from what was reported before (9).
- `left_out_by_acknowledgement` counts what was removed, so the asker knows a report under 23 would differ. It holds no release (21, S5).
- If one release has two acknowledgements, the latest wins (Q25).

Under 23 no release is removed, and each release that has acknowledgements carries them as information, so the set of releases is the one the pins alone decide.

**D10. Notes** (11, 12). Each release gives one entry for each notes source that knows it: `text` (whole), `wrote_nothing`, `unread` or `unobserved`.
- If the asker asked for a part (`notes_part: {first_bytes: N}`), the text is cut back to the last line end within N bytes, never mid-character. The entry then carries `whole: false`, the full `bytes`, its `sha256` and `rest: {ask: "brief", release: <id>}`. The way to read the whole is a brief, which may reach the notes source when the held copy was dropped (25). A held read may not (17). See Q27.
- Not one byte of what is given is altered (S7).

**D11. Due and made_at** (vocabulary: *due*, *cadence*, *complete*; 15, 16). For tier T in the reading:
- `members` = the dependencies of T. If there are none, T is not due.
- A member's `read_at` is the earliest `at` among its sources' latest `Listed` observations, defined only if the member is read (D4).
- `complete_since(T)` = the minimum `read_at` over the members, if every member is read. Otherwise there is none.
- `due(T)` = no `complete_since`, or `now − complete_since ≥ cadence(T)`.
- `made_at(T)` = the newest `at` among the members' latest observations.

A scan stamps every observation with its own start (§11, Q7) and attempts every member of each tier it covers. So when the reading does not change between scans, the members' latest observations all come from T's latest scan. "All read" then means "the latest scan was complete", and `complete_since` is that scan's start. That is the vocabulary's *due*, except in one case: an incomplete forced scan made within the cadence of a complete one. Here the model follows 16 and the tier becomes due (Q18). When checkouts differ, the rule stays well defined: a dependency new to tier T at X has no observation, so T is due at X.

**D12. Determinism.** The same reading, held revision, options and `now` give byte-identical JSON. Maps are sorted by key. Releases are sorted by the order, newest first, and undecided ones by version text. The answer contains no field that varies by asker or surface (32, 33, 34). The answer carries `due_as_of` instead of an "answered at" time, so the one moving input is visible (Q3).

---

## 4. Questions the core answers

These questions are the core's only interface (33). A surface may ask nothing else.

| question | input | reaches | writes | answer |
|---|---|---|---|---|
| `held` | repository state; tiers (default: all); `acknowledgements: applied \| disregarded`; `notes_part` | nothing (17, I5) | nothing | `answer` for the asked tiers |
| `scan` | the same, plus `mode: due \| named`; the asker's credentials, kept in memory only (38) | the release, advisory and notes sources of the selected tiers' dependencies, and no others (15, 37) | held state, by compare-and-swap (30, 49) | `answer` for the asked tiers, with `scanned: [tiers]` |
| `brief` | repository state; release id; `notes_part`; credentials | the notes and advisory sources for that one release (25) | notes records only (12, 25) | `brief` |
| `acknowledge` | release id; `dismissed \| skipped`; `by`; `via` | nothing | held state: appends one acknowledgement (20, 24) | the acknowledgement |
| `acknowledgements` | nothing | nothing | nothing | every acknowledgement ever given, including those whose release has left every report (24) |
| `forget` *(added)* | nothing | nothing | held state reduced to its acknowledgements (29) | the new revision |

Further rules on these questions:

- **`brief` refuses** when the release is not in the `held` answer for that repository state with acknowledgements disregarded. That answer is the set "any release a report holds" (25), and it is the only place a brief can get the release's date and link without calling `list-releases`, which 25 does not allow.
- **`acknowledge` refuses** a release id that no held listing names, so a typo cannot leave a lasting acknowledgement for a release that does not exist. It never moves a pin or changes an order or an advisory (22). Nothing in the core ever calls it (20).
- **`scan` in `due` mode** selects, among the asked tiers, those that are due (D11). If none is due, it reaches nothing, writes nothing, and answers exactly as `held` would (S2).

### 4.1 The answer form (35)

There is one JSON document for each question. Its top-level fields are `answer` (the question), `repository` (the store key and the repository state, 31), `asked`, `binding` (the profiles bound), `held_revision`, `due_as_of`, `unread_declarations` (1) and `tiers`.

Each tier entry gives `name`, `cadence`, `made_at`, `complete_since`, `due` (17) and `dependencies`. Each dependency gives `identity`, `status`, `read_at`, `declarations`, `pin`, `advisories`, `newer` (null when the pin is unknown), `newest` (only when the pin is unknown), `undecided` and `left_out_by_acknowledgement`.

Fields are only ever added (35). An absent field and `null` are fixed in meaning from the first release: `newer: null` means "undecidable", and `[]` means "none newer". A human rendering on the command line is a projection of this document and holds nothing the JSON does not hold.

---

## 5. How a scan is made

1. **Read once.** Make the reading of the repository state (D1). Everything after this uses that reading only (31).
2. **Read the held state** at its revision `r`.
3. **Select tiers.** In `named` mode, the asked tiers. In `due` mode, the asked tiers that are due by D11 at (reading, held, now) (15).
4. **Targets** are the dependencies of the selected tiers that have readable declarations.
5. **List releases.** For each target, ask each bound release source that knows the identity, batched per source as its profile allows (C.3's batched lookups). Stamp every observation with the scan's start time, success or `Unreached{reason}` alike (16, §11 Q7). Send only identities (37).
6. **Classify** against effective pins using the listings just fetched (D2, D5, D7).
7. **Advisories.** For each distinct known pin of each target, call `read-advisories` on every bound advisory source (18, 47).
8. **Notes.** For every newer and undecided release of each target, call `read-notes` on each notes source that knows it.
   - Fetch regardless of acknowledgements, because acknowledgements apply at answer time (21, 23).
   - Write each text whole to its own content-addressed file before step 9. A fetch that does not complete stores nothing (12).
   - Notes are fetched again at each scan of the tier, so an upstream edit reaches the asker as upstream now writes it (11; Q28).
9. **Write.** Compose `H'`: the held state with these observations replacing older ones key by key, and `first_seen` merged by minimum. Then call `write(r, H')`. On a conflict:
   - Re-read the held state at `r2`.
   - Compose again onto it, keeping, for each key, the observation with the later `at`. Acknowledgements are kept exactly as found, because a scan never writes one.
   - Call `write(r2, …)`.

   Composition is commutative and idempotent per key, so two scans at once end as if they had run one after the other (30; Q31). After five conflicts the scan answers with `written: false`.
10. **Answer** with `derive(reading, H', options, now)` for the asked tiers.

Nothing in steps 1–10 writes the repository's content, history or configuration (5, I1).

---

## 6. The seams (Part B as ports)

Each port is a Rust trait. A profile is one implementation of it (51, 52). Additions this model needs, which Part B does not have, are marked ⊕ and listed in the questions.

**Dependency description** (B.1)

```rust
trait DependencyDescription {
    fn read_dependencies(&self, r: &RepoView) -> Deps;         // 40: dependencies{identity, declarations[]}, unread[]
    fn read_tiers(&self, r: &RepoView) -> Option<Tiers>;      // 41: None when this profile declares no tiers ⊕ (Q14)
}
```

Both answers are a pure function of the view: no network, no clock, no environment (42, 37). `RepoView` offers reads only (5).

**Release source** (B.2)

```rust
trait ReleaseSource {
    fn knows(&self, id: &Identity) -> bool;                          // ⊕ 51 "answering for the identities it knows"
    fn list_releases(&self, ids: &[Identity], cred: &Credentials)
        -> Vec<(Identity, Listed | Unreached)>;                      // 43; batched by the profile
    fn order(&self, id: &Identity, a: &Version, b: &Version)
        -> Newer(a) | Newer(b) | Same | Undecided;                   // 44, 45
}
```

The order must obey these laws, which the suite checks (45, 52):
- `order(a,a) = Same`;
- `order(a,b) = Newer(a)` exactly when `order(b,a) = Newer(a)`;
- transitive over decided triples;
- stable across calls and across processes.

**Notes source** (B.3)

```rust
trait NotesSource {
    fn knows(&self, id: &Identity) -> bool;                          // ⊕
    fn read_notes(&self, rel: &[(Identity, Version)], cred: &Credentials)
        -> Vec<(ReleaseId, Text(bytes) | WroteNothing | Unreached)>; // 46; Unreached ⊕ (Q21)
}
```

**Advisory source** (B.4)

```rust
trait AdvisorySource {
    fn read_advisories(&self, q: &[(Identity, Version)], cred: &Credentials)
        -> Vec<((Identity, Version), Named[{id, severity_as_given, link}] | Unreached)>; // 47; Unreached ⊕ (Q21)
}
```

**Store** (B.5)

```rust
trait Store {
    fn read(&self, repo: &RepositoryKey) -> (HeldState, Revision);                                  // 48
    fn write(&self, repo: &RepositoryKey, read_at: Revision, next: &HeldState) -> Result<Revision, Conflict>; // 49: all or nothing
}
```

**Binding** (B.6). The binding names the profiles for each seam: any number of dependency descriptions, release sources, notes sources and advisory sources, and exactly one store (51). I recommend it be the operator's configuration, kept outside the repository, with the first-set profiles of §9 as its default. The actors table gives the operator whatever the authors and askers do not settle, and nothing gives sources to the authors. Every answer echoes `binding` so any difference it makes is visible (Q3, Q4).

---

## 7. The store: the git directory (C.6)

```
<git common dir>/headwater/
  held.json          HeldState; notes appear only as sha256 references
  lock               held with an advisory file lock, only while writing
  notes/<sha256>     each notes text, whole, immutable
```

**read**: parse `held.json`. If it is missing, the held state is empty at revision 0. Readers take no lock: a rename is atomic, so a reader sees the old file or the new one (30).

**write(r, next)**:
1. The notes files are already written, each through a temporary file and a rename.
2. Take the lock and read the current revision. If it is not `r`, release the lock and answer `Conflict` (49).
3. Otherwise write `held.json.tmp-<pid>`, fsync it, rename it over `held.json`, fsync the directory, release the lock, and answer `r+1`.

The lock auto-releases if a writer dies, so a crash leaves the old file or the new one, never half of either (30, 49).

**Cleanup**: on write, delete notes files that nothing references and that are more than an hour old. Those are orphans of crashed or conflicted scans. The age guard keeps a concurrent scan's notes, which may be written before its index (12).

**forget** writes a held state holding only the acknowledgements (29, S9).

Every worktree of a clone resolves to the same common directory, so every checkout of the clone shares one held state (28, 50). Clones on other hosts do not share it (Q1).

Where several designs satisfy 30 and 49 equally, I recommend this one. The alternative is a versioned directory swapped by renaming a link, which would let a person delete everything but `acks.json` by hand. C.6 as written describes a single file renamed over the old one, and `forget` covers S9 without hand-editing.

---

## 8. Lifecycles

**A tier's due-ness, at a fixed reading.** This is derived (D11), never stored.

```
never scanned ──complete scan──► fresh ──cadence passes──► due ──complete scan──► fresh
      any state ──incomplete scan──► due                                  (16)
```

**An acknowledgement.** Only `acknowledge` creates one (20). Nothing gives one when a pin moves, and nothing ever deletes one (20, 24).

```
given ──► in force ──(the pin reaches or passes the release)──► inert, still readable (24)
skipped, in force:  hidden ⇄ shown beside a newer release  (derived from current listings, D9)
```

---

## 9. Surfaces: what each gives

Every surface calls the one binary with `--json`. A single binary means a single core and one version of the derivation behind every surface (33). I recommend this over linking the core into each plugin, which only Rust plugins could do, and over a daemon. A daemon would be a second holder of state, and the store's compare-and-swap already makes concurrent askers safe.

| surface | asks | shows | hands on |
|---|---|---|---|
| **command line** | any question. `headwater scan [--due \| --tier T…]`, `held`, `brief <release>`, `ack dismiss\|skip <release> --by <who>`, `acks`, `forget` | a rendering of the JSON, or the JSON itself with `--json` | nothing |
| **Claude Code plugin** | at session start, `scan --due` for the tiers its configuration names (an asker's choice; default `favorites`), with a notes part | each newer and undecided release: its id, date, link, the notes part and the way to read the whole; the affected advisories; unread dependencies with reasons; each tier's `made_at` and `due` (S1–S3) | `brief <release>` to a background agent in a worktree of its own. That agent is the fixer, and the change is its own (36) |
| **herdr plugin** | `held` for the sidebar row and popup, which never reaches a source on refresh (17). `scan --due` only when its key or its owner's schedule asks | a row with counts of newer releases and affected advisories per tier and a due mark; a popup with the held answer | its key asks `brief` and starts a new agent in a worktree with it (36) |
| **Flywheel adapter** (a recorder) | daily `scan --due --tier favorites`, with acknowledgements applied or disregarded as its owner chooses (23) | nothing; it turns each release into one capture keyed by the release id, so it keeps each release once (10, S6) | nothing. It never calls `acknowledge` or `forget`, so it never writes the held state itself (actors: recorder) |

No surface filters, ranks, counts on its own, or works out "new since last time" (33, 34). A surface that folds prereleases out of its view folds rows out of a display. It does not change the answer.

---

## 10. Fixed example

### 10.1 The repository

Repository `/work/acme-app/acme-app.git` at commit `4f2e9c1`. The bound profiles are npm and Python for descriptions, deps.dev as release source, GitHub release as notes source, OSV for advisories, and the git directory as store.

```
package.json            "dependencies": { "acme-ui": "^2.1.0", "tiny-fmt": "~1.0.0" }
package-lock.json       acme-ui 2.1.4, tiny-fmt 1.0.2
pyproject.toml          dependencies = ["acme-client>=3.0"]
uv.lock                 acme-client 3.2.0
tools/pyproject.toml    dependencies = ["acme_client==3.1.0"]        # no lock; the == pins it
.config/headwater.toml  [tiers.favorites] cadence = "1d"
                        identities = ["pkg:npm/acme-ui", "pkg:pypi/acme-client"]
```

The reading has three dependencies:
- `pkg:npm/acme-ui` (favorites) and `pkg:npm/tiny-fmt` (default).
- `pkg:pypi/acme-client` (favorites), with **two** declarations. `acme_client` normalises to the same identity (2), and they give pins 3.2.0 and 3.1.0, so the effective pin is **3.1.0**, the oldest (4).

### 10.2 What the sources say at 2026-10-17T08:00Z

| identity | versions listed (deps.dev) | advisories (OSV) |
|---|---|---|
| acme-ui | 2.1.4, 2.2.0, 2.3.0-rc.1, 2.3.0 | none at 2.1.4 |
| acme-client | 3.1.0, 3.2.0, 3.3.0 (withdrawn), 3.3.1 | `OSV-EXAMPLE-0001`, severity `HIGH`, names 3.1.0 |

### 10.3 The scan (S1)

The Claude Code plugin asks `scan --due --tier favorites`. Favorites have never been scanned, so the tier is due. The scan:
- lists both identities;
- classifies acme-ui against 2.1.4 (2.2.0, 2.3.0-rc.1 and 2.3.0 are newer) and acme-client against 3.1.0 (3.2.0, 3.3.0 and 3.3.1 are newer);
- reads advisories at 2.1.4, 3.1.0 and 3.2.0;
- reads notes for six releases;
- writes revision 1.

Nothing in the repository changes (5).

### 10.4 The held read an hour later (S2)

`held --tier favorites` with `notes_part: {first_bytes: 2048}` gives this (abridged):

```json
{
  "answer": "held",
  "repository": { "store_key": "/work/acme-app/acme-app.git",
                  "state": { "commit": "4f2e9c1", "named_changes": null } },
  "asked": { "tiers": ["favorites"], "acknowledgements": "applied", "notes_part": { "first_bytes": 2048 } },
  "binding": { "dependency_descriptions": ["npm", "python"], "release_sources": ["deps.dev"],
               "notes_sources": ["github-release"], "advisory_sources": ["osv"], "store": "git-directory" },
  "held_revision": 1,
  "due_as_of": "2026-10-17T09:00:00Z",
  "unread_declarations": [],
  "tiers": [{
    "name": "favorites", "cadence": "P1D",
    "made_at": "2026-10-17T08:00:00Z", "complete_since": "2026-10-17T08:00:00Z", "due": false,
    "dependencies": [
      {
        "identity": "pkg:npm/acme-ui",
        "status": "read", "read_at": "2026-10-17T08:00:00Z",
        "declarations": [{ "description": "npm", "location": "package.json#/dependencies/acme-ui",
                           "says": "^2.1.0", "pin": "2.1.4",
                           "pinned_by": "package-lock.json#/packages/node_modules~1acme-ui" }],
        "pin": { "version": "2.1.4",
                 "attested": [{ "source": "deps.dev", "date": "2026-08-02T14:11:00Z",
                                "link": "https://registry.example/acme-ui/2.1.4", "withdrawn": false }] },
        "advisories": { "status": "read", "affected": [] },
        "newer": [
          { "release": "pkg:npm/acme-ui@2.3.0", "version": "2.3.0", "prerelease": false,
            "found_at": "2026-10-17T08:00:00Z",
            "attested": [{ "source": "deps.dev", "date": "2026-10-12T10:02:00Z",
                           "link": "https://registry.example/acme-ui/2.3.0", "withdrawn": false }],
            "notes": [{ "source": "github-release", "state": "text", "whole": false,
                        "bytes": 40960, "sha256": "9c1e…",
                        "text": "## 2.3.0\n\n### Features\n- `Tabs` gains keyboard navigation.\n…",
                        "rest": { "ask": "brief", "release": "pkg:npm/acme-ui@2.3.0" } }] },
          { "release": "pkg:npm/acme-ui@2.3.0-rc.1", "version": "2.3.0-rc.1", "prerelease": true, "…": "…" },
          { "release": "pkg:npm/acme-ui@2.2.0", "version": "2.2.0", "prerelease": false, "…": "…" }
        ],
        "undecided": [],
        "left_out_by_acknowledgement": 0
      },
      {
        "identity": "pkg:pypi/acme-client",
        "status": "read", "read_at": "2026-10-17T08:00:00Z",
        "declarations": [
          { "description": "python", "location": "pyproject.toml:project.dependencies[0]",
            "says": "acme-client>=3.0", "pin": "3.2.0", "pinned_by": "uv.lock:package[acme-client]" },
          { "description": "python", "location": "tools/pyproject.toml:project.dependencies[0]",
            "says": "acme_client==3.1.0", "pin": "3.1.0", "pinned_by": null }
        ],
        "pin": { "version": "3.1.0", "from": "oldest of 2 declared pins" },
        "advisories": { "status": "read", "affected": [
          { "advisory": "OSV-EXAMPLE-0001", "source": "osv", "severity": "HIGH",
            "link": "https://advisories.example/OSV-EXAMPLE-0001",
            "names_pins": ["3.1.0"], "declarations": ["tools/pyproject.toml:project.dependencies[0]"] }] },
        "newer": [
          { "release": "pkg:pypi/acme-client@3.3.1", "version": "3.3.1", "…": "…" },
          { "release": "pkg:pypi/acme-client@3.3.0", "version": "3.3.0",
            "attested": [{ "source": "deps.dev", "date": "2026-10-03T07:40:00Z",
                           "link": "https://registry.example/acme-client/3.3.0", "withdrawn": true }], "…": "…" },
          { "release": "pkg:pypi/acme-client@3.2.0", "version": "3.2.0", "…": "…" }
        ],
        "undecided": [],
        "left_out_by_acknowledgement": 0
      }
    ]
  }]
}
```

3.2.0 is reported as newer even though one declaration already pins it, because newness is measured from the oldest declared pin (4). The brief for it names both declarations, so a fixer sees which one lags (26).

### 10.5 Acknowledgements and moves over time

| time | event | acme-ui `newer` | acme-client `newer` | acme-client affected |
|---|---|---|---|---|
| t0 08:00 | first scan | 2.3.0, 2.3.0-rc.1, 2.2.0 | 3.3.1, 3.3.0 (withdrawn), 3.2.0 | OSV-EXAMPLE-0001 |
| t1 | a person dismisses `pkg:npm/acme-ui@2.3.0-rc.1` | 2.3.0, 2.2.0 (left out: 1) | unchanged | unchanged |
| t2 | a person dismisses `pkg:pypi/acme-client@3.2.0` | unchanged | 3.3.1, 3.3.0 (left out: 1) | **still named** (22, S10) |
| t3 | a person skips `pkg:pypi/acme-client@3.3.1` | unchanged | 3.3.0 (left out: 2) | still named |
| t4, next day | upstream publishes 3.4.0; `scan --due` | unchanged | 3.4.0, 3.3.1 *skipped, shown beside*, 3.3.0 (left out: 1) | still named |
| t5 | a fixer moves both declarations to 3.4.0; it lands; `scan --tier favorites` | unchanged | `[]` | none: no declared pin is named |

At t5 no acknowledgement was given or removed (9, 20, S4). `acknowledgements` still lists all three (24). `held` with `acknowledgements: disregarded` at t3 would show every release of t0 (23).

### 10.6 A brief at t4 (S7)

`brief pkg:pypi/acme-client@3.4.0` reaches GitHub for the notes and OSV for advisories at 3.4.0, and nothing else (25):

```json
{
  "answer": "brief",
  "repository": { "store_key": "/work/acme-app/acme-app.git", "state": { "commit": "7b0d5aa", "named_changes": null } },
  "release": { "release": "pkg:pypi/acme-client@3.4.0", "version": "3.4.0", "prerelease": false,
               "attested": [{ "source": "deps.dev", "date": "2026-10-18T06:15:00Z",
                              "link": "https://registry.example/acme-client/3.4.0", "withdrawn": false }] },
  "notes": [{ "source": "github-release", "state": "text", "whole": true, "bytes": 40960,
              "sha256": "4a77…", "text": "<all 40960 bytes, unchanged>" }],
  "advisories": { "status": "read", "named": [] },
  "declarations": [
    { "description": "python", "location": "pyproject.toml:project.dependencies[0]",
      "says": "acme-client>=3.0", "pin": "3.2.0", "pinned_by": "uv.lock:package[acme-client]" },
    { "description": "python", "location": "tools/pyproject.toml:project.dependencies[0]",
      "says": "acme_client==3.1.0", "pin": "3.1.0", "pinned_by": null }
  ]
}
```

The brief has no command, no tool and no step (27).

---

## 11. The statement's §10 questions, answered by the model

1. **Prereleases** (8). A prerelease is reported whenever it is newer than the pin, marked `prerelease`. Clause 8 lets no newer release be left out, so neither offered option (only where the pin is a prerelease, or where a tier asks) can hold unless 8 changes (Q22).
2. **Withdrawn** (43). A withdrawn newer release is reported with its source's `withdrawn: true`. A pin whose own release is withdrawn shows `withdrawn: true` on `pin.attested`. Neither is turned into an advisory (19), and both are given as the source gave them (39).
3. **Advisories and cadence** (15, 18). Advisories are read at every scan of the dependency's tier, for every distinct known pin, and so wait on the cadence. Clause 15 forbids reaching beyond the due tiers' sources. A named-tier scan refreshes any tier at will. Authors who want faster advisories put the dependency in a faster tier (14). This rests on reading 15's "sources" as including the advisory source (Q20).
4. **Whose acknowledgement** (20, 28). The repository's. Each one names who gave it and when (24). Per-person acknowledgements would make the answer depend on who asks, which 32 and the asker row forbid. An acknowledgement travels as far as the store reaches (50). With C.6 that is every worktree of one clone, not another host.
5. **Held state across hosts** (28, 50). Under C.6 each clone has its own. One held state across hosts needs a store profile every host reaches, and Part C has none. The model defines a repository as one git common directory (Q1).
6. **Several projects** (2, 13). A tier names identities (41), so naming an identity once places it across every project. A dependency in two projects is one dependency (2), with every declaration and its pin (4, 26).
7. **Cadence from start or end** (15). From the scan's start. A report's knowledge is as old as its earliest source reading. Measuring from the end would let a slow scan's first readings exceed the cadence before the tier counted as due.

---

## 12. Adding a profile; the conformance suite

**Adding a profile.** Implement the seam's trait in its own module, register it under a name, and pass the suite (51, 52). Profiles are compiled into the static binary (§9).

An external-process profile, speaking each contract's operations as JSON over its standard streams, would satisfy every clause equally and allow profiles outside the binary. I recommend leaving it until someone needs one, because the first set of §9 needs none. Batching (deps.dev, GitHub's fifty per query, OSV) lives inside the profile. The contract stays per identity (43, 46, 47).

**The suite** (52, §12 *What to deliver*):

- **Scenarios.** Each scenario is a fixture git repository, recorded source answers, a fixed clock, a sequence of questions and the expected JSON. Each one declares `cites: [clauses]`. A meta-test fails if any of clauses 1–52 or I1–I6 is cited by no scenario. S1–S12 are among the scenarios.
- **Laws for each profile:**
  - *Dependency descriptions*: two reads give identical answers (42). A hash of the worktree, the index, the refs and the config is the same before and after (5). Unreadable fixtures come back as unread, not missing (1). Identity normalisation (2).
  - *Release sources*: the order laws of §6 over generated version triples (45). An unreached fixture comes back as `Unreached` (43). Outgoing requests are recorded and hold only identities and versions (37, and see Q32).
  - *Notes sources*: byte-identical to the fixture, including a 40 KiB body (11, S7).
  - *Advisory sources*: severity as given (47).
  - *Store*: N processes writing at once end in a revision some serial order explains, and lose no acknowledgement (30). A kill mid-write leaves the old or the new file (49). Two worktrees reach one state (28, 50).

---

## 13. Scenarios against the model

| | how the model meets it |
|---|---|
| S1 | `scan --due --tier favorites`; D5 and D10; read-only Reader (5) |
| S2 | the tier is not due (D11), so `scan` reaches nothing and answers as `held`; `found_at` and `made_at` say when the releases were found |
| S3 | `Unreached` marks the dependency unread (D4), so the tier has no `complete_since` and is due (D11, 16) |
| S4 | the pin passes the release, so D5 leaves it out; no acknowledgement involved (9, 20) |
| S5 | dismissed means left out (D9), and a newer release is classified normally |
| S6 | the recorder keys on the release id (10); D12 gives the same id every day |
| S7 | D10: whole, or a part with `rest` pointing to a brief; bytes unchanged |
| S8 | compare-and-swap with re-composition (§5 step 9, §7) |
| S9 | `forget`; the next scan finds every tier due (no observations) and rebuilds; the answer differs only in its times (29) |
| S10 | D8 is untouched by D9 (22) |
| S11 | the watch list gives `pkg:github/<owner>/<repo>`, and tag-to-version mapping makes release ids match a declaration's (10). This depends on Q7–Q10 |
| S12 | three surfaces, one binary, D12 |

---

## Questions

These are the statement's gaps, contradictions and the clauses I could not check.

1. **What is "a repository"?** (28, 48, 50, C.6; vocabulary.) The vocabulary defines *repository state* but not *repository*. If it means one clone (one git common directory), C.6 satisfies 28 and 50. If it means every clone of one origin, across hosts, C.6 cannot satisfy them, and §10's question about acknowledgements travelling has no profile that answers it. *Contradiction under the second reading.*
2. **Which repository state does "what headwater holds" answer for?** (17, 31, 32.) Read literally, 17 answers with the newest report for each tier, whichever checkout made it. With many checkouts at different commits (§9), that report carries another checkout's pins. The model derives the answer from the asker's own reading over held observations, and adds the status `unobserved`. Confirm, or say that 17 means the stored report.
3. **Clause 32 names too few inputs.** (32, 38, 45, 51; actors: asker.) The answer also depends on:
   - the binding;
   - the asker's credentials. A private source one asker reaches and another does not makes the second asker's scan write `unread` into the shared held state, which changes the first asker's next answer. That sits badly with "never changes an answer by who it is".
   - the clock (`due`);
   - headwater's own version (fields gained under 35; an order fixed in a later release, which would also break 45's "always").

   Which of these may change an answer?
4. **Who binds the profiles, and where is the binding read from?** (51; actors: operator.) If the binding sits in the repository state, 32 holds by repository state, but authors then choose sources, which the actors table does not give them. If it is the operator's, 32 needs it named.
5. **Contradiction: *pin* vs 4.** (Vocabulary: *pin*; 3, 4, 7.) The vocabulary says a pin is unknown "when the repository state names no single version". Clause 4 gives a dependency several pins and measures newness from the oldest. Two related cases are also open: declarations that mix known and unknown pins (the model treats the dependency as unknown), and two declared pins whose order is undecided (the model treats the dependency as unknown).
6. **Which pin does 18 mean when there are several, and which advisories does a report give?** (18, 4; vocabulary: *report*, "the advisories that name it".) The model counts the dependency affected if any declared pin is named. "Name it" could mean the dependency at any version. Should a report also give the advisories that name each newer release, or only a brief?
7. **Contradiction: one identity vs Package URL types.** (2, C.1, S11.) One tool is naturally `pkg:cargo/x` through one declaration route and `pkg:github/o/x` through a watch list. A GitHub Action is `pkg:github/…` to the GitHub releases profile and may be another type to ecosyste.ms. Clause 2 demands one identity whichever declaration or source names it, and Package URL alone does not give that. Who maps between them, and which identity wins?
8. **How do Part C profiles turn a declaration into a Package URL?** (C.1, C.2 mise and GitHub Actions, S11.) For example, mise's `node = "20"` or a backend-prefixed tool. S11 depends on the answer.
9. **How is a release identity spelled?** (10, 44, C.3.) GitHub tags (`v1.2.3`, `cli-v1.2.3`) and registry versions (`1.2.3`) spell one release differently. PEP 440 orders `1.0` and `1.0.0` as the same while their spellings differ. Is a release id's version the source's canonical spelling, and whose?
10. **Contradiction: order and listing depend on the watch list.** (6, 43, 44, 45; actors: authors; C.3.) C.3 orders GitHub tags "by the watch list's tag pattern" and compares calendar versions "where a watch list says so". The tag pattern also decides which tags are this tool's releases. But `order` takes only an identity and two versions, and `list-releases` takes only an identity, so neither has the repository input. The actors table also says authors "never decide … that a release is older than it is". A change to the watch list at another commit would change the order, against 45.
11. **Part B does not carry a dependency's source repository.** (43, 46, C.3 GitHub releases, C.4.) GitHub releases ("any dependency whose source repository is on GitHub") and both notes profiles ("which deps.dev links or the watch list names") need a source repository that another profile or a declaration supplies. Part B's operations take only an identity (and a version). Part C says "Parts A and B do not change to admit a profile".
12. **What counts as two sources disagreeing?** (8, 39, 44, 51.) Does a release listed by one source and not yet by another count as disagreement (C.3's registry API exists for "a release deps.dev has not seen yet")? Do different dates or withdrawn flags? Whose order decides newness when two bound sources' orders differ? The model takes the union with an attestation from each source, and makes a release undecided when the orders conflict.
13. **Is C.4's precedence a choice between sources?** (39, C.4.) The changelog profile answers only "where no release body exists". When both exist and differ, this picks the release body, which 39 forbids ("chooses neither"), unless declining to answer is not choosing.
14. **How are tiers read from several descriptions?** (41, 51, B.1, C.2.) B.1 puts `read-tiers` in every dependency description contract. C.2 reads tiers from one file for all profiles, and the watch list carries a tier column of its own. How do several answers combine, and which wins?
15. **What happens when two tiers name one identity?** (13, 14, 1.) Clause 13 cannot then hold, and 14 forbids headwater from choosing. The model makes the tiers unreadable: every dependency is unread for that reason and every tier is due. Confirm.
16. **What is the default tier's cadence when a tiers file exists, and can a tier name identities by pattern?** (C.2; vocabulary: *default tier*; 41.) Can the file set the default's cadence? Can a tier name `pkg:npm/@acme/*`?
17. **Where does an unreadable declaration with no identity go?** (1, 13, 16.) If its identity cannot be read, it belongs to no tier. The model reports it in every answer at the top level and lets it make no tier due. Should it keep some tier, perhaps the default, incomplete?
18. **Contradiction: *due* vs 16 for a forced scan.** (Vocabulary: *due*; 15, 16.) A named-tier scan that comes out incomplete within the cadence of the tier's last complete scan leaves the tier not due by the definition. Clause 16 says it "leaves the tier due". The model follows 16.
19. **Should a dependency that can never be read keep its tier due for ever?** (15, 16, 51.) This happens when no bound profile knows its identity, or a source always refuses. Every `scan --due` then reaches every source of that tier again. Intended?
20. **Do "complete" and "sources" include the notes and advisory sources?** (Vocabulary: *complete*, *unread*, *source*; 15, 16.) The vocabulary's *source* is where releases are published, and *unread* speaks of "its source". Does an unreached notes or advisory source make a tier incomplete? Does 15's limit to due tiers bind advisory lookups (§10's advisory question)? The model answers yes to both.
21. **Clauses 46 and 47 have no "could not be reached" outcome.** (43, 46, 47, 18.) Clause 43 has one. Without it, an unreached advisory source reads as "no advisories", and the dependency would be reported not affected when the truth is unknown.
22. **Contradiction: prereleases vs 8.** (8, 43; §10.) Clause 8 leaves no room to omit a newer prerelease, so both of §10's options break it. `list-releases` also carries no prerelease mark, so a source's own flag (such as GitHub's) cannot reach the answer. Only the version grammar can mark one.
23. **Is a withdrawn release one "the source publishes"?** (8, 43.) The model reports it with its mark. If withdrawn means "no longer published", 8 would require it left out.
24. **Who may acknowledge, and how is "who" known?** (20, 24; actors.) The actors table gives no actor the decision to acknowledge, and the vocabulary leaves "acting session" undefined. Clause 20 and the recorder row cannot be checked. At its interface, headwater cannot tell a person or an acting session from a recorder or scheduler that calls `acknowledge`. What identifies `by` (24)? *Clauses I could not check.*
25. **Can acknowledgements be undone or conflict?** (20, 21, 24.) Can an acknowledgement be withdrawn or superseded? What happens when two people dismiss and skip one release (the model takes the latest)? Does a skip surface when the newer release that would surface it is itself withdrawn?
26. **What does a brief cover?** (Vocabulary: *brief*; 25.) Only the target release's notes, or also every release between the pin and the target, which a fixer moving several releases needs? What is the answer for a release no report holds (the model refuses)?
27. **What "part" of notes may be asked for, and what is "a way to read the whole again"?** (12, 17, 25.) When the held notes have been dropped, the whole can only come from the notes source, which a held read may not reach. The model makes the way a brief. Confirm.
28. **Do 29 and S9 assume the sources did not change?** (11, 29, S9.) If upstream edited notes, withdrew a release or published one between scans, the rebuilt report differs in more than its times. S9's "exactly what the last one did" also fails when the last scan covered fewer tiers than the next, and after a discard every tier is due. Should notes be fetched again at every scan (the model does) or kept once?
29. **How are uncommitted changes named, and may a dirty scan write?** (Vocabulary: *repository state*; 28, 31.) How does an asker name "any uncommitted change"? May a scan of a dirty state write to the held state every other checkout shares? Under the model it may, since observations are per identity and the pins stay per reading.
30. **What do Part C's declarations cover?** (1, 3, C.2.) npm `devDependencies`, `peerDependencies` and optional ones; Go's `// indirect`; Cargo's dev, build and workspace members. And is a broken lockfile unread (the model's choice) or an unknown pin?
31. **What does 30's "as one or the other would have left it" mean?** (30, 49.) Serializable, as the model does by composing again onto the newer state? Or literally one scan's result whole with the other's discarded? Both keep every acknowledgement.
32. **Can 37 be checked?** (37; actors: upstream.) It can be checked only against recorded requests. Batching (fifty repositories a query) shows a source the whole set of dependencies at once, and the asker's credentials identify the asker. Is either "something of the repository"? *A clause I could not fully check.*
