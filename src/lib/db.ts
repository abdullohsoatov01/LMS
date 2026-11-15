import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Role = "teacher" | "student";

export type User = {
  id: string;
  role: Role;
  username: string;
  full_name: string;
  class_id: string | null;
  avatar: string;
  xp: number;
  streak: number;
  best_streak: number;
  last_active: string | null;
  created_at: string;
};

export type ClassRow = {
  id: string;
  name: string;
  teacher_id: string;
  created_at: string;
};

export type ProgressRow = {
  user_id: string;
  course_id: string;
  lesson_id: string;
  score: number;
  max_score: number;
  xp: number;
  attempts: number;
  completed_at: string;
};

/** Columns that are safe to load into pages (everything except password_hash). */
export const USER_COLUMNS =
  "id, role, username, full_name, class_id, avatar, xp, streak, best_streak, last_active, created_at";

export function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let client: SupabaseClient | null = null;

/** Server-only database client. Uses the secret key, so never import it into client components. */
export function db() {
  if (!client) {
    client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
