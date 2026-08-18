# Session: chapters-and-channels

## Charge
- Change: flywheel
- Directory: sessions/2026-08-06-chapters-and-channels/
- Tasks: the five decision-shaped Design tasks — which human-in-the-loop
  channel applies when (carrying the bridge-trigger and webhook research
  task as its evidence), the launch points for plannotator and lavish,
  what replaces the books' `proposals.md` chapter, how
  `system-design-inception.md` and `openspec-construction.md` fold into
  the loop chapters, and the small-change short circuit.

## Produced
- `decisions.html` — the working surface: all five decisions in one
  place, each with its options, a recommendation, where it ripples, and
  a control that queues the operator's answer. It grew three open
  sub-questions mid-session, from the operator's plannotator round on the
  schema's `sessions` instruction.
- Seven decision drafts, one per decision closed:
  `human-loop-channels-decision.md`, `bridged-singleton-decision.md`,
  `review-launch-points-decision.md`,
  `design-session-steering-decision.md`,
  `proposals-chapter-retires-decision.md`,
  `plugin-chapters-fold-decision.md`,
  `every-handoff-is-a-bolt-decision.md`.
- This README carries the session's report; there is no separate report
  file.

## Delivered

One operator round closed every decision in the batch. He worked the
surface with five form answers, three sub-question answers, and four free
annotations — taking the recommendation on four decisions, amending one,
widening one, and rejecting one outright.

| draft | what it settles | the operator's word |
|---|---|---|
| `human-loop-channels` | the shape of the answer picks the channel; the loop sets the default and the bar | took it, **amended** — it is a matrix, and the inner loop deliberately minimizes human review |
| `bridged-singleton` | one bridged pane, relaying inner-loop escalation, renamed; no webhook | took it, **extended** to bolt escalation and a rename |
| `review-launch-points` | the file's sole writer runs the review; the conductor triages annotations into work | took it |
| `design-session-steering` | a pointer in the schema, two profiles split by surface, coaching in the skill | took all three, and added session-type skills |
| `proposals-chapter-retires` | the chapter goes; handoff tasks and bolt registries are the build list | took it, **widened** — the construction plugins retire too |
| `plugin-chapters-fold` | the book describes the practice, the skill file describes the skill | took it |
| `every-handoff-is-a-bolt` | one exit from the phase gate; the one-proposal bolt is a special case | **rejected** the recommended short circuit |

Three came out different from what went in, and are worth reading before
the writebacks start.

**The channel boundary is two-dimensional, not one.** The surface proposed
that the shape of the answer decides the channel. The operator kept that
and added the axis it was missing: which loop is asking. Inner-loop actors
minimize the plannotator kind of human-in-the-loop on purpose — the
construction bar is adversarial agent review plus automated testing,
because that is what lets delivery be automated, and human code review is a
request an agent may make rather than a stage the pipeline runs. The outer
loop defaults the other way, to the desk channels, with triage the
exception that is Discord-first.

**The bridged singleton grew a second job and lost its name.** The
recommendation was one bridged pane at intake. He accepted it and extended
it: the same singleton relays escalations from the bolt agents, so
inner-loop questions reach him through it without a second bot. That makes
"intake" the wrong name for the actor — he suggested Triage and did not
settle on it, so the rename is a decision still to make. The webhook
receiver stays unbuilt, but for a shorter time than the recommendation
assumed: he wants the triage singleton hosted (AWS AgentCore named) so it
can triage meeting transcripts and user bug reports, and that is the
setting where a receiver gets re-asked.

**The short circuit is dead.** The surface argued a one-proposal handoff
should skip the bolt, on the grounds that a bolt exists to sequence more
than one proposal. He rejected it on grounds the surface did not weigh:
writing the proposal and building the code should stay two agents
regardless of size, an independent review and an archive should stay
available, and feedback travelling back to the triage singleton needs an
owner. A one-proposal bolt is a named special case of the one path.

### What stayed open

Five questions, all raised by the operator during the round rather than
carried in:

1. **The triage singleton's name.** "Triage" is his suggestion, not his
   word. It ripples through the profile, both skills, and E2E, so it wants
   settling before those are rewritten.
2. **The triage singleton in the cloud.** Hosted rather than on the
   workstation, ingesting real-time inputs it has no path for today —
   meeting transcripts, user bug reports.
3. **What becomes of `book-decompose`.** The chapter it mined is retiring
   and decomposition now starts from an intent's settled slice: "when we're
   making a bolt, we don't want to decompose everything in a book each
   time." Retarget or retire is unsettled.
4. **Where verification docking binds** — to an individual proposal or to
   the bolt as a whole, in his own words.
5. **Session types as schema types.** He named OpenSpec schema types with
   their own artifact instructions as the alternative to session-type
   skills, and explicitly did not choose.

### Proposed check-offs

Every Design task in the batch — all six:

- research: bridge triggering, and whether a webhook receiver earns its
  keep → `bridged-singleton`
- design session: which human-in-the-loop channel applies when →
  `human-loop-channels` · `bridged-singleton`
- design session: the launch points for plannotator and lavish →
  `review-launch-points` · `design-session-steering`
- design session: what replaces the books' `proposals.md` chapter →
  `proposals-chapter-retires`
- design session: how system-design-inception and openspec-construction
  fold into the loop chapters → `plugin-chapters-fold`
- design session: the small-change default → `every-handoff-is-a-bolt`

That leaves the two end-to-end runs as the only Design work outstanding,
and unblocks all three blocked Writeback tasks.

### Proposed appends

**Design** — the five open questions, one task each. The name and the
docking question are small enough to close in conversation; the cloud
triage agent, the `book-decompose` disposition, and
session-types-as-schema-types each want a session.

**Writeback** — the existing `conducting.md` and `authoring-capabilities.md`
rewrites absorb the channel matrix, the review-moment table, the triage
rule, and the actor rename rather than taking new lines. New work with no
home yet:

- the two design-session profiles, split by surface, plus the session-type
  skills that wrap plannotator and lavish (prototype and spike among them)
- presentation coaching into `flywheel-inception`'s session section, and
  `skill-creator` run over the flywheel skills so it ships with evals
- the schema edits: the `sessions` instruction gains the launch pointer;
  the `tasks` instruction gains that a review round may append a Design
  task, and keeps one Handoff motion with the one-proposal bolt named as a
  special case
- retire the `openspec-construction` plugin family as superseded by the
  flywheel plugin

**Fog** — the five open questions belong in `intent.md`, and the four Fog
questions this session answered come out of it.

### Next batch

The writebacks are unblocked and large: `conducting.md` and
`authoring-capabilities.md` now carry the channel matrix, the review
moments, the session steering, and the rename at once. Worth settling the
singleton's name first, since it appears in both chapters and in every
skill that names the actor.
