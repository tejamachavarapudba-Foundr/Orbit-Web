import { CheckCircle2, Clock, ShieldCheck, ShieldX, Smartphone, XCircle } from "lucide-react";
import { getMe } from "@/lib/auth";

import { FormHeader } from "@/components/FormHeader";
import { apiFetch } from "@/lib/api";
import type { AuthMe, VerificationStatus } from "@/lib/types";

import { FounderVerificationForm } from "./FounderVerificationForm";
import { RoleVerificationForm } from "./RoleVerificationForm";

export const dynamic = "force-dynamic";

const statusChip = (status: "pending" | "approved" | "rejected") => {
  if (status === "approved") return { label: "Approved", className: "bg-success-bg text-success", Icon: CheckCircle2 };
  if (status === "rejected") return { label: "Rejected", className: "bg-danger-bg text-danger", Icon: XCircle };
  return { label: "Pending review", className: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300", Icon: Clock };
};

export default async function VerifyProfilePage() {
  const [me, status] = await Promise.all([getMe(), apiFetch<VerificationStatus>("/verification/status")]);
  const role = me.profile.role;

  const roleVerified =
    role === "investor" ? status.investorVerified : role === "professional" ? status.professionalVerified : role === "advisor" ? status.advisorVerified : role === "service_provider" ? status.serviceProviderVerified : null;

  return (
    <div className="max-w-140">
      <FormHeader title="Verify profile" description="Identity and role verification" backHref="/settings" />

      <div className="glass mb-4 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${status.identityVerified ? "bg-success-bg text-success" : "bg-muted-bg text-muted"}`}>
            <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-text">Identity verification</div>
            <div className="text-xs text-muted">{status.identityVerified ? "Verified via DigiLocker" : "Not verified yet"}</div>
          </div>
        </div>
        {!status.identityVerified ? (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-muted-bg/60 px-3 py-2.5 text-xs text-muted">
            <Smartphone className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
            Identity verification via DigiLocker is available in the Orbit mobile app.
          </div>
        ) : null}
      </div>

      {role === "founder" ? (
        <div className="glass rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-text">Founder verification</h2>
            {status.founder ? (
              <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${statusChip(status.founder.status).className}`}>
                {statusChip(status.founder.status).label}
              </span>
            ) : null}
          </div>

          {status.founder ? (
            <div className="flex flex-col gap-2 text-sm text-text">
              <div>
                <span className="text-xs text-muted">Certificate name</span>
                <div className="font-semibold">{status.founder.certificateName}</div>
              </div>
              {status.founder.cinNumber ? (
                <div>
                  <span className="text-xs text-muted">CIN</span>
                  <div className="font-semibold">{status.founder.cinNumber}</div>
                </div>
              ) : null}
              {status.founder.reviewNotes ? (
                <div className="mt-1 rounded-xl bg-muted-bg/60 px-3 py-2.5 text-xs text-muted">{status.founder.reviewNotes}</div>
              ) : null}
              {status.founder.status === "rejected" ? (
                <div className="mt-2 border-t border-border/60 pt-3">
                  <p className="mb-2 text-xs text-muted">Your submission was rejected — you can resubmit below.</p>
                  <FounderVerificationForm />
                </div>
              ) : null}
            </div>
          ) : (
            <FounderVerificationForm />
          )}
        </div>
      ) : role === "investor" || role === "professional" || role === "advisor" || role === "service_provider" ? (
        <div className="glass rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold capitalize text-text">{role.replace(/_/g, " ")} verification</h2>
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${roleVerified ? "bg-success-bg text-success" : "bg-muted-bg text-muted"}`}
            >
              {roleVerified ? <CheckCircle2 className="h-3 w-3" strokeWidth={2} /> : <ShieldX className="h-3 w-3" strokeWidth={2} />}
              {roleVerified ? "Verified" : "Incomplete"}
            </span>
          </div>
          <p className="mb-3 text-xs text-muted">
            {role === "investor"
              ? "Add your company name and website — this unlocks investor snapshots on startups."
              : role === "service_provider"
                ? "Add your company name, website and LinkedIn page."
                : "Add your work experience and any certifications — this boosts how your profile appears to others. Certifications are optional."}
          </p>
          <RoleVerificationForm role={role} profile={me.profile} />
        </div>
      ) : null}
    </div>
  );
}
