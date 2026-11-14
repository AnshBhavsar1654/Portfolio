"use client";

import { motion, useReducedMotion, type PanInfo } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { profile } from "@/content/profile";

// A small pile of photos. Fling the front card sideways (or press Enter on
// it) and it tucks in at the back; the rest spring forward. Horizontal drag
// only, so a thumb scrolling the page past it is never captured. Under
// reduced motion the pile still shuffles, without the springs.
const REST = [
  { rotate: 0, x: 0, y: 0, scale: 1 },
  { rotate: -5, x: -18, y: 12, scale: 0.96 },
  { rotate: 4, x: 16, y: 20, scale: 0.93 },
];
const THROW = 80; // px of horizontal travel that counts as a throw
const SPRING = { type: "spring", stiffness: 260, damping: 26 } as const;

export function PhotoStack() {
  const photos = profile.heroStack;
  const reduce = useReducedMotion();
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const cycle = () => setOrder((o) => [...o.slice(1), o[0]]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > THROW) cycle();
  };

  return (
    <div className="relative aspect-[4/5] w-full">
      {order.map((photoIndex, pos) => {
        const photo = photos[photoIndex];
        const front = pos === 0;
        const rest = REST[Math.min(pos, REST.length - 1)];
        return (
          <motion.div
            key={photo.src}
            role={front ? "button" : undefined}
            tabIndex={front ? 0 : -1}
            aria-hidden={front ? undefined : true}
            aria-label={front ? `${photo.alt}. Shuffle photos` : undefined}
            onKeyDown={
              front
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      cycle();
                    }
                  }
                : undefined
            }
            className="border-line bg-surface absolute inset-0 overflow-hidden rounded-[var(--radius-panel)] border shadow-(--shadow-lift) data-[front=true]:cursor-grab data-[front=true]:active:cursor-grabbing"
            data-front={front}
            style={{ zIndex: photos.length - pos }}
            initial={false}
            animate={rest}
            transition={reduce ? { duration: 0 } : SPRING}
            drag={front && !reduce ? "x" : false}
            dragSnapToOrigin
            dragElastic={0.55}
            whileDrag={{ scale: 1.03, rotate: 2 }}
            onDragEnd={onDragEnd}
          >
            <Image
              src={photo.src}
              alt=""
              fill
              priority={photoIndex === 0}
              draggable={false}
              sizes="384px"
              className="pointer-events-none object-cover object-top select-none"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
