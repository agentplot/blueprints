# The generic track — business processes on the flywheel

The flywheel is a loop over a state repository: captures arrive, machines
evaluate, decisions are raised and answered, sessions do the judgment work,
effects run with proofs. Nothing in that loop says "code". This track tests the
claim by mapping one real business process onto the model unchanged, and lists
exactly where the model has to grow.

The first process is Mad Swan's billing operations (billing-brief.md, filed
2026-09-07). Its two principles are the flywheel's own: deterministic where
possible and intelligent where necessary is machines versus sessions; the
ledger has no gaps is the state repository with numbers never reused (15).

## The mapping

| brief | flywheel-next |
|---|---|
| the business | an organization (218) with a state repository and a blueprints repository and no built repository at all |
| `invoices.rec`, plain text, schema-enforced, versioned | the state repository: records as files, one commit per change (35, 41), the type's schema as the write gate; recutils is one serialization the record store may use, never the model |
| Vendor | a record of a `vendor` record type in the state repository; rarely changed; the source the mail-rule producer derives from |
| Paperless mail rules generated from vendors | a deliverable producer (190) with a store on the Paperless host: rebuild is idempotent, proof is the rule set read back |
| InvoiceCycle | a unit of a new unit type `invoice-cycle@1` whose stages are the phases; vendor plus month is the unit's key |
| phases earned, not asserted | stage transitions on captures with evidence (46): Paperless document capture, Zoho bill written back, timesheet hours captured, archive package proven |
| month-initialization on day 1, idempotent | a scheduled producer: one capture per active vendor per month, the unit created if absent, unchanged if present (72) |
| suppression with a reason | the unit's `suppressed` stage entered by a response; timers, producers and checks skip it; it still counts in the month |
| escalation ladder days 2, 7, 14 | timers on the `awaiting_invoice` stage, each raising one elaboration session of type `reminder-draft` conditional on the reminder count |
| drafts to the human's channel with approve/edit/skip | a proposal (172) with one decision per vendor, delivered to the operator's chat sink and the page; approve is the yes, edit is a proposal edit (184), skip is drop |
| approval sends, silence does not | a response is the only thing that acts (153); the effect is the send, with the sent message id as proof; the count and last-reminder date move on the proof |
| unattributable invoice | a capture that resolves to no unit lands under attention with its document id (79) |
| bill creation, PDF attached | a session of type `book-bill` running Zoho and Paperless adapters as effects with proofs; the bill id written back moves the stage |
| low-confidence extraction | the bill is created marked for review and the unit carries an attention line, not a stage |
| reconciliation classes | a deterministic check the machine runs on the tick; `ok` advances; anything else raises a `discrepancy-draft` elaboration and a decision |
| timesheet hours unavailable | an adapter gap: the machine raises a decision asking the operator for the hours; the answer is a capture from the capture box (19); re-check on the next tick |
| month-end archive | a `billing-month` unit aggregating its cycles; its `archive` transition is refused with the list of incomplete vendors and their stages until every unsuppressed cycle is `reconciled`; the archive package is a producer into WorkDrive with proof |
| payroll runs | a `payroll-run@1` unit type created by a scheduled producer on each pay date; the OnPay result written back by a session; year-end forms as a producer over the year's units |
| client contracts | a `contract@1` unit type with timers at 90, 60 and 30 days before the end date, each an attention line naming the client; an amendment is a new record referencing the prior, never an overwrite |
| workflows return JSON, agent consumes | machines produce work orders and context tables (226); sessions return structured outcomes; no prose crosses the boundary |
| external mutations by the agent, written back | effects with proofs (writeback), run by a session on a host that has the adapter and its secret |
| credentials from the secret manager | 204 and 207: a secret is placed on the host, referenced by name, never in configuration |
| seven-year retention, encrypted, backed up | a deliverable store declaration (227) on the archive producer: WorkDrive as the store, retention as a stated fact of the store, the state repository itself holding the index |

## What the model must grow

1. **An organization with no built repository.** 219 lists repositories by
   URL; nothing forbids zero, but the bootstrap, the map and the runway
   readings assume construction. A process organization has elaboration
   sessions and effects and never a build. Runway must read as units drained
   by sessions of any kind.
2. **Record types.** Today's deliverables are files a producer writes. A
   process needs typed records in the state repository with a schema, a key,
   uniqueness and references, and refusal on violation as the write gate.
   Vendor, contract and payroll are records; a cycle is a unit whose fields
   are a record.
3. **Timers declared by the type.** Stage timers exist for sessions (stall
   clocks) and hosts. A unit type must declare its own timers per stage, with
   what each raises, and a suppressed stage that silences them.
4. **Scheduled producers.** A producer that runs on a calendar (day 1, pay
   dates) rather than on a capture. The scheduler already exists on the hosted
   tiers (A.34) and as the host's own timer locally.
5. **Aggregate units.** A unit whose transition is gated on sibling units
   (the month over its cycles), with the refusal naming the blockers.
6. **Elaboration outputs as proposals to people outside the organization.**
   A draft to a vendor is a proposal whose yes sends mail. The effect runs
   through a mail adapter with the message id as proof.
7. **Adapters as packages:** Paperless (webhook in, rules and documents out),
   Zoho Books, WorkDrive, OnPay, mail. Each is a per-host package with a
   secret placed under 207 and a platform it runs on.
8. **The operator as a data source.** The capture box already admits a
   capture from a person; the model needs the machine to *ask* for a datum
   (the timesheet hours) as a decision whose answer is that capture.

## The brief's open questions, answered by the model

- **Where state lives:** the state repository, engine-managed, one commit per
  record change. Not an agent's workspace file. The agent has no state of its
  own (A.10).
- **Approval channel:** the operator's chat sink and the page, as decisions.
  An approval resumes nothing: the response is recorded and the next tick runs
  the effect. There is no session to resume, which is the ergonomic answer.
- **Receivables:** one hours ledger, two unit types. The `hours` record is
  written once per vendor-month by the timesheet capture and read by both the
  payables reconciliation and a future `client-invoice@1` type. One system.
- **Timesheet access:** phase 1 is the ask-the-operator decision above; the
  Zoho People adapter is a package added later with no change to the type.
- **Payment status:** a Zoho Books capture (bill paid) is one more earned
  transition, `paid`, between `reconciled` and `archived`, once the adapter
  reports it.

## Phasing

This process runs after phase 1 of the flywheel (the loop) is real on willdan
work, as the first organization of the generic track: an organization with
records, timers, scheduled producers and adapters and no code. The machines
and scenario packs drawn from the brief are in models/ beside the core; the
brief's scenarios are the acceptance file (192).
