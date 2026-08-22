"use client";

import Link from "next/link";
import { useActionState } from "react";

import { registerAction, type RegisterState } from "./actions";

const initialState: RegisterState = { error: null };

export const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Full name</span>
        <input
          type="text"
          name="fullName"
          required
          autoComplete="name"
          className="h-11 rounded-lg border border-border bg-surface px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Riya Sen"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          className="h-11 rounded-lg border border-border bg-surface px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="you@example.com"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Password</span>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="h-11 rounded-lg border border-border bg-surface px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="At least 8 characters"
        />
      </label>

      {state.error ? (
        <p role="alert" className="rounded-lg bg-danger-bg px-3 py-2 text-sm font-medium text-danger">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 h-11 rounded-lg bg-primary text-sm font-bold text-on-primary transition hover:brightness-105 disabled:opacity-60"
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
};
