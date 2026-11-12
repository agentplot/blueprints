# Millpond as a generic signal router

## Framing
- **Millpond** answers: *something happened — what should we do about it?*
- **Timber** answers: *we have a built thing — where should it go?*

Millpond never does the work. It matches signals against rules and produces work items routed to a **lane**.

## Lanes
| Lane | Handler |
|---|---|
| mechanical | Plain job runner (bump/build/test). No model. Could be a Timber job or an agentless Flume place. |
| agent | Flume spins up an agent with the signal's context (e.g. release notes) attached. |
| human | Decision card with summary + options (now / defer / skip). |
| digest | Batched into a periodic summary. |
| ignore | Dropped (logged). |

Failures emit a signal back into Millpond, so work escalates up the ladder automatically (mechanical fails → agent; repeated failure → human).

## Rules: generic core, opinions at the edges
- **Core**: rule = match (source, type, fields) + action (lane). Plus generic knobs: escalation on failure, batching, timing windows, counts over time windows (repetition/thresholds), priority overrides. Millpond knows nothing about versions.
- **Domain knowledge lives in adapters**, which emit typed signals. Headwater emits fields like edge, old/new version, bump level (major/minor/patch), breaking-change flag, short summary.
- **Opinions ship as rule packs.** Headwater's default dependency pack:
  - Patch bumps on own flakes → mechanical, auto-merge.
  - Minor upstream bumps → mechanical, escalate to agent on failure.
  - Major or flagged-breaking → human card with summary.
  - Everything else → weekly digest.
- Overrides per edge, e.g. "Boom Drive on Flume: always mechanical."

## Other signal sources and what their rules care about
| Source | Rules key on |
|---|---|
| Versions (Headwater) | impact |
| Security advisories | urgency — overrides timing windows and batching |
| Sluice merge-queue / CI failures | repetition — retry → flaky-test agent → human on 3rd |
| Boom drift (`boom check` finds code contradicting a claim/ADR) | ownership — fix code (agent) vs revise decision (human) |
| Production errors/alerts | dedupe + thresholds |
| Account-pool health | quota low → move sessions (see session lifecycle) |
| Schedules | time — digests, routines like monthly close |
| Meetings (Eddy) | decisions/action items |

## Coupling
- **Signal schema is the only hard contract**; put it in **Weir**.
- Headwater, Eddy, Timber, Sluice depend on the schema only; they emit to a sink (e.g. JSONL in Git) and don't know Millpond exists.
- Millpond depends on the schema + small lane interfaces (job runner, Flume, human sink). It is the hub and is optional glue.
- Flume accepts work items from anywhere (Millpond, a human, the cloud).
- Timber doesn't depend on Millpond. Millpond's jobs call Timber; Timber's publish events flow back as signals.

## Human lane seam (open source must not depend on the cloud)
Two operations: **post** a decision request (summary, options, link to signal) and **receive** a decision. The decision returns as a normal signal (e.g. "defer 7 days").

Implementations:
- **Local (default, fully self-hosted)**: requests stored in Millpond's own state in Git (recfiles); answered via a `millpond inbox` CLI, desktop notification, or the pocket-CD menu bar app.
- **Boom Drive Cloud**: Millpond still writes locally. The `boomdrive` runner mirrors pending requests to the **rail**; answering on the rail makes the runner write the decision back locally. Millpond never talks to the cloud.
- Same request may appear in several surfaces; first answer wins, others clear.
- Cloud adds the multiplayer value: assign decisions to teammates, approval audit trail/attestation, non-coders answering in a browser, cards across many drives.
