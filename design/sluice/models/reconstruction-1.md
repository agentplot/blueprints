# sluice: a model from the statement

## The form, and why

This is a **record-centred state model**. It has three parts: a data model of the branch's records; the lifecycles of the objects in those records (entry, candidate, claim, lead); and one step function. The step function reads the records, calls the seams, and writes the records back by compare-and-swap. The statement itself picks this form. Almost every clause in Part A describes what state an entry or candidate may be in and which transitions are allowed (5, 7, 10, 12, 17, 18, 21, 22). Clauses 26, 51, 58, 59, 61 to 63 and S10 and S14 require that state to live entirely in records that any host can read and that only one writer at a time can advance. Once the records and their transitions are fixed, the rest of sluice is a reconciler over them.

I considered and rejected three other forms:
- **A component and deployment model.** C.8 shows two deployments, peers and a central server, that differ in every component placement while Parts A and B stay the same (52). So components are not where the invariants live. They get a short section at the end.
- **A per-seam inventory of resources.** Part B is already exactly that. Restating it would add nothing.
- **A message protocol between hosts.** Under 62 and 63 all coordination reduces to a conditional write on the records. Even the peers deployment needs no protocol beyond it. A protocol model would invent messages that the statement deliberately replaced with a shared record.

Seam calls appear in this model only by the Part B operation names (`materialize`, `release`, `affected`, `run`, `up`, `down`, `read`, `form`, `commit`, `move`, `submit`, `forecast`, `withdraw`, `state`, `notify`, and records `read` and `write`).

---

## 1. The records (data model)

There is one record set per branch (61). Every write to it is all or nothing and conditional on the version it was read at (62, 63). All state that sluice holds is here. A running process may cache it but is never its only holder (26, 51, 59).

### 1.1 Branch record

| field | meaning | forced by |
|---|---|---|
| `branch` | the branch's name | 42 |
| `version` | the version the records were read at, supplied by the records seam | 61, 62 |
| `seq` | a counter incremented by every write that admits a submission; the branch's single order of submission | 6, 57 |
| `lead` | `{instance, host, epoch, lease_until}`: who advances the branch, and until when | 58, 59 |
| `base` | the branch revision the current chains were formed on | 10, 24 |
| `policy_at` | the revision the gate was read from (always `base`) | 56 |
| `chains` | one per lane: `{lane_id, entries[] in order, candidates[], window, mode}` | 10, 13, 14 |
| `landing` | at most one landing intent: `{chain, from, to, commits[], entries[], verdicts[]}` | 22, 23, 24 |
| `outbox` | notifications decided but not yet confirmed delivered | 20, 50, 51 |

### 1.2 Work

"Work" is the lineage of submissions from one place to one branch. It exists because two clauses need something that outlives a single entry: the word, which is given once and survives a resubmission (4), and the count of prior submissions (54).

| field | meaning | forced by |
|---|---|---|
| `work_id` | identity of (place, branch) | 54 |
| `session`, `submitter` | whom to notify, who may withdraw | 3, 20, 48 |
| `word` | `{given_by, at}` or absent | 4 |
| `entries[]` | every entry this work submitted, in order | 54 |

### 1.3 Entry

| field | meaning | forced by |
|---|---|---|
| `entry_id` | `branch` + the `seq` at admission | 57 |
| `work_id` | link to the work | 4, 54 |
| `head` | the revision submitted | 3, 47 |
| `after[]` | entry ids it must land after | 3, 6, 7 |
| `priority` | as given by the submitter or the planner | 3, 6 |
| `submitted_seq` | the branch's `seq` at admission; this is the "time of submission" | 6, 57 |
| `prior_submissions` | the number of entries the work had before this one | 54 |
| `affected` | the affected parts, or `unknown` | 8, 9 |
| `state` | see §2.1 | 5, 7, 12, 17, 22 |
| `history[]` | every state the entry has passed through, with the `seq` of each | 26 |
| `verdicts[]` | ids of the verdicts read for every candidate it was the newest entry of, and of the verdict it landed on | 26, 49 |
| `removal` | `{reason: culprit\|conflict\|withdrawn\|bound, by, detail}` | 5, 20, 65 |

**Recommendation on ordering (6, 57).** Take "time of submission" to be `submitted_seq`, the position of the admitting write in the records' single sequence of writes, not a wall clock. Ordering by the records' write order and ordering by a hybrid logical clock both satisfy 6 and 57. The write order is free, total and identical on every host, because the records are already the serialisation point (63). Host clocks add skew and add nothing.

### 1.4 Candidate

| field | meaning | forced by |
|---|---|---|
| `candidate_id` | a hash of (`base`, the ordered list of (entry, head)) | 10 |
| `entries[]` | the entries ahead of it in its lane, then itself | 10 |
| `revision` | the result of folding `form` over `base` and each head in order | 10, 43 |
| `formed_on` | `base` | 24 |
| `state` | see §2.2 | |
| `verdict_id` | once read | 15, 18 |
| `places[]` | the places made for it, with their hosts | 25, 32 |

A candidate is identified by the revision it was formed on and its exact entry list. If either changes, it is a different candidate (10, 21, 24). An identifier that is never reused means "a candidate formed from a cached revision" (24) cannot be mistaken for the current one.

### 1.5 The log (append only)

The log only ever grows. Nothing in it is rewritten or discarded (16).

- **Run**: `{run_id, candidate_id, check, key, outcome: pass|fail, executor: {id, host, confined}, claim_id}`. A run is written when the executor reports and before any verdict that reads it (16).
- **Replay**: `{candidate_id, check, key, outcome, replayed_from?}`. A replay is never written as a Run (16, 38).
- **Claim**: `{claim_id, candidate_id, checks[], executor, lease_until}` and its end, `{reported|expired}` (60).
- **Verdict**: `{verdict_id, candidate_id, gate_at, per_check: [{check, key, reading: passed|failed|missing|flaky, evidence: run_ids}], satisfied}` (15, 19, 27).
- **Conflict**: `{entry_id, candidate_id, content, contested_with: [{entry_id, head, work}]}` (12, 65).
- **Attribution**: `{failed_candidate, culprit, failing_checks}` (17, 20).
- **Landing**: `{from, to, commits[], entries[]}` and **Refusal**: `{expected, found}` (24, and core.5's "reported").
- **Notification**: `{work_id, outcome, delivered}` (50).

### 1.6 Executor identity and trust

An executor record carries its `id`, its `host`, and `confined`. `confined` is true only when the place seam and the deployment attest all three parts of the glossary's definition (glossary "executor"). A gate trusts executors by these fields (27, 28, 29). How a policy names a trusted executor is not fixed (Q14).

---

## 2. Lifecycles

### 2.1 Entry

```
submit ──► pending-word ──(word)──┐
   │                              ▼
   └───────────────────────────► waiting ──(afters landed or ahead in own chain)──► queued
                                                                                      │
          ┌──────────── re-formed (21, 24, lane change, preemption) ◄────────────────┤
          ▼                                                                           │
        queued ──(its candidate claimed)──► testing ──(verdict)──► judged ──► landing ──► landed
          │                                    │                       │
          │                                    └─(first failed, 17/18)─┴──► culprit
          └──(form refuses)──► conflict
 any non-terminal ──(withdraw 48 | policy bound 5)──► withdrawn | expired
```

- `pending-word`: the branch requires a word and the work has none (4, S5). The entry has been admitted to sluice but not yet to the branch's order.
- `waiting`: an after-entry is neither landed nor ahead in the same chain (7). Waiting entries are not chain members, so no candidate contains them and they hold up no one (7).
- `queued` / `testing` / `judged`: these are chain members. Only `judged` with a satisfied verdict can lead to `landing`.
- `culprit` and `conflict` take the entry out of the chain (21, 12). They do not take it out of sluice. Under 5 an entry leaves sluice only by landing, by withdrawal, or by a bound. So these entries are **parked**: readable, never in any candidate, until withdrawn or bounded.
- **Recommendation (5, 54).** A new submission from the same work implicitly withdraws that work's parked entry, as a withdrawal by its submitter (5 allows that). The alternative is to leave parked entries until a bound. That also satisfies 5, but it piles up entries that can never land. Q3 asks which the statement intends.

### 2.2 Candidate

```
formed ──(form refused)──► conflict
   │
   ▼
open (some required key missing) ──(claim)──► claimed ──(all runs reported)──► judged(pass|fail)
   ▲                                               │                                  │
   └──────────(claim lease expired, 60)────────────┘                                  ▼
                                                                         landed | superseded
any state ──(base moved, entry ahead removed, lane changed, preempted)──► obsolete
judged | obsolete ──► places released (25)
```

- A candidate whose required keys all already hold trusted passes goes straight from `formed` to `judged`, and nothing runs (15, S10).
- An obsolete candidate's runs stay in the log. Its keys remain reusable for the candidate that replaces it (15, 16).

### 2.3 Claim (an executor's hold on a candidate's checks)

`open → held(executor, lease) → reported | expired`. A report that arrives under an expired or superseded claim is refused by the conditional write. The run has no outcome and its checks are open again (60, S15).

### 2.4 Lead (who advances a branch)

`vacant → held(epoch e) → (renewed by every successful write) → lapsed → held(e+1)`. Taking the lead is a records write that sets `lead` with `epoch+1`, and it may only be made once `lease_until` has passed. Every write by the lead is conditional on the version (62). So once another instance has written, a lapsed lead's next write is refused, and it writes nothing more for the branch (58).

**Answer to §10, "stopped rather than gone quiet".** No observer can tell a stopped instance from a quiet one. The model does not need to, because a quiet lead cannot do harm:
- its records writes are refused once the version moves;
- its one effect outside the records, the `move`, is guarded by an intent written beforehand and by the branch's own conditional `move` (§3.6).

So the wait before taking over is purely a liveness parameter: one lease. I recommend the branch's policy state it, since it trades takeover delay against needless takeovers (Q19).

---

## 3. The step function

One step per branch, run only by the lead. Every effect a step decides on is written to the records **before** it is performed. Effects are performed only after that write succeeds. This outbox discipline gives 58, 59 and S10/S14: a successor replays exactly what the records say was decided, and nothing else.

```
step(branch):
  R, v      = records.read(branch)                                  (61)
  if R.lead is not me or my lease has lapsed: stop                (58)
  finish_landing(R)               # §3.6, if an intent is present (59)
  L         = branch.read(branch)                                     (42)
  if L != R.base: R.base = L; mark all candidates obsolete        (10, 24, S8)
  gate      = policy at L                                         (27, 56)
  admit:    word check; after check; lanes                        (4, 7, 8, 9)
  order:    chains by priority then submitted_seq                 (6)
  form:     fold form() along each chain; record conflicts        (10, 12, 43, 65)
  judge:    read verdicts from the log for every formed candidate (15, 16, 19, 28, 29)
  attribute per §3.4; remove culprits and conflicts; re-form      (17, 18, 21)
  window:   adjust per §3.3; open claims up to the window         (13, 14)
  land:     choose a landing per §3.5; write the intent           (22, 23)
  release:  mark places of judged/obsolete candidates for release (25)
  outbox:   append notifications                                  (20, 50, 65)
  records.write(branch, v, R')   # refused → discard R', restart    (62)
  perform outbox, landing, releases; confirm in the next write    (24, 34, 50)
```

Executors and drivers are not the lead. They write to the same records (claims, runs, submissions, withdrawals) under the same conditional write. That is not "advancing" the branch (58), so it needs no lead.

### 3.1 Lanes (8, 9)

1. For each chain-eligible entry, compute its affected parts against `base` (36; but see Q5 on how the parts are obtained).
2. Build a graph: one node per entry, and an edge wherever two entries' parts overlap. An `unknown` entry is joined to every node (9).
3. The lanes are the connected components (8, "transitively").
4. Lanes are derived again on every step and never stored as authoritative. Only the chain derived from them is recorded.

When lanes merge, each affected candidate becomes obsolete and is formed again in the merged order. When lanes split, the same happens in each part.

One consequence follows directly from 8 and 9 together: a single entry whose parts are unknown joins every lane of the branch into one, until it lands or leaves. The model accepts this as written (Q6).

### 3.2 Forming (10, 11, 12, 21, 64, 65)

```
c_0 = base
for e_i in chain order:
   r = form(c_{i-1}, head_i)
   if conflict(content): e_i → conflict; log Conflict; skip e_i; continue      (12)
   c_i = r; candidate_i = (base, entries so far + e_i)                         (10)
```

- I recommend forming the **whole chain** every step, not just the window. Forming runs no check, and S2 and 12 want a conflict found and reported "before any check runs". Forming only within the window would also satisfy 12, but it would leave conflicts deep in the chain unreported until the window reached them.
- A conflict removes only that entry. Everything behind it is folded without it (12, 21).
- **contested_with (65).** `form` returns the content, not which entries put it there. Proposed rule: the contested entries are those ahead whose own change, folded on `base` alone, touches the contested content. To find them, fold the head against `base` extended by each entry ahead singly, and list every entry against which `form` refuses on that content. This is O(n) extra `form` calls and runs no checks. It misses conflicts that need two entries together to arise; for those, report the whole prefix up to and including the first entry at which the conflict appeared (Q8).
- **Tension between 12 and 18.** 12 removes a conflicted entry when its candidate is formed. 18 forbids removing any entry before every candidate ahead of it has a verdict. **Recommendation:** treat 18's "removed" as covering removal as culprit only. Report and park a conflict at forming, as 12 and S2 require, and do not reconsider it if an entry ahead later fails (the session resubmits). The alternative is to report at forming but hold the removal until 18 is met, letting the entry rejoin if the conflict disappears. That is more permissive, but it tells a session of a conflict that later dissolves. Q7.
- **Forecast (64, 47a).** The same fold on a read-only snapshot of the records, with the head placed where it would sit if submitted now. It writes nothing, needs no lead, and can run on any host that can read the records. The result is never stored as a verdict.

### 3.3 Window and mode (13, 14, 27)

- The window is per chain and stored in the chain record, so a successor resumes it (59).
- Policy gives `[min ≥ 1, max]` (13, 27).
- **Recommendation:** additive increase, multiplicative decrease. +1 for each candidate that passes, halve (floored at `min`) on each attribution. Linear decrease, or reset-to-min, satisfy 13 equally well. Halving stops a single flake from collapsing a deep window, while still backing off quickly when failures persist.
- **Mode `every`:** open claims on the first `window` candidates that have missing keys.
- **Mode `deepest`:** open a claim only on the deepest candidate within the window. If it passes, everything up to it is landable (§3.5). If it fails, open claims on **all** the skipped candidates at once, within the window (14, S9).
  - Bisecting instead would fit 14's wording. But 18 then needs a verdict on every candidate ahead of the culprit anyway, so bisection saves nothing on a single failure. I recommend the parallel fill.

### 3.4 Verdicts and attribution (15 to 21, 28, 29, 55)

**Reading one required check over a candidate**, given the gate G at `base`:

1. Find the check's key for this candidate. A required check that the candidate does not affect (36) keeps the key it had in the verdict that landed `base`. An affected check gets its key only from a `run` (37). See Q10.
2. Let T be the set of results under that key from executors G trusts (28, 29). Results from untrusted executors are ignored, whatever their outcome.
3. Read the check:

| T holds | reading |
|---|---|
| a pass only | passed |
| a fail only | failed |
| a pass and a fail | passed or flaky, as the policy says, the same for every candidate of the branch (19) |
| nothing | missing → the check is put in a claim and run |

A verdict is **read** only when no required check is missing. It is satisfied only when every required check reads passed (55: none deferred). It is recorded in the log after the runs it rests on (16).

A replay counts as evidence only when it points to a Run already in the log. The trust it carries is that Run's executor's. Otherwise it is missing (16, 38, Q11).

**Attribution.**
- The **first failed candidate** is the earliest candidate in chain order whose verdict is failed. Its newest entry is the culprit (17).
- Attribution waits until every candidate ahead of it has a verdict (18, 14). When it happens, every one of them has passed, by the definition of "first".
- Only the culprit's session is told: the failing checks and the candidate (20).
- Every candidate behind the culprit becomes obsolete and is formed again without it (21).
- Candidates behind it are never reported to anyone (20).

### 3.5 Choosing a landing (22, 23)

Let the **landable prefix** be the longest run of candidates from the front of a chain that contain no culprit or conflict and for which:
- in mode `every`, every candidate has a satisfied verdict;
- in mode `deepest`, the deepest candidate in the prefix has a satisfied verdict.

The branch moves to the end of the landable prefix in one `move`. That is chain order, never past an entry without a verdict, and never past a failure (22).

**Landing commits (23, 44).** For each entry in the prefix, in order:

```
k_i = commit(tree of candidate_i, parent k_{i-1} (k_0 = base), head_i, entry's work, verdict it landed on)
```

- Each commit's tree is the tree that was tested. Landing therefore lands exactly the tested combination, even though the commit object (which carries the verdict) is made after the verdict (I1).
- The second parent is the session's head, so the session's commits stay reachable (23).

**Under `deepest`.** Entries ahead of the deepest candidate have no verdict of their own. I take "the verdict it landed on" (23) to be the deepest candidate's verdict, and every entry's commit names it. 22 and 18 are read as met because those entries land together with, not before, the candidate that holds the verdict (Q12).

### 3.6 Performing a landing (24, 46, 58, 59)

1. **Step N** writes the intent `landing = {from: base, to: k_n, commits, entries}`, conditional on the records version.
2. After that write succeeds, call `move(branch, expected = base, new = k_n)`.
3. **Step N+1** (or a successor's first step, through `finish_landing`) runs `branch.read`:
   - branch at `to`: the entries become `landed`, the Landing is logged, and the outbox notifies each work (50).
   - branch at `from`: no move has happened yet. Retry the same `move` with the same expectation. This is not a blind retry under 24/core.5, because nothing has been refused.
   - branch elsewhere: log a Refusal `{expected, found}`, clear the intent, set `base = found`, and form every chain again (24, S8). Do not retry.

This is the only path that writes the branch, and nothing reachable from `submit` reaches it (1).

Two instances can hold the same intent only if a lapsed lead wrote it before losing the lead. In that case both call `move` from the same expected revision to the same commit. 46 ensures at most one succeeds, and both reach the same outcome.

### 3.7 Places and services for a candidate (25, 31 to 35, 39 to 41)

The executor that holds a claim does the following, on its own host:

```
p = materialize(candidate.revision)
up(p)
run(p, checks)
write the Runs (or Replays) to the records
down(p)
release(p)
```

- The place is recorded under the candidate, with its host. The place belongs to the candidate, and nothing in it outlives it (32).
- `release` happens once the candidate's verdict is read or the candidate is obsolete (25). An instance on the place's own host performs it, because a place is local to its host.
- sluice never releases a session's place (25).

### 3.8 Submission and the driver (1 to 5, 47 to 51, 54)

- **submit** is one conditional write:
  1. it increments `seq` and creates the entry and, if needed, the work, setting `prior_submissions`;
  2. it puts the entry in `pending-word` when the branch requires a word and the work has none.

  It never forms, judges or moves anything (1).
- **2** (the place is exactly its commits) is checked by the driver before `submit`, because `submit` is given a head, not a place (47; Q1).
- **withdraw** is a conditional write, allowed for the submitter, the planner or the operator (5, 48).
- **state** is a records `read`; it needs no running sluice (26, 49, 51).
- **notify** is driven from the outbox:
  - each item names the work's session alone (20, 50);
  - an item is marked delivered by a later write;
  - after a crash it is delivered again, so delivery is at least once and keyed by (entry, outcome) so that the driver can deduplicate (51; Q16).
- **Bounds (5).** The policy may state bounds such as an entry's age. It may never bound resubmissions (54). Expiry is a step decision, logged and notified.

---

## 4. Multi-host

The model is the same everywhere. These are only bindings (52, C.8).

- **Order (57):** one `seq` per branch in the records, whichever host wrote it.
- **One advancer (58):** the lead lease in the records (§2.4).
- **Resume (59, S14):** a new lead's first step is an ordinary step. `finish_landing` completes or refuses any intent left half-done. Verdicts already read are in the log, so no check is run again (S10, S14).
- **Executors anywhere (60).**
  - *How many candidates (§10 Q2):* the lead opens claims only within each chain's window (13). Each host takes, with a conditional write, open claims up to its own capacity, front of chain first. The capacity is the host's own setting, not the branch's.
  - *Which candidates:* earliest first, because the front is what blocks landing (22).
  - *A dead executor:* its claim expires, and the checks are open again (60, S15).
- **Trust of a container on a session host (§10 Q3).** I recommend that a shared branch's gate trust as confined only executors on hosts that run no sessions. Whether "no session there can reach it" holds cannot be shown from the records. The definition also requires that "nothing but it could have written its records", and under peers every host can write the records. That requirement cannot hold on peers at all unless the run records are authenticated (Q15).

---

## 5. Components (brief)

There is one core library and six seam interfaces: place, check, service, branch, driver, records (52).

| role | does | runs where |
|---|---|---|
| **stepper** | §3, for the branches it leads | any host (peers) / the server |
| **executor worker** | §3.7, for the claims it holds | any host with room / the server |
| **reader** | `state`, `forecast` (read only) | any host |
| **driver front** | `submit`, `withdraw`, notification delivery | each session's host |

All four can be one binary. None holds state that is not in the records (26, 59). Records from any profile have one form (53).

---

## 6. Scenarios against the model

| scenario | where satisfied |
|---|---|
| S1 | §3.2 forming, §3.5 to §3.6 landing, §3.8 submit does nothing more |
| S2 | §3.2: conflict at forming, Conflict logged, outbox before any claim |
| S3, S4 | §3.4 attribution, §3.2 re-forming, §3.5 |
| S5 | `work.word` (§1.2), `pending-word` (§2.1) |
| S6 | §3.1 lanes |
| S7 | §3.4 table with the trust filter |
| S8 | §3.6, "branch elsewhere" |
| S9 | §3.3 `deepest` |
| S10, S14 | §2.4, §3 outbox, §3.6 `finish_landing` |
| S11 | §3.5 commits, §3.7 / §3.8 release split |
| S12 | §3 gate read at `base` (56) |
| S13 | §4 order and §3.8 notify |
| S15 | §2.3 claim expiry |
| S16 | §3.2 forecast with contested_with |

---

## 7. Questions: the statement's gaps

1. **Beside 2 and 47.** `submit` is given a head, not a place, so sluice cannot check that "the place's tree is exactly its commits". Is that check the driver's, or should `submit` carry the place?
2. **Beside 1.** How is a session's attempt to move a branch "refused and reported"? `move` is sluice's own operation, and a hand move of the branch (S8) looks the same as a session's. What tells the two apart, and what does the refusing?
3. **Beside 5 and 54.** When a work resubmits after its entry was removed as culprit or conflict, does the new entry withdraw the parked one? If not, how does a parked entry ever leave other than by a bound?
4. **Beside 4 and 47.** No operation of B.5 gives a word to an entry already submitted (S5: "a submission waits for it"). What carries a word that arrives later? Does a word survive a withdrawal, or a resubmission whose head shares nothing with the first?
5. **Beside 8 and 36.** Lanes need each entry's affected parts. `affected` gives checks, and only for a candidate. Are lanes computed from overlapping checks or from parts, and against what revision is an entry's own change taken?
6. **Beside 9.** An entry with unknown parts is in every lane, so by transitivity it joins all lanes of the branch into one. Is that intended, and do the lanes split again once it leaves?
7. **Beside 12 and 18.** 12 removes a conflicted entry at forming, while 18 forbids removing any entry before the candidates ahead of it have verdicts. Which governs a conflict that would vanish if an entry ahead were later removed as culprit?
8. **Beside 43 and 65.** `form` returns the contested content but not which entries are responsible. How are "every entry it is contested with" determined when the conflict arises only from several entries together?
9. **Beside 6.** Can a later entry with higher priority go ahead of candidates already under test, or already judged, making them obsolete? Does a resubmission keep its work's earlier place in the order or go to the back?
10. **Beside 15 and 37.** No operation gives a check's key without running it. How does sluice know that "a key already holds a pass" before calling `run`, other than through the tool's own replay?
11. **Beside 15, 16 and 38.** Is a pass held under a key on one branch's records usable by another branch's gate? Records are per branch (61). If a replay answers from a run sluice never recorded, whose executor does it carry, and can `run` be asked not to replay?
12. **Beside 14, 18, 22 and 23.** Under deepest first, when the deepest candidate passes, the entries ahead have no verdict of their own. Is the deepest verdict "the verdict each landed on", and does landing them together meet "never past an entry without a verdict"?
13. **Beside 19.** When a flaky key reads "not passed", is the candidate failed (and attributed), or missing (and run again)? S7 shows "missing", but only through trust.
14. **Beside 27 and 28.** How does a policy name the executors it trusts: by identity, by host, by confinement, or by profile? Who vouches for an executor's identity?
15. **Beside 29, the glossary's "confined", and C.8.** "Nothing but it could have written its records" fails under peers, where every host writes the records. Must runs be authenticated, or is confinement unavailable under peers?
16. **Beside 50 and 51.** Is a notification exactly once or at least once? After a crash between deciding and confirming delivery, a session may be told twice.
17. **Beside 26 and the server records.** 26 requires state to be readable from every host "whether or not sluice is running". Under a central server, other hosts read only by asking the server. Is a stopped server "sluice not running"?
18. **Beside 25 and 32.** A candidate's place lives on the executor's host. If that host stops for good, who releases its places, and is the promise that nothing outlives the candidate kept?
19. **Beside 58 and 27.** Who sets the lead lease, and the claim lease of 60: the branch's policy, the deployment, or the operator?
20. **Beside 3, 48 and the actors table.** How is "who submitted" or "who asks" established, especially for writes from another host? How does a planner change an entry's priority or after-entries once it is submitted, when B.5 offers no such operation?
21. **Beside 23 and 44.** What is "the entry's work" that a landing commit names? It is not in the vocabulary.
22. **Beside 47a.** `forecast` takes no priority, so where among the entries ahead is the head placed?
23. **Beside 55 and 15.** A required check that the candidate does not affect has a verdict only through the key the branch already holds. What if the branch's revision was moved by hand and holds no verdict at all: are all required checks then missing?
24. **Beside 13 and 27.** Is the window per chain or per branch, and is there a bound across lanes on how many candidates are under test at once? The actors table gives sluice "how many at once".
25. **Beside 2 and the glossary's "branch".** A bolt's branch is itself submitted to the shared branch. What is its "place" and "session" for 2, 20 and 25?
