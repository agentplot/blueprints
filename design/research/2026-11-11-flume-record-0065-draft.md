---
number: 65
title: A stage whose kind hibernates it sleeps once its prompt cache no longer pays and resumes its own session at a message, and every message to a role waits at the role's address
status: proposed
date: 2026-11-11
decision-makers:
- Chuck Swanberg
---

# A stage whose kind hibernates it sleeps once its prompt cache no longer pays and resumes its own session at a message, and every message to a role waits at the role's address

This is a draft for agentplot/flume's `docs/adr/`, written in the research
place `research--a-session-sleeps-and-wakes` on agentplot/blueprints for
agentplot-design to carry there. Its statement is the amendment on that
branch at `101cc2b`, `5529cf6`, `5198749` and `3cb6f3f`.

Status: proposed, on the operator's words and choices of 2026-11-11 in that
talk, each quoted in `design/research/2026-11-11-a-session-sleeps-and-wakes.md`
on the same branch. Accepted once the operator has seen it as a record.

Deciders: the operator. Their words: "Call it hibernate and resume, and keep
it separate from the standard state machine concept. They're two different
ideas." "certain flume kinds will allow hibernation and resume while others
won't." "You're keeping it open as long as you're benefiting from the cache
and once you can't benefit from the cache anymore, you might as well
hibernate it." "if it's stuck waiting for an answer, it should be allowed to
hibernate and then be woken up when the answer comes". "flume can launch
these on demand but can also be configured with predefined standing
agents." On 2026-11-12, of a role's work: "I feel like that will fit a lot
better if those sub-agents are launched through flume", "launched as
related flume kinds, similar to ops", so that "the user would be able to
see everything in the multiplexer the same way they always would." Of
kinds a role's entry does not name: "I don't think we care to enforce
them". Of credentials: "we need to kick the can on this and assume that
the agents are running in environments I'm setting up ahead of time."
Their
choices: the host keeps transcripts by `cleanupPeriodDays`
and flume keeps no copy; a message to a hibernating session resumes it;
every message to a role waits as a delivery at its address; a delivery
reaches a live session by its program's own channel, a Claude Code mod
first; the verb is `message`, replacing `tell`; flume's MCP server messages,
wakes and reads a role; a role's
label is its room and its column; a standing role is a session flume keeps,
defined by a kind.

Sources: `agentplot/blueprints:design/flume/requirements.md` at `3cb6f3f`,
clauses 7, 32, 42, 43, 49, 53 to 56, 109, 132, 179, 180, 193, 198, 212 to
215, C.2, C.4, C.5, sections 9 and 10, I5, S6, S17, S124 to S128; records 0003, 0016,
0020 with its amendments, 0039, 0044, 0052 and 0061; rules core.10, core.13,
core.30 and core.32; on deneb on 2026-11-11, every account home's
`projects` a link to `~/.claude/projects`, no home setting
`cleanupPeriodDays`, the oldest transcript there last written 2026-10-13,
one Keychain item per home, and Plannotator 0.27.22's mod handing its
replies by `$.prompt.submit`; Claude Code 2.1.322's `idleCompaction`
setting, its "Resume this conversation?" dialog and its refusal of
`cleanupPeriodDays` below one.

## Context and problem statement

A conversation stays in its herdr pane until its caller finishes it (109),
holding its room and its account all day, and the operator leaves design
talks open for hours. flume already lets an agent kept open for an answer go
after an hour, the life of its prompt cache (198), and carries a lost
conversation at its caller's retry (49, 179; record 0052), but a stop and a
retry are the stage's state machine: a retry after a stop starts afresh,
and "no other retry carries one" (core.32). crew's standing roles, measured
over 30.7 hours, re-read 230,000 to 320,000 tokens of context on every call
and are typed into from several sides at once, half-typed words in their
input boxes cleared by herdr's ctrl+c (C.5).

## Considered options

1. Sleep as a caller's stop, and wake as a retry that carries the
   conversation, loosening core.32.
2. Hibernate and resume as acts of their own beside the state machine, a
   kind declaring the stages they apply to, the idle time the prompt
   cache's life.
3. A caller's act only, flume never hibernating on its own.

For transcripts: the host sets `cleanupPeriodDays` once; flume keeps its own
copy and restores it before a resume; flume owns a configuration home per
account. For a message to a busy session: typed by the terminal as today;
a delivery at the address taken at the session's next wait, by its
program's own channel; the control plane's queue. For a role's own
projects: its program's subagents, as its prompting asks; places it
launches of kinds its entry names. For an agent's credentials: a role's
own layer of variables; variables a launch names; the environment the
operator sets up on the host ahead of time.

## Decision outcome

Option 2, as the operator ruled. A stage whose kind hibernates it is
hibernated once its agent has been quiet for its hibernate time, at its
caller's `flume hibernate`, or at the end of its agent's keep-open wait for
an answer. Its agent is ended and its session kept, and its room and its
account are freed. A caller's `flume resume`, a message, a role's delivery
or the answer resumes that session on the account it ran under (212,
213). The host keeps transcripts (C.4). Every message and end for a role is
a delivery at its address, handed as one prompt at the session's next wait
by its agent profile's deliver part, a mod for Claude Code, the terminal
the fallback (43, 54, 214, 215). A standing role is a role whose kind's
stage is a hibernating conversation (193). A role's entry names the
kinds its session launches its projects as, which its prompt gives. A place a role launches naming no recipient
reports to the role's address (7, 132), so its ends join the role's
deliveries and resume it, and status gives a standing role's live places
(56, 214). An agent launches one by the command line or flume's MCP
`launch`. An agent's environment stays its account's, which the operator
sets up with the credentials its work needs (32, core.30). flume refuses no
kind a role's entry does not name; the entry names each with when it
serves, since a role finds no kind it is not told of (193). `tell` is
`message` (53 to 55).

### Why not the others

Option 1 is what the operator turned down: a stop and a retry restart a
step of a state machine, and a conversation left open all day is another
idea. Option 3 leaves every conversation holding its room and account past
the time its cache pays. A copy of a transcript is a file in a format flume
does not own and two copies that differ (record 0020, option 3), and a
configuration home of flume's writes where core.32 forbids it. Typing into
a busy session interleaves tasks and clears what a person typed; the
control plane's queue would put a second queue beside flume's deliveries
(record 0061). A program's subagents end with the turn that started them,
hold the role's account, and show in no pane, where a project runs past a
turn; they stay the role's for a lookup answered within one. A role's or
a launch's own variables, as the operator put it, wait on a managed
fleet's design: they need a place to keep secrets, a resolver and a rule
for which an agent may pass on, which no host has yet.

### Consequences

- Rules to amend: core.10, so a resume is one fresh agent of a start that
  counts none; core.32,
  for a resume's account and carry, its "no other retry carries one" still
  true of retries.
- The deliver row needs a Claude Code release that runs hooks modules: read
  on 2.1.322, and flume pins 2.1.296.
- Open: a resume's identity, and how a resumed Claude Code agent passes
  the "Resume this conversation?" dialog (section 10); how credentials
  reach an agent on a machine the operator does not set up.
- Elsewhere: the host's setup sets `cleanupPeriodDays` in every home
  (agentplot/boomdrive); crew's tells become deliveries, its roles move
  into a roles package, each entry naming its related kinds, and their
  instructions launch their projects as places (agentplot/crew); the
  control plane shows each role under its label's column with its live
  places, and its MCP tools answer later when they wake a role
  (agentplot/boomdrive-cloud).
