# Plan surface mockups

Self-contained HTML mockups of the operator's surfaces for flywheel
next. Earlier explorations (a single queue, a card deck, a river, a
four-lane workbench, and the context map on the v1 schema) were retired
on 2026-09-07 once rail-and-board and the first-principles map were
chosen; their feedback is kept below because the rulings came from it. All are seeded from `../plan-mockup.md` (org willdan,
2026-09-04 07:40, decisions 412–421; the later two add 422 and 424) and read against
`../requirements.md`, especially A.2 (the plan), A.5 (planning and
construction), A.15 (signals and curation), A.17–A.19 (sessions charged
by the machinery, landing and pull requests, operation) and B.4 (the
status view). Published copies (private artifacts):

| file | metaphor | artifact |
|---|---|---|
| `rail-and-board.html` | the direction: one rail titled "Decisions" (the plan delivery in the model's order, attention and SINCE below it) beside the status view drawn by phase; every decision is a marker on its object; hosts and repositories in a strip above the lanes; per-unit proposal edits are responses; carries the workbench's seed (412–424), session chips, machinery sessions, explore as a control, countdowns, redo → new number, lineage, a repository dock for claims and scope, and a map view of the board: the system context map as the scope surface (198), with the review overlay (122) and repository onboarding | https://claude.ai/code/artifact/1988cb09-a629-4406-b8b2-08506e8c03c3 |
| `context-map-ddd.html` | the system context map as the scope surface (198) on the first-principles model in `../models/context-map/model.md`: bounded contexts as the only units of a computed layered layout with fit as the one camera command at each of two zoom levels; relationships as typed edges with U/D, OHS, PL and ACL marks, a lens for a shared kernel, a barred dotted edge for separate ways, a hatched card for a big ball of mud, and on every edge a count of the element-to-element links that cross it with a panel that slides out on hover or focus to list them (from element, kind, to element, home each side) and the relationship's claims; each context card keeps its header and carries a live thumbnail of the map inside it (elements as dots coloured by kind and ringed by home, links as hairlines, stubs for links out) — clicking the header opens the dock, clicking the thumbnail drills in to the context's inside at full size in the same grammar (elements as nodes with kind, home chip, verdict dot, attachment chip, markers, status and open question; links as typed edges; the neighbouring contexts as collapsed docks at the canvas edges carrying the pattern and end marks, cross-context links landing on them with the target element named; a breadcrumb, Esc back with the camera restored); facets (lane, runtime, tier) that only filter, colour or wash at both levels, with a live 0 moved · 0 edges changed check; two overlays from one id-keyed diff (current → target, since last review with the mark moved by "mark reviewed") styled the same way on cards, thumbnails, nodes and docks, and a Changes panel; homes as chips with verdict dots, claims as attachment chips with derived scope lines, re-attach as the scope gesture, decisions 412–424 as markers in rail-and-board's glyph set with the rail card inline, open questions with one-gesture capture, a repository dock with derived kinds and capabilities, and add-repository as a proposal whose yes creates the repository before the baseline arrives (S72); both maps embedded as YAML that reads as `schema.yaml`, extended from `example.yaml` to nine contexts, forty-two elements and thirty-two links | https://claude.ai/code/artifact/5e9cd69d-30ea-49ca-a8ed-13b41eb1ffdb |
| `management-console.html` | the management console, drawn in the AWS Cloudscape design system: everything the operator administers, cut from rail-and-board and read for administration rather than for the count — top navigation with the organization selector, the GitHub identity and a link back to the plan console; side navigation of Organizations (Overview · Repositories · Members and roles · Sinks · Adapters · Packages · Pools) and Hosts (one settings screen per host, and "+ host"); the per-host settings screen by heading (identity and the git App as read-only headings, router, runners per role, agent, chat sinks, capture adapters, triage derived, environment, pool, host facts with the upgrade chore) with a slot's catalogue and add sheet in the split panel and no index across kinds (S115, S117); the "+ host" wizard, which opens on a choice of next steps (a machine of yours, an agent in the cloud at bound 0, more drain managed for you, a host already running the binary) with the platform list and "adopt existing" behind "advanced", then parts · provision · hand over secrets · enrol (S120–S121); the "+ organization" wizard over 204, 206, 207/207a, 218–222, 233, 247 and 253 (name and tier, the GitHub account, state and blueprints created or adopted, the App installed or extended, the Frontegg account with the creating user as owner, a root on this host, then the first-tick decision) and "retire organization" as a decision, never a button that acts (221); the pool row with its hosts folded under it and the image rebuild (S175–S176); the organization store with configure, retire and restore (S156); identity as a host binding (S164, S199): `github` hosts sign in with GitHub's device flow and their operators list is authored on the settings form with no roles and no members section, `frontegg` hosts show the Frontegg identity with its GitHub username beside it and derive members read-only from the account with invite/assign/revoke/set-role beside them, switchable with ?served=; the manifest as forms across the organization's pages — operators with their addresses per chat kind, roles as lists of members, sinks with their marks and presenting hosts, adapters, landing policy, environment declarations, pool bound and cost (S155, S166–S174). Every install, enrolment, image rebuild and upgrade is shown raising a decision with its number and "answer in the plan console"; every configuration change is one logged response a flashbar confirms; a secret is never a field. Cloudscape is drawn by hand against the real visual-refresh token values (@cloudscape-design/design-tokens@3.0.111): the ESM bundle carries no CSS, so the components would render unstyled | not published |
| `journeys/laptop-builds-cloud-agent.html` | journey · the solo developer whose laptop stays the code builder, signs in with GitHub device flow, and adds an agent in the cloud for captures and chat: six screens in rail-and-board's visual language, a stepper across the top, and the exact promise stated on every screen — connect GitHub (the App on their account, scoped, short-lived tokens; the agent's declaration names no repository, so no code reaches it), chat through the platform's shared bot (no token placed at all), capture adapters (transcripts and the Drop folder stay on the laptop and are triaged there), the warm cache screen (what the shared tier keeps between ticks — a full state clone, a sparse blobless blueprints clone, a due-index row, queued captures — sealed under a key naming that organization alone and unwrapped only while its plan is evaluated, with the mid-tick residual and the eviction, role-per-tick, enclave and customer-key paths that shrink it, and GitHub's own plaintext stated rather than papered over), and done: one enrolment decision, then a bound-0 host. Promises from `../../proposals/security.md` §2 and §5, Design A, clauses 256–265 | not published |
| `journeys/team-hosted.html` | journey · a team moving to the hosted tier: six screens — the two repositories created under the customer's own GitHub account, the organization's account with the creating user as owner (the hosted tier's identity provider; a machine of their own keeps GitHub device flow), members invited by GitHub username, the pool where code exists only on a machine created for that organization and destroyed when the work ends and where raw capture material is read (263, 264, 239–241), and the warm-cache promise: everything held between ticks encrypted at rest under a key naming that organization alone, unwrapped only during a tick, so a stolen disk or leaked snapshot is ciphertext — with the stores' own per-volume keys, the queue holding no tenant content, eviction, fail-closed, and GitHub's repositories plaintext under GitHub's key unless the envelope declaration is turned on (265). Ends at one decision answered in the plan console | not published |
| `journeys/enterprise-own-account.html` | journey · an enterprise that holds its own key and, past that, its own AWS account (`security.md` §4 Designs B and C, §3 (b), (d), (e)): six screens — the shape of the tier stack, the key created in their account and granted revocably (revocation stops all reading within minutes; every use logged in their account, not ours), the enclave that releases the key only to an attested image and so removes our staff rather than merely making us switchable off, their own account connected by a role with an external id, the honest what-runs-where table (loops, warm cache, capture endpoint and triage, pool hosts, chat sink and App on their side; names, health and billing counters on ours, never a record body; GitHub unchanged), and what they give up — support that cannot read their state — plus one decision that runs init in their account | not published |

Shared vocabulary in every mockup: a **decision** is one numbered thing
the operator may answer (numbers are stable and org-wide); a
**response** is one answer, sent on its own and applied exactly once;
the **SINCE** tail lists what the machinery did since the operator's
last delivery mark; the **count** is the number of decisions that need
a response, with attention items outside it; `yes all` answers every
decision in the approve group. A unit's proposal, and now the planning
proposal (one document showing several bolts, new or open, and their
units with dependencies), are read whole on the review surface; the
answer is one response on the document.

Feedback so far, in order:

- Peek was not it. The operator wants a full card view in a
  dock/drawer that keeps the board in place, like a GitHub issue over a
  project board. Desktop first; a mobile experience follows and should
  feel consistent with whatever desktop metaphor wins.
- Organize around AI-DLC's three phases (inception, construction,
  operation) and their symmetry, with the bolt plan as the transition
  between inception and construction, either on one screen or as
  screens with a transition area. Operation is observed, never run:
  landed bolts with pull request, checks and environment links, and
  signals arriving from operation.
- Each phase is about managing context: validated context from
  inception into construction, accumulated context from both into
  operation.
- Every answer click is one response; the card refuses a second click
  while one is in flight. Typed text answers exist for questions.
- The capture box lets the operator type an idea that becomes a signal
  or an intent.
- Open questions the operator raised on the workbench: light and dark
  both needed; whether j/k should move within a lane and h/l across
  lanes; whether "that's all wrong" typed on the proposal re-runs
  planning with the notes (it does: `redo: <notes>` withdraws the
  proposal and charges planning again with the notes and its context);
  how moving, dropping and renaming units in a proposal keeps
  dependencies valid (dependencies stay within one bolt; an edit that
  would break one is refused inline with the reason and an offer to
  move dependents along); whether the proposal's history shows lineage
  back through writeback and elaboration to the intent (it should:
  units cite claims and claims cite the elaboration that wrote them);
  whether the bolt plan still needs to be an OpenSpec change in the
  blueprints repository; and how Operation stays clean (landed bolts stay in
  view while their request, environments or signals are live and for a
  bounded window after, then leave every view and stay in history).
- Rail-and-board is the direction; the workbench is retired, its seed
  and session chips carried by rail-and-board and `../plan-mockup.md`. Why: the count is
  one list in the model's order (A.2 §11, §15, §18; model 5.1, 5.5),
  so it is one rail and one axis, not four lanes; the board is the
  status view by phase (B.4), objects only, with every decision as a
  marker on its object; hosts belong on the board (B.4 §141); and
  proposal edits are responses sent when given, never staged (172,
  184). Two later rulings override the brief and the workbench: no
  typed command grammar anywhere (the capture box captures only, with
  an "intent" toggle; explore is a control over ticked intents; drop,
  later, rename, service start/stop, finish and ask-again are dock
  buttons), and claims and scope get a surface (104, 105): a repository
  dock with its kinds, capabilities, claims with verdicts, and each
  claim's scope with a control that sends one response; the baseline
  decision 417 links to it.
- The board cards all looked alike, which said "same kind of thing"
  about very different things. Two rules now: one silhouette per kind
  (a decision is the only answerable card; a proposal is a sheet with
  unit proposals as slips and a baseline as a sheet of its own; an
  intent is a drawn thread with elaborations as beads; a bolt is a flat
  square ledger with its units as a chain; a landed bolt is a borderless
  record with a PR-and-checks stamp; a signal is a quote with a left
  rule), and phase is the lane's while kind is the shape's. The dock
  header takes the object's form.
- Book mode (2026-09-07): the board gains a third view, an embedded
  mdBook viewer the page draws itself (key b), because the blueprints are
  mdBook and the server is Rust so the integration can be tight. The
  rail jumps the viewer to the chapter and claim block a decision
  concerns and lights it; decision markers sit in the chapter margin;
  every dock page and the map's scope box carry "read in book"; a
  library overlay lists the organization's blueprints with chapters, claims
  standing and proposed, last written, unmet verdicts and "changed since
  review", and links a book's repositories to the map; "since last
  review" and "mark reviewed" are one flow shared with the map, the mark
  moved by one recorded response (S73).
- On the context-map-ddd map (2026-09-07): instead of filling each
  context with a structured card of everything inside it, each context
  shows a thumbnail of the map inside it. Clicking the title brings up
  the drawer with the details, as before; clicking the thumbnail drills
  into the next level, or expands it. A nested graph, where the internals
  of a context are seen with the same DDD terminology, topography and
  mapography for the relationships between concepts. Zoomed out at the
  context level that detail is not as important. For the lines between
  contexts, show whether there are relationships between the elements
  inside them; that can be a detail that slides out on hover. The
  mockup now does this: thumbnails at rest, a drilled level with
  neighbour docks, a crossing count and panel on every edge.
- Two drafted requirements mocked up on rail-and-board (2026-09-07)
  for the operator to judge: 213, drill into the OpenSpec artifacts
  behind every object in views fit to the artifact (an intent's change
  directory, a unit's change with its tasks and an ff · apply · verify
  · archive stepper, a claim with verdict evidence, a bolt's acceptance
  file, a work item's commits and report), derived at the shared line
  and never stored, each with "open source" and a "review" link to the
  plannotator stub; and 214, the flywheel's load as three phase gauges
  with inline sparklines and a reading sentence marked as a projection,
  compact in the machinery strip and full on w (l stays "later").
- The flywheel and setup on rail-and-board (2026-09-07): the three load gauges become one instrument, the flywheel, whose reading is runway in days (approved work ÷ drain across alive hosts) on a wheel with feed and pressure going in and drain coming out, a two-stage backpressure pipe above it, one derived reading sentence ("feed it", "you are the limit", "drain is the limit: add a host", "primed"), the unattended streak as the score stated as a reading, the old gauges under an advanced disclosure and a runway-and-streak pill in the strip; and a setup overlay from the hosts strip listing the install ladder (browser interpreter → local dispatcher → cloud dispatcher) whose offers never enter the count, an accepted offer raising an install chore as a decision and a missing secret sitting under attention with "place it" (drafted 214 revised, 215).
- Setup by host on rail-and-board (2026-09-07): the install ladder is replaced by a per-host surface, browsed à la carte — one row per host (studio, mac-mini, and willdan-cloud as the dispatcher placement on flywheel-cloud with bound 0) with kind, platform, alive state, bound and the parts it runs as chips (adapters, chat sinks with the presenter lease, the agent, triage, runner, router, sign-in), a detail per host with each part's state (installed · offered · needs a secret · installing · disabled), and beside it the index: a searchable catalogue of packages filtered to the host's platform (adapters, chat sinks, runners, routers, sign-in, unit and elaboration types, deliverable producers, map vocabularies, templates, scenario packs) with version, shipped or index, needs, enables and an "offer" control that raises the install chore as a decision; plus "+ host" as a guided enrolment in the same surface (platform, provisioning from the host you are on with credentials never stored, secrets handed into the platform's store, an enrol decision with a one-time token, join, alive) with "adopt existing", and the cloud host's own joining folded into its detail (215 revised).
- Settings screens (2026-09-07): a host's detail is a settings screen by heading, each heading a slot or a list — sign-in and router as single slots with change and replace, runners one slot per role (elaboration, construction, machinery) naming a runner and a model, the agent on or off with its runner, chat sinks and capture adapters as lists with add, triage derived from the adapters, host facts with an upgrade chore when the binary is behind; the organization store has the same shape (types, deliverable producers, map vocabularies, templates, scenario packs) with configure, retire and restore. The standalone index is gone: a picker per kind, opened from its heading with search, is the index. The "+ host" wizard's parts step uses the same headings. Non-member organizations are hidden from the switcher pending the operator's call between hide and grey.
- Members, owners, environments and pools (2026-09-07, 234–242): sign-in is GitHub everywhere, by device flow on a host served from the operator's own computer, so the account item reads the GitHub username and no local no-sign-in case remains; decisions may carry an owner (a member or a manifest role) shown as a chip on the rail card and in the dock, "assign" sends one response, and "mine | all" at the rail's head filters to the member's own and unowned decisions; SINCE says who answered from the one register; the account item lists the member's page sink and one chat sink per address on their operators entry, each with its own mark and presenting host; the hosts surface gains a pool row (platform, image with a rebuild chore, bound, live, idle-retire, cost) with its live hosts folded under it, each serving one organization, counted in drain and shown in the strip as dashed pills; and a host's settings gain an Environment heading listing the repositories it covers with a provider each and whether it is satisfied, an unsatisfied one sitting under attention.
- Carried into the specification (2026-09-07): `../surfaces.md` now records the book view, the nested map, the artifact views, the flywheel instrument, the hosts surface as a settings screen, the account item, sign-in, members, owners, environments and pools as statements S85–S194 and rulings S132–S143 and S183–S190; `rail-and-board.html` and `context-map-ddd.html` illustrate them, and where a mockup on disk still says "offer" or draws the map's first level as counts, the specification wins.

The models behind the surface are in `../models/statechart/` (`model.md`
first). The Rust prototype that serves a working version of this page
over seeded scenarios is at `/Users/chuck/Code/github_agentplot/flywheel-next/main`.
