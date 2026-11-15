import Link from "next/link";
import { notFound } from "next/navigation";
import { COURSES } from "@/content";
import { requireTeacher } from "@/lib/auth";
import { db, type ClassRow, type ProgressRow } from "@/lib/db";
import { getLevel, liveStreak } from "@/lib/gamification";
import { getClassmates, progressKey } from "@/lib/queries";
import { AddStudentsForm, DeleteClassButton, StudentActions } from "@/components/teacher/TeacherForms";

function cellColor(ratio: number) {
  if (ratio >= 1) return "bg-emerald-500 text-white";
  if (ratio >= 0.7) return "bg-emerald-300 text-emerald-900";
  return "bg-amber-300 text-amber-900";
}

function formatDate(date: string | null) {
  if (!date) return "—";
  const [y, m, d] = date.split("-");
  return `${d}.${m}.${y}`;
}

export default async function ClassPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const teacher = await requireTeacher();
  const { data: cls } = await db()
    .from("classes")
    .select("*")
    .eq("id", classId)
    .eq("teacher_id", teacher.id)
    .maybeSingle();
  if (!cls) notFound();
  const classRow = cls as ClassRow;

  const students = await getClassmates(classId);
  const { data: progressData } = students.length
    ? await db()
        .from("lesson_progress")
        .select("*")
        .in(
          "user_id",
          students.map((s) => s.id),
        )
    : { data: [] };
  const progress = (progressData ?? []) as ProgressRow[];
  const byStudent = new Map<string, Map<string, ProgressRow>>();
  for (const row of progress) {
    if (!byStudent.has(row.user_id)) byStudent.set(row.user_id, new Map());
    byStudent.get(row.user_id)!.set(progressKey(row.course_id, row.lesson_id), row);
  }
  const totalLessons = COURSES.reduce((n, c) => n + c.lessons.length, 0);

  return (
    <div className="space-y-6">
      <div className="no-print">
        <Link href="/teacher" className="mb-3 inline-block font-extrabold text-slate-400 hover:text-slate-600">
          ← Sinflar
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-slate-900">🎒 {classRow.name}</h1>
            <p className="font-semibold text-slate-500">{students.length} ta o'quvchi</p>
          </div>
          <DeleteClassButton classId={classRow.id} name={classRow.name} students={students.length} />
        </div>
      </div>

      <section className="card p-6 print:border-0 print:p-0 print:shadow-none">
        <h2 className="no-print mb-1 text-xl font-black text-slate-900">➕ O'quvchilarni qo'shish</h2>
        <p className="no-print mb-4 text-sm font-semibold text-slate-500">
          Loginlar va parollar avtomatik yaratiladi. Ularni chop etib, o'quvchilarga tarqating.
        </p>
        <AddStudentsForm classId={classRow.id} className={classRow.name} />
      </section>

      {students.length > 0 && (
        <>
          <section className="no-print card overflow-hidden">
            <h2 className="px-6 pt-6 text-xl font-black text-slate-900">👥 O'quvchilar</h2>
            <div className="overflow-x-auto p-2 sm:p-4">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">O'quvchi</th>
                    <th className="px-3 py-2">Login</th>
                    <th className="px-3 py-2">XP</th>
                    <th className="px-3 py-2">Daraja</th>
                    <th className="px-3 py-2">Darslar</th>
                    <th className="px-3 py-2">🔥</th>
                    <th className="px-3 py-2">Oxirgi faollik</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.id} className="border-t border-slate-100">
                      <td className="px-3 py-2.5 font-bold text-slate-400">{i + 1}</td>
                      <td className="px-3 py-2.5 font-extrabold text-slate-800">
                        <span className="mr-2 text-xl">{s.avatar}</span>
                        {s.full_name}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-sm text-slate-500">{s.username}</td>
                      <td className="px-3 py-2.5 font-black text-amber-500">{s.xp}</td>
                      <td className="px-3 py-2.5 font-bold">{getLevel(s.xp).level}</td>
                      <td className="px-3 py-2.5 font-bold">
                        {byStudent.get(s.id)?.size ?? 0}/{totalLessons}
                      </td>
                      <td className="px-3 py-2.5 font-bold text-orange-500">{liveStreak(s)}</td>
                      <td className="px-3 py-2.5 text-sm font-semibold text-slate-500">{formatDate(s.last_active)}</td>
                      <td className="px-3 py-2.5">
                        <StudentActions studentId={s.id} name={s.full_name} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {COURSES.map((course) => (
            <section key={course.id} className="no-print card overflow-hidden">
              <div className="px-6 pt-6">
                <h2 className="text-xl font-black text-slate-900">
                  {course.emoji} {course.title}
                </h2>
                <p className="text-sm font-semibold text-slate-400">
                  Katakda — birinchi urinishdagi to'g'ri javoblar. Yashil — a'lo, sariq — takrorlash kerak.
                </p>
              </div>
              <div className="overflow-x-auto p-2 sm:p-4">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-3 py-2" />
                      {course.lessons.map((l, i) => (
                        <th key={l.id} className="px-1 py-2 text-center" title={l.title}>
                          <div className="text-xl">{l.emoji}</div>
                          <div className="text-xs font-bold text-slate-400">{i + 1}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id} className="border-t border-slate-100">
                        <td className="whitespace-nowrap px-3 py-1.5 font-bold text-slate-700">{s.full_name}</td>
                        {course.lessons.map((l) => {
                          const row = byStudent.get(s.id)?.get(progressKey(course.id, l.id));
                          return (
                            <td key={l.id} className="px-1 py-1.5 text-center">
                              {row ? (
                                <span
                                  title={`${l.title}: ${row.score}/${row.max_score}, urinishlar: ${row.attempts}`}
                                  className={`inline-flex h-9 w-12 items-center justify-center rounded-lg text-xs font-black ${cellColor(
                                    row.max_score ? row.score / row.max_score : 1,
                                  )}`}
                                >
                                  {row.score}/{row.max_score}
                                </span>
                              ) : (
                                <span className="inline-flex h-9 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
                                  ·
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
