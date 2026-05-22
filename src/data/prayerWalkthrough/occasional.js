// src/data/prayerWalkthrough/occasional.js
// ─────────────────────────────────────────────────────────────────────────────
// Occasional prayers — Eid (Eid al-Fitr / Eid al-Adha) and Janāzah (funeral).
// Walkthroughs use the new draft pattern; full instructions live in
// instructions_drafts/eid.js and instructions_drafts/janazah.js.
// ─────────────────────────────────────────────────────────────────────────────

import { eidDraft }     from "./instructions_drafts/eid";
import { janazahDraft } from "./instructions_drafts/janazah";

export const eid     = eidDraft;
export const janazah = janazahDraft;

export const occasional = [janazah, eid];
