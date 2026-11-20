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
  // The hero has no photo print: its backdrop is the live dot signal
  // (HeroSignal), so the first screen stays clean and the prints begin at
  // About. Every new photo below is from Pexels (Pexels license, free to use);
  // the Pexels photo id is noted so it can be found again.
  about: {
    // Batter raising the bat to the sky (Pexels #10987827), mirrored so he
    // stands on the right, clear of the fade toward the text.
    src: "/img/cricketer-bat.jpg",
    align: "right",
    focusX: 0.5,
    focusY: 0.3,
  },
  experience: {
    // Rocket lifting off its pad: building from zero (Pexels #586043).
    src: "/img/rocket-launch.jpg",
    focusX: 0.55,
    focusY: 0.35,
    zoom: 1.3,
  },
  education: {
    // Nirma University campus: kept as is.
    src: "/img/nirma-campus.jpg",
    focusY: 0.45,
  },
  work: {
    // White robot over a glowing network, a dark photo: the bright parts
    // print (Pexels #8566472).
    src: "/img/robot-bot.jpg",
    brightInk: true,
    focusX: 0.5,
    focusY: 0.45,
    zoom: 1.25,
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
    // Arms up on a summit at sunrise: "what's next" (Pexels #15712479).
    src: "/img/summit-sunrise.jpg",
    focusX: 0.4,
    focusY: 0.6,
  },
} satisfies Record<string, Art>;

export type ArtKey = keyof typeof art;
