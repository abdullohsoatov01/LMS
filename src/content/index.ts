import type { Course, Lesson } from "./types";
import { isInteractive } from "./types";
import { aiBasics } from "./courses/ai-asoslari";
import { promptEngineering } from "./courses/prompt-muhandisligi";

export const COURSES: Course[] = [aiBasics, promptEngineering];

export function getCourse(courseId: string) {
  return COURSES.find((c) => c.id === courseId);
}

export function getLesson(courseId: string, lessonId: string) {
  const course = getCourse(courseId);
  const index = course?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  if (!course || index < 0) return null;
  return { course, lesson: course.lessons[index], index };
}

export function maxScore(lesson: Lesson) {
  return lesson.steps.filter(isInteractive).length;
}

export function hasCode(lesson: Lesson) {
  return lesson.steps.some((s) => s.type === "code");
}
