"use client";

import Link from "next/link";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import type { LessonResult } from "@/app/learn/actions";

export function LessonResultView({
  result,
  courseHref,
  nextLessonHref,
}: {
  result: LessonResult;
  courseHref: string;
  nextLessonHref: string | null;
}) {
  const accuracy = result.max > 0 ? Math.round((result.score / result.max) * 100) : 100;
  const perfect = result.score === result.max;

  useEffect(() => {
    const colors = ["#8b5cf6", "#d946ef", "#10b981", "#f59e0b", "#0ea5e9"];
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors });
    if (perfect || result.levelUp) {
      setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 }, colors }), 300);
      setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 }, colors }), 500);
    }
  }, [perfect, result.levelUp]);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mb-4 animate-float text-8xl">{perfect ? "🏆" : accuracy >= 60 ? "🎉" : "💪"}</div>
      <h1 className="text-4xl font-black text-slate-900">Dars tugadi!</h1>
      <p className="mt-2 text-lg font-semibold text-slate-500">
        {perfect ? "Bitta ham xatosiz! Sen haqiqiy yulduzsan!" : accuracy >= 60 ? "Juda yaxshi natija!" : "Yaxshi harakat! Takrorlasang, yanada yaxshi bo'ladi."}
      </p>

      {result.preview && (
        <p className="mt-4 rounded-2xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700">
          O'qituvchi rejimi: natija saqlanmadi
        </p>
      )}

      <div className="mt-8 grid w-full grid-cols-3 gap-3">
        <Stat label="XP" value={`+${result.xpGained}`} color="text-amber-500" icon="⚡" />
        <Stat label="Aniqlik" value={`${accuracy}%`} color="text-emerald-500" icon="🎯" />
        <Stat label="Ketma-ket" value={`${result.streak} kun`} color="text-orange-500" icon="🔥" />
      </div>

      {!result.preview && result.xpGained === 0 && (
        <p className="mt-3 text-sm font-semibold text-slate-400">
          Bu darsni avval ham o'tgansan — XP faqat natijani yaxshilasang qo'shiladi.
        </p>
      )}

      {result.levelUp && (
        <div className="mt-6 w-full animate-pop rounded-3xl bg-gradient-to-r from-violet-500 to-fuchsia-500 p-5 text-white shadow-lg">
          <div className="text-sm font-bold uppercase tracking-wider opacity-80">Yangi daraja!</div>
          <div className="text-3xl font-black">
            {result.level.level}-daraja · {result.level.name}
          </div>
        </div>
      )}

      {result.newBadges.length > 0 && (
        <div className="mt-6 w-full">
          <div className="mb-3 text-sm font-extrabold uppercase tracking-wider text-slate-400">Yangi nishonlar</div>
          <div className="flex flex-wrap justify-center gap-3">
            {result.newBadges.map((b, i) => (
              <div
                key={b.id}
                className="card w-36 animate-pop p-4"
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: "backwards" }}
              >
                <div className="text-4xl">{b.emoji}</div>
                <div className="mt-1 font-black text-slate-800">{b.name}</div>
                <div className="text-xs font-semibold text-slate-400">{b.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex w-full flex-col gap-3">
        {nextLessonHref && (
          <Link href={nextLessonHref} className="btn btn-success w-full">
            Keyingi dars →
          </Link>
        )}
        <Link href={courseHref} className="btn btn-ghost w-full">
          Kursga qaytish
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, color, icon }: { label: string; value: string; color: string; icon: string }) {
  return (
    <div className="card p-4">
      <div className="text-2xl">{icon}</div>
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}
