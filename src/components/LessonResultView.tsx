"use client";

import Link from "next/link";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import type { LessonResult } from "@/app/learn/actions";
import { Mascot } from "./Mascot";

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
    const colors = ["#ff6a13", "#1d1b4b", "#ffb27a", "#ffd23f", "#10b981"];
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors });
    if (perfect || result.levelUp) {
      setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 }, colors }), 300);
      setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 }, colors }), 500);
    }
  }, [perfect, result.levelUp]);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-10 text-center">
      <Mascot
        pose={perfect || result.levelUp ? "jump" : accuracy >= 60 ? "sit" : "lie"}
        face={result.levelUp ? "wow" : perfect ? "happy" : accuracy >= 60 ? "happy" : "kind"}
        animate
        className={`mb-4 ${perfect || result.levelUp || accuracy >= 60 ? "w-40" : "w-56"}`}
      />
      <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900">Dars tugadi!</h1>
      <p className="mt-2 text-[17px] text-zinc-500">
        {perfect ? "Bitta ham xatosiz! Sen haqiqiy yulduzsan!" : accuracy >= 60 ? "Juda yaxshi natija!" : "Yaxshi harakat! Takrorlasang, yanada yaxshi bo'ladi."}
      </p>

      {result.preview && (
        <p className="badge badge-blue mt-4 px-3 py-1.5 text-sm">
          O'qituvchi rejimi: natija saqlanmadi
        </p>
      )}

      <div className="mt-8 grid w-full grid-cols-3 gap-3">
        <Stat label="XP" value={`+${result.xpGained}`} color="text-amber-500" icon="⚡" />
        <Stat label="Aniqlik" value={`${accuracy}%`} color="text-emerald-500" icon="🎯" />
        <Stat label="Ketma-ket" value={`${result.streak} kun`} color="text-orange-500" icon="🔥" />
      </div>

      {!result.preview && result.xpGained === 0 && (
        <p className="mt-3 text-sm text-zinc-500">
          Bu darsni avval ham o'tgansan — XP faqat natijani yaxshilasang qo'shiladi.
        </p>
      )}

      {result.levelUp && (
        <div className="mt-6 w-full animate-pop rounded-xl bg-primary p-5 text-white">
          <div className="text-xs font-semibold uppercase tracking-wide opacity-80">Yangi daraja!</div>
          <div className="text-2xl font-semibold">
            {result.level.level}-daraja · {result.level.name}
          </div>
        </div>
      )}

      {result.newBadges.length > 0 && (
        <div className="mt-6 w-full">
          <div className="eyebrow mb-3">Yangi nishonlar</div>
          <div className="flex flex-wrap justify-center gap-3">
            {result.newBadges.map((b, i) => (
              <div
                key={b.id}
                className="card w-36 animate-pop p-4"
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: "backwards" }}
              >
                <div className="text-4xl">{b.emoji}</div>
                <div className="mt-1 text-sm font-semibold text-zinc-900">{b.name}</div>
                <div className="text-xs text-zinc-500">{b.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex w-full flex-col gap-3">
        {nextLessonHref && (
          <Link href={nextLessonHref} className="btn btn-primary btn-lg w-full">
            Keyingi dars →
          </Link>
        )}
        <Link href={courseHref} className="btn btn-outline btn-lg w-full">
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
      <div className={`text-xl font-semibold ${color}`}>{value}</div>
      <div className="eyebrow">{label}</div>
    </div>
  );
}
