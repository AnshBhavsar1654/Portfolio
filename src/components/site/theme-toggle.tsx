"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

// The theme lives on <html data-theme>, set before paint by ThemeScript.
// useSyncExternalStore renders the null server snapshot during hydration
// (neutral track, same size, no layout shift) and then switches to the real
// value, so server and client markup always agree.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

const getServerSnapshot = (): Theme | null => null;

function tokenMs(name: string): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const value = Number.parseFloat(raw) || 0;
  return raw.endsWith("ms") ? value : value * 1000;
}

function tokenNum(name: string, fallback: number): number {
  const parsed = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(name)
  );
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

// One stitch cycle covers DASH_PERIOD user units; each run covers a whole
// number of them (matching strokeDasharray "1 1.3" in the SVG), so changing
// pace by restarting the crawl never pops the dash pattern.
const DASH_PERIOD = 2.3;
const CRAWL_CYCLES = 10;

// The ball's rotation: the seam band stays parked and the stitch rows crawl
// along it like a rolling tread. Runs at the idle pace, or the boosted pace
// while a slide is in flight.
function startCrawl(
  host: HTMLSpanElement | null,
  pace: "idle" | "boost"
): Animation[] {
  const paths = host?.querySelectorAll<SVGPathElement>(".ball-stitch");
  const idleMs = tokenMs("--dur-crawl");
  if (!paths || idleMs <= 0) return [];
  const duration =
    pace === "idle"
      ? idleMs
      : Math.round(idleMs / tokenNum("--crawl-boost", 1));
  const animations: Animation[] = [];
  for (const path of paths) {
    animations.push(
      path.animate(
        [
          { strokeDashoffset: `${DASH_PERIOD * CRAWL_CYCLES}px` },
          { strokeDashoffset: "0px" },
        ],
        { duration, iterations: Infinity, easing: "linear" }
      )
    );
  }
  return animations;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ball = useRef<HTMLSpanElement>(null);
  const crawl = useRef<Animation[]>([]);
  const boosting = useRef(false);
  const settle = useRef(0);

  useEffect(() => {
    // Enable colour transitions only after first paint.
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document.documentElement.classList.add("theme-ready")
      )
    );
    return () => window.clearTimeout(settle.current);
  }, []);

  // The keyed hop span remounts on every flip, which recreates the stitch
  // paths, so each flip re-anchors the crawl at the current pace — boosted
  // if a slide is still in flight, idle otherwise.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    crawl.current = startCrawl(
      ball.current,
      boosting.current ? "boost" : "idle"
    );
    return () => {
      for (const animation of crawl.current) animation.cancel();
      crawl.current = [];
    };
  }, [theme]);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private-mode storage may throw; theme still applies for this visit.
    }
    // Fast while the slide runs (--dur-roll), then settle back to the idle
    // crawl. Changing pace by restart is seamless at whole dash periods.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.clearTimeout(settle.current);
    boosting.current = true;
    settle.current = window.setTimeout(() => {
      boosting.current = false;
      for (const animation of crawl.current) animation.cancel();
      crawl.current = startCrawl(ball.current, "idle");
    }, tokenMs("--dur-roll"));
  };

  const isDark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      onClick={toggle}
      suppressHydrationWarning
      className="group relative inline-flex h-11 w-17 items-center justify-center"
    >
      <span className="border-line bg-surface-2 relative block h-7 w-14 rounded-full border">
        <span
          className="ball-travel absolute top-0.5 left-0.5 block h-6 w-6"
          style={{ transform: `translateX(${isDark ? 28 : 0}px)` }}
        >
          {/* Tilt parks the seam ~30° off north-south (see --seam-tilt). The
              seam never leaves that angle; only its stitches crawl along it. */}
          <span ref={ball} className="ball-tilt block h-full w-full">
            {/* Remounts on each flip so the hop restarts; the crawl re-anchors
                itself on the fresh paths right after (see the theme effect). */}
            <span key={String(isDark)} className="ball-hop block h-full w-full">
              <Ball />
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}

// Tokens recolour the ball with the theme and the tilt span handles the seam
// angle, so this SVG only draws. The stitch rows carry the motion: they crawl
// along the stationary seam band (see startCrawl), while the solid seam line
// and the lighting stay put.
function Ball() {
  return (
    <svg viewBox="0 0 24 24" className="ball-roll h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="ball-shade" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.32" />
        </radialGradient>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="var(--ball-fill)"
        stroke="var(--ball-stroke)"
        strokeWidth="1"
      />
      {/* Raised seam: a band across the middle with stitching on both sides. */}
      <path
        d="M1.5 12h21"
        stroke="var(--ball-stroke)"
        strokeOpacity="0.55"
        strokeWidth="1.1"
      />
      <path
        className="ball-stitch"
        d="M2.2 9.6c6 1.4 13.6 1.4 19.6 0"
        fill="none"
        stroke="var(--ball-seam)"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeDasharray="1 1.3"
      />
      <path
        className="ball-stitch"
        d="M2.2 14.4c6-1.4 13.6-1.4 19.6 0"
        fill="none"
        stroke="var(--ball-seam)"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeDasharray="1 1.3"
      />
      {/* Light: soft highlight top-left, shadowed rim bottom-right. */}
      <circle cx="12" cy="12" r="11" fill="url(#ball-shade)" />
    </svg>
  );
}
