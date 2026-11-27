"use client";

import Link from "next/link";
import { useState } from "react";
import { LandscapeCanvas } from "@/components/home/landscape-canvas";
import { LandscapeControls } from "@/components/home/landscape-controls";
import { dusk, duskTime } from "@/lib/landscape/config";

export function LandscapePlayground() {
  const [time, setTime] = useState(duskTime);
  const [distance, setDistance] = useState(dusk.distance);

  return (
    <div className="bg-bg text-strong fixed inset-0 z-60">
      <LandscapeCanvas time={time} distance={distance} />
      <div className="bg-surface absolute inset-x-(--space-4) top-(--space-4) max-w-sm space-y-4 rounded-(--radius-nav) p-4 text-sm">
        <Link
          href="/"
          className="text-muted inline-flex min-h-(--hit-min) items-center"
        >
          Back to portfolio
        </Link>
        <LandscapeControls {...{ time, setTime, distance, setDistance }} />
      </div>
    </div>
  );
}
