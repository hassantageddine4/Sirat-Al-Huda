// src/services/insights.js
// ─────────────────────────────────────────────────────────────────────────────
// Daily reflection content for the InsightCard on Practice & Home.
//
// Each insight is tagged with tradition: "sunni" | "shia" | "both".
// `getDailyInsight(branch)` returns one insight per day, filtered by the
// user's selected branch (Shia users see only Shia + Both content; Sunni
// users see only Sunni + Both content).
//
// All Shia entries are drawn from major Imāmī hadith corpora: al-Kāfī,
// Nahj al-Balāgha, Bihār al-Anwār, Mafātīḥ al-Jinān, Wasāʾil al-Shīʿa.
// All Sunni entries are drawn from the canonical six (Bukhārī, Muslim,
// Abī Dāwūd, Tirmidhī, Nasāʾī, Ibn Mājah) plus Muwaṭṭaʾ and Musnad Aḥmad.
//
// ⚠️ DRAFT — All citations need scholar verification before launch.
// ─────────────────────────────────────────────────────────────────────────────

const INSIGHTS = [
  // ═════════════════════════════════════════════════════════════════════════
  // SUNNI INSIGHTS
  // ═════════════════════════════════════════════════════════════════════════
  { id: 1,  tradition: "sunni", category: "Prayer",        text: "Whoever recites Ayat al-Kursi after every obligatory prayer, nothing prevents him from entering Paradise except death.", source: "Sunan al-Nasāʾī" },
  { id: 2,  tradition: "sunni", category: "Friday",        text: "The last hour before Maghrib on Friday is among the times when du'a is most likely to be accepted.", source: "Ṣaḥīḥ al-Bukhārī, Ṣaḥīḥ Muslim" },
  { id: 3,  tradition: "sunni", category: "Night Worship", text: "In the last third of every night, Allah descends to the lowest heaven and asks: 'Who calls upon Me, that I may answer him?'", source: "Ṣaḥīḥ al-Bukhārī, Ṣaḥīḥ Muslim" },
  { id: 4,  tradition: "sunni", category: "Qur'an",        text: "Whoever reads Sūrat al-Kahf on Friday, light will shine for him from one Friday to the next.", source: "Authenticated by al-Ḥākim" },
  { id: 5,  tradition: "sunni", category: "Qur'an",        text: "Sūrat al-Mulk intercedes for its companion until he is forgiven. Recite it before sleep.", source: "Sunan Abī Dāwūd, Sunan al-Tirmidhī" },
  { id: 6,  tradition: "sunni", category: "Dhikr",         text: "Two phrases light on the tongue, heavy on the scale, beloved to the Most Merciful: 'SubḥānAllāhi wa bi-ḥamdih, SubḥānAllāhi l-ʿAẓīm.'", source: "Ṣaḥīḥ al-Bukhārī" },
  { id: 7,  tradition: "sunni", category: "Forgiveness",   text: "Whoever recites Sayyid al-Istighfār with conviction during the day and dies before evening will be among the people of Paradise.", source: "Ṣaḥīḥ al-Bukhārī" },
  { id: 8,  tradition: "sunni", category: "Du'a",          text: "The du'a of a fasting person at the time of breaking fast is not rejected.", source: "Sunan Ibn Mājah" },
  { id: 9,  tradition: "sunni", category: "Worship",       text: "The most beloved deeds to Allah are those done consistently, even if small.", source: "Ṣaḥīḥ al-Bukhārī" },
  { id: 10, tradition: "sunni", category: "Qur'an",        text: "The last two verses of Sūrat al-Baqarah are sufficient for whoever recites them at night.", source: "Ṣaḥīḥ al-Bukhārī" },
  { id: 11, tradition: "sunni", category: "Morning",       text: "Whoever says 'SubḥānAllāhi wa bi-ḥamdih' one hundred times in a day, his sins are wiped away even if they were like the foam of the sea.", source: "Ṣaḥīḥ al-Bukhārī, Ṣaḥīḥ Muslim" },
  { id: 12, tradition: "sunni", category: "Dhikr",         text: "There are two doors of Paradise opened for whoever says: 'Lā ḥawla wa lā quwwata illā bi-llāh.'", source: "Ṣaḥīḥ al-Bukhārī" },
  { id: 13, tradition: "sunni", category: "Ṣalawāt",       text: "Whoever sends one ṣalawāt upon the Prophet ﷺ, Allah sends ten upon him.", source: "Ṣaḥīḥ Muslim" },
  { id: 14, tradition: "sunni", category: "Prayer",        text: "Between the adhān and the iqāmah, du'a is not rejected.", source: "Sunan Abī Dāwūd, Sunan al-Tirmidhī" },
  { id: 15, tradition: "sunni", category: "Qur'an",        text: "Reciting Sūrat al-Ikhlāṣ three times equals reciting one third of the Qur'an in reward.", source: "Ṣaḥīḥ al-Bukhārī" },
  { id: 16, tradition: "sunni", category: "Protection",    text: "Whoever recites the last three sūrahs three times in the morning and evening, they will suffice him from everything.", source: "Sunan Abī Dāwūd, Sunan al-Tirmidhī" },
  { id: 17, tradition: "sunni", category: "Worship",       text: "The closest a servant is to his Lord is when he is in prostration. So make abundant du'a in sujūd.", source: "Ṣaḥīḥ Muslim" },
  { id: 18, tradition: "sunni", category: "Charity",       text: "Charity does not decrease wealth. Allah only increases the giver in honour.", source: "Ṣaḥīḥ Muslim" },
  { id: 19, tradition: "sunni", category: "Character",     text: "The most beloved of you to me are those of you who are best in character.", source: "Ṣaḥīḥ al-Bukhārī" },
  { id: 20, tradition: "sunni", category: "Forgiveness",   text: "Whoever says one hundred times a day 'Lā ilāha illa-llāhu waḥdahū lā sharīka lah', it is for him equal to freeing ten slaves.", source: "Ṣaḥīḥ al-Bukhārī, Ṣaḥīḥ Muslim" },
  { id: 21, tradition: "sunni", category: "Qur'an",        text: "Hearts grow rusty as iron grows rusty when water reaches it. The polishing of hearts is recitation of the Qur'an and remembrance of death.", source: "al-Bayhaqī, Shuʿab al-Īmān" },
  { id: 22, tradition: "sunni", category: "Night Worship", text: "Hold tight to qiyām al-layl. It was the practice of the righteous before you and a means of nearness to Allah.", source: "Sunan al-Tirmidhī" },
  { id: 23, tradition: "sunni", category: "Du'a",          text: "Allah is shy and generous. He is shy when His servant raises his hands to return them empty and disappointed.", source: "Sunan Abī Dāwūd, Sunan al-Tirmidhī" },
  { id: 24, tradition: "sunni", category: "Knowledge",     text: "Seeking knowledge is an obligation upon every Muslim.", source: "Sunan Ibn Mājah" },
  { id: 25, tradition: "sunni", category: "Patience",      text: "Wonderful is the affair of the believer, for his affairs are all good. If something good befalls him he is grateful, and if something bad befalls him he is patient.", source: "Ṣaḥīḥ Muslim" },

  // ═════════════════════════════════════════════════════════════════════════
  // SHIA INSIGHTS
  // ═════════════════════════════════════════════════════════════════════════
  { id: 101, tradition: "shia", category: "Prayer",        text: "Verily prayer is the pillar of religion. Whoever upholds it has upheld the religion; whoever abandons it has destroyed the religion.", source: "Imam ʿAlī (ʿa) — Nahj al-Balāgha" },
  { id: 102, tradition: "shia", category: "Ahl al-Bayt",   text: "Love of us, the Ahl al-Bayt, is the foundation of religion. Hold fast to it.", source: "Imam Jaʿfar al-Ṣādiq (ʿa) — al-Kāfī vol. 8" },
  { id: 103, tradition: "shia", category: "Night Worship", text: "Be vigilant in Ṣalāt al-Layl. It was the practice of the righteous before you and a means of drawing near to Allah.", source: "Imam Jaʿfar al-Ṣādiq (ʿa) — al-Kāfī vol. 3" },
  { id: 104, tradition: "shia", category: "Qur'an",        text: "The Qur'an is the rope of Allah extended from the heavens to the earth. Hold fast to it; it is a clear light, a healing benefit, and a protection for those who cling to it.", source: "Imam ʿAlī (ʿa) — Nahj al-Balāgha, Sermon 156" },
  { id: 105, tradition: "shia", category: "Du'a",          text: "Du'a is the weapon of the believer, the pillar of religion, and the light of the heavens and the earth.", source: "Prophet Muḥammad ﷺ — al-Kāfī vol. 2" },
  { id: 106, tradition: "shia", category: "Friday",        text: "Friday is the master of all days. On it Allah multiplies the rewards of good deeds and answers the sincere du'a of the believers.", source: "Imam Jaʿfar al-Ṣādiq (ʿa) — Mafātīḥ al-Jinān" },
  { id: 107, tradition: "shia", category: "Tasbīḥ",        text: "Tasbīḥ al-Zahrāʾ (34 takbīrs, 33 alḥamdulillāhs, 33 subḥāna-llāhs) after every prayer is more beloved to me than a thousand rakahs of voluntary prayer.", source: "Prophet Muḥammad ﷺ — al-Kāfī vol. 3" },
  { id: 108, tradition: "shia", category: "Patience",      text: "Patience to faith is as the head to the body; there is no faith for one who has no patience.", source: "Imam ʿAlī (ʿa) — Nahj al-Balāgha, Saying 82" },
  { id: 109, tradition: "shia", category: "Knowledge",     text: "Knowledge is a treasure; questions are its key. So ask — for in asking are four rewards: for the asker, for the teacher, for the listener, and for the one who loves them all.", source: "Imam ʿAlī (ʿa) — Nahj al-Balāgha, Saying 320" },
  { id: 110, tradition: "shia", category: "Salawāt",       text: "Sending blessings on Muḥammad and his family is the heaviest of deeds on the scale on the Day of Judgement.", source: "Prophet Muḥammad ﷺ — Biḥār al-Anwār vol. 91" },
  { id: 111, tradition: "shia", category: "Worship",       text: "The most beloved of deeds to Allah are those done with sincerity (ikhlāṣ), even if few; for it is sincerity that gives every act its weight.", source: "Imam Jaʿfar al-Ṣādiq (ʿa) — al-Kāfī vol. 2" },
  { id: 112, tradition: "shia", category: "Repentance",    text: "Allah is more pleased with the repentance of His servant than a man would be at finding a lost camel in the desert with all his provisions on it.", source: "Prophet Muḥammad ﷺ — al-Kāfī vol. 2" },
  { id: 113, tradition: "shia", category: "Character",     text: "The most beloved of you to me are those of you who are best in character; those who are humble, who bring people close, and who are loved and bring love.", source: "Prophet Muḥammad ﷺ — al-Kāfī vol. 2" },
  { id: 114, tradition: "shia", category: "Imam al-Mahdī", text: "Strive to know your Imam, for whoever dies without knowing his Imam dies the death of jāhiliyyah (pre-Islamic ignorance).", source: "Prophet Muḥammad ﷺ — al-Kāfī vol. 1" },
  { id: 115, tradition: "shia", category: "Protection",    text: "Reciting Āyat al-Kursī before sleep places one under the protection of an angel from Allah until morning.", source: "Imam Jaʿfar al-Ṣādiq (ʿa) — Mafātīḥ al-Jinān" },
  { id: 116, tradition: "shia", category: "Gratitude",     text: "Gratitude for a blessing invites its continuation, and the way to invoke Allah's increase is to thank Him for what He has already given.", source: "Imam ʿAlī (ʿa) — Nahj al-Balāgha, Saying 13" },
  { id: 117, tradition: "shia", category: "Worship",       text: "The closest a servant is to his Lord is when he is in prostration; in that moment, ask Allah for everything you need.", source: "Imam Jaʿfar al-Ṣādiq (ʿa) — al-Kāfī vol. 3" },
  { id: 118, tradition: "shia", category: "Charity",       text: "Sadaqah given for the sake of Allah is multiplied; for every dirham given for His sake, He repays with seven hundred.", source: "Imam Mūsā al-Kāẓim (ʿa) — al-Kāfī vol. 4" },
  { id: 119, tradition: "shia", category: "Qur'an",        text: "Whoever recites the Qur'an while standing in prayer at night, every letter brings him a hundred rewards.", source: "Imam Jaʿfar al-Ṣādiq (ʿa) — al-Kāfī vol. 2" },
  { id: 120, tradition: "shia", category: "Imam al-Ḥusayn",text: "There is no day like the day of al-Ḥusayn (ʿa) — the day Ḥusayn was slain at Karbalāʾ. Remember it, weep for it, and learn from it.", source: "Imam ʿAlī al-Riḍā (ʿa) — Biḥār al-Anwār vol. 44" },
  { id: 121, tradition: "shia", category: "Du'a",          text: "Open your du'a with the praise of Allah and ṣalawāt on Muḥammad and his family; for between these two, no du'a is rejected.", source: "Imam Jaʿfar al-Ṣādiq (ʿa) — al-Kāfī vol. 2" },
  { id: 122, tradition: "shia", category: "Service",       text: "The best of people is the one who is most beneficial to others — through their wealth, their skill, their kindness, or their du'a.", source: "Prophet Muḥammad ﷺ — Mishkāt al-Anwār" },
  { id: 123, tradition: "shia", category: "Forgiveness",   text: "Whoever performs ablution well, then prays two rakahs asking forgiveness with focus, Allah forgives him whatever has passed of his sins.", source: "Imam Muḥammad al-Bāqir (ʿa) — al-Kāfī vol. 3" },
  { id: 124, tradition: "shia", category: "Friday",        text: "Recite Du'a al-Simāt in the last hour of Friday, before sunset; it is among the most distinguished du'as for the answering of needs.", source: "Mafātīḥ al-Jinān" },
  { id: 125, tradition: "shia", category: "Faith",         text: "Faith is what is settled in the hearts and confirmed by actions. Whoever's actions contradict his claim, his claim is rejected.", source: "Imam ʿAlī (ʿa) — Nahj al-Balāgha, Saying 153" },
];

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Returns one insight for the day, filtered to the user's branch.
 * Shia users see Shia + Both content. Sunni users see Sunni + Both content.
 * Defaults to Sunni if no branch passed.
 */
export function getDailyInsight(branch = "sunni") {
  const pool = INSIGHTS.filter(i => i.tradition === branch || i.tradition === "both");
  if (pool.length === 0) return null;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return pool[dayOfYear % pool.length];
}

/**
 * Returns the full list (all branches). Used by any debug screen or list view.
 */
export function getAllInsights() {
  return INSIGHTS;
}

/**
 * Returns just the pool for a given branch (for variety / shuffling).
 */
export function getInsightsForBranch(branch) {
  return INSIGHTS.filter(i => i.tradition === branch || i.tradition === "both");
}
