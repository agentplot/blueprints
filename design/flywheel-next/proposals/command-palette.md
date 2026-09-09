# The command palette

Drafted 2026-09-08. The page has one typed input, the palette, with one
grammar shared with the chat. This revisits **S63** ("no typed grammar
anywhere on the page"), replaces the capture box (S30), and moves the
book into a viewer of its own.

## 1. Premise

One input on the page, opened with a key from anywhere, over the tool
catalogue every other client already speaks (193, 291, 293). It is no
second write path: a command resolves to one tool call with its arguments
named by object id (193), shows the call it is about to send, and sends it
on the operator's confirmation, which is a control and so involves no
interpreter at all (194). Plain text is a capture, sent unparsed (19), or
— where the flywheel has a model key — read by the model in the page's
browser, which proposes one call per thing asked, each confirmed on its
own (216a, 194). Everything it sends stays reachable by tap (311, 306):
the rail's buttons and every dock control are unchanged, and the palette
reaches them rather than replacing them.

## 2. One palette, one grammar

⌘K, Ctrl+K or `/` opens it from anywhere, Esc closes it ahead of
everything else in S56's order, and there is one field and no second
mode: what the operator types decides what it sends, in the grammar the
chat already speaks (194, 281).

| typed | what it is | sends |
|---|---|---|
| plain text | a capture, verbatim | `capture` (19) |
| plain text, where the flywheel has a model key | a message the model in the page's browser reads | one proposed call per thing asked (216a, 194) |
| `/<command> …` | a command from the catalogue | that command's tool call (193) |
| `412`, `#412`, `412 yes`, `412: <text>` | the short reply grammar | `answer` (194) |

**At rest.** The field, placeholder "What's on your mind? Type / for
commands.", and under it the last five things sent, read from the sent
log the header already carries (S2) and never from client state (310).

**On `/`.** The command list, fuzzy-matched as the operator keeps typing,
best first, each row naming the command, what it does in the operator's
words, and the object it will act on. It is the catalogue filtered by the
caller's permissions, so a tool the caller may not invoke is not offered
(293, 249); a feature a plan hides takes its command with it and names
what unlocks it in the plan's own name ("included in Team"), never a rung
(250, 280, S206). A command missing an argument asks for it in place, and
where nothing matches, "No command by that name. Delete the slash to
capture this instead."

**While typing plain text.** One preview line under the field, in the
shape the capture box used: "will send: capture", or "will send: capture
· first idea of a thread" when the intent toggle beside the field is on
(19, S30). Where the flywheel has a model key it reads "Enter captures
this. ⇧Enter asks the flywheel to read it", and the read yields one card
per thing asked, each confirmed on its own; a name resolving to nothing
is asked about, never guessed (194). Where there is no key it reads "Your
words are captured as written".

**With a number.** `412` or `#412` alone lists that decision's own
answers, one row each; `412 yes` and `412: <text>` send at once. A number
is unambiguous and needs no interpreter (194, 15); one naming no standing
decision says so and offers the rail.

**One grammar with the chat.** `/fw capture <text>` in the chat and
`/capture <text>` in the palette are one command over one catalogue (193,
293, 281): the prefix is the platform's, the name the flywheel's.

## 3. Actions

Every command is seeded and enters the machinery the normal way: one or
more tool calls, or a capture. Nothing here is a write the catalogue
lacks (193, 291), nothing asserts work was done (4), and each name is the
same in the chat after that platform's prefix (281, 293).

| command | what it becomes | clause |
|---|---|---|
| `/yes 412` · `/drop` · `/later` · `/redo <notes>` · `/reply <text>` | `answer(decision, answer, text)` — the same tool the rail's buttons call | 194, S6 |
| `/yes all` | one `answer` per approve decision in number order, never a batch | S7 |
| `/capture <text>` | `capture(text, source: page)` | 19, 111 |
| `/intent <text>` | `capture` then `mark-intent(capture)` | 19, S30 |
| `/elaborate` | pick intents, then `explore(intents, with-operator \| standing)` | 189, 188 |
| `/ask <text>` | `ask(repository, text)` | 28 |
| `/unit <text>` · `/chore <text>` | `propose-unit(bolt, text)`, `propose-chore(repository, text)` | 34, 60 |
| `/session <text>` | `open-session(repository, text)` | 69 |
| `/drop` · `/hold` · `/resume` · `/rename` · `/send-back` · `/retire` · `/finish` · `/end` · `/close` | the matching undo-or-defer tool on the object in hand | 4, 193 |
| `/start` · `/stop` · `/takeover` | `start`, `stop`, `takeover` | 47, 150 |
| `/attach` · `/detach` · `/home` · `/reviewed` | `attach`, `detach`, `set-home`, `mark-reviewed` | 200, 211, 122 |
| `/add-host` | `add-host(name, platform, parts, adopt)`, offered by what the serving host offers | 295, 230 |
| `/add-source` | `add-package(package, scope, host, config, secrets)` | 228, 229 |
| `/invite` · `/access` · `/role` | `invite-member`, `assign-application`, `set-role` | 255, 248 |
| `/assign` · `/mine` · `/all` | `assign`, `filter(sink, own \| all)` | 237, S171 |
| `/switch <flywheel>` | `switch-instance(instance)`; writes nothing | 218, S154 |
| `/settings` | opens the console's settings form; one save is one `configure-instance` | 233, S147 |
| `/open <object>` | navigation; no write, no confirmation | S28, S61 |
| `/book <chapter \| claim>` | opens the book viewer at that anchor | §5 |

A command carrying a guided flow — `/add-host`, `/add-source`, `/invite`,
`/settings` — opens that flow where it lives, the management console, at
the screen it names (S120, S147). The palette is the way in, the flow
unchanged, its finish the one call.

**Picking intents.** `/elaborate` opens a multi-pick of the open intents,
or takes those already ticked on the board. The picked set is the
argument and the path after `explore` is unchanged (189, S43); Inception's
sticky bar becomes the palette's footer — the count, with-operator or
standing, start, cancel.

## 4. Navigation

**Objects.** `/open <name>` matches live objects — decisions, intents,
elaborations, bolts, units, repositories, hosts, members, chapters,
claims — and opens the one chosen in the dock, over a board that stays in
place (S61, S28). Reading is no write, so it asks no confirmation; names
resolve against the live objects (194).

**Recents.** At rest the palette lists what was last sent, and `/` lists
what was last opened above the rest — renderings of the sent log and the
page's delivery (S2, 310), never stored client state.

**Scoped.** With a card focused on the rail or an object open in the
dock, the palette opens scoped to it: the object shows as a chip at the
field's head, `/` lists that object's own commands first, and a command
taking an object takes this one. An answer the card does not offer is
refused with the card's answers listed, as a key is (S57); the palette
never reaches past the card. Backspacing over the chip unscopes.

**Not a second axis.** j and k walk the rail and nothing else (S57);
while the palette is open ↑ and ↓ walk its list and the rail stays put.

## 5. The book viewer

The book is a standalone viewer, not a view of the page.

**What it is.** A read-only server rendering the instance's blueprints as
mdBook: the chapter tree, one chapter at a time with previous and next,
headings with anchors, and each claim rendered where its chapter includes
it by anchor, with its name, version, scenarios, attachments, derived
scope and one verdict dot per repository in scope (97, S92). Closes
**S149**.

**What it is built from.** The blueprints' shared line and only that.
What is in flight — an intent's proposed claims, a chapter an elaboration
has not landed — is not in it (187, 98). So the viewer is always the
standing destination, and the page is where changes to it are answered.

**Links out.** Every dock page's "read in book" per cited chapter or
claim, and the map's scope box, open the viewer at that anchor in a place
of its own; the dock stays as it was (S94), and no chapter is embedded.

**Links back.** Every chapter and rendered claim links to the object on
the page, at the host's address with the flywheel in the path (205a,
308): the chapter's intent, the claim's decisions and evidence. A link to
a host that is away says so rather than failing silently (150a).

**What "public" means.** On a self-managed host the viewer sits at the
host's one address beside the page and the private network is its
boundary (155, 191): everyone on that network reads it, with no sign-in
while the operators list holds a single entry and the device flow as soon
as a second is listed or it is reached from elsewhere (253, 253a).
Nothing goes beyond that network unless the operator says so (46).
On a hosted tier it is served at the tier's name under the caller's token
like every other request, and reads to members of that flywheel alone
(247, 249, 291). Serving it to readers who are not members is a separate,
explicit act: one opt-in per book, stated on the settings form as what it
is — "anyone with the link can read this book" — and revocable there.

## 6. The phone

The palette is a bottom sheet with the platform's own keyboard (311),
raised by a capture control on both tabs; `/` brings the command list as
on the desktop. Everything in it is one tap or one short reply: a matched
command's row is the tap, a captured idea the short reply (306, 311).
Nothing on the phone needs it — every decision is still answered by tap on
the Decisions tab, and the palette is the accelerator beside it (307,
S38, S39). Its rows are touch targets (311, S61).

## 7. What changes in rail-and-board

- **Header.** Gains the palette's affordance at its left with its key
  hint, hidden under 760px as the other hints are (S2, S38).
- **Inception.** Loses the capture box (S30) and the "explore…" control
  (S13, S43), keeping the curation counter with its session chip and the
  exploration rows; the space goes to the threads.
- **Rail.** Unchanged: answers as buttons, "yes all" in the header, the
  filter at the rail's head (S3, S5, S7, S171).
- **Dock.** Typed fields — redo notes, rename, reply, a proposal's
  "that's all wrong" — open the palette scoped to that object rather than
  holding one of their own (S28). Every button stays.
- **Board header.** Loses the book entry; phases and map remain, and the
  book is a link out (§5).
- **Key table (S56).** ⌘K and `/` open the palette, `b` opens the book
  viewer rather than switching a view, and Esc gains "close the palette"
  at the head of its order.
- **Phone.** The Board tab's header offers phases and map only, and a
  capture control on both tabs raises the sheet (S38).

## 8. Surface rulings revisited

| S | what it says now | proposed |
|---|---|---|
| **S63** | "No typed grammar anywhere on the page (194)." | "One typed input on the page, the palette, with one grammar: plain text is a capture or a message the flywheel's own model reads into proposed calls; a leading `/` names a command of the catalogue; a bare number answers a decision (19, 193, 194, 216a). It is the chat's grammar, not a second one, and no other field on the page parses a word. The workbench's dictation grammar in the capture box is still rejected: the commands are the catalogue's names, never a language of the page's own." |
| **S30** | "The capture box sits at the head of Inception…" | "The palette is the page's capture surface. Plain text is sent unparsed to `capture` with one signal of kind ask, source the page (19, 194); an intent toggle beside the field makes the same submission also call `mark-intent` (12). Both are under `fw.capture.write`, so a viewer without it sees the field read-only with its send refused and the command list filtered (249). The preview line says what will be sent; Enter sends; the page acknowledges the recorded response (154)." |
| **S31** | "The capture box never interprets a word of its text…" | "The page parses no word of plain text: a leading `/` and a leading number choose a tool and nothing else, and neither reads the text for meaning. Text the operator asks the flywheel to read goes to the model in the page's browser as the interpreter (216a, S34), which proposes calls the operator confirms." |
| **S13** | "Inception shows: the capture box (S30); … Its head carries the 'explore…' control" | "Inception shows: the curation counter with curation's session chip; explorations as rows; every open or proposed intent as a thread with its elaborations as beads; a closed intent greyed with its countdown. Capture and explore are palette commands (S30, S43)." |
| **S43** | "1. Inception head: 'explore…' enters the explore mode…" | "1. `/elaborate` opens a multi-pick of open intents, or takes those already ticked on Inception; the footer counts them and offers with-operator or standing. 2. Start → `explore([intents], type)`. Steps 4 and 5 unchanged." |
| **S56** | "`/` · board · focus the capture box"; "b · board · switch phases and book" | "`⌘K` or `/` · anywhere · open the palette, `/` with the command list already showing; `b` · anywhere · open the book viewer at the object in hand. Esc closes the palette first." |
| **S57** | "There is no second axis anywhere on the page" | keep, with one sentence: "While the palette is open its list is the one axis and the rail does not move; closing it returns the rail's." |
| **S58** | modes table: "book · b, the board header, 'read in book' · the viewer with the rail driving it" | replace that row with one: "palette · ⌘K, `/`, the phone's capture control · the field with its preview line and recents, and on `/` the commands the caller may invoke, fuzzy-matched · Esc, send, choose". The book row leaves the table. |
| **S91** | "The book view is an mdBook-style viewer the page draws itself… entered with b… The rail stays beside it" | "The book is a standalone read-only viewer served beside the page, built from the blueprints' shared line as mdBook. The page links out to a chapter or a claim and never embeds one. `fw.ff.book-view` gates the viewer and the links to it (250, S197)." |
| **S93** | "The rail drives the viewer. A focused card jumps the book to the chapter…" | "A focused card's dock page carries 'read in book' per cited chapter or claim, which opens the viewer at that anchor. The rail drives no viewer; decision markers in the chapter margin move to the page's own surfaces." |
| **S94** | "'read in book' … switches to the book view at that anchor and closes the dock" | "'read in book' opens the viewer at that anchor in a place of its own; the dock stays as it was." |
| **S95** | "The library is an overlay over the board, opened from a control in the book header." | "The library is the viewer's own index of the flywheel's blueprints; `/book` reaches a book, a chapter or a claim directly." |
| **S96** | "The review flow is one flow for the map and the book (122)." | "The review mark is one mark for both (122): the map's overlay is on the page, the book's changed chapters and claims are shown in the viewer, and 'mark reviewed' sends `reviewed` once from either." |
| **S149** | open: "How the book viewer is served: chapters rendered by the server from mdBook sources, or mdBook's own build embedded." | Closed: a standalone read-only server rendering mdBook sources from the shared line, with the claim block read from the standing specifications (§5). |
| **S38** | the Board tab's "header switches to the map… and to the book" | "…switches to the map, rendered as the stacked list of S90. The book is a link out. A capture control on both tabs raises the palette as a bottom sheet." |

## 9. Requirements amendments proposed

- **19** — add: "The page's typed input is one palette in one grammar,
  the same grammar the chat carries: plain text is that capture, a
  leading `/` names a command of 193's catalogue, and a bare number is
  the reply grammar of 194. The page parses no text on its own side."
- **112** — amend the gestures: "Capture is one gesture from wherever the
  operator is: a forwarded message, one word on the phone, a file dropped
  in a folder, one key on the page opening its palette ready to capture."
- **193a (new)** — "The catalogue, filtered by the caller's permissions
  (293), is itself an operator surface: a client may render it as a list
  of commands that caller may invoke, one call each with its arguments
  named by object id, and offers no command the catalogue lacks."
- **311** — add: "An accelerator — the page's palette, a key, a short
  reply — never carries an operation that no control also carries."
- **315 (new, A.39 The book viewer)** — "The instance's book is served by
  a read-only viewer of its own, built from the blueprints' shared line:
  chapters as mdBook, each claim rendered where its chapter includes it
  by anchor from the standing specifications (97). The page links out to
  a chapter or a claim and embeds neither; every chapter and every
  rendered claim links back to the object at the host's address with the
  instance in the path (205a, 308). What is in flight is not in it."
- **316 (new)** — "The viewer's readers are the host's: on a self-managed
  host the private network is the boundary and the sign-in is 253's, with
  253a's exception; on a hosted tier it is served under the caller's token
  and reads to members of that instance alone (247, 249, 291). Serving a
  book to readers who are not members is one opt-in per book, stated on
  the settings form and revocable there, and a stated fact of the tier
  (261)."

## 10. Open questions

- Does plain text send on Enter, or does a proposed write need a second
  confirmation past its card (291, 194)?
- Does the intent toggle stay a control beside the field, or become
  `/intent` only?
- What does a viewer without `fw.capture.write` see — the field with its
  send refused, or no field at all (249, S30)?
- Does the console get this palette, or its own over the same catalogue
  (312, 193)?
- Is the palette behind a flag, on by default, and does the book viewer
  share it (250, S197)?
- Does voice through the mobile app land in this grammar (313)?
