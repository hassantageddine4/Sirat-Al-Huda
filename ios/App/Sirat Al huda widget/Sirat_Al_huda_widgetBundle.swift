//
//  Sirat_Al_huda_widgetBundle.swift
//  Sirat Al huda widget
//

import WidgetKit
import SwiftUI

@main
struct Sirat_Al_huda_widgetBundle: WidgetBundle {
    var body: some Widget {
        NextPrayerWidget()
        DailyPrayersWidget()
        DailyOverviewWidget()
        DailyVerseHomeWidget()
        LockScreenPrayerWidget()
        DailyVerseLockWidget()
        IslamicEventLockWidget()
        // Live Activity will be registered in batch 2:
        // PrayerLiveActivity()
    }
}
