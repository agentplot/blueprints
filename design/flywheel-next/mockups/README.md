# Plan surface mockups

Five self-contained HTML mockups of the operator's plan surface for
flywheel next. All are seeded from `../plan-mockup.md` (org willdan,
2026-09-04 07:40, decisions 412–421; the later two add 422 and 424) and read against
`../requirements.md`, especially A.2 (the plan), A.5 (planning and
construction), A.15 (signals and curation), A.17–A.19 (sessions charged
by the machinery, landing and pull requests, operation) and B.4 (the
status view). Published copies (private artifacts):

| file | metaphor | artifact |
|---|---|---|
| `queue-workstream.html` | one ordered queue, grouped by the counting rules (approve, decide, answer, attention), a focused card and keyboard answers; the "Q design" | https://claude.ai/code/artifact/d6b264df-8328-4993-a750-e15b6f32b956 |
| `triage-deck.html` | a card deck flicked one decision at a time, phone-first | https://claude.ai/code/artifact/5fc11424-791f-411c-9f0d-fe542deb4dcd |
| `river.html` | a time-ordered river: what happened since the last look flowing into what needs a response, with peek and drill | https://claude.ai/code/artifact/37eb46cf-a2d7-4888-8cc8-d7c2db285979 |
| `workbench.html` | desktop first: four AI-DLC lanes (Inception, Bolt plan, Construction, Operation) with the Bolt plan drawn as the transition, and a right-side dock that opens a card's full detail over the board without moving it; adds an invented planning proposal, decision 422 | https://claude.ai/code/artifact/90ae6088-44d7-42ae-bd1c-70618505b446 |
| `rail-and-board.html` | the direction: one rail titled "Decisions" (the plan delivery in the model's order, attention and SINCE below it) beside the status view drawn by phase; every decision is a marker on its object; hosts and repositories in a strip above the lanes; per-unit proposal edits are responses; carries the workbench's seed (412–424), session chips, machinery sessions, explore as a control, countdowns, redo → new number, lineage, and a repository dock for claims and scope | https://claude.ai/code/artifact/7f49fdcf-0b5e-4203-a938-44191d22943b |

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
  books repository; and how Operation stays clean (landed bolts stay in
  view while their request, environments or signals are live and for a
  bounded window after, then leave every view and stay in history).
- Rail-and-board is the direction; the workbench is retired but kept
  as the source of the seed and the session chips. Why: the count is
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

The models behind the surface are in `../models/statechart/` (`model.md`
first). The Rust prototype that serves a working version of this page
over seeded scenarios is at `/Users/chuck/Code/github_agentplot/flywheel-next/main`.
