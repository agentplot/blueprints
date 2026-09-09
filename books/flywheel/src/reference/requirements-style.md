# How the requirements are written

Part I is a **mechanism-free requirements statement**, and the form is
described in `design/requirements-style.md`. Its reader is a model that
does not exist yet: a person or an agent about to design the thing, not
a builder verifying a change. Each clause carries one rule, numbered
once and never renumbered; the number is the handle every diagram,
machine file and conformance scenario cites, which is what lets a
checker fail when the model and the statement drift apart. Parts A and B
name no labels, columns, queues, loops, guards, files or tools, so a
clause cannot rule out a design nobody has thought of yet. Real tools
appear only in the environment givens and in Part C, where naming them
is the point.

That form is why this book includes Part I rather than retelling it. A
retelling would be a second statement with its own wording, and the two
would part company on the first amendment. The clause you read here is
the clause the checker reads, byte for byte, pulled from
`design/flywheel-next/requirements.md` at build time. Part II is where
explanation belongs, and it explains by citing clause numbers rather
than restating clauses.

A statement is not a specification. The statement says what must be true
of any model; an OpenSpec change says what one built thing must do, and
is archived into a repository's standing specifications when it lands.
Both are wanted, at different moments: the statement is what a design is
derived from, the specification is what a built thing is checked against
(A.14).
