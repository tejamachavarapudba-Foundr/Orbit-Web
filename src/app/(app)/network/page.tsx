import Link from "next/link";
import { Users } from "lucide-react";

import { VerifiedBadge } from "@/components/VerifiedBadge";
import { apiFetch } from "@/lib/api";
import type { AuthMe, ConnectedProfile, IncomingRequest, OutgoingRequest, Profile } from "@/lib/types";

import { acceptRequestAction, cancelRequestAction, connectAction, declineRequestAction } from "../u/[id]/actions";

export const dynamic = "force-dynamic";

const gradients = ["from-sky-400 to-indigo-500", "from-amber-400 to-red-500", "from-emerald-400 to-sky-500", "from-fuchsia-400 to-pink-500"];
const gradientFor = (seed: string) => gradients[seed.charCodeAt(0) % gradients.length];

const Avatar = ({ id, name, size = "h-11 w-11" }: { id: string; name: string; size?: string }) => (
  <div className={`flex ${size} flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display text-sm font-bold text-white ${gradientFor(id)}`}>
    {(name || "?").charAt(0).toUpperCase()}
  </div>
);

type NetworkPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

const tabs = [
  { key: "requests", label: "Requests" },
  { key: "connections", label: "Connections" },
  { key: "discover", label: "Discover" }
] as const;

export default async function NetworkPage({ searchParams }: NetworkPageProps) {
  const params = await searchParams;
  const tab = (params.tab as (typeof tabs)[number]["key"]) ?? "requests";

  const me = await apiFetch<AuthMe>("/auth/me");
  const [incoming, outgoing, connections, allProfiles] = await Promise.all([
    apiFetch<IncomingRequest[]>("/connections/requests/incoming"),
    apiFetch<OutgoingRequest[]>("/connections/requests/outgoing"),
    apiFetch<ConnectedProfile[]>(`/connections/${me.id}`),
    apiFetch<Profile[]>("/profiles")
  ]);

  const connectedIds = new Set(connections.map((c) => c.profile.id));
  const pendingIds = new Set([...incoming.map((r) => r.requester.id), ...outgoing.map((r) => r.recipient.id)]);
  const discoverable = allProfiles.filter((p) => p.id !== me.id && !connectedIds.has(p.id) && !pendingIds.has(p.id));

  return (
    <div className="mx-auto max-w-160 px-5 py-5">
      <div className="glass mb-4 flex items-center gap-3.5 rounded-2xl px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary">
          <Users className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <h1 className="font-display text-lg font-bold text-text">My network</h1>
          <p className="text-xs text-muted">{connections.length} connections</p>
        </div>
      </div>

      <div className="glass mb-4 flex gap-1 rounded-2xl p-1.5">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/network?tab=${t.key}`}
            className={`flex-1 rounded-xl px-3 py-2 text-center text-xs font-bold transition ${
              tab === t.key ? "bg-gradient-to-r from-primary to-indigo-500 text-on-primary shadow-sm" : "text-muted hover:bg-muted-bg/70 hover:text-text"
            }`}
          >
            {t.label}
            {t.key === "requests" && incoming.length > 0 ? ` (${incoming.length})` : ""}
          </Link>
        ))}
      </div>

      {tab === "requests" ? (
        <div className="flex flex-col gap-4">
          {incoming.length === 0 && outgoing.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-sm text-muted">No pending requests.</div>
          ) : null}

          {incoming.length > 0 ? (
            <div className="glass rounded-2xl p-4">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Received</h2>
              <div className="flex flex-col gap-3">
                {incoming.map((req) => (
                  <div key={req.id} className="flex items-center gap-3">
                    <Link href={`/u/${req.requester.id}`}>
                      <Avatar id={req.requester.id} name={req.requester.fullName} />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/u/${req.requester.id}`} className="truncate text-sm font-bold text-text hover:underline">
                        {req.requester.fullName || "Unnamed"}
                      </Link>
                      <p className="truncate text-xs text-muted">{req.requester.headline}</p>
                    </div>
                    <form action={acceptRequestAction.bind(null, req.id, req.requester.id)}>
                      <button type="submit" className="rounded-full bg-gradient-to-r from-primary to-indigo-500 px-3.5 py-1.5 text-xs font-bold text-on-primary">
                        Accept
                      </button>
                    </form>
                    <form action={declineRequestAction.bind(null, req.id, req.requester.id)}>
                      <button type="submit" className="rounded-full border border-border/70 px-3.5 py-1.5 text-xs font-bold text-text hover:bg-muted-bg/70">
                        Decline
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {outgoing.length > 0 ? (
            <div className="glass rounded-2xl p-4">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Sent</h2>
              <div className="flex flex-col gap-3">
                {outgoing.map((req) => (
                  <div key={req.id} className="flex items-center gap-3">
                    <Link href={`/u/${req.recipient.id}`}>
                      <Avatar id={req.recipient.id} name={req.recipient.fullName} />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/u/${req.recipient.id}`} className="truncate text-sm font-bold text-text hover:underline">
                        {req.recipient.fullName || "Unnamed"}
                      </Link>
                      <p className="truncate text-xs text-muted">{req.recipient.headline}</p>
                    </div>
                    <form action={cancelRequestAction.bind(null, req.id, req.recipient.id)}>
                      <button type="submit" className="rounded-full border border-border/70 px-3.5 py-1.5 text-xs font-bold text-text hover:bg-muted-bg/70">
                        Cancel
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {tab === "connections" ? (
        <div className="glass rounded-2xl p-4">
          {connections.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted">No connections yet — head to Discover to find people.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border/60">
              {connections.map((c) => (
                <Link key={c.connectionId} href={`/u/${c.profile.id}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80">
                  <Avatar id={c.profile.id} name={c.profile.fullName} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-text">{c.profile.fullName || "Unnamed"}</div>
                    <div className="truncate text-xs text-muted">{c.profile.headline}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "discover" ? (
        <div className="grid grid-cols-2 gap-3">
          {discoverable.length === 0 ? (
            <div className="glass col-span-2 rounded-2xl p-8 text-center text-sm text-muted">No one new to discover right now.</div>
          ) : (
            discoverable.map((p) => (
              <div key={p.id} className="glass flex flex-col items-center gap-2 rounded-2xl p-4 text-center">
                <Link href={`/u/${p.id}`}>
                  <Avatar id={p.id} name={p.fullName} size="h-14 w-14" />
                </Link>
                <div className="min-w-0">
                  <div className="flex items-center justify-center gap-1">
                    <Link href={`/u/${p.id}`} className="truncate text-sm font-bold text-text hover:underline">
                      {p.fullName || "Unnamed"}
                    </Link>
                    {p.identityVerified ? <VerifiedBadge size="sm" /> : null}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted">{p.headline || p.role}</p>
                </div>
                <form action={connectAction.bind(null, p.id)} className="w-full">
                  <button type="submit" className="mt-1 w-full rounded-full border border-primary/40 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary-muted">
                    Connect
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
