# eddy — requirements
<!-- ANCHOR: preamble -->

A statement of what eddy must always do and never do, written to admit
any model that satisfies it.

The statement is in three parts. Part A is what must hold of eddy on
its own: what a meeting is and how it is named, what a listing holds,
what eddy gives of a transcript, which meetings it leaves out, how a
run hands meetings on without losing one, what eddy keeps, and what it
gives the people and programs that ask. Part B is its contracts: the
operations it needs across its five seams, a meeting service, a
capture host, and the three stores that keep an adapter's cursor, its
sign-in and the transcripts it fetched, and the guarantee each must
give. Part C is the profiles: the ways each contract is satisfied.

Parts A and B name no mechanism: no command, file, format, field,
protocol, service or tool. Every real tool and every real meeting
service is named only in section 9 and in Part C. So is the capture
contract, the family's one way of handing a capture to a capture host,
which Part C states as far as eddy must keep it. A reader who has never
seen a meeting service's interface should be able to design from Parts
A and B alone.

## 1. Purpose

eddy lists the meetings that meeting services recorded and fetches
their transcripts. It reads each service through an adapter of its own,
gives every meeting one identity whoever asks for it, and hands a
transcript on as the service served it, beside a plain copy that reads
the same whatever service made it. It answers the same way to a person,
a coding agent's session, a pane beside the agents, and a capture host
that keeps each meeting as a capture in an inbox, and none of them
needs another to use it. Listing is arithmetic: no language model runs
inside eddy, and eddy never judges what a meeting says, never reads one
into signals, and never keeps a list of what it handed on. A reader
decides what a meeting asserts, and the capture host decides whether a
meeting is new to its inbox.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **the operator** (the person eddy works for, holding the accounts it reads) | which services and accounts eddy reads, and each adapter's settings; to sign in on a machine; through a capture host's settings, when each adapter runs, on which machine, and which inbox keeps its captures; that each name they give a service read by the generic adapter names one service across the machines whose captures reach one inbox (45); everything else this table does not settle | they never decide what a service recorded, a meeting's identity, or its start |
| **a meeting service** | what is recorded, each meeting's id and details, when a transcript is ready, how long it is kept, and which accounts may read it | it never learns of eddy's work anything beyond an account's requests to list its meetings and fetch their transcripts |
| **eddy** | which meetings a listing holds and which are skipped, as this statement fixes them; each meeting's identity and plain copy; a run's cursor | it never runs a language model, never judges, summarises or reads a meeting into signals, never keeps a list of what it handed or a transcript, never makes a sign-in, and never learns which inbox keeps its captures |
| **an asker** (a person, a coding agent's session, a pane beside the agents) | which account, window or meeting to ask about, and when | it never changes an answer by who it is |
| **a capture host** (a program that runs adapters and keeps their captures in an inbox) | when a run starts, where its raw material is kept, and whether a capture is new to its inbox | it never changes what an adapter hands it, and never asks an adapter what it handed before |
| **a reader** (a session that reads a capture into signals, once the capture host holds it) | what a meeting asserts, who said it, and whether two meetings hold one conversation | it never changes a meeting's raw material or its capture |
| **an adapter's author** (eddy's, or another author's) | how an adapter lists meetings and fetches transcripts from its service | they never give identities, details, raw material or skips of another shape than every adapter gives (43) |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **meeting service**, or **service**: a program that records meetings,
  makes their transcripts, and serves both to the accounts allowed to
  read them.
- **account**: the operator's standing at one service, which decides
  the meetings eddy may read there.
- **meeting**: one recorded occurrence of a conversation on one
  service.
- **meeting id**: the id a service gives a meeting.
- **identity**: the name of a meeting, made from its service and its
  meeting id. Where its service may give one meeting more than one
  transcript, an identity names one transcript of a meeting. Where its
  service's ids are unique only within a tenant or an account, it names
  that tenant or account too (50).
- **details**: of a meeting, its title, its start, its length, its
  attendees and its address on its service.
- **start**: when a meeting began, as its service records it.
- **length**: how long a meeting ran, as its service records it.
- **transcript**: the words of a meeting as its service serves them,
  with whatever speakers and times the service gives.
- **ready**: of a transcript, that its service serves it whole.
- **segment**: one stretch of a transcript as its service divides it,
  with whatever speaker and time the service gives it.
- **turn**: what one speaker says before another starts.
- **plain copy**: a transcript laid out one line per turn.
- **raw material**: of a meeting, its transcript as served, its plain
  copy, and the details its capture does not carry.
- **window**: a span of time, by the meetings' starts.
- **day**: of an asker, the calendar day in the asker's own time zone.
- **listing**: the meetings eddy gives of one account, for one window
  or since one cursor.
- **complete**: of a listing, that its service answered for all of it;
  of a run, as 24 fixes it.
- **mark**: a value a service gives with a listing, from which a later
  listing continues with every meeting the service added or changed
  since.
- **shortest length**: the length below which the operator holds that a
  meeting has nothing worth keeping.
- **skip**: leaving out a meeting shorter than the shortest length.
- **earliest start**: the start before which a run given no cursor
  lists nothing.
- **look-back**: of an adapter whose service gives no mark, the span
  before a run begins within which the run lists every meeting again,
  whatever its cursor (67).
- **give-up**: how long after a meeting's start a run goes on listing
  it again while its transcript is not ready or its service no longer
  holds it (68).
- **settings**: of an adapter, what the operator sets for it: the
  account it reads, the shortest length, the earliest start, the
  give-up, the look-back where its service gives no mark, the time zone
  of its service's times where the service gives starts without one,
  and for the generic adapter the service it reads and the name that
  service goes by.
- **adapter**: the code that lists meetings and fetches transcripts from
  one meeting service, for the one account its settings name.
- **generic adapter**: the adapter that ships in eddy and reads any
  meeting service the operator describes to it in its settings, under a
  name the operator gives that service.
- **meeting adapter**: an adapter, eddy's or another author's, that
  passes the conformance suite (66).
- **capture host**: a program that runs adapters and keeps what they
  hand it as captures in an inbox.
- **inbox**: where a capture host keeps captures, and the signals
  readers draw from them.
- **capture**: what a capture host keeps of one event an adapter handed
  it: what the event was, when it happened, and a pointer to its raw
  material.
- **event time**: of a capture, when its event happened.
- **pointer**: what a capture holds to say on which machine, and where
  on it, its raw material is kept.
- **signal**: one assertion a reader draws from a capture, quoting its
  raw material.
- **excerpt**: the words a signal quotes. A capture that carries one
  becomes its signal with no reader.
- **run**: one start of an adapter by a capture host.
- **raw place**: the place a capture host gives one run for raw
  material.
- **cursor**: a value a run ends with that marks where the next run's
  listing begins, read only by its adapter.
- **sign-in**: what lets eddy act for an account at its service.
- **machine**: one computer eddy runs on.
- **diagnostic**: what eddy writes about its own working beside its
  answers: an error, a log line, a status.
- **surface**: one way an asker reaches eddy.
- **profile**: one way a contract of Part B is satisfied, as Part C
  describes.

<!-- ANCHOR_END: glossary -->
<!-- ANCHOR: part-a -->
## Part A. What eddy decides

### A.1 Meetings and their identity

1. eddy reports only the meetings a service says it recorded, and
   invents none. It never joins two meetings into one, and never splits
   one into two. Where its service gives one meeting more than one
   transcript, eddy hands the meeting once for each transcript, under
   an identity that names the meeting and that transcript, and never
   joins the transcripts (50).
2. Every occurrence of a recurring meeting is a meeting of its own,
   with an identity of its own.
3. Every meeting has exactly one identity, or one for each of its
   transcripts where its service may give it more than one (1), and an
   identity never changes. Every listing, run, surface, account and
   machine names one meeting by the same identity, so an asker or a
   capture host can key on it.
4. Two meetings never share an identity, and neither do two transcripts
   of one, whatever characters a service's ids hold and whichever
   account listed them.
5. A conversation recorded on two services is two meetings, and so is
   one that two accounts read at a service whose ids are unique only
   within each account (50). eddy never decides that two meetings hold
   one conversation; a reader does.

### A.2 Details

6. A meeting's details are only what its service gives of it. eddy
   never invents, corrects or infers a detail, and reports one the
   service does not give as not given. eddy gives attendees as the
   service gives them, with whatever addresses it gives, and adds or
   strips none.
7. The start eddy gives a meeting is never when eddy listed it or when
   a capture host took it. Where a service records both when a meeting
   was planned to begin and when it began, eddy gives when it began.
72. A start its service gives with no offset from universal time is not
    given (23), unless the adapter's settings name the time zone the
    service's times are in.
8. Every detail of a meeting that its capture does not carry travels in
   its raw material, so nothing its service gave of it is lost between
   listing and reading.

### A.3 Listing

9. No language model runs inside eddy. Listing, fetching, naming,
   laying out and skipping a meeting are arithmetic, and eddy never
   summarises, translates, ranks or judges what a meeting says.
10. A listing for a window holds every meeting its account's service
    recorded with a start in that window, other than those skipped
    (17), each with its identity, its details and whether its
    transcript is ready. A meeting whose transcript is not ready is
    listed as not ready, never left out.
11. A listing the service did not answer whole says so, naming the
    account and the reason, and never passes for a listing of fewer
    meetings. A listing for an account whose sign-in is not in force is
    not complete either, and names the sign-in as its reason.
12. The day's meetings, for an asker, are the listings of every account
    eddy reads, over the asker's day, given as one answer that names
    each account whose listing is not complete (11). An asker may name
    the day's date and its time zone. Without them the surface takes
    its own, and the answer names the date, the zone and the span of
    time it covers.

### A.4 Transcripts

13. eddy gives a transcript as its service served it, whole, and
    changes nothing in it.
71. A transcript its service changes after a run handed it keeps its
    identity (3), so the capture host passes it over (55), and the
    change reaches only an asker who asks for the transcript again.
14. The plain copy holds one line per turn, in the order the turns were
    spoken. Each line gives when the turn began where the transcript
    says, its speaker as the transcript names it, and its words as the
    transcript gives them, changing nothing but the white space between
    words. Its form is the same whatever service recorded the meeting.
74. Consecutive segments a transcript gives to one named speaker are
    one turn. A segment with no speaker named is a turn of its own, and
    a transcript divided into no segments is one turn per line as
    served.
15. eddy never names a speaker the transcript leaves unnamed, and never
    gives a turn's words to any speaker but the one the transcript
    gives them to.
16. Every answer that gives a transcript or a plain copy gives it whole,
    or the span an asker asked for, together with a way to read the
    whole. A span is a run of turns of the plain copy, or a run of
    bytes of the transcript as served. eddy never gives a span of one
    as if it were whole.

### A.5 Short meetings

17. eddy leaves out a meeting shorter than the shortest length, decided
    by the meeting's length alone, and leaves out none where the
    settings give no shortest length. Every listing, run, surface and
    machine with the same shortest length leaves out the same meetings,
    and leaving one out needs no record.
70. An asker may ask for a listing under a shortest length of its own.
    That is another question, and its answer is the same whoever asks
    it (38).
18. A meeting whose length its service does not give is never left out
    as short.
19. A skipped meeting is never named failed.

### A.6 Runs

20. A run hands a capture for a meeting only once the meeting's
    transcript is ready and its raw material is written whole. No
    capture names raw material that is missing or partial.
21. A run hands a capture for every meeting of its listing that is
    ready and not skipped, unless it names the meeting failed (23),
    whether or not an earlier run handed it. eddy never decides whether
    a meeting was handed before; the capture host does (55).
22. A capture holds a meeting's identity, that its source is a meeting,
    its start as the event time and the names of its raw material. It
    also holds the meeting's title and its address where the service
    gives them, and nothing more: never an excerpt, and never a word
    spoken in the meeting.
23. A meeting that cannot be fetched, laid out or handed never stops the
    others. The run names each such meeting, with what failed and why,
    and hands every other. A meeting whose start or id its service does
    not give is named failed, never handed with a start or an id of
    eddy's own (6). A meeting its listing gave as ready, whose
    transcript its service then says is not ready, is not ready and
    never failed.
24. A run ends complete only when its listing was complete (11) and
    every meeting in it was handed, skipped, found not ready, or named
    failed. A run that cannot sign in or reach its service never ends
    complete, and says why. A run whose listing was not complete still
    hands every meeting of it that is ready, then ends incomplete.
25. The cursor a complete run ends with never excludes from a later
    listing a meeting that no run has handed, other than one skipped
    (17) or given up (68). Where an adapter's service gives no mark, it
    may also exclude a meeting its service listed to no run begun
    within the adapter's look-back after the meeting's start (67). A
    meeting named failed before its give-up, or whose transcript was
    not yet ready, is listed again by the next run.
67. Where an adapter's service gives a mark (46), a complete run's
    cursor holds one of the service's marks, and the next run lists
    since it (25).
    Where the service gives none, every run lists again each meeting
    whose start falls within the adapter's look-back before the run
    began, whatever its cursor holds. The adapter's profile says which
    its service does (C.3).
68. Once an adapter's give-up has passed since a meeting's start, a run
    names it failed once more if its transcript is still not ready or
    its service no longer holds it. The run says its give-up passed, and
    the cursor it ends with moves past it (25).
26. A run given no cursor lists every meeting whose start is at or after
    its adapter's earliest start. A run given no cursor whose settings
    give no earliest start lists nothing and ends incomplete, naming the
    setting. A run's listing has no end, so a meeting still in progress
    is listed as not ready (10). Whatever cursor a run is given, or
    none, it hands every meeting under the same identity (3). The
    earliest start is the operator's alone, and nothing an inbox
    already holds moves it (31).
27. A run depends only on its service's answers, its settings, its
    cursor and the clock. It never depends on which capture host or
    which machine started it, and never learns which inbox keeps its
    captures.
28. Two runs of one adapter at once, on one machine or two, hand the
    same identity for every meeting. Two on one machine share one
    sign-in and leave it whole.

### A.7 What eddy keeps

29. eddy keeps nothing between answers but its sign-ins and its runs'
    cursors, each in its store (B.3). It keeps no list of the meetings
    it listed or handed, no capture, and no transcript beyond the answer
    or the run that fetched it.
30. Every cursor can be discarded, and the next run lists from its
    adapter's earliest start and hands nothing under a new identity
    (26). A discarded sign-in costs signing in again, and no meeting
    (24, 25).
31. eddy never reads an inbox, a capture or a signal, and nothing it
    gives depends on what any inbox holds.

### A.8 Sign-ins and what a service learns

32. eddy reaches a service only with a sign-in the operator made for an
    account the operator holds, and never makes or widens a sign-in on
    its own.
33. A sign-in is kept only in its store, and eddy never copies one to
    another machine. It never appears in a listing, a transcript, a
    capture, raw material, a cursor, an answer or a diagnostic.
34. eddy can always say of each account whether its sign-in is in force
    and, where its service says, when it ends, without listing or
    fetching a meeting.
35. eddy sends a service nothing but what listing and fetching that
    account's meetings needs.
36. Listing meetings and fetching transcripts change nothing at a
    service. eddy never edits, deletes, shares or marks a meeting
    there.
37. A meeting's words leave eddy only for the asker who asked for them,
    or for the raw place of the run that fetched them. No diagnostic
    eddy writes holds a word spoken in a meeting, or any body a service
    answered with. A diagnostic gives eddy's own words and, where the
    service gave one, the service's status.

### A.9 Askers and surfaces

38. Given the same answers from a service, the same question about the
    same account, window or meeting gets the same answer, whoever asks
    and through whichever surface. A run and a surface give every
    meeting they both list the same identity and the same details.
39. Every surface answers from one core. No surface lists, fetches,
    names, lays out or skips a meeting of its own.
40. Every answer has one form a program reads, the same through every
    surface, and that form only ever gains fields.
41. eddy needs no capture host to answer. Alone, it lists meetings and
    gives transcripts, and keeps nothing of either (29).
42. eddy never reads a meeting into signals, never charges a reader, and
    never tells a session what to make of a meeting. What becomes of a
    meeting once eddy has given it is the asker's or the capture
    host's.
73. No surface hands a meeting on, to a session or to a capture host,
    and none searches what meetings said. An asker finds a meeting by
    its identity, or in a listing of a window or a day.

### A.10 Adapters

43. Each adapter reads one meeting service for one account, the generic
    adapter the service its settings describe. Every adapter gives
    identities of one shape, details in one form and raw material in
    one layout, and skips by one rule; adapters differ only in the
    service they list and fetch from.
44. An adapter is a meeting adapter by passing the conformance suite
    (66), and by nothing else. eddy's own adapters have no standing
    that an adapter another author publishes lacks.
45. The generic adapter ships in eddy. It gives the meetings of the
    service its settings describe identities under the name the
    operator gives that service. eddy refuses a name another described
    service or an adapter already goes by on the same machine. Keeping
    each name to one service across the machines whose captures reach
    one inbox is the operator's.
75. eddy reads a second account at one service through a second adapter
    of that service, and only where no two meetings the two adapters
    list can share an identity (4, 50). Otherwise it refuses the
    second.
76. eddy publishes the code its adapters share for identities, details,
    raw material and the skip, so another author's adapter can give
    eddy's shapes without writing its own. The conformance suite holds
    an adapter to the shapes, never to that code (44, 66).

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The meeting service

46. **list-meetings**: given an account and a window, or a mark the
    service gave an earlier listing, every meeting the service recorded
    for the account in that window or since that mark, each with its
    meeting id, its details as the service gives them and whether its
    transcript is ready, with a mark a later listing may continue from
    where the service gives one; or that the service could not answer
    whole, with the reason (11).
47. **fetch-transcript**: given an account and a meeting id, the
    transcript as the service serves it, whole, with its form; or that
    it is not ready, that the service no longer holds it, or that the
    service could not be reached.
48. **sign-in-state**: given an account, whether its sign-in is in force
    and, where the service says, when it ends; or that it has lapsed or
    been refused (34).
49. **sign-in**: given an account and the operator's approval at the
    service, a sign-in, with a way to renew it where the service gives
    one (32).
50. The guarantee: the service gives one meeting the same meeting id on
    every call. Where a service gives one id to every occurrence of a
    recurring meeting, its profile gives each occurrence an identity of
    its own from an id the service gives each occurrence or each
    transcript (2). Where a service may
    give one meeting more than one transcript, its profile folds the
    transcript's own id into the identity, so each transcript is handed
    (1). Where a service's ids are unique only within a tenant or an
    account, its profile folds in the tenant or the account within which
    they are unique (3, 4). Each profile says which of these its service
    needs.

### B.2 The capture host

51. **start**: the capture host starts a run of one adapter, with the
    adapter's settings, a raw place of the run's own, the cursor the
    cursor store keeps or none, and each secret the adapter says it
    needs.
52. **hand**: given a meeting that is ready, one capture as 22 fixes it,
    its raw material already placed (20, 63).
53. **mark**: given a cursor, the cursor the run ends with, which the
    cursor store keeps once the run ends complete (25, 58).
54. **end**: given a count and each meeting named failed, with what
    failed and why, the end of a complete run (24). The count is of
    every meeting the service's answer held for the run's listing,
    skipped ones among them. A run that stops without one is
    incomplete.
55. The guarantee: the capture host keeps one capture per identity and
    passes over a capture whose identity it already holds, so an
    adapter may hand one meeting any number of times (21). A capture
    taken from an incomplete run stays taken, and that run's cursor is
    never kept, so the cursor of the last complete run stands. A
    capture the contract refuses is named in the run, and every other
    capture of the run is taken.
56. An adapter runs unchanged under every capture host that keeps this
    contract, and is never told which one started it (27).

### B.3 The stores

57. **read-cursor**: given an adapter, the cursor last kept for it, or
    none.
58. **keep-cursor**: given an adapter and the cursor of a complete run,
    the cursor kept, all or nothing.
59. The cursor store keeps a cursor only from a complete run (24), and
    a cursor it loses costs a listing from the earliest start and no
    meeting (30).
77. A cursor is kept on the machine whose run ended with it, and never
    moves to another machine. An adapter whose runs move to another
    machine starts there with no cursor, and loses no meeting (30).
60. **read-sign-in**: given a service and an account, the sign-in kept
    for them on this machine, or none.
61. **write-sign-in**: given a service, an account and a sign-in, the
    sign-in kept, all or nothing. Of two writes at once, one is kept
    whole (28).
62. The sign-in store gives a sign-in to nothing but eddy acting for the
    operator, and keeps it apart from everything eddy hands or writes
    elsewhere (33).
78. A service may renew a sign-in on use and void the one it replaced.
    For such a service, eddy reads only its own sign-in store on the
    machine that runs the adapter, once that store holds a sign-in for
    the account. A sign-in a capture host hands a run (51) only seeds
    that store while it holds none (32, 61).
63. **place-raw**: given a run's raw place and a meeting, the meeting's
    raw material written there whole (8, 13, 14), and the names its
    capture gives it. It never writes over what the raw place already
    holds, and a meeting whose place there is taken is named failed
    (23).
64. Raw material stays on the machine that fetched it, outside every
    record shared beyond that machine, and whoever reads a capture
    there reaches its raw material by the capture's pointer (37). eddy
    never reads back what it placed.

### B.4 Binding the contracts

65. Each seam is bound by naming one or more profiles of Part C. Any
    number of adapters are bound at once, each to its own service and
    account; one capture host starts any one run; and one store of each
    kind serves it. A capture host's secrets only seed eddy's own
    sign-in store where 78 says.
66. One conformance suite holds every adapter and every profile to
    Parts A and B, and an adapter or a profile that fails it is not
    one.

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile.

### C.1 The capture host: the capture contract

The capture contract is the one way an adapter hands captures to a
capture host. It is defined and implemented once in the family's
shared crates, in a public repository of the family's own, together
with the conformance pack that proves every capture host and every
adapter. millpond takes the contract today and Flywheel later, both
built on those crates, and an adapter runs unchanged under either (56).
What eddy must do under it is this.

| operation | how the capture contract satisfies it |
|---|---|
| start | eddy's Flywheel plugin declares each adapter: its command, the shape of its configuration and the secrets it needs, and every capture host reads that declaration. The capture host runs `eddy capture <adapter> --raw-dir <dir> [--cursor <c>]`, `<dir>` fresh for the run, with the adapter's settings in the file the `CAPTURE_CONFIG` environment variable names and each declared secret in the environment under its declared name. |
| hand | one line of JSON on standard output, `{"capture": {…}}`, with the fields below |
| mark | `{"cursor": "<c>"}`; the capture host keeps the last cursor line of a run that ends in `done`, and passes it back as `--cursor` on the next |
| end | `{"done": {"listed": <n>, "failed": [{"what": "<key>", "why": "<reason>"}]}}`, then exit status 0. `listed` counts every meeting the service's answer held for the run's listing, skipped and unready ones among them (54). A run that is not complete (24) prints no `done` and exits with a status other than 0. It says why on standard error in one line of eddy's own, with the service's status where it gave one and never a body the service answered with (37). |

`listed` counts what the service answered, so it holds the meetings
the skip leaves out. The listing of 10, which leaves them out, is what
a surface gives.

Each line is one JSON object holding exactly one of `capture`,
`cursor` and `done`. A meeting capture's fields:

| field | a meeting adapter writes |
|---|---|
| `key` | the identity (C.2); required |
| `source` | `meeting`; required |
| `event_at` | the meeting's start, in RFC 3339 with its offset; required |
| `title` | the meeting's title, where the service gives one |
| `url` | the meeting's address on its service, where it gives one |
| `raw` | the paths of C.4, relative to `<dir>` |
| `excerpt` | never present |

The contract fixes these for every key: `/` separates its segments,
and a key never starts with `/`, never holds a `..` segment, and never
starts with `captures` or `moves`.

What the capture host does with the lines, which eddy relies on and
never does itself (55): it refuses a line with a bad key, a missing
field or an excerpt with no text, names it in the run and takes the
rest; passes over a key the inbox already holds; banks each raw file in
its raw bank, in its data directory on the machine, never in git, under
the capture's name; writes the capture with a pointer of the form
`<host>:<path>`; and marks a capture with no excerpt unread, which
charges a reader. A run that exits without `done`, or with a status
other than 0, keeps every capture already taken; its cursor is not
kept, and the run is recorded failed.

The conformance pack holds the meeting checks an adapter passes to
count as a meeting adapter (44): every key of the form
`meeting/<adapter>/<id>`, `source` `meeting`, `event_at` at the
meeting's start, no excerpt, and `raw` naming the transcript as served
and the plain copy. eddy's conformance suite (66) runs them.

### C.2 Identity

A meeting's identity is the key `meeting/<adapter>/<meeting id>`.
`<adapter>` is the adapter's name, `wispr`, `webex` or `teams`, or for
the generic adapter the name the operator gives the service it reads
(45). An adapter's name is a lowercase letter or digit followed by any
number of lowercase letters, digits, `_` and `-`, and eddy refuses any
other when it reads the settings.

`<meeting id>` is made of the ids C.3 names for the service, in its
order. They are the meeting's id and, where C.3 says, the transcript's
and the tenant's or account's (50). Each id has every byte outside RFC
3986's unreserved characters percent-encoded in uppercase hex, and an
id of `.` or `..` is written `%2E` or `%2E%2E`. A `+` joins the
encoded ids, since the encoding never leaves one inside an id. Any
`<meeting id>` is then one segment, no two give one key (4), and it is
also a safe name for a folder. A meeting any of whose ids is empty is
named failed, with `what` `meeting/<adapter>/` and `why` `id empty`
(23).

### C.3 Meeting services

| profile | the meeting id | list-meetings and fetch-transcript | sign-in | when |
|---|---|---|---|---|
| **`wispr`** | the id the endpoint gives the meeting | Wispr Flow's MCP endpoint, over HTTP. The adapter is an MCP client of it and calls its tools from its own code, so no Claude session runs to list meetings (9). | the adapter's own, made once per machine by the operator | first |
| **`webex`** | the id of the meeting instance a transcript belongs to, never its series' id (2), with the transcript's own id folded in (C.2), so each transcript of an instance is handed (1) | Webex's transcripts API: the transcripts in a window, then each one's content as served | an integration the operator approves, once per machine | when the operator records on Webex |
| **`teams`** | the meeting's id with the transcript's own id folded in (C.2). Graph gives every occurrence of a recurring meeting one meeting id, and the transcript's id tells each occurrence's transcripts apart (1, 2, 50). | Microsoft Graph's meeting transcripts | an application the tenant's administrator has consented to, then the operator's sign-in once per machine | when a tenant's administrator consents |
| **generic** | the id the endpoint's answer gives, in the field the settings name, with a transcript's id and a tenant's or account's folded in where the settings name their fields (50) | any MCP endpoint that serves meetings and their transcripts. The settings name the endpoint, the name it goes by (45), its listing tool and its transcript tool, and the field of each answer that gives each detail and the transcript. It is an MCP client, as `wispr` is. | as the endpoint asks, once per machine | for services with no adapter of their own |

Each profile says how its adapter keeps 25 and 67. It uses the
service's own change mark where the service gives one, and otherwise a
look-back its settings give, with a default the profile states. A
profile also says whether its service's ids are unique beyond one
tenant or account, and which of the two it folds in where they are not
(50). The generic adapter's settings name the field of a listing's
answer that gives a mark, where its endpoint gives one, and its
look-back otherwise.

eddy tests each adapter by replaying its service's recorded responses,
so a test needs no account, no sign-in and no network.

An adapter's settings are the file `CAPTURE_CONFIG` names when a
capture host runs it, and `$XDG_CONFIG_HOME/eddy/eddy.toml` when it
runs alone or no `CAPTURE_CONFIG` is set, one `[adapters.<name>]`
table per adapter. They hold the account, the shortest length in
seconds, the earliest start, the give-up, the look-back where the
service gives no mark, and the time zone of the service's times where
it gives starts without an offset. The generic adapter's also hold its
endpoint's description.

sign-in is `eddy sign-in <adapter>`, run by the operator on the
machine. sign-in-state is `eddy status`, which reaches no meeting (34);
a fleet's doctor reads `eddy status --json` to warn as a sign-in nears
its end.

### C.4 Raw material

Under the run's raw directory, one folder per meeting, named by its
encoded meeting id (C.2):

| file | holds |
|---|---|
| `<id>/transcript.<ext>` | the transcript as served, whole (13); `<ext>` from its form, such as `json`, `vtt` or `txt`, taken from the service's content type where it gives one, and `bin` where it gives none |
| `<id>/turns.txt` | the plain copy (14): one line per turn, `<offset>`, a tab, `<speaker>`, a tab, `<words>`. `<offset>` is `HH:MM:SS` from the meeting's start, truncated to whole seconds, its hours running past two digits where they must, and empty where the transcript gives no time; `<speaker>` is as the transcript names it, empty where it names none (15); `<words>` are the transcript's, each tab or line break inside a turn written as a space |
| `<id>/meeting.json` | the details (8): the service's meeting id, the title, the start, the length in seconds, the attendees verbatim as the service gives them (6), and the address, each `null` where the service gives none |

`raw` in the capture names all three.

### C.5 Stores

eddy's own files on a machine go by kind. Its settings are
configuration, under `$XDG_CONFIG_HOME/eddy/`. Its sign-ins are state,
under `$XDG_STATE_HOME/eddy/`, which no backup copies, so a rebuilt
machine costs signing in again and no meeting (30). eddy keeps no data
and no cache of its own; a meeting's raw material is the capture host's
data.

| store | profile | read and write |
|---|---|---|
| cursor | **the capture host's**, on the machine that runs the adapter | millpond keeps it in its state directory on that machine, keyed by inbox and adapter. read-cursor is the `--cursor` a run starts with; keep-cursor is the last `cursor` line of a run that ends in `done` (C.1). The cursor stays on that machine, and an adapter whose runs move to another machine starts there with no `--cursor` (77). |
| sign-in | **eddy's own**, on the machine that runs the adapter | one file per service and account under `$XDG_STATE_HOME/eddy/sign-in/`, readable by the operator's user alone; write-sign-in writes a new file beside the old and renames it over the old, under a lock held for the write (61). It serves eddy alone and under millpond, and under any capture host for a service that renews a sign-in on use (78). |
| sign-in | **the capture host's secrets**, under a capture host that places them, as Flywheel does | read-sign-in is each secret the adapter declared, placed in its environment by the host, for a service whose sign-in stays the same on use. For a service that renews it on use, the secret seeds eddy's own store while that holds none, and eddy reads its own store from then on (78). |
| transcripts | **the raw bank** | place-raw writes C.4's files under the run's `--raw-dir`. The capture host banks them in its raw bank under the capture's name, and never in git. The raw bank is in its data directory on the machine, which the machine's backup covers, and the capture points into it by `<host>:<path>` (64). |
| transcripts | **none**, alone | eddy gives a transcript to its asker and writes it nowhere (29) |

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** No language model runs inside eddy, and eddy never judges a
  meeting or reads one into signals (9, 42).
- **I2.** A meeting has one identity for ever, everywhere, or one for
  each of its transcripts where its service gives several, and no two
  meetings or transcripts share one (1, 3, 4).
- **I3.** A meeting's words reach an asker as its service served them,
  changed in the plain copy only in their white space, and go nowhere
  else but the raw place of the run that fetched them (13, 14, 22,
  37).
- **I4.** eddy keeps no list of what it handed; the capture host stops
  a second capture of one meeting (21, 29, 55).
- **I5.** No failure loses a meeting: a meeting no run has handed is
  listed again until a run names it failed for its give-up (23, 25,
  68). A meeting its service lists late is listed while the mark or the
  look-back covers it (67).
- **I6.** A sign-in never leaves its store but to seed eddy's own on the
  same machine (33, 78).

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Reading a meeting into signals, curating signals, or judging what a
  meeting means. A reader and curation do that, through the capture
  host.
- Joining one conversation recorded on two services, or reaching an
  inbox by two routes. A reader does that.
- Recording a meeting, or transcribing its audio. eddy fetches the
  transcripts a service made.
- Files a person saves by hand, such as a transcript downloaded from a
  service, an email or a document. A capture host's folder drop takes
  them.
- Searching what meetings said. eddy keeps no index of them (29, 73).
- Keeping an archive of transcripts. A capture host's raw bank holds
  what its runs fetched.
- Changing anything at a service (36).
- Deciding when an adapter runs, on which machine, or for which inbox.
  The operator says, through a capture host's settings.
- Telling anyone by itself. A surface tells, when its asker asks.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- A capture is handed to a capture host by the capture contract, which
  the family's shared crates define and implement once. C.1 gives what
  eddy must do under it.
- The capture hosts are millpond today and Flywheel later, both built
  on the family's shared crates, and an adapter runs unchanged under
  either.
- Meeting services serve the transcripts they made, over the network,
  to an account's own sign-in, which the operator makes once per
  machine.
- A capture enters an inbox that may be shared beyond the machine, and
  raw material never does.
- The askers include coding agents working in many sessions at once,
  and panes beside them, on more than one machine.
- eddy is free and open source.

The rest of the stack, which a model builds on unless it says why not:

- One static binary, written in Rust, as headwater and sluice are.
- Every answer as JSON on request, the form of (40).
- Four surfaces answering from one core, each a plugin kept outside the
  core as headwater keeps its plugins: a command line; a Claude Code
  plugin that pulls a meeting's transcript into a session; a herdr
  plugin that shows the day's meetings in a pane and hands nothing on;
  and a Flywheel plugin that declares one adapter per meeting service,
  the generic adapter among them, which every capture host reads.
- The capture contract's types and key rules from the family's shared
  crates, as every adapter takes them.
- The code eddy's adapters share (76), published as a library of eddy's
  own built on those crates.
- Each adapter tested by replaying its service's recorded responses.
- The profiles of Part C: `wispr` first, and `webex` and `teams` when
  the operator records there.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- For each of `wispr`, `webex` and `teams`, read from the service's own
  interface: does it give a mark, and where it gives none, what
  look-back covers how late it lists a meeting after its start (67)?
  Are its ids unique beyond one tenant or account, and which does its
  profile fold in (50)? Does it ever give one meeting more than one
  transcript (1)?
- What is an adapter's give-up when the operator sets none (68)?
- A meeting past its give-up may still fall within a later run's
  look-back. Does that run name it failed again (67, 68)?

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** The operator holds three meetings on Wispr Flow in a morning.
  The adapter's next run hands three captures, each with its transcript
  as served, its plain copy, its start as its event time and no
  excerpt. No language model ran.
- **S2.** The same adapter runs again an hour later with the cursor the
  first run kept. Any meeting it hands again, the capture host passes
  over, and the inbox gains nothing.
- **S3.** One of three meetings fails to fetch with a server error. The
  other two are handed, the run names the third and why, and the next
  run hands it.
- **S4.** A meeting ended ten minutes before a run, and its transcript
  is not ready. The run does not hand it and still ends complete. The
  next run hands it, its event time the meeting's start.
- **S5.** A run is stopped after handing one meeting. That capture
  stays, the cursor stays where it was, and the next run lists the same
  window and the capture host writes nothing twice.
- **S6.** The Wispr sign-in has lapsed. The run hands nothing and ends
  incomplete, naming the sign-in, and eddy's status says it lapsed. The
  operator signs in again, and the next run hands every meeting the
  lapse held back.
- **S7.** A two-minute call is shorter than the shortest length. No run
  on any machine hands it, no surface lists it, and no run names it
  failed.
- **S8.** A colleague asks in a coding session for this morning's
  design review. The session gets the plain copy, its words unchanged,
  and eddy keeps nothing of it.
- **S9.** The herdr pane shows the day's meetings from Wispr and Webex,
  each under the identity the adapters hand, one of them marked not
  ready. Webex cannot be reached at the next refresh, and the pane says
  so beside the Wispr meetings.
- **S10.** A listing of last week's meetings matches the service's own
  list of recorded meetings, less those shorter than the shortest
  length.
- **S11.** A weekly meeting recurs four times. Each occurrence is a
  meeting of its own, with its own identity and its own capture.
- **S12.** An adapter runs under millpond, and later under Flywheel.
  Given the same answers from the service, it hands the same captures.
- **S13.** A service's meeting id holds a `/`. The identity keeps the
  id in one segment, and no other meeting's identity matches it.
- **S14.** The operator drops a transcript saved by hand into a capture
  host's watched folder, and an adapter lists the same meeting. The
  inbox holds two captures, eddy read no inbox, and a reader joins
  them.
- **S15.** Another author publishes a meeting plugin for a service eddy
  has no adapter for. It passes the conformance suite and runs beside
  eddy's adapters, and nothing in the capture host tells them apart.
- **S16.** A scheduled run and a run started by hand read one account
  on one machine at once. Each meeting is handed under one identity by
  both, the inbox keeps one capture of each, and the sign-in still
  works afterwards.
- **S17.** On a service that gives no mark and lists a meeting only once
  its transcript exists, a two-hour meeting starts at 09:00 and a
  twenty-minute one at 09:30. A run at 10:00 hands the short one. The
  service lists the long one at 11:20, and the adapter's look-back is
  four hours, so the run at 11:30 lists from 07:30 and hands it.
- **S18.** A meeting's transcript never becomes ready. Each run lists it
  as not ready until the adapter's give-up has passed since its start.
  The next run names it failed, saying the give-up passed, and the
  cursor it ends with moves past it.
- **S19.** One Webex meeting instance is transcribed twice, its
  recording stopped and started again. A run hands two captures, each
  under an identity that names the instance and its own transcript, and
  a reader joins them as one meeting.
- **S20.** The operator moves an adapter's runs to another machine. The
  cursor stays behind. The first run on the new machine lists from the
  earliest start, and the capture host passes over every meeting it
  already holds.
- **S21.** An adapter for a service that renews its sign-in on use runs
  under a capture host that places its declared secret. The first run
  seeds eddy's own store from the secret and keeps the renewal there.
  The next run reads the renewal from that store and never the voided
  secret.

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of eddy that satisfies Parts A and B: its components, the
answer each surface gives, how a run lists and derives its captures and
its cursor, with fixed examples, the plain copy's form, and how an
adapter is added, by eddy or by another author. A conformance suite
whose scenarios each cite the clauses they exercise, failing by a
static check when no scenario cites a clause, with the capture
contract's meeting checks among them. It drives the generic adapter
against a fake meeting service it ships, and checks any other adapter
by a run against its service's recorded responses. The profiles of
Part C, each passing the suite, `wispr` first, each adapter tested by
replaying its service's recorded responses.

<!-- ANCHOR_END: deliver -->
