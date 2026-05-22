# Sirat — Phase C: Calendar, Translations, Scroll Performance, Icon Cleanup

This bundle delivers four upgrades:

1. **Islamic Calendar** replaces the Home "Quick Access" grid
2. **Quran translations** appear under every ayah in `SurahReader`
3. **Virtualized ayah list** for smooth scrolling on long surahs
4. **Icon library** — emoji-free, premium iconography across the app

---

## Install order

Drop these files in over the matching paths in your project. Order doesn't strictly matter, but components import each other in this dependency chain:

```
src/components/common/Icon.jsx                ← foundation, install first
src/components/common/InfoCard.jsx            ← uses Icon
src/services/hijriService.js                  ← Aladhan API wrapper
src/services/quranTranslations.js             ← Quran.com translation fetcher
src/hooks/useHijri.js                         ← hooks over hijriService
src/components/home/IslamicCalendarCard.jsx   ← uses Icon + useHijri
src/pages/Home.jsx                            ← uses IslamicCalendarCard + Icon
src/pages/SurahReader.jsx                     ← uses Icon + quranTranslations
src/pages/PrayerGuide.jsx                     ← uses Icon + InfoCard
src/pages/DailyRoutine.jsx                    ← uses Icon
src/pages/Journal.jsx                         ← uses Icon
```

Then:

```bash
rm -rf dist ios/App/App/public node_modules/.vite
npm run build && npx cap sync ios
```

In Xcode: Shift+Cmd+K → delete app from simulator → Cmd+R.

---

## What changed

### 1. Islamic Calendar (`IslamicCalendarCard.jsx`)
- **Source**: AlAdhan API (`api.aladhan.com/v1`). Imam.org doesn't expose a public REST API — AlAdhan is the de-facto standard for Hijri/Gregorian conversion and Islamic holidays
- Two-tier cache (memory + localStorage, 6-hour TTL)
- Renders: hijri date hero, today's holidays inline, upcoming events ribbon (60 days), expandable 7-column month grid
- Major events (Eid, Ramadan, Ashura, Laylat al-Qadr, Mawlid) highlighted in gold
- Skeleton + fallback states; never breaks the home screen if the network is down

### 2. Quran translations (`quranTranslations.js` + `SurahReader.jsx`)
- Endpoint: `api.quran.com/api/v4/quran/translations/{id}?chapter_number=N`
- Curated list: Khattab (default), Saheeh International, Haleem, Pickthall, Yusuf Ali
- 30-day cache (translations are immutable)
- Translation appears under each ayah, separated by a hairline gold divider
- HTML stripping for footnote tags
- Settings sheet: font-size pills (sm/md/lg/xl), translation toggle, translation picker
- Prefs persist to `sirat_quran_reader_v1`

### 3. Virtualization
- IntersectionObserver-driven — no third-party library
- First 8 ayahs render eagerly; the rest mount as they approach the viewport (400px rootMargin)
- Off-screen ayahs unmount; placeholder reserves height to prevent scroll jumps
- Neighbours pre-mount on intersection so scroll stays smooth
- AyahCard is `React.memo`'d so re-renders are cheap when font/translation prefs are stable

### 4. Icon library (`Icon.jsx`)
- Single `<Icon name="..." size={...} />` component
- 40+ icons covering navigation, status, religious symbols, content types, time, user/community, actions, settings, direction
- All on a 24×24 grid, 1.5–1.75 stroke weight, `currentColor` for theming
- To add a new icon: append an entry to the ICONS map. No call-site changes.

### 5. InfoCard (`InfoCard.jsx`)
- Replaces blue ℹ️ emoji blocks across prayer guides
- Variants: `info`, `tip`, `warning`, `success`
- Each variant has a default icon, but you can override via the `icon` prop
- Used in `PrayerGuide.jsx` for timing notes, wudu reminders, and closing tips

---

## Emoji audit results

Cleaned in this bundle:
- ✅ `Home.jsx` — Quick Access grid removed entirely
- ✅ `PrayerGuide.jsx` — info/tip/warning blocks now use InfoCard
- ✅ `DailyRoutine.jsx` — 🔥 streak flame → `<Icon name="flame">`; section emojis → Icon
- ✅ `Journal.jsx` — mood emojis (🤲✨📿💭🌿) → icon-based mood chips
- ✅ `SurahReader.jsx` — all controls use Icon

**Still uses emojis** (not in this bundle, would need a separate pass):
- `Profile.jsx`
- `Settings.jsx`
- `Community.jsx` (post composer reactions)
- `AsmaUlHusna.jsx` if it has decorative emojis
- `ProphetsAndImams.jsx`

To clean these up later: replace any literal emoji string in JSX with `<Icon name="..." size={...} />`. The Icon library covers most needs; if a specific concept isn't in the registry, add one entry there and use it everywhere.

---

## Performance notes

- The virtualization pattern in `SurahReader.jsx` is portable. To apply it to Hadith chapter pages or a long Community feed, copy the `VirtualizedAyahList` skeleton: ref array → IntersectionObserver → visible Set → `minHeightFor` placeholder.
- All async fetches use `AbortController` and abort on unmount or when the dependent param changes. No stale state leaks.
- `useMemo` and `React.memo` are applied at the boundaries that actually matter (verse list, ayah cards). Don't memoize trivially — it costs more than it saves.

---

## Routes assumed

These should already exist in your `App.jsx` from earlier phases:
- `/` → `Home`
- `/quran/:id` → `SurahReader`
- `/prayer-guide/:prayerKey` → `PrayerGuide`
- `/routine` → `DailyRoutine`
- `/journal` → `Journal`

---

## Tailwind classes assumed

Your `tailwind.config.js` should already define:
- Colors: `primary`, `primary-dark`, `primary-light`, `accent`, `accent-dark`, `accent-light`, `ivory`, `parchment`, `ink`, `body`, `muted`, `border`
- Fonts: `font-display` (Cormorant Garamond), `font-arabic` (Amiri)

Index.css should include the `.press`, `.screen`, `.scroll-area` utility classes from earlier phases.
