# Sirat — Practice Icons Bundle

Three changes:

1. **Bigger Practice card icons** — 32px (up from 18px) on a 56×56 tile (up from 36×36)
2. **Premium tile background** — subtle green tint + gold border ring + inset highlight, on every card. No more rainbow of pastel card backgrounds — a single ivory background unifies the grid.
3. **Three new Islamic icons:**
   - **`mihrab`** — prayer niche silhouette (used on Prayer Guide card)
   - **`kaaba`** — refined cube with kiswa band (used on Qibla Compass card)
   - **`star8`** — 8-pointed Rub el Hizb star (used on 99 Names of Allah card)

## What's inside

```
src/components/common/Icon.jsx  ← adds mihrab, kaaba (refined), star8, plus arrowDown/arrowLeft/sparkle/bell that I noticed were missing or could be useful
src/pages/Practice.jsx          ← redesigned card grid with bigger icons + gold-tile aesthetic
```

## Install

```bash
cp ~/Downloads/practice-icons-bundle/src/components/common/Icon.jsx ~/Downloads/sirat-capacitor-3/src/components/common/Icon.jsx
cp ~/Downloads/practice-icons-bundle/src/pages/Practice.jsx ~/Downloads/sirat-capacitor-3/src/pages/Practice.jsx
```

## Build

```bash
cd ~/Downloads/sirat-capacitor-3 && rm -rf dist ios/App/App/public node_modules/.vite && npm run build && npx cap sync ios
```

Xcode: Cmd+Q → reopen workspace → Shift+Cmd+K → remove app from simulator → Cmd+R.

## What you'll see

Practice screen, 12 cards in a 2-column grid:
- All cards have ivory backgrounds (no more pastel rainbow)
- Each card has a 56×56 icon tile with subtle green tint and a thin gold border
- Icons are 32px, gold-toned green, the visual anchor of each card
- Prayer Guide → mihrab (prayer niche)
- Qibla Compass → kaaba (cube with kiswa)
- 99 Names → star8 (8-pointed Rub el Hizb)

The other 9 icons stay as they were, just rendered larger.

## After install

If the cards look right, we apply this same icon-on-tile aesthetic to Home's Quick Access section next.

If something looks off — too big, wrong color, weird spacing — take a screenshot and tell me what's wrong. I'll iterate on the specific thing.

If the build fails, paste the error.
