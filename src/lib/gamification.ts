import { COURSES } from "@/content";

export const XP_PER_CORRECT = 10;
export const XP_LESSON_BONUS = 20;

/** XP for showing up to a live lesson in class. */
export const ATTENDANCE_XP = { present: 15, late: 5, absent: 0 } as const;

export function lessonXp(score: number) {
  return score * XP_PER_CORRECT + XP_LESSON_BONUS;
}

const LEVEL_NAMES = [
  "Yangi boshlovchi",
  "Qiziquvchan",
  "Izlanuvchi",
  "Tadqiqotchi",
  "Kashfiyotchi",
  "Muhandis",
  "Prompt ustasi",
  "AI mutaxassisi",
  "Kiber-daho",
  "Afsona",
];

/** XP needed to reach level n: 0, 50, 150, 300, 500, 750, ... */
function levelThreshold(n: number) {
  return 25 * n * (n - 1);
}

export function getLevel(xp: number) {
  let level = 1;
  while (xp >= levelThreshold(level + 1)) level++;
  const start = levelThreshold(level);
  const end = levelThreshold(level + 1);
  return {
    level,
    name: LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)],
    current: xp - start,
    needed: end - start,
    progress: (xp - start) / (end - start),
  };
}

export type Badge = { id: string; name: string; emoji: string; description: string };

export const BADGES: Badge[] = [
  { id: "first-lesson", name: "Birinchi qadam", emoji: "🎯", description: "Birinchi darsni tugatding" },
  { id: "five-lessons", name: "Bilim ovchisi", emoji: "📚", description: "5 ta darsni tugatding" },
  { id: "ten-lessons", name: "Tinimsiz", emoji: "🏅", description: "10 ta darsni tugatding" },
  { id: "perfect", name: "Benuqson", emoji: "💎", description: "Darsni bitta ham xatosiz o'tding" },
  { id: "coder", name: "Python sehrgari", emoji: "🐍", description: "Birinchi kod topshirig'ini bajarding" },
  { id: "streak-3", name: "Olovli boshlanish", emoji: "🔥", description: "3 kun ketma-ket o'qiding" },
  { id: "streak-7", name: "Haftalik qahramon", emoji: "⚡", description: "7 kun ketma-ket o'qiding" },
  { id: "level-5", name: "Raketa", emoji: "🚀", description: "5-darajaga yetding" },
  ...COURSES.map((c) => ({
    id: `course-${c.id}`,
    name: c.badge.name,
    emoji: c.badge.emoji,
    description: `«${c.title}» kursini to'liq tugatding`,
  })),
];

export function getBadge(id: string) {
  return BADGES.find((b) => b.id === id);
}

export function todayString() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: process.env.APP_TIMEZONE || "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** The stored streak is only alive if the student studied today or yesterday. */
export function liveStreak(user: { streak: number; last_active: string | null }) {
  if (!user.last_active) return 0;
  const today = todayString();
  return user.last_active === today || user.last_active === addDays(today, -1) ? user.streak : 0;
}
