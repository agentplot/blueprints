#!/usr/bin/env python3
"""Check the statechart model for internal consistency.

    uv run --with pyyaml --with jsonschema python3 check.py

- every machine file validates against schema.json
- every `ev` and `do` name exists in atoms.yaml; every effect's proof is an evidence name
- every transition target is a state of the same region (or a sibling region's state for `enter`)
- every `machine:` reference names a machine file (or a `$param`)
- every row has a kind, group and answers; row kinds are collected for the plan catalogue
- every diagram in ../diagrams/*.svg names states (data-state="machine.state") that exist (A.10.71)
- every profile binding covers every evidence and effect name (B.3.127)
Exit 1 on any finding.
"""
import glob, os, re, sys, json
import yaml, jsonschema

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
bad = []

schema = json.load(open(os.path.join(HERE, 'schema.json')))
atoms = yaml.safe_load(open(os.path.join(HERE, 'atoms.yaml')))
evidence = set(atoms['evidence'])
effects = atoms['effects']

machines = {}
for path in sorted(glob.glob(os.path.join(HERE, '**', '*.yaml'), recursive=True)):
    if os.path.basename(path) == 'atoms.yaml':
        continue
    m = yaml.safe_load(open(path))
    try:
        jsonschema.validate(m, schema)
    except jsonschema.ValidationError as e:
        bad.append(f"{path}: schema: {e.message} at {'/'.join(map(str, e.path))}")
        continue
    machines[m['machine']] = (path, m)

for name, spec in effects.items():
    if spec.get('proof') and spec['proof'] not in evidence:
        bad.append(f"atoms: effect {name} proves by {spec['proof']} which is not an evidence name")

rows = {}
def walk_guard(g, where):
    if not isinstance(g, dict):
        bad.append(f"{where}: guard not a mapping: {g!r}"); return
    for k, v in g.items():
        if k in ('all', 'any'):
            for x in v: walk_guard(x, where)
        elif k == 'not':
            walk_guard(v, where)
        elif k == 'ev':
            if v not in evidence: bad.append(f"{where}: unknown evidence {v}")
            for kk in ('eq_ev', 'ne_ev', 'gte_ev', 'lt_ev', 'gt_ev'):
                if kk in g and g[kk] not in evidence: bad.append(f"{where}: unknown evidence {g[kk]}")

def walk_effects(effs, where):
    for e in effs or []:
        if e['do'] not in effects: bad.append(f"{where}: unknown effect {e['do']}")

def walk_region(mname, rname, region, where, all_regions):
    states = region['states']
    if region['initial'] not in states:
        bad.append(f"{where}: initial {region['initial']} not a state")
    for sname, st in states.items():
        sw = f"{where}.{sname}"
        st = st or {}
        if 'row' in st:
            r = st['row']; rows.setdefault(r['kind'], []).append(f"{mname}.{sname}")
        walk_effects(st.get('entry'), sw); walk_effects(st.get('exit'), sw)
        mref = st.get('machine')
        if mref and not mref.startswith('$') and mref not in machines:
            bad.append(f"{sw}: submachine {mref} has no definition")
        sub = st.get('regions') or {}
        for rn, rg in sub.items():
            walk_region(mname, rn, rg, f"{sw}[{rn}]", sub)
        for i, t in enumerate(st.get('transitions') or []):
            tw = f"{sw}.transitions[{i}]"
            walk_guard(t['when'], tw)
            walk_effects(t.get('effects'), tw)
            if t['to'] not in states:
                bad.append(f"{tw}: target {t['to']} not a state of region {rname}")
            for child, cstate in (t.get('enter') or {}).items():
                pass  # child states live in the referenced template; checked below by name
        for child, cstate in (st.get('enter') or {}).items():
            pass

for mname, (path, m) in machines.items():
    for rname, region in m['regions'].items():
        walk_region(mname, rname, region, f"{mname}[{rname}]", m['regions'])

# enter targets: the named state must exist in some template's regions
template_states = {}
for mname, (path, m) in machines.items():
    def collect(region):
        for s, st in region['states'].items():
            template_states.setdefault(mname, set()).add(s)
            for rg in (st or {}).get('regions', {}).values(): collect(rg)
    for region in m['regions'].values(): collect(region)
all_states = set().union(*template_states.values())
def enters(obj, where):
    for k, v in (obj.get('enter') or {}).items():
        if v not in all_states: bad.append(f"{where}: enter {k}: {v} names no state")
for mname, (path, m) in machines.items():
    def walk(region, where):
        for s, st in region['states'].items():
            st = st or {}
            enters(st, f"{where}.{s}")
            for i, t in enumerate(st.get('transitions') or []): enters(t, f"{where}.{s}.transitions[{i}]")
            for rg in st.get('regions', {}).values(): walk(rg, f"{where}.{s}")
    for region in m['regions'].values(): walk(region, mname)

# diagrams must not drift from the definitions
for svg in sorted(glob.glob(os.path.join(ROOT, 'diagrams', '*.svg'))):
    s = open(svg).read()
    for ref in re.findall(r'data-state="([^"]+)"', s):
        mn, _, sn = ref.partition('.')
        if mn not in template_states or sn not in template_states[mn]:
            bad.append(f"{os.path.basename(svg)}: data-state {ref} names no state")
    for ref in re.findall(r'data-row="([^"]+)"', s):
        if ref not in rows: bad.append(f"{os.path.basename(svg)}: data-row {ref} names no row kind")
    for ref in re.findall(r'data-effect="([^"]+)"', s):
        if ref not in effects: bad.append(f"{os.path.basename(svg)}: data-effect {ref} names no effect")

# profile bindings must be complete
for prof in sorted(glob.glob(os.path.join(ROOT, 'profiles', '*.yaml'))):
    p = yaml.safe_load(open(prof))
    if p.get('format') != 'flywheel-profile/1':
        continue
    bound_ev = set(p.get('evidence', {})) | set(p.get('inherits_evidence', []))
    bound_fx = set(p.get('effects', {})) | set(p.get('inherits_effects', []))
    inh = p.get("inherits") or []
    for b in ([inh] if isinstance(inh, str) else inh):
        base = yaml.safe_load(open(os.path.join(ROOT, "profiles", b + ".yaml")))
        bound_ev |= set(base.get("evidence", {})); bound_fx |= set(base.get("effects", {}))
    proofs = {spec.get('proof') for spec in effects.values()}
    if p.get('complete', True):
        for e in sorted(evidence - bound_ev):
            bad.append(f"{os.path.basename(prof)}: evidence {e} not bound")
        for f in sorted(set(effects) - bound_fx):
            bad.append(f"{os.path.basename(prof)}: effect {f} not bound")

# conformance scenarios must validate and name only real rows and effects
sschema_path = os.path.join(ROOT, 'conformance', 'schema.json')
if os.path.exists(sschema_path):
    sschema = json.load(open(sschema_path))
    nscen = 0
    for path in sorted(glob.glob(os.path.join(ROOT, 'conformance', '**', '*.yaml'), recursive=True)):
        if '/lamp/' in path:
            continue
        sc = yaml.safe_load(open(path))
        try:
            jsonschema.validate(sc, sschema)
        except jsonschema.ValidationError as e:
            bad.append(f"{os.path.relpath(path, ROOT)}: scenario schema: {e.message} at {'/'.join(map(str, e.path))}"); continue
        nscen += 1
        if sc.get('machines'):
            continue  # a toy machine set; not checked against the flywheel's rows
        then = sc.get('then', {})
        for r in then.get('rows', []) or []:
            for k in (r.get('present') or []) + (r.get('absent') or []):
                if k not in rows: bad.append(f"{os.path.relpath(path, ROOT)}: row kind {k} does not exist")
        for e in then.get('effects', []) or []:
            if e['do'] not in effects: bad.append(f"{os.path.relpath(path, ROOT)}: effect {e['do']} does not exist")
        for step in sc.get('when', []):
            w = step.get('word')
            if w and w['row'].rsplit('/', 1)[-1] not in rows:
                bad.append(f"{os.path.relpath(path, ROOT)}: word row kind {w['row'].rsplit('/', 1)[-1]} does not exist")
    print(f"scenarios: {nscen}")

print(f"machines: {len(machines)} · evidence: {len(evidence)} · effects: {len(effects)} · row kinds: {len(rows)}")
for k, v in sorted(rows.items()): print(f"  row {k}: {', '.join(v)}")
for b in bad: print("FAIL", b)
sys.exit(1 if bad else 0)
