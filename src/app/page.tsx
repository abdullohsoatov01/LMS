import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isConfigured } from "@/lib/db";
import { SetupNeeded } from "@/components/SetupNeeded";

export default async function Home() {
  if (!isConfigured()) return <SetupNeeded />;
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  redirect(user.role === "teacher" ? "/teacher" : "/dashboard");
}
