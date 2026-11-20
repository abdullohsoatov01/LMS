import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Lock, Star } from "lucide-react";
import { getCourse } from "@/content";
import { requireUser } from "@/lib/auth";
import { getProgress, lessonStates, progressMap } from "@/lib/queries";
import { PageHeader } from "@/components/AppShell";
import { ProgressBar } from "@/components/Widgets";

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  const user = await requireUser();
  const map = progressMap(await getProgress(user.id));
  const states = lessonStates(course, map, user.role === "teacher");
  const done = states.filter((s) => s.state === "done").length;
  const total = course.lessons.length;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/courses" className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft size={16} /> Kurslar
      </Link>
      <PageHeader title={`${course.emoji} ${course.title}`} subtitle={course.description} />

      <div className="card flex items-center gap-4 p-5">
        <div className="flex-1">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-semibold text-zinc-900">Kurs bo'yicha progress</span>
            <span className="text-zinc-500">
              {done} / {total} dars
            </span>
          </div>
          <ProgressBar value={done / total} />
        </div>
      </div>

      <ol className="relative mt-6 space-y-3">
        <span className="absolute bottom-8 left-[27px] top-8 w-px bg-zinc-200" aria-hidden />
        {states.map(({ lesson, state, stars }, i) => {
          const marker =
            state === "done" ? (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check size={24} strokeWidth={2.5} />
              </span>
            ) : state === "current" ? (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-2xl ring-2 ring-primary ring-offset-4 ring-offset-page">
                {lesson.emoji}
              </span>
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-zinc-400">
                <Lock size={20} />
              </span>
            );

          return (
            <li key={lesson.id} className="relative flex items-center gap-4">
              <div className="relative z-10 shrink-0">{marker}</div>
              <div
                className={`card flex flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-center ${
                  state === "current" ? "border-primary/40 ring-4 ring-primary-soft" : ""
                } ${state === "locked" ? "opacity-60" : ""}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-zinc-900">
                      {i + 1}. {lesson.title}
                    </span>
                    {state === "current" && <span className="badge badge-blue">Keyingi</span>}
                    {state === "done" && (
                      <span className="flex items-center gap-0.5" title={`${stars} / 3 yulduz`}>
                        {[1, 2, 3].map((n) => (
                          <Star
                            key={n}
                            size={14}
                            className={n <= stars ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"}
                          />
                        ))}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-zinc-500">{lesson.description}</p>
                </div>
                {state !== "locked" && (
                  <Link
                    href={`/learn/${course.id}/${lesson.id}`}
                    className={`btn btn-sm ${state === "current" ? "btn-primary" : "btn-outline"}`}
                  >
                    {state === "current" ? "Boshlash" : "Takrorlash"}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div
        className={`card mt-6 flex items-center gap-4 p-5 ${done === total ? "border-amber-200 bg-amber-50" : ""}`}
      >
        <span className={`text-4xl ${done === total ? "" : "opacity-40 grayscale"}`}>{course.badge.emoji}</span>
        <div>
          <div className="font-semibold text-zinc-900">Nishon: {course.badge.name}</div>
          <div className="text-sm text-zinc-500">
            {done === total ? "Kurs tugatildi — nishon sening!" : "Barcha darslarni tugatsang, shu nishonni olasan."}
          </div>
        </div>
      </div>
    </div>
  );
}
