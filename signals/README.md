# Signals

A **signal** is one piece of input worth keeping: something a person said or
asked, a reaction to something that was shown, or a finding an agent made
about something outside its own work. It is written once and never edited.
What changes over time is the move it is given.

Signals arrive in **captures**. A capture is one source event as it was
recorded: a meeting, a message, a document, or an agent's findings for a day.
It holds the signals read from that event. The same event captured twice is
still one capture.

## Layout

```
signals/
  README.md
  moves.rec                   # one move per signal, written only through crew
  2026-10-02-some-event/      # one folder per capture
    capture.md                # where the event came from
    01-a-short-slug.md        # one file per signal, numbered in reading order
    02-another-slug.md
```

A capture's raw material (a transcript, an export, a log) stays outside
version control. `capture.md` points at it.

## capture.md

```markdown
---
capture: 2026-10-02-some-event
source: crew                  # what recorded it: an adapter's name, or crew for an agent's finding
event_key: <id>               # optional: what makes the event one event, so it is captured once
event_date: 2026-10-02        # when the event happened, which is what a signal's age counts from
captured_by: madswan-design   # the adapter or agent that recorded it
imported: 2026-10-02
raw: <pointer>                # optional: where the raw material is, outside git
status: read                  # captured until its signals are read from it, then read
signals: 2
---

A paragraph on the event: who was there and what it was about.
```

## A signal

```markdown
---
signal: 2026-10-02-some-event/01-a-short-slug
kind: ask
who: <who asserted it>
subject: [tags, for, clustering]
claims: [<path or record it argues with>]   # optional
---

What the excerpt asserts, in a sentence or two.

> "the excerpt itself" — where in the raw material it is
```

`kind` is one of:

| kind | what it records |
|---|---|
| `constraint` | something true that the work has to fit |
| `ask` | a request for something to exist or change |
| `question` | something not yet decided that someone raised |
| `commitment` | a promise someone made to do something |
| `reaction` | a response to something that was shown |

`claims` names what the signal argues with, when it argues with something: a
book page, a decision record, a spec. Signals that share subjects and argue
with nothing are where new territory shows up.

## Moves

A signal has one standing move, or none yet. An unmoved signal is never a
decision and is never thrown away: it waits, counted and aging, for curation.
Each move is a record in `moves.rec`:

| move | written by | when | it names |
|---|---|---|---|
| `attach` | curation | it fits an open intent, as evidence there | the intent |
| `challenge` | curation | it argues with a standing claim, adding weight against it | the claim |
| `new-territory` | curation | nothing written covers it yet | |
| `answered` | curation | something decided since it was captured settles it | the record that settled it |
| `drop` | curation | it is noise or a duplicate | the reason |
| `route` | the planner | it becomes work, a unit queued in the plan | the unit |

Every move is written through crew: curation's with
`crew signal move <id> <move> --target <what it names> --reason "<why>"`,
and the route by the planner's `crew unit add <unit> ... --signal <id>`. crew
appends the record on main and pushes it, and applies it again to the new tip
when main has moved, so `moves.rec` is never merged, and it refuses a second
move for a signal that has one. Don't edit `moves.rec` by hand: two moves
appended in two checkouts merge into one broken record. The `merge=union` line
in `.gitattributes` is only a fallback for when that happens anyway.

An agent records a finding with `crew signal <slug> "<what it asserts>" --kind
<kind>`, which writes the signal under a capture of that agent's own for the
day.
