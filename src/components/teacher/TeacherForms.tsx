"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import {
  addStudents,
  createClass,
  deleteClass,
  deleteStudent,
  resetStudentPassword,
} from "@/app/teacher/actions";

export function CreateClassForm() {
  const [state, action, pending] = useActionState(createClass, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3 sm:flex-row">
      <input name="name" className="input" placeholder="Masalan: 7-A sinf, AI to'garagi" maxLength={60} required />
      <button type="submit" disabled={pending} className="btn btn-primary whitespace-nowrap">
        {pending ? "..." : "+ Sinf yaratish"}
      </button>
      {state?.error && <p className="font-bold text-rose-600">{state.error}</p>}
    </form>
  );
}

export function AddStudentsForm({ classId, className }: { classId: string; className: string }) {
  const [state, action, pending] = useActionState(addStudents, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.created) formRef.current?.reset();
  }, [state]);

  return (
    <div>
      <form ref={formRef} action={action} className="no-print space-y-3">
        <input type="hidden" name="class_id" value={classId} />
        <label className="label" htmlFor="names">
          Har bir qatorga bitta o'quvchining ism-familiyasi
        </label>
        <textarea
          id="names"
          name="names"
          rows={5}
          className="input font-mono text-sm"
          placeholder={"Aziz Karimov\nMadina Yusupova\nJasur Toshmatov"}
          required
        />
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? "Yaratilmoqda..." : "O'quvchilarni qo'shish"}
        </button>
        {state?.error && <p className="font-bold text-rose-600">{state.error}</p>}
      </form>

      {state?.created && (
        <div className="mt-6 animate-pop rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 print:border-0 print:bg-white print:p-0">
          <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold text-emerald-800">
              ✅ {state.created.length} ta o'quvchi qo'shildi. Parollarni hozir saqlang yoki chop eting — ular boshqa
              ko'rsatilmaydi!
            </p>
            <button type="button" onClick={() => window.print()} className="btn btn-success btn-sm">
              🖨️ Chop etish
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 print:grid-cols-2">
            {state.created.map((s) => (
              <div
                key={s.username}
                className="break-inside-avoid rounded-xl border-2 border-dashed border-slate-300 bg-white p-4"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Maktab AI · {className}</div>
                <div className="mt-1 text-lg font-black">{s.full_name}</div>
                <div className="mt-2 font-mono text-sm">
                  Login: <b>{s.username}</b>
                </div>
                <div className="font-mono text-sm">
                  Parol: <b>{s.password}</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function StudentActions({ studentId, name }: { studentId: string; name: string }) {
  const [pending, startTransition] = useTransition();
  const [password, setPassword] = useState<string | null>(null);

  function reset() {
    if (!confirm(`${name} uchun yangi parol yaratilsinmi? Eski parol ishlamay qoladi.`)) return;
    startTransition(async () => {
      const r = await resetStudentPassword(studentId);
      setPassword(r.password);
    });
  }

  function remove() {
    if (!confirm(`${name} o'chirilsinmi? Uning barcha natijalari ham o'chadi.`)) return;
    startTransition(() => deleteStudent(studentId));
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      {password && (
        <span className="rounded-lg bg-amber-100 px-2 py-1 font-mono text-sm font-bold text-amber-900">{password}</span>
      )}
      <button type="button" onClick={reset} disabled={pending} className="btn btn-ghost btn-sm" title="Yangi parol">
        🔑
      </button>
      <button type="button" onClick={remove} disabled={pending} className="btn btn-ghost btn-sm" title="O'chirish">
        🗑️
      </button>
    </div>
  );
}

export function DeleteClassButton({ classId, name, students }: { classId: string; name: string; students: number }) {
  const [pending, startTransition] = useTransition();
  function remove() {
    const warning = students > 0 ? ` Undagi ${students} ta o'quvchi va ularning natijalari ham o'chadi!` : "";
    if (!confirm(`«${name}» sinfi o'chirilsinmi?${warning}`)) return;
    startTransition(() => deleteClass(classId));
  }
  return (
    <button type="button" onClick={remove} disabled={pending} className="btn btn-ghost btn-sm text-rose-600">
      Sinfni o'chirish
    </button>
  );
}
