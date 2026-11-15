"use server";

import { redirect } from "next/navigation";
import { db, isConfigured } from "@/lib/db";
import { endSession, startSession } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/session";
import { USERNAME_RE } from "@/lib/credentials";

export type FormState = { error?: string } | undefined;

export async function login(_: FormState, form: FormData): Promise<FormState> {
  if (!isConfigured()) return { error: "Sayt hali sozlanmagan (Supabase kalitlari yo'q)." };
  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");

  const { data: user } = await db()
    .from("users")
    .select("id, role, password_hash")
    .eq("username", username)
    .maybeSingle();
  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "Login yoki parol noto'g'ri. Qaytadan urinib ko'r." };
  }

  await startSession(user.id, user.password_hash);
  redirect(user.role === "teacher" ? "/teacher" : "/dashboard");
}

export async function logout() {
  await endSession();
  redirect("/login");
}

export async function registerTeacher(_: FormState, form: FormData): Promise<FormState> {
  if (!isConfigured()) return { error: "Sayt hali sozlanmagan (Supabase kalitlari yo'q)." };
  const expectedCode = process.env.TEACHER_SIGNUP_CODE;
  if (!expectedCode) return { error: "Serverda TEACHER_SIGNUP_CODE sozlanmagan." };

  const fullName = String(form.get("full_name") ?? "").trim();
  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const code = String(form.get("code") ?? "");

  if (code !== expectedCode) return { error: "Maxfiy kod noto'g'ri." };
  if (fullName.length < 3) return { error: "Ism-familiyani to'liq yozing." };
  if (!USERNAME_RE.test(username)) {
    return { error: "Login 3–32 belgidan iborat bo'lsin: lotin harflari, raqamlar, nuqta yoki chiziqcha." };
  }
  if (password.length < 8) return { error: "Parol kamida 8 belgidan iborat bo'lsin." };

  const passwordHash = hashPassword(password);
  const { data, error } = await db()
    .from("users")
    .insert({ role: "teacher", username, full_name: fullName, password_hash: passwordHash, avatar: "🎓" })
    .select("id")
    .single();
  if (error) {
    return { error: error.code === "23505" ? "Bu login band. Boshqasini tanlang." : "Xatolik: " + error.message };
  }

  await startSession(data.id, passwordHash);
  redirect("/teacher");
}
