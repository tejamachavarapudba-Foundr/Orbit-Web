"use server";

import { redirect } from "next/navigation";

import { setSessionTokens } from "@/lib/session";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000/api";

export type RegisterState = { error: string | null };

export const registerAction = async (_prevState: RegisterState, formData: FormData): Promise<RegisterState> => {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || !password) {
    return { error: "Fill in your name, email and password." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password }),
    cache: "no-store"
  });

  if (!res.ok) {
    const text = await res.text();
    let message = "Couldn't create your account.";
    try {
      const parsed = JSON.parse(text);
      message = Array.isArray(parsed.message) ? parsed.message.join(", ") : parsed.message ?? message;
    } catch {
      // ignore — keep the generic message
    }
    return { error: message };
  }

  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  await setSessionTokens(data.accessToken, data.refreshToken);
  redirect("/");
};
