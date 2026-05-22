// src/data/prayerWalkthrough/dailyFive.js
// ─────────────────────────────────────────────────────────────────────────────
// The five daily obligatory prayers — all now using full instructional
// rewrites from instructions_drafts/.
// ─────────────────────────────────────────────────────────────────────────────

import { fajrDraft }                          from "./instructions_drafts/fajr";
import { maghribDraft }                       from "./instructions_drafts/maghrib";
import { dhuhrDraft, asrDraft, ishaDraft }    from "./instructions_drafts/dhuhr_asr_isha";

export const fajr    = fajrDraft;
export const dhuhr   = dhuhrDraft;
export const asr     = asrDraft;
export const maghrib = maghribDraft;
export const isha    = ishaDraft;

export const dailyFive = [fajr, dhuhr, asr, maghrib, isha];
