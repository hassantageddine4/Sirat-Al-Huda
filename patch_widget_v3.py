#!/usr/bin/env python3
"""
- Bumps text sizes in the rectangular lock screen prayer widget.
- Switches countdown from "1 hr 28 min" to live HH:MM:SS timer.
- Adds a new Islamic Event lock screen widget showing the next upcoming event.
"""
import pathlib, sys

BASE = pathlib.Path.home() / "Downloads/sirat-capacitor-3/ios/App/Sirat Al huda widget"
LSW = BASE / "LockScreenWidgets.swift"
BUNDLE = BASE / "Sirat_Al_huda_widgetBundle.swift"

for p in (LSW, BUNDLE):
    if not p.exists():
        print(f"ERROR: {p} not found", file=sys.stderr)
        sys.exit(1)

src = LSW.read_text()

# ─── 1. Replace rectangularView with bigger text + .timer countdown ────────
OLD_RECT = '''    @ViewBuilder
    private func rectangularView(next: PrayerEntry?, progress: Double) -> some View {
        VStack(alignment: .leading, spacing: 1) {
            Text("Next Prayer")
                .font(.system(size: 9, weight: .bold))
                .tracking(1.0)
                .widgetAccentable()
            if let n = next {
                Text(n.name)
                    .font(.system(size: 16, weight: .semibold))
                Text(n.date, style: .time)
                    .font(.system(size: 11, weight: .medium))
                    .widgetAccentable()
                Text(n.date, style: .relative)
                    .font(.system(size: 10, weight: .medium))
            } else {
                Text("Open app")
                    .font(.system(size: 12))
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }'''

NEW_RECT = '''    @ViewBuilder
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

if OLD_RECT in src:
    src = src.replace(OLD_RECT, NEW_RECT, 1)
    print("✓ Updated rectangular prayer widget (bigger text + live timer)")
else:
    print("⚠ rectangularView pattern not matched — already updated?", file=sys.stderr)

# ─── 2. Append Islamic Event widget ────────────────────────────────────────
ISLAMIC_BLOCK = '''

// ─── Islamic Event Lock Screen Widget ──────────────────────────────────────

struct IslamicEvent {
    let hijriDay: Int
    let hijriMonth: Int
    let name: String
}

let ISLAMIC_EVENTS: [IslamicEvent] = [
    IslamicEvent(hijriDay: 1,  hijriMonth: 1,  name: "Islamic New Year"),
    IslamicEvent(hijriDay: 10, hijriMonth: 1,  name: "Day of Ashura"),
    IslamicEvent(hijriDay: 12, hijriMonth: 3,  name: "Mawlid an-Nabi"),
    IslamicEvent(hijriDay: 27, hijriMonth: 7,  name: "Isra & Mi\\u{2019}raj"),
    IslamicEvent(hijriDay: 15, hijriMonth: 8,  name: "Laylat al-Bara\\u{2019}ah"),
    IslamicEvent(hijriDay: 1,  hijriMonth: 9,  name: "Ramadan Begins"),
    IslamicEvent(hijriDay: 27, hijriMonth: 9,  name: "Laylat al-Qadr"),
    IslamicEvent(hijriDay: 1,  hijriMonth: 10, name: "Eid al-Fitr"),
    IslamicEvent(hijriDay: 9,  hijriMonth: 12, name: "Day of Arafah"),
    IslamicEvent(hijriDay: 10, hijriMonth: 12, name: "Eid al-Adha"),
]

func nextIslamicEvent(from date: Date) -> (event: IslamicEvent, gregorian: Date, daysUntil: Int)? {
    var islamic = Calendar(identifier: .islamicUmmAlQura)
    islamic.timeZone = TimeZone.current
    let comps = islamic.dateComponents([.year], from: date)
    guard let currentYear = comps.year else { return nil }

    var candidates: [(IslamicEvent, Date)] = []
    for year in [currentYear, currentYear + 1] {
        for e in ISLAMIC_EVENTS {
            var hc = DateComponents()
            hc.day = e.hijriDay
            hc.month = e.hijriMonth
            hc.year = year
            if let greg = islamic.date(from: hc), greg > date {
                candidates.append((e, greg))
            }
        }
    }
    candidates.sort { $0.1 < $1.1 }
    guard let next = candidates.first else { return nil }
    let daysUntil = Calendar.current.dateComponents([.day], from: Calendar.current.startOfDay(for: date),
                                                    to: Calendar.current.startOfDay(for: next.1)).day ?? 0
    return (next.0, next.1, daysUntil)
}

struct IslamicEventLockEntry: TimelineEntry {
    let date: Date
    let eventName: String
    let eventDate: Date
    let daysUntil: Int
}

struct IslamicEventLockProvider: TimelineProvider {
    func placeholder(in context: Context) -> IslamicEventLockEntry {
        IslamicEventLockEntry(date: Date(), eventName: "Ramadan Begins",
                              eventDate: Date().addingTimeInterval(86400 * 30), daysUntil: 30)
    }
    func getSnapshot(in context: Context, completion: @escaping (IslamicEventLockEntry) -> Void) {
        let now = Date()
        if let n = nextIslamicEvent(from: now) {
            completion(IslamicEventLockEntry(date: now, eventName: n.event.name,
                                              eventDate: n.gregorian, daysUntil: n.daysUntil))
        } else {
            completion(IslamicEventLockEntry(date: now, eventName: "—", eventDate: now, daysUntil: 0))
        }
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<IslamicEventLockEntry>) -> Void) {
        let now = Date()
        let entry: IslamicEventLockEntry
        if let n = nextIslamicEvent(from: now) {
            entry = IslamicEventLockEntry(date: now, eventName: n.event.name,
                                          eventDate: n.gregorian, daysUntil: n.daysUntil)
        } else {
            entry = IslamicEventLockEntry(date: now, eventName: "—", eventDate: now, daysUntil: 0)
        }
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Calendar.current.startOfDay(for: now))
            ?? now.addingTimeInterval(86400)
        completion(Timeline(entries: [entry], policy: .after(tomorrow)))
    }
}

struct IslamicEventLockView: View {
    var entry: IslamicEventLockEntry
    @Environment(\\.widgetFamily) var family

    private var dateText: String {
        let df = DateFormatter()
        df.dateFormat = "MMM d"
        return df.string(from: entry.eventDate)
    }

    private var countdownText: String {
        switch entry.daysUntil {
        case 0:  return "Today"
        case 1:  return "Tomorrow"
        default: return "in \\(entry.daysUntil) days"
        }
    }

    var body: some View {
        Group {
            switch family {
            case .accessoryRectangular:
                VStack(alignment: .leading, spacing: 2) {
                    Text("NEXT EVENT")
                        .font(.system(size: 9, weight: .bold))
                        .tracking(1.2)
                        .widgetAccentable()
                    Text(entry.eventName)
                        .font(.system(size: 17, weight: .bold))
                        .lineLimit(1)
                        .minimumScaleFactor(0.7)
                    Text(dateText)
                        .font(.system(size: 13, weight: .semibold))
                        .widgetAccentable()
                    Text(countdownText)
                        .font(.system(size: 12, weight: .medium))
                        .lineLimit(1)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            case .accessoryInline:
                Text("\\(entry.eventName) — \\(countdownText)")
            default:
                EmptyView()
            }
        }
        .containerBackground(for: .widget) { Color.clear }
    }
}

struct IslamicEventLockWidget: Widget {
    let kind = "IslamicEventLockWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: IslamicEventLockProvider()) { entry in
            IslamicEventLockView(entry: entry)
        }
        .configurationDisplayName("Next Islamic Event")
        .description("Countdown to the next upcoming Islamic event.")
        .supportedFamilies([.accessoryRectangular, .accessoryInline])
    }
}
'''

if "IslamicEventLockWidget" not in src:
    src = src + ISLAMIC_BLOCK
    print("✓ Added Islamic Event lock widget")
else:
    print("○ Islamic Event widget already present")

LSW.write_text(src)

# ─── 3. Register in bundle ─────────────────────────────────────────────────
b = BUNDLE.read_text()
if "IslamicEventLockWidget()" not in b:
    b = b.replace(
        "DailyVerseLockWidget()",
        "DailyVerseLockWidget()\n        IslamicEventLockWidget()",
        1
    )
    BUNDLE.write_text(b)
    print("✓ Registered IslamicEventLockWidget in bundle")
else:
    print("○ Already registered")
