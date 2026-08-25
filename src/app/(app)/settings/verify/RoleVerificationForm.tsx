"use client";

import { useState, useTransition } from "react";
import { Trash2, Upload } from "lucide-react";

import { MONTH_OPTIONS, YEAR_OPTIONS, emptyWorkExperience } from "@/lib/experience";
import type { Certification, Profile, WorkExperience } from "@/lib/types";

import {
  submitExperienceVerificationAction,
  submitInvestorVerificationAction,
  submitServiceProviderVerificationAction,
  uploadCertificationFileAction
} from "./actions";

const inputClass =
  "h-10 w-full rounded-xl border border-border/70 bg-muted-bg/60 px-3 text-sm text-text outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15";
const labelClass = "text-xs font-semibold text-text";

const MonthYearSelect = ({
  label,
  value,
  onChange
}: {
  label: string;
  value: string; // "YYYY-MM"
  onChange: (value: string) => void;
}) => {
  const [year, month] = value.split("-");

  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      <div className="flex gap-2">
        <select value={month ?? ""} onChange={(e) => onChange(`${year ?? ""}-${e.target.value}`)} className={inputClass}>
          <option value="" disabled>
            Month
          </option>
          {MONTH_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select value={year ?? ""} onChange={(e) => onChange(`${e.target.value}-${month ?? ""}`)} className={inputClass}>
          <option value="" disabled>
            Year
          </option>
          {YEAR_OPTIONS.map((y) => (
            <option key={y.value} value={y.value}>
              {y.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
};

const ExperienceEditor = ({
  experiences,
  onChange
}: {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}) => {
  const updateEntry = (index: number, patch: Partial<WorkExperience>) => {
    onChange(experiences.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));
  };
  const removeEntry = (index: number) => onChange(experiences.filter((_, i) => i !== index));

  // Only one experience can be "current" at a time — checking it here
  // unchecks it everywhere else, and moves this entry to the front, which
  // is what the "Current / most recent" label on index 0 already assumes.
  const toggleCurrent = (index: number) => {
    const target = experiences[index];
    if (!target) return;

    if (target.isCurrent) {
      updateEntry(index, { isCurrent: false });
      return;
    }

    const current: WorkExperience = { ...target, isCurrent: true, endDate: "" };
    const rest = experiences.filter((_, i) => i !== index).map((entry) => ({ ...entry, isCurrent: false }));
    onChange([current, ...rest]);
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold text-text">Work experience</span>
      {experiences.map((entry, index) => (
        <div key={index} className="flex flex-col gap-3 rounded-xl border border-border/70 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">{entry.isCurrent ? "Current" : index === 0 ? "Most recent" : `Experience ${index + 1}`}</span>
            <button type="button" onClick={() => removeEntry(index)} aria-label="Remove" className="text-muted hover:text-danger">
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Company name</span>
            <input value={entry.company} onChange={(e) => updateEntry(index, { company: e.target.value })} className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Designation</span>
            <input
              value={entry.designation}
              onChange={(e) => updateEntry(index, { designation: e.target.value })}
              placeholder="e.g. Senior Software Engineer"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Location</span>
            <input value={entry.location} onChange={(e) => updateEntry(index, { location: e.target.value })} className={inputClass} />
          </label>
          <label className="flex items-center gap-2 text-sm text-text">
            <input type="checkbox" checked={entry.isCurrent} onChange={() => toggleCurrent(index)} className="h-4 w-4 accent-primary" />
            I currently work here
          </label>
          <MonthYearSelect label="Start date" value={entry.startDate} onChange={(v) => updateEntry(index, { startDate: v })} />
          {!entry.isCurrent ? (
            <MonthYearSelect label="End date" value={entry.endDate} onChange={(v) => updateEntry(index, { endDate: v })} />
          ) : null}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...experiences, emptyWorkExperience()])}
        className="self-start rounded-full border border-border/70 px-4 py-1.5 text-xs font-bold text-text hover:bg-muted-bg/70"
      >
        + Add experience
      </button>
    </div>
  );
};

const CertificationEditor = ({
  certifications,
  onChange
}: {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
}) => {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const updateEntry = (index: number, patch: Partial<Certification>) => {
    onChange(certifications.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));
  };
  const removeEntry = (index: number) => onChange(certifications.filter((_, i) => i !== index));

  const handleUpload = async (index: number, file: File) => {
    setUploadError(null);
    setUploadingIndex(index);
    const body = new FormData();
    body.set("file", file);
    const result = await uploadCertificationFileAction(body);
    setUploadingIndex(null);
    if ("error" in result) {
      setUploadError(result.error);
      return;
    }
    updateEntry(index, { fileUrl: result.url, fileKey: result.path });
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold text-text">Certifications (optional)</span>
      {certifications.map((entry, index) => (
        <div key={index} className="flex flex-col gap-3 rounded-xl border border-border/70 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Certification {index + 1}</span>
            <button type="button" onClick={() => removeEntry(index)} aria-label="Remove" className="text-muted hover:text-danger">
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Certification name</span>
            <input
              value={entry.name}
              onChange={(e) => updateEntry(index, { name: e.target.value })}
              placeholder="e.g. AWS Certified Solutions Architect"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Certificate file</span>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(index, file);
              }}
              className="rounded-xl border border-dashed border-border/70 bg-muted-bg/60 px-3 py-2.5 text-xs text-text file:mr-3 file:rounded-full file:border-0 file:bg-primary-muted file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-primary"
            />
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <Upload className="h-3 w-3" strokeWidth={2} />
              {uploadingIndex === index ? "Uploading..." : entry.fileUrl ? "File attached" : "PDF or image"}
            </span>
          </label>
        </div>
      ))}
      {uploadError ? <p className="text-xs font-medium text-danger">{uploadError}</p> : null}
      <button
        type="button"
        onClick={() => onChange([...certifications, { name: "", fileUrl: "", fileKey: "" }])}
        className="self-start rounded-full border border-border/70 px-4 py-1.5 text-xs font-bold text-text hover:bg-muted-bg/70"
      >
        + Add certification
      </button>
    </div>
  );
};

type RoleVerificationFormProps = {
  role: "investor" | "professional" | "advisor" | "service_provider";
  profile: Profile;
};

export const RoleVerificationForm = ({ role, profile }: RoleVerificationFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [company, setCompany] = useState(profile.company ?? "");
  const [website, setWebsite] = useState(profile.website ?? "");

  const roleData = role === "professional" ? profile.professionalProfile : role === "advisor" ? profile.advisorProfile : null;
  const [experiences, setExperiences] = useState<WorkExperience[]>(
    roleData?.experiences?.length ? roleData.experiences : [emptyWorkExperience()]
  );
  const [certifications, setCertifications] = useState<Certification[]>(roleData?.certifications ?? []);

  // Onboarding's Quick Profile step already collects company/website/LinkedIn
  // for service providers (mapped to the shared profile fields) — falling
  // back to those here means this form isn't asking the user to re-enter
  // the same details a second time from blank, which looked like "onboarding
  // details aren't carrying over" even though they were saved correctly.
  const spData = profile.serviceProviderProfile;
  const [spCompany, setSpCompany] = useState(spData?.company || profile.company || "");
  const [spWebsite, setSpWebsite] = useState(spData?.website || profile.website || "");
  const [spLinkedin, setSpLinkedin] = useState(spData?.companyLinkedinUrl || profile.linkedinUrl || "");

  const submit = () => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      let result: { error: string | null };
      if (role === "investor") {
        result = await submitInvestorVerificationAction(company, website);
      } else if (role === "service_provider") {
        result = await submitServiceProviderVerificationAction(spData ?? {}, spCompany, spWebsite, spLinkedin);
      } else {
        result = await submitExperienceVerificationAction(role, roleData ?? {}, experiences, certifications);
      }

      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess("Saved.");
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {role === "investor" ? (
        <>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Company name</span>
            <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Orbit Ventures" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Website</span>
            <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." className={inputClass} />
          </label>
        </>
      ) : null}

      {role === "professional" || role === "advisor" ? (
        <>
          <ExperienceEditor experiences={experiences} onChange={setExperiences} />
          <CertificationEditor certifications={certifications} onChange={setCertifications} />
        </>
      ) : null}

      {role === "service_provider" ? (
        <>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Company name</span>
            <input value={spCompany} onChange={(e) => setSpCompany(e.target.value)} className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Website</span>
            <input value={spWebsite} onChange={(e) => setSpWebsite(e.target.value)} placeholder="https://..." className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Company LinkedIn</span>
            <input
              value={spLinkedin}
              onChange={(e) => setSpLinkedin(e.target.value)}
              placeholder="https://linkedin.com/company/..."
              className={inputClass}
            />
          </label>
        </>
      ) : null}

      {error ? <p className="text-xs font-medium text-danger">{error}</p> : null}
      {success ? <p className="text-xs font-medium text-success">{success}</p> : null}

      <button
        type="button"
        disabled={isPending}
        onClick={submit}
        className="self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </div>
  );
};
