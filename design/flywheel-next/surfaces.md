# Flywheel next — surfaces

The surfaces the operator works: the plan page with its rail, board,
dock and capture box; the chat rendering; the review surface bindings;
the status view on a phone. This document records decisions, flows,
forms and rulings. It records no pixels and no code. A construction
session building the page works from it without opening a mockup. A
later reader learns here which decisions are settled and why.

Sources and precedence:

| source | role |
|---|---|
| `requirements.md` | the contract; this document may not contradict it. A.2, B.4, B.6, 155, 193–194, 196, 209–210 bind the surfaces directly. |
| `models/context-map/model.md` §6 | the current text of 198–202; the map view follows it |
| `models/statechart/model.md` §5 | the plan's derivation, numbers, decision catalogue, sinks, responses and tool surface |
| `models/statechart/profiles/surfaces.yaml` | the tool catalogue the page's controls call (193) |
| `plan-mockup.md` | the seed: organization willdan, 2026-09-04 07:40, decisions 412–421 |
| `mockups/rail-and-board.html` | the direction for the plan page; illustrates §1–§4 |
| `mockups/context-map-ddd.html` | the adopted map model drawn; illustrates the board's map view |
| `mockups/workbench.html` | retired; source of the seed extension (422, 424) and the session chip |
| `mockups/queue-workstream.html`, `triage-deck.html`, `river.html` | rejected metaphors; cited in §5 |
| `mockups/context-map.html` | superseded map on the v1 schema; cited in §5 |

Where two mockups disagree, rail-and-board and context-map-ddd win.
Every statement is numbered S1, S2, … so a claim or a work order can
cite one. A number in parentheses is a requirement; "model 5.3" is a
section of the statechart model; "map 4.2" is a section of the
context-map model.

## 1. Surfaces

### 1.1 The plan page

- **S1.** The plan page is one page, served on the operator's private
  network, that works on a phone (155). It has four regions: a header,
  a machinery strip, a rail, and a board. A dock opens over the board.
- **S2.** The header shows the organization, the as-of time of the
  read the page was built from (145), the count of decisions, the
  "yes all" control with the numbers it will answer, the count of
  responses sent with a control that opens the sent log, and a theme
  control (light, dark, system).
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
  object. Each is an `answer` call and is recorded (153).
- **S9.** SINCE lists what entered a tail state since this sink's
  delivery mark (14, model 5.5): merged, landed, closed, dropped,
  started, finished, accepted, answered, held. A line names the object,
  the reason and the time. "Later" writes no SINCE line (§5).
- **S10.** The board is the status view (B.4) drawn by phase. It holds
  objects only, never the count. It has two views, phases and map,
  switched in the board's header or with the m key. The dock opens over
  the board and the board does not move.
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
  "explore…" control (S58).
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
  an external context dashed.
- **S21.** At rest a card shows its name, status, a home chip per
  distinct home with a verdict dot, an attachment count chip, a count
  of elements per kind (names when five or fewer), its tags, and its
  decision markers. The whole map is readable without opening anything.
- **S22.** A context opens in place and grows; the rest stays and
  dims. Open it lists its elements grouped by kind with name, home chip
  and verdict dot, its language, its attachments as chips, an open
  element's question with the capture control beside it. Links are
  drawn only while a context is open. A second context opens without
  closing the first. Fit re-centres on what is open.
- **S23.** A strip above the canvas lists the repositories as chips
  with elements homed, capabilities and unmet count, the map check
  (green or n failures), and "+ repository". A control strip carries
  the facets (off, filter, colour, group per facet), a legend when one
  colours, the invariant readout "0 moved · 0 edges changed" recomputed
  after every facet switch, the overlay control (none, current → target,
  since last review), "changes · n" when an overlay is on, the review
  mark and "mark reviewed" when the review overlay is on, and fit.
- **S24.** Overlays come from one id-keyed difference (map 4.4, 4.5):
  added with a plus mark, changed with a delta and the fields on hover,
  removed ghosted, moved with the old home struck through. The review
  overlay uses a second colour over the target only. Either overlay may
  be on; the map underneath is always the target.
- **S25.** The map view never draws: a repository as a node; a claim
  as a node; verdict text or evidence; chapter prose; a lane, tier,
  layer or runtime as a box; the current map as a second drawing; saved
  camera state (map 5.5).
- **S26.** Requirements served: 122, 195, 198–202 as rewritten, 104,
  105, 112. Tools called: `attach` (S71), `capture` (S22),
  `create-repository` or `adopt-repository` (S72), `reviewed` (S73).

### 1.4 The dock

- **S27.** The dock is one panel over the right of the board. Esc, the
  × or a click outside closes it. The rail's move keys change what it
  shows while it stays open. Under 760px it is full screen with a back
  control. Its header takes the form of the object (209); its footer
  carries the object's answers or dictations, or says "nothing to
  answer" and why.
- **S28.** Dock pages, one per kind:

| page | opened from | body | footer |
|---|---|---|---|
| decision | a rail card, a marker | the decision's text; the evidence its kind shows (S5); its document when it has one, with a plannotator link (S33); its history with the operator's responses | the answers, one response each; in-flight state while one is sending |
| proposal | its decision | the proposal read whole: every bolt (open or new, name editable) with its units; per unit: name, type, why, dependencies, covered claims, lineage, controls bolt · new bolt · rename · type · drop; a refusal inline when an edit would break a dependency, with the offer to take dependents along; "what a yes starts"; the "that's all wrong" field; lineage intent → writeback → landing on the books → planning run → proposal (184) | yes · redo · later |
| unit | its decision or slip | the unit document with a note control per section; items and stages; cited claims; sessions running (none before yes) | yes · drop · redo · bolt · new bolt · rename · type · later |
| bolt | a ledger | the ledger; the bolt's repository, line and place; decisions on it (in the rail, where you answer); its units with drop per unstarted unit; rename; sessions running with host and last activity; services with start and stop; served endpoints; history | no decision here that is not in the rail; drop, rename, start and stop are dictations |
| landed bolt | a record | the record; the landing (when, through which gates, place removed); pull request and checks; environments; units landed; signals from operation with their move | nothing to answer |
| intent | a thread | the thread; the intent's state and line; decisions on it; sessions running | its decision's answers when one is pending, else nothing to answer |
| elaboration | a bead; ] and [ from the thread | kind, type and state; its pending decision with the answer controls; its document excerpt; the records it wrote into the intent's change directory (187); its session chip; "in gathering n" when covered (188); the countdown when finished (210) | the decision's answers; finish on a standing one; nothing else |
| exploration | its row in Inception | the covered intents; where its records go (per intent) and where its conclusions go (the book, once); its session | finish (standing) or end (with-operator) |
| planning in progress | its row in the gate | what planning reads; the operator's notes it carries; its session | nothing yet; the next proposal is the decision |
| deferred | its greyed sheet | when later was answered; that it left the count, wrote no SINCE line, and is superseded silently by planning's next run (172, 35) | ask again |
| repository | the strip, a home chip, a baseline's link | kinds and capabilities, derived (map 4.3); contexts it homes; claims in scope with verdicts and each claim's attachments beside the re-attach control (195); homed elements; decisions on it | show on map; the baseline decision's answers when one is pending |
| host | the host strip | alive or gone with last heartbeat; what it runs against its bound; its leases | takeover · wait when gone; nothing to answer when alive |
| claim | an attachment chip, a repository's claim row | the claim text and version; attached to (each attachment with its scope contribution); scope, derived; verdicts per repository in scope | re-attach… (arms the canvas, S70); show on map |
| map context, element, relationship, link | a card, an element row, an edge, a link | id, ref to the chapter, status, tags; the overlay difference when one is on; home (effective and where it came from); ends and marks for a relationship; crossing for a link; attached claims with the derived scope line; verdicts per repository; decisions as markers with the rail card inline; an open element's question with its capture control | open on map · light on map |
| changes | "changes · n" | the difference list with a link per entry; the review history when the review overlay is on | mark reviewed (review overlay only) |
| map check | the check button | every failure, or green | "+ repository homes the unhomed" |
| add repository | "+ repository", the check page | name; the unhomed elements it homes or a context it becomes the default home of; kinds and capabilities derived live; the claims that fall into scope | propose: one response (S72) |
| attention | an attention line | what it means and what each answer does | the one-word answers |
| external system | a dashed card | what it is; who meets it; that a claim on the contract is in scope for every repository that meets it | nothing to answer |

- **S29.** Requirements served: 17, 47, 68, 141, 144, 146, 172, 184,
  187–188, 195, 209–210. Tools called: `answer`, `drop`, `rename`,
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
  tool call with no interpreter at all.

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
  for the book, the changed chapters with the previous version beside
  each, served at `/review`.

### 1.8 The status view on a phone

- **S38.** Under 760px the plan page is two tabs at the foot,
  Decisions and Board, each with its count badge. The rail is the
  Decisions tab, unchanged. The Board tab stacks the four lanes in
  order, then the map view's context list (each context as its card
  with its relationships listed under it) in place of the canvas. The
  dock is full screen with a back control. The header hides the key
  hints and the "yes all" numbers.
- **S39.** The phone keeps every form of §3 and every control of §1.
  Nothing is answerable on the phone that is not answerable on the
  desktop, and nothing the desktop answers is missing on the phone (2,
  155).

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

- **S43.** 1. Inception head: "explore…" enters selection; every open
  intent's head knot shows a tick target; a sticky bar at the lane's
  foot says what will happen and offers with-operator or standing,
  start and cancel. 2. Two intents ticked; the bar counts them. 3.
  Start → `explore([intents], standing)`. 4. Selection ends; an
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
  context, an element, an edge or a link · esc cancels". 2. One click
  on the target → `attach(claim, element)`. 3. The bar clears; the
  claim page reopens with the new attachment, the recomputed scope line
  and verdicts: a repository newly in scope shows unjudged and
  "planning due"; one that left shows not applicable (195, map 4.8).
  Nothing else on the map moves.

### 2.9 Reviewing what changed since the last mark

- **S48.** 1. Map control strip: overlay "since last review"; the mark
  and its date show; unchanged cards and edges dim, changed ones carry
  the marks of S24 with a note. 2. "changes · n" opens the changes page:
  every difference with a link, and the review history with the mark.
  3. A link opens the element's page; its ref opens the chapter. 4.
  "mark reviewed" → `reviewed` on the plan object; the mark moves to
  now; the overlay shows nothing changed; the book's review view
  empties the same way (122).

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
| host | a pill in the host strip | alive or gone, sessions against the bound, last heartbeat | its pill lights its sessions in every lane | gone in the strip; released after takeover |
| repository | a pill in the strip; a home chip on a map card | name, unmet count; on the map: elements homed, capabilities | its chip | retiring when homed only in current |
| claim | an attachment chip, never a node | name, version; on a repository page its verdict per repository | its scope lights on the map | not applicable when it leaves a scope |
| map context | a card | name, status, home chips with verdict dots, attachment count, element counts, tags, markers | the card and its edges | ghosted when removed |
| relationship | a typed edge with pattern name and marks | pattern, U and D, OHS, PL, ACL, lens, bar | the edge | ghosted when removed |
| link | a line drawn only while a context is open | kind, target element named | the line | ghosted when removed |
| machinery session | a row in the machinery strip or on its object | curation beside the unmoved counter, planning in the gate, a conflict fix on its bolt | its chip | leaves when its run ends |

- **S52.** Markers: a decision's number with its group glyph on the
  object it concerns (S17). A gathered elaboration's marker sits on
  every covered intent. A host marker sits on the bolt whose item it
  holds. On the map a marker sits on the card or edge the decision
  concerns and opens the rail card inline in the dock.
- **S53.** Session chips are one style everywhere: agent · model, the
  host, the activity word, a pane link that opens the session's pane in
  herdr (68, 196). State is colour and dot only: working filled and
  pulsing, starting dashed, idle hollow, blocked an amber ring. A host
  pill lights its chips in every lane and dims the rest.
- **S54.** The machinery strip sits above the lanes: hosts as pills
  (alive or gone, sessions against the bound, last heartbeat), then the
  repositories as pills. Machinery sessions sit by phase, not in the
  strip: curation beside the unmoved counter, planning inside the gate
  while it runs, a conflict fix on the bolt it works.
- **S55.** Countdowns: a finished object says "leaves in Nd", or
  "leaves today", from the bounded window (186); a landed bolt says
  "stays · <what is live>" while its request, environments or a signal
  is live; a soon countdown (two days or less) is marked. A deferred
  proposal shows the time it was deferred, never a countdown.

## 4. Keys and modes

- **S56.** The key table:

| key | region | does |
|---|---|---|
| j, k, ↓, ↑ | rail | walk the decisions and attention lines; the dock follows when open |
| Enter, o | rail | open the focused card in the dock |
| y | rail | the focused card's yes |
| n | rail | the focused card's drop or no |
| l | rail | the focused card's later, where it offers one |
| ], [ | rail or dock | step through the beads of the intent in hand |
| m | board | switch phases and map |
| / | board | focus the capture box |
| Esc | anywhere | in order: leave a field, close the log, cancel explore selection, cancel re-attach, close the dock, close every open context |
| f | map | fit, the only camera command |
| o | map | cycle the overlay: none, current → target, since last review |
| j, k | map canvas | walk the contexts when the canvas has focus |
| Enter | map canvas | open the focused context in place |
| →, ← | none | not bound |
| h, l | none | not bound as movement |

- **S57.** The one-axis rule: the rail is one list and j and k walk
  it. There is no second axis anywhere on the plan page; h and l move
  nothing. A key that a card does not offer is refused with the card's
  answers listed, never remapped.
- **S58.** Modes, how each is entered and left:

| mode | entered by | shows | left by |
|---|---|---|---|
| explore selection | "explore…" at Inception's head | tick targets on every open intent's head knot; a sticky bar with the count, with-operator or standing, start, cancel; beads never show a tick | start (sends `explore`), cancel, Esc |
| re-attach | "re-attach…" on a claim page | the dock closes; a bar names the claim; every context, element, edge and link is a target | one click (sends `attach`), cancel, Esc |
| overlay | the overlay control or o | the difference marks of S24; "changes · n"; the review mark and "mark reviewed" for the review overlay | none, or o back to none |
| facet | off, filter, colour, group per facet | dimming, a colour with a legend, or a background wash; the invariant readout | off |
| context open in place | Enter, a card header, a link from the dock | the card grows, links draw, the rest dims | the header again, Esc closes all |
| dock | Enter, a marker, a card, a pill, a chip | one page of S28 over the board | Esc, ×, a click outside |
| phone tabs | width under 760px | Decisions or Board | the other tab |

## 5. Rulings

Dated 2026-09-05. Each with its reason.

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
- **S67.** Whole map at rest, two zoom levels, fit only (map 5). A
  context opens in place; the rest stays. No pan history, no saved
  positions. The v1 map's hop depth and trace-to-store are not carried.
- **S68.** Facets are tags, never structure (map 2.5, 5.3). A facet
  filters, colours or washes and moves nothing; the control strip
  proves it after every switch. Lanes, tiers, runtimes and stores are
  tags or kinds.
- **S69.** Repositories, claims and lanes are never nodes (map 5.5). A
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

## 6. Open

What no mockup settled.

- **S78.** The phone layout beyond the stacked list: whether the
  lanes collapse to heads with counts, whether the map's context list
  draws relationships as more than lines of text, and where the capture
  box sits when the rail is the first tab.
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
- **S84.** The key j and k on the map canvas walk contexts while the
  same keys walk the rail; which region has focus when the map view
  opens, and whether Tab moves between them, is unsettled.
