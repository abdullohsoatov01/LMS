export function SetupNeeded() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-10">
      <div className="card p-6">
        <h1 className="text-xl font-semibold text-zinc-900">Sayt hali sozlanmagan</h1>
        <p className="mt-2 text-[15px] text-zinc-600">
          Supabase kalitlari topilmadi. <code className="rounded bg-zinc-100 px-1">.env.local</code> faylini yarating
          (namuna: <code className="rounded bg-zinc-100 px-1">.env.example</code>) yoki Vercel sozlamalarida muhit
          o'zgaruvchilarini qo'shing. Batafsil yo'riqnoma — <b>README.md</b> faylida.
        </p>
      </div>
    </main>
  );
}
