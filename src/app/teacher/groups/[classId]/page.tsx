import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import { COURSES } from "@/content";
import { requireTeacher } from "@/lib/auth";
import { db, type AttendanceRow, type AttendanceStatus, type ClassRow, type ProgressRow } from "@/lib/db";
import { getLevel, liveStreak, todayString } from "@/lib/gamification";
import { attendanceRate, formatDays, formatShortDate, timeRange } from "@/lib/schedule";
import { getClassmates, progressKey } from "@/lib/queries";
import { PageHeader } from "@/components/AppShell";
import { DeleteClassButton, StudentActions } from "@/components/teacher/TeacherForms";
import { AttendanceSheet } from "@/components/teacher/AttendanceSheet";
import { GroupSettingsForm } from "@/components/teacher/GroupSettingsForm";

type Tab = "students" | "attendance" | "progress" | "settings";
const TABS: Tab[] = ["students", "attendance", "progress", "settings"];

const MARK: Record<AttendanceStatus, { sign: string; cls: string; label: string }> = {
  present: { sign: "✓", cls: "bg-emerald-100 text-emerald-700", label: "Keldi" },
  late: { sign: "⏱", cls: "bg-amber-100 text-amber-700", label: "Kechikdi" },
  absent: { sign: "✕", cls: "bg-rose-100 text-rose-700", label: "Kelmadi" },
};

function cellClass(ratio: number) {
  if (ratio >= 1) return "bg-emerald-500 text-white";
  if (ratio >= 0.7) return "bg-emerald-100 text-emerald-700";
  return "bg-amber-100 text-amber-700";
}

/** "+998937654321" → "+998 93 765 43 21" */
function formatPhone(phone: string | null) {
  const m = phone?.match(/^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/);
  return m ? `+998 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : (phone ?? "—");
}

function formatDate(date: string | null) {
  if (!date) return "—";
  const [y, m, d] = date.split("-");
  return `${d}.${m}.${y}`;
}

export default async function ClassPage({
  params,
  searchParams,
}: {
  params: Promise<{ classId: string }>;
  searchParams: Promise<{ tab?: string; date?: string }>;
}) {
  const { classId } = await params;
  const { tab: tabParam, date: dateParam } = await searchParams;
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
  const tab: Tab = TABS.includes(tabParam as Tab) ? (tabParam as Tab) : "students";
  const today = todayString();
  const date = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) && dateParam <= today ? dateParam : today;

  const { data: attendanceData } = await db().from("attendance").select("*").eq("class_id", classId);
  const attendance = (attendanceData ?? []) as AttendanceRow[];
  const attendanceOf = (studentId: string) => attendance.filter((a) => a.user_id === studentId);
  const historyDates = [...new Set(attendance.map((a) => a.date))].sort().slice(-12);
  const marksOnDate = Object.fromEntries(attendance.filter((a) => a.date === date).map((a) => [a.user_id, a.status]));

  const { data: progressData } = students.length
    ? await db()
        .from("lesson_progress")
        .select("*")
        .in(
          "user_id",
          students.map((s) => s.id),
        )
    : { data: [] };
  const byStudent = new Map<string, Map<string, ProgressRow>>();
  for (const row of (progressData ?? []) as ProgressRow[]) {
    if (!byStudent.has(row.user_id)) byStudent.set(row.user_id, new Map());
    byStudent.get(row.user_id)!.set(progressKey(row.course_id, row.lesson_id), row);
  }
  const totalLessons = COURSES.reduce((n, c) => n + c.lessons.length, 0);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "students", label: "O'quvchilar", count: students.length },
    { id: "attendance", label: "Davomat" },
    { id: "progress", label: "Progress" },
    { id: "settings", label: "Sozlamalar" },
  ];
  const schedule = [formatDays(classRow.days), timeRange(classRow), classRow.room].filter(Boolean).join(" · ");

  return (
    <>
      <Link
        href="/teacher"
        className="no-print mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={16} /> Guruhlar
      </Link>
      <PageHeader
        title={classRow.name}
        subtitle={`${students.length} ta o'quvchi${schedule ? ` · ${schedule}` : " · jadval kiritilmagan"}`}
        actions={
          <>
            <DeleteClassButton classId={classRow.id} name={classRow.name} students={students.length} />
            <Link href={`/teacher/groups/${classRow.id}/new`} className="btn btn-primary">
              <UserPlus size={16} /> O'quvchi qo'shish
            </Link>
          </>
        }
      />

      <div className="no-print mb-5 inline-flex rounded-lg border border-zinc-200 bg-zinc-100/70 p-1">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`?tab=${t.id}`}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-[15px] transition ${
              tab === t.id ? "bg-surface font-medium text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {t.label}
            {t.count !== undefined && <span className="badge badge-gray px-1.5">{t.count}</span>}
          </Link>
        ))}
      </div>

      {tab === "settings" && <GroupSettingsForm group={classRow} />}

      {tab !== "settings" && students.length === 0 && (
        <p className="card p-8 text-center text-zinc-500">
          Guruhda hali o'quvchi yo'q.{" "}
          <Link href={`/teacher/groups/${classRow.id}/new`} className="font-medium text-primary-text hover:underline">
            O'quvchilarni qo'shish
          </Link>
        </p>
      )}

      {tab === "students" && students.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[1060px] text-left text-[15px]">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="px-4 py-3 font-medium">F.I.O</th>
                <th className="px-4 py-3 font-medium">Login</th>
                <th className="px-4 py-3 font-medium">Telefon</th>
                <th className="px-4 py-3 font-medium">Ota/ona telefoni</th>
                <th className="px-4 py-3 font-medium">XP</th>
                <th className="px-4 py-3 font-medium">Daraja</th>
                <th className="px-4 py-3 font-medium">Darslar</th>
                <th className="px-4 py-3 font-medium">Davomat</th>
                <th className="px-4 py-3 font-medium">Seriya</th>
                <th className="px-4 py-3 font-medium">Oxirgi faollik</th>
                <th className="px-4 py-3 text-right font-medium">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {students.map((s) => {
                const done = byStudent.get(s.id)?.size ?? 0;
                const streak = liveStreak(s);
                return (
                  <tr key={s.id}>
                    <td className="whitespace-nowrap px-4 py-2.5 text-zinc-900">
                      <span className="mr-2">{s.avatar}</span>
                      {s.full_name}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[13px] text-zinc-600">{s.username}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-zinc-600">{formatPhone(s.phone)}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-zinc-600">{formatPhone(s.parent_phone)}</td>
                    <td className="px-4 py-2.5 font-medium">{s.xp}</td>
                    <td className="px-4 py-2.5">{getLevel(s.xp).level}</td>
                    <td className="px-4 py-2.5">
                      <span className={`badge ${done === totalLessons ? "badge-green" : done > 0 ? "badge-blue" : "badge-gray"}`}>
                        {done} / {totalLessons}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">{attendanceCell(attendanceOf(s.id))}</td>
                    <td className="px-4 py-2.5">{streak > 0 ? `🔥 ${streak}` : "—"}</td>
                    <td className="px-4 py-2.5 text-zinc-500">{formatDate(s.last_active)}</td>
                    <td className="px-4 py-2.5">
                      <StudentActions studentId={s.id} name={s.full_name} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "attendance" && students.length > 0 && (
        <div className="space-y-4">
          <AttendanceSheet
            key={date}
            classId={classRow.id}
            date={date}
            today={today}
            students={students.map((s) => ({ id: s.id, full_name: s.full_name, avatar: s.avatar }))}
            initial={marksOnDate}
          />
          {historyDates.length > 0 && (
            <section className="card overflow-hidden">
              <h2 className="border-b border-zinc-200 px-5 py-4 text-lg font-semibold text-zinc-900">Davomat tarixi</h2>
              <div className="overflow-x-auto p-3">
                <table className="w-full text-left text-[15px]">
                  <thead>
                    <tr className="text-xs text-zinc-500">
                      <th className="px-3 py-2 font-medium" />
                      {historyDates.map((d) => (
                        <th key={d} className="px-1 py-2 text-center font-medium">
                          <Link href={`?tab=attendance&date=${d}`} className="hover:text-zinc-900">
                            {formatShortDate(d)}
                          </Link>
                        </th>
                      ))}
                      <th className="px-3 py-2 text-right font-medium">Jami</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id} className="border-t border-zinc-100">
                        <td className="whitespace-nowrap px-3 py-1.5 text-zinc-900">{s.full_name}</td>
                        {historyDates.map((d) => {
                          const mark = attendance.find((a) => a.user_id === s.id && a.date === d);
                          return (
                            <td key={d} className="px-1 py-1.5 text-center">
                              <span
                                title={mark ? MARK[mark.status].label : "Belgilanmagan"}
                                className={`inline-flex h-8 w-10 items-center justify-center rounded-md text-sm font-semibold ${
                                  mark ? MARK[mark.status].cls : "bg-zinc-50 text-zinc-300"
                                }`}
                              >
                                {mark ? MARK[mark.status].sign : "·"}
                              </span>
                            </td>
                          );
                        })}
                        <td className="px-3 py-1.5 text-right">{attendanceCell(attendanceOf(s.id))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}

      {tab === "progress" && students.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-500">
            Katakda — birinchi urinishdagi to'g'ri javoblar soni. Yashil — a'lo, sariq — takrorlash kerak.
          </p>
          {COURSES.map((course) => (
            <section key={course.id} className="card overflow-hidden">
              <h2 className="border-b border-zinc-200 px-5 py-4 text-lg font-semibold text-zinc-900">
                {course.emoji} {course.title}
              </h2>
              <div className="overflow-x-auto p-3">
                <table className="w-full text-left text-[15px]">
                  <thead>
                    <tr>
                      <th className="px-3 py-2" />
                      {course.lessons.map((l, i) => (
                        <th key={l.id} className="px-1 py-2 text-center font-normal" title={l.title}>
                          <div className="text-lg">{l.emoji}</div>
                          <div className="text-xs text-zinc-400">{i + 1}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id} className="border-t border-zinc-100">
                        <td className="whitespace-nowrap px-3 py-1.5 text-zinc-900">{s.full_name}</td>
                        {course.lessons.map((l) => {
                          const row = byStudent.get(s.id)?.get(progressKey(course.id, l.id));
                          return (
                            <td key={l.id} className="px-1 py-1.5 text-center">
                              {row ? (
                                <span
                                  title={`${l.title}: ${row.score}/${row.max_score}, urinishlar: ${row.attempts}`}
                                  className={`inline-flex h-8 w-12 items-center justify-center rounded-md text-xs font-semibold ${cellClass(
                                    row.max_score ? row.score / row.max_score : 1,
                                  )}`}
                                >
                                  {row.score}/{row.max_score}
                                </span>
                              ) : (
                                <span className="inline-flex h-8 w-12 items-center justify-center rounded-md bg-zinc-50 text-zinc-300">
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
        </div>
      )}
    </>
  );
}

function attendanceCell(rows: AttendanceRow[]) {
  const rate = attendanceRate(rows);
  if (!rate) return <span className="text-zinc-400">—</span>;
  const cls = rate.percent >= 85 ? "badge-green" : rate.percent >= 60 ? "badge-amber" : "bg-rose-50 text-rose-600";
  return (
    <span className={`badge ${cls}`} title={`${rate.attended} / ${rate.total} dars`}>
      {rate.percent}%
    </span>
  );
}
