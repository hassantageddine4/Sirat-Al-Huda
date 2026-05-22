// src/services/pronunciationAnalyzer.js
// ─────────────────────────────────────────────────────────────────────────────
// Recitation comparison engine.
//
// Current implementation: word-level sequence alignment using a simplified
// Levenshtein/LCS diff. Returns per-word status (correct/incorrect/missing/extra)
// plus an overall accuracy score and summary stats.
//
// This module exposes a stable interface so a future AI phoneme-level tajweed
// scorer can be swapped in without touching any UI code. The function
// signature `analyzePronunciation(reference, userText)` is the contract.
// ─────────────────────────────────────────────────────────────────────────────

import { normalizeArabic, tokenize } from "../utils/arabicText";

/** @typedef {'correct'|'incorrect'|'missing'|'extra'} WordStatus */

/**
 * @typedef {Object} WordResult
 * @property {string}     text     — the reference word (or user word for extras)
 * @property {WordStatus} status
 * @property {string}     [saidAs] — what the user said instead (for incorrect/extra)
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {WordResult[]} words          per-reference-word results, in order
 * @property {number}       accuracy       0..1
 * @property {number}       accuracyPercent 0..100 (rounded)
 * @property {number}       correctCount
 * @property {number}       incorrectCount
 * @property {number}       missingCount
 * @property {number}       extraCount
 * @property {string}       feedback       short human-readable summary
 * @property {string}       level          'excellent'|'good'|'fair'|'needs-work'
 */

// ── Public entry point ───────────────────────────────────────────────────────

/**
 * Compare a reference ayah text against a user's transcribed recitation.
 *
 * @param {string} reference  Quran.com Uthmani text
 * @param {string} userText   Whisper transcription
 * @returns {AnalysisResult}
 */
export function analyzePronunciation(reference, userText) {
  const refWords  = tokenize(reference);
  const userWords = tokenize(userText);

  const results = alignWords(refWords, userWords);

  const correctCount   = results.filter(r => r.status === "correct").length;
  const incorrectCount = results.filter(r => r.status === "incorrect").length;
  const missingCount   = results.filter(r => r.status === "missing").length;
  const extraCount     = results.filter(r => r.status === "extra").length;

  const denom    = refWords.length || 1;
  const accuracy = Math.max(0, Math.min(1, correctCount / denom));
  const accuracyPercent = Math.round(accuracy * 100);

  return {
    words: results,
    accuracy,
    accuracyPercent,
    correctCount,
    incorrectCount,
    missingCount,
    extraCount,
    feedback: buildFeedback({ accuracyPercent, missingCount, incorrectCount }),
    level: buildLevel(accuracyPercent),
  };
}

// ── Word-sequence alignment ──────────────────────────────────────────────────
//
// Dynamic-programming LCS-style alignment. Produces a sequence of operations
// (match / substitute / delete / insert) which map directly to our statuses:
//   match      → correct
//   substitute → incorrect  (saidAs = user word)
//   delete     → missing    (user skipped a reference word)
//   insert     → extra      (user added a word not in the reference)
//
// Time: O(R*U), Space: O(R*U). Ayahs are short — never a problem.

function alignWords(ref, user) {
  const R = ref.length;
  const U = user.length;

  // Edge cases
  if (R === 0) {
    return user.map(w => ({ text: w, status: /** @type {WordStatus} */("extra") }));
  }
  if (U === 0) {
    return ref.map(w => ({ text: w, status: /** @type {WordStatus} */("missing") }));
  }

  // Build cost matrix
  // dp[i][j] = min ops to transform ref[0..i] into user[0..j]
  const dp = Array.from({ length: R + 1 }, () => new Array(U + 1).fill(0));
  for (let i = 0; i <= R; i++) dp[i][0] = i;
  for (let j = 0; j <= U; j++) dp[0][j] = j;

  for (let i = 1; i <= R; i++) {
    for (let j = 1; j <= U; j++) {
      if (wordsMatch(ref[i - 1], user[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j - 1], // substitute
          dp[i - 1][j],     // delete (missing from user)
          dp[i][j - 1],     // insert (extra from user)
        );
      }
    }
  }

  // Backtrack to produce op sequence
  const ops = [];
  let i = R, j = U;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && wordsMatch(ref[i - 1], user[j - 1])) {
      ops.push({ text: ref[i - 1], status: "correct" });
      i--; j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      ops.push({ text: ref[i - 1], status: "incorrect", saidAs: user[j - 1] });
      i--; j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      ops.push({ text: ref[i - 1], status: "missing" });
      i--;
    } else {
      ops.push({ text: user[j - 1], status: "extra" });
      j--;
    }
  }

  return ops.reverse();
}

// ── Fuzzy word match ─────────────────────────────────────────────────────────
// Whisper occasionally misses a single letter or adds one. We allow a small
// edit distance for longer words so "الرحمن" and "الرحمان" still match.

function wordsMatch(a, b) {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 2) return false;

  // Short words must match exactly
  if (la < 4 || lb < 4) return false;

  // Allow 1 edit for 4-5 chars, 2 edits for 6+ chars
  const tolerance = la < 6 ? 1 : 2;
  return editDistance(a, b) <= tolerance;
}

function editDistance(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  const row = new Array(n + 1);
  for (let j = 0; j <= n; j++) row[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = row[j];
      if (a[i - 1] === b[j - 1]) {
        row[j] = prev;
      } else {
        row[j] = 1 + Math.min(prev, row[j], row[j - 1]);
      }
      prev = temp;
    }
  }
  return row[n];
}

// ── Human-readable feedback ──────────────────────────────────────────────────

function buildLevel(pct) {
  if (pct >= 95) return "excellent";
  if (pct >= 85) return "good";
  if (pct >= 65) return "fair";
  return "needs-work";
}

function buildFeedback({ accuracyPercent, missingCount, incorrectCount }) {
  if (accuracyPercent >= 95) {
    return "MashaAllah — an excellent recitation. Keep up the beautiful work.";
  }
  if (accuracyPercent >= 85) {
    return "Very good. Just a few small corrections and this will be perfect.";
  }
  if (accuracyPercent >= 65) {
    const parts = [];
    if (incorrectCount) parts.push(`${incorrectCount} word${incorrectCount > 1 ? "s" : ""} to fix`);
    if (missingCount)   parts.push(`${missingCount} skipped`);
    return `Good effort. ${parts.join(" · ")}. Listen to the reciter and try again.`;
  }
  return "Take your time. Listen to the full ayah first, then recite it slowly.";
}

// ── AI-ready interface (placeholder) ─────────────────────────────────────────
// Future: plug a phoneme-level model here. Same signature, same return shape.
// UI code will work unchanged.

export const ANALYZER_VERSION = "word-diff-v1";

/**
 * When you integrate a tajweed/phoneme model, implement this and route
 * `analyzePronunciation` through it. Keep the WordResult/AnalysisResult shapes
 * identical so the UI layer is untouched.
 */
export async function analyzePronunciationAI(reference, userText /*, audioBlob */) {
  // For now, delegate to the sync word-diff version.
  return analyzePronunciation(reference, userText);
}
