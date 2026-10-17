# books/millpond: authoring rules

The design is `design/capture/design.md`. Flywheel's statement,
`design/flywheel-next/requirements.md`, owns the capture contract and
the record formats millpond keeps, and a bare number in parentheses
cites it. millpond's own statement, `design/millpond/requirements.md`,
is written later from the design; when it lands, add its chapters
under `src/requirements/` as one heading and `{{#include}}` lines, and
cite its clauses as the statement's.

- Use the design's terms exactly as `design.md` defines them, so this
  glossary agrees with headwater's and eddy's books. This book owns the
  capture contract, the inbox, curation and items; it links to
  `../headwater/` for releases, `../eddy/` for meetings,
  `../sounding/` for questions and `../flume/` for launching.
- Write to `books/VOICE.md`. Plain prose, no em dashes.
- A figure is inline SVG inside one `<figure class="mp-fig">` block
  with no blank line in it, since a blank line ends the HTML block.
  Draw with the `mp-` classes in `figures.css`, which follow the book's
  light and dark themes. Give each figure a `role="img"`, an
  `aria-label`, a `<figcaption>`, and marker ids unique on its page.
  One figure makes one claim.

After any edit run `mdbook build` here and Vale from the repository
root.
