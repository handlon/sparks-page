import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

/* Three ranks, so the page has a real hierarchy. Before the redesign every button was
   the same cyan outline box, which made "Book Us" look no more important than "Link". */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-ui " +
  "uppercase tracking-[0.14em] cursor-pointer whitespace-nowrap text-xs font-medium " +
  "min-h-11 px-5 transition-colors duration-[var(--dur-base)] " + // min-h-11 = 44px touch target
  "disabled:cursor-not-allowed disabled:opacity-45";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground border border-primary hover:bg-primary/85",
  secondary:
    "border border-border-strong text-primary hover:bg-primary hover:text-primary-foreground",
  ghost:
    "border border-transparent text-muted-foreground hover:text-foreground hover:border-border-strong",
  danger:
    "border border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props} />;
}

export function LinkButton({
  variant = "primary",
  className = "",
  external = false,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  external?: boolean;
}) {
  return (
    <a
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}

/* SectionHeading moved to its own client component (it now animates on scroll):
   see components/SectionHeading.tsx. */

/** Initials fallback, so a member without a portrait reads as deliberate, not broken. */
export function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    );
  }

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center bg-surface-2"
    >
      <span className="font-display text-4xl font-bold text-primary/45">
        {initials}
      </span>
    </div>
  );
}
