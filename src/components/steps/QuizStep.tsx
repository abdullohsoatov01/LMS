"use client";

import { useState } from "react";
import type { QuizStep as QuizStepType } from "@/content/types";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuizStep({ step, onAnswer }: { step: QuizStepType; onAnswer: (correct: boolean) => void }) {
  const multi = Array.isArray(step.correct);
  const correct = new Set(Array.isArray(step.correct) ? step.correct : [step.correct]);
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);

  function toggle(i: number) {
    if (checked) return;
    if (!multi) return setSelected([i]);
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  }

  function check() {
    const ok = selected.length === correct.size && selected.every((i) => correct.has(i));
    setChecked(true);
    onAnswer(ok);
  }

  function optionClass(i: number) {
    if (checked && correct.has(i)) return "choice-correct";
    if (checked && selected.includes(i)) return "choice-wrong animate-shake";
    if (selected.includes(i)) return "choice-selected";
    return "";
  }

  return (
    <div className="animate-pop">
      <div className="mb-2 eyebrow !text-primary-text">
        {multi ? "Bir nechta javobni tanla" : "Savol"}
      </div>
      <h2 className="mb-6 text-2xl font-semibold text-zinc-900">{step.question}</h2>
      <div className="space-y-3">
        {step.options.map((option, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className={`choice flex items-center gap-3 ${optionClass(i)}`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center border text-sm font-semibold ${
                multi ? "rounded-lg" : "rounded-full"
              } ${selected.includes(i) ? "border-current" : "border-zinc-200 text-zinc-400"}`}
            >
              {multi && selected.includes(i) ? "✓" : LETTERS[i]}
            </span>
            <span>{option}</span>
          </button>
        ))}
      </div>
      {!checked && (
        <button type="button" onClick={check} disabled={selected.length === 0} className="btn btn-primary btn-lg mt-6 w-full">
          Tekshirish
        </button>
      )}
    </div>
  );
}
