import {
  Bricolage_Grotesque,
  Geist_Mono,
  Instrument_Serif,
} from "next/font/google";

// Body and headings. The optical-size axis gives display sizes tighter,
// more characterful shapes while small text stays open and readable.
export const sans = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-sans",
  display: "swap",
});

export const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Display serif: used for one emphasised (italic) word per heading and for
// big numerals. Never for body copy.
export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
