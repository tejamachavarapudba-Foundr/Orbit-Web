import * as Sentry from "@sentry/nextjs";

// Next.js calls register() once at server startup — separate init per
// runtime since edge (middleware) and node (route handlers/server
// components) use different Sentry entry points. Empty
// NEXT_PUBLIC_SENTRY_DSN disables the SDK rather than erroring, so this is
// safe to ship before a DSN exists.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" || process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.2,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
