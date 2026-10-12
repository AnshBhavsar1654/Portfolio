"use client";

import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

// Writes the pointer position to --mx/--my; the .spotlight rule in
// globals.css draws the glow. No state, no re-render per move.
export function Spotlight({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div onPointerMove={onMove} className={cn("spotlight", className)}>
      {children}
    </div>
  );
}
