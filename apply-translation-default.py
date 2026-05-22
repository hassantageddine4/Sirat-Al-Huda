#!/usr/bin/env python3
"""Sirat Al Huda — Quran translation default-on migration.

Forces showTranslation=true once for existing users whose localStorage
has it saved as false. Preserves all other prefs (fontSize, translationId).
After migration runs once, the toggle behaves normally.
"""

from pathlib import Path
import sys

FILE = Path.home() / "Downloads/sirat-capacitor-3/src/pages/SurahReader.jsx"

if not FILE.exists():
    print(f"❌ Cannot find {FILE}")
    sys.exit(1)

src = FILE.read_text()

old = '''function loadPrefs() {
  try { return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREF_KEY) ?? "{}") }; }
  catch { return DEFAULT_PREFS; }
}'''

new = '''const TRANSLATION_MIGRATION_KEY = "sirat_quran_translation_migrated_v1";

function loadPrefs() {
  try {
    const saved = { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREF_KEY) ?? "{}") };
    // One-time migration: force English translation on for existing users
    // who had it toggled off before we made it the default.
    if (!localStorage.getItem(TRANSLATION_MIGRATION_KEY)) {
      saved.showTranslation = true;
      localStorage.setItem(TRANSLATION_MIGRATION_KEY, "1");
    }
    return saved;
  } catch { return DEFAULT_PREFS; }
}'''

if old not in src:
    print("❌ Could not locate loadPrefs() (exact match). Aborting.")
    sys.exit(1)

src = src.replace(old, new)
FILE.write_text(src)
print("✓ Migration applied to SurahReader.jsx")
print("  • Existing users get showTranslation=true on next Quran load")
print("  • Migration marker prevents re-running")
print("  • Toggle remains functional afterward")
