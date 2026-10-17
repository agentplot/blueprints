# sounding — requirements
<!-- ANCHOR: preamble -->

A statement of what sounding must always do and never do, written to
admit any model that satisfies it.

The statement is in three parts. Part A is what must hold of sounding
on its own: one question and its sources, the place it is worked in,
the rounds that work it and the exits a round's session has, the stop
check and the timebox that bound a round, the operator's decision on
each conclusion, and what sounding keeps. Part B is its contracts: the
operations it needs across its six seams, a place, a session, the
operator, an item's keeper, an inbox and a store, and the guarantee
each must give. Part C is the profiles: the ways each contract is
satisfied.

Parts A and B name no mechanism: no command, file, format, field,
service or tool. One thing of the world they name freely, because
section 9 fixes it: git. Every other real tool is named only in section
9 and in Part C. A reader who has never seen an elaboration or an
agent's plugins should be able to design from Parts A and B and git
alone.

## 1. Purpose

sounding works one question to a conclusion the operator decides. Some
work ends in an answer before it ends in a change: whether to take a
major release, how to settle what a meeting left open, whether an
approach holds once someone tries it. sounding gives such a question a
place of its own in the repository it is about, starts one session
there per round with the question and what is already known about it,
and ends each round on a conclusion: the answer, its evidence, what it
would change, the work it proposes and what stays open. The operator
accepts the conclusion, sends it back for another round, or drops it. A
finding beyond the question goes to an inbox as a capture of its own.
sounding works the same for a person alone, for an inbox that sends it
a question and for a planner, and needs none of them. It never lands
what its place holds, never decides a conclusion and never makes work
of one: the operator decides, whoever keeps the question's item makes
the work, and the work lands through the repository's own gate.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **the operator** | every decision on a conclusion: accept, go on or drop; every reply to an ask; when a parked sounding resumes; the timebox of every round after the first; the operator's settings; when a sounding's branch and held state are removed | they never have sounding land a sounding's branch |
| **an opener** (a person in a session, an inbox, a planner, another tool's surface) | which question to open, about which repository and from which revision, with which sources, under which name, for which item, and the first round's timebox and way of running | it never decides a conclusion, and never changes a question once it is open |
| **a round's session** (an agent working one round) | everything inside its place: what to read, try, build and run; when to conclude; what to offer; what to ask | it never moves sounding's state but through its exits and its note, never acts on another sounding, never decides a conclusion, and never submits its place's work to land |
| **sounding** | when a round starts and ends, as this statement fixes them, and what it keeps | it never judges a question, a source, a finding or a conclusion, never writes a conclusion or a note of its own, never decides a conclusion, never lands, merges or submits a branch, and never makes work from a conclusion |
| **a surface** (where the operator reads a sounding and responds to it) | how a sounding is shown | it never gives a response of its own; it carries the operator's |
| **an item's keeper** (an inbox, a planner) | what the item holds of a decision, and how the work an accepted conclusion proposes becomes work | it never decides a conclusion, and never writes sounding's held state |
| **an inbox** | what becomes of an offer once it takes it | it never changes an offer sounding keeps |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **repository**: a git repository a question is about.
- **question**: what a sounding works: one question about one
  repository, whose answer the operator decides before any work the
  answer implies begins.
- **sources**: the material a question starts from, as its opener names
  it: signals with their excerpts, the captures they came from, a
  release's brief, a meeting's transcript, an earlier conclusion.
- **opener**: whoever opens a sounding.
- **item**: a unit of work another tool keeps; some items are questions
  a sounding can work.
- **item's keeper**: the tool that keeps an item.
- **sounding**: one question, worked in one place one round at a time,
  until the operator accepts or drops it; also the tool that runs them.
- **name**: the words that tell one sounding from the other soundings of
  its repository.
- **place**: a working copy of the repository prepared for one
  sounding, on the sounding's own branch.
- **round**: one session's run at the question, from its start to its
  end.
- **starter**: whoever starts a round: the opener for the first round,
  the operator for every other.
- **way of running**: of a round, **unattended**, its session working
  alone, or **with the operator**, its session working in conversation
  with the operator.
- **exit**: one of three acts by which a round's session reaches beyond
  its place: **conclude**, **offer** and **ask**.
- **conclusion**: what a round ends on when its session concludes: the
  answer, its evidence, what the answer would change, the work it
  proposes, and what stays open.
- **proposed work**: one piece of the work a conclusion proposes.
- **note**: what a round's session leaves when it stops without
  concluding: what the round did, and where the next round would start.
- **finding**: something a session learns beyond its question.
- **offer**: one finding handed to an inbox as a capture of its own.
- **ask**: one thing only the operator can tell or choose, put to them
  by a round's session.
- **reply**: the operator's response to an ask.
- **request**: one conclusion or one ask put before the operator on one
  surface, for one response.
- **response**: the operator's decision on a conclusion, or reply to an
  ask.
- **decision**: the operator's response to a conclusion: **accept**, which
  settles the question; **go on**, which starts the next round with the
  operator's notes; or **drop**, which ends the sounding with a reason.
- **notes**: what the operator writes on a conclusion to shape the next
  round.
- **stop check**: sounding's say, each time an unattended round's
  session would stop, on whether it may.
- **timebox**: the longest a round may run, leaving out the time it
  waits on a reply.
- **time to conclude**: how long a session has to conclude once its
  round's timebox runs out.
- **the operator's settings**: the default timebox, the longest
  timebox a starter may name, and the time to conclude.
- **state**: of a sounding, exactly one of **working**, a round runs
  and no request of it waits; **waiting on the operator**, a request of
  it has no response yet; **parked**, no round runs and no request waits;
  **accepted**; and **dropped**.
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

### A.1 A sounding and its question

1. A sounding works exactly one question about exactly one repository.
   Its question never changes once it opens: the operator's notes and
   replies are kept beside it, never in place of it.
2. Opening a sounding never waits on its work, interrupts its opener,
   or changes the opener's own work. The session that opens a sounding
   is never a session of it.
3. Every sounding has exactly one name, fixed when it opens. A name
   says the question in words and is never an ordinal or an id, and no
   two soundings of one repository hold the same name while both have
   held state.
4. A name an opener gives that another sounding of the repository holds
   is refused, naming that sounding, and is never altered to fit.
5. A sounding's sources are exactly those its opener names. sounding
   adds none, drops none, and never judges which bear on the question.
6. Only a conclusion the operator accepted is ever handed to a session
   as an earlier conclusion on the question.
7. sounding hands the question, every source, and every note and reply
   of the operator to a round's session as given: never summarised,
   reworded, translated, cut or ranked. A source that points at
   material elsewhere is handed with its pointer.
8. Any number of soundings run at once, in one repository or in many.
   None waits on another, and nothing one does reaches another's place
   or held state.
9. A sounding answers for at most one item, named when it opens, and
   never for another.

### A.2 The place

10. Each sounding has exactly one place, made when it opens from one
    revision of its repository that its held state names, on a branch
    no other sounding, place or work shares.
11. Every round of a sounding works in its one place, and nothing a
    round leaves there is removed before the sounding ends.
12. Inside its place a round's session is free: it may read, change,
    build and run anything there. Nothing it does there reaches another
    place, or any branch but its sounding's.
13. No commit of a sounding's branch ever becomes part of a branch that
    lands work. sounding never submits, merges or lands a sounding's
    branch, and refuses every submission to land made from a
    sounding's place.
14. Every round ends with everything its session left in the place
    committed on the sounding's branch. The round's conclusion or note
    names that revision, so work built later can read what the place
    showed.
15. A sounding's place is removed when the sounding ends, and its
    branch is kept. sounding never removes a sounding's branch; only
    the operator does.
16. Opening, working and ending a sounding change no branch, place or
    working copy of its repository but the sounding's own.

### A.3 Rounds

17. A sounding's rounds are numbered from one in the order they start.
    At most one round of a sounding runs at any moment, and each round
    has exactly one session.
18. A round starts only when the sounding opens, on the operator's go
    on, on the operator's word resuming a parked sounding, or on the
    operator's reply to an ask whose session is gone.
19. A round's session is handed at its start the question, every
    source, and every note and reply of the operator (7). It is also
    handed every earlier round's conclusion or note with the decision
    on it, and the round's timebox and way of running.
20. A round's way of running is its starter's choice, fixed for the
    round.
21. A round ends in exactly one way: on a conclusion, on a note, or with
    its session gone or ended without either. sounding keeps how each
    round ended.
22. A session gone without an exit is never read as a conclusion, a
    note, a reply or a decision.

### A.4 Exits

23. A round's session reaches beyond its place only through its three
    exits, and through its note when it stops without concluding.
    Nothing it writes in its place by other means is a conclusion, an
    offer, an ask or a note.
24. A session never decides a conclusion, its own or another's.
25. An exit acts only on the round it serves. An exit naming another
    sounding, an ended sounding, or a round that has ended is refused.
26. Every exit and every decision is safe to repeat: a repeat of one
    already kept changes nothing.

### A.5 Conclude

27. A conclusion names its answer, its evidence, what the answer would
    change, the work it proposes and what stays open, and says so where
    any of them is empty.
28. A conclusion states each piece of proposed work apart from every
    other, so that each can become work of its own.
29. A conclusion ends its round. Its session does no further work on
    the sounding, and the conclusion never changes once kept.
30. A conclusion never reaches an inbox, as a capture or as part of
    one. Only offers do.

### A.6 Offer

31. An offer carries one finding, whole as its session wrote it, the
    sounding it came from, and when it was offered. Its time is when the
    session offered it, never when an inbox took it.
32. Every offer has one identity for ever: its sounding's repository
    and name, and its number among that sounding's offers. No
    two offers share an identity, and an inbox given one offer twice
    holds one capture of it.
33. An offer never holds its session. sounding keeps it at once, and
    the session goes on whether or not an inbox has taken it.
34. sounding keeps every offer whether or not an inbox took it, and
    says which. An offer no inbox could be reached for is handed again
    until an inbox takes it or refuses it, and a refused offer is kept
    with the inbox's reason.
35. Ending a sounding withdraws none of its offers.

### A.7 Ask

36. An ask puts one thing only the operator can tell or choose before
    them, and its session waits for the reply.
37. A reply goes to the session that asked if it still lives, and
    otherwise starts the sounding's next round with the ask and its
    reply (18).
38. The time a round waits on a reply never counts against its
    timebox.

### A.8 The stop check and the timebox

39. An unattended round's session never stops without having concluded
    or left a note. The stop check sends back every session that tries
    to stop with neither.
40. A note says what the round did and where the next round would
    start. sounding keeps it beside its round, and the next round's
    session is handed it (19).
41. Every unattended round has exactly one timebox, fixed when the
    round starts and never lengthened while it runs. More time on a
    question is only ever another round.
42. A round's timebox is the one its starter named, never longer than
    the longest the operator's settings allow. A round whose starter
    named none has the operator's default.
43. When a round's timebox runs out, its session concludes with what it
    knows. sounding interrupts a working session for that and for
    nothing else.
44. A session that has not concluded within the time to conclude is
    ended, and its sounding is parked with the round's work committed
    (14).
45. sounding keeps, for every round, whether it ended before its
    timebox ran out.
46. A round with the operator has no timebox and no stop check. It ends
    on a conclusion or a note its session gives, or when the operator
    ends it.

### A.9 States

47. Every sounding is in exactly one state at any moment, and an ended
    sounding never leaves its state.
48. A sounding's state is derived from its held state and from whether
    its round's session lives, and from nothing else. No surface keeps
    a state of its own.
49. A sounding that has not ended is parked exactly when no round runs
    and no request of it waits. Its last round ended on a note, or with
    its session gone or ended without an exit.
50. A parked sounding resumes only on the operator's word, which starts
    its next round in the same place from what the last round left.

### A.10 The operator's decision

51. Only the operator decides a conclusion, and each conclusion gets
    exactly one decision. A decision given once is never asked for
    again, and one that cannot be applied is reported, never discarded
    in silence.
52. A conclusion or an ask put before the operator on several surfaces
    gets one response. The first response applies, every other request
    for it is withdrawn, and a later response is reported as not
    applied.
53. Accept and go on respond to a conclusion and nothing else. Drop ends a
    sounding in any state but ended, and always carries a reason.
54. Go on starts the next round in the same place, with the operator's
    notes kept beside the question whole and unchanged. Notes given
    apart from a decision change nothing.
55. Accept ends the sounding, and its conclusion is what settles the
    question. sounding keeps it, and hands it to the item's keeper when
    the sounding answers for an item (9).
56. sounding never makes work from a conclusion. Each piece of proposed
    work of an accepted conclusion goes to the item's keeper, whose it
    is to make; with no item it stays with the conclusion for the
    operator.
57. The item's keeper is told of every decision on the sounding's
    conclusions, with a drop's reason. sounding keeps a decision
    whether or not the keeper has been told, and tells it again until
    it has.
58. Every response names who gave it, through which
    surface and when, and is kept with its notes or reason.
59. An ended sounding takes no further round, exit or decision. Its held
    state stays readable until the operator removes the sounding, and
    sounding never removes one itself.

### A.11 What sounding keeps

60. The held state outlives the place: removing a sounding's place
    loses nothing of it.
61. Only sounding writes the held state, and only on an opening, a
    round's start or end, an exit, a note or a response. Two writes at
    once leave it as one or the other would have, never half written,
    and lose no exit or response.
62. Every checkout of a repository reads the same held state for each of
    its soundings.
63. A conclusion, a note, an offer and a response never
    change once kept.
64. sounding never judges a question, a source, a finding or a
    conclusion, and no model runs inside sounding.
65. sounding reaches every seam with the operator's own sign-ins or with
    none, and never keeps a credential in its held state.

### A.12 Openers and surfaces

66. A sounding works the same whoever opened it. Its question, place,
    rounds, exits, bounds and the shape of its conclusion never depend
    on its opener or its item's keeper. Only where its requests are put,
    and who is told of its decisions, do.
67. Reading one held state gives the same result whoever reads it and
    through whichever surface.
68. Every surface reads and acts through one core. No surface computes
    a state, starts a round or applies a response of its own.
69. Everything sounding gives a reader has one form a program reads,
    the same through every surface, and that form only ever gains
    fields.
70. Listing soundings, or reading one, reaches no session, place, inbox
    or item's keeper, and writes nothing.

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The place

71. **make**: given a repository, a revision and a sounding's name, a
    place holding that revision on a new branch for the sounding, or a
    refusal because the branch exists (4, 10).
72. **commit**: given a place, a revision of its branch holding
    everything in the place (14).
73. **remove**: given a place, its removal, with every process started
    in it ended and its branch left where it was (15).
74. The guarantee: a place holds its revision and its own session's
    work, and nothing of any other place (12).

### B.2 The session

Who starts a session in a place, sounding itself or a separate tool
that makes places and starts agents, is the binding's to say. The
contract is the same either way.

75. **start**: given a place, everything a round's session is handed
    (19) and its way of running, a session. A start is judged by
    evidence that the session exists, never by the return of what
    started it, and a start repeated for a session that exists starts
    none.
76. **state**: given a session, whether it works, waits on a reply,
    has stopped, or is gone.
77. **tell**: given a session and a message, the message delivered when
    the session is not working; only the end of its timebox is
    delivered while it works (43).
78. **end**: given a session, its end; ending one already gone changes
    nothing.
79. The guarantee: the binding asks sounding each time an unattended
    session would stop, and keeps the session working when sounding
    sends it back (39). It refuses, inside the session, every
    submission to land made from the place (13).

### B.3 The operator

80. **put**: given a conclusion or an ask and the choices it offers, a
    request on one surface.
81. **read**: given a request, the operator's response with its notes or
    reason, who gave it and when; or that none is given yet.
82. **withdraw**: given a request, its removal from its surface (52).
83. The guarantee: a response is read at least once and names its
    request, so a repeat is known as one.

### B.4 The item's keeper

84. **settle**: given an item and a decision on a conclusion, with the
    conclusion and, for accept, each piece of proposed work, the
    decision recorded against the item (55, 56, 57).
85. The guarantee: settling one decision twice records it once.

### B.5 The inbox

86. **land**: given an offer, that the inbox took it, that it already
    held it, or that it refused it with the reason; or that the inbox
    could not be reached (34).
87. The guarantee: an inbox holds one capture per offer identity (32).

### B.6 The store

88. **read**: given a sounding, its held state and the version it was
    read at.
89. **list**: given a repository, every sounding of it that has held
    state.
90. **write**: given a sounding, the version read and the next held
    state. The write is all or nothing, and succeeds only if the held
    state is still at the version read (61).
91. The guarantee: what the store holds outlives every place (60), and
    every checkout of one repository reaches the same store (62).

### B.7 Binding the contracts

92. Each seam is bound by naming a profile of Part C. One profile may
    bind the place and the session at once, the item's keeper and the
    inbox may each be bound to none, and any number of surfaces bind
    the operator at once (52).
93. One conformance suite holds every profile to Parts A and B; a
    profile that fails it is not one.

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile.

### C.1 Names

A name is a short phrase of the question's words in lower case, joined
by hyphens, as the opener gives it or as sounding makes it from the
question: `take-react-19`. The sounding's branch is `sounding/<name>`,
and its place starts from the tip of the repository's default branch
when the opener names no revision.

### C.2 Places

| profile | make | commit | remove |
|---|---|---|---|
| **worktrunk** | `wt switch --create sounding/<name> --base <revision>`, so the repository's own hooks run | `git add -A` and `git commit` in the place | `wt remove`, keeping the branch |
| **git worktree** | `git worktree add -b sounding/<name> <path> <revision>` | as worktrunk | `git worktree remove`, keeping the branch |
| **a launcher** | a separate tool that makes the place and starts the session as one act, binding C.3 with it | as worktrunk | the launcher's own removal, keeping the branch |

### C.3 Sessions

| profile | start, state, tell, end | the stop check and the guard |
|---|---|---|
| **Claude Code in a herdr pane** | sounding's herdr plugin makes a workspace for the sounding, the session's pane with the conclusion beside it, and starts `claude` there; a start hook in sounding's Claude Code plugin hands the round its question, sources and earlier rounds; state and tell through herdr's agent commands | the plugin's Stop hook is the stop check; a hook before each tool call refuses `wt submit`, `sluice submit` and a push from a `sounding/*` branch |
| **a printed command** | the command line prints the `claude` invocation for the operator to run, with the same plugin | the same hooks |
| **Flywheel** | Flywheel's sessions binding, each elaboration a sounding | Flywheel's own |

A round with the operator, `--with-me`, opens its pane beside the
operator's own as a conversation, with the guard and no stop check
(46).

### C.4 The operator

| profile | put, read, withdraw |
|---|---|
| **Pending You** | a card: a conclusion's five parts inline with a link to the whole, and the choices accept, go on with notes, and drop with a reason; an ask's words with a free reply; the card cancelled on withdraw |
| **sounding's herdr plugin** | the sidebar lists the soundings that have not ended, each with its round and state; keys start, open, accept, send back and drop a sounding, send back being go on; a key opens the conclusion in plannotator, and the annotations given there are the notes of the go on that follows |
| **crew's rail** | one decision per sounding on the rail; crew calls sounding's command line with the operator's response |
| **Flywheel's rail** | the elaboration's decision on the page or in chat |

### C.5 Item's keepers

| profile | settle |
|---|---|
| **millpond** | the accepted conclusion kept as the item's record, which curation names when it answers a later signal on the subject; an item made of each piece of proposed work; go on and drop recorded against the item |
| **crew** | the conclusion shown on the rail, and each piece of proposed work turned by crew's planner into a plan entry |
| **Flywheel** | the elaboration's type writes the conclusion into the design book and its claims |
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
| `event_at` | when the session offered it (31) |
| `title` | the finding's first line |
| `raw` | the finding whole, as `offer-<n>.md` |
| `excerpt` | the finding: `text` whole; `kind` `ask`; `asserted_by` `sounding/<name>`; `assertion` the finding in one sentence, as the session gives it; `subjects` and `argues_with` as the session gives them; `position` `offer <n>` |

### C.7 Store: the sounding's branch

| operation | how the sounding's branch satisfies it |
|---|---|
| read | the files under `.sounding/` at the tip of `sounding/<name>`: `question.md` with its sources and the operator's notes; `conclusion.md` for a round awaiting its decision; `rounds/<n>.md` for each ended round, with how it ended and the decision on it; `offers/<n>.md` and `asks/<n>.md`; and `sounding.rec`, holding the name, the base revision, the item, and each round's timebox, way of running, start and end |
| list | the repository's `sounding/*` branches |
| write | a commit of `.sounding/` alone, made in the place while it exists and on the branch after, refused when the branch has moved since the read (61) |

The held state outlives the place because the branch does (15, 60),
and every worktree of the repository reads it (62).

### C.8 The operator's settings

The default timebox, the longest a starter may name, and the time to
conclude, in `~/.config/sounding/config.toml`.

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** One sounding is one question, in one place, worked by one
  session per round, and each conclusion gets one decision (1, 10, 17,
  51).
- **I2.** No commit of a sounding's branch lands (13).
- **I3.** Only the operator decides a conclusion, and only once (51,
  52).
- **I4.** A conclusion never reaches an inbox; only offers do (30).
- **I5.** No unattended round ends without a conclusion or a note,
  unless its session is gone or was ended (21, 39, 44).
- **I6.** sounding judges nothing and makes no work (56, 64).

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Landing work, testing it, or deciding what a gate requires. The
  repository's own gate does that, for the work an accepted conclusion
  proposes, made on a branch of its own.
- Planning across items, or ordering work across teams. A planner does
  that.
- Curation: reading signals, giving them moves, or making items.
- Writing an accepted conclusion into a design book or its claims.
  Flywheel's elaboration types do that.
- Keeping an inbox.
- A question across several repositories, or several questions in one
  sounding.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- Repositories are git repositories, and a place is a working copy of
  one on a branch of its own.
- A round's session is an agent session in a terminal, which can be
  handed what it needs at its start and asked before it stops.
- Work lands only through its repository's own gate.
- A finding reaches an inbox as a capture in the capture contract that
  Flywheel's statement (`design/flywheel-next/requirements.md`)
  defines, in which a capture may be its own excerpt.
- Flywheel's elaborations run on sounding once Flywheel hosts. sounding
  keeps the shape of Flywheel's elaboration (its clauses 24, 58, 62 and
  65): conclude is an elaboration finishing with its deliverables, ask
  is one blocked on a question, and offer is one offering a finding.
- sounding is free and open source.

The rest of the stack, which a model builds on unless it says why not:

- One static binary, written in Rust, as sluice is.
- Everything sounding gives a reader as JSON on request, the form of
  (69).
- A command line: `sounding open`, `list`, `conclude`, `offer`, `ask`,
  `accept`, `go-on`, `drop` and `resume`.
- Two plugins kept outside the core, as sluice keeps its plugins: a
  Claude Code plugin that gives every session `/sound <question>`, the
  start hook, the stop check, the guard on `sounding/*` branches, and
  the MCP tools `soundings`, `conclusion`, `accept`, `go_on` and
  `drop`; and a herdr plugin with the sidebar, a workspace per sounding
  and its keys.
- Sessions are Claude Code in herdr panes, places are worktrunk
  worktrees, requests are Pending You cards and the herdr plugin's
  sidebar, conclusions are annotated in plannotator, the inbox and the
  item's keeper are millpond, and the gate is sluice.
- The profiles of Part C first: worktrunk; Claude Code in a herdr pane;
  Pending You and sounding's herdr plugin; millpond and none, as keeper
  and as inbox; and the sounding's branch.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- How long are the operator's default timebox and the longest one, and
  is a round's time the time since it started less its waits on replies
  (38), or the session's working time alone (41, 42)?
- How long is the time to conclude, and does the stop check send a
  session back during it (39, 44)?
- Are the operator's settings the operator's alone, or may a repository
  set its own default within them (42)?
- Does an offer's identity carry its repository into what an inbox
  keys it by, or is a name unique across every repository whose
  soundings offer into one inbox, as a planner's inbox holding several
  repositories needs (3, 32)?
- Is a sounding's branch pushed to its repository's remote, so work
  built on another host can read the revision a conclusion names, and
  does the held state travel with it (14, 62)?
- With an inbox bound, does a sounding opened by a person or by another
  tool's surface, with no item, get an item of its own (9, 55)?
- Where else does an accepted conclusion live: does its repository keep
  it in its own record, as a repository keeps its explorations (55,
  59)?
- Is a note given through an act of its own, as an exit is, or taken
  from what the session leaves in its place when it stops (23, 40)?
- May the operator park a working sounding by their word, ending its
  session with the round's work committed (18, 49)?
- Is a session a host brings back after a restart the same session, or
  a gone one whose sounding is parked (21, 49)?
- Is a conclusion of a round with the operator decided in the
  conversation, or put before the operator on the same surfaces as any
  other (46, 52)?
- Is there a standing sounding, which stays open and starts a round
  when material on its subject arrives, as Flywheel's standing
  elaborations do (17, 18)?
- May an offer carry material beyond its text, such as what a prototype
  printed, as its capture's raw material (31)?

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** A person working in a session opens a sounding on whether to
  take a library's next major release. A sounding opens in a place of its own and its
  first round's session starts with the question. The person's session
  goes on with its own work and never waits.
- **S2.** An unattended session tries to stop having written neither a
  conclusion nor a note. It is sent back, concludes, and the operator
  is asked for a decision.
- **S3.** A round's timebox runs out while the session is mid-prototype.
  The session concludes with what it knows, the prototype is committed
  on the sounding's branch, and the conclusion the operator reads names
  that revision and shows that the timebox ran out.
- **S4.** A session asks which of two upstream forks the operator wants
  the repository to follow. The sounding shows as waiting on the operator. An hour
  later the operator replies, the session goes on, and the hour has not
  counted against the round's timebox.
- **S5.** A session offers two findings beyond its question, one of
  them twice. The inbox holds two captures, and the session never
  stopped working to make either offer.
- **S6.** The operator sends a conclusion back with notes made on it.
  The next round starts in the same place with the prototype still
  there, the notes beside the question word for word, and the first
  round's conclusion among what it is handed.
- **S7.** A conclusion is before the operator on a card and in the
  herdr sidebar. The operator accepts it in the sidebar. The card is
  withdrawn, and a response given on it later is reported as not
  applied.
- **S8.** The operator accepts a conclusion that proposes a bump and a
  documentation change, for a sounding an inbox sent. The inbox keeps
  the conclusion on the item and makes two items; sounding makes none.
  The bump lands on a branch of its own through the gate, and no commit
  of the sounding's branch is in it.
- **S9.** The operator drops a sounding with a reason. Its place is
  removed, its branch and held state stay readable, and the offers it
  made stay in the inbox.
- **S10.** A session tries to submit its prototype to land from its
  place. The submission is refused, and the shared branch never holds a
  commit of the sounding's branch.
- **S11.** The host restarts while a round runs, and its session is
  gone. The sounding shows as parked. The operator resumes it, and the
  next round starts in the same place from what the last one left.
- **S12.** sounding runs with no inbox and no item. An offer is kept in
  the held state as not taken, and an accepted conclusion stays
  readable from the held state.
- **S13.** Two soundings run in one repository at once, and neither
  waits on the other. A third opened under the first one's name is
  refused, naming the first.
- **S14.** A person reads a sounding through the command line, an agent
  through its session's tools and the operator through the herdr
  sidebar. All three see the same state and the same conclusion.

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of sounding that satisfies Parts A and B: its components, a
sounding's states and how each round starts and ends, the held state
with fixed examples, and how a place, a session, a surface, an item's
keeper, an inbox and a store are bound. A conformance suite whose
scenarios each cite the clauses they exercise, failing when a clause is
cited by nothing. The profiles of Part C, each passing the suite.

<!-- ANCHOR_END: deliver -->
