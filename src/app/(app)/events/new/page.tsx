import { FormHeader } from "@/components/FormHeader";
import { apiFetch } from "@/lib/api";
import { getMe } from "@/lib/auth";
import type { Community, Profile } from "@/lib/types";

import { NewEventForm } from "./NewEventForm";

export const dynamic = "force-dynamic";

type NewEventPageProps = {
  searchParams: Promise<{ communityId?: string }>;
};

export default async function NewEventPage({ searchParams }: NewEventPageProps) {
  const [{ communityId }, me, communities, allProfiles] = await Promise.all([
    searchParams,
    getMe(),
    apiFetch<Community[]>("/communities/mine"),
    apiFetch<Profile[]>("/profiles")
  ]);
  const people = allProfiles.filter((p) => p.id !== me.id);

  return (
    <div className="max-w-140">
      <FormHeader title="Create an event" backHref={communityId ? "/communities/events" : "/events"} />
      <NewEventForm communities={communities} people={people} initialCommunityId={communityId} />
    </div>
  );
}
