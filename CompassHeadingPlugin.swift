import Foundation
import Capacitor
import CoreLocation
import CoreMotion

/**
 * CompassHeadingPlugin (CoreMotion edition)
 *
 * Delivers true-north heading via CMMotionManager's `xTrueNorthZVertical`
 * attitude reference frame — sensor-fused (accelerometer + gyroscope +
 * magnetometer) at 60Hz. This is what Apple's Compass app uses for its
 * tilt-compensated, motion-stable heading.
 *
 * Why this is better than CLHeading:
 *   - 60Hz vs ~10-25Hz update rate
 *   - Gyro fusion: stable under rotation, no settling lag
 *   - Tilt compensation: works even when device isn't perfectly flat
 *   - Less sensitive to local magnetic interference (MagSafe, metal surfaces)
 *
 * CLLocationManager is still kept around purely to obtain a location fix —
 * `xTrueNorthZVertical` requires location authorization so iOS can compute
 * magnetic declination. Without location, we fall back to magnetic frame.
 *
 * Event payload (heading):
 *   {
 *     heading:   Double   // 0–360°, clockwise from true (or magnetic) north
 *     accuracy:  Double   // approx degrees; -1 = uncalibrated
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

    private let motionManager = CMMotionManager()
    private let motionQueue   = OperationQueue()
    private var locationManager: CLLocationManager!
    private var hasStarted = false
    private var usingTrueFrame = false
    private var pendingStartCall: CAPPluginCall?

    public override func load() {
        CAPLog.print("[CompassHeading] plugin loaded (CoreMotion edition)")
        motionQueue.name = "compass.heading.queue"
        motionQueue.qualityOfService = .userInteractive
        DispatchQueue.main.async { [weak self] in self?.setupLocationManager() }
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
        } else {
            return CLLocationManager.authorizationStatus()
        }
    }

    // MARK: - Public API

    @objc func isAvailable(_ call: CAPPluginCall) {
        let hasMotion = motionManager.isDeviceMotionAvailable
        let frames    = CMMotionManager.availableAttitudeReferenceFrames()
        let hasFrame  = frames.contains(.xTrueNorthZVertical)
                     || frames.contains(.xMagneticNorthZVertical)
        call.resolve(["available": hasMotion && hasFrame])
    }

    @objc func start(_ call: CAPPluginCall) {
        guard motionManager.isDeviceMotionAvailable else {
            call.reject("Device motion not available on this device")
            return
        }
        if hasStarted { call.resolve(); return }

        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.setupLocationManager()
            let status = self.currentAuthStatus
            CAPLog.print("[CompassHeading] start() auth =", String(status.rawValue))

            switch status {
            case .authorizedWhenInUse, .authorizedAlways:
                self.beginUpdates()
                call.resolve()

            case .notDetermined:
                self.pendingStartCall = call
                self.locationManager.requestWhenInUseAuthorization()

            case .denied, .restricted:
                // Magnetic frame works without location authorization.
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
            self?.motionManager.stopDeviceMotionUpdates()
            self?.locationManager?.stopUpdatingLocation()
        }
        hasStarted = false
        call.resolve()
    }

    // MARK: - Internals

    private func beginUpdates() {
        // Location only needed so iOS can compute declination for the true frame.
        locationManager.startUpdatingLocation()

        // Prefer true-north if available; magnetic frame is the fallback.
        let frames = CMMotionManager.availableAttitudeReferenceFrames()
        let frame: CMAttitudeReferenceFrame =
            frames.contains(.xTrueNorthZVertical) ? .xTrueNorthZVertical
                                                  : .xMagneticNorthZVertical
        usingTrueFrame = (frame == .xTrueNorthZVertical)

        motionManager.deviceMotionUpdateInterval = 1.0 / 60.0
        motionManager.startDeviceMotionUpdates(using: frame, to: motionQueue) {
            [weak self] motion, error in
            guard let self = self, let motion = motion else { return }
            self.emitHeading(from: motion)
        }

        hasStarted = true
        CAPLog.print("[CompassHeading] motion updates started, frame =",
                     usingTrueFrame ? "true" : "magnetic")
    }

    /// Convert the attitude in xTrueNorthZVertical into a compass heading of
    /// the device's top edge (portrait Y axis), in degrees clockwise from north.
    ///
    /// Reference frame conventions (Apple):
    ///   - Reference X axis points to North; Z axis is vertical (up).
    ///   - Attitude yaw is rotation about Z; positive = counterclockwise when
    ///     viewed from above.
    ///   - At yaw=0, the device's X axis (right edge in portrait) aligns with
    ///     North, so the device's Y axis (top edge in portrait) points West (270°).
    ///   - As yaw increases (device rotates CCW seen from above), the heading
    ///     of the top edge decreases.
    ///
    /// Therefore: heading = (270 - yaw_deg) mod 360
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

        notifyListeners("heading", data: [
            "heading":   heading,
            "accuracy":  accuracyDeg,
            "timestamp": Date().timeIntervalSince1970,
            "frame":     usingTrueFrame ? "true" : "magnetic",
        ])
    }

    // MARK: - CLLocationManagerDelegate

    public func locationManager(_ manager: CLLocationManager,
                                didUpdateLocations locations: [CLLocation]) {
        // No-op: we only need updates to be running so the true-north frame
        // can include declination. Coordinates themselves are unused here.
    }

    public func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        guard let call = pendingStartCall else { return }
        pendingStartCall = nil
        beginUpdates()
        call.resolve()
    }

    // iOS 13 fallback
    public func locationManager(_ manager: CLLocationManager,
                                didChangeAuthorization status: CLAuthorizationStatus) {
        locationManagerDidChangeAuthorization(manager)
    }

    public func locationManager(_ manager: CLLocationManager,
                                didFailWithError error: Error) {
        CAPLog.print("[CompassHeading] location error:", error.localizedDescription)
        // Magnetic-frame heading keeps flowing regardless.
    }

    deinit {
        DispatchQueue.main.async { [weak motionManager, weak locationManager] in
            motionManager?.stopDeviceMotionUpdates()
            locationManager?.stopUpdatingLocation()
        }
    }
}
