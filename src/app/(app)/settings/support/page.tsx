import Link from "next/link";
import { CircleHelp, Mail } from "lucide-react";

import { FormHeader } from "@/components/FormHeader";

export default function SupportPage() {
  return (
    <div className="max-w-140">
      <FormHeader title="Support" description="Get help from our team" backHref="/settings" />

      <div className="glass flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white">
          <Mail className="h-6 w-6" strokeWidth={2} />
        </span>
        <p className="text-sm text-muted">Have a question or ran into an issue? Our team usually replies within a day.</p>
        <a
          href="mailto:support@startuphouze.com"
          className="rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25"
        >
          Email support@startuphouze.com
        </a>
      </div>

      <Link href="/settings/faq" className="glass mt-4 flex items-center gap-3 rounded-2xl px-4 py-3.5 transition hover:bg-muted-bg/60">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 text-white">
          <CircleHelp className="h-4.5 w-4.5" strokeWidth={2} />
        </span>
        <div>
          <div className="text-sm font-bold text-text">Check the FAQ</div>
          <div className="text-xs text-muted">Common questions might already be answered</div>
        </div>
      </Link>
    </div>
  );
}
