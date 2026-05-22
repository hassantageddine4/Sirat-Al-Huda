//
//  ThemeSelectorView.swift
//  Sirat Al Huda — App side
//
//  Drop into your existing settings flow. Renders all 9 themes as live
//  preview swatches and persists the selection to the App Group, which
//  triggers an automatic widget reload.
//

import SwiftUI
import WidgetKit

public struct ThemeSelectorView: View {

    @State private var selected: WidgetTheme = SiratSharedStorage.loadTheme()
    @Environment(\.colorScheme) private var scheme

    private let columns = [GridItem(.adaptive(minimum: 150), spacing: 14)]

    public init() {}

    public var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 6) {
                Text("WIDGET THEME")
                    .font(SiratFont.label(11, weight: .semibold))
                    .tracking(2)
                    .foregroundStyle(.secondary)
                    .padding(.horizontal, 4)

                Text("Customize how your widgets look on the Home Screen, Lock Screen, and Dynamic Island.")
                    .font(.system(size: 13))
                    .foregroundStyle(.secondary)
                    .padding(.horizontal, 4)
                    .padding(.bottom, 6)

                LazyVGrid(columns: columns, spacing: 14) {
                    ForEach(WidgetTheme.allCases) { theme in
                        ThemeSwatch(
                            theme: theme,
                            isSelected: selected == theme,
                            scheme: scheme
                        )
                        .onTapGesture {
                            withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                                selected = theme
                                SiratSharedStorage.saveTheme(theme)
                            }
                        }
                    }
                }
            }
            .padding(16)
        }
        .navigationTitle("Theme")
    }
}

private struct ThemeSwatch: View {
    let theme: WidgetTheme
    let isSelected: Bool
    let scheme: ColorScheme

    var body: some View {
        let palette = theme.resolved(for: scheme)

        ZStack(alignment: .topTrailing) {
            ZStack {
                GlassBackground()

                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Image(systemName: "moon.stars.fill")
                            .font(.system(size: 11))
                            .foregroundStyle(palette.accent)
                        Spacer()
                    }
                    Spacer()
                    Text("Asr")
                        .font(SiratFont.display(20, weight: .semibold))
                        .foregroundStyle(palette.primaryText)
                    Text("4:52 PM")
                        .font(SiratFont.numeric(11, weight: .medium))
                        .foregroundStyle(palette.secondaryText)
                    Text(theme.displayName.uppercased())
                        .font(SiratFont.label(8, weight: .semibold))
                        .tracking(1.5)
                        .foregroundStyle(palette.accent)
                }
                .padding(12)
            }
            .environment(\.themePalette, palette)
            .frame(height: 130)

            if isSelected {
                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 22))
                    .foregroundStyle(palette.accent, palette.gradientEnd)
                    .padding(8)
                    .transition(.scale.combined(with: .opacity))
            }
        }
        .overlay(
            RoundedRectangle(cornerRadius: SiratLayout.cornerRadius, style: .continuous)
                .strokeBorder(
                    isSelected ? palette.accent : Color.clear,
                    lineWidth: 2
                )
        )
    }
}

#Preview {
    NavigationStack {
        ThemeSelectorView()
    }
}
