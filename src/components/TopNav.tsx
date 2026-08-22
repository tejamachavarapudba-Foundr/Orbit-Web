import Link from "next/link";

import { logoutAction } from "@/app/(app)/actions";
import type { Profile } from "@/lib/types";

const tabs = [
  { href: "/", label: "Home", icon: "M3 11l9-8 9 8M5 10v10h14V10" },
  { href: "/network", label: "Network", icon: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
  { href: "/jobs", label: "Jobs", icon: "M2 7h20v14H2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" },
  { href: "/messages", label: "Messages", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }
] as const;

type TopNavProps = {
  profile: Profile;
};

export const TopNav = ({ profile }: TopNavProps) => {
  const initial = (profile.fullName || "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-15 items-center gap-5 border-b border-border bg-surface/90 px-5 backdrop-blur">
      <Link href="/" className="flex flex-shrink-0 items-center gap-2 font-display text-lg font-bold text-text">
        <span className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-primary text-on-primary">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l2.9 6.6L22 9.6l-5 4.9 1.2 6.9L12 18l-6.2 3.4L7 14.5 2 9.6l7.1-1z" />
          </svg>
        </span>
        Orbit
      </Link>

      <div className="relative max-w-105 flex-1">
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="search"
          placeholder="Search founders, startups, roles..."
          className="h-9.5 w-full rounded-lg border border-border bg-muted-bg pl-9 pr-3 text-[13.5px] text-text outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
        />
      </div>

      <nav className="ml-auto flex items-center gap-1">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex w-16 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10.5px] font-semibold text-muted hover:bg-muted-bg hover:text-text"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={tab.icon} />
            </svg>
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="group relative flex-shrink-0">
        <button
          type="button"
          className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 font-display text-xs font-bold text-white"
        >
          {initial}
        </button>
        <div className="invisible absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-surface py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
          <div className="border-b border-border px-4 pb-2.5">
            <div className="truncate text-sm font-bold text-text">{profile.fullName || "Your account"}</div>
            <div className="truncate text-xs text-muted">{profile.headline}</div>
          </div>
          <Link href={`/u/${profile.id}`} className="block px-4 py-2 text-sm font-semibold text-text hover:bg-muted-bg">
            View profile
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="w-full px-4 py-2 text-left text-sm font-semibold text-danger hover:bg-danger-bg">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};
