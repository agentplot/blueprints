# Draft decision: a persona's unasked question is the loop working, not the intent failing

Closes `questions/persona-question-as-signal.md`.

## Decision (proposed)

A persona question the intent does not cover is **the intake channel
working, not evidence of a defect in the intent** — and no metric is
built on it. The routed question record is itself the feedback: it
arrives as an extend-intent envelope, becomes a `questions/<slug>.md`
record on the intent, and its **Raised-by line names the persona and the
bolt that surfaced it**. That naming is the one requirement this decision
adds. Nothing is counted, scored, or reported as a measure of intent
quality.

## Why

- An intent is not supposed to be complete up front. The design loop's
  whole job is burning open questions into decisions over the intent's
  life; a question arriving from a persona exercising the built thing is
  a question arriving by the channel built for it. Counting arrivals as
  a defect signal reads the loop's normal operation as failure.
- A quality metric implies a target — fewer routed questions per intent —
  and that target pressures intents to over-specify up front, which is
  the failure the incremental loop exists to avoid.
- The mechanism preserves the data anyway. Because every routed question
  is a record whose Raised-by names its source, any future consumer that
  wants the count can take it retroactively from the records
  (`grep -l "Raised-by:.*persona" questions/`). Deciding "no counter
  today" loses nothing; the records are the ledger.

## The alternative, and why not

Count persona-raised questions per intent and feed the number back as an
intent-quality signal. Rejected because it has no consumer today, it
builds bookkeeping ahead of need, and its incentive points the wrong way
(above). The re-open trigger: a real consumer appears — someone who
would change behaviour on the number. The records make the count
recoverable at that moment.

## Consequences

- `questions/persona-question-as-signal.md` flips to closed; the open
  bullet in `decisions/the-persona-loop.md`'s Consequences resolves with
  it.
- The Raised-by convention — a persona-routed question names the persona
  profile and the bolt — is the only practice change, and it lands in
  the question-record practice, not in any skill's machinery.
- No new machinery anywhere.
