# millpond — requirements
<!-- ANCHOR: preamble -->

A statement of what millpond must always do and never do, written to
admit any model that satisfies it.

The statement is in three parts. Part A is what must hold of millpond
on its own: how an inbox takes each event once as a capture, keeps the
event's raw material, runs the programs that list sources, holds the
signals read from captures and the moves curation gives them, and sends
the items curation makes. Part B is its contracts: the operations it
needs across its eleven seams, an adapter, the inbox store, the raw
bank, the per-host state, the host's secrets, a place, a starter, the
merge queue's record, an inquiry, a planner and the claims, and the
guarantee each must give. Part C is the profiles: the ways each
contract is satisfied.

Parts A and B name no mechanism: no command, file, directory, format,
field, service or tool. One thing of the world they name freely,
because section 9 fixes it: the repositories items are sent to are git
repositories, and work in them is done on branches. Where an inbox
itself is kept is not fixed, and is a seam. Every real tool is named
only in section 9 and in Part C. A reader who has never seen an inbox
for a repository's events should be able to design from Parts A and B
alone.

The capture contract, and the forms of the records an inbox holds, are
defined once in the family's shared crates, an external standard
section 9 names. Part C gives everything of them millpond needs.

## 1. Purpose

millpond is the inbox for events outside a repository that should
change its work: a release of something the repository depends on, a
decision in a meeting, a deploy that failed. An adapter, a program that
knows one source, lists its events and offers each to millpond.
millpond records each event once, as a capture, and keeps the source's
material beside it on the host that took it. A capture that quotes
itself becomes one signal at once. Any other waits for a reader, a
model session that writes its signals through millpond, and millpond
takes only the words that stand in the capture's material. Curation,
another session, gives each signal one move, in batches the operator
accepts, and joins signals into items. millpond sends an item to a
place of its own in a repository, sends items that ask a question to an
inquiry, or lets a planner take items, and records what became of
each. millpond never judges what a capture says, never plans across
items, and never submits or lands work.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **an adapter** (a program that knows one source) | how to list its source, how to key each event, what raw material to write, and whether a capture is its own excerpt | write a record, keep a list of what it offered, cut an excerpt, or read a capture into signals |
| **a caller** (a deploy, a script, a person, an inquiry handing in a finding) | what to hand in at the intake, and when | keep a cursor or an adapter's status, or have an offer taken that a run's offer would have had refused |
| **a reader** (a session) | which signals a capture holds, and what each asserts | list a source, change a capture, write a move, or write a signal whose excerpt does not stand in its capture's raw material |
| **curation** (a session) | which move it proposes for each signal, which signals join into which items, and each item's name and brief | write a capture or a signal, judge a moved signal again, or send an item the operator has not chosen |
| **the operator** | each batch of moves, accepted or changed, or each item where the setup says so; replacing a move; sending an item, and closing its send as abandoned; each conclusion, accepted, sent back or dropped | |
| **the keeper** (the operator, or a fleet on the operator's behalf) | an inbox's settings: its adapters, each adapter's host, schedule and configuration, the limit, how a reader starts, and where items go; and the secrets each host holds for its adapters | run an adapter's own logic in place of the adapter |
| **a planner** | which items it takes, how items are ordered across teams, and what work each becomes | write an inbox's records except through the tool that keeps it |
| **a starter** (a tool that starts a send's work, or what starts a reader) | how and where the work starts, and submitting a send's work to the merge queue once its worker is done | write anything of the inbox |
| **a worker** (an agent or a person in a place) | how to do an item's work, and what it commits in its place | submit its work to the merge queue, or record its own landing |
| **an inquiry** | its conclusion, and the findings beyond its inputs it hands in | write an inbox except as a caller at the intake |
| **millpond** | which offers it takes and how it keeps what it took, as this statement fixes them | judge what a capture says, plan across items, submit or land work, list a source, or change an inbox's settings |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **inbox**: the records one body of work keeps of the events that
  should change it, with its settings.
- **record**: a capture, a signal, a move, a batch or an item, with an
  item's brief, sends, landing and conclusion.
- **settings**: of an inbox, its adapters, each with its host, schedule
  and configuration; its limit; how a reader starts; and where its
  items go.
- **keeper**: whoever decides an inbox's settings.
- **host**: a machine that keeps an inbox or runs its adapters.
- **setup**: which tool keeps an inbox, and which session curates it.
- **source**: where events happen, by name: releases, meetings, a
  folder, deploys.
- **event**: one thing that happened at a source, at one time.
- **event time**: when an event happened at its source.
- **adapter**: a program that lists one source's events and offers a
  capture of each, with a declaration of the shape of its configuration
  and the secrets it needs.
- **secret**: a value an adapter needs to reach its source, named in its
  declaration and held by each host that runs the adapter.
- **run**: one start of one adapter by millpond, until the adapter
  exits.
- **raw place**: the place a run gives an adapter, empty, to write raw
  material in, or that a caller names as holding its offers' raw
  material.
- **offer**: what is handed to millpond for one event: its key, its
  source and its event time, and, where given, a title, a link, the raw
  material it names and an own excerpt.
- **key**: the identity of one event, the same from every host and
  every run.
- **cursor**: a mark an adapter offers of how far its listing reached,
  meaningful only to the adapter.
- **completion**: the mark an adapter ends a complete run with: how
  many events it listed, and each item that failed, with why.
- **intake**: the way any caller hands offers in, outside a run.
- **capture**: one event as an inbox records it.
- **raw material**: an event as its source served it, whole.
- **raw bank**: what one host keeps of the raw material of the captures
  it took.
- **pointer**: a capture's reference to its raw material, naming the
  host that holds it.
- **per-host state**: the cursor and status one host keeps for each
  adapter of an inbox it runs.
- **status**: what an adapter's last run on a host did.
- **schedule**: the times an adapter is due to run.
- **due**: of an adapter, that a time its schedule names has come since
  its last run, or that it has never run.
- **tick**: one pass over an inbox's adapters on one host.
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
- **cut**: an own excerpt shortened at a line, with a closing line of
  millpond's, to keep within the limit.
- **unread**: of a capture, that it has no own signal and no reading.
- **reading**: the signals a reader writes for one capture, which may
  be none.
- **session**: a model at work on one bounded job, outside millpond.
- **reader**: a session that turns unread captures into readings.
- **curation**: a session that gives signals moves, joins them into
  items and writes briefs.
- **move**: curation's standing judgment on one signal.
- **batch**: the moves curation proposes together, which stand together
  or not at all.
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
- **open**: of a send, that its work has not landed, its inquiry has
  neither an accepted conclusion nor been dropped, and the operator has
  not closed it as abandoned.
- **place**: a working copy of one repository on a branch of its own.
- **worker**: an agent or a person doing an item's work in a place.
- **starter**: whatever starts work: the tool that starts a worker on a
  send and submits the send's work, or what starts a reader on unread
  captures.
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
3. Each adapter of an inbox names exactly one host, and runs only there,
   whether a tick starts it or someone asks for it.
4. Writes to one inbox never interleave, whoever makes them and on
   whichever host. Two at once leave the inbox as one after the other
   would have, no write is half applied, and no write's records are
   lost.
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
    imported, whichever source, adapter or caller offered it.
11. A capture never changes once written. A later offer under its key
    changes nothing, whatever that offer carries.
12. A capture's source, event time, title and link are as its offer
    gives them. millpond never puts the time it took the capture in
    place of its event time.
13. Every capture records how it came in: from the adapter that offered
    it, through the intake, or by an import, naming the body (60). It
    also records the host that took it, and when.

### A.3 Raw material

14. Raw material never enters an inbox's records. A capture holds a
    pointer to its raw material only where a host holds some for it,
    and the pointer names that host.
15. No capture is written before the raw material its offer names is
    banked on the host that took it. An offer that names raw material
    millpond cannot read, or anything outside the raw place its run or
    caller gave it, is refused.
16. Raw material is banked whole and unchanged, as the source served
    it, and only what a taken capture names is banked. Nothing else an
    adapter wrote in its raw place outlives the run.
103. millpond never deletes raw material it banked.

### A.4 Own excerpts and the cut

17. A capture whose offer carries an own excerpt has exactly one
    signal, its own signal, written in the same write as the capture,
    and is never unread. Every other capture is unread when written.
18. An own signal's excerpt is the offered text, unchanged, from its
    start to the end of the last line that keeps it within the inbox's
    limit together with one line millpond adds. That line says how
    many lines and bytes the cut left out. When not even the first line
    fits, the added line is the whole excerpt. A text within the limit
    is kept whole, with no line added. Every other field of an own
    signal is as offered.
19. Whenever millpond cuts an excerpt, it banks the whole text with the
    capture's raw material, so nothing the cut left out is lost.

### A.5 Runs, the intake and schedules

20. A run hands its adapter the adapter's configuration from the
    inbox's settings, the secrets the adapter's declaration names as its
    host holds them and no others, an empty raw place of its own, and
    the cursor the adapter's last complete run kept, or none.
21. An adapter runs only with a configuration that fits the shape its
    declaration gives, and with every secret its declaration names held
    on its host. An adapter lacking either is not run, and its status
    says why.
22. An adapter never runs twice at once.
23. A run is complete only when its adapter ends it with a completion
    and reports success. Only a complete run moves its adapter's
    cursor, to the last cursor the run offered. A complete run that
    offered none leaves the cursor where it was.
24. A run that is not complete keeps every capture it took, leaves its
    adapter's cursor where it was, and is recorded as failed.
104. A run writes each capture it takes in a write of its own, and
     never holds the inbox from other writers for the length of the run
     (4).
25. millpond never reads meaning into a cursor. It hands a cursor back
    as the adapter offered it, and an adapter given none lists again,
    the key absorbing every repeat (9).
105. An adapter's cursor stays on the host that kept it. An adapter
     moved to another host starts there with no cursor, and its first
     run there lists without one.
26. Every run leaves its adapter's status on its host: when it ran,
    whether it was complete, what it took, held and refused, each item
    the adapter named as failed, and the last of what the adapter
    reported when it failed, with every secret's value taken out (75).
27. Offers handed in at the intake are taken as a run's offers are (7
    to 19). The intake keeps no cursor and no adapter's status, and
    tells its caller what it took, held and refused, as the one report
    weir's pack reads (weir C.7, `weir-report/1`), so the pack holds
    millpond as a host.
106. A caller at the intake names the raw place its offers' raw
     material is in, or names none. An offer that names raw material,
     from a caller that named no raw place, is refused (15).
28. A tick runs every adapter of its inbox that is due and names the
    tick's host, and no other adapter.
29. An adapter that missed several of its scheduled times while its
    host was down runs once at the next tick.
30. Nothing an adapter is handed tells it which tool started it.

### A.6 Reading

31. A capture is read at most once. A reading, of any number of signals
    including none, leaves its capture read. A reading of a capture
    already read, or of one with its own signal, is refused.
32. A reading is taken only when every excerpt it holds stands,
    unchanged, in its capture's raw material. An excerpt stands when it
    is one unbroken run of one raw file's text, line endings evened,
    beginning at the file and the line its position names. Any other
    reading is refused whole, naming each excerpt that does not stand
    there, and its capture stays unread.
33. A tick starts a reader only as the inbox's settings say one starts,
    and no reader is charged with a capture whose raw material cannot
    be reached where the reader runs.
107. A capture with neither raw material nor an own excerpt is taken
     (7), and is unread. Only a reader on the host that took it is
     charged with it, and only a reading of no signals is taken for it.
108. At most one reader of an inbox runs on a host at a time. millpond
     sets no limit on how long a run takes.
109. millpond keeps no record of which reader it charged with a
     capture. A capture a reader left unread is charged again at a later
     tick on its host, once no reader of the inbox runs there.
34. Every signal carries its capture, a kind, who asserted it, its
    subjects, its assertion, its excerpt with where it stands, and what
    it argues with. Its subjects and what it argues with may each be
    none. A signal never changes once written.
110. A signal's name is its capture's key and its number among that
     capture's signals, counted from one in the order they were
     written. The name is the same on every host and through every
     import, and a move names its signal by it.

### A.7 Moves

35. Every signal has at most one standing move. Curation proposes moves
    only for unmoved signals and never judges a moved signal again.
    Only the operator replaces a move.
111. A move's replacement names who replaced it, as the replacing
     caller names them. millpond takes every name a caller gives for who
     asked, accepted, replaced or decided, and checks no identity.
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
112. Where the operator decides each batch, a batch curation proposes
     is kept in the inbox as proposed. Its moves do not stand, and
     their signals stay unmoved, until the operator accepts it, whole
     or changed. Where the operator decides each item instead, a
     batch's moves stand once it is written.
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
113. Curation or the operator names each item a join or a route makes,
     and millpond refuses a name any item of the inbox has had. An item
     made from a conclusion's proposed work takes the name 58 gives it.
     No item's name nests under another's, and neither do its sends'
     branches.
47. An item's brief is written by curation or the operator, never by
    millpond.
48. An item is sent only with a brief. Each send keeps the brief it
    handed over as it was handed, whatever the item's brief becomes
    later.
49. An item lists every send made of it, and what became of each.
114. A proposed item is dropped when the operator replaces the move of
     each of its signals. An item left with no signals keeps its name
     (46), and a listing of items leaves it out.

### A.9 Sends

50. An inbox's settings say where its items go: to sends millpond
    makes, or to a planner. In an inbox whose items go to a planner, an
    item's send is the planner's taking of it, recorded with the brief
    the planner took, once however often the planner takes the item.
    Such an inbox sends no item to a place or an inquiry.
51. A send names exactly one target (a place in a named repository, an
    inquiry, or the planner) and who asked for it. A send to a place or
    the planner names exactly one item, and a send to an inquiry names
    one or more.
52. A send to a place makes a new place of the named repository,
    holding the item's brief. Its branch is new, named for the item and
    the send's number among the item's sends, and cut from the head of
    the repository's default branch when the place is made.
    A place never holds two items' work, and a send never takes a branch
    that exists.
115. An item has at most one open send to a place, and a send of it to
     a place while one is open is refused. The operator may close an
     open send as abandoned, which changes nothing but millpond's record
     of the send.
53. A send to a place is recorded only once its place holds the brief,
    and no work starts for a send that is not recorded. A start that
    fails is recorded against its send and never undoes it.
116. A place may stand whose send was never recorded. A later send of
     the item to its repository takes that place as its own when it was
     made for the item with the same brief, and records the send.
     Otherwise a send whose branch stands is refused (52).
54. millpond never does an item's work itself. Whatever starts the work
    changes nothing millpond records of the send but whether the work
    started.
55. An item shows a landing only when the merge queue's record of a
    send's branch shows that branch's work landed. The landing names
    where the work landed and at which revision, and is written at most
    once. Of an item sent to several places, it is the first landing
    the merge queue records.
117. A tick reads the merge queue's record of the branch of each open
     send to a place. A listing of items shows only what is recorded,
     and asks the merge queue nothing.

### A.10 Inquiries and conclusions

56. A send to an inquiry opens one, with each item's brief, its
    signals and their captures among its inputs.
57. millpond keeps an inquiry's conclusion as the record of each item
    its send named, only once the operator has accepted it, and keeps
    it unchanged.
118. A conclusion sent back leaves its send open for the inquiry's next
     round. A dropped inquiry closes its send as dropped, and its
     conclusion becomes no item's record.
58. Each piece of work an accepted conclusion proposes becomes exactly
    one new proposed item that names the conclusion, however often the
    acceptance is read. The item's name is made from the first item the
    send named and the work's number in the conclusion's order, and
    nests under neither (113).
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
    taken. Its signal arrives unmoved, for curation to judge, but for
    crew's `new-territory`, which is read as a join into a proposed item
    named for the move's target (C.11), so a curation already made is
    not judged again.
119. An imported capture keeps the pointer it was held under, where it
     had one, and holds none otherwise. An import copies no raw
     material (14).
120. An imported join makes the item it names, or grows it, as a
     proposed item with no brief (37). An imported move that lacks its
     consequence is not taken, and its signal arrives unmoved.

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
67. Asking an adapter's status, or the count and age of unmoved signals
    by source, runs no adapter, reaches no source and writes nothing.
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
121. A move writes nothing outside the inbox. A drop of a release's
     signal acknowledges nothing in the tool that reported the release.
72. millpond writes no signal but a capture's own (17), and no reading,
    move or brief of its own judgment.
73. millpond never plans across items. It never orders one item against
    another, and never turns an item into work beyond its one send.
74. millpond never tests, submits or lands work, and never moves a
    branch that existed before its send.
75. millpond keeps no secret's value in an inbox's records, the raw
    bank, the per-host state or a status.
76. Of whatever an adapter comes packaged with, millpond runs only the
    adapter.

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The adapter

77. **describe**: given an adapter, the shape of its configuration and
    the secrets it needs (20, 21).
78. **run**: given an adapter's configuration, its secrets, an empty raw
    place and a cursor or none, the offers and cursors the adapter
    makes, in order; at most one completion; whether the adapter
    reported success; and the last of what it reported when it failed
    (23, 26).
79. The guarantee: an adapter gives one event the same key on every
    host and every run, so offering a window again is safe (9), and one
    item that fails never stops it offering the others.

### B.2 The inbox store

80. **read**: given an inbox, its records and settings, and the version
    they were read at.
81. **write**: given an inbox, the version read and the records to add
    or replace, the write; or a refusal naming why. A write whose
    version the inbox has moved past is applied again to the inbox as
    it now stands, with every check it rests on made again there, a
    bounded number of times (4).
82. The guarantee: a write is all or nothing; no two writes are both
    applied to one version, whichever hosts make them; every host that
    keeps the inbox reads what the last write left (1); and the store
    holds no raw material and no per-host state (14).

### B.3 The raw bank

83. **bank**: given an inbox, a capture and its raw material, the
    material kept whole, and a pointer naming this host (14, 15).
84. **fetch**: given a pointer, the material whole, or that it cannot
    be reached from here (33).
85. The guarantee: material comes back exactly as banked, a pointer
    names one host and one capture's material, and the bank is never
    the inbox store (14).

### B.4 The per-host state

86. **read**: given an inbox and an adapter, the adapter's cursor and
    its last run's status on this host.
87. **write**: given an inbox, an adapter, a cursor or that the cursor
    stays, and a status, all written whole (23, 24, 26).
88. The guarantee: each host keeps its own and never another's (105),
    and losing it loses no record of the inbox: the next run starts
    with no cursor (25).

### B.5 The place

89. **make**: given a repository, a branch name and a brief, a new place
    of that repository on a new branch of that name, cut from the head
    of the repository's default branch, holding the brief; or a refusal
    because the branch exists or the repository cannot be reached (52).
122. **find**: given a repository and a branch name, the place that
     stands on that branch with the item and the brief it was made for,
     or that none stands (116).
90. The guarantee: making a place changes no other place and no branch
    that exists (74).

### B.6 The starter

91. **start**: given a job, either a send's place and brief or an
    inbox's unread captures on this host, the work started, or the
    instructions a person follows to start it, and whether it started
    (33, 53).
92. The guarantee: starting writes nothing of the inbox (54), and a
    send's work reaches the merge queue only through the tool that
    started it, never through its worker or millpond (74). millpond
    starts a reader itself or hands the job to a tool beside it, as
    this seam is bound, and Parts A and B hold under either.

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
    conclusion proposes, in order (57, 58, 118).
97. The guarantee: a conclusion is given as accepted only once the
    operator has accepted it, and never changes after.

### B.9 The planner

98. **take**: the planner names an item it takes, and is handed the
    item's brief, with the take recorded as the item's send (50).
99. The guarantee: however often the planner takes an item, one send is
    recorded, and planning across items is the planner's alone (73).

### B.10 The claims

100. **standing**: given a claim's name, whether that claim stands
     beside the inbox (39).

### B.11 The host's secrets

123. **secret**: given a secret's name, its value as this host holds
     it, or that this host holds none (20, 21).
124. The guarantee: a value reaches only the run that needs it, at its
     start, and is never written to an inbox's records, the raw bank,
     the per-host state or a status (75).

### B.12 Binding the contracts

101. Each seam is bound by naming one or more profiles of Part C. An
     inbox binds exactly one inbox store, and at most one planner and
     one claims profile; a host binds one raw bank, one per-host state
     and one secrets profile; any number of adapters, places and
     starters are bound at once.
102. One conformance suite holds every profile to Parts A and B, and
     the capture contract's own conformance pack holds millpond as a
     host and every adapter (section 9). A profile that fails either is
     not one.

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile.

### C.1 The adapter and the intake: the capture contract

An adapter and a caller speak the capture contract, as the family's
shared crates define it. An adapter writes JSON Lines to standard
output. Each object has exactly one of three keys:

```json
{"capture": {"key": "release/mise/2026.10.10", "source": "release", "event_at": "2026-10-10T14:02:11Z", "title": "mise 2026.10.10", "url": "https://github.com/jdx/mise/releases/tag/v2026.10.10", "raw": ["mise-2026.10.10/notes.md", "mise-2026.10.10/release.json"], "excerpt": {"text": "…the notes, whole…", "kind": "ask", "asserted_by": "jdx/mise", "assertion": "mise 2026.10.10 is released; the repository pins 2026.9.18.", "subjects": ["release", "mise"], "argues_with": ["packages/mise/default.nix"], "position": "release notes"}}}
{"cursor": "2026-10-17T04:30:05Z"}
{"done": {"listed": 14, "failed": [{"what": "github:jdx/mise", "why": "HTTP 502"}]}}
```

A `capture` object is an offer:

| field | required | meaning |
|---|---|---|
| `key` | yes | the key (9). A `/` separates its segments. A key never starts with `/`, never has a `..` segment, and never has `captures`, `moves` or `items` as its first segment, so it names nothing in the inbox but its own capture (7) |
| `source` | yes | the source's name: `release`, `meeting`, `folder`, `deploy` |
| `event_at` | yes | the event time, in RFC 3339 (12) |
| `title` | no | one line a person reads in a list |
| `url` | no | where the event lives upstream |
| `raw` | no | the raw material, as paths relative to the raw directory: the run's, or the one `millpond land --raw-dir` names (15, 106) |
| `excerpt` | no | present only for an own excerpt: `text`, verbatim and whole; `kind`; `asserted_by`; `assertion`; `subjects`; `argues_with`; `position`. Each is present, and `subjects` and `argues_with` may be empty lists (17, 34) |

A `cursor` object is a cursor (25). A `done` object is the completion,
`listed` its count and `failed` each item that failed (23, 26).

| operation | how the contract satisfies it |
|---|---|
| describe | the adapter's declaration, built into millpond or in its tool's plugin: its command, the schema of its configuration and the secrets it needs |
| run | `<command> --raw-dir <dir> [--cursor <c>]`, with the adapter's configuration in the file the `CAPTURE_CONFIG` environment variable names and each declared secret in the environment under its declared name (C.3); success is exit status 0 after a `done` line |

Three commands of millpond's take the lines:

- `millpond land [--raw-dir <dir>]` is the intake. It reads lines on
  standard input from whoever pipes them, and knows nothing of who made
  them (27). With no `--raw-dir`, a line naming raw files is refused
  (106). `--inbox <repository path> --branch <branch> --limit <bytes>`
  name the inbox and the limit in place of the host's configuration and
  the inbox's settings, for weir's pack and for a person testing by
  hand, and `millpond land`, `millpond run --run <declaration>` and
  `millpond import --import`, which reads weir's import lines on
  standard input (weir 63, 75a), under those flags print `weir-report/1`
  last on standard output (27; weir C.7).
- `millpond run <adapter>` makes a fresh raw directory, starts the
  adapter with it and the adapter's last cursor, lands what the adapter
  prints, and keeps the new cursor and the run's status: its exit, its
  failures and the tail of its standard error, each secret's value
  taken out (23 to 26).
- `millpond tick` runs every adapter of an inbox whose schedule is due
  on this host (28), reads sluice's record of each open send's branch
  (117), and starts a reader as C.6 says (33).

millpond takes each line in seven steps:

| step | what millpond does | clauses |
|---|---|---|
| 1. check it | refuses a bad line, a bad key, a missing field or an excerpt with no text, and names it in the run | 7, 8, 15 |
| 2. look up the key | passes over a key the inbox holds, and counts it | 9, 10 |
| 3. bank the raw files | in the host's raw bank, under the capture's name | 14, 15, 16 |
| 4. write the capture | with a pointer of the form `<host>:<path>` when anything was banked, in one commit per taken offer | 11, 12, 13, 14, 104 |
| 5. write the own signal | cut at a line so the text and its closing line fit the limit, the closing line naming what the raw record holds beyond the cut | 17, 18, 19 |
| 6. mark the capture unread | when it carries no excerpt | 17 |
| 7. record the run | its counts, failures, cursor and status | 23 to 26 |

One conformance pack in the family's shared crates, lines in and
records expected, proves millpond as a host and every adapter (102).

### C.2 The inbox store: a shared branch

An inbox is the `inbox/` tree of a shared branch: a branch on a remote,
or a branch of a local repository with no remote. It holds captures,
signals, moves, batches and items, with each item's brief, sends,
landing and conclusion, in the record formats and the layout the
family's shared crates fix (5). Records are recutils at rest, each
naming its format and major version, and JSON exists only in flight.
Each capture exists once at rest, its key's segments as nested
folders. A signal is named `<key>#<n>` (110). An item's name holds no
`/`, so neither it nor its sends' branches nest under another (113).

The settings are `.config/millpond.toml` at the root of the same
branch, read at the version the inbox was read at, and millpond never
writes them (2). They hold the inbox's adapters, each with its
schedule, its configuration and the host whose tick runs it; its limit;
the command that starts a reader; and where its items go (50). They
also say how old a host's lock may grow before it is stale. A fleet may
generate the file from a list of its own.

| operation | how a shared branch satisfies it |
|---|---|
| read | the branch's tip, fetched into millpond's bare cache on the host; the version is the tip's commit |
| write | the shared-branch write protocol of the family's shared crates, below (4, 81, 82) |

Every write takes the protocol's five steps:

| step | what millpond does | clauses |
|---|---|---|
| 1. fetch | fetches the branch's tip into the bare cache | 80 |
| 2. apply and check | applies the write to that tip, and checks every file it changed with `recfix` and millpond's own rules. They refuse a held key, a second reading, a second standing move, a used item name and a second open send to a place | 9, 31, 35, 46, 115 |
| 3. commit | commits the write as one commit through a temporary index, touching no working tree, with a message that names the write | 81, 82 |
| 4. push | pushes without force, with the tip read as the expected old value | 4, 82 |
| 5. replay | when the push is refused, applies the write again to the new tip from step 2 and pushes again, a bounded number of times, then reports the write refused | 81 |

A branch with no remote takes the same steps, step 4 an update of the
branch from the expected old value. millpond keeps no checkout of an
inbox. A lock in the bare cache's git directory keeps one host's own
writers in turn and does nothing more, never standing in for step 4.
The lock names its holder and when it was taken. The operator breaks a
stale one, or a writer does once it is older than the settings allow.

### C.3 The host's directories: the raw bank, the per-host state and the secrets

| seam | operation | how millpond's directories satisfy it |
|---|---|---|
| raw bank | bank / fetch | files under `$XDG_DATA_HOME/millpond/<inbox>/<capture>/`, byte for byte, with a cut excerpt's whole text beside them as `_excerpt`; a pointer is `<host>:<path>` (14, 19). millpond never deletes them (103), and of millpond's directories a host backs up this one alone |
| per-host state | read / write | files under `$XDG_STATE_HOME/millpond/<inbox>/<adapter>`, each written whole by replacing it (88). A lock per adapter (22) and one per inbox's reader (108) sit beside them. `millpond status --json` gives each adapter's status and the count and age of unmoved signals by source, which a fleet's doctor reads (67) |
| the host's secrets | secret | one file per secret, named as the declaration names it, in the directory the host's configuration names. millpond reads it when a run starts, puts its value in the run's environment, and copies it nowhere (75, 124) |

The host's configuration, under `$XDG_CONFIG_HOME/millpond/`, lists the
inboxes the host keeps, each by its repository, its branch and the name
`<inbox>` stands for above, and names the secrets directory. The bare
cache is `$XDG_CACHE_HOME/millpond/git/`.

### C.4 Schedules and the cut

A schedule is five-field cron in `.config/millpond.toml`, read with the
shared crates' cadence, and a run missed while the host slept is caught
up once (29). One timer on a host runs `millpond tick` for each inbox
there; on swancloud, a launchd agent per inbox.

The limit is 8 KiB unless the inbox's settings say otherwise (18).

### C.5 Places: flume

| operation | how flume satisfies it |
|---|---|
| make | `flume launch` with the repository, the kind, `fix` or `change`, the item's brief as the launch's, a name, and a mark naming the inbox, the item and the send's number. The name is `<item>--<n>`, n the send's number among the item's sends, from 1. flume makes a worktree at `<repository>/places/<kind>--<name>` on the branch `<prefix>/<name>`, the prefix the kind's, cut from the base's head. It refuses a launch whose branch or place stands (52, 89) |
| find | `flume status --json`: the live place of the repository under the send's name, its mark naming the item and the send, its brief the launch's (116, 122) |

### C.6 Starters

| profile | start |
|---|---|
| **flume** | a send's work: the launch of C.5 starts each stage's agent, in a herdr pane or as a command flume prints for a person. After the kind's last stage, flume submits the place's branch through its merge queue, sluice, and no agent submits. On a landing, sluice's worktrunk driver removes the worktree and the branch (92) |
| **the reader command** | the command `.config/millpond.toml` names, run by the tick on this host for unread captures whose raw material this host holds, or that hold none and were taken here (33, 107), one at a time (108) |

A reader also starts outside millpond: from the user, with the read
skill in a session, or from crew's reader. Each writes through
millpond's tools.

### C.7 The merge queue's record: sluice

| operation | how sluice satisfies it |
|---|---|
| landed | sluice's record of the branch flume submitted: its entry's state, and the landing commit it names on the branch it landed on (55) |

### C.8 Inquiries: sounding

| operation | how sounding satisfies it |
|---|---|
| open | `sounding open`, naming each item's brief, signals and captures as inputs; flume makes its place, a worktree of the repository on the branch `sounding/<name>` (56) |
| conclusion | the sounding's state and the conclusion the operator accepted, read from sounding's record through its command line. The conclusion holds the answer, its evidence, what it would change, the work it proposes in order, and what stays open (57, 58, 118) |

Each piece of work an accepted conclusion proposes, the k-th in its
order, becomes the item `<item>.<k>`, `<item>` the first item the send
named (58).

A sounding hands a finding beyond its inputs to `millpond land` with
`sounding offer` (59): an own excerpt of kind `ask`, asserted by
`sounding/<repository>/<name>`, under the key
`sounding/<repository>/<name>/<n>`, one key per offer.

### C.9 The planner: crew

| operation | how crew satisfies it |
|---|---|
| take | crew's planner reads the inbox's items through millpond's command line, as crew calls sluice's, and runs `millpond hand <item>` when it takes one, which millpond records as the item's send once however often it runs (50, 98). The operator decides each item on crew's rail, and the planner turns an accepted item into a chore or a unit |

### C.10 The claims

| setup | standing |
|---|---|
| on its own, or with crew | no claims: every challenge is refused (39) |
| with Flywheel | Flywheel's claims |

### C.11 Imports

`millpond import` carries each body in once (60 to 63, 119, 120):

| body | how it is read |
|---|---|
| **crew's folders** | each partition's flywheel branch: a `capture.md` and one `NN-<slug>.md` per signal; a `new-territory` move is a join into a proposed item named for its target (63). A release capture keeps the key it landed under, `release/<name>/<version>`; every other capture takes its folder's name (61). A capture keeps the pointer crew gave its raw record (119) |
| **a meeting corpus** | the meetings already read in a partition's blueprints repository |

### C.12 Adapters and callers

| adapter or caller | what it offers |
|---|---|
| **the folder drop**, built in: `millpond capture folder <dir>` | one capture per file; key `folder/<folder name>/<sha256 of the file>`; event time the date the file's name begins with, or else its last write; source `folder`; no excerpt |
| **the meeting file**, built in: `millpond capture meeting` | one capture per meeting file; no excerpt |
| **headwater**: `headwater capture`, the adapter in its Flywheel plugin | one capture per release newer than its pin; source `release`; key `release/<name>/<version>` for a watch-list entry, else `release/<type>/<namespace>/<name>/<version>` from its Package URL; raw the notes whole and what the lookup answered; an own excerpt of the notes, kind `ask`, asserted by the upstream |
| **eddy**: an adapter per meeting service, in its Flywheel plugin | one capture per recorded meeting; key `meeting/<service>/<meeting id>`; event time the meeting's start; raw the transcript as served and a plain copy; no excerpt |
| **crew**: `crew signal`, through `millpond land` | agents' and the operator's findings |
| **a deployer**, through `millpond land` | a failed step, its last lines the own excerpt |

### C.13 The three setups

Three setups keep one inbox, the same `inbox/` tree in the same
formats:

| setup | the branch the inbox is on | who curates | the operator decides | items go to |
|---|---|---|---|---|
| on its own | a branch of the user's own repository | a Claude session through millpond's tools | each batch of moves | flume and sounding, by millpond's sends |
| with crew | the partition's branch in crew's state repository, beside crew's plan | crew's curator, through the same tools | each item, on crew's rail | crew's planner |
| with Flywheel | the branch Flywheel keeps it on | Flywheel's curation session | each proposed intent | Flywheel |

Going from one setup to the next changes the curator and where items
go. When the next setup keeps the inbox on another branch, the inbox's
history moves to it by a push, and no record is rewritten. The
adapters' hosts change only in the settings, so nothing is captured
twice and Flywheel imports nothing when it takes over (6).

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** One event, one capture, for ever (9, 11).
- **I2.** No model judges anything inside millpond. A reader and
  curation judge, outside it (70).
- **I3.** Raw material never enters an inbox, and every capture with
  raw material points at it on the host that holds it (14, 15).
- **I4.** Every excerpt stands as its source wrote it: an own excerpt
  cut only at a line, and saying so; a reader's only where it stands in
  the raw material (18, 19, 32).
- **I5.** An unmoved signal is never discarded, and curation never
  judges a moved one again (35, 41).
- **I6.** millpond never plans across items, and never submits or lands
  work (73, 74).
- **I7.** An inbox outlives the tool that keeps it (6).
- **I8.** Losing what one host keeps of its own loses no record. A lost
  cursor costs one wider listing (25, 88).
- **I9.** Writes from every host keep one history of an inbox: none
  interleave, and none is lost (4, 82).

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Listing a source, keying its events or fetching its material. An
  adapter does that, and a tool for one domain ships its own adapters.
- Reading a capture into signals, or curating signals. Sessions do,
  through millpond's surfaces.
- Ordering items across teams and turning them into plans. A planner
  does.
- Starting an item's work and submitting it. A starter does.
- Testing and landing work. The merge queue does.
- Working a question. An inquiry does.
- Claims, their verdicts and a ledger. Another tool keeps them beside
  an inbox.
- Taking captures over the network from callers that reach no host. A
  hosted tool that keeps the same inbox does.
- Keeping an adapter's sign-in. Each adapter keeps its own.
- Telling anyone unasked. A surface shows what millpond holds.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- The repositories items are sent to are git repositories, and work in
  them is done on branches.
- The family's shared crates define and implement three things once:
  the capture contract; the record formats of captures, signals, moves,
  batches and items; and the protocol that writes a shared branch. They
  live in a public repository of the family's own, and are an external
  standard to millpond. millpond takes the contract, writes the formats and the protocol as
  the crates give them, and passes their conformance pack (C.1, C.2).
  Flywheel builds on the same crates.
- The family keeps each piece of state in the lowest of five layers
  that holds every reader it has: the host, a worktree, a clone, a
  shared branch, or a repository's content. An inbox is on a shared
  branch; raw material, cursors and run status stay on the host that
  made them; and a repository declares itself to a tool in
  `.config/<tool>.toml`.
- A model runs in two places only, a reader and curation, each a Claude
  session working through millpond's tools.
- An adapter ships inside millpond when its source needs no other
  tool, and otherwise in a plugin of the tool whose domain it wraps.
  Either way it declares its command, the shape of its configuration
  and the secrets it needs.
- Several hosts may keep one inbox.
- Places and their agents are flume's, and flume submits a place's
  work. The merge queue is sluice, inquiries are sounding's, and the
  planner is crew's today and Flywheel's later.
- millpond is free and open source.

The rest of the stack, which a model builds on unless it says why not:

- One binary, written in Rust as sluice is, built on the family's
  shared crates: the contract's types and key rules, JSON in flight and
  rec at rest, a sha256 content hash and the cut; the signal, move,
  batch and item records and the inbox's layout; the shared-branch
  write protocol; the folder drop, the meeting file and the
  signals-folder import; and the cadence.
- Surfaces answering from one core, each plugin kept outside the core
  as sluice keeps its plugins:
  - a command line: `land`, `run`, `tick`, `status --json`, `import`,
    `capture folder|meeting`, `hand`, and the operator's commands to
    replace a move and to close a send as abandoned;
  - the session tools, served over MCP by `millpond mcp`;
  - a Claude Code plugin, `plugins/claude`, holding the curate and read
    skills and starting `millpond mcp`;
  - a herdr plugin, `plugins/herdr`, showing the count and age of
    unmoved signals by source, letting the operator review a proposed
    batch row by row, and sending an item with one key. It gives the
    operator shortcuts and curates nothing, since a session curates;
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
  | `send` | sends an item to flume as a fix or a change, or items that ask a question to a sounding |

- crew calls millpond's command line as it calls sluice's, and links
  no crate.
- The profiles of Part C: the capture contract, the shared-branch
  inbox, the host's directories, flume, sluice, sounding and crew
  first.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- Who finds the earlier conclusions on an item's subjects for an
  inquiry's inputs, millpond or the inquiry (56)?

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** A release adapter runs on its host and offers one capture
  whose own excerpt runs to forty kibibytes, with the notes whole as
  raw material. The inbox gains one capture and one signal, whose
  excerpt is cut at a line within the limit and ends with a line naming
  what was left out. The notes and the whole excerpt are banked on that
  host, and the adapter's status reads complete.
- **S2.** The same adapter runs the next day and offers the same
  release again. Nothing is written or banked, and the status counts
  it held.
- **S3.** A run offers fourteen captures, one with a key that would name
  something outside its own capture. That one is refused and named in
  the status, and the other thirteen are taken.
- **S4.** An adapter exits without its completion after offering five
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
  an item to a place. The send is refused. The planner takes the item
  twice, and one send is recorded.
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
- **S14.** An inbox is kept on two hosts. Each adapter runs only on the
  host it names, its raw material is banked there, and no reader on the
  other host is charged with its captures.
- **S15.** A host's per-host state is deleted. The next run of each
  adapter starts with no cursor, lists a wider window, and writes
  nothing already held.
- **S16.** A host sleeps through three of an adapter's scheduled times.
  When it wakes, its tick runs the adapter once.
- **S17.** A tick, a reader and a curation session write to one inbox
  at once. Each write stands whole, in some order, and none is lost.
- **S18.** A deploy's failed step is handed in at the intake, its last
  lines the own excerpt. The capture and its signal are written, the
  caller is told one was taken, and no cursor or status changes.
- **S19.** An adapter's configuration lacks a field its declaration
  requires. The tick does not run it, and its status says why.
- **S20.** An inbox kept on its own is taken over by a planner's setup,
  and later by a hosted tool that keeps the same records. No record is
  rewritten and no event is captured twice.
- **S21.** One send names two items, a major release and a decision a
  meeting left open on the same library, to one inquiry. The operator
  accepts its conclusion, and both items show it as their record.
- **S22.** Two hosts take an offer under the same key at once. One
  host's write is applied first. The other's is applied again to the
  inbox as it now stands, finds the key held, and writes nothing, and
  the inbox keeps one capture of the event.
- **S23.** An item's send to a place stays open while its work stalls.
  A second send of it to a place is refused. The operator closes the
  first as abandoned, and the next send takes a new branch of its own
  while the first branch stands.

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of millpond that satisfies Parts A and B: its components; the
records of a capture, a signal, a move, a batch, an item and a send,
and an adapter's status; how an offer is taken, a reading checked, a
batch written and an item sent, with fixed examples; and how an
adapter, an inbox store, a starter and a planner are added. A
conformance suite whose scenarios each cite the clauses they exercise,
failing when no scenario cites a clause. The profiles of Part C, each
passing the suite, and millpond passing the capture contract's
conformance pack as a host.

<!-- ANCHOR_END: deliver -->
