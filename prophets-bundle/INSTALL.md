# Sirat — Prophets & Imams + 99 Names

Four files. Adds the Prophets & Imams feature, registers the route, and includes the previously-built 99 Names route too.

## What's inside

```
src/App.jsx                        ← all routes including /practice/prophets
src/pages/Practice.jsx             ← 12-card grid with all working modules
src/pages/ProphetsAndImams.jsx     ← new screen with tabs + detail view
src/data/prophetsAndImams.js       ← bio data
```

## Install

After unzipping `prophets-bundle.zip` to your Downloads:

```bash
cp ~/Downloads/prophets-bundle/src/App.jsx ~/Downloads/sirat-capacitor-3/src/App.jsx
cp ~/Downloads/prophets-bundle/src/pages/Practice.jsx ~/Downloads/sirat-capacitor-3/src/pages/Practice.jsx
cp ~/Downloads/prophets-bundle/src/pages/ProphetsAndImams.jsx ~/Downloads/sirat-capacitor-3/src/pages/ProphetsAndImams.jsx
mkdir -p ~/Downloads/sirat-capacitor-3/src/data
cp ~/Downloads/prophets-bundle/src/data/prophetsAndImams.js ~/Downloads/sirat-capacitor-3/src/data/prophetsAndImams.js
```

## Build

```bash
cd ~/Downloads/sirat-capacitor-3
rm -rf dist ios/App/App/public node_modules/.vite
npm run build && npx cap sync ios
```

## What's now reachable

Tap **Practice** in the bottom nav. You'll see 12 cards — every one of them works:

- Recitation Practice
- Prayer Guide
- Wudu Guide
- Daily Duas
- Islam Basics
- Dhikr Counter (inline)
- 99 Names of Allah
- Hadith Collection
- Daily Routine
- **Prophets & Imams** ← new
- Qibla Compass
- Ask a Scholar (opens imam-us.org)

## Prophets & Imams content

**Prophets tab:** Adam, Nuh, Ibrahim, Musa, 'Isa, and Prophet Muhammad ﷺ — each with bio, lessons, and Qur'an reference.

**Imams tab:** All 12 Imams (Ali, Hasan, Husayn, Zayn al-Abidin, al-Baqir, al-Sadiq, al-Kazim, al-Rida, al-Jawad, al-Hadi, al-Askari, al-Mahdi) — each with bio and lessons.

The Imams tab opens with an info card noting that this is the Shia tradition's view, and that Imam Ali is also the fourth caliph in Sunni tradition. This keeps the screen inclusive without requiring users to choose a tradition.

## Want more prophets?

If you want to expand the prophets list (Yusuf, Sulaiman, Ya'qub, Yunus, Idris, Hud, Salih, Lut, etc.), say the word and I'll add them in the same format.
