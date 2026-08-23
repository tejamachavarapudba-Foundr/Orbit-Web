import { cookies } from "next/headers";
import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"]
});

export const metadata: Metadata = {
  title: "Orbit",
  description: "Where founders, investors and builders find each other."
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const store = await cookies();
  const theme = store.get("orbit_theme")?.value;
  const themeAttr = theme === "light" || theme === "dark" ? theme : undefined;

  return (
    <html lang="en" className={`${manrope.variable} ${sora.variable} h-full antialiased`} data-theme={themeAttr}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
