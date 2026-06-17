// ===== Scroll progress bar (self-contained) =====
// Drop-in for pages that don't load the shared main.js / style.css
// (hosted-cognition outline, maps). Injects its own styles, reads the
// page's --accent when present, falls back to the brand red otherwise.
(function () {
  if (document.querySelector('.scroll-progress')) return; // avoid double-insert

  var style = document.createElement('style');
  style.textContent =
    '.scroll-progress{position:fixed;top:0;left:0;right:0;height:5px;z-index:999999;' +
    'background:transparent;pointer-events:none}' +
    '.scroll-progress__bar{height:100%;transform:scaleX(0);transform-origin:left center;' +
    'background:var(--accent,#C8331E);will-change:transform}';
  (document.head || document.documentElement).appendChild(style);

  var wrap = document.createElement('div');
  wrap.className = 'scroll-progress';
  wrap.setAttribute('aria-hidden', 'true');
  var bar = document.createElement('div');
  bar.className = 'scroll-progress__bar';
  wrap.appendChild(bar);

  var ticking = false;
  function update() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var ratio = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    bar.style.transform = 'scaleX(' + ratio + ')';
    ticking = false;
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
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
