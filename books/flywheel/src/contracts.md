# Contracts

The canonical artifacts this book owns. Each contract lives as a file
under `books/flywheel/contracts/` and is embedded where a chapter
describes it; the file is the artifact of record and programmatic
consumers read it directly. The threshold for extraction: more than
one consumer, or one programmatic consumer, benefits from reading the
artifact without parsing markdown.

No contract is extracted yet. The candidates, in extraction order:

| Candidate | Pins | Consumers |
|---|---|---|
| `run-record.schema.json` | the run record's entry shapes | the report renderer, `flywheel approve`, golden-record tests |
| `review-ruling.schema.json` | `.flywheel/review.json` — `proceed` / `refix` / `escalate` and their fields | the construction loop |
| `labels.yaml` | the label taxonomy and milestone naming — `type:*`, `state:*`, `stage:*`, `closed:*`, `intent/*`, `bolt/*` | `flywheel-setup`, every inbox filter, the board views |
| `file-channels.md` | `.flywheel/verify.md`, the `NONE` sentinel, `.flywheel/review.json` paths | verify and review sessions, the loop |
| `fleet.schema.yaml` | the `fleet.yaml` manifest format | `flywheel up` / `status` / `server` |
| `work-order.md` | the work-order shape: invocation line, blank line, brief | every loop, every session profile |
| OpenSpec schemas (`flywheel-intent`, `bolt-*`) | the artifact set and `loop:` block each change binds | `install-schemas`, every change's `.openspec.yaml` |

The tracker itself is the flywheel's published language: any tool that
reads or writes the org's issues conforms to `labels.yaml` once it is
extracted, and the label taxonomy changes only through a change to
this book.
