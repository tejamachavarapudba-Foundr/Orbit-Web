import { Compass } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { getMe } from "@/lib/auth";
import type { ConnectedProfile, IncomingRequest, OutgoingRequest, Profile } from "@/lib/types";

import { DiscoverList } from "./DiscoverList";

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const me = await getMe();
  const [allProfiles, incoming, outgoing, connections] = await Promise.all([
    apiFetch<Profile[]>("/profiles"),
    apiFetch<IncomingRequest[]>("/connections/requests/incoming"),
    apiFetch<OutgoingRequest[]>("/connections/requests/outgoing"),
    apiFetch<ConnectedProfile[]>(`/connections/${me.id}`)
  ]);

  const people = allProfiles.filter((p) => p.id !== me.id);

  return (
    <div className="max-w-160">
      <div className="glass mb-4 flex items-center gap-3.5 rounded-2xl px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 text-on-primary">
          <Compass className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <h1 className="font-display text-lg font-bold text-text">Discover the network</h1>
          <p className="text-xs text-muted">Search founders, engineers, mentors, investors and policy makers building the future.</p>
        </div>
      </div>

      <DiscoverList people={people} incoming={incoming} outgoing={outgoing} connections={connections} />
    </div>
  );
}
