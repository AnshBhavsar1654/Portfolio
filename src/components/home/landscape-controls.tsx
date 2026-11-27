"use client";

import { useId } from "react";
import { cameraRange, cycleMinutes } from "@/lib/landscape/config";

function formatTime(time: number) {
  const minutes = (time + cycleMinutes / 2) % cycleMinutes;
  return [Math.floor(minutes / 60), minutes % 60]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

export function LandscapeControls({
  time,
  setTime,
  distance,
  setDistance,
}: {
  time: number;
  setTime: (time: number) => void;
  distance: number;
  setDistance: (distance: number) => void;
}) {
  const timeId = useId();
  const cameraId = useId();
  const timeLabel = formatTime(time);

  return (
    <>
      <div className="grid gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={timeId} className="font-medium">
            Time of day
          </label>
          <output htmlFor={timeId} className="text-muted tabular-nums">
            {timeLabel}
          </output>
        </div>
        <input
          className="accent-accent w-full"
          id={timeId}
          type="range"
          min={0}
          max={cycleMinutes}
          step={5}
          value={time}
          aria-valuetext={timeLabel}
          onChange={(event) => setTime(event.currentTarget.valueAsNumber)}
        />
        <div
          className="text-muted flex justify-between text-xs"
          aria-hidden="true"
        >
          <span>Day</span>
          <span>Night</span>
          <span>Day</span>
        </div>
      </div>
      <div className="grid gap-1">
        <label htmlFor={cameraId} className="font-medium">
          Camera
        </label>
        <input
          className="accent-accent w-full"
          id={cameraId}
          type="range"
          min={cameraRange.close}
          max={cameraRange.wide}
          step={0.5}
          value={cameraRange.wide + cameraRange.close - distance}
          aria-valuetext={
            distance === cameraRange.wide
              ? "Wide"
              : distance === cameraRange.close
                ? "Close"
                : `${Math.round(((cameraRange.wide - distance) / (cameraRange.wide - cameraRange.close)) * 100)}% toward close`
          }
          onChange={(event) =>
            setDistance(
              cameraRange.wide +
                cameraRange.close -
                event.currentTarget.valueAsNumber
            )
          }
        />
        <div
          className="text-muted flex justify-between text-xs"
          aria-hidden="true"
        >
          <span>Wide</span>
          <span>Close</span>
        </div>
      </div>
    </>
  );
}
