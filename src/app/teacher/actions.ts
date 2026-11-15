"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireTeacher } from "@/lib/auth";
import { db, type ClassRow } from "@/lib/db";
import { generatePassword, usernameBase } from "@/lib/credentials";
import { hashPassword } from "@/lib/session";

export type NewStudent = { full_name: string; username: string; password: string };
export type ActionState = { error?: string; ok?: boolean; created?: NewStudent[] } | undefined;

const MAX_BATCH = 60;

async function ownClass(teacherId: string, classId: string) {
  const { data } = await db().from("classes").select("*").eq("id", classId).eq("teacher_id", teacherId).maybeSingle();
  if (!data) throw new Error("Sinf topilmadi");
  return data as ClassRow;
}

async function ownStudent(teacherId: string, studentId: string) {
  const { data } = await db()
    .from("users")
    .select("id, class_id")
    .eq("id", studentId)
    .eq("role", "student")
    .maybeSingle();
  if (!data?.class_id) throw new Error("O'quvchi topilmadi");
  await ownClass(teacherId, data.class_id);
  return data;
}

export async function createClass(_: ActionState, form: FormData): Promise<ActionState> {
  const teacher = await requireTeacher();
  const name = String(form.get("name") ?? "").trim();
  if (name.length < 1 || name.length > 60) return { error: "Sinf nomini yozing (60 belgigacha)." };
  const { error } = await db().from("classes").insert({ name, teacher_id: teacher.id });
  if (error) return { error: error.message };
  revalidatePath("/teacher");
  return { ok: true };
}

export async function deleteClass(classId: string) {
  const teacher = await requireTeacher();
  await ownClass(teacher.id, classId);
  // Students of the class are removed by the foreign key cascade.
  await db().from("classes").delete().eq("id", classId);
  revalidatePath("/teacher");
  redirect("/teacher");
}

export async function addStudents(_: ActionState, form: FormData): Promise<ActionState> {
  const teacher = await requireTeacher();
  const classId = String(form.get("class_id") ?? "");
  await ownClass(teacher.id, classId);

  const names = String(form.get("names") ?? "")
    .split("\n")
    .map((n) => n.trim().replace(/\s+/g, " "))
    .filter((n) => n.length > 0);
  if (names.length === 0) return { error: "Kamida bitta o'quvchining ism-familiyasini yozing." };
  if (names.length > MAX_BATCH) return { error: `Bir martada ${MAX_BATCH} tagacha o'quvchi qo'shish mumkin.` };

  const { data: existing } = await db().from("users").select("username");
  const taken = new Set((existing ?? []).map((u) => u.username as string));

  const created: NewStudent[] = [];
  const rows = names.map((fullName) => {
    const base = usernameBase(fullName);
    let username = base;
    for (let n = 2; taken.has(username); n++) username = `${base}${n}`;
    taken.add(username);
    const password = generatePassword();
    created.push({ full_name: fullName, username, password });
    return {
      role: "student",
      username,
      full_name: fullName,
      class_id: classId,
      password_hash: hashPassword(password),
    };
  });

  const { error } = await db().from("users").insert(rows);
  if (error) return { error: "Saqlab bo'lmadi: " + error.message };

  revalidatePath(`/teacher/classes/${classId}`);
  return { created };
}

export async function resetStudentPassword(studentId: string) {
  const teacher = await requireTeacher();
  await ownStudent(teacher.id, studentId);
  const password = generatePassword();
  await db().from("users").update({ password_hash: hashPassword(password) }).eq("id", studentId);
  return { password };
}

export async function deleteStudent(studentId: string) {
  const teacher = await requireTeacher();
  const student = await ownStudent(teacher.id, studentId);
  await db().from("users").delete().eq("id", studentId);
  revalidatePath(`/teacher/classes/${student.class_id}`);
}
