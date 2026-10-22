# tailrace

tailrace carries what a build left into a store the owner controls, and
from there to everyone and everything that runs it. After a landing, it
packages what the build left, names each piece by its content, attaches
the claims made about it, and offers the set as one version (17). A gate
accepts what the claims and the policy admit (25); a promotion moves a
channel to an accepted version and records the move (33); an environment
that follows the channel converges on it (40). A consumer reads an
artifact in its ecosystem's own form, and only one the policy admits
(46, 47). Nothing between the landing and the environment builds (I3).

## Why it exists

A build leaves files. Today those files go to a package registry, a
container registry, a bucket and a deploy tool, each with its own
account, its own copy, its own idea of a version, and none of them able
to say which checks the bytes passed. Where agents land work through
sluice all day, a release a week behind the landings is the ordinary
case, and the question "what is running, and what passed before it ran"
has no single place to be answered.

tailrace gives it one. Every artifact is named by its digest, so a cache
entry, an accepted artifact and a released version are the same bytes at
three levels of trust (52, 25, 31). Every claim about those bytes, the
build's provenance, sluice's verdicts, a test's result, a reviewer's
approval, a verifier's rebuild, the gate's acceptance and every
promotion, hangs off the digest in the same store (8, 39). A policy
names which claims count from which signers (9), and the gate, a channel
and a consumer each read the same policy at their own moment.

## What it promises

- **Bytes never change, and every pointer resolves first** (1, 2, 3). A
  version, a name and a channel are pointers to digests; nothing acts on
  a pointer.
- **Offering is never trusting** (I2). A publish offers (20); only the
  gate accepts (25); only a promotion moves a channel (32); the
  credential that offers never accepts (27).
- **The bytes that passed are the bytes that run** (I3). A publish
  reads what the build left and never builds (15); acceptance changes no
  bytes (26); a reconciler reads by digest (42).
- **A claim counts only through a named signer** (9). Every other claim
  is kept and never counted.
- **Every move is in the ledger first, and nothing leaves it** (33,
  34). A wrong move is undone by a move back.
- **A consumer needs none of this vocabulary** (46). It reads an npm
  registry, a Maven repository, a Python index, and finds in them only
  what the policy admits (47).
- **tailrace keeps no credential and signs only as whoever runs it**
  (11, 64).

## Where it sits

tailrace is one of a family. headwater and eddy notice; millpond keeps
the inbox; flume carries work into a worktree; sluice lands it; tailrace
carries what landed to where it runs. It reads sluice's records and the
build's own identities, and neither sluice nor the build knows tailrace
exists ([how it fits](family.md)).

The chapters state the design. The appendix is the statement of
invariants, which the chapters cite by clause number; where a chapter
and the statement differ, the statement wins. What is not settled is on
[open questions](open.md).
