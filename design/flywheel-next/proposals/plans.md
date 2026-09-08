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
| **Hobby** | 1 · cloud agent | one person who closes the laptop | the service's bot and App, captures and chat while your machines sleep, the rail in Slack or Discord, the page at a served name. No API key needed: chat is buttons and slash commands, free text is interpreted in the page, captures are triaged in a daily batch | 1 flywheel · 1 member · no pools · captures included per month on the small model class |
| **Pro** | 1 + 2 | one person with more to build | Hobby plus pools with an included hour allowance and metered overage, the package store, the book view, presets, and immediate triage and free text in chat | 3 flywheels · 1 member · pool hosts up to 8 GB · included pool hours · included model budget |
| **Team** | 2 · pools | a team | Pro plus members with roles, ownership and assignment, the management console, identity administration, pools up to 32 GB, priority ticks, and a model class raisable per type and stage | per-seat · unlimited flywheels · pooled pool hours |
| **Enterprise** | 3 · your account | a company with a security policy | Team plus your own AWS account in either shape — stores only, or stores and compute with dedicated dispatcher and pools created from the console — SSO and SCIM through your identity provider, audit export, private pool images, an SLA | custom |

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
- `fw.ff.federation` — tier 3, both shapes: the flywheel's key and stores in
  its own account, and the binary provisioned into that account behind the
  control plane (Enterprise)
- `fw.ff.sso` — enterprise SSO and SCIM on the account (Enterprise)
- `fw.ff.dedicated-dispatcher` — a function of its own (Enterprise)
- `fw.ff.dedicated-compute` — the console's dedicated compute options under tier
  3's second shape, created in the customer's account by the deployer
  (Enterprise)

Limits are plan metadata, not flags: `flywheels`, `members`,
`pool_hours_included`, `pool_memory_max`, `captures_included`, `model_class` and
`model_usage`. The tool server reads them beside the flags and refuses the add
that would exceed one, with the reason.

## Model cost

The customer's own model key is welcome on every hosted plan and required on
none. Each plan includes a budget on the small model class for the two jobs the
dispatcher runs inside a tick — reading a capture and answering a message —
stated as a count of captures and messages a month; usage past the budget is
metered through Stripe like any other overage, and a customer who places their
own key is metered on none of it.

**Hobby is cheap to run because it spends almost no model.** Its chat is
structured. A decision carries its answers as buttons, and free text in chat is a
slash command with its arguments (`/fw yes 412`, `/fw capture <text>`), so
answering, capturing and delivering the rail cost no model call at all. Free-text
interpretation happens in the page instead, where the model running in the
browser does the interpreter's job at no cost to us (216a). A capture arriving
from a GitHub webhook or a chat interaction is written immediately, which needs
no model; a self-contained capture is triaged in one daily batch at the sweep, on
the small model class, inside the included budget. Placing your own key unlocks
immediate triage and free text in chat on Hobby; both are included from Pro up.

**The model class per job is a plan fact.** Small on Hobby and Pro. On Team and
Enterprise it is raisable per unit type, per elaboration type and per stage, so a
stage that reviews code may run a larger class than the stage that writes it
(285). The plan states the ceiling and the type states the choice within it.

A budget spent is one attention line and a slower cadence, never a stopped loop:
free text falls back to the page's browser model and self-contained captures to
the daily batch. The runners heading on a host's detail shows which key that host
uses and the month's model spend beside the pool hours, and the tier statement
names which model provider sees rail text and messages.

## Enterprise — your account, in two shapes

Tier 3 is "your account", and the management console chooses between two shapes.

**Stores only.** The key, the capture queue, the warm cache and the pool image
live in your AWS account, and our compute reaches them by assuming the role you
grant. This is design B in security.md §4, and it is today's federation journey.

**Stores and compute.** The binary itself is provisioned into your account by our
deployer through that same role, and nothing of ours runs there. What stays on
our side is the control plane alone: a **registry** of flywheel names, tier,
health and counters; the **deployer**, which applies the stack through your role
and stamps our binary's version; and **identity**, the Frontegg environment
holding the redirect entry for your host's served name. The chat application is
still ours, which is what keeps rail lines arriving from one bot. This is design
C in security.md §4.

Enterprise includes both. Under the second shape the console offers dedicated
compute, created in your account by the deployer through the granted role, each
option stated with what it changes:

| option | what it changes |
|---|---|
| Dispatcher as a function | The default. Invoked per tick, fifteen minutes, nothing between invocations. Discord free text stays a slash command |
| Dispatcher long-lived, on Fargate or EC2 | Holds the Discord gateway socket, so plain free text in a channel returns. No fifteen-minute ceiling on a tick |
| Pools on microVMs | The default. Fast start, a stated maximum lifetime, the disk under the platform's key |
| Pools on Fargate | An attached volume under your own key, for a tier statement that must name it |
| Pools on EC2 | No lifetime ceiling, so a session that runs for days needs no fallback placement |

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
decision for the set. A flywheel may publish its own bundles in the
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
   re-keyed by hand. The same role is what the deployer uses if you take the
   second shape and move the compute too.
