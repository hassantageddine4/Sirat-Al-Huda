#!/usr/bin/env python3
"""
1. Remove the salawat line from salamShiaPreparations recitation
   (salam to Prophet → salam to righteous → 3 takbirs only).
2. Change the Closing Sequence step's pose from "pose_salam_shia"
   to "pose_tashahhud_shia" so the kneeling tashahhud pose stays
   on screen through the preparations sequence.
"""
import pathlib, re, sys

ROOT = pathlib.Path.home() / "Downloads/sirat-capacitor-3"
REC = ROOT / "src/data/prayerWalkthrough/recitations.js"
DRAFTS = ROOT / "src/data/prayerWalkthrough/instructions_drafts"

# ─── 1. Update salamShiaPreparations recitation ────────────────────────────
rec = REC.read_text()

OLD_REC = '''// ─── Shia closing — preparations (recited BEFORE the final salam) ──────────
export const salamShiaPreparations = {
  arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ\\n\\nالسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\\n\\nالسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ\\n\\nاللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ",
  transliteration: "Allāhumma ṣalli ʿalā Muḥammadin wa āli Muḥammad\\n\\nAs-salāmu ʿalayka ayyuhā n-nabiyyu wa raḥmatu-llāhi wa barakātuh\\n\\nAs-salāmu ʿalaynā wa ʿalā ʿibādi-llāhi ṣ-ṣāliḥīn\\n\\nAllāhu Akbar • Allāhu Akbar • Allāhu Akbar",
  translation: "O Allah, send blessings upon Muhammad and the family of Muhammad.\\n\\nPeace be upon you, O Prophet, and the mercy of Allah and His blessings.\\n\\nPeace be upon us and upon the righteous servants of Allah.\\n\\nAllah is the Greatest • Allah is the Greatest • Allah is the Greatest (raise the hands to the ears with each takbīr).",
  reference: "Sayyid Sistani, Tawḍīḥ al-Masāʾil §1126–1133. These three salām phrases are mustaḥabb (recommended) and the three takbīrs after the tashahhud are mustaḥabb, recited raising the hands to the ears each time.",
};'''

NEW_REC = '''// ─── Shia closing — preparations (recited BEFORE the final salam) ──────────
export const salamShiaPreparations = {
  arabic: "السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\\n\\nالسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ\\n\\nاللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ",
  transliteration: "As-salāmu ʿalayka ayyuhā n-nabiyyu wa raḥmatu-llāhi wa barakātuh\\n\\nAs-salāmu ʿalaynā wa ʿalā ʿibādi-llāhi ṣ-ṣāliḥīn\\n\\nAllāhu Akbar • Allāhu Akbar • Allāhu Akbar",
  translation: "Peace be upon you, O Prophet, and the mercy of Allah and His blessings.\\n\\nPeace be upon us and upon the righteous servants of Allah.\\n\\nAllah is the Greatest • Allah is the Greatest • Allah is the Greatest (raise the hands to the ears with each takbīr).",
  reference: "Sayyid Sistani, Tawḍīḥ al-Masāʾil §1126–1133. These two salām phrases are mustaḥabb (recommended) and the three takbīrs after the tashahhud are mustaḥabb, recited raising the hands to the ears each time.",
};'''

if OLD_REC in rec:
    rec = rec.replace(OLD_REC, NEW_REC, 1)
    REC.write_text(rec)
    print("✓ Updated salamShiaPreparations — removed salawat, now starts with salām to the Prophet")
else:
    print("⚠ Could not find salamShiaPreparations exactly", file=sys.stderr)

# ─── 2. Swap pose on every "Closing Sequence" step ─────────────────────────
# Strategy: for each step whose id ends with "-closing-sequence" or whose title
# is "Closing Sequence", change its assetName from "pose_salam_shia" to
# "pose_tashahhud_shia". Use a line scanner.

def patch_pose(path):
    if not path.exists():
        return False
    src = path.read_text()
    lines = src.split("\n")
    out = []
    in_closing_seq = False
    for line in lines:
        if "closing-sequence" in line or 'title: "Closing Sequence"' in line:
            in_closing_seq = True
        if in_closing_seq and 'assetName: "pose_salam_shia"' in line:
            line = line.replace('"pose_salam_shia"', '"pose_tashahhud_shia"')
            in_closing_seq = False
        # Reset if we hit the close of the object
        if in_closing_seq and line.strip() in ("},", "} ,"):
            in_closing_seq = False
        out.append(line)
    new = "\n".join(out)
    if new != src:
        path.write_text(new)
        return True
    return False

changed = []
for f in DRAFTS.iterdir():
    if f.suffix == ".js":
        if patch_pose(f):
            changed.append(f.name)

print(f"✓ Closing Sequence now uses pose_tashahhud_shia in: {', '.join(changed) if changed else '(none)'}")
