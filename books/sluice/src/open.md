# Open questions

What the design does not settle, and where each question is held. A
question leaves this page when the operator rules; the ruling lands in
the statement and the chapter that rests on it is rewritten whole.

## Held by the statement

Section 10 of the statement lists the questions that are the
statement's own, with the scenarios each would have to satisfy.

## Held by the many hosts model

`design/sluice/models/many-hosts-1.md`, section 11, holds the questions
the fleet design leaves open, with the model's lean on each:

- The lease and the sign-of-life grace as deployment settings, and
  their defaults.
- Whether a bolt's branch is ever served by a host its sessions do not
  run on.
- Where the per-repository results log lives under peers: its own ref
  with its own lease, or each branch's log under its own ref, read
  across refs before a candidate is formed.
- Plain words for what a user sees of the lead, a claim and an
  executor.
- Who starts `sluice run` on each host, and what documents that it must
  be up everywhere under peers.

## Awaiting a ruling

`design/sluice/proposals/many-hosts-3.md` drafts 72 to 82,
85 to 88 and 107 to 113 with the glossary entries and Part C rows they need. Until
they are ratified, the many hosts chapter describes a proposal, and
the statement stands as written.
