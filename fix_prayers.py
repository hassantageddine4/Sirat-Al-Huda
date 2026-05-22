#!/usr/bin/env python3
"""
Sirat prayer instruction fixes - May 13 2026.

Patches three draft files:
  1. Remove the istiftah step entirely from Sunni rakah 1
  2. Update the preceding fold step's transition (no longer points to istiftah)
  3. Simplify tasbihat steps: remove the "or Al-Fātiḥah" alternative
  4. Update preceding qiyam step instruction/transition for tasbihat steps

Affects: fajr.js, maghrib.js, dhuhr_asr_isha.js
"""

import re, os, sys

BASE = os.path.expanduser("~/Downloads/sirat-capacitor-3/src/data/prayerWalkthrough/instructions_drafts")

def patch_file(filename, patches):
    path = os.path.join(BASE, filename)
    with open(path) as f:
        text = f.read()
    original = text
    applied = 0
    for label, op in patches:
        before = text
        text = op(text)
        if text != before:
            applied += 1
            print(f"  ✓ {label}")
        else:
            print(f"  ✗ {label} (no change — pattern not found)")
    if text != original:
        with open(path, 'w') as f:
            f.write(text)
        print(f"  → {applied} change(s) saved to {filename}")
    else:
        print(f"  → no changes to {filename}")
    return applied

# ─── Operations ─────────────────────────────────────────────────────────────

def remove_istiftah_block(text):
    """Remove the entire istiftah step object from the file."""
    pattern = re.compile(
        r'\n  \{\n    id: "[^"]*-r1-istiftah",.*?\n  \},\n',
        re.DOTALL
    )
    return pattern.sub('\n', text)

def update_fold_transition(text):
    """Update fold step transition to skip istiftah."""
    return text.replace(
        'transition: "With hands folded, begin the opening supplication silently."',
        'transition: "With hands folded, seek refuge in Allah before beginning the recitation of the Qurʾan."'
    )

# Maghrib rakah-3 tasbihat simplification
def maghrib_r3_qiyam_instruction(text):
    return text.replace(
        "In the third rakah, the recitation is always silent — Sistani's risāla states that in the third rakah of a 3-rakah prayer (and rakahs 3-4 of a 4-rakah prayer), the worshipper has a choice between reciting Al-Fātiḥah or reciting Tasbīḥāt al-Arbaʿa three times. Reciting the tasbīḥāt is generally considered more virtuous.",
        "In the third rakah, the recitation is Tasbīḥāt al-Arbaʿa — the Four Praises — recited silently."
    )

def maghrib_r3_qiyam_transition(text):
    return text.replace(
        'transition: "Choose either Al-Fātiḥah or Tasbīḥāt al-Arbaʿa."',
        'transition: "Recite the Tasbīḥāt al-Arbaʿa three times."'
    )

def maghrib_tasbihat_title(text):
    return text.replace(
        'title: "Tasbīḥāt al-Arbaʿa (or Al-Fātiḥah)"',
        'title: "Tasbīḥāt al-Arbaʿa"'
    )

def maghrib_tasbihat_instruction(text):
    return text.replace(
        "Recite Tasbīḥāt al-Arbaʿa — the Four Praises — three times silently. Alternatively, recite Al-Fātiḥah silently with the basmalah said silently as well. The tasbīḥāt is shorter and is the more commonly chosen option.",
        "Recite Tasbīḥāt al-Arbaʿa — the Four Praises — three times silently. This is the standard recitation in the third rakah of Maghrib in the Shia tradition."
    )

def maghrib_tasbihat_note(text):
    return text.replace(
        'recitationNote: "Recited three times. Obligatory to recite either this OR Al-Fātiḥah in the 3rd rakah. Both are valid; tasbīḥāt is more commonly chosen."',
        'recitationNote: "Recited three times silently. Obligatory."'
    )

def maghrib_tasbihat_tip(text):
    return text.replace(
        'tip: "If you choose Al-Fātiḥah, the basmalah is recited silently in the third rakah — unlike rakahs 1-2 in audible prayers."',
        'tip: null'
    )

# Dhuhr/Asr/Isha rakah-3 and rakah-4 tasbihat simplification
def dai_r3_qiyam_instruction(text):
    return text.replace(
        "In the third rakah, the recitation is always silent — Sistani's risāla states that in rakahs 3 and 4, the worshipper has a choice between reciting Al-Fātiḥah or reciting Tasbīḥāt al-Arbaʿa three times. Reciting the tasbīḥāt is generally considered more virtuous.",
        "In the third and fourth rakahs, the recitation is Tasbīḥāt al-Arbaʿa — the Four Praises — recited silently."
    )

def dai_r3_qiyam_transition(text):
    return text.replace(
        'transition: "Choose either Al-Fātiḥah or Tasbīḥāt al-Arbaʿa."',
        'transition: "Recite the Tasbīḥāt al-Arbaʿa three times."'
    )

def dai_r3_recitation_block(text):
    """Update the rakah-3 recitation step."""
    return text.replace(
        '''Recite Tasbīḥāt al-Arbaʿa — the Four Praises — three times silently. Alternatively, recite Al-Fātiḥah silently with the basmalah said silently as well. The tasbīḥāt is shorter and is the more commonly chosen option.''',
        '''Recite Tasbīḥāt al-Arbaʿa — the Four Praises — three times silently. This is the standard recitation in the third and fourth rakahs of every obligatory four-rakah prayer in the Shia tradition.'''
    )

def dai_r3_recitation_note(text):
    return text.replace(
        'recitationNote: "Recited three times. Obligatory to recite either this OR Al-Fātiḥah in the 3rd rakah. Both are valid; tasbīḥāt is more commonly chosen."',
        'recitationNote: "Recited three times silently. Obligatory."'
    )

def dai_r3_recitation_tip(text):
    return text.replace(
        'tip: "If you choose Al-Fātiḥah, the basmalah is recited silently in rakahs 3 and 4 — unlike rakahs 1 and 2 in audible prayers."',
        'tip: null'
    )

def dai_tasbihat_titles(text):
    """Update both rakah-3 and rakah-4 step titles."""
    return text.replace(
        'title: "Tasbīḥāt al-Arbaʿa (or Al-Fātiḥah)"',
        'title: "Tasbīḥāt al-Arbaʿa"'
    )

def dai_r4_qiyam_transition(text):
    return text.replace(
        'transition: "Recite Tasbīḥāt al-Arbaʿa or Al-Fātiḥah, as in the third rakah."',
        'transition: "Recite the Tasbīḥāt al-Arbaʿa three times, as in the third rakah."'
    )

def dai_r4_recitation(text):
    return text.replace(
        "Recite Tasbīḥāt al-Arbaʿa three times silently, or Al-Fātiḥah silently — the same choice as in the third rakah. Consistency between rakahs 3 and 4 is recommended; whatever was chosen in the third should be chosen here.",
        "Recite Tasbīḥāt al-Arbaʿa three times silently, as in the third rakah."
    )

def dai_r4_note(text):
    return text.replace(
        'recitationNote: "Recited three times. Obligatory to recite either tasbīḥāt or Al-Fātiḥah."',
        'recitationNote: "Recited three times silently. Obligatory."'
    )

# ─── Apply patches ──────────────────────────────────────────────────────────

print("=" * 60)
print("Sirat prayer instruction fixes")
print("=" * 60)

print("\nfajr.js:")
patch_file("fajr.js", [
    ("Remove istiftah step",         remove_istiftah_block),
    ("Update fold transition",       update_fold_transition),
])

print("\nmaghrib.js:")
patch_file("maghrib.js", [
    ("Remove istiftah step",         remove_istiftah_block),
    ("Update fold transition",       update_fold_transition),
    ("Update r3 qiyam instruction",  maghrib_r3_qiyam_instruction),
    ("Update r3 qiyam transition",   maghrib_r3_qiyam_transition),
    ("Update tasbihat title",        maghrib_tasbihat_title),
    ("Update tasbihat instruction",  maghrib_tasbihat_instruction),
    ("Update tasbihat note",         maghrib_tasbihat_note),
    ("Remove tasbihat tip",          maghrib_tasbihat_tip),
])

print("\ndhuhr_asr_isha.js:")
patch_file("dhuhr_asr_isha.js", [
    ("Remove istiftah step",         remove_istiftah_block),
    ("Update fold transition",       update_fold_transition),
    ("Update r3 qiyam instruction",  dai_r3_qiyam_instruction),
    ("Update r3 qiyam transition",   dai_r3_qiyam_transition),
    ("Update r3 recitation block",   dai_r3_recitation_block),
    ("Update r3 recitation note",    dai_r3_recitation_note),
    ("Remove r3 recitation tip",     dai_r3_recitation_tip),
    ("Update tasbihat titles",       dai_tasbihat_titles),
    ("Update r4 qiyam transition",   dai_r4_qiyam_transition),
    ("Update r4 recitation",         dai_r4_recitation),
    ("Update r4 note",               dai_r4_note),
])

print("\nDone.")
