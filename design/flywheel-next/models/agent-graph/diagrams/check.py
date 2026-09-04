#!/usr/bin/env python3
"""Check the hand-drawn diagrams against the definitions (gaps.md, A.10.71).

    python3 diagrams/check.py

Every element id of the form node-<name>, row-<name>, store-<name> or
effect-<name> in a diagram must name something defined under machines/;
and every row kind in machines/rows.yaml must appear on at least one
diagram. Exits 1 on any failure. No YAML library: the definitions are
read with regular expressions so the check runs anywhere python3 does.
"""
import glob
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
MACHINES = os.path.join(HERE, "..", "machines")


def names(pattern, files):
    out = set()
    for f in files:
        out |= set(re.findall(pattern, open(f).read(), re.M))
    return out


def main():
    nodes = names(r"^name: ([a-z][a-z0-9./-]*)", glob.glob(os.path.join(MACHINES, "node-*.yaml")))
    nodes |= {"runtime", "derive"}  # the runtime itself and the object derivations (§6, §2)
    rows = names(r"^  - name: ([a-z][a-z0-9./-]*)", [os.path.join(MACHINES, "rows.yaml")])
    stores = names(r"store: ([a-z][a-z0-9./-]*)", [os.path.join(MACHINES, "graph.yaml")])
    stores |= {"ledger", "claims", "objects", "intent", "items", "place"}  # the ledger; claims; the objects family and objects named by kind
    effects = names(r"^  - \{name: ([a-z][a-z0-9.]*)", [os.path.join(MACHINES, "atoms.yaml")])

    bad = 0
    seen_rows = set()
    for svg in sorted(glob.glob(os.path.join(HERE, "*.svg"))):
        s = open(svg).read()
        for kind, name in re.findall(r'id="(node|row|store|effect)-([^"]+)"', s):
            table = {"node": nodes, "row": rows, "store": stores, "effect": effects}[kind]
            if kind == "row":
                seen_rows.add(name)
            if name not in table:
                print(f"{os.path.basename(svg)}: {kind}-{name} has no definition")
                bad += 1
    missing = rows - seen_rows
    if missing:
        print(f"rows on no diagram: {', '.join(sorted(missing))}")
        bad += 1
    print("ok" if not bad else f"{bad} problem(s)")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
