# Finding: the build list the six proposals chapters held

From: `books-proposals-chapter-retires` (build branch
`build/books-proposals-chapter-retires`, bolt `flywheel-machinery`).

`openspec/changes/flywheel/decisions/proposals-chapter-retires.md` moves
the build list from the books to the loops. This change deletes the six
`src/proposals.md` chapters — 3117 lines carrying **157 distinct proposal
working names**. The design each one draws on stays in the chapter its
`Scope:` field named; what leaves the books is the list of what is ready
to build, which is now an intent's Handoff tasks.

Filed here so the flywheel holds the list rather than losing it. This is
not a request to act — it is the inventory an intent draws from when one
of these subjects comes up for work.

## Where the full text is

The entries — working name, scope, seams touched, dependencies, and a
summary paragraph each — are in git history at the commits that delete
the six chapters on this branch. `git show <commit>^:books/<book>/src/proposals.md`
recovers any of them whole.

## Two things the deletion cost, recorded here

**Ten working names had no other carrier.** `books/atlas-kit/src/verification.md`
cited eleven slugs; ten of them appear in no surviving file at all, so
their only definition was the chapter. They are `agg-disagg-models`,
`cp-tables`, `divisions-source-routing`, `enable-extrapolate-h3-all-themes`,
`enriched-buildings-test-variant`, `kg-neptune`, `lineage-class-sweep`,
`spatial-hierarchy-matrices`, `study-production-iteration`, and
`temporal-vector-substrate`. The eleventh, `category-string-sweep`, also
appears in `integrations/categories.md`. Every one of the ten names work
whose design is in a surviving chapter; what is gone is the name for the
slice of it that was ready to build.

**Five build-order nodes had no other carrier.** `books/rocs-kit`'s
build-order graph ordered ten knowledge-system pieces. Five —
`knowledge-graph-schema`, `neptune-backend`, `file-graph-backend`,
`station-agent-service`, `station-manifest-lifecycle` — appear in no
surviving file. The *ordering* survives: the graph is relocated to
`books/rocs-kit/src/knowledge/knowledge-model.md`, recast over the design
pieces rather than the build units, because which piece rests on which is
design. What the relocation drops is the claim that each node is one
change to file.

## The inventory

### atlas-kit (68)

- `browser-byte-access`
- `warehouse-graph-store-binding`
- `urn-system`
- `catalog-item-paths`
- `warehouse-manifests`
- `release-manifests`
- `pipeline-yaml`
- `source-modes`
- `producers`
- `pipeline-discovery`
- `pipeline-resolver`
- `integration-registry`
- `concurrency-cell-selection`
- `per-cell-caching`
- `auto-catalog-registration`
- `feature-level-lineage`
- `entity-identity-across-partitions`
- `run-config-snapshot-schema`
- `inclusion-masks`
- `package-yaml`
- `cli-package-verbs`
- `cli-pipeline-verbs`
- `cli-integration-verbs`
- `cli-warehouse-verbs`
- `cli-release-verbs`
- `sdk-stable-surface`
- `pipeline-observability`
- `framework-verification-frame`
- `concurrency-cell-noun-standardization`
- `temporal-vector-substrate`
- `spatial-hierarchy-matrices`
- `agg-disagg-models`
- `study-production-iteration`
- `add-spatial-allocator`
- `add-spatial-aggregator`
- `add-spatial-disaggregator`
- `add-h3-extrapolation-resolver-to-reserved-names`
- `category-string-sweep`
- `lineage-class-sweep`
- `field-enricher-study-mode-capture`
- `enable-extrapolate-h3-all-themes`
- `enriched-buildings-test-variant`
- `lineage-edges-as-derived-artifact`
- `variant-set-schema`
- `rewire-featurize-lightbox-to-producer-landed-urn`
- `lightbox-fold-into-extrapolate`
- `divisions-source-routing`
- `add-census-division-indexes-pipeline`
- `aggregation-pipeline-partitioning`
- `cp-tables`
- `cp-buckets`
- `cp-functions`
- `cp-schedules`
- `cp-deploy-workflow`
- `kg-staging`
- `kg-neptune`
- `kg-analytics`
- `kg-iam`
- `kg-bedrock-runtime`
- `kg-ecs-runtime`
- `per-warehouse-eventbridge`
- `oidc-thumbprint-pin`
- `aws-token-exchange`
- `catalog-on-s3-resolver`
- `dispatcher-pattern-deploy`
- `forecasting-integrations`
- `loadshape-generation`
- `custom-data-feeds`

### commissioning-template (9)

- `scaffold-system-commissioning-inception-plugin`
- `scaffold-book-commissioner-plugin`
- `decompose-github-aws-construction-into-seam-plugins`
- `scaffold-cdk-commissioning-plugin`
- `scaffold-sam-commissioning-plugin`
- `scaffold-ministack-commissioning-plugin`
- `scaffold-devenv-commissioning-plugin`
- `wire-conductor-claim-time-suite-verify-gate`
- `scaffold-spike-commissioning-plugin`

### cortex-kit (4)

- `surface-configurations`
- `kb-service`
- `cortex-extensions`
- `spike-commissioning`

### geo-iq (1)

- `geoiq-surface-bindings`

### gvc-kit (1)

- `session-branches`

### rocs-kit (74)

- `rocs-api-openapi-contract`
- `station-registry-read-surface`
- `ask-station-proxy`
- `trust-boundary`
- `zuplo-edge`
- `gateway-verification-frame`
- `rocs-state-machine-shared`
- `atlas-pipeline-machine`
- `auto-research-machine`
- `machine-version-bundles`
- `run-config-artifact-contract`
- `prompt-envelopes-and-reply`
- `dialogue-loop`
- `agent-review-modes`
- `executing-dispatch`
- `executing-fanout`
- `session-id-correlation`
- `harness-hil-bridges`
- `envelope-delegation-surface`
- `mcp-passthrough-via-uxcd`
- `rocs-cli-verb-surface`
- `scenario-clone`
- `scenario-rebind`
- `rocs-mcp-server`
- `rocs-run-headless`
- `rocs-daemon-lifecycle`
- `rocs-daemon-queue-trigger`
- `mark-stale-state-machine`
- `rocs-cli-verification-frame`
- `conductor-program`
- `dialogue-loop-conductor-side`
- `session-id-mint`
- `hil-adapter-interface`
- `inline-adapter`
- `channels-adapter`
- `crabtalk-adapter`
- `claude-code-delegation-providers`
- `crabtalk-delegation-pool`
- `conductor-coverage`
- `claude-code-harness`
- `crabtalk-harness`
- `rocs-skill-package`
- `rebind-orchestration`
- `conductor-verification-frame`
- `station-pipeline-schema`
- `scenario-isolation`
- `seed-rows-from-station-coverage`
- `edge-graph-and-cascade`
- `lease-conditional-write`
- `lease-reaper`
- `machine-version-registry`
- `run-configs-content-addressed`
- `register-and-rebind`
- `event-validation-as-verifier`
- `pending-prompts`
- `prompts-reaper`
- `run-claims-shared-run`
- `run-reaper`
- `cascade-walker`
- `audit-log-append-only`
- `audit-cross-row-gsis`
- `lambda-handler-set`
- `dynamo-streams-reconciliation`
- `verification-frame`
- `kb-provider-interface`
- `knowledge-graph-schema`
- `neptune-backend`
- `file-graph-backend`
- `station-agent-service`
- `reasoning-loop`
- `mcp-surface`
- `role-registry`
- `station-manifest-lifecycle`
- `runtime-backends`

