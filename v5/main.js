/* ═══════════════════════════════════════
   APS LAND — main.js
   Nav scroll behavior + mobile toggle
════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── NAV: add scrolled class for background ───
  // On the homepage the nav starts transparent; on interior pages
  // nav-scrolled is already in the HTML (always opaque).
  const nav = document.getElementById('site-nav');
  if (nav && !nav.classList.contains('nav-scrolled')) {
    const onScroll = () => {
      nav.classList.toggle('nav-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ─── MOBILE NAV TOGGLE ───
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && links.classList.contains('nav-open')) {
        links.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

})();
