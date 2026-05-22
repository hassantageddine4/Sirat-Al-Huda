#!/bin/bash
# Sirat Al Huda — Home.jsx prayer times edits
#   1. Countdown shows seconds: "2h 14m 23s"
#   2. Countdown ticks every 1s (was 30s)
#   3. Prayer rows tightened: 13px → 9px vertical padding

set -e

FILE="$HOME/Downloads/sirat-capacitor-3/src/pages/Home.jsx"

if [ ! -f "$FILE" ]; then
  echo "❌ Cannot find $FILE"
  exit 1
fi

echo "→ Editing Home.jsx..."

# useCountdown: switch from minute-resolution to second-resolution
sed -i '' 's|const nowMins = now.getHours() \* 60 + now.getMinutes();|const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();|' "$FILE"
sed -i '' 's|let diff = tMins - nowMins;|let diff = tMins * 60 - nowSecs;|' "$FILE"
sed -i '' 's|if (diff < 0) diff += 1440;|if (diff < 0) diff += 86400;|' "$FILE"
sed -i '' 's|const hh = Math.floor(diff / 60);|const hh = Math.floor(diff / 3600);|' "$FILE"
sed -i '' 's|const mm = diff % 60;|const mm = Math.floor((diff % 3600) / 60); const ss = diff % 60;|' "$FILE"
sed -i '' 's|setLabel(hh > 0 ? `${hh}h ${mm}m` : `${mm}m`);|setLabel(hh > 0 ? `${hh}h ${mm}m ${ss}s` : mm > 0 ? `${mm}m ${ss}s` : `${ss}s`);|' "$FILE"
sed -i '' 's|const id = setInterval(calc, 30000);|const id = setInterval(calc, 1000);|' "$FILE"

# PrayerRow: tighter vertical padding (13 → 9)
sed -i '' 's|paddingTop: 13, paddingBottom: 13,|paddingTop: 9, paddingBottom: 9,|' "$FILE"

echo "✓ All 8 edits applied"
echo ""
echo "Verifying useCountdown:"
sed -n '73,93p' "$FILE"
echo ""
echo "Verifying PrayerRow padding:"
grep -n "paddingTop: 9, paddingBottom: 9" "$FILE"
