"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { PLAYERS, type Player } from "@/lib/content";
import { Avatar } from "../ui";
import { SectionHeading } from "../SectionHeading";
import { MemberModal } from "../MemberModal";

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Members() {
  const [selected, setSelected] = useState<Player | null>(null);
  const reduce = useReducedMotion();

  return (
    <section id="members" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading eyebrow="Who we are" title="The" accent="Band" aside="Four" />

      <motion.div
        className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4"
        variants={reduce ? undefined : gridVariants}
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, amount: 0.25 }}
      >
        {PLAYERS.map((player) => (
          <motion.button
            key={player.name}
            type="button"
            variants={reduce ? undefined : cardVariants}
            onClick={() => setSelected(player)}
            className="group cursor-pointer text-left"
          >
            <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-lg border border-border bg-surface-2">
              <div className="h-full w-full transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04]">
                <Avatar name={player.name} src={player.image} />
              </div>
              {/* Cyan wash on hover, tying the portraits to the stage lighting. */}
              <div className="absolute inset-0 bg-primary/0 transition-colors duration-[var(--dur-base)] group-hover:bg-primary/10" />
            </div>

            <h3 className="font-display text-xl uppercase leading-tight text-foreground transition-colors duration-[var(--dur-base)] group-hover:text-primary">
              {player.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{player.instrument}</p>
          </motion.button>
        ))}
      </motion.div>

      {selected && (
        <MemberModal player={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
