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
through the launcher, and a prototype never does. A finding beyond the
brief goes to an inbox as a capture of its own. sounding works the same
for a person alone, for an inbox that sends it items and for a planner,
and needs none of them. It never submits, never decides a conclusion
and never makes work of one: the operator decides, whoever keeps the
items makes the work, and the launcher submits what lands through the
repository's own gate.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **the operator** | every decision on a conclusion: accept, go on or drop; every reply to an ask; when a standing round finishes; when a parked sounding resumes; the ending of every round after the first; what they tell a round's session; when a sounding's branch and held state are removed | they never have a sounding land more than its kind names |
| **an opener** (a person in a session, an inbox, a planner, another tool's surface) | which brief to open, in which repository and on which base, with which inputs and which earlier soundings, under which name, for which items, of which kind, and the first round's ending | it never decides a conclusion, and never changes a brief or its inputs once the sounding is open |
| **the repository's authors** | the kinds the repository declares, and what each lands | they never make a sounding land what its operator did not accept |
| **a round's session** (an agent working one round) | everything inside its place: what to read, try, build and run; what to read beyond its place; when to conclude; what to offer; what to ask | it never moves sounding's state but through its exits and its note, never acts on another sounding or changes one it is based on, never decides a conclusion, and never submits, merges or lands its place's work |
| **the launcher** (a separate tool that makes places and runs agents in them) | how a place is made and removed, and how a session is started, followed and ended, as Part B fixes them | it never starts a round sounding did not ask for, and never submits what sounding did not ask it to |
| **sounding** | when a round starts and ends, as this statement fixes them; when to ask the launcher to submit what an accepted conclusion lands; and what it keeps | it never judges a brief, an input, a finding or a conclusion, never writes a conclusion or a note of its own, never decides a conclusion, never submits, merges or lands a branch itself, and never makes work from a conclusion |
| **a surface** (where the operator reads a sounding and responds to it) | how a sounding is shown | it never gives a response of its own; it carries the operator's |
| **an item's keeper** (an inbox, a planner) | what the item holds of a decision, and how the work an accepted conclusion proposes becomes work | it never decides a conclusion, and never writes sounding's held state |
| **an inbox** | what becomes of an offer once it takes it | it never changes an offer sounding keeps |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **repository**: a git repository a sounding's place is made of.
- **brief**: what a sounding is opened to settle or to write, in its
  opener's words: one question or several, or the writing it is to
  make.
- **input**: material a sounding is worked from, as its opener names
  it: an item, a signal with its excerpts, a capture, a meeting's
  transcript, what another tool says of a release, a file, or an
  earlier sounding.
- **opener**: whoever opens a sounding.
- **item**: a unit of work another tool keeps; an opener may name one or
  more as a sounding's inputs.
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
  follows each round's session in it, submits what lands, and removes
  the place.
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
- **note**: what a round's session leaves when it stops without
  concluding: what the round did, and where the next round would start.
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
- **stop check**: sounding's say, each time a round's session would stop
  before its round may end, on whether it may.
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
9. A sounding answers for none, one or several items, named when it
   opens and all kept by one keeper, and never for another. Every item
   it answers for is among its inputs.

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

### A.5 What lands

24. Only what lands ever reaches the base from a sounding, as the
    sounding's branch holds it at the accepted conclusion's revision. A
    prototype, the held state and everything else in the place never
    land.
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

### A.7 Exits

33. A round's session acts on sounding, an inbox or the operator only
    through its three exits, and through its note when it stops without
    concluding. Nothing it writes in its place by other means is a
    conclusion, an offer, an ask or a note.
34. A session never decides a conclusion, its own or another's.
35. An exit acts only on the round it serves. An exit naming another
    sounding, an ended sounding, or a round that has ended is refused.
36. Every exit and every decision is safe to repeat: a repeat of one
    already kept changes nothing.

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

41. An offer carries one finding, whole as its session wrote it, the
    sounding it came from, and when it was offered. Its time is when the
    session offered it, never when an inbox took it.
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

### A.12 States

53. Every sounding is in exactly one state at any moment, and an ended
    sounding never leaves its state.
54. A sounding's state is derived from its held state, from whether its
    round's session lives, and from what the launcher reports of its
    submission, and from nothing else. No surface keeps a state of its
    own.
55. A sounding that has not ended is parked exactly when no round runs,
    no request of it waits and it is not landing. Its last round ended
    on a note, or with its session gone or ended without an exit.
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
    hands it to the keeper of the items the sounding answers for, once
    for each item (9). Where nothing of its kind lands, accept ends the
    sounding.
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
    and is kept with its notes or reason.
66. An ended sounding takes no further round, exit or decision. Its held
    state stays readable until the operator removes the sounding, and
    sounding never removes one itself.

### A.14 What sounding keeps

67. The held state outlives the place: removing a sounding's place loses
    nothing of it.
68. Only sounding writes the held state, and only on an opening, a
    round's start or end, an exit, a note, a response or a landing. Two
    writes at once leave it as one or the other would have, never half
    written, and lose no exit or response.
69. Every checkout of a repository reads the same held state for each of
    its soundings.
70. A conclusion, a note, an offer and a response never change once
    kept.
71. sounding never judges a brief, an input, a finding or a conclusion,
    and no model runs inside sounding.
72. sounding reaches every seam with the operator's own sign-ins or with
    none, and never keeps a credential in its held state.

### A.15 Openers and surfaces

73. A sounding works the same whoever opened it. Its brief, kind, place,
    rounds, exits and the shape of its conclusion never depend on its
    opener or its items' keeper. Only where its requests are put, and
    who is told of its decisions, do.
74. Reading one held state gives the same result whoever reads it and
    through whichever surface.
75. Every surface reads and acts through one core. No surface computes a
    state, starts a round or applies a response of its own.
76. Everything sounding gives a reader has one form a program reads, the
    same through every surface, and that form only ever gains fields.
77. Listing soundings, or reading one, reaches no session, place, inbox
    or item's keeper, and writes nothing.

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The launcher

sounding drives no terminal and makes no place of its own. Where a
round's session runs, such as beside the operator's own for a round
with the operator, is a setting sounding hands the launcher.

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
    asks sounding each time a self-closing round's session, or a
    standing one after its finish, would stop, and keeps it working when
    sounding sends it back (48, 49). It submits only what sounding asks
    it to, and nothing a session does submits (25).

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
99. The guarantee: what the store holds outlives every place (67), and
    every checkout of one repository reaches the same store (69).

### B.7 Binding the contracts

100. Each seam is bound by naming a profile of Part C. The item's keeper
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
hyphens, as the opener gives it or as sounding makes it from the brief:
`take-react-19`. The sounding's branch is `sounding/<name>`, and its
base is the repository's default branch when the opener names none.

### C.2 The launcher

| profile | launch, start, state, tell, stop | submit, end |
|---|---|---|
| **flume** | `flume launch` with the sounding's kind carried by the launch as a flume kind with one stage, `round`, whose deliverable is a committed report, `.sounding/conclusion.md`, and whose stopping short is the note; start is a retry of that stage with the round's hand-off as its words; state from `flume status --json`; `flume tell` and `flume stop`; where the session runs is the launch's agent settings, a herdr pane, beside the operator's own for a round with the operator | flume submits what lands through its merge queue, sluice, and reports the landing or the failure; the end is the caller's word that the place's work is done, or `flume drop`, and flume's tidying removes the place and keeps the branch |
| **Flywheel** | Flywheel's engine, each elaboration a sounding, on Flywheel's templates for a place, a session and a stage | Flywheel's own landing, onto the intent's line |

flume's stop check is the stop check: it holds a self-closing round's
session, and a standing one after its finish, to the conclusion or the
note. A start hook in sounding's Claude Code plugin hands the session
the rest of its round's hand-off: the brief, the inputs, the records of
earlier soundings, and the earlier rounds.

### C.3 Kinds

| declaration | where it is read |
|---|---|
| **sounding's own** | built in: `question` |
| **a repository's** | `.config/sounding.toml` at the base's revision |
| **an opening's** | a file the opening names |

A kind declares `inputs`, the files of the place a round is handed
beyond the opener's inputs; `conclusion`, the sections a conclusion
adds to its five; `ending`, one of `self-closing`, `standing` and
`with-operator`; `transcripts`, whether earlier soundings' session
transcripts are handed; and `lands`, the paths of the place that land,
or none. A repository writing its design book might declare `writeback`:
self-closing, handed the book's outline, landing `books/` and
`design/`. `lands` never names `.sounding/`.

### C.4 The operator

| profile | put, read, withdraw |
|---|---|
| **Pending You** | a card: a conclusion's five parts inline with a link to the whole, and the choices accept, go on with notes, and drop with a reason; an ask's words with a free reply; the card cancelled on withdraw |
| **sounding's herdr plugin** | rows in flume's sidebar for the soundings that have not ended, each with its round and state; keys start, open, accept, send back, finish and drop a sounding through sounding's core, send back being go on, and open the round's pane, which is flume's; a key opens the conclusion in plannotator, and the annotations given there are the notes of the go on that follows. The plugin drives no agent. |
| **crew's rail** | one decision per sounding on the rail; crew calls sounding's command line with the operator's response |
| **Flywheel's rail** | the elaboration's decision on the page or in chat |

### C.5 Item's keepers

| profile | settle |
|---|---|
| **millpond** | the accepted conclusion kept on the record of each item the sounding answers for, which curation names when it answers a later signal on the subject; an item made of each piece of proposed work; go on, drop and what landed recorded against each item |
| **crew** | the conclusion shown on the rail, and each piece of proposed work turned by crew's planner into a plan entry |
| **Flywheel** | the intent keeps the conclusion, and what the elaboration's type lands reaches the intent's line |
| **none** | the conclusion and its proposed work stay in the held state for the operator |

### C.6 Inboxes

| profile | land |
|---|---|
| **millpond** | `sounding offer` prints capture contract lines with flywheel-next's capture crate and pipes them to `millpond land`; millpond's verdict on each line is the outcome |
| **Flywheel** | the same lines through Flywheel's capture intake |
| **none** | the lines printed and kept in the held state, marked as not taken |

An offer's capture:

| field | value |
|---|---|
| `key` | `sounding/<name>/<n>`, `<n>` the offer's number among the sounding's offers, from 1 |
| `source` | `sounding` |
| `event_at` | when the session offered it (41) |
| `title` | the finding's first line |
| `raw` | the finding whole, as `offer-<n>.md` |
| `excerpt` | the finding: `text` whole; `kind` `ask`; `asserted_by` `sounding/<name>`; `assertion` the finding in one sentence, as the session gives it; `subjects` and `argues_with` as the session gives them; `position` `offer <n>` |

### C.7 Store: the sounding's branch

| operation | how the sounding's branch satisfies it |
|---|---|
| read | the files under `.sounding/` at the tip of `sounding/<name>`: `brief.md` with the inputs and the operator's notes; `conclusion.md` for a round awaiting its decision; `rounds/<n>.md` for each ended round, with how it ended and the decision on it; `offers/<n>.md` and `asks/<n>.md`; and `sounding.rec`, holding the name, the base and its revision, the kind and its declaration, the items, the soundings it is based on, each round's ending, start and end, and the landing |
| list | the repository's `sounding/*` branches |
| write | a commit of `.sounding/` alone, made in the place while it exists and on the branch after, refused when the branch has moved since the read (68) |

The held state outlives the place because the branch does: its commits
never land, so the branch always holds a commit its base lacks and the
launcher keeps it (22, 67). Every worktree of the
repository reads it (69).

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

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Making places, running agents, or submitting work. The launcher does
  that.
- Testing work, or deciding what a gate requires. The repository's own
  gate does that, for what a sounding lands and for the work an
  accepted conclusion proposes.
- Planning across items, or ordering work across teams. A planner does
  that.
- Curation: reading signals, giving them moves, or making items.
- Keeping an inbox.
- A place in several repositories. A sounding works in one repository's
  place, and its session reads any other.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- Repositories are git repositories, and a place is a working copy of
  one on a branch of its own.
- flume is the launcher. It makes places, starts each stage's agent,
  submits through the repository's merge queue and tidies, and it keeps
  only the live state of the places it runs.
- A round's session is an agent session in a terminal, which can be
  handed what it needs at its start and asked before it stops.
- Work lands only through its repository's own gate.
- A finding reaches an inbox as a capture in the capture contract that
  Flywheel's statement (`design/flywheel-next/requirements.md`)
  defines, in which a capture may be its own excerpt.
- Flywheel's elaborations run on sounding once Flywheel hosts. sounding
  keeps the shape of Flywheel's elaboration (its clauses 24, 25, 58, 62
  and 65): the three endings are Flywheel's elaboration types, conclude
  is an elaboration finishing with its deliverables, ask is one blocked
  on a question, and offer is one offering a finding.
- sounding is free and open source.

The rest of the stack, which a model builds on unless it says why not:

- One static binary, written in Rust, as sluice is.
- Everything sounding gives a reader as JSON on request, the form of
  (76).
- A command line: `sounding open`, `list`, `conclude`, `offer`, `ask`,
  `accept`, `go-on`, `finish`, `drop` and `resume`.
- Two plugins kept outside the core, as sluice keeps its plugins: a
  Claude Code plugin that gives every session `/sound <brief>`, the
  start hook, and the MCP tools `soundings`, `conclusion`, `accept`,
  `go_on`, `finish` and `drop`; and a herdr plugin with rows in flume's
  sidebar and its keys.
- The launcher is flume, sessions are Claude Code in herdr panes,
  requests are Pending You cards and the herdr plugin's rows,
  conclusions are annotated in plannotator, the inbox and the item's
  keeper are millpond, and the gate is sluice.
- The profiles of Part C first: flume; sounding's own and a
  repository's kinds; Pending You and sounding's herdr plugin; millpond
  and none, as keeper and as inbox; and the sounding's branch.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- How does only what lands reach the base without the rest of the
  sounding's branch: a branch of its own cut from the base holding only
  those paths, those paths applied as one commit, or another way, and
  does the launcher make it (24, 26)? flume's
  statement asks the same of the launcher.
- Where is the held state stored: on the sounding's branch, as C.7 has
  it, or in a store the family shares? It is ruled with the family's
  storage (plan step D4) (67, 69).
- Do sounding's kinds and flume's kinds share one declaration in a
  repository, or does each tool read its own (11)?
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
- Does an offer's identity carry its repository into what an inbox
  keys it by, or is a name unique across every repository whose
  soundings offer into one inbox, as a planner's inbox holding several
  repositories needs (3, 42)?
- Is a sounding's branch pushed to its repository's remote, so work
  built on another host can read the revision a conclusion names, and
  does the held state travel with it (21, 69)?
- With an inbox bound, does a sounding opened by a person or by another
  tool's surface, with no item, get an item of its own (9,
  61)?
- Where else does an accepted conclusion live: does its repository keep
  it in its own record, as a repository keeps its explorations
  (61, 66)?
- Is a note given through an act of its own, as an exit is, or taken
  from what the session leaves in its place when it stops (33,
  51)?
- May the operator park a working sounding by their word, ending its
  session with the round's work committed (28, 55)?
- Is a session a host brings back after a restart the same session, or
  a gone one whose sounding is parked (31, 55)?
- Is a conclusion of a round with the operator decided in the
  conversation, or put before the operator on the same surfaces as any
  other (50, 58)?
- May an offer carry material beyond its text, such as what a prototype
  printed, as its capture's raw material (41)?

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
