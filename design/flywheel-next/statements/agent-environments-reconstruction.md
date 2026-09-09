# Agent environments: a model reconstructed from the statement

## The form chosen

The invariants ask for three things at once, and no single form carries all three. Part one is mostly about data: an enumeration per session type, parts that carry versions, a record per session, a declaration per host (clauses 6, 8, 30, 31). That is a data model. E.3, E.6 and E.7 are about parts of a host that are declared, provisioned, watched and put under attention, and about an environment that is rendered, fixed, recorded and removed (13, 18, 23, 35, 36, 4, 28). Those are lifecycles. Part two is about two boundaries the machinery does not own, with obligations on each side (39 to 47). Those are seam contracts, closer to a protocol than to a component diagram.

So the model below is a data model at the centre, two lifecycles hung on it (a part on a host, and an environment for a session), and two seam contracts, with a walk through the five scenarios at the end. I considered a component and deployment model and rejected it as the primary form: the statement fixes almost nothing about topology beyond one host per long-running process and several hosts per machine (32), and a box diagram would invent structure the clauses do not force. I considered a pure protocol and rejected it because the weight of the statement is on what is written and enumerated before anything speaks, not on the speaking. I considered a resource inventory per seam alone and kept it as a section rather than the whole, since the inventory only makes sense once the data it is drawn from is defined.

Terms added by this model, as the vocabulary permits: **declaration set**, **manifest**, **written set**, **gate**, **connector**, **coverage**. Each is defined where it first appears. None redefines a term the statement owns.

## 1. Data model

### 1.1 The declaration set

Everything the operator decides lives in one versioned body of data, the declaration set. It is data and nothing else (6, 11, 12): no engine change is needed to alter it, and the machinery's behaviour depends only on which versions of its contents are in force, never on their wording (12).

The declaration set holds these kinds of record. Every record has an identity and a version.

- **Instruction.** Content that shapes what a session writes (61 to 62 in the vocabulary, clause 8). Versioned by content: the version is a digest of the content, so two hosts holding the same instruction hold the same version by construction (3).
- **Skill.** Content for one session type, saying how that type works its job (63 to 64). Versioned by content, tied to a session type.
- **Setting.** One key and one value, scoped to a host or to a session type (65 to 67). Versioned by content. A setting is never discovered from a machine (65, 34).
- **Model class.** A name for a class of model, with whatever the agent programs need to select it (72 to 73, 33). Versioned by content.
- **Tool server declaration.** The name of a server, the kind of transport it offers (pipe or network, from the givens), the package that provides it, the catalogue the operator expects it to offer, the operations of that catalogue that may be reached at all, the credential slots it needs (names only, never values), and one of two separation claims: separates per caller, or keeps nothing per caller (13, 15, 17, 45, 46, 20). Versioned by content.
- **Package.** One thing of one kind that a host installs to gain a part, with its configuration and the names of the secrets it needs (74 to 75, 228 by citation). Versioned by content, and additionally by the version of the thing it installs.
- **Session type enumeration.** For one session type: the instructions, skills, settings, tool servers (each with the subset of operations that type may reach) and, unless a stage supplies it, the model class; plus a denial list naming what that type must never receive (6, 33). The enumeration also names the machinery's own reporting part, which every type carries (42). Versioned by content.
- **Stage declaration.** For one stage: the model class sessions at that stage run under (33, 285 by citation). Versioned by content.
- **Host declaration.** For one host: its identity, its root, the bound on sessions in flight it takes, and the parts it provides, each as a package reference with the placement source for each credential slot (host vocabulary, 147, 149, 232 by citation; 16, 30).

The declaration set as a whole carries a **revision**: a single monotonic mark that advances whenever any record changes. A record's content version says what it is; the revision says when it was in force. Both are recorded (8, S2). Recommendation on the statement's last question: the smallest versionable thing is each part, by content digest, and the environment as a whole is versioned by the tuple of part versions plus the revision it was rendered under. Versioning only whole environments would satisfy clause 8 but would make S2 unable to say which part changed; versioning only parts would satisfy clause 8 but leave no single mark for "what a host has" (question 3 of the statement). Both together answer both.

### 1.2 The unit that owns an environment

The statement asks whether the session type, the stage or the session owns the environment. This model's answer is one rule with two inputs. The session type owns the enumeration (6). The rendered environment belongs to one session and is a pure function of (session type enumeration, stage declaration, revision, scenario), where the stage contributes exactly one thing, the model class, and nothing else (33). This is one rule, "render the type's enumeration at a revision, taking the model class from the stage when the type defers to it", not two. It keeps clause 6 literal (one enumeration per type) while admitting clause 33's "type or stage". A type either fixes its model class or defers it to the stage; it never does both.

### 1.3 The manifest and the written set

Rendering produces two things for one session.

The **manifest** is the record of what the session was given: the session identity, the type, the stage, the host identity, the place identity, the revision, and for every part its identity, kind, version and content digest, plus the tool servers as the host resolved them (which server, which operations, and how the connector is reached, never a network secret), the model class, and the denial list. The manifest is written to the session's record before the session starts and is never rewritten (4, 8). S2 is answered by comparing two manifests.

The **written set** is the manifest made concrete for the agent program: the instruction and skill content, the settings in the shape the program reads, the tool server list pointing at that session's connectors, and the model class in the program's own setting. It is what the program is pointed at and told to read exclusively (given; clauses 1, 40). It contains no credential (21) and does not contain the session identity in any form the program would copy into its work (question 7 of the statement; see 3.3).

Where the written set lives (the statement's second question): under the host's root, in a location keyed by session identity, and never inside the place. Clause 28 says what a session leaves in its place is work and never environment; a written set inside a worktree is a set of untracked files that the session's own work could sweep up, and that alone rules it out. The written set is removed in the same effect that removes the place, so the two never outlive each other; the manifest survives both in the session's record (8). An alternative that satisfies the same clauses is a sibling location next to each place, removed with it; it is rejected only because it spreads the machinery's files across the machine and makes "every session's written set on this host" harder to enumerate on one surface (31).

What proves the program read nothing else: three things, none of them confinement (non-goal). The start of the program records the exact pointing and the "read nothing else" directive as part of the session record (39, 40); the manifest digest of what was written is recorded before start (8); and the rendering test of clause 9 shows that the same inputs produce the same written set on any host (3, 9). Anything stronger needs operating-system confinement, which the statement declines to require; this is listed as a question at the end.

### 1.4 The session identity

The machinery issues one identity per session when it starts the session, scoped to that session's job and valid for nothing else (22). It is not a credential in the statement's sense: the vocabulary reserves credential for a secret a person places, and the identity is issued by the machinery. It carries: the session identity, the type, the host identity, the revision, and an expiry tied to the session's life. Every call a session makes to a shared part carries it (25, 44). It is never written into the place, never written into the written set in a form the program forwards, and never appears in the manifest as a secret; the manifest records that an identity was issued and its identifier, not the material a caller presents.

### 1.5 Host state

The machinery keeps, per host, a state record that the host reports on one surface (31, 18):

- The revision of the declaration set the host currently holds, and whether it is the revision in force.
- For each declared part: its package version installed, its lifecycle state (section 2.1), the evidence behind that state with its age, the last catalogue read and whether it matched the declaration, and the credential slots with each one marked placed or awaiting.
- Sessions in flight and the bound; tool servers, gates and connectors are not counted (16).
- Attention items: every part not running, not reachable, or awaiting a credential, and every refusal of work, each naming what is missing and what would supply it (36, 37, I4).

### 1.6 The session record

Per session, kept apart from the place and outliving it: the manifest, the identity issued, the exact start of the program, every refusal or coverage decision that preceded the start, the reported exit (42), and the effects that removed the place and the written set. Nothing in it depends on what the agent program keeps for itself (42).

## 2. Lifecycles

### 2.1 A part on a host

States, with the evidence that moves a part between them. Every transition is an effect with a proof, performed by the machinery, so performing it again changes nothing (35).

1. **Declared.** The host declaration names the part. No package yet installed.
2. **Provisioning.** The package is being installed. Proof: the installed thing exists at the declared version. A failed install is an attention item naming the package.
3. **Awaiting credential.** One or more credential slots are empty. The host reports the part as awaiting, by slot name (23, 36). Nothing starts; nothing fails; work that needs the part waits on the attention surface, not in a session (23, I4). Placement is a person's act into the platform that holds the host's secrets (19, given); the host learns of it by reading its slots, never by being handed the value through the machinery.
4. **Starting.** The host starts the one copy of the server and its gate (13, 43). A pipe-only server is started by the host and held open behind its gate; it is never started by a session or per place (14). Proof: the process exists.
5. **Running.** Liveness evidence is fresh: the process exists and answers.
6. **Reachable.** Reachability evidence is fresh: the gate can read the server's catalogue, and the catalogue matches the declaration (46, 47). Only a reachable part counts toward coverage (section 2.2).
7. **Unreachable** or **down.** Evidence is stale or failed. Attention item, naming the part and the sessions in flight whose enumeration names it. The host restarts it as an effect (35). Sessions that call it in the meantime are refused at the gate with a named reason, and a session that cannot continue takes its fixed exit for a missing part (5). The operator sees the death on the host surface before any session reports it (I4).
8. **Removed.** Operator response removes the declaration; the machinery stops the copy and uninstalls the package (35).

Who reads the evidence: the host, and only the host, for its own parts (18, 47). What the evidence is: process presence, a catalogue read through the gate, and the gate's own recent call outcomes. The operator reads the host's report, never the part directly (31).

Two hosts on one machine each provide their own copy of every part they declare (32, S5). Sharing a copy would make stopping one host affect the other's sessions, which S5 forbids. Their listening addresses are derived from the host identity and root, the way a process in a place derives its ports from the place (given), so two hosts never collide. This is a choice the givens only half-specify and is raised as a question.

### 2.2 An environment for one session

1. **Work arrives** naming a session type and a stage.
2. **Coverage.** The host checks that it holds the revision in force, that the type's enumeration is complete (every reference resolves; 10), and that every part the enumeration names is provided by this host and currently reachable (17, 34). Coverage is a pure check over the declaration set and host state, needing no session. If it fails, the machinery refuses: no session starts, the refusal names each missing part and the package that would provide it, and the refusal is recorded with the work (17, 37, S3). A type whose enumeration is incomplete is never charged (10).
3. **Identity issued** (22).
4. **Render.** The manifest and the written set are produced from the enumeration at the revision, the stage, and the scenario, and the manifest is written to the session record (8, 9). Rendering is the same function the clause 9 test calls, so the test and the real start cannot drift.
5. **Place prepared** off one line (place vocabulary).
6. **Connectors started**, one per tool server the enumeration names, in the place so they die with it (given), each carrying the session identity at its own start and speaking only to its server's gate (section 3.3).
7. **Program started** for the place, pointed at the written set, named so that the pane and the session are the same thing to anyone looking (39). The exact start is recorded.
8. **Running.** The environment does not move (4). A change to the declaration set advances the revision and reaches only sessions rendered afterwards. Nothing the session does can add to its environment; anything missing is an exit (5).
9. **Exit reported** through the machinery's reporting part, then observed by the machinery through the pane (42).
10. **Place and written set removed** in one effect; connectors die with the place; the manifest and the record remain (28, 8).

How a change reaches every host (the statement's third question): the declaration set is a versioned store the hosts pull from; a host records the revision it holds; a session is charged only under a revision the host holds, and the manifest cites that revision. The proof a host has the change is the host's own state record naming the revision, read on the host surface (31). Pushing changes to hosts would satisfy the same clauses; pulling is recommended because a host can be restarted at any time (given) and must be able to recover its revision on its own.

## 3. Seam contracts

### 3.1 What the machinery holds on its side of both seams

Two small pieces of the host sit between the seams and are neither agent program nor tool server. They exist because the givens say tool servers speak a protocol over a pipe or a network address and may offer only one of the two, while clauses 13, 14, 25 and 44 require one copy per host, identity on every call, and refusal without identity, none of which a third-party server can be assumed to do.

A **gate** is one host-side process per declared tool server, standing in front of the server's single copy. It checks the identity on every call and refuses a call without one (25, 44); it filters calls to the operations the caller's type enumeration names, so a shared server never widens a session's reach (24, 15); it reads the server's catalogue and reports liveness and reachability to the host (46, 47); and for a pipe-only server it is the one holder of the pipe. A gate keeps nothing per caller itself. It is not a tool server: it offers no operations of its own and has no catalogue.

A **connector** is one process per session per named server, started in the place with the session identity handed to it at its own start, presenting itself to the agent program as that program's pipe-shaped tool server and forwarding every call to the gate with the identity attached. It holds no state, offers no catalogue of its own, and dies with the place. It is not a tool server in the statement's sense, and it is not counted in S1; whether the statement accepts that reading is listed as a question.

An alternative that satisfies clauses 25 and 44 for network servers only is to write the identity into the written set as a header the program attaches itself. It is rejected because it puts the identity into a file the session reads (question 7 of the statement), because it cannot serve pipe-only servers at all, and because it leaves identity checking to each third-party server. The gate and connector give one uniform path for both transports and keep the identity out of anything the session reads or writes.

### 3.2 The agent program seam

The machinery requires of an agent program (39 to 42):

- **Start.** It can be started in a place, pointed at a written set at the locations the program fixes, told to read nothing else, and named so the pane and the session coincide. The givens say both programs in use admit this, and it is the only property of them this model leans on.
- **Exclusivity.** It consults no instruction, setting or tool server list other than the written set, whatever it would otherwise look in on the machine. The operator's own copies at the fixed locations are never read (2, 40, S5).
- **Acceptance.** The written set can carry everything an enumeration may: instructions, skills, settings, the tool server list (as connectors), and the model class in the program's own setting (41). The machinery maps the model class to each program's setting at render time; the class is named once in the enumeration and translated per program.
- **Reporting.** The program's exit is reported through the machinery's reporting part, itself a tool server every enumeration names, called with the session identity like any other (42). Nothing downstream reads what the program keeps.

Guarantee received: what the program reads is exactly the written set. Admission: a program that cannot be started this way is not one the machinery starts.

### 3.3 The tool server seam

The machinery requires of a tool server (43 to 47), and provides through its gate what the server cannot:

- **One copy.** The host runs exactly one, behind one gate, for every session on the host (13, 43). It is a fixed cost, outside the bound on sessions (16).
- **Identity.** The gate attributes every call. A server that separates per caller receives the identity with each call and keeps its per-caller objects disjoint by it (26, 45). A server that keeps nothing per caller is admitted on narrow terms (the statement's fifth question): it must declare that it keeps nothing, and it is given only credentials and reach that every session type the host covers may see (27). The host verifies at provisioning that the operations and reach declared for such a server fall inside every enumeration the host covers, and refuses to provision it otherwise. Refusing such servers outright would also satisfy the clauses; admission on these terms is recommended because a read-only server with no per-caller state is common and useful, and clause 27 already describes the terms.
- **Catalogue.** The server offers a readable catalogue; the gate compares it against the declaration at provisioning and on every reachability check, and a mismatch is an attention item (46).
- **Evidence.** Liveness and reachability are read by the gate and reported by the host (47, 18).
- **No widening.** The gate admits only the operations the caller's type names; the server never decides who a caller is (24, actor table).

Guarantee received: the server is a way to reach what the enumeration names and nothing else.

## 4. Inventory per seam

What crosses from the machinery to each side, and what comes back.

To the agent program: a place; a written set (instructions, skills, settings, connector list, model class setting); a name; the start directive. Back: the exit report through the reporting part; the pane's observable end.

To the tool server: its package and configuration at install; its credentials from the platform's secret store into the host process that starts it, never further (20); each call with the caller's identity, filtered to named operations. Back: a catalogue; call answers; liveness and reachability evidence.

To the operator, on one surface (31): host revision and whether it is in force; every part's state and evidence; credential slots placed or awaiting; sessions in flight against the bound; attention items with what is missing and what would supply it. From the operator: declaration set changes, each one response, each performed as idempotent effects (35).

## 5. The scenarios

- **S1.** Three tool servers declared, bound of two sessions. The host runs three copies and three gates regardless of sessions; connectors come and go with places and are not tool servers. The count is three every time (13, 14, 16, 43).
- **S2.** An instruction changes; the revision advances. A session rendered before cites the old instruction version and revision in its manifest; one rendered after cites the new. The earlier manifest is never rewritten (4, 8).
- **S3.** Work names a type whose enumeration names a server this host does not provide. Coverage fails before anything starts; one refusal is recorded with the work and shown as one attention item naming the server and the package (17, 37, I4).
- **S4.** Two sessions call the same server. Each call reaches the gate through that session's connector with that session's identity; the server separates per identity, or has declared it keeps nothing. Neither session can name the other's identity, so neither can reach the other's objects (25, 26, 29).
- **S5.** A second host in another folder on the same machine has its own identity, root, revision, parts, gates and addresses. Stopping the first stops nothing of the second. Neither host's rendering ever reads the operator's own files at the fixed locations; the programs are pointed at written sets and told to read nothing else (2, 32, 40).

## 6. Questions the statement leaves open

Each is placed beside the clause it would sit next to.

1. Beside clause 6 and 33: what is a stage, and is it a property of the work order, of the type, or of the line the place is prepared from? The model treats it as an input to rendering that supplies only the model class.
2. Beside clause 9: what is a scenario in "type, version and scenario"? The render function takes it as an input, but nothing says what varies with it.
3. Beside clause 14 and the pipe-transport given: does a per-session connector that holds no state and offers no catalogue count as "a tool server started per session"? The model says no, and S1's count depends on that reading.
4. Beside clause 16: are the machinery's own per-session processes (connectors) counted anywhere, or only agent sessions?
5. Beside clause 17: where does the mapping from a server name to the package that would provide it come from? The model puts it in the tool server declaration; it could instead be a separate catalogue of packages.
6. Beside clause 19 and 23: how does a host learn that a credential slot has been placed, by reading the platform's store on a schedule or by being told? And is the placing itself recorded anywhere the machinery can see?
7. Beside clause 22 and the secrets given: a host must authenticate to the platform to read its secrets. What does it authenticate with, and how is that not "a process of a host holding a credential"?
8. Beside clause 22: does a session identity end at exit, and may a resumed or continued session receive the same identity or must it receive a new one?
9. Beside clause 26: when a server's per-caller objects live in an external system it reaches with the host's credential, must the separation be enforced inside that external system, or only at the server?
10. Beside clause 27: is "what every session on that host may see" the intersection of the enumerations of every type the host covers, computed by the machinery, or a separate declaration the operator writes?
11. Beside clause 28: is a written set permitted inside the place if it is removed with the place, or must it be outside? The model puts it outside.
12. Beside clause 30 and 33: is a model class a part in the provisioning sense, with a package and a credential slot for the model provider? The givens say the agent programs are Claude Code and Codex, which carry their own provider access; nothing says whether that access is a credential the host holds (20) or something the program brings, which would contradict clause 2 and 40.
13. Beside clause 32 and the ports given: ports are derived from the place for processes started in a place. Tool servers are not in places. From what are their addresses derived, and who guarantees two hosts on one machine do not collide?
14. Beside clause 35: what counts as a proof of a package install, and what is the proof for removal?
15. Beside clause 36 and I4: when a part dies mid-session, which of a session's fixed ways to end does it take, and does the machinery end the session or wait for it to notice?
16. Beside clause 40: are all settings a program reads part of the enumeration, including ones that shape nothing about the job (appearance, key bindings), or only those the statement calls settings?
17. Beside clause 42: is the machinery's own reporting a tool server subject to clauses 43 to 47, as the model assumes, or a separate channel?
18. Beside clause 44: does the obligation to check identity fall on the server itself or on the host's gate in front of it? The model places it on the gate; a strict reading puts it on the server, which would exclude every third-party server.
19. Beside clause 46: does an enumeration name a tool server whole, or individual operations of its catalogue? The model names operations so the gate can filter; the statement says only "server".
20. Beside clause 10: what does "charged" mean and who does it? Is there a component above the hosts that assigns work, or does each host pull work and charge itself?
21. Beside clause 2: does "a configuration a person keeps for their own use" include the operator's entries in the platform's secret store, and where is the line between a placed credential and a personal configuration?
22. Beside clause 40 and the non-goals: what evidence satisfies "a program that cannot be confined to that is not one the machinery starts", given that operating-system confinement is out of scope?
23. Beside clause 3: may an instruction be shared across session types with one version, or is every part owned by one type?
