import { Hanken_Grotesk, IBM_Plex_Mono, Newsreader } from "next/font/google";

// Body copy and UI. Hanken Grotesk: calm, slightly humanist, reads well small
// against the ink ground.
export const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Data: eyebrows, dates, tags, metrics. Plex Mono keeps the printed-ledger feel.
export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// Display serif: headings, set roman, with one italic accent word per heading.
// The optical-size axis tightens the shapes at display sizes. Never for body.
export const serif = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
