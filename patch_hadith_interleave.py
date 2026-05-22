#!/usr/bin/env python3
"""
Rewrites HadithReader.jsx's InterleavedHadith to chunk Arabic and English
proportionally — short hadith stay as one block; long hadith get split into
many small pairs so the translation always appears right under its Arabic.
"""
import pathlib, sys

P = pathlib.Path.home() / "Downloads/sirat-capacitor-3/src/pages/HadithReader.jsx"
if not P.exists():
    print(f"ERROR: {P} not found", file=sys.stderr); sys.exit(1)

src = P.read_text()

OLD = '''function InterleavedHadith({ arabic, english, size }) {
  const araChunks = chunkBySentences(arabic, 5);
  const engChunks = chunkBySentences(english, 5);
  const count = Math.max(araChunks.length, engChunks.length);
  const pairs = [];
  for (let i = 0; i < count; i++) {
    pairs.push({ ar: araChunks[i] || "", en: engChunks[i] || "" });
  }'''

NEW = '''function InterleavedHadith({ arabic, english, size }) {
  // Pick a number of pairs based on total length so each pair is bite-sized.
  const totalLen = (arabic?.length || 0) + (english?.length || 0);
  const n =
    totalLen < 500   ? 1 :
    totalLen < 1500  ? 3 :
    totalLen < 3500  ? 6 :
    totalLen < 7000  ? 10 :
    totalLen < 14000 ? 16 :
                       24;

  const araChunks = splitProportional(arabic, n);
  const engChunks = splitProportional(english, n);
  const count = Math.max(araChunks.length, engChunks.length);
  const pairs = [];
  for (let i = 0; i < count; i++) {
    pairs.push({ ar: araChunks[i] || "", en: engChunks[i] || "" });
  }'''

if OLD in src:
    src = src.replace(OLD, NEW, 1)
    print("✓ Rewrote InterleavedHadith chunking")
else:
    print("⚠ InterleavedHadith pattern not matched", file=sys.stderr)
    sys.exit(1)

# Add helper functions if not present
HELPERS = '''

function splitIntoSentences(text) {
  if (!text) return [];
  // Splits on Western and Arabic terminal punctuation, keeps results trimmed.
  return text
    .split(/(?<=[.!?؟])\\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function splitProportional(text, n) {
  if (!text) return [];
  if (n <= 1) return [text.trim()];
  const sentences = splitIntoSentences(text);
  if (sentences.length === 0) return [text.trim()];
  if (sentences.length <= n) return sentences;
  const perChunk = sentences.length / n;
  const chunks = [];
  let i = 0;
  for (let chunk = 0; chunk < n; chunk++) {
    const end = chunk === n - 1 ? sentences.length : Math.round((chunk + 1) * perChunk);
    const slice = sentences.slice(i, end).join(' ').trim();
    if (slice) chunks.push(slice);
    i = end;
  }
  return chunks;
}
'''

if "function splitProportional" not in src:
    src = src.rstrip() + HELPERS
    print("✓ Added splitProportional + splitIntoSentences helpers")

P.write_text(src)
print(f"Wrote {P}")
