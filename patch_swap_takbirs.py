#!/usr/bin/env python3
"""
Swap the order of the final salam and the 3 takbirs in salamShiaPreparations
so the sequence becomes:
  Salam to Prophet → Salam to righteous → Final salam → 3 Takbirs
"""
import pathlib, sys

REC = pathlib.Path.home() / "Downloads/sirat-capacitor-3/src/data/prayerWalkthrough/recitations.js"
s = REC.read_text()

# Arabic
OLD_AR = '"السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\\n\\nالسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ\\n\\nاللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ\\n\\nالسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ"'
NEW_AR = '"السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\\n\\nالسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ\\n\\nالسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\\n\\nاللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ"'

# Transliteration
OLD_TR = "\"Assalaamu 'alayka ayyuhan nabiyyu wa rahmatullaahi wa barakaatuh\\n\\nAssalamu 'alaynaa wa 'alaa 'ibaadillaahis saaliheen\\n\\nAllaahu Akbar • Allaahu Akbar • Allaahu Akbar\\n\\nAssalamu alaykum wa rahmatullaahi wa barakaatuh\""
NEW_TR = "\"Assalaamu 'alayka ayyuhan nabiyyu wa rahmatullaahi wa barakaatuh\\n\\nAssalamu 'alaynaa wa 'alaa 'ibaadillaahis saaliheen\\n\\nAssalamu alaykum wa rahmatullaahi wa barakaatuh\\n\\nAllaahu Akbar • Allaahu Akbar • Allaahu Akbar\""

# Translation
OLD_EN = '"Peace be upon you, O Prophet, and the mercy of Allah and His blessings.\\n\\nPeace be upon us and upon the righteous servants of Allah.\\n\\nAllah is the Greatest • Allah is the Greatest • Allah is the Greatest (raise the hands to the ears with each takbīr).\\n\\nPeace be upon you all, and the mercy of Allah and His blessings."'
NEW_EN = '"Peace be upon you, O Prophet, and the mercy of Allah and His blessings.\\n\\nPeace be upon us and upon the righteous servants of Allah.\\n\\nPeace be upon you all, and the mercy of Allah and His blessings.\\n\\nAllah is the Greatest • Allah is the Greatest • Allah is the Greatest (raise the hands to the ears with each takbīr)."'

for old, new, label in [(OLD_AR, NEW_AR, "Arabic"), (OLD_TR, NEW_TR, "Transliteration"), (OLD_EN, NEW_EN, "Translation")]:
    if old in s:
        s = s.replace(old, new, 1)
        print(f"✓ {label} swapped")
    else:
        print(f"⚠ {label} not matched", file=sys.stderr)

REC.write_text(s)
