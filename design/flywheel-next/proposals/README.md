# Proposals

Drafted requirement sections awaiting the operator's ruling. A proposal
is ratified by moving its numbered requirements into `../requirements.md`
and binding them in the model; the file is then removed.

| file | proposes | drafted |
|---|---|---|
| `cloud.md` | a serverless multi-tenant tier: batch tick from one process over many organizations, notify-primary with the poll as a backstop, a due index as a projection, the platform's shared bot for tier-1 chat, object storage only as a C.3 profile; clause amendments to 231, 166, 217d, 239, 240 and six new clauses (numbers provisional; assigned at ratification after `identity.md`) | 2026-09-07 |
| `security.md` | encryption and isolation for hosted tiers: threat model, six options, three designs (trust the service; your key, our compute; your account, our control plane), customer journeys, clauses 256–265 provisional | 2026-09-08 |
| `hosted-design.md` | the physical design for one organization on the hosted tier: the machines that exist and what each holds, one tick step by step, where the data is and what an attacker gets, the four tiers, one-shot scheduling per organization, and the OIDC-federated enterprise variant | 2026-09-08 |
