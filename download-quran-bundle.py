#!/usr/bin/env python3
"""Sirat Al Huda — Quran offline data bundler.

Downloads:
  • Chapter metadata (api.quran.com)
  • Arabic Uthmani text (api.alquran.cloud)
  • 5 English translations (api.alquran.cloud)
  • Curated reciter list (static, written from this script)

Outputs to: <sirat-capacitor-3>/public/quran/

Total bundle size: ~7-8 MB (uncompressed). Vite passes public/ through
unchanged; cap sync copies to ios/App/App/public/quran/ for the WebView
to serve from the local filesystem (offline-capable).

Runtime: ~1-3 minutes depending on network. No auth, no API keys.
"""

import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path.home() / "Downloads/sirat-capacitor-3"
OUT_DIR = ROOT / "public/quran"
TRANS_DIR = OUT_DIR / "translations"

if not ROOT.exists():
    print(f"❌ Cannot find app at {ROOT}")
    sys.exit(1)

OUT_DIR.mkdir(parents=True, exist_ok=True)
TRANS_DIR.mkdir(exist_ok=True)

HTML_TAG_RE = re.compile(r"<[^>]+>")


def fetch_json(url, retries=3):
    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "sirat-bundler/1.0"})
            with urllib.request.urlopen(req, timeout=60) as resp:
                return json.load(resp)
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
            last_err = e
            if attempt < retries - 1:
                wait = 2 ** attempt
                print(f"   ⚠  attempt {attempt + 1} failed ({e}), retrying in {wait}s...")
                time.sleep(wait)
    raise RuntimeError(f"Failed after {retries} attempts: {last_err}")


def strip_html(text):
    """Strip <sup>1</sup> footnote markers and other HTML from translations."""
    return HTML_TAG_RE.sub("", text).strip()


def human_size(n):
    if n < 1024:
        return f"{n} B"
    if n < 1024 * 1024:
        return f"{n / 1024:.1f} KB"
    return f"{n / 1024 / 1024:.2f} MB"


# ── 1. Chapter metadata (from api.quran.com to match existing normalizeChapter) ──
print("→ Fetching chapter metadata from api.quran.com...")
raw = fetch_json("https://api.quran.com/api/v4/chapters?language=en")
chapters = []
for c in raw.get("chapters", []):
    chapters.append({
        "id":              c["id"],
        "revelationPlace": c.get("revelation_place"),
        "revelationOrder": c.get("revelation_order"),
        "bismillahPre":    c.get("bismillah_pre"),
        "nameSimple":      c.get("name_simple"),
        "nameArabic":      c.get("name_arabic"),
        "nameComplex":     c.get("name_complex"),
        "versesCount":     c.get("verses_count"),
        "pages":           c.get("pages"),
        "translatedName":  (c.get("translated_name") or {}).get("name", ""),
    })

chapters_path = OUT_DIR / "chapters.json"
chapters_path.write_text(json.dumps(chapters, ensure_ascii=False, separators=(",", ":")))
print(f"   ✓ chapters.json — {len(chapters)} surahs, {human_size(chapters_path.stat().st_size)}")

# ── 2. Full Quran editions from alquran.cloud ──
EDITIONS = [
    # (output filename relative to OUT_DIR, alquran.cloud edition identifier)
    ("arabic-uthmani.json",            "quran-uthmani"),
    ("translations/en.sahih.json",     "en.sahih"),
    ("translations/en.pickthall.json", "en.pickthall"),
    ("translations/en.yusufali.json",  "en.yusufali"),
    ("translations/en.asad.json",      "en.asad"),
    ("translations/en.hilali.json",    "en.hilali"),
]

for out_name, edition in EDITIONS:
    print(f"→ Fetching {edition}...")
    data = fetch_json(f"https://api.alquran.cloud/v1/quran/{edition}")

    if data.get("code") != 200 or "data" not in data:
        raise RuntimeError(f"Unexpected response for {edition}: {data.get('status')}")

    # Compact format: { "1": [verse, verse, ...], "2": [...] }
    is_arabic = edition == "quran-uthmani"
    compact = {}
    for surah in data["data"].get("surahs", []):
        sid = str(surah["number"])
        compact[sid] = []
        for ayah in surah.get("ayahs", []):
            text = ayah.get("text", "")
            if not is_arabic:
                text = strip_html(text)
            entry = {
                "number":        ayah.get("number"),
                "numberInSurah": ayah.get("numberInSurah"),
                "text":          text,
            }
            if is_arabic:
                entry["juz"] = ayah.get("juz")
                entry["page"] = ayah.get("page")
            compact[sid].append(entry)

    out_path = OUT_DIR / out_name
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(compact, ensure_ascii=False, separators=(",", ":")))
    print(f"   ✓ {out_name} — {human_size(out_path.stat().st_size)}")

# ── 3. Reciters (matches CURATED_RECITERS in quranService.js) ──
RECITERS = [
    {"id": 7, "name": "Mishary Rashid Alafasy",   "style": "Murattal", "translated": "Mishary Rashid Alafasy"},
    {"id": 6, "name": "Mahmoud Khalil Al-Husary", "style": "Murattal", "translated": "Mahmoud Khalil Al-Husary"},
    {"id": 4, "name": "Abdul Basit Abdul Samad",  "style": "Murattal", "translated": "Abdul Basit Abdul Samad"},
    {"id": 3, "name": "Abdur-Rahman As-Sudais",   "style": "Murattal", "translated": "Abdur-Rahman As-Sudais"},
    {"id": 1, "name": "Abdul Basit Abdul Samad",  "style": "Mujawwad", "translated": "Abdul Basit Abdul Samad"},
    {"id": 2, "name": "Abu Bakr Al-Shatri",       "style": "Murattal", "translated": "Abu Bakr Al-Shatri"},
    {"id": 5, "name": "Hani Ar-Rifai",            "style": "Murattal", "translated": "Hani Ar-Rifai"},
]
reciters_path = OUT_DIR / "reciters.json"
reciters_path.write_text(json.dumps(RECITERS, ensure_ascii=False, separators=(",", ":")))
print(f"   ✓ reciters.json — {len(RECITERS)} entries, {human_size(reciters_path.stat().st_size)}")

# ── Summary ──
total = sum(p.stat().st_size for p in OUT_DIR.rglob("*.json"))
print()
print(f"✓ Done. Bundle written to {OUT_DIR}")
print(f"  Total size: {human_size(total)}")
