"use client";

import { useState } from "react";
import { PLAYERS, type Player } from "@/lib/content";
import { Avatar, SectionHeading } from "../ui";
import { MemberModal } from "../MemberModal";

export function Members() {
  const [selected, setSelected] = useState<Player | null>(null);

  return (
    <section id="members" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading eyebrow="Who we are" title="The" accent="Band" aside="Five" />

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {PLAYERS.map((player) => (
          <button
            key={player.name}
            type="button"
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
          </button>
        ))}
      </div>

      {selected && (
        <MemberModal player={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
