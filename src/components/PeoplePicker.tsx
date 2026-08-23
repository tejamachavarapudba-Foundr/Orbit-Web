"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import type { Profile } from "@/lib/types";

type PeoplePickerProps = {
  people: Profile[];
  selectedIds: Set<string>;
  onToggle: (person: Profile) => void;
  disabledIds?: Set<string>;
  fieldName?: string;
};

export const PeoplePicker = ({ people, selectedIds, onToggle, disabledIds, fieldName }: PeoplePickerProps) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const pool = query
      ? people.filter((p) => (p.fullName || "").toLowerCase().includes(query) || (p.headline || "").toLowerCase().includes(query))
      : people;
    return pool.slice(0, 30);
  }, [people, search]);

  const selected = people.filter((p) => selectedIds.has(p.id));

  return (
    <div className="flex flex-col gap-2">
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((p) => (
            <span key={p.id} className="flex items-center gap-1.5 rounded-full bg-primary-muted px-2.5 py-1 text-xs font-bold text-primary">
              {p.fullName}
              {fieldName ? <input type="hidden" name={fieldName} value={p.id} /> : null}
              {!disabledIds?.has(p.id) ? (
                <button type="button" onClick={() => onToggle(p)} aria-label={`Remove ${p.fullName}`}>
                  <X className="h-3 w-3" strokeWidth={2.5} />
                </button>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" strokeWidth={2} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="w-full rounded-xl border border-border/70 bg-muted-bg/60 py-2.5 pl-9 pr-3 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
        />
      </div>
      <div className="flex max-h-44 flex-col gap-0.5 overflow-y-auto rounded-xl border border-border/70 p-1.5">
        {filtered.length === 0 ? (
          <p className="p-2 text-xs text-muted">No matches.</p>
        ) : (
          filtered.map((p) => {
            const isDisabled = disabledIds?.has(p.id) ?? false;
            return (
              <button
                key={p.id}
                type="button"
                disabled={isDisabled}
                onClick={() => onToggle(p)}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-muted-bg/70 disabled:opacity-50"
              >
                <input type="checkbox" readOnly checked={selectedIds.has(p.id) || isDisabled} className="h-3.5 w-3.5 accent-primary" />
                <span className="min-w-0 flex-1 truncate font-semibold text-text">{p.fullName || "Unnamed"}</span>
                <span className="truncate text-muted">{isDisabled ? "Already a member" : p.headline}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
