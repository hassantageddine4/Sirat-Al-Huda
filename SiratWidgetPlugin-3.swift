//
//  SiratWidgetPlugin.swift
//
//  Capacitor plugin bridge for the Sirat Al Huda iOS widget.
//  Writes configuration to the shared App Group so the widget can
//  compute prayer times locally via Adhan.
//
//  On first load, writes a Detroit default so the widget shows
//  prayer times immediately even before the user has interacted with
//  the app. JS-side updates overwrite these when actual location/prefs
//  are available.
//

import Foundation
import Capacitor
import WidgetKit
import CoreLocation

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

    private var locationManager: CLLocationManager?
    private var didRequestLocation = false

    // ─── Plugin load: bootstrap App Group with defaults ─────────────────────
    override public func load() {
        super.load()
        bootstrapDefaults()
        tryWriteCurrentLocation()
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
    }

    /// Writes sensible defaults so the widget always has data even on first
    /// install, before the JS layer has pushed anything.
    private func bootstrapDefaults() {
        guard let defaults = UserDefaults(suiteName: AppGroup) else { return }
        let lat = defaults.double(forKey: "prayer_lat")
        let lon = defaults.double(forKey: "prayer_lon")
        if lat == 0 && lon == 0 {
            // Default: Detroit, MI — Hassan's location. Will be overwritten
            // the moment real location data flows from the JS side.
            defaults.set(42.3314, forKey: "prayer_lat")
            defaults.set(-83.0458, forKey: "prayer_lon")
            defaults.set("NorthAmerica", forKey: "prayer_method")
            defaults.set("Shafi", forKey: "prayer_madhab")
            defaults.set("sunni", forKey: "prayer_branch")
            defaults.set("Detroit, MI", forKey: "prayer_location")
            defaults.set("emerald", forKey: "widget_theme")
        }
    }

    /// Attempts to fetch the device's current location and push it to the
    /// App Group. Best-effort — only succeeds if the user has granted
    /// location permission to the parent app.
    private func tryWriteCurrentLocation() {
        guard !didRequestLocation else { return }
        didRequestLocation = true
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            let m = CLLocationManager()
            let status: CLAuthorizationStatus
            if #available(iOS 14.0, *) {
                status = m.authorizationStatus
            } else {
                status = CLLocationManager.authorizationStatus()
            }
            guard status == .authorizedAlways || status == .authorizedWhenInUse else { return }
            self.locationManager = m
            m.desiredAccuracy = kCLLocationAccuracyKilometer
            m.requestLocation()
            // Cache the most recent location if already available.
            if let loc = m.location {
                self.writeCoords(loc.coordinate)
            }
        }
    }

    private func writeCoords(_ c: CLLocationCoordinate2D) {
        guard let defaults = UserDefaults(suiteName: AppGroup) else { return }
        defaults.set(c.latitude, forKey: "prayer_lat")
        defaults.set(c.longitude, forKey: "prayer_lon")
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
    }

    // ─── Full config push from JS ───────────────────────────────────────────
    @objc func setConfig(_ call: CAPPluginCall) {
        guard let defaults = UserDefaults(suiteName: AppGroup) else {
            call.reject("App Group unavailable")
            return
        }

        // Accept lat/lon as either Double, Int, or String — coerce safely
        if let lat = doubleFromAny(call.options?["lat"]) {
            defaults.set(lat, forKey: "prayer_lat")
        }
        if let lon = doubleFromAny(call.options?["lon"]) {
            defaults.set(lon, forKey: "prayer_lon")
        }
        if let method = call.getString("method"), !method.isEmpty {
            defaults.set(method, forKey: "prayer_method")
        }
        if let methodCode = call.getInt("methodCode") {
            defaults.set(methodCode, forKey: "prayer_method_code")
        }
        if let madhab = call.getString("madhab"), !madhab.isEmpty {
            defaults.set(madhab, forKey: "prayer_madhab")
        }
        if let branch = call.getString("branch"), !branch.isEmpty {
            defaults.set(branch, forKey: "prayer_branch")
        }
        if let locName = call.getString("locationName"), !locName.isEmpty {
            defaults.set(locName, forKey: "prayer_location")
        }
        if let theme = call.getString("theme"), !theme.isEmpty {
            defaults.set(theme, forKey: "widget_theme")
        }

        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
        call.resolve()
    }

    // ─── Theme only ─────────────────────────────────────────────────────────
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

    // ─── Legacy: prayer times push (kept for backward compat) ───────────────
    @objc func setPrayerTimes(_ call: CAPPluginCall) {
        guard let defaults = UserDefaults(suiteName: AppGroup) else {
            call.resolve()
            return
        }
        if let location = call.getString("location") {
            defaults.set(location, forKey: "prayer_location")
        }
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
        call.resolve()
    }

    // ─── Reload ─────────────────────────────────────────────────────────────
    @objc func reload(_ call: CAPPluginCall) {
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
        call.resolve()
    }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

private func doubleFromAny(_ v: Any?) -> Double? {
    guard let v = v else { return nil }
    if let d = v as? Double { return d }
    if let i = v as? Int { return Double(i) }
    if let s = v as? String, let d = Double(s) { return d }
    if let n = v as? NSNumber { return n.doubleValue }
    return nil
}
