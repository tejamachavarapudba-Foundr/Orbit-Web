import { redirect } from "next/navigation";

import { AuthShell } from "@/components/AuthShell";
import { getSession } from "@/lib/session";

import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
  const session = await getSession();
  if (session && !session.expired) {
    redirect("/");
  }

  return (
    <AuthShell title="Create your account" subtitle="Join founders, investors and builders on Orbit.">
      <RegisterForm />
    </AuthShell>
  );
}
