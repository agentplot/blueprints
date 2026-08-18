# Proposals

| proposal | repo | change id | review | status | branch | owner |
|---|---|---|---|---|---|---|
| session-type set: eight skills (seven construction + handoff), the construction profile, two renames, default models | willdan-blueprints | - | agent | merged | `bolt/loop-layer` | - |
| bolt schema family: `bolt-{default,quick,deep}` with loop shapes, the intent loop shape, the invocation at launch points | willdan-blueprints | - | agent | merged | `bolt/loop-layer` | - |
| shared herdr reference at `.claude/skills/_reference/herdr.md`, skills pointed at it | willdan-blueprints | - | - | merged | `bolt/loop-layer` | - |
| config: envelope shapes into `context:`, `rules.tasks` intent sections corrected | willdan-blueprints | - | - | merged | `bolt/loop-layer` | - |
| persona profiles: three `user-*` agents | willdan-blueprints | - | - | merged | `bolt/loop-layer` | - |
| fleet manifest `fleet/fleet.yaml` + `flywheel up` / `status` | willdan-blueprints | - | agent | merged | `bolt/loop-layer` | - |
| owner record: `owner:` in `.openspec.yaml`, owner resolution in dispatch's relay, release names the bolt's owner | willdan-blueprints | - | - | merged | `bolt/loop-layer` | - |

## What each proposal carries, and the decisions it implements

Every row is derived from settled records under
`openspec/changes/flywheel/decisions/`. A decision that looks wrong is a
design finding routed to the intent, never fixed here.

- **session-type set** — `session-types-are-the-task-taxonomy` ·
  `agent-profiles` · `session-model-defaults` · the two renames from the
  loop-layer page's decisions 5, 6, 15. Seven skills on the existing five
  as models; `flywheel-construction-session` as the third host profile;
  every reference to the old names rewritten.
- **bolt schema family** — `the-bolt-schema-family` ·
  `dynamic-workflows-drive-the-loop` · `the-trigger-lives-in-the-invocation`
  · `rule-1-amended-for-workflow-sessions` · `session-model-defaults`.
  Three schema directories sharing artifact instructions, differing in
  `apply.instruction`; the intent loop's shape into
  `flywheel-intent/schema.yaml`; the invocation phrase stated in the
  conductor profiles.
- **herdr reference** — `the-herdr-reference-package`. One shared file;
  bundled copies become pointers.
- **config** — `message-envelopes` · `the-closed-vocabulary` · the
  `rules.tasks` contradiction named on the loop-layer page.
- **personas** — `the-persona-loop`. Three to start; the set is whatever
  the glob finds.
- **fleet manifest** — decisions 26–29 on the loop-layer page:
  manifest + command, hybrid transport with herdr remote first, dispatch
  on the workstation, placement-only records, the `parked` state.
- **owner record** — decisions 22–24: `owner:` in `.openspec.yaml`, the
  relay resolves change → owner → DM, stewards named per surface.
