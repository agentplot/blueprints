# eddy: a model from the statement

Built from `requirements.md` alone. Clauses are cited by bare number in parentheses; section-10 questions as (q1)…(q12); scenarios as S1…S16. Where the statement names a thing it does not define (RFC 3339, RFC 3986, MCP, TOML, JSON, XDG, Flywheel's capture crate, Wispr Flow, Webex, Graph), it is a black box here, and what the model needed of it is a question at the end.

## The form

**Ports and adapters, with a data model inside the core, one line protocol on the capture seam, and two state machines.**

- Ports and adapters is what Part B is: five seams, each an operation set with a guarantee (46–64), each bound by naming one or more profiles (65), with the rule that a part "runs unchanged under every capture host" and is "never told which one started it" (56, 27), and that "every surface answers from one core" (39). The seams are the structure; the profiles of Part C are the adapters.
- A data model is needed inside the core because the statement fixes values exactly: identity and its encoding (3, 4, C.2), details and their absence (6, C.4 `meeting.json`), the capture's fields (22, C.1), the plain copy's line (14, C.4 `turns.txt`), the cursor's property (25).
- A protocol is what C.1 fixes on the capture seam: one JSON object per line, exactly one of `capture`, `cursor`, `done`, exit status, standard error (C.1).
- State machines are needed for a run (20–28, 54, 55: complete, incomplete, cursor kept or not) and for a meeting as one run sees it (skipped, not ready, handed, failed: 17–25), even though eddy stores neither (29).

Considered and rejected:

- **Event log.** Ruled out as a model of eddy by (29): eddy keeps nothing between answers but sign-ins and cursors, and (I4) it keeps no list of what it handed. The only log is the capture host's, outside eddy (55).
- **Deployment.** Ruled out by (27) and (56): a run never depends on which machine or host started it, and section 9's "one static binary" is a given, not a seam. Nothing in the statement fixes where parts run (non-goal: "Deciding when a part runs, on which machine").
- **Pure data model.** Ruled out by (20–28): the cursor, the hand, completeness and failure are behaviours over time, not records.
- **Pure state machine.** Ruled out by (65, 66): the seams and the conformance of profiles to them are the primary structure; the machines are small and sit inside one port's lifecycle.

## 1. Shape

```
                 askers (38, 49)                                 operator (46 row, 32)
   person   agent session   herdr pane   fleet doctor              │ eddy sign-in <part>
     │           │              │             │                     │ settings (eddy.toml / CAPTURE_CONFIG)
     ▼           ▼              ▼             ▼                     ▼
 ┌─────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────┐   ┌────────────────────┐
 │  CLI    │ │ Claude    │ │  herdr    │ │ Flywheel      │   │ capture host       │
 │ surface │ │ Code plug │ │  plugin   │ │ plugin:       │◄──┤ (millpond / tick)  │ start · hand · mark · end (51–54)
 └────┬────┘ └─────┬─────┘ └─────┬─────┘ │ adapter parts │   │ keeps captures,    │
      │            │             │       └──────┬────────┘   │ cursor, raw bank   │
      └────────────┴──────┬──────┴──────────────┘            └────────▲───────────┘
                          ▼  (39: one core, 40: one answer form)      │ stdout lines (C.1)
                 ┌────────────────────────────────────────────┐       │
                 │                  CORE                      │───────┘
                 │  list · day · transcript · turns · status  │
                 │  run: list → skip → fetch → lay out →      │
                 │       place → hand → cursor → done         │
                 │  identity = meeting/<part>/<enc(id)>       │
                 └──┬──────────────┬───────────────┬──────────┘
                    │ B.1          │ B.3           │ B.3
          ┌─────────▼─────────┐ ┌──▼─────────┐ ┌───▼──────────────┐
          │ parts (43–45)     │ │ sign-in    │ │ raw place        │   cursor store (57–59):
          │ wispr webex teams │ │ store (60– │ │ place-raw (63,64)│   the host's, read as --cursor,
          │ generic           │ │ 62) per    │ │ <dir>/<enc>/…    │   kept from the last cursor
          └─────────┬─────────┘ │ machine    │ └──────────────────┘   line of a done run
                    ▼           └────────────┘
          meeting services (46–50), over the network, with the operator's sign-in
```

The invariant at the centre, for one part `p` with settings `(account, shortest, earliest)` and a service answer `S` (the set of meetings the service says it recorded for `account`, each with its id, details and readiness):

```
listing(p, W)     = { m ∈ S : start(m) ∈ W ∧ ¬short(m) }                 (10, 17)
short(m)          = length(m) is given ∧ length(m) < shortest             (17, 18)
identity(p, m)    = "meeting/" ‖ name(p) ‖ "/" ‖ enc(id(m))               (3, C.2)
handed(run)       = { m ∈ listing(p, since cursor) : ready(m) ∧ fetched ∧ placed }  (20, 21)
failed(run)       = { m ∈ listing : ready(m) ∧ ¬(fetched ∧ placed) } ∪ { m : start(m) not given }  (23)
complete(run)     ⇔ listing was complete ∧ every m ∈ listing is handed, skipped, unready or failed   (24)
cursor'(run)      must satisfy: ∀ m with no run having handed m, m ∉ skipped ⇒ m ∈ listing(p, since cursor')   (25)
```

Everything a surface or a run answers is a function of `S`, the settings, the cursor and the clock, and nothing else (27, 38).

## 2. Values and records

All fields marked `?` may be absent, and absence is reported as "not given", never filled (6).

**PartName** — a string: `wispr`, `webex`, `teams`, or the operator's name for a generic part's service (45, C.2). Constraint needed for the key to be well formed (C.1): holds no `/`, is not empty, not `.`, not `..`. (Question 5.)

**Account** — a string identifying the operator's standing at one service (64 row of glossary); one per part instance (settings, 95). Never appears in an identity (3, 4, 50).

**MeetingId** — the id the service gives, taken as bytes, any characters (4, S13). Which field of the service's answer is the id is per profile (C.3).

**EncodedId** — `enc(MeetingId)`, section 3.

**Identity** (the key) — `meeting/<PartName>/<EncodedId>` (C.2). Exactly three segments separated by `/`; never starts with `/`, never holds a `..` segment, never starts with `captures` or `moves` (C.1, satisfied by construction since it starts with `meeting/`).

**Instant** — a point in time with its UTC offset, written RFC 3339 (C.1 `event_at`). The model treats RFC 3339 as a black box that writes an instant with an offset.

**Details** (71–72, 6, C.4):

| field | type | source |
|---|---|---|
| `id` | MeetingId | the service (68) |
| `title?` | string | the service |
| `start?` | Instant | when it began, not when planned, where both are recorded (7, 73) |
| `length?` | number of seconds | as the service records it (74); no rounding by eddy (6) |
| `attendees?` | list, each as the service names it | (q11, question 14) |
| `url?` | string | the meeting's address on its service |

**Readiness** — `ready | not-ready` as the service says in a listing (46), and from a fetch: `transcript | not-ready | gone | unreachable` (47).

**Transcript** — bytes as served, plus its `form` (an extension-like label such as `json`, `vtt`, `txt`) (13, 47, C.4).

**Turn** — `offset?` (seconds from the meeting's start, where the transcript gives a time), `speaker?` (as the transcript names it, absent where it names none), `words` (the transcript's) (78, 14, 15).

**PlainCopy** — a sequence of Turns in spoken order; its text form is C.4's `turns.txt` (section 3.5).

**RawMaterial** — the three files of C.4 under one folder named `EncodedId`: `transcript.<form>`, `turns.txt`, `meeting.json` (8, 63).

**Listing** (84–87, 10, 11):

```
Listing {
  part: PartName, account: Account,
  asked: Window { from: Instant, to: Instant } | Since { cursor: Cursor },
  complete: bool, reason?: string,          // reason present iff !complete (11)
  meetings: [ ListedMeeting { key: Identity, details: Details, ready: bool } ]
}
```

**Capture** (22, C.1): `key`, `source = "meeting"`, `event_at = details.start`, `title?`, `url?`, `raw = [ "<enc>/transcript.<form>", "<enc>/turns.txt", "<enc>/meeting.json" ]`, and never `excerpt`.

**Cursor** — an opaque string to everyone but its part (119, 53). The model's encoding is in section 3.4.

**SignIn** — opaque bytes the service gave (49); never leaves its store (33). The model knows of it only: in force or not, when it ends where the service says, and a way to renew where the service gives one (48, 49).

**Settings** of a part (93–95, C.3): `account`, `shortest_length` (seconds), `earliest_start` (Instant), and for the generic part `service { name, endpoint, list_tool, transcript_tool, fields { id, title, start, length, attendees, url, ready, transcript } }` (C.3 generic row).

**RunReport** (54, C.1 `done`): `listed: n`, `failed: [ { what: Identity, why: string } ]`.

**Diagnostic** — text on standard error or in a log; holds no word of a meeting and no sign-in (33, 37).

## 3. Derivations and decisions the statement fixes

### 3.1 Identity and its encoding (C.2)

```
enc(id):
  if id == "."  → "%2E"
  if id == ".." → "%2E%2E"
  else for each byte b of id:
     if b ∈ unreserved (ALPHA / DIGIT / "-" / "." / "_" / "~")  → the byte itself
     else → "%" + two uppercase hex digits of b
identity(part, id) = "meeting/" + part + "/" + enc(id)
```

Properties the model relies on: `enc` is injective (every `%` is itself encoded, so no two ids collide: 4); the result holds no `/` (so one segment: S13) and is not `.` or `..` (so a safe folder name: C.2). Uppercase hex is the model's choice so one id gives one key byte for byte (3); see question 6. The identity never carries the account (50), so two accounts at one service listing one meeting give one key (3).

Parsing an identity given by an asker: split on `/` into exactly three segments; the first is `meeting`; the second names a configured part; the third decodes by reversing `enc`. Anything else is refused as "not an identity".

### 3.2 The skip (17–19)

```
short(m) = m.length is given ∧ m.length < settings.shortest_length
```

Strictly less; a meeting exactly as long as the shortest length is kept. A meeting with no length is never short (18). The skip is applied to the service's answer before anything else: a short meeting is not in the listing, is not fetched, is not handed, is never in `failed` (19), and leaves no record (17). It is counted in `listed` (C.1; see the conflict in section 10, q3 and question 4).

### 3.3 The window and the day (82, 83, 12, 26)

A window is `[from, to)` over the meetings' `start` instants; `start` is compared as an instant, whatever offset the service wrote. A run's window is `[lower, ∞)`: no upper bound, since a meeting in progress has a start in the window, is not ready, and is listed as not ready (10).

```
lower(run) = cursor.given ? cursor.since : settings.earliest_start        (26)
```

The lower bound is inclusive (26: "at or after").

The day of an asker is the calendar day in the asker's own time zone (83): `from = 00:00:00` of that date in that zone, `to = 00:00:00` of the next date in that zone, both as instants. `day(asker)` is the union of `listing(p, [from, to))` over every part eddy reads, each listing's completeness named beside it (12). The zone and date reach the core as arguments; each surface resolves them (question 12).

### 3.4 The cursor (25, 26, 46, 53)

What the statement fixes is the property (25): a complete run's cursor never excludes a meeting no run has handed, other than a skipped one. The value is the part's own (119). The model's derivation:

```
cursor'(run):
  U = { m ∈ listing(run) : m unready ∨ m failed }           // not handed this run
  if service gave a mark with this listing:
       since  = (U empty) ? mark : the mark the service gave for the position of min start(U)   // where the service's marks are positional
  else:
       since  = (U nonempty) ? min start(m ∈ U)
              : (listing nonempty) ? max start(m ∈ listing)
              : lower(run)                                   // nothing listed: cursor unchanged
  return "1:" + kind + ":" + since        // kind ∈ { "start", "mark" }; "1" the encoding's version
```

Why this and its cost: with the lower bound inclusive, the newest handed meeting is listed and fetched again by every later run until a newer meeting appears, and the host passes it over (55). That is one transcript fetch per run and no lost meeting. The cursor never advances past a failed or unready meeting, so a meeting that is never ready pins the cursor and everything after it is refetched every run (q2; question 9). A meeting the service lists late, with a start before the cursor, is lost unless the service's mark covers it: this is the gap question 1 names, and it is **blocking**.

The cursor is versioned so a part can refuse one it cannot read: a cursor whose version or kind the part does not know is treated as none (30), which lists from the earliest start and loses nothing.

A run given a cursor from before its part's earliest start lists from the cursor: 26 fixes the earliest start only for a run given no cursor.

### 3.5 Readiness and the fetch (10, 20, 47)

```
for m in listing:
  if !m.ready            → unready (listed as not ready; relisted by 25)
  else fetch(m):
    transcript(t, form)  → lay out, place, hand
    not-ready            → unready (the listing was stale; not a failure: 47)
    gone                 → failed(what = key, why = "fetch-transcript: the service no longer holds it")
    unreachable          → failed(what = key, why = "fetch-transcript: unreachable: <reason>")
```

A meeting whose `start` is not given is `failed(why = "start not given")` before any fetch (23), since its capture cannot carry an event time (22) and eddy may not supply one (6, 7).

### 3.6 The plain copy (14, 15, 78, C.4)

```
turns(transcript):
  segments = the transcript's pieces in the order it gives them, each with (time?, speaker?, words)
  fold consecutive segments whose speaker is given and equal into one turn:
     offset  = the first segment's time
     words   = the segments' words joined by one space
  a segment with no speaker is a turn of its own (15: never given a name)
  spoken order is the transcript's order; eddy never reorders by time (14)

line(turn) = offset_text(turn) + TAB + (turn.speaker ?? "") + TAB + words_text(turn) + LF
offset_text = "" if no time, else HH:MM:SS of (time − meeting.start) when the transcript's times are absolute,
              or of the time itself when they are already relative to the start; hours may exceed 99 (HHH:MM:SS)
words_text  = the words with every TAB and line break replaced by one space; nothing else changes (14, C.4)
```

The file is `turns.txt`, UTF-8, one line per turn, a final LF. The fold is the model's reading of "turn: what one speaker says before another starts" (78); question 15.

### 3.7 `meeting.json` (8, C.4)

```json
{ "id": "<MeetingId as the service gave it>",
  "title": "<string>" | null,
  "start": "<RFC 3339 with offset>" | null,
  "length": <seconds, as precise as the service gave> | null,
  "attendees": [ … as the service names them … ] | null,
  "url": "<string>" | null }
```

`null` where the service gives none (6). `id` is the raw id, not the encoded one: the encoding is the key's, and the capture carries the key.

### 3.8 The capture line (22, C.1)

```json
{"capture":{"key":"meeting/<part>/<enc>","source":"meeting","event_at":"<start>",
            "title":"<title>","url":"<url>",
            "raw":["<enc>/transcript.<form>","<enc>/turns.txt","<enc>/meeting.json"]}}
```

`title` and `url` are omitted, not `null`, where the service gives none (22: "where the service gives them, and nothing more"); `excerpt` is never present. The three `raw` paths are relative to `<dir>` and are the paths place-raw returned (63).

### 3.9 Completeness of a run (24, 54)

```
complete(run) ⇔ sign-in in force ∧ listing.complete ∧ every m ∈ listing settled as handed | skipped | unready | failed
```

A complete run prints its cursor line, then `{"done":{"listed":n,"failed":[…]}}`, and exits 0. Anything else: no `done`, exit status other than 0, the reason on standard error.

`listed` = the number of meetings the service's answer held for the window, skipped and unready among them (C.1). It is the size of `S ∩ window`, not of the listing of (10); see question 4.

### 3.10 The sign-in state (34, 48)

`state(part, account) ∈ { in-force(ends?), lapsed, refused, none }`, read from the store and, where the service says, from the service's own answer to sign-in-state, which reaches no meeting (34). `none` is the model's addition for a store that holds nothing.

## 4. Operations

All operations are the core's; every surface calls them (39). Each has one program-readable form that only gains fields (40).

| operation | input | precondition | effect | answer | refusals |
|---|---|---|---|---|---|
| **list** | part, window | the part is configured; its sign-in is in force | none at the service (36); nothing kept (29, 41) | `Listing` | unknown part; sign-in not in force (named, with the state); the window malformed |
| **day** | zone, date (default: the asker's today) | at least one part configured | none | `{ day: {date, zone, from, to}, accounts: [{part, account, complete, reason?}], meetings: [ListedMeeting…] }` sorted by start then key (12) | no part configured; zone unknown |
| **transcript** | identity, optional range | identity parses; its part is configured; sign-in in force | none; the transcript is given to the asker and written nowhere (29, C.5 "none, alone") | `{ key, form, whole: true, transcript }` or `{ key, form, whole: false, range, whole_by: "<how to read the whole>", transcript }` (16) | not an identity; part not configured; not ready; gone; unreachable |
| **turns** | identity, optional range | as transcript | as transcript | `{ key, whole, turns: [ {offset?, speaker?, words} ] }` and, as text, C.4's lines | as transcript |
| **status** | — | — | reaches no meeting (34); may ask the service's sign-in-state | `{ accounts: [ { part, service, account, sign_in: "in-force"\|"lapsed"\|"refused"\|"none", ends?: Instant } ] }` | none |
| **sign-in** | part | run by the operator on the machine (32, C.3) | writes the sign-in to the store, all or nothing (61) | the new state | unknown part; the operator does not approve at the service; under a capture host (the store is the host's: question 17) |
| **capture** (the run) | part, raw place, cursor? | settings readable; raw place writable | places raw material; hands lines; nothing else kept | the lines of C.1 | see the run's state machine (section 7) |

Refusals that bind every operation: a generic part's name that another configured service or a built-in part already goes by is refused when settings are read (45), so no operation runs with it. No operation ever writes a word of a meeting to a diagnostic (37) or a sign-in anywhere but its store (33).

How a part is added (12 deliverable): eddy's own part is a module behind the part interface of section 5.1; another author's is a binary declared as an adapter part in its own plugin, speaking C.1 on stdout and writing C.4 under `--raw-dir`, proved by the conformance suite (44, 66, S15). The model assumes eddy publishes the shared code (identity, skip, plain copy, `meeting.json`, the lines) as a library so another author's part gives the same shapes (q10, question 22).

## 5. Seams as ports, and what each profile binds

### 5.1 The meeting service (B.1)

```
trait MeetingService {
  list_meetings(account, Window | Since(mark)) -> Answered { meetings: [ServiceMeeting], next_mark? } | NotWhole { reason }
  fetch_transcript(account, id)                -> Transcript { bytes, form } | NotReady | Gone | Unreachable { reason }
  sign_in_state(account)                        -> InForce { ends? } | Lapsed | Refused
  sign_in(account, operator's approval)         -> SignIn { secret, renew? }
}
ServiceMeeting { id, title?, started_at?, planned_at?, length?, attendees?, url?, ready }
```

Guarantee (50): one meeting, one id, every call. Where a service's ids are unique only per account or tenant, or one id covers a series, the profile picks an id that is unique to one occurrence (C.3: Webex's instance id, Teams's transcript id).

| profile | id | list / fetch | sign-in | bound when |
|---|---|---|---|---|
| `wispr` | the endpoint's id for the meeting | the part is an MCP client of Wispr Flow's HTTP MCP endpoint and calls its tools from its own code; no model session runs (9) | the part's own, once per machine by the operator | first |
| `webex` | the meeting instance a transcript belongs to, never the series (2) | Webex's transcripts API: transcripts in a window, then each one's content | an integration the operator approves once per machine | when the operator records on Webex |
| `teams` | the transcript's own id (Graph gives every occurrence one meeting id: 2, 50) | Microsoft Graph's meeting transcripts | tenant admin consent, then the operator's sign-in once per machine | when a tenant's admin consents |
| generic | the field the settings name | any MCP endpoint serving meetings and transcripts, tools and fields named in settings | as the endpoint asks, once per machine | for services without a part |

Each profile is tested by replaying recorded responses: the adapter takes a transport it can be given a recording of, so no test needs an account, a sign-in or the network (C.3).

### 5.2 The capture host (B.2) — bound by Flywheel's capture contract (C.1)

| port op | contract |
|---|---|
| start (51) | `eddy capture <part> --raw-dir <dir> [--cursor <c>]`; settings in the file `CAPTURE_CONFIG` names; each declared secret in the environment under its declared name; `<dir>` fresh for the run |
| hand (52) | one stdout line `{"capture":{…}}` (section 3.8), raw material already under `<dir>` |
| mark (53) | one stdout line `{"cursor":"<c>"}`; the host keeps the last of a run that ends in `done` |
| end (54) | one stdout line `{"done":{"listed":n,"failed":[{"what","why"}]}}`, exit 0; otherwise no `done`, exit ≠ 0, reason on stderr with no word of a meeting |

Guarantee the model relies on and never reimplements (55, C.1): the host refuses a bad line and takes the rest; passes over a key it holds; banks raw files under the capture's name behind `<host>:<path>`; keeps every capture of an incomplete run, drops its cursor, records it failed; marks a capture with no excerpt unread.

The part declares itself to the host through eddy's Flywheel plugin: command, configuration shape, secrets needed (C.1 start row). A part never learns the inbox (27) and nothing in its environment but `CAPTURE_CONFIG`, `--raw-dir`, `--cursor` and the secrets reaches it from the host.

### 5.3 The stores (B.3)

| port | profile | binding |
|---|---|---|
| read-cursor (57) | the capture host (C.5) | the `--cursor` a run starts with, or absent |
| keep-cursor (58) | the capture host | the last `cursor` line of a run that ends in `done` |
| read-sign-in (60) | eddy's own, alone and under millpond | the file `$XDG_STATE_HOME/eddy/sign-in/<service>/<enc(account)>` |
| write-sign-in (61) | eddy's own | write `…/<enc(account)>.tmp.<pid>` beside the old, `fsync`, rename over the old, under a lock on `…/<service>/.lock` held for the write |
| read-sign-in (60) | the host's secrets, under Flywheel | the environment variable the part declared for the secret |
| write-sign-in (61) | the host's secrets, under Flywheel | **not given by the statement** (q7, question 17) |
| place-raw (63) | the raw bank | eddy writes C.4's three files under `<dir>/<enc>/`; the host banks them |
| (transcripts alone) | none | the transcript goes to the asker and is written nowhere (29) |

Guarantees as the model keeps them: the cursor store keeps only a complete run's cursor (59), which is the host's by construction; a lost cursor costs a listing from the earliest start and no meeting (30, 59); the sign-in store is readable by the operator's user alone, mode `0600` in a `0700` directory (62); raw material stays on the machine, under the raw place, and eddy never reads it back (64): it writes each file to `<name>.tmp`, syncs, renames to its name, and returns the three names only when all three are renamed (20).

### 5.4 Binding (65, 66)

A deployment binds: any number of parts at once (each its own service), one capture host per run, one store of each kind. The conformance suite holds every part and every profile to Parts A and B (66), with the capture contract's meeting checks among them (C.1): every key `meeting/<part>/<id>`, `source` `meeting`, `event_at` at the start, no excerpt, `raw` naming the transcript as served and the plain copy. Every scenario of the suite cites the clauses it exercises; the suite fails if any clause of 1–66 is cited by nothing (12 deliverable; question 26).

## 6. Storage

Everything eddy keeps (29), by machine:

```
$XDG_CONFIG_HOME/eddy/eddy.toml                     settings when eddy runs alone (C.3)
  [parts.wispr]   account = "…"  shortest_length = 300  earliest_start = "2026-10-01T00:00:00-07:00"
  [parts.webex]   …
  [parts.<name>]  service = { name = "<name>", endpoint = "…", list_tool = "…", transcript_tool = "…",
                              fields = { id = "…", title = "…", start = "…", length = "…", attendees = "…", url = "…", ready = "…", transcript = "…" } }
$CAPTURE_CONFIG                                     the one part's settings when a capture host runs it (C.1, C.3)
$XDG_STATE_HOME/eddy/sign-in/<service>/<enc(account)>   one sign-in file, 0600 (C.5)
$XDG_STATE_HOME/eddy/sign-in/<service>/.lock            the write lock (61)
<dir>/<enc(id)>/{transcript.<form>, turns.txt, meeting.json}   a run's raw material, the host's to bank (C.4, C.5)
```

Not eddy's: the cursor (the host's state directory under millpond, the tick's own state under Flywheel: C.5); the inbox; the raw bank; any list of what was handed (I4). The settings file holds no sign-in (33); for the generic part it holds the endpoint's description and the name the service goes by (45). The shape above is the model's; the statement fixes the path and the fields, not the layout (question 25).

## 7. Lifecycles

### 7.1 A meeting, as one run sees it

eddy stores no state for a meeting (29); this is the path one run takes it through, derived afresh every run from the service's answer.

```
                    in the service's answer, start ∈ window
                                   │
             ┌─────────────────────┼─────────────────────────┐
     length given ∧ < shortest   start not given          otherwise
             │                     │                         │
          SKIPPED                FAILED                 ready?──no──► UNREADY
     (silent; counted            ("start not given")        │          (listed not ready;
      in listed; never                                     yes         relisted next run)
      failed: 17, 19)                                       │
                                                        fetch ──not-ready──► UNREADY
                                                         │  └──gone / unreachable──► FAILED
                                                      lay out ──error──► FAILED ("lay out: …")
                                                         │
                                                       place  ──error──► FAILED ("place-raw: …")
                                                         │
                                                        hand  ──stdout error──► run INCOMPLETE
                                                         │
                                                       HANDED
```

Across runs the only memory is the host's (55): a HANDED meeting handed again is passed over; UNREADY and FAILED are listed again because the cursor never passes them (25).

### 7.2 A run

```
 STARTED ──settings unreadable / unknown part / name collision (45)──► INCOMPLETE(refused)
    │
 sign-in ──none / lapsed / refused (48)──────────────────────────────► INCOMPLETE(sign-in)   exit ≠ 0, stderr names the account and state
    │ in force
 LISTING ──unreachable────────────────────────────────────────────────► INCOMPLETE(listing)
    │ answered (whole or not whole: both go on, so no meeting waits on the rest: 23)
 HANDING  for each meeting of the listing, section 7.1, in start order
    │
    ├── stopped / killed / stdout closed ───────────────────────────► INCOMPLETE(stopped)   captures already handed stay (55, S5)
    │
    ├── listing was not whole (11) ───────────────────────────────── ► INCOMPLETE(listing)   captures stay; no cursor line; stderr names the account and reason
    │
 MARKING   print {"cursor": cursor'}                                 (53)
    │
 DONE      print {"done": {listed, failed}}; exit 0                  (54)
```

INCOMPLETE always: no `done` line, exit status other than 0, one line on standard error naming the step and reason, with no word of a meeting and no sign-in (37, 33). A cursor line is printed only on the way to DONE, so the host never sees a cursor from a run that will not finish (55 makes the host drop it anyway).

Order of handing: by start, then key, so two runs over the same answer hand the same lines in the same order (S12, 38).

## 8. Concurrency

- **Two runs of one part for one account at once** (28, S16), on one machine or two: each lists, fetches, places under its own `--raw-dir`, and hands under the same identities, since identity is a pure function of the service's id (3). The host keeps one capture per key (55). No lock between runs is needed or taken.
- **One sign-in shared on one machine** (28, 61): both runs read the same file. A write (a renewal, or the operator's sign-in) goes to a temporary file beside it and is renamed over it under `.lock`, so a reader sees either the old or the new whole, never a torn one. A run whose request the service refuses re-reads the store once and retries once before naming the sign-in lapsed, so the other run's renewal is picked up. Of two renewals at once, the second rename wins and the first's file is gone; whether the service still honours the loser is the service's (question 17).
- **Many askers at once** (section 9 givens): list, day, transcript and turns keep nothing and take no lock (29, 41).
- **The clock** (27): a run reads it once at start for the day boundary of `day` and nothing else; the cursor is made from the meetings' starts, never from the clock (section 3.4), so two runs started at different moments over one answer give the same cursor.
- **The raw place** is the run's own (51), so two runs never write one folder; a run that finds `<dir>/<enc>/` already present names that meeting failed ("place-raw: folder already present") rather than overwrite, since `<dir>` was promised fresh (question 27).

## 9. The surfaces

Four, each a plugin outside the core, each calling the core's operations and printing its answers (39, 40, section 9 givens):

| surface | what it offers | how it answers |
|---|---|---|
| command line `eddy` | `list <part> --from --to [--json]`, `day [--date] [--zone] [--json]`, `transcript <key> [--range] [--json]`, `turns <key> [--json]`, `status [--json]`, `sign-in <part>`, `capture <part> --raw-dir <dir> [--cursor <c>]` | the core's JSON with `--json`, a text rendering otherwise; the same fields through every surface |
| Claude Code plugin | pulls a meeting's transcript or plain copy into a session, by identity or by the day's listing; a skill that runs `eddy day --json` then `eddy turns <key>` | the core's answers, unchanged (S8); it tells the session nothing of what to make of a meeting (42) |
| herdr plugin | a pane showing the day's meetings of every account, each by its identity, with "not ready" where so, and each account whose listing is not complete named with its reason beside the rest (S9) | `eddy day --json` at each refresh |
| Flywheel plugin | declares each of eddy's parts as an adapter part: its command `eddy capture <part>`, its configuration shape, its secrets | the part speaks C.1 on stdout |

The identity an asker passes is the key; a surface may also accept `<part> <raw id>` and encode it, since the key is a pure function (3). The day's zone and date default to the surface's process, and the answer states the zone, date and the resolved `from`/`to` instants, so two askers in two zones can see why their "today" differs (38, 83).

## 10. A fixed worked example

Operator settings for `wispr`: `account = "op@example.com"`, `shortest_length = 300`, `earliest_start = 2026-10-01T00:00:00-07:00`. For `webex`: `account = "op@example.com"`, same shortest length and earliest start. Asker's zone `-07:00`; today 2026-10-17. The Wispr service, on 2026-10-17, holds for the account (and nothing else since 1 October):

| id | title | start | length | ready at 11:25 | identity |
|---|---|---|---|---|---|
| `mtg_8f3a` | Design review | 09:00:00-07:00 | 2700 | yes | `meeting/wispr/mtg_8f3a` |
| `rec/2026-10-17/standup` | Standup | 09:50:00-07:00 | 900 | yes | `meeting/wispr/rec%2F2026-10-17%2Fstandup` |
| `mtg_7d2e` | Quick call | 10:20:00-07:00 | 120 | yes | (skipped: 120 < 300) |
| `mtg_9c1b` | 1:1 with Sam | 10:45:00-07:00 | 1800 | no (ended 11:15) | `meeting/wispr/mtg_9c1b` |

Webex holds a weekly series `ser-77`, "Platform sync", Mondays 14:00:00-07:00, 3600 s, instances `inst-77-01` (09-28), `inst-77-02` (10-05), `inst-77-03` (10-12), `inst-77-04` (10-19, in the future on the 17th).

**Run 1** — millpond starts `eddy capture wispr --raw-dir /raw/r1` with no cursor at 11:25. lower = 2026-10-01T00:00:00-07:00. The service answers whole with the four meetings. Standard output, in order:

```
{"capture":{"key":"meeting/wispr/mtg_8f3a","source":"meeting","event_at":"2026-10-17T09:00:00-07:00","title":"Design review","url":"https://wispr.example/m/mtg_8f3a","raw":["mtg_8f3a/transcript.json","mtg_8f3a/turns.txt","mtg_8f3a/meeting.json"]}}
{"capture":{"key":"meeting/wispr/rec%2F2026-10-17%2Fstandup","source":"meeting","event_at":"2026-10-17T09:50:00-07:00","title":"Standup","url":"https://wispr.example/m/rec/2026-10-17/standup","raw":["rec%2F2026-10-17%2Fstandup/transcript.json","rec%2F2026-10-17%2Fstandup/turns.txt","rec%2F2026-10-17%2Fstandup/meeting.json"]}}
{"cursor":"1:start:2026-10-17T10:45:00-07:00"}
{"done":{"listed":4,"failed":[]}}
```

exit 0. `mtg_7d2e` is nowhere; `mtg_9c1b` is unready, so the cursor is its start (section 3.4). Under `/raw/r1/mtg_8f3a/`:

```
transcript.json   — the bytes the endpoint served, unchanged
turns.txt:
00:00:04	Sam	Let's start with the storage question.
00:00:11	Ana	Fine by me. Two points first.
00:00:19		[inaudible]
00:00:21	Ana	The second is the cursor.
meeting.json:
{"id":"mtg_8f3a","title":"Design review","start":"2026-10-17T09:00:00-07:00","length":2700,"attendees":["Sam","Ana"],"url":"https://wispr.example/m/mtg_8f3a"}
```

The third line's speaker is empty because the transcript names none (15); its words stay with it. The host banks the three files under the capture's name, writes a pointer `mac-studio:/…`, keeps one capture per key, and keeps the cursor because the run ended in `done`. (S1 holds: three meetings in the morning would be three captures; here two are handed, one skipped, one not ready.)

**Run 2** — an hour later, `--cursor 1:start:2026-10-17T10:45:00-07:00`. lower = 10:45 inclusive. The service answers with `mtg_9c1b`, now ready, 1800 s. Output:

```
{"capture":{"key":"meeting/wispr/mtg_9c1b","source":"meeting","event_at":"2026-10-17T10:45:00-07:00","title":"1:1 with Sam","url":"https://wispr.example/m/mtg_9c1b","raw":["mtg_9c1b/transcript.json","mtg_9c1b/turns.txt","mtg_9c1b/meeting.json"]}}
{"cursor":"1:start:2026-10-17T10:45:00-07:00"}
{"done":{"listed":1,"failed":[]}}
```

The cursor is unchanged (nothing unhanded; the newest start is 10:45), so run 3 lists and fetches `mtg_9c1b` again and the host passes it over (S2, S4: the event time is the meeting's start, not run 2's time).

**Run 1 with a failed fetch (S3)** — the endpoint answers a server error for `rec/2026-10-17/standup`:

```
{"capture":{"key":"meeting/wispr/mtg_8f3a",…}}
{"cursor":"1:start:2026-10-17T09:50:00-07:00"}
{"done":{"listed":4,"failed":[{"what":"meeting/wispr/rec%2F2026-10-17%2Fstandup","why":"fetch-transcript: server error (500)"}]}}
```

The cursor is the earliest unhanded start, 09:50. The next run lists from 09:50: the standup (handed), the quick call (skipped), the 1:1 (handed once ready).

**Run stopped after one capture (S5)** — the host kills run 1 after the first line. No cursor line was printed; the host records the run failed, keeps `meeting/wispr/mtg_8f3a`, and keeps no cursor. The next run has no cursor, lists from 1 October, hands `mtg_8f3a` again (passed over) and the standup (new).

**Lapsed sign-in (S6)** — the store holds a sign-in the service says ended at 2026-10-16T23:00:00-07:00. The run prints nothing on stdout; stderr: `wispr op@example.com: sign-in lapsed 2026-10-16T23:00:00-07:00; run: eddy sign-in wispr`; exit 2. `eddy status --json`:

```json
{"accounts":[{"part":"wispr","service":"wispr","account":"op@example.com","sign_in":"lapsed","ends":"2026-10-16T23:00:00-07:00"},
             {"part":"webex","service":"webex","account":"op@example.com","sign_in":"in-force","ends":"2026-11-15T00:00:00Z"}]}
```

The operator runs `eddy sign-in wispr`; the next run, with whatever cursor the last complete run kept, lists everything from it and hands what the lapse held back.

**Recurring on Webex (S11)** — `eddy list webex --from 2026-09-27T00:00:00-07:00 --to 2026-10-18T00:00:00-07:00 --json` gives three meetings, keys `meeting/webex/inst-77-01`, `…-02`, `…-03`, each with `start` its own Monday; `inst-77-04` has not started. A run hands three captures. `ser-77` appears in no key.

**The pane (S9)** — at 11:30 the herdr plugin runs `eddy day --json`; Webex refuses the connection:

```json
{"day":{"date":"2026-10-17","zone":"-07:00","from":"2026-10-17T00:00:00-07:00","to":"2026-10-18T00:00:00-07:00"},
 "accounts":[{"part":"wispr","account":"op@example.com","complete":true},
             {"part":"webex","account":"op@example.com","complete":false,"reason":"unreachable: connection refused"}],
 "meetings":[{"key":"meeting/wispr/mtg_8f3a","ready":true,"title":"Design review","start":"2026-10-17T09:00:00-07:00","length":2700,"attendees":["Sam","Ana"],"url":"…"},
             {"key":"meeting/wispr/rec%2F2026-10-17%2Fstandup","ready":true,…},
             {"key":"meeting/wispr/mtg_9c1b","ready":false,"title":"1:1 with Sam","start":"2026-10-17T10:45:00-07:00","length":1800,…}]}
```

The quick call is absent (S7). The pane shows three rows, one marked not ready, and "webex: unreachable: connection refused" beside them.

**A session asks (S8)** — the Claude Code plugin runs `eddy turns meeting/wispr/mtg_8f3a`; the session gets the four lines above, byte for byte the words of the transcript with only tabs and line breaks inside a turn replaced; eddy writes nothing (29, C.5 "none, alone").

**Two runs at once (S16)** — a scheduled run and `eddy capture wispr --raw-dir /raw/hand` both start at 11:25. Both print the same two capture lines (different `--raw-dir`, same keys and `raw` paths relative to each). The host keeps one capture of each key. Both read the same sign-in file; neither writes it unless the service renews, and a renewal is one rename under the lock.

## 11. The statement's own questions (section 10)

| q | the model's answer, or carried forward |
|---|---|
| q1 two transcripts for one occurrence, or a revision | **Carried, blocking for `teams`** (question 20). Under C.3, Teams's identity is the transcript's id, so a second transcript is a second meeting, against 1 ("never splits one into two"); under Webex's instance id, two transcripts share one key and the host passes the second over (55), so it is never captured. A revision after a hand is never captured under any profile (same key: 55). The model takes the second transcript as never captured and names the conflict. |
| q2 how long an unready or gone meeting is relisted, and who bounds it | **Carried, blocking** (question 9). The model relists for ever (25), which pins the cursor; it has no bound and no clause lets the part or operator set one. |
| q3 default shortest length; per what; a listing that keeps short meetings | Default 0 (nothing skipped) when unset, since the operator "holds" no length worthless; set per part (settings: 93–95). A listing that keeps short meetings is another question (a different `shortest_length` argument), and the model's `list` takes `--shortest 0` to ask it; its answer is still the same for every asker (38). Question 2. |
| q4 default earliest start | **Carried** (question 3): the model refuses to run a part with no earliest start and no cursor, since any default invents a bound the operator did not set. |
| q5 ids unique only per account or tenant | Carried to each service (question 24). The identity carries no account, so if a service reuses an id across accounts, 4 fails unless the profile folds a tenant into the id. |
| q6 the generic name unique across machines | **Carried** (question 19). 45 is checked on one machine's settings; the statement gives eddy no view of other machines (27, 33). |
| q7 a sign-in renewed on use under Flywheel's env secrets | **Carried, blocking** (question 17). The host places it; no clause gives a way to write it back. |
| q8 a cursor when runs move machines | Default: discarded; the next run lists from the earliest start and loses nothing (30, 59). Cost: a refetch of everything since the earliest start, every capture passed over. |
| q9 does the herdr plugin hand on; does the Claude Code plugin find by anything but identity and window | Default: the herdr plugin hands nothing on; a pane row offers the key for a session's `eddy turns`. The Claude Code plugin finds a meeting only by its key or by the day's listing (38). Question 21. |
| q10 shared code published | Default yes: a library the parts and other authors use for identity, skip, plain copy, `meeting.json` and the lines (43). Question 22. |
| q11 attendees as the service names them, addresses included | Default: exactly as the service gives, address included where the service gives it in its naming of an attendee; eddy never adds or strips one (6). Question 14. |
| q12 an inbox already holding earlier meetings | Default: the earliest start is the operator's alone; eddy never reads an inbox (31), so a reader joins an import and a capture (5, S14). Question 23. |

## 12. The scenarios against the model

| scenario | verdict | note |
|---|---|---|
| S1 three Wispr meetings, three captures, no model | **holds** | section 10 run 1; a capture per ready, unskipped meeting (21); no excerpt (22); no model (9) |
| S2 second run with the cursor; host passes over | **holds** | run 2; the newest handed meeting is handed again and passed over (55) |
| S3 one of three fails to fetch; next run hands it | **holds** | the failed variant: cursor at the failed start (25) |
| S4 unready meeting; complete run; next hands it with its start | **holds** | run 1 → run 2; `event_at` is the start (22) |
| S5 run stopped after one capture; cursor stays; nothing twice | **holds** | no cursor line until the end; the host keeps the capture and drops the run (55) |
| S6 lapsed sign-in: incomplete, status says so, next run catches up | **holds-if** the last complete run's cursor is kept by the host through the failed runs (55 says an incomplete run's cursor "is never kept", which the model reads as "the earlier one stands") |
| S7 two-minute call: no run, no surface, never failed | **holds** | `short` is a pure function of length and the setting (17); S7 presumes every machine has the same `shortest_length` |
| S8 session gets the plain copy; eddy keeps nothing | **holds** | `turns` (16), C.5 "none, alone" |
| S9 pane: Wispr and Webex by identity, one not ready, Webex unreachable named beside | **holds** | `day` with per-account completeness (12, 11) |
| S10 last week's listing matches the service's list less short ones | **holds-if** the service's own list is by start, as the window is (82); and the listing was complete (11) |
| S11 weekly meeting, four identities, four captures | **holds** | Webex's instance id (C.3); `inst-77-04` once it has started and is ready |
| S12 same captures under millpond and the tick | **holds-if** both hosts pass the same cursor; the lines are a function of the answer, settings and cursor (27); `raw` paths are relative so the raw place does not show |
| S13 id with `/` kept in one segment | **holds** | `rec%2F2026-10-17%2Fstandup`; `enc` is injective (4) |
| S14 a hand-saved transcript and the part's capture: two captures, a reader joins | **holds** | eddy reads no inbox (31); the folder drop's key is not `meeting/wispr/…` |
| S15 another author's part beside eddy's, indistinguishable to the host | **holds-if** the author takes the shared library or reproduces its shapes exactly, and the suite can drive their binary (question 26); the host sees only C.1 lines |
| S16 scheduled and hand runs at once; one identity, one capture, sign-in whole | **holds** | section 8; identity is pure (3); write under lock and rename (61) |

Nothing fails outright; S6, S10, S12 and S15 hold on an assumption each, named above.

## Questions

Each is a decision the statement does not make. **blocking** means a builder cannot write the part without an answer; **can default** gives the default the model takes.

1. **When does a service list a meeting, and what may the cursor pass?** (25, 46, 10, 26). The cursor is by starts, and 25 forbids excluding any unhanded meeting. If a service lists a meeting only once its transcript exists, a long meeting started before a short one is listed after it, and a cursor at the newest listed start excludes it for ever. The model's cursor (3.4) is safe only where the service's answer for a window is final at the moment it answers, or where the service gives a mark (46). Guessing wrong loses meetings silently, against I5. Options: (a) use the service's mark where given and refuse a service that gives none; (b) a per-part `lag` setting, cursor = min(unhanded start, now − lag), at the cost of refetching `lag` worth of transcripts every run (21); (c) the model's: earliest unhanded start else newest listed start, accepting the risk. **blocking**; needs the answer per service in C.3.
2. **The shortest length when unset, and its unit** (17, q3). Guessed as 300 s it drops calls the operator wanted; as 0 it keeps everything. Options: 0; a fixed figure; required. **can default**: 0, in seconds, per part; `list --shortest <s>` asks the other question.
3. **The earliest start when unset** (26, q4). A default of "now" or the epoch invents a bound (6's spirit). Options: required; now at first run; epoch. **can default**: required, and a run without one and without a cursor ends incomplete naming the setting.
4. **`listed` counts skipped meetings, but a listing holds none** (10 vs C.1 `done`). Clause 10 says a listing holds every meeting "other than those skipped"; C.1 says `listed` counts "every meeting the listing held, skipped and unready ones among them". A builder who follows 10 under-counts against the conformance pack, and the other way over-counts against 10. Options: `listed` = the service's answer in the window; `listed` = the listing of 10. **can default**: the service's answer in the window, and 10's listing is what surfaces give.
5. **A part's name charset, and an empty meeting id** (C.2, 45, C.1). A part name with `/` makes a four-segment key; an empty id gives a key ending in `/`, which the host may refuse (C.1) and which cannot be named in `failed[].what` either. Options: refuse such names at settings time; percent-encode the part name too; name an empty id `%` or fail the meeting with `what` = `meeting/<part>/`. **can default**: part names `[a-z0-9][a-z0-9_-]*`; an empty id is named failed with `why` "id empty" and `what` `meeting/<part>/`, which the host may refuse (55 takes the rest).
6. **Percent-encoding's case and the encoding of `%`** (C.2, 3). `%2E` suggests uppercase; lowercase on one machine and upper on another gives one meeting two keys, against 3. **can default**: uppercase hex, `%` always encoded as `%25`, unreserved bytes never encoded except a whole id of `.` or `..`.
7. **A run's upper bound** (10, 27, 82). None, or "now"? A meeting in progress has a start in the window. **can default**: no upper bound; in-progress meetings are unready.
8. **A listing that was not whole: hand what was listed, or stop?** (11, 23, 24). Handing from a partial answer risks nothing (55 keeps every capture anyway) and 23 says no meeting waits on another; stopping is simpler. **can default**: hand, then end incomplete without `done`.
9. **A meeting that is never ready, or that the service no longer holds, pins the cursor** (25, 47, q2). Every run then relists and refetches everything after it (21), for ever. No clause bounds it or names who may. Options: a per-part `give_up_after` setting, after which the meeting is named failed once more and the cursor passes it; the service's retention as the bound; never. **blocking**: a cursor that never advances turns every later run into a full refetch.
10. **A ready-listed meeting whose fetch says not ready** (46, 47, 23). Failed or unready? **can default**: unready (the listing was stale), not in `failed`.
11. **One account per part, or several** (12, 93–95, 43). Settings name "the account"; 12 names "every account eddy reads". Two accounts at one service with one part name share a key space (3, 50). **can default**: one part instance per account; two instances of `wispr` are refused unless the service's ids are unique across accounts (question 24).
12. **How an asker's zone and date reach each surface** (12, 83, 38). The core takes them as arguments; the surface's defaults decide what "today" means for a pane on a box in UTC with an operator in `-07:00`. **can default**: process zone, `--zone` and `--date` to override, and the answer states all three.
13. **What part of a transcript an asker may ask for, and the "way to read the whole"** (16). Options: a turn range, a byte range, a time range; the whole by the same command without the range. **can default**: a turn range for `turns`, a byte range for `transcript`, and `whole_by` naming the command.
14. **Attendees' shape** (6, 8, q11). Strings? Objects with name and address? Verbatim JSON? **can default**: the service's own value carried verbatim into `meeting.json`; the listing gives the same.
15. **What a turn is when a transcript gives consecutive segments by one speaker, or no speakers at all** (14, 78, C.4). Folding changes the line count; not folding breaks "one line per turn". A `txt` transcript with no speakers and no times is one turn or one per line. **can default**: fold consecutive segments of one named speaker; a segment with no speaker is a turn; a transcript with no structure is one turn per line as served. Conformance should fix this, since another author's part must match (43).
16. **Offsets: absolute vs relative times, sub-seconds, beyond 24 h, and a start without an offset** (14, C.4, 7). `HH:MM:SS` needs the meeting's start for absolute times; a service that gives wall time with no offset cannot give an instant, and 6 forbids inventing one. **can default**: truncate to whole seconds, hours unbounded; a start with no offset is "not given" and the meeting fails (23) unless the part's settings name the account's zone.
17. **Writing a renewed sign-in under Flywheel** (32, 60, 61, q7). The host places the secret in the environment; a service that renews on use and invalidates the old leaves the next run with nothing. Options: eddy's own store is authoritative on every host and the environment only seeds it; the host offers a write; services that renew on use are not run under Flywheel. **blocking** for any service that renews on use.
18. **Where a cursor lives when a part's runs move to another machine** (57, 58, q8). **can default**: it does not move; the next run lists from the earliest start (30).
19. **The generic part's name across machines** (45, q6). eddy sees one machine's settings; two machines can give two services one name and collide in one inbox, or one service two names and double it. Options: the operator's responsibility; a registry the host provides; names carry the machine. **can default**: the operator's, and 45 is checked per machine against built-in and configured names only.
20. **Teams's and Webex's ids against clause 1** (1, 2, 50, C.3, q1). Teams: the transcript's id, so two transcripts of one occurrence are two meetings (against 1). Webex: the instance id, so two transcripts of one instance are one key and the second is never captured. Options: fold the transcript id into the key for both; keep as C.3 says and accept; make the second transcript "more raw material of the first", which 55 does not allow after a hand. **blocking** for `teams` and `webex`; `wispr` needs the same answer (does the endpoint ever give two transcripts for one id?).
21. **The herdr plugin's hand, and the Claude Code plugin's search** (q9, 38, 42). **can default**: neither hands on; neither searches; both find by key or day.
22. **A shared library for parts** (43, 44, q10). Without one, another author reimplements the encoding, the skip and the fold and may differ by a byte. **can default**: published, and the suite tests the shapes not the library.
23. **Imports that precede eddy** (5, 26, q12). **can default**: the reader joins; earliest start is the operator's.
24. **Whether each service's ids are unique across accounts and tenants** (4, 50, q5). Unknowable from the statement; a wrong guess merges two meetings under one key. Options per service: fold the tenant or account into the id. **blocking** per service, settled when its profile is written; `wispr` first.
25. **The settings file's layout and what `eddy capture` reads without `CAPTURE_CONFIG`** (C.1, C.3). **can default**: `[parts.<name>]` tables; `capture` falls back to `eddy.toml`.
26. **What the conformance suite drives and which clauses count** (66, 12 deliverable, S15). To hold another author's binary to Parts A and B it must feed it a service's answers it does not control. Options: a replay transport the author must support; the suite checks only a recorded run's stdout and raw files; the suite ships a fake MCP endpoint and only MCP-speaking parts are testable. Which of 1–66 must be cited: all, or the testable ones (9, 44 are hard to test). **can default**: the suite ships a fake service for the generic/MCP route and checks any other part by a recorded run; all of 1–66 must be cited, by a static check.
27. **A raw folder already present in a fresh `--raw-dir`** (51, 20, 63). **can default**: that meeting is named failed; nothing is overwritten.
28. **The transcript's `<ext>` for a form the part cannot name** (C.4, 47). **can default**: the service's content type where given, else `bin`.
29. **Whether `list` and `day` need a sign-in in force, or answer "not complete" naming the sign-in** (11, 34, 48). **can default**: answer with `complete: false, reason: "sign-in lapsed"` for that account, so a pane still shows the others (S9's shape).
30. **Standard error's content on an incomplete run under 37 and 33** (C.1, 33, 37). A service's error body may quote a meeting's words or echo a token. **can default**: eddy writes its own one-line reason with the status code and never the body.

**Count:** 30 questions; 5 blocking (1, 9, 17, 20, 24), 25 defaultable.
