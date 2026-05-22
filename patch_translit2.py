#!/usr/bin/env python3
"""Forcibly replace the salamShiaPreparations transliteration."""
import pathlib

REC = pathlib.Path.home() / "Downloads/sirat-capacitor-3/src/data/prayerWalkthrough/recitations.js"
s = REC.read_text()

OLD = 'transliteration: "As-salāmu ʿalayka ayyuhā n-nabiyyu wa raḥmatu-llāhi wa barakātuh\\n\\nAs-salāmu ʿalaynā wa ʿalā ʿibādi-llāhi ṣ-ṣāliḥīn\\n\\nAllāhu Akbar • Allāhu Akbar • Allāhu Akbar"'
NEW = "transliteration: \"Assalaamu 'alayka ayyuhan nabiyyu wa rahmatullaahi wa barakaatuh\\n\\nAssalamu 'alaynaa wa 'alaa 'ibaadillaahis saaliheen\\n\\nAllaahu Akbar • Allaahu Akbar • Allaahu Akbar\\n\\nAssalamu alaykum wa rahmatullaahi wa barakaatuh\""

if OLD in s:
    s = s.replace(OLD, NEW, 1)
    REC.write_text(s)
    print("✓ Updated salamShiaPreparations transliteration")
else:
    print("⚠ Not matched — pasting first 200 chars after 'salamShiaPreparations':")
    i = s.find("salamShiaPreparations")
    print(s[i:i+800])
