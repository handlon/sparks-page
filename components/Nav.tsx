"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, logoImg } from "@/lib/content";
import { Button } from "./ui";

const SECTION_IDS = ["shows", "about", "members", "music", "contact"];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy, so the nav shows where you actually are on the page.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-[var(--dur-base)] ${
        scrolled
          ? "border-b border-border  bg-background/95 backdrop-blur-md"
          : "border-b border-transparent bg-background/50 from-black/60 to-transparent backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <button
          onClick={() => scrollTo("top")}
          className="flex cursor-pointer items-center gap-3"
          aria-label="Young Sparks — back to top"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoImg.src}
            alt=""
            width={40}
            height={40}
            className="h-9 w-auto object-contain"
          />
          <span className="font-display text-xl font-bold uppercase tracking-[0.12em] text-foreground">
            Young Sparks
          </span>
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              aria-current={activeSection === link.id ? "true" : undefined}
              className={`eyebrow cursor-pointer transition-colors duration-[var(--dur-base)] ${
                activeSection === link.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </button>
          ))}
          <Button variant="secondary" onClick={() => scrollTo("contact")}>
            Book Us
          </Button>
        </nav>

        <button
          className="flex h-11 w-11 cursor-pointer items-center justify-center text-foreground md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-border bg-surface transition-all duration-[var(--dur-base)] md:hidden ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`cursor-pointer py-3 text-left font-display text-xl uppercase tracking-wide transition-colors ${
                activeSection === link.id ? "text-primary" : "text-foreground"
              }`}
            >
              {link.label}
            </button>
          ))}
          <Button
            variant="primary"
            className="mt-3 w-full"
            onClick={() => scrollTo("contact")}
          >
            Book Us
          </Button>
        </div>
      </div>
    </header>
  );
}
