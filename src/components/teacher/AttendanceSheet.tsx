"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CheckCheck } from "lucide-react";
import { markAllPresent, setAttendance } from "@/app/teacher/actions";
import type { AttendanceStatus } from "@/lib/db";

const OPTIONS: { status: AttendanceStatus; label: string; active: string }[] = [
  { status: "present", label: "Keldi", active: "border-emerald-500 bg-emerald-500 text-white" },
  { status: "late", label: "Kechikdi", active: "border-amber-500 bg-amber-500 text-white" },
  { status: "absent", label: "Kelmadi", active: "border-rose-500 bg-rose-500 text-white" },
];

type Student = { id: string; full_name: string; avatar: string };

export function AttendanceSheet({
  classId,
  date,
  today,
  students,
  initial,
}: {
  classId: string;
  date: string;
  today: string;
  students: Student[];
  initial: Record<string, AttendanceStatus>;
}) {
  const router = useRouter();
  const [statuses, setStatuses] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function choose(studentId: string, status: AttendanceStatus) {
    const next = statuses[studentId] === status ? null : status;
    const previous = statuses;
    setStatuses((s) => {
      const copy = { ...s };
      if (next) copy[studentId] = next;
      else delete copy[studentId];
      return copy;
    });
    setError(null);
    startTransition(async () => {
      try {
        await setAttendance(classId, studentId, date, next);
      } catch {
        setStatuses(previous);
        setError("Saqlab bo'lmadi. Internetni tekshirib, qaytadan bosing.");
      }
    });
  }

  function allPresent() {
    setError(null);
    startTransition(async () => {
      try {
        const ids = await markAllPresent(classId, date);
        setStatuses((s) => ({ ...s, ...Object.fromEntries(ids.map((id) => [id, "present" as const])) }));
      } catch {
        setError("Saqlab bo'lmadi. Internetni tekshirib, qaytadan bosing.");
      }
    });
  }

  const counts = OPTIONS.map((o) => ({ ...o, n: Object.values(statuses).filter((s) => s === o.status).length }));
  const unmarked = students.length - Object.keys(statuses).length;

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-zinc-200 px-5 py-4">
        <label className="flex items-center gap-2 text-sm text-zinc-500" htmlFor="attendance-date">
          Sana
          <input
            id="attendance-date"
            type="date"
            className="input h-9 w-auto"
            value={date}
            max={today}
            onChange={(e) => e.target.value && router.push(`?tab=attendance&date=${e.target.value}`)}
          />
        </label>
        <div className="flex flex-wrap gap-2 text-sm">
          {counts.map((c) => (
            <span key={c.status} className="badge badge-gray px-2.5 py-1">
              {c.label}: <b className="ml-1 text-zinc-900">{c.n}</b>
            </span>
          ))}
          {unmarked > 0 && <span className="badge badge-amber px-2.5 py-1">Belgilanmagan: {unmarked}</span>}
        </div>
        <button
          type="button"
          onClick={allPresent}
          disabled={pending || unmarked === 0}
          className="btn btn-outline btn-sm ml-auto"
        >
          <CheckCheck size={15} /> Qolganlar keldi
        </button>
      </div>

      {error && <p className="bg-rose-50 px-5 py-2 text-sm font-medium text-rose-600">{error}</p>}

      <ul className="divide-y divide-zinc-200">
        {students.map((s) => (
          <li key={s.id} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center">
            <span className="flex min-w-0 flex-1 items-center gap-2 text-[15px] text-zinc-900">
              <span>{s.avatar}</span>
              <span className="truncate">{s.full_name}</span>
            </span>
            <div className="flex gap-1.5">
              {OPTIONS.map((o) => (
                <button
                  key={o.status}
                  type="button"
                  onClick={() => choose(s.id, o.status)}
                  className={`btn btn-sm border ${
                    statuses[s.id] === o.status ? o.active : "border-zinc-200 bg-surface text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <p className="border-t border-zinc-200 px-5 py-3 text-xs text-zinc-500">
        Keldi: +15 XP, kechikdi: +5 XP. Belgini qayta bossangiz, u olib tashlanadi.
      </p>
    </div>
  );
}
