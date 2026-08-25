"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { registerAction, sendPhoneOtpAction, verifyPhoneOtpAction } from "./actions";

type Step = "form" | "phone" | "otp";

const countryCodes = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "US/Canada (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+65", label: "Singapore (+65)" }
];

const inputClass =
  "h-11 rounded-xl border border-border/70 bg-muted-bg/50 px-3.5 text-sm text-text outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20";

export const RegisterForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [countryCode, setCountryCode] = useState("+91");
  const [localNumber, setLocalNumber] = useState("");
  const [code, setCode] = useState("");

  const finish = () => {
    router.push("/");
    router.refresh();
  };

  const handleCreateAccount = () => {
    setError(null);
    startTransition(async () => {
      const result = await registerAction({ fullName: fullName.trim(), email: email.trim(), password });
      if (result.error) {
        setError(result.error);
        return;
      }
      setStep("phone");
    });
  };

  const handleSendOtp = () => {
    const phoneNumber = `${countryCode}${localNumber.replace(/\D/g, "")}`;
    setError(null);
    startTransition(async () => {
      const result = await sendPhoneOtpAction(phoneNumber);
      if (result.error) {
        setError(result.error);
        return;
      }
      setStep("otp");
    });
  };

  const handleVerifyOtp = () => {
    setError(null);
    startTransition(async () => {
      const result = await verifyPhoneOtpAction(code.trim());
      if (result.error) {
        setError(result.error);
        return;
      }
      finish();
    });
  };

  if (step === "form") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateAccount();
        }}
        className="mt-6 flex flex-col gap-4"
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">Full name</span>
          <input
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
            placeholder="Riya Sen"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">Email</span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">Password</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="At least 8 characters"
          />
        </label>

        {error ? (
          <p role="alert" className="rounded-lg bg-danger-bg px-3 py-2 text-sm font-medium text-danger">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 h-11 rounded-full bg-gradient-to-r from-primary to-indigo-500 text-sm font-bold text-on-primary shadow-md shadow-primary/25 transition hover:brightness-105 disabled:opacity-60"
        >
          {isPending ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-muted">
          Already on Orbit?{" "}
          <Link href="/login" className="font-semibold text-primary">
            Sign in
          </Link>
        </p>
      </form>
    );
  }

  if (step === "phone") {
    return (
      <div className="mt-6 flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-bold text-text">Verify your phone</h2>
          <p className="mt-1 text-xs text-muted">We&apos;ll text you a code to confirm your number.</p>
        </div>

        <div className="flex gap-2">
          <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className={`${inputClass} w-32 flex-shrink-0`}>
            {countryCodes.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            type="tel"
            autoComplete="tel-national"
            value={localNumber}
            onChange={(e) => setLocalNumber(e.target.value)}
            className={`${inputClass} flex-1`}
            placeholder="98765 43210"
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-lg bg-danger-bg px-3 py-2 text-sm font-medium text-danger">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          disabled={isPending || !localNumber.trim()}
          onClick={handleSendOtp}
          className="h-11 rounded-full bg-gradient-to-r from-primary to-indigo-500 text-sm font-bold text-on-primary shadow-md shadow-primary/25 transition hover:brightness-105 disabled:opacity-60"
        >
          {isPending ? "Sending code..." : "Send code"}
        </button>

        <button type="button" onClick={finish} className="text-center text-sm font-semibold text-muted hover:text-text">
          Skip for now
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-bold text-text">Enter the code</h2>
        <p className="mt-1 text-xs text-muted">
          We sent a code to {countryCode}
          {localNumber}.
        </p>
      </div>

      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className={inputClass}
        placeholder="123456"
      />

      {error ? (
        <p role="alert" className="rounded-lg bg-danger-bg px-3 py-2 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={isPending || !code.trim()}
        onClick={handleVerifyOtp}
        className="h-11 rounded-full bg-gradient-to-r from-primary to-indigo-500 text-sm font-bold text-on-primary shadow-md shadow-primary/25 transition hover:brightness-105 disabled:opacity-60"
      >
        {isPending ? "Verifying..." : "Verify"}
      </button>

      <div className="flex items-center justify-between text-sm">
        <button type="button" onClick={handleSendOtp} disabled={isPending} className="font-semibold text-primary hover:underline disabled:opacity-60">
          Resend code
        </button>
        <button type="button" onClick={finish} className="font-semibold text-muted hover:text-text">
          Skip for now
        </button>
      </div>
    </div>
  );
};
