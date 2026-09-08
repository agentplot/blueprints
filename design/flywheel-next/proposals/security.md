# Encryption and tenancy — a brainstorm

What we can honestly tell a customer about where their content sits, who can read it, and what
they can cut off. Sources: `cloud.md`; `requirements.md` A.10–A.12, 157, 203–208, 216–217k,
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

**What we keep between ticks.** Per instance: a full clone of the state
repository and a blobless partial clone of blueprints sparse-checked to the manifest, the
claims and `flywheel/`, ten to fifty megabytes together. One scheduler entry naming the
earliest time that instance's tick could change anything (273). Queued captures, the
caller's retry buffer and not state (271). No code, and no raw material a capture points at:
a transcript stays on the customer's own machine or in a store they own.

**Which stores hold it, and under whose key.** The warm copy is one S3 object per
instance, a git bundle of two sparse shallow clones downloaded to the tick's scratch disk
and uploaded back; there is no shared filesystem and no VPC. Captures wait on one SQS FIFO
queue per instance, whose message group id is the instance, so the queue is also what
admits one tick of an instance at a time. The due time is one one-shot scheduler entry
per instance and holds times and ids by construction, because ticking rebuilds it. Each
of those stores is encrypted under a KMS key tagged with the instance, and the match is
written as the tier role's own policy over every key and object of the account — the
resource's tag equal to the session's principal tag — so no key policy names a role and no
role is added per flywheel. The receiver in front of the queues holds an encrypt-side
grant and no grant that decrypts. A queued capture's body — a chat message, a webhook
payload, or a pointer to raw material held elsewhere — is encrypted the same way, so the
queue holds nothing readable without that instance's key. A pool host's own disk is the
one exception: the platform isolates it per host and destroys it at terminate under the
platform's key, and an instance that must have its own key on that disk takes the
container-task fallback with a volume under it.

**What the dispatcher itself runs.** It is not a pure state machine. It runs the interpreter
that answers a chat message, one bounded call per message, and the triage of a self-contained
capture whose whole content is already in the queue, both bounded per tick with the remainder
carried to the next (269). What it never does is follow a capture's pointer into the raw store
(263), and it never runs an elaboration or a construction session; those need a machine of the
customer's own or a pool host. So rail text and chat messages pass through the model the tier
role reaches, and transcripts and code do not.

**Unwrapped for a tick and no longer.** The ticker assumes the instance's role, calls
`Decrypt` once, opens that instance's directory, evaluates its rail, writes its effects
and drops the key. The plaintext data key exists in a process evaluating that instance's
rail and at no other moment.

**What an attacker actually gets.** From a stolen disk, a lost volume or a leaked snapshot,
ciphertext with no data key on it. From a stolen backup of the queue or the index, ids and
timestamps. From a compromised ticker process while it runs, that instance's plaintext for
that tick and any other instance ticking in the same process. That is the residual.

**How the residual shrinks, in order of cost.** Evict on idleness and re-clone next tick, so a
sleeping tenant has nothing warm to steal; the price is a cold tick of a few seconds against a
warm one of a few hundred milliseconds, paid by a tenant who was idle anyway. Give each
instance its own role and its own tick boundary, so one compromised credential reaches one
tenant. Run the ticker in a Nitro Enclave with the key policy conditioned on attestation
(option d), which removes our staff and a compromised image entirely. Move the key and the
warm stores into the customer's own account behind a federated role (option b), so the cut-off
is theirs to make and not our promise.

**What this does not change.** GitHub holds both repositories in plaintext, as it holds every
repository on the platform, under their key. A customer who needs that changed wants (c).

## 3. Technical options

### (a) Provider-managed encryption, one key per tenant

**Maps to** §2 exactly: one customer-managed KMS key per instance over the clone cache,
the body store, the queue, the due index and the pool host's disk. Each key and each object is
tagged with its instance, and the key's policy admits a principal only when the principal's
session tag equals that tag, so the dispatcher's per-tier role carries the instance as a
session tag and no count of roles bounds the design. **Covers** the cloud provider, a lost disk and a stolen snapshot,
and bounds blast radius to one key and one audit trail. It does **not** cover our staff, who
can assume the role, nor a compromised ticker mid-tick. **Costs** nothing measurable in
latency and about a dollar per key per month; key quotas bite near ten thousand tenants.
**Breaks** nothing. **Smallest proof:** delete one instance's key alias, and its tick must
fail closed with a named attention line rather than retry.

### (b) The customer's own account by OIDC federation

**Maps to** the same stores, moved wholesale into the customer's own AWS account: the key, the
clone cache, the capture queue and the pool image. The customer creates one IAM role there
whose trust policy accepts our OIDC issuer with a subject naming their flywheel. Each tick
assumes that role with a per-tick web-identity token, so we store no credential of theirs and
there is nothing to rotate or leak. **Covers** our staff over time, because the customer ends
it without asking us — deleting the role ends every path at once — and every use of the key is
logged in their account, not ours. It does not cover a live compromise while the role stands.
**Costs** one `AssumeRoleWithWebIdentity` and one KMS round trip per tick, which the tick
already absorbs; caching the session across ticks would blunt the cut-off to the cache
lifetime, so keep it per tick. **Breaks** nothing. **Smallest proof:** delete the role
mid-run, and the next tick refuses, the status view names the role, and running work is not
killed.

### (c) Client-side encryption of the state repository's contents — an optional upgrade

**Maps to** B.1's read and write against the C.2 layout, and to the machinery's own prefix in
blueprints (203). An instance may declare that records are written as sops/age envelopes
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
always-on floor, and a support story where we cannot see what broke. The chat application
stays ours even here, so rail lines still arrive from one bot and 277 holds; what moves is the
binary, the keys and the App. **Breaks** tier 1's economics, which is why it is Enterprise's second shape and never a rung of
its own. **Smallest proof:** `flywheel init` into a fresh customer
account reaching a first green tick, with an egress check showing the control plane received
no record body.

### (f) Content minimisation as a contract

**Maps to** 217's declaration and 205's clone. The shared tier clones state fully and
blueprints as a blobless partial clone sparse-checked to the manifest, the claims and
`flywheel/`. It never clones a built repository, because its declaration names none. **Covers** source code absolutely, and books and specs, by making them absent rather than
protected. **The gap it exposes is the important one:** triage reads the raw material a
capture points at (dispatch model §4), and that is the most sensitive content the customer
has. A shared dispatcher that follows those pointers is a shared dispatcher holding meeting
transcripts. Minimisation is only honest if pointer-following triage runs on a host serving
one instance; the triage of a capture whose whole content is already in the queue carries
no pointer and runs in the tick (269). **Costs** nothing and saves
clone time. **Breaks** nothing. **Smallest proof:** a ticker whose clone spec is enforced at
read time, where a path outside the declared set is a refusal in the run record and not a log
line.

## 4. Three designs

**Design A — trust the service.** Options (a) and (f): a key per instance over every store
the shared tier touches, the cache sealed and unwrapped only for a tick, minimised sparse
clones, no code and no raw material a capture points at on any shared host, raw-material
triage and every elaboration and construction session on pool hosts that serve one
instance and are destroyed at retire (240, 241); the dispatcher keeps the interpreter and
the triage of self-contained captures, which is what makes chat usable with the laptop closed
(269). Chat runs through the
platform's bot, so the customer places no secret at all.

**Design B — your account by federation.** Design A with the key and the warm stores moved
into the customer's account behind one role that trusts our OIDC issuer (b), plus (d) where
they want our staff out of the trust set rather than merely holding a switch, and (c) as a
declaration if their concern is GitHub too.

**Design C — your account, our control plane.** Option (e). We provision the binary into their
account, hold no content, and see instance names, health and billing counters. Their App,
their pools, their bill; the chat application stays ours. Design C is ratified as tier 3's
second shape, stores and compute (268, 276a), and Enterprise includes it beside design B's
stores-only shape. The customer chooses between the two in the management console, and under C
the console also offers the dedicated compute the deployer creates in their account: the
dispatcher invoked as a function or long-lived on Fargate or EC2, and pools on microVMs, on
Fargate or on EC2. A long-lived dispatcher holds the Discord gateway socket, so plain free text
in a channel is answered rather than taken as a slash-command option; pools on EC2 have no
lifetime ceiling.

| | A | B | C |
|---|---|---|---|
| stolen disk or snapshot | yes | yes | their problem |
| co-tenant | yes: own key, own role, own pool host | yes | no co-tenant exists |
| our staff | no | ended by deleting the role; absolute with (d) | **yes** |
| compromised dispatcher mid-tick | no: that tenant, that tick | no, unless (d) | nothing shared to compromise |
| GitHub and repo readers | no; only with (c) | no; only with (c) | no; only with (c) |
| customer must do | invite a bot | create one role trusting our issuer | run an AWS account and an App |
| cost to serve | cents per tenant per month | plus an assume-role and a KMS call per tick | a per-customer floor |
| ops burden on us | one tagged key per tenant | key homes, federation trust per customer | per-customer provisioning, blind support |
| fits tiers | 1 and 2 | 2 and 3 · tier 3's first shape | tier 3's second shape |

**Recommended default for the hosted tier: Design A.** A key per instance over every warm
store, unwrapped only while that instance's plan is evaluated, plus minimisation and pool
and triage isolation. It answers what a customer actually asks — what sits on your disks
between ticks and who can read it — without asking them to do anything. Design B is then a
change of the key's home and one role's trust policy, not a re-architecture.

## 5. Customer journeys

**The solo developer who adds a cloud agent.** You run the instance on your own machine and
sign in with GitHub device flow; nothing leaves the laptop. You want captures read and chat
answered while it sleeps, so you open a hosted account and turn on the cloud agent. What we
can say: your code never goes to it, because the machine that reads your rail is declared to
hold no repository at all. Your transcripts never go to it either — they stay on your machine,
and the session that reads them runs there. Your rail and your decisions do go, and everything
we hold about you is encrypted at rest under a key that exists for your instance alone and
is unwrapped only while your plan is evaluated. Turn the cloud agent off and the same binary
keeps ticking on your laptop.

**The team on the hosted tier.** You sign in, we create the two repositories under your own
GitHub account, and you invite our bot to a channel. What we can say: everything we hold about
you is encrypted at rest under a key that exists for your instance alone, and it is
unwrapped only while your rail is being evaluated — a stolen disk or a leaked snapshot of ours
is ciphertext. Your code only ever exists on a machine created for your instance and
destroyed when the work ends. Your raw capture material is read only on your own machine or on
such a machine, and never on anything shared. Your repositories sit on GitHub under GitHub's
own encryption, the same as every other repository you own.

**The enterprise with its own AWS account.** You create one IAM role in your account whose
trust policy accepts our OIDC issuer with a subject naming your instance, and your key,
your cache, your queue and your pool image live there. What we can say: everything above, plus
we hold no credential of yours — each tick assumes your role with a token minted for that tick
— and deleting the role stops us reading anything, anywhere, at once, with no ticket and no
waiting on a deletion job. Every use of your key is logged in your account, not ours.
If you want our staff out of the picture rather than merely revocable, we run your ticks in an
enclave that releases your key only to an attested image. If you would rather we held nothing
at all, we provision the whole thing into your account and keep only your name and your bill —
that is tier 3's second shape, and Enterprise includes it. There the console also chooses your
compute: a long-lived dispatcher if you want plain free text answered in a Discord channel,
pools on EC2 if a session must run for days.

**The upgrade path.** None of this is a migration. Every tier seals the same stores the same
way and what changes is where the key lives and who may unwrap it. Move from our tagged key
to a role in your own account and we re-wrap the data keys and leave your history alone. Move to your own account and the
binary, the manifest and the repositories are the ones you already have. What you give up is
our ability to help you debug, and we will say so rather than ask you for a copy.

## 6. Requirement clauses

Ratified as requirements A.33, clauses 256–267. §4's designs are ratified in
A.34: design A is tiers 1 and 2, design B is tier 3's first shape (276), and
design C is tier 3's second shape (276a).

The clauses that were drafted here are now in `../requirements.md`; the rest of
this file is the narrative behind them.
