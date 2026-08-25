import type { WorkExperience } from "@/lib/types";

// Kept in sync with Orbit-FE's src/modules/profile/schemas/experience.ts —
// same date format and LinkedIn-style display on both platforms.

export const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const MONTH_OPTIONS = MONTH_LABELS.map((label, index) => ({
  label: label.slice(0, 3),
  value: String(index + 1).padStart(2, "0")
}));

export const YEAR_OPTIONS = (() => {
  const currentYear = new Date().getFullYear();
  const years: { label: string; value: string }[] = [];
  for (let year = currentYear; year >= currentYear - 60; year -= 1) {
    years.push({ label: String(year), value: String(year) });
  }
  return years;
})();

/** Formats a "YYYY-MM" value as LinkedIn does — e.g. "2022-01" -> "Jan 2022". */
export const formatMonthYear = (value: string): string => {
  const [year, month] = value.split("-");
  const monthIndex = Number(month) - 1;
  const label = MONTH_LABELS[monthIndex];
  if (!year || !label) return "";
  return `${label.slice(0, 3)} ${year}`;
};

/** LinkedIn-style "Jan 2022 - Present" / "Jan 2022 - Mar 2023". Falls back to
 * the old free-text timeline for entries saved before this format existed. */
export const formatExperienceTimeline = (entry: WorkExperience): string => {
  const start = formatMonthYear(entry.startDate);
  if (!start) return entry.legacyTimeline ?? "";
  const end = entry.isCurrent ? "Present" : formatMonthYear(entry.endDate);
  return end ? `${start} - ${end}` : start;
};

export const emptyWorkExperience = (): WorkExperience => ({
  company: "",
  designation: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false
});
