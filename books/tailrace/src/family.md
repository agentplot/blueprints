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
signer for sluice's verdicts is the same signer in tailrace's policy.

## Switchboard

Switchboard, a client's delivery platform, keeps its own channels,
promotion, gate and deploy rows, in its own control plane. The model is
shared and the code is not: a version, a channel moved only by a
promotion, an environment subscribed to a channel with an automatic or a
gated move, are the same concepts on both sides, and a client's
production never depends on a personal project.

Where the two meet is the store and the claims. Switchboard's registry
is an OCI registry in each of its classes; a tailrace publish into it
offers the same artifacts with the same attestations (C.1), and
Switchboard's own indexer reads the push and writes the proof rows its
gate reads. tailrace's channels are off in that deployment, and the
publish's answer (19) is what Switchboard consumes. The one rule both
keep is that a channel is a row of its own system, never a tag read to
decide a version (3; Switchboard's lifecycle.4).

## Nix, Attic and a fleet

A Nix fleet is a target that pulls (C.12): each machine verifies the
release assigned to it and realises store paths from a cache. Whether
the cache is Attic, layered under tailrace with a small signed artifact
naming the closure's root, or the store itself serving the binary-cache
protocol as one more projection, is an [open question](open.md) that a
measurement answers, not a ruling.
