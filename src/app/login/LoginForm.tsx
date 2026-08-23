"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          className="h-11 rounded-xl border border-border/70 bg-muted-bg/50 px-3.5 text-sm text-text outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20"
          placeholder="you@example.com"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Password</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="h-11 rounded-xl border border-border/70 bg-muted-bg/50 px-3.5 text-sm text-text outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20"
          placeholder="••••••••"
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
        className="mt-2 h-11 rounded-full bg-gradient-to-r from-primary to-indigo-500 text-sm font-bold text-on-primary shadow-md shadow-primary/25 transition hover:brightness-105 disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-sm text-muted">
        New to Orbit?{" "}
        <Link href="/register" className="font-semibold text-primary">
          Create an account
        </Link>
      </p>
    </form>
  );
};
