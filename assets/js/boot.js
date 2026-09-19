/* ===========================================================================
   boot.js — runs in <head>, before the first paint.
   ===========================================================================
   Kept as a separate file rather than an inline <script> on purpose: it lets
   the Content-Security-Policy forbid inline JavaScript outright, which is the
   single most effective defence against cross-site scripting.
   =========================================================================== */
(function () {
  'use strict';

  /* ---- 1. Clickjacking guard ------------------------------------------
     The proper fix is a frame-ancestors / X-Frame-Options response header,
     which static GitHub Pages hosting cannot set (see README). This is the
     belt-and-braces fallback: if the page is ever framed by another site,
     break out of the frame. */
  try {
    if (window.top !== window.self) { window.top.location = window.self.location; }
  } catch (e) {
    // Cross-origin parent: we cannot read or navigate it, so hide the content.
    document.documentElement.style.display = 'none';
  }

  /* ---- 2. Theme and language, applied before paint --------------------
     Values read back from localStorage are checked against a fixed list.
     Nothing from storage is ever trusted verbatim. */
  var THEMES = ['light', 'dark'];
  var LANGS  = ['en', 'de'];

  function pick(key, allowed, fallback) {
    var v;
    try { v = localStorage.getItem(key); } catch (e) { v = null; }
    return allowed.indexOf(v) === -1 ? fallback : v;
  }

  var prefersDark = window.matchMedia &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
  var prefersDE   = (navigator.language || 'en').toLowerCase().indexOf('de') === 0;

  var d = document.documentElement;
  d.setAttribute('data-theme', pick('af-theme', THEMES, prefersDark ? 'dark' : 'light'));
  var lang = pick('af-lang', LANGS, prefersDE ? 'de' : 'en');
  d.setAttribute('data-lang', lang);
  d.setAttribute('lang', lang);
})();
