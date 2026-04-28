"""Reorder Selected Roles (TALL CEO first) and add the dot column markup."""
import re
from pathlib import Path

ROOT = Path('C:/TALLwebsite/gorantrajkovski-com')

# 1) For each language, define new role-list HTML in correct order.
# Tracking the existing texts. Use the existing role-body text per file.

def parse_roles(html):
    """Return [{years, title_html, org, note}] in document order."""
    role_re = re.compile(
        r'<li class="track-role">\s*'
        r'<span class="track-role__years">([^<]+)</span>\s*'
        r'<div class="track-role__body">\s*'
        r'<p class="track-role__title">(.*?)</p>\s*'
        r'<p class="track-role__org">([^<]+)</p>\s*'
        r'<p class="track-role__note">([^<]+)</p>\s*'
        r'</div>\s*'
        r'</li>',
        re.DOTALL
    )
    roles = []
    for m in role_re.finditer(html):
        roles.append({
            'years': m.group(1).strip(),
            'title': m.group(2).strip(),
            'org': m.group(3).strip(),
            'note': m.group(4).strip(),
        })
    return roles

def render_role(r):
    return (
        '            <li class="track-role">\n'
        '              <span class="track-role__years">' + r['years'] + '</span>\n'
        '              <span class="track-role__dot" aria-hidden="true"></span>\n'
        '              <div class="track-role__body">\n'
        '                <p class="track-role__title">' + r['title'] + '</p>\n'
        '                <p class="track-role__org">' + r['org'] + '</p>\n'
        '                <p class="track-role__note">' + r['note'] + '</p>\n'
        '              </div>\n'
        '            </li>'
    )

def reorder(roles):
    """Move 'The Art of Living Large' role to position 0; preserve rest order."""
    tall_idx = None
    for i, r in enumerate(roles):
        if 'art of living large' in r['org'].lower():
            tall_idx = i
            break
    if tall_idx is None:
        return roles
    out = [roles[tall_idx]] + [r for i, r in enumerate(roles) if i != tall_idx]
    return out

for fp in [ROOT / 'index.html', ROOT / 'es' / 'index.html', ROOT / 'mk' / 'index.html']:
    t = fp.read_text(encoding='utf-8')
    roles = parse_roles(t)
    if not roles:
        print('NO ROLES PARSED:', fp)
        continue
    new_roles = reorder(roles)
    new_inner = '\n'.join(render_role(r) for r in new_roles)
    # Replace the entire <ol class="track-roles"> ... </ol> contents
    ol_re = re.compile(r'(<ol class="track-roles">)(.*?)(</ol>)', re.DOTALL)
    new_t = ol_re.sub(lambda m: m.group(1) + '\n' + new_inner + '\n          ' + m.group(3), t, count=1)
    if new_t == t:
        print('NO REPLACE:', fp)
    else:
        fp.write_text(new_t, encoding='utf-8', newline='')
        print('updated:', fp.name, '| roles:', len(new_roles), '| TALL first:', new_roles[0]['org'])
