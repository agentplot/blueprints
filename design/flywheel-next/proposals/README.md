# Proposals

Drafted requirement sections awaiting the operator's ruling. A proposal
is ratified by moving its numbered requirements into `../requirements.md`
and binding them in the model. A file whose clauses are ratified is kept
only where its narrative is still worth reading; its clause section is
then a pointer to the section that carries them.

| file | proposes | drafted |
|---|---|---|
| `cloud.md` | a serverless multi-tenant tier: batch tick from one process over many organizations, notify-primary with the poll as a backstop, a due index as a projection, the platform's shared bot for tier-1 chat, object storage only as a C.3 profile, and the Fly-versus-Lambda comparison. Its clause section is **ratified as A.34, clauses 268–278** | 2026-09-07 |
| `security.md` | encryption and isolation for hosted tiers: threat model, six options, three designs (trust the service; your account by federation; your account, our control plane) and customer journeys. Its clause section is **ratified as A.33, clauses 256–267** | 2026-09-08 |
| `hosted-design.md` | the narrative behind **A.34**: the physical design for one organization on the hosted tier, the machines that exist and what each holds, one tick step by step, where the data is and what an attacker gets, the four tiers, one-shot scheduling per organization, and the OIDC-federated enterprise variant. Kept as narrative; nothing here awaits a ruling | 2026-09-08 |
| `control-plane.md` | the two products — the open-source binary and the commercial control plane — the invocation contract as the public line between them, the control plane as an installable Switchboard composition with the tenancy choices as parameters, the willdan instance worked, and what stays ours. Its clause section is **ratified as A.37, clauses 296–305** | 2026-09-08 |
| `claims-as-specs.md` | claims as OpenSpec requirement blocks in the blueprints' standing specifications, as-built as the built repository's standing specifications naming the claim, the ledger comparing the two, the book including claims by anchor and the context map supplying scope. **Amends 97, 99, 105, 192 and the glossary**; replaces model.md 8.1 and 12.12 | 2026-09-08 |
| `plans.md` | the narrative behind **A.35**: the commercial ladder over the four tiers — Free, Hobby, Pro, Team, Enterprise — the `fw.ff.*` entitlements and the plan limits, the one-screen cloud-agent form, and presets as bundle packages. Kept as narrative; nothing here awaits a ruling | 2026-09-08 |
