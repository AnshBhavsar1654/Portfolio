"use client";

import { useEffect, useRef } from "react";
import { dusk, duskTime } from "@/lib/landscape/config";
import styles from "./mountain-scenery.module.css";

export function LandscapeCanvas({
  time = duskTime,
  distance = dusk.distance,
  paused = false,
}: {
  time?: number;
  distance?: number;
  paused?: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const settings = useRef({ time, distance, paused });

  useEffect(() => {
    settings.current = { time, distance, paused };
  }, [time, distance, paused]);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    delete element.dataset.ready;
    delete element.dataset.fallback;
    const showFallback = () => {
      if (disposed) return;
      delete element.dataset.ready;
      element.dataset.fallback = "";
    };

    import("@/lib/landscape/render")
      .then(({ mountLandscape }) => {
        if (disposed) return;
        try {
          cleanup = mountLandscape(
            element,
            () => settings.current,
            () => Boolean(element.closest("[data-blurred]")),
            showFallback
          );
          element.dataset.ready = "";
        } catch (error) {
          showFallback();
          if (process.env.NODE_ENV === "development")
            console.warn("Landscape fallback", error);
        }
      })
      .catch(showFallback);

    const restore = () => {
      delete element.dataset.fallback;
      element.dataset.ready = "";
    };
    element.addEventListener("webglcontextrestored", restore);
    return () => {
      disposed = true;
      cleanup?.();
      element.removeEventListener("webglcontextrestored", restore);
    };
  }, []);

  return (
    <div className={styles.sceneCanvas} aria-hidden="true">
      <canvas ref={canvas} />
      <svg
        viewBox="0 0 960 580"
        preserveAspectRatio="xMidYMid slice"
        className={styles.fallback}
      >
        <path
          className={styles.farRidge}
          d="M0 338L85 309 151 323 228 278 301 304 369 250 392 263 433 220 472 241 505 212 562 228 611 174 637 190 683 132 708 167 734 156 770 215 802 191 847 225 892 198 960 239V580H0Z"
        />
        <path
          className={styles.nearRidge}
          d="M0 359L83 341 168 363 271 391 339 379 454 405 517 369 591 343 650 335 737 363 811 328 923 343 960 328V580H0Z"
        />
        <path
          className={styles.frontRidge}
          d="M0 416L112 438 225 483 342 506 422 494 541 521 652 489 737 472 809 435 893 425 960 409V580H0Z"
        />
      </svg>
    </div>
  );
}
