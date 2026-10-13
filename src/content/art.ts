// Images for the halftone section backdrops. Every image lives in
// /public/img.
export type Art = {
  src: string;
  focusX?: number; // 0 = crop from the left, 1 = from the right
  focusY?: number; // 0 = crop from the top, 1 = from the bottom
  zoom?: number; // 1 = fill the frame, 2 = crop to the middle half
  brightInk?: boolean; // dark-background photo: print the bright parts
  // Wide screens: keep the print to one side, fading toward the content.
  align?: "full" | "left" | "right";
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
    src: "/img/code-on-screen.jpg",
    brightInk: true,
    focusX: 0.4,
    focusY: 0.5,
  },
  quote: {
    src: "/img/ms-dhoni.jpg",
    align: "left",
    focusX: 0.68,
    focusY: 0.5,
  },
  contact: {
    src: "/img/narendra-modi-stadium.jpg",
    focusY: 0.5,
  },
} satisfies Record<string, Art>;

export type ArtKey = keyof typeof art;
