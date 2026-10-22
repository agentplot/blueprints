#!/usr/bin/env bash
# The published design books as one site, for GitHub Pages at
# https://agentplot.github.io/blueprints/: each book at /blueprints/<book>/,
# its address the site-url in its book.toml, and an index page naming them.
# pinout and testledger are retiring, so they stay unpublished.
#   scripts/books-site.sh [out]    (default: _site)
set -euo pipefail
cd "$(dirname "$0")/.."
out=$(mkdir -p "${1:-_site}" && cd "${1:-_site}" && pwd)
find "$out" -mindepth 1 -delete
books=(sluice headwater eddy millpond flume sounding tailrace)
items=""
for b in "${books[@]}"; do
  mdbook build "books/$b" --dest-dir "$out/$b"
  title=$(sed -n 's/^title = "\(.*\)"$/\1/p' "books/$b/book.toml" | head -1)
  line=$(sed -n 's/^description = "\([^:.]*\).*$/\1/p' "books/$b/book.toml" | head -1)
  items+="<li><a href=\"$b/\">$title</a><span>${line#The design book for }</span></li>"
done
cat > "$out/index.html" <<HTML
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Design books</title>
<style>
:root{--bg:#f6f7f9;--fg:#15181d;--mu:#56606c;--rule:#d9dde3;--ac:#7d6110}
@media (prefers-color-scheme:dark){:root{--bg:#121519;--fg:#e8eaed;--mu:#9aa3ad;--rule:#2a3038;--ac:#c9a227}}
body{background:var(--bg);color:var(--fg);font:1.05rem/1.55 "IBM Plex Sans",system-ui,sans-serif;margin:0;padding:2.5rem 16px}
main{max-width:40rem;margin:0 auto}
h1{font:600 2rem/1.2 "Space Grotesk",system-ui,sans-serif;margin:0 0 .5rem}
p{color:var(--mu);margin:0 0 1.5rem}
ul{list-style:none;padding:0;margin:0}
li{padding:.8rem 0;border-top:1px solid var(--rule);display:grid;gap:.2rem}
a{color:var(--fg);font-weight:600;text-underline-offset:3px}
a:hover{color:var(--ac)}
span{color:var(--mu);font-size:.95rem}
</style>
</head>
<body><main>
<h1>Design books</h1>
<p>The settled design of each tool in the Flywheel family, from <a href="https://github.com/agentplot/blueprints">agentplot/blueprints</a>.</p>
<ul>$items</ul>
</main></body>
</html>
HTML
echo "built ${#books[@]} books into $out"
