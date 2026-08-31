"use server";

import { redirect } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { clearSessionTokens } from "@/lib/session";
import type { Post, PostComment } from "@/lib/types";

export const logoutAction = async () => {
  await clearSessionTokens();
  redirect("/login");
};

export type CreatePostState = { error: string | null };

export type ComposerMedia = { name: string; type: string; dataUrl: string };

export const createPostAction = async (
  _prevState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> => {
  const content = String(formData.get("content") ?? "").trim();
  const files = formData.getAll("media").filter((f): f is File => f instanceof File && f.size > 0);

  if (!content && files.length === 0) {
    return { error: "Write something or attach a photo before posting." };
  }

  const body = new FormData();
  body.set("content", content);
  body.set("category", "Update");
  files.forEach((file) => body.append("files", file));

  try {
    await apiFetch("/posts", { method: "POST", formData: body });
  } catch {
    return { error: "Couldn't publish that post — try again." };
  }

  return { error: null };
};

const FEED_PAGE_SIZE = 10;

/** Matches the mobile app's page size — the backend defaults /posts to
 * limit=50 with no pagination UI in mind for web, but real "load more"
 * paging (not just revealing more of one big fetch) is what actually gets
 * web to the same behavior as mobile as the platform grows. */
export const loadMorePostsAction = async (page: number): Promise<Post[]> =>
  apiFetch<Post[]>(`/posts?page=${page}&limit=${FEED_PAGE_SIZE}`);

export const toggleLikeAction = async (postId: string): Promise<{ liked: boolean }> =>
  apiFetch(`/likes/${postId}`, { method: "POST" });

export const toggleSaveAction = async (postId: string): Promise<{ saved: boolean }> =>
  apiFetch(`/posts/${postId}/save`, { method: "POST" });

export const updatePostAction = async (postId: string, content: string): Promise<Post> =>
  apiFetch(`/posts/${postId}`, { method: "PATCH", body: { content } });

export const deletePostAction = async (postId: string): Promise<void> => {
  await apiFetch(`/posts/${postId}`, { method: "DELETE" });
};

export const reportPostAction = async (postId: string, reason: string): Promise<void> => {
  await apiFetch(`/posts/${postId}/report`, { method: "POST", body: { reason } });
};

export const notInterestedAction = async (postId: string): Promise<void> => {
  await apiFetch(`/posts/${postId}/not-interested`, { method: "POST" });
};

export const getFollowStatusAction = async (targetId: string): Promise<boolean> => {
  const { isFollowing } = await apiFetch<{ isFollowing: boolean }>(`/follows/status/${targetId}`);
  return isFollowing;
};

export const listCommentsAction = async (postId: string): Promise<PostComment[]> =>
  apiFetch(`/comments?postId=${postId}`);

export const createCommentAction = async (postId: string, content: string): Promise<PostComment> =>
  apiFetch("/comments", { method: "POST", body: { postId, content } });

export const deleteCommentAction = async (commentId: string): Promise<void> => {
  await apiFetch(`/comments/${commentId}`, { method: "DELETE" });
};
