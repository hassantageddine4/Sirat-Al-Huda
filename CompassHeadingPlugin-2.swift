import Foundation
import Capacitor
import CoreLocation

/**
 * CompassHeadingPlugin
 *
 * Wraps CLLocationManager.startUpdatingHeading() to deliver true-heading
 * data, automatically corrected for magnetic declination once iOS has a
 * location fix. iOS 14+ applies its own compass filtering, so the source
 * data is already smoothed before reaching JS.
 *
 * Why CLHeading vs CMMotionManager:
 *   • CLHeading is iOS's mature, decades-old compass API
 *   • Handles declination + filtering internally — no race conditions
 *   • Apple's own Compass app uses this exact API
 *   • Returns trueHeading once any CLLocation arrives
 *
 * Source rate ~10–25Hz. JS layer interpolates via RAF for 60fps visual.
 *
 * Event payload (heading):
 *   {
 *     heading:   Double   // 0–360°, 0 = true (or magnetic) north, clockwise
 *     accuracy:  Double   // headingAccuracy in degrees; <0 = invalid/uncalibrated
 *     timestamp: Double   // Unix epoch seconds
 *     frame:     String   // "true" | "magnetic"
 *   }
 */
@objc(CompassHeadingPlugin)
public class CompassHeadingPlugin: CAPPlugin, CAPBridgedPlugin, CLLocationManagerDelegate {
    public let identifier = "CompassHeadingPlugin"
    public let jsName     = "CompassHeading"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "start",       returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop",        returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
    ]

    private var locationManager: CLLocationManager!
    private var hasStarted        = false
    private var pendingStartCall: CAPPluginCall?

    public override func load() {
        CAPLog.print("[CompassHeading] plugin loaded")
        DispatchQueue.main.async { [weak self] in
            self?.setupLocationManager()
        }
    }

    private func setupLocationManager() {
        if locationManager != nil { return }
        locationManager                  = CLLocationManager()
        locationManager.delegate         = self
        // Get every heading update — JS-side RAF handles smoothing.
        locationManager.headingFilter    = kCLHeadingFilterNone
        // Coarse location is fine — we only need a fix for declination.
        locationManager.desiredAccuracy  = kCLLocationAccuracyKilometer
        locationManager.distanceFilter   = 10_000
    }

    private var currentAuthStatus: CLAuthorizationStatus {
        if #available(iOS 14.0, *) {
            return locationManager?.authorizationStatus ?? .notDetermined
        } else {
            return CLLocationManager.authorizationStatus()
        }
    }

    // ── Public API ───────────────────────────────────────────────────────────

    @objc func isAvailable(_ call: CAPPluginCall) {
        call.resolve(["available": CLLocationManager.headingAvailable()])
    }

    @objc func start(_ call: CAPPluginCall) {
        guard CLLocationManager.headingAvailable() else {
            call.reject("Compass heading not available on this device")
            return
        }
        if hasStarted { call.resolve(); return }

        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.setupLocationManager()

            let status = self.currentAuthStatus
            CAPLog.print("[CompassHeading] start() auth status raw =", String(status.rawValue))

            switch status {
            case .authorizedWhenInUse, .authorizedAlways:
                self.beginUpdates()
                call.resolve()

            case .notDetermined:
                self.pendingStartCall = call
                self.locationManager.requestWhenInUseAuthorization()

            case .denied, .restricted:
                // Magnetic heading still works without location authorization.
                self.beginUpdates()
                call.resolve()

            @unknown default:
                self.beginUpdates()
                call.resolve()
            }
        }
    }

    @objc func stop(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in
            self?.locationManager?.stopUpdatingHeading()
            self?.locationManager?.stopUpdatingLocation()
        }
        hasStarted = false
        call.resolve()
    }

    // ── Internals ────────────────────────────────────────────────────────────

    private func beginUpdates() {
        // startUpdatingLocation keeps a live CLLocation that CLHeading uses
        // to compute trueHeading via declination. Without it, only
        // magneticHeading is valid.
        locationManager.startUpdatingLocation()
        locationManager.startUpdatingHeading()
        hasStarted = true
        CAPLog.print("[CompassHeading] heading + location updates started")
    }

    // ── CLLocationManagerDelegate ────────────────────────────────────────────

    public func locationManager(_ manager: CLLocationManager, didUpdateHeading newHeading: CLHeading) {
        // trueHeading: >= 0 when valid, -1 when declination unknown
        let trueValid = newHeading.trueHeading >= 0
        let heading   = trueValid ? newHeading.trueHeading : newHeading.magneticHeading

        notifyListeners("heading", data: [
            "heading":   heading,
            "accuracy":  newHeading.headingAccuracy,
            "timestamp": newHeading.timestamp.timeIntervalSince1970,
            "frame":     trueValid ? "true" : "magnetic",
        ])
    }

    // Allow iOS to show its system calibration UI when needed.
    public func locationManagerShouldDisplayHeadingCalibration(_ manager: CLLocationManager) -> Bool {
        return true
    }

    public func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        // No-op: we only need location updates to be running so trueHeading
        // can be computed. The actual coordinates aren't used here.
    }

    public func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        guard let call = pendingStartCall else { return }
        pendingStartCall = nil
        beginUpdates()  // works for both authorized (true) and denied (magnetic)
        call.resolve()
    }

    // iOS 13 fallback
    public func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        locationManagerDidChangeAuthorization(manager)
    }

    public func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        CAPLog.print("[CompassHeading] location error:", error.localizedDescription)
        // Don't notify JS — magnetic heading will keep flowing regardless.
    }

    deinit {
        DispatchQueue.main.async { [weak locationManager] in
            locationManager?.stopUpdatingHeading()
            locationManager?.stopUpdatingLocation()
        }
    }
}
