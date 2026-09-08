# The command palette

Drafted 2026-09-08. Nothing here is ratified. It asks the operator to
revisit one standing ruling, **S63** ("no typed grammar anywhere on the
page"), and proposes what would stand in its place.

## 1. The premise

One input on the page — opened with ⌘K, or a bar always visible at
the header — over the same tool catalogue every other client already
speaks (193, 291, 293). A palette is not a second write path: it
enumerates the catalogue the page's controls call, resolves the
operator's typing to one entry with its arguments named by object id
(193), shows the call it is about to enqueue, and sends it on the
operator's confirmation. That confirmation is a control, so the
interpreter is not involved at all (194: "none at all when the operator
used a control"), the machinery parses nothing, and the write is a tool
call enqueued like any other (291). What it would replace in
rail-and-board: the capture box as a fixed region at Inception's head
(S30), the `/` key that focuses it (S56), and the typed fields that
today live only inside a dock footer (redo notes, rename, reply, pick).
What it must not replace: the rail's answer buttons and every dock
control, because every answer must stay one tap (311), nothing may be
reachable only by keyboard (311, 306), and the rail must keep showing
every decision whether or not anyone types (S3, 8).

## 2. Interaction ideas

### Answer by number

A decision number is unambiguous and is already the deterministic path
in chat (194, 15). Typing it in the palette is the same tool with the
same record (193, 153).

```
⌘K  412 yes  ↵        → will send: yes to 412
```

### Fuzzy-find any object, open it in the dock

Read-only navigation needs no confirmation, so find-and-open is the
palette's cheapest win and its safest one (S28, S61: the dock keeps the
board in place). Names resolve against live objects (194).

```
⌘K  retry backoff  ↵  → opens that intent in the dock
```

### Capture with a leading word

Capture must cost one gesture from wherever the operator is (112) and no
more than a sentence (112, 111). A leading `+` marks the rest as a
capture with one signal of kind ask (19), verbatim, with no word of it
read for meaning (S31, 19).

```
⌘K  + the nightly run keeps timing out  ↵   → will send: capture
⌘K  + …  ⇥ intent  ↵                        → will send: capture · intent
```

The intent toggle stays a control, never a word parsed out of the text
(19, S30).

### Slash commands, one grammar with chat

The chat's structured path is already `/fw yes 412`, `/fw capture <text>`
(plans.md, Hobby), and the numbered reply grammar is itself the answer
tool (194, S32). Accepting the same strings in the palette means one
grammar to learn and one to document.

```
⌘K  /fw 413 redo: split the migration out  ↵
```

### Scoped mode

When a decision is focused on the rail or open in the dock, the palette
opens already scoped to it and offers only that card's own answers
(S5, S6). A key a card does not offer is refused with its answers listed
(S57), and the palette should refuse the same way rather than reaching
past the card.

```
j j  ⌘K  (scoped: 415)  pick  c  ↵   → will send: pick c on 415
```

### Free text to the browser interpreter

Text that is neither a number, a command nor a capture is handed to the
model running in the page's browser, which proposes exactly one tool call
per thing asked, each shown as what will be sent and confirmed on its own
(216a, 194). Where no interpreter runs — the rail has no key of its own,
or the flywheel runs without one — the palette says what it does
accept and offers the nearest shapes, rather than guessing (194: a name
that resolves to nothing is asked about, never guessed).

```
⌘K  drop the second unit and rename the bolt  ↵
      → two cards, each confirmed on its own
```

### Recent and frequent

An empty palette lists what the operator did last and what the page
offers now. Recency is a rendering of the sent log the header already
carries (S2), not stored client state (310).

### The preview line

Under the input, one line naming the call: "will send: yes to 412",
mirroring the capture box's existing "will send: capture" (S30). A write
is a tool call enqueued (291), so the preview is the last point at which
the operator can see and stop it.

### The acknowledgement

After sending, the palette shows the response recorded with who gave it
and when (153, 154), the card leaves the rail and focus moves on (S6),
and a reload shows the same thing because nothing about it lives in the
client (310). A response that could not apply is reported and gets its
attention line with its one-word ok (6, S8, S74).

### The phone form

A bottom sheet with the platform's own keyboard (311). It is an
accelerator on the phone and never the answer path: every decision stays
answerable by tap on the Decisions tab (306, 307, S38), and a long-form
answer is typed with the platform keyboard as 311 already says.

### Parity both ways

Everything the palette can send is reachable by tap (311), and everything
a control sends is reachable in the palette. That symmetry is the test:
no keyboard-only operation (306, 311), no control the catalogue lacks
(193).

### The console shares it

The management console renders on a phone and its journeys complete
there (312). It calls the same catalogue (193), so the same palette
belongs in it, scoped to hosts, members, sinks and packages, with every
configuration change staying one logged response (153, S205).

## 3. What the palette is not

- **Not a second interpreter.** The page has one, the model in its
  browser (216a); the palette either resolves deterministically or hands
  the text to that one.
- **Not client state.** No draft that a reload loses, no queue of staged
  calls; every edit is its own response, sent when given (310, S64).
- **Not a superset of the catalogue.** If a tool does not exist, the
  palette does not offer it — in particular nothing that asserts work was
  done (4), which is not in the catalogue at all.
- **Not a way to hide a decision.** The rail stays the one list in the
  model's order (S3, S59), and the palette never becomes the place where
  something is pending that the rail does not show (8, 11).
- **Not a second axis.** The one-axis rule holds: j and k walk the rail
  and the palette does not add a second thing to walk (S57).

## 4. Three directions

### A. Palette-only input

Every typed thing on the page goes through the palette. The capture box
leaves Inception's head, the dock's typed fields (redo notes, rename,
reply) open the palette pre-scoped, and buttons remain for every answer.

- **For:** one input to learn, one preview line, one place where a write
  is confirmed; Inception's head gets its space back for the curation
  counter and the threads (S13).
- **Against:** capture stops being visible furniture, which is what makes
  it feel like one gesture (112); a viewer with no capture permission
  currently just has no box (S30, 249), and a palette must degrade the
  same way per entry rather than per region.
- **Changes in rail-and-board:** S30 and S31 rewritten as palette
  statements; `/` in the key table (S56) rebound to the palette; the
  Inception head redrawn.

### B. Palette beside the controls

The palette is an accelerator over the same catalogue. The capture box,
the rail's buttons and every dock control stay exactly as specified; the
palette reaches all of them, and reaches objects the current view does
not show.

- **For:** nothing in the current specification is invalidated; 306 and
  311 are satisfied by the controls that already satisfy them; the
  palette can ship behind a flag and be judged on use (250, S197).
- **Against:** two paths to every operation, so two places to keep in
  step; S63 still has to be amended, because the palette does carry a
  typed grammar; the redundancy is real and someone pays for it in the
  specification.
- **Changes in rail-and-board:** S63 narrowed to "the capture box never
  interprets" (which is S31 already); one new section for the palette;
  ⌘K added to S56.

### C. Palette as the dock's header

The palette lives in the dock, scoped to the object in hand, and is the
typed form of that object's own controls. The board and rail keep buttons
only; there is no global input.

- **For:** scope is always obvious, so name resolution is nearly free and
  the wrong-object mistake is hard to make; it fits the dock's job as the
  place to answer (S36).
- **Against:** it cannot capture from wherever the operator is (112),
  cannot find an object not yet open, and gives up most of what a palette
  is for; it is closer to a command line per card than to ⌘K.
- **Changes in rail-and-board:** S28's dock pages each gain a header
  input; the capture box stays; S63 amended only for the dock.

## 5. Open questions

- Is S63 revisited at all, or is a typed grammar on the page still a no?
- Which direction: the palette as the only input, beside the controls, or
  inside the dock?
- Does the palette send on ↵ from the preview, or does it need a second
  confirmation for a write (291, 194)?
- Does `+` for capture read as a command grammar, and so reintroduce what
  S31 forbids — or does the leading word only choose the tool, never the
  text's meaning?
- Is an unsent palette draft state a reload may lose (310), and if so does
  the palette clear on reload or refuse to hold a draft at all?
- Does the palette accept `yes all`, which today is one control sending
  one response per decision in number order (S7)?
- On the phone, is the palette present at all, or desktop-only given that
  every answer is already one tap there (311, 306)?
- Does the palette respect the rail's mine · all filter, or reach every
  decision regardless (S171, 235)?
- What does the palette show a viewer whose token lacks `fw.rail.answer`
  or `fw.capture.write` (249) — a refused entry, or no entry?
- Does the console's palette share the page's, or is it a second
  instance over the same catalogue (312, 193)?
- Is the palette behind its own flag, and on by default (250, S197)?
- Does voice through the mobile app land in the same grammar (313)?
