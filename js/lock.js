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

  // ---- Init ----
  async function init() {
    body.classList.add('is-locked');
    const overlay = document.getElementById('lock-overlay');
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
