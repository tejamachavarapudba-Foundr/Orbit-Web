import { redirect } from "next/navigation";

import { TopNav } from "@/components/TopNav";
import { apiFetch } from "@/lib/api";
import { getSession } from "@/lib/session";
import type { AuthMe } from "@/lib/types";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.expired) {
    redirect("/login");
  }

  const me = await apiFetch<AuthMe>("/auth/me");

  return (
    <div className="min-h-screen bg-background">
      <TopNav profile={me.profile} />
      {children}
    </div>
  );
}
