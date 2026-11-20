import Link from "next/link";
import { Award, BookOpen, Zap } from "lucide-react";
import type { Course } from "@/content/types";
import { maxScore } from "@/content";
import type { User } from "@/lib/db";
import { getLevel, lessonXp } from "@/lib/gamification";

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-zinc-100 ${className}`}>
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, value * 100)}%` }} />
    </div>
  );
}

export function XpBar({ xp }: { xp: number }) {
  const level = getLevel(xp);
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-semibold text-zinc-900">
          {level.level}-daraja <span className="font-normal text-zinc-500">· {level.name}</span>
        </span>
        <span className="text-zinc-500">
          {level.current} / {level.needed} XP
        </span>
      </div>
      <ProgressBar value={level.progress} />
    </div>
  );
}

export function CourseCard({ course, done }: { course: Course; done: number }) {
  const total = course.lessons.length;
  const totalXp = course.lessons.reduce((n, l) => n + lessonXp(maxScore(l)), 0);
  const status =
    done === total ? (
      <span className="badge badge-green">Tugatildi</span>
    ) : done > 0 ? (
      <span className="badge badge-blue">Jarayonda</span>
    ) : (
      <span className="badge badge-gray">Boshlanmagan</span>
    );

  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-zinc-900">{course.title}</h3>
        {status}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xl">
          {course.emoji}
        </span>
        <p className="text-sm text-zinc-500">{course.description}</p>
      </div>
      <div className="my-4 border-t border-zinc-200" />
      <ul className="space-y-2 text-[15px] text-zinc-700">
        <li className="flex items-center gap-2.5">
          <BookOpen size={16} className="text-zinc-400" />
          {done} / {total} dars
        </li>
        <li className="flex items-center gap-2.5">
          <Zap size={16} className="text-zinc-400" />
          {totalXp} XP gacha
        </li>
        <li className="flex items-center gap-2.5">
          <Award size={16} className="text-zinc-400" />
          Nishon: {course.badge.emoji} {course.badge.name}
        </li>
      </ul>
      <ProgressBar value={done / total} className="mt-4" />
      <Link href={`/courses/${course.id}`} className="btn btn-primary mt-4 w-full">
        {done === 0 ? "Boshlash" : done === total ? "Ko'rish" : "Davom etish"}
      </Link>
    </div>
  );
}

const MEDALS = ["🥇", "🥈", "🥉"];

export function LeaderboardList({ users, currentUserId }: { users: User[]; currentUserId: string }) {
  if (users.length === 0) {
    return <p className="py-6 text-center text-sm text-zinc-500">Hali hech kim yo'q</p>;
  }
  return (
    <ol className="divide-y divide-zinc-200">
      {users.map((u, i) => {
        const me = u.id === currentUserId;
        return (
          <li key={u.id} className={`flex items-center gap-3 px-4 py-3 ${me ? "bg-primary-soft" : ""}`}>
            <span className="w-7 text-center text-sm font-semibold text-zinc-400">{MEDALS[i] ?? i + 1}</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-lg">
              {u.avatar}
            </span>
            <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-zinc-900">
              {u.full_name}
              {me && <span className="ml-1.5 text-primary-text">(sen)</span>}
            </span>
            <span className="hidden text-sm text-zinc-500 sm:inline">{getLevel(u.xp).level}-daraja</span>
            <span className="flex items-center gap-1 text-sm font-semibold text-zinc-900">
              <Zap size={14} className="text-amber-500" />
              {u.xp}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
