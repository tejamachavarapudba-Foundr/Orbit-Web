/** Notification types that now surface as a badge count on their own nav
 * icon (Messages, My startups, Jobs, Events, My network) instead of
 * cluttering the bell with everything mixed together. */
export const MESSAGE_NOTIFICATION_TYPES = ["NEW_MESSAGE"];
export const PROJECT_NOTIFICATION_TYPES = ["PROJECT_INTEREST", "PROJECT_REVIEW", "INVESTOR_INTEREST"];
export const JOB_NOTIFICATION_TYPES = ["JOB_ALERT", "APPLICATION_STATUS"];
export const EVENT_NOTIFICATION_TYPES = ["EVENT_REMINDER"];
export const CONNECTION_NOTIFICATION_TYPES = ["CONNECTION_REQUEST"];

export const BELL_EXCLUDED_TYPES = new Set<string>([
  ...MESSAGE_NOTIFICATION_TYPES,
  ...PROJECT_NOTIFICATION_TYPES,
  ...JOB_NOTIFICATION_TYPES,
  ...EVENT_NOTIFICATION_TYPES,
  ...CONNECTION_NOTIFICATION_TYPES
]);
