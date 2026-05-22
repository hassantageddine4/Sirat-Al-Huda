// src/services/quranVerseBank.js
// ─────────────────────────────────────────────────────────────────────────────
// Verse and reminder copy bank for daily notifications.
//
// The bank is intentionally curated — short verses with universal themes
// (hope, patience, gratitude, tawakkul, mercy, ease after hardship). Each
// notification picks a verse based on day-of-year so the same day shows the
// same verse to the user consistently, and the rotation cycles through the
// bank over time without repetition within a stretch.
// ─────────────────────────────────────────────────────────────────────────────

const VERSES = [
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    english: "Indeed, with hardship comes ease.",
    reference: "Qur'an 94:6" },
  { arabic: "وَاللَّهُ خَيْرُ الرَّازِقِينَ",
    english: "And Allah is the best of providers.",
    reference: "Qur'an 62:11" },
  { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    english: "Remember Me — I will remember you.",
    reference: "Qur'an 2:152" },
  { arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنْتُمْ",
    english: "And He is with you wherever you are.",
    reference: "Qur'an 57:4" },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    english: "Indeed, Allah is with the patient.",
    reference: "Qur'an 2:153" },
  { arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    english: "Whoever places their trust in Allah — He is sufficient for them.",
    reference: "Qur'an 65:3" },
  { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    english: "Truly, in the remembrance of Allah do hearts find rest.",
    reference: "Qur'an 13:28" },
  { arabic: "إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ",
    english: "Indeed, Allah's mercy is near to those who do good.",
    reference: "Qur'an 7:56" },
  { arabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ",
    english: "Do not despair of Allah's mercy.",
    reference: "Qur'an 12:87" },
  { arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    english: "Seek help through patience and prayer.",
    reference: "Qur'an 2:45" },
  { arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    english: "Allah does not burden a soul beyond what it can bear.",
    reference: "Qur'an 2:286" },
  { arabic: "وَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    english: "And with hardship comes ease.",
    reference: "Qur'an 94:6" },
  { arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    english: "Allah is sufficient for us, and the best Disposer of affairs.",
    reference: "Qur'an 3:173" },
  { arabic: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ",
    english: "Indeed, Allah loves those who turn to Him in repentance.",
    reference: "Qur'an 2:222" },
  { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً",
    english: "Our Lord, grant us good in this world.",
    reference: "Qur'an 2:201" },
  { arabic: "وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ",
    english: "And Allah loves those who do good.",
    reference: "Qur'an 3:134" },
  { arabic: "وَاذْكُر رَّبَّكَ كَثِيرًا",
    english: "And remember your Lord often.",
    reference: "Qur'an 3:41" },
  { arabic: "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ",
    english: "Indeed, Allah is Forgiving, Merciful.",
    reference: "Qur'an 2:173" },
  { arabic: "وَبَشِّرِ الصَّابِرِينَ",
    english: "And give glad tidings to those who are patient.",
    reference: "Qur'an 2:155" },
  { arabic: "إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ",
    english: "Indeed, Allah loves those who rely upon Him.",
    reference: "Qur'an 3:159" },
  { arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    english: "Whoever is mindful of Allah, He makes a way out for them.",
    reference: "Qur'an 65:2" },
  { arabic: "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ",
    english: "To Allah belong the most beautiful names.",
    reference: "Qur'an 7:180" },
  { arabic: "إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ",
    english: "My prayer, my devotion, my life and my death are for Allah.",
    reference: "Qur'an 6:162" },
  { arabic: "وَأَقِمِ الصَّلَاةَ لِذِكْرِي",
    english: "And establish prayer for My remembrance.",
    reference: "Qur'an 20:14" },
  { arabic: "وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ",
    english: "And Allah has knowledge of all things.",
    reference: "Qur'an 49:16" },
  { arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ",
    english: "He is the First and the Last.",
    reference: "Qur'an 57:3" },
  { arabic: "رَبِّ زِدْنِي عِلْمًا",
    english: "My Lord, increase me in knowledge.",
    reference: "Qur'an 20:114" },
  { arabic: "وَاللَّهُ خَيْرٌ وَأَبْقَىٰ",
    english: "Allah is better and more lasting.",
    reference: "Qur'an 87:17" },
  { arabic: "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ",
    english: "Indeed, Allah commands justice, good conduct.",
    reference: "Qur'an 16:90" },
  { arabic: "وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ",
    english: "Surely the Hereafter is better for you than this life.",
    reference: "Qur'an 93:4" },
];

const DHIKR_COPY = [
  { title: "Take a moment for dhikr",      body: "SubḥānAllāh, Alḥamdulillāh, Allāhu Akbar." },
  { title: "Remember Allah often",         body: "A few moments of remembrance brings peace to the heart." },
  { title: "Pause and remember",           body: "Even a single tasbīḥ is heavy on the scales." },
  { title: "Time for dhikr",               body: "The remembrance of Allah is the greatest." },
  { title: "Lift your heart",              body: "Lā ilāha illa Allāh — there is no god but Allah." },
  { title: "Quiet remembrance",            body: "Astaghfirullāh — seek forgiveness, find ease." },
  { title: "A simple practice",            body: "Three breaths. Three rounds of dhikr." },
];

const EVENING_COPY = [
  { title: "Have you prayed today?",       body: "Make sure to complete your five prayers." },
  { title: "Consistency in salah",         body: "Even one prayer at its time brings light to your heart." },
  { title: "End the day with prayer",      body: "Do not let the day pass without your connection to Allah." },
  { title: "Check your prayers",           body: "Review the day. What remains? Pray it now." },
  { title: "The five pillars",             body: "Salah is a covenant — keep it daily." },
];

const QURAN_READ_COPY = [
  { title: "Read a few verses",            body: "Even one āyah today brings barakah to your week." },
  { title: "Continue your Qur'an journey", body: "Pick up where you left off. Recite slowly." },
  { title: "A moment with the Qur'an",     body: "The words of Allah are a comfort to the heart." },
  { title: "Time for the Qur'an",          body: "A few minutes of recitation transforms the day." },
  { title: "Open the Qur'an",              body: "Read what speaks to you today. Reflect on it." },
];

const TAHAJJUD_COPY = [
  { title: "The night prayer awaits",      body: "Stand before Allah in the last part of the night." },
  { title: "Salat al-Layl",                body: "The quiet of the night is reserved for the sincere." },
  { title: "Witnesses of the night",       body: "Those who rise to pray when others sleep — Allah loves them." },
  { title: "A blessed time",               body: "Du'a in the last third of the night is rarely refused." },
];

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Picks a verse for a given date. Same date always returns the same verse,
 * so a Quran morning notification and a Quran midday notification on the
 * same day reference the same verse for consistency.
 */
export function pickVerseForDay(date = new Date()) {
  const dayIdx = dayOfYear(date);
  return VERSES[dayIdx % VERSES.length];
}

export function getDailyDhikrCopy(date = new Date()) {
  return DHIKR_COPY[dayOfYear(date) % DHIKR_COPY.length];
}

export function getEveningCopy(date = new Date()) {
  return EVENING_COPY[dayOfYear(date) % EVENING_COPY.length];
}

export function getQuranReadCopy(date = new Date()) {
  return QURAN_READ_COPY[dayOfYear(date) % QURAN_READ_COPY.length];
}

export function getTahajjudCopy(date = new Date()) {
  return TAHAJJUD_COPY[dayOfYear(date) % TAHAJJUD_COPY.length];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff  = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function getVerseBankSize() {
  return VERSES.length;
}
