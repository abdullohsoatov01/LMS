import Link from "next/link";
import type { User } from "@/lib/db";
import { liveStreak } from "@/lib/gamification";
import { logout } from "@/app/login/actions";
import { NavLinks } from "./NavLinks";

const STUDENT_LINKS = [
  { href: "/dashboard", label: "Bosh sahifa", icon: "🏠" },
  { href: "/leaderboard", label: "Reyting", icon: "🏆" },
  { href: "/profile", label: "Profil", icon: "👤" },
];

const TEACHER_LINKS = [
  { href: "/teacher", label: "Sinflar", icon: "🏫" },
  { href: "/dashboard", label: "Kurslar", icon: "📚" },
];

export function AppHeader({ user }: { user: User }) {
  const isStudent = user.role === "student";
  const streak = liveStreak(user);

  return (
    <header className="no-print sticky top-0 z-30 border-b-2 border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2.5 sm:gap-4">
        <Link href={isStudent ? "/dashboard" : "/teacher"} className="flex items-center gap-2">
          <span className="text-3xl">🤖</span>
          <span className="hidden text-xl font-black text-violet-600 md:inline">Maktab AI</span>
        </Link>

        <NavLinks links={isStudent ? STUDENT_LINKS : TEACHER_LINKS} />

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {isStudent && (
            <>
              <span
                title="Ketma-ket kunlar"
                className={`flex items-center gap-1 whitespace-nowrap font-black ${streak > 0 ? "text-orange-500" : "text-slate-300"}`}
              >
                🔥 {streak}
              </span>
              <span title="Tajriba ochkolari" className="flex items-center gap-1 whitespace-nowrap font-black text-amber-500">
                ⚡ {user.xp}
              </span>
            </>
          )}
          <span className="hidden text-2xl sm:inline" title={user.full_name}>
            {user.avatar}
          </span>
          <form action={logout}>
            <button type="submit" className="btn btn-ghost btn-sm" title="Chiqish">
              <span className="hidden sm:inline">Chiqish</span>
              <span className="sm:hidden">↪</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
