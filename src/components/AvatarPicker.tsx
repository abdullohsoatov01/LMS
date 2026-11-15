"use client";

import { useOptimistic, useTransition } from "react";
import { setAvatar } from "@/app/(app)/profile/actions";
import { AVATARS } from "@/lib/avatars";

export function AvatarPicker({ current }: { current: string }) {
  const [avatar, setOptimistic] = useOptimistic(current);
  const [, startTransition] = useTransition();

  function pick(a: string) {
    startTransition(async () => {
      setOptimistic(a);
      await setAvatar(a);
    });
  }

  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-12">
      {AVATARS.map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => pick(a)}
          className={`flex aspect-square items-center justify-center rounded-2xl text-3xl transition hover:scale-110 ${
            a === avatar ? "bg-violet-100 ring-4 ring-violet-400" : "bg-slate-50"
          }`}
        >
          {a}
        </button>
      ))}
    </div>
  );
}
