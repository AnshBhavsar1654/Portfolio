"use client";

import { ArrowDown } from "@phosphor-icons/react/dist/ssr/ArrowDown";
import { Mountains } from "@phosphor-icons/react/dist/ssr/Mountains";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { dusk, duskTime } from "@/lib/landscape/config";
import { LandscapeControls } from "./landscape-controls";
import { LandscapeCanvas } from "./landscape-canvas";
import styles from "./mountain-scenery.module.css";

function scrollBlend(value: number) {
  const t = Math.max(0, Math.min(1, (0.92 - value) / 0.6));
  return t * t * (3 - 2 * t);
}

export function MountainScenery({
  hero,
  children,
}: {
  hero: ReactNode;
  children: ReactNode;
}) {
  const [navSlot, setNavSlot] = useState<HTMLElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState(duskTime);
  const [distance, setDistance] = useState(dusk.distance);
  const panelId = useId();
  const scene = useRef<HTMLDivElement>(null);
  const heroRegion = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      setNavSlot(document.getElementById("scenery-nav-slot"))
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const stage = scene.current;
    const hero = heroRegion.current;
    if (!stage || !hero) return;
    let frame: number | undefined;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const viewport = window.visualViewport;
    const update = () => {
      frame = undefined;
      const progress = scrollBlend(
        hero.getBoundingClientRect().bottom / (viewport?.height ?? innerHeight)
      );
      const wash = motion.matches ? Number(progress >= 0.5) : progress;
      stage.style.setProperty("--scenery-wash", String(wash));
      stage.toggleAttribute("data-blurred", wash === 1);
    };
    const schedule = () => {
      frame ??= requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(hero);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    viewport?.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      viewport?.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <>
      <div ref={scene} className={styles.stage} aria-hidden="true">
        <LandscapeCanvas time={time} distance={distance} paused={paused} />
        <div className={styles.scrim} />
        <div className={styles.wash} />
      </div>
      <div ref={heroRegion} className={styles.hero}>
        {hero}
        <div className={styles.tools}>
          <a href="#about" className={styles.explore}>
            <ArrowDown aria-hidden />
            Scroll to explore
          </a>
        </div>
      </div>
      {navSlot &&
        createPortal(
          process.env.NODE_ENV === "development" ? (
            <>
              <button
                type="button"
                popoverTarget={panelId}
                className={styles.sceneryIcon}
                aria-label="Open landscape playground"
                title="Open landscape playground"
              >
                <Mountains aria-hidden />
              </button>
              <div
                id={panelId}
                popover="auto"
                className={styles.sceneryPopover}
                role="region"
                aria-label="Landscape settings"
                data-lenis-prevent
              >
                <LandscapeControls
                  {...{ time, setTime, distance, setDistance }}
                />
              </div>
            </>
          ) : (
            <button
              className={styles.sceneryIcon}
              type="button"
              data-motion-toggle
              aria-pressed={paused}
              aria-label="Pause scenery motion"
              title={paused ? "Resume scenery motion" : "Pause scenery motion"}
              onClick={() => setPaused((value) => !value)}
            >
              <Mountains aria-hidden />
            </button>
          ),
          navSlot
        )}
      <div data-folio-appearance="dark">{children}</div>
    </>
  );
}
