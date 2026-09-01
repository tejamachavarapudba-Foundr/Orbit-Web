"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type ThemeChoice = "light" | "dark";

export const setThemeAction = async (theme: ThemeChoice) => {
  const store = await cookies();
  store.set("orbit_theme", theme, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  revalidatePath("/", "layout");
};
