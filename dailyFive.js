// src/data/prayerWalkthrough/dailyFive.js
// ─────────────────────────────────────────────────────────────────────────────
// The five daily obligatory prayers.
//
// Fajr now uses the FULL instructional rewrite from instructions_drafts/fajr.js
// — reviewed and approved by Hassan. The rich step content with body
// instructions, recitation notes, transitions, sources, and per-step madhhab
// notes is now the live Fajr walkthrough.
//
// Dhuhr / Asr / Maghrib / Isha remain on the legacy RakahBuilder until their
// drafts in instructions_drafts/ are reviewed and approved. To swap them
// over after review, add the import and replace the export the same way as
// Fajr below.
// ─────────────────────────────────────────────────────────────────────────────

import { RakahBuilder } from "./stepBuilders";
import { fajrDraft } from "./instructions_drafts/fajr";

// Fajr — full instructional rewrite (reviewed)
export const fajr = fajrDraft;

export const dhuhr = {
  id: "dhuhr",
  name: "Dhuhr",
  arabicName: "الظهر",
  subtitle: "Midday prayer",
  rakahCount: 4,
  category: "obligatory",
  tradition: "both",
  summary: "Four rakahs prayed silently after the sun has passed its zenith.",
  rakahs: [
    RakahBuilder.first("dhuhr", false),
    RakahBuilder.second("dhuhr", false, false),
    RakahBuilder.laterRakah("dhuhr", 3, false),
    RakahBuilder.laterRakah("dhuhr", 4, true),
  ],
};

export const asr = {
  id: "asr",
  name: "Asr",
  arabicName: "العصر",
  subtitle: "Afternoon prayer",
  rakahCount: 4,
  category: "obligatory",
  tradition: "both",
  summary: "Four rakahs prayed silently in the afternoon.",
  rakahs: [
    RakahBuilder.first("asr", false),
    RakahBuilder.second("asr", false, false),
    RakahBuilder.laterRakah("asr", 3, false),
    RakahBuilder.laterRakah("asr", 4, true),
  ],
};

export const maghrib = {
  id: "maghrib",
  name: "Maghrib",
  arabicName: "المغرب",
  subtitle: "Sunset prayer",
  rakahCount: 3,
  category: "obligatory",
  tradition: "both",
  summary: "Three rakahs prayed shortly after sunset; the first two audible.",
  rakahs: [
    RakahBuilder.first("maghrib", true),
    RakahBuilder.second("maghrib", true, false),
    RakahBuilder.laterRakah("maghrib", 3, true),
  ],
};

export const isha = {
  id: "isha",
  name: "Isha",
  arabicName: "العشاء",
  subtitle: "Night prayer",
  rakahCount: 4,
  category: "obligatory",
  tradition: "both",
  summary: "Four rakahs prayed at night; the first two audible, the last two silent.",
  rakahs: [
    RakahBuilder.first("isha", true),
    RakahBuilder.second("isha", true, false),
    RakahBuilder.laterRakah("isha", 3, false),
    RakahBuilder.laterRakah("isha", 4, true),
  ],
};

export const dailyFive = [fajr, dhuhr, asr, maghrib, isha];
