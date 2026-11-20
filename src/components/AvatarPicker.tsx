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
          className={`flex aspect-square items-center justify-center rounded-lg border text-2xl transition hover:bg-zinc-50 ${
            a === avatar ? "border-primary bg-primary-soft ring-2 ring-primary-ring" : "border-zinc-200 bg-surface"
          }`}
        >
          {a}
        </button>
      ))}
    </div>
  );
}
