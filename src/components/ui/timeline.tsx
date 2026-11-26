"use client";

import { motion, useScroll } from "motion/react";
import { useRef, type ReactNode } from "react";
import styles from "./timeline.module.css";

interface TimelineEntry {
  title: string;
  content: ReactNode;
}

// Adapted from Aceternity UI's Timeline. The beam scales with scroll progress
// so the rail can follow content and viewport changes without measuring cards.
export function Timeline({ data }: { data: readonly TimelineEntry[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rail,
    offset: ["start 35%", "end 35%"],
  });

  return (
    <div className="relative">
      <div ref={rail} aria-hidden="true" className={styles.rail}>
        <motion.div
          className={styles.beam}
          style={{ scaleY: scrollYProgress }}
        />
      </div>
      <ol className={styles.list}>
        {data.map(({ title, content }) => (
          <li key={title} className={styles.entry}>
            <div aria-hidden="true" className={styles.marker}>
              <span />
            </div>
            <p className={styles.date}>{title}</p>
            <div className={styles.content}>{content}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
