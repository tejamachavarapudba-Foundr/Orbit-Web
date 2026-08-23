import Link from "next/link";
import { CheckCircle2, Clock, Plus, Video, XCircle } from "lucide-react";

import { apiFetch, ApiError } from "@/lib/api";
import { getMe } from "@/lib/auth";
import type { Meeting, MeetingProposal, MeetingsCancelled, MeetingsUpcoming } from "@/lib/types";

import { CancelMeetingButton } from "./CancelMeetingButton";
import { GoogleConnectCard } from "./GoogleConnectCard";
import { RespondProposalForm } from "./RespondProposalForm";
import { WithdrawButton } from "./WithdrawButton";

const getGoogleConnected = async (): Promise<boolean> => {
  try {
    const status = await apiFetch<{ connected: boolean }>("/google/oauth/status");
    return status.connected;
  } catch (error) {
    if (error instanceof ApiError) return false;
    throw error;
  }
};

export const dynamic = "force-dynamic";

const tabs = [
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" }
] as const;

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));

type MeetingsPageProps = {
  searchParams: Promise<{ tab?: string; status?: string }>;
};

const otherParty = (proposal: MeetingProposal, myId: string) =>
  proposal.organizerId === myId ? proposal.invitees[0]?.user : proposal.organizer;

const MeetingCard = ({ meeting, myId }: { meeting: Meeting; myId: string }) => {
  const person = otherParty(meeting.proposal, myId);
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-text">{meeting.proposal.purpose}</h3>
          <p className="mt-0.5 text-xs text-muted">with {person?.fullName ?? "Unknown"}</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
            <Clock className="h-3.5 w-3.5" strokeWidth={2} />
            {formatDateTime(meeting.confirmedAt)}
          </p>
        </div>
        {meeting.status === "upcoming" ? <CancelMeetingButton meetingId={meeting.id} /> : null}
      </div>
      {meeting.meetLink ? (
        <a
          href={meeting.meetLink}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-3.5 py-1.5 text-xs font-bold text-on-primary"
        >
          <Video className="h-3.5 w-3.5" strokeWidth={2} />
          Join call
        </a>
      ) : null}
    </div>
  );
};

export default async function MeetingsPage({ searchParams }: MeetingsPageProps) {
  const params = await searchParams;
  const tab = (params.tab as (typeof tabs)[number]["key"]) ?? "upcoming";

  const [me, isGoogleConnected] = await Promise.all([getMe(), getGoogleConnected()]);

  return (
    <div className="max-w-160">
      <div className="glass mb-4 flex items-center gap-3.5 rounded-2xl px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 text-on-primary">
          <Video className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-lg font-bold text-text">My meetings</h1>
          <p className="text-xs text-muted">Requests, confirmed calls and past meetings</p>
        </div>
        {isGoogleConnected ? (
          <Link href="/meetings/new" className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-xs font-bold text-on-primary shadow-md shadow-primary/25">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            New meeting
          </Link>
        ) : null}
      </div>

      {params.status === "success" ? (
        <div className="glass mb-4 flex items-center gap-2.5 rounded-2xl px-5 py-3.5 text-sm font-semibold text-success">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
          Google Meet connected.
        </div>
      ) : params.status === "error" ? (
        <div className="glass mb-4 flex items-center gap-2.5 rounded-2xl px-5 py-3.5 text-sm font-semibold text-danger">
          <XCircle className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
          Google connection failed — try again.
        </div>
      ) : null}

      <div className="glass mb-4 flex gap-1 rounded-2xl p-1.5">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/meetings?tab=${t.key}`}
            className={`flex-1 rounded-xl px-3 py-2 text-center text-xs font-bold transition ${
              tab === t.key ? "bg-gradient-to-r from-primary to-indigo-500 text-on-primary shadow-sm" : "text-muted hover:bg-muted-bg/70 hover:text-text"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {!isGoogleConnected ? (
        <GoogleConnectCard />
      ) : (
        <>
          {tab === "upcoming" ? <UpcomingTab myId={me.id} /> : null}
          {tab === "completed" ? <CompletedTab myId={me.id} /> : null}
          {tab === "cancelled" ? <CancelledTab myId={me.id} /> : null}
        </>
      )}
    </div>
  );
}

async function UpcomingTab({ myId }: { myId: string }) {
  const data = await apiFetch<MeetingsUpcoming>("/meetings/mine?tab=upcoming");

  if (data.meetings.length === 0 && data.pendingProposals.length === 0) {
    return <div className="glass rounded-2xl p-10 text-center text-sm text-muted">No upcoming meetings or requests.</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {data.pendingProposals.map((proposal) => {
        const invitee = proposal.invitees.find((i) => i.userId === myId);
        const isOrganizer = proposal.organizerId === myId;
        const person = otherParty(proposal, myId);
        return (
          <div key={proposal.id} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10.5px] font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                Pending
              </span>
            </div>
            <h3 className="mt-2 text-sm font-bold text-text">{proposal.purpose}</h3>
            <p className="mt-0.5 text-xs text-muted">
              {isOrganizer ? "Requested with" : "Requested by"} {person?.fullName ?? "Unknown"}
            </p>
            {proposal.message ? <p className="mt-1.5 text-xs text-muted">{proposal.message}</p> : null}

            {isOrganizer ? (
              <WithdrawButton proposalId={proposal.id} />
            ) : invitee?.response === "pending" && proposal.proposedSlots ? (
              <RespondProposalForm proposalId={proposal.id} slots={proposal.proposedSlots} />
            ) : null}
          </div>
        );
      })}
      {data.meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} myId={myId} />
      ))}
    </div>
  );
}

async function CompletedTab({ myId }: { myId: string }) {
  const meetings = await apiFetch<Meeting[]>("/meetings/mine?tab=completed");

  if (meetings.length === 0) {
    return <div className="glass rounded-2xl p-10 text-center text-sm text-muted">No completed meetings yet.</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} myId={myId} />
      ))}
    </div>
  );
}

async function CancelledTab({ myId }: { myId: string }) {
  const data = await apiFetch<MeetingsCancelled>("/meetings/mine?tab=cancelled");

  if (data.meetings.length === 0 && data.proposals.length === 0) {
    return <div className="glass rounded-2xl p-10 text-center text-sm text-muted">Nothing cancelled or declined.</div>;
  }

  return (
    <div className="flex flex-col gap-3 opacity-80">
      {data.meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} myId={myId} />
      ))}
      {data.proposals.map((proposal) => {
        const person = otherParty(proposal, myId);
        return (
          <div key={proposal.id} className="glass rounded-2xl p-4">
            <span className="rounded-full bg-danger-bg px-2.5 py-1 text-[10.5px] font-bold text-danger capitalize">{proposal.status}</span>
            <h3 className="mt-2 text-sm font-bold text-text">{proposal.purpose}</h3>
            <p className="mt-0.5 text-xs text-muted">with {person?.fullName ?? "Unknown"}</p>
          </div>
        );
      })}
    </div>
  );
}
