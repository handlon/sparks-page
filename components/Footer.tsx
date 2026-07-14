import { SOCIALS, logoImg } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoImg.src}
          alt="Young Sparks"
          width={32}
          height={32}
          className="h-8 w-auto object-contain opacity-60"
        />

        <nav className="flex gap-6">
          {SOCIALS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow text-muted-foreground transition-colors duration-[var(--dur-base)] hover:text-primary"
            >
              {social.name}
            </a>
          ))}
        </nav>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Young Sparks
        </p>
      </div>
    </footer>
  );
}
