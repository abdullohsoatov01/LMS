import Link from "next/link";
import { isConfigured } from "@/lib/db";
import { TeacherSignupForm } from "@/components/AuthForms";
import { Logo } from "@/components/Sidebar";
import { SetupNeeded } from "@/components/SetupNeeded";

export default function SetupPage() {
  if (!isConfigured()) return <SetupNeeded />;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Logo dark />
      <p className="mt-2 font-display text-sm font-semibold text-primary-text">AI bilan zukko bo'l!</p>
      <div className="card mt-6 w-full max-w-sm p-6 text-center">
        <h1 className="text-xl font-semibold text-zinc-900">O'qituvchi hisobi</h1>
        <p className="mb-6 mt-1 text-[15px] text-zinc-500">
          Guruhlar yarating, o'quvchilarga login bering va natijalarni kuzating.
        </p>
        <TeacherSignupForm />
      </div>
      <p className="mt-5 text-center text-sm text-zinc-500">
        Hisobingiz bormi?{" "}
        <Link href="/login" className="font-medium text-zinc-900 hover:underline">
          Kirish
        </Link>
      </p>
    </main>
  );
}
