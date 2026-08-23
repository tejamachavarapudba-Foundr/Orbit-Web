import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getMe } from "@/lib/auth";

import { apiFetch, ApiError } from "@/lib/api";
import type { AuthMe, Conversation, Profile } from "@/lib/types";

import { MessageThread } from "./MessageThread";

export const dynamic = "force-dynamic";

const gradients = ["from-sky-400 to-indigo-500", "from-amber-400 to-red-500", "from-emerald-400 to-sky-500", "from-fuchsia-400 to-pink-500"];
const gradientFor = (seed: string) => gradients[seed.charCodeAt(0) % gradients.length];

type MessageDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MessageThreadPage({ params }: MessageDetailPageProps) {
  const { id } = await params;

  let conversation: Conversation;
  try {
    conversation = await apiFetch<Conversation>(`/chats/${id}`);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) notFound();
    throw error;
  }

  const me = await getMe();
  const otherId = conversation.userAId === me.id ? conversation.userBId : conversation.userAId;
  const other = await apiFetch<Profile>(`/profiles/${otherId}`);

  return (
    <div className="max-w-160">
      <div className="mb-3 flex items-center gap-3">
        <Link href="/messages" className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-muted hover:bg-muted-bg/70 hover:text-text">
          <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2} />
        </Link>
        <Link href={`/u/${other.id}`} className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br font-display text-xs font-bold text-white ${gradientFor(other.id)}`}>
            {(other.fullName || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold text-text">{other.fullName || "Unknown"}</div>
            <div className="text-xs text-muted">{other.headline}</div>
          </div>
        </Link>
      </div>

      <MessageThread conversationId={id} messages={conversation.messages} currentUserId={me.id} />
    </div>
  );
}
