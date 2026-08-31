import type { InvestorSnapshot } from "@/lib/types";

type MetricProps = { label: string; value: string | number | null };

const Metric = ({ label, value }: MetricProps) => (
  <div className="rounded-xl bg-muted-bg/60 p-3">
    <p className="text-[11px] text-muted">{label}</p>
    <p className="mt-0.5 text-base font-bold text-text">{value ?? "—"}</p>
  </div>
);

const money = (value: number | null) => (value != null ? `₹${value.toLocaleString()}` : "—");
const pct = (value: number | null) => (value != null ? `${value}%` : "—");

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="glass mt-4 rounded-2xl p-4">
    <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">{title}</h2>
    {children}
  </div>
);

type InvestorSnapshotViewProps = {
  snapshot: InvestorSnapshot;
  startupName: string;
};

export const InvestorSnapshotView = ({ snapshot, startupName }: InvestorSnapshotViewProps) => {
  const ownershipSlices = [
    { label: "Founder", value: snapshot.founderOwnership ?? 0, color: "bg-primary" },
    { label: "ESOP", value: snapshot.employeeEsop ?? 0, color: "bg-amber-400" },
    { label: "Investors", value: snapshot.investorOwnership ?? 0, color: "bg-emerald-400" },
    { label: "Available", value: snapshot.availablePool ?? 0, color: "bg-slate-300" }
  ];

  return (
    <div>
      <div className="glass rounded-2xl p-4">
        <h1 className="font-display text-lg font-bold text-text">{startupName} — Investor Snapshot</h1>
        <p className="mt-1 text-sm text-muted">Published, investor-ready overview.</p>
      </div>

      <Section title="Growth metrics">
        <div className="grid grid-cols-2 gap-2.5">
          <Metric label="Total users" value={snapshot.totalUsers?.toLocaleString() ?? null} />
          <Metric label="Active users" value={snapshot.activeUsers?.toLocaleString() ?? null} />
          <Metric label="Paying customers" value={snapshot.payingCustomers?.toLocaleString() ?? null} />
          <Metric label="Enterprise customers" value={snapshot.enterpriseCustomers?.toLocaleString() ?? null} />
          <Metric label="User growth" value={pct(snapshot.customerGrowthRate)} />
          <Metric label="Revenue growth" value={pct(snapshot.revenueGrowthRate)} />
        </div>
      </Section>

      <Section title="Financial highlights">
        <div className="grid grid-cols-2 gap-2.5">
          <Metric label="MRR" value={money(snapshot.mrr)} />
          <Metric label="ARR" value={money(snapshot.arr)} />
          <Metric label="Cash balance" value={money(snapshot.cashBalance)} />
          <Metric label="Burn rate" value={money(snapshot.burnRate)} />
          <Metric label="Runway" value={snapshot.runwayMonths != null ? `${snapshot.runwayMonths} months` : "—"} />
          <Metric label="Gross margin" value={pct(snapshot.grossMargin)} />
          <Metric label="EBITDA" value={money(snapshot.ebitda)} />
          <Metric label="EBITDA %" value={pct(snapshot.ebitdaPercent)} />
        </div>
      </Section>

      <Section title="Fundraising">
        <div className="grid grid-cols-2 gap-2.5">
          <Metric label="Round" value={snapshot.currentRound ? snapshot.currentRound.replace(/_/g, " ") : "—"} />
          <Metric label="Raising" value={money(snapshot.amountRaising)} />
          <Metric label="Equity offered" value={pct(snapshot.equityOffered)} />
          <Metric label="Min check" value={money(snapshot.minimumCheckSize)} />
          <Metric label="Max check" value={money(snapshot.maximumCheckSize)} />
        </div>
      </Section>

      <Section title="Ownership">
        <div className="flex h-3 overflow-hidden rounded-full bg-muted-bg">
          {ownershipSlices.map((slice) =>
            slice.value > 0 ? <div key={slice.label} className={slice.color} style={{ width: `${slice.value}%` }} /> : null
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {ownershipSlices.map((slice) => (
            <div key={slice.label} className="flex items-center gap-2 text-xs text-text">
              <span className={`h-2.5 w-2.5 rounded-full ${slice.color}`} />
              {slice.label}: {slice.value}%
            </div>
          ))}
        </div>
      </Section>

      {snapshot.targetCustomers || snapshot.businessModel || snapshot.revenueStreams || snapshot.marketOpportunity ? (
        <Section title="Business summary">
          <div className="flex flex-col gap-2 text-sm text-text">
            <p>
              <span className="font-semibold">Target customers: </span>
              {snapshot.targetCustomers || "—"}
            </p>
            <p>
              <span className="font-semibold">Business model: </span>
              {snapshot.businessModel || "—"}
            </p>
            <p>
              <span className="font-semibold">Revenue streams: </span>
              {snapshot.revenueStreams || "—"}
            </p>
            <p>
              <span className="font-semibold">Market opportunity: </span>
              {snapshot.marketOpportunity || "—"}
            </p>
          </div>
        </Section>
      ) : null}

      {snapshot.startupVision ? (
        <Section title="Vision">
          <p className="whitespace-pre-wrap text-sm text-text">{snapshot.startupVision}</p>
        </Section>
      ) : null}

      {snapshot.problemStatement ? (
        <Section title="Problem">
          <p className="whitespace-pre-wrap text-sm text-text">{snapshot.problemStatement}</p>
        </Section>
      ) : null}

      {snapshot.solutionSummary ? (
        <Section title="Solution">
          <p className="whitespace-pre-wrap text-sm text-text">{snapshot.solutionSummary}</p>
        </Section>
      ) : null}
    </div>
  );
};
