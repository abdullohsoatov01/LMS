"use client";

import { useMemo, useState } from "react";
import type { OrderStep as OrderStepType } from "@/content/types";
import { shuffledIndexes } from "@/lib/shuffle";

export function OrderStep({ step, onAnswer }: { step: OrderStepType; onAnswer: (correct: boolean) => void }) {
  const pool = useMemo(() => shuffledIndexes(step.items.length, step.question), [step]);
  const [answer, setAnswer] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const isCorrect = answer.every((v, i) => v === i);

  function add(i: number) {
    if (!checked) setAnswer((a) => [...a, i]);
  }

  function remove(i: number) {
    if (!checked) setAnswer((a) => a.filter((x) => x !== i));
  }

  function check() {
    setChecked(true);
    onAnswer(isCorrect);
  }

  return (
    <div className="animate-pop">
      <div className="mb-2 text-sm font-extrabold uppercase tracking-wider text-violet-500">Tartibla</div>
      <h2 className="mb-2 text-2xl font-black text-slate-900">{step.question}</h2>
      <p className="mb-6 text-slate-500">Bandlarni to'g'ri tartibda bos. Xato qo'ysang — ustiga bosib qaytar.</p>

      <ol className="mb-6 space-y-2">
        {step.items.map((_, slot) => {
          const item = answer[slot];
          const state = checked
            ? item === slot
              ? "choice-correct"
              : "choice-wrong"
            : item !== undefined
              ? "choice-selected"
              : "";
          return (
            <li key={slot} className="flex items-center gap-3">
              <span className="w-6 shrink-0 text-right text-lg font-black text-slate-300">{slot + 1}</span>
              {item === undefined ? (
                <div className="h-[52px] w-full rounded-2xl border-2 border-dashed border-slate-200" />
              ) : (
                <button type="button" onClick={() => remove(item)} className={`choice ${state}`}>
                  {step.items[item]}
                </button>
              )}
            </li>
          );
        })}
      </ol>

      {!checked && (
        <div className="flex flex-wrap gap-2">
          {pool
            .filter((i) => !answer.includes(i))
            .map((i) => (
              <button key={i} type="button" onClick={() => add(i)} className="choice w-auto animate-pop">
                {step.items[i]}
              </button>
            ))}
        </div>
      )}

      {checked && !isCorrect && (
        <div className="rounded-2xl bg-emerald-50 p-4">
          <div className="mb-2 font-extrabold text-emerald-700">To'g'ri tartib:</div>
          <ol className="list-decimal space-y-1 pl-6 text-emerald-900">
            {step.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      )}

      {!checked && (
        <button
          type="button"
          onClick={check}
          disabled={answer.length !== step.items.length}
          className="btn btn-primary mt-6 w-full"
        >
          Tekshirish
        </button>
      )}
    </div>
  );
}
