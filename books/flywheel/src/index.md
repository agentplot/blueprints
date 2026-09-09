# The flywheel

The flywheel turns an operator's intent into built software, with the
operator spending their attention only where judgment is needed. It runs
design work that settles what to build and construction work that builds
it, using agent sessions for the work and the operator for the
decisions, and everything it does is inspectable after the fact.

One page carries the whole of the operator's part. Decisions stand on a
rail, each with a short number and a set of answers; a decision appears
the moment a choice becomes the operator's to make and disappears when
it is made. One response is enough. After a yes, approved work becomes
items, items start sessions, exits advance stages, merges happen, and
the next stage begins without anyone nudging it.

**Part I is the requirements, included from their source.** It is not a
summary of them and not a paraphrase. Each chapter is a heading and an
include, and the text comes out of
`design/flywheel-next/requirements.md` at build time, so the book and
the statement cannot drift apart. The requirements are numbered clauses
in three parts: Part A is the data plane, Part B is the contract to
durable shared storage, and Part C is the profiles that satisfy it.
Parts A and B name no mechanism at all, which is what makes them
readable by someone designing from scratch.

**Part II explains.** It is written fresh, one short chapter per idea,
and it cites clause numbers in parentheses the way the sources do. Read
it first if the machinery is new to you; read Part I first if you are
about to design against it.

**Part III is the surfaces**, included the same way from the surfaces
document: what the page shows, the flows through it, the forms, the keys
and the rulings already made.

**Part IV is reference**: the roadmap by phase, the models and how to run
their checker, the proposals still carrying narrative, and a note on why
the requirements are written the way they are.

Two habits make this book work. Cite a clause by its number rather than
retelling it, and when the design moves, move the clause at its source
and let the book follow.
