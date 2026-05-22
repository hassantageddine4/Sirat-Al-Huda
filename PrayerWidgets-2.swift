//
//  PrayerWidgets.swift
//  Sirat Al huda widget
//
//  Home screen widgets with native theme configuration via AppIntent.
//  Each widget instance can have its own theme — pick it via
//  long-press → Edit Widget → Theme dropdown.
//

import SwiftUI
import WidgetKit
import AppIntents

// ─── Theme Configuration Intent ───────────────────────────────────────────────

enum ThemeOption: String, AppEnum, CaseIterable {
    case emerald, forest, beige, sandstone, gold, sapphire, royal, crimson, midnight, silver, teal

    static var typeDisplayRepresentation: TypeDisplayRepresentation { "Theme" }
    static var caseDisplayRepresentations: [ThemeOption: DisplayRepresentation] {
        [
            .emerald:   "Emerald",
            .forest:    "Forest",
            .beige:     "Beige",
            .sandstone: "Sandstone",
            .gold:      "Gold & Black",
            .sapphire:  "Sapphire",
            .royal:     "Royal",
            .crimson:   "Crimson",
            .midnight:  "Midnight",
            .silver:    "Silver",
            .teal:      "Teal",
        ]
    }

    var widgetThemeKey: WidgetThemeKey {
        WidgetThemeKey(rawValue: rawValue) ?? .emerald
    }
}

struct WidgetThemeIntent: WidgetConfigurationIntent {
    static var title: LocalizedStringResource = "Sirat Widget"
    static var description = IntentDescription("Choose a color theme.")

    @Parameter(title: "Theme", default: ThemeOption.emerald)
    var theme: ThemeOption

    init() {}
    init(theme: ThemeOption) { self.theme = theme }
}

// ─── Shared timeline entry ────────────────────────────────────────────────────

struct PrayerWidgetEntry: TimelineEntry {
    let date: Date
    let data: PrayerData
    let theme: WidgetTheme
}

// ─── Prayer widget provider (intent-aware) ────────────────────────────────────

struct PrayerWidgetProvider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> PrayerWidgetEntry {
        PrayerWidgetEntry(date: Date(), data: PrayerData.load(), theme: WidgetTheme.of(.emerald))
    }

    func snapshot(for configuration: WidgetThemeIntent, in context: Context) async -> PrayerWidgetEntry {
        let data = PrayerData.load()
        let theme = WidgetTheme.of(configuration.theme.widgetThemeKey)
        return PrayerWidgetEntry(date: Date(), data: data, theme: theme)
    }

    func timeline(for configuration: WidgetThemeIntent, in context: Context) async -> Timeline<PrayerWidgetEntry> {
        let now = Date()
        let data = PrayerData.load()
        let theme = WidgetTheme.of(configuration.theme.widgetThemeKey)

        var entries: [PrayerWidgetEntry] = [
            PrayerWidgetEntry(date: now, data: data, theme: theme)
        ]

        for prayer in data.prayers where prayer.date > now {
            let boundary = prayer.date.addingTimeInterval(1)
            entries.append(PrayerWidgetEntry(date: boundary, data: data, theme: theme))
        }

        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Calendar.current.startOfDay(for: now))
            ?? now.addingTimeInterval(86400)
        return Timeline(entries: entries, policy: .after(tomorrow))
    }
}

// ─── Small / Medium: Next Prayer ──────────────────────────────────────────────

struct NextPrayerWidgetView: View {
    var entry: PrayerWidgetEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        let t = entry.theme
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
            if !entry.data.hasData {
                EmptyWidget(theme: t)
            } else if family == .systemSmall {
                smallLayout(t: t, next: next, progress: progress)
            } else {
                mediumLayout(t: t, next: next, progress: progress)
            }
        }
        .containerBackground(for: .widget) {
            WidgetBackground(theme: t)
        }
    }

    @ViewBuilder
    private func smallLayout(t: WidgetTheme, next: PrayerEntry?, progress: Double) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            SectionLabel(text: "Next Prayer", theme: t)

            if let next = next {
                Text(next.name)
                    .font(.system(size: 22, weight: .semibold, design: .serif))
                    .foregroundColor(t.primaryText)
                    .minimumScaleFactor(0.7)
                    .lineLimit(1)

                Text(next.date, style: .time)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(t.primaryText.opacity(0.85))

                Spacer(minLength: 2)

                HStack(spacing: 6) {
                    ProgressRing(progress: progress, theme: t, lineWidth: 3, size: 14)
                    Text(next.date, style: .relative)
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(t.mutedText)
                        .lineLimit(1)
                }
            } else {
                Text("—")
                    .font(.system(size: 22, weight: .semibold, design: .serif))
                    .foregroundColor(t.primaryText)
                Spacer()
            }

            if !entry.data.hijriDateString.isEmpty {
                Text(entry.data.hijriDateString)
                    .font(.system(size: 9, weight: .medium))
                    .foregroundColor(t.accent)
                    .lineLimit(1)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    @ViewBuilder
    private func mediumLayout(t: WidgetTheme, next: PrayerEntry?, progress: Double) -> some View {
        HStack(spacing: 14) {
            VStack(alignment: .leading, spacing: 6) {
                SectionLabel(text: "Next Prayer", theme: t)

                if let next = next {
                    Text(next.name)
                        .font(.system(size: 28, weight: .semibold, design: .serif))
                        .foregroundColor(t.primaryText)

                    Text(next.date, style: .time)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(t.primaryText.opacity(0.85))

                    Text(next.date, style: .relative)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(t.mutedText)
                }

                Spacer()

                if !entry.data.hijriDateString.isEmpty {
                    Text(entry.data.hijriDateString)
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(t.accent)
                }
            }

            Spacer()

            ZStack {
                ProgressRing(progress: progress, theme: t, lineWidth: 5, size: 80)
                if let next = next {
                    VStack(spacing: 0) {
                        Text(next.date, style: .timer)
                            .font(.system(size: 11, weight: .bold, design: .monospaced))
                            .foregroundColor(t.accent)
                            .multilineTextAlignment(.center)
                    }
                }
            }
            .frame(width: 80, height: 80)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
}

struct NextPrayerWidget: Widget {
    let kind = "NextPrayerWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: WidgetThemeIntent.self, provider: PrayerWidgetProvider()) { entry in
            NextPrayerWidgetView(entry: entry)
        }
        .configurationDisplayName("Next Prayer")
        .description("Your next upcoming prayer with a live countdown.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// ─── Medium: All Prayers ──────────────────────────────────────────────────────

struct DailyPrayersWidgetView: View {
    var entry: PrayerWidgetEntry

    var body: some View {
        let t = entry.theme
        let next = entry.data.nextPrayer(after: entry.date)

        Group {
            if !entry.data.hasData {
                EmptyWidget(theme: t)
            } else {
                HStack(alignment: .top, spacing: 14) {
                    VStack(alignment: .leading, spacing: 4) {
                        SectionLabel(text: "Today's Prayers", theme: t)
                        if !entry.data.hijriDateString.isEmpty {
                            Text(entry.data.hijriDateString)
                                .font(.system(size: 9, weight: .medium))
                                .foregroundColor(t.accent)
                                .padding(.bottom, 2)
                        }
                        VStack(spacing: 4) {
                            ForEach(Array(entry.data.prayers.enumerated()), id: \.offset) { _, p in
                                PrayerRow(
                                    entry: p,
                                    isNext: next?.name == p.name,
                                    isPassed: p.date < entry.date,
                                    theme: t
                                )
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            }
        }
        .containerBackground(for: .widget) {
            WidgetBackground(theme: t)
        }
    }
}

struct DailyPrayersWidget: Widget {
    let kind = "DailyPrayersWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: WidgetThemeIntent.self, provider: PrayerWidgetProvider()) { entry in
            DailyPrayersWidgetView(entry: entry)
        }
        .configurationDisplayName("Today's Prayers")
        .description("All five daily prayers with the next one highlighted.")
        .supportedFamilies([.systemMedium])
    }
}

// ─── Large: Daily Overview + Verse ────────────────────────────────────────────

struct DailyOverviewWidgetView: View {
    var entry: PrayerWidgetEntry

    var body: some View {
        let t = entry.theme
        let next = entry.data.nextPrayer(after: entry.date)
        let verse = VerseBank.today()

        Group {
            if !entry.data.hasData {
                EmptyWidget(theme: t)
            } else {
                VStack(alignment: .leading, spacing: 10) {
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 2) {
                            SectionLabel(text: "Sirat Al Huda", theme: t)
                            if let n = next {
                                Text("Next: \(n.name)")
                                    .font(.system(size: 16, weight: .semibold, design: .serif))
                                    .foregroundColor(t.primaryText)
                                Text(n.date, style: .time)
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(t.accent)
                            }
                        }
                        Spacer()
                        if !entry.data.hijriDateString.isEmpty {
                            Text(entry.data.hijriDateString)
                                .font(.system(size: 9, weight: .medium))
                                .foregroundColor(t.mutedText)
                        }
                    }

                    Divider().background(t.accent.opacity(0.18))

                    VStack(spacing: 5) {
                        ForEach(Array(entry.data.prayers.enumerated()), id: \.offset) { _, p in
                            PrayerRow(
                                entry: p,
                                isNext: next?.name == p.name,
                                isPassed: p.date < entry.date,
                                theme: t
                            )
                        }
                    }

                    Divider().background(t.accent.opacity(0.18))

                    VerseView(verse: verse, theme: t)

                    Spacer(minLength: 0)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            }
        }
        .containerBackground(for: .widget) {
            WidgetBackground(theme: t)
        }
    }
}

struct DailyOverviewWidget: Widget {
    let kind = "DailyOverviewWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: WidgetThemeIntent.self, provider: PrayerWidgetProvider()) { entry in
            DailyOverviewWidgetView(entry: entry)
        }
        .configurationDisplayName("Daily Overview")
        .description("Full day of prayers with a daily Quran reflection.")
        .supportedFamilies([.systemLarge])
    }
}

// ─── Daily Verse Home Widget (Medium) ─────────────────────────────────────────

struct DailyVerseHomeEntry: TimelineEntry {
    let date: Date
    let verse: Verse
    let theme: WidgetTheme
}

struct DailyVerseHomeProvider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> DailyVerseHomeEntry {
        DailyVerseHomeEntry(date: Date(), verse: VerseBank.today(), theme: WidgetTheme.of(.emerald))
    }

    func snapshot(for configuration: WidgetThemeIntent, in context: Context) async -> DailyVerseHomeEntry {
        DailyVerseHomeEntry(date: Date(), verse: VerseBank.today(),
                             theme: WidgetTheme.of(configuration.theme.widgetThemeKey))
    }

    func timeline(for configuration: WidgetThemeIntent, in context: Context) async -> Timeline<DailyVerseHomeEntry> {
        let now = Date()
        let entry = DailyVerseHomeEntry(date: now, verse: VerseBank.today(),
                                         theme: WidgetTheme.of(configuration.theme.widgetThemeKey))
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1,
                                              to: Calendar.current.startOfDay(for: now))
            ?? now.addingTimeInterval(86400)
        return Timeline(entries: [entry], policy: .after(tomorrow))
    }
}

struct DailyVerseHomeView: View {
    var entry: DailyVerseHomeEntry

    var body: some View {
        let t = entry.theme
        let v = entry.verse

        VStack(alignment: .leading, spacing: 8) {
            SectionLabel(text: "Daily Verse", theme: t)

            Text(v.arabic)
                .font(.system(size: 22, weight: .medium))
                .foregroundColor(t.primaryText)
                .multilineTextAlignment(.trailing)
                .frame(maxWidth: .infinity, alignment: .trailing)
                .lineLimit(2)
                .minimumScaleFactor(0.7)

            Spacer(minLength: 0)

            Text(v.english)
                .font(.system(size: 13, weight: .regular))
                .italic()
                .foregroundColor(t.primaryText.opacity(0.85))
                .multilineTextAlignment(.leading)
                .frame(maxWidth: .infinity, alignment: .leading)
                .lineLimit(2)
                .minimumScaleFactor(0.85)

            Text(v.reference)
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(t.accent)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .containerBackground(for: .widget) {
            WidgetBackground(theme: t)
        }
    }
}

struct DailyVerseHomeWidget: Widget {
    let kind = "DailyVerseHomeWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: WidgetThemeIntent.self, provider: DailyVerseHomeProvider()) { entry in
            DailyVerseHomeView(entry: entry)
        }
        .configurationDisplayName("Daily Verse")
        .description("A daily Qur'an reflection on your Home Screen.")
        .supportedFamilies([.systemMedium])
    }
}
