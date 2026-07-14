/* Date helpers shared by the server (rendering) and the admin form (client).

   Kept in their own module with NO database import: lib/shows.ts pulls in the MongoDB
   driver, and a client component importing from there would drag the whole driver into
   the browser bundle. */

/* The band plays Czech time, so dates are always formatted in Europe/Prague — never in
   the server's local zone. Vercel runs in UTC, and rawDates were stored at local
   midnight (e.g. 22:00Z), so formatting in UTC would render those shows a day early. */
export const SHOW_TIMEZONE = "Europe/Prague";

/** Derived from rawDate rather than hand-typed, so display can never drift from truth. */
export function deriveDisplayDate(iso: string): { date: string; day: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "", day: "" };
  return {
    date: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: SHOW_TIMEZONE,
    }),
    day: d.toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: SHOW_TIMEZONE,
    }),
  };
}

/** ISO -> the YYYY-MM-DD an <input type="date"> expects. en-CA formats as YYYY-MM-DD. */
export function isoToDateInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-CA", { timeZone: SHOW_TIMEZONE });
}

/** YYYY-MM-DD -> ISO, anchored at 12:00 UTC so no timezone offset can shift the day. */
export function dateInputToIso(value: string): string {
  if (!value) return "";
  const d = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}
