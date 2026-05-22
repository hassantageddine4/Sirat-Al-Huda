#!/usr/bin/env python3
import pathlib, sys

P = pathlib.Path.home() / "Downloads/sirat-capacitor-3/src/hooks/usePrayerNotifications.js"
s = P.read_text()

if "pushWidgetConfig(" in s:
    print("Already present, no change.")
    sys.exit(0)

anchor = "setPrayerTimes(todayPayload.timings);"
if anchor not in s:
    print(f"Anchor not found: {anchor}", file=sys.stderr)
    sys.exit(1)

injection = anchor + """

          // Push location + calculation config so the widget computes prayer
          // times locally via AdhanSwift. Runs whenever times refresh.
          try {
            pushWidgetConfig({
              lat: location?.lat,
              lon: location?.lon,
              method: prefs?.calcMethod != null ? String(prefs.calcMethod) : undefined,
              methodCode: typeof prefs?.calcMethod === 'number' ? prefs.calcMethod : undefined,
              madhab: prefs?.madhab != null ? String(prefs.madhab) : 'Shafi',
              branch: (typeof localStorage !== 'undefined' ? localStorage.getItem('sirat_branch') : null) || 'sunni',
              locationName: location?.city || location?.name || location?.address || '',
            });
          } catch (_e) { /* widget config push best-effort */ }"""

s = s.replace(anchor, injection, 1)
P.write_text(s)
print(f"Patched {P}")
