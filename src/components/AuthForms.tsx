"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login, registerTeacher } from "@/app/login/actions";

function PasswordInput({ id, minLength, autoComplete }: { id: string; minLength?: number; autoComplete?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={visible ? "text" : "password"}
        className="input pr-10"
        minLength={minLength}
        autoComplete={autoComplete}
        required
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-500 hover:text-zinc-900"
        aria-label={visible ? "Parolni yashirish" : "Parolni ko'rsatish"}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

function ErrorText({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="animate-shake rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">{error}</p>;
}

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-4 text-left">
      <div>
        <label className="label" htmlFor="username">
          Login
        </label>
        <input
          id="username"
          name="username"
          className="input"
          autoComplete="username"
          autoCapitalize="none"
          placeholder="masalan: aziz.k"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Parol
        </label>
        <PasswordInput id="password" autoComplete="current-password" />
      </div>
      <ErrorText error={state?.error} />
      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? "Kirilmoqda..." : "Kirish"}
      </button>
    </form>
  );
}

export function TeacherSignupForm() {
  const [state, action, pending] = useActionState(registerTeacher, undefined);
  return (
    <form action={action} className="space-y-4 text-left">
      <div>
        <label className="label" htmlFor="full_name">
          Ism-familiya
        </label>
        <input id="full_name" name="full_name" className="input" placeholder="Dilnoza Karimova" required />
      </div>
      <div>
        <label className="label" htmlFor="username">
          Login
        </label>
        <input
          id="username"
          name="username"
          className="input"
          autoCapitalize="none"
          placeholder="dilnoza.k"
          pattern="[a-z0-9._\-]{3,32}"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Parol (kamida 8 belgi)
        </label>
        <PasswordInput id="password" minLength={8} autoComplete="new-password" />
      </div>
      <div>
        <label className="label" htmlFor="code">
          Maxfiy kod
        </label>
        <PasswordInput id="code" />
        <p className="mt-1.5 text-xs text-zinc-500">Saytni o'rnatgan administrator beradi.</p>
      </div>
      <ErrorText error={state?.error} />
      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? "Yaratilmoqda..." : "Hisob yaratish"}
      </button>
    </form>
  );
}
