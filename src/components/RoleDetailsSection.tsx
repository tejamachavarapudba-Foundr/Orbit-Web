import { Award, ShieldCheck } from "lucide-react";
import { formatExperienceTimeline } from "@/lib/experience";
import type { Certification, PublicVerificationStatus, Profile, WorkExperience } from "@/lib/types";

type RoleDetailsSectionProps = {
  profile: Profile;
  verification: PublicVerificationStatus | null;
};

const ROLE_LABEL: Record<string, string> = {
  investor: "Investor",
  professional: "Professional",
  advisor: "Advisor",
  service_provider: "Service provider"
};

const DetailRow = ({ label, value }: { label: string; value: string }) => {
  if (!value.trim()) return null;
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 py-2.5 text-sm last:border-b-0">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium text-text">{value}</span>
    </div>
  );
};

const toCsv = (values: string[] | undefined) => (values?.length ? values.join(", ") : "");

const ExperienceList = ({ experiences }: { experiences: WorkExperience[] | undefined }) => {
  const items = (experiences ?? []).filter((entry) => entry.company.trim() || entry.designation.trim());
  if (!items.length) return null;

  return (
    <div className="flex flex-col gap-3 border-b border-border/60 py-3">
      <span className="text-sm text-muted">Experience</span>
      {items.map((entry, index) => (
        <div key={index}>
          <p className="text-sm font-semibold text-text">
            {entry.designation || "—"} {entry.company ? `at ${entry.company}` : ""}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
            {[formatExperienceTimeline(entry), entry.location].filter(Boolean).join(" · ")}
          </p>
        </div>
      ))}
    </div>
  );
};

// Highlighted card when the role is verified — meant to grab attention next to
// an unverified profile's plain certification list, mirroring the mobile app.
const CertificationList = ({ certifications, isVerified }: { certifications: Certification[] | undefined; isVerified: boolean }) => {
  const items = (certifications ?? []).filter((entry) => entry.name.trim());
  if (!items.length && !isVerified) return null;

  return (
    <div className={`flex flex-col gap-2 rounded-lg p-3 ${isVerified ? "border border-primary/40 bg-primary-muted/40" : "py-3"}`}>
      <div className="flex items-center gap-1.5">
        {isVerified ? <ShieldCheck className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} /> : null}
        <span className={`text-sm ${isVerified ? "font-semibold text-primary" : "text-muted"}`}>
          {isVerified ? "Verified — Certifications" : "Certifications"}
        </span>
      </div>
      {items.map((entry, index) =>
        entry.fileUrl ? (
          <a
            key={index}
            href={entry.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Award className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
            {entry.name}
          </a>
        ) : (
          <span key={index} className="flex items-center gap-2 text-sm text-text">
            <Award className="h-3.5 w-3.5 flex-shrink-0 text-primary" strokeWidth={2} />
            {entry.name}
          </span>
        )
      )}
    </div>
  );
};

const RoleBadge = () => (
  <span className="flex items-center gap-1 rounded-full bg-primary-muted px-2 py-0.5 text-[11px] font-bold text-primary">
    <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
    Verified
  </span>
);

export const RoleDetailsSection = ({ profile, verification }: RoleDetailsSectionProps) => {
  const role = profile.role;
  const label = ROLE_LABEL[role];
  if (!label) return null;

  const isVerified =
    role === "investor"
      ? Boolean(verification?.investorVerified)
      : role === "professional"
        ? Boolean(verification?.professionalVerified)
        : role === "advisor"
          ? Boolean(verification?.advisorVerified)
          : role === "service_provider"
            ? Boolean(verification?.serviceProviderVerified)
            : false;

  let body: React.ReactNode = null;

  if (role === "investor" && profile.investorProfile) {
    const data = profile.investorProfile;
    body = (
      <>
        <DetailRow label="Fund" value={data.fundName || profile.company} />
        <DetailRow label="Investment range" value={data.investmentRange} />
        <DetailRow label="Industries" value={toCsv(data.industries)} />
        <DetailRow label="Portfolio" value={data.portfolio} />
        <DetailRow label="Geography" value={data.geography} />
      </>
    );
  } else if (role === "advisor" && profile.advisorProfile) {
    const data = profile.advisorProfile;
    body = (
      <>
        <DetailRow label="Expertise" value={toCsv(data.expertise)} />
        <DetailRow label="Experience" value={data.yearsExperience} />
        <DetailRow label="Industries" value={toCsv(data.industries)} />
        <DetailRow label="Mentorship" value={toCsv(data.mentorshipAreas)} />
        <ExperienceList experiences={data.experiences} />
        <CertificationList certifications={data.certifications} isVerified={isVerified} />
      </>
    );
  } else if (role === "professional" && profile.professionalProfile) {
    const data = profile.professionalProfile;
    body = (
      <>
        <DetailRow label="Skills" value={toCsv(data.skills.length ? data.skills : profile.skills)} />
        <DetailRow label="Level" value={data.experienceLevel} />
        <DetailRow label="Portfolio" value={data.portfolio} />
        <ExperienceList experiences={data.experiences} />
        <CertificationList certifications={data.certifications} isVerified={isVerified} />
      </>
    );
  } else if (role === "service_provider" && profile.serviceProviderProfile) {
    const data = profile.serviceProviderProfile;
    body = (
      <>
        <DetailRow label="Company" value={data.company || profile.company} />
        <DetailRow label="Services" value={toCsv(data.services)} />
        <DetailRow label="Client industries" value={toCsv(data.clientIndustries)} />
      </>
    );
  }

  if (!body) return null;

  return (
    <div className="glass mt-4 rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-sm font-bold text-text">{label} details</h2>
        {isVerified ? <RoleBadge /> : null}
      </div>
      <div className="mt-2 flex flex-col">{body}</div>
    </div>
  );
};
