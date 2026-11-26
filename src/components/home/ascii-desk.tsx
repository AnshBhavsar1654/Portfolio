"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { profile } from "@/content/profile";
import type { MatchCard } from "@/lib/barcelona-match";
import {
  buildDynamic,
  buildStatic,
  H,
  MONITOR_INNER,
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
const MATCH_REFRESH_MS = 60_000;

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
    let match: MatchCard | null = null;
    let unavailable = false;
    let disposed = false;
    const logos = new Map<string, HTMLImageElement>();

    const loadLogo = (url: string | null) => {
      if (!url || logos.has(url)) return;
      const image = new Image();
      logos.set(url, image);
      image.onload = () => {
        if (!disposed) paint();
      };
      image.onerror = () => {
        if (image.src.includes("/500-dark/")) {
          image.src = image.src.replace("/500-dark/", "/500/");
        }
      };
      image.src = url;
    };

    const refreshMatch = async () => {
      try {
        const response = await fetch("/api/barcelona-match", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Match unavailable");
        const data = (await response.json()) as { match: MatchCard | null };
        if (disposed) return;
        match = data.match;
        unavailable = !match;
        if (match) {
          loadLogo(match.competitionLogo);
          loadLogo(match.home.logo);
          loadLogo(match.away.logo);
        }
      } catch {
        if (disposed) return;
        // Preserve the last result if a later refresh fails, but mark it stale.
        unavailable = true;
      }
      paint();
    };

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
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return false;
      // Pinch zoom enlarges the visual viewport without changing CSS dimensions
      // or devicePixelRatio. Supersampling also keeps desktop zoom crisper.
      const zoom = window.visualViewport?.scale || 1;
      const dpr = Math.min(
        (window.devicePixelRatio || 1) * Math.max(2, zoom),
        4096 / rect.width
      );
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
      const { x, y, width, height } = MONITOR_INNER;
      const left = x * cw;
      const top = y * ch;
      const screenWidth = width * cw;
      const screenHeight = height * ch;
      ctx.save();
      ctx.beginPath();
      ctx.rect(left, top, screenWidth, screenHeight);
      ctx.clip();
      ctx.fillStyle = palette.bg;
      ctx.fillRect(left, top, screenWidth, screenHeight);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const text = (
        value: string,
        x: number,
        y: number,
        size: number,
        maxWidth: number
      ) => {
        ctx.font = `bold ${size * ch}px ${getComputedStyle(canvas).fontFamily}`;
        ctx.fillText(
          value,
          left + x * screenWidth,
          top + y * screenHeight,
          maxWidth * screenWidth
        );
      };
      const logo = (url: string | null, x: number, y: number, size: number) => {
        const image = url ? logos.get(url) : null;
        if (image?.complete && image.naturalWidth) {
          const h = size * screenHeight;
          const w = (h * image.naturalWidth) / image.naturalHeight;
          const drawWidth = Math.min(w, screenWidth * 0.2);
          ctx.drawImage(
            image,
            left + x * screenWidth - drawWidth / 2,
            top + y * screenHeight - h / 2,
            drawWidth,
            h
          );
        }
      };
      ctx.fillStyle = palette.line;
      if (!match) {
        text(
          unavailable ? "SCORE UNAVAILABLE" : "LOADING SCORE",
          0.5,
          0.5,
          0.8,
          0.9
        );
      } else {
        logo(match.competitionLogo, 0.5, 0.21, 0.27);
        ctx.fillStyle = palette.line;
        text(match.competition.toUpperCase(), 0.5, 0.42, 0.55, 0.9);
        ctx.fillStyle = palette.blue;
        text(
          unavailable
            ? "OFFLINE"
            : match.incomplete
              ? "PARTIAL FEED"
              : match.live
                ? match.status
                : "FULL TIME",
          0.5,
          0.56,
          0.65,
          0.6
        );
        ctx.fillStyle = palette.dim;
        const rows = Math.max(
          match.home.scorers.length,
          match.away.scorers.length,
          1
        );
        const scorerHeight = 0.17;
        const scorerSize = Math.min(0.48, (scorerHeight * height) / rows);
        for (const [side, position] of [
          [match.home, 0.25],
          [match.away, 0.75],
        ] as const) {
          side.scorers.forEach((scorer, index) => {
            text(
              scorer,
              position,
              0.59 + ((index + 0.5) * scorerHeight) / rows,
              scorerSize,
              0.45
            );
          });
        }
        logo(match.home.logo, 0.1, 0.88, 0.2);
        logo(match.away.logo, 0.9, 0.88, 0.2);
        ctx.fillStyle = palette.line;
        text(match.home.name, 0.26, 0.88, 0.75, 0.22);
        text(`${match.home.score} : ${match.away.score}`, 0.5, 0.88, 1.1, 0.26);
        text(match.away.name, 0.74, 0.88, 0.75, 0.22);
      }
      ctx.restore();
    };

    const rebuild = () => {
      palette = readPalette(canvas);
      stat = buildStatic(palette);
      if (layout()) paint();
    };

    rebuild();
    void refreshMatch();
    const matchTimer = window.setInterval(() => {
      if (visible && !document.hidden) void refreshMatch();
    }, MATCH_REFRESH_MS);
    void document.fonts?.ready.then(rebuild);

    const ro = new ResizeObserver(rebuild);
    ro.observe(canvas);
    // Browser zoom can change devicePixelRatio without changing the CSS width.
    window.addEventListener("resize", rebuild);
    window.visualViewport?.addEventListener("resize", rebuild);
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
      disposed = true;
      window.clearInterval(matchTimer);
      for (const image of logos.values()) {
        image.onload = null;
        image.onerror = null;
      }
      window.clearInterval(id);
      ro.disconnect();
      window.removeEventListener("resize", rebuild);
      window.visualViewport?.removeEventListener("resize", rebuild);
      io.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, [reduce]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="Animated ASCII illustration of a dream desk: a laptop typing code and a side monitor showing a Barcelona football score, beneath a night window. Move the pointer over it to stir the characters."
      className="border-rule block w-full border-(length:--rule-w) font-mono shadow-(--shadow-offset)"
      style={{ aspectRatio: `${W} / ${H * 2}`, background: "var(--desk-bg)" }}
    />
  );
}
