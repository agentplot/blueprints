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
capture host, and the three stores that keep a part's cursor, its
sign-in and the transcripts it fetched, and the guarantee each must
give. Part C is the profiles: the ways each contract is satisfied.

Parts A and B name no mechanism: no command, file, format, field,
protocol, service or tool. Every real tool and every real meeting
service is named only in section 9 and in Part C, and so is the
external standard that fixes how a capture is handed in, Flywheel's
capture contract, which Part C states as far as eddy must keep it. A
reader who has never seen a meeting service's interface should be able
to design from Parts A and B alone.

## 1. Purpose

eddy lists the meetings that meeting services recorded and fetches
their transcripts. It reads each service through a part of its own,
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
| **the operator** (the person eddy works for, holding the accounts it reads) | which services and accounts eddy reads, and each part's settings; to sign in on a machine; through a capture host's settings, when each part runs and which inbox keeps its captures; everything else this table does not settle | they never decide what a service recorded, a meeting's identity, or its start |
| **a meeting service** | what is recorded, each meeting's id and details, when a transcript is ready, how long it is kept, and which accounts may read it | it never learns of eddy's work anything beyond an account's requests to list its meetings and fetch their transcripts |
| **eddy** | which meetings a listing holds and which are skipped, as this statement fixes them; each meeting's identity and plain copy; a run's cursor | it never runs a language model, never judges, summarises or reads a meeting into signals, never keeps a list of what it handed or a transcript, never makes a sign-in, and never learns which inbox keeps its captures |
| **an asker** (a person, a coding agent's session, a pane beside the agents) | which account, window or meeting to ask about, and when | it never changes an answer by who it is |
| **a capture host** (a program that runs parts and keeps their captures in an inbox) | when a run starts, where its raw material is kept, and whether a capture is new to its inbox | it never changes what a part hands it, and never asks a part what it handed before |
| **a reader** (a session that reads a capture into signals, once the capture host holds it) | what a meeting asserts, who said it, and whether two meetings hold one conversation | it never changes a meeting's raw material or its capture |
| **a part's author** (eddy's, or another author's) | how a part lists meetings and fetches transcripts from its service | they never give identities, details, raw material or skips of another shape than every part gives (43) |

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
  meeting id.
- **details**: of a meeting, its title, its start, its length, its
  attendees and its address on its service.
- **start**: when a meeting began, as its service records it.
- **length**: how long a meeting ran, as its service records it.
- **transcript**: the words of a meeting as its service serves them,
  with whatever speakers and times the service gives.
- **ready**: of a transcript, that its service serves it whole.
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
- **shortest length**: the length below which the operator holds that a
  meeting has nothing worth keeping.
- **skip**: leaving out a meeting shorter than the shortest length.
- **earliest start**: the start before which a run given no cursor
  lists nothing.
- **settings**: of a part, what the operator sets for it: the account
  it reads, the shortest length, the earliest start, and for the
  generic part the service it reads and the name that service goes by.
- **part**: the code that lists meetings and fetches transcripts from
  one meeting service.
- **generic part**: the part that reads any meeting service the
  operator describes to it in its settings.
- **meeting part**: a part, eddy's or another author's, that passes the
  conformance suite (66).
- **capture host**: a program that runs parts and keeps what they hand
  it as captures in an inbox.
- **inbox**: where a capture host keeps captures, and the signals
  readers draw from them.
- **capture**: what a capture host keeps of one event a part handed it:
  what the event was, when it happened, and a pointer to its raw
  material.
- **event time**: of a capture, when its event happened.
- **pointer**: what a capture holds to say on which machine, and where
  on it, its raw material is kept.
- **signal**: one assertion a reader draws from a capture, quoting its
  raw material.
- **excerpt**: the words a signal quotes. A capture that carries one
  becomes its signal with no reader.
- **run**: one start of a part by a capture host, for one account.
- **raw place**: the place a capture host gives one run for raw
  material.
- **cursor**: a value a run ends with that marks where the next run's
  listing begins, read only by its part.
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
   one into two.
2. Every occurrence of a recurring meeting is a meeting of its own,
   with an identity of its own.
3. Every meeting has exactly one identity, and it never changes. Every
   listing, run, surface, account and machine names one meeting by the
   same identity, so an asker or a capture host can key on it.
4. Two meetings never share an identity, whatever characters a
   service's ids hold and whichever account listed them.
5. A conversation recorded on two services is two meetings. eddy never
   decides that two meetings hold one conversation; a reader does.

### A.2 Details

6. A meeting's details are only what its service gives of it. eddy
   never invents, corrects or infers a detail, and reports one the
   service does not give as not given.
7. The start eddy gives a meeting is never when eddy listed it or when
   a capture host took it. Where a service records both when a meeting
   was planned to begin and when it began, eddy gives when it began.
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
    meetings.
12. The day's meetings, for an asker, are the listings of every account
    eddy reads, over the asker's day, given as one answer that names
    each account whose listing is not complete (11).

### A.4 Transcripts

13. eddy gives a transcript as its service served it, whole, and
    changes nothing in it.
14. The plain copy holds one line per turn, in the order the turns were
    spoken. Each line gives when the turn began where the transcript
    says, its speaker as the transcript names it, and its words as the
    transcript gives them, changing nothing but the white space between
    words. Its form is the same whatever service recorded the meeting.
15. eddy never names a speaker the transcript leaves unnamed, and never
    gives a turn's words to any speaker but the one the transcript
    gives them to.
16. Every answer that gives a transcript or a plain copy gives it whole,
    or the part an asker asked for together with a way to read the
    whole. eddy never gives part of one as if it were whole.

### A.5 Short meetings

17. eddy leaves out a meeting shorter than the shortest length, decided
    by the meeting's length alone. Every listing, run, surface and
    machine with the same shortest length leaves out the same meetings,
    and leaving one out needs no record.
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
    and hands every other. A meeting whose start its service does not
    give is named failed, never handed with a start of eddy's own (6).
24. A run ends complete only when its listing was complete (11) and
    every meeting in it was handed, skipped, found not ready, or named
    failed. A run that cannot sign in or reach its service never ends
    complete, and says why.
25. The cursor a complete run ends with never excludes from a later
    listing a meeting that no run has handed, other than one skipped
    (17). A meeting named failed, or whose transcript was not yet ready,
    is listed again by the next run.
26. A run given no cursor lists every meeting whose start is at or after
    its part's earliest start. Whatever cursor a run is given, or none,
    it hands every meeting under the same identity (3).
27. A run depends only on its service's answers, its settings, its
    cursor and the clock. It never depends on which capture host or
    which machine started it, and never learns which inbox keeps its
    captures.
28. Two runs of one part for one account at once, on one machine or
    two, hand the same identity for every meeting. Two on one machine
    share one sign-in and leave it whole.

### A.7 What eddy keeps

29. eddy keeps nothing between answers but its sign-ins and its runs'
    cursors, each in its store (B.3). It keeps no list of the meetings
    it listed or handed, no capture, and no transcript beyond the answer
    or the run that fetched it.
30. Every cursor can be discarded, and the next run lists from its
    part's earliest start and hands nothing under a new identity (26).
    A discarded sign-in costs signing in again, and no meeting (24,
    25).
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
    eddy writes holds a word spoken in a meeting.

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

### A.10 Parts

43. Each part reads one meeting service, the generic part the one its
    settings describe. Every part gives identities of one shape,
    details in one form and raw material in one layout, and skips by
    one rule; parts differ only in the service they list and fetch
    from.
44. A part is a meeting part by passing the conformance suite (66), and
    by nothing else. eddy's own parts have no standing that a part
    another author publishes lacks.
45. The generic part gives the meetings of the service its settings
    describe identities under the name the operator gives that service.
    eddy refuses a name another described service or a part already
    goes by.

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
    every call. Where a service gives ids unique only within an account
    or a tenant, or one id to every occurrence of a recurring meeting,
    its profile makes each identity unique to one meeting from what the
    service does give, so 2, 3 and 4 hold.

### B.2 The capture host

51. **start**: the capture host starts a run of one part for one
    account, with the part's settings, a raw place of the run's own,
    the cursor the cursor store keeps or none, and each secret the part
    says it needs.
52. **hand**: given a meeting that is ready, one capture as 22 fixes it,
    its raw material already placed (20, 63).
53. **mark**: given a cursor, the cursor the run ends with, which the
    cursor store keeps once the run ends complete (25, 58).
54. **end**: given how many meetings the listing held and each meeting
    named failed, with what failed and why, the end of a complete run
    (24). A run that stops without one is incomplete.
55. The guarantee: the capture host keeps one capture per identity and
    passes over a capture whose identity it already holds, so a part
    may hand one meeting any number of times (21). A capture taken from
    an incomplete run stays taken, and that run's cursor is never kept.
    A capture the contract refuses is named in the run, and every other
    capture of the run is taken.
56. A part runs unchanged under every capture host that keeps this
    contract, and is never told which one started it (27).

### B.3 The stores

57. **read-cursor**: given a part and an account, the cursor last kept
    for them, or none.
58. **keep-cursor**: given a part, an account and the cursor of a
    complete run, the cursor kept, all or nothing.
59. The cursor store keeps a cursor only from a complete run (24), and
    a cursor it loses costs a listing from the earliest start and no
    meeting (30).
60. **read-sign-in**: given a service and an account, the sign-in kept
    for them on this machine, or none.
61. **write-sign-in**: given a service, an account and a sign-in, the
    sign-in kept, all or nothing. Of two writes at once, one is kept
    whole (28).
62. The sign-in store gives a sign-in to nothing but eddy acting for the
    operator, and keeps it apart from everything eddy hands or writes
    elsewhere (33).
63. **place-raw**: given a run's raw place and a meeting, the meeting's
    raw material written there whole (8, 13, 14), and the names its
    capture gives it.
64. Raw material stays on the machine that fetched it, outside every
    record shared beyond that machine, and whoever reads a capture
    there reaches its raw material by the capture's pointer (37). eddy
    never reads back what it placed.

### B.4 Binding the contracts

65. Each seam is bound by naming one or more profiles of Part C. Any
    number of meeting services are bound at once, each through its own
    part; one capture host starts any one run; and one store of each
    kind serves it.
66. One conformance suite holds every part and every profile to Parts A
    and B, and a part or a profile that fails it is not one.

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile.

### C.1 The capture host: Flywheel's capture contract

Flywheel's statement of invariants (`design/flywheel-next/requirements.md`)
defines the capture contract, the one way an adapter hands captures to
a capture host. flywheel-next's capture crate implements its types and
key rules, and its conformance pack proves every capture host and every
adapter part. millpond takes the contract today and Flywheel's tick
later, unchanged (56). What eddy must do under it is this.

| operation | how the capture contract satisfies it |
|---|---|
| start | eddy's Flywheel plugin declares each part as an adapter part: its command, the shape of its configuration and the secrets it needs. The capture host runs `eddy capture <part> --raw-dir <dir> [--cursor <c>]`, `<dir>` fresh for the run, with the part's settings in the file the `CAPTURE_CONFIG` environment variable names and each declared secret in the environment under its declared name. |
| hand | one line of JSON on standard output, `{"capture": {…}}`, with the fields below |
| mark | `{"cursor": "<c>"}`; the capture host keeps the last cursor line of a run that ends in `done`, and passes it back as `--cursor` on the next |
| end | `{"done": {"listed": <n>, "failed": [{"what": "<key>", "why": "<reason>"}]}}`, then exit status 0; `listed` counts every meeting the listing held, skipped and unready ones among them. A run that is not complete (24) prints no `done` and exits with a status other than 0, saying why on standard error, which holds no word of a meeting (37). |

Each line is one JSON object holding exactly one of `capture`,
`cursor` and `done`. A meeting capture's fields:

| field | a meeting part writes |
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
its raw bank on the machine, never in git, under the capture's name;
writes the capture with a pointer of the form `<host>:<path>`; and
marks a capture with no excerpt unread, which charges a reader. A run
that exits without `done`, or with a status other than 0, keeps every
capture already taken; its cursor is not kept, and the run is recorded
failed.

The conformance pack holds the meeting checks a part passes to count as
a meeting part (44): every key of the form `meeting/<part>/<id>`,
`source` `meeting`, `event_at` at the meeting's start, no excerpt, and
`raw` naming the transcript as served and the plain copy. eddy's
conformance suite (66) runs them.

### C.2 Identity

A meeting's identity is the key `meeting/<part>/<meeting id>`.
`<part>` is the part's name, `wispr`, `webex` or `teams`, or for the
generic part the name the operator gives the service it reads (45).
`<meeting id>` is the id C.3 names for the service, with every byte
outside RFC 3986's unreserved characters percent-encoded, and an id of
`.` or `..` written `%2E` or `%2E%2E`. Any id is then one segment, no
two ids give one key (4), and the encoded id is also a safe name for a
folder.

### C.3 Meeting services

| profile | the meeting id | list-meetings and fetch-transcript | sign-in | when |
|---|---|---|---|---|
| **`wispr`** | the id the endpoint gives the meeting | Wispr Flow's MCP endpoint, over HTTP. The part is an MCP client of it and calls its tools from its own code, so no Claude session runs to list meetings (9). | the part's own, made once per machine by the operator | first |
| **`webex`** | the id of the meeting instance a transcript belongs to, never its series' id (2) | Webex's transcripts API: the transcripts in a window, then each one's content as served | an integration the operator approves, once per machine | when the operator records on Webex |
| **`teams`** | the transcript's own id, since Graph gives every occurrence of a recurring meeting one meeting id (2, 50) | Microsoft Graph's meeting transcripts | an application the tenant's administrator has consented to, then the operator's sign-in once per machine | when a tenant's administrator consents |
| **generic** | the id the endpoint's answer gives, in the field the settings name | any MCP endpoint that serves meetings and their transcripts. The settings name the endpoint, the name it goes by (45), its listing tool and its transcript tool, and the field of each answer that gives each detail and the transcript. It is an MCP client, as `wispr` is. | as the endpoint asks, once per machine | for services with no part of their own |

Each part is tested by replaying its service's recorded responses, so
a test needs no account, no sign-in and no network.

A part's settings are the file `CAPTURE_CONFIG` names when a capture
host runs it, and `$XDG_CONFIG_HOME/eddy/eddy.toml` when it runs
alone: the account, the shortest length, the earliest start, and for
the generic part its endpoint's description.

sign-in is `eddy sign-in <part>`, run by the operator on the machine.
sign-in-state is `eddy status`, which reaches no meeting (34); a
fleet's doctor reads `eddy status --json` to warn as a sign-in nears
its end.

### C.4 Raw material

Under the run's raw directory, one folder per meeting, named by its
encoded meeting id (C.2):

| file | holds |
|---|---|
| `<id>/transcript.<ext>` | the transcript as served, whole (13); `<ext>` from its form, such as `json`, `vtt` or `txt` |
| `<id>/turns.txt` | the plain copy (14): one line per turn, `<offset>`, a tab, `<speaker>`, a tab, `<words>`. `<offset>` is `HH:MM:SS` from the meeting's start, empty where the transcript gives no time; `<speaker>` is as the transcript names it, empty where it names none (15); `<words>` are the transcript's, each tab or line break inside a turn written as a space |
| `<id>/meeting.json` | the details (8): the service's meeting id, the title, the start, the length in seconds, the attendees as the service names them, and the address, each `null` where the service gives none (6) |

`raw` in the capture names all three.

### C.5 Stores

| store | profile | read and write |
|---|---|---|
| cursor | **the capture host** | millpond keeps it per machine under its state directory, keyed by inbox and part, and Flywheel's tick in its own state. read-cursor is the `--cursor` a run starts with; keep-cursor is the last `cursor` line of a run that ends in `done` (C.1). |
| sign-in | **eddy's own**, alone and under millpond | one file per service and account under `$XDG_STATE_HOME/eddy/sign-in/`, readable by the operator's user alone; write-sign-in writes a new file beside the old and renames it over the old, under a lock held for the write (61) |
| sign-in | **the host's secrets**, under Flywheel | read-sign-in is each secret the part declared, placed in its environment by the host |
| transcripts | **the raw bank** | place-raw writes C.4's files under the run's `--raw-dir`; the capture host banks them in its raw bank on the machine, under the capture's name, behind a pointer of the form `<host>:<path>`, and never in git (64) |
| transcripts | **none**, alone | eddy gives a transcript to its asker and writes it nowhere (29) |

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** No language model runs inside eddy, and eddy never judges a
  meeting or reads one into signals (9, 42).
- **I2.** A meeting has one identity for ever, everywhere, and no two
  meetings share one (3, 4).
- **I3.** A meeting's words reach an asker as its service served them,
  changed in the plain copy only in their white space, and go nowhere
  else but the raw place of the run that fetched them (13, 14, 22,
  37).
- **I4.** eddy keeps no list of what it handed; the capture host stops
  a second capture of one meeting (21, 29, 55).
- **I5.** No failure loses a meeting: a meeting no run has handed is
  listed again (23, 25).
- **I6.** A sign-in never leaves its store (33).

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
- Searching what meetings said. eddy keeps no index of them (29).
- Keeping an archive of transcripts. A capture host's raw bank holds
  what its runs fetched.
- Changing anything at a service (36).
- Deciding when a part runs, on which machine, or for which inbox. The
  operator says, through a capture host's settings.
- Telling anyone by itself. A surface tells, when its asker asks.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- A capture is handed to a capture host by Flywheel's capture contract,
  which Flywheel's statement of invariants defines. C.1 gives what eddy
  must do under it.
- The capture hosts are millpond today and Flywheel's tick later, and a
  part runs unchanged under either.
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
  plugin that shows the day's meetings in a pane; and a Flywheel plugin
  whose parts are adapter parts, one per meeting service.
- The capture contract's types and key rules from flywheel-next's
  capture crate, as every adapter part takes them.
- Each part tested by replaying its service's recorded responses.
- The profiles of Part C: `wispr` first, and `webex` and `teams` when
  the operator records there.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- Does a service ever give one recorded occurrence two transcripts, or
  revise a transcript after a run handed it? Is the second a meeting of
  its own, more raw material of the first, or never captured (2, 20,
  55)?
- How long does a meeting that is never ready, or that its service no
  longer holds, go on being listed again, and who sets that bound: the
  operator, the part or the service (25)?
- What is the shortest length when the operator sets none, and is it
  set per part, per account or per capture host? May an asker ask for
  a listing that keeps short meetings in, and is that another answer
  to the same question (17, 38)?
- What is a part's earliest start when the operator sets none (26)?
- Does any service give meeting ids unique only within an account or a
  tenant, and how does its profile make each identity unique to one
  meeting (4, 50)?
- How does the name the generic part's service goes by stay unique
  across machines whose captures reach one inbox, when eddy on each
  machine sees only its own settings (4, 45)?
- Under Flywheel the host places a part's secrets in its environment.
  Where does a part keep a sign-in its service renews on use, so the
  next run finds the renewal (32, 60, 61)?
- Where does a cursor live when a part's runs move to another machine
  (57, 58)?
- Does the herdr plugin hand a meeting on, to a session in a pane or to
  a capture host as a capture? Does the Claude Code plugin find a
  meeting by anything but its identity and a window (38, 42)?
- Does eddy publish the code its parts share, so another author's part
  gives identities, details, raw material and skips of eddy's shape
  without writing its own (43, 44)?
- Are attendees given as the service names them, addresses included
  (6, 8)?
- An inbox may already hold meetings that reached it by another route
  before eddy ran, such as an import of meetings read earlier. Does a
  part's first earliest start begin where those end, or does a reader
  join the two (5, 26)?

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** The operator holds three meetings on Wispr Flow in a morning.
  The part's next run hands three captures, each with its transcript as
  served, its plain copy, its start as its event time and no excerpt.
  No language model ran.
- **S2.** The same part runs again an hour later with the cursor the
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
  each under the identity the parts hand, one of them marked not ready.
  Webex cannot be reached at the next refresh, and the pane says so
  beside the Wispr meetings.
- **S10.** A listing of last week's meetings matches the service's own
  list of recorded meetings, less those shorter than the shortest
  length.
- **S11.** A weekly meeting recurs four times. Each occurrence is a
  meeting of its own, with its own identity and its own capture.
- **S12.** A part runs under millpond, and later under Flywheel's tick.
  Given the same answers from the service, it hands the same captures.
- **S13.** A service's meeting id holds a `/`. The identity keeps the
  id in one segment, and no other meeting's identity matches it.
- **S14.** The operator drops a transcript saved by hand into a capture
  host's watched folder, and a part lists the same meeting. The inbox
  holds two captures, eddy read no inbox, and a reader joins them.
- **S15.** Another author publishes a meeting plugin for a service eddy
  has no part for. It passes the conformance suite and runs beside
  eddy's parts, and nothing in the capture host tells them apart.
- **S16.** A scheduled run and a run started by hand read one account
  on one machine at once. Each meeting is handed under one identity by
  both, the inbox keeps one capture of each, and the sign-in still
  works afterwards.

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of eddy that satisfies Parts A and B: its components, the
answer each surface gives, how a run lists and derives its captures and
its cursor, with fixed examples, the plain copy's form, and how a part
is added, by eddy or by another author. A conformance suite whose
scenarios each cite the clauses they exercise, failing when a clause is
cited by nothing, with the capture contract's meeting checks among
them. The profiles of Part C, each passing the suite, `wispr` first,
each part tested by replaying its service's recorded responses.

<!-- ANCHOR_END: deliver -->
