# Sirat — Home Redesign (Option B)

Premium Islamic dashboard layout per the design spec. **One file:** `src/pages/Home.jsx`.

## What changed

**New structure:**
1. **Header** — greeting, location, hijri pill, settings button + glanceable progress block (count, countdown to next, gold-tinted bar, 5 prayer dots)
2. **Verse of the Day** — emerald gradient card with English left, Arabic right, gold reference at bottom
3. **Islamic Calendar** — cream/parchment card with large hijri day number, gregorian date, gold accent line, upcoming events with countdown badges
4. **Today's Prayers** — clean white list with completion icons (filled green for done, gold for current, outlined for upcoming), Arabic names, "NEXT" badge

**Removed:**
- Old Quick Access tile section (Quran/Dhikr/Duas/Journal tiles)
- Old "next prayer" hero card
- Weekly chart
- Prayer progress bar embedded in header (replaced with the glanceable block)
- All decorative emojis

**Preserved (unchanged):**
- `useApp()` for user profile
- `usePrayerNotifications()` for live prayer times + location + loading/error states
- `getDailyVerse()` for daily verse loading
- `getAccurateHijriDate()` + `getUpcomingIslamicEvents()` from your hijri util
- localStorage persistence for completed prayers (today only)
- Countdown timer to next prayer
- Tap-to-toggle prayer rows

## Install

```bash
cp ~/Downloads/home-redesign/src/pages/Home.jsx ~/Downloads/sirat-capacitor-3/src/pages/Home.jsx

cd ~/Downloads/sirat-capacitor-3 && rm -rf dist ios/App/App/public node_modules/.vite && npm run build && npx cap sync ios
```

Xcode: Cmd+Q → reopen → Shift+Cmd+K → remove app from simulator → Cmd+R.

## Smoke test after install

1. Open the app → Home screen loads
2. Header shows: "Good [time-of-day], [name]" + location + hijri pill + settings icon
3. Glanceable progress block shows X/5 prayers, countdown to next, gold bar, 5 prayer dots
4. Scroll down → Verse of the Day in emerald card
5. Below: "Islamic Calendar" section label, cream card with large hijri day, gregorian date, upcoming events
6. Below: "Today's Prayers" section label, white card with 5 prayer rows
7. Tap a prayer row → status circle fills green, progress count + bar update
8. Tap Asr (or whichever is "NEXT") → NEXT badge disappears, next prayer becomes the new NEXT

## What this assumes about your services

The new Home.jsx works with whatever prayer time / hijri / verse data your existing services return. If `usePrayerNotifications()` doesn't return live times yet (e.g. you haven't granted location), the card shows fallback times (5:42 AM Fajr etc.) — same fallback as the old Home.

If `getDailyVerse()` returns nothing, the card shows the fallback verse "Indeed, with hardship comes ease" (Sūrah Ash-Sharḥ 94:6).

If `getUpcomingIslamicEvents()` returns an empty array, the calendar card shows "No major events in the next 60 days."

## If something breaks

Most likely cause: a service signature change I didn't account for. The Home.jsx expects:

- `usePrayerNotifications()` returns `{ prayerTimes, location, loading, error }`
- `getDailyVerse()` returns `{ verse: { arabic, translation, reference, ref } }` (or null/undefined)
- `getAccurateHijriDate()` returns `{ day, month, year }`
- `getUpcomingIslamicEvents()` returns array of `{ name, hijriLabel, days }`

If your services return different shapes, the build will fail or the screen will render blank. Send me the build error and I'll patch.
