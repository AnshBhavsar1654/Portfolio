"use client";

import { useEffect, useState } from "react";
import { HalftoneImage } from "@/components/site/halftone-image";
import { art, type Art, type ArtKey } from "@/content/art";
import { cn } from "@/lib/cn";

// One fixed stage behind the whole home page. Sections mark themselves with
// data-backdrop="<art key>". Every scroll frame, each section gets a weight
// from where its edges sit relative to the middle of the viewport: inside a
// section it is 1; across a boundary the outgoing print's dots shrink while
// the incoming print's dots grow, tied to the scroll position, so one image
// dissolves continuously into the next (and back when scrolling up). Past the
// last section the print dissolves into the page. Only sections with a
// non-zero weight are mounted, so at most two or three canvases exist.

type Layer = { key: ArtKey; weight: number };

// Half the height of the blend zone around each boundary, as a share of the
// viewport.
const BLEND = 0.4;

const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

export function BackdropStage() {
  const [layers, setLayers] = useState<Layer[]>([]);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-backdrop]")
    );
    if (sections.length === 0) return;
    // Warm the cache so an incoming print is ready before its blend starts.
    for (const a of Object.values(art)) new window.Image().src = a.src;

    let frame = 0;
    let last = "";
    const update = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      const zone = window.innerHeight * BLEND * 2;
      const next: Layer[] = [];
      sections.forEach((s, k) => {
        const r = s.getBoundingClientRect();
        const enter = k === 0 ? 1 : smooth((mid - r.top) / zone + 0.5);
        const leave = smooth((r.bottom - mid) / zone + 0.5);
        const weight = Math.round(enter * leave * 100) / 100;
        if (weight > 0) {
          next.push({ key: s.dataset.backdrop as ArtKey, weight });
        }
      });
      const sig = next.map((l) => `${l.key}:${l.weight}`).join("|");
      if (sig !== last) {
        last = sig;
        setLayers(next);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {layers.map(({ key, weight }) => {
        const a: Art = art[key];
        const align = a.align ?? "full";
        return (
          <div
            key={key}
            className={cn(
              "absolute inset-y-0",
              align === "full" && "inset-x-0",
              align === "left" && "backdrop-fade-r left-0 w-full lg:w-[62%]",
              align === "right" && "backdrop-fade-l right-0 w-full lg:w-[62%]"
            )}
          >
            <HalftoneImage
              src={a.src}
              amount={weight}
              focusX={a.focusX}
              focusY={a.focusY}
              zoom={a.zoom}
              brightInk={a.brightInk}
            />
          </div>
        );
      })}
      <div className="ht-veil absolute inset-0" />
    </div>
  );
}
