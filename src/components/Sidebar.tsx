"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Flame,
  GraduationCap,
  LayoutGrid,
  LogOut,
  Menu,
  Moon,
  Trophy,
  UserRound,
  Sun,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { logout } from "@/app/login/actions";
import { Mascot } from "./Mascot";
import type { Role } from "@/lib/db";

type NavItem = { href: string; label: string; icon: LucideIcon };

const NAV: Record<Role, NavItem[]> = {
  student: [
    { href: "/dashboard", label: "Bosh sahifa", icon: LayoutGrid },
    { href: "/courses", label: "Kurslar", icon: BookOpen },
    { href: "/leaderboard", label: "Reyting", icon: Trophy },
    { href: "/profile", label: "Profil", icon: UserRound },
  ],
  teacher: [
    { href: "/teacher", label: "Guruhlar", icon: GraduationCap },
    { href: "/courses", label: "Kurslar", icon: BookOpen },
  ],
};

export type SidebarProps = {
  role: Role;
  fullName: string;
  avatar: string;
  stats?: { xp: number; streak: number; level: number; levelName: string; progress: number };
};

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`flex items-center gap-2 ${dark ? "text-[#1d1b4b] dark:text-white" : "text-white"}`}>
      <Mascot pose="head" className="w-10" />
      <span className="font-display text-[22px] font-extrabold lowercase tracking-tight">zukko</span>
    </span>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  const Icon = dark ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={toggle}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-sidebar-fg/85 transition hover:bg-sidebar-accent/60"
    >
      <Icon size={18} strokeWidth={1.75} className="text-sidebar-muted" />
      {dark ? "Kunduzgi" : "Tungi"}
    </button>
  );
}

function SidebarBody({ role, fullName, avatar, stats }: SidebarProps) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col bg-sidebar px-3 py-5 text-sidebar-fg">
      <Link href={role === "teacher" ? "/teacher" : "/dashboard"} className="mb-7 px-3">
        <Logo />
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV[role].map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-[15px] font-medium transition ${
                active
                  ? "border-sidebar-border bg-sidebar-accent text-white"
                  : "border-transparent text-sidebar-fg/85 hover:bg-sidebar-accent/60"
              }`}
            >
              <Icon size={18} strokeWidth={1.75} className={active ? "text-white" : "text-sidebar-muted"} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <ThemeToggle />
        {stats && (
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">
                {stats.level}-daraja <span className="font-normal text-sidebar-muted">· {stats.levelName}</span>
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(4, stats.progress * 100)}%` }} />
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm font-semibold">
              <span className={`flex items-center gap-1.5 ${stats.streak > 0 ? "text-[#fb923c]" : "text-sidebar-muted"}`}>
                <Flame size={16} /> {stats.streak} kun
              </span>
              <span className="flex items-center gap-1.5 text-[#fcd34d]">
                <Zap size={16} /> {stats.xp} XP
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 px-2 pt-1">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-lg">
            {avatar}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{fullName}</div>
            <div className="text-xs text-sidebar-muted">{role === "teacher" ? "O'qituvchi" : "O'quvchi"}</div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              title="Chiqish"
              className="rounded-lg p-2 text-[#fb7185] transition hover:bg-sidebar-accent"
            >
              <LogOut size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SidebarBody {...props} />
      </aside>

      <div className="no-print sticky top-0 z-30 flex items-center justify-between bg-sidebar px-4 py-3 lg:hidden">
        <Logo />
        <div className="flex items-center gap-3">
          {props.stats && (
            <span className="flex items-center gap-3 text-sm font-semibold">
              <span className={`flex items-center gap-1 ${props.stats.streak > 0 ? "text-[#fb923c]" : "text-sidebar-muted"}`}>
                <Flame size={15} /> {props.stats.streak}
              </span>
              <span className="flex items-center gap-1 text-[#fcd34d]">
                <Zap size={15} /> {props.stats.xp}
              </span>
            </span>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg p-1.5 text-white hover:bg-sidebar-accent"
            aria-label="Menyu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 animate-pop">
            <SidebarBody {...props} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-5 rounded-lg p-1.5 text-sidebar-muted hover:bg-sidebar-accent"
              aria-label="Yopish"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
