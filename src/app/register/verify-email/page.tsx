import { redirect } from "next/navigation";

import { AuthShell } from "@/components/AuthShell";
import { getSession } from "@/lib/session";

import { VerifyEmailForm } from "./VerifyEmailForm";

export default async function VerifyEmailPage() {
  // Same gate as verify-phone — this only makes sense once an account
  // exists and you're signed in as it. Unlike verify-phone, there is no
  // "already verified, redirect away" check here: (app)/layout.tsx already
  // won't let a verified user land back on this page in the first place,
  // and there's no harm in a verified user seeing it if they navigate here
  // directly.
  const session = await getSession();
  if (!session || session.expired) {
    redirect("/register");
  }

  return (
    <AuthShell title="Confirm your email" subtitle={`We sent a code to ${session.email}.`}>
      <VerifyEmailForm />
    </AuthShell>
  );
}
