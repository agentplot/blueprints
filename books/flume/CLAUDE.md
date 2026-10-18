# books/flume: authoring rules

The design is `design/capture/design.md`: the section "Launching:
flume", the rows of its tables that name flume, and the plan's
decision 12 and steps L1 to L4, P6 and C7 (`design/capture/plan.md`).
The mechanism comes from crew's rules that flume takes over,
`teams.1`–`4`, `teams.11`, `teams.15` and `plan.9`, `10`, `12`, `17`,
and a rule id in backticks cites crew's `docs/architecture/`. flume's
own statement, `design/flume/requirements.md`, is written later (plan
step L1); when it lands, add its chapters under `src/appendix/` as one
heading and `{{#include}}` lines, and cite its clauses as the
statement's.

- Use the design's terms exactly as `design.md` defines them, so this
  glossary agrees with millpond's and sounding's books. This book owns
  the launch, the place, kinds and stages, prompt delivery, stage ends,
  live state and tidying. millpond's book owns the inbox, items and
  sends; sounding's book owns the question, its exits and the decision
  on a conclusion; sluice's book owns submissions and landing. Link
  them at `../millpond/`, `../sounding/` and `../sluice/`, and never
  restate them.
- Take millpond's and sounding's definitions word for word into the
  glossary's sections for their words.
- Write to `books/VOICE.md`. Plain prose, no em dashes.
- A figure is inline SVG inside one `<figure class="fl-fig">` block
  with no blank line in it, since a blank line ends the HTML block.
  Draw with the `fl-` classes in `figures.css`, which follow the book's
  light and dark themes: flume's accent marks flume, millpond's blue
  what millpond does, sounding's magenta a sounding, and sluice's green
  a landing. Give each figure a `role="img"`, an `aria-label`, a
  `<figcaption>`, and marker ids unique on its page. One figure makes
  one claim.
- Keep crew's private state out: cite a rule by its id, never the
  incident behind it. Name no employer, client or private repository.

After any edit, from the repository root:

```bash
devenv shell -- vale books/flume
devenv shell -- mdbook build books/flume
rm -f devenv.lock
```
