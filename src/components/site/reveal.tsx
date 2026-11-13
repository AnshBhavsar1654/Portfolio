"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import {
  EASE_BASE,
  REVEAL_RISE,
  REVEAL_SECONDS,
} from "@/components/site/motion-tokens";

// Block-granularity reveal reading duration/easing tokens. Renders a plain
// div under reduced motion (final state immediately).
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: REVEAL_RISE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: REVEAL_SECONDS,
        delay: Math.min(delay, 0.3),
        ease: EASE_BASE,
      }}
    >
      {children}
    </motion.div>
  );
}
