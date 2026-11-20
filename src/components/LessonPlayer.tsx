"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { X } from "lucide-react";
import type { Lesson } from "@/content/types";
import { completeLesson, type LessonResult } from "@/app/learn/actions";
import { ClassifyStep } from "./steps/ClassifyStep";
import { CodeStep } from "./steps/CodeStep";
import { OrderStep } from "./steps/OrderStep";
import { QuizStep } from "./steps/QuizStep";
import { TextStep } from "./steps/TextStep";
import { LessonResultView } from "./LessonResultView";
import { Mascot } from "./Mascot";

const PRAISE = ["Zo'r! 🎉", "Ajoyib! ⭐", "To'g'ri! 💪", "Barakalla! 🚀", "Aqlli! 🧠"];
const CONSOLE = ["Hech gap emas! 😌", "Unchalik emas 😅", "Deyarli! 🤏", "Xato — lekin bu ham o'rganish 🌱"];

type Props = {
  courseId: string;
  lesson: Lesson;
  courseHref: string;
  nextLessonHref: string | null;
};

export function LessonPlayer({ courseId, lesson, courseHref, nextLessonHref }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [feedback, setFeedback] = useState<{ correct: boolean; title: string } | null>(null);
  const [combo, setCombo] = useState(0);
  const [result, setResult] = useState<LessonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const step = lesson.steps[index];
  const isLast = index === lesson.steps.length - 1;
  const progress = (index + (feedback || step.type === "text" ? 1 : 0)) / lesson.steps.length;

  function handleAnswer(correct: boolean) {
    setAnswers((a) => [...a, correct]);
    setCombo((c) => (correct ? c + 1 : 0));
    const pool = correct ? PRAISE : CONSOLE;
    setFeedback({ correct, title: pool[Math.floor(Math.random() * pool.length)] });
  }

  function finish() {
    setError(null);
    const score = answers.filter(Boolean).length;
    startTransition(async () => {
      try {
        setResult(await completeLesson(courseId, lesson.id, score));
      } catch {
        setError("Natijani saqlab bo'lmadi. Internetni tekshirib, qaytadan bosing.");
      }
    });
  }

  function next() {
    if (isLast) return finish();
    setFeedback(null);
    setIndex((i) => i + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (result) {
    return <LessonResultView result={result} courseHref={courseHref} nextLessonHref={nextLessonHref} />;
  }

  const canContinue = step.type === "text" || feedback !== null;

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4">
      <header className="sticky top-0 z-10 -mx-4 flex items-center gap-4 border-b border-zinc-200 bg-page/90 px-4 py-4 backdrop-blur">
        <Link
          href={courseHref}
          className="rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="Chiqish"
        >
          <X size={22} />
        </Link>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${Math.max(4, progress * 100)}%` }}
          />
        </div>
        {combo >= 2 ? (
          <span className="animate-pop whitespace-nowrap font-semibold text-orange-500">🔥 {combo}</span>
        ) : (
          <span className="whitespace-nowrap text-sm text-zinc-500">
            {index + 1}/{lesson.steps.length}
          </span>
        )}
      </header>

      <main className="flex-1 pb-40 pt-8" key={index}>
        {index === 0 && (
          <div className="mb-6 flex items-end gap-3">
            <Mascot pose="sit" face="happy" className="w-20" />
            <div className="mb-3 rounded-2xl rounded-bl-sm border border-zinc-200 bg-surface px-4 py-2.5 text-[15px] text-zinc-700">
              Salom! Bugun: <b className="text-zinc-900">{lesson.title}</b>. Ketdik!
            </div>
          </div>
        )}
        {step.type === "text" && <TextStep step={step} />}
        {step.type === "quiz" && <QuizStep step={step} onAnswer={handleAnswer} />}
        {step.type === "order" && <OrderStep step={step} onAnswer={handleAnswer} />}
        {step.type === "classify" && <ClassifyStep step={step} onAnswer={handleAnswer} />}
        {step.type === "code" && <CodeStep step={step} onAnswer={handleAnswer} />}
      </main>

      {canContinue && (
        <footer
          className={`fixed inset-x-0 bottom-0 z-20 animate-pop border-t ${
            !feedback
              ? "border-zinc-200 bg-surface"
              : feedback.correct
                ? "border-emerald-200 bg-emerald-50"
                : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center">
            {feedback && (
              <Mascot pose="head" face={feedback.correct ? "happy" : "kind"} className="hidden w-14 sm:block" />
            )}
            {feedback && (
              <div className="flex-1">
                <div className={`text-xl font-semibold ${feedback.correct ? "text-emerald-600" : "text-amber-600"}`}>
                  {feedback.title}
                </div>
                {"explanation" in step && step.explanation && (
                  <p className={`mt-1 text-sm ${feedback.correct ? "text-emerald-800" : "text-amber-800"}`}>
                    {step.explanation}
                  </p>
                )}
              </div>
            )}
            {error && <p className="flex-1 text-sm font-medium text-rose-600">{error}</p>}
            <button
              type="button"
              onClick={next}
              disabled={pending}
              className={`btn btn-lg sm:ml-auto sm:min-w-48 ${feedback?.correct ? "btn-success" : "btn-primary"}`}
            >
              {pending ? "Saqlanmoqda..." : isLast ? "Yakunlash 🏁" : "Davom etish"}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
