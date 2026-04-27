"""Swap the nav brand mark — current state to a 'GT' monogram (text span).
Idempotent. Handles either an existing <img class="nav__brand-mark" ...>
or an existing <span class="nav__brand-mark">X</span>.
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent
TARGETS = [
    ROOT / 'index.html',
    ROOT / 'portfolio.html',
    ROOT / 'privacy.html',
    ROOT / 'es' / 'index.html',
    ROOT / 'es' / 'portfolio.html',
    ROOT / 'es' / 'privacy.html',
    ROOT / 'mk' / 'index.html',
    ROOT / 'mk' / 'portfolio.html',
    ROOT / 'mk' / 'privacy.html',
    ROOT / 'portfolio.source.html',
    ROOT / 'es' / 'portfolio.source.html',
    ROOT / 'mk' / 'portfolio.source.html',
]

REPLACEMENT = '<span class="nav__brand-mark">GT</span>'
# Match an <img ... class="nav__brand-mark" ... /> OR an existing <span class="nav__brand-mark">X</span>
PATTERNS = [
    re.compile(r'<img\s+class="nav__brand-mark"[^>]*?/?>'),
    re.compile(r'<span\s+class="nav__brand-mark">[^<]*</span>'),
]

count = 0
for path in TARGETS:
    if not path.exists():
        print(f'  SKIP (missing): {path}')
        continue
    text = path.read_text(encoding='utf-8')
    new_text = text
    n = 0
    for p in PATTERNS:
        new_text, k = p.subn(REPLACEMENT, new_text)
        n += k
    if n:
        path.write_text(new_text, encoding='utf-8')
        count += n
        print(f'  OK: {path.relative_to(ROOT)} ({n} replaced)')
    else:
        print(f'  no match: {path.relative_to(ROOT)}')
print(f'\nDone. {count} brand marks → "GT" monogram.')
