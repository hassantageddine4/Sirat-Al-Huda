//
//  SiratWidgetBundle.swift
//  Sirat Al Huda — Widget extension entry point
//
//  Add this file to the WIDGET EXTENSION target only (not the main app).
//

import SwiftUI
import WidgetKit

@main
struct SiratWidgetBundle: WidgetBundle {

    @WidgetBundleBuilder
    var body: some Widget {

        // Home screen
        SmallPrayerWidget()
        MediumPrayerWidget()
        LargePrayerWidget()

        // Lock screen
        InlinePrayerWidget()
        CircularPrayerWidget()
        RectangularPrayerWidget()

        // Live activity (iOS 16.2+)
        if #available(iOS 16.2, *) {
            PrayerLiveActivity()
        }
    }
}
