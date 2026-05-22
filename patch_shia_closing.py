#!/usr/bin/env python3
"""
1. Adds a new `salamShiaSequence` recitation with the full Shia closing:
     Salawat → Salam to Prophet → Salam to righteous servants
     → 3 Allahu Akbars (raising hands to ears each time)
     → Final salam (head turning right then left, greeting angels)

2. For every walkthrough step using assetName "pose_salam_shia", swaps
   `recitation: R.salam` → `recitation: R.salamShiaSequence` so the Shia
   closing flow shows the full sequence with takbirs. Sunni stays untouched.
"""
import pathlib, re, sys

ROOT = pathlib.Path.home() / "Downloads/sirat-capacitor-3"
REC = ROOT / "src/data/prayerWalkthrough/recitations.js"
DRAFTS = ROOT / "src/data/prayerWalkthrough/instructions_drafts"
SHARED = DRAFTS / "_sharedShia.js"

if not REC.exists() or not DRAFTS.exists():
    print("ERROR: paths not found", file=sys.stderr); sys.exit(1)

# ─── 1. Add salamShiaSequence to recitations.js ────────────────────────────
rec = REC.read_text()
if "salamShiaSequence" not in rec:
    NEW_REC = '''

// ─── Shia closing salam sequence (with 3 takbirs before final salam) ──────
export const salamShiaSequence = {
  arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ\\n\\nالسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\\n\\nالسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ\\n\\nاللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ\\n\\nالسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ",
  transliteration: "Allāhumma ṣalli ʿalā Muḥammadin wa āli Muḥammad\\n\\nAs-salāmu ʿalayka ayyuhā n-nabiyyu wa raḥmatu-llāhi wa barakātuh\\n\\nAs-salāmu ʿalaynā wa ʿalā ʿibādi-llāhi ṣ-ṣāliḥīn\\n\\nAllāhu Akbar • Allāhu Akbar • Allāhu Akbar\\n\\nAs-salāmu ʿalaykum wa raḥmatu-llāhi wa barakātuh",
  translation: "O Allah, send blessings upon Muhammad and the family of Muhammad.\\n\\nPeace be upon you, O Prophet, and the mercy of Allah and His blessings.\\n\\nPeace be upon us and upon the righteous servants of Allah.\\n\\nAllah is the Greatest • Allah is the Greatest • Allah is the Greatest (raise hands to the ears with each takbir).\\n\\nPeace be upon you all, and the mercy of Allah and His blessings (turn the head right, then left, greeting the angels on each shoulder).",
  reference: "Sayyid Sistani, Tawḍīḥ al-Masāʾil §1126–1136. The three takbīrs after the tashahhud are mustaḥabb (recommended), recited raising the hands to the ears, then the final salām is the obligatory exit of the prayer.",
};
'''
    rec = rec.rstrip() + NEW_REC
    REC.write_text(rec)
    print("✓ Added salamShiaSequence to recitations.js")
else:
    print("○ salamShiaSequence already exists")

# ─── 2. Patch every Shia salam step to use the new recitation ──────────────
# Pattern: a step that has assetName: "pose_salam_shia" and recitation: R.salam
# Strategy: find blocks containing "pose_salam_shia" and replace
# "recitation: R.salam" with "recitation: R.salamShiaSequence" within that block.

def patch_file(path):
    if not path.exists():
        return False
    src = path.read_text()
    original = src
    # Find each step object containing assetName: "pose_salam_shia"
    # and rewrite recitation: R.salam → recitation: R.salamShiaSequence within
    # roughly the same step block.
    # Simple approach: replace lines where assetName is pose_salam_shia,
    # walk forward to find recitation: R.salam, replace just that one.
    lines = src.split("\n")
    out = []
    in_shia_salam_step = False
    nest = 0
    for line in lines:
        if 'assetName: "pose_salam_shia"' in line:
            in_shia_salam_step = True
        if in_shia_salam_step and "recitation: R.salam" in line and "salamShiaSequence" not in line:
            line = line.replace("recitation: R.salam,", "recitation: R.salamShiaSequence,")
            line = line.replace("recitation: R.salam ", "recitation: R.salamShiaSequence ")
            in_shia_salam_step = False
        # Reset state on next top-level step boundary (heuristic: a line with only "}, {")
        if in_shia_salam_step and line.strip() in ("},", "} ,"):
            in_shia_salam_step = False
        out.append(line)
    new = "\n".join(out)
    if new != original:
        path.write_text(new)
        return True
    return False

changed = []
for f in DRAFTS.iterdir():
    if f.suffix == ".js":
        if patch_file(f):
            changed.append(f.name)

if changed:
    print(f"✓ Wired Shia salam → salamShiaSequence in: {', '.join(changed)}")
else:
    print("○ No files needed updating")

# Also handle _sharedShia.js if it has a shiaSalam factory
if SHARED.exists():
    shared = SHARED.read_text()
    if "shiaSalam" in shared and "salamShiaSequence" not in shared:
        # Replace any R.salam references in shiaSalam context
        new_shared = re.sub(
            r"(shiaSalam[^}]*?recitation:\s*)R\.salam(?!ShiaSequence)",
            r"\1R.salamShiaSequence",
            shared,
            flags=re.DOTALL
        )
        if new_shared != shared:
            SHARED.write_text(new_shared)
            print("✓ Updated _sharedShia.js shiaSalam factory")
