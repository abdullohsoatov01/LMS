"use client";

import { useActionState } from "react";
import { login, registerTeacher } from "@/app/login/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-4">
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
        <input id="password" name="password" type="password" className="input" autoComplete="current-password" required />
      </div>
      {state?.error && <p className="animate-shake rounded-xl bg-rose-50 px-4 py-2 font-bold text-rose-600">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? "Kirilmoqda..." : "Kirish 🚀"}
      </button>
    </form>
  );
}

export function TeacherSignupForm() {
  const [state, action, pending] = useActionState(registerTeacher, undefined);
  return (
    <form action={action} className="space-y-4">
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
        <input id="password" name="password" type="password" className="input" minLength={8} required />
      </div>
      <div>
        <label className="label" htmlFor="code">
          Maxfiy kod
        </label>
        <input id="code" name="code" type="password" className="input" required />
        <p className="mt-1 text-xs font-semibold text-slate-400">Saytni o'rnatgan administrator beradi.</p>
      </div>
      {state?.error && <p className="animate-shake rounded-xl bg-rose-50 px-4 py-2 font-bold text-rose-600">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? "Yaratilmoqda..." : "O'qituvchi hisobini yaratish"}
      </button>
    </form>
  );
}
