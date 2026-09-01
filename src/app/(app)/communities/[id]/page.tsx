import Link from "next/link";
import { notFound } from "next/navigation";
import { Users } from "lucide-react";

import { Avatar } from "@/components/Avatar";
import { BackButton } from "@/components/BackButton";
import { apiFetch, ApiError } from "@/lib/api";
import { getMe } from "@/lib/auth";
import type { CommunityDetail, Profile } from "@/lib/types";

import { AddMemberForm } from "./AddMemberForm";

export const dynamic = "force-dynamic";

type CommunityDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { id } = await params;

  let community: CommunityDetail;
  try {
    community = await apiFetch<CommunityDetail>(`/communities/${id}`);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) notFound();
    throw error;
  }

  const me = await getMe();
  const allProfiles = await apiFetch<Profile[]>("/profiles");
  const people = allProfiles.filter((p) => p.id !== me.id);
  const existingMemberIds = new Set(community.members.map((m) => m.userId));

  return (
    <div className="max-w-160">
      <BackButton fallbackHref="/communities" />
      <div className="glass rounded-2xl p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 font-display text-xl font-bold text-white">
          {community.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="mt-3 font-display text-lg font-bold text-text">{community.name}</h1>
        <p className="mt-1 text-sm text-muted">{community.description || "No description yet."}</p>
        <span className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-muted">
          <Users className="h-3.5 w-3.5" strokeWidth={2} />
          {community.members.length} member{community.members.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="glass mt-4 rounded-2xl p-4">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Invite people</h2>
        <AddMemberForm communityId={id} people={people} existingMemberIds={existingMemberIds} />
      </div>

      <div className="glass mt-4 rounded-2xl p-4">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Members</h2>
        <div className="flex flex-col divide-y divide-border/60">
          {community.members.map((member) => (
            <Link key={member.id} href={`/u/${member.user.id}`} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0 hover:opacity-80">
              <Avatar id={member.user.id} name={member.user.fullName} avatarUrl={member.user.avatarUrl} size="h-9 w-9" textSize="text-xs" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-text">{member.user.fullName}</div>
                <div className="truncate text-xs text-muted">{member.user.headline}</div>
              </div>
              {member.role === "owner" ? <span className="flex-shrink-0 rounded-full bg-muted-bg px-2 py-0.5 text-[10.5px] font-bold text-muted">Owner</span> : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
