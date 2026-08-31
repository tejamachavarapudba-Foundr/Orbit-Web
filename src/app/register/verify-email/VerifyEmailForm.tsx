"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { sendEmailOtpAction, verifyEmailOtpAction } from "../actions";

const inputClass =
  "h-11 rounded-xl border border-border/70 bg-muted-bg/50 px-3.5 text-sm text-text outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20";

const RESEND_COOLDOWN_SECONDS = 30;

export const VerifyEmailForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    const interval = setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  };

  const handleVerify = () => {
    setError(null);
    startTransition(async () => {
      const result = await verifyEmailOtpAction(code.trim());
      if (result.error) {
        setError(result.error);
        return;
      }
      // Verification is mandatory but the phone step after it is still
      // soft/skippable — same order register() puts a fresh signup through.
      router.push("/register/verify-phone");
      router.refresh();
    });
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setError(null);
    startTransition(async () => {
      const result = await sendEmailOtpAction();
      if (result.error) {
        setError(result.error);
        return;
      }
      setCode("");
      setInfo("New code sent — check your email.");
      startCooldown();
    });
  };

  return (
    <div className="mt-6 flex flex-col gap-4">
      {info ? <p className="text-xs text-muted">{info}</p> : null}

      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className={inputClass}
        placeholder="123456"
        autoFocus
      />

      {error ? (
        <p role="alert" className="rounded-lg bg-danger-bg px-3 py-2 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={isPending || code.trim().length !== 6}
        onClick={handleVerify}
        className="h-11 rounded-full bg-gradient-to-r from-primary to-indigo-500 text-sm font-bold text-on-primary shadow-md shadow-primary/25 transition hover:brightness-105 disabled:opacity-60"
      >
        {isPending ? "Verifying..." : "Verify"}
      </button>

      <button
        type="button"
        onClick={handleResend}
        disabled={isPending || cooldown > 0}
        className="text-center text-sm font-semibold text-primary hover:underline disabled:opacity-60"
      >
        {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
      </button>
    </div>
  );
};
