// src/data/prayerWalkthrough/voluntary.js
// ─────────────────────────────────────────────────────────────────────────────
// Voluntary (nafl) prayers.
//
// All voluntary prayers now use full instructional rewrites from
// instructions_drafts/voluntary_batch4.js — reviewed and approved by Hassan.
//
// Branch visibility:
//   • Witr / Tahajjud / Taraweeh → Sunni only
//   • Duha / Tawbah / Istikhara  → both branches
//
// Tawbah and Istikhara are 2-rakah voluntary prayers, each ending with a
// post-prayer du'a step. Surahs per Hassan's spec:
//   Tawbah    — r1: al-Kāfirūn, r2: al-Ikhlāṣ
//   Istikhara — r1: al-Kāfirūn, r2: al-Ikhlāṣ
// ─────────────────────────────────────────────────────────────────────────────

import {
  witrDraft,
  tahajjudDraft,
  duhaDraft,
  taraweehDraft,
  tawbahDraft,
  istikharaDraft,
} from "./instructions_drafts/voluntary_batch4";

export const witr      = witrDraft;
export const tahajjud  = tahajjudDraft;
export const duha      = duhaDraft;
export const taraweeh  = taraweehDraft;
export const tawbah    = tawbahDraft;
export const istikhara = istikharaDraft;

export const recommended = [witr, tahajjud, duha, taraweeh, tawbah, istikhara];
