import { Bookmark } from "lucide-react";
import { getMe } from "@/lib/auth";

import { PostCard } from "@/components/PostCard";
import { apiFetch } from "@/lib/api";
import type { AuthMe, Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const [me, posts] = await Promise.all([getMe(), apiFetch<Post[]>("/posts/saved")]);
  const initial = (me.profile.fullName || "?").charAt(0).toUpperCase();

  return (
    <div className="max-w-160">
      <div className="glass mb-4 flex items-center gap-3.5 rounded-2xl px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary">
          <Bookmark className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <h1 className="font-display text-lg font-bold text-text">Saved posts</h1>
          <p className="text-xs text-muted">{posts.length} saved</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {posts.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-sm font-semibold text-text">Nothing saved yet</p>
            <p className="mt-1 text-sm text-muted">Tap the bookmark icon on any post to save it for later.</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} currentUserId={me.id} currentUserInitial={initial} initialSaved />)
        )}
      </div>
    </div>
  );
}
