import celek1 from "@/assets/celek.webp";
import celek2 from "@/assets/celek2.webp";
import celek3 from "@/assets/celek3.webp";
import aboutImg from "@/assets/about.webp";
import roll1 from "@/assets/roll1.webp";
import roll2 from "@/assets/roll2.webp";
import roll3 from "@/assets/roll3.webp";
import roll4 from "@/assets/roll4.webp";
import cover from "@/assets/betterman.webp";
import logoImg from "@/assets/nobg.png";

export { aboutImg, logoImg, cover };

export const HERO_IMAGES = [
  { src: celek1, alt: "Young Sparks performing live on stage" },
  { src: celek2, alt: "Young Sparks playing under blue stage lights" },
  { src: celek3, alt: "The band mid-set at a bluegrass festival" },
];

export const STRIP_IMAGES = [roll1, roll2, roll3, roll4, celek2];

export const ALBUM = {
  title: "Better Man",
  type: "Single",
  year: "2025",
  cover,
  href: "https://open.spotify.com/album/1FyR8U0cVaVs62FQkDbz0X?si=jUz4ViABQsKpQqiUGhQ42w",
  // Powers the inline player, so visitors can listen without leaving the page.
  spotifyId: "1FyR8U0cVaVs62FQkDbz0X",
  youtube: "https://www.youtube.com/@YSbluegrass",
};

export interface Player {
  name: string;
  instrument: string;
  location: string;
  role: string;
  bio: string;
  image?: string;
}

/* TODO(honza): still to fill in.
   1. `image` is intentionally empty — the original portraits were Unsplash stock photos
      of strangers, not the band. Drop real files into /assets and set `image`; until then
      the initials placeholder renders.
   2. `role` / `bio` are placeholders — the old copy was template text about "Maya",
      "Eli", "Sage", "Noah" and "Jules".
   Heads up: the original data described Jan as a fiddle lead but tagged him "Banjo &
   vocals", and Jitka the reverse. `instrument` is kept as it was — double-check it. */
export const PLAYERS: Player[] = [
  {
    name: "Matyáš Frýdl",
    instrument: "Guitar & vocals",
    location: "Kladno",
    role: "Lead vocals, songwriting",
    bio: "TODO: a couple of sentences about Matyáš.",
  },
  {
    name: "Johanka Štanglová",
    instrument: "Mandolin & vocals",
    location: "Plzeň",
    role: "Mandolin, harmonies",
    bio: "TODO: a couple of sentences about Johanka.",
  },
  {
    name: "Jan Handlík",
    instrument: "Banjo & vocals",
    location: "Mladá Boleslav",
    role: "Banjo, harmonies",
    bio: "TODO: a couple of sentences about Jan.",
  },
  {
    name: "Tomáš Alexa",
    instrument: "Bass & vocals",
    location: "Praha",
    role: "Upright bass, harmonies",
    bio: "TODO: a couple of sentences about Tomáš.",
  },
];

export const NAV_LINKS = [
  { label: "Shows", id: "shows" },
  { label: "About", id: "about" },
  { label: "Members", id: "members" },
  { label: "Music", id: "music" },
];

export const STATS = [
  { label: "Years Active", value: new Date().getFullYear() - 2024, suffix: "" },
  { label: "Releases", value: 1, suffix: "" },
  // TODO(honza): manual, will go stale.
  { label: "Shows Played", value: 30, suffix: "+" },
];

export const SOCIALS = [
  // TODO(honza): real Instagram URL — the original was href="#".
  { name: "Instagram", href: "https://www.instagram.com/" },
  {
    name: "Facebook",
    href: "https://www.facebook.com/p/Young-Sparks-61560701807400/",
  },
  { name: "YouTube", href: "https://www.youtube.com/@YSbluegrass" },
];

export const CONTACTS = [
  {
    label: "Email",
    value: "frydl.matyas98@gmail.com",
    href: "mailto:frydl.matyas98@gmail.com",
  },
  { label: "Phone", value: "+420 732 166 562", href: "tel:+420732166562" },
];
