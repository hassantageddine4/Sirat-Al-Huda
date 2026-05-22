//
//  ThemeManager.swift
//  Sirat Al Huda — Shared
//
//  Nine premium themes. Each defines the gradient, glow, accent, and on-glass
//  text colors used everywhere in the widget system. Light/dark variants are
//  picked automatically via `resolved(for:)`.
//

import SwiftUI

public enum WidgetTheme: String, CaseIterable, Identifiable, Sendable {
    case emerald   = "emerald"
    case sapphire  = "sapphire"
    case royal     = "royal"
    case crimson   = "crimson"
    case goldBlack = "goldBlack"
    case midnight  = "midnight"
    case silver    = "silver"
    case teal      = "teal"
    case sandstone = "sandstone"

    public var id: String { rawValue }

    public var displayName: String {
        switch self {
        case .emerald:   return "Emerald Green"
        case .sapphire:  return "Sapphire Blue"
        case .royal:     return "Royal Purple"
        case .crimson:   return "Crimson Red"
        case .goldBlack: return "Gold & Black"
        case .midnight:  return "Midnight Black"
        case .silver:    return "Silver Frost"
        case .teal:      return "Teal"
        case .sandstone: return "Sandstone Beige"
        }
    }
}

// MARK: - Resolved Palette

/// Concrete colors for one theme in one color scheme.
/// Built once and passed down through the view tree as an environment value.
public struct ThemePalette: Sendable {
    public let gradientStart: Color
    public let gradientEnd:   Color
    public let glow:          Color
    public let accent:        Color   // gold-ish highlight
    public let primaryText:   Color
    public let secondaryText: Color
    public let cardStroke:    Color
    public let cardFill:      Color

    /// Background gradient for the whole widget surface.
    public var backgroundGradient: LinearGradient {
        LinearGradient(
            colors: [gradientStart, gradientEnd],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}

public extension WidgetTheme {

    /// Resolve to a concrete palette for the current color scheme.
    func resolved(for scheme: ColorScheme) -> ThemePalette {
        switch self {
        case .emerald:
            return scheme == .dark
                ? .init(
                    gradientStart: Color(red: 0.02, green: 0.18, blue: 0.13),
                    gradientEnd:   Color(red: 0.00, green: 0.08, blue: 0.06),
                    glow:          Color(red: 0.20, green: 0.85, blue: 0.55),
                    accent:        Color(red: 0.92, green: 0.78, blue: 0.45),
                    primaryText:   Color(red: 0.97, green: 0.96, blue: 0.92),
                    secondaryText: Color(red: 0.75, green: 0.85, blue: 0.78),
                    cardStroke:    Color.white.opacity(0.10),
                    cardFill:      Color.white.opacity(0.06))
                : .init(
                    gradientStart: Color(red: 0.05, green: 0.32, blue: 0.22),
                    gradientEnd:   Color(red: 0.02, green: 0.18, blue: 0.13),
                    glow:          Color(red: 0.30, green: 0.90, blue: 0.60),
                    accent:        Color(red: 0.95, green: 0.80, blue: 0.45),
                    primaryText:   .white,
                    secondaryText: Color.white.opacity(0.78),
                    cardStroke:    Color.white.opacity(0.14),
                    cardFill:      Color.white.opacity(0.08))

        case .sapphire:
            return .init(
                gradientStart: Color(red: 0.04, green: 0.16, blue: 0.42),
                gradientEnd:   Color(red: 0.01, green: 0.06, blue: 0.20),
                glow:          Color(red: 0.40, green: 0.65, blue: 1.00),
                accent:        Color(red: 0.95, green: 0.80, blue: 0.45),
                primaryText:   .white,
                secondaryText: Color.white.opacity(0.78),
                cardStroke:    Color.white.opacity(0.14),
                cardFill:      Color.white.opacity(0.08))

        case .royal:
            return .init(
                gradientStart: Color(red: 0.25, green: 0.08, blue: 0.42),
                gradientEnd:   Color(red: 0.10, green: 0.02, blue: 0.20),
                glow:          Color(red: 0.75, green: 0.45, blue: 1.00),
                accent:        Color(red: 0.96, green: 0.82, blue: 0.50),
                primaryText:   .white,
                secondaryText: Color.white.opacity(0.78),
                cardStroke:    Color.white.opacity(0.14),
                cardFill:      Color.white.opacity(0.08))

        case .crimson:
            return .init(
                gradientStart: Color(red: 0.42, green: 0.06, blue: 0.10),
                gradientEnd:   Color(red: 0.18, green: 0.02, blue: 0.04),
                glow:          Color(red: 1.00, green: 0.42, blue: 0.45),
                accent:        Color(red: 0.95, green: 0.82, blue: 0.45),
                primaryText:   .white,
                secondaryText: Color.white.opacity(0.78),
                cardStroke:    Color.white.opacity(0.14),
                cardFill:      Color.white.opacity(0.08))

        case .goldBlack:
            return .init(
                gradientStart: Color(red: 0.10, green: 0.08, blue: 0.04),
                gradientEnd:   Color(red: 0.02, green: 0.02, blue: 0.02),
                glow:          Color(red: 0.98, green: 0.82, blue: 0.40),
                accent:        Color(red: 1.00, green: 0.86, blue: 0.50),
                primaryText:   Color(red: 0.99, green: 0.96, blue: 0.86),
                secondaryText: Color(red: 0.85, green: 0.78, blue: 0.55),
                cardStroke:    Color(red: 1.0, green: 0.86, blue: 0.50).opacity(0.20),
                cardFill:      Color(red: 1.0, green: 0.86, blue: 0.50).opacity(0.06))

        case .midnight:
            return .init(
                gradientStart: Color(red: 0.07, green: 0.07, blue: 0.10),
                gradientEnd:   Color(red: 0.01, green: 0.01, blue: 0.02),
                glow:          Color(red: 0.55, green: 0.60, blue: 0.85),
                accent:        Color(red: 0.92, green: 0.78, blue: 0.45),
                primaryText:   .white,
                secondaryText: Color.white.opacity(0.70),
                cardStroke:    Color.white.opacity(0.12),
                cardFill:      Color.white.opacity(0.06))

        case .silver:
            return scheme == .dark
                ? .init(
                    gradientStart: Color(red: 0.22, green: 0.24, blue: 0.28),
                    gradientEnd:   Color(red: 0.10, green: 0.11, blue: 0.13),
                    glow:          Color(red: 0.80, green: 0.85, blue: 0.92),
                    accent:        Color(red: 0.95, green: 0.82, blue: 0.50),
                    primaryText:   .white,
                    secondaryText: Color.white.opacity(0.78),
                    cardStroke:    Color.white.opacity(0.16),
                    cardFill:      Color.white.opacity(0.08))
                : .init(
                    gradientStart: Color(red: 0.85, green: 0.88, blue: 0.92),
                    gradientEnd:   Color(red: 0.65, green: 0.70, blue: 0.76),
                    glow:          Color(red: 0.95, green: 0.97, blue: 1.00),
                    accent:        Color(red: 0.55, green: 0.42, blue: 0.18),
                    primaryText:   Color(red: 0.10, green: 0.12, blue: 0.16),
                    secondaryText: Color(red: 0.30, green: 0.34, blue: 0.40),
                    cardStroke:    Color.black.opacity(0.10),
                    cardFill:      Color.white.opacity(0.40))

        case .teal:
            return .init(
                gradientStart: Color(red: 0.04, green: 0.32, blue: 0.36),
                gradientEnd:   Color(red: 0.01, green: 0.16, blue: 0.20),
                glow:          Color(red: 0.30, green: 0.85, blue: 0.85),
                accent:        Color(red: 0.95, green: 0.80, blue: 0.45),
                primaryText:   .white,
                secondaryText: Color.white.opacity(0.78),
                cardStroke:    Color.white.opacity(0.14),
                cardFill:      Color.white.opacity(0.08))

        case .sandstone:
            return scheme == .dark
                ? .init(
                    gradientStart: Color(red: 0.30, green: 0.22, blue: 0.14),
                    gradientEnd:   Color(red: 0.14, green: 0.10, blue: 0.06),
                    glow:          Color(red: 0.95, green: 0.78, blue: 0.50),
                    accent:        Color(red: 0.98, green: 0.86, blue: 0.55),
                    primaryText:   Color(red: 0.99, green: 0.96, blue: 0.88),
                    secondaryText: Color(red: 0.85, green: 0.78, blue: 0.65),
                    cardStroke:    Color.white.opacity(0.14),
                    cardFill:      Color.white.opacity(0.08))
                : .init(
                    gradientStart: Color(red: 0.96, green: 0.90, blue: 0.78),
                    gradientEnd:   Color(red: 0.82, green: 0.72, blue: 0.55),
                    glow:          Color(red: 0.99, green: 0.92, blue: 0.78),
                    accent:        Color(red: 0.55, green: 0.38, blue: 0.18),
                    primaryText:   Color(red: 0.20, green: 0.14, blue: 0.06),
                    secondaryText: Color(red: 0.38, green: 0.28, blue: 0.14),
                    cardStroke:    Color.black.opacity(0.10),
                    cardFill:      Color.white.opacity(0.30))
        }
    }
}

// MARK: - Environment

private struct ThemePaletteKey: EnvironmentKey {
    static let defaultValue: ThemePalette = WidgetTheme.emerald.resolved(for: .dark)
}

public extension EnvironmentValues {
    var themePalette: ThemePalette {
        get { self[ThemePaletteKey.self] }
        set { self[ThemePaletteKey.self] = newValue }
    }
}
