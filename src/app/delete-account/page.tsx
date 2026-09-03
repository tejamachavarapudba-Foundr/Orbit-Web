import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Your Account — Orbit",
  description: "How to permanently delete your Orbit account and data."
};

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/login" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary shadow-md shadow-primary/30">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l2.9 6.6L22 9.6l-5 4.9 1.2 6.9L12 18l-6.2 3.4L7 14.5 2 9.6l7.1-1z" />
              </svg>
            </span>
            <span className="font-display text-base font-bold text-text">Orbit</span>
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-border px-3.5 py-1.5 text-sm font-medium text-text transition hover:bg-muted-bg"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className="glass rounded-2xl p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Account</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-text">Delete Your Orbit Account</h1>
          <p className="mt-2 text-sm text-muted">
            This page explains how to permanently delete your Orbit account and data, on either the Orbit mobile app or the Orbit web app.
          </p>

          <div className="mt-8 flex flex-col gap-8 text-[14.5px] leading-relaxed text-muted">
            <section>
              <h2 className="font-display text-lg font-bold text-text">If you can sign in</h2>
              <ol className="mt-2.5 flex list-decimal flex-col gap-1.5 pl-5">
                <li>Open Orbit and sign in to your account.</li>
                <li>Go to <strong className="text-text">Profile</strong> (mobile) or <strong className="text-text">Settings</strong> (web).</li>
                <li>Tap or click <strong className="text-text">Delete account</strong>.</li>
                <li>Confirm when prompted. This takes effect immediately and cannot be undone.</li>
              </ol>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold text-text">If you can&apos;t sign in</h2>
              <p className="mt-2.5">
                Email <a href="mailto:support@startuphouze.com" className="text-primary underline">support@startuphouze.com</a> from
                the email address on your account (or with enough information to verify it&apos;s
                you) and ask us to delete your account. We&apos;ll verify your identity and
                process the request manually.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold text-text">What gets deleted</h2>
              <p className="mt-2.5">Deleting your account permanently removes:</p>
              <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
                <li>Your profile (name, headline, bio, photo, and other profile fields)</li>
                <li>Posts, comments, likes, and messages you&apos;ve sent</li>
                <li>Startup/project listings you created, including pitch decks and pitch videos</li>
                <li>Uploaded files (resumes, documents, event/post media)</li>
                <li>Your connections, follows, and event RSVPs</li>
                <li>Your saved Google Calendar connection, if any</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold text-text">What may be retained, and for how long</h2>
              <p className="mt-2.5">
                Some information may be kept for a limited period after deletion where required
                for legal, security, or fraud-prevention purposes — for example, records needed
                to investigate an abuse report that was filed against your account. This is the
                same retention policy described in our{" "}
                <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>, and any such
                records are kept only as long as necessary for that purpose.
              </p>
            </section>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-muted">
          Orbit is a product of Startuphouze.
        </p>
      </main>
    </div>
  );
}
