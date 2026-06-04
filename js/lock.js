// Portfolio password gate — REAL crypto via Web Crypto API.
// Password is never in source. URLs are AES-GCM encrypted with a key
// derived via PBKDF2 from the user's passphrase. See build_portfolio_lock.py.
(function () {
  if (!window.__lockData) return; // not a locked page
  const { salt, verify, iters, vt } = window.__lockData;

  const KEY_CACHE = 'gt-portfolio-key-v2';
  const body = document.body;
  const subtle = window.crypto && window.crypto.subtle;

  if (!subtle) {
    // Older browser — show a message
    console.warn('Web Crypto unavailable; portfolio cannot be unlocked here.');
    return;
  }

  // ---- Helpers ----
  function b64ToBytes(s) {
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function bytesToB64(b) {
    let s = '';
    for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return btoa(s);
  }
  async function deriveKey(password) {
    const enc = new TextEncoder();
    const baseKey = await subtle.importKey(
      'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
    );
    return subtle.deriveKey(
      { name: 'PBKDF2', salt: b64ToBytes(salt),
        iterations: iters, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      true, ['encrypt', 'decrypt']
    );
  }
  async function decryptCipher(key, cipherB64) {
    const buf = b64ToBytes(cipherB64);
    const nonce = buf.slice(0, 12);
    const ct = buf.slice(12);
    const pt = await subtle.decrypt(
      { name: 'AES-GCM', iv: nonce }, key, ct
    );
    return new TextDecoder().decode(pt);
  }
  async function verifyKey(key) {
    try {
      const decoded = await decryptCipher(key, verify);
      const expected = new TextDecoder().decode(b64ToBytes(vt));
      return decoded === expected;
    } catch (_) {
      return false;
    }
  }
  async function exportKeyB64(key) {
    const raw = await subtle.exportKey('raw', key);
    return bytesToB64(new Uint8Array(raw));
  }
  async function importKeyB64(rawB64) {
    return subtle.importKey(
      'raw', b64ToBytes(rawB64),
      { name: 'AES-GCM', length: 256 },
      true, ['decrypt']
    );
  }

  // ---- Unlock the page ----
  async function revealPortfolio(key) {
    const links = document.querySelectorAll('a.artifact__link[data-cipher]');
    for (const a of links) {
      try {
        a.href = await decryptCipher(key, a.dataset.cipher);
        a.removeAttribute('data-cipher');
      } catch (e) {
        console.warn('Could not decrypt link', e);
      }
    }
    body.classList.remove('is-locked');
    const overlay = document.getElementById('lock-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  // ---- Init (full-page lock — only on portfolio pages) ----
  async function init() {
    const overlay = document.getElementById('lock-overlay');
    // Homepages have __lockData for the CV button only — they don't have
    // a #lock-overlay element. Skip the page-level lock there so the page
    // remains scrollable.
    if (!overlay) return;
    body.classList.add('is-locked');
    const form = document.getElementById('lock-form');
    const input = document.getElementById('lock-input');
    const error = document.getElementById('lock-error');

    // Try cached key first
    const cached = sessionStorage.getItem(KEY_CACHE);
    if (cached) {
      try {
        const key = await importKeyB64(cached);
        if (await verifyKey(key)) {
          await revealPortfolio(key);
          return;
        }
      } catch (_) { /* fall through to prompt */ }
      sessionStorage.removeItem(KEY_CACHE);
    }

    // Show overlay
    if (overlay) {
      overlay.style.display = 'flex';
      setTimeout(() => input && input.focus(), 80);
    }

    if (!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const submit = form.querySelector('.lock-card__submit');
      const original = submit ? submit.textContent : '';
      if (submit) { submit.disabled = true; submit.textContent = '…'; }
      error.textContent = ' ';
      error.classList.remove('is-visible');

      const phrase = (input.value || '').trim();
      if (!phrase) {
        if (submit) { submit.disabled = false; submit.textContent = original; }
        return;
      }

      try {
        const key = await deriveKey(phrase);
        if (await verifyKey(key)) {
          sessionStorage.setItem(KEY_CACHE, await exportKeyB64(key));
          await revealPortfolio(key);
        } else {
          error.textContent = 'Wrong access code — try again.';
          error.classList.add('is-visible');
          input.value = '';
          input.focus();
          input.style.animation = 'none';
          // eslint-disable-next-line no-unused-expressions
          input.offsetWidth;
          input.style.animation = 'lockShake .35s var(--t)';
        }
      } catch (err) {
        console.error(err);
        error.textContent = 'Something went wrong. Reload and try again.';
        error.classList.add('is-visible');
      } finally {
        if (submit) { submit.disabled = false; submit.textContent = original; }
      }
    });
  }

  // ---- CV download: lock individual link without locking the whole page ----
  function setupCvDownloads() {
    const links = document.querySelectorAll('a.cv-download[data-cipher]');
    if (!links.length) return;

    let modal = null;
    function buildModal() {
      if (modal) return modal;
      modal = document.createElement('div');
      modal.className = 'cv-lock';
      modal.innerHTML = (
        '<div class="cv-lock__backdrop" data-cv-close></div>' +
        '<div class="cv-lock__card" role="dialog" aria-modal="true" aria-labelledby="cv-lock-title">' +
          '<button type="button" class="cv-lock__x" aria-label="Close" data-cv-close>×</button>' +
          '<p class="cv-lock__eyebrow">Protected · CV</p>' +
          '<h2 class="cv-lock__title" id="cv-lock-title">Enter access code</h2>' +
          '<p class="cv-lock__lede">The same code as the portfolio. Don’t have it? <a href="#contact" data-cv-close>Request access via the contact form.</a></p>' +
          '<form class="cv-lock__form">' +
            '<input type="password" class="cv-lock__input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="passphrase" />' +
            '<button type="submit" class="cv-lock__submit btn btn--primary">Unlock &amp; download</button>' +
          '</form>' +
          '<p class="cv-lock__error" aria-live="polite"></p>' +
        '</div>'
      );
      document.body.appendChild(modal);
      modal.addEventListener('click', e => {
        if (e.target.matches('[data-cv-close]')) closeModal();
      });
      modal.querySelector('.cv-lock__form').addEventListener('submit', onSubmit);
      return modal;
    }
    function openModal() {
      buildModal();
      modal.classList.add('is-open');
      const inp = modal.querySelector('.cv-lock__input');
      setTimeout(() => inp && inp.focus(), 60);
    }
    function closeModal() {
      if (!modal) return;
      modal.classList.remove('is-open');
      const err = modal.querySelector('.cv-lock__error');
      if (err) { err.textContent = ''; err.classList.remove('is-visible'); }
      const inp = modal.querySelector('.cv-lock__input');
      if (inp) inp.value = '';
    }

    let pendingCipher = null;
    async function triggerDownload(key, cipher) {
      const url = await decryptCipher(key, cipher);
      const a = document.createElement('a');
      a.href = url;
      a.download = '';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    async function onSubmit(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const inp = form.querySelector('.cv-lock__input');
      const submit = form.querySelector('.cv-lock__submit');
      const err = modal.querySelector('.cv-lock__error');
      const phrase = (inp.value || '').trim();
      if (!phrase) return;
      const original = submit.textContent;
      submit.disabled = true;
      submit.textContent = '…';
      err.textContent = '';
      err.classList.remove('is-visible');
      try {
        const key = await deriveKey(phrase);
        if (await verifyKey(key)) {
          sessionStorage.setItem(KEY_CACHE, await exportKeyB64(key));
          await triggerDownload(key, pendingCipher);
          closeModal();
        } else {
          err.textContent = 'Wrong access code — try again.';
          err.classList.add('is-visible');
          inp.value = '';
          inp.focus();
        }
      } catch (e2) {
        err.textContent = 'Something went wrong. Reload and try again.';
        err.classList.add('is-visible');
      } finally {
        submit.disabled = false;
        submit.textContent = original;
      }
    }

    links.forEach(a => {
      a.addEventListener('click', async (e) => {
        e.preventDefault();
        pendingCipher = a.dataset.cipher;
        // Try cached key first — silent download
        const cached = sessionStorage.getItem(KEY_CACHE);
        if (cached) {
          try {
            const key = await importKeyB64(cached);
            if (await verifyKey(key)) {
              await triggerDownload(key, pendingCipher);
              return;
            }
          } catch (_) { sessionStorage.removeItem(KEY_CACHE); }
        }
        openModal();
      });
    });

    // Esc to close
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { init(); setupCvDownloads(); });
  } else {
    init();
    setupCvDownloads();
  }
})();
