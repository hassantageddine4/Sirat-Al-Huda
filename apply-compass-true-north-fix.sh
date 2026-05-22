#!/bin/bash
# Sirat Al Huda — capacitor-compass-heading true-north fix.
#
# Updates the plugin's Swift to start its own CLLocationManager,
# satisfying CMMotionManager's requirement for true-heading correction.
# Falls back to magnetic north if location is denied.
#
# Re-installs the plugin in the app (copy mode) and runs cap sync.

set -e

PLUGIN_DIR="$HOME/Downloads/capacitor-compass-heading"
APP_DIR="$HOME/Downloads/sirat-capacitor-3"
SWIFT_FILE="$PLUGIN_DIR/ios/Plugin/CompassHeadingPlugin.swift"

if [ ! -d "$PLUGIN_DIR" ]; then
  echo "❌ Plugin source not found at $PLUGIN_DIR"
  exit 1
fi
if [ ! -d "$APP_DIR" ]; then
  echo "❌ App not found at $APP_DIR"
  exit 1
fi

echo "→ Writing updated Swift plugin..."

cat > "$SWIFT_FILE" << 'SWIFT_EOF'
import Foundation
import Capacitor
import CoreMotion
import CoreLocation

/**
 * CompassHeadingPlugin
 *
 * Wraps CMMotionManager.startDeviceMotionUpdates(using: .xTrueNorthZVertical)
 * to deliver Apple-fused (accel + gyro + magnetometer) heading at 60Hz.
 *
 * CMMotionManager's xTrueNorthZVertical reference frame requires an active
 * CLLocationManager session so iOS can compute magnetic declination from
 * the device's current location. This plugin owns its own CLLocationManager
 * to guarantee that. If location is denied, falls back to magnetic north.
 */
@objc(CompassHeadingPlugin)
public class CompassHeadingPlugin: CAPPlugin, CAPBridgedPlugin, CLLocationManagerDelegate {
    public let identifier  = "CompassHeadingPlugin"
    public let jsName      = "CompassHeading"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "start",       returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop",        returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
    ]

    private let motionManager   = CMMotionManager()
    private var locationManager: CLLocationManager!
    private let updateQueue     = OperationQueue()
    private var pendingStartCall: CAPPluginCall?
    private var hasStartedMotion = false

    public override func load() {
        updateQueue.qualityOfService = .userInteractive
        updateQueue.name             = "com.sirat.compass-heading"
        updateQueue.maxConcurrentOperationCount = 1

        // CLLocationManager must be created and used on the main thread.
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.locationManager = CLLocationManager()
            self.locationManager.delegate = self
            // Loose accuracy — we don't need precise location, only an active
            // session so CMMotionManager can compute declination.
            self.locationManager.desiredAccuracy = kCLLocationAccuracyKilometer
            self.locationManager.distanceFilter  = 10_000
        }
    }

    private var currentAuthStatus: CLAuthorizationStatus {
        if #available(iOS 14.0, *) {
            return locationManager?.authorizationStatus ?? .notDetermined
        } else {
            return CLLocationManager.authorizationStatus()
        }
    }

    @objc func isAvailable(_ call: CAPPluginCall) {
        call.resolve(["available": motionManager.isDeviceMotionAvailable])
    }

    @objc func start(_ call: CAPPluginCall) {
        guard motionManager.isDeviceMotionAvailable else {
            call.reject("Device motion not available on this device")
            return
        }

        if hasStartedMotion {
            call.resolve()
            return
        }

        // Ensure locationManager has been created (load() runs async).
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }

            if self.locationManager == nil {
                self.locationManager = CLLocationManager()
                self.locationManager.delegate = self
                self.locationManager.desiredAccuracy = kCLLocationAccuracyKilometer
                self.locationManager.distanceFilter  = 10_000
            }

            let status = self.currentAuthStatus

            switch status {
            case .authorizedWhenInUse, .authorizedAlways:
                self.locationManager.startUpdatingLocation()
                self.startMotionUpdates(useTrueNorth: true)
                call.resolve()

            case .notDetermined:
                // Stash the call; resume in didChangeAuthorization.
                self.pendingStartCall = call
                self.locationManager.requestWhenInUseAuthorization()

            case .denied, .restricted:
                // No location → use magnetic north (no declination correction).
                self.startMotionUpdates(useTrueNorth: false)
                call.resolve()

            @unknown default:
                self.startMotionUpdates(useTrueNorth: false)
                call.resolve()
            }
        }
    }

    private func startMotionUpdates(useTrueNorth: Bool) {
        if motionManager.isDeviceMotionActive { return }

        motionManager.deviceMotionUpdateInterval = 1.0 / 60.0

        let frame: CMAttitudeReferenceFrame = useTrueNorth
            ? .xTrueNorthZVertical
            : .xMagneticNorthZVertical

        motionManager.startDeviceMotionUpdates(using: frame, to: updateQueue) { [weak self] motion, error in
            guard let self = self else { return }

            if let error = error {
                self.notifyListeners("error", data: ["message": error.localizedDescription])
                return
            }

            guard let motion = motion else { return }

            self.notifyListeners("heading", data: [
                "heading":   motion.heading,
                "accuracy":  motion.magneticField.accuracy.rawValue,
                "timestamp": motion.timestamp,
                "frame":     useTrueNorth ? "true" : "magnetic",
            ])
        }

        hasStartedMotion = true
    }

    // ── CLLocationManagerDelegate ──

    public func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        handleAuthChange()
    }

    // iOS 13 fallback
    public func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        handleAuthChange()
    }

    private func handleAuthChange() {
        guard let call = pendingStartCall else { return }
        let status = currentAuthStatus

        switch status {
        case .authorizedWhenInUse, .authorizedAlways:
            pendingStartCall = nil
            locationManager.startUpdatingLocation()
            startMotionUpdates(useTrueNorth: true)
            call.resolve()

        case .denied, .restricted:
            pendingStartCall = nil
            startMotionUpdates(useTrueNorth: false)
            call.resolve()

        case .notDetermined:
            break // still waiting on user

        @unknown default:
            pendingStartCall = nil
            startMotionUpdates(useTrueNorth: false)
            call.resolve()
        }
    }

    public func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        // No-op: we only need CLLocationManager to be active. GPS failures
        // are irrelevant to compass heading.
    }

    @objc func stop(_ call: CAPPluginCall) {
        if motionManager.isDeviceMotionActive {
            motionManager.stopDeviceMotionUpdates()
        }
        DispatchQueue.main.async { [weak self] in
            self?.locationManager?.stopUpdatingLocation()
        }
        hasStartedMotion = false
        call.resolve()
    }

    deinit {
        if motionManager.isDeviceMotionActive {
            motionManager.stopDeviceMotionUpdates()
        }
    }
}
SWIFT_EOF

echo "✓ Swift file written"
echo ""
echo "→ Re-installing plugin in app (copy mode)..."
cd "$APP_DIR"
npm install --install-links "../capacitor-compass-heading"

echo ""
echo "→ Running cap sync..."
npx cap sync ios

echo ""
echo "✓ Done. Now rebuild:"
echo "  cd $APP_DIR && npm run build && npx cap sync ios"
