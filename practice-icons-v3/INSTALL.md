# Sirat — Practice Icons Bundle v3 (FINAL)

Final icon set for the Practice screen. Two changes from v2:

1. **`duaHands` → `duaBook`** — replaced the two-cupped-hands icon with an open book + light above. Reads as illuminated supplications.
2. **`bookOpen` refined** — Islam Basics's icon redrawn to match `duaBook`'s curve language and proportions, but without the light or text lines. Same family, different role.

## Final Practice grid

| Card | Icon |
|---|---|
| Recitation Practice | `waveform` |
| Prayer Guide | `mihrab` |
| Wudu Guide | `droplet` |
| Daily Duas | `duaBook` ✨ NEW |
| Islam Basics | `bookOpen` ✨ REFINED |
| Dhikr Counter | `beads` |
| 99 Names of Allah | `tasbih` |
| Hadith Collection | `scroll` |
| Daily Routine | `checklist` |
| Prophets & Imams | `users` |
| Qibla Compass | `kaaba` |
| Ask a Scholar | `message` |

## What's inside

```
src/components/common/Icon.jsx  ← 59 icons, with refined duaBook + bookOpen
src/pages/Practice.jsx          ← uses duaBook for Daily Duas
```

## Install

```bash
cp ~/Downloads/practice-icons-v3/src/components/common/Icon.jsx ~/Downloads/sirat-capacitor-3/src/components/common/Icon.jsx
cp ~/Downloads/practice-icons-v3/src/pages/Practice.jsx ~/Downloads/sirat-capacitor-3/src/pages/Practice.jsx

cd ~/Downloads/sirat-capacitor-3 && rm -rf dist ios/App/App/public node_modules/.vite && npm run build && npx cap sync ios
```

Xcode: Cmd+Q → reopen workspace → Shift+Cmd+K → remove app from simulator → Cmd+R.

## After install

Take a screenshot of the full Practice grid. All 12 cards should now have icons that feel like one cohesive set. If the build passes and the cards look right, the icon system is done.

## Note: bookOpen used elsewhere

`bookOpen` is in your central Icon library, so the refined version applies anywhere it's used app-wide — not just on the Practice card. If you've used `bookOpen` on other screens (Quran section, Hadith reader, etc.), they'll all get the cleaner version automatically.

If for some reason you wanted the old `bookOpen` to stay on those other screens, we'd need to add the new one as a different icon name (e.g. `bookOpenRefined`). But I'd recommend keeping the change global — the new one is better.
