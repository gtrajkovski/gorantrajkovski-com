"""Encrypt portfolio artifact URLs with PBKDF2 + AES-GCM.

Usage:
  PORTFOLIO_PASSWORD='your phrase' python build_portfolio_lock.py
  # or it will prompt

Reads portfolio.source.html files (gitignored, plain URLs),
writes portfolio.html files (committed, encrypted URLs + injected lockData).

Idempotent: re-running with same password regenerates with a fresh salt
(URLs stay readable to the same password).
"""
import os, re, sys, json, base64, getpass, html as htmllib
from pathlib import Path
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

ROOT = Path(__file__).parent
PAIRS = [
    (ROOT / 'portfolio.source.html', ROOT / 'portfolio.html'),
    (ROOT / 'es' / 'portfolio.source.html', ROOT / 'es' / 'portfolio.html'),
    (ROOT / 'mk' / 'portfolio.source.html', ROOT / 'mk' / 'portfolio.html'),
]
# Homepages that contain a `<a class="cv-download" ...>` button to be locked
# in place. The build script encrypts the href and injects __lockData.
HOMEPAGES = [
    ROOT / 'index.html',
    ROOT / 'es' / 'index.html',
    ROOT / 'mk' / 'index.html',
]
ITERATIONS = 600_000
VERIFY_PLAINTEXT = b'OK-portfolio-2026'

def derive_key(password: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32,
                     salt=salt, iterations=ITERATIONS)
    return kdf.derive(password.encode())

def encrypt(key: bytes, plaintext: bytes) -> str:
    nonce = os.urandom(12)
    ct = AESGCM(key).encrypt(nonce, plaintext, None)
    return base64.b64encode(nonce + ct).decode()

def b64(b: bytes) -> str:
    return base64.b64encode(b).decode()

def process_file(src: Path, dst: Path, key: bytes,
                 salt_b64: str, verify_b64: str) -> int:
    """Encrypt all artifact__link hrefs in src, write to dst. Return count."""
    if not src.exists():
        print(f'  SKIP — source not found: {src}')
        return 0
    text = src.read_text(encoding='utf-8')

    # Find every <a class="artifact__link" ... href="URL" ...>
    # and rewrite href to "#" + add data-cipher
    pattern = re.compile(
        r'(<a\s+class="artifact__link"[^>]*?)href="([^"]+)"([^>]*?>)',
        re.IGNORECASE
    )

    count = 0
    def repl(m):
        nonlocal count
        before, href, after = m.group(1), m.group(2), m.group(3)
        if href == '#' or 'data-cipher' in (before + after):
            return m.group(0)
        if not href.startswith(('http://', 'https://', 'mailto:')):
            return m.group(0)
        cipher = encrypt(key, href.encode())
        count += 1
        return f'{before}href="#" data-cipher="{cipher}"{after}'

    new_text = pattern.sub(repl, text)

    # Inject lockData script before </head>
    lock_script = (
        f'<script>window.__lockData={{'
        f'salt:"{salt_b64}",verify:"{verify_b64}",'
        f'iters:{ITERATIONS},vt:"{b64(VERIFY_PLAINTEXT)}"'
        f'}};</script>'
    )
    if 'window.__lockData' in new_text:
        new_text = re.sub(
            r'<script>window\.__lockData=.*?</script>',
            lock_script, new_text, flags=re.DOTALL
        )
    else:
        new_text = new_text.replace('</head>', f'  {lock_script}\n</head>', 1)

    dst.write_text(new_text, encoding='utf-8')
    return count

def process_homepage(path: Path, key: bytes,
                     salt_b64: str, verify_b64: str) -> int:
    """Encrypt cv-download link on a homepage in place, inject __lockData."""
    if not path.exists():
        print(f'  SKIP — homepage not found: {path}')
        return 0
    text = path.read_text(encoding='utf-8')

    # Match any <a ...> tag and rewrite if it has cv-download class + a real href.
    # Attribute order is not constrained.
    tag_re = re.compile(r'<a\s+([^>]+?)>', re.IGNORECASE)
    href_re = re.compile(r'href="([^"]+)"', re.IGNORECASE)
    cls_re = re.compile(r'class="([^"]*)"', re.IGNORECASE)

    count = 0
    def repl(m):
        nonlocal count
        attrs = m.group(1)
        cls_match = cls_re.search(attrs)
        if not cls_match or 'cv-download' not in cls_match.group(1).split():
            return m.group(0)
        href_match = href_re.search(attrs)
        if not href_match:
            return m.group(0)
        href = href_match.group(1)
        if href == '#' or 'data-cipher' in attrs:
            return m.group(0)
        cipher = encrypt(key, href.encode())
        new_attrs = href_re.sub(f'href="#" data-cipher="{cipher}"', attrs, count=1)
        count += 1
        return f'<a {new_attrs}>'
    new_text = tag_re.sub(repl, text)

    # Inject lockData script before </head> (replace if present)
    lock_script = (
        f'<script>window.__lockData={{'
        f'salt:"{salt_b64}",verify:"{verify_b64}",'
        f'iters:{ITERATIONS},vt:"{b64(VERIFY_PLAINTEXT)}"'
        f'}};</script>'
    )
    if 'window.__lockData' in new_text:
        new_text = re.sub(
            r'<script>window\.__lockData=.*?</script>',
            lock_script, new_text, flags=re.DOTALL
        )
    elif count > 0:
        new_text = new_text.replace('</head>', f'  {lock_script}\n</head>', 1)

    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
    return count

def main():
    password = os.environ.get('PORTFOLIO_PASSWORD')
    if not password:
        password = getpass.getpass('Portfolio passphrase: ')
    if len(password) < 8:
        print('!! Warning: passphrase < 8 chars. Brute-forceable. Use a longer phrase.')

    salt = os.urandom(16)
    key = derive_key(password, salt)
    verify = encrypt(key, VERIFY_PLAINTEXT)
    salt_b64 = b64(salt)

    print(f'\nUsing PBKDF2-SHA256, {ITERATIONS:,} iterations, AES-GCM.')
    print(f'New salt: {salt_b64}')
    print()

    total = 0
    for src, dst in PAIRS:
        n = process_file(src, dst, key, salt_b64, verify)
        rel = dst.relative_to(ROOT)
        print(f'  {rel}: {n} URLs encrypted')
        total += n

    cv_total = 0
    for hp in HOMEPAGES:
        n = process_homepage(hp, key, salt_b64, verify)
        rel = hp.relative_to(ROOT)
        print(f'  {rel}: {n} CV link(s) encrypted')
        cv_total += n

    print(f'\nDone. {total} portfolio URLs + {cv_total} CV links encrypted.')

if __name__ == '__main__':
    main()
