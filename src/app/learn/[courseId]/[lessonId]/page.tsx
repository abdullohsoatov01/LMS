import { notFound, redirect } from "next/navigation";
import { getLesson } from "@/content";
import { requireUser } from "@/lib/auth";
import { getProgress, lessonStates, progressMap } from "@/lib/queries";
import { LessonPlayer } from "@/components/LessonPlayer";

export default async function LessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  const found = getLesson(courseId, lessonId);
  if (!found) notFound();
  const { course, lesson, index } = found;

  const user = await requireUser();
  const states = lessonStates(course, progressMap(await getProgress(user.id)), user.role === "teacher");
  if (states[index].state === "locked") redirect(`/courses/${course.id}`);

  const nextLesson = course.lessons[index + 1];
  return (
    <LessonPlayer
      courseId={course.id}
      lesson={lesson}
      courseHref={`/courses/${course.id}`}
      nextLessonHref={nextLesson ? `/learn/${course.id}/${nextLesson.id}` : null}
    />
  );
}
