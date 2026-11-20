"use client";

import { useEffect, useRef } from "react";
import {
  ENTER_SECONDS,
  ENTER_STAGGER_SECONDS,
  HERO_VISUAL_INDEX,
} from "@/components/site/motion-tokens";
import { cn } from "@/lib/cn";

// Hero art: a still dot matrix with a speech-like signal drawn into it. It
// uses the halftone pitch (--ht-cell) and the accent ink, so the first screen
// and the prints behind later sections read as one language. Nothing moves on
// its own: the matrix only reacts to the pointer. Dots within reach swell,
// brighten and lean away from it, with a soft lag; when the pointer leaves it
// settles and the frame loop stops. The intro grows the signal from a resting
// dotted line, timed to land with the hero's last entrance step. Reduced
// motion draws one still frame. Decorative: always aria-hidden. Colour and
// pitch are read from tokens, never literals.

const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

const INTRO_DELAY_MS = HERO_VISUAL_INDEX * ENTER_STAGGER_SECONDS * 1000;
const INTRO_MS = ENTER_SECONDS * 1000;
const REACH = 0.28; // pointer reach, as a share of the shorter side
const LEAN = 0.9; // how far (in cells) a dot leans away at full strength
const SWELL = 1.2; // extra radius at full strength
const FOLLOW = 0.18; // pointer position lag (per frame)
const FADE = 0.1; // pointer strength lag (per frame)

// Signal envelope along 0..1. Fixed phases, so the frame is a still image.
const envelope = (k: number) => {
  const speech =
    0.3 +
    0.7 * Math.abs(Math.sin(k * 8.5 + 1.2) * Math.sin(k * 3.2 - 0.7)) +
    0.18 * Math.pow(Math.sin(k * 21 + 0.5), 2);
  const bell = 0.5 + 0.5 * Math.exp(-Math.pow((k - 0.5) * 2.4, 2));
  return Math.min(speech * bell, 1.25);
};

export function HeroSignal({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const root = document.documentElement;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = performance.now();
    let cell = 7;
    let color = "";
    let w = 0;
    let h = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let amps: number[] = [];
    let frame = 0;
    // Pointer position (canvas px) and how strongly it is felt, with targets.
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;
    let near = 0;
    let tNear = 0;

    const readTokens = () => {
      const pitch = parseFloat(
        getComputedStyle(root).getPropertyValue("--ht-cell")
      );
      if (pitch > 0) cell = pitch;
      color = getComputedStyle(canvas).color;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cols = Math.max(1, Math.floor(w / cell));
      rows = Math.max(1, Math.floor(h / cell));
      const mid = (rows - 1) / 2;
      amps = Array.from(
        { length: cols },
        (_, i) => envelope(i / (cols - 1 || 1)) * mid * 0.92
      );
    };

    const paint = (intro: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      const ox = (w - cols * cell) / 2;
      const oy = (h - rows * cell) / 2;
      const mid = (rows - 1) / 2;
      const reach = Math.max(1, Math.min(w, h) * REACH);
      for (let i = 0; i < cols; i += 1) {
        const k = i / (cols - 1 || 1);
        const grow = smooth(intro * 1.6 - k * 0.6);
        const amp = amps[i] * grow;
        for (let j = 0; j < rows; j += 1) {
          const d = Math.abs(j - mid);
          let a: number;
          let r: number;
          if (d <= amp) {
            const s = 1 - (d / (amp || 1)) * 0.7;
            a = 0.35 + 0.65 * s;
            r = cell * 0.46 * (0.4 + 0.6 * s);
          } else {
            a = 0.16;
            r = cell * 0.12;
          }
          let x = ox + i * cell + cell / 2;
          let y = oy + j * cell + cell / 2;
          if (near > 0.002) {
            const dx = x - px;
            const dy = y - py;
            const dist = Math.hypot(dx, dy) || 1;
            const f = near * Math.exp(-Math.pow(dist / reach, 2));
            if (f > 0.004) {
              x += (dx / dist) * f * cell * LEAN;
              y += (dy / dist) * f * cell * LEAN;
              r *= 1 + f * SWELL;
              a = Math.min(1, a + f * 0.5);
            }
          }
          ctx.globalAlpha = a;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 6.2832);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    // The loop runs only while something is changing: the intro, or the
    // pointer field easing in or out.
    const tick = (now: number) => {
      frame = 0;
      near += (tNear - near) * FADE;
      px += (tx - px) * FOLLOW;
      py += (ty - py) * FOLLOW;
      const raw = (now - start - INTRO_DELAY_MS) / INTRO_MS;
      paint(smooth(raw));
      const settling = Math.abs(tNear - near) > 0.002 || near > 0.002;
      if (raw < 1 || settling) frame = requestAnimationFrame(tick);
    };
    const run = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const redraw = () => {
      if (motion.matches) paint(1);
      else run();
    };

    readTokens();
    resize();
    if (motion.matches) paint(1);
    else run();

    const ro = new ResizeObserver(() => {
      resize();
      redraw();
    });
    ro.observe(canvas);

    // Theme swaps rewrite data-theme on <html>: re-read the ink and repaint.
    const mo = new MutationObserver(() => {
      readTokens();
      redraw();
    });
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    const onMotionChange = () => {
      readTokens();
      resize();
      if (motion.matches) {
        near = 0;
        tNear = 0;
      }
      redraw();
    };
    motion.addEventListener("change", onMotionChange);

    // Mouse and pen only: touch has no hover, so the matrix just sits.
    const host = canvas.parentElement ?? canvas;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || motion.matches) return;
      const r = canvas.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (tNear === 0) {
        // First contact: start the field at the pointer, no sweep from (0,0).
        px = tx;
        py = ty;
      }
      tNear = 1;
      run();
    };
    const onLeave = () => {
      tNear = 0;
      run();
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      mo.disconnect();
      motion.removeEventListener("change", onMotionChange);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("text-accent block h-full w-full", className)}
    />
  );
}
