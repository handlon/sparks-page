import { STRIP_IMAGES } from "@/lib/content";

/* Rendered twice and translated -50%, so the loop is seamless.
   CSS drives it; prefers-reduced-motion pauses it (see globals.css). */
export function PhotoMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-border" aria-hidden="true">
      {/* Feather the edges so photos dissolve into the page instead of being hard-cut. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

      <div className="flex w-max animate-marquee">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {STRIP_IMAGES.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${copy}-${i}`}
                src={img.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-[240px] w-auto shrink-0 object-cover opacity-70 grayscale-[0.35]"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
