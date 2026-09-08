# Flywheel next — surfaces

The surfaces the operator works: the plan page with its rail, board,
dock and capture box; the board's three views, phases, map and book;
the artifact views behind every object; the flywheel instrument; the
hosts surface and the account item; identity, members and owners; the
chat rendering; the review surface bindings; the status view on a
phone. This document records decisions, flows, forms
and rulings. It records no pixels and no code. A construction session
building the page works from it without opening a mockup. A later
reader learns here which decisions are settled and why.

Sources and precedence:

| source | role |
|---|---|
| `requirements.md` | the contract; this document may not contradict it. A.2, B.4, B.6, 155, 193–194, 196, 209–214 bind the surfaces directly: 213 the artifact views, 214 the flywheel instrument. A.26 (218–222, 233) binds the account item; A.28 (228–232) the hosts surface and enrolment; A.29 (234–237) members and owners; A.30 (238–239) environments and the image; A.31 (240–242) pools; A.32 (243–255, with 247a) the two identity kinds, membership, roles, permissions, flags, the degraded page and the upgrade. |
| `models/context-map/model.md` §5, §6 | the map's rendering at both levels; the current text of 198–202 |
| `models/statechart/model.md` §5 | the plan's derivation, numbers, decision catalogue, sinks, responses and tool surface |
| `models/statechart/profiles/surfaces.yaml` | the tool catalogue the page's controls call (193); the account, members, owner, hosts-surface and instrument bindings |
| `models/statechart/profiles/identity.yaml` | the two identity kinds, `github` and `frontegg`; the device flow and the authored operators list, the hosted login and Application assignment; the roles, the `fw.*` permissions per tool, the `fw.ff.*` flags and their defaults, the degraded page, the identity tools and the upgrade |
| `models/statechart/profiles/host.yaml` | the identity kind a host declares, its one address and the localhost port on the operator's own computer, the environment providers, the image, the pool declaration, packages and add-host |
| `models/statechart/machines/pool.yaml`, `machines/engine/sink.yaml` | the pool's image and hosts regions; one sink per member with its own mark |
| `models/dispatch/model.md` §1–§5 | the vocabulary of a host's parts: presenter, capture endpoint, triage, interpreter, adapters, runners, placements |
| `plan-mockup.md` | the seed: organization willdan, 2026-09-04 07:40, decisions 412–421 |
| `mockups/rail-and-board.html` | the direction for the plan page; illustrates §1.1–§1.2, §1.4–§1.11, and §1.13's switcher, identity block and sign-out. It carries no management surface: hosts, the package store, the settings form and the wizards are the console's |
| `mockups/management-console.html` | the management surfaces, drawn in Cloudscape; illustrates §1.12, §1.13's settings, hosts and organization-store entries, and §1.14, with "+ organization" and "retire organization" beside "+ host" |
| `mockups/context-map-ddd.html` | the adopted map model drawn at both levels; illustrates §1.3 |
| retired mockups (workbench, queue, deck, river, v1 context map) | removed from the tree on 2026-09-07; §5 cites them by name for the rulings they produced; their seed lives in rail-and-board and `plan-mockup.md` |

Where two mockups disagree, rail-and-board and context-map-ddd win.
Every statement is numbered S1, S2, … so a claim or a work order can
cite one. A number in parentheses is a requirement; "model 5.3" is a
section of the statechart model; "map 4.2" is a section of the
context-map model; "dispatch 4" is a section of the dispatch model.
Numbers are stable citations and follow the order in which statements
were settled, not their place on the page.

## 1. Surfaces

### 1.1 The plan page

- **S1.** The plan page is one page, served on the operator's private
  network, that works on a phone (155). It has four regions: a header,
  a machinery strip, a rail, and a board. A dock opens over the board.
- **S2.** The header shows the organization, the as-of time of the
  read the page was built from (145), the count of decisions, the
  "yes all" control with the numbers it will answer, the count of
  responses sent with a control that opens the sent log, a theme
  control (light, dark, system), and the account item at its right
  (S152).
- **S3.** The rail is titled "Decisions". It is one plan delivery
  (model 5.5): the numbered decisions in the model's order, approve
  then decide then answer, each group sorted by number; then attention,
  outside the count; then the SINCE tail, outside the count. It is the
  same list the chat prints, with the answers as controls (18). Its
  head carries the filter mine · all (S171); every member reads the
  same list under all (235).
- **S4.** The rail never shows: work in progress with no decision
  pending; signals, moves or anything already answered; machinery
  problems other than a response that could not apply; a decision
  already answered and re-derived (6); more than one decision per
  intent awaiting approval (21); a decision for a session that is
  working (66, 71).
- **S5.** Every decision card shows its number, its kind, the phase
  of its object, its title, its tail (the evidence model 5.4 names:
  signal weight on an intent; type, target bolt, dependencies and
  cited claims on a unit; idle time on a session; what a yes starts),
  its owner when one is set (S169), and its answers as buttons. A card
  with a question shows the question verbatim. A card for a gathered elaboration lists the covered intents,
  each with its own drop.
- **S6.** Every answer control calls the `answer` tool with the
  decision number and the answer, plus text where the answer takes it
  (redo, reply, rename, new bolt, pick, type, bolt). One click is one
  response. The card takes an in-flight state and refuses a second
  click until the response settles; then the card leaves the rail and
  focus moves to the next card.
- **S7.** "yes all" sends one `answer` per approve decision, in number
  order, each recorded on its own (model 5.6). It never sends a batch.
  Every answer on the rail, that one included, is under
  `fw.plan.answer`, so on a hosted tier a viewer reads the rail's
  cards with no answers on them and no "yes all" (249).
- **S8.** Attention lines carry one-word answers: takeover or wait on a
  lost host; ok on a response that could not apply, on an uncovered
  object, on a host that cannot satisfy a repository's environment
  (S174) and on a refused response (S165); placed on a secret the
  machinery cannot place (S123). Each is an `answer` call and is
  recorded (153). An ok is the member's own acknowledgement and clears
  the line on that member's sinks; takeover, wait and placed act on the
  object and are applied once for everyone (S168).
- **S9.** SINCE lists what entered a tail state since this sink's
  delivery mark (14, model 5.5): merged, landed, closed, dropped,
  started, finished, accepted, answered, held. A line names the object,
  the reason and the time. "Later" writes no SINCE line (§5).
- **S10.** The board is the status view (B.4) drawn by phase. It holds
  objects only, never the count. It has three views: phases, map and
  book, switched in the board's header, or with the m key between
  phases and map and the b key between phases and book. The dock opens
  over the board and the board does not move. A focused rail card
  lights its object in whichever view is shown: the marker on a lane,
  the card or edge on the map, the claim block in the book.
- **S11.** Requirements served: 7–19, 141–146, 155, 193–194, 209. Tools
  called from the rail: `answer`.

### 1.2 The board, phases view

- **S12.** Four lanes: Inception, Bolt plan, Construction, Operation.
  Bolt plan is drawn as a narrow hatched gate between Inception and
  Construction: the transition, one proposal per repository in steady
  state. Operation is marked observed and is read-only (181).
- **S13.** Inception shows: the capture box (S30); the curation
  counter (unmoved signals, by source, oldest) with curation's session
  chip; explorations the operator opened (189) as rows; every open or
  proposed intent as a thread with its elaborations as beads; a closed
  intent greyed with its countdown (186). Its head carries the
  "explore…" control, which enters the explore mode (S43, S58); the
  control is behind `fw.ff.explore`, on by default, and the tool
  behind it under `fw.capture.write` (249, 250, S197).
- **S14.** Bolt plan shows: planning in progress as a session row when
  a redo charged it again; the current proposal as a sheet; single unit
  proposals as slips; a baseline as a sheet of its own; a deferred
  proposal or baseline greyed as "deferred · ask again".
- **S15.** Construction shows every open bolt as a ledger: units as a
  left-to-right chain (merged, building, queued), running work items
  with their session chips under the building unit, machinery sessions
  on their own row (a conflict fix), services and the first endpoint at
  the foot, a landing stamp when its request is open. Accepted chores
  show as items on the repository's shared line, in this lane, under a
  "chores" head per repository and never as a bolt (60, §5).
- **S16.** Operation shows every landed bolt as a record while
  something about it is live and for the bounded window after (186),
  with its pull request and checks as a stamp, its environments as
  links, live signals about it as quotes, and "stays · why" or "leaves
  in Nd". Below the records, signals from operation as quotes with
  their move or "unmoved".
- **S17.** Every decision is also a marker on its object: ✓ n for
  approve, ? n for decide, ✎ n for answer, ! for attention, and a
  dashed "deferred · n" for a deferred proposal. A focused rail card
  lights its object. A marker click focuses the card and opens its
  dock page. Nothing is answered on the board.
- **S18.** The phases view never shows: a decision as a card; a
  phase label on an object (phase is the lane's, kind is the shape's);
  the count; anything answered; a finished object past its window.
- **S19.** Requirements served: 141–146, 186, 209–210, 47. Tools called
  from the lanes: `explore` (S43), `capture` and `mark-intent` (S30);
  every other control on a lane opens the dock.

### 1.3 The board, map view

- **S20.** The map view draws the target map (map 4.4) as bounded
  contexts only: one card per context, a computed layered layout
  upstream to downstream, positions fixed after layout, fit the one
  camera command (map 5). Relationships are one typed edge per pair
  with U and D, OHS, PL and ACL marks, a lens for a shared kernel, a
  barred dotted edge for separate ways; a big ball of mud is hatched,
  an external context dashed. An edge that would cross a card bows
  over it.
- **S21.** At rest a card shows its header, name, status, a home chip
  per distinct home with a verdict dot, an attachment count chip, its
  decision markers, an open-question badge and its tags, and carries a
  thumbnail of the map inside it: its elements as dots coloured by kind
  and ringed by home, the links between them as hairlines, a short
  dashed stub toward the other context where an element links out. A
  caption under the thumbnail counts elements, links and links out. The
  thumbnail is read-only. The whole map is readable without opening
  anything; a click on the header opens the dock, a click on the
  thumbnail drills in (map 5.1).
- **S22.** The second level is a drill: the canvas becomes the
  context's inside at full size in the same grammar. Elements are
  nodes with kind, name, home chip with verdict dot, attachment chip,
  markers, status dot, open-question badge with the capture control
  beside it, and tags; links are typed edges with the kind on the edge;
  the neighbouring contexts are collapsed docks at the canvas edges,
  upstream left, downstream right, symmetric above, separate ways
  below, each carrying the pattern and the end marks for its side, the
  kernel, the crossing count, its attachment chip and markers, and a
  "drill into" control; a cross-context link lands on its dock with the
  target element named on the edge. A breadcrumb "org › <context>" sits
  over the canvas; Esc or the org crumb returns to the whole map (map
  5.2).
- **S23.** A strip above the canvas lists the repositories as chips
  with elements homed, capabilities and unmet count, the map check
  (green or n failures), and "+ repository". A control strip carries
  the facets (off, filter, colour, group per facet), a legend when one
  colours, the invariant readout "0 moved · 0 edges changed" recomputed
  after every facet switch at the level shown, the overlay control
  (none, current → target, since last review), "changes · n" when an
  overlay is on, the review mark and "mark reviewed" when the review
  overlay is on, and fit. A kind legend sits at the foot of the canvas.
- **S24.** Overlays come from one id-keyed difference (map 4.4, 4.5):
  added with a plus mark, changed with a delta and the fields on hover,
  removed ghosted, moved with the old home struck through. The marks
  sit on cards and edges at rest, on dots in the thumbnails, and on
  nodes, link edges and neighbour docks when drilled. The review
  overlay uses a second colour over the target only. Either overlay may
  be on; the map underneath is always the target.
- **S25.** The map view never draws: a repository as a node; a claim
  as a node; verdict text or evidence; chapter prose; a lane, tier,
  layer or runtime as a box; the current map as a second drawing; saved
  camera state beyond the one memory of S88 (map 5.5).
- **S26.** Requirements served: 122, 195, 198–202 as rewritten, 104,
  105, 112, 249. Tools called: `attach` (S71), `capture` (S22),
  `create-repository` or `adopt-repository` (S72), `reviewed` (S73).
  The map's writing controls — attach, detach, set-home, set-status,
  map-edit and the repository tools — are under `fw.map.edit`, and
  reviewed under `fw.review.mark`; on a hosted tier a token with
  `fw.read` alone draws the map with none of them.
- **S85.** Every relationship edge at rest carries a pill counting the
  element-to-element links that cross it (map 2.4). Separate ways reads
  "none · by rule", or "n cross · fails" when a link crosses it.
  Hovering or focusing the edge slides out a panel at its midpoint that
  lists the crossing links (from element with its context and home, the
  link kind, to element with its context and home; removed ones ghosted
  under an overlay), the claims attached to the relationship, and
  controls to open the relationship's page or drill either end. The
  panel is the only place a link is listed at rest.
- **S86.** Kinds colour permanently: a dot at rest and a node when
  drilled take the kind's colour from the vocabulary (map 3.1). Homes
  colour rings: a dot's ring and a node's home chip take the home's
  colour, and the repository strip shows the same colours. A colour
  facet overrides the kind colour while it is on and the legend says
  so; turning it off restores the kind colour.
- **S87.** Two focus rings, never merged. The lit ring comes from
  outside the canvas: the rail's focused card, a claim's scope, a
  "light on map" from the dock; it sits on the object the decision or
  claim concerns and leaves when that focus does. The focus ring is the
  canvas's own: j and k move it among contexts at rest and among
  elements when drilled, and Enter acts on it. The two may sit on
  different objects at once.
- **S88.** One camera memory. A drill keeps the whole map's camera for
  the way back, and Esc or the org crumb restores it. Nothing else is
  remembered: no positions, no pan history; fit is the only camera
  command at either level, and fit at the drilled level fits the
  inside.
- **S89.** Ghost placement: under an overlay a removed element,
  relationship or link is drawn ghosted in a place computed around the
  target's objects without moving any of them, at rest, in thumbnails
  and when drilled. The target map's layout never changes for a ghost.
- **S90.** Narrow rendering, under 760px, is a stacked list at both
  levels: at rest every context as its card without the thumbnail,
  with its relationships listed under it with their pattern, marks and
  crossing count; drilled, every element as a row with kind, home chip,
  verdict dot, markers and its links named, then the neighbour docks as
  rows with the pattern and end marks. Drill and back, the dock, the
  overlays and the facets work the same as on the canvas.

### 1.4 The dock

- **S27.** The dock is one panel over the right of the board. Esc, the
  × or a click outside closes it. The rail's move keys change what it
  shows while it stays open. Under 760px it is full screen with a back
  control. Its header takes the form of the object (209); its footer
  carries the object's answers or dictations, or says "nothing to
  answer" and why. Every page that cites a chapter or a claim carries
  "read in book" per citation (S94), and every page for an object with
  OpenSpec artifacts behind it carries "the artifacts behind it" (S99).
- **S28.** Dock pages, one per kind:

| page | opened from | body | footer |
|---|---|---|---|
| decision | a rail card, a marker on a lane, the map or a chapter margin | the decision's text; the evidence its kind shows (S5); its document when it has one, with a plannotator link (S33); its history with the operator's responses; its owner with "assign…" (S170); "read in book" per cited claim; "the artifacts behind it" | the answers, one response each; in-flight state while one is sending; "answered by <member> at hh:mm" with no controls when another member answered it (S167) |
| proposal | its decision | the proposal read whole: every bolt (open or new, name editable) with its units; per unit: name, type, why, dependencies, covered claims with "read in book", lineage, controls bolt · new bolt · rename · type · drop; a refusal inline when an edit would break a dependency, with the offer to take dependents along; "what a yes starts"; the "that's all wrong" field; lineage intent → writeback → landing on the blueprints → planning run → proposal (184) | yes · redo · later |
| unit | its decision or slip | the unit document with a note control per section; items and stages; cited claims with "read in book"; sessions running (none before yes); "change" opening its artifact view once approved, "no change yet" before (187) | yes · drop · redo · bolt · new bolt · rename · type · later |
| bolt | a ledger | the ledger; the bolt's repository, line and place; decisions on it (in the rail, where you answer); its units with drop per unstarted unit and "change" per unit; rename; sessions running with host and last activity; services with start and stop; served endpoints; the acceptance file (S99); history | no decision here that is not in the rail; drop, rename, start and stop are dictations |
| landed bolt | a record | the record; the landing (when, through which gates, place removed); pull request and checks; environments; units landed; the acceptance file; signals from operation with their move | nothing to answer |
| intent | a thread | the thread; the intent's state and line; decisions on it; sessions running; its change directory (S99) | its decision's answers when one is pending, else nothing to answer |
| elaboration | a bead; ] and [ from the thread | kind, type and state; its pending decision with the answer controls; its document excerpt; the records it wrote into the intent's change directory (187), opening the change directory view; its session chip; "in gathering n" when covered (188); the countdown when finished (210); a knot in the header and a back link to the thread | the decision's answers; finish on a standing one; nothing else |
| exploration | its row in Inception | the covered intents; where its records go (per intent) and where its conclusions go (the book, once); its session | finish (standing) or end (with-operator) |
| planning in progress | its row in the gate | what planning reads; the operator's notes it carries; its session | nothing yet; the next proposal is the decision |
| deferred | its greyed sheet | when later was answered; that it left the count, wrote no SINCE line, and is superseded silently by planning's next run (172, 35) | ask again |
| repository | the strip, a home chip, a baseline's link, a library row | kinds and capabilities, derived (map 4.3); contexts it homes; claims in scope with verdicts, each claim's attachments beside the re-attach control and "read in book" (195); homed elements; its environment declaration and, per host, whether the host satisfies it (S174); decisions on it | show on map; the baseline decision's answers when one is pending |
| host | the host strip | alive or gone with last heartbeat; what it runs against its bound; its leases; its environment provider and the repositories it cannot satisfy (S174); its pool when it belongs to one (S176); "hosts" opening its row on the hosts surface (S115) | takeover · wait when gone; nothing to answer when alive |
| claim | an attachment chip, a repository's claim row, a claim name anywhere | the claim text and version; attached to (each attachment with its scope contribution); scope, derived; verdicts per repository in scope; "read in book"; "evidence" opening the claim's artifact view | re-attach… (arms the canvas, S70); show on map |
| map context, element, relationship, link | a card header, a node, an edge or its panel, a neighbour dock | id, ref to the chapter with "read in book", status, tags; the overlay difference when one is on; home (effective and where it came from); ends and marks for a relationship with its crossing links; crossing for a link; attached claims with the derived scope line; verdicts per repository; decisions as markers with the rail card inline; an open element's question with its capture control | open on map · drill into · light on map |
| changes | "changes · n" on the map or the book | the difference list with a link per entry, map entries to their object and book entries to their anchor; the review history when the review overlay is on | mark reviewed (review overlay only) |
| map check | the check button | every failure, or green | "+ repository homes the unhomed" |
| add repository | "+ repository", the check page | name; the unhomed elements it homes or a context it becomes the default home of; kinds and capabilities derived live; the claims that fall into scope | propose: one response (S72) |
| attention | an attention line | what it means and what each answer does | the one-word answers |
| external system | a dashed card | what it is; who meets it; that a claim on the contract is in scope for every repository that meets it | nothing to answer |
| artifact | "the artifacts behind it", "change", "evidence", a work-item chip, the acceptance link | one view per artifact kind (S99) under a source bar (S100) | open source · review; the pending decision's answers when one is pending on the artifact |
| work item | a chip on a ledger or in a dock | its commits in Conventional Commits form, the deliverables it recorded, its session's report, its session chip | nothing to answer; reply when the item is blocked (S49) |

- **S29.** Requirements served: 17, 47, 68, 141, 144, 146, 172, 184,
  187–188, 195, 209–210, 213. Tools called: `answer`, `drop`, `rename`,
  `start`, `stop`, `finish`, `end`, `release` (ask again, §6), `attach`,
  `capture`, `create-repository`, `adopt-repository`, `reviewed`.

### 1.5 The capture box

- **S30.** The capture box sits at the head of Inception. Typed text
  is sent unparsed to the `capture` tool as a capture with one signal of
  kind ask, source the page (19, 194). A "this is an intent" toggle
  makes the same submission also call `mark-intent` on the capture
  (12). Both are under `fw.capture.write`, so on a hosted tier a
  viewer reads the page with no capture box at all (249). Under the box the page says what it will send: "will send:
  capture" or "will send: capture · intent". Enter sends. The page
  acknowledges the recorded response (154) and the curation counter
  moves by one, or the new intent appears as a thread.
- **S31.** The capture box never interprets a word of its text: no
  command grammar, no name resolution, no dictation. Free text that
  should become a tool call goes through the interpreter (S34), not the
  capture box.

### 1.6 The chat rendering

- **S32.** The chat carries the same decisions and numbers as the page,
  one line each in the rail's order, the SINCE tail, and a link to the
  page (18, model 5.5). A decision line is answerable; any other line is
  not. Where the platform offers buttons, menus or threaded replies, the
  decisions carry them as the platform provides them; nothing is
  invented (155). The numbered reply grammar always works beside them:
  `yes 412`, `yes all`, `no 415`, `415 pick a c`, `413 redo: <notes>`,
  `413 bolt other`, `414 rename retry`, `418 close`, `419 keep`,
  `421: <text>`, `takeover`. Every reply is the `answer` tool; the ✅
  reaction is the operator's proof it was recorded (154).
- **S33.** A decision with a document carries the link that opens it
  on the review surface (model 5.4). The chat's binding is the Discord
  bot; the presenter is the sink's lease holder or the manifest's pin.
- **S34.** Free text in chat goes to the organization's dispatch agent
  as interpreter: it proposes exactly one tool call as a reply with a
  confirm control, and the confirmation is the response (194). On the
  page the interpreter is a model in the browser, and a control is a
  tool call with no interpreter at all. On the hosts surface the same
  job is a host's part named "agent" (S116).
- **S173.** The chat is per member (236, 236a): each address a
  member's operators entry carries is a direct message from that
  kind's bot, a sink of its own with its own mark and the member's
  filter (S171), presented by the host that runs the kind's package
  and holds the lease; a member with no address gets no chat. A
  shared channel the manifest names is one sink with one mark,
  delivered under all. A reply in a member's direct message carries that
  member's identity; a reply in a shared channel carries the identity
  of whoever typed it, as the platform vouches for it. An answered
  decision's line in a channel reads "answered by <member>" on the
  next delivery and takes no further reply (S167).

### 1.7 The review surface bindings

- **S35.** A document under review (a unit proposal, a planning
  proposal, an elaboration's document) opens in plannotator:
  `plannotator review <path> --decision <n>`. An annotation the operator
  leaves there comes back as the response on that decision (17, 129).
  A rich page opens in lavish (`npx -y lavish-axi`). Both are bindings
  of the review surface, not parts of the machinery.
- **S36.** The page shows the document inline in the dock with a note
  control per section; a note sends `answer` with redo and the note
  prefixed by the section. The dock never replaces plannotator; it is
  the summary and the place to answer (plan-mockup, "The unit
  document").
- **S37.** The book and the context map are the operator's review
  surface (122). The review view is what changed in both since the
  `reviewed` mark: on the map, the review overlay and the changes page;
  in the book, the review overlay of S96. One mark, one switch, one
  "mark reviewed" for both.

### 1.8 The status view on a phone

- **S38.** Under 760px the plan page is two tabs at the foot,
  Decisions and Board, each with its count badge. The rail is the
  Decisions tab, unchanged. The Board tab stacks the four lanes in
  order; its header switches to the map, rendered as the stacked list
  of S90, and to the book, rendered as one chapter column with the tree
  behind a control. The dock is full screen with a back control. The
  header hides the key hints and the "yes all" numbers. The machinery
  strip stays one scrolling row; the flywheel panel is reached from the
  board header (S110). The account item stays in the header and its
  menu opens full screen with a back control. Promoted to 307: the
  layout is a requirement of the first build, not a ruling this
  document may revisit on its own.
- **S39.** The phone keeps every form of §3 and every control of §1.
  Nothing is answerable on the phone that is not answerable on the
  desktop, and nothing the desktop answers is missing on the phone (2,
  155). Promoted to 306, with the deep links, the notification, the one
  request, the touch rule, the console and the clients beside it in A.38
  (306–314). What is open here is the layout beyond the stacked list
  (S78) and the thumbnails (S151), never whether the phone answers.

### 1.9 The board, book view

- **S91.** The book view is an mdBook-style viewer the page draws
  itself. The organization's blueprints are mdBook sources in the blueprints
  repository; the server serves each chapter, and the page draws the
  chapter tree, one chapter at a time with previous and next, headings
  with anchors, and the claim blocks as the flywheel renders them. The
  view is entered with b or from the board's header, and b leaves it.
  The rail stays beside it and j and k walk the rail only. The view is
  behind `fw.ff.book-view`, on by default (250, S197): with the flag
  off the board's header carries no book entry and b does nothing.
- **S92.** A claim block shows the claim's name and version, standing
  or proposed (98), what it attaches to, the scope line derived from
  its attachments (200), and one verdict dot per repository in scope
  read from the ledger (100, 101). A proposed claim is dashed and
  carries no verdicts. The block carries "evidence", opening the
  claim's artifact view (S99), and its decision markers in the chapter
  margin.
- **S93.** The rail drives the viewer. A focused card jumps the book
  to the chapter and anchor the decision concerns and lights the block:
  a unit's cited claim, an intent's chapters, a bolt's or a landing's
  claims, a proposal's claims per unit, a gathered elaboration's shared
  claim, a moved claim itself. A ref in the book in hand wins;
  otherwise the first ref, which loads its book. Decision markers sit
  in the chapter margin beside the block they concern, in the glyph set
  of S17; a click focuses the card and opens its dock.
- **S94.** "read in book" appears on every dock page per cited chapter
  or claim (S28) and in the map's scope box. It switches to the book
  view at that anchor and closes the dock, which would otherwise cover
  the page; Enter reopens the dock on the focused card.
- **S95.** The library is an overlay over the board, opened from a
  control in the book header. It lists the organization's blueprints with
  chapters, claims standing and proposed, last written, unmet verdicts,
  "changed since review", and the repositories each book covers.
  Choosing a book loads it; a repository chip goes to the map view and
  opens the repository dock; Esc closes. The flywheel's own surface
  specification is listed as a shipped book (212).
- **S96.** The review flow is one flow for the map and the book (122).
  "since last review" is the same switch and mark in both views. In the
  book, changed paragraphs and claim blocks are outlined and washed
  with a note, unchanged chapters dim in the tree, and a changes list at
  the head of the tree links each change to its anchor and opens the
  changes page (S28). "mark reviewed" sends `reviewed` once (S73); the
  mark moves and both views empty.
- **S97.** The book view never shows: a decision as a card; the count;
  a claim's verdict text or evidence inline (the dot links to the
  artifact view); an editor. The book is read here and written only by
  the machinery (98, 121).
- **S98.** Requirements served: 98, 100, 101, 121, 122, 200, 212.
  Tools called: `reviewed`.

### 1.10 The artifact views

- **S99.** Every object opens the OpenSpec artifacts behind it in the
  dock, one view per artifact kind, derived at the shared line when
  opened and never stored (213):

| artifact | opened from | view |
|---|---|---|
| an intent's change directory | the intent and elaboration docks | proposal.md rendered; the records with kind, date and session (187); the delta specs grouped added · modified · removed as requirement blocks with scenarios folded under a disclosure; design.md; the archive state |
| a unit's change on its bolt's line | the unit dock's "change", the bolt dock's "change" per unit | the OpenSpec steps ff · apply · verify · archive as a stepper with the unit type's stage under each; the proposal; requirement blocks with scenarios; tasks.md as a checklist saying which item and commit did each task |
| a claim | "evidence" on a book block, a claim name in any list or repository row | the chapter block; its version history; attachments; a verdict per repository in scope with the as-built statement, its commit and its session as evidence; "read in book" |
| a bolt's acceptance file | the bolt and landed-bolt docks | the claims its units named with their scenarios; the landing state; previewed from the specs before landing, read from the file after |
| a work item | every work-item chip | its commits in Conventional Commits form; the deliverables it recorded; its session's report |

  A unit proposal before its yes has no change to open and says so
  (187). An object with no artifact yet opens a skeleton derived from
  the state so every object opens.
- **S100.** Every artifact view is headed by a source bar: "derived
  from <repository @ sha> · <path> · read hh:mm · never stored · edits
  only through review", with two controls: "open source", the path at
  the shared line, and "review", which switches to the review binding
  (S35) for that artifact with `--decision n` when a decision is pending
  on it. The review page is the document with a note control per
  section and the pending decision's answers in the footer.
- **S101.** An artifact view never edits: no field writes the file, no
  save exists. A note is a response (S36); everything else is the
  machinery's (187, 176).
- **S102.** Requirements served: 176, 187, 210, 213. Tools called:
  `answer` through the review binding.

### 1.11 The flywheel instrument

- **S103.** The flywheel is one instrument with one reading, runway
  in days: approved construction work not yet merged (queued and
  building units, as their estimates less the slot-days already
  occupied, 172) divided by drain, where drain is the alive hosts'
  summed bound at the calibrated rate (S145), pool hosts included
  (S177). A gone host drains nothing. It is drawn as a wheel on a
  week's scale, a band naming its state ("primed for 5 days", "running
  dry", "primed for a week or more"), and is opened from the machinery
  strip's pill or with w (214).
- **S145.** The calibrated rate is derived, never a constant: the
  ratio of actual to estimate over the landed units of the repository
  and type, read from the acceptance files, and 1 while none has
  landed (surfaces.yaml `instrument`). The drain column names the rate
  it used and how many landed units it rests on.
- **S104.** Three columns under the wheel: feed, what waits on the
  operator (proposals to approve with the units they carry,
  elaborations waiting, intents to approve) and the days a yes on each
  adds; pressure, what is approved and waiting or running against the
  alive slots, and the number behind the bound; drain, hosts alive of
  hosts, the pool's live of bound when one exists, utilization, units
  merged per day at the bound, a seven-day merges sparkline, bolts
  landed per week labelled "history, not a target" (142), and, when
  the organization has no pool, "add a host to drain faster" opening
  the hosts surface on "+ host".
- **S105.** Above the wheel, the two stages of backpressure as a
  two-stage pipe: inception (signals → intents → elaborations →
  proposals) filled by what waits on the operator, a hatched gate,
  then construction (approved → running → merged → landed) filled by
  queue over alive bound and drawn as tall as the alive hosts' bound,
  so an added host visibly widens it.
- **S106.** One reading sentence, chosen in order: "you are the limit:
  n decisions older than a day · yes on <number> alone adds ~d days"
  when decisions are old and runway is under two days; "feed it: n
  decisions approve ~d days of work"; "drain is the limit: add a host ·
  n items on m alive slots" when the organization has no pool, and
  "drain is the limit · pool l of b · n items on m alive slots" when it
  has one (S177); "primed: agents have d days". Every reading is marked
  a projection, never a target.
- **S107.** The unattended streak is the score, stated as a reading:
  "agents have run 1d 19h without you", since when, what puts it at
  risk now (a gone host holding items, a secret waiting, runway under a
  day), the longest streak, and the last one with what ended it. A
  streak counts while approved work runs and nothing stops it;
  decisions arriving do not end it, they are the feed.
- **S108.** The three phase gauges with their sparklines and readings
  sit under an "advanced" disclosure whose open state persists across
  renders. They are never the first thing shown.
- **S109.** The compact form in the machinery strip is one pill: a
  small wheel, the runway number and the streak, "at risk" when
  something threatens it. It opens the panel like w.
- **S110.** The key is w. l stays the focused card's later (S56); a key
  a card does not offer is refused, never remapped (S57). Under 760px
  the panel is reached from the board header and the columns stack
  under the wheel.
- **S111.** The instrument never shows: a target, a goal line, a
  score for the operator, a decision or an answer control. It reads;
  the rail answers.
- **S177.** Drain counts pool hosts (242). A pool host that comes
  alive or retires moves the drain, and the instrument shows the move
  as "drain changing · pool l of b" in the drain column and on the
  pill until the next read settles it; the machinery's own additions
  and retirements are never a decision and never a line in the rail.
  With a pool at its bound the reading says so, "drain is the limit ·
  pool at bound · b", and the drain column's control opens the pool's
  row on the hosts surface, where the bound and the cost ceiling are
  the manifest's (S155).
- **S112.** Requirements served: 142, 145, 214, 242. Tools called:
  none; "add a host" and the pool control open the hosts surface.

### 1.12 The hosts surface

- **S113.** Hosts is an overlay over the board, opened from the
  account item's hosts entry (S157), from the setup control in the
  hosts strip, from a host's dock page, from the flywheel's "add a
  host" or its pool control, or from an attention line about a host.
  Everything on it past the one host serving the page is behind
  `fw.ff.management-console`, off by default (250, S197): with the
  flag off the account item's hosts entry opens the serving host's own
  screen and the list of hosts is not reached, which is where a
  `github` host stands. Its writing controls are guarded by
  `fw.hosts.manage` and `fw.packages.manage` on a `frontegg` host and
  held by every listed operator on a `github` host (248, 249). It is separate from the
  operator's decisions: nothing on it is in the count until a flow on
  it raises a decision, which then appears in the rail like any other
  (229).
- **S114.** Hosts is a settings screen: on the left one row per host
  and one row per pool, and on the right the detail of the row in
  hand. A host row shows kind and platform (a laptop or a home host on
  herdr, a container on flywheel-cloud, the dispatcher placement with
  bound 0, a pool host with its pool chip), alive or gone, bound, when
  it joined, its environment provider, and what it runs as chips. A
  pool row is S176. A dispatcher placement is only what a host runs; a
  host with bound 0 takes no construction work and changes no runway
  reading (dispatch 2, 5).
- **S115.** A host's detail is organised by headings, one per kind of
  thing a host runs or is bound to, each heading holding a slot or a
  list of slots: identity, no slot at all but the kind the host
  declares, read-only — `github`, with the device flow and no
  environment, or `frontegg` with its environment and the served name
  the redirect is built from (S164, 243, 244); router, one slot (191); runners, one slot per role (pane ·
  in-process · managed, dispatch 2); agent, one slot (S116); sinks, a
  list, each with a "lease" badge on the sink whose presenter lease
  this host holds (148); adapters, a list, each naming its source
  (dispatch 4); triage, derived from the manifest with the sources it
  reads and no slot; environment, the provider in force (devenv ·
  devcontainer · nix · image) and the repositories it satisfies or
  cannot (S174); the git App, no slot either but which App reaches the
  repositories and where its key is (S198); pool, the pool it belongs
  to when it does (S176), with
  its joining record (S122). A slot shows the package's name and
  version and its state: installed · adding, decision n · needs a
  secret, under attention with "place it" (S123) · installing ·
  disabled, with "enable" as one logged response. An empty slot says
  what the heading takes and carries "add" (S117). A heading the host's
  platform cannot take says so.
- **S198.** The host's screen says which GitHub App reaches the
  repositories and where its key lives (207, 207a). A self-managed
  organization uses its own App: the heading reads the App's id from
  the manifest and shows the key's path on this host with "placed" or
  the attention line that asks for it, never a value (S123, S187). The
  hosted tiers use the service's App: the heading says so, shows no
  path and offers no control, because the key never leaves the service
  and a pool host asks the service for its installation tokens. Either
  way the tokens a session gets are short-lived, scoped to one
  repository, and no host or session uses a personal token or an
  operator's identity for git (251).
- **S116.** The host's "agent" is the name on this surface for the job
  that reads the plan and the objects, answers the operator in chat,
  and proposes writes as tool calls the operator confirms (194): the
  dispatch model's interpreter job. The chip's hint says so: "reads and
  answers; every write is a proposed call you confirm". The model keeps
  "interpreter"; the surface says "agent".
- **S117.** "add" on a slot opens the catalogue filtered to that slot,
  behind `fw.ff.store`, off by default (250, S197): with the flag off
  an empty slot says what it takes and carries no "add". The catalogue lists
  the per-host packages of the heading's kind that run on the host's
  platform, with "any platform" showing the rest greyed with what they
  need (228). Each entry shows name, version, "shipped" or "index",
  what it needs (secrets, platform, network), what it enables, and
  "add". There is no single index across kinds and no search box over
  the whole store; a search box sits inside the filtered catalogue.
  Organization packages never appear here; they are the organization
  store's (S156).
- **S118.** "add" is one flow. It collects the package's configuration
  against its schema and names the secrets it needs in one form, says
  which secrets the machinery places and which the operator must place,
  and ends by raising one install decision in the rail (approve · yes ·
  no, kind package-install). The slot reads "adding · decision n" the
  moment the flow ends. The decision's yes runs the install as the
  machinery's effects with proofs (204, 229): the slot reads "needs a
  secret" while a declared secret is unplaced (S123), then "installing"
  while the effects run, then installed once the proof is recorded;
  no takes the package off the host again. Nothing is installed by the
  flow itself, and no session is charged for an install.
- **S119.** Configuration is changed later on the same surface: a
  slot's detail shows its configuration with the same form, and a
  change is one logged response that the machinery applies as a
  re-install of that package. A secret is never shown back; a changed
  secret is placed again through "place it". A slot also carries
  disable, enable and remove, one response each: remove ends what the
  package runs and keeps its records (229).
- **S120.** "+ host" is a guided flow on the same surface, in order:
  pick a platform (flywheel-cloud managed · a container on any platform
  · a laptop) and a name; pick the parts it will run, heading by
  heading, from the filtered catalogue of each; provisioning runs from
  the host you are on with your own platform credentials, read at run
  time and never stored; only the chosen parts' secrets are listed for
  hand-over into the platform's secret store, and you hand them over;
  an enrolment decision appears in the rail ("enrol host <name>",
  approve · yes · no, kind host-enrol) with a one-time token that
  expires in 24h; the host joins with the token by one command (205),
  reads the manifest and installs its declared parts; the row shows
  alive. A platform host is created from the organization's image, or
  its pool's (S175). Each step shows its state (queued · running ·
  waiting on you · done · skipped · stopped) and the flow ends with the
  new host row alive in the strip and the list (230). A token that
  lapses is the host-enrol-lapsed attention line (S146).
- **S121.** "adopt existing" is enrolment by token alone: a host
  already running the binary skips platform, provisioning and the
  hand-over and goes straight to the enrolment decision and its token.
- **S122.** A host's own joining is folded into its detail as the
  record of how it joined, the same steps with their outcomes; the
  cloud host's detail carries it like any other, and a pool host's
  names the demand that added it.
- **S123.** A secret the machinery cannot place (207) sits under
  attention with "place it": the secret's name, where this host keeps
  its secrets (the keychain or a sealed file under the root on a
  machine, the platform's secret store on a platform), the command to
  run there, that the page never carries the value, and a one-word
  "placed" answer, under `fw.secrets.place` (249), that has the
  machinery check the path. The slot in
  "needs a secret" shows the same form in place. The slot links to the
  attention line and the line back to the host; the strip's setup
  control carries "secret" while one waits (149).
- **S174.** Environment. A repository's dock shows its environment
  declaration, the file under the prefix or the devcontainer or devenv
  file it names, with the declaration's hash, and one line per host:
  the host's provider and satisfied, or the first tool and version it
  cannot produce (238). A host's environment heading shows the same
  from the host's side. A host that cannot satisfy a repository raises
  the host-environment attention line, "host <name> cannot satisfy
  <repository>: <tool> <version> · covers none of its work", with ok
  as the member's acknowledgement (S8); the line links to the host's
  environment heading and to the repository's dock, and the host's
  strip pill carries the count of repositories it covers none of. The
  page changes no provider; a provider is a host's declaration, changed
  where the host is declared (S155, S147).
- **S175.** The image. A platform host is created from an image built
  from the declarations of every repository it will cover (239). The
  image is shown where it is used: on a pool row, and at the head of
  the hosts list for the organization's image that "+ host" on a
  platform takes. It shows its tag, the declarations' hash, and its
  state: current · behind, with the repository whose declaration moved
  · building. "rebuild" on an image behind raises the rebuild as a
  chore, accepted like any chore and shown under the chores head of
  Construction (123, S75); the image reads building while the chore's
  session runs the build effect and current when the platform lists
  the new tag. A pool whose image is behind provisions no host until
  it is current, and its row says so.
- **S176.** Pools, behind `fw.ff.pools`, off by default (250, S197):
  with the flag off no pool row is drawn on the hosts surface, the
  strip shows no pool pill and the flywheel offers no pool control,
  and the settings form's pools fields are absent, which is where a
  `github` host stands. A pool row shows the pool's name, platform, image
  state (S175), live hosts of bound, the cost ceiling the manifest
  names, its retire time, and what it covers (240). Its hosts are
  listed under it, collapsed by default, each a host row of S114 with
  a pool chip; a pool host retiring shows "retiring · idle 12m" and
  leaves the list when the platform ends it, and its places are
  re-made from their lines elsewhere by the machinery (52). In the
  machinery strip a pool is one pill, "pool <name> · l of b", and a
  session chip on a pool host names the host with its pool. Nothing on
  a pool row adds or retires a host: the machinery does both while
  drain is the limit, within bound and cost (242, S177); the bound,
  the cost and the retire time are changed in settings (S155). A pool
  host that retires raises nothing; one lost otherwise is a host lost
  like any other (S50).
- **S124.** The hosts surface never: installs anything without a
  decision; charges a session for an install; shows a secret's value;
  stores a platform credential; enters the count by itself; runs a
  ladder or an order of installation; draws one index across every
  kind; lists an organization package; adds or retires a pool host by
  hand. Every placement of the dispatch model (dispatch 5) is a host on
  this list with the parts it runs.
- **S148.** The tools the surface calls (surfaces.yaml `tools`):
  "add" ends in `add-package(package, host, config, secrets)`, which
  writes the package in added and raises the install decision; a
  configuration change is `configure-package`; disable, enable and
  remove are `disable-package`, `enable-package` and
  `remove-package`; "+ host" and "adopt existing" end in
  `add-host(name, platform, parts, adopt)`, the credentials carried in
  the call and stored nowhere; "rebuild" is `propose-chore` on the
  blueprints; "placed", "enable" on an attention line, and the install
  and enrol decisions are `answer`. Nothing on the surface calls
  anything else.
- **S125.** Requirements served: 149, 191, 204, 205, 207, 207a,
  228–230, 232, 238–242, 243–245, 249–252. Tools called: `answer`, `add-package`, `configure-package`,
  `disable-package`, `enable-package`, `remove-package`, `add-host`,
  `propose-chore`.

### 1.13 The account item

- **S152.** A standard account item sits at the right of the header:
  who you are, as a chip. It expands to a menu in a fixed order: the
  identity block (S166), the organization switcher, then settings,
  hosts, the organization store, and sign-out. It is the one place the
  page reaches the organization as a whole rather than an object in
  it. Nothing in the menu is in the count; a flow in it that needs the
  operator's yes raises a decision in the rail like any other.
- **S153.** Who you are is the identity the serving host's kind
  vouched for (243, 246): the GitHub username on a `github` host, the
  Frontegg user on a `frontegg` host, with the GitHub username its
  connection carries beside it in the identity block because
  authorship is the GitHub username either way. It is the same for
  every organization the host serves (S164). There is no signed-out
  page and no local-user case. Sign-out ends the page's session with
  the host's kind and records nothing (233).
- **S154.** The organization switcher lists every organization the
  serving host has a root for (218), each with its decision count,
  and marks one the signed-in identity is not a member of as "not a
  member" — not in its operators list, or on a `frontegg` host not
  assigned the flywheel Application on its account (247, S166).
  Choosing a member organization swaps the whole page to it: the rail,
  the board in every view, the machinery strip's hosts and
  repositories, the flywheel reading, the blueprints and the map. The
  as-of time is that organization's read. Nothing carries across: no
  focus, no open dock, no mode, no overlay, and never the identity,
  which is the host's kind and the same for every organization on it
  (233). The page's address is the host's one address with the
  organization in the path, `/<org>/…` (205a) — on the operator's own
  computer a localhost port, any port — so a link opens it directly
  and the chat's link (S32) lands on the right one.
- **S155.** Settings is the manifest as a form: the organization's
  declarations grouped as the manifest groups them, profile, defaults
  per role (173), the shared sinks and their presenters, pools with
  bound, cost and retire time (240), routers, raw stores, callers,
  curation and triage cadences, each field with what it is and where
  the machinery reads it. The `operators:` list is one of its fields,
  each entry a member with their addresses per chat kind (236a), and
  how much of it the form edits is the host's kind (247). On a
  `github` host the list is authored whole: adding a GitHub username
  adds a member, removing one removes them, and a save that would
  remove the saving identity is refused inline. On a `frontegg` host
  the identities and their roles are derived from the account at every
  fetch and shown read-only, the addresses staying the one authored
  thing beside them (248, S195). Save is one `configure-organization`
  response for the whole form; the machinery applies it as one manifest
  commit and the page re-reads. The form is under `fw.org.configure`
  and reads read-only without it; retiring the organization is
  `fw.org.remove` and belongs to an owner alone (249). A secret is
  never a field: it is placed (S123). A host's
  keys — root, bound, declaration, provider, identity environment,
  router — are shown read-only with a link to the host's own screen
  (205a), a repository's are derived, and the form says so beside each
  field it does not carry.
- **S195.** On a `frontegg` host the members section is where identity
  administration happens, and there is no second console (255). Beside
  the read-only list sit "invite…", and per member "assign", "revoke"
  and a role choice; a flags list on the same section carries a
  per-account toggle. Each is one recorded tool call under
  `fw.identity.admin` (153): `invite-member(organization, email)`,
  `assign-application(organization, user)`,
  `revoke-application(organization, user)`,
  `set-role(organization, user, role)`,
  `target-flag(organization, flag, on)`. Revoking a member's
  assignment takes their page sink and their chat sinks with it
  (236a); their addresses stay on the entry until the form removes
  them. A member without `fw.identity.admin` reads the section and
  sees no control on it. A `github` host has no members section at
  all: the operators list on the settings form is the whole of
  administration there, edited and saved like any other field (S155).
- **S156.** The organization store is behind `fw.ff.store`, off by
  default (250, S197): the menu carries no store entry unless the flag
  is on for the account, so a `github` host shows none. It is
  a settings screen of the same
  shape as a host's detail (S115): headings for unit and elaboration
  types, deliverable producers, map vocabularies, templates and
  scenario packs (190, 208), each a list of slots showing the package's
  name, version, "shipped" or "index", and its state in the blueprints:
  installed · adding, decision n · installing · disabled. "add" on a
  heading opens the catalogue filtered to that heading's kind (S117)
  and runs the one flow of S118 without a host: configuration
  collected, then one install decision on the organization; its yes
  installs the package into the blueprints repository as the
  machinery's effects and the default set (190) grows. Every control
  on it is guarded by `fw.packages.manage` (249). Nothing here names a
  host and no index spans the headings.
- **S157.** Hosts in the menu opens the hosts surface of §1.12, behind
  `fw.ff.management-console` for everything past the one host serving
  the page and off by default (250, S197). The strip's setup control
  opens the same surface; it is a shortcut to hosts and to nothing
  else. On a `github` host, where the flag stands at its default, the
  menu's hosts entry opens the serving host's own screen.
- **S158.** The account item never: answers a decision; shows a
  secret's value; lists an organization the serving host has no root
  for; opens a control in an organization the identity is not a member
  of; changes the identity on a switch; installs anything without a
  decision; mixes an organization package into a host's store or a
  host's part into the organization store; lets a flag stand in for a
  permission (250, S197).
- **S159.** Requirements served: 149, 173, 190, 203, 205, 205a, 208,
  218, 233–234, 236a, 243, 246–250, 253, 255. Tools called: `answer`
  (the install decision), `switch-organization`,
  `configure-organization`, `sign-out`, `add-package` (the package store's
  add, with no host), and on a `frontegg` host `invite-member`,
  `assign-application`, `revoke-application`, `set-role`,
  `target-flag`.

### 1.14 Identity, members and owners

- **S164.** Identity is a host binding with two kinds, one kind per
  host and the same for every organization it serves (243). On a
  `github` host — every self-managed host — the page signs in with
  GitHub's device flow: it shows the code and the address to enter it
  at and waits until GitHub confirms, and the identity is the GitHub
  username (246, 253). The page serves on a localhost port, any port,
  with no proxy and no name asked of the operator; several hosts on
  one computer are several ports (232, 245). Portless or a local proxy
  may be advised for a stable name and is never required; the flywheel
  serves no name of its own and registers no redirect. On a `frontegg`
  host — the hosted tiers — sign-in is the provider's hosted login on
  the page: the SDK builds the redirect from the origin the page is
  served on, so the host's served name is the only per-host fact and
  it is registered once on the environment's redirect list, never per
  organization (244), and the identity is the Frontegg user with the
  GitHub username its connection carries used for authorship (246).
  Authorship is the GitHub username in both kinds. Switching
  organization never changes the identity in either (233). An
  organization that needs its own directory connects it to its
  Frontegg account on a hosted tier, never to a host, and no host runs
  a sign-in part.
- **S165.** Every response the page records carries the identity
  (153), and what admits it depends on the host's kind. On a `github`
  host membership is the manifest's authored operators list: the tool
  server checks the caller against it before any op-response is
  written, and every listed operator holds every permission on their
  own organization (247–249). On a `frontegg` host the two gates are
  separate. Membership admits the identity to the organization, as the
  assignment of the flywheel Application to its account (247), and a
  caller the account does not assign is refused. Permission authorizes
  the tool: the tool server reads the caller's token for the
  permission the tool declares, on that account, and refuses a call
  without it (249); a tool whose permission the host's environment
  lacks is refused with that reason (252). Every refusal, in either
  kind, writes no response, is recorded to the run record with the
  identity, the tool and the object (79), and shows inline on the
  control that sent it and under attention on the next delivery with
  ok as the acknowledgement (S8). The read-only query tools answer any
  identity the organization admits.
- **S166.** The account item's identity block shows the identity the
  host's kind vouched for, the host serving the page and its kind, and
  the organizations on this host the identity is a member of, each
  with its sinks line: the page sink and one chat sink per address the
  member's operators entry carries (236a), each with its kind, its
  mark and the host presenting it. On a `github` host the identity is
  the GitHub username and there are no roles to show, every listed
  operator holding every permission. On a `frontegg` host the block
  names the Frontegg user, adds the GitHub username its connection
  carries and what authorship uses, carries "connect GitHub" for a
  user with none, and each organization shows its roles from the token
  (248). An address whose kind no host runs shows its sink as
  undelivered with "add a <kind> sink on a host", opening the hosts
  surface on the sinks heading (S115). The switcher (S154) lists the
  member organizations with their counts and nothing else; a
  non-member organization does not appear (S191).
- **S196.** A `frontegg` host degrades and does not fail when the
  provider is unreachable (254). A token already issued is honoured
  until it expires; past that the page is read-only — the status view,
  the board in every view, the book, the map and the rail's decisions
  all render, and every control that would write is absent, the
  capture box included. One attention line says identity is
  unreachable and since when, and it stays for as long as it takes,
  unbounded. Work is unaffected: hosts cover work with the App's
  installation token, not with an identity (207, 251), so the loops
  keep running and the numbers keep moving while nothing that needs a
  response is answered. Flags fall back to their last-seen values,
  then to their definition defaults, so a surface a flag hid stays
  hidden. A `github` host has no provider to lose: GitHub unreachable
  blocks a new sign-in and nothing else, and a page already signed in
  goes on writing.
- **S197.** A flag hides a surface and never authorizes (250). Five
  flags are keyed `fw.ff.*`: `fw.ff.pools` hides the pool rows and the
  pool control (S176), `fw.ff.book-view` the board's book view (S91),
  `fw.ff.explore` the explore mode (S43), `fw.ff.store` the
  organization store and a host's catalogue (S117, S156), and
  `fw.ff.management-console` the hosts surface past the one host
  serving the page (S113). A hidden surface's entry, control and key
  are all absent rather than greyed, and the tool behind it is still
  guarded by its permission, so a call that reaches it another way is
  refused exactly as it would be with the surface shown. On a
  `frontegg` host each flag is an entitlement feature targeted per
  account. On a `github` host every flag stands at its definition
  default, so the page there draws the book view and explore and draws
  no pools, no store and no hosts surface past its own host; nothing
  on that host can turn one on.
- **S167.** One board per organization (235). Every member reads the
  same rail with the same numbers and the same count, and there is
  nothing per member on the board but the delivery mark (S168) and the
  filter (S171). A decision one member answers is applied once; every
  other member's rail drops it on the next delivery and SINCE gains
  "answered · n · by <member> at hh:mm". A card in hand when another
  member answers it turns to "answered by <member> at hh:mm" with its
  controls gone; a click that races the record is refused before any
  record exists, with "already answered by <member>" inline on the
  card, and nothing is recorded for it.
- **S168.** Sinks are per member (236) and chat sinks per address
  (236a). A member is an entry in the operators list on a `github`
  host, or a user the account assigns the Application to on a
  `frontegg` host (247); the page sink follows the membership, keyed
  by the identity, and a chat sink follows each address on that
  member's entry, one per chat kind (discord: a user id, slack: a
  member id), each with its own delivery mark. An address is added or
  removed in the same write as the entry, so a member with no address
  has a page sink only, and ending the membership takes every one of
  that member's sinks. A chat sink is presented by
  whichever host runs that kind's package and holds the lease (148).
  A shared channel is one sink with one mark and no member. So SINCE
  is what entered a tail state since this member's last look on that
  sink, an ok on an attention line clears it for this member alone,
  and a notification is routed to a member's sinks. Takeover, wait,
  placed and every numbered answer act on the object and are applied
  once for everyone (S167).
- **S169.** A decision may carry an owner: one member, never a role
  (237). The owner is set by planning's proposal per
  unit, by a unit or elaboration type for its decisions, or by a
  member's assign (S170); an unowned decision is everyone's. The owner
  shows as one chip on the decision's object, the unit slip or its
  row in a proposal, the elaboration's bead, the proposal's sheet, and
  in the card's tail. Ownership changes nothing about what a decision
  is, whether it counts, or who may answer it: the answers on an owned
  card are the same for every member.
- **S170.** "assign…" is a dock control on the decision page: a list
  of the organization's members, and on a `frontegg` host the shipped
  roles beside them (248), one choice sending one
  `assign(decision, owner)` response, logged like any other;
  "unassign" sends the same with no owner. It is guarded by
  `fw.plan.assign`, so on a hosted tier a reviewer reads the chip and
  has no control. Nothing about the decision changes but its chip and
  who filters it in.
- **S171.** The rail's filter is mine · all, default all. mine shows the
  decisions owned by this member, and on a `frontegg` host by a role
  their token carries (248), and the chat's
  delivery follows the same setting; the choice is one
  `filter(sink, own | all)` response recorded on this member's sink and
  kept until changed. The header's count stays the organization's and
  gains "n mine" while the filter is on; "yes all" answers the approve
  decisions the rail shows. Attention and SINCE are never filtered.
- **S172.** Requirements served: 79, 153, 207, 218, 232, 233–237,
  236a, 243–255 including 247a. Tools called: `answer`, `assign`,
  `filter`, `sign-out`, `switch-organization`,
  `configure-organization` (the operators list on a `github` host),
  and on a `frontegg` host `invite-member`, `assign-application`,
  `revoke-application`, `set-role`, `target-flag`.

## 2. Flows

Each step names the surface, the control, the tool call, and what the
page shows after.

### 2.1 Answering a decision from the rail

- **S40.** 1. Rail: j or k focuses card 418; its intent lights in
  Inception and the ? 418 marker on the thread lights. 2. Rail: y is
  refused with the card's answers listed, because a decide card has no
  yes; the operator presses "close" → `answer(418, close)`. 3. The card
  shows "sending close 418" and refuses a second click. 4. The response
  settles: the log gains "418 close · recorded", the card leaves the
  rail, focus moves to the next card, the thread shows "closed · leaves
  in 7d" with an end cap, SINCE gains "closed · intent loop-granularity
  · by your response".

### 2.2 Reviewing and approving a proposal with per-unit edits

- **S41.** 1. Rail: Enter on card 422 opens the proposal page in the
  dock; the sheet in the gate lights. 2. Dock: the bolt select on unit
  u4 changed to plan-tail → `answer(422, "u4: bolt plan-tail")`, sent
  the moment it is given; the log gains one line; the sheet's foot
  counts one per-unit response. 3. Dock: drop on u2, which u3 depends
  on → refused inline with the reason and "drop u3 too"; taking the
  offer sends one response per dependent (184). 4. Dock: the type
  select on u1 → `answer(422, "u1: type fast")`. 5. Dock: the bolt name
  field on the new bolt, Enter → `answer(422, "rename tail-cursor
  cursor")`. 6. Dock footer: yes → `answer(422, yes)`. 7. The sheet
  leaves the gate; each bolt appears or grows in Construction with its
  units queued or building, dependency-free units starting at once;
  SINCE gains "accepted · plan atlas · n units on m bolts"; the next
  decision that is the operator's is each bolt's close (13).

### 2.3 Redo with notes

- **S42.** 1. Dock, proposal page: text in "that's all wrong" and
  "redo 422" → `answer(422, redo, <notes>)`. 2. The proposal is
  withdrawn: its sheet leaves the gate, SINCE gains "redo · plan atlas ·
  withdrawn · planning charged again", and a planning-in-progress row
  appears in the gate with the operator's notes and a session chip. 3.
  When planning exits, a new proposal arrives under a new number (model
  5.2); a toast names it; its lineage shows the withdrawn proposal, the
  redo response, and the new run. Nothing was created by the withdrawn
  proposal.

### 2.4 Explore over intents

- **S43.** 1. Inception head: "explore…" enters the explore mode;
  every open intent's head knot shows a tick target; a sticky bar at
  the lane's foot says what will happen and offers with-operator or
  standing, start and cancel. 2. Two intents ticked; the bar counts
  them. 3. Start → `explore([intents], standing)`. 4. The mode ends; an
  exploration row appears at the head of Inception with its session
  chip and "since hh:mm"; each covered intent gains an explore bead;
  the dock opens on the exploration page. 5. Later, finish in the
  exploration's footer → `finish(elaboration)`; the row shows "done ·
  leaves in 7d"; SINCE gains "finished · explore …".

### 2.5 Capture with the intent toggle

- **S44.** 1. Inception: text in the capture box; the line under it
  reads "will send: capture". 2. The toggle "this is an intent" on; the
  line reads "will send: capture · intent". 3. Enter → `capture(text,
  page)` then `mark-intent(capture)`. 4. A new thread appears at the
  head of the intents, state open, first elaboration approved, note
  "captured by you as an intent"; the log gains the line; the box
  clears and the toggle resets. Without the toggle, step 4 is instead
  the curation counter moving by one and a toast "capture · 1 signal ·
  curation sees it".

### 2.6 Landing a bolt and watching it leave

- **S45.** 1. Rail: card 416, "switchboard / plan-rows · 4 units
  merged · gates green"; y → `answer(416, yes)`. 2. The ledger in
  Construction gains a landing stamp "landing · PR #n"; a record appears
  in Operation with the request open and checks running; SINCE gains
  "landing · PR open · gates running". 3. When the gates pass, the
  ledger leaves Construction; the record shows the request merged,
  every check green, "leaves in 7d"; SINCE gains "landed · gates green
  · place removed". 4. If a gate fails, the ledger stays open with the
  failure on it and a land-failed decision appears in the rail (40,
  model 5.3). 5. After the window with nothing live, the record leaves
  Operation and stays in history (186).

### 2.7 Onboarding a repository from the map

- **S46.** 1. Map strip: "+ repository" opens the add-repository page
  in the dock, seeded with every unhomed element ticked. 2. Dock: a
  name; elements ticked or a context chosen as default home; kinds,
  capabilities and the claims that fall into scope derive live and are
  shown, never typed. 3. Propose → `create-repository(name, nodes,
  document)` or `adopt-repository(name, repo, nodes, document)` (206).
  4. A decision for the repository appears in the rail under approve;
  its yes creates or registers the repository, writes its manifest entry
  and map homes. 5. The repository chip appears in the strip marked
  new; its first planning runs; the baseline decision arrives under a
  new number with the unsatisfied claims as one proposal (104, 202),
  linked from the baseline sheet to the repository page.

### 2.8 Correcting a scope by re-attaching

- **S47.** 1. Repository page or map: a claim's row; "re-attach…" arms
  the canvas; the dock closes; a bar says "re-attach <claim> — click a
  context, an element, an edge, a link or a neighbour dock · esc
  cancels". 2. One click on the target → `attach(claim, element)`. 3.
  The bar clears; the claim page reopens with the new attachment, the
  recomputed scope line and verdicts: a repository newly in scope shows
  unjudged and "planning due"; one that left shows not applicable (195,
  map 4.8). Nothing else on the map moves.

### 2.9 Reviewing what changed since the last mark

- **S48.** 1. Map control strip, or the book header: overlay "since
  last review"; the mark and its date show; on the map unchanged cards
  and edges dim and changed ones carry the marks of S24 with a note; in
  the book changed paragraphs and blocks are outlined and unchanged
  chapters dim in the tree (S96). 2. "changes · n" opens the changes
  page: every difference with a link, and the review history with the
  mark. 3. A map link opens the element's page; a book link jumps to
  its anchor; an element's ref opens the chapter. 4. "mark reviewed" →
  `reviewed` on the plan object; the mark moves to now; both views
  show nothing changed (122).

### 2.10 A blocked session's question

- **S49.** 1. Rail, answer group: card 421 shows the question verbatim
  and "session alive · other items of the bolt running"; the ✎ 421
  marker sits on the bolt's ledger under the blocked item. 2. Rail or
  dock: reply opens a text field; send → `answer(421, reply, <text>)`.
  3. The card leaves; the item's chip turns from blocked to working
  with "answered: …"; if the session is gone, the chip shows starting
  and "delivered when its place is reachable" (70); SINCE gains
  "answered · wi-#418".

### 2.11 A host lost

- **S50.** 1. Host strip: mac-mini's pill shows gone with the time
  since its last heartbeat; its sessions' chips dim; the rail's
  attention shows "host mac-mini last seen 41m · holds wi-#418" with
  takeover and wait; the ! host marker sits on the bolt. 2. The pill
  opens the host page: what it runs, its leases and when they expire.
  3. Footer: "takeover on studio" → `answer(host-gone, takeover)`; wait
  leaves the lease to expire, when the machinery does the same. 4. The
  attention line leaves; the affected chips move to studio with "taken
  over · place restored"; the pill shows released.

### 2.12 Reading a decision in the book

- **S126.** 1. Rail: j focuses card 414, a unit citing claim
  sessions/one-writer. 2. b enters the book view; the viewer loads the
  claim's book, opens the chapter and scrolls to the block, which
  lights; the ✓ 414 marker sits in the margin beside it. 3. The block
  shows the claim's version, standing, its attachments, the derived
  scope line and a verdict dot per repository in scope. 4. "evidence"
  opens the claim's artifact view in the dock with the verdict per
  repository and the as-built statement, commit and session behind
  each. 5. Esc closes the dock; y on the rail → `answer(414, yes)`; the
  card leaves and the book stays where it is. 6. b returns to the
  phases view.

### 2.13 Drilling into a context and reading a crossing

- **S127.** 1. Map view: j moves the focus ring to Billing; its card's
  thumbnail shows five dots, three hairlines and one stub toward
  Payments Gateway. 2. Hover on the Billing → Payments Gateway edge:
  the pill reads "1 cross"; the panel lists the link, invoice-settled
  in Billing homed in billing-svc, kind publishes, to settlement in
  Payments Gateway homed in gateway, and the relationship's one claim.
  3. Enter drills into Billing: the inside at full size, the elements
  as nodes, the link edges with their kinds, Payments Gateway as a dock
  on the right carrying the customer-supplier pattern, D and ACL, and
  the crossing count; the cross-context link lands on the dock with
  settlement named. 4. A node's open-question badge: the question and
  its capture control; "capture" → `capture(question, page)`; the badge
  shows captured. 5. Esc returns to the whole map with the camera as
  it was; the focus ring is on Billing.

### 2.14 Opening the artifact behind a unit

- **S128.** 1. Construction: a "change" control on unit u3 in the
  bolt's dock. 2. The artifact view opens under its source bar: "derived
  from atlas @ 9f3c1 · openspec/changes/u3-… · read 07:41 · never
  stored · edits only through review"; the stepper shows ff · apply ·
  verify · archive with apply current and the unit type's build stage
  under it; the requirement blocks with their scenarios; tasks.md as a
  checklist with the item and commit that did each task. 3. "open
  source" opens the path at the shared line. 4. "review" opens the
  review page for the change; no decision is pending on it, so the
  footer says so; a note on a section is refused because there is no
  decision to carry it (S36).

### 2.15 Reading the flywheel and adding a host

- **S129.** 1. Machinery strip: the pill reads "1.5d · 1d 19h · at
  risk"; w opens the panel. 2. The wheel shows 1.5 days in the
  "running dry" band; the reading says "you are the limit: 2 decisions
  older than a day · yes on 422 alone adds ~4 days"; the pipe's
  inception stage is full and its construction stage low. 3. Rail: y on
  422 → `answer(422, yes)`; the panel re-renders: runway 5.3 days, the
  reading "drain is the limit: add a host · 9 items on 4 alive slots".
  4. "add a host to drain faster" opens the hosts surface on "+ host"
  (S131). 5. Esc closes the panel; the pill reads "5.3d · 1d 19h".

### 2.16 Adding a part to a host

- **S130.** 1. Hosts: the studio row; its detail shows the agent
  installed, triage with sources meeting and folder, and the sinks
  heading empty. 2. "add" on the sinks heading opens the catalogue
  filtered to chat sinks on macOS; the Discord sink needs a bot token;
  "add" opens the flow. 3. The form collects the guild and channel,
  says the bot token is a secret the operator places, and "done" →
  `add-package(discord-sink, studio, config, [bot-token])` raises
  decision n in the rail, kind package-install, approve; the slot
  reads "adding · decision n". 4. Rail: y → `answer(n, yes)`; the slot
  reads "needs a secret" and the bot token sits under attention with
  "place it" until "placed" → `answer(secret, placed)` and the
  machinery checks the path; then the slot reads "installing" while
  the install effects run. 5. The proof arrives; the slot reads
  installed, with "lease" once the presenter lease is taken.

### 2.17 Enrolling a host

- **S131.** 1. Hosts: "+ host"; platform flywheel-cloud managed, name
  willdan-cloud-2. 2. Parts: the Discord sink and the agent ticked from
  the sinks and agent headings' catalogues; the image at the head of
  the list reads current. 3. Provisioning runs from the host in hand with
  the operator's own platform credentials, read now and never stored;
  the step shows running then done. 4. Hand-over lists only the ticked
  parts' secrets, the bot token and model access; the operator hands
  them into the platform's store; the step shows done. 5. The
  enrolment decision "enrol host willdan-cloud-2" appears in the rail
  with a one-time token and its expiry; y → `answer(enrol, yes)`. 6.
  The host joins by one command with the token (205), reads the
  manifest and installs its declared parts; each step shows queued,
  running, done. 7. The row shows alive in the strip and the list; the
  flywheel's drain column counts one more host.

### 2.18 Switching organization

- **S160.** 1. Header: the account item reads chuck; a click opens the
  menu with the identity block, then the switcher: willdan · 9,
  mad-swan · 2, acme · not a member, acme's operators list not
  carrying chuck (247). 2. mad-swan chosen →
  `switch-organization(mad-swan)`. 3. The whole page swaps: the rail
  shows mad-swan's two decisions, the board its lanes, the strip its
  hosts and repositories, the flywheel its runway, the address is the
  same host with `/mad-swan/` in the path (205a); the dock that was
  open is closed, no card is focused, the view is phases. 4. The
  header's as-of time is mad-swan's read and the account item reads
  the same identity, the host's kind being one for every organization
  it serves. On a hosted host chuck's roles are read per account, so a
  control chuck holds in willdan may be absent in mad-swan. 5. The
  switcher again returns to willdan the same way, with nothing
  remembered from before.

### 2.19 Adding an organization package

- **S161.** 1. Account item: organization store; the list shows
  unit types, producers, vocabularies, templates and scenario packs
  with their states; the "data-product" vocabulary reads not installed
  · index · needs nothing. 2. "add" opens the flow: the vocabulary's
  configuration (the kinds it adds, the facets it declares), no
  secret; "done" raises decision n in the rail, kind install, approve;
  the row reads "adding · decision n". 3. Rail: y → `answer(n, yes)`;
  the row reads installing. 4. The proof arrives: the row reads
  installed in the blueprints; the map's kind legend and the facet controls
  carry the new kinds at the next read (map 3.3); SINCE gains
  "installed · data-product vocabulary". No host row changed.

### 2.20 Changing a setting

- **S162.** 1. Account item: settings; the manifest as a form, the
  defaults per role group open: the interpreter's model, triage's
  model. 2. Triage's model changed in its select; the field marks
  itself changed and the form's foot counts one change. 3. Save sends
  one response for the form; the foot shows "sending" and refuses a
  second save. 4. The response settles: the log gains "settings ·
  triage model · recorded"; the machinery's manifest commit lands; the
  page re-reads and the form shows the new value with nothing marked.
  The next triage session the machinery charges takes the new default
  (173). The bot token's row in sinks shows "placed" with no value and
  no field.

### 2.21 Signing in on your own computer

- **S178.** 1. The laptop's own host is a `github` host and serves its
  page at `http://127.0.0.1:7431/willdan/`, a localhost port of its
  own choosing with no proxy and no name (245); a second host on the
  same laptop is a second port (232). 2. Opening it with no session
  shows the device flow: a code and github.com/login/device. Chuck
  enters the code there and approves, and the page waits until GitHub
  confirms (253). 3. The page turns to the plan: the account item
  reads chuck, the GitHub username, and the header count is
  willdan's, the organization whose operators list carries chuck. As a
  listed operator chuck holds every permission, and the flags stand at
  their defaults, so the book view and explore are there and pools,
  the package store and the hosts list are not (248, 250, S197). 4. On a
  hosted host the same page instead sends chuck to Frontegg's hosted
  login, the redirect built from that host's served name, and lands
  the same way with the Frontegg user as the identity, the GitHub
  username beside it for authorship, and that account's roles (244,
  246). 5. A first hosted sign-in with no GitHub connection lands on
  the plan all the same, with "connect GitHub" in the identity block;
  chuck may respond and may not be an author until it is connected.

### 2.22 A second answer refused

- **S179.** 1. Rail, two members: chuck and dana both have card 418
  in hand. 2. dana presses close → `answer(418, close)`; the record is
  written with dana's identity. 3. chuck's card turns to "answered by
  dana at 07:52" with its controls gone before chuck's next delivery;
  had chuck's close raced dana's, the tool server refuses it as
  already answered, nothing is recorded, and the card says so inline.
  4. On the next delivery the card is gone from every rail and SINCE
  reads "closed · intent loop-granularity · by dana" on chuck's page
  and "by your response" on dana's.

### 2.23 Assigning and filtering

- **S180.** 1. Dock, decision 414: "assign…" lists chuck, dana and the
  role reviewers; dana chosen → `assign(414, dana)`; the log gains one
  line; the unit slip and the card's tail gain the chip "dana". 2. On
  dana's page the rail's filter is switched to mine → `filter(dana's
  page sink, own)`; the rail shows 414 and the two other decisions
  dana or reviewers own; the header reads "9 · 3 mine". 3. dana's
  chat delivers the same three lines. 4. y on 414 on chuck's page,
  under all, is accepted like any answer: the owner filters, never
  gates.

### 2.24 A host that cannot satisfy an environment

- **S181.** 1. A fetch moves atlas's environment declaration to node
  22; mac-mini's provider is devenv and cannot produce it. 2. The rail's
  attention gains "host mac-mini cannot satisfy atlas: node 22 ·
  covers none of its work" with ok; the strip's mac-mini pill reads
  "1 uncovered"; atlas's dock shows mac-mini unsatisfied and studio
  satisfied under its declaration. 3. Hosts: mac-mini's environment
  heading shows devenv and the same line; atlas's work runs on studio
  meanwhile. 4. The operator changes the provider where mac-mini is
  declared; the next tick satisfies it, the line leaves on the next
  read, and ok on it before then clears it for this member alone.

### 2.25 The pool drains faster

- **S182.** 1. Rail, in an organization that declares a pool named
  cloud: y on its proposal approves nine units; the flywheel's reading
  turns to "drain is the limit · pool 2 of 8 · 9 items on 4 alive
  slots". 2. The machinery asks the platform for a host from the
  pool's image; the strip's pool pill reads "pool cloud · 3 of 8" with
  "drain changing" and the drain column says the same; nothing enters
  the rail. 3. Hosts: the pool row shows three live of eight,
  image current, and under it the new host with its pool chip, alive,
  its joining record naming the demand. 4. The queue drains; an idle
  pool host reads "retiring · idle 15m" and leaves; the pill reads
  "2 of 8" and the reading returns to "primed". 5. Later the pool's
  image reads behind after a declaration moved; "rebuild" →
  `propose-chore(blueprints, rebuild image)`; the chore appears under
  the chores head, the image reads building, then current.

### 2.26 Upgrading an organization to a hosted tier

- **S204.** 1. willdan runs on a `github` host; its settings form's
  operators list carries chuck, dana and priya as GitHub usernames,
  each with their chat addresses (247). 2. The organization moves to a
  hosted tier (247a): the service creates willdan's Frontegg account,
  invites those same three usernames to it, and carries every address
  over unchanged. 3. On the hosted host's page each of the three signs
  in through Frontegg's hosted login, connects GitHub at first sign-in
  if they have not, and reads the same board with the same numbers;
  their chat sinks are the same sinks, because the addresses did not
  move (236a). 4. The settings form now shows the identities and their
  roles read-only, derived from the account, with the addresses still
  authored beside them, and the members section appears with the
  identity tools on it (S155, S195). 5. Nothing else about the
  organization moves: the same repositories, the same blueprints, the
  same state, the same register and the same numbers (218). 6. Flags
  that stood at their defaults are now targetable per account, so the
  store, the hosts list and pools can be turned on where the tier
  carries them (250, S197).

## 3. Forms

One form per kind and no two kinds share one (209). Phase is shown by
where a thing sits, never by its form.

- **S51.** Forms at rest, focused, and closed or deferred:

| kind | what distinguishes it | carries at rest | lights when focused | closed or deferred |
|---|---|---|---|---|
| decision | the only answerable card; a number in its corner | number, kind, phase chip, title, tail, answers | the card and its object's marker | leaves the rail when answered; unapplicable comes back once under attention |
| proposal | a sheet: title line, section rules per bolt, mono metadata, taller than wide | planning run, bolts with their units, counts, per-unit responses recorded | the sheet and its rail card | greyed "deferred · ask again" in the gate |
| unit proposal | a slip hanging off the gate | name, target bolt (open or new), type | the slip and its rail card | as the proposal |
| baseline | a sheet of its own, sections by scope | claims unmet, chores, units, "judged once" | as the proposal | as the proposal |
| intent | a drawn thread: a vertical stroke with a head knot, no box | name, state, note, beads in order | the thread | the same thread with an end cap and "closed · leaves in Nd" |
| elaboration | a bead on the thread with a leading kind word | kind, name, state or chip; "in gathering n" chip when covered | the bead | "done · leaves in Nd" on the bead |
| exploration | a row at the head of Inception | kind (with-operator or standing), covered intents, since, chip | the row | "done · leaves in Nd" |
| bolt | a flat square-cornered ledger | name, repository, running count, unit chain, machinery row, services and endpoint foot, landing stamp | the ledger | leaves Construction at landing |
| landed bolt | a borderless muted record | name, when, PR-and-checks stamp, environments, live signals, "stays · why" or "leaves in Nd" | the record | leaves Operation after the window |
| signal | a quote with a left rule | text, kind, source, age, move or "unmoved" | none | its move |
| session | a chip, the same everywhere | agent · model, @host, activity (working, starting, idle Nh, blocked, with you, next hh:mm), pane link | chips of the lit host | done chip with its countdown |
| host | a pill in the host strip; a row on the hosts surface | alive or gone, sessions against the bound, last heartbeat, uncovered count; on hosts: kind, platform, bound, joined, provider, pool chip, parts as chips | its pill lights its sessions in every lane | gone in the strip; released after takeover; retiring for a pool host |
| pool | one pill in the strip; a row on the hosts surface with its hosts under it | live of bound, "drain changing"; on hosts: platform, image state, live of bound, cost ceiling, retire time, covers | none | none; the machinery adds and retires |
| repository | a pill in the strip; a home chip on a map card | name, unmet count; on the map: elements homed, capabilities | its chip | retiring when homed only in current |
| claim | an attachment chip, never a node; a block in the book | name, version; on a repository page its verdict per repository; in the book: standing or proposed, attachments, scope line, verdict dots | its scope lights on the map; its block lights in the book | not applicable when it leaves a scope; dashed while proposed |
| map context | a card with a thumbnail | name, status, home chips with verdict dots, attachment count, markers, open-question badge, tags, the thumbnail | the card and its edges | ghosted when removed |
| map element | a dot in a thumbnail; a node when drilled | dot: kind colour, home ring; node: kind, name, home chip, verdict dot, attachment chip, markers, status, question badge, tags | the dot or node | ghosted when removed |
| relationship | a typed edge with pattern name, marks and a crossing pill; a neighbour dock when drilled | pattern, U and D, OHS, PL, ACL, lens, bar, crossing count | the edge and its panel | ghosted when removed |
| link | a hairline in a thumbnail; a typed edge when drilled; a row in an edge's panel | kind, target element named | the line | ghosted when removed |
| machinery session | a row in the machinery strip or on its object | curation beside the unmoved counter, planning in the gate, a conflict fix on its bolt | its chip | leaves when its run ends |
| artifact view | a dock page under a source bar | the artifact rendered to its kind (S99), the source bar | none | "no change yet" before a unit's yes |
| flywheel | one pill in the strip; one panel | runway, streak, "at risk"; the panel: wheel, pipe, three columns, reading, streak, advanced | none | none; it reads |
| part | a chip on a host's row; a slot under a heading in its detail | kind word, name, state (installed, adding, needs a secret, installing, disabled), "lease" on a presenting sink | the chip and its attention line when one waits | disabled; an empty slot with "add" |
| package | a row in the catalogue a slot opens | name, version, shipped or index, needs, enables, "add" or its state on the host or in the blueprints | the row | greyed under "any platform" with what it needs |
| image | a line on a pool row and at the head of the hosts list | tag, hash, current · behind · building, "rebuild" when behind | none | none |
| owner | a chip on a decision's object and in its card's tail | the member | none | none; unowned shows no chip |
| member | a row in the settings form's operators list; on a `frontegg` host also in its members section | the identity, the GitHub username authorship uses, addresses per chat kind, sinks with their marks; on a hosted tier roles read-only from the account and the identity controls beside them | none | leaves the list when the entry is removed or the assignment revoked, and its sinks with it |
| account item | a chip at the header's right | the signed-in identity; open: the identity block, the switcher, settings (with its members section on a hosted tier), hosts, organization store, sign-out — hosts and store only where their flags are on (S197) | none | none |

- **S52.** Markers: a decision's number with its group glyph on the
  object it concerns (S17), one glyph set everywhere: on a lane, on a
  map card, edge, node or neighbour dock, in a chapter margin, on a
  host's row or a package-store row. A gathered elaboration's marker sits on
  every covered
  intent. A host marker sits on the bolt whose item it holds. A marker
  click focuses the rail card and opens the dock with the card inline.
- **S53.** Session chips are one style everywhere: agent · model, the
  host, the activity word, a pane link that opens the session's pane in
  herdr (68, 196). State is colour and dot only: working filled and
  pulsing, starting dashed, idle hollow, blocked an amber ring. A host
  pill lights its chips in every lane and dims the rest.
- **S54.** The machinery strip sits above the lanes: hosts as pills
  (alive or gone, sessions against the bound, last heartbeat, an
  uncovered count), each pool as one pill (S176), the setup control
  that opens hosts, with "secret" while one waits, then the
  repositories as pills, then the flywheel pill (S109). Machinery sessions sit by phase,
  not in the strip: curation beside the unmoved counter, planning
  inside the gate while it runs, a conflict fix on the bolt it works.
- **S55.** Countdowns: a finished object says "leaves in Nd", or
  "leaves today", from the bounded window (186); a landed bolt says
  "stays · <what is live>" while its request, environments or a signal
  is live; a soon countdown (two days or less) is marked. A deferred
  proposal shows the time it was deferred, never a countdown.

## 4. Keys and modes

- **S56.** The key table:

| key | region | does |
|---|---|---|
| j, k, ↓, ↑ | rail | walk the decisions and attention lines; the dock follows when open; the book follows (S93) |
| Enter, o | rail | open the focused card in the dock |
| y | rail | the focused card's yes |
| n | rail | the focused card's drop or no |
| l | rail | the focused card's later, where it offers one |
| ], [ | rail or dock | step through the beads of the intent in hand |
| m | board | switch phases and map |
| b | board | switch phases and book |
| w | anywhere | open and close the flywheel panel |
| / | board | focus the capture box |
| Esc | anywhere | in order: leave a field, close the log, cancel explore selection, cancel re-attach, hide an edge's panel, close the dock, close the account menu, the library, hosts, settings or the package store, back from a drill |
| f | map | fit, the only camera command, at either level |
| o | map | cycle the overlay: none, current → target, since last review |
| j, k | map canvas | move the focus ring among contexts at rest, among elements when drilled |
| Enter | map canvas | drill into the focused context at rest; open the focused element's dock when drilled |
| →, ← | none | not bound |
| h, l | none | not bound as movement |

- **S57.** The one-axis rule: the rail is one list and j and k walk
  it. There is no second axis anywhere on the plan page; h and l move
  nothing. A key that a card does not offer is refused with the card's
  answers listed, never remapped.
- **S58.** Modes, how each is entered and left:

| mode | entered by | shows | left by |
|---|---|---|---|
| explore | "explore…" at Inception's head | tick targets on every open intent's head knot; a sticky bar with the count, with-operator or standing, start, cancel; beads never show a tick | start (sends `explore`), cancel, Esc |
| re-attach | "re-attach…" on a claim page | the dock closes; a bar names the claim; every context, element, edge, link and neighbour dock is a target | one click (sends `attach`), cancel, Esc |
| overlay | the overlay control or o, on the map or in the book | the difference marks of S24 or S96; "changes · n"; the review mark and "mark reviewed" for the review overlay | none, or o back to none |
| facet | off, filter, colour, group per facet | dimming, a colour with a legend, or a background wash, at either level; the invariant readout | off |
| drilled | Enter or a thumbnail click at rest, "drill into" on a dock or a neighbour dock | the context's inside at full size, neighbour docks, the breadcrumb | Esc, the org crumb |
| edge panel | hover or focus on a relationship edge | the crossing links and claims of S85 | leaving the edge, Esc |
| book | b, the board header, "read in book" | the viewer with the rail driving it | b, the board header |
| library | the book header's control | the organization's blueprints with their counts | a choice, Esc |
| account menu | the account item | the switcher, settings, hosts, organization store, sign-out | a choice, Esc, a click outside |
| hosts | the menu's hosts, the strip's setup control, a host page, "add a host", the pool control, an attention line about a host | host and pool rows on the left, the row's detail by headings and slots on the right; a slot's catalogue, the add and "+ host" flows in place | Esc, × |
| settings | the menu's settings | the manifest as a form with one save | Esc, ×; an unsaved change asks first |
| organization store | the menu's organization store | the organization's headings with their slots and states; a slot's catalogue and the add flow in place | Esc, × |
| flywheel | w, the strip's pill, the board header on a phone | the panel of §1.11 | w, Esc, × |
| dock | Enter, a marker, a card, a pill, a chip | one page of S28 over the board | Esc, ×, a click outside |
| phone tabs | width under 760px | Decisions or Board | the other tab |

## 5. Rulings

Each dated, each with its reason.

Dated 2026-09-05.

- **S59.** Rail beside board, not four lanes of decisions. The count
  is one list in the model's order (11, 15, 18; model 5.1, 5.5), so it
  is one rail and one axis. The board is the status view by phase (B.4)
  with objects only and every decision a marker on its object. The
  workbench's four lanes of cards are retired.
- **S60.** Desktop first, mobile consistent. The operator wanted a
  full card view over a board that stays in place. The phone follows
  the same metaphor as two tabs and a full-screen dock (S38) rather than
  a metaphor of its own. The triage deck's phone-first flick is
  rejected for that reason.
- **S61.** The dock keeps the board in place, like an issue over a
  project board. Peek is rejected: hover and long-press popovers on the
  queue and the river were not it; the operator wants the full page.
- **S62.** One silhouette per kind, never one card class with variants
  (209). Board cards that all looked alike said "same kind of thing"
  about very different things. The dock header takes the object's form.
- **S63.** No typed grammar anywhere on the page (194). The capture
  box captures only, with an intent toggle; explore is a control over
  ticked intents; drop, later, rename, start and stop, finish and ask
  again are dock buttons. The workbench's dictation grammar in the
  capture box is rejected. The numbered reply grammar stays in chat,
  where it is the `answer` tool.
- **S64.** Every proposal edit is its own response, sent when given and
  applied to the document (172, 184). Nothing is staged to travel with
  the yes. The workbench's staged edits are rejected.
- **S65.** Later defers into the gate with no SINCE entry. The tail
  lists done, landed, closed and dropped; a deferred proposal is none of
  these. It stays greyed in the gate until asked again, re-offered by
  the machinery after the week, or superseded silently by planning's
  next run (172, 35). Asked again it is a new decision with a new
  number (model 5.2).
- **S66.** Finished objects leave views after a window. A landed bolt,
  a closed intent, a finished elaboration stay while something about
  them is live and for the bounded window after, saying so, then leave
  every view and stay in history (186). Nothing is deleted.
- **S67.** Whole map at rest, two zoom levels, fit only (map 5). The
  first level is every context as a card with a thumbnail of its
  inside; the second is a drill into one context's inside in the same
  grammar, with the way back the one camera memory (S88). No pan
  history, no saved positions. The v1 map's hop depth and trace-to-store
  are not carried.
- **S68.** Facets are tags, never structure (map 2.5, 5.3). A facet
  filters, colours or washes and moves nothing, at either level; the
  control strip proves it after every switch. Lanes, tiers, runtimes
  and stores are tags or kinds.
- **S69.** Repositories, claims and lanes are never nodes (map 5.7). A
  repository is a chip because it is not a bounded context; a claim is
  an attachment chip because it is a statement; a lane is a tag. The
  rail-and-board map view, which drew repositories as nodes and let the
  operator toggle repositories in and out of a claim's scope by a rule,
  is rejected: scope is derived from attachments and never chosen
  (200), and kinds and capabilities are derived and never declared
  (199). The context-map-ddd view replaces it.
- **S70.** The v1 map's layers, lanes and runtime switch are rejected.
  Four bands per card, a control and a data lane, edges ghosted by a
  runtime switch, and a "repository" layer put structure where the
  model has tags and kinds; the seam rename showed the vocabulary was
  wrong. The mockup drawn on that schema was retired.
- **S71.** Re-attach is the scope gesture: arm on the claim, one click
  on any map id, one `attach` call (193, 200). No scope rules, no
  repository set.
- **S72.** Adding a repository is a proposal, not a dictation. The map
  gesture sends `create-repository` or `adopt-repository` and the
  operator's yes creates or registers it (206). Both map mockups, which
  added the repository on one click, are corrected here. The baseline
  decision arrives after the first planning runs, not at the add (104).
- **S73.** Marking reviewed is a response on the plan object, recorded
  like any other (122, statechart §10), under `fw.review.mark` (249).
  The rail-and-board map logged it
  as a dictation; it is one recorded response and moves both the map's
  and the book's review view.
- **S74.** An attention acknowledgement is recorded. "ok" on a response
  that could not apply, and on an uncovered object, is an `answer` and
  is logged (153; model 5.3). The queue, the river and rail-and-board
  showed it as "seen · not logged"; that is rejected.
- **S75.** Accepted chores are items on the repository's shared line,
  shown in Construction under a chores head per repository, never as a
  bolt ledger (60, 209). The rail-and-board seed's "chores" ledger is
  corrected here.
- **S76.** Light and dark are both required, following the system by
  default with a control to force either.
- **S77.** The seed's tension stands as a seed, not a rule: a
  proposed intent with a standing prototype already on its line (412
  and 419) comes from plan-mockup and shows what the page does when
  states disagree; it is not a state the model produces (21).

Dated 2026-09-07.

- **S132.** The book is a view of the board, not a link out. The
  rail's decisions concern claims, and a claim lives in a chapter; the
  operator reads it where it is written, with the block rendered from
  the ledger and the decision beside it, and answers on the rail (98,
  122). The blueprints are mdBook and the server draws the chapter itself,
  so the viewer is the page's own and the rail can drive it. A separate
  book site the page links to is rejected because the rail could not
  light a block in it.
- **S133.** Beads are targets and explore is a mode. Each bead opens
  its elaboration's own page (210), because an elaboration is a surface
  of its own reached from its intent; ] and [ step through them so the
  intent in hand is never lost. A bead carries a leading kind word so it
  never reads as a sub-intent. Explore is entered from the lane head
  and left by start, cancel or Esc, never a standing checkbox, so the
  lane at rest carries no selection state.
- **S134.** Thumbnails and drill-in replace opened-in-place. At the
  context level the operator reads shape, not lists: a thumbnail shows
  how much is inside and how it hangs together without the names. The
  inside is read in the same grammar, so nothing is learned twice. A
  card that grew in place put a list where a map belongs and made the
  rest of the map move; both are rejected (map 5.2).
- **S135.** Crossing links belong to the relationship edge. The model
  says a link across contexts must cross a relationship (map 2.4), so
  the edge's pill is the proof of that rule and its panel is the
  evidence, on demand. At rest the detail is not important and is not
  drawn; links are never drawn on the whole map.
- **S136.** Two focus rings, one glyph set, one camera memory. The
  rail's focused card and the canvas's cursor are two things the
  operator holds at once, so lit and focus are two rings (S87). Markers
  are one glyph set on every surface so a number reads the same on a
  lane, a card, a margin and a setup row (S52). A drill is a push and
  the way back lands where the operator left, which is the one memory;
  everything else is computed, so fit stays the only camera command
  (S88).
- **S137.** Artifact views are derived, never stored, and never
  edited. The record is git (187); the page reads it at the shared line
  when asked, says where it read from and when, and offers only "open
  source" and "review". Any edit is a response through the review
  binding (S36) or the machinery's own work (176). A page that could
  save a file would make a second writer.
- **S138.** One instrument, not three gauges. The game is priming the
  wheel and walking away: in the ideal week the operator primes it and
  construction runs unattended, and hosts are added to drain faster.
  Runway is the one number that says whether the wheel is primed, and
  the reading sentence says what to do about it. The three phase gauges
  survive under "advanced" because they explain, not because they
  decide. The key is w because l is later (S56, S57).
- **S139.** Setup is per host, browsed, and "add" is one flow ending
  in one decision. A part is what a host runs (dispatch 2, 5), so the
  surface is the hosts with their parts, not a ladder with an order the
  placements do not have. An offer the operator accepts and then
  configures is two decisions for one thing; "add" collects the
  configuration and the secrets first and raises the install decision
  last, so the yes is the only decision and the count holds nothing
  before it. The install ladder and "offer" are rejected.
- **S140.** The organization store and a host's store are separate
  surfaces, both reached from the account item. A unit type, a
  producer, a map vocabulary, a template or a scenario pack belongs to
  the organization, installs into the blueprints and runs on no host; an
  adapter, a sink, the agent, triage, a runner or a router is
  a host's part and installs on one host. One list that mixed them
  asked the operator to pick a host for something no host runs, so the
  organization store hangs off the organization (the account item)
  and a host's store hangs off its host row. The strip's setup control
  points at hosts, because the strip is where hosts are; it points at
  nothing else. The account item is the standard place because
  switching organization, settings, stores and sign-out are about the
  organization as a whole and none is an object on the board.
- **S141.** Enrolment hands over only what the chosen parts need, and
  the operator's own credentials are never stored. Provisioning runs
  from the host in hand with the operator's platform credentials read
  at run time (207, dispatch "what the operator places"); the hand-over
  lists only the ticked parts' secrets, so a host that presents no chat
  never receives a bot token; one enrolment decision carries a one-time
  token and the host joins by one command (205). Adopting an existing
  host is the token alone.
- **S142.** The host's "agent" names the interpreter job. The operator
  reads "agent" as the thing that reads and answers and proposes
  writes; the dispatch model's word for that job is interpreter (194,
  dispatch 1). The surface uses the operator's word and the hint says
  what it does; the model keeps its own. No part is named "dispatch" on
  the surface, because dispatch is a placement, not a part.
- **S143.** The review flow is one flow across map and book. One
  switch, one mark, one `reviewed` (S73). Two marks would let the book
  and the map disagree about what the operator has seen.
- **S183.** Membership is the organization's and refusal is
  authorization (233, 234). Authentication is the host's, one kind for
  every organization it serves, so an operator signs in once and the
  identity holds across a switch; an organization that does not admit
  that identity refuses the call rather than asking for a second
  sign-in, and the refusal is recorded and read under attention. The
  local-user case is rejected because it gave one operator two names
  and left a response with no identity to carry (153).
- **S184.** One board, refused before recorded (235). The plan is one
  list from one register and every member reads the same numbers, so
  a decision answered by one member is answered for all. The second
  response is refused before any record exists rather than recorded
  as unapplicable, because an unapplicable response comes back under
  attention (S51) and this one has nothing for the operator to do but
  read who answered. A rail per member with its own numbers is
  rejected: the count would no longer be the organization's.
- **S185.** Sinks are per member, the board is not (236). What a
  member has seen is theirs, so the delivery mark, SINCE and an ok are
  per sink; what a member did is everyone's, so every answer that acts
  on an object is applied once. A shared channel keeps one mark
  because it is one place everyone reads. A member's chat sinks come
  from the addresses on their operators entry (236a), so membership
  and delivery are one write and no sink is declared twice; the page
  says where each is presented and when none can be.
- **S186.** Ownership is a filter, never a gate (237). An owner chip
  says whose turn it is and lets a member narrow the rail to their
  own; it changes no answer, no count and no kind, because a decision
  gated to one member would stall the wheel when that member is
  away. The filter is a recorded response on the member's sink so the
  chat delivers the same list as the page.
- **S187.** The secret never travels through the page (207, S123). A
  secret is placed where the host keeps it, by the operator, in a
  place the page cannot read; the page carries the secret's name, the
  command and a one-word "placed", and the machinery checks the path.
  A field for a secret's value, on the hosts surface, in settings or
  in an add form, is rejected because the page would then hold it in
  a request, a log or a re-render.
- **S188.** The hosts surface is a settings screen, not an index
  (228, 229). A host is a fixed set of things it runs, one slot or
  list per kind, so the operator reads what is there and what is
  empty; "add" on a slot opens the catalogue already filtered to what
  that slot takes, and the organization store takes the same shape
  over its own kinds. One big searchable index across every kind
  asked the operator to know the vocabulary before they could use it,
  and mixed things a host runs with things no host runs; it is
  rejected. The exact visual shape waits on the mockup round (S192).
- **S189.** An install is the machinery's effects, an image rebuild
  is a chore (204, 229, 239). A package install is fetch, check, place,
  register and start, deterministic and repeatable, so it runs as
  effects with proofs and charges no session; the slot reads
  installing while they run. An image build renders declarations into
  a provider's artefact and may take a machine and a while, so it is
  accepted like any chore and shows under the chores head. The
  earlier "installing · chore wi-#n" on a slot is corrected here.
- **S190.** Pool hosts are drain, not hosts the operator tends
  (240–242). A pool host is added and retired by the machinery while
  drain is the limit, within a bound and a cost the manifest names, so
  the surface shows the pool as one row and one pill with live of
  bound and shows the change on the instrument as drain changing; a
  pool host is listed under its pool for reading and never needs a
  response. "add a host" leaves the reading sentence when a pool
  exists because the machinery is already doing it; the bound and the
  ceiling are the operator's levers, in settings.

Dated 2026-09-08.

- **S163.** One address per host, the organization in the path
  (205a). A host serving several organizations serves them all at that
  one address, `/<org>/...`, so a link names the organization it opens
  and the switcher only changes the path; the identity is the host's
  session and never changes with it (233). The settings form edits the
  keys 233 assigns to the organization — name, profile, repositories,
  pools, sinks, curation, addresses — and shows the host's keys — root,
  bound, declaration, provider, identity environment, router —
  read-only with a link to the host's own screen. Closed.
- **S199.** Identity is a host binding: GitHub locally, Frontegg
  hosted, and the upgrade carries the same usernames (243–247a, 253).
  A self-managed operator already has a GitHub account and already
  gives the flywheel a GitHub App, so the device flow costs them
  nothing to stand up: no provider account, no environment, no
  registered redirect, and the page on any localhost port it likes
  with no proxy and no name (245). Membership there is the manifest's
  operators list, every listed operator holds every permission, and
  flags stand at their defaults, because one small team administering
  roles against itself is ceremony. The hosted tiers carry Frontegg,
  where accounts, roles, permissions and per-account flags are what
  the service sells. Moving between them is the upgrade and not a
  migration: the same GitHub usernames are invited, the addresses come
  over, and the board, the numbers and the repositories never move
  (247a, 218). One provider for both is rejected: it made every
  self-managed operator hold an account with a vendor to run their own
  laptop. Per-host sign-in kinds beyond these two are rejected: they
  gave one operator a different identity per host and made every host
  a place a directory had to be wired to. There is no local-user case
  and no unauthenticated page in either kind, and authorship is the
  GitHub username in both. Closed.
- **S200.** Flags hide, permissions authorize (249, 250). A flag
  decides only whether a surface is drawn, so the entry, the control
  and the key are absent together and a flag is never read as a right;
  on a hosted tier the tool server checks the token for the permission
  the tool declares before any response is written, so a hidden
  surface's tool is still refused to a caller without the permission
  and a shown one is still refused to a caller who lacks it. On a
  `github` host the same shape holds with the membership check in the
  permission's place and every flag at its default. Greying a control
  the flag hides is rejected: it advertises a surface the account does
  not have. Using a flag to gate a write is rejected: a flag is
  evaluated in the page, and authorization that the page can decide is
  not authorization. Closed.
- **S201.** Membership is a commit locally and not one hosted (247,
  255, 236a). On a self-managed host the operators list is the
  manifest's, edited on the settings form and saved as one response,
  because the manifest is already the organization's authored truth
  and there is no second system to disagree with it. On a hosted tier
  the same list is derived from the account's assignments at every
  fetch and shown read-only, and invite, assign, revoke and set-role
  are recorded tool calls under `fw.identity.admin`, because a
  service's billing and its members cannot live in a pull request. The
  one thing authored in both is the member's chat addresses, which are
  the organization's routing and belong to neither provider. A second
  admin console is rejected in both: administration is a surface of
  the flywheel, recorded like any other response (153). Closed.
- **S206.** Every surface speaks to the customer, never to the
  designer. No name of a provider we buy appears anywhere on a surface:
  the hosted sign-in reads **Flywheel Cloud** and the self-managed one
  reads **GitHub**, which is the operator's own git host and not a
  vendor of ours. No tier number, no clause number and no surface number
  appears in copy: a plan is named by its name ("included in Team"), and
  a host is named by what it does for the operator ("a cloud agent that
  keeps working while your laptop sleeps"), never by the rung or the
  clause that defines it. The reason is that a number is a fact about
  our design and not about the operator's work: it tells them nothing
  they can act on and asks them to hold our model in their head. Design
  references — clause numbers, S-numbers, the ruling that settled a
  screen — live in the mockups' header comments, where the next designer
  reads them and the customer never does. Closed.

## 6. Open

What no mockup settled.

- **S78.** The phone layout beyond the stacked list: whether the
  lanes collapse to heads with counts, whether the map's stacked list
  draws relationships as more than lines of text, where the capture
  box sits when the rail is the first tab, and how the book's tree is
  reached on a phone. A.38 settles that each is answerable on a phone
  (306, 307); how it is drawn there is this item.
- **S79.** The chat's rich controls per platform: which Discord
  components carry which answers, how a per-unit edit or a pick is
  offered, and whether a threaded reply on a decision line is an answer
  on that decision.
- **S80.** The review surface's annotation-as-response: which
  plannotator annotation maps to which answer (a note is redo with the
  note; approval of the document is yes; which annotation is drop),
  and how a per-unit edit is expressed as an annotation.
- **S81.** Where the elaboration page's records are rendered from:
  the intent's change directory on the intent's line, read through the
  blueprints profile, or a listing the session reports at exit (187, 210).
- **S82.** Which tool "ask again" calls on a deferred proposal. The
  catalogue is marked incomplete; `release` on the deferred object is
  the candidate. The review mark's tool is the catalogue's
  `mark-reviewed`; this document's `reviewed` names that entry.
- **S83.** Whether a per-unit edit is one `answer` on the proposal's
  number naming the unit, as rail-and-board sends it, or an `answer` on
  the unit's own decision, which model 5.3 forwards to the unit.
- **S84.** Which region has focus when the map view opens, and whether
  Tab moves between the rail and the canvas. j and k walk the rail in
  one and the focus ring in the other, so the answer decides which the
  keys reach first.
- **S144.** 213, 214, 229 and 230 are ratified and bind §1.10–§1.12,
  and 205a, 207a and 243–255 including 247a bind §1.13–§1.14, all as
  their text now reads. Open from reading the statements against them:
  229's "added, awaiting install" is shown as "adding · decision n"
  and its removal keeps the package's records, and whether a removed
  package leaves a greyed slot that opens those records or an empty
  slot with "add" is not settled; 252's refusal of a tool whose
  permission the host's environment lacks has no surface of its own,
  being drawn as the same inline refusal and attention line as any
  other (S165, S202); and 247a's upgrade has no surface at all,
  running as the service's act on the organization rather than
  anything the page offers (S204, S205).
- **S146.** The decision kinds the hosts surface raises are the
  model's: package-install, package-secret, host-enrol and
  host-enrol-lapsed (model A.28), host-environment (238). What the
  host-enrol-lapsed attention line offers, a fresh token by one
  answer or the "+ host" flow again, is not settled.
- **S147.** The package kinds are 228's, and a host's store and the
  organization store are separate by 233 and 228. The agent and
  triage are headings with no package behind them: the agent is the
  binary's interpreter job and triage the manifest's job, configured
  per host. Whether their per-host settings (the agent's model,
  triage's sources) are the host's declaration or the manifest's
  defaults per role (173), and so whether they are changed on hosts or
  in settings, is not settled; the environment provider is a host's
  declaration and is changed with it (S174).
- **S149.** How the book viewer is served: chapters rendered by the
  server from mdBook sources, or mdBook's own build embedded. The claim
  block's rendering from the ledger is settled either way (S92).
- **S150.** The artifact keys and the review binding. The views are
  addressed as intent, unit on its bolt, claim, bolt and work item; the
  "review" control reaches a plannotator stub. What a review page shows
  when no decision is pending, beyond refusing a note, is not settled.
- **S151.** Whether thumbnails render on a phone at all, or only the
  caption's counts, and whether the stacked list when drilled draws a
  link as more than its target's name. A thumbnail is a rendering and
  not a control, so 306 does not decide it.
- **S191.** Ruled 2026-09-08: non-member organizations do not appear
  in the switcher. The switcher lists only the organizations the
  signed-in identity is a member of (S166); surfaces.yaml
  `account.switcher` draws no greyed entry.
- **S202.** How a refusal reads on the surface, between its causes
  (249, 252): an identity the organization does not admit, on a hosted
  tier a member without the tool's permission, and a tool whose
  permission the host's environment lacks. All are recorded the same
  way and shown inline with an attention line (S165), and whether the
  operator is told which cause it was, and in what words, is not
  settled. Controls a member has no permission for are absent rather
  than greyed by the same reasoning as S200, so the second cause
  should be rare and reached only by a stale page.
- **S203.** What a `frontegg` host's members section shows about a
  user invited to the account but not yet assigned the Application.
  The account knows an invitation before an assignment exists (255),
  and whether the section lists it as a pending row or shows nothing
  until the assignment lands is not settled.
- **S205.** Whether the page says anything about its host's identity
  kind beyond the host's own screen (S115). A `github` host's page and
  a `frontegg` host's differ in what they draw — members section,
  roles, flag-gated surfaces — and whether the operator is told why,
  or simply sees the page their host serves, is not settled. Related:
  whether the upgrade (247a) is announced on the page at all, or is
  only ever the service's act the operator learns about elsewhere.
- **S192.** The visual shape of the hosts settings screen and the
  organization store: how headings and slots are laid out against the
  row list, how a list heading (sinks, adapters, runners per role)
  grows, where a slot's catalogue opens, and how a pool's hosts fold
  under its row. The mockup round settles it; S114–S117, S156 and
  S176 bind what it must show.
- **S193.** Ruled 2026-09-08: the pool row shows the ceiling and the
  per-host-hour rate from the manifest, and whether the ceiling
  stopped an addition (242). It shows no live spend; that would need
  the platform's price at read time.
- **S194.** Ruled 2026-09-08: an owner is one member or nobody; roles
  are not owners (237 amended), so "mine" is the decisions owned by
  the signed-in member and nothing else (S171).
