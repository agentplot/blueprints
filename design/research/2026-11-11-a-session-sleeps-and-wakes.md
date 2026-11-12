# A session sleeps and wakes: hibernate and resume in flume

The operator's driving notes of 2026-11-11 ask for a flume place's agent
session that can be shut down and woken at any time, that shuts down on its
own once idle, and that the operator wakes or shuts down from Boomdrive's
cloud. The notes are kept unchanged at
`design/research/2026-11-11-driving-notes/flume-session-lifecycle.md`, with
the tool map beside them at `README_1.md`. This page weighs them against
flume's statement (`design/flume/requirements.md`, cited by bare clause
number) and flume's rules and records on agentplot/flume's main at
`e2973d57`, records what the host showed on 2026-11-11, and keeps what the
talk with the operator settles.

On the operator's word of 2026-11-11 this talk also carries the crew talk
`research--should-the-main-level-run-on-demand`, which asked whether crew's
five main-level roles should run on demand as flume places rather than
stand in herdr panes. Its page is kept unchanged, from crew's branch at
`1ea650d2`, at
`design/research/2026-11-07-should-the-main-level-run-on-demand.md`, and
*The crew talk, carried here* below joins its questions to this one's.

## What the notes ask for

- Three states of a session: live, with a terminal pane; dormant, with no
  terminal and fully resumable; closed, finished and archived.
- Suspend waits for the agent to be idle, archives the transcript, closes
  the pane and marks the session dormant. Resume restores the transcript,
  starts the agent with its resume command in the place and records the new
  pane.
- Policy is flume's, per kind: a coding place sleeps when its pipeline
  reaches its end; an exploration or research place sleeps after an idle
  period. The cloud shows every session with wake and sleep.
- flume owns the transcripts: a configuration home of flume's own per
  account, a high `cleanupPeriodDays` written there, and a copy of each
  transcript in flume's own store, copied back before a resume.
- A session moves to another account, or another host, by copying its
  transcript under the same project folder and resuming there.

## What the talk settled

1. **Hibernate and resume are their own idea, apart from the state
   machine.** The operator, in their own words: "there are two [...] use cases.
   1. You might have a state machine going through six different steps.
   It's on step three, made it halfway through, stopped, and you're
   retrying by starting that over. 2. In the simplest use cases you're just
   doing an interactive design session with an agent and leaving the window
   open all day. All I'm saying is I want it to [...] shut down and be able to
   wake back up. Call it hibernate and resume, and keep it separate from the
   standard state machine concept. They're two different ideas." A stop and
   a retry stay the state machine's (49, 51); hibernate and resume are new
   acts beside them.
2. **A kind says whether its places hibernate.** The operator: "certain
   flume kinds will allow hibernation and resume while others won't."
3. **A session hibernates once its prompt cache no longer pays.** The
   operator: "I think it's not about an hour. [...] You're keeping it open
   as long as you're benefiting from the cache and once you can't benefit
   from the cache anymore, you might as well hibernate it." The idle time
   that hibernates a session is its program's prompt cache lifetime, which
   for Claude Code is five minutes from its last read by default and an
   hour where the account or the environment enables it (C.4).
4. **The host keeps transcripts past Claude Code's cleanup, and flume keeps
   no copy.** The operator chose that every configuration home sets a high
   `cleanupPeriodDays`, once, as every home already links `projects`. flume
   still copies, links and writes nothing in a configuration home (core.32,
   record 0020 and C.4 stand). Setting it is a step of the host's setup,
   Boomdrive's or the host's own nix, never flume's.
5. **A tell to a hibernating session resumes it.** The operator chose that a
   tell to a hibernating session resumes it, its words the resumed agent's
   first prompt. Today a tell to a place with no live agent is refused (53).

## What the written design already settles

- **The state machine's stop and retry.** A stop ends the place's agent and
  nothing else; the stage neither ends nor moves on and waits for a retry
  or a drop (51). A retry starts the stage with a fresh agent and the
  retry's words (49); it carries the conversation only where the
  conversation was reported lost, or its agent kept open for an answer was
  lost with its terminal or host (49, 179, record 0052), and "no other
  retry carries one" (core.32). Hibernate and resume leave all of it as it
  stands.
- **The one idle rule flume has is the stall rule, already tied to the
  cache.** A stage's agent that stops short needing an answer, a headless
  stage's among them, is kept open for the time its settings give, "one
  hour where none gives one, the life of its program's prompt cache", so an
  answer that comes within it lands in the warm session (198). Past it the
  agent is let go and the stage keeps waiting; the answer then starts a
  fresh agent with the question and its answer in the prompt (49), and a
  conversation's agent let go so is carried at its answer's retry (198).
  The stuck limit is a separate rule, thirty minutes of quiet with nothing
  delivered, and never ends an agent (44).
- **flume never ends a conversation on its own.** It holds a conversation
  to no quiet limit and no stop check, never reports it stuck, and never
  ends it on its own (109). Hibernating a conversation once idle ends its
  agent; the conversation still ends only on its caller's finish.
- **flume writes nothing in an account's configuration home.** "flume
  copies, links and writes nothing in an account's configuration home"
  (core.32; record 0020, section 5; C.4).
- **Moving a conversation between accounts is settled.** Record 0020 weighed
  copying the transcript into the chosen account's home (its option 3) and
  turned it down: "a copy of a file in a format flume does not own, two
  copies of one conversation that then differ, and one step from copying
  the home's other files, its credentials among them." The host shares one
  `projects` folder across its accounts' homes, once, and flume only reads
  whether the transcript is there (179, C.4's carry row). A resume carries
  the conversation the same way.
- **Resuming from a path exists and was turned down.** Claude Code 2.1.296's
  `--resume` also takes a transcript's path (record 0020, option 4), turned
  down because the session would go on writing in one account's home while
  its other state is in another's. The notes' "no known flag to resume from
  a path" is answered.
- **Accounts are flume's.** Choosing an account at each start, a pool's
  threshold, a spent account and the readings are flume's (144 to 146, 185,
  211). A carried start takes the lost start's account while it is usable,
  and otherwise the account 145 chooses where it reaches the conversation
  (49).
- **A coding stage has nothing to hibernate between its steps.** Each start
  of a stage is one fresh agent that ends on its deliverable (core.10,
  record 0003). The notes' "suspend when the pipeline reaches archive" is
  the state machine ending its agents.
- **The cloud asks flume as the runner.** With Boomdrive, the runner asks
  flume at the asking of Boomdrive's hosted control plane and carries each
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
  the operator's own sessions among them, cleans the one shared folder, so
  every home sets the value or a session hibernating past thirty days
  resumes afresh, as 49 says for a transcript gone.
- **Claude Code compacts an idle conversation before its cache expires.**
  The installed 2.1.322 has a setting `idleCompaction`, true by default:
  "Set to false to stop Claude Code from compacting a long conversation
  while the session is idle." Its changelog: "a 200K+ token conversation
  left idle is summarized, and the summary is used on your next message if
  the prompt cache has expired" (the floor is
  `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS`, never below 100,000), and it runs
  "once the one-hour prompt cache is on". A message to a conversation idle
  past its cache opens a dialog, "Resume this conversation?", that says how
  long it was inactive, how long it is and what share of the five-hour
  usage limit resuming takes, and offers to resume, resume from a summary,
  or start a new conversation. So a session hibernated at its cache's end
  resumes from the summary idle compaction already wrote, and a resumed
  agent's first prompt can meet that dialog, which flume never answers for
  a person (34).
- **`cleanupPeriodDays` has a floor of one.** 2.1.322 refuses `0`, "To keep
  transcripts for a long time, set a large number (e.g. 3650 for ~10
  years)."
- **Installed and pinned differ.** `claude` on the path is 2.1.322; flume
  pins 2.1.296. Idle compaction and the dialog were read on 2.1.322, and
  whether 2.1.296 has them is unread.

## The crew talk, carried here

The crew talk measured agentplot's four standing roles over 30.7 hours on
2026-11-06 and 2026-11-07 and found that "an idle standing agent costs
nothing in tokens. Every token is spent on a wake", that every call
re-reads the whole standing context, 230,000 to 320,000 tokens at the
median for design, the planner and the operator, and that those contexts
were compacted one to five times in the period. A fresh run pays about
70,000 tokens of starting context, and the busy roles come out about even
either way. It set out four shapes for the roles the operator talks to:
every role on demand (A), the talking roles standing (B), on demand with a
run that stays while there is work or talk and ends once idle for a bound
(C), and standing but started fresh at quiet points (D). It held that a
run's idle bound is a stage's lifetime, and so flume's to hold.

Hibernate and resume give the crew talk a shape it lacked: a role's session
that is one conversation across the day, as a standing role's is, which
hibernates once its cache has expired and resumes on the next tell or ask.
It holds no room, account or pane while quiet, as A does, and keeps the
conversation the operator has with the role, as B does. In tokens it costs
what standing costs, since a standing agent woken after its cache expired
rewrites its whole context too, and idle compaction has shrunk that
context to a summary by then. It keeps B's drift and compaction, which A
and C shed by starting fresh.

The crew talk's four questions stand open here: how long a role may take
to answer, which shape the roles the operator talks to take, whether cost
is part of the reason for the move, and who decides when a session runs,
the control plane alone or flume on its own as well.

## Still open

- Whether a session meant to run headless ever hibernates, or only a
  conversation with a person. The operator: "I don't know if that applies
  to sessions that are meant to be autonomous though."
- What a hibernating session is in flume's status, and how Boomdrive's
  cloud lists it and hibernates or resumes it.
- How a resumed agent's first prompt passes Claude Code's "Resume this
  conversation?" dialog, which flume never answers for a person (34): a
  setting of the program's that keeps it shut, or a resume that sends no
  prompt until the agent waits.
- The crew talk's four questions, above.
- Moving a hibernating session to another host. flume keeps a place's state
  on one host (73).
- Account health as a signal that moves sessions (the notes' millpond
  signal).
