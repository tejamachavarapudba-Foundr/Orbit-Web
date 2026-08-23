"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Bookmark, Calendar, Compass, Globe2, PenSquare, Rocket, Settings as SettingsIcon, Shield, Users } from "lucide-react";

import { logoutAction } from "@/app/(app)/actions";
import { CreatePostModal } from "@/components/CreatePostModal";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { Profile } from "@/lib/types";

const menuItems = [
  { href: "/network?tab=discover", match: "/network", label: "Discover", Icon: Compass, color: "from-violet-400 to-purple-500" },
  { href: "/network?tab=connections", match: "/network", label: "My network", Icon: Users, color: "from-sky-400 to-blue-500", badgeKey: "pending" as const },
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

export const Sidebar = ({ profile, isAdmin, pendingRequests, unreadNotifications, connectionsCount, followingCount }: SidebarProps) => {
  const pathname = usePathname();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const initial = (profile.fullName || "?").charAt(0).toUpperCase();
  const completion = profile.profileCompletion ?? 0;

  return (
    <>
      <div className="flex w-64 flex-shrink-0 flex-col gap-3.5">
        <div className="glass overflow-hidden rounded-2xl">
          <div className="h-14 bg-gradient-to-r from-primary via-indigo-400 to-purple-400" />
          <Link href="/profile" className="block px-4 pb-3.5 hover:opacity-95">
            <div className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-surface bg-gradient-to-br from-orange-400 to-rose-500 font-display text-lg font-bold text-white shadow-md shadow-rose-500/20">
              {initial}
            </div>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="truncate font-display text-[15px] font-bold text-text">{profile.fullName || "Your name"}</span>
              {profile.identityVerified ? <VerifiedBadge /> : null}
            </div>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted">{profile.headline || "Add a headline to your profile"}</p>
          </Link>
          <div className="flex border-t border-border/60">
            <Link href="/network?tab=connections" className="flex flex-1 flex-col items-center gap-0.5 py-2.5 hover:bg-muted-bg/60">
              <span className="font-display text-sm font-bold text-text">{connectionsCount}</span>
              <span className="text-[10.5px] font-semibold text-muted">Connections</span>
            </Link>
            <div className="w-px bg-border/60" />
            <Link href="/network?tab=following" className="flex flex-1 flex-col items-center gap-0.5 py-2.5 hover:bg-muted-bg/60">
              <span className="font-display text-sm font-bold text-text">{followingCount}</span>
              <span className="text-[10.5px] font-semibold text-muted">Following</span>
            </Link>
          </div>
          <div className="border-t border-border/60 px-4 py-3">
            <div className="mb-1.5 flex justify-between text-[11px] font-semibold">
              <span className="text-text">Profile strength</span>
              <span className="text-muted">{completion}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted-bg/80">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-400" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsComposerOpen(true)}
          className="glass flex items-center gap-2.5 rounded-2xl px-4 py-3 text-left text-[13.5px] font-bold text-primary transition hover:bg-primary-muted/50"
        >
          <PenSquare className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
          Create post
        </button>

        <nav className="glass flex flex-col gap-0.5 rounded-2xl p-2">
          {menuItems.map(({ href, match, label, Icon, color, ...rest }) => {
            const active = pathname === match;
            const badge = "badgeKey" in rest && rest.badgeKey === "pending" ? pendingRequests : 0;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between rounded-xl px-2.5 py-2.5 text-[13.5px] font-semibold transition ${
                  active ? "bg-muted-bg/80 text-text" : "text-text hover:bg-muted-bg/70"
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${color} text-white`}>
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  {label}
                </span>
                {badge > 0 ? (
                  <span className="flex h-4.5 min-w-4.5 flex-shrink-0 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">{badge}</span>
                ) : null}
              </Link>
            );
          })}

          <div className="my-1 border-t border-border/60" />

          <Link
            href="/notifications"
            className={`flex items-center justify-between rounded-xl px-2.5 py-2.5 text-[13.5px] font-semibold transition ${pathname === "/notifications" ? "bg-muted-bg/80 text-text" : "text-text hover:bg-muted-bg/70"}`}
          >
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-400 to-rose-500 text-white">
                <Bell className="h-4 w-4" strokeWidth={2} />
              </span>
              Notifications
            </span>
            {unreadNotifications > 0 ? (
              <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">{unreadNotifications}</span>
            ) : null}
          </Link>

          <Link
            href="/settings"
            className={`flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[13.5px] font-semibold transition ${pathname.startsWith("/settings") ? "bg-muted-bg/80 text-text" : "text-text hover:bg-muted-bg/70"}`}
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 text-white">
              <SettingsIcon className="h-4 w-4" strokeWidth={2} />
            </span>
            Settings
          </Link>

          {isAdmin ? (
            <a
              href="https://orbit-admin-lilac.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[13.5px] font-semibold text-text transition hover:bg-muted-bg/70"
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-slate-700 text-white">
                <Shield className="h-4 w-4" strokeWidth={2} />
              </span>
              Admin panel
            </a>
          ) : null}
        </nav>

        <form action={logoutAction}>
          <button
            type="submit"
            className="glass w-full rounded-2xl px-4 py-3 text-left text-[13.5px] font-bold text-danger transition hover:bg-danger-bg/50"
          >
            Sign out
          </button>
        </form>
      </div>

      <CreatePostModal initial={initial} open={isComposerOpen} onClose={() => setIsComposerOpen(false)} />
    </>
  );
};
