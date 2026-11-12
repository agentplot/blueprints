# A session sleeps and wakes: dormant conversations in flume

The operator's driving notes of 2026-11-11 ask for a flume place's agent
session that can be put to sleep and woken at any time, that sleeps on its
own once idle, and that the operator wakes or sleeps from Boomdrive's cloud.
The notes are kept unchanged at
`design/research/2026-11-11-driving-notes/flume-session-lifecycle.md`, with
the tool map beside them at `README_1.md`. This page weighs them against
flume's statement (`design/flume/requirements.md`, cited by bare clause
number) and flume's rules and records on agentplot/flume's main at
`e2973d57`, records what the host showed on 2026-11-11, and keeps what the
talk with the operator settles.

## What the notes ask for

- Three states of a session: live, with a terminal pane; dormant, with no
  terminal and fully resumable; closed, finished and archived.
- Suspend waits for the agent to be idle, archives the transcript, closes
  the pane and marks the session dormant. Resume restores the transcript,
  starts the agent with its resume command in the place and records the new
  pane.
- Policy is flume's, per kind: a coding place sleeps when its
  pipeline reaches its end; an exploration or research place sleeps after
  an idle period. The cloud shows every session with wake and sleep.
- flume owns the transcripts: a configuration home of flume's own per
  account, a high `cleanupPeriodDays` written there, and a copy of each
  transcript in flume's own store, copied back before a resume.
- A session moves to another account, or another host, by copying its
  transcript under the same project folder and resuming there.

## What the written design already settles

- **A caller's stop is a sleep in all but the carry.** A stop ends the
  place's agent and nothing else; the stage neither ends nor moves on and
  waits for a retry or a drop (51). The agent's room and account are freed
  (70, 145). A conversation stopped so is still a conversation: only its
  caller's finish ends it (109).
- **A retry is a wake in all but the carry.** A retry starts the stage with
  a fresh agent and the retry's words (49). It carries the conversation only
  where the conversation was reported lost, or its agent kept open for an
  answer was lost with its terminal or host (49, 179, record 0052); "a
  caller's retry of a conversation reported lost carries its agent's
  conversation so, and no other retry carries one" (core.32). A retry after
  a stop starts the conversation afresh.
- **flume already lets an idle agent go and carries it back.** An agent that
  stopped short needing an answer is kept open for the time its settings
  give, one hour where none gives one, the life of the prompt cache, and is
  then let go; the stage keeps waiting, and "a conversation's agent so let
  go is carried at its answer's retry" (198). Status keeps the move and its
  since unchanged when an agent is let go (130).
- **flume never ends a conversation on its own.** It holds a conversation
  to no quiet limit and no stop check, never reports it stuck, and never
  ends it on its own (109). An idle sleep of a conversation the operator is
  in has no clause behind it.
- **flume writes nothing in an account's configuration home.** "flume
  copies, links and writes nothing in an account's configuration home"
  (core.32; record 0020, section 5; C.4). A flume-owned configuration home
  per account, flume writing `cleanupPeriodDays` there, and copying a
  transcript back before a resume all write in one.
- **Moving a conversation between accounts is settled.** Record 0020 weighed
  copying the transcript into the chosen account's home (its option 3) and
  turned it down: "a copy of a file in a format flume does not own, two
  copies of one conversation that then differ, and one step from copying
  the home's other files, its credentials among them." The host shares one
  `projects` folder across its accounts' homes, once, and flume only reads
  whether the transcript is there (179, C.4's carry row).
- **Resuming from a path exists and was turned down.** Claude Code 2.1.296's
  `--resume` also takes a transcript's path (record 0020, option 4). It was
  turned down because the session would go on writing in one account's home
  while its other state is in another's. The notes' "no known flag to resume
  from a path" is answered.
- **Accounts are flume's.** Choosing an account at each start, a pool's
  threshold, a spent account and the readings are flume's (144 to 146, 185,
  211). A carried start takes the lost start's account while it is usable,
  and otherwise the account 145 chooses where it reaches the conversation
  (49).
- **Program settings reach an agent without touching a home.** A start's own
  settings go in a file beside its record in the place's own folder, passed
  by `--settings` (196, C.4; records 0017, 0043).
- **A coding place has nothing to put to sleep.** Each start of a stage is
  one fresh agent that ends on its deliverable (core.10, record 0003), so a
  coding place's agents end as its stages do. Dormancy is a conversation's.
- **The cloud asks flume as the runner.** With Boomdrive, the runner asks
  flume at the asking of Boomdrive's hosted control plane, carries each
  place's status, and Boomdrive imports nothing when it takes over (C.9;
  agentplot/strategy decision #46). No tool calls another
  (`design/principles.md` 7).

## What the host showed on 2026-11-11

Read on deneb, the operator's Mac, which runs the madswan pool's three
accounts.

- **The Keychain does not break per-account homes.** Claude Code keeps one
  Keychain item per configuration home, `Claude Code-credentials-<hash>`,
  seventeen of them beside the default home's `Claude Code-credentials`, and
  the pool's three accounts run at once with their own usage readings. The
  notes' untested credentials risk is answered for macOS.
- **The host already shares `projects`.** Every account home under
  `~/.claude-sub-*` links its `projects` to `~/.claude/projects`, so a
  conversation already carries between deneb's accounts (179).
- **Transcripts are purged at thirty days.** No home sets
  `cleanupPeriodDays`, so Claude Code's default of thirty days holds, and the
  oldest of the 6,043 transcripts in the shared folder was last written on
  2026-10-13, twenty-nine days back. Every Claude Code start under any home,
  the operator's own sessions among them, cleans the one shared folder. A
  conversation left asleep past thirty days loses its transcript, and its
  wake starts afresh, as 49 says for a transcript gone.
- **Installed and pinned differ.** `claude` on the path is 2.1.322; flume
  pins 2.1.296. Nothing here rests on the difference.

## What is new

- Sleep as a state a caller can put a conversation in and take it out of,
  with the conversation carried on its wake.
- A conversation sleeping on its own once idle.
- What a sleeping conversation is in flume's status, and how Boomdrive's
  cloud lists it and wakes or sleeps it.
- Keeping a sleeping conversation's transcript past Claude Code's cleanup.
- Moving a sleeping conversation to another host.
- Account health as a signal that moves sessions (the notes' millpond
  signal).

## Questions for the operator

1. Does a wake carry the conversation? A retry after a stop carrying it
   loosens core.32's "no other retry carries one", which the operator
   accepted with record 0052.
2. Does flume put a conversation to sleep on its own, and on what: an idle
   time from the settings, as 198 keeps an agent open; only a caller's word;
   or the cloud's? Any of the first loosens 109's "never ends it on its
   own" for the conversation's agent, while the conversation itself still
   ends only on its caller's finish.
3. Does flume write in a configuration home, or keep its own copy of
   transcripts? Either loosens core.32 and record 0020, which the operator
   accepted. The other way is the host's: every home sets
   `cleanupPeriodDays`, once, as every home already links `projects`.
4. What is a sleeping conversation in status and in the cloud?
5. Is a move to another host flume's, Boomdrive's, or out of scope?

## What the talk settled

Nothing yet.
