# weir — requirements
<!-- ANCHOR: preamble -->

A statement of what weir must always do and never do, written to
admit any model that satisfies it.

weir is the code the agentplot family shares. It has no process, no
state and no machine of its own: it defines, once, what every open
tool and Boomdrive agree on, and implements each definition once, so
that millpond, headwater, eddy, sounding, flume and later Boomdrive
build on one copy of each. The statement is in three parts. Part A is
what must hold of the things weir defines: the capture contract, by
which an adapter hands a host its events and a host takes them; the
records an inbox holds and how they lie; the protocol that writes a
shared branch; the kind format, by which a tool declares the stages
work goes through, as a list or as a statechart; the engine, which
ticks a statechart; cadence; the built-in adapters; the delivery, a message
a tool owes a reader until the reader confirms it; the link, by which
each step that carries a signal to a published version names the step
before it; the facts a signal carries, stated by its source, joined
from a people list or read by its reader; the policy, a keeper's rules
that move a signal by its facts; and the conformance pack that holds
every host, every adapter and every deliverer's store to the rest. Part B is its
contracts: the operations weir needs across its six seams, an adapter, a host, a shared branch's keeper, a kind's
reader, a clock and a deliverer's store, and the guarantee each must
give. Part C is the profiles: the
ways each contract is satisfied.

Parts A and B name no mechanism: no command, file, directory, format,
field, service or tool. One thing of the world they name freely,
because section 9 fixes it: a shared branch is a branch of a git
repository, and an inbox lies on one. Every other real tool is named
only in section 9 and in Part C. A reader who has never seen the
family's tools should be able to design the crates from Parts A and
B and git alone.

The statements of millpond, eddy, headwater, sounding and flume each
lean on this one where they say "the family's shared crates". Where
one of them restates a clause of this statement, this statement is
the source, and the other cites it.

## 1. Purpose

weir exists so that the family's tools agree without talking. An
adapter written for one host runs unchanged under another. An inbox
written by one tool is read by the next with no import. Two hosts
writing one record to one branch at once meet one rule, and the second
is refused. A kind declared for flume is read by sounding without a
format of its own. A message one tool owes a reader is done when that
reader confirms it, whichever tool owes it. A published version traces
back, one step at a time, to the signal behind it, whichever tools
took the steps. A keeper's rule reads a signal's facts the same way
under every host. And a conformance pack says, of any host, adapter or
deliverer's store, whether it keeps the contract. weir judges nothing a capture says, moves no signal, hands no
message over, starts no agent and lands no work: those are the tools'.
weir fixes the forms they meet in.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **an adapter** (a program that knows one source) | how to list its source, how to key each event, what raw material to write, whether an offer carries an own excerpt, and the facts it states | write a record, keep a list of what it offered, cut an excerpt, read a capture into signals, state a fact read from what an event says (118), or learn which host or machine ran it |
| **a host** (a program that takes offers and keeps an inbox: millpond, Boomdrive) | which adapters to run and when, where its inbox lies, its limit, and what becomes of an item | change what an offer carries, write a record outside the forms weir fixes, take a key the inbox holds, or move a signal by a rule but as its policy gives it (125) |
| **a keeper** (whoever decides an inbox's settings) | the inbox's policy, its rules in order, and the people list its host joins from | write a rule that reads anything but facts (123) |
| **a writer** (a host, a session or a tool writing a shared branch) | what to write, and when | apply a write to a tip it was not checked against, or stand in for that check with a lock |
| **a kind's declarer** (a tool, a repository or a launch) | the stages work goes through, each stage's prompt, agents and deliverable, and any section of its own | make a reader run what the format does not say |
| **a kind's reader** (flume, sounding, Boomdrive) | which sections of a declaration it reads, which templates and atoms it binds, and what it refuses | change a declaration, fail on a section it does not know, or decide a transition of a statechart kind the engine does not give (96) |
| **a deliverer** (a tool that owes a reader a message: flume, sluice) | what it owes and to which readers, how and when it hands a message over, the span before one expires, and where it keeps its records | count a message done that a reader has not confirmed, let go of one a reader has not confirmed, or change one once recorded |
| **a reader** (of a delivery: a session, an agent, a role) | when it confirms what it was handed | confirm a message under another reader's name |
| **the operator** | everything a tool's statement leaves to them | |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **host**: a program that takes offers under the capture contract and
  keeps an inbox: millpond today, Boomdrive later.
- **machine**: a computer a host or an adapter runs on.
- **source**: where events happen, by name: releases, meetings, a
  folder, deploys.
- **event**: one thing that happened at a source, at one time.
- **event time**: when an event happened at its source.
- **adapter**: a program that lists one source's events and offers a
  capture of each, with a declaration.
- **declaration** (of an adapter): how the adapter is started, the
  shape of its configuration, and the secrets it needs, by name.
- **secret**: a value an adapter needs to reach its source, named in
  its declaration and placed by the host that runs it.
- **run**: one start of one adapter by a host, until the adapter exits.
- **raw place**: the place a run gives an adapter, empty, to write raw
  material in, or that a caller names as holding its offers' raw
  material.
- **line**: one thing an adapter tells its host during a run: an offer,
  a cursor or a completion.
- **offer**: what is handed to a host for one event: its key, its
  source and its event time, and, where given, a title, a link, the
  raw material it names and an own excerpt.
- **key**: the identity of one event, the same from every adapter run
  on every machine, made of segments.
- **cursor**: a mark an adapter offers of how far its listing reached,
  meaningful only to the adapter.
- **completion**: the mark an adapter ends a complete run with: how
  many events its listing held, and each that failed, with why.
- **intake**: the way any caller hands offers to a host outside a run.
- **capture**: one event as an inbox records it.
- **raw material**: an event as its source served it, whole.
- **raw bank**: what one machine keeps of the raw material of the
  captures taken there.
- **pointer**: a capture's reference to its raw material, naming the
  machine that holds it.
- **signal**: one assertion read from a capture.
- **nature**: of a signal, which of five it is: constraint, ask,
  question, commitment, reaction.
- **excerpt**: words of a capture's raw material, as they stand there,
  with where they stand.
- **own excerpt**: the excerpt an offer carries when the capture says
  one thing and that thing is its signal, as a release's notes are.
- **own signal**: the one signal of a capture whose offer carried an
  own excerpt, or that a rule matched as it landed (127).
- **limit**: the most bytes an excerpt may hold in an inbox's records.
- **cut**: an own excerpt shortened at a line, with a closing line of
  the host's, to keep within the limit.
- **reading**: the signals a reader writes for one capture, which may
  be none.
- **unread**: of a capture, that it has no own signal and no reading.
- **move**: curation's standing judgment on one signal, or a rule's
  standing outcome for it.
- **batch**: the moves curation proposes together, which stand together
  or not at all.
- **claim**: a statement of what is true at the destination, kept
  beside an inbox by another tool.
- **item**: a unit of work, made of the signals curation or a rule
  joined into it, or of a piece of work an accepted conclusion proposed;
  **proposed** until it is first sent, **sent** after.
- **brief**: what whoever does an item's work needs, written for the
  item.
- **send**: one handing of items to one target: one item to a place or
  a planner, one or more to an inquiry.
- **weight**: of an item, how many signals it holds, from which
  sources, over what span of event times.
- **inbox**: the records one body of work keeps of the events that
  should change it: captures, signals, moves, batches and items, with
  each item's brief and sends.
- **record**: one capture, signal, move, batch, item, brief or send, as
  an inbox holds it; or one delivery, hand-over, confirmation or known
  name, as a deliverer's store holds it.
- **format**: the named shape of a record, with a major: readers of a
  later major read every earlier one as it stands.
- **major**: of a format, the number that changes when a reader of the
  old shape could misread the new.
- **layout**: where each record lies in an inbox, fixed by its key or
  its name alone.
- **import**: a carrying-in of captures read before their inbox
  existed, with their signals and moves.
- **shared branch**: a branch that several machines or several tools
  write, each through the one protocol.
- **tip**: a shared branch's state at one moment; a write moves the
  branch from one tip to the next.
- **write**: one change to a shared branch: the records it adds or
  replaces, applied to one tip.
- **check**: a rule a write must satisfy at the tip it lands on: no
  held key written again, no second reading, no second standing move,
  no used item name.
- **lock**: what keeps one machine's writers in turn.
- **kind** (of work): a versioned simple kind or statechart kind,
  declared by a tool, a repository, a launch or a package, and named by
  its source, its name and its version.
- **simple kind**: a kind that is an ordered list of stages (51).
- **statechart kind**: a kind that is a statechart, built from the
  templates its reader runs (94).
- **statechart**: regions side by side, each in one of its states at a
  time, with transitions out of each state in priority order, each
  under a guard over evidence and with the effects it names (94).
- **template**: a statechart with parameters, which a state of a
  statechart kind runs inside it (94).
- **atom**: a name a guard reads as evidence, or a transition names as
  an effect; a kind's reader binds each, and weir interprets none (98).
- **proof**: of an effect, the evidence that shows it done, which the
  reader names for the atom (96).
- **decision**: a state of a statechart that waits on a person's answer
  while it is active (94, 97).
- **snapshot**: the values of a statechart's evidence, read at one
  moment and given to a tick (96).
- **tick**: one pass of the engine over one object's state of a
  statechart and one snapshot (96).
- **engine**: the code that ticks a statechart, defined once in weir
  (96 to 98).
- **source** (of kinds): a name for where kinds come from: a tool's own,
  a repository's own declaration, a launch's, or one from outside.
- **package** (of a kind): one kind at one version as it travels from
  one place to another, its declaration with every part it names.
- **lock** (of kinds): a list of kinds by source, name and version, each
  with the hash of its content.
- **stage**: one step of a simple kind, worked by one agent, ending on
  its deliverable or, for a conversation, on its caller's word; of a
  statechart kind, a state that runs the stage template (94).
- **deliverable**: what a stage must produce for the stage to end, in
  one of seven forms.
- **conversation**: a stage with no deliverable, which ends on its
  caller's word.
- **elaboration kind**: a kind with an elaboration section, read by
  whoever runs elaborations.
- **declaration** (of kinds): the kinds one source declares, with every
  field of each.
- **schedule**: the times something is due.
- **due**: that a time a schedule names has come since the last run, or
  that there has never been one.
- **cadence**: the rule that reads a schedule, a last run and now, and
  says due or not.
- **case**: one trial of the conformance pack: what goes in, and what
  must come out.
- **pack**: the conformance pack: every case, with the check that each
  cites what it exercises.
- **profile**: one way a contract of Part B is satisfied, as Part C
  describes.
- **deliverer**: a tool that owes a reader a message, and keeps the
  records of what it owes in a store of its own.
- **delivery**: one message a deliverer owes its readers, recorded once
  under its key (100).
- **reader** (of a delivery): whoever a delivery is owed to, named as
  its deliverer names it: a session, an agent, a role.
- **hand-over**: one handing of a delivery to one of its readers, by a
  way its deliverer names, such as a notice into a session, a wait that
  answers with it, or a listing the reader asks for; it confirms nothing
  (103).
- **confirmation**: a reader's word that it has a delivery, naming the
  delivery's key (102).
- **expiry**: of a delivery, the time it stops being owed to a reader
  that has not confirmed it, fixed when it is recorded (104).
- **owed**: of a delivery and one of its readers, that the reader has
  not confirmed it and its expiry has not come.
- **expired**: of a delivery and one of its readers, that the reader has
  not confirmed it and its expiry has come.
- **done**: of a delivery, that every one of its readers has confirmed
  it (107).
- **known** (of a reader's name): that a reader has confirmed under it
  (106).
- **store** (of deliveries): where a deliverer keeps its deliveries'
  records, on a machine or on a shared branch.
- **chain**: the steps that carry a signal to a published version: the
  item made of it, the item's work, that work's landing, and the
  version published from the landing.
- **step**: one of a chain's acts, taken by one tool, which makes
  something from what the step before it made; the signal stands before
  the first.
- **link**: the record of one step: what the step made, and the step
  before it.
- **fact**: a name with one value or several, which a rule may match:
  **stated** by a capture's source, **joined** by a host from its
  people list, or **read** by a reader and checked by a host.
- **people list**: the persons and orgs a host joins facts from, with
  the teams and repositories a read fact picks from.
- **keeper**: whoever decides an inbox's settings, its policy among
  them.
- **policy**: a keeper's rules for one inbox, in order.
- **rule**: a match on facts with its outcome, a kind to launch, a
  person's turn or a drop, and, but for a drop, a priority and a window
  or none.
- **priority**: of a rule, one of five levels, low, normal, elevated,
  high and urgent: the rank its launch takes among the places waiting
  to start, or the order in which a person meets its item.
- **window**: of a rule, the schedule whose times close the item its
  rule gathers.

<!-- ANCHOR_END: glossary -->
<!-- ANCHOR: part-a -->
## Part A. What weir defines

### A.1 Offers

1. An adapter tells its host nothing but lines, and every line is
   exactly one of three: an offer, a cursor or a completion. A line
   that is none, or more than one, is malformed.
2. An offer carries a key, a source and an event time. It may carry a
   title, a link, the raw material it names, an own excerpt and the
   facts its source states (118), and nothing else a host must read
   (the update-ladder talk, 2026-11-12).
3. One event has one key: the same from every run of every adapter
   that lists it, on every machine. Two events never share a key.
4. A key is made of segments, and names nothing in an inbox but its
   own capture: never a place above the inbox, outside it, or where
   moves, batches or items lie.
5. An event time is when the event happened at its source, never when
   it was listed or taken. Every age and weight reads it.
6. Raw material an offer names is whole and unchanged, as the source
   served it, written by the adapter in the raw place its run was
   given, and named relative to that place. An offer names nothing
   outside its raw place.
7. An own excerpt holds every field of a signal: its text, whole and
   verbatim; its nature; who asserted it; what it asserts; its
   subjects; what it argues with, which may be nothing; and where it
   stands. An offer whose own excerpt lacks its text, or any field, is
   malformed.
8. A cursor is opaque. It means something to the adapter that made it
   and to nothing else. A host keeps the last cursor of a complete run
   and hands it back on the adapter's next run, and an adapter works
   without one: offering a window again is safe, because a host holds
   each key once (14).
9. A completion ends a complete run, and says how many events the
   listing held and which failed, each with why. A run that ends
   without a completion, or that reports failure, is incomplete: every
   offer it made stands, and its cursor does not advance.
10. One event that fails never stops an adapter offering the others.
11. Every adapter has a declaration: how it is started, the shape of
    its configuration, and the secrets it needs, by name. A host runs
    an adapter from its declaration and nothing else, and places each
    secret under the name the declaration gives.
12. An adapter never learns which host or machine ran it, and never
    writes a record, keeps a list of what it offered, cuts an excerpt
    or reads a capture into signals.

### A.2 What a host does with an offer

13. A host takes an offer only when it carries a key, a source and an
    event time, when its key names nothing in the inbox but its own
    capture (4), when any own excerpt it carries holds every field
    (7), and when each fact it carries has a name and values of the
    forms 117 gives. Every other offer is refused.
14. An inbox holds at most one capture per key, whatever writes at
    once. An offer whose key the inbox holds writes nothing, banks
    nothing, and is counted as held.
15. A refused offer is named, with its reason, in what the host reports
    of the run or intake, and never stops another offer from being
    taken.
16. A capture's source, event time, title, link and stated facts are as
    its offer gave them, and a capture never changes once written. A
    later offer under its key changes nothing, whatever it carries.
17. Raw material never enters an inbox's records. A capture holds a
    pointer only where a machine banked raw material for it, and the
    pointer names that machine by the hostname the machine reports for
    itself, its short name, as `<hostname>:<path>`.
18. No capture is written before the raw material its offer names is
    banked, whole and unchanged, on the machine that took it. Only
    what a taken capture names is banked; nothing else an adapter
    wrote in its raw place outlives the run.
19. A capture whose offer carried an own excerpt, or that a rule
    matches as it lands (127), has exactly one signal, its own signal,
    written in the same write as the capture, and is never unread.
    Every other capture is unread when written.
20. An own signal's excerpt is the offered text, unchanged, from its
    start to the end of the last line that keeps it within the limit
    together with one line the host adds, which says how many lines
    and bytes the cut left out. When not even the first line fits, the
    added line is the whole excerpt. A text within the limit is kept
    whole, with no line added. Every other field of an own signal is
    as offered.
21. Whenever a host cuts an excerpt, it banks the whole text with the
    capture's raw material, so nothing the cut left out is lost.
22. Every capture records how it came in, from an adapter's run,
    through the intake or by an import, the machine that took it, and
    when.
23. A host records each run: what it took, held and refused, each
    failure the completion named, the cursor it kept, and whether the
    run was complete.
24. Two hosts given the same lines write the same captures and the same
    own signals, cut the same way at the same limit. What a host does
    with an offer is fixed by this statement, not by the host.

### A.3 Signals and readings

25. A signal holds its excerpt and where it stands, its nature, who
    asserted it, what it asserts, its subjects, what it argues with,
    which may be nothing, and the read facts its host took (120), which
    may be none. Its nature is one of five: constraint, ask, question,
    commitment, reaction, and an own signal a rule made has none (127).
    A signal also carries its capture's stated facts, and the facts a
    host joins to them (117, 119) (the update-ladder talk, 2026-11-12).
26. A signal's excerpt stands verbatim in its capture's raw material,
    or is the capture's own excerpt as cut (20), or, for an own signal
    a rule made, stands in the capture's offer (127). A signal whose
    excerpt stands in none of them is refused. An imported signal is
    exempt (37).
27. A capture's signals are numbered in reading order, and a signal's
    identity is its capture's key with its number. A signal never
    changes once written.
28. A reading is the signals one reader writes for one capture, which
    may be none. A capture has at most one reading, written whole or
    refused whole, naming each signal that could not be taken.

### A.4 Moves and batches

29. Every signal has at most one standing move. A second move for a
    moved signal is refused. Only a replacement changes a standing
    move, and the replacement names who replaced it and the move it
    replaced.
30. A move is one of six, each with its consequence: a drop carries
    its reason; an answered the claim or record that settled the
    signal; a challenge the claim it weighs against; a join the item it
    makes or grows; an attach the sent item it adds to; a route the
    chore or the ask it offers. A move of any other word, or lacking
    its consequence, is refused.
31. A move names who made it and when, and the batch it stood in where
    there was one. A rule's move names its rule as who made it (128).
32. A batch is written whole or refused whole, naming each move that
    could not be taken. While a batch is proposed, its moves do not
    stand and its signals stay unmoved.
33. An unmoved signal is never discarded, however old. A signal's age is
    its capture's event time (5).

### A.5 Items, briefs and sends

34. An item's signals are exactly those whose standing move names it,
    or it is made from the work an accepted conclusion proposed and
    names that conclusion. An item's weight is read from its signals,
    never recorded apart from them.
35. An item's name is one no item of its inbox has ever had, and nests
    under no other item's name.
36. An item holds its brief, written by curation or the operator and
    never by a host, but for a rule's item: its host writes that brief
    when the window closes, of its signals' excerpts as they stand, in
    the order of their event times, and adds no word of its own (128;
    the update-ladder talk, 2026-11-12). An item holds every send made
    of it with what became of each. A send keeps the brief as it was
    handed, whatever the item's brief becomes later.

### A.6 The inbox's records and layout

37. An import carries in captures read before their inbox existed, each
    with its source, its event time, the pointer it was held under
    where it had one, and its signals and moves as they were read. No
    reader is charged with them, their excerpts are not checked against
    raw material, and an import copies no raw material.
38. An imported capture keeps the key it was first held under where it
    had one, and otherwise takes a key from the name it carries in the
    body it comes from. Imported captures are held by key like any
    other (14): importing one body twice writes nothing the second
    time, and a later offer under an imported key writes nothing.
39. An imported move whose word is not one of the six (30), or that
    lacks its consequence, is not taken, and its signal arrives
    unmoved, but for crew's `new-territory`, which is read as a join
    into a proposed item named for the move's target (millpond 63). An
    imported join makes the item it names, or grows it, as a proposed
    item with no brief. A reason or note the body gave with any move is
    kept with the move as its note, as read, so nothing a curator wrote
    is lost; a drop's reason is its consequence (30) and its note at
    once.
40. Every record names its format and the format's major, and a reader
    of a later major reads every earlier one as it stands. A reader
    never writes a record in a format it did not read.
41. A capture, a signal and a move never change once written. What
    changes is added: a replacement beside the move it replaces, a
    send's outcome beside the send. An item's brief alone is rewritten
    in place.
42. Each capture lies in exactly one place in its inbox, fixed by its
    key alone, with its own signal and its reading beside it. Moves,
    batches and items lie apart from captures, where no key can reach
    (4). Two writers of one key, or one name, meet at one place.
43. An inbox is read whole from one tip (46), and every record in it
    stands in the layout. A host keeps nothing of an inbox that the
    layout does not place.

### A.7 Writing a shared branch

44. A write is formed against one tip, the one its writer read, and
    lands only when the branch still stands at that tip. A branch that
    has moved refuses it, and the write is applied again to the new
    tip, with every check made again there, a bounded number of times,
    and then reported refused, naming why. The writer sets the bound,
    five unless it says otherwise, and a write refused that many times
    is reported and never tried again on its own.
45. A write is all or nothing. The branch moves from one tip to the next
    by exactly one write, and no two writes both move it from one tip.
46. Every check a write rests on is made against the tip it lands on,
    never against an earlier read. Two writers of one record meet at
    that check on the new tip, which refuses the second.
47. A write is formed from the tip's content and the records it adds or
    replaces, and touches no working copy. Nothing on the writer's
    machine stands for the branch.
48. A branch kept on one machine with no remote takes the same write,
    its tip moved from the expected old value, and refuses one formed
    against a tip it has left.
49. A lock keeps one machine's writers in turn and does nothing more.
    It never stands in for the check at the tip (44). It names its
    holder and when it was taken, and a stale one is broken by the
    operator, or by a writer once it is older than the keeper allows.
50. Every write names what it did and who asked for it.

### A.8 Kinds

51. A kind is a simple kind or a statechart kind, with a version. A
    simple kind is an ordered list of one or more stages, or, where it
    lands, of none: every stage but a conversation has exactly one
    deliverable, and a conversation has none. A kind that lands with no
    stages runs no agent: what its places do is its reader's rule (58).
    A statechart kind is a statechart (94).
52. A simple kind's declaration holds its version, its stages in order,
    how its places' branches are named, whether its first stage starts
    in a place that could not be made ready, and whether it lands. A
    kind that lands with stages names the stage a failed submission
    sends a place back to, and how many times a place may go back before
    it waits on its caller. A kind that lands with no stages may name its landing fix, the kind a place runs when the merge queue sends its branch back, by that kind's identity with its version, and how many landing fixes it runs before its place waits on its caller. (weir record 0005, the user's, 2026-11-07.) It may hold settings for every stage's
    agents, which a stage's own settings come before.
53. The declaration of a simple kind's stage holds its name, its prompt,
    and its deliverable or that it is a conversation. It may hold its
    standing instructions, text every agent of the stage starts with
    alike, its agents with their settings, whether it waits on its
    caller's word, how long its agent may be quiet before the stage is
    stuck, what it makes besides its deliverable, each a non-empty name,
    and whether it repeats per task group, worked one group of its
    change's tasks at a time.
54. A deliverable is one of seven forms: commits; a change written;
    tasks ticked; a change archived; a report at a path; a committed
    report at a path; a plan, which an agent puts for review from its
    program's planning mode. The format spells each one way.
55. An elaboration kind is a kind with an elaboration section, which
    declares the inputs a round is handed beyond its opener's, the
    sections a conclusion adds, how a round ends, whether earlier
    soundings' transcripts are handed, and what lands. Whoever runs
    places reads the kind's stages and nothing of the section; whoever
    runs elaborations reads both.
56. A declaration may hold a section its reader does not know, and the
    reader ignores it. A reader never fails on a section it does not
    know, and never changes a declaration.
57. A declaration is checked whole: a simple kind with no stage that
    does not land, a stage with no name or prompt, a field of the wrong
    shape, a deliverable not of the seven, or a stage that repeats per
    task group and does not deliver tasks ticked, is refused naming the
    field. A statechart kind is checked as 95 says. A version left out
    reads as the first. A kind that lands with no stages declares them
    as none, `stages = []`, and names no stage a failed submission sends
    a place back to. A kind with stages that names a landing fix, or how many it runs, is refused naming the field, and so is a landing fix named by anything but an identity with its version. (weir record 0005, the user's, 2026-11-07.) A kind's table that holds settings for its agents
    and leaves its stages out declares no kind: it is read as settings
    given to a kind declared elsewhere under that name, for every stage or
    for stages it names, and is never refused as a kind with no stage.
58. The same declaration always reads the same, and reading it changes
    nothing. Which declaration a name resolves to, among a tool's own,
    a repository's, a launch's and the packages a reader holds, and how
    settings given to a kind declared elsewhere join that kind's own,
    are the reader's rule, never the format's.
88. A kind is named by its identity: its source, its name and its
    version. Within one source a name and a version name one kind, and
    one source may hold several versions of a name. A declaration holds
    one version of each name it declares; versions side by side are in
    packages, one each.
89. A package holds the declaration of exactly one kind and every part
    that declaration names, its prompts and standing instructions, and
    nothing it names lies outside the package: no part outside it, and
    no other kind but the landing fix a kind names, an identity and no part of the package, so no
    stage extends, includes or hands over to another kind's. A package that declares no kind or more than one, or
    names a part outside itself, is refused naming the field. A package held under an identity whose
    name or version is not its declaration's is refused naming both.
    (The landing fix by weir record 0005, the user's, 2026-11-07.)
90. A package's content hash is the family's content hash over every
    part of the package, each with where it lies within the package, so
    the same package hashes the same on every machine, wherever the
    package lies and whenever its parts were written.
91. A lock records kinds by identity, each with its content hash. It
    holds an identity at most once. A reader runs a kind from outside,
    of any source but its own tool's, a repository's own and a launch's,
    only where a lock records it, and refuses one whose content hash is
    not the lock's, naming the kind and both hashes. Reading a lock
    changes nothing, and which locks a reader reads, and how it chooses
    among versions, are the reader's rule.
94. A statechart kind's declaration holds its version, its label, the
    words a person reads for it, and its statechart: one or more
    regions side by side, each with its initial state and its states.
    It may hold how its places' branches are named, as a simple kind's
    does (52). A state may be final. It may carry a decision, with the
    answers it takes and what it shows a person. It may hold regions of
    its own, or run a template or another statechart inside it with
    the parameters it gives, and name the state its enter moves that
    statechart to. It may name the effects performed on entering it and
    on leaving it. Its transitions out are in priority order, each with
    its guard, the state it goes to, the effects it performs, a counter
    it bumps and the states its enter moves. A guard combines, by all,
    any and not: an evidence compared with a value, with a list, with
    its existence, by order, by age or with another evidence; a response
    that answers a decision; a final state of a statechart its state
    runs; a sibling region's state; its owner's state or its children's;
    and always. An effect is an atom with its arguments. A state that
    runs the stage template gives the stage's parameters. Its agents are
    a list of entries each with its settings, or a rule its reader
    resolves against the place, and its join is all, any or a count. It names the stage a send-back returns to, and how many times before the work waits on its caller. A statechart kind that lands may name its landing fix and how many it runs, as a simple kind with no stages may (52): when the merge queue sends its branch back, its conflict with its base or a check of the base failing on it, the fix runs as a place of that kind, and the statechart itself never runs again for it. Its own states, a verify and what follows it among them, keep their own transitions, which the landing fix touches nothing of. (weir record 0005, the user's, 2026-11-07.) Its deliverables are each one of the
    seven (54). A kind's table says its format by what it holds: stages for a
    simple kind, regions for a statechart kind.
95. A statechart kind is checked whole: a table that holds both stages
    and regions, a region with no states or whose initial state it does
    not hold, a transition to a state its region does not hold, a guard
    of a form 94 does not name, a join that is not all, any or a count,
    a deliverable not of the seven, or a field of the wrong shape, is
    refused naming the field (57). Which templates and atoms there are,
    and whether a kind names only those its reader binds, are the
    reader's to say (58).

### A.9 Cadence

59. A thing is due when a time its schedule names has come since its
    last run, or when it has never run. Cadence reads a schedule, the
    last run and now, and nothing else, so two machines given the same
    three agree.
60. A run missed while a machine slept is caught up once, however many
    times its schedule named meanwhile.

### A.10 The built-in adapters

61. The folder drop offers one capture per file in a folder, keyed by
    the folder and the file's content, so a file dropped twice, or
    under another name, is one capture. Its event time is the date the
    file's name begins with, or else the file's last write, and it
    carries no own excerpt.
62. The meeting file offers one capture per meeting file, with the
    transcript as its raw material and no own excerpt.
63. The signals-folder import is no adapter: an offer carries one own
    excerpt and nothing a host must read beyond the contract (2), while
    an imported capture carries its pointer, several signals and their
    moves as they stand in the body (37 to 39). The import reads a body
    into import lines, one per capture, each holding the capture as an
    offer would, the pointer it was held under, its signals as read and
    its moves as read, and a host's import operation (75a) writes them
    as 37 to 39 say, holding each by key like any other, writing no
    pointer of its own, checking no excerpt and banking nothing.
64. The folder drop and the meeting file speak the contract as any
    adapter does (1 to 12), and a host runs them as it runs any other;
    the import speaks its own shape (63), read by the import operation
    alone, and never through take (75).

### A.11 The conformance pack

65. The pack holds cases of three kinds: for a host, lines in and the
    records, refusals, held counts and run status the host must write
    from them; for an adapter, the checks its lines must pass; for a
    deliverer's store, its starting records, one call of B.7, and the
    records, the answer or the refusal that must come of it. A host,
    adapter or store that fails one case does not keep the contract.
66. The pack holds the meeting checks: an adapter is a meeting adapter
    when every capture it offers carries a key by its service and the
    meeting's own identity, the meeting's start as its event time, the
    transcript as served and a plain copy as raw material, and no own
    excerpt, when it states the meeting's length and attendees where
    its service gives them (118), and when it leaves out a meeting too
    short to hold anything and counts it in the completion.
67. Every case cites the clauses it exercises, and the pack's check
    fails when a cited number names no clause, or a clause of A.1 to
    A.10, of A.13, of A.14 or 71 is cited by no case. The pack's own clauses, 65, 67 and
    68, are proved by the check's own tests (S15, S16), and what weir
    never does, 69 and 70, by weir's rules, which no case can exercise;
    the check counts neither.
68. The pack runs with no source, no network and no machine but the one
    it runs on, from fixed inputs, and gives the same verdict
    everywhere.

### A.12 What weir never does

69. weir keeps no state, runs no process of its own, and knows no
    machine, host, tool or inbox. Everything it does is a function of
    its inputs, or a write it was asked to make. A child it runs and
    waits on for that write, git for a branch's write (C.3), is no
    process of its own: it ends with the call, and nothing of weir
    outlives a call. A try of a call weir makes to a remote waits on
    the remote no longer than the family's limit for a try, and is
    then ended with everything it started, the call failing and naming
    the call, the remote and the limit, so a remote that never answers
    holds no writer longer than that (C.3).
70. weir never lists a source, never judges what a capture or a
    delivery's message says, never chooses a move, a rule's being its
    keeper's (125), never hands a delivery over or confirms one, never
    starts an agent, never submits and never lands work.
71. No record weir defines holds a secret, and nothing weir writes
    includes one.

### A.13 The engine

96. The engine ticks a statechart. Given a statechart kind's statechart,
    the templates it runs, one object's state of it and one snapshot of
    its evidence, a tick gives the transitions that fire, the effects to
    perform and the object's next state. Every guard of one tick reads
    that one snapshot. In each region, innermost first, the first
    transition out of its state whose guard holds fires, at most one per
    region. Its siblings, and the statecharts that run it or that it
    runs, see a region's move at the next tick, never within the same
    one. Firing runs the left state's exit effects, the transition's
    effects and the entered state's entry effects, each only while its
    proof is absent. It bumps the counter the transition names, records
    when each region entered its state, and moves a statechart the
    target runs to the state its enter names.
97. A state that runs a template or another statechart starts it afresh
    each time the state is entered, and sets the earlier one aside
    under its attempt, where it stays readable. The statechart that runs
    it reads it only by its final states and moves it only by an enter.
    A response is applied once: the object records the response a guard
    consumed, and a guard on a response never holds for one it already
    applied. A decision is derived from the state that carries it while
    that state is active, and from nothing else.
98. The engine names no reader's object or atom. An evidence and an
    effect are names its reader binds and the engine never interprets,
    and its own tests run a toy statechart that shares no atom with any
    reader's. It holds no store and performs nothing: the snapshot is
    its caller's reading, and an effect is a name with arguments its
    caller performs. The same statechart, state and snapshot always give
    the same tick, and ticking changes nothing (69).

### A.14 Deliveries

100. A delivery is one message a deliverer owes one or more readers. It
     is recorded once, under a key its deliverer gives, with the
     message, each of its readers, when it was recorded and its expiry,
     and each of its records names its format, as every record does
     (40). A delivery is recorded only with a key, a message and at
     least one reader, no reader named twice; any other is refused,
     naming what it lacks. A delivery never changes once recorded.
101. A store holds at most one delivery per key. Recording under a key
     the store holds writes nothing, and the delivery first recorded
     stands, whatever the later one carries.
102. A delivery stands owed to each of its readers until that reader
     confirms it, naming its key. A confirmation names the delivery's
     key, the reader and when, and is refused when the store holds no
     delivery under the key, or the reader is not one of the delivery's
     readers, naming which. A reader that confirms a delivery it has
     confirmed writes nothing, and is told when it first did.
103. A hand-over of a delivery to one of its readers names the reader,
     the way, as its deliverer names it, and when, and confirms nothing.
     A reader that confirms on receipt says so in the call that hands
     the delivery over, and the hand-over and the confirmation are
     written together. A delivery is never handed to a reader that has
     confirmed it, or to one that is not among its readers.
104. A delivery's expiry is the time it was recorded and the span its
     deliverer sets, fixed when it is recorded. At its expiry, a
     delivery a reader has not confirmed is expired for that reader: it
     is shown, with its reader, wherever its deliverer shows what that
     reader is owed, and stays shown until the reader confirms it.
     Nothing expires out of a store, and a reader confirms an expired
     delivery as it confirms an owed one.
105. What a reader is owed is read from a store's records and a time:
     every delivery naming the reader that it has not confirmed, each
     owed or expired, in the order recorded, with each hand-over of it
     to that reader. Nothing a reader has not confirmed is left out.
106. A reader is named as its deliverer names it, and a name is known
     once a reader has confirmed under it. What a reader is owed says
     whether its name is known, so a name no reader has ever confirmed
     under is shown as such. A name stays known after the deliveries
     confirmed under it are let go of.
107. A delivery is done once every one of its readers has confirmed it.
     A deliverer may let go of a done delivery, with its hand-overs and
     its confirmations, and lets go of no other.

### A.15 Links

114. Every step of a chain has a link, which the tool that took the step
     signs in its own identity. A link names what its step made and the
     step before it, each by content hash. Read link by link, a
     published version traces back to the signal behind it
     (agentplot/strategy decision #46, accepted by the user on
     2026-11-11).
115. A verifier checks a chain from its links and the records they name,
     and calls no service: each link's signature against the signers it
     is given, and each content hash against what it names
     (agentplot/strategy decision #46, accepted by the user on
     2026-11-11).
116. The tool that took a step makes its link, and the link is the same
     whoever decided the step: the person in their own session, or
     another deciding for them (agentplot/strategy decision #46,
     accepted by the user on 2026-11-11).

### A.16 Facts

117. A fact is a name with one value or several, each a text, a
     number, true or false, or a date. A signal carries facts of three
     sorts: stated, which its capture's offer carries from the source;
     joined, which a host joins from its people list; and read, which
     its capture's reader gives it and a host checks. A rule reads a
     capture's source, title and event time as facts its source stated,
     under their own names (the update-ladder talk, 2026-11-12).
118. A source states only what it holds of an event, without reading
     what the event says: no stated fact is a model's reading or a
     judgment. A source names the facts it states, but for a meeting's,
     which weir names with the facts a host joins and a reader reads, so
     every meeting adapter, every host and every reader meet in one set.
     A meeting's stated facts are its length and its attendees, each
     attendee as its service gives them, with an address where the
     service gives one, beside its title and its start (the
     update-ladder talk, 2026-11-12).
119. A host joins facts from the people list it is given: each person
     with their addresses, the names a transcript may give them, their
     role and their teams, and each org with the domains of its
     addresses and whether it is a client. An attendee joins the person
     whose addresses hold its address, and the org whose domains hold
     that address's domain. A speaker joins the person whose names hold
     the name its reading gives, and the org whose domains hold one of
     that person's addresses. An address or a name two persons hold
     joins neither. A joined fact names whom it is of, an attendee or a
     speaker, and gives the joined person's name, role or teams, the
     joined org, or whether that org is a client, so who is an executive
     or a client is looked up and never read (the update-ladder talk,
     2026-11-12).
120. A reader may give each signal it writes read facts, each picked
     from a closed list: what the signal says, one of decision, request,
     action, risk and question; who said it, a name that stands in the
     capture's raw material; what it is about, among the teams and
     repositories the people list gives; an owner, a person of the
     people list or a name that stands in the raw material; and the
     date it is due, a date. A host takes a read fact only where its
     value is on its list, leaves off every other, naming each to the
     reader, and takes the signal with the rest, its words standing for
     curation. A fact left off never refuses a reading (28) (the
     update-ladder talk, 2026-11-12).
121. A host writes the stated facts with their capture (16) and the read
     facts it took with their signal (27), and writes no joined fact: it
     joins them from its people list as the list stands each time a
     rule reads a signal or a capture (125) (the update-ladder talk,
     2026-11-12).

### A.17 The policy

122. A policy is a keeper's rules for one inbox, in order. A rule has a
     name no other rule of its policy has, a match (123), and one
     outcome of three: a kind to launch, named as a launch names it,
     with the repository it launches in; a person's turn; or a
     drop, with its reason. A rule that launches or gives a person's
     turn has a priority, one of the five levels, and may have a window
     (129). A policy is checked whole, and one that breaks this clause
     or 123 is refused, naming the field (the update-ladder talk,
     2026-11-12).
123. A rule's match combines, by all, any and not, a fact compared with
     a value, with a list, with its existence or with a text its value
     holds, and a capture's age compared with a span. A fact of several
     values holds a comparison when any of its values holds it. A rule
     reads facts alone, never a signal's excerpt, its other words or its
     capture's raw material, so a host that runs a policy still judges
     nothing a capture says (70) (the update-ladder talk, 2026-11-12).
124. A rule's outcome, priority and window are its keeper's, and no fact
     sets them. A fact a source states of its own priority is one a
     rule matches like any other (the update-ladder talk, 2026-11-12).
125. Reading a policy for a signal gives the first rule, in the
     policy's order, whose match holds over the signal's stated, joined
     and read facts at the time it is read, or none. Reading it for a
     capture as the capture lands passes over every rule that names a
     read fact, or a fact joined from one, and gives the first of the
     others whose match holds over the capture's stated facts and those
     joined from them, or none. The same policy, people list, facts and
     time always give the same rule, and reading changes nothing (the
     update-ladder talk, 2026-11-12).
126. A host that keeps a policy reads it for the own signal of each
     offer that carried an own excerpt, in its capture's write; for each
     capture with no own excerpt, as it lands; and for each signal of a
     reading, in the reading's write. It writes the move of the rule it
     gives in that same write (128). A signal no rule matches stays
     unmoved, for curation (33), and no rule reads an imported signal
     (37) (the update-ladder talk, 2026-11-12).
127. A capture with no own excerpt that a rule matches as it lands is
     its own signal (19). The host writes that signal in the capture's
     write: its excerpt and what it asserts are the capture's title as
     offered, or its key where the offer gave none; the capture's
     source is who asserted it; and it has no nature, subjects or
     argument. No reader reads the capture, so a drop there spends no
     reading (the update-ladder talk, 2026-11-12).
128. A rule's move is a join, for a rule that launches or gives a
     person's turn, or a drop with the rule's reason (30). A join goes
     into the rule's current item, the item it made whose window has not
     closed, or makes one where the rule has none. The move names its
     rule as who made it (31), stands once written, and is in no batch
     (32). A rule's item names its rule and its priority, takes a name
     made of the rule's and its window's close, or its making where the
     rule has no window (35), and records when its window closed, after
     which it takes no more of its rule's joins (the update-ladder talk,
     2026-11-12).
129. A rule's window is a schedule. The rule's current item is due to
     close when a time its window names has come since the item was
     made, and the item of a rule with no window is due at once.
     Cadence reads a window as it reads any schedule, with the item's
     making in place of a last run (59), so a window missed while a
     machine slept closes once (60) (the update-ladder talk,
     2026-11-12).

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The adapter

72. **describe**: given an adapter, its declaration (11).
73. **run**: given an adapter's configuration, its secrets, an empty raw
    place and a cursor or none, the lines the adapter makes, in order;
    whether it reported success; and the last of what it reported when
    it failed (1, 9).
74. The guarantee: one event gets one key on every machine and every
    run (3), and one event that fails never stops the others (10).

### B.2 The host

75. **take**: given lines and the raw place they name, the captures
    taken, held and refused, each refusal with its reason, and the
    records written (13 to 23).
75a. **import**: given import lines (63), the captures written with
    their pointers, signals and moves as read, those held by key passed
    over and counted, and each refusal with its reason (37 to 39); a
    line whose capture names no key, or a move of another word, is
    refused or arrives unmoved as 39 says.
76. **report**: given a run, what it took, held and refused, its
    completion and its cursor (23).
77. The guarantee: the host writes what Part A says of every line, and
    nothing a line did not carry (24); it passes the pack (65).

### B.3 The shared branch's keeper

78. **read**: given a branch, its tip and the content at it.
79. **move**: given a branch, the tip it was read at and the next tip,
    the branch moved; or a refusal, when the branch no longer stands at
    the tip read (44).
80. The guarantee: of writes that move a branch from one tip, exactly
    one succeeds, whichever machines make them (45); and a tip once
    read can be read whole.

### B.4 The kind's reader

81. **read-kinds**: given a declaration, every kind it declares, a
    simple kind with its stages and a statechart kind with its
    statechart, each with its sections; or that it could not be read,
    with the field named (57, 95).
82. The guarantee: the same declaration gives the same kinds, reading
    changes nothing (58), and a section the reader does not know is
    returned unread and unrefused (56).
92. **read-package**: given a package and the identity it is held at,
    its one kind and its content hash; or that it could not be read,
    with the field named (89, 90).
93. **read-lock**: given a lock, every identity it records with its
    hash; or that it could not be read, with the field named (91). The
    guarantee of both: the same input gives the same answer, and reading
    changes nothing.
99. **tick**: given a statechart kind's statechart with the templates
    it runs, an object's state of it and a snapshot of its evidence, the
    transitions that fire, the effects to perform and the object's next
    state (96, 97). The guarantee: the same input always gives the same
    answer, and ticking changes nothing (98).

### B.5 The clock

83. **now**: the present time on the machine.
84. **last-run**: given a thing with a schedule, when it last ran, or
    that it never has; for a rule's window, when its current item was
    made (129).
85. The guarantee: cadence asks the clock for these two and nothing
    else (59).

### B.6 Binding the contracts

86. Each seam is bound by naming one or more profiles of Part C. A
    host binds one branch keeper per inbox and any number of adapters;
    a kind's reader binds the one format; cadence binds one clock; a
    deliverer binds a store of its own and the records' one profile.
87. The pack holds every profile to Parts A and B, every host as a
    host, every adapter as an adapter and every deliverer's store as a
    store (65). A profile, host, adapter or store that fails it is not
    one.

### B.7 Deliveries

108. **record**: given a store's records, a key, a message, its readers,
     when, and the span its deliverer sets, the delivery's record to
     add; or that the key is held, with the delivery that stands; or a
     refusal naming the field (100, 101, 104).
109. **hand**: given a store's records, a key, a reader, the way, when,
     and whether the reader confirms on receipt, the records to add; or
     that the reader has confirmed it, and when; or a refusal naming the
     key, the reader or the way (102, 103).
110. **confirm**: given a store's records, a key, a reader and when, the
     records to add, the reader's name made known where it was not; or
     that the reader has confirmed it, and when; or a refusal naming the
     key or the reader (102, 106).
111. **owed**: given a store's records and a time, each reader with
     every delivery owed or expired to it, with its hand-overs, and
     whether its name is known; and every delivery done (104 to 107).
112. **read** and **add**, a deliverer's store's: read gives every record
     the store holds, in the order added; add holds the records it is
     given after the others, every one or none.
113. The guarantee: the same records, call and time always give the
     same answer, and answering changes nothing; a store reads back
     every record it added as it was given, and drops none but those of
     a done delivery let go of whole (107); every deliverer's store
     passes the pack (65, 87).

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile.

### C.1 The lines: JSON Lines on standard output

An adapter writes JSON Lines to standard output. Each line is one
object with exactly one of three keys (1):

```json
{"capture": {"key": "release/mise/2026.10.10", "source": "release", "event_at": "2026-10-10T14:02:11Z", "title": "mise 2026.10.10", "url": "https://github.com/jdx/mise/releases/tag/v2026.10.10", "raw": ["mise-2026.10.10/notes.md", "mise-2026.10.10/release.json"], "excerpt": {"text": "…the notes, whole…", "kind": "ask", "asserted_by": "jdx/mise", "assertion": "mise 2026.10.10 is released; the repository pins 2026.9.18.", "subjects": ["release", "mise"], "argues_with": ["packages/mise/default.nix"], "position": "release notes"}}}
{"cursor": "2026-10-17T04:30:05Z"}
{"done": {"listed": 14, "failed": [{"what": "github:jdx/mise", "why": "HTTP 502"}]}}
```

A `capture` object is an offer (2):

| field | required | meaning |
|---|---|---|
| `key` | yes | the key (3, 4). `/` separates its segments. A key never starts with `/`; a segment is never empty, `.` or `..`, and never the name of a file the layout places (`capture.rec`, `signals.rec` and the rest of C.2), since each segment is a folder; and the first segment is never `captures`, `moves` or `items`, so a key names nothing in the inbox but its own capture |
| `source` | yes | the source's name: `release`, `meeting`, `folder`, `deploy` |
| `event_at` | yes | the event time, in RFC 3339 with its offset (5) |
| `title` | no | one line a person reads in a list |
| `url` | no | where the event lives upstream |
| `raw` | no | the raw material, as paths relative to the raw place (6) |
| `excerpt` | no | present only for an own excerpt (7): `text`, verbatim and whole; `kind`, the nature, one of `constraint`, `ask`, `question`, `commitment`, `reaction`; `asserted_by`; `assertion`; `subjects`; `argues_with`; `position`. Each is present, and `subjects` and `argues_with` may be empty lists |
| `facts` | no | the facts its source states (118): an object of each fact's name and its value or a list of values, spelled as C.9 spells them |

A `cursor` object is a cursor (8). A `done` object is the completion
(9): `listed`, how many events the listing held, and `failed`, each
with `what` and `why`. Success is exit status 0 after a `done` line;
a run that exits otherwise, or without `done`, is incomplete, and says
why in one line on standard error.

The declaration (11) is a TOML table in the adapter's plugin, or built
into the host for a built-in adapter:

```toml
[adapter.wispr]
command = ["eddy", "capture", "wispr"]   # the host appends --raw-dir <dir> [--cursor <c>]
config = "config.schema.json"            # the shape of its configuration, a JSON Schema beside the declaration
secrets = ["WISPR_TOKEN"]                # placed in the run's environment under these names
```

| operation | how the lines satisfy it |
|---|---|
| describe | the declaration above (72) |
| run | `<command> --raw-dir <dir> [--cursor <c>]`, `<dir>` fresh for the run, the adapter's configuration in the file the `CAPTURE_CONFIG` environment variable names, and each declared secret in the environment under its declared name (73) |

An import line is a fourth kind, written only by `weir import` and read
only by a host's import operation (63, 75a), never by `take`:

```json
{"import": {"capture": {"key": "release/mise/2026.10.10", "source": "release", "event_at": "2026-10-10T14:02:11Z", "title": "mise 2026.10.10", "url": "…"}, "pointer": "mac-studio:~/.local/state/crew/…", "came_in": "import:crew-folders", "signals": [{"n": 1, "kind": "ask", "asserted_by": "…", "assertion": "…", "subjects": [], "argues_with": [], "excerpt": "…", "position": "…"}], "moves": [{"signal": 1, "move": "join", "target": "…", "note": "…", "by": "…", "at": "…"}]}}
```

`capture` is an offer's object without `raw` and `excerpt`; `pointer`
is kept as the body gave it or left out; `signals` are the body's, in
its order, numbered from 1; `moves` name a signal by number and carry
the six words' consequences and, where the body gave one, a `note` (39);
one of another word is carried as it stands for 39 to leave unmoved.

A host takes each line in seven steps, which the pack checks (75):

| step | what the host does | clauses |
|---|---|---|
| 1. check it | refuses a malformed line, a bad key, a missing field, an excerpt with no text or a fact C.9 does not spell, and names it in the run | 13, 15 |
| 2. look up the key | passes over a key the inbox holds, and counts it | 14 |
| 3. bank the raw files | on the machine, under the capture's name, byte for byte | 17, 18 |
| 4. write the capture | with a pointer `<machine>:<path>` when anything was banked | 16, 17, 22 |
| 5. write the own signal | cut at a line so the text and its closing line fit the limit; the closing line is `[cut: <n> lines and <b> bytes left out, banked whole with the capture]`, the one spelling every host writes (24); the whole text banked when cut; a limit too short to hold the closing line alone is refused. A host that keeps a policy reads it for the own signal, or for a capture with no excerpt, writes the own signal of 127 where a rule matches such a capture, and writes the rule's move in the same write | 19, 20, 21, 125 to 128 |
| 6. mark the capture unread | when it carries no excerpt and no rule matched it as it landed | 19 |
| 7. record the run | what it took, held and refused, the failures, the cursor, complete or not | 23 |

### C.2 The records: recutils under `inbox/`

An inbox is the `inbox/` tree at the root of a shared branch (43).
Records are recutils at rest, each naming its format as
`format: weir-<record>/<major>` (40), and JSON exists only in flight
(C.1). The layout (42):

```
inbox/
  captures/<key segments as nested folders>/
    capture.rec        # weir-capture/1: the capture, how it came in, its pointer
    signals.rec        # weir-signal/1: the own signal, or the reading, numbered from 1
  moves/
    moves.rec          # weir-move/1: every standing move and every replacement, appended
    batches/<batch>.rec   # weir-batch/1: a proposed batch, and whether it stands
  items/<name>/
    item.rec           # weir-item/1: the item, its signals' identities, its conclusion
    brief.md           # the brief, rewritten in place (41)
    sends.rec          # weir-send/1: each send, the brief as handed, and its outcome
```

A key's segments become folders under `captures/`, so each capture lies
in one place (42), and a key's first segment is never `captures`,
`moves` or `items` (C.1), so no key reaches the other roots. A signal's identity
is `<key>#<n>` (27). An item's name holds no `/` (35). The records'
fields:

| record | fields |
|---|---|
| `weir-capture/1` | `key`, `source`, `event_at`, `title`, `url`, `pointer` (`<machine>:<path>`), `came_in` (`run:<adapter>`, `intake`, or `import:<body>`), `machine`, `taken_at`, `unread`, `fact` (each stated fact, C.9) |
| `weir-signal/1` | `signal` (`<key>#<n>`), `kind` (the nature; left out of an own signal a rule made, 127), `asserted_by`, `assertion`, `subjects`, `argues_with`, `excerpt`, `position` (`title` for an own signal a rule made), `cut` (the lines and bytes left out, where cut), `fact` (each read fact taken, C.9) |
| `weir-move/1` | `signal`, `move` (one of the six), `target` (the consequence: a reason, a claim or record, an item, a chore or an ask), `note` (a reason or note given with the move, as read; a drop's reason again), `by` (`rule:<name>` for a rule's move, 128), `at`, `batch`, `replaces` |
| `weir-batch/1` | `batch`, `proposed_by`, `proposed_at`, `stands` (and who accepted it, when) |
| `weir-item/1` | `item`, `made_by` (a join, or a conclusion), `conclusion`, `named_by`, `named_at`; for a rule's item, `rule`, `priority` (its level's word) and `closed_at` (when its window closed, added then) (128) |
| `weir-send/1` | `item`, `target` (a repository and kind, a planner, or an inquiry), `brief` (as handed), `sent_at`, `outcome` (a landing, a conclusion, abandoned, or open) |

Every record of one capture is written in one write (19), and every
file a write changes passes `recfix` and the checks of A.6 before it
lands (46).

### C.3 The shared branch: git

A shared branch is a branch of a git repository, on a remote or on one
machine alone. A writer keeps a bare cache of the repository on its
machine, `$XDG_CACHE_HOME/<tool>/git/`, and no checkout. Every write
takes five steps:

| step | what the writer does | clauses |
|---|---|---|
| 1. fetch | fetches the branch's tip into the bare cache; the tip's commit is the version read | 78 |
| 2. apply and check | applies the write to that tip's tree, and checks every file it changed with `recfix` and the records' checks: a held key, a second reading, a second standing move, a used item name | 46 |
| 3. commit | commits the write as one commit through a temporary index, touching no working tree, with a message naming the write and who asked for it | 47, 50 |
| 4. push | pushes without force, with the tip read as the expected old value (`--force-with-lease=<branch>:<old>`) | 44, 79 |
| 5. replay | when the push is refused, applies the write again to the new tip from step 2 and pushes again, a bounded number of times, then reports the write refused | 44 |

A branch with no remote takes the same steps, step 4 an
`update-ref` of the branch from the expected old value (48). A lock in
the bare cache's git directory keeps one machine's writers in turn and
nothing more, never standing in for step 4 (49). It names its holder
and when it was taken; the operator breaks a stale one, or a writer
does once it is older than the keeper allows. crew keeps a twin of
these steps in Python, and the pack's cases for the protocol hold both.

Each git call of these steps that reaches the remote is one try: the
fetch of step 1, the listing that says whether a branch not fetched
exists, and the push of step 4. A try runs in a process group of its
own and ends at thirty seconds, the family's limit for a try of a call
to a remote (agentplot/sluice record 0109). At the limit its group is
asked to end, given two seconds, then killed, so git's remote helper
ends with it (69). A stopped try fails as `git <fetch|ls-remote|push>
with <remote> was still going after 30s, the most a try may take, and
was stopped`, after git's last line on standard error where it wrote
one. A stopped fetch or listing fails the read. A stopped push fails
the write and is no refusal, so it is not replayed (step 5). Whether
it landed is read at the next write's fetch, where every check is made
again (46). No setting of a writer's changes the limit. `weir-bounded`
holds it, the group's ending and the words.

### C.4 Kinds: TOML

A declaration is TOML, and every reader of kinds reads this format and
no other (51 to 58). A tool's own is built in; a repository's is
`.config/<tool>.toml` at the revision the reader names; a launch's is a
file the launch names.

```toml
[kinds.bump]
version = 2               # 1 when omitted (57)
branch = "bump"           # the prefix of its places' branches; the kind's name when omitted (52)
starts_unready = false    # whether its first stage starts in a place that could not be made ready
lands = true              # whether the work is submitted after the last stage

[kinds.bump.agents]       # settings for every stage's agents; a stage's own come first (52)
model = "sonnet"
mode = "edits"            # how far the agent may act without asking, one word or a table of programs, as `{ claude = "auto" }`; the reader's to check
effort = "high"           # how hard the agent's model works on each turn, its program's own word or a table of programs; the reader's to check
programs = { claude = { file = "claude-bump.json", settings = { tui = "fullscreen" } } }   # each program's own settings, a file beside the declaration and keys in the program's own words; the reader's to check

[kinds.fix.agents]        # settings for a kind of that name declared elsewhere, a tool's own fix among them (57)
model = "opus"

[kinds.train]             # a kind that lands with no stages: its places run no agent (51)
branch = "train"
lands = true
stages = []               # none, declared so; a table that leaves stages out gives settings (57)
landing_fix = "flume/fix@1"   # the kind run when the merge queue sends the branch back, an identity with its version; refused on a simple kind with stages (52, 57, 89, 94)
max_landing_fixes = 2         # how many landing fixes before its place waits on its caller; refused on a simple kind with stages (52, 57, 94)

[kinds.fix.agents.stages.code]   # settings for one of its stages
instructions = "Keep each commit to one fix."

[[kinds.bump.stages]]
name = "code"
prompt = "prompts/bump-code.md"                   # relative to the declaration's file
standing = "prompts/bump-code-standing.md"        # its standing instructions, relative to the declaration's file; none when omitted (53)
deliverables = ["commits"]                        # exactly one, spelled as below (54)
agents = [{ program = "claude", model = "opus" }] # with their settings (53)
quiet = "45m"                                     # how long the agent may be quiet: a whole number of s, m or h (57)
makes = ["preview"]                               # what the stage makes besides its deliverable, non-empty names; none when omitted (53)

[[kinds.bump.stages]]
name = "build"
prompt = "prompts/bump-build.md"
deliverables = ["tasks"]
repeat = "per-task-group"                         # worked one task group at a time; only on a stage delivering tasks; none when omitted (53, 57)

[[kinds.bump.stages]]
name = "review"
prompt = "prompts/bump-review.md"
conversation = true       # no deliverable (51)
wait = true               # waits on its caller's word (53)
agents = [{ beside = "operator" }]
on_fail = "code"          # the stage a failed submission sends the place back to (52)
max_send_backs = 3        # how many times before the place waits on its caller (52)

[kinds.writeback.elaboration]   # an elaboration kind's section (55)
inputs = ["books/outline.md"]
conclusion = ["what changes"]
ending = "self-closing"         # or "standing", "with-operator"
transcripts = false
lands = ["books/", "design/"]
```

| deliverable (54) | spelled in `deliverables` |
|---|---|
| commits | `commits` |
| a change written | `change` |
| tasks ticked | `tasks` |
| a change archived | `archived` |
| a report | `report:<path>` |
| a committed report | `committed:<path>` |
| a plan | `plan` |

`read-kinds` (81) returns every kind with its stages and every section
as read; a reader keeps the sections it knows. A table or field the
format does not name is a section the reader ignores (56). The format
refuses two stages of one kind sharing a name, and an `on_fail` naming
no stage of its kind, naming the field (57). The format gives no default
for `quiet`, `on_fail`, `max_send_backs`, `landing_fix`, `max_landing_fixes` or an elaboration's `ending`: a field left out is returned left out, and what
it means is the reader's rule (58), since readers differ. `landing_fix` is returned as written, an identity and no part of the package, which the reader resolves (89), and one that is no identity with its version is refused naming the field (57). (`landing_fix` and `max_landing_fixes` by weir record 0005, the user's, 2026-11-07.)
`repeat` takes the one value `per-task-group`, and the format refuses
any other, or the field on a stage whose deliverable is not `tasks`,
naming the field (57); how a reader works a repetition is its own rule
(58).
`standing` is a path as `prompt` is, and `read-kinds` returns it as
written; how a reader sends the text, and whether it fills anything in
it, are the reader's (58).

An identity is written `<source>/<name>@<version>`, as `flume/change@2`
or `acme/review@1`: the source and the name each one or more ASCII
letters, digits, `_` and `-`, so TOML writes each as a bare key, and
the version a whole number of at least 1, in decimal digits with no
leading zero (88). `read-kinds` refuses a kind's table, or a table of
settings, under any other key, naming it (57), so every kind it reads
has an identity. A kind may be named with its source or its version
left out, as `review`, `review@2` or `acme/review`: weir-kinds reads
such a name into its parts and spells an identity back, and what a
name with a part left out names is the reader's rule (58). A tool's own
source is the tool's name, a repository's own `repo` and a launch's
`launch`, and no source from outside takes one of these. A package is a
directory whose `kind.toml` at its root is a declaration of one kind,
every `prompt` and `standing` path in it relative to that file, with no
`..` segment and no absolute path, and naming a regular file of the
package (89). A `kind.toml` that gives settings to a kind it does not
declare names another kind, and is refused naming the table (89). A
package holds no symbolic link, to a file inside it or out, and one
that does is refused naming the link's file (89); the path to the
package is its reader's, and may pass through links. A part may name
another by a relative path, as a Markdown link does: weir parses no
part but `kind.toml`, and every part lies inside the package and its
hash. A package's content hash is `sha256:` and the lowercase hex
sha256 of the concatenation, in byte order of the paths, of each
regular file's path relative to the root, a NUL byte, its length in
decimal, a NUL byte and its bytes (90). A lock is TOML, an array of
`kinds` tables, each with `kind`, an identity, and `hash`, a content
hash; a repository's is `.config/<tool>.lock` beside its declaration
(91). weir-kinds spells a lock in this form, its entries in order of
source, name and version, and `read-lock` reads the spelling back as it
was; the reader writes the file (91):

```toml
[[kinds]]
kind = "acme/review@1"
hash = "sha256:4e07…"
```

A kind's `agents` table holds settings as written, and each
`agents.stages.<stage>` table settings for that stage, as written; `read-kinds` returns
them with the kind (52). A `[kinds.<kind>]` table holding `agents` and
nothing the format names besides is returned apart from the kinds, as
settings given to that name, and a declaration holding one is never
refused for it (57). Whether a stage it names exists, and which
declaration it joins, are the reader's to say (58).

A statechart kind is a `[kinds.<kind>]` table that holds `regions` and
no `stages`; one that holds both is refused naming the field (94, 95).
Its fields are the engine's own names. So the engine's types define a
statechart's fields once, and `read-kinds` reads the table into them,
the kind's name and `version` as the statechart's own (81):

```toml
[kinds.persona]
version = 1
label = "Persona test"    # the words a person reads for the kind (94)
branch = "persona"        # as a simple kind's (52)

[kinds.persona.regions.stages]
initial = "build"         # one of the region's states (95)

[kinds.persona.regions.stages.states.build]
machine = "stage"         # the template or statechart the state runs, by name (94)
params = { agents = [{ model = "opus" }], join = "all", on_fail = "build", max_send_backs = 2, deliverables = ["commits"] }
transitions = [           # in priority order (96)
  { when = { final = "passed" }, to = "test" },
  { when = { final = "stopped" }, to = "stopped" },
]

[kinds.persona.regions.stages.states.test]
machine = "stage"
params = { agents = { rule = "every-persona-definition", pattern = "personas/*.md" }, join = "all", on_fail = "build", max_send_backs = 2, deliverables = ["committed:tests/personas.md"] }
transitions = [
  { when = { final = "passed" }, to = "passed" },
  { when = { final = "sent-back" }, to = "build" },
  { when = { final = "stopped" }, to = "stopped" },
]

[kinds.persona.regions.stages.states.passed]
final = true

[kinds.persona.regions.stages.states.stopped]
decision = { kind = "stalled", answers = ["retry", "drop"] }   # a decision while the state is active (97)
transitions = [
  { when = { response = "retry" }, to = "build" },
  { when = { response = "drop" }, to = "dropped" },
]

[kinds.persona.regions.stages.states.dropped]
final = true
```

A region is `regions.<region>`, with `initial` and its
`states.<state>`. A state may hold `final`, `decision`, `entry` and
`exit`, `machine` with its `params` and `enter`, `regions` of its own,
and `transitions`, each with `when`, `to`, `effects`, `bump` and
`enter` (94). `when` is a guard, one of:

- `{ all = [...] }`, `{ any = [...] }` and `{ not = ... }`;
- `{ ev = "<atom>", is = <value> }`, or with `in`, `exists`, `gt`,
  `gte`, `lt`, `lte` or `older`, a duration, in place of `is`, or
  with `eq_ev`, `ne_ev`, `gt_ev`, `gte_ev` or `lt_ev`, naming another
  evidence;
- `{ response = "<answer>" }`;
- `{ final = "<state>" }`, `<region>.<state>` where the state runs more
  than one statechart;
- `{ region = { name = "<region>", in = [...] } }`, the name a dotted
  path where the region lies in a statechart a sibling runs;
- `{ parent = { in = [...] } }` and `{ children = { kind = "<kind>",
  all = [...] } }`, or with `any`, `none` or `count_gte`;
- `{ always = true }`.

An effect is `{ do = "<atom>", args = { ... } }`, in a state's `entry`
or `exit` or a transition's `effects`. A decision is `{ kind, answers,
shows }`, its answers the words a response gives. The stage template's
`params` are these. `agents` is a list of entries with their settings,
as a simple stage's `agents` are, or `{ rule, pattern }`, a rule the
reader resolves against the place. `join` is `all`, `any` or
`count:<n>`. `on_fail` and `max_send_backs` are as on a simple kind's
last stage (52), and each of `deliverables` is spelled as the table
above spells it (54).
`doc` and `note` are words for a person, and change nothing. Which
names `machine`, `ev` and `do` may give, and what each means, are the
reader's (95, 98).

### C.5 Cadence: five-field cron

A schedule is five-field cron, read in the machine's local time, and
cadence says due when a time it names has come since the last run, or
there was none (59). A run missed while the machine slept is caught up
once (60). The clock is the machine's (83). A rule's window is
five-field cron read the same way, the time its current item was made
standing for the last run (129).

### C.6 The built-in adapters

| adapter | what it offers |
|---|---|
| the folder drop, `weir capture folder <dir>` | one capture per file; key `folder/<folder name>/<sha256 of the file>`; event time the date the file's name begins with, or else its last write; source `folder`; the file as raw; no excerpt (61) |
| the meeting file, `weir capture meeting <file>` | one capture per meeting file; key `meeting/file/<sha256 of the file>`; event time the meeting's start where the file says it, in a `start` or `date` field of its front matter, or else a date that opens its first line, or else as the folder drop; source `meeting`; the file as raw; no excerpt (62) |
| the signals-folder import, `weir import signals <dir>` | one import line (C.1) per capture of crew's folders on a partition's drive branch, a `capture.md` and one `NN-<slug>.md` per signal, with `moves.rec`: a release capture keeps `release/<name>/<version>`, every other takes its folder's name (38); the capture's pointer as crew gave it; its signals and moves as read, a move whose word is not one of the six carried for 39 to leave unmoved. A meeting corpus already read in a blueprints repository comes the same way: its captures and signals from the repository's own reading, its moves from the partition's drive branch's `moves.rec` where a move names the signal by its key and number, and a signal no move names arrives unmoved. The host's import operation writes them (63, 75a) |

The sha256 is the capture crate's. The folder drop and the meeting file print contract lines a host takes as any adapter's (64); the import prints import lines a host's import operation writes (63, 75a).

### C.7 The pack

The pack is files in weir's repository, one folder per case under
`pack/<shape>/<case>/`, and C.7 names every shape the pack holds, so
every profile is held (87): `host`, `adapter`, `cadence`, `branch` (C.3:
a branch's tip and content, a write and the tip it was read at, and the
tip moved or the refusal; 44 to 50), `inbox` (C.2: an inbox's starting
records and one operation of the records, a reading, a move or a
replacement, a batch proposed or decided, an item, a brief, a send or
import lines, and the records or the refusal expected; 25 to 43, 63)
`kinds` (C.4: a declaration, and the kinds read or each field
refused; a package and the identity it is held at, with a lock where
the case checks one, and its kind and content hash read or each field
refused; or a lock, and its identities and hashes read or each field
refused; 51 to 58, 88 to 95) and `tick` (A.13: a statechart, an object's
state of it and a snapshot, and the transitions, effects and next
state expected; 96 to 99), the engine's toy statechart among them, a
lamp off and on that names no reader's atom, and `delivery` (C.8: a
store's starting records and one call of B.7, and the records added,
the answer or the refusal expected; 100 to 113); a case of the last six
runs against weir's own crates in their tests, as cadence's do. For a host's case, the lines in
(`lines.jsonl`) and a raw place, and the records expected out, or the
refusal expected, with a `satisfies:` list naming the clauses (67). A
host is run against every host case through its intake; an adapter's
output is run against the adapter checks and, for a meeting adapter,
the meeting checks (66). The pack's check reads every case and the
statement, and fails when a number names no clause or a clause of Part
A is cited by nothing. It needs no network (68). A case for cadence
(59, 60) is a schedule, a last run or none, a now, and whether the thing
is due, with the zone the now is read in; a cadence case is one of the pack's
eight shapes above, and 67's check counts it as it counts the others.

`weir conform <host command>` runs a host against the host cases through
one seam the pack fixes, and the pack holds a host to it (65, 87). For
each case the pack makes a bare git repository with no remote in a
temporary folder, its branch `inbox` seeded with the case's starting
records, so a case of a held key begins with the capture there, and
runs the host twice as the case asks. For the intake, it runs
`<host command> --inbox <repository path> --branch inbox --limit <bytes>
[--raw-dir <the case's raw place>]` with the case's lines on standard
input, as a host's intake reads them. For a run (8, 9, 23), it runs
`<host command> --inbox <repository path> --branch inbox --limit <bytes>
--run <declaration>`, the declaration naming the case's own adapter, a
script in the case's folder that prints the case's lines and exits as
the case says, with or without a completion; the host runs it as it
runs any adapter (11), and the case holds the cursor kept and the run's
status (23). For an import (37 to 39, 63, 75a), it runs
`<host command> --inbox <repository path> --branch inbox --limit <bytes>
--import` with the case's import lines on standard input, and the case
holds the captures, signals and moves written as read. After either, the host prints one JSON object on standard
output after everything else, `weir-report/1`: the keys taken, the
count held, each refusal with its line, its key and its reason, the
listing's count and failures, the cursor kept where there was a run,
and whether the run was complete; the pack then reads the records from
the branch's tip. A refusal is compared by its line and key, and its
reason holds the phrase the case names (15); records are compared as
written. A host whose command takes these flags and prints this report
is a host the pack can hold; millpond's intake and run do (millpond
C.1).

A deliverer's store is held to the delivery cases through its two calls
(112). For each case the pack hands the case's starting records to an
empty store's add, reads them back, makes the case's call with weir's
crate over what it read, adds what the call gives, and reads back the
records the case expects, in order and as written; or it holds the
answer or the refusal the case names, a refusal by the field it names
and a phrase of its reason. A deliverer runs this in its own tests over
its own store, and weir runs it over a store of each spelling of C.8
(65, 87, 113).

### C.8 Deliveries: records in a deliverer's store

A delivery's records are four, each naming its format as
`format: weir-<record>/<major>` (40):

| record | fields |
|---|---|
| `weir-delivery/1` | `key`; `reader`, once for each reader, in the order given; `message`; `recorded_at`; `expires_at` (100, 104) |
| `weir-handover/1` | `key`, `reader`, `by` (the way, as the deliverer names it), `at` (103) |
| `weir-confirmation/1` | `key`, `reader`, `at` (102) |
| `weir-known/1` | `reader`, `known_at` (when a reader first confirmed under the name) (106) |

A key, a reader and a way are each one line of text, never empty and
never beginning or ending with a space. A message is text of one or
more lines, never empty. A time is RFC 3339 with its offset;
`expires_at` is `recorded_at` and the span, in `recorded_at`'s offset,
and a span is a whole number of seconds, at least one.

On a shared branch the records are recutils at rest, written as C.2
writes records, in the order added. In flight, and in a store on a
machine, each is one JSON object, its fields as above, a delivery's
readers a list, `readers`:

```json
{"format": "weir-delivery/1", "key": "place/7f3a/end/2", "readers": ["planner"], "message": "construct ended: the change is written.", "recorded_at": "2026-11-08T10:02:00-05:00", "expires_at": "2026-11-15T10:02:00-05:00"}
{"format": "weir-handover/1", "key": "place/7f3a/end/2", "reader": "planner", "by": "notice", "at": "2026-11-08T10:02:05-05:00"}
{"format": "weir-confirmation/1", "key": "place/7f3a/end/2", "reader": "planner", "at": "2026-11-08T10:40:12-05:00"}
{"format": "weir-known/1", "reader": "planner", "known_at": "2026-11-08T10:40:12-05:00"}
```

The crate `weir-delivery` holds the records, both spellings and B.7's
calls; a deliverer keeps its records where its own statement says.

### C.9 Facts, the people list and the policy: TOML

An offer's facts are its `facts` object (C.1): each key a fact's name,
each value a string, a number, `true` or `false`, a date as RFC 3339's
full-date in a string, or a list of them (117). A fact's name is
lowercase letters, digits, `_` and `-`, and a joined fact's is the name
of whom it is of and the fact's, joined by `.`, as `attendee.client`.
At rest, a capture's stated facts and a signal's read facts are `fact`
fields of `weir-capture/1` and `weir-signal/1` (C.2), one per value,
each `<name> <value>`, the value as JSON. A meeting's facts (118 to
120):

| fact | sort | given by | its values |
|---|---|---|---|
| `source`, `title`, `event_at` | stated | every offer (C.1) | as the offer gives them (117) |
| `length` | stated | a meeting adapter | the meeting's length, in seconds |
| `attendee` | stated | a meeting adapter | each attendee as the service gives them, an address where it gives one |
| `attendee.name`, `attendee.role`, `attendee.teams`, `attendee.org`, `attendee.client` | joined | the host | each attendee's person's name, role and teams, the org of its address, and whether that org is a client (119) |
| `speaker.name`, `speaker.role`, `speaker.teams`, `speaker.org`, `speaker.client` | joined | the host, from `speaker` | as for an attendee |
| `says` | read | a reader | `decision`, `request`, `action`, `risk` or `question` |
| `speaker` | read | a reader | a name that stands in the capture's raw material |
| `about` | read | a reader | a team or a repository of `[about]` |
| `owner` | read | a reader | a `name` of the people list, or a name that stands in the raw material |
| `due` | read | a reader | a date |

The people list and the policy are TOML, in the file their host names.
millpond's are its inbox's settings, `.config/millpond.toml` (millpond
C.2), and Boomdrive gives a drive's members as the same people list.
The crate `weir-policy` reads both, checks the facts a reader gives,
joins, and reads a policy for a signal or a capture (119 to 125):

```toml
[about]                        # what a reader's `about` picks from (120)
teams = ["web", "platform"]
repositories = ["acme/web-app", "acme/infra"]

[[person]]                     # (119)
name = "Dana Reyes"
addresses = ["dana@acme.com"]
names = ["Dana", "Dana Reyes"] # the names a transcript may give her
role = "executive"
teams = ["web"]

[[org]]
name = "Globex"
domains = ["globex.com"]
client = true

[[rules]]                      # in order; the first whose match holds gives the move (125)
name = "stand-ups"
when = { all = [{ fact = "source", is = "meeting" }, { fact = "title", contains = "stand-up" }] }
drop = "a stand-up"            # a drop and its reason (122)

[[rules]]
name = "point-releases"
when = { fact = "level", in = ["patch", "minor"] }
kind = "update"                # the kind it launches, named as a launch names it
repository = "~/Code/acme/web-app"   # where it launches, as a launch names it
priority = "low"               # low, normal, elevated, high or urgent
window = "*/30 * * * *"        # five-field cron (C.5); none when omitted, due at once (129)

[[rules]]
name = "a-clients-ask"
when = { all = [{ fact = "says", is = "request" }, { fact = "attendee.client", is = true }, { any = [{ fact = "speaker.role", is = "executive" }, { fact = "speaker.client", is = true }] }] }
kind = false                   # a person's turn
priority = "urgent"
```

A rule's `when` is a match, one of:

- `{ all = [...] }`, `{ any = [...] }` and `{ not = ... }`;
- `{ fact = "<name>", is = <value> }`, or with `in`, a list, `exists`,
  `true` or `false`, or `contains`, a text the value holds, its
  letters' case evened, in place of `is` (123);
- `{ older = "<span>" }`, the capture's age past a span, a whole number
  of `m`, `h` or `d`.

A rule holds exactly one of `kind`, a kind's name or `false` for a
person's turn, and `drop`, a reason. `repository` goes with a kind's
name, and `priority` with `kind`; `window` may go with `kind`. A
rule's `name` is lowercase letters, digits and `-`. A policy that
breaks any of these, names a rule twice, or holds a rule with a field
this profile does not name, is refused naming the field (122). A
rule's item is named `<rule>-<time>`, the time its window next names
after the item was made, or for a rule with no window the time it was
made, in UTC as `YYYYMMDDTHHMMSSZ`, so no two of a rule's items share a
name and none nests under another (35, 128).

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- I1. weir keeps no state and runs no process of its own (69).
- I2. One event, one key, one capture, in every inbox that holds it
  (3, 14).
- I3. Raw material never enters a record, and a secret never does
  (17, 71).
- I4. A write lands only on the tip it was checked against (44, 46).
- I5. Every record names its format and major, and a later reader reads
  every earlier one (40).
- I6. A signal has at most one standing move (29).
- I7. Reading and ticking change nothing: a declaration, an inbox, a
  tip or a statechart read or ticked is as it was (58, 78, 98).
- I8. Two hosts given the same lines write the same records (24).
- I9. A delivery is done only on its readers' confirmations: no
  hand-over and no expiry confirms one, and nothing a reader has not
  confirmed leaves its store (102 to 104, 107).
- I10. A rule reads facts alone, and the same policy, people list,
  facts and time give the same rule under every host (123, 125).

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Who curates, and how: a reader's and curation's instructions are the
  inbox's data and millpond's or Boomdrive's concern.
- A host's settings: which adapters run, where, on what schedule, and
  what becomes of an item, but for the form and the reading of its
  policy (A.17).
- Planning across items, the inquiry, the place and the agent: crew's,
  Boomdrive's, sounding's and flume's.
- Who may write a shared branch: the repository's own access rules.
- Encryption at rest, and backup: the machine's and the fleet's.
- How a deliverer hands a delivery over, by a notice, a wait or a
  listing, when it hands one again, the span before one expires, and
  who may confirm for a reader: the deliverer's.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- A shared branch is a branch of a git repository, and an inbox lies
  on one, under `inbox/` (design D2 and D4).
- The family keeps each piece of state in the lowest of five layers
  that holds every reader it has: the machine, a worktree, a clone, a
  shared branch, or a repository's content. On a shared branch a
  record is recutils, each naming `format: <tool>-<record>/<n>`, and
  JSON exists only in flight (D4).
- The hosts are millpond today and Boomdrive later, and an adapter runs
  unchanged under either. The kind's readers are flume, which reads a
  simple kind's places and stages and ticks a statechart kind on the
  engine, and sounding, which reads an elaboration kind's section too.
  crew calls millpond's, flume's and sounding's command lines and links
  no crate, keeping a Python twin of the write protocol.
- The sources already built speak the contract: headwater's adapter
  for releases, eddy's adapters for meetings, swancloud's deployer
  through the intake, and crew's findings through `crew signal`.
- The deliverers are flume and sluice. Each keeps its deliveries in a
  store of its own, flume's on its host and sluice's on its branch, and
  moves onto `weir-delivery` in a change of its own, sluice taking its
  first dependency on weir for it (weir record 0006).
- The family's limit for a try of a call to a remote is agentplot/sluice
  record 0109's, thirty seconds, its group asked to end, given two
  seconds, then killed. weir holds its code, `weir-bounded`, since
  sluice, flume and Boomdrive already take weir's crates. Each of them
  takes it in place of a copy of its own, in a change of its own
  (agentplot-design's ruling of 2026-11-10; weir record 0008).
- weir is free and open source, under MIT, in a public repository of
  the family's own, `agentplot/weir`, scaffolded from kit-standard's
  code profile, with `main` under sluice's gate.

The rest of the stack, which a model builds on unless it says why not:

- One Rust workspace of public crates, none keeping state or knowing
  which tool or machine uses it: `weir-capture` (the contract's types
  and key rules, JSON in flight, recutils at rest, a sha256 content
  hash and the cut), `weir-signals` (the signal, move, batch, item,
  brief and send records and the inbox's layout), `weir-adapters` (the
  folder drop, the meeting file and the signals-folder import),
  `weir-branch` (the write protocol), `weir-bounded` (a call to a
  remote run to the family's limit for a try, ended with everything it
  started), `weir-kinds` (the kind format,
  read and checked, with its packages, their content hash and locks),
  `weir-cadence` (five-field cron, caught up once), `weir-policy` (the
  facts' names and lists, the people list's join, and the policy's
  form and reading) and `weir-delivery`
  (the delivery records, both their spellings and B.7's calls), with
  the engine's crate beside `weir-kinds`, moved from the
  original Flywheel's flywheel-engine with its tests and its toy
  statechart, and the conformance pack beside them all. A reader takes
  `weir-kinds` and the engine at one revision of weir, so the format a
  kind is read in and the tick that runs it never come from two.
- JSON Lines in flight, GNU recutils at rest (`recfix`), TOML for
  declarations, RFC 3339 times, sha256 for content hashes, five-field
  cron for schedules, and XDG directories on a machine.
- A `weir` command line for the built-in adapters and the pack:
  `weir capture folder|meeting`, `weir import signals`, `weir check
  <declaration>` and `weir conform <host command>`.
- The profiles of Part C first.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements. The model answers them and the operator
rules; each ruling below is the user's, on their card of 2026-10-26.

1. The inbox's roots. C.2 fixes `captures/`, `moves/` and `items/`
   under `inbox/`. Is a third reserved first segment, `items`, wanted
   in the key rule, or do items lie under `moves/` so the design's two
   reserved segments stay the whole rule?
   Ruled 2026-10-26: three roots, and `items` is a third reserved first segment beside `captures` and `moves` (C.1, C.2); millpond's C.1 and the capture design say the same.
2. The word *kind*. A signal's `kind` field (C.1, C.2) is what this
   statement calls its nature, because *kind* is the kind format's
   word. Does millpond's statement take *nature* too, or does the field
   change its name in `weir-signal/1`?
   Ruled 2026-10-26: the field stays spelled `kind`, as crew's and millpond's records write it, and this statement's word for it is nature; Part C says the field is `kind` (C.1, C.2). millpond keeps its glossary.
3. crew's `new-territory` move is not one of the six (30). Does the
   import leave its signals unmoved (39), or map it to a join into a
   proposed item named for its target?
   Ruled 2026-10-26: a join into a proposed item named for the move's target, so the curation stands and nothing is judged again; millpond's 63 and C.11 carry the mapping.
4. The meeting file's key, `meeting/file/<sha256>` (C.6), and where a
   meeting file states its start.
   Ruled 2026-10-26: the key is `meeting/file/<sha256 of the file>`; its event time is the meeting's start where the file says it, else the date its name begins with, else its last write, as the folder drop's (C.6).
5. How many times a write is replayed before it is reported refused
   (44), and whether the keeper or the writer sets it.
   Ruled 2026-10-26: the writer sets the bound, five unless it says otherwise; a write refused that many times is reported and never retried on its own (44).
6. The machine's name in a pointer: its hostname, or the name the
   fleet gives it.
   Ruled 2026-10-26: the hostname the machine reports for itself, its short name, as crew writes today (17).
7. Whether cadence reads the machine's local time or UTC (C.5).
   Ruled 2026-10-26: the machine's local time, as cron and launchd read it (C.5).
8. The shape language of an adapter's configuration (C.1): JSON Schema,
   or TOML with a schema of weir's own.
   Ruled 2026-10-26: a JSON Schema, draft 2020-12, beside the declaration (C.1).

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** A release adapter offers one capture whose own excerpt runs
  to forty kibibytes, with the notes whole as raw material. The host
  writes one capture and one signal, cut at a line within the limit
  and closed with a line naming what was left out, banks the notes and
  the whole excerpt on its machine, and records the run complete.
- **S2.** The same adapter runs the next day and offers the same
  release again. Nothing is written or banked, and the run counts it
  held.
- **S3.** A run offers fourteen captures, one with a key whose first
  segment is `moves`. That one is refused and named in the run, and
  the other thirteen are taken.
- **S4.** An adapter exits without its completion after offering five
  captures. The five stand, the cursor stays, and the run is recorded
  incomplete. The next run lists from the old cursor, offers the five
  again, and writes nothing for them.
- **S5.** Two machines take one release at once and write to one
  branch. The first write lands; the second is refused at the push,
  applied again to the new tip, finds the key held, and writes
  nothing. The inbox holds one capture.
- **S6.** Curation on one machine and the operator on another each move
  one signal within a second. One move lands; the other is applied
  again to the new tip, meets the standing move, and is refused naming
  it.
- **S7.** An inbox lies on a branch of a repository with no remote. A
  write takes the same steps, moves the branch from its expected tip,
  and a write formed against the old tip is refused.
- **S8.** crew's signals folder of one partition is imported, with its
  moves. Every capture keeps its key or takes its folder's name, every
  signal and move stands as read, and no raw material is copied.
  Importing it again writes nothing.
- **S9.** An imported move's word is `new-territory` with a target. It
  is read as a join into a proposed item named for the target, with no
  brief (39), and the move's note is kept. A second imported move's word
  is one of no vocabulary; that move is not taken, its signal arrives
  unmoved, and the import reports it.
- **S10.** flume reads its own kinds, one package per version:
  `fix@1` with one stage delivering commits, and `change@1` and
  `change@2` side by side, each with construct, code and verify
  delivering a change written, tasks ticked and a change archived,
  change@2's code stage repeating per task group.
  Each reads the same twice, and reading changes nothing.
- **S11.** sounding hands flume an elaboration kind. flume reads its
  stages and ignores the elaboration section; sounding reads both.
  Neither fails on the other's section.
- **S12.** A declaration names a stage with two deliverables. It is
  refused, naming the field. A declaration with no stage is refused
  the same way.
- **S13.** A machine sleeps through three times an hourly schedule
  names. On waking, cadence says due once; after that run, not due
  until the next named time.
- **S14.** A file is dropped in a watched folder twice, the second time
  under another name. The folder drop offers one key both times, and
  the host writes one capture.
- **S15.** A host under test keeps a copy of raw material in a record.
  The pack fails it, citing the clause.
- **S16.** A case in the pack cites a clause number that names nothing,
  or a clause of Part A is cited by no case. The pack's check fails
  naming the number.
- **S17.** A package's `kind.toml` names its prompt `../prompts/code.md`.
  It is refused naming the stage's `prompt`. The same package with the
  prompt moved inside it reads, and its content hash is the same on two
  machines where it lies at different paths. With its prompt made a
  symbolic link to another file inside it, the package is refused
  naming the link's file.
- **S18.** A lock records `acme/review@1` at one hash, and the package
  held at that identity has one prompt changed by a byte. Its content
  hash differs, and a reader refuses the kind naming it and both hashes.
- **S19.** A declaration holds a simple kind, bump, and a statechart
  kind, persona, whose test state runs the stage template with a rule
  for its agents and joins all. `read-kinds` gives bump with its stages
  and persona with its statechart, each as written, and reads both the
  same twice. A third kind's table holds both `stages` and `regions`,
  and is refused naming the field (51, 57, 81, 94, 95).
- **S20.** A statechart's transition names a state its region does not
  hold. The declaration is refused naming the transition's `to` (95).
- **S21.** The engine's toy statechart, a lamp in one region with off
  and on, is ticked with the lamp off and a snapshot whose switch is
  up. The tick gives the transition to on, with its effect, whose proof
  is absent. Ticked again with the lamp on and the proof present, it
  gives nothing. Each tick, given twice, gives the same answer, and
  neither changes the statechart or the snapshot (96, 98, 99).
- **S22.** A deliverer records a delivery for two readers and hands it
  to the first by a notice. The first is still owed it: what it is owed
  shows the delivery with its hand-over, and the delivery is not done.
  The first confirms, naming its key. The second's session starts, and
  the call that hands it the delivery confirms on receipt. The delivery
  is done, and its deliverer may let go of it (102, 103, 107).
- **S23.** A delivery names a reader misspelt, and nothing confirms it.
  Past its expiry, what that reader is owed shows it expired, and the
  name as one no reader has confirmed under. Nothing drops it.
  Confirmed later under that name, it is done, and the name is known
  (104 to 106).
- **S24.** A deliverer records one key twice, the second time with
  another message. The second writes nothing, and the first stands. A
  reader confirms twice; the second writes nothing and says when the
  first was (101, 102).
- **S25.** A deliverer's store drops the expired deliveries it reads.
  The pack fails it, naming the case and the record it did not read
  back (104, 113).
- **S26.** A policy holds `stand-ups`, a drop for a meeting whose title
  holds "stand-up", then `point-releases`, a join for a patch or minor
  release with a thirty-minute window. A release adapter offers a patch
  release with its level as a stated fact. The host writes the capture,
  its own signal and the rule's join in one write, into an item named
  for the rule and the window's next time, which records its rule and
  its priority. A second patch ten minutes later joins the same item.
  At the window's time the item is due, and its host closes it and
  writes its brief of the two excerpts as they stand (36, 117, 125,
  126, 128, 129).
- **S27.** A meeting adapter offers "Daily stand-up" with no excerpt,
  stating its length and three attendees. The `stand-ups` rule
  matches it as it lands. In one write the host writes the capture, one
  own signal whose excerpt is the title and which has no nature, and a
  drop by `rule:stand-ups`. The capture is never unread, and no reading
  is spent on it (19, 118, 125, 127).
- **S28.** A reader reads a meeting and gives one signal `says =
  "ruling"` and `about = "acme/web-app"`. The host leaves off `says`,
  names it to the reader, and takes the signal with `about`. No rule
  matches the signal, and it stays unmoved for curation (120, 126).
- **S29.** A rule matches a signal whose speaker is an executive. The
  name the reading gives its speaker is one two persons of the people
  list hold, so the speaker joins neither, and the rule does not match
  (119, 125).

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of weir that satisfies Parts A and B: the contract's lines and
the seven steps a host takes; the records of a capture, a signal, a
move, a batch, an item, a brief and a send, with the layout; the write
protocol; the kind format, read and checked, and the engine's tick;
cadence; the built-in adapters; the delivery records and B.7's calls;
the link; the facts, the people list's join and the policy's reading;
and the pack, with fixed examples of each. A conformance
pack whose cases each cite the clauses they exercise, failing when no
case cites a clause. The profiles of Part C, each passing the pack,
and millpond passing it as a host.

<!-- ANCHOR_END: deliver -->
