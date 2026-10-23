# tailrace — interview 1, the rulings

The operator ruled on 2026-10-22 in a session, question by question
from `interview-1.md`, with the moon cache question from the book's open
page ruled the same day. Each row names where the ruling landed in the
statement: a clause from 105, or the clause rewritten.

| question | ruling | landed |
|---|---|---|
| Q1 (22) | confirmed as the review reworded it | 22 |
| A, Q2 (101, 33, 39) | the ledger is a chain of gate-signed promotion claims, each naming its predecessor; the chain is the truth, and where it is kept is a seam, the keeper. The standalone tool keeps it in a git ref the gate pushes, and the same claims are attached in the store; a hosted backend would name its own append-only log; the store alone keeps it only where it retains referrers | 105, 106, 120 to 122, C.13, C.14, glossary, givens |
| Q3 (29, 65) | the gate reads the policy at the governed branch's landed head when it judges | 107 |
| Q4 (37) | a bound channel takes any version the ledger shows the bound channel held, so a rollback to a version beta has left is allowed | 37 |
| B (27, 96) | a solo host may offer and accept under a policy that names it as the gate, and the acceptance claim says so | 27, 96, 108 |
| Q18 (31, 36) | a store without expected-digest moves is moved, read back, and a lost race reported and repaired from the ledger | 109 |
| Q5 (41, 97) | an approval is a promotion; an environment that waits follows its own channel bound to the one it waits on | 41, 97, actors, S6 |
| Q10 (21) | one version per publish, every artifact at it | 110 |
| Q11 (18) | a repeat publish that packs different bytes is refused naming the artifact | 18 |
| Q12 (16, 75, 78) | the build's pass and the landing's verdict must both hold where both exist | 111 |
| Q20 (16, 74) | ensure is one asking for every output; a partial answer refuses the version whole | 74 |
| Q13 (30, 55, 87) | a verifier compares output digests; packed bytes only where the projection promises them | 112 |
| C (47, 65) | a consuming repository's own policy at its landed revision governs its layouts | 113 |
| Q7 (47, 99) | a file layout's refusal is answered to whoever rendered; serve answers the client's request | 99 |
| Q8 (49) | one serving process per host at a fixed name and port, the repository in the path; a per-host port names a host | 114 |
| Q14 (61, 62) | the version claims are the repository's; render records are the host's | 62 |
| Q19 (86, 60) | the host runs serve while a client needs it; a miss is a render | 115 |
| Q16 (9, 82) | a signer is bound by claim kind and, for verdicts, by check; never by output or ecosystem | 116 |
| Q15 (25, 81) | a claim that counted at acceptance keeps counting after its signer expires; a layout policy may require a live signature itself | 117 |
| Q17 (92) | the host's bindings are one file beside the landing's own, in the same form | 118 |
| Q6 (43, 89, 98) | a reconciler leaves a marker where the target admits one; unread otherwise | 119 |
| Q9 (52, 54) | open; a measurement answers it | section 10 |
| moon cache (C.3, C.11) | a sync projection into moon's outputs directory, rendered from the task hashes the landing's verdicts name; serve is not needed for moon | C.3, C.11 |

## What the operator said beyond the leans

- On A: the family's habit of keeping records in git is not a reason.
  The ruling rests on the chain being the truth and the keeper a seam,
  so a button on a phone asks the gate and the gate writes wherever the
  profile says; nobody's device commits.
- On Q8: one daemon per host, never one per worktree, because the
  policy is read at the landed revision and every checkout of one
  repository sees the same view.
