# Encryption and tenancy — a brainstorm

What we can honestly tell a customer about where their content sits, who can read it, and
what they can revoke. Sources: `cloud.md`; `requirements.md` A.10–A.12, 157, 203–208,
216–217k, 239–242, A.32; `models/dispatch/model.md` §1–§5. Platform facts carry the date
read.

## 1. Threat model

**Who the customer is protecting against.** Our own staff, who hold production access to
the shared tier. A co-tenant sharing the batch ticker's process, cache volume and
capture queue. A compromised shared component — ticker, capture receiver, queue drain —
reached through our supply chain rather than theirs. The cloud provider, at the level of
a disk, a snapshot or a subpoena. GitHub, and everyone GitHub's permissions admit: an
org member, a contractor, a leaked token.

**What is at stake, worst first.** Raw capture material — meeting transcripts, support
threads, whatever the customer's operations actually say — the only place third parties'
words appear. Source code, in built repositories. Plan content: decision titles,
rationale and the register, which is the roadmap in readable form. Chat content on the
sink. The manifest, which names secrets but holds none.

**What is already true and must not be re-promised.** GitHub encrypts git data at rest
with AES-256 under Azure platform-managed keys ([GitHub changelog,
2019-05-22](https://github.blog/changelog/2019-05-22-git-data-encryption-at-rest/)),
which is their key and not the customer's. The App's installation token is scoped to the
listed repositories, short-lived, issued into a place and written nowhere else (207). No
secret travels through the page and no session or dispatch agent holds an operator
credential (251). The dispatcher's declaration names no repository and no unit type, so
the shared tier clones no code today (217).

---

## 2. Technical options

### (a) Provider-managed encryption, one key per tenant

**Maps to** every store the shared tier touches: the EFS or volume holding warm clones,
the S3 raw store, the SQS capture queue, the pool host's disk. One customer-managed KMS
key per organization, its key policy naming the tenant, every store bound to it by
encryption context.

**Covers** the cloud provider and a lost disk, and it bounds blast radius to one key,
one organization, one audit trail. It does **not** cover our staff, who can use the key,
nor a compromised ticker, which holds it legitimately. **Costs** nothing measurable in
latency and about a dollar per key per month; key quotas per account bite near ten
thousand tenants. **Breaks** nothing.

**Smallest proof.** One organization, one key, its alias deleted: the tick must fail
closed with a named attention line, not retry silently.

### (b) Customer-managed key by grant (BYOK)

**Maps to** the same stores, with the key living in the customer's own AWS account. We
hold a grant for `Decrypt` and `GenerateDataKey` under an encryption context naming the
organization. The customer calls `RevokeGrant` and our access ends everywhere at once,
usually under five minutes, since grants are eventually consistent ([AWS KMS docs, read
2026-09-07](https://docs.aws.amazon.com/kms/latest/developerguide/grant-delete.html)).

**Covers** our staff over time, because the customer ends it without asking us, and it
logs every use in their own account. It does not cover a live compromise while the grant
stands. **Costs** one KMS round trip per data key; caching that key hides the latency
and blunts revocation to the cache lifetime, which is the honest tradeoff and belongs in
a clause rather than a config file. **Breaks** nothing on GitHub's side.

**Smallest proof.** Revoke mid-run: the tick refuses within the stated cache lifetime,
the status view names the key, running work is not killed.

### (c) Client-side encryption of the state repository's contents

**Maps to** B.1's read and write against the C.2 layout, and to the machinery's own
prefix in blueprints (203). Every record is written as a sops/age envelope under the
organization's key: self-managed, the operator's age recipients on their hosts; hosted,
a data key wrapped by the tenant's KMS key. sops takes both backends at once and M-of-N
key groups, so a lost KMS does not lose history ([sops, read
2026-09-07](https://github.com/getsops/sops)).

**What stays plaintext, and why.** Paths and file names, because `list` is a prefix
listing and the decision count is read from names — put the number in the name and the
count survives. Commit metadata, because push-as-CAS is a compare-and-swap on a ref
(162) and never looks inside a blob. The manifest, the book, the claims and the map,
because people read and review them and ciphertext would destroy the one artifact the
customer is meant to read. Everything else — record bodies, thread entries, response
records, lease bodies, the rendered status page, captures and signals under `flywheel/`
— is ciphertext.

**Covers** GitHub, and everyone GitHub's permissions admit. In the hosted tier it does
**not** cover us, because the ticker holds the key to do its job; it covers us only with
(d), or when the key is the operator's own.

**Costs** an unwrap per tick and a per-file envelope, which is sub-millisecond work.
**Breaks** almost nothing that matters, and that is the finding: the state repository is
the machinery's alone, with nothing a person writes in it (203), so nobody reviews its
diffs, nobody searches it on GitHub, and rendering the book is untouched. What it does
break is our own support, since we can no longer read a customer's state to debug it.

**Smallest proof.** Run the C.2 conformance suite against an encrypting read/write
binding, S13's stale lease and the count included; then `git grep` a fresh clone and
find only names.

### (d) Confidential compute for the shared tier

**Maps to** the batch ticker, run in a Nitro Enclave with each tenant's key policy
conditioning `Decrypt` on `kms:RecipientAttestation:ImageSha384`, so the key is released
only to the attested image ([AWS KMS docs, read 2026-09-07](https://docs.aws.amazon.com/kms/latest/developerguide/conditions-nitro-enclaves.html)).

**Covers** our staff and a compromised host, for state. It does not cover code, because
pool hosts are not enclaves. **Costs** the most engineering of anything here: an enclave
has no network and no disk, so git over HTTPS is proxied over vsock by the parent and
the warm mirror lives outside as ciphertext. Every release changes the measurement, so
every release rewrites every tenant's key policy — an ops tax and a downgrade risk.

**Smallest proof.** One enclave unwraps one organization's data key with its attestation
document and decrypts one record; flip a byte in the image and KMS must refuse.

### (e) No shared tier — bring your own account

**Maps to** 207a's self-managed path, generalised. We become a control plane that
provisions the same binary into the customer's AWS or Fly account through a role they
grant with an external id, and never hold their content at all. Their GitHub App, their
bot, their keys.

**Covers** everything except the metadata we still need for billing and support —
organization names, tick counts, error classes — and our own supply chain, since our
binary still runs there. **Costs** the slowest onboarding, a per-customer always-on
floor, and a support story where we cannot see what broke. **Breaks** the shared bot
identity and tier 1's economics entirely.

**Smallest proof.** `flywheel init` against a fresh customer account reaching a first
green tick, with an egress check showing the control plane received no record body.

### (f) Content minimisation as a contract

**Maps to** 217's declaration and 205's clone. The shared tier clones state fully and
blueprints as a blobless partial clone sparse-checked to the manifest, the claims and
`flywheel/`. It never clones a built repository, because its declaration names none.

**Covers** source code absolutely, and books and specs, by making them absent rather
than protected. **The gap it exposes is the important one:** triage reads the raw
material a capture points at (dispatch model §4), and that is the most sensitive content
the customer has. A shared ticker that triages is a shared ticker holding meeting
transcripts. Minimisation is only honest if triage runs on a host serving one
organization. **Costs** nothing and saves clone time. **Breaks** nothing.

**Smallest proof.** A ticker whose clone spec is enforced at read time: a path outside
the declared set is a refusal in the run record, not a log line.

---

## 3. Three designs

**Design A — trust the service.** The shared batch ticker holds the tenant's key and
reads plaintext state. Options (a) and (f): one KMS key per organization on every store,
sparse minimised clones, no code and no raw material on the shared tier, triage and all
work on pool hosts that serve one organization and are destroyed at retire (240, 241).
Chat runs through the platform's bot, so the customer places no secret at all.

**Design B — your key, our compute.** Design A plus (b) and (c): records are envelopes
on GitHub, the key lives in the customer's account, we hold a revocable grant, and the
raw store is theirs. Optionally (d), which is what removes our own staff from the trust
set rather than merely handing the customer a switch.

**Design C — your account, our control plane.** Option (e). We provision the binary into
their account, hold no content, and see organization names, health and billing counters.
Their App, their bot, their pools, their bill.

| | A | B | C |
|---|---|---|---|
| cloud provider, lost disk | yes | yes | their problem |
| co-tenant | yes (own key, own pool host) | yes | no co-tenant exists |
| GitHub and repo readers | no as drawn; yes once (c) ships in it | **yes** | only with (c) |
| our staff | no | revocable; absolute with (d) | **yes** |
| compromised shared component | code and raw material only | plus state, with (d) | nothing shared |
| customer must do | invite a bot | create a key, grant it, hold a raw store | run an AWS account and an App |
| cost to serve | cents per tenant per month | plus a KMS call per tick | a per-customer floor |
| ops burden on us | one key per tenant | key homes, rotation, fail-closed paths | per-customer provisioning, blind support |
| fits tiers | 1 and 2 | 2 and 3 | 3 |

**Recommended default for the hosted tier: Design A, with option (c) shipped in it.**
Write the envelopes from day one under a key the service holds per organization. It
costs almost nothing, because the state repository is machinery-only and no human
workflow reads it, and it is what makes the plain sentence "your state and your captures
are ciphertext on GitHub" true for every customer rather than only for the ones who buy
an enterprise tier. Design B is then a key-provider swap, not a re-architecture, and
Design C stays the answer for customers whose policy forbids our holding anything.

---

## 4. Customer journeys

**The solo developer who adds a cloud agent.** You start on your own computer and
nothing leaves it. You want captures read and chat answered while your laptop sleeps, so
you turn on the cloud agent. What we can say: your code never goes to it, because the
machine that reads your plan is declared to hold no repository at all. Your meeting
transcripts never go to it either — they stay on your machine, and the session that
reads them runs on your machine. What does go is your plan and your decisions, written
as ciphertext under a key named for you. Turn the cloud agent off and nothing changes;
the same binary keeps ticking on your laptop.

**The team on the hosted tier.** You sign in with GitHub, we create the two repositories
under your own account, and you invite our bot to a channel. What we can say: everything
we store about you is encrypted with a key that exists for your organization and no
other, and every use of it is logged. When your team approves work we create a machine
that belongs only to you, clone your code onto it, and destroy the machine and its disk
when the work ends. Your source code is never on a machine shared with another customer,
and the records on GitHub are ciphertext, so a contractor with read access to your
repositories sees file names and dates and nothing else.

**The enterprise with its own AWS account.** You create the key in your account and
grant us its use. What we can say: your key, which we cannot use once you revoke it,
encrypts everything we store, and revocation stops us reading anything anywhere within
minutes — no ticket, no request to us, no waiting on a deletion job. Your raw capture
material lives in a bucket you own, and the sessions that read it run on machines in
your account. If you would rather we held nothing at all, we provision the whole thing
into your account and keep only your organization's name, its health and its bill.

**The upgrade path.** None of this is a migration. Every tier writes the same envelopes
from day one and what changes is where the key lives. Move from our key to yours and we
re-wrap the data keys and leave history alone. Move to your own account and the binary,
the manifest and the repositories are the ones you already have. What you lose going up
is our ability to help you debug, because past the point where you hold the key we
genuinely cannot read your state, and we will say so rather than ask you for a copy.

---

## 5. Requirement clauses to add

- **256.** Every record the machinery writes to the state repository is an envelope
  under the organization's key. Its path, its name and its commit metadata stay
  plaintext, because `list`, the count and push-as-CAS read only those.
- **257.** The blueprints repository stays plaintext except the machinery's own
  prefix: captures and signals under `flywheel/` are envelopes under the same key.
  The manifest, the book, the claims and the map are read by people and are never
  encrypted.
- **258.** An organization's key has one of three homes and the manifest names
  which: recipients on the operator's own hosts, a key the service holds for that
  organization alone, or a key in the customer's account reached by a grant the
  customer can revoke.
- **259.** A key that is revoked or unreachable fails closed. No tick proceeds on a
  record it cannot read, every host of that organization shows one attention line
  naming the key and since when, work already running is not interrupted, and
  nothing is ever written in plaintext as a fallback.
- **260.** A key the service holds names one organization and is used for no other.
  A key policy or recipient set naming a second organization is refused at fetch.
- **261.** The shared tier reads the manifest, the register, the leases, the sink's
  mark and the machinery's prefix, and nothing else. The clone is partial and
  sparse to exactly that set, and a read outside it is a refusal in the run record.
- **262.** Raw material a capture points at is never read on a host serving more
  than one organization. A triage session runs on the operator's own machine or on
  a pool host, and the manifest's raw store is reachable only from those.
- **263.** Code is never on a shared host. A built repository is cloned only into a
  pool host serving one organization (241), and retire destroys that host and its
  disk (240).
- **264.** What the service can read is a stated fact of the tier, rendered on the
  settings form beside the key: which stores hold the organization's content, under
  which key, and who may use it.
- **265.** Changing key material is a chore. Adding or removing a recipient, or
  moving the key's home, re-wraps data keys and rewrites no history; it is an
  effect with a proof and is repeatable.
