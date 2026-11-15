import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isConfigured } from "@/lib/db";
import { LoginForm } from "@/components/AuthForms";
import { SetupNeeded } from "@/components/SetupNeeded";

export default async function LoginPage() {
  if (!isConfigured()) return <SetupNeeded />;
  const user = await getCurrentUser();
  if (user) redirect(user.role === "teacher" ? "/teacher" : "/dashboard");

  return (
    <main className="mx-auto grid min-h-screen max-w-5xl items-center gap-10 px-4 py-10 md:grid-cols-2">
      <div className="text-center md:text-left">
        <div className="mb-4 inline-block animate-float text-8xl">🤖</div>
        <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
          Sun'iy intellekt dunyosiga <span className="text-violet-600">xush kelibsan!</span>
        </h1>
        <p className="mt-4 text-lg font-semibold text-slate-500">
          Neyron tarmoqlar qanday ishlashini bil, AI bilan to'g'ri gaplashishni o'rgan, XP to'pla va sinfdoshlaring bilan
          bellash.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
          {["🧠 AI asoslari", "✍️ Promptlar", "🐍 Python", "🏆 Reyting"].map((t) => (
            <span key={t} className="rounded-full bg-white px-4 py-1.5 text-sm font-extrabold text-slate-600 shadow-sm">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <h2 className="mb-1 text-2xl font-black text-slate-900">Kirish</h2>
        <p className="mb-6 text-sm font-semibold text-slate-400">Login va parolni o'qituvchingdan olasan</p>
        <LoginForm />
        <p className="mt-6 text-center text-sm font-semibold text-slate-400">
          O'qituvchimisiz?{" "}
          <Link href="/setup" className="text-violet-600 hover:underline">
            Hisob yaratish
          </Link>
        </p>
      </div>
    </main>
  );
}
