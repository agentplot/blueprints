# tailrace — reconstruction 1
A model proposed from the statement alone, 2026-10-22, by a fresh session with no other context.

## The form

The invariants are about a graph of content-addressed records (1-13, 66-73), four acts that mutate it in a fixed order (14-20, 25-30, 32-39, 40-45), one judgement that reads it (58, 82), and seven seams each satisfied by swappable profiles (92-93). That calls for three things joined: a data model of what the store and git hold, a set of lifecycles written as ordered seam calls, and a ports-and-adapters component model in which the seven seams are ports and Part C's profiles are adapters. I rejected a deployment model: the statement fixes one process with no service of its own (56, 60, 62). I rejected a wire protocol: the seams are operations a core calls in-process (92), and the only wire protocols are the ecosystems' own behind `serve` (86). A data model alone would miss the ordering 17, 33 and 35 demand; the lifecycles carry it.

## 1. Components

```
   surfaces (plugins, out of core)         askers
   +-----------+------------+----------+   (56, 57)
   | cli | agent hook | pane | adapter |
   +-----+-----+------+-----+----+----+
                  |  one core (56)
   +--------------v--------------------------------------+
   |  digest . artifact . index . claim . verdict engine  |
   |  publish . gate . promote . converge . render . keep |
   +---+------+------+------+------+------+------+--------+
       |      |      |      |      |      |      |   ports (92)
     store  build landing signer policy proj. target
       |      |      |      |      |      |      |   adapters (Part C)
     C.1-2  C.3-4  C.5-6  C.7-9   C.10  C.11   C.12
```

- **Core**: one library with no network of its own; every surface links it and asks it the same questions (56). It holds the verdict engine and the four acts. It holds no credential (64): each port receives the credential of the asker, host or environment at call time.
- **Ports**: the seven seams as interfaces, each with exactly the operations Part B names (66-91). The core binds adapters by reading the authors' bindings for build, projections and targets from the repository at the landed revision (92, 65) and the operator's bindings for store, signers and landing from host configuration outside the repository (92, 53).
- **Surfaces**: plugins outside the core that format one answer type (57) and keep no state (56).
- **Keep**: what the core writes outside the store (61). It lives in git, so it is readable from every checkout by plain tools with no process running (62): the version claims as refs (22, 63) and the render records (section 7).

## 2. Data model

Everything below is bytes in the store named by digest (1, 2). A pointer is a name in the store (70-71) or a ref in git; nothing acts on a pointer without resolving it first and recording the digest it resolved (3).

**Blob** is bytes under their digest (66, 72).

**Artifact record** is a small document: `{ecosystem, name, version, blobs: [digest], media}`. Its digest, the digest of this record, is the artifact's digest (67). A record missing any of the three metadata fields is refused (4). Offering the same record twice writes nothing and answers the same digest (5, 66).

**Index** is an artifact record of a reserved ecosystem `tailrace/index` whose body lists `{version, revision, artifacts: [{digest, ecosystem, name}]}` (6, 87). A version exists when, and only when, its index is held (17).

**Claim** is `{subject: digest, predicate, revision, build_identity?, body}` (7, 13). Predicates the core knows:

| predicate | made by | body |
|---|---|---|
| publish | tailrace as the publishing host (11) | outputs read, build identity, where each artifact came from |
| carried | tailrace as the host that found it (12) | another party's attestation, verbatim, and where it was found |
| verdict | the landing's gate, carried | check, build identity, outcome |
| rebuild | a verifier (30) | matched or not, per artifact digest |
| review, test | whoever the policy names | free |
| accepted | the gate (26) | policy audience, the claims that satisfied it |
| promoted | the gate (39) | the ledger entry (section 5) |
| approved | an approver (41) | the ledger entry it answers |

**Attestation** is a claim plus one signature, attached to its subject (8, 68). Never altered (10); a changed mind is a new attestation beside the old.

**Policy** for one audience is an ordered list of requirements `{predicate, signers: [signer], scope}` (82). Order matters: it fixes which claim is "the first found wanting" (58). The acceptance policy names no channel; a channel's policy may name the channel it is bound to (83).

**Verdict** is one of three: `Satisfied{claims}`, `Refused{claim, why}`, `Unreadable{what}` (58, 102). Nothing else is an answer.

**Channel** is a store name `channels/<channel>` resolving to an index digest or to nothing (31, 70-71).

**Ledger entry** is a claim of predicate `promoted` whose body is `{channel, from, to, asker, policy, claims, when, previous: digest}` signed by the gate (33, 39). The chain of `previous` is the ledger. Its head is the store name `ledger/head`.

**Environment** is `{name, target, channel, waits: bool}` declared by the authors (92, 115). It names no version (40).

**Cache entry** is bytes under `(build_identity, digest)` with no artifact record, so no index, name or policy reaches it (52, 53) and removing it removes no artifact (54).

## 3. The verdict engine

One function, pure over what it is handed, serves the gate (29), promotion (32), layouts (47) and reconcilers (42):

```
verdict(subject, policy, claims_of, verify):
  atts = claims_of(subject)          # Unreadable{subject} if not held (69)
  for req in policy (in order):
    found = [a for a in atts if a.predicate == req.predicate
             and verify(a, req.signers) names a signer       (80, 9)
             and a within req.scope                          (9)
             and a.build_identity joins the publish claim's] (13)
    if any expired  -> Refused{a, "signature expired"}       (81)
    if found empty  -> Refused{req, "no counted claim"}      (58)
  return Satisfied{found...}
```

Claims from unnamed signers are read, never counted, never removed (9). The engine inspects nothing but digests and attachments (29).

## 4. Lifecycle: a landing becomes a version

`publish(branch, revision)` runs these steps in this order; each refusal names what the clause says and leaves nothing of the version offered.

1. `landed(branch, revision)` or refuse naming the branch (14, 77).
2. Read the authors' declarations and the version rule from the repository at `revision` (21, 65): outputs, projections, policy. Never from the publisher's checkout.
3. Derive the version from history under that rule (21).
4. Claim the version: push the git ref `refs/tailrace/versions/<name>/<version>` pointing at `revision` to the repository's shared remote. Git refuses an existing ref at a different commit; that refusal is 22's, naming both revisions. An existing ref at the same commit is a repeat publish and continues (18).
5. `ensure(revision, outputs)` through the build seam, never building in-process (15, 74). For each output, `report(revision, output)` (75); an outcome that is not a pass refuses naming the output (16). Read every output before offering anything (16).
6. For each output and each projection the authors bind to it: `pack(output, version)` (84, 24) then `put-bytes` and `put-artifact` (66, 67), recording whether the store held each already (5).
7. Build the index and `put-artifact` it (17).
8. Sign and `attach` the publish claim to the index and to each artifact (11, 79, 68). For each verdict from `verdicts-of(revision)` (78), wrap it in a `carried` claim and attach it (12). This precedes naming so the gate never sees a half-attached version.
9. `name(versions/<version>, index, expected = nothing)` (70). If the name is already at this index, the publish is a repeat and the answer is the same (18, S2). If it is at another index, answer which artifact differed and offer no new name (18).
10. Answer: index digest, version, each artifact's digest and ecosystem name, where each claim is attached (19). Nothing here accepted, promoted or deployed (20).

Git serialises step 4 and the store's expected-digest move serialises step 9; those are the only points where two publishers meet.

## 5. Lifecycle: acceptance and promotion

`accept(version)`, run only by the party holding the gate's signer (27):

1. `resolve(versions/<version>)` and `read` the index (3).
2. `policy-for(repository at the index's revision, acceptance)` (82, 65).
3. `verdict(index)` and `verdict(each artifact)` (28). One refusal refuses the whole version naming the artifact (28).
4. On Satisfied: sign an `accepted` claim and attach it to the index (26). Bytes untouched; the digest is the offered one (26). Nothing attaches an un-acceptance (25).
5. On Refused or Unreadable: answer it (58, 59). The version stays offered and readable by digest (S5).

The offering credential can `put-bytes`, `put-artifact` and `attach`; the accepting credential can also `name`. The store's permission model enforces the second; the policy's signer list enforces that a claim written by the first in the gate's predicate is never counted (9, 27, S9).

`promote(channel, to, from_expected, asker)`, run by the gate:

1. `policy-for(repository, channel)` names who may ask (32): an after-publish rule or an approver. Refuse any other asker.
2. `to` must carry the gate's `accepted` claim (31). If the policy binds the channel (37, 83), `to` must be the head of the bound channel.
3. `verdict(to.index, channel policy)`; a rebuild requirement is met only by a `rebuild` claim from a signer other than the publish claim's, body `matched` (30).
4. `resolve(channels/<channel>)` must equal `from_expected`, else refuse naming the digest found and retry nothing (35).
5. Write the ledger entry with `previous = resolve(ledger/head)`, sign it as the gate, `put-bytes` it, `attach` it to `to.index` (39), then `name(ledger/head, entry, expected = previous)` (70). This move is the commit point: a refused move means another promotion got there first, and the whole act is refused (35).
6. `name(channels/<channel>, to, expected = from_expected)` (70). Between steps 5 and 6 a reader resolves the old head: the ledger is ahead of the name, never behind it (33), and any later act that finds the name behind the ledger head moves it forward first.
7. Answer the entry (57).

The ledger is append-only because the store never alters bytes (2), the head moves only with an expected digest (70), and entries are attached to indexes the store holds (39): a move back is a new entry (34, S8). Leaving a version moves no bytes (38).

## 6. Lifecycle: an environment converges

For each environment the authors declare:

1. `desired(env)` = `resolve(channels/<env.channel>)` (88, 40). Empty is an answer (31).
2. If `env.waits`, proceed only when an `approved` claim naming the ledger entry that moved the channel is attached to the index (41). The approver signs it with their own identity; the core attaches it.
3. The reconciler, running where the environment runs with its credentials (45), `read`s the index and artifacts by digest, runs `verdict(index, policy-for(repository, env.channel))` (42), and `apply`s only on Satisfied (90).
4. `report(env)` records what runs, by digest, and when (91).

An asker's question "what runs where" is answered from `desired` and `current` for every environment: should-run, runs, and whether they differ; a `current` that cannot be read is answered unread with the reason, never converged (43, S11). Push and pull targets share every step above except who initiates step 3 (44).

## 7. Lifecycle: a consumer layout

`render(versions, audience)`:

1. For each version, `resolve` its index and run `verdict(index, policy-for(repository, layout))` (47, 48).
2. Satisfied versions go to the projection's `render` (85); refused ones are left out and the refusal is answered to the asker naming version and claim (47). Unreadable ones are answered unreadable, never absent and never refused (51, 58).
3. Write a render record beside the layout: `{store, policy revision, audience, versions held, rendered at}` (61). It is a plain file so it is readable with no process (62) and deletable (63).
4. For an ecosystem whose clients read no files, `serve` the layout on the loopback interface (86); a miss for a version the layout holds is answered from the layout, and a version it lacks reaches the store only then (50).

The layout is never a source of truth (48); deleting one costs a render (63). The client's recorded address is the artifact's digest in the ecosystem's integrity field, with the layout's own location as the only locator (49).

## 8. What tailrace keeps

| record | where | why there |
|---|---|---|
| version claimed against revision | git ref `refs/tailrace/versions/<name>/<version>` on the shared remote | 22, 62, 63: the one record never deleted, visible to every publisher |
| render record | a file beside each layout | 61, 62 |
| nothing else | | 61: the store holds artifacts, claims, channels and the ledger; git holds policy, bindings and history |

Asking what tailrace holds reads these and nothing further, with no store, signer or target reached (60, S10, S12).

## 9. Fixed examples

A policy for acceptance, in the form the engine reads (82, 83):

```
acceptance:
  - publish  from [host:ci-fleet]            scope: any output of the revision
  - verdict  from [host:ci-fleet, gate:sluice] scope: check "test"
beta:
  asker: after-publish
  - accepted from [gate]
stable:
  asker: approver [person:release-owner]
  bound-to: beta
  - accepted from [gate]
  - rebuild  from [host:peer-a, host:peer-b]  scope: matched
```

A ledger entry (33, 39):

```
promoted:
  subject:  sha256:9f3a...   # index of 1.4.0
  channel:  stable
  from:     sha256:71c0...   # index of 1.3.2
  to:       sha256:9f3a...
  asker:    person:release-owner
  policy:   stable @ a1b2c3d (revision)
  claims:   [sha256:0d1e... accepted, sha256:4b4c... rebuild]
  when:     2026-10-22T14:03:11Z
  previous: sha256:e8e8...
```

A refusal (58, 59):

```
refused:
  subject: sha256:9f3a...
  claim:   verdict from host:unknown-7
  why:     signer not named by policy for acceptance
  theirs:  "signature verification failed: unknown key id 7"
```

## 10. Adding a profile

A new store, build, landing, signer, projection or target implements its port's operations and nothing beyond (66-91), is named in the repository's or the host's bindings (92), and passes the conformance suite (93). The suite is a set of scenarios, each citing by number the clauses it exercises against a chosen binding of all seven ports; it fails when a clause of Parts A or B is cited by no scenario. The statement's scenarios seed it: S1-S2 cite 14-22, S3 and S5 cite 9 and 25-29, S6-S8 cite 30-39 and 41, S4 cites 46-50, S9 cites 27, S10-S12 cite 51 and 60-63, S13 cites 78 and 82, S14 cites 54.

## 11. Where designs tie

- **Ledger in the store versus in git.** Entries attached to indexes in the store (39) with the head as a store name, or the same entries as commits on a git ref. Both satisfy 33-34. I recommend the store: 8 says an attestation is kept only where its digest is, and 61 forbids keeping in git what the store holds.
- **Acceptance claim on the index only, or on every artifact.** 26 reads either way. I recommend the index only, with 28 making it cover every named digest, because one claim is one verdict and the gate judged once.
- **Expected-digest moves in a store without them.** Move, then read back and compare, then report a lost race as refused (35). Weaker than a real move-if-expected but admitted by 70.

## Questions

- **Q1** (22). With a store that is a layout on disk and a repository with no remote, where is the version claim recorded so that two publishers on two hosts never both succeed? Git refs on a shared remote is the answer above; without a remote the clause has no referent.
- **Q2** (33, 61). Is the ledger to be authoritative in the store, in git, or both, and which wins when they disagree?
- **Q3** (29, 65). At which landed revision does the gate read the acceptance policy: the revision the index was published from, or the governed branch's head at the moment of judging?
- **Q4** (37). Does "only from the channel it is bound to" mean the bound channel's head at promotion time, or any version the ledger shows the bound channel ever held?
- **Q5** (41). Where is an approval recorded, in whose signature, and may an approver approve one environment's convergence without approving the promotion for all environments that follow the channel?
- **Q6** (43, 89). For a target that can never say what it runs, is "unread with reason" the permanent answer, or must such a target carry a marker the reconciler writes?
- **Q7** (47, 58). When an ecosystem's client can show only absence, is answering the refusal to whoever rendered the layout enough, or must the layout itself carry the reason in some ecosystem-readable form?
- **Q8** (49). npm and others record a resolved URL in the lockfile. Does a loopback address count as "no host", or must the layout be reached through a scheme the client records without a location?
- **Q9** (52, 54). How does a Nix closure of thousands of inter-referencing digests map onto artifacts and cache entries when removal is not reference-aware?
- **Q10** (21). Is one version derived per publish for every artifact the repository publishes, or one per artifact name, when a repository publishes several packages that change at different rates?
- **Q11** (18). When a repeat publish packs different bytes, is the second publish refused outright, or does it offer the differing artifacts under a new index that the version name is not moved to?
- **Q12** (16, 75, 78). Is "its build's outcome" the build seam's own outcome, the landing's verdicts, or both, and which wins when they disagree?
- **Q13** (30, 55, 87). Does a verifier compare digests at the output level or after packing, given that packing may not be reproducible (87)?
- **Q14** (61, 62). A render record sits beside a layout on one host. Must it be readable from every checkout, as 62 says of everything kept, and if so how does it travel?
- **Q15** (25, 81). A signer whose identity has expired signed a claim that counted at acceptance. Acceptance stands (25), but does a layout rendered later under the same policy refuse the version?
- **Q16** (9, 82). What is a signer's "reach": predicate types only, or also outputs, checks or ecosystems?
- **Q17** (53, 92). Where are the operator's bindings of store, signers and landing kept so that they are outside the repository yet readable by plain tools?
- **Q18** (31, 36). When the store cannot move a name against an expected digest, what guarantee must a reader of the channel still have?
- **Q19** (86, 60). Who runs `serve` and for how long, and does 60 permit it to reach the store on a miss?
- **Q20** (16, 74). When some outputs are cached and others are not, is `ensure` one call for all outputs, and is a partial answer a refusal?
