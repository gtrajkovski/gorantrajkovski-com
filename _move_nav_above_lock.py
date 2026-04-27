"""On portfolio pages, move <nav> out of .portfolio-body so it stays
visible even when the lock overlay is shown. Run once. Idempotent.
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent
SOURCES = [
    ROOT / 'portfolio.source.html',
    ROOT / 'es' / 'portfolio.source.html',
    ROOT / 'mk' / 'portfolio.source.html',
]

NAV_RE = re.compile(r'(\s*<nav class="nav" id="nav">.*?</nav>\s*)', re.DOTALL)
BODY_OPEN_RE = re.compile(r'(<body[^>]*class="portfolio-page is-locked"[^>]*>\s*)')
LOCK_OVERLAY_START = '<div class="lock-overlay"'

count = 0
for path in SOURCES:
    if not path.exists():
        print(f'  SKIP (missing): {path}')
        continue
    text = path.read_text(encoding='utf-8')

    body_pos = text.find('<body class="portfolio-page is-locked">')
    lock_pos = text.find(LOCK_OVERLAY_START)
    nav_match = NAV_RE.search(text)
    if not nav_match or body_pos < 0 or lock_pos < 0:
        print(f'  WARN: pattern mismatch in {path.relative_to(ROOT)}')
        continue
    nav_pos = nav_match.start()

    # Idempotency: if nav already before lock-overlay, skip
    if nav_pos < lock_pos:
        print(f'  ALREADY OK: {path.relative_to(ROOT)}')
        continue

    # Extract nav, remove from current location, insert before lock-overlay
    nav_block = nav_match.group(1)
    text_without_nav = text[:nav_pos] + text[nav_match.end():]
    # Recompute lock position in modified string
    new_lock_pos = text_without_nav.find(LOCK_OVERLAY_START)
    # Find indentation right before the lock-overlay tag
    line_start = text_without_nav.rfind('\n', 0, new_lock_pos) + 1
    indent = text_without_nav[line_start:new_lock_pos]
    # Insert nav right before that line
    new_text = (text_without_nav[:line_start]
                + nav_block.strip() + '\n\n' + indent
                + text_without_nav[new_lock_pos:])
    path.write_text(new_text, encoding='utf-8')
    print(f'  OK: {path.relative_to(ROOT)} (nav moved above lock overlay)')
    count += 1

print(f'\nDone. {count} portfolio source files restructured.')
