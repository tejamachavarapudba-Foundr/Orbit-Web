import { redirect } from "next/navigation";

import { AuthShell } from "@/components/AuthShell";
import { getSession } from "@/lib/session";

import { VerifyPhoneForm } from "./VerifyPhoneForm";

export default async function VerifyPhonePage() {
  // The opposite gate from register/page.tsx — this step only makes sense
  // once an account exists and you're signed in as it.
  const session = await getSession();
  if (!session || session.expired) {
    redirect("/register");
  }

  return (
    <AuthShell title="Verify your phone" subtitle="We'll text you a code to confirm your number.">
      <VerifyPhoneForm />
    </AuthShell>
  );
}
