import Link from "next/link";
import type { Course } from "@/content/types";
import type { User } from "@/lib/db";
import { getLevel } from "@/lib/gamification";

export function XpBar({ xp, light = false }: { xp: number; light?: boolean }) {
  const level = getLevel(xp);
  return (
    <div>
      <div className={`mb-1.5 flex justify-between text-sm font-extrabold ${light ? "text-white/90" : "text-slate-500"}`}>
        <span>
          {level.level}-daraja · {level.name}
        </span>
        <span>
          {level.current} / {level.needed} XP
        </span>
      </div>
      <div className={`h-4 overflow-hidden rounded-full ${light ? "bg-white/25" : "bg-slate-100"}`}>
        <div
          className={`h-full rounded-full ${light ? "bg-amber-300" : "bg-gradient-to-r from-amber-400 to-orange-400"}`}
          style={{ width: `${Math.max(3, level.progress * 100)}%` }}
        />
      </div>
    </div>
  );
}

export function CourseCard({ course, done }: { course: Course; done: number }) {
  const total = course.lessons.length;
  const finished = done === total;
  return (
    <Link
      href={`/courses/${course.id}`}
      className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className={`bg-gradient-to-br ${course.gradient} relative px-6 py-6 text-white`}>
        <div className="text-5xl transition group-hover:scale-110">{course.emoji}</div>
        <h3 className="mt-3 text-2xl font-black">{course.title}</h3>
        {finished && (
          <span className="absolute right-4 top-4 rounded-full bg-white/25 px-3 py-1 text-sm font-black">
            ✓ Tugatildi
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="mb-4 font-semibold text-slate-500">{course.description}</p>
        <div className="mb-1.5 flex justify-between text-sm font-extrabold text-slate-400">
          <span>
            {done} / {total} dars
          </span>
          <span>{Math.round((done / total) * 100)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${course.gradient}`}
            style={{ width: `${(done / total) * 100}%` }}
          />
        </div>
      </div>
    </Link>
  );
}

const MEDALS = ["🥇", "🥈", "🥉"];

export function LeaderboardList({ users, currentUserId }: { users: User[]; currentUserId: string }) {
  if (users.length === 0) {
    return <p className="py-6 text-center font-semibold text-slate-400">Hali hech kim yo'q</p>;
  }
  return (
    <ol className="space-y-2">
      {users.map((u, i) => {
        const me = u.id === currentUserId;
        return (
          <li
            key={u.id}
            className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${
              me ? "bg-violet-50 ring-2 ring-violet-200" : "bg-slate-50"
            }`}
          >
            <span className="w-8 text-center text-lg font-black text-slate-400">{MEDALS[i] ?? i + 1}</span>
            <span className="text-2xl">{u.avatar}</span>
            <span className="min-w-0 flex-1 truncate font-extrabold text-slate-700">
              {u.full_name}
              {me && <span className="ml-1 text-violet-500">(sen)</span>}
            </span>
            <span className="text-xs font-bold text-slate-400">{getLevel(u.xp).level}-dar.</span>
            <span className="font-black text-amber-500">⚡ {u.xp}</span>
          </li>
        );
      })}
    </ol>
  );
}
