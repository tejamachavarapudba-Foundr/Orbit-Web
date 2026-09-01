"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Calendar, Compass, Film, Globe2, PenSquare, Rocket, Settings as SettingsIcon, Shield, Star, Users, Video } from "lucide-react";

import { Avatar } from "@/components/Avatar";
import { CreatePostModal } from "@/components/CreatePostModal";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { Profile } from "@/lib/types";

const menuItems = [
  { href: "/discover", match: "/discover", label: "Discover", Icon: Compass, color: "from-violet-400 to-purple-500" },
  { href: "/pitch-videos", match: "/pitch-videos", label: "Pitch videos", Icon: Film, color: "from-fuchsia-400 to-pink-500" },
  { href: "/network?tab=connections", match: "/network", label: "My network", Icon: Users, color: "from-sky-400 to-blue-500", badgeKey: "pending" as const },
  { href: "/meetings", match: "/meetings", label: "My meetings", Icon: Video, color: "from-cyan-400 to-sky-500" },
  { href: "/watchlist", match: "/watchlist", label: "Investment Watchlist", Icon: Star, color: "from-yellow-400 to-amber-500", investorOnly: true as const },
  { href: "/projects", match: "/projects", label: "Projects", Icon: Rocket, color: "from-orange-400 to-amber-500", badgeKey: "projects" as const },
  { href: "/communities", match: "/communities", label: "Community", Icon: Globe2, color: "from-emerald-400 to-teal-500" },
  { href: "/events", match: "/events", label: "Events", Icon: Calendar, color: "from-rose-400 to-pink-500", badgeKey: "events" as const },
  { href: "/saved", match: "/saved", label: "Saved posts", Icon: Bookmark, color: "from-amber-400 to-orange-500" }
] as const;

type SidebarProps = {
  profile: Profile;
  isAdmin: boolean;
  isInvestor: boolean;
  pendingRequests: number;
  connectionsCount: number;
  followingCount: number;
  unreadProjects: number;
  unreadEvents: number;
};

const rowClass = (active: boolean) =>
  `flex items-center justify-between rounded-xl px-2.5 py-2 text-[13px] font-semibold transition ${
    active ? "bg-muted-bg/80 text-text" : "text-text hover:bg-muted-bg/70"
  }`;

const iconChipClass = (color: string) => `flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${color} text-white`;

export const Sidebar = ({
  profile,
  isAdmin,
  isInvestor,
  pendingRequests,
  connectionsCount,
  followingCount,
  unreadProjects,
  unreadEvents
}: SidebarProps) => {
  const pathname = usePathname();
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  return (
    <>
      <div className="glass w-64 flex-shrink-0 overflow-hidden rounded-2xl">
        <div className="h-10 bg-gradient-to-r from-primary via-indigo-400 to-purple-400" />
        <Link href="/profile" className="block px-3.5 pb-3 pt-0 hover:opacity-95">
          <div className="-mt-5">
            <Avatar
              id={profile.id}
              name={profile.fullName}
              avatarUrl={profile.avatarUrl}
              size="h-11 w-11"
              className="border-[3px] border-surface shadow-md shadow-primary/20"
            />
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="truncate font-display text-sm font-bold text-text">{profile.fullName || "Your name"}</span>
            {profile.identityVerified ? <VerifiedBadge size="sm" /> : null}
          </div>
          <p className="truncate text-[11.5px] text-muted">{profile.headline || "Add a headline"}</p>
          <p className="mt-1 text-[11px] font-semibold text-muted">
            <span className="text-text">{connectionsCount}</span> connections · <span className="text-text">{followingCount}</span> following
          </p>
        </Link>

        <div className="border-t border-border/60 p-2">
          <button
            type="button"
            onClick={() => setIsComposerOpen(true)}
            className={`${rowClass(false)} w-full text-primary`}
          >
            <span className="flex items-center gap-3">
              <span className={iconChipClass("from-primary to-indigo-500")}>
                <PenSquare className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              Create post
            </span>
          </button>

          {menuItems.map(({ href, match, label, Icon, color, ...rest }) => {
            if ("investorOnly" in rest && rest.investorOnly && !isInvestor) return null;
            // Prefix match, not exact — so a sub-page like /meetings/new or
            // /projects/new still keeps the parent section highlighted,
            // consistent with how /settings/* already behaved below.
            const active = pathname === match || pathname.startsWith(`${match}/`);
            const badgeKey = "badgeKey" in rest ? rest.badgeKey : undefined;
            const badge = badgeKey === "pending" ? pendingRequests : badgeKey === "projects" ? unreadProjects : badgeKey === "events" ? unreadEvents : 0;
            return (
              <Link key={href} href={href} className={rowClass(active)}>
                <span className="flex min-w-0 items-center gap-3">
                  <span className={iconChipClass(color)}>
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  {label}
                </span>
                {badge > 0 ? (
                  <span className="flex h-4.5 min-w-4.5 flex-shrink-0 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">{badge}</span>
                ) : null}
              </Link>
            );
          })}

          <Link href="/settings" className={rowClass(pathname.startsWith("/settings"))}>
            <span className="flex items-center gap-3">
              <span className={iconChipClass("from-slate-400 to-slate-600")}>
                <SettingsIcon className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              Settings
            </span>
          </Link>

          {isAdmin ? (
            <a href="https://orbit-admin-lilac.vercel.app" target="_blank" rel="noreferrer" className={rowClass(false)}>
              <span className="flex items-center gap-3">
                <span className={iconChipClass("from-indigo-500 to-slate-700")}>
                  <Shield className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
                Admin panel
              </span>
            </a>
          ) : null}
        </div>
      </div>

      <CreatePostModal
        authorId={profile.id}
        fullName={profile.fullName}
        avatarUrl={profile.avatarUrl}
        open={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
      />
    </>
  );
};
