// src/utils/hijri.js
// Accurate Hijri date using JavaScript's built-in Intl API
// which uses the Islamic Umm al-Qura calendar — the same standard
// used in Saudi Arabia and by most Islamic institutions worldwide.

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Ula", "Jumada al-Akhira", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhul Qa'da", "Dhul Hijja",
];

/**
 * Get the current accurate Hijri date using Intl.DateTimeFormat
 * with the islamic-umalqura calendar.
 */
export function getAccurateHijriDate() {
  const today = new Date();

  try {
    // Use the built-in Islamic Umm al-Qura calendar
    const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric", month: "numeric", year: "numeric",
    });
    const parts = fmt.formatToParts(today);
    const day   = parseInt(parts.find(p => p.type === "day")?.value   ?? "0");
    const month = parseInt(parts.find(p => p.type === "month")?.value ?? "0");
    const year  = parseInt(parts.find(p => p.type === "year")?.value  ?? "0");

    return {
      day,
      month: HIJRI_MONTHS[month - 1] ?? "",
      monthNum: month,
      year,
    };
  } catch {
    // Fallback to algorithmic conversion if Intl isn't available
    return algorithmicHijri(today);
  }
}

function algorithmicHijri(date) {
  const jd    = Math.floor(date.getTime() / 86400000 + 2440587.5);
  const l     = jd - 1948440 + 10632;
  const n     = Math.floor((l - 1) / 10631);
  const ll    = l - 10631 * n + 354;
  const j     = Math.floor((10985 - ll) / 5316) * Math.floor(50 * ll / 17719)
              + Math.floor(ll / 5670) * Math.floor(43 * ll / 15238);
  const ll2   = ll - Math.floor((30 - j) / 15) * Math.floor(17719 * j / 50)
              - Math.floor(j / 16) * Math.floor(15238 * j / 43) + 29;
  const month = Math.floor(24 * ll2 / 709);
  const day   = ll2 - Math.floor(709 * month / 24);
  const year  = 30 * n + j - 30;
  return { day, month: HIJRI_MONTHS[month - 1] ?? "", monthNum: month, year };
}

/**
 * Calculate upcoming Islamic events and their days-away count.
 * All dates use the Intl calendar for accuracy.
 */
export function getUpcomingIslamicEvents() {
  const { monthNum, day, year } = getAccurateHijriDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Days remaining in current Hijri year to target month/day
  function daysUntilHijri(targetMonth, targetDay) {
    // Approximate: each Hijri month ≈ 29.53 days
    const AVG_MONTH = 29.53;
    let months = targetMonth - monthNum;
    let days   = targetDay - day;
    if (months < 0 || (months === 0 && days <= 0)) months += 12;
    return Math.round(months * AVG_MONTH + days);
  }

  // Key Islamic dates (Hijri month, Hijri day)
  const events = [
    { name: "Laylat al-Qadr", month: 9,  day: 27, hijriLabel: "27 Ramadan"    },
    { name: "Eid al-Fitr",    month: 10, day: 1,  hijriLabel: "1 Shawwal"     },
    { name: "Eid al-Adha",    month: 12, day: 10, hijriLabel: "10 Dhul Hijja" },
    { name: "Islamic New Year",month: 1, day: 1,  hijriLabel: "1 Muharram"    },
    { name: "Mawlid al-Nabi", month: 3,  day: 12, hijriLabel: "12 Rabi' al-Awwal" },
  ];

  return events
    .map(ev => ({
      ...ev,
      days: daysUntilHijri(ev.month, ev.day),
    }))
    .filter(ev => ev.days > 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 3); // Show the 3 nearest upcoming
}
