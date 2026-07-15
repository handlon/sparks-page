import { Download } from "lucide-react";
import { CONTACTS } from "@/lib/content";
import { LinkButton } from "../ui";
import { Reveal } from "../Reveal";

export function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <p className="eyebrow mb-4 text-primary">Get in touch</p>
          <h2 className="mb-6 text-[clamp(2.4rem,6vw,4rem)] uppercase leading-[0.9] text-foreground">
            Book
            <br />
            <span className="spark-glow text-primary">Young Sparks</span>
          </h2>
          <p className="prose-body mb-10 max-w-2xl text-muted-foreground">
            For festival bookings, venue inquiries or press requests, reach out directly
            &mdash; we answer everything.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {CONTACTS.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              className="group rounded-lg border border-border bg-surface p-6 transition-colors duration-[var(--dur-base)] hover:border-border-strong hover:bg-surface-2"
            >
              <div className="eyebrow mb-2 text-primary">{contact.label}</div>
              <div className="text-base text-foreground transition-colors group-hover:text-primary">
                {contact.value}
              </div>
            </a>
          ))}
        </div>

        {/* The thing a promoter actually wants to take away.
            TODO(honza): drop a real press-kit PDF (photos, bio, tech rider, stage plot)
            into /public and point href at it. */}
        <div className="mt-4 flex flex-col items-start justify-between gap-5 rounded-lg border border-dashed border-border-strong bg-surface p-6 sm:flex-row sm:items-center">
          <div>
            <div className="font-display text-2xl uppercase text-foreground">
              Press kit
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Photos, bio, tech rider and stage plot &mdash; everything a promoter needs.
            </p>
          </div>
          <LinkButton variant="secondary" href="/press-kit.pdf" className="shrink-0">
            <Download size={14} strokeWidth={2} />
            Download
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
