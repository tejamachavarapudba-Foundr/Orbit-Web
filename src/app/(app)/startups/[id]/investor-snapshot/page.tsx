import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getMe } from "@/lib/auth";
import { apiFetch, ApiError } from "@/lib/api";
import type { StartupDetail } from "@/lib/types";

import { getInvestorSnapshotAction } from "./actions";
import { InvestorSnapshotForm } from "./InvestorSnapshotForm";
import { InvestorSnapshotView } from "./InvestorSnapshotView";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function InvestorSnapshotPage({ params }: PageProps) {
  const { id } = await params;
  const [me, startup, snapshot] = await Promise.all([
    getMe(),
    apiFetch<StartupDetail>(`/startups/${id}`).catch((error) => {
      if (error instanceof ApiError) return null;
      throw error;
    }),
    getInvestorSnapshotAction(id)
  ]);

  const isOwner = startup?.owner?.id === me.id;

  return (
    <div className="max-w-160">
      <Link href={`/startups/${id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        Back to {startup?.name ?? "startup"}
      </Link>

      {isOwner ? (
        <InvestorSnapshotForm projectId={id} initialSnapshot={snapshot} />
      ) : snapshot ? (
        <InvestorSnapshotView snapshot={snapshot} startupName={startup?.name ?? ""} />
      ) : (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-sm font-semibold text-text">Investor snapshot not available</p>
          <p className="mt-1 text-sm text-muted">
            This startup hasn&apos;t published an investor snapshot yet, or it&apos;s not visible to your account.
          </p>
        </div>
      )}
    </div>
  );
}
