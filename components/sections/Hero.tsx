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
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
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
          />
        </div>
      ))}

      {/* Two scrims: vertical blends into the page, horizontal keeps the wordmark legible. */}
      <div className="absolute inset-0" style={{ background: "var(--scrim-v)" }} />
      <div className="absolute inset-0" style={{ background: "var(--scrim-h)" }} />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-28 pt-24">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="eyebrow mb-5 text-primary">
            Bluegrass · Czech Republic · Est. 2024
          </p>

          <h1 className="font-display text-[clamp(4rem,15vw,11rem)] font-black uppercase leading-[0.85] tracking-[-0.01em] text-foreground">
            Young
            <br />
            Sparks
          </h1>

          <p className="prose-body mt-6 max-w-xl text-foreground/80">
            Old roots, <em className="not-italic text-primary">new fire.</em>{" "}
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
