"use client";

import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { useEffect } from "react";
import {
  SCROLL_LERP,
  SCROLL_WHEEL_MULTIPLIER,
} from "@/components/site/motion-tokens";

// Eased wheel scrolling with the same soft follow as SmoothCursor. Native
// scrolling stays for touch, keyboard and reduced motion; anchor links glide
// to their target; it pauses while a modal locks the body.
export function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({
      lerp: SCROLL_LERP,
      wheelMultiplier: SCROLL_WHEEL_MULTIPLIER,
      anchors: true,
    });

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const syncLock = () => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    const mo = new MutationObserver(syncLock);
    mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduce]);

  return null;
}
