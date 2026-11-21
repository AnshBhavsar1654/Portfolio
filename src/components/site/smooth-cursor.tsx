"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  CURSOR_PRESS_SCALE,
  CURSOR_SPRING,
  CURSOR_TURN_MIN_SPEED,
  CURSOR_TURN_SPRING,
} from "@/components/site/motion-tokens";

// Spring-following arrow that replaces the system cursor. Fine pointers only,
// and never under reduced motion: touch and keyboard users are untouched.
// The native cursor is hidden through [data-smooth-cursor] (base.css).
export function SmoothCursor() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useSpring(useMotionValue(-100), CURSOR_SPRING);
  const y = useSpring(useMotionValue(-100), CURSOR_SPRING);
  const rotate = useSpring(useMotionValue(0), CURSOR_TURN_SPRING);
  const last = useRef<{ x: number; y: number } | null>(null);
  const angle = useRef(0);

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setActive(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduce]);

  useEffect(() => {
    if (!active || reduce) return;
    const root = document.documentElement;
    root.dataset.smoothCursor = "on";

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const p = last.current;
      if (p) {
        const dx = e.clientX - p.x;
        const dy = e.clientY - p.y;
        if (Math.hypot(dx, dy) > CURSOR_TURN_MIN_SPEED) {
          // Shortest way round, so the arrow never spins a full turn.
          const target = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
          let delta = target - (angle.current % 360);
          if (delta > 180) delta -= 360;
          if (delta < -180) delta += 360;
          angle.current += delta;
          rotate.set(angle.current);
          last.current = { x: e.clientX, y: e.clientY };
        }
      } else {
        last.current = { x: e.clientX, y: e.clientY };
      }
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      delete root.dataset.smoothCursor;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [active, reduce, x, y, rotate]);

  if (!active || reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-(--z-cursor)"
      style={{ x, y, translateX: "-50%", translateY: "-50%", rotate }}
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="size-(--cursor-size) drop-shadow-sm"
        animate={{ scale: pressed ? CURSOR_PRESS_SCALE : 1 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      >
        <path
          d="M12 2 L21 21 L12 16.5 L3 21 Z"
          className="fill-accent stroke-bg"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
}
