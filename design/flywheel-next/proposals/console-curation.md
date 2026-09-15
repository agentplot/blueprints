# A capture on the console

Drafted and adopted 2026-09-14; the requirements (19a, 21, 27, 110, 114,
118, 193, 215), the rulings S224–S227 and the signal, curation, intent
and capture machines carry it. What happens to a sentence typed on the page, said
so a person new to the flywheel can predict it; how the signals that
pile up are seen and curated; and the order the binary is built in to
make it true on a real instance with real signals. This revisits
**19a** and the `signal-unmoved` decision of `signal.yaml`, both written
on 2026-09-14, and withdraws them.

## 1. The rule, in three sentences a newcomer is told

What you type is a note. The flywheel reads your notes and proposes
work; you say yes or no on the rail. If you already know what a note
should become, say so on the note itself, and the flywheel skips the
reading.

Nothing on the rail is homework. The rail carries what the machinery
proposes and what a session asks; it never asks you to classify what
you wrote (vocabulary: a signal "is never work and never a rail
decision on its own"; 109).

## 2. Words, so the shape is not mistaken

- An **intent** is large and long-lived: *add the dispatch agent to the
  flywheel* is one intent, open for weeks. It is a line off the
  blueprints with a chapter and claims on it.
- An **elaboration** is one piece of design work on it: one session,
  one conversation, one place (24). An intent has many over its life,
  and several may be approved and running at once. What 21 bounds is
  the *proposal queue*: at most one elaboration is *awaiting approval*
  at a time, and new material joins that proposal rather than opening
  a second one. So the intent's card never asks two things at once,
  and the operator never approves the same material twice.
- A **signal** is a note read from a capture. Its one move says where
  it went: onto an existing intent (attach), into a new proposed intent
  (join), against a claim (challenge), to a chore or ask (route),
  answered, or dropped (116).

A note about the dispatch agent typed while that intent is open is,
by design, an **attach**: it lands as evidence on the intent, and the
intent's material region proposes the next elaboration from it (signal
machine, `attached`). That is how a second note reaches an existing
intent; nothing is a second intent unless curation or the operator
joins it as one.

## 3. What the page shows, step by step

1. **Type, Enter.** The capture lands in Inception as a quote with its
   source, and under it one line saying who acts next and when:
   *curation reads it next*, with the count and the trigger from the
   manifest (*4 waiting · runs at 12, or when you run it*). The
   unmoved count in the hosts strip moves by one (118, S44).
2. **Or decide now.** The quote and its drawer carry controls, not a
   decision: **build now** (`propose-unit`, one step, as today),
   **make an intent** (opens it in one step; the operator's gesture is
   the approval), **attach to …** (an open intent picked from a list;
   the signal's move is attach and the intent proposes from it), and
   **drop**. These are the operator writing curation's records by hand
   (110); they are on the object, never on the rail.
3. **The signals tray.** The hosts strip's unmoved count is a control.
   It opens a surface listing every unmoved signal by source and age,
   grouped by capture: the note you typed, the seventeen from
   Monday's transcript, the two from the folder drop. Each row carries
   the same controls as the note. At its head: **run curation now**,
   with the trigger stated beside it (*runs on its own at 12, or
   weekdays at 06:00*). Pressing it charges the curator session at
   once; the tray shows the session working with a progress bar, the
   way a mail client shows the fetch, and the count falls as moves are
   written. What the session proposes lands on the rail.
4. **The rail carries proposals.** *proposed intent "…" · 3 signals · 2
   sources · since Monday · open / drop / split* (109), or *proposed
   chore "…" · yes / drop* (116). One decision per proposal, never per
   signal. Approving is one press; the rest of the loop is what runs
   today.
5. **An open intent** shows its signals and its elaborations as beads.
   Its card proposes one elaboration at a time, with its type named
   (*research · self-closing*) and only the answers that apply: yes,
   drop, type; the gathering answers appear only when the elaboration
   covers more than one intent (188). Approving starts a session in
   the intent's place through the sessions binding a chore uses; it
   delivers into the book; the bead is done; when every elaboration is
   done the close is offered (22).

The ambiguity the 2026-09-14 page had — a decision the operator could
answer, or curation might — is gone by construction: controls on the
note, decisions on the rail, and the tray says what happens next and
lets the operator make it happen now.

## 4. What is withdrawn

- **19a** and the `signal-unmoved` decision with its `build`, `intent`
  and `drop` answers; `build_from_signal` and `move_signal` as effects
  of a response. The controls of §3.2 call catalogue tools instead.
- The proposed-then-approve step for an intent the operator made
  themselves: `make an intent` opens it (`open_intent`). Curation's
  joins still propose, and the operator still approves those.
- S212 and S215's clause about a decision on every capture: a capture
  is *acknowledged* the moment it lands, with the line saying who
  reads it next.

Added to the model: the curation machine's `idle` state takes
`{response: run}` to `running`, so the tray's control and the chat's
`/curate` are one dictation (4, 193).

## 5. Real signals, and a second source

The willdan blueprints hold fourteen captures and about two hundred
signals read from meeting transcripts by a daily sweep
(`willdan-blueprints/main/signals/`: one directory per capture with a
`capture.md` and one markdown file per signal, kinds constraint, ask,
question, commitment, reaction; the raw transcripts outside git; a
`moves.rec` with no moves yet). Forty-two of the signals mention the
flywheel. They are exactly what 114 means by "captures made before the
instance existed are read without conversion".

- **A signals-folder adapter** (`flywheel capture signals <dir>`) reads
  that layout as captures whose signals are already present, so no
  triage is charged; the source is the capture's own (`wispr-flow`),
  the event date the meeting's. Run once against a copy of the willdan
  directory, it fills the tray with real material from real meetings.
- **A folder-drop adapter** (`flywheel capture folder <dir>`) is the
  second source, and the one that shows triage: a transcript dropped in
  the folder becomes a capture with a pointer and no signals, and a
  `capture-reader` session reads it. For the demo the folder holds one
  of the willdan raw transcripts, so the reader has something true to
  read.
- **The fake source** is a scripted webhook: a small script posts three
  synthetic monitor findings to the capture tool with source `datadog`,
  so the tray shows three sources and curation has something to drop.

The demo that proves the round: import the willdan signals, drop one
transcript, post the three findings, type one note on the console, open
the tray, run curation, watch the proposals land, open the one about
the flywheel as an intent, approve its first elaboration, and read what
the session wrote.

## 6. The build, in order

Each step leaves the live instance usable and is proven on it.

1. **The note and its controls** (surface and model, half a day).
   Revert the signal decision in `signal.yaml` and `atoms.yaml`; add
   `open-intent`, `attach-signal` and `drop-signal` beside
   `propose-unit`; the quote's status line reads the curation record's
   threshold, cadence and unmoved count. The rail shows nothing for a
   lone capture; the since list says *captured*.
2. **The signals tray and run-now** (surface and model, half a day).
   The unmoved count opens the tray; rows by source and age with the
   controls; `run curation now` as a dictation the curation machine
   takes; the curation object's row shows the session working.
3. **The signals-folder adapter and the willdan import** (adapters, half
   a day). The tray fills with real signals; nothing else changes.
4. **Curation runs on this host** (domain and host, a day). The
   `curator` session's work order lists the unmoved signals, the
   standing claims and the open intents (model.md §9); its deliverables
   `move` and `intent-proposal` get a schema and are parsed by
   `record_offers`; `applying` writes them. The session runs through
   the Herdr binding like a chore. Measured on the live instance: run
   now → proposals on the rail, under three minutes over the willdan
   set.
5. **Intents run on this host** (domain and host, one to two days).
   The proposal names the elaboration's type, defaulting to
   `self-closing`; the card shows the type and the answers that apply;
   approval starts the session in the intent's place; the note is
   written back; the close is offered. Proven by the flywheel intent
   from the willdan signals taken to its first delivered elaboration.
6. **Triage and the second source** (adapters and host, a day). The
   folder-drop adapter, the `capture-reader` session through the same
   binding, the scripted webhook against the capture tool. The
   endpoint proper stays dispatch's and unbuilt.

The curator and reader run in Claude Code panes through the Herdr
binding, which costs a pane per run. The in-process bounded runner the
dispatch model names (`inproc`) is the cheaper seat for both and is a
later step once a model key is placed (217b, 217m).

## 7. Where the code goes, against the dispatch model

| job | design | in the binary |
|---|---|---|
| adapters | `flywheel capture <source>` on the declaring host's tick (215, 231) | `Cmd::Capture` and `host.yaml run_adapters`; `signals` and `folder` sources added; the page's box is the capture tool (19) |
| capture endpoint | dispatch's, for callers that cannot write git (216, 217g) | not built; the demo's webhook posts to the capture tool on the page's host |
| triage | one `capture-reader` session per capture (217e) | the capture machine's `reading` region through the sessions binding; step 6 |
| curation | the `curator` session on the machinery role (110); run by threshold, cadence or the operator's dictation | the curation machine exists; steps 2 and 4 give it the dictation, a work order and deliverables |
| the operator's hand | controls that write curation's records (110, 193) | `propose-unit`, `open-intent`, `attach-signal`, `drop-signal` in the catalogue; step 1 |
| the tray | the status view's unmoved signals by source and age (118) | `page/tray.rs` over the same status view; step 2 |
| elaboration | the type machine's session in the intent's place | step 5 |
