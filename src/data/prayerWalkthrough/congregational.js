// src/data/prayerWalkthrough/congregational.js
// ─────────────────────────────────────────────────────────────────────────────
// Congregational prayers — currently just Jumuʿah.
// Walkthrough uses the new draft pattern; full prayer instructions live in
// instructions_drafts/jumuah.js.
// ─────────────────────────────────────────────────────────────────────────────

import { jumuahDraft } from "./instructions_drafts/jumuah";

export const jumuah = jumuahDraft;
export const congregational = [jumuah];
