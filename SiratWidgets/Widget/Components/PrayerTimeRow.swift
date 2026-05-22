//
//  PrayerTimeRow.swift
//  Sirat Al Huda — Widget
//
//  The vertical "name / icon / time / am-pm" cell used in the bottom strip
//  of the Medium and Large widgets. Mirrors the reference image layout.
//

import SwiftUI

struct PrayerTimeCell: View {
    @Environment(\.themePalette) private var palette

    let entry: PrayerEntry
    let isHighlighted: Bool
    var compact: Bool = false

    private var timeFormatter: DateFormatter {
        let f = DateFormatter()
        f.dateFormat = "h:mm"
        return f
    }
    private var amPmFormatter: DateFormatter {
        let f = DateFormatter()
        f.dateFormat = "a"
        return f
    }

    var body: some View {
        ZStack {
            GlassCard(isHighlighted: isHighlighted)

            VStack(spacing: compact ? 4 : 6) {
                Text(entry.name.displayName)
                    .font(SiratFont.label(compact ? 10 : 11, weight: .medium))
                    .foregroundStyle(palette.primaryText)

                Image(systemName: entry.name.symbol)
                    .symbolRenderingMode(.palette)
                    .foregroundStyle(palette.accent, palette.accent.opacity(0.7))
                    .font(.system(size: compact ? 14 : 16, weight: .regular))

                Text(timeFormatter.string(from: entry.time))
                    .font(SiratFont.numeric(compact ? 13 : 15, weight: .semibold))
                    .foregroundStyle(palette.primaryText)

                Text(amPmFormatter.string(from: entry.time))
                    .font(SiratFont.label(compact ? 8 : 9, weight: .medium))
                    .tracking(1)
                    .foregroundStyle(palette.secondaryText)
            }
            .padding(.vertical, compact ? 6 : 8)
            .padding(.horizontal, 4)
        }
    }
}
