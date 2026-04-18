/* ============================================================
   Meridian — Runtime JS
   Héberger sur GitHub Pages ou jsDelivr.
   Référencer dans chaque rapport généré :
     <script src="https://[host]/meridian.js" defer></script>
   ============================================================ */
(function () {
  'use strict';

  var html = document.documentElement;

  /* ── THÈME clair / sombre ─────────────────────────────── */
  var tb = document.getElementById('theme-btn');
  if (tb) {
    if (localStorage.getItem('meridian-theme') === 'dark') {
      html.setAttribute('data-theme', 'dark');
      tb.textContent = '○';
      tb.setAttribute('aria-label', tb.dataset.labelLight || 'Switch to light theme');
    }
    tb.addEventListener('click', function () {
      var dark = html.getAttribute('data-theme') === 'dark';
      if (dark) {
        html.removeAttribute('data-theme');
        tb.textContent = '◐';
        tb.setAttribute('aria-label', tb.dataset.labelDark || 'Switch to dark theme');
        localStorage.setItem('meridian-theme', 'light');
      } else {
        html.setAttribute('data-theme', 'dark');
        tb.textContent = '○';
        tb.setAttribute('aria-label', tb.dataset.labelLight || 'Switch to light theme');
        localStorage.setItem('meridian-theme', 'dark');
      }
    });
  }

  /* ── BARRE DE PROGRESSION ─────────────────────────────── */
  var fill = document.getElementById('progress-fill');
  if (fill) {
    document.addEventListener('scroll', function () {
      var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      fill.style.width = Math.min(pct * 100, 100) + '%';
    }, { passive: true });
  }

  /* ── MODE FOCUS ───────────────────────────────────────── */
  var fb = document.getElementById('focus-btn');
  if (fb) {
    fb.addEventListener('click', function () {
      var on = document.body.classList.toggle('focus-mode');
      fb.textContent = on
        ? (fb.dataset.labelExit || 'Exit focus')
        : (fb.dataset.label    || 'Focus');
      fb.setAttribute('aria-label', on
        ? (fb.dataset.ariaExit || 'Exit focus mode')
        : (fb.dataset.aria     || 'Enable focus mode'));
      fb.classList.toggle('active', on);
    });
  }

  /* ── MODE SYNTHÈSE ────────────────────────────────────── */
  var sb = document.getElementById('synth-btn');
  if (sb) {
    sb.addEventListener('click', function () {
      var on = document.body.classList.toggle('synth-mode');
      sb.textContent = on
        ? (sb.dataset.labelFull  || 'Full view')
        : (sb.dataset.label      || 'Summary');
      sb.setAttribute('aria-label', on
        ? (sb.dataset.ariaFull   || 'Switch to full view')
        : (sb.dataset.aria       || 'Switch to summary view'));
      sb.classList.toggle('active', on);
    });

    /* Flag data-synth="true" sur <html> → active au chargement */
    if (html.dataset.synth === 'true') {
      document.body.classList.add('synth-mode');
      sb.textContent = sb.dataset.labelFull || 'Full view';
      sb.classList.add('active');
    }
  }

  /* ── SCROLL SPY ───────────────────────────────────────── */
  var sections = document.querySelectorAll('main section[id]');
  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var link = document.querySelector('nav a[href="#' + e.target.id + '"]');
        if (link) link.classList.toggle('active', e.isIntersecting);
      });
    }, { rootMargin: '-20% 0px -65% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ── DRAWER MOBILE ────────────────────────────────────── */
  var nt = document.getElementById('nav-toggle');
  var nv = document.querySelector('nav.left-nav');
  var no = document.getElementById('nav-overlay');

  if (nt && nv && no) {
    function openNav() {
      nv.classList.add('open');
      no.classList.add('visible');
      nt.setAttribute('aria-expanded', 'true');
    }
    function closeNav() {
      nv.classList.remove('open');
      no.classList.remove('visible');
      nt.setAttribute('aria-expanded', 'false');
    }
    nt.addEventListener('click', function () {
      nv.classList.contains('open') ? closeNav() : openNav();
    });
    no.addEventListener('click', closeNav);
    document.querySelectorAll('nav.left-nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth < 768) closeNav();
      });
    });
  }

  /* ── COPY BUTTON ──────────────────────────────────────── */
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.closest('.code-wrap');
      if (!code) return;
      var text = code.querySelector('code') ? code.querySelector('code').innerText : '';
      var labelCopied = btn.dataset.labelCopied || 'Copied ✓';
      var labelCopy   = btn.dataset.label       || 'Copy';
      navigator.clipboard.writeText(text)
        .then(function () {
          btn.textContent = labelCopied;
          setTimeout(function () { btn.textContent = labelCopy; }, 2000);
        })
        .catch(function () {
          btn.textContent = '✗';
          setTimeout(function () { btn.textContent = labelCopy; }, 2000);
        });
    });
  });

  /* ── MERMAID ──────────────────────────────────────────── */
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      fontFamily: 'Inter, Helvetica Neue, Arial'
    });
  }
  /* Fallback si Mermaid CDN échoue */
  window.addEventListener('error', function (e) {
    if (e.filename && e.filename.includes('mermaid')) {
      var w = document.querySelector('.mermaid-wrap');
      if (w) w.remove();
    }
  }, true);

})();
