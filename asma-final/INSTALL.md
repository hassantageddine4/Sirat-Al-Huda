# Sirat — 99 Names + Routes Update

Three files. Drop in, build, done.

## What's in this bundle

```
src/App.jsx                       ← all routes (Hadith, 99 Names, Daily Routine, Legal)
src/pages/AsmaUlHusna.jsx         ← 99 Names screen
src/data/asmaUlHusna.js           ← 99 Names data
```

## Install

After unzipping `asma-final.zip` to your Downloads folder:

```bash
cp ~/Downloads/asma-final/src/App.jsx ~/Downloads/sirat-capacitor-3/src/App.jsx
cp ~/Downloads/asma-final/src/pages/AsmaUlHusna.jsx ~/Downloads/sirat-capacitor-3/src/pages/AsmaUlHusna.jsx
mkdir -p ~/Downloads/sirat-capacitor-3/src/data
cp ~/Downloads/asma-final/src/data/asmaUlHusna.js ~/Downloads/sirat-capacitor-3/src/data/asmaUlHusna.js
```

## Build

```bash
cd ~/Downloads/sirat-capacitor-3
rm -rf dist ios/App/App/public node_modules/.vite
npm run build && npx cap sync ios
```

Then in Xcode: Cmd+Q → reopen workspace → Shift+Cmd+K → remove app from simulator → Cmd+R.

## What's now reachable

These routes work after this update:

- `/practice/names` → 99 Names of Allah
- `/hadith` → Hadith landing
- `/hadith/:collectionId` → collection chapters
- `/hadith/:collectionId/chapter/:n` → chapter hadiths
- `/hadith/:collectionId/hadith/:n` → single hadith
- `/routine` → Daily Routine
- `/legal/privacy` → Privacy Policy
- `/legal/terms` → Terms of Service

## Adding a "99 Names" link to the Practice screen

Once the build passes, you'll want users to actually find the 99 Names page. Open `src/pages/Practice.jsx` and find the array of practice modules. Add an entry like:

```jsx
{ icon: "star", label: "99 Names", route: "/practice/names" }
```

If you want me to do that for you, paste your `Practice.jsx` and I'll write the patch.
