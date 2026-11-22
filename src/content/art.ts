// Images for the halftone prints behind the quote section, the only section
// with a photo backdrop; every other section sits on the plain ink ground.
// Every image lives in /public/img.
export type Art = {
  src: string;
  focusX?: number; // 0 = crop from the left, 1 = from the right
  focusY?: number; // 0 = crop from the top, 1 = from the bottom
  zoom?: number; // 1 = fill the frame, 2 = crop to the middle half
  brightInk?: boolean; // dark-background photo: print the bright parts
  // Wide screens: keep the print to one side, fading toward the content.
  // "half-*" pins a print to exactly one half of the viewport so two prints
  // can sit side by side in a single row.
  align?: "full" | "left" | "right" | "half-left" | "half-right";
  // Phone/tablet boxes are tall and narrow, so the same focus/zoom that
  // flatters a landscape half-view can magnify one shapeless sliver. These
  // values replace focus/zoom below the lg breakpoint when present.
  mobile?: { focusX?: number; focusY?: number; zoom?: number };
};

export const art = {
  // The hero has no photo print: its backdrop is the live dot signal
  // (HeroSignal), so the first screen stays clean.
  quoteDhoni: {
    src: "/img/ms-dhoni.jpg",
    align: "half-left",
    focusX: 0.45,
    focusY: 0.5,
  },
  // Messi hoisting the 2022 World Cup trophy on his shoulder (Getty Images
  // #1453215393): bright jersey and trophy over a blurred stadium crowd.
  // Zoom prints tighter than fill so his face spans enough dot cells to
  // stay recognizable at the 7px screen pitch.
  quoteMessi: {
    src: "/img/lionel-messi.jpg",
    align: "half-right",
    focusX: 0.5,
    focusY: 0.4,
    zoom: 1.75,
    // A phone's full-bleed box is a tall slice of a landscape photo; zoom 1
    // keeps the full subject in frame instead of magnifying his shoulder.
    mobile: { zoom: 1 },
  },
} satisfies Record<string, Art>;

export type ArtKey = keyof typeof art;
