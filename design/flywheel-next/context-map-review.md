# Context map — a critical review of adopting v1

The current binding (`profiles/blueprints.yaml`, gaps 198–202) takes the willdan
v1 context map as the flywheel's scope surface with three additions and
keeps the rest. This review argues that the data model is right and the
file is not: about half of v1 is willdan's 2026 redesign written into a
schema, and the flywheel should ship the half that serves a requirement
and let an organization add the rest as vocabulary.

Sources read: requirements 3, A.14, A.16, A.23, 9; `profiles/blueprints.yaml`
`manifest:` and `context_map:`; gaps 198–203; v1 `README.md`,
`schema.json`, `bin/map-check.mjs`, `maps/*.js`, the v1 viewer; the two
mockups.

## 1. What v1 gets right, and the requirement each serves

| v1 element | keep because | serves |
| --- | --- | --- |
| `ref` on every element, chapter plus heading anchor; "no ref, no map" | The map is an index of the blueprints, not a drawing. A construction session reads the chapter, not the node. | 97, 120, 198 |
| The gate: shape, integrity, provenance, drift, exit 1 | The map is data validated on every commit. Provenance resolves the anchor against the chapter's real headings, so a moved heading fails the commit. | 198, 121 |
| Two maps, current and target, independent and complete; the difference computed, never stored | A target one can edit freely is worth more than a delta. The diff is the design change the operator reads. | 121, 122, 201 |
| `status` settled / candidate / open, an open element paired with a `questions[]` entry; the gate warns on an open element nothing asks about | Open is never a confident box. The question is what the operator captures. | 198, 201, 112 |
| `id` as the diff key; keep the id when the thing changed, change it when it is a different thing | Both overlays are keyed by id. Renaming an id is the way to say "replaced". | 121, 122 |
| Names verbatim from the blueprints | The map cannot drift from the chapter it cites if it does not paraphrase it. | 97, 120 |
| Typed relations; several relations between two nodes rather than one overloaded label | A claim attaches to a relation. A relation must mean one thing. | 200, 105 |
| A context may be `from`, never `to` | A context-level obligation exists; a context-level target does not. Keeps relation ends unambiguous for scope derivation. | 200 |
| The integrity pass is code the schema cannot express | JSON Schema cannot check cross-references or the kind-by-layer rule. A check binary is the right home; the schema is the published contract. | 198, 199 |

One property of the gate deserves naming: it has no dependencies and it
reports drift as a count. `flywheel map check` should keep both.

## 2. What is junk or over-fitted to willdan

| v1 element | verdict | why |
| --- | --- | --- |
| Layer `contract` | keep | Capabilities derive from it (199). Most claims a construction session is judged against are about a published language. |
| Layer `service` | keep | Repository kinds derive from it (199). Services are what a claim about behavior attaches to. |
| Layer `repository`, renamed `seam` | make optional | It exists to draw `backed-by` local versus `fronts` deployed, the runtime-switch story. Nothing in 195–202 needs it. A context with no seam band is legal; the derivation table must not read it. |
| Layer `store` | keep, shrink the kinds | A store is what a claim about a store attaches to (vocabulary: "a store"). Seven willdan store kinds become five shipped ones; an organization adds its own. |
| `plane` control / data on services, the lanes in the card | make optional, rename | "Control plane" and "data plane" are flywheel vocabulary (section 3) for something else. As a required field it forces a choice every node must make and no requirement reads. An optional `facet` string, rendered as a lane when present, keeps willdan's drawing without the collision. |
| Relation-kind table by layer pair | simplify | Nine pairs times fourteen kinds is willdan's release-bundle and substrate story written as a rule. Replace with a kind-owned rule (section 4): each kind names the pairs it may cross. Fewer rows, and an organization extends it by adding a kind, not a pair. |
| `runtime` on nodes and edges, the runtime switch | drop | Its values are the names of one willdan chapter's configurations. The flywheel has no runtime; a verdict is per repository. Ghosting by runtime is a page mode the flywheel's map view has no use for. An organization that wants it adds a `facet`. |
| `seamRow` | drop | A pointer into one table in one willdan chapter. |
| The configurations companion | drop from the schema | It is willdan's entrypoints-by-configurations view, validated against target node ids. Nothing in the flywheel reads it. Willdan keeps it as its own file under its own check, referencing the flywheel's map by node id; the gaps decision to "keep as is" adds a second schema to every release for one organization. |
| `verifiedFiles` | drop | A generated cache inside a hand-edited file so a `file://` viewer could badge a missing chapter without fetching. The machinery renders the map (203) with provenance resolved; the page reads the rendered form. A generated array also makes every `--write` a diff line the since-last-review overlay must learn to ignore. |
| `tier` on contexts | make optional, rename | `cortex | frameworks | platforms | aidlc` is willdan's taxonomy. An optional free `group` string gives the layout its rows without an enum. |
| `meta.modelVersion`, `meta.derivedFromCommit` | drop | Git is the version (121). The commit the refs were read against is the commit the map was committed in, and the gate resolves refs at that commit. |
| Context `book` and book-level `status` draft / active / settled | drop | `ref` locates the book. The book's promotion state is the book's, not the map's. |
| `blurb` required, `tagline` required | make optional | A blurb is a paraphrase of the chapter and drifts from it (97). One line is useful on a card; a paragraph belongs in the book. |
| `.js` files assigning `window.MAPS` | drop | The format serves a double-click viewer. The machinery writes attachments into the map (`attach_claim`, 200) and diffs it from history (122); it needs a format it can parse and emit with stable ordering. YAML carries comments, which was the reason for `.js`. |
| Hop depth, trace-to-store, the Contracts matrix, Repository-map table, Provenance tab | drop from the page | Trace depends on the seam layer and the runtime switch. The contracts matrix and the seams table are derived tables an organization can build from the rendered map; none is the scope surface. |
| Search, URL hash state, export | keep as page concerns | Not schema. The page needs a deep link per element for decision markers and notifications; the hash scheme can shrink to `map`, `sel`, `overlay`. |

The one v1 property to give up deliberately is the viewer's opening move:
zoom to the selected element's card. Section 5.

## 3. What the flywheel needs that v1 lacks

**Homes (199).** A node names the git repository it is built in. A
context may name a default. The manifest entry has git details only; the
check fails a home naming no entry and an entry no node homes. A node's
home is the one field the ledger reads from the map.

**Attachments (200).** A first-class element, not a field on the claim:
`{claim, to}` where `to` is a context, node or relation id. Attachment is
by claim name, never by version: scope is a property of the claim across
its versions, and a text amendment must not detach it. Attachments live in
the target map only. The current map is descriptive and has no scope
role; a claim attached to a target-only node is in scope for that node's
home exactly so that planning becomes due to build it (195).

**The derived-scope rule and the ledger.** Scope is computed from
attachments and homes at render. A ledger cell keys on `(claim name, claim
version, repository)` and nothing else. Whether the cell is in scope is a
flag derived at read time from the rendered map, never part of the key.
Consequences:

- A change to the derivation table, which ships with the flywheel release
  (208), changes which cells are in scope. It moves no verdict. A verdict
  is a judgment with its inputs (100); a table is not an agent.
- A node or attachment removed by a response makes the affected verdicts
  not-applicable (195). That write is "the effect of a response" (203)
  and is allowed. The same write caused by a release upgrade is not, and
  the machinery must not perform it. The requirements say both things;
  the binding must pick the response-only reading.
- A repository's kinds and capabilities are read from the rendered map,
  so the ledger never stores them.

**Open questions as captures (201, 112).** The question keeps v1's shape:
id, text, touches, ref. The capture gesture writes a capture whose source
is the question id; the map is not written. "Already captured" is derived
by joining captures to question ids, never stored on the question.

**Joining (202).** A repository joins when a node homes it and the
manifest entry exists. Its cells are every claim attached to what it
homes, unjudged, and its first planning's baseline is that set (104). The
order is: manifest entry, then home, then the gate passes; the reverse
order fails the gate (risk 2).

**The `seam` rename.** Layer `repository` becomes `seam`, kind
`repository` becomes `seam`, relation `uses-repository` becomes `uses`.
Repository means a git repository everywhere in the flywheel. The rename
is applied by the migration, not by the page at load as the mockup does.

**Versioning with the release (208).** The map declares
`format: flywheel-context-map/2`. The schema, the shipped vocabulary
(layers, kinds, relation kinds with their pairs) and the derivation table
are one versioned set in the binary. An organization's extensions live in
the blueprints under `flywheel/map-vocabulary.yaml`, validated against the
shipped set, and the check refuses an extension that redefines a shipped
entry. A map written under format 2 is checked by a binary that ships
format 2; a later binary migrates it with `flywheel map migrate`.

## 4. A proposed v2 schema

**Element set.** Eight things, nothing else:

| element | fields | required |
| --- | --- | --- |
| map | `format`, `map` (current or target), `contexts`, `nodes`, `relations`, `questions`, `attachments` (target only) | all |
| context | `id`, `name`, `ref`, `status`, `home?`, `group?`, `tagline?` | id, name, ref, status |
| node | `id`, `context`, `name`, `layer`, `kind`, `ref`, `status`, `home?`, `facet?`, `blurb?`, `note?` | id, context, name, layer, kind, ref, status; home resolved from the context default when absent |
| relation | `id`, `from`, `to`, `kind`, `ref`, `status`, `label?`, `note?` | id, from, to, kind, ref, status |
| attachment | `claim`, `to` | both |
| question | `id`, `text`, `touches[]`, `ref` | all |
| status | `settled | candidate | open` | on context, node, relation |
| ref | `<book path>.md#anchor?` | on context, node, relation, question |

`home` and `status` and `ref` are fields, not elements, but the binding
names them separately because the gate has a rule for each: a home must
name a manifest entry; an open status must be touched by a question; a
ref must resolve.

**Default vocabulary.** Small enough to hold in one table. An
organization extends it in `flywheel/map-vocabulary.yaml` by adding
kinds, relation kinds with their pairs, and derivation rows; the check
loads shipped plus extension and the engine never changes (119, 190).

| layer | shipped kinds |
| --- | --- |
| `contract` | `schema` `interface` `event` `library` `spi` `bundle` |
| `service` | `api` `worker` `ui` `cli` `agent` `job` |
| `seam` (optional) | `seam` `adapter` |
| `store` | `object` `table` `graph` `queue` `file` |

**Relation-kind rule.** Replace the pair table with a kind-owned table:
a kind names the layer pairs it may cross, and the check asks whether the
crossed pair is in the kind's list. Eight rows replace nine pairs times
fourteen kinds, and an organization adds a row rather than editing a
matrix. A context may be `from` only, as in v1.

| kind | from | to |
| --- | --- | --- |
| `publishes` | service, context | contract |
| `consumes` | service, context | contract |
| `implements` | service, seam | contract |
| `invokes` | service | service |
| `uses` | service | seam |
| `backed-by` | seam | store |
| `fronts` | seam | service |
| `derives-from` | store, contract | store, contract |

Willdan re-adds `registers-against`, `library-import`, `version-pins`,
`shells-out`, `dispatches-job` and `replicates` in its extension file with
the pairs it uses today.

**Derivation table.** A list of rows, each a pure function of one homed
node. Kinds are the union of the rows' kinds over a repository's homed
nodes. Capabilities are not table words: a capability is the id of a
contract node the repository homes and a `publishes` relation targets.
The seam layer gives nothing.

```yaml
derivation:
  kinds:
    - {layer: service, kind: [api, ui, cli, agent], gives: service}
    - {layer: service, kind: [worker, job],         gives: worker}
    - {layer: store,   kind: "*",                   gives: store}
  capabilities: published-contract-ids   # the one rule; not a table
```

A repository that homes only contract nodes has kind `library`, the
fallback row. A scope of "every repository of kind worker" is expressed by
attaching the claim to every worker node, not by naming the kind (risk 4).

**Migration from v1**, one run of `flywheel map migrate`:

| step | rule |
| --- | --- |
| rename | `layer: repository` → `seam`; `kind: repository` → `seam`; `uses-repository` → `uses`; `publishes-contract` → `publishes`; `consumes-contract` → `consumes`; `invokes-api` → `invokes`; `contextId` → `context` |
| add home | one `home` per context from an operator-supplied table of context id to manifest name; a node whose repository differs gets its own |
| lift scope | each claim block's `scope:` line becomes attachments in the target map: named repositories → the context those repositories home; a kind or capability rule → every node the rule matches today, listed for the operator to trim; `all` → every context |
| drop | `plane` (kept as `facet` when not `none`), `runtime`, `seamRow`, `tier` (kept as `group`), `verifiedFiles`, `meta`, `book`, book status |
| move aside | `configurations.js` to the organization's own directory, unchanged |
| write | YAML, elements sorted by id, one element per block |

**Sketch**, one context, three nodes, one relation, one attachment:

```yaml
format: flywheel-context-map/2
map: target

contexts:
  - id: atlas
    name: atlas-kit                         # verbatim from the book
    ref: blueprints/atlas-kit/src/index.md
    status: settled
    home: atlas3                            # default for nodes below
    group: frameworks                       # layout row only

nodes:
  - id: af.urn
    context: atlas
    name: Catalog URN
    layer: contract
    kind: schema
    ref: blueprints/atlas-kit/src/urns.md#item-urn--item-path
    status: settled
  - id: af.catalog-api
    context: atlas
    name: Catalog / STAC API (resolve · serve · mint)
    layer: service
    kind: api
    facet: control                          # optional; drawn as a lane when present
    ref: blueprints/atlas-kit/src/catalog-api.md
    status: settled
  - id: af.warehouses
    context: atlas
    name: Warehouse storage (data_base_path)
    layer: store
    kind: object
    home: atlas-lakehouse                   # overrides the context default
    ref: blueprints/atlas-kit/src/warehouses.md#data_base_path-composition
    status: candidate

relations:
  - id: r.af.api-publishes-urn
    from: af.catalog-api
    to: af.urn
    kind: publishes
    ref: blueprints/atlas-kit/src/catalog-api.md#contract-and-realization
    status: settled

attachments:
  - claim: catalog/urn-bijective           # by name; the version is the claim's
    to: af.urn                              # scope derived: {atlas3}

questions: []
```

Rendered by the machinery to `flywheel/map/target.json` with, per node,
`home` resolved; per repository, `kinds` and `capabilities`; per claim,
`scope_repos` and its attachments; and per element, its provenance
resolved. The page and every host read the rendered form only.

## 5. Rendering guidance for the map view

**Whole map at rest.** The map must be readable fit to the screen with
no gesture: every context card, its name, its home tags, its verdict
summary, its decision markers, its status dot, and its context-to-context
edges. This is what rail-and-board does and what v1 forbids. v1 draws no
edges at rest because it draws a hundred nodes in four bands; at context
granularity a willdan-sized map is seven cards and twenty aggregate
edges, and those are readable. The camera has one command, fit. Selecting
an element lights it and opens the panel; the viewport does not move.
Opening the page never zooms to a card.

**Two zoom levels, no third.**

| level | a context card shows | edges show |
| --- | --- | --- |
| 0, the whole map | name; home tags; unmet count with colour; decision markers; status dot; change mark under an overlay; nothing else | one edge per context pair, labelled by count and dominant kind, changed edges outlined under an overlay |
| 1, one context open | the same header; its nodes as lists by layer, each with kind, home if it differs, attachment chips, verdict dot, status dot, marker; a `facet` lane when the organization uses one | this context's relations, node to node, in the panel as a list and on the canvas as edges to the neighbours it touches |

Level 1 opens in place. The card grows; the rest of the map stays where
it was and dims. No node-level spatial grid: node position carries no
meaning and v1's grid layout is what made the card need a zoom.

**What each surface needs from the schema.**

| surface | needs |
| --- | --- |
| current → target overlay | both maps by id; per element added, removed, changed with the field list; the other map's exclusives as ghosts. All computed; the check's drift pass is the same function. |
| since last review | the operator's review mark (state: one mark per operator, stored by the state store) and the git history of the map files between the mark and head, keyed by element id. Needs a text format with one element per block sorted by id so a history diff reads as element changes. Nothing is stored on the element. |
| home tags | `node.home`, `context.home`, the manifest names, and the derivation result for the repository panel |
| attachment chips | `attachments` joined to the claims index for standing versus proposed; a proposed claim's chip is hollow |
| verdict dots | the rendered map's `scope_repos` per claim joined to the ledger by `(claim, version, repository)`; a context homed in two repositories shows two dots, not a merged one |
| decision markers | the plan's decisions with the element id each concerns; the marker is a rail card inline |
| capture from a question | the question id and its text; the gesture sends one capture citing it |

**Never on the canvas.** Blurbs. Refs as text. Relation labels at level
0. `runtime`. Plane lanes at level 0. The configurations topology. The
question's text. Claim text. The ledger as a table. Kind names on a card
at level 0. Any element that is not in the map being viewed, except the
overlay's ghosts.

## 6. Risks and open questions

1. **Attachments in one map or two.** This review puts them in the target
   map only. The profile says `attach_claim` writes the target map, which
   agrees, but 198 calls both maps "independent and complete". If the
   current map also carried attachments the diff would list scope changes
   as design changes. Decide, and say it in 200.
2. **Homing a repository that does not exist yet.** 199's check fails a
   home naming no manifest entry. A target node for a repository the
   organization has not created cannot be homed, and 202 makes homing the
   join. Either the manifest entry may precede the git repository, or a
   target node may be unhomed while `status: candidate`, with the gate
   warning rather than failing. Prefer the second; it is what the
   context-map mockup's "add repository" already assumes.
3. **195 against 100.** 195 has the machinery write not-applicable
   verdicts when a node or attachment is removed. 100 makes every verdict
   a judgment. The binding must limit that write to the effect of a
   response and never perform it on a derivation-table change at upgrade.
4. **The quantified scopes are lost.** Vocabulary 3 lists four scope
   forms; attachment to elements keeps two. "Every repository of a kind"
   and "every repository declaring a capability" have no element to
   attach to, and "all" attached to every context misses a context added
   later. Options: a special target `all` resolved at render; a target by
   layer and kind; or accept the loss and re-attach when a context
   appears. The gate can warn when a claim attached to every context
   misses a new one. Recommend the warning and no selector targets.
5. **Relation ids as attachment targets.** A relation between two
   contexts is a scope for both. Relation ids in v1 are hand-minted and
   were never a diff key anyone cared about; now they are. The migration
   should mint them from `from`, `kind`, `to` and the gate should refuse a
   changed id whose ends did not change.
6. **The check and the vocabulary drift apart.** The kind-by-layer and
   relation-kind rules are code in `map-check.mjs` today; in v2 they are
   data the check loads. The shipped vocabulary and the derivation table
   must be one file the binary embeds and `flywheel context-map schema`
   prints, or 208's "one versioned set" is a sentence and not a fact.
7. **Extension collision at upgrade.** An organization adds kind `job`;
   the next release ships `job` with different pairs. The check should
   refuse the extension and `map migrate` should offer the rename. Decide
   who wins.
8. **Since-last-review cost.** Deriving the overlay from history means
   reading the map file at two commits and diffing by id. Fine for one
   file; slow if the map is split per context. Keep one file per map.
9. **Willdan's configurations tab.** Dropping the companion from the
   schema removes a view willdan uses. It survives as an organization
   page over the rendered map, validated by the organization's own check
   against target node ids. Say so before willdan migrates.
10. **Verdict dots at level 0 aggregate across repositories.** A context
    homed in two repositories has two ledgers. The card's unmet count is
    a sum; the dot must not be. Two dots, or a count with a home tag each.
11. **Two status axes.** The map's `candidate` means named but not yet
    pinned by a chapter; a claim's `proposed` means its intent is open. A
    candidate node can carry a standing claim and a settled node a
    proposed one. The chip and the dot must read as different axes, and
    the requirements should not reuse the word.
12. **Anchor slugging is mdBook's.** The provenance pass reimplements
    mdBook's slugger, including its uncollapsed double hyphen. A house
    that renders the book with something else breaks every anchor. The
    slugger belongs in the binary as a named function with a test, not in
    the check as an inline regex.
