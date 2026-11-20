import Link from "next/link";
import { BookOpen, CalendarDays, ChevronRight, Clock, GraduationCap, MapPin, Users, Zap } from "lucide-react";
import { COURSES } from "@/content";
import { requireTeacher } from "@/lib/auth";
import { db, type ClassRow } from "@/lib/db";
import { todayString } from "@/lib/gamification";
import { formatDays, formatLongDate, meetsOn, timeRange, todayState } from "@/lib/schedule";
import { PageHeader, StatTile } from "@/components/AppShell";
import { CreateClassForm } from "@/components/teacher/TeacherForms";

export default async function TeacherHome() {
  const teacher = await requireTeacher();
  const { data } = await db().from("classes").select("*").eq("teacher_id", teacher.id).order("created_at");
  const classes = (data ?? []) as ClassRow[];

  const { data: studentData } = classes.length
    ? await db()
        .from("users")
        .select("id, class_id, xp")
        .eq("role", "student")
        .in(
          "class_id",
          classes.map((c) => c.id),
        )
    : { data: [] };
  const students = (studentData ?? []) as { id: string; class_id: string; xp: number }[];

  const { data: progressData } = students.length
    ? await db()
        .from("lesson_progress")
        .select("user_id")
        .in(
          "user_id",
          students.map((s) => s.id),
        )
    : { data: [] };
  const lessonsByUser = new Map<string, number>();
  for (const row of (progressData ?? []) as { user_id: string }[]) {
    lessonsByUser.set(row.user_id, (lessonsByUser.get(row.user_id) ?? 0) + 1);
  }

  const totalLessons = COURSES.reduce((n, c) => n + c.lessons.length, 0);
  const statsFor = (classId: string) => {
    const list = students.filter((s) => s.class_id === classId);
    const avg = (f: (s: (typeof list)[number]) => number) =>
      list.length ? Math.round(list.reduce((n, s) => n + f(s), 0) / list.length) : 0;
    return { count: list.length, avgXp: avg((s) => s.xp), avgLessons: avg((s) => lessonsByUser.get(s.id) ?? 0) };
  };
  const avgXpAll = students.length ? Math.round(students.reduce((n, s) => n + s.xp, 0) / students.length) : 0;

  const today = todayString();
  const todays = classes
    .filter((c) => meetsOn(c, today))
    .sort((a, b) => (a.start_time ?? "99").localeCompare(b.start_time ?? "99"));

  return (
    <>
      <PageHeader
        title={`Salom, ${teacher.full_name}!`}
        subtitle="Guruhlaringizni boshqaring va o'quvchilar natijalarini kuzating."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={<GraduationCap size={18} />} label="Guruhlar" value={classes.length} />
        <StatTile icon={<Users size={18} />} label="O'quvchilar" value={students.length} />
        <StatTile icon={<Zap size={18} />} label="O'rtacha XP" value={avgXpAll} />
        <StatTile icon={<BookOpen size={18} />} label="Kurslar" value={COURSES.length} />
      </div>

      <section className="card mt-4 overflow-hidden">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-zinc-900">Bugungi darslar</h2>
          <p className="text-sm text-zinc-500">{formatLongDate(today)}</p>
        </div>
        {todays.length === 0 ? (
          <p className="px-5 py-6 text-sm text-zinc-500">
            Bugun dars yo'q. Guruh jadvalini guruh sahifasidagi «Sozlamalar» bo'limida kiritish mumkin.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200">
            {todays.map((c) => {
              const state = todayState(c);
              return (
                <li key={c.id}>
                  <Link
                    href={`/teacher/groups/${c.id}?tab=attendance`}
                    className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-zinc-50"
                  >
                    <div className="w-20 shrink-0">
                      <div className="font-mono text-[15px] font-bold text-zinc-900">{c.start_time ?? "—"}</div>
                      <div className="text-xs text-zinc-500">{c.duration_min ?? 90} daqiqa</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-zinc-900">{c.name}</div>
                      <div className="truncate text-sm text-zinc-500">
                        {statsFor(c.id).count} ta o'quvchi{c.room ? ` · ${c.room}` : ""}
                      </div>
                    </div>
                    {state === "live" && <span className="badge badge-green">Hozir</span>}
                    {state === "finished" && <span className="badge badge-gray">Tugadi</span>}
                    <span className="hidden text-sm font-medium text-primary-text sm:inline">Davomat</span>
                    <ChevronRight size={18} className="text-zinc-400" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="card mt-4 p-5">
        <h2 className="mb-3 text-lg font-semibold text-zinc-900">Yangi guruh</h2>
        <CreateClassForm />
      </section>

      <h2 className="mb-3 mt-8 text-lg font-semibold text-zinc-900">Mening guruhlarim</h2>
      {classes.length === 0 ? (
        <p className="card p-8 text-center text-zinc-500">
          Hali guruh yo'q. Yuqorida birinchi guruhni yarating, keyin unga o'quvchilarni qo'shing.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((c) => {
            const s = statsFor(c.id);
            return (
              <div key={c.id} className="card flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-zinc-900">{c.name}</h3>
                  <span className={`badge ${s.count > 0 ? "badge-green" : "badge-gray"}`}>
                    {s.count > 0 ? "Faol" : "Bo'sh"}
                  </span>
                </div>
                <div className="my-4 border-t border-zinc-200" />
                <ul className="space-y-2 text-[15px] text-zinc-700">
                  <li className="flex items-center gap-2.5">
                    <Users size={16} className="text-zinc-400" /> {s.count} ta o'quvchi
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CalendarDays size={16} className="text-zinc-400" /> {formatDays(c.days) ?? "Jadval kiritilmagan"}
                  </li>
                  {timeRange(c) && (
                    <li className="flex items-center gap-2.5">
                      <Clock size={16} className="text-zinc-400" /> {timeRange(c)}
                    </li>
                  )}
                  {c.room && (
                    <li className="flex items-center gap-2.5">
                      <MapPin size={16} className="text-zinc-400" /> {c.room}
                    </li>
                  )}
                  <li className="flex items-center gap-2.5">
                    <Zap size={16} className="text-zinc-400" /> O'rtacha: {s.avgXp} XP
                  </li>
                  <li className="flex items-center gap-2.5">
                    <BookOpen size={16} className="text-zinc-400" /> O'rtacha: {s.avgLessons} / {totalLessons} dars
                  </li>
                </ul>
                <Link href={`/teacher/groups/${c.id}`} className="btn btn-primary mt-5 w-full">
                  Batafsil
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
