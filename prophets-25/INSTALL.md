# Sirat — 25 Prophets

Adds 19 new prophet entries to make the full set of 25 prophets named in the Qur'an.

## What's in the bundle

`prophets-array-only.js` — the new PROPHETS array. Drop-in replacement for lines 12-97 of `src/data/prophetsAndImams.js`.

Existing 6 prophets (Adam, Nuh, Ibrahim, Musa, 'Isa, Muhammad ﷺ) are preserved verbatim. 19 new prophets added in Qur'anic chronological order: Idris, Hud, Salih, Lut, Ismail, Ishaq, Yaqub, Yusuf, Ayyub, Shu'ayb, Harun, Dhul-Kifl, Dawud, Sulayman, Ilyas, Al-Yasa, Yunus, Zakariya, Yahya.

Each entry has the same shape as the existing ones: `id`, `name`, `arabic`, `title`, `period`, `bio` (paragraph), `lessons` (3 bullets), `quranRef`.

The IMAMS array is **not touched** by this update — only PROPHETS gets replaced.

## Install

The cleanest way: open `~/Downloads/sirat-capacitor-3/src/data/prophetsAndImams.js` in a text editor (VS Code, BBEdit, even TextEdit), and:

1. Find line 12 — `export const PROPHETS = [`
2. Find line 97 — `];` (the line that closes the PROPHETS array, just before `export const IMAMS = [`)
3. Replace everything from line 12 through line 97 (inclusive) with the contents of `prophets-array-only.js` (skip the comment header on lines 1-3 of that file — paste from `export const PROPHETS = [` to the closing `];`)
4. Save

Verify it took:

```bash
grep -c "^    id:" ~/Downloads/sirat-capacitor-3/src/data/prophetsAndImams.js
```

Should return **37** (25 prophets + 12 imams).

## Build

```bash
cd ~/Downloads/sirat-capacitor-3 && rm -rf dist ios/App/App/public node_modules/.vite && npm run build && npx cap sync ios
```

Xcode → Cmd+Q → reopen → Shift+Cmd+K → delete app from simulator → Cmd+R.

## After install

Practice → Prophets & Imams → Prophets tab. You should see all 25 names in chronological order from Adam through Muhammad ﷺ. Tap any of them to see bio + lessons + Qur'anic references.

The Imams tab is unchanged — same 12 entries as before.

## A note on the content

I wrote each new entry to match the tone and length of your existing ones — measured, biographical, lesson-oriented. Sources are the Qur'an itself for biographical content, with classical Sunni/Shia tafsir traditions for context where the Qur'an is brief (e.g. Idris, Dhul-Kifl, Al-Yasa).

Before App Store launch, I'd recommend having the prophets data reviewed by qualified scholars — same as the prayer walkthrough recitations. The content is conservative and avoids contested details, but a final pass by someone with credentials in seerah/qisas al-anbiya is the right call before millions of people read it.
