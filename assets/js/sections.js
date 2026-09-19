/* ===========================================================================
   SECTION VISIBILITY — the only place you edit to hide or show a section
   ===========================================================================

   Put  //  in front of a line  ->  that section disappears completely:
                                    from the page, from the top menu and
                                    from the footer links.
   Take the  //  away again     ->  it comes straight back.

   Nothing else anywhere needs changing. Save the file and reload the page.
   =========================================================================== */

var SITE_SECTIONS = [
  "about",        // About me — short profile / full profile tabs
  "trust",        // "Why me" — the six proof points and the pull quote
  "services",     // The twelve service cards
  "expertise",    // Methods, software, data types, languages
  //"experience",   // Career, education and awards   <-- comment this line out to hide it
  //"research",     // Research focus and publication profiles
  "testimonials", // Client feedback — content comes from testimonials.txt
  "booking"       // Appointment booking and contact form
];


/* ===========================================================================
   SMALLER PARTS — individual pieces inside a section
   ===========================================================================
   Same rule: put // in front of a line to switch that piece off, remove the //
   to bring it back. Save and reload; no build step.
   =========================================================================== */

var SITE_PARTS = [
  "about-full-profile",  // the "Full profile" tab in the About section
  "about-stats",         // the four figures under the intro (15+ / 3 / 4 / R)
  "trust-pullquote"      // the quoted line at the top of "Why me"
];


/* ---------------------------------------------------------------------------
   Machinery below — you do not need to touch any of it.

   It runs in the <head>, before the page is painted, so a hidden section
   never flashes up before disappearing. The section is then removed from the
   document altogether once parsing finishes, so it is not read by screen
   readers and not picked up by search engines.
   --------------------------------------------------------------------------- */
(function () {
  'use strict';

  var ALL = ["about", "trust", "services", "expertise", "experience",
           "research", "testimonials", "booking"];
  var wanted = (typeof SITE_SECTIONS !== 'undefined' && SITE_SECTIONS) || ALL;

  var hidden = ALL.filter(function (id) { return wanted.indexOf(id) === -1; });
  if (!hidden.length) return;

  // Match the section itself plus every in-page link pointing at it.
  var selector = hidden.map(function (id) {
    return '#' + id +
           ',a[href="#' + id + '"]' +
           ',a[href="index.html#' + id + '"]' +
           ',a[href="/#' + id + '"]';
  }).join(',');

  var style = document.createElement('style');
  style.textContent = selector + '{display:none!important}';
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', function () {
    var nodes = document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) {
      // A hidden link may be the only child of a footer <li>; drop that too.
      var el = nodes[i];
      var li = el.closest && el.closest('.footer li');
      (li || el).remove();
    }
  });
})();


/* --- smaller parts ------------------------------------------------------- */
(function () {
  'use strict';

  // Each part names the elements that make it up. Add an entry here and a line
  // in SITE_PARTS above to make any other piece of the page switchable.
  var PARTS = {
    "about-full-profile": ["#tb-long", "#tp-long"],
    "about-stats":        [".hero__grid .stats"],
    "trust-pullquote":    ["#trust .pullquote"]
  };

  var wanted = (typeof SITE_PARTS !== 'undefined' && SITE_PARTS) || Object.keys(PARTS);
  var off = Object.keys(PARTS).filter(function (id) { return wanted.indexOf(id) === -1; });
  if (!off.length) { return; }

  var selector = off.reduce(function (acc, id) { return acc.concat(PARTS[id]); }, []).join(',');

  var style = document.createElement('style');
  style.textContent = selector + '{display:none!important}';
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(selector).forEach(function (el) { el.remove(); });

    // A row of tabs with only one tab left is just a stray button — drop the
    // whole strip and let the remaining panel stand on its own.
    document.querySelectorAll('.tabs__list').forEach(function (list) {
      var btns = list.querySelectorAll('.tabs__btn');
      if (btns.length < 2) { list.remove(); }
      if (btns.length === 1) { btns[0].setAttribute('aria-selected', 'true'); }
    });

    // Whichever panel survives must be visible, even if it was the hidden one.
    document.querySelectorAll('[data-tabs]').forEach(function (group) {
      var panels = group.querySelectorAll('.tabs__panel');
      if (panels.length === 1) { panels[0].hidden = false; }
    });
  });
})();
