// src/data/rightsData.js
// ─────────────────────────────────────────────────────────────────────────────
// Men's and Women's Rights in Islam — comprehensive coverage.
//
// 7 major topics, each with multiple sections. Citations from Qur'an,
// canonical Sunni hadith (Bukhārī, Muslim, Tirmidhī, Abī Dāwūd, Nasāʾī,
// Ibn Mājah), and major Shia sources (al-Kāfī, Nahj al-Balāgha, Wasāʾil
// al-Shīʿa, Biḥār al-Anwār, Sahīfa al-Sajjādiyyah).
//
// Where Sunni and Shia rulings differ substantively, the difference is
// noted in `shiaSunniNote`. All content presents both perspectives fairly.
//
// audience: "both" | "women" | "men" | "children" | "parents" | "all"
//
// ⚠️ DRAFT — Scholar review required before shipping.
// ─────────────────────────────────────────────────────────────────────────────

export const RIGHTS_TOPICS = [
  // ═════════════════════════════════════════════════════════════════════════
  // 1. MARITAL RIGHTS
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: "marital-rights",
    name: "Marital Rights",
    arabicName: "حقوق الزوجين",
    audience: "both",
    icon: "heart",
    description: "The mutual rights and obligations between husband and wife — built on kindness, equity, and mutual care, not domination.",
    sections: [
      {
        title: "The Wife's Right to Mahr",
        audience: "women",
        content: "Mahr is the bridal gift the husband gives the wife at marriage — her exclusive property, not the family's. It may be money, gold, property, or anything she accepts. The amount is whatever they agree on. No marriage is valid without it. Once given, the wife may spend, save, or invest it as she chooses; the husband has no claim over it.",
        citations: [
          { source: "Qur'an 4:4", text: "Give the women their dower as a free gift. But if of their own good pleasure they remit any part of it to you, then enjoy it with right good cheer." },
          { source: "Ṣaḥīḥ al-Bukhārī 5135", text: "The Prophet ﷺ confirmed that a marriage required a mahr — even if it was only an iron ring." },
          { source: "al-Kāfī vol. 5 — Book of Marriage", text: "Imam al-Bāqir (ʿa): 'The mahr is whatever two have agreed upon between them; little or much, it is hers.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "The Wife's Right to Maintenance (Nafaqah)",
        audience: "women",
        content: "The husband must provide his wife with food, clothing, shelter, and reasonable expenses at a standard he can afford — even if she is wealthy and even if her father provided well. Her wealth is hers; his support is hers. If he fails to provide, she has the right to seek dissolution of the marriage.",
        citations: [
          { source: "Qur'an 2:233", text: "Upon the father is the mothers' provision and their clothing according to what is acceptable. No person is charged with more than his capacity." },
          { source: "Qur'an 65:7", text: "Let a man of wealth spend from his wealth, and he whose provision is restricted, let him spend from what Allah has given him." },
          { source: "Ṣaḥīḥ Muslim 1218", text: "The Prophet ﷺ in the Farewell Sermon: 'You have rights over your wives, and they have rights over you — namely that you provide for them and clothe them in kindness.'" },
          { source: "al-Kāfī vol. 5", text: "Imam al-Ṣādiq (ʿa): 'A man's obligation to his wife is to feed her, clothe her, and not strike her face nor abuse her.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Kindness and Good Treatment (Muʿāsharah bi-l-Maʿrūf)",
        audience: "both",
        content: "The Qur'an commands husbands to live with wives in kindness — not merely tolerance. Mutual respect, gentleness, patience, and affection are obligatory, not optional. The Prophet ﷺ said the best of men are those who treat their wives best, and he was the gentlest with his own household.",
        citations: [
          { source: "Qur'an 4:19", text: "Live with them in kindness. If you dislike them, perhaps you dislike a thing in which Allah has placed much good." },
          { source: "Qur'an 30:21", text: "Among His signs is that He created for you mates from yourselves that you may find tranquillity in them; and He placed between you love and mercy." },
          { source: "Sunan al-Tirmidhī 3895", text: "The Prophet ﷺ: 'The best of you is the one who is best to his wife, and I am the best of you to my wives.'" },
          { source: "al-Kāfī vol. 5", text: "Imam al-Ṣādiq (ʿa): 'The faith of a believer is not complete until he is good to his wife.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Equity in Polygamy",
        audience: "men",
        content: "Polygamy is permitted up to four wives — but conditioned on absolute justice between them in time, expenditure, and treatment. The Qur'an itself warns that if a man cannot maintain equity, he should marry only one. The Prophet ﷺ said one who favours one wife over another comes on the Day of Judgment with half his body paralyzed.",
        citations: [
          { source: "Qur'an 4:3", text: "Marry those that please you of women — two or three or four. But if you fear you will not be just, then only one." },
          { source: "Qur'an 4:129", text: "You will never be able to be equal between wives, even if you so desired. So do not incline completely [toward one], leaving the other suspended." },
          { source: "Sunan Abī Dāwūd 2133", text: "The Prophet ﷺ: 'Whoever has two wives and inclines toward one of them will come on the Day of Judgement with one side of his body paralyzed.'" },
        ],
        shiaSunniNote: "Shia jurisprudence also permits temporary marriage (mutʿah) with specific conditions, which Sunni schools have abrogated since the time of ʿUmar. The four-wife limit on permanent marriage applies in both traditions.",
      },
      {
        title: "The Husband's Right to Companionship and Cooperation",
        audience: "men",
        content: "The husband has rights too: the wife should be a partner and companion, not a stranger in her own home. She is not obligated to housework as a religious duty (most scholars), but partnership in maintaining the home is encouraged. Mutual affection, faithfulness, and not denying intimacy without valid reason are part of this.",
        citations: [
          { source: "Qur'an 2:228", text: "Women have rights similar to the rights upon them, according to what is reasonable." },
          { source: "Ṣaḥīḥ al-Bukhārī 5193", text: "The Prophet ﷺ: 'When a husband calls his wife to bed and she refuses, the angels curse her until morning' — interpreted as referring to refusal without valid reason or compulsion." },
          { source: "al-Kāfī vol. 5", text: "Imam al-Ṣādiq (ʿa): 'The best of women is the one whose company pleases her husband and her conduct is righteous.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Divorce — Right to Initiate",
        audience: "both",
        content: "Divorce (ṭalāq) is the husband's prerogative in the standard form, but the wife has parallel rights. She may seek khulʿ — a separation she initiates, typically returning the mahr — and the judge must grant it if she requests with valid cause. The Prophet ﷺ instructed a man whose wife sought separation to release her.",
        citations: [
          { source: "Qur'an 2:229", text: "Divorce is twice. Then either keep her in an acceptable manner or release her with good treatment." },
          { source: "Qur'an 4:35", text: "If you fear dissension between the two, send an arbitrator from his people and an arbitrator from her people." },
          { source: "Ṣaḥīḥ al-Bukhārī 5273", text: "Thābit ibn Qays's wife came to the Prophet ﷺ requesting separation. The Prophet ﷺ instructed Thābit to take back what he had given her and release her." },
          { source: "al-Kāfī vol. 6", text: "Imam al-Ṣādiq (ʿa) detailed the conditions and forms of khulʿ as a right of the wife." },
        ],
        shiaSunniNote: "Shia and Sunni rulings on divorce procedures differ in detail (e.g., Shia requires the presence of two just witnesses for ṭalāq to be valid). Consult a marjaʿ or scholar for specifics.",
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 2. PARENTS AND CHILDREN
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: "parents-children",
    name: "Rights of Parents & Children",
    arabicName: "حقوق الوالدين والأولاد",
    audience: "all",
    icon: "users",
    description: "The reciprocal rights between parents and children — care, honour, and lifelong duty in both directions.",
    sections: [
      {
        title: "Children's Right to be Welcomed and Loved",
        audience: "children",
        content: "Every child — daughter or son — has the right to be welcomed at birth, named with care, and loved equally. The Prophet ﷺ explicitly forbade preferring sons over daughters, a practice common in his time. Daughters are described as a means of paradise for the parents who raise them well.",
        citations: [
          { source: "Qur'an 16:58–59", text: "When one of them is informed of [the birth of] a female, his face becomes dark, and he suppresses grief... evil indeed is what they decide." },
          { source: "Ṣaḥīḥ al-Bukhārī 5995", text: "The Prophet ﷺ: 'Whoever raises two daughters until they reach maturity, he and I will come on the Day of Judgement like this' — pointing his two fingers close together." },
          { source: "al-Kāfī vol. 6", text: "Imam al-Ṣādiq (ʿa): 'Daughters are blessings; sons are favours. Allah will ask about the favours, but reward you for the blessings.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Children's Right to Education and Upbringing",
        audience: "children",
        content: "Parents must provide their children — both girls and boys — with religious education, moral upbringing, and as much worldly knowledge as they can. Teaching children the Qur'an, ethics, and a trade or profession is part of the parental obligation, not optional. Educational neglect is itself a violation of rights.",
        citations: [
          { source: "Qur'an 66:6", text: "O you who believe! Save yourselves and your families from a fire whose fuel is people and stones." },
          { source: "Sunan al-Tirmidhī 1952", text: "The Prophet ﷺ: 'No father gives his child anything better than good manners.'" },
          { source: "al-Kāfī vol. 6", text: "Imam ʿAlī (ʿa): 'Teach your children the Qurʾan, swimming, and archery' — interpreted broadly as religious learning, physical skill, and self-defence." },
          { source: "Sahīfa al-Sajjādiyyah (Risālat al-Ḥuqūq)", text: "Imam Zayn al-ʿĀbidīn (ʿa): 'The right of your child upon you is that you know he comes from you... and that you help him in goodness and assist him in obedience to Allah.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Children's Right to Equitable Treatment",
        audience: "children",
        content: "Parents must treat their children justly. Favouritism — whether in gifts, attention, or affection — is forbidden. The Prophet ﷺ refused to witness a gift given to one son but not the others, declaring it injustice. This applies between boys and girls, and between siblings.",
        citations: [
          { source: "Ṣaḥīḥ al-Bukhārī 2587", text: "Bashīr gave a gift to one son and asked the Prophet ﷺ to witness it. The Prophet ﷺ asked: 'Did you give the same to all your children?' When Bashīr said no, the Prophet ﷺ refused: 'I will not bear witness to injustice.'" },
          { source: "Sunan al-Nasāʾī 3680", text: "'Fear Allah and be just among your children.'" },
          { source: "al-Kāfī vol. 6", text: "Imam al-Ṣādiq (ʿa) cited the Prophet's ﷺ command to be equitable, applying it to daughters and sons alike." },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Parents' Right to Honour and Kindness (Birr al-Wālidayn)",
        audience: "parents",
        content: "Honouring parents is mentioned in the Qur'an immediately after the command to worship Allah alone — emphasizing its primacy. Children must speak to them gently, never with frustration, never raising their voice, and must serve them especially in old age. This duty does not lapse if the parents are not Muslim.",
        citations: [
          { source: "Qur'an 17:23–24", text: "Your Lord has decreed that you worship none but Him, and to parents do good. Whether one or both reach old age in your life, say not to them a word of contempt, nor repel them, but speak to them in terms of honour." },
          { source: "Qur'an 31:14–15", text: "We have enjoined on man kindness to his parents... and even if they strive to make you associate with Me that of which you have no knowledge, do not obey them, but companion them in this life with kindness." },
          { source: "Ṣaḥīḥ al-Bukhārī 5971", text: "A man asked: 'O Messenger of Allah, who is most deserving of my good company?' He said: 'Your mother.' He asked again. He said: 'Your mother.' Again. 'Your mother.' Then: 'Your father.'" },
          { source: "Nahj al-Balāgha", text: "Imam ʿAlī (ʿa): 'There is no good in remembrance of Allah if it is accompanied by displeasure of one's parents.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Mother's Specific Three-Fold Right",
        audience: "parents",
        content: "Multiple hadith emphasize the mother's right is greater than the father's — three times greater, by the Prophet's ﷺ explicit ruling. This is because of pregnancy, childbirth, and breastfeeding. Caring for an elderly mother is among the highest acts in Islam.",
        citations: [
          { source: "Qur'an 46:15", text: "His mother carried him with hardship and gave birth to him with hardship... and his weaning is in two years — be grateful to Me and to your parents." },
          { source: "Ṣaḥīḥ al-Bukhārī 5971", text: "The Prophet ﷺ named the mother three times before the father when asked who deserves the best company." },
          { source: "al-Kāfī vol. 2", text: "Imam al-Ṣādiq (ʿa): 'Paradise lies at the feet of mothers.'" },
        ],
        shiaSunniNote: null,
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 3. EDUCATION & KNOWLEDGE
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: "education",
    name: "Education & Knowledge Rights",
    arabicName: "حق التعليم والعلم",
    audience: "both",
    icon: "bookOpen",
    description: "The universal right and obligation to seek knowledge — applying equally to men and women, from cradle to grave.",
    sections: [
      {
        title: "Knowledge is Obligatory on Every Muslim — Male and Female",
        audience: "both",
        content: "The Prophet ﷺ made seeking knowledge a personal obligation (farḍ ʿayn) on every Muslim — explicitly including women. The wives of the Prophet ﷺ, especially ʿĀʾisha (ra), became major scholars whose rulings were sought by the senior companions. Women were taught alongside men in the masjid of the Prophet ﷺ.",
        citations: [
          { source: "Sunan Ibn Mājah 224", text: "The Prophet ﷺ: 'Seeking knowledge is an obligation upon every Muslim' — male and female (some narrations explicitly add 'wa muslimah')." },
          { source: "Ṣaḥīḥ al-Bukhārī 102", text: "Women asked the Prophet ﷺ for a day dedicated to teaching them — and he granted it. He taught them himself." },
          { source: "al-Kāfī vol. 1", text: "Imam al-Ṣādiq (ʿa): 'Seek knowledge even if it leads you to China; for seeking knowledge is the duty of every believer.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Right to Religious Learning",
        audience: "both",
        content: "Every Muslim has the right and obligation to learn the essentials of their religion: the meaning of the shahādah, the conditions of prayer, fasting, zakāt, and the foundations of belief. Parents and guardians are responsible for providing this; communities are responsible for institutions where it is taught.",
        citations: [
          { source: "Qur'an 39:9", text: "Are those who know equal to those who do not know? Only those who are people of understanding will remember." },
          { source: "Sunan al-Tirmidhī 2682", text: "The Prophet ﷺ: 'The scholars are the inheritors of the prophets.'" },
          { source: "al-Kāfī vol. 1", text: "Imam al-Bāqir (ʿa): 'If I had a young man among the Shia who did not seek understanding of religion, I would strike him.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Right to Worldly Knowledge and Trade",
        audience: "both",
        content: "Islamic teaching does not separate sacred from secular knowledge. Medicine, agriculture, craft, science, language, and trade are all encouraged. The Prophet ﷺ himself worked as a trader. Both sons and daughters should be taught a skill that enables them to support themselves and contribute to society.",
        citations: [
          { source: "Qur'an 67:15", text: "It is He who made the earth tame for you, so walk among its slopes and eat of His provision." },
          { source: "Ṣaḥīḥ al-Bukhārī 2072", text: "The Prophet ﷺ: 'No one has ever eaten any food better than what he has earned by the work of his hands.'" },
          { source: "al-Kāfī vol. 5", text: "Imam ʿAlī (ʿa): 'Teach your sons swimming and archery; teach your daughters the suras of the Qurʾan and spinning.' — interpreted as practical skill in both directions, contextually adapted." },
        ],
        shiaSunniNote: null,
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 4. FINANCIAL & INHERITANCE RIGHTS
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: "financial",
    name: "Financial & Inheritance Rights",
    arabicName: "الحقوق المالية والميراث",
    audience: "both",
    icon: "scales",
    description: "The right to own property independently, earn, inherit, and dispose of wealth — granted to men and women alike, with specific protections for women's financial independence.",
    sections: [
      {
        title: "Women's Independent Property Rights",
        audience: "women",
        content: "A woman's property is hers, fully and independently. She does not lose ownership at marriage, nor are her earnings or inheritance her husband's. She may sell, lend, gift, invest, or trade without his permission. She has no obligation to spend on the household; that obligation is the husband's even if he earns less than she does.",
        citations: [
          { source: "Qur'an 4:32", text: "For men is a share of what they have earned, and for women is a share of what they have earned." },
          { source: "Ṣaḥīḥ al-Bukhārī 1462", text: "Zaynab the wife of Ibn Masʿūd asked the Prophet ﷺ if she could give zakāt to her husband and the orphans in her care. He confirmed the wife's giving from her own wealth to her family counts." },
          { source: "al-Kāfī vol. 5", text: "Imam al-Ṣādiq (ʿa): 'A woman's wealth is her own; her husband has no claim over it without her permission.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "The Right to Inheritance — Both Genders",
        audience: "both",
        content: "Both men and women have explicit inheritance rights, fixed in the Qur'an. Daughters, mothers, wives, and sisters all receive defined shares — a revolutionary legal innovation in 7th-century Arabia. The amounts often differ between male and female heirs of the same degree (often 2:1 for sons and daughters), tied to the male obligation to provide; but both have absolute right to their share, which cannot be revoked or waived by family pressure.",
        citations: [
          { source: "Qur'an 4:7", text: "For men is a share of what the parents and close relatives leave, and for women is a share of what the parents and close relatives leave — be it little or much, an obligatory share." },
          { source: "Qur'an 4:11–12", text: "Allah instructs you concerning your children: for the male, what is equal to the share of two females... and for the wives is a fourth of what you leave..." },
          { source: "Ṣaḥīḥ al-Bukhārī 6732", text: "The verse of inheritance was revealed when a widow complained that her daughters were being denied inheritance by their uncle." },
          { source: "al-Kāfī vol. 7", text: "Imam al-Ṣādiq (ʿa) detailed the Qur'anic inheritance shares and emphasized that no heir, male or female, may be denied their share." },
        ],
        shiaSunniNote: "Shia inheritance law differs from Sunni law in some details — particularly when heirs include a daughter and uncles (Shia: the daughter inherits the entirety; Sunni: she gets her share and the rest goes to male agnates). Consult a scholar for specifics.",
      },
      {
        title: "Husband's Obligation to Provide",
        audience: "men",
        content: "The Qur'an makes maintenance — food, clothing, shelter, medical care — the husband's obligation, even if his wife is wealthier than he is. This obligation continues during marriage and, in many cases, after divorce during the waiting period (ʿiddah). It is a debt, not charity; she may claim it from his estate if he dies owing it.",
        citations: [
          { source: "Qur'an 4:34", text: "Men are the protectors and maintainers of women, because Allah has given the one more than the other, and because they support them from their means." },
          { source: "Qur'an 65:6–7", text: "Lodge them where you dwell out of your means; do not harm them in order to oppress them... let a man of wealth spend from his wealth." },
          { source: "Ṣaḥīḥ Muslim 1218", text: "The Prophet ﷺ in the Farewell Sermon: 'You owe them provision and clothing in kindness.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Right to Earn and Trade",
        audience: "both",
        content: "Both men and women have the right to earn an honest income and to participate in trade. Khadijah (ra), the Prophet's ﷺ first wife, was a leading merchant of Mecca. The Prophet ﷺ himself worked for her before their marriage. Women's economic participation is a sunnah, not an exception to it.",
        citations: [
          { source: "Qur'an 2:275", text: "Allah has permitted trade and forbidden usury." },
          { source: "Ṣaḥīḥ al-Bukhārī 5184", text: "The Prophet ﷺ approved of women working in agriculture and commerce; his own wives engaged in skilled work." },
          { source: "al-Kāfī vol. 5", text: "Imam al-Ṣādiq (ʿa): 'There is no shame in honest earning; lawful work is among the most noble of deeds.'" },
        ],
        shiaSunniNote: null,
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 5. DIGNITY & PROTECTION
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: "dignity",
    name: "Dignity & Protection Rights",
    arabicName: "حق الكرامة والحماية",
    audience: "both",
    icon: "shield",
    description: "The right to be protected from harm, slander, false accusation, and oppression — extended without distinction of gender or status.",
    sections: [
      {
        title: "Protection from Physical Harm",
        audience: "both",
        content: "Islam forbids harming any human being without lawful cause. Domestic violence is forbidden; the Prophet ﷺ never struck any of his wives or servants, and explicitly condemned men who beat their wives, asking how a man could expect mercy from Allah while striking his own family.",
        citations: [
          { source: "Qur'an 4:29", text: "Do not kill yourselves [or one another]. Indeed Allah is to you ever merciful." },
          { source: "Sunan Ibn Mājah 1986", text: "The Prophet ﷺ: 'The best of you is the best of you to his family — and I am the best of you to my family.'" },
          { source: "Sunan Abī Dāwūd 2146", text: "The Prophet ﷺ: 'Do not strike the maidservants of Allah' — when asked about men who hit their wives, he forbade it." },
          { source: "al-Kāfī vol. 5", text: "Imam al-Ṣādiq (ʿa): 'A man who strikes his wife's face has wronged her, and Allah's mercy is far from him.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Protection from Slander and False Accusation",
        audience: "both",
        content: "Falsely accusing a chaste woman of unchastity (qadhf) is among the gravest sins in Islam, punishable by 80 lashes and the permanent loss of the accuser's testimony being accepted. The accusation requires four witnesses of impossibly explicit detail — making such accusations almost legally impossible, which is precisely the point: to protect women's reputations.",
        citations: [
          { source: "Qur'an 24:4", text: "Those who accuse chaste women and do not produce four witnesses — lash them with eighty lashes and never accept their testimony after that. Those are the defiantly disobedient." },
          { source: "Qur'an 24:11–17", text: "The verses revealed regarding the slander of ʿĀʾisha (ra), making the spreading of unverified accusations a major sin." },
          { source: "Ṣaḥīḥ al-Bukhārī 2766", text: "The Prophet ﷺ listed false accusation of chaste women among the seven destructive sins." },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Protection of Privacy and Reputation",
        audience: "both",
        content: "Backbiting (ghībah), spying on others' private affairs, and exposing what people would not want known are all forbidden. The Qur'an likens backbiting to eating the flesh of one's dead brother. This protection applies to men and women, family members and strangers.",
        citations: [
          { source: "Qur'an 49:12", text: "Do not spy or backbite each other. Would one of you like to eat the flesh of his dead brother? You would detest it. So fear Allah; indeed Allah is Accepting of repentance and Merciful." },
          { source: "Ṣaḥīḥ Muslim 2589", text: "The Prophet ﷺ defined backbiting as 'mentioning your brother in a manner he would dislike' — even if true." },
          { source: "al-Kāfī vol. 2", text: "Imam al-Ṣādiq (ʿa): 'Backbiting is what destroys a believer's deeds faster than fire consuming wood.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "The Right of Justice — Equal Before the Law",
        audience: "both",
        content: "Islamic law treats men and women equally before the courts in most contexts. Both can witness, testify, sue, and be sued. Both are held to the same moral and criminal standards in most matters. The Prophet ﷺ said even his own daughter would have her hand cut for theft — there is no class above the law.",
        citations: [
          { source: "Qur'an 5:8", text: "O you who believe! Stand up firmly for Allah as witnesses to justice, and let not the hatred of a people make you swerve to wrong and depart from justice." },
          { source: "Ṣaḥīḥ al-Bukhārī 6788", text: "The Prophet ﷺ: 'By Allah, even if Fāṭimah the daughter of Muḥammad were to steal, I would cut off her hand.'" },
          { source: "Nahj al-Balāgha Letter 53", text: "Imam ʿAlī (ʿa) to Mālik al-Ashtar: 'Behave kindly with people, for they are of two kinds — either your brother in faith, or your equal in creation.'" },
        ],
        shiaSunniNote: null,
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 6. WORSHIP & RELIGIOUS RIGHTS
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: "worship",
    name: "Worship & Religious Rights",
    arabicName: "حقوق العبادة",
    audience: "both",
    icon: "mihrab",
    description: "The right to worship Allah freely — to pray, fast, attend the masjid, and seek nearness to Allah without obstruction.",
    sections: [
      {
        title: "Women's Right to Attend the Masjid",
        audience: "women",
        content: "The Prophet ﷺ explicitly forbade men from preventing women from attending the masjid. Women prayed in his masjid behind the rows of men, and he commanded that they not be denied entry. Restrictions on women attending masjid that some cultures impose are not from the Prophet's ﷺ practice.",
        citations: [
          { source: "Ṣaḥīḥ al-Bukhārī 873", text: "The Prophet ﷺ: 'Do not prevent the female servants of Allah from the masjids of Allah.'" },
          { source: "Ṣaḥīḥ Muslim 442", text: "The Prophet ﷺ: 'If your wives ask permission to go to the masjid at night, do not prevent them.'" },
          { source: "al-Kāfī vol. 3", text: "Imam ʿAlī (ʿa) confirmed women's right to attend congregational prayer." },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Equal Obligations and Rewards",
        audience: "both",
        content: "Men and women are equally obligated to pray, fast, give zakāt, and perform Ḥajj. Their rewards for righteous deeds are equal — explicitly stated in the Qur'an. Where obligations differ (e.g., women excused from prayer during menstruation), this is concession, not deprivation; women are also exempted from a tribe of obligations men carry (e.g., financially supporting a household).",
        citations: [
          { source: "Qur'an 33:35", text: "The Muslim men and Muslim women, the believing men and believing women, the obedient men and obedient women... Allah has prepared for them forgiveness and a great reward." },
          { source: "Qur'an 16:97", text: "Whoever does righteousness — male or female — and is a believer, We will surely grant him a good life and We will surely give them their reward according to the best of what they used to do." },
          { source: "Ṣaḥīḥ al-Bukhārī 8", text: "The five pillars apply equally to all Muslims with capacity." },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Right to Religious Counsel and Scholarship",
        audience: "both",
        content: "Women have the right to seek religious guidance directly, to ask scholars, and to issue rulings if they have the knowledge. ʿĀʾisha (ra) was one of the major fuqahāʾ of the early period; her rulings shaped Islamic law. Imam al-Bāqir (ʿa) and Imam al-Ṣādiq (ʿa) had female students who became transmitters of hadith.",
        citations: [
          { source: "Ṣaḥīḥ al-Bukhārī 100", text: "ʿĀʾisha (ra) is reported to have answered the religious questions of senior companions for decades after the Prophet's ﷺ death." },
          { source: "Sunan Ibn Mājah 224", text: "'Seeking knowledge is an obligation' — no gender exception." },
          { source: "al-Kāfī vol. 1", text: "The Imams (ʿa) had female students whose hadith narrations are preserved in the major collections." },
        ],
        shiaSunniNote: null,
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 7. WORKERS, NEIGHBOURS & COMMUNITY
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: "community",
    name: "Workers, Neighbours & Community Rights",
    arabicName: "حقوق العمال والجيران والمجتمع",
    audience: "all",
    icon: "users",
    description: "Rights of those who work for us, live beside us, and share our community — Muslims and non-Muslims alike.",
    sections: [
      {
        title: "Workers' Rights — Pay Promptly and Fairly",
        audience: "all",
        content: "The Prophet ﷺ commanded paying workers their wages before their sweat dries — meaning immediately, without delay or excuse. Withholding wages is condemned as one of the major injustices. The wage must also be agreed upon in advance, and the work must be within the worker's reasonable capacity.",
        citations: [
          { source: "Sunan Ibn Mājah 2443", text: "The Prophet ﷺ: 'Give the worker his wage before his sweat dries.'" },
          { source: "Ṣaḥīḥ al-Bukhārī 2270 (Qudsī hadith)", text: "Allah says: 'Three I will be against on the Day of Judgement: ... and one who hires a worker, takes full work from him, and does not give him his wage.'" },
          { source: "al-Kāfī vol. 5", text: "Imam al-Ṣādiq (ʿa): 'Pay the worker before his sweat dries, and let him know his wage before he begins the work.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Neighbours' Rights — Muslim and Non-Muslim",
        audience: "all",
        content: "The Prophet ﷺ said the angel Jibrīl spoke to him so often about neighbours that he thought neighbours might inherit. Neighbours of any faith have the right to be safe from one's harm, to be helped in difficulty, to be greeted, to be fed during their need, and to share in one's joys. The closer the home, the greater the right.",
        citations: [
          { source: "Ṣaḥīḥ al-Bukhārī 6014", text: "The Prophet ﷺ: 'Jibrīl kept advising me about the neighbour until I thought he would make him an heir.'" },
          { source: "Ṣaḥīḥ Muslim 46", text: "The Prophet ﷺ: 'Whoever believes in Allah and the Last Day, let him be good to his neighbour.'" },
          { source: "al-Kāfī vol. 2", text: "Imam al-Ṣādiq (ʿa): 'The neighbour to forty houses on each side is your neighbour and has rights upon you.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Guests' Rights",
        audience: "all",
        content: "Hospitality to guests is part of faith. The Prophet ﷺ said the right of the guest is three days; beyond that, what is offered is voluntary charity. The host must provide what they reasonably can without burden, and the guest must not impose. Both have responsibilities.",
        citations: [
          { source: "Ṣaḥīḥ al-Bukhārī 6135", text: "The Prophet ﷺ: 'Whoever believes in Allah and the Last Day, let him honour his guest.'" },
          { source: "Ṣaḥīḥ al-Bukhārī 6019", text: "The Prophet ﷺ specified the guest's right as three days." },
          { source: "al-Kāfī vol. 6", text: "Imam al-Ṣādiq (ʿa): 'Whoever honours his guest, has honoured Allah.'" },
        ],
        shiaSunniNote: null,
      },
      {
        title: "Rights of Non-Muslims (Ahl al-Dhimmah)",
        audience: "all",
        content: "Non-Muslims living within a Muslim community have explicit protections: their lives, property, religion, and houses of worship are inviolable. The Prophet ﷺ said whoever harms a non-Muslim under Muslim protection will find their accuser to be the Prophet ﷺ himself on the Day of Judgement.",
        citations: [
          { source: "Qur'an 60:8", text: "Allah does not forbid you from being righteous and just to those who have not fought you because of religion and have not driven you out of your homes." },
          { source: "Sunan Abī Dāwūd 3052", text: "The Prophet ﷺ: 'Whoever wrongs one who has a covenant of protection, or burdens him beyond his capacity, or takes from him without his consent — I will be his adversary on the Day of Judgement.'" },
          { source: "Nahj al-Balāgha, Letter 53", text: "Imam ʿAlī (ʿa) to Mālik al-Ashtar: 'They are of two kinds — your brother in faith, or your equal in creation. Treat them all with mercy.'" },
        ],
        shiaSunniNote: null,
      },
    ],
  },
];

export function rightById(id) {
  return RIGHTS_TOPICS.find(t => t.id === id) || null;
}
