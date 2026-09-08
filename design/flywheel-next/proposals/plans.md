# Plans — the commercial ladder over the tiers

The hosted physical design (hosted-design.md) settles four tiers by what
exists on the service side. Plans are how those tiers are sold: a plan is a
Frontegg plan whose features are the `fw.ff.*` entitlements plus a few stated
limits, billed by Stripe, read by the flywheel only through the identity token
and the SDK. Self-managed has no plan object at all: it is the binary on your
computer, and every flag stands at its definition default there (250).

A plan never authorizes. Permissions come from roles (248, 249); a plan hides a
surface and meters a quantity. Exceeding a limit is one attention line and a
refused add, never a stopped loop.

## The ladder

| plan | tier | who | what it unlocks | limits |
|---|---|---|---|---|
| **Free** | 0 · your computer | one person, own hardware | the binary, GitHub device flow, your own GitHub App and chat bot, every package, every surface | none we enforce; nothing runs on our side |
| **Hobby** | 1 · cloud agent | one person who closes the laptop | the service's bot and App, captures and chat while your machines sleep, the plan in Slack or Discord, the page at a served name | 1 organization · 1 member · no pools |
| **Pro** | 1 + 2 | one person with more to build | Hobby plus pools with an included hour allowance and metered overage, the store, the book view, presets | 3 organizations · 1 member · pool hosts up to 8 GB · included pool hours |
| **Team** | 2 · pools | a team | Pro plus members with roles, ownership and assignment, the management console, identity administration, pools up to 32 GB, priority ticks | per-seat · unlimited organizations · pooled pool hours |
| **Enterprise** | 3 · your account | a company with a security policy | Team plus your own AWS account by OIDC federation, SSO and SCIM through your identity provider, a dedicated dispatcher function, audit export, private pool images, an SLA | custom |

Prices are marketing's; the requirement is the ladder and what each rung
unlocks, not the number on it.

## Entitlements

The features list in identity.yaml grows to carry the ladder. Each is a flag,
`default: off`, targeted per account by the plan:

- `fw.ff.cloud-agent` — a host of tier 1 may be added (Hobby and up)
- `fw.ff.pools` — a pool may be declared (Pro and up)
- `fw.ff.store` — the package store (Pro and up)
- `fw.ff.book-view`, `fw.ff.explore` — default on, every plan
- `fw.ff.management-console` — the console beyond one host (Team and up)
- `fw.ff.members` — roles, invite, assignment, ownership (Team and up)
- `fw.ff.federation` — the organization's key and stores in its own account (Enterprise)
- `fw.ff.sso` — enterprise SSO and SCIM on the account (Enterprise)
- `fw.ff.dedicated-dispatcher` — a function of its own (Enterprise)

Limits are plan metadata, not flags: `organizations`, `members`,
`pool_hours_included`, `pool_memory_max`. The tool server reads them beside the
flags and refuses the add that would exceed one, with the reason.

## Presets — the one-screen cloud agent

Adding a cloud agent asks nothing about routers or runners: the tier fixes
both (the platform router at the served name, the in-process runner at bound
0). The one screen asks what the agent should listen to and speak through:

- **Chat**: Slack · Discord · none
- **Meetings**: Granola · Notion · a folder of transcripts · none
- **Captures**: GitHub (already installed with the App) · Datadog · a webhook

A preset is a **bundle** package: a named set of parts with their
configuration defaults, offered as one choice on that screen. The shipped
presets are *Slack + Granola*, *Discord + GitHub only*, and *Everything*; a
bundle installed on a host is the same install decision as its parts, one
decision for the set. An organization may publish its own bundles in the
store. Routers and runners are chosen only on a machine of yours or an adopted
host, under the advanced disclosure.

## Journeys the ladder implies

1. **Free → Hobby**: sign in to the hosted account with the same GitHub
   identity; the service creates the account, invites the same usernames,
   carries every address (247a); one cloud agent is added from a preset. The
   laptop keeps its place as a host.
2. **Hobby → Pro**: the pools flag turns on; the pool form appears under
   Hosts; the first pool declares an image and a bound within the plan's
   memory ceiling.
3. **Pro → Team**: members and roles turn on; the console appears; the
   operators list becomes derived from the account.
4. **Team → Enterprise**: the federation journey in security.md §5 — one role
   in your account trusting our issuer; the key and stores move; nothing is
   re-keyed by hand.
