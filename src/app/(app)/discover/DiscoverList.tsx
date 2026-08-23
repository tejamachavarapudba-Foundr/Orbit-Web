"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, UserCheck, UserPlus } from "lucide-react";

import { acceptRequestAction, cancelRequestAction, connectAction, declineRequestAction } from "@/app/(app)/u/[id]/actions";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { ConnectedProfile, IncomingRequest, OutgoingRequest, Profile } from "@/lib/types";

const roleFilters = [
  { label: "All roles", value: "all" },
  { label: "Founder", value: "founder" },
  { label: "Co-Founder", value: "co_founder" },
  { label: "Software Engineer", value: "software_engineer" },
  { label: "Mentor", value: "mentor" },
  { label: "Policy Maker", value: "policy_maker" },
  { label: "Investor", value: "investor" },
  { label: "Designer", value: "designer" },
  { label: "Product Manager", value: "product_manager" },
  { label: "Other", value: "other" }
] as const;

const gradients = ["from-sky-400 to-indigo-500", "from-amber-400 to-red-500", "from-emerald-400 to-sky-500", "from-fuchsia-400 to-pink-500"];
const gradientFor = (seed: string) => gradients[seed.charCodeAt(0) % gradients.length];

const formatRole = (role: string) => role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const PAGE_SIZE = 10;

type ConnectionState = { status: "connected" | "outgoing_pending" | "incoming_pending" | "none"; requestId?: string };

const ConnectButton = ({ personId, state }: { personId: string; state: ConnectionState }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const run = (fn: () => Promise<void>) => startTransition(async () => { await fn(); router.refresh(); });

  if (state.status === "connected") {
    return (
      <button type="button" disabled className="w-full rounded-full border border-border/70 px-3 py-1.5 text-xs font-bold text-muted">
        Connected
      </button>
    );
  }

  if (state.status === "incoming_pending" && state.requestId) {
    return (
      <div className="flex w-full gap-1.5">
        <button
          type="button"
          disabled={isPending}
          onClick={() => run(() => acceptRequestAction(state.requestId!, personId))}
          className="flex-1 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-3 py-1.5 text-xs font-bold text-on-primary disabled:opacity-60"
        >
          Accept
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => run(() => declineRequestAction(state.requestId!, personId))}
          className="flex-1 rounded-full border border-border/70 px-3 py-1.5 text-xs font-bold text-text hover:bg-muted-bg/70 disabled:opacity-60"
        >
          Decline
        </button>
      </div>
    );
  }

  if (state.status === "outgoing_pending" && state.requestId) {
    return (
      <button
        type="button"
        disabled={isPending}
        onClick={() => run(() => cancelRequestAction(state.requestId!, personId))}
        className="flex w-full items-center justify-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs font-bold text-text hover:bg-muted-bg/70 disabled:opacity-60"
      >
        <UserCheck className="h-3.5 w-3.5" strokeWidth={2} />
        Cancel request
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => run(() => connectAction(personId))}
      className="flex w-full items-center justify-center gap-1.5 rounded-full border border-primary/40 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary-muted disabled:opacity-60"
    >
      <UserPlus className="h-3.5 w-3.5" strokeWidth={2} />
      Connect
    </button>
  );
};

type DiscoverListProps = {
  people: Profile[];
  incoming: IncomingRequest[];
  outgoing: OutgoingRequest[];
  connections: ConnectedProfile[];
};

export const DiscoverList = ({ people, incoming, outgoing, connections }: DiscoverListProps) => {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<(typeof roleFilters)[number]["value"]>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const connectionState = useMemo(() => {
    const map = new Map<string, ConnectionState>();
    connections.forEach((c) => map.set(c.profile.id, { status: "connected" }));
    incoming.forEach((r) => map.set(r.requester.id, { status: "incoming_pending", requestId: r.id }));
    outgoing.forEach((r) => map.set(r.recipient.id, { status: "outgoing_pending", requestId: r.id }));
    return map;
  }, [connections, incoming, outgoing]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return people.filter((p) => {
      if (role !== "all" && p.role !== role) return false;
      if (!query) return true;
      return [p.fullName, p.headline, p.company, p.location, p.role, ...(p.skills ?? []), ...(p.lookingFor ?? [])]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(query));
    });
  }, [people, search, role]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div>
      <div className="glass mb-3.5 flex items-center gap-2.5 rounded-2xl px-4 py-3">
        <Search className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder="Search by name, skill, company, location..."
          className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
        />
      </div>

      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {roleFilters.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => {
              setRole(r.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
              role === r.value ? "bg-gradient-to-r from-primary to-indigo-500 text-on-primary" : "glass text-muted hover:text-text"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <p className="mb-3 px-1 text-xs text-muted">
          Showing {visible.length} of {filtered.length} members
        </p>
      ) : null}

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-sm font-semibold text-text">No members found</p>
          <p className="mt-1 text-sm text-muted">Try another search term or role filter.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            {visible.map((p) => (
              <div key={p.id} className="glass flex flex-col gap-2 rounded-2xl p-4">
                <Link href={`/u/${p.id}`} className="flex items-center gap-2.5">
                  <div className="relative flex-shrink-0">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br font-display text-sm font-bold text-white ${gradientFor(p.id)}`}>
                      {(p.fullName || "?").charAt(0).toUpperCase()}
                    </div>
                    {p.openToConnect ? <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-surface bg-success" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="truncate text-sm font-bold text-text">{p.fullName || "Unnamed"}</span>
                      {p.identityVerified ? <VerifiedBadge size="sm" /> : null}
                    </div>
                    <p className="truncate text-xs text-muted">{p.headline || formatRole(p.role)}</p>
                  </div>
                </Link>
                {p.company || p.location ? (
                  <p className="truncate text-[11px] text-muted">{[p.company, p.location].filter(Boolean).join(" · ")}</p>
                ) : null}
                {p.skills && p.skills.length > 0 ? (
                  <span className="self-start rounded-full bg-muted-bg px-2 py-0.5 text-[10.5px] font-bold text-muted">{p.skills[0]}</span>
                ) : null}
                <ConnectButton personId={p.id} state={connectionState.get(p.id) ?? { status: "none" }} />
              </div>
            ))}
          </div>

          {visibleCount < filtered.length ? (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="glass mt-4 w-full rounded-2xl py-2.5 text-center text-sm font-bold text-primary hover:bg-primary-muted/40"
            >
              Load more
            </button>
          ) : null}
        </>
      )}
    </div>
  );
};
