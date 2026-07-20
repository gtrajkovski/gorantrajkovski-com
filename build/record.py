#!/usr/bin/env python3
"""record.py — the single source of truth for what counts as a work.

Every consumer (charts, field, 3D objects, CV export) imports from here.
No consumer computes its own total. Two open editorial decisions are exposed
as switches at the top; flipping one changes the number everywhere at once.

Emits:
  record_clean.csv  — deduped rows, with Tier column
  counts.json       — the locked denominators + build stamp
"""
import os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

import csv, json, re, sys, datetime
from collections import Counter

SOURCE = "data/collection.csv"
MED = "Medium story (Artie's Journey)"

# ─────────────────────────────────────────────────────────────
# EDITORIAL DECISIONS — the only two judgement calls in the pipeline
# ─────────────────────────────────────────────────────────────
LIVING_LARGE = "series"   # CONFIRMED by the author, 2026-07: The Art of Living Large is
                          # one four-volume series = 1 work-unit, not 4 separate works.
                          # "volumes" would count each volume (+3).

BOOK_TWIN_KEEP = "trade"  # does not affect any count (one row survives either way);
                          # labelling choice only. Which row survives the 6 duplicates:
                          # "trade"    -> keep §1b row (carries series + ISBN context)
                          # "authored" -> keep §1 row  (books sit with the scholarly books)

# ─────────────────────────────────────────────────────────────
# TIERS — what kind of thing each category is
# ─────────────────────────────────────────────────────────────
TIER = {
 "Book (authored)":"A","Edited volume":"A","Book (trade/self-published)":"A",
 "Journal article":"A","Conference paper":"A","Conference paper (AAAI symposium)":"A",
 "Book chapter":"A","Book chapter (Apress 2026)":"A","Book chapter (2007 monograph)":"A",
 "Patent/Grant":"A","Journal editorship":"A",
 "Computing Review":"B",
 "LinkedIn newsletter issue":"C","Substack post":"C",MED:"C","Thought-leadership article":"C",
 "Presentation/Keynote":"D","Professional service":"D",
 "Book chapter (Palgrave 2025)":"X",      # component of a counted container
 "Digital serial (series summary)":"X",   # summary of itemised rows
}
TIER_LABEL = {
 "A":"Peer-reviewed & published scholarly works",
 "B":"Published reviews (ACM Computing Reviews)",
 "C":"Self-published & trade writing",
 "D":"Presentations & professional service (not works)",
 "X":"Structural rows — never counted",
}

# The six titles entered twice, once as authored and once as trade.
TWINS = ["Hosted Cognition","Assessment Under Adversarial Pressure","Nurturing Bloom's Garden",
         "AI Unleashed","A More Beautiful Prompt: The Art of Human-Centered Prompt",
         "Recommended Action"]

def load():
    return list(csv.DictReader(open(SOURCE, encoding="utf-8-sig")))

def dedup(rows):
    """Return (kept, dropped) applying the four documented collision classes."""
    for i, r in enumerate(rows): r["_i"] = i
    drop, why = set(), {}

    # 1. exact authored/trade twins
    for t in TWINS:
        hits = [r for r in rows if t.lower() in r["Title_or_Citation"].lower()
                and r["Category"] in ("Book (authored)","Book (trade/self-published)")]
        auth  = [r for r in hits if r["Category"]=="Book (authored)"]
        trade = [r for r in hits if r["Category"]=="Book (trade/self-published)"]
        if auth and trade:
            loser = auth[0] if BOOK_TWIN_KEEP=="trade" else trade[0]
            drop.add(loser["_i"]); why[loser["_i"]] = "twin: authored/trade duplicate"

    # 2 & 3. structural rows: series summaries + components of counted containers
    for r in rows:
        if TIER.get(r["Category"]) == "X":
            drop.add(r["_i"]); why[r["_i"]] = "structural: " + r["Category"]

    # 3b. rows flagged as NOT authored by Trajkovski are never works
    for r in rows:
        n = (r.get("Notes","") or "").lower()
        if r["_i"] in drop: continue
        if "not trajkovski-authored" in n or "remove from authored list" in n:
            drop.add(r["_i"]); why[r["_i"]] = "misattributed: not Trajkovski-authored"

    # 4. Art of Living Large — series row vs single-volume row
    lg = [r for r in rows if "Living Large" in r["Title_or_Citation"]]
    series = [r for r in lg if "four-volume" in r["Title_or_Citation"]]
    vols   = [r for r in lg if r not in series]
    if LIVING_LARGE == "series":
        for r in vols:  drop.add(r["_i"]); why[r["_i"]] = "component of the Living Large series"
    else:
        for r in series: drop.add(r["_i"]); why[r["_i"]] = "container of individually-counted volumes"

    kept = [r for r in rows if r["_i"] not in drop]
    return kept, [(rows[i], why[i]) for i in sorted(drop)]

def tally(kept):
    t = Counter(TIER.get(r["Category"], "?") for r in kept)
    pub = sum(1 for r in kept if TIER.get(r["Category"]) in "ABC"
              and r["Status"] not in ("scheduled","draft","forthcoming"))
    sch = sum(1 for r in kept if TIER.get(r["Category"]) in "ABC"
              and r["Status"] in ("scheduled","draft","forthcoming"))
    extra = 3 if LIVING_LARGE == "volumes" else 0   # 4 volumes replace 1 series row
    return {
        "scholarly_works": t["A"] + extra,
        "published_reviews": t["B"],
        "self_published": t["C"],
        "presentations_and_service": t["D"],
        "total_records": len(kept) + extra,
        "published_to_date": pub + extra,
        "scheduled_or_draft": sch,
        "decisions": {"living_large": LIVING_LARGE, "book_twin_keep": BOOK_TWIN_KEEP},
    }

def stamp():
    d = datetime.date.today()
    return d.strftime("%B %Y"), d.isoformat()

def build(write=True, verbose=True):
    rows = load()
    kept, dropped = dedup(rows)
    counts = tally(kept)
    label, iso = stamp()
    counts["current_as_of"] = label
    counts["built"] = iso

    if verbose:
        print(f"source rows {len(rows)}  ->  kept {len(kept)}   (dropped {len(dropped)})")
        print(f"decisions: living_large={LIVING_LARGE}  book_twin_keep={BOOK_TWIN_KEEP}\n")
        for k in ["scholarly_works","published_reviews","self_published",
                  "presentations_and_service","total_records","published_to_date","scheduled_or_draft"]:
            print(f"  {counts[k]:5}  {k}")
        print()
        by = Counter(why for _, why in dropped)
        for w, n in by.most_common(): print(f"  dropped {n:3}  {w}")

    if write:
        cols = list(kept[0].keys()); cols = [c for c in cols if c != "_i"] + ["Tier"]
        with open("data/record_clean.csv","w",newline="",encoding="utf-8-sig") as f:
            w = csv.DictWriter(f, fieldnames=cols)
            w.writeheader()
            for r in kept:
                r2 = {k:v for k,v in r.items() if k != "_i"}
                r2["Tier"] = TIER.get(r["Category"],"?")
                w.writerow(r2)
        json.dump(counts, open("data/counts.json","w"), indent=2)
    return counts, kept, dropped

# ── count lock ───────────────────────────────────────────────
def verify(lockfile="data/counts.lock.json"):
    """Fail the build if the denominators moved without a deliberate lock update."""
    counts, _, _ = build(write=True, verbose=False)
    try:
        lock = json.load(open(lockfile))
    except FileNotFoundError:
        json.dump(counts, open(lockfile,"w"), indent=2)
        print("no lock found — wrote", lockfile); return counts
    moved = {k:(lock.get(k), counts[k]) for k in
             ["scholarly_works","published_reviews","self_published","total_records"]
             if lock.get(k) != counts[k]}
    if moved:
        print("COUNT LOCK FAILED — denominators moved:")
        for k,(a,b) in moved.items(): print(f"   {k}: {a} -> {b}")
        print("\nIf intended, update", lockfile, "in the same commit so the change is reviewable.")
        sys.exit(1)
    print("count lock OK —", counts["scholarly_works"], "scholarly works, current as of", counts["current_as_of"])
    return counts

if __name__ == "__main__":
    if "--verify" in sys.argv: verify()
    else: build()
