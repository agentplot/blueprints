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
    a channel bound to another (37) is bound within its component.
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
102. A repository may declare no channel and no environment: its
    versions are offered or accepted, a consumer reads them by version
    under the policy, and nothing of a publish changes when channels
    are declared.
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
    rendered under the consuming repository's own policy at its landed
    revision (65); a consuming repository with no policy renders under
    the publishing repository's policy for layouts.
99. A version a layout's policy refuses is answered to whoever asked
    for the layout, naming the version and the claim found wanting; a
    served layout answers the refusal in its response to the client's
    own request.
48. A layout is rendered from the store and the policy alone, and
    rendering it again from the same store under the same policy gives
    the same layout. A layout is never a source of truth.
49. The address a consumer's client records for an artifact is the
    same on every host, so a record the client keeps of where it read
    from names no host and no store of one owner.
114. A served layout is reached by one fixed name and port on every
    host, with the repository in the path, and one process on a host
    serves every checkout; an address whose port differs from host to
    host names a host.
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
    target, and writes nothing.
129. The ledger names an asker by an identity the gate verified at the
    moment of asking, issued by the owner's identity provider, never by
    the asker's own word; a surface that asks on a person's behalf
    carries the person's own token, and the gate records the person.
    The gate refuses an asking it cannot verify and names what it could
    not read.

### A.11 What tailrace keeps

61. tailrace keeps, apart from the store, only what the store cannot
    answer: which versions it published from which revisions, which
    layouts it rendered under which policy, and nothing that the store,
    the ledger or git holds already.
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

### B.3 The landing

77. **landed**: given a branch and a revision, whether the branch has
    landed it.
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

### B.6 A projection

84. **pack**: given an output and the version, the ecosystem's own
    bytes for it and the metadata (4) the ecosystem gives them.
85. **render**: given a set of artifacts and their metadata, a consumer
    layout in the ecosystem's own form, and which versions it holds.
86. **serve**: given a consumer layout, answers to the ecosystem's own
    clients over the protocol they read, for an ecosystem whose clients
    read no files.
87. The same outputs and the same version pack to the same bytes, or
    the projection says it cannot promise so (18).

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
    file reader.
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
a referrer with the predicate type as its artifact type; a name is a
tag, moved with the expected digest where the registry supports it and
checked after the move where it does not. A registry that creates
repositories on push gives each ecosystem name a repository of its
own; one that does not takes one declared repository with the name
escaped into the tag, and the digest is the address either way.

| operation | how |
|---|---|
| put-bytes | blob upload; the registry answers whether the blob existed |
| put-artifact | manifest put; the digest is the manifest's |
| attach | referrer push, with the tag-schema fallback where the referrers API is absent |
| claims-of | the referrers list, filtered by artifact type |
| name, resolve | tag put with the expected digest, tag get |
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
its subject and moon's hash as its digest.

### C.6 The landing: a git branch

Where sluice does not run a branch, a revision is landed when the
branch's history contains it, and there are no verdicts.

### C.7 The signer: a key in a key service

A key the host's cloud identity may use and never export, such as a key
in AWS KMS used through the host's role; the signer's name is the key's,
and verification uses its public half.

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
environment kinds a target admits by its roster (126).

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
| Cargo | the crate file | a local registry per lockfile | not needed: source replacement |
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
| a Nix fleet | pull: each machine verifies and applies the release assigned to it, realising store paths from the cache |
| a Nix binary cache | push: the version's store paths pushed to the cache |
| a pool: a control plane's roster of environments (126) | push: apply is the control plane's request to converge one environment, run by its own executors with credentials that are the control plane's, reached at the moment of use; current and report are read from what it records |

### C.13 The ledger: a git ref

One ref per channel in the repository, `refs/tailrace/ledger/<channel>`,
each commit holding one promotion claim; `append` is a push that fast-
forwards, and a push the remote refuses is a predecessor that is not the
head. The gate's own identity pushes, and no device that asks for a
promotion commits anything.

### C.14 The ledger: the store

The chain as the promotion claims attached to the versions they move
to, walked by predecessor from the channel's tag, for a store the
operator can trust to retain them: a registry whose retention rules
expire untagged artifacts by age is not one.

### C.15 The ledger: a database table

One partition per chain in a table with conditional writes: `append`
puts the claim and moves the head in one transaction conditioned on the
predecessor, and `chain` is one ordered read; a table whose writes are
not conditional is not a ledger. A control plane that holds its own rows
beside the chain writes them in the same transaction and reads them as
projections (101).

### C.16 What turns the wheel

Not a seam: the core calls none of these, and each is named in the
host's bindings file (130). A step the landing's host runs after its
push; a push event a forge delivers to a job; a store's own event
delivered to the gate; a person at a surface, or a program that asks as
one.

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
- Four surfaces answer from one core, each a plugin kept outside the
  core as sluice keeps its plugins: a command line; a Claude Code
  plugin, whose hook refuses an ecosystem's own publish command and
  names tailrace's; a herdr plugin with a pane of channels and
  environments; a Flywheel plugin whose adapter prints a capture for
  each publish and each refusal, for millpond.
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
