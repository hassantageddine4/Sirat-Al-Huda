//
//  WalkthroughComponents.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  Smaller pieces used by the walkthrough screen:
//   - PoseStage: the centered figure area
//   - InstructionBlock: title + body + tip
//   - NavigationBar: Previous / Next / Done
//

import SwiftUI

// MARK: - Pose Stage

struct PoseStage: View {
    let step: PrayerStep
    let madhhab: Madhhab

    private let gold = Color(red: 0.95, green: 0.80, blue: 0.45)
    private let glow = Color(red: 0.20, green: 0.65, blue: 0.42)

    private var hasImageAsset: Bool {
        guard let name = step.assetName else { return false }
        return UIImage(named: name) != nil
    }

    var body: some View {
        ZStack {
            // Soft cream plate behind the figure
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .fill(
                    LinearGradient(
                        colors: [
                            Color(red: 0.96, green: 0.92, blue: 0.84),
                            Color(red: 0.91, green: 0.86, blue: 0.75)
                        ],
                        startPoint: .top, endPoint: .bottom
                    )
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 22, style: .continuous)
                        .strokeBorder(gold.opacity(0.35), lineWidth: 0.7)
                )

            // Inner glow halo
            RadialGradient(
                colors: [glow.opacity(0.18), .clear],
                center: .top,
                startRadius: 0,
                endRadius: 220
            )
            .blendMode(.plusLighter)
            .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))

            // Figure
            Group {
                if hasImageAsset, let name = step.assetName {
                    Image(name)
                        .resizable()
                        .scaledToFit()
                        .padding(20)
                } else {
                    PoseSilhouetteView(posture: step.posture, madhhab: madhhab)
                        .padding(.horizontal, 30)
                        .padding(.vertical, 18)
                }
            }
            .id("\(step.id)_\(madhhab.rawValue)")
            .transition(.asymmetric(
                insertion: .opacity.combined(with: .scale(scale: 0.96)),
                removal:   .opacity
            ))
        }
        .frame(height: 240)
        .accessibilityElement()
        .accessibilityLabel("Illustration of \(step.title)")
    }
}

// MARK: - Instruction Block

struct InstructionBlock: View {
    let step: PrayerStep

    private let gold = Color(red: 0.95, green: 0.80, blue: 0.45)

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(step.title)
                .font(.system(size: 22, weight: .semibold, design: .serif))
                .foregroundStyle(.white)
                .multilineTextAlignment(.leading)
                .frame(maxWidth: .infinity, alignment: .leading)

            Text(step.instruction)
                .font(.system(size: 14, weight: .regular))
                .foregroundStyle(.white.opacity(0.78))
                .lineSpacing(4)
                .frame(maxWidth: .infinity, alignment: .leading)

            if let note = step.madhhabNote {
                madhhabNoteBlock(note)
            }
            if let tip = step.tip {
                tipBlock(tip)
            }
        }
    }

    @ViewBuilder
    private func tipBlock(_ tip: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "lightbulb.fill")
                .font(.system(size: 11))
                .foregroundStyle(gold)
                .padding(.top, 2)
            Text(tip)
                .font(.system(size: 12, weight: .regular))
                .italic()
                .foregroundStyle(.white.opacity(0.7))
                .lineSpacing(2)
        }
        .padding(10)
        .background(
            RoundedRectangle(cornerRadius: 10, style: .continuous)
                .fill(gold.opacity(0.06))
                .overlay(
                    RoundedRectangle(cornerRadius: 10, style: .continuous)
                        .strokeBorder(gold.opacity(0.2), lineWidth: 0.5)
                )
        )
    }

    @ViewBuilder
    private func madhhabNoteBlock(_ note: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "info.circle.fill")
                .font(.system(size: 11))
                .foregroundStyle(.white.opacity(0.6))
                .padding(.top, 2)
            Text(note)
                .font(.system(size: 11, weight: .regular))
                .foregroundStyle(.white.opacity(0.65))
                .lineSpacing(2)
        }
        .padding(10)
        .background(
            RoundedRectangle(cornerRadius: 10, style: .continuous)
                .fill(Color.white.opacity(0.04))
        )
    }
}

// MARK: - Navigation Bar

struct WalkthroughNavBar: View {
    let isFirstStep: Bool
    let isLastStep: Bool
    let onPrevious: () -> Void
    let onNext: () -> Void
    let onDone: () -> Void

    private let gold = Color(red: 0.95, green: 0.80, blue: 0.45)

    var body: some View {
        HStack(spacing: 10) {
            // Previous
            Button(action: onPrevious) {
                HStack(spacing: 6) {
                    Image(systemName: "chevron.left")
                    Text("Previous")
                }
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(isFirstStep ? .white.opacity(0.3) : .white.opacity(0.85))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .fill(Color.white.opacity(0.05))
                        .overlay(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .strokeBorder(Color.white.opacity(0.12), lineWidth: 0.6)
                        )
                )
            }
            .disabled(isFirstStep)
            .buttonStyle(.plain)

            // Next / Done
            Button(action: isLastStep ? onDone : onNext) {
                HStack(spacing: 6) {
                    Text(isLastStep ? "Complete" : "Next")
                    Image(systemName: isLastStep ? "checkmark" : "chevron.right")
                }
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(Color(red: 0.04, green: 0.18, blue: 0.13))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .fill(
                            LinearGradient(
                                colors: [
                                    Color(red: 0.99, green: 0.88, blue: 0.55),
                                    Color(red: 0.85, green: 0.66, blue: 0.30)
                                ],
                                startPoint: .top, endPoint: .bottom
                            )
                        )
                        .shadow(color: gold.opacity(0.4), radius: 10, y: 2)
                )
            }
            .buttonStyle(.plain)
        }
    }
}
