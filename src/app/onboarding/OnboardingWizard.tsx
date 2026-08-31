"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { completeOnboardingAction } from "./actions";
import { MemberRole, ROLE_GOALS, ROLE_GOAL_TITLE, ROLES } from "@/lib/onboarding-data";

type RoleFields = Record<string, string>;

const roleFieldConfig: Record<MemberRole, { key: string; label: string; placeholder: string; mapsToCompany?: boolean }[]> = {
  founder: [
    { key: "startupName", label: "Startup name", placeholder: "e.g. Fernmark Robotics", mapsToCompany: true },
    { key: "industry", label: "Industry", placeholder: "e.g. Robotics, Fintech" },
    { key: "startupStage", label: "Stage", placeholder: "e.g. Idea, Seed, Series A" }
  ],
  investor: [
    { key: "fundName", label: "Fund / firm name", placeholder: "e.g. Orbit Ventures", mapsToCompany: true },
    { key: "investmentRange", label: "Investment range", placeholder: "e.g. $50K - $250K" }
  ],
  advisor: [
    { key: "yearsExperience", label: "Years of experience", placeholder: "e.g. 10 years advising startups" },
    { key: "expertise", label: "Areas of expertise", placeholder: "e.g. Product, Fundraising" }
  ],
  professional: [
    { key: "experienceLevel", label: "Experience level", placeholder: "e.g. 5 years, Senior" },
    { key: "skills", label: "Skills", placeholder: "e.g. React, Node.js, Design" }
  ],
  service_provider: [
    { key: "company", label: "Company name", placeholder: "e.g. Acme Legal Co.", mapsToCompany: true },
    { key: "services", label: "Services offered", placeholder: "e.g. Legal, Accounting" }
  ]
};

type OnboardingWizardProps = {
  fullName: string;
};

export const OnboardingWizard = ({ fullName }: OnboardingWizardProps) => {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<MemberRole | null>(null);
  const [name, setName] = useState(fullName);
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [roleFields, setRoleFields] = useState<RoleFields>({});
  const [goals, setGoals] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalSteps = 3;
  const stepLabels = ["Your role", "Your profile", "Your goals"];

  const canProceedFromRole = role !== null;
  const canProceedFromProfile = name.trim().length > 0 && headline.trim().length > 0;
  const canSubmit = goals.length > 0;

  const toggleGoal = (goal: string) => {
    setGoals((current) => (current.includes(goal) ? current.filter((g) => g !== goal) : [...current, goal]));
  };

  const setRoleField = (key: string, value: string) => {
    setRoleFields((current) => ({ ...current, [key]: value }));
  };

  const submit = () => {
    if (!role) return;
    setError(null);

    const companyField = roleFieldConfig[role].find((f) => f.mapsToCompany);
    const company = companyField ? (roleFields[companyField.key] ?? "") : "";

    const roleData: Record<string, unknown> = {};
    for (const field of roleFieldConfig[role]) {
      const value = roleFields[field.key] ?? "";
      // Must match the Prisma column type each role's data actually writes
      // to (FounderProfile.industry, AdvisorProfile.expertise,
      // ProfessionalProfile.skills, ServiceProviderProfile.services are all
      // String[]) — sending a raw string for any of these throws a Prisma
      // validation error server-side, which onboarding/actions.ts then
      // surfaces as a generic "Something went wrong."
      const arrayFields = ["industry", "expertise", "skills", "services"];
      roleData[field.key] = arrayFields.includes(field.key) ? splitCsv(value) : value;
    }
    roleData.goals = goals;

    startTransition(async () => {
      const result = await completeOnboardingAction({
        memberRole: role,
        quickProfile: {
          fullName: name.trim(),
          headline: headline.trim(),
          location: location.trim(),
          company,
          website: "",
          linkedinUrl: linkedinUrl.trim()
        },
        roleProfile: { role, data: roleData },
        goals
      });
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="glass w-full max-w-lg rounded-2xl p-7">
      <div className="mb-6 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary shadow-md shadow-primary/30">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l2.9 6.6L22 9.6l-5 4.9 1.2 6.9L12 18l-6.2 3.4L7 14.5 2 9.6l7.1-1z" />
          </svg>
        </span>
        <span className="font-display text-base font-bold text-text">Orbit</span>
      </div>

      <div className="mb-6 flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-gradient-to-r from-primary to-indigo-400" : "bg-muted-bg"}`} />
        ))}
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-primary">
        Step {step + 1} of {totalSteps}
      </p>

      {step === 0 ? (
        <>
          <h1 className="mt-1 font-display text-xl font-bold text-text">Who are you on Orbit?</h1>
          <p className="mt-1 text-sm text-muted">Pick the role that fits best — you can add more detail later.</p>

          <div className="mt-5 flex flex-col gap-2.5">
            {ROLES.map(({ value, label, description, Icon }) => {
              const selected = role === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                    selected ? "border-primary bg-primary-muted/60" : "border-border/70 bg-muted-bg/40 hover:bg-muted-bg/70"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                      selected ? "bg-primary text-on-primary" : "bg-surface text-muted"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-text">{label}</span>
                    <span className="block text-xs text-muted">{description}</span>
                  </span>
                  {selected ? (
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </>
      ) : null}

      {step === 1 && role ? (
        <>
          <h1 className="mt-1 font-display text-xl font-bold text-text">Tell us about yourself</h1>
          <p className="mt-1 text-sm text-muted">This shows up on your profile.</p>

          <div className="mt-5 flex flex-col gap-3.5">
            <Field label="Full name" value={name} onChange={setName} placeholder="Your name" />
            <Field label="Headline" value={headline} onChange={setHeadline} placeholder="e.g. Founder at Fernmark Robotics" />
            <Field label="Location" value={location} onChange={setLocation} placeholder="e.g. Bengaluru, India" />
            <Field label="LinkedIn (optional)" value={linkedinUrl} onChange={setLinkedinUrl} placeholder="https://linkedin.com/in/..." />

            {roleFieldConfig[role].map((field) => (
              <Field
                key={field.key}
                label={field.label}
                value={roleFields[field.key] ?? ""}
                onChange={(v) => setRoleField(field.key, v)}
                placeholder={field.placeholder}
              />
            ))}
          </div>
        </>
      ) : null}

      {step === 2 && role ? (
        <>
          <h1 className="mt-1 font-display text-xl font-bold text-text">{ROLE_GOAL_TITLE[role]}</h1>
          <p className="mt-1 text-sm text-muted">Pick as many as apply — this shapes who you'll see on Orbit.</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {ROLE_GOALS[role].map((goal) => {
              const selected = goals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`rounded-full border px-3.5 py-2 text-xs font-bold transition ${
                    selected
                      ? "border-primary bg-gradient-to-r from-primary to-indigo-500 text-on-primary shadow-md shadow-primary/20"
                      : "border-border/70 bg-muted-bg/40 text-text hover:bg-muted-bg/70"
                  }`}
                >
                  {goal}
                </button>
              );
            })}
          </div>

          {error ? <p className="mt-4 rounded-xl bg-danger-bg px-3 py-2 text-sm font-medium text-danger">{error}</p> : null}
        </>
      ) : null}

      <div className="mt-7 flex gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-border/70 text-sm font-bold text-text hover:bg-muted-bg/70"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Back
          </button>
        ) : null}

        {step < totalSteps - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 ? !canProceedFromRole : !canProceedFromProfile}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-50"
          >
            Continue
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit || isPending}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Enter Orbit"}
          </button>
        )}
      </div>
    </div>
  );
};

const splitCsv = (value: string) =>
  value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

const Field = ({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-sm font-medium text-text">{label}</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-11 rounded-xl border border-border/70 bg-muted-bg/50 px-3.5 text-sm text-text outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20"
    />
  </label>
);
