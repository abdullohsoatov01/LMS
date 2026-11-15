import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLevel } from "@/lib/gamification";
import { getClassmates } from "@/lib/queries";
import { LeaderboardList } from "@/components/Widgets";

// Podium columns in display order: 2nd, 1st, 3rd
const PODIUM = [
  { rank: 1, height: "h-28", medal: "🥈", color: "from-slate-200 to-slate-300" },
  { rank: 0, height: "h-40", medal: "🥇", color: "from-amber-200 to-amber-300" },
  { rank: 2, height: "h-20", medal: "🥉", color: "from-orange-200 to-orange-300" },
];

export default async function LeaderboardPage() {
  const user = await requireUser();
  if (user.role === "teacher") redirect("/teacher");
  if (!user.class_id) {
    return <p className="card p-8 text-center font-semibold text-slate-500">Sen hali hech qaysi sinfga qo'shilmagansan.</p>;
  }

  const [students, { data: cls }] = await Promise.all([
    getClassmates(user.class_id),
    db().from("classes").select("name").eq("id", user.class_id).maybeSingle(),
  ]);
  const top = students.slice(0, 3);
  const myPlace = students.findIndex((s) => s.id === user.id) + 1;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-black text-slate-900">🏆 Reyting</h1>
      <p className="font-semibold text-slate-500">
        {cls?.name} · sen {myPlace}-o'rindasan
      </p>

      {top.length >= 3 && (
        <div className="mt-8 flex items-end justify-center gap-3">
          {PODIUM.map(({ rank, height, medal, color }) => {
            const s = top[rank];
            return (
            <div key={s.id} className="flex w-28 flex-col items-center">
              <span className="text-4xl">{s.avatar}</span>
              <span className="mt-1 w-full truncate text-center font-black text-slate-700">{s.full_name.split(" ")[0]}</span>
              <span className="text-sm font-black text-amber-500">⚡ {s.xp}</span>
              <div
                className={`mt-2 flex w-full items-start justify-center rounded-t-2xl bg-gradient-to-b pt-3 text-4xl ${color} ${height}`}
              >
                {medal}
              </div>
            </div>
            );
          })}
        </div>
      )}

      <div className="card mt-6 p-4 sm:p-6">
        <LeaderboardList users={students} currentUserId={user.id} />
      </div>
      <p className="mt-4 text-center text-sm font-semibold text-slate-400">
        XP darslarni tugatganda beriladi: har bir to'g'ri javob +10, dars tugashi +20. Hozir sen{" "}
        {getLevel(user.xp).level}-darajadasan.
      </p>
    </div>
  );
}
