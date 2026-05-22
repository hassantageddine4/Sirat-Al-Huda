#!/usr/bin/env python3
"""Sirat Al Huda — Hadith offline data bundler.

Downloads:
  • 6 Sunni collections × 2 languages (eng + ara) from fawazahmed0/hadith-api
    on jsDelivr CDN — public domain redistribution
  • 14 Shia books (8 Kafi + 5 Man La Yahduruh + Nahj al-Balagha) from
    Thaqalayn API — licensing pending per Hassan's accepted risk decision

Output: <sirat-capacitor-3>/public/hadith/{sunni,shia}/

Approx 50 MB total bundle. Capacitor serves these via WebView from local
filesystem at runtime — works in airplane mode.
"""

import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path.home() / "Downloads/sirat-capacitor-3"
OUT_DIR   = ROOT / "public/hadith"
SUNNI_DIR = OUT_DIR / "sunni"
SHIA_DIR  = OUT_DIR / "shia"

if not ROOT.exists():
    print(f"❌ Cannot find app at {ROOT}")
    sys.exit(1)

SUNNI_DIR.mkdir(parents=True, exist_ok=True)
SHIA_DIR.mkdir(parents=True, exist_ok=True)

# ── Sources ────────────────────────────────────────────────────────────────
JSDELIVR  = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1"
THAQALAYN = "https://www.thaqalayn-api.net/api/v2"

SUNNI = [
    # (collection_id, eng_edition, ara_edition)
    ("bukhari",  "eng-bukhari",  "ara-bukhari"),
    ("muslim",   "eng-muslim",   "ara-muslim"),
    ("abudawud", "eng-abudawud", "ara-abudawud"),
    ("tirmidhi", "eng-tirmidhi", "ara-tirmidhi"),
    ("nasai",    "eng-nasai",    "ara-nasai"),
    ("ibnmajah", "eng-ibnmajah", "ara-ibnmajah"),
]

SHIA = [
    # (collection_id, thaqalayn_book_id)
    ("kafi-1", "Al-Kafi-Volume-1-Kulayni"),
    ("kafi-2", "Al-Kafi-Volume-2-Kulayni"),
    ("kafi-3", "Al-Kafi-Volume-3-Kulayni"),
    ("kafi-4", "Al-Kafi-Volume-4-Kulayni"),
    ("kafi-5", "Al-Kafi-Volume-5-Kulayni"),
    ("kafi-6", "Al-Kafi-Volume-6-Kulayni"),
    ("kafi-7", "Al-Kafi-Volume-7-Kulayni"),
    ("kafi-8", "Al-Kafi-Volume-8-Kulayni"),
    ("manlayahduruh-1", "Man-La-Yahduruh-al-Faqih-Volume-1-Saduq"),
    ("manlayahduruh-2", "Man-La-Yahduruh-al-Faqih-Volume-2-Saduq"),
    ("manlayahduruh-3", "Man-La-Yahduruh-al-Faqih-Volume-3-Saduq"),
    ("manlayahduruh-4", "Man-La-Yahduruh-al-Faqih-Volume-4-Saduq"),
    ("manlayahduruh-5", "Man-La-Yahduruh-al-Faqih-Volume-5-Saduq"),
    ("nahjbalagha",     "Nahj-al-Balagha-Radi"),
]


def fetch_json(url, retries=3, timeout=180):
    """Fetch + parse JSON with retries and exponential backoff."""
    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "sirat-bundler/1.0"})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.load(resp)
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ConnectionError) as e:
            last_err = e
            if attempt < retries - 1:
                wait = 2 ** attempt
                print(f"      ⚠  attempt {attempt + 1} failed ({e}), retrying in {wait}s...")
                time.sleep(wait)
    raise RuntimeError(f"Failed after {retries} attempts: {last_err}")


def human_size(n):
    if n < 1024:
        return f"{n} B"
    if n < 1024 * 1024:
        return f"{n / 1024:.1f} KB"
    return f"{n / 1024 / 1024:.2f} MB"


# ── Sunni ──────────────────────────────────────────────────────────────────
print("→ Downloading Sunni collections from jsDelivr...")
sunni_total = 0

for cid, eng, ara in SUNNI:
    for edition in (eng, ara):
        print(f"  ↓ {edition}...")
        # Try .min.json first, fall back to full .json
        try:
            data = fetch_json(f"{JSDELIVR}/editions/{edition}.min.json")
        except Exception:
            print(f"      min variant failed, trying full .json...")
            data = fetch_json(f"{JSDELIVR}/editions/{edition}.json")

        lang = "eng" if edition.startswith("eng-") else "ara"
        out_path = SUNNI_DIR / f"{cid}-{lang}.json"
        out_path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
        size = out_path.stat().st_size
        sunni_total += size
        hadith_count = len(data.get("hadiths", []))
        print(f"     ✓ {out_path.name} — {human_size(size)} ({hadith_count} hadith)")

# ── Shia ───────────────────────────────────────────────────────────────────
print("\n→ Downloading Shia collections from Thaqalayn...")
shia_total = 0
shia_failed = []

for cid, bid in SHIA:
    print(f"  ↓ {bid}...")
    try:
        data = fetch_json(f"{THAQALAYN}/{bid}", retries=3)
    except Exception as e:
        print(f"     ✗ FAILED: {e}")
        shia_failed.append(cid)
        continue

    out_path = SHIA_DIR / f"{cid}.json"
    out_path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
    size = out_path.stat().st_size
    shia_total += size
    print(f"     ✓ {out_path.name} — {human_size(size)} ({len(data)} hadith)")
    time.sleep(0.4)  # courtesy delay to avoid hammering the API

# ── Summary ────────────────────────────────────────────────────────────────
print()
print("─" * 60)
print(f"  Sunni total: {human_size(sunni_total)} ({len(SUNNI) * 2} files)")
print(f"  Shia total:  {human_size(shia_total)} ({len(SHIA) - len(shia_failed)} files)")
print(f"  Grand total: {human_size(sunni_total + shia_total)}")
print(f"  Written to:  {OUT_DIR}")

if shia_failed:
    print()
    print(f"⚠  {len(shia_failed)} Shia books failed to download:")
    for cid in shia_failed:
        print(f"    - {cid}")
    print("   Re-run this script to retry, or check Thaqalayn API status.")
    sys.exit(1)

print()
print("✓ Bundle complete.")
