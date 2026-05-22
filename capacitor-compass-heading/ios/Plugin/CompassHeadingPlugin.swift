import Foundation
import Capacitor
import CoreMotion

/**
 * CompassHeadingPlugin
 *
 * Wraps CMMotionManager.startDeviceMotionUpdates(using: .xTrueNorthZVertical)
 * to deliver Apple-fused (accelerometer + gyroscope + magnetometer) heading
 * data at 60Hz. This is the same sensor pipeline Apple's Compass app uses.
 *
 * Why this matters: DeviceOrientationEvent.webkitCompassHeading in the WebView
 * gives you the magnetometer's post-processed output BEFORE gyro fusion. No
 * amount of JS-side smoothing can recover information the source signal lacks.
 * This plugin gets the fused stream directly.
 */
@objc(CompassHeadingPlugin)
public class CompassHeadingPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier  = "CompassHeadingPlugin"
    public let jsName      = "CompassHeading"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "start",       returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop",        returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
    ]

    private let motionManager = CMMotionManager()
    private let updateQueue   = OperationQueue()

    public override func load() {
        updateQueue.qualityOfService = .userInteractive
        updateQueue.name             = "com.sirat.compass-heading"
        updateQueue.maxConcurrentOperationCount = 1
    }

    @objc func isAvailable(_ call: CAPPluginCall) {
        call.resolve([
            "available": motionManager.isDeviceMotionAvailable,
        ])
    }

    @objc func start(_ call: CAPPluginCall) {
        guard motionManager.isDeviceMotionAvailable else {
            call.reject("Device motion not available on this device")
            return
        }

        // Idempotent: re-starting just resolves.
        if motionManager.isDeviceMotionActive {
            call.resolve()
            return
        }

        // 60Hz delivery matches typical display refresh.
        motionManager.deviceMotionUpdateInterval = 1.0 / 60.0

        // xTrueNorthZVertical: attitude relative to TRUE north (corrected for
        // magnetic declination using current location). Requires location
        // services authorization — Sirat already has this for prayer times.
        motionManager.startDeviceMotionUpdates(
            using: .xTrueNorthZVertical,
            to: updateQueue
        ) { [weak self] motion, error in
            guard let self = self else { return }

            if let error = error {
                self.notifyListeners("error", data: [
                    "message": error.localizedDescription,
                ])
                return
            }

            guard let motion = motion else { return }

            // motion.heading  : Double, 0–360°, 0 = true north, clockwise.
            // accuracy.rawValue: -1 uncalibrated, 0 low, 1 medium, 2 high.
            self.notifyListeners("heading", data: [
                "heading":   motion.heading,
                "accuracy":  motion.magneticField.accuracy.rawValue,
                "timestamp": motion.timestamp,
            ])
        }

        call.resolve()
    }

    @objc func stop(_ call: CAPPluginCall) {
        if motionManager.isDeviceMotionActive {
            motionManager.stopDeviceMotionUpdates()
        }
        call.resolve()
    }

    deinit {
        if motionManager.isDeviceMotionActive {
            motionManager.stopDeviceMotionUpdates()
        }
    }
}
