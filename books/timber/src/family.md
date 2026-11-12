# How it fits

timber is one of a family of tools that turn what happens outside a
repository into work that lands in it, and then into software that runs.
headwater and eddy notice; millpond keeps the inbox; flume carries work
into a worktree; sluice lands it; timber carries what landed to where
it runs. Each tool stands alone, and each one's site is its own.

## sluice and moon

timber reads two things from the tools before it, and neither knows
timber exists. From moon it reads the task hash and the declared
outputs of each task the repository publishes (C.3). From sluice it
reads whether a revision landed and the signed verdicts of the landing
(C.5). The task hash is the join: sluice's verdict carries it as the
subject's digest, and timber's provenance names it (13). sluice has no
hook after a landing, and timber needs none: whoever turns the wheel
after a landing, a watcher that follows sluice's log, a plan's step or a
person, runs the same publish (20).

sluice's signers and timber's are one thing: an identity
that signs an in-toto statement in a DSSE envelope, named in a policy
with what it may claim (9; sluice's core.22). A host that is a trusted
signer for sluice's verdicts is the same signer, under the same name, in
timber's policy (104).

## Switchboard

Switchboard, a client's delivery platform, keeps which installs follow a
channel, how a cascade of compositions reaches them, and the deploy that
converges each one, in its own control plane. timber owns what a
version is, which claims it carries, which channel names it and why.
The model is shared and the code is not, and a client's production
never depends on a personal project.

The join is three bindings. The class's registry is timber's store
(C.1): a publish into it offers the same artifacts with the same
attestations, and Switchboard's indexer reads the push and writes its
own rows from the claims. The class's table is timber's ledger
(C.15): the gate appends each promotion in one conditional write, and
the rows Switchboard keeps beside the chain are written in the same
transaction and read as projections (101). Switchboard's dispatch is
the reconciler of one timber target, a pool (C.12): its roster says
which installs of a declared kind follow which channel and whether each
waits (126), and `apply` is its request to converge one of them. The
channels are timber's, held in the ledger Switchboard binds, and the
one rule both keep is that a channel is a row of its own system, never
a tag read to decide a version (3).

## Nix, Attic and a fleet

A Nix fleet is two of timber's targets (C.12). A machine's closure is
one small artifact, named by its digest, whose file names the closure's
roots as store paths. The fleet's cache, Attic, holds the paths
themselves, so the store keeps nothing that a removal of untagged
objects could leave half held (52, 54). The cache target checks every
root valid in the host's own Nix store and uploads through Attic's own
client what the cache lacks.

The clan target switches one machine from a host that holds its key and
writes a marker of the index applied. The host signs a report beside
the version, and a channel that comes after the machines follows their
newest reports (119, 43). A pull profile, each machine switching on its
own timer, replaces the push machine by machine.
