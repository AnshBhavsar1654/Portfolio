// Images for the halftone section backdrops. Every image lives in
// /public/img.
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
  hero: {
    src: "/img/ahmedabad-aerial.jpg",
    align: "right",
    focusX: 0.4,
    focusY: 0.9,
    zoom: 1.2,
  },
  about: {
    src: "/img/ahmedabad-skyline.jpg",
    align: "right",
    focusX: 0.6,
    focusY: 0.4,
  },
  experience: {
    src: "/img/atal-bridge.jpg",
    focusY: 0.3,
  },
  education: {
    src: "/img/nirma-campus.jpg",
    focusY: 0.45,
  },
  work: {
    src: "/img/ahmedabad-metro.jpg",
    focusY: 0.5,
  },
  skills: {
    // Dark code-editor close-up (Pexels #256502, Pexels license): terminal
    // in low light. Dark photo — dots follow brightness (brightInk). Zoomed
    // in on the code column so glyphs span enough cells to survive the
    // ~7px dot pitch at full-bleed; focus sits below the bright top edge.
    src: "/img/code-editor-dark.jpg",
    brightInk: true,
    zoom: 1.75,
    focusX: 0.85,
    focusY: 0.55,
  },
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
  contact: {
    src: "/img/narendra-modi-stadium.jpg",
    focusY: 0.5,
  },
} satisfies Record<string, Art>;

export type ArtKey = keyof typeof art;
