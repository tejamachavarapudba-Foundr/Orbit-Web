import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

import type { PitchReel } from "@/lib/types";

import { gradientFor } from "./Avatar";

const Row = ({ reel }: { reel: PitchReel }) => (
  <Link href={`/startups/${reel.id}`} className="flex items-center gap-2.5 rounded-xl px-1 py-2 transition hover:bg-muted-bg/60">
    <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-border/60">
      {reel.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={reel.logoUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br font-display text-xs font-bold text-white ${gradientFor(reel.id)}`}>
          {reel.name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
    <div className="min-w-0 flex-1">
      <div className="truncate text-xs font-bold text-text">{reel.name}</div>
      <div className="flex items-center gap-2.5 text-[10.5px] text-muted">
        <span className="flex items-center gap-1">
          <Heart className="h-2.5 w-2.5" strokeWidth={2} />
          {reel.likeCount}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-2.5 w-2.5" strokeWidth={2} />
          {reel.commentCount}
        </span>
      </div>
    </div>
  </Link>
);

type PitchVideoTrendingProps = {
  trending: PitchReel[];
  bestLiked: PitchReel[];
};

export const PitchVideoTrending = ({ trending, bestLiked }: PitchVideoTrendingProps) => {
  if (trending.length === 0 && bestLiked.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {trending.length > 0 ? (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-1 font-display text-sm font-bold text-text">Trending pitches</h3>
          <div className="flex flex-col">
            {trending.slice(0, 5).map((reel) => (
              <Row key={reel.id} reel={reel} />
            ))}
          </div>
        </div>
      ) : null}

      {bestLiked.length > 0 ? (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-1 font-display text-sm font-bold text-text">Best liked</h3>
          <div className="flex flex-col">
            {bestLiked.slice(0, 5).map((reel) => (
              <Row key={reel.id} reel={reel} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
