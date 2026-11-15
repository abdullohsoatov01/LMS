import Link from "next/link";
import { COURSES } from "@/content";
import { requireTeacher } from "@/lib/auth";
import { db, type ClassRow } from "@/lib/db";
import { CreateClassForm } from "@/components/teacher/TeacherForms";

export default async function TeacherHome() {
  const teacher = await requireTeacher();
  const { data } = await db()
    .from("classes")
    .select("*")
    .eq("teacher_id", teacher.id)
    .order("created_at");
  const classes = (data ?? []) as ClassRow[];

  const { data: students } = classes.length
    ? await db()
        .from("users")
        .select("class_id, xp")
        .eq("role", "student")
        .in(
          "class_id",
          classes.map((c) => c.id),
        )
    : { data: [] };

  const statsFor = (classId: string) => {
    const list = (students ?? []).filter((s) => s.class_id === classId);
    const avgXp = list.length ? Math.round(list.reduce((n, s) => n + s.xp, 0) / list.length) : 0;
    return { count: list.length, avgXp };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Salom, {teacher.full_name.split(" ")[0]}! 👋</h1>
        <p className="font-semibold text-slate-500">Sinflaringizni boshqaring va o'quvchilar natijalarini kuzating.</p>
      </div>

      <section className="card p-6">
        <h2 className="mb-4 text-xl font-black text-slate-900">🏫 Yangi sinf</h2>
        <CreateClassForm />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-black text-slate-900">Mening sinflarim</h2>
        {classes.length === 0 ? (
          <p className="card p-8 text-center font-semibold text-slate-400">
            Hali sinf yo'q. Yuqorida birinchi sinfni yarating, keyin unga o'quvchilarni qo'shing.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => {
              const s = statsFor(c.id);
              return (
                <Link
                  key={c.id}
                  href={`/teacher/classes/${c.id}`}
                  className="card p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="text-4xl">🎒</div>
                  <div className="mt-2 text-xl font-black text-slate-900">{c.name}</div>
                  <div className="mt-3 flex gap-4 text-sm font-bold text-slate-500">
                    <span>👥 {s.count} o'quvchi</span>
                    <span>⚡ o'rtacha {s.avgXp} XP</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="card p-6">
        <h2 className="mb-1 text-xl font-black text-slate-900">📚 Kurslar</h2>
        <p className="mb-4 font-semibold text-slate-500">
          Darslarni o'quvchi ko'zi bilan ko'rib chiqing. O'qituvchi uchun barcha darslar ochiq, natija saqlanmaydi.
        </p>
        <div className="flex flex-wrap gap-3">
          {COURSES.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`} className="btn btn-ghost">
              {course.emoji} {course.title} · {course.lessons.length} dars
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
