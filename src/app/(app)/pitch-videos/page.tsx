import { getMe } from "@/lib/auth";
import { PitchVideoTrending } from "@/components/PitchVideoTrending";
import type { PitchReel } from "@/lib/types";

import { loadReelsAction } from "./actions";
import { PitchReelFeed } from "./PitchReelFeed";

export const dynamic = "force-dynamic";

// Same time-decay shape as the backend's own trending-startups score
// (projects.service.ts findTrending) — without it, "Trending" and "Best
// liked" both just rank by engagement and land on the same order whenever
// the top-liked video also happens to have the most comments, which is
// the common case. Weighting by recency gives "Trending" its own meaning
// (recent momentum) distinct from "Best liked" (all-time raw likes).
const trendingScore = (reel: PitchReel) => {
  const ageInHours = Math.abs(Date.now() - new Date(reel.createdAt).getTime()) / (1000 * 60 * 60);
  return (reel.likeCount + reel.commentCount) / Math.pow(ageInHours + 2, 1.8);
};

export default async function PitchVideosPage() {
  const [me, firstPage, rankingPage] = await Promise.all([getMe(), loadReelsAction(), loadReelsAction(undefined, 30)]);

  const trending = [...rankingPage.items].sort((a, b) => trendingScore(b) - trendingScore(a));
  const bestLiked = [...rankingPage.items].sort((a: PitchReel, b: PitchReel) => b.likeCount - a.likeCount);

  return (
    <div className="grid max-w-220 grid-cols-[minmax(0,1fr)_300px] items-start gap-5">
      <div className="min-w-0">
        <PitchReelFeed initialItems={firstPage.items} initialNextCursor={firstPage.nextCursor} currentUserId={me.id} />
      </div>
      <aside className="sticky top-20">
        <PitchVideoTrending trending={trending} bestLiked={bestLiked} />
      </aside>
    </div>
  );
}
