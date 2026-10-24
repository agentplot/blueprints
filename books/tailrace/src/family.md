# How it fits

tailrace is one of a family of tools that turn what happens outside a
repository into work that lands in it, and then into software that runs.
headwater and eddy notice; millpond keeps the inbox; flume carries work
into a worktree; sluice lands it; tailrace carries what landed to where
it runs. Each tool stands alone, and each one's site is its own.

## sluice and moon

tailrace reads two things from the tools before it, and neither knows
tailrace exists. From moon it reads the task hash and the declared
outputs of each task the repository publishes (C.3). From sluice it
reads whether a revision landed and the signed verdicts of the landing
(C.5). The task hash is the join: sluice's verdict carries it as the
subject's digest, and tailrace's provenance names it (13). sluice has no
hook after a landing, and tailrace needs none: whoever turns the wheel
after a landing, a watcher that follows sluice's log, a plan's step or a
person, runs the same publish (20).

sluice's signers and tailrace's are one thing: an identity
that signs an in-toto statement in a DSSE envelope, named in a policy
with what it may claim (9; sluice's core.22). A host that is a trusted
signer for sluice's verdicts is the same signer, under the same name, in
tailrace's policy (104).

## Switchboard

Switchboard, a client's delivery platform, keeps which installs follow a
channel, how a cascade of compositions reaches them, and the deploy that
converges each one, in its own control plane. tailrace owns what a
version is, which claims it carries, which channel names it and why.
The model is shared and the code is not, and a client's production
never depends on a personal project.

The join is three bindings. The class's registry is tailrace's store
(C.1): a publish into it offers the same artifacts with the same
attestations, and Switchboard's indexer reads the push and writes its
own rows from the claims. The class's table is tailrace's ledger
(C.15): the gate appends each promotion in one conditional write, and
the rows Switchboard keeps beside the chain are written in the same
transaction and read as projections (101). Switchboard's dispatch is
the reconciler of one tailrace target, a pool (C.12): its roster says
which installs of a declared kind follow which channel and whether each
waits (126), and `apply` is its request to converge one of them. The
channels are tailrace's, held in the ledger Switchboard binds, and the
one rule both keep is that a channel is a row of its own system, never
a tag read to decide a version (3).

## Nix, Attic and a fleet

A Nix fleet is a target that pulls (C.12): each machine verifies the
release assigned to it and realises store paths from a cache. Whether
the cache is Attic, layered under tailrace with a small signed artifact
naming the closure's root, or the store itself serving the binary-cache
protocol as one more projection, is an [open question](open.md) that a
measurement answers, not a ruling.
