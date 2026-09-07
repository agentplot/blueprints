# The system context map — a model from first principles

This model serves requirements 97, 105, 120–122, 195, 198–202 and 208.
It treats 198–202 as a draft and proposes their rewrite in section 6.
It reads nothing but the requirements. Words are used as section 3 of
the requirements defines them: claim, scope, verdict, ledger,
repository, home, attachment, book, chapter.

## 1. What a context map is

Domain-driven design (Evans 2003; Vernon 2013) gives the map a small
core. Everything else is elaboration.

### 1.1 The core

| concept | statement |
|---|---|
| bounded context | A boundary inside which one model holds and its terms mean one thing. Outside the boundary the same word may mean something else. |
| ubiquitous language | The vocabulary of one context, shared by the people and the code inside it. It belongs to the context, not to the system. |
| context map | The set of bounded contexts and the relationships between them, drawn as they are, not as one would wish them. Evans: map first, then change. |
| relationship | One connection between two contexts, typed by a pattern that says how the two models and the two teams relate. |
| upstream, downstream | The direction of influence on a relationship. Upstream changes force downstream to react; downstream changes do not reach upstream. |

The relationship patterns are a closed set. They are the map's type
system and the reason a map means the same thing to every reader.

| pattern | direction | meaning |
|---|---|---|
| partnership | symmetric | Two contexts succeed or fail together; the teams plan jointly. |
| shared kernel | symmetric | Two contexts share a named subset of model and code, changed only by agreement. |
| customer–supplier | upstream → downstream | Upstream serves downstream's needs; downstream's requirements enter upstream's planning. |
| conformist | upstream → downstream | Downstream adopts upstream's model as it is, because upstream will not accommodate it. |
| anticorruption layer | marker on the downstream end | Downstream translates upstream's model into its own at the boundary. |
| open host service | marker on the upstream end | Upstream offers one protocol for every downstream, not one per consumer. |
| published language | marker on the upstream end | The protocol is a documented, shared language, not one context's internals. |
| separate ways | none | The contexts have no connection; each solves its own problem. Drawn so the absence is a decision. |
| big ball of mud | marker on a context | A context whose inside has no consistent model. Drawn so nothing depends on its inside; downstreams guard it with an anticorruption layer. |

Three of the nine are stances at one end of a relationship, not
relationships: an open host service and a published language are what
an upstream offers; an anticorruption layer is what a downstream builds.
One is a mark on a context: big ball of mud. Five are shapes of a
relationship: partnership, shared kernel, customer–supplier,
conformist, separate ways. This split is Evans's and Vernon's notation,
where a line carries U and D at its ends and OHS, PL, ACL beside them.

Two exclusions the patterns imply and the schema enforces: a conformist
downstream has no anticorruption layer, because conforming is not
translating; a symmetric pattern names no upstream.

### 1.2 The elaboration

Inside a context, DDD names things a map may show: aggregates, entities,
value objects, domain events, repositories in the DDD sense, domain
services, application services, published contracts, sagas or process
managers, modules. Vernon draws some on a context map; Evans draws none.
They are elaboration: a map with none of them is still a context map.
The model gives them one open type, element, and a vocabulary that says
which kinds exist. The vocabulary is where an organization decides what
is worth naming.

The map also does not fix how contexts are hosted, deployed, stored,
tiered or laned. DDD is silent on these because they change without
the model changing. The model treats them the same way: as tags.

## 2. The model

Four element types. Every instance of every type carries the same five
common fields.

| field | rule |
|---|---|
| id | Stable, unique across the whole map, never reused, kept through a rename. Lowercase, dashes, dots. The key every difference is computed on and every attachment names. |
| name | The words the book uses, verbatim. |
| ref | The chapter that states it, as `book/chapter` (120). Required when status is settled or candidate. |
| status | One of settled, candidate, open. Open requires a question; settled and candidate require a ref. |
| question | The text of what is unresolved. Present only when status is open. |
| tags | A list of strings. A tag of the form `facet:value` names a declared facet; a plain tag is free text. |

A candidate is stated by a chapter on an open intent's line; settled by
a chapter on the books' shared line. Status follows the claim it comes
from (proposed, standing) and adds open for the thing the book has not
yet decided.

### 2.1 Context

| field | rule |
|---|---|
| home | Optional. The repository elements of this context are built in unless they name their own. |
| external | Optional, true when the context is not built by this organization. An external context sets no home and its elements have none. |
| big_ball_of_mud | Optional, true to draw the Evans marker. |
| language | Optional. A short list of the context's own terms, each with a one-line meaning. The ubiquitous language, as far as the map states it. |

A context has no kind. Contexts are the units of the map and the one
thing the map may not classify by structure; what an organization
wants to say about a context it says with tags.

### 2.2 Element

An element is a named thing inside one context.

| field | rule |
|---|---|
| context | The id of the context it belongs to. Required. |
| kind | A kind from the vocabulary. Required. |
| home | Optional. The repository it is built in. When absent, the context's home applies. An element with no home and a context with none fails the check unless the context is external. |

### 2.3 Relationship

A relationship connects two contexts and is typed by the fixed
patterns.

| field | rule |
|---|---|
| pattern | One of partnership, shared-kernel, customer-supplier, conformist, separate-ways. |
| contexts | The two context ids, for symmetric patterns and separate ways. |
| upstream, downstream | The two context ids, for customer-supplier and conformist. |
| upstream_offers | Optional subset of open-host-service, published-language. Directional patterns only. |
| downstream_guards | Optional, anticorruption-layer. Customer-supplier only. |
| kernel | Shared kernel only. The element ids both contexts share. |

Exactly one relationship may connect a given pair of contexts. The
check fails a second.

### 2.4 Link

A link connects two elements and is typed by the vocabulary.

| field | rule |
|---|---|
| kind | A link kind from the vocabulary. Required. |
| from, to | Element ids. Required. |

A link whose ends are in different contexts must cross a relationship
that is not separate ways. The check fails a crossing the map does not
explain. This is the one rule that ties elaboration back to the core:
every dependency the elements draw is a dependency the contexts have
declared.

### 2.5 Why lanes, tiers and stores are tags or kinds, never structure

A lane such as control or data, a tier, a runtime, a store as against
a service: each is true of one organization and false of the next, and
each changes without the design changing. If the schema had a lane
field, an organization without lanes would fill it with a lie; one
with three lanes could not say so; and a lane moved on a diagram would
read as a design difference. If the schema had a store layer, a product
whose stores are services behind a contract would be forced to draw a
box that its model does not have.

The test is: does the machinery read it? The machinery reads id (to
diff and attach), context and home (to scope), kind (to derive), and
the relationship pattern (to draw and to check crossings). It reads
nothing else. Everything it does not read is a tag, and a store is a
kind an organization adds when it wants to count stores, and a tag
when it only wants to colour them.

A consequence worth stating: a tag can move without moving a verdict,
and so can a kind, because neither is in a scope. Section 4.8 makes
this an invariant.

## 3. Extensibility

### 3.1 Two vocabulary files

The flywheel ships a default vocabulary with each release (208). An
organization keeps one vocabulary file in its books repository that
extends it (119, 190). The schema validates a map against the union.

| file | owner | versioned with |
|---|---|---|
| shipped vocabulary | the flywheel | the flywheel release, stamped in the schema version |
| organization vocabulary | the organization | the books, like the map |

The organization file declares which schema version it extends. A
map declares its schema version. The check fails a map or a vocabulary
whose version the installed flywheel does not read.

### 3.2 The shipped default

Small on purpose. Four element kinds, four link kinds, no facets.

| element kind | meaning | capability |
|---|---|---|
| aggregate | A cluster of objects changed as one unit, with one root and one invariant boundary. | no |
| domain-event | Something that happened in the context that other contexts may care about. | no |
| contract | What the context offers across its boundary: an API, a schema, a message format. The published language made concrete. | yes |
| service | A running thing: a process, a worker, a job, a store, a function. What a repository builds and operates. | no |

| link kind | from → to | meaning |
|---|---|---|
| uses | any → any | Depends on, in the most general sense. |
| implements | service → contract | The service serves that contract. |
| emits | any → domain-event | The element raises the event. |
| handles | any → domain-event | The element reacts to the event. |

Link kinds may constrain the kinds at each end. `uses` constrains
none.

### 3.3 What an organization adds

| addition | how | engine change |
|---|---|---|
| an element kind | A named kind, optionally extending a shipped or earlier organization kind. A kind that extends `service` is a service to every rule that names services and is drawn with its own name. `store extends service` is the operator's own example. | none |
| a link kind | A named kind with optional end constraints. | none |
| a facet | A named facet with an optional closed list of values. `lane: [control, data]`. A tag `lane:control` is then checked; `lane:audit` fails. | none |
| a free tag | Nothing to declare. | none |
| a capability kind | An element kind marked `capability: true`, so what it names counts in derivation (section 4.3). | none |

The check reads the union: an unknown element kind, link kind or facet
fails; a link whose end kinds violate its constraint fails.

### 3.4 What may never be extended

| fixed | reason |
|---|---|
| the relationship patterns and end markers | They are the map's meaning. An organization that adds a tenth pattern has a diagram, not a context map. |
| the status values and the open-requires-question rule | The review surface (122) and capture (201) read them. |
| the ref rule | 97 and 120 make the chapter and the claim one source; a ref that could point elsewhere breaks it. |
| ids as diff keys | 121 and 122 are computed on them. |
| the home rule and the external marker | Scope (200) and joining (202) are computed on them. |
| the four element types | An organization that needs a fifth has found a gap in the schema, which is a flywheel change (208). |
| the derivation table's inputs | Section 4.3. Its rows may not read tags. |

An organization vocabulary that tries to redefine a shipped kind fails
the check. It may extend one.

## 4. The flywheel additions

### 4.1 Home (199)

Every element is built somewhere. Its home is a repository name that
the fleet manifest carries. A context may set a default home so its
elements need not repeat it. An external context has no home and its
elements none.

| check | result |
|---|---|
| a home naming no manifest entry | fail |
| a manifest entry that no element or context homes, in target or current | fail |
| an element with no home in a context with no home, not external | fail |
| an element with a home in an external context | fail |

Relationships and links have no home. Their repositories are the
homes of their ends.

### 4.2 Attachment (200)

A claim attaches to any id on the map: a context, an element, a
relationship or a link. The attachment is part of the claim and lives
with it in the chapter (105, 97). The map file carries no list of
claims; the page joins claim to map by id.

Scope is computed:

| attached to | scope |
|---|---|
| a context | the context's home, and every distinct home of its elements |
| an element | the element's home, or its context's |
| a relationship | the scope of both contexts |
| a link | the scope of both elements |
| nothing | empty; the claim is not planned against (98) |

A claim about a contract between two contexts attaches to the
relationship, or to the contract element and its consumer's link, and
is in scope for both sides; each carries its own verdict (105). A
scope is corrected by re-attaching, one response through the scope
tool (193). Scope is derived from the target map, because scope is what
is to be built.

### 4.3 Derivation (195, 199)

A repository's kinds and capabilities are read off what it homes. The
table is part of the schema and versioned with it (208).

| derived | from | rule |
|---|---|---|
| kinds | the elements it homes | The set of their kinds, each with the kinds it extends. A repository homing a `store` has kinds store and service. |
| capabilities | the elements it homes whose kind has `capability: true` | The set of their ids. In the shipped vocabulary: the contracts it homes. |
| contexts | the elements it homes | The set of their contexts. Shown, not named in 195, useful. |

Should capabilities be published contracts, element kinds, or tags?
Contracts. A capability is what others can depend on, and in DDD that is
exactly an open host service's published language: the contract. Kinds
say what a repository is made of, and are derived separately. Tags say
how the organization classifies things, and if derivation read them a
reclassification would move a derivation, and a derivation must be
free to be shown on the repository page without being trusted by
scope. Making capability a flag on a kind keeps the door open: an
organization that wants a `topic` kind to count declares it so.

Kinds and capabilities are shown on the repository page and read by
instructions and skills when they choose a template or a deliverable
(190). Scope never reads them. That separation is what makes 4.8 hold.

### 4.4 Current and target (121, 201)

Two complete maps, one schema, the same vocabulary. Current is the map
of what is built; target is the map of what the books say. The same id
names the same thing in both. Neither is a delta of the other.

The difference is computed, keyed on id, for each of the four types:

| class | meaning |
|---|---|
| added | in target, not in current |
| removed | in current, not in target |
| changed | in both, any field differs; the fields listed |
| moved | changed where the only differing field is home, called out because it moves scope |

A rename is a change to name. A reclassification is a change to tags.
A tag change is a change like any other in the difference, and no
change at all to any verdict.

### 4.5 Since the operator's last review (122)

The same difference engine over two revisions of the same map: the
target map at the revision the operator last reviewed, and the target
map now. Derived from history, never stored. The review view lays it
over the map as a second overlay, and directs the reader to the
chapters the changed ids ref.

One engine, two uses. It has no notion of which map it is given.

### 4.6 Open questions as captures (201)

An open element carries its question. The page shows the question with
the element. One gesture makes a capture: source the map, pointer the
element id and the map revision, the question its one signal (112).
Curation routes it like any signal. When the book answers, the element
moves to candidate or settled, gains its ref, and drops the question.
The check fails an open element with no question and a settled one
with a question left behind.

### 4.7 Joining (202)

A repository joins the fleet when the target map first homes something
in it. Its ledger is empty (104). Its first planning's baseline is the
claims attached to what it homes: the scope computation of 4.2 run over
its homes. A repository homed only in current is retiring; its verdicts
stand until the current map drops it.

### 4.8 The ledger invariant

A verdict is keyed by claim, claim version and repository. The set of
verdicts a repository is due for is its scope: the claims attached to
what it homes. Scope reads home, context and attachment. It reads no
tag, no kind, no facet and no derived capability.

Therefore: a change to the derivation table or to either vocabulary
never moves a verdict. Only three things do.

| change | effect on verdicts |
|---|---|
| a home moves, or an element is added to or removed from a home | the affected claims enter or leave that repository's scope; leaving makes the verdict not applicable (195, 101) |
| a claim is re-attached | the claim's scope is recomputed; same effects |
| a claim's version moves | its verdicts fall stale (101) |
| a tag, kind, facet, derivation row, or vocabulary changes | none |

The check enforces the shape: the derivation table may not read tags;
scope may not read derivation. The invariant is then true by
construction, and a test can show it by editing the vocabulary and
diffing the ledger.

### 4.9 Versioning (208)

| artifact | version field | moves with |
|---|---|---|
| schema, shipped vocabulary, derivation table | `schema: flywheel-map/N` | the flywheel release |
| organization vocabulary | `extends: flywheel-map/N` | the organization, when it upgrades; a chore (123) |
| a map | `schema: flywheel-map/N` and its git revision | every commit, with the book (121) |

Upgrading N is a chore that rewrites the organization vocabulary and
both maps. A map is never read by a flywheel that does not know its N.

## 5. Visualization

The map has two zoom levels and one camera command, fit. The first
level is the whole map: every context as a card carrying a thumbnail
of its inside. The second is a drill: one context's inside at full
size, in the same grammar, with its neighbours as docks at the edges.

### 5.1 At rest

The whole map is readable without opening anything. Contexts are the
only units of the layout: a layered layout ranks them upstream to
downstream, orders each column, and fixes every position after that.

| drawn | as |
|---|---|
| context | A card with its header: name, status, a home chip per distinct home with a verdict dot, an attachment count chip, decision markers, an open-question badge, tags. Hatched when big ball of mud. Dashed when external. Under the header, a thumbnail of the map inside it. |
| thumbnail | The context's elements as dots, coloured by kind and ringed by home, laid out inside the card by a deterministic layout; the links between them as hairlines; a short dashed stub toward the other context where an element links out. A caption counts elements, links and links out. The thumbnail is read-only: a click on the header opens the context's page, a click on the thumbnail drills in. |
| relationship | One edge per pair. The pattern's name on the edge. U and D at the ends of a directional pattern, with an arrowhead. OHS, PL badges at the upstream end; ACL at the downstream end. Shared kernel drawn as a lens between the two cards. Separate ways drawn as a dotted edge with a bar, so its absence is visible. An edge that would cross a card bows over it. |
| crossing | On every edge, a pill counting the element-to-element links that cross it (2.4). Separate ways reads "none · by rule", or "n cross · fails" when a link crosses it. Hover or focus on the edge slides out a panel at its midpoint: each crossing link as from element with its context and home, the link kind, to element with its context and home; the claims attached to the relationship; controls to open the relationship's page or drill either end. |
| home | A chip per distinct home on the card, in the home's ring colour. A context whose elements are all in one repository shows one chip. |
| attachment | A count chip on each card, edge and lens: the claims attached there. |
| verdict | A dot on each home chip, coloured by the worst verdict among the claims in scope for that repository through this context. |
| decision | A marker on the card or edge a decision concerns, with its number, in the one glyph set every surface uses. |
| status | Settled plain, candidate with a soft border, open with a question mark and the question on hover. |

Links are never drawn between cards at rest; the edge's pill and panel
are where a link is read at that level.

### 5.2 Drilled in

A click on a thumbnail, or Enter on the focused card, drills into the
context. The canvas becomes the context's inside at full size, in the
same grammar as the whole map:

- its elements as nodes: kind, name, home chip with verdict dot, attachment chip, decision markers, status, an open element's question with the capture gesture beside it, tags;
- its links as typed edges with the kind on the edge;
- the neighbouring contexts as collapsed docks at the canvas edges, upstream on the left, downstream on the right, symmetric patterns above, separate ways below; each dock carries the pattern, the U or D mark for its side with OHS, PL or ACL, the kernel when shared, the crossing count, its attachment chip and its markers, and a control to drill into it;
- a cross-context link landing on the neighbour's dock with the target element named on the edge;
- a breadcrumb over the canvas, organization › context.

The inside is laid out once per drill, an element that links out
pulled toward its dock, and positions are then final. Fit at this
level fits the inside. Esc or the organization crumb returns to the
whole map with its camera as it was.

### 5.3 What tags and facets do

| operation | effect | never |
|---|---|---|
| filter | Elements and contexts not carrying the tag dim, at both levels: cards and dots at rest, nodes when drilled; edges whose ends both dim, dim. | removes an id from the drawing |
| colour | One facet at a time colours cards, dots and nodes by value; the legend lists the values. While it is on it overrides the kind colour; off restores it. | changes an edge's marks or a home's ring |
| group | One facet at a time draws a background band per value behind the contexts or nodes that carry it. | draws a box that contains, nests, or reorders anything |

A band is a wash, not a boundary. A context in no band is drawn
unbanded. Turning grouping off changes no position. After every switch
the control strip reports that nothing moved and no edge changed, at
the level shown.

Colour is fixed by role. Kinds colour permanently: a dot and a node
take their kind's colour from the vocabulary (3.1). Homes colour
rings: a dot's ring, a node's home chip and the repository strip take
the home's colour. Only a colour facet overrides the kind colour, and
only while it is on.

### 5.4 Overlays

Two, both from the difference engine of 4.4:

- current to target: added drawn with a plus mark, removed drawn ghosted, changed with a delta mark and the changed fields on hover, moved with the old home struck through beside the new;
- since last review: the same marks in a second colour, over the target map only.

The marks sit on cards and edges at rest, on dots in the thumbnails,
and on nodes, link edges and neighbour docks when drilled. A removed
element, relationship or link is placed by ghost placement: drawn
ghosted in a place computed around the target's objects without moving
any of them, at either level. Either overlay can be on. The map
underneath is always the target.

### 5.5 Focus and camera

Two focus rings, never merged. The lit ring comes from outside the
canvas: a decision focused on the rail, a claim whose scope is shown,
a "light on map" from a page; it sits on the object concerned and
leaves when that focus does. The focus ring is the canvas's own: it
moves among contexts at rest and among elements when drilled, and
Enter acts on it. The two may sit on different objects at once.

One camera memory. A drill keeps the whole map's camera for the way
back, and returning restores it. Nothing else is remembered: no saved
positions, no pan history. Fit is the only camera command, at either
level.

### 5.6 Narrow rendering

Under a narrow width the canvas is a stacked list at both levels. At
rest, every context as its card without the thumbnail, its
relationships listed under it with pattern, marks and crossing count.
Drilled, every element as a row with kind, home chip, verdict dot,
markers and its links named, then the neighbour docks as rows with the
pattern and end marks. Drill and back, the pages, the overlays and the
facets work the same as on the canvas.

### 5.7 Never on the canvas

- repositories as nodes: a repository is a chip, because it is not a bounded context;
- claims as nodes: a claim is an attachment chip, because it is a statement, not a thing;
- verdict text or evidence: the dot links to the ledger;
- chapter prose: the ref links to the book;
- lanes, tiers or layers as boxes: they are tags;
- the current map as a second drawing: it is an overlay;
- links between cards at rest: they are the edge's crossing count and panel;
- a context opened in place: the inside is a drill, never a card that grows;
- camera state beyond the one memory of 5.5: no saved positions, no pan history; layout is computed, fit is the only command.

## 6. The rewrite of 198–202

198. The system context map is the scope surface. It is the map of the
    bounded contexts the books describe, in the terms of domain-driven
    design: a context, the elements it names, the relationships between
    contexts typed by the DDD patterns with an upstream and a downstream
    where the pattern has one, and links between elements. Element
    kinds, link kinds and facets come from a vocabulary the flywheel
    ships and the organization extends; the relationship patterns do
    not. Every context, element, relationship and link has a stable id,
    a name as the book writes it, the chapter that states it (120), and
    a status of settled, candidate or open, an open one paired with a
    question. A lane, a tier, a runtime or a store is a tag or a kind;
    the map has no structure for them. The map is data validated
    against the schema and the vocabulary on every commit and versioned
    with the book (121). A session that writes or amends a claim
    updates it (120).

199. Every element names the git repository it is built in, its home,
    or inherits the home its context sets; an external context sets none
    and homes nothing. A repository's kinds and capabilities are derived
    by a table the schema fixes from the elements it homes, its kinds
    from their kinds and its capabilities from the contracts among them;
    they are never declared by hand and never read by scope. The
    manifest entry names only the repository's git details (195). The
    map check fails a home naming no manifest entry and a manifest
    entry that no element or context homes.

200. A claim attaches to a context, an element, a relationship or a
    link, and the attachment lives with the claim (97). Its scope is the
    set of repositories homing what it attaches to, both ends of a
    relationship or a link, derived from the target map and never chosen
    (105). Correcting a scope is re-attaching the claim, one response
    through the scope tool (193). A claim attached to nothing is not
    planned against (98). A change to a vocabulary or to the derivation
    table moves no verdict; only a home change, a re-attachment or a
    claim version does.

201. The map is two complete maps under one schema, current and target,
    the same id naming the same thing in both. The page shows the target
    with two overlays computed by one difference, keyed on id: current
    to target, the design difference, and target at the operator's last
    review to target now (122). Each home carries the ledger verdict for
    the claims attached there, and decisions are markers on what they
    concern. An open element's question is shown with it and can be
    captured in one gesture (112). Tags filter, colour and group the
    drawing and never change its structure.

202. A repository joins the fleet when the target map first homes
    something in it (104). Its first planning's baseline is the claims
    attached to what it homes.

## 7. Open questions

1. A claim about every repository of a kind, such as "every service
   has a health endpoint", has nothing to attach to. Options: attach to
   the map itself, scope every homed repository; or attach to every
   element of the kind, scope recomputed as elements are added. The
   first is one attachment and reads kinds into scope, which breaks 4.8
   for that claim. The second keeps 4.8 and asks the claim writer to
   name many ids. Recommend the second, with the scope tool offering
   "all elements of kind K" as a way to write it.
2. Who moves the current map. A landing that satisfies a claim changes
   what is built. Options: the construction session that lands writes
   current in the same landing; a chore raised by the verdict; the same
   session that moves a claim moves both maps. Recommend the first, so
   current is as-built by the same hand that builds.
3. Which line the ref check reads for a candidate. A candidate's chapter
   is on its intent's line and not yet on the books' shared line. The
   check on the shared line would fail the ref. Recommend the check
   accept a ref that resolves on any open intent's line, and that
   landing the intent be what turns candidate to settled.
4. Whether a link may cross a partnership or a shared kernel without
   naming which. Currently yes. A stricter rule would ask a crossing
   link to name the relationship id it crosses, so the page can show a
   relationship's traffic. Left open until a map has enough links to
   need it.
5. Whether a relationship's kernel element ids must be homed in both
   repositories, in one, or in a third. A shared kernel is often its own
   repository. Recommend allowing any home, and scope of a claim on the
   kernel be the union of the kernel's homes and both contexts'.
6. Whether external contexts may have a ref. An external system is not
   stated by a chapter of the books. Recommend ref optional when
   external is true, status still required.
7. Whether the "moved" difference class should also cover a change of
   context. Moving an element between contexts is a design change of a
   different order than a rename. Recommend yes, called out as "moved
   context".
8. Whether the map page needs a third overlay, verdicts as of a past
   revision, to answer "what got built since I last looked". Derivable
   from the ledger's history. Not needed for 122; left open.
