# Glossary

Every term of art, defined once. The statement's vocabulary (section 3)
is the source; a term here that the statement lacks is the book's own.

- **accepted**: the state of an artifact the gate has judged to satisfy
  the policy for acceptance (25).
- **approver**: a person the policy names to let a promotion proceed,
  which is also how an environment that waits is let move (41, 97).
- **artifact**: bytes, their digest, and the metadata that says what
  the bytes are (4).
- **attestation**: a claim signed by its signer and attached to the
  digest it is about (8).
- **build identity**: the name a build gives the inputs it ran over, by
  which a verdict and a provenance name the same build (13); moon's task
  hash under the first profile (C.3).
- **cache entry**: bytes a build left, named by digest and build
  identity, covered by no claim beyond the writing host's (52).
- **channel**: a named pointer to one accepted version, moved only by a
  promotion (31, 32).
- **claim**: one statement by one signer about one digest (7).
- **consumer layout**: an ecosystem's own form of a local registry,
  rendered from the store under a policy (47, 48).
- **digest**: the name bytes have by their content alone (1).
- **ecosystem**: a package manager's or a runtime's own world: its
  form, names, version rules and the way its clients read.
- **environment**: one target, the channel it follows, and whether it
  moves on its own or waits (40, 41).
- **gate**: the one party that accepts and promotes (25, 32); not
  sluice's gate, which lands.
- **index**: the artifact that names every artifact of one component
  at one version by digest (6).
- **landing**: a revision reaching a branch through the repository's
  own gate (14).
- **keeper**: where the ledger is held; it appends a promotion only
  after the one that promotion names, and answers the chain (120 to
  122).
- **ledger**: the chain of a channel's promotions, each a claim the gate
  signs that names the one it follows, which nothing removes (33, 34,
  105).
- **offered**: the state of an artifact a publisher put in the store
  and no gate has judged (20).
- **policy**: the authors' rule for one audience: which claims from
  which signers a version must carry (9, 82).
- **projection**: an artifact in one ecosystem's own form (46, 84).
- **promotion**: the act that moves a channel, and its record (32, 33).
- **publish**: the act that turns one landed revision into an index
  for each component it publishes and the artifacts each names, offered
  to the store (17).
- **reconciler**: what converges an environment on its channel's
  version, by push or by pull (42, 44).
- **signer**: an identity that signs claims, and the means to tell that
  a claim is its (9, 80).
- **store**: what holds bytes by digest and never alters them (73).
- **verdict**: tailrace's answer whether a digest satisfies a policy:
  satisfied, refused, or unreadable (58).
- **component**: the outputs that take one version together, with the
  paths that version them and their tag prefix; a repository that
  declares none is one component (123).
- **version**: the name a publish gives a component's artifacts,
  derived from history by the authors' rule (21).
