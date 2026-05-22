//
//  PrayerWalkthroughView.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  The main step-by-step prayer screen.
//
//  Layout (top to bottom):
//    1. Top bar: close × + Sunni/Shia toggle
//    2. Header: prayer title, rak'ah/step counters, progress bar
//    3. Pose stage (centered figure on cream plate)
//    4. Instruction block (title + body + tip + madhhab note)
//    5. Recitation card (if the step has one)
//    6. Navigation buttons: Previous / Next (or Complete on the last step)
//
//  Navigation:
//    - Forward / back buttons
//    - Horizontal swipe gestures
//    - Page-aware: rakah counter updates as you cross rakah boundaries
//

import SwiftUI

struct PrayerWalkthroughView: View {

    let prayer: Prayer
    @State var madhhab: Madhhab

    @Environment(\.dismiss) private var dismiss
    @State private var stepIndex: Int = 0
    @State private var showCompletion = false

    private let bgTop    = Color(red: 0.04, green: 0.16, blue: 0.11)
    private let bgBottom = Color(red: 0.01, green: 0.06, blue: 0.04)

    // MARK: - Flattened step list

    /// All steps for the current madhhab in display order, paired with
    /// the rakah number each step belongs to. Recomputed when madhhab changes.
    private var flatSteps: [(rakah: Int, step: PrayerStep)] {
        var result: [(Int, PrayerStep)] = []
        for rakah in prayer.rakahs {
            for step in rakah.steps(for: madhhab) {
                result.append((rakah.number, step))
            }
        }
        return result
    }

    private var currentEntry: (rakah: Int, step: PrayerStep) {
        flatSteps[min(stepIndex, flatSteps.count - 1)]
    }

    private var totalSteps: Int { flatSteps.count }

    var body: some View {
        ZStack {
            background

            VStack(spacing: 0) {
                topBar
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 18) {
                        WalkthroughHeader(
                            prayer: prayer,
                            currentRakahNumber: currentEntry.rakah,
                            currentStepIndex: stepIndex,
                            totalSteps: totalSteps
                        )
                        .padding(.top, 8)

                        // Pose + instruction + recitation, all keyed to the
                        // step id so SwiftUI cross-fades between them.
                        VStack(spacing: 18) {
                            PoseStage(step: currentEntry.step, madhhab: madhhab)
                            InstructionBlock(step: currentEntry.step)
                            if let recitation = currentEntry.step.recitation {
                                RecitationCard(recitation: recitation)
                            }
                        }
                        .id("\(currentEntry.step.id)_\(madhhab.rawValue)")
                        .transition(.asymmetric(
                            insertion: .opacity.combined(with: .offset(x: 30)),
                            removal:   .opacity.combined(with: .offset(x: -30))
                        ))
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 24)
                }

                WalkthroughNavBar(
                    isFirstStep: stepIndex == 0,
                    isLastStep: stepIndex == totalSteps - 1,
                    onPrevious: goPrevious,
                    onNext:     goNext,
                    onDone:     complete
                )
                .padding(.horizontal, 16)
                .padding(.top, 12)
                .padding(.bottom, 12)
                .background(
                    LinearGradient(
                        colors: [.clear, bgBottom],
                        startPoint: .top, endPoint: .bottom
                    )
                )
            }
        }
        .preferredColorScheme(.dark)
        .gesture(swipeGesture)
        .sheet(isPresented: $showCompletion) {
            CompletionSheet(prayer: prayer) {
                showCompletion = false
                dismiss()
            }
            .presentationDetents([.medium])
            .presentationDragIndicator(.visible)
            .presentationBackground(.thinMaterial)
        }
    }

    // MARK: - Pieces

    private var background: some View {
        ZStack {
            LinearGradient(colors: [bgTop, bgBottom], startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()
            RadialGradient(
                colors: [Color(red: 0.18, green: 0.55, blue: 0.38).opacity(0.28), .clear],
                center: .topLeading,
                startRadius: 0,
                endRadius: 360
            )
            .blendMode(.plusLighter)
            .ignoresSafeArea()
            IslamicGeometricBackground(tileSize: 70, lineOpacity: 0.04)
                .ignoresSafeArea()
        }
    }

    private var topBar: some View {
        HStack {
            Button {
                #if os(iOS)
                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                #endif
                dismiss()
            } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(.white.opacity(0.85))
                    .frame(width: 36, height: 36)
                    .background(
                        Circle()
                            .fill(Color.white.opacity(0.06))
                            .overlay(Circle().strokeBorder(Color.white.opacity(0.12), lineWidth: 0.6))
                    )
            }
            Spacer()
            // Madhhab toggle stays accessible during the walkthrough so the
            // user can switch context without leaving the prayer.
            MadhhabToggle(selection: Binding(
                get: { madhhab },
                set: { newValue in
                    withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                        let previousId = currentEntry.step.id
                        madhhab = newValue
                        // Try to keep the user on the equivalent step after switching.
                        if let newIndex = flatSteps.firstIndex(where: { $0.step.id == previousId }) {
                            stepIndex = newIndex
                        } else {
                            stepIndex = min(stepIndex, totalSteps - 1)
                        }
                    }
                }
            ))
            .scaleEffect(0.85)
            Spacer()
            // Symmetric spacer so the toggle stays optically centered.
            Color.clear.frame(width: 36, height: 36)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
    }

    // MARK: - Navigation

    private var swipeGesture: some Gesture {
        DragGesture(minimumDistance: 30, coordinateSpace: .local)
            .onEnded { value in
                let horizontal = value.translation.width
                let vertical = abs(value.translation.height)
                guard abs(horizontal) > 50, vertical < 40 else { return }
                if horizontal < 0 { goNext() } else { goPrevious() }
            }
    }

    private func goNext() {
        guard stepIndex < totalSteps - 1 else { return }
        #if os(iOS)
        UIImpactFeedbackGenerator(style: .soft).impactOccurred()
        #endif
        withAnimation(.spring(response: 0.45, dampingFraction: 0.85)) {
            stepIndex += 1
        }
    }

    private func goPrevious() {
        guard stepIndex > 0 else { return }
        #if os(iOS)
        UIImpactFeedbackGenerator(style: .soft).impactOccurred()
        #endif
        withAnimation(.spring(response: 0.45, dampingFraction: 0.85)) {
            stepIndex -= 1
        }
    }

    private func complete() {
        #if os(iOS)
        UINotificationFeedbackGenerator().notificationOccurred(.success)
        #endif
        showCompletion = true
    }
}

// MARK: - Completion Sheet

struct CompletionSheet: View {
    let prayer: Prayer
    let onDismiss: () -> Void

    private let gold = Color(red: 0.95, green: 0.80, blue: 0.45)

    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "checkmark.seal.fill")
                .font(.system(size: 56))
                .foregroundStyle(
                    LinearGradient(
                        colors: [
                            Color(red: 0.99, green: 0.88, blue: 0.55),
                            Color(red: 0.85, green: 0.66, blue: 0.30)
                        ],
                        startPoint: .top, endPoint: .bottom
                    )
                )
                .padding(.top, 24)

            VStack(spacing: 6) {
                Text("Prayer Complete")
                    .font(.system(size: 22, weight: .semibold, design: .serif))
                Text("Taqabbal-Allāhu minnā wa minkum")
                    .font(.system(size: 13, weight: .regular, design: .serif))
                    .italic()
                    .foregroundStyle(.secondary)
                Text("May Allah accept it from us and from you")
                    .font(.system(size: 12))
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Button(action: onDismiss) {
                Text("Done")
                    .font(.system(size: 15, weight: .semibold))
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
                    )
            }
            .buttonStyle(.plain)
            .padding(.horizontal, 24)
            .padding(.bottom, 24)
        }
    }
}

#Preview {
    PrayerListView()
}
