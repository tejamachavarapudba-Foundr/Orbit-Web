import { Bell, Briefcase, CheckCheck, MessageCircle, UserPlus, Users } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { AppNotification } from "@/lib/types";

import { markAllReadAction, markOneReadAction } from "./actions";

export const dynamic = "force-dynamic";

const iconFor = (type: string) => {
  if (type === "NEW_MESSAGE") return MessageCircle;
  if (type === "JOB_ALERT" || type === "APPLICATION_STATUS") return Briefcase;
  if (type === "CONNECTION_REQUEST" || type === "CONNECTION_ACCEPTED") return UserPlus;
  if (type === "FOLLOW") return Users;
  return Bell;
};

const formatRelativeTime = (value: string) => {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value));
};

export default async function NotificationsPage() {
  const notifications = await apiFetch<AppNotification[]>("/notifications");
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-160">
      <div className="glass mb-4 flex items-center gap-3.5 rounded-2xl px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-rose-500 text-on-primary">
          <Bell className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-lg font-bold text-text">Notifications</h1>
          <p className="text-xs text-muted">{unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}</p>
        </div>
        {unreadCount > 0 ? (
          <form action={markAllReadAction}>
            <button type="submit" className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-border/70 px-3.5 py-2 text-xs font-bold text-text hover:bg-muted-bg/70">
              <CheckCheck className="h-3.5 w-3.5" strokeWidth={2} />
              Read all
            </button>
          </form>
        ) : null}
      </div>

      {notifications.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-sm font-semibold text-text">No notifications yet</p>
          <p className="mt-1 text-sm text-muted">Activity on your posts, connections and applications will show up here.</p>
        </div>
      ) : (
        <div className="glass overflow-hidden rounded-2xl">
          <div className="flex flex-col divide-y divide-border/60">
            {notifications.map((n) => {
              const Icon = iconFor(n.type);
              const row = (
                <>
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-muted-bg text-muted">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-text">{n.title}</div>
                    <div className="mt-0.5 text-xs text-muted">{n.message}</div>
                    <div className="mt-1 text-[10.5px] text-muted">{formatRelativeTime(n.createdAt)}</div>
                  </div>
                  {!n.isRead ? <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" /> : null}
                </>
              );

              if (n.isRead) {
                return (
                  <div key={n.id} className="flex gap-3 px-4 py-3.5">
                    {row}
                  </div>
                );
              }

              return (
                <form key={n.id} action={markOneReadAction.bind(null, n.id)}>
                  <button type="submit" className="flex w-full gap-3 bg-primary-muted/30 px-4 py-3.5 text-left transition hover:bg-primary-muted/50">
                    {row}
                  </button>
                </form>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
