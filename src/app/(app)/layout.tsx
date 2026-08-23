import { redirect } from "next/navigation";
import { getMe } from "@/lib/auth";

import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { ApiError, apiFetch } from "@/lib/api";
import { EVENT_NOTIFICATION_TYPES, JOB_NOTIFICATION_TYPES, PROJECT_NOTIFICATION_TYPES, BELL_EXCLUDED_TYPES } from "@/lib/notificationCategories";
import { getSession } from "@/lib/session";
import type { AppNotification, AuthMe, Conversation } from "@/lib/types";

/** Best-effort counters for sidebar badges — never worth crashing the whole
 * app shell over, so any failure just shows a zero badge. */
const safeCount = async (path: string): Promise<number> => {
  try {
    const data = await apiFetch<unknown[]>(path);
    return Array.isArray(data) ? data.length : 0;
  } catch (error) {
    if (error instanceof ApiError) return 0;
    throw error;
  }
};

const safeFollowCounts = async (userId: string): Promise<{ followers: number; following: number }> => {
  try {
    return await apiFetch<{ followers: number; following: number }>(`/follows/counts/${userId}`);
  } catch (error) {
    if (error instanceof ApiError) return { followers: 0, following: 0 };
    throw error;
  }
};

const safeConnectionCount = async (userId: string): Promise<number> => {
  try {
    const data = await apiFetch<{ count: number }>(`/connections/count/${userId}`);
    return data.count;
  } catch (error) {
    if (error instanceof ApiError) return 0;
    throw error;
  }
};

const safeNotifications = async (): Promise<AppNotification[]> => {
  try {
    return await apiFetch<AppNotification[]>("/notifications");
  } catch (error) {
    if (error instanceof ApiError) return [];
    throw error;
  }
};

/** Mirrors mobile's unread-chats logic: a conversation counts as unread
 * when its latest message was sent by the other person and hasn't been
 * read yet. */
const safeUnreadMessages = async (myId: string): Promise<number> => {
  try {
    const conversations = await apiFetch<Conversation[]>("/chats");
    return conversations.filter((c) => {
      const last = c.messages?.[0];
      return last && last.senderId !== myId && !last.readAt;
    }).length;
  } catch (error) {
    if (error instanceof ApiError) return 0;
    throw error;
  }
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.expired) {
    redirect("/login");
  }

  // A cookie can look structurally valid (unexpired JWT) while the account it
  // points to no longer exists or was revoked — treat any failure to load the
  // current user as "not really signed in" rather than letting it surface as
  // an uncaught server error.
  let me: AuthMe;
  try {
    me = await getMe();
  } catch (error) {
    if (error instanceof ApiError) {
      // Cookies can't be mutated during a Server Component render — just
      // redirect. getSession()'s expiry check treats a stale cookie as
      // signed-out, and it's overwritten on next successful login anyway.
      redirect("/login");
    }
    throw error;
  }

  if (!me.profile.onboardingCompleted) {
    redirect("/onboarding");
  }

  const [pendingRequests, allNotifications, connectionsCount, followCounts, unreadMessages] = await Promise.all([
    safeCount("/connections/requests/incoming"),
    safeNotifications(),
    safeConnectionCount(me.id),
    safeFollowCounts(me.id),
    safeUnreadMessages(me.id)
  ]);

  // Messages, projects, jobs, events and connection requests have their own
  // badge on the relevant nav icon now, so the bell only counts what's left.
  const unreadNotifications = allNotifications.filter((n) => !n.isRead && !BELL_EXCLUDED_TYPES.has(n.type)).length;
  const countByType = (types: string[]) => allNotifications.filter((n) => !n.isRead && types.includes(n.type)).length;
  const unreadProjects = countByType(PROJECT_NOTIFICATION_TYPES);
  const unreadJobs = countByType(JOB_NOTIFICATION_TYPES);
  const unreadEvents = countByType(EVENT_NOTIFICATION_TYPES);
  const role = me.profile.role?.toLowerCase();

  return (
    <div className="min-h-screen bg-background">
      <TopNav profile={me.profile} unreadNotifications={unreadNotifications} unreadMessages={unreadMessages} unreadJobs={unreadJobs} />
      <div className="mx-auto flex max-w-320 items-start gap-5 px-5 py-5">
        <div className="sticky top-20 flex-shrink-0">
          <Sidebar
            profile={me.profile}
            isAdmin={me.role?.toUpperCase() === "ADMIN"}
            isInvestor={role === "investor"}
            pendingRequests={pendingRequests}
            unreadNotifications={unreadNotifications}
            connectionsCount={connectionsCount}
            followingCount={followCounts.following}
            unreadProjects={unreadProjects}
            unreadEvents={unreadEvents}
          />
        </div>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
