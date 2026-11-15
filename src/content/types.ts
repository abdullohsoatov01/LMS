/**
 * Lesson content format. To add a lesson, add an object to a course's `lessons` array;
 * to add a course, create a file in ./courses and register it in ./index.ts.
 * Texts support Markdown (**bold**, lists, > quote blocks).
 */

export type TextStep = {
  type: "text";
  emoji?: string;
  title?: string;
  body: string;
};

export type QuizStep = {
  type: "quiz";
  question: string;
  options: string[];
  /** Index of the correct option, or several indexes for "pick all that apply". */
  correct: number | number[];
  explanation?: string;
};

export type OrderStep = {
  type: "order";
  question: string;
  /** Items in the correct order; they are shuffled for the student. */
  items: string[];
  explanation?: string;
};

export type ClassifyStep = {
  type: "classify";
  question: string;
  buckets: { id: string; label: string; emoji: string }[];
  items: { text: string; bucket: string }[];
  explanation?: string;
};

export type CodeStep = {
  type: "code";
  title: string;
  task: string;
  starter: string;
  /** Python run after the student's code in the same namespace. Failing `assert` messages are shown to the student. */
  tests: string;
  solution: string;
  hint?: string;
};

export type Step = TextStep | QuizStep | OrderStep | ClassifyStep | CodeStep;

export type Lesson = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  steps: Step[];
};

export type Course = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  /** Tailwind gradient classes for the course card. */
  gradient: string;
  badge: { name: string; emoji: string };
  lessons: Lesson[];
};

export function isInteractive(step: Step) {
  return step.type !== "text";
}
