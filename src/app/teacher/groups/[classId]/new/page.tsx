import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireTeacher } from "@/lib/auth";
import { db, type ClassRow } from "@/lib/db";
import { PageHeader } from "@/components/AppShell";
import { AddStudentForm } from "@/components/teacher/TeacherForms";

export default async function NewStudentPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const teacher = await requireTeacher();
  const { data } = await db()
    .from("classes")
    .select("*")
    .eq("id", classId)
    .eq("teacher_id", teacher.id)
    .maybeSingle();
  if (!data) notFound();
  const group = data as ClassRow;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Yangi o'quvchi"
        subtitle={`${group.name} guruhiga. Foydalanuvchi nomi va parolni bo'sh qoldirsangiz, ular avtomatik yaratiladi.`}
        actions={
          <Link href={`/teacher/groups/${group.id}`} className="btn btn-outline">
            <ArrowLeft size={16} /> Orqaga
          </Link>
        }
      />
      <AddStudentForm classId={group.id} className={group.name} />
    </div>
  );
}
