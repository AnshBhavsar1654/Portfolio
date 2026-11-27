"use client";

import { ArrowDown } from "@phosphor-icons/react/dist/ssr/ArrowDown";
import { Mountains } from "@phosphor-icons/react/dist/ssr/Mountains";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  createMountainScene,
  CLOUD_HEIGHT,
  CLOUD_WIDTH,
  READING_HEIGHT,
  READING_WIDTH,
  SCENE_HEIGHT,
  SCENE_WIDTH,
} from "@/lib/mountain-scene";
import styles from "./mountain-scenery.module.css";

const PRESETS = [
  { label: "Dawn", minutes: 390 },
  { label: "Day", minutes: 750 },
  { label: "Sunset", minutes: 1115 },
  { label: "Night", minutes: 1350 },
];
const SUNSET = PRESETS[2].minutes;
const APPEARANCES = [
  { value: "dark", label: "Folio dark" },
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
  { value: "scene", label: "Follow scene" },
] as const;
type Appearance = (typeof APPEARANCES)[number]["value"];

function clock(minutes: number) {
  return [Math.floor(minutes / 60), minutes % 60]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

function scrollBlend(value: number, from: number, to: number) {
  const t = Math.max(0, Math.min(1, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

export function MountainScenery({
  hero,
  children,
}: {
  hero: ReactNode;
  children: ReactNode;
}) {
  const [minutes, setMinutes] = useState(SUNSET);
  const [appearance, setAppearance] = useState<Appearance>("dark");
  const [systemLight, setSystemLight] = useState(false);
  const [paused, setPaused] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const clouds = useRef<HTMLCanvasElement>(null);
  const reading = useRef<HTMLCanvasElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const heroRegion = useRef<HTMLDivElement>(null);
  const renderFrame = useRef<ReturnType<typeof createMountainScene>>(undefined);
  const timeId = useId();
  const appearanceId = useId();
  const light =
    appearance === "light" ||
    (appearance === "system" && systemLight) ||
    (appearance === "scene" && minutes >= 435 && minutes < 1110);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const sync = () => setSystemLight(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!canvas.current || !clouds.current || !reading.current) return;
    renderFrame.current = createMountainScene(
      canvas.current,
      clouds.current,
      reading.current
    );
    return () => {
      renderFrame.current = undefined;
    };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!renderFrame.current || !scene.current || !canvas.current) return;
      renderFrame.current(minutes);
      canvas.current.dataset.ready = "";
      scene.current.dataset.ready = "";
    });
    return () => cancelAnimationFrame(frame);
  }, [minutes]);

  useEffect(() => {
    const stage = scene.current;
    const hero = heroRegion.current;
    if (!stage || !hero) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const viewport = window.visualViewport;
    let frame: number | undefined;
    const update = () => {
      frame = undefined;
      const height = viewport?.height ?? window.innerHeight;
      const heroBottom = hero.getBoundingClientRect().bottom / height;
      const blur = scrollBlend(heroBottom, 0.92, 0.32);
      const wash = motion.matches ? Number(blur >= 0.5) : blur;
      stage.style.setProperty("--scenery-wash", String(wash));
      stage.toggleAttribute("data-blurred", wash === 1);
    };
    const schedule = () => {
      frame ??= requestAnimationFrame(update);
    };
    const size = new ResizeObserver(schedule);
    size.observe(hero);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    viewport?.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      size.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      viewport?.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  const time = clock(minutes);
  return (
    <>
      <div
        ref={scene}
        className={styles.stage}
        data-scenery-light={light || undefined}
        data-paused={paused || undefined}
        aria-hidden="true"
      >
        <div className={styles.landscape}>
          <div className={styles.sharp}>
            <canvas ref={canvas} width={SCENE_WIDTH} height={SCENE_HEIGHT} />
            <canvas
              className={styles.clouds}
              ref={clouds}
              width={CLOUD_WIDTH}
              height={CLOUD_HEIGHT}
            />
            <div className={styles.scrim} />
          </div>
          <div className={styles.reading}>
            <canvas
              ref={reading}
              width={READING_WIDTH}
              height={READING_HEIGHT}
            />
            <div className={styles.wash} />
          </div>
        </div>
      </div>

      <div ref={heroRegion} className={styles.hero}>
        {hero}
        <div className={styles.tools}>
          <a href="#about" className={styles.explore}>
            <ArrowDown aria-hidden />
            Scroll to explore
          </a>
          <details
            className={styles.controls}
            onKeyDown={(event) => {
              if (event.key !== "Escape" || !event.currentTarget.open) return;
              event.currentTarget.open = false;
              event.currentTarget.querySelector("summary")?.focus();
            }}
          >
            <summary>
              <Mountains aria-hidden />
              Scenery
            </summary>
            <div className={styles.panel}>
              <div className={styles.controlRow}>
                <label htmlFor={timeId}>Time of day</label>
                <output htmlFor={timeId}>{time}</output>
              </div>
              <input
                id={timeId}
                type="range"
                min={0}
                max={1435}
                step={5}
                value={minutes}
                aria-valuetext={time}
                onChange={(event) =>
                  setMinutes(event.currentTarget.valueAsNumber)
                }
              />
              <div
                className={styles.presets}
                role="group"
                aria-label="Scenery presets"
              >
                {PRESETS.map(({ label, minutes: preset }) => (
                  <button
                    type="button"
                    key={label}
                    aria-pressed={minutes === preset}
                    onClick={() => setMinutes(preset)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className={styles.controlRow}>
                <label htmlFor={appearanceId}>Appearance</label>
                <select
                  id={appearanceId}
                  value={appearance}
                  onChange={(event) => {
                    const selected = APPEARANCES.find(
                      ({ value }) => value === event.currentTarget.value
                    );
                    if (selected) setAppearance(selected.value);
                  }}
                >
                  {APPEARANCES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className={styles.motionToggle}
                aria-pressed={paused}
                onClick={() => setPaused(!paused)}
              >
                Pause cloud drift
              </button>
            </div>
          </details>
        </div>
      </div>
      <div data-folio-appearance={light ? "light" : "dark"}>{children}</div>
    </>
  );
}
