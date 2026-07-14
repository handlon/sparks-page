"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Player } from "@/lib/content";
import { Avatar } from "./ui";

export function MemberModal({
  player,
  onClose,
}: {
  player: Player;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Remember what was focused so focus can be handed back on close.
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // Stop the page behind the dialog from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-modal-name"
        className="relative my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-background/70 text-foreground transition-colors duration-[var(--dur-base)] hover:bg-primary hover:text-primary-foreground"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr]">
          <div className="min-h-64 md:min-h-full">
            <Avatar name={player.name} src={player.image} />
          </div>

          <div className="flex flex-col justify-center p-6 md:p-8">
            <p className="eyebrow mb-3 text-primary">{player.instrument}</p>
            <h3
              id="member-modal-name"
              className="text-[clamp(1.9rem,4vw,2.6rem)] uppercase text-foreground"
            >
              {player.name}
            </h3>
            <p className="eyebrow mt-3 text-muted-foreground">{player.location}</p>
            <p className="prose-body mt-5 text-muted-foreground">{player.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
