// src/services/quranVerseService.js
// ─────────────────────────────────────────────────────────────────────────────
// Fetches daily motivational Quran verses from the Al-Quran Cloud API.
// Uses a curated list of the most uplifting, short, universally relevant
// ayahs. Rotates daily so users get a different verse each day.
// Falls back to a built-in offline collection if API is unavailable.
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_KEY  = "sirat_daily_verse_cache";
const BASE_URL   = "https://api.alquran.cloud/v1";
const EDITION_AR = "quran-uthmani";   // Arabic with tashkeel
const EDITION_EN = "en.sahih";        // Saheeh International translation

// ── Curated list of powerful, short motivational ayahs ───────────────────────
// Format: "surah:ayah"  — chosen for being concise, uplifting, and widely known
export const CURATED_AYAHS = [
  "94:5",   // With hardship comes ease (1)
  "94:6",   // With hardship comes ease (2)
  "2:286",  // Allah does not burden a soul beyond that it can bear
  "65:3",   // Whoever relies upon Allah — He is sufficient for him
  "2:153",  // Indeed Allah is with the patient
  "2:152",  // Remember Me, I will remember you
  "3:139",  // Do not weaken, do not grieve — you will be superior
  "39:53",  // Do not despair of the mercy of Allah
  "13:28",  // Verily in the remembrance of Allah do hearts find rest
  "94:7",   // When you are free, still strive hard
  "2:286",  // Allah does not burden a soul beyond that it can bear
  "3:160",  // If Allah should aid you, no one can overcome you
  "8:2",    // The believers are those whose hearts tremble when Allah is mentioned
  "14:7",   // If you are grateful, I will surely increase you
  "9:51",   // Nothing will happen to us except what Allah has decreed
  "16:128", // Allah is with those who fear Him and those who do good
  "47:7",   // If you support Allah, He will support you
  "57:22",  // No disaster strikes except by permission of Allah
  "29:69",  // Those who strive for Us — We will guide them
  "18:10",  // Our Lord, grant us mercy and ease our affair
  "40:60",  // Call upon Me; I will respond to you
  "2:45",   // Seek help through patience and prayer
  "17:80",  // My Lord, cause me to enter a truthful entrance
  "20:114", // My Lord, increase me in knowledge
  "3:8",    // Our Lord, do not let our hearts deviate after You have guided us
];

// ── Built-in offline fallback verses ─────────────────────────────────────────
// These are stored locally so the feature works with zero connectivity.
const OFFLINE_VERSES = [
  {
    number: "94:5-6",
    arabic:         "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation:    "For indeed, with hardship will be ease. Indeed, with hardship will be ease.",
    surah:          "Surah Ash-Sharh",
    reference:      "94:5–6",
    shortNotifText: "With every hardship comes ease. Trust in Allah's plan.",
  },
  {
    number: "2:286",
    arabic:         "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation:    "Allah does not burden a soul beyond that it can bear.",
    surah:          "Surah Al-Baqarah",
    reference:      "2:286",
    shortNotifText: "You were given exactly what you can handle. Allah knows best.",
  },
  {
    number: "65:3",
    arabic:         "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    translation:    "Whoever relies upon Allah — then He is sufficient for him.",
    surah:          "Surah At-Talaq",
    reference:      "65:3",
    shortNotifText: "Put your trust in Allah. He is enough for you.",
  },
  {
    number: "13:28",
    arabic:         "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    translation:    "Verily, in the remembrance of Allah do hearts find rest.",
    surah:          "Surah Ar-Ra'd",
    reference:      "13:28",
    shortNotifText: "Feeling restless? The peace you seek is in His remembrance.",
  },
  {
    number: "39:53",
    arabic:         "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    translation:    "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins.",
    surah:          "Surah Az-Zumar",
    reference:      "39:53",
    shortNotifText: "No sin is too great for Allah's mercy. Turn back to Him.",
  },
  {
    number: "3:139",
    arabic:         "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    translation:    "Do not weaken and do not grieve, and you will be superior if you are true believers.",
    surah:          "Surah Aal-Imran",
    reference:      "3:139",
    shortNotifText: "Stay strong. A believer is never defeated.",
  },
  {
    number: "40:60",
    arabic:         "ادْعُونِي أَسْتَجِبْ لَكُمْ",
    translation:    "Call upon Me; I will respond to you.",
    surah:          "Surah Ghafir",
    reference:      "40:60",
    shortNotifText: "Allah is listening. Make du'a — He promised to respond.",
  },
  {
    number: "2:153",
    arabic:         "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation:    "Indeed, Allah is with the patient.",
    surah:          "Surah Al-Baqarah",
    reference:      "2:153",
    shortNotifText: "Be patient. Allah Himself is with you.",
  },
  {
    number: "29:69",
    arabic:         "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا",
    translation:    "Those who strive for Us — We will surely guide them to Our paths.",
    surah:          "Surah Al-Ankabut",
    reference:      "29:69",
    shortNotifText: "Keep striving. The path becomes clear for those who seek Allah.",
  },
  {
    number: "14:7",
    arabic:         "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    translation:    "If you are grateful, I will surely increase you in favour.",
    surah:          "Surah Ibrahim",
    reference:      "14:7",
    shortNotifText: "Start your day with gratitude. Allah multiplies it.",
  },
  {
    number: "20:114",
    arabic:         "رَّبِّ زِدْنِي عِلْمًا",
    translation:    "My Lord, increase me in knowledge.",
    surah:          "Surah Ta-Ha",
    reference:      "20:114",
    shortNotifText: "The greatest du'a for your mind. Say it now.",
  },
  {
    number: "2:45",
    arabic:         "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    translation:    "Seek help through patience and prayer.",
    surah:          "Surah Al-Baqarah",
    reference:      "2:45",
    shortNotifText: "Overwhelmed? Prayer is the answer — it always has been.",
  },
  {
    number: "47:7",
    arabic:         "إِن تَنصُرُوا اللَّهَ يَنصُرْكُمْ",
    translation:    "If you support Allah, He will support you.",
    surah:          "Surah Muhammad",
    reference:      "47:7",
    shortNotifText: "Support Allah's deen. His support is guaranteed.",
  },
  {
    number: "9:51",
    arabic:         "قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا",
    translation:    "Say: Nothing will happen to us except what Allah has decreed for us.",
    surah:          "Surah At-Tawbah",
    reference:      "9:51",
    shortNotifText: "Whatever comes today — it is written. Breathe and trust.",
  },
  {
    number: "16:128",
    arabic:         "إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا وَّالَّذِينَ هُم مُّحْسِنُونَ",
    translation:    "Indeed, Allah is with those who fear Him and those who do good.",
    surah:          "Surah An-Nahl",
    reference:      "16:128",
    shortNotifText: "Do good today. Allah's company is the greatest reward.",
  },
];

// ── Get today's verse index (changes daily) ───────────────────────────────────
export function getTodayVerseIndex() {
  const now       = new Date();
  // Day-of-year rotates through all verses
  const dayOfYear = Math.floor(
    (now - new Date(now.getFullYear(), 0, 0)) / 86400000
  );
  return dayOfYear % OFFLINE_VERSES.length;
}

// ── Cache helpers ─────────────────────────────────────────────────────────────
function getCachedVerse() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { verse, dateStr } = JSON.parse(raw);
    const today = new Date().toDateString();
    if (dateStr !== today) return null; // stale — new day
    return verse;
  } catch { return null; }
}

function cacheVerse(verse) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      verse,
      dateStr: new Date().toDateString(),
    }));
  } catch {}
}

// ── Fetch a single ayah from Al-Quran Cloud ───────────────────────────────────
async function fetchAyah(ref) {
  // ref e.g. "94:5" — convert to "94:5" for the API endpoint
  const url = `${BASE_URL}/ayah/${ref}/editions/${EDITION_AR},${EDITION_EN}`;
  const res  = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.status ?? "API error");

  const arEdition = json.data.find(d => d.edition.identifier === EDITION_AR);
  const enEdition = json.data.find(d => d.edition.identifier === EDITION_EN);
  if (!arEdition || !enEdition) throw new Error("Missing edition data");

  return {
    number:         ref,
    arabic:         arEdition.text,
    translation:    enEdition.text,
    surah:          `Surah ${arEdition.surah?.englishName ?? ""}`,
    reference:      `${arEdition.surah?.number ?? ""}:${arEdition.numberInSurah ?? ""}`,
    shortNotifText: buildShortText(enEdition.text, enEdition.surah?.englishName ?? "", ref),
    fromAPI:        true,
  };
}

// ── Build a short (≤120 char) notification body from a verse ─────────────────
function buildShortText(translation, surahName, ref) {
  // Truncate cleanly at a word boundary
  const max = 110;
  const text = translation.length <= max
    ? translation
    : translation.slice(0, max).replace(/\s\S+$/, "") + "…";
  return text;
}

// ── Main export — get today's verse, API first then offline fallback ──────────
export async function getDailyVerse() {
  // 1. Return today's cached verse if available
  const cached = getCachedVerse();
  if (cached) return { verse: cached, fromCache: true, error: null };

  // 2. Try API
  const idx = getTodayVerseIndex();
  const ref  = CURATED_AYAHS[idx % CURATED_AYAHS.length];

  try {
    const verse = await fetchAyah(ref);
    cacheVerse(verse);
    return { verse, fromCache: false, error: null };
  } catch (err) {
    // 3. Offline fallback
    const fallback = OFFLINE_VERSES[idx % OFFLINE_VERSES.length];
    return { verse: fallback, fromCache: false, error: null, fromOffline: true };
  }
}

// ── Get verse purely offline (no fetch) — used by notification scheduler ─────
export function getDailyVerseOffline() {
  const cached = getCachedVerse();
  if (cached) return cached;
  const idx = getTodayVerseIndex();
  return OFFLINE_VERSES[idx % OFFLINE_VERSES.length];
}

// ── Get tomorrow's verse offline (for tomorrow's notification) ────────────────
export function getTomorrowVerseOffline() {
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const dayOfYear = Math.floor(
    (tomorrow - new Date(tomorrow.getFullYear(), 0, 0)) / 86400000
  );
  const idx = dayOfYear % OFFLINE_VERSES.length;
  return OFFLINE_VERSES[idx];
}

// ── Notification title options ────────────────────────────────────────────────
export const NOTIF_TITLES = [
  "📖 Verse of the Day",
  "✨ Today's Reminder from Allah",
  "🌿 Your Daily Quran Motivation",
  "💚 Words from the Quran",
  "🕌 Reflect on this today",
];

export function getTodayNotifTitle() {
  const idx = getTodayVerseIndex() % NOTIF_TITLES.length;
  return NOTIF_TITLES[idx];
}
