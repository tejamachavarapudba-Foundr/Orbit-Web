"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Bookmark, Calendar, Globe2, PenSquare, Rocket, Settings as SettingsIcon, Shield, Users, Video } from "lucide-react";

import { logoutAction } from "@/app/(app)/actions";
import { CreatePostModal } from "@/components/CreatePostModal";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { Profile } from "@/lib/types";

const menuItems = [
  { href: "/network?tab=connections", match: "/network", label: "My network", Icon: Users, color: "from-sky-400 to-blue-500", badgeKey: "pending" as const },
  { href: "/meetings", match: "/meetings", label: "My meetings", Icon: Video, color: "from-cyan-400 to-sky-500" },
  { href: "/projects", match: "/projects", label: "My startups", Icon: Rocket, color: "from-orange-400 to-amber-500" },
  { href: "/communities", match: "/communities", label: "Community", Icon: Globe2, color: "from-emerald-400 to-teal-500" },
  { href: "/events", match: "/events", label: "Events", Icon: Calendar, color: "from-rose-400 to-pink-500" },
  { href: "/saved", match: "/saved", label: "Saved posts", Icon: Bookmark, color: "from-amber-400 to-orange-500" }
] as const;

type SidebarProps = {
  profile: Profile;
  isAdmin: boolean;
  pendingRequests: number;
  unreadNotifications: number;
  connectionsCount: number;
  followingCount: number;
};

const rowClass = (active: boolean) =>
  `flex items-center justify-between rounded-xl px-2.5 py-2 text-[13px] font-semibold transition ${
    active ? "bg-muted-bg/80 text-text" : "text-text hover:bg-muted-bg/70"
  }`;

const iconChipClass = (color: string) => `flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${color} text-white`;

export const Sidebar = ({ profile, isAdmin, pendingRequests, unreadNotifications, connectionsCount, followingCount }: SidebarProps) => {
  const pathname = usePathname();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const initial = (profile.fullName || "?").charAt(0).toUpperCase();

  return (
    <>
      <div className="glass w-64 flex-shrink-0 overflow-hidden rounded-2xl">
        <div className="h-10 bg-gradient-to-r from-primary via-indigo-400 to-purple-400" />
        <Link href="/profile" className="block px-3.5 pb-3 pt-0 hover:opacity-95">
          <div className="-mt-5 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-surface bg-gradient-to-br from-orange-400 to-rose-500 font-display text-sm font-bold text-white shadow-md shadow-rose-500/20">
            {initial}
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
            const active = pathname === match;
            const badge = "badgeKey" in rest && rest.badgeKey === "pending" ? pendingRequests : 0;
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

          <Link href="/notifications" className={rowClass(pathname === "/notifications")}>
            <span className="flex items-center gap-3">
              <span className={iconChipClass("from-red-400 to-rose-500")}>
                <Bell className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              Notifications
            </span>
            {unreadNotifications > 0 ? (
              <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">{unreadNotifications}</span>
            ) : null}
          </Link>

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

        <form action={logoutAction} className="border-t border-border/60 p-2">
          <button type="submit" className={`${rowClass(false)} w-full text-danger`}>
            Sign out
          </button>
        </form>
      </div>

      <CreatePostModal initial={initial} open={isComposerOpen} onClose={() => setIsComposerOpen(false)} />
    </>
  );
};
