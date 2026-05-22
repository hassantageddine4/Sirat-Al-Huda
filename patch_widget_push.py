import os, sys
p = os.path.expanduser('~/Downloads/sirat-capacitor-3/src/hooks/usePrayerNotifications.js')
t = open(p).read()

# 1. Add import (find an existing import line and append after it)
if 'siratWidget' not in t:
    # Insert near the top after the first import block
    lines = t.split('\n')
    last_import_idx = -1
    for i, line in enumerate(lines):
        if line.startswith('import '):
            last_import_idx = i
    if last_import_idx == -1:
        print("✗ Couldn't find import block")
        sys.exit(1)
    lines.insert(last_import_idx + 1, 'import { pushPrayerTimesToWidget } from "../lib/siratWidget";')
    t = '\n'.join(lines)
    print("✓ Import added")
else:
    print("• Import already present")

# 2. Insert widget push after setPrayerTimes(todayPayload.timings);
old = '''        if (todayPayload?.timings) {
          setPrayerTimes(todayPayload.timings);
        }'''
new = '''        if (todayPayload?.timings) {
          setPrayerTimes(todayPayload.timings);

          // ── Push to Home Screen widget ─────────────────────────────
          const tm = todayPayload.timings;
          const _now = new Date();
          const _y = _now.getFullYear(), _m = _now.getMonth(), _d = _now.getDate();
          const _parse = (s) => {
            if (!s) return null;
            const m = String(s).match(/^(\\d{1,2}):(\\d{2})/);
            return m ? new Date(_y, _m, _d, +m[1], +m[2]) : null;
          };
          const _loc = location?.city || location?.name || location?.address || "";
          void pushPrayerTimesToWidget({
            fajr:    _parse(tm.Fajr),
            sunrise: _parse(tm.Sunrise),
            dhuhr:   _parse(tm.Dhuhr),
            asr:     _parse(tm.Asr),
            maghrib: _parse(tm.Maghrib),
            isha:    _parse(tm.Isha),
          }, _loc);
        }'''

if old in t:
    t = t.replace(old, new)
    print("✓ Widget push inserted")
elif 'pushPrayerTimesToWidget' in t:
    print("• Widget push already present")
else:
    print("✗ Couldn't find setPrayerTimes call to patch — check the file manually")
    sys.exit(1)

open(p, 'w').write(t)
print("\nDone.")
