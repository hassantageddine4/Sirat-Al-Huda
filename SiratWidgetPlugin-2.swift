//
//  SiratWidgetPlugin.swift
//
//  Capacitor plugin bridge for the Sirat Al Huda iOS widget.
//  Writes configuration to the shared App Group so the widget can
//  compute prayer times locally via Adhan.
//

import Foundation
import Capacitor
import WidgetKit

private let AppGroup = "group.com.tageddine.siratalhuda"

@objc(SiratWidgetPlugin)
public class SiratWidgetPlugin: CAPPlugin, CAPBridgedPlugin {

    public let identifier = "SiratWidgetPlugin"
    public let jsName = "SiratWidget"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "setConfig",      returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setTheme",       returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setPrayerTimes", returnType: CAPPluginReturnPromise), // legacy
        CAPPluginMethod(name: "reload",         returnType: CAPPluginReturnPromise),
    ]

    // ─── New: full config push ───────────────────────────────────────────────
    @objc func setConfig(_ call: CAPPluginCall) {
        guard let defaults = UserDefaults(suiteName: AppGroup) else {
            call.reject("App Group unavailable")
            return
        }

        if let lat = call.getDouble("lat") {
            defaults.set(lat, forKey: "prayer_lat")
        }
        if let lon = call.getDouble("lon") {
            defaults.set(lon, forKey: "prayer_lon")
        }
        if let method = call.getString("method") {
            defaults.set(method, forKey: "prayer_method")
        }
        if let methodCode = call.getInt("methodCode") {
            defaults.set(methodCode, forKey: "prayer_method_code")
        }
        if let madhab = call.getString("madhab") {
            defaults.set(madhab, forKey: "prayer_madhab")
        }
        if let branch = call.getString("branch") {
            defaults.set(branch, forKey: "prayer_branch")
        }
        if let locName = call.getString("locationName") {
            defaults.set(locName, forKey: "prayer_location")
        }
        if let theme = call.getString("theme") {
            defaults.set(theme, forKey: "widget_theme")
        }

        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
        call.resolve()
    }

    // ─── Theme only ──────────────────────────────────────────────────────────
    @objc func setTheme(_ call: CAPPluginCall) {
        guard let defaults = UserDefaults(suiteName: AppGroup) else {
            call.reject("App Group unavailable")
            return
        }
        guard let theme = call.getString("theme") else {
            call.reject("theme is required")
            return
        }
        defaults.set(theme, forKey: "widget_theme")
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
        call.resolve()
    }

    // ─── Legacy: prayer times push (kept for backward compat, no-op functional)
    @objc func setPrayerTimes(_ call: CAPPluginCall) {
        // Adhan handles computation now; we still accept the call so old code
        // paths don't error. Forward location/branch if present.
        guard let defaults = UserDefaults(suiteName: AppGroup) else {
            call.resolve()
            return
        }
        if let times = call.getObject("times") {
            // Old payload: { fajr: "...", dhuhr: "...", ... } ISO strings.
            // Try to extract lat/lon if embedded in a wrapper.
            for (k, v) in times {
                if let s = v as? String {
                    defaults.set(s, forKey: "prayer_\(k.lowercased())_legacy")
                }
            }
        }
        if let location = call.getString("location") {
            defaults.set(location, forKey: "prayer_location")
        }
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
        call.resolve()
    }

    // ─── Reload ──────────────────────────────────────────────────────────────
    @objc func reload(_ call: CAPPluginCall) {
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
        call.resolve()
    }
}
