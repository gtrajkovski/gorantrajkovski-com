// ===== Year =====
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();

// ===== Sticky nav scroll state =====
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ===== Mobile menu =====
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== Scroll reveal =====
if ('IntersectionObserver' in window) {
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
}

// ===== Smooth-scroll offset for sticky nav (already smooth via CSS) =====
// Handled by CSS scroll-behavior: smooth + scroll-margin-top below if needed
