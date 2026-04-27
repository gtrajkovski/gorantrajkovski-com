"""Replace the <span class="nav__brand-mark">G</span> with an <img>
of the headshot, across all HTML files. Idempotent.
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

REPLACEMENT = (
    '<img class="nav__brand-mark" src="/assets/img/portrait/headshot.jpg" '
    'alt="Goran Trajkovski" />'
)
PATTERN = re.compile(r'<span\s+class="nav__brand-mark">G</span>')

count = 0
for path in TARGETS:
    if not path.exists():
        print(f'  SKIP (missing): {path}')
        continue
    text = path.read_text(encoding='utf-8')
    new_text, n = PATTERN.subn(REPLACEMENT, text)
    if n:
        path.write_text(new_text, encoding='utf-8')
        count += n
        print(f'  OK: {path.relative_to(ROOT)} ({n} replaced)')
    else:
        print(f'  ALREADY DONE / no match: {path.relative_to(ROOT)}')
print(f'\nDone. {count} brand marks swapped to headshot.')
