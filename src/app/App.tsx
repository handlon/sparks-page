import { useState, useEffect, useRef } from "react";
import "../styles/fonts.css";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
// coment jen kvuli git comit zprave (jsem kokot a expozenul jsem conect do databaze, takze to musim zmenit a znovu pushnout)
import logoImg from "../imports/nobg.png";
import celek1 from "../imports/celek.jpeg";
import celek2 from "../imports/celek2.jpeg";
import celek3 from "../imports/celek3.jpeg";
import about from "../imports/about.jpeg";
import roll from "../imports/roll1.jpeg";
import roll2 from "../imports/roll2.jpeg";
import roll3 from "../imports/roll3.jpeg";
import roll4 from "../imports/roll4.jpeg";
import cover from "../imports/betterman.png";

/* MARKER-MAKE-KIT-INVOKED — no kit installed, using Tailwind tokens */

const HERO_IMAGES = [
  // tady pridat nase 3 fotky !!!
  {
    src: celek1,
    alt: "Young Sparks performing live on stage",
  },
  {
    src: celek2,
    alt: "Acoustic guitars on stage",
  },
  {
    src: celek3,
    alt: "Band performing at night",
  },
];

const ALBUMS = [
  // tady nas singl jenom jeden
  {
    title: "single: Better man",
    year: "2025",
    cover: cover,
    tracks: ["Better man"],
    href: "https://open.spotify.com/album/1FyR8U0cVaVs62FQkDbz0X?si=jUz4ViABQsKpQqiUGhQ42w",
  },
];

const PLAYERS = [
  {
    name: "Matyáš Frýdl",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=900&fit=crop&auto=format",
    about:
      "Lead vocalist and songwriter, bringing warm harmonies and sharp storytelling to every set.",
    instrument: "Guitar & vocals",
    location: "Kladno",
    bio: "Maya anchors the band with a voice that can carry a gospel hymn or a late-night confession, and she writes the songs that keep the set intimate and unforgettable.",
  },
  {
    name: "Johanka Štanglová",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=900&fit=crop&auto=format",
    about:
      "Mandolin player with a driving rhythm and a love for old-time phrasing.",
    instrument: "Mandolin & vocals",
    location: "Plzeň",
    bio: "Eli brings a sharp, driving mandolin style that blends bluegrass fire with the looseness of Americana grooves, giving every song its pulse.",
  },
  {
    name: "Jan Handlík",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=900&fit=crop&auto=format",
    about:
      "Fiddle lead whose playing carries both grit and elegance across the stage.",
    instrument: "Banjo & vocals",
    location: "Mladá Boleslav",
    bio: "Sage’s playing moves from raw Appalachian phrasing to soaring melodies, making each arrangement feel both rooted and alive.",
  },
  {
    name: "Tomáš Alexa",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=900&fit=crop&auto=format",
    about:
      "Bass player and groove keeper, grounding each song in steady pulse and warmth.",
    instrument: "Bass & vocals",
    location: "Praha",
    bio: "Noah keeps the band grounded with a warm, steady bass voice that gives the songs shape without ever stealing the spotlight.",
  },
  {
    name: "Jitka Vejsadová",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=900&fit=crop&auto=format",
    about:
      "Banjo picker with a bright attack and a deep respect for tradition.",
    instrument: "Fiddle & vocals",
    location: "Teplice",
    bio: "Jules brings a bright, propulsive banjo sound that nods to the old masters while still sounding fresh and modern on stage.",
  },
];

interface Show {
  date: string;
  day: string;
  venue: string;
  city: string;
  link: string;
}

const NAV_LINKS = ["Shows", "About", "Members", "Music", "Contact"];

export default function App() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<
    (typeof PLAYERS)[number] | null
  >(null);

  const [shows, setShows] = useState<Show[]>([]);
  const [loadingShows, setLoadingShows] = useState(true);

  useEffect(() => {
    fetch("/api/shows")
      .then((res) => res.json())
      .then((data) => {
        // Pokud data nepřijdou jako pole (např. chyba API), hodíme tam prázdné pole
        setShows(Array.isArray(data) ? data : []);
        setLoadingShows(false);
      })
      .catch((err) => {
        console.error("Chyba při načítání koncertů z API:", err);
        setLoadingShows(false);
      });
  }, []);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setHeroIdx((i) => (i + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);

    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* NAV */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(2,6,10,0.98)" : "rgba(2,6,10,0.88)",
          borderBottom: scrolled
            ? "1px solid rgba(39,181,240,0.15)"
            : "1px solid rgba(255,255,255,0.08)",
          backdropFilter: scrolled ? "blur(8px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-3"
          >
            <span
              className="text-foreground uppercase tracking-[0.2em] text-lg font-normal"
              style={{
                fontStyle: "italic",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Young Sparks
            </span>
            <ImageWithFallback
              src={logoImg}
              alt="Young Sparks Bluegrass logo"
              className="h-10 w-auto object-contain"
            />
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => {
              const targetId = l === "Shows" ? "top" : l.toLowerCase();
              return (
                <button
                  key={l}
                  onClick={() => scrollTo(targetId)}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-xs uppercase"
                  style={{ letterSpacing: "0.15em" }}
                >
                  {l}
                </button>
              );
            })}
            <button
              onClick={() => scrollTo("contact")}
              className="border border-primary text-primary text-xs px-4 py-1.5 uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              style={{ letterSpacing: "0.12em" }}
            >
              Book Us
            </button>
          </nav>

          <button
            className="md:hidden text-foreground p-1 flex flex-col gap-1.5"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-px bg-foreground transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
            />
            <span
              className={`block w-6 h-px bg-foreground transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-px bg-foreground transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
            />
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden border-t border-border bg-card transition-all duration-300 ease-out ${menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 border-transparent"}`}
        >
          <div
            className={`flex flex-col gap-4 px-6 py-4 transition-all duration-300 ${menuOpen ? "translate-y-0" : "-translate-y-2"}`}
          >
            {NAV_LINKS.map((l) => {
              const targetId = l === "Shows" ? "top" : l.toLowerCase();
              return (
                <button
                  key={l}
                  onClick={() => scrollTo(targetId)}
                  className="text-left text-foreground uppercase text-sm py-1 transition-colors duration-200 hover:text-primary"
                  style={{ letterSpacing: "0.1em" }}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>
      </header>
      {/* - ----------------------    end navbaru */}
      {/* HERO */}
      <section id="hero" className="relative h-screen overflow-hidden">
        {HERO_IMAGES.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === heroIdx ? 1 : 0 }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.8) saturate(0.95)" }}
            />
          </div>
        ))}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(14,12,9,0.15) 0%, rgba(14,12,9,0.55) 65%, #080e12 100%)",
          }}
        />

        <div className="absolute inset-x-3 bottom-16 sm:bottom-24 flex justify-center px-1 sm:px-6 z-10">
          <div
            id="shows"
            className="w-full max-w-4xl rounded-[1.5rem] border border-white/15 bg-[#080d12]/80 shadow-[0_20px_80px_rgba(0,0,0,0.35)] p-4 sm:p-6 md:p-8 max-h-[72vh] overflow-auto"
          >
            <div className="mb-5 flex justify-center">
              <h2
                className="text-center text-foreground"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                }}
              >
                Upcoming Shows
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {/* Loader, pokud se data ještě stahují */}
              {loadingShows ? (
                <div className="text-center text-muted-foreground py-4 text-xs uppercase tracking-widest">
                  Načítám aktuální koncerty...
                </div>
              ) : shows.length === 0 ? (
                <div className="text-center text-muted-foreground py-4 text-xs uppercase tracking-widest">
                  Žádné plánované koncerty.
                </div>
              ) : (
                // Mapujeme malé "shows" ze státu, namísto původního velkého SHOWS
                shows.map((show: any, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-[#0f171d]/80 px-3 py-3"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-primary text-[0.65rem] uppercase tracking-[0.2em]">
                          {show.day} • {show.date}
                        </div>
                        <div
                          className="mt-1 text-foreground break-words"
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1rem",
                          }}
                        >
                          {show.venue}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground break-words flex-shrink-0">
                        {show.city}
                      </div>
                      <a
                        href={show.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-primary text-primary text-xs px-3 py-1.5 uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-200 whitespace-nowrap flex-shrink-0"
                        style={{ letterSpacing: "0.12em" }}
                      >
                        Link
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className="transition-all duration-300"
              style={{
                width: i === heroIdx ? "28px" : "6px",
                height: "5px",
                background:
                  i === heroIdx ? "#27b5f0" : "rgba(240,234,214,0.35)",
                borderRadius: "3px",
              }}
            />
          ))}
        </div>

        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 opacity-40">
          <span
            className="text-foreground uppercase text-xs"
            style={{
              writingMode: "vertical-rl",
              letterSpacing: "0.2em",
              fontSize: "0.6rem",
            }}
          >
            Scroll
          </span>
          <div className="w-px h-10 bg-foreground/40" />
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="py-24 px-6"
        style={{ background: "#060b0f" }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src={about}
              alt="Young Sparks band members with guitars"
              className="w-full object-cover"
              style={{
                filter: "saturate(0.65) brightness(0.88)",
                aspectRatio: "7/8",
              }}
            />
            <div
              className="absolute -bottom-5 -right-5 pointer-events-none"
              style={{
                width: "70%",
                height: "70%",
                border: "1px solid rgba(39,181,240,0.25)",
                position: "absolute",
                bottom: "-20px",
                right: "-20px",
                zIndex: -1,
              }}
            />
          </div>
          <div>
            <p
              className="text-primary uppercase mb-4"
              style={{ letterSpacing: "0.4em", fontSize: "0.65rem" }}
            >
              About the Band
            </p>
            <h2
              className="text-foreground mb-8"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                lineHeight: 1.1,
              }}
            >
              Old roots,{" "}
              <em style={{ fontStyle: "italic", color: "#27b5f0" }}>
                new fire.
              </em>
            </h2>
            <div
              className="text-muted-foreground space-y-5 leading-relaxed"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontWeight: 300,
                fontSize: "1.05rem",
              }}
            >
              <p>
                Young Sparks is a young bluegrass band formed in 2024 and since
                then has managed to build a prominent place for itself on the
                Czech bluegrass scene. we’ve already performed at a number of
                great events across the Czech Republic and abroad.
              </p>
              <p>
                Our music is rooted in traditional bluegrass, but brings to it
                an energy, dynamics, and modern drive inspired by the
                contemporary American scene. This is exactly the approach we
                strive to promote over here – with respect for tradition, but at
                the same time with a desire to push it forward and show that
                bluegrass can appeal to a brand new generation of listeners.
              </p>
            </div>
            <div className="mt-10 flex gap-8">
              {[
                { label: "Years Active", value: "2" },
                { label: "Albums", value: "1" },
                { label: "Shows Played", value: "30+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-primary mb-1"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "2.2rem",
                      fontWeight: 600,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-muted-foreground text-xs uppercase"
                    style={{ letterSpacing: "0.12em" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PLAYERS */}
      <section id="members" className="py-22 px-6 max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-30 border-b border-border pb-4">
          <h2
            className="text-foreground"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
            }}
          >
            Members{" "}
            <em className="text-primary" style={{ fontStyle: "italic" }}>
              &amp;
            </em>{" "}
            <span className="text-muted-foreground">_____</span>
          </h2>
          <span
            className="text-muted-foreground text-xs uppercase hidden sm:block"
            style={{ letterSpacing: "0.2em" }}
          >
            Band
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 xl:justify-between">
          {PLAYERS.map((player) => (
            <button
              key={player.name}
              type="button"
              onClick={() => setSelectedPlayer(player)}
              className="group flex flex-col items-center transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03]"
            >
              <div className="relative mb-3 h-28 w-28 overflow-hidden rounded-full border border-primary/30 bg-card/70 p-1 shadow-[0_12px_35px_rgba(0,0,0,0.25)] sm:h-32 sm:w-32 lg:h-36 lg:w-36">
                <img
                  src={player.image}
                  alt={player.name}
                  className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: "saturate(0.5) brightness(0.85)" }}
                />
              </div>
              <h3
                className="text-foreground"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1rem",
                }}
              >
                {player.name}
              </h3>
            </button>
          ))}
        </div>
      </section>

      {selectedPlayer && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-border bg-[#060b0f] shadow-[0_20px_80px_rgba(0,0,0,0.45)] my-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-0">
              <img
                src={selectedPlayer.image}
                alt={selectedPlayer.name}
                className="w-full object-cover min-h-64 sm:min-h-80 md:h-full"
              />
              <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-center">
                <button
                  type="button"
                  onClick={() => setSelectedPlayer(null)}
                  className=" ml-auto w-50 rounded-full border border-border bg-black/50 px-3 py-1 text-sm text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Close
                </button>
                <p className="mb-3 text-[0.65rem] uppercase tracking-[0.3em] text-primary">
                  {selectedPlayer.instrument}
                </p>
                <h3
                  className="text-foreground"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  }}
                >
                  {selectedPlayer.name}
                </h3>
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  {selectedPlayer.location}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  {selectedPlayer.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MUSIC */}
      <section id="music" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-10 border-b border-border pb-4">
          <h2
            className="text-foreground"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
            }}
          >
            Discography{" "}
            <em className="text-primary" style={{ fontStyle: "italic" }}>
              &amp;
            </em>{" "}
            <span className="text-muted-foreground">_____</span>
          </h2>
          <span
            className="text-muted-foreground text-xs uppercase hidden sm:block"
            style={{ letterSpacing: "0.2em" }}
          >
            Listen
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {ALBUMS.map((album) => (
            <div key={album.title} className="group">
              <div
                className="relative overflow-hidden mb-5"
                style={{ aspectRatio: "1" }}
              >
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ background: "rgba(14,12,9,0.72)" }}
                >
                  <a
                    className="border border-primary text-primary text-xs px-6 py-2.5 uppercase hover:bg-primary hover:text-primary-foreground transition-all"
                    style={{ letterSpacing: "0.15em" }}
                    href={album.href}
                  >
                    ▶ Play
                  </a>
                </div>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <h3
                  className="text-foreground"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.1rem",
                  }}
                >
                  {album.title}
                </h3>
                <span className="text-muted-foreground text-xs">
                  {album.year}
                </span>
              </div>
              <ul className="space-y-1.5">
                {album.tracks.map((track) => (
                  <li
                    key={track}
                    className="text-muted-foreground text-sm flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
                  >
                    <span className="text-primary/35 text-xs">—</span>
                    {track}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* PHOTO STRIP */}
      <div className="overflow-hidden" style={{ height: "220px" }}>
        <div className="flex h-full">
          {[
            { url: roll, w: "300px" },
            { url: roll2, w: "320px" },
            { url: roll3, w: "300px" },
            { url: roll4, w: "320px" },
            { url: celek2, w: "300px" },
            { url: roll, w: "300px" },
          ].map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt="Young Sparks live"
              className="h-full object-cover shrink-0 rounded-lg"
              style={{
                width: img.w,
                filter: "saturate(0.45) brightness(0.65)",
              }}
            />
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <section
        id="contact"
        className="py-24 px-6"
        style={{ background: "#060b0f" }}
      >
        <div className="max-w-4xl mx-auto">
          <p
            className="text-primary uppercase mb-4"
            style={{ letterSpacing: "0.4em", fontSize: "0.65rem" }}
          >
            Get in touch
          </p>
          <h2
            className="text-foreground mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              lineHeight: 1.1,
            }}
          >
            Book
            <br />
            <em style={{ fontStyle: "italic" }}>Young Sparks</em>
          </h2>
          <p
            className="text-muted-foreground leading-relaxed mb-10 max-w-2xl"
            style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 300 }}
          >
            For festival bookings, venue inquiries, or press requests, reach out
            directly using the contact details below.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                label: "Email",
                value: "frydl.matyas98@gmail.com",
                href: "mailto:frydl.matyas98@gmail.com",
              },
              {
                label: "Phone",
                value: "+420 732 166 562",
                href: "tel:+420732166562",
              },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="rounded-lg border border-border bg-secondary/60 p-6 hover:border-primary transition-colors"
              >
                <div
                  className="text-primary text-xs uppercase mb-2"
                  style={{ letterSpacing: "0.2em" }}
                >
                  {c.label}
                </div>
                <div className="text-foreground text-base">{c.value}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <ImageWithFallback
              src={logoImg}
              alt="Young Sparks Bluegrass"
              className="h-8 w-auto object-contain opacity-60"
            />
          </div>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Young Sparks. All rights reserved.
          </p>
          {/* upravit nacitani do noveho okna */}
          <div className="flex gap-5">
            {[
              { name: "Instagram", href: "#" },
              {
                name: "Facebook",
                href: "https://www.facebook.com/p/Young-Sparks-61560701807400/",
              },
              { name: "YouTube", href: "https://www.youtube.com/@YSbluegrass" },
            ].map((s) => (
              <a
                key={s.name}
                href={s.href}
                className="text-muted-foreground hover:text-primary transition-colors text-xs"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
