import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Award, CalendarCheck, ChevronRight, Flame, MapPin, Play, TrendingUp, Zap } from "lucide-react";
import { COURSES } from "@/content";
import { requireUser } from "@/lib/auth";
import { BADGES, getBadge, getLevel, liveStreak } from "@/lib/gamification";
import { getAttendance, getBadgeIds, getClassmates, getGroup, getProgress, lessonStates, progressMap } from "@/lib/queries";
import { attendanceRate, nextSession, timeRange } from "@/lib/schedule";
import { PageHeader, StatTile } from "@/components/AppShell";
import { LeaderboardList, XpBar } from "@/components/Widgets";
import { Mascot } from "@/components/Mascot";

export default async function DashboardPage() {
  const user = await requireUser();
  if (user.role === "teacher") redirect("/teacher");

  const [progress, badgeRows, classmates, group, attendance] = await Promise.all([
    getProgress(user.id),
    getBadgeIds(user.id),
    user.class_id ? getClassmates(user.class_id) : Promise.resolve([]),
    user.class_id ? getGroup(user.class_id) : Promise.resolve(null),
    getAttendance(user.id),
  ]);
  const next = group ? nextSession(group) : null;
  const rate = attendanceRate(attendance);
  const map = progressMap(progress);
  const streak = liveStreak(user);
  const level = getLevel(user.xp);

  const upNext = COURSES.flatMap((course) => {
    const current = lessonStates(course, map, false).find((s) => s.state === "current");
    return current ? [{ course, lesson: current.lesson, index: course.lessons.indexOf(current.lesson) }] : [];
  });

  const badges = badgeRows
    .sort((a, b) => b.earned_at.localeCompare(a.earned_at))
    .map((r) => getBadge(r.badge_id))
    .filter((b) => b !== undefined);

  return (
    <>
      <PageHeader
        title={`Salom, ${user.full_name.split(" ")[0]}! 👋`}
        subtitle={streak > 0 ? `Zo'r ketyapsan — ${streak} kunlik seriyani uzma!` : "Bugun bitta dars o'tib, yangi seriyani boshla."}
        actions={
          upNext[0] && (
            <Link href={`/learn/${upNext[0].course.id}/${upNext[0].lesson.id}`} className="btn btn-primary">
              <Play size={16} /> Davom etish
            </Link>
          )
        }
      />

      {(next || rate) && (
        <div className="card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-text">
            <CalendarCheck size={18} />
          </span>
          {next && group ? (
            <div className="min-w-0 flex-1">
              <div className="eyebrow">Keyingi jonli dars · {group.name}</div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-semibold text-zinc-900">
                <span>
                  {next.label}
                  {timeRange(group) ? `, ${timeRange(group)}` : ""}
                </span>
                {group.room && (
                  <span className="flex items-center gap-1 font-normal text-zinc-500">
                    <MapPin size={14} /> {group.room}
                  </span>
                )}
                {next.live && <span className="badge badge-green">Hozir ketmoqda</span>}
              </div>
            </div>
          ) : (
            <div className="flex-1 text-[15px] text-zinc-500">Guruh jadvali hali kiritilmagan.</div>
          )}
          {rate && (
            <div className="text-sm text-zinc-500 sm:text-right">
              Davomat: <b className="text-zinc-900">{rate.percent}%</b>
              <div className="text-xs">
                {rate.attended} / {rate.total} dars
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={<Zap size={18} />} label="Tajriba" value={`${user.xp} XP`} />
        <StatTile icon={<TrendingUp size={18} />} label="Daraja" value={level.level} />
        <StatTile icon={<Flame size={18} />} label="Seriya" value={`${streak} kun`} />
        <StatTile icon={<Award size={18} />} label="Nishonlar" value={`${badges.length} / ${BADGES.length}`} />
      </div>

      <div className="card mt-4 flex flex-col items-center gap-4 p-5 sm:flex-row">
        <Mascot pose="lie" face={streak >= 3 ? "cool" : "proud"} animate className="w-44" />
        <div className="w-full min-w-0 flex-1">
          <p className="mb-4 rounded-2xl rounded-tl-sm bg-primary-soft px-4 py-2.5 text-[15px] text-zinc-800">
            {streak >= 3
              ? `${streak} kun ketma-ket! Men aytgandim, sen zukkosan. 😎`
              : streak > 0
                ? "Yaxshi boshlading. Ertaga ham kel — seriyani birga davom ettiramiz."
                : "Men shu yerda dam olyapman. Bitta dars o'tamizmi?"}
          </p>
          <XpBar xp={user.xp} />
        </div>
      </div>

      <section className="card mt-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Keyingi darslar</h2>
            <p className="text-sm text-zinc-500">Har bir kursdagi navbatdagi dars</p>
          </div>
          <Link href="/courses" className="btn btn-outline btn-sm">
            Barcha kurslar <ArrowRight size={14} />
          </Link>
        </div>
        {upNext.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <div className="text-4xl">🏆</div>
            <div className="mt-2 font-semibold">Hamma darslar tugatildi!</div>
            <p className="text-sm text-zinc-500">Yulduzlarni ko'paytirish uchun darslarni takrorlashing mumkin.</p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-200">
            {upNext.map(({ course, lesson, index }) => (
              <li key={course.id}>
                <Link
                  href={`/learn/${course.id}/${lesson.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-zinc-50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-2xl">
                    {lesson.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-zinc-900">
                      {index + 1}. {lesson.title}
                    </div>
                    <div className="truncate text-sm text-zinc-500">
                      {course.title} · {lesson.description}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-zinc-400" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-zinc-900">Nishonlarim</h2>
            <Link href="/profile" className="btn btn-outline btn-sm">
              Hammasi <ArrowRight size={14} />
            </Link>
          </div>
          {badges.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-zinc-500">Birinchi darsni tugatib, birinchi nishoningni ol 🎯</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 p-5 sm:grid-cols-4">
              {badges.slice(0, 8).map((b) => (
                <div key={b.id} title={b.description} className="flex flex-col items-center text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl">{b.emoji}</span>
                  <span className="mt-1.5 text-xs font-medium leading-tight text-zinc-600">{b.name}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-zinc-900">Guruh reytingi</h2>
            <Link href="/leaderboard" className="btn btn-outline btn-sm">
              Hammasi <ArrowRight size={14} />
            </Link>
          </div>
          <LeaderboardList users={classmates.slice(0, 5)} currentUserId={user.id} />
        </section>
      </div>
    </>
  );
}
