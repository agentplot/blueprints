# Encryption and tenancy — a brainstorm

What we can honestly tell a customer about where their content sits, who can read it, and what
they can revoke. Sources: `cloud.md`; `requirements.md` A.10–A.12, 157, 203–208, 216–217k,
239–242, A.32; `models/dispatch/model.md` §1–§5. Platform facts carry the date read.

## 1. Threat model

**Who the customer is protecting against.** Our own staff, who hold production access to the
shared tier. A co-tenant sharing the ticker's process, cache volume and capture queue. A
compromised shared component reached through our supply chain rather than theirs. The cloud
provider, at the level of a disk, a snapshot or a subpoena. GitHub, and everyone GitHub's
permissions admit: an org member, a contractor, a leaked token.

**What is at stake, worst first.** Raw capture material — meeting transcripts, support
threads, whatever the customer's operations actually say — the only place third parties' words
appear. Source code, in built repositories. Plan content: decision titles, rationale and the
register, which is the roadmap in readable form. Chat content on the sink. The manifest, which
names secrets but holds none.

**What is already true and must not be re-promised.** GitHub encrypts git data at rest with
AES-256 under Azure platform-managed keys ([GitHub changelog,
2019-05-22](https://github.blog/changelog/2019-05-22-git-data-encryption-at-rest/)), which is
their key and not the customer's. The App's installation token is short-lived and scoped to
the listed repositories (207), no secret travels through the page (251), and the dispatcher's
declaration names no repository and no unit type, so the shared tier clones no code (217).

## 2. The warm cache

The shared tier is fast because it does not re-clone two repositories every tick, and that
warm copy is the thing a customer is right to ask about.

**What we keep between ticks.** Per organization: a full clone of the state
repository and a blobless partial clone of blueprints sparse-checked to the manifest, the
claims and `flywheel/`, ten to fifty megabytes together. One row in the due index naming the
earliest time that organization's tick could change anything (245). Queued captures, the
caller's retry buffer and not state (246). No code, no raw material.

**Which stores hold it, and under whose key.** On AWS the clones live on EFS, the due index on
DynamoDB, queued captures on SQS with their bodies on S3; on Fly, a volume on the ticker
machine. EFS, EBS, SQS and DynamoDB are keyed per filesystem, per volume, per queue and per
table and never per tenant, so the store's own key is ours and does not carry the promise. The
promise is carried one level in: each organization's cache directory is sealed under a data
key wrapped by that organization's KMS key, whose policy names only the role that ticks that
organization. A queued capture carries an organization id and a pointer, its body written to
S3 under that organization's key, so the shared queue holds no tenant content at all, and the
due index holds times and ids by construction because ticking rebuilds it.

**Unwrapped for a tick and no longer.** The ticker assumes the organization's role, calls
`Decrypt` once, opens that organization's directory, evaluates its plan, writes its effects
and drops the key. The plaintext data key exists in a process evaluating that organization's
plan and at no other moment.

**What an attacker actually gets.** From a stolen disk, a lost volume or a leaked snapshot,
ciphertext with no data key on it. From a stolen backup of the queue or the index, ids and
timestamps. From a compromised ticker process while it runs, that organization's plaintext for
that tick and any other organization ticking in the same process. That is the residual.

**How the residual shrinks, in order of cost.** Evict on idleness and re-clone next tick, so a
sleeping tenant has nothing warm to steal; the price is a cold tick of a few seconds against a
warm one of a few hundred milliseconds, paid by a tenant who was idle anyway. Give each
organization its own role and its own tick boundary, so one compromised credential reaches one
tenant. Run the ticker in a Nitro Enclave with the key policy conditioned on attestation
(option d), which removes our staff and a compromised image entirely. Let the customer hold
the key (option b), so revocation is their kill switch and not our promise.

**What this does not change.** GitHub holds both repositories in plaintext, as it holds every
repository on the platform, under their key. A customer who needs that changed wants (c).

## 3. Technical options

### (a) Provider-managed encryption, one key per tenant

**Maps to** §2 exactly: one customer-managed KMS key per organization over the clone cache,
the body store, the queue, the due index and the pool host's disk, its policy naming that
organization's ticker role. **Covers** the cloud provider, a lost disk and a stolen snapshot,
and bounds blast radius to one key and one audit trail. It does **not** cover our staff, who
can assume the role, nor a compromised ticker mid-tick. **Costs** nothing measurable in
latency and about a dollar per key per month; key quotas bite near ten thousand tenants.
**Breaks** nothing. **Smallest proof:** delete one organization's key alias, and its tick must
fail closed with a named attention line rather than retry.

### (b) Customer-managed key by grant (BYOK)

**Maps to** the same stores, with the key living in the customer's own AWS account. We hold a
grant for `Decrypt` and `GenerateDataKey` under an encryption context naming the organization.
The customer calls `RevokeGrant` and our access ends everywhere at once, usually under five
minutes, since grants are eventually consistent ([AWS KMS docs, read
2026-09-07](https://docs.aws.amazon.com/kms/latest/developerguide/grant-delete.html)).
**Covers** our staff over time, because the customer ends it without asking us, and it logs
every use in their own account. It does not cover a live compromise while the grant stands.
**Costs** one KMS round trip per tick, which the tick already absorbs; caching the data key
across ticks would blunt revocation to the cache lifetime, so do not cache it. **Breaks**
nothing. **Smallest proof:** revoke mid-run, and the next tick refuses, the status view names
the key, and running work is not killed.

### (c) Client-side encryption of the state repository's contents — an optional upgrade

**Maps to** B.1's read and write against the C.2 layout, and to the machinery's own prefix in
blueprints (203). An organization may declare that records are written as sops/age envelopes
under its key: self-managed, the operator's age recipients on their hosts; hosted, a data key
wrapped by the tenant's KMS key. sops takes both backends at once and M-of-N key groups, so a
lost KMS does not lose history ([sops, read 2026-09-07](https://github.com/getsops/sops)).
Paths, file names and commit metadata would stay plaintext, because `list` reads names and
push-as-CAS is a compare-and-swap on a ref (162); so would the manifest, the book, the claims
and the map, which people review. **Covers** GitHub and everyone GitHub's permissions admit.
It does not cover us in the hosted tier, since the ticker holds the key to do its job.
**Costs** an envelope per file and our support's ability to read a customer's state to debug
it, which is why it is a declaration and not a default; little else breaks, because the state
repository is the machinery's alone (203) and nobody reviews its diffs. **Smallest proof:**
run the C.2 conformance suite against an encrypting binding, S13 and the count included, then
`git grep` a fresh clone and find only names.

### (d) Confidential compute for the shared tier

**Maps to** the batch ticker, run in a Nitro Enclave with each tenant's key policy
conditioning `Decrypt` on `kms:RecipientAttestation:ImageSha384`, so the key is released only
to the attested image ([AWS KMS docs, read
2026-09-07](https://docs.aws.amazon.com/kms/latest/developerguide/conditions-nitro-enclaves.html)).
**Covers** our staff and a compromised image, which is exactly the residual §2 names. It does
not cover code, because pool hosts are not enclaves. **Costs** the most engineering here: an
enclave has no network and no disk, so git over HTTPS is proxied over vsock and the warm cache
lives outside it as ciphertext. Every release changes the measurement, so every release
rewrites every tenant's key policy — an ops tax and a downgrade risk. **Smallest proof:** one
enclave unwraps a data key with its attestation document and decrypts one cached record; flip
a byte in the image and KMS must refuse.

### (e) No shared tier — bring your own account

**Maps to** 207a's self-managed path, generalised. We become a control plane that provisions
the same binary into the customer's AWS or Fly account through a role they grant with an
external id, and never hold their content at all. Their GitHub App, their bot, their keys.
**Covers** everything but the metadata we need for billing and support and our own supply
chain, since our binary still runs there. **Costs** the slowest onboarding, a per-customer
always-on floor, and a support story where we cannot see what broke. **Breaks** the shared bot
identity and tier 1's economics. **Smallest proof:** `flywheel init` into a fresh customer
account reaching a first green tick, with an egress check showing the control plane received
no record body.

### (f) Content minimisation as a contract

**Maps to** 217's declaration and 205's clone. The shared tier clones state fully and
blueprints as a blobless partial clone sparse-checked to the manifest, the claims and
`flywheel/`. It never clones a built repository, because its declaration names none. **Covers** source code absolutely, and books and specs, by making them absent rather than
protected. **The gap it exposes is the important one:** triage reads the raw material a
capture points at (dispatch model §4), and that is the most sensitive content the customer
has. A shared ticker that triages is a shared ticker holding meeting transcripts. Minimisation
is only honest if triage runs on a host serving one organization. **Costs** nothing and saves
clone time. **Breaks** nothing. **Smallest proof:** a ticker whose clone spec is enforced at
read time, where a path outside the declared set is a refusal in the run record and not a log
line.

## 4. Three designs

**Design A — trust the service.** Options (a) and (f): a key per organization over every store
the shared tier touches, the cache sealed and unwrapped only for a tick, minimised sparse
clones, no code and no raw material on any shared host, triage and all work on pool hosts that
serve one organization and are destroyed at retire (240, 241). Chat runs through the
platform's bot, so the customer places no secret at all.

**Design B — your key, our compute.** Design A with the key moved into the customer's account
under a revocable grant (b), plus (d) where they want our staff out of the trust set rather
than merely holding a switch, and (c) as a declaration if their concern is GitHub too.

**Design C — your account, our control plane.** Option (e). We provision the binary into their
account, hold no content, and see organization names, health and billing counters. Their App,
their bot, their pools, their bill.

| | A | B | C |
|---|---|---|---|
| stolen disk or snapshot | yes | yes | their problem |
| co-tenant | yes: own key, own role, own pool host | yes | no co-tenant exists |
| our staff | no | revocable; absolute with (d) | **yes** |
| compromised ticker mid-tick | no: that tenant, that tick | no, unless (d) | nothing shared to compromise |
| GitHub and repo readers | no; only with (c) | no; only with (c) | no; only with (c) |
| customer must do | invite a bot | create a key and grant it | run an AWS account and an App |
| cost to serve | cents per tenant per month | plus a KMS call per tick | a per-customer floor |
| ops burden on us | one key per tenant | key homes, revocation paths | per-customer provisioning, blind support |
| fits tiers | 1 and 2 | 2 and 3 | 3 |

**Recommended default for the hosted tier: Design A.** A key per organization over every warm
store, unwrapped only while that organization's plan is evaluated, plus minimisation and pool
and triage isolation. It answers what a customer actually asks — what sits on your disks
between ticks and who can read it — without asking them to do anything. Design B is then a
key-provider swap, not a re-architecture.

## 5. Customer journeys

**The solo developer who adds a cloud agent.** You run the flywheel on your own machine and
sign in with GitHub device flow; nothing leaves the laptop. You want captures read and chat
answered while it sleeps, so you open a hosted account and turn on the cloud agent. What we
can say: your code never goes to it, because the machine that reads your plan is declared to
hold no repository at all. Your transcripts never go to it either — they stay on your machine,
and the session that reads them runs there. Your plan and your decisions do go, and everything
we hold about you is encrypted at rest under a key that exists for your organization alone and
is unwrapped only while your plan is evaluated. Turn the cloud agent off and the same binary
keeps ticking on your laptop.

**The team on the hosted tier.** You sign in, we create the two repositories under your own
GitHub account, and you invite our bot to a channel. What we can say: everything we hold about
you is encrypted at rest under a key that exists for your organization alone, and it is
unwrapped only while your plan is being evaluated — a stolen disk or a leaked snapshot of ours
is ciphertext. Your code only ever exists on a machine created for your organization and
destroyed when the work ends. Your raw capture material is read only on your own machine or on
such a machine, and never on anything shared. Your repositories sit on GitHub under GitHub's
own encryption, the same as every other repository you own.

**The enterprise with its own AWS account.** You create the key in your account and grant us
its use. What we can say: everything above, plus the key is yours — we cannot use it once you
revoke it, and revocation stops us reading anything, anywhere, within minutes, with no ticket
and no waiting on a deletion job. Every use of your key is logged in your account, not ours.
If you want our staff out of the picture rather than merely revocable, we run your ticks in an
enclave that releases your key only to an attested image. If you would rather we held nothing
at all, we provision the whole thing into your account and keep only your name and your bill.

**The upgrade path.** None of this is a migration. Every tier seals the same stores the same
way and what changes is where the key lives and who may unwrap it. Move from our key to yours
and we re-wrap the data keys and leave your history alone. Move to your own account and the
binary, the manifest and the repositories are the ones you already have. What you give up is
our ability to help you debug, and we will say so rather than ask you for a copy.

## 6. Requirement clauses to add

- **256.** Everything the shared tier keeps between ticks is encrypted at rest under a key
  naming one organization: the clone cache, the body of every queued capture, every store
  holding its content. A store keyed per filesystem, volume, queue or table holds no
  organization's content in the clear; it is sealed under that key inside the store.
- **257.** The organization's key is unwrapped only for the duration of a tick and only by the
  role that runs it. The plaintext data key exists in a process evaluating that organization's
  plan and at no other time.
- **258.** The cache is a projection and its loss costs a clone. An organization idle past a
  stated time keeps nothing warm, and its next tick re-clones.
- **259.** A shared host assumes a role scoped to one organization for the duration of that
  organization's tick, so one compromised credential reaches one organization.
- **260.** A key that is revoked or unreachable fails closed. No tick proceeds on state it
  cannot open, every host of that organization shows one attention line naming the key and
  since when, running work is not interrupted, and nothing is kept unencrypted as a fallback.
- **261.** What we hold and under which key is a stated fact of the tier, rendered on the
  settings form: which stores hold the organization's content, which key opens them, which
  role may use it, and when the cache was last evicted.
- **262.** The shared tier reads the manifest, the register, the leases, the sink's mark and
  the machinery's prefix and nothing else. The clone is partial and sparse to exactly that
  set, and a read outside it is a refusal in the run record.
- **263.** Raw material a capture points at is never read on a host serving more than one
  organization. Triage runs on the operator's own machine or on a pool host, and the
  manifest's raw store is reachable only from those.
- **264.** Code is never on a shared host. A built repository is cloned only into a pool host
  serving one organization (241), and retire destroys that host and its disk (240).
- **265.** An organization may declare that the machinery writes its state records as
  envelopes under its key; paths, file names and commit metadata stay plaintext, because
  `list`, the count and push-as-CAS read only those. It is a declaration, never the default.
- **266.** Under that declaration the blueprints repository stays plaintext except the
  machinery's own prefix, where captures and signals are envelopes under the same key. The
  manifest, the book, the claims and the map are read by people and are never encrypted.
