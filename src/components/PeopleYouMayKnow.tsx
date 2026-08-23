import Link from "next/link";
import { UserPlus, Users } from "lucide-react";

import { connectAction } from "@/app/(app)/u/[id]/actions";
import { Avatar } from "@/components/Avatar";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { Profile } from "@/lib/types";

type PeopleYouMayKnowProps = {
  people: Profile[];
};

export const PeopleYouMayKnow = ({ people }: PeopleYouMayKnowProps) => {
  if (people.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="flex items-center gap-1.5 font-display text-sm font-bold text-text">
          <Users className="h-3.5 w-3.5 text-muted" strokeWidth={2} />
          People you may know
        </h3>
        <Link href="/discover" className="text-[11.5px] font-bold text-primary">
          See all
        </Link>
      </div>
      <div className="flex flex-col">
        {people.slice(0, 4).map((person, index) => (
          <div key={person.id} className={`flex items-center gap-2.5 py-2.5 ${index > 0 ? "border-t border-border/60" : ""}`}>
            <Link href={`/u/${person.id}`} className="flex min-w-0 flex-1 items-center gap-2.5">
              <Avatar id={person.id} name={person.fullName} avatarUrl={person.avatarUrl} size="h-9 w-9" textSize="text-xs" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-xs font-bold text-text">
                  <span className="truncate">{person.fullName || "Unnamed"}</span>
                  {person.identityVerified ? <VerifiedBadge size="sm" /> : null}
                </div>
                <div className="truncate text-[11px] text-muted">{person.headline || person.role}</div>
              </div>
            </Link>
            <form action={connectAction.bind(null, person.id)}>
              <button
                type="submit"
                aria-label={`Connect with ${person.fullName}`}
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary transition hover:bg-primary-muted"
              >
                <UserPlus className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};
