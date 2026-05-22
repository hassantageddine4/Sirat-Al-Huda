#!/usr/bin/env python3
"""
Bumps the Daily Verse lock screen widget fonts so the Qur'an text is
as prominent as the prayer widget's text.
"""
import pathlib, sys

LSW = pathlib.Path.home() / "Downloads/sirat-capacitor-3/ios/App/Sirat Al huda widget/LockScreenWidgets.swift"
if not LSW.exists():
    print(f"ERROR: {LSW} not found", file=sys.stderr); sys.exit(1)

src = LSW.read_text()

OLD = '''            case .accessoryRectangular:
                VStack(alignment: .leading, spacing: 1) {
                    Text(entry.verse.english)
                        .font(.system(size: 12, weight: .medium))
                        .lineLimit(3)
                        .minimumScaleFactor(0.85)
                        .multilineTextAlignment(.leading)
                    Text(entry.verse.reference)
                        .font(.system(size: 9, weight: .bold))
                        .widgetAccentable()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)'''

NEW = '''            case .accessoryRectangular:
                VStack(alignment: .leading, spacing: 2) {
                    Text(entry.verse.english)
                        .font(.system(size: 15, weight: .semibold))
                        .lineLimit(3)
                        .minimumScaleFactor(0.6)
                        .multilineTextAlignment(.leading)
                    Text(entry.verse.reference)
                        .font(.system(size: 12, weight: .bold))
                        .widgetAccentable()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)'''

if OLD in src:
    src = src.replace(OLD, NEW, 1)
    LSW.write_text(src)
    print("✓ Bumped Daily Verse lock widget fonts")
else:
    print("⚠ pattern not found — was v2 applied?", file=sys.stderr); sys.exit(1)
