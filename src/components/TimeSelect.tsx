const OPTIONS: { value: string; label: string }[] = Array.from({ length: 48 }, (_, i) => {
  const hour24 = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const value = `${String(hour24).padStart(2, "0")}:${minute}`;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const period = hour24 < 12 ? "AM" : "PM";
  return { value, label: `${hour12}:${minute} ${period}` };
});

type TimeSelectProps = {
  name: string;
  defaultValue?: string;
  className?: string;
};

/** A <select> of 30-minute time-of-day slots, in place of a native
 * <input type="time"> — that control's click-to-select-segment,
 * type-digits-per-segment interaction is inconsistent across browsers and
 * easy to fumble with a single click, unlike this, which just needs one
 * click and a choice. Values are plain 24h "HH:mm" strings, unchanged from
 * what the native input produced, so nothing downstream needs to change. */
export const TimeSelect = ({ name, defaultValue = "09:00", className }: TimeSelectProps) => (
  <select
    name={name}
    defaultValue={OPTIONS.some((o) => o.value === defaultValue) ? defaultValue : "09:00"}
    className={
      className ??
      "rounded-xl border border-border/70 bg-muted-bg/60 px-3 py-2 text-sm text-text outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
    }
  >
    {OPTIONS.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);
