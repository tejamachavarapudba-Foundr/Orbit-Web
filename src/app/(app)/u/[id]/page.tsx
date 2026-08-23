import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, ExternalLink, Globe, MapPin, MessageCircle, UserCheck, UserPlus, Users } from "lucide-react";

import { PostCard } from "@/components/PostCard";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { apiFetch, ApiError } from "@/lib/api";
import type { AuthMe, ConnectionStatus, Post, Profile } from "@/lib/types";

import { acceptRequestAction, cancelRequestAction, connectAction, declineRequestAction, messageAction } from "./actions";

export const dynamic = "force-dynamic";

const gradients = ["from-sky-400 to-indigo-500", "from-amber-400 to-red-500", "from-emerald-400 to-sky-500", "from-fuchsia-400 to-pink-500"];
const gradientFor = (seed: string) => gradients[seed.charCodeAt(0) % gradients.length];

type ProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;

  let profile: Profile;
  try {
    profile = await apiFetch<Profile>(`/profiles/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const [me, status, connectionCount, allPosts, savedPosts] = await Promise.all([
    apiFetch<AuthMe>("/auth/me"),
    apiFetch<ConnectionStatus>(`/connections/status/${id}`),
    apiFetch<{ count: number }>(`/connections/count/${id}`),
    apiFetch<Post[]>("/posts"),
    apiFetch<Post[]>("/posts/saved").catch(() => [] as Post[])
  ]);

  const posts = allPosts.filter((post) => post.author.id === id);
  const savedIds = new Set(savedPosts.map((post) => post.id));
  const initial = (profile.fullName || "?").charAt(0).toUpperCase();
  const myInitial = (me.profile.fullName || "?").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-160 px-5 py-5">
      <div className="glass overflow-hidden rounded-2xl">
        <div className="h-24 bg-gradient-to-r from-primary/80 via-indigo-400/70 to-purple-400/70" />
        <div className="-mt-9 px-5 pb-5">
          <div
            className={`flex h-18 w-18 items-center justify-center rounded-full border-[3px] border-surface bg-gradient-to-br font-display text-2xl font-bold text-white ${gradientFor(profile.id)}`}
          >
            {initial}
          </div>

          <div className="mt-3 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="truncate font-display text-lg font-bold text-text">{profile.fullName || "Unnamed"}</h1>
                {profile.identityVerified ? <VerifiedBadge /> : null}
              </div>
              <p className="mt-0.5 text-sm text-muted">{profile.headline || "No headline yet"}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                {profile.location ? (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" strokeWidth={2} />
                    {profile.location}
                  </span>
                ) : null}
                {profile.company ? (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" strokeWidth={2} />
                    {profile.company}
                  </span>
                ) : null}
                <Link href={`/network?tab=connections`} className="flex items-center gap-1 font-semibold text-primary">
                  <Users className="h-3 w-3" strokeWidth={2} />
                  {connectionCount.count} connections
                </Link>
              </div>
            </div>

            {status.status === "self" ? null : (
              <div className="flex flex-shrink-0 gap-2">
                {status.status === "connected" ? (
                  <form action={messageAction.bind(null, id)}>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-xs font-bold text-on-primary shadow-md shadow-primary/25"
                    >
                      <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
                      Message
                    </button>
                  </form>
                ) : status.status === "incoming_pending" && status.requestId ? (
                  <>
                    <form action={acceptRequestAction.bind(null, status.requestId, id)}>
                      <button type="submit" className="rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-xs font-bold text-on-primary shadow-md shadow-primary/25">
                        Accept
                      </button>
                    </form>
                    <form action={declineRequestAction.bind(null, status.requestId, id)}>
                      <button type="submit" className="rounded-full border border-border/70 px-4 py-2 text-xs font-bold text-text hover:bg-muted-bg/70">
                        Decline
                      </button>
                    </form>
                  </>
                ) : status.status === "outgoing_pending" && status.requestId ? (
                  <form action={cancelRequestAction.bind(null, status.requestId, id)}>
                    <button type="submit" className="flex items-center gap-1.5 rounded-full border border-border/70 px-4 py-2 text-xs font-bold text-text hover:bg-muted-bg/70">
                      <UserCheck className="h-3.5 w-3.5" strokeWidth={2} />
                      Request sent
                    </button>
                  </form>
                ) : (
                  <form action={connectAction.bind(null, id)}>
                    <button type="submit" className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-xs font-bold text-on-primary shadow-md shadow-primary/25">
                      <UserPlus className="h-3.5 w-3.5" strokeWidth={2} />
                      Connect
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {profile.bio ? <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-text">{profile.bio}</p> : null}

          {profile.skills && profile.skills.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-primary-muted px-2.5 py-1 text-[11px] font-bold text-primary">
                  {skill}
                </span>
              ))}
            </div>
          ) : null}

          {profile.website || profile.linkedinUrl ? (
            <div className="mt-4 flex flex-wrap gap-3 border-t border-border/60 pt-3.5 text-xs">
              {profile.website ? (
                <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-semibold text-primary">
                  <Globe className="h-3.5 w-3.5" strokeWidth={2} />
                  Website
                </a>
              ) : null}
              {profile.linkedinUrl ? (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-semibold text-primary">
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                  LinkedIn
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <h2 className="px-1 font-display text-sm font-bold text-text">Posts</h2>
        {posts.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-sm text-muted">No posts yet.</div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={me.id} currentUserInitial={myInitial} initialSaved={savedIds.has(post.id)} />
          ))
        )}
      </div>
    </div>
  );
}
