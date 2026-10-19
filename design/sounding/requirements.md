# sounding — requirements
<!-- ANCHOR: preamble -->

A statement of what sounding must always do and never do, written to
admit any model that satisfies it.

The statement is in three parts. Part A is what must hold of sounding
on its own: a brief and the inputs it is worked from, the kinds that
shape a sounding, the earlier soundings one is based on, the place a
launcher makes for it, what lands from it, the rounds that work it and
the exits a round's session has, how a round ends, the operator's
decision on each conclusion, and what sounding keeps. Part B is its
contracts: the operations it needs across its six seams, the launcher,
the kinds, the operator, an item's keeper, an inbox and a store, and
the guarantee each must give. Part C is the profiles: the ways each
contract is satisfied.

Parts A and B name no mechanism: no command, file, format, field,
service or tool. One thing of the world they name freely, because
section 9 fixes it: git. Every other real tool is named only in section
9 and in Part C. A reader who has never seen an elaboration, an agent
launcher or an agent's plugins should be able to design from Parts A
and B and git alone.

## 1. Purpose

sounding works a brief to a conclusion the operator decides. Some work
ends in an answer or in writing before it ends in a change: whether to
take a major release, how to settle what a meeting left open, whether
an approach holds once someone tries it, what a design's next chapter
says. An opener names the brief and the inputs it is worked from:
items, signals, captures, transcripts, and earlier soundings whole.
sounding has a launcher make a place of the repository and start one
session there per round, and hands the session every input. Each round
ends on a conclusion: the answer, its evidence, what it would change,
the work it proposes and what stays open. The session reads whatever
else it needs, in its place and beyond it. The operator accepts the
conclusion, sends it back for another round, or drops it. A sounding's
kind says how its rounds end and what, if anything, lands: a chapter or
a claim its session wrote reaches the repository's shared branch
through the launcher, and a prototype never does. sounding keeps each
sounding's record beside the repository and on no branch, so what lands
never carries it. A finding beyond the brief goes to an inbox as a
capture of its own. sounding works the same for a person alone, for an
inbox that sends it items and for a planner, and needs none of them. It
keeps no clock and drives no terminal: the launcher runs each round and
reports how it ended. It never submits, never decides a conclusion and
never makes work of one: the operator decides, whoever keeps the items
makes the work, and the launcher submits what lands through the
repository's own gate.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **the operator** | every decision on a conclusion: accept, go on or drop; every reply to an ask; when a standing round finishes; when a parked sounding resumes; the ending of every round after the first; what they tell a round's session; which profile binds each seam; when a sounding's branch and held state are removed | they never have a sounding land more than its kind names |
| **an opener** (a person in a session, an inbox, a planner, another tool's surface) | which brief to open, in which repository and on which base, with which inputs and which earlier soundings, under which name, for which items, of which kind, and the first round's ending | it never decides a conclusion, and never changes a brief or its inputs once the sounding is open |
| **the repository's authors** | the kinds the repository declares, and what each lands; the profiles its soundings bind in place of the operator's | they never make a sounding land what its operator did not accept |
| **a round's session** (an agent working one round) | everything inside its place: what to read, try, build and run; what to read beyond its place; when to conclude; what to offer; what to ask | it never moves sounding's state but through its exits and its note, never acts on another sounding or changes one it is based on, never decides a conclusion, and never submits, merges or lands its place's work |
| **the launcher** (a separate tool that makes places and runs agents in them) | how a place is made and removed, and how a session is started, followed and ended, as Part B fixes them. It runs a session where sounding's setting names, and reports when one has stopped or is gone | it never starts a round sounding did not ask for, and never submits what sounding did not ask it to |
| **sounding** | when to ask the launcher for a round, as this statement fixes it; when to ask the launcher to submit what an accepted conclusion lands; and what it keeps | it never judges a brief, an input, a finding or a conclusion, never writes a conclusion or a note of its own, never decides a conclusion, never submits, merges or lands a branch itself, never makes work from a conclusion, and keeps no clock and drives no terminal or agent |
| **a surface** (where the operator reads a sounding and responds to it) | how a sounding is shown | it never gives a response of its own, carrying only the operator's, and never drives a terminal or an agent |
| **an item's keeper** (an inbox, a planner) | what the item holds of a decision, and how the work an accepted conclusion proposes becomes work | it never decides a conclusion, and never writes sounding's held state |
| **an inbox** | what becomes of an offer once it takes it | it never changes an offer sounding keeps |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **repository**: a git repository a sounding's place is made of.
- **brief**: what a sounding is opened to settle or to write, in its
  opener's words: what it asks, or the writing it is to make.
- **input**: material a sounding is worked from, as its opener names
  it: an item, a signal with its excerpts, a capture, a meeting's
  transcript, what another tool says of a release, a file, or an
  earlier sounding.
- **opener**: whoever opens a sounding.
- **item**: a unit of work another tool keeps. A sounding's items are
  those its opener opens it for, each among its inputs.
- **item's keeper**: the tool that keeps an item.
- **sounding**: one brief, worked over its inputs in one place one
  round at a time, until the operator accepts or drops it; also the tool
  that runs them.
- **kind**: what shapes every sounding of it: what a round is handed
  beyond its inputs, what a conclusion of it holds, how its rounds end,
  whether earlier soundings' session transcripts are handed, and what
  lands.
- **declaration**: a written set of kinds: sounding's own, a
  repository's, or one an opening carries.
- **based on**: of a sounding, the earlier soundings its opener names
  among its inputs.
- **record**: of a sounding, its held state as a reader sees it: its
  brief, its inputs, the soundings it is based on, every round's
  conclusion or note with the decision on it, the operator's notes and
  replies, its offers and asks, and its landing.
- **session transcript**: everything said in one round's session, by its
  agent and to it.
- **name**: the words that tell one sounding from the other soundings of
  its repository.
- **launcher**: the tool that makes a sounding's place, starts and
  follows each round's session in it, settles each round's end, submits
  what lands, and removes the place. It alone drives the terminal a
  session runs in.
- **base**: the branch a sounding's place is cut from, and the only
  branch what it lands reaches; the repository's shared branch unless
  the opener names another.
- **place**: a working copy of the repository the launcher prepared for
  one sounding, on the sounding's own branch.
- **round**: one session's run at the brief, from its start to its end.
- **starter**: whoever starts a round: the opener for the first round,
  the operator for every other but one a failed landing starts.
- **ending**: of a round, how it ends: **self-closing**, its session
  ending it by concluding; **standing**, its session staying while
  quiet until the operator says finish; or **with the operator**, its
  session working in conversation with the operator, who ends it.
- **finish**: the operator's word that a standing round is to conclude.
- **exit**: one of three acts by which a round's session acts on
  sounding, an inbox or the operator: **conclude**, **offer** and
  **ask**.
- **conclusion**: what a round ends on when its session concludes: the
  answer, its evidence, what the answer would change, the work it
  proposes, and what stays open, with whatever its kind adds.
- **proposed work**: one piece of the work a conclusion proposes.
- **what lands**: the part of a place its kind names to reach the base
  once the operator accepts a conclusion, such as a design book's
  chapters, claims or a map of context.
- **submission**: what lands, offered by the launcher to its base
  through the repository's gate, and what the gate records of it.
- **landed**: of what lands, that its submission reached the base.
- **note**: what a round's session leaves, by an act of its own, when it
  stops without concluding: what the round did, and where the next round
  would start.
- **finding**: something a session learns beyond its brief.
- **offer**: one finding handed to an inbox as a capture of its own.
- **ask**: one thing only the operator can tell or choose, put to them
  by a round's session.
- **reply**: the operator's response to an ask.
- **request**: one conclusion or one ask put before the operator on one
  surface, for one response.
- **response**: the operator's decision on a conclusion, or reply to an
  ask.
- **decision**: the operator's response to a conclusion: **accept**, which
  settles the sounding; **go on**, which starts the next round with the
  operator's notes; or **drop**, which ends the sounding with a reason.
- **notes**: what the operator writes on a conclusion to shape the next
  round.
- **stop check**: the launcher sending back a round's session that would
  stop before its round may end.
- **state**: of a sounding, exactly one of **working**, a round runs
  and no request of it waits; **waiting on the operator**, a request of
  it has no response yet; **parked**, no round runs and no request waits;
  **landing**, its conclusion accepted and what lands not yet landed;
  **accepted**, its conclusion accepted and whatever lands landed; and
  **dropped**.
- **ended**: of a sounding, accepted or dropped.
- **inbox**: a store of captures another tool keeps, where findings
  become work.
- **capture**: an inbox's record of one event.
- **held state**: everything sounding keeps of its own for one
  sounding.
- **surface**: one way the operator or a program reaches sounding.
- **profile**: one way a contract of Part B is satisfied, as Part C
  describes.

<!-- ANCHOR_END: glossary -->
<!-- ANCHOR: part-a -->
## Part A. What sounding decides

### A.1 A sounding and its inputs

1. A sounding works one brief in exactly one repository, over the inputs
   its opener names. Its brief and inputs never change once it opens:
   the operator's notes and replies are kept beside them, never in place
   of them.
2. Opening a sounding never waits on its work, interrupts its opener, or
   changes the opener's own work. The session that opens a sounding is
   never a session of it.
3. Every sounding has exactly one name, fixed when it opens. A name says
   the brief in words and is never an ordinal or an id, and no two
   soundings of one repository hold the same name while both have held
   state.
4. A name an opener gives that another sounding of the repository holds
   is refused, naming that sounding, and is never altered to fit.
5. A sounding's inputs are exactly those its opener names, with what its
   kind hands (13). sounding adds no other, drops none, and never judges
   which bear on the brief.
6. sounding hands the brief, every input, and every note and reply of
   the operator to a round's session as given: never summarised,
   reworded, translated, cut or ranked. An input that points at material
   elsewhere is handed with its pointer.
7. A round's inputs are closed. sounding hands its session every one, in
   full, at the round's start, and before the round ends hands it only
   the operator's replies and the words the operator tells it. Closed
   bounds only what sounding hands. The session reads whatever else it
   judges it needs (20).
8. Any number of soundings run at once, in one repository or in many.
   None waits on another, and nothing one does reaches another's place
   or held state.
9. A sounding has none, one or several items, named when it opens and
   all kept by one keeper, and gains no item later, whether or not an
   inbox is bound. Each of its items is among its inputs.

### A.2 Kinds

10. Every sounding runs exactly one kind, named when it opens. A
    sounding whose opener names none runs **question** (14).
11. sounding itself, a repository or an opening declares a kind. For an
    opening, a kind's name resolves to exactly one declaration: the
    opening's over the repository's over sounding's own. A sounding's
    record names the declaration it runs, and an opening whose kind
    resolves to none is refused.
12. A repository's kinds are read from its base's revision at the
    opening, never from a place's tree or from a change not committed. A
    sounding runs its kind as it resolved at its opening, and a later
    change to any declaration never changes it.
13. A kind's declaration holds what each round is handed beyond the
    opener's inputs; what a conclusion of it holds beyond its five parts
    (37); its rounds' ending; whether earlier soundings' session
    transcripts are handed (16); and what lands, or that nothing does.
    Nothing else a declaration holds changes what sounding does.
14. sounding's own declaration holds one kind, **question**: it hands
    nothing beyond the opener's inputs, its conclusion holds the five
    parts, its rounds are self-closing, it hands no session transcripts,
    and nothing of it lands.

### A.3 Earlier soundings

15. A sounding may be based on any number of earlier soundings, named
    among its inputs when it opens, whatever state each is in: working,
    parked, accepted or dropped among them.
16. Each round of a sounding is handed the record of every sounding it
    is based on, whole, as it stands when the round starts. It is also
    handed each one's branch as a pointer, its repository, branch and
    revision, which the session reads for itself. Where the kind says
    so, the round is handed each earlier sounding's session transcripts
    too.
17. Basing a sounding on another never changes, reopens, holds or ends
    the other, and nothing a sounding does reaches the place or held
    state of one it is based on.

### A.4 The place

18. Each sounding has exactly one place, which the launcher makes when
    the sounding opens from its base's revision, named in its held
    state, on a branch no other sounding, place or work shares.
19. Every round of a sounding works in its one place, and nothing a
    round leaves there is removed before the sounding ends. Work a
    session left there and never committed stays for the next round.
20. Inside its place a round's session is free: it may read, change,
    build and run anything there. Beyond its place it reads and fetches
    whatever it judges it needs: other repositories, documentation, the
    web, the branch of a sounding it is based on. Nothing it does
    reaches another place, or changes any branch but its sounding's.
21. A round's session commits what it leaves in the place before it
    concludes or leaves a note. The conclusion or note names that
    revision, so work built later can read what the place showed.
22. The launcher removes a sounding's place when the sounding ends, and
    keeps its branch while the branch holds a commit its base lacks.
    sounding never removes a sounding's branch; only the operator does.
23. Opening and working a sounding change no branch, place or working
    copy of its repository but the sounding's own. Only a landing
    reaches another branch: the sounding's base, with what lands and
    nothing else (24).
102. sounding never pushes a sounding's branch. A reader on another host
     reads the revisions a conclusion names once the operator has pushed
     it.

### A.5 What lands

24. Only what lands ever reaches the base from a sounding, as the
    sounding's branch holds it at the accepted conclusion's revision. A
    prototype and everything else in the place never land, and no
    branch holds the held state (109).
25. Only the launcher submits what lands, and only when sounding asks it
    to after the operator accepts (62). sounding never submits, merges
    or lands a branch itself, and no round's session submits its place's
    work.
26. What lands goes straight onto the base, through the repository's own
    gate, with no branch of sounding's between them.

### A.6 Rounds

27. A sounding's rounds are numbered from one in the order they start.
    At most one round of a sounding runs at any moment, and each round
    has exactly one session.
28. A round starts only when the sounding opens, on the operator's go
    on, on the operator's word resuming a parked sounding, on the
    operator's reply to an ask whose session is gone, or when what an
    accepted conclusion lands fails to land (62).
29. A round's session is handed at its start the brief, every input, and
    every note and reply of the operator (6). It is also handed every
    earlier round's conclusion or note with the decision on it, the
    round's ending, and, for a round a failed landing started, the
    failure's words.
30. A round's ending is its kind's, unless its starter runs it with the
    operator. It is fixed for the round.
31. A round ends in exactly one way: on a conclusion, on a note, or with
    its session gone or ended without either. sounding keeps how each
    round ended.
32. A session gone without an exit is never read as a conclusion, a
    note, a reply or a decision.
103. A round is kept only once the launcher shows evidence that its
     session exists. A sounding whose first round never started is
     parked, and the operator's word resuming it starts its first round.
104. A session a host brings back after a restart is its round's session
     exactly when the launcher reports it as the session of the round's
     place. Otherwise the round ended with its session gone.

### A.7 Exits

33. A round's session acts on sounding, an inbox or the operator only
    through its three exits and its note, each given by an act of its
    own. Nothing it writes by other means, in its place or anywhere else,
    is a conclusion, an offer, an ask or a note.
34. A session never decides a conclusion, its own or another's. sounding
    refuses accept, go on and drop given from within a round's session,
    on every sounding.
35. An exit acts only on the round it serves. An exit naming another
    sounding, an ended sounding, or a round that has ended is refused.
36. Every exit and every decision is safe to repeat: a repeat of one
    already kept changes nothing. An exit its session gives a key
    repeats the one its round keeps under that key. One given without a
    key repeats a kept exit of the same act with the same content.

### A.8 Conclude

37. A conclusion names its answer, its evidence, what the answer would
    change, the work it proposes and what stays open, with whatever its
    kind adds, and says so where any of them is empty. A conclusion of a
    kind that lands names what its session wrote to land.
38. A conclusion states each piece of proposed work apart from every
    other, so that each can become work of its own.
39. A conclusion ends its round. Its session does no further work on the
    sounding, and the conclusion never changes once kept.
40. A conclusion never reaches an inbox, as a capture or as part of one.
    Only offers do.

### A.9 Offer

41. An offer carries one finding as text, whole as its session wrote it,
    the sounding it came from, and when it was offered. Material beyond
    the text, such as what a prototype printed, the finding names by a
    pointer. Its time is when the session offered it, never when an
    inbox took it.
42. Every offer has one identity for ever: its sounding's repository and
    name, and its number among that sounding's offers. No two offers
    share an identity, and an inbox given one offer twice holds one
    capture of it.
43. An offer never holds its session. sounding keeps it at once, and the
    session goes on whether or not an inbox has taken it.
44. sounding keeps every offer whether or not an inbox took it, and says
    which. An offer no inbox could be reached for is handed again until
    an inbox takes it or refuses it, and a refused offer is kept with
    the inbox's reason.
45. Ending a sounding withdraws none of its offers.

### A.10 Ask

46. An ask puts one thing only the operator can tell or choose before
    them, and its session waits for the reply.
47. A reply goes to the session that asked if it still lives, and
    otherwise starts the sounding's next round with the ask and its
    reply (28).
105. A conclusion or a note closes every ask of its round still open,
     with no reply, and has every request for it withdrawn. A round whose
     session is gone leaves its asks open, and a reply to one starts the
     next round (47).

### A.11 How a round ends

48. A self-closing round's session never stops without having concluded
    or left a note. The stop check sends back every session that tries
    to stop with neither.
49. A standing round stays open while its session is quiet, and its
    session may fall quiet any number of times without concluding. The
    operator's finish asks it to conclude, and from then the stop check
    holds it as it holds a self-closing round.
50. A round with the operator has no stop check. It ends on a conclusion
    or a note its session gives, or when the operator ends it.
51. A note says what the round did and where the next round would start.
    sounding keeps it beside its round, and the next round's session is
    handed it (29).
52. sounding never interrupts a working session and never bounds how
    long a round runs. More work on a brief is another round or another
    sounding.
106. sounding keeps no clock and watches nothing. The launcher runs each
     round, settles its end, and reports whether its session lives (85).
     Every call on sounding first does what waits. It keeps the end of
     each round the launcher reports ended, and reads each open request
     for a response (58). It hands again each offer no inbox was reached
     for (44), and tells again each items' keeper not yet told (64).
107. A conclusion of a round with the operator goes before the operator
     as any other does, and nothing said in the conversation is a
     decision.

### A.12 States

53. Every sounding is in exactly one state at any moment, and an ended
    sounding never leaves its state.
54. A sounding's state is derived from its held state, from whether its
    round's session lives as the launcher reports it, and from what the
    launcher reports of its submission, and from nothing else. No
    surface keeps a state of its own.
55. A sounding that has not ended is parked exactly when no round runs,
    no request of it waits and it is not landing. It has no round yet,
    or its last round ended on a note, or with its session gone or ended
    without an exit.
56. A parked sounding resumes only on the operator's word, which starts
    its next round in the same place from what the last round left.

### A.13 The operator's decision

57. Only the operator decides a conclusion, and each conclusion gets
    exactly one decision. A decision given once is never asked for
    again, and one that cannot be applied is reported, never discarded
    in silence.
58. A conclusion or an ask put before the operator on several surfaces
    gets one response. The first response applies, every other request
    for it is withdrawn, and a later response is reported as not
    applied.
59. Accept and go on respond to a conclusion and nothing else, and
    finish to a standing round and nothing else. Drop ends a sounding in
    any state but ended, and always carries a reason.
60. Go on starts the next round in the same place, with the operator's
    notes kept beside the brief whole and unchanged. Notes given apart
    from a decision change nothing.
61. Accept settles the sounding. sounding keeps the conclusion, and
    hands it to the keeper of the sounding's items, once for each item
    (9). Where nothing of its kind lands, accept ends the sounding.
62. Where its kind lands something, accept has sounding ask the launcher
    to submit what lands, and the sounding is landing until the launcher
    reports it landed, which ends the sounding. A submission that fails
    starts the sounding's next round in the same place with the
    failure's words, and that round's conclusion goes before the
    operator as any other does.
63. sounding never makes work from a conclusion. Each piece of proposed
    work of an accepted conclusion goes to the items' keeper, whose it
    is to make; with no item it stays with the conclusion for the
    operator.
64. The items' keeper is told of every decision on the sounding's
    conclusions, with a drop's reason, and of what landed. sounding
    keeps a decision whether or not the keeper has been told, and tells
    it again until it has.
65. Every response names who gave it, through which surface and when,
    and is kept with its notes or reason, whether or not it applied
    (58).
66. An ended sounding takes no further round, exit or decision. Its held
    state stays readable until the operator removes the sounding, and
    sounding never removes one itself.
108. Drop on a working sounding has the launcher stop its round's
     session, and the round ends with its session ended. No word of the
     operator's parks a working sounding.

### A.14 What sounding keeps

67. The held state outlives the place: removing a sounding's place loses
    nothing of it.
68. Only sounding writes the held state, and only on an opening, a
    round's start or end, an exit, a note, a response, a landing, or
    what waits (106). Two writes at once leave it as one or the other
    would have, never half written, and lose no exit or response.
69. Every worktree of one clone of a repository reads the same held
    state for each of its soundings. Where several hosts share a
    repository's soundings, each reads every sounding's held state
    through the repository's own remote, and the held state is never
    kept in a repository of its own.
70. A conclusion, a note, an offer and a response never change once
    kept.
71. sounding never judges a brief, an input, a finding or a conclusion,
    and no model runs inside sounding.
72. sounding reaches every seam with the operator's own sign-ins or with
    none, and never keeps a credential in its held state.
109. No branch holds any of a sounding's held state, its own branch and
     its base among them, and no place's tree holds it. What lands never
     carries it, and a session's work in its place never touches it.

### A.15 Openers and surfaces

73. A sounding works the same whoever opened it. Its brief, kind, place,
    rounds, exits and the shape of its conclusion never depend on its
    opener or its items' keeper. Only where its requests are put, and
    who is told of its decisions, do.
74. Reading one held state gives the same result whoever reads it and
    through whichever surface.
75. Every surface reads and acts through one core. No surface computes a
    state, starts a round, applies a response of its own, or drives a
    terminal or an agent.
76. Everything sounding gives a reader has one form a program reads, the
    same through every surface, and that form only ever gains fields.
77. Listing soundings, or reading one, reaches no session, place, inbox
    or item's keeper, and writes nothing, beyond what waits, which every
    call does first (106).

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The launcher

sounding drives no terminal and makes no place of its own. Where a
round's session runs, such as beside the operator's own for a round
with the operator, is a setting sounding hands the launcher, and the
launcher alone drives the terminal.

78. **launch**: given a repository, its base, a sounding's name, its
    kind, and everything the first round's session is handed (29) with
    its ending and where it runs, a place on a new branch for the
    sounding with that session started in it; or a refusal because the
    branch exists (4, 18).
79. **start**: given a place and everything the next round's session is
    handed, a fresh session in the same place, the last one ended first.
    A start is judged by evidence that the session exists, never by the
    return of what started it, and a start repeated for a session that
    exists starts none.
80. **state**: given a place, whether its session works, is quiet, waits
    on a reply, has stopped, or is gone.
81. **tell**: given a place and words, the words delivered to its
    session once it is not working, never interrupting one that works
    (52).
82. **stop**: given a place, its session ended; ending one already gone
    changes nothing.
83. **submit**: given a place, a revision of its branch and what lands,
    a submission of exactly that to the base; and later, that it landed,
    or that it failed with the failure's words (24, 62).
84. **end**: given a place and that its work is done or dropped, the
    place removed, its branch kept while it holds a commit its base
    lacks (22).
85. The guarantee: a place holds its base's revision and its own
    sessions' work, and nothing of any other place (20). The launcher
    runs and settles each round. It holds a self-closing round's
    session, and a standing one after its finish, until sounding keeps
    its conclusion or its note, sending it back when it would stop
    before (48, 49). It notices a session that stops, hangs or goes with
    no one watching, and reports it at the next state (106). It alone
    drives the terminal. It submits only what sounding asks it to, and
    nothing a session does submits (25).

### B.2 The kinds

86. **resolve**: given a kind's name, a repository's base revision and
    an opening's own declaration if it carries one, the one declaration
    the name resolves to, or a refusal naming the name (11, 12).
87. The guarantee: one name resolved against one revision and one
    opening's declaration gives the same kind every time.

### B.3 The operator

88. **put**: given a conclusion or an ask and the choices it offers, a
    request on one surface.
89. **read**: given a request, the operator's response with its notes or
    reason, who gave it and when; or that none is given yet.
90. **withdraw**: given a request, its removal from its surface (58).
91. The guarantee: a response is read at least once and names its
    request, so a repeat is known as one.

### B.4 The item's keeper

92. **settle**: given an item and a decision on a conclusion, with the
    conclusion and, for accept, each piece of proposed work; or an item
    and what landed; the decision or the landing recorded against the
    item (61, 63, 64).
93. The guarantee: settling one decision or one landing twice records it
    once.

### B.5 The inbox

94. **land**: given an offer, that the inbox took it, that it already
    held it, or that it refused it with the reason; or that the inbox
    could not be reached (44).
95. The guarantee: an inbox holds one capture per offer identity (42).

### B.6 The store

96. **read**: given a repository and a sounding's name, its held state
    and the version it was read at.
97. **list**: given a repository, every sounding of it that has held
    state.
98. **write**: given a sounding, the version read and the next held
    state. The write is all or nothing, and succeeds only if the held
    state is still at the version read (68).
99. The guarantee: what the store holds outlives every place (67) and
    sits on no branch (109). Every worktree of one clone reaches the
    same store, and every host that shares a repository's soundings
    reaches it through the repository's own remote (69).

### B.7 Binding the contracts

100. Each seam is bound by naming a profile of Part C. The operator's
     settings bind every seam, and a repository's own declaration may
     bind any seam for its soundings in their place. The item's keeper
     and the inbox may each be bound to none, and any number of surfaces
     bind the operator at once (58).
101. One conformance suite holds every profile to Parts A and B; a
     profile that fails it is not one.

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile.

### C.1 Names

A name is a short phrase of the brief's words in lower case, joined by
hyphens: `take-react-19`. The opener gives it, or sounding makes it from
the brief's first six words, and refuses one that comes out empty or a
number. Every elaboration kind names its places' branches
`sounding/<name>`: the prefix is the kind's, and flume takes it with the
kind sounding hands it (C.2). The base is the repository's default
branch when the opener names none, read from `origin/HEAD` where it is
set and from the local default branch otherwise.

### C.2 The launcher

| profile | launch, start, state, tell, stop | submit, end |
|---|---|---|
| **flume** | `flume launch` with the sounding's kind carried by the launch as a flume kind with one stage, `round`, whose branches are `sounding/<name>`. A self-closing or standing round's stage delivers a report: the conclusion `sounding conclude` writes into the sounding's record (C.7). Its stopping short is the note `sounding note` gives. A round with the operator is a conversation, which sounding ends with `flume finish` once its session concludes or leaves a note, or the operator ends it. Start is a retry of that stage with the round's hand-off as its words, a go on's notes among them; state from `flume status --json`; `flume tell` and `flume stop`. Where the session runs is the launch's agent settings: a herdr pane, beside the operator's own for a round with the operator | the launch holds the submission on sounding's word. Accept releases it by a retry that names the submission, and flume submits what lands through its merge queue, sluice, and reports the landing or the failure. Accept of a kind that lands nothing is `flume done`, and drop is `flume drop`. flume's tidying removes the place and keeps the branch |
| **Flywheel** | Flywheel, which runs each of its elaborations as a sounding | Flywheel's own landing, onto the intent's line |

flume runs and settles each round. The stop hook of flume's Claude Code
plugin settles a round the moment its agent goes quiet. Its stop check
holds a self-closing round's session, and a standing one after its
finish, to the conclusion or the note. flume's herdr plugin catches
a session that crashed, hung or was killed. Without herdr, flume
settles a round only when a flume command runs, so a sounding's rounds
run unattended only under herdr with flume's plugin.

A start hook in sounding's Claude Code plugin hands the session the
rest of its round's hand-off: the brief, the inputs, the records of
earlier soundings, and the earlier rounds. The launch's agent settings
put `SOUNDING_ROUND` in the session's environment, and sounding's
command line and MCP tools refuse `accept`, `go-on` and `drop` wherever
it is set, on every sounding (34).

### C.3 Kinds

| declaration | where it is read |
|---|---|
| **sounding's own** | built in: `question` |
| **a repository's** | `.config/sounding.toml` at the base's revision |
| **an opening's** | a file the opening names |

An elaboration kind's format is defined once in the family's shared
crates, beside the format of flume's kinds. A kind declares `inputs`,
the files of the place a round is handed beyond the opener's inputs;
`conclusion`, the sections a conclusion adds to its five; `ending`, one
of `self-closing`, `standing` and `with-operator`; `transcripts`,
whether earlier soundings' session transcripts are handed; and `lands`,
the paths of the place that land, or none. Its place-and-stage half is
a flume kind, which sounding hands flume with each launch (C.2). A
repository writing its design book might declare `writeback`:
self-closing, handed the book's outline, landing `books/` and
`design/`.

### C.4 The operator

| profile | put, read, withdraw |
|---|---|
| **Pending You** | a card: a conclusion's five parts inline with a link to the whole, and the choices accept, go on with notes, and drop with a reason; an ask's words with a free reply; the card cancelled on withdraw; who gave a response is the person Pending You names |
| **sounding's herdr plugin** | rows in flume's sidebar for the soundings that have not ended, each with its round and state. Its keys hand the operator's accept, send back, finish, drop and resume to sounding's core, send back being go on. It opens no pane, starts no agent and sends nothing to a session: a round's pane is flume's, opened from flume's row. Who gave a response is the host's user |
| **crew's rail** | one decision per sounding on the rail; crew calls sounding's command line with the operator's response |
| **Flywheel's rail** | the elaboration's decision on the page or in chat |

The command line names who gave a response as `local user`.
Annotations the operator makes on a conclusion in plannotator are the
notes of the go on that follows, and count for nothing apart from one
(60).

### C.5 Item's keepers

| profile | settle |
|---|---|
| **millpond** | the accepted conclusion kept on the record of each of the sounding's items, which curation cites when it gives a later signal on the subject the move `answered`; an item made of each piece of proposed work; go on, drop and what landed recorded against each item |
| **crew** | the conclusion shown on the rail, and each piece of proposed work turned by crew's planner into a plan entry |
| **Flywheel** | the intent keeps the conclusion, and what the elaboration's type lands reaches the intent's line |
| **none** | the conclusion and its proposed work stay in the held state for the operator |

### C.6 Inboxes

| profile | land |
|---|---|
| **millpond** | `sounding offer` prints capture contract lines with the family's shared capture crate and pipes them to `millpond land`, waiting at most 5 s. millpond's verdict on each line is the outcome. An inbox not reached in that time is handed the offer again by the next call (106) |
| **Flywheel** | the same lines through Flywheel's capture intake |
| **none** | the lines printed and kept in the held state, marked as not taken |

An offer's capture:

| field | value |
|---|---|
| `key` | `sounding/<repository>/<name>/<n>`, `<repository>` the repository's name and `<n>` the offer's number among the sounding's offers, from 1 |
| `source` | `sounding` |
| `event_at` | when the session offered it (41) |
| `title` | the finding's first line |
| `raw` | the finding whole, as `offer-<n>.md` |
| `excerpt` | the finding: `text` whole; `kind` `ask`; `asserted_by` `sounding/<repository>/<name>`; `assertion` the finding in one sentence, as the session gives it; `subjects` and `argues_with` as the session gives them; `position` `offer <n>` |

`sounding offer` takes `--key` for a key of the session's own (36).

### C.7 Store: the record beside the clone

| profile | read | list | write |
|---|---|---|---|
| **the clone** | the files under `<common>/sounding/<name>/`, `<common>` the clone's common git directory, which every worktree of the clone shares, with their `version` as the version read | the folders under `<common>/sounding/` | the next files written whole and moved into place under sounding's lock in `<common>/sounding/`, refused when `version` has moved since the read (68) |
| **the clone and its remote** | the clone's read, once the tree at `refs/sounding/<name>` on the repository's own remote is fetched into the clone's files | the folders under `<common>/sounding/` and the refs under `refs/sounding/` on the remote | the next tree committed onto `refs/sounding/<name>` and pushed with lease on the commit read, then the clone's write; a refused push refuses the write (98) |

A sounding's record is a folder of files, each naming its format and
its version. `brief.md` holds the brief, the inputs, and the operator's
notes and replies. `conclusion.md` holds the conclusion of a round
awaiting its decision, and is the report flume's round stage delivers
(C.2). `rounds/<n>.md` holds each ended round, with how it ended and the
decision on it, and `offers/<n>.md` and `asks/<n>.md` each offer and
ask. `requests.rec` holds each request with its surface's handle and
whether it was withdrawn, and `responses.rec` every response, applied
or not (65). `sounding.rec` holds the name, the base and its revision,
the kind and its declaration, the items and the soundings it is based
on. It also holds each round's ending, start and end, and the landing.

The record outlives the place because it sits in the clone, beside
every worktree and on no branch (67, 109). A sounding's branch holds
only its sessions' commits, and its kind's `lands` decides which paths
of them reach the base.

### C.8 Bindings

The operator's settings, `$XDG_CONFIG_HOME/sounding/config.toml`, name
each seam's profile under `[bindings]`. A repository's `[bindings]` in
`.config/sounding.toml`, read at the base's revision, bind any seam for
its own soundings in their place (100).

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** One sounding works one brief over the inputs its opener
  named, in one place, with one session per round, and each conclusion
  gets one decision (1, 18, 27, 57).
- **I2.** Only what an accepted conclusion's kind names ever reaches the
  base from a sounding, and only the launcher submits it (24,
  25).
- **I3.** Only the operator decides a conclusion, and only once
  (57, 58).
- **I4.** A conclusion never reaches an inbox; only offers do
  (40).
- **I5.** No self-closing round, and no standing round after its
  finish, ends without a conclusion or a note, unless its session is
  gone or was ended (31, 48, 49).
- **I6.** sounding judges nothing and makes no work (63,
  71).
- **I7.** A sounding never changes a sounding it is based on
  (17).
- **I8.** No branch holds a sounding's held state, so what lands never
  carries it (24, 109).
- **I9.** sounding keeps no clock and drives no terminal: the launcher
  runs and settles every round (75, 85, 106).

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Making places, running agents, driving a terminal, or submitting
  work. The launcher does that, and sounding names only where a round's
  session runs.
- Keeping a clock or a watch. The launcher settles each round, and
  sounding acts when it is called (106).
- Testing work, or deciding what a gate requires. The repository's own
  gate does that, for what a sounding lands and for the work an
  accepted conclusion proposes.
- Planning across items, or ordering work across teams. A planner does
  that.
- Curation: reading signals, giving them moves, or making items.
- Keeping an inbox.
- Keeping a conclusion in the repository's own files. A conclusion
  lives in the held state and with its items' keeper, and reaches the
  repository only as what its kind lands.
- A place in several repositories. A sounding works in one repository's
  place, and its session reads any other.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- Repositories are git repositories, and a place is a working copy of
  one on a branch of its own.
- flume is the launcher. It makes places, starts each stage's agent,
  settles each stage's end, submits through the repository's merge
  queue and tidies, and it keeps only the live state of the places it
  runs. It alone drives the terminal.
- A round's session is an agent session in a terminal, which can be
  handed what it needs at its start and asked before it stops.
- Work lands only through its repository's own gate.
- A finding reaches an inbox as a capture in the capture contract,
  which the family's shared crates define and implement once, and in
  which a capture may be its own excerpt.
- An elaboration kind's format is defined once in the family's shared
  crates, beside the format of flume's kinds.
- A tool's records about one repository stay with that repository: in
  its clone, and under `refs/<tool>/` on its own remote when hosts
  share them, never in a repository of their own.
- Flywheel's elaborations run on sounding once Flywheel hosts. sounding
  keeps the shape of Flywheel's elaboration: the three endings are
  Flywheel's elaboration types, conclude is an elaboration finishing
  with its deliverables, ask is one waiting on the operator, and offer
  is one offering a finding.
- sounding is free and open source.

The rest of the stack, which a model builds on unless it says why not:

- One static binary, written in Rust, as sluice is, built on the
  family's shared crates.
- Everything sounding gives a reader as JSON on request, the form of
  (76).
- A command line: `sounding open`, `list`, `conclude`, `note`, `offer`,
  `ask`, `accept`, `go-on`, `finish`, `drop` and `resume`. Accept, go-on
  and drop take the sounding alone, since at most one conclusion of a
  sounding waits at a time.
- Two plugins kept outside the core, as sluice keeps its plugins: a
  Claude Code plugin that gives every session `/sound <brief>`, the
  start hook, and the MCP tools `soundings`, `conclusion`, `accept`,
  `go_on`, `finish` and `drop`; and a herdr plugin that shows rows in
  flume's sidebar, hands the operator's responses to the core, and
  drives nothing in herdr. Every `sounding` command, and each refresh of
  the herdr plugin, first does what waits (106).
- The launcher is flume, sessions are Claude Code in herdr panes,
  requests are Pending You cards and the herdr plugin's rows,
  conclusions are annotated in plannotator, the inbox and the item's
  keeper are millpond, and the gate is sluice.
- The profiles of Part C first: flume; sounding's own and a
  repository's kinds; Pending You and sounding's herdr plugin; millpond
  and none, as keeper and as inbox; and both stores.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- How does only what lands reach the base without the rest of the
  sounding's branch: a branch of its own cut from the base holding only
  those paths, those paths applied as one commit, or another way, and
  does the launcher make it (24, 26)? flume's
  statement asks the same of the launcher.
- How does a reader on another host than a place's learn whether its
  round's session lives, when the launcher reports only the places on
  its own host (54, 69, 74)?
- How does flume hold a standing round: what keeps its quiet session
  from being sent back before the operator's finish, and what holds it
  to a conclusion or a note after (49, 85)?
- How is a repository named in an offer's key, so that two repositories
  whose soundings offer into one inbox never share a name (42, C.6)?
- May a sounding be based on a sounding of another repository, and how
  does it read that one's held state when the store lists by
  repository (15, 97)?
- In what form does a kind hand earlier soundings' session transcripts,
  and where are they kept once a place is gone (16)?
- Does material arriving on a standing round's subject reach its quiet
  session, as words told to it, and who sends it (49)?
- May the operator drop a landing sounding while its submission waits
  in the gate, and what becomes of the submission (59,
  62)?

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** A person working in a session opens a sounding on whether to
  take a library's next major release. The launcher makes a place of
  its own, and its first round's session starts with the brief and the
  release's notes. The session reads the library's repository and its
  migration guide on the web for itself. The person's session goes on
  with its own work and never waits.
- **S2.** A self-closing round's session tries to stop having written
  neither a conclusion nor a note. It is sent back, concludes, and the
  operator is asked for a decision.
- **S3.** An opener opens a sounding based on three earlier ones, one of
  them dropped and one still parked. Its first round is handed each
  one's record whole and its branch as a pointer, and reads one branch's
  prototype for itself. The three earlier soundings are unchanged.
- **S4.** A session asks which of two upstream forks the operator wants
  the repository to follow. The sounding shows as waiting on the
  operator. An hour later the operator replies, and the session goes
  on.
- **S5.** A session offers two findings beyond its brief, one of them
  twice. The inbox holds two captures, and the session never stopped
  working to make either offer.
- **S6.** The operator sends a conclusion back with notes made on it.
  The next round starts in the same place with the prototype still
  there, the notes beside the brief word for word, and the first
  round's conclusion among what it is handed.
- **S7.** A conclusion is before the operator on a card and in the
  herdr sidebar. The operator accepts it in the sidebar. The card is
  withdrawn, and a response given on it later is reported as not
  applied.
- **S8.** An inbox sends a sounding two items it joined. The operator
  accepts a conclusion that proposes a bump and a documentation change.
  The inbox keeps the conclusion on both items and makes two new items;
  sounding makes none. The bump lands on a branch of its own through
  the gate, and no commit of the sounding's branch is in it.
- **S9.** The operator drops a sounding with a reason. Its place is
  removed, its branch and held state stay readable, and the offers it
  made stay in the inbox.
- **S10.** The operator accepts a conclusion of a repository's writeback
  kind. The launcher submits only the chapters the kind lands, and they
  reach the base through the gate with no prototype file and none of
  the held state. The sounding ends once they land, its place is
  removed, and its branch is kept.
- **S11.** The submission of an accepted conclusion fails in the gate.
  The sounding's next round starts in the same place, handed the
  failure's words, and its conclusion goes before the operator. The
  operator accepts it, and the chapters land.
- **S12.** A standing round's session falls quiet with no conclusion
  and is not sent back. Over a day the operator tells it two more
  things, then says finish, and the session concludes.
- **S13.** The operator opens a sounding to work in conversation. Its
  session starts in a pane beside the operator's own, and the
  conversation goes on with no stop check until the session concludes.
- **S14.** The host restarts while a round runs, and its session is
  gone. The sounding shows as parked. The operator resumes it, and the
  next round starts in the same place from what the last one left.
- **S15.** sounding runs with no inbox and no item. An offer is kept in
  the held state as not taken, and an accepted conclusion stays
  readable from the held state.
- **S16.** Two soundings run in one repository at once, and neither
  waits on the other. A third opened under the first one's name is
  refused, naming the first.
- **S17.** A person reads a sounding through the command line, an agent
  through its session's tools and the operator through the herdr
  sidebar. All three see the same state and the same conclusion.
- **S18.** A session asks the operator something, then concludes before
  any reply. The ask closes with no reply, its card is withdrawn, and
  the conclusion goes before the operator.
- **S19.** A round's session tries to accept its own sounding's
  conclusion, then another sounding's. Both are refused, and both
  conclusions still wait on the operator.
- **S20.** A session offers a finding while the inbox cannot be reached.
  The offer is kept as not taken, and the session goes on. Later the
  operator lists soundings, the inbox answers, and the offer is taken,
  with nothing of sounding's running in between.
- **S21.** Two hosts share a repository's soundings. A sounding opened
  on one is read on the other with the same brief, rounds and
  conclusion, and the chapters it lands carry none of its record.

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of sounding that satisfies Parts A and B: its components, a
sounding's states and how each round starts and ends, the held state
and the kinds' declarations with fixed examples, and how the launcher,
the kinds, a surface, an item's keeper, an inbox and a store are bound.
A conformance suite whose scenarios each cite the clauses they
exercise, failing when a clause is cited by nothing. The profiles of
Part C, each passing the suite.

<!-- ANCHOR_END: deliver -->
