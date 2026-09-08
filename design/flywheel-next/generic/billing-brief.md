# Business Billing Operations — Requirements Brief

> Status: BRIEF — consolidates prior planning scattered across `__mac-nix`, `swancloud`,
> and `~/Documents` into a single declarative requirements statement. Nothing here is
> implemented yet beyond infrastructure primitives.
>
> Filed 2026-09-07 by Chuck as the first business process for the generic track; the
> mapping onto the flywheel-next model is in README.md beside this file.

## Intent

Mad Swan runs a small consulting business on top of three subcontractors and a handful of
clients. Every month the same loop repeats: chase subcontractors for invoices, file what
arrives, reconcile the hours claimed against the hours actually recorded, book the result
as a payable, pay it, and archive the whole package for the accountant. On the other side
of the ledger, client work has to be billed and contracts have to be renewed before they
lapse.

Today this loop runs on human memory. The goal is a system where the *state* of the month
is a queryable fact rather than a feeling — where "who hasn't invoiced yet" and "which
bill is unreconciled" are one query away, where reminders escalate on a schedule without
anyone deciding to send them, and where the paper trail assembles itself.

The design principle throughout is **deterministic where possible, intelligent where
necessary**. Querying state, validating hours, and creating records are mechanical and
belong in workflows. Drafting a reminder email that reads like a person wrote it,
investigating why a timesheet is short, deciding whether an anomaly matters — those are
judgment calls and belong to an agent. The two halves hand off through structured JSON,
never through prose.

The second principle is **the ledger has no gaps**. A month where a subcontractor was on
leave still gets a record, marked suppressed with a reason. A vendor who leaves is
deactivated, not deleted. Auditability beats tidiness.

## Domain Model

Two entities carry the whole payables side.

A **Vendor** is a subcontractor: identity, the email address their invoices arrive from,
their Zoho Books contact ID, the line-item category their work books to, the range of
hours that counts as a normal month for them, and whether they are still active. Vendor
records change rarely and are the single source of truth for downstream configuration —
notably the Paperless mail rules, which are generated from vendor records rather than
clicked into a UI.

An **InvoiceCycle** is one vendor for one month. It carries a phase, a suppression flag,
reminder counters, and the artifacts accumulated as the month progresses: the Paperless
document ID, the invoice amount and hours, the timesheet hours, the Zoho bill ID, the
archive date. Vendor plus month is unique.

The phase is a state machine, and each phase implies every prior phase is complete:

```
awaiting_invoice ──► invoice_received ──► timesheet_pending ──► reconciled ──► archived
                                                │
                                                ▼
                                   (contact contractor re:
                                    missing or sparse timesheet)
```

Transitions are earned, not asserted: an invoice PDF landing in Paperless moves the cycle
to `invoice_received`; a created Zoho bill moves it to `timesheet_pending`; timesheet
hours matching invoice hours within threshold moves it to `reconciled`; a WorkDrive
archive package moves it to `archived`.

The receivables side — client contracts and client invoicing — has user stories and
folder conventions from the earlier PARA work but no state model yet. That is the
principal gap (see Open Questions).

## Requirements

### Vendor Roster

#### Requirement: Vendor records are the single source of truth

The system SHALL maintain vendor configuration in one queryable store, and SHALL derive
all downstream vendor-specific configuration from it.

##### Scenario: Vendor record carries billing identity
- **WHEN** a vendor record is examined
- **THEN** it includes a stable id, display name, invoice sender email address, Zoho Books
  contact id, Zoho Books line-item type, expected monthly hours range, and an active flag

##### Scenario: Vendor record carries document-routing metadata
- **WHEN** a vendor record is examined
- **THEN** it includes the Paperless correspondent name, document type, and tags to be
  auto-assigned to that vendor's incoming invoices, and MAY include an email subject
  pattern for tighter filtering

##### Scenario: Deactivation stops future cycles without erasing history
- **WHEN** a vendor's active flag is set to false
- **THEN** no new invoice cycles are created for that vendor in future months
- **AND** all historical cycles for that vendor remain intact and queryable

#### Requirement: Document intake routing derives from vendor config

The system SHALL generate Paperless mail rules from vendor records rather than requiring
manual UI configuration.

##### Scenario: Adding a vendor creates their intake path
- **WHEN** a new vendor record is added and the mail-rule sync runs
- **THEN** a Paperless mail rule exists that filters incoming mail by that vendor's sender
  address

##### Scenario: Matched invoices are classified on arrival
- **WHEN** an email matching a vendor's mail rule is ingested
- **THEN** Paperless assigns document type "Vendor Invoice", the correspondent matching
  that vendor, and the tags from the vendor record

##### Scenario: Mail rules are reproducible
- **WHEN** Paperless mail rules are lost or the instance is rebuilt
- **THEN** running the sync from vendor records restores the complete rule set

### Monthly Cycle

#### Requirement: Every active vendor gets a cycle record each month

The system SHALL open an invoice cycle for each active vendor at the start of each month.

##### Scenario: Month opens with a full slate
- **WHEN** the month-initialization runs on day 1
- **THEN** an invoice cycle exists for every active vendor for that month, in phase
  `awaiting_invoice`

##### Scenario: Initialization is idempotent
- **WHEN** month-initialization runs and a cycle already exists for a vendor and month
- **THEN** the existing cycle is left unmodified and no duplicate is created

#### Requirement: Suppression preserves a gapless ledger

The system SHALL support skipping a specific vendor-month without omitting the record.

##### Scenario: A suppressed month is recorded, not skipped
- **WHEN** a vendor is not expected to invoice for a given month
- **THEN** a cycle record exists for that vendor and month with a suppression flag set and
  a stated reason

##### Scenario: Suppressed cycles are inert
- **WHEN** any reminder, bill-creation, or timesheet check evaluates a suppressed cycle
- **THEN** the cycle is skipped and no email, bill, or discrepancy report is produced for it

### Invoice Collection

#### Requirement: Reminders escalate on a fixed schedule

The system SHALL chase outstanding invoices on a defined escalation ladder rather than ad hoc.

##### Scenario: Escalation ladder
- **WHEN** a cycle remains in `awaiting_invoice`
- **THEN** a reminder is drafted on day 2 (friendly), day 7 (more direct), and day 14
  (firm but professional), each conditional on the prior reminder count

##### Scenario: Receipt cancels the chase
- **WHEN** a cycle has advanced past `awaiting_invoice`
- **THEN** no further reminders are drafted or sent for that cycle

##### Scenario: Reminder history is recorded
- **WHEN** a reminder is sent
- **THEN** the cycle's reminder count is incremented and the last-reminder date is set

#### Requirement: Outbound email is drafted by an agent and approved by a human

The system SHALL NOT send vendor-facing email without explicit human approval.

##### Scenario: Drafts are presented for approval
- **WHEN** reminders are due
- **THEN** the agent drafts each email and delivers the drafts to the human's messaging
  channel with per-vendor approve / edit / skip options

##### Scenario: Approval sends, silence does not
- **WHEN** the human approves one or more drafts
- **THEN** only the approved messages are sent, and cycles are updated only for those sent

#### Requirement: Arriving invoices advance their cycle automatically

The system SHALL detect newly ingested vendor invoices and reflect them in cycle state.

##### Scenario: New invoice detected
- **WHEN** a document tagged as a vendor invoice appears in Paperless
- **THEN** the matching cycle records the Paperless document id, the invoice amount, the
  invoice hours, and the received date, and moves to `invoice_received`

##### Scenario: Unattributable invoice is escalated, not guessed
- **WHEN** an ingested invoice cannot be matched to an active vendor and month
- **THEN** the system reports it for human resolution rather than creating or modifying a cycle

### Payables in Zoho Books

#### Requirement: Bills are created from validated cycle data

The system SHALL create a Zoho Books vendor bill for each received invoice, using the
vendor's stored booking identity.

##### Scenario: Bill uses stored booking identity
- **WHEN** a bill is created for a cycle
- **THEN** it uses the vendor's Zoho contact id and line-item type from the vendor record,
  with the amount and hours from the invoice

##### Scenario: Source document travels with the bill
- **WHEN** a bill is created
- **THEN** the invoice PDF retrieved from Paperless is attached to the Zoho Books bill

##### Scenario: Bill creation advances the cycle
- **WHEN** a bill is created successfully
- **THEN** the cycle records the Zoho bill id and moves to `timesheet_pending`

##### Scenario: Low-confidence extraction is flagged
- **WHEN** extracted invoice data is below the confidence threshold
- **THEN** the bill is marked for human review in Zoho Books rather than treated as final

### Reconciliation

#### Requirement: Invoiced hours are reconciled against recorded hours

The system SHALL compare hours billed on the invoice against hours recorded in timesheets
before a cycle is considered reconciled.

##### Scenario: Discrepancy classification
- **WHEN** a reconciliation check runs for a cycle
- **THEN** it classifies the result as `missing` (no timesheet hours), `low` (below the
  vendor's expected minimum), `mismatch` (differs from invoice hours beyond threshold), or `ok`

##### Scenario: Only clean cycles reconcile
- **WHEN** the classification is `ok`
- **THEN** the cycle moves to `reconciled`

##### Scenario: Discrepancies produce a conversation, not a state change
- **WHEN** the classification is anything other than `ok`
- **THEN** the agent drafts a contextual message to the contractor explaining the specific
  discrepancy, and the cycle remains in `timesheet_pending`

#### Requirement: Timesheet access degrades gracefully

The system SHALL function without automated timesheet access, requesting the data from the
human instead of blocking.

##### Scenario: No automated source available
- **WHEN** timesheet hours are unavailable through an API for a cycle in `timesheet_pending`
- **THEN** the agent requests the hours from the human, names the vendor and month, and
  re-checks on the next scheduled run

### Month-End Archive

#### Requirement: Archiving requires a complete month

The system SHALL refuse to archive a month while any non-suppressed cycle is unreconciled.

##### Scenario: Incomplete month is rejected with specifics
- **WHEN** archive is attempted and one or more non-suppressed cycles are not reconciled
- **THEN** the operation fails and names each incomplete vendor and its current phase

##### Scenario: Complete month produces an archive package
- **WHEN** every non-suppressed cycle for the month is reconciled
- **THEN** an archive package containing the month's invoice documents and a summary of
  vendors, amounts, and hours is created in Zoho WorkDrive
- **AND** every cycle in the month moves to `archived` with the archive date recorded

### Payroll

#### Requirement: Payroll runs are scheduled, recorded, and never silent

The system SHALL prompt for each payroll run on schedule and retain a record of each run.

##### Scenario: Scheduled prompt
- **WHEN** a payroll date arrives
- **THEN** a payroll task is raised without anyone having created it manually

##### Scenario: Run is recorded with artifacts
- **WHEN** a payroll run is processed in OnPay
- **THEN** a payroll record captures the pay period, pay date, and per-employee gross and
  net amounts, with the pay stub PDFs attached

##### Scenario: Year-end forms are collected
- **WHEN** the tax year closes
- **THEN** W-2 and W-3 documents are collected against that year's payroll records

### Client Contracts

#### Requirement: Contract expiry is surfaced before it happens

The system SHALL track client contract terms and alert ahead of renewal dates.

##### Scenario: Contract carries commercial terms
- **WHEN** a contract record is examined
- **THEN** it includes client, start date, end date, value, terms, and the source PDF

##### Scenario: Tiered renewal alerts
- **WHEN** a contract's end date is 90, 60, or 30 days out
- **THEN** an alert is raised naming the client and remaining days

##### Scenario: Amendments do not overwrite history
- **WHEN** a contract is amended
- **THEN** the amendment is recorded against the contract without discarding the prior terms

### Cross-Cutting

#### Requirement: State is plain text, schema-enforced, and version controlled

The system SHALL store operational state in a format that produces meaningful git diffs
and enforces field types and referential integrity.

##### Scenario: Schema violations are caught
- **WHEN** a record is written that violates a declared type, enum, foreign key, mandatory
  field, or uniqueness constraint
- **THEN** the write is rejected

##### Scenario: Changes are auditable
- **WHEN** any state change occurs
- **THEN** it is committed to version control as a readable, per-record diff

#### Requirement: Deterministic and intelligent work are separated

The system SHALL confine querying, filtering, validating, and record updates to
deterministic workflows, and confine drafting, judgment, and external service calls to the
agent, with structured data as the interface between them.

##### Scenario: Workflows return data, not prose
- **WHEN** a workflow completes
- **THEN** it emits structured JSON that the agent consumes

##### Scenario: External calls originate from the agent
- **WHEN** a Zoho Books, WorkDrive, or Paperless mutation is required
- **THEN** the agent performs it and writes the result back into cycle state

#### Requirement: Credentials are never held in configuration

The system SHALL resolve every API credential from the secret manager at run time.

##### Scenario: No literal secrets
- **WHEN** any service configuration is examined
- **THEN** it references a secret by name and contains no literal token, key, or password

#### Requirement: Sensitive records meet retention and protection obligations

The system SHALL retain financial and tax records for the legally required period and
store them on encrypted storage with backups.

##### Scenario: Retention floor
- **WHEN** tax-relevant documents are archived
- **THEN** they remain retrievable for at least seven years

##### Scenario: Recoverable
- **WHEN** a restore is exercised
- **THEN** archived financial documents are recoverable from backup

## Current State

Infrastructure primitives exist; the operational layer does not.

| Piece | Status |
|-------|--------|
| Paperless-ngx service (microvm, OIDC, backup) | Deployed in swancloud |
| Zoho Books / WorkDrive / Mail MCP registration | Specified and registered in `__mac-nix` |
| Recutils package + agent skill | Specified and deployed |
| Lobster workflow deployment convention | Specified |
| Agent workspace bootstrap pattern | Specified; `~/.openclaw/workspace-jared/` exists |
| `invoices.rec` (vendor + cycle data) | **Not created** |
| Invoice workflows (init, check, bill, reconcile, archive) | **Not created** |
| Paperless mail rules + sync workflow | **Not created** |
| Cron schedule | **Not created** |
| Client invoicing / receivables | **No design** |

## Open Questions

**Receivables are undesigned.** The stated ambition is to generate client invoices in Zoho
Books, but there is no state model, no trigger, and no source of billable quantities.
Whether client invoices derive from the same timesheet data that reconciles subcontractor
invoices — and therefore whether the payables and receivables loops share a single hours
ledger — is the first thing to settle, because it determines whether this is one system or
two.

**Timesheet access has no chosen path.** Zoho exposes no timesheet MCP tooling. The
options, in preference order, are extending the Zoho MCP server with People/Projects
timesheet endpoints, writing a thin REST wrapper as a skill, manual entry, or browser
automation. Phase 1 assumes manual entry so the rest of the loop can be built and
validated, but this is the largest single automation gap.

**Where the state lives is now contested.** The original design put `invoices.rec` in a
per-agent OpenClaw workspace repo (`loomos-jared`). Since then the stated direction has
moved toward modelling these processes as packaged state machines runnable by a workflow
engine. The state machine described above is engine-agnostic, but the question of whether
the record of truth is an agent's workspace file or an engine-managed store should be
answered before implementation rather than during it.

**Payment execution is out of scope as written.** Bills are created in Zoho Books and paid
through OnPay, but nothing above closes the loop by marking a bill paid from payment
confirmation. Whether payment status syncs back — and from which system — is unspecified.

**Approval channel is assumed, not chosen.** The design assumes a messaging channel for
draft approval. Which one, and whether approval replies resume an existing agent session
or start a new one, is an implementation decision with real ergonomic consequences.

## Sources

- `~/Documents/PRD-03-Administrative-Workflows.md` (2025-10-19) — user stories, functional
  requirements, note templates, and dashboards for invoices, payroll, contracts, tax, and
  medical receipts
- `~/Code/github_afterthought/__mac-nix/plans/jared-vendor-invoice-processing.md` — the
  `invoices.rec` schema, phase state machine, workflow decomposition, cron schedule, and
  approval flow
- `~/Code/github_afterthought/__mac-nix/openspec/changes/archive/2026-02-07-vendor-invoice-processing/`
  — proposal, design decisions, and delta specs for recutils, Zoho MCP, Lobster
  conventions, workspace bootstrap, and Paperless mail rules
- `~/Code/github_afterthought/__mac-nix/openspec/changes/design-loomos/design.md` — agent
  roster, workflow catalogue, and the Paperless → Zoho Books → WorkDrive pipeline
- `swancloud/Auto Run Docs/Initiation/Phase-05, Phase-06, Phase-09` — the swancloud-hosted
  variant: Paperless email ingestion, recutils schema, extraction service, Zoho client,
  and Lobster reminder workflows
