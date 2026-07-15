"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/* Fade-and-rise as the element scrolls into view, once. Uses motion's whileInView
   so there's no manual IntersectionObserver. Under reduced-motion it renders the
   final state immediately (initial={false}) — no transform, no fade. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  amount = 0.3,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
