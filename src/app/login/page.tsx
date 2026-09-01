import { redirect } from "next/navigation";

import { AuthShell } from "@/components/AuthShell";
import { apiFetch, ApiError } from "@/lib/api";
import { getSession } from "@/lib/session";

import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session && !session.expired) {
    // A JWT can look locally valid (unexpired exp claim) for an account
    // that no longer exists server-side — allowAnonymous skips apiFetch's
    // own auto-redirect-on-401 (which would otherwise send us right back
    // to /login, right where we already are, since a Server Component
    // can't clear the stale cookie mid-render — an infinite redirect loop,
    // reproduced live). Only redirect away from the login page once the
    // account is confirmed to actually still exist.
    try {
      await apiFetch("/auth/me", { allowAnonymous: true });
      redirect("/");
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;
    }
  }

  return (
    <AuthShell title="Sign in" subtitle="Pick up where you left off.">
      <LoginForm />
    </AuthShell>
  );
}
