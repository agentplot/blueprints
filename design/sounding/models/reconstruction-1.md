# sounding: a model from the statement

Built from `requirements.md` alone. Clause numbers in parentheses are its
numbered clauses; `C.n` its Part C tables; `S<n>` its scenarios; `I<n>`
its invariants. Where I had to decide something the statement does not,
the decision is marked `[Q<n>]` and listed under *Questions*.

## The form

The statement's centre is a set of six contracts with guarantees (71–93)
and a table of ways each is satisfied (C.1–C.8): that is **ports and
adapters**, a core with six ports and a profile per port. Inside the core
the statement fixes two things precisely enough to model as themselves: a
**data model**, the held state, append-mostly (61, 63) and read through
one versioned store (88–90); and a **derived state machine**, whose five
states are computed from the held state and one external fact, whether
the round's session lives (48, 117). So the form is: ports and adapters
around a core that is a data model plus a derived state machine, with a
clock (the timebox and the time to conclude, 41–45) as the one part of
the core that acts on its own.

Considered and rejected:

- **Pure event log.** The held state is written only at named events (61)
  and its records never change (63), which invites a log; but C.7 fixes
  the store as files by kind (`question.md`, `rounds/<n>.md`,
  `sounding.rec`) with a round record that is written at start and again
  at end (C.7 "each round's timebox, way of running, start and end"), and
  an offer whose landing outcome changes after it is kept (34). A log is
  a fine implementation of the store's write; it is not the form the
  statement asks a reader to see.
- **Protocol.** No seam is a wire: each is a set of operations with
  guarantees (71–91), and the only message format fixed is the offer's
  capture (C.6), which belongs to one port. (69) fixes one program-readable
  form for what sounding gives a reader, which is an output shape, not a
  protocol.
- **Deployment.** Section 9 fixes one binary and two plugins, but Parts A
  and B name no process, host or service (preamble), and (68) collapses
  every surface onto one core, so there is nothing to deploy apart from
  that core. Where the clock runs is a question (Q1), not a form.
- **State machine alone.** Rejected as the whole, because (48) makes the
  state a derivation, not a thing kept; no transition writes a state.
  It is one section of the model, not the model.

## 1. Shape

```
                 openers                         the operator
   person /sound   inbox   planner      Pending You  herdr sidebar  crew rail  CLI
        \            |        /               \          |           |        /
         \           |       /                 \         |           |       /
          v          v      v                   v        v           v      v
      +---------------------------------------------------------------------+
      |  surfaces (read + act through the core, keep no state) (52, 68)     |
      +---------------------------------------------------------------------+
                                     |
                                     v
      +=====================================================================+
      ||                        sounding core                              ||
      ||  held state  ---derive--->  state  <---  session lives? (48)      ||
      ||  rules: open, start round, exits, note, stop check, clock,        ||
      ||         decisions, settle, land, withdraw           (Part A)      ||
      +=====================================================================+
          |            |             |              |              |
   B.1 place     B.2 session    B.3 operator   B.4 keeper     B.5 inbox      B.6 store
   make/commit   start/state/   put/read/      settle         land          read/list/write
   remove        tell/end       withdraw                                    (CAS on version)
      |              |             |               |              |             |
   worktrunk     Claude Code    Pending You     millpond        millpond     sounding/<name>
   git worktree  in herdr pane  herdr plugin    crew           Flywheel      branch, .sounding/
   a launcher    printed cmd    crew rail       Flywheel       none
                 Flywheel       Flywheel rail   none
```

The one invariant at the centre, the derivation every reader and every
surface shares (47–49, 68):

```
state(s) =
  accepted                  if s has a decision accept
  dropped                   if s has a decision drop
  waiting on the operator   if a conclusion of s has no decision
                            or an ask of s has no reply
  working                   if the newest round of s has no end
                            and its session lives
  parked                    otherwise
```

and beneath it the counting invariant I1: one question, one place, one
session per round, one decision per conclusion (1, 10, 17, 51).

## 2. Values and records

All times are instants with a zone; durations are whole seconds. Text
fields are kept byte for byte as given (7, 54, 63).

### 2.1 Identities

| value | what | from |
|---|---|---|
| `Repository` | one git repository; identified by where its branches live, never by a path a reader typed | 63 (vocab), 62 |
| `Name` | words telling a sounding apart within its repository; lower case, hyphen-joined (C.1); never an ordinal or id (3) | 3, 4, C.1 |
| `SoundingId` | `(Repository, Name)` | 3, 32 |
| `RoundNo` | integer from 1, in order of start | 17 |
| `OfferNo` | integer from 1, among the sounding's offers | 32, C.6 |
| `AskNo` | integer from 1, among the sounding's asks | C.7 (`asks/<n>.md`) |
| `Revision` | a git commit of the repository | 10, 14 |
| `Version` | the store's version of a held state: the tip commit of `sounding/<name>` (C.7) | 88, 90 |
| `SessionHandle` | opaque to the core; what the session binding needs to answer `state`, `tell`, `end` (76–78) | 75 |
| `SurfaceHandle` | opaque to the core; what the operator binding needs to `read` or `withdraw` a request (81, 82) | 80 |
| `ItemRef` | opaque to the core; the keeper's identity for the item (9, 84) | 9 |

### 2.2 The held state of one sounding

```
Sounding
  name            Name
  base            Revision            # the revision the place was made from (10)
  question        Text                # as given, never changed (1, 7)
  sources         [Source]            # exactly the opener's (5)
  item            ItemRef?            # at most one, fixed at open (9)
  opened_at       Instant
  opened_by       OpenerKind          # person | inbox | planner | surface:<name>  (49 actors)
  rounds          [Round]             # ordered by n
  asks            [Ask]
  offers          [Offer]
  requests        [Request]           # what has been put before the operator (80)
  decisions       [Decision]          # at most one per concluded round (51)
  tellings        [Telling]           # the keeper's: one per decision (57)
  ended           End?                # set once, never cleared (47, 59)

Source
  text            Text?               # material given inline
  pointer         Text?               # where material elsewhere is (7)
  label           Text?               # as the opener gave it; never made by sounding
  # at least one of text, pointer

Round
  n               RoundNo
  way             unattended | with-operator          (20, 84 vocab)
  timebox         Duration?           # none for with-operator (46)
  starter         opener | operator                   (82 vocab)
  started_at      Instant
  session         SessionHandle?      # present once evidence of the session exists (75)
  timebox_told_at Instant?            # when the end of the timebox was delivered (43)
  ended_at        Instant?
  ending          conclusion | note | gone | ended    # (21): "ended" = sounding or the operator ended it
  revision        Revision?           # what the place held when the round ended (14)
  timebox_ran_out Bool?               # (45); false for with-operator
  conclusion      Conclusion?
  note            Note?

Conclusion                              # never changes once kept (29, 63)
  answer          Text                 # "(none)" written where empty (27)
  evidence        Text
  changes         Text                 # what the answer would change
  proposed_work   [ProposedWork]       # each apart (28); may be empty, said so
  open            Text                 # what stays open
  revision        Revision             # = Round.revision (14)
  concluded_at    Instant

ProposedWork
  title           Text                 # one line
  text            Text

Note                                    # never changes once kept (63)
  did             Text                 # what the round did (40)
  next            Text                 # where the next round would start
  revision        Revision
  noted_at        Instant

Ask
  n               AskNo
  round           RoundNo
  text            Text
  choices         [Text]               # may be empty: a free reply (80)
  asked_at        Instant
  reply           Response?            # kind = reply
  closed          unanswered?          # set when its round ended on a conclusion or note [Q12]

Offer                                   # identity and finding never change (32, 63)
  n               OfferNo
  round           RoundNo
  finding         Text                 # whole, as the session wrote it (31)
  assertion       Text?                # one sentence, as the session gives it (C.6)
  subjects        [Text]               # as the session gives them (C.6)
  argues_with     [Text]
  offered_at      Instant              # the session's time, never the inbox's (31)
  landing         Landing              # the part that may change (34)

Landing
  outcome         taken | already-held | refused | not-reached | not-bound
  reason          Text?                # the inbox's, on refused
  tried_at        Instant?
  tries           Int

Request                                 # one conclusion or ask on one surface (80, 106 vocab)
  id              Int
  target          conclusion:<RoundNo> | ask:<AskNo>
  surface         SurfaceName          # pending-you | herdr-sidebar | crew-rail | cli | ...
  handle          SurfaceHandle?
  put_at          Instant
  withdrawn_at    Instant?
  withdraw_outcome ok | failed:<text>?

Response                                # never changes once kept (63); (58)
  kind            accept | go-on | drop | reply
  text            Text                 # notes for go-on, reason for drop, the reply for reply; "" for accept
  by              Text                 # who gave it, as the surface names them
  surface         SurfaceName
  request         Int?                 # the Request it answered (83); none when given on the CLI directly
  at              Instant              # when given, as the surface reports it
  received_at     Instant
  applied         Bool                 # false for the second response to one request (52)
  not_applied_because Text?

Decision                                # (51): exactly one per concluded round
  round           RoundNo
  response        Response             # kind accept | go-on | drop, applied = true

Telling                                 # the keeper's record (57)
  decision        RoundNo | drop-without-conclusion
  told_at         Instant?
  tries           Int
  last_error      Text?

End
  kind            accepted | dropped
  at              Instant
  reason          Text?                # the drop's (53)
  response        Response             # the one that ended it
```

### 2.3 The operator's settings

```
Settings
  default_timebox   Duration   # [Q3] default 60 min
  max_timebox       Duration   # [Q3] default 240 min
  time_to_conclude  Duration   # [Q3] default 10 min
```

From `~/.config/sounding/config.toml` (C.8). Bindings (which profile
binds each seam) are not in the statement's settings and have to live
somewhere: [Q4].

### 2.4 What a round's session is handed (19)

```
Handout
  sounding        SoundingId
  round           RoundNo
  way             unattended | with-operator
  timebox         Duration?
  question        Text                  # verbatim (7)
  sources         [Source]              # verbatim, pointers kept (7)
  operator        [Response]            # every note (go-on) and reply, verbatim, in time order (7, 54)
  earlier         [EarlierRound]        # every earlier round
  accepted_earlier [Conclusion]         # accepted conclusions of *other* soundings named as sources (6) — see Q13

EarlierRound
  n, way, timebox, timebox_ran_out, revision
  ended           conclusion | note | gone | ended
  conclusion?  note?
  decision        Response?             # the decision on its conclusion (19)
  asks            [Ask]                 # of that round, with replies
```

## 3. Derivations and decisions the statement fixes

### 3.1 State (47–49, 117–121)

As in §1. Notes on the edges:

- `rounds` empty (open succeeded, the first session never gave evidence of
  existing) → `parked` [Q7]. (49) says a parked sounding's "last round
  ended on a note, or with its session gone or ended"; a sounding with no
  round is parked by the equation and outside (49)'s description.
- A round whose session is gone but whose end sounding has not yet
  written: the equation gives `parked` at once (S11), since "a round
  runs" means the newest round has no end **and** its session lives.
  Writing that round's end (`ending = gone`) is a separate act, see §3.6
  and Q2.
- An ask with no reply whose session is gone → `waiting on the operator`,
  not parked (49: a request waits). The reply starts the next round (37).

`lives(round)` is the session binding's `state` (76) ≠ gone, answered
from the round's `SessionHandle`. Reading may not reach the session (70):
I take "reach" to mean send it anything; checking a handle against the
local host (a process, a pane) is not reaching it [Q2]. On a host that
cannot resolve the handle the equation cannot be evaluated; the reader
reports `working?` with `unverified: true` [Q2].

### 3.2 Name (3, 4, C.1)

```
name_from(question):
  words = question lower-cased, split on anything not a letter or digit, empties dropped
  refuse if words is empty or every word is digits
  name = first 6 words joined by "-"            # [Q5] the cut
valid(name):
  matches ^[a-z0-9]+(-[a-z0-9]+)*$
  has at least one word that is not all digits and not all hex of length >= 7   # "never an ordinal or an id" (3)
open refuses a name that fails valid(), naming the rule, and never alters it (4).
taken(repository, name) ⇔ branch sounding/<name> exists (3, 15, 71, C.7)
```

### 3.3 The round's clock (38, 41–45, 111–114)

The section-10 question is answered: a round's time is wall time since
its start less the time it waited on replies, because that is the
definition of timebox (111) and of (38).

```
waits(round, now) = Σ over asks a with a.round = round.n:
                      (a.reply.received_at if replied else now) - a.asked_at
working_time(round, now) = (now - round.started_at) - waits(round, now)
timebox_out(round, now)  = round.way = unattended ∧ working_time(round, now) ≥ round.timebox
conclude_deadline(round) = round.timebox_told_at + settings.time_to_conclude
```

Rules:

- `timebox` is fixed at start (41): `starter's choice` if named and
  ≤ `max_timebox`, else refused naming the longest (42) [Q6: refuse, not
  clamp]; `default_timebox` if none named (42).
- When `timebox_out` first holds, sounding `tell`s the session that its
  timebox has run out and it must conclude with what it knows (43, 77),
  writes `timebox_told_at`, and from then on refuses a new ask of that
  round ("more time is only ever another round", 41) [Q8].
- At `conclude_deadline` with neither conclusion nor note kept: `end` the
  session (78), `commit` the place (72), write the round's end with
  `ending = ended`, `revision`, `timebox_ran_out = true` (44, 45). State:
  parked.
- A conclusion or note before `timebox_out` → `timebox_ran_out = false`;
  after → `true` (45; S3).
- A round with the operator has `timebox = none`, no told, no deadline
  (46).
- Waiting time pauses the clock but is itself unbounded: a session may
  wait on a reply for days (38, S4).

### 3.4 The stop check (39, 79, 109)

Invoked by the session binding each time an unattended session would
stop, with the round it serves.

```
stop_check(sounding, round_no):
  r = rounds[round_no]
  if r.way = with-operator            → may stop            (46)
  if r.ended_at is set                → may stop            (round over: conclusion, note, or sounding ended it)
  if r.conclusion or r.note is kept   → may stop            (cannot happen with ended_at unset, kept for clarity)
  else                                → send back, with: "round <n> of <name> has no conclusion or note;
                                        run `sounding conclude` or `sounding note`"   (39)
```

The check sends back during the time to conclude too (39 has no
exception) [Q9]. It reads held state and writes nothing.

### 3.5 Idempotence of exits and decisions (26)

A repeat is recognised by content, since the statement gives the session
no token [Q10]:

| act | a repeat is | effect of a repeat |
|---|---|---|
| conclude | a conclusion byte-identical to the one kept for that round | nothing; the kept one is returned |
| conclude, different text, round already ended | not a repeat | refused: "round n ended on a <ending>" (25, 29) |
| offer | a finding byte-identical to a kept offer of the sounding | nothing; the kept offer and its landing are returned; the inbox is not called again |
| ask | an ask byte-identical to an open ask of the same round | nothing; the open ask is returned |
| note | a note byte-identical to the one kept for the round | nothing |
| decision | a response of the same kind and text on a conclusion already decided by one of the same kind and text | nothing; reported as already applied |
| decision, different | not a repeat | kept with `applied = false`, reported as not applied (51, 52) |
| settle | the keeper's own guarantee (85); sounding retries freely |
| land | the inbox's own guarantee (87); sounding retries freely |

### 3.6 How a round ends (21)

| ending | written when | by |
|---|---|---|
| `conclusion` | the session's `conclude` is kept | the exit |
| `note` | the session's `note` is kept | the note act |
| `ended` | the time to conclude ran out (44); the operator dropped the sounding while it ran (53); the operator ended a with-operator round (46) | the clock; the decision; the operator's end |
| `gone` | the binding's `state` answers gone for the round's session and the round has no end | whichever act next writes this sounding's held state (a resume, a reply, a drop, a tick), see Q2 |

Every ending commits the place first (14, 72) and names the revision.
`gone` is written with the revision of the commit made at that moment
(the place still holds what the session left, 11).

### 3.7 What a conclusion says where empty (27)

Each of the five parts is required text; an empty one is kept as the
literal line `(none)` so the conclusion "says so". `proposed_work` empty
is kept as `(none)` under its heading.

## 4. Operations of the core

Every operation: re-reads the held state at a version, applies, writes
with compare-and-swap on that version, and on refusal of the write
re-reads and applies again (90, 61). An operation on an ended sounding is
refused (59) except reads and the operator's removal, which is not
sounding's (15, 59). An exit naming another sounding or a round other
than the one open is refused (25).

### 4.1 open

- **Given**: repository (the cwd's, or named); question; sources
  (zero or more; each text or pointer); name (or made, §3.2); revision
  (default: the tip of the repository's default branch, C.1 [Q11]); item
  (optional); first round's timebox (optional); way (default unattended);
  opener kind.
- **Refuses**: invalid name (3); name taken, naming the sounding whose it
  is (4, 13 S13); timebox over the longest (42); revision not in the
  repository; another sounding's place path in the way (16).
- **Effects**, in order:
  1. `place.make(repository, revision, name)` (71) → place, branch
     `sounding/<name>`.
  2. Write held state v1: `Sounding` with `rounds = []` (61 "opening").
  3. Start round 1 (§4.2) with `starter = opener`.
  4. Return at once with the sounding's id, its state and the place's
     path; never wait on the session's work (2). The opener's session is
     not the started one (2).
- If step 1 succeeded and step 2 failed, the branch exists with no held
  state: the place is removed and the branch deleted by open itself
  (nothing of sounding's was kept yet; 15 protects a sounding's branch,
  and this never was one) [Q7].

### 4.2 start round (internal; 17–20)

- **Pre**: sounding not ended; no round open (newest round has `ended_at`
  or `rounds` empty); the place exists (it does until end, 11, 15).
- **Effects**:
  1. `n = last n + 1`; `timebox` per §3.3; `way` per the starter.
  2. Compose the `Handout` (§2.4) from held state alone.
  3. `session.start(place, handout, way)` (75).
  4. Wait for evidence the session exists, bounded (the binding says how
     long, default 30 s) [Q7]; on evidence write `Round{n, started_at,
     session}` (61 "a round's start"). Without evidence write nothing
     and report "round n of <name> did not start"; state: parked, and
     `resume` tries again.
  5. Start the clock for the round if unattended (§3.3; where it runs is
     Q1).

### 4.3 conclude (exit; 27–30)

- **Given**: round `n` (handed at start), the five parts, from the
  session running in the place.
- **Pre**: round `n` is the open round of the sounding named by the
  place's branch; not ended (25, 59).
- **Effects**:
  1. `place.commit` → `revision` (72, 14).
  2. Write: `Round.n.conclusion`, `ended_at`, `ending = conclusion`,
     `revision`, `timebox_ran_out`; any open ask of the round →
     `closed = unanswered` and its requests withdrawn [Q12].
  3. `operator.put(conclusion, choices = accept | go on with notes | drop
     with reason)` on every bound surface (80, 92); write a `Request` per
     surface with its handle.
  4. Return. The session does no more on the sounding (29); the stop
     check now lets it stop.
- Never calls the inbox (30, I4).

### 4.4 offer (exit; 31–35)

- **Given**: round `n`, the finding whole, optional assertion, subjects,
  argues_with.
- **Pre**: as conclude's, except the round may be waiting on a reply.
- **Effects**:
  1. If a kept offer has the same finding → return it (26, §3.5).
  2. Write `Offer{n = last + 1, offered_at = now, landing = not-bound |
     not-reached(tries 0)}` (33: kept at once).
  3. If an inbox is bound: `inbox.land(offer)` once, with a short bound
     (default 5 s) [Q14]; write the `Landing`.
  4. Return at once with the number and landing; the session goes on (33).
- Retried by `tick` (§4.12) while `outcome = not-reached` (34).
- Ending the sounding touches no offer (35).

### 4.5 ask (exit; 36–38)

- **Given**: round `n`, the text, optional choices.
- **Pre**: as conclude's; refused after `timebox_told_at` [Q8].
- **Effects**:
  1. Write `Ask{n, round, text, choices, asked_at = now}`; put a
     `Request` on every bound surface (80).
  2. The act blocks the session: it polls `operator.read` on the ask's
     requests until a reply is kept (36, 81), then returns the reply.
     The session binding reports `waits on a reply` meanwhile (76).
  3. If the sounding is dropped meanwhile, the act returns "dropped".
- The time from `asked_at` to the reply's `received_at` is a wait (38).

### 4.6 note (the fourth act; 23, 39, 40)

Not in section 9's command list; required by (23) and (39) [Q15].

- **Given**: round `n`, `did`, `next`.
- **Pre**: as conclude's.
- **Effects**: `place.commit` → revision; write `Round.n.note`,
  `ended_at`, `ending = note`, `revision`, `timebox_ran_out`; open asks
  closed as unanswered [Q12]. No request is put: a note asks nothing of
  the operator. State: parked (49).

### 4.7 reply (the operator's response to an ask; 36, 37)

- **Given**: a `Response{kind = reply}` from a surface naming its request,
  or from the CLI naming the ask.
- **Pre**: the ask exists, is open; sounding not ended.
- **Effects**:
  1. If the ask already has a reply: keep this one with `applied = false`,
     report not applied (52).
  2. Else write `Ask.reply`; withdraw the ask's other requests (82).
  3. If the ask's round's session lives: the blocked `ask` act picks the
     reply up (37). If it is gone: write the round's end `gone` if not
     written, then start the next round (37, 18), which is handed the ask
     and its reply among the operator's replies (7, 19).

### 4.8 accept (51–59)

- **Given**: `Response{kind = accept}` from a surface or the CLI, naming
  the sounding (and the round, when more than one conclusion could be
  meant; only the newest round's can be undecided).
- **Pre**: a conclusion awaits its decision; sounding not ended.
- **Effects**:
  1. Write `Decision{round, response}`, `ended = {accepted, at,
     response}`; withdraw every open request of the sounding (52).
  2. `place.remove` (15, 73): processes ended, branch kept.
  3. If `item`: `keeper.settle(item, accept, conclusion, proposed_work)`
     (55, 56, 84); write `Telling`. If no item: nothing; the conclusion
     and its proposed work stay in the held state (56, S12).
  4. Return the held state. sounding makes no work (56, I6).
- Done by a round's session: refused (24) [Q16].

### 4.9 go on (54)

- **Given**: `Response{kind = go-on, text = notes}`, next round's timebox
  and way (default: settings default, unattended).
- **Pre**: a conclusion awaits its decision; sounding not ended.
- **Effects**:
  1. Write `Decision`; withdraw the other requests (52). The notes are
     kept in the response, verbatim (54); they never touch `question` (1).
  2. `keeper.settle(item, go-on, conclusion)` if `item` (57); `Telling`.
  3. Start the next round (§4.2) in the same place, `starter = operator`.
     If the start fails the decision stands and the sounding is parked;
     the failure is reported (51).
- Notes given with no decision are refused: "notes change nothing apart
  from a decision" (54).

### 4.10 drop (53, 57)

- **Given**: `Response{kind = drop, text = reason}`; reason required.
- **Pre**: sounding not ended (any other state, 53).
- **Effects**:
  1. If a round is open: `session.end` (78) [Q17: 43 vs 53],
     `place.commit`, write the round's end `ended` (or `gone` if the
     session was already gone).
  2. Write `Decision` if a conclusion awaited (the drop is its
     decision, 51); write `ended = {dropped, at, reason, response}`;
     withdraw every open request; open asks closed.
  3. `place.remove` (15); branch and held state stay (S9).
  4. `keeper.settle(item, drop with reason, conclusion?)` if `item`
     (57); `Telling`.
- Offers stay wherever they are (35, S9).

### 4.11 resume (50, 18)

- **Given**: sounding; timebox (optional); way (optional).
- **Pre**: state parked (49, 50). Refused while working ("already
  running round n"), waiting ("a request waits: <which>"), or ended.
- **Effects**: if the newest round has no end (its session gone), write
  its end `gone` with a commit of the place; start the next round
  (§4.2), `starter = operator`, in the same place from what the last
  round left (50, S11).

### 4.12 tick (the clock's and the retries' act) [Q1]

Not in the statement; the acts it performs are (43, 44, 34, 57, 81).

- **Given**: a sounding (or every sounding of a repository).
- **Effects**, each only if due, each a write of its own:
  1. Open round, unattended, `timebox_out` and not told → tell, write
     `timebox_told_at`.
  2. Told and past `conclude_deadline` with no conclusion or note → end
     session, commit, write end `ended`, `timebox_ran_out = true`.
  3. Open round whose session is gone → write end `gone` (Q2).
  4. Offers `not-reached` → `inbox.land` again; write landing.
  5. Tellings with no `told_at` → `keeper.settle` again; write.
  6. Open requests → `operator.read`; apply any response through §4.7–4.10.
- Reads surfaces and sessions, so it is not a read in (70)'s sense; it
  is the one act that may write without an operator or a session behind
  it, which (61) does not list [Q1].

### 4.13 list, show (70, 88, 89)

- `list(repository)` → every sounding with held state, each with name,
  state, round count, newest round's way and ending, what waits
  (conclusion of round n | ask n), `ended`. Reaches no session except
  the local liveness check (§3.1, Q2), no place, inbox or keeper; writes
  nothing (70).
- `show(sounding)` → the whole held state and the derived state, in the
  one form (69, §10).

### 4.14 stop-check (§3.4), guard

- `stop-check(sounding, round)` → `may stop` | `send back: <reason>`.
- `guard(command)` → refuses, inside a round's session, `wt submit`,
  `sluice submit`, a `git push` of a `sounding/*` branch (13, 79, C.3),
  and `sounding accept|go-on|drop` or the MCP `accept`, `go_on`, `drop`
  on any sounding (24) [Q16].

## 5. The seams as ports (Part B) and what each profile binds (Part C)

### 5.1 Place (71–74)

```
port Place
  make(repository, revision, name) -> place | refused(branch exists)
  commit(place) -> revision                    # holds everything in the place
  remove(place)                                # processes ended; branch left
guarantee: the place holds its revision and its own session's work only (74)
```

| profile | make | commit | remove |
|---|---|---|---|
| worktrunk | `wt switch --create sounding/<name> --base <revision>`; the repository's hooks run | `git add -A && git commit` in the place (with §6.3's guard on `.sounding/`) | `wt remove`, branch kept |
| git worktree | `git worktree add -b sounding/<name> <path> <revision>` | same | `git worktree remove`, branch kept |
| a launcher | one act that makes the place and starts the session; binds Session too (92) | same | the launcher's |

`commit` with nothing to commit returns the tip (14 is still met: the
round's revision is what the place holds). Processes "started in" the
place (73): the binding ends the session first (78); anything else the
place profile kills by its own means [Q18].

### 5.2 Session (75–79)

```
port Session
  start(place, handout, way) -> handle          # judged by evidence the session exists
  state(handle) -> working | waits-on-reply | stopped | gone
  tell(handle, message)                         # delivered when not working; while working only the timebox's end
  end(handle)                                   # idempotent on gone
guarantee: asks sounding's stop check each time an unattended session would stop,
           keeps it working when sent back (79, 39); refuses, inside the session,
           every submission to land from the place (79, 13)
```

| profile | start | state / tell / end | stop check and guard |
|---|---|---|---|
| Claude Code in a herdr pane | sounding's herdr plugin makes a workspace named for the sounding, a pane with the conclusion beside it, runs `claude` in the place with the round in its environment (`SOUNDING_NAME`, `SOUNDING_ROUND`, `SOUNDING_WAY`); the Claude Code plugin's start hook calls `sounding handout` and injects it verbatim (7, 19). Evidence: herdr's agent commands list the pane's agent | herdr's agent commands: agent working / idle / absent; `waits-on-reply` = idle with an open ask of the round; tell = herdr's send-to-agent; end = herdr closes the pane | Stop hook → `sounding stop-check`; exit non-zero with the reason sends the session back. PreToolUse hook on shell commands → `sounding guard` |
| a printed command | the CLI prints the `claude` invocation with the same environment; the operator runs it. Evidence: the next act from that session (its first exit or stop check) [Q7] | state: `gone` unless a hook of it spoke within the binding's heartbeat; tell: none while working (the timebox's end is delivered by the next hook call); end: none | the same hooks |
| Flywheel | Flywheel's sessions binding | Flywheel's | Flywheel's |

`--with-me` (C.3): the pane opens beside the operator's own; guard on, no
stop check, no clock (46).

The "evidence" rule (75) means `start` is not trusted by its return: the
core polls `state(handle) ≠ gone` until it is so or the bound passes.

### 5.3 Operator (80–83)

```
port Operator (one per bound surface; several at once, 92)
  put(request: conclusion | ask, choices) -> handle
  read(handle) -> response(kind, text, by, at) | none
  withdraw(handle)
guarantee: a response names its request (83)
```

| profile | put | read | withdraw |
|---|---|---|---|
| Pending You | a card: the conclusion's five parts inline, a link to the whole (`sounding show`), options accept / go on (notes) / drop (reason); an ask: its words with a free reply or its choices | the card's answer, with who and when | the card cancelled |
| sounding's herdr plugin | the sidebar lists not-ended soundings with round and state; the request is the sounding's row offering its keys | the key pressed: accept, send back (= go on, notes = plannotator's annotations on the conclusion), drop; the plugin calls the CLI | the row's keys stop offering a decision once state changes; nothing to cancel |
| crew's rail | one decision per sounding on the rail | crew calls the CLI with the response | crew's |
| Flywheel's rail | the elaboration's decision | Flywheel's | Flywheel's |
| CLI | none (no put) | `sounding accept|go-on|drop|reply` given directly; `request = none` | none |

Pending You is a black box here: I needed from it a card with a stable
id, options and a free-text reply, cancellation, and who answered when
[Q19].

### 5.4 Item's keeper (84, 85)

```
port Keeper
  settle(item, decision, conclusion, proposed_work?) -> recorded
guarantee: twice records once (85)
```

| profile | settle |
|---|---|
| millpond | accept: the conclusion as the item's record, an item per piece of proposed work; go on, drop: recorded against the item |
| crew | conclusion on the rail; planner makes a plan entry per piece |
| Flywheel | the elaboration's type writes the design book |
| none | nothing called; held state is the record (56, S12) |

### 5.5 Inbox (86, 87)

```
port Inbox
  land(offer) -> taken | already-held | refused(reason) | not-reached
guarantee: one capture per offer identity (87)
```

| profile | land |
|---|---|
| millpond | `sounding offer` prints the capture lines (C.6) and pipes them to `millpond land`; millpond's verdict per line |
| Flywheel | the same lines through Flywheel's capture intake |
| none | lines printed, offer kept `not-bound` (C.6 "not taken") |

The capture (C.6), fields verbatim: `key = sounding/<name>/<n>`,
`source = sounding`, `event_at = offered_at`, `title` = finding's first
line, `raw = offer-<n>.md` holding the finding whole, `excerpt` with
`text`, `kind = ask`, `asserted_by = sounding/<name>`, `assertion`,
`subjects`, `argues_with`, `position = offer <n>`. The capture contract
itself is a black box: what I needed is that a line carries those fields
and that the inbox dedups on `key` [Q20]. **The key omits the
repository that (32) makes part of the identity**: [Q21].

### 5.6 Store (88–91)

```
port Store
  read(sounding)  -> (held_state, version)
  list(repository) -> [name]
  write(sounding, version_read, held_state') -> ok | refused(moved)   # all or nothing
guarantee: outlives every place (60); same for every checkout (62)
```

Bound by C.7, §6.

## 6. Storage (C.7)

### 6.1 Layout at the tip of `sounding/<name>`

```
.sounding/
  sounding.rec        name, base, item, opened_at, opened_by, ended; one record per round
  question.md         the question, then the sources, then the operator's notes and replies, verbatim, in order
  conclusion.md       the newest round's conclusion while it awaits its decision; absent otherwise
  rounds/<n>.md       each ended round: how it ended, revision, timebox_ran_out, its conclusion or note whole,
                      and its decision once given
  offers/<n>.md       the finding whole, with its identity, time and landing
  asks/<n>.md         the ask, choices, time, and the reply once given
  requests.rec        the requests per surface with handles and withdrawals   # not in C.7 [Q22]
  responses.rec       every response, applied or not (58)                     # not in C.7 [Q22]
```

`conclusion.md` and `rounds/<n>.md` hold the conclusion byte-identical;
removing `conclusion.md` at the decision changes no conclusion (63).

### 6.2 Read, list, write

- `read`: `git rev-parse refs/heads/sounding/<name>` → version; the files
  under `.sounding/` at that commit (`git show <version>:.sounding/...`),
  never from the place's working tree (the session is free there, 12,
  23).
- `list`: `git for-each-ref refs/heads/sounding/`.
- `write`: build a tree = the version's tree with `.sounding/` replaced,
  `git commit-tree` with parent = version, then `git update-ref
  refs/heads/sounding/<name> <new> <version>`, which refuses if the ref
  moved (90, 61). Works with or without a place (C.7 "in the place while
  it exists and on the branch after"); plumbing in both cases avoids
  racing two writers on one index. Then, while the place exists, refresh
  its working tree's `.sounding/` to the new tip so the next `commit` of
  the place carries no stale copy.
- A write that finds the ref moved re-reads and re-applies (§4).

### 6.3 The place commits and `.sounding/`

The held state is inside the place the session is free in (12) and only
sounding may write it (61). So `commit(place)`:

1. Restores `.sounding/` in the working tree from the tip (any session
   edit there is discarded and reported in the exit's output; 23: nothing
   written by other means is a conclusion, note, offer or ask).
2. `git add -A && git commit`.

And every write verifies that each commit between the version it read
and the current tip that touches `.sounding/` carries sounding's own
trailer (`Sounding-Write: <sounding>/<seq>`); one that does not is
reported and the sounding refuses further writes until the operator
resolves it [Q23]. The session committing its own work on the branch
moves the version; that is allowed and handled by re-read.

### 6.4 Outliving the place; checkouts

The branch lives in the repository's object store, shared by every
worktree of the container (60, 62). "Every checkout" is read as every
worktree of one repository; a clone elsewhere sees the branch only when
it is pushed and fetched, which sounding never does [Q24].

## 7. Lifecycles

### 7.1 A sounding's states and transitions

```
                 open (round 1 started)
   (none) ------------------------------------> WORKING
      \                                        |  ^  ^   \
       \ open (session gave no evidence)       |  |  |    \ conclude ──┐
        \                                      |  |  |     \ ask ──────┤
         v                                     |  |  |      v          |
      PARKED <─── note / gone / time-to-conclude ran out / operator ended with-operator round
        |  ^                                   |  |  |
        |  | go on (start failed) / reply (session gone, start failed)
        |  |                                   |  |  |
        |  └──────────── WAITING ON THE OPERATOR ─┘  |
        |        (go on, start ok) ─────────────┘     |
        |        (reply, session lives: same round) ──┘
        |        (reply, session gone: next round) ───┘
        |                 |            |
        | resume          | accept     | drop (from any non-ended state)
        v                 v            v
      WORKING          ACCEPTED      DROPPED
```

| from | act | to | writes |
|---|---|---|---|
| none | open, round 1 evidenced | working | Sounding, Round 1 |
| none | open, no evidence | parked | Sounding |
| working | conclude | waiting | Round end, Conclusion, Requests |
| working | ask | waiting | Ask, Requests |
| working | note | parked | Round end, Note |
| working | time to conclude ran out | parked | Round end `ended`, ran_out |
| working | session gone (noticed) | parked | Round end `gone` |
| working | operator ends with-operator round | parked | Round end `ended` |
| working | drop | dropped | Round end, End, Telling |
| waiting (conclusion) | accept | accepted | Decision, End, Telling; place removed |
| waiting (conclusion) | go on | working | Decision, Telling, Round n+1 |
| waiting (conclusion) | go on, start failed | parked | Decision, Telling |
| waiting (conclusion) | drop | dropped | Decision, End, Telling; place removed |
| waiting (ask) | reply, session lives | working | Ask.reply |
| waiting (ask) | reply, session gone | working | Round end `gone`, Ask.reply, Round n+1 |
| waiting (ask) | drop | dropped | Round end, End |
| parked | resume | working | (Round end `gone` if due), Round n+1 |
| parked | drop | dropped | End, Telling |
| accepted, dropped | anything but read | refused | — |

Open asks and a conclusion never wait together: concluding or noting
closes the round's asks (Q12).

### 7.2 A round's lifecycle

```
started ──(session evidenced)──> running ──ask──> waiting on reply ──reply──> running
   │                                │                     │
   │ no evidence: not a round       │ timebox out ──tell──> told (time to conclude running)
   │                                │                     │ conclude/note → ended(conclusion|note), ran_out = true
   │                                │                     │ deadline → ended(ended), ran_out = true
   │                                ├── conclude → ended(conclusion)
   │                                ├── note     → ended(note)
   │                                ├── gone     → ended(gone)   (noticed later)
   │                                └── drop / operator's end → ended(ended)
```

### 7.3 A request's lifecycle

`put` → open → one of: `responded` (first applied response), `withdrawn`
(another request of the same target was responded, or the target closed:
round ended, sounding ended) → a response after withdrawal is kept
`applied = false` and reported to its surface (52, S7).

### 7.4 An offer's landing

`not-bound` (final) | `not-reached` → (tick) → `taken` | `already-held` |
`refused(reason)` (final). The offer itself never changes (63).

## 8. Timeboxes and the stop check, precisely

With `settings = {default 60 min, max 240 min, conclude 10 min}` [Q3]:

```
t0 = round.started_at
W(t) = Σ waits up to t                       (asks of the round: asked_at → reply.received_at or t)
clock(t) = (t - t0) - W(t)
T_out    = min t with clock(t) ≥ timebox     # exists only if the session is not waiting forever
tell at T_out (the one message delivered while working, 77); timebox_told_at = T_out
deadline = T_out + 10 min                    # wall time; no wait pauses it, since asks are refused after T_out (Q8)
at deadline without conclusion or note: end, commit, Round.ending = ended, ran_out = true, state parked
stop check: see §3.4; evaluated by the binding at each would-stop of an unattended session, both before and after T_out
with-operator: no T_out, no deadline, no stop check (46)
```

Who evaluates `T_out` and `deadline` at the right moment is Q1; the
model's default is a watcher process per open unattended round, started
by whatever started the round, that sleeps to the next deadline computed
from held state, re-reads at each wake (an ask moves `T_out`), and runs
`tick`. A watcher lost with its host leaves the session gone too (S11).

## 9. Concurrency

- **One sounding, many writers.** The session's exits (in the place), the
  operator's acts (from any checkout), and `tick` all write the same
  held state. Serialised by the store's compare-and-swap on the tip (90);
  a loser re-reads and re-applies, and idempotence (26, §3.5) makes the
  re-apply safe. Two offers at once get consecutive numbers (32).
- **Two responses to one request, or one target on two surfaces.** The
  first write to keep a `Decision` wins; the second finds it and is kept
  `applied = false` (52). The withdraw of the other requests follows the
  winning write and may race a response given on that surface in the
  gap: that response is the "later response" of (52) and S7.
- **Exit after the round ended.** An exit carries its round number;
  the core refuses one for a round with an end (25). A revived session
  from before a restart that concludes round 1 while round 2 runs is
  refused.
- **Soundings.** Independent branches and places; nothing shared but the
  repository's object store (8, 16). Two opens with the same name: the
  branch creation is the lock (71); the second is refused naming the
  first (4).
- **Place commit vs held-state write.** Commit first, then write naming
  the revision. A crash between leaves a work commit at the tip and no
  held-state change; the repeated exit commits nothing new and names the
  tip. §6.3 keeps session edits of `.sounding/` out of work commits.
- **The clock vs the session's conclude at the deadline.** Both write;
  whichever lands first ends the round; the other is refused or a no-op.
  A conclusion kept a second before `end` is a conclusion (ran_out true).
- **Reads.** Never block writers; a read is one `rev-parse` and `show`
  at that commit, consistent by construction (67).

## 10. The surfaces

| surface | reads | acts | through |
|---|---|---|---|
| CLI | `sounding list [--json]`, `sounding show <name> [--json]` | `open`, `conclude`, `offer`, `ask`, `note`, `accept`, `go-on`, `drop`, `resume`, `reply`, plus `handout`, `stop-check`, `guard`, `tick` for the bindings | the core (68) |
| Claude Code plugin | MCP `soundings` (= list), `conclusion` (= show's conclusion) | `/sound <question>` (= open from the person's session; the session goes on, 2, S1); MCP `accept`, `go_on`, `drop` for a person's agent, refused inside a round's session (24, Q16) | the CLI |
| herdr plugin | sidebar of not-ended soundings: round, state, what waits | keys: start (open), open (the workspace), accept, send back (go on, notes from plannotator), drop; resume [Q25] | the CLI |
| Pending You | the card | its options and reply | `tick`'s `read` |
| crew's rail, Flywheel's rail | theirs | theirs → the CLI | the CLI |

The one program-readable form (69, section 9): JSON of the held state
plus the derived state, identical on every surface; fields are only ever
added. Example in §11.

## 11. A fixed worked example

Settings: default timebox 60 min, longest 240 min, time to conclude
10 min. Repository `widgets`, default branch `main` at `9f3c1e2`. Keeper
and inbox: millpond. Surfaces: Pending You and the herdr sidebar.
Operator: "the operator". Date 2026-10-17, times UTC.

### 11.1 Open (S1)

09:00:00 A person in a Claude Code session in `widgets/main` runs
`/sound Should widgets take React 19?` with two sources and an item:

```
sounding open \
  --question "Should widgets take React 19?" \
  --source "signal react-19.0.0: 'React 19 removes string refs and drops jsdom < 23 in its test renderer'" \
  --source-pointer "briefs/react-19.md" \
  --item "millpond:item/react-19"
```

- name made: `should-widgets-take-react-19` (6 words) [Q5]; here the
  opener names `--name take-react-19` instead.
- `taken(widgets, take-react-19)` is false → `wt switch --create
  sounding/take-react-19 --base 9f3c1e2` → place `<place>`.
- held state v1 (`h0`) written at 09:00:03.
- round 1: unattended, timebox 60 min (default), starter opener;
  herdr workspace made, `claude` started; evidence at 09:00:10 →
  `Round{1, started_at 09:00:10, session "herdr:sounding/take-react-19/pane3/sess-7a1"}` (`h1`).
- `open` returns at 09:00:11; the person's session was never a session
  of the sounding (2). State: working.

`sounding.rec` after `h1`:

```
%rec: sounding
name: take-react-19
base: 9f3c1e2
item: millpond:item/react-19
opened_at: 2026-10-17T09:00:03Z
opened_by: person

%rec: round
n: 1
way: unattended
timebox: 3600
starter: opener
started_at: 2026-10-17T09:00:10Z
session: herdr:sounding/take-react-19/pane3/sess-7a1
```

`question.md`:

```
# Should widgets take React 19?

## Sources

1. signal react-19.0.0: 'React 19 removes string refs and drops jsdom < 23 in its test renderer'
2. -> briefs/react-19.md
```

### 11.2 An ask (S4)

09:12:00 the session runs `sounding ask --round 1 "Follow facebook/react main, or the vercel/react fork the design system uses?" --choice "facebook/react main" --choice "vercel/react"`.

- `Ask{1, round 1, asked_at 09:12:00}`; requests: Pending You card
  `py-c1`, sidebar row (`h2`). State: waiting on the operator. The
  command blocks; the binding's `state` = waits-on-reply.
- 10:12:00 the operator answers the card: "facebook/react main". `tick`
  reads it; `Ask.1.reply = Response{reply, "facebook/react main", by
  "the operator", surface pending-you, request 1, at 10:12:00, received
  10:12:04}` (`h3`); the sidebar's request withdrawn. The blocked `ask`
  returns. State: working.
- clock at 10:12:04 = 72 min − 60 min 4 s wait = 11 min 56 s. `T_out`
  is now at 11:00:04 wall, not 10:00:10 (38).

`asks/1.md`:

```
---
n: 1
round: 1
asked_at: 2026-10-17T09:12:00Z
choices: ["facebook/react main", "vercel/react"]
reply_by: the operator
reply_surface: pending-you
reply_at: 2026-10-17T10:12:00Z
reply_received_at: 2026-10-17T10:12:04Z
---
Follow facebook/react main, or the vercel/react fork the design system uses?

## Reply

facebook/react main
```

### 11.3 Two offers, one twice (S5)

- 10:30:00 `sounding offer --round 1 --assertion "The test runner's jsdom 22 pin blocks React 19's test renderer" --subject jsdom < finding.md` where `finding.md` is three paragraphs beginning "The test runner pins jsdom 22, which React 19's test renderer drops." → `Offer{1, offered_at 10:30:00}` written (`h4`), then `millpond land` on the capture `key sounding/take-react-19/1`, `event_at 10:30:00`, `title "The test runner pins jsdom 22, …"` → `taken` (`h5`). Returned in 1.3 s; the session never stopped (33).
- 10:35:00 a second finding "`widgets/legacy` still uses string refs in 14 files." → `Offer{2}` (`h6`), `taken` (`h7`).
- 10:36:10 the same text offered again → byte-identical to offer 2 →
  nothing written, nothing landed; returns offer 2 (26, §3.5). The inbox
  holds two captures (S5). Had the second landing reached the inbox,
  (87) would have answered `already-held` for the same key.

`offers/2.md`:

```
---
n: 2
round: 1
offered_at: 2026-10-17T10:35:00Z
assertion: widgets/legacy still uses string refs, which React 19 removes
subjects: [react, widgets/legacy]
landing: taken
landed_at: 2026-10-17T10:35:01Z
---
`widgets/legacy` still uses string refs in 14 files.

…
```

### 11.4 Sent back, then a conclusion (S2)

- 10:50:00 the session ends its turn with neither conclusion nor note.
  The Stop hook runs `sounding stop-check --round 1` → `send back: round
  1 of take-react-19 has no conclusion or note; run sounding conclude or
  sounding note`. The session keeps working.
- 10:55:30 `sounding conclude --round 1 --answer-file a.md --evidence-file e.md --changes-file c.md --work w1.md --work w2.md --open o.md`:
  1. `.sounding/` restored from tip; `git add -A && git commit` →
     `4d7e9a0` (the session's spike: a `react@19` lockfile and a failing
     test log).
  2. Held state (`h8`): `Round.1{ended_at 10:55:31, ending conclusion,
     revision 4d7e9a0, timebox_ran_out false}` (clock = 115 min − 60 min
     = 55 min < 60); `Conclusion{answer "Yes, after the string-ref
     codemod lands", evidence …, changes …, proposed_work [ {title "Bump
     react and react-dom to 19 in widgets", …}, {title "Run the
     string-ref codemod over widgets/legacy", …} ], open "whether the
     design system's vercel/react fork matters once we follow main",
     revision 4d7e9a0}`.
  3. Requests: card `py-c2` (five parts inline, link to `sounding show
     take-react-19`), sidebar row (`h9`). State: waiting on the operator.
- The next Stop → `may stop`.

`conclusion.md` (also in `rounds/1.md` after `h8`):

```
---
round: 1
revision: 4d7e9a0
concluded_at: 2026-10-17T10:55:31Z
timebox_ran_out: false
---
## Answer
Yes, after the string-ref codemod lands.

## Evidence
…

## What it would change
…

## Proposed work
### Bump react and react-dom to 19 in widgets
…
### Run the string-ref codemod over widgets/legacy
…

## Open
Whether the design system's vercel/react fork matters once we follow main.
```

### 11.5 Go on with notes (S6)

- 13:40:00 the operator, in the sidebar, opens the conclusion in
  plannotator, annotates "Try the codemod on widgets/legacy before
  answering; measure the test time too", presses send back with
  `--timebox 30m`. The plugin runs `sounding go-on take-react-19 --notes-file n.md --timebox 30m`.
- `Decision{round 1, Response{go-on, notes, by "the operator", surface
  herdr-sidebar, at 13:40:00}}` (`h10`); card `py-c2` cancelled, request
  withdrawn (`h11`); `millpond` settle(go on) → `Telling{1, told_at
  13:40:02}` (`h12`); `rounds/1.md` gains the decision; `conclusion.md`
  removed; `question.md` gains the notes under "## Notes (go on, round
  1, 13:40:00)".
- Round 2 started 13:40:20: unattended, timebox 1800 s, starter operator,
  session `sess-9b4` (`h13`). Handout: question, two sources, reply to
  ask 1, the notes verbatim, round 1 whole with its conclusion and the
  decision go on, round 2's timebox and way. The place still holds
  `4d7e9a0`'s spike (11, 50). State: working.

### 11.6 Timebox runs out mid-prototype (S3)

- 14:10:20 clock = 30 min (no asks) → `tell(sess-9b4, "round 2's timebox
  has run out; conclude with what you know")`; `timebox_told_at` (`h14`);
  deadline 14:20:20. An ask now would be refused (Q8).
- 14:14:05 the session concludes: commit `b81c2f5` (the codemod's partial
  output over 9 of 14 files); `Round.2{ending conclusion, revision
  b81c2f5, timebox_ran_out true}`; conclusion's answer "Yes; the codemod
  handles 9 of 14 files unaided, the other 5 need hand edits", open "the
  5 files; test time not measured"; proposed work: the bump; the codemod
  plus 5 hand edits; a docs note in `docs/upgrading.md` (`h15`).
  Requests: card `py-c3`, sidebar (`h16`). The operator's card shows
  `timebox ran out` and `revision b81c2f5` (S3).
- Had it not concluded by 14:20:20: `end(sess-9b4)`, commit, `Round.2{ending ended, timebox_ran_out true}`, parked.

### 11.7 Accept in the sidebar; a late card response (S7, S8)

- 15:02:00 the operator presses accept in the sidebar → `sounding accept take-react-19`.
  `Decision{round 2, accept}`, `ended = {accepted, 15:02:00}` (`h17`);
  `py-c3` cancelled (`h18`); `wt remove` (processes ended; branch kept);
  `millpond settle(item/react-19, accept, conclusion, 3 pieces)` → the
  keeper keeps the conclusion on the item and makes three items (S8 has
  two; this run has three); `Telling{2, told_at 15:02:03}` (`h19`).
  sounding made no work (56). State: accepted.
- 15:05:40 a response "go on" arrives from `py-c3` (the operator had the
  card open when it was cancelled). Kept `Response{go-on, …, request 3,
  applied false, not_applied_because "round 2 was accepted at 15:02:00
  through herdr-sidebar"}` (`h20`) and reported back to the card's
  thread (52, S7).
- Later, the bump is made by millpond's item on `bump/react-19` from
  `main`, lands through the gate; `sounding/take-react-19`'s commits
  `4d7e9a0`, `b81c2f5` and `h0..h20` are on no landed branch (13); the
  gate's own refusal of `sounding/*` is outside sounding (Q26).
- The branch stays until the operator runs `git branch -D sounding/take-react-19`;
  until then `sounding open --name take-react-19` in `widgets` is refused
  naming this sounding (3, 4, S13).

### 11.8 The JSON form (69) of `sounding show take-react-19 --json` after `h20`

```json
{
  "repository": "widgets",
  "name": "take-react-19",
  "state": "accepted",
  "base": "9f3c1e2",
  "item": "millpond:item/react-19",
  "opened_at": "2026-10-17T09:00:03Z",
  "opened_by": "person",
  "question": "Should widgets take React 19?",
  "sources": [
    {"text": "signal react-19.0.0: 'React 19 removes string refs and drops jsdom < 23 in its test renderer'"},
    {"pointer": "briefs/react-19.md"}
  ],
  "rounds": [
    {"n": 1, "way": "unattended", "timebox": 3600, "starter": "opener",
     "started_at": "2026-10-17T09:00:10Z", "ended_at": "2026-10-17T10:55:31Z",
     "ending": "conclusion", "revision": "4d7e9a0", "timebox_ran_out": false,
     "conclusion": {"answer": "Yes, after the string-ref codemod lands.", "evidence": "…", "changes": "…",
                    "proposed_work": [{"title": "Bump react and react-dom to 19 in widgets", "text": "…"},
                                      {"title": "Run the string-ref codemod over widgets/legacy", "text": "…"}],
                    "open": "Whether the design system's vercel/react fork matters once we follow main.",
                    "concluded_at": "2026-10-17T10:55:31Z"},
     "decision": {"kind": "go-on", "text": "Try the codemod on widgets/legacy before answering; measure the test time too",
                  "by": "the operator", "surface": "herdr-sidebar", "at": "2026-10-17T13:40:00Z", "request": 2}},
    {"n": 2, "way": "unattended", "timebox": 1800, "starter": "operator",
     "started_at": "2026-10-17T13:40:20Z", "timebox_told_at": "2026-10-17T14:10:20Z",
     "ended_at": "2026-10-17T14:14:05Z", "ending": "conclusion", "revision": "b81c2f5", "timebox_ran_out": true,
     "conclusion": {"answer": "Yes; the codemod handles 9 of 14 files cleanly, the other 5 need hand edits.", "…": "…"},
     "decision": {"kind": "accept", "text": "", "by": "the operator", "surface": "herdr-sidebar", "at": "2026-10-17T15:02:00Z"}}
  ],
  "asks": [{"n": 1, "round": 1, "text": "Follow facebook/react main, or the vercel/react fork the design system uses?",
            "choices": ["facebook/react main", "vercel/react"], "asked_at": "2026-10-17T09:12:00Z",
            "reply": {"text": "facebook/react main", "by": "the operator", "surface": "pending-you",
                      "at": "2026-10-17T10:12:00Z", "received_at": "2026-10-17T10:12:04Z"}}],
  "offers": [{"n": 1, "round": 1, "offered_at": "2026-10-17T10:30:00Z", "title": "The test runner pins jsdom 22, which React 19's test renderer drops.",
              "landing": {"outcome": "taken", "tried_at": "2026-10-17T10:30:01Z", "tries": 1}},
             {"n": 2, "round": 1, "offered_at": "2026-10-17T10:35:00Z", "title": "`widgets/legacy` still uses string refs in 14 files.",
              "landing": {"outcome": "taken", "tried_at": "2026-10-17T10:35:01Z", "tries": 1}}],
  "requests": [
    {"id": 1, "target": "ask:1", "surface": "pending-you", "handle": "py-c1", "put_at": "2026-10-17T09:12:01Z", "responded_at": "2026-10-17T10:12:04Z"},
    {"id": 2, "target": "conclusion:1", "surface": "pending-you", "handle": "py-c2", "put_at": "2026-10-17T10:55:32Z", "withdrawn_at": "2026-10-17T13:40:01Z"},
    {"id": 3, "target": "conclusion:2", "surface": "pending-you", "handle": "py-c3", "put_at": "2026-10-17T14:14:06Z", "withdrawn_at": "2026-10-17T15:02:01Z"}
  ],
  "responses_not_applied": [
    {"kind": "go-on", "request": 3, "surface": "pending-you", "at": "2026-10-17T15:05:40Z",
     "because": "round 2 was accepted at 2026-10-17T15:02:00Z through herdr-sidebar"}
  ],
  "tellings": [{"decision": 1, "told_at": "2026-10-17T13:40:02Z"}, {"decision": 2, "told_at": "2026-10-17T15:02:03Z"}],
  "ended": {"kind": "accepted", "at": "2026-10-17T15:02:00Z"},
  "version": "h20"
}
```

### 11.9 Side runs on the same example

- **A note.** At 10:50 the session instead runs `sounding note --round 1
  --did "Installed react@19; tests fail on jsdom" --next "Bump jsdom to
  23 and rerun"`: commit, `Round.1{ending note}`; no request; state
  parked; the sidebar's resume key starts round 2 handed the note (40,
  50).
- **Host restart in round 2 (S11).** At 13:55 the host restarts; the
  pane is gone. `sounding list` at 14:00: round 2 has no end, `state
  (sess-9b4) = gone` → parked (S11). The operator's `sounding resume
  take-react-19 --timebox 30m` commits the place (what the session left,
  uncommitted, becomes `c0ffee1`), writes `Round.2{ending gone, revision
  c0ffee1}`, starts round 3 in the same place. Round 3 is handed round
  2 "ended with its session gone" and no conclusion or note from it
  (22).
- **A submission from the place (S10).** The session runs `wt submit
  sounding/take-react-19`: the PreToolUse hook's `sounding guard`
  refuses it with "a sounding's branch is never submitted (13)". `git
  push origin sounding/take-react-19` is refused the same way.
- **Drop while working (S9).** At 14:00 `sounding drop take-react-19
  --reason "React 19 is off the table this quarter"`: `end(sess-9b4)`,
  commit, `Round.2{ending ended}`, `ended = dropped`, card `py-c3`
  not yet put so nothing withdrawn, `wt remove`, `millpond settle(drop,
  reason)`. Offers 1 and 2 stay in millpond (35). `sounding show` still
  reads everything from the branch.
- **No inbox, no item (S12).** The same offers get `landing not-bound`,
  their capture lines printed to the session's output; the accepted
  conclusion is read from `rounds/2.md` and nothing is settled.

## 12. The statement's section-10 questions

| question | the model's answer |
|---|---|
| default and longest timebox; which time counts | 60 min, 240 min [Q3]; wall time since start less waits on replies (§3.3), since (111) and (38) define the timebox so; "the session's working time alone" would need the binding to meter the agent, which (76) does not give |
| time to conclude; stop check during it | 10 min [Q3]; yes, sent back (§3.4) [Q9] |
| settings the operator's alone, or a repository's within them | the operator's alone, C.8's one file; a repository default is a plausible addition [Q27]; carried forward |
| does the offer's identity carry its repository into the inbox's key | the statement conflicts with itself (32 vs C.6); the model keys `sounding/<repository>/<name>/<n>` [Q21], blocking |
| is the branch pushed; does held state travel | sounding never pushes (16 lets it, nothing asks it); the operator may; held state travels with the branch since it is on it [Q24] |
| with an inbox bound, does an item-less sounding get an item | no: an item is named at open or never (9); the conclusion stays with the operator (56); carried forward as policy for the keeper |
| where else an accepted conclusion lives | only in the held state and with the keeper (55, 56); a repository's own record is a non-goal (section 8 fourth bullet's spirit); carried forward |
| is a note an act or taken from the place | an act, `sounding note` (§4.6): (39)'s stop check must know a note was left before the stop, and (23)/(61) forbid reading one out of the place [Q15] |
| may the operator park a working sounding | the statement gives no such act and (43) forbids interrupting for anything but the timebox; the model has none; drop is the only word on a working sounding [Q17]; carried forward |
| is a revived session the same session | the same iff the binding's `state(handle)` finds it (herdr resuming `claude --resume` under the same workspace); otherwise gone and the round ends `gone` [Q28] |
| a with-operator round's conclusion: decided in the conversation or on the surfaces | on the same surfaces (52, 66: the shape of its conclusion and where requests go never depend on the round); the operator in the pane accepts through the sidebar or CLI, never by a word the session reads (24) [Q29] |
| a standing sounding | none: one question, rounds start only on (18)'s four events; a planner that wants one opens a new sounding per arrival with the earlier accepted conclusion as a source (6) |
| may an offer carry material beyond its text | no in this model: `raw` is the finding whole (C.6) and identity is content (Q10); material elsewhere goes in the finding as a pointer, as sources do (7) [Q30] |

## 13. The scenarios against the model

| scenario | verdict | why |
|---|---|---|
| S1 | holds | §4.1: open returns after evidence of round 1; the opener's session is another (2); the pane is herdr's |
| S2 | holds | §3.4 sends back; §4.3 puts the conclusion on every surface |
| S3 | holds-if | a clock runs to deliver the tell at `T_out` (Q1); then §3.3, §4.3: committed, revision named, `timebox_ran_out = true` shown on the card |
| S4 | holds | §4.5 blocks; state waiting (§3.1); §3.3 excludes the wait |
| S5 | holds-if | the repeat is byte-identical (Q10); then §3.5 and (87) give two captures; §4.4 returns at once |
| S6 | holds | §4.9: same place (11), notes verbatim in the handout (54, 7), round 1's conclusion with its decision (19) |
| S7 | holds-if | the surface can still deliver a response after `withdraw` (Pending You's cancel raced the answer, Q19); then §7.3 keeps it `applied = false` and reports it |
| S8 | holds-if | millpond's settle makes the items (84, C.5) and the gate refuses `sounding/*` history (Q26); sounding's part, §4.8, makes none |
| S9 | holds | §4.10 |
| S10 | holds-if | the guard sees the command (a shell tool call) (79, C.3); a push by other means is the gate's to refuse (Q26) |
| S11 | holds-if | the liveness check is local and the reader is on the session's host (Q2); then §3.1 parked, §4.11 resume |
| S12 | holds | §4.4 `not-bound`, §4.8 with no item |
| S13 | holds | §9 soundings; §4.1 refusal names the holder of the branch |
| S14 | holds-if | all three read one held state at one version (§6.2) on one host; across hosts the liveness part of the state is unverified (Q2) |

## Questions

Each is a decision the statement leaves to the builder. **blocking**: a
builder cannot write the piece without the answer; **can default**: the
model takes the stated default and a later answer changes one place.

1. **Who runs the clock and the retries.** (43, 44, 34, 57, 81; section 9 names a binary and hooks, no process.) Nothing in A or B says what notices `T_out`, ends a session at the deadline, hands an offer again, tells the keeper again, or reads a Pending You card nobody is waiting on. Guessed wrong: S3 never happens, offers stay `not-reached` for ever, a card's accept is never applied. Options: a watcher process per open round started with the round; a tick run by the herdr plugin's refresh; a sounding daemon; the session's hooks (pre-tool-call) doing the clock, which cannot interrupt a long command. **blocking**; default: a watcher per open unattended round or waiting request, plus `tick` from the herdr plugin's refresh.
2. **How state learns whether the session lives without reaching it, on every checkout.** (48, 70, 62, 67, 21; S11, S14.) State needs the session's liveness; reading reaches no session; every checkout reads the same state. Guessed wrong: `list` on another host shows `working` for a dead round, or `parked` for a live one, and (67) breaks; or a gone round is never closed. Options: a local liveness check through the kept handle (not "reaching"); a heartbeat written to held state (writes on a non-event, against 61); liveness only on the session's host, `unverified` elsewhere. **blocking**; default: local check through the handle, `unverified` on other hosts, the round's `gone` written by the next write to the sounding.
3. **The settings' values.** (42, 44, C.8, section 10.) Options: any. **can default**: 60 min, 240 min, 10 min.
4. **Where bindings are declared.** (92, C.8.) Which profile binds each seam, per host or per repository, and whether the item names its keeper. Guessed wrong: a sounding in a repository with no millpond calls millpond and every offer is `not-reached`. **blocking**; default: `[bindings]` in the operator's `config.toml` with a per-repository override file in the repository, and `--item <keeper>:<ref>` naming the keeper.
5. **How a name is made from a question.** (3, C.1 "as sounding makes it".) Guessed wrong: names that collide, or that are ids. **can default**: lower-cased words, first six, hyphenated; refuse if empty or numeric.
6. **A timebox over the longest: refuse or clamp.** (42.) **can default**: refuse naming the longest, by (4)'s spirit that sounding never alters what it is given.
7. **Evidence of a session and what a failed start leaves.** (75, 2, 49.) How long to wait for evidence; whether a sounding with no round is a state (49 describes parked by its last round). For the printed-command profile, evidence comes only when the operator runs the command, which may be never. **can default**: 30 s bound; no round written without evidence; such a sounding is parked and `resume` starts round 1; the printed command's evidence is the session's first hook call.
8. **An ask after the timebox ran out.** (36, 38, 41, 43, 44.) If allowed, waiting pauses the time to conclude and a round may outlive its timebox by days; if refused, the session cannot get a fact it needs. **can default**: refused; the conclusion names it under what stays open.
9. **The stop check during the time to conclude.** (39, 44.) **can default**: still sends back; the deadline ends the session anyway.
10. **How a repeat exit is recognised.** (26, 32, S5.) By content or by a token the session gives. Content misses a deliberate second offer of the same words and catches a retry; a token the session forgets catches nothing. **can default**: content, with an optional `--key` the session may give to override.
11. **The default branch's tip, and from where.** (C.1, 10.) Local `main` or `origin/HEAD`; a repository whose default branch is behind its remote gives a stale base. **can default**: `origin/HEAD` if present, else the local default branch.
12. **An ask still open when its round ends on a conclusion or note.** (29, 37, 49, 52.) (37) keeps an ask alive past its session; (49)/(117) make "working with a request waiting" impossible. If the ask stays open, a reply after accept is refused (59) and the operator's answer is lost; if the conclusion stays, a reply would start a round beside an undecided conclusion. **blocking**; default: concluding or noting closes the round's open asks as unanswered and withdraws their requests; a session gone leaves them open (37).
13. **Which earlier conclusions are handed, and how.** (6, 19.) (6) speaks of "an earlier conclusion on the question" from another sounding; (19) hands this sounding's own rounds. Does sounding find accepted conclusions of the repository's other soundings itself (that is judging which bear, against 5 and 64) or only those the opener names as sources? **can default**: only as sources, and (6) then forbids a source that is an unaccepted conclusion: open refuses it.
14. **How long `offer` may wait on the inbox.** (33 vs C.6's pipe.) **can default**: one try bounded at 5 s, then `not-reached` and the retries.
15. **The note as an act.** (23, 39, 40; section 9's command list lacks `note`.) Without an act the stop check cannot tell a note from nothing, and reading one from the place breaks (23) and (61). **can default**: `sounding note --did --next`; the plugin's handout tells the session so.
16. **The MCP decision tools inside a round's session.** (24, 25, section 9 gives every session `accept`, `go_on`, `drop`.) A round's session could accept its own conclusion. Options: the guard refuses them when `SOUNDING_ROUND` is set; the tools are absent from a round's session; they are allowed on other soundings only (25 forbids an *exit* naming another sounding, a decision is not an exit, but 24 forbids deciding "another's"). **blocking**; default: refused in a round's session for every sounding.
17. **Drop on a working sounding.** (53 vs 43.) (53) ends a sounding in any non-ended state; (43) says sounding interrupts a working session for the timebox and nothing else. Options: drop ends the session at once; drop waits for the round to end; drop ends it but "end" is not "interrupt". **can default**: ends it; the round is `ended`, its work committed.
18. **Ending processes in the place.** (73.) Beyond the session, what else runs there (a dev server the session started) and how the place profile finds it. **can default**: the session binding's `end` first; then whatever the profile's remove does; a remove that fails on a busy place is reported and retried by `tick`.
19. **What Pending You must provide.** (C.4, 80–83.) Needed from the black box: a card with a stable id, options and a free-text reply, cancellation, the answerer's name and time, and whether a cancelled card can still return an answer (S7). **can default**: assume all of it; S7's late response is the race between cancel and answer.
20. **The capture contract.** (section 9, C.6.) Needed from the black box: one line per capture with the fields of C.6, dedup on `key`, a per-line verdict of taken / already held / refused with reason, and a way to pass `raw`. **can default**: assume so.
21. **The offer key and the repository.** (32 vs C.6.) (32) makes the repository part of the identity and (87) wants one capture per identity; C.6's key `sounding/<name>/<n>` collides across repositories in one inbox. Options: key carries the repository; names are unique per inbox (against 3, per repository); the inbox keys on `asserted_by` plus key. **blocking**; default: `sounding/<repository>/<name>/<n>` with `asserted_by sounding/<repository>/<name>`.
22. **Files C.7 does not list.** (C.7, 80–83, 58.) Requests with surface handles are needed to withdraw; responses not applied must be kept (58). **can default**: `requests.rec`, `responses.rec` under `.sounding/`.
23. **The session touching `.sounding/`.** (12, 23, 61, C.7.) The place is free, the held state is in it. Options: the commit of the place discards session edits there; a trailer proves sounding's writes and a foreign commit freezes the sounding; a guard refuses writes under `.sounding/` (not enforceable for a free session). **blocking**; default: discard at commit, trailer check at write, freeze and report on a foreign commit.
24. **Pushing the branch.** (14, 16, 62, section 10.) **can default**: sounding never pushes; a reader elsewhere sees the sounding after the operator pushes and fetches.
25. **Resume in the herdr plugin.** (C.4 lists start, open, accept, send back, drop; 50 needs the operator's word to resume.) **can default**: a resume key, or `sounding resume` on the CLI.
26. **(13) beyond sounding's reach.** (13, 79; S8, S10.) sounding refuses submissions from the place; a cherry-pick of a `sounding/*` commit onto a work branch elsewhere is the gate's to refuse, and the statement makes it sounding's invariant (I2). **can default**: the gate's policy refuses history containing `sounding/*` commits; sounding records which commits are its in the branch's own trailers so a gate can tell.
27. **Per-repository settings.** (42, C.8.) **can default**: none; the operator's file alone.
28. **A session a host brings back.** (21, 49, 75, 76.) Same session if the handle resolves; the timebox's wall clock ran meanwhile. **can default**: same if the handle resolves; the clock is not paused for the outage.
29. **Deciding a with-operator round's conclusion.** (46, 52, 24.) **can default**: on the same surfaces; nothing the session hears is a decision.
30. **Offer material beyond text.** (31, C.6 `raw`.) **can default**: no; a pointer in the finding.
31. **Who is "who gave it" on each surface.** (58.) The CLI has no sign-in; the sidebar knows the local user; Pending You names its answerer. **can default**: the surface's name for the user, `local user` on the CLI.
32. **Several conclusions undecided at once.** (51, 17.) Cannot arise (a conclusion ends its round and the next starts only on go on), so accept needs no round argument; confirm. **can default**: accept, go on and drop take the sounding alone.

Counts: 32 questions, 7 blocking (1, 2, 4, 12, 16, 21, 23), 25 can default.
