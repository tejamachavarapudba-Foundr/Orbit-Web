import { redirect } from "next/navigation";

import { clearSessionTokens, getAccessToken, getRefreshToken, setSessionTokens } from "@/lib/session";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000/api";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store"
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  await setSessionTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
};

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: unknown;
  /** Send `body` as multipart/form-data instead of JSON. */
  formData?: FormData;
  allowAnonymous?: boolean;
};

/** Server-only fetch wrapper: attaches the signed-in user's access token,
 * transparently refreshes it on a 401 and retries once, and redirects to
 * /login if the session can't be recovered. The token lives in an httpOnly
 * cookie and is never exposed to the browser. */
export const apiFetch = async <T>(path: string, options: ApiFetchOptions = {}): Promise<T> => {
  let token = await getAccessToken();

  const run = async (accessToken: string | null) =>
    fetch(`${BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        ...(options.formData ? {} : { "Content-Type": "application/json" }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      },
      body: options.formData ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined),
      cache: "no-store"
    });

  let res = await run(token);

  if (res.status === 401 && !options.allowAnonymous) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      await clearSessionTokens();
      redirect("/login");
    }
    token = refreshed;
    res = await run(token);
  }

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      message = JSON.parse(text).message ?? text;
    } catch {
      // response wasn't JSON — use the raw text
    }
    throw new ApiError(res.status, Array.isArray(message) ? message.join(", ") : message || `Request failed (${res.status})`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
};
