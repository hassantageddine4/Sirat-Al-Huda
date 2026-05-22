#!/usr/bin/env python3
"""
Make Verse of the Day pick a different verse on every app load:
- getTodayVerseIndex() → random integer (was: day-of-year mod length)
- getCachedVerse() → always returns null (forces fresh pick every load)
"""
import pathlib, re, sys

P = pathlib.Path.home() / "Downloads/sirat-capacitor-3/src/services/quranVerseService.js"
s = P.read_text()

# ─── 1. Replace getTodayVerseIndex body ────────────────────────────────────
old_idx = re.search(
    r"export function getTodayVerseIndex\(\) \{[^}]+\}",
    s, re.DOTALL
)
if old_idx:
    new_idx = '''export function getTodayVerseIndex() {
  // Random pick every call — gives a different verse on each app load.
  return Math.floor(Math.random() * OFFLINE_VERSES.length);
}'''
    s = s[:old_idx.start()] + new_idx + s[old_idx.end():]
    print("✓ getTodayVerseIndex now returns random")
else:
    print("⚠ Could not find getTodayVerseIndex body", file=sys.stderr)

# ─── 2. Bypass cache: getCachedVerse always returns null ───────────────────
old_cache = re.search(
    r"function getCachedVerse\(\) \{[^}]+(?:\{[^}]*\}[^}]*)*\}",
    s, re.DOTALL
)
if old_cache:
    new_cache = '''function getCachedVerse() {
  // Cache disabled — return null so a fresh random verse is picked every load.
  return null;
}'''
    s = s[:old_cache.start()] + new_cache + s[old_cache.end():]
    print("✓ getCachedVerse now always returns null (cache bypassed)")
else:
    print("⚠ Could not find getCachedVerse body", file=sys.stderr)

P.write_text(s)
