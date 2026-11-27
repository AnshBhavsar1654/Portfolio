// Existing portraits for the quote section. The crop values are also used
// by the dot screen so the texture stays registered over the photo.
export type Art = {
  src: string;
  side: "left" | "right";
  focusX: number;
  focusY: number;
};

export const art = {
  quoteDhoni: {
    src: "/img/ms-dhoni.jpg",
    side: "left",
    focusX: 0.58,
    focusY: 0.34,
  },
  quoteMessi: {
    src: "/img/lionel-messi.jpg",
    side: "right",
    focusX: 0.55,
    focusY: 0.35,
  },
} satisfies Record<string, Art>;

export type ArtKey = keyof typeof art;
