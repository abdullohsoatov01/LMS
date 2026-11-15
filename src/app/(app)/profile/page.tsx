import { COURSES } from "@/content";
import { requireUser } from "@/lib/auth";
import { BADGES, getLevel, liveStreak } from "@/lib/gamification";
import { getBadgeIds, getProgress } from "@/lib/queries";
import { AvatarPicker } from "@/components/AvatarPicker";
import { XpBar } from "@/components/Widgets";

export default async function ProfilePage() {
  const user = await requireUser();
  const [progress, badgeRows] = await Promise.all([getProgress(user.id), getBadgeIds(user.id)]);
  const owned = new Set(badgeRows.map((b) => b.badge_id));
  const totalLessons = COURSES.reduce((n, c) => n + c.lessons.length, 0);
  const perfect = progress.filter((p) => p.score === p.max_score).length;

  const stats = [
    { icon: "⚡", value: user.xp, label: "XP" },
    { icon: "📈", value: getLevel(user.xp).level, label: "daraja" },
    { icon: "📚", value: `${progress.length}/${totalLessons}`, label: "dars" },
    { icon: "💎", value: perfect, label: "xatosiz dars" },
    { icon: "🔥", value: liveStreak(user), label: "seriya" },
    { icon: "🏔️", value: user.best_streak, label: "eng uzun seriya" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="card p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-violet-100 text-6xl">
            {user.avatar}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-3xl font-black text-slate-900">{user.full_name}</h1>
            <p className="font-semibold text-slate-400">@{user.username}</p>
          </div>
        </div>
        <div className="mt-6">
          <XpBar xp={user.xp} />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-slate-50 p-3 text-center">
              <div className="text-xl">{s.icon}</div>
              <div className="text-xl font-black text-slate-800">{s.value}</div>
              <div className="text-[11px] font-bold uppercase leading-tight tracking-wide text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6 sm:p-8">
        <h2 className="mb-4 text-xl font-black text-slate-900">🎨 Avatar tanla</h2>
        <AvatarPicker current={user.avatar} />
      </section>

      <section className="card p-6 sm:p-8">
        <h2 className="mb-1 text-xl font-black text-slate-900">🏅 Nishonlar</h2>
        <p className="mb-5 font-semibold text-slate-400">
          {owned.size} / {BADGES.length} ta yig'ildi
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {BADGES.map((b) => {
            const has = owned.has(b.id);
            return (
              <div
                key={b.id}
                className={`rounded-2xl border-2 p-4 text-center ${
                  has ? "border-amber-200 bg-amber-50" : "border-dashed border-slate-200 bg-slate-50"
                }`}
              >
                <div className={`text-4xl ${has ? "" : "opacity-30 grayscale"}`}>{has ? b.emoji : "🔒"}</div>
                <div className={`mt-1 font-black ${has ? "text-slate-800" : "text-slate-400"}`}>{b.name}</div>
                <div className="text-xs font-semibold text-slate-400">{b.description}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
