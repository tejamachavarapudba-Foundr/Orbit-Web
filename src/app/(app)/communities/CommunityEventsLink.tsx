"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";

export const CommunityEventsLink = ({ hasCommunities }: { hasCommunities: boolean }) => (
  <Link
    href={hasCommunities ? "/communities/events" : "#"}
    onClick={
      hasCommunities
        ? undefined
        : (e) => {
            e.preventDefault();
            window.alert("Create a community group first, then host private events for its members.");
          }
    }
    className="glass flex flex-col gap-2.5 rounded-2xl p-4 transition hover:-translate-y-0.5"
  >
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white">
      <Calendar className="h-5 w-5" strokeWidth={2} />
    </span>
    <h2 className="text-sm font-bold text-text">Community events</h2>
    <p className="text-xs text-muted">
      {hasCommunities
        ? "Host a private meetup for one of your communities, or join public events."
        : "Create a community group first, then host private events for its members."}
    </p>
  </Link>
);
