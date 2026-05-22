#!/usr/bin/env python3
"""
Replaces the rectangular lock-screen prayer widget with a 2-column, 3-row
grid showing all 6 daily times (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha)
— Shia+ style.
"""
import pathlib, sys

LSW = pathlib.Path.home() / "Downloads/sirat-capacitor-3/ios/App/Sirat Al huda widget/LockScreenWidgets.swift"
if not LSW.exists():
    print(f"ERROR: {LSW} not found", file=sys.stderr); sys.exit(1)

src = LSW.read_text()

OLD = '''    @ViewBuilder
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

NEW = '''    @ViewBuilder
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

if OLD in src:
    src = src.replace(OLD, NEW, 1)
    LSW.write_text(src)
    print("✓ Lock screen prayer widget now shows 6-time grid (Shia+ style)")
else:
    print("⚠ rectangularView pattern not matched", file=sys.stderr)
    sys.exit(1)
