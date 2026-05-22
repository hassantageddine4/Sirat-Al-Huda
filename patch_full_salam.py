#!/usr/bin/env python3
"""
Add the final salam ("Assalamu alaykum wa rahmatullaahi wa barakaatuh") to
the END of salamShiaPreparations recitation. The Closing Sequence step now
shows: salam to Prophet → salam to righteous → 3 takbirs → final salam.
The Salām to the Angels step still shows only the final salam (for the
physical head-turning action).
"""
import pathlib, sys

REC = pathlib.Path.home() / "Downloads/sirat-capacitor-3/src/data/prayerWalkthrough/recitations.js"
src = REC.read_text()

# Replace the Arabic, transliteration, and translation of salamShiaPreparations

OLD_AR = '"السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\\n\\nالسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ\\n\\nاللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ"'
NEW_AR = '"السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\\n\\nالسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ\\n\\nاللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ\\n\\nالسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ"'

OLD_TR = '"Assalaamu \'alayka ayyuhan nabiyyu wa rahmatullaahi wa barakaatuh\\n\\nAssalamu \'alaynaa wa \'alaa \'ibaadillaahis saaliheen\\n\\nAllaahu Akbar • Allaahu Akbar • Allaahu Akbar"'
NEW_TR = '"Assalaamu \'alayka ayyuhan nabiyyu wa rahmatullaahi wa barakaatuh\\n\\nAssalamu \'alaynaa wa \'alaa \'ibaadillaahis saaliheen\\n\\nAllaahu Akbar • Allaahu Akbar • Allaahu Akbar\\n\\nAssalamu alaykum wa rahmatullaahi wa barakaatuh"'

OLD_EN = '"Peace be upon you, O Prophet, and the mercy of Allah and His blessings.\\n\\nPeace be upon us and upon the righteous servants of Allah.\\n\\nAllah is the Greatest • Allah is the Greatest • Allah is the Greatest (raise the hands to the ears with each takbīr)."'
NEW_EN = '"Peace be upon you, O Prophet, and the mercy of Allah and His blessings.\\n\\nPeace be upon us and upon the righteous servants of Allah.\\n\\nAllah is the Greatest • Allah is the Greatest • Allah is the Greatest (raise the hands to the ears with each takbīr).\\n\\nPeace be upon you all, and the mercy of Allah and His blessings."'

for old, new, label in [(OLD_AR, NEW_AR, "Arabic"), (OLD_TR, NEW_TR, "Transliteration"), (OLD_EN, NEW_EN, "Translation")]:
    if old in src:
        src = src.replace(old, new, 1)
        print(f"✓ {label} updated — final salam appended")
    else:
        print(f"⚠ {label} pattern not matched", file=sys.stderr)

REC.write_text(src)
