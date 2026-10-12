"use client";

import { useEffect, useSyncExternalStore } from "react";

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

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    // Enable colour transitions only after first paint.
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document.documentElement.classList.add("theme-ready")
      )
    );
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private-mode storage may throw; theme still applies for this visit.
    }
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
          {/* Remounts on each flip so the hop restarts; skipped on first paint. */}
          <span key={String(isDark)} className="ball-hop block h-full w-full">
            <Ball rolled={isDark} />
          </span>
        </span>
      </span>
    </button>
  );
}

// Three transforms on three elements so none fight: the outer span travels,
// the hop span bounces and squashes, the SVG rolls. Rotation is tied to the
// distance travelled (plus two extra turns for flair). Colours are tokens, so
// the ball recolours itself with the theme.
function Ball({ rolled }: { rolled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="ball-roll h-full w-full"
      style={{ transform: `rotate(${rolled ? 900 : 0}deg)` }}
      aria-hidden
    >
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
        d="M2.2 9.6c6 1.4 13.6 1.4 19.6 0M2.2 14.4c6-1.4 13.6-1.4 19.6 0"
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
