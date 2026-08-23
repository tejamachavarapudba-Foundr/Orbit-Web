import { cookies } from "next/headers";
import Link from "next/link";
import { Bookmark, ChevronRight, CircleHelp, LifeBuoy, Shield, ShieldCheck, Sparkles, Sun } from "lucide-react";

import { logoutAction } from "@/app/(app)/actions";
import { FormHeader } from "@/components/FormHeader";
import type { ThemeChoice } from "./actions";
import { ThemeToggle } from "./ThemeToggle";

const items = [
  { href: "/settings/verify", label: "Verify profile", description: "Identity and role verification", Icon: ShieldCheck, color: "from-emerald-400 to-teal-500" },
  { href: "/saved", label: "Saved", description: "Posts you've saved", Icon: Bookmark, color: "from-amber-400 to-orange-500" },
  { href: "/settings/subscription", label: "Subscription", description: "Manage your plan", Icon: Sparkles, color: "from-violet-400 to-purple-500" },
  { href: "/settings/privacy", label: "Data & Privacy", description: "What we collect and why", Icon: Shield, color: "from-slate-400 to-slate-600" },
  { href: "/settings/faq", label: "FAQ", description: "Common questions", Icon: CircleHelp, color: "from-sky-400 to-blue-500" },
  { href: "/settings/support", label: "Support", description: "Get help from our team", Icon: LifeBuoy, color: "from-rose-400 to-pink-500" }
] as const;

export default async function SettingsPage() {
  const store = await cookies();
  const stored = store.get("orbit_theme")?.value;
  const current: ThemeChoice = stored === "light" || stored === "dark" ? stored : "system";

  return (
    <div className="mx-auto max-w-140 px-5 py-5">
      <FormHeader title="Settings" backHref="/" />

      <div className="glass mb-4 rounded-2xl p-4">
        <h2 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
          <Sun className="h-3.5 w-3.5" strokeWidth={2} />
          Appearance
        </h2>
        <ThemeToggle current={current} />
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="flex flex-col divide-y divide-border/60">
          {items.map(({ href, label, description, Icon, color }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-muted-bg/60">
              <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${color} text-white`}>
                <Icon className="h-4.5 w-4.5" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-text">{label}</div>
                <div className="truncate text-xs text-muted">{description}</div>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
            </Link>
          ))}
        </div>
      </div>

      <form action={logoutAction} className="mt-4">
        <button type="submit" className="glass w-full rounded-2xl px-4 py-3.5 text-center text-sm font-bold text-danger transition hover:bg-danger-bg/50">
          Sign out
        </button>
      </form>
    </div>
  );
}
