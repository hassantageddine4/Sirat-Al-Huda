//
//  LiveActivityController.swift
//  Sirat Al Huda — App side
//
//  Owned by the host app. Starts, updates, and ends the prayer Live Activity.
//
//  Wire this into your existing prayer-time refresh logic — for example, call
//  `LiveActivityController.shared.start()` after computing today's prayer
//  times, and `update()` again whenever the next prayer rolls over.
//
//  Requires `NSSupportsLiveActivities = YES` in the host app's Info.plist.
//

import Foundation
import ActivityKit

@available(iOS 16.2, *)
public final class LiveActivityController {

    public static let shared = LiveActivityController()
    private init() {}

    private var current: Activity<PrayerActivityAttributes>?

    // MARK: - Start

    public func start(with data: PrayerWidgetData) {
        guard ActivityAuthorizationInfo().areActivitiesEnabled else {
            // User has Live Activities disabled — fail silently.
            return
        }

        // Don't double-start.
        if current != nil { return }

        let now = Date()
        let next = data.nextPrayer(relativeTo: now)
        let prev = data.currentPrayer(relativeTo: now)?.time
                ?? Calendar.current.startOfDay(for: now)

        let attributes = PrayerActivityAttributes(hijriDate: data.hijriDate)
        let state = PrayerActivityAttributes.ContentState(
            nextPrayerName:     next.name.displayName,
            nextPrayerSymbol:   next.name.symbol,
            nextPrayerTime:     next.time,
            previousPrayerTime: prev,
            themeRawValue:      SiratSharedStorage.loadTheme().rawValue,
            madhab:             data.madhab.displayName
        )

        do {
            let content = ActivityContent(state: state, staleDate: next.time.addingTimeInterval(60))
            current = try Activity.request(
                attributes: attributes,
                content: content,
                pushType: nil
            )
        } catch {
            print("Sirat LiveActivity — failed to start:", error)
        }
    }

    // MARK: - Update

    public func update(with data: PrayerWidgetData) {
        guard let activity = current else {
            // No live activity yet — try starting.
            start(with: data)
            return
        }

        let now = Date()
        let next = data.nextPrayer(relativeTo: now)
        let prev = data.currentPrayer(relativeTo: now)?.time
                ?? Calendar.current.startOfDay(for: now)

        let state = PrayerActivityAttributes.ContentState(
            nextPrayerName:     next.name.displayName,
            nextPrayerSymbol:   next.name.symbol,
            nextPrayerTime:     next.time,
            previousPrayerTime: prev,
            themeRawValue:      SiratSharedStorage.loadTheme().rawValue,
            madhab:             data.madhab.displayName
        )

        Task {
            await activity.update(
                ActivityContent(state: state,
                                staleDate: next.time.addingTimeInterval(60))
            )
        }
    }

    // MARK: - End

    public func end(immediately: Bool = false) {
        guard let activity = current else { return }
        Task {
            await activity.end(
                nil,
                dismissalPolicy: immediately ? .immediate : .default
            )
            current = nil
        }
    }
}
