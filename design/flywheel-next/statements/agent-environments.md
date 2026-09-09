# Agent environments: a statement of invariants

The concern is one: how the environment of an agent session is managed.
A session runs on a host, in a place, and the machinery hands it an
environment: the instructions and skills it reads, the settings its
agent program reads, the tool servers it may call, the credentials
those need, the model class it runs under, and what it may see of other
sessions. This statement says what is always true of that environment
and what is never done to it.

Part one is what must hold of the environment on its own. Part two is
what it requires across its two seams, the agent program and the tool
server. Neither part names a mechanism: no file, path, directory,
protocol, product, process, header or tool. A reader who has never seen
the current code must be able to design the whole of it from those two
parts alone. Real tools are named only in the environment givens, as
facts of the surroundings rather than as choices.

A number in parentheses cites a clause of `flywheel-next/requirements.md`
that the clause restates or extends. A clause marked **(new)** states
something the requirements do not yet say.

## 1. Purpose

A session does one job well only if everything it reads is something
the machinery chose to give it. The environment is that choice: made
once, written down, versioned, reproducible on any host. Managing it
well means the operator can say of any finished session what it was
given, of any running host what it is paying for, and of any refusal
which part was missing, without opening a pane and without trusting
anything that happens to be lying around on the machine.

## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **operator** | which parts a host provides; which instructions, skills and model classes are in force; which tool servers exist and what each is for; where a credential comes from and when it is placed | nothing is required of the operator for a session whose environment is already complete |
| **the machinery** | what each session is given, from the declarations in force; when to provision, start, watch and stop a part of a host; what to refuse and what to report | it never invents a part, never grants a session reach beyond its enumeration, never places a credential, and never reads a configuration kept by a person for their own use |
| **a host** | nothing on its own; it provides the parts it declares and reports their state | it never varies what a session is given by anything local to it |
| **an agent session** | how to do its one job with what it was given | it never adds to its own environment, never starts a part of the host, and never reaches a part its environment does not name |
| **a tool server** | how it answers a call it is given | it never widens what a caller may reach, and never decides who a caller is |

## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **session** — one agent process working one job in one place, with a
  bounded goal and a fixed set of ways to end (glossary, 65).
- **host** — one long-running process of the machinery on one machine,
  with its own identity, root, and declaration of what it takes and
  what it provides (147, 149, 232).
- **place** — a working copy the machinery prepares for one session off
  one line (glossary, 43).
- **work order** — the whole of what one session is handed when it
  starts, rendered from data and from nothing else (226).
- **environment** — everything a session reads or may reach that the
  machinery chose for it: its instructions, its skills, the settings
  its agent program reads, the tool servers it may call, the identity
  it calls with, and the model class it runs under.
- **instruction** — data that shapes what a session writes, held apart
  from the engine and changeable without a code change (119).
- **skill** — the data for one session type saying how that type works
  its job (88).
- **setting** — one value shaping how a part behaves, declared for a
  host or a session type rather than discovered from the machine it
  runs on (32, 149).
- **tool server** — a part that offers a session operations beyond its
  own place, reached by call rather than by file.
- **credential** — a secret that admits a caller to something outside
  itself, placed by a person and never by an agent (204, 207).
- **model class** — the class of model a session runs under, declared
  by its type or its stage (285).
- **package** — one thing of one kind a host or an instance installs to
  gain a part, declared with its configuration and its secrets (228).
- **part** — anything a host provides that a session's environment
  depends on, gained as a package and watched by the host.

## 4. Part one: what must hold of the environment

### E.1 The environment is written, never inherited

1. Everything an agent program reads that shapes what a session does is
   written by the machinery for that session before the session starts
   (183).
2. The machinery never reads and never writes a configuration a person
   keeps for their own use. A person working on the same machine as a
   host changes nothing about any session running there (183, new in
   the second sentence).
3. Two hosts under the same declarations hand identical environments to
   sessions of the same type. Nothing about a machine, the habits of
   whoever uses it, or the order in which it was set up changes what a
   session is given (183).
4. The environment a session is given is fixed when the session starts
   and never moves under it. A change to any part of it reaches only
   sessions started after the change (88, 123).
5. A session never adds to its own environment. Anything it would need
   and does not have is an exit, never an acquisition (65, 66).

### E.2 The environment is enumerable, closed and versioned

6. Every session type's environment is one enumeration, stated as data,
   naming every part in force for that type and what it must never
   receive (226, 89).
7. Nothing reaches a session that its enumeration does not name (89).
8. Every part of the environment carries a version, and a session
   records the versions it was given, so a session started before a
   change and one started after are told apart by their records alone
   (88, 123, 224).
9. A test renders the whole environment for a given session type,
   version and scenario, without starting a session (90, 124).
10. A session type whose enumeration is incomplete is never charged
    (226).
11. Changing which parts a type is given is a change to data, worked as
    a small fix, never a change to the engine (91, 119, 123).
12. No behavior of the machinery depends on the wording of an
    instruction or the content of a skill, only on which versions were
    in force (119).

### E.3 Tool servers

13. A tool server is a part of the host, not a part of a session. A
    host runs exactly one of each server it declares, however many
    sessions run on it **(new)**.
14. No session starts a tool server, and no tool server is started per
    session or per place **(new)**.
15. The tool servers a session may call are part of its closed inputs,
    named in its enumeration and versioned like everything else there.
    A session reaches no tool server its environment does not name (89,
    226) **(new)**.
16. Tool servers never enter the bound on sessions running at once.
    That bound counts work in flight; a tool server is a fixed cost of
    the host and not work, so a host at its bound runs no more tool
    servers than a host running nothing (32, 214) **(new)**.
17. A host covers no work whose session type names a tool server the
    host does not provide, and it says so by name: which server, and
    which package would provide it (149) **(new)**.
18. Whether each declared server is running and reachable is the host's
    to watch and to report, like any other part it provides (81)
    **(new)**.

### E.4 Credentials

19. A credential is placed by a person and never by an agent (204,
    207).
20. A credential a part needs is held by the host that provides the
    part and never leaves it. A session reaches what the credential
    opens only through the part, and is never handed the credential
    itself **(new)**.
21. No credential travels in a work order, on a page, in an
    instruction, in a skill, or in anything a session reads or writes
    (207).
22. A session acts under an identity the machinery issues when it
    starts the session, scoped to that session's job, and valid for
    nothing else. No session, and no process of a host, holds a
    person's own credential (197, 251).
23. A part whose credential is not yet placed is reported as awaiting
    it, and work that needs the part waits visibly rather than starting
    and failing (207, 229).

### E.5 Isolation between sessions

24. A part shared between sessions never widens what a session may
    reach. What a session may reach through a shared part is exactly
    what its enumeration already names (89, 96) **(new)**.
25. Every call a session makes to a shared part carries that session's
    identity, and a part that cannot establish the identity of a caller
    refuses the call (197) **(new)**.
26. A shared part that keeps anything per caller keeps it disjoint by
    identity. Two sessions on one host never see each other's objects
    through a part they share **(new)**.
27. A shared part that cannot tell its callers apart holds nothing a
    session leaves behind, and is given only what every session on that
    host may see **(new)**.
28. What a session leaves in its place is its work, never environment
    and never state, and no session is given another session's place
    (43, 67).
29. Sessions never reach each other, directly or through a part they
    share (197).

### E.6 Hosts and machines

30. Everything a session's environment depends on is a declared part of
    the host, gained the way every other part is gained and recorded
    the way every other part is recorded (228).
31. A host's parts, their kinds and their state are shown on one
    surface, apart from the operator's decisions about work (229).
32. Several hosts run on one machine, each providing its own parts and
    told apart by identity alone, sharing nothing that any scenario
    about a single host would have to reach across (232).
33. Every session runs under a model class its type or its stage
    declares, and the class is part of the enumeration like any other
    part of the environment (285, 226).
34. The machine a host runs on is never a source of environment. A part
    that a host has not declared is not available to a session on that
    host, even when the machine could provide it **(new)**.

### E.7 Provisioning and attention

35. Adding, changing or removing a part is one operator response, and
    the machinery performs it as effects with proofs, so performing it
    again changes nothing (204, 229).
36. A part that is declared and not running, or declared and awaiting a
    credential, is under attention, never a silent wait (81, 149, 229).
37. A refusal to start work names what was missing and what would
    supply it, and is recorded with the work it refused (79, 149).
38. The machinery never grants a session a part that no declaration
    covers, and never withholds one that every declaration in force
    names (actor table).

## 5. Part two: what this requires across its seams

Two relationships cross the boundary. One is the agent program that a
session is: the machinery starts it and it reads what it is given. The
other is the tool server: a part of the host that sessions call. Both
are named here in abstract terms only.

### The agent program

The machinery requires four things of it.

39. It can be started for one place with one written environment and
    named so that the running program and the session are the same
    thing to anyone looking (43, 196).
40. It reads the environment it is handed and consults no other source
    of instruction, setting or reachable part, whatever sources it
    would otherwise look in (183).
41. It accepts the whole of what an enumeration may carry: the
    instructions, the skills, the tool servers, the identity to call
    with, and the model class (226, 285).
42. It reports its exit through the machinery's own way of reporting,
    so nothing downstream depends on what the program itself keeps
    (67, 173).

The guarantee it must give: what the program reads is exactly what was
written for it, and a program that cannot be confined to that is not
one the machinery starts.

### The tool server

The machinery requires five things of it.

43. One running copy serves every session on the host that declares it
    **(new)**.
44. Every call carries a caller identity the server can check, and a
    call it cannot attribute is refused (197, 249).
45. Anything it keeps per caller is separated by that identity, or it
    declares that it keeps nothing and sees only what every session on
    the host may see **(new)**.
46. It offers a catalogue that can be read and compared against the
    enumeration that named it, so a session's reach can be checked
    without calling anything (193a, 226).
47. It reports whether it is running and whether it is reachable, as
    evidence the host reads (81).

The guarantee it must give: the server is a way to reach what the
session's enumeration already names, and never a way to reach anything
else.

## 6. How the seams are bound

Not stated here. Which agent programs and which kinds of tool server
satisfy these seams, and how, is exactly what the model derived from
this statement is for.

## 7. Global invariants

- **I1.** Nothing a session reads or reaches comes from anywhere but
  the environment the machinery wrote for that session.
- **I2.** Every part of an environment is named in an enumeration,
  carries a version, and can be rendered in full without starting a
  session.
- **I3.** A session's reach is exactly what its enumeration names, and
  no part shared with another session widens it.
- **I4.** A part that is missing, down, or awaiting a credential is a
  decision under attention, never a silent wait and never a failure
  discovered by a session.

## 8. Non-goals

- Confining a session from the machine it runs on. This statement says
  what the machinery gives a session, not what an operating system
  prevents a session from taking.
- Performance. One copy of a part per host is an invariant about
  identity and cost, not a throughput target.
- Replacing the agent programs or the model providers.
- Multi-operator arbitration over environments. One operator decides
  what is in force.

## 9. Environment givens

Constraints of the world, not design choices.

- Agent sessions are terminal processes started and observed through a
  multiplexer, one agent program per pane. The agent programs in use
  are Claude Code and Codex.
- Each agent program reads its instructions, its settings and its list
  of tool servers from files, at locations the program fixes and the
  machinery does not choose. Both programs admit being pointed at a
  written set and told to read nothing else, and this is the only
  property of them the statement leans on.
- Tool servers speak the model context protocol, over a process pipe or
  over a network address. A given server may offer only one of the two.
- The operator's own machine carries the operator's own instructions,
  settings and tool-server lists, at those same fixed locations, for
  the operator's own use. A host may run on that machine.
- Working places are worktrees, and a process started in a place is
  bound to the life of the place, with its ports derived from the
  place.
- A host is a long-running process that can be restarted at any time,
  and there may be several hosts, including several on one machine.
- Secrets a host needs are held by the platform the host runs on, and
  the operator's own platform credentials are never stored.

## 10. Questions the model must answer

Not requirements; where the modeller's judgment is wanted.

- Is the unit that owns an environment the session type, the stage, or
  the session itself? Model class is declared per stage and tool
  servers per type; say whether that is one rule or two.
- Where does a written environment live relative to the place, what
  removes it when the place goes, and what proves it was never read
  from anywhere else?
- How does a change to an instruction, a skill or a server set reach
  every host, and what proves a host has it before charging a session
  under it?
- What is the evidence that a declared part is running and reachable,
  who reads it, and how does a part that dies mid-session appear to the
  operator?
- Should a tool server that cannot distinguish its callers be admitted
  on narrow terms, or refused outright?
- May two hosts on one machine share one copy of a part, or does each
  provide its own?
- How does a session's identity reach a part it calls without ever
  resting where the session's work is written?
- What is the smallest versionable thing here: a whole environment, or
  each part in it?

## 11. Scenarios the model must satisfy

- **S1.** A host set to run two sessions at once declares three tool
  servers. The operator counts the running servers with no session
  going, with one, and with both, and the count is three every time.
- **S2.** The operator changes an instruction while work is in flight.
  Looking afterwards at one session that started before the change and
  one that started after, the operator can tell which ran under which,
  and the earlier session's record is unchanged by the edit.
- **S3.** Work arrives whose session type names a tool server the host
  does not provide. No session starts, nothing waits silently, and the
  operator sees one decision naming the server and the package that
  would supply it.
- **S4.** Two sessions run on one host and call the same tool server.
  The operator inspects what each left behind through that server and
  finds that neither can reach the other's.
- **S5.** The operator starts a second host in another folder on the
  same machine. It provisions its own parts, its sessions are unaffected
  by stopping the first host, and the instructions, settings and
  tool-server lists the operator keeps on that machine for their own use
  change nothing about either host's sessions.

## 12. What to deliver

A model of how a session's environment is composed, written,
provisioned, versioned and watched, in whatever form these invariants
call for, with each significant choice citing the clauses that forced
it. Where several designs satisfy the same clauses, say so and
recommend one. Where a fact is needed that this statement does not
give, list it as a question beside the clause it would sit next to.
