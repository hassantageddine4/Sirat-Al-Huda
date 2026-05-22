#!/usr/bin/env python3
"""Add the missing formatVerseRef helper that the first patcher failed to insert."""
import pathlib

HOMEJS = pathlib.Path.home() / "Downloads/sirat-capacitor-3/src/pages/Home.jsx"
home = HOMEJS.read_text(encoding="utf-8")

HELPER = '''function formatVerseRef(verse) {
  if (!verse) return "";
  const surah = (verse.surah || "").trim();
  const ref   = (verse.ref || "").trim();
  if (surah && ref) return `${surah} · ${ref}`;
  return surah || ref;
}

'''
MARKER = "function VerseCard({ verse }) {"

if "function formatVerseRef" in home:
    print("✓ already defined — nothing to do")
elif MARKER in home:
    home = home.replace(MARKER, HELPER + MARKER, 1)
    HOMEJS.write_text(home, encoding="utf-8")
    print("✓ formatVerseRef helper inserted")
else:
    print("⚠ VerseCard marker not found")
