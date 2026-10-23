# Environments and reconcilers

An environment is one target, the channel it follows, and whether it
moves on its own or waits for an approver (glossary). It follows exactly
one channel, and what it should run is that channel's head (40); no
environment is told a version directly.

## Converging

An environment that moves on its own converges whenever its channel's
head moves. One that waits follows a channel of its own, bound to the
one it waits on, and converges when an approver promotes it (41): `prod`
follows `prod`, bound to `stable`, and a person's yes is the promotion
of `prod` (97). An approval is a promotion, so the ledger records every
yes like every other move, and an environment never converges on a yes
the ledger does not hold. Converging changes nothing in the store and nothing about the version:
the reconciler reads the version's bytes by digest and verifies the
claims it is told to require before it applies anything (42).

Whether an environment is pushed to or pulls is the environment's own
(44). A static site, a CloudFormation stack, a function and a package
registry are pushed to, since no good pull tool stands there (C.12). A
Kubernetes cluster pulls: the channel is a tag Flux or Argo already
watches and verifies against the gate's signature, and tailrace adds
only the watcher that reports what runs. A Nix fleet pulls the same way.
The ledger, the channel and the policy are the same either way.

A reconciler acts with the environment's own credentials in the
environment's own place (45). tailrace never holds a credential that
reaches a target (64).

## What runs where

A reconciler reports what the environment runs, by digest, and when it
last converged (43, 91). A target that cannot say what it runs, a
bucket or a static site, gets a marker: the reconciler writes the
digest it applied where the target can hold one, and reports from the
marker; where the target can hold none, it reports unread with the
reason, never a guess (119). An asker learns of every environment what it
should run, what it runs, and that the two differ where they do; an
environment whose state cannot be read is reported unread with the
reason, never as converged (98).

<figure class="tr">
<svg viewBox="0 0 800 230" role="img" aria-label="Channel stable at 1.4.0. Three environments: a site that follows stable, moves on its own and runs 1.4.0; a stack that follows its own channel prod, bound to stable, and still runs 1.3.0 until prod is promoted; a cluster that follows stable and pulls the tag itself. Each reports what it runs.">
<rect x="300" y="16" width="200" height="50" rx="8" class="tr-bx-a"/>
<text x="400" y="47" text-anchor="middle" class="tr-t">stable → 1.4.0</text>
<line x1="330" y1="66" x2="130" y2="110" class="tr-ar"/>
<line x1="400" y1="66" x2="400" y2="110" class="tr-ar"/>
<line x1="470" y1="66" x2="670" y2="110" class="tr-ar"/>
<rect x="20" y="114" width="220" height="96" rx="8" class="tr-bx"/>
<text x="32" y="138" class="tr-t">site · moves on its own (41)</text>
<text x="32" y="160" class="tr-s">push: sync the bundle (C.12)</text>
<text x="32" y="182" class="tr-m">runs 1.4.0</text>
<rect x="290" y="114" width="220" height="96" rx="8" class="tr-bx"/>
<text x="302" y="138" class="tr-t">stack · follows prod, bound to stable (41)</text>
<text x="302" y="160" class="tr-s">push: one stack operation</text>
<text x="302" y="182" class="tr-m">runs 1.3.0 · prod not yet promoted (97)</text>
<rect x="560" y="114" width="220" height="96" rx="8" class="tr-bx"/>
<text x="572" y="138" class="tr-t">cluster · pulls (44)</text>
<text x="572" y="160" class="tr-s">Flux verifies the gate's signature</text>
<text x="572" y="182" class="tr-m">runs 1.4.0 · reported by watcher</text>
</svg>
</figure>
