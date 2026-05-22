import Foundation
import Capacitor
import CoreLocation
import CoreMotion

/**
 * CompassHeadingPlugin — CoreMotion edition v2
 *
 * Delivers true-north heading via CMMotionManager device-motion updates.
 * Uses xTrueNorthZVertical when location is authorized, falls back to
 * xMagneticNorthZVertical otherwise, and xArbitraryCorrectedZVertical
 * if no magnetometer is present (very old hardware only).
 *
 * v2 changes vs v1:
 *   - Motion handler dispatches on OperationQueue.main (was custom queue
 *     which seems to break notifyListeners delivery in some builds)
 *   - Native update rate 25Hz, not 60Hz (matches CLHeading; JS does
 *     RAF interpolation for 60fps visuals)
 *   - CAPLog diagnostics at every stage so failures are visible in
 *     Xcode's debug console (filter for "[CompassHeading]")
 *   - Graceful frame fallback chain
 *
 * Event payload (heading): unchanged
 *   { heading, accuracy, timestamp, frame }
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

    private let motionManager = CMMotionManager()
    private var locationManager: CLLocationManager!
    private var hasStarted = false
    private var usingTrueFrame = false
    private var pendingStartCall: CAPPluginCall?
    private var lastLogTime: TimeInterval = 0

    public override func load() {
        CAPLog.print("[CompassHeading] plugin loaded — CoreMotion v2")
    }

    private func setupLocationManager() {
        if locationManager != nil { return }
        locationManager                 = CLLocationManager()
        locationManager.delegate        = self
        locationManager.desiredAccuracy = kCLLocationAccuracyKilometer
        locationManager.distanceFilter  = 10_000
    }

    private var currentAuthStatus: CLAuthorizationStatus {
        if #available(iOS 14.0, *) {
            return locationManager?.authorizationStatus ?? .notDetermined
        }
        return CLLocationManager.authorizationStatus()
    }

    // MARK: - Public API

    @objc func isAvailable(_ call: CAPPluginCall) {
        let avail = motionManager.isDeviceMotionAvailable
        CAPLog.print("[CompassHeading] isAvailable ->", String(avail))
        call.resolve(["available": avail])
    }

    @objc func start(_ call: CAPPluginCall) {
        CAPLog.print("[CompassHeading] start() called")
        guard motionManager.isDeviceMotionAvailable else {
            CAPLog.print("[CompassHeading] ABORT — device motion not available")
            call.reject("Device motion not available on this device")
            return
        }
        if hasStarted {
            CAPLog.print("[CompassHeading] already running, no-op")
            call.resolve()
            return
        }

        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.setupLocationManager()
            let status = self.currentAuthStatus
            CAPLog.print("[CompassHeading] auth status raw =", String(status.rawValue))

            switch status {
            case .authorizedWhenInUse, .authorizedAlways:
                self.beginUpdates()
                call.resolve()

            case .notDetermined:
                CAPLog.print("[CompassHeading] auth not determined — requesting")
                self.pendingStartCall = call
                self.locationManager.requestWhenInUseAuthorization()

            case .denied, .restricted:
                CAPLog.print("[CompassHeading] location denied — magnetic frame only")
                self.beginUpdates()
                call.resolve()

            @unknown default:
                self.beginUpdates()
                call.resolve()
            }
        }
    }

    @objc func stop(_ call: CAPPluginCall) {
        CAPLog.print("[CompassHeading] stop() called")
        DispatchQueue.main.async { [weak self] in
            self?.motionManager.stopDeviceMotionUpdates()
            self?.locationManager?.stopUpdatingLocation()
        }
        hasStarted = false
        call.resolve()
    }

    // MARK: - Internals

    private func beginUpdates() {
        let authed = currentAuthStatus == .authorizedWhenInUse
                  || currentAuthStatus == .authorizedAlways

        if authed {
            locationManager.startUpdatingLocation()
            CAPLog.print("[CompassHeading] location updates started")
        }

        let frames = CMMotionManager.availableAttitudeReferenceFrames()
        CAPLog.print("[CompassHeading] available frames bitmask =", String(frames.rawValue))

        let frame: CMAttitudeReferenceFrame
        if authed && frames.contains(.xTrueNorthZVertical) {
            frame = .xTrueNorthZVertical
            usingTrueFrame = true
        } else if frames.contains(.xMagneticNorthZVertical) {
            frame = .xMagneticNorthZVertical
            usingTrueFrame = false
        } else {
            frame = .xArbitraryCorrectedZVertical
            usingTrueFrame = false
        }
        CAPLog.print("[CompassHeading] selected frame =", usingTrueFrame ? "true" : "magnetic/arbitrary")

        motionManager.deviceMotionUpdateInterval = 1.0 / 25.0
        motionManager.startDeviceMotionUpdates(using: frame, to: .main) {
            [weak self] motion, error in
            if let error = error {
                CAPLog.print("[CompassHeading] motion handler error:", error.localizedDescription)
                return
            }
            guard let self = self, let motion = motion else { return }
            self.emitHeading(from: motion)
        }

        hasStarted = true
        CAPLog.print(
            "[CompassHeading] startDeviceMotionUpdates issued, isActive =",
            String(motionManager.isDeviceMotionActive)
        )
    }

    /// Yaw -> compass heading conversion.
    /// Reference frame: X=North, Z=Vertical-Up. Yaw is rotation about Z,
    /// positive = counterclockwise viewed from above.
    /// At yaw=0, device's X (right edge in portrait) points north, so device's
    /// Y (top edge in portrait) points west = 270°.
    /// heading_of_top = (270 - yaw_deg) mod 360
    private func emitHeading(from motion: CMDeviceMotion) {
        let yawDeg = motion.attitude.yaw * 180.0 / .pi
        var heading = (270.0 - yawDeg).truncatingRemainder(dividingBy: 360.0)
        if heading < 0 { heading += 360.0 }

        let accuracyDeg: Double
        switch motion.magneticField.accuracy {
        case .high:         accuracyDeg = 5
        case .medium:       accuracyDeg = 15
        case .low:          accuracyDeg = 30
        case .uncalibrated: accuracyDeg = -1
        @unknown default:   accuracyDeg = -1
        }

        let now = Date().timeIntervalSince1970
        if now - lastLogTime > 1.0 {
            CAPLog.print(
                "[CompassHeading] emit heading=", String(format: "%.1f°", heading),
                "acc=", String(format: "%.0f", accuracyDeg),
                "frame=", usingTrueFrame ? "true" : "magnetic"
            )
            lastLogTime = now
        }

        notifyListeners("heading", data: [
            "heading":   heading,
            "accuracy":  accuracyDeg,
            "timestamp": now,
            "frame":     usingTrueFrame ? "true" : "magnetic",
        ])
    }

    // MARK: - CLLocationManagerDelegate

    public func locationManager(_ manager: CLLocationManager,
                                didUpdateLocations locations: [CLLocation]) {
        // No-op: we just need location updates running so CoreMotion can
        // compute true-north declination.
    }

    public func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        CAPLog.print("[CompassHeading] auth changed, status raw =", String(currentAuthStatus.rawValue))
        guard let call = pendingStartCall else { return }
        pendingStartCall = nil
        beginUpdates()
        call.resolve()
    }

    public func locationManager(_ manager: CLLocationManager,
                                didChangeAuthorization status: CLAuthorizationStatus) {
        locationManagerDidChangeAuthorization(manager)
    }

    public func locationManager(_ manager: CLLocationManager,
                                didFailWithError error: Error) {
        CAPLog.print("[CompassHeading] location error:", error.localizedDescription)
    }

    deinit {
        DispatchQueue.main.async { [weak motionManager, weak locationManager] in
            motionManager?.stopDeviceMotionUpdates()
            locationManager?.stopUpdatingLocation()
        }
    }
}
