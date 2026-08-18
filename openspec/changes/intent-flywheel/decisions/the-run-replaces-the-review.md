# Decision: past a point, running the thing beats reviewing it

## Decision
Spec review is bounded. When a bolt's re-reviews begin bouncing on defects
the fixes introduced rather than on anything the first round missed, the
review loop is churning, and every further round buys wording rather than
correctness. At that point each row takes one binary call on the evidence
already in hand — **approved**, or **re-spec from its decision record** —
and then builds. The re-spec starts from the decision, never from the
bounced spec plus its fixes, and is not itself reviewed.

Verification does not relax. The merge gate, the bolt's merge criteria, and
the acceptance evidence all still bind. What is bounded is *spec review* —
an agent reading a proposal against its sources — not the checks that run
against the tree that lands.

Findings that would have opened another review round go to the end-to-end
run's report instead. The run is the arbiter: an artifact that is
imperfect but runnable teaches more in one pass than a further round of
reading teaches in three.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/spec-driven-construction.md` and
  `conducting.md`
- Produced by: the operator's word, given directly: "NO MORE REVIEWS. The
  review loop is closed as of now … either it clears to approved on the
  review evidence already in hand, or it gets re-specced from its decision
  — your own churn rule, applied now rather than after a third bounce.
  Then merge the registry and get the design-loop end-to-end run moving;
  route every new finding to the run's report instead of another review
  cycle. The skills do not need to be perfect to run — the run is what
  tells you which imperfections matter."
- The state that triggered it: `bolt-flywheel-machinery` at seven rows, all
  specced, five re-specced in one round, five reviews bounced and three
  re-reviews bounced on defects the fixes had introduced. The bolt reported
  that pattern itself, and the churn rule was written then and applied now.

## Consequences
- `flywheel-construction` states the bound: a proposal gets one review
  round; a bounce is followed by a fix or a re-spec from the decision, and
  the result of either is built rather than re-read. It names the churn
  signal — re-reviews failing on defects the fixes introduced — as the
  trigger for calling it early.
- The `review` column in a bolt's registry keeps its meaning and gains a
  ceiling. A declared review that is not run is recorded as not run rather
  than left standing as if it had been.
- Findings routing changes while a run is pending: a design finding that
  would have opened a review round is routed to the end-to-end run's
  report. This is a redirection, not a suppression — the finding still
  lands somewhere it will be read, and it lands where evidence about it
  will exist.
- Amends `decisions/human-loop-channels.md` in scope, not in substance. Its
  construction bar — adversarial agent review plus automated testing — is
  what earns automated delivery, and the automated testing half is
  untouched. The agent-review half now has a stated stopping condition
  rather than running until someone tires of it.
- The cost, accepted: some rows will land carrying defects a further round
  would have caught. The wager is that the end-to-end run finds the ones
  that matter faster, and that the ones it does not find were not worth
  three rounds. Anything the run surfaces re-enters as ordinary findings.
- Rests on `decisions/every-handoff-is-a-bolt.md`, which set the bolt's
  actors, and on `decisions/the-gate-is-inline.md`, which established that
  a loop that stops to be sure is a loop that stops.
