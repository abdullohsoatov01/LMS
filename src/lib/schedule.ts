import type { AttendanceRow, ClassRow } from "./db";
import { addDays, todayString } from "./gamification";

export const WEEKDAYS = [
  { n: 1, short: "Du", full: "Dushanba" },
  { n: 2, short: "Se", full: "Seshanba" },
  { n: 3, short: "Ch", full: "Chorshanba" },
  { n: 4, short: "Pa", full: "Payshanba" },
  { n: 5, short: "Ju", full: "Juma" },
  { n: 6, short: "Sh", full: "Shanba" },
  { n: 7, short: "Ya", full: "Yakshanba" },
];

export const ODD_DAYS = [1, 3, 5];
export const EVEN_DAYS = [2, 4, 6];

const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

const same = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i]);

/** [1,3,5] → "Toq kunlar (Du, Ch, Ju)" */
export function formatDays(days: number[] | null) {
  const sorted = [...(days ?? [])].sort();
  if (sorted.length === 0) return null;
  const shorts = sorted.map((d) => WEEKDAYS[d - 1].short).join(", ");
  if (same(sorted, ODD_DAYS)) return `Toq kunlar (${shorts})`;
  if (same(sorted, EVEN_DAYS)) return `Juft kunlar (${shorts})`;
  if (sorted.length === 7) return "Har kuni";
  return shorts;
}

/** "2026-11-20" → 5 (Friday) */
export function isoWeekday(date: string) {
  const d = new Date(`${date}T00:00:00Z`).getUTCDay();
  return d === 0 ? 7 : d;
}

/** "2026-11-20" → "20-Noyabr, Juma" */
export function formatLongDate(date: string) {
  const [, m, d] = date.split("-").map(Number);
  return `${d}-${MONTHS[m - 1]}, ${WEEKDAYS[isoWeekday(date) - 1].full}`;
}

/** "2026-11-20" → "20.11" */
export function formatShortDate(date: string) {
  const [, m, d] = date.split("-");
  return `${d}.${m}`;
}

export function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function timeRange(group: Pick<ClassRow, "start_time" | "duration_min">) {
  if (!group.start_time) return null;
  const end = toMinutes(group.start_time) + (group.duration_min ?? 90);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${group.start_time}–${pad(Math.floor(end / 60) % 24)}:${pad(end % 60)}`;
}

function nowMinutes() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: process.env.APP_TIMEZONE || "Asia/Tashkent",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get("hour") * 60 + get("minute");
}

export type SessionState = "upcoming" | "live" | "finished";

/** Where today's lesson of the group stands right now. */
export function todayState(group: Pick<ClassRow, "start_time" | "duration_min">): SessionState {
  if (!group.start_time) return "upcoming";
  const start = toMinutes(group.start_time);
  const now = nowMinutes();
  if (now < start) return "upcoming";
  return now <= start + (group.duration_min ?? 90) ? "live" : "finished";
}

/** The next lesson that hasn't finished yet, within a week. */
export function nextSession(group: ClassRow) {
  const days = group.days ?? [];
  if (days.length === 0) return null;
  const today = todayString();
  for (let offset = 0; offset <= 7; offset++) {
    const date = addDays(today, offset);
    if (!days.includes(isoWeekday(date))) continue;
    if (offset === 0 && todayState(group) === "finished") continue;
    const label = offset === 0 ? "Bugun" : offset === 1 ? "Ertaga" : WEEKDAYS[isoWeekday(date) - 1].full;
    return { date, label, live: offset === 0 && todayState(group) === "live" };
  }
  return null;
}

export function meetsOn(group: Pick<ClassRow, "days">, date: string) {
  return (group.days ?? []).includes(isoWeekday(date));
}

/** Share of marked lessons the student attended (late counts as attended). */
export function attendanceRate(rows: Pick<AttendanceRow, "status">[]) {
  if (rows.length === 0) return null;
  const attended = rows.filter((r) => r.status !== "absent").length;
  return { attended, total: rows.length, percent: Math.round((attended / rows.length) * 100) };
}
