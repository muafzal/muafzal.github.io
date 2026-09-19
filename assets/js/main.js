/* =============================================================
   main.js — Dr. Muhammad Afzal portfolio
   Vanilla JS, no dependencies. Everything degrades gracefully
   without JS: content is in the HTML, links still work.
   ============================================================= */
(function () {
  'use strict';

  /* localStorage is writable by anything running on this origin, so every value
     read back is checked against a fixed whitelist before it is used. Only two
     keys are ever stored, and both hold one of two literal strings. */
  var ALLOWED = { 'af-theme': ['light', 'dark'], 'af-lang': ['en', 'de'] };

  var store = {
    get: function (k) {
      var v;
      try { v = localStorage.getItem(k); } catch (e) { return null; }
      return (ALLOWED[k] && ALLOWED[k].indexOf(v) !== -1) ? v : null;
    },
    set: function (k, v) {
      if (!ALLOWED[k] || ALLOWED[k].indexOf(v) === -1) { return; }
      try { localStorage.setItem(k, v); } catch (e) { /* private browsing */ }
    }
  };

  /* ---------- 1. Language (EN / DE) -------------------------- */
  function applyLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      var next = lang === 'en' ? 'de' : 'en';
      b.textContent = next.toUpperCase();
      b.setAttribute('aria-label', lang === 'en' ? 'Auf Deutsch umschalten' : 'Switch to English');
      b.setAttribute('title', b.getAttribute('aria-label'));
    });
    // keep the browser tab title in sync (values live on <html>)
    var t = document.documentElement.getAttribute('data-title-' + lang);
    if (t) document.title = t;

    // placeholder text cannot hold two languages in one attribute, so it is
    // swapped here from data-ph-en / data-ph-de alongside everything else
    document.querySelectorAll('[data-ph-' + lang + ']').forEach(function (el) {
      el.placeholder = el.getAttribute('data-ph-' + lang);
    });

    // <option> cannot hold markup, so its label is swapped the same way. The
    // value attribute is left alone: enquiries stay in one set of categories
    // whichever language the sender used.
    document.querySelectorAll('option[data-opt-' + lang + ']').forEach(function (el) {
      el.textContent = el.getAttribute('data-opt-' + lang);
    });
  }
  var startLang = store.get('af-lang');
  if (!startLang) {
    startLang = (navigator.language || 'en').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
  }
  applyLang(startLang);
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-lang-btn]');
    if (!btn) return;
    var next = document.documentElement.getAttribute('data-lang') === 'en' ? 'de' : 'en';
    store.set('af-lang', next);
    applyLang(next);
  });

  /* ---------- 2. Theme (light / dark) ------------------------ */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme-btn]').forEach(function (b) {
      b.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      b.setAttribute('title', theme === 'dark' ? 'Light mode' : 'Dark mode');
      b.setAttribute('aria-label', b.getAttribute('title'));
    });
  }
  applyTheme(store.get('af-theme') ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-theme-btn]')) return;
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    store.set('af-theme', next);
    applyTheme(next);
  });

  /* ---------- 3. Mobile navigation --------------------------- */
  var burger = document.querySelector('[data-burger]');
  var navLinks = document.getElementById('nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        navLinks.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 4. Tab panels ---------------------------------- */
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var btns = Array.prototype.slice.call(group.querySelectorAll('.tabs__btn'));
    btns.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) {
          b.setAttribute('aria-selected', 'false');
          b.setAttribute('tabindex', '-1');
          var panel = document.getElementById(b.getAttribute('aria-controls'));
          if (panel) panel.hidden = true;
        });
        btn.setAttribute('aria-selected', 'true');
        btn.setAttribute('tabindex', '0');
        var target = document.getElementById(btn.getAttribute('aria-controls'));
        if (target) target.hidden = false;
      });
      btn.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = btns[(i + d + btns.length) % btns.length];
        n.focus(); n.click();
      });
    });
  });

  /* ---------- 5. Scroll reveal ------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 6. Scroll-spy on nav --------------------------- */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  var sections = spyLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        spyLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 7. Back to top --------------------------------- */
  var toTop = document.querySelector('.totop');
  if (toTop) {
    var onScroll = function () { toTop.classList.toggle('is-shown', window.scrollY > 600); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 8. Current year -------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- 9. Cal.com booking embed ----------------------- *
   * Loads ONLY after the visitor clicks "Load booking calendar".
   * That keeps the page instant AND keeps us GDPR-clean: no third
   * party is contacted until the visitor asks for it.
   * Set data-cal-link on #load-cal to your real cal.com handle.
   * ----------------------------------------------------------- */
  var calBtn = document.getElementById('load-cal');
  if (calBtn) {
    calBtn.addEventListener('click', function () {
      var link = calBtn.getAttribute('data-cal-link');
      var slot = document.getElementById('cal-embed');
      /* Only ever build a cal.com URL out of a plain "handle/event" string.
         This makes it impossible for a mistyped or tampered attribute to turn
         into a javascript: URL or point the iframe at another origin. */
      var SAFE_HANDLE = /^[A-Za-z0-9](?:[A-Za-z0-9._-]{0,38}[A-Za-z0-9])?\/[A-Za-z0-9][A-Za-z0-9._-]{0,48}$/;
      if (!link || link.indexOf('YOUR-') === 0 || !SAFE_HANDLE.test(link)) {
        var warn = document.createElement('p');
        warn.className = 'small';
        warn.style.color = '#c0392b';
        warn.textContent = 'Booking is not configured yet. Set data-cal-link on the button '
          + 'in index.html to your cal.com handle, for example  muhammad-afzal/30min';
        slot.replaceChildren(warn);
        return;
      }
      calBtn.disabled = true;
      calBtn.textContent = '…';
      var theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var f = document.createElement('iframe');
      f.src = 'https://cal.com/' + encodeURI(link) + '?embed=true&theme=' + theme;
      f.title = 'Appointment booking calendar';
      f.loading = 'lazy';
      /* Sandboxed: the embedded calendar may run scripts, submit its own forms
         and open its own pages, but it cannot reach into this page, read this
         origin's storage, or navigate the top-level window away. */
      f.setAttribute('sandbox', 'allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox');
      f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      f.setAttribute('allow', 'payment');
      f.style.cssText = 'width:100%;height:660px;border:1px solid var(--line);border-radius:10px;background:var(--surface)';
      slot.innerHTML = '';
      slot.appendChild(f);
      calBtn.remove();
    });
  }

  /* ---------- 10. Contact form (Web3Forms, free tier) --------- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var key = form.querySelector('input[name="access_key"]');
      var submit = form.querySelector('button[type="submit"]');
      var de = document.documentElement.getAttribute('data-lang') === 'de';

      /* Nothing is sent unless name, email, message and the consent box are
         all filled in. preventDefault() above stops the browser running its own
         check, so it has to be asked for explicitly — otherwise the `required`
         attributes do nothing at all and an empty form goes through. */
      if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
        status.className = 'form-status err';
        status.textContent = de
          ? 'Bitte füllen Sie Name, E-Mail und Nachricht aus und bestätigen Sie die Datenschutzerklärung.'
          : 'Please fill in your name, email and message, and tick the privacy box.';
        return;
      }
      /* Belt and braces. reportValidity may be unavailable, and `minlength`
         is only enforced by the browser once a field has actually been typed
         in — a pasted or scripted value slips past it. These checks do not. */
      var MIN = { name: 2, email: 5, message: 10 };
      var missing = ['name', 'email', 'message'].filter(function (f) {
        var el = form.elements[f];
        return !el || String(el.value).trim().length < MIN[f];
      });
      if (!form.elements.consent.checked) { missing.push('consent'); }
      if (missing.length) {
        status.className = 'form-status err';
        status.textContent = de
          ? 'Bitte füllen Sie Name, E-Mail und Nachricht aus und bestätigen Sie die Datenschutzerklärung.'
          : 'Please fill in your name, email and message, and tick the privacy box.';
        (form.elements[missing[0]] || form).focus();
        return;
      }

      if (!key || key.value.indexOf('YOUR-') === 0) {
        status.className = 'form-status err';
        status.textContent = de
          ? 'Formular noch nicht konfiguriert — bitte den kostenlosen Web3Forms-Schlüssel in index.html eintragen. Nutzen Sie solange die E-Mail-Adresse oben.'
          : 'Form not configured yet — add your free Web3Forms access key in index.html. Please use the email address above in the meantime.';
        return;
      }
      submit.disabled = true;
      status.className = 'form-status';
      status.textContent = de ? 'Wird gesendet …' : 'Sending …';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        // Cap every field so a scripted client cannot push a huge payload through.
        body: JSON.stringify((function () {
          var out = {};
          new FormData(form).forEach(function (v, k) {
            out[k] = (typeof v === 'string') ? v.slice(0, 5000) : v;
          });
          return out;
        })())
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            status.className = 'form-status ok';
            status.textContent = de
              ? 'Vielen Dank — Ihre Nachricht wurde gesendet. Ich melde mich in der Regel innerhalb von zwei Werktagen.'
              : 'Thank you — your message was sent. I normally reply within two working days.';
            form.reset();
          } else { throw new Error(data.message || 'failed'); }
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = de
            ? 'Das Senden ist fehlgeschlagen. Bitte schreiben Sie mir direkt per E-Mail.'
            : 'Sending failed. Please email me directly instead.';
        })
        .then(function () { submit.disabled = false; });
    });
  }
  /* ---------- 11. Testimonial carousel ------------------------ *
   * Slides advance right-to-left on a timer, with arrows either
   * side and dots underneath. Built on native scroll-snap, so
   * touch swiping and keyboard scrolling work for free and the
   * whole thing costs no library.
   * ----------------------------------------------------------- */
  var AUTOPLAY_MS = 6500;      // long enough to read two or three sentences
  var RESUME_MS   = 9000;      // pause after a manual nudge, then carry on

  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.carousel__track');
    var dotsBox = root.querySelector('[data-carousel-dots]');
    var slides = track ? Array.prototype.slice.call(track.children) : [];
    if (!track || slides.length === 0) { return; }

    var timer = null, resumeTimer = null;
    var reduced = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function perView() {
      // Derived from real geometry, so it always matches the CSS breakpoints.
      var w = slides[0].getBoundingClientRect().width;
      return w > 0 ? Math.max(1, Math.round(track.clientWidth / w)) : 1;
    }
    function pages() { return Math.max(1, slides.length - perView() + 1); }
    function step() {
      if (slides.length < 2) { return track.clientWidth; }
      return slides[1].getBoundingClientRect().left -
             slides[0].getBoundingClientRect().left;
    }
    function index() {
      var st = step();
      return st ? Math.round(track.scrollLeft / st) : 0;
    }
    function maxScroll() { return track.scrollWidth - track.clientWidth; }

    function goTo(i, smooth) {
      var st = step();
      track.scrollTo({ left: i * st, behavior: smooth === false ? 'auto' : 'smooth' });
    }
    function next() {
      // At the end, wrap round to the beginning.
      if (track.scrollLeft >= maxScroll() - 4) { goTo(0); } else { goTo(index() + 1); }
    }
    function prev() {
      if (track.scrollLeft <= 4) { goTo(pages() - 1); } else { goTo(index() - 1); }
    }

    /* --- dots --- */
    function buildDots() {
      if (!dotsBox) { return; }
      dotsBox.textContent = '';
      for (var i = 0; i < pages(); i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'carousel__dot';
        b.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        b.dataset.i = String(i);
        dotsBox.appendChild(b);
      }
      syncDots();
    }
    function syncDots() {
      if (!dotsBox) { return; }
      var cur = index();
      Array.prototype.forEach.call(dotsBox.children, function (d, i) {
        d.setAttribute('aria-current', i === cur ? 'true' : 'false');
      });
    }
    if (dotsBox) {
      dotsBox.addEventListener('click', function (e) {
        var d = e.target.closest('.carousel__dot');
        if (!d) { return; }
        goTo(Number(d.dataset.i)); hold();
      });
    }

    /* --- autoplay --- */
    function start() {
      if (reduced || slides.length <= perView()) { return; }
      stop();
      timer = setInterval(next, AUTOPLAY_MS);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function hold() {                       // pause briefly after interaction
      stop();
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(start, RESUME_MS);
    }

    root.querySelector('[data-carousel-prev]').addEventListener('click', function () { prev(); hold(); });
    root.querySelector('[data-carousel-next]').addEventListener('click', function () { next(); hold(); });

    // Reading a quote should never be interrupted.
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    track.addEventListener('touchstart', stop, { passive: true });
    track.addEventListener('touchend', hold, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { start(); }
    });

    var raf = null;
    track.addEventListener('scroll', function () {
      if (raf) { return; }
      raf = requestAnimationFrame(function () { raf = null; syncDots(); });
    }, { passive: true });

    function layout() {
      // With nothing to scroll to, hide the controls entirely.
      root.toggleAttribute('data-static', slides.length <= perView());
      buildDots();
      start();
    }
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layout, 180);
    });
    layout();
  });

  if (document.querySelector('[data-open-wide]')) {
    syncDetails(wide);
    if (wide.addEventListener) { wide.addEventListener('change', syncDetails); }
    else if (wide.addListener) { wide.addListener(syncDetails); }
  }

  /* ---------- 12. Banner motifs ------------------------------ *
   * Six figures in the hero banner explain themselves on hover,
   * focus or tap. Every value they show was computed from the
   * coordinates actually drawn, so the numbers are true of the
   * picture rather than decorative.
   * ----------------------------------------------------------- */
  (function () {
    var layer = document.querySelector('.datalayer');
    var caption = document.querySelector('[data-banner-caption]');
    if (!layer || !caption) { return; }

    var motifs = Array.prototype.slice.call(layer.querySelectorAll('.motif'));
    if (!motifs.length) { return; }

    var idle = caption.innerHTML;          // the "hover or tap" prompt
    var active = null;

    function show(m) {
      var lang = document.documentElement.getAttribute('data-lang') || 'en';
      var text = m.getAttribute('data-cap-' + lang) || m.getAttribute('data-cap-en');
      caption.textContent = text;
    }
    function clear() {
      caption.innerHTML = idle;
    }

    /* focus/blur are not reliably dispatched on SVG elements, so the bubbling
       focusin/focusout are used on the container instead. Without this the
       caption never changed for a keyboard user. */
    layer.addEventListener('focusin', function (e) {
      var m = e.target.closest && e.target.closest('.motif');
      if (m) { show(m); }
    });
    layer.addEventListener('focusout', function () {
      if (!active) { clear(); }
    });

    motifs.forEach(function (m) {
      m.addEventListener('mouseenter', function () { show(m); });

      // Touch and click: latch the motif open, since there is no hover to end.
      m.addEventListener('click', function () {
        if (active === m) { m.classList.remove('is-active'); active = null; clear(); }
        else {
          if (active) { active.classList.remove('is-active'); }
          m.classList.add('is-active'); active = m; show(m);
        }
        layer.classList.toggle('is-touched', !!active);
      });
      // Space and Enter reach a focusable element as a click already; only
      // Escape needs handling, to let a keyboard user step back out.
      m.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && active) {
          active.classList.remove('is-active'); active = null;
          layer.classList.remove('is-touched'); clear(); m.blur();
        }
      });
    });

    layer.addEventListener('mouseleave', function () { if (!active) { clear(); } });

    // Tapping elsewhere closes a latched motif.
    document.addEventListener('click', function (e) {
      if (active && !e.target.closest('.motif')) {
        active.classList.remove('is-active'); active = null;
        layer.classList.remove('is-touched'); clear();
      }
    });
  })();

  /* ---------- 13. Formula dots -------------------------------- *
   * Eight dots in the wedge either side of the field. Hovering
   * names the idea in the caption strip; clicking opens a panel
   * with the formula or figure at a size you can actually read.
   * ----------------------------------------------------------- */
  (function () {
    var panel = document.querySelector('[data-dot-panel]');
    var caption = document.querySelector('[data-banner-caption]');
    var dots = Array.prototype.slice.call(document.querySelectorAll('.dot'));
    if (!panel || !dots.length) { return; }

    var idle = caption ? caption.innerHTML : '';
    var open = null;

    function lang() { return document.documentElement.getAttribute('data-lang') || 'en'; }

    function openPanel(key, dot) {
      panel.querySelectorAll('[data-panel]').forEach(function (v) {
        v.hidden = v.getAttribute('data-panel') !== key;
      });
      panel.hidden = false;
      dots.forEach(function (d) { d.classList.toggle('is-open', d === dot); });
      document.querySelectorAll('[data-dot-proxy]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-dot-proxy') === key ? 'true' : 'false');
      });
      open = dot;
    }
    function closePanel() {
      panel.hidden = true;
      dots.forEach(function (d) { d.classList.remove('is-open'); });
      document.querySelectorAll('[data-dot-proxy]').forEach(function (b) {
        b.setAttribute('aria-pressed', 'false');
      });
      open = null;
      if (caption) { caption.innerHTML = idle; }
    }

    dots.forEach(function (dot) {
      var key = dot.getAttribute('data-dot');
      function name() { return dot.getAttribute('data-dot-' + lang()) || dot.getAttribute('data-dot-en'); }

      dot.addEventListener('mouseenter', function () {
        if (!open && caption) { caption.textContent = name(); }
      });
      dot.addEventListener('mouseleave', function () {
        if (!open && caption) { caption.innerHTML = idle; }
      });
      dot.addEventListener('click', function (e) {
        e.stopPropagation();
        if (open === dot) { closePanel(); } else { openPanel(key, dot); }
      });
      dot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dot.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
      });
    });

    // focusin bubbles where focus does not, on SVG elements
    var layer = document.querySelector('.dots');
    if (layer && caption) {
      layer.addEventListener('focusin', function (e) {
        var d = e.target.closest && e.target.closest('.dot');
        if (d && !open) { caption.textContent = d.getAttribute('data-dot-' + lang()) || d.getAttribute('data-dot-en'); }
      });
    }

    /* The phone chips open the same panels as the dots, so there is one
       behaviour to reason about rather than two. */
    var proxies = Array.prototype.slice.call(document.querySelectorAll('[data-dot-proxy]'));
    proxies.forEach(function (btn) {
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var key = btn.getAttribute('data-dot-proxy');
        if (open && open.getAttribute && open.getAttribute('data-dot-proxy') === key) { closePanel(); }
        else { openPanel(key, btn); }
      });
    });

    panel.querySelector('[data-dot-close]').addEventListener('click', function (e) {
      e.stopPropagation(); closePanel();
    });
    document.addEventListener('click', function (e) {
      if (open && !e.target.closest('.banner__panel') && !e.target.closest('.dot')
          && !e.target.closest('[data-dot-proxy]')) { closePanel(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) { var d = open; closePanel(); d.focus(); }
    });
  })();

})();
