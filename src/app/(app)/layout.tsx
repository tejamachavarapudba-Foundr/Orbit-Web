import { redirect } from "next/navigation";

import { TopNav } from "@/components/TopNav";
import { ApiError, apiFetch } from "@/lib/api";
import { clearSessionTokens, getSession } from "@/lib/session";
import type { AuthMe } from "@/lib/types";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.expired) {
    redirect("/login");
  }

  // A cookie can look structurally valid (unexpired JWT) while the account it
  // points to no longer exists or was revoked — treat any failure to load the
  // current user as "not really signed in" rather than letting it surface as
  // an uncaught server error.
  let me: AuthMe;
  try {
    me = await apiFetch<AuthMe>("/auth/me");
  } catch (error) {
    if (error instanceof ApiError) {
      await clearSessionTokens();
      redirect("/login");
    }
    throw error;
  }

  if (!me.profile.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav profile={me.profile} />
      {children}
    </div>
  );
}
