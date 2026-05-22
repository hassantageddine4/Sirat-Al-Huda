//
//  WidgetComponents.swift
//  Sirat Al huda widget
//
//  Reusable visual primitives shared across widget sizes.
//

import SwiftUI
import WidgetKit

// ─── Background ───────────────────────────────────────────────────────────────

struct WidgetBackground: View {
    let theme: WidgetTheme

    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [theme.bgTop, theme.bgBottom]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            // Soft radial glow in the corner — adds depth
            RadialGradient(
                gradient: Gradient(colors: [
                    theme.accent.opacity(0.18),
                    Color.clear
                ]),
                center: .topTrailing,
                startRadius: 0,
                endRadius: 180
            )
            .blendMode(.plusLighter)
        }
    }
}

// ─── Glass card ───────────────────────────────────────────────────────────────

struct GlassCard<Content: View>: View {
    let theme: WidgetTheme
    let content: Content
    init(theme: WidgetTheme, @ViewBuilder content: () -> Content) {
        self.theme = theme
        self.content = content()
    }

    var body: some View {
        content
            .background(
                RoundedRectangle(cornerRadius: 14)
                    .fill(theme.glassFill)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(theme.glassStroke, lineWidth: 0.6)
            )
    }
}

// ─── Section label ────────────────────────────────────────────────────────────

struct SectionLabel: View {
    let text: String
    let theme: WidgetTheme

    var body: some View {
        Text(text.uppercased())
            .font(.system(size: 9, weight: .bold))
            .tracking(1.5)
            .foregroundColor(theme.accentSoft)
    }
}

// ─── Progress ring ────────────────────────────────────────────────────────────

struct ProgressRing: View {
    let progress: Double          // 0...1
    let theme: WidgetTheme
    var lineWidth: CGFloat = 4
    var size: CGFloat = 48

    var body: some View {
        ZStack {
            Circle()
                .stroke(theme.accent.opacity(0.18), lineWidth: lineWidth)
            Circle()
                .trim(from: 0, to: min(1, max(0, progress)))
                .stroke(
                    AngularGradient(
                        gradient: Gradient(colors: [theme.accent, theme.accentSoft]),
                        center: .center
                    ),
                    style: StrokeStyle(lineWidth: lineWidth, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))
        }
        .frame(width: size, height: size)
    }
}

// ─── Verse view ───────────────────────────────────────────────────────────────

struct VerseView: View {
    let verse: Verse
    let theme: WidgetTheme
    var compact: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: compact ? 4 : 6) {
            Text(verse.arabic)
                .font(.system(size: compact ? 13 : 15, weight: .medium))
                .foregroundColor(theme.primaryText)
                .multilineTextAlignment(.trailing)
                .frame(maxWidth: .infinity, alignment: .trailing)
                .lineLimit(2)

            Text(verse.english)
                .font(.system(size: compact ? 10 : 11, weight: .regular))
                .italic()
                .foregroundColor(theme.mutedText)
                .lineLimit(2)

            Text(verse.reference)
                .font(.system(size: 9, weight: .semibold))
                .foregroundColor(theme.accent)
        }
    }
}

// ─── Prayer row (medium/large) ────────────────────────────────────────────────

struct PrayerRow: View {
    let entry: PrayerEntry
    let isNext: Bool
    let isPassed: Bool
    let theme: WidgetTheme

    var body: some View {
        HStack {
            // Dot indicator
            Circle()
                .fill(isNext ? theme.accent : (isPassed ? theme.mutedText.opacity(0.4) : theme.primaryText.opacity(0.5)))
                .frame(width: 5, height: 5)

            Text(entry.name)
                .font(.system(size: 11, weight: isNext ? .bold : .medium))
                .foregroundColor(isNext ? theme.accent : (isPassed ? theme.mutedText : theme.primaryText.opacity(0.85)))

            Spacer()

            Text(entry.date, style: .time)
                .font(.system(size: 11, weight: isNext ? .bold : .medium))
                .foregroundColor(isNext ? theme.accent : (isPassed ? theme.mutedText : theme.primaryText.opacity(0.85)))
        }
    }
}

// ─── Pill (branch label) ──────────────────────────────────────────────────────

struct BranchPill: View {
    let text: String
    let theme: WidgetTheme

    var body: some View {
        Text(text.uppercased())
            .font(.system(size: 8, weight: .heavy))
            .tracking(1.2)
            .foregroundColor(theme.accent)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(
                Capsule().fill(theme.accent.opacity(0.15))
            )
            .overlay(
                Capsule().stroke(theme.accent.opacity(0.3), lineWidth: 0.6)
            )
    }
}

// ─── No-data placeholder ──────────────────────────────────────────────────────

struct EmptyWidget: View {
    let theme: WidgetTheme

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            SectionLabel(text: "Sirat Al Huda", theme: theme)
            Text("Open the app\nto load prayer times")
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(theme.mutedText)
                .lineSpacing(2)
            Spacer()
        }
    }
}
