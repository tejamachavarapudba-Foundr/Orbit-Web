"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload } from "lucide-react";

import type { InvestorSnapshot } from "@/lib/types";

import { extractPitchDeckAction, saveInvestorSnapshotAction } from "./actions";

// Every field here maps 1:1 to a number/text input — no array-typed fields
// exist on this model (unlike FounderProfile.industry, the source of the
// onboarding bug), so there's no string-vs-array mismatch risk in this form.
type FormValues = Record<keyof Omit<InvestorSnapshot, "id" | "projectId" | "completionPercentage" | "isCompleted" | "isInvestorReady">, string>;

const NUMBER_FIELDS = new Set<keyof FormValues>([
  "totalUsers", "activeUsers", "payingCustomers", "enterpriseCustomers", "customerGrowthRate", "revenueGrowthRate",
  "mrr", "arr", "cashBalance", "burnRate", "runwayMonths", "grossMargin", "cac", "ltv", "ltvCacRatio", "churnRate",
  "ebitda", "ebitdaPercent", "amountRaising", "minimumCheckSize", "maximumCheckSize", "equityOffered",
  "founderOwnership", "employeeEsop", "investorOwnership", "availablePool"
]);

const toFormValues = (snapshot: InvestorSnapshot | null): FormValues => {
  const empty = {} as FormValues;
  const keys: (keyof FormValues)[] = [
    "targetCustomers", "businessModel", "revenueStreams", "marketOpportunity", "startupVision", "problemStatement",
    "solutionSummary", "totalUsers", "activeUsers", "payingCustomers", "enterpriseCustomers", "customerGrowthRate",
    "revenueGrowthRate", "keyPartnerships", "majorAchievements", "mrr", "arr", "cashBalance", "burnRate",
    "runwayMonths", "grossMargin", "cac", "ltv", "ltvCacRatio", "churnRate", "ebitda", "ebitdaPercent",
    "currentRound", "amountRaising", "minimumCheckSize", "maximumCheckSize", "equityOffered", "founderOwnership",
    "employeeEsop", "investorOwnership", "availablePool"
  ];
  for (const key of keys) {
    const value = snapshot?.[key];
    empty[key] = value === null || value === undefined ? "" : String(value);
  }
  return empty;
};

const inputClass =
  "w-full rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15";

const Field = ({
  label,
  value,
  onChange,
  multiline,
  suffix
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  suffix?: string;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-sm font-semibold text-text">{label}</span>
    {multiline ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`${inputClass} resize-none`} />
    ) : (
      <div className="relative">
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
        {suffix ? <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted">{suffix}</span> : null}
      </div>
    )}
  </label>
);

type InvestorSnapshotFormProps = {
  projectId: string;
  initialSnapshot: InvestorSnapshot | null;
};

export const InvestorSnapshotForm = ({ projectId, initialSnapshot }: InvestorSnapshotFormProps) => {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(() => toFormValues(initialSnapshot));
  const [isCompleted, setIsCompleted] = useState(initialSnapshot?.isCompleted ?? false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isExtracting, startExtracting] = useTransition();

  const set = (key: keyof FormValues) => (value: string) => setValues((current) => ({ ...current, [key]: value }));

  // Mirrors OwnershipScreen.tsx's auto-computed LTV:CAC ratio.
  const handleLtvOrCacChange = (key: "ltv" | "cac", value: string) => {
    setValues((current) => {
      const next = { ...current, [key]: value };
      const ltv = Number(key === "ltv" ? value : current.ltv);
      const cac = Number(key === "cac" ? value : current.cac);
      if (ltv > 0 && cac > 0) next.ltvCacRatio = (ltv / cac).toFixed(2);
      return next;
    });
  };

  const ownershipTotal = useMemo(
    () =>
      (Number(values.founderOwnership) || 0) +
      (Number(values.employeeEsop) || 0) +
      (Number(values.investorOwnership) || 0) +
      (Number(values.availablePool) || 0),
    [values.founderOwnership, values.employeeEsop, values.investorOwnership, values.availablePool]
  );

  // A live approximation of "how filled in is this" — mobile bumps this in
  // fixed steps per wizard screen; a single-page form has no separate steps
  // to bump on, so this counts non-empty fields directly instead.
  const completionPercentage = useMemo(() => {
    const keys = Object.keys(values) as (keyof FormValues)[];
    const filled = keys.filter((k) => values[k].trim() !== "").length;
    return Math.round((filled / keys.length) * 100);
  }, [values]);

  const buildPayload = (extra: Partial<InvestorSnapshot> = {}): Partial<InvestorSnapshot> => {
    const payload: Record<string, unknown> = { completionPercentage, ...extra };
    for (const key of Object.keys(values) as (keyof FormValues)[]) {
      const raw = values[key];
      if (NUMBER_FIELDS.has(key)) {
        payload[key] = raw.trim() === "" ? null : Number(raw);
      } else {
        payload[key] = raw;
      }
    }
    return payload as Partial<InvestorSnapshot>;
  };

  const save = (extra: Partial<InvestorSnapshot> = {}) => {
    setError(null);
    startSaving(async () => {
      const result = await saveInvestorSnapshotAction(projectId, buildPayload(extra));
      if (result.error) {
        setError(result.error);
        return;
      }
      if (extra.isCompleted) setIsCompleted(true);
      setInfo("Saved.");
      router.refresh();
    });
  };

  const handleExtract = (file: File) => {
    setError(null);
    setInfo(null);
    startExtracting(async () => {
      const formData = new FormData();
      formData.set("file", file);
      const result = await extractPitchDeckAction(projectId, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (!result.extracted) return;

      let filledCount = 0;
      setValues((current) => {
        const next = { ...current };
        for (const [key, value] of Object.entries(result.extracted!)) {
          if (!(key in next)) continue;
          const isEmpty = value === null || value === undefined || (typeof value === "string" && value.trim() === "");
          if (isEmpty) continue;
          next[key as keyof FormValues] = String(value);
          filledCount += 1;
        }
        return next;
      });
      setInfo(
        filledCount > 0
          ? `Auto-filled ${filledCount} field${filledCount === 1 ? "" : "s"} from your PDF — review before saving.`
          : "Couldn't find anything usable in that PDF — fill in the details manually."
      );
    });
  };

  return (
    <div>
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold text-text">Investor Snapshot</h1>
            <p className="mt-1 text-sm text-muted">{completionPercentage}% complete{isCompleted ? " · Published" : ""}</p>
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-xs font-bold text-primary hover:bg-primary-muted">
            {isExtracting ? "Reading PDF..." : <><Upload className="h-3.5 w-3.5" strokeWidth={2} /> Upload pitch deck</>}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              disabled={isExtracting}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleExtract(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted">
          <FileText className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
          Upload your existing pitch deck and we&apos;ll pre-fill what we can find — you still review and edit everything before saving.
        </p>
        {info ? <p className="mt-2 text-xs font-semibold text-success">{info}</p> : null}
        {error ? <p className="mt-2 text-xs font-semibold text-danger">{error}</p> : null}
      </div>

      <div className="glass mt-4 rounded-2xl p-4">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Business summary</h2>
        <div className="flex flex-col gap-4">
          <Field label="Target customers" value={values.targetCustomers} onChange={set("targetCustomers")} />
          <Field label="Business model" value={values.businessModel} onChange={set("businessModel")} />
          <Field label="Revenue streams" value={values.revenueStreams} onChange={set("revenueStreams")} />
          <Field label="Market opportunity" value={values.marketOpportunity} onChange={set("marketOpportunity")} />
          <Field label="Problem statement" value={values.problemStatement} onChange={set("problemStatement")} multiline />
          <Field label="Solution summary" value={values.solutionSummary} onChange={set("solutionSummary")} multiline />
          <Field label="Startup vision" value={values.startupVision} onChange={set("startupVision")} multiline />
        </div>
      </div>

      <div className="glass mt-4 rounded-2xl p-4">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Traction</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Total users" value={values.totalUsers} onChange={set("totalUsers")} />
          <Field label="Active users" value={values.activeUsers} onChange={set("activeUsers")} />
          <Field label="Paying customers" value={values.payingCustomers} onChange={set("payingCustomers")} />
          <Field label="Enterprise customers" value={values.enterpriseCustomers} onChange={set("enterpriseCustomers")} />
          <Field label="Customer growth" value={values.customerGrowthRate} onChange={set("customerGrowthRate")} suffix="%" />
          <Field label="Revenue growth" value={values.revenueGrowthRate} onChange={set("revenueGrowthRate")} suffix="%" />
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <Field label="Key partnerships" value={values.keyPartnerships} onChange={set("keyPartnerships")} multiline />
          <Field label="Major achievements" value={values.majorAchievements} onChange={set("majorAchievements")} multiline />
        </div>
      </div>

      <div className="glass mt-4 rounded-2xl p-4">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Financial</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="MRR" value={values.mrr} onChange={set("mrr")} />
          <Field label="ARR" value={values.arr} onChange={set("arr")} />
          <Field label="Cash balance" value={values.cashBalance} onChange={set("cashBalance")} />
          <Field label="Burn rate" value={values.burnRate} onChange={set("burnRate")} />
          <Field label="Runway (months)" value={values.runwayMonths} onChange={set("runwayMonths")} />
          <Field label="Gross margin" value={values.grossMargin} onChange={set("grossMargin")} suffix="%" />
          <Field label="CAC" value={values.cac} onChange={(v) => handleLtvOrCacChange("cac", v)} />
          <Field label="LTV" value={values.ltv} onChange={(v) => handleLtvOrCacChange("ltv", v)} />
          <Field label="LTV:CAC ratio" value={values.ltvCacRatio} onChange={set("ltvCacRatio")} />
          <Field label="Churn rate" value={values.churnRate} onChange={set("churnRate")} suffix="%" />
          <Field label="EBITDA" value={values.ebitda} onChange={set("ebitda")} />
          <Field label="EBITDA margin" value={values.ebitdaPercent} onChange={set("ebitdaPercent")} suffix="%" />
        </div>
      </div>

      <div className="glass mt-4 rounded-2xl p-4">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Ownership &amp; fundraising</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Current round" value={values.currentRound} onChange={set("currentRound")} />
          <Field label="Amount raising" value={values.amountRaising} onChange={set("amountRaising")} />
          <Field label="Minimum check size" value={values.minimumCheckSize} onChange={set("minimumCheckSize")} />
          <Field label="Maximum check size" value={values.maximumCheckSize} onChange={set("maximumCheckSize")} />
          <Field label="Equity offered" value={values.equityOffered} onChange={set("equityOffered")} suffix="%" />
          <Field label="Founder ownership" value={values.founderOwnership} onChange={set("founderOwnership")} suffix="%" />
          <Field label="Employee ESOP" value={values.employeeEsop} onChange={set("employeeEsop")} suffix="%" />
          <Field label="Investor ownership" value={values.investorOwnership} onChange={set("investorOwnership")} suffix="%" />
          <Field label="Available pool" value={values.availablePool} onChange={set("availablePool")} suffix="%" />
        </div>
        <p className={`mt-3 text-sm font-bold ${ownershipTotal === 100 ? "text-success" : "text-danger"}`}>
          {ownershipTotal === 100 ? "✓ Ownership structure is valid" : `Ownership must equal 100% (currently ${ownershipTotal}%)`}
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => save()}
          className="flex-1 rounded-full border border-border/70 px-5 py-2.5 text-sm font-bold text-text hover:bg-muted-bg/70 disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save draft"}
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => save({ isCompleted: true, isInvestorReady: true, completionPercentage: 100 })}
          className="flex-1 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
        >
          {isSaving ? "Publishing..." : isCompleted ? "Update & keep published" : "Publish investor snapshot"}
        </button>
      </div>
    </div>
  );
};
