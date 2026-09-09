# The page and the palette

One page, served on the operator's private network, working on a phone
(155). It has four regions: a header, a machinery strip, a rail, and a
board, with a dock that opens over the board. Everything the operator
does to the flywheel, they do here or in the chat, and the two speak the
same grammar.

## What the page is not

It is not a dashboard the machinery pushes to. Every region is derived
from a read taken at one point, and the header shows the as-of time of
that read. No rendering of the rail is stored anywhere (15). Reload it,
open it on a second device, restart the machinery: the same page.

It is also not a second way to write state. Every operation the operator
may invoke is a **tool** of the state store with a schema naming its
arguments by object id, and the page's controls, the chat, the dispatch
agent and the machinery's own commands all call the same tools. No
caller has an operation the others lack (193).

## The rail

The rail is titled Decisions and shows one delivery: the numbered
decisions in order, approve then decide then answer, each group sorted
by number; then the attention lines, outside the count; then the tail of
what has happened since this sink's mark, also outside the count. It is
the same list the chat prints, with the answers as controls (18).

Every card shows its number, its kind, the phase of its object, its
title, the evidence its kind names, its owner where one is set, and its
answers as buttons. Signal weight on an intent, type and target bolt and
cited claims on a unit, idle time on a session, and, on anything that
starts work, "what a yes starts", derived from the type file at its
version.

One click is one response. The card takes an in-flight state and refuses
a second click until the response settles, then leaves the rail. "Yes to
all" sends one response per approve decision, in number order, each
recorded on its own. It never sends a batch, because a batch would be a
second grammar with its own failure modes.

The rail is as notable for what it never shows: work in progress with no
decision pending, signals and moves, anything already answered,
machinery problems other than a response that could not apply, more than
one decision per intent awaiting approval, and any decision for a
session that is working.

## The board and the dock

The board is the status view drawn by phase, and it holds objects only,
never counts. Four lanes: Inception, Bolt plan, Construction, Operation,
with Bolt plan drawn as a narrow gate between the first two because in
steady state it is one proposal per repository. There is a second view
of the same objects on the context map, switched in the board's header.
A focused rail card lights its object in whichever view is showing.

The dock opens over the right of the board and the board does not move.
It has one page per kind of object: a decision, a proposal read whole, a
unit, a bolt's ledger, an intent's thread, an elaboration, a repository,
a host, a claim, a map node. Its footer carries that object's answers,
or says "nothing to answer" and why, which is the honest thing to show
for an object whose decision lives on the rail.

Two links recur throughout. Any page citing a chapter or a claim carries
"read in book" per citation, and any object with OpenSpec artifacts
behind it carries "the artifacts behind it". The book itself is a
standalone viewer served beside the page, linked out to and never
embedded (315).

## The palette

The page has exactly one typed input, and it is the palette. It opens
from anywhere with a key, has one field and no second mode, and what the
operator types decides what it sends, in the grammar the chat already
speaks (19, 194).

| typed | what it is | what it sends |
|---|---|---|
| plain text | a capture, verbatim | one capture with one signal of kind ask |
| `/<command> …` | a command from the tool catalogue | that command's tool call |
| `412`, `412 yes`, `412: <text>` | the short reply grammar | an answer on that decision |

**The page parses no word of plain text.** A leading slash and a leading
number choose a tool and nothing else, and neither reads the text for
meaning. Marking a capture as the first idea of a thread is a toggle
beside the field, which is a judgment made with a control, never a word
parsed out of the sentence.

On a slash, the palette shows the catalogue fuzzy-matched as the
operator keeps typing, each row naming the command, what it does in the
operator's own words, and the object it will act on. The list is
filtered by the caller's permissions, so a tool the caller may not
invoke is not offered at all. A command missing an argument asks for it
in place.

On a number, `412` alone lists that decision's own answers, one row
each; `412 yes` sends at once. A number is unambiguous and needs no
interpreter, which is why it stays the deterministic path however clever
the rest becomes.

## Free text and the interpreter

Where free text must be understood rather than captured, it goes to the
host's agent and never to a parser (194). That agent is the dispatch
agent for chat, or a model running in the page's own browser, or nothing
at all when the operator used a control.

The agent reads and answers with the query tools on its own. Every
**write** it makes is a proposed tool call the operator confirms: the
interpreter resolves the names against live objects and shows the call
it is about to send; the operator's confirmation is the response; only
the confirmed call is recorded, once (153). A message asking for several
things yields several proposed cards, each confirmed on its own. A name
resolving to nothing, or to more than one object, is asked about and
never guessed.

So there are two paths and they never blur. Controls and numbers are
deterministic and go straight through. Language goes to a model that may
only propose, and the operator's confirmation is what turns a proposal
into a response.

## Delivery

A sink is a page, a chat address, a shared channel or a bell on a named
surface, and sinks are per member: each member's page is a sink of their
own, and so is each chat address on their entry (236). Each carries the
decision kinds routed to it, a cadence, and a delivery mark. Exactly one
presenter delivers to each sink, and a host running construction is no
sink at all, so it is silent (82). Nothing the machinery notices is
visible only on the host that noticed it.
