import { Award, BookOpen, CalendarCheck, Flame, Gem, Mountain, TrendingUp, Zap } from "lucide-react";
import { COURSES } from "@/content";
import { requireUser } from "@/lib/auth";
import { BADGES, getLevel, liveStreak } from "@/lib/gamification";
import { getAttendance, getBadgeIds, getProgress } from "@/lib/queries";
import { attendanceRate } from "@/lib/schedule";
import { PageHeader, StatTile } from "@/components/AppShell";
import { AvatarPicker } from "@/components/AvatarPicker";
import { XpBar } from "@/components/Widgets";

export default async function ProfilePage() {
  const user = await requireUser();
  const [progress, badgeRows, attendance] = await Promise.all([getProgress(user.id), getBadgeIds(user.id), getAttendance(user.id)]);
  const rate = attendanceRate(attendance);
  const owned = new Set(badgeRows.map((b) => b.badge_id));
  const totalLessons = COURSES.reduce((n, c) => n + c.lessons.length, 0);
  const perfect = progress.filter((p) => p.score === p.max_score).length;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Profil" subtitle="Natijalaring, nishonlaring va avataring" />

      <section className="card p-5">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-soft text-4xl">
            {user.avatar}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-zinc-900">{user.full_name}</h2>
            <p className="text-sm text-zinc-500">Login: {user.username}</p>
          </div>
        </div>
        <div className="mt-5">
          <XpBar xp={user.xp} />
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatTile icon={<Zap size={18} />} label="Tajriba" value={`${user.xp} XP`} />
        <StatTile icon={<TrendingUp size={18} />} label="Daraja" value={getLevel(user.xp).level} />
        <StatTile icon={<BookOpen size={18} />} label="Darslar" value={`${progress.length} / ${totalLessons}`} />
        <StatTile icon={<Gem size={18} />} label="Xatosiz darslar" value={perfect} />
        <StatTile icon={<Flame size={18} />} label="Seriya" value={`${liveStreak(user)} kun`} />
        <StatTile icon={<Mountain size={18} />} label="Eng uzun seriya" value={`${user.best_streak} kun`} />
        <StatTile
          icon={<CalendarCheck size={18} />}
          label="Davomat"
          value={rate ? `${rate.percent}% (${rate.attended}/${rate.total})` : "—"}
        />
      </div>

      <section className="card mt-4 p-5">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Avatar tanla</h2>
        <AvatarPicker current={user.avatar} />
      </section>

      <section className="card mt-4 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Award size={18} className="text-zinc-400" />
          <h2 className="text-lg font-semibold text-zinc-900">Nishonlar</h2>
          <span className="badge badge-gray">
            {owned.size} / {BADGES.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {BADGES.map((b) => {
            const has = owned.has(b.id);
            return (
              <div
                key={b.id}
                className={`rounded-xl border p-4 text-center ${
                  has ? "border-amber-200 bg-amber-50" : "border-dashed border-zinc-200 bg-zinc-50"
                }`}
              >
                <div className={`text-3xl ${has ? "" : "opacity-30 grayscale"}`}>{has ? b.emoji : "🔒"}</div>
                <div className={`mt-1 text-sm font-semibold ${has ? "text-zinc-900" : "text-zinc-400"}`}>{b.name}</div>
                <div className="text-xs text-zinc-500">{b.description}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
