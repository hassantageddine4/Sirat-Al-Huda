#!/usr/bin/env python3
"""
Rewrites the rectangular lock screen prayer widget to match the iOS reference
screenshot exactly: icon + prayer name (line 1), time (line 2), live timer (line 3).
Drops the "NEXT PRAYER" header label entirely.
"""
import pathlib, sys

LSW = pathlib.Path.home() / "Downloads/sirat-capacitor-3/ios/App/Sirat Al huda widget/LockScreenWidgets.swift"
if not LSW.exists():
    print(f"ERROR: {LSW} not found", file=sys.stderr); sys.exit(1)

src = LSW.read_text()

OLD = '''    @ViewBuilder
    private func rectangularView(next: PrayerEntry?, progress: Double) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text("NEXT PRAYER")
                .font(.system(size: 9, weight: .bold))
                .tracking(1.2)
                .widgetAccentable()
            if let n = next {
                Text(n.name)
                    .font(.system(size: 19, weight: .bold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)
                Text(n.date, style: .time)
                    .font(.system(size: 13, weight: .semibold))
                    .widgetAccentable()
                Text(n.date, style: .timer)
                    .font(.system(size: 12, weight: .medium, design: .monospaced))
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
    }

    private func iconForPrayer(_ name: String) -> String {
        switch name {
        case "Fajr":    return "moon.stars.fill"
        case "Sunrise": return "sunrise.fill"
        case "Dhuhr":   return "sun.max.fill"
        case "Asr":     return "sun.min.fill"
        case "Maghrib": return "sunset.fill"
        case "Isha":    return "moon.fill"
        default:        return "moon.stars.fill"
        }
    }'''

if OLD in src:
    src = src.replace(OLD, NEW, 1)
    LSW.write_text(src)
    print("✓ Patched rectangular lock widget to match reference")
else:
    print("⚠ Pattern not found — may already be patched or v3 wasn't applied", file=sys.stderr)
    sys.exit(1)
