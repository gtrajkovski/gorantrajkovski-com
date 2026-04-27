// ===== Year =====
(function () {
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();

// ===== Theme (light / dark) =====
(function () {
  const root = document.documentElement;
  const KEY = 'gt-theme';
  const stored = localStorage.getItem(KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  function attachToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle || toggle.dataset.bound) return;
    toggle.dataset.bound = '1';
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (_) { /* private mode */ }
    });
  }

  // Cover all timing cases: handler may need to bind whether DOM is still
  // loading or already complete by the time this script runs.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachToggle);
  } else {
    attachToggle();
  }
  // Belt + suspenders: also try on window load
  window.addEventListener('load', attachToggle);

  // Follow OS changes (only if user hasn't set a preference)
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(KEY)) {
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  }
})();

// ===== Sticky nav scroll state =====
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ===== Mobile menu =====
(function () {
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  if (!navToggle || !navLinks) return;
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ===== Language switcher: preserve URL hash so #section anchors carry over =====
(function () {
  const update = () => {
    const hash = location.hash || '';
    document.querySelectorAll('.lang-switch a').forEach(a => {
      try {
        const u = new URL(a.href);
        u.hash = hash;
        a.href = u.toString();
      } catch (_) { /* skip malformed */ }
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else {
    update();
  }
  window.addEventListener('hashchange', update);
})();

// ===== Scroll reveal =====
(function () {
  if (!('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll(
    '.section__head, .service, .case, .step, .book, .speaking li, .contact-card, .portfolio-card, .artifact'
  );
  targets.forEach(el => el.classList.add('fade-up'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => io.observe(el));
})();
