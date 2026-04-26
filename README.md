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

1. Sign in at https://dash.cloudflare.com/ (free account)
2. **Workers & Pages** → **Create** → **Pages** → **Upload assets**
3. Project name: `gorantrajkovski-com`
4. Drag the entire `gorantrajkovski-com/` folder into the upload box
5. Click **Deploy site** — you'll get a `*.pages.dev` URL in ~30s
6. **Custom domain** tab → add `gorantrajkovski.com` and `www.gorantrajkovski.com`
7. Cloudflare will guide you through nameserver / CNAME setup at GoDaddy

**Optional but better:** Connect a GitHub repo instead of uploading — every `git push` auto-deploys.

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
