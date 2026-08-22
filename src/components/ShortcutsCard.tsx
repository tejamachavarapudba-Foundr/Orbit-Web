import Link from "next/link";

const shortcuts = [
  { href: "/events", label: "Events", icon: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18" },
  { href: "/projects", label: "My startups", icon: "M2 3h20v14H2zM8 21h8M12 17v4" },
  { href: "/communities", label: "Communities", icon: "M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" },
  { href: "/saved", label: "Saved posts", icon: "M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" }
] as const;

export const ShortcutsCard = () => (
  <nav className="rounded-xl border border-border bg-surface p-2 shadow-sm">
    {shortcuts.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-[13px] font-semibold text-text hover:bg-muted-bg"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 text-muted">
          <path d={item.icon} />
        </svg>
        {item.label}
      </Link>
    ))}
  </nav>
);
