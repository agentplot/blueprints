# The billing machines

The generic track's first business process, drawn as machines in the same
format as `models/statechart/machines/`: `machine`, `version`, `kind`, `tier`,
`satisfies`, `doc`, `params`, `record`, `regions` with states, transitions
`when`/`to`, and `final: true`. The source is `../billing-brief.md`; the rulings
that shaped the mapping are `../README.md` and every one of them is followed.

Two things depart from the core files, both deliberately. Each machine carries a
`satisfies_brief:` list naming the brief's Requirement headings beside the
`satisfies:` list of core requirement numbers, so the trace runs both ways. And
every construct the core model cannot express yet carries `needs: growth-N`,
naming the growth point in `../README.md` that has to exist for it to run. The
gaps are visible in the files rather than hidden in a note.

## The files

**`unit-types/invoice-cycle@1.yaml`** — one vendor for one month, keyed on
vendor plus month. Its stages are the brief's phases, and every transition is
earned: a Paperless capture with an amount and hours moves it to
`invoice_received`, a Zoho bill written back by the booking session moves it to
`timesheet_pending`, an `ok` reconciliation class moves it to `reconciled`, a
payment reported by the Zoho adapter moves it to `paid`, and the month's proven
archive package moves it to `archived`. The escalation ladder is three
type-declared timers on `awaiting_invoice` at day 2, 7 and 14, each guarded on
the reminder count so a rung fires only after the prior one's send moved the
counter. The reconciliation check is a machine transition, not a session: it
classifies `missing`, `low`, `mismatch` or `ok` from the hours record, the
invoice hours and the vendor's expected range, and anything but `ok` raises a
`discrepancy-draft@1` elaboration while the cycle stays where it is. When no
hours record exists and no adapter can supply one, the cycle enters
`hours_asked`, a decision that names the vendor and the month and takes the
answer as a capture. `suppressed` is entered by dictation with a reason and is
never entered by the machinery.

**`unit-types/billing-month@1.yaml`** — the aggregate over its cycles. Its
`open → complete` transition is a `children:` guard over the month's cycles, and
an archive attempted early lands in `refused`, a state whose attention line
carries the incomplete vendors and their current stages. Suppressed cycles count
as complete without reconciling, which is what makes the gapless ledger workable
rather than obstructive. The package itself is produced by the
`archive-packager` session with `month.archive_proven` as the proof, and every
cycle of the month reads that proof to reach `archived`. Retention is not in
this machine at all: it is a stated fact of the WorkDrive store in
`producers.yaml`.

**`unit-types/payroll-run@1.yaml`** — one run per pay date, raised in `due` by a
scheduled producer so a payroll task exists without anyone creating it. `later`
returns the run to `due` rather than withdrawing the decision, because the brief
says a run is never silent. The processing stage writes back the OnPay run id,
the per-employee gross and net and the pay stub PDFs, and both proofs must hold
before the run is `recorded`. Year-end forms are a producer over the year's
runs, not a stage of any one of them; a run reaches `closed` when the tax year's
forms are collected against it.

**`unit-types/contract@1.yaml`** — a contract that exists to be visible before it
lapses. Its timers count down to `end_date` rather than up from the state's
entry, at 90, 60 and 30 days, folding into one numbered attention line re-raised
at each tier. An amendment does not change this unit's terms: the `amending`
state writes a new contract record whose `amends` names this one and this unit
ends as `superseded`, so the prior terms stay queryable. A contract that runs out
without renewal reaches `lapsed`, which is a fact rather than an error.

**`elaboration-types/reminder-draft@1.yaml`** — a session drafts one reminder per
vendor at the rung the timer named and sends nothing. The output is a proposal
whose one decision, batched by month, takes an answer per vendor: approve is the
yes, `edit` is a proposal edit before the yes, `skip` drops that vendor's draft.
The batch yes runs the send through the mail adapter with the sent message id as
the proof, and the reminder count and last-reminder date move on that proof and
on nothing else. Silence sends nothing. A cycle that advanced past
`awaiting_invoice` while the draft was being written takes its draft out of the
batch, so receipt cancels the chase even mid-flight.

**`elaboration-types/discrepancy-draft@1.yaml`** — the same shape over a
non-`ok` reconciliation class, with one difference that carries the brief's
ruling: the send moves the cycle's conversation history and never its stage. A
discrepancy is answered by hours arriving, not by a message going out. A cycle
that reconciles while the draft is being written drops its draft.

**`records.yaml`** — the record types the state repository enforces: `vendor`,
`hours`, `payroll-record`, `contract` and a thin `client`, each with fields,
types, mandatory flags, a key, uniqueness constraints and references. The write
gate is stated once at the top and applies to all of them: a write violating a
declared type, an enum, a reference, a mandatory field or a uniqueness
constraint is refused with the field, the constraint and the value, and the
store is left as it was. `hours` is the one ledger both sides of the business
read, which is the README's answer to the brief's largest open question. This
file answers growth point 2 and is not a machine file.

**`producers.yaml`** — the scheduled producers (`month-init` on day 1,
idempotent by key rather than by comparison; `payroll-prompt` on each pay date;
`year-end-forms` at the tax year's close) and the derived ones
(`mail-rule-sync`, which rebuilds the Paperless mail rules from the vendor
records and proves itself by reading the rule set back; `month-archive-package`,
which assembles the WorkDrive package). Every entry names its proof and its
store. The store declarations carry retention, encryption and backup as stated
facts, because a machine cannot promise seven years and a store can be asked
whether it holds them. A secrets section names each adapter's credential by name
and holds no literal token. This file answers growth points 4 and 7 and is not a
machine file.

**`../scenarios/billing.yaml`** — every Scenario of the brief as one row naming
the machine and the transition it exercises, plus one row for the payment
transition the README added. `models/statechart/conformance/` holds one scenario
per file; forty such files would bury the mapping this track exists to show, so
this is a pack using the same given/when/then vocabulary. Splitting it into
conformance-shaped files is mechanical once the growth points are real.

## The brief's Requirements, and where each is covered

| Brief Requirement | Covered by |
|---|---|
| Vendor records are the single source of truth | `records.yaml` (`vendor`, uniqueness on the sender address, deactivation ruling); `producers.yaml` (`month-init` skips inactive vendors) |
| Document intake routing derives from vendor config | `producers.yaml` (`mail-rule-sync`, proof by read-back) |
| Every active vendor gets a cycle record each month | `producers.yaml` (`month-init`, idempotent by key); `invoice-cycle@1` (initial `awaiting_invoice`); `billing-month@1` (`open`) |
| Suppression preserves a gapless ledger | `invoice-cycle@1` (`suppressed`, entered by dictation with a reason; timers and checks skip it); `billing-month@1` (suppressed counts as complete) |
| Reminders escalate on a fixed schedule | `invoice-cycle@1` (timers at 2d/7d/14d, each guarded on `reminder_count`); `reminder-draft@1` (`sending → recorded` moves the counter off the proof) |
| Outbound email is drafted by an agent and approved by a human | `reminder-draft@1` (`session` drafts, `drafted` decides, `sending` sends) |
| Arriving invoices advance their cycle automatically | `invoice-cycle@1` (`awaiting_invoice → invoice_received`). **Partial:** the unattributable-invoice scenario is an attention line on a capture that resolves to no unit, which is the core model's capture path (79) and not a construct a unit type can hold. Row B17 names it; no machine here owns it. |
| Bills are created from validated cycle data | `invoice-cycle@1` (`invoice_received` stage; the transition guard requires both the bill id and the attached document; `mark_bill_for_review` on low confidence) |
| Invoiced hours are reconciled against recorded hours | `invoice-cycle@1` (`timesheet_pending`, the four classes); `discrepancy-draft@1`; `records.yaml` (`hours`) |
| Timesheet access degrades gracefully | `invoice-cycle@1` (`hours_asked`, the `timesheet-hours-wanted` decision, the answer written as an `hours` record with source `operator`) |
| Archiving requires a complete month | `billing-month@1` (`open → refused` with the incomplete list; `complete → archived`); `producers.yaml` (`month-archive-package`) |
| Payroll runs are scheduled, recorded, and never silent | `payroll-run@1`; `producers.yaml` (`payroll-prompt`, `year-end-forms`); `records.yaml` (`payroll-record`) |
| Contract expiry is surfaced before it happens | `contract@1` (timers before `end_date`, the `amending → superseded` chain); `records.yaml` (`contract`, the linear-amendment ruling) |
| State is plain text, schema-enforced, and version controlled | `records.yaml` (`write_gate`, the reference edges); the auditability half is the state repository's one-commit-per-change, which is core (203) and asserted rather than modelled here |
| Deterministic and intelligent work are separated | Structural, and visible in every file: the reconciliation check and the month's completeness guard are machine transitions; drafting, booking, packaging and payroll are sessions whose only report is a fixed exit with named deliverables |
| Credentials are never held in configuration | `producers.yaml` (`secrets`). **Declaration only:** no machine enforces it. The enforcement is the core model's secret placement (207), and a machine that claimed to check it would be lying. |
| Sensitive records meet retention and protection obligations | `producers.yaml` (`stores.workdrive-archive`). **Declaration only:** the seven-year floor, the encryption and the backup are facts of the store. The brief's "Recoverable" scenario is a restore exercise, an operational proof no state machine can hold. |

Nothing in the brief's Requirements is unaddressed. The three partials above are
partial for the same reason in each case: the thing being asked for lives
outside a unit type, in the capture path or in a store's declaration, and
putting it in a machine would misrepresent where it is enforced. The brief's
receivables side has user stories but no Requirement headings and no state
model, so there is nothing there to cover; `records.yaml`'s `hours` type is the
hook the README's answer leaves for it.

## Validation

Every file parses as YAML. Against
`models/statechart/machines/schema.json`, the six machine files are rejected
only for the growth markers, and **all six pass unmodified once `key`,
`record_type`, `satisfies_brief`, `timers` and every `needs` are stripped** —
the states, transitions, guards, decisions, effects and submachine references
are all in the core vocabulary. The rejections are therefore an exact inventory
of what the core schema must grow:

| Rejected construct | Files | Growth point |
|---|---|---|
| `satisfies_brief` at the root | all six | none — a trace field this track adds |
| `key`, `record_type` at the root | the four unit types | growth 2, record types with a key |
| `timers` on a state | `invoice-cycle@1`, `contract@1` | growth 3, type-declared timers |
| `needs` on a state, transition or effect | all six | none — the marker itself |
| `note` inside a `decision` | `contract@1` | none — the schema allows `note` on a transition and an effect but not on a decision |

`records.yaml` and `producers.yaml` are not machine files and are rejected by
`machines/schema.json` for missing `machine`, `version`, `kind`, `tier` and
`regions`, as they should be; they need schemas of their own, which is part of
growth points 2 and 4. `../scenarios/billing.yaml` is rejected by
`conformance/schema.json` for being a pack rather than a single scenario, which
is the one deliberate shape difference noted above.

`models/statechart/machines/check.py` was not run against these files: it reads
the whole `machines/` tree, and every `ev` and `do` name these files introduce is
absent from `atoms.yaml` by construction. Extending the atoms is what growth
points 2 through 8 amount to, and doing it would mean editing `models/`, which
this work does not touch.
