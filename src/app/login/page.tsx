import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isConfigured } from "@/lib/db";
import { LoginForm } from "@/components/AuthForms";
import { Logo } from "@/components/Sidebar";
import { Mascot } from "@/components/Mascot";
import { SetupNeeded } from "@/components/SetupNeeded";

export default async function LoginPage() {
  if (!isConfigured()) return <SetupNeeded />;
  const user = await getCurrentUser();
  if (user) redirect(user.role === "teacher" ? "/teacher" : "/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Mascot pose="lie" animate className="mb-2 w-56" />
      <Logo dark />
      <p className="mt-2 font-display text-sm font-semibold text-primary-text">AI bilan zukko bo'l!</p>
      <div className="card mt-6 w-full max-w-sm p-6 text-center">
        <h1 className="text-xl font-semibold text-zinc-900">Kirish</h1>
        <p className="mb-6 mt-1 text-[15px] text-zinc-500">Login va parolni o'qituvchingdan olasan.</p>
        <LoginForm />
      </div>
      <p className="mt-5 max-w-sm text-center text-sm text-zinc-500">
        Sun'iy intellekt va prompt muhandisligini o'rganamiz. O'qituvchimisiz?{" "}
        <Link href="/setup" className="font-medium text-zinc-900 hover:underline">
          Hisob yaratish
        </Link>
      </p>
    </main>
  );
}
