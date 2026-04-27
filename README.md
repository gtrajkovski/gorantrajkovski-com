# gorantrajkovski.com

Single-page consulting site + dedicated portfolio page. Vanilla HTML/CSS/JS, zero dependencies, zero build step.

## Files

```
gorantrajkovski-com/
├── index.html              ← home (10 sections, single scroll)
├── portfolio.html          ← full portfolio (8 categories, 30+ artifact links)
├── css/style.css           ← all styling
├── js/main.js              ← nav, mobile menu, scroll-reveal
├── assets/
│   ├── img/portrait/       ← headshot candidates (swap default in About)
│   ├── img/books/          ← 6 book covers
│   └── img/logos/          ← 19 client/partner logos
├── robots.txt
├── sitemap.xml
├── _headers                ← Cloudflare Pages security + cache headers
└── README.md
```

## Local preview

Open `index.html` directly in a browser, or:

```bash
cd C:\TALLwebsite\gorantrajkovski-com
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to Cloudflare Pages (free, recommended)

This repo lives at https://github.com/gtrajkovski/gorantrajkovski-com — connecting it to Cloudflare Pages gives you auto-deploys on every `git push`.

**Git-connected deploy (best):**
1. Sign in at https://dash.cloudflare.com/ (free account)
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Authorize Cloudflare to access your GitHub, pick `gtrajkovski/gorantrajkovski-com`
4. Build settings:
   - Framework preset: **None**
   - Build command: *(leave blank)*
   - Build output directory: `/`
5. **Save and Deploy** — you'll get a `*.pages.dev` URL in ~30s
6. **Custom domain** tab → add `gorantrajkovski.com` and `www.gorantrajkovski.com`
7. Every `git push origin main` after this auto-deploys.

**Manual upload deploy (no Git):**
1. **Workers & Pages** → **Create** → **Pages** → **Upload assets**
2. Drag the entire site folder into the upload box → **Deploy**

## Deploy to Netlify (alternative, also free)

1. Sign in at https://app.netlify.com/ → **Add new site** → **Deploy manually**
2. Drag the `gorantrajkovski-com/` folder onto the deploy area
3. **Domain settings** → add `gorantrajkovski.com` → follow DNS instructions

## Custom domain DNS at GoDaddy

You bought `gorantrajkovski.com` at GoDaddy. To point it at Cloudflare Pages:

**Option A — Move DNS to Cloudflare (recommended, simplest going forward):**
1. In Cloudflare → **Add a site** → enter `gorantrajkovski.com`
2. Cloudflare gives you 2 nameservers
3. At GoDaddy: **My Products** → domain → **DNS** → **Nameservers** → set custom → paste the 2 Cloudflare ones
4. Wait ~10 min, Cloudflare will detect activation and DNS will be auto-managed

**Option B — Keep DNS at GoDaddy (more manual):**
1. Cloudflare Pages → custom domain → it'll give you a CNAME target like `gorantrajkovski-com.pages.dev`
2. At GoDaddy DNS:
   - Add CNAME: name `www`, value `<your-project>.pages.dev`
   - For root `gorantrajkovski.com`, add an A or ALIAS record per Cloudflare's instructions

## Cal.com setup (booking buttons)

The "Book a discovery call" / "Book a call" buttons use Cal.com's free embed.
Right now they point at the placeholder slug `goran-trajkovski/discovery` — you need to claim that and create an event:

1. Sign up free at https://cal.com/signup
2. Pick handle `goran-trajkovski` (or whatever you prefer)
3. Create an event type — name it `discovery` (must match the slug used in code), e.g. 30-minute discovery call
4. If you used a different handle/slug, update both HTML files:
   - Search for `data-cal-link="goran-trajkovski/discovery"` in `index.html` and `portfolio.html`
   - Replace with `data-cal-link="<your-handle>/<your-event-slug>"`
5. Same for `Cal("init", "discovery", ...)` and `Cal.ns.discovery(...)` if you change the event slug

The buttons open an inline modal with the calendar — no redirect, no page reload.

**Alternative:** if you'd rather use Calendly, replace the button markup with `<a href="https://calendly.com/your-link">…</a>` and remove the Cal embed `<script>` blocks at the bottom of both HTML files.

## Portfolio encryption (real protection)

Artifact URLs in `portfolio.html` (and `es/`, `mk/`) are **encrypted with AES-GCM**, with the key derived from a passphrase via PBKDF2-SHA256 (600K iterations). The passphrase is **never** in source — only the visitor enters it on the lock screen.

**Current passphrase:** `forest-glass-leather-1995`

**Files involved:**
- `portfolio.source.html`, `es/portfolio.source.html`, `mk/portfolio.source.html` — *plaintext source* (gitignored, kept locally only)
- `portfolio.html`, `es/portfolio.html`, `mk/portfolio.html` — *committed/deployed*, encrypted hrefs + injected `window.__lockData`
- `build_portfolio_lock.py` — encryption build script
- `js/lock.js` — Web Crypto-based decryption flow

**To add or update an artifact link:**
1. Edit the relevant `portfolio.source.html` (plaintext URLs)
2. Run: `PORTFOLIO_PASSWORD='forest-glass-leather-1995' python build_portfolio_lock.py`
3. The committed `portfolio.html` files get re-encrypted with a fresh salt
4. Commit + push

**To rotate the passphrase:**
1. Choose a new strong passphrase
2. Run: `PORTFOLIO_PASSWORD='your new passphrase' python build_portfolio_lock.py`
3. Commit + push
4. Tell your prospects/clients the new code

**If you lose the `.source.html` files:** restore them from a git commit *before* the encryption was applied (run `git log -- portfolio.html` to find the commit, then `git show <commit>:portfolio.html > portfolio.source.html`). Then re-run the build.

**Lock card includes:** "Don't have an access code? **Request it →**" — opens a prefilled email to `alan@gorantrajkovski.com` so prospects can ask for the code without leaving the page.

## Editing content

- **Hero copy / headline** → `index.html` lines ~38–55
- **Services** → `index.html` Services section
- **Case studies** → `index.html` Selected Work section
- **Books** → `index.html` Books section + add new images to `assets/img/books/`
- **Portfolio artifacts** → `portfolio.html` (one section per category)
- **Colors / fonts** → `css/style.css` `:root` variables (top of file)
- **Contact emails** → search `mailto:` in both HTML files

## Swap headshot

Three candidates already in `assets/img/portrait/`. Default uses `IMG_8842.jpg`. To change:
- Edit `index.html` → search for `assets/img/portrait/IMG_8842.jpg` → swap filename

## Cost

**$0/month.** Cloudflare Pages free tier: unlimited sites, unlimited bandwidth, free SSL, 500 builds/mo. More than enough for a personal consulting site.

Domain is the only ongoing cost (already paid via GoDaddy).
