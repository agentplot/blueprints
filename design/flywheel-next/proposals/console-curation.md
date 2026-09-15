# A capture on the console

Drafted 2026-09-14. What happens to a sentence typed on the page, said
so a person new to the flywheel can predict it, and the order the
binary is built in to make it true on a real instance. This revisits
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

## 2. What the page shows, step by step

1. **Type, Enter.** The capture lands in Inception as a quote with its
   source, and under it one line saying who acts next and when:
   *curation reads it in about a minute* on an instance whose curation
   threshold is one, *curation reads it at 06:00* on a cadence, *with
   11 more* on a threshold of twelve. The counter in the hosts strip
   moves by one (118, S44).
2. **Or decide now.** The quote and its drawer carry two controls and
   no decision: **build now**, which is `propose-unit` (19, 34) and
   makes a chore unit approved on a bolt named from the words, in one
   step, as today; and **make an intent**, which opens an intent
   citing the signal in one step, the operator's gesture being the
   approval (the capture diagram's "mark as intent"; 20, 110). **drop**
   is the third, recording the move. These are the operator writing
   curation's records by hand (110); they are on the object, not on the
   rail.
3. **Otherwise curation runs**, as a `curator` session over every
   unmoved signal, and what it delivers is what appears on the rail:
   *proposed chore "…" · from the console · yes / drop* when it routed
   the signal to a chore it offered (116), or *proposed intent "…" · 1
   signal · from the console · open / drop / split* when it joined
   (109). One decision per proposal, never per signal. Approving is one
   press, and the rest of the loop is what runs today.
4. **An intent, once open**, proposes one elaboration at a time with its
   type named (*research · self-closing*) and only the answers that
   apply: yes, drop, type. The gathering answers appear only when the
   elaboration covers more than one intent (188). Approving starts a
   session in the intent's place through the same sessions binding a
   chore uses; it delivers a note into the book, the elaboration
   finishes, and the intent's close is offered (22).

The ambiguity the 2026-09-14 page had — a decision the operator could
answer, or curation might — is gone by construction: the operator has
controls on the note and decisions on the rail, and the note says
which of the two will happen next.

## 3. What is withdrawn

- **19a** and the `signal-unmoved` decision with its `build`, `intent`
  and `drop` answers; `build_from_signal` and `move_signal` as effects
  of a response. The two become catalogue tools the controls call.
- The proposed-then-approve step for an intent the operator made
  themselves: `make an intent` opens it (`open_intent`), because the
  operator's gesture is the approval. Curation's joins still propose,
  and the operator still approves those.
- Rulings S212 and S215's clause about a decision on every capture are
  restated: a capture is *acknowledged* the moment it lands, with the
  line saying who reads it next.

## 4. The build, in order

Each step leaves the live instance usable and is proven on it.

1. **The note and its controls** (surface, half a day). Revert the
   signal decision in `signal.yaml` and `atoms.yaml`; `propose-unit`
   stays; add `open-intent` (a dictation with a control) and
   `drop-signal`; the quote's status line reads the curation record's
   threshold and cadence and the unmoved count. The rail shows nothing
   for a lone capture; the since list shows *captured* once curation
   or a control moves it.
2. **Curation runs on this host** (domain and host, a day). The
   `curator` session's work order lists the unmoved signals, the
   standing claims and the open intents (model.md §9); its two
   deliverables, `move` and `intent-proposal`, get a schema and are
   parsed by `record_offers`; `applying` writes them. The session runs
   through the Herdr binding like a chore. The agentplot manifest sets
   `curation: {threshold: 1}` so a console capture is read within a
   minute; a volume instance keeps twelve or the cadence. Measured on
   the live instance: type → proposal on the rail, under two minutes.
3. **Intents run on this host** (domain and host, one to two days).
   `from-material` resolves to a type the proposal names, defaulting
   to `self-closing`; the elaboration card shows the type and the
   answers that apply; approval starts the session in the intent's
   place; the note is written back; the close is offered. Proven by
   one intent taken from a typed capture to closed on the live
   instance.
4. **Volume sources** (later). Transcripts and webhooks enter through
   the adapters and the endpoint as designed (215, 217g); triage is
   one `capture-reader` session per capture through the same binding
   (217e); curation batches them at the threshold. Nothing on the page
   changes: the same proposals, with their weight.

The cost of step 2's runner is one Claude Code pane per curation run.
The in-process bounded runner the dispatch model names (`inproc`) is
the cheaper seat for it and for triage, and is a separate step once a
model key is placed (217b, 217m).

## 5. Where the code goes, against the dispatch model

| job | design | in the binary |
|---|---|---|
| adapters | `flywheel capture <source>` on the declaring host's tick (215, 231) | `Cmd::Capture`, `host.yaml run_adapters`; the page's box is the capture tool (19) |
| capture endpoint | dispatch's, for callers that cannot write git (216, 217g) | not built; `flywheel dispatch` is `flywheel host` with `{kinds: [], presents: [chat]}` |
| triage | one `capture-reader` session per capture (217e) | the capture machine's `reading` region through the sessions binding; step 4 |
| curation | the `curator` session on the machinery role (110) | the curation machine exists; step 2 gives it a work order and deliverables |
| the operator's hand | controls that write curation's records (110, 193) | `propose-unit`, `open-intent`, `drop-signal` in the catalogue; step 1 |
| elaboration | the type machine's session in the intent's place | step 3 |
