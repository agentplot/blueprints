# books/eddy: authoring rules

The source is `design/capture/design.md`: "Meetings: eddy", the
capture contract its parts print, and the rows of the tables that name
eddy. eddy has no statement of its own yet. When one is written under
`design/eddy/requirements.md`, the book gains an appendix that includes
it by anchor, as `books/sluice/` does, and the chapters cite its
clauses in place of the design's prose.

- `books/VOICE.md` binds every chapter. Plain prose, no em dashes.
- Cite Flywheel's statement (`design/flywheel-next/requirements.md`)
  by bare clause number in parentheses, (115), where a sentence rests
  on a clause. Never restate a clause.
- Use the design's words exactly. millpond's book owns the capture
  contract, the inbox, readers and curation; link it at `../millpond/`
  rather than describing them again.
- A figure is inline SVG inside `<figure class="fig">`, with a
  `<title>`, a `<desc>`, a `<figcaption>` and no blank line anywhere
  between `<figure>` and `</figure>`, since a blank line ends an HTML
  block. Colours come only from the classes in `figures.css`, which
  follow mdBook's light and dark themes. Marker ids carry the figure's
  prefix, since every figure on a page shares one id space.
- Name no employer, client or private repository. The reader's
  instructions are the inbox's data (119), described generically.

After any edit, from the repository root:

```bash
devenv shell -- vale books/eddy
devenv shell -- mdbook build books/eddy
rm -f devenv.lock
```
