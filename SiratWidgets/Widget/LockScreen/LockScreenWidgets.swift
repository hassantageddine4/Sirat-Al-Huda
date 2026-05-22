//
//  LockScreenWidgets.swift
//  Sirat Al Huda — Widget
//
//  Lock screen complications. iOS renders these monochrome and clipped to
//  small shapes, so we lean on `widgetAccentable()` for the gold accents
//  and accessoryWidgetBackground() for the circular tint.
//

import SwiftUI
import WidgetKit

// ─── Inline ─────────────────────────────────────────────────────────────────
// One-liner above the time on the lock screen.

struct InlinePrayerView: View {
    let entry: SiratEntry

    var body: some View {
        let next = entry.data.nextPrayer(relativeTo: entry.date)
        // Inline rejects most styling; keep it simple and informative.
        ViewThatFits {
            HStack(spacing: 4) {
                Image(systemName: next.name.symbol)
                Text("\(next.name.displayName) ")
                Text(next.time, style: .time)
            }
            HStack(spacing: 4) {
                Text(next.name.displayName)
                Text(next.time, style: .time)
            }
        }
    }
}

struct InlinePrayerWidget: Widget {
    let kind = "InlinePrayerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerTimelineProvider()) { entry in
            InlinePrayerView(entry: entry)
                .containerBackground(for: .widget) { Color.clear }
        }
        .configurationDisplayName("Next Prayer (Inline)")
        .description("Next prayer name and time above the lock screen clock.")
        .supportedFamilies([.accessoryInline])
    }
}

// ─── Circular ───────────────────────────────────────────────────────────────
// Tiny round complication — countdown ring + name.

struct CircularPrayerView: View {
    let entry: SiratEntry

    var body: some View {
        let next = entry.data.nextPrayer(relativeTo: entry.date)
        let progress = entry.data.progressToNext(relativeTo: entry.date)

        ZStack {
            // Background ring (track)
            Circle()
                .stroke(.tertiary, lineWidth: 3)

            // Progress arc
            Circle()
                .trim(from: 0, to: max(progress, 0.001))
                .stroke(.primary, style: StrokeStyle(lineWidth: 3, lineCap: .round))
                .rotationEffect(.degrees(-90))
                .widgetAccentable()

            VStack(spacing: 0) {
                Image(systemName: next.name.symbol)
                    .font(.system(size: 10))
                    .widgetAccentable()
                Text(next.name.displayName.prefix(4))
                    .font(.system(size: 9, weight: .semibold))
                    .lineLimit(1)
            }
        }
        .containerBackground(for: .widget) { Color.clear }
    }
}

struct CircularPrayerWidget: Widget {
    let kind = "CircularPrayerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerTimelineProvider()) { entry in
            CircularPrayerView(entry: entry)
        }
        .configurationDisplayName("Next Prayer (Circular)")
        .description("Compact ring showing the next prayer.")
        .supportedFamilies([.accessoryCircular])
    }
}

// ─── Rectangular ────────────────────────────────────────────────────────────
// Wider lock-screen complication — name, time, countdown.

struct RectangularPrayerView: View {
    let entry: SiratEntry

    var body: some View {
        let next = entry.data.nextPrayer(relativeTo: entry.date)

        VStack(alignment: .leading, spacing: 1) {
            HStack(spacing: 4) {
                Image(systemName: next.name.symbol)
                    .widgetAccentable()
                Text(next.name.displayName)
                    .font(.system(size: 14, weight: .semibold, design: .serif))
            }
            Text(next.time, style: .time)
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .widgetAccentable()
            Text(timerInterval: entry.date...max(next.time, entry.date.addingTimeInterval(1)),
                 countsDown: true)
                .font(.system(size: 11, weight: .regular, design: .rounded))
                .foregroundStyle(.secondary)
        }
        .containerBackground(for: .widget) { Color.clear }
    }
}

struct RectangularPrayerWidget: Widget {
    let kind = "RectangularPrayerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerTimelineProvider()) { entry in
            RectangularPrayerView(entry: entry)
        }
        .configurationDisplayName("Next Prayer (Rectangular)")
        .description("Next prayer with countdown.")
        .supportedFamilies([.accessoryRectangular])
    }
}
