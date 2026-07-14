import { ArrowRight, MapPin } from "lucide-react";
import type { Show } from "@/lib/shows";
import { LinkButton, SectionHeading } from "../ui";

/* Server component: the dates are rendered into the HTML, so Google (and link
   previews) see them without running any JavaScript. That's the main reason the
   landing page moved to Next.js. */
export function Shows({ shows, failed }: { shows: Show[]; failed: boolean }) {
  return (
    <section id="shows" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading eyebrow="On the road" title="Upcoming" accent="Shows" aside="Live" />

      {failed ? (
        <div className="rounded-lg border border-border bg-surface px-6 py-12 text-center">
          <p className="text-muted-foreground">
            We couldn&rsquo;t load the tour dates right now.
          </p>
          <LinkButton variant="secondary" href="/" className="mt-5">
            Try again
          </LinkButton>
        </div>
      ) : shows.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface px-6 py-14 text-center">
          <p className="font-display text-3xl uppercase text-foreground">
            No dates announced yet
          </p>
          <p className="mt-3 text-muted-foreground">
            We&rsquo;re booking the next run. Want us at your festival or venue?
          </p>
          <LinkButton variant="primary" href="#contact" className="mt-6">
            Book Us
          </LinkButton>
        </div>
      ) : (
        <ul className="flex flex-col">
          {shows.map((show) => (
            <li
              key={show._id}
              className="grid grid-cols-1 items-center gap-4 border-b border-border py-6 transition-colors duration-[var(--dur-base)] hover:bg-surface/60 sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:px-4"
            >
              <div className="sm:w-40">
                <div className="eyebrow text-primary">{show.day}</div>
                <div className="mt-1 font-display text-3xl font-bold uppercase tabular-nums text-foreground">
                  {show.date}
                </div>
              </div>

              <div className="min-w-0">
                <div className="font-display text-2xl uppercase text-foreground">
                  {show.venue}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={13} strokeWidth={1.5} />
                  {show.city}
                </div>
              </div>

              {show.link && (
                <LinkButton
                  variant="secondary"
                  external
                  href={show.link}
                  className="justify-self-start sm:justify-self-end"
                >
                  Tickets
                  <ArrowRight size={14} strokeWidth={2} />
                </LinkButton>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
