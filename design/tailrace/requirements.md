# tailrace — requirements
<!-- ANCHOR: preamble -->

A statement of what tailrace must always do and never do, written to
admit any model that satisfies it.

The statement is in three parts. Part A is what must hold of tailrace
on its own: what an artifact is and how it is named, what a claim about
one is and who may make it, how a landing becomes a publish and a
publish a version, how an offered artifact is accepted and released,
how a channel moves and an environment follows it, how a consumer
reads, and what tailrace keeps. Part B is its contracts: the operations
it needs across its eight seams, and the guarantee each must give. The
seams are the store, the build, the landing, the signer, the policy, the
ledger, a projection and a target. Part C is the profiles: the ways each contract
is satisfied.

Parts A and B name no mechanism: no command, file, format, field,
registry, service or tool. One thing of the world they name freely,
because section 9 fixes it: git. Every other real tool is named only in
section 9 and in Part C. A reader who has never seen a package registry
or a deployment tool should be able to design from Parts A and B and
git alone.

## 1. Purpose

tailrace carries what a build left into a store the owner controls, and
from there to everyone and everything that runs it. After a landing, it
packages what the build left, names each piece by its content, attaches
to each piece the claims made about it, and offers the set as one
version. A gate accepts what the claims and the policy admit; a
promotion moves a channel to an accepted version and records the move;
an environment that follows the channel converges on it. A consumer
reads an artifact in its ecosystem's own form, and only one the policy
admits. The same content-addressed store holds a build's cache, the
artifacts, and the record of what was released, so the bytes that
passed the checks are the bytes that run, and tailrace never builds
twice to make them so.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **the repository's authors** | which components the repository publishes, what each holds and in which ecosystem's form, how a version is derived from history, which claims a version must carry and from which signers, which channels exist and which environments follow each, and whether an environment moves on its own or waits for a person | they never decide what a build left, what a digest is, or that a claim was made by a signer that did not make it |
| **a publisher** (a person, an agent or a host that runs a publish) | when to publish a landed revision | it never publishes a revision that has not landed, never moves a channel, and never makes a claim in another signer's name |
| **a signer** (an identity that makes claims: a build host, a gate, a reviewer, a verifier, a person's agent) | what it claims of a digest | it never claims beyond what the policy lets that signer claim, and never alters a claim it made |
| **the gate** (the one party that accepts and promotes, not the landing gate) | whether an offered artifact is accepted, as the policy fixes it; when a channel moves, within what the policy and a person allow | it never builds, never changes bytes, never accepts what the policy refuses, and never deploys |
| **an approver** (a person the policy names) | whether a promotion the policy holds for a person proceeds, which is also how an environment that waits is let move (97) | it never approves a version that is not accepted |
| **a consumer** (a person, an agent, a build, a surface or a target that reads) | which artifact and version to ask for | it never reads a version the policy it reads under refuses, and never changes what the store holds |
| **a target** (where an environment runs) | how it is converged, by its own reconciler | it never decides which version it should run |
| **the operator** | everything the repository's authors and the policy do not settle; which signers a host trusts | it never makes a landing that skipped the gate count as accepted |
| **tailrace** | the digest of every artifact, which version a landing becomes as the authors' rule fixes it, which projections to render, and what it keeps to answer again | it never builds, never rewrites bytes, never moves a channel on its own, never counts a claim whose signer the policy does not name, and never keeps a credential |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **repository**: the checkouts that share one git history.
- **revision**: one commit of a repository.
- **landing**: the event by which a revision reaches a branch through
  the repository's own landing gate, sluice or its like, which is not
  tailrace's gate. A revision is **landed** on a branch once that branch
  holds it.
- **build**: a run of the repository's own commands over one revision
  that leaves outputs. Its **build identity** is the name the build
  gives the inputs it ran over, by which two parties name the same
  build without seeing each other.
- **outputs**: the files a build leaves that the repository's authors
  declare for publishing.
- **component**: the outputs the authors declare to take one version
  together, with the paths of the repository whose changes version it
  and the prefix its tags carry; a repository that declares no component
  is one component.
- **bytes**: the content of one artifact, as a sequence of octets.
- **digest**: the name bytes have by their content alone, the same on
  every host and in every store.
- **artifact**: bytes, their digest, and the metadata that says what
  the bytes are: which ecosystem's form, which name in that ecosystem,
  which version.
- **ecosystem**: a package manager's or a runtime's own world: its
  package form, its names, its version rules and the way its clients
  read.
- **projection**: an artifact in one ecosystem's own form, as that
  ecosystem's clients read it.
- **version**: the name a publish gives a component's artifacts, in
  the ecosystem's own version rules, derived from the repository's
  history.
- **index**: the artifact that names every artifact of one component
  at one version, by digest, and is itself an artifact.
- **publish**: the act that turns one landed revision into an index
  for each component it publishes and the artifacts each names, offered
  to the store.
- **claim**: a statement about one digest by one signer: that a build
  produced it from a revision, that checks passed on a build, that a
  test ran, that a reviewer approved, that a verifier rebuilt it and
  the digests matched, that a gate accepted it.
- **attestation**: a claim signed by its signer and attached to the
  digest it is about.
- **signer**: an identity that signs claims, and the means to tell that
  a claim is its.
- **policy**: the repository's authors' rule for one audience: which
  claims a version must carry, from which signers, before the gate
  accepts it, a channel takes it, or a consumer reads it.
- **verdict**: tailrace's answer whether a digest satisfies a policy:
  satisfied, refused naming the first claim found wanting, or unreadable
  naming what could not be read.
- **offered**: the state of an artifact a publisher has put in the
  store and no gate has judged.
- **accepted**: the state of an artifact the gate has judged to satisfy
  the policy for acceptance.
- **released**: the state of a version a channel names.
- **channel**: a named pointer to one accepted version, which only a
  promotion moves.
- **promotion**: the act that moves a channel to a version, and the
  record of that move.
- **ledger**: the chain of a channel's promotions, each a claim the
  gate signs that names the promotion it follows, which nothing
  removes; and the seam that holds it, appending a promotion only
  after the one that promotion names and answering the chain.
- **environment**: one target, the channel it follows, and whether it
  moves on its own or waits for an approver.
- **roster**: the environments of one declared kind a target holds,
  each with the channel it follows and whether it waits, answered by
  the target and declared nowhere in the repository (126).
- **reconciler**: what converges an environment on the version its
  channel names: by pushing to the target, or by the target pulling.
- **cache entry**: bytes a build left on any host, named by their
  digest and the build identity, which no claim but the host's own
  covers.
- **consumer layout**: an ecosystem's own form of a local registry: the
  files its clients read from disk, or the protocol they read over the
  network.
- **asker**: whoever asks tailrace a question: a person, an agent, a
  surface, a program.
- **surface**: a way an asker meets tailrace: a command line, an
  agent's session, a pane, a program.

<!-- ANCHOR_END: glossary -->
<!-- ANCHOR: part-a -->
## Part A. What must hold of tailrace

### A.1 Artifacts and digests

1. An artifact is named by its digest, and its digest is a function of
   its bytes alone. Two artifacts with the same bytes have the same
   digest on every host, in every store, under every name.
2. Bytes in the store never change. The same digest always reads the
   same bytes, and a store that holds other bytes under a digest is
   refused, naming both.
3. A version, an ecosystem name and a channel are pointers to digests,
   never the other way: nothing reads a pointer to learn what bytes
   are, and everything that acts on bytes acts on a digest it resolved
   first and records.
4. An artifact carries the metadata that says what its bytes are: the
   ecosystem whose form it takes, its name in that ecosystem, and its
   version. An artifact that says none of these is refused.
138. A publish names each artifact in the store by its ecosystem, its
    name in that ecosystem and its version, a pointer to the digest of
    the version's index (3, 6), in which the artifact of that ecosystem
    and name is found by its metadata (4) and beside which the claims
    about the version are read (28, 113); it stands beside the
    component's tag for the same index, so a consumer resolves what its
    lockfile pins (137) by name and version alone, knowing nothing of
    the publisher's components, prefixes or repository. The pointer is
    moved only with the digest it is expected at (109), names no store
    of one owner (49), and the index names the publishing repository by
    its remote's owner and name and the revision (13). Its store name is
    `artifact/<ecosystem>/<name>@<version>`, a reserved space beside
    `cache/` and `channel/`, which no component's tag may enter; the
    store lists the versions a name holds, as a registry lists the tags
    of `artifact/<ecosystem>/<name>` and a layout its index's names, so
    a range with no pin (137) resolves by that listing under the layout's
    policy.
5. The same bytes offered again are the same artifact: a second offer
   writes nothing, answers the same digest, and is not an error.
6. A version names a set of digests through its index, and nothing
   else of the version is kept apart from the index and what it names.

### A.2 Claims and attestations

7. A claim is about exactly one digest and is signed by exactly one
   signer. A claim about a version is a claim about its index.
8. An attestation is attached to the digest it is about, travels with
   that digest from store to store, and is never kept where the digest
   is not.
9. A claim counts only through a signer the policy names and only for
   what the policy lets that signer claim. A claim from any other
   signer, or beyond that signer's reach, is kept and never counted.
116. A policy binds a signer to the kinds of claim it may make, and for
    a verdict to the checks it may claim, by the names the landing gives
    them; it binds no signer by output or by ecosystem.
10. A claim is never altered. A signer that would change its mind makes
    a new claim; the old one stays attached and stays readable.
11. tailrace signs only in the identity of the host or the party that
    runs it, and what it signs is what that party observed: a publish
    it ran, a verdict it reached, a copy it made. It never signs in a
    builder's, a reviewer's or a gate's name on their behalf.
12. A claim another party made is carried as that party made it,
    signature and all, inside the carrier's own claim that says where
    it was found. The carrier never re-signs another's claim as its
    own.
13. Every claim names the revision and the build identity it was made
    for where it has one, so a verdict joins the claims of one build
    without a second reading of any source.

### A.3 Publishing a landing

14. Only a landed revision is published. A publish of a revision the
    branch has not landed is refused naming the branch, and nothing is
    offered.
15. A publish offers only bytes a build left, and where the landing
    carries verdicts, only outputs whose build identity those verdicts
    name; an output whose identity no verdict names is refused, naming
    the output and the identities the verdicts carry. tailrace itself
    builds nothing.
16. Nothing of a version is offered while any output the version names
    is unread or comes from a build whose outcome is not a pass; such a
    version is refused whole, naming the output.
111. An output's outcome is a pass only when the build reports a pass
    and, where the landing carries verdicts, a verdict with a pass names
    its build identity (15); either alone is not a pass.
17. A version exists only once its index is in the store. Artifacts
    offered before the index are not a version, and a publish that
    stops before its index has published nothing.
18. A publish of the same landed revision again offers the same
    digests and ends at the same index where its projections pack the
    same (87); where one does not, the publish is refused naming the
    artifact that differed, and the version's name stays with the first
    index.
19. A publish ends with an answer a program can read: the index's
    digest, the version, each artifact's digest and ecosystem name, and
    where each claim is attached.
20. A publish offers; it never accepts, releases, promotes or deploys.
    Nothing a publisher can do moves a channel or reaches an
    environment.

### A.4 Versions

21. A version is derived from the repository's history by the authors'
    rule, read at a landed revision, and from nothing a publisher
    supplies. The same revision under the same rule always derives the
    same version.
22. A version's name is its component's, and is claimed before any
    artifact is packed under it: a publish records the name against the
    revision in the repository's history, which every publisher of the
    repository shares, and a name already recorded against another
    revision refuses the publish, naming both revisions. A repository
    whose history no other publisher shares has exactly one publisher.
23. Two versions of one artifact name are ordered by the ecosystem's
    own version rules, and tailrace never orders them by time, by
    spelling or by the order a store lists them.
24. The build that left the outputs never knows the version, so a
    build is the same build whatever version it later becomes; a
    version is in the bytes only where the ecosystem's form requires
    it.
110. One publish gives every artifact of a component one version,
    and the component's index names one version; a projection whose
    ecosystem versions an artifact name by that name's own history does
    so as a profile of the version rule, under the one version.
123. The repository's authors declare components: each names its
    outputs, the paths whose changes version it, and the prefix its tags
    carry; the version rule (21) runs per component over the commits
    that touch its paths, against the tags that carry its prefix. A
    repository that declares no component is one component, whose paths
    are the whole repository and whose prefix is the rule's default.
124. A publish names one component, or every component whose paths a
    commit since its last tag touched; one component's publish never
    gives another component a version, an index or a move. Two
    components may name one path, and a commit under it versions both.
134. A version carries its notes: the run that derives the version
    (21) renders them from the same history, by the rule's own tool, and
    they are an artifact of the version named in its index (6), content-
    addressed and claimed with the rest; nothing writes a version's
    notes after it is offered. An artifact the version rule renders has
    no build, so no build verdict is asked of it: the acceptance policy
    names what each kind of artifact requires, a build's outputs their
    verdicts and the publisher's provenance, a rendered artifact the
    publisher's provenance alone, and the gate judges each artifact
    against the claims required of its kind (25, 28). A surface shows a version's notes beside
    it and, between what an environment runs and what it should, the
    notes of every version between (98, 132); a channel's changelog is
    its chain read with each promotion's notes and asker.

### A.5 Acceptance

25. An offered artifact is accepted only by the gate, and only when the
    claims attached to it satisfy the policy for acceptance.
94. Nothing accepted is ever un-accepted; a version a channel leaves
    stays accepted (38).
117. A claim that counted at acceptance keeps counting after its
    signer's identity expires (81, 94); a policy for a layout that
    requires a signature still valid when the layout renders says so,
    and refuses naming the claim.
95. The gate judges an offered version on being told of it by a
    publish's answer or asked by an approver or a rule the policy
    names, under the accepting credential, in a place no offering
    credential reaches.
26. Acceptance changes no bytes: the accepted artifact has the digest
    it was offered with, and the gate's acceptance is itself a claim
    attached to it.
27. A party that can offer never accepts, releases or promotes: the
    credential that offers and the credential that accepts are never
    the same, apart from the one host 108 admits.
96. No host that builds holds the accepting credential, apart from the
    one host 108 admits.
108. A policy may name one host as both the offerer and the gate of a
    repository with one publisher; the acceptance claim then says the
    host accepted what it offered, so a reader tells a one-host
    acceptance from a separated one, and a policy for a channel may
    require a separated one.
28. Acceptance of a version is acceptance of its index and every
    digest it names; a version one of whose artifacts is refused is
    refused whole, naming the artifact.
29. The gate judges only by the claims attached, the landing and the
    policy; it never rebuilds, never inspects bytes beyond their
    digest, and asks nothing else whether to accept.
107. The gate reads the policy for acceptance and for a channel at the
    governed branch's landed head at the moment it judges, so a landed
    change of policy binds every judgment after it and none before.
30. Where the policy for a channel asks for an independent rebuild, the
    rebuild is made by a signer other than the one that made the
    offered build, from the same revision (55), and its claim says the
    digests matched or did not. The gate counts the
    claim; it never makes the rebuild.
112. A verifier compares the digests of outputs, since packing need not
    be reproducible (87); it compares packed artifacts as well only
    where the projection promises the same bytes.

### A.6 Channels and promotion

31. A channel names exactly one version at a time, and that version is
    accepted. A channel that names nothing is empty, and empty is an
    answer, never an error.
125. A channel belongs to one component and names only its versions;
    a channel bound to another (37) is bound within its component. A
    channel's identity is its component and its name together: two
    components' channels of one name are two channels, with two chains,
    two store names and two policies, and every seam that takes a
    channel takes its component with it. A repository that declares no
    component names a channel by its name alone, and every form below
    keeps that spelling, so nothing changes for it.
32. A channel moves only by a promotion, and a promotion is made only
    by the gate, at the asking of a party the policy lets ask: a rule
    that follows each publish, or an approver.
33. Every promotion is recorded in the ledger before the channel is
    read as moved: the channel, the version it moves from and to, who
    asked, which policy was satisfied by which claims, and when. A
    promotion the ledger does not hold did not happen.
34. The ledger is append-only. A promotion is never removed or
    rewritten; a wrong move is undone by a further promotion back,
    which is recorded like any other.
35. A channel moves only from the version it is at: a promotion that
    names a different starting version is refused and reported, never
    retried blind.
105. The ledger is a chain per channel: every promotion claim names the
    digest of the promotion it follows, a promotion whose predecessor is
    not the chain's head is refused (35), and two promotions naming one
    predecessor are a fork, reported and never resolved by choosing.
109. Where a store cannot move a name against the digest it is expected
    to be at, the gate moves the name, reads it back, and reports a name
    found elsewhere as a lost race it repairs from the ledger, never
    retried blind.
36. A channel resolves to exactly one version for every reader (71):
    no resolution of a channel ever answers two versions, and a reader
    that holds an older answer holds it as of when it read.
37. The policy may bind a channel to another: a version reaches such a
    channel only from among the versions the ledger shows the bound
    channel has held, and never from a publish directly.
127. The policy may declare a channel by a pattern over branch names: a
    prerelease published from a branch the pattern matches is offered
    to the channel the pattern names for that branch, which exists from
    its first promotion and is retired with the branch by the authors'
    rule. A pattern's channel belongs to the component of the publish
    and binds to no other channel.
128. An act may ask for several promotions at once, each of one
    channel. The ledger appends each after its own predecessor, and
    where it can hold the appends as one it refuses them whole when any
    one is refused, naming the chain; a ledger that cannot appends them
    in order and reports the first refused, and the moves before it
    stand.
38. Moving a channel away from a version withdraws nothing from the
    store: the version stays accepted and readable by digest, and only
    the channel's name has left it.
39. Every promotion is a claim about the version it moves to, signed by
    the gate and attached to its index, so a store that holds the
    version holds the proof of each channel it was ever on.
101. For every state a channel can be in, exactly one record is its
    source of truth; every other place that reflects it, a tag, a
    claim, a layout, is a projection written from the source and never
    read as truth.
106. The ledger is the record 101 names for every channel; the same
    claims are attached in the store to the versions they move to (39),
    and where the store disagrees with the ledger, the store is
    rewritten from the ledger.
102. A repository may write no channel line and no environment: its
    versions are offered or accepted, a consumer reads them by version
    under the policy, and nothing of a publish changes when channels
    are written. The given channels (C.10) are declared all the same,
    by the core's fragment, so such a repository's `beta` moves on each
    accepted publish and its `stable` waits for a promotion, and
    neither is read as undeclared.
103. A version copied to another store carries every attestation
    attached to its digests, acceptance and promotions among them (8);
    a channel is the repository's, never a store's, and resolves to one
    version whichever store answers.
104. A signer is one identity under the landing's policy and under
    tailrace's: a verdict's signer is named in tailrace's policy by the
    identity the landing names it by, and never by a second name.

### A.7 Environments

40. An environment follows exactly one channel, and what it should run
    is that channel's head and nothing else. No environment is told a
    version directly.
41. An environment that moves on its own converges on the channel's
    head whenever the head moves; one that waits follows a channel bound
    to the one it waits on (37), and converges when an approver promotes
    it.
97. An approval is a promotion (32): an approver's yes to an environment
    moves the channel that environment follows, the ledger records it
    like every promotion, and an environment never converges on a yes
    the ledger does not hold.
42. Converging an environment changes nothing in the store and nothing
    about the version: a reconciler reads the version's bytes by digest
    and verifies the claims it is told to require before it applies
    anything.
43. A reconciler reports what the environment runs, by digest, and
    when it last converged.
119. A reconciler leaves a marker of the digest it applied where the
    target can hold one, and reports what runs from the marker; where
    the target can hold none, it reports unread with the reason, never a
    guess.
98. An asker learns of every environment what it should run, what it
    runs, and that the two differ where they do; an environment whose
    state cannot be read is reported unread with the reason, never as
    converged.
44. Whether an environment is pushed to or pulls is the environment's
    own, and the ledger, the channel and the policy are the same either
    way.
45. A reconciler acts with the environment's own credentials in the
    environment's own place, and tailrace never holds a credential that
    reaches a target.

### A.8 Consumers

46. A consumer reads an artifact in its ecosystem's own form, as that
    ecosystem's clients read it, and never needs tailrace's vocabulary
    to do so.
47. A consumer layout holds only versions whose claims satisfy the
    policy the layout was rendered under.
113. A layout for a repository that consumes another's versions is
    rendered under the consuming repository's own layout policy where its
    file writes one, at its landed revision (65); where it writes none,
    with no file or a file with no layout line alike, under the
    publishing repository's policy for layouts where the version's index
    carries one, which the publish attached as a claim of the
    publisher's, the claims a layout must require as that repository
    declared them at the revision; and where the index carries none,
    under the given layout policy (C.10). A consumer reads all of it
    from the store and reaches no repository but its own (49, 60).
99. A version a layout's policy refuses is answered to whoever asked
    for the layout, naming the version and the claim found wanting; a
    served layout answers the refusal in its response to the client's
    own request. Where the client's protocol carries no words at the
    listing, a sparse index among them, the layout leaves the refused
    version out of what it lists, answers a request for that version's
    bytes with the refusal, and the sync that rendered the layout prints
    the refusal, so the client's own words, no matching version, are
    never the only ones.
48. A layout is rendered from the store and the policy alone, and
    rendering it again from the same store under the same policy gives
    the same layout. A layout is never a source of truth.
49. The address a consumer's client records for an artifact is the
    same on every host, so a record the client keeps of where it read
    from names no host and no store of one owner.
114. A served layout is reached by one fixed name and port on every
    host, with the repository in the path, and one process on a host
    serves every checkout; an address whose port differs from host to
    host names a host. The name and port are the core's and no setting
    moves them, and the repository in the path is the owner and name its
    landing's remote gives it (49), never a directory or a name an
    operator chose. The process is started by the first asker on the host
    that finds none, holds the host's one lock for it, and ends when
    nothing has asked for a while and it serves no layout: while a
    rendered layout on the host is served (115), the process stays, since
    the ecosystem's client cannot start it, and ends only once the
    layout is removed; a host may also run it as a service of its own.
    No asker starts a second, and no person is told to start one.
50. A consumer reads only what it asked for: a layout rendered for a
    set of versions holds those versions, and asking for a version
    reaches the store only when the layout lacks it.
115. The host runs a served layout for as long as a client needs it; a
    request for a version the layout lacks is a render from the store
    under the policy (50), and 60 covers asking what tailrace holds,
    never serving.
51. A consumer layout that cannot be refreshed answers what it holds,
    says when it was last rendered, and never answers an absent version
    as refused or a refused one as absent.

### A.9 The cache

52. A cache entry is written by any host that built it and read by any
    host whose build identity matches, and carries no claim beyond the
    writing host's own.
100. The same bytes are one store object whether a cache entry or an
    artifact names them (1); writing bytes is never an offer, and only
    an artifact's metadata (4) makes one.
53. A cache entry is never an artifact: reading one offers nothing,
    accepts nothing, and no channel, index or policy names one. The
    same bytes become an artifact only through a publish.
54. A cache entry may be removed at any time, and a build whose entry is
    gone builds again and is no worse for it. Nothing accepted or
    released is ever removed because of what the cache does.
55. A verifier's rebuild (30) reads no cache entry it did not write.
135. A host pushes the cache entries of the tasks it ran with the
    credential it has, as a cache entry and nothing more (52, 53), before
    or after the landing is decided: on a host, as the step its driver
    runs; in a pool whose runners keep nothing, in the job that ran the
    task, as a step of the repository's own workflow after the queue's
    run step, which the queue's template leaves room for and never
    names, with a credential of the job's own that writes cache entries
    and nothing else in the store, so no job that builds can offer,
    accept or move a name (96, core.14); which entries, the build seam
    answers (139). A publish on a host that holds none of the outputs reads them
    from the store as the cache entries whose build identities the
    landing's verdicts name, and offers those bytes; it never builds to
    offer where the landing has verdicts (15, I3), and an identity whose
    entry no store holds refuses the publish naming the output (16, 58).
    Where the landing has no verdicts (C.6), the publish's host builds
    through the build seam and offers what it left as its own.
133. A compilation's cache, a toolchain's reuse of one compilation's
    outputs inside a task that runs, is the toolchain's and the host's,
    below the task: tailrace carries none of it between hosts and names
    none, and a verifier's rebuild (30, 55) reads no such cache another
    party wrote, the party on one host being the host.

### A.10 Askers and surfaces

56. Every surface answers from one core, and the same question on any
    surface gets the same answer.
57. Every answer is readable by a program on request, in a form that
    names digests, versions, channels and verdicts as this statement
    names them.
58. tailrace never answers a refusal as an absence, an absence as a
    refusal, or either as unknown; a refusal names the first claim
    found wanting and why, and an unreadable answer names what could
    not be read.
59. A refusal carries the underlying store's, signer's or ecosystem's
    own words where one refused, verbatim, beside tailrace's.
60. Asking what tailrace holds reaches no store, no signer and no
    target, and writes nothing. Asking a channel's chain, or whether a
    revision landed, is a read of the ledger or the landing (61, 77): it
    fetches the ledger, or the landing's branch, into the host's copy
    where the remote answers, a store's or a git remote's, and answers
    from the copy saying when where it does not, an empty channel as any
    other answer, with the time the copy was read; the fetch writes the
    host's copy and nothing else, never a store's name or bytes, never a
    branch, and a fetch is not a write in this clause's sense.
132. A web page is a surface (56), answered by the host's one serving
    process (114) at a path of its own: it renders the status answer, what
    every environment should run, runs and waits on, with each version's
    notes where the version carries them, on each request, and writes
    nothing (60); no timer renders a page, and no checkout starts a
    server of its own beside it. The process answers a repository once
    a command run in a checkout of it on that host has named it, and
    answers that no checkout on this host has named one none has, in
    those words (58). What it knows of the host's checkouts is the host's
    own and nothing the store or git holds (63): it is kept beside the
    bindings and made again by the next command run in each checkout. It
    answers every repository it knows together at its root path, one row each with every channel's
    head and, for the environments, how many run what they should, how
    many are behind, how many wait on a person and how many cannot be
    read, and each repository alone at its own path with the whole; a
    pane shows the two the same way.
129. The ledger names an asker by an identity the gate verified at the
    moment of asking, issued by the owner's identity provider, never by
    the asker's own word; a surface that asks on a person's behalf
    carries the person's own token, and the gate records the person.
    The gate refuses an asking it cannot verify and names what it could
    not read. Where no identity provider stands, the asker recorded is
    the signer of the host that asked, and the record says it names a
    host and no person, so a reader tells the two apart as 108 lets a
    reader tell a one-host acceptance. A promotion the gate makes on a
    publish (95) records the gate's own signer as the asker and the
    publish as its cause; an asker is always a signer, never a phrase.

### A.11 What tailrace keeps

61. tailrace keeps, apart from the store, only what the store cannot
    answer: which versions it published from which revisions, which
    layouts it rendered under which policy, and nothing that the store,
    the ledger or git holds already, but for the chain as the host last
    read it from a ledger the store holds (C.14), kept so that asking
    answers when the store does not (60).
62. The record of claimed versions (22) is the repository's and is
    readable from every checkout with git; everything else tailrace
    keeps is the host's and is readable on that host with a file
    reader; nothing tailrace keeps needs a tailrace process running to
    be read.
63. What tailrace keeps can be deleted, apart from the record of
    versions claimed (22), and rebuilt from the store and git to the
    same state.
64. tailrace keeps no credential. A credential the store, a signer or a
    target needs is the asker's, the host's or the environment's own,
    reached at the moment of use.
65. The policy is read from the repository at a landed revision of the
    branch it governs, never from a publisher's checkout, so a publish
    cannot carry a policy that admits itself.

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The store

66. **put-bytes**: given bytes, their digest, and whether the store held
    them already. The same bytes put twice are held once.
67. **put-artifact**: given an artifact's metadata and the digests of
    its bytes, the artifact's digest, which the store names it by
    thereafter.
68. **attach**: given a digest and an attestation, the attestation held
    beside that digest, readable by **claims-of**.
69. **claims-of**: given a digest, every attestation attached to it, as
    attached, or that the digest is not held.
70. **name**: given a name and a digest, and the digest the name is
    expected to be at, the name moved; or refused, naming the digest it
    is at. A name moved from nothing is a name made.
71. **resolve**: given a name, the digest it names, or that it names
    nothing.
72. **read**: given a digest, its bytes, or that the digest is not held.
73. A store holds bytes by digest, never alters them, and answers the
    same bytes for the same digest for as long as it holds them. A
    store that cannot do so is not a store.

### B.2 The build

74. **ensure**: given a revision and every output the authors declare,
    in one asking, those outputs present for that revision, or that the
    build could not make them, naming which; an answer that leaves any
    output unmade refuses the version whole (16).
75. **report**: given a revision and an output, the build identity the
    output came from, the build's outcome, and where the output's files
    are.
76. The same revision and the same inputs give the same build identity
    on every host.
139. **left**: given a checkout, the build identities whose outputs the
    checkout's own build state holds, each with its tasks, its outcome
    and where its files are, read from the build's own records (C.3) and
    from nothing of tailrace's; so a push before a landing (135) pushes
    what this checkout's run left and nothing more, and a host that
    keeps nothing between runs pushes what the run made.

### B.3 The landing

77. **landed**: given a branch and a revision, whether the branch has
    landed it. Where the landing's remote does not answer, the answer is
    read from the host's copy of the branch as last fetched, saying when
    it was fetched and carrying the remote's words (59, 61), never a
    refusal and never a guess; a publish that reads not landed from such
    a copy refuses naming the copy's time, and asks again later.
78. **verdicts-of**: given a revision, every signed verdict the landing
    recorded for it, each naming its check, its build identity, its
    outcome and its signer, as the landing recorded them.

### B.4 The signer

79. **sign**: given a claim and the identity of the party running
    tailrace, the claim signed, or that no identity is at hand.
80. **verify**: given an attestation and the signers a policy names,
    which signer made it, or that none of them did.
81. A signer's identity is bound to the party that holds it and expires
    with that party's standing; a signature by an identity that has
    expired is reported as such, never as valid and never as absent.

### B.5 The policy

82. **policy-for**: given a repository at a landed revision and an
    audience (acceptance, a channel, a layout), the claims required,
    each with the signers that may make it and what each may claim.
    Where the repository declares no policy for the audience at that
    revision, the answer is absent naming the audience (58); verify,
    which chose the revision from the version's tag, names the revision
    beside it.
83. The policy for a channel bound to another (37) names the channel it
    is bound to, and the policy for acceptance never names a channel.
131. **channels**: given a repository at a landed revision, the channels
    its policy declares, each with the component it belongs to (125),
    how it moves, on each accepted publish as the gate's act (95), by a
    promotion alone, or bound, and the channel it is bound to where it
    is one (37, 83); a repository that declares one component has every
    channel in it. The same answer carries each given the repository has
    not switched on, marked held and naming the line that switches it on
    (C.10), apart from the channels in force, so a surface shows both
    from one answer and no further operation exists for it. The gate and
    the ledger learn a channel through this answer and read no key of
    the policy's file themselves.

136. **environments**: given a repository at a landed revision, the
    environments its policy declares, each with its target, the channel
    it follows, whether it moves on its own or waits, and whom it waits
    on where it does (41, 97, C.10); the policy seam has these three
    operations, policy-for, channels and environments, and no other.

### B.6 A projection

84. **pack**: given an output at a build identity, the version where
    the bytes are an artifact's, and the component the output belongs
    to with its declared outputs (123), so a projection knows which
    outputs are the component's own, the ecosystem's own bytes for it
    and the metadata (4) the ecosystem gives them. A cache entry (52)
    packs with no version, and the bytes it packs to carry no metadata
    that makes an offer (100).
85. **render**: given a set of artifacts and their metadata, or of cache
    entries by build identity, a consumer layout in the ecosystem's own
    form, and which versions, or which build identities, it holds.
86. **serve**: given a consumer layout, answers to the ecosystem's own
    clients over the protocol they read, for an ecosystem whose clients
    read no files.
87. The same outputs and the same version, or the same build identity,
    pack to the same bytes, or the projection says it cannot promise so
    (18).
137. **pinned**: given a checkout, the ecosystem names and versions its
    lockfile pins, as the ecosystem's own lockfile spells them, or
    absent where the checkout holds no lockfile of that ecosystem; a
    projection whose ecosystem has no lockfile, a file, an image, a
    cache, answers absent. For a name the checkout's manifest declares
    and no lockfile pins yet, pinned answers the manifest's range, and
    render holds the newest version the layout's policy admits within
    it, so a first install resolves and the ecosystem's client writes
    the pin.

### B.7 A target

88. **desired**: given an environment, the digest its channel names, or
    that the channel is empty.
89. **current**: given an environment, the digest it runs, or that it
    cannot be read, with the reason.
90. **apply**: given an environment and a version the reconciler has
    verified (42), the environment converged, or what stopped it.
91. **report**: given an environment, what it runs and when it last
    converged, recorded where every asker reads it (43).
126. **roster**: given an environment kind the policy declares, the
    environments of that kind the target holds, each naming the channel
    it follows and whether it waits; an entry that waits follows a
    channel of its own, named by the entry within its component and
    bound to the channel the entry names (37, 41). The policy declares
    the kind, the roster declares the instances, and nothing in the
    repository changes when an instance is added.

### B.8 The ledger

120. **append**: given a promotion claim and the digest of the
    promotion it names as its predecessor, the claim held at the head
    of its channel's chain; or refused, naming the claim at the head.
121. **chain**: given a channel, every promotion claim of it in order
    from the first, or that none is held.
122. The ledger never removes or reorders a claim, and answers the
    same chain to every reader for as long as it holds it.

### B.9 Binding the contracts

92. Each seam is bound by naming one or more profiles of Part C. The
    repository's authors bind the build, the projections and the
    targets in the repository; the operator binds the store, the
    signers, the landing and the ledger for a host. Any number of
    projections and targets are bound at once; exactly one store is
    written by a publish, exactly one landing is read, and exactly one
    ledger is appended to.
118. The operator's bindings for a host are kept in one file on the
    host, beside the landing's own, in the same form, readable with a
    file reader. A host with no such file is bound: its store is a
    layout on disk under the user's own data directory (C.2), its signer
    a host key made on first use (C.8), its landing the branch (C.6) or
    sluice where the repository is set up for it (C.5), and its ledger
    the git ref (C.13) on the landing's own remote, pushed to and fetched
    from it as the branch is, so two machines of one repository read one
    ledger with nothing written, and a repository with no remote keeps
    its ledger where it keeps its branch; so a person on a laptop, and every plugin, works
    with nothing written, and the file is for pointing a host at a
    registry, a key service or a shared ledger. The same host's landing
    remote is the checkout's `origin`, or its one remote where it has no
    `origin`, and unreadable naming them where it has several and the
    file names none. On such a host the publish's own host tells the
    gate as its next step, and where the policy names no gate the host
    is the one 108 admits, its acceptance claim saying so; so `beta`
    moves on a laptop with nothing written. What runs a publish after a
    landing is named in the file (130, C.16); where the file names none,
    a publish runs when asked for: by a person, or by the driver that
    submitted the work and learned it landed (sluice 50, 51). The landing
    tool itself runs nothing after it lands and is never asked to.
130. The core starts nothing after a landing and nothing after an
    offer: a publish is run by whatever the host binds to run it, the
    gate is told by whatever the host binds to tell it, and both are
    named in the host's bindings file (118) and nowhere in the core
    (C.16).
93. One conformance suite holds every profile to Parts A and B; a
    profile that fails it is not one.

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile.

### C.1 The store: an OCI registry

An OCI registry, reached over the distribution protocol: Amazon ECR,
GitHub's registry, Harbor, zot or the reference distribution. An
artifact is an OCI manifest whose `artifactType` names the ecosystem,
whose layer is the ecosystem's own bytes and whose config is the
ecosystem's own metadata; an index is an OCI image index; an
attestation is a DSSE envelope holding an in-toto statement, attached as
a referrer whose artifact type is tailrace's envelope type, with the
statement's predicate type in the referrer's `in-toto.io/predicate-type`
annotation, since a predicate type is a URI and a registry takes only a
media type as an artifact type; a name is a tag, moved with the expected
digest where the registry supports it and checked after the move where
it does not, and since a registry may answer a tag's former digest for
seconds after the put, the check reads again at growing intervals while
it answers the former place, for at most a bound the profile names, 30
seconds on Amazon ECR: the new digest is the move made, any third digest
a lost race (109), and the bound passing a refusal naming the former
place, with the put never repeated. The registry's tag reads are not
monotonic either: after one read has answered the new digest, another
may still answer a place the name was at, for the same bound, so a
resolve on this profile is the answer as of when it read (36), settling
on the new digest within the bound and never a digest the name was never
at; nothing of tailrace acts on a resolve where the ledger holds the
answer (33), and the conformance suite reads a moved name until it
settles or the profile's bound passes, which a profile with no lag
passes at once. A registry whose tag put takes no condition, Amazon ECR
among them, cannot refuse a move from a place the name has left: the
check before the put is a read a lagging replica defeats, so a name's
refusal there is best effort and never the thing a move's safety rests
on. It rests where the statement already puts it: the ledger is written
before the name moves (33), the chain admits one successor to a head
(105), so one party moves a channel's name at a time, and a cache name
is made once from nothing at bytes every writer of its build identity
agrees on (87). A name found elsewhere is repaired from the ledger
(109). The profile declares whether its names are conditional; the
suite's refusal of a move from a stale place runs on a profile that
says yes, and on one that says no the suite runs the repair in its
stead. The binding declares one repository, and every blob,
manifest, referrer and tag lives in it, the ecosystem name escaped into
the tag: the seam addresses by digest alone, which a registry resolves
only within a repository. A tag names a manifest, never a blob, so a
cache entry (52) is named through a manifest of tailrace's cache-entry
type, whose one layer is the entry's bytes and whose config is the empty
descriptor, which the profile writes when asked to name a digest held as
a blob; resolving the name answers the layer's digest, so the name is at
the digest the caller gave, as on every profile. That manifest names no
ecosystem and carries no metadata, so it is no artifact (53, 100).

The store's names map onto the registry's in three spaces a credential
can be scoped to apart. A component's indexes and its channels live
under the component's own repository, the channel's name as a tag of
it. Cache entries live apart from every component, under `cache/<build>`
repositories, one per build profile (`cache/moon`), with the build
identity as the tag, so a credential that writes `cache/` and nothing
else can push entries and never offer, accept or move a name (135). An
artifact's pointer (138), `artifact/<ecosystem>/<name>@<version>`, is the
repository `artifact/<ecosystem>/<name>`, lowercased and escaped as the
distribution protocol allows, with `<version>` as its tag, so a name's
versions are the repository's tag list and no tag carries a package
name; a tag's characters the protocol refuses, `+` among them, are
escaped one way and read back. On a registry that makes a repository on
push only by a creation template, Amazon ECR among them, the operator's
setup makes the repositories, or a creation template covering `cache/`,
`artifact/` and the components' names, before the first publish, and a
push refused for a missing repository is reported in the registry's
words naming the repository (58); the self-hosting guide says so, and a
fleet that adopts tailrace makes the templates in its own configuration.

| operation | how |
|---|---|
| put-bytes | blob upload; the registry answers whether the blob existed |
| put-artifact | manifest put; the digest is the manifest's |
| attach | referrer push, with the tag-schema fallback where the referrers API is absent |
| claims-of | the referrers list, filtered by the envelope type |
| name, resolve | tag put with the expected digest, tag get read again while it answers the former place, up to the profile's bound; a digest held as a blob is named through its cache manifest, and a tag at a cache manifest resolves to its layer's digest |
| read | blob get by digest |

### C.2 The store: an OCI image layout on disk

A directory in the OCI image layout, read and written with no server,
for a host with no registry or a layout to be synced to one. Every
operation is a file write under the digest's path; attestations are
entries of the index with a subject annotation.

### C.3 The build: moon

moon runs the repository's tasks. An output is a task's declared
outputs; the build identity is moon's task hash, which sluice's verdict
also carries; `ensure` is one run of the named tasks, which replays
what is cached; `report` reads moon's own state of each task. The cache
is moon's outputs directory, one archive per task hash, which moon reads
before any remote and which every checkout on a host shares: `sync`
renders into it the entries whose task hashes the landing's verdicts
name for the revisions the checkout descends from, and a step after a
landing, on the host that ran the landing's checks, pushes the archives
that landing's build left. Where moon keeps
outputs as a digest directory instead, the layout is the same digests
linked.

### C.4 The build: a declared command

Where no task runner declares outputs, the repository declares, per
output, the command, its inputs and the shell to run it through; the
build identity is the git tree hash of the declared inputs at the
revision.

### C.5 The landing: sluice

sluice's records: a revision is landed when sluice's log for the branch
holds its landing, and `verdicts-of` reads the signed results under
`refs/sluice/runs/<signer>` for the combination that landed it, each an
in-toto statement in a DSSE envelope with the test's key and system as
its subject and moon's hash as its digest. A result that record marks
replayed has its pass in an earlier record, since sluice signs only
what ran: `verdicts-of` carries the signed pass sluice counted for it
(sluice 108), the record for the same key and system by a signer
tailrace's policy names (104), from the combination that ran it, as
made and naming where it was found (12). Every envelope is carried
whole, its signatures and their key ids as sluice wrote them. sluice's
log and refs are read on the remote where it answers, and from the
host's copy as last fetched where it does not, saying when (77).

### C.6 The landing: a git branch

Where sluice does not run a branch, a revision is landed when the
branch's history contains it, and there are no verdicts: `verdicts-of`
answers an empty set for every landed revision, which is neither absent
nor unreadable (78). The branch is read on the remote where it answers,
and from the host's copy of it as last fetched where it does not, saying
when (77).

### C.7 The signer: a key in a key service

A key the host's cloud identity may use and never export, such as a key
in AWS KMS used through the host's role; the signer's name is the key's,
and verification uses its public half. The policy that names the signer
carries the public half beside the key's name, and a verifier reads it
there, from the policy at the revision that counted the claim (107), so
a claim stays checkable after the key is disabled or deleted (117); the
key service is asked for the public half only where the policy carries
none.

### C.8 The signer: a host key

A key file on the host, as sluice's signers hold theirs; verification
uses the public key the policy lists.

### C.9 The signer: keyless

A short-lived certificate bound to an identity from the owner's
identity provider, logged in a transparency log, as Sigstore issues and
cosign uses, public or private.

### C.10 The policy: a file in the repository

`.config/tailrace.toml` at the landed revision: the components, each
with its outputs, the paths that version it, its tag prefix and its
projections, the version rule, the signers and what each may claim, the
claims each audience requires, the channels and their bindings, and the
environments with their targets and whether each waits, or the
environment kinds a target admits by its roster (126). Most of it is
given: a repository that declares no component is one (123); every
component has `beta`, moved by the gate on each accepted publish (95),
and `stable`, moved by promotion from among what `beta` has held (37),
with no line written; the version rule is the conventional-commit rule
unless another is named; and the given policy for a layout admits a
version the gate accepted and no other, so a repository with no layout
line renders accepted versions. The givens name no signer: who may
claim what is the repository's file's alone (116), and a file naming
none makes the host the one-host gate as above. For reading, a host
with no file trusts its own signer and the signers its bindings name
(118), so a laptop consumes what it published; a repository whose file
names signers reads under its file alone, and the host's trusted list is
read only for a claim its file names no signer for. A consuming repository with no policy
of its own counts a publisher's layout-policy claim (113), and every
claim it reads, through the signers its host's bindings trust (118),
and refuses a layout whose claims count through none, naming the claim
(9, 58). The givens are a policy fragment in this same
form, shipped with the core and laid beneath the repository's own file,
which the policy command shows as the one table in force; the core knows
the three ways a channel moves, on each accepted publish, by promotion
from another channel, or bound to other environments' reports (131), and
no channel's name. A channel the givens hold and the repository does not
switch on, `alpha` following every accepted version including
prereleases, `lts` promoted from `stable` by a person alone, is one line
to switch on, since it is already written: writing its table,
`[channels.alpha]`, empty or with lines, is the switch, and there is no
other key for it and no switch that turns `beta` or `stable` off; a
repository overrides a given by writing the same line. The policy
command shows the table in force and, beneath it, each given held off
with the line that would switch it on, read from the fragment, so a
reader sees what one line would give them. A channel that
follows each accepted publish follows the releases the version rule
makes, and follows prereleases too only where its line says
`prereleases = true`, which `alpha`'s given does. Who may ask: an
environment with `policy = "manual"`, or a channel moved by promotion
alone, is moved at the asking of any asker the gate verifies (129),
unless `approvers` under it names who may, signers today and persons
once an identity provider stands; `lts`'s given names no rule, so no
publish and no report moves it, and only an asking does. A repository
writes `approvers` on the environment or on the channel it means, never
on a channel the core made for an environment; the made channel takes
its environment's. `approvers` on an environment whose policy is `auto`
names no one who could be asked, and the file refuses it naming the
field. The fragment marks the givens it holds off with a
mark of its own, which a repository's file never carries and the file
profile refuses. An environment names its channel, and two
words make the rest: `policy`, `auto` unless written, where `manual`
gives it a channel of its own bound to the one it names, moved only by
a person's yes (41, 97), and a later word names who may say yes, the
approval a hosted gate asks for; `after` names the environments it must
never be ahead of, and gives it a channel bound to theirs that moves
once every environment named reports it runs the version (37, 43,
91). The channels these two words make are the
statement's channels and are read as such (131), and a reader may
declare one by hand instead, as `[channels.<name>]` in a repository that
declares no component and `[channels.<component>.<name>]` in one that
does (125). A given channel, `beta` or `stable` with no line written, is
promoted by the gate's own signer, the one the acceptance policy names
(32), at the asking of an approver or the rule; a line under the channel
narrows who may ask or adds a claim its versions must carry, and never
widens who signs. Where the file names no signer that may claim
acceptance, the policy answers that the host's own signer, the one it
names for provenance, is the gate of the repository for acceptance and
for the given channels' promotion, as the one host 108 admits, and its
acceptance claim says so; the gate reads this from the policy's answer
and decides nothing of it (core.7). Where the file names several
signers for provenance and none for acceptance, 108 admits no host,
nothing is accepted, and the refusal says so in those words: several
publishers and no gate, name an accepting signer (58). A target's own settings, a cache's address
among them, sit in the target's table and nowhere else.

### C.11 Projections

A projection packs with the ecosystem's own packager, run against the
outputs the build left, with the version supplied the way that
packager takes it: `npm pkg set` before `npm pack`, Maven's `revision`
property with the flatten plugin, `dotnet pack --no-build`, `helm
package --version`, setuptools-scm's pretend version, a Cargo manifest
edit before `cargo package --no-verify`. A projection never opens the
packager's archive to edit it; a wheel with compiled extensions, whose
build is its packaging, is repacked with the `wheel` tool's own
unpack and pack around its metadata and is the one exception. A
compiled binary carries the revision and the build identity, never
the version (24). Determinism is the packager's, and a projection
whose packager cannot promise it says so (87).

| ecosystem | pack | render | serve |
|---|---|---|---|
| npm | the tarball `npm pack` writes, with `package.json` as metadata | a packument and tarballs under a registry read layout | a localhost registry, since npm reads no files |
| Maven | the jar and its POM | a `maven2` layout with checksums and `maven-metadata.xml` | not needed: a `file://` repository |
| Python | the wheel and sdist, with their metadata | a simple index per PEP 503 | not needed: `find-links` or a `file://` index |
| Go | the module zip | the module proxy layout | not needed: `GOPROXY=file://` |
| Cargo | the crate file, `cargo package --no-verify` after the component's version is set on every crate of the component, so a path dependency on a sibling crate is rewritten to that version's requirement as cargo does (110); a crate belongs to the component whose paths hold its manifest (123); a path dependency on a sibling crate the component does not declare as an output is refused naming the crate, since a consumer could resolve nothing for it; and a path dependency on a crate of another component is packed as a dependency on the version requirement the manifest writes for it, refused naming the crate where the store holds no such version (138) | a sparse registry under the served address, `sparse+http://127.0.0.1:7420/<owner>/<name>/cargo/`, the same on every host (49, 114), named `tailrace` in the checkout's cargo configuration | the host's one process, since a sparse index is read over the protocol |
| NuGet | the package file | a folder feed in the v3 layout | not needed |
| a file | any file, with a declared media type | a directory | not needed |
| an image | an image as pushed | the OCI layout itself | the layout served as a registry |
| moon's cache | a task's output archive, by task hash | moon's outputs directory, one archive per hash, shared by every checkout on the host | not needed: moon reads the directory before any remote |
| a CloudFormation template set | the packager's own (`sam package`, the asset publisher) against a bucket address that is a parameter, so the packed templates name no bucket | the set written under a version prefix in a bucket the deploy reads, the same bytes a skip | not needed |

### C.12 Targets

| target | reconciler |
|---|---|
| a package registry (CodeArtifact, npmjs, PyPI, Maven Central) | push: publish the version's projection with the target's own credential; current is what the registry lists |
| a static site (a bucket behind a distribution) | push: sync the version's bundle; current is a marker the sync writes |
| a CloudFormation stack or StackSet | push: one stack operation on the version's template with the environment's parameters, which a StackSet carries to every stack instance it holds, a list kept outside tailrace; current is the stack's or the StackSet's recorded version |
| a function | push: point the function at the version's image by digest |
| Kubernetes | pull: the channel's tag, verified by Flux or Argo against the gate's signature; current reported by a watcher |
| a Nix fleet | two profiles, bound by the environment (44). Push: apply runs the fleet's own deploy tool against one machine from a host that holds that machine's key, and report is what the machine answers after; current is the closure the machine runs. Pull: each machine, on its own timer, reads its channel's tag in the store with its own credential, verifies the gate's claim, realises the version's store paths from the cache and switches; the system profile is its marker (119) and its report a claim it signs. The push profile comes first and the pull profile replaces it machine by machine |
| a Nix binary cache | push: the version's store paths pushed to the cache |
| a pool: a control plane's roster of environments (126) | push: apply is the control plane's request to converge one environment, run by its own executors with credentials that are the control plane's, reached at the moment of use; current and report are read from what it records |

### C.13 The ledger: a git ref

One ref per channel in the repository, `refs/tailrace/ledger/<channel>`,
or `refs/tailrace/ledger/<component>/<channel>` where the repository
declares components (125), each commit holding one promotion claim; `append` is a push that fast-
forwards, and a push the remote refuses is a predecessor that is not the
head. The gate's own identity pushes, and no device that asks for a
promotion commits anything. Asking reads the refs the repository holds,
fetched where the remote answers, a fetch being a read of the remote
into the repository's own copy, and answers from the refs as last
fetched where it does not, saying when (60).

### C.14 The ledger: the store

The chain as the promotion claims attached to the versions they move
to, walked by predecessor from the channel's tag, `channel/<channel>`,
or `channel/<component>/<channel>` where the repository declares
components (125), for a store the
operator can trust to retain them: a registry whose retention rules
expire untagged artifacts by age is not one. Asking reads the chain
from the store where it answers and from the chain the host last read
where it does not, saying when (60, 61).

### C.15 The ledger: a database table

One partition per chain in a table with conditional writes: `append`
puts the claim and moves the head in one transaction conditioned on the
predecessor, and `chain` is one ordered read; a table whose writes are
not conditional is not a ledger. A control plane that holds its own rows
beside the chain writes them in the same transaction and reads them as
projections (101).

### C.16 What turns the wheel

Not a seam: the core calls none of these, and each is named in the
host's bindings file (130). A push event a forge delivers to a job,
which runs the publish confined with the job's own identity as its
signer; the driver that submitted the work and waited on its landing,
running the publish as its next step (sluice 50, 51); a watcher of the
landing's records on a host; a store's own event delivered to the gate;
a person at a surface, or a program that asks as one. Never a hook in
the landing tool: the merge queue lands and decides nothing more, and
nothing it runs after a landing publishes, so a landing's tool never
knows tailrace (sluice 1, 10, 122; tailrace record 0005). An approval is the last of these: the core never asks a person
anything, it answers which environments wait on one (98); a program
that watches that answer puts the question where the person is, a
queue of theirs, a hosted tailrace, Flywheel, and on their yes promotes
as them (97, 129). Which program is the operator's choice and no seam.

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** Bytes never change, and every pointer resolves to a digest
  before anything acts (1, 2, 3).
- **I2.** Offering is never trusting: a publish offers, only the gate
  accepts, and only a promotion moves a channel (20, 25, 32).
- **I3.** The bytes that passed the checks are the bytes that run:
  what is offered is what the landing's verdicts name, and nothing
  after the offer builds (15, 26, 42).
- **I4.** A claim counts only through a signer the policy names, for
  what that signer may claim (9).
- **I5.** Every move of a channel is in the ledger before anyone reads
  it, and nothing leaves the ledger (33, 34).
- **I6.** tailrace keeps no credential and signs only as the party that
  runs it (11, 64).
- **I7.** Every surface answers from one core, and absent, refused and
  unreadable are three answers (56, 58).

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Building. The repository's own tools build; tailrace reads what they
  left.
- Landing. sluice, or the repository's own landing gate, lands;
  tailrace reads whether a revision landed.
- Deciding what a build may do or reach. That is the landing gate's
  policy under sluice.
- Judging source. A rebuild proves bytes match a revision, never that
  the revision is sound; review happens before the landing.
- Caching third-party packages from public registries. A consumer
  layout holds what the repository publishes; the public registry
  stays the public registry's.
- Holding anyone's artifacts: the store is the owner's.
- Licences, software bills of materials and vulnerability scanning,
  beyond carrying a claim another tool made.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- Repositories are git repositories, and a landing is a revision
  reaching a branch.
- The store is content-addressed and the owner's own; tailrace is
  never locked to one registry.
- The askers include coding agents working in many checkouts of one
  repository at once, on hosts the developer controls.
- tailrace is free and open source. Nothing commercial, no hosted plan,
  tier or price, appears in the statement or the repository.

The rest of the stack, which a model builds on unless it says why not:

- One static binary, written in Rust, as sluice is.
- An attestation is an in-toto statement in a DSSE envelope, the form
  sluice signs its verdicts in, so one verifier reads both.
- The build is moon, the landing is sluice, and the join between a
  verdict and a provenance is moon's task hash.
- The version rule is git-cliff over conventional commits, run once
  per component over the commits that touch its paths: a feature or a
  fix since the component's last tag makes a release, anything else a
  prerelease, and the tag, carrying the component's prefix, is pushed
  before anything is offered.
- The store is an OCI registry; on a developer's host, an OCI layout on
  disk synced to one.
- The ledger is a git ref the gate pushes, and the same claims are
  attached in the store; the store alone holds the ledger only where it
  retains referrers.
- Signing is a key in a key service or a host key first, keyless once a
  private issuer stands.
- Five surfaces answer from one core: a command line; a web page the
  host's one serving process answers (132), which is the page a hosted
  tailrace shows signed in; and three plugins kept outside the core as
  sluice keeps its plugins: a Claude Code plugin, whose hook refuses an
  ecosystem's own publish command and names tailrace's; a herdr plugin
  with a pane of channels and environments, read from the served page's
  own answer; a Flywheel plugin whose adapter prints a capture for each
  publish and each refusal, for millpond.
- The profiles of Part C: an OCI registry and an OCI layout, moon and a
  declared command, sluice and a git branch, a key service, a host key
  and keyless, the policy file, the git ref and the store as ledgers,
  the nine projections and the seven targets, in that order of
  building.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- How does a Nix closure, thousands of digests with references among
  them, map onto artifacts and the cache without a reference-aware
  removal (52, 54)?

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** sluice lands a revision on the shared branch. A publisher
  publishes it. The build's outputs are read from the cache, two
  packages are packed with the version the history derives, the index
  is offered, the provenance and sluice's verdicts are attached, and
  the publisher's answer names every digest. No channel moved.
- **S2.** The same publisher publishes the same revision again. Nothing
  is written, and the answer names the same index.
- **S3.** The gate reads the offered index, finds the provenance from
  the fleet's signer and the verdicts from the host's signer the policy
  requires, and accepts it. The acceptance is attached; the bytes are
  the ones offered. The beta channel moves to the version, and the
  ledger holds the move before any consumer reads beta.
- **S4.** A consumer on a laptop asks for its repository's lockfile's
  versions. The layouts fill with those versions and no other; the
  client installs with no change to its configuration beyond the one
  that names the layout; the lockfile names no host.
- **S5.** A version is offered with a verdict signed by a signer the
  policy does not name. The gate refuses it naming that claim, nothing
  moves, and the version stays readable by digest as offered.
- **S6.** An approver promotes a version to stable. The policy requires
  a rebuild by a second signer; a peer host rebuilt it with no shared
  cache and attached a claim that the digests matched. The move is
  recorded, stable moves, and every environment that follows stable and
  moves on its own converges; one that waits follows its own channel
  bound to stable, shows the promotion, and waits for its own.
- **S7.** A promotion names stable at a version stable has already
  left. It is refused naming the version stable is at, and nothing is
  retried.
- **S8.** stable is moved back to the previous version. The ledger
  holds both moves; the newer version is still accepted and readable;
  the environments converge back.
- **S9.** A build host's credential is stolen. The thief can offer and
  write cache entries, and can neither accept, promote nor reach an
  environment; what it offered sits unaccepted and attributable.
- **S10.** The store is unreachable. Asking what tailrace holds
  answers from what it keeps; a layout answers what it holds and when
  it was rendered; nothing is reported as refused.
- **S11.** A person at the command line, an agent in its session and
  the pane beside them ask what runs where. All three get the same
  answer, each environment with what it should run, what it runs, and
  whether they differ.
- **S12.** Everything tailrace keeps but the record of claimed versions
  is deleted. The next question answers the same from the store and
  git.
- **S13.** A repository runs no landing gate. A revision on its branch
  is published with no verdicts attached; a policy that requires verdicts
  refuses it, naming the claim; one that requires provenance alone
  accepts it.
- **S14.** A build's cache entry is removed. The next landing's checks
  build again under the landing gate, its verdicts name the new build
  identity, the publish offers those outputs, and nothing accepted or
  released changed.
- **S15.** A repository declares two components. A landing touches one
  component's paths alone; the publish derives that component's next
  version from its own tags, claims it under its prefix and offers its
  index, while the other component gets no version and none of its
  channels move (123, 124, 125).

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of tailrace that satisfies Parts A and B: its components, the
answers each surface gives, how a landing becomes a version, how a
verdict is reached from attached claims and a policy, how a channel
moves and an environment follows, how a consumer layout is rendered,
with fixed examples, and how a store, a build, a signer, a projection
and a target are added. A conformance suite whose scenarios each cite
the clauses they exercise, failing when a clause is cited by nothing
and named by no unit of the plan that will cite it: a clause a later
unit builds is named in the suite's register with that unit, or with
the phase of the plan while that phase has no units carved, reported
as waiting on every run, and leaves the register with the commit that
cites it. The profiles of Part C, each passing the suite.

<!-- ANCHOR_END: deliver -->
