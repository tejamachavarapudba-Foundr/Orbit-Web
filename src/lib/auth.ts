import { cache } from "react";

import { apiFetch } from "@/lib/api";
import type { AuthMe } from "@/lib/types";

/** The layout and most pages each need the current user — cache() dedupes
 * repeated calls to a single network request per server render pass instead
 * of every page re-fetching /auth/me on top of what the layout already did. */
export const getMe = cache((): Promise<AuthMe> => apiFetch<AuthMe>("/auth/me"));
