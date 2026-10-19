# millpond: a model from the statement

Built from `requirements.md` alone. Every clause number in parentheses is the statement's. Names that the statement does not give (field names, record ids, paths, the shape of a status) are this model's and are marked as such where it matters; where the statement leaves a decision open the model takes a default and the matching entry under *Questions* says which.

## The form

The statement calls for a combination of four forms, and no single one would carry it:

- **A data model**, because the clauses are mostly invariants over records: a capture per key (9, 10, 11), a signal's fields (34), a move's six words and their consequences (36), an item's signals as a derivation (44), a send's three parts (51), a status's contents (26). Part C fixes that records are at rest in named formats (C.2) and that every surface reads the same records (64, 65).
- **Ports and adapters**, because Part B is written as ten seams, each with operations and a guarantee (77–100), and Part C binds each with profiles (101), with the explicit rule that Parts A and B hold under any binding (92, "Parts A and B do not change to admit a profile", C preamble).
- **A protocol with state machines**, because the core behaviour is how one offer is taken in seven ordered steps (C.1), and the records move through few, fixed states: a capture from unread to read (17, 31), a run to complete or failed (23, 24), an item from proposed to sent (140, the vocabulary of *item*) to landed (55), an inquiry to accepted (57).
- **A concurrency model**, because clause 4 and the store's guarantee (81, 82) make atomic, non-interleaving writes a property of the whole, and three scenarios test it (S8, S14, S17).

Forms considered and rejected:

- **An event log as the primary form**: ruled out by 81 ("the records to add *or replace*"), 35 (the operator *replaces* a move), 48 (an item's brief changes after a send), and C.2 (records are files in a checkout, one commit per write). Captures and signals are write-once (11, 34), but the inbox as a whole is a versioned document, not an append-only log. The git history is a log underneath, but nothing in Parts A or B reads it as one.
- **A deployment model as the primary form**: ruled out by the preamble (Parts A and B "name no mechanism") and 30 (nothing a part is handed tells it which tool started it). Hosts matter (1, 3, 13, 14, 28), but as a dimension of the data (which host took, which host banks, which host runs a part), not as a topology to draw first.
- **A pure protocol**: ruled out because most of the statement is about what is kept, not what crosses a wire; the one wire protocol (C.1's JSON Lines) is a profile of one seam.

## 1. Shape

```
  sources ──► parts ──┐                       sessions (outside millpond, 70)
  (release, meeting,  │ offers, cursors,      ┌────────────┐  ┌────────────┐
   folder, deploy)    │ completion (78)       │   reader   │  │  curation  │
                      │                       └─────┬──────┘  └─────┬──────┘
  callers ────────────┤ offers (27)                 │ read          │ moves, brief
  (deploy, sounding   │                             ▼               ▼
   offer, crew signal)│          ┌──────────────────────────────────────────┐
                      └─────────►│           millpond core (64)             │
                                 │  land · run · tick · read · moves ·      │
       the operator ────────────►│  brief · send · import · status · lists  │
       (batch / item / send)     └───┬──────────┬──────────┬────────────────┘
                                     │          │          │
             ┌───────────────────────┘          │          └──────────────────────┐
             ▼                                  ▼                                 ▼
  ┌────────────────────┐   per host   ┌───────────────────┐    per host   ┌──────────────────┐
  │   inbox store      │              │     raw bank      │               │  per-host state  │
  │ (shared by every   │              │ (this host's raw  │               │ (cursor + status │
  │  host, versioned,  │              │  material; pointer│               │  per part; lost  │
  │  one writer at a   │              │  = host:path)     │               │  without loss)   │
  │  time)  80–82      │              │  83–85            │               │  86–88           │
  └────────────────────┘              └───────────────────┘               └──────────────────┘
             │ sends
             ▼
  ┌──────────┬───────────┬───────────┬──────────────┬─────────────┬───────────┐
  │  place   │  starter  │ merge q.  │   inquiry    │   planner   │  claims   │
  │ 89–90    │  91–92    │ record    │   95–97      │   98–99     │  100      │
  │ worktree │ pane/cmd/ │ 93–94     │   sounding   │   crew      │ none /    │
  │          │ launcher  │ sluice    │              │             │ Flywheel  │
  └──────────┴───────────┴───────────┴──────────────┴─────────────┴───────────┘
```

The invariant at the centre (I1, I3, I5):

```
captures : Key ⇀ Capture            — a partial function, write-once per key (9, 11)
signals  : SignalId ⇀ Signal         — each names one capture; write-once (34)
moves    : SignalId ⇀ Move           — at most one standing move per signal (35)
items    : ItemName ⇀ Item           — names never reused (46)

signals(item) = { s | standing move of s is join/attach/route and names item }   (44)
raw material ∉ inbox store; pointer(c).host holds it                              (14)
```

## 2. Values and records

Field names below are this model's unless the statement gives them (C.1's offer fields are the statement's).

### 2.1 Settings (72–77 of the vocabulary; 2, 20, 21, 50)

```
Settings
  parts     : map PartName → PartSetting
  limit     : bytes, default 8192 (C.4)
  reader    : how a reader starts (33): a command (C.2)
  items_go  : sends | planner                    (50)
  claims    : none | <claims profile>            (39, 101)

PartSetting
  host      : HostName                           (3)
  schedule  : five-field cron (C.4)              (schedule, 28, 29)
  config    : a value whose shape the part declares (21)
```

Millpond reads settings and never writes them (2).

### 2.2 Part declaration (77, section 9 givens)

```
Declaration
  command        : how the part is run
  config_shape   : a schema the configuration must fit (21)
  secrets        : list of SecretName, each handed in the environment under its name (C.1 run)
```

### 2.3 Offer (91 of the vocabulary; 7; C.1)

```
Offer
  key       : Key        required
  source    : string     required   (release | meeting | folder | deploy, C.1; the set is a profile's)
  event_at  : RFC 3339   required   (12)
  title     : string?    
  url       : string?    
  raw       : [RelPath]? paths relative to the raw place (15)
  excerpt   : OwnExcerpt?           (17)

OwnExcerpt                           — every field a signal carries but its capture (7, 34)
  text, kind, asserted_by, assertion, subjects[], argues_with[], position
```

### 2.4 Capture (101 of the vocabulary; 12, 13, 14, 17)

```
Capture
  key       : Key
  source, event_at, title?, url?        — as offered, never the taking time (12)
  pointer   : Pointer?                  — absent only when nothing was banked (14; Q6, Q27)
  origin    : part(PartName) | intake | import(BodyName)   (13; import added, Q27)
  taken_on  : HostName                  — the host that took it (13); for an import, the importing host
  taken_at  : instant                   (13)
  reading   : none | own | read(at, by) — unread ⇔ none (17, 31, 125)

Pointer = (host : HostName, path)      — names one host and one capture's material (85); "<host>:<path>" in C.1/C.3
```

A capture never changes once written (11), with one exception the statement forces: `reading` moves from `none` to `read` exactly once (31). The model keeps the read mark as part of the capture record because "unread" is defined on the capture (125); a builder may keep it as a separate record keyed by capture with the same once-only rule.

### 2.5 Signal (34)

```
Signal
  id          : SignalId   — this model: "<capture key>#<n>", n from 1 in the order written (Q11)
  capture     : Key
  own         : bool       — true for the one own signal (121)
  kind        : constraint | ask | question | commitment | reaction   (115)
  asserted_by : string
  subjects    : [string]
  assertion   : string
  excerpt     : { text, position }      — text as it stands in the raw material (117); for an own signal, the cut text (18)
  argues_with : [string]                — may be empty ("when it argues with anything", 34)
```

Write-once (34).

### 2.6 Move (36–38)

```
Move
  signal      : SignalId
  word        : drop | answered | challenge | join | attach | route
  consequence :
     drop      → reason : string
     answered  → settled_by : ClaimName | RecordRef   (a RecordRef may name an accepted conclusion, 36)
     challenge → against : ClaimName                  (39)
     join      → item : ItemName                      (37: new, or proposed)
     attach    → item : ItemName                      (37: sent)
     route     → chore(item : ItemName) | ask(text)   (38)
  batch       : BatchId
  proposed_by : SessionName
  decided_by  : OperatorName | none                   (57; none in a setup where the operator decides items)
  standing    : bool                                  (35; false once the operator replaced it)
```

A replacement keeps the replaced move with `standing = false` and writes the new one in the same write, so "at most one standing move" (35) is a check over moves with `standing = true`.

### 2.7 Batch (133 of the vocabulary; 40, 43)

```
Batch
  id, proposed_by, proposed_at, moves : [Move], state : proposed | written | refused
```

Whether a proposed batch is a record of the inbox or only the session's is open (Q13). The model keeps it as a record so the herdr plugin can show it row by row from the core (64, section 9); moves in a `proposed` batch are not standing and leave their signals unmoved (35, 41).

### 2.8 Item (139–140 of the vocabulary; 44–49)

```
Item
  name        : ItemName       — unique over the inbox's whole life (46)
  signals     : derived, never stored: see §3.6 (44)
  conclusion  : InquiryName?   — set when made from an accepted conclusion's proposed work (44, 58)
  weight      : derived, see §3.7 (45)
  brief       : text?          — written by curation or the operator (47)
  sends       : [Send]         (49)
  landing     : Landing?       — written at most once (55)
  record      : Conclusion?    — the accepted conclusion of its inquiry, kept unchanged (57)
  state       : derived: proposed if sends = [], else sent (140)

Send
  n           : ordinal within the item
  target      : place(repo : RepoName, branch : BranchName) | inquiry(InquiryName) | planner   (51)
  asked_by    : string         (51)
  at          : instant
  brief       : text           — the brief as handed, frozen (48)
  started     : pending | started | failed(reason) | by_hand(instructions)   (53, 54, 91)
  outcome     : open | landed | concluded | sent_back(n) | dropped | abandoned   (49; Q16, Q22)

Landing
  onto        : BranchName, revision : Revision    (55)

Conclusion   — as the inquiry profile gives it (96): answer, evidence, what it would change, proposed work, open
```

### 2.9 Per-host state (107–109 of the vocabulary; 26, 86–88)

```
PartState (one per inbox × part on this host)
  cursor  : opaque string?      (25)
  status  : Status?

Status
  ran_at      : instant
  complete    : bool                           (23)
  not_run     : reason?                        (21: configuration does not fit)
  took, held  : counts                         (26, 9)
  refused     : [{ offer_key?, line_no, reason }]   (8, 26)
  failed      : [{ what, why }]                — the part's own, from its completion (26)
  last_report : text?                          — tail of what the part reported when it failed, secret values scrubbed (26, 75; Q30)
  cursor_moved: bool
```

The intake writes none of this (27).

### 2.10 Raw bank entry (102–106 of the vocabulary; 83–85)

```
BankEntry  keyed by (inbox, capture key)
  files      : the offered raw paths, byte-identical (16)
  excerpt    : the whole own-excerpt text, present only when millpond cut it (19; Q6)
```

## 3. Derivations and decisions the statement fixes

### 3.1 Key validity (7, C.1)

```
valid_key(k):
  k non-empty, segments = split(k, "/")
  k does not start with "/"
  no segment is ".."
  first segment is not "captures" and not "moves"      (Q7: segment, not string prefix)
  (profile may add: no empty segment, no "." segment)
```

### 3.2 Offer acceptance (7, 15, C.1 step 1)

```
check_offer(o, raw_place):
  require o.key, o.source, o.event_at present; event_at parses as RFC 3339
  require valid_key(o.key)
  for p in o.raw: require p relative, resolves inside raw_place, readable      (15)
  if o.excerpt present:
     require text non-empty, kind ∈ the five, asserted_by, assertion, subjects, argues_with, position present   (7, 34; Q8)
  else ok
  → ok | refused(reason)
```

### 3.3 Held (9, 10, 62)

`held(k) ⇔ k ∈ dom(captures)`, whatever origin the holder has (part, intake, import).

### 3.4 The cut (18, 19, 123)

```
cut(text, limit):
  if bytes(text) ≤ limit: return (text, none)
  lines = split keeping line ends
  k = largest i such that bytes(lines[1..i]) + bytes(trailer(i)) ≤ limit     (Q5: trailer counts)
  trailer(i) = one line: "[millpond cut: <len(lines)−i> lines, <bytes(text)−bytes(lines[1..i])> bytes left out]"
  return (lines[1..k] ++ trailer(k), whole = text)
```

Whenever `whole` is returned it is banked beside the capture's raw material (19). A text within the limit gets no trailer (18). The cut never breaks a line (I4).

### 3.5 Due (28, 29, 112)

```
due(part, now, state):
  state.status is none                                → true   (never ran)
  else next_time(schedule, after = state.status.ran_at) ≤ now → true
  else false
```

Several missed times count once (29): `due` is a boolean, not a count.

### 3.6 An item's signals (44)

```
signals(item) = { s ∈ signals | m = standing_move(s); m.word ∈ {join, attach, route} ∧ m.item = item.name }
```

For a `route`, only the chore form names an item (38).

### 3.7 Weight (45, 137)

```
weight(item) = ( count = |signals(item)|,
                 sources = { captures[s.capture].source | s ∈ signals(item) },
                 span = [min, max] of captures[s.capture].event_at )
```

### 3.8 Age (42)

`age(signal) = now − captures[signal.capture].event_at`. Nothing reads `taken_at` for a listing, count or weight.

### 3.9 Unread (17, 125)

`unread(c) ⇔ c.reading = none`. An own-excerpt capture is written with `reading = own` and is never unread (17).

### 3.10 Excerpt stands in raw material (32, 117; Q10)

```
stands(excerpt, bank_entry):
  some file f in bank_entry.files such that
     normalise(excerpt.text) is a contiguous substring of normalise(contents(f))      (bytes, line ends evened)
  and excerpt.position names f (and, where it gives a line, a line that holds the excerpt's first line)
```

For an imported capture this check is skipped (60).

### 3.11 Move validity (35–39)

```
check_move(m, inbox):
  m.signal exists                                                      
  no standing move for m.signal, unless the writer is the operator replacing (35)
  m.word ∈ the six                                                       (36)
  join    → item is new (name never used, 46) or exists with state proposed (37)
  attach  → item exists with state sent (37)
  route   → chore: item is new and will hold this one signal (38); ask: no item
  challenge → inbox.settings.claims ≠ none ∧ standing(m.against)         (39, 100)
  answered → settled_by names a claim that stands, or a record of the inbox (36)
  drop    → reason non-empty
```

### 3.12 Item state (140)

`state(item) = proposed if item.sends = [] else sent`.

### 3.13 Landing (55, 93, 94)

```
refresh_landing(item):
  if item.landing present: nothing
  for send in item.sends where target = place(repo, branch), outcome = open:
     r = merge_queue.landed(repo, branch)
     if r = landed(onto, rev): write item.landing = (onto, rev); send.outcome = landed; stop
```

Never inferred from the branch's position (94).

## 4. Operations

Each: who may call, preconditions, effects, refusals. "Under the lock" means inside the inbox store's write (§8).

### 4.1 take_offer(offer, raw_place, origin, host) — the seven steps (C.1; 7–19)

1. **check** (§3.2). Refusal → named with reason in the run or intake report (8); the next line is still taken.
2. **look up the key**: `held(key)` → count as held, write nothing, bank nothing (9). The look-up is repeated under the lock in step 4 because another host may have taken the key meanwhile (9 "whatever writes at once").
3. **bank**: copy each `raw` file whole into this host's bank under the capture's key; compute the cut; if cut, bank the whole excerpt text beside them (16, 19). The entry is *staged*: it becomes final only when step 4 commits, and is removed if step 4 finds the key held (16: only what a taken capture names is banked).
4. **write the capture**: under the lock, re-check `held(key)`; if held → unstage the bank entry, count held. Else write `Capture{…, pointer = (host, path) if anything banked, origin, taken_on = host, taken_at = now, reading = own | none}` (11–14).
5. **write the own signal** in the same write when `excerpt` present: `Signal{id = key#1, own = true, excerpt.text = cut text, every other field as offered}` (17, 18).
6. **mark unread** when no excerpt: `reading = none` (17).
7. **record** for the run: took/held/refused counts and names; the intake tells its caller the same and writes no status (26, 27).

Refusals: missing key/source/event_at; bad key; raw path unreadable or outside the raw place; excerpt without text or lacking a signal's field; (profile) malformed line. None stops another offer (8).

### 4.2 run(part) (20–26, 30, 78)

Preconditions: `part ∈ settings.parts`; `settings.parts[part].host = this host` (3); no run of this part in flight on this host (22; a host-local lock per part suffices since a part runs on one host).

```
if not fits(config, declaration.config_shape): write Status{not_run = why}; stop            (21)
raw_place = fresh empty directory                                                          (20)
env = declared secrets only, resolved by the host's secrets binding (Q2); CAPTURE_CONFIG = file with config
cursor_in = state.cursor or none
start part: <command> --raw-dir raw_place [--cursor cursor_in]                              (C.1)
for each line, in order:
   capture → take_offer(…, origin = part(part), host)
   cursor  → last_cursor = value                                                           (25: opaque)
   done    → completion = value   (at most one, 78)
complete = part exited 0 ∧ completion seen                                                 (23)
if complete ∧ last_cursor seen: state.cursor = last_cursor                                 (23; Q24 when none offered)
write Status{ran_at, complete, took, held, refused, failed = completion.failed or [], last_report = scrubbed stderr tail if not complete}   (24, 26)
delete raw_place                                                                           (16)
```

Captures taken before a failure stand (24). Nothing in `env` or the arguments says which tool started the run (30). Only the part's command runs, nothing else packaged with it (76).

### 4.3 tick() (28, 29, 33, C.4, C.6)

```
for part in settings.parts where host = this host ∧ due(part): run(part)      (28, 29)
for each item with an open place-send: refresh_landing(item)                  (55; Q17)
if settings.reader given:
   charge = { c | unread(c) ∧ (c.pointer.host = this host ∨ (c.pointer = none ∧ c.taken_on = this host)) }   (33; Q9)
   if charge ≠ ∅ ∧ no reader of this inbox running on this host: starter.start(reader job over charge)       (Q25)
```

A tick never runs a part naming another host (28, S14) and writes nothing when nothing is due.

### 4.4 land(lines, raw_place?, caller) — the intake (27, 59)

Reads offers from the caller; `origin = intake`. Raw paths resolve against the raw place the caller gave (Q1); with none given, any offer naming raw is refused (15). Writes no cursor and no status (27). Answers the caller: took, held, refused with reasons.

### 4.5 read(capture, signals[]) — a reading (31–34)

Caller: a reader session, through the tool.

```
under the lock:
  require captures[capture].reading = none         else refuse "already read" (31; own captures too, 17)
  for s in signals: require s.excerpt stands in bank(capture) (§3.10), fetched from the host the pointer names (84)
  if any fails: refuse whole, naming each excerpt that does not stand (32); capture stays unread
  write each Signal{id = key#n…, own = false}, set reading = read(now, reader)
```

A reading of no signals is taken and leaves the capture read (31, S6). A capture with no pointer can take only a reading of no signals, since no excerpt can stand anywhere (Q9).

### 4.6 moves(batch) (35–43)

Caller: curation (propose), the operator (accept/change), through the tool.

```
propose(batch):  every m passes check_move against the records now; write Batch{state = proposed}    (Q13)
                 in a setup where the operator decides items (C.13 "with crew"), proposed = written at once (57)
accept(batch_id, changes):  the operator's rows replace the proposed ones
   under the lock: re-run check_move for every move (S8: a signal moved meanwhile refuses the whole batch, naming it)
   write all moves standing, make/grow the items the joins and chores name, write Batch{state = written}   (40)
   or refuse whole, naming each move that could not be taken, writing nothing (40)
```

Curation proposes only for unmoved signals (35). No surface asks signal by signal: the unit of decision is the batch (43).

### 4.7 replace_move(signal, move) (35)

Caller: the operator only. Under the lock: mark the standing move `standing = false`, write the new move standing after `check_move` as if unmoved. If the old move named an item, that item's `signals` changes by derivation (44); the item itself is not deleted (46).

### 4.8 brief(item, text) (47, 48)

Caller: curation or the operator. Writes `item.brief`. Past sends keep the brief they handed (48).

### 4.9 send(item, target, asked_by) (48–56)

```
require item.brief present                                            (48)
if settings.items_go = planner:
   require target = planner else refuse "items of this inbox go to the planner"      (50, S10)
   planner.hand(item, brief); write Send{target = planner, brief, started = started}  (50, 98); idempotent for the planner (99)
else:
   target = place(repo):
      branch = branch_for(item, n)                                      (52; Q18)
      p = place.make(repo, branch, brief)  → refused if branch exists or repo unreachable (89)
      under the lock: write Send{target = place(repo, branch), brief, started = pending}    (53: only once the place holds the brief)
      r = starter.start(p, brief)                                       (91)
      write send.started = started | failed(reason) | by_hand(instructions)     (53, 54; the starter itself writes nothing, 92)
   target = inquiry:
      name = inquiry.open(question = brief, sources = signals(item) with their captures)   (56, 95)
      under the lock: write Send{target = inquiry(name), brief, started = started}
   target = planner: refuse (this inbox makes sends, 50)
```

Millpond does none of the item's work (54), moves no existing branch (74).

### 4.10 conclude(item) — reading an inquiry's conclusion (57, 58, 96, 97)

Run at each tick for sends with `target = inquiry` and `outcome = open`:

```
s = inquiry.conclusion(name)
accepted(c, works) → write item.record = c (once, unchanged, 57); send.outcome = concluded
                     for each work w, with its ordinal k: name = "<item>/<k>"      (Q21)
                        if name ∉ items: write Item{name, conclusion = name of inquiry, brief = w's text}   (58, once however often read)
sent_back(n)      → send.outcome = sent_back(n) (the inquiry goes another round; Q22)
dropped           → send.outcome = dropped
```

A conclusion never becomes a signal (59).

### 4.11 import(body) (60–63)

```
for each capture in the body (with its signals and moves as read):
   key = its first key if it had one, else from the folder name it comes from     (61)
   if held(key): write nothing                                                    (62)
   else under the lock: write Capture{origin = import(body), pointer = none, reading = read(imported)} (60; Q27)
        write its signals (excerpts unchecked, 60)
        write each move whose word ∈ the six as standing; a move with another word is dropped and its signal arrives unmoved (63)
```

### 4.12 Queries (64–67)

All read the store, the local bank and the local per-host state; none writes:

- `signals(filter: moved?, source, age range, capture, subject)` (66)
- `capture(key)`: the record, and the raw material when this host holds it (66, 84)
- `items(filter)`: each with signals, weight, brief, sends (66)
- `status(part?)`: per-host status and the count and oldest age of unmoved signals by source (67, C.3); runs nothing, reaches no source (67)

Every surface answers from these, in one machine-readable form that only gains fields (64, 65).

## 5. Seams as ports, with Part C's bindings

| port | operations (Part B) | guarantee | profiles bound (Part C) | binding scope (101) |
|---|---|---|---|---|
| part | describe (77), run (78) | same key everywhere; one failure stops no other offer (79) | the capture contract over JSON Lines: `<command> --raw-dir <dir> [--cursor <c>]`, `CAPTURE_CONFIG`, secrets in env, exit 0 after `done` (C.1); built-ins `capture folder`, `capture meeting`; headwater, eddy, crew signal, a deployer (C.12) | any number |
| inbox store | read (80), write (81) | all-or-nothing; one of two writes from one version; every host reads the last write; no raw, no per-host state (82) | a git repository or branch: records as `flywheel-*/1` rec files, settings in `millpond.toml`, one commit per write under a lock in the git directory (C.2) | exactly one per inbox |
| raw bank | bank (83), fetch (84) | byte-exact; one host, one capture; never the store (85) | files under millpond's data directory keyed by inbox and capture; pointer `<host>:<path>` (C.3) | one per host |
| per-host state | read (86), write (87) | each host its own; losing it loses no record (88) | files under millpond's state directory keyed by inbox and part; `status --json` (C.3) | one per host |
| place | make (89) | changes no other place or existing branch (90) | a git worktree on a branch named for the item with the brief written in it (C.5) | any number |
| starter | start (91) | writes nothing of the inbox (92) | herdr pane; printed command; a launcher; the reader command from `millpond.toml` (C.6) | any number |
| merge queue's record | landed (93) | what the queue recorded, never inferred (94) | sluice's entry: state and landing commit on the branch landed on (C.7) | — |
| inquiry | open (95), conclusion (96) | accepted only once the operator accepted; never changes after (97) | sounding: `sounding open` → `question.md` on `sounding/<name>`; `conclusion.md`; findings back via `sounding offer` → `millpond land` under `sounding/<name>/<n>` (C.8) | — |
| planner | hand (98) | holds once; plans alone (99) | crew: reads items through millpond's command line; operator decides on the rail (C.9) | at most one per inbox |
| claims | standing (100) | — | none (every challenge refused) on its own or with crew; Flywheel's with Flywheel (C.10) | at most one per inbox |

Missing from Part B and needed by the model: a **secrets** port (where a declared secret's value comes from on a host, 20, 75, C.1) — Q2.

Adding one of each (section 12):
- **a part**: ship a declaration (command, config shape, secrets) in a plugin; speak C.1 on stdout; the keeper adds `[parts.<name>]` with host, schedule, config. Prove it with the capture contract's pack (102).
- **an inbox store**: implement read→(records, settings, version) and write(version, records)→ok|moved with the 82 guarantee; pass the conformance suite (102).
- **a starter**: implement start(job)→started|by_hand|failed, writing nothing of the inbox (92).
- **a planner**: implement hand(item, brief) idempotently (99); set `items_go = planner`.

## 6. Storage (Part C profiles)

```
inbox store (git repository or a branch; C.2)
  millpond.toml                          — settings (2; a fleet may generate it)
  <event date>/<key…>/                   — one folder per capture (C.2 "named from its event date and its key")
     capture      flywheel-capture/1
     <n>.signal   flywheel-signal/1      — n = 1 is the own signal when there is one
     reading mark — part of the capture record or beside it (Q: format is Flywheel's)
  moves/                                 — flywheel-move/1; batch records beside them (Q13)
  items/<name>/                          — the item record: brief, sends, landing, conclusion record
  (keys never start with "captures" or "moves", so a key cannot collide with these folders: 7, C.1)

raw bank (this host; C.3)
  <data dir>/<inbox>/<key…>/<raw path>   — byte-identical copies (16)
  <data dir>/<inbox>/<key…>/_excerpt     — whole own-excerpt text when cut (19; Q6)

per-host state (this host; C.3)
  <state dir>/<inbox>/<part>/cursor
  <state dir>/<inbox>/<part>/status      — written whole (87), by atomic replace
  <state dir>/<inbox>/locks/<part>       — "never twice at once" (22)
  <state dir>/<inbox>/reader             — one reader at a time (Q25)
```

Version = the commit the checkout was read at (80). Write = under the lock in the git directory: fetch, require the branch at the version read (81), apply the files, commit; in a shared store, push with a lease on that version and treat a rejected push as "the inbox has moved" (Q3). Rec at rest, JSON in flight (C.2).

## 7. Lifecycles and state machines

```
Capture      [offer checked] ──own excerpt──► own ─────────────────────────────┐
                            └──no excerpt───► unread ──reading taken──► read   │ never changes again (11, 31)
                                                 ▲ reading refused (32)        │
Run          started ──done line + exit 0──► complete (cursor moves, 23)
                     └──exit ≠ 0 | no done──► failed (captures stand, cursor stays, 24)
                     └──config misfit──────► not run (status says why, 21)
Signal       written (own or by a reading, write-once, 34)
Move         proposed ──operator accepts/changes──► standing ──operator replaces──► replaced (35)
             (in a setup deciding by item: standing at once, 57)
Batch        proposed ──all checks pass──► written | ──any fails──► refused whole (40)
Item         proposed ──first send recorded──► sent ──landed (place) ──► landed (55, once)
                                                   ──concluded (inquiry) ──► record kept (57) ──► new proposed items (58)
                                                   ──handed (planner) ──► with the planner (50)
Send         pending ──starter──► started | failed | by_hand (53, 54); outcome open → landed | concluded | sent_back | dropped | abandoned
Inquiry      open ──► concluded ──operator──► accepted | sent back (another round) | dropped (57, 96, 97)
```

## 8. Concurrency and what the write lock guards

One lock per inbox, held in the inbox's git directory for the whole of a write (C.2), serialises every store write (4): a tick's captures, a reader's reading, curation's batch, a brief, a send record, a landing, a conclusion record, an import. Under the lock each writer:

1. re-reads the records at the current version (80),
2. re-checks what its write depends on — `held(key)` (9), `reading = none` (31), every move's `check_move` (35, S8), the item name unused (46), the branch not yet recorded (53),
3. writes all of its records as one commit or none (81, 82).

The version check (81) covers a writer that read before taking the lock; two writes from one version never both succeed (82).

Outside the lock, and safe there:

- **raw bank writes**: staged before the capture's commit (15) and discarded if the key turns out held (16); the bank is per host and never the store (85).
- **per-host state**: one writer per part (22), written whole by atomic replace (87); reads during a run see the old status whole.
- **place make and starter**: touch repositories and processes, not the inbox (90, 92).
- **part runs**: a host-local per-part lock (22); a tick on one host never races a tick on another for the same part (3, 28).

Granularity: a run commits once per taken offer (Q4), so a part that dies after five offers leaves five committed captures (24, S4); the lock is held per commit, not per run, so a reader and curation interleave between a run's commits without interleaving within one (4, S17).

Multi-host: the store is one history. Each host writes against the same remote branch with compare-and-swap on the version it read (Q3); a host that cannot reach the remote refuses writes rather than forking the history, since a fork could hold two captures of one key (9).

## 9. Surfaces (64–69, section 9)

| surface | reaches | reads/writes through the core |
|---|---|---|
| command line | `land`, `run`, `tick`, `status --json`, `import`, `capture folder\|meeting` | all §4 |
| session tools over MCP (`millpond mcp`) | `signals`, `capture`, `read`, `moves`, `items`, `brief`, `send` | §4.5, 4.6, 4.8, 4.9, 4.12 |
| Claude Code plugin | the read and curate skills; starts `millpond mcp` | instructions are the inbox's data (68) |
| herdr plugin | count and age of unmoved signals by source; a proposed batch row by row; send an item with one key | §4.12, 4.6 accept, 4.9 |
| crew's rail | one decision per item in an inbox crew keeps | §4.9 via the planner |

Every answer is the same through every surface and only gains fields (65). No session writes except through these (69); a git inbox cannot stop a hand commit, so this is held by the conformance suite and by the sessions' instructions, not by the store. The operator's replace of a move (35) has no named surface in section 9: the model adds it to the command line (Q14).

## 10. Worked example

Inbox `demo`, kept as a git branch on hosts `h1` and `h2`. Settings:

```
limit    = 8192
items_go = sends
reader   = "claude-read-inbox"
claims   = none
[parts.releases]  host = "h1"  schedule = "30 4 * * *"      config = { watch = ["mise", "node"] }
[parts.meetings]  host = "h2"  schedule = "*/15 * * * *"    config = { service = "zoom" }
```

Declarations: `releases` wants `{watch: [string]}` and secret `GITHUB_TOKEN`; `meetings` wants `{service: string}` and secret `ZOOM_TOKEN`.

**E1 — S1, the first run.** 2026-10-17T04:30:05Z, tick on h1, `releases` due (never ran). Run hands config, `GITHUB_TOKEN`, raw place `/tmp/mp-r1/`, no cursor. The part prints:

```
{"capture":{"key":"release/mise/2026.10.10","source":"release","event_at":"2026-10-10T14:02:11Z","title":"mise 2026.10.10","url":"https://github.com/jdx/mise/releases/tag/v2026.10.10","raw":["mise-2026.10.10/notes.md","mise-2026.10.10/release.json"],"excerpt":{"text":"<40,960 bytes, 612 lines>","kind":"ask","asserted_by":"jdx/mise","assertion":"mise 2026.10.10 is released; the repository pins 2026.9.18.","subjects":["release","mise"],"argues_with":["packages/mise/default.nix"],"position":"release notes"}}}
{"cursor":"2026-10-17T04:30:05Z"}
{"done":{"listed":1,"failed":[]}}
```

Step 1 passes. Step 2: not held. Step 3: bank `notes.md` and `release.json` under `h1:/var/lib/millpond/demo/release/mise/2026.10.10/`; cut: lines 1–118 are 8,061 bytes, trailer `[millpond cut: 494 lines, 32,899 bytes left out]` is 48 bytes, total 8,109 ≤ 8,192; line 119 would make 8,180 + 48 > 8,192, so k = 118; bank `_excerpt` (40,960 bytes). Step 4, under the lock: still not held; write

```
Capture  key=release/mise/2026.10.10 source=release event_at=2026-10-10T14:02:11Z title="mise 2026.10.10" url=…
         pointer=h1:/var/lib/millpond/demo/release/mise/2026.10.10 origin=part(releases) taken_on=h1 taken_at=2026-10-17T04:30:07Z reading=own
Signal   id=release/mise/2026.10.10#1 own=true kind=ask asserted_by=jdx/mise subjects=[release,mise]
         assertion="mise 2026.10.10 is released; the repository pins 2026.9.18." argues_with=[packages/mise/default.nix]
         excerpt.position="release notes" excerpt.text=<lines 1–118 + trailer>
```

one commit. Exit 0 after `done`: complete. State h1/releases: `cursor = "2026-10-17T04:30:05Z"`, `Status{ran_at=04:30:05Z, complete=true, took=1, held=0, refused=[], failed=[]}`. Raw place deleted.

**E2 — S2, the next day.** Same offer again, with cursor `2026-10-17T04:30:05Z` handed back. Step 2: held → nothing banked, nothing written. Status: `took=0 held=1 complete=true`, cursor moves to the new one offered.

**E3 — S3.** Fourteen offers, one with key `../moves/release-x`. Step 1 refuses it: "key has a `..` segment"; the other thirteen go through steps 2–6. Status: `took=13 held=0 refused=[{line 7, key "../moves/release-x", reason}]`.

**E4 — S4.** The part prints five captures then exits 1 with no `done`. Five commits stand. No completion → not complete → cursor stays at `2026-10-17T04:30:05Z`; `Status{complete=false, took=5, last_report=<stderr tail>}`. Next run: same cursor handed, five offered again → `held=5`.

**E5 — S5/S6, a meeting.** Tick on h2 runs `meetings`: offer `meeting/zoom/88213`, event_at the meeting's start, raw `transcript.vtt`, `transcript.txt`, no excerpt. Banked on h2; capture written with `reading = none`, `pointer = h2:…`. The same tick charges a reader on h2 with it (h1's tick never does: pointer host is h2, 33, S14). Reading 1 offers `Signal{kind=commitment, asserted_by="Dana", excerpt.text="we will ship Friday", position="transcript.txt:212"}` — not a substring of either file → refused whole naming `"we will ship Friday"`; capture stays unread. Reading 2 with `"ship it by Friday"` at `transcript.txt:212` stands → written as `meeting/zoom/88213#1`, `reading = read(…)`. A two-minute meeting `meeting/zoom/88301` gets a reading of no signals → `reading = read`, zero signals, never charged again.

**E6 — S7, a batch.** Curation lists the 50 oldest unmoved by event time and proposes batch `b-0042`: 18 drops with reasons, 6 answered naming records, 26 joins into new items `node-24-bumps`, `mise-2026.10`, `headscale-notes`, `backup-window`, `caddy-plugin`. The operator changes row 31 from `join mise-2026.10` to `drop "already pinned"`. Accept: every move re-checked under the lock, all 50 unmoved still, five item names never used → one commit: 50 standing moves, five proposed items (weights derived: `mise-2026.10` now 1 signal), `b-0042 written`. The next proposal lists unmoved by age and starts at what was the 51st.

**E7 — S8.** Batch `b-0043` names `release/node/24.9.0#1`; between proposal and accept another session's batch moved it. Accept re-checks: standing move exists → refused whole, naming that signal; nothing written, `b-0043 refused`.

**E8 — S9, a send to a place.** Item `mise-2026.10` holds `release/mise/2026.10.10#1` and `release/mise/2026.10.12#1` (weight: 2, {release}, 2026-10-10..2026-10-12). Brief written. `send mise-2026.10 --to swancloud --by chuck`: `place.make(swancloud, "millpond/mise-2026.10", brief)` from the default branch's head → worktree holding the brief. Under the lock: `Send{n=1, target=place(swancloud, millpond/mise-2026.10), asked_by=chuck, brief=<frozen>, started=pending}`; starter (herdr pane) starts an agent in the place → `started=started`. Later ticks ask sluice `landed(swancloud, millpond/mise-2026.10)`: not landed, not landed, then `landed(onto=main, rev=ab6eb465)` → `item.landing = (main, ab6eb465)` once; `send.outcome = landed`.

**E9 — S10, a planner inbox.** With `items_go = planner`, `send mise-2026.10 --to swancloud` is refused "items of this inbox go to the planner". The item, once briefed, is handed: `planner.hand(item, brief)`, `Send{target=planner}` recorded once; a second hand changes nothing with the planner (99) and records no second send.

**E10 — S11/S12, an inquiry.** Item `take-mise-2027` (one signal, kind question) → `send --to inquiry`: `inquiry.open(question = brief, sources = [its signal, its capture])` → name `take-mise-2027`; `Send{target=inquiry(take-mise-2027)}`. Round one: operator sends back → `outcome=sent_back(1)`. Round two: accepted; `item.record = conclusion`, unchanged thereafter; it proposes one work piece → `Item{name="take-mise-2027/1", conclusion=take-mise-2027, brief=<the work>}` proposed, made once however many ticks read the acceptance. The inquiry's side finding goes `sounding offer` → `millpond land` as key `sounding/take-mise-2027/1` with an own excerpt of kind ask → one capture, one own signal; the conclusion itself is no signal. Next release `release/mise/2027.1.0#1` is answered by curation with `settled_by = record(items/take-mise-2027/record)`.

**E11 — S18, the deploy.** `millpond land` on h1 with `{"capture":{"key":"deploy/swancloud-srv/2026-10-17T05:10Z","source":"deploy","event_at":"2026-10-17T05:10:41Z","excerpt":{"text":"<last 30 lines>","kind":"reaction",…}}}`: within the limit, no raw → capture with `pointer = none`, `origin = intake`, own signal; answer to the caller `took=1 held=0 refused=[]`; no per-host state touched.

**E12 — S13, an import twice.** `import crew-folders ./flywheel`: a release folder keeps `release/mise/2026.9.18`; a meeting folder `2026-09-30-standup` takes that name as key. Second import: every key held → nothing. Later `releases` run offers `release/mise/2026.9.18` → held.

**E13 — S15/S16.** h1's state directory deleted: next tick, `releases` is due (no status), runs with no cursor, lists its whole window, every key held. h1 asleep through 04:30 on three days: at wake one tick, `due` true once, one run.

**E14 — S19.** Config `{ watch = "mise" }` (string, not list) → `Status{not_run="config: watch must be a list of strings"}`; no run, no cursor change.

## 11. The statement's own questions (section 10)

1. **Intake's raw material.** The caller names its raw place to `land` (this model: `--raw-dir`); offers naming raw with none given are refused (15). Carried as Q1.
2. **Standing unchanged.** §3.10: byte substring of one banked file with line ends evened; position checked for the file, and the line where given. Carried as Q10.
3. **Neither raw nor excerpt.** Taken (7 asks only key, source, event time); charged to a reader on the host that took it; only a reading of no signals can stand. Carried as Q9.
4. **Hosts sharing one inbox.** One history, compare-and-swap writes, no forks (§8). Carried as Q3.
5. **Secrets.** No seam gives them; the model adds a host binding. Carried as Q2.
6. **Proposed batch as a record.** Yes, a `Batch{proposed}` record, so every surface shows it (64). Carried as Q13.
7. **Dropping a proposed item.** The operator replaces each of its signals' moves; the item stays as an empty record and its name stays taken (46). Carried as Q15.
8. **Sending again; ending an open send.** One open place-send at a time; the operator closes one as `abandoned`; a later send takes branch `millpond/<item>/<n>`. Carried as Q16.
9. **When the queue's record is read.** At each tick (§4.3); listings show what is recorded. Can default (Q17).
10. **Inquiry sent back or dropped.** Sent back: the send stays open for another round; dropped: `outcome=dropped`, the item stays sent with no record. Q22.
11. **Earlier conclusions as sources.** The inquiry finds them, through `items` by subject (66); millpond hands only the item's signals and captures (56, 73). Answered.
12. **Does a drop acknowledge a release upstream?** No: millpond reaches no source (67, 71); the part will offer the release again and the key absorbs it (9). Answered.
13. **Cursor when a part moves host.** It stays on the old host; the new host starts with none and lists wider (88, I8). Q23.
14. **Bounds on readers and run time.** One reader per inbox per host; no run timeout fixed. Q25.
15. **Raw leaving the bank.** Never deleted by millpond; `fetch` copies out. Q26.
16. **Imported capture's pointer.** None; the record says nothing is banked. Q27.
17. **Branch name and base.** `millpond/<item>` from the repository's default branch head at make time. Q18.

## 12. Scenarios against the model

| scenario | verdict | note |
|---|---|---|
| S1 | holds | E1; trailer counted inside the limit (Q5) |
| S2 | holds | E2 |
| S3 | holds | E3 |
| S4 | holds-if | writes are committed per offer (Q4); a per-run commit would lose the five if millpond itself died, though not if only the part died |
| S5 | holds | E5; "does not hold" judged by §3.10 (Q10) |
| S6 | holds | E5 |
| S7 | holds | E6; "next batch starts with the fifty-first" is curation's listing by age (42), not a cursor millpond keeps |
| S8 | holds | E7 |
| S9 | holds-if | a starter is bound and sluice's record names the landing; E8 |
| S10 | holds-if | the item has a brief (48); without one, hand is refused too and the planner holds nothing |
| S11 | holds-if | the inquiry profile gives a stable identity to each proposed work piece (Q21) |
| S12 | holds | E10; needs the caller's raw place only if the finding names raw (Q1) |
| S13 | holds | E12 |
| S14 | holds | tick runs only this host's parts (28); charge only this host's pointers (33) |
| S15 | holds | E13 |
| S16 | holds | §3.5 |
| S17 | holds | §8 |
| S18 | holds | E11 |
| S19 | holds | E14 |
| S20 | holds-if | the inbox's history moves to the next setup's repository by push, not by copying files (C.13's table names three locations while its prose says the inbox stays; Q29) |

## Questions

Each is a decision the statement does not make. Clauses in parentheses.

1. **Where the intake's raw place is** (15, 27, C.1). `land` reads lines; `raw` paths are relative to "the raw directory", but no run made one. Guessed wrong, every caller (the deployer, `sounding offer`, `crew signal`) disagrees with millpond and offers naming raw are refused or, worse, read from the caller's cwd. Options: a `--raw-dir` flag; the caller's working directory; raw forbidden at the intake. **Blocking.** Default: `--raw-dir`, and with none given refuse any offer naming raw.
2. **Where a declared secret's value comes from on a host** (20, 75, C.1 run). Part B has no seam for it, yet a run must put each secret in the environment. Guessed wrong, parts cannot run or secrets land in a file millpond keeps (75). Options: the tick's own environment; a file per secret under a directory the host's binding names; a command the settings name. **Blocking.** Default: a host binding, a directory of one file per secret name, read at run time and never written to state or status.
3. **How several hosts share one git inbox** (1, 4, 82, C.2, S14, S17). The lock is "in the inbox's git directory", which two hosts do not share. Guessed wrong, two hosts take one key at once and the history forks with two captures of it (9). Options: one remote with compare-and-swap pushes and writes refused offline; a per-host branch merged later with key dedup at merge; one host writes and others proxy. **Blocking.** Default: one remote, write = lock + fetch + require version + commit + push with lease; rejected push = "moved" (81).
4. **Commit granularity inside a run** (24, 4, C.2). Guessed wrong, a crash loses taken captures or the lock is held for a whole run and starves readers. Options: per offer; per run; per N offers. **Can default:** per offer.
5. **Whether the added line counts inside the limit, and a first line longer than the limit** (18, 123). 18 reads as "prefix within limit, then a line"; 123 says the excerpt in records holds at most the limit. Guessed wrong, excerpts exceed the limit by a line, or a one-line text over the limit is unrepresentable. **Can default:** the trailer counts; with nothing fitting, the excerpt is the trailer alone and the whole text is banked.
6. **Name and place of the banked whole excerpt, and the pointer of an excerpt-only capture** (14, 19). Guessed wrong, a reader or `capture` cannot find the uncut text, or a capture that named no raw carries a pointer to nothing. **Can default:** `_excerpt` beside the raw files; a pointer exists iff something was banked.
7. **The key prefix rule: segment or string prefix** (7, C.1). `captures-2026/x` is refused under one reading and not the other; the pack (102) decides. **Can default:** first segment equality.
8. **Which excerpt fields are required present** (7, 34). `argues_with` "when it argues with anything": is an absent list a missing field? **Can default:** present, possibly empty; `subjects` likewise.
9. **A capture with neither raw nor excerpt: which host charges a reader, and can a reading hold signals** (15, 32, 33). Guessed wrong, such captures are never read anywhere, or signals are written with excerpts that stand nowhere. **Can default:** charged on `taken_on`; only an empty reading stands.
10. **What "stands unchanged" means** (32, 117). Bytes in one file, or words with whitespace evened; whether position is checked. Guessed wrong, every reader's quote across a wrapped transcript line is refused, or an excerpt from no file is taken. **Blocking** for reader conformance. Default: §3.10.
11. **Signal identity in a move** (34, 36, C.2). Flywheel's format is a black box here; a move must name a signal across hosts and imports. **Blocking**, needed from the external standard. Default: `<key>#<n>`.
12. **Who names an item** (36, 46). Curation's join "names the item it makes"; whether millpond or curation picks the never-used name. **Can default:** curation proposes, millpond refuses a name ever used.
13. **Whether a proposed batch is a record** (40, 43, 64, section 9's herdr plugin). 64 says a surface shows only records, bank and state, and the plugin shows a proposed batch row by row. **Blocking** for the plugin and for "with crew" where no operator accepts batches (57). Default: a `Batch{proposed}` record whose moves are not standing.
14. **The operator's identity and the surface for replacing a move** (35, 51, 57). Section 9's command line lacks a replace; `asked_by` and `decided_by` are strings nothing verifies. **Can default:** a command-line `move replace --by`; trust the caller.
15. **How a proposed item is dropped** (35, 44, 46, 140). Item states are only proposed and sent. **Can default:** replace its moves; the empty item stays, hidden by surfaces, its name still taken.
16. **A second send while one is open, and ending a send that never lands** (49, 52, 53, 55). **Blocking** in practice (every abandoned branch would block the item forever). Default: one open place-send at a time; operator closes as `abandoned`; next branch `millpond/<item>/<n>`.
17. **When the merge queue's record is read** (55, 64, 67). **Can default:** each tick, for open place-sends.
18. **Branch name and base revision** (52, 89). **Can default:** `millpond/<item>`; the repository's default branch head at make time.
19. **An orphan place when the send's record fails after make** (53, 74, 89). The branch exists, millpond may not move it, so every later send is refused. **Can default:** on a later send, adopt a branch whose brief equals this item's and record the send; else refuse.
20. **The planner hand in a pull model** (50, 98, C.9). 50 has millpond hand each item and record the send; C.9 has crew read items through the command line. Who calls hand, when, and what is recorded? **Blocking** for the crew setup. Default: the planner calls `millpond hand <item>` when it takes one; recorded as the send, idempotent.
21. **A stable identity for each piece of work a conclusion proposes** (58, 96). "However often the acceptance is read" needs one; the inquiry profile's `conclusion.md` is prose. **Blocking.** Default: ordinal within the conclusion; item `<item>/<k>`.
22. **An item whose inquiry is sent back or dropped** (57). **Can default:** sent back keeps the send open; dropped records `dropped`, no record kept.
23. **Cursor when a part changes host** (3, 86, 88). **Can default:** stays; new host lists wider.
24. **A complete run that offered no cursor** (23). Keep, or clear? **Can default:** keep.
25. **Bounds on readers and runs** (22, 33). **Can default:** one reader per inbox per host; no run timeout.
26. **Raw material leaving the bank** (16, 85). **Can default:** never deleted by millpond.
27. **An imported capture's origin and pointer** (13, 14, 60). 13 allows only "a part" or "the intake"; 60 adds a third way in, and no host banked anything. **Can default:** `origin = import(body)`, no pointer; 13 amended.
28. **Imported moves and items** (60, 63, C.11). crew's folders are described as a capture and signal files; where its moves and the items joins name come from is unsaid. Guessed wrong, imported joins name items that do not exist and `check_move` refuses them, so every imported signal arrives unmoved. **Blocking** for the import profile. Default: an imported join makes the named item proposed with no brief; moves without a consequence arrive unmoved.
29. **What moves when the setup changes** (6, C.13). The table gives three inbox locations; the prose says the inbox stays where it is. **Can default:** the history moves by push (no record rewritten), the parts' hosts change in settings.
30. **Scrubbing secrets from the failure tail** (26, 75). **Can default:** replace each declared secret's value in the tail; the part owns anything else it prints.
31. **A charged reader that exits without reading** (31, 33). Is the charge recorded, so the next tick waits? **Can default:** not recorded; the next tick charges again once no reader runs.
32. **Reading an own-excerpt capture** (17, 31). Refused as a second reading, or allowed to add signals? **Can default:** refused.
33. **A stale lock after a crash** (4, C.2). **Can default:** lock file names holder and time; broken by the operator or after an age the settings name.
34. **Which landing when an item was sent to two places** (49, 55). **Can default:** the first the queue records; the other send stays open.
35. **The at-rest folder for a key containing `/`, and the event-date prefix** (C.2). Black box of the standard; the pack decides. **Can default:** the key's segments as nested folders under `<event date>/`.

Totals: 35 questions, 10 blocking (1, 2, 3, 10, 11, 13, 16, 20, 21, 28), 25 defaultable.
