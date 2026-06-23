/* ═══════════════════════════════════════════
   APS — Allstate Permit Services
   main.js v4
   ══════════════════════════════════════════ */

'use strict';

/* ── Year ──────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Nav: transparent over hero, navy after ── */
const nav = document.getElementById('site-nav');
const hero = document.querySelector('.hero');
let ticking = false;

function updateNav() {
  const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
  if (heroBottom <= nav.offsetHeight) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateNav);
    ticking = true;
  }
}, { passive: true });

updateNav();

/* ── Mobile nav toggle ──────────────────── */
const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });
}

/* ── Scroll fade-up animations ──────────── */
const fadeTargets = document.querySelectorAll(
  '.mission-statement, .btn-mission, .stat-card, ' +
  '.client-logo-item, .service-card, .value-item, ' +
  '.states-list span, .cta-headline, .cta-sub'
);

fadeTargets.forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = (i % 4) * 75 + 'ms';
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

fadeTargets.forEach(el => observer.observe(el));

/* ── APS Reach Map ──────────────────────── */
const apsMap = {

  // ── State data ──────────────────────────
  // Each entry: { name, firstYear, counties, parcels, permits, landowners }
  // Set values to null to keep [placeholder] display until real data is ready.
  activeStates: {
    OR: { name: 'Oregon',        firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    CA: { name: 'California',    firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    NV: { name: 'Nevada',        firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    ID: { name: 'Idaho',         firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    MT: { name: 'Montana',       firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    ND: { name: 'North Dakota',  firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    SD: { name: 'South Dakota',  firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    WY: { name: 'Wyoming',       firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    UT: { name: 'Utah',          firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    CO: { name: 'Colorado',      firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    AZ: { name: 'Arizona',       firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    NM: { name: 'New Mexico',    firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    TX: { name: 'Texas',         firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    OK: { name: 'Oklahoma',      firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    LA: { name: 'Louisiana',     firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    KS: { name: 'Kansas',        firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    MO: { name: 'Missouri',      firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    AR: { name: 'Arkansas',      firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    PA: { name: 'Pennsylvania',  firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    OH: { name: 'Ohio',          firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    WV: { name: 'West Virginia', firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    KY: { name: 'Kentucky',      firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    TN: { name: 'Tennessee',     firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    NE: { name: 'Nebraska',      firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    IL: { name: 'Illinois',      firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    IA: { name: 'Iowa',          firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
    IN: { name: 'Indiana',       firstYear: null, counties: null, parcels: null, permits: null, landowners: null },
  },

  hiddenStates: ['AK', 'HI'],

  // ── Helpers ──────────────────────────────
  fmt(val) {
    return val !== null && val !== undefined ? String(val) : null;
  },

  setStat(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    const display = this.fmt(val);
    if (display) {
      el.textContent = display;
      el.classList.remove('placeholder');
    } else {
      el.textContent = '[—]';
      el.classList.add('placeholder');
    }
  },

  // ── Init ─────────────────────────────────
  init() {
    const mapEl = document.getElementById('aps-map');
    if (!mapEl) return;

    this.hiddenStates.forEach(id => {
      const el = mapEl.querySelector('#' + id);
      if (el) el.classList.add('state--hidden');
    });

    Object.keys(this.activeStates).forEach(id => {
      const el = mapEl.querySelector('#' + id);
      if (!el) return;
      el.classList.add('state--active');
      el.addEventListener('mouseenter', () => this.show(id));
      el.addEventListener('mouseleave', () => this.clear());
      el.setAttribute('focusable', 'false');
      el.setAttribute('aria-hidden', 'true');
    });
  },

  // ── Show state ───────────────────────────
  show(id) {
    const data = this.activeStates[id];
    if (!data) return;

    const mapEl  = document.getElementById('aps-map');
    const stateEl = document.getElementById(id);

    if (mapEl)   mapEl.classList.add('has-hover');
    if (stateEl) stateEl.classList.add('state--hover');

    // Fade out, swap content, fade in
    const panel   = document.getElementById('info-panel');
    const content = document.getElementById('panel-content');

    if (content) content.style.opacity = '0';

    setTimeout(() => {
      document.getElementById('panel-state').textContent = data.name.toUpperCase();
      this.setStat('stat-first-year',  data.firstYear);
      this.setStat('stat-counties',    data.counties);
      this.setStat('stat-parcels',     data.parcels);
      this.setStat('stat-permits',     data.permits);
      this.setStat('stat-landowners',  data.landowners);
      panel.classList.add('has-state');
      if (content) content.style.opacity = '';
    }, 110);
  },

  // ── Clear ────────────────────────────────
  clear() {
    const mapEl = document.getElementById('aps-map');
    if (mapEl) mapEl.classList.remove('has-hover');

    document.querySelectorAll('#aps-map .state--hover')
      .forEach(el => el.classList.remove('state--hover'));

    const panel   = document.getElementById('info-panel');
    const content = document.getElementById('panel-content');

    if (content) content.style.opacity = '0';
    setTimeout(() => {
      document.getElementById('panel-state').textContent = '';
      panel.classList.remove('has-state');
      if (content) content.style.opacity = '';
    }, 110);
  },
};

document.addEventListener('DOMContentLoaded', () => apsMap.init());
