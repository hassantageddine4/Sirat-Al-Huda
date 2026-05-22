// src/utils/arabicText.js
// ─────────────────────────────────────────────────────────────────────────────
// Arabic text normalization and word-level comparison.
//
// All comparisons strip diacritics, unify letter variants, and collapse
// whitespace so minor orthographic differences between the Quran.com
// Uthmani script and Whisper's transcription don't cause false mismatches.
// ─────────────────────────────────────────────────────────────────────────────

// ── Character classes ────────────────────────────────────────────────────────

// Arabic diacritics (harakat, tanween, shadda, sukun, dagger alif, etc.)
// U+0610–U+061A : Quranic annotation signs
// U+064B–U+065F : tashkeel
// U+0670         : superscript alif
// U+06D6–U+06ED : small Quranic marks (waqf signs, etc.)
const DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g;

// Tatweel (kashida) — purely cosmetic stretching character
const TATWEEL = /\u0640/g;

// Arabic punctuation + Latin punctuation + Quranic verse markers
const PUNCT = /[\u060C\u061B\u061F\u066A-\u066D\u06D4.,;:!?"'()[\]{}«»\-—–]/g;

// Whitespace of any kind, any length
const WHITESPACE = /\s+/g;

// Non-Arabic, non-space characters (strip transliteration leaking through)
const NON_ARABIC = /[^\u0600-\u06FF\s]/g;

// ── Letter unification ───────────────────────────────────────────────────────

// Map orthographic variants to a canonical form so different spellings of
// the same word match. This is standard practice in Arabic IR pipelines.
const LETTER_MAP = {
  // Alef variants → bare alef
  "\u0622": "\u0627", // آ → ا
  "\u0623": "\u0627", // أ → ا
  "\u0625": "\u0627", // إ → ا
  "\u0671": "\u0627", // ٱ → ا
  "\u0672": "\u0627",
  "\u0673": "\u0627",
  "\u0675": "\u0627",

  // Yaa variants → bare yaa
  "\u0649": "\u064A", // ى → ي (alef maqsura → yaa)
  "\u06CC": "\u064A", // ی (Farsi yaa) → ي

  // Taa marbuta → haa (common normalization)
  "\u0629": "\u0647", // ة → ه

  // Hamza variants → remove (already handled by diacritic strip on some fonts)
  "\u0621": "",       // ء (standalone hamza) → removed
  "\u0624": "\u0648", // ؤ → و
  "\u0626": "\u064A", // ئ → ي

  // Farsi kaaf → Arabic kaaf
  "\u06A9": "\u0643", // ک → ك
};

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Normalize a string of Arabic text for comparison.
 * Order of operations matters — diacritics must go before letter mapping
 * so shadda-carrying characters don't end up mis-unified.
 */
export function normalizeArabic(input) {
  if (typeof input !== "string" || !input) return "";

  let s = input;

  // 1. Strip diacritics
  s = s.replace(DIACRITICS, "");

  // 2. Strip tatweel
  s = s.replace(TATWEEL, "");

  // 3. Strip punctuation
  s = s.replace(PUNCT, " ");

  // 4. Strip anything that isn't an Arabic code point or whitespace
  s = s.replace(NON_ARABIC, " ");

  // 5. Unify letter variants
  let out = "";
  for (const ch of s) {
    out += Object.prototype.hasOwnProperty.call(LETTER_MAP, ch) ? LETTER_MAP[ch] : ch;
  }

  // 6. Collapse whitespace + trim
  return out.replace(WHITESPACE, " ").trim();
}

/**
 * Split a normalized string into a word array.
 */
export function tokenize(input) {
  const norm = normalizeArabic(input);
  return norm ? norm.split(" ").filter(Boolean) : [];
}

/**
 * Compare two Arabic strings after normalization.
 * Returns true if they match exactly (word-sequence identical).
 */
export function arabicEquals(a, b) {
  return normalizeArabic(a) === normalizeArabic(b);
}
