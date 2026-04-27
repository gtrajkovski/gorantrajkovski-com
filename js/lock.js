// Portfolio password gate (soft / client-side only — for casual deterrent, not real security)
(function () {
  const PASSWORD = 'propeler13';
  const KEY = 'gt-portfolio-unlocked-v1';
  const body = document.body;

  function unlock() {
    body.classList.remove('is-locked');
    sessionStorage.setItem(KEY, '1');
    const overlay = document.getElementById('lock-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  function lock() {
    body.classList.add('is-locked');
    const overlay = document.getElementById('lock-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
      const input = document.getElementById('lock-input');
      if (input) setTimeout(() => input.focus(), 80);
    }
  }

  // On load
  if (sessionStorage.getItem(KEY) === '1') {
    unlock();
  } else {
    lock();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('lock-form');
    const input = document.getElementById('lock-input');
    const error = document.getElementById('lock-error');
    if (!form || !input) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const val = (input.value || '').trim().toLowerCase();
      if (val === PASSWORD) {
        unlock();
      } else {
        error.textContent = 'Wrong password — try again.';
        error.classList.add('is-visible');
        input.value = '';
        input.focus();
        // shake animation
        input.style.animation = 'none';
        // eslint-disable-next-line no-unused-expressions
        input.offsetWidth; // reflow
        input.style.animation = 'lockShake .35s var(--t)';
      }
    });
  });
})();
