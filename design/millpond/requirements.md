# millpond — requirements
<!-- ANCHOR: preamble -->

A statement of what millpond must always do and never do, written to
admit any model that satisfies it.

The statement is in three parts. Part A is what must hold of millpond
on its own: how an inbox takes each event once as a capture, keeps the
event's raw material, runs the programs that list sources, holds the
signals read from captures and the moves curation gives them, and sends
the items curation makes. Part B is its contracts: the operations it
needs across its ten seams, a part, the inbox store, the raw bank, the
per-host state, a place, a starter, the merge queue's record, an
inquiry, a planner and the claims, and the guarantee each must give.
Part C is the profiles: the ways each contract is satisfied.

Parts A and B name no mechanism: no command, file, directory, format,
field, service or tool. One thing of the world they name freely,
because section 9 fixes it: the repositories items are sent to are git
repositories, and work in them is done on branches. Where an inbox
itself is kept is not fixed, and is a seam. Every real tool is named
only in section 9 and in Part C. A reader who has never seen an inbox
for a repository's events should be able to design from Parts A and B
alone.

The capture contract, and the forms of the records an inbox holds, are
those of Flywheel's statement, an external standard section 9 names.
Part C gives everything of it millpond needs.

## 1. Purpose

millpond is the inbox for events outside a repository that should
change its work: a release of something the repository depends on, a
decision in a meeting, a deploy that failed. A program that knows one
source lists its events and offers each to millpond. millpond records
each event once, as a capture, and keeps the source's material beside
it on the host that took it. A capture that quotes itself becomes one signal
at once. Any other waits for a reader, a model session that writes its
signals through millpond, and millpond takes only the words that stand
in the capture's material. Curation, another session, gives each signal
one move, in batches the operator accepts, and joins signals into items.
millpond sends an item to a place of its own in a repository, sends
items that ask a question to an inquiry, or hands items to a planner,
and records what became of each. millpond never judges what a capture
says, never plans across items, and never lands work.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **a part** (a program that knows one source) | how to list its source, how to key each event, what raw material to write, and whether a capture is its own excerpt | write a record, keep a list of what it offered, cut an excerpt, or read a capture into signals |
| **a caller** (a deploy, a script, a person, an inquiry handing in a finding) | what to hand in at the intake, and when | keep a cursor or a part's status, or have an offer taken that a run's offer would have had refused |
| **a reader** (a session) | which signals a capture holds, and what each asserts | list a source, change a capture, write a move, or write a signal whose excerpt does not stand in its capture's raw material |
| **curation** (a session) | which move it proposes for each signal, which signals join into which items, and each item's brief | write a capture or a signal, judge a moved signal again, or send an item the operator has not chosen |
| **the operator** | each batch of moves, accepted or changed, or each item instead where the inbox's setup says so; replacing a move; sending an item; accepting, sending back or dropping each conclusion | |
| **the keeper** (the operator, or a fleet on the operator's behalf) | an inbox's settings: its parts, each part's host, schedule and configuration, the limit, how a reader starts, and where items go | run a part's own logic in place of the part |
| **a planner** | how items are ordered across teams, and what work each becomes | write an inbox's records except through the tool that keeps it |
| **a worker** (an agent or a person in a place) | how to do an item's work, and when its work goes to the merge queue | record its own landing |
| **an inquiry** | its conclusion, and the findings beyond its inputs it hands in | write an inbox except as a caller at the intake |
| **millpond** | which offers it takes and how it keeps what it took, as this statement fixes them | judge what a capture says, plan across items, land work, list a source, or change an inbox's settings |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **inbox**: the records one body of work keeps of the events that
  should change it, with its settings.
- **record**: a capture, a signal, a move or an item, with an item's
  brief, sends, landing and conclusion.
- **settings**: of an inbox, its parts, each with its host, schedule and
  configuration; its limit; how a reader starts; and where its items
  go.
- **keeper**: whoever decides an inbox's settings.
- **host**: a machine that keeps an inbox or runs its parts.
- **setup**: which tool keeps an inbox, and which session curates it.
- **source**: where events happen, by name: releases, meetings, a
  folder, deploys.
- **event**: one thing that happened at a source, at one time.
- **event time**: when an event happened at its source.
- **part**: a program that lists one source's events and offers a
  capture of each, with a declaration of the shape of its configuration
  and the secrets it needs.
- **run**: one start of one part by millpond, until the part exits.
- **raw place**: the empty place a run or a caller gives a part to
  write raw material in.
- **offer**: what is handed to millpond for one event: its key, its
  source and its event time, and, where given, a title, a link, the raw
  material it names and an own excerpt.
- **key**: the identity of one event, the same from every host and
  every run.
- **cursor**: a mark a part offers of how far its listing reached,
  meaningful only to the part.
- **completion**: the mark a part ends a complete run with: how many
  events it listed, and each item that failed, with why.
- **intake**: the way any caller hands offers in, outside a run.
- **capture**: one event as an inbox records it.
- **raw material**: an event as its source served it, whole.
- **raw bank**: what one host keeps of the raw material of the captures
  it took.
- **pointer**: a capture's reference to its raw material, naming the
  host whose raw bank holds it.
- **per-host state**: the cursor and status one host keeps for each
  part of an inbox it runs.
- **status**: what a part's last run on a host did.
- **schedule**: the times a part is due to run.
- **due**: of a part, that a time its schedule names has come since its
  last run, or that it has never run.
- **tick**: one pass over an inbox's parts on one host.
- **signal**: one assertion read from a capture.
- **kind**: one of a fixed set: constraint, ask, question, commitment,
  reaction.
- **excerpt**: words of a capture's raw material, as they stand there,
  with where they stand.
- **own excerpt**: the excerpt an offer carries when the capture says
  one thing and that thing is its signal, as a release's notes are.
- **own signal**: the one signal of a capture whose offer carried an own
  excerpt.
- **limit**: the most bytes an excerpt may hold in an inbox's records.
- **cut**: an own excerpt shortened at a line to keep within the limit.
- **unread**: of a capture, that it has no own signal and no reading.
- **reading**: the signals a reader writes for one capture, which may
  be none.
- **session**: a model at work on one bounded job, outside millpond.
- **reader**: a session that turns unread captures into readings.
- **curation**: a session that gives signals moves, joins them into
  items and writes briefs.
- **move**: curation's standing judgment on one signal.
- **batch**: the moves curation writes together.
- **claim**: a statement of what is true at the destination, kept
  beside an inbox by another tool.
- **chore**: a small piece of work a route offers.
- **ask**: something only the operator can give, which a route offers.
- **item**: a unit of work, made of the signals curation joined into
  it, or of a piece of work an accepted conclusion proposed;
  **proposed** until it is first sent, **sent** after.
- **weight**: of an item, how many signals it holds, from which
  sources, over what span of event times.
- **brief**: what whoever does an item's work needs, written for the
  item.
- **send**: one handing of items to one target: one item to a place or
  a planner, one or more to an inquiry.
- **place**: a working copy of one repository on a branch of its own.
- **worker**: an agent or a person doing an item's work in a place.
- **starter**: whatever starts work: a worker on a send, or a reader on
  unread captures.
- **merge queue**: what tests a branch's work as merged, lands it, and
  keeps a record of each branch.
- **landing**: a branch's work reaching the branch it was submitted to,
  as the merge queue records it.
- **inquiry**: work on a closed set of inputs, in rounds of one session
  each in a place of its own, ending on a conclusion.
- **conclusion**: an inquiry's answer, with its evidence, what it would
  change, the work it proposes and what stays open, which the operator
  accepts, sends back for another round, or drops.
- **planner**: whatever orders items across teams and turns each into
  work.
- **import**: a carrying-in of captures read before their inbox
  existed, with their signals and moves.
- **surface**: one way a person, a session or a program reaches
  millpond.
- **profile**: one way a contract of Part B is satisfied, as Part C
  describes.

<!-- ANCHOR_END: glossary -->
<!-- ANCHOR: part-a -->
## Part A. What millpond decides

### A.1 Inboxes and their settings

1. Every host that keeps an inbox reads the same records and the same
   settings.
2. An inbox's settings are its keeper's. millpond never changes them.
3. Each part of an inbox names exactly one host, and runs only there,
   whether a tick starts it or someone asks for it.
4. Writes to one inbox never interleave, whoever makes them. Two at
   once leave the inbox as one after the other would have, no write is
   half applied, and no write's records are lost.
5. An inbox's records have one form whichever host, setup or tool wrote
   them, so any tool that keeps the inbox reads every record another
   wrote.
6. An inbox outlives the tool that keeps it. Another setup takes it
   over with no record rewritten and no event captured again.

### A.2 Offers and captures

7. millpond takes an offer only when it carries a key, a source and an
   event time, when its key can name nothing in the inbox but its own
   capture, and when any own excerpt it carries holds every field a
   signal carries (34). Every other offer is refused.
8. A refused offer is named, with the reason, in what millpond reports
   of its run or intake, and never stops another offer from being
   taken.
9. An inbox holds at most one capture per key, whatever writes at once.
   An offer whose key the inbox holds writes nothing, banks nothing,
   and is counted as held.
10. A key is held against every capture of the inbox, taken or
    imported, whichever source, part or caller offered it.
11. A capture never changes once written. A later offer under its key
    changes nothing, whatever that offer carries.
12. A capture's source, event time, title and link are as its offer
    gives them. millpond never puts the time it took the capture in
    place of its event time.
13. Every capture records the part that offered it, or that it came
    through the intake, the host that took it, and when.

### A.3 Raw material

14. Raw material never enters an inbox's records. A capture holds a
    pointer to its raw material, and the pointer names the host that
    holds it.
15. No capture is written before the raw material its offer names is
    banked on the host that took it. An offer that names raw material
    millpond cannot read, or anything outside the raw place its run or
    caller gave it, is refused.
16. Raw material is banked whole and unchanged, as the source served
    it, and only what a taken capture names is banked. Nothing else a
    part wrote in its raw place outlives the run.

### A.4 Own excerpts and the cut

17. A capture whose offer carries an own excerpt has exactly one
    signal, its own signal, written in the same write as the capture,
    and is never unread. Every other capture is unread when written.
18. An own signal's excerpt is the offered text, unchanged, from its
    start to the end of the last line that keeps the excerpt within the
    inbox's limit, then one line millpond adds saying how many lines
    and bytes the cut left out. A text within the limit is kept whole,
    with no line added. Every other field of an own signal is as
    offered.
19. Whenever millpond cuts an excerpt, it banks the whole text with the
    capture's raw material, so nothing the cut left out is lost.

### A.5 Runs, the intake and schedules

20. A run hands its part the part's configuration from the inbox's
    settings, the secrets the part's declaration names and no others,
    an empty raw place of its own, and the cursor the part's last
    complete run kept, or none.
21. A part runs only with a configuration that fits the shape its
    declaration gives. A part whose configuration does not fit is not
    run, and its status says why.
22. A part never runs twice at once.
23. A run is complete only when its part ends it with a completion and
    reports success. Only a complete run moves its part's cursor, to
    the last cursor the run offered.
24. A run that is not complete keeps every capture it took, leaves its
    part's cursor where it was, and is recorded as failed.
25. millpond never reads meaning into a cursor. It hands a cursor back
    as the part offered it, and a part given none lists again, the key
    absorbing every repeat (9).
26. Every run leaves its part's status on its host: when it ran,
    whether it was complete, what it took, held and refused, each item
    the part named as failed, and the last of what the part reported
    when it failed.
27. Offers handed in at the intake are taken as a run's offers are (7
    to 19). The intake keeps no cursor and no part's status, and tells
    its caller what it took, held and refused.
28. A tick runs every part of its inbox that is due and names the
    tick's host, and no other part.
29. A part that missed several of its scheduled times while its host
    was down runs once at the next tick.
30. Nothing a part is handed tells it which tool started it.

### A.6 Reading

31. A capture is read at most once. A reading, of any number of signals
    including none, leaves its capture read, and a second reading of
    that capture is refused.
32. A reading is taken only when every excerpt it holds stands,
    unchanged, in its capture's raw material. Any other reading is
    refused whole, naming each excerpt that does not stand there, and
    its capture stays unread.
33. A tick starts a reader only as the inbox's settings say one starts,
    and no reader is charged with a capture whose raw material cannot
    be reached where the reader runs.
34. Every signal carries its capture, a kind, who asserted it, its
    subjects, its assertion, its excerpt with where it stands, and what
    it argues with when it argues with anything. A signal never changes
    once written.

### A.7 Moves

35. Every signal has at most one standing move. Curation proposes moves
    only for unmoved signals and never judges a moved signal again.
    Only the operator replaces a move.
36. A move is one of drop, answered, challenge, join, attach and route,
    and carries its consequence: a drop its reason; an answered the
    claim or record that settled the signal, an accepted conclusion
    among them; a challenge the claim it weighs against; a join the
    item it makes or grows; an attach the sent item it adds to; a route
    the chore or the ask it offers. Any other move is refused.
37. A join makes a new item or grows a proposed one, never a sent one.
    An attach adds to a sent item, never to a proposed one.
38. A route that offers a chore makes an item of its one signal. A
    route that offers an ask records the ask and makes no item.
39. A challenge is taken only in an inbox with claims beside it, and
    only against a claim standing there.
40. A batch of moves is written whole in one write, or refused whole,
    naming each move that could not be taken.
41. An unmoved signal is never discarded, however old.
42. A signal's age is its capture's event time. Every listing, count
    and weight by age reads the event time, never when the capture was
    taken or imported.
43. No surface asks the operator to decide signal by signal. The
    operator decides a batch of moves, or an item.

### A.8 Items and briefs

44. An item's signals are exactly those whose standing move names it.
    An item made from an accepted conclusion's proposed work names that
    conclusion.
45. Every item shows its weight.
46. Every item has a name no other item of its inbox has ever had.
47. An item's brief is written by curation or the operator, never by
    millpond.
48. An item is sent only with a brief. Each send keeps the brief it
    handed over as it was handed, whatever the item's brief becomes
    later.
49. An item lists every send made of it, and what became of each.

### A.9 Sends

50. An inbox's settings say where its items go: to sends millpond
    makes, or to a planner. An inbox whose items go to a planner hands
    each item to the planner, records the handing as the item's send,
    and sends no item to a place or an inquiry.
51. A send names exactly one target (a place in a named repository, an
    inquiry, or the planner) and who asked for it. A send to a place or
    the planner names exactly one item, and a send to an inquiry names
    one or more.
52. A send to a place makes a new place of the named repository, on a
    new branch named for the item, holding the item's brief. A place
    never holds two items' work, and a send never takes a branch that
    exists.
53. A send to a place is recorded only once its place holds the brief,
    and no work starts for a send that is not recorded. A start that
    fails is recorded against its send and never undoes it.
54. millpond never does an item's work itself. Whatever starts the work
    changes nothing millpond records of the send but whether the work
    started.
55. An item shows a landing only when the merge queue's record of its
    send's branch shows that branch's work landed. The landing names
    where the work landed and at which revision, and is written at most
    once.

### A.10 Inquiries and conclusions

56. A send to an inquiry opens one, with each item's brief, its
    signals and their captures among its inputs.
57. millpond keeps an inquiry's conclusion as the record of each item
    its send named, only once the operator has accepted it, and keeps
    it unchanged.
58. Each piece of work an accepted conclusion proposes becomes exactly
    one new proposed item that names the conclusion, however often the
    acceptance is read.
59. A conclusion never becomes a signal. A finding beyond an inquiry's
    inputs reaches the inbox only as an offer at the intake (27).

### A.11 What comes in once

60. An import carries in captures read before their inbox existed, each
    with its source, its event time, and its signals and moves as they
    were read. No reader is charged with them, and their excerpts are
    not checked against raw material.
61. An imported capture keeps the key it was first held under where it
    had one, and otherwise takes a key from the name it carries in the
    body it comes from.
62. Imported captures are held by key like any other (9, 10): importing
    one body twice writes nothing the second time, and a later offer
    under an imported key writes nothing.
63. An imported move whose word is not one of the six (36) is not
    taken. Its signal arrives unmoved, for curation to judge.

### A.12 Surfaces and sessions

64. Every surface answers from one core, reading the inbox's records,
    the raw bank and the per-host state. No surface computes a record,
    a count or a status of its own.
65. The same question about the same records gets the same answer
    through every surface, in one form a program reads, which only ever
    gains fields.
66. millpond lists signals by whether they are moved, by source, by
    age, by capture and by subject, and items with their signals,
    weight, briefs and sends. It gives a capture with its raw material
    where the asking host holds it.
67. Asking a part's status, or the count and age of unmoved signals by
    source, runs no part, reaches no source and writes nothing.
68. The instructions a reader and curation work by are the inbox's
    data, changed without changing millpond, and nothing millpond does
    depends on their wording.
69. No session writes a record of an inbox except through the tool that
    keeps the inbox.

### A.13 What millpond never does

70. millpond never judges what a capture says. No model reads a
    capture, a signal or raw material inside millpond; only a reader
    and curation, sessions outside it, judge.
71. millpond never lists a source, and keeps no list of what any source
    offered. Its record of what came in is the captures it holds (9).
72. millpond writes no signal but a capture's own (17), and no reading,
    move or brief of its own judgment.
73. millpond never plans across items. It never orders one item against
    another, and never turns an item into work beyond its one send.
74. millpond never tests, submits or lands work, and never moves a
    branch that existed before its send.
75. millpond keeps no secret's value in an inbox's records, the raw
    bank, the per-host state or a status.
76. Of whatever a part comes packaged with, millpond runs only the
    part.

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The part

77. **describe**: given a part, the shape of its configuration and the
    secrets it needs (20, 21).
78. **run**: given a part's configuration, its secrets, an empty raw
    place and a cursor or none, the offers and cursors the part makes,
    in order; at most one completion; whether the part reported
    success; and the last of what it reported when it failed (23, 26).
79. The guarantee: a part gives one event the same key on every host
    and every run, so offering a window again is safe (9), and one item
    that fails never stops it offering the others.

### B.2 The inbox store

80. **read**: given an inbox, its records and settings, and the version
    they were read at.
81. **write**: given an inbox, the version read and the records to add
    or replace, the write, or a refusal because the inbox has moved
    since that version (4).
82. The guarantee: a write is all or nothing, two writes from one
    version never both succeed, every host that keeps the inbox reads
    what the last write left (1), and the store holds no raw material
    and no per-host state (14).

### B.3 The raw bank

83. **bank**: given an inbox, a capture and its raw material, the
    material kept whole, and a pointer naming this host (14, 15).
84. **fetch**: given a pointer, the material whole, or that it cannot
    be reached from here (33).
85. The guarantee: material comes back exactly as banked, a pointer
    names one host and one capture's material, and the bank is never
    the inbox store (14).

### B.4 The per-host state

86. **read**: given an inbox and a part, the part's cursor and its last
    run's status on this host.
87. **write**: given an inbox, a part, a cursor or that the cursor
    stays, and a status, all written whole (23, 24, 26).
88. The guarantee: each host keeps its own, and losing it loses no
    record of the inbox: the next run starts with no cursor (25).

### B.5 The place

89. **make**: given a repository, a branch name and a brief, a new place
    of that repository on a new branch of that name, holding the brief;
    or a refusal because the branch exists or the repository cannot be
    reached (52).
90. The guarantee: making a place changes no other place and no branch
    that exists (74).

### B.6 The starter

91. **start**: given a job, either a send's place and brief or an
    inbox's unread captures on this host, the work started, or the
    instructions a person follows to start it, and whether it started
    (33, 53).
92. The guarantee: starting writes nothing of the inbox (54). Whether
    millpond starts the work itself or hands the job to a tool beside
    it is a binding of this seam, and Parts A and B hold under either.

### B.7 The merge queue's record

93. **landed**: given a repository and a branch, whether the branch's
    work landed, onto which branch and at which revision, as the merge
    queue recorded it, or that it has not landed (55).
94. The guarantee: an answer is what the queue recorded, never inferred
    from where the branch stands.

### B.8 The inquiry

95. **open**: given its inputs, an inquiry, by name (56).
96. **conclusion**: given an inquiry, its state, and, once the operator
    has accepted it, its conclusion and each piece of work the
    conclusion proposes (57, 58).
97. The guarantee: a conclusion is given as accepted only once the
    operator has accepted it, and never changes after.

### B.9 The planner

98. **hand**: given an item and its brief, the item held by the planner
    (50).
99. The guarantee: a planner holds an item once however often it is
    handed, and planning across items is the planner's alone (73).

### B.10 The claims

100. **standing**: given a claim's name, whether that claim stands
     beside the inbox (39).

### B.11 Binding the contracts

101. Each seam is bound by naming one or more profiles of Part C. An
     inbox binds exactly one inbox store, and at most one planner and
     one claims profile; a host binds one raw bank and one per-host
     state; any number of parts, places and starters are bound at once.
102. One conformance suite holds every profile to Parts A and B, and
     the capture contract's own conformance pack holds millpond as a
     host and every part (section 9). A profile that fails either is
     not one.

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile.

### C.1 The part and the intake: the capture contract

A part and a caller speak the capture contract, as Flywheel's statement
defines it. A part writes JSON Lines to standard output. Each object
has exactly one of three keys:

```json
{"capture": {"key": "release/mise/2026.10.10", "source": "release", "event_at": "2026-10-10T14:02:11Z", "title": "mise 2026.10.10", "url": "https://github.com/jdx/mise/releases/tag/v2026.10.10", "raw": ["mise-2026.10.10/notes.md", "mise-2026.10.10/release.json"], "excerpt": {"text": "…the notes, whole…", "kind": "ask", "asserted_by": "jdx/mise", "assertion": "mise 2026.10.10 is released; the repository pins 2026.9.18.", "subjects": ["release", "mise"], "argues_with": ["packages/mise/default.nix"], "position": "release notes"}}}
{"cursor": "2026-10-17T04:30:05Z"}
{"done": {"listed": 14, "failed": [{"what": "github:jdx/mise", "why": "HTTP 502"}]}}
```

A `capture` object is an offer:

| field | required | meaning |
|---|---|---|
| `key` | yes | the key (9). A `/` separates its segments. A key never starts with `/`, never has a `..` segment, and never starts with `captures` or `moves`, so it names nothing in the inbox but its own capture (7) |
| `source` | yes | the source's name: `release`, `meeting`, `folder`, `deploy` |
| `event_at` | yes | the event time, in RFC 3339 (12) |
| `title` | no | one line a person reads in a list |
| `url` | no | where the event lives upstream |
| `raw` | no | the raw material, as paths relative to the raw directory (15) |
| `excerpt` | no | present only for an own excerpt: `text`, verbatim and whole; `kind`; `asserted_by`; `assertion`; `subjects`; `argues_with`; `position` (17, 34) |

A `cursor` object is a cursor (25). A `done` object is the completion,
`listed` its count and `failed` each item that failed (23, 26).

| operation | how the contract satisfies it |
|---|---|
| describe | the adapter part's declaration in its plugin: its command, the schema of its configuration and the secrets it needs |
| run | `<command> --raw-dir <dir> [--cursor <c>]`, with the part's configuration in the file the `CAPTURE_CONFIG` environment variable names and each declared secret in the environment under its declared name; success is exit status 0 after a `done` line |

Three commands of millpond's take the lines:

- `millpond land` is the intake. It reads lines on standard input from
  whoever pipes them, and knows nothing of who made them (27).
- `millpond run <part>` makes a fresh raw directory, starts the part
  with it and the part's last cursor, lands what the part prints, and
  keeps the new cursor and the run's status: its exit, its failures and
  the tail of its standard error (23 to 26).
- `millpond tick` runs every part of an inbox whose schedule is due on
  this host (28).

millpond takes each line in seven steps:

| step | what millpond does | clauses |
|---|---|---|
| 1. check it | refuses a bad line, a bad key, a missing field or an excerpt with no text, and names it in the run | 7, 8, 15 |
| 2. look up the key | passes over a key the inbox holds, and counts it | 9, 10 |
| 3. bank the raw files | in the host's raw bank, under the capture's name | 14, 15, 16 |
| 4. write the capture | with a pointer of the form `<host>:<path>` | 11, 12, 13, 14 |
| 5. write the own signal | cut at a line within the limit, closed with a line naming what the raw record holds beyond the cut | 17, 18, 19 |
| 6. mark the capture unread | when it carries no excerpt | 17 |
| 7. record the run | its counts, failures, cursor and status | 23 to 26 |

One conformance pack from flywheel-next, lines in and records
expected, proves millpond as a host and every part (102).

### C.2 The inbox store: a git repository or a branch in one

An inbox is a git repository, or a branch in one, holding captures,
signals, moves and items in Flywheel's record formats:
`flywheel-capture/1`, `flywheel-signal/1`, `flywheel-move/1`, and the
item record, which holds an item's brief and sends (5). Each capture
exists once at rest, as a folder named from its event date and its key.
Records are rec at rest; JSON exists only in flight.

| operation | how a git inbox satisfies it |
|---|---|
| read | the checkout at the path millpond names the inbox by; the settings in one file at its root, `millpond.toml` |
| write | one commit per write in that checkout, under a lock held in the inbox's git directory for the write, so a tick, a reader, curation and a planner never write at once (4) |

`millpond.toml` holds the inbox's parts, each with its schedule, its
configuration and the host whose tick runs it; its limit; the command
that starts a reader; and whether items go to worktrees or to crew. A
fleet may generate it from a list of its own (2).

### C.3 The raw bank and the per-host state: millpond's own directories

| seam | operation | how millpond's directories satisfy it |
|---|---|---|
| raw bank | bank / fetch | files under millpond's data directory, keyed by inbox and capture; a pointer is `<host>:<path>` (14) |
| per-host state | read / write | files under millpond's state directory, keyed by inbox and part (88); `millpond status --json` gives each part's status and the count and age of unmoved signals by source, which a fleet's doctor reads (67) |

### C.4 Schedules and the cut

A schedule is five-field cron in `millpond.toml`, read with
flywheel-next's cadence, and a run missed while the host slept is
caught up once (29). One timer on a host runs `millpond tick` for each
inbox there; on swancloud, a launchd agent per inbox.

The limit is 8 KiB unless the inbox's settings say otherwise (18).

### C.5 Places: a git worktree

| operation | how a worktree satisfies it |
|---|---|
| make | a worktree of the named repository, on a branch named for the item, with the brief written in it (52) |

### C.6 Starters

| profile | start |
|---|---|
| **herdr pane** | millpond's herdr plugin starts an agent on the brief in a new pane, in the place |
| **printed command** | millpond prints the command a person runs in the place |
| **a launcher** | a tool beside millpond takes the place and the brief and starts the agent; whether it takes over from the two above is open |
| **the reader command** | the command `millpond.toml` names, run by the tick for unread captures whose raw material this host holds (33) |

A reader also starts outside millpond: from the user, with the read
skill in a session, or from crew's reader. Each writes through
millpond's tools.

### C.7 The merge queue's record: sluice

| operation | how sluice satisfies it |
|---|---|
| landed | sluice's record of the branch: its entry's state, and the landing commit it names on the branch it landed on (55) |

### C.8 Inquiries: sounding

| operation | how sounding satisfies it |
|---|---|
| open | `sounding open`, naming each item's brief, signals and captures as inputs; flume makes its place, a worktree of the repository on the branch `sounding/<name>` (56) |
| conclusion | the conclusion the operator accepted, its `conclusion.md`: the answer, its evidence, what it would change, the work it proposes, and what stays open (57, 58) |

A sounding hands a finding beyond its inputs to `millpond land` with
`sounding offer` (59): an own excerpt of kind `ask`, asserted by the
sounding, under the key `sounding/<name>/<n>`, one key per offer.

### C.9 The planner: crew

| operation | how crew satisfies it |
|---|---|
| hand | crew's planner reads the inbox's items through millpond's command line, as crew calls sluice's; the operator decides each item on crew's rail, and the planner turns an accepted item into a chore or a unit (50) |

### C.10 The claims

| setup | standing |
|---|---|
| on its own, or with crew | no claims: every challenge is refused (39) |
| with Flywheel | Flywheel's claims |

### C.11 Imports

`millpond import` carries each body in once (60 to 63):

| body | how it is read |
|---|---|
| **crew's folders** | each partition's flywheel branch: a `capture.md` and one `NN-<slug>.md` per signal. A release capture keeps the key it landed under, `release/<name>/<version>`; every other capture takes its folder's name (61) |
| **a meeting corpus** | the meetings already read in a partition's blueprints repository |

### C.12 Parts and callers

| part or caller | what it offers |
|---|---|
| **the folder drop**, built in: `millpond capture folder <dir>` | one capture per file; key `folder/<folder name>/<sha256 of the file>`; event time the date the file's name begins with, or else its last write; source `folder`; no excerpt |
| **the meeting file**, built in: `millpond capture meeting` | one capture per meeting file; no excerpt |
| **headwater**: `headwater capture`, in its Flywheel plugin | one capture per release newer than its pin; source `release`; key `release/<name>/<version>` for a watch-list entry, else `release/<type>/<namespace>/<name>/<version>` from its Package URL; raw the notes whole and what the lookup answered; an own excerpt of the notes, kind `ask`, asserted by the upstream |
| **eddy**: a part per meeting service, in its Flywheel plugin | one capture per recorded meeting; key `meeting/<service>/<meeting id>`; event time the meeting's start; raw the transcript as served and a plain copy; no excerpt |
| **crew**: `crew signal`, through `millpond land` | agents' and the operator's findings |
| **a deployer**, through `millpond land` | a failed step, its last lines the own excerpt |

### C.13 The three setups

Three setups keep the same inbox files:

| setup | the inbox | who curates | the operator decides | items go to |
|---|---|---|---|---|
| on its own | a git repository of the user's own | a Claude session through millpond's tools | each batch of moves | worktrees and soundings, by millpond's sends |
| with crew | the partition's flywheel branch in crew's state repository | crew's curator, through the same tools | each item, on crew's rail | crew's planner |
| with Flywheel | the instance's state repository, the same files | Flywheel's curation session | each proposed intent | Flywheel |

Going from one setup to the next changes the host and the curator. The
parts and the inbox stay where they are, so nothing is captured twice
and Flywheel imports nothing when it takes over (6).

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** One event, one capture, for ever (9, 11).
- **I2.** No model judges anything inside millpond. A reader and
  curation judge, outside it (70).
- **I3.** Raw material never enters an inbox, and every capture points
  at it on the host that holds it (14, 15).
- **I4.** Every excerpt stands as its source wrote it: an own excerpt
  cut only at a line, and saying so; a reader's only where it stands in
  the raw material (18, 19, 32).
- **I5.** An unmoved signal is never discarded, and curation never
  judges a moved one again (35, 41).
- **I6.** millpond never plans across items and never lands work (73,
  74).
- **I7.** An inbox outlives the tool that keeps it (6).
- **I8.** Losing what one host keeps of its own loses no record. A lost
  cursor costs one wider listing (25, 88).

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Listing a source, keying its events or fetching its material. A part
  does that, and a tool for one domain ships its own parts.
- Reading a capture into signals, or curating signals. Sessions do,
  through millpond's surfaces.
- Ordering items across teams and turning them into plans. A planner
  does.
- Testing and landing work. The merge queue does.
- Working a question. An inquiry does.
- Claims, their verdicts and a ledger. Another tool keeps them beside
  an inbox.
- Taking captures over the network from callers that reach no host. A
  hosted tool that keeps the same inbox does.
- Keeping a part's sign-in. Each part keeps its own.
- Telling anyone unasked. A surface shows what millpond holds.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- The repositories items are sent to are git repositories, and work in
  them is done on branches.
- The capture contract and the record formats of captures, signals,
  moves and items are Flywheel's statement's, an external standard.
  millpond takes the contract and writes the formats as that standard
  gives them, and passes its conformance pack (C.1, C.2).
- A model runs in two places only, a reader and curation, each a Claude
  session working through millpond's tools.
- A part is an adapter part of a plugin, which declares its command,
  the shape of its configuration and the secrets it needs.
- Several hosts may keep one inbox.
- The merge queue is sluice, inquiries are sounding's, and the planner
  is crew's today and Flywheel's later.
- millpond is free and open source.

The rest of the stack, which a model builds on unless it says why not:

- One binary, written in Rust as sluice is, built on flywheel-next's
  crates: the capture crate (the contract's types and key rules, JSON
  in flight and rec at rest, a sha256 content hash, the cut), the
  signals crate (the signal, move and item records and the inbox's
  layout), the adapters crate (the folder drop, the meeting file and
  the signals-folder import) and its cadence.
- Surfaces answering from one core, each plugin kept outside the core
  as sluice keeps its plugins:
  - a command line: `land`, `run`, `tick`, `status --json`, `import`,
    `capture folder|meeting`;
  - the session tools, served over MCP by `millpond mcp`;
  - a Claude Code plugin, `plugins/claude`, holding the curate and read
    skills and starting `millpond mcp`;
  - a herdr plugin, `plugins/herdr`, showing the count and age of
    unmoved signals by source, letting the operator review a proposed
    batch row by row, and sending an item with one key;
  - crew's rail, for an inbox crew keeps, one decision per item.
- The session tools:

  | tool | does |
  |---|---|
  | `signals` | lists signals by state, source, age, capture or subject |
  | `capture` | reads a capture and its raw material |
  | `read` | writes a capture's reading, refused when an excerpt does not stand in the raw material |
  | `moves` | writes a batch of moves in one commit |
  | `items` | lists items with their signals, briefs and sends |
  | `brief` | writes an item's brief |
  | `send` | sends an item to a worktree, or items that ask a question to a sounding |

- crew calls millpond's command line as it calls sluice's, and links
  no crate.
- The profiles of Part C: the capture contract, the git inbox, the
  per-host directories, worktrees, sluice, sounding and crew first.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- How does the intake find the raw material an offer names, when no
  run made the raw place (15, 27)?
- What counts as standing unchanged in raw material: the same bytes in
  one raw file, or the same words with whitespace evened out; and is
  where an excerpt stands checked too (32, 34)?
- Is a capture with neither raw material nor an own excerpt taken, and
  how is it read (15, 32)?
- How do hosts that each hold a copy of one inbox share their writes,
  and what happens when two copies move apart (1, 4, 82)?
- Where does a part's declared secret come from on a host (20, 75)?
- Is a batch curation proposes a record millpond keeps, so another
  surface can show it row by row, or only the session's (40, 43)?
- How is a proposed item dropped, and what move do its signals get (35,
  44)?
- May an item with a send still open be sent again, and what ends a
  send whose work never lands (49, 53)?
- When does millpond read the merge queue's record of a send's branch:
  at each tick, at each listing of items, or when the queue says (55)?
- What becomes of an item whose inquiry is sent back or dropped (57)?
- Who finds the earlier conclusions on an item's subjects for an
  inquiry's inputs, millpond or the inquiry (56)?
- Does a drop of a release's signal acknowledge the release in the
  tool that reported it (36)?
- Where does a part's cursor go when the part moves to another host (3,
  86)?
- Is there a bound on readers started at once on one host, and on how
  long a run may take (22, 33)?
- Does raw material ever leave the bank, and when (16, 85)?
- What pointer does an imported capture carry when no host banked its
  raw material (14, 60)?
- How is an item's branch named, and from which revision does it start
  (52, 89)?

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** A release part runs on its host and offers one capture whose
  own excerpt runs to forty kibibytes, with the notes whole as raw
  material. The inbox gains one capture and one signal, whose excerpt
  is cut at a line within the limit and ends with a line naming what
  was left out. The notes and the whole excerpt are banked on that
  host, and the part's status reads complete.
- **S2.** The same part runs the next day and offers the same release
  again. Nothing is written or banked, and the status counts it held.
- **S3.** A run offers fourteen captures, one with a key that would name
  something outside its own capture. That one is refused and named in
  the status, and the other thirteen are taken.
- **S4.** A part exits without its completion after offering five
  captures. The five stand, the cursor stays where it was, and the
  status reads failed. The next run lists from the old cursor, offers
  the five again, and writes nothing for them.
- **S5.** A meeting arrives with its transcript as raw material and no
  excerpt, and is unread. A tick on its host starts a reader as the
  settings say. The reader's first reading quotes a line the transcript
  does not hold, and is refused whole, naming that excerpt; the
  capture stays unread. The corrected reading is taken, and the capture
  is read.
- **S6.** A reader finds nothing in a two-minute meeting and writes a
  reading of no signals. The capture is read, and no reader is charged
  with it again.
- **S7.** Curation proposes moves for the fifty oldest unmoved signals:
  drop eighteen, answer six, and join twenty-six into five items. The
  operator changes one row. One write records the batch as changed,
  and the next batch starts with the fifty-first oldest.
- **S8.** A batch names a signal another session moved meanwhile. The
  batch is refused whole, naming that signal, and nothing of it is
  written.
- **S9.** Two release signals join one item. The operator sends it to a
  place in the repository. A new branch named for the item holds the
  brief, the send is recorded, and a starter starts an agent there and
  submits its work. The merge queue lands the work, and the item shows
  the landing with its revision.
- **S10.** In an inbox whose items go to a planner, someone asks to send
  an item to a place. The send is refused, and the planner holds the
  item once.
- **S11.** An item asks whether to take a major release. It goes to an
  inquiry, whose conclusion the operator sends back once and then
  accepts. The item's record is the accepted conclusion, the bump it
  proposes arrives as one new proposed item, and curation answers the
  next release's signal by naming the conclusion.
- **S12.** An inquiry hands in a finding beyond its inputs at the
  intake. The finding becomes a capture with its own signal, and the
  inquiry's conclusion becomes no signal.
- **S13.** A body of folders read before the inbox existed is imported
  twice. The second import writes nothing. A release capture kept its
  first key, and a later run offering that release writes nothing.
- **S14.** An inbox is kept on two hosts. Each part runs only on the
  host it names, its raw material is banked there, and no reader on the
  other host is charged with its captures.
- **S15.** A host's per-host state is deleted. The next run of each part
  starts with no cursor, lists a wider window, and writes nothing
  already held.
- **S16.** A host sleeps through three of a part's scheduled times. When
  it wakes, its tick runs the part once.
- **S17.** A tick, a reader and a curation session write to one inbox
  at once. Each write stands whole, in some order, and none is lost.
- **S18.** A deploy's failed step is handed in at the intake, its last
  lines the own excerpt. The capture and its signal are written, the
  caller is told one was taken, and no cursor or status changes.
- **S19.** A part's configuration lacks a field its declaration
  requires. The tick does not run it, and its status says why.
- **S20.** An inbox kept on its own is taken over by a planner's setup,
  and later by a hosted tool that keeps the same records. No record is
  rewritten and no event is captured twice.
- **S21.** One send names two items, a major release and a decision a
  meeting left open on the same library, to one inquiry. The operator
  accepts its conclusion, and both items show it as their record.

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of millpond that satisfies Parts A and B: its components; the
records of a capture, a signal, a move, an item and a send, and a
part's status; how an offer is taken, a reading checked, a batch
written and an item sent, with fixed examples; and how a part, an inbox
store, a starter and a planner are added. A conformance suite whose
scenarios each cite the clauses they exercise, failing when a clause is
cited by nothing. The profiles of Part C, each passing the suite, and
millpond passing the capture contract's conformance pack as a host.

<!-- ANCHOR_END: deliver -->
