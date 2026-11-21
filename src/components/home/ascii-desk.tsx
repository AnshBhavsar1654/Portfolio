"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { profile } from "@/content/profile";
import {
  buildDynamic,
  buildStatic,
  H,
  NAMES,
  W,
  type Grid,
  type Palette,
} from "@/components/home/ascii-desk-scene";

// Canvas renderer for the ASCII dream desk (scene data: ascii-desk-scene.ts).
// Like the pale-blue-dot site it leans on, the expensive part is drawn once:
// the dot matrix and every static character go into an offscreen layer, and
// each tick only repaints what moves (screens, stars, steam, dithered light,
// the poster scan band, the pointer stir). Paused when off-screen or hidden;
// reduced motion draws one still frame and ignores the pointer.

const FPS = 8;

// The clock shows the time in the owner's timezone (content/profile.ts).
const clockFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: profile.timezone,
  hourCycle: "h23",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});
function clockNow() {
  const v = Object.fromEntries(
    clockFormat.formatToParts(new Date()).map((p) => [p.type, Number(p.value)])
  );
  return { h: v.hour, m: v.minute, s: v.second };
}
const GLYPH_EM = 0.6; // monospace glyph width as a share of font size
const FRAME_MS = 1000 / FPS;

function readPalette(el: Element): Palette {
  const cs = getComputedStyle(el);
  return Object.fromEntries(
    NAMES.map((n) => [n, cs.getPropertyValue(`--desk-${n}`).trim() || "#888"])
  ) as Palette;
}

export function AsciiDesk() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let palette = readPalette(canvas);
    let stat: Grid = buildStatic(palette);
    let layer: HTMLCanvasElement | null = null;
    let cw = 0;
    let ch = 0;
    let font = "";
    let t = 0;
    let visible = true;
    let pointer: { x: number; y: number } | null = null;

    const glyphs = (c: CanvasRenderingContext2D, g: Grid) => {
      c.font = font;
      c.textAlign = "center";
      c.textBaseline = "middle";
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          const k = g.ch[y][x];
          if (k === " ") continue;
          c.fillStyle = g.col[y][x];
          c.fillText(k, x * cw + cw / 2, y * ch + ch / 2);
        }
    };

    const layout = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return false;
      cw = rect.width / W;
      ch = cw * 2;
      font = `${cw / GLYPH_EM}px ${getComputedStyle(canvas).fontFamily}`;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(ch * H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Static layer: background, dot matrix, every character that never moves.
      layer = document.createElement("canvas");
      layer.width = canvas.width;
      layer.height = canvas.height;
      const c = layer.getContext("2d");
      if (!c) return false;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.fillStyle = palette.bg;
      c.fillRect(0, 0, rect.width, ch * H);
      c.fillStyle = palette.dot;
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++)
          c.fillRect(x * cw + cw * 0.4, y * ch + ch * 0.55, cw * 0.2, cw * 0.2);
      glyphs(c, stat);
      return true;
    };

    const paint = () => {
      if (!layer || cw === 0) return;
      const w = cw * W;
      ctx.drawImage(layer, 0, 0, w, ch * H);
      const frame = buildDynamic(
        t,
        palette,
        stat,
        reduce ? null : pointer,
        clockNow(),
        !!reduce
      );
      ctx.fillStyle = palette.bg;
      for (const [x0, y0, x1, y1] of frame.wipes)
        ctx.fillRect(x0 * cw, y0 * ch, (x1 - x0 + 1) * cw, (y1 - y0 + 1) * ch);
      glyphs(ctx, frame.grid);
    };

    const rebuild = () => {
      palette = readPalette(canvas);
      stat = buildStatic(palette);
      if (layout()) paint();
    };

    rebuild();
    void document.fonts?.ready.then(rebuild);

    const ro = new ResizeObserver(rebuild);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);

    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer = {
        x: Math.floor(((e.clientX - r.left) / r.width) * W),
        y: Math.floor(((e.clientY - r.top) / r.height) * H),
      };
    };
    const leave = () => {
      pointer = null;
    };
    if (!reduce) {
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerleave", leave);
    }

    let id = 0;
    if (!reduce) {
      id = window.setInterval(() => {
        if (!visible || document.hidden) return;
        t += 1;
        paint();
      }, FRAME_MS);
    }

    return () => {
      window.clearInterval(id);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, [reduce]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="Animated ASCII illustration of a dream desk: a laptop with scrolling code, a side monitor with live bars, three framed posters, a night window, a shelf, a lamp and a steaming mug. Move the pointer over it to stir the characters."
      className="border-rule block w-full border-(length:--rule-w) font-mono shadow-(--shadow-offset)"
      style={{ aspectRatio: `${W} / ${H * 2}`, background: "var(--desk-bg)" }}
    />
  );
}
