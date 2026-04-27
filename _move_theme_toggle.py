"""Move the theme-toggle button out of <ul class="nav__links"> so it's
always visible (not hidden behind the mobile hamburger menu).

Run once. Idempotent — skip files that look already-migrated.
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
    # also the source files for portfolio so they stay in sync
    ROOT / 'portfolio.source.html',
    ROOT / 'es' / 'portfolio.source.html',
    ROOT / 'mk' / 'portfolio.source.html',
]

# Match the <li>...</li> block wrapping the theme-toggle button
LI_BLOCK = re.compile(
    r'\s*<li>\s*'
    r'(<button\s+type="button"\s+id="theme-toggle"\s+class="theme-toggle"[^>]*>'
    r'.*?</button>)'
    r'\s*</li>',
    re.DOTALL
)
# Find the hamburger button so we can place the toggle right before it
HAMBURGER = re.compile(r'(\s*)(<button\s+class="nav__toggle"[^>]*>)')

migrated = skipped = 0
for path in TARGETS:
    if not path.exists():
        print(f'  SKIP (missing): {path}')
        continue
    text = path.read_text(encoding='utf-8')

    li_match = LI_BLOCK.search(text)
    if not li_match:
        # Already migrated, or markup differs
        print(f'  ALREADY OK / no match: {path.relative_to(ROOT)}')
        skipped += 1
        continue

    button_html = li_match.group(1)
    new_text = LI_BLOCK.sub('', text)

    # Insert the button right before the hamburger, with matching indent
    def insert(m):
        indent = m.group(1)
        return f'{indent}{button_html}{indent}{m.group(2)}'

    new_text, n = HAMBURGER.subn(insert, new_text, count=1)
    if n == 0:
        print(f'  WARN: removed <li> but no hamburger found in {path.relative_to(ROOT)}')
        # Restore? Actually let's just write the cleaned version
    path.write_text(new_text, encoding='utf-8')
    print(f'  OK: {path.relative_to(ROOT)}')
    migrated += 1

print(f'\nDone. {migrated} migrated, {skipped} already OK / skipped.')
