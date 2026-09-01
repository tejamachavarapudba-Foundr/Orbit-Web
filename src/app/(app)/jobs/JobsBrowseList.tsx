"use client";

import { useMemo, useState } from "react";
import { Sliders, X } from "lucide-react";

import type { Job } from "@/lib/types";

import { JobCard } from "./JobCard";

const roleOptions = ["all", "engineer", "designer", "marketing", "sales", "operations", "product", "advisor", "mentor"];

const roleLabel = (value: string) => (value === "all" ? "All roles" : value);

type JobsBrowseListProps = {
  jobs: Job[];
};

export const JobsBrowseList = ({ jobs }: JobsBrowseListProps) => {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const hasActiveFilters = role !== "all";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesRole = role === "all" || job.role.toLowerCase() === role;
      if (!matchesRole) return false;
      if (!q) return true;
      const haystack = [job.heading, job.startupName, job.role, job.experience, job.description, ...job.skills].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [jobs, query, role]);

  return (
    <div>
      <div className="mt-1 mb-4 flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jobs, startups, skills..."
          className="h-11 flex-1 rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
        />
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          aria-label="Filter & sort"
          className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-border/70 bg-muted-bg/60 text-text hover:bg-muted-bg"
        >
          <Sliders className="h-4 w-4" strokeWidth={2} />
          {hasActiveFilters ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" /> : null}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-sm font-semibold text-text">No jobs found</p>
          <p className="mt-1 text-sm text-muted">Try a different search or post the first startup role.</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {filterOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center" onClick={() => setFilterOpen(false)}>
          <div
            className="glass-strong w-full max-w-md rounded-t-3xl p-5 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-text">Filter &amp; Sort</h2>
              <button type="button" onClick={() => setFilterOpen(false)} aria-label="Close" className="text-muted hover:text-text">
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Role</p>
            <div className="flex flex-wrap gap-1.5">
              {roleOptions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize transition ${
                    role === r ? "bg-gradient-to-r from-primary to-indigo-500 text-on-primary" : "glass text-muted hover:text-text"
                  }`}
                >
                  {roleLabel(r)}
                </button>
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setRole("all")}
                className="flex-1 rounded-full border border-border/70 px-4 py-2.5 text-sm font-bold text-text hover:bg-muted-bg/70"
              >
                Clear filters
              </button>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="flex-1 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2.5 text-sm font-bold text-on-primary"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
