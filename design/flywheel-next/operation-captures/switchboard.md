# Switchboard

One of the operation-capture source studies; the column key, the two
channels and what stays outside are in `README.md`.

Switchboard's bus carries twenty event types. Six of them reach the
flywheel. The rest are platform-internal or are links.

| Source event | Channel | Capture | Signal | Path |
|---|---|---|---|---|
| `finding.raised` from the reconciler: an undeclared manifest parameter, a version held twice by hand, a stale registry, an environment resolving another's namespace, drift on a stack | capture | source `switchboard/<tenant>/<env>/finding`, key the `FINDING#` id · `raisedAt` · the `integration-sync` connector posting to the capture endpoint · the `FINDING#` row and its event-archive id | kind constraint · asserted by the reconciler · tags app, env, repository, the parameter or stack named · "the template for `<app>` declares `<param>`; the settings for `<env>` do not" · the claim the app's manifest chapter makes about that parameter, when the repository is in the fleet | challenge → the claim's verdict goes stale → planning; route as a chore on the open bolt of that repository's line, else on the shared line. Drop when the reconciler has already cleared it. |
| Datadog monitor webhook firing on stable after a landing | capture | source `switchboard/<tenant>/<env>/finding`, key the `FINDING#` id the inbound webhook wrote · the monitor's trigger time · `integration-sync` · the `FINDING#` row, the monitor id, the Datadog event link | kind ask · asserted by the monitor, named · tags app, env `stable`, the version tag, the landed bolt read from the as-built ledger (A.14) · "monitor `<name>` breached on `<version>` within `<n>` hours of landing `<bolt>`" · the claims the landed bolt's units served | challenge → stale verdict → planning. While the bolt is still in every view (186) the offer is a chore on the bolt; after, a unit or a chore on an open bolt on that line (182). |
| A failed regression step on a release bench, after landing | capture | source `switchboard/<tenant>/release/<rel>/step/<id>`, key the step id at its run · the step's `ran_at` · `integration-sync` on the suite's finding · the step record and its screenshot | kind ask · asserted by the executor: the QA person or the agent runner · tags app, the version under test, the area the suite drew from · "step `<title>` failed against `<version>` on bench `<name>`: `<detail>`" · the claims behind the pull requests the suite was generated from | challenge → stale verdict → planning; chore on an open bolt on the app's line, else a unit. |
| A failed regression step on a PR ephemeral, while the bolt is open in landing under pull-request policy | check run | none; the check result is evidence on the bolt (176) | none | finding on the bolt → accepted → chore on the bolt line → the request updates (176) |
| `deploy.failed` for a landed bolt's version | capture | source `switchboard/<tenant>/<env>/deploy/<DEP#>`, key the deploy row id and its identity · the status change time · `integration-sync` · the deploy row's evidence: change set id, stack events | kind ask · asserted by the deploy executor · tags app, env, version, the landed bolt · "deploy of `<version>` to `<env>` failed: `<detail>`" · none by default; a claim on deployability when the book states one | route → chore on the open bolt of the line, else the shared line. Drop when a retry under the same identity later reads `deploy.done`. |
| `deploy.failed` for a PR ephemeral, while the bolt is open in landing | check run | none; switchboard posts the GitHub check and Deployment status through its App | none | finding on the bolt (176) |
| A portal ask: a person on a product page reports a problem or suggests a change through Ask dispatch | capture | source `portal/<tenant>/<app>/ask`, key dispatch's own id for the drawer conversation · when the person sent it · dispatch, as the org's GitHub App · the drawer transcript, outside version control | kind ask or question, as the person's words say · asserted by the person, by their sign-in identity · tags the product, the service, the environment they were on · the person's sentence, with dispatch's one or two clarifying answers folded in · a claim when the person disputes stated behavior | join → a proposed intent citing it; attach when an open intent fits; answered when a standing claim or an archived intent already settles it |
| `deploy.done`, `release.approved`, `record.written`, `channel.moved`, `service.changed`, `dataplane.registered`, the three `schema.*`, `access.changed`, `ephemeral.expired`, `pr.opened`, `pr.closed` | link, or nothing | none | none | never a signal. On an open request the check and Deployment status are links on the bolt (177). After landing they are the delivery system's (181). |

## The portal ask's tracker item

The capture is the source: one per ask, keyed by dispatch's id for the
drawer conversation (111). A signal is never a tracker item (157), so
the item dispatch files per ask is at most a projection written from
the capture and its signal's move, never read as truth (76). The item
that has a lifecycle is the proposed intent the join move produces
(116), and the drawer lists the person's asks from the captures and
their moves.
