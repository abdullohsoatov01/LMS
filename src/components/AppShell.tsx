import type { User } from "@/lib/db";
import { getLevel, liveStreak } from "@/lib/gamification";
import { Sidebar } from "./Sidebar";

export function AppShell({ user, children }: { user: User; children: React.ReactNode }) {
  const level = getLevel(user.xp);
  return (
    <div className="lg:pl-64">
      <Sidebar
        role={user.role}
        fullName={user.full_name}
        avatar={user.avatar}
        stats={
          user.role === "student"
            ? {
                xp: user.xp,
                streak: liveStreak(user),
                level: level.level,
                levelName: level.name,
                progress: level.progress,
              }
            : undefined
        }
      />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">{children}</main>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="no-print mb-6 flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900 sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 text-[15px] text-zinc-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-text">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="eyebrow truncate">{label}</div>
        <div className="text-xl font-semibold text-zinc-900">{value}</div>
      </div>
    </div>
  );
}
