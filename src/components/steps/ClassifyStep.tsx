"use client";

import { useMemo, useState } from "react";
import type { ClassifyStep as ClassifyStepType } from "@/content/types";
import { shuffledIndexes } from "@/lib/shuffle";

type Placed = { item: number; bucket: string; wasWrong: boolean };

export function ClassifyStep({ step, onAnswer }: { step: ClassifyStepType; onAnswer: (correct: boolean) => void }) {
  const order = useMemo(() => shuffledIndexes(step.items.length, step.question), [step]);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [flash, setFlash] = useState<{ bucket: string; ok: boolean } | null>(null);

  const position = placed.length;
  const current = order[position];
  const done = position >= order.length;
  const correctBucket = done ? null : step.buckets.find((b) => b.id === step.items[current].bucket);

  function choose(bucketId: string) {
    if (flash || done) return;
    const item = step.items[current];
    const ok = item.bucket === bucketId;
    setFlash({ bucket: bucketId, ok });
    setTimeout(
      () => {
        const next = [...placed, { item: current, bucket: item.bucket, wasWrong: !ok }];
        setPlaced(next);
        setFlash(null);
        if (next.length === order.length) onAnswer(next.every((p) => !p.wasWrong));
      },
      ok ? 450 : 1500,
    );
  }

  return (
    <div className="animate-pop">
      <div className="mb-2 eyebrow !text-primary-text">Saralash</div>
      <h2 className="mb-6 text-2xl font-semibold text-zinc-900">{step.question}</h2>

      {!done && (
        <div className="mb-6">
          <div className="mb-2 text-center text-sm font-bold text-zinc-400">
            {position + 1} / {order.length}
          </div>
          <div
            key={current}
            className={`card animate-pop px-6 py-8 text-center text-xl font-semibold ${
              flash ? (flash.ok ? "border-emerald-300 bg-emerald-50" : "animate-shake border-rose-300 bg-rose-50") : ""
            }`}
          >
            {step.items[current].text}
            {flash && !flash.ok && correctBucket && (
              <div className="mt-3 text-base font-bold text-rose-600">
                To'g'ri javob: {correctBucket.emoji} {correctBucket.label}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {step.buckets.map((bucket) => (
          <div key={bucket.id} className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => choose(bucket.id)}
              disabled={done}
              className={`btn btn-outline h-auto flex-col py-4 disabled:opacity-100 ${
                flash?.bucket === bucket.id
                  ? flash.ok
                    ? "!border-emerald-400 !bg-emerald-50"
                    : "!border-rose-400 !bg-rose-50"
                  : ""
              }`}
            >
              <span className="text-3xl">{bucket.emoji}</span>
              <span>{bucket.label}</span>
            </button>
            {placed
              .filter((p) => p.bucket === bucket.id)
              .map((p) => (
                <div
                  key={p.item}
                  className={`animate-pop rounded-xl px-3 py-2 text-sm font-semibold ${
                    p.wasWrong ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"
                  }`}
                >
                  {p.wasWrong ? "↪ " : "✓ "}
                  {step.items[p.item].text}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
