"use client";

import { useActionState, useState } from "react";

import { TimeSelect } from "@/components/TimeSelect";
import { saveAvailabilityAction, type SaveAvailabilityState } from "./actions";
import type { AvailabilitySlot } from "@/lib/types";

const initialState: SaveAvailabilityState = { error: null };

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const inputClass =
  "rounded-xl border border-border/70 bg-muted-bg/60 px-3 py-2 text-sm text-text outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15";

type AvailabilityFormProps = {
  existing: AvailabilitySlot[];
};

export const AvailabilityForm = ({ existing }: AvailabilityFormProps) => {
  const [state, formAction, isPending] = useActionState(saveAvailabilityAction, initialState);

  const byDay = new Map(existing.map((slot) => [slot.dayOfWeek, slot]));
  const [enabledDays, setEnabledDays] = useState<Set<number>>(new Set(existing.map((s) => s.dayOfWeek)));

  const toggleDay = (day: number) => {
    setEnabledDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  return (
    <form action={formAction} className="glass flex flex-col gap-3 rounded-2xl p-6">
      <input type="hidden" name="timezone" value={Intl.DateTimeFormat().resolvedOptions().timeZone} />

      {DAYS.map((label, day) => {
        const isOn = enabledDays.has(day);
        const slot = byDay.get(day);
        return (
          <div key={day} className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 ${isOn ? "border-primary/40 bg-primary-muted/20" : "border-border/70"}`}>
            {isOn ? <input type="hidden" name="enabledDay" value={day} /> : null}
            <label className="flex flex-1 items-center gap-3">
              <input
                type="checkbox"
                checked={isOn}
                onChange={() => toggleDay(day)}
                className="h-4.5 w-4.5 flex-shrink-0 accent-primary"
              />
              <span className="w-24 flex-shrink-0 text-sm font-semibold text-text">{label}</span>
            </label>
            {isOn ? (
              <div className="flex flex-shrink-0 items-center gap-2">
                <TimeSelect name={`start_${day}`} defaultValue={slot?.startTime ?? "09:00"} className={inputClass} />
                <span className="text-xs text-muted">to</span>
                <TimeSelect name={`end_${day}`} defaultValue={slot?.endTime ?? "17:00"} className={inputClass} />
              </div>
            ) : null}
          </div>
        );
      })}

      {state.error ? <p className="text-sm font-medium text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save availability"}
      </button>
    </form>
  );
};
