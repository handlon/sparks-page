"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

/* Replaces the two headings that originally shipped with literal "_____" blanks.
   The eyebrow, title, accent word and aside now rise in sequence as the heading
   scrolls into view; the accent word carries the ember glow. */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function SectionHeading({
  eyebrow,
  title,
  accent,
  aside,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  aside?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="mb-12 flex items-end justify-between gap-6 border-b border-border pb-5"
      variants={reduce ? undefined : container}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, amount: 0.6 }}
    >
      <div>
        {eyebrow && (
          <motion.p variants={item} className="eyebrow mb-3 text-primary">
            {eyebrow}
          </motion.p>
        )}
        <h2 className="text-[clamp(2.2rem,6vw,3.75rem)] uppercase text-foreground">
          <motion.span variants={item} className="inline-block">
            {title}
          </motion.span>
          {accent && (
            <>
              {" "}
              <motion.span
                variants={item}
                className="spark-glow inline-block text-primary"
              >
                {accent}
              </motion.span>
            </>
          )}
        </h2>
      </div>
      {aside && (
        <motion.span
          variants={item}
          className="eyebrow hidden shrink-0 pb-2 text-muted-foreground sm:block"
        >
          {aside}
        </motion.span>
      )}
    </motion.div>
  );
}
