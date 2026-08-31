import Link from "next/link";
import { notFound } from "next/navigation";
import { Bookmark, Briefcase, Globe, MapPin, Star, Users } from "lucide-react";
import { getMe } from "@/lib/auth";

import { Avatar } from "@/components/Avatar";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { apiFetch, ApiError } from "@/lib/api";
import type { AuthMe, StartupDetail } from "@/lib/types";

import { ApplyForm } from "./ApplyForm";
import { ReviewForm } from "./ReviewForm";
import { StartupComments } from "./StartupComments";
import { saveStartupAction, unsaveStartupAction } from "./actions";

export const dynamic = "force-dynamic";

const gradients = ["from-sky-400 to-indigo-500", "from-amber-400 to-red-500", "from-emerald-400 to-sky-500", "from-fuchsia-400 to-pink-500"];
const gradientFor = (seed: string) => gradients[seed.charCodeAt(0) % gradients.length];

type StartupPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StartupDetailPage({ params }: StartupPageProps) {
  const { id } = await params;

  let startup: StartupDetail;
  try {
    startup = await apiFetch<StartupDetail>(`/startups/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const [me, saved] = await Promise.all([
    getMe(),
    apiFetch<{ project: { id: string } }[]>("/projects/saved/list").catch(() => [])
  ]);

  const isOwner = startup.owner?.id === me.id;
  const isSaved = saved.some((s) => s.project?.id === id);
  const hasApplied = startup.applications?.some((a) => a.applicantId === me.id);
  const hasReviewed = startup.reviews?.some((r) => r.reviewerId === me.id);
  const avgRating = startup.reviews?.length ? startup.reviews.reduce((sum, r) => sum + r.rating, 0) / startup.reviews.length : 0;

  return (
    <div className="max-w-160">
      <div className="glass overflow-hidden rounded-2xl">
        <div className="h-24 bg-gradient-to-r from-primary/80 via-indigo-400/70 to-purple-400/70" />
        <div className="-mt-9 px-5 pb-5">
          <div className="flex items-end justify-between gap-3">
            <div className={`flex h-18 w-18 items-center justify-center rounded-2xl border-[3px] border-surface bg-gradient-to-br font-display text-2xl font-bold text-white ${gradientFor(startup.id)}`}>
              {startup.name.charAt(0).toUpperCase()}
            </div>
            {!isOwner ? (
              <form action={(isSaved ? unsaveStartupAction : saveStartupAction).bind(null, id)}>
                <button
                  type="submit"
                  className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition ${
                    isSaved ? "border-primary/40 bg-primary-muted text-primary" : "border-border/70 text-text hover:bg-muted-bg/70"
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" strokeWidth={2} fill={isSaved ? "currentColor" : "none"} />
                  {isSaved ? "Saved" : "Save"}
                </button>
              </form>
            ) : (
              <span className="rounded-full bg-primary-muted px-3 py-1.5 text-xs font-bold text-primary">You own this</span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            <h1 className="truncate font-display text-lg font-bold text-text">{startup.name}</h1>
            {startup.founderVerified ? <VerifiedBadge /> : null}
          </div>
          <p className="mt-0.5 text-sm text-muted">{startup.tagline}</p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span className="rounded-full bg-muted-bg px-2 py-0.5 font-bold capitalize">{startup.stage}</span>
            <span className="rounded-full bg-muted-bg px-2 py-0.5 font-bold capitalize">{startup.projectType?.replace(/_/g, " ")}</span>
            {startup.fundingStage ? (
              <span className="rounded-full bg-muted-bg px-2 py-0.5 font-bold capitalize">{startup.fundingStage.replace(/_/g, " ")}</span>
            ) : null}
            {startup.location ? (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" strokeWidth={2} />
                {startup.location}
              </span>
            ) : null}
            {startup.foundedYear ? <span>Founded {startup.foundedYear}</span> : null}
            {avgRating > 0 ? (
              <span className="flex items-center gap-1 font-semibold text-amber-500">
                <Star className="h-3 w-3" strokeWidth={2} fill="currentColor" />
                {avgRating.toFixed(1)} ({startup.reviews.length})
              </span>
            ) : null}
          </div>

          {startup.description ? <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-text">{startup.description}</p> : null}

          <div className="mt-4 flex flex-wrap gap-3 border-t border-border/60 pt-3.5 text-xs">
            {startup.owner ? (
              <Link href={`/u/${startup.owner.id}`} className="flex items-center gap-1.5 font-semibold text-primary">
                <Users className="h-3.5 w-3.5" strokeWidth={2} />
                {startup.owner.fullName}
              </Link>
            ) : null}
            {startup.websiteUrl ? (
              <a href={startup.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-semibold text-primary">
                <Globe className="h-3.5 w-3.5" strokeWidth={2} />
                Website
              </a>
            ) : null}
            <span className="flex items-center gap-1.5 font-semibold text-muted">
              <Briefcase className="h-3.5 w-3.5" strokeWidth={2} />
              {startup.members?.length ?? 0} team members
            </span>
          </div>
        </div>
      </div>

      {startup.pitchVideoUrl ? (
        <div className="glass mt-4 rounded-2xl p-4">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Founder pitch</h2>
          <video controls className="w-full rounded-xl bg-black" src={startup.pitchVideoUrl} />
        </div>
      ) : null}

      {startup.askAmount || startup.equityPercent ? (
        <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/5 p-4">
          <h2 className="text-center text-xs font-bold uppercase tracking-wide text-primary">Founder&apos;s offer</h2>
          <div className="mt-2.5 flex items-center justify-between text-sm">
            <span className="text-muted">Ask</span>
            <span className="font-bold text-text">{startup.askAmount || "—"}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-sm">
            <span className="text-muted">Equity %</span>
            <span className="font-bold text-text">{startup.equityPercent ? `${startup.equityPercent}%` : "—"}</span>
          </div>
        </div>
      ) : null}

      {startup.members && startup.members.length > 0 ? (
        <div className="glass mt-4 rounded-2xl p-4">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Team</h2>
          <div className="flex flex-col divide-y divide-border/60">
            {startup.members.map((member) => (
              <Link key={member.id} href={`/u/${member.user.id}`} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0 hover:opacity-80">
                <Avatar id={member.user.id} name={member.user.fullName} avatarUrl={member.user.avatarUrl} size="h-9 w-9" textSize="text-xs" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-text">{member.user.fullName}</div>
                  <div className="truncate text-xs text-muted">{member.user.headline}</div>
                </div>
                <span className="flex-shrink-0 rounded-full bg-muted-bg px-2 py-0.5 text-[10.5px] font-bold capitalize text-muted">{member.role}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {!isOwner ? (
        <div className="glass mt-4 rounded-2xl p-4">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Want to join?</h2>
          {hasApplied ? <p className="text-sm text-muted">You&apos;ve already applied to this startup.</p> : <ApplyForm startupId={id} />}
        </div>
      ) : null}

      <div className="glass mt-4 rounded-2xl p-4">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Reviews</h2>
        <div className="flex flex-col gap-3">
          {startup.reviews && startup.reviews.length > 0 ? (
            startup.reviews.map((review) => (
              <div key={review.id} className="flex gap-1 rounded-xl bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text">
                <div className="flex flex-shrink-0 items-center gap-0.5 text-amber-500">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3" strokeWidth={0} fill="currentColor" />
                  ))}
                </div>
                <span>{review.comment}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">No reviews yet.</p>
          )}
        </div>

        {!isOwner && !hasReviewed ? (
          <div className="mt-4 border-t border-border/60 pt-4">
            <ReviewForm startupId={id} />
          </div>
        ) : null}
      </div>

      <StartupComments
        startupId={id}
        currentUserId={me.id}
        currentUserName={me.profile.fullName}
        currentUserAvatarUrl={me.profile.avatarUrl}
      />
    </div>
  );
}
