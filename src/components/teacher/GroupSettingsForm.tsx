"use client";

import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import { updateGroup } from "@/app/teacher/actions";
import type { ClassRow } from "@/lib/db";
import { EVEN_DAYS, ODD_DAYS, WEEKDAYS } from "@/lib/schedule";

export function GroupSettingsForm({ group }: { group: ClassRow }) {
  const [state, action, pending] = useActionState(updateGroup, undefined);
  const [days, setDays] = useState<number[]>(group.days ?? []);

  const toggle = (d: number) => setDays((ds) => (ds.includes(d) ? ds.filter((x) => x !== d) : [...ds, d].sort()));

  return (
    <form action={action} className="card max-w-2xl p-5">
      <input type="hidden" name="class_id" value={group.id} />
      {days.map((d) => (
        <input key={d} type="hidden" name="days" value={d} />
      ))}
      <h2 className="text-base font-semibold text-zinc-900">Guruh va jadval</h2>
      <p className="mb-5 text-sm text-zinc-500">Jadval o'qituvchi bosh sahifasida «Bugungi darslar» va o'quvchilarda «Keyingi dars» uchun kerak.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="name">
            Guruh nomi
          </label>
          <input id="name" name="name" className="input" defaultValue={group.name} maxLength={60} required />
        </div>

        <div className="sm:col-span-2">
          <span className="label">Dars kunlari</span>
          <div className="flex flex-wrap gap-1.5">
            {WEEKDAYS.map((w) => (
              <button
                key={w.n}
                type="button"
                onClick={() => toggle(w.n)}
                aria-pressed={days.includes(w.n)}
                title={w.full}
                className={`btn btn-sm w-11 border ${
                  days.includes(w.n) ? "border-primary bg-primary text-white" : "border-zinc-200 bg-surface text-zinc-600"
                }`}
              >
                {w.short}
              </button>
            ))}
            <span className="mx-1 self-center text-zinc-300">|</span>
            <button type="button" onClick={() => setDays(ODD_DAYS)} className="btn btn-outline btn-sm">
              Toq kunlar
            </button>
            <button type="button" onClick={() => setDays(EVEN_DAYS)} className="btn btn-outline btn-sm">
              Juft kunlar
            </button>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="start_time">
            Boshlanish vaqti
          </label>
          <input id="start_time" name="start_time" type="time" className="input" defaultValue={group.start_time ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="duration_min">
            Davomiyligi
          </label>
          <select id="duration_min" name="duration_min" className="input" defaultValue={group.duration_min ?? 90}>
            {[45, 60, 80, 90, 120, 150].map((m) => (
              <option key={m} value={m}>
                {m} daqiqa
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="room">
            Xona
          </label>
          <input id="room" name="room" className="input" defaultValue={group.room ?? ""} placeholder="Masalan: 12-xona" />
        </div>
      </div>

      {state?.error && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">{state.error}</p>}
      {state?.ok && <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">Saqlandi</p>}

      <div className="mt-5 flex justify-end">
        <button type="submit" disabled={pending} className="btn btn-primary">
          <Save size={16} /> {pending ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </div>
    </form>
  );
}
