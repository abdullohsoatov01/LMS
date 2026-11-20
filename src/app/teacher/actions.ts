"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireTeacher } from "@/lib/auth";
import { db, type AttendanceStatus, type ClassRow } from "@/lib/db";
import { ATTENDANCE_XP, todayString } from "@/lib/gamification";
import { USERNAME_RE, generatePassword, usernameBase } from "@/lib/credentials";
import { hashPassword } from "@/lib/session";

export type NewStudent = { full_name: string; username: string; password: string };
export type StudentFormValues = {
  first_name: string;
  last_name: string;
  parent_phone: string;
  phone: string;
  username: string;
};
export type ActionState =
  | { error?: string; ok?: boolean; created?: NewStudent; values?: StudentFormValues }
  | undefined;

async function ownClass(teacherId: string, classId: string) {
  const { data } = await db().from("classes").select("*").eq("id", classId).eq("teacher_id", teacherId).maybeSingle();
  if (!data) throw new Error("Guruh topilmadi");
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
  if (name.length < 1 || name.length > 60) return { error: "Guruh nomini yozing (60 belgigacha)." };
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

export async function addStudent(_: ActionState, form: FormData): Promise<ActionState> {
  const teacher = await requireTeacher();
  const classId = String(form.get("class_id") ?? "");
  await ownClass(teacher.id, classId);

  const field = (name: string) => String(form.get(name) ?? "").trim();
  const values = {
    first_name: field("first_name"),
    last_name: field("last_name"),
    parent_phone: field("parent_phone"),
    phone: field("phone"),
    username: field("username").toLowerCase(),
  };
  const fail = (error: string): ActionState => ({ error, values });

  if (!values.first_name || !values.last_name) return fail("Ism va familiyani kiriting.");
  if (values.first_name.length > 40 || values.last_name.length > 40) return fail("Ism yoki familiya juda uzun.");

  const parentPhone = normalizePhone(values.parent_phone);
  const phone = normalizePhone(values.phone);
  if (parentPhone === false || phone === false) return fail("Telefon raqami 9 ta raqamdan iborat bo'lsin: 90 123 45 67");

  let username = values.username;
  if (username) {
    if (!USERNAME_RE.test(username)) {
      return fail("Foydalanuvchi nomi 3–32 belgi: lotin harflari, raqamlar, nuqta yoki chiziqcha.");
    }
    const { data: taken } = await db().from("users").select("id").eq("username", username).maybeSingle();
    if (taken) return fail("Bu foydalanuvchi nomi band. Boshqasini yozing yoki bo'sh qoldiring.");
  } else {
    const base = usernameBase(`${values.first_name} ${values.last_name}`);
    const { data: similar } = await db().from("users").select("username").like("username", `${base}%`);
    const taken = new Set((similar ?? []).map((u) => u.username as string));
    username = base;
    for (let n = 2; taken.has(username); n++) username = `${base}${n}`;
  }

  const typedPassword = String(form.get("password") ?? "");
  if (typedPassword && typedPassword.length < 6) return fail("Parol kamida 6 belgidan iborat bo'lsin.");
  const password = typedPassword || generatePassword();

  const fullName = `${values.first_name} ${values.last_name}`;
  const { error } = await db().from("users").insert({
    role: "student",
    username,
    full_name: fullName,
    phone,
    parent_phone: parentPhone,
    class_id: classId,
    password_hash: hashPassword(password),
  });
  if (error) {
    return fail(error.code === "23505" ? "Bu foydalanuvchi nomi band." : "Saqlab bo'lmadi: " + error.message);
  }

  revalidatePath(`/teacher/groups/${classId}`);
  return { created: { full_name: fullName, username, password } };
}

/** "90 123 45 67" or "+998901234567" → "+998901234567"; empty → null; anything else → false. */
function normalizePhone(raw: string): string | null | false {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 12 && digits.startsWith("998")) digits = digits.slice(3);
  return digits.length === 9 ? `+998${digits}` : false;
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
  revalidatePath(`/teacher/groups/${student.class_id}`);
}

export async function updateGroup(_: ActionState, form: FormData): Promise<ActionState> {
  const teacher = await requireTeacher();
  const classId = String(form.get("class_id") ?? "");
  await ownClass(teacher.id, classId);

  const name = String(form.get("name") ?? "").trim();
  if (name.length < 1 || name.length > 60) return { error: "Guruh nomini yozing (60 belgigacha)." };
  const days = [...new Set(form.getAll("days").map(Number))].filter((d) => d >= 1 && d <= 7).sort();
  const startTime = String(form.get("start_time") ?? "").trim();
  if (startTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)) return { error: "Vaqtni 18:00 ko'rinishida yozing." };
  const duration = Number(form.get("duration_min"));
  const room = String(form.get("room") ?? "").trim().slice(0, 40);

  const { error } = await db()
    .from("classes")
    .update({
      name,
      days,
      start_time: startTime || null,
      duration_min: duration >= 15 && duration <= 300 ? duration : 90,
      room: room || null,
    })
    .eq("id", classId);
  if (error) return { error: "Saqlab bo'lmadi: " + error.message };

  revalidatePath(`/teacher/groups/${classId}`);
  revalidatePath("/teacher");
  return { ok: true };
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Sets (or clears, with null) one student's attendance and moves their XP by the difference. */
async function writeAttendance(classId: string, studentId: string, date: string, status: AttendanceStatus | null) {
  const { data: existing } = await db()
    .from("attendance")
    .select("xp")
    .eq("user_id", studentId)
    .eq("date", date)
    .maybeSingle();
  const xp = status ? ATTENDANCE_XP[status] : 0;

  if (!status) {
    await db().from("attendance").delete().eq("user_id", studentId).eq("date", date);
  } else if (existing) {
    await db()
      .from("attendance")
      .update({ status, xp, class_id: classId, marked_at: new Date().toISOString() })
      .eq("user_id", studentId)
      .eq("date", date);
  } else {
    await db().from("attendance").insert({ class_id: classId, user_id: studentId, date, status, xp });
  }

  const diff = xp - (existing?.xp ?? 0);
  if (diff !== 0) {
    const { data: user } = await db().from("users").select("xp").eq("id", studentId).single();
    await db()
      .from("users")
      .update({ xp: Math.max(0, (user?.xp ?? 0) + diff) })
      .eq("id", studentId);
  }
}

async function checkAttendanceInput(classId: string, date: string) {
  const teacher = await requireTeacher();
  await ownClass(teacher.id, classId);
  if (!DATE_RE.test(date) || date > todayString()) throw new Error("Sana noto'g'ri");
}

export async function setAttendance(classId: string, studentId: string, date: string, status: AttendanceStatus | null) {
  await checkAttendanceInput(classId, date);
  const { data: student } = await db()
    .from("users")
    .select("id")
    .eq("id", studentId)
    .eq("class_id", classId)
    .maybeSingle();
  if (!student) throw new Error("O'quvchi topilmadi");
  await writeAttendance(classId, studentId, date, status);
  revalidatePath(`/teacher/groups/${classId}`);
}

/** Marks every not-yet-marked student of the group as present. Returns their ids. */
export async function markAllPresent(classId: string, date: string) {
  await checkAttendanceInput(classId, date);
  const [{ data: students }, { data: marked }] = await Promise.all([
    db().from("users").select("id").eq("class_id", classId).eq("role", "student"),
    db().from("attendance").select("user_id").eq("class_id", classId).eq("date", date),
  ]);
  const done = new Set((marked ?? []).map((m) => m.user_id as string));
  const ids = (students ?? []).map((s) => s.id as string).filter((id) => !done.has(id));
  for (const id of ids) await writeAttendance(classId, id, date, "present");
  revalidatePath(`/teacher/groups/${classId}`);
  return ids;
}
