"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  BAR_GROW_SECONDS,
  BAR_STAGGER_SECONDS,
  CAMERA_INTRO_SECONDS,
  ORBIT_FRICTION,
} from "@/components/site/motion-tokens";
import type { ContributionDay } from "@/lib/github-contributions";

// Isometric bar city of a year of daily counts, drawn on one canvas with a
// tiny orthographic projection (no 3D library). Each day is a box: height
// follows the day's count, colour follows its level token (--contrib-*),
// faces are shaded so the light reads from the top-left. Bars rise as a
// wave from the oldest week while the camera swings in; drag to orbit
// (with inertia), double-click or press 0 to reset, arrows nudge the view.
// Hovering a bar shows its count. Reduced motion: final state, no swing.

type Bar = {
  w: number; // week column
  d: number; // weekday row, 0 = Sunday
  day: ContributionDay;
  h: number; // target height in world units
};

type View = { yaw: number; pitch: number };

const STEP = 1.22; // centre-to-centre distance between bars
const HALF = 0.5; // half a bar's footprint
const MAX_H = 11; // height of the busiest day
const MIN_H = 0.14; // slab for a quiet day
const REST: View = { yaw: 0.36, pitch: 0.56 };
const INTRO_FROM: View = { yaw: -0.1, pitch: 0.9 };
const YAW: [number, number] = [-0.6, 0.9];
const PITCH: [number, number] = [0.25, 1.1];
const FRAMING_EASE = 0.18; // per-frame share of the way to the new framing
const DRAG_SPEED = 0.006; // radians per pixel
const KEY_STEP = 0.08;
const LABEL_GAP = 1.5; // month labels sit this far in front of the grid
const PAD = 8; // px kept clear around the drawing

// Face shading: share of black mixed into the level colour.
const SHADE_FRONT = 0.24;
const SHADE_SIDE = 0.42;
const HOVER_LIFT = 0.28; // share of white mixed in under the pointer

const clamp = (v: number, [lo, hi]: [number, number]) =>
  Math.min(hi, Math.max(lo, v));

// Overshooting ease so each bar lands with a small bounce.
function easeOutBack(t: number) {
  const c = 1.5;
  return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function parseColor(value: string): [number, number, number] {
  const v = value.trim();
  if (v.startsWith("#")) {
    const hex =
      v.length === 4
        ? v
            .slice(1)
            .split("")
            .map((c) => c + c)
            .join("")
        : v.slice(1, 7);
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [
      number,
      number,
      number,
    ];
  }
  const m = v.match(/[\d.]+/g);
  return m ? [Number(m[0]), Number(m[1]), Number(m[2])] : [128, 128, 128];
}

function mix([r, g, b]: [number, number, number], toward: number, k: number) {
  const f = (c: number) => Math.round(c + (toward - c) * k);
  return `rgb(${f(r)} ${f(g)} ${f(b)})`;
}

type Palette = {
  top: string[];
  front: string[];
  side: string[];
  hover: string[];
  label: string;
  plate: string;
  font: string;
};

function readPalette(el: HTMLElement): Palette {
  const css = getComputedStyle(document.documentElement);
  const base = [0, 1, 2, 3, 4].map((i) =>
    parseColor(css.getPropertyValue(`--contrib-${i}`))
  );
  return {
    top: base.map((c) => mix(c, 255, 0.04)),
    front: base.map((c) => mix(c, 0, SHADE_FRONT)),
    side: base.map((c) => mix(c, 0, SHADE_SIDE)),
    hover: base.map((c) => mix(c, 255, HOVER_LIFT)),
    label: css.getPropertyValue("--text-muted").trim(),
    plate: css.getPropertyValue("--line").trim(),
    font: getComputedStyle(el).fontFamily,
  };
}

function utcDay(iso: string) {
  return new Date(`${iso}T00:00:00Z`);
}

function buildBars(days: ContributionDay[]): { bars: Bar[]; weeks: number } {
  const max = Math.max(1, ...days.map((d) => d.count));
  const offset = utcDay(days[0].date).getUTCDay();
  const bars = days.map((day, i) => {
    const slot = i + offset;
    // Square-root scale keeps one huge day from flattening the rest.
    const h =
      day.count > 0 ? MIN_H + Math.sqrt(day.count / max) * MAX_H : MIN_H;
    return { w: Math.floor(slot / 7), d: slot % 7, day, h };
  });
  return { bars, weeks: Math.floor((days.length - 1 + offset) / 7) + 1 };
}

function monthMarks(bars: Bar[]) {
  return bars
    .filter((b) => utcDay(b.day.date).getUTCDate() === 1)
    .map((b) => ({
      w: b.w,
      label: utcDay(b.day.date).toLocaleString("en", {
        month: "short",
        timeZone: "UTC",
      }),
    }));
}

type Point = [number, number];

function inside([x, y]: Point, poly: Point[]) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      hit = !hit;
  }
  return hit;
}

export function Contribution3D({
  days,
  unit,
  dayUnit,
  label,
}: {
  days: ContributionDay[];
  unit: string;
  dayUnit: string;
  label: string;
}) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(
    null
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { bars, weeks } = buildBars(days);
    const marks = monthMarks(bars);
    const midW = (weeks - 1) / 2;
    const midD = 3;
    const toX = (w: number) => (w - midW) * STEP;
    const toZ = (d: number) => (d - midD) * STEP;
    const extentX = midW * STEP + HALF;
    const extentZ = midD * STEP + HALF;

    const palette = readPalette(canvas);
    let width = 0;
    let height = 0;
    let scale = 1;
    let originX = 0;
    let originY = 0;

    const view: View = reduce ? { ...REST } : { ...INTRO_FROM };
    const velocity = { yaw: 0, pitch: 0 };
    let start = -1; // intro clock; -1 until the chart is on screen
    let introDone = false; // any interaction jumps straight to the end
    let resetFrom: View | null = null;
    let resetStart = 0;
    let dragging = false;
    let hovered = -1;
    let frame = 0;
    let hits: { i: number; polys: Point[][] }[] = [];

    // Unscaled projection for a given view: x across, y up, z toward you.
    const project = (v: View, x: number, y: number, z: number) => {
      const cy = Math.cos(v.yaw);
      const sy = Math.sin(v.yaw);
      const xr = x * cy - z * sy;
      const zr = x * sy + z * cy;
      return [xr, zr * Math.sin(v.pitch) - y * Math.cos(v.pitch), zr] as const;
    };

    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      framed = false;
    };

    // Auto-framing: the scale and centre that fit the year's bounding box
    // at the current angle, so the chart fills the canvas from any view.
    const corners: [number, number, number][] = [];
    for (const x of [-extentX, extentX])
      for (const z of [-extentZ, extentZ + LABEL_GAP])
        for (const y of [0, MAX_H + MIN_H]) corners.push([x, y, z]);
    const framing = (v: View) => {
      const pts = corners.map(([x, y, z]) => project(v, x, y, z));
      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      const [minX, maxX] = [Math.min(...xs), Math.max(...xs)];
      const [minY, maxY] = [Math.min(...ys), Math.max(...ys)];
      const s = Math.min(
        (width - PAD * 2) / (maxX - minX),
        (height - PAD * 2) / (maxY - minY)
      );
      return {
        scale: s,
        x: width / 2 - ((minX + maxX) / 2) * s,
        y: height / 2 - ((minY + maxY) / 2) * s,
      };
    };
    let framed = false;

    const draw = (now: number) => {
      frame = 0;
      let busy = false;
      const t = introDone ? Infinity : start < 0 ? 0 : (now - start) / 1000;

      // Camera: intro swing, then reset tween, then inertia.
      if (!reduce && start >= 0 && t < CAMERA_INTRO_SECONDS && !dragging) {
        const k = easeOutCubic(t / CAMERA_INTRO_SECONDS);
        view.yaw = INTRO_FROM.yaw + (REST.yaw - INTRO_FROM.yaw) * k;
        view.pitch = INTRO_FROM.pitch + (REST.pitch - INTRO_FROM.pitch) * k;
        busy = true;
      } else if (resetFrom) {
        const k = reduce
          ? 1
          : Math.min(1, (now - resetStart) / (CAMERA_INTRO_SECONDS * 500));
        const e = easeOutCubic(k);
        view.yaw = resetFrom.yaw + (REST.yaw - resetFrom.yaw) * e;
        view.pitch = resetFrom.pitch + (REST.pitch - resetFrom.pitch) * e;
        if (k >= 1) resetFrom = null;
        else busy = true;
      } else if (!dragging && (velocity.yaw || velocity.pitch)) {
        view.yaw = clamp(view.yaw + velocity.yaw, YAW);
        view.pitch = clamp(view.pitch + velocity.pitch, PITCH);
        velocity.yaw *= ORBIT_FRICTION;
        velocity.pitch *= ORBIT_FRICTION;
        if (Math.abs(velocity.yaw) + Math.abs(velocity.pitch) < 1e-4) {
          velocity.yaw = 0;
          velocity.pitch = 0;
        } else busy = true;
      }

      // Ease the framing toward the current angle (snap on first frame).
      const target = framing(view);
      const k = !framed || reduce ? 1 : FRAMING_EASE;
      scale += (target.scale - scale) * k;
      originX += (target.x - originX) * k;
      originY += (target.y - originY) * k;
      framed = true;
      if (Math.abs(target.scale - scale) > 0.01 * target.scale) busy = true;

      const cy = Math.cos(view.yaw);
      const sy = Math.sin(view.yaw);
      const cp = Math.cos(view.pitch);
      const sp = Math.sin(view.pitch);
      const P = (x: number, y: number, z: number): Point => {
        const xr = x * cy - z * sy;
        const zr = x * sy + z * cy;
        return [originX + xr * scale, originY + (zr * sp - y * cp) * scale];
      };

      ctx.clearRect(0, 0, width, height);

      // Ground plate under the whole year.
      const g = HALF * 0.6;
      ctx.beginPath();
      [
        P(-extentX - g, 0, -extentZ - g),
        P(extentX + g, 0, -extentZ - g),
        P(extentX + g, 0, extentZ + g),
        P(-extentX - g, 0, extentZ + g),
      ].forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fillStyle = palette.plate;
      ctx.fill();

      // Painter's order: farthest bar first.
      const order = bars
        .map((b, i) => ({ i, depth: toX(b.w) * sy + toZ(b.d) * cy }))
        .sort((a, b) => a.depth - b.depth);

      const showPlusX = sy > 0;
      const nextHits: typeof hits = [];
      for (const { i } of order) {
        const b = bars[i];
        let grow = 1;
        if (!reduce) {
          const local =
            (t - (b.w + b.d * 0.5) * BAR_STAGGER_SECONDS) / BAR_GROW_SECONDS;
          grow = local <= 0 ? 0 : local >= 1 ? 1 : easeOutBack(local);
          if (local < 1) busy = true;
        }
        const h = Math.max(0.02, b.h * grow);
        const x0 = toX(b.w) - HALF;
        const x1 = toX(b.w) + HALF;
        const z0 = toZ(b.d) - HALF;
        const z1 = toZ(b.d) + HALF;
        const lvl = b.day.level;
        const hot = i === hovered;

        const front: Point[] = [
          P(x0, 0, z1),
          P(x1, 0, z1),
          P(x1, h, z1),
          P(x0, h, z1),
        ];
        const sx = showPlusX ? x1 : x0;
        const side: Point[] = [
          P(sx, 0, z0),
          P(sx, 0, z1),
          P(sx, h, z1),
          P(sx, h, z0),
        ];
        const top: Point[] = [
          P(x0, h, z0),
          P(x1, h, z0),
          P(x1, h, z1),
          P(x0, h, z1),
        ];

        const face = (poly: Point[], fill: string) => {
          ctx.beginPath();
          poly.forEach(([x, y], k) =>
            k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
          );
          ctx.closePath();
          ctx.fillStyle = fill;
          ctx.strokeStyle = fill; // hairline in the same colour hides seams
          ctx.lineWidth = 0.6;
          ctx.fill();
          ctx.stroke();
        };
        face(side, hot ? palette.hover[lvl] : palette.side[lvl]);
        face(front, hot ? palette.hover[lvl] : palette.front[lvl]);
        face(top, hot ? palette.hover[lvl] : palette.top[lvl]);
        nextHits.push({ i, polys: [top, front, side] });
      }
      hits = nextHits;

      // Month labels along the front edge, fading in after the bars rise.
      const labelAlpha = reduce
        ? 1
        : Math.min(1, Math.max(0, (t - weeks * BAR_STAGGER_SECONDS) / 0.4));
      if (labelAlpha > 0) {
        ctx.globalAlpha = labelAlpha;
        ctx.fillStyle = palette.label;
        ctx.font = `10px ${palette.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        for (const m of marks) {
          const [x, y] = P(toX(m.w), 0, extentZ + LABEL_GAP);
          ctx.fillText(m.label, x, y);
        }
        ctx.globalAlpha = 1;
        if (labelAlpha < 1) busy = true;
      }

      if (busy) frame = requestAnimationFrame(draw);
    };

    const invalidate = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    fit();
    invalidate();

    // Start the intro only once the chart is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && start < 0) {
          start = performance.now();
          invalidate();
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      fit();
      invalidate();
    });
    ro.observe(canvas);

    let last: Point = [0, 0];
    let touch = false;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault(); // no text selection while orbiting
      dragging = true;
      touch = e.pointerType === "touch";
      resetFrom = null;
      introDone = true;
      velocity.yaw = 0;
      velocity.pitch = 0;
      last = [e.clientX, e.clientY];
      canvas.setPointerCapture(e.pointerId);
      setTip(null);
    };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (dragging) {
        const dx = (e.clientX - last[0]) * DRAG_SPEED;
        const dy = touch ? 0 : (e.clientY - last[1]) * DRAG_SPEED;
        last = [e.clientX, e.clientY];
        view.yaw = clamp(view.yaw + dx, YAW);
        view.pitch = clamp(view.pitch + dy, PITCH);
        velocity.yaw = reduce ? 0 : dx;
        velocity.pitch = reduce ? 0 : dy;
        invalidate();
        return;
      }
      const p: Point = [e.clientX - rect.left, e.clientY - rect.top];
      let found = -1;
      for (let k = hits.length - 1; k >= 0; k -= 1) {
        if (hits[k].polys.some((poly) => inside(p, poly))) {
          found = hits[k].i;
          break;
        }
      }
      if (found !== hovered) {
        hovered = found;
        invalidate();
      }
      if (found < 0) {
        setTip(null);
        return;
      }
      const { day } = bars[found];
      setTip({
        x: p[0],
        y: p[1],
        text: `${day.count} ${day.count === 1 ? dayUnit : unit} on ${utcDay(
          day.date
        ).toLocaleDateString("en", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })}`,
      });
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (canvas.hasPointerCapture(e.pointerId))
        canvas.releasePointerCapture(e.pointerId);
      invalidate();
    };
    const onLeave = () => {
      if (dragging) return;
      hovered = -1;
      setTip(null);
      invalidate();
    };
    const reset = () => {
      introDone = true;
      velocity.yaw = 0;
      velocity.pitch = 0;
      resetFrom = { ...view };
      resetStart = performance.now();
      invalidate();
    };
    const onKey = (e: KeyboardEvent) => {
      const nudge: Record<string, [number, number]> = {
        ArrowLeft: [-KEY_STEP, 0],
        ArrowRight: [KEY_STEP, 0],
        ArrowUp: [0, -KEY_STEP],
        ArrowDown: [0, KEY_STEP],
      };
      if (e.key === "0" || e.key === "Home") {
        e.preventDefault();
        reset();
        return;
      }
      const n = nudge[e.key];
      if (!n) return;
      e.preventDefault();
      introDone = true;
      resetFrom = null;
      view.yaw = clamp(view.yaw + n[0], YAW);
      view.pitch = clamp(view.pitch + n[1], PITCH);
      invalidate();
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("dblclick", reset);
    canvas.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("dblclick", reset);
      canvas.removeEventListener("keydown", onKey);
    };
  }, [days, unit, dayUnit, reduce]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`${label}. Drag or use arrow keys to orbit, 0 to reset.`}
        tabIndex={0}
        className="block aspect-2/1 min-h-44 w-full cursor-grab touch-pan-y font-mono select-none active:cursor-grabbing"
      />
      {tip ? (
        <p
          aria-hidden
          className="glass border-line text-strong pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+0.75rem)] border px-2.5 py-1.5 font-mono text-[11px] whitespace-nowrap shadow-sm"
          style={{ left: tip.x, top: tip.y }}
        >
          {tip.text}
        </p>
      ) : null}
    </div>
  );
}
