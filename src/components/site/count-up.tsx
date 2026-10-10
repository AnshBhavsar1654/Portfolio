"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

export function CountUp({
  to,
  decimals = 0,
  suffix = "",
}: {
  to: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el || reduce) return;
    const c = animate(0, to, {
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = v.toFixed(decimals) + suffix;
      },
    });
    return () => c.stop();
  }, [inView, reduce, to, decimals, suffix]);

  // SSR / no-JS / reduced-motion show the final value
  return (
    <span ref={ref} className="tabular-nums">
      {to.toFixed(decimals)}
      {suffix}
    </span>
  );
}
