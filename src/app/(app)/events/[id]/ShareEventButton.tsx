"use client";

import { Share2 } from "lucide-react";

export const ShareEventButton = ({ title }: { title: string }) => {
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(
        () => window.alert("Link copied to clipboard."),
        () => window.alert(url)
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share event"
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-muted-bg/70 hover:text-text"
    >
      <Share2 className="h-4 w-4" strokeWidth={2} />
    </button>
  );
};
