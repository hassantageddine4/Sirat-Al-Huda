//
//  SiratWidgetPlugin.swift
//  App
//
//  Bridges prayer times from JS into the shared App Group so the Home Screen
//  widget can read them. Capacitor auto-discovers this plugin via @objc.
//
//  JS usage:
//    SiratWidget.setPrayerTimes({ fajr: "...ISO...", dhuhr, asr, maghrib, isha, location })
//

import Foundation
import Capacitor
import WidgetKit

private let appGroupID = "group.com.tageddineproductions.sirat"

@objc(SiratWidgetPlugin)
public class SiratWidgetPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "SiratWidgetPlugin"
    public let jsName = "SiratWidget"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "setPrayerTimes", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "reload",         returnType: CAPPluginReturnPromise),
    ]

    @objc func setPrayerTimes(_ call: CAPPluginCall) {
        guard let defaults = UserDefaults(suiteName: appGroupID) else {
            call.reject("App Group not configured. Add '\(appGroupID)' to App + Widget capabilities in Xcode.")
            return
        }

        let prayers = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"]
        for prayer in prayers {
            if let iso = call.getString(prayer) {
                defaults.set(iso, forKey: "prayer_\(prayer)")
            }
        }

        if let location = call.getString("location") {
            defaults.set(location, forKey: "prayer_location")
        }

        defaults.set(Date().timeIntervalSince1970, forKey: "prayer_updated_at")

        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }

        call.resolve(["ok": true])
    }

    @objc func reload(_ call: CAPPluginCall) {
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
        call.resolve(["ok": true])
    }
}
