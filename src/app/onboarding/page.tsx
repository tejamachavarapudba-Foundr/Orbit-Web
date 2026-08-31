import { redirect } from "next/navigation";
import { getMe } from "@/lib/auth";

import { apiFetch } from "@/lib/api";
import { getSession } from "@/lib/session";
import type { AuthMe } from "@/lib/types";

import { OnboardingWizard } from "./OnboardingWizard";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session || session.expired) {
    redirect("/login");
  }

  const me = await getMe();
  // Same hard gate as (app)/layout.tsx — onboarding sits outside that route
  // group's layout, so it needs its own check rather than inheriting one.
  if (!me.emailVerified) {
    redirect("/register/verify-email");
  }

  if (me.profile.onboardingCompleted) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <OnboardingWizard fullName={me.profile.fullName} />
    </main>
  );
}
