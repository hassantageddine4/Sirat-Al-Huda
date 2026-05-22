//
//  LockScreenWidgets.swift
//  Sirat Al huda widget
//
//  Lock screen widgets (accessoryInline, accessoryCircular, accessoryRectangular).
//  These adopt the system's tint and ignore custom colors per Apple's HIG.
//

import SwiftUI
import WidgetKit

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
    }
}

// ─── Widget registration (one widget, three families) ─────────────────────────

struct LockScreenPrayerWidget: Widget {
    let kind = "LockScreenPrayerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerWidgetProvider()) { entry in
            LockScreenView(entry: entry)
        }
        .configurationDisplayName("Sirat Lock Screen")
        .description("Next prayer on your Lock Screen.")
        .supportedFamilies([.accessoryInline, .accessoryCircular, .accessoryRectangular])
    }
}
