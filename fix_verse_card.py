#!/usr/bin/env python3
"""Fix Verse of the Day:
 1. VerseCard was hardcoded — wire it to read the fetched verse from state.
 2. getTodayVerseIndex was Math.random() — make it day-of-year so it
    rotates once per calendar day.
"""
import pathlib

HOME    = pathlib.Path.home()
SERVICE = HOME / "Downloads/sirat-capacitor-3/src/services/quranVerseService.js"
HOMEJS  = HOME / "Downloads/sirat-capacitor-3/src/pages/Home.jsx"

def read(p):  return p.read_text(encoding="utf-8")
def write(p, s): p.write_text(s, encoding="utf-8")

def backup(p):
    bak = p.with_suffix(p.suffix + ".bak")
    if not bak.exists():
        bak.write_text(read(p), encoding="utf-8")
        print(f"  backup → {bak.name}")

# ─── 1. quranVerseService.js ─────────────────────────────────────────────
print("→ Patching quranVerseService.js")
backup(SERVICE)
svc = read(SERVICE)

OLD_IDX = """export function getTodayVerseIndex() {
  // Random pick every call — gives a different verse on each app load.
  return Math.floor(Math.random() * OFFLINE_VERSES.length);
}"""

NEW_IDX = """export function getTodayVerseIndex() {
  // Deterministic — same index for the whole calendar day, rotates at
  // local midnight. Returns raw day-of-year; consumers mod by their
  // array length so we use the full curated set.
  const now   = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}"""

if OLD_IDX in svc:
    svc = svc.replace(OLD_IDX, NEW_IDX, 1)
    write(SERVICE, svc)
    print("  ✓ getTodayVerseIndex now deterministic (day-of-year)")
elif "Deterministic — same index for the whole calendar day" in svc:
    print("  ✓ already patched")
else:
    print("  ⚠ getTodayVerseIndex block not matched — inspect manually")

# ─── 2. Home.jsx — wire VerseCard to actual state ────────────────────────
print("→ Patching Home.jsx")
backup(HOMEJS)
home = read(HOMEJS)

# 2a. Capture surah name in setVerse
OLD_SET = """        setVerse({
          arabic:      r.verse.arabic,
          translation: r.verse.translation,
          ref:         r.verse.reference ?? r.verse.ref ?? "",
        });"""

NEW_SET = """        setVerse({
          arabic:      r.verse.arabic,
          translation: r.verse.translation,
          surah:       r.verse.surah ?? "",
          ref:         r.verse.reference ?? r.verse.ref ?? "",
        });"""

if OLD_SET in home:
    home = home.replace(OLD_SET, NEW_SET, 1)
    print("  ✓ setVerse now captures surah name")
elif "surah:       r.verse.surah" in home:
    print("  ✓ setVerse already captures surah")
else:
    print("  ⚠ setVerse shape not matched")

# 2b. Pass verse prop to VerseCard
if "<VerseCard />" in home:
    home = home.replace("<VerseCard />", "<VerseCard verse={verse} />", 1)
    print("  ✓ <VerseCard /> now receives verse prop")
elif "<VerseCard verse={verse} />" in home:
    print("  ✓ <VerseCard /> already receives verse prop")
else:
    print("  ⚠ <VerseCard /> render not matched")

# 2c. Replace hardcoded constants with prop reads
OLD_HEAD = """function VerseCard() {
  const ARABIC = "إِنَّ مَعَ الْعُسْرِ يُسْرًا";
  const ENGLISH = "Indeed, with hardship comes ease.";
  const REF = "Sūrah Ash-Sharḥ · 94:6";
"""

NEW_HEAD = """function VerseCard({ verse }) {
  const ARABIC  = verse?.arabic      || "إِنَّ مَعَ الْعُسْرِ يُسْرًا";
  const ENGLISH = verse?.translation || "Indeed, with hardship comes ease.";
  const REF     = formatVerseRef(verse) || "Sūrah Ash-Sharḥ · 94:6";
"""

if OLD_HEAD in home:
    home = home.replace(OLD_HEAD, NEW_HEAD, 1)
    print("  ✓ VerseCard now reads from props")
elif "function VerseCard({ verse }) {" in home:
    print("  ✓ VerseCard already reads from props")
else:
    print("  ⚠ VerseCard signature not matched")

# 2d. Add formatVerseRef helper just before VerseCard
HELPER = """function formatVerseRef(verse) {
  if (!verse) return "";
  const surah = (verse.surah || "").trim();
  const ref   = (verse.ref || "").trim();
  if (surah && ref) return `${surah} · ${ref}`;
  return surah || ref;
}

"""
MARKER = "function VerseCard({ verse }) {"
if "formatVerseRef" not in home and MARKER in home:
    home = home.replace(MARKER, HELPER + MARKER, 1)
    print("  ✓ formatVerseRef helper added")
elif "formatVerseRef" in home:
    print("  ✓ formatVerseRef already present")
else:
    print("  ⚠ helper insertion marker missing")

write(HOMEJS, home)

print("\n✓ Done.")
print("  Build: cd ~/Downloads/sirat-capacitor-3 && npm run build && npx cap sync ios 2>&1 | tail -3")
