# The control plane as an installable product

Two products, one line between them, and the line is a public contract. The
**flywheel binary** is open source: everything a self-managed operator runs.
The **control plane** is commercial: everything that exists on the service side
when the binary is invoked rather than launched. The line is the **invocation
contract**, documented in the open-source repository, and a self-managed host
and a hosted host run the same binary bytes.

The control plane is installable. It ships as a Switchboard composition of cfn
apps and stacks with the tenancy choices as parameters, an identity environment
of the installer's own, billing optional, and the shared chat applications
replaced by the installer's own. A self-hosted control plane is the third shape
of tier 3 and the fourth flavour of Enterprise. It is not marketed and not
offered in the management console; it is sold and installed by us. The first
instance is a willdan-owned control plane deployed in Switchboard.

## 1. The two products

**The flywheel binary — open source, a permissive licence.** Everything a
self-managed operator runs is in it, and nothing is held back to make the
hosted tiers work:

- the machines and the profiles: the statechart definitions, the atoms, and
  every binding that satisfies the state store contract of Part B;
- the page bundle, with the plan console — rail, board, dock — and the
  management console;
- the tool server and its model context protocol endpoint (193, 291, 293);
- the adapters, the runners and the routers (191, 215, 217c);
- the definitions of permissions, roles, features, flags and plans (252), which
  are one set with the template version (208, 224) and are the one place any of
  them is defined;
- the command line: `flywheel init`, `flywheel host`, `flywheel host join`,
  `flywheel capture`, `flywheel map`, `flywheel claims`, the doctor.

A tier-0 organization is the whole of that and nothing else. Free is not a
crippled edition; it is the product with no service side.

**The control plane — commercial, source-available to enterprise customers for
self-hosting.** Everything that exists on the service side:

- the receiver, the stateless front for the capture endpoint (271, 290);
- the per-tier dispatcher packaging, and the roles and tags that scope one
  invocation to one organization (259, 269);
- the queues, one per organization, and their serialization (270, 271);
- the scheduler, one one-shot entry per organization (273);
- the warm cache and page projection stores, and the keys that seal them
  (256, 272, 291);
- the page distribution: the object store and the content distribution at the
  served name (291);
- the registry of organization names, tier, health and counters (276a);
- the deployer, which applies the stack into an organization's own account
  through the role it grants and stamps the binary's version (276a);
- the identity environment and the release-time sync of the binary's
  definitions into it (243, 252);
- the plan and billing integration (279, 282, 294);
- the pool image build and the provisioning of pool hosts (239, 240, 275);
- the shared chat applications (277, 290).

Neither product is a fork of the other. The control plane never reimplements a
machine, never evaluates a guard and never decides anything: it invokes the
binary and holds what the binary cannot hold for itself between invocations.

## 2. The line — the invocation contract

The control plane invokes the same binary in two modes. Both are documented in
the open-source repository, versioned with the template set (208), and are the
whole of what the binary expects from a service side. Anyone may build a
control plane to this contract; ours is the reference implementation.

| mode | what the control plane provides | what the binary returns |
|---|---|---|
| **tick** | the organization's name and its tier; a role session tagged with that organization (259); the warm cache object's locator and its key; the page projection object's locator; the organization's queue and the messages waiting on it in the stated envelope; the scheduler entry now standing for the organization; the identity environment's issuer and the definitions version that environment holds; a model credential carried by the role, or none where the organization placed its own (207, 294); a scratch directory and a stated budget, fifteen minutes on the function placement | the warm cache uploaded; the page projection written as the page sink's delivery (291); the plan delivered to every sink whose mark moved; the shared lines pushed by compare-and-swap (162); each queue message acknowledged or left for retry under its idempotent key (111); one next due time as a scheduler entry, or a deletion when nothing is due (273); the run record; and an exit with the scratch wiped and the data key dropped (269) |
| **request** | the caller's identity token; the organization named in the request's path (205a); a role session tagged with that same organization; the page projection object's locator and its key; the definitions version the environment holds; the bundle's location, where the distribution does not serve it directly | the page bundle, or the projection rendered as the request asks; for a write, one tool call enqueued on the organization's queue, decrypting nothing (271, 291); for a call whose caller lacks membership or the tool's declared permission, a refusal with the reason and a run-record entry naming the identity, the tool and the object (249); never a tick, and never a read of the warm cache (270, 272) |

Five things in that environment are stated shapes rather than free choices, and
they are what a second control plane has to match:

- **the queue message** — one envelope per invoker (a capture, a chat
  interaction, a webhook, a page write, a due time), carrying the
  organization's name, the idempotent key (111), the source, and the body
  sealed under the organization's key (256, 271);
- **the scheduler entry** — one named entry per organization, its name the
  organization's, its target the queue and never the function, one-shot and
  deleted when it completes (273);
- **the cache object** — one object holding a git bundle of two sparse shallow
  clones, the state repository and the blueprints restricted to the manifest,
  the claims and the machinery's prefix (272);
- **the projection object** — one small object holding the status view and the
  rail as data, with each member's page sink and its mark (291);
- **the identity token claims** — the identity, the accounts assigned, the
  roles and the permissions on the organization's account, and the entitlement
  features and their flags (243, 248, 249, 250).

The definitions version is the sixth and the one that couples the two products
in time: the binary ships the definitions, the control plane's release syncs
them into its identity environment by difference, and a binary that names a
permission its environment lacks refuses that tool with the reason (252).

Because the contract is the whole line, **a self-managed host and a hosted host
run the same binary bytes**. Nothing is compiled differently, no feature is
gated at build time, and a hosted host differs from a laptop only in what its
manifest binds: a tier, an identity kind, and a router (217j, 243, 191).

## 3. The control plane as a Switchboard composition

The control plane is a **composition**: one cfn app whose members are the cfn
apps below, each one stack, deployed into an environment through the changeset
executor and parameterized per environment by its app settings row. Installing
it is bringing the composition into an environment; customizing it is the
parameters.

| stack | what it holds | tenancy parameters |
|---|---|---|
| `fw-receiver` | the stateless receiver behind one inbound route per chat platform and one for the git host: signature verification, the platform's liveness answer, the deferred acknowledgement, and the routing by workspace id to the organization's queue. An encrypt-side grant on every organization's key and no grant that decrypts (271, 290) | the chat applications' signing secrets and the git App's webhook secret; the workspace-to-organization map's home; the queue naming convention |
| `fw-dispatcher` | one function per tier, the invoked placement of 269: its execution role, the tier role it assumes, the budget, the scratch, and the model access the role carries | the tier list; per-tier role name; the tag key and the policy condition that matches a resource's organization tag to the session's (259); the budget; which model provider the tier statement names (261) |
| `fw-queues` | one queue per organization, the organization the group id the queue serializes, with its dead-letter queue (270, 271) | the queue home — this account, or the organization's own under tier 3 (276); retention; who holds the encrypt-side and decrypt-side grants |
| `fw-scheduler` | the schedule group holding at most one one-shot entry per organization, targeting that organization's queue, and the daily sweep rule (273) | the group name; the sweep cadence; the grace added to a due time for the stale window (292) |
| `fw-stores` | the warm cache objects, the page projection objects, and one customer-managed key per organization, tagged with it (256, 272, 291) | the key home, one of the three of 267; the tag key; the eviction window (258); whether the projection sits beside the cache or in a store of its own |
| `fw-page` | the object store holding the page bundle and the content distribution at the served name, which fronts the store for the bundle and the dispatcher's request mode for the tool paths, with the certificate and the record for that name (291) | the served name and its zone; the certificate; the release channel the bundle is uploaded on (208) |
| `fw-registry` | the register of organization names, tier, health and counters — the only cross-organization store, and it holds no organization content (276a) | which tiers it admits; the retention on counters |
| `fw-deployer` | the applier of the tier-3 stack into an organization's own account through the role that organization grants, stamping the binary's version (276a) | the granted role's name and the trust issuer; which stack set it applies; the dedicated compute options the console may offer (`fw.ff.dedicated-compute`) |
| `fw-identity-sync` | the release-time sync of the binary's permissions, roles, features, flags and plans into the identity environment, by difference, under the provider's write ceiling, deleting nothing not named as retired and writing no hostname (252) | the environment and its management token; the write ceiling; the Application's id; the retire list |
| `fw-billing` | the payment provider's plan and price objects and the meter that overage is reported on (279, 282, 294) | **optional**: absent when the installer sells nothing, and the ladder's plans are then entitlement targets alone |
| `fw-chat` | the registration and inbound routes of the chat applications the installer owns (277, 290) | which platforms; the installer's own application ids, tokens and signing secrets |
| `fw-pools` | the pool placement — the microVM service, the image registry holding each organization's image, and the fallback container placement — and the image build job (239, 240, 275) | the placement kind; the lifetime ceiling and the fallback; the image home; the memory and vCPU ceiling the plan admits (282) |

Three of those parameters are the tenancy choices, and they are what an
installer actually decides:

- **tier roles and tagging** — how many tier roles exist, what the tag key is,
  and that the match is written as the role's own policy over every key and
  object of the account rather than as a key policy naming a role (259);
- **key homes** — the operator's own hosts, a tagged key in the control plane's
  account, or a key in the organization's own account behind a role that trusts
  the control plane's issuer (267);
- **store homes** — whether the queue, the cache, the projection and the pool
  image live in the control plane's account or the organization's (276).

Switchboard deploys this the way it deploys anything: the composition is an app
in the catalog with `MEMBER#` rows for each stack, a channel per member, one
subscription row per environment, and the app settings row carrying the
parameters above. A version move on a member runs the rebuild executor, the
composition's own `beta` advances, and the environments that follow it update
themselves. The identity block in the manifest is what `frontegg-sync`
reconciles — which is Switchboard's mechanism for exactly the sync `fw-identity-sync`
performs for the flywheel's own definitions.

Two things the composition is deliberately not: it is not a second machinery,
and it is not a second catalogue of the flywheel's objects. Every state the
control plane holds is either a store the contract names or the registry, and
the registry holds names, tiers, health and counters and nothing else.

## 4. The willdan instance, worked

Willdan installs the control plane and runs their own flywheel service for
their own business units.

| what | willdan's | ours |
|---|---|---|
| AWS account | the composition deploys into willdan's Switchboard-connected accounts, through `SwitchboardAccess` like every other app; the control plane's stacks stand in the platform account beside Switchboard's own | none. No account of ours is in the path |
| Identity environment | willdan's Frontegg environment, one per environment class, with the flywheel Application in it beside `platform-nonprod` and Switchboard's own. `fw-identity-sync` writes the flywheel's permissions, roles, features and flags there at release, by difference | none. Our environment holds nothing of willdan's, and their organizations are not accounts under ours |
| Billing | absent. `fw-billing` is not in the member set. The ladder's plans exist as entitlement targets on the Frontegg account — a plan is still a named set of `fw.ff.*` features plus limits, and it still hides and meters — but nothing is charged and no payment provider is bound | none |
| Chat | willdan's own Slack application, installed in willdan's workspace, carrying plan text and interactions and nothing else. Their bot, their tokens, their signing secret | none. The agentplot Slack and Discord applications are not installed anywhere in willdan's workspace |
| Git host connection | willdan's own GitHub App on their organizations (207) | none |
| Organizations served | willdan's business units, each an account in willdan's Frontegg tree, each with its own queue, key, cache, projection and scheduler entry | none. They are not in our registry, and no counter of theirs reaches us |
| The binary | the same released bytes we ship, stamped by their deployer with the version it applied | ours to release; theirs to run |

The willdan instance is the third shape of tier 3 read from the other side.
Under the first two shapes, willdan's stores or willdan's stores and compute sit
in willdan's account while our control plane invokes the binary. Under the
third, the control plane is willdan's too, and there is nothing left of ours in
the running system at all.

## 5. What stays ours

Nothing that runs. Four things, and every one of them is a document, an
artifact or an agreement:

- **the releases** — the binary and the versioned set that travels with it: the
  templates, the map schema and derivation table, the shipped skills and
  deliverables, and the definitions of permissions, roles, features, flags and
  plans (208, 252);
- **the invocation contract** — the document of section 2, kept in the
  open-source repository, versioned with the set, and the thing a second
  control plane is built against;
- **the control plane's source** — commercial, granted to an enterprise
  customer for self-hosting under the terms of their agreement, not published;
- **the commercial relationship** — the sale, the installation, the support,
  and the record of who holds a source grant, which is a record we keep and not
  a process we run.

No process of ours runs in an installed control plane's accounts. No traffic of
its organizations reaches a machine of ours. No key of theirs is reachable by
any credential of ours. Their organizations do not appear in our registry, and
our management console does not know they exist.

## 6. Open questions

1. **Which permissive licence, and what travels under it.** Apache-2.0 with its
   patent grant, or MIT. The harder half is the definitions: permissions,
   roles, features, flags and plans ship in the binary as one set (252) and the
   plan ladder in them names our commercial rungs. Whether the ladder ships
   under the open licence as data an installer overrides, or is carved out of
   the open set and delivered with the control plane, is not settled.

2. **Plan definitions in an open binary against a control plane that has
   none.** A self-managed host has no plan at all and every flag stands at its
   definition default (250, 279). An installed control plane may sell nothing
   and bind no payment provider, so its plans are entitlement targets with no
   price. Three readings are open: the ladder is a definition the binary ships
   and an installer overrides in its own environment; the ladder is an
   organization package (228) and the shipped one is only the default index's
   entry; or the ladder is a stated default the sync writes only where a
   payment provider is bound, leaving the environment's plans empty otherwise.
   The choice decides what `fw-identity-sync` writes on a willdan-shaped
   install and what the plan surface shows there.

3. **The update path when the binary moves ahead of an installed control
   plane.** 252 gives the failure mode — a binary naming a permission the
   environment lacks refuses that tool with the reason — but not the operation.
   Who runs the sync in an installed control plane, on whose release: the
   installer's own deploy of the composition, or a step in the binary's own
   start-up. What an operator sees while their control plane is one set version
   behind. Whether the contract itself carries a compatibility window, so a
   control plane one version behind is stated as supported rather than merely
   observed to work.

4. **Whether an installed control plane reports anything at all.** 288 has the
   binary writing captures about its own operation to the agentplot
   organization's flywheel, on by default on the hosted tiers and opt-in on a
   self-managed host. An installed control plane is neither: its hosts read as
   hosted, and their instrumentation would reach us. Whether it is off by
   default there, redirected to the installer's own flywheel, or a term of the
   agreement is open.
