# tailrace and Switchboard: the coupling

A model of how tailrace, the open-source delivery tool, and Switchboard,
a client's delivery platform, fit together with a loose coupling. It was
written 2026-10-23 from the operator's brief of the same day. Citations
of tailrace are bare clause numbers; citations of Switchboard are
document paths under `switchboard-kit/docs/` and its own rule ids. Every assumption is
marked. The operator rules on the decisions in section 7; nothing here
is a plan until then.

The short answer. tailrace owns what a version is, which claims it
carries, which channel names it and why. Switchboard owns which installs
follow a channel, how a cascade of compositions reaches them, and the
deploy that converges each one. The join is three bindings: the class's
ECR is tailrace's store, the class's table is tailrace's keeper, and
Switchboard's dispatch is the reconciler of one tailrace target.

## 1. The two systems in one page

**tailrace** carries what a build left into a store the owner controls
and from there to everything that runs it (section 1 of the statement).
After a landing it packs the build's outputs, names each by digest,
attaches the claims about it and offers the set as a version (17). A gate
accepts what the claims and the policy admit (25); a promotion moves a
channel and the ledger records the move (33); an environment follows a
channel and a reconciler converges it (40). It reaches everything outside
itself through eight seams, each bound by a profile (92): the store
(B.1), the build (B.2), the landing (B.3), the signer (B.4), the policy
(B.5), a projection (B.6), a target (B.7) and the keeper (B.8). Four
surfaces answer from one core (A.10).

**Switchboard** is one console and one control plane over everything
Willdan's business units ship (`spec/overview.md`). Every deliverable
moves through one lifecycle: build, artifact, registry, channel move,
dispatch, deploy. Its parts: builds, the platform module and the fleet
(`spec/builds-and-publishing.md`); the registry, an S3 bucket, two ECR
repositories and CodeArtifact per region (`architecture/registry.md`);
releases, a record of channel moves with one approval
(`spec/releases.md`); dispatch, which turns a head move into a deploy row
per subscription (`spec/dispatch-and-deploy.md`); the deploy engine, one
Step Functions executor per mechanic (`architecture/deploy-engine.md`);
compositions, apps with members that rebuild, stream or bind
(`spec/compositions.md`); gates, a task-token wait on a deploy row; and
state, one DynamoDB table (`spec/state.md`).

Side by side, by what each owns:

| concern | tailrace | Switchboard |
|---|---|---|
| what a version is | a component's index in the store, derived from history (21, 123) | a `VER#` row with a locator, from git-cliff per app (build.19, ADR 0074) |
| where bytes live | the store, an OCI registry, by digest (C.1) | the class registry: S3 for templates, ECR for images, CodeArtifact for packages (registry.1) |
| what proves a version | claims attached to the digest, counted under a policy (9) | check outcomes on the build row; proof rows not yet built (deploy.18) |
| what builds | the repository's own tool under its landing gate; tailrace never builds (15) | the platform module on the class's fleet, three jobs (ADR 0058) |
| what lands | sluice, which tailrace reads (C.5) | sluice on switchboard-kit's own branches; the fleet builds the pushed head (gates.6) |
| a channel | a pointer to one accepted version, moved only by the gate (31, 32) | a `CH#` row moved by a conditional write; `stable` only by a release (lifecycle.2) |
| the record of moves | the ledger, a signed chain the keeper holds (105, 120) | the channel row's `prev` and the app timeline |
| who follows a channel | an environment, declared by the authors (C.10) | a subscription row, authored or derived (`spec/state.md`) |
| waiting for a person | a channel of the environment's own, bound to the one it waits on; a yes is a promotion (41, 97) | `policy: manual`, an `update-available` row an operator deploys |
| converging | a reconciler, push or pull, with the environment's own credential (42 to 45) | an executor working a deploy row under the tenant's role (deploy.8) |
| a second signer on a deploy | none; a promotion policy may name several signers | a gate on the subscription, honored on the deploy row (deploy.6) |
| several apps at once | not a concept; a channel belongs to one component (125) | a release: several moves in one transaction (releases.2) |
| a dependency cascade | not a concept; one component's publish never moves another (124) | members with mechanic `rebuild`, the two-pass machine (compose.4) |
| tenancy | none; a StackSet's instance list is kept outside (C.12) | tenants, accounts, audiences, containers |

**Where the words collide, and the word this document uses.**

- *channel*: the same concept on both sides. This document says channel.
  Switchboard's four classes, `alpha/<branch>`, `beta`, `stable` and
  `lts-<name>`, are names of channels.
- *release*: tailrace's "released" is a state (glossary); Switchboard's
  release is a record of several channel moves with one approval. This
  document says **release** for Switchboard's record and **on a channel**
  for tailrace's state.
- *environment*: tailrace's environment is one target following one
  channel (glossary); Switchboard's environment is a named place holding
  many installs, and its **install** is one app in one environment with a
  subscription (record 0023). tailrace's environment is Switchboard's
  install. This document says **install** for Switchboard's row and
  **environment** in tailrace's sense, and **account environment** for
  Switchboard's place.
- *gate*: tailrace's gate accepts and promotes (25, 32); sluice's gate
  lands; Switchboard's gate is an approval on a deploy row. This document
  says **the gate** for tailrace's, **the landing gate** for sluice's and
  **the deploy approval** for Switchboard's.
- *promotion*: tailrace counts every channel move, `beta`'s included
  (32); Switchboard means moving `stable`. This document uses tailrace's.
- *dispatch*: Switchboard's only. The fan-out of one head move into deploy
  rows. Section 3 says where it sits.
- *app* and *component*: a Switchboard app is a tailrace component with a
  kind. This document says **component** where tailrace's rules apply and
  **app** where Switchboard's do.
- *policy*: tailrace's is the claims a version must carry (82);
  Switchboard's `policy: auto | manual` is whether an install moves on its
  own or waits (41). This document says **policy** for tailrace's and
  **moves on its own** or **waits** for Switchboard's.
- *registry* and *store*: tailrace's store is one content-addressed
  registry (73); Switchboard's registry is three services that hold
  bytes. This document says **the store** for ECR and **the template
  bucket** and **CodeArtifact** for the other two.
- *subscription*: Switchboard's row that says which install follows which
  channel under which policy and gate. It is an environment declared
  outside the policy file, which is the roster the statement leaves open
  (section 10 of the statement). This document says **subscription** for
  the row.

## 2. What stays Switchboard-only

**App composition and the cascade.** The operator's question: when a jar
updates, do the applications that use it need tailrace to know? No. The
statement is explicit that a component is the outputs that take one
version together (123), that a publish names one component and never
gives another a version, an index or a move (124), and that a channel
belongs to one component (125). A cascade is the opposite: one
component's move causing another component's new version. tailrace gives
the cascade two things and nothing more: a channel per component that a
consumer can follow, and a keeper whose append is the one event that says
a channel moved. Which consumers follow which member's channel, and what
a consumer does when it moves, is Switchboard's `MEMBER#` row and its
`rebuild`, `stream` and `bind` mechanics (`spec/compositions.md`,
Members are an axis).

One thing moves on Switchboard's side to keep the cascade inside the
statement. Today the rebuild executor starts the composition's build with
the member-version map as an input and the build publishes a generation
with no commit behind it (`spec/builds-and-publishing.md` §2.2). Under
tailrace a version is derived from history at a landed revision (21), the
same revision gives the same version (21), and a publish offers only what
a landing's verdicts name (15). A generation with no commit has no
landing and no revision to derive from. So a rebuild lands a commit: the
rebuild executor writes the member-version map into the board's
repository as a lock file and submits it through sluice, the board's own
build reads the lock, the landing's publish gives the board its version,
and `beta` moves by the gate's rule like any other component. Switchboard
already does this for configset compositions, whose rebuild "commits
activation rows to the config repo, whose own CI is the build"
(`spec/dispatch-and-deploy.md`, rebuild). The cfn board joins that shape.
The acceptance diff, the depth guard and the idempotency on the map's
hash stand as written; the idempotency key becomes the lock's content.

**Config as code.** Configsets, bundles, env revision records and the
stream executor stay Switchboard's (`spec/configurator.md`). A bundle is
an artifact tailrace can hold, since its `rev` is a content hash already,
and its channel is a channel like any other. What the stream executor
does with a moved bundle, per environment and per set, is a reconciler
of its own and stays where it is.

**Tenancy.** Tenants, accounts, audiences, container scopes, the
connection and the roles a deploy assumes are Switchboard's
(`spec/tenancy-and-identity.md`). tailrace holds no credential that
reaches a target (45, 64) and never learns a StackSet's instance list
(C.12). A deploy reaches an account through its tenant's connection row
(tenancy.4), which is the "environment's own credentials in the
environment's own place" the statement asks for (45), reached at the
moment of use.

**Everything after the deploy.** Discovery, service rows, connections and
bindings, benches and PR environments, the console, the portal, the
regression suite, notes and the outward timeline are Switchboard's and
touch nothing in tailrace.

## 3. The coupling

### 3.1 What each Switchboard piece binds

| tailrace seam | Switchboard piece that binds it | profile |
|---|---|---|
| the store (B.1) | the class's ECR, one repository per ecosystem name, replicated per region as `swb-<class>-app-images` is today (registry.1) | C.1, an OCI registry |
| the build (B.2) | moon in the repository, run by sluice on the landing; the fleet runs it | C.3 |
| the landing (B.3) | sluice's remote refs on the repository's GitHub remote, `refs/sluice/runs/<signer>` | C.5 |
| the signer, offering (B.4) | the fleet runner's role with a KMS key, later the job's OIDC identity | C.7, then C.9 |
| the signer, accepting (B.4) | the gate function's KMS key, in the control plane | C.7 |
| the policy (B.5) | `.config/tailrace.toml` at the landed head of the governed branch, read through the class's GitHub App | C.10 |
| a projection (B.6) | npm, a file, an image, and one to add: a CloudFormation template set | C.11 |
| a target, StackSet (B.7) | a StackSet install, its instances the tenants | C.12 |
| a target, pool (B.7) | Switchboard's dispatch and executors over the subscription roster | a new profile, section 3.4 |
| the keeper (B.8) | the class's DynamoDB table, a partition per chain, conditional appends | a new profile, section 4.3 |
| what turns the wheel | the class's GitHub App brokering the publish job on push; the store's event telling the gate | no seam; section 6 proposes a Part C list |

**Assumption A1.** ECR's referrers API and its event for a manifest push
with a subject behave as the OCI distribution 1.1 specification says.
aws/containers-roadmap 2306 and 2783 were open on 2026-10-21 (the book's
open page). Bolt 2 of phase 1 answers this with a push against a real
repository; the tag-schema fallback (C.1) covers the gap if it stays
open.

### 3.2 The thin hosted layer

The thin layer is three things and nothing else: the gate, the keeper,
and the read of the policy. It verifies claims, appends promotions and
reads a file. It builds nothing (29), rebuilds nothing (30), holds no
artifact (section 9 of the statement) and deploys nothing (49 of the
actors table). The inception pack's warning holds: if the center starts
doing the work, the design has been pulled back to the forge
(`01-vision-and-shift-left.md`).

**Built into Switchboard, as one service of the control plane.** The
recommendation is a function in the compute stack, `tailrace-gate`,
which links tailrace's core as a library and binds four profiles: the ECR
store, the KMS accepting signer, the DynamoDB keeper and the policy file
read through the App. The reasons:

- The gate holds the one accepting credential, in a place no offering
  credential reaches (95, 96). An installed app lives in a tenant's
  account under the tenant's roles; that is where reconcilers run (45),
  and where a build's credential can reach. The control plane is the
  owner's trusted place.
- The gate alone appends to the keeper (ADR 0009), and the keeper is the
  class's table. A service in the same stack appends in the same
  transaction that writes the projected channel row, so the stream event
  dispatch reacts to is the keeper's own append.
- The gate reads every connected repository's policy at the landed head
  (65, 107). The class's App already holds that read.
- Switchboard's rule for a managed capability (process.3) and its rule
  that one function invokes no other (events.2) both fit a function
  invoked by a bus rule.

The alternative, a GitHub Actions job in a protected environment of a
control repository with the accepting role, works for a repository with
no Switchboard and is the bridge Switchboard uses before the function
exists (section 8). It is weaker: a runner is a host that builds, and 96
asks that no such host hold the accepting credential; a separate label
and role make it a different host by convention, never by construction.

**Assumption A2.** tailrace's core compiles to a Lambda on the Rust
runtime, or the function shells out to the static binary. Either keeps
one core answering (56); the plan treats it as a packaging choice.

### 3.3 Where dispatch sits

Dispatch is a reconciler. It is the `apply` of one tailrace target, the
pool target, run for every environment of the roster that follows the
channel that moved. It is neither a promotion nor a thing above tailrace:

- It is not a promotion, because it moves no channel. The channel moved
  when the keeper appended (33); dispatch reads committed state, as
  Switchboard already requires of itself (`spec/dispatch-and-deploy.md`,
  Events derive from committed state).
- It is one environment converging, many times. The statement has an
  environment that moves on its own converge whenever its channel's head
  moves (41). A pool target holds many environments on one roster, so one
  head move is many `apply` calls, computed from one Query. That is
  dispatch's fan-out (deploy.4).
- What Switchboard keeps above tailrace is what it does with the deploy
  row after it exists: the executor per mechanic, the deploy approval,
  the evidence, the release's fanout snapshot. tailrace sees the row's
  terminal status as the target's `report` (91).

Three Switchboard concepts land on the ledger instead of on rows:

- **`policy: manual` becomes a channel of the install's own.** The
  statement is firm: an environment that waits follows a channel bound to
  the one it waits on, an approval is a promotion, and there is no
  approval that is not a promotion (41, 97; core.35). So an install that
  waits follows `<component>/<install>`, bound to the channel it was
  subscribed to (37). The operator's "Deploy" on an `update-available`
  row is a request to the gate to promote that channel to the head of the
  bound one, and the ledger records who asked and when (33). The
  `update-available` row stays as a report: the bound channel's head is
  ahead of the install's own, which `tailrace status` already shows as
  should-run against runs (98).
- **A held version is a promotion of the install's own channel** to a
  version the bound channel has held, which 37 allows, and releasing the
  hold is a promotion to the bound channel's head. `holdVersion`'s guard
  on the production class (a version an approved release carries) is the
  bound channel's history (37).
- **A release is several promotions in one act.** Switchboard's release
  approval writes all of its moves in one transaction (releases.2). The
  keeper profile on one table can append to several chains in one
  `TransactWriteItems`, each conditioned on its predecessor. Section 6
  proposes the clause that admits it.

One Switchboard concept stays on the deploy row: **the deploy approval**
(deploy.6). It is about the change set, which exists only at apply time,
and it is the environment's second look at what the channel brought
(releases.6). It is the pool target's own guard inside `apply`, after the
reconciler has verified the version's claims (42) and before anything
executes. The ledger holds the promotion that caused the row; the row
holds the approval of the diff. Section 7 offers the alternative.

### 3.4 From a landing to a tenant running the new version

Each step names who acts and what it reads.

1. **sluice lands.** An agent submits; sluice forms the candidate, runs
   the repository's moon checks on the fleet as a launched executor
   (sluice's statement, C.3 launched) or on a box, and lands revision R
   on `main`, pushing it to GitHub. The job signs its run records, each
   naming moon's task hash, under `refs/sluice/runs/<signer>`. The job's
   last step pushes the output archives the landing's build left into the
   store's cache namespace (C.3, "a step after a landing pushes the
   archives"). Reads: the repository, `.config/sluice.toml` at the
   branch's revision. Switchboard acts here only as the pool: its App
   brokered the runner (ADR 0071).
2. **GitHub delivers the push.** The class's App receives `push` on
   `main` and brokers a runner for the repository's publish job, as it
   brokers every job carrying the class's label (build.30). sluice runs
   nothing after a landing (ADR 0005; sluice 10); the push event is what
   turns the wheel.
3. **tailrace publishes.** The job checks out R and runs `tailrace sync`
   to fill moon's outputs directory with the archives the landing's
   verdicts name (C.3, C.11), then `tailrace publish`. The publish reads
   `landed(main, R)` and `verdicts-of(R)` from sluice's refs (77, 78),
   asks moon to `ensure` the declared outputs, which replay (74), refuses
   any output whose identity no verdict names (15, 111), derives each
   touched component's version per the policy's rule (21, 123, 124),
   pushes the tag as the claim of the name (22), packs each output with
   its projection (84), puts the artifacts and then the index into ECR
   (17), attaches the provenance and the carried verdicts (12, 13), and
   signs as the runner's identity (11). Its answer names every digest
   (19). It has moved no channel (20). Reads: git, sluice's refs, moon's
   state, `.config/tailrace.toml` at `main`'s landed head, never the
   checkout (65).
4. **The store tells the gate.** ECR emits an image-action event for the
   index's push; an EventBridge rule in the class's eventing stack
   invokes `tailrace-gate` with the digest. That is the gate "told of it
   by a publish's answer" (95). The gate reads `claims-of(index)` (69),
   reads the policy for acceptance at `main`'s landed head through the
   App (107), verifies each claim against the signers the policy names
   (80), and attaches the acceptance claim signed with the class's KMS key
   (26). For each channel whose rule follows each publish, `beta`, it
   appends a promotion claim to the keeper, conditioned on the
   predecessor (120), in the same transaction as the projected `CH#` row
   (101, 106), and moves the ECR tag `beta` with the expected digest
   (109). Reads: ECR, the policy, the keeper's head. Switchboard acts as
   the bus; tailrace's gate acts.
5. **The same event writes Switchboard's rows.** A second rule invokes
   `tailrace-index`, which writes the `VER#` row with the ECR digest as
   its locator, the app's catalog entry, and one proof row per attached
   claim, as `catalog-index` does today from the bucket's event
   (registry.2). Acceptance and promotion claims arrive as later referrer
   pushes and update the proof rows. Switchboard's `deploy.18`, which
   reads a version's proof rows before a change set executes, is met by
   tailrace's acceptance claim.
6. **The keeper's append is the event.** The table's stream reaches the
   forwarder, which emits `Channel Head Advanced`; dispatch queries GSI1
   for every subscription on `<component>#beta` and, for each install
   that moves on its own, writes a `DEP#` row `queued` (deploy.4). That
   write is the pool target's `apply` (90). For an install that waits,
   dispatch writes its row `update-available`, which is a `report` that
   the bound channel's head moved (91), and no apply. Reads: the table.
7. **The executor converges the install.** The changeset executor claims
   the row and the install's lock; `deploy-prepare` resolves the settings
   at the version (deploy.15), reads the version's proof rows and refuses
   a version whose claims do not satisfy the channel's policy (42,
   core.29), renders the version's template set from ECR into the class
   bucket under `templates/<app>/<version>/` where it is not already
   there (a consumer layout, 48; the same bytes are a skip, build.5),
   creates the change set against that `TemplateURL`, parks on the task
   token where the subscription declares a deploy approval, executes, and
   reads the stack back. For a StackSet install, `UpdateStackSet` carries
   the version to every tenant instance the StackSet holds (C.12). The
   row ends terminal with evidence; the install row records the digest it
   runs, which is the marker a reconciler leaves (119). Reads: ECR by
   digest, the proof rows, the settings document, the tenant's
   connection row. Switchboard acts, under the tenant's role (45).
8. **A person promotes to `stable`.** The release manager assembles a
   release in the console and approves it. The API resolves the person's
   Frontegg subject and calls `tailrace-gate` with `promote(component,
   stable, version, asker)`. The gate reads the policy for `stable`: an
   approver's role may ask (32), `stable` is bound to `beta` (37), and
   the claims required, a rebuild claim among them where the policy says
   so (30). It appends one promotion per move in one transaction (section
   6, the proposed clause), and the ECR tag `stable` follows. Reads: the
   policy, the keeper, the index's claims.
9. **A production install waits, then moves.** The production install
   follows `<component>/prod052021`, bound to `stable`. Dispatch reports
   `update-available`. The release manager's "Deploy" asks the gate to
   promote `<component>/prod052021` to `stable`'s head; the ledger holds
   the move with the asker (33, 97); dispatch applies; the executor parks
   on the deploy approval, whose approver is never the requester
   (releases.6); the release approver approves the change set; the
   StackSet operation carries the version to every tenant's stack. The
   tenant runs the version whose bytes passed the landing gate, which no
   step after the landing rebuilt (I3).

Steps 1 and 3 run where sluice runs; steps 4, 8 and the keeper's append
are the thin layer; steps 5 to 7 and 9 are Switchboard's. Nothing in
steps 4 to 9 builds.

**Assumption A3.** The moon output archives in ECR's cache namespace give
a publish job on a fresh runner a full replay of the landing's build.
The book's open page names a measurement for the fleet's hit rate (C.3,
C.11); until it is read, a publish that misses the cache runs the build
tasks again under `ensure` (74), which is admitted, and offers only what
the verdicts' identities match (15).

## 4. Code and config examples

Illustrative, not compilable. Names are examples.

### 4.1 `.config/tailrace.toml` for a Switchboard-shaped repository

A repository with a CloudFormation app, an npm library and a service
image, as `closer` or `atlas-kit` is shaped, with a StackSet production
install and Switchboard's roster for the rest.

```toml
# Read at the landed revision of the branch it governs (65), never a checkout.

[version]
rule = "git-cliff"            # per component, over its paths and tag prefix (21, 123)
release_on = ["feat", "fix"]  # anything else is a prerelease (section 9 givens)

[components.closer]
outputs = ["closer:build"]           # moon tasks whose outputs are packed (C.3)
paths = ["cdk/", "cloudformation/", "src/"]
tag_prefix = "closer@"
projections = ["cloudformation", "image"]

[components.closer-sdk]
outputs = ["sdk:build"]
paths = ["packages/sdk/"]
tag_prefix = "closer-sdk@"
projections = ["npm"]

[signers.fleet]
kms = "arn:aws:kms:us-west-2:<account>:key/<id>"     # the runners' offering key (C.7)
claims = ["provenance", "test"]                        # what it may claim (116)
[signers.sluice-fleet]
ssh = "exec@fleet ssh-ed25519 AAAA..."                 # sluice's signer, same name both sides (104)
claims = ["verdict"]
checks = ["#check-fast", "#integration"]
[signers.gate]
kms = "arn:aws:kms:us-west-2:<account>:key/<gate-id>" # the accepting key (C.7)
claims = ["accepted", "promoted"]
[signers.release-manager]
oidc = { issuer = "https://<class>.frontegg.com", role = "release-manager" }
claims = ["promotion-request"]

[policy.acceptance]
require = [
  { claim = "provenance", from = ["fleet"] },
  { claim = "verdict",    from = ["sluice-fleet"], checks = ["#check-fast", "#integration"] },
]

[channels."closer/beta"]
asker = "after-publish"                 # the gate's rule follows each publish (32)
require = [{ claim = "accepted", from = ["gate"] }]

[channels."closer/stable"]
asker = { approver = "release-manager" }
bound_to = "closer/beta"                # only versions beta has held (37)
require = [
  { claim = "accepted", from = ["gate"] },
  { claim = "rebuild",  from = ["verifier"], matched = true },   # (30), phase 2
]

[channels."closer/lts-2026"]
asker = { approver = "release-manager" }
bound_to = "closer/stable"

# A channel pattern for branch builds (section 6 proposes the clause).
[channels."closer/alpha/*"]
asker = "after-publish"
branch = "*"                            # the branch whose prerelease it follows
require = [{ claim = "accepted", from = ["gate"] }]

[environments.prod052021]
component = "closer"
target = "stackset"
stackset = "closer-prod052021"          # the instance list is the StackSet's (C.12)
follows = "closer/stable"
waits = true                            # so it follows closer/prod052021, bound to stable (41, 97)

[environments.switchboard]
component = "closer"
target = "pool"                         # Switchboard's roster supplies the instances
roster = "switchboard"                  # each instance names the channel it follows and whether it waits
```

### 4.2 Two workflows

The publish job, in the repository, on the class's fleet. It carries no
destination (build.1 in Switchboard's words); the host's bindings file on
the runner names the store (118).

```yaml
# .github/workflows/tailrace-publish.yml
name: tailrace publish
on:
  push:
    branches: [main]
jobs:
  publish:
    runs-on: switchboard-dev-arm64        # the class's label (build.30)
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }           # history for the version rule (21)
      - run: git fetch origin 'refs/sluice/*:refs/sluice/*'   # the landing's records (C.5)
      - run: tailrace sync --cache         # moon's outputs from the archives the verdicts name (C.3)
      - run: tailrace publish main ${{ github.sha }} --json > publish.json
      # The answer names every digest (19). Nothing here moves a channel (20).
```

The gate, in the standalone form: a workflow in a control repository, on
a protected GitHub environment whose reviewers are the approvers and
whose role holds the accepting key. Switchboard replaces it with the
function of section 3.2; this is the bridge before that function exists.

```yaml
# .github/workflows/tailrace-gate.yml  (control repository, not the app's)
name: tailrace gate
on:
  repository_dispatch:
    types: [index-offered]               # raised by the store's event rule
  workflow_dispatch:
    inputs:
      promote: { description: "component/channel to version", required: false }
jobs:
  gate:
    runs-on: switchboard-dev-gate         # a label no build job carries (96)
    environment: gate                     # reviewers are the policy's approvers
    steps:
      - run: tailrace gate accept ${{ github.event.client_payload.digest }}
      - run: tailrace gate promote --follow-publish ${{ github.event.client_payload.digest }}
      - if: inputs.promote != ''
        run: tailrace gate promote ${{ inputs.promote }} --asker "${{ github.actor }}"
```

### 4.3 The DynamoDB keeper profile

One partition per chain in the one business table (state.14). An append
is one transaction: put the claim, move the head conditioned on the
predecessor, and write Switchboard's projected channel row. The chain is
one Query.

```
PK = LEDGER#<component>#<channel>   SK = SEQ#<zero-padded n>   claim (DSSE envelope), digest, predecessor, asker, at
PK = LEDGER#<component>#<channel>   SK = HEAD                   digest, seq
PK = APP#<app>                      SK = CH#<channel>           version, movedAt, movedBy, prev   (projection, written here and read as truth by nothing of tailrace's)
```

```rust
// Against B.8 (120 to 122). Illustrative.
pub trait Keeper {
    fn append(&self, claim: &PromotionClaim, predecessor: Option<Digest>) -> Result<Head, Refused>;
    fn chain(&self, channel: &ChannelId) -> Result<Vec<PromotionClaim>, Unreadable>;
}

pub struct DynamoKeeper { table: String, client: dynamodb::Client }

impl Keeper for DynamoKeeper {
    fn append(&self, claim: &PromotionClaim, predecessor: Option<Digest>) -> Result<Head, Refused> {
        let pk = format!("LEDGER#{}#{}", claim.component, claim.channel);
        let head = self.read_head(&pk)?;                       // (120): the head first
        if head.digest != predecessor {
            return Err(Refused::NotHead { at: head.digest });  // named, never retried blind (35, 105)
        }
        let seq = head.seq + 1;
        self.client.transact_write_items()
            .put(pk.clone(), format!("SEQ#{seq:012}"), claim.envelope(), cond!("attribute_not_exists(SK)"))
            .update(pk.clone(), "HEAD", set!(digest = claim.digest, seq = seq),
                    cond!("digest = :pred", pred = predecessor))   // the conditional append
            .put(format!("APP#{}", claim.component), format!("CH#{}", claim.channel),
                 projection!(version = claim.to_version, prev = predecessor, movedBy = claim.asker))
            .send()?;                                             // a lost race is a refusal (122)
        Ok(Head { digest: claim.digest, seq })
    }

    fn chain(&self, channel: &ChannelId) -> Result<Vec<PromotionClaim>, Unreadable> {
        // Query PK = LEDGER#..., SK begins_with SEQ#, ascending; page to the end (121)
        self.client.query(...).page_all().map(PromotionClaim::from_item)
    }
}
```

A release of several moves is one `TransactWriteItems` holding one
`append` per chain, each conditioned on its own predecessor, refused
whole when any condition fails (section 6, the proposed clause).

### 4.4 The Switchboard pool target

Against B.7 (88 to 91), with a roster. `desired` is the keeper's head;
`current` is the install row's recorded digest; `apply` writes the deploy
row; `report` reads the row's terminal evidence back.

```rust
pub trait Target {
    fn roster(&self) -> Result<Vec<Environment>, Unreadable>;          // proposed on B.7, section 6
    fn desired(&self, env: &Environment) -> Result<Option<Digest>, Unreadable>;   // (88)
    fn current(&self, env: &Environment) -> Result<Digest, Unread>;               // (89)
    fn apply(&self, env: &Environment, version: &VerifiedVersion) -> Result<Converged, Stopped>; // (90)
    fn report(&self, env: &Environment) -> Result<Report, Unread>;                // (91)
}

pub struct SwitchboardPool { table: String, keeper: DynamoKeeper }

impl Target for SwitchboardPool {
    fn roster(&self) -> Result<Vec<Environment>, Unreadable> {
        // Every ENV#<env> SUB#<app>#<channel> row of the component: an install, the channel it follows,
        // and whether it waits. A waiting install's channel is <component>/<install>, bound to the row's channel.
    }
    fn desired(&self, env: &Environment) -> Result<Option<Digest>, Unreadable> {
        self.keeper.head(&env.channel).map(|h| h.map(|h| h.digest))    // the chain, never the tag (101)
    }
    fn current(&self, env: &Environment) -> Result<Digest, Unread> {
        // ENV#<env> APP#<app> row: the digest the last terminal deploy recorded (119); absent is Unread with the reason
    }
    fn apply(&self, env: &Environment, version: &VerifiedVersion) -> Result<Converged, Stopped> {
        // The reconciler verified the channel's policy before this call (42). Write the DEP# row
        // queued, idempotent on (install, digest); supersede the standing unrun row (deploy.5).
        // The executor's change set, its deploy approval and its StackSet operation are the row's.
    }
    fn report(&self, env: &Environment) -> Result<Report, Unread> {
        // The newest terminal DEP# row: digest, when, evidence. A running row is "converging", never converged.
    }
}
```

### 4.5 The store's event to the table

An EventBridge rule in the class's eventing stack, one target with a
retry policy and a dead-letter queue (events.4), and a function that
reads the manifest by digest and writes rows.

```json
{
  "source": ["aws.ecr"],
  "detail-type": ["ECR Image Action"],
  "detail": {
    "action-type": ["PUSH"],
    "result": ["SUCCESS"],
    "repository-name": [{ "prefix": "swb-dev-" }]
  }
}
```

```ts
// services/tailrace-index/src/handler.ts (illustrative)
export async function handler(event: EcrImageAction) {
  const { repositoryName, imageDigest } = event.detail;
  const manifest = await ecr.getManifest(repositoryName, imageDigest);   // by digest, never by tag (3)
  switch (manifest.artifactType) {
    case 'application/vnd.tailrace.index.v1+json': {
      const index = parse(manifest);                                     // component, version, revision, artifacts
      await table.put(verRow(index.component, index.version, { locator: `${repositoryName}@${imageDigest}`,
                                                                 digest: imageDigest, revision: index.revision }));
      await table.put(catalogEntry(index));
      return;
    }
    case 'application/vnd.dsse.envelope.v1+json': {
      const claim = parseClaim(manifest);                                // predicate: accepted | promoted | provenance | ...
      await table.update(proofRow(manifest.subject.digest, claim.predicateType, claim.signer), { envelopeDigest: imageDigest });
      return;                                                            // counted only under the policy, by the gate (9)
    }
    default:
      return;                                                            // an artifact of a version; the index names it (6)
  }
}
```

A second rule with the same pattern and `repository-name` of the index
repositories invokes `tailrace-gate`.

### 4.6 The host's bindings on a runner and in the gate

The operator's bindings for a host, one file beside the landing's own
(118). On the fleet's runner image, written by the runner project's
environment from the deployment's outputs, as the runner learns the
control plane's address today (build.30):

```toml
# ~/.config/tailrace/config.toml on a runner (beside ~/.config/sluice/config.toml)
[store]
profile = "oci"
registry = "937485902695.dkr.ecr.us-west-2.amazonaws.com"
namespace = "swb-dev"                     # one repository per ecosystem name under it (C.1)
cache_namespace = "swb-dev-cache"         # expires by age; never an artifact (53, 54)

[signer]
profile = "kms"
key = "arn:aws:kms:us-west-2:937485902695:key/<fleet-key>"   # offering only (27)

[landing]
profile = "sluice"
remote = "origin"

[keeper]
profile = "none"                          # a publisher never appends (20)
```

In the gate function's environment, the same form:

```toml
[store]
profile = "oci"
registry = "937485902695.dkr.ecr.us-west-2.amazonaws.com"
namespace = "swb-dev"

[signer]
profile = "kms"
key = "arn:aws:kms:us-west-2:937485902695:key/<gate-key>"    # accepting; held nowhere a build runs (96)

[landing]
profile = "sluice"
remote = "github-app"                     # refs read through the class's App installation token

[keeper]
profile = "dynamodb"
table = "switchboard"
partition = "LEDGER#"

[policy]
profile = "file"
read_through = "github-app"               # .config/tailrace.toml at the governed branch's landed head (65, 107)
```

And the Switchboard-side declaration that binds the class, in the
foundation's regional template and the compute stack, in prose since the
templates are Switchboard's: the two ECR repositories gain siblings, one
per ecosystem name the class's components declare, created by the
publish's first push under the fleet's identity with tags immutable and
no expiring lifecycle on artifacts, and one cache repository whose
lifecycle expires by age; the eventing stack gains the two rules above;
the compute stack gains `tailrace-gate` and `tailrace-index` with the
gate's KMS key declared beside them; the class's GitHub App gains nothing
it does not hold.

## 5. Not the old Forge path

The forge, GitHub and its kind, bundles three things in one center:
where code runs, where it is stored, and who may do what
(`01-vision-and-shift-left.md`; tailrace ADR 0007). Its enterprise draw
is the third. Switchboard's build design has been walking toward the
first two: a platform module that is every repository's pipeline, run on
a fleet the control plane brokers, publishing through a handshake that
issues each build its credential and destination, into a registry only
the platform's indexer reads, with the version decided by a gate that
reads the platform's own build row (ADRs 0002, 0003, 0058, 0071;
`spec/builds-and-publishing.md` §3.3 to §3.5). Each piece has a reason,
and together they make Switchboard the forge for Willdan: the place
where code runs, the place it is stored, and the thing that decides,
with a repository carrying nothing but a caller. The user's own words on
2026-10-14, "we're building our own CI/CD, that's what Switchboard is"
(ADR 0070), name the path. The operator now wants the other one: a
fast option beside tailrace, where Switchboard centralizes trust and
leaves execution where the agents are.

Four rules this design follows to stay off that path:

1. **Execution stays where sluice runs.** The fleet is a pool sluice
   launches jobs on and the publish job runs on; it is never a pipeline
   of Switchboard's. The repository's own tool builds, under its own
   landing gate, and the platform module runs no step of a build
   (sluice I5; tailrace 15, non-goals).
2. **The store is the owner's registry, and every row is a projection
   of it.** A version is an index in ECR with its claims attached (6, 8);
   Switchboard's `VER#`, proof and catalog rows are written from the
   store and can be deleted and rebuilt from it (63). The one thing true
   only in the table is the keeper's chain, which is tailrace's by
   profile (ADR 0009) and copies out as bytes.
3. **The center verifies and never does the work.** The thin layer is
   the gate, the keeper and the policy read. No build-scoped credential
   is issued, no destination is handed out, no check is run and no
   artifact is packaged there (29, 30; actors table).
4. **The repository carries its own policy, and the platform reads it at
   the landed head.** `.config/tailrace.toml` says what a component is,
   which claims count and which channels exist (C.10). Switchboard's
   manifest shrinks to what is Switchboard-only: the kind, the archetype,
   the settings, the members. Nothing in Switchboard restates a version
   rule, a channel rule or a tag format.

## 6. What pushes on each design

### 6.1 tailrace: clauses to amend or add

Proposed wordings, numbered past 125.

- **126, the roster.** "A target may admit environments by a roster it
  holds: each entry names one environment of a kind the policy declares,
  the channel it follows and whether it waits, and the target answers its
  roster as it answers `desired`; an entry that waits follows a channel
  of its own, named by the entry within its component, bound to the
  channel the entry names (37, 41). The policy declares the kind; the
  roster declares the instances; nothing in the repository changes when
  an instance is added." Add `roster` to B.7 as a fifth operation; amend
  C.10 to say the policy declares environment kinds as well as
  environments; amend the question in section 10 to say it is ruled.
- **127, channel patterns.** "The policy may declare a channel by a
  pattern over branch names; a prerelease published from a branch the
  pattern matches is offered to the channel the pattern names for that
  branch, which exists from its first promotion and is retired with the
  branch by the authors' rule. A pattern's channel belongs to the
  component of the publish and binds to no other channel." This admits
  Switchboard's `alpha/<branch>` (`spec/state.md`, Channel semantics)
  without a channel per branch in the file.
- **128, a promotion of several channels.** "An act may ask for several
  promotions at once, each of one channel; the keeper appends each after
  its own predecessor, and where the keeper can hold the appends as one,
  it refuses them whole when any one is refused, naming the chain. A
  keeper that cannot appends them in order and reports the first
  refused, and the moves before it stand." This admits Switchboard's
  release (releases.2) and keeps 35 and 105 per chain.
- **129, the asker's identity.** "The ledger names an asker by an
  identity the gate verified at the moment of asking, issued by the
  owner's identity provider, never by the asker's own word; a surface
  that asks on a person's behalf carries the person's own token and the
  gate records the person. The gate refuses an asking it cannot verify
  and names what it could not read." This settles the phone button's
  identity (interview 1, A) and binds the Frontegg subject in step 8 of
  section 3.4.
- **130, what turns the wheel.** "The core starts nothing after a landing
  and nothing after an offer: a publish is run by whatever the host binds
  to run it, and the gate is told by whatever the host binds to tell it,
  and both are named in the host's bindings file (118) and nowhere in the
  core." Add to Part C a list, C.16, of the things that turn the wheel:
  a watcher of sluice's log; a push event a forge delivers to a job; a
  store's own event delivered to the gate; a person at a surface. This
  answers the operator's "trigger seam" question with a profile list and
  no ninth seam, since the core never calls it (ADR 0005).
- **C.15, the keeper: a database table.** "One partition per chain in a
  table with conditional writes: `append` puts the claim and moves the
  head in one transaction conditioned on the predecessor, and `chain` is
  one ordered read; a table whose writes are not conditional is not a
  keeper. A control plane that holds its own rows beside the chain writes
  them in the same transaction and reads them as projections (101)."
  Generic; names no vendor (core.24).
- **C.12, a new target row.** "A pool: a control plane's roster of
  environments (126), converged by the control plane's own executors;
  `apply` is the control plane's request to converge one environment,
  `current` and `report` are read from what it records; the environments'
  credentials are the control plane's, reached at the moment of use."
- **C.11, a new projection row.** "A CloudFormation template set: pack
  is the packager's own (`sam package`, the asset publisher) against a
  bucket address that is a parameter, so the packed templates name no
  bucket; render is the set written under a version prefix in a bucket
  the deploy reads, the same bytes a skip; serve is not needed."
- **C.3, one sentence.** Say that the output archives are pushed by the
  landing's job where the landing runs on a pool, so a publish on another
  host replays them; the sentence exists ("a step after a landing pushes
  the archives") and gains "on the host that ran the landing's checks".
- **The book, family.md.** The Switchboard section states that
  tailrace's channels are off in that deployment and the publish's answer
  is what Switchboard consumes. Rewrite it whole to this model: the
  channels are tailrace's, held in a keeper Switchboard binds, and
  Switchboard's dispatch is a pool target. ADR 0002's consequence that
  names "the Switchboard hybrid" stays true in the narrow sense that
  publish stands alone; the family page is where the stance lives.
- **The roadmap.** The hosted keeper and the pool target sit in phase 3.
  Section 8 proposes pulling the database keeper and the roster into
  phase 2, after the StackSet target, without touching phase 1.

### 6.2 Switchboard: what moves

ADRs to revisit:

- **0002 and 0058, the platform module.** The packagers per kind become
  tailrace projections (C.11) and the stampers become `pack`'s version
  argument (24, C.11). The module's three-job workflow becomes the
  landing on sluice and one publish job. What survives of 0058 is its
  first outcome, the repository declares how and the platform owns what
  follows, with "what follows" now the gate, the keeper and dispatch.
- **0003, 0070, 0071, 0073, the fleet and the runner broker.** Stand.
  The fleet is sluice's pool and the publish job's runner; the App
  brokers both. 0073's connect-time dispatch starts the publish job for
  a head with no version.
- **0074, git-cliff per app.** Stands as the authors' rule tailrace runs
  (ADR 0010); the module's own tag push and release creation move into
  the publish (22). build.32 and 22 say the same thing.
- **0029, 0034, the version gate.** Superseded: sluice's signed verdicts
  are the checks, and a publish refuses an output whose identity no
  verdict names (15, 111). The build row's check outcomes and
  `versionGate` go.
- **0032, withdrawn.** Its reason was that Switchboard needed nothing a
  registry adds. It now does: referrers that travel with the digest (8).
  A new record binds ECR as the store and keeps the bucket as a rendered
  layout.
- **0022, who may write a deploy row.** Answered: dispatch, as the pool
  target's `apply`, from a promotion; an operator's act that names no
  version writes a settings row as today; an act that names a version is
  a promotion of the install's own channel.
- **0083, the moon cache in the container.** Moot. The build runs under
  sluice in a checkout with a git directory, and the cache across hosts
  is tailrace's store (C.3). The organization's remote moon cache that
  0068 names as "a design of its own" is this.
- **0080 and 0085.** Stand; a replay the gate trusts is a cache entry
  (52), and a preview is sluice's.
- **0078, the production class.** Stands; its install follows
  `switchboard/stable` through a waiting channel of its own.

Spec sections to rewrite:

- `spec/builds-and-publishing.md`: §2's job types become projections;
  §3.3's module and runner become sluice's pool and the publish job;
  §3.4's version gate becomes the landing's verdicts; §3.5's handshake
  goes, since a job holds an offering credential and nothing else (27).
- `spec/state.md`: `CH#` is a projection the keeper's transaction writes;
  `LEDGER#` partitions are the keeper; `VER#` is written from the index;
  proof rows are claims. The write discipline stands.
- `spec/dispatch-and-deploy.md`: `policy: manual` becomes the install's
  own channel; a held version is a promotion; "a row for every match" is
  the pool target's `apply`; the deploy approval stands.
- `spec/releases.md`: a release is several promotions in one act (128);
  `stable`'s release-only guard is the channel's policy naming an
  approver (32); "came through beta" is 37.
- `architecture/registry.md`: lifecycle.4 is amended to admit an OCI tag
  written from the keeper and read as truth by nothing; registry.2's
  "one path" becomes the store's event; ECR gains the artifact
  repositories.
- `spec/compositions.md`: the rebuild executor lands a lock commit
  through sluice; a generation is the board's version at that landing.
- `spec/schemas-and-packages.md`: CodeArtifact is a package registry
  target every accepted version of a library is pushed to (C.12); the
  per-region publisher keeps its shape, fed by the target's push.
- `spec/domain-model.md`: app and component, install and environment,
  as section 1 has them.

What Switchboard stops building because tailrace does it: the packagers
and stampers, the publish handshake and build-scoped credentials, the
build row's check outcomes and the version gate, `catalog-index`'s
bucket path, the proof-rows design from a blank page, the organization's
moon remote cache, the open item "channel heads copied to registry tags"
(`architecture/_open.md`), and the independent verifier's rebuild for
`stable`, which arrives as a claim a second signer attaches (30).

## 7. Decisions for the operator

Each with options and a recommendation, for cards.

1. **The keeper in a Switchboard deployment.** (a) the class's DynamoDB
   table, a hosted keeper profile; (b) a git ref the gate pushes, with
   the table synced from the store's events. Recommend (a): the append is
   the stream event dispatch already reacts to, and no sync hop sits
   between the ledger and the deploy.
2. **Where the gate runs.** (a) built into the control plane as a
   function holding the class's KMS key; (b) a Switchboard app installed
   and connected like any other; (c) a GitHub Actions job in a protected
   environment. Recommend (a), with (c) as the bridge until (a) exists.
3. **`policy: manual`.** (a) the install's own channel bound to the one
   it followed, every yes in the ledger; (b) a target-side hold outside
   the ledger. Recommend (a); the statement requires it (97, core.35),
   and it gives Switchboard the SOX trail it wants from one record.
4. **The deploy approval.** (a) stays the pool target's guard inside
   `apply`, on the change set; (b) becomes a second signer in the
   promotion policy of the install's own channel. Recommend (a); the
   change set exists only at apply time.
5. **The cascade.** (a) the rebuild lands a lock commit through sluice
   and tailrace publishes the board; (b) a generation stays a
   Switchboard-only artifact outside tailrace. Recommend (a); (b) leaves
   production boards with no tailrace proof and no landing.
6. **Branch channels.** (a) a channel pattern in the policy (127); (b)
   Switchboard keeps `alpha/<branch>` above tailrace; (c) no branch
   channels, branch builds are previews. Recommend (a).
7. **Tenants at different paces.** (a) declared channels (`lts-<name>`)
   with one environment per channel, the roster supplying instances; (b)
   a channel per tenant on the roster. Recommend (a); Switchboard's own
   rule against forking a promotion (releases.3) and 125 both point
   there.
8. **The roster.** (a) a `roster` operation on the target seam (126); (b)
   a seam of its own. Recommend (a); only a target knows its instances.
9. **What turns the wheel.** (a) no seam, a Part C list (130, C.16); (b)
   a ninth seam the core calls. Recommend (a); the core starts nothing
   (ADR 0005).
10. **Several promotions in one act.** (a) add 128; (b) a release is N
    promotions in order, the first refusal stopping it. Recommend (a).
11. **The template bucket.** (a) a consumer layout the reconciler renders
    before apply; (b) a target every accepted version is pushed to.
    Recommend (a); a layout is never truth (48) and the same bytes are a
    skip.
12. **The offering signer on the fleet.** (a) a KMS key the runner's role
    uses (C.7); (b) keyless with the job's OIDC identity (C.9).
    Recommend (a) now, (b) when phase 2 delivers keyless; sluice's pool
    jobs already sign keylessly, and 104 wants one name for one signer,
    so (b) is the destination.
13. **Where the new profiles live.** (a) the database keeper, the pool
    target and the template projection as generic profiles in the
    tailrace repository, bound by name in switchboard-kit; (b) in
    switchboard-kit alone. Recommend (a); core.24 admits a generic
    profile and the conformance suite should hold it (93).
14. **Switchboard's first step.** (a) switchboard-kit publishes itself
    through tailrace into dev's ECR beside its current path, a second
    writer of a new fact and no fact's second writer (migration.1); (b)
    wait for phase 3 and cut over. Recommend (a), at tailrace's bolt 2.

## 8. A phase plan

tailrace's phase 1 does not wait on Switchboard. Its three bolts stand as
`phase-1-bolts.md` draws them, on the family's own repositories.

**tailrace phase 1, unchanged.** Bolt 1, publish on a laptop into a
layout; bolt 2, the ECR store, the KMS signer, the gate, the git-ref
keeper and promotion; bolt 3, sync, serve and moon's cache. One reading
belongs to bolt 2 that Switchboard needs early: whether ECR's referrers
and its push event for a manifest with a subject work as A1 assumes.

**Switchboard S0, now, with no tailrace code.** Stop widening the forge
path: no new packager, stamper or handshake call lands; the fleet's
runner broker (0071) and the connect's dispatch (0073) proceed, since
both serve the pool. Record the decisions of section 7 as Switchboard
ADRs once ruled. Move switchboard-kit's own main to publish from a
sluice landing's cache rather than a rebuild where it can, which 0080
began.

**Switchboard S1, with tailrace bolt 2.** switchboard-kit carries
`.config/tailrace.toml` and the publish workflow of section 4.2, and
publishes its own versions into dev's ECR beside the current bucket path.
The gate runs in its bridge form (decision 2c) with the git-ref keeper.
`tailrace status` on the box shows switchboard-kit's `beta` and `stable`
from the ledger. Nothing deploys from it yet.

**tailrace phase 2, with the Switchboard profiles pulled forward.** The
StackSet, package registry and static site targets as the roadmap has
them, then the database keeper (C.15), the roster (126) and the pool
target (C.12 row) as generic profiles with their conformance scenarios,
and the CloudFormation template projection (C.11 row). Keyless signing
follows.

**Switchboard S2, with tailrace phase 2.** The `tailrace-index` function
and the store's event rules replace `catalog-index`'s bucket path for
tailrace-published apps; proof rows are claims; `deploy-prepare` verifies
them (42). The template bucket becomes a rendered layout. The StackSet
install of a production board deploys a tailrace version end to end,
with the deploy approval in place. The rebuild executor lands a lock
commit. The platform module stops packaging for any app on tailrace.

**Switchboard S3, with tailrace phase 3.** The gate becomes the control
plane's function with the class's KMS key and the table as keeper;
`CH#` becomes a projection the keeper's transaction writes; `manual`
installs move to channels of their own; releases are several promotions
in one act; the deploy row is the pool target's `apply`. The handshake,
the build row's outcomes and the version gate retire. The herdr pane and
the Flywheel plugin from phase 3 read Switchboard's ledger as they read
any keeper's.

**Done when.** A landing on a Willdan repository through sluice on the
fleet is published by tailrace into the class's ECR, accepted by the gate
under the repository's policy, moves `beta` in the class's table by the
gate's append, reaches a tenant's StackSet by Switchboard's dispatch and
executor, and `tailrace status` on a laptop and the Switchboard console
answer the same should-run and runs for that install (56, S11).
