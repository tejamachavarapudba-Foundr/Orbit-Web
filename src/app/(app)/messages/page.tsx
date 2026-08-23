import Link from "next/link";
import { MessageSquare } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { AuthMe, Conversation, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

const gradients = ["from-sky-400 to-indigo-500", "from-amber-400 to-red-500", "from-emerald-400 to-sky-500", "from-fuchsia-400 to-pink-500"];
const gradientFor = (seed: string) => gradients[seed.charCodeAt(0) % gradients.length];

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
  const me = await apiFetch<AuthMe>("/auth/me");
  const conversations = await apiFetch<Conversation[]>("/chats");

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
    <div className="mx-auto max-w-160 px-5 py-5">
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
              return (
                <Link key={conversation.id} href={`/messages/${conversation.id}`} className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-muted-bg/60">
                  <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display text-sm font-bold text-white ${gradientFor(other.id)}`}>
                    {(other.fullName || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-text">{other.fullName || "Unknown"}</div>
                    <div className="truncate text-xs text-muted">{lastMessage ? lastMessage.content : "Say hello"}</div>
                  </div>
                  <span className="flex-shrink-0 text-[10.5px] text-muted">{formatRelativeTime(conversation.lastMessageAt)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
