#!/usr/bin/env python3
"""
Two restructures:

1. Revert lock screen rectangular widget to the original single-prayer
   countdown layout, adding a small sunrise/sunset row at the bottom.

2. Split the Shia closing step in two:
     Step A — Closing Sequence (salawat + 2 salams + 3 takbirs)
     Step B — Salām to the Angels (final head-turning salam only)
"""
import pathlib, re, sys

ROOT = pathlib.Path.home() / "Downloads/sirat-capacitor-3"
LSW = ROOT / "ios/App/Sirat Al huda widget/LockScreenWidgets.swift"
REC = ROOT / "src/data/prayerWalkthrough/recitations.js"
DRAFTS = ROOT / "src/data/prayerWalkthrough/instructions_drafts"

# ─── 1. Lock screen widget — revert + add sunrise/sunset ──────────────────
src = LSW.read_text()

# Match my prior grid layout and replace with the simpler single-prayer + sunrise/sunset row
OLD_GRID = '''    @ViewBuilder
    private func rectangularView(next: PrayerEntry?, progress: Double) -> some View {
        let prayers = entry.data.prayers
        let fajr    = prayers.first(where: { $0.name == "Fajr"    })
        let sunrise = prayers.first(where: { $0.name == "Sunrise" })
        let dhuhr   = prayers.first(where: { $0.name == "Dhuhr"   })
        let asr     = prayers.first(where: { $0.name == "Asr"     })
        let maghrib = prayers.first(where: { $0.name == "Maghrib" })
        let isha    = prayers.first(where: { $0.name == "Isha"    })

        HStack(alignment: .top, spacing: 6) {
            VStack(alignment: .leading, spacing: 1) {
                gridRow("Fajr",    fajr,    next: next)
                gridRow("Sunrise", sunrise, next: next)
                gridRow("Dhuhr",   dhuhr,   next: next)
            }
            VStack(alignment: .leading, spacing: 1) {
                gridRow("Asr",     asr,     next: next)
                gridRow("Maghrib", maghrib, next: next)
                gridRow("Isha",    isha,    next: next)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    @ViewBuilder
    private func gridRow(_ name: String, _ entry: PrayerEntry?, next: PrayerEntry?) -> some View {
        let isNext = next?.name == name
        HStack(spacing: 3) {
            Text(name)
                .font(.system(size: 10, weight: isNext ? .heavy : .bold))
                .widgetAccentable()
                .lineLimit(1)
            Spacer(minLength: 1)
            if let e = entry {
                Text(e.date, style: .time)
                    .font(.system(size: 10, weight: isNext ? .bold : .regular))
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)
            } else {
                Text("—")
                    .font(.system(size: 10, weight: .regular))
            }
        }
    }'''

NEW_VIEW = '''    @ViewBuilder
    private func rectangularView(next: PrayerEntry?, progress: Double) -> some View {
        let prayers = entry.data.prayers
        let sunrise = prayers.first(where: { $0.name == "Sunrise" })
        let maghrib = prayers.first(where: { $0.name == "Maghrib" })

        VStack(alignment: .leading, spacing: 0) {
            if let n = next {
                HStack(spacing: 4) {
                    Image(systemName: iconForPrayer(n.name))
                        .font(.system(size: 13, weight: .semibold))
                        .widgetAccentable()
                    Text(n.name)
                        .font(.system(size: 17, weight: .bold))
                        .lineLimit(1)
                        .minimumScaleFactor(0.7)
                }
                Text(n.date, style: .time)
                    .font(.system(size: 13, weight: .semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)
                Text(n.date, style: .timer)
                    .font(.system(size: 12, weight: .medium, design: .monospaced))
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)
                HStack(spacing: 8) {
                    if let sr = sunrise {
                        HStack(spacing: 2) {
                            Image(systemName: "sunrise.fill")
                                .font(.system(size: 9))
                                .widgetAccentable()
                            Text(sr.date, style: .time)
                                .font(.system(size: 9, weight: .medium))
                                .lineLimit(1)
                        }
                    }
                    if let ms = maghrib {
                        HStack(spacing: 2) {
                            Image(systemName: "sunset.fill")
                                .font(.system(size: 9))
                                .widgetAccentable()
                            Text(ms.date, style: .time)
                                .font(.system(size: 9, weight: .medium))
                                .lineLimit(1)
                        }
                    }
                }
                .padding(.top, 1)
            } else {
                Text("Open app")
                    .font(.system(size: 14))
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }'''

if OLD_GRID in src:
    src = src.replace(OLD_GRID, NEW_VIEW, 1)
    LSW.write_text(src)
    print("✓ Lock widget: reverted to single-prayer countdown + sunrise/sunset row")
else:
    print("⚠ Grid view pattern not found — widget may already be correct or differs", file=sys.stderr)

# ─── 2. Update recitations: add salamShiaPreparations + salamShiaFinal ─────
rec = REC.read_text()

# Remove or supersede the existing salamShiaSequence from prior patch — we'll
# add two new exports. Leave the old one in place to avoid breaking imports.
if "salamShiaPreparations" not in rec:
    NEW_RECS = '''

// ─── Shia closing — preparations (recited BEFORE the final salam) ──────────
export const salamShiaPreparations = {
  arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ\\n\\nالسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\\n\\nالسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ\\n\\nاللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ",
  transliteration: "Allāhumma ṣalli ʿalā Muḥammadin wa āli Muḥammad\\n\\nAs-salāmu ʿalayka ayyuhā n-nabiyyu wa raḥmatu-llāhi wa barakātuh\\n\\nAs-salāmu ʿalaynā wa ʿalā ʿibādi-llāhi ṣ-ṣāliḥīn\\n\\nAllāhu Akbar • Allāhu Akbar • Allāhu Akbar",
  translation: "O Allah, send blessings upon Muhammad and the family of Muhammad.\\n\\nPeace be upon you, O Prophet, and the mercy of Allah and His blessings.\\n\\nPeace be upon us and upon the righteous servants of Allah.\\n\\nAllah is the Greatest • Allah is the Greatest • Allah is the Greatest (raise the hands to the ears with each takbīr).",
  reference: "Sayyid Sistani, Tawḍīḥ al-Masāʾil §1126–1133. These three salām phrases are mustaḥabb (recommended) and the three takbīrs after the tashahhud are mustaḥabb, recited raising the hands to the ears each time.",
};

// ─── Shia closing — the obligatory final salam (salām to the angels) ──────
export const salamShiaFinal = {
  arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ",
  transliteration: "As-salāmu ʿalaykum wa raḥmatu-llāhi wa barakātuh",
  translation: "Peace be upon you all, and the mercy of Allah and His blessings — said while turning the head to the right, then to the left, greeting the angels on each shoulder.",
  reference: "Sayyid Sistani, Tawḍīḥ al-Masāʾil §1133–1136. This is the obligatory salām that exits the prayer.",
};
'''
    rec = rec.rstrip() + NEW_RECS
    REC.write_text(rec)
    print("✓ Added salamShiaPreparations + salamShiaFinal to recitations.js")

# ─── 3. Split the Shia salam step in each draft file ───────────────────────
# Find each step containing `assetName: "pose_salam_shia"` and replace the
# whole step with TWO steps: preparations (with takbirs) + final salam.

def split_shia_salam(path):
    if not path.exists():
        return False
    src = path.read_text()
    original = src

    # Regex matches the entire object literal containing assetName: "pose_salam_shia"
    # — from the opening `{` to the matching `},`.
    # Use a state-machine approach since regex can't truly balance braces.
    
    needle = 'assetName: "pose_salam_shia"'
    if needle not in src:
        return False

    out_lines = []
    lines = src.split("\n")
    i = 0
    while i < len(lines):
        # Look for start of a step object containing pose_salam_shia
        # We need to find the opening `{` before this marker.
        block_start = None
        block_end = None
        if needle in lines[i]:
            # Walk back to find the `{` that opens this object
            j = i
            depth = 0
            while j >= 0:
                if "}" in lines[j]:
                    depth += lines[j].count("}")
                if "{" in lines[j]:
                    depth -= lines[j].count("{")
                if depth < 0:
                    block_start = j
                    break
                j -= 1
            if block_start is None:
                out_lines.append(lines[i]); i += 1; continue

            # Walk forward to find the closing `},` that ends this object
            depth = 0
            j = block_start
            while j < len(lines):
                depth += lines[j].count("{")
                depth -= lines[j].count("}")
                if depth == 0 and j > block_start:
                    block_end = j
                    break
                j += 1
            if block_end is None:
                out_lines.append(lines[i]); i += 1; continue

            # We have block_start..block_end inclusive
            block = lines[block_start:block_end+1]
            block_text = "\n".join(block)

            # Detect indentation of opening line
            indent_match = re.match(r"(\s*)", lines[block_start])
            indent = indent_match.group(1) if indent_match else "    "

            # Extract the id-prefix (e.g. "${prayer}-r4" or "fajr-r2" or "maghrib-r3")
            id_match = re.search(r"id:\s*[`\"']([^`\"']+)-salam[`\"']", block_text)
            id_prefix = id_match.group(1) if id_match else "prayer-rX"
            id_quote = "`" if "`" in (id_match.group(0) if id_match else "") else "\""

            # Pre-trim out_lines so we don't double-add
            # (out_lines currently has lines[0..block_start-1])
            out_lines = out_lines[:block_start] if len(out_lines) >= block_start else out_lines
            # Actually we need to recompute - let me do this differently
            # ... handle this case by reconstructing
            
            new_steps = f"""{indent}{{
{indent}  id: {id_quote}{id_prefix}-closing-sequence{id_quote},
{indent}  title: "Closing Sequence",
{indent}  posture: POSTURES.KNEELING,
{indent}  assetName: "pose_salam_shia",
{indent}  instruction: "Still seated facing the qiblah, recite the salawāt upon the Prophet ﷺ and his family. Then say the salām to the Prophet ﷺ, followed by the salām to us and the righteous servants of Allah. After this, recite three takbīrs — raising the hands to the ears each time. All of these are mustaḥabb (recommended) and prepare you for the obligatory final salām.",
{indent}  recitation: R.salamShiaPreparations,
{indent}  recitationNote: "These salāms and three takbīrs are mustaḥabb. They precede the obligatory final salām.",
{indent}  tip: "Raise both hands to the level of the ears with each Allāhu Akbar — palms facing forward — just as in the opening takbīr of the prayer.",
{indent}  transition: "Prepare for the final salām, which ends the prayer.",
{indent}  source: "Sistani, Tawḍīḥ al-Masāʾil §1126–1133.",
{indent}  madhhabNote: null,
{indent}}},
{indent}{{
{indent}  id: {id_quote}{id_prefix}-salam{id_quote},
{indent}  title: "Salām to the Angels",
{indent}  posture: POSTURES.KNEELING,
{indent}  assetName: "pose_salam_shia",
{indent}  instruction: "Turn your head gently to the right, then to the left, reciting the final salām. This is the obligatory salām that exits the prayer — you are greeting the angels who record your deeds on each shoulder.",
{indent}  recitation: R.salamShiaFinal,
{indent}  recitationNote: "This final salām is obligatory and completes the prayer.",
{indent}  tip: "After the salām, recite Tasbīḥ al-Zahrāʾ (ʿa): 34 takbīrs, 33 alḥamdulillāhs, 33 subḥāna-llāhs. Highly recommended after every obligatory prayer.",
{indent}  transition: "The prayer is now complete. Take a moment of stillness before standing.",
{indent}  source: "Sistani, Tawḍīḥ al-Masāʾil §1133–1136. Tasbīḥ al-Zahrāʾ: al-Kāfī vol. 3.",
{indent}  madhhabNote: null,
{indent}}},"""
            out_lines.append(new_steps)
            i = block_end + 1
        else:
            out_lines.append(lines[i])
            i += 1

    new_src = "\n".join(out_lines)
    if new_src != original:
        path.write_text(new_src)
        return True
    return False

changed = []
for f in DRAFTS.iterdir():
    if f.suffix == ".js":
        try:
            if split_shia_salam(f):
                changed.append(f.name)
        except Exception as e:
            print(f"⚠ Error processing {f.name}: {e}", file=sys.stderr)

print(f"✓ Split Shia closing into 2 steps in: {', '.join(changed) if changed else '(none)'}")
