"use server";

import { apiFetch, ApiError } from "@/lib/api";
import { setSessionTokens } from "@/lib/session";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000/api";

export type ActionResult = { error: string | null };

export const registerAction = async (payload: { fullName: string; email: string; password: string }): Promise<ActionResult> => {
  const { fullName, email, password } = payload;

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
  // Session cookies are set here (not redirected yet) so the phone-verification
  // step that follows can call the now-authenticated /auth/phone/* endpoints.
  await setSessionTokens(data.accessToken, data.refreshToken);
  return { error: null };
};

/** Phone verification is a soft gate (same philosophy as email verification
 * elsewhere in this app) — the account already exists and is usable either
 * way, so a "not configured yet" response from a not-yet-set-up Twilio
 * integration surfaces as a normal error here rather than blocking signup. */
export const sendPhoneOtpAction = async (phoneNumber: string): Promise<ActionResult> => {
  try {
    await apiFetch("/auth/phone/send-otp", { method: "POST", body: { phoneNumber } });
    return { error: null };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't send that code — try again." };
  }
};

export const verifyPhoneOtpAction = async (code: string): Promise<ActionResult> => {
  try {
    await apiFetch("/auth/phone/verify-otp", { method: "POST", body: { code } });
    return { error: null };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "That code is incorrect — try again." };
  }
};
