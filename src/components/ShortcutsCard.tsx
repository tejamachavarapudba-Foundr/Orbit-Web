"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Calendar, Globe2, PenSquare, Rocket } from "lucide-react";

import { CreatePostModal } from "@/components/CreatePostModal";

const linkShortcuts = [
  { href: "/events", label: "Events", Icon: Calendar }
] as const;

const moreShortcuts = [
  { href: "/projects", label: "My startups", Icon: Rocket },
  { href: "/communities", label: "Communities", Icon: Globe2 },
  { href: "/saved", label: "Saved posts", Icon: Bookmark }
] as const;

type ShortcutsCardProps = {
  initial: string;
};

export const ShortcutsCard = ({ initial }: ShortcutsCardProps) => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  return (
    <>
      <nav className="glass rounded-2xl p-2">
        {linkShortcuts.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[13px] font-semibold text-text transition hover:bg-muted-bg/70"
          >
            <Icon className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
            {label}
          </Link>
        ))}

        {/* Always reachable regardless of feed scroll position — the composer
            that used to live inline at the top of the feed scrolled out of
            view, so "start a post" now lives here in the sticky sidebar. */}
        <button
          type="button"
          onClick={() => setIsComposerOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-[13px] font-semibold text-primary transition hover:bg-primary-muted/70"
        >
          <PenSquare className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
          Create post
        </button>

        {moreShortcuts.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[13px] font-semibold text-text transition hover:bg-muted-bg/70"
          >
            <Icon className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
            {label}
          </Link>
        ))}
      </nav>

      <CreatePostModal initial={initial} open={isComposerOpen} onClose={() => setIsComposerOpen(false)} />
    </>
  );
};
