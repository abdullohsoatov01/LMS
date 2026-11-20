import type { TextStep as TextStepType } from "@/content/types";
import { Markdown } from "../Markdown";

export function TextStep({ step }: { step: TextStepType }) {
  return (
    <div className="animate-pop">
      {step.emoji && <div className="mb-3 text-6xl">{step.emoji}</div>}
      {step.title && <h2 className="mb-5 text-3xl font-semibold text-zinc-900">{step.title}</h2>}
      <Markdown>{step.body}</Markdown>
    </div>
  );
}
