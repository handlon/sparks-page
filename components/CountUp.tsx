"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

/** Counts up once when scrolled into view; snaps straight to the value under reduced-motion. */
export function CountUp({
  end,
  suffix = "",
  duration = 1.6,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const display = useTransform(count, (value) => `${Math.round(value)}${suffix}`);

  useEffect(() => {
    if (!isInView) return;
    if (reduceMotion) {
      count.set(end);
      return;
    }
    const controls = animate(count, end, { duration, ease: "easeOut" });
    return controls.stop;
  }, [count, end, duration, isInView, reduceMotion]);

  return <motion.span ref={ref}>{display}</motion.span>;
}
