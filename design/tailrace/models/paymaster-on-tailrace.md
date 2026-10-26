# Paymaster on tailrace

A design note for the madswan planner, 2026-10-26, on the user's word on
proposal 9: with sluice and tailrace becoming real tools, Paymaster's
design, grounded so far in flywheel's concepts, can be grounded in
tailrace for how it reconciles. It reads Paymaster's records 0039, 0040, 0042, 0043 and
0044 against the tailrace statement and says what each becomes. Nothing
here is a unit; the planner turns it into a Paymaster design record and
the units that follow it, after tailrace's Bolt 4.

## What Paymaster already is, in tailrace's words

Paymaster's close is a channel. Its records say so without the word.

| Paymaster today | tailrace |
|---|---|
| the figure set the operator sees, with its digest (0040, I1) | a version: the sheet and one manifest per act are its artifacts, named by digest in one index (4, 6) |
| the operator's one word on the sheet (0016, 0044) | an approval, which is a promotion (97): the close channel moves to the version, by a person the gate verified (129) |
| the landed tree in git, the commit as the authorization (0040) | the ledger: the promotion claim, signed, naming its predecessor, in `refs/tailrace/ledger/close` (33, 105, C.13); the manifests are in the store by digest (C.2 or C.1) |
| reconcile is level-triggered; the tree is desired state, the ledger of acts is actual state; a scheduled pass closes the difference (0042) | the target seam: desired is the channel's head (88), current is what the executor's ledger records (89), apply converges one act (90), report says what runs (91); push or pull is the environment's own (44), and a promotion event only shortens the wait (C.16) |
| the executor's obligations as a contract (0040): intent before send, lookup before create, no blind retry, hash re-checked before acting | the reconciler's: it verifies the claims it is told to require before any apply (42, core.29) and acts with the environment's own credential in its own place (45); the rest stays Paymaster's, since they are Zoho's shape and no seam's |
| the surface cannot write Zoho (0039, on Flywheel clause 181) | tailrace never holds a credential that reaches a target (45, I6); the asker that carries the card is outside the core and the operator's choice (C.16) |

Zoho is a target and Paperless is a source. Neither is tailrace's to
drive: the enumerator over Paperless stays Paymaster's, the act
performers stay Paymaster's, and tailrace holds the version, the
approval and the record of what each environment runs.

## What changes in Paymaster's records

- **0039** rests on tailrace 45 and I6 in place of Flywheel clause 181:
  the surface that asks cannot act, and the party that acts holds the
  credential, because tailrace states it, with the same safety argument.
- **0040** keeps every property it names. The tree becomes the version's
  artifacts in tailrace's store and the commit becomes the promotion
  claim in the ledger ref, which is still a file in git a person reads
  with no tooling, still content-addressed, still history. The
  obligations stay as Paymaster's reconciler contract, cited beside
  tailrace 42 and 45.
- **0042** stands as written. Tailrace says the same of every target:
  converging compares the channel's head with what runs, and a
  notification shortens the wait and decides nothing (44, C.16).
- **0043**'s three Flywheel surfaces become two of tailrace's and one of
  Paymaster's: the asker that puts the card where the operator is
  (Pending You today, a hosted tailrace later, Flywheel if it comes), the
  ledger that records the yes, and Paymaster's own enumerator over
  Paperless, which tailrace never touches. Nothing waits on Flywheel.
- **0044**'s interim shrinks: Pending You is already an authenticated,
  phone-reachable channel bound to a digest, so the Paperless note is the
  interim only until tailrace's gate and ledger exist (Bolt 4), not until
  a rail exists.
- **The roadmap's `rail` row** waits on tailrace Bolt 4 and one Paymaster
  target profile, not on three things in Flywheel.

## The one piece to build in tailrace

A target profile for Paymaster's executor: a pool of one environment, the
accounting system, converged by Paymaster's own act performers with
Paymaster's credential, reporting from Paymaster's ledger (C.12, the pool
row). It is Phase 2 by the plan, and small, since the four operations map
onto code Paymaster has: desired is a read of the channel, current and
report are reads of the ledger, apply is the existing pass over the acts.

## Sequence

1. Now: a Paymaster design record stating the mapping above and amending
   0039, 0040, 0043 and 0044's horizon; the roadmap row reworded. Nothing
   built.
2. After tailrace Bolt 4: Paymaster's approval becomes a promotion
   through Pending You as the asker; the Paperless note retires.
3. Phase 2: the Paymaster target profile; the manifests move into
   tailrace's store; the scheduled pass becomes `tailrace apply` on
   Dagu's clock, with the obligations unchanged.
