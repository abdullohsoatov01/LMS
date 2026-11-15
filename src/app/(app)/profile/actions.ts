"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AVATARS } from "@/lib/avatars";

export async function setAvatar(avatar: string) {
  const user = await requireUser();
  if (!AVATARS.includes(avatar)) return;
  await db().from("users").update({ avatar }).eq("id", user.id);
  revalidatePath("/", "layout");
}
