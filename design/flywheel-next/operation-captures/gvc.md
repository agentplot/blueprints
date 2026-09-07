# gvc data pipelines

One of the operation-capture source studies; the column key, the two
channels and what stays outside are in `README.md`.

A data product is worked the same way as software: a repository, its
bolts, and an operation seen through signals (182). GVC reports on a
commit through checks and jobs, one record per `(branch, commit, name)`,
and Switchboard never sees a GVC commit.

| Source event | Channel | Capture | Signal | Path |
|---|---|---|---|---|
| Extraction job `failed` on a producer run after a push to the shared line | capture | source `gvc/<repo>/checks/<branch>/<sha>/extraction`, key the job identity `(repo, sha, extraction, params)` · the record's `ran_at` · the job plane on `result.json`, posting to the capture endpoint · the `.log` beside the record | kind ask · asserted by the extraction job · tags repository, the warehouse and release it is bound to, the batch `<pipeline>@<ran_at>` · the record's `detail` line · the claims the product's book makes on its extractors and readers | challenge → stale verdict → planning; a chore on the open bolt of that repository's line, else a unit |
| Extraction job or a declared check `failed` on a bolt's pull request | check run | none; the record's `.log` is the Checks tab (176) | none | finding on the bolt → chore on the bolt line |
| A declared check `failed` on the shared line after landing: `assertion-schema`, `division-coverage` | capture | as the extraction job, key `(repo, sha, check name)` | kind constraint · asserted by the check, named · tags repository, branch, the policy owner · the `detail` line · the claim that states the policy | challenge → stale verdict → planning |
| Anomaly in a graph build: the identity-keyed build `(repo, head.sha, scope)` fails, or the catalog subgraph the builder wrote disagrees with what the readers expect | capture; when the build ran as a stack's custom resource, the same event is switchboard's `deploy.failed` and is captured once under that key | source `gvc/<repo>/build/<sha>/<scope>`, key the build identity · the build's run time · the job plane, or `integration-sync` for the stack path · the build log and the subgraph it wrote | kind ask · asserted by the builder · tags repository, head, scope, the app that bakes it · "build of `<repo>@<sha>` at scope `<scope>` `<failed | wrote a subgraph missing <label>>`" · the claims on the catalog subgraph contract | challenge → stale verdict → planning; chore or unit on the repository's line |
| A vintage that publishes rows a newer vintage already claimed, seen at checkout | capture | source `gvc/<repo>/checkout/<id>`, key the checkout id · the checkout time · the workbench or the stack that read it · the checkout's resolution log | kind question · asserted by the reader · tags repository, the leaf `(item, partition, fp)` · "newest vintage did not win for `<key>` at `<sha>`" · the claim on vintage resolution | challenge; a chore when the book's rule is clear, else a question on a proposed intent |
