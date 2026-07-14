import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PhotoMarquee } from "@/components/Marquee";
import { Hero } from "@/components/sections/Hero";
import { Shows } from "@/components/sections/Shows";
import { About } from "@/components/sections/About";
import { Members } from "@/components/sections/Members";
import { Music } from "@/components/sections/Music";
import { Contact } from "@/components/sections/Contact";
import { listShows, type Show } from "@/lib/shows";

/* Re-fetch at most once a minute rather than on every request: the show list changes
   a few times a year, and this keeps the page fast without a redeploy after each edit. */
export const revalidate = 60;

export default async function HomePage() {
  let shows: Show[] = [];
  let failed = false;

  // Read Mongo directly here — no HTTP hop to our own API. If the DB is down the rest
  // of the page must still render, so this failure is contained to the shows section.
  try {
    shows = await listShows();
  } catch (error) {
    console.error("Could not load shows for the landing page:", error);
    failed = true;
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Shows shows={shows} failed={failed} />
        <About />
        <Members />
        <Music />
        <PhotoMarquee />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
