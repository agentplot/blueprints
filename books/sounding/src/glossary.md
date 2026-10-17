# Glossary

The words of the design, each defined once. sounding has no statement
yet, so the capture design (`design/capture/design.md`) is the binding
copy. The words of millpond and of crew are
[millpond's book](../millpond/glossary.html)'s, word for word. A
number in parentheses cites Flywheel's statement.

Four words mean one thing in another book and another here. A
capture's **source** names where its event came from, such as
`release`, while a question's **sources** are the material it starts
from. millpond's **drop** is a move on a signal, while sounding's is
the operator's answer to a conclusion. The signal kind **ask** is one
of five kinds, while `sounding ask` is an exit. A signal's **kind** is
its type, while flume's is a list of stages, and flume's kind
`question` is the one that runs a sounding's session. Each word keeps
its meaning in the book it belongs to.

## sounding's words

| word | meaning |
|---|---|
| **accept** | the operator's answer that settles a conclusion's item: millpond keeps the conclusion as the item's record, and each piece of work it proposes becomes an item, or an entry in crew's plan |
| **ask** | `sounding ask`: the exit that puts a question only the operator can answer on a card; the session waits for the answer |
| **card** | a question or a decision put to the operator outside the session's pane, and answered once |
| **conclude** | `sounding conclude`: the exit that writes `conclusion.md` and ends the round |
| **conclusion** | what a sounding ends on: the answer, its evidence, what it would change, the work it proposes and what stays open; the operator accepts it, sends it back for another round, or drops it |
| **drop** | the operator's answer that records the reason and removes the sounding's worktree |
| **exit** | one of the three commands through which a session reaches beyond its place: conclude, offer and ask (65) |
| **finding** | something a session learns beyond its question; an offer hands it to millpond as a capture (58) |
| **go on** | the operator's answer that starts the next round in the same worktree: the conclusion moves to `rounds/<n>.md` and the operator's notes join the question; the herdr plugin's send back |
| **offer** | `sounding offer`: the exit that hands a finding beyond the question to `millpond land` as a capture of its own, its own excerpt, of kind `ask`, asserted by the sounding, under the key `sounding/<name>/<n>` (62); the session goes on |
| **parked** | the state of a sounding whose session is neither working nor waiting on the operator |
| **place** | a sounding's worktree of the repository its question is about, on the branch `sounding/<name>`, which flume makes and runs as the kind `question` |
| **question** | what a sounding works: one question whose answer the operator decides before the work it implies begins; `sounding open` writes it with its sources into `question.md` |
| **record** | an accepted conclusion as millpond keeps it on its item; curation names it when it answers a later signal on the subject (116) |
| **round** | one session's run at the question, from its start hook to its conclusion; go on starts the next |
| **sounding** | one question, worked by one session in one place, ending on one conclusion; also the tool that runs them |
| **sources** | a question's material: the item's signals, the captures they came from, any earlier conclusion on the subject, and what `/sound` names |
| **start hook** | the Claude Code plugin's hook that hands a round's session its question, its sources and its earlier rounds |
| **stop check** | the hook at a session's end that sends it back unless it wrote a conclusion or a note saying where the next round would start |
| **timebox** | the limit on one round's length; when it runs out, the session concludes with what it knows |
| **unattended** | the way of running in which the session works alone and each round ends on a card |
| **waiting on the operator** | the state of a sounding whose conclusion, or whose ask, the operator has not answered |
| **with the operator** | `--with-me`: the way of running in which the session works in a pane beside the operator as a conversation |
| **working** | the state of a sounding whose session is working its round |

## Flywheel's words

| word | meaning |
|---|---|
| **elaboration** | in Flywheel, one unit of design work on an intent, worked by one free-flowing session; each one is a sounding (24) |
| **elaboration type** | in Flywheel, what decides how an elaboration ends; it writes what the elaboration concludes to the design book and its claims (25, 187) |
| **intent** | in Flywheel, one thread of design work about one subject, pursued until the operator closes it |

## Words from flume's book

flume's book defines these, and this page gives its definitions word
for word.

| word | meaning |
|---|---|
| **flume** | the tool that launches and tracks one agent in one worktree through a kind's stages, on the host it runs on, and tidies the place when the work lands or is dropped ([its book](../flume/)) |
| **kind** (flume's) | a list of stages, each naming its prompt and its deliverable: fix, change, question, or one a repository declares |

## Words from millpond's book

millpond's book defines these, and this page gives its definitions
word for word.

| word | meaning |
|---|---|
| **answered** | the move that names the claim or record that settled a signal |
| **bolt** | in crew, a team's branch of work: its units and chores land on it, and it lands on the shared branch |
| **capture** | the record of one source event: its key, its source, its event date and a pointer to its raw material; the same event captured twice is one capture (111) |
| **capture contract** | the JSON Lines an adapter prints and every host takes, each line holding exactly one of `capture`, `cursor` or `done` |
| **chore** | in crew, a piece of work that needs no design of its own, such as a tool's bump; a `route` move offers one |
| **claim** | in Flywheel, a standing statement of what a repository must satisfy; `answered` and `challenge` name one |
| **conformance pack** | contract lines and the records a host must write from them, with the meeting checks; every host and every adapter part passes it |
| **curation** | a Claude session that proposes one move per signal, in batches, through millpond's tools; the operator accepts or changes each batch (116) |
| **excerpt** | the verbatim text a signal quotes from its source, with its position (113) |
| **inbox** | a git repository, or a branch in one, holding captures, signals, moves and items in Flywheel's record formats |
| **item** | the unit of work: the signals curation joined, one or many, with its brief and its sends; Flywheel's proposed intent (109) |
| **join** | the move that makes an item from signals, or grows one still proposed |
| **key** | a source event's identity, the same from every host and every run (111) |
| **kind** | a signal's type, one of constraint, ask, question, commitment and reaction (113) |
| **move** | the one standing decision on a signal: drop, answered, challenge, join, attach or route, each with a stated consequence (107, 116) |
| **operator** | the person who accepts or changes each batch of moves, sends items, and decides each conclusion; on its own, the user |
| **own excerpt** | a capture is its own excerpt when its line carries the signal's fields, so millpond writes its one signal as it lands; a release is one |
| **planner** | crew's agent that orders items across teams and turns each into a chore or a unit |
| **plugin** | the installable unit in every host, holding parts; Flywheel's statement calls it a package, and a named set of parts a bundle (228, 284) |
| **raw material** | the event as its source served it, whole: notes, a transcript, a log; the adapter writes it as raw files |
| **send** | millpond giving one item to one worktree, with its brief and an agent, or an item that asks a question to a sounding |
| **signal** | one assertion from a capture: its kind, who asserted it, its subjects, the assertion in a sentence, the verbatim excerpt with its position, and the claims it argues with; never changed once written (113) |
| **unit** | in crew, one designed piece of a team's work, landed on its bolt |
| **unmoved** | a signal with no move yet |
