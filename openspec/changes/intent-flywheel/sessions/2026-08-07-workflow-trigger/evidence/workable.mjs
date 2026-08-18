#!/usr/bin/env node
// Workable-now query over a proposal directory. Node builtins only.
// A proposal is workable when it is not yet `merged` and every proposal
// it needs has reached `merged`.
import { readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const dirArg = process.argv.indexOf('--dir');
const dir = dirArg === -1 ? 'proposals' : process.argv[dirArg + 1];

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!kv) continue;
    const [, k, raw] = kv;
    out[k] = raw.trim().startsWith('[')
      ? raw.trim().slice(1, -1).split(',').map(s => s.trim()).filter(Boolean)
      : raw.trim();
  }
  return out;
}

const props = readdirSync(dir)
  .filter(f => f.endsWith('.md'))
  .map(f => ({ id: basename(f, '.md'), ...frontmatter(readFileSync(join(dir, f), 'utf8')) }));

const state = Object.fromEntries(props.map(p => [p.id, p.state]));
const workable = [], blocked = [];
for (const p of props) {
  if (p.state === 'merged') continue;
  const needs = Array.isArray(p.needs) ? p.needs : p.needs ? [p.needs] : [];
  const unmet = needs.filter(n => state[n] !== 'merged');
  (unmet.length ? blocked : workable).push({ ...p, unmet });
}

console.log('workable now (deps at merged):');
for (const p of workable) console.log(`  ${p.state.padEnd(10)} ${p.id}  [${p.repo}]  review:${p.review}`);
console.log('blocked:');
for (const p of blocked) console.log(`  ${p.state.padEnd(10)} ${p.id}  [${p.repo}]  waits on: ${p.unmet.join(', ')}`);
