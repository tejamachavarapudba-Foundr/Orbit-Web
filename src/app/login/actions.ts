"use server";

import { redirect } from "next/navigation";

import { setSessionTokens } from "@/lib/session";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000/api";

export type LoginState = { error: string | null };

export const loginAction = async (_prevState: LoginState, formData: FormData): Promise<LoginState> => {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store"
  });

  if (!res.ok) {
    return { error: res.status === 401 ? "Incorrect email or password." : "Couldn't sign in — try again." };
  }

  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  await setSessionTokens(data.accessToken, data.refreshToken);
  redirect("/");
};
