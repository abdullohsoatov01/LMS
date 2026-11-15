"use server";

import { revalidatePath } from "next/cache";
import { COURSES, getLesson, hasCode, maxScore } from "@/content";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { addDays, getBadge, getLevel, lessonXp, todayString, type Badge } from "@/lib/gamification";

export type LessonResult = {
  preview: boolean;
  score: number;
  max: number;
  xpGained: number;
  totalXp: number;
  streak: number;
  levelUp: boolean;
  level: ReturnType<typeof getLevel>;
  newBadges: Badge[];
};

export async function completeLesson(courseId: string, lessonId: string, rawScore: number): Promise<LessonResult> {
  const user = await requireUser();
  const found = getLesson(courseId, lessonId);
  if (!found) throw new Error("Lesson not found");

  const max = maxScore(found.lesson);
  const score = Math.max(0, Math.min(max, Math.floor(Number(rawScore) || 0)));

  // Teachers can play lessons to preview them; nothing is recorded.
  if (user.role === "teacher") {
    return {
      preview: true,
      score,
      max,
      xpGained: 0,
      totalXp: user.xp,
      streak: 0,
      levelUp: false,
      level: getLevel(user.xp),
      newBadges: [],
    };
  }

  const xp = lessonXp(score);
  const { data: existing } = await db()
    .from("lesson_progress")
    .select("score, xp, attempts")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  // Replaying a lesson only pays out the improvement, so XP can't be farmed.
  const xpGained = Math.max(0, xp - (existing?.xp ?? 0));

  if (!existing) {
    await db()
      .from("lesson_progress")
      .insert({ user_id: user.id, course_id: courseId, lesson_id: lessonId, score, max_score: max, xp });
  } else {
    const improved = score > existing.score;
    await db()
      .from("lesson_progress")
      .update({
        attempts: existing.attempts + 1,
        max_score: max,
        ...(improved ? { score, xp, completed_at: new Date().toISOString() } : {}),
      })
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .eq("lesson_id", lessonId);
  }

  const today = todayString();
  let streak = user.streak;
  if (user.last_active !== today) {
    streak = user.last_active === addDays(today, -1) ? user.streak + 1 : 1;
  }
  const totalXp = user.xp + xpGained;
  await db()
    .from("users")
    .update({ xp: totalXp, streak, best_streak: Math.max(user.best_streak, streak), last_active: today })
    .eq("id", user.id);

  const [{ data: progress }, { data: owned }] = await Promise.all([
    db().from("lesson_progress").select("course_id, lesson_id").eq("user_id", user.id),
    db().from("achievements").select("badge_id").eq("user_id", user.id),
  ]);
  const done = new Set((progress ?? []).map((p) => `${p.course_id}/${p.lesson_id}`));
  const level = getLevel(totalXp);

  const earned: string[] = [];
  if (done.size >= 1) earned.push("first-lesson");
  if (done.size >= 5) earned.push("five-lessons");
  if (done.size >= 10) earned.push("ten-lessons");
  if (score === max) earned.push("perfect");
  if (hasCode(found.lesson)) earned.push("coder");
  if (streak >= 3) earned.push("streak-3");
  if (streak >= 7) earned.push("streak-7");
  if (level.level >= 5) earned.push("level-5");
  for (const course of COURSES) {
    if (course.lessons.every((l) => done.has(`${course.id}/${l.id}`))) earned.push(`course-${course.id}`);
  }

  const ownedIds = new Set((owned ?? []).map((a) => a.badge_id));
  const newIds = earned.filter((id) => !ownedIds.has(id));
  if (newIds.length > 0) {
    await db()
      .from("achievements")
      .insert(newIds.map((badge_id) => ({ user_id: user.id, badge_id })));
  }

  revalidatePath("/", "layout");

  return {
    preview: false,
    score,
    max,
    xpGained,
    totalXp,
    streak,
    levelUp: level.level > getLevel(user.xp).level,
    level,
    newBadges: newIds.map(getBadge).filter((b): b is Badge => Boolean(b)),
  };
}
