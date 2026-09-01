"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Bookmark, Calendar, DollarSign, Globe, MapPin, PlayCircle, ThumbsUp, Users } from "lucide-react";

import { saveStartupAction, toggleStartupLikeAction, unsaveStartupAction } from "@/app/(app)/startups/[id]/actions";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { TrendingStartup } from "@/lib/types";

const gradients = ["from-sky-400 to-indigo-500", "from-amber-400 to-red-500", "from-emerald-400 to-sky-500", "from-fuchsia-400 to-pink-500"];
const gradientFor = (seed: string) => gradients[seed.charCodeAt(0) % gradients.length];

type StartupCardProps = {
  startup: TrendingStartup;
  isInvestor: boolean;
  initialSaved: boolean;
};

export const StartupCard = ({ startup, isInvestor, initialSaved }: StartupCardProps) => {
  const [liked, setLiked] = useState(Boolean(startup.isLikedByMe));
  const [likeCount, setLikeCount] = useState(startup.likeCount ?? 0);
  const [saved, setSaved] = useState(initialSaved);
  const [showVideo, setShowVideo] = useState(false);
  const [, startTransition] = useTransition();

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((count) => count + (next ? 1 : -1));
    startTransition(async () => {
      try {
        await toggleStartupLikeAction(startup.id);
      } catch {
        setLiked(!next);
        setLikeCount((count) => count + (next ? -1 : 1));
      }
    });
  };

  const handleSave = () => {
    const next = !saved;
    setSaved(next);
    startTransition(async () => {
      try {
        await (next ? saveStartupAction : unsaveStartupAction)(startup.id);
      } catch {
        setSaved(!next);
      }
    });
  };

  return (
    <div className="glass flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-0.5">
      <Link href={`/startups/${startup.id}`}>
        {startup.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={startup.coverUrl} alt="" className="h-24 w-full object-cover" />
        ) : (
          <div className={`h-24 w-full bg-gradient-to-br ${gradientFor(startup.id)}`} />
        )}
      </Link>

      <div className="flex flex-col gap-2.5 p-4 pt-0">
        <div className="-mt-8 flex items-end justify-between gap-2">
          <Link href={`/startups/${startup.id}`} className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            {startup.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={startup.logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-xl font-bold text-primary">
                {startup.name.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
          <div className="flex items-center gap-1 pb-0.5">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold transition hover:bg-muted-bg/70 ${liked ? "text-primary" : "text-muted"}`}
            >
              <ThumbsUp className="h-3.5 w-3.5" strokeWidth={2} fill={liked ? "currentColor" : "none"} />
              {likeCount > 0 ? likeCount : ""}
            </button>
            {isInvestor ? (
              <button
                type="button"
                onClick={handleSave}
                aria-label={saved ? "Unsave startup" : "Save startup"}
                className={`flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-muted-bg/70 ${saved ? "text-primary" : "text-muted"}`}
              >
                <Bookmark className="h-3.5 w-3.5" strokeWidth={2} fill={saved ? "currentColor" : "none"} />
              </button>
            ) : null}
          </div>
        </div>

        <Link href={`/startups/${startup.id}`} className="flex items-center gap-1.5">
          <h3 className="truncate text-sm font-bold text-text">{startup.name}</h3>
          {startup.founderVerified ? <VerifiedBadge size="sm" /> : null}
        </Link>

        <p className="line-clamp-3 text-xs leading-5 text-muted">{startup.description || startup.tagline || "No description yet."}</p>

        {startup.investorSnapshot ? (
          <Link href={`/startups/${startup.id}/investor-snapshot`} className="flex items-center gap-2 text-[10.5px] font-semibold text-muted hover:text-text">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted-bg">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-400" style={{ width: `${startup.investorSnapshot.completionPercentage}%` }} />
            </div>
            Investor snapshot {startup.investorSnapshot.completionPercentage}%
          </Link>
        ) : null}

        {startup.pitchVideoUrl ? (
          showVideo ? (
            <video src={startup.pitchVideoUrl} controls autoPlay className="w-full rounded-lg bg-black" />
          ) : (
            <button
              type="button"
              onClick={() => setShowVideo(true)}
              className="flex w-fit items-center gap-1.5 self-start rounded-md bg-primary-muted px-2.5 py-1.5 text-[10.5px] font-bold text-primary hover:bg-primary-muted/70"
            >
              <PlayCircle className="h-3.5 w-3.5" strokeWidth={2} />
              Watch founder pitch
            </button>
          )
        ) : null}

        <div className="flex flex-col gap-1 text-[11px] text-muted">
          {startup.fundingStage ? (
            <span className="flex items-center gap-1.5">
              <DollarSign className="h-3 w-3 flex-shrink-0" strokeWidth={2} />
              <span className="truncate capitalize">{startup.fundingStage.replace(/_/g, " ")}</span>
            </span>
          ) : null}
          {startup.foundedYear ? (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 flex-shrink-0" strokeWidth={2} />
              Founded {startup.foundedYear}
            </span>
          ) : null}
          {startup.websiteUrl ? (
            <a href={startup.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary">
              <Globe className="h-3 w-3 flex-shrink-0" strokeWidth={2} />
              <span className="truncate">{startup.websiteUrl.replace(/^https?:\/\//, "")}</span>
            </a>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {startup.location ? (
            <span className="flex items-center gap-1 rounded-full bg-muted-bg px-2 py-0.5 text-[10.5px] font-bold text-muted">
              <MapPin className="h-2.5 w-2.5" strokeWidth={2} />
              {startup.location}
            </span>
          ) : null}
          {startup.teamMemberCount ? (
            <span className="flex items-center gap-1 rounded-full bg-muted-bg px-2 py-0.5 text-[10.5px] font-bold text-muted">
              <Users className="h-2.5 w-2.5" strokeWidth={2} />
              {startup.teamMemberCount}
            </span>
          ) : null}
          <span className="rounded-full bg-muted-bg px-2 py-0.5 text-[10.5px] font-bold capitalize text-muted">{startup.stage}</span>
          <span className="rounded-full bg-muted-bg px-2 py-0.5 text-[10.5px] font-bold capitalize text-muted">{startup.projectType?.replace(/_/g, " ")}</span>
        </div>

        {startup.askAmount || startup.equityPercent ? (
          <div className="rounded-xl border border-primary/25 bg-primary/5 px-3 py-2">
            <p className="text-[9.5px] font-bold uppercase tracking-wide text-primary">Founder&apos;s offer</p>
            <p className="text-xs font-bold text-text">
              {startup.askAmount ? `₹${startup.askAmount}` : ""}
              {startup.askAmount && startup.equityPercent ? " for " : ""}
              {startup.equityPercent ? `${startup.equityPercent}%` : ""}
            </p>
          </div>
        ) : null}

        {isInvestor ? (
          <Link
            href="/meetings/new"
            className="mt-1 flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-3 py-2 text-xs font-bold text-on-primary shadow-sm"
          >
            <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
            Book meeting
          </Link>
        ) : null}
      </div>
    </div>
  );
};
