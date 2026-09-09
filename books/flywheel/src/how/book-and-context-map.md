# The book and the context map

The output of design is the book: the durable statement of the
destination, as prose, diagrams and samples the operator can judge, and
as claims the machinery can address (23). Everything else a design
session produces is a record.

## Three layers, one repository

A blueprints repository carries three layers, and confusing them is the
easiest mistake to make.

| layer | what it is | what it is for |
|---|---|---|
| the fundamentals | numbered, mechanism-free clauses stating what must always hold | to be designed from |
| the book | chapters, diagrams and samples that explain | to be understood |
| claims | requirement blocks in the standing specifications, each with a scenario | to be checked |

The fundamentals are a **part of the book**, not a fourth artifact, and
the blueprints template ships the skeleton so every book has the part
whether or not anything is written into it yet (208). The book you are
reading is that arrangement applied to itself: Part I is the
fundamentals, included from their source, and Part II is the prose that
explains them.

The relation between the layers is fixed. A clause says what must always
hold, in language a person judges. A claim is the clause the flywheel
checks, per repository. A claim is included by anchor immediately after
the clause it makes checkable. A clause need not yield a claim, because
many clauses constrain the shape of the model rather than a behaviour a
repository can be judged against.

## Including, never copying

A chapter that explains a claim includes it by anchor, and the
preprocessor renders the requirement in place with its name, its version
and the scope derived from its map attachments (97, 200). The text lives
in one place, the specification, so the chapter cannot drift from it.

That is the rule this book follows. Part I chapters are a heading and an
include; the clause text is pulled from
`design/flywheel-next/requirements.md` at build time. Part III does the
same for the surfaces document. A construction session then reads the
chapter to know what a claim means and the specification to know what it
says, and both are one source (89).

## The default instructions

The instructions that shape what a session writes are data the operator
can change without a code change, and no instruction text exists in the
engine (119). The defaults are themselves specified (120). Unless the
operator changes them:

- a session that settles a design conclusion writes the chapter that
  explains it and the claim it adds or amends **in the same commit**;
- a session that writes or amends a claim updates the system context map,
  so the map stays current;
- a construction session names the claim its work serves.

Changing a default instruction is a chore, and the change is versioned,
so a session started before it and one started after can be told apart
(123). A test can show, for a given instruction version and a scenario,
exactly what a session would be asked to write, without starting one
(124).

## The context map is the scope surface

The map is the bounded contexts the blueprints describe, in
domain-driven design's terms: contexts, the elements they name,
relationships between contexts typed by the closed set of DDD patterns
with an upstream and a downstream where the pattern has one, and links
between elements (198). Element kinds, link kinds and facets come from a
vocabulary the instance ships and extends; the relationship patterns do
not extend, because they are the map's type system.

Every context, element, relationship and link has a stable id, a name as
the book writes it, the chapter that states it, and a status of settled,
candidate or open. An open one is paired with the question that keeps it
open, and that question can be captured in one gesture from the drawing.

Structure and decoration are kept apart. A lane, a tier, a runtime or a
store is a tag or a kind. The map has no structure for them, so tagging
never changes what the map means.

There are two complete maps under one schema, current and target, with
the same id naming the same thing in both (201). The page shows the
target with two overlays computed by one difference: current against
target, which is the design difference, and target at the operator's
last review against target now, which is what to read next.

## Homes and scope

Every element names the git repository it is built in, its home, or
inherits the home its context sets; an external context homes nothing
(199). A repository's kinds and capabilities are **derived** from the
elements it homes by a table the schema fixes, never declared by hand,
and scope never reads them. So a change to a tag, a kind, a facet or the
vocabulary moves no verdict. Only a home change, a re-attachment, or a
claim version does.

A repository joins the fleet when the target map first homes something
in it, and its first planning's baseline is the claims attached to what
it homes (202). Until the operator draws a map at all, the map is
derived from the manifest by a fixed table, one context per repository,
so planning, verdicts and the backlog work with no book and no drawn map
(199a). Drawing the map replaces the derived contexts with the
operator's, and no claim moves for it unless its attachment does.

The map moves only through tools (211): attach and detach a claim, set a
home, add or amend a node, set a status with its question, capture a
question, mark reviewed, add a repository. Adding or amending a node is
refused without a chapter reference, which is the mechanism behind "the
map stays current". A session moves the map only in a writeback that
also writes the chapter, and no session changes an attachment or a home
for work it is doing itself.

## The review surface

The operator's review surface is the book and the context map (122). A
review view shows what changed in both since the operator last reviewed,
directs the reader to those chapters and nodes, and shows the previous
version beside each. It is derived from history, never stored and never
hand-written, and the mark that says "last reviewed" is one response
like any other.
