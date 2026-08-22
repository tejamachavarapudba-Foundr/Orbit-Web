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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${sora.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
