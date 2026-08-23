import Link from "next/link";
import { Bell, Briefcase, Home, MessageSquare, Search, Users } from "lucide-react";

import { Avatar } from "@/components/Avatar";
import type { Profile } from "@/lib/types";

const tabs = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/network", label: "Network", Icon: Users },
  { href: "/jobs", label: "Jobs", Icon: Briefcase, badgeKey: "jobs" as const },
  { href: "/messages", label: "Messages", Icon: MessageSquare, badgeKey: "messages" as const }
] as const;

type TopNavProps = {
  profile: Profile;
  unreadNotifications?: number;
  unreadMessages?: number;
  unreadJobs?: number;
};

export const TopNav = ({ profile, unreadNotifications = 0, unreadMessages = 0, unreadJobs = 0 }: TopNavProps) => {
  return (
    <header className="glass sticky top-0 z-40 flex h-16 items-center gap-5 border-x-0 border-t-0 px-5">
      <Link href="/" className="flex flex-shrink-0 items-center gap-2 font-display text-lg font-bold text-text">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary shadow-md shadow-primary/30">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l2.9 6.6L22 9.6l-5 4.9 1.2 6.9L12 18l-6.2 3.4L7 14.5 2 9.6l7.1-1z" />
          </svg>
        </span>
        Orbit
      </Link>

      <form method="get" action="/search" className="relative max-w-105 flex-1">
        <button
          type="submit"
          aria-label="Search"
          className="absolute left-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:bg-muted-bg hover:text-text"
        >
          <Search className="h-4 w-4" strokeWidth={2} />
        </button>
        <input
          type="search"
          name="q"
          placeholder="Search founders, startups, roles..."
          className="h-10 w-full rounded-full border border-border/70 bg-muted-bg/70 pl-10 pr-3 text-[13.5px] text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
        />
      </form>

      <nav className="ml-auto flex items-center gap-1">
        {tabs.map(({ href, label, Icon, ...rest }) => {
          const badgeKey = "badgeKey" in rest ? rest.badgeKey : undefined;
          const badge = badgeKey === "messages" ? unreadMessages : badgeKey === "jobs" ? unreadJobs : 0;
          return (
            <Link
              key={href}
              href={href}
              className="flex w-16 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10.5px] font-semibold text-muted transition hover:bg-muted-bg/70 hover:text-text"
            >
              <span className="relative">
                <Icon className="h-5 w-5" strokeWidth={2} />
                {badge > 0 ? (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
                    {badge > 9 ? "9+" : badge}
                  </span>
                ) : null}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/notifications"
        aria-label="Notifications"
        className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-muted-bg/70 hover:text-text"
      >
        <Bell className="h-5 w-5" strokeWidth={2} />
        {unreadNotifications > 0 ? (
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-danger" />
        ) : null}
      </Link>

      <Link href="/profile" aria-label="Your profile" className="flex-shrink-0 rounded-full shadow-md shadow-primary/20">
        <Avatar id={profile.id} name={profile.fullName} avatarUrl={profile.avatarUrl} size="h-9 w-9" textSize="text-xs" />
      </Link>
    </header>
  );
};
