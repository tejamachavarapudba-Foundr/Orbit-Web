import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  /* config options here */
};

// Safe without SENTRY_AUTH_TOKEN/SENTRY_ORG/SENTRY_PROJECT set — source map
// upload is simply skipped (with a build-time warning) until those exist.
export default withSentryConfig(nextConfig, {
  silent: true,
});
