# Sirat — Polish Bundle

Fixes the three things you flagged:

1. **Settings page** — emojis removed, every row uses real icons (user, bell, shield, scroll, info, message, trash, etc.). Switch toggle is properly accessible. Delete account modal uses an icon, not 🗑️.
2. **Prayer Guide** — was showing "unavailable" because Practice navigates to `/practice/prayer-guide` without a prayer key. Now: tapping it shows a clean 5-card picker (Fajr / Dhuhr / Asr / Maghrib / Isha) with icons and timings. Tap a prayer → drill into the step-by-step.
3. **Islamic Calendar** — your existing calendar section is replaced with a premium dark-gradient hero card showing the big hijri day number, month, year, and upcoming events with major events (Eid, Ramadan, Ashura, Laylat al-Qadr, Mawlid) highlighted in gold.

## What's inside

```
src/App.jsx                        ← adds /practice/prayer-guide/:prayerKey route
src/pages/Settings.jsx             ← rewritten, emoji-free, real icons
src/pages/PrayerGuide.jsx          ← shows picker when no key, detail when key
src/pages/Home.jsx                 ← redesigned Islamic Calendar section
```

## Install

After unzipping `polish-bundle.zip` to your Downloads:

```bash
cp ~/Downloads/polish-bundle/src/App.jsx ~/Downloads/sirat-capacitor-3/src/App.jsx
cp ~/Downloads/polish-bundle/src/pages/Settings.jsx ~/Downloads/sirat-capacitor-3/src/pages/Settings.jsx
cp ~/Downloads/polish-bundle/src/pages/PrayerGuide.jsx ~/Downloads/sirat-capacitor-3/src/pages/PrayerGuide.jsx
cp ~/Downloads/polish-bundle/src/pages/Home.jsx ~/Downloads/sirat-capacitor-3/src/pages/Home.jsx
```

## Build

```bash
cd ~/Downloads/sirat-capacitor-3
rm -rf dist ios/App/App/public node_modules/.vite
npm run build && npx cap sync ios
```

Xcode: Cmd+Q → reopen workspace → Shift+Cmd+K → remove app from simulator → Cmd+R.

## Smoke test

- **Home** — calendar at the bottom is now a dark gradient with a big "27 Ramadan" hero (or whatever the current hijri date is), and upcoming events with gold-highlighted major events.
- **Practice → Prayer Guide** — tap it. You see five cards: Fajr (sunrise icon), Dhuhr (clock), Asr (clock), Maghrib (sunset), Isha (moon). Tap any → step-by-step guide.
- **Settings** — every row has a real icon (user, bell, info, etc.). Toggle for prayer reminders works. Delete modal shows a real trash icon, not the 🗑️ emoji.

Paste the build output. If it passes, do the smoke test in the simulator and tell me what's still missing or off.
