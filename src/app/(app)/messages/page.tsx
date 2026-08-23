import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { getMe } from "@/lib/auth";

import { Avatar } from "@/components/Avatar";
import { apiFetch } from "@/lib/api";
import { MESSAGE_NOTIFICATION_TYPES } from "@/lib/notificationCategories";
import type { AuthMe, Conversation, Profile } from "@/lib/types";

import { markCategoryReadAction } from "../notifications/actions";

export const dynamic = "force-dynamic";

const formatRelativeTime = (value: string) => {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value));
};

export default async function MessagesPage() {
  const [me, conversations] = await Promise.all([
    getMe(),
    apiFetch<Conversation[]>("/chats"),
    markCategoryReadAction(MESSAGE_NOTIFICATION_TYPES)
  ]);

  const others = await Promise.all(
    conversations.map((c) => {
      const otherId = c.userAId === me.id ? c.userBId : c.userAId;
      return apiFetch<Profile>(`/profiles/${otherId}`).catch(() => null);
    })
  );

  const rows = conversations
    .map((c, i) => ({ conversation: c, other: others[i] }))
    .filter((row): row is { conversation: Conversation; other: Profile } => row.other !== null)
    .sort((a, b) => new Date(b.conversation.lastMessageAt).getTime() - new Date(a.conversation.lastMessageAt).getTime());

  return (
    <div className="max-w-160">
      <div className="glass mb-5 flex items-center gap-3.5 rounded-2xl px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary">
          <MessageSquare className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <h1 className="font-display text-lg font-bold text-text">Messages</h1>
          <p className="text-xs text-muted">{rows.length} conversations</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-sm font-semibold text-text">No conversations yet</p>
          <p className="mt-1 text-sm text-muted">Connect with someone to start chatting.</p>
        </div>
      ) : (
        <div className="glass overflow-hidden rounded-2xl">
          <div className="flex flex-col divide-y divide-border/60">
            {rows.map(({ conversation, other }) => {
              const lastMessage = conversation.messages?.[0];
              const isUnread = Boolean(lastMessage && lastMessage.senderId !== me.id && !lastMessage.readAt);
              return (
                <Link key={conversation.id} href={`/messages/${conversation.id}`} className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-muted-bg/60">
                  <Avatar id={other.id} name={other.fullName} avatarUrl={other.avatarUrl} size="h-11 w-11" />
                  <div className="min-w-0 flex-1">
                    <div className={`truncate text-sm text-text ${isUnread ? "font-bold" : "font-semibold"}`}>{other.fullName || "Unknown"}</div>
                    <div className={`truncate text-xs ${isUnread ? "font-semibold text-text" : "text-muted"}`}>{lastMessage ? lastMessage.content : "Say hello"}</div>
                  </div>
                  <span className="flex flex-shrink-0 flex-col items-end gap-1">
                    <span className="text-[10.5px] text-muted">{formatRelativeTime(conversation.lastMessageAt)}</span>
                    {isUnread ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
