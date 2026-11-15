export function SetupNeeded() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-10">
      <div className="card p-8">
        <div className="mb-3 text-5xl">🛠️</div>
        <h1 className="text-2xl font-black text-slate-900">Sayt hali sozlanmagan</h1>
        <p className="mt-3 text-slate-600">
          Supabase kalitlari topilmadi. <code className="rounded bg-slate-100 px-1">.env.local</code> faylini yarating
          (namuna: <code className="rounded bg-slate-100 px-1">.env.example</code>) yoki Vercel sozlamalarida muhit
          o'zgaruvchilarini qo'shing. Batafsil yo'riqnoma — <b>README.md</b> faylida.
        </p>
      </div>
    </main>
  );
}
