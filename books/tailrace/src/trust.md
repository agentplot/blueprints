# Offered, accepted, released

An artifact is in one of three states, and each is a different party's
word.

| state | who put it there | what it means |
|---|---|---|
| offered | a publisher (20) | someone pushed these bytes and attached these claims |
| accepted | the gate (25) | the claims satisfy the policy for acceptance |
| released | a promotion (32) | a channel names this version |

## Offering is never trusting

A publish offers (20). Any host that builds can offer, and a stolen
build credential can offer too; what it offers sits unaccepted and
attributable, and reaches no channel and no environment (S9). The
credential that offers and the credential that accepts are never the
same (27), and no host that builds holds the latter (96). One person
with one host is the exception the policy may name (108): that host
offers and accepts, its acceptance claim says it accepted what it
offered, and a policy for a channel may require an acceptance from a
separated gate instead.

## The gate accepts

Only the gate accepts (25). It judges an offered version when a publish's
answer tells it of one or an approver or a rule the policy names asks,
under the accepting credential, in a place no offering credential
reaches (95). It reads the claims attached to the offered
index and the policy for acceptance at the governed branch's landed
head at the moment it judges (65, 107), so a landed change of policy
binds every judgment after it and none before. It counts each claim
only through a signer the policy names, for the kinds of claim the
policy binds that signer to and, for a verdict, the checks (9, 116). A
claim that counted at acceptance keeps counting after its signer's
identity expires (117); a layout policy that wants a signature still
valid says so itself. A version
one of whose artifacts is refused is refused whole, naming the artifact
(28). Acceptance changes no bytes: the accepted artifact has the digest
it was offered with, and the acceptance is itself a claim attached to it
(26).

The gate never rebuilds, never looks inside bytes beyond their digest,
and asks nothing but the store, the landing and the policy whether to
accept (29). It
judges claims against a policy, nothing else, so it is small, runs in
the owner's trusted place, and holds the one credential that can accept
and promote.

## A rebuild is a claim, never the gate's work

Where the policy for a channel asks for an independent rebuild, a signer
other than the one that built rebuilds from the same revision with no
shared cache (30, 55) and attaches a claim: the digests of the outputs
matched, or did not (112); packed bytes are compared as well only where
the projection promises them. A teammate's host, a second fleet, a peer that the first builder
does not control. The gate counts the claim and never makes the rebuild,
so the trusted center stays a verifier and never becomes a build farm.
A rebuild proves bytes match a revision; it never proves the revision is
sound, and review happens before the landing (section 8).

## What withdraws

Nothing accepted is ever un-accepted (94). A version found wanting after
acceptance is left by a promotion that moves the channel away from it
(38); the version stays accepted and readable by digest, and the ledger
holds why the channel left.
