"use client";

import { CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { SquaresFourIcon } from "@phosphor-icons/react/dist/ssr/SquaresFour";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Contribution3D } from "@/components/home/contribution-3d";
import { CountUp } from "@/components/site/count-up";
import { EASE_BASE, VIEW_SWAP_SECONDS } from "@/components/site/motion-tokens";
import type { ContributionDay } from "@/lib/github-contributions";
import { cn } from "@/lib/cn";

type Mode = "grid" | "3d";

// Two views of one contribution year: the flat calendar (server-rendered,
// passed in as `grid`) and the orbitable 3D bar chart. A segmented toggle
// swaps them with a short blur crossfade while the panel eases to the new
// height. The flat grid's cells pop in as a wave the first time it scrolls
// into view (see .contrib-cell in globals.css). The headline stats sit
// above both views and count up when first seen.
export function ActivityViews({
  header,
  grid,
  caption,
  stats,
  days,
  unit,
  dayUnit,
  label,
}: {
  header: ReactNode;
  grid: ReactNode;
  caption: ReactNode;
  stats: { value: number; label: string }[];
  days: ContributionDay[];
  unit: string;
  dayUnit: string;
  label: string;
}) {
  const reduce = useReducedMotion();
  const pillId = useId();
  const [mode, setMode] = useState<Mode>("grid");
  const [play, setPlay] = useState<"idle" | "armed" | "play">("idle");
  const [height, setHeight] = useState<number | "auto">("auto");
  const bodyRef = useRef<HTMLDivElement>(null);

  // Arm the flat grid after hydration (cells hidden), play it when seen.
  useEffect(() => {
    if (reduce) return;
    const el = bodyRef.current;
    if (!el) return;
    setPlay("armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlay("play");
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  // Track whichever view is mounted so the panel eases between heights.
  // A callback ref, because with mode="wait" the incoming view mounts only
  // after the outgoing one has finished leaving.
  const measure = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const swap: Transition = reduce
    ? { duration: 0 }
    : { duration: VIEW_SWAP_SECONDS, ease: EASE_BASE };

  const options: { id: Mode; label: string; Icon: typeof CubeIcon }[] = [
    { id: "grid", label: "Calendar view", Icon: SquaresFourIcon },
    { id: "3d", label: "3D view", Icon: CubeIcon },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {header}
        <div
          role="group"
          aria-label="Chart view"
          className="border-line bg-bg/40 flex items-center gap-0.5 rounded-full border p-0.5"
        >
          {options.map(({ id, label: name, Icon }) => (
            <button
              key={id}
              type="button"
              aria-label={name}
              aria-pressed={mode === id}
              onClick={() => setMode(id)}
              className={cn(
                "relative grid size-8 place-items-center rounded-full transition-colors duration-(--dur-base)",
                mode === id ? "text-bg" : "text-muted hover:text-strong"
              )}
            >
              {mode === id ? (
                <motion.span
                  layoutId={pillId}
                  aria-hidden
                  className="bg-strong absolute inset-0 rounded-full"
                  transition={swap}
                />
              ) : null}
              <Icon aria-hidden size={16} weight="bold" className="relative" />
            </button>
          ))}
        </div>
      </div>

      <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        {stats.map((s) => (
          <div key={s.label} className="flex items-baseline gap-1.5">
            <dt className="text-muted font-mono text-[10px] tracking-(--tracking-eyebrow) uppercase">
              {s.label}
            </dt>
            <dd className="text-strong order-first text-sm font-semibold">
              <CountUp to={s.value} />
            </dd>
          </div>
        ))}
      </dl>

      <motion.div
        ref={bodyRef}
        className="mt-5 overflow-hidden"
        initial={false}
        animate={{ height }}
        transition={swap}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            ref={measure}
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={swap}
            data-armed={mode === "grid" && play !== "idle" ? "" : undefined}
            data-play={mode === "grid" && play === "play" ? "" : undefined}
          >
            {mode === "grid" ? (
              grid
            ) : (
              <div>
                <Contribution3D
                  days={days}
                  unit={unit}
                  dayUnit={dayUnit}
                  label={label}
                />
                <p className="text-muted mt-1 font-mono text-[10px] tracking-(--tracking-eyebrow) uppercase">
                  Drag to orbit · double-click to reset
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {caption}
    </>
  );
}
