"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { HERO_IMAGES } from "@/lib/content";
import { Button } from "../ui";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return; // don't auto-advance for people who asked for less motion
    const id = setInterval(
      () => setIndex((i) => (i + 1) % HERO_IMAGES.length),
      6000,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] items-end overflow-hidden"
    >
      {HERO_IMAGES.map((img, i) => (
        <div
          key={img.src.src}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-[var(--ease-out)]"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src.src}
            alt={i === index ? img.alt : ""}
            /* The first frame is the LCP element — it must not be lazy. */
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "low"}
            decoding="async"
            className="h-full w-full object-cover"
            /* The new hero photos are bright, green daytime shots. We only tame the
               saturation a touch here and keep the original brightness — the colour shift
               happens in the blend layer below, not by darkening. objectPosition frames
               faces high so the bottom-left text sits over instruments, not faces. */
            style={{
              filter: "saturate(0.92) brightness(1.1) contrast(1.13)",
              objectPosition: "center 38%",
            }}
          />
        </div>
      ))}

      {/* Recolour, don't darken: a blue "color" blend keeps each pixel's original
          brightness and only swaps its hue, so the green backdrop turns cool blue while
          the photo stays bright and alive (a multiply here is what made it look gloomy). */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(40,130,220,0.28)", mixBlendMode: "color" }}
      />

      {/* Two scrims: vertical blends into the page, horizontal keeps the wordmark legible. */}
      <div className="absolute inset-0" style={{ background: "var(--scrim-v)" }} />
      <div className="absolute inset-0" style={{ background: "var(--scrim-h)" }} />

      {/* Full-bleed and left-anchored: the lockup hugs the bottom-left edge, clear of the
          faces in the upper half of the frame. */}
      <div className="relative z-10 w-full px-6 pb-20 sm:px-8 sm:pb-24 lg:px-12">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="eyebrow mb-5 text-primary">
            Bluegrass · Czech Republic · Est. 2024
          </p>

          <h1 className="font-display text-[clamp(3.5rem,12.5vw,9rem)] font-black uppercase leading-[0.85] tracking-[-0.01em] text-foreground">
            Young
            <br />
            Sparks
          </h1>

          <p className="prose-body mt-6 max-w-xl text-foreground/80">
            Old roots, <em className="spark-glow not-italic text-primary">new fire.</em>{" "}
            Traditional bluegrass with the energy and drive of the modern American
            scene.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => scrollTo("music")}>
              <Play size={15} strokeWidth={2} fill="currentColor" />
              Listen
            </Button>
            <Button variant="secondary" onClick={() => scrollTo("shows")}>
              Upcoming Shows
              <ArrowRight size={15} strokeWidth={2} />
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {HERO_IMAGES.map((img, i) => (
          <button
            key={img.src.src}
            onClick={() => setIndex(i)}
            aria-label={`Show photo ${i + 1} of ${HERO_IMAGES.length}`}
            aria-current={i === index}
            className="flex h-11 w-8 cursor-pointer items-center justify-center"
          >
            <span
              className="block h-[3px] rounded-full transition-all duration-[var(--dur-slow)]"
              style={{
                width: i === index ? "28px" : "8px",
                background: i === index ? "var(--primary)" : "rgba(232,244,251,0.4)",
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
