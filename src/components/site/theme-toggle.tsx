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
          className="ball absolute top-0.5 left-0.5 block h-6 w-6 transition-transform duration-(--dur-slow) ease-(--ease-out-soft)"
          style={{ transform: `translateX(${isDark ? 28 : 0}px)` }}
        >
          <Ball white={isDark} />
        </span>
      </span>
    </button>
  );
}

function Ball({ white }: { white: boolean }) {
  // The wrapper translates; the SVG spins, so the two transforms never conflict.
  return (
    <svg viewBox="0 0 24 24" className="ball-spin h-full w-full" aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="11"
        fill={white ? "#f6f4ee" : "#c42b22"}
        stroke={white ? "#cfcbc0" : "#8e1d17"}
        strokeWidth="1"
      />
      {/* seams */}
      <path
        d="M5 4c4 3 4 13 0 16"
        fill="none"
        stroke={white ? "#b9b5a8" : "#f4d9d4"}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="1.6 1.6"
      />
      <path
        d="M19 4c-4 3-4 13 0 16"
        fill="none"
        stroke={white ? "#b9b5a8" : "#f4d9d4"}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="1.6 1.6"
      />
    </svg>
  );
}
