import type { Metadata, Viewport } from "next";
// Google renamed "Big Shoulders Display" to plain "Big Shoulders" — same typeface.
import { Big_Shoulders, DM_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Sparks } from "@/components/Sparks";

/* Self-hosted by next/font at build time: no render-blocking request to Google, and
   no layout shift, since the metrics are known up front. */
/* These expose raw family names; globals.css maps them onto the --font-display /
   --font-ui / --font-body theme roles (with fallbacks). Keeping the names distinct
   avoids a self-referential `--font-display: var(--font-display)` in @theme. */
const display = Big_Shoulders({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-big-shoulders",
  display: "swap",
});

const ui = DM_Sans({
  subsets: ["latin", "latin-ext"], // latin-ext carries the Czech diacritics
  weight: ["300", "400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const body = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
});

/* TODO(honza): set NEXT_PUBLIC_SITE_URL to the real domain in Vercel. Link-preview
   scrapers need an absolute og:image URL, so previews stay broken until this is right. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Young Sparks — Czech Bluegrass Band",
  description:
    "Young Sparks are a young bluegrass band from the Czech Republic — traditional roots, modern drive. Upcoming shows, music and booking.",
  openGraph: {
    type: "website",
    siteName: "Young Sparks",
    title: "Young Sparks — Czech Bluegrass Band",
    description: "Old roots, new fire. Upcoming shows, music and booking.",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
};

export const viewport: Viewport = {
  themeColor: "#070d11",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${ui.variable} ${body.variable}`}
    >
      <body>
        {/* Ambient embers (behind, additive) + film grain (on top). Both are fixed,
            pointer-events-none, and self-disable under prefers-reduced-motion. */}
        <Sparks />
        {children}
        <div className="film-grain-layer" aria-hidden="true">
          <div className="film-grain" />
        </div>
      </body>
    </html>
  );
}
