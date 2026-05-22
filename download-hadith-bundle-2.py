#!/usr/bin/env python3
"""Sirat Al Huda — Hadith offline data bundler (v3: idempotent + multi-CDN).

Changes from v2:
  • Adds GitHub raw URLs as a fallback after jsDelivr — handles cases where
    jsDelivr returns 403 Forbidden for specific files (observed on
    ara-tirmidhi). GitHub raw serves the same content directly.
  • Tries 4 URL variants per Sunni edition before giving up.
  • Longer retry delays to avoid rate-limit hammering.

Idempotent: skips files that already exist with reasonable size.
Resilient: continues past individual download failures, reports at end.
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
JSDELIVR_BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1"
GH_RAW_BASE   = "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1"
THAQALAYN     = "https://www.thaqalayn-api.net/api/v2"

SUNNI = [
    ("bukhari",  "eng-bukhari",  "ara-bukhari"),
    ("muslim",   "eng-muslim",   "ara-muslim"),
    ("abudawud", "eng-abudawud", "ara-abudawud"),
    ("tirmidhi", "eng-tirmidhi", "ara-tirmidhi"),
    ("nasai",    "eng-nasai",    "ara-nasai"),
    ("ibnmajah", "eng-ibnmajah", "ara-ibnmajah"),
]

SHIA = [
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

MIN_VALID_SIZE = 1024


def fetch_json_from(url, timeout=180):
    """Single attempt — raises on any failure."""
    req = urllib.request.Request(url, headers={"User-Agent": "sirat-bundler/3.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.load(resp)


def try_sunni_edition(edition):
    """Try multiple URLs for a Sunni edition. Returns parsed JSON or raises."""
    candidates = [
        f"{JSDELIVR_BASE}/editions/{edition}.min.json",
        f"{JSDELIVR_BASE}/editions/{edition}.json",
        f"{GH_RAW_BASE}/editions/{edition}.min.json",
        f"{GH_RAW_BASE}/editions/{edition}.json",
    ]
    last_err = None
    for i, url in enumerate(candidates):
        source = "jsDelivr" if "jsdelivr" in url else "GitHub raw"
        variant = "min" if ".min.json" in url else "full"
        try:
            print(f"     · trying {source} ({variant})...")
            return fetch_json_from(url)
        except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError,
                TimeoutError, ConnectionError, OSError) as e:
            last_err = e
            print(f"       ⚠  {source} ({variant}) failed: {e}")
            if i < len(candidates) - 1:
                time.sleep(1.5)
    raise RuntimeError(f"All sources failed: {last_err}")


def try_shia_book(book_id, retries=3):
    """Try Thaqalayn API for a Shia book with retries."""
    url = f"{THAQALAYN}/{book_id}"
    last_err = None
    for attempt in range(retries):
        try:
            return fetch_json_from(url, timeout=300)
        except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError,
                TimeoutError, ConnectionError, OSError) as e:
            last_err = e
            if attempt < retries - 1:
                wait = 2 ** (attempt + 1)
                print(f"     ⚠  attempt {attempt + 1} failed ({e}), retrying in {wait}s...")
                time.sleep(wait)
    raise RuntimeError(f"Failed after {retries} attempts: {last_err}")


def human_size(n):
    if n < 1024: return f"{n} B"
    if n < 1024 * 1024: return f"{n / 1024:.1f} KB"
    return f"{n / 1024 / 1024:.2f} MB"


def is_already_downloaded(path):
    return path.exists() and path.stat().st_size > MIN_VALID_SIZE


succeeded = []
failed = []
skipped = []

# ── Sunni ──
print("→ Sunni collections (jsDelivr + GitHub raw fallback)")
for cid, eng, ara in SUNNI:
    for edition in (eng, ara):
        lang = "eng" if edition.startswith("eng-") else "ara"
        out_path = SUNNI_DIR / f"{cid}-{lang}.json"

        if is_already_downloaded(out_path):
            print(f"  ⊙ {out_path.name} — {human_size(out_path.stat().st_size)} (already downloaded)")
            skipped.append(out_path.name)
            continue

        print(f"  ↓ {edition}")
        try:
            data = try_sunni_edition(edition)
            out_path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
            size = out_path.stat().st_size
            hadith_count = len(data.get("hadiths", []))
            print(f"     ✓ {out_path.name} — {human_size(size)} ({hadith_count} hadith)")
            succeeded.append(out_path.name)
        except Exception as e:
            print(f"     ✗ FAILED: {e}")
            failed.append(out_path.name)

# ── Shia ──
print("\n→ Shia collections (Thaqalayn API)")
for cid, bid in SHIA:
    out_path = SHIA_DIR / f"{cid}.json"

    if is_already_downloaded(out_path):
        print(f"  ⊙ {out_path.name} — {human_size(out_path.stat().st_size)} (already downloaded)")
        skipped.append(out_path.name)
        continue

    print(f"  ↓ {bid}")
    try:
        data = try_shia_book(bid)
        out_path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
        size = out_path.stat().st_size
        print(f"     ✓ {out_path.name} — {human_size(size)} ({len(data)} hadith)")
        succeeded.append(out_path.name)
        time.sleep(0.5)
    except Exception as e:
        print(f"     ✗ FAILED: {e}")
        failed.append(out_path.name)

# ── Summary ──
print()
print("─" * 60)
print(f"  Downloaded this run: {len(succeeded)}")
print(f"  Already existed:     {len(skipped)}")
print(f"  Failed:              {len(failed)}")
total_size = sum(p.stat().st_size for p in OUT_DIR.rglob("*.json"))
print(f"  Total bundle size:   {human_size(total_size)}")
print(f"  Written to:          {OUT_DIR}")

if failed:
    print()
    print(f"⚠  {len(failed)} file(s) failed — re-run the script to retry just these:")
    for name in failed:
        print(f"    - {name}")
    sys.exit(1)

print()
print("✓ Bundle complete — all 26 files present.")
