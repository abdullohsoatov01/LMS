import { redirect } from "next/navigation";
import { Zap } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getClassmates } from "@/lib/queries";
import { PageHeader } from "@/components/AppShell";
import { LeaderboardList } from "@/components/Widgets";
import { Mascot } from "@/components/Mascot";

// Podium columns in display order: 2nd, 1st, 3rd
const PODIUM = [
  { rank: 1, height: "h-20", medal: "🥈" },
  { rank: 0, height: "h-28", medal: "🥇" },
  { rank: 2, height: "h-14", medal: "🥉" },
];

export default async function LeaderboardPage() {
  const user = await requireUser();
  if (user.role === "teacher") redirect("/teacher");
  if (!user.class_id) {
    return (
      <div className="card flex flex-col items-center gap-3 p-8 text-center text-zinc-500">
        <Mascot pose="lie" face="kind" className="w-48" />
        Sen hali hech qaysi guruhga qo'shilmagansan.
      </div>
    );
  }

  const [students, { data: cls }] = await Promise.all([
    getClassmates(user.class_id),
    db().from("classes").select("name").eq("id", user.class_id).maybeSingle(),
  ]);
  const top = students.slice(0, 3);
  const myPlace = students.findIndex((s) => s.id === user.id) + 1;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Reyting"
        subtitle={`${cls?.name ?? "Guruh"} · ${students.length} ta o'quvchi · sen ${myPlace}-o'rindasan`}
      />

      {top.length >= 3 && (
        <div className="card mb-4 flex items-end justify-center gap-3 px-4 pt-6">
          {PODIUM.map(({ rank, height, medal }) => {
            const s = top[rank];
            return (
              <div key={s.id} className="flex w-28 flex-col items-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-2xl">
                  {s.avatar}
                </span>
                <span className="mt-1.5 w-full truncate text-center text-sm font-semibold text-zinc-900">
                  {s.full_name.split(" ")[0]}
                </span>
                <span className="flex items-center gap-1 text-sm text-zinc-500">
                  <Zap size={13} className="text-amber-500" /> {s.xp}
                </span>
                <div
                  className={`mt-2 flex w-full items-start justify-center rounded-t-lg pt-2 text-2xl ${height} ${
                    rank === 0 ? "bg-primary text-white" : "bg-primary-soft"
                  }`}
                >
                  {medal}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="card overflow-hidden">
        <LeaderboardList users={students} currentUserId={user.id} />
      </div>
      <p className="mt-4 text-center text-sm text-zinc-500">
        XP: har bir to'g'ri javob +10, dars tugashi +20. Darsni takrorlasang, faqat yaxshilangan natija uchun XP
        qo'shiladi.
      </p>
    </div>
  );
}
