// ===== Year =====
(function () {
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();

// ===== Inquiry: pre-fill from ?product= URL param (Labs cards) =====
(function () {
  function init() {
    const params = new URLSearchParams(window.location.search);
    const product = params.get('product');
    if (!product) return;

    const form = document.getElementById('inquiry-form');
    if (!form) return;

    const ctx = document.getElementById('inquiry-context');
    const ctxProduct = document.getElementById('inquiry-context-product');
    const ctxClear = document.getElementById('inquiry-context-clear');
    const subject = form.querySelector('input[name="_subject"]');
    const message = form.querySelector('textarea[name="message"]');
    const service = form.querySelector('select[name="service"]');

    // Show the badge
    if (ctx && ctxProduct) {
      ctxProduct.textContent = product;
      ctx.classList.add('is-visible');
    }
    if (ctxClear) {
      ctxClear.addEventListener('click', () => {
        ctx.classList.remove('is-visible');
        if (subject) subject.value = 'New inquiry from gorantrajkovski.com';
        if (message && message.value.startsWith('Product inquiry: ' + product)) {
          message.value = '';
        }
        // Strip ?product from URL without reload
        const u = new URL(window.location.href);
        u.searchParams.delete('product');
        history.replaceState({}, '', u.pathname + u.hash);
      });
    }

    // Update subject for this inquiry
    if (subject) subject.value = 'Product inquiry: ' + product;

    // Prefill message with product header (only if textarea is empty)
    if (message && !message.value) {
      message.value = 'Product inquiry: ' + product + '\n\n';
      // place caret at end
      message.focus();
      const len = message.value.length;
      message.setSelectionRange(len, len);
    }

    // Try to match the product to a real service option first,
    // then fall back to "Other" so backend categorization is sane.
    if (service) {
      const productLower = product.toLowerCase();
      let matched = false;
      for (const opt of service.options) {
        const optText = (opt.value || opt.textContent || '').toLowerCase();
        if (optText && productLower.includes(optText.split(' (')[0])) {
          service.value = opt.value || opt.textContent;
          matched = true;
          break;
        }
      }
      if (!matched) {
        for (const opt of service.options) {
          if (opt.value === 'Other' || opt.textContent.trim() === 'Other') {
            service.value = opt.value;
            break;
          }
        }
      }
    }

    // Smooth scroll to contact if not already there
    if (!window.location.hash || window.location.hash === '#contact') {
      const contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ===== Logo marquee — duplicate track for seamless loop =====
(function () {
  function cloneTracks() {
    document.querySelectorAll('[data-marquee] .marquee__track').forEach(track => {
      if (track.dataset.cloned) return;
      const clone = track.innerHTML;
      track.insertAdjacentHTML('beforeend', clone);
      // Mark cloned children as decorative so screen readers don't double-read.
      const total = track.children.length;
      for (let i = total / 2; i < total; i++) {
        track.children[i].setAttribute('aria-hidden', 'true');
        track.children[i].setAttribute('tabindex', '-1');
      }
      track.dataset.cloned = '1';
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cloneTracks);
  } else {
    cloneTracks();
  }
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

// ===== Inquiry form (FormSubmit AJAX) =====
(function () {
  const init = () => {
    const form = document.getElementById('inquiry-form');
    if (!form || form.dataset.bound) return;
    form.dataset.bound = '1';
    const status = document.getElementById('inquiry-status');
    const submitBtn = form.querySelector('.inquiry-form__submit');
    const T = (k) => ({
      en: { sending: 'Sending…', ok: 'Thanks — message received. I\'ll be in touch within a couple of business days.', err: 'Something went wrong. Please email goran@gorantrajkovski.com directly.' },
      es: { sending: 'Enviando…', ok: 'Gracias — mensaje recibido. Te contactaré en un par de días laborables.', err: 'Algo salió mal. Por favor, escríbeme directamente a goran@gorantrajkovski.com.' },
      mk: { sending: 'Се испраќа…', ok: 'Благодарам — пораката е примена. Ќе ве контактирам во рок од неколку работни дена.', err: 'Нешто не успеа. Ве молам, пишете директно на goran@gorantrajkovski.com.' },
    })[document.documentElement.lang] ? ({
      en: { sending: 'Sending…', ok: 'Thanks — message received. I\'ll be in touch within a couple of business days.', err: 'Something went wrong. Please email goran@gorantrajkovski.com directly.' },
      es: { sending: 'Enviando…', ok: 'Gracias — mensaje recibido. Te contactaré en un par de días laborables.', err: 'Algo salió mal. Por favor, escríbeme directamente a goran@gorantrajkovski.com.' },
      mk: { sending: 'Се испраќа…', ok: 'Благодарам — пораката е примена. Ќе ве контактирам во рок од неколку работни дена.', err: 'Нешто не успеа. Ве молам, пишете директно на goran@gorantrajkovski.com.' },
    })[document.documentElement.lang][k] : ({
      sending: 'Sending…', ok: 'Thanks — message received.', err: 'Something went wrong.'
    })[k];

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Honeypot: if filled, silently "succeed" without sending
      if (form.querySelector('.inquiry-form__honey')?.value) {
        status.textContent = T('ok');
        status.className = 'inquiry-form__status is-success';
        form.reset();
        return;
      }
      status.textContent = T('sending');
      status.className = 'inquiry-form__status';
      submitBtn.disabled = true;
      try {
        const data = new FormData(form);
        const r = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });
        if (r.ok) {
          status.textContent = T('ok');
          status.className = 'inquiry-form__status is-success';
          form.reset();
        } else {
          throw new Error('non-ok');
        }
      } catch (_) {
        status.textContent = T('err');
        status.className = 'inquiry-form__status is-error';
      } finally {
        submitBtn.disabled = false;
      }
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
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

// ===== CTA one-time halo pulse =====
(function () {
  const pulses = document.querySelectorAll('.btn--pulse');
  if (!pulses.length) return;
  if (!('IntersectionObserver' in window)) {
    pulses.forEach(el => el.classList.add('is-pulsing'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        // Slight stagger so multiple visible CTAs don't fire in lock-step
        setTimeout(() => e.target.classList.add('is-pulsing'), 300);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  pulses.forEach(el => io.observe(el));
})();

// ===== Scroll progress bar =====
(function () {
  const wrap = document.createElement('div');
  wrap.className = 'scroll-progress';
  wrap.setAttribute('aria-hidden', 'true');
  const bar = document.createElement('div');
  bar.className = 'scroll-progress__bar';
  wrap.appendChild(bar);

  let ticking = false;
  function update() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const ratio = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    bar.style.transform = 'scaleX(' + ratio + ')';
    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }
  function mount() {
    if (!document.body) return;
    document.body.appendChild(wrap);
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
})();
