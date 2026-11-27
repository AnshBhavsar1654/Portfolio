"use client";

import { useEffect, useState } from "react";
import { HalftoneImage } from "@/components/site/halftone-image";
import { art } from "@/content/art";
import { quotes } from "@/content/quote";
import styles from "./quote-backdrop.module.css";

function smooth(value: number) {
  const t = Math.min(1, Math.max(0, value));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function BackdropStage() {
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    const section = document.getElementById("quote");
    if (!section) return;

    let frame = 0;
    let last = -1;
    const update = () => {
      frame = 0;
      const { top, bottom } = section.getBoundingClientRect();
      const height = window.innerHeight;
      const center = height / 2;
      const blend = height * 0.85;
      const enter = smooth((center - top) / blend + 0.5);
      const leave = smooth((bottom - center) / blend + 0.5);
      const step = Math.round(enter * leave * 100);
      if (step === last) return;
      last = step;
      setWeight(step / 100);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(section);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  if (weight === 0) return null;
  return (
    <div
      aria-hidden="true"
      className={styles.stage}
      style={{ opacity: weight }}
    >
      {quotes.map((quote) => {
        const { side, ...portrait } = art[quote.art];
        return (
          <div key={quote.art} className={styles.portrait} data-side={side}>
            <HalftoneImage {...portrait} />
          </div>
        );
      })}
    </div>
  );
}
