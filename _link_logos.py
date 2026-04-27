"""Wrap each <img> in the .logos grid with an anchor linking to that client's site.
Idempotent: skips imgs already wrapped in <a>.
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent

LOGO_URLS = {
    'touro.jpg':         'https://www.touro.edu',
    'wgu.jpg':           'https://www.wgu.edu',
    'snhu.jpg':          'https://www.snhu.edu',
    'gcu.jpg':           'https://www.gcu.edu',
    'umgc.jpg':          'https://www.umgc.edu',
    'uma.jpg':           'https://www.ultimatemedical.edu',
    'ucberkley.png':     'https://extension.berkeley.edu',
    'coursera.png':      'https://www.coursera.org',
    'hurix.png':         'https://www.hurix.com',
    'ansrSource.jpg':    'https://www.ansrsource.com',
    'lumina.jpg':        'https://www.luminadatamatics.com',
    'ppg.jpg':           'https://ppg.edu',
    'exc.jpg':           'https://www.excelsior.edu',
    'ivaem.jpg':         'https://www.ivaempr.com',
    'febris.jpg':        'https://febr.is',
    'cem.jpg':           'https://cemcollege.edu',
    'uni.jpg':           'https://universum-ks.org',
}

TARGETS = [
    ROOT / 'index.html',
    ROOT / 'es' / 'index.html',
    ROOT / 'mk' / 'index.html',
]

# Match <img src="/assets/img/logos/FILENAME" alt="ALT" loading="lazy" />
# but only when NOT preceded by an open <a ... > on the same line
IMG = re.compile(
    r'(<img\s+src="/assets/img/logos/([^"]+)"\s+alt="([^"]+)"\s+loading="lazy"\s*/?>)'
)

def wrap_in_file(path: Path) -> int:
    text = path.read_text(encoding='utf-8')
    count = 0

    # Walk line by line so we can detect already-wrapped <a><img></a>
    out_lines = []
    for line in text.splitlines(keepends=True):
        m = IMG.search(line)
        if not m:
            out_lines.append(line)
            continue
        # Skip if this line already starts an anchor
        if '<a ' in line and '</a>' in line:
            out_lines.append(line)
            continue
        full_img, fname, alt = m.group(1), m.group(2), m.group(3)
        url = LOGO_URLS.get(fname)
        if not url:
            out_lines.append(line)
            continue
        wrapped = (f'<a href="{url}" target="_blank" rel="noopener" '
                   f'aria-label="{alt}">{full_img}</a>')
        line = line.replace(full_img, wrapped)
        count += 1
        out_lines.append(line)

    path.write_text(''.join(out_lines), encoding='utf-8')
    return count

total = 0
for path in TARGETS:
    if not path.exists():
        print(f'  SKIP (missing): {path}')
        continue
    n = wrap_in_file(path)
    print(f'  {path.relative_to(ROOT)}: wrapped {n} logos')
    total += n
print(f'\nDone. {total} <img>s wrapped in <a> across {len(TARGETS)} files.')
