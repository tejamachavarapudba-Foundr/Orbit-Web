import * as Sentry from "@sentry/nextjs";

// Next.js loads this automatically on the client before the app renders —
// empty NEXT_PUBLIC_SENTRY_DSN disables the SDK rather than erroring, so
// this is safe to ship before a DSN exists.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
