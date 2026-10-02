# The toolchain is what the repository declares

The toolchain part of a key is the repository's declaration of the tools
a check runs with. Whether a run really used those tools is a fact about
the run, stated by its executor, and never part of the key.

## The problem

A key has four parts and nothing else enters it (1). Three of them have
a source the statement names. The definition and the inputs digest come
from the workspace description (23, 24, 25), and the envelope is handed
to the executor with the run (33). The toolchain has none. No operation
of Part B supplies it and no clause says who establishes it.

Part C fills the gap with a mechanism: the toolchain group names the
environment image's digest. That works for a run inside the image. An
agent's shell and a developer's machine run in no image. They have the
same tools at the same versions, from the same declaration, and they
cannot name an image they did not run in without recording something no
executor observed (9).

So the same check on the same inputs gets one key in a container and
another in a shell, or none. The purpose of the ledger is that a pass
proven in one of a hundred worktrees is the pass a server reads. With
the image in the key it never is.

The overlap with pinout makes it worse. pinout's inputs already include
any fact the repository declares, a tool's version among them. The file
that pins the tools is an input of every task and is hashed into every
inputs digest, and then counted again as the toolchain.

## What the statement already settles

The key never holds anything about a run: not the executor, the time,
the branch, the commit or who asked (1). An image an executor happened
to run in is a fact about a run.

Confinement is the model to follow. It is a property of a run, the
record states it, the executor claims it only when it established it
(10, 34), and whether it matters is the reader's policy (14, 19). A
version gate requires it; a merge gate may not.

## The ruling

> 41. The toolchain of a key is what the repository state declares the
>     check runs with. Two runs on one declaration have one toolchain,
>     whatever machine, image or shell each ran in.
>
> 42. A record states whether its run used the declared toolchain, and a
>     run is recorded as having used it only when its executor
>     established that. A policy says, for each gate, whether a run that
>     did not establish it counts.

In Part C, C.2, the toolchain group holds the digest of the declaration.
The image built from that declaration, where a run used one, is named on
the result with the executor, and nowhere in the inputs manifest.

C.3 gains a column beside confinement:

| executor | confinement | toolchain |
|---|---|---|
| **shell** | open | established only where the shell is entered from the declaration and says so; otherwise not established |
| **container engine** | confined | established: the container is the image built from the declaration |

## What it changes elsewhere

- A question in section 10 asks this and is answered by 41 and 42.
- A repository that declares no toolchain has an empty one, and every
  run on it is recorded as not established. Its passes are reusable
  only by a gate whose policy admits that.
- testledger's record 0006 says the toolchain group names the image's
  digest. A record that refines it is proposed in testledger's own log.
- A consumer that names its image by the digest of its lock file already
  has the declaration's digest and changes nothing.

## What it costs

A pass from a shell whose tools drifted from the declaration can share a
key with a pass from the image. The record says the shell did not
establish its toolchain, and a gate that cares does not count it. That
is the same trade confinement already makes, and it is the reader's to
make.
