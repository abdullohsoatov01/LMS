import Link from "next/link";
import { isConfigured } from "@/lib/db";
import { TeacherSignupForm } from "@/components/AuthForms";
import { SetupNeeded } from "@/components/SetupNeeded";

export default function SetupPage() {
  if (!isConfigured()) return <SetupNeeded />;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="card p-6 sm:p-8">
        <div className="mb-2 text-5xl">🎓</div>
        <h1 className="mb-1 text-2xl font-black text-slate-900">O'qituvchi hisobi</h1>
        <p className="mb-6 text-sm font-semibold text-slate-400">
          O'qituvchi sinflar yaratadi, o'quvchilarga login beradi va ularning natijalarini kuzatadi.
        </p>
        <TeacherSignupForm />
        <p className="mt-6 text-center text-sm font-semibold text-slate-400">
          <Link href="/login" className="text-violet-600 hover:underline">
            ← Kirish sahifasiga qaytish
          </Link>
        </p>
      </div>
    </main>
  );
}
