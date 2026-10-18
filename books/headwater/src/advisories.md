# Advisories

An advisory is a published warning that names versions of a dependency
as unsafe. headwater asks every bound advisory source for the
advisories that name a version (47). A dependency whose pin an advisory
names is reported as affected, naming the advisory, in every report
that holds the dependency (18).

## Apart from notes

headwater reports an advisory apart from notes (19). It never folds an
advisory into a release's notes and never infers one from them. A
release whose notes mention a security fix is reported with those
words, as upstream wrote them, and only an advisory source makes a
dependency affected.

Each advisory comes with its identity, its severity as the advisory
gives it, and a link (47). headwater ranks none of them and translates
no severity into a scale of its own.

## Nothing hides an affected pin

An acknowledgement never changes an advisory. A dependency with an
advisory naming its pin is reported as affected whatever its
acknowledgements say (22). A person who dismissed the release that
would fix it still sees the advisory in every report that holds the
dependency, until the pin moves to a version the advisory does not name
(S10). [Acknowledgements](acknowledgements.md) shows the two side by
side over time.

## The advisory source

The first advisory source is OSV, asked in batches by Package URL and
version, with each advisory's severity as the advisory gives it (C.5).
OSV learns what every source learns: the identities and versions
headwater asks about, and nothing else of the repository (37).

## What it leaves to others

headwater reports advisories for the dependencies the repository's
authors chose. What those depend on in turn is outside it; scanning the
whole graph for advisories belongs to a vulnerability scanner
(section 8).

Still to rule: questions 6 and 21, and the statement's own question on
whether advisories wait on a tier's cadence, in
[Open questions](open.md#advisories).
