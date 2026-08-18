// Book grabber: collect passages and typed feedback across the design site
// into a persistent basket, then copy the whole batch as markdown — each
// grab a repo-relative ref, a blockquote, and a "Feedback:" line — for
// pasting into agent sessions.
//
// Two capture modes, one basket:
//
// - Book pages: select text → a "Grab" popover appears (quote + optional
//   feedback note); alt+click grabs a heading or a mermaid diagram. Refs
//   are books/<book>/src/<chapter>.md#nearest-heading, derived from the
//   page URL.
// - Context map: selecting a node (or context) adds a feedback box to the
//   detail panel. Refs are context-map/maps/<map>.js#<node-id>, and the
//   quote carries the node's name and cited chapter. Reads the viewer's
//   window.SCM/window.MAPS globals; touches no viewer internals.
//
// The basket lives in localStorage — every book and the served map share
// an origin per preview port and on Pages, so it persists across pages.
// Notes are editable in the basket panel. No server component.
//
// The canonical file is books/book-grab.js. Each book links it into its
// root and lists it in additional-js (same wiring as suite-nav.js);
// context-map/book-grab.js is the same link, loaded by the map viewer.
// Mode is decided by this script's own URL: served from context-map/ it
// is the map; anywhere else it is a book, and the book root and name are
// derived from the URL so refs resolve at any page depth and deploy base.
(() => {
  var self = document.currentScript;
  if (!self) return;
  var mapMode = /\/context-map\//.test(self.src);

  var pageRef = null;
  if (!mapMode) {
    var rootPath = new URL(self.src.replace(/[^/]*$/, "")).pathname;
    var book = decodeURIComponent(rootPath.replace(/\/$/, "").split("/").pop());
    var rel = decodeURIComponent(location.pathname.slice(rootPath.length));
    if (rel === "") rel = "index.html";
    if (rel === "print.html" || rel === "404.html" || !/\.html$/.test(rel)) return;
    pageRef = "books/" + book + "/src/" + rel.replace(/\.html$/, ".md");
  }

  var STORE_KEY = "book-grab:basket";
  var memory = [];
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return memory;
    }
  }
  function save(items) {
    memory = items;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(items));
    } catch (e) {}
  }

  function grab(ref, text, note) {
    var items = load();
    items.push({
      ref: ref,
      text: text,
      note: (note || "").trim(),
      title: document.title,
      ts: Date.now(),
    });
    save(items);
    render();
  }

  function formatBatch(items) {
    return items
      .map(function (it) {
        var quote = it.text
          .split("\n")
          .map(function (line) {
            return "> " + line;
          })
          .join("\n");
        var out = it.ref + "\n" + quote;
        if (it.note) out += "\n\nFeedback: " + it.note;
        return out;
      })
      .join("\n\n");
  }

  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        legacyCopy(text);
        done();
      });
    } else {
      legacyCopy(text);
      done();
    }
  }
  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (e) {}
    ta.remove();
  }

  // --- basket UI (shared) -----------------------------------------------

  var css =
    ".bg-badge{position:fixed;right:18px;bottom:18px;z-index:2000;min-width:40px;height:40px;" +
    "padding:0 12px;border-radius:20px;border:1px solid var(--theme-popup-border,#45526a);" +
    "background:var(--theme-popup-bg,#1f2430);color:var(--fg,#bfbdb6);font:600 14px/38px sans-serif;" +
    "text-align:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.4)}" +
    ".bg-badge.bg-empty{opacity:.45}" +
    ".bg-panel{position:fixed;right:18px;bottom:66px;z-index:2000;width:400px;max-width:calc(100vw - 36px);" +
    "max-height:60vh;display:flex;flex-direction:column;border:1px solid var(--theme-popup-border,#45526a);" +
    "border-radius:6px;background:var(--theme-popup-bg,#1f2430);color:var(--fg,#bfbdb6);" +
    "font:13px/1.45 sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.5)}" +
    ".bg-head{display:flex;gap:8px;align-items:center;padding:8px 10px;" +
    "border-bottom:1px solid var(--theme-popup-border,#45526a)}" +
    ".bg-head b{flex:1;font-size:12px;text-transform:uppercase;letter-spacing:.06em}" +
    ".bg-btn{border:1px solid var(--theme-popup-border,#45526a);background:transparent;" +
    "color:inherit;border-radius:4px;padding:3px 9px;font:inherit;font-size:12px;cursor:pointer}" +
    ".bg-btn:hover{border-color:var(--links,#0096cf);color:var(--links,#0096cf)}" +
    ".bg-list{overflow-y:auto;margin:0;padding:0;list-style:none}" +
    ".bg-list li{display:flex;gap:8px;padding:8px 10px;border-bottom:1px solid rgba(128,128,128,.15)}" +
    ".bg-list li:last-child{border-bottom:0}" +
    ".bg-item{flex:1;min-width:0}" +
    ".bg-ref{font:11px/1.4 monospace;color:var(--links,#0096cf);word-break:break-all}" +
    ".bg-quote{color:inherit;opacity:.85;margin-top:2px;overflow:hidden;display:-webkit-box;" +
    "-webkit-line-clamp:3;-webkit-box-orient:vertical}" +
    ".bg-note{margin-top:3px;color:#ffb454;cursor:pointer;white-space:pre-wrap}" +
    ".bg-note.bg-hint{color:inherit;opacity:.4;font-style:italic}" +
    ".bg-text{width:100%;box-sizing:border-box;min-height:52px;margin-top:3px;padding:4px 6px;" +
    "border:1px solid var(--theme-popup-border,#45526a);border-radius:4px;resize:vertical;" +
    "background:rgba(0,0,0,.15);color:inherit;font:12px/1.45 sans-serif}" +
    ".bg-x{align-self:flex-start;border:0;background:transparent;color:inherit;opacity:.5;" +
    "cursor:pointer;font:14px/1 sans-serif;padding:2px 4px}" +
    ".bg-x:hover{opacity:1}" +
    ".bg-none{padding:14px 10px;opacity:.6}" +
    ".bg-pop{position:absolute;z-index:2001;width:320px;max-width:calc(100vw - 24px);padding:8px;" +
    "border:1px solid var(--theme-popup-border,#45526a);background:var(--theme-popup-bg,#1f2430);" +
    "color:var(--fg,#bfbdb6);border-radius:6px;box-shadow:0 4px 16px rgba(0,0,0,.5);" +
    "font:13px/1.45 sans-serif}" +
    ".bg-pop .bg-quote{margin-bottom:4px}" +
    ".bg-pop-row{display:flex;gap:8px;justify-content:flex-end;margin-top:6px}" +
    ".bg-fb{margin-top:14px}" +
    ".bg-fb h3{font-size:11px;text-transform:uppercase;letter-spacing:.1em;margin:0 0 4px;opacity:.6}" +
    ".bg-qgrab{margin-left:8px;padding:1px 7px;font-size:11px;opacity:.45;vertical-align:baseline}" +
    ".bg-qgrab:hover{opacity:1}";
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var badge = document.createElement("button");
  badge.className = "bg-badge";
  badge.title = "Book grabber — collected passages and feedback";
  var panel = null;

  function render() {
    var items = load();
    badge.textContent = "⛏ " + items.length;
    badge.classList.toggle("bg-empty", items.length === 0);
    if (panel) renderPanel(items);
  }

  function noteEditor(item, index, holder) {
    var show = function () {
      holder.textContent = "";
      var div = document.createElement("div");
      div.className = "bg-note" + (item.note ? "" : " bg-hint");
      div.textContent = item.note || "＋ feedback";
      div.title = "Edit feedback";
      div.addEventListener("click", function () {
        holder.textContent = "";
        var ta = document.createElement("textarea");
        ta.className = "bg-text";
        ta.value = item.note || "";
        ta.addEventListener("blur", function () {
          var items = load();
          if (items[index]) {
            items[index].note = ta.value.trim();
            item = items[index];
            save(items);
          }
          show();
        });
        holder.appendChild(ta);
        ta.focus();
      });
      holder.appendChild(div);
    };
    show();
  }

  function renderPanel(items) {
    panel.textContent = "";
    var head = document.createElement("div");
    head.className = "bg-head";
    var label = document.createElement("b");
    label.textContent = "Grabs (" + items.length + ")";
    var copy = document.createElement("button");
    copy.className = "bg-btn";
    copy.textContent = "Copy batch";
    copy.disabled = !items.length;
    copy.addEventListener("click", function () {
      copyText(formatBatch(load()), function () {
        copy.textContent = "Copied ✓";
        setTimeout(function () {
          copy.textContent = "Copy batch";
        }, 1500);
      });
    });
    var clear = document.createElement("button");
    clear.className = "bg-btn";
    clear.textContent = "Clear";
    clear.disabled = !items.length;
    clear.addEventListener("click", function () {
      save([]);
      render();
    });
    head.appendChild(label);
    head.appendChild(copy);
    head.appendChild(clear);
    panel.appendChild(head);

    if (!items.length) {
      var none = document.createElement("div");
      none.className = "bg-none";
      none.textContent = mapMode
        ? "Select a node, then add feedback from the detail panel."
        : "Select text on any book page, or alt+click a heading or diagram.";
      panel.appendChild(none);
      return;
    }
    var list = document.createElement("ul");
    list.className = "bg-list";
    items.forEach(function (it, i) {
      var li = document.createElement("li");
      var body = document.createElement("div");
      body.className = "bg-item";
      var ref = document.createElement("div");
      ref.className = "bg-ref";
      ref.textContent = it.ref;
      var quote = document.createElement("div");
      quote.className = "bg-quote";
      quote.textContent = it.text;
      var noteHolder = document.createElement("div");
      noteEditor(it, i, noteHolder);
      body.appendChild(ref);
      body.appendChild(quote);
      body.appendChild(noteHolder);
      var x = document.createElement("button");
      x.className = "bg-x";
      x.textContent = "✕";
      x.title = "Remove";
      x.addEventListener("click", function () {
        var current = load();
        current.splice(i, 1);
        save(current);
        render();
      });
      li.appendChild(body);
      li.appendChild(x);
      list.appendChild(li);
    });
    panel.appendChild(list);
  }

  badge.addEventListener("click", function () {
    if (panel) {
      panel.remove();
      panel = null;
    } else {
      panel = document.createElement("div");
      panel.className = "bg-panel";
      document.body.appendChild(panel);
      renderPanel(load());
    }
  });

  window.addEventListener("storage", function (e) {
    if (e.key === STORE_KEY) render();
  });

  function mount() {
    document.body.appendChild(badge);
    render();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  // --- grab popover (shared) --------------------------------------------
  // Quote + optional feedback, anchored near the grab point; `ref` is the
  // full repo-relative ref the grab records.
  var pop = null;
  function hidePop() {
    if (pop) {
      pop.remove();
      pop = null;
    }
  }
  function showPop(x, y, text, ref) {
    hidePop();
    pop = document.createElement("div");
    pop.className = "bg-pop";
    var quote = document.createElement("div");
    quote.className = "bg-quote";
    quote.textContent = text;
    var ta = document.createElement("textarea");
    ta.className = "bg-text";
    ta.placeholder = "Feedback… (optional)";
    var row = document.createElement("div");
    row.className = "bg-pop-row";
    var add = document.createElement("button");
    add.className = "bg-btn";
    add.textContent = "Add to basket";
    add.addEventListener("click", function () {
      grab(ref, text, ta.value);
      hidePop();
      window.getSelection().removeAllRanges();
    });
    ta.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") hidePop();
      // Enter queues the grab; Shift+Enter inserts a newline. Cmd/Ctrl+Enter
      // keeps working — it is just an Enter without Shift.
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        add.click();
      }
    });
    row.appendChild(add);
    pop.appendChild(quote);
    pop.appendChild(ta);
    pop.appendChild(row);
    pop.style.left = Math.max(8, x) + "px";
    pop.style.top = y + "px";
    document.body.appendChild(pop);
    ta.focus();
  }

  // Any element carrying data-grab-ref is a grab affordance — the host page
  // (a book page or the map viewer) supplies the ref and quote, this script
  // supplies the capture. data-grab-text overrides the quote; without it the
  // element's own text is quoted.
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-grab-ref]");
    if (!t || e.target.closest(".bg-pop,.bg-panel,.bg-badge")) return;
    e.preventDefault();
    e.stopPropagation();
    showPop(
      Math.max(8, e.pageX),
      e.pageY + 8,
      t.getAttribute("data-grab-text") || t.textContent.trim(),
      t.getAttribute("data-grab-ref")
    );
  });

  // --- book mode: selection + alt+click capture -------------------------

  function bookMode() {
    function nearestAnchor(node) {
      var el = node && node.nodeType === 1 ? node : node && node.parentElement;
      if (!el) return "";
      var scope = document.querySelector("main") || document.body;
      var headings = scope.querySelectorAll(
        "h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]"
      );
      var found = null;
      for (var i = 0; i < headings.length; i++) {
        var h = headings[i];
        var pos = h.compareDocumentPosition(el);
        if (h === el || h.contains(el) || pos & Node.DOCUMENT_POSITION_FOLLOWING) {
          found = h;
        } else {
          break;
        }
      }
      return found ? "#" + found.id : "";
    }

    var chip = null;
    function hideChip() {
      if (chip) {
        chip.remove();
        chip = null;
      }
    }

    document.addEventListener("mouseup", function (e) {
      if (e.target.closest(".bg-chip,.bg-pop,.bg-panel,.bg-badge,.bg-qgrab")) return;
      setTimeout(function () {
        hideChip();
        var sel = window.getSelection();
        if (!sel || sel.isCollapsed) return;
        var text = sel.toString().trim();
        if (!text) return;
        var range = sel.getRangeAt(0);
        var rect = range.getBoundingClientRect();
        var anchor = nearestAnchor(range.startContainer);
        chip = document.createElement("button");
        chip.className = "bg-chip bg-btn";
        chip.style.position = "absolute";
        chip.style.zIndex = "2001";
        chip.textContent = "⛏ Grab";
        var x = Math.max(8, rect.left + window.scrollX);
        var y = rect.bottom + window.scrollY + 6;
        chip.style.left = x + "px";
        chip.style.top = y + "px";
        chip.style.background = "var(--theme-popup-bg,#1f2430)";
        chip.addEventListener("mousedown", function (ev) {
          ev.preventDefault(); // keep the selection alive through the click
        });
        chip.addEventListener("click", function () {
          hideChip();
          showPop(x, y, text, pageRef + anchor);
        });
        document.body.appendChild(chip);
      }, 0);
    });

    document.addEventListener("selectionchange", function () {
      var sel = window.getSelection();
      if (chip && (!sel || sel.isCollapsed)) hideChip();
    });

    document.addEventListener("click", function (e) {
      if (!e.altKey) return;
      var heading = e.target.closest(
        "h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]"
      );
      if (heading) {
        e.preventDefault();
        showPop(
          e.pageX,
          e.pageY + 8,
          heading.textContent.trim(),
          pageRef + "#" + heading.id
        );
        return;
      }
      var diagram = e.target.closest(".mermaid");
      if (diagram) {
        e.preventDefault();
        showPop(e.pageX, e.pageY + 8, "(mermaid diagram)", pageRef + nearestAnchor(diagram));
      }
    });

    // Open-question entries get their own grab chips. The convention in the
    // built books: an "Open questions" heading (mdBook id "open-questions",
    // "-1" suffixed when repeated) followed by one <li> per question, its
    // title in a leading <strong>. The chip grabs the entry's full text with
    // the section anchor, so a batch of existing questions pastes to an
    // agent with context intact.
    function questionChips() {
      var scope = document.querySelector("main") || document.body;
      var heads = scope.querySelectorAll(
        "h1[id^='open-question'],h2[id^='open-question'],h3[id^='open-question'],h4[id^='open-question']"
      );
      Array.prototype.forEach.call(heads, function (head) {
        var level = +head.tagName[1];
        var el = head.nextElementSibling;
        while (el && !(/^H[1-6]$/.test(el.tagName) && +el.tagName[1] <= level)) {
          if (el.tagName === "UL") {
            Array.prototype.forEach.call(el.children, function (li) {
              if (li.tagName !== "LI" || li.querySelector(".bg-qgrab")) return;
              var text = li.textContent.replace(/\s+/g, " ").trim();
              var b = document.createElement("button");
              b.className = "bg-qgrab bg-btn";
              b.textContent = "⛏ grab question";
              b.title = "Grab this open question";
              b.addEventListener("click", function (ev) {
                ev.preventDefault();
                var r = li.getBoundingClientRect();
                showPop(
                  Math.max(8, r.left + window.scrollX),
                  r.bottom + window.scrollY + 6,
                  text,
                  pageRef + "#" + head.id
                );
              });
              li.appendChild(b);
            });
          }
          el = el.nextElementSibling;
        }
      });
    }
    questionChips();
  }

  // --- map mode: feedback box in the viewer's detail panel --------------

  function mapMode_() {
    var drafts = {}; // id -> unsaved textarea text, surviving re-renders

    function selected() {
      var S = window.SCM;
      if (!S || !S.state || !S.state.sel.length) return null;
      var id = S.state.sel[S.state.sel.length - 1];
      var map = S.state.map;
      var m = window.MAPS && window.MAPS[map];
      if (!m) return null;
      var i;
      for (i = 0; i < m.contexts.length; i++)
        if (m.contexts[i].id === id)
          return { id: id, map: map, e: m.contexts[i], isCtx: true };
      for (i = 0; i < m.nodes.length; i++)
        if (m.nodes[i].id === id)
          return { id: id, map: map, e: m.nodes[i], isCtx: false };
      return null;
    }

    function quoteFor(s) {
      var e = s.e;
      var what = s.isCtx
        ? "bounded context, tier " + e.tier
        : e.layer + "/" + e.kind;
      return e.name + " (" + what + ") — cites " + e.ref;
    }

    function inject() {
      var d = document.getElementById("detail");
      if (!d || d.hidden || d.querySelector(".bg-fb")) return;
      var s = selected();
      if (!s) return;
      var box = document.createElement("div");
      box.className = "bg-fb";
      var h = document.createElement("h3");
      h.textContent = "feedback";
      var ta = document.createElement("textarea");
      ta.className = "bg-text";
      ta.placeholder = "Feedback on this " + (s.isCtx ? "context" : "node") + "…";
      ta.value = drafts[s.id] || "";
      ta.addEventListener("input", function () {
        drafts[s.id] = ta.value;
      });
      var add = document.createElement("button");
      add.className = "bg-btn";
      add.style.marginTop = "4px";
      add.textContent = "Add to basket";
      add.addEventListener("click", function () {
        grab("context-map/maps/" + s.map + ".js#" + s.id, quoteFor(s), ta.value);
        delete drafts[s.id];
        ta.value = "";
      });
      ta.addEventListener("keydown", function (ev) {
        // Enter queues; Shift+Enter newline; Cmd/Ctrl+Enter still queues.
        if (ev.key === "Enter" && !ev.shiftKey) {
          ev.preventDefault();
          add.click();
        }
      });
      box.appendChild(h);
      box.appendChild(ta);
      box.appendChild(add);
      d.appendChild(box);
    }

    var d = document.getElementById("detail");
    if (d) new MutationObserver(inject).observe(d, { childList: true });
    inject(); // a deep-linked selection may have rendered before this ran
  }

  if (mapMode) {
    mapMode_();
  } else {
    bookMode();
  }
})();
