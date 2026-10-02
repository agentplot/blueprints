# Proposals

Drafted clauses awaiting the operator's ruling. A proposal is ratified by
moving its numbered clauses into `../requirements.md`; until then the
statement stands as written and nothing here binds a model.

| file | proposes | drafted |
|---|---|---|
| `the-toolchain-is-declared.md` | the toolchain part of a key is what the repository declares a check runs with, so a shell and a container on the same declaration share a key; whether a run used it is the executor's to state, as confinement is. **Proposes 41 and 42; amends C.2** | 2026-10-02 |
| `trust-needs-a-voucher.md` | a record counts as an executor's only when an identity the policy names vouches for it; a replay by a build tool's cache is not a run; an error is read as missing. **Proposes 9a and 19a; amends 18** | 2026-10-02 |
| `records-travel-with-git.md` | a result store carried by git, so a pass proven in a checkout is read by a gate on a server after a push. **A C.4 profile; Parts A and B unchanged** | 2026-10-02 |
