import { cookies } from "next/headers";

const ACCESS_COOKIE = "orbit_token";
const REFRESH_COOKIE = "orbit_refresh";

type TokenPayload = {
  sub: string;
  email: string;
  role: string;
  exp: number;
};

/** Decodes (without verifying signature — the backend is the source of truth for
 * every authenticated call) the JWT payload just to read identity/exp for UI gating. */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = Buffer.from(payload, "base64").toString("utf8");
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
};

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge
});

export const setSessionTokens = async (accessToken: string, refreshToken: string) => {
  const store = await cookies();
  const payload = decodeToken(accessToken);
  const accessMaxAge = payload ? Math.max(payload.exp - Math.floor(Date.now() / 1000), 0) : 60 * 15;

  store.set(ACCESS_COOKIE, accessToken, cookieOptions(accessMaxAge));
  store.set(REFRESH_COOKIE, refreshToken, cookieOptions(60 * 60 * 24 * 30));
};

export const clearSessionTokens = async () => {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
};

export const getAccessToken = async () => {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
};

export const getRefreshToken = async () => {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value ?? null;
};

export const getSession = async () => {
  const token = await getAccessToken();
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload) return null;

  return { token, userId: payload.sub, email: payload.email, expired: payload.exp * 1000 < Date.now() };
};
