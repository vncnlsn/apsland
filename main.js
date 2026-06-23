/* ═══════════════════════════════════════════
   APS Land — main.js v5
   ══════════════════════════════════════════ */

'use strict';

/* ── Year ──────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Nav: transparent over hero, white after ── */
const nav  = document.getElementById('site-nav');
const hero = document.querySelector('.hero');
let ticking = false;

function updateNav() {
  if (!nav) return;
  // Hero bottom edge relative to viewport
  const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
  // Switch to scrolled state when hero bottom has passed the nav
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

// Run once on load (handles refresh mid-page)
updateNav();

/* ── Mobile nav toggle ──────────────────── */
const toggle   = document.getElementById('nav-toggle');
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
  '.mission-statement, .continuation-text, .continuation-actions, ' +
  '.stat-card, .service-card, ' +
  '.cta-headline, .cta-sub'
);

fadeTargets.forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = (i % 4) * 80 + 'ms';
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
  activeStates: {
    OR: { name: 'Oregon', firstYear: null, counties: null, parcels: null },
    CA: { name: 'California', firstYear: null, counties: null, parcels: null },
    NV: { name: 'Nevada', firstYear: null, counties: null, parcels: null },
    ID: { name: 'Idaho', firstYear: null, counties: null, parcels: null },
    MT: { name: 'Montana', firstYear: null, counties: null, parcels: null },
    ND: { name: 'North Dakota', firstYear: null, counties: null, parcels: null },
    SD: { name: 'South Dakota', firstYear: null, counties: null, parcels: null },
    WY: { name: 'Wyoming', firstYear: null, counties: null, parcels: null },
    UT: { name: 'Utah', firstYear: null, counties: null, parcels: null },
    CO: { name: 'Colorado', firstYear: null, counties: null, parcels: null },
    AZ: { name: 'Arizona', firstYear: null, counties: null, parcels: null },
    NM: { name: 'New Mexico', firstYear: null, counties: null, parcels: null },
    TX: { name: 'Texas', firstYear: null, counties: null, parcels: null },
    OK: { name: 'Oklahoma', firstYear: null, counties: null, parcels: null },
    LA: { name: 'Louisiana', firstYear: null, counties: null, parcels: null },
    KS: { name: 'Kansas', firstYear: null, counties: null, parcels: null },
    MO: { name: 'Missouri', firstYear: null, counties: null, parcels: null },
    AR: { name: 'Arkansas', firstYear: null, counties: null, parcels: null },
    PA: { name: 'Pennsylvania', firstYear: null, counties: null, parcels: null },
    OH: { name: 'Ohio', firstYear: null, counties: null, parcels: null },
    WV: { name: 'West Virginia', firstYear: null, counties: null, parcels: null },
    KY: { name: 'Kentucky', firstYear: null, counties: null, parcels: null },
    TN: { name: 'Tennessee', firstYear: null, counties: null, parcels: null },
    NE: { name: 'Nebraska', firstYear: null, counties: null, parcels: null },
    IL: { name: 'Illinois', firstYear: null, counties: null, parcels: null },
    IA: { name: 'Iowa', firstYear: null, counties: null, parcels: null },
    IN: { name: 'Indiana', firstYear: null, counties: null, parcels: null },
    AK: { name: 'Alaska', firstYear: null, counties: null, parcels: null },
    HI: { name: 'Hawaii', firstYear: null, counties: null, parcels: null },
  },

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

  init() {
    const mapEl = document.getElementById('aps-map');
    if (!mapEl) return;

    Object.keys(this.activeStates).forEach(id => {
      const el = mapEl.querySelector('#' + id);
      if (!el) return;
      el.classList.add('state--base');
      el.setAttribute('aria-hidden', 'true');

      el.addEventListener('pointerenter', () => this.show(id));
      el.addEventListener('pointerleave', () => this.clear());
      el.addEventListener('focus', () => this.show(id));
      el.addEventListener('blur', () => this.clear());
    });
  },

  show(id) {
    const data = this.activeStates[id];
    if (!data) return;

    const mapEl = document.getElementById('aps-map');
    const stateEl = document.getElementById(id);
    const panel = document.getElementById('info-panel');
    const content = document.getElementById('panel-content');

    if (mapEl) mapEl.classList.add('has-hover');
    document.querySelectorAll('#aps-map .state--hover')
      .forEach(el => el.classList.remove('state--hover'));
    if (stateEl) stateEl.classList.add('state--hover');
    if (content) content.style.opacity = '0';

    setTimeout(() => {
      const stateLabel = document.getElementById('panel-state');
      if (stateLabel) stateLabel.textContent = data.name.toUpperCase();
      this.setStat('stat-first-year', data.firstYear);
      this.setStat('stat-counties', data.counties);
      this.setStat('stat-parcels', data.parcels);
      if (panel) panel.classList.add('has-state');
      if (content) content.style.opacity = '';
    }, 90);
  },

  clear() {
    const mapEl = document.getElementById('aps-map');
    if (mapEl) mapEl.classList.remove('has-hover');

    document.querySelectorAll('#aps-map .state--hover')
      .forEach(el => el.classList.remove('state--hover'));

    const panel = document.getElementById('info-panel');
    const content = document.getElementById('panel-content');

    if (content) content.style.opacity = '0';
    setTimeout(() => {
      const stateLabel = document.getElementById('panel-state');
      if (stateLabel) stateLabel.textContent = '';
      if (panel) panel.classList.remove('has-state');
      if (content) content.style.opacity = '';
    }, 90);
  },
};

document.addEventListener('DOMContentLoaded', () => apsMap.init());
