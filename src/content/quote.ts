// Two quotes. On wide screens they stack in one column over the seam
// between the two athlete prints (Dhoni left, Messi right); on phones each
// quote gets its own screen-height block with only its own athlete printing
// behind it. `art` names the print bound to each quote.
import type { ArtKey } from "@/content/art";

export type Quote = {
  text: string;
  author: string;
  art: ArtKey;
};

export const quotes: Quote[] = [
  {
    text: "Process is more important than results.",
    author: "MS Dhoni",
    art: "quoteDhoni",
  },
  {
    text: "The day you think there are no improvements to be made is a sad one.",
    author: "Lionel Messi",
    art: "quoteMessi",
  },
];
