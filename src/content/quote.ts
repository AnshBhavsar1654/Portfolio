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
