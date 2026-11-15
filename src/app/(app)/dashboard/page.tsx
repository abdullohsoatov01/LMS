import Link from "next/link";
import { COURSES } from "@/content";
import { requireUser } from "@/lib/auth";
import { getBadge, liveStreak } from "@/lib/gamification";
import { getBadgeIds, getClassmates, getProgress, lessonStates, progressMap } from "@/lib/queries";
import { CourseCard, LeaderboardList, XpBar } from "@/components/Widgets";

export default async function DashboardPage() {
  const user = await requireUser();
  const isTeacher = user.role === "teacher";
  const [progress, badgeRows, classmates] = await Promise.all([
    getProgress(user.id),
    getBadgeIds(user.id),
    user.class_id ? getClassmates(user.class_id) : Promise.resolve([]),
  ]);
  const map = progressMap(progress);
  const streak = liveStreak(user);
  const firstName = user.full_name.split(" ")[0];

  const next = COURSES.flatMap((course) =>
    lessonStates(course, map, false)
      .filter((s) => s.state === "current")
      .map((s) => ({ course, lesson: s.lesson })),
  )[0];

  const badges = badgeRows
    .sort((a, b) => b.earned_at.localeCompare(a.earned_at))
    .map((r) => getBadge(r.badge_id))
    .filter(Boolean);

  return (
    <div className="space-y-8">
      {isTeacher ? (
        <div className="card flex items-center gap-4 p-6">
          <span className="text-5xl">🎓</span>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Kurslarni ko'rib chiqish</h1>
            <p className="font-semibold text-slate-500">
              O'qituvchi sifatida barcha darslar ochiq. Darslarni o'tishingiz mumkin, lekin natija saqlanmaydi.
            </p>
          </div>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 p-6 text-white shadow-lg sm:p-8">
            <div className="flex items-center gap-4">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/20 text-5xl">
                {user.avatar}
              </span>
              <div>
                <h1 className="text-3xl font-black sm:text-4xl">Salom, {firstName}! 👋</h1>
                <p className="font-semibold text-white/80">
                  {streak > 0 ? "Zo'r ketyapsan — seriyani uzma!" : "Bugun bitta dars o'tib, seriyani boshla!"}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <XpBar xp={user.xp} light />
            </div>
          </div>
          <div className="card flex flex-row items-center justify-around gap-6 p-6 md:flex-col md:justify-center md:px-10">
            <div className="text-center">
              <div className={`text-5xl ${streak > 0 ? "" : "grayscale"}`}>🔥</div>
              <div className="text-3xl font-black text-orange-500">{streak}</div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">kun ketma-ket</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-violet-500">{badges.length}</div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">nishon</div>
            </div>
          </div>
        </section>
      )}

      {!isTeacher && next && (
        <section className="card flex flex-col items-start gap-4 border-violet-200 p-6 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-4xl">
            {next.lesson.emoji}
          </span>
          <div className="flex-1">
            <div className="text-sm font-extrabold uppercase tracking-wider text-violet-500">
              Davom ettir · {next.course.title}
            </div>
            <div className="text-xl font-black text-slate-900">{next.lesson.title}</div>
            <div className="font-semibold text-slate-500">{next.lesson.description}</div>
          </div>
          <Link href={`/learn/${next.course.id}/${next.lesson.id}`} className="btn btn-success w-full sm:w-auto">
            Boshlash ▶
          </Link>
        </section>
      )}

      {!isTeacher && !next && (
        <section className="card p-6 text-center">
          <div className="text-5xl">🏆</div>
          <div className="mt-2 text-xl font-black">Hamma darslar tugatildi!</div>
          <p className="font-semibold text-slate-500">
            Yulduzlarni ko'paytirish uchun darslarni takrorlashing mumkin. Tez orada yangi kurslar qo'shiladi.
          </p>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-2xl font-black text-slate-900">📚 Kurslar</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {COURSES.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              done={course.lessons.filter((l) => map.has(`${course.id}/${l.id}`)).length}
            />
          ))}
        </div>
      </section>

      {!isTeacher && (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">🏅 Nishonlarim</h2>
              <Link href="/profile" className="text-sm font-extrabold text-violet-600 hover:underline">
                Hammasi →
              </Link>
            </div>
            {badges.length === 0 ? (
              <p className="py-6 text-center font-semibold text-slate-400">
                Birinchi darsni tugatib, birinchi nishoningni ol! 🎯
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {badges.slice(0, 8).map((b) => (
                  <div key={b!.id} title={b!.description} className="flex w-20 flex-col items-center text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-3xl">
                      {b!.emoji}
                    </span>
                    <span className="mt-1 text-xs font-bold leading-tight text-slate-500">{b!.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">🏆 Sinf reytingi</h2>
              <Link href="/leaderboard" className="text-sm font-extrabold text-violet-600 hover:underline">
                Hammasi →
              </Link>
            </div>
            <LeaderboardList users={classmates.slice(0, 5)} currentUserId={user.id} />
          </div>
        </section>
      )}
    </div>
  );
}
