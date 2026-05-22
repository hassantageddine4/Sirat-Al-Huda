#!/usr/bin/env python3
"""
Promote Sunrise to first-class prayer in lock screen widget rotation.

Removes the two `$0.name != "Sunrise" &&` filters in PrayerData.nextPrayer()
and previousPrayer() so Sunrise is treated the same as the five obligatory
prayers for "what's next" display purposes.

Push notifications are unaffected — server-side scheduler doesn't queue
Sunrise (schema doesn't allow it, by design).
"""
import shutil, sys
from pathlib import Path

CORE = Path.home() / "Downloads/sirat-capacitor-3/ios/App/Sirat Al huda widget/WidgetCore.swift"

if not CORE.exists():
    print(f"Not found: {CORE}")
    sys.exit(1)

text = CORE.read_text()
before = text

# Two surgical replacements — both filter the same way.
text = text.replace(
    '{ $0.name != "Sunrise" && $0.date > t }',
    '{ $0.date > t }'
)
text = text.replace(
    '{ $0.name != "Sunrise" && $0.date <= t }',
    '{ $0.date <= t }'
)

if text == before:
    print("Already patched (or pattern not found — manual edit required).")
    sys.exit(0)

shutil.copy2(CORE, CORE.with_suffix(".swift.bak"))
CORE.write_text(text)
print(f"✓ Patched: {CORE.name} (.bak saved)")
print("  Sunrise will now appear as 'next prayer' on the lock screen when")
print("  it's chronologically the next event.")
print()
print("Build:")
print("  cd ~/Downloads/sirat-capacitor-3 && npm run build && \\")
print("    sed -i '' 's/objectVersion = 70;/objectVersion = 60;/g' \\")
print("    ios/App/App.xcodeproj/project.pbxproj && npx cap sync ios")
