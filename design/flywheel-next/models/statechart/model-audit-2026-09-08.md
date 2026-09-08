# model.md against requirements.md — audit, 2026-09-08

Read-only audit. `model.md` at 3037 lines against `requirements.md` at
2815 lines (A.1–A.38, B, C). Verdicts: **current** (the model states what
the clause now says), **stale** (the model asserts something a later
clause contradicts), **missing** (no prose states the clause at all).

Sections 19, 20 and 21 of model.md were written for A.33–A.38 and are
current. The drift is concentrated in the sections written before them:
§5.5, §11, §13, §17 (A.22) and the 233 / 234–237 blocks of §18, which
still carry the pre-amendment rulings, and in three of §12's answers.

## 1. Coverage by requirement section

| section | clauses | model.md | verdict | note |
|---|---|---|---|---|
| A.1 the operator's response | 1–6 | §2.2, §5.6, §5.7 | current | undo-or-defer list, `applied_responses`, exactly-once all stated |
| A.2 the rail | 7–19 | §5.1–§5.7 | current | derivation, register, tail, capture box |
| A.3 intents and curation | 20–23 | §9, §8.1 | current | |
| A.4 elaborations and types | 24–27 | §10.4 | current | |
| A.5 planning and construction | 28–57 | §6, §7 | current | |
| A.6 findings and chores | 58–64 | §1.2, §9, S3 | current | |
| A.7 sessions | 65–74, 197 | §10.1–§10.3 | current | identity token and the no-messaging rule stated |
| A.8 state and evidence | 75–78 | §3.2, §3.3 | current | |
| A.9 observability | 79–82 | §2.1, §5.5 | current | |
| A.10 engine and domain | 83–87 | header, §2.5 | current | |
| A.11 instructions as data | 88–91 | §10.6 | current | |
| A.12 scenarios and testing | 92–95, 93a, 93b | §4 table (552, 555), §12.8 | current | recorded workspace and operator runner both bound and explained |
| A.13 coexistence | 96 | — | missing | 96 appears nowhere in model.md prose |
| A.14 claims, as-built, ledger | 97–105, 195 | §8 | current | scope through the map, kinds derived |
| A.15 signals and curation | 106–118, 215 | §9, §18 | current | |
| A.16 instructions, review surface, map | 119–124, 198–202, 211 | §8.2, §10.6, §4.3 | current | |
| A.17 sessions charged by machinery | 171–174, 196 | §17, §18 (172) | current | |
| A.18 landing, PRs, merge-back | 175–180, 183–185 | §7.4, §17 | missing (183) | 183 (tools driven by written configuration, never the host's) uncited |
| A.19 operation | 181–182, 186, 192 | §17 | current | |
| A.20 intents as changes | 187–189 | §17 | current | |
| A.21 deliverables and producers | 190, 212 | §17 | current | |
| A.22 endpoints and routing | 191 | §17 (2214–2236) | **stale** | asserts the private network is the boundary under every router; 46/191 amended for hosted hosts |
| A.23 where files live | 203 | §17, §12.13 | current | |
| A.24 bootstrapping | 204–208, 205a, 207a | §17, §18 | current | 205a/207a stated in the A.32 block |
| A.25 dispatch | 216–217k, 216a | §18 (2350), §19 | missing (217d, f, g, h) | delegated to `models/dispatch/model.md`; four sub-clauses named nowhere |
| A.26 organizations | 218–222, 233 | §18 (2362, 2448) | **stale** | 218–222 current; the 233 block still describes a no-sign-in local page and `sign_in: tailnet, oauth, oidc` |
| A.27 machines, types, context | 223–227 | §18 (2383), §10.7 | current | |
| A.28 packages and setup | 228–232 | §18 (2410, 2431) | current | |
| A.29 users and ownership | 234–237, 236a | §18 (2467) | **stale** | Frontegg asserted on every host; 236a (chat address per member) stated nowhere |
| A.30 environments | 238–239 | §18 (2488) | current | |
| A.31 host pools | 240–242 | §18 (2502) | current | |
| A.32 identity | 243–255, 247a, 253a | §18 (2517) | missing (253a) | the two kinds are right; the unsigned-in single-operator page is bound in `profiles/` and absent from the prose |
| A.33 tenancy and encryption | 256–267 | §19 (2562) | current | |
| A.34 the hosted tiers | 268–278, 290–293 | §19 (2606, 2722) | current | page projection, MCP tool server, invoked liveness all stated |
| A.35 plans and presets | 279–284, 294, 295 | §19 (2777) | current | add-host offers follow the serving host |
| A.36 rulings carried over | 285–289 | §19 (2848) | current | |
| A.37 the control plane | 296–305 | §20 | current | |
| A.38 the phone | 306–314 | §21 | current | |
| B.1 the operations | 125–132, 193 | §3, §4, §5.7 | current | see miscitation on "eight contract operations" |
| B.2 the guarantees | 133–137 | §4, §15 | current | |
| B.3 evidence names and binding | 138–140 | §4 | current | |
| B.4 the status view | 141–146, 209, 210, 213, 214 | §4.3, §18 | current | |
| B.5 hosts and ownership | 147–151, 150a | §11, §18 (2549) | **stale** | §11's liveness rule predates 150a and 292; the amendments live only in §18/§19 |
| B.6 the response in transit | 152–155, 194 | §5.6, §5.7 | current | |
| C.1 the tracker profile | 156–159 | §4.1 | current | |
| C.2 the git-only profile | 160–167 | §4.2 | current | |
| C.3 a custom profile | 168–170 | §12.8 | current | |
| §7 invariants | I1–I16 | §15 | current | |
| §10 questions | 16 questions | §12 | **stale** | 12.5 and 12.14 answer for a self-managed host only |
| §11 scenarios | S1–S34 | §14 | current | 314's 390px run is claimed for S1 only (§21) |

**Counts: current 41 · stale 5 · missing 4** (50 rows).

## 2. Stale statements, ranked

1. **model.md:2454–2465** — "Served locally with no sign-in kind the page
   shows the local user and needs no account; behind a kind declared on
   the host (`host.yaml` `sign_in`: tailnet, oauth, oidc — a per-host
   package)…". Contradicted by **233** (a page served on the operator's own
   computer signs in like any other, through the host's identity kind),
   **243** (the kinds are exactly `github` and `frontegg`) and **253**
   (there is no local-user case and no unauthenticated page). The one
   unsigned-in case is **253a**, which model.md never states. §18's own
   A.32 block at 2517 says the opposite of this block.

2. **model.md:2467–2472** — "the identity is the Frontegg user on every
   host, the operator's own computer included, … the members are the
   users assigned the Application on the organization's account, derived
   and never authored (247)". Contradicted by **234**, **243**, **246**
   and **247** as amended: on a self-managed host the identity is the
   GitHub username from the device flow and membership is the *authored*
   operators list; derivation from the account is the hosted tier alone.

3. **model.md:2226–2236** — "published within the operator's private
   network by the platform's own access control … the machinery publishes
   nothing wider than the private network under any of them (46)".
   Contradicted by amended **46** and **191**: a hosted host has no
   private network, its router is the platform's ingress at the served
   name, and the identity token the tool server verifies is the boundary
   (also **249**, **291**, **217c**).

4. **model.md:1433–1445** (§11) — "A host is one static binary (`flywheel
   host`) … It heartbeats every minute … `alive`, `stale` at 5 minutes,
   `gone` at 30 minutes". Contradicted by **270** (the tick is invoked,
   not looped; a standing process is one invoker among several), **292**
   (an invoked host heartbeats once per tick and its stale window is the
   due time it wrote plus the grace) and **150a** (an intermittent host is
   *away*, not gone, and raises no attention line). §11 is where the rule
   is stated; the amendments sit only in §18 (2549) and §19 (2765).

5. **model.md:2477–2479** — "the `sink` record carries `member`, one page
   and one chat sink per identity in `operators:`". Contradicted by
   **236a**: chat sinks are one per member *per chat address* on the
   operators entry, a member with no address has a page sink only, and on
   a hosted tier only the addresses are authored.

6. **model.md:771–773** (§5.5) — "A `sink` machine exists per sink the
   manifest names: the chat, the page, a bell on a named multiplexer
   surface." Contradicted by **236** (sinks are per member, each with its
   own delivery mark). §18 amends it; §5.5 is the statement of record and
   still reads pre-236.

7. **model.md:12** — "Requirements are cited by their number in
   `requirements.md` (1–212)". The document now runs to **314**, and
   model.md itself cites into A.38.

8. **model.md:1685** (§13, the crate table) — the binary's subcommands
   (`host`, `dispatch`, `scenario`, `capture`, `claims check`,
   `render-order`, `review`, `exit`, `offer`, `note`, `refuse`) name
   neither invocation mode **297** requires — **tick** and **request** —
   and no crate holds the request-served page bundle and tool server
   (**291**, **293**). §20 states the contract; §13 has not followed.

9. **model.md:1537–1541** (§12.5) — "Four (3.1) … Nothing else." On the
   hosted tiers a tick also reads and writes the warm cache object
   (**272**), the page projection object (**291**) and the organization's
   queue (**271**). §19 states all three; the answer to section 10 does
   not qualify itself.

10. **model.md:1639–1647** (§12.14) — the phone reply becomes a commit by
    the sink's presenter, and the status page is `status.html`. On a
    hosted tier a write is a tool call enqueued on the organization's
    queue and applied by a later tick, and the status view renders from
    the page projection under one decrypt (**291**, **310**).

11. **model.md:534–543** (§3.4, the example manifest) — the host entries
    carry no `identity`, no `tier`, no `intermittent`, no `provider`, no
    `pools`, and `sinks:` has no member keying: every binding **A.29–A.35**
    added is absent from the one worked example of the manifest
    (**236**, **238**, **243**, **268**, **240**, **150a**).

12. **model.md:732–748** (§5.3, the decision catalogue) — the table claims
    to be generated from the machines but omits every decision kind §18
    and §19 introduce: `host-refused` (222), `package-install` and
    `package-secret` (229), `host-enrol` and `host-enrol-lapsed` (230),
    `app-coverage` (207), `host-environment` (238), `awaiting-app` (204),
    and the failed-service attention decision of §7.7 (47).

13. **model.md:559** (§4 table) — "the eight contract operations of B.1".
    B.1 states seven operations (125–132) plus the tool surface (193).

## 3. Miscited clause numbers

| line | citation | what the clause actually says |
|---|---|---|
| 1141 | "(the ledger invariant, model.md 4.8)" | model.md §4 has 4.1–4.3 only; there is no §4.8 — a dangling internal reference |
| 2234 | "(46)" for "publishes nothing wider than the private network under any of them" | 46 now exempts a hosted host, where the token is the boundary |
| 2456 | `sign_in`: tailnet, oauth, oidc | 243 defines two kinds, `github` and `frontegg`; none of the three named exists |
| 2468 | "(247)" for "Frontegg user on every host" | 247 governs hosted-tier membership only; self-managed membership is the authored list |
| 2454 | leans on 233/153 for a local page needing no account | 253 forbids an unauthenticated page; 253a is the single narrow exception |
| 559 | "eight contract operations of B.1" | B.1 enumerates seven |
| 12 | "(1–212)" | the requirements run to 314 |

**Cited nowhere in model.md prose:** 96, 143, 183, 217d, 217f, 217g,
217h, 236a, 253a. Of these, 236a and 253a are already bound in
`profiles/` (two and three files respectively) and 96, 183 carry
`satisfies:` in `machines/`, so the prose lags its own artifacts rather
than the trace failing.

## 4. The companion documents

### `machines-and-context.md` — behind by A.29 onward

Last substantive commit 2026-09-07 (`1d6acd1`, `f1eaa35`). It cites
nothing above **227**, so A.29–A.38 are absent entirely.

- **§4 "Proposed requirements"** (478) presents 223–227 as drafts to be
  placed, and says "213–222 are reserved". All of 213–231 were ratified
  the same day (`8364fc6`) and 223–227 now stand verbatim in
  requirements.md. The section is a stale proposal of ratified text.
- **§1.1** (≈78) — "`sessions.yaml` `models:` gives a kind and model per
  role that a unit type, a stage or an elaboration type may override …
  though no type file in `machines/` carries such a field and
  `schema.json` would refuse one". **285** now *requires* every unit and
  elaboration type to declare the model class per stage, and model.md
  §19 binds it to `stage.yaml`. The note is now a contradiction.
- **§2** has no context row for dispatch's triage session or the host's
  agent, which **217b** makes sessions of A.7 and **226** requires an
  enumeration for; model.md §18 (2390) claims `profiles/context.yaml`
  carries both.
- **§5**'s **unstated** list is presented as open; model.md §18 (2396)
  says the 24 points are resolved in `profiles/context.yaml` `rulings:`.

### `models/dispatch/model.md` — current through 291, stale on the naming

Updated 2026-09-07/08 (`9df247b`, `a8d88d8`), so the invoked placement,
the receiver, the queue, the served name and the token boundary are all
current, and the state-store rename is applied.

- **§1 (22) and §7 (360)** still call the fourth job "the **interpreter**
  for chat". Ratified **216** and **194** make it the **host's agent**,
  whose interpreter is one function of it; and §1's table says it "turns
  one free-text message into exactly one proposed tool call", where 194
  says a message asking for several things yields several proposed calls,
  one card each. **216a** at 364 has the same old name.
- **§7 "Proposed requirements"** says "These replace the drafts numbered
  216 and 217" — 216–217k are ratified; the section duplicates them in
  the superseded wording.
- **§6, tier 3 row** offers one shape ("the same dispatcher assuming a
  role the organization grants, or a function of its own in the service
  account"). **276a** adds *stores and compute* with the deployer,
  registry and identity environment, and **304/305** make the shapes
  three.
- Nothing on **292** (invoked-host liveness), **293**'s client list (a
  member's own coding agent, the Claude mobile app), **294** (the model
  budget and class), **295**, A.37 (296–305) or A.38 (306–314).
