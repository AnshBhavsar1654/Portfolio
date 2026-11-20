"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

// Hero art: a voice-like signal drawn in dots. It uses the same dot pitch
// (--ht-cell) and ink as the halftone backdrops, so the first screen and the
// prints behind the later sections read as one language. Mirrored columns of
// dots rise and fall like speech; the pointer lifts the columns near it with
// a soft lag. Entrance grows the columns left to right from a resting dotted
// line. Paints only while on screen and in a visible tab; under reduced
// motion it draws one still frame and repaints on theme change. Decorative:
// always aria-hidden. Colour and pitch are read from tokens, never literals.

const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
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
    let onScreen = true;
    let frame = 0;
    // Pointer position along the signal (0..1) and how strongly it is felt.
    let px = 0.5;
    let tx = 0.5;
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
    };

    const paint = (t: number, intro: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      const ox = (w - cols * cell) / 2;
      const oy = (h - rows * cell) / 2;
      const mid = (rows - 1) / 2;
      for (let i = 0; i < cols; i += 1) {
        const k = i / (cols - 1 || 1);
        const speech =
          0.3 +
          0.7 *
            Math.abs(
              Math.sin(k * 8.5 + t * 1.5) * Math.sin(k * 3.2 - t * 0.9)
            ) +
          0.18 * Math.pow(Math.sin(k * 21 + t * 3.1), 2);
        const bell = 0.5 + 0.5 * Math.exp(-Math.pow((k - 0.5) * 2.4, 2));
        const lift = 1 + near * 1.1 * Math.exp(-Math.pow((k - px) / 0.13, 2));
        const grow = smooth(intro * 1.6 - k * 0.6);
        const amp = Math.min(speech * bell * lift, 1.25) * grow * mid * 0.92;
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
          ctx.globalAlpha = a;
          ctx.beginPath();
          ctx.arc(
            ox + i * cell + cell / 2,
            oy + j * cell + cell / 2,
            r,
            0,
            6.2832
          );
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      frame = 0;
      near += (tNear - near) * 0.08;
      px += (tx - px) * 0.12;
      const intro = smooth((now - start) / 1100);
      paint((now - start) / 1000, intro);
      if (onScreen && !document.hidden && !motion.matches) {
        frame = requestAnimationFrame(tick);
      }
    };
    const run = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const still = () => {
      readTokens();
      resize();
      paint(1.2, 1);
    };

    readTokens();
    resize();
    if (motion.matches) paint(1.2, 1);
    else run();

    const ro = new ResizeObserver(() => {
      resize();
      if (motion.matches) paint(1.2, 1);
      else run();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) run();
    });
    io.observe(canvas);

    // Theme swaps rewrite data-theme on <html>: re-read the ink and repaint.
    const mo = new MutationObserver(() => {
      readTokens();
      if (motion.matches) paint(1.2, 1);
      else run();
    });
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    const onVisible = () => {
      if (!document.hidden) run();
    };
    document.addEventListener("visibilitychange", onVisible);
    motion.addEventListener("change", still);

    // Mouse and pen only: touch has no hover, so the signal just plays.
    const host = canvas.parentElement ?? canvas;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || motion.matches) return;
      const r = canvas.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width;
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
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
      motion.removeEventListener("change", still);
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
