"use client";

import { useEffect, useRef } from "react";

// Risograph halftone print. The photo is cover-cropped to the box it fills
// and printed as two dot screens, like a two-colour sports almanac: an ink
// screen at 45° and a red spot screen at 15°, slightly out of register. Dot
// size follows tone (darkness in light mode, brightness in dark mode, via
// --ht-invert) and the screens combine with --ht-blend. `amount` scales every
// dot (0 = blank paper, 1 = full print); the BackdropStage drives it from the
// scroll position to dissolve one print into the next. Colours and pitch are
// tokens. Decorative only: always aria-hidden.

const INK_ANGLE = Math.PI / 4;
const SPOT_ANGLE = Math.PI / 12;

type Props = {
  src: string;
  amount?: number; // 0..1, dot scale
  focusX?: number; // 0 crops from the left, 1 from the right
  focusY?: number; // 0 crops from the top, 1 from the bottom
  zoom?: number; // 1 = fill the box, 2 = crop to the middle half
  // Dark-background photos (screens, night shots): dots follow brightness in
  // both themes, so the subject prints instead of the background.
  brightInk?: boolean;
};

type Tone = { lum: Float32Array; gw: number; gh: number; q: number };

export function HalftoneImage({
  src,
  amount = 1,
  focusX = 0.5,
  focusY = 0.5,
  zoom = 1,
  brightInk = false,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const amountRef = useRef(amount);
  const paintRef = useRef<() => void>(() => {});

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!box || !canvas || !ctx) return;

    const img = new window.Image();
    let tone: Tone | null = null;
    let loaded = false;

    const token = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    // Capped at 1.5x: these are soft backdrops and repaint while scrolling.
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      return {
        dpr,
        w: Math.round(box.clientWidth * dpr),
        h: Math.round(box.clientHeight * dpr),
      };
    };

    // Tone map at half the screen pitch: cover crop, auto-levels, mild
    // S-curve so midtones separate. Rebuilt only when the box resizes.
    const buildTone = (w: number, h: number, d: number): Tone | null => {
      const q = Math.max(1, d / 2);
      const gw = Math.max(1, Math.ceil(w / q));
      const gh = Math.max(1, Math.ceil(h / q));
      const sampler = document.createElement("canvas");
      sampler.width = gw;
      sampler.height = gh;
      const sctx = sampler.getContext("2d", { willReadFrequently: true });
      if (!sctx) return null;
      sctx.imageSmoothingQuality = "high";
      const ratio = w / h;
      const sw = img.naturalWidth;
      const sh = img.naturalHeight;
      let cw = sw;
      let ch = sw / ratio;
      if (sw / sh > ratio) {
        cw = sh * ratio;
        ch = sh;
      }
      cw /= zoom;
      ch /= zoom;
      sctx.drawImage(
        img,
        (sw - cw) * focusX,
        (sh - ch) * focusY,
        cw,
        ch,
        0,
        0,
        gw,
        gh
      );
      const { data } = sctx.getImageData(0, 0, gw, gh);
      const lum = new Float32Array(gw * gh);
      const hist = new Uint32Array(256);
      for (let i = 0; i < lum.length; i += 1) {
        const v =
          0.2126 * data[i * 4] +
          0.7152 * data[i * 4 + 1] +
          0.0722 * data[i * 4 + 2];
        lum[i] = v;
        hist[Math.min(255, Math.round(v))] += 1;
      }
      const edge = (frac: number) => {
        let sum = 0;
        for (let b = 0; b < 256; b += 1) {
          sum += hist[b];
          if (sum >= lum.length * frac) return b;
        }
        return 255;
      };
      const lo = edge(0.02);
      const hi = Math.max(lo + 1, edge(0.98));
      for (let i = 0; i < lum.length; i += 1) {
        const t = Math.min(1, Math.max(0, (lum[i] - lo) / (hi - lo)));
        lum[i] = t * t * (3 - 2 * t);
      }
      return { lum, gw, gh, q };
    };

    // One screen: a rotated dot lattice, all dots in a single path.
    const screen = (
      w: number,
      h: number,
      d: number,
      rMax: number,
      angle: number,
      offX: number,
      offY: number,
      curve: (t: number) => number
    ) => {
      if (!tone) return;
      const { lum, gw, gh, q } = tone;
      const invert = brightInk || token("--ht-invert") === "1";
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const n = Math.ceil(Math.hypot(w, h) / (2 * d)) + 1;
      const cx = w / 2 + offX;
      const cy = h / 2 + offY;
      ctx.beginPath();
      for (let i = -n; i <= n; i += 1) {
        for (let j = -n; j <= n; j += 1) {
          const x = cx + (i * cos - j * sin) * d;
          const y = cy + (i * sin + j * cos) * d;
          if (x < -d || y < -d || x > w + d || y > h + d) continue;
          const gx = Math.min(gw - 1, Math.max(0, Math.floor(x / q)));
          const gy = Math.min(gh - 1, Math.max(0, Math.floor(y / q)));
          const l = lum[gy * gw + gx];
          const t = curve(invert ? l : 1 - l);
          if (t <= 0.02) continue;
          const r = rMax * Math.sqrt(t);
          if (r <= 0.2) continue;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    };

    const paint = () => {
      if (!loaded) return;
      const { dpr, w, h } = size();
      if (!w || !h) return;
      const d = (Number.parseFloat(token("--ht-cell")) || 7) * dpr;
      if (canvas.width !== w || canvas.height !== h || !tone) {
        canvas.width = w;
        canvas.height = h;
        tone = buildTone(w, h, d);
      }
      ctx.clearRect(0, 0, w, h);
      const amt = Math.min(1, Math.max(0, amountRef.current));
      if (amt <= 0) return;
      const strength = Number.parseFloat(token("--ht-strength")) || 1;
      const rMax = d * 0.6 * strength * amt;
      // Red spot screen carries the image, a touch out of register; the ink
      // screen only prints the deep shadows, like a two-colour riso pull.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = token("--ht-spot");
      screen(
        w,
        h,
        d,
        rMax,
        SPOT_ANGLE,
        d * 0.22,
        -d * 0.16,
        (t) => t ** 1.4 * 0.8
      );
      ctx.globalCompositeOperation = (token("--ht-blend") ||
        "multiply") as GlobalCompositeOperation;
      ctx.fillStyle = token("--ht-ink");
      screen(w, h, d, rMax, INK_ANGLE, 0, 0, (t) =>
        Math.max(0, (t - 0.5) / 0.5)
      );
      ctx.globalCompositeOperation = "source-over";
    };
    paintRef.current = paint;

    img.onload = () => {
      loaded = true;
      paint();
    };
    img.src = src;

    const reset = () => {
      tone = null;
      paint();
    };
    const ro = new ResizeObserver(reset);
    ro.observe(box);
    const themes = new MutationObserver(paint);
    themes.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      paintRef.current = () => {};
      ro.disconnect();
      themes.disconnect();
    };
  }, [src, focusX, focusY, zoom, brightInk]);

  useEffect(() => {
    amountRef.current = amount;
    paintRef.current();
  }, [amount]);

  return (
    <div ref={boxRef} aria-hidden className="absolute inset-0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
