// Suite navigation: add an "All books" home link to the mdBook menu bar,
// linking to the suite landing page one level above this book's root.
// The href is derived from this script's own URL (served from the book
// root), so it resolves at any page depth and any deploy base.
(() => {
  var self = document.currentScript;
  if (!self) return;
  var indexHref = self.src.replace(/[^/]*$/, "") + "../index.html";
  var HOME_SVG =
    '<span class="fa-svg"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">' +
    '<path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/>' +
    "</svg></span>";
  function inject() {
    var left =
      document.querySelector("#mdbook-menu-bar .left-buttons") ||
      document.querySelector(".menu-bar .left-buttons") ||
      document.querySelector(".left-buttons");
    if (!left || left.querySelector(".suite-home-link")) return;
    var a = document.createElement("a");
    a.href = indexHref;
    a.className = "icon-button suite-home-link";
    a.title = "All books — suite index";
    a.setAttribute("aria-label", "Suite index");
    a.innerHTML = HOME_SVG;
    left.insertBefore(a, left.firstChild);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
