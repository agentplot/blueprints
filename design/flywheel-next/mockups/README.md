# Plan surface mockups

Self-contained HTML mockups of the operator's surfaces for instance
next. Earlier explorations (a single queue, a card deck, a river, a
four-lane workbench, and the context map on the v1 schema) were retired
on 2026-09-07 once rail-and-board and the first-principles map were
chosen; their feedback is kept below because the rulings came from it. All are seeded from `../rail-mockup.md` (org willdan,
2026-09-04 07:40, decisions 412–421; the later two add 422 and 424) and read against
`../requirements.md`, especially A.2 (the rail), A.5 (planning and
construction), A.15 (signals and curation), A.17–A.19 (sessions charged
by the machinery, landing and pull requests, operation) and B.4 (the
status view). Published copies (private artifacts):

| file | metaphor | artifact |
|---|---|---|
| `rail-and-board.html` | the direction for the rail surface: one rail titled "Decisions" (the rail delivery in the model's order, attention and SINCE below it) beside the status view drawn by phase; every decision is a marker on its object; hosts and repositories in a read-only strip above the lanes; per-unit proposal edits are responses; the seed 412–424, session chips, machinery sessions, countdowns, redo → new number, lineage; a repository dock for claims and scope; the palette in its three states (at rest with the last five things sent; on `/` the catalogue fuzzy-matched, each row naming the command, what it does and the object it acts on; and mid-capture with its preview line), a bare number listing a decision's own answers, and `/elaborate`'s multi-pick over the open intents; the board's two views — phases and the system context map as the scope surface (198) with the review overlay (122) — with the book a link out to its own viewer; the artifact views behind every object (213); the flywheel instrument (214); and an account item with the instance switcher, the identity block, the sinks line and sign-out. It carries no management surface: hosts, pools, the instance store, the settings form and "+ host" moved to `management-console.html`, which the account menu links to | https://claude.ai/code/artifact/1988cb09-a629-4406-b8b2-08506e8c03c3 |
| `context-map-ddd.html` | the system context map as the scope surface (198) on the first-principles model in `../models/context-map/model.md`: bounded contexts as the only units of a computed layered layout with fit as the one camera command at each of two zoom levels; relationships as typed edges with U/D, OHS, PL and ACL marks, a lens for a shared kernel, a barred dotted edge for separate ways, a hatched card for a big ball of mud, and on every edge a count of the element-to-element links that cross it with a panel that slides out on hover or focus to list them (from element, kind, to element, home each side) and the relationship's claims; each context card keeps its header and carries a live thumbnail of the map inside it (elements as dots coloured by kind and ringed by home, links as hairlines, stubs for links out) — clicking the header opens the dock, clicking the thumbnail drills in to the context's inside at full size in the same grammar (elements as nodes with kind, home chip, verdict dot, attachment chip, markers, status and open question; links as typed edges; the neighbouring contexts as collapsed docks at the canvas edges carrying the pattern and end marks, cross-context links landing on them with the target element named; a breadcrumb, Esc back with the camera restored); facets (lane, runtime, tier) that only filter, colour or wash at both levels, with a live 0 moved · 0 edges changed check; two overlays from one id-keyed diff (current → target, since last review with the mark moved by "mark reviewed") styled the same way on cards, thumbnails, nodes and docks, and a Changes panel; homes as chips with verdict dots, claims as attachment chips with derived scope lines, re-attach as the scope gesture, decisions 412–424 as markers in rail-and-board's glyph set with the rail card inline, open questions with one-gesture capture, a repository dock with derived kinds and capabilities, and add-repository as a proposal whose yes creates the repository before the baseline arrives (S72); both maps embedded as YAML that reads as `schema.yaml`, extended from `example.yaml` to nine contexts, forty-two elements and thirty-two links | https://claude.ai/code/artifact/5e9cd69d-30ea-49ca-a8ed-13b41eb1ffdb |
| `book-viewer.html` | the instance's blueprints as a read-only book, served beside the page and never inside it (`../proposals/command-palette.md` §5; closes S149): the chapter tree, one chapter at a time with previous and next, headings with anchors, and each claim rendered where its chapter includes it by anchor — the include line, then the claim's name, version, what it attaches to, the scope derived from that, the requirement with its scenarios as GIVEN · WHEN · THEN, and one verdict dot per repository in scope. Built from the shared line and only that, so a claim an intent has not landed shows instead as a note naming that intent; the library is the viewer's own index of the instance's books. Every chapter and every rendered claim carries "Back to the flywheel" at the host's address with the instance in the path — the chapter's intent, the claim's decisions and evidence — and says so rather than failing silently when that host is away. Who reads it is stated as a fact of the tier: on a machine of your own the private network is the boundary, on the hosted tier it reads to members of that instance alone. Review switches: `?org=`, `?book=`, `?ch=`, `#<anchor>`, `?served=`, `?away=1`, `?theme=` | not published |
| `management-console.html` | the management console, drawn in the AWS Cloudscape design system: everything the operator administers, cut from rail-and-board and read for administration rather than for the count — top navigation with the instance selector, the GitHub identity and a link back to the rail console; side navigation of Instances (Overview · Repositories · Members and roles · Sinks · Adapters · Packages · Pools) and Hosts (one settings screen per host, and "+ host"); the per-host settings screen by heading (identity and the git App as read-only headings, router, runners per role, agent, chat sinks, capture adapters, triage derived, environment, pool, host facts with the upgrade chore) with a slot's catalogue and add sheet in the split panel and no index across kinds (S115, S117); the "+ host" wizard, which opens on a choice of next steps (a machine of yours, an agent in the cloud at bound 0, more drain managed for you, a host already running the binary) with the platform list and "adopt existing" behind "advanced", then parts · provision · hand over secrets · enrol (S120–S121); the "+ instance" wizard over 204, 206, 207/207a, 218–222, 233, 247 and 253 (name and tier, the GitHub account, state and blueprints created or adopted, the App installed or extended, the Frontegg account with the creating user as owner, a root on this host, then the first-tick decision) and "retire instance" as a decision, never a button that acts (221); the pool row with its hosts folded under it and the image rebuild (S175–S176); the instance store with configure, retire and restore (S156); identity as a host binding (S164, S199): `github` hosts sign in with GitHub's device flow and their operators list is authored on the settings form with no roles and no members section, `frontegg` hosts show the Frontegg identity with its GitHub username beside it and derive members read-only from the account with invite/assign/revoke/set-role beside them, switchable with ?served=; the manifest as forms across the instance's pages — operators with their addresses per chat kind, roles as lists of members, sinks with their marks and presenting hosts, adapters, landing policy, environment declarations, pool bound and cost (S155, S166–S174). Every install, enrolment, image rebuild and upgrade is shown raising a decision with its number and "answer in the rail console"; every configuration change is one logged response a flashbar confirms; a secret is never a field. Cloudscape is drawn by hand against the real visual-refresh token values (@cloudscape-design/design-tokens@3.0.111): the ESM bundle carries no CSS, so the components would render unstyled | not published |
| `journeys/laptop-builds-cloud-agent.html` | journey · the solo developer whose laptop stays the code builder, signs in with GitHub device flow, and adds an agent in the cloud for captures and chat: six screens in rail-and-board's visual language, a stepper across the top, and the exact promise stated on every screen — connect GitHub (the App on their account, scoped, short-lived tokens; the agent's declaration names no repository, so no code reaches it), chat through the platform's shared bot (no token placed at all), capture adapters (transcripts and the Drop folder stay on the laptop and are triaged there), the warm cache screen (what the shared tier keeps between ticks — a full state clone, a sparse blobless blueprints clone, a due-index row, queued captures — sealed under a key naming that instance alone and unwrapped only while its rail is evaluated, with the mid-tick residual and the eviction, role-per-tick, enclave and customer-key paths that shrink it, and GitHub's own plaintext stated rather than papered over), and done: one enrolment decision, then a bound-0 host. Promises from `../../proposals/security.md` §2 and §5, Design A, clauses 256–265 | not published |
| `journeys/team-hosted.html` | journey · a team moving to the hosted tier: six screens — the two repositories created under the customer's own GitHub account, the account with the creating user as owner (the hosted tier's identity provider; a machine of their own keeps GitHub device flow), members invited by GitHub username, the pool where code exists only on a machine created for that instance and destroyed when the work ends and where raw capture material is read (263, 264, 239–241), and the warm-cache promise: everything held between ticks encrypted at rest under a key naming that instance alone, unwrapped only during a tick, so a stolen disk or leaked snapshot is ciphertext — with the stores' own per-volume keys, the queue holding no tenant content, eviction, fail-closed, and GitHub's repositories plaintext under GitHub's key unless the envelope declaration is turned on (265). Ends at one decision answered in the rail console | not published |
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
- The palette, the page's one typed input, lets the operator type an
  idea that becomes a signal or an intent, and on a leading `/` names a
  command of the tool catalogue the caller may invoke.
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
  and session chips carried by rail-and-board and `../rail-mockup.md`. Why: the count is
  one list in the model's order (A.2 §11, §15, §18; model 5.1, 5.5),
  so it is one rail and one axis, not four lanes; the board is the
  status view by phase (B.4), objects only, with every decision as a
  marker on its object; hosts belong on the board (B.4 §141); and
  proposal edits are responses sent when given, never staged (172,
  184). Two later rulings override the brief and the workbench: no
  typed command grammar of the page's own — the page has one typed
  input, the palette, in the grammar the chat already carries, where
  plain text is a capture with an "intent" toggle beside it, a leading
  `/` names a command of the catalogue and a bare number answers a
  decision, and every command it sends is also reachable by a control
  (drop, later, rename, service start/stop, finish, ask-again and
  explore are still dock and rail controls) — and claims and scope get a surface (104, 105): a repository
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
- The book viewer: the book is a standalone read-only viewer served
  beside the page and never a view of the board, built from the
  blueprints' shared line as mdBook, because the blueprints are mdBook
  and the server is Rust so the rendering can be tight and the page can
  stay a workbench. Every dock page and the map's scope box carry "read
  in book", which opens the viewer at that anchor in a place of its own
  while the dock stays as it was (key b does the same for the object in
  hand); the viewer's own library indexes the instance's blueprints with
  chapters, claims standing and proposed, last written, unmet verdicts
  and "changed since review", and every chapter and rendered claim links
  back to the object on the page. What is in flight is not in it. "since
  last review" and "mark reviewed" are one mark shared with the map,
  moved by one recorded response from either (S73).
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
  plannotator stub; and 214, the instance's load as three phase gauges
  with inline sparklines and a reading sentence marked as a projection,
  compact in the machinery strip and full on w (l stays "later").
- The instance on rail-and-board (2026-09-07): the three load gauges become one instrument, the instance, whose reading is runway in days (approved work ÷ drain across alive hosts) on a wheel with feed and pressure going in and drain coming out, a two-stage backpressure pipe above it, one derived reading sentence ("feed it", "you are the limit", "drain is the limit: add a host", "primed"), the unattended streak as the score stated as a reading, the old gauges under an advanced disclosure and a runway-and-streak pill in the strip (drafted 214 revised).
- Owners, environments and pools (2026-09-07, 234–242): decisions may carry an owner (a member or a manifest role) shown as a chip on the rail card and in the dock, "assign" sends one response, and "mine | all" at the rail's head filters to the member's own and unowned decisions; SINCE says who answered from the one register; the account item lists the member's page sink and one chat sink per address, each with its own mark and presenting host; an unsatisfied environment and an unplaced secret sit under attention, raised in the rail and explained in the dock. The surfaces that declare and place them — the hosts surface with its pool rows, the store, the settings form — are the console's.
- Carried into the specification (2026-09-07): `../surfaces.md` now records the book view, the nested map, the artifact views, the flywheel instrument, the hosts surface as a settings screen, the account item, sign-in, members, owners, environments and pools as statements S85–S194 and rulings S132–S143 and S183–S190; `rail-and-board.html` and `context-map-ddd.html` illustrate them, and where a mockup on disk still says "offer" or draws the map's first level as counts, the specification wins.
- Management moved out of rail-and-board (2026-09-08): the rail surface keeps the rail, the board in its two views, the dock, the palette, the link out to the book viewer, the artifact views, the instance and the account item's switcher, identity block and sign-out; the setup surface, the settings screens, the add-host wizard and the account menu's settings, hosts and store entries are gone from it, replaced by one "management console" entry that opens `management-console.html?org=<instance>`. The hosts strip stays as the rail view's read-only readout (B.4 §141), and the host dock, the environment attention line and the secret attention line link into the console for the flows that act.

The models behind the surface are in `../models/statechart/` (`model.md`
first). The Rust prototype that serves a working version of this page
over seeded scenarios is at `/Users/chuck/Code/github_agentplot/flywheel-next/main`.
