#!/usr/bin/env python3
"""
1. Remove the extra sunrise/sunset row from the lock screen rectangular view
2. Verify Sunrise is in the prayer rotation by inspecting WidgetCore.swift's
   PrayerData.load() — print warning if not.
"""
import pathlib, sys, re

ROOT = pathlib.Path.home() / "Downloads/sirat-capacitor-3"
LSW = ROOT / "ios/App/Sirat Al huda widget/LockScreenWidgets.swift"
WC = ROOT / "ios/App/Sirat Al huda widget/WidgetCore.swift"

# ─── 1. Remove sunrise/sunset row from rectangular view ────────────────────
src = LSW.read_text()

OLD = '''    @ViewBuilder
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
    print("✓ Removed sunrise/sunset row — lock widget back to original countdown layout")
else:
    print("⚠ Could not find sunrise/sunset row to remove", file=sys.stderr)

# ─── 2. Verify Sunrise is in prayers array ────────────────────────────────
wc_src = WC.read_text()
if '"Sunrise"' in wc_src:
    print("✓ Sunrise is already a named prayer entry — countdown will include it")
else:
    print("⚠ 'Sunrise' not found in WidgetCore.swift — may need separate fix", file=sys.stderr)

# Check iconForPrayer in LockScreenWidgets has Sunrise mapping
new_src = LSW.read_text()
if "Sunrise" not in new_src or "sunrise.fill" not in new_src:
    print("⚠ iconForPrayer may not map Sunrise — verify in code", file=sys.stderr)
else:
    print("✓ iconForPrayer maps Sunrise → sunrise.fill icon")
