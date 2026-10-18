# books/sounding: authoring rules

The design is `design/capture/design.md`: the section "Questions:
sounding", the rows of its tables that name sounding, and the plan's
decision 11 and steps Q1 to Q5 and C6 (`design/capture/plan.md`).
Flywheel's statement, `design/flywheel-next/requirements.md`, holds
the elaboration sounding keeps the shape of, and a bare number in
parentheses cites it. sounding's own statement,
`design/sounding/requirements.md`, is written later (plan step Q1);
when it lands, add its chapters under `src/appendix/` as one heading
and `{{#include}}` lines, and cite its clauses as the statement's.

- Use the design's terms exactly as `design.md` defines them, so this
  glossary agrees with millpond's, headwater's and eddy's books. This
  book owns the question, the place, the exits, rounds and the
  operator's decision on a conclusion. millpond's book owns the
  capture contract, the inbox, curation and items: link it at
  `../millpond/` and never restate it. headwater is at `../headwater/`
  and eddy at `../eddy/`.
- Take millpond's definitions word for word into the glossary's
  "Words from millpond's book".
- Write to `books/VOICE.md`. Plain prose, no em dashes.
- A figure is inline SVG inside one `<figure class="sd-fig">` block
  with no blank line in it, since a blank line ends the HTML block.
  Draw with the `sd-` classes in `figures.css`, which follow the
  book's light and dark themes: sounding's accent marks the sounding,
  millpond's blue marks what millpond does. Give each figure a
  `role="img"`, an `aria-label`, a `<figcaption>`, and marker ids
  unique on its page. One figure makes one claim.
- Name no employer, client or private repository.

After any edit, from the repository root:

```bash
devenv shell -- vale books/sounding
devenv shell -- mdbook build books/sounding
rm -f devenv.lock
```
