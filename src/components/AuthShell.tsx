import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export const AuthShell = ({ title, subtitle, children }: AuthShellProps) => (
  <main className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="glass w-full max-w-sm rounded-2xl p-7">
      <div className="mb-7 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary shadow-md shadow-primary/30">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l2.9 6.6L22 9.6l-5 4.9 1.2 6.9L12 18l-6.2 3.4L7 14.5 2 9.6l7.1-1z" />
          </svg>
        </span>
        <span className="font-display text-lg font-bold text-text">Orbit</span>
      </div>

      <h1 className="font-display text-xl font-bold text-text">{title}</h1>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>

      {children}
    </div>
  </main>
);
