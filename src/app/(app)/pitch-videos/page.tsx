import { getMe } from "@/lib/auth";

import { loadReelsAction } from "./actions";
import { PitchReelFeed } from "./PitchReelFeed";

export const dynamic = "force-dynamic";

export default async function PitchVideosPage() {
  const [me, firstPage] = await Promise.all([getMe(), loadReelsAction()]);

  return (
    <PitchReelFeed initialItems={firstPage.items} initialNextCursor={firstPage.nextCursor} currentUserId={me.id} />
  );
}
