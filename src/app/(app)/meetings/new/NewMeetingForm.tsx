"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Plus, X } from "lucide-react";

import { PeoplePicker } from "@/components/PeoplePicker";
import { TimeSelect } from "@/components/TimeSelect";
import { createMeetingProposalAction, getOpenSlotsAction, type CreateMeetingState } from "../actions";
import type { Profile, ProposedSlot, TrendingStartup } from "@/lib/types";

const initialState: CreateMeetingState = { error: null };

const purposeOptions = ["Investment Discussion", "Product Demo", "Partnership", "Technical Discussion", "Mentorship", "General Discussion", "Other"];

const inputClass =
  "w-full rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15";

const toggleClass = (active: boolean) =>
  `flex-1 rounded-xl px-3 py-2.5 text-center text-sm font-bold transition ${
    active ? "bg-gradient-to-r from-primary to-indigo-500 text-on-primary shadow-sm" : "border border-border/70 text-muted hover:bg-muted-bg/70"
  }`;

const formatSlot = (slot: ProposedSlot) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date(`${slot.date}T${slot.time}`)) +
  ` at ${slot.time}`;

type NewMeetingFormProps = {
  projects: TrendingStartup[];
  people: Profile[];
};

export const NewMeetingForm = ({ projects, people }: NewMeetingFormProps) => {
  const [state, formAction, isPending] = useActionState(createMeetingProposalAction, initialState);

  const [inviteMode, setInviteMode] = useState<"startup" | "people">("people");
  const [targetStartupId, setTargetStartupId] = useState("");
  const [selectedPeople, setSelectedPeople] = useState<Profile[]>([]);

  const [schedulingMode, setSchedulingMode] = useState<"availability_pick" | "date_push">("date_push");
  const [openSlots, setOpenSlots] = useState<ProposedSlot[] | null>(null);
  const [selectedOpenSlot, setSelectedOpenSlot] = useState(0);
  const [isLoadingSlots, startSlotsTransition] = useTransition();

  const [dateSlots, setDateSlots] = useState<{ date: string; time: string }[]>([{ date: "", time: "10:00" }]);

  const singleInviteeId = inviteMode === "people" && selectedPeople.length === 1 ? selectedPeople[0].id : null;

  useEffect(() => {
    if (!singleInviteeId) {
      setOpenSlots(null);
      setSchedulingMode("date_push");
      return;
    }
    startSlotsTransition(async () => {
      const result = await getOpenSlotsAction(singleInviteeId);
      setOpenSlots(result.slots);
      setSelectedOpenSlot(0);
      if (result.slots.length === 0) setSchedulingMode("date_push");
    });
  }, [singleInviteeId]);

  const selectedIds = new Set(selectedPeople.map((p) => p.id));

  const togglePerson = (person: Profile) => {
    setSelectedPeople((prev) => (prev.some((p) => p.id === person.id) ? prev.filter((p) => p.id !== person.id) : [...prev, person]));
  };

  const canPickAvailability = singleInviteeId !== null && (openSlots?.length ?? 0) > 0;

  return (
    <form action={formAction} className="glass flex flex-col gap-4 rounded-2xl p-6">
      <input type="hidden" name="inviteMode" value={inviteMode} />
      <input type="hidden" name="schedulingMode" value={schedulingMode} />
      <input type="hidden" name="timezone" value={Intl.DateTimeFormat().resolvedOptions().timeZone} />

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Purpose</span>
        <select name="purpose" required defaultValue={purposeOptions[0]} className={inputClass}>
          {purposeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Message (optional)</span>
        <textarea name="message" rows={3} placeholder="Briefly describe the agenda..." className={`${inputClass} resize-none`} />
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-text">Invite</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => setInviteMode("startup")} className={toggleClass(inviteMode === "startup")}>
            Startup
          </button>
          <button type="button" onClick={() => setInviteMode("people")} className={toggleClass(inviteMode === "people")}>
            People
          </button>
        </div>

        {inviteMode === "startup" ? (
          projects.length === 0 ? (
            <p className="text-xs text-muted">No other startups on Orbit yet.</p>
          ) : (
            <select
              name="targetStartupId"
              required
              value={targetStartupId}
              onChange={(e) => setTargetStartupId(e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>
                Select a startup...
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )
        ) : (
          <PeoplePicker people={people} selectedIds={selectedIds} onToggle={togglePerson} fieldName="inviteeUserIds" />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-text">Scheduling</span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!canPickAvailability}
            onClick={() => setSchedulingMode("availability_pick")}
            className={`${toggleClass(schedulingMode === "availability_pick")} disabled:cursor-not-allowed disabled:opacity-40`}
          >
            Pick their availability
          </button>
          <button type="button" onClick={() => setSchedulingMode("date_push")} className={toggleClass(schedulingMode === "date_push")}>
            Propose dates
          </button>
        </div>
        {inviteMode === "people" && selectedPeople.length > 1 ? (
          <p className="text-xs text-muted">&quot;Pick their availability&quot; only works for a single invitee.</p>
        ) : isLoadingSlots ? (
          <p className="text-xs text-muted">Checking their availability...</p>
        ) : singleInviteeId && openSlots?.length === 0 ? (
          <p className="text-xs text-muted">No availability set for this person — propose dates instead.</p>
        ) : null}
      </div>

      {schedulingMode === "availability_pick" && openSlots && openSlots.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <input type="hidden" name="selectedSlotDate" value={openSlots[selectedOpenSlot]?.date ?? ""} />
          <input type="hidden" name="selectedSlotTime" value={openSlots[selectedOpenSlot]?.time ?? ""} />
          {openSlots.slice(0, 20).map((slot, index) => (
            <label key={`${slot.date}-${slot.time}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-text hover:bg-muted-bg/60">
              <input type="radio" checked={selectedOpenSlot === index} onChange={() => setSelectedOpenSlot(index)} className="h-3.5 w-3.5 accent-primary" />
              {formatSlot(slot)}
            </label>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {dateSlots.map((slot, index) => (
            <div key={index} className="flex items-center gap-2">
              <input type="date" name={`slot${index + 1}Date`} defaultValue={slot.date} className={inputClass} />
              <TimeSelect name={`slot${index + 1}Time`} defaultValue={slot.time} className={inputClass} />
              {dateSlots.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setDateSlots((prev) => prev.filter((_, i) => i !== index))}
                  aria-label="Remove slot"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-muted hover:bg-muted-bg/70"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              ) : null}
            </div>
          ))}
          {dateSlots.length < 3 ? (
            <button
              type="button"
              onClick={() => setDateSlots((prev) => [...prev, { date: "", time: "10:00" }])}
              className="flex items-center gap-1.5 self-start text-xs font-bold text-primary"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Add a candidate time
            </button>
          ) : null}
        </div>
      )}

      {state.error ? <p className="text-sm font-medium text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Sending..." : schedulingMode === "availability_pick" ? "Book meeting" : "Send meeting request"}
      </button>
    </form>
  );
};
