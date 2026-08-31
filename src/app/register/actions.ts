"use server";

import { redirect } from "next/navigation";

import { apiFetch, ApiError } from "@/lib/api";
import { getSession, setSessionTokens } from "@/lib/session";
import { PASSWORD_REQUIREMENTS_MESSAGE, isStrongPassword } from "@/lib/validation";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000/api";

export type RegisterState = { error: string | null };

export const registerAction = async (_prevState: RegisterState, formData: FormData): Promise<RegisterState> => {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || !password) {
    return { error: "Fill in your name, email and password." };
  }
  if (!isStrongPassword(password)) {
    return { error: PASSWORD_REQUIREMENTS_MESSAGE };
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
  // A plain redirect() here (not client-side navigation) is what actually
  // works: Server Actions trigger an implicit revalidation of the current
  // route after they run, and register/page.tsx's own "redirect away if
  // already authenticated" gate would otherwise fire the instant these
  // cookies land, yanking the user back to / before any client-side step
  // state (e.g. "now show the phone step") ever gets a chance to matter.
  // Email verification is mandatory (see (app)/layout.tsx's hard gate) and
  // register() on the backend already emailed the code, so that's the first
  // stop; the soft, skippable phone step comes after.
  redirect("/register/verify-email");
};

export type ActionResult = { error: string | null };

/** Email verification is a hard gate — (app)/layout.tsx redirects any
 * signed-in account with emailVerified=false back to /register/verify-email
 * on every request, with no skip. Both endpoints are @Public() on the
 * backend (no auth header required) and identify the account by email, so
 * the email comes from the session's decoded JWT rather than a form field —
 * nothing for the client to tamper with or need to re-enter. */
export const sendEmailOtpAction = async (): Promise<ActionResult> => {
  const session = await getSession();
  if (!session) return { error: "You're not signed in." };

  try {
    await apiFetch("/auth/resend-verification", { method: "POST", body: { email: session.email } });
    return { error: null };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't send that code — try again." };
  }
};

export const verifyEmailOtpAction = async (code: string): Promise<ActionResult> => {
  const session = await getSession();
  if (!session) return { error: "You're not signed in." };

  try {
    await apiFetch("/auth/verify-email-otp", { method: "POST", body: { email: session.email, code } });
    return { error: null };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "That code is incorrect — try again." };
  }
};

/** Phone verification is a soft gate — the account already exists and is
 * usable either way, so a "not configured yet" response from a not-yet-set-up
 * Twilio integration surfaces as a normal error here rather than blocking
 * signup. Email verification above is the hard gate. */
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
