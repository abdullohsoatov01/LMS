import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "@/content";
import { requireUser } from "@/lib/auth";
import { getProgress, lessonStates, progressMap } from "@/lib/queries";

// Horizontal offsets that make the lesson path wind like a trail.
const OFFSETS = [0, 70, 100, 70, 0, -70, -100, -70];

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  const user = await requireUser();
  const map = progressMap(await getProgress(user.id));
  const states = lessonStates(course, map, user.role === "teacher");
  const done = states.filter((s) => s.state === "done").length;

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/dashboard" className="mb-4 inline-block font-extrabold text-slate-400 hover:text-slate-600">
        ← Orqaga
      </Link>
      <header className={`rounded-3xl bg-gradient-to-br ${course.gradient} p-6 text-white shadow-lg sm:p-8`}>
        <div className="text-6xl">{course.emoji}</div>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">{course.title}</h1>
        <p className="mt-2 font-semibold text-white/85">{course.description}</p>
        <div className="mt-5 flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white" style={{ width: `${(done / course.lessons.length) * 100}%` }} />
          </div>
          <span className="font-black">
            {done}/{course.lessons.length}
          </span>
        </div>
      </header>

      <ol className="relative mt-12 space-y-12 pb-10">
        {states.map(({ lesson, state, stars }, i) => {
          const offset = OFFSETS[i % OFFSETS.length];
          const node = (
            <span
              className={`relative flex h-20 w-20 items-center justify-center rounded-full border-b-[6px] text-4xl transition ${
                state === "done"
                  ? `bg-gradient-to-br ${course.gradient} border-black/20 shadow-md hover:scale-105`
                  : state === "current"
                    ? "border-violet-300 bg-white shadow-lg ring-8 ring-violet-200/60 hover:scale-105"
                    : "border-slate-300 bg-slate-200 grayscale"
              }`}
            >
              {state === "locked" ? "🔒" : lesson.emoji}
              {state === "current" && (
                <span className="absolute -top-9 whitespace-nowrap rounded-xl bg-violet-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow animate-float">
                  {done === 0 && i === 0 ? "Boshla!" : "Keyingi"}
                </span>
              )}
            </span>
          );
          return (
            <li key={lesson.id} className="flex justify-center">
              <div
                className="flex max-w-[220px] flex-col items-center [transform:translateX(calc(var(--x)*0.3px))] sm:[transform:translateX(calc(var(--x)*1px))]"
                style={{ "--x": offset } as React.CSSProperties}
              >
              {state === "locked" ? (
                <div title="Avval oldingi darsni tugat">{node}</div>
              ) : (
                <Link href={`/learn/${course.id}/${lesson.id}`} aria-label={lesson.title}>
                  {node}
                </Link>
              )}
              <div className="mt-2 max-w-[220px] text-center">
                {state === "done" && (
                  <div className="text-lg leading-none">
                    {[1, 2, 3].map((n) => (
                      <span key={n} className={n <= stars ? "" : "opacity-20 grayscale"}>
                        ⭐
                      </span>
                    ))}
                  </div>
                )}
                <div className={`font-black ${state === "locked" ? "text-slate-400" : "text-slate-800"}`}>
                  {i + 1}. {lesson.title}
                </div>
                <div className="text-sm font-semibold text-slate-400">{lesson.description}</div>
              </div>
              </div>
            </li>
          );
        })}
        <li className="flex flex-col items-center pt-4">
          <span
            className={`flex h-24 w-24 items-center justify-center rounded-3xl text-5xl ${
              done === course.lessons.length ? "bg-amber-100 shadow-lg" : "bg-slate-100 grayscale"
            }`}
          >
            {course.badge.emoji}
          </span>
          <div className="mt-2 text-center font-black text-slate-500">Nishon: {course.badge.name}</div>
        </li>
      </ol>
    </div>
  );
}
