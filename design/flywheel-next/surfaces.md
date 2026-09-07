# Flywheel next — surfaces

The surfaces the operator works: the plan page with its rail, board,
dock and capture box; the board's three views, phases, map and book;
the artifact views behind every object; the flywheel instrument; the
hosts surface and the account item; the chat rendering; the review surface bindings; the
status view on a phone. This document records decisions, flows, forms
and rulings. It records no pixels and no code. A construction session
building the page works from it without opening a mockup. A later
reader learns here which decisions are settled and why.

Sources and precedence:

| source | role |
|---|---|
| `requirements.md` | the contract; this document may not contradict it. A.2, B.4, B.6, 155, 193–194, 196, 209–212 bind the surfaces directly. 213, 214, 229 and 230 are drafted and cited here by their drafted numbers: 213 the artifact views, 214 the flywheel instrument, 229 and 230 the hosts surface and enrolment. |
| `models/context-map/model.md` §5, §6 | the map's rendering at both levels; the current text of 198–202 |
| `models/statechart/model.md` §5 | the plan's derivation, numbers, decision catalogue, sinks, responses and tool surface |
| `models/statechart/profiles/surfaces.yaml` | the tool catalogue the page's controls call (193) |
| `models/dispatch/model.md` §1–§5 | the vocabulary of a host's parts: presenter, capture endpoint, triage, interpreter, adapters, runners, placements |
| `plan-mockup.md` | the seed: organization willdan, 2026-09-04 07:40, decisions 412–421 |
| `mockups/rail-and-board.html` | the direction for the plan page; illustrates §1.1–§1.2, §1.4–§1.12 |
| `mockups/context-map-ddd.html` | the adopted map model drawn at both levels; illustrates §1.3 |
| `mockups/workbench.html` | retired; source of the seed extension (422, 424) and the session chip |
| `mockups/queue-workstream.html`, `triage-deck.html`, `river.html` | rejected metaphors; cited in §5 |
| `mockups/context-map.html` | superseded map on the v1 schema; cited in §5 |

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
  same list the chat prints, with the answers as controls (18).
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
  and its answers as buttons. A card with a question shows the question
  verbatim. A card for a gathered elaboration lists the covered intents,
  each with its own drop.
- **S6.** Every answer control calls the `answer` tool with the
  decision number and the answer, plus text where the answer takes it
  (redo, reply, rename, new bolt, pick, type, bolt). One click is one
  response. The card takes an in-flight state and refuses a second
  click until the response settles; then the card leaves the rail and
  focus moves to the next card.
- **S7.** "yes all" sends one `answer` per approve decision, in number
  order, each recorded on its own (model 5.6). It never sends a batch.
- **S8.** Attention lines carry one-word answers: takeover or wait on a
  lost host; ok on a response that could not apply and on an uncovered
  object; placed on a secret the machinery cannot place (S123). Each is
  an `answer` call and is recorded (153).
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
  "explore…" control, which enters the explore mode (S43, S58).
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
  105, 112. Tools called: `attach` (S71), `capture` (S22),
  `create-repository` or `adopt-repository` (S72), `reviewed` (S73).
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
| decision | a rail card, a marker on a lane, the map or a chapter margin | the decision's text; the evidence its kind shows (S5); its document when it has one, with a plannotator link (S33); its history with the operator's responses; "read in book" per cited claim; "the artifacts behind it" | the answers, one response each; in-flight state while one is sending |
| proposal | its decision | the proposal read whole: every bolt (open or new, name editable) with its units; per unit: name, type, why, dependencies, covered claims with "read in book", lineage, controls bolt · new bolt · rename · type · drop; a refusal inline when an edit would break a dependency, with the offer to take dependents along; "what a yes starts"; the "that's all wrong" field; lineage intent → writeback → landing on the books → planning run → proposal (184) | yes · redo · later |
| unit | its decision or slip | the unit document with a note control per section; items and stages; cited claims with "read in book"; sessions running (none before yes); "change" opening its artifact view once approved, "no change yet" before (187) | yes · drop · redo · bolt · new bolt · rename · type · later |
| bolt | a ledger | the ledger; the bolt's repository, line and place; decisions on it (in the rail, where you answer); its units with drop per unstarted unit and "change" per unit; rename; sessions running with host and last activity; services with start and stop; served endpoints; the acceptance file (S99); history | no decision here that is not in the rail; drop, rename, start and stop are dictations |
| landed bolt | a record | the record; the landing (when, through which gates, place removed); pull request and checks; environments; units landed; the acceptance file; signals from operation with their move | nothing to answer |
| intent | a thread | the thread; the intent's state and line; decisions on it; sessions running; its change directory (S99) | its decision's answers when one is pending, else nothing to answer |
| elaboration | a bead; ] and [ from the thread | kind, type and state; its pending decision with the answer controls; its document excerpt; the records it wrote into the intent's change directory (187), opening the change directory view; its session chip; "in gathering n" when covered (188); the countdown when finished (210); a knot in the header and a back link to the thread | the decision's answers; finish on a standing one; nothing else |
| exploration | its row in Inception | the covered intents; where its records go (per intent) and where its conclusions go (the book, once); its session | finish (standing) or end (with-operator) |
| planning in progress | its row in the gate | what planning reads; the operator's notes it carries; its session | nothing yet; the next proposal is the decision |
| deferred | its greyed sheet | when later was answered; that it left the count, wrote no SINCE line, and is superseded silently by planning's next run (172, 35) | ask again |
| repository | the strip, a home chip, a baseline's link, a library row | kinds and capabilities, derived (map 4.3); contexts it homes; claims in scope with verdicts, each claim's attachments beside the re-attach control and "read in book" (195); homed elements; decisions on it | show on map; the baseline decision's answers when one is pending |
| host | the host strip | alive or gone with last heartbeat; what it runs against its bound; its leases; "hosts" opening its row on the hosts surface (S115) | takeover · wait when gone; nothing to answer when alive |
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
  (12). Under the box the page says what it will send: "will send:
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
  menu opens full screen with a back control.
- **S39.** The phone keeps every form of §3 and every control of §1.
  Nothing is answerable on the phone that is not answerable on the
  desktop, and nothing the desktop answers is missing on the phone (2,
  155).

### 1.9 The board, book view

- **S91.** The book view is an mdBook-style viewer the page draws
  itself. The organization's books are mdBook sources in the books
  repository; the server serves each chapter, and the page draws the
  chapter tree, one chapter at a time with previous and next, headings
  with anchors, and the claim blocks as the flywheel renders them. The
  view is entered with b or from the board's header, and b leaves it.
  The rail stays beside it and j and k walk the rail only.
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
  control in the book header. It lists the organization's books with
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
  building units) divided by drain, where drain is the alive hosts'
  summed bound over the slot-days a unit takes, taken from the last
  week's merges (142). A gone host drains nothing. It is drawn as a
  wheel on a week's scale, a band naming its state ("primed for 5
  days", "running dry", "primed for a week or more"), and is opened
  from the machinery strip's pill or with w (214).
- **S104.** Three columns under the wheel: feed, what waits on the
  operator (proposals to approve with the units they carry,
  elaborations waiting, intents to approve) and the days a yes on each
  adds; pressure, what is approved and waiting or running against the
  alive slots, and the number behind the bound; drain, hosts alive of
  hosts, utilization, units merged per day at the bound, a seven-day
  merges sparkline, bolts landed per week labelled "history, not a
  target" (142), and "add a host to drain faster" opening the hosts
  surface on "+ host".
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
  n items on m alive slots"; "primed: agents have d days". Every
  reading is marked a projection, never a target.
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
- **S112.** Requirements served: 142, 145, 214. Tools called: none;
  "add a host" opens the hosts surface.

### 1.12 The hosts surface

- **S113.** Hosts is an overlay over the board, opened from the
  account item's hosts entry (S157), from the setup control in the
  hosts strip, from a host's dock page, or from the flywheel's "add a
  host". It is separate from the operator's decisions: nothing on it
  is in the count until a flow on it raises a decision, which then
  appears in the rail like any other (229).
- **S114.** Hosts is the organization's hosts, browsed. On the left
  one row per host: kind and platform (a laptop or a home host on
  herdr, a container on flywheel-cloud, the dispatcher placement with
  bound 0), alive or gone, bound, when it joined, and the parts it runs
  as chips grouped by kind. A dispatcher placement is only what a host
  runs; a host with bound 0 takes no construction work and changes no
  runway reading (dispatch 2, 5).
- **S115.** The parts a host may run, in the dispatch model's
  vocabulary: capture adapters, each naming its source (dispatch 4);
  the chat sinks it presents, with a "lease" badge on the sink whose
  presenter lease it holds (148); the agent (S116); triage, with the
  sources it reads; its runner (pane · in-process · managed, dispatch
  2); its router (191); sign-in (none · GitHub · an SSO). Selecting a
  host opens its detail in place with each part's state: installed ·
  adding, decision n · needs a secret, under attention with "place it"
  · installing, chore wi-#n · disabled, with "enable" as one logged
  response. A kind the host does not declare says so.
- **S116.** The host's "agent" is the name on this surface for the job
  that reads the plan and the objects, answers the operator in chat,
  and proposes writes as tool calls the operator confirms (194): the
  dispatch model's interpreter job. The chip's hint says so: "reads and
  answers; every write is a proposed call you confirm". The model keeps
  "interpreter"; the surface says "agent".
- **S117.** On the right, the host's store: the per-host packages,
  what a host runs: adapters, chat sinks, the agent, triage, runners,
  routers, sign-in; the list is filtered to the selected host's
  platform, with "any platform" showing the rest greyed with what they
  need. Each entry shows name, version, "shipped" or "index", what it
  needs (secrets, platform, network), what it enables, and "add", or
  its state on the host when it is already there. A search box and a
  kind filter sit above. Organization packages never appear here; they
  are the organization store's (S156).
- **S118.** "add" is one flow. It collects the part's configuration
  and the secrets it needs in one form, says which secrets the
  machinery places and which the operator must place, and ends by
  raising one install decision in the rail (approve · yes · no, kind
  install). The part appears on the host's row as "adding · decision
  n" the moment the flow ends. The decision's yes runs one session on
  the fleet's chores line (60, S75) and its proof turns the part to
  installed (204); no takes the part off the host again. Nothing is
  installed by the flow itself.
- **S119.** Configuration is changed later on the same surface: a
  part's detail shows its configuration with the same form, and a
  change is one logged response that the machinery applies as a
  re-install of that part. A secret is never shown back; a changed
  secret is placed again through "place it".
- **S120.** "+ host" is a guided flow on the same surface, in order:
  pick a platform (flywheel-cloud managed · a container on any platform
  · a laptop) and a name; pick the parts it will run from the per-host
  index; provisioning runs from the host you are on with your own
  platform credentials, read at run time and never stored; only the
  chosen parts' secrets are listed for hand-over into the platform's
  secret store, and you hand them over; an enrolment decision appears
  in the rail ("enrol host <name>", approve · yes · no, kind enrol) with
  a one-time token that expires; the host joins with the token by one
  command (205), reads the manifest and installs its declared parts
  from its store; the row shows alive. Each step shows its state
  (queued · running · waiting on you · done · skipped · stopped) and
  the flow ends with the new host row alive in the strip and the list
  (230).
- **S121.** "adopt existing" is enrolment by token alone: a host
  already running the binary skips platform, provisioning and the
  hand-over and goes straight to the enrolment decision and its token.
- **S122.** A host's own joining is folded into its detail as the
  record of how it joined, the same steps with their outcomes; the
  cloud host's detail carries it like any other.
- **S123.** A secret the machinery cannot place (207) sits under
  attention with "place it": the command to run, that the page never
  carries the value, and a one-word "placed" answer that has the
  machinery check the path. The part links to the attention line and
  the line back to the host; the strip's setup control carries
  "secret" while one waits (149).
- **S124.** The hosts surface never: installs anything without a
  decision; shows a secret's value; stores a platform credential;
  enters the count by itself; runs a ladder or an order of
  installation; lists an organization package. Every placement of the
  dispatch model (dispatch 5) is a host on this list with the parts it
  runs.
- **S125.** Requirements served: 149, 191, 204, 205, 207, 229, 230.
  Tools called: `answer` (the install and enrol decisions, "placed",
  "enable"); the add, change and "+ host" flows raise decisions and
  call nothing else (§6, S148).

### 1.13 The account item

- **S152.** A standard account item sits at the right of the header:
  who you are and the sign-in kind, as a chip. It expands to a menu in
  a fixed order: the organization switcher, then settings, hosts, the
  organization store, and sign-out. It is the one place the page
  reaches the organization as a whole rather than an object in it.
  Nothing in the menu is in the count; a flow in it that needs the
  operator's yes raises a decision in the rail like any other.
- **S153.** Who you are is the name the sign-in gave and the sign-in
  kind: "local · no sign-in" when the page is served by a host on the
  operator's own machine; GitHub or Okta SSO when a host serves the
  page behind its sign-in part (S115). Sign-out ends the session with
  the serving host and is shown only when a sign-in exists.
- **S154.** The organization switcher lists every organization the
  serving host is joined to (205), each with its decision count.
  Choosing one swaps the whole page to that organization: the rail,
  the board in every view, the machinery strip's hosts and
  repositories, the flywheel reading, the books and the map. The as-of
  time is that organization's read. Nothing carries across: no focus,
  no open dock, no mode, no overlay. The page's address names the
  organization, so a link opens it directly and the chat's link (S32)
  lands on the right one.
- **S155.** Settings is the manifest as a form: the organization's
  declarations grouped as the manifest groups them, profile, defaults
  per role (173), sinks and their presenters, routers, raw stores,
  callers, curation and triage cadences, each field with what it is
  and where the machinery reads it. Save is one response for the whole
  form; the machinery applies it as one manifest commit and the page
  re-reads. A secret is never a field: it is placed (S123). A host's
  declaration is changed on hosts, a repository's is derived, and the
  form says so beside each field it does not carry.
- **S156.** The organization store lists the organization packages:
  unit and elaboration types, deliverable producers, map vocabularies,
  templates, scenario packs (190, 208), each with name, version,
  "shipped" or "index", what it needs, what it enables, and its state
  in the books: installed in the books · adding, decision n ·
  installing · not installed. "add" is the one flow of S118 without a
  host: configuration collected, then one install decision on the
  organization; its yes installs the package into the books repository
  and the default set (190) grows. A search box and a kind filter sit
  above. Nothing here names a host.
- **S157.** Hosts in the menu opens the hosts surface of §1.12. The
  strip's setup control opens the same surface; it is a shortcut to
  hosts and to nothing else.
- **S158.** The account item never: answers a decision; shows a
  secret's value; lists an organization the serving host is not joined
  to; installs anything without a decision; mixes an organization
  package into a host's store or a host's part into the organization
  store.
- **S159.** Requirements served: 149, 173, 190, 203, 205, 208. Tools
  called: `answer` (the install decision); settings' save and the
  store's add raise responses whose catalogue entries are open (S148).

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
  installed, triage with sources meeting and folder, no chat sink. 2.
  The host's store filtered to macOS lists the Discord sink, needs a
  bot token; "add" opens the flow. 3. The form collects the guild and
  channel, says the bot token is a secret the operator places, and
  "done" raises decision n in the rail, kind install, approve; the
  chip on the row reads "adding · decision n". 4. Rail: y →
  `answer(n, yes)`; the chip reads "installing · chore wi-#m"; the
  chore runs on the fleet's chores line; the bot token sits under
  attention with "place it" until "placed" → `answer(secret, placed)`
  and the machinery checks the path. 5. The proof arrives; the chip
  reads installed, with "lease" once the presenter lease is taken.

### 2.17 Enrolling a host

- **S131.** 1. Hosts: "+ host"; platform flywheel-cloud managed, name
  willdan-cloud-2. 2. Parts: the Discord sink and the agent ticked from
  the host's store. 3. Provisioning runs from the host in hand with
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

- **S160.** 1. Header: the account item reads "chuck · local · no
  sign-in"; a click opens the menu with the switcher at its head:
  willdan · 9, mad-swan · 2. 2. mad-swan chosen. 3. The whole page
  swaps: the rail shows mad-swan's two decisions, the board its lanes,
  the strip its hosts and repositories, the flywheel its runway, the
  address names mad-swan; the dock that was open is closed, no card is
  focused, the view is phases. 4. The header's as-of time is mad-swan's
  read; the account item reads the same name. 5. The switcher again
  returns to willdan the same way, with nothing remembered from before.

### 2.19 Adding an organization package

- **S161.** 1. Account item: organization store; the list shows
  unit types, producers, vocabularies, templates and scenario packs
  with their states; the "data-product" vocabulary reads not installed
  · index · needs nothing. 2. "add" opens the flow: the vocabulary's
  configuration (the kinds it adds, the facets it declares), no
  secret; "done" raises decision n in the rail, kind install, approve;
  the row reads "adding · decision n". 3. Rail: y → `answer(n, yes)`;
  the row reads installing. 4. The proof arrives: the row reads
  installed in the books; the map's kind legend and the facet controls
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
| host | a pill in the host strip; a row on the hosts surface | alive or gone, sessions against the bound, last heartbeat; on hosts: kind, platform, bound, joined, parts as chips | its pill lights its sessions in every lane | gone in the strip; released after takeover |
| repository | a pill in the strip; a home chip on a map card | name, unmet count; on the map: elements homed, capabilities | its chip | retiring when homed only in current |
| claim | an attachment chip, never a node; a block in the book | name, version; on a repository page its verdict per repository; in the book: standing or proposed, attachments, scope line, verdict dots | its scope lights on the map; its block lights in the book | not applicable when it leaves a scope; dashed while proposed |
| map context | a card with a thumbnail | name, status, home chips with verdict dots, attachment count, markers, open-question badge, tags, the thumbnail | the card and its edges | ghosted when removed |
| map element | a dot in a thumbnail; a node when drilled | dot: kind colour, home ring; node: kind, name, home chip, verdict dot, attachment chip, markers, status, question badge, tags | the dot or node | ghosted when removed |
| relationship | a typed edge with pattern name, marks and a crossing pill; a neighbour dock when drilled | pattern, U and D, OHS, PL, ACL, lens, bar, crossing count | the edge and its panel | ghosted when removed |
| link | a hairline in a thumbnail; a typed edge when drilled; a row in an edge's panel | kind, target element named | the line | ghosted when removed |
| machinery session | a row in the machinery strip or on its object | curation beside the unmoved counter, planning in the gate, a conflict fix on its bolt | its chip | leaves when its run ends |
| artifact view | a dock page under a source bar | the artifact rendered to its kind (S99), the source bar | none | "no change yet" before a unit's yes |
| flywheel | one pill in the strip; one panel | runway, streak, "at risk"; the panel: wheel, pipe, three columns, reading, streak, advanced | none | none; it reads |
| part | a chip on a host's row | kind word, name, state (installed, adding, needs a secret, installing, disabled), "lease" on a presenting sink | the chip and its attention line when one waits | disabled |
| package | a row in a host's store or in the organization store | name, version, shipped or index, needs, enables, "add" or its state on the host or in the books | the row | greyed under "any platform" with what it needs |
| account item | a chip at the header's right | who you are, the sign-in kind; open: the switcher, settings, hosts, organization store, sign-out | none | none |

- **S52.** Markers: a decision's number with its group glyph on the
  object it concerns (S17), one glyph set everywhere: on a lane, on a
  map card, edge, node or neighbour dock, in a chapter margin, on a
  host's row or a store row. A gathered elaboration's marker sits on
  every covered
  intent. A host marker sits on the bolt whose item it holds. A marker
  click focuses the rail card and opens the dock with the card inline.
- **S53.** Session chips are one style everywhere: agent · model, the
  host, the activity word, a pane link that opens the session's pane in
  herdr (68, 196). State is colour and dot only: working filled and
  pulsing, starting dashed, idle hollow, blocked an amber ring. A host
  pill lights its chips in every lane and dims the rest.
- **S54.** The machinery strip sits above the lanes: hosts as pills
  (alive or gone, sessions against the bound, last heartbeat), the
  setup control that opens hosts, with "secret" while one waits, then
  the repositories as pills, then the flywheel pill (S109). Machinery sessions sit by phase,
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
| Esc | anywhere | in order: leave a field, close the log, cancel explore selection, cancel re-attach, hide an edge's panel, close the dock, close the account menu, the library, hosts, settings or the store, back from a drill |
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
| library | the book header's control | the organization's books with their counts | a choice, Esc |
| account menu | the account item | the switcher, settings, hosts, organization store, sign-out | a choice, Esc, a click outside |
| hosts | the menu's hosts, the strip's setup control, a host page, "add a host" | hosts and parts on the left, the host's store on the right; the add and "+ host" flows in place | Esc, × |
| settings | the menu's settings | the manifest as a form with one save | Esc, ×; an unsaved change asks first |
| organization store | the menu's organization store | the organization packages with their states; the add flow in place | Esc, × |
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
  wrong. The `context-map.html` mockup on that schema is superseded.
- **S71.** Re-attach is the scope gesture: arm on the claim, one click
  on any map id, one `attach` call (193, 200). No scope rules, no
  repository set.
- **S72.** Adding a repository is a proposal, not a dictation. The map
  gesture sends `create-repository` or `adopt-repository` and the
  operator's yes creates or registers it (206). Both map mockups, which
  added the repository on one click, are corrected here. The baseline
  decision arrives after the first planning runs, not at the add (104).
- **S73.** Marking reviewed is a response on the plan object, recorded
  like any other (122, statechart §10). The rail-and-board map logged it
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
  122). The books are mdBook and the server draws the chapter itself,
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
  the organization, installs into the books and runs on no host; an
  adapter, a sink, the agent, triage, a runner, a router or sign-in is
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

## 6. Open

What no mockup settled.

- **S78.** The phone layout beyond the stacked list: whether the
  lanes collapse to heads with counts, whether the map's stacked list
  draws relationships as more than lines of text, where the capture
  box sits when the rail is the first tab, and how the book's tree is
  reached on a phone.
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
  books profile, or a listing the session reports at exit (187, 210).
- **S82.** Which tool "ask again" calls on a deferred proposal. The
  catalogue is marked incomplete; `release` on the deferred object is
  the candidate, and `reviewed` has no catalogue entry yet.
- **S83.** Whether a per-unit edit is one `answer` on the proposal's
  number naming the unit, as rail-and-board sends it, or an `answer` on
  the unit's own decision, which model 5.3 forwards to the unit.
- **S84.** Which region has focus when the map view opens, and whether
  Tab moves between the rail and the canvas. j and k walk the rail in
  one and the focus ring in the other, so the answer decides which the
  keys reach first.
- **S144.** The drafted numbers 213, 214, 229 and 230 are cited here
  before ratification. When their text lands in `requirements.md`, the
  statements of §1.10–§1.12 are read against it and any difference is
  a correction here, not there.
- **S145.** The flywheel's drain constant. The instrument derives
  slot-days per unit from the last week's merges; what the machinery
  records to make that derivation, and what it reads when there is no
  last week, is not in the model (142, 145).
- **S146.** The install and enrol decision kinds, the fleet's chores
  line as where an install runs, the one-time token and its expiry, and
  whether an install chore may run before its secret exists and wait on
  it. All are invented on the hosts surface and none is in the
  statechart's decision catalogue (model 5.3).
- **S147.** The part vocabulary per host (adapters, chat sinks, agent,
  triage, runner, router, sign-in) and the split into a host's store
  and the organization store are the surface's; the manifest's
  declaration of a host (149, 203, dispatch 2) names some of them and
  not all. Which the manifest names and which a store adds is not
  settled.
- **S148.** Which tools the add, change, "+ host" and settings-save
  flows call. Each ends in a decision the rail answers or in one
  response, but the call that raises the decision, the effect that
  applies a configuration change, and the manifest commit a save
  becomes have no catalogue entry (193).
- **S149.** How the book viewer is served: chapters rendered by the
  server from mdBook sources, or mdBook's own build embedded. The claim
  block's rendering from the ledger is settled either way (S92).
- **S150.** The artifact keys and the review binding. The views are
  addressed as intent, unit on its bolt, claim, bolt and work item; the
  "review" control reaches a plannotator stub. What a review page shows
  when no decision is pending, beyond refusing a note, is not settled.
- **S151.** Whether thumbnails render on a phone at all, or only the
  caption's counts, and whether the stacked list when drilled draws a
  link as more than its target's name.
- **S163.** The switcher's source and the form's extent. The switcher
  lists the organizations the serving host is joined to; whether a
  host that serves several organizations serves them at one address
  or one per organization, and which manifest keys the settings form
  carries against those it only shows, is not settled (203, 205).
