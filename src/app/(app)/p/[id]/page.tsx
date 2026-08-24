import { notFound } from "next/navigation";

import { PostCard } from "@/components/PostCard";
import { apiFetch, ApiError } from "@/lib/api";
import { getMe } from "@/lib/auth";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const me = await getMe();

  let post: Post;
  try {
    post = await apiFetch<Post>(`/posts/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  let saved = false;
  try {
    const savedPosts = await apiFetch<Post[]>("/posts/saved");
    saved = savedPosts.some((p) => p.id === id);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
  }

  return (
    <div className="mx-auto max-w-160">
      <PostCard
        post={post}
        currentUserId={me.id}
        currentUserName={me.profile.fullName}
        currentUserAvatarUrl={me.profile.avatarUrl}
        initialSaved={saved}
      />
    </div>
  );
}
