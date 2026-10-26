# weir — requirements
<!-- ANCHOR: preamble -->

A statement of what weir must always do and never do, written to
admit any model that satisfies it.

weir is the code the agentplot family shares. It has no process, no
state and no machine of its own: it defines, once, what every open
tool and Flywheel agree on, and implements each definition once, so
that millpond, headwater, eddy, sounding, flume and later Flywheel
build on one copy of each. The statement is in three parts. Part A is
what must hold of the things weir defines: the capture contract, by
which an adapter hands a host its events and a host takes them; the
records an inbox holds and how they lie; the protocol that writes a
shared branch; the kind format, by which a tool declares the stages
work goes through; cadence; the built-in adapters; and the conformance
pack that holds every host and every adapter to the rest. Part B is
its contracts: the operations weir needs across its five seams, an
adapter, a host, a shared branch's keeper, a kind's reader and a
clock, and the guarantee each must give. Part C is the profiles: the
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
format of its own. And a conformance pack says, of any host or
adapter, whether it keeps the contract. weir judges nothing a capture
says, moves no signal, starts no agent and lands no work: those are the
tools'. weir fixes the forms they meet in.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **an adapter** (a program that knows one source) | how to list its source, how to key each event, what raw material to write, and whether an offer carries an own excerpt | write a record, keep a list of what it offered, cut an excerpt, read a capture into signals, or learn which host or machine ran it |
| **a host** (a program that takes offers and keeps an inbox: millpond, Flywheel) | which adapters to run and when, where its inbox lies, its limit, and what becomes of an item | change what an offer carries, write a record outside the forms weir fixes, or take a key the inbox holds |
| **a writer** (a host, a session or a tool writing a shared branch) | what to write, and when | apply a write to a tip it was not checked against, or stand in for that check with a lock |
| **a kind's declarer** (a tool, a repository or a launch) | the stages work goes through, each stage's prompt, agents and deliverable, and any section of its own | make a reader run what the format does not say |
| **a kind's reader** (flume, sounding, Flywheel) | which sections of a declaration it reads, and what it refuses | change a declaration, or fail on a section it does not know |
| **the operator** | everything a tool's statement leaves to them | |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **host**: a program that takes offers under the capture contract and
  keeps an inbox: millpond today, Flywheel later.
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
  own excerpt.
- **limit**: the most bytes an excerpt may hold in an inbox's records.
- **cut**: an own excerpt shortened at a line, with a closing line of
  the host's, to keep within the limit.
- **reading**: the signals a reader writes for one capture, which may
  be none.
- **unread**: of a capture, that it has no own signal and no reading.
- **move**: curation's standing judgment on one signal.
- **batch**: the moves curation proposes together, which stand together
  or not at all.
- **claim**: a statement of what is true at the destination, kept
  beside an inbox by another tool.
- **item**: a unit of work, made of the signals curation joined into
  it, or of a piece of work an accepted conclusion proposed;
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
  an inbox holds it.
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
- **kind** (of work): a versioned, ordered list of stages, declared by
  a tool, a repository or a launch.
- **stage**: one step of a kind, worked by one agent, ending on its
  deliverable or, for a conversation, on its caller's word.
- **deliverable**: what a stage must produce for the stage to end, in
  one of six forms.
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

<!-- ANCHOR_END: glossary -->
<!-- ANCHOR: part-a -->
## Part A. What weir defines

### A.1 Offers

1. An adapter tells its host nothing but lines, and every line is
   exactly one of three: an offer, a cursor or a completion. A line
   that is none, or more than one, is malformed.
2. An offer carries a key, a source and an event time. It may carry a
   title, a link, the raw material it names and an own excerpt, and
   nothing else a host must read.
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
    capture (4), and when any own excerpt it carries holds every field
    (7). Every other offer is refused.
14. An inbox holds at most one capture per key, whatever writes at
    once. An offer whose key the inbox holds writes nothing, banks
    nothing, and is counted as held.
15. A refused offer is named, with its reason, in what the host reports
    of the run or intake, and never stops another offer from being
    taken.
16. A capture's source, event time, title and link are as its offer
    gave them, and a capture never changes once written. A later offer
    under its key changes nothing, whatever it carries.
17. Raw material never enters an inbox's records. A capture holds a
    pointer only where a machine banked raw material for it, and the
    pointer names that machine by the hostname the machine reports for
    itself, its short name, as `<hostname>:<path>`.
18. No capture is written before the raw material its offer names is
    banked, whole and unchanged, on the machine that took it. Only
    what a taken capture names is banked; nothing else an adapter
    wrote in its raw place outlives the run.
19. A capture whose offer carried an own excerpt has exactly one
    signal, its own signal, written in the same write as the capture,
    and is never unread. Every other capture is unread when written.
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
    asserted it, what it asserts, its subjects, and what it argues
    with, which may be nothing. Its nature is one of five: constraint,
    ask, question, commitment, reaction.
26. A signal's excerpt stands verbatim in its capture's raw material,
    or is the capture's own excerpt as cut (20). A signal whose excerpt
    stands in neither is refused. An imported signal is exempt (37).
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
    there was one.
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
    never by a host, and every send made of it with what became of
    each. A send keeps the brief as it was handed, whatever the item's
    brief becomes later.

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

51. A kind is an ordered list of one or more stages, with a version.
    Every stage but a conversation has exactly one deliverable, and a
    conversation has none.
52. A kind's declaration holds its version, its stages in order, how
    its places' branches are named, whether its first stage starts in a
    place that could not be made ready, and whether it lands. A kind
    that lands names the stage a failed submission sends a place back
    to, and how many times a place may go back before it waits on its
    caller.
53. A stage's declaration holds its name, its prompt, and its
    deliverable or that it is a conversation. It may hold its agents
    with their settings, whether it waits on its caller's word, and how
    long its agent may be quiet before the stage is stuck.
54. A deliverable is one of six forms: commits; a change written; tasks
    ticked; a change archived; a report at a path; a committed report
    at a path. The format spells each one way.
55. An elaboration kind is a kind with an elaboration section, which
    declares the inputs a round is handed beyond its opener's, the
    sections a conclusion adds, how a round ends, whether earlier
    soundings' transcripts are handed, and what lands. Whoever runs
    places reads the kind's stages and nothing of the section; whoever
    runs elaborations reads both.
56. A declaration may hold a section its reader does not know, and the
    reader ignores it. A reader never fails on a section it does not
    know, and never changes a declaration.
57. A declaration is checked whole: a kind with no stage, a stage with
    no name or prompt, a field of the wrong shape, or a deliverable
    not of the six, is refused naming the field. A version left out
    reads as the first.
58. The same declaration always reads the same, and reading it changes
    nothing. Which declaration a name resolves to, among a tool's own,
    a repository's and a launch's, is the reader's rule, never the
    format's.

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

65. The pack holds cases of two kinds: for a host, lines in and the
    records, refusals, held counts and run status the host must write
    from them; for an adapter, the checks its lines must pass. A host
    or adapter that fails one case does not keep the contract.
66. The pack holds the meeting checks: an adapter is a meeting adapter
    when every capture it offers carries a key by its service and the
    meeting's own identity, the meeting's start as its event time, the
    transcript as served and a plain copy as raw material, and no own
    excerpt, and when it leaves out a meeting too short to hold
    anything and counts it in the completion.
67. Every case cites the clauses it exercises, and the pack's check
    fails when a cited number names no clause, or a clause of Part A
    is cited by no case.
68. The pack runs with no source, no network and no machine but the one
    it runs on, from fixed inputs, and gives the same verdict
    everywhere.

### A.12 What weir never does

69. weir keeps no state, runs no process of its own, and knows no
    machine, host, tool or inbox. Everything it does is a function of
    its inputs, or a write it was asked to make. A child it runs and
    waits on for that write, git for a branch's write (C.3), is no
    process of its own: it ends with the call, and nothing of weir
    outlives a call.
70. weir never lists a source, never judges what a capture says, never
    chooses a move, never starts an agent, never submits and never
    lands work.
71. No record weir defines holds a secret, and nothing weir writes
    includes one.

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

81. **read-kinds**: given a declaration, every kind it declares, each
    with its stages and its sections; or that it could not be read,
    with the field named (57).
82. The guarantee: the same declaration gives the same kinds, reading
    changes nothing (58), and a section the reader does not know is
    returned unread and unrefused (56).

### B.5 The clock

83. **now**: the present time on the machine.
84. **last-run**: given a thing with a schedule, when it last ran, or
    that it never has.
85. The guarantee: cadence asks the clock for these two and nothing
    else (59).

### B.6 Binding the contracts

86. Each seam is bound by naming one or more profiles of Part C. A
    host binds one branch keeper per inbox and any number of adapters;
    a kind's reader binds the one format; cadence binds one clock.
87. The pack holds every profile to Parts A and B, every host as a host
    and every adapter as an adapter (65). A profile, host or adapter
    that fails it is not one.

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
{"import": {"capture": {"key": "release/mise/2026.10.10", "source": "release", "event_at": "2026-10-10T14:02:11Z", "title": "mise 2026.10.10", "url": "…"}, "pointer": "mac-studio:~/.local/state/crew/…", "came_in": "import:crew-folders", "signals": [{"n": 1, "kind": "ask", "asserted_by": "…", "assertion": "…", "subjects": [], "argues_with": [], "excerpt": "…", "position": "…"}], "moves": [{"signal": 1, "move": "join", "target": "…", "by": "…", "at": "…"}]}}
```

`capture` is an offer's object without `raw` and `excerpt`; `pointer`
is kept as the body gave it or left out; `signals` are the body's, in
its order, numbered from 1; `moves` name a signal by number and carry
the six words' consequences, and one of another word is carried as it
stands for 39 to leave unmoved.

A host takes each line in seven steps, which the pack checks (75):

| step | what the host does | clauses |
|---|---|---|
| 1. check it | refuses a malformed line, a bad key, a missing field or an excerpt with no text, and names it in the run | 13, 15 |
| 2. look up the key | passes over a key the inbox holds, and counts it | 14 |
| 3. bank the raw files | on the machine, under the capture's name, byte for byte | 17, 18 |
| 4. write the capture | with a pointer `<machine>:<path>` when anything was banked | 16, 17, 22 |
| 5. write the own signal | cut at a line so the text and its closing line fit the limit; the closing line is `[cut: <n> lines and <b> bytes left out, banked whole with the capture]`, the one spelling every host writes (24); the whole text banked when cut; a limit too short to hold the closing line alone is refused | 19, 20, 21 |
| 6. mark the capture unread | when it carries no excerpt | 19 |
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
| `weir-capture/1` | `key`, `source`, `event_at`, `title`, `url`, `pointer` (`<machine>:<path>`), `came_in` (`run:<adapter>`, `intake`, or `import:<body>`), `machine`, `taken_at`, `unread` |
| `weir-signal/1` | `signal` (`<key>#<n>`), `kind` (the nature), `asserted_by`, `assertion`, `subjects`, `argues_with`, `excerpt`, `position`, `cut` (the lines and bytes left out, where cut) |
| `weir-move/1` | `signal`, `move` (one of the six), `target` (the consequence: a reason, a claim or record, an item, a chore or an ask), `note` (a reason or note given with the move, as read; a drop's reason again), `by`, `at`, `batch`, `replaces` |
| `weir-batch/1` | `batch`, `proposed_by`, `proposed_at`, `stands` (and who accepted it, when) |
| `weir-item/1` | `item`, `made_by` (a join, or a conclusion), `conclusion`, `named_by`, `named_at` |
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

[[kinds.bump.stages]]
name = "code"
prompt = "prompts/bump-code.md"                   # relative to the declaration's file
deliverables = ["commits"]                        # exactly one, spelled as below (54)
agents = [{ program = "claude", model = "opus" }] # with their settings (53)
quiet = "45m"                                     # how long the agent may be quiet: a whole number of s, m or h (57)

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

`read-kinds` (81) returns every kind with its stages and every section
as read; a reader keeps the sections it knows. A table or field the
format does not name is a section the reader ignores (56). The format
refuses two stages of one kind sharing a name, and an `on_fail` naming
no stage of its kind, naming the field (57). The format gives no default
for `quiet`, `on_fail`, `max_send_backs` or an elaboration's `ending`:
a field left out is returned left out, and what it means is the
reader's rule (58), since readers differ.

### C.5 Cadence: five-field cron

A schedule is five-field cron, read in the machine's local time, and
cadence says due when a time it names has come since the last run, or
there was none (59). A run missed while the machine slept is caught up
once (60). The clock is the machine's (83).

### C.6 The built-in adapters

| adapter | what it offers |
|---|---|
| the folder drop, `weir capture folder <dir>` | one capture per file; key `folder/<folder name>/<sha256 of the file>`; event time the date the file's name begins with, or else its last write; source `folder`; the file as raw; no excerpt (61) |
| the meeting file, `weir capture meeting <file>` | one capture per meeting file; key `meeting/file/<sha256 of the file>`; event time the meeting's start where the file says it, in a `start` or `date` field of its front matter, or else a date that opens its first line, or else as the folder drop; source `meeting`; the file as raw; no excerpt (62) |
| the signals-folder import, `weir import signals <dir>` | one import line (C.1) per capture of crew's folders on a partition's flywheel branch, a `capture.md` and one `NN-<slug>.md` per signal, with `moves.rec`: a release capture keeps `release/<name>/<version>`, every other takes its folder's name (38); the capture's pointer as crew gave it; its signals and moves as read, a move whose word is not one of the six carried for 39 to leave unmoved. A meeting corpus already read in a blueprints repository comes the same way: its captures and signals from the repository's own reading, its moves from the partition's flywheel branch's `moves.rec` where a move names the signal by its key and number, and a signal no move names arrives unmoved. The host's import operation writes them (63, 75a) |

The sha256 is the capture crate's. The folder drop and the meeting file print contract lines a host takes as any adapter's (64); the import prints import lines a host's import operation writes (63, 75a).

### C.7 The pack

The pack is files in weir's repository, one folder per case under
`pack/<shape>/<case>/`, the shapes `host`, `adapter` and `cadence`: for
a host's case, the lines in (`lines.jsonl`) and a raw place, and the
records expected out, or the refusal expected, with a `satisfies:` list
naming the clauses (67). A
host is run against every host case through its intake; an adapter's
output is run against the adapter checks and, for a meeting adapter,
the meeting checks (66). The pack's check reads every case and the
statement, and fails when a number names no clause or a clause of Part
A is cited by nothing. It needs no network (68). A case for cadence
(59, 60) is a schedule, a last run or none, a now, and whether the thing
is due, with the zone the now is read in; the pack holds the three
shapes, a host's, an adapter's and cadence's, and 67's check counts a
cadence case as it counts the others.

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
status (23). After either, the host prints one JSON object on standard
output after everything else, `weir-report/1`: the keys taken, the
count held, each refusal with its line, its key and its reason, the
listing's count and failures, the cursor kept where there was a run,
and whether the run was complete; the pack then reads the records from
the branch's tip. A refusal is compared by its line and key, and its
reason holds the phrase the case names (15); records are compared as
written. A host whose command takes these flags and prints this report
is a host the pack can hold; millpond's intake and run do (millpond
C.1).

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
- I7. Reading changes nothing: a declaration, an inbox or a tip read is
  as it was (58, 78).
- I8. Two hosts given the same lines write the same records (24).

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Who curates, and how: a reader's and curation's instructions are the
  inbox's data and millpond's or Flywheel's concern.
- A host's settings: which adapters run, where, on what schedule, and
  what becomes of an item.
- Planning across items, the inquiry, the place and the agent: crew's,
  Flywheel's, sounding's and flume's.
- Who may write a shared branch: the repository's own access rules.
- Encryption at rest, and backup: the machine's and the fleet's.

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
- The hosts are millpond today and Flywheel later, and an adapter runs
  unchanged under either. The kind's readers are flume, which reads a
  kind's places and stages, and sounding, which reads an elaboration
  kind's section too. crew calls millpond's, flume's and sounding's
  command lines and links no crate, keeping a Python twin of the
  write protocol.
- The sources already built speak the contract: headwater's adapter
  for releases, eddy's adapters for meetings, swancloud's deployer
  through the intake, and crew's findings through `crew signal`.
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
  `weir-branch` (the write protocol), `weir-kinds` (the kind format,
  read and checked) and `weir-cadence` (five-field cron, caught up
  once), with the conformance pack beside them.
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
- **S9.** An imported move's word is `new-territory`. The move is not
  taken, its signal arrives unmoved, and the import reports it.
- **S10.** flume reads its own declaration: `fix@1` with one stage
  delivering commits, and `change@1` with construct, code and verify
  delivering a change written, tasks ticked and a change archived.
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

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of weir that satisfies Parts A and B: the contract's lines and
the seven steps a host takes; the records of a capture, a signal, a
move, a batch, an item, a brief and a send, with the layout; the write
protocol; the kind format, read and checked; cadence; the built-in
adapters; and the pack, with fixed examples of each. A conformance
pack whose cases each cite the clauses they exercise, failing when no
case cites a clause. The profiles of Part C, each passing the pack,
and millpond passing it as a host.

<!-- ANCHOR_END: deliver -->
