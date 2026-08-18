# Code review on the flywheel machinery — findings and verdicts

Source: a `plannotator review` pass over `origin/main..HEAD`, 2026-08-07.
Subject: `.claude/skills/flywheel-construction/SKILL.md` and
`openspec/schemas/flywheel-bolt/schema.yaml`.

**Read the diff base before reading the findings.** The review diffed against
`origin/main`, which is **190 commits back**. Lines it marks "(new)" are new
relative to the remote, not to the 8 commits of 2026-08-06/07. Most flagged
text came from `bolt-flywheel-machinery`. The Origin column below separates
them.

## Verdicts

| # | Finding | Verdict | Origin |
|---|---|---|---|
| 1 | Comments apply to the other skills too | Confirmed | — |
| 2 | ADR: nothing triggers one, no route for its sources | **Confirmed** | 2026-08-06 |
| 3 | "blueprints is a built repo" para is self-referential, harmful | Partly — judgement, not defect | pre-existing |
| 4 | Chore-route para is analysis; dispatch should route to bolts bypassing intents | Partly — route exists, triage does not | pre-existing |
| 5 | Prefer explicit `/opsx:ff`, `/opsx:continue`, `/opsx:archive` | Confirmed | pre-existing |
| 6 | "Spec agents sharing a bolt worktree do not commit" should come out; use nested worktrees with quick merge-backs | Confirmed as a change request — reopens a settled decision | pre-existing |
| 7 | Report rule reads like an after-action review | **Confirmed** | 2026-08-06 |
| 8 | Review-threshold section reads like a design doc | Confirmed | pre-existing |
| 9 | Spec-review-is-a-judgement section reads like design | **Confirmed** | 2026-08-06 |
| 10 | Lines 220–386 do not belong in the bolt skill | Partly — about two thirds do not | mixed |
| 11 | Schema: "one construction iteration" is wrong; a bolt bounds delivery to main and is extensible | **Confirmed — internal contradiction** | pre-existing |
| 12 | Schema lines 51–60 are unintelligible | **Confirmed** | 2026-08-06 |
| 13 | One file per proposal instead of one `proposals.md`? | Open design question | pre-existing |
| 14 | `to-spec` is invented; define messaging and allowed actions | Confirmed as local vocabulary | pre-existing |

## The four that need a decision from this intent

### 2. The ADR route has a hole, opened on 2026-08-06

`decisions/bolt-conductor-latitude.md` moved ADRs from the intent to the bolt
conductor. The implementation removed the ADR paragraph from
`flywheel-intent/schema.yaml`'s Handoff type and put the writing on the bolt
conductor as a named direct edit. **Nothing triggers it.** No signal crosses
from an intent to a bolt saying this work needs an ADR, and no route carries
the intent's sources for one. The bolt conductor would have to notice
unprompted.

Reviewer's proposal: ADR handoffs, parallel to proposal handoffs. That
reintroduces an intent-side artifact, which is what the decision retired — so
this is the decision's to reconcile, not the skill's.

The built-repo half of the comment needs nothing: the skill already says "into
the built repo's log4brains layout."

### 6. Spec agents and the shared index

The current rule exists because agents in one worktree share one git index. It
was settled deliberately, including the clause "the conductor lands each spec by
pathspec **and only once that agent is idle**."

The reviewer's alternative — each spec agent in its own nested worktree, quick
merge-backs to the bolt branch — removes the root cause instead of working
around it, and is better. But it reopens a settled decision rather than
correcting an error, so it needs a record.

### 11. "One construction iteration" contradicts "the bolt grows"

`flywheel-bolt/schema.yaml` opens with "A bolt is one construction iteration."
The same schema and `flywheel-construction` both say new work joins a live bolt
as new rows and that "the bolt grows; it never spawns a sibling for scope that
belongs to it."

Both readings are in settled voice and a reader has no way to tell which is
meant — the defect the one-answer rule names, in the file that carries the rule.
The reviewer's reframing resolves it: **a bolt bounds a delivery to main**
rather than counting an iteration.

### 14 / 13. The status ladder and the registry shape

`to-spec → specced → in-review → approved → building → built → verified →
merged` exists only in `flywheel-bolt/schema.yaml`. OpenSpec has no notion of
it. A schema defining its own states is ordinary; the real gap is that no
document says **what messages a conductor may receive and what actions it may
take** in response — the envelope question. Related: whether the registry should
be one file per proposal rather than one table, which would make a bolt easier
to extend on the fly (ties to 11).

## Two that are the writing, not the design

**7 and 9**, both from 2026-08-06, plus **8** and much of **10**, pre-existing.
The objection is register: these sections argue rather than instruct.

One tension to settle before any rewrite. Finding 7 asks for forceful prose with
the "why" removed. The *mechanism is not a justification* rule, added in the
same batch, requires an artifact to state the fact that makes a constraint
correct. Both cannot govern the same sentence. Which register these skills are
written in is an open question, and answering it after the dynamic-workflow
concept lands avoids rewriting twice.

**12** is not salvageable by editing. Schema lines 51–60 compress two rules into
abstract prose with no example, dropped into an instruction about writing
`bolt.md` sections where "every section here" has no clear referent. Rewrite or
delete.

## 10, split

Lines 220–386 of `flywheel-construction` are not uniform:

- **"The reads are instruments" and "State claims"** (~150 lines, pre-existing)
  are authoring guidance for spec agents. The skill says so itself: *"Spec
  agents write these claims, so this rule is theirs first."* The reviewer is
  right that they do not belong in the conductor's skill.
- **Routing, true strength, mechanism** (~40 lines, 2026-08-06) are conductor
  rules — its registry, its charges, its proposals. They are written at essay
  length, not misfiled.

About a third of a 496-line skill is rules for agents the conductor dispatches
rather than for the conductor. `flywheel-inception` (571 lines) has the same
problem; the five session-type skills (80–97 lines) do not.

## Where the rest already sits

Findings 4, 13 and 14 are already carried in
`scratchpad/flywheel-feedback.md` — sections A2 (messaging envelopes), B2 (the
five bolt-type schemas), and D3 (structural decisions). Findings 8, 9 and much
of 10 are superseded by the dynamic-workflow direction in that document's
section B.
