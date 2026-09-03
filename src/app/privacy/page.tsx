import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Orbit",
  description: "How Orbit collects, uses, and protects your information."
};

const LAST_UPDATED = "September 3, 2026";

type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

const sections: Section[] = [
  {
    id: "overview",
    title: "1. Overview",
    body: (
      <>
        <p>
          Orbit (&quot;Orbit&quot;, &quot;we&quot;, &quot;us&quot;) is a platform run by Startuphouze
          that connects founders, investors, advisors, and other professionals — through
          our mobile app and web app at this domain (together, the &quot;Service&quot;). This
          policy explains what information we collect, why we collect it, who we share it
          with, and the choices you have.
        </p>
        <p>
          Orbit is intended for people <strong>18 years of age or older</strong>. If you
          believe a child has created an account, contact us using the details at the
          bottom of this page and we&apos;ll remove it.
        </p>
      </>
    )
  },
  {
    id: "information-we-collect",
    title: "2. Information we collect",
    body: (
      <>
        <p>We collect information in three ways: what you give us, what we generate as you use the Service, and what we receive from third parties you choose to connect.</p>

        <h3>Account & profile information</h3>
        <p>
          Name, email address, and password (we only ever store a one-way cryptographic
          hash of your password — never the password itself) when you register. Optional
          profile details you add — phone number, headline, bio, location, company,
          profile photo, and your role (founder, investor, advisor, professional, service
          provider, or mentor).
        </p>

        <h3>Identity verification</h3>
        <p>
          If you choose to verify your professional identity, we ask for supporting
          documents (e.g. a work ID or LinkedIn profile) reviewed by our team. Founders in
          India additionally have the option to verify via India&apos;s DigiLocker service,
          which shares your name, date of birth, gender, and a masked identity reference
          directly from the government system — with your explicit consent through
          DigiLocker&apos;s own consent screen. We never see or store your Aadhaar number
          itself, only the masked reference DigiLocker provides.
        </p>

        <h3>Startup, project & financial information</h3>
        <p>
          If you create a startup or project listing: its description, category and stage,
          funding ask amount and equity offered, pitch deck and pitch video files, and — if
          you use our investor-snapshot feature — business metrics you enter or that we
          extract from an uploaded pitch deck (see <em>AI-assisted document parsing</em> below).
          Investors viewing this information is controlled by the visibility settings you choose.
        </p>

        <h3>Communications & content</h3>
        <p>
          Posts, comments, likes, messages and files you send through chat, meeting
          requests, job listings and applications, and event RSVPs — anything you create or
          send while using the Service.
        </p>

        <h3>Calendar integration</h3>
        <p>
          If you connect Google Calendar to schedule meetings, we store an encrypted
          (AES-256) access token so we can create calendar events on your behalf. We only
          request calendar-write access — not your inbox or other Google data — and you can
          disconnect it at any time from Settings.
        </p>

        <h3>Device & usage information (mobile app)</h3>
        <p>
          Our mobile app uses Firebase (Google) for crash reporting, performance
          monitoring, basic usage analytics, and push notifications. This can include your
          device model, operating system version, app version, crash logs, and a
          push-notification token. We use this to keep the app stable and to notify you of
          activity relevant to you — not for advertising.
        </p>

        <h3>AI-assisted document parsing</h3>
        <p>
          If you use the &quot;auto-fill from pitch deck&quot; feature, the text content of your
          uploaded deck (not the file itself) is sent to OpenAI&apos;s API to identify
          relevant fields (e.g. business model, target customers, revenue streams). This
          happens only when you choose to use this feature.
        </p>
      </>
    )
  },
  {
    id: "how-we-use",
    title: "3. How we use your information",
    body: (
      <ul>
        <li>To create and secure your account, and verify your identity when requested.</li>
        <li>To operate core features — your feed, search and discovery, connections, messaging, meetings, jobs, and events.</li>
        <li>To send you account, security, and OTP verification emails (via Resend) and SMS (via Twilio) — and, where you&apos;ve opted in, notifications about activity relevant to you.</li>
        <li>To detect and prevent fraud, abuse, and security incidents, including rate-limiting and monitoring login activity.</li>
        <li>To improve the Service — understanding which features are used and where the app crashes or performs poorly.</li>
        <li>To comply with legal obligations.</li>
      </ul>
    )
  },
  {
    id: "how-we-share",
    title: "4. How we share your information",
    body: (
      <>
        <p>
          <strong>We do not sell your personal information.</strong> We share it only in
          these situations:
        </p>
        <ul>
          <li><strong>With other users, as you direct.</strong> Your public profile, posts, and startup/project listings are visible to other signed-in members per your visibility settings. Content you send in a chat or meeting request is visible to its recipient.</li>
          <li>
            <strong>With service providers who process data on our behalf</strong>, under contract and only for the purpose we specify:
            <ul>
              <li><strong>Supabase</strong> — file storage (profile photos, chat attachments, documents, resumes, pitch decks, event/post media).</li>
              <li><strong>Resend</strong> — transactional email delivery (verification codes, password resets, notifications).</li>
              <li><strong>Twilio</strong> — phone number verification (SMS one-time codes).</li>
              <li><strong>Google</strong> — Calendar event creation, only if you connect your calendar.</li>
              <li><strong>OpenAI</strong> — pitch-deck text extraction, only if you use that feature.</li>
              <li><strong>Firebase (Google)</strong> — mobile crash reporting, analytics, performance monitoring, and push notifications.</li>
              <li><strong>DigiLocker (Government of India)</strong> — identity verification, only if you choose that verification method.</li>
              <li><strong>Railway</strong> and <strong>Vercel</strong> — hosting for our backend and web app respectively.</li>
            </ul>
          </li>
          <li><strong>For legal reasons</strong> — if required by law, subpoena, or to protect the rights, safety, or property of Orbit, our users, or the public.</li>
          <li><strong>In a business transfer</strong> — if Orbit is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction, subject to this policy.</li>
        </ul>
      </>
    )
  },
  {
    id: "security",
    title: "5. Data security",
    body: (
      <ul>
        <li>Passwords are never stored in plain text — we store only a bcrypt one-way hash.</li>
        <li>Sensitive tokens (like Google Calendar access tokens) are encrypted at rest with AES-256-GCM.</li>
        <li>All traffic between your device and our servers is encrypted in transit (HTTPS/TLS).</li>
        <li>Account sign-in requires a verified email, and we rate-limit authentication endpoints to slow down automated abuse.</li>
        <li>Access to production systems is restricted to authorized team members.</li>
      </ul>
    )
  },
  {
    id: "retention",
    title: "6. Data retention",
    body: (
      <p>
        We keep your information for as long as your account is active. If you delete your
        account, we remove your profile, posts, messages, and uploaded files from the
        Service; some information may be retained for a limited period where required for
        legal, security, or fraud-prevention purposes (for example, records needed to
        investigate abuse reports).
      </p>
    )
  },
  {
    id: "your-rights",
    title: "7. Your rights & choices",
    body: (
      <ul>
        <li><strong>Access & correction</strong> — view and edit your profile information at any time from Settings.</li>
        <li><strong>Deletion</strong> — permanently delete your account and associated data from Settings, or by contacting us.</li>
        <li><strong>Notifications</strong> — manage which notifications you receive from Settings &gt; Notifications.</li>
        <li><strong>Calendar disconnect</strong> — revoke Google Calendar access at any time from Settings &gt; Integrations.</li>
        <li>Depending on where you live, you may have additional rights (such as data portability or objecting to certain processing) under laws like India&apos;s DPDP Act or the EU/UK GDPR. Contact us to exercise these.</li>
      </ul>
    )
  },
  {
    id: "payments",
    title: "8. Payments",
    body: (
      <p>
        Orbit does not currently process payments or offer paid subscriptions. If we
        introduce paid plans in the future, payment will be handled by a PCI-compliant
        third-party payment processor — Orbit itself will never see or store your full
        card number. We&apos;ll update this policy before any such feature launches.
      </p>
    )
  },
  {
    id: "international",
    title: "9. International data transfers",
    body: (
      <p>
        Orbit is operated from India. Several of our service providers (Supabase, Resend,
        Twilio, OpenAI, Google, Railway, Vercel) process data on servers located outside
        India, including in the United States. By using the Service, you understand your
        information may be transferred to and processed in countries other than your own,
        under contractual safeguards with each provider.
      </p>
    )
  },
  {
    id: "changes",
    title: "10. Changes to this policy",
    body: (
      <p>
        We may update this policy as the Service changes. If we make material changes,
        we&apos;ll notify you in-app or by email before they take effect. The &quot;last
        updated&quot; date at the top of this page always reflects the current version.
      </p>
    )
  },
  {
    id: "contact",
    title: "11. Contact us",
    body: (
      <p>
        Questions about this policy or your data? Email us at{" "}
        <a href="mailto:privacy@startuphouze.com">privacy@startuphouze.com</a>.
      </p>
    )
  }
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
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

      <main className="mx-auto max-w-4xl px-5 py-10">
        <div className="glass rounded-2xl p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Legal</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-text">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted">Last updated: {LAST_UPDATED}</p>

          <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 rounded-xl border border-border/70 bg-muted-bg/40 p-4 text-sm">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-primary hover:underline">
                {s.title}
              </a>
            ))}
          </nav>

          <article className="prose-legal mt-8 flex flex-col gap-9">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-display text-lg font-bold text-text">{s.title}</h2>
                <div className="mt-2.5 flex flex-col gap-3 text-[14.5px] leading-relaxed text-muted [&_a]:text-primary [&_a]:underline [&_h3]:mt-2 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-text [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul_ul]:mt-1.5 [&_ul_ul]:gap-1">
                  {s.body}
                </div>
              </section>
            ))}
          </article>
        </div>

        <p className="mx-auto mt-6 max-w-4xl text-center text-xs text-muted">
          Orbit is a product of Startuphouze.
        </p>
      </main>
    </div>
  );
}
