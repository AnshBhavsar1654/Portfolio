// Images for the halftone section backdrops. Every image lives in
// /public/img. Openly licensed photos carry their licence credit, shown with
// the caption on the section.
export type Art = {
  src: string;
  caption?: string;
  focusX?: number; // 0 = crop from the left, 1 = from the right
  focusY?: number; // 0 = crop from the top, 1 = from the bottom
  zoom?: number; // 1 = fill the frame, 2 = crop to the middle half
  brightInk?: boolean; // dark-background photo: print the bright parts
  // Wide screens: keep the print to one side, fading toward the content.
  align?: "full" | "left" | "right";
  credit?: { text: string; href: string };
};

export const art = {
  hero: {
    src: "/img/ahmedabad-aerial.jpg",
    align: "right",
    caption: "Sabarmati, Ahmedabad",
    focusX: 0.4,
    focusY: 0.9,
    zoom: 1.2,
    credit: {
      text: "Photo: Brihaspati, CC BY-SA 4.0",
      href: "https://commons.wikimedia.org/wiki/File:Aerial_shot_of_Ahmedabad_city,_the_Sabarmati_river,_and_bridges.jpg",
    },
  },
  about: {
    src: "/img/ahmedabad-skyline.jpg",
    align: "right",
    caption: "Ahmedabad",
    focusX: 0.6,
    focusY: 0.4,
    credit: {
      text: "Photo: Anmay204, CC BY-SA 4.0",
      href: "https://commons.wikimedia.org/wiki/File:Ahemdabad_Skyline.jpg",
    },
  },
  experience: {
    src: "/img/atal-bridge.jpg",
    caption: "Atal Bridge, Ahmedabad",
    focusY: 0.3,
    credit: {
      text: "Photo: Rahilarious, CC BY-SA 4.0",
      href: "https://commons.wikimedia.org/wiki/File:Foot_bridge_at_Ahmedabad_Sabarmati_Riverfront.jpg",
    },
  },
  education: {
    src: "/img/nirma-campus.jpg",
    caption: "Institute of Technology, Nirma University",
    focusY: 0.45,
    credit: {
      text: "Photo: NUAhmedabad, CC BY-SA 4.0",
      href: "https://commons.wikimedia.org/wiki/File:1920x1285.jpg",
    },
  },
  work: {
    src: "/img/ahmedabad-metro.jpg",
    caption: "Ahmedabad Metro",
    focusY: 0.5,
    credit: {
      text: "Photo: Nizil Shah, CC BY-SA 4.0",
      href: "https://commons.wikimedia.org/wiki/File:Ahmedabad_Metro_Red_Line_26.jpg",
    },
  },
  skills: {
    src: "/img/code-on-screen.jpg",
    brightInk: true,
    caption: "Code on screen",
    focusX: 0.4,
    focusY: 0.5,
    credit: {
      text: "Photo: Sai Kiran Anagani, CC0",
      href: "https://commons.wikimedia.org/wiki/File:CSS_code_on_a_screen_(Unsplash).jpg",
    },
  },
  quote: {
    src: "/img/ms-dhoni.jpg",
    align: "left",
    caption: "MS Dhoni",
    focusX: 0.68,
    focusY: 0.5,
  },
  contact: {
    src: "/img/narendra-modi-stadium.jpg",
    caption: "Narendra Modi Stadium, Ahmedabad",
    focusY: 0.5,
    credit: {
      text: "Photo: A Cricket Premi, CC BY-SA 4.0",
      href: "https://commons.wikimedia.org/wiki/File:Narendra_Modi_Stadium_view_from_the_gallery.jpg",
    },
  },
} satisfies Record<string, Art>;

export type ArtKey = keyof typeof art;
