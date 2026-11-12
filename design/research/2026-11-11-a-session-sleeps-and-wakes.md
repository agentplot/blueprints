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
6. **A headless stage waiting on an answer hibernates, and its answer
   resumes it.** The operator: "if it's stuck waiting for an answer, it
   should be allowed to hibernate and then be woken up when the answer
   comes, right? The question is how likely it is that, if a system is
   functioning, it would not respond for an hour. That shouldn't really
   happen unless it went to a human and the human couldn't answer right
   away." Today such an agent is let go at the end of its keep-open time
   (198) and its answer starts a fresh agent with the question and the
   answer in its prompt (49); under this the answer resumes the agent's own
   session.
7. **The roles are Boomdrive's.** The operator: "we need to stop referring
   to these as crew roles. These are conceptually Boom Drive roles. Right
   now we're at an interim baby step to get to Boom Drive, where we're
   using crew as a stand-in control plane."
8. **Both the control plane and flume wake a role.** Asked whether the
   control plane alone decides when a role's session runs, or flume's own
   wake on an end pending for the role's address stands too (flume record
   0039), the operator: "I think the answer to the question, though, is
   both".
9. **A role may take tens of seconds or minutes to answer.** The operator:
   "I think for most usage, tens of seconds or minutes is fine."
10. **A person reaches a role through MCP, and the answer comes back
    later.** The operator: "the use case of a human talking to an actual
    agent probably involves them being in their own Claude Code with the
    flume MCP or in Boom Drive with an agent. There would be cloud-based MCP
    tools from Boom Drive [...] I don't think we were going to have agents
    in our cloud, just the MCP tools. Part of calling the MCP tool could
    involve it interacting with all of the data in the control plane. If it
    needed to find something out about actual code, it might ask an agent.
    If that were to happen, it would be asynchronous and the tool would
    need to report back: 'We've started the research agent or the planning
    agent. We're going to get an answer for you on that and we'll let you
    know.'"
11. **Standing roles are a generic pattern of flume's, configured per
    person.** The operator: "my list of standing agents may or may not be
    the right list for everybody. I'm wondering if it's a more generic
    pattern where flume can launch these on demand but can also be
    configured with predefined standing agents. That way flume knows when
    it's launching different kinds. It can tell the agents that are being
    launched about the personas of the standing agents, what their jobs
    are, and when to communicate with them. The nice thing about a standing
    agent is that it builds up some context, has an opinion, and knows how
    to answer certain questions." Their example is ops split by
    environment: "a dedicated agent tailored to work only with my
    production environment, and it has [...] specific prompting and
    rules. It has access to specific credentials and MCP servers. I also
    might have a dev and a QA ops agent with a different set of tools and
    credentials." The roles show in Boomdrive's columns, inception,
    construction and operation, and planning becomes "a standard standing
    planning agent and/or the design and review agent that we have now,
    configured in that generic setup in flume". A role that hibernates
    leaves the multiplexer: "I think that's fine, except it makes it hard to
    use without the cloud. [...] I think it's a generic flume design,
    especially if flume has an MCP server. You could be in your own
    standing agent talking to flume and telling it what your ideas are. It
    then wakes the design agent or the ops agent."
12. **A role's load is queued agent-neutrally, by one session per role.**
    The operator found standing agents "get overloaded. You're firing all
    kinds of stuff at them", and turned down two answers: Claude Code's own
    messaging, since "that then gets us too coupled to Claude Code and makes
    it harder to support other agent types", and several planners load
    balanced, "I don't think that's the right move." The queue itself is
    open.

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

Of the crew talk's four questions, the talk settled two, how long a role
may take to answer (9) and who decides when a session runs (8), and
turned the shape of the roles the operator talks to into Boomdrive's
roles as a pattern of flume's (11). Whether cost is part of the reason for
the move stays open.

## Roles in the written design

- **A source declares roles, and the host declares none.** A source the
  host declares may declare roles, each at an address on a declared
  stream, each run as one of the source's kinds or held by a standing
  agent; the source declares the words of what each role answers, which a
  stage's prompt gives, and the host locks the source's kinds and
  "declares nothing of its roles" (193). This talk's own prompt lists
  `design`, `ops` and `planner` with their words, from crew's roles file.
  A role may stand behind its stream as the answerer every stall reaches
  (193, 130).
- **flume wakes a role's run.** A settle that finds an end pending for an
  address with no run launches one, and `flume wake` does the same on a
  caller's word; a run's entry gives its kind, repository, name, intent
  and agents' settings, model and effort among them (flume records 0039,
  0044).
- **Ends already queue; tells do not.** A place's ends are weir deliveries,
  pending for each recipient until it confirms them, collected by
  `flume inbox`, and a notice of one goes into a pane only while the agent
  there asks no question (43; flume record 0061). A tell is typed into the
  agent's pane once it waits, within a bound (53, 54).
- **flume's MCP server reads and acts on nothing.** `flume mcp` serves one
  tool, `status`, which settles nothing (57, 60).
- **An agent's environment is its account's.** "its environment is the
  login environment with its account's variables over it, and nothing else
  gives one" (core.30). A role's own credentials have no layer today. Its
  own settings, MCP servers among them where the program takes them so,
  reach it by a file in the place's own folder (196).
- **Boomdrive's board has four fixed columns.** Inception, Bolt plan,
  Construction and Operation, for every customer, which a member may
  filter, colour or group and never add to or rename (boomdrive-cloud
  core.76, record 0034).
- **The cloud keeps no code, and its dispatch agent is its own
  principal.** A member's MCP client and the dispatch agent speak to drives
  for a person, each acting as its own principal, and every write either
  proposes is made once its member confirms it (boomdrive-cloud record
  0011, core.24, core.113). The cloud keeps no code (core.4). An agent that
  reads code runs on a host, which the cloud reaches only through the
  runner.
- **Deciding what to launch is no part of flume's work.** Deciding what to
  launch, what matters most or what comes next is its callers' (section 8),
  and which questions a role's run answers or passes on is the run's
  (193).

## Still open

- How a role's work is queued so a standing role is not overloaded,
  agent-neutrally (12).
- Where Boomdrive's roles are declared: a package of their own that any
  control plane declares as a source the host locks (193, and the crew
  talk's recommendation for where the recipes live), or flume's own host
  configuration, which 193 keeps out of roles.
- Whether flume's MCP server gains tools that tell or wake a role, so a
  person's own session reaches a role through it (10, 11).
- A role's own credentials and MCP servers, which core.30 gives no layer.
- What a hibernating session is in flume's status, and how Boomdrive's
  cloud shows a role in its columns and hibernates or resumes it.
- How a resumed agent's first prompt passes Claude Code's "Resume this
  conversation?" dialog, which flume never answers for a person (34): a
  setting of the program's that keeps it shut, or a resume that sends no
  prompt until the agent waits.
- The crew talk's four questions, above.
- Moving a hibernating session to another host. flume keeps a place's state
  on one host (73).
- Account health as a signal that moves sessions (the notes' millpond
  signal).
