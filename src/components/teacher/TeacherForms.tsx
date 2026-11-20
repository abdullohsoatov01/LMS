"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { KeyRound, Plus, Printer, Trash2, UserPlus } from "lucide-react";
import {
  addStudent,
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
      <input name="name" className="input" placeholder="Masalan: AI-1, Prompt-3" maxLength={60} required />
      <button type="submit" disabled={pending} className="btn btn-primary">
        <Plus size={16} /> {pending ? "Yaratilmoqda..." : "Yangi guruh"}
      </button>
      {state?.error && <p className="text-sm font-medium text-rose-600">{state.error}</p>}
    </form>
  );
}

function PhoneInput({ id, defaultValue }: { id: string; defaultValue?: string }) {
  return (
    <div className="flex h-10 items-center rounded-lg border border-zinc-200 bg-surface transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary-ring/60">
      <span className="pl-3 text-sm text-zinc-500">+998</span>
      <input
        id={id}
        name={id}
        type="tel"
        inputMode="tel"
        defaultValue={defaultValue}
        placeholder="90 123 45 67"
        className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-zinc-400"
      />
    </div>
  );
}

export function AddStudentForm({ classId, className }: { classId: string; className: string }) {
  const [state, action, pending] = useActionState(addStudent, undefined);
  const values = state?.values;

  return (
    <div className="space-y-4">
      {state?.created && (
        <div className="animate-pop rounded-xl border border-emerald-200 bg-emerald-50 p-4 print:border-0 print:p-0">
          <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-emerald-800">
              O'quvchi qo'shildi. Parolni hozir saqlang yoki chop eting — u boshqa ko'rsatilmaydi!
            </p>
            <button type="button" onClick={() => window.print()} className="btn btn-success btn-sm">
              <Printer size={14} /> Chop etish
            </button>
          </div>
          <div className="max-w-sm rounded-lg border border-dashed border-zinc-300 bg-surface p-4">
            <div className="eyebrow">Zukko · {className}</div>
            <div className="mt-1 text-base font-semibold">{state.created.full_name}</div>
            <div className="mt-2 font-mono text-sm">
              Login: <b>{state.created.username}</b>
            </div>
            <div className="font-mono text-sm">
              Parol: <b>{state.created.password}</b>
            </div>
          </div>
        </div>
      )}

      <form
        // Remount after each submit so fields reset on success and keep their values on error.
        key={JSON.stringify(state ?? {})}
        action={action}
        className="no-print card p-5"
      >
        <input type="hidden" name="class_id" value={classId} />
        <h2 className="text-base font-semibold text-zinc-900">O'quvchi ma'lumotlari</h2>
        <p className="mb-5 text-sm text-zinc-500">
          Ism va familiya majburiy, qolgan maydonlar ixtiyoriy. Tizimga kirish — foydalanuvchi nomi va parol orqali.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="first_name">
              Ism <span className="text-rose-500">*</span>
            </label>
            <input id="first_name" name="first_name" className="input" defaultValue={values?.first_name} required />
          </div>
          <div>
            <label className="label" htmlFor="last_name">
              Familiya <span className="text-rose-500">*</span>
            </label>
            <input id="last_name" name="last_name" className="input" defaultValue={values?.last_name} required />
          </div>
          <div>
            <label className="label" htmlFor="parent_phone">
              Ota/ona telefoni
            </label>
            <PhoneInput id="parent_phone" defaultValue={values?.parent_phone} />
          </div>
          <div>
            <label className="label" htmlFor="phone">
              O'quvchi telefoni
            </label>
            <PhoneInput id="phone" defaultValue={values?.phone} />
          </div>
          <div>
            <label className="label" htmlFor="username">
              Foydalanuvchi nomi
            </label>
            <input
              id="username"
              name="username"
              className="input"
              autoCapitalize="none"
              defaultValue={values?.username}
              placeholder="Bo'sh qoldirsangiz, avtomatik yaratiladi"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Parol
            </label>
            <input
              id="password"
              name="password"
              className="input"
              autoComplete="new-password"
              placeholder="Bo'sh qoldirsangiz, avtomatik yaratiladi"
            />
          </div>
        </div>
        {state?.error && (
          <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">{state.error}</p>
        )}
        <div className="mt-5 flex justify-end">
          <button type="submit" disabled={pending} className="btn btn-primary">
            <UserPlus size={16} /> {pending ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </form>
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
    <div className="flex items-center justify-end gap-1">
      {password && <span className="badge badge-amber font-mono text-sm">{password}</span>}
      <button type="button" onClick={reset} disabled={pending} className="btn btn-ghost btn-sm px-2" title="Yangi parol">
        <KeyRound size={16} />
      </button>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="btn btn-ghost btn-sm px-2 hover:text-rose-600"
        title="O'chirish"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export function DeleteClassButton({ classId, name, students }: { classId: string; name: string; students: number }) {
  const [pending, startTransition] = useTransition();
  function remove() {
    const warning = students > 0 ? ` Undagi ${students} ta o'quvchi va ularning natijalari ham o'chadi!` : "";
    if (!confirm(`«${name}» guruhi o'chirilsinmi?${warning}`)) return;
    startTransition(() => deleteClass(classId));
  }
  return (
    <button type="button" onClick={remove} disabled={pending} className="btn btn-outline text-rose-600 hover:bg-rose-50">
      <Trash2 size={16} /> Guruhni o'chirish
    </button>
  );
}
