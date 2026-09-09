// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="index.html">Introduction</a></span></li><li class="chapter-item expanded "><li class="part-title">Part I: what must always hold</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/preamble.html"><strong aria-hidden="true">1.</strong> Preamble, purpose, actors and vocabulary</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a01-the-operators-response.html"><strong aria-hidden="true">2.</strong> A.1 The operator&#39;s response</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a02-the-rail.html"><strong aria-hidden="true">3.</strong> A.2 The rail</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a03-intents-and-curation.html"><strong aria-hidden="true">4.</strong> A.3 Intents and curation</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a04-elaborations-and-their-types.html"><strong aria-hidden="true">5.</strong> A.4 Elaborations and their types</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a05-planning-and-construction.html"><strong aria-hidden="true">6.</strong> A.5 Planning and construction</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a06-findings-and-chores.html"><strong aria-hidden="true">7.</strong> A.6 Findings and chores</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a07-sessions.html"><strong aria-hidden="true">8.</strong> A.7 Sessions</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a08-state-and-evidence.html"><strong aria-hidden="true">9.</strong> A.8 State and evidence</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a09-observability.html"><strong aria-hidden="true">10.</strong> A.9 Observability</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a10-the-engine-the-domain-and-the-model-as-an-artifact.html"><strong aria-hidden="true">11.</strong> A.10 The engine, the domain, and the model as an artifact</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a11-instructions-and-skills-as-data.html"><strong aria-hidden="true">12.</strong> A.11 Instructions and skills as data</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a12-scenarios-and-testing-as-data.html"><strong aria-hidden="true">13.</strong> A.12 Scenarios and testing as data</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a13-coexistence.html"><strong aria-hidden="true">14.</strong> A.13 Coexistence</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a14-claims-as-built-and-the-ledger.html"><strong aria-hidden="true">15.</strong> A.14 Claims, as-built, and the ledger</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a15-signals-and-curation.html"><strong aria-hidden="true">16.</strong> A.15 Signals and curation</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a16-default-instructions-and-the-review-surface.html"><strong aria-hidden="true">17.</strong> A.16 Default instructions and the review surface</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a17-sessions-charged-by-the-machinery.html"><strong aria-hidden="true">18.</strong> A.17 Sessions charged by the machinery</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a18-landing-pull-requests-and-merge-back.html"><strong aria-hidden="true">19.</strong> A.18 Landing, pull requests and merge-back</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a19-operation.html"><strong aria-hidden="true">20.</strong> A.19 Operation</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a20-intents-as-changes-gathered-elaborations.html"><strong aria-hidden="true">21.</strong> A.20 Intents as changes; gathered elaborations</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a21-deliverables-and-their-producers.html"><strong aria-hidden="true">22.</strong> A.21 Deliverables and their producers</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a22-endpoints-and-routing.html"><strong aria-hidden="true">23.</strong> A.22 Endpoints and routing</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a23-where-files-live.html"><strong aria-hidden="true">24.</strong> A.23 Where files live</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a24-bootstrapping-and-repositories.html"><strong aria-hidden="true">25.</strong> A.24 Bootstrapping and repositories</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a25-dispatch.html"><strong aria-hidden="true">26.</strong> A.25 Dispatch</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a26-instances.html"><strong aria-hidden="true">27.</strong> A.26 Instances</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a27-machines-types-and-context.html"><strong aria-hidden="true">28.</strong> A.27 Machines, types and context</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a28-packages-and-setup.html"><strong aria-hidden="true">29.</strong> A.28 Packages and setup</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a29-users-and-ownership.html"><strong aria-hidden="true">30.</strong> A.29 Users and ownership</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a30-environments.html"><strong aria-hidden="true">31.</strong> A.30 Environments</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a31-host-pools.html"><strong aria-hidden="true">32.</strong> A.31 Host pools</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a32-identity.html"><strong aria-hidden="true">33.</strong> A.32 Identity</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a33-tenancy-and-encryption.html"><strong aria-hidden="true">34.</strong> A.33 Tenancy and encryption</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a34-the-hosted-tiers.html"><strong aria-hidden="true">35.</strong> A.34 The hosted tiers</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a35-plans-and-presets.html"><strong aria-hidden="true">36.</strong> A.35 Plans and presets</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a36-rulings-carried-over.html"><strong aria-hidden="true">37.</strong> A.36 Rulings carried over</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a37-the-control-plane.html"><strong aria-hidden="true">38.</strong> A.37 The control plane</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a38-the-phone.html"><strong aria-hidden="true">39.</strong> A.38 The phone</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/a39-the-book-viewer.html"><strong aria-hidden="true">40.</strong> A.39 The book viewer</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/state-store-contract.html"><strong aria-hidden="true">41.</strong> Part B, the state store contract</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/profiles.html"><strong aria-hidden="true">42.</strong> Part C, profiles</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="fundamentals/invariants-and-givens.html"><strong aria-hidden="true">43.</strong> Invariants, non-goals, givens and open questions</a></span></li><li class="chapter-item expanded "><li class="part-title">Part II: how it works</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="how/the-loop.html"><strong aria-hidden="true">44.</strong> The loop</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="how/design-and-construction.html"><strong aria-hidden="true">45.</strong> Design and construction</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="how/book-and-context-map.html"><strong aria-hidden="true">46.</strong> The book and the context map</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="how/page-and-palette.html"><strong aria-hidden="true">47.</strong> The page and the palette</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="how/instances-and-accounts.html"><strong aria-hidden="true">48.</strong> Instances, hosts and accounts</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="how/state-store-and-profiles.html"><strong aria-hidden="true">49.</strong> The state store and its profiles</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="how/control-plane.html"><strong aria-hidden="true">50.</strong> The control plane and the hosted tiers</a></span></li><li class="chapter-item expanded "><li class="part-title">Part III: surfaces</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="surfaces/surfaces.html"><strong aria-hidden="true">51.</strong> The surfaces</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="surfaces/flows.html"><strong aria-hidden="true">52.</strong> Flows</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="surfaces/forms-keys-and-modes.html"><strong aria-hidden="true">53.</strong> Forms, keys and modes</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="surfaces/rulings-and-open.html"><strong aria-hidden="true">54.</strong> Rulings and what is open</a></span></li><li class="chapter-item expanded "><li class="part-title">Part IV: reference</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="reference/roadmap.html"><strong aria-hidden="true">55.</strong> The roadmap</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="reference/models.html"><strong aria-hidden="true">56.</strong> The models</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="reference/proposals.html"><strong aria-hidden="true">57.</strong> The proposals</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="reference/requirements-style.html"><strong aria-hidden="true">58.</strong> How the requirements are written</a></span></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split('#')[0].split('?')[0];
        if (current_page.endsWith('/')) {
            current_page += 'index.html';
        }
        const links = Array.prototype.slice.call(this.querySelectorAll('a'));
        const l = links.length;
        for (let i = 0; i < l; ++i) {
            const link = links[i];
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The 'index' page is supposed to alias the first chapter in the book.
            if (link.href === current_page
                || i === 0
                && path_to_root === ''
                && current_page.endsWith('/index.html')) {
                link.classList.add('active');
                let parent = link.parentElement;
                while (parent) {
                    if (parent.tagName === 'LI' && parent.classList.contains('chapter-item')) {
                        parent.classList.add('expanded');
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                const clientRect = e.target.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                sessionStorage.setItem('sidebar-scroll-offset', clientRect.top - sidebarRect.top);
            }
        }, { passive: true });
        const sidebarScrollOffset = sessionStorage.getItem('sidebar-scroll-offset');
        sessionStorage.removeItem('sidebar-scroll-offset');
        if (sidebarScrollOffset !== null) {
            // preserve sidebar scroll position when navigating via links within sidebar
            const activeSection = this.querySelector('.active');
            if (activeSection) {
                const clientRect = activeSection.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                const currentOffset = clientRect.top - sidebarRect.top;
                this.scrollTop += currentOffset - parseFloat(sidebarScrollOffset);
            }
        } else {
            // scroll sidebar to current active section when navigating via
            // 'next/previous chapter' buttons
            const activeSection = document.querySelector('#mdbook-sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        const sidebarAnchorToggles = document.querySelectorAll('.chapter-fold-toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(el => {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define('mdbook-sidebar-scrollbox', MDBookSidebarScrollbox);


// ---------------------------------------------------------------------------
// Support for dynamically adding headers to the sidebar.

(function() {
    // This is used to detect which direction the page has scrolled since the
    // last scroll event.
    let lastKnownScrollPosition = 0;
    // This is the threshold in px from the top of the screen where it will
    // consider a header the "current" header when scrolling down.
    const defaultDownThreshold = 150;
    // Same as defaultDownThreshold, except when scrolling up.
    const defaultUpThreshold = 300;
    // The threshold is a virtual horizontal line on the screen where it
    // considers the "current" header to be above the line. The threshold is
    // modified dynamically to handle headers that are near the bottom of the
    // screen, and to slightly offset the behavior when scrolling up vs down.
    let threshold = defaultDownThreshold;
    // This is used to disable updates while scrolling. This is needed when
    // clicking the header in the sidebar, which triggers a scroll event. It
    // is somewhat finicky to detect when the scroll has finished, so this
    // uses a relatively dumb system of disabling scroll updates for a short
    // time after the click.
    let disableScroll = false;
    // Array of header elements on the page.
    let headers;
    // Array of li elements that are initially collapsed headers in the sidebar.
    // I'm not sure why eslint seems to have a false positive here.
    // eslint-disable-next-line prefer-const
    let headerToggles = [];
    // This is a debugging tool for the threshold which you can enable in the console.
    let thresholdDebug = false;

    // Updates the threshold based on the scroll position.
    function updateThreshold() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // The number of pixels below the viewport, at most documentHeight.
        // This is used to push the threshold down to the bottom of the page
        // as the user scrolls towards the bottom.
        const pixelsBelow = Math.max(0, documentHeight - (scrollTop + windowHeight));
        // The number of pixels above the viewport, at least defaultDownThreshold.
        // Similar to pixelsBelow, this is used to push the threshold back towards
        // the top when reaching the top of the page.
        const pixelsAbove = Math.max(0, defaultDownThreshold - scrollTop);
        // How much the threshold should be offset once it gets close to the
        // bottom of the page.
        const bottomAdd = Math.max(0, windowHeight - pixelsBelow - defaultDownThreshold);
        let adjustedBottomAdd = bottomAdd;

        // Adjusts bottomAdd for a small document. The calculation above
        // assumes the document is at least twice the windowheight in size. If
        // it is less than that, then bottomAdd needs to be shrunk
        // proportional to the difference in size.
        if (documentHeight < windowHeight * 2) {
            const maxPixelsBelow = documentHeight - windowHeight;
            const t = 1 - pixelsBelow / Math.max(1, maxPixelsBelow);
            const clamp = Math.max(0, Math.min(1, t));
            adjustedBottomAdd *= clamp;
        }

        let scrollingDown = true;
        if (scrollTop < lastKnownScrollPosition) {
            scrollingDown = false;
        }

        if (scrollingDown) {
            // When scrolling down, move the threshold up towards the default
            // downwards threshold position. If near the bottom of the page,
            // adjustedBottomAdd will offset the threshold towards the bottom
            // of the page.
            const amountScrolledDown = scrollTop - lastKnownScrollPosition;
            const adjustedDefault = defaultDownThreshold + adjustedBottomAdd;
            threshold = Math.max(adjustedDefault, threshold - amountScrolledDown);
        } else {
            // When scrolling up, move the threshold down towards the default
            // upwards threshold position. If near the bottom of the page,
            // quickly transition the threshold back up where it normally
            // belongs.
            const amountScrolledUp = lastKnownScrollPosition - scrollTop;
            const adjustedDefault = defaultUpThreshold - pixelsAbove
                + Math.max(0, adjustedBottomAdd - defaultDownThreshold);
            threshold = Math.min(adjustedDefault, threshold + amountScrolledUp);
        }

        if (documentHeight <= windowHeight) {
            threshold = 0;
        }

        if (thresholdDebug) {
            const id = 'mdbook-threshold-debug-data';
            let data = document.getElementById(id);
            if (data === null) {
                data = document.createElement('div');
                data.id = id;
                data.style.cssText = `
                    position: fixed;
                    top: 50px;
                    right: 10px;
                    background-color: 0xeeeeee;
                    z-index: 9999;
                    pointer-events: none;
                `;
                document.body.appendChild(data);
            }
            data.innerHTML = `
                <table>
                  <tr><td>documentHeight</td><td>${documentHeight.toFixed(1)}</td></tr>
                  <tr><td>windowHeight</td><td>${windowHeight.toFixed(1)}</td></tr>
                  <tr><td>scrollTop</td><td>${scrollTop.toFixed(1)}</td></tr>
                  <tr><td>pixelsAbove</td><td>${pixelsAbove.toFixed(1)}</td></tr>
                  <tr><td>pixelsBelow</td><td>${pixelsBelow.toFixed(1)}</td></tr>
                  <tr><td>bottomAdd</td><td>${bottomAdd.toFixed(1)}</td></tr>
                  <tr><td>adjustedBottomAdd</td><td>${adjustedBottomAdd.toFixed(1)}</td></tr>
                  <tr><td>scrollingDown</td><td>${scrollingDown}</td></tr>
                  <tr><td>threshold</td><td>${threshold.toFixed(1)}</td></tr>
                </table>
            `;
            drawDebugLine();
        }

        lastKnownScrollPosition = scrollTop;
    }

    function drawDebugLine() {
        if (!document.body) {
            return;
        }
        const id = 'mdbook-threshold-debug-line';
        const existingLine = document.getElementById(id);
        if (existingLine) {
            existingLine.remove();
        }
        const line = document.createElement('div');
        line.id = id;
        line.style.cssText = `
            position: fixed;
            top: ${threshold}px;
            left: 0;
            width: 100vw;
            height: 2px;
            background-color: red;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(line);
    }

    function mdbookEnableThresholdDebug() {
        thresholdDebug = true;
        updateThreshold();
        drawDebugLine();
    }

    window.mdbookEnableThresholdDebug = mdbookEnableThresholdDebug;

    // Updates which headers in the sidebar should be expanded. If the current
    // header is inside a collapsed group, then it, and all its parents should
    // be expanded.
    function updateHeaderExpanded(currentA) {
        // Add expanded to all header-item li ancestors.
        let current = currentA.parentElement;
        while (current) {
            if (current.tagName === 'LI' && current.classList.contains('header-item')) {
                current.classList.add('expanded');
            }
            current = current.parentElement;
        }
    }

    // Updates which header is marked as the "current" header in the sidebar.
    // This is done with a virtual Y threshold, where headers at or below
    // that line will be considered the current one.
    function updateCurrentHeader() {
        if (!headers || !headers.length) {
            return;
        }

        // Reset the classes, which will be rebuilt below.
        const els = document.getElementsByClassName('current-header');
        for (const el of els) {
            el.classList.remove('current-header');
        }
        for (const toggle of headerToggles) {
            toggle.classList.remove('expanded');
        }

        // Find the last header that is above the threshold.
        let lastHeader = null;
        for (const header of headers) {
            const rect = header.getBoundingClientRect();
            if (rect.top <= threshold) {
                lastHeader = header;
            } else {
                break;
            }
        }
        if (lastHeader === null) {
            lastHeader = headers[0];
            const rect = lastHeader.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top >= windowHeight) {
                return;
            }
        }

        // Get the anchor in the summary.
        const href = '#' + lastHeader.id;
        const a = [...document.querySelectorAll('.header-in-summary')]
            .find(element => element.getAttribute('href') === href);
        if (!a) {
            return;
        }

        a.classList.add('current-header');

        updateHeaderExpanded(a);
    }

    // Updates which header is "current" based on the threshold line.
    function reloadCurrentHeader() {
        if (disableScroll) {
            return;
        }
        updateThreshold();
        updateCurrentHeader();
    }


    // When clicking on a header in the sidebar, this adjusts the threshold so
    // that it is located next to the header. This is so that header becomes
    // "current".
    function headerThresholdClick(event) {
        // See disableScroll description why this is done.
        disableScroll = true;
        setTimeout(() => {
            disableScroll = false;
        }, 100);
        // requestAnimationFrame is used to delay the update of the "current"
        // header until after the scroll is done, and the header is in the new
        // position.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Closest is needed because if it has child elements like <code>.
                const a = event.target.closest('a');
                const href = a.getAttribute('href');
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    threshold = targetElement.getBoundingClientRect().bottom;
                    updateCurrentHeader();
                }
            });
        });
    }

    // Takes the nodes from the given head and copies them over to the
    // destination, along with some filtering.
    function filterHeader(source, dest) {
        const clone = source.cloneNode(true);
        clone.querySelectorAll('mark').forEach(mark => {
            mark.replaceWith(...mark.childNodes);
        });
        dest.append(...clone.childNodes);
    }

    // Scans page for headers and adds them to the sidebar.
    document.addEventListener('DOMContentLoaded', function() {
        const activeSection = document.querySelector('#mdbook-sidebar .active');
        if (activeSection === null) {
            return;
        }

        const main = document.getElementsByTagName('main')[0];
        headers = Array.from(main.querySelectorAll('h2, h3, h4, h5, h6'))
            .filter(h => h.id !== '' && h.children.length && h.children[0].tagName === 'A');

        if (headers.length === 0) {
            return;
        }

        // Build a tree of headers in the sidebar.

        const stack = [];

        const firstLevel = parseInt(headers[0].tagName.charAt(1));
        for (let i = 1; i < firstLevel; i++) {
            const ol = document.createElement('ol');
            ol.classList.add('section');
            if (stack.length > 0) {
                stack[stack.length - 1].ol.appendChild(ol);
            }
            stack.push({level: i + 1, ol: ol});
        }

        // The level where it will start folding deeply nested headers.
        const foldLevel = 3;

        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const level = parseInt(header.tagName.charAt(1));

            const currentLevel = stack[stack.length - 1].level;
            if (level > currentLevel) {
                // Begin nesting to this level.
                for (let nextLevel = currentLevel + 1; nextLevel <= level; nextLevel++) {
                    const ol = document.createElement('ol');
                    ol.classList.add('section');
                    const last = stack[stack.length - 1];
                    const lastChild = last.ol.lastChild;
                    // Handle the case where jumping more than one nesting
                    // level, which doesn't have a list item to place this new
                    // list inside of.
                    if (lastChild) {
                        lastChild.appendChild(ol);
                    } else {
                        last.ol.appendChild(ol);
                    }
                    stack.push({level: nextLevel, ol: ol});
                }
            } else if (level < currentLevel) {
                while (stack.length > 1 && stack[stack.length - 1].level > level) {
                    stack.pop();
                }
            }

            const li = document.createElement('li');
            li.classList.add('header-item');
            li.classList.add('expanded');
            if (level < foldLevel) {
                li.classList.add('expanded');
            }
            const span = document.createElement('span');
            span.classList.add('chapter-link-wrapper');
            const a = document.createElement('a');
            span.appendChild(a);
            a.href = '#' + header.id;
            a.classList.add('header-in-summary');
            filterHeader(header.children[0], a);
            a.addEventListener('click', headerThresholdClick);
            const nextHeader = headers[i + 1];
            if (nextHeader !== undefined) {
                const nextLevel = parseInt(nextHeader.tagName.charAt(1));
                if (nextLevel > level && level >= foldLevel) {
                    const toggle = document.createElement('a');
                    toggle.classList.add('chapter-fold-toggle');
                    toggle.classList.add('header-toggle');
                    toggle.addEventListener('click', () => {
                        li.classList.toggle('expanded');
                    });
                    const toggleDiv = document.createElement('div');
                    toggleDiv.textContent = '❱';
                    toggle.appendChild(toggleDiv);
                    span.appendChild(toggle);
                    headerToggles.push(li);
                }
            }
            li.appendChild(span);

            const currentParent = stack[stack.length - 1];
            currentParent.ol.appendChild(li);
        }

        const onThisPage = document.createElement('div');
        onThisPage.classList.add('on-this-page');
        onThisPage.append(stack[0].ol);
        const activeItemSpan = activeSection.parentElement;
        activeItemSpan.after(onThisPage);
    });

    document.addEventListener('DOMContentLoaded', reloadCurrentHeader);
    document.addEventListener('scroll', reloadCurrentHeader, { passive: true });
})();

