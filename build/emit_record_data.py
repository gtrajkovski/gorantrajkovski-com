#!/usr/bin/env python3
"""emit_record_data.py — bake the clean record into record/record-data.js.

Reads the two artifacts record.py produces (record_clean.csv + counts.json)
and writes the static window.RECORD blob the /record/ page consumes at load
time. No runtime CSV fetch: the page ships with the data baked in.

Run after record.py:
    python3 build/record.py --verify
    python3 build/emit_record_data.py
"""
import os, csv, re, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

CLEAN  = "data/record_clean.csv"
SOURCE = "data/collection.csv"
COUNTS = "data/counts.json"
OUT    = "record/record-data.js"
NOW_Y  = 2026  # reference year for "~N yr/mo" relative bands

# ── which shelf each category sits on in the field/list/charts ──
GROUP = {
    "Book (authored)": "Books", "Book (trade/self-published)": "Books",
    "Edited volume": "Books",
    "Journal article": "Scholarly", "Conference paper": "Scholarly",
    "Conference paper (AAAI symposium)": "Scholarly", "Book chapter": "Scholarly",
    "Book chapter (Palgrave 2025)": "Scholarly", "Patent/Grant": "Scholarly",
    "Computing Review": "Reviews",
    "LinkedIn newsletter issue": "Writing", "Substack post": "Writing",
    "Medium story (Artie's Journey)": "Writing", "Thought-leadership article": "Writing",
    "Presentation/Keynote": "Talks",
    "Professional service": "Service", "Journal editorship": "Service",
}

# ── one distinct hue per theme (paper-ground palette); unknown -> Other ──
COLORS = {
    "Prompt Engineering & Human-Centered AI": "#C8331E",
    "AI in Education & Assessment": "#0E7C86",
    "Cognitive Science & Interactivism": "#6D48C7",
    "Multi-Agent Systems & Emergence": "#E08A1E",
    "Cognitive & Developmental Robotics": "#D2497E",
    "AI Ethics & Society": "#9B3FB0",
    "Healthcare Data & AI": "#1F9E6E",
    "Fuzzy Systems": "#6D9A20",
    "Workplace & Organizational Dynamics": "#3B6FB0",
    "Diversity in Computing Education": "#C99A16",
    "HCI & Virtual Environments": "#17A2B8",
    "Formal Methods, Automata & Theory": "#4B5AB8",
    "AI Security & Adversarial ML": "#9C3B44",
    "Data Science & Learning Analytics": "#2E8F7F",
    "AI Fiction & Narrative": "#E06A9A",
    "e-Business & Commerce": "#8AA33A",
    "Creative & Trade Writing": "#B9682A",
    "Computational Creativity & Arts": "#B15CC8",
    "Research Administration & Higher-Ed Leadership": "#5A7A9C",
    "Software Reliability & Systems": "#6E7E8C",
    "Scholarly Service & Peer Review": "#8A8574",
    "Other": "#A79E90",
}

# ── talk/keynote geography for the globe (hand-curated) ──
CITIES = [
    {"n": "Towson", "lat": 39.402, "lon": -76.602, "v": 9},
    {"n": "Rochester", "lat": 43.156, "lon": -77.608, "v": 3},
    {"n": "Orlando", "lat": 28.538, "lon": -81.379, "v": 3},
    {"n": "Manchester", "lat": 53.483, "lon": -2.244, "v": 3},
    {"n": "Skopje", "lat": 41.996, "lon": 21.432, "v": 2},
    {"n": "Ann Arbor", "lat": 42.281, "lon": -83.743, "v": 2},
    {"n": "Ohrid", "lat": 41.117, "lon": 20.802, "v": 2},
    {"n": "Prague", "lat": 50.075, "lon": 14.437, "v": 2},
    {"n": "Crema", "lat": 45.363, "lon": 9.685, "v": 2},
    {"n": "Stanford", "lat": 37.427, "lon": -122.17, "v": 2},
    {"n": "London", "lat": 51.507, "lon": -0.128, "v": 2},
    {"n": "Bethlehem", "lat": 40.626, "lon": -75.37, "v": 2},
    {"n": "Copenhagen", "lat": 55.677, "lon": 12.568, "v": 2},
    {"n": "New Orleans", "lat": 29.951, "lon": -90.072, "v": 2},
    {"n": "New Haven", "lat": 41.308, "lon": -72.928, "v": 2},
    {"n": "Springfield", "lat": 37.209, "lon": -93.292, "v": 1},
    {"n": "Princeton", "lat": 40.357, "lon": -74.667, "v": 1},
    {"n": "Brussels", "lat": 50.847, "lon": 4.352, "v": 1},
    {"n": "Novi Sad", "lat": 45.267, "lon": 19.833, "v": 1},
    {"n": "Pula", "lat": 44.868, "lon": 13.849, "v": 1},
    {"n": "Granada", "lat": 37.177, "lon": -3.598, "v": 1},
    {"n": "Mountain View", "lat": 37.386, "lon": -122.084, "v": 1},
    {"n": "Sofia", "lat": 42.698, "lon": 23.322, "v": 1},
    {"n": "Cincinnati", "lat": 39.103, "lon": -84.512, "v": 1},
    {"n": "Montreal", "lat": 45.502, "lon": -73.567, "v": 1},
]

# ── honest data-quality disclosures shown in the colophon ──
GAPS = [
    "83 newsletter issues have no public URL — the catalog stored abbreviated slugs",
    "58 newsletter dates are inferred from relative publish bands, not recorded",
    "25 Substack links are /publish/ editor URLs — author-only",
    "15 Medium links are constructed from post ids and unverified",
    "ALA CHOICE review history is behind a subscriber paywall and not yet captured",
]


def approx_year(yd):
    yd = (yd or "").strip()
    m = re.search(r"(19|20)\d{2}", yd)
    if m:
        return int(m.group(0))
    mo = re.match(r"~\s*(\d+)\s*yr", yd)
    if mo:
        return NOW_Y - int(mo.group(1))
    mo = re.match(r"~\s*(\d+)\s*mo", yd)
    if mo:
        months = int(mo.group(1))
        return NOW_Y if months <= 6 else NOW_Y - 1
    if re.match(r"[A-Z][a-z]{2}\s*\d", yd):
        return 2026
    return None


def clean_title(t):
    t = (t or "").strip()
    t = re.sub(r"\*\*(.+?)\*\*", r"\1", t)
    t = re.sub(r"\*(.+?)\*", r"\1", t)
    t = re.sub(r"^\s*(Doctoral dissertation:|M\.Sc\. thesis:)\s*", "", t)
    return t.strip().strip('"')


def link(r):
    if (r.get("Link_Type") or "").strip() == "admin-only":
        return ""
    for v in (r.get("DOI_or_Link", ""), r.get("Source_URL", "")):
        v = (v or "").strip()
        if v.startswith("http") and "…" not in v and "📋" not in v and "[" not in v:
            return v
        if v.startswith("medium.com") and "…" not in v:
            return "https://" + v
    return ""


def upcoming(r):
    s = (r.get("Status", "") or "").strip().lower()
    return s in ("scheduled", "draft", "forthcoming") or "forthcoming" in s


def tkey(t):
    """Collapse a title to a match key so an authored/trade twin lines up."""
    return re.sub(r"[^a-z0-9]", "", (t or "").lower())[:32]


def recovery_map():
    """title-key -> year, from any dated source row.

    The trade twins we keep (BOOK_TWIN_KEEP='trade') carry Year_Date='—' while
    their dropped authored counterpart carries the real year. Recover it so the
    headline books land on the right year in the temporal field, not undated.
    """
    m = {}
    for r in csv.DictReader(open(SOURCE, encoding="utf-8-sig")):
        y = approx_year(r["Year_Date"])
        if y is None:
            continue
        k = tkey(r["Title_or_Citation"])
        m.setdefault(k, y)
    return m


def build():
    rows = list(csv.DictReader(open(CLEAN, encoding="utf-8-sig")))
    recover = recovery_map()
    items = []
    for r in rows:
        cat = (r["Category"] or "").strip()
        tags = [t.strip() for t in (r["Tags"] or "").split(";") if t.strip()]
        year = approx_year(r["Year_Date"])
        if year is None:
            year = recover.get(tkey(r["Title_or_Citation"]))
        items.append({
            "group": GROUP.get(cat, "Scholarly"),
            "type": cat,
            "title": clean_title(r["Title_or_Citation"]),
            "venue": (r["Venue_Channel"] or "").strip().lstrip("—").strip(),
            "year": year,
            "tags": tags,
            "url": link(r),
            "upcoming": upcoming(r),
        })

    counts = json.load(open(COUNTS))
    counts = {k: counts[k] for k in (
        "scholarly_works", "published_reviews", "self_published",
        "presentations_and_service", "total_records", "published_to_date",
        "scheduled_or_draft", "current_as_of") if k in counts}

    data = {"items": items, "cities": CITIES, "colors": COLORS,
            "counts": counts, "gaps": GAPS}
    os.makedirs("record", exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("window.RECORD=" + json.dumps(data, ensure_ascii=False) + ";\n")

    linked = sum(1 for i in items if i["url"])
    up = sum(1 for i in items if i["upcoming"])
    print(f"wrote {OUT}  —  {len(items)} items  (linked {linked}, upcoming {up})")
    print(f"  total_records in counts: {counts.get('total_records')}  |  items: {len(items)}")
    if counts.get("total_records") != len(items):
        raise SystemExit(f"MISMATCH: counts.total_records={counts.get('total_records')} but {len(items)} items emitted")


if __name__ == "__main__":
    build()
