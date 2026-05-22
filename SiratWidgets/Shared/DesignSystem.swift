//
//  DesignSystem.swift
//  Sirat Al Huda — Shared
//
//  Typography scale and small design constants used across every widget so
//  they share one visual language.
//

import SwiftUI

public enum SiratFont {

    /// Display face for prayer names. Uses serif to match the existing app's
    /// "luxury Islamic" tone seen in the reference image (Asr in serif).
    public static func display(_ size: CGFloat, weight: Font.Weight = .semibold) -> Font {
        .system(size: size, weight: weight, design: .serif)
    }

    /// Numeric face for prayer times — rounded for a soft, modern feel.
    public static func numeric(_ size: CGFloat, weight: Font.Weight = .medium) -> Font {
        .system(size: size, weight: weight, design: .rounded).monospacedDigit()
    }

    /// All-caps label face. Apply `.tracking(...)` at the call site.
    public static func label(_ size: CGFloat, weight: Font.Weight = .medium) -> Font {
        .system(size: size, weight: weight, design: .default)
    }
}

public enum SiratLayout {
    public static let cornerRadius: CGFloat = 18
    public static let innerCornerRadius: CGFloat = 14
    public static let strokeWidth: CGFloat = 0.7
}
