import { ArrowRight } from "lucide-react";
import { ALBUM } from "@/lib/content";
import { LinkButton, SectionHeading } from "../ui";

export function Music() {
  return (
    <section id="music" className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Have a listen" title="Music" aside="Out now" />

        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,320px)_1fr]">
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ALBUM.cover.src}
              alt={`${ALBUM.title} cover art`}
              loading="lazy"
              decoding="async"
              width={ALBUM.cover.width}
              height={ALBUM.cover.height}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div>
            <p className="eyebrow text-primary">
              {ALBUM.type} &middot; {ALBUM.year}
            </p>
            <h3 className="mt-3 text-[clamp(2.2rem,5vw,3.5rem)] uppercase leading-none text-foreground">
              {ALBUM.title}
            </h3>

            {/* Inline player, so visitors can hear the band without leaving the page. */}
            <div className="mt-7 overflow-hidden rounded-xl">
              <iframe
                title={`${ALBUM.title} on Spotify`}
                src={`https://open.spotify.com/embed/album/${ALBUM.spotifyId}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                loading="lazy"
                style={{ border: 0 }}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton variant="primary" external href={ALBUM.href}>
                Open in Spotify
                <ArrowRight size={14} strokeWidth={2} />
              </LinkButton>
              <LinkButton variant="ghost" external href={ALBUM.youtube}>
                Watch on YouTube
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
