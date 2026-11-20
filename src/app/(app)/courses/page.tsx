import { COURSES } from "@/content";
import { requireUser } from "@/lib/auth";
import { getProgress, progressKey, progressMap } from "@/lib/queries";
import { PageHeader } from "@/components/AppShell";
import { CourseCard } from "@/components/Widgets";

export default async function CoursesPage() {
  const user = await requireUser();
  const map = progressMap(await getProgress(user.id));

  return (
    <>
      <PageHeader
        title="Kurslar"
        subtitle={
          user.role === "teacher"
            ? "O'qituvchi uchun barcha darslar ochiq. Darslarni o'tishingiz mumkin, natija saqlanmaydi."
            : `${COURSES.length} ta kurs · darslar ketma-ket ochiladi`
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {COURSES.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            done={course.lessons.filter((l) => map.has(progressKey(course.id, l.id))).length}
          />
        ))}
      </div>
    </>
  );
}
