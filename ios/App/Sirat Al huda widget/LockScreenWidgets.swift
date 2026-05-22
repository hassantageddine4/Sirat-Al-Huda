//
//  LockScreenWidgets.swift
//  Sirat Al huda widget
//
//  Lock screen widgets (accessoryInline, accessoryCircular, accessoryRectangular).
//  These adopt the system's tint and ignore custom colors per Apple's HIG.
//

import SwiftUI
import WidgetKit
import AppIntents

// ─── Combined entry view that picks layout from widgetFamily ──────────────────

struct LockScreenView: View {
    var entry: PrayerWidgetEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        let next = entry.data.nextPrayer(after: entry.date)
        let prev = entry.data.previousPrayer(before: entry.date)
        let progress: Double = {
            guard let next = next else { return 0 }
            let start = prev?.date ?? Calendar.current.startOfDay(for: entry.date)
            let total = next.date.timeIntervalSince(start)
            let done = entry.date.timeIntervalSince(start)
            return total > 0 ? max(0, min(1, done / total)) : 0
        }()

        Group {
            switch family {
            case .accessoryInline:
                inlineView(next: next)
            case .accessoryCircular:
                circularView(next: next, progress: progress)
            case .accessoryRectangular:
                rectangularView(next: next, progress: progress)
            default:
                EmptyView()
            }
        }
        .containerBackground(for: .widget) { Color.clear }
    }

    @ViewBuilder
    private func inlineView(next: PrayerEntry?) -> some View {
        if let n = next {
            // One-line: "Fajr in 1h 12m"
            Text("\(n.name) ") + Text(n.date, style: .relative)
        } else {
            Text("Open Sirat to load times")
        }
    }

    @ViewBuilder
    private func circularView(next: PrayerEntry?, progress: Double) -> some View {
        ZStack {
            // Use system AccessoryCircularStyle so it respects lock-screen tint
            Circle()
                .stroke(Color.white.opacity(0.18), lineWidth: 3)
            Circle()
                .trim(from: 0, to: max(0.001, min(1, progress)))
                .stroke(style: StrokeStyle(lineWidth: 3, lineCap: .round))
                .rotationEffect(.degrees(-90))

            VStack(spacing: 0) {
                if let n = next {
                    Text(n.name.prefix(3).uppercased())
                        .font(.system(size: 10, weight: .bold))
                    Text(n.date, style: .time)
                        .font(.system(size: 9, weight: .medium))
                } else {
                    Text("—")
                        .font(.system(size: 12, weight: .bold))
                }
            }
        }
    }

    @ViewBuilder
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
    }
}

// ─── Widget registration (one widget, three families) ─────────────────────────

struct LockScreenPrayerWidget: Widget {
    let kind = "LockScreenPrayerWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: WidgetThemeIntent.self, provider: PrayerWidgetProvider()) { entry in
            LockScreenView(entry: entry)
        }
        .configurationDisplayName("Sirat Lock Screen")
        .description("Next prayer on your Lock Screen.")
        .supportedFamilies([.accessoryInline, .accessoryCircular, .accessoryRectangular])
    }
}


// ─── Daily Verse Lock Screen Widget ────────────────────────────────────────

struct DailyVerseLockEntry: TimelineEntry {
    let date: Date
    let verse: Verse
}

struct DailyVerseLockProvider: TimelineProvider {
    func placeholder(in context: Context) -> DailyVerseLockEntry {
        DailyVerseLockEntry(date: Date(), verse: VerseBank.todayLong())
    }
    func getSnapshot(in context: Context, completion: @escaping (DailyVerseLockEntry) -> Void) {
        completion(DailyVerseLockEntry(date: Date(), verse: VerseBank.todayLong()))
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<DailyVerseLockEntry>) -> Void) {
        let now = Date()
        let entry = DailyVerseLockEntry(date: now, verse: VerseBank.todayLong())
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Calendar.current.startOfDay(for: now)) ?? now.addingTimeInterval(86400)
        completion(Timeline(entries: [entry], policy: .after(tomorrow)))
    }
}

struct DailyVerseLockView: View {
    var entry: DailyVerseLockEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        Group {
            switch family {
            case .accessoryRectangular:
                Text(entry.verse.english)
                    .font(.system(size: 16, weight: .semibold))
                    .lineLimit(3)
                    .minimumScaleFactor(0.6)
                    .multilineTextAlignment(.leading)
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            case .accessoryInline:
                Text("\(entry.verse.english) — \(entry.verse.reference)")
            default:
                EmptyView()
            }
        }
        .containerBackground(for: .widget) { Color.clear }
    }
}

struct DailyVerseLockWidget: Widget {
    let kind = "DailyVerseLockWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: DailyVerseLockProvider()) { entry in
            DailyVerseLockView(entry: entry)
        }
        .configurationDisplayName("Daily Verse")
        .description("A Qur\u{2019}an reflection on your Lock Screen.")
        .supportedFamilies([.accessoryRectangular, .accessoryInline])
    }
}


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
    IslamicEvent(hijriDay: 27, hijriMonth: 7,  name: "Isra & Mi\u{2019}raj"),
    IslamicEvent(hijriDay: 15, hijriMonth: 8,  name: "Laylat al-Bara\u{2019}ah"),
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
    @Environment(\.widgetFamily) var family

    private var dateText: String {
        let df = DateFormatter()
        df.dateFormat = "MMM d"
        return df.string(from: entry.eventDate)
    }

    private var countdownText: String {
        switch entry.daysUntil {
        case 0:  return "Today"
        case 1:  return "Tomorrow"
        default: return "in \(entry.daysUntil) days"
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
                Text("\(entry.eventName) — \(countdownText)")
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
