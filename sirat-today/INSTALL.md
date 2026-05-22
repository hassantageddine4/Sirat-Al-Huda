# Sirat — Today's Updates (Combined Bundle)

Everything built in today's session, in one drop-in package.

## What's inside

Three separate features merged into one `src/` tree:

1. **Hadith section** — full reading + search + bookmarks (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah)
2. **Phase C** — Islamic Calendar replaces Quick Access on Home, Quran translations under each ayah, virtualized scrolling, Icon library, emoji cleanup
3. **Legal & Permissions** — Terms / Privacy screens, Settings legal section, auth footer links, native iOS permission handling

## Install — one command

From your project root:

```bash
cd ~/Downloads/sirat-capacitor-3

# Backup first (recommended)
cp -r src src.backup-before-today

# Drop in everything
cp -R /path/to/sirat-today/src/. src/
```

If you unzipped this to your Downloads, that's:

```bash
cp -R ~/Downloads/sirat-today/src/. ~/Downloads/sirat-capacitor-3/src/
```

## Then install the new packages

For the Legal/Permissions bundle to work, you need these Capacitor plugins:

```bash
cd ~/Downloads/sirat-capacitor-3
npm install @capacitor/geolocation @capacitor/local-notifications @capacitor/browser @capacitor/app
npm install @capacitor-community/speech-recognition@6.0.0
```

(You already have most of these — npm will skip the ones that are present.)

## Add Info.plist usage strings

**REQUIRED — App Store will reject without these.** See `INFO_PLIST_USAGE.md` for the exact strings to paste into `ios/App/App/Info.plist`.

## Add the legal routes to App.jsx

See `APP_ROUTES_PATCH.md`. Two new routes to add:

```jsx
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy  from "./pages/legal/PrivacyPolicy";

<Route path="/legal/terms"   element={<TermsOfService />} />
<Route path="/legal/privacy" element={<PrivacyPolicy />} />
```

You also need to add Hadith routes if they don't exist yet:

```jsx
import Hadith            from "./pages/Hadith";
import HadithCollection  from "./pages/HadithCollection";
import HadithChapter     from "./pages/HadithChapter";
import HadithReader      from "./pages/HadithReader";

<Route path="/hadith"                                          element={<Hadith />} />
<Route path="/hadith/:collectionId"                            element={<HadithCollection />} />
<Route path="/hadith/:collectionId/chapter/:sectionNumber"     element={<HadithChapter />} />
<Route path="/hadith/:collectionId/hadith/:hadithNumber"       element={<HadithReader />} />
```

## Wire up Settings and Auth screens

In your `Settings.jsx`:

```jsx
import SettingsLegalSection from "../components/legal/SettingsLegalSection";

// inside your render, anywhere below account settings:
<SettingsLegalSection />
```

In your `SignIn.jsx` and `SignUp.jsx`:

```jsx
import AuthLegalFooter from "../components/legal/AuthLegalFooter";

// at the bottom:
<AuthLegalFooter context="signin" />   // or "signup"
```

## Build and sync

```bash
rm -rf dist ios/App/App/public node_modules/.vite
npm run build && npx cap sync ios
```

Then in Xcode:
1. Cmd+Q to fully quit
2. Reopen with `open ios/App/App.xcworkspace`
3. Shift+Cmd+K to clean
4. Long-press Sirat in simulator → Remove App
5. Cmd+R

## Smoke test

After it boots, verify:

- **Home** — calendar replaces Quick Access, hijri date showing, upcoming events ribbon
- **Quran** — open any surah; English translation appears under each ayah; settings sheet (top right) lets you toggle translation and pick translator
- **Hadith** (in nav menu) — six collections list; tap one → chapters; tap chapter → hadith list; tap hadith → full reader
- **Settings → Legal** — Terms, Privacy, Apple EULA (opens Safari), Contact (opens Mail)
- **Auth screens** — Terms / Privacy footer links visible
- **Qibla** — first tap shows explainer sheet, then iOS native location prompt
- **Daily Routine** — flame icon (no emoji) for streak; clean section icons
- **Journal** — mood chips show icons (heart, moon, compass, star, prayer), no emojis
- **Prayer Guide** — info callouts use clean InfoCard, no blue ℹ️ emoji blocks

## Files in this bundle

```
src/
├── components/
│   ├── common/
│   │   ├── Icon.jsx                    ← icon library, replaces emojis
│   │   └── InfoCard.jsx                ← replaces blue info-emoji blocks
│   ├── home/
│   │   └── IslamicCalendarCard.jsx     ← replaces Quick Access on Home
│   └── legal/
│       ├── AuthLegalFooter.jsx
│       ├── LegalDocLayout.jsx
│       ├── PermissionDenied.jsx
│       ├── PermissionExplainer.jsx
│       └── SettingsLegalSection.jsx
├── hooks/
│   ├── useHadith.js
│   ├── useHijri.js
│   └── usePermissionFlow.js
├── pages/
│   ├── DailyRoutine.jsx                ← emojis removed
│   ├── Hadith.jsx                      ← landing page
│   ├── HadithChapter.jsx
│   ├── HadithCollection.jsx
│   ├── HadithReader.jsx
│   ├── Home.jsx                        ← Quick Access removed, calendar added
│   ├── Journal.jsx                     ← mood emojis → icon chips
│   ├── PrayerGuide.jsx                 ← blue info emojis → InfoCard
│   ├── SurahReader.jsx                 ← virtualized + translations
│   └── legal/
│       ├── PrivacyPolicy.jsx
│       └── TermsOfService.jsx
└── services/
    ├── hadithBookmarks.js
    ├── hadithService.js                ← fawazahmed0/hadith-api wrapper
    ├── hijriService.js                 ← Aladhan API wrapper
    ├── permissionsService.js           ← Capacitor permission plugins wrapper
    └── quranTranslations.js            ← Quran.com translation fetcher

PHASE_C_README.md       ← detail on calendar/translations/icons
LEGAL_README.md         ← detail on legal/permissions
INFO_PLIST_USAGE.md     ← REQUIRED Info.plist strings
APP_ROUTES_PATCH.md     ← routes to add
INSTALL.md              ← this file
```

## Tailwind config check

These files assume your `tailwind.config.js` defines:
- Colors: `primary`, `primary-dark`, `primary-light`, `accent`, `accent-dark`, `accent-light`, `ivory`, `parchment`, `ink`, `body`, `muted`, `border`
- Fonts: `font-display` (Cormorant Garamond), `font-arabic` (Amiri)

If something looks unstyled after install, tailwind tokens are most likely missing. Compare your `tailwind.config.js` to what's referenced in any of the new components and add anything missing.

## What still needs your action

Before App Store submission:

1. Update `SUPPORT_EMAIL` (currently `support@sirat.app`) in:
   - `src/components/legal/SettingsLegalSection.jsx`
   - `src/pages/legal/TermsOfService.jsx`
   - `src/pages/legal/PrivacyPolicy.jsx`
2. Host the legal docs at a public URL (Apple needs a privacy policy URL during submission)
3. Have a lawyer review the legal templates
4. Add Sign in with Apple if you support any third-party social login (Apple App Store Review Guideline 4.8)
