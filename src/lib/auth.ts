import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, isConfigured, USER_COLUMNS, type User } from "./db";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  passwordVersion,
  readSessionToken,
} from "./session";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!isConfigured()) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = readSessionToken(token);
  if (!session) return null;

  const { data } = await db()
    .from("users")
    .select(`${USER_COLUMNS}, password_hash`)
    .eq("id", session.u)
    .maybeSingle();
  if (!data || passwordVersion(data.password_hash) !== session.v) return null;

  const { password_hash: _, ...user } = data;
  return user as User;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireTeacher() {
  const user = await requireUser();
  if (user.role !== "teacher") redirect("/dashboard");
  return user;
}

export async function startSession(userId: string, passwordHash: string) {
  (await cookies()).set(SESSION_COOKIE, createSessionToken(userId, passwordHash), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
