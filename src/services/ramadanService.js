// src/services/ramadanService.js
// Ramadan detection, day counter, and notification scheduling

import { LocalNotifications } from "@capacitor/local-notifications";

function getHijri() {
  const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    day: "numeric", month: "numeric", year: "numeric",
  });
  const parts = fmt.formatToParts(new Date());
  const get = (t) => Number(parts.find(p => p.type === t)?.value || 0);
  return { day: get("day"), month: get("month"), year: get("year") };
}

export function isRamadan() {
  return getHijri().month === 9;
}

export function getRamadanDay() {
  const h = getHijri();
  return h.month === 9 ? h.day : 0;
}

export function isLast10() {
  const d = getRamadanDay();
  return d >= 21 && d <= 30;
}

export function getCountdown(targetDate) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { hours, minutes, seconds, expired: false };
}

export function nextIftarTime(maghribStr) {
  if (!maghribStr) return null;
  const [hh, mm] = maghribStr.split(":").map(Number);
  const today = new Date();
  today.setHours(hh, mm, 0, 0);
  if (today < new Date()) today.setDate(today.getDate() + 1);
  return today;
}

export function nextSuhoorTime(fajrStr) {
  if (!fajrStr) return null;
  const [hh, mm] = fajrStr.split(":").map(Number);
  const target = new Date();
  target.setHours(hh, mm, 0, 0);
  target.setMinutes(target.getMinutes() - 30);
  if (target < new Date()) target.setDate(target.getDate() + 1);
  return target;
}

export async function scheduleRamadanNotifications(prayerTimes) {
  if (!isRamadan() || !prayerTimes) return;
  try {
    const iftar = nextIftarTime(prayerTimes.maghrib);
    const suhoor = nextSuhoorTime(prayerTimes.fajr);
    const notifications = [];
    if (suhoor) {
      notifications.push({
        id: 9001,
        title: "Suhoor reminder",
        body: "30 minutes until Fajr. Don't forget your suhoor — there is barakah in it.",
        schedule: { at: suhoor },
      });
    }
    if (iftar) {
      notifications.push({
        id: 9002,
        title: "Time to break your fast",
        body: "Allahumma laka sumtu wa 'ala rizqika aftartu — O Allah, for You I fasted and with Your sustenance I break my fast.",
        schedule: { at: iftar },
      });
    }
    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
    }
  } catch (err) {
    console.error("[ramadan] notification scheduling failed:", err);
  }
}

export async function cancelRamadanNotifications() {
  try {
    await LocalNotifications.cancel({ notifications: [{ id: 9001 }, { id: 9002 }] });
  } catch {}
}
