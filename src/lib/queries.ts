import type { Course } from "@/content/types";
import { maxScore } from "@/content";
import { db, USER_COLUMNS, type AttendanceRow, type ClassRow, type ProgressRow, type User } from "./db";

export async function getProgress(userId: string) {
  const { data } = await db().from("lesson_progress").select("*").eq("user_id", userId);
  return (data ?? []) as ProgressRow[];
}

export async function getBadgeIds(userId: string) {
  const { data } = await db().from("achievements").select("badge_id, earned_at").eq("user_id", userId);
  return (data ?? []) as { badge_id: string; earned_at: string }[];
}

export async function getClassmates(classId: string) {
  const { data } = await db()
    .from("users")
    .select(USER_COLUMNS)
    .eq("class_id", classId)
    .eq("role", "student")
    .order("xp", { ascending: false })
    .order("full_name");
  return (data ?? []) as User[];
}

export async function getGroup(classId: string) {
  const { data } = await db().from("classes").select("*").eq("id", classId).maybeSingle();
  return (data ?? null) as ClassRow | null;
}

export async function getAttendance(userId: string) {
  const { data } = await db().from("attendance").select("*").eq("user_id", userId).order("date", { ascending: false });
  return (data ?? []) as AttendanceRow[];
}

export function progressKey(courseId: string, lessonId: string) {
  return `${courseId}/${lessonId}`;
}

export function progressMap(rows: ProgressRow[]) {
  return new Map(rows.map((r) => [progressKey(r.course_id, r.lesson_id), r]));
}

/** 1–3 stars for a finished lesson, based on first-try accuracy. */
export function stars(score: number, max: number) {
  const ratio = max > 0 ? score / max : 1;
  return ratio >= 1 ? 3 : ratio >= 0.7 ? 2 : 1;
}

export type LessonState = "done" | "current" | "locked";

/** Lessons unlock one after another. Teachers can open every lesson. */
export function lessonStates(course: Course, progress: Map<string, ProgressRow>, unlockAll: boolean) {
  let previousDone = true;
  return course.lessons.map((lesson) => {
    const row = progress.get(progressKey(course.id, lesson.id));
    let state: LessonState;
    if (row) state = "done";
    else if (previousDone || unlockAll) state = "current";
    else state = "locked";
    previousDone = Boolean(row);
    return { lesson, state, row, stars: row ? stars(row.score, maxScore(lesson)) : 0 };
  });
}
