// src/data/prayers.js
// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE prayer data with full recitations, every rak'ah structure,
// every dhikr — nothing summarised or truncated.
// ─────────────────────────────────────────────────────────────────────────────

// ── FULL RECITATION TEXTS ─────────────────────────────────────────────────────

export const RECITATIONS = {

  // Opening supplication (Istiftah) — recited silently at start
  istiftah: {
    id: "istiftah",
    title: "Du'a al-Istiftah",
    subtitle: "Opening Supplication (recited silently)",
    arabic: `سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَىٰ جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ`,
    transliteration: "Subhanakal-lahumma wa bihamdika wa tabarakasmuka wa ta'ala jadduka wa la ilaha ghayruk",
    translation: "Glory and praise be to You, O Allah. Blessed be Your name and exalted be Your Majesty. There is no god worthy of worship besides You.",
    note: "Recited silently after Takbir, before Ta'awwudh. (Abu Dawud, Tirmidhi)",
  },

  // Ta'awwudh
  taawwudh: {
    id: "taawwudh",
    title: "Ta'awwudh",
    subtitle: "Seeking refuge from Shaytaan (recited silently)",
    arabic: `أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ`,
    transliteration: "A'udhu billahi minash-shaytanir rajeem",
    translation: "I seek refuge in Allah from the accursed devil.",
    note: "Recited silently before Al-Fatiha in each rak'ah (first rak'ah only according to some scholars).",
  },

  // Surah Al-Fatiha — complete
  fatiha: {
    id: "fatiha",
    title: "Surah Al-Fatihah",
    subtitle: "The Opening — 7 verses (obligatory in every rak'ah)",
    arabic: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾
الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾
مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾
اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾
صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾`,
    transliteration: `Bismillahir rahmanir raheem (1)
Al-hamdu lillahi rabbil 'aalameen (2)
Ar-rahmanir raheem (3)
Maliki yawmid deen (4)
Iyyaka na'budu wa iyyaka nasta'een (5)
Ihdinas siratal mustaqeem (6)
Siratal ladhina an'amta 'alayhim ghayril maghdubi 'alayhim wa lad daalleen (7)`,
    translation: `In the name of Allah, the Most Gracious, the Most Merciful. (1)
All praise is due to Allah, Lord of all the worlds. (2)
The Most Gracious, the Most Merciful. (3)
Master of the Day of Judgement. (4)
You alone we worship, and You alone we ask for help. (5)
Guide us to the straight path — (6)
the path of those upon whom You have bestowed favour, not of those who have earned anger, nor of those who are astray. (7)`,
    ameen: true,
    note: "Say 'Ameen' aloud (behind imam) or softly (alone) after completing Al-Fatihah.",
  },

  // Surah Al-Ikhlas — complete
  ikhlas: {
    id: "ikhlas",
    title: "Surah Al-Ikhlas",
    subtitle: "The Sincerity — 4 verses (recommended additional surah)",
    arabic: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾
اللَّهُ الصَّمَدُ ﴿٢﴾
لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾
وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾`,
    transliteration: `Bismillahir rahmanir raheem
Qul huwal-lahu ahad (1)
Allahus samad (2)
Lam yalid wa lam yulad (3)
Wa lam yakul-lahu kufuwan ahad (4)`,
    translation: `In the name of Allah, the Most Gracious, the Most Merciful.
Say: He is Allah, the One. (1)
Allah, the Eternal Refuge. (2)
He neither begets, nor was He begotten. (3)
And there is none comparable to Him. (4)`,
    note: "Equal to one-third of the Quran in reward. (Bukhari)",
  },

  // Surah Al-Falaq — complete
  falaq: {
    id: "falaq",
    title: "Surah Al-Falaq",
    subtitle: "The Daybreak — 5 verses",
    arabic: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾
مِن شَرِّ مَا خَلَقَ ﴿٢﴾
وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾
وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾
وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾`,
    transliteration: `Bismillahir rahmanir raheem
Qul a'udhu birabbilfalaqi (1)
Min sharri ma khalaq (2)
Wa min sharri ghasiqin idha waqab (3)
Wa min sharrin-naffathati fil 'uqad (4)
Wa min sharri hasidin idha hasad (5)`,
    translation: `In the name of Allah, the Most Gracious, the Most Merciful.
Say: I seek refuge in the Lord of the daybreak — (1)
from the evil of what He has created, (2)
and from the evil of darkness when it settles, (3)
and from the evil of the blowers in knots, (4)
and from the evil of an envier when he envies. (5)`,
  },

  // Surah An-Nas — complete
  naas: {
    id: "naas",
    title: "Surah An-Nas",
    subtitle: "Mankind — 6 verses",
    arabic: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾
مَلِكِ النَّاسِ ﴿٢﴾
إِلَٰهِ النَّاسِ ﴿٣﴾
مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾
الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾
مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾`,
    transliteration: `Bismillahir rahmanir raheem
Qul a'udhu birabbin-nas (1)
Malikin-nas (2)
Ilahin-nas (3)
Min sharril-waswasil khannasi (4)
Alladhi yuwaswisu fi sudoorin-nasi (5)
Minal-jinnati wan-nas (6)`,
    translation: `In the name of Allah, the Most Gracious, the Most Merciful.
Say: I seek refuge in the Lord of mankind — (1)
the Sovereign of mankind, (2)
the God of mankind — (3)
from the evil of the retreating whisperer, (4)
who whispers into the hearts of mankind, (5)
from among jinn and mankind. (6)`,
  },

  // Surah Al-Kawthar — complete
  kawthar: {
    id: "kawthar",
    title: "Surah Al-Kawthar",
    subtitle: "Abundance — 3 verses",
    arabic: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ﴿١﴾
فَصَلِّ لِرَبِّكَ وَانْحَرْ ﴿٢﴾
إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ ﴿٣﴾`,
    transliteration: `Bismillahir rahmanir raheem
Inna a'taynaka al-kawthar (1)
Fasalli li-rabbika wanhar (2)
Inna shani'aka huwal-abtar (3)`,
    translation: `In the name of Allah, the Most Gracious, the Most Merciful.
Indeed, We have granted you Al-Kawthar (abundance). (1)
So pray to your Lord and sacrifice. (2)
Indeed, your enemy is the one cut off. (3)`,
  },

  // Surah Al-Asr — complete
  asr: {
    id: "asr",
    title: "Surah Al-Asr",
    subtitle: "The Time — 3 verses",
    arabic: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
وَالْعَصْرِ ﴿١﴾
إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ﴿٢﴾
إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ ﴿٣﴾`,
    transliteration: `Bismillahir rahmanir raheem
Wal-'asr (1)
Innal-insana lafi khusr (2)
Illal-ladhina amanu wa 'amilus-salihati wa tawassaw bil-haqqi wa tawassaw bis-sabr (3)`,
    translation: `In the name of Allah, the Most Gracious, the Most Merciful.
By time — (1)
indeed, mankind is in loss, (2)
except those who believe, do righteous deeds, and counsel one another toward truth and patience. (3)`,
  },

  // Ruku dhikr
  rukuDhikr: {
    id: "rukuDhikr",
    title: "Dhikr in Ruku'",
    subtitle: "Recite at least 3 times",
    arabic: `سُبْحَانَ رَبِّيَ الْعَظِيمِ`,
    transliteration: "Subhana Rabbiyal 'Azeem",
    translation: "Glory be to my Lord, the Most Great.",
    repetitions: 3,
    note: "Minimum 3 times. 5, 7, 9, or 11 times for more reward. (Abu Dawud)",
  },

  // Rising from Ruku
  itidal: {
    id: "itidal",
    title: "Rising from Ruku' (I'tidal)",
    subtitle: "Said while standing up",
    arabic: `سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ`,
    transliteration: "Sami'Allahu liman hamidah",
    translation: "Allah hears those who praise Him.",
    note: "Said while rising. Then stand fully upright and say the response below.",
  },

  // I'tidal response
  itidal_response: {
    id: "itidal_response",
    title: "I'tidal Response",
    subtitle: "Said while standing fully upright",
    arabic: `رَبَّنَا وَلَكَ الْحَمْدُ، حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ`,
    transliteration: "Rabbana wa lakal hamd, hamdan kathiran tayyiban mubarakan feeh",
    translation: "Our Lord, and to You is all praise — abundant, pure, and blessed praise.",
    note: "Stand still and upright while saying this.",
  },

  // Sujood dhikr
  sujoodDhikr: {
    id: "sujoodDhikr",
    title: "Dhikr in Sujood",
    subtitle: "Recite at least 3 times",
    arabic: `سُبْحَانَ رَبِّيَ الْأَعْلَى`,
    transliteration: "Subhana Rabbiyal A'la",
    translation: "Glory be to my Lord, the Most High.",
    repetitions: 3,
    note: "7 body parts must touch the ground: forehead + nose, both palms, both knees, toes of both feet.",
  },

  // Between two sujood
  jilsahDhikr: {
    id: "jilsahDhikr",
    title: "Between Two Sujood (Jilsah)",
    subtitle: "Sitting briefly — recite once",
    arabic: `رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي`,
    transliteration: "Rabbighfir li, Rabbighfir li",
    translation: "O Lord, forgive me. O Lord, forgive me.",
    note: "Sit with the left foot under you and right foot upright. Some scholars say once, others say twice or three times.",
  },

  // Tashahhud — complete
  tashahhud: {
    id: "tashahhud",
    title: "At-Tashahhud",
    subtitle: "Testimony — recited in every sitting",
    arabic: `التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ
السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ
السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ
أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ`,
    transliteration: `At-tahiyyatu lillahi was-salawatu wat-tayyibat
As-salamu 'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh
As-salamu 'alayna wa 'ala 'ibadillahis-salihin
Ash-hadu al-la ilaha illallahu wa ash-hadu anna Muhammadan 'abduhu wa rasuluh`,
    translation: `All greetings of humility belong to Allah, and all prayers and goodness.
Peace be upon you, O Prophet, and the mercy of Allah and His blessings.
Peace be upon us and upon the righteous servants of Allah.
I bear witness that there is no god worthy of worship except Allah, and I bear witness that Muhammad is His servant and messenger.`,
    note: "Raise the right index finger and point it when saying the Shahada. Keep it raised until you complete the Tashahhud.",
  },

  // Salawat Ibrahimiyyah — complete
  salawat: {
    id: "salawat",
    title: "Salawat Ibrahimiyyah",
    subtitle: "Blessings upon the Prophet ﷺ — recited in final sitting",
    arabic: `اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ
كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ
إِنَّكَ حَمِيدٌ مَجِيدٌ
اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ
كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ
إِنَّكَ حَمِيدٌ مَجِيدٌ`,
    transliteration: `Allahumma salli 'ala Muhammadin wa 'ala aali Muhammad
Kama sallayta 'ala Ibrahima wa 'ala aali Ibrahim
Innaka hamidun majeed
Allahumma barik 'ala Muhammadin wa 'ala aali Muhammad
Kama barakta 'ala Ibrahima wa 'ala aali Ibrahim
Innaka hamidun majeed`,
    translation: `O Allah, send Your blessings upon Muhammad and upon the family of Muhammad,
just as You sent blessings upon Ibrahim and the family of Ibrahim.
Indeed, You are Praiseworthy and Glorious.
O Allah, bless Muhammad and the family of Muhammad,
just as You blessed Ibrahim and the family of Ibrahim.
Indeed, You are Praiseworthy and Glorious.`,
    note: "Recited only in the final sitting (not in the middle sitting of 3 or 4 rak'ah prayers).",
  },

  // Final Dua before Tasleem (recommended)
  duaFinal: {
    id: "duaFinal",
    title: "Du'a Before Tasleem",
    subtitle: "Recommended supplication (recited silently in final sitting)",
    arabic: `اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ
وَمِنْ عَذَابِ جَهَنَّمَ
وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ
وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ`,
    transliteration: `Allahumma inni a'udhu bika min 'adhabil-qabr
Wa min 'adhabi jahannam
Wa min fitnatil mahya wal mamat
Wa min sharri fitnatil masihid-dajjal`,
    translation: `O Allah, I seek refuge in You from the punishment of the grave,
from the punishment of Hellfire,
from the trials of life and death,
and from the evil of the trial of the False Messiah (Dajjal).`,
    note: "The Prophet ﷺ commanded us to seek refuge from these four things in every prayer. (Bukhari & Muslim)",
  },

  // Tasleem
  tasleem: {
    id: "tasleem",
    title: "Tasleem",
    subtitle: "Ending the Prayer",
    arabic: `السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ`,
    transliteration: "As-salamu 'alaykum wa rahmatullahi",
    translation: "Peace be upon you and the mercy of Allah.",
    note: "Turn head to the RIGHT and say it, then turn to the LEFT and say it again. This ends the prayer.",
  },

  // Qunut for Witr
  qunut: {
    id: "qunut",
    title: "Du'a al-Qunut",
    subtitle: "Recited in Witr prayer (last rak'ah, after rising from ruku')",
    arabic: `اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ
وَعَافِنِي فِيمَنْ عَافَيْتَ
وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ
وَبَارِكْ لِي فِيمَا أَعْطَيْتَ
وَقِنِي شَرَّ مَا قَضَيْتَ
فَإِنَّكَ تَقْضِي وَلَا يُقْضَىٰ عَلَيْكَ
وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ
وَلَا يَعِزُّ مَنْ عَادَيْتَ
تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ`,
    transliteration: `Allahumma-hdini fiman hadayt
Wa 'afini fiman 'afayt
Wa tawallani fiman tawallayt
Wa barik li fima a'tayt
Wa qini sharra ma qadayt
Fa innaka taqdi wa la yuqda 'alayk
Wa innahu la yadhillu man walayt
Wa la ya'izzu man 'adayt
Tabarakta Rabbana wa ta'alayt`,
    translation: `O Allah, guide me among those whom You have guided.
Grant me well-being among those You have given well-being to.
Take me into Your care among those You have taken care of.
Bless me in what You have given me.
Protect me from the evil of what You have decreed.
For You decree and none can decree against You.
Truly, none is humbled whom You befriend.
And none is honoured whom You oppose.
Blessed are You, our Lord, Most High.`,
    note: "Taught by the Prophet ﷺ to Al-Hasan ibn Ali (ra). (Abu Dawud, Tirmidhi, Nasai)",
  },
};

// ── PRAYER STEPS ENGINE ───────────────────────────────────────────────────────
// Each step has: id, phase, title, action, pose, recitations[]
// recitations reference keys from RECITATIONS above

export const STEP_PHASES = {
  preparation: "Preparation",
  takbir:      "Opening Takbir",
  qiyam:       "Standing (Qiyam)",
  ruku:        "Bowing (Ruku')",
  itidal:      "Rising from Ruku'",
  sujood1:     "First Prostration",
  jilsah:      "Sitting Between",
  sujood2:     "Second Prostration",
  qiyam2:      "Standing Again",
  tashahhud:   "Middle Sitting",
  tashahhud_final: "Final Sitting",
  tasleem:     "Ending (Tasleem)",
};

// Steps for rak'ah 1 (has Istiftah + Ta'awwudh, recite additional surah)
function rak1Steps(surahKey = "ikhlas") {
  return [
    {
      id: "niyyah",
      phase: "preparation",
      title: "Niyyah — Intention",
      pose: "standing",
      action: "Stand upright facing the Qibla. Make the intention in your heart to pray. You do not need to say the intention aloud — it is in the heart.",
      recitations: [],
      note: "The intention is an act of the heart, not the tongue. Simply intend to pray this specific prayer for the sake of Allah.",
    },
    {
      id: "takbir",
      phase: "takbir",
      title: "Takbiratul Ihram",
      pose: "takbir",
      action: "Raise both hands to your earlobes, palms facing the Qibla. Men's thumbs should touch the earlobes. Say 'Allahu Akbar' — this marks the beginning of the prayer. Lower your hands and place your right hand over your left on your chest.",
      recitations: [
        { key: "istiftah_takbir", inline: true,
          arabic: "اللَّهُ أَكْبَرُ",
          transliteration: "Allahu Akbar",
          translation: "Allah is the Greatest.",
          note: "Said aloud while raising hands." },
      ],
    },
    {
      id: "istiftah",
      phase: "qiyam",
      title: "Opening Supplication",
      pose: "standing",
      action: "After the Takbir, place right hand over left on your chest. Recite the opening supplication silently.",
      recitations: [{ key: "istiftah" }, { key: "taawwudh" }],
    },
    {
      id: "fatiha_r1",
      phase: "qiyam",
      title: "Surah Al-Fatihah",
      pose: "standing",
      action: "Recite Surah Al-Fatihah. It is obligatory in every rak'ah. Take your time and reflect on each verse.",
      recitations: [{ key: "fatiha" }],
    },
    {
      id: "surah_r1",
      phase: "qiyam",
      title: "Additional Surah",
      pose: "standing",
      action: "After Al-Fatihah, recite an additional surah or verses. This is recommended (Sunnah) in the first two rak'ahs.",
      recitations: [{ key: surahKey }],
    },
    {
      id: "ruku",
      phase: "ruku",
      title: "Ruku' — Bowing",
      pose: "ruku",
      action: "Say 'Allahu Akbar' and bow forward. Place your palms firmly on your knees, fingers spread. Keep your back straight and horizontal to the ground. Your head should be level with your back — not raised or lowered.",
      recitations: [
        { key: "rukuTakbir_inline", inline: true,
          arabic: "اللَّهُ أَكْبَرُ",
          transliteration: "Allahu Akbar",
          translation: "Allah is the Greatest.",
          note: "Said while going down into ruku'." },
        { key: "rukuDhikr" },
      ],
    },
    {
      id: "itidal",
      phase: "itidal",
      title: "I'tidal — Rising from Ruku'",
      pose: "standing",
      action: "Rise from ruku' saying 'Sami Allahu liman hamidah'. Stand fully upright — do not rush. Then say the response. Stand still briefly before going to sujood.",
      recitations: [{ key: "itidal" }, { key: "itidal_response" }],
    },
    {
      id: "sujood1",
      phase: "sujood1",
      title: "First Sujood — Prostration",
      pose: "sujood",
      action: "Say 'Allahu Akbar' and go into prostration. Seven body parts must touch the ground: (1) forehead and nose together, (2) right palm, (3) left palm, (4) right knee, (5) left knee, (6) toes of right foot, (7) toes of left foot. Your forearms should NOT rest on the ground.",
      recitations: [
        { key: "sujoodTakbir_inline", inline: true,
          arabic: "اللَّهُ أَكْبَرُ",
          transliteration: "Allahu Akbar",
          translation: "Allah is the Greatest.",
          note: "Said while going down into sujood." },
        { key: "sujoodDhikr" },
      ],
    },
    {
      id: "jilsah",
      phase: "jilsah",
      title: "Jilsah — Sitting Between Prostrations",
      pose: "sitting",
      action: "Say 'Allahu Akbar' and sit up. Sit with your left foot flat under you and your right foot upright, toes pointing toward the Qibla. Rest your hands on your thighs. Recite the du'a.",
      recitations: [
        { key: "jilsahTakbir_inline", inline: true,
          arabic: "اللَّهُ أَكْبَرُ",
          transliteration: "Allahu Akbar",
          translation: "Allah is the Greatest.",
          note: "Said while rising from sujood." },
        { key: "jilsahDhikr" },
      ],
    },
    {
      id: "sujood2",
      phase: "sujood2",
      title: "Second Sujood",
      pose: "sujood",
      action: "Say 'Allahu Akbar' and prostrate again, exactly as before. This completes one full rak'ah.",
      recitations: [
        { key: "sujood2Takbir_inline", inline: true,
          arabic: "اللَّهُ أَكْبَرُ",
          transliteration: "Allahu Akbar",
          translation: "Allah is the Greatest.",
          note: "Said while going into second sujood." },
        { key: "sujoodDhikr" },
      ],
    },
  ];
}

// Steps for middle rak'ahs (no Istiftah, recite surah optionally)
function middleRakahSteps(reciteSurah = true, surahKey = "ikhlas") {
  const steps = [
    {
      id: "rise_to_qiyam",
      phase: "qiyam",
      title: "Rise to Standing",
      pose: "standing",
      action: "After the second sujood, say 'Allahu Akbar' and rise to a standing position. Some scholars recommend briefly sitting (jalsatul istiraha) before rising.",
      recitations: [
        { key: "riseToQiyam_inline", inline: true,
          arabic: "اللَّهُ أَكْبَرُ",
          transliteration: "Allahu Akbar",
          translation: "Allah is the Greatest.",
          note: "Said while rising to stand for the next rak'ah." },
      ],
    },
    {
      id: "fatiha_mid",
      phase: "qiyam",
      title: "Surah Al-Fatihah",
      pose: "standing",
      action: "Recite Al-Fatihah. No Ta'awwudh or Istiftah in subsequent rak'ahs.",
      recitations: [{ key: "fatiha" }],
    },
  ];
  if (reciteSurah) {
    steps.push({
      id: "surah_mid",
      phase: "qiyam",
      title: "Additional Surah",
      pose: "standing",
      action: "Recite an additional surah or some verses. This is Sunnah in the first two rak'ahs; in the 3rd and 4th rak'ah of obligatory prayers, only Al-Fatiha is recited.",
      recitations: [{ key: surahKey }],
    });
  }
  steps.push(
    {
      id: "ruku_mid",
      phase: "ruku",
      title: "Ruku'",
      pose: "ruku",
      action: "Say 'Allahu Akbar' and bow. Back parallel to the ground, hands on knees.",
      recitations: [
        { key: "rukuTakbir2_inline", inline: true,
          arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar",
          translation: "Allah is the Greatest.", note: "Said while going into ruku'." },
        { key: "rukuDhikr" },
      ],
    },
    {
      id: "itidal_mid",
      phase: "itidal",
      title: "I'tidal",
      pose: "standing",
      action: "Rise saying 'Sami Allahu liman hamidah', then stand upright.",
      recitations: [{ key: "itidal" }, { key: "itidal_response" }],
    },
    {
      id: "sujood1_mid",
      phase: "sujood1",
      title: "First Sujood",
      pose: "sujood",
      action: "Say 'Allahu Akbar' and prostrate on all seven body parts.",
      recitations: [
        { key: "sujoodTakbir2_inline", inline: true,
          arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar",
          translation: "Allah is the Greatest.", note: "Said going into sujood." },
        { key: "sujoodDhikr" },
      ],
    },
    {
      id: "jilsah_mid",
      phase: "jilsah",
      title: "Jilsah",
      pose: "sitting",
      action: "Sit up between prostrations.",
      recitations: [
        { key: "jilsahTakbir2_inline", inline: true,
          arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar",
          translation: "Allah is the Greatest.", note: "Said while sitting up." },
        { key: "jilsahDhikr" },
      ],
    },
    {
      id: "sujood2_mid",
      phase: "sujood2",
      title: "Second Sujood",
      pose: "sujood",
      action: "Prostrate again.",
      recitations: [
        { key: "sujood2Takbir2_inline", inline: true,
          arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar",
          translation: "Allah is the Greatest.", note: "Said going into sujood." },
        { key: "sujoodDhikr" },
      ],
    },
  );
  return steps;
}

// Middle Tashahhud (no Salawat, no Dua, just Tashahhud then rise)
function middleTashahudSteps() {
  return [
    {
      id: "tashahhud_mid",
      phase: "tashahhud",
      title: "Middle Tashahhud",
      pose: "sitting",
      action: "After the second sujood of the 2nd rak'ah, say 'Allahu Akbar' and sit in the Tashahhud position. Recite only the Tashahhud — NOT the Salawat. Then rise for the next rak'ah saying 'Allahu Akbar'.",
      recitations: [
        { key: "tashahudTakbir_inline", inline: true,
          arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar",
          translation: "Allah is the Greatest.", note: "Said while sitting down." },
        { key: "tashahhud" },
      ],
    },
  ];
}

// Final sitting (Tashahhud + Salawat + Dua + Tasleem)
function finalSittingSteps() {
  return [
    {
      id: "final_sit",
      phase: "tashahhud_final",
      title: "Final Sitting (Qa'dah Akhirah)",
      pose: "sitting",
      action: "After the last sujood, say 'Allahu Akbar' and sit in the Tashahhud position. In the final sitting, recite: Tashahhud, then Salawat, then the Du'a before Tasleem.",
      recitations: [
        { key: "finalSitTakbir_inline", inline: true,
          arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar",
          translation: "Allah is the Greatest.", note: "Said while sitting down for final sitting." },
        { key: "tashahhud" },
        { key: "salawat" },
        { key: "duaFinal" },
      ],
    },
    {
      id: "tasleem",
      phase: "tasleem",
      title: "Tasleem — Ending the Prayer",
      pose: "tasleem",
      action: "Turn your head to the RIGHT and say the Tasleem. Then turn to the LEFT and say it again. You are now out of the prayer state.",
      recitations: [{ key: "tasleem" }],
    },
  ];
}

// ── PRAYER DEFINITIONS ────────────────────────────────────────────────────────
// Each prayer has: rak'ahs array, each rak'ah has steps[]

export const PRAYERS = [
  {
    id: "fajr",
    name: "Fajr",
    arabic: "الفجر",
    meaning: "Dawn Prayer",
    time: "From dawn until just before sunrise",
    type: "fard",
    totalRakaat: 2,
    importance: "The Prophet ﷺ said: 'Whoever prays Fajr is under the protection of Allah.' (Muslim). It is the most beloved prayer to Allah and the hardest on the hypocrites.",
    rakaat: [
      {
        num: 1,
        label: "Rak'ah 1",
        desc: "Al-Fatihah + Additional Surah",
        steps: rak1Steps("ikhlas"),
      },
      {
        num: 2,
        label: "Rak'ah 2 — Final",
        desc: "Al-Fatihah + Additional Surah → Final Sitting",
        steps: [
          ...middleRakahSteps(true, "falaq"),
          ...finalSittingSteps(),
        ],
      },
    ],
  },

  {
    id: "dhuhr",
    name: "Dhuhr",
    arabic: "الظهر",
    meaning: "Midday Prayer",
    time: "After the sun passes its zenith until Asr",
    type: "fard",
    totalRakaat: 4,
    importance: "Dhuhr is prayed when the world is most busy. The Prophet ﷺ said: 'These are two prayers that people are heedless of: the time between them is when the gates of heaven open.' (Ahmad)",
    rakaat: [
      {
        num: 1,
        label: "Rak'ah 1",
        desc: "Al-Fatihah + Additional Surah (recited silently)",
        steps: rak1Steps("ikhlas"),
      },
      {
        num: 2,
        label: "Rak'ah 2 → Middle Sitting",
        desc: "Al-Fatihah + Surah → Tashahhud (middle sitting only)",
        steps: [
          ...middleRakahSteps(true, "kawthar"),
          ...middleTashahudSteps(),
        ],
      },
      {
        num: 3,
        label: "Rak'ah 3",
        desc: "Al-Fatihah only (no additional surah in 3rd & 4th)",
        steps: middleRakahSteps(false),
      },
      {
        num: 4,
        label: "Rak'ah 4 — Final",
        desc: "Al-Fatihah only → Final Sitting",
        steps: [
          ...middleRakahSteps(false),
          ...finalSittingSteps(),
        ],
      },
    ],
  },

  {
    id: "asr",
    name: "Asr",
    arabic: "العصر",
    meaning: "Afternoon Prayer",
    time: "Mid-afternoon until just before sunset",
    type: "fard",
    totalRakaat: 4,
    importance: "The Prophet ﷺ said: 'Whoever misses Asr prayer, it is as if he lost his family and his wealth.' (Bukhari). It is the 'middle prayer' Allah specifically commands us to guard.",
    rakaat: [
      {
        num: 1,
        label: "Rak'ah 1",
        desc: "Al-Fatihah + Additional Surah (recited silently)",
        steps: rak1Steps("asr"),
      },
      {
        num: 2,
        label: "Rak'ah 2 → Middle Sitting",
        desc: "Al-Fatihah + Surah → Tashahhud (middle sitting)",
        steps: [
          ...middleRakahSteps(true, "naas"),
          ...middleTashahudSteps(),
        ],
      },
      {
        num: 3,
        label: "Rak'ah 3",
        desc: "Al-Fatihah only",
        steps: middleRakahSteps(false),
      },
      {
        num: 4,
        label: "Rak'ah 4 — Final",
        desc: "Al-Fatihah only → Final Sitting",
        steps: [
          ...middleRakahSteps(false),
          ...finalSittingSteps(),
        ],
      },
    ],
  },

  {
    id: "maghrib",
    name: "Maghrib",
    arabic: "المغرب",
    meaning: "Sunset Prayer",
    time: "Immediately after sunset until Isha",
    type: "fard",
    totalRakaat: 3,
    importance: "Maghrib should be prayed promptly after sunset without delay. The Prophet ﷺ never delayed it. It marks the transition from day to night.",
    rakaat: [
      {
        num: 1,
        label: "Rak'ah 1",
        desc: "Al-Fatihah + Additional Surah",
        steps: rak1Steps("ikhlas"),
      },
      {
        num: 2,
        label: "Rak'ah 2 → Middle Sitting",
        desc: "Al-Fatihah + Surah → Tashahhud (middle sitting)",
        steps: [
          ...middleRakahSteps(true, "falaq"),
          ...middleTashahudSteps(),
        ],
      },
      {
        num: 3,
        label: "Rak'ah 3 — Final",
        desc: "Al-Fatihah only → Final Sitting",
        steps: [
          ...middleRakahSteps(false),
          ...finalSittingSteps(),
        ],
      },
    ],
  },

  {
    id: "isha",
    name: "Isha",
    arabic: "العشاء",
    meaning: "Night Prayer",
    time: "After twilight disappears until Fajr (best before midnight)",
    type: "fard",
    totalRakaat: 4,
    importance: "The Prophet ﷺ said: 'If people knew the reward for Fajr and Isha prayers in congregation, they would come to them even if they had to crawl.' (Bukhari & Muslim)",
    rakaat: [
      {
        num: 1,
        label: "Rak'ah 1",
        desc: "Al-Fatihah + Additional Surah (recited aloud)",
        steps: rak1Steps("ikhlas"),
      },
      {
        num: 2,
        label: "Rak'ah 2 → Middle Sitting",
        desc: "Al-Fatihah + Surah → Tashahhud (middle sitting)",
        steps: [
          ...middleRakahSteps(true, "naas"),
          ...middleTashahudSteps(),
        ],
      },
      {
        num: 3,
        label: "Rak'ah 3",
        desc: "Al-Fatihah only (silent)",
        steps: middleRakahSteps(false),
      },
      {
        num: 4,
        label: "Rak'ah 4 — Final",
        desc: "Al-Fatihah only → Final Sitting",
        steps: [
          ...middleRakahSteps(false),
          ...finalSittingSteps(),
        ],
      },
    ],
  },
];

export const SUNNAH_PRAYERS = [
  {
    id: "witr",
    name: "Witr",
    arabic: "الوتر",
    meaning: "Odd-numbered prayer",
    time: "After Isha until Fajr (best in last third of night)",
    type: "sunnah_muakkadah",
    totalRakaat: 3,
    importance: "The Prophet ﷺ said: 'Allah is Witr (odd) and He loves the odd.' He never abandoned Witr whether at home or travelling. (Bukhari & Muslim)",
    note: "Witr has a special du'a called Qunut recited in the last rak'ah after rising from ruku'.",
    rakaat: [
      {
        num: 1,
        label: "Rak'ah 1",
        desc: "Al-Fatihah + Al-A'la (recommended)",
        steps: rak1Steps("ikhlas"),
      },
      {
        num: 2,
        label: "Rak'ah 2 → Middle Sitting",
        desc: "Al-Fatihah + Al-Kafirun (recommended) → Tashahhud",
        steps: [
          ...middleRakahSteps(true, "falaq"),
          ...middleTashahudSteps(),
        ],
      },
      {
        num: 3,
        label: "Rak'ah 3 — Final (with Qunut)",
        desc: "Al-Fatihah + Al-Ikhlas + Du'a Qunut → Final Sitting",
        steps: [
          ...middleRakahSteps(true, "ikhlas"),
          {
            id: "qunut",
            phase: "itidal",
            title: "Du'a al-Qunut",
            pose: "standing",
            action: "After rising from ruku' in the LAST rak'ah, raise your hands and recite Du'a al-Qunut before going to sujood.",
            recitations: [{ key: "qunut" }],
          },
          ...finalSittingSteps(),
        ],
      },
    ],
  },

  {
    id: "tahajjud",
    name: "Tahajjud",
    arabic: "التهجد",
    meaning: "Night Vigil Prayer",
    time: "Last third of the night, after waking from sleep",
    type: "nafl",
    totalRakaat: 8,
    importance: "Allah says: 'And from the night, pray with it as additional worship for you; it may be that your Lord will raise you to a praised station.' (17:79). The Prophet ﷺ prayed 8 rak'ahs of Tahajjud plus 3 Witr.",
    note: "Pray in pairs of 2 rak'ahs. You can pray 2, 4, 6, or 8 rak'ahs.",
    rakaat: [
      {
        num: 1,
        label: "Rak'ah 1 (of 2)",
        desc: "Al-Fatihah + Additional Surah",
        steps: rak1Steps("kawthar"),
      },
      {
        num: 2,
        label: "Rak'ah 2 — Final",
        desc: "Al-Fatihah + Additional Surah → Final Sitting",
        steps: [
          ...middleRakahSteps(true, "ikhlas"),
          ...finalSittingSteps(),
        ],
      },
    ],
  },

  {
    id: "duha",
    name: "Duha",
    arabic: "الضحى",
    meaning: "Forenoon Prayer",
    time: "After sunrise (approx 15–20 min) until just before midday",
    type: "nafl",
    totalRakaat: 4,
    importance: "The Prophet ﷺ said: 'Charity is required from every joint of your body daily. Two rak'ahs of Duha are sufficient for all of that.' (Muslim). He said it is the prayer of the repentant (Salat al-Awwabin).",
    note: "Pray a minimum of 2 rak'ahs. Maximum is 8 according to most scholars.",
    rakaat: [
      {
        num: 1,
        label: "Rak'ah 1",
        desc: "Al-Fatihah + Additional Surah",
        steps: rak1Steps("ikhlas"),
      },
      {
        num: 2,
        label: "Rak'ah 2 — Final",
        desc: "Al-Fatihah + Surah → Final Sitting",
        steps: [
          ...middleRakahSteps(true, "asr"),
          ...finalSittingSteps(),
        ],
      },
    ],
  },
];

// Flat step list helper — combines all rak'ah steps with rak'ah number injected
export function getAllSteps(prayer) {
  const all = [];
  prayer.rakaat.forEach(rak => {
    rak.steps.forEach((step, stepIdx) => {
      all.push({ ...step, rakahNum: rak.num, rakahLabel: rak.label, stepIdx });
    });
  });
  return all;
}

// Lookup a recitation by key (falls back to inline if not in RECITATIONS)
export function getRecitation(keyOrInline) {
  if (keyOrInline.inline) return keyOrInline; // inline object
  return RECITATIONS[keyOrInline.key] ?? null;
}

export const RAKAAT_INFO = [
  { prayer: "Fajr",    sunnah_before: 2, fard: 2,  sunnah_after: 0, nafl: 0 },
  { prayer: "Dhuhr",   sunnah_before: 4, fard: 4,  sunnah_after: 2, nafl: 2 },
  { prayer: "Asr",     sunnah_before: 4, fard: 4,  sunnah_after: 0, nafl: 0 },
  { prayer: "Maghrib", sunnah_before: 0, fard: 3,  sunnah_after: 2, nafl: 2 },
  { prayer: "Isha",    sunnah_before: 4, fard: 4,  sunnah_after: 2, nafl: 2 },
];
