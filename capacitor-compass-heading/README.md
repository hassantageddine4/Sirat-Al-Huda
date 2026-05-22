# capacitor-compass-heading

Native CoreMotion-fused compass heading for Capacitor 6 (iOS-only).

Wraps `CMMotionManager.startDeviceMotionUpdates(using: .xTrueNorthZVertical)`
to deliver Apple-fused (accel + gyro + magnetometer) heading at 60Hz — the
same pipeline Apple's Compass app uses.

## Install (local file dependency)

From the consuming app:

```bash
npm install ../capacitor-compass-heading
npx cap sync ios
```

## Usage

```js
import { CompassHeading } from 'capacitor-compass-heading';

const { available } = await CompassHeading.isAvailable();
if (!available) return;

await CompassHeading.start();

const sub = await CompassHeading.addListener('heading', (e) => {
  // e: { heading: number (0–360), accuracy: number (-1 to 3), timestamp: number }
});

// On teardown:
sub.remove();
await CompassHeading.stop();
```

## Requirements

- iOS 13+
- Location services authorized (already granted in Sirat for prayer times).
