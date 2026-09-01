import { getMe } from "@/lib/auth";
import { PitchVideoTrending } from "@/components/PitchVideoTrending";
import type { PitchReel } from "@/lib/types";

import { loadReelsAction } from "./actions";
import { PitchReelFeed } from "./PitchReelFeed";

export const dynamic = "force-dynamic";

export default async function PitchVideosPage() {
  const [me, firstPage, rankingPage] = await Promise.all([getMe(), loadReelsAction(), loadReelsAction(undefined, 30)]);

  const trending = [...rankingPage.items].sort((a, b) => b.likeCount + b.commentCount - (a.likeCount + a.commentCount));
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
