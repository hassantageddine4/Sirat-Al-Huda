#!/usr/bin/env python3
"""
Bumps lock screen prayer widget fonts to the maximum that fits in iOS's
fixed rectangular slot (~160x76pt). Adds minimumScaleFactor to safely
auto-shrink if any line overflows.
"""
import pathlib, sys

LSW = pathlib.Path.home() / "Downloads/sirat-capacitor-3/ios/App/Sirat Al huda widget/LockScreenWidgets.swift"
if not LSW.exists():
    print(f"ERROR: {LSW} not found", file=sys.stderr); sys.exit(1)

src = LSW.read_text()

OLD = '''    @ViewBuilder
    private func rectangularView(next: PrayerEntry?, progress: Double) -> some View {
        VStack(alignment: .leading, spacing: 1) {
            if let n = next {
                HStack(spacing: 4) {
                    Image(systemName: iconForPrayer(n.name))
                        .font(.system(size: 13, weight: .semibold))
                        .widgetAccentable()
                    Text(n.name)
                        .font(.system(size: 17, weight: .semibold))
                        .lineLimit(1)
                }
                Text(n.date, style: .time)
                    .font(.system(size: 14, weight: .regular))
                Text(n.date, style: .timer)
                    .font(.system(size: 13, weight: .regular, design: .monospaced))
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)
            } else {
                Text("Open app")
                    .font(.system(size: 12))
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }'''

NEW = '''    @ViewBuilder
    private func rectangularView(next: PrayerEntry?, progress: Double) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            if let n = next {
                HStack(spacing: 5) {
                    Image(systemName: iconForPrayer(n.name))
                        .font(.system(size: 17, weight: .semibold))
                        .widgetAccentable()
                    Text(n.name)
                        .font(.system(size: 22, weight: .bold))
                        .lineLimit(1)
                        .minimumScaleFactor(0.7)
                }
                Text(n.date, style: .time)
                    .font(.system(size: 18, weight: .semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)
                Text(n.date, style: .timer)
                    .font(.system(size: 16, weight: .medium, design: .monospaced))
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)
            } else {
                Text("Open app")
                    .font(.system(size: 14))
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }'''

if OLD in src:
    src = src.replace(OLD, NEW, 1)
    LSW.write_text(src)
    print("✓ Bumped lock screen rectangular widget fonts (max size)")
else:
    print("⚠ pattern not found — was v4 applied?", file=sys.stderr); sys.exit(1)
