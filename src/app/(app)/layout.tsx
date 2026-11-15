import { requireUser } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">{children}</main>
    </>
  );
}
