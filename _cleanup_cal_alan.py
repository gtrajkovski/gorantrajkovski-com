"""Remove leftover Cal.com embed scripts and convert remaining
mailto:alan@ → mailto:goran@ across all HTML files.
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent
HTML = list(ROOT.glob('*.html')) + list(ROOT.glob('es/*.html')) + list(ROOT.glob('mk/*.html'))

# Match the Cal.com embed: optional preceding HTML comment + the <script>...</script> block
CAL_BLOCK = re.compile(
    r'\s*(?:<!--\s*Cal\.com[^-]*(?:-[^-]+)*-->\s*)?'
    r'<script[^>]*>\s*\(function \(C, A, L\)[^<]*</script>',
    re.DOTALL
)
ALAN_MAILTO = re.compile(r'mailto:alan@gorantrajkovski\.com')

for path in HTML:
    text = path.read_text(encoding='utf-8')
    new = CAL_BLOCK.sub('', text)
    new, n_alan = ALAN_MAILTO.subn('mailto:goran@gorantrajkovski.com', new)
    n_cal = len(CAL_BLOCK.findall(text))
    if new != text:
        path.write_text(new, encoding='utf-8')
        print(f'  {path.relative_to(ROOT)}: removed {n_cal} Cal embed(s), changed {n_alan} alan->goran')
    else:
        print(f'  {path.relative_to(ROOT)}: nothing to do')
