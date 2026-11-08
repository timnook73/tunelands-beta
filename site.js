/* Gemeinsames Skript der Unterseiten (und das Menü der Startseite): Menü, Sprache, Links aus config.js, Einblenden. */
(function () {
  'use strict';
  var cfg = window.__KK_CFG__ || {};
  var sub = document.body.classList.contains('sub');
  var $ = function (id) { return document.getElementById(id); };
  var LANG = 'de';
  try { LANG = localStorage.getItem('kk-lang') || (/^de/i.test(navigator.language || '') ? 'de' : 'en'); } catch (e) { LANG = /^de/i.test(navigator.language || '') ? 'de' : 'en'; }
  var pick = function (v) { return (v && typeof v === 'object') ? (v[LANG] || v.de || v.en || '') : (v || ''); };

  /* Menü (Handy) */
  var menu = $('menu'), nav = $('nav');
  function setMenu(open) { if (!menu || !nav) return; nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  if (menu && nav) {
    menu.addEventListener('click', function (e) { e.stopPropagation(); setMenu(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('click', function (e) { if (!e.target.closest('#nav')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  if (!sub) return;   // Startseite: Sprache, Fußzeile usw. macht app.js

  /* Sprache */
  function links() {
    var fb = pick(cfg.feedback), don = pick(cfg.donate);
    [['foot-fb', fb], ['foot-donate', don], ['about-fb', fb]].forEach(function (p) { var el = $(p[0]); if (el && p[1]) { el.href = p[1]; el.classList.remove('hidden'); } });
    Array.prototype.forEach.call(document.querySelectorAll('[data-fb]'), function (el) { if (fb) el.href = fb; else el.classList.add('hidden'); });
    Array.prototype.forEach.call(document.querySelectorAll('.kofi-only'), function (el) { el.classList.toggle('hidden', !don); });
    var s = $('aboutsocial');
    if (s && cfg.social) {
      s.textContent = '';
      [['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['youtube', 'YouTube']].forEach(function (k) { if (!cfg.social[k[0]]) return; var a = document.createElement('a'); a.href = cfg.social[k[0]]; a.target = '_blank'; a.rel = 'noopener'; a.textContent = k[1]; s.appendChild(a); });
    }
    if (cfg.social) ['instagram', 'tiktok', 'youtube'].forEach(function (n) { var a = document.querySelector('.f-soc .fsoc-' + n); if (!a) return; if (cfg.social[n]) a.href = cfg.social[n]; else a.classList.add('hidden'); });
    if (cfg.beta && $('betachip')) $('betachip').hidden = false;
  }
  function apply() {
    document.documentElement.lang = LANG;
    var b = document.body, t = b.getAttribute('data-title-' + LANG), d = b.getAttribute('data-desc-' + LANG), m = document.querySelector('meta[name=description]');
    if (t) document.title = t;
    if (m && d) m.setAttribute('content', d);
    links();
  }
  var lb = $('lang');
  if (lb) lb.addEventListener('click', function () { LANG = LANG === 'de' ? 'en' : 'de'; try { localStorage.setItem('kk-lang', LANG); } catch (e) { } apply(); });
  apply();

  /* Einblenden beim Scrollen (nicht bei „weniger Bewegung“) */
  try {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .08, rootMargin: '0px 0px -4% 0px' });
      Array.prototype.forEach.call(document.querySelectorAll('.pcard, .skel, .bigsteps li, .phero .pin'), function (el, i) { el.classList.add('rv'); el.style.setProperty('--d', Math.min(i % 4, 4)); io.observe(el); });
    }
  } catch (e) { }

  /* Programmdateien für Offline-Start zwischenspeichern */
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(function () { });
})();
