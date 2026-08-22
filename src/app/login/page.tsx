import { redirect } from "next/navigation";

import { AuthShell } from "@/components/AuthShell";
import { getSession } from "@/lib/session";

import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session && !session.expired) {
    redirect("/");
  }

  return (
    <AuthShell title="Sign in" subtitle="Pick up where you left off.">
      <LoginForm />
    </AuthShell>
  );
}
